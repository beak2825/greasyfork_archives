// ==UserScript==
// @name         Discord Fake Message Editor
// @namespace    http://tampermonkey.net/
// @homepageURL  https://discord.gg/gFNAH7WNZj
// @version      1.0.0
// @description  Change the appearance of a Discord message locally with clickable links, styled pings, and images below text
// @author       Bacon But Pro
// @match        *://discord.com/channels/*
// @icon         https://cdn141.picsart.com/351217840073211.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527702/Discord%20Fake%20Message%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/527702/Discord%20Fake%20Message%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let originalMessages = {};
    let boxVisible = true;
    let clickToCopyEnabled = false;
    let helpBox;

    const ANIMATION_DURATION = 500;

    function startLoading() {
        let loadingBox = document.createElement('div');
        loadingBox.id = 'loadingBox';
        loadingBox.style.position = 'fixed';
        loadingBox.style.top = '50%';
        loadingBox.style.left = '50%';
        loadingBox.style.transform = 'translate(-50%, -50%) translateY(-20px)';
        loadingBox.style.opacity = '0';
        loadingBox.style.background = 'linear-gradient(135deg, #7289da, #2c2f33)';
        loadingBox.style.color = 'white';
        loadingBox.style.padding = '30px';
        loadingBox.style.borderRadius = '10px';
        loadingBox.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        loadingBox.style.textAlign = 'center';
        loadingBox.style.zIndex = '9999';
        loadingBox.style.minWidth = '350px';
        loadingBox.style.fontFamily = `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
        loadingBox.style.transition = `opacity ${ANIMATION_DURATION}ms ease, transform ${ANIMATION_DURATION}ms ease`;

        let loadingText = document.createElement('div');
        loadingText.innerText = 'Loading Userscript';
        loadingText.style.fontSize = '20px';
        loadingText.style.marginBottom = '20px';
        loadingBox.appendChild(loadingText);

        let barContainer = document.createElement('div');
        barContainer.id = 'loadingBarContainer';
        barContainer.style.width = '100%';
        barContainer.style.height = '12px';
        barContainer.style.background = 'rgba(0, 0, 0, 0.2)';
        barContainer.style.borderRadius = '6px';
        barContainer.style.overflow = 'hidden';
        barContainer.style.marginTop = '10px';
        loadingBox.appendChild(barContainer);

        let loadingBar = document.createElement('div');
        loadingBar.id = 'loadingBar';
        loadingBar.style.height = '100%';
        loadingBar.style.width = '100%';
        loadingBar.style.background = 'linear-gradient(90deg, #99aab5, #7289da)';
        loadingBar.style.transformOrigin = 'right';
        loadingBar.style.transition = 'transform 10s linear';
        barContainer.appendChild(loadingBar);

        document.body.appendChild(loadingBox);

        requestAnimationFrame(() => {
            loadingBox.style.opacity = '1';
            loadingBox.style.transform = 'translate(-50%, -50%) translateY(0)';
        });

        requestAnimationFrame(() => {
            loadingBar.style.transform = 'scaleX(0)';
        });

        setTimeout(() => {
            loadingBox.style.opacity = '0';
            loadingBox.style.transform = 'translate(-50%, -50%) translateY(20px)';
            setTimeout(() => {
                if (loadingBox.parentNode) {
                    loadingBox.parentNode.removeChild(loadingBox);
                }
                createControlBox();
            }, ANIMATION_DURATION);
        }, 10000);
    }

    function createControlBox() {
        let box = document.createElement("div");
        box.id = "fakeMessageBox";
        box.style.position = "fixed";
        box.style.bottom = "20px";
        box.style.right = "20px";
        box.style.background = "linear-gradient(135deg, #2c2f33, #7289da)";
        box.style.color = "white";
        box.style.padding = "20px";
        box.style.borderRadius = "10px";
        box.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
        box.style.zIndex = "9999";
        box.style.width = "280px";
        box.style.display = "flex";
        box.style.flexDirection = "column";
        box.style.gap = "10px";
        box.style.fontFamily = `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
        box.style.opacity = "0";
        box.style.transform = "translateX(50px)";
        box.style.transition = `opacity ${ANIMATION_DURATION}ms ease, transform ${ANIMATION_DURATION}ms ease`;

        box.innerHTML = `
            <div>
                <label style="display: block; margin-bottom: 4px;">Message ID:</label>
                <input type="text" id="fakeMsgId" style="width: 100%; padding: 6px; border-radius: 4px; border: none; box-sizing: border-box;">
            </div>

            <div style="display: flex; flex-direction: column; gap: 5px;">
                <button id="clearMsgId" style="padding: 6px; border: none; border-radius: 4px; background: #99aab5; color: white; cursor: pointer;">Clear</button>
                <button id="toggleCopy" style="padding: 6px; border: none; border-radius: 4px; background: #99aab5; color: white; cursor: pointer;">Copy</button>
            </div>

            <div>
                <label style="display: block; margin-bottom: 4px;">New Message:</label>
                <textarea id="fakeMsgHtml" style="width: 100%; padding: 6px; border-radius: 4px; border: none; box-sizing: border-box; resize: vertical;" rows="3"></textarea>
            </div>

            <div>
                <label style="display: block; margin-bottom: 4px;">Image URL (optional):</label>
                <input type="text" id="fakeMsgImage" style="width: 100%; padding: 6px; border-radius: 4px; border: none; box-sizing: border-box;">
            </div>

            <div style="display: flex; gap: 5px;">
                <button id="applyFakeChange" style="flex: 1; padding: 6px; border: none; border-radius: 4px; background: #7289da; color: white; cursor: pointer;">Apply</button>
                <button id="resetFakeChange" style="flex: 1; padding: 6px; border: none; border-radius: 4px; background: #7289da; color: white; cursor: pointer;">Reset</button>
                <button id="hideBox" style="flex: 1; padding: 6px; border: none; border-radius: 4px; background: #7289da; color: white; cursor: pointer;">Hide</button>
                <button id="helpBtn" style="flex: 1; padding: 6px; border: none; border-radius: 4px; background: #7289da; color: white; cursor: pointer;">Help</button>
            </div>

            <div id="notification" style="display: none; color: lime; text-align: center;">Message updated!</div>
            <small style="display: block; text-align: center; margin-top: 5px;">By Bacon But Pro</small>
        `;
        document.body.appendChild(box);

        requestAnimationFrame(() => {
            box.style.opacity = "1";
            box.style.transform = "translateX(0)";
        });

        let toggleButton = document.createElement("button");
        toggleButton.id = "toggleBoxButton";
        toggleButton.innerText = "Show";
        toggleButton.style.position = "fixed";
        toggleButton.style.bottom = "20px";
        toggleButton.style.right = "20px";
        toggleButton.style.background = "#7289da";
        toggleButton.style.color = "white";
        toggleButton.style.padding = "8px 12px";
        toggleButton.style.border = "none";
        toggleButton.style.borderRadius = "4px";
        toggleButton.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
        toggleButton.style.zIndex = "9998";
        toggleButton.style.display = "none";
        toggleButton.style.cursor = "pointer";
        document.body.appendChild(toggleButton);

        helpBox = createHelpBox();

        document.getElementById("applyFakeChange").addEventListener("click", () => {
            let msgId = document.getElementById("fakeMsgId").value.trim();
            let newHtml = document.getElementById("fakeMsgHtml").value;
            let imageUrl = document.getElementById("fakeMsgImage").value.trim();
            if (msgId && (newHtml !== "" || imageUrl !== "")) {
                fakeEditMessage(msgId, newHtml, imageUrl);
                showNotification("Message updated!");
            }
        });

        document.getElementById("resetFakeChange").addEventListener("click", () => {
            let msgId = document.getElementById("fakeMsgId").value.trim();
            if (msgId) {
                resetMessage(msgId);
            }
        });

        document.getElementById("toggleCopy").addEventListener("click", () => {
            clickToCopyEnabled = !clickToCopyEnabled;
            alert(`Copy Mode: ${clickToCopyEnabled ? 'ON' : 'OFF'}`);
        });

        document.getElementById("hideBox").addEventListener("click", () => {
            toggleControlBox();
        });

        document.getElementById("clearMsgId").addEventListener("click", () => {
            document.getElementById("fakeMsgId").value = "";
        });

        document.getElementById("helpBtn").addEventListener("click", () => {
            if (helpBox.style.display === "none") {
                helpBox.style.display = "block";
            } else {
                helpBox.style.display = "none";
            }
        });

        toggleButton.addEventListener("click", () => {
            toggleControlBox();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "F2") {
                toggleControlBox();
            }
        });

        document.addEventListener("click", (event) => {
            if (!clickToCopyEnabled) return;
            let messageElement = event.target.closest("[id^='message-content-']");
            if (messageElement) {
                let messageId = messageElement.id.replace("message-content-", "");
                document.getElementById("fakeMsgId").value = messageId;
                showNotification("Message ID copied!");
            }
        });
    }

    function createHelpBox() {
        let box = document.createElement("div");
        box.id = "fakeMessageHelpBox";
        box.style.position = "fixed";
        box.style.bottom = "20px";
        box.style.right = "320px";
        box.style.background = "#2c2f33";
        box.style.color = "white";
        box.style.padding = "15px";
        box.style.borderRadius = "10px";
        box.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
        box.style.zIndex = "9999";
        box.style.width = "250px";
        box.style.fontFamily = `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
        box.style.display = "none";

        box.innerHTML = `
            <h3 style="margin-top: 0;">Help</h3>
            <p style="font-size: 14px; line-height: 1.4;">
                This script lets you locally modify the appearance of a Discord message.<br><br>
                <strong>Message ID</strong>: Enable "Copy" mode and click a message to grab its ID.<br>
                <strong>New Message</strong>: Enter your custom text, links, or mentions in the format
                <code>&lt;@123456789|DisplayName&gt;</code>.<br>
                <strong>Image URL</strong>: An optional link to an image below your custom text.
            </p>
            <p style="font-size: 14px; line-height: 1.4;">
                <strong>Example:</strong><br>
                <code>&lt;@123456789|User&gt; Check out https://google.com</code>
            </p>
        `;

        document.body.appendChild(box);
        return box;
    }

    function toggleControlBox() {
        let box = document.getElementById("fakeMessageBox");
        let toggleButton = document.getElementById("toggleBoxButton");
        if (!box) return;

        if (boxVisible) {
            box.style.transition = `opacity ${ANIMATION_DURATION}ms ease, transform ${ANIMATION_DURATION}ms ease`;
            box.style.opacity = "0";
            box.style.transform = "translateX(50px)";
            setTimeout(() => {
                box.style.display = "none";
                toggleButton.style.display = "block";
                boxVisible = false;
            }, ANIMATION_DURATION);
        } else {
            box.style.display = "flex";
            box.style.opacity = "0";
            box.style.transform = "translateX(50px)";
            void box.offsetWidth;
            box.style.transition = `opacity ${ANIMATION_DURATION}ms ease, transform ${ANIMATION_DURATION}ms ease`;
            box.style.opacity = "1";
            box.style.transform = "translateX(0)";
            toggleButton.style.display = "none";
            boxVisible = true;
        }
    }

    function fakeEditMessage(messageId, newHtml, imageUrl) {
        let messageElement = document.querySelector(`#message-content-${messageId}`);
        if (messageElement) {
            if (!originalMessages[messageId]) {
                originalMessages[messageId] = messageElement.innerHTML;
            }
            let processedHtml = processContent(newHtml);
            let finalContent = "";
            if (processedHtml) {
                finalContent = `<div>${processedHtml}</div>`;
            }
            if (imageUrl) {
                finalContent += `<div style="margin-top: 5px;"><img src="${imageUrl}" style="max-width: 200px; border-radius: 5px;"></div>`;
            }
            messageElement.innerHTML = finalContent;
        } else {
            alert("Message not found. Make sure it's visible on screen.");
        }
    }

    function resetMessage(messageId) {
        let messageElement = document.querySelector(`#message-content-${messageId}`);
        if (messageElement && originalMessages[messageId]) {
            messageElement.innerHTML = originalMessages[messageId];
            delete originalMessages[messageId];
        } else {
            alert("Original message not stored or message not found.");
        }
    }

    function processLinks(text) {
        if (!text) return "";
        return text.replace(/(https:\/\/[^\s]+)/g, function(match) {
            return `<a href="${match}" target="_blank" style="color: #00b0f4; text-decoration: none;">${match}</a>`;
        });
    }

    function processMentions(text) {
        if (!text) return "";
        return text.replace(/<@([^>|]+)(?:\|([^>]+))?>/g, function(match, id, displayName) {
            if (!displayName) displayName = id;
            return `<span class="mention" style="color: #7289da; font-weight: bold;">@${displayName}</span>`;
        });
    }

    function processContent(text) {
        return processMentions(processLinks(text));
    }

    function showNotification(text) {
        let notif = document.getElementById("notification");
        notif.innerText = text;
        notif.style.display = "block";
        setTimeout(() => notif.style.display = "none", 2000);
    }

    window.addEventListener("load", startLoading);
})();