// ==UserScript==
// @name         CC98自动切换账号
// @namespace    https://www.cc98.org/user/id/760051
// @version      2025-11-19
// @description  qiehuanzhanghao
// @author       chengyi
// @match        https://www.cc98.org/*
// @match        http://www-cc98-org-s.webvpn.zju.edu.cn:8001/*
// @require https://update.greasyfork.org/scripts/474584/1245726/ElementGetter%E5%BC%80%E6%BA%90%E5%BA%93.js
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502432/CC98%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%B4%A6%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/502432/CC98%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%B4%A6%E5%8F%B7.meta.js
// ==/UserScript==

function changeReactInputValue(inputDom,newText){
    let lastValue = inputDom.value;
    inputDom.value = newText;
    let event = new Event('input', { bubbles: true });
    event.simulated = true;
    let tracker = inputDom._valueTracker;
    if (tracker) {
      tracker.setValue(lastValue);
    }
    inputDom.dispatchEvent(event);
}
function jumpToLog(){
    window.location.href = "/logOn"
}
function autoForm(ac_un,ac_pw){
    elmGetter.get("#loginName").then(function(ccc){changeReactInputValue(ccc,ac_un)})
    elmGetter.get("#loginPassword").then(function(ccc){
        changeReactInputValue(ccc,ac_pw)
        elmGetter.get("button").then(function(ccc){ccc.click();});
    })
}

