// ==UserScript==
// @name         AISIS remove 0 slots (TALAB enlistment)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  good luck lol
// @author       You
// @match        https://*.aisis.ateneo.edu/*
// @grant        none
// @require http://code.jquery.com/jquery-2.2.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/27394/AISIS%20remove%200%20slots%20%28TALAB%20enlistment%29.user.js
// @updateURL https://update.greasyfork.org/scripts/27394/AISIS%20remove%200%20slots%20%28TALAB%20enlistment%29.meta.js
// ==/UserScript==

(function() {
    'use strict';


    $.expr[":"].containsExact = function (obj, index, meta, stack) {
        return (obj.textContent || obj.innerText || $(obj).text() || "") == meta[3];
    }; //shoutout to Aximili for this lol


    $('.text02:containsExact(0)').each(function(i, obj) {
        $(this).closest('tr').hide();
    });
})();