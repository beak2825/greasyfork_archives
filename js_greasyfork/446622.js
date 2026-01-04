// ==UserScript==
// @name         B站视频分P时长导出
// @namespace    B站视频分P时长导出
// @version      0.2
// @description  在控制台导出B站多P视频的分P时长
// @author       WEIXINZHUYI
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446622/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%88%86P%E6%97%B6%E9%95%BF%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/446622/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%88%86P%E6%97%B6%E9%95%BF%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
setTimeout(function(){var great = document.getElementsByClassName("clickitem");
var num = document.getElementsByClassName("page-num");
var times = document.getElementsByClassName("duration")
var text = ""
for (let index = 0; index < num.length; index++) {
   text = text+num[index].innerHTML +"\t"+ times[index].innerHTML+"\n"
}
console.log(text)

},3000);

})();