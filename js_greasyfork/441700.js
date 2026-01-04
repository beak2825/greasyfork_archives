// ==UserScript==
// @name         Torecolo Tool
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Export and import torecolo shopping cart
// @author       ZeroX
// @match        https://www.torecolo.jp/shop/cart/cart.aspx
// @grant        GM_download
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/441700/Torecolo%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/441700/Torecolo%20Tool.meta.js
// ==/UserScript==

var scrUIdata = "<div class=\"container\" id=\"scr_menu\">"+
    "<div class=\"container\">"+
    "<button type=\"button\" class=\"btn btn-primary\" style=\"font-size: 20px; margin: 5px;\" id=\"scr_export\">Export Cart</button>"+
    "<input type=\"file\" id=\"scr_import_file\" />"+
    "<button type=\"button\" class=\"btn btn-primary\" style=\"font-size: 20px; margin: 5px;\" id=\"scr_import\">Import Cart</button>"+
    "</div>";

(function () {
    "use strict";
    $(document).ready(function () {
        $("body").prepend(scrUIdata);
        $("#scr_export").click(export_cart);
        $("#scr_import").click(import_cart);
    });
})();

var cartList = [];

function addItem(id, quantity) {
    var cartItem = "goods="+id+"&qty="+quantity+"&crsirefo_hidden=";
    cartList.push(cartItem);
}

function export_cart() {
    cartList = [];
    $(".js-enhanced-ecommerce-item").each(function (index) {
        var quantity = $(this).find("input[name^=qty]").val();
        var id = $(this).find("input[name^=rowgoods]").val();
        addItem(id, quantity);
    });
    var cart = JSON.stringify(cartList);
    download("torecolo_cart.json", cart);
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function addToCart(item) {
    var crsirefo = crsirefo_jscart;
    $.ajax({
        method: "POST",
        url: "/shop/js/addcart.aspx",
        data: item+crsirefo,
    });
}

function import_cart() {
    let file = $("#scr_import_file")[0].files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
        var cart = JSON.parse(reader.result);
        $.each(cart, function(i) {
            addToCart(this);
        });
    };
}