// ==UserScript==
// @name         YuanBao Chat Width Optimized
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Optimized chat width with breathing space and minimal toggle
// @author       Bela Proinsias
// @match        https://yuanbao.tencent.com/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tencent.com
// @grant        GM_addStyle
// @grant        GM.registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533156/YuanBao%20Chat%20Width%20Optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/533156/YuanBao%20Chat%20Width%20Optimized.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const STORAGE_KEY = "yuanbao-chat-width";
    const CSS_VARS = `
        :root {
            --chat-container-width: 85%;
            --toggle-size: 32px;
            --toggle-color: #FF7EB6;
            --toggle-bg: linear-gradient(145deg, #FFDEE9, #FFB3D9);
            --bubble-bg: rgba(255, 222, 233, 0.95);
        }
    `;

    let currentWidth = GM_getValue(STORAGE_KEY, 85);
    let styleElement;
    let toggle;

    function applyOptimizedStyles() {
        const dynamicStyles = `
            ${CSS_VARS}

            .agent-chat__list__item__content {
                max-width: var(--chat-container-width) !important;
                margin: 0 auto !important;
                transition: max-width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            #widthToggle {
                width: var(--toggle-size);
                height: var(--toggle-size);
                border-radius: 12px;
                background: var(--toggle-bg);
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: all 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);
            }

            #widthToggle:hover {
                transform: scale(1.1) rotate(12deg);
                box-shadow: 0 6px 16px rgba(0,0,0,0.2);
            }

            #widthToggle:active {
                transform: scale(0.95);
            }

            #widthToggle::before {
                content: attr(data-percent);
                position: absolute;
                right: calc(100% + 10px);
                top: 50%;
                transform: translateY(-50%);
                background: var(--bubble-bg);
                color: #E83F6F;
                font-size: 12px;
                padding: 6px 12px;
                border-radius: 8px;
                font-family: 'Microsoft Yahei', sans-serif;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: all 0.3s ease;
                border: 2px solid #FFB3D9;
            }

            #widthToggle::after {
                content: '➤';
                position: absolute;
                right: 100%;
                top: 50%;
                transform: translate(40%, -50%) rotate(-90deg);
                color: var(--bubble-bg);
                font-size: 16px;
                opacity: 0;
                transition: all 0.3s ease;
            }

            #widthToggle:hover::before,
            #widthToggle:hover::after {
                opacity: 1;
                transform: translate(0, -50%) rotate(0deg);
            }

            #widthToggle span {
                width: 60%;
                height: 60%;
                background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" fill="%23E83F6F" xmlns="http://www.w3.org/2000/svg"><path d="M18 12h-4V8h-4v4H6l6 6 6-6z"/></svg>');
                background-size: contain;
                transition: transform 0.3s ease;
            }
        `;

        if (!styleElement) {
            styleElement = document.createElement("style");
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = dynamicStyles;
    }

    function createFloatingToggle() {
        toggle = document.createElement("button");
        toggle.id = "widthToggle";
        toggle.title = "reset width";
        toggle.innerHTML = "<span></span>";
        toggle.setAttribute("data-percent", `${currentWidth}%`);

        toggle.addEventListener("click", () => {
            currentWidth = 85;
            updateWidth();

            toggle.style.background = "linear-gradient(145deg, #FFB3D9, #FF8CC6)";
            setTimeout(() => {
                toggle.style.background = CSS_VARS.match(/--toggle-bg: (.*?);/)[1];
            }, 200);
        });

        toggle.addEventListener("wheel", (e) => {
            e.preventDefault();
            currentWidth += e.deltaY > 0 ? -1 : 1;
            currentWidth = Math.min(120, Math.max(60, currentWidth));
            updateWidth();
        });

        document.body.appendChild(toggle);
    }

    function updateWidth() {
        GM_setValue(STORAGE_KEY, currentWidth);
        document.documentElement.style.setProperty(
            "--chat-container-width",
            `${currentWidth}%`
        );
        toggle.setAttribute("data-percent", `${currentWidth}%`);

        document
            .querySelectorAll(".agent-chat__list__item__content")
            .forEach((el) => {
                el.style.transform = "scale(0.98)";
                setTimeout(() => (el.style.transform = "scale(1)"), 200);
            });
    }

    function init() {
        applyOptimizedStyles();
        createFloatingToggle();
        updateWidth();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
