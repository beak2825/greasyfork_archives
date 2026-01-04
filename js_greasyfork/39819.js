// ==UserScript==
// @name         Feedly Colorful Placeholder Banners
// @namespace    patrickl.am
// @version      0.1
// @description  Uses colorful placeholder banners for articles without images.
// @author       Patrick Lam
// @match        https://feedly.com/i/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39819/Feedly%20Colorful%20Placeholder%20Banners.user.js
// @updateURL https://update.greasyfork.org/scripts/39819/Feedly%20Colorful%20Placeholder%20Banners.meta.js
// ==/UserScript==

function stringToColor(str) {
    var hash = 0;
    var i = 0;
    for (i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var color = '#';
    for (i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }

    return color;
}

const observer = new window.MutationObserver(mutations => {
    mutations.forEach(mutation => {
        const target = mutation.target;
        if (target.classList.contains("entry")) {
            const title = target.querySelector("a.title").innerText.split(" ")[0];
            const color = stringToColor(title || "");

            target.querySelector(".visual.placeholder").style.setProperty("background-color", color);
        }
    });
});
observer.observe(document.getElementById('box'), { childList: true, subtree: true });
