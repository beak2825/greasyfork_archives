// ==UserScript==
// @license MIT
// @name         See-friends-codeforces
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Introduces a button which takes you to the friends standings directly
// @author       Abhishek
// @match        https://codeforces.com/*/problem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448975/See-friends-codeforces.user.js
// @updateURL https://update.greasyfork.org/scripts/448975/See-friends-codeforces.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let url = window.location;
    let contestId = url.toString().split("/").filter((x)=>{
        if(typeof x !== 'string'){return;}
        const num = Number(x);
        if(Number.isInteger(num)){return num;}
    })[0];

    let friendBtn = document.createElement('li');
    friendBtn.innerHTML = `<a href="https://codeforces.com/contest/${contestId}/standings/friends/true">See Friends</a>`;
    friendBtn.classList.add('friendBtn')
    document.querySelector(".second-level-menu-list").appendChild(friendBtn);


})();