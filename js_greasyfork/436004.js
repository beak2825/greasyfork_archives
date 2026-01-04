// ==UserScript==
// @name         家园活动抽奖
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  家园娱乐抽奖（仅活动期间可用）
// @author       ootruieo
// @match        https://hdhome.org/lottery.php*
// @license      GNU GPLv3
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/436004/%E5%AE%B6%E5%9B%AD%E6%B4%BB%E5%8A%A8%E6%8A%BD%E5%A5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/436004/%E5%AE%B6%E5%9B%AD%E6%B4%BB%E5%8A%A8%E6%8A%BD%E5%A5%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time)).catch((e)=>{console.log(e);});
    }

    var inLottText = "继续抽奖中（再次点击停止）";
    var noLottText = "开始抽奖";
    const SendCustomStrangeGift = async function(){
        var btnCustomStrangeGift = document.getElementById('customStrangeGift');
        if(btnCustomStrangeGift.value == inLottText){
            GM_setValue('hdhGoNextLottery', false);
            btnCustomStrangeGift.setAttribute("value", noLottText);
            return ;
        }
        btnCustomStrangeGift.setAttribute("value", inLottText);
        var hdhLotteryId = parseInt(document.getElementById('hdhLotteryId').value);
        if(hdhLotteryId === NaN){
            hdhLotteryId = 1;
        }
        GM_setValue('hdhLotteryId', hdhLotteryId);
        var x = document.querySelectorAll('table>tbody>tr>td>table');
        for (var i = 0; i < x.length; i++) {
            if(x[i].innerText.indexOf('序号') != -1){
                for(var ti= 1; ti < x[i].rows.length - 1;ti ++){
                    if(x[i].rows[ti].cells[0].innerText==hdhLotteryId){
                        var leftCount = parseInt(x[i].rows[ti].cells[6].innerText);
                        if(leftCount>0){
                            var nodeLog = document.getElementById ("nodeLog");
                            var gonext = true;
                            var lottLink = x[i].rows[ti].cells[8].getElementsByTagName('a')[0].href;
                            GM.xmlHttpRequest({
                                method: 'GET',
                                url: lottLink,
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                                },
                                onload: response => {
                                    if (response.response.indexOf('未中奖') != -1) {
                                        GM_setValue('hdhGoNextLottery', true);
                                        nodeLog.innerHTML = '未中奖！30秒后开启下一次抽奖...';
                                    }else if(response.response.indexOf('错误') != -1){
                                        GM_setValue('hdhGoNextLottery', true);
                                        nodeLog.innerHTML = '出错了！30秒后开启下一次抽奖...';
                                    }
                                    else{
                                        gonext = false;
                                        GM_setValue('hdhGoNextLottery', false);
                                        nodeLog.innerHTML = '恭喜中奖了，已暂停！';
                                    }
                                },
                            });
                            if(gonext){
                                await sleep(30100);
                                window.location.reload();
                            }
                        }else{
                            GM_setValue('hdhGoNextLottery', false);
                        }
                    }
                }
                break;
            }
        }
    }

    const hdhLotteryIdChanged = function(){
        var hdhLotteryId = parseInt(document.getElementById('hdhLotteryId').value);
        if(hdhLotteryId === NaN){
            hdhLotteryId = 1;
        }
        GM_setValue('hdhLotteryId', hdhLotteryId);
    }

    var gift = document.querySelectorAll('table>tbody>tr>td>a');
    for (var i = 0; i < gift.length; i++) {
        if(gift[i].innerText =="我的中奖记录"){
            gift[i].parentNode.appendChild(document.createElement("br"));
            var btnCustomStrangeGift = document.createElement("input");
            btnCustomStrangeGift.setAttribute("type","button");
            btnCustomStrangeGift.setAttribute("value", noLottText);
            btnCustomStrangeGift.setAttribute("id",'customStrangeGift');
            btnCustomStrangeGift.setAttribute("style", 'margin-top:5px;');
            gift[i].parentNode.appendChild(btnCustomStrangeGift);
            document.getElementById ("customStrangeGift").addEventListener("click", SendCustomStrangeGift, false);

            var lblHdhLotteryId = document.createElement("span");
            lblHdhLotteryId.appendChild(document.createTextNode("ID:"));
            lblHdhLotteryId.setAttribute("style", 'margin-left:20px;margin-top:10px;margin-bottom:-5px;');
            gift[i].parentNode.appendChild(lblHdhLotteryId);

            var hdhLotteryId = GM_getValue('hdhLotteryId');
            if(hdhLotteryId == undefined || hdhLotteryId < 0 || hdhLotteryId > 31){
                hdhLotteryId = 1;
            }
            var txtHdhLotteryId = document.createElement("input");
            txtHdhLotteryId.setAttribute("type","text");
            txtHdhLotteryId.setAttribute("value",hdhLotteryId);
            txtHdhLotteryId.setAttribute("id", "hdhLotteryId");
            txtHdhLotteryId.setAttribute("title", "指定抽奖编号");
            txtHdhLotteryId.setAttribute("style", 'width:20px;margin-left:5px;margin-top:10px;margin-bottom:-5px;text-align:center;');
            txtHdhLotteryId.onchange = hdhLotteryIdChanged;
            gift[i].parentNode.appendChild(txtHdhLotteryId);

            var nodeLog = document.createElement("div");
            nodeLog.setAttribute("id", 'nodeLog');
            nodeLog.setAttribute("style", 'margin-left:30px;margin-top:10px;margin-bottom:-5px;display:inline-block;');
            gift[i].parentNode.appendChild(nodeLog);
            break;
        }
    }

    var hdhGoNextLottery = GM_getValue('hdhGoNextLottery');
    if(hdhGoNextLottery){
        SendCustomStrangeGift();
    }
})();
