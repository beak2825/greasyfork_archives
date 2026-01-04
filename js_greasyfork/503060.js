// ==UserScript==
// @name        hb_tax_info
// @namespace   http://tampermonkey.net/
// @license     MIT
// @description hb tax info
// @include     http*://www.humblebundle.com/*
// @grant       unsafeWindow
// @version     2025.08.04.1
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/503060/hb_tax_info.user.js
// @updateURL https://update.greasyfork.org/scripts/503060/hb_tax_info.meta.js
// ==/UserScript==

var m = /country_code: "([^"]+)/.exec(document.head.innerHTML);
if (m) {
    var c = m[1];
    m = /"email": "([^"]+)", "selectedRegion": "([^"]*)"}/.exec(document.head.innerHTML);
    if (m)
        c = `${c}|${m[2]}|${m[1]} `;
    $('.tabs-navbar-item').append(`<div class="navbar-item button-title">${c}</div>`);
    $('.tabs-navbar-item').append('<a class="navbar-item not-dropdown button-title" href="javascript:void(0);" onclick="tax();">TAX</a><span class="navbar-item not-dropdown button-title" id="tax"></span>');
}

unsafeWindow.tax = function(a){
    $('#tax').empty();
    $.ajax({
        url: '/api/v1/tax_rate',
        type: "GET",
        dataType : 'json',
        success: function( data, status, xhr ){
            if (data.tax_rate){
                $('#tax').after(data.tax_rate);
            } else {
                $('#tax').after("0");
            }
        },
        fail: function( data, status, xhr ){
            alert(status);
        }
    });
}