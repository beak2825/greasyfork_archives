// ==UserScript==
// @name        Make it Meme Download Button
// @namespace   Freebee1693
// @match       https://makeitmeme.com/*
// @grant       none
// @version     1.0.0-GitHub
// @author      Freebee1693
// @license     Apache License 2.0
// @description A simple script that adds a download button to quickly download all memes.
// @icon        https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://makeitmeme.com&size=256
// @downloadURL https://update.greasyfork.org/scripts/542412/Make%20it%20Meme%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/542412/Make%20it%20Meme%20Download%20Button.meta.js
// ==/UserScript==

setInterval(() => {
    document.querySelector(`[class*="_leftBanner"]`)?.remove();
    document.querySelector(`[class*="_rightBanner"]`)?.remove();
    if(document.querySelector("#dl-btn")) return;
    container = document.querySelector("main");
    console.log(container)
    if(!container) return;

    btn = document.createElement("button");
    btn.setAttribute("tabindex", "0");
    btn.setAttribute("type", "button");
    btn.setAttribute("id", "dl-btn");
    btn.innerText = "DL";
    btn.style.zIndex = "99999";

    btn.addEventListener("click", (e) => {
        const dlPaths = document.querySelectorAll(`[class*="_memesContainer"] path[d*="M8.00433 20.4931C7.96843 19.9968 8.15725 19.512 8.51266 19.188L10.6619 17.2287C11.6142 16.3607 13.0854 17.0803 13.0854 18.4142V34.42C13.0854 35.3261 13.8082 36.0419 14.658 35.9773L32.3658 34.6322C33.0954 34.5767 33.6754 33.9584 33.7257 33.1823L34.9813 13.8205C35.0455 12.8299 35.9514 12.1539 36.8492 12.4267L38.935 13.0605C39.6734 13.2849 40.1245 14.0766 39.9696 14.8766L35.3473 38.7536C35.2068 39.4793 34.6061 40 33.9094 40H10.7747C10.0076 40 9.36983 39.3719 9.31099 38.5585L8.00433 20.4931Z"]`)
        dlPaths.forEach((e) => {e.closest("button").click()});
    });

    container.appendChild(btn);
}, 100)
