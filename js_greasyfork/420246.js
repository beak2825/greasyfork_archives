// ==UserScript==
// @name         acfun 自动选择最高画质
// @namespace 	 oracle_cai
// @version      1.1
// @description  不要相信自动画质
// @author       oracle_cai
// @include      *://www.acfun.cn/v/ac*
// @include      *://www.acfun.cn/bangumi/aa*
// @connect      www.acfun.cn
// @downloadURL https://update.greasyfork.org/scripts/420246/acfun%20%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/420246/acfun%20%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

window.onload = function () {
  document.querySelector(".quality-panel ul li").click()
}

document.addEventListener('visibilitychange',function(){ //浏览器切换事件
  if(document.visibilityState=='hidden') { //离开当前tab标签
      //console.log("离开当前tab标签");
  }else {//回到当前tab标签
      document.querySelector(".quality-panel ul li").click()
  }
});