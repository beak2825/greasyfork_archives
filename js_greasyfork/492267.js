// ==UserScript==
// @name         cleans the fucking proxy.php
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  cleans the fucking proxy.php fuck!!!!
// @author       https://greasyfork.org/ru/users/1065796-kazaev
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @match        https://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492267/cleans%20the%20fucking%20proxyphp.user.js
// @updateURL https://update.greasyfork.org/scripts/492267/cleans%20the%20fucking%20proxyphp.meta.js
// ==/UserScript==

function init() {
    Array.from(document.querySelectorAll('a'))
        .filter(a => a.href.includes('https://' + window.location.hostname + '/proxy.php?link='))
        .forEach(a => a.href = new URL(a.href).searchParams.get('link'));
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