// ==UserScript==
// @name         评价显色
// @namespace    wj
// @version      3.66
// @description  评价显色1
// @author       zhumeiling
// @match        http://admin.bbs3839.5054399.com/comment/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446012/%E8%AF%84%E4%BB%B7%E6%98%BE%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/446012/%E8%AF%84%E4%BB%B7%E6%98%BE%E8%89%B2.meta.js
// ==/UserScript==



let Container = document.createElement('div');
Container.id = "sp-ac-container1";
Container.style.position="fixed"
Container.style.left="465px"
Container.style.top="10px"
Container.style['z-index']="999999"
Container.innerHTML =`<input type="text" class="search" placeholder="ID" id="neirong" size="2"><input type="button" value="搜用户" id="haha"><input type="button" value="搜评价ID" id="hahaha"><input type="button" value="搜回复ID" id="hahaht">



`
document.body.appendChild(Container);

let btn=document.getElementById('haha'),
    btn1=document.getElementById('hahaha'),
    btnht=document.getElementById('hahaht'),


    textArea=document.getElementById('neirong');


btn.onclick=function(){
    if(textArea.value){
        let x = textArea.value;


        window.open("http://admin.bbs3839.5054399.com/comment/gameComment-hasAudit.html?req%5Bstate_private%5D=0&req%5Bstate_high%5D=2&req%5Bis_pcs%5D=2&req%5Bstate_pcs%5D=100&req%5Bistop%5D=2&req%5Bfid%5D=&req%5Bcid%5D=&req%5Buid%5D="+x+"&req%5Bedit%5D=0&req%5Bcontent%5D=&req%5Btime_from%5D=&req%5Btime_to%5D=&req%5Bip%5D=&req%5Blength_from%5D=&req%5Blength_to%5D=&req%5Bstar_from%5D=&req%5Bstar_to%5D=&req%5Badminid%5D=&req%5Boppose_from%5D=&req%5Boppose_to%5D=&req%5Boriginal_pid%5D=0&req%5Bfrom_client%5D=0");
        window.open("http://admin.bbs3839.5054399.com/comment/gameReply-hasAudit.html?req%5Bstate_private%5D=0&req%5Bfid%5D=&req%5Bcid%5D=&req%5Bid%5D=&req%5Bcontent%5D=&req%5Bidentity%5D=100&req%5Btime_from%5D=&req%5Btime_to%5D=&req%5Badminname%5D=&req%5Buid%5D="+x+"&req%5Bip%5D=&req%5Blength_from%5D=&req%5Blength_to%5D=");

    }else{
        alert("你尚未输入信息,请重新输入")
    }
}
btn1.onclick=function(){
    if(textArea.value){
        let x = textArea.value;


        window.open("http://admin.bbs3839.5054399.com/comment/gameComment-hasAudit.html?req%5Bstate_private%5D=0&req%5Bstate_high%5D=2&req%5Bis_pcs%5D=2&req%5Bstate_pcs%5D=100&req%5Bistop%5D=2&req%5Bfid%5D=&req%5Bcid%5D="+x+"&req%5Buid%5D=&req%5Bedit%5D=0&req%5Bcontent%5D=&req%5Btime_from%5D=&req%5Btime_to%5D=&req%5Bip%5D=&req%5Blength_from%5D=&req%5Blength_to%5D=&req%5Bstar_from%5D=&req%5Bstar_to%5D=&req%5Badminid%5D=&req%5Boppose_from%5D=&req%5Boppose_to%5D=&req%5Boriginal_pid%5D=0&req%5Bfrom_client%5D=0");
        window.open("http://admin.bbs3839.5054399.com/comment/gameReply-hasAudit.html?req%5Bstate_private%5D=0&req%5Bfid%5D=&req%5Bcid%5D="+x+"&req%5Bid%5D=&req%5Bcontent%5D=&req%5Bidentity%5D=100&req%5Btime_from%5D=&req%5Btime_to%5D=&req%5Badminname%5D=&req%5Buid%5D=&req%5Bip%5D=&req%5Blength_from%5D=&req%5Blength_to%5D=");
    }else{
        alert("你尚未输入信息,请重新输入")
    }
}

