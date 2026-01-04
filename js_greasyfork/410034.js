// ==UserScript==
// @name         Get related products
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://krez.bg/selection/*
// @grant        none
// @namespace https://greasyfork.org/users/683155
// @downloadURL https://update.greasyfork.org/scripts/410034/Get%20related%20products.user.js
// @updateURL https://update.greasyfork.org/scripts/410034/Get%20related%20products.meta.js
// ==/UserScript==

var $ = jQuery;

(function() {
    'use strict';

    $('.js-product-compare').remove();
    $('._product-options').remove();
    if ($('.one-fourth').length % 4 < 2) {
        $('.one-fourth').addClass('one-third').removeClass('one-fourth');
    }
    var element = '._products-list.no-button.no-quick-view';
    $(document).on('click', 'img', function (event) {
        event.preventDefault();
        $(this).closest('._product').remove();
        var $temp = $("<textarea cols='60' rows='25' style='display: block; position: absolute; top: 30%; left: 30%; width: 400px; z-index: 99999;box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);'>");
        $("body").append($temp);
        $temp.text('<h3 align="center">СВЪРЗАНИ ПРОДУКТИ</h3><p>&nbsp;</p>' + $(element)[0].outerHTML);
        $temp.select();
        document.execCommand("copy");
    });
})();
