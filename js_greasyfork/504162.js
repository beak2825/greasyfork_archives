// ==UserScript==
// @name         CW: Replacements
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Перестановка блоков
// @copyright    2021, Тис (https://catwar.su/cat930302)
// @license      MIT; https://opensource.org/licenses/MIT
// @include      /https:\/\/\w?\.?catwar\.su\/.*/
// @icon         https://www.google.com/s2/favicons?domain=catwar.su
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/504162/CW%3A%20Replacements.user.js
// @updateURL https://update.greasyfork.org/scripts/504162/CW%3A%20Replacements.meta.js
// ==/UserScript==
/*global jQuery*/
(function (window, document, $) {
    'use strict';
    if (typeof $ === 'undefined') return;
    const version = '0.1';
    const isDesktop = !$('meta[name=viewport]').length;
    // const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    const pageurl = window.location.href;
    const isCW3 = (/^https:\/\/\w*\.?catwar.su\/cw3(?!(\/kns|\/jagd))/.test(pageurl));
    try {
        if (isCW3) cw3();
    }
    catch (err) {
        window.console.error('CW:Replacements error: ', err);
    }
    function cw3() {
        if (isDesktop) {
            $('head').append(`<style id="cwr">.cwr_infos { padding: 0 .75em; }</style>`);
            $('#info_main > tbody').append('<tr id="cwr_history_tr"></tr>');

            var $hist_tr = $('#cwr_history_tr'),
                $history = $('#history').attr('colspan', 2);
            $hist_tr.append($history);
            $('#info_main .infos').not('#parameter').removeClass('infos').addClass('cwr_infos');

            $history.children('h2').attr('align', 'center');
            $history.children('#history_block').attr('align', 'justify');
        }
    }
    // Your code here...
})(window, document, jQuery);