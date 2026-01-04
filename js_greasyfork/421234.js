// ==UserScript==
// @name         大甲高工國文線上測驗逾期破解器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  大甲高工國文線上測驗逾期破解
// @author       李季衡
// @match        https://dd437.info/PlatformQUIZ__kdsaf83k8IBdX8o/practice.php?bookName=*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/421234/%E5%A4%A7%E7%94%B2%E9%AB%98%E5%B7%A5%E5%9C%8B%E6%96%87%E7%B7%9A%E4%B8%8A%E6%B8%AC%E9%A9%97%E9%80%BE%E6%9C%9F%E7%A0%B4%E8%A7%A3%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/421234/%E5%A4%A7%E7%94%B2%E9%AB%98%E5%B7%A5%E5%9C%8B%E6%96%87%E7%B7%9A%E4%B8%8A%E6%B8%AC%E9%A9%97%E9%80%BE%E6%9C%9F%E7%A0%B4%E8%A7%A3%E5%99%A8.meta.js
// ==/UserScript==

(function() {
var html
html = '<div style="height:5%;width:100%;background-color:#F2F2F2;font-size:20px;"><center><td><form name="form"method="post" action="evaluation_finish.php">題數：<input type="text" name="TKitemQuantity_" value="20"style="width:35px;height:40px;font-size:20px;"><input type=" text" name="TKno_" placeholder="請輸入編號"style="width:240px;height:40px;font-size:20px;"><input type="text" name="TKLessonID_" placeholder="請輸入課程代碼"style="width:240px;height:40px;font-size:20px;"><input type="hidden" name="tAA" value="1567870428"><input type="hidden" name="akdmocjjlwdkwkpaAcesbedFFabc" value="ajakckdkalckbdkwd"><input type="submit" name="button" value="破解"style="width:120px;height:40px;font-size:20px;"></form></td></center>';
document.body.insertAdjacentHTML('beforeBegin', html);
})();