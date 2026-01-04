// ==UserScript==
// @name         Mitaku Open Link
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Open post link in new tab
// @author       Yu
// @match        https://mitaku.net/tag/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mitaku.net
// @license      MIT
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/479502/Mitaku%20Open%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/479502/Mitaku%20Open%20Link.meta.js
// ==/UserScript==



(function() {
    'use strict';
    const cssButton = `<style>
    button.open-new-tab {
       position: fixed;
       bottom: 10px;
       right: 10px;
       z-index: 9999;
       padding: 0.75em 1.25em;
       background-color: burlywood;
       border: unset;
       border-radius: 8px;
       font-size: 18px;
       color: black;
    } </style>`

    const posts = document.querySelectorAll("article.post");
    const links = [];

    for(const post of posts) {
        const link = post.querySelector("h2.entry-title a")
        links.push(link.getAttribute("href"));
    }

    const button = document.createElement("button");
    button.classList.add("open-new-tab");
    button.innerText = `Open ${links.length} links`;

    button.addEventListener("click", () => {
        for(const link of links) {
            GM_openInTab(link, { active: true })
        }
    })

    document.body.innerHTML += cssButton;
    document.body.append(button);
})();