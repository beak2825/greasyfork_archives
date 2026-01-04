// ==UserScript==
// @name         新版CSDN自动阅读全文
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动点击新版CSDN自动阅读全文按钮
// @author       dreacter
// @match        http://blog.csdn.net/*/article/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33934/%E6%96%B0%E7%89%88CSDN%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/33934/%E6%96%B0%E7%89%88CSDN%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

//修改自https://greasyfork.org/zh-CN/scripts/29464-%E5%85%B3%E9%97%AD%E6%96%B0%E6%B5%AA%E5%8D%9A%E5%AE%A2%E5%AE%89%E8%A3%85flashplayer%E6%8F%90%E7%A4%BA%E7%AA%97%E5%8F%A3

var runcount = 0;
function clickbutton() {
  runcount = runcount + 1;
  if(runcount>9){runcount=10;return;}
  var buttonone = document.getElementsByClassName("read_more_btn")
  var i;
    for (i = 0; i < buttonone.length; i++) {
        buttonone[i].click();
    }
}
setInterval(clickbutton, 2);