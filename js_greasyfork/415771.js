// ==UserScript==
// @name         乐班班刷课
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Rowan
// @match        *://*.lebanban.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/415771/%E4%B9%90%E7%8F%AD%E7%8F%AD%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/415771/%E4%B9%90%E7%8F%AD%E7%8F%AD%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
var setting = {},
_self = unsafeWindow,
url = location.pathname,
top = _self;

var $ = _self.jQuery || top.jQuery,
parent = _self == top ? self : _self.parent,
Ext = _self.Ext || parent.Ext || {},
UE = _self.UE,
Hooks = Hooks || window.Hooks;
var myDate = new Date();

setting.normal = ''; // ':visible'
    var st;

    function loopFunc (tt){
    st = setTimeout(function(){

        if($("div.vdialog.vdialog-fixed").length>0){
          //  window.open('www.baidu.com'); 可以用打开新窗口的方式提醒手动点击，（这是没有做自动点击时用的）   // https://www.lebanban.com/course/introduction/19611.shtml
          //  alert("时间到了！！！~");
            $("a[data-name='ok']").click();
            myDate = new Date();
            console.log("点击了"+myDate.toLocaleString());

        }
        // 播放到第三集的时候，重新播放第一集
        if($("div.course-card").eq(2).attr("class")=="course-card playing active"){
            console.log(1111);
         $("div.course-card").eq(0).click();
        }
loopFunc(5000)
    },tt);
    }
    loopFunc(5000)
    // Your code here...



})();