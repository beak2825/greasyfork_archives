// ==UserScript==
// @name         猫站娱乐助手
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Auto slot/lottery for PterClub
// @author       ootruieo
// @license      GNU GPLv3
// @match        https://pterclub.com/slot/index.html*
// @match        https://pterclub.com/lottery.php*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/441527/%E7%8C%AB%E7%AB%99%E5%A8%B1%E4%B9%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/441527/%E7%8C%AB%E7%AB%99%E5%A8%B1%E4%B9%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// v0.4 调整刮刮乐单卡逻辑
// v0.3 新增支持刮刮乐
(function() {
    'use strict';

    // Your code here...
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time)).catch((e)=>{console.log(e);});
    }

    const SingleSlot = async function(){
        var response = await new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: 'https://pterclub.com/slot.php?get=result',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;text/html;charset=utf-8;",
                },
                onload: function(response) {
                    resolve(response.responseText);
                }
            });
        });
        if(response.indexOf("错误") != -1 || response.indexOf("出错") != -1 ){
            response.log(response);
            return null;
        }else{
            return JSON.parse(response);
        }
    }

    const AutoSlot = async function(){
        var btnAutoSlot = document.getElementById ("btnAutoSlot");
        btnAutoSlot.setAttribute("disabled","1");
        btnAutoSlot.setAttribute("value","请耐心等待结果...");
        btnAutoSlot.setAttribute("style", 'margin-left:10px;border:0.5px solid red;color:grey');

        var currBonus = parseFloat(document.getElementsByClassName("bg-white font-semibold")[0].innerText.replaceAll(',',''));
        var endCount = parseInt(document.getElementById('txtEndCount').value);
        if(endCount == NaN){
            endCount = 100;
        }
        var isEndWithCount = document.getElementById('cboxEndWithCount').checked;
        var loopCount = 0;
        if(isEndWithCount){
            loopCount = Math.min(endCount, Math.floor(currBonus/1000));
        }else{
            loopCount = Math.floor(currBonus/1000);
        }
        var mResult = new Map();
        for(var i=0;i < loopCount;i++){
            var json = await SingleSlot();
            if(json == null){
                break;
            }
            var key = "";
            if(json.prize.type == "nothing"){
                key = "nothing";
            }else{
                key = json.prize.type + ":" + json.prize.content;
            }
            if(mResult.has(key)){
                mResult.set(key, mResult.get(key) + 1);
            }else{
                mResult.set(key, 1);
            }
            await sleep(5);
        }
        var aResult = Array.from(mResult).sort(function(a,b){return b[1]-a[1]})
        alert(`本轮摇了${loopCount}次结果如下:\n${aResult.join('\n')}`);
        btnAutoSlot.removeAttribute("disabled");
        btnAutoSlot.setAttribute("value","点这里开心摇起来");
        btnAutoSlot.setAttribute("style", 'margin-left:10px;font-weight:bold;border:0.5px solid red;color:red');
    }

    var regexLottery = /<center>([\x20\S]*?)个/g;
    var regexCard = />([\x20\S]*?)</g;
    var regexAction = /hz\/([\x20\S]*?)"/i;
    var pageNumber = '';
    var pageData = '';
    var lotteryTimes = 10000;
    var mapLottery = new Map();
    const SingleLottery = async function(){
        if(pageNumber == '' || pageData == '') return;
        var response = await new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'POST',
                url: `https://pterclub.com/dolottery.php?set=${pageNumber}`,
                data: `${pageData}&${pageData}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;text/html;charset=utf-8;",
                },
                onload: function(response) {
                    resolve(response.responseText);
                }
            });
        });
        var ma = response.match(regexAction);
        if(ma != null && ma.length > 1){
            console.log(ma[1]);
        }
        await sleep(800 + Math.random() * 200);
        response = await new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: `https://pterclub.com/lottery.php?action=page${pageNumber}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;text/html;charset=utf-8;",
                },
                onload: function(response) {
                    resolve(response.responseText);
                }
            });
        });
        if(response.indexOf("错误") != -1 || response.indexOf("出错") != -1 ){
            console.log(response);
            return -1;
        }else{
            var m = response.match(regexLottery);
            var cardCount = 0;
            var cardValid = 0;
            if(m != null && m.length > 1){
                for(var i = 0;i < m.length; i++){
                    var mc = m[i].match(regexCard);
                    if(mc != null && mc.length == 3){
                        cardCount ++;
                        let ownedCount = parseInt(mc[2].replace('>','').replace('<',''));
                        if(ownedCount >= mapLottery.get(pageNumber)) cardValid++;
                        //console.log(`${mc[0].replace('>','').replace('<','')}: ${ownedCount}`);
                    }
                }
            }
            console.log();
            if(cardCount == m.length - 1 && cardCount == cardValid) return 1;
            return `(卡片进度${cardValid}/${m.length - 1})`;
        }
    }
    const Scratch100Lotteries = async function(){
        var btnScratch100Lotteries = document.getElementById ("btnScratch100Lotteries");
        btnScratch100Lotteries.setAttribute("style", 'font-weight:bold;color:grey');
        btnScratch100Lotteries.setAttribute("disabled","1");
        for(var i = 0;i < lotteryTimes; i++){
            var result = await SingleLottery();
            if(result == -1){
                alert("刮刮乐出错了！脚本已停止！")
                break;
            }else if(result == 1){
                alert(`本页所有卡片拥有数均已超过${mapLottery.get(pageNumber)}张！`);
                window.location.reload();
                break;
            }else{
                btnScratch100Lotteries.setAttribute("value",`第${i + 1}次刮奖中${result}....`);
            }
            await sleep(700 + Math.random() * 300);
        }
        btnScratch100Lotteries.removeAttribute("disabled");
        btnScratch100Lotteries.setAttribute("value", `刮${lotteryTimes}次`);
        btnScratch100Lotteries.setAttribute("style", 'font-weight:bold;color:red');
    }

    if(location.href.indexOf('slot') > -1){
        var divApp = document.getElementById("app");
        if(divApp != null){
            var divSlot = document.createElement("span");
            divApp.parentNode.insertBefore(divSlot,divApp);

            var btnAutoSlot = document.createElement("input");
            btnAutoSlot.setAttribute("type","submit");
            btnAutoSlot.setAttribute("value","点这里开心摇起来");
            btnAutoSlot.setAttribute("id",'btnAutoSlot');
            btnAutoSlot.setAttribute("title",'一键摇摇乐，并在指定次数后结束');
            btnAutoSlot.setAttribute("style", 'margin-left:10px;font-weight:bold;border:0.5px solid red;color:red');
            btnAutoSlot.onclick = AutoSlot;
            divSlot.appendChild(btnAutoSlot);

            var cboxEndWithCount=document.createElement("input");
            cboxEndWithCount.setAttribute("type","checkbox");
            cboxEndWithCount.setAttribute("id",'cboxEndWithCount');
            cboxEndWithCount.setAttribute("checked",'1');
            cboxEndWithCount.setAttribute("style", "margin-left:20px;margin-top:3px");
            divSlot.appendChild(cboxEndWithCount);

            divSlot.appendChild(document.createTextNode("N次后结束,N="));
            var txtEndCount = document.createElement("input");
            txtEndCount.setAttribute("type","text");
            txtEndCount.setAttribute("value","100");
            txtEndCount.setAttribute("id", "txtEndCount");
            txtEndCount.setAttribute("style", 'border:0.5px solid #378888;width:100px;text-align:center;');
            divSlot.appendChild(txtEndCount);

        }
    }else if(location.href.indexOf('lottery') > -1){
        var lottery = document.querySelectorAll('div>div>form');
        if(lottery.length >0){
            pageNumber = lottery[0].action.substring(lottery[0].action.indexOf('set=')+4);
            mapLottery.set("01",13);
            mapLottery.set("02",20);
            mapLottery.set("03",20);
            mapLottery.set("04",26);
            mapLottery.set("05",30);
            mapLottery.set("06",38);
            mapLottery.set("07",20);
            var divMain = document.createElement("div");
            divMain.setAttribute("id", 'divMain');
            divMain.setAttribute("style", 'margin-top:10px;margin-bottom:10px;');

            var btnScratch100Lotteries = document.createElement("input");
            btnScratch100Lotteries.setAttribute("type", "button");
            btnScratch100Lotteries.setAttribute("value", `刮${lotteryTimes}次`);
            btnScratch100Lotteries.setAttribute("id", 'btnScratch100Lotteries');
            btnScratch100Lotteries.setAttribute("title", `当页面所有卡片均超过${mapLottery.get(pageNumber)}张时会停止执行！`);
            btnScratch100Lotteries.setAttribute("style", 'font-weight:bold;color:red');
            btnScratch100Lotteries.addEventListener("click", Scratch100Lotteries, false);
            divMain.appendChild(btnScratch100Lotteries);
            lottery[0].parentNode.insertBefore(divMain, lottery[0]);
            var inputId = lottery[0].childNodes[0];
            if(inputId != null && inputId.tagName == 'INPUT'){
                pageData = `${inputId.name}: ${inputId.value}`;
            }
        }
    }
})();