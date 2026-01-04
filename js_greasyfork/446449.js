// ==UserScript==
// @name         立知课堂讨论区辅助工具
// @namespace    https://ez118.github.io/
// @version      1.7
// @description  立知课堂破解工具，提供丰富功能（由上海市某中学的多位青年共同开发、支持、调试和维护）
// @author       ZZY_WISU
// @match        https://*.imlizhi.com/slive/pc/*
// @match        https://easilive.seewo.com/course/*
// @license      GNU GPLv3
// @icon         https://edu.seewo.com/res/head/1/default.png
// @run-at document-end
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/446449/%E7%AB%8B%E7%9F%A5%E8%AF%BE%E5%A0%82%E8%AE%A8%E8%AE%BA%E5%8C%BA%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/446449/%E7%AB%8B%E7%9F%A5%E8%AF%BE%E5%A0%82%E8%AE%A8%E8%AE%BA%E5%8C%BA%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==




/*   自定义部分   */
var DefaultAnswerText = "老师好~😄😄😄";
/*以上为自定义部分*/

/*  功能函数设定  */
function Send(con, uid, rid){
    var ServerTime = new Date().getTime();
    var xhttp = null; if(window.XMLHttpRequest){ xhttp = new XMLHttpRequest(); } else if(window.ActiveXObject){ xhttp = new ActiveXObject('Microsoft.XMLHTTP'); }

    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            var jstr = eval("(" + this.responseText + ")");
            if(jstr.error_code == 0){ }
            else { alert("错误! [" + jstr.error_code + "]\n" + jstr.message); }
        }
    };
    xhttp.open("POST", "./apis.json?actionName=CHAT_SEND_QUESTION&t=" + ServerTime, true);
    xhttp.setRequestHeader('Content-Type','application/json');
    xhttp.send('{"roomId":"' + rid + '","courseUid":"' + uid + '","text":"' + con + '"}');
}

function SendText(Content){
    var uid = window.location.href.split("?")[1].split("&")[0].split("=")[1];
    var ServerTime = new Date().getTime();
    var xhttp = null; if(window.XMLHttpRequest){ xhttp = new XMLHttpRequest(); } else if(window.ActiveXObject){ xhttp = new ActiveXObject('Microsoft.XMLHTTP'); }

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var jstr = eval("(" + this.responseText + ")");
            Send(Content, uid, jstr.data.roomId);
        }
    };
    xhttp.open("POST", "./apis.json?actionName=GET_TARGET_COURSE&t=" + ServerTime, true);
    xhttp.setRequestHeader('Content-Type','application/json');
    xhttp.send('{"courseUid":"' + uid + '"}');
}
/* 以上为函数设定 */

/*    菜单设定    */
let menu1 = GM_registerMenuCommand('自动问好功能（不会重复运行）', function () {
    if(GM_getValue("AutoAnsCon") == "" || GM_getValue("AutoAnsCon") == null || GM_getValue("AutoAnsCon") == undefined) { GM_setValue("AutoAnsCon", DefaultAnswerText); }
    GM_setValue("AutoAnsStatus", "1");
    //alert("已设定完成！\n自动问好将在下次页面刷新后自动执行。\n执行时的候语是：" + GM_getValue("AutoAnsCon"));
    let AAT = prompt(`【设定完成】\n自动问好将在下次页面刷新后自动执行。\n(确定-设定 | 取消-取消设定)\n执行时的候语是：`, GM_getValue("AutoAnsCon"));
    if (AAT == null) {
        GM_setValue("AutoAnsStatus", "0");
    } else {
        GM_setValue("AutoAnsStatus", "1");
        GM_setValue("AutoAnsCon", AAT);
    }
}, 'U');

let menu2 = GM_registerMenuCommand('讨论区刷屏工具', function () {
    var uid=window.location.href.split("?")[1].split("&")[0].split("=")[1];
    var ServerTime=new Date().getTime();

    var xhttp=null;if(window.XMLHttpRequest){xhttp=new XMLHttpRequest()}
    else if(window.ActiveXObject){xhttp=new ActiveXObject('Microsoft.XMLHTTP')}

    xhttp.onreadystatechange=function(){
        if(this.readyState==4&&this.status==200){
            var jstr=eval("("+this.responseText+")");let rid=jstr.data.roomId;var SqStr=prompt("请输入想要发送的内容：","");if(SqStr==null){return}var SqTimeSet=prompt("请输入想要发送的次数：","1");for(let i=1;i<=SqTimeSet;i++){Send(SqStr,uid,rid)}
        }
    };
    xhttp.open("POST","./apis.json?actionName=GET_TARGET_COURSE&t="+ServerTime,true);
    xhttp.setRequestHeader('Content-Type','application/json');
    xhttp.send('{"courseUid":"'+uid+'"}');
}, 'S');
/* 以上为菜单设定 */


(function() {
    'use strict';
    if (GM_getValue("AutoAnsStatus") == "1"){
        setTimeout(function() {
            GM_setValue("AutoAnsStatus", "0");
            SendText(GM_getValue("AutoAnsCon"));
        }, 3000);
    }
})();