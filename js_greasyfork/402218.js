// ==UserScript==
// @name         KillmailExportCN
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  为国服KB网添加导出km功能
// @author       SuzuneMaiki
// @match        *kb.ceve-market.org/kill/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402218/KillmailExportCN.user.js
// @updateURL https://update.greasyfork.org/scripts/402218/KillmailExportCN.meta.js
// ==/UserScript==
function copyurl(url){
    var copycontent=document.createElement("p");
    copycontent.innerHTML=url;
    copycontent.select();
    document.execCommand("Copy");
    alert(copycontent.innerHTML);
}

(function() {
    'use strict';
    var item=document.querySelectorAll("td.item-icon");
    var itemid;
    var itemname;
    for (var i=0;i<item.length;i++){
        if (item[i].childNodes[1].innerHTML) {
            itemid=item[i].childNodes[1].childNodes[1].getAttribute("src").split("/")[4];
            itemid = itemid.split("_")[0];
            itemname=item[i].childNodes[1].childNodes[1].getAttribute("title");
            itemname = "alert('<url=showinfo:"+itemid+">"+itemname+"</url> ')";
            item[i].setAttribute("onclick",itemname);
            item[i].childNodes[1].removeAttribute("href");
        }
    }

})();