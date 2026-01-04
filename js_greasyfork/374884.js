// ==UserScript==
// @name         天天美剧去生肉
// @namespace    Dexte
// @version      0.1
// @description  天天美剧去除生肉
// @author       Dexte
// @match        *://www.ttmeiju.vip/meiju/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374884/%E5%A4%A9%E5%A4%A9%E7%BE%8E%E5%89%A7%E5%8E%BB%E7%94%9F%E8%82%89.user.js
// @updateURL https://update.greasyfork.org/scripts/374884/%E5%A4%A9%E5%A4%A9%E7%BE%8E%E5%89%A7%E5%8E%BB%E7%94%9F%E8%82%89.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Your code here...
     //去除生肉
    removeRaw();
    $("#seedlist").bind('DOMNodeInserted', function (e) {
        removeRaw();
    });
})();
function removeRaw(){
    var jjs=$("tr.Scontent,tr.Scontent1");
    if(jjs.length<3){
        return;
    }
    jjs.each(function(idx,obj){
        var hasZm=false;
        var tds=$(obj).find("td");
        for(var i=0;i<tds.length;i++)
        {
            var td=$(tds[i]);
            if(td.text().trim().indexOf("熟肉")>=0 ||td.text().trim().indexOf("双语")>=0||td.text().trim().indexOf("中文")>=0||td.text().trim().indexOf("合集")>=0||td.text().trim().indexOf("全集")>=0)
            {
                hasZm=true;
            }
        }
        if(!hasZm)
        {
            $(obj).hide();
        }
    });
};