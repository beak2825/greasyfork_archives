// ==UserScript==
// @name         大猫保种统计（手动载入）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Seeds statistics for PterClub
// @author       ootruieo
// @match        https://pterclub.com/userdetails.php?id*
// @license      GNU GPLv3
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/431899/%E5%A4%A7%E7%8C%AB%E4%BF%9D%E7%A7%8D%E7%BB%9F%E8%AE%A1%EF%BC%88%E6%89%8B%E5%8A%A8%E8%BD%BD%E5%85%A5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/431899/%E5%A4%A7%E7%8C%AB%E4%BF%9D%E7%A7%8D%E7%BB%9F%E8%AE%A1%EF%BC%88%E6%89%8B%E5%8A%A8%E8%BD%BD%E5%85%A5%EF%BC%89.meta.js
// ==/UserScript==
///更新记录
//v1.0 修复部分未入官种的bug(部分游戏官种在列表中无关键字，无法详细统计)
//v0.9 按钮嵌入表格中(如有权限时可查看他人保种)
//v0.8 增加多脚本运行的兼容性
//v0.7 增加非官种认领提示
//v0.6 一键认领功能(如勾选仅显示官种则仅尝试认领显示的)
//v0.5 标记重复种子并修复已知错误
//v0.4 当前做种中增加突出官种功能
//v0.3 剔除重复种子
//v0.2 调整按钮位置(从H2标题移动到做种大小处)
//v0.1 基本功能

