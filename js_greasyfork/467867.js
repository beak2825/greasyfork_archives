// ==UserScript==
// @name        GuguTown Auto Refresh Beach
// @name:zh-CN  咕咕镇沙滩自动刷新
// @name:zh-TW  咕咕鎮沙灘自動刷新
// @name:ja     咕咕镇砂浜自動更新
// @namespace   https://github.com/GuguTown/AutoRefreshBeach
// @homepage    https://github.com/GuguTown/AutoRefreshBeach
// @version     1.0.0
// @description WebGame GuguTown Automatic Beach Refresh.
// @description:zh-CN 气人页游 咕咕镇 沙滩自动刷新。
// @description:zh-TW 氣人頁遊 咕咕鎮 沙灘自動刷新。
// @description:ja オンラインゲーム 咕咕镇 ビーチの自動更新
// @icon        https://sticker.inari.site/favicon.ico
// @author      ikarosf
// @copyright   2020.09-2023.04 ikarosf
// @match       https://*.guguzhen.com/fyg_beach.php
// @match       https://*.momozhen.com/fyg_beach.php
// @run-at      document-end
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/467867/GuguTown%20Auto%20Refresh%20Beach.user.js
// @updateURL https://update.greasyfork.org/scripts/467867/GuguTown%20Auto%20Refresh%20Beach.meta.js
// ==/UserScript==
/* eslint-env jquery */

