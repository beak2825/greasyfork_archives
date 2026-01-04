// ==UserScript==
// @name         Agar-ar إضافة تايمر
// @version      1.0
// @description  إضافة التايمر لأقاريو العربيه
// @author       MrPotato
// @match        https://agar-ar.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agar-ar.com
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1460694
// @downloadURL https://update.greasyfork.org/scripts/533558/Agar-ar%20%D8%A5%D8%B6%D8%A7%D9%81%D8%A9%20%D8%AA%D8%A7%D9%8A%D9%85%D8%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/533558/Agar-ar%20%D8%A5%D8%B6%D8%A7%D9%81%D8%A9%20%D8%AA%D8%A7%D9%8A%D9%85%D8%B1.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const Timer = {
        started: false,
        element: null,
        interval: null,
        timeLeft: 60,
        color: "#FFFFFF",
        start() {
            if (this.started) return;
            this.started = true;

            // إنشاء عنصر التايمر
            this.element = document.createElement("div");
            this.element.style.position = "fixed";
            this.element.style.top = "10px";
            this.element.style.left = "50%";
            this.element.style.transform = "translateX(-50%)";
            this.element.style.color = this.getRandomColor();
            this.element.style.fontSize = "48px";
            this.element.style.fontWeight = "bold";
            this.element.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.6)";
            this.element.style.zIndex = "1000";
            this.element.textContent = "60";

            document.body.appendChild(this.element);

            this.timeLeft = 60;
            this.interval = setInterval(() => {
                this.timeLeft--;
                this.element.textContent = this.timeLeft.toString();

                // تغيير اللون كل ثانية
                this.element.style.color = this.getRandomColor();

                if (this.timeLeft <= 0) {
                    this.stop();
                }
            }, 1000);
        },
        stop() {
            if (!this.started) return;
            clearInterval(this.interval);
            if (this.element) {
                this.element.remove();
                this.element = null;
            }
            this.started = false;
        },
        getRandomColor() {
            const letters = "0123456789ABCDEF";
            let color = "#";
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
    };

    // مراقبة الشات لاكتشاف رسائل السيرفر
    function observeChat() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.matches(".message-box.mess")) {
                        const message = node.querySelector(".chat-message");
                        if (message && message.textContent.includes("auto reset in 40-60 seconds!")) {
                            Timer.start();
                        } else if (message && (message.textContent.includes("auto reset canceled!") ||
                                               message.textContent.includes("auto reset done!"))) {
                            Timer.stop();
                        }
                    }
                });
            });
        });

        const chatBlock = document.querySelector("#chat-block");
        if (chatBlock) {
            observer.observe(chatBlock, { childList: true, subtree: true });
        } else {
            // إذا لم يتم تحميل الشات بعد، نراقب الجسم الرئيسي
            const bodyObserver = new MutationObserver((mutations, obs) => {
                const chat = document.querySelector("#chat-block");
                if (chat) {
                    obs.disconnect();
                    observer.observe(chat, { childList: true, subtree: true });
                }
            });
            bodyObserver.observe(document.body, { childList: true, subtree: true });
        }
    }

    // بدء المراقبة عند تحميل الصفحة
    window.addEventListener("load", observeChat);
})();