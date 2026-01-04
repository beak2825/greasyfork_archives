// ==UserScript==
// @name         洛谷学术神器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  更舒适的学术体验
// @author      Trotyl°
// @match        *://*.luogu.com.cn/*
// @match        *://*.luogu.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405841/%E6%B4%9B%E8%B0%B7%E5%AD%A6%E6%9C%AF%E7%A5%9E%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/405841/%E6%B4%9B%E8%B0%B7%E5%AD%A6%E6%9C%AF%E7%A5%9E%E5%99%A8.meta.js
// ==/UserScript==
  (function () {
  $('document').ready(function(){setTimeout(function () {
    var benben_01=localStorage.benben, discuss_01=localStorage.discuss, chat_01=localStorage.chat, notification_01=localStorage.notification;
      
    $sidebar = $('#app-old .lg-index-content .lg-right.am-u-lg-3');
    $firstele = $($sidebar.children()[0]);
   $finder = $(`
<div class="lg-article" id="console-form">
<script>
function save_benben_1(){
localStorage.benben=1;
location.href = "/";
return true;
}
function save_benben_0(){
localStorage.benben=0;
location.href = "/";
return true;
}
function save_discuss_1(){
console.log("暂不支持隐藏讨论，敬请期待！");
return true;
}
function save_discuss_0(){
console.log("暂不支持隐藏讨论，敬请期待！");
return true;
}
function all_1(){
localStorage.benben=1;
localStorage.discuss=1;
localStorage.chat=1;
localStorage.notification=1;
location.href = "/";
}
function all_0(){
localStorage.benben=0;
localStorage.discuss=0;
localStorage.chat=0;
localStorage.notification=0;
location.href = "/";
}
</script>
<h3 align="center">学术控制台</h3>
<div align="center">
是否隐藏犇犇<br>
</div>
<div align="center">
<button class="am-btn am-btn-sm am-btn-primary lg-left" style="background: rgb(82, 196, 26) none repeat scroll 0% 0%; color: rgb(255, 255, 255);" id="benben-button_1" onclick="save_benben_1()">是</button>
<button class="am-btn am-btn-sm am-btn-primary lg-right" style="background: rgb(254, 76, 97) none repeat scroll 0% 0%; color: rgb(255, 255, 255);" id="benben-button_0" onclick="save_benben_0()">否</button><br><br>
是否隐藏讨论<br>
<button class="am-btn am-btn-sm am-btn-primary lg-left" style="background: rgb(82, 196, 26) none repeat scroll 0% 0%; color: rgb(255, 255, 255);" id="discuss-button_1" onclick="save_discuss_1()">是</button>
<button class="am-btn am-btn-sm am-btn-primary lg-right" style="background: rgb(254, 76, 97) none repeat scroll 0% 0%; color: rgb(255, 255, 255);" id="discuss-button_0" onclick="save_discuss_0()">否</button><br><br>
</div>
<div align="center">
<button class="am-btn am-btn-sm am-btn-primary" style="margin-top:1px;" id="all-button_1" onclick="all_1()">全部变为隐藏</button>
<button class="am-btn am-btn-sm am-btn-primary" style="margin-top:1px;" id="all-button_0" onclick="all_0()">全部变为打开</button>
</div>
<div align="center"><small><small>你可以在这里控制你想打开的学术模式哦qwq</small></small></div>
<small><small>反馈问题：<a href="https://www.luogu.com.cn/chat?uid=128369" target="_blank">洛谷私信</a> or <a href="https://greasyfork.org/zh-CN/scripts/405841/feedback" target="_blank">讨论</a></small></small>
</div>
`);

$finder.insertAfter($firstele);
benben_01 = localStorage.benben;
      console.log("benben_01:", benben_01);
       console.log("localStorage.benben:", localStorage.benben);
/*输出各种状态*/
      /*
console.log(benben_01);
console.log(discuss_01);
console.log(chat_01);
console.log(notification_01);
*/
/*-------*/

var hidden_benben_css="";
hidden_benben_css += [".lg-index-benben>div+div+div {display: none!important}.lg-index-benben>div+div+div+ul  {display: none!important} div.feed+.spinner {display: none}div.feed+.load-more,#feed-more{display: none!important}"
       ].join("\n");//隐藏犇犇的css
var hidden_discuss_css="";
hidden_discuss_css += [".lg-index-benben>div+div+div {display: none!important}div.feed+.spinner {display: none}div.feed+.load-more,#feed-more{display: none!important}"
       ].join("\n");
      console.log("犇犇状态：",benben_01);
      if (benben_01 == 1) {//隐藏犇犇
          console.log("隐藏犇犇！");
      if (typeof GM_addStyle != "undefined") {
	GM_addStyle(hidden_benben_css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(hidden_benben_css);
} else if (typeof addStyle != "undefined") {
	addStyle(hidden_benben_css);
} else {
	var node_benben = document.createElement("style");
	node_benben.type = "text/css";
	node_benben.appendChild(document.createTextNode(hidden_benben_css));
	var heads_benben = document.getElementsByTagName("head");
	if (heads_benben.length > 0) {
		heads_benben[0].appendChild(node_benben);
	} else {
		document.documentElement.appendChild(node_benben);
	}
}
}
      if (discuss_01 == 1) {//隐藏讨论
          console.log("暂不支持隐藏讨论，敬请期待！");
      }
  },500)});
})();