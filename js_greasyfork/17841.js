// ==UserScript==
// @name        Reimu Unhide
// @namespace   https://blog.reimu.net
// @description Unhide hidden content
// @include     https://blog.reimu.net/archives/*
// @exclude     https://blog.reimu.net/archives/category/*
// @exclude     https://blog.reimu.net/archives/4059
// @version     1.21
// @icon         https://blog.reimu.net/wp-content/uploads/2016/02/cropped-logo-32x32.png
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17841/Reimu%20Unhide.user.js
// @updateURL https://update.greasyfork.org/scripts/17841/Reimu%20Unhide.meta.js
// ==/UserScript==

(function () {
    var pre = document.getElementsByTagName('pre')[0]; 
    pre.style.display = 'block';
  })();
