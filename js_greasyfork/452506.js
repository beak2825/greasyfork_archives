// ==UserScript==
// @name         Redsys testing credit card buttons
// @namespace    https://netflie.es
// @version      0.2
// @description  Add button to test different Redsys testing credit cards
// @author       Álex Albarca
// @match        https://sis-t.redsys.es:25443/sis/realizarPago
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452506/Redsys%20testing%20credit%20card%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/452506/Redsys%20testing%20credit%20card%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;
    $.noConflict();

    $(function() {
        const card = "4548810000000003";
        const cvv_ok = "123";
        const cvv_nok = "999";
        const expiration_month = '12';
        const expiration_year = '49';

        const buttons = "<div class=\"col-wr right\">" +
            "<div style=\"" +
            "width: 235px;" +
            "overflow: hidden;" +
            "margin: 0 auto;" +
            "\">" +
            "<button class=\"btn btn-lg validColor\" type=\"button\" id=\"insert-ok-card\">Tarjeta OK</button>" +
            "<button id=\"insert-nok-card\" class=\"btn btn-lg\" type=\"button\" style=\"" +
            "margin-right: 35px;" +
            "background-color: indianred;" +
            "\">Tarjeta NOK</button></div><div class=\"preft\"></div>" +
            "</div>";

        $(buttons).insertAfter("div[class='col-wr right']");

        let $card = $("#card-number");
        let $expiration = $("#card-expiration");
        let $cvv = $("#card-cvv");
        let $pay_button = $("button.btn-accept");

        $card.val(card);
        $expiration.val(expiration_month + expiration_year);

        $("#insert-ok-card").click(function () {
            $cvv.val(cvv_ok);
            $pay_button.addClass('validColor');
			$pay_button.prop("disabled", false);
        });

        $("#insert-nok-card").click(function () {
            $cvv.val(cvv_nok);
            $pay_button.addClass('validColor');
			$pay_button.prop("disabled", false);
        });
    });
})();