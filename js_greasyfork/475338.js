// ==UserScript==
// @name UserScript demo for Baidu main page.
// @namespace http://tampermonkey.net/
// @version 0.1
// @description  this is the description
// @match *www.baidu.com*
// @grant GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475338/UserScript%20demo%20for%20Baidu%20main%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/475338/UserScript%20demo%20for%20Baidu%20main%20page.meta.js
// ==/UserScript==



function main() {
    // add button to headNav
    let headNav = document.querySelector("#s-top-left");
    let myButton = document.createElement("Button");
    myButton.innerText = 'news';
    myButton.addEventListener('click', () => {
        // get all the news on the right side
        let newsList = document.querySelectorAll(".s-news-rank-content > li > a > span.title-content-title");
        for (const node of newsList) {
            console.log(node.innerText);
        }

    })
    headNav.appendChild(myButton);

}

(function () {
    'use strict';
    main();
})()