// ==UserScript==
// @name         Static_Chat_Pos_by_el9in
// @namespace    Static_Chat_Pos_by_el9in
// @version      0.1
// @description  Static position
// @author       el9in
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @match        https://lzt.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        unsafeWindow
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/466454/Static_Chat_Pos_by_el9in.user.js
// @updateURL https://update.greasyfork.org/scripts/466454/Static_Chat_Pos_by_el9in.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const h = 71;
    const w = 1332;

    function init() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const chatFloating = document.querySelector('.chat2-floating');
        if (chatFloating && windowWidth >= w && windowHeight >= h && windowWidth >= (w + parseInt(chatFloating.style.width.slice(0, -2))) && windowHeight >= (h + parseInt(chatFloating.style.height.slice(0, -2)))) {
            chatFloating.style.top = `${h}px`;
            chatFloating.style.left = `${w}px`;
        } else if(chatFloating && windowWidth >= parseInt(chatFloating.style.left.slice(0, -2))) {
            chatFloating.style.left = `${windowWidth - parseInt(chatFloating.style.width.slice(0, -2)) - 30}px`;
        }
    }

    const startFloating = document.querySelector('.chat2-floating');
    if(startFloating) {
        init();
        window.addEventListener('resize', init);
    }
})();