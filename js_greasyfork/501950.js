// ==UserScript==
// @name         shorts-annihilator
// @namespace    https://github.com/azeman/shorts-annihilator/
// @version      1
// @description  Better, less-toxic Youtube Shorts
// @match        *://www.youtube.com/shorts/*
// @grant        none
// @license      GNU 3
// @downloadURL https://update.greasyfork.org/scripts/501950/shorts-annihilator.user.js
// @updateURL https://update.greasyfork.org/scripts/501950/shorts-annihilator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.location.replace(window.location.href.replace('www.youtube.com/shorts/', 'youtube.com/v/'));
})();
