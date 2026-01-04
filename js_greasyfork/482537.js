// ==UserScript==
// @name        南航金城学院教学评估自动填充
// @namespace   Violentmonkey Scripts
// @description  只需要点击课程名，然后自动填充分数并保存
// @match       http://wp.jc.nuaa.edu.cn/*
// @grant       none
// @license     Qishao
// @version     1.0
// @author      七少Sama
// @description 2023/12/18 16:15:58
// @downloadURL https://update.greasyfork.org/scripts/482537/%E5%8D%97%E8%88%AA%E9%87%91%E5%9F%8E%E5%AD%A6%E9%99%A2%E6%95%99%E5%AD%A6%E8%AF%84%E4%BC%B0%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/482537/%E5%8D%97%E8%88%AA%E9%87%91%E5%9F%8E%E5%AD%A6%E9%99%A2%E6%95%99%E5%AD%A6%E8%AF%84%E4%BC%B0%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // 在页面加载后执行的函数
    window.addEventListener('load', function() {
    // 获取name为0的radio input元素并修改
    for (var i = 0; i <= 5; i++) {
    var radioInput = document.querySelector('input[type="radio"][name="' + i + '"][value="95.00"]');
    if (radioInput) {
        radioInput.setAttribute('checked', 'checked');
    }
}
    //点击保存按钮
      var saveButton = document.querySelector('input[type="image"][src="../../images/btn/btn_save.jpg"]');
        if (saveButton) {
            saveButton.click();
        }
    });
})();