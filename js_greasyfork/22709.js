// ==UserScript==
// @name        Unborder
// @namespace   binoc.software.projects.userscript.unborder
// @description Injects some CSS to remove the default active state dotted border from objects
// @include     http://*
// @include     https://*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22709/Unborder.user.js
// @updateURL https://update.greasyfork.org/scripts/22709/Unborder.meta.js
// ==/UserScript==

function funcUnborder() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'binoc.software.projects.userscript.unborder';
    style.innerHTML = 'a:active, a:focus, input, object, canvas, embed, video, audio { outline:none; -moz-outline-style: none; } button::-moz-focus-inner { border: 0; }';

    document.getElementsByTagName('head')[0].appendChild(style)
}

window.onload = funcUnborder;