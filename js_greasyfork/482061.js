// ==UserScript==
// @name         湛江科技学院新教务系统快速评教脚本(智能制造学院版)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一款支持湛江科技学院教务系统快速评教的脚本。
// @author       高毅
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL
// @include      https://jwxt.zjkju.edu.cn/zjkjjw/frame/homes.html?v=*
// @downloadURL https://update.greasyfork.org/scripts/482061/%E6%B9%9B%E6%B1%9F%E7%A7%91%E6%8A%80%E5%AD%A6%E9%99%A2%E6%96%B0%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%BF%AB%E9%80%9F%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC%28%E6%99%BA%E8%83%BD%E5%88%B6%E9%80%A0%E5%AD%A6%E9%99%A2%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/482061/%E6%B9%9B%E6%B1%9F%E7%A7%91%E6%8A%80%E5%AD%A6%E9%99%A2%E6%96%B0%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%BF%AB%E9%80%9F%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC%28%E6%99%BA%E8%83%BD%E5%88%B6%E9%80%A0%E5%AD%A6%E9%99%A2%E7%89%88%29.meta.js
// ==/UserScript==



function debug(){
    var test=document.getElementById("dialog-frame").contentWindow.document
    var elements=test.querySelectorAll('[id^="wdt_"]');
    var filteredElements = Array.from(elements).filter(element => element.id.endsWith('_1'));
    filteredElements.forEach(button => {
       button.click()
    });
    var text=test.getElementById('area0');
    text.value='教师通过对课本的独到深入的讲解,达到了很好的教学效果,能结合多种教学手段,使学生对知识的掌握更深刻。教学内容重点突出,教学目的十分明确,教师具有极高的专业技能。 授课方式新颖别致,激起同学们的兴趣,教师很注重互动,'
    //如果有需要请自行改动
    var collegeChoice =test.getElementById('cbox1_7')
    collegeChoice.click()
    var confirmButton =test.getElementById('butSave')
    confirmButton.click()
}

(function() {
  'use strict';
  setInterval(debug,5000);
})();