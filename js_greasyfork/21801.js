// ==UserScript==
// @name         lang8
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove the ad of lang8
// @author       evan.z
// @match        http://lang-8.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21801/lang8.user.js
// @updateURL https://update.greasyfork.org/scripts/21801/lang8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementsByClassName('top-ad-large')[0].style.display = 'none';
    //document.getElementById('right').style.display = 'none';
    document.getElementById('count_down_premium').style.display = 'none';
})();