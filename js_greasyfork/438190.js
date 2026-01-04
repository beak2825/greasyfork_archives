// ==UserScript==
// @name         冰灵ssr自动签到
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  自用,只有这一个功能,比较简单
// @author       cghk002
// @match        https://www.baidu.com/*
// @match        https://www.v2raya.vip/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/438190/%E5%86%B0%E7%81%B5ssr%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/438190/%E5%86%B0%E7%81%B5ssr%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
        'use strict';
    var cur_url = window.location.href;
        var btn = null;
    var LastSignedTime;
    LastSignedTime=GM_getValue("LastSignedTime", "2");
    if(Date().toString().substring(8,10)!=LastSignedTime){//是否是当天没有签到
    if (cur_url.indexOf("www.baidu.com/s?ie") != -1) {
        window.open("https://www.v2raya.vip/user");
     }
    }
        if(cur_url.indexOf("www.v2raya.vip")!=-1){
          btn = document.getElementById('checkin');
            btn.click();
            //保存签到时间
            GM_setValue("LastSignedTime", Date().toString().substring(8,10));
        }
})();
