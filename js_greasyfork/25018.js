// ==UserScript==
// @name         freenode.net soft hyphen strip script
// @namespace    leet-soft-hyphen-strip-script
// @version      0.1
// @description  Will strip soft hyphens from text copied from https://freenode.net
// @match        https://freenode.net/*
// @match        http://freenode.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25018/freenodenet%20soft%20hyphen%20strip%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/25018/freenodenet%20soft%20hyphen%20strip%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('copy', function(e){
        let oldtext = window.getSelection().toString();
        let newtext = oldtext.replace(/\u00AD/g,"");

        e.clipboardData.setData('text/plain', newtext);
        e.clipboardData.setData('text/html', newtext.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
        e.preventDefault();
    });
})();