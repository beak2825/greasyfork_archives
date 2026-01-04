// ==UserScript==
// @name         华为P10保时捷抢购计时
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  无限计时到抢购时间
// @author       You
// @match        https://www.vmall.com/product/173840389.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35578/%E5%8D%8E%E4%B8%BAP10%E4%BF%9D%E6%97%B6%E6%8D%B7%E6%8A%A2%E8%B4%AD%E8%AE%A1%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/35578/%E5%8D%8E%E4%B8%BAP10%E4%BF%9D%E6%97%B6%E6%8D%B7%E6%8A%A2%E8%B4%AD%E8%AE%A1%E6%97%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function time(){
        setTimeout(function(){
            var t=new Date();
            console.log(t);
            if(t.getHours()==10&&t.getMinutes()==8&&t.getSeconds()==0){
                var c = rush.sbom.getCurrSbom();
                var f = {};
                f.mainSku = c.id;
                f.targetUrl = c.gotoUrl;
                f.backUrl = domainMain + window.location.pathname + "#" + c.id;
                var b = $("#extendSelect").attr("skuid");
                var d = $("#accidentSelect").attr("skuid");
                var e = [];
                if (b) {
                    e.push(b);
                }
                if (d) {
                    e.push(d);
                }
                f.accessoriesSkus = e.join(",");
                var a = "";
                a = f.targetUrl + "?mainSku=" + f.mainSku;
                if (f.accessoriesSkus && f.accessoriesSkus.length > 0) {
                    a += "&accessoriesSkus=" + f.accessoriesSkus;
                }
                if (f.backUrl && f.backUrl.length > 0) {
                    a += "&backUrl=" + encodeURIComponent(f.backUrl) + "";
                }
                a += "&_t=" + new Date().getTime();
                window.open(a);
            }else{
                time();
            }
        },1);
    }
    time();
})();