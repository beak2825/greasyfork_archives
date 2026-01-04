// ==UserScript==
// @name         倒數提醒 (論文版)
// @namespace    http://tampermonkey.net/
// @version      5.1.0.07
// @description  自訂倒數提醒日期
// @match        *://*/*
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/500247/%E5%80%92%E6%95%B8%E6%8F%90%E9%86%92%20%28%E8%AB%96%E6%96%87%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/500247/%E5%80%92%E6%95%B8%E6%8F%90%E9%86%92%20%28%E8%AB%96%E6%96%87%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementById('countdown-reminder')) return;
    let clickCount = 0;
    let isDragging = false, startX, startY, startRight, startTop;

    const reminderDiv = document.createElement('div');
    reminderDiv.id = 'countdown-reminder';
    reminderDiv.style.cssText = `
        position: fixed;
        top: ${GM_getValue('reminderTop', 20)}px;
        right: ${GM_getValue('reminderRight', 20)}px;
        background: linear-gradient(135deg, #ff9a9e, #fad0c4);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        font-size: 18px;
        font-family: Arial, sans-serif;
        z-index: 9999;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        cursor: move;
        display: flex;
        align-items: center;
        user-select: none;
        transition: transform 0.2s ease-in-out;
    `;

    const countdownText = document.createElement('span');
    countdownText.style.cursor = 'pointer';
    countdownText.onclick = (e) => {
        e.stopPropagation(); // 防止與拖曳衝突
        showDatePicker();
    };
    reminderDiv.appendChild(countdownText);

    const closeButton = document.createElement('span');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
        cursor: pointer;
        margin-left: 15px;
        font-size: 24px;
        font-weight: bold;
        transition: all 0.2s ease-in-out;
    `;
    closeButton.onmouseover = () => {
        closeButton.textContent = '😠';
        closeButton.style.transform = 'scale(1.2)';
    };
    closeButton.onmouseout = () => {
        closeButton.textContent = '×';
        closeButton.style.transform = 'scale(1)';
    };
    closeButton.onclick = () => {
        clickCount++;
        reminderDiv.style.transform = 'translateX(-5px)';
        setTimeout(() => reminderDiv.style.transform = 'translateX(5px)', 100);
        setTimeout(() => reminderDiv.style.transform = 'translateX(0)', 200);

        if (clickCount > 5) showAngryFace();
    };
    reminderDiv.appendChild(closeButton);

    function showAngryFace() {
        if (document.getElementById('giant-angry-face')) return;
        const angryFace = document.createElement('div');
        angryFace.id = 'giant-angry-face';
        angryFace.textContent = '😡';
        angryFace.style.cssText = `
            position: fixed;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 900px;
            z-index: 10000;
            user-select: none;
            cursor: pointer;
        `;
        document.body.appendChild(angryFace);

        let moveDirection = 1;
        setInterval(() => {
            angryFace.style.transform = `translate(-50%, calc(-50% + ${moveDirection * 10}px))`;
            moveDirection *= -1;
        }, 200);

        angryFace.onclick = () => {
            const progress = prompt("你的論文進度如何？(請輸入數字0-100)");
            if (progress) {
                // 檢查是否為100%
                if (progress === "100") {
                    // 停止倒數計時器的自動更新
                    if (countdownInterval) {
                        clearInterval(countdownInterval);
                    }

                    showFireworks();
                    angryFace.remove();

                    // 修改倒數視窗文字
                    countdownText.textContent = "恭喜完成論文！點擊此處設定新目標";
                    reminderDiv.style.background = "linear-gradient(135deg, #43cea2, #185a9d)";

                    // 重設點擊計數，讓使用者可以正常關閉視窗
                    clickCount = 0;

                    // 修改關閉按鈕行為
                    closeButton.onmouseover = () => {
                        closeButton.textContent = '×';
                        closeButton.style.transform = 'scale(1.2)';
                    };
                    closeButton.onmouseout = () => {
                        closeButton.textContent = '×';
                        closeButton.style.transform = 'scale(1)';
                    };
                    closeButton.onclick = () => {
                        reminderDiv.remove();
                    };
                } else {
                    alert("請繼續加油！");
                    angryFace.remove();
                }
            }
        };
    }

    // 新增日期選擇器功能
    function showDatePicker() {
        if (document.getElementById('date-picker-container')) return;

        const datePickerContainer = document.createElement('div');
        datePickerContainer.id = 'date-picker-container';
        datePickerContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
        `;

        const datePickerBox = document.createElement('div');
        datePickerBox.style.cssText = `
            background: white;
            border-radius: 10px;
            padding: 20px;
            width: 320px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;

        const title = document.createElement('h2');
        title.textContent = '設定目標日期';
        title.style.cssText = `
            margin: 0;
            color: #333;
            font-size: 22px;
            text-align: center;
        `;
        datePickerBox.appendChild(title);

        // 獲取當前目標日期
        const now = new Date();
        let targetDate = new Date(GM_getValue('customTargetDate', `${now.getFullYear()}-06-03`));
        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');
        const currentDateValue = `${year}-${month}-${day}`;

        // 日期選擇輸入框
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.value = currentDateValue;
        dateInput.style.cssText = `
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 5px;
            width: 100%;
            box-sizing: border-box;
        `;
        datePickerBox.appendChild(dateInput);

        // 日期說明
        const dateDescription = document.createElement('div');
        dateDescription.style.cssText = `
            font-size: 15px;
            color: #666;
            text-align: center;
        `;
        dateDescription.textContent = '選擇你希望倒數的重要日期';
        datePickerBox.appendChild(dateDescription);

        // 按鈕容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-top: 10px;
        `;

        // 取消按鈕
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.cssText = `
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            background-color: #e0e0e0;
            color: #333;
            font-size: 16px;
            cursor: pointer;
            flex: 1;
            transition: background-color 0.2s;
        `;
        cancelButton.onmouseover = () => {
            cancelButton.style.backgroundColor = '#d0d0d0';
        };
        cancelButton.onmouseout = () => {
            cancelButton.style.backgroundColor = '#e0e0e0';
        };
        cancelButton.onclick = () => {
            datePickerContainer.remove();
        };
        buttonContainer.appendChild(cancelButton);

        // 確認按鈕
        const confirmButton = document.createElement('button');
        confirmButton.textContent = '確認';
        confirmButton.style.cssText = `
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            background-color: #ff9a9e;
            color: white;
            font-size: 16px;
            cursor: pointer;
            flex: 1;
            transition: background-color 0.2s;
        `;
        confirmButton.onmouseover = () => {
            confirmButton.style.backgroundColor = '#ff8088';
        };
        confirmButton.onmouseout = () => {
            confirmButton.style.backgroundColor = '#ff9a9e';
        };
        confirmButton.onclick = () => {
            if (dateInput.value) {
                GM_setValue('customTargetDate', dateInput.value);
                updateCountdown();
                datePickerContainer.remove();
                // 顯示一個簡短的通知
                showNotification('日期已更新！');
            }
        };
        buttonContainer.appendChild(confirmButton);

        datePickerBox.appendChild(buttonContainer);
        datePickerContainer.appendChild(datePickerBox);
        document.body.appendChild(datePickerContainer);

        // 點擊背景關閉日期選擇器
        datePickerContainer.addEventListener('click', (e) => {
            if (e.target === datePickerContainer) {
                datePickerContainer.remove();
            }
        });
    }

    // 煙火特效函數
    function showFireworks() {
        const fireworksContainer = document.createElement('div');
        fireworksContainer.id = 'fireworks-container';
        fireworksContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9998;
            pointer-events: none;
            overflow: hidden;
        `;
        document.body.appendChild(fireworksContainer);

        // 創建恭喜文字
        const congratsText = document.createElement('div');
        congratsText.textContent = '恭喜完成論文！';
        congratsText.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4em;
            font-weight: bold;
            color: #ffff00;
            text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff;
            z-index: 10001;
            opacity: 0;
            transition: opacity 1s, transform 1s;
        `;
        document.body.appendChild(congratsText);

        setTimeout(() => {
            congratsText.style.opacity = '1';
            congratsText.style.transform = 'translate(-50%, -50%) scale(1.2)';
        }, 100);

        // 產生多個煙火
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                createFirework(fireworksContainer);
            }, i * 300);
        }

        // 5秒後移除煙火容器和恭喜文字
        setTimeout(() => {
            congratsText.style.opacity = '0';
            congratsText.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                congratsText.remove();
            }, 1000);

            fireworksContainer.style.opacity = '0';
            setTimeout(() => {
                fireworksContainer.remove();
            }, 1000);
        }, 6000);
    }

    // 創建單個煙火
    function createFirework(container) {
        // 煙火發射點
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight;

        // 爆炸點
        const explodeX = startX + (Math.random() * 200 - 100);
        const explodeY = Math.random() * window.innerHeight * 0.5;

        // 煙火顏色
        const colors = [
            '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
            '#ff8800', '#ff0088', '#8800ff', '#88ff00'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        // 創建發射點
        const firework = document.createElement('div');
        firework.style.cssText = `
            position: absolute;
            width: 5px;
            height: 5px;
            background-color: ${color};
            border-radius: 50%;
            left: ${startX}px;
            top: ${startY}px;
            transform: translate(-50%, -50%);
            pointer-events: none;
            box-shadow: 0 0 6px ${color}, 0 0 12px ${color};
        `;
        container.appendChild(firework);

        // 發射動畫
        firework.animate(
            [
                { left: `${startX}px`, top: `${startY}px` },
                { left: `${explodeX}px`, top: `${explodeY}px` }
            ],
            {
                duration: 1000,
                easing: 'cubic-bezier(0.1, 0.25, 0.1, 1)'
            }
        );

        // 在發射結束後爆炸
        setTimeout(() => {
            firework.remove();
            explode(container, explodeX, explodeY, color);
        }, 1000);
    }

    // 煙火爆炸效果
    function explode(container, x, y, color) {
        const particleCount = 30 + Math.floor(Math.random() * 30);

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            const size = 2 + Math.random() * 2;

            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background-color: ${color};
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                transform: translate(-50%, -50%);
                pointer-events: none;
                box-shadow: 0 0 ${size * 2}px ${color};
            `;
            container.appendChild(particle);

            // 隨機方向運動
            const endX = x + Math.cos(angle) * speed * 50;
            const endY = y + Math.sin(angle) * speed * 50;

            const animation = particle.animate(
                [
                    {
                        left: `${x}px`,
                        top: `${y}px`,
                        opacity: 1,
                        transform: 'translate(-50%, -50%) scale(1)'
                    },
                    {
                        left: `${endX}px`,
                        top: `${endY}px`,
                        opacity: 0,
                        transform: 'translate(-50%, -50%) scale(0.1)'
                    }
                ],
                {
                    duration: 1000 + Math.random() * 1000,
                    easing: 'cubic-bezier(0, 0.5, 0.5, 1)'
                }
            );

            // 動畫結束後移除粒子
            animation.onfinish = () => {
                particle.remove();
            };
        }
    }

    // 顯示通知函數
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            z-index: 10002;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    function updateCountdown() {
        const now = new Date();
        let targetDate = new Date(GM_getValue('customTargetDate', `${now.getFullYear()}-06-03`));
        if (now > targetDate) targetDate.setFullYear(targetDate.getFullYear() + 1);
        const timeDiff = targetDate - now;

        // 計算天、時、分、秒
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        // 格式化顯示
        countdownText.textContent = `距離 ${targetDate.toLocaleDateString()} 還有 ${days} 天 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateCountdown();
    document.body.appendChild(reminderDiv);
    let countdownInterval = setInterval(updateCountdown, 1000); // 每秒更新一次，以顯示精確的秒數

    reminderDiv.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startRight = parseInt(reminderDiv.style.right, 10);
        startTop = parseInt(reminderDiv.style.top, 10);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newRight = startRight - (e.clientX - startX);
        let newTop = startTop + (e.clientY - startY);
        newTop = Math.max(0, Math.min(window.innerHeight - reminderDiv.offsetHeight, newTop));
        newRight = Math.max(0, Math.min(window.innerWidth - reminderDiv.offsetWidth, newRight));
        reminderDiv.style.right = `${newRight}px`;
        reminderDiv.style.top = `${newTop}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        GM_setValue('reminderRight', parseInt(reminderDiv.style.right, 10));
        GM_setValue('reminderTop', parseInt(reminderDiv.style.top, 10));
    });
})();