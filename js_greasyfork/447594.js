// ==UserScript==
// @name         猫猫保种组工作统计
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Seeds statistics for Pterclub
// @author       ootruieo
// @license      GNU GPLv3
// @match        https://pterclub.com/userdetails.php?id=*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/447594/%E7%8C%AB%E7%8C%AB%E4%BF%9D%E7%A7%8D%E7%BB%84%E5%B7%A5%E4%BD%9C%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/447594/%E7%8C%AB%E7%8C%AB%E4%BF%9D%E7%A7%8D%E7%BB%84%E5%B7%A5%E4%BD%9C%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==
//更新记录：
//v0.2  增补部分游戏官种的后缀
//v0.1: 基本功能，输入用户UID列表（任意非数字间隔）

(function() {
    'use strict';

    // Your code here...

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time)).catch((e)=>{console.log(e);});
    }

    var _sizeUnits = "BKMGTPEZY";
    var _sizeReg = /[KMGTPEZY]/i;
    const SizeToGb = function(size){
        var sizeNum = parseFloat(size);
        var m = size.match(_sizeReg);
        if( m != null){
            return sizeNum * Math.pow(1024, _sizeUnits.indexOf(m[0]) - 3);
        }else
        {
            return sizeNum/1024/1024/1024;
        }
    }

    var regOfficial = /[@-]\s?(PTerMV|PTerTV|PTerWEB|PTerDIY|PTerGame|PTer)(|.mkv|.mp4|.ts|.iso|.m2ts|.rar|.zip|.nsp|.nsz|.pkg|.xci)$/i ;
    const GetUidSeeding = async function(uid){
        getusertorrentlistajax(uid, 'seeding', 'user1',function(){ });
        var seedingNodes = document.getElementById("user1").childNodes;
        var retryCount = 0;
        while(retryCount < 30 && seedingNodes.length ==0){
            await sleep(1000);
            retryCount += 1;
            seedingNodes = document.getElementById("user1").childNodes;
        }

        if(seedingNodes == null){
            return 'Network Error, Retry Later';
        }
        if(seedingNodes.length == 1){
            if(seedingNodes[0].textContent == 'permission denied'){
                return 'Permission Denied';
            }
            else if(seedingNodes[0].innerText == '没有记录'){
                return 'No Records';
            }else{
                return seedingNodes[0].innerText;
            }
        }
        var tableIndex = -1;
        for(var k = 0; k < seedingNodes.length; k++){
            if(seedingNodes[k].tagName == "TABLE"){
                tableIndex = k;
                break;
            }
        }
        if(seedingNodes.length > 0 && tableIndex == -1){
            return 'CANNOT get user\'s seeding';
        }
        var officialSeedCount = 0;
        var seedingSize = 0;
        var seedingle5 =0;
        var seedingLe5Size = 0;
        var seedingle10 =0;
        var seedingLe10Size = 0;
        var setIds = new Set();
        for(var ti = 1;ti < seedingNodes[tableIndex].rows.length;ti++){
            var titleElementA = seedingNodes[tableIndex].rows[ti].cells[1].getElementsByTagName('a')[0];
            if(!setIds.has(titleElementA.href)) {
                setIds.add(titleElementA.href);
                var title = titleElementA.title;
                if(title.match(regOfficial) != null){
                    officialSeedCount += 1;
                    var isLe5 = (parseInt(seedingNodes[tableIndex].rows[ti].cells[4].innerText) <= 5);
                    var isLe10 = (parseInt(seedingNodes[tableIndex].rows[ti].cells[4].innerText) <= 10);
                    var size = seedingNodes[tableIndex].rows[ti].cells[3].innerText;
                    var sizeValue = SizeToGb(size);
                    if(isLe10){
                        seedingle10 += 1;
                        seedingLe10Size += sizeValue;
                    }
                    if(isLe5){
                        seedingle5 += 1;
                        seedingLe5Size += sizeValue;
                    }
                    seedingSize += sizeValue;
                }
            }
        }
        return `${officialSeedCount}\t${(seedingSize/1024)}\t${seedingle5}\t${(seedingLe5Size/1024)}\t${seedingle10}\t${(seedingLe10Size/1024)}`;
    }

    var SaveToFile = (function () {
        var a = document.createElement("a");
        a.setAttribute("style","display: none");
        document.body.appendChild(a);
        return function (data, filename) {
            var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
            var url = window.URL.createObjectURL(blob);
            a.setAttribute("href", url);
            a.setAttribute("download", filename);
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());

    var regUser = /用户详情 - ([\s\S]*?) PTerClub/i
    const GetUsername = async function(uid){
        var response = await new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: 'https://pterclub.com/userdetails.php?id=' + uid,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8;",
                },
                onload: function(response) {
                    resolve(response.responseText);
                }
            });
        });
        var m = response.match(regUser);
        if(m != null && m.length > 1){
            return m[1];
        }else{
            return '';
        }
    }

    const GetSeedingStatistics = async function(){
        var uids = document.getElementById("taUidList").value.split(/[^0-9]/i).filter(item => item != '');
        if(uids.length > 0){
            var btnGetSeedingStatistics = document.getElementById ("btnGetSeedingStatistics");
            btnGetSeedingStatistics.setAttribute("disabled","1");
            var stat = "USER\tUID\tOfficialCount\tOfficialSize(TB)\tOfficialCount(<=5)\tOfficialSize(<=5,TB)\tOfficialCount(<=10)\tOfficialSize(<=10,TB)\n";
            for(var i = 0;i < uids.length; i++){
                btnGetSeedingStatistics.setAttribute("value",`分析中\n[${uids[i]}](${i+1}/${uids.length})`);
                document.getElementById("user1").innerHTML = "";
                let uidStat = await GetUidSeeding(uids[i]);
                let username = await GetUsername(uids[i]);
                stat += `${username}\t${uids[i]}\t${uidStat}\n`;
            }
            SaveToFile(stat, 'PterSeedingGroupStatistics.txt');
            document.getElementById("user1").innerHTML = "";
            btnGetSeedingStatistics.removeAttribute("disabled");
            btnGetSeedingStatistics.setAttribute("value","统计列表");
        }
    }

    var x = document.getElementsByClassName("embedded");
    if(x.length > 0){
        for(var i = 0; i < x.length; i++) {
            if(x[i].innerText.indexOf("邀请人") != -1){
                for(var k = 0; k < x[i].childNodes.length; k++){
                    if(x[i].childNodes[k].tagName == "TABLE"){
                        var row = x[i].childNodes[k].insertRow(0);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        cell1.innerHTML="<input type=\"button\" value=\"统计列表\" id=\"btnGetSeedingStatistics\">";
                        cell1.setAttribute("class","rowhead");
                        cell1.setAttribute("width","100");
                        cell2.innerHTML="<textarea rows=\"4\" id=\"taUidList\" style=\"margin-left:1px;margin-right:1px;width:99%;overflow:auto;\">待查询用户列表，数字UID，多个用任意符号隔开</textarea><br><div id=\"user1\" style=\"display: none;\"></div>";//
                        cell2.setAttribute("class","rowfollow");
                        document.getElementById ("btnGetSeedingStatistics").onclick = GetSeedingStatistics;
                        return;
                    }
                }
            }
        }
    }
})();