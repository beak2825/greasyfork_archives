// ==UserScript==
// @name         bt4g.org Bypass
// @namespace    https://bt4g.org
// @version      0.1
// @description  bt4g bypass!
// @author       You
// @match        https://bt4g.org/magnet/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425277/bt4gorg%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/425277/bt4gorg%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var theAtag = document.querySelector("th a");
    if (theAtag.href.length>0){
        window.location.href=theAtag.href;
    }


})();