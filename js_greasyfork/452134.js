// ==UserScript==
// @name 必应搜索去广告
// @description 必应搜索去广告。
// @version 1
// @match *://cn.bing.com/*
// @match *://www.bing.com/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @run-at document-start
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/452134/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/452134/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
//必应执行
if (location.hostname.indexOf("bing") < 0) return;

// 后续代码
(function(){
var g_times = 0;
function myfun() {
$(".b_ad").remove();
$(".ad_sc").remove();
$("#b_results > li:has(.b_adProvider)").remove();
$("li[class='b_algo']:has(.b_attribution[data-partnertag]+p[class])").remove();
 if(g_times >= 3) {
 window.clearInterval(timer);
 } 
 g_times ++;
}
let timer = setInterval(myfun,500);
myfun();
})();

})();