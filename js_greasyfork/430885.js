// ==UserScript==
// @name         agenda dedeman
// @namespace    dedeman
// @version      1.0
// @description  formatare numar de telefon
// @icon         https://i.dedeman.ro/dedereact/design/images/small-logo.svg
// @author       Dragos
// @match        http*://agenda.dedeman.ro/app/search.php*
// @match        http*://agenda.dedeman.ro/app/magazin.php*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430885/agenda%20dedeman.user.js
// @updateURL https://update.greasyfork.org/scripts/430885/agenda%20dedeman.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
    $(".card > .cardBodyAngajat > .contactTable > tbody > tr:nth-of-type(2) > td:nth-of-type(2)").each(function() {
        $(this).html($(this).html().replace(/(\d{4})(\d{3})(\d{3})/,"$1 $2 $3"));
    });
    $("#tbody > tr > td:nth-of-type(5)").each(function() {
        $(this).html($(this).html().replace(/(\d{4})(\d{3})(\d{3})/,"$1 $2 $3"));
    });
})();