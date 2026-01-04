// ==UserScript==
// @name         Snap Community Site dark mode
// @namespace    http://tampermonkey.net/
// @version      2025-03-24
// @description  Dark mode in Snap! Community Site
// @author       this_is_some1
// @match        https://snap.berkeley.edu/*
// @icon         https://snap.berkeley.edu/static/img/favicon.ico
// @grant        none
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533444/Snap%20Community%20Site%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/533444/Snap%20Community%20Site%20dark%20mode.meta.js
// ==/UserScript==

var afsd = document.createElement("div");
afsd.innerHTML = `<style>a {
color: #9d9d9d !important;
}
a h1, a h2, a h3, a h4 {
color: #FFF !important;
}
.collection .description, .project.big .notes {
color: #000 !important;
}
.body {
color: #000 !important;
background-color: rgb(26, 26, 26) !important;
}
body {
color: white !important;
background-color: rgb(26, 26, 26) !important;
}
.pure-button {
background-color: #313131 !important;
}
.nav-link {
color: #FFF !important;
}
.nav-link:hover, .nav-link.show {
color: black !important;
}
</style>`
document.head.appendChild(afsd);
