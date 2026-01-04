// ==UserScript==
// @name         Go to read
// @version      0.1
// @description  Because I don't want to read scripts
// @author       A Meaty Alt
// @match        http://lhtranslation.com/*
// @grant        none
// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/35180/Go%20to%20read.user.js
// @updateURL https://update.greasyfork.org/scripts/35180/Go%20to%20read.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var match = location.href.match(/chapter-(.*?)\d+/);
    if(match){
        var series = location.href.match(/\.com\/(.*?)\-chapter/)[1];
        location.href = "http://read.lhtranslation.com/read-"+series+"-"+match[0] + ".html";
    }
})();