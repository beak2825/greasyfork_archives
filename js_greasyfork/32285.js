// ==UserScript==
// @name         chatous Text chat button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add a button to start a new text chat on chatous
// @author       You
// @match        https://chatous.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32285/chatous%20Text%20chat%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/32285/chatous%20Text%20chat%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';
     let buttonWrap = document.getElementById('new-button-wrapper');
     let textBut = document.createElement('div');
     textBut.innerHTML = 'new text chat';
     textBut.id = 'newTextChat';
     buttonWrap.append(textBut);
})();