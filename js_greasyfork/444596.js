// ==UserScript==
// @name         vovososo去除重定向
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  谷歌搜索，vovososo去除重定向
// @author       You
// @match        https://g.vovososo.com/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444596/vovososo%E5%8E%BB%E9%99%A4%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/444596/vovososo%E5%8E%BB%E9%99%A4%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {

    $(function(){
        $("div>a").attr("target","_blank");
    });

    var i;
    var urls = $('[role="presentation"]');
    for (i = 0; i < urls.length; i++) {
        //console.log(i);
        var url = urls[i].ping;
        if (url !=undefined){
            url=url.replace('/url?sa=t&source=web&rct=j&url=','');
            $('[role="presentation"]')[i].href=url;
        }
    }
})();