// ==UserScript==
// @name         dtf show video controls
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  dtf show controls
// @author       bonan
// @match        *://dtf.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dtf.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458313/dtf%20show%20video%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/458313/dtf%20show%20video%20controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function renderControl() {
        document.querySelectorAll('video').forEach(vid => { vid.controls = true })
    }
    setTimeout(renderControl)
    setInterval(renderControl, 1000)
})();