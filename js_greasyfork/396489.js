// ==UserScript==
// @name         Jira summary to Clipboard for commit log
// @namespace    sremy
// @version      1.1
// @description  Quick copy of task key and summary from JIRA 6.x to Clipboard (for commit)
// @author       Sébastien REMY
// @match        https://jira.atlassian.com/browse/*
// @match        http://localhost:8080/browse/*
// @require      https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js
// @require      https://cdn.jsdelivr.net/npm/notify-js-legacy@0.4.1/notify.min.js
// @downloadURL https://update.greasyfork.org/scripts/396489/Jira%20summary%20to%20Clipboard%20for%20commit%20log.user.js
// @updateURL https://update.greasyfork.org/scripts/396489/Jira%20summary%20to%20Clipboard%20for%20commit%20log.meta.js
// ==/UserScript==

var $ = jQuery; // or https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js

let clipboard = new ClipboardJS('#clipboardBtn', {
    text: function(trigger) {
        return $('#key-val').text() + ' ' + $('#summary-val').text();
    }
});

clipboard.on('success', function(e) {
    $.notify("Copied to clipboard. " + e.text, "info");
});

clipboard.on('error', function(e) {
    $.notify("Failed to copy", "error");
});

function init() {
    'use strict';

    if(!$('#clipboardBtn').length) {
        $('.toolbar-split-left').append('<button id="clipboardBtn" class="aui-button aui-style"> <svg viewBox="0 0 896 1024" width="15" xmlns="http://www.w3.org/2000/svg"> <path d="M128 768h256v64H128v-64z m320-384H128v64h320v-64z m128 192V448L384 640l192 192V704h320V576H576z m-288-64H128v64h160v-64zM128 704h160v-64H128v64z m576 64h64v128c-1 18-7 33-19 45s-27 18-45 19H64c-35 0-64-29-64-64V192c0-35 29-64 64-64h192C256 57 313 0 384 0s128 57 128 128h192c35 0 64 29 64 64v320h-64V320H64v576h640V768zM128 256h512c0-35-29-64-64-64h-64c-35 0-64-29-64-64s-29-64-64-64-64 29-64 64-29 64-64 64h-64c-35 0-64 29-64 64z" /> </svg> </button>');
    }
}

$(document).ajaxComplete(init);