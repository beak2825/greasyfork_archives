// ==UserScript==
// @name         RARBBG - Full size mouseover
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Shows the full poster on mouse over instead of the thumbnail.
// @author       clutterskull@gmail.com
// @match        https://rarbg.to/torrents.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20241/RARBBG%20-%20Full%20size%20mouseover.user.js
// @updateURL https://update.greasyfork.org/scripts/20241/RARBBG%20-%20Full%20size%20mouseover.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

document._onmousemove = document.onmousemove;
document.onmousemove= null;

$('#overlib').css({ position: 'fixed', top: 10, right: 10, left: 'auto' })

$('.lista a').each(function() {
    var matches = String($(this).attr('onmouseover')).match(/static\/over\/(\w+\.\w+)/i);
    if (matches) {
        $(this).attr('onmouseover', 'return overlib(\'<img src="//dyncdn.me/posters2/' + matches[1][0] + '/' + matches[1] + '" border=0>\')');
    }
});