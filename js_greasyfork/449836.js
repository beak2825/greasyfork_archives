// ==UserScript==
// @name         魔力批量赠送
// @namespace    http://tampermonkey.net/
// @version      0.9.2
// @description  bulk send bonus
// @author       oo0
// @match        https://azusa.wiki/mybonus.php*
// @match        https://hdsky.me/mybonus.php*
// @match        https://hdpt.xyz/mybonus.php*
// @match        https://hdhome.org/mybonus.php*
// @match        https://pterclub.com/mybonus.php*
// @match        https://lemonhd.org/mybonus.php*
// @match        https://ourbits.club/mybonus.php*
// @match        https://club.hares.top/mybonus.php*
// @match        https://audiences.me/mybonus.php*
// @match        https://u2.dmhy.org/ucoin.php*
// @match        https://ptsbao.club/mybonus.php*
// @match        https://pt.hd4fans.org/mybonus.php*
// @match        https://hhanclub.top/mybonus.php*
// @match        https://gainbound.net/mybonus.php*
// @grant        GM.xmlHttpRequest
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/449836/%E9%AD%94%E5%8A%9B%E6%89%B9%E9%87%8F%E8%B5%A0%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/449836/%E9%AD%94%E5%8A%9B%E6%89%B9%E9%87%8F%E8%B5%A0%E9%80%81.meta.js
// ==/UserScript==
//v0.9.2 大猫魔力赠送从10000调整至50000；
//v0.9.1 Azusa魔力赠送从1000调整至10000；
//v0.9   细节改进；
//v0.8   新增支持憨憨和丐帮
//v0.7   新增支持beast
//v0.6   修复批量赠送bug；
//v0.5   修复bug；新增支持Audi、ptsbao和U2
//v0.4   修复bug；进一步随机化加大延迟
//v0.3   增加赠送间隔，防止冲击站点
//v0.2   支持更多站点

