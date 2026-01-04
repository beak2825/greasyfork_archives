// ==UserScript==
// @name         NiTwit - From Twitter to Nitter and back
// @namespace    https://github.com/appel/userscripts
// @version      0.1.15
// @description  Show a button on the top right to quickly toggle between Twitter and Nitter.net (or any other instance).
// @author       Ap
// @match        *://*.twitter.com/*
// @match        *://*.x.com/*
// @match        *://*.nitter.net/*
// @match        *://nitter.poast.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471765/NiTwit%20-%20From%20Twitter%20to%20Nitter%20and%20back.user.js
// @updateURL https://update.greasyfork.org/scripts/471765/NiTwit%20-%20From%20Twitter%20to%20Nitter%20and%20back.meta.js
// ==/UserScript==

(function () {
    ("use strict");

    if (window.self !== window.top) {
        return; // Return if inside an iframe
    }

    let alternateDomain = "https://nitter.poast.org";

    let observer = new MutationObserver(function () {
        if (document.querySelector(".nitter-switch")) {
            return;
        }

        const url = window.location.href;
        let btnColor, btnText, btnTitle;

       if (url.includes("twitter.com") || url.includes("x.com")) {
            btnColor = "#ff6c60";
            btnText = "N";
            btnTitle = "Switch to Nitter";
        } else if (url.includes(alternateDomain)) {
            btnColor = "#1d9bf0";
            btnText = "T";
            btnTitle = "Switch to Twitter";
        }

        let btn = document.createElement("button");
        btn.classList.add("nitter-switch");
        btn.textContent = btnText;
        btn.title = btnTitle;
        btn.style.position = "fixed";
        btn.style.top = "10px";
        btn.style.right = "10px";
        btn.style.zIndex = "9999";
        btn.style.backgroundColor = btnColor;
        btn.style.color = "white";
        btn.style.borderRadius = "50%";
        btn.style.width = "24px";
        btn.style.height = "24px";
        btn.style.border = "none";
        btn.style.cursor = "pointer";
        btn.style.fontFamily = "-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif";
        btn.style.fontSize = "14px";
        btn.style.fontWeight = "700";
        btn.style.textAlign = "center";
        btn.style.padding = "0";
        btn.style.lineHeight = "24px";
        btn.style.transition = "transform .15s ease";

        document.body.appendChild(btn);

        btn.addEventListener("click", function () {
            let url = window.location.href;
            let newUrl = "";

            if (url.includes("x.com")) {
                newUrl = url.replace("https://x.com", alternateDomain);
            } else if (url.includes("twitter.com")) {
                newUrl = url.replace("https://twitter.com", alternateDomain);
            } else if (url.includes(alternateDomain)) {
                newUrl = url.replace(alternateDomain, "https://twitter.com");
            }

            // Add "pop" animation
            this.style.transform = "scale(1.2)";
            setTimeout(() => (this.style.transform = "scale(1)"), 150);

            window.location.href = newUrl;
        });
    });

    observer.observe(document, { childList: true, subtree: true });
})();
