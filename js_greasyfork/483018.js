// ==UserScript==
// @name         Simple skribbl.io Menu
// @version      1.0.2
// @description  A simple version of the skribbl.io main menu screen.
// @author       104xvision
// @match        https://skribbl.io/*
// @run-at       document-end
// @license      MIT
// @namespace https://greasyfork.org/users/1238418
// @downloadURL https://update.greasyfork.org/scripts/483018/Simple%20skribblio%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/483018/Simple%20skribblio%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementsByClassName("bottom")[0].remove();
    document.getElementsByClassName("avatar-container")[0].remove();
    document.getElementsByClassName("panel")[0].style.marginTop = '170px';
    document.getElementsByClassName("panel")[0].style.marginLeft = '-15';
    document.getElementsByTagName("select")[0].style.display = 'contents';
})();