function guarb(){
let user = $("button[class*='btn btn-lg'][onclick*='fyg_index.php']")[0].innerText;

if (user === undefined || user === null || user === NaN) {
    console.log('当前登陆态失效或游戏处于维护状态，已停止加载沙滩自动刷新插件'); return;
};

let refreshBoxNum,keyname = `guguzhen_beach_refresh_plugin_${user}`;

if (localStorage[keyname] === undefined) { localStorage[keyname] = 0 };

function FLASHbeach() {
    'use strict';
    let xingshaflashremainder = 0,flashbyxingshaNUM = 0;
    if(FM_getValue('flashbyxingshaNUM')!=null){
        flashbyxingshaNUM = FM_getValue('flashbyxingshaNUM');
    }

    let mydiv = $(".row>.row>.col-md-12>.panel>.panel-heading>.pull-right")[0],text = mydiv.textContent
    if(!text.startsWith("距离下次随机装备")){
        alert("咕咕镇沙滩自动刷新脚本未获取到时间！");
        return;
    }
    let patt1 = /\d+/,minute = text.match(patt1)
    minute = parseInt(minute[0]) + 1
    setTimeout(async function(){
        await getstpage()
        await getstdata()
        for(let i = 0;i < flashbyxingshaNUM ; i++){
            await sxstbyxs()
            await getstpage()
            await getstdata()
        }
        location.reload();
    }, minute*60*1000);
    mydiv.textContent = text + " 将自动刷新"

};

function FM_setValue(name, value){
    let oldvalue = JSON.parse(localStorage.getItem(user));
    if(oldvalue === undefined){
        oldvalue = {};}
    oldvalue[name] = value;
    localStorage.setItem(user,JSON.stringify(oldvalue));
};

function FM_getValue(name, defaultValue){
    let thisvalue = JSON.parse(localStorage.getItem(user));
    if(thisvalue != undefined&&name in thisvalue){
        return thisvalue[name]
    }
    if(defaultValue != null){
        return defaultValue;
    }
    return null;
};

function getPostData(p1,p2){
    let data = -1;
    for(let s of document.getElementsByTagName('script')){
        let func = s.innerText.match(p1)
        if(func!=null){
            data = func[0].match(p2)[0];
            break;
        }
    }
    return data
};

function get_saveid(){
    return getPostData(/gx_sxst\(\)\{[\s\S]*\}/m,/data: ".*"/).slice(-7,-1);
};

function getstpage(){
    return new Promise((resolve, reject)=>{
        $.ajax({ url: window.location.origin + "/fyg_beach.php", type: 'GET', contentType: 'application/x-www-form-urlencoded; charset=UTF-8', processData: false, })
            .done(data => { if (data.ret == 200) { resolve(data.responseText) }else { console.log(data);reject(); }})
            .fail(data => { console.log(data);reject();});
    })
};

function getstdata(){
    return new Promise((resolve, reject)=>{
        $.ajax({ url: window.location.origin + "/fyg_read.php", type: 'POST', contentType: 'application/x-www-form-urlencoded; charset=UTF-8', data:"f=1",processData: false, })
            .done(data => { if (data.ret == 200) { /*console.log(data.responseText);*/resolve(data.responseText) }else { console.log(data);reject(); }})
            .fail(data => { console.log(data);reject();});
    })
};

function sxstbyxs(){
    return new Promise((resolve, reject)=>{
        $.ajax({ url: window.location.origin + "/fyg_click.php", type: 'POST', contentType: 'application/x-www-form-urlencoded; charset=UTF-8', data:"c=12&safeid=" + get_saveid(),processData: false, })
            .done(data => { if (data.ret == 200) { console.log(data.responseText);resolve(data.responseText) }else { console.log(data);reject(); }})
            .fail(data => { console.log(data);reject();});
    })
};

function refreshUntilCondition(refreshBoxNum) {
    if (refreshBoxNum === undefined || refreshBoxNum === NaN) {
        refreshBoxNum = parseInt(localStorage[keyname])
        if (isNaN(refreshBoxNum)) {
            localStorage[keyname] = 0
            refreshBoxNum = 0
        }
    } else {
        localStorage[keyname] = refreshBoxNum
    }
    console.log('ddd',refreshBoxNum)
    if (refreshBoxNum == 0) {
        return
    }
    if (refreshBoxNum > 0) {
        gx_sxst();

        localStorage[keyname] = refreshBoxNum - 1
    }
}

function createElementForOperation() {
    'use strict';
    refreshBoxNum = 0;
    let refreshEquipCaseNumInput = document.createElement("div")
    refreshEquipCaseNumInput.setAttribute('style',"display: inline-block;float: right!important;");

    let refreshEquipCaseNUMlabel = document.createElement('i');
    refreshEquipCaseNUMlabel.innerText = "批量使用随机装备箱个数：";
    refreshEquipCaseNumInput.appendChild(refreshEquipCaseNUMlabel);

    let refreshEquipCaseNUMInput = document.createElement('input');
    refreshEquipCaseNUMInput.setAttribute('type','text');
    refreshEquipCaseNUMInput.setAttribute('oninput',"value=value.replace(/[^\\d]/g,'')");
    refreshEquipCaseNUMInput.setAttribute('style',"width: 40px;margin-right:15px;");
    refreshEquipCaseNUMInput.value = refreshBoxNum;
    refreshEquipCaseNUMInput.onchange = function(){
        let localNUM = parseInt(refreshEquipCaseNUMInput.value);
        if(isNaN(localNUM)){
            refreshBoxNum = 0;
        }else if(localNUM<0){
            localNUM = 0;
        }
        refreshBoxNum = localNUM
    }
    refreshEquipCaseNumInput.appendChild(refreshEquipCaseNUMInput);
    $(".btn-group.pull-right").after(refreshEquipCaseNumInput);

    let refreshContinueBtn = document.createElement('button')
    refreshContinueBtn.setAttribute('type','button');
    refreshContinueBtn.setAttribute('class',"btn btn-success");
    refreshContinueBtn.setAttribute('style',"width: auto;margin-left:10px;");
    refreshContinueBtn.innerText = '批量消耗装备箱，获取随机装备'
    refreshContinueBtn.onclick = () => refreshUntilCondition(refreshBoxNum)
    document.querySelector('div.btn-group.pull-right > button').parentNode.append(refreshContinueBtn)
    // Your code here...
}

window.addEventListener('load', () => refreshUntilCondition()); createElementForOperation(); FLASHbeach();
};
$(document).ready(function(e) { guarb();});
