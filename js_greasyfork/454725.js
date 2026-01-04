// ==UserScript==
// @name        github clone enhancement
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*
// @grant       none
// @version     1.0
// @license MIT
// @author      boatrainlsz
// @description 2020/7/1 上午10:56:13
// @downloadURL https://update.greasyfork.org/scripts/454725/github%20clone%20enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/454725/github%20clone%20enhancement.meta.js
// ==/UserScript==
(function () {
    let clipboard = document.getElementsByTagName("clipboard-copy");
    //return is clipboard-copy is not exist
    if (clipboard.length == 0) {
        return
    }
//prepend 'git clone' to clipboard's value attribute
    clipboard[0].setAttribute("value", "git clone " + clipboard[0].getAttribute("value"));
})();