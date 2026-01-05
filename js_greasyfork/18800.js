// ==UserScript==
// @name       RuRa Remove Thread 51193
// @namespace  https://www.youtube.com/watch?v=dQw4w9WgXcQ
// @author       D. Drumpf
// @version    0.1
// @description  Removes thread ID #51193 (thread_51193)
// @match      *://*.rubbins-racin.com/forums/*
// @copyright  2016
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/18800/RuRa%20Remove%20Thread%2051193.user.js
// @updateURL https://update.greasyfork.org/scripts/18800/RuRa%20Remove%20Thread%2051193.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('ol#threads li#thread_51193').remove();
    $('.lastposttitle a[href*="51193"]').each(function() {
        //alert("Contains thread.");
        this.closest('div').remove();
    });
});