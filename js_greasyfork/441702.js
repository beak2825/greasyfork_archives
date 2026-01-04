// ==UserScript==
// @name         Yuyu-tei Tool
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Export and import yuyu-tei shopping cart
// @author       ZeroX
// @match        https://yuyu-tei.jp/cart/sell
// @grant        GM_download
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/441702/Yuyu-tei%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/441702/Yuyu-tei%20Tool.meta.js
// ==/UserScript==

var scrUIdata = "<button type=\"button\" class=\"btn btn-primary rounded-0 position-relative fs-6 btn-sm px-3 mx-2\" style=\"font-size: 14px; !important; height: 27px; line-height: 1.2; font-weight: bold;\" id=\"scr_export\">Export</button>"+
    "<input type=\"file\" id=\"scr_import_file\" style=\"max-width: 90px;\" />"+
    "<button type=\"button\" class=\"btn btn-primary rounded-0 position-relative fs-6 btn-sm px-3 mx-2\" style=\"font-size: 14px; !important; height: 27px; line-height: 1.2; font-weight: bold;\" id=\"scr_import\">Import</button>";

(function () {
    "use strict";

    $(document).ready(function () {
        $("#navbarSupportedContent > div").prepend(scrUIdata);
        $("#scr_export").click(export_cart);
        $("#scr_import").click(import_cart);
    });
})();

var cartList = [];
var cart = [];
var current;

function addItem(gid, ver, cid, kizu, quantity) {
    var cartItem = {"gid":gid,"ver":ver,"cid":cid,"mode":"add","type":"sell","counter":quantity,"kizu":kizu};
    cartList.push(cartItem);
}

function export_cart() {
    cartList = [];
    $("div[id^='itemInfo']")
        .each(function (index) {

        var quantity = $(this).find("[id^='itemValue']").val();
        var url = $(this).find("a.noneline").attr("href").split("/");
        var ver = url[url.length-2];
        var cid = url[url.length-1];
        var kizu = $(this).find("[id^='itemData']").val().slice(-1);
        var gid = $(this).find("[id^='itemData']").val().replace(ver+cid+kizu,"");

        addItem(gid, ver, cid, kizu, quantity);
    });

    cart = JSON.stringify(cartList);
    download("yuyutei_cart.json", cart);
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

function addNext() {
    if (current < cart.length) {
        addToCart(cart[current]);
        current++;
    } else {
        location.reload();
    }
}

function addToCart(item) {
    $.ajax({
        method: "GET",
        url: "/api/cart_order_edit",
        data: item,
        complete: function() {
            addNext();
        }
    });
}

function import_cart() {
    let file = $("#scr_import_file")[0].files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
        cart = JSON.parse(reader.result);
        current = 0;
        addNext();
    };
}