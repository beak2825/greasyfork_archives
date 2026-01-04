// ==UserScript==
// @name         Xray Web
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Send current web url to xray
// @author       Rvn0xsy
// @match        http://*/*
// @match        https://*/*
// @include      http://*/*
// @include      https://*/*
// @grant    GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438320/Xray%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/438320/Xray%20Web.meta.js
// ==/UserScript==

GM_registerMenuCommand ("登录接口",Login, "l");
GM_registerMenuCommand ("当前页面发送到Xray",XrayCheck, "s");
GM_registerMenuCommand ("当前页面发送到侦查守卫",ObsWardCheck, "o");

function Login(){
  var exploit_url=prompt("Please enter exploit url","https://exp.tool-kits.space:8443")
  var username=prompt("Please enter username","")
  var password=prompt("Please enter password","")
  if(username == null || username == "" || password == null || password == ""){
     Login();
  }
  GM_setValue("exploit_url",exploit_url+"/scan_http");
  GM_setValue("obs_ward_url",exploit_url+"/obs_scan");
  GM_setValue("username",username);
  GM_setValue("password",password);
}

function ObsWardCheck(){
    var target = window.location.href // 获取当前网址
    var messaage = new Object()
    messaage.type = 2
    messaage.message = target
    var msg = JSON.stringify(messaage)
    var url = GM_getValue("obs_ward_url"); // obs_ward_url
    var username = GM_getValue("username");
    var password = GM_getValue("password");
    var basic = "Basic "+btoa(username + ":"+ password)
    GM_xmlhttpRequest({
        url:url,
        method :"POST",
        data:msg,
        headers: {
            "Content-type": "application/json",
            "Authorization":basic
        },
        onload:function(xhr){
            var data = JSON.parse(xhr.responseText)
            if(data.Succeed){
                alert("发送任务成功！")
            }else{
                alert("发送任务失败，请重新刷新页面")
            }
            console.log(xhr.responseText);
        }
    });

}

function XrayCheck(){
    var target = window.location.href // 获取当前网址
    var messaage = new Object()
    messaage.type = 2
    messaage.message = target
    var msg = JSON.stringify(messaage)
    var url = GM_getValue("exploit_url"); // EXPLOIT URL
    var username = GM_getValue("username");
    var password = GM_getValue("password");
    var basic = "Basic "+btoa(username + ":"+ password)
    GM_xmlhttpRequest({
        url:url,
        method :"POST",
        data:msg,
        headers: {
            "Content-type": "application/json",
            "Authorization":basic
        },
        onload:function(xhr){
            var data = JSON.parse(xhr.responseText)
            if(data.Succeed){
                alert("发送任务成功！")
            }else{
                alert("发送任务失败，请重新刷新页面")
            }
            console.log(xhr.responseText);
        }
    });
}