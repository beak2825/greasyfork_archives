// ==UserScript==
// @name         CityU Canvas File Preview Fixer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fix CityU Canvas File Preview
// @author       Benedict
// @match        https://canvas.cityu.edu.hk/courses/*
// @icon         https://www.google.com/s2/favicons?domain=cityu.edu.hk
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/436548/CityU%20Canvas%20File%20Preview%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/436548/CityU%20Canvas%20File%20Preview%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function GM_addStyle (cssStr) {
        var D = document;
        var newNode = D.createElement ('style');
        newNode.textContent = cssStr;
        var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
        targ.appendChild (newNode);
    }
    $('body').on('click', '.ef-file-preview-header-close.ef-file-preview-button', function(){
        $('body').css('overflow', 'auto');
    });
    $('body').on('click', '.file_preview_link', function(){
        $(this).removeClass('file_preview_link').addClass('inline_disabled preview_in_overlay');
        $(this).data('canvas-previewable', 'false');
        $('body').css('overflow', 'hidden');
    });
    $('body').on('click', '.preview_in_overlay', function(){
        $('body').css('overflow', 'hidden');
    });
    GM_addStyle(`
        span[dir="ltr"] > span > span {
            position: sticky;
        }
    `);
})();