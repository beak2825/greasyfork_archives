// ==UserScript==
// @name         Reveddit links on old reddit comments
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds reveddit links on old reddit comments
// @author       xdpirate
// @match        https://old.reddit.com/r/*/comments/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      GPLv2
// @downloadURL https://update.greasyfork.org/scripts/460149/Reveddit%20links%20on%20old%20reddit%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/460149/Reveddit%20links%20on%20old%20reddit%20comments.meta.js
// ==/UserScript==
let observerOptions = {subtree: true, childList: true};
let mObserver = new MutationObserver(function() {
    let comments = document.querySelectorAll("ul.buttons");

    for(let i = 0; i < comments.length; i++) {
        if(!comments[i].querySelector("a.revedditLink")) {
            let newListItem = document.createElement("li");
            let commentPermalink = comments[i].querySelector("li.first > a.bylink");
            let revedditLink;

            if(commentPermalink) {
                revedditLink = commentPermalink.href.replace("reddit.com","reveddit.com");
                newListItem.innerHTML = `<a href="${revedditLink}" class="revedditLink" target="_blank">reveddit</a>`;
                comments[i].appendChild(newListItem);
            }
        }
    }
});

mObserver.observe(document, observerOptions);
