// ==UserScript==
// @name         YM Duo_KeepStreak
// @namespace    ´꒳`ⓎⒶⓂⒾⓈⒸⓇⒾⓅⓉ×͜×
// @version      v1.0.5
// @description  Automatically maintains the daily streak on Duolingo (NEW VERSION V1.0.5)
// @author       ´꒳`ⓎⒶⓂⒾⓈⒸⓇⒾⓅⓉ×͜×
// @match        https://*.duolingo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duolingo.com
// @downloadURL https://update.greasyfork.org/scripts/525768/YM%20Duo_KeepStreak.user.js
// @updateURL https://update.greasyfork.org/scripts/525768/YM%20Duo_KeepStreak.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const getToken = () => {
        const tokenRow = document.cookie.split('; ').find(row => row.startsWith('jwt_token='));
        return tokenRow ? tokenRow.split('=')[1] : null;
    };

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        } catch (e) {
            console.error("JWT parsing error", e);
            return null;
        }
    };

    const getHeaders = (token) => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "User-Agent": navigator.userAgent
    });

    const fetchUserData = async (userId, headers) => {
        try {
            const response = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=fromLanguage,learningLanguage,streakData,subscriptions`, { headers });
            if (!response.ok) throw new Error("Failed to fetch user data");
            return response.json();
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    };

    const hasStreakToday = (data) => {
        const today = new Date().toISOString().split('T')[0];
        return data?.streakData?.currentStreak?.endDate === today;
    };

    const startSession = async (fromLang, learningLang, headers) => {
        try {
            const payload = {
                challengeTypes: ["translate", "match", "tapComplete", "reverseAssist", "judge"],
                fromLanguage: fromLang,
                learningLanguage: learningLang,
                type: "GLOBAL_PRACTICE"
            };
            const response = await fetch("https://www.duolingo.com/2017-06-30/sessions", {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error("Failed to start session");
            return response.json();
        } catch (error) {
            console.error("Error starting session:", error);
            return null;
        }
    };

    const completeSession = async (session, headers) => {
        try {
            const payload = { ...session, heartsLeft: 0, failed: false, shouldLearnThings: true };
            const response = await fetch(`https://www.duolingo.com/2017-06-30/sessions/${session.id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error("Failed to complete session");
            return response.json();
        } catch (error) {
            console.error("Error completing session:", error);
            return null;
        }
    };

    const isVipUser = (userData) => {
        return userData?.subscriptions?.some(sub => sub.type === "VIP");
    };

    const createConfetti = () => {
        const confettiContainer = document.createElement("div");
        confettiContainer.className = "confetti";
        for (let i = 0; i < 100; i++) {
            const div = document.createElement("div");
            div.style.left = `${Math.random() * 100}%`;
            div.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            div.style.animationDelay = `${Math.random() * 3}s`;
            confettiContainer.appendChild(div);
        }
        document.body.appendChild(confettiContainer);
        setTimeout(() => confettiContainer.remove(), 3000);
    };

    const addConfettiStyle = () => {
        const style = document.createElement("style");
        style.innerHTML = `
            @keyframes confetti {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(100vh); opacity: 0; }
            }
            .confetti {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
            }
            .confetti div {
                position: absolute;
                width: 10px;
                height: 10px;
                opacity: 0.8;
                animation: confetti 3s infinite;
            }
        `;
        document.head.appendChild(style);
    };

    const attemptStreak = async (button) => {
        button.innerText = "⏳ Processing...";
        button.disabled = true;

        const token = getToken();
        if (!token) {
            alert("❌ Bạn chưa đăng nhập vào Duolingo!");
        } else {
            const userId = parseJwt(token)?.sub;
            if (!userId) {
                alert("❌ Không thể lấy thông tin người dùng.");
            } else {
                const headers = getHeaders(token);
                const userData = await fetchUserData(userId, headers);

                if (!userData) {
                    alert("⚠️ Không thể tải dữ liệu người dùng.");
                } else if (hasStreakToday(userData)) {
                    alert("✅ Bạn đã duy trì streak hôm nay!");
                } else {
                    if (isVipUser(userData)) {
                        alert("🌟 VIP User! Tận hưởng quyền lợi cao cấp.");
                    }

                    const session = await startSession(userData.fromLanguage, userData.learningLanguage, headers);
                    if (!session) {
                        alert("⚠️ Không thể bắt đầu phiên học.");
                    } else {
                        const completed = await completeSession(session, headers);
                        if (completed) {
                            const xpBonus = isVipUser(userData) ? 20 : 10;
                            alert(`🎉 Đã duy trì streak! Nhận được ${xpBonus} XP.`);
                            createConfetti();
                        } else {
                            alert("⚠️ Không thể hoàn thành phiên học.");
                        }
                    }
                }
            }
        }

        button.innerText = "🔥 Get Streak 🔥";
        button.disabled = false;
    };

    const createControlPanel = async () => {
        if (document.getElementById("duo-panel")) return;

        const panel = document.createElement("div");
        panel.id = "duo-panel";
        panel.style.position = "fixed";
        panel.style.bottom = "20px";
        panel.style.right = "20px";
        panel.style.background = "white";
        panel.style.border = "2px solid #58cc02";
        panel.style.borderRadius = "16px";
        panel.style.padding = "12px";
        panel.style.zIndex = "9999";
        panel.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
        panel.style.transition = "all 0.3s ease-in-out";
        panel.style.minWidth = "180px";

        const btn = document.createElement("button");
        btn.innerText = "🔥 Get Streak 🔥";
        btn.style.width = "100%";
        btn.style.padding = "10px";
        btn.style.marginBottom = "10px";
        btn.style.backgroundColor = "#58cc02";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "10px";
        btn.style.cursor = "pointer";
        btn.onclick = () => attemptStreak(btn);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "duo-auto-run";
        checkbox.checked = localStorage.getItem("duo_auto_run") === "true";
        checkbox.onchange = () => {
            localStorage.setItem("duo_auto_run", checkbox.checked);
        };

        const label = document.createElement("label");
        label.htmlFor = "duo-auto-run";
        label.style.fontSize = "14px";
        label.style.color = "#333";
        label.style.display = "flex";
        label.style.alignItems = "center";
        label.innerHTML = `<span style="margin-left: 8px;">Auto Run</span>`;
        label.prepend(checkbox);

        const toggleBtn = document.createElement("button");
        toggleBtn.innerText = "🔽";
        toggleBtn.style.position = "fixed";
        toggleBtn.style.bottom = "20px";
        toggleBtn.style.right = "220px";
        toggleBtn.style.width = "32px";
        toggleBtn.style.height = "32px";
        toggleBtn.style.borderRadius = "50%";
        toggleBtn.style.border = "none";
        toggleBtn.style.background = "#58cc02";
        toggleBtn.style.color = "white";
        toggleBtn.style.cursor = "pointer";
        toggleBtn.style.zIndex = "9999";
        toggleBtn.title = "Hiện/Ẩn Panel";

        let visible = true;
        toggleBtn.onclick = () => {
            visible = !visible;
            panel.style.display = visible ? "block" : "none";
            toggleBtn.innerText = visible ? "🔽" : "🔼";
        };

        panel.appendChild(btn);
        panel.appendChild(label);
        document.body.appendChild(panel);
        document.body.appendChild(toggleBtn);

        // Tự chạy nếu Auto Run bật và chưa có streak
        if (checkbox.checked) {
            const token = getToken();
            if (token) {
                const userId = parseJwt(token)?.sub;
                if (userId) {
                    const headers = getHeaders(token);
                    const userData = await fetchUserData(userId, headers);
                    if (userData && !hasStreakToday(userData)) {
                        setTimeout(() => attemptStreak(btn), 1000);
                    }
                }
            }
        }
    };

    window.onload = () => {
        addConfettiStyle();
        setTimeout(createControlPanel, 2000);
    };
})();
