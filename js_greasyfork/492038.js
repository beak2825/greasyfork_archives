// ==UserScript==
// @name         reddit ad remover
// @namespace    https://www.reddit.com/
// @version      2024-05/17
// @description  remove reddit ads
// @author       ぐらんぴ
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492038/reddit%20ad%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/492038/reddit%20ad%20remover.meta.js
// ==/UserScript==

document.querySelector("shreddit-ad-post").remove()
document.addEventListener("scroll", ()=>{
    document.querySelector("shreddit-ad-post").remove()
})