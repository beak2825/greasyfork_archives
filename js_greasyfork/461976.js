// ==UserScript==
// @name         Download Zoom Recording
// @version      0.1
// @description  Allow right clicking a zoom video to download
// @author       Joshua Kaplan
// @match        https://*.zoom.us/rec/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @namespace https://greasyfork.org/users/1043295
// @downloadURL https://update.greasyfork.org/scripts/461976/Download%20Zoom%20Recording.user.js
// @updateURL https://update.greasyfork.org/scripts/461976/Download%20Zoom%20Recording.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let old = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type,listener){
        if(type=="contextmenu"){
            return;
        }
        old.apply(this, Array.prototype.slice.apply(arguments));
    }
})();