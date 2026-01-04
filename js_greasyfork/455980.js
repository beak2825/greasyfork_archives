// ==UserScript==
// @name         白兔已认领种子检查
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  下载已认领但是未做种的种子
// @author       龘龗鱻爩
// @match        https://club.hares.top/viewclaim.php*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/455980/%E7%99%BD%E5%85%94%E5%B7%B2%E8%AE%A4%E9%A2%86%E7%A7%8D%E5%AD%90%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/455980/%E7%99%BD%E5%85%94%E5%B7%B2%E8%AE%A4%E9%A2%86%E7%A7%8D%E5%AD%90%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time)).catch((e)=>{console.log(e);});
    }
    const DownloadTorrents = async function(){
        var torrTable = document.getElementsByClassName('layui-table')[0];
        if(torrTable != undefined){
            var isOfficial = document.getElementById('cboxOfficialOnly').checked;
            var reg = /[@-]\s?(HaresWEB|HaresTV||HaresMV|Hares)(|.mkv|.mp4|.ts|.iso)$/i ;
            var aHiddenLink = document.getElementById('aHiddenLink');
            for(var i = 1;i < torrTable.rows.length; i++){
                let titleCell = torrTable.rows[i].cells[3];
                if(titleCell.innerHTML.indexOf('title="inactivity') != -1){
                    if(isOfficial){
                        if(titleCell.innerText.match(reg) == null) continue;
                    }
                    var torrLink = titleCell.getElementsByTagName('a')[0].href.replace("details.php?id=","download.php?id=");
                    aHiddenLink.setAttribute("href", torrLink);
                     window.open(torrLink);
                    await sleep(500);
                }
            }
        }
    }

    var x = document.querySelectorAll("legend");
    for (var i = 0; i < x.length; i++) {
        if(x[i].innerText == "认领种子管理"){
            var divMain = document.createElement("div");
            divMain.setAttribute("id", 'divMain');
            divMain.setAttribute("style", 'margin-bottom:10px;white-space:nowrap;');

            var btnDownloadTorrents = document.createElement("input");
            btnDownloadTorrents.setAttribute("type", "button");
            btnDownloadTorrents.setAttribute("value", "下载种子");
            btnDownloadTorrents.setAttribute("id", 'btnDownloadTorrents');
            btnDownloadTorrents.setAttribute("style", 'margin-left:30px;font-weight:bold;');
            btnDownloadTorrents.addEventListener("click", DownloadTorrents, false);
            divMain.appendChild(btnDownloadTorrents);

            var cboxOfficialOnly =document.createElement("input");
            cboxOfficialOnly.setAttribute("type","checkbox");
            cboxOfficialOnly.setAttribute("id",'cboxOfficialOnly');
            cboxOfficialOnly.setAttribute("title",'进入页面自动筛选未下载的种子');
            cboxOfficialOnly.setAttribute("style", 'margin-left:20px;text-align:center;');
            cboxOfficialOnly.setAttribute("checked", true);
            divMain.appendChild(cboxOfficialOnly);
            divMain.appendChild(document.createTextNode("仅官种"));

            var aHiddenLink =document.createElement("a");
            aHiddenLink.setAttribute("href","");
            aHiddenLink.setAttribute("id",'aHiddenLink');
            aHiddenLink.setAttribute("style", 'display:none;');
            divMain.appendChild(aHiddenLink);
            x[i].parentNode.insertBefore(divMain, x[i]);
        }
    }
})();