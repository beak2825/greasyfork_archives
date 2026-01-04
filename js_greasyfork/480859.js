// ==UserScript==
// @name         贵州民族大学校园网快速自动登录脚本
// @namespace    https://github.com/zuiyimeihuashang/taobao_scrapy/blob/master/%E5%AE%9E%E7%94%A8%E7%9A%84%E5%B0%8F%E7%A8%8B%E5%BA%8F/gzmu%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%99%BB%E5%BD%95.js
// @version      2.3
// @description  GZMU校园网自动登录脚本
// @author       inventor
// @match        *://*.10.210.154.31/a79.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=79.141
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480859/%E8%B4%B5%E5%B7%9E%E6%B0%91%E6%97%8F%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E5%BF%AB%E9%80%9F%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/480859/%E8%B4%B5%E5%B7%9E%E6%B0%91%E6%97%8F%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E5%BF%AB%E9%80%9F%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

var username = "2022XXXXX"; // 学号
var password = "23XXXX"; // 密码
var port = 2; // 0办公网，1学生内网，2中国移动，3中国电信

(function() {
    // 定义一个数组，包含用于选择运营商的input元素的选择器
    var portSelectors = ["input[value='@xyw']", "input[value='']", "input[value='@zgyd']", "input[value='@zglt']"];

    // 添加一个load事件监听器，用于在页面加载完成后执行以下操作
    window.addEventListener('load', function() {
        $(portSelectors[port]).click(); // 选择运行商
        $("input[name='DDDDD']").val(username); // 设置 input[name='DDDDD'] 元素的值，即用户名
        $("input[name='upass']").val(password); // 设置 input[name='upass'] 元素的值，即密码
        $("input[name='0MKKey']").click(); // 点击 input[name='0MKKey'] 元素，模拟用户登录
    }, false);
})();
