// ==UserScript==
// @name         云听下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  给云听添加下载链接
// @author       Derrick
// @match        http://www.radio.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430889/%E4%BA%91%E5%90%AC%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/430889/%E4%BA%91%E5%90%AC%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';


function AddDownloadLink(){
var tds=$(".td_content");
if (tds.length==0)
{
setTimeout(AddDownloadLink, 1000);
return;
}
for (let td of tds) {
let a=$(td).find("a");
let downUrl=a.attr("data-url");
let downLink=$("<a></a>");
downLink.attr("href", downUrl);
downLink.text(`下载${a.text()}`);
downLink.appendTo(td);
}
return tds;
}
try{
setTimeout(AddDownloadLink, 1000);
}
catch{
setTimeout(AddDownloadLink, 1000);
}

})();