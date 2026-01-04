// ==UserScript==
// @name         公务员自动登陆脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于自动填写国家公务员报名确认登录
// @author       luwenjie
// @match        *://*.gwy.cpta.com.cn/*
// @match        *://*.icourse163.org/*
// @license      MIT
// @match        http://kmlypx.ylxue.net/LearningCenter/LearningCourseVideo?cid=42599&tid=1715
// @match        http://kmlypx.ylxue.net/LearningCenter/LearningCourseVideo?cid=46238&tid=1715
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @connect      icourse163.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478733/%E5%85%AC%E5%8A%A1%E5%91%98%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/478733/%E5%85%AC%E5%8A%A1%E5%91%98%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
//申明：代码仅用于测试和自己使用，请不要用于危害国家攻击漏洞的工具
//作者：陆文杰
//需要执行的代码写在这里
    // 获取到<input>元素
var inputElement = document.getElementById("yusername");
var sfz = document.getElementById("ypassword");

// 这里输入你的报考序号
inputElement.value = "202******71";
//这里使身份证
sfz.value = "5********9";

//关闭点击登陆错误提示
var closeButton = document.querySelector(".aui_close");

// 模拟点击操作
if (closeButton) {
  closeButton.click();
}


})();