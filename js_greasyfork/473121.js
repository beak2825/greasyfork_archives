// ==UserScript==
// @name         新疆农大社会实践自动填写
// @namespace    https://blog.zhecydn.asia/
// @version      1.1
// @description  新疆农业大学社会实践自动填写
// @author       zhecydn
// @match        https://xgxt.xjau.edu.cn/TW/Sys/SystemForm/main.htm
// @match        https://xgxt.xjau.edu.cn/TW/Sys/SystemForm/SocialPractice/StuPersonalDeclareApply.aspx
// @match        https://xgxt.xjau.edu.cn/TW/Sys/SystemForm/SocialPractice/StuPersonalDeclareApply_Edit.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.xjau.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473121/%E6%96%B0%E7%96%86%E5%86%9C%E5%A4%A7%E7%A4%BE%E4%BC%9A%E5%AE%9E%E8%B7%B5%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/473121/%E6%96%B0%E7%96%86%E5%86%9C%E5%A4%A7%E7%A4%BE%E4%BC%9A%E5%AE%9E%E8%B7%B5%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function() {
 var currentUrl = window.location.href;

    if (currentUrl.indexOf('https://xgxt.xjau.edu.cn/TW/Sys/SystemForm/main.htm') !== -1) {
        setTimeout(function() {
        window.location.href = 'https://xgxt.xjau.edu.cn/TW/Sys/SystemForm/SocialPractice/StuPersonalDeclareApply.aspx';
        }, 1000);
    } else {
        setTimeout(function() {
           document.querySelector("#BtnApply").click();
        }, 1000);
        var textBox1 = document.getElementById('PersonalDeclare_PracticeAddress');
        var textBox2 = document.getElementById('PersonalDeclare_ActivityContent');

        textBox1.value = '你的实践地点';
        textBox2.value = '你的实践内容';
    'use strict';
    var inputFile = document.getElementById('PersonalDeclare_ActivityPhoto_SendFile');
    if (inputFile) {
        inputFile.click();
        inputFile.addEventListener('change', function() {
            var uploadBtn = document.getElementById('PersonalDeclare_ActivityPhoto_BtnSend');
            if (uploadBtn) {
                uploadBtn.click();
            }
        });
    }
        setTimeout(function() {
        document.getElementById("Save").click();
        }, 1000);
    }
})();