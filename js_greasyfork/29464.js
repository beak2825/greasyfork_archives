// ==UserScript==
// @name        关闭新浪博客安装flashplayer提示窗口
// @namespace   *
// @version     1
// @grant       none
// @include     http://blog.sina.com.cn/s/blog_*.html*
// @description 自动关闭新浪博客安装flashplayer提示窗口
// @downloadURL https://update.greasyfork.org/scripts/29464/%E5%85%B3%E9%97%AD%E6%96%B0%E6%B5%AA%E5%8D%9A%E5%AE%A2%E5%AE%89%E8%A3%85flashplayer%E6%8F%90%E7%A4%BA%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/29464/%E5%85%B3%E9%97%AD%E6%96%B0%E6%B5%AA%E5%8D%9A%E5%AE%A2%E5%AE%89%E8%A3%85flashplayer%E6%8F%90%E7%A4%BA%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==

var runcount = 0;
function clickbutton() {
  runcount = runcount + 1;
  if(runcount>9){runcount=10;return;}
  var buttonone = document.getElementsByClassName("CP_w_shut")
  var i;
    for (i = 0; i < buttonone.length; i++) {
        buttonone[i].click();
    }
}
setInterval(clickbutton, 2000);