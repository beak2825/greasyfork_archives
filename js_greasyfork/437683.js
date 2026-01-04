// ==UserScript==
// @name         OxTorrent
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Remove ads
// @author       Ynizon
// @match        https://www.oxtorrent.*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437683/OxTorrent.user.js
// @updateURL https://update.greasyfork.org/scripts/437683/OxTorrent.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var tags = document.getElementsByTagName('script');
     tags.forEach(element => element.parentNode.removeChild(element));
     tags = document.getElementsByTagName('noscript');
     tags.forEach(element => element.parentNode.removeChild(element));
})();