// ==UserScript==
// @name         Kbin Move Comments below New Comment Control
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  On the KBin website, move the Add Comment block before all the comments
// @author       CodingAndCoffee
// @match        https://kbin.social/m/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468461/Kbin%20Move%20Comments%20below%20New%20Comment%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/468461/Kbin%20Move%20Comments%20below%20New%20Comment%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const comments = document.querySelector('#comments');
    const commentAdd = document.querySelector('#comment-add');

    comments.parentNode.insertBefore(commentAdd, comments);
})();