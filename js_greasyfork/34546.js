// ==UserScript==
// @name         PG Raid Wecatch Interceptor
// @namespace    http://pgraid.razier.com/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.wecatch.net/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34546/PG%20Raid%20Wecatch%20Interceptor.user.js
// @updateURL https://update.greasyfork.org/scripts/34546/PG%20Raid%20Wecatch%20Interceptor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $( document ).ready(function() {

        $.ajaxSetup({
            dataFilter: function (data, type) {
                var tmpdata = JSON.parse(data);
                if(tmpdata.gyms != null){
                    $.post( "https://pgraid.razier.com/receivewecatch.php", { jsondata: base64_encode(data) } );
                }
                return data;
            }
        });

        //Repeat every 3 minutes
        setInterval(function(){
            var datetimelog = new Date().toISOString();
            console.log('[' + datetimelog + ']');
            $("#custom-control").trigger("click");
        }, 180000);

    });

    function base64_encode (stringToEncode) {
        var encodeUTF8string = function (str) {
            return encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes (match, p1) {
                return String.fromCharCode('0x' + p1);
            });
        };

        if (typeof window !== 'undefined') {
            if (typeof window.btoa !== 'undefined') {
                return window.btoa(encodeUTF8string(stringToEncode));
            }
        } else {
            return new Buffer(stringToEncode).toString('base64');
        }

        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var o1;
        var o2;
        var o3;
        var h1;
        var h2;
        var h3;
        var h4;
        var bits;
        var i = 0;
        var ac = 0;
        var enc = '';
        var tmpArr = [];

        if (!stringToEncode) {
            return stringToEncode;
        }

        stringToEncode = encodeUTF8string(stringToEncode);

        do {
            // pack three octets into four hexets
            o1 = stringToEncode.charCodeAt(i++);
            o2 = stringToEncode.charCodeAt(i++);
            o3 = stringToEncode.charCodeAt(i++);

            bits = o1 << 16 | o2 << 8 | o3;

            h1 = bits >> 18 & 0x3f;
            h2 = bits >> 12 & 0x3f;
            h3 = bits >> 6 & 0x3f;
            h4 = bits & 0x3f;

            // use hexets to index into b64, and append result to encoded string
            tmpArr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
        } while (i < stringToEncode.length)

            enc = tmpArr.join('')

            var r = stringToEncode.length % 3

            return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3)
    }
})();