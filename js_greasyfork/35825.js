// ==UserScript==
// @name         NJUPT_Zhengfang_Fix_on_chrome
// @namespace    https://github.com/gaoliang/MyTampermonkey
// @version      0.1
// @description  修复南邮正方登录界面的bug,比如有时候输入框错乱，而且没法用chrome记住密码。
// @author       Gao Liang
// @match        http://jwxt.njupt.edu.cn
// @match        http://jwxt.njupt.edu.cn/default2.aspx
// @match        http://202.119.225.34
// @match        http://202.119.225.34/default2.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35825/NJUPT_Zhengfang_Fix_on_chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/35825/NJUPT_Zhengfang_Fix_on_chrome.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 去除没用的input
    var bad_input = document.getElementById("Textbox1");
    var _parentElement = bad_input.parentNode;
    if(_parentElement){
        _parentElement.removeChild(bad_input);
    }
    // 修改正确input的显示方式
    document.getElementById("TextBox2").style.display="inline";
})();