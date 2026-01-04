// ==UserScript==
// @name         only one domain
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  edit domaines
// @author       https://greasyfork.org/ru/users/1065796-kazaev
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @match        https://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497987/only%20one%20domain.user.js
// @updateURL https://update.greasyfork.org/scripts/497987/only%20one%20domain.meta.js
// ==/UserScript==

const alterDomain = ['zelenka.guru', 'lolz.guru', 'lolz.live'];

function init() {
    Array.from(document.querySelectorAll('a'))
        .filter(a => alterDomain.some(domain => a.href.includes(domain)))
        .forEach(a => {
        const url = new URL(a.href);
        url.hostname = window.location.hostname;
        a.href = url.href;
    });
    //if (window.location.hostname !== alterDomain[0]) {
    //    window.location.hostname = alterDomain[0];
    //}
}

function onLoad(fn) {
    document.addEventListener('page:load', fn);
    document.addEventListener('turbolinks:load', fn);

    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

onLoad(init);