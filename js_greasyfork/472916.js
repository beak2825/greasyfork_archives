// ==UserScript==
// @name         Ye Olde Lemmy
// @namespace    https://github.com/appel/userscripts
// @version      0.0.6
// @description  A handy toggle for a familiar desktop experience for lemmy. Quickly switch from {instance} to o.opnxng.com/{instance} and back
// @author       appel
// @match        *://*.lemmy.ml/*
// @match        *://*.lemmy.world/*
// @match        *://*.lemm.ee/*
// @match        *://*.sh.itjust.works/*
// @match        *://*.beehaw.org/*
// @match        *://lemmy.dbzer0.com/*
// @match        *://*.lemmy.zip/*
// @match        *://*.feddit.nl/*
// @match        *://*.lemmy.today/*
// @match        *://*.jlai.lu/*
// @match        *://*.ani.social/*
// @match        *://*.lemy.lol/*
// @match        *://*.discuss.online/*
// @match        *://*.iusearchlinux.fyi/*
// @match        *://*.monero.town/*
// @match        *://o.opnxng.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472916/Ye%20Olde%20Lemmy.user.js
// @updateURL https://update.greasyfork.org/scripts/472916/Ye%20Olde%20Lemmy.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Check if the script is running in an iframe or not
    if (window.self !== window.top) {
        return; // Return if inside an iframe
    }

    // MutationObserver watches for changes in the document
    let observer = new MutationObserver(function () {
        if (document.querySelector(".toggle-switch")) {
            return;
        }

        const url = window.location.href;
        const domainMatch = url.match(/https?:\/\/([^\/]+)\//);
        const currentDomain = domainMatch ? domainMatch[1] : null;
        let btnColor, btnText, btnTitle, newUrl;

        if (currentDomain && currentDomain.includes('opnxng.com')) {
            const instanceMatch = url.match(/https:\/\/o\.opnxng\.com\/([^\/]+)\/(.*)/);
            const instance = instanceMatch[1];
            const pathAndQuery = instanceMatch[2] || ''; // Get the remaining path if any
            btnColor = "#333";
            btnText = "L";
            btnTitle = "Switch to original Lemmy Instance";
            newUrl = `https://${instance}/${pathAndQuery}`; // Correct the URL construction
        } else if (currentDomain) {
            const pathAndQuery = url.substring(url.indexOf(currentDomain) + currentDomain.length);
            btnColor = "#ff6c60";
            btnText = "O";
            btnTitle = `Switch to Ye Olde Lemmy`;
            newUrl = `https://o.opnxng.com/${currentDomain}${pathAndQuery}`; // Include path and query
        }

        if (!newUrl) {
            return;
        }

        // Create button
        let btn = document.createElement("button");
        btn.classList.add("toggle-switch");
        btn.textContent = btnText;
        btn.title = btnTitle;
        btn.style.position = "fixed";
        btn.style.bottom = "1rem";
        btn.style.right = "1rem";
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

        // Add button to page
        document.body.appendChild(btn);

        btn.addEventListener("click", function (event) {
            // Add "pop" animation
            this.style.transform = "scale(1.2)";
            setTimeout(() => (this.style.transform = "scale(1)"), 150);

            if (event.ctrlKey) {
                // Open in a new tab
                window.open(newUrl, '_blank').focus();
            } else {
                // Navigate in the current tab
                window.location.href = newUrl;
            }
        });
    });

    observer.observe(document, { childList: true, subtree: true });
})();