// ==UserScript==
// @name         m-team quick jump handler for javlibrary
// @namespace    http://tampermonkey.net/
// @version      2024-04-15
// @description  useful function for m-team quick download
// @author       some good people
// @match        https://www.javlibrary.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javlibrary.com
// @license MIT 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492566/m-team%20quick%20jump%20handler%20for%20javlibrary.user.js
// @updateURL https://update.greasyfork.org/scripts/492566/m-team%20quick%20jump%20handler%20for%20javlibrary.meta.js
// ==/UserScript==

(function() {
    'use strict';
     const getTargetUrl = (code) => `https://kp.m-team.cc/browse/adult?keyword=${code}`
     const code = $('#avid').attr('avid');
     $('#avid').append(`<a style="display: block;" target="_blank" href="${getTargetUrl(code)}">m-team</a>`);
})();