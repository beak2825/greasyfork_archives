// ==UserScript==
// @name         Repost-o-Matic (for Old Reddit)
// @namespace    http://www.reddit.com/
// @version      1.0
// @description  Adds a button on posts on old reddit that lets you repost that same post to the same sub
// @author       xdpirate
// @license      GPLv3
// @match        https://old.reddit.com/r/*/comments/*
// @match        https://www.reddit.com/r/*/comments/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/490410/Repost-o-Matic%20%28for%20Old%20Reddit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/490410/Repost-o-Matic%20%28for%20Old%20Reddit%29.meta.js
// ==/UserScript==

let submitTextButton = document.querySelector("div.submit-text");

if(submitTextButton) { // If there's no submit text post button, we can't repost the post because the sub doesn't allow text posts
    let matches = location.href.match(/^(https:\/\/(?:old\.|www\.)?reddit.com\/r\/([^\/]*)\/comments\/)([^\/]*)/);
    let jsonPath = matches[1] + matches[3] + ".json";
    let currentSub = matches[2];

    fetch(jsonPath).then(response => { return response.json(); }).then(data => {
        let postTitle = encodeURIComponent(data[0].data.children[0].data.title.trim());
        let postText = encodeURIComponent(data[0].data.children[0].data.selftext.trim());

        let repostButton = `
            <div class="spacer">
                <div class="sidebox">
                    <div class="morelink">
                        <a href="https://old.reddit.com/r/${currentSub}/submit?selftext=true&title=${postTitle}&text=${postText}">Repost this post</a>
                    </div>
                </div>
            </div>
        `;

        submitTextButton.closest("div.spacer").insertAdjacentHTML("afterend", repostButton);
    });
} else {
    console.log("[UserScript: RoM] Couldn't find submit-text button! This is probably because the sub doesn't allow text posts.");
}
