// ==UserScript==
// @name         HKG Toast Message Fixer
// @namespace    http://tampermonkey.net/
// @version      4
// @description  移除高登隱藏嘅toast bar，避免阻擋後面嘅內容點擊。
// @author       Coded by 小馬蛇後援會
// @match        *://forum.hkgolden.com/*
// @icon
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/510117/HKG%20Toast%20Message%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/510117/HKG%20Toast%20Message%20Fixer.meta.js
// ==/UserScript==

(function() {
    const targetNode = document.getElementById("root");

    const config = {
        attributes: true,
        childList: false,
        subtree: true,
        attributeFilter: ['style']
    };

    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === "attributes" && mutation.attributeName === "style") {
                const toast = document.querySelector(".MuiSnackbarContent-root");
                if (toast) {
                    const computedStyles = window.getComputedStyle(toast);
                    if (computedStyles.visibility === 'hidden') {
                        toast.style.display = 'none';
                    } else {
                        toast.style.display = 'flex';
                    }
                }
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
})();
