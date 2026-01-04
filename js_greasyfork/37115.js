// ==UserScript==
// @name         西南民族大学正方教务系统登录页面异常修复（修复输入框错乱、无法保存密码、无法使用部分脚本的bug）
// @namespace    smu-swun-jwxt-zf-fix
// @version      0.1.1801224
// @description  修复西南民族大学正方教务系统登录页面的bug：输入框错乱、无法保存密码、无法使用部分脚本。本脚本主要代码移至自@Gao Liang 的同类脚本，仅对适用页面做出调整。理论上经过修改也可用于其他学校的正方教务系统。
// @oldauthor       Gao Liang
// @author         zzhjim
// @match        http*://jwxt.njupt.edu.cn
// @match        http*://jwxt.njupt.edu.cn/default2.aspx
// @match        http*://jwxt.njupt.edu.cn/Default2.aspx
// @match        http*://202.119.225.34
// @match        http*://202.119.225.34/default2.aspx
// @match        http*://202.119.225.34/Default2.aspx
// @match        http*://211.83.241.245/default*.aspx
// @match        http*://211.83.241.245/Default*.aspx
// @match        http*://211.83.241.245
// @match        http*://jwxt.swun.edu.cn
// @match        http*://jwxt.swun.edu.cn/default2.aspx
// @match        http*://jwxt.swun.edu.cn/Default2.aspx
// @include      *://211.83.241.245/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37115/%E8%A5%BF%E5%8D%97%E6%B0%91%E6%97%8F%E5%A4%A7%E5%AD%A6%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2%E5%BC%82%E5%B8%B8%E4%BF%AE%E5%A4%8D%EF%BC%88%E4%BF%AE%E5%A4%8D%E8%BE%93%E5%85%A5%E6%A1%86%E9%94%99%E4%B9%B1%E3%80%81%E6%97%A0%E6%B3%95%E4%BF%9D%E5%AD%98%E5%AF%86%E7%A0%81%E3%80%81%E6%97%A0%E6%B3%95%E4%BD%BF%E7%94%A8%E9%83%A8%E5%88%86%E8%84%9A%E6%9C%AC%E7%9A%84bug%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/37115/%E8%A5%BF%E5%8D%97%E6%B0%91%E6%97%8F%E5%A4%A7%E5%AD%A6%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2%E5%BC%82%E5%B8%B8%E4%BF%AE%E5%A4%8D%EF%BC%88%E4%BF%AE%E5%A4%8D%E8%BE%93%E5%85%A5%E6%A1%86%E9%94%99%E4%B9%B1%E3%80%81%E6%97%A0%E6%B3%95%E4%BF%9D%E5%AD%98%E5%AF%86%E7%A0%81%E3%80%81%E6%97%A0%E6%B3%95%E4%BD%BF%E7%94%A8%E9%83%A8%E5%88%86%E8%84%9A%E6%9C%AC%E7%9A%84bug%EF%BC%89.meta.js
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