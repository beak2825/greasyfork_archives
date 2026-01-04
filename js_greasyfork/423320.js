// ==UserScript==
// @name        GitHub Site-Wide Dark Mode
// @namespace   JunkiEDM/auto-dark-mode
// @match       https://github.com/*
// @grant       none
// @version     1.0
// @author      JunkiEDM
// @description Fixes GitHub's dark mode not being enabled on Explore page, Marketplace, etc.
// @downloadURL https://update.greasyfork.org/scripts/423320/GitHub%20Site-Wide%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/423320/GitHub%20Site-Wide%20Dark%20Mode.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
    document.documentElement.setAttribute("data-color-mode", "dark")
    document.documentElement.setAttribute("data-dark-theme", "dark")
    document.evaluate('//*[@id="js-pjax-container"]/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.setAttribute("style", "/* background-color: #fcfdfd; */")
    document.evaluate('//*[@id="js-pjax-container"]/div[2]/div/div/div[2]/article[1]/div[3]/div/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.setAttribute("style", "background: linear-gradient(to top, var(--color-bg-canvas), rgba(255,255,255,0));")
}, false);
