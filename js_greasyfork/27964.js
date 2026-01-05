// ==UserScript==
// @name            Facebook remove annoying video popup
// @namespace       Morten
// @description     Removes the video popup which is fucking annoying
// @include         *.facebook.com*
// @version         1.0
// @downloadURL https://update.greasyfork.org/scripts/27964/Facebook%20remove%20annoying%20video%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/27964/Facebook%20remove%20annoying%20video%20popup.meta.js
// ==/UserScript==

setInterval(function() {
    var elem = document.getElementsByClassName("_360g")[0];
    elem.parentElement.removeChild(elem);
}, 1000);

