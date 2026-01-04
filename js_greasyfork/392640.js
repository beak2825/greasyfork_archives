// ==UserScript==
// @name         MT price-raiser
// @namespace    https://greasyfork.org/en/users/370170
// @version      0.3
// @description  Script for raising worker_price by 20% for BPK
// @author       Radoslaw Rusek
// @match        *://app.mediatask.pl/*/*/transitions/new?event=make_offer
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/392640/MT%20price-raiser.user.js
// @updateURL https://update.greasyfork.org/scripts/392640/MT%20price-raiser.meta.js
// ==/UserScript==
$.noConflict();

function url_content(url) {
    return $.get(url);
}

function get_project_url(url) {
    var newPathname = "";
    for (var i = 0; i < url.length - 2; i++) {
        if (i > 0)
            newPathname += "/";
        newPathname += url[i];
    }
    return newPathname;
}
jQuery(document).ready(function($) {
    'use strict';
    var client = "";
    url_content(get_project_url(window.location.href.split('/'))).success(function(data) {
        client = $(data).find('.order-id').html().split('\\')[0].trim();
        if (client == "BPK") {
            $("button[name='transition']").one('click', function(e) {
                e.preventDefault();

                var oldPrice = parseFloat($("#order_worker_price").val());
                var newPrice = oldPrice + (oldPrice * 0.2);
                $("#order_worker_price").val(Math.ceil(newPrice));

                // and when you done:
                $(this).click();
            });
        }
    });
});