// ==UserScript==
// @name         RARBBG - Highlight 1080 and Imageset
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlights torrents containing 1080 or Imageset
// @author       clutterskull@gmail.com
// @match        https://rarbg.to/torrents.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20464/RARBBG%20-%20Highlight%201080%20and%20Imageset.user.js
// @updateURL https://update.greasyfork.org/scripts/20464/RARBBG%20-%20Highlight%201080%20and%20Imageset.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

$('.lista a[title]').each(function() {
    if (/(1080|imageset)/i.test($(this).text())) {
        $(this).closest('tr').css({ background: 'rgb(255, 245, 176)' });
    }
});