// ==UserScript==
// @name         X.com (Twitter) Dark Mode
// @namespace    https://tampermonkey.net/
// @version      1.6
// @description  Dark mode for X.com (formerly Twitter)
// @author       Streampunk
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACWUlEQVRYhe2WTU4bQRCFv9c2CYso8Swj7HhuEG4QcwLMCWIvcMQOTgA+AexQ7Ej4COQEtk+QyQkyCSBlN4OUVbCnsgCD/xkTUBTJbzfVrXpfdfV0Nyy11D+WHitR/jgqkdW+YB3IYYSgzlU/qf/c8cLheb9WCeKqF08ArDWiCkbu4oN3tIj5m+blvmEHs8YtsbpBLKdNmcKz2qvqYGwEoNCITpE2k8T20kKsNaKKk07SzJURur5tXGXIXdS8AMCNkEpFAOd0mG9e7qdJ6pxSzRPECQT9FbWdwx+K3ynfjL/c9PCGiND6Vj3f8TrTkuaPo5KyaqcBuMtp1bOa17otYGywO4btK6t2vhm3X3+MyhO5MneVpFFPtjVsDpAd+VjhKOnx3iA3ykEp61QqNOPYjI6ZdZUQIFcESw3w/IpgPDYCEEP8EquDDmfkyEmUJZWv1y69OUC8SjwX4EWPIEHfJEJsseVN4z/494c1tgc4FZSewBwz+zotPgKQhdZjGw9pov8TAGHNC4TtPYW7zSjOjQd+bHtHmFUlwkczN+sOTr57AQBk5JLEPovJXfsQaU5rs9OCiSMQOlzsJ5shU+uslpsJMHUFzre9jrD633rLCDP9ZG6eue+BQiOqALtIbx8CYNjG+fb0eyQVwEB+I1pPpPb4ET3fffTSeRCA34jWe3KbwnZJaX597drWfZVPABQ+ReUkISfDl1wRZ4ufiGbdTJ9KOPQESw0Atz2vIL1b1NjEQdqqZwIM5J9EfvKbsokS4EsqDvoviM3sO0YgCNwzWuGUS2appf4b/QHXNfBk6YeX2wAAAABJRU5ErkJggg==
// @run-at       document-idle
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        GM_addStyle
// @grant        GM.addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460921/Xcom%20%28Twitter%29%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/460921/Xcom%20%28Twitter%29%20Dark%20Mode.meta.js
// ==/UserScript==


GM.addStyle ( `
    /* You can change the colors of your choice */
	
    /* page background color */
    body {
    background-color:#030303!important;
    }

    /* text color */
    .css-1jxf684 {
    color: rgba(210, 207, 207, 1);
    }

    /* text background color */
    .r-14lw9ot {
    background-color: rgba(22, 22, 22, 1);
    }

    /* post footer background color */
    .r-1h3ijdo {
    background-color: rgba(22, 22, 22, 1);
    }

    /* border style */
    .r-1phboty {
    border-bottom-style:none;border-left-style:none;border-right-style:none;border-top-style:none;
    }

    /* tweets border width */
    .r-rs99b7 {
    border-bottom-width:0px;border-left-width:0px;border-right-width:0px;border-top-width:0px;
    }

` );