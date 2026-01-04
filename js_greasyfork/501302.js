// ==UserScript==
// @name         Earnlink Bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically decrypt and redirect for earnlink.io
// @author       Minoa
// @license MIT
// @match        https://www.earnlink.io/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501302/Earnlink%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/501302/Earnlink%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get URL parameters
    function getUrlParam(name) {
        const results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results ? results[1] : null;
    }

    // AES crypto object
    var aesCrypto = {};
    !function(t) {
        "use strict";
        t.formatter = {
            prefix: "",
            stringify: function(t) {
                var r = this.prefix;
                return r += t.salt.toString(),
                r += t.ciphertext.toString();
            },
            parse: function(t) {
                var r = CryptoJS.lib.CipherParams.create({})
                  , e = this.prefix.length;
                return 0 !== t.indexOf(this.prefix) ? r : (r.ciphertext = CryptoJS.enc.Hex.parse(t.substring(16 + e)),
                r.salt = CryptoJS.enc.Hex.parse(t.substring(e, 16 + e)),
                r);
            }
        },
        t.encrypt = function(r, e) {
            try {
                return CryptoJS.AES.encrypt(r, e, {
                    format: t.formatter
                }).toString();
            } catch (n) {
                return "";
            }
        }
        ,
        t.decrypt = function(r, e) {
            try {
                var n = CryptoJS.AES.decrypt(r, e, {
                    format: t.formatter
                });
                return n.toString(CryptoJS.enc.Utf8);
            } catch (i) {
                return "";
            }
        }
    }(aesCrypto);

    // Get the encrypted parameter from the URL
    var encryptedParam = getUrlParam('o');
    if (encryptedParam) {
        // Decrypt the parameter
        var realUrl = aesCrypto.decrypt(convertstr(encryptedParam), convertstr('root'));
        // Redirect to the decrypted URL
        window.location.href = realUrl;
    }

    // Helper function to convert a string (example implementation, adapt as needed)
    function convertstr(str) {
        // Implement your conversion logic here if needed
        return str;
    }
})();
