// ==UserScript==
// @name         zsh计时页面修改
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  easy user
// @author       zsh
// @match        http://59.216.1.130:8080/portal/page/online.jsp*
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1.130
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455676/zsh%E8%AE%A1%E6%97%B6%E9%A1%B5%E9%9D%A2%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/455676/zsh%E8%AE%A1%E6%97%B6%E9%A1%B5%E9%9D%A2%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var xnet;//读取网络类参数型用
    xnet = location.href.split('&'); //分割地址栏 参数
    var patt;//测试是否存在字符
    patt = /@internet-portal/; //正则表达式
    if (patt.test(xnet[6]))
    {
          document.getElementsByTagName("title")[0].innerText = '互联网'; //更换计时页面的标题
      }
    else
        {
          document.getElementsByTagName("title")[0].innerText = '**政务外**'; //更换计时页面的标题
        }
  xnet=""; //清空参数

})();