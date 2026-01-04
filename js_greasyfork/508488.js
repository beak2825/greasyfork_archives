// ==UserScript==
// @name         minitoon dark mode?
// @namespace    http://tampermonkey.net/
// @version      09-14-24v1.0
// @description  gays make more minitoon scripts :c
// @author       iNeonz on discord frfr
// @match        https://minitoon.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=minitoon.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508488/minitoon%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/508488/minitoon%20dark%20mode.meta.js
// ==/UserScript==

function thefuckingcss(css) {
    let head = document.head;
    let sty = document.createElement('style');
    sty.type = 'text/css';
    sty.innerHTML = css;
    head.appendChild(sty);
}

thefuckingcss(`
.default-main, body {
background-color: #1d1d21;
}

.topbar-container {
background: #2e2f33 !important;
}

.mt-posts-c {
background: rgb(36 37 41 / 86%);
}

.mtviewer-background, .mtviewer-comments-c3, .seviewer-title-c2, .seviewer-content-c, .seviewer-c3, .seviewer-updda-content, .ss-content, .mtviewer-desc-c2 {
background: rgb(10 10 10 / 80%) !important;
}

.seviewer-first-c {
background: rgb(40 40 40 / 70%) !important;
}

.mt-post-c, .mt-serie-c {
background-color: #424149 !important;
color: #efefef !important;
border-color: #292931;
}

.mt-post-sep span {
background: rgb(38 38 51) !important;
color: white !important;
}

.mt-serie-title, .mt-serie-updates, .topbar-account, .topbar-button, .mtviewer-author, .mtviewer-followers, .mtviewer-left-buttons, .mtviewer-title, .mtviewer-heart-like, .mtviewer-ncomments-n, .mtviewer-heart-n, .postpage-title, .profilepage-stat, .postpage-series-c, .postpage-series-c-title, .mt-series-username, .mt-post-username, .postpage-title2 {
color: white !important;
}

.seviewer-title, .seviewer-desc, .seviewer-author, .seviewer-author-link, .seviewer-followers, .seviewer-updda-desc2, .seviewer-chap-date, .mtviewer-desc-top, .mtviewer-comments-title, .mtviewer-comments-bottomb, #mt-posts-top-seemore {
color: white !important;
}

.mt-post-title {
color: #e6e6e6 !important;
}

.mt-posts-title {
color: white !important;
}
`);