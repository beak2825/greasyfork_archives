// ==UserScript==
// @name         Fake 505 Screen For Canvas
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Use this to get out of homework. Not recommended for school work, because they will contact support and find out. If your trying to get out of homework make sure to unpin the extension if its pinned. Make sure to replace https or http with * and put /* where the dash is in your school url. If you use this url then your good. Have fun using this for whatever on canvas!
// @author       You
// @match        *://ycsd.instructure.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instructure.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445825/Fake%20505%20Screen%20For%20Canvas.user.js
// @updateURL https://update.greasyfork.org/scripts/445825/Fake%20505%20Screen%20For%20Canvas.meta.js
// ==/UserScript==

(function() {
    'use strict';
     document.write('<title>505 Internal Server Error</title> <h1>505 Internal Server Error</h1>')
     window.stop()
})();