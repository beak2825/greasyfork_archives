// ==UserScript==
// @name         Miaotixing
// @name:zh-CN   喵提醒
// @namespace    https://greasyfork.org/users/324077
// @version      1.0
// @description  Send message to user's cellphone, using WeChat, SMS(China mainland only), Voice Call(China mainland only).
// @description:zh-CN  向用户手机发送微信消息，短信消息（仅支持中国大陆）和语音消息（仅支持中国大陆）。
// @author       Chaopi
// @match        http://*
// @match        https://*
// @grant        none
// ==/UserScript==

/*
<How to use>
Guide users to subscribe WeChat Official Account "喵提醒" (Qrcode: https://miaotixing.com/welcome_assets/images/qrcode.jpg) and create a remind, return "喵码"(miaocode) to you, then you can send message to them.

== Parameter ==
miaocode: When users create a remind, they will get a "喵码", put "喵码" in this parameter.
text: You can put some additional information here.
callback: If you want to get the request results.

== Example ==
You are providing ticket-snatching services. A user created a remind named "I got a ticket!" and tell you his remind's "喵码" is tr12345. When you find a ticket for this user, you can use function:
miaotixing("tr12345", "Found a ticket at Setp.13 8:00am", function(data){console.log(data);});
If successed, the user's cellphone will receive a message:

【喵提醒】I got a ticket!
Found a ticket at Setp.13 8:00am



<使用说明>
指引用户关注微信公众号“喵提醒”(二维码: https://miaotixing.com/welcome_assets/images/qrcode.jpg)并创建一个提醒，将提醒的“喵码”告诉你，你就可以给用户发送信息。

== 参数 ==
miaocode: 当用户创建一个提醒，用户会获得一个“喵码”，将“喵码” 放入该参数内。
text: 你可以在这设置一些附加信息发给用户。
callback: 如果你需要获取信息发送的结果。

== 例子 ==
假设你在提供抢票服务，一位用户创建了一个名为“找到票啦！”的提醒，并把提醒的“喵码” tr12345 提交给你。当你为该用户找到票时，你可以这样调用function：
miaotixing("tr12345", "找到一张9月3日8:00的票", function(data){console.log(data);});
如果发送成功，该用户手机会收到这样一个信息:

【喵提醒】找到票啦！
找到一张9月3日8:00的票
*/

function miaotixing(miaocode, text='', callback=function(data){}) {
	window.miaotixing_callback = callback;
	var script = document.createElement("script");
	script.setAttribute("src", "//miaotixing.com/trigger?id=" + miaocode + "&text=" + encodeURI(text) + "&type=jsonp");
	document.getElementsByTagName("head")[0].appendChild(script);
}
function miaotixing_jsonpcallback(data){
    if(window.miaotixing_callback !== null) window.miaotixing_callback(data);
    if(data.code == 0){
        console.log("喵提醒发送成功。");
    }
    else{
        console.log("喵提醒发送失败，错误代码：" + data.code + "，" + data.msg);
    }
}