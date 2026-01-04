// ==UserScript==
// @name         server.pro扩展插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一个用于server.pro插件免费服务器ID的插件
// @author       AMEN
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @license      一个用于server.pro插件免费服务器ID的插件
// @match        https://server.pro/*
// @icon         https://www.google.com/s2/favicons?domain=server.pro
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438238/serverpro%E6%89%A9%E5%B1%95%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/438238/serverpro%E6%89%A9%E5%B1%95%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout( function(){undefined
                                   //这里地图需要延迟，如果位置不为空则不进入延迟
                           var herf = document.querySelector("#section-content > div > div > div.server-list.row.margin-xLarge > div > div > div.col-xl-5.col-lg-4.col-md-6.col-7.mb-3.mb-lg-0 > div > div.name > a").href;
                           var wz = herf.split("/");
                           var serverid = wz[4];
                           var d = document.querySelector("#section-content > div > div > div.server-list.row.margin-xLarge > div > div")
                           d.innerHTML = d.innerHTML + "</a><div class='col-lg-2 col-md-3 col-sm-4 col-4 mb-3 mb-lg-0'><p>当前服务器id:"+serverid+"</p></div>";
                           var cookie = $.cookie("session");
                           d.innerHTML = d.innerHTML + "</a><div class='col-lg-2 col-md-3 col-sm-4 col-4 mb-3 mb-lg-0'><p>当前用户cookie:"+cookie+"</p></div>";
                                  }, 1 * 1000 );
    // Your code here...
})();