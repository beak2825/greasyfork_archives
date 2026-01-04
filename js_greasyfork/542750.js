// ==UserScript==
// @name         ChatGPT - Hide Old Messages (New DOM)
// @namespace    https://openai.com/
// @version      1.2
// @description  מסתיר הודעות ישנות בצ'אט של GPT ב־#thread article, עם כפתור הצג הכול
// @author       Ross M
// @license      MIT
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542750/ChatGPT%20-%20Hide%20Old%20Messages%20%28New%20DOM%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542750/ChatGPT%20-%20Hide%20Old%20Messages%20%28New%20DOM%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MAX_VISIBLE_MESSAGES = 10;

    function createShowAllButton(messages) {
        console.log("✅ button Tampermonkey נטען");
        const existing = document.getElementById("showAllMessagesBtn");
        if (existing) return;

        const btn = document.createElement("button");
        btn.textContent = "הצג את כל ההודעות";
        btn.id = "showAllMessagesBtn";
        Object.assign(btn.style, {
            position: "fixed",
            top: "50px",
            right: "10px",
            zIndex: 9999,
            padding: "10px",
            backgroundColor: "#10a37f",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px"
        });
        btn.onclick = () => {
            messages.forEach(msg => msg.style.display = "");
            btn.remove();
        };
        document.body.appendChild(btn);
    }

    function hideOldMessages() {
        const messages = Array.from(document.querySelectorAll("#thread article"));
        if (messages.length > MAX_VISIBLE_MESSAGES) {
            messages.forEach((msg, idx) => {
                msg.style.display = (idx < messages.length - MAX_VISIBLE_MESSAGES) ? "none" : "";
            });
            createShowAllButton(messages);
        }
    }

    const observer = new MutationObserver(hideOldMessages);

    function waitForThread() {
        const container = document.querySelector("#thread");
        if (container) {
            observer.observe(container, { childList: true, subtree: true });
            hideOldMessages();
        } else {
            setTimeout(waitForThread, 500);
        }
    }

    waitForThread();
})();