(function() {
    'use strict';

    // Your code here...

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time)).catch((e)=>{console.log(e);});
    }

    const GetKa1TableId = function(){
        var seeding = document.getElementById("ka1").childNodes;
        for(var i = 1;i < seeding.length; i++){
            if(seeding[i].tagName == 'TABLE'){
                return i;
            }
        }
        return 0;
    }

    const ShowOfficialTorrents = function(){
    	var tableId = GetKa1TableId();
        var seeding = document.getElementById("ka1").childNodes;
        if(document.getElementById ("cboxOfficialOnly").checked){
            seeding[(tableId - 8)].innerText = officialSeedCount;
            for(var i=1;i<seeding[tableId].rows.length;i++){
                if(seeding[tableId].rows[i].id =="unofficial" || seeding[tableId].rows[i].id =="dunplicate" ){
                    seeding[tableId].rows[i].setAttribute("style", "display:none");
                }
            }
        }
        else{
            seeding[(tableId - 8)].innerText = totalSeedCount;
            for(var j=1;j<seeding[tableId].rows.length;j++){
                if(seeding[tableId].rows[j].id =="unofficial"){
                    seeding[tableId].rows[j].removeAttribute("style");
                }
            }
        }
    }

    const HighlightOfficialTorrents = function(element){
    	var tableId = GetKa1TableId();
        var seeding = document.getElementById("ka1").childNodes;
        if(document.getElementById ("cboxOfficialBgColor").checked){
            for(var i=1;i<seeding[tableId].rows.length;i++){
                if(seeding[tableId].rows[i].id =="official3"){
                    seeding[tableId].rows[i].setAttribute("style", "background:Violet !important");
                }
                else if(seeding[tableId].rows[i].id =="official5"){
                    seeding[tableId].rows[i].setAttribute("style", "background:LightGreen !important");
                }
                else if(seeding[tableId].rows[i].id =="official7"){
                    seeding[tableId].rows[i].setAttribute("style", "background:LightBLue !important");
                }
                else if(seeding[tableId].rows[i].id =="official"){
                    seeding[tableId].rows[i].setAttribute("style", "background:Wheat !important");
                }
                else if(seeding[tableId].rows[i].id =="dunplicate"){
                    seeding[tableId].rows[i].setAttribute("style", "background:Grey !important");
                }
            }
        }
        else{
            for(var j=1;j<seeding[tableId].rows.length;j++){
                if(seeding[tableId].rows[j].id.startsWith("official")){
                    seeding[tableId].rows[j].removeAttribute("style");
                }
            }
        }
    }

    const ClaimUrl = async function(url){
        var response = await new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: 'https://pterclub.com/' + url,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;text/html;charset=utf-8;",
                },
                onload: function(response) {
                    resolve(response.responseText);
                }
            });
        });
        if(response.indexOf("错误") != -1){
            return false;
        }else{
            return true;
        }
    }

    const ClaimAllTorrents = async function(){
        if(!document.getElementById ("cboxOfficialOnly").checked){
            if(!window.confirm("请确认是否认领非官种？\n1.认领非官种无魔力奖励\n2.认领官种请勾选仅显示官种\n注意：OK/确定 = 认领非官种！！！")){
                return;
            }
        }
        var tableId = GetKa1TableId();
        var btnClaimAllTorrents = document.getElementById ("claimAllTorrents");
        btnClaimAllTorrents.setAttribute("disabled","1");
        btnClaimAllTorrents.setAttribute("style", 'margin-left:30px;color:grey');
        btnClaimAllTorrents.setAttribute("value","认领中...");

        var seeding = document.getElementById("ka1").childNodes;
        var regUrl = /data-url=\"([\s\S]*?)\" class/i
        var count =0;
        var sucess = 0;
        for(var i=1;i<seeding[tableId].rows.length;i++){
            var rowstyle = seeding[tableId].rows[i].getAttribute("style");
            if(rowstyle == undefined ||rowstyle != "display:none"){
                if(seeding[tableId].rows[i].cells[2].innerText == "认领种子"){
                    count += 1;
                    var m = seeding[tableId].rows[i].cells[2].innerHTML.match(regUrl);
                    var result = await ClaimUrl(m[1].replaceAll("amp;",""));
                    if(result){
                        console.log("认领成功, 种子ID= "+m[1].substring(m[1].lastIndexOf('=')+1));
                        sucess +=1;
                    }else{
                        console.log("认领出错, 种子ID= "+m[1].substring(m[1].lastIndexOf('=')+1));
                    }
                    await sleep(10);
                }
            }
        }
        btnClaimAllTorrents.removeAttribute("disabled");
        btnClaimAllTorrents.setAttribute("value","一键认领");
        btnClaimAllTorrents.setAttribute("style", 'margin-left:30px;font-weight:bold;color:red;');
        alert(`本次可认领种子${count}个，成功认领${sucess}个`);
    }

    var officialSeedCount = 0;
    var totalSeedCount = 0;
    var _sizeUnits = "BKMGTPEZY";
    var _sizeReg = /[KMGTPEZY]/i;
    const SizeToGb = function(size){
        var sizeNum = parseFloat(size);
        var m = size.match(_sizeReg);
        if( m != null){
            return sizeNum * Math.pow(1024, _sizeUnits.indexOf(m[0]) - 3);
        }else{
            return sizeNum/1024/1024/1024;
        }
    }

    const manualLoadSeed = async function(){
        var x = document.querySelectorAll("a");
        for (var i = 0; i < x.length; i++) {
            if(x[i].href.indexOf("javascript:void") != -1 && x[i].id.indexOf("seeding") != -1) {
                seedingClick();
                await sleep(1000);
                var seeding = document.getElementById("ka1");
                var seedingNodes = seeding.childNodes;
                var retryCount = 0;
                while(retryCount < 10 && seedingNodes.length ==0){
                    await sleep(retryCount * 1000);
                    retryCount += 1;
                    seedingNodes = seeding.childNodes;
                }
                /*
                seeding.setAttribute("style","display: none;");
                var seedingImg = document.getElementById("pica1");
                seedingImg.setAttribute("class","plus");
                */
                var officialSeedingSize = 0;
                var seedingle3 = 0,seedingle5 = 0,seedingle7 = 0;
                var seedingLe3Size = 0,seedingLe5Size = 0,seedingLe7Size = 0;

                var mvCount = 0, gameCount = 0, movieCount = 0;
                var mvLe3 = 0, mvLe5 = 0, mvLe7 = 0;
                var gameLe3 = 0, gameLe5 = 0, gameLe7 = 0;
                var movieLe3 = 0, movieLe5 = 0, movieLe7 = 0;
                var setIds = new Set();
                var reg = /[@-]\s?(PTerMV|PTerTV|PTerWEB|PTerDIY|PTerGame|PTer)(|.mkv|.mp4|.ts|.iso|.rar|.zip|.nsp|.nsz|.pkg|.xci)$/i ;
                var tableId = GetKa1TableId();
                for(var ti=1;ti<seedingNodes[tableId].rows.length;ti++){
                    var torrCellElementA = seedingNodes[tableId].rows[ti].cells[1].getElementsByTagName('a')[0];
                    if(!setIds.has(torrCellElementA.href)) {
                        setIds.add(torrCellElementA.href);
                        var title = torrCellElementA.title.toLowerCase();
                        var seeders = parseInt(seedingNodes[tableId].rows[ti].cells[4].innerText);
                        if(title.match(reg) != null){
                            var isLe3 = (seeders < 3);
                            var isLe5 = (seeders < 5);
                            var isLe7 = (seeders < 7);
                            var size = seedingNodes[tableId].rows[ti].cells[3].innerText;
                            var sizeValue = SizeToGb(size);
                            officialSeedingSize += sizeValue;
                            officialSeedCount += 1;
                            if(isLe3){
                                seedingNodes[tableId].rows[ti].id="official3";
                                seedingle3 += 1;
                                seedingLe3Size += sizeValue;
                            }
                            else if(isLe5){
                                seedingNodes[tableId].rows[ti].id="official5";
                                seedingle5 += 1;
                                seedingLe5Size += sizeValue;
                            }
                            else if(isLe7){
                                seedingNodes[tableId].rows[ti].id="official7";
                                seedingle7 += 1;
                                seedingLe7Size += sizeValue;
                            }
                            else{
                                seedingNodes[tableId].rows[ti].id="official";
                            }
                        }
                        else{
                            seedingNodes[tableId].rows[ti].id="unofficial";
                        }
                        var type = seedingNodes[tableId].rows[ti].cells[0].getElementsByTagName('a')[0].href;
                        if(type.indexOf("cat=413") !=-1 ){
                            mvCount += 1;
                            if(seeders<3){
                                mvLe3 += 1;
                            }
                            else if(seeders<5){
                                mvLe5 += 1;
                            }
                            else if(seeders<7){
                                mvLe7 += 1;
                            }
                        }
                        else if(type.indexOf("cat=409") != -1){
                            gameCount += 1;
                            if(seeders<3){
                                gameLe3 += 1;
                            }
                            else if(seeders<5){
                                gameLe5 += 1;
                            }
                            else if(seeders<7){
                                gameLe7 += 1;
                            }
                        }else if(type.indexOf("cat=401") != -1){
                            movieCount += 1;
                            if(seeders<3){
                                movieLe3 += 1;
                            }
                            else if(seeders<5){
                                movieLe5 += 1;
                            }
                            else if(seeders<7){
                                movieLe7 += 1;
                            }
                        }
                    }
                    else{
                        seedingNodes[tableId].rows[ti].id="dunplicate";
                    }
                }

                totalSeedCount = setIds.size;
                var seedingStatistics = document.getElementById("seedingStatistics");
                if(seedingStatistics!=null){
                    seedingStatistics.textContent=(`${totalSeedCount}种子
                    【官种:${officialSeedCount}(${(officialSeedingSize/1024).toFixed(2)}TB);
                    <3人:${seedingle3}(${(seedingLe3Size/1024).toFixed(2)}TB);
                    <5人:${seedingle5}(${(seedingLe5Size/1024).toFixed(2)}TB);
                    <7人:${seedingle7}(${(seedingLe7Size/1024).toFixed(2)}TB)】
                    【电影:${movieCount}(${movieLe3}/${movieLe5}/${movieLe7});MV:${mvCount}(${mvLe3}/${mvLe5}/${mvLe7});游戏:${gameCount}(${gameLe3}/${gameLe5}/${gameLe7})】`);
                    seedingStatistics.removeAttribute('onclick');
                    seedingStatistics.removeAttribute('href');
                    seedingStatistics.setAttribute("style","pointer-events:none;");
                    seedingStatistics.setAttribute("disable","true");
                }

                var cboxOfficialOnly=document.createElement("input");
                cboxOfficialOnly.setAttribute("type","checkbox");
                cboxOfficialOnly.setAttribute("id",'cboxOfficialOnly');
                cboxOfficialOnly.setAttribute("style", 'margin-left:30px;');
                //cboxOfficialOnly.addEventListener('change', ShowOfficialTorrents, false);
                cboxOfficialOnly.onchange = ShowOfficialTorrents;

                var spanOfficialOnly = document.createElement('span');
                spanOfficialOnly.style.fontWeight = "bold";
                spanOfficialOnly.style.color = "red";
                spanOfficialOnly.appendChild(document.createTextNode('仅显示官种'));
                seedingNodes[(tableId - 1)].parentNode.insertBefore(spanOfficialOnly, seedingNodes[(tableId - 1)]);
                seedingNodes[(tableId - 1)].parentNode.insertBefore(cboxOfficialOnly, seedingNodes[(tableId - 1)]);

                var cboxOfficialBgColor=document.createElement("input");
                cboxOfficialBgColor.setAttribute("type","checkbox");
                cboxOfficialBgColor.setAttribute("id",'cboxOfficialBgColor');
                cboxOfficialBgColor.setAttribute("style", 'margin-left:30px;');
                //cboxOfficialBgColor.addEventListener("change", HighlightOfficialTorrents, false);
                cboxOfficialBgColor.onchange = HighlightOfficialTorrents;

                var spanOfficialBgColor = document.createElement('span');
                spanOfficialBgColor.style.fontWeight = "bold";
                spanOfficialBgColor.style.color = "red";
                spanOfficialBgColor.appendChild(document.createTextNode('突出显示官种'));
                seedingNodes[(tableId - 1)].parentNode.insertBefore(spanOfficialBgColor, seedingNodes[(tableId - 1)]);
                seedingNodes[(tableId - 1)].parentNode.insertBefore(cboxOfficialBgColor, seedingNodes[(tableId - 1)]);

                var btnClaimAllTorrents=document.createElement("input");
                btnClaimAllTorrents.setAttribute("type","button");
                btnClaimAllTorrents.setAttribute("value","一键认领");
                btnClaimAllTorrents.setAttribute("id",'claimAllTorrents');
                btnClaimAllTorrents.setAttribute("style", 'margin-left:30px;font-weight:bold;color:red;');
                //btnClaimAllTorrents.addEventListener("click", ClaimAllTorrents, false);
                btnClaimAllTorrents.onclick = ClaimAllTorrents;
                seedingNodes[(tableId - 1)].parentNode.insertBefore(btnClaimAllTorrents, seedingNodes[(tableId - 1)]);
                break;
            }
        }
    }

    var x = document.getElementsByClassName("embedded");
    if(x.length > 0){
        for(var i = 0; i < x.length; i++) {
            for(var k = 0; k < x[i].childNodes.length; k++){
                if(x[i].childNodes[k].tagName == "TABLE"){
                    for(var j = 0; j < x[i].childNodes[k].rows.length; j++) {
                        if(x[i].childNodes[k].rows[j].cells[0].innerText == '当前做种'){
                            var row = x[i].childNodes[k].insertRow(j);
                            var cell1 = row.insertCell(0);
                            cell1.innerHTML="保种分析";
                            cell1.setAttribute("class","rowhead nowrap");
                            cell1.setAttribute("width","1%");
                            cell1.setAttribute("valign","top");
                            cell1.setAttribute("align","right");

                            var cell2 = row.insertCell(1);
                            cell2.innerHTML='<a id="seedingStatistics" href="javascript:void(0);" style="font-weight:bold;color:red" title="分级统计均不含前一等级；两【】前官种后非官种(3/5/7数量)">点我分析保种统计</a>';//
                            cell2.setAttribute("class","rowfollow");
                            cell2.setAttribute("width","99%");
                            cell2.setAttribute("valign","top");
                            cell2.setAttribute("align","left");
                            document.getElementById ("seedingStatistics").addEventListener("click", manualLoadSeed, false);
                            return;
                        }
                    }
                }
            }
        }
    }
})();