(function() {
    'use strict';

    // Your code here...

    function set_user(){
		var d = document;
		var div = d.createElement('div');
		div.id = 'dashboard111';
		div.innerHTML =
            "<h1>设置账户面板</h1>"+
         "<fieldset>"+
         "<legend>用户名及密码</legend>"+
         "<label for='uname'>用户名1:</label> <input id='uname1' type='text'><br /> "+
         "<label for='upass'>密  码1:</label> <input id='upass1' type='password'><br />"+
         "<HR>"+
           "<label for='uname'>用户名2:</label> <input id='uname2' type='text'><br /> "+
         "<label for='upass'>密  码2:</label> <input id='upass2' type='password'><br />"+
            "<HR>"+
             "<label for='uname'>用户名3:</label> <input id='uname3' type='text'><br /> "+
         "<label for='upass'>密  码3:</label> <input id='upass3' type='password'><br />"+
            "<HR>"+
           "<label for='uname'>用户名4:</label> <input id='uname4' type='text'><br /> "+
         "<label for='upass'>密  码4:</label> <input id='upass4' type='password'><br />"+
            "<HR>"+
           "<label for='uname'>用户名5:</label> <input id='uname5' type='text'><br /> "+
         "<label for='upass'>密  码5:</label> <input id='upass5' type='password'><br />"+
         "<input id='finish123' type='button' value='保存用户'>"+
         "</fieldset>"+
          "<input id='clos' type='button' value='关闭设置' onclick=\"document.body.removeChild(document.getElementById('dashboard111'))\">";
		d.body.appendChild(div);
        document.getElementById('uname1').value = GM_getValue("ac1_un","什么都没有");document.getElementById('upass1').value = GM_getValue("ac1_pw","什么都没有");
        document.getElementById('uname2').value = GM_getValue("ac2_un","什么都没有");document.getElementById('upass2').value = GM_getValue("ac2_pw","什么都没有");
        document.getElementById('uname3').value = GM_getValue("ac3_un","什么都没有");document.getElementById('upass3').value = GM_getValue("ac3_pw","什么都没有");
        document.getElementById('uname4').value = GM_getValue("ac4_un","什么都没有");document.getElementById('upass4').value = GM_getValue("ac4_pw","什么都没有");
        document.getElementById('uname5').value = GM_getValue("ac5_un","什么都没有");document.getElementById('upass5').value = GM_getValue("ac5_pw","什么都没有");


		//编辑账户
		document.getElementById('finish123').addEventListener('click',function(){
            var uname = document.getElementById('uname1').value;
            var upass = document.getElementById('upass1').value;
			GM_setValue("ac1_un",uname);
            GM_setValue("ac1_pw",upass);
            //注意有4个变量名字要换
            uname = document.getElementById('uname2').value;
            upass = document.getElementById('upass2').value;
			GM_setValue("ac2_un",uname);
            GM_setValue("ac2_pw",upass);

            uname = document.getElementById('uname3').value;
            upass = document.getElementById('upass3').value;
			GM_setValue("ac3_un",uname);
            GM_setValue("ac3_pw",upass);

            uname = document.getElementById('uname4').value;
            upass = document.getElementById('upass4').value;
			GM_setValue("ac4_un",uname);
            GM_setValue("ac4_pw",upass);

            uname = document.getElementById('uname5').value;
            upass = document.getElementById('upass5').value;
			GM_setValue("ac5_un",uname);
            GM_setValue("ac5_pw",upass);
            alert("保存成功");
            location.reload();
		},false);
	}

	GM_registerMenuCommand('设置自动登陆账户',function(){set_user();},"z");



    if(GM_getValue("ifautojump",0)==1){
        GM_setValue("ifautojump",0);
        var nowurl1 = GM_getValue("nowurl","https://www.cc98.org/");//无值时的返回应该有vpn和校内网两种网址，但一般来说不会没有值，故先不设置了
        //console.log(nowurl1);debugger;
        if(((window.location.href!="https://www.cc98.org/" || nowurl1!="https://www.cc98.org/") && nowurl1.toLowerCase() !="https://www.cc98.org/logon") && ((window.location.href!="http://www-cc98-org-s.webvpn.zju.edu.cn:8001/" || nowurl1!="http://www-cc98-org-s.webvpn.zju.edu.cn:8001/") && nowurl1.toLowerCase() !="http://www-cc98-org-s.webvpn.zju.edu.cn:8001/logon")){window.location.href = nowurl1};
    };

    //var ac1_un = GM_getValue("ac1_un","什么都没有");var ac1_pw = GM_getValue("ac1_un","什么都没有");
    //var ac2_un = GM_getValue("ac2_un","什么都没有");var ac2_pw = GM_getValue("ac2_pw","什么都没有");
    //var ac3_un = GM_getValue("ac3_un","什么都没有");var ac3_pw = GM_getValue("ac3_pw","什么都没有");

    const id1 = GM_registerMenuCommand(GM_getValue("ac1_un","什么都没有"),function(){GM_setValue("ac_un",GM_getValue("ac1_un","什么都没有"));GM_setValue("ac_pw",GM_getValue("ac1_pw","什么都没有"));GM_setValue("ifauto",1);GM_setValue("nowurl",window.location.href);jumpToLog();},"1");//ifauto为1则触发自动登陆
    const id2 = GM_registerMenuCommand(GM_getValue("ac2_un","什么都没有"),function(){GM_setValue("ac_un",GM_getValue("ac2_un","什么都没有"));GM_setValue("ac_pw",GM_getValue("ac2_pw","什么都没有"));GM_setValue("ifauto",1);GM_setValue("nowurl",window.location.href);jumpToLog();},"2");
    const id3 = GM_registerMenuCommand(GM_getValue("ac3_un","什么都没有"),function(){GM_setValue("ac_un",GM_getValue("ac3_un","什么都没有"));GM_setValue("ac_pw",GM_getValue("ac3_pw","什么都没有"));GM_setValue("ifauto",1);GM_setValue("nowurl",window.location.href);jumpToLog();},"3");
    const id4 = GM_registerMenuCommand(GM_getValue("ac4_un","什么都没有"),function(){GM_setValue("ac_un",GM_getValue("ac4_un","什么都没有"));GM_setValue("ac_pw",GM_getValue("ac4_pw","什么都没有"));GM_setValue("ifauto",1);GM_setValue("nowurl",window.location.href);jumpToLog();},"4");
    const id5 = GM_registerMenuCommand(GM_getValue("ac5_un","什么都没有"),function(){GM_setValue("ac_un",GM_getValue("ac5_un","什么都没有"));GM_setValue("ac_pw",GM_getValue("ac5_pw","什么都没有"));GM_setValue("ifauto",1);GM_setValue("nowurl",window.location.href);jumpToLog();},"5");
    if(GM_getValue("ifauto",0)==1){
        if(window.location.href == "https://www.cc98.org/logOn" || window.location.href == "http://www-cc98-org-s.webvpn.zju.edu.cn:8001/logOn"){
            GM_setValue("ifauto",0);GM_setValue("ifautojump",1);//ifautojump为1表示自动跳转到之前浏览的页面
            autoForm(GM_getValue("ac_un","惊现bug"),GM_getValue("ac_pw",null));
            //elmGetter.get("button").then(function(ccc){ccc.click();});//自动点击将被添加到autoForm函数中

        }
    };




})();
