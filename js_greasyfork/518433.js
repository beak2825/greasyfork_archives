// ==UserScript==
// @name         Scroll to Top
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a button to scroll to the top of the page
// @author       Irushia
// @license      MIT
// @match        *://*/*
// @exclude      http*://*.youtube.com/*
// @icon         data:image/png;base64,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
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/518433/Scroll%20to%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/518433/Scroll%20to%20Top.meta.js
// ==/UserScript==

(function () {
    document.addEventListener("scroll", insertButton, {
        capture: true,
        once: true,
    });

    function insertButton() {
        const SELECTOR_ID = "scrollTop-btn";
        const btn = document.createElement("button");
        btn.id = SELECTOR_ID;
        Object.assign(btn.style, {
            position: "fixed",
            cursor: "pointer",
            bottom: 0,
            left: "20%",
            visibility: "hidden",
            opacity: 0.5,
            width: "40%",
            height: "40px",
            border: "none",
            outline: "none",
            "z-index": 1,
            "border-radius": "100% 100% 0 0",
            "font-size": "16px",
            "background-color": "rgba(0,0,0,.3)",
            "box-shadow":
            "0 16px 24px 2px rgba(0, 0, 0, .14), 0 6px 30px 5px rgba(0, 0, 0, .12), 0 8px 10px -5px rgba(0, 0, 0, .4)",
        });
        btn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth", // "instant",
            });
        });
        const arrow = document.createElement("span");
        Object.assign(arrow.style, {
            border: "solid white",
            "border-width": "0 3px 3px 0",
            display: "inline-block",
            padding: "4px",
            "vertical-align": "middle",
            transform: "rotate(-135deg)",
        });
        btn.append(arrow);
        document.body.append(btn);
        const cssRule = `
            #${SELECTOR_ID}:hover {
                opacity: 1 !important;
                background-color: rgba(0,0,0,.6) !important;
                }
        `;
        const styleElement = document.createElement("style");
        styleElement.textContent = cssRule;
        document.head.appendChild(styleElement);

        const scrollTop_btn = document.getElementById(SELECTOR_ID);
        let sOld;
        window.addEventListener("scroll", () => {
            const sCurr = document.documentElement.scrollTop > window.innerHeight / 4;
            if (sCurr == sOld) return;
            sOld = sCurr;
            scrollTop_btn.style.visibility = sCurr ? "visible" : "hidden";
        });
    }
})();
