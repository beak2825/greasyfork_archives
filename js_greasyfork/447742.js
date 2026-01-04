// ==UserScript==
// @name         MAM Forum Page Re-title
// @namespace yyyzzz999
// @author yyyzzz999
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  12/14/23 Re-title MAM Forum tab to make it easier to see the topic title
// @author       You
// @match        https://www.myanonamouse.net/f/*
// @icon         https://cdn.myanonamouse.net/imagebucket/164109/Mforum.png
// @homepage     https://greasyfork.org/en/users/705546-yyyzzz999
// @supportURL   https://greasyfork.org/en/scripts/447742-mam-forum-page-re-title/feedback
// @grant        none
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/447742/MAM%20Forum%20Page%20Re-title.user.js
// @updateURL https://update.greasyfork.org/scripts/447742/MAM%20Forum%20Page%20Re-title.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

// Icon adapted from https://www.freeiconspng.com/downloadimg/24923

(function() {
    'use strict';

    let arr = [];
    if (document.title.match('>')) {
     arr = document.title.split("> "); // for titles like: "Forums: Support => Tips, Tricks, and Tweaks | My Anonamouse"
        console.log("arr ", arr);
    } else {
     arr = document.title.split(": "); // add space for titles like: "Forums :: View Topic: I messed up :( | My Anonamouse"
        console.log("arr ", arr,arr.length );
    }
     document.title=arr[arr.length-1];

})();