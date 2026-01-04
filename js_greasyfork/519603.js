// ==UserScript==
// @name         the meaning of life
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  add john sayori's cat to twitter
// @author       cv
// @match        *://x.com/*
// @match        *://twitter.com/*
// @icon         https://avatars.githubusercontent.com/u/186732841?v=4
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519603/the%20meaning%20of%20life.user.js
// @updateURL https://update.greasyfork.org/scripts/519603/the%20meaning%20of%20life.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlchanges = () => {
        let currentURL = window.location.href;
        setInterval(() => {
            if (currentURL !== window.location.href) {currentURL = window.location.href; main()}}, 500);
    };

    const main = () => {const loadwait = setInterval(() => {
            const element = document.querySelector("div.css-175oi2r.r-1awozwy.r-aqfbo4.r-kemksi.r-18u37iz.r-1h3ijdo.r-6gpygo.r-15ysp7h.r-1xcajam.r-ipm5af");
            if (element) {
                loadstuff(element);
                clearInterval(loadwait);
            }
        }, 100)};

    const loadstuff = (element) => {
        setInterval(() => {
            element.innerHTML = "<img src='https://pbs.twimg.com/media/Gd0hSO9XIAAFlud?format=webp&name=medium' height='500px' alt='john sayori\'s photogenic maine coon with noticeably long whiskers. she\'s looking to the side'>";
            element.style.height = "500px"; element.style.position = "relative"; element.style.zIndex = "9999";
        }, 500);
    };

    urlchanges(); main();

})();