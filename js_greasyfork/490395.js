// ==UserScript==
// @name         mark last read
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Bookmark Kemono entries
// @author       SoloJessy
// @match        https://kemono.su/patreon/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kemono.party
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490395/mark%20last%20read.user.js
// @updateURL https://update.greasyfork.org/scripts/490395/mark%20last%20read.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let currPath = window.location.pathname;
    let highlightColor = "Aqua";

    document.querySelectorAll("article.post-card").forEach((cV, idx, arr) => {
        cV.style.position = "relative";

        let button = document.createElement('button');
        button.innerText = "*";
        button.style.position = "absolute";
        button.style.top = "3px";
        button.style.right = "3px";
        button.style.zIndex = "5";

        let id = cV.dataset.id;
        button.addEventListener("click", () => {
            let mark = localStorage.getItem(currPath);

            let oldTarget = document.querySelector(`[data-id='${mark}']>a`);
            if (oldTarget) oldTarget.style.background = "";

            let newTarget = document.querySelector(`[data-id='${id}']>a`);
            if (newTarget) newTarget.style.background = highlightColor;

            localStorage.setItem(currPath, id);
        });

        cV.appendChild(button);
    });

    let elem = document.querySelector("[data-id='" + localStorage.getItem(currPath) + "']>a");
    if (elem) elem.style.background = highlightColor;
})();