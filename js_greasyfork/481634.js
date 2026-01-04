// ==UserScript==
// @name         GC - Wise Old King
// @version      1.0.0
// @description  Autofill words of wisdom
// @author       Humro
// @match        https://www.grundos.cafe/medieval/wiseking*
// @match        www.grundos.cafe/medieval/wiseking*
// @match        https://grundos.cafe/medieval/wiseking*
// @match        grundos.cafe/medieval/wiseking*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/1229448
// @downloadURL https://update.greasyfork.org/scripts/481634/GC%20-%20Wise%20Old%20King.user.js
// @updateURL https://update.greasyfork.org/scripts/481634/GC%20-%20Wise%20Old%20King.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('document').ready( function() {
        $('#wisdom1').val('A wise friend once told me that');
        $('#wisdom2').val('pride');
        $('#wisdom3').val('is like');
        $('#wisdom4').val('the tenacity of');
        $('#wisdom5').val('a school of');
        $('#wisdom6').val('arrogant');
        $('#wisdom7').val('Grarrls');
    });
})();