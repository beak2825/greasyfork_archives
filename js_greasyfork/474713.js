// ==UserScript==
// @name         校园什么网
// @namespace    http://tampermonkey.net/
// @version      7.1
// @description  每隔一分钟自动点击指定的元素
// @author       明明不远
// @match        *://*http://10.224.1.2/eportal/index.jsp?wlanuserip=10.176.42.254&wlanacname=TSXY-HX-18007&ssid=&nasip=10.191.0.1&snmpagentip=&mac=7a8302fd4303&t=wireless-v2-plain&url=http://123.123.123.123/&apmac=&nasid=TSXY-HX-18007&vid=1301&port=97&nasportid=AggregatePort%202.13010000:1301-0/*
// @match        *://*.10.224.1.2/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474713/%E6%A0%A1%E5%9B%AD%E4%BB%80%E4%B9%88%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/474713/%E6%A0%A1%E5%9B%AD%E4%BB%80%E4%B9%88%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 点击<div id="loginLink_div" style="background-position: -373px -105px;"></div>
    setInterval(function() {
        var loginLinkDiv = document.getElementById("loginLink_div");
        if (loginLinkDiv) {
            loginLinkDiv.click();
        }
    }, 1000); // 1秒

    'use strict';

    // 点击<a href="#" id="_service_0" style="color:#4285ca;background-color:#FFF;">互联网</a>
    setInterval(function() {
        var serviceLink = document.getElementById("_service_0");
        if (serviceLink) {
            serviceLink.click();
            setTimeout(function() {
                location.reload();
            }, 5000); // 5秒后刷新网页
        }
    }, 40000); // 40秒
})();