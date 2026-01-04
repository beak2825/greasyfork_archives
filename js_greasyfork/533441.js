// ==UserScript==
// @name         ChatGPT Message Navigator
// @namespace    https://violentmonkey.github.io/
// @version      1.1
// @description  Displays a list of user and assistant responses in ChatGPT conversations for quick navigation.
// @author       Bui Quoc Dung
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533441/ChatGPT%20Message%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/533441/ChatGPT%20Message%20Navigator.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // If panel already exists, do nothing
    if (document.getElementById("toc-panel") || document.getElementById("toc-handle")) {
        return;
    }

    // --- Insert CSS with dark mode support ---
    const css = document.createElement("style");
    css.textContent =
    /* Panel */
    `#toc-panel { position: fixed; top: 0; right: 0; width: 280px; height: 100%; background: #fafafa; box-shadow: -4px 0 8px rgba(0,0,0,0.1); font-family: sans-serif; font-size: 0.8rem; border-left: 1px solid #ddd; display: flex; flex-direction: column; z-index: 9998; visibility: hidden; }
    #toc-panel.visible { visibility: visible; }
    #toc-header { padding: 6px 10px; background: #ddd; border-bottom: 1px solid #ccc; font-weight: bold; flex-shrink: 0; }
    #toc-list { list-style: none; flex: 1; overflow-y: auto; margin: 0; padding: 6px; }
    #toc-list li { padding: 4px; cursor: pointer; border-radius: 3px; transition: background-color 0.2s; }
    #toc-list li:hover { background: #f0f0f0; }
    #toc-handle { position: fixed; top: 50%; right: 0; transform: translateY(-50%); width: 30px; height: 80px; background: #ccc; display: flex; align-items: center; justify-content: center; writing-mode: vertical-rl; text-orientation: mixed; cursor: pointer; font-weight: bold; user-select: none; z-index: 9999; transition: background 0.2s; }
    #toc-handle:hover { background: #bbb; }
    @keyframes highlightFade { 0% { background-color: #fffa99; } 100% { background-color: transparent; } }
    .toc-highlight { animation: highlightFade 1.5s forwards; }
    @media (prefers-color-scheme: dark) {
      #toc-panel { background: #333; border-left: 1px solid #555; box-shadow: -4px 0 8px rgba(0,0,0,0.7); }
      #toc-header { background: #555; border-bottom: 1px solid #666; color: #eee; }
      #toc-list li:hover { background: #444; }
      #toc-list { color: #eee; }
      #toc-handle { background: #555; color: #ddd; }
      #toc-handle:hover { background: #666; }
    }`;
    document.head.appendChild(css);

    // --- Create panel & handle ---
    const panel = document.createElement("div");
    panel.id = "toc-panel";
    panel.innerHTML = `
      <div id="toc-header">Conversation TOC</div>
      <ul id="toc-list"></ul>
    `;
    document.body.appendChild(panel);

    const handle = document.createElement("div");
    handle.id = "toc-handle";
    handle.textContent = "TOC";
    document.body.appendChild(handle);

    // Observed container, observer, etc.
    let chatContainer = null;
    let observer = null;
    let isScheduled = false;
    let timerId = null;

    // Debounce the TOC build to avoid high CPU usage on rapid changes
    function debounceBuildTOC() {
        if (isScheduled) return;
        isScheduled = true;
        timerId = setTimeout(function () {
            buildTOC();
            isScheduled = false;
        }, 300);
    }

    // Build/refresh the TOC
    function buildTOC() {
        const list = document.getElementById("toc-list");
        if (!list) return;
        list.innerHTML = "";

        // Find conversation turns
        const articles = (chatContainer || document).querySelectorAll("article[data-testid^='conversation-turn-']");
        if (!articles || articles.length === 0) {
            list.innerHTML = '<li style="opacity:0.7;font-style:italic;">Empty chat</li>';
            return;
        }

        // Loop over turns
        for (let i = 0; i < articles.length; i++) {
            const art = articles[i];
            const li = document.createElement("li");

            // Check if AI (assistant)
            const sr = art.querySelector("h6.sr-only");
            let isAI = false;
            if (sr && sr.textContent.includes("ChatGPT said:")) {
                isAI = true;
                li.textContent = "ChatGPT:";

                // Get the assistant message
                const assistantMsg = art.querySelector('div[data-message-author-role="assistant"]');
                const assistantText = assistantMsg?.textContent?.trim();
                if (assistantText) {
                    li.innerHTML = "<strong>ChatGPT: </strong>" + assistantText.slice(0, 100) + (assistantText.length > 100 ? "..." : "");
                }
            } else {
                // Get the user message
                const userMsg = art.querySelector('div[data-message-author-role="user"]');
                const userText = userMsg?.textContent?.trim();
                if (userText) {
                    const preview = userText.slice(0, 100);
                    li.innerHTML = "<strong>You: </strong>" + preview + (userText.length > 100 ? "..." : "");
                } else {
                    li.textContent = "";
                }
            }

            // On click: scroll to turn
            (function (turnElem) {
                li.addEventListener("click", function () {
                    turnElem.scrollIntoView({behavior: "smooth", block: "start"});
                });
            })(art);

            list.appendChild(li);
        }
    }

    // Attach observer to new container if needed
    function attachObserver() {
        const c = document.querySelector("main#main") || document.querySelector(".chat-container") || null;
        if (c !== chatContainer) {
            chatContainer = c;
            if (observer) {
                observer.disconnect();
                observer = null;
            }
            if (chatContainer) {
                observer = new MutationObserver(function () {
                    debounceBuildTOC();
                });
                observer.observe(chatContainer, {childList: true, subtree: true});
                buildTOC();
            }
        }
    }

    // Attempt to attach on load
    attachObserver();
    // Re-check every 2s in case container changes
    const reAttachInterval = setInterval(attachObserver, 2000);

    // Panel toggle
    handle.addEventListener("click", function () {
        panel.classList.toggle("visible");
    });
})();
