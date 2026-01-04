// ==UserScript==
// @name         Gelbooru X to unfavorite
// @namespace    http://tampermonkey.net/
// @version      2025-04-30
// @description  Press hotkey "x" to unfavorite gelbooru post
// @author       rainbrain
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @match       https://gelbooru.com/*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/534573/Gelbooru%20X%20to%20unfavorite.user.js
// @updateURL https://update.greasyfork.org/scripts/534573/Gelbooru%20X%20to%20unfavorite.meta.js
// ==/UserScript==

var isKeyPressed = {
    x: false, // ASCII code for 'a'
    // ... Other keys to check for custom key combinations
};

document.body.addEventListener(
    "mousemove",
    ({ target }) => {
        if (target.parentNode.nodeName !== "A") return;
        window.lastHoveredLink = target.parentNode.href;
    },
    false
);

function getid(u) {
    const urlParams = new URLSearchParams(u);
    const postid = urlParams.get("id");
    return postid;
}

function delFav(id) {                     // opposite action: unfavorite
    if (!id) return;
    fetch(`/index.php?page=favorites&s=delete&id=${id}`, {
        credentials: "include"
    });
}

document.onkeydown = (keyDownEvent) => {
    isKeyPressed[keyDownEvent.key] = true;
    if (isKeyPressed["x"]) {
        const queryString = window.location.search;
        let postid = getid(queryString);
        if (postid == null) {
            postid = getid(window.lastHoveredLink);
        }
        delFav(postid);
    }
};