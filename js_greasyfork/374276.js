// ==UserScript==
// @name         获取知网目录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://mall.cnki.net/onlineread/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@1.3.8/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/374276/%E8%8E%B7%E5%8F%96%E7%9F%A5%E7%BD%91%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/374276/%E8%8E%B7%E5%8F%96%E7%9F%A5%E7%BD%91%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url="http://mall.cnki.net/onlineread/Mall/_GetCatalog",
        data={sCode:sCode,sPeriod:sPeriod,sYear:sYear},
        mlz="",name=document.title.split("-")[0];
    //data={sCode:"SNGC",sPeriod:"01",sYear:"2018"};
    $.post(url,data,function(data,status){
        for(var x in data.Data){
            if(data.Data[x].Page.indexOf("-")>-1){var page=data.Data[x].Page.split("-")[0]}
            else if(data.Data[x].Page.indexOf("+")>-1){
                page=data.Data[x].Page.split("+")[0]}
            else(page=data.Data[x].Page);
            mlz += data.Data[x].Title+"\t"+page+"\n";
        };
        console.log(mlz);
        var blob = new Blob([mlz]);
        saveAs(blob,name+".txt");
    });
    // Your code here...
})();