// ==UserScript==
// @name         Discuz!
// @icon         https://www.discuz.vip/favicon.ico
// @namespace    https://greasyfork.org/users/878514
// @version      20231009
// @description  设置每小时发回帖数限制，显示回复限制倒计时，到点系统通知提醒，提供4个自定地址，配置持久化
// @author       Velens
// @match        *://*/forum.php*
// @match        *://*/forum-*.html
// @match        *://*/thread-*.html
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/476968/Discuz%21.user.js
// @updateURL https://update.greasyfork.org/scripts/476968/Discuz%21.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */
let tieshu = GM_getValue("tieshu",0),tieshuMenu = tieshu;
let flagNotice = GM_getValue("flagNotice",false),flagNoticenow = false,flagNoticeMenu;
let baseHref = $("base").attr("href");
let baseTitle = baseHref.replace(/(http|https):\/\//,"").replace(/\//,"");
let tieshu1 = GM_getValue("tieshu1"),tieshuMenu1 = tieshu1,baseHref1 = GM_getValue("baseHref1"),baseTitle1;
let tieshu2 = GM_getValue("tieshu2"),tieshuMenu2 = tieshu2,baseHref2 = GM_getValue("baseHref2"),baseTitle2;
let tieshu3 = GM_getValue("tieshu3"),tieshuMenu3 = tieshu3,baseHref3 = GM_getValue("baseHref3"),baseTitle3;
let tieshu4 = GM_getValue("tieshu4"),tieshuMenu4 = tieshu4,baseHref4 = GM_getValue("baseHref4"),baseTitle4;

if(tieshu == 0){tieshuMenu = "关闭"};
GM_registerMenuCommand("贴数限制：" + tieshuMenu,tieShu)
function tieShu(){
    tieshu = prompt("请输入每小时发回帖数限制（关闭：0）", GM_getValue("tieshu"));
    if(/^\d+$/.test(tieshu) && tieshu != GM_getValue("tieshu")){
        GM_setValue("tieshu",tieshu);
        location.reload();}
};

if(flagNotice){flagNoticeMenu = "开启"}
else{flagNoticeMenu = "关闭"};
GM_registerMenuCommand("到点提醒：" + flagNoticeMenu,flagNoticef)
function flagNoticef(){
    flagNotice = !GM_getValue("flagNotice");
    GM_setValue("flagNotice",flagNotice);
    location.reload();
};

if(tieshu1 == 0){tieshuMenu1 = "关闭"}
if(!baseHref1){baseTitle1 = "网址";tieshuMenu1 = "帖数"}
else{baseTitle1 = baseHref1.replace(/(http|https):\/\//,"").replace(/\//,"")};
GM_registerMenuCommand("自定1：" + baseTitle1 + "，" + tieshuMenu1,baseHref1f)
function baseHref1f(){
    baseHref1 = baseHref;
    tieshu1 = prompt("请输入每小时发回帖数限制（关闭：0）", GM_getValue("tieshu1"));
    if(/^\d+$/.test(tieshu1)){
        if(baseHref1 != GM_getValue("baseHref1") || tieshu1 != GM_getValue("tieshu1")){
            GM_setValue("tieshu1",tieshu1);
            GM_setValue("baseHref1",baseHref1);
            location.reload();}
    }
};

if(tieshu2 == 0){tieshuMenu2 = "关闭"}
if(!baseHref2){baseTitle2 = "网址";tieshuMenu2 = "帖数"}
else{baseTitle2 = baseHref2.replace(/(http|https):\/\//,"").replace(/\//,"")};
GM_registerMenuCommand("自定2：" + baseTitle2 + "，" + tieshuMenu2,baseHref2f)
function baseHref2f(){
    baseHref2 = baseHref;
    tieshu2 = prompt("请输入每小时发回帖数限制（关闭：0）", GM_getValue("tieshu2"));
    if(/^\d+$/.test(tieshu2)){
        if(baseHref2 != GM_getValue("baseHref2") || tieshu2 != GM_getValue("tieshu2")){
            GM_setValue("tieshu2",tieshu2);
            GM_setValue("baseHref2",baseHref2);
            location.reload();}
    }
};

if(tieshu3 == 0){tieshuMenu3 = "关闭"}
if(!baseHref3){baseTitle3 = "网址";tieshuMenu3 = "帖数"}
else{baseTitle3 = baseHref3.replace(/(http|https):\/\//,"").replace(/\//,"")};
GM_registerMenuCommand("自定3：" + baseTitle3 + "，" + tieshuMenu3,baseHref3f)
function baseHref3f(){
    baseHref3 = baseHref;
    tieshu3 = prompt("请输入每小时发回帖数限制（关闭：0）", GM_getValue("tieshu3"));
    if(/^\d+$/.test(tieshu3)){
        if(baseHref3 != GM_getValue("baseHref3") || tieshu3 != GM_getValue("tieshu3")){
            GM_setValue("tieshu3",tieshu3);
            GM_setValue("baseHref3",baseHref3);
            location.reload();}
    }
};

if(tieshu4 == 0){tieshuMenu4 = "关闭"}
if(!baseHref4){baseTitle4 = "网址";tieshuMenu4 = "帖数"}
else{baseTitle4 = baseHref4.replace(/(http|https):\/\//,"").replace(/\//,"")};
GM_registerMenuCommand("自定4：" + baseTitle4 + "，" + tieshuMenu4,baseHref4f)
function baseHref4f(){
    baseHref4 = baseHref;
    tieshu4 = prompt("请输入每小时发回帖数限制（关闭：0）", GM_getValue("tieshu4"));
    if(/^\d+$/.test(tieshu4)){
        if(baseHref4 != GM_getValue("baseHref4") || tieshu4 != GM_getValue("tieshu4")){
            GM_setValue("tieshu4",tieshu4);
            GM_setValue("baseHref4",baseHref4);
            location.reload();}
    }
};

if(baseHref == baseHref1){tieshu = tieshu1};
if(baseHref == baseHref2){tieshu = tieshu2};
if(baseHref == baseHref3){tieshu = tieshu3};
if(baseHref == baseHref4){tieshu = tieshu4};
if($("#g_upmine").text() && tieshu != 0){
    var numPage = Math.ceil(tieshu/20);
    GM_xmlhttpRequest({
        method: "get",
        url: baseHref + "home.php?mod=space&do=thread&view=me&type=reply&from=space&page=" + numPage,
        onload: function(resHome) {
            const pid = resHome.responseText.match(/ptid=\d+&amp;pid=\d+/g);
            if(pid.length >= tieshu - 20*(numPage-1) && tieshu > 0){
                const pidNum= pid.map(value => value.match(/\d+/g));
                let i = 0,j = 0,t;
                for ( i = 0; i < pidNum.length; i++){
                    for (j = 0; j < pidNum.length; j++){
                        if (pidNum[i][1] > pidNum[j][1]){
                            t = pidNum[i];
                            pidNum[i] = pidNum[j];
                            pidNum[j] = t;
                        }}}
                const pidNew = pidNum[tieshu - 20*(numPage-1)-1];
                GM_xmlhttpRequest({
                    method: "get",
                    url: baseHref + "forum.php?mod=redirect&goto=findpost&ptid=" + pidNew[0] + "&pid=" + pidNew[1],
                    onload: function(resTime) {
                        let pidIndex = resTime.responseText.indexOf("authorposton" + pidNew[1]);
                        let pidTime = resTime.responseText.substring(pidIndex+21,pidIndex+80);
                        pidTime = pidTime.match(/\d+-\d+-\d+ \d+:\d+/)[0];
                        var pidTimestamp = Date.parse(pidTime) + 3600000;
                        var nowTime = Date.now();
                        var waitTime = Math.ceil((pidTimestamp - nowTime)/60000);
                        if(waitTime > 0){
                            var buttonTime = "<button class='limitTime'></button>";
                            $("body").append(buttonTime);
                            $('.limitTime').click(function () {
                                if(flagNotice){flagNotice = false;}
                                else{flagNoticenow = !flagNoticenow;}
                                if(flagNotice || flagNoticenow){GM_addStyle(`.limitTime{border: 2px solid #00FF00;}`);}
                                else{GM_addStyle(`.limitTime{border: 2px solid #444;}`);}
                            })
                            $(".limitTime").attr("title", "每小时发回帖数限制 " + tieshu + "\n发表于 " + pidTime);
                            $(".limitTime").text("回复限制 " + waitTime + " 分钟");
                            if(flagNotice || flagNoticenow){GM_addStyle(`.limitTime{border: 2px solid #00FF00;}`);}
                            else{GM_addStyle(`.limitTime{border: 2px solid #444;}`);}
                            GM_addStyle(`.limitTime{position:fixed;top:163px;right:0px;white-space:pre-wrap;opacity:0.8;border-radius:10px;}`);
                            var myVar = setInterval(waitVar, 10000);}
                        function waitVar(){
                            var nowTime = Date.now();
                            var waitTime = Math.ceil((pidTimestamp - nowTime)/60000);
                            if(waitTime > 0){
                                $(".limitTime").text("回复限制 " + waitTime + " 分钟");
                            }else{
                                clearInterval(myVar);
                                GM_addStyle(`.limitTime{display:none;}`);
                                if(flagNotice || flagNoticenow){
                                    flagNotice = false;
                                    flagNoticenow = false;
                                    GM_notification({title: baseTitle,text:"每小时发回帖数限制已解除",image:baseHref + "favicon.ico"});}
                            }
                        }
                    }
                })
            }}
    });
}