btnht.onclick=function(){
    if(textArea.value){
        let x = textArea.value;

        window.open("http://admin.bbs3839.5054399.com/comment/gameReply-hasAudit.html?req%5Bstate_private%5D=0&req%5Bfid%5D=&req%5Bcid%5D=&req%5Bid%5D="+x+"&req%5Bcontent%5D=&req%5Bidentity%5D=100&req%5Btime_from%5D=&req%5Btime_to%5D=&req%5Badminname%5D=&req%5Buid%5D=&req%5Bip%5D=&req%5Blength_from%5D=&req%5Blength_to%5D=");
    }else{
        alert("你尚未输入信息,请重新输入")
    }
}


//=====================================================================================================================================================





/*for (var i=2;i<53;i=i++) {//评价回复
    let x = document.querySelector("#table_list > tbody > tr:nth-child("+i+") > td:nth-child(3)");
    if(x){
        let str = x.innerText;
        if(str.indexOf("现代战舰") !== -1){
            x.style="background-color:#a7d2f0";
        }else if(str.indexOf("未来之役") !== -1){
            x.style="background-color:#a7d2f0";
        }else if(str.indexOf("游戏名：终末阵线:伊诺贝塔") !== -1){
            x.style="background-color:#F6FAAB";
        }else if(str.indexOf("APEX英雄") !== -1){
            x.style="background-color:#a7d2f0";
        }else if(str.indexOf("黎明觉醒") !== -1){
            x.style="background-color:#F6FAAB";
        }
    }else if(x != true){
        break;
    }
    x ="";
}
*/
const shuzuLan={
    "131330":"background-color:#F6FAAB",//现代战舰
    "现代战舰":"background-color:#a7d2f0",
    "未来之役":"background-color:#a7d2f0",
    "彩虹六号":"background-color:#a7d2f0",
    "APEX英雄":"background-color:#a7d2f0",
    "Apex英雄":"background-color:#a7d2f0",
    "DNF手游(韩服)":"background-color:#a7d2f0",
    "Honor of Kings":"background-color:#a7d2f0",
    "王者荣耀-HOK​(测试服)":"background-color:#a7d2f0",

    "终末阵线":"background-color:#F6FAAB",
    "暗黑破坏神:不朽":"background-color:#F6FAAB",
    "代号:ATLAS":"background-color:#F6FAAB",
    "遗落海域":"background-color:#F6FAAB",

    "84682":"background-color:#F6FAAB",//传说对决-先锋服
    "97313":"background-color:#F6FAAB",//闪耀暖暖-先锋服
    "108171":"background-color:#F6FAAB",//乌托邦:起源一创造与魔法先锋服
    "108758":"background-color:#F6FAAB",//明日之后-先锋服.
    "110399":"background-color:#F6FAAB",//剑灵:革命(中文版)
    "112258":"background-color:#F6FAAB",//绝地求生刺激战场一繁中版
    "113071":"background-color:#F6FAAB",//公主连结-先锋服
    "116632":"background-color:#F6FAAB",//使命召唤手游繁中版

    "141013":"background-color:#F6FAAB",//超凡先锋-繁中版
    "127459":"background-color:#F6FAAB",//英雄联盟手游-繁中版
    "132230":"background-color:#F6FAAB",//天堂2M-繁中版
    "109628":"background-color:#F6FAAB",//Apex英雄-繁中版
    "139458":"background-color:#F6FAAB",//哈利波特:魔法觉醒一繁中版
    "134648":"background-color:#F6FAAB",//野境重生
    "95475":"background-color:#F6FAAB",//黑色沙漠-先锋服
    "146492":"background-color:#F6FAAB",//战双帕弥什-繁中版
    "139304":"background-color:#F6FAAB",//最终幻想7:第二士兵-繁中版

}//bug  对象中不按顺序，按得是数字顺序，迟些修复
const shuzuHuang={

}
for (var o=2;o<53;o++) {//评价
    let y = document.querySelector("#subContent > div.row-fluid > div > div > div.portlet-body > table > tbody > tr:nth-child("+o+") > td:nth-child(3)");
    if(y){
        let str = y.innerText;
        for(let a in shuzuLan){
            console.log(a)
            if(str.indexOf(a) !== -1){
                y.style=shuzuLan[a]
                break;
            }
        }
    }else if(y != true){
        break;
    }
    y ="";
}