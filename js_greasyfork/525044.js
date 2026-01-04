// ==UserScript==
// @name         Add Unddit, Reveddit & Wayback Machine Links to Reddit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds links to unddit, reveddit, wayback machine at the bottom of reddit post to quickly view deleted comments (old.reddit only)
// @author       jack_the_dripper
// @match        *://*.reddit.com/r/*/comments/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525044/Add%20Unddit%2C%20Reveddit%20%20Wayback%20Machine%20Links%20to%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/525044/Add%20Unddit%2C%20Reveddit%20%20Wayback%20Machine%20Links%20to%20Reddit.meta.js
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
    };
    for(let i = 0; i < comments.length; i++) {
        if(!comments[i].querySelector("a.undditLink")) {
            let newListItem = document.createElement("li");
            let commentPermalink = comments[i].querySelector("li.first > a.bylink");
            let undditLink;

            if(commentPermalink) {
                undditLink = commentPermalink.href
                    .replace("www.reddit.com", "undelete.pullpush.io")
                    .replace("old.reddit.com", "undelete.pullpush.io");
                newListItem.innerHTML = `<a href="${undditLink}" class="undditLink" target="_blank">unddit</a>`;
                comments[i].appendChild(newListItem);
            }
        }
    };
    for(let i = 0; i < comments.length; i++) {
        if(!comments[i].querySelector("a.waybackmachineLink")) {
            let newListItem = document.createElement("li");
            let commentPermalink = comments[i].querySelector("li.first > a.bylink");
            let waybackmachineLink;

            if(commentPermalink) {
                waybackmachineLink = commentPermalink.href.replace("https://", "https://web.archive.org/web/2/");
                newListItem.innerHTML = `<a href="${waybackmachineLink}" class="waybackmachineLink" target="_blank">wayback machine</a>`;
                comments[i].appendChild(newListItem);
            }
        }
    }
});

mObserver.observe(document, observerOptions);