// ==UserScript==
// @name         Welearn
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Welearn 10min刷新一次
// @author       Ash
// @match        *://course.sflep.com/*
// @match        *://welearn.sflep.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401555/Welearn.user.js
// @updateURL https://update.greasyfork.org/scripts/401555/Welearn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function myrefresh()
    {
        window.location.reload();
    }
    setTimeout(myrefresh,Math.round(Math.random())*600000); //指定10min内刷新一次
})();