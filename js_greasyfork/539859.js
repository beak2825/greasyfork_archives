// ==UserScript==
// @name       Custom Dynamic Health Bar
// @namespace    https://narrow.one/
// @version      1.0
// @description  Thanh máu tròn hiện đại, tự động reset khi vào ván mới, hiệu ứng đẹp hơn
// @author       Duck
// @run-at       document-idle
// @match        https://narrow.one/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539859/Custom%20Dynamic%20Health%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/539859/Custom%20Dynamic%20Health%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observedHealthBarPart = null;
    let healthCircleContainer = document.createElement("div");
    let healthCircle = document.createElement("div");
    let healthGlow = document.createElement("div"); // Viền phát sáng động
    let healthReflection = document.createElement("div"); // Hiệu ứng phản chiếu 3D
    let healthText = document.createElement("div");

    function updateHealthCircle() {
        if (observedHealthBarPart) {
            const currentWidth = observedHealthBarPart.style.width;
            if (currentWidth) {
                const percentage = parseFloat(currentWidth) / 100;
                healthText.textContent = (percentage * 100).toFixed(0) + "%";

                let color1, color2, glowColor;
                if (percentage > 0.7) {
                    color1 = "#00ff88"; // Xanh neon
                    color2 = "#004422";
                    glowColor = "rgba(0, 255, 136, 0.8)";
                } else if (percentage > 0.3) {
                    color1 = "#ffcc00"; // Vàng
                    color2 = "#664400";
                    glowColor = "rgba(255, 204, 0, 0.8)";
                } else {
                    color1 = "#ff0033"; // Đỏ
                    color2 = "#440000";
                    glowColor = "rgba(255, 0, 51, 1)";
                }

                // Gradient và viền phát sáng mượt mà
                healthCircle.style.background = `conic-gradient(${color1} ${percentage * 360}deg, ${color2} 0deg)`;
                healthGlow.style.boxShadow = `0px 0px 30px ${glowColor}, 0px 0px 50px ${glowColor}`;

                // Hiệu ứng phản chiếu ánh sáng
                healthReflection.style.opacity = `${0.5 + percentage * 0.5}`;
                healthReflection.style.transform = `translate(-50%, -50%) scale(${0.9 + percentage * 0.1})`;

                healthCircle.style.transition = "background 0.3s ease-in-out";
                healthGlow.style.transition = "box-shadow 0.3s ease-in-out";
                healthReflection.style.transition = "opacity 0.3s ease-in-out, transform 0.3s ease-in-out";
            }
        }
    }

    function resetHealthBar() {
        console.log("🔄 Reset thanh máu khi vào ván mới!");
        observedHealthBarPart = document.querySelector(".health-ui-bar.clip");

        if (observedHealthBarPart) {
            updateHealthCircle();
        }
    }

    const healthBarObserver = new MutationObserver(updateHealthCircle);

    function addHealthBar() {
        console.log("✅ Thanh máu đã được thêm!");

        observedHealthBarPart = document.querySelector(".health-ui-bar.clip");
        if (!observedHealthBarPart) {
            console.warn("⚠ Không tìm thấy thanh máu gốc! Đang chờ...");
            setTimeout(addHealthBar, 500);
            return;
        }

        document.body.appendChild(healthCircleContainer);
        healthBarObserver.observe(observedHealthBarPart, {
            attributes: true,
            attributeFilter: ['style']
        });

        updateHealthCircle();
    }

    function detectNewMatch() {
        const gameWrapper = document.getElementById("gameWrapper");
        if (!gameWrapper) return;

        const matchObserver = new MutationObserver(() => {
            console.log("🎮 Phát hiện vào ván mới!");
            resetHealthBar();
        });

        matchObserver.observe(gameWrapper, { childList: true, subtree: true });
    }

    function waitForGameWrapper() {
        const gameWrapper = document.getElementById("gameWrapper");
        if (gameWrapper) {
            addHealthBar();
            detectNewMatch();
        } else {
            setTimeout(waitForGameWrapper, 500);
        }
    }

    waitForGameWrapper();

    // 🎨 **CSS UI hiện đại**
    healthCircleContainer.style.position = "fixed";
    healthCircleContainer.style.bottom = "20px"; // Xuống dưới cùng màn hình
    healthCircleContainer.style.left = "50%"; // Căn giữa
    healthCircleContainer.style.transform = "translateX(-50%)"; // Giữ vị trí chính xác
    healthCircleContainer.style.width = "70px";
    healthCircleContainer.style.height = "70px";
    healthCircleContainer.style.display = "flex";
    healthCircleContainer.style.alignItems = "center";
    healthCircleContainer.style.justifyContent = "center";
    healthCircleContainer.style.borderRadius = "50%";
    healthCircleContainer.style.border = "5px solid black";
    healthCircleContainer.style.transition = "box-shadow 0.3s ease-in-out";

    healthGlow.style.position = "absolute";
    healthGlow.style.width = "75px";
    healthGlow.style.height = "75px";
    healthGlow.style.borderRadius = "50%";
    healthGlow.style.boxShadow = "0px 0px 30px rgba(0, 255, 136, 0.8), 0px 0px 50px rgba(0, 255, 136, 0.8)";
    healthGlow.style.transition = "box-shadow 0.3s ease-in-out";

    healthCircle.style.position = "absolute";
    healthCircle.style.width = "65px";
    healthCircle.style.height = "65px";
    healthCircle.style.borderRadius = "50%";
    healthCircle.style.background = "conic-gradient(#00ff88 360deg, #004422 0deg)";
    healthCircle.style.transition = "background 0.3s ease-in-out";

    healthReflection.style.position = "absolute";
    healthReflection.style.width = "50px";
    healthReflection.style.height = "25px";
    healthReflection.style.background = "rgba(255, 255, 255, 0.4)";
    healthReflection.style.borderRadius = "50%";
    healthReflection.style.top = "30%";
    healthReflection.style.left = "50%";
    healthReflection.style.transform = "translate(-50%, -50%) scale(0.9)";
    healthReflection.style.transition = "opacity 0.3s ease-in-out, transform 0.3s ease-in-out";

    healthText.style.position = "absolute";
    healthText.style.color = "white";
    healthText.style.fontSize = "12px";
    healthText.style.fontWeight = "bold";
    healthText.style.textShadow = "2px 2px 6px rgba(0, 255, 136, 0.8)";
    healthText.style.textAlign = "center";

    healthCircleContainer.appendChild(healthGlow);
    healthCircleContainer.appendChild(healthCircle);
    healthCircleContainer.appendChild(healthReflection);
    healthCircleContainer.appendChild(healthText);
    document.body.appendChild(healthCircleContainer);
})();
