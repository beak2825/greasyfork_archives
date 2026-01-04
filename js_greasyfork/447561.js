// ==UserScript==
// @name         烧包批量赠送
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  烧包魔力批量赠送
// @author       oo
// @match        https://ptsbao.club/mybonus.php
// @grant        GM.xmlHttpRequest
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/447561/%E7%83%A7%E5%8C%85%E6%89%B9%E9%87%8F%E8%B5%A0%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/447561/%E7%83%A7%E5%8C%85%E6%89%B9%E9%87%8F%E8%B5%A0%E9%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time)).catch((e)=>{console.log(e);});
    }

    const SendBonus = function(username, bonusgift, message){
        const data = `username=${username}&bonusgift=${bonusgift}&message=${message}'&option=8&submit=赠送`;
        GM.xmlHttpRequest({
            method: 'POST',
            url: 'https://ptsbao.club/mybonus.php?action=exchange',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            data: data,
            onload: response => {
                if (response.response.indexOf('错误') != -1) {
                    console.log('赠送失败');
                }else{
                    console.log(`已向${username}赠送${bonusgift}魔力`);
                }
            },
        })
    }

    const SendBatchBonus = async function(){
        var message = document.getElementsByName('message')[0].value;
        var username = document.getElementsByName('username')[0].value;
        var giftcustom = document.getElementById('giftcustom').value;
        if(!!username && !!giftcustom){
            var bonus = parseInt(giftcustom);
            var once = 10000;
            while (bonus > 0) {
                if(bonus >=25 && bonus <= 10000){
                    SendBonus(username, bonus, message)
                    bonus = 0;
                }else if(bonus > once){
                    if(bonus - once >= 25){
                        SendBonus(username, once, message)
                        bonus -= once;
                    }else{
                        var special = bonus - 25 >= 25 ? bonus - 25 : bonus;
                        SendBonus(username, special, message)
                        bonus -= special;
                    }
                }
                await sleep(1);
            }
            document.getElementById("divSendLogs").appendChild(document.createTextNode(`已向[${username}]赠送${giftcustom}魔力\n`));
            document.getElementsByName('username')[0].value = '';
        }
    }

    var gift = document.querySelectorAll('table>tbody>tr>td>input');
    for (var i = 0; i < gift.length; i++) {
        if(gift[i].value =="赠送"){
            gift[i].parentNode.appendChild(document.createElement("br"));
            var btnPtsbaoCustomGift = document.createElement("input");
            btnPtsbaoCustomGift.setAttribute("type","button");
            btnPtsbaoCustomGift.setAttribute("value","批量赠送");
            btnPtsbaoCustomGift.setAttribute("id",'ptsbaoSendGiftBonus');
            btnPtsbaoCustomGift.setAttribute("title",'向指定用户赠送自定义框内的魔力值\n备注:为防止连续点击，赠送后清空用户名');
            btnPtsbaoCustomGift.setAttribute("style", 'margin-top:5px;');
            btnPtsbaoCustomGift.onclick = SendBatchBonus;
            gift[i].parentNode.appendChild(btnPtsbaoCustomGift);

            gift[i].parentNode.appendChild(document.createElement("p"));
            var divSendLogs = document.createElement("div");
            divSendLogs.setAttribute("id",'divSendLogs');
            divSendLogs.setAttribute("style", 'margin-top:5px;white-space: pre;');
            gift[i].parentNode.appendChild(divSendLogs);

            document.getElementById('giftcustom').removeAttribute("disabled");
            break;
        }
    }
})();
