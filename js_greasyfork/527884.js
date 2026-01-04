// ==UserScript==
// @name         Duolingo Gem Farmer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tự động thu thập gem trên Duolingo
// @author       1F1XDRAGO
// @match        https://*.duolingo.com/*
// @grant        none
// @license      MIT
// @icon         https://static.wikia.nocookie.net/duolingo/images/f/f4/Gems-chest.png.png
// @downloadURL https://update.greasyfork.org/scripts/527884/Duolingo%20Gem%20Farmer.user.js
// @updateURL https://update.greasyfork.org/scripts/527884/Duolingo%20Gem%20Farmer.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const COLORS = {
        primary: "#58CC02",
        secondary: "#1DA462",
        danger: "#FF4757",
        background: "#003049",
        text: "#FFFFFF",
    };

    const createElement = (tag, config) => {
        const el = document.createElement(tag);
        if (config) {
            if (config.styles) Object.assign(el.style, config.styles);
            if (config.content) el.innerHTML = config.content;
            if (config.events) {
                for (const [event, handler] of Object.entries(config.events)) {
                    el.addEventListener(event, handler);
                }
            }
        }
        return el;
    };

    const floater = createElement("button", {
        styles: {
            position: "fixed",
            bottom: "100px",
            right: "10px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
            color: COLORS.text,
            fontSize: "32px",
            cursor: "pointer",
            zIndex: 10000,
            boxShadow: "0 8px 20px rgba(88, 204, 2, 0.3)",
            transition: "transform 0.3s ease",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        content: "💎",
        events: {
            click: toggleMainModal,
        },
    });

    const modal = createElement("div", {
        styles: {
            display: "none",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            background: COLORS.background,
            borderRadius: "20px",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25)",
            zIndex: 10000,
            padding: "30px",
            fontFamily: "'Segoe UI', system-ui",
            color: COLORS.text,
        },
    });

    const header = createElement("div", {
        styles: {
            textAlign: "center",
            marginBottom: "25px",
        },
        content: `
            <h1 style="
                margin: 0 0 10px 0;
                font-size: 32px;
                background: linear-gradient(45deg, ${COLORS.primary}, ${COLORS.secondary});
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                font-weight: 700;
                letter-spacing: 1px;
            ">GEM FARMER PRO</h1>
            <p style="
                margin: 0;
                color: ${COLORS.text}cc;
                font-size: 14px;
            ">Made By 1F1XDRAGO</p>
        `,
    });

    const gemCounter = createElement("div", {
        styles: {
            textAlign: "center",
            margin: "30px 0",
        },
        content: `
        <div id="gemCount" style="
            font-size: 42px;
            font-weight: 700;
            color: ${COLORS.primary};
            text-shadow: 0 4px 12px rgba(88, 204, 2, 0.2);
            margin-top: 10px;
        ">0</div>
    `,
    });

    const controls = createElement("div", {
        styles: {
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            justifyContent: "center",
            margin: "25px 0",
        },
    });

    const startBtn = createElement("button", {
        styles: {
            padding: "12px 30px",
            fontSize: "16px",
            fontWeight: "600",
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
            color: COLORS.text,
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            boxShadow: "0 4px 15px rgba(88, 204, 2, 0.3)",
        },
        content: "BẮT ĐẦU",
        events: {
            click: startFarming,
            mouseenter: () => addButtonHover(startBtn, COLORS.primary),
            mouseleave: () => removeButtonHover(startBtn, COLORS.primary),
        },
    });

    const stopBtn = createElement("button", {
        styles: {
            padding: "12px 30px",
            fontSize: "16px",
            fontWeight: "600",
            background: `linear-gradient(135deg, ${COLORS.danger} 0%, #CC2E3D 100%)`,
            color: COLORS.text,
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            display: "none",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            boxShadow: "0 4px 15px rgba(255, 71, 87, 0.3)",
        },
        content: "DỪNG LẠI",
        events: {
            click: stopFarming,
            mouseenter: () => addButtonHover(stopBtn, COLORS.danger),
            mouseleave: () => removeButtonHover(stopBtn, COLORS.danger),
        },
    });

    const supportBtn = createElement("button", {
        styles: {
            padding: "12px 30px",
            fontSize: "16px",
            fontWeight: "600",
            background: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%)`,
            color: COLORS.text,
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            boxShadow: "0 4px 15px rgba(88, 204, 2, 0.3)",
        },
        content: "Hỗ Trợ ❗",
        events: {
            click: () =>
                window.open("mrtao0909@gmail.com", "_blank"),
            mouseenter: () => addButtonHover(supportBtn, COLORS.secondary),
            mouseleave: () => removeButtonHover(supportBtn, COLORS.secondary),
        },
    });

    const status = createElement("div", {
        styles: {
            textAlign: "center",
            color: `${COLORS.text}99`,
            fontSize: "14px",
        },
        content: '<span id="statusText">Chưa hoạt động</span>',
    });

    controls.append(startBtn, stopBtn, supportBtn);
    modal.append(header, gemCounter, controls, status);
    document.body.append(floater, modal);

    let isRunning = false;
    let gemsCount = parseInt(localStorage.getItem("gemsCount")) || 0;
    let interval;

    function updateGemsCount() {
        localStorage.setItem("gemsCount", gemsCount);
        document.getElementById("gemCount").textContent = gemsCount;
    }

    function toggleMainModal() {
        modal.style.display = modal.style.display === "none" ? "block" : "none";
        floater.style.transform =
            modal.style.display === "block" ? "rotate(360deg)" : "rotate(0deg)";
    }

    function addButtonHover(btn, color) {
        btn.style.transform = "translateY(-2px)";
        btn.style.boxShadow = `0 8px 25px ${color}66`;
    }

    function removeButtonHover(btn, color) {
        btn.style.transform = "translateY(0)";
        btn.style.boxShadow = `0 4px 15px ${color}4D`;
    }

    async function sendRequest() {
        try {
            const response = await fetch(
                `https://www.duolingo.com/2017-06-30/users/${getCookieValue(
                    "logged_out_uuid"
                )}/rewards/CAPSTONE_COMPLETION-6a459295_f41c_38d9_91ba_ddd5f57d014d-2-GEMS`,
                {
                    method: "PATCH",
                    headers: {
                        accept: "application/json",
                        authorization: `Bearer ${getCookieValue("jwt_token")}`,
                        "content-type": "application/json",
                        Referer: "https://www.duolingo.com/practice",
                        "user-agent": "Mozilla/5.0",
                    },
                    body: JSON.stringify({
                        amount: 0,
                        consumed: true,
                        skillId: "5f08f69597ce7cd1663401c41a5223ac",
                        type: "mission",
                    }),
                }
            );

            if (response.status === 200) {
                const processGemIncrement = (delay) => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            gemsCount++;
                            resolve();
                        }, delay);
                    });
                };

                const animateGem = () => {
                    document.getElementById("gemCount").style.animation =
                        "gemPulse 0.5s";
                    updateGemsCount();
                };

                (async () => {
                    for (let i = 1; i <= 15; i++) {
                        await processGemIncrement(i * 250);
                        animateGem();
                    }
                })();
            }
        } catch (error) {
            console.error("Lỗi request:", error);
        }
    }

    function startFarming() {
        if (!isRunning) {
            isRunning = true;
            startBtn.style.display = "none";
            stopBtn.style.display = "inline-block";
            document.getElementById("statusText").textContent =
                "Đang hoạt động";
            interval = setInterval(sendRequest, 100);
        }
    }

    function stopFarming() {
        isRunning = false;
        clearInterval(interval);
        stopBtn.style.display = "none";
        startBtn.style.display = "inline-block";
        document.getElementById("statusText").textContent = "Đã dừng";
    }

    function getCookieValue(name) {
        return document.cookie
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith(name))
            ?.split("=")[1];
    }

    const styles = document.createElement("style");
    styles.textContent = `
        @keyframes gemPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        #gemCount {
            animation: gemPulse 0.5s ease-out;
        }
        
        body > div[style*="z-index: 10000"] {
            backdrop-filter: blur(5px) !important;
        }
    `;
    document.head.appendChild(styles);

    document.getElementById("gemCount").textContent = gemsCount;
    window.onbeforeunload = () =>
        isRunning
            ? "Đang farm gems đấy bro - Bạn có chắc chắn muốn thoát?"
            : null;
})();
