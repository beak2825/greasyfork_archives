// ==UserScript==
// @name         保种和认领分析
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  Seeds statistics for HDPT/HHclub
// @author       ootruieo
// @match        https://hdpt.xyz/userdetails.php?id=*
// @match        https://hhanclub.top/userdetails.php?id=*
// @match        https://wintersakura.net/userdetails.php?id=*
// @match        https://piggo.me/userdetails.php?id=*
// @grant        GM.xmlHttpRequest
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/450093/%E4%BF%9D%E7%A7%8D%E5%92%8C%E8%AE%A4%E9%A2%86%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/450093/%E4%BF%9D%E7%A7%8D%E5%92%8C%E8%AE%A4%E9%A2%86%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==
///更新记录
//v0.5  新增适配站点猪猪网；认领和统计适配站点分页机制；
//v0.4  新增适配站点HHclub
//v0.3  适配改版做种页面
//v0.2  适配分页认领(存在问题：官种等分析仅统计当前显示分页)
//v0.1  基本功能

(function() {
    'use strict';

    // Your code here...

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time)).catch((e)=>{console.log(e);});
    }

    var regOfficial = /\s$/i;
    var claimCellIndex = -1;
    var domainName = '';
    var uid = '';
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
            for(var i = 1;i < seeding[tableId].rows.length;i++){
                if(seeding[tableId].rows[i].id =="unofficial" || seeding[tableId].rows[i].id =="dunplicate" ){
                    seeding[tableId].rows[i].setAttribute("style", "display:none");
                }
            }
        }
        else{
            seeding[(tableId - 8)].innerText = totalSeedCount;
            for(var j = 1;j < seeding[tableId].rows.length;j++){
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
            for(var i = 1;i < seeding[tableId].rows.length;i++){
                if(seeding[tableId].rows[i].id =="official5"){
                    seeding[tableId].rows[i].setAttribute("style", "background:LightGreen !important");
                }
                else if(seeding[tableId].rows[i].id =="official10"){
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
            for(var j=1;j < seeding[tableId].rows.length;j++){
                if(seeding[tableId].rows[j].id.startsWith("official")){
                    seeding[tableId].rows[j].removeAttribute("style");
                }
            }
        }
    }

    const ClaimAllTorrents = async function(){
        if(!document.getElementById ("cboxOfficialOnly").checked){
            if(!window.confirm("请确认是否认领非官种？\n1.认领官种请勾选仅显示官种\n注意：OK/确定 = 认领非官种！！！")){
                return;
            }
        }
        var tableId = GetKa1TableId();
        var btnClaimAllTorrents = document.getElementById ("claimAllTorrents");
        btnClaimAllTorrents.setAttribute("disabled","1");
        btnClaimAllTorrents.setAttribute("style", 'margin-left:5px;margin-top:10px;margin-bottom:10px;color:grey;');
        btnClaimAllTorrents.setAttribute("value","认领中...");

        var seeding = document.getElementById("ka1").childNodes;
        var count =0;
        var sucess = 0;
        for(var i = 1;i < seeding[tableId].rows.length;i++){
            var rowstyle = seeding[tableId].rows[i].getAttribute("style");
            if(rowstyle == undefined || rowstyle != "display:none"){
                //console.log(seeding[tableId].rows[i].cells[claimCellIndex]);
                var claimCells = seeding[tableId].rows[i].cells[claimCellIndex].childNodes;
                if(claimCells.length == 2 && claimCells[0].tagName == 'BUTTON' && claimCells[0].style.display == "flex"){
                    count ++;
                    var id = parseInt(seeding[tableId].rows[i].cells[1].getElementsByTagName('a')[0].href.replace(domainName,"").replace("details.php?id=","").replace("&hit=1",""));
                    await jQuery.post("ajax.php",  {action: "addClaim", params: {"torrent_id": id}}, function (response) {
                        var resp =JSON.parse(response);
                        if(resp.ret == 0){
                            console.log(`认领成功(ID= ${id})`);
                            seeding[tableId].rows[i].setAttribute("style", "background:Green !important");
                            sucess += 1;
                        }else{
                            console.log(`认领失败(ID= ${id}):${resp.msg}`);
                            seeding[tableId].rows[i].setAttribute("style", "background:Red !important");
                        }
                    });
                    await sleep(10);
                }
            }
        }
        btnClaimAllTorrents.removeAttribute("disabled");
        btnClaimAllTorrents.setAttribute("value","一键认领");
        btnClaimAllTorrents.setAttribute("style", 'margin-left:5px;margin-top:10px;margin-bottom:10px;font-weight:bold;color:red;');
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

    const GetNextPageTorrents = async function(page){
        let resp = await new Promise((resolve, reject) => {
               GM.xmlHttpRequest({
                   method: 'GET',
                   url: `${domainName}getusertorrentlistajax.php?page=${page}&userid=${uid}&type=seeding`,
                   headers: {
                       'Accept': 'application/json, text/javascript, */*; q=0.01',
                   },
                   dataType: 'json',
                   onload: function(response){
                       resolve(response.responseText);
                   },
                })
            });
           if(resp != ''){
               let parser = new DOMParser();
               var dom = parser.parseFromString(resp, "text/html");
               var nextPage = dom.childNodes[0].childNodes[1].childNodes;
               for(var i = 0;i < nextPage.length; i++){
                   if(nextPage[i].tagName == 'TABLE'){
                       return nextPage[i];
                   }
               }
               return null;
           }
    }

    const InjectFunctionButtons = async function(){
        var seeding = document.getElementById("ka1");
        var seedingNodes = seeding.childNodes;
        var pageControl = document.querySelectorAll('td>div>p');
        if(pageControl.length > 0){
            for(var x = pageControl.length - 1;x >= 0; x--){
                pageControl[x].parentNode.removeChild(pageControl[x]);
            }
        }
        var tableId = GetKa1TableId();
        var seedCount = 0;
        for(var i = 0;i < seedingNodes.length; i++){
            if(seedingNodes[i].tagName == 'B'){
                seedCount = parseInt(seedingNodes[i].innerText);
                break;
            }
        }
        if(seedCount > 100){
            var pageCount = Math.ceil(seedCount/100);
            for(var j = 1;j < pageCount; j++){
                let pageTable = await GetNextPageTorrents(j);
                for(var pi = pageTable.rows.length - 1;pi > 0;pi--){
                    seedingNodes[tableId].appendChild(pageTable.rows[pi]);
                    await sleep(10);
                }
                pageTable = null;
            }
        }
        var officialSeedingSize = 0;
        var seedingle5 = 0,seedingle10 = 0;
        var seedingLe5Size = 0,seedingLe10Size = 0;
        var setIds = new Set();
        var totalSize = 0;
        for(var ti=1;ti<seedingNodes[tableId].rows.length;ti++){
            var torrCellElementA = seedingNodes[tableId].rows[ti].cells[1].getElementsByTagName('a')[0];
            if(!setIds.has(torrCellElementA.href)) {
                setIds.add(torrCellElementA.href);
                var title = torrCellElementA.title.toLowerCase();
                var seeders = parseInt(seedingNodes[tableId].rows[ti].cells[4].innerText);
                var size = seedingNodes[tableId].rows[ti].cells[3].innerText;
                var sizeValue = SizeToGb(size);
                totalSize += sizeValue;
                if(title.match(regOfficial) != null){
                    var isLe5 = (seeders <= 5);
                    var isLe10 = (seeders <= 10);
                    officialSeedingSize += sizeValue;
                    officialSeedCount += 1;
                    if(isLe5){
                        seedingNodes[tableId].rows[ti].id="official5";
                        seedingle5 += 1;
                        seedingLe5Size += sizeValue;
                    }
                    else if(isLe10){
                        seedingNodes[tableId].rows[ti].id="official10";
                        seedingle10 += 1;
                        seedingLe10Size += sizeValue;
                    }
                    else{
                        seedingNodes[tableId].rows[ti].id="official";
                    }
                }
                else{
                    seedingNodes[tableId].rows[ti].id="unofficial";
                }
            }
            else{
                seedingNodes[tableId].rows[ti].id="dunplicate";
            }
        }

        totalSeedCount = setIds.size;
        var seedingStatistics = document.getElementById("seedingStatistics");
        if(seedingStatistics!=null){
            seedingStatistics.textContent=(`${totalSeedCount} 种子|总大小 ${(totalSize/1024).toFixed(3)}TB
                    【官种:${officialSeedCount}(${(officialSeedingSize/1024).toFixed(2)}TB);
                    <=5人:${seedingle5}(${(seedingLe5Size/1024).toFixed(2)}TB);
                    <=10人:${seedingle10}(${(seedingLe10Size/1024).toFixed(2)}TB)】`);
            seedingStatistics.removeAttribute('onclick');
            seedingStatistics.removeAttribute('href');
            seedingStatistics.setAttribute("style","pointer-events:none;");
            seedingStatistics.setAttribute("disable","true");
        }
        var cboxOfficialOnly=document.createElement("input");
        cboxOfficialOnly.setAttribute("type","checkbox");
        cboxOfficialOnly.setAttribute("id",'cboxOfficialOnly');
        cboxOfficialOnly.setAttribute("style", 'margin-left:30px;margin-top:10px;margin-bottom:10px;');
        cboxOfficialOnly.onchange = ShowOfficialTorrents;

        var spanOfficialOnly = document.createElement('span');
        spanOfficialOnly.style.fontWeight = "bold";
        spanOfficialOnly.style.color = "red";
        spanOfficialOnly.appendChild(document.createTextNode('仅显示官种'));
        seeding.insertBefore(spanOfficialOnly, seedingNodes[tableId]);
        seeding.insertBefore(cboxOfficialOnly, seedingNodes[tableId]);

        var cboxOfficialBgColor=document.createElement("input");
        cboxOfficialBgColor.setAttribute("type","checkbox");
        cboxOfficialBgColor.setAttribute("id",'cboxOfficialBgColor');
        cboxOfficialBgColor.setAttribute("style", 'margin-left:30px;margin-top:10px;margin-bottom:10px;');
        cboxOfficialBgColor.onchange = HighlightOfficialTorrents;

        var spanOfficialBgColor = document.createElement('span');
        spanOfficialBgColor.style.fontWeight = "bold";
        spanOfficialBgColor.style.color = "red";
        spanOfficialBgColor.appendChild(document.createTextNode('突出显示官种'));
        seeding.insertBefore(spanOfficialBgColor, seedingNodes[tableId]);
        seeding.insertBefore(cboxOfficialBgColor, seedingNodes[tableId]);

        var btnClaimAllTorrents=document.createElement("input");
        btnClaimAllTorrents.setAttribute("type","button");
        btnClaimAllTorrents.setAttribute("value","一键认领");
        btnClaimAllTorrents.setAttribute("id",'claimAllTorrents');
        btnClaimAllTorrents.setAttribute("style", 'margin-left:5px;margin-top:10px;margin-bottom:10px;font-weight:bold;color:red;');
        btnClaimAllTorrents.onclick = ClaimAllTorrents;
        seeding.insertBefore(btnClaimAllTorrents, seedingNodes[tableId]);
        observer.observe(seeding, config);
    }

    const mutationCallback = (mutationsList) => {
        for(let m of mutationsList) {
            let type = m.type;
            switch (type) {
                case "childList":
                    observer.disconnect();
                    console.log("A child node has been added or removed.");
                    InjectFunctionButtons();
                    break;
                default:
                    break;
            }
        }
    }
    let config = { childList: true,};
    var observer = new MutationObserver(mutationCallback);

    const manualLoadSeed = async function(){
        var x = document.querySelectorAll("tr>td>a");
        for (var i = 0; i < x.length; i++) {
            if(x[i].href.indexOf("getusertorrentlistajax") != -1 && x[i].href.indexOf("seeding") != -1) {
                x[i].click();
                await sleep(1000);
                var seeding = document.getElementById("ka1");
                var seedingNodes = seeding.childNodes;
                var retryCount = 0;
                while(retryCount < 10 && seedingNodes.length ==0){
                    await sleep(retryCount * 1000);
                    retryCount += 1;
                    seedingNodes = seeding.childNodes;
                }
                InjectFunctionButtons();
                break;
            }
        }
    }


    if(location.href.indexOf('hdpt.xyz') > -1){
        regOfficial = /[@-]\s?(HDPTWEB|HDPT)(|.mkv|.mp4|.ts|.iso)$/i ;
        claimCellIndex = 12;
        domainName = "https://hdpt.xyz/";
    }else if(location.href.indexOf('hhanclub.top') > -1){
        regOfficial = /[@-]\s?(HHWEB)(|.mkv|.mp4|.ts|.iso)$/i ;
        claimCellIndex = 12;
        domainName = "https://hhanclub.top/";
    }else if(location.href.indexOf('wintersakura.net') > -1){
        regOfficial = /[@-]\s?(WScode|SakuraWEB|SakuraSUB)(|.mkv|.mp4|.ts|.iso)$/i ;
        claimCellIndex = 12;
        domainName = "https://wintersakura.net/";
    }else if(location.href.indexOf('piggo.me') > -1){
        regOfficial = /[@-]\s?(PigoHD|PigoWeb|PiGoNF|PigoAD)(|.mkv|.mp4|.ts|.iso)$/i ;
        claimCellIndex = 12;
        domainName = "https://piggo.me/";
    }
    uid = location.href.substring(location.href.indexOf('id=')+3);

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
                            cell2.innerHTML='<a id="seedingStatistics" href="javascript:void(0);" style="font-weight:bold;color:red" title="分级统计官种数量和体积">点我分析保种统计</a>';//
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