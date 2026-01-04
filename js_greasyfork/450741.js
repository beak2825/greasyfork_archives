// ==UserScript==
// @name         Detect Watermark
// @version      0.3
// @description  Detect invisible watermark on the page to avoid track
// @author       You
// @match        https://*/*
// @grant        none
// @run-at       document-idle
// @namespace    https://greasyfork.org/users/474693
// @downloadURL https://update.greasyfork.org/scripts/450741/Detect%20Watermark.user.js
// @updateURL https://update.greasyfork.org/scripts/450741/Detect%20Watermark.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function isWatermarkElement(el) {
        const style = getComputedStyle(el);
        return (style.pointerEvents === "none" &&
                style.position === "fixed" &&
                style.backgroundImage.toLowerCase().includes("data:"));
    }

    const LANG = {
        "zh-CN": {
            warn: "⚠️ 当前页面可能含有水印，请注意保护个人信息！",
            dismiss: "知道了",
        },
    };
    function getText(key) {
        const text = LANG[navigator.language] ?? LANG["zh-CN"];
        return text[key];
    }

    async function detect() {
        return new Promise((resolve) => {
            const elements = document.querySelectorAll("*");
            let cursor = 0;
            const run = ({ didTimeout }) => {
                for (; cursor < elements.length; cursor++) {
                    const element = elements[cursor];
                    if (isWatermarkElement(element)) {
                        resolve(element);
                        return;
                    }
                    if (didTimeout) {
                        requestIdleCallback(run);
                        return;
                    }
                }
                resolve();
            };
            requestIdleCallback(run);
        });
    }
    function report(el) {
        const shadowHost = document.createElement("div");
        const shadowRoot = shadowHost.attachShadow({ mode: 'closed' });
        document.body.appendChild(shadowHost);
        const notice = document.createElement('div');
        notice.setAttribute("style", [
            "position: fixed",
            "z-index: 99999",
            "top: 10px",
            "right: 10px",
            "left: 10px",
            "display: flex",
            "justify-content: space-between",
            "align-items: center",
            "color: white",
            "background: red",
            "border-radius: 8px",
            "padding: 8px",
        ].join(";"));
        notice.innerText = getText("warn");
        const button = document.createElement("button");
        button.innerText = getText("dismiss");
        button.addEventListener("click", () => {
            document.body.removeChild(shadowHost);
        });
        notice.appendChild(button);
        shadowRoot.appendChild(notice);
    }
    setTimeout(async () => {
        const watermarkEl = await detect();
        if (watermarkEl == null)
            return;
        report();
    }, 5000);

})();
