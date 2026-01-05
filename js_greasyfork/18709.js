// ==UserScript==
// @name         fuck cnbeta-antiabp
// @namespace    cnbeta-antiabp
// @version      2.2
// @description  no ads!
// @author       Everyone
// @match        http://www.cnbeta.com/articles/*
// @match        http://www.cnbeta.com/live/*
// @grant        none
// @require      http://libs.baidu.com/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/18709/fuck%20cnbeta-antiabp.user.js
// @updateURL https://update.greasyfork.org/scripts/18709/fuck%20cnbeta-antiabp.meta.js
// ==/UserScript==

/*
可在 Adblock 过滤规则列表内加入如下行

www.cnbeta.com##DIV[style="display:block !important;position:fixed;top:0;margin-bottom:10px;width:100%;background:#c44;color:#fff;font-size:15px;z-index:99999"]

*/
(function() {
    'use strict';
    var ss=0;
    function fuckAntiABP()
    {
        var obj=$("body").children("div:has(div)");
        //var rogue = document.querySelectorAll("[id*='mask0']");
        if (obj.length>0)
        {
            obj.remove();
            clearInterval(ftimer);
        }
    }
    var ftimer = setInterval(function(){fuckAntiABP();},300);
})();


