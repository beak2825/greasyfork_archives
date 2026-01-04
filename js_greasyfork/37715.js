// ==UserScript==
// @name         Nyaa.si : Base32 to Hex
// @namespace    https://blog.rhilip.info/
// @version      0.1
// @description  将Nyaa.si默认的magnet格式由Base32改成Hex，方便百度云离线或其他BT软件下载
// @author       Rhilip
// @match        http*://*.nyaa.si/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37715/Nyaasi%20%3A%20Base32%20to%20Hex.user.js
// @updateURL https://update.greasyfork.org/scripts/37715/Nyaasi%20%3A%20Base32%20to%20Hex.meta.js
// ==/UserScript==

var hD = '0123456789ABCDEF';

function dec2hex(d) {
    var h = hD.substr(d & 15, 1);
    while (d > 15) {
        d >>= 4;
        h = hD.substr(d & 15, 1) + h;
    }
    return h;
}

var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=";

function base32_decode(input) {
    var buffer = 0;
    var bitsLeft = 0;
    var output = [];
    var i = 0;
    var count = 0;

    while (i < input.length) {
        var val = keyStr.indexOf(input.charAt(i++));
        if (val >= 0 && val < 32) {
            buffer <<= 5;
            buffer |= val;
            bitsLeft += 5;
            if (bitsLeft >= 8) {
                output[count++] = (buffer >> (bitsLeft - 8)) & 0xFF;
                bitsLeft -= 8;
            }
        }
    }
    return {
        output: output,
        bitsLeft: bitsLeft
    };
}

function Convert(input) {
    var cleaned = "";
    var myRegExp = /[A-Z0-7]/;
    for (i = 0; i < input.length; i++) {
        var ch = input.charAt(i);
        if (ch == '0') {
            ch = 'O';
        } else if (ch == '1') {
            ch = 'L';
        } else if (ch == '8') {
            ch = 'B';
        } else if (myRegExp.test(ch) === false) {
            continue;
        }
        cleaned += ch;
    }

    var result = base32_decode(cleaned);
    var output = result.output;
    var bitsLeft = result.bitsLeft;
    var separator = "";
    var hexText = "";

    for (i = 0; i < output.length; i++) {
        hexText = hexText + separator + (output[i] < 16 ? "0" : "") + dec2hex(output[i]);
    }
    return hexText;
}



(function() {
    'use strict';
    $(".fa-magnet").each(function(){
        var tag_a = $(this).parent();
        var raw_magnet_link = tag_a.attr("href");
        var raw_base32 = raw_magnet_link.match(/btih:(.+?)&dn=/)[1];
        tag_a.attr("href",raw_magnet_link.replace(/btih:(.+?)&dn=/,"btih:" + Convert(raw_base32) + "&dn="));
    });
})();