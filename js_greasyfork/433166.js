// ==UserScript==
// @name         发送1A-cookies
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  发送cookie
// @author       Mz
// @match       https://www.booking2.sellingplatformconnect.amadeus.com/app_sell2.0/apf/init/login?SITE=LOGINURL&LANGUAGE=CN&refreshOnError=true
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/433166/%E5%8F%91%E9%80%811A-cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/433166/%E5%8F%91%E9%80%811A-cookies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function sendCookies() {

        var url = document.getElementsByTagName("form")[0].getAttribute("action");

        GM_xmlhttpRequest({
            method: "get",
            url: 'http://amadeus.spider.htairline.com/set_login_jsession_id?jsessionid=' + url.split("jsessionid=")[1].split(".acs")[0],
            onload: function (res) {
                if (res.status === 200) {
                    console.log('成功');
                } else {
                    console.log('失败');
                }
            },
            onerror: function (err) {
                console.log('error');
            }
        });
    }

    setTimeout(
    sendCookies, 25000
    );
})();

