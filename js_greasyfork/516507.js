// ==UserScript==
// @name         洛谷国内国际站自动切换
// @namespace    http://tampermonkey.net/
// @version      1.4-dev
// @description  无
// @author       928418
// @match        */*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/516507/%E6%B4%9B%E8%B0%B7%E5%9B%BD%E5%86%85%E5%9B%BD%E9%99%85%E7%AB%99%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/516507/%E6%B4%9B%E8%B0%B7%E5%9B%BD%E5%86%85%E5%9B%BD%E9%99%85%E7%AB%99%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var url = window.location.href;
    var path = window.location.pathname;
    var host = window.location.host;
    if (host == "www.luogu.com.cn")
    {
        //国内站，看path中是否含有paste,article或user
        //部分老的discuss必须去国际站，也加上
        //                                                                                                              这里特判消息中心
        if (path.substr(1, 5) == "paste" || path.substr(1, 7) == "article" || (path.substr(1, 4) == "user" && path.substr(1, 17) != "user/notification") || path.substr(1, 7) == "discuss")
            window.location.host = "www.luogu.com";
    }
    else if (host == "www.luogu.com")
    {
        //相反，没有就转国内，防止503
        if (path.substr(1, 5) != "paste" && path.substr(1, 7) != "article" && path.substr(1, 4) != "user" && path.substr(1, 7) != "discuss")
            window.location.host = "www.luogu.com.cn";
    }
})();