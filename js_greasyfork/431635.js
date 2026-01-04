// ==UserScript==
// @require      https://apps.bdimg.com/libs/jquery/2.2.4/jquery.min.js
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  测试测试!
// @author       xmdy
// @match        https://live.douyin.com/*
// @grant        none
/* jshint esversion: 6 */
// @downloadURL https://update.greasyfork.org/scripts/431635/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/431635/New%20Userscript.meta.js
// ==/UserScript==

var jihe = [];
console.show();
var token;
var timestart = new Date().getTime();
function wxsc(str1){

    var htm = "https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token="+token;
    var pp = {
        "touser":"@all",
        "agentid":1000008,
        "text":{"content":str1},
        "msgtype":"text"
    };
    $.post(htm, pp, function (data) {
        alert(data.msg); 
    });
}
function sleep(millisecond) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, millisecond)
    })
}
function tokens(){
    var url = "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=ww039764a131f24450&corpsecret=7Dupm_E5jJX8az9ZamHzhVQPjlUSJN-2DyZy-5FCObY";

    var httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
    httpRequest.open('GET', url, true);//第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
    httpRequest.send();//第三步：发送请求  将请求参数写在URL中

    httpRequest.onreadystatechange = function () {
        if (httpRequest.responseText) {
            var json = httpRequest.responseText;//获取到json字符串，还需解析
            console.log(json);
            token = json.access_token;

        }
    };
}
while (true) {
    sleep(200);

    if(token == "undefined" || token == null || token == ""){
        tokens();

    }
}
// Your code here...
