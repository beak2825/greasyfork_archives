// ==UserScript==
// @name         HFReply
// @version      2025-02-15
// @description  Reply to messages on HF Convo with formatted text
// @author       NovoDev
// @match        https://hackforums.net/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1435467
// @downloadURL https://update.greasyfork.org/scripts/527021/HFReply.user.js
// @updateURL https://update.greasyfork.org/scripts/527021/HFReply.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addReplyButtons() {
        const messageContainerXPath = "/html/body/div[3]/div[3]/div/div[3]/div[3]/div/div[2]/div[3]";
        const commentBox = document.evaluate("//*[@id='comment']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (!commentBox) {
            console.error("Comment box not found");
            return;
        }

        const container = document.evaluate(messageContainerXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (!container) {
            console.error("Message container not found");
            return;
        }

        const observer = new MutationObserver(() => {
            const messages = container.querySelectorAll(".message-convo-left, .message-convo-right, .message-convo-follow");

            messages.forEach((msg) => {
                if (msg.dataset.replyAdded) return;

                const isOwnMessage = msg.classList.contains("message-convo-right");
                if (isOwnMessage) return;

                const messageText = msg.textContent.trim().toLowerCase();

                if (messageText.includes("/flip") || messageText.includes("/jackpot")) {
                    return;
                }

                msg.dataset.replyAdded = "true";

                let nameElement = msg.querySelector("[data-profile-username] a strong");
                if (!nameElement) {
                    let prevMsg = msg.previousElementSibling;
                    while (prevMsg) {
                        nameElement = prevMsg.querySelector("[data-profile-username] a strong");
                        if (nameElement) break;
                        prevMsg = prevMsg.previousElementSibling;
                    }
                }

                const textContainers = msg.querySelectorAll(".message-bubble-message");

                if (nameElement && textContainers.length > 0) {
                    let replyText = `@${nameElement.textContent.trim()}@ : ***"`;

                    textContainers.forEach(container => {
                        const textSpans = container.querySelectorAll("span");
                        textSpans.forEach(span => {
                            replyText += `${span.textContent.trim()} `;
                        });
                    });

                    replyText = replyText.trim() + `"***`;

                    const replyButton = document.createElement("span");
                    replyButton.innerHTML = `
                        <span style="
                            cursor: pointer;
                            color: #fff;
                            background: #2563eb;
                            padding: 4px 8px;
                            margin-left: 10px;
                            font-size: 12px;
                            border-radius: 6px;
                            display: inline-flex;
                            align-items: center;
                            gap: 4px;
                            transition: filter 0.2s;
                        ">
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                                <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/>
                            </svg>
                            Reply
                        </span>
                    `;

                    replyButton.onmouseenter = () => {
                        replyButton.firstElementChild.style.filter = "brightness(0.9)";
                    };
                    replyButton.onmouseleave = () => {
                        replyButton.firstElementChild.style.filter = "none";
                    };

                    replyButton.onclick = () => {
                        commentBox.value = `${replyText}\n${commentBox.value}`;
                        commentBox.focus();
                        commentBox.scrollIntoView();
                    };

                    textContainers[textContainers.length - 1].appendChild(replyButton);
                }
            });
        });

        observer.observe(container, { childList: true, subtree: true });
    }

    window.addEventListener("load", addReplyButtons);
})();