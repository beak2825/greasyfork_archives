// ==UserScript==
// @name         企信宝
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  企信宝提交
// @author       caca
// @match        https://www.qixin.com/search?*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant       metadata
// @grant       GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/373774/%E4%BC%81%E4%BF%A1%E5%AE%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/373774/%E4%BC%81%E4%BF%A1%E5%AE%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //$("head").append('<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">');
    (function (open) {
        XMLHttpRequest.prototype.open = function () {
            this.addEventListener("readystatechange", function () {
                if (this.responseURL.indexOf('https://www.qixin.com/api/search') >= 0 && this.readyState ==4) {
                    //console.log(this.responseURL);
                    console.log(this);
                    if(this.responseText){

                        GM_xmlhttpRequest({
                            method: "POST",
                            url: "http://192.168.31.11:9001/rest/bss/getCompany",
                            data: "type=company_fourth&msg="+encodeURIComponent(this.response),
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            onload: function (data) {
                                console.log(data.responseText);

                            }
                        });


                    }
                }

            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);


    // Your code here...
})();