// ==UserScript==
// @name         杜比发种工作统计
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Uploads statistics for HDDolby
// @author       ootruieo
// @license      GNU GPLv3
// @match        https://www.hddolby.com/userdetails.php?id=*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/438475/%E6%9D%9C%E6%AF%94%E5%8F%91%E7%A7%8D%E5%B7%A5%E4%BD%9C%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/438475/%E6%9D%9C%E6%AF%94%E5%8F%91%E7%A7%8D%E5%B7%A5%E4%BD%9C%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==
//更新记录：
//v0.2: 增加结束种子ID（需大于起始ID）
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

    const GetUidUploaded = async function(uid,torrStartId,torrEndId){
        getusertorrentlistajax(uid, 'uploaded', 'user1');
        var uploadedNodes = document.getElementById("user1").childNodes;
        var retryCount = 0;
        while(retryCount < 10 && uploadedNodes.length ==0){
            await sleep(1000);
            retryCount += 1;
            uploadedNodes = document.getElementById("user1").childNodes;
        }

        if(uploadedNodes == null){
            return 'Network Error, Retry Later';
        }
        if(uploadedNodes.length == 1){
            if(uploadedNodes[0].innerText == 'permission denied'){
                return 'Permission Denied';
            }
            else if(uploadedNodes[0].innerText == '没有记录'){
                return 'No Records';
            }else{
                return uploadedNodes[0].innerText;
            }
        }
        if(uploadedNodes.length > 1 && uploadedNodes[3].rows == undefined){
            return 'CANNOT get user\'s uploaded';
        }
        var uploadedCount = 0;
        var uploadedSize = 0;
        var setIds = new Set();
        for(var ti = 1;ti < uploadedNodes[3].rows.length;ti++){
            var titleElementA = uploadedNodes[3].rows[ti].cells[1].getElementsByTagName('a')[0];
            if(!setIds.has(titleElementA.href)) {
                setIds.add(titleElementA.href);
                let torrentid = parseInt(titleElementA.href.replace("https://www.hddolby.com/","").replace("details.php?id=","").replace("&hit=1",""));
                if(torrentid >= torrStartId && torrentid <= torrEndId){
                    var size = uploadedNodes[3].rows[ti].cells[2].innerText;
                    var sizeValue = SizeToGb(size);
                    if(sizeValue >=1){
                        uploadedCount += 1;
                        uploadedSize += sizeValue;
                    }
                }
            }
        }
        return `${uploadedCount}\t${(uploadedSize)}`;
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

    var regUser = /<span class="nowrap"><b>([\s\S]*?)<\/b>/i
    const GetUsername = async function(uid){
        var response = await new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: 'https://www.hddolby.com/userdetails.php?id=' + uid,
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
            return '[NO USER]';
        }
    }

    const GetUploadedStatistics = async function(){
        var uids = document.getElementById("taUidList").value.split(/[^0-9]/i).filter(item => item != '');
        if(uids.length > 0){
            var torrStartId = parseInt(document.getElementById('torrStartId').value);
            if(torrStartId === NaN){
                alert("请输入一个有效的种子起始数字ID");
                return;
            }
            var torrEndId = parseInt(document.getElementById('torrEndId').value);
            if(torrEndId === NaN || torrEndId - torrStartId <= 0){
                torrEndId = 999999999;
            }
            var btnGetUploadedStatistics = document.getElementById ("btnGetUploadedStatistics");
            btnGetUploadedStatistics.setAttribute("disabled","1");
            var stat = "USER\tUID\tTorrentID\tCount\tSize(GB)\n";
            for(var i = 0;i < uids.length; i++){
                btnGetUploadedStatistics.setAttribute("value",`分析[${uids[i]}](${i+1}/${uids.length})`);
                document.getElementById("user1").innerHTML = "";
                let uidStat = await GetUidUploaded(uids[i], torrStartId, torrEndId);
                let username = await GetUsername(uids[i]);
                stat += `${username}\t${uids[i]}\t${torrStartId}\t${uidStat}\n`;
            }
            SaveToFile(stat, 'UserUploadedStatistics.txt');
            document.getElementById("user1").innerHTML = "";
            btnGetUploadedStatistics.removeAttribute("disabled");
            btnGetUploadedStatistics.setAttribute("value","统计列表用户");
        }else{
            alert("请输入有效的UID列表！");
        }
    }

    var tab = document.getElementsByClassName('rowhead nowrap');
    if(tab != null){
        for (var i = 0; i < tab.length; i++) {
            if(tab[i].innerText == '邀请'){
                var row = tab[i].parentNode.parentNode.insertRow(0);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                cell1.innerHTML="工作统计";
                cell1.setAttribute("class","rowhead");
                cell1.setAttribute("width","100");
                cell2.innerHTML=" <table><tbody><tr rowspan=\"1\"><td><input type=\"button\" value=\"统计列表用户\" id=\"btnGetUploadedStatistics\" style=\"width:210px;display:block;margin:0 auto\"></td><th rowspan=\"5\"><textarea rows=\"5\" id=\"taUidList\" style=\"margin-left:10px;width:400px;\">用户列表(UID,任意非数字间隔)</textarea><br><div id=\"user1\" style=\"display:none;\"></div></th></tr><tr rowspan=\"1\"><td ><span>起始种子ID: </span><input type=\"text\" id=\"torrStartId\" style=\"width:20;\"/></td></tr><tr rowspan=\"1\"><td ><span>结束种子ID: </span><input type=\"text\" id=\"torrEndId\" style=\"width:20;\"/></td></tr></tbody></table>";//
                cell2.setAttribute("class","rowfollow");
                document.getElementById ("btnGetUploadedStatistics").addEventListener("click", GetUploadedStatistics, false);
                break;
            }
        }
    }
})();