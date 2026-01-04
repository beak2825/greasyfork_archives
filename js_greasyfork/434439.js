// ==UserScript==
// @name         白兔保种统计
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Seeds statistics for Hares
// @author       龘龗鱻爩
// @match        https://club.hares.top/userdetails.php?id=*
// @grant        GM.xmlHttpRequest
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/434439/%E7%99%BD%E5%85%94%E4%BF%9D%E7%A7%8D%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/434439/%E7%99%BD%E5%85%94%E4%BF%9D%E7%A7%8D%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==
//更新记录
//v0.7 220903 移除批量奶糖赠送，功能转至https://greasyfork.org/zh-CN/scripts/449836
//v0.6 220813 优化认领；只认领页面显示种子
//v0.5 220606 新增批量奶糖赠送
//v0.4 220220 适配新版页面
//v0.3 211026 新增一键认领功能（注意：请勿多次点击！）
//v0.2 211025 剔除重复做种；新增仅官种及突出显示
(function() {
    'use strict';

    // Your code here...

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time)).catch((e)=>{console.log(e);});
    }

    const ShowOfficialTorrents = function(){
        var seeding = document.getElementById("ka1").childNodes;
        if(document.getElementById ("cboxOfficialOnly").checked){
            for(var i=1;i<seeding[6].rows.length;i++){
                if(seeding[6].rows[i].id =="unofficial" || seeding[6].rows[i].id =="dunplicate" ){
                    seeding[6].rows[i].setAttribute("style", "display: none");
                }
            }
        }
        else{
            //seeding[0].innerText = totalSeedCount;
            for(var j=1;j<seeding[6].rows.length;j++){
                if(seeding[6].rows[j].id =="unofficial"){
                    seeding[6].rows[j].removeAttribute("style");
                }
            }
        }
    }

    const HighlightOfficialTorrents = function(){
        var seeding = document.getElementById("ka1").childNodes;
        if(document.getElementById ("cboxOfficialBgColor").checked){
            for(var i=1;i<seeding[6].rows.length;i++){
                if(seeding[6].rows[i].id =="official5"){
                    seeding[6].rows[i].setAttribute("style", "background:LightGreen !important");
                }
                else if(seeding[6].rows[i].id =="official10"){
                    seeding[6].rows[i].setAttribute("style", "background:LightBLue !important");
                }
                else if(seeding[6].rows[i].id =="official"){
                    seeding[6].rows[i].setAttribute("style", "background:Wheat !important");
                }
                else if(seeding[6].rows[i].id =="dunplicate"){
                    seeding[6].rows[i].setAttribute("style", "background:Grey !important");
                }
            }
        }
        else{
            for(var j=1;j<seeding[6].rows.length;j++){
                if(seeding[6].rows[j].id =="official"){
                    seeding[6].rows[j].removeAttribute("style");
                }
            }
        }
    }

    const ClaimAllTorrents = async function(){
        var msg = "确定要认领全部种子吗（请勿多次点击，后果自负！）？";
        if (confirm(msg)==true){
            var seedingNodes = document.getElementById("ka1").childNodes;
            var total = 0, success = 0, claimed = 0;
            for(var ti = 1;ti < seedingNodes[6].rows.length;ti++){
                if(seedingNodes[6].rows[ti].style.cssText == 'display: none;') continue;
                total += 1;
                var claimedHref = seedingNodes[6].rows[ti].cells[8].getElementsByTagName('a')[0].href;
                if(claimedHref.indexOf("add") != -1) {
                    var titleElementA = seedingNodes[6].rows[ti].cells[1].getElementsByTagName('a')[0];
                    var torrentid = titleElementA.href.replace("https://club.hares.top/","").replace("details.php?id=","").replace("&hit=1","");
                    var result = ajax.gets(`claim.php?act=add&torrentid=${torrentid}`);
                    if (result.indexOf("false") != -1) {
                        seedingNodes[6].rows[ti].setAttribute("style", "background:LightPink !important");
                    } else {
                        seedingNodes[6].rows[ti].setAttribute("style", "background:LightGreen !important");
                        success += 1;
                    }
                    await sleep(10);
                }
                else{
                    claimed += 1;
                }
            }
            alert(`共计${total}个种子(${claimed}个已认领)，成功认领${success}个。`);
        }
    }

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

    const LoadSeeding = async function(){
        var uid = document.location.href.replace("https://club.hares.top/userdetails.php?id=","");
        if(getusertorrentlistajax(uid,"seeding","ka1")){
            var seeding = document.getElementById("ka1");
            var seedingNodes = seeding.childNodes;
            var retryCount = 0;
            while(retryCount < 5 && seedingNodes.length ==0){
                await sleep(1000);
                retryCount += 1;
                seedingNodes = seeding.childNodes;
            }
            var officialSeedCount=0;
            var officialSeedSize = 0;
            var seedingLe5 =0;
            var seedingLe5Size = 0;
            var seedingLe10 =0;
            var seedingLe10Size = 0;
            var reg = /[@-]\s?(HaresWEB|HaresTV|Hares)(|.mkv|.mp4|.ts|.iso)$/i ;
            var setIds = new Set();
            for(var ti=1;ti<seedingNodes[5].rows.length;ti++){
                var titleElementA = seedingNodes[5].rows[ti].cells[1].getElementsByTagName('a')[0];
                if(!setIds.has(titleElementA.href)) {
                    setIds.add(titleElementA.href);
                    var title = titleElementA.title;
                    if(title.match(reg) != null){
                        var seeders = parseInt(seedingNodes[5].rows[ti].cells[3].innerText);
                        var isLe5 = (seeders <= 5);
                        var isLe10 = (seeders <= 10);
                        var size = seedingNodes[5].rows[ti].cells[2].innerText;
                        var sizeValue = SizeToGb(size);
                        officialSeedCount += 1;
                        officialSeedSize += sizeValue;
                        if(isLe5){
                            seedingNodes[5].rows[ti].id="official5";
                            seedingLe5 += 1;
                            seedingLe5Size += sizeValue;
                        }
                        else if(isLe10){
                            seedingNodes[5].rows[ti].id="official10";
                            seedingLe10 += 1;
                            seedingLe10Size += sizeValue
                        }
                        else{
                            seedingNodes[5].rows[ti].id="official";
                        }
                    }else{
                        seedingNodes[5].rows[ti].id="unofficial";
                    }
                }
                else{
                    seedingNodes[5].rows[ti].id="dunplicate";
                }
            }

            seedingNodes[2].textContent +=(`【官种: ${officialSeedCount}(${(officialSeedSize/1024).toFixed(2)}TB)；<=5人: ${seedingLe5}(${(seedingLe5Size/1024).toFixed(2)}TB)；<=10人: ${seedingLe10}(${(seedingLe10Size/1024).toFixed(2)}TB)】`);

            var appendSpan = document.createElement('span');
            appendSpan.setAttribute("style", "display:block;margin-top:10px");
            var cboxOfficialOnly=document.createElement("input");
            cboxOfficialOnly.setAttribute("type","checkbox");
            cboxOfficialOnly.setAttribute("id",'cboxOfficialOnly');
            cboxOfficialOnly.onchange = ShowOfficialTorrents;

            var spanOfficialOnly = document.createElement('span');
            spanOfficialOnly.setAttribute("style", "font-weight:bold;color:red;");
            spanOfficialOnly.appendChild(document.createTextNode(`仅显示官种(${officialSeedCount})`));
            appendSpan.appendChild(cboxOfficialOnly);
            appendSpan.appendChild(spanOfficialOnly);

            var cboxOfficialBgColor=document.createElement("input");
            cboxOfficialBgColor.setAttribute("type","checkbox");
            cboxOfficialBgColor.setAttribute("id",'cboxOfficialBgColor');
            cboxOfficialBgColor.setAttribute("style", 'margin-left:30px;');
            cboxOfficialBgColor.setAttribute("onchange", 'window.(this)');
            cboxOfficialBgColor.onchange = HighlightOfficialTorrents;

            var spanOfficialBgColor = document.createElement('span');
            spanOfficialBgColor.setAttribute("style", "font-weight:bold;color:red;");
            spanOfficialBgColor.appendChild(document.createTextNode('突出显示官种'));
            appendSpan.appendChild(cboxOfficialBgColor);
            appendSpan.appendChild(spanOfficialBgColor);

            var btnClaimAllTorrents=document.createElement("input");
            btnClaimAllTorrents.setAttribute("type","button");
            btnClaimAllTorrents.setAttribute("value","一键认领");
            btnClaimAllTorrents.setAttribute("id",'claimAllTorrents');
            btnClaimAllTorrents.setAttribute("style", 'font-weight:bold;color:red;margin-left:30px;');
            btnClaimAllTorrents.onclick = ClaimAllTorrents;
            appendSpan.appendChild(btnClaimAllTorrents);
            seeding.insertBefore(appendSpan,seedingNodes[4]);
        }
    }

    if(location.href.indexOf('userdetails.php') > -1){
        LoadSeeding();
    }
})();