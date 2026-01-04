// ==UserScript==
// @name        2FA
// @namespace   Violentmonkey Scripts
// @match       https://devel.ghlapps.com/my/oglconsole/
// @grant       none
// @version     1.0
// @author      ued
// @description 2023/4/27 11:55:19
// @license     MIT
// @require     https://cdnjs.cloudflare.com/ajax/libs/jsSHA/1.6.2/sha.js
// @downloadURL https://update.greasyfork.org/scripts/464957/2FA.user.js
// @updateURL https://update.greasyfork.org/scripts/464957/2FA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const dec2hex = function(s) {
        return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
    };

    const hex2dec = function(s) {
        return parseInt(s, 16);
    };

    const leftpad = function(s, l, p) {
        if(l + 1 >= s.length) {
            s = Array(l + 1 - s.length).join(p) + s;
        }
        return s;
    };

    const base32tohex = function(base32) {
        const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        let bits = "";
        let hex = "";
        for(let i = 0; i < base32.length; i++) {
            const val = base32chars.indexOf(base32.charAt(i).toUpperCase());
            bits += leftpad(val.toString(2), 5, '0');
        }
        for(let i = 0; i + 4 <= bits.length; i+=4) {
            const chunk = bits.substr(i, 4);
            hex = hex + parseInt(chunk, 2).toString(16) ;
        }
        return hex;
    };

    const getOTP = function(secret) {
        let otp;
        try {
            const epoch = Math.round(new Date().getTime() / 1000.0);
            const time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, "0");
            const hmacObj = new jsSHA(time, "HEX");
            const hmac = hmacObj.getHMAC(base32tohex(secret), "HEX", "SHA-1", "HEX");
            const offset = hex2dec(hmac.substring(hmac.length - 1));
            otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + "";
            otp = (otp).substr(otp.length - 6, 6);
        } catch (error) {
            throw error;
        }
        return otp;
    };

    document.getElementById('username').value = getOTP("S2DYLPEUZVYQ5ZPFNNHN4AA4KQYE63NL");

})();