// ==UserScript==
// @name         Facebook Fix Left Column
// @namespace    undefined
// @version      0.1
// @description  Freeze the left hand column of the newsfeed in position
// @author       JamesBoson
// @match        http//*.facebook.com/*
// @match        https://*.facebook.com/*
// @grant        none
// @run-at       document-end
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/25976/Facebook%20Fix%20Left%20Column.user.js
// @updateURL https://update.greasyfork.org/scripts/25976/Facebook%20Fix%20Left%20Column.meta.js
// ==/UserScript==


window.onload = function(){
    'use strict';
    var att = document.createAttribute("style");
    att.value = "position: fixed;";
    var leftCol = document.getElementById('leftCol');
    document.getElementById('leftCol').setAttributeNode(att);
};
