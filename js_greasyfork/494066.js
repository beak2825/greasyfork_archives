// ==UserScript==
// @name         genshin-impact-map.appsample right bar hider
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide the annoying right bar from https://genshin-impact-map.appsample.com/
// @author       Celest
// @match        https://genshin-impact-map.appsample.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494066/genshin-impact-mapappsample%20right%20bar%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/494066/genshin-impact-mapappsample%20right%20bar%20hider.meta.js
// ==/UserScript==

(function() {
    'use strict';


    window.addEventListener('load', function() {

        var rightbar = document.querySelector('.MapLayout_Rightbar');
        if (rightbar) {
            rightbar.style.display = 'none';
        }
    });
})();