(function() {
    'use strict';

    // Your code here...
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time)).catch((e)=>{console.log(e);});
    }

    var siteurl = '';
    var option = -1;
    var max = 10000;
    var min = 25;
    var isU2 = false;

    const SendBonus = function(username, bonusgift, message){
        var url1 ='', data ='';
        if(isU2){
            url1 = 'https://u2.dmhy.org/mpshop.php';
            data = `event=1003&recv=${username}&amount=${bonusgift}&message=${message}`;
        }else{
            if(option === -1) return;
            url1 = `https://${siteurl}/mybonus.php?action=exchange`;
            data = `username=${username}&bonusgift=${bonusgift}&message=${message}&option=${option}&submit=赠送`;
        }
        GM.xmlHttpRequest({
            method: 'POST',
            url: url1,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            data: data,
            onload: response => {
                if (response.response.indexOf('错误') != -1 || response.response.indexOf('失败') != -1) {
                    console.log(`向${username}赠送失败`);
                    return false;
                }else{
                    console.log(`已向${username}赠送${bonusgift}魔力`);
                    return true;
                }
            },
        })
    }

    const SendBatchBonus = async function(){
        var divLogs = document.getElementById("divSendLogs");
        var message = document.getElementsByName('message')[0].value;
        var username = isU2? document.getElementsByName('recv')[0].value : document.getElementsByName('username')[0].value;
        var giftcustom = isU2? document.getElementsByName('amount')[0].value : parseInt(document.getElementById('giftcustom').value);
        if(username == ''){
            divLogs.appendChild(document.createTextNode('待赠送用户名不能为空\n'));
            return;
        }
        if(isNaN(giftcustom)){
            divLogs.appendChild(document.createTextNode('待赠送魔力不能为空\n'));
            return;
        }
        if(giftcustom < min){
            divLogs.appendChild(document.createTextNode('待赠送魔力太少\n'));
            return;
        }
        var btnSendGiftBonus = document.getElementById('btnSendGiftBonus');
        btnSendGiftBonus.setAttribute("disabled","1");
        var users = isU2 ? username.split(/[^0-9]/i) : username.split(/\s+/g);
        if(users.length == 0)return;
        for(var i = 0;i < users.length; i++){
            var bonus = giftcustom;
            var count = Math.ceil(bonus/max);
            var curr = 0;
            while (bonus > 0) {
                curr ++;
                btnSendGiftBonus.setAttribute("value", `赠送[${users[i]}](${curr}/${count})${users.length-i > 1? `(${users.length - i - 1}个排队中)`:''}`);
                if(bonus >= min && bonus <= max){
                    if(SendBonus(users[i], bonus, message)) break;
                    bonus = 0;
                }else if(bonus > max){
                    if(bonus - max >= min){
                        if(SendBonus(users[i], max, message)) break;
                        bonus -= max;
                    }else{
                        var special = bonus - min >= min ? bonus - min : bonus;
                        if(SendBonus(users[i], special, message)) break;
                        bonus -= special;
                    }
                }
                await sleep(isU2 ? 300000 : 0 + Math.ceil(400.0 + Math.random() * 350));
            }
            divLogs.appendChild(document.createTextNode(`已向[${users[i]}]赠送${giftcustom - bonus}魔力\n`));
        }
        btnSendGiftBonus.removeAttribute("disabled");
        btnSendGiftBonus.setAttribute("value", "批量赠送");
        document.getElementsByName('username')[0].value = '';
    }

    const SendGiftBonus = function(){
        //var x = document.getElementsByName("submit");
        var x = document.querySelectorAll('td>input');
        for (var i = 0; i < x.length; i++) {
            if(x[i].type == 'submit' &&(x[i].value == '赠送' ||x[i].value == '贈送' ||x[i].value == 'Karma Gift!' ||x[i].value == 'Transfer')){
                x[i].parentNode.appendChild(document.createElement("p"));
                var btnSendGiftBonus=document.createElement("input");
                btnSendGiftBonus.setAttribute("type","submit");
                btnSendGiftBonus.setAttribute("value","批量赠送");
                btnSendGiftBonus.setAttribute("title","按照前面填入的用户名和自定义魔力值进行赠送\n支持多用户名\n1.空格等空白字符隔开即可\n2.全部赠送相同的魔力值");
                btnSendGiftBonus.setAttribute("id",'btnSendGiftBonus');
                btnSendGiftBonus.onclick = SendBatchBonus;
                x[i].parentNode.appendChild(btnSendGiftBonus);
                x[i].parentNode.appendChild(document.createElement("p"));
                var divSendLogs = document.createElement("div");
                divSendLogs.setAttribute("id",'divSendLogs');
                divSendLogs.setAttribute("style", 'white-space: pre;');
                x[i].parentNode.appendChild(divSendLogs);
                if(!isU2){
                    var giftSelect = document.getElementById("giftselect")
                    if(giftSelect != null) giftSelect.value = '0';

                    var inputGiftCustom = document.getElementById('giftcustom');
                    inputGiftCustom.removeAttribute("disabled");
                    inputGiftCustom.focus();
                }else{
                    var giftRecv = document.getElementsByName("recv")[0]
                    if(giftRecv != null) giftRecv.size = 30;
                }
            }
        }
    }

    const SetAddtionalStyles = function(){
        var btnSendGiftBonus = document.getElementById('btnSendGiftBonus');
        btnSendGiftBonus.setAttribute("style", 'margin-top:10px;');
        btnSendGiftBonus.setAttribute("class","layui-btn layui-btn-xs layui-bg-black");
        var giftSelectInput = document.getElementsByClassName("layui-select-title")[0];
        if(giftSelectInput != undefined){
            giftSelectInput.children[0].value = '自定义';
        }
        var inputHaresGiftCustom = document.getElementById('giftcustom');
        inputHaresGiftCustom.setAttribute("class",'layui-input');
    }

    if(location.href.indexOf('hdsky.me/mybonus.php') > -1){
        siteurl = 'hdsky.me';
        option = 10;
        SendGiftBonus();
    }else if(location.href.indexOf('hdpt.xyz/mybonus.php') > -1){
        siteurl = 'hdpt.xyz';
        option = 6;
        SendGiftBonus();
    }else if(location.href.indexOf('hdhome.org/mybonus.php') > -1){
        siteurl = 'hdhome.org';
        option = 7;
        min = 1000;
        max = 100000;
        SendGiftBonus();
    }else if(location.href.indexOf('pterclub.com/mybonus.php') > -1){
        siteurl = 'pterclub.com';
        option = 13;
        max = 50000;
        SendGiftBonus();
    }else if(location.href.indexOf('lemonhd.org/mybonus.php') > -1){
        siteurl = 'lemonhd.org';
        option = 7;
        min = 10000;
        max = 10000000;
        SendGiftBonus();
    }else if(location.href.indexOf('ourbits.club/mybonus.php') > -1){
        siteurl = 'ourbits.club';
        option = 8;
        SendGiftBonus();
    }else if(location.href.indexOf('club.hares.top/mybonus.php') > -1){
        siteurl = 'club.hares.top';
        option = 7;
        max = 50000;
        SendGiftBonus();
        SetAddtionalStyles();
    }else if(location.href.indexOf('audiences.me/mybonus.php') > -1){
        siteurl = 'audiences.me';
        option = 7;
        SendGiftBonus();
    }else if(location.href.indexOf('ptsbao.club/mybonus.php') > -1){
        siteurl = 'ptsbao.club';
        option = 8;
        SendGiftBonus();
    }else if(location.href.indexOf('pt.hd4fans.org/mybonus.php') > -1){
        siteurl = 'pt.hd4fans.org';
        option = 7;
        SendGiftBonus();
    }else if(location.href.indexOf('u2.dmhy.org/ucoin.php') > -1){
        isU2 = true;
        min = 1;
        max = 50000;
        SendGiftBonus();
    }else if(location.href.indexOf('hhanclub.top/mybonus.php') > -1){
        siteurl = 'hhanclub.top';
        option = 7;
        SendGiftBonus();
    }else if(location.href.indexOf('gainbound.net/mybonus.php') > -1){
        siteurl = 'gainbound.net';
        option = 13;
        SendGiftBonus();
    }else if(location.href.indexOf('azusa.wiki/mybonus.php') > -1){
        siteurl = 'azusa.wiki';
        option = 7;
        max = 10000;
        SendGiftBonus();
    }
})();