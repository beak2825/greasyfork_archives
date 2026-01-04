// ==UserScript==
// @name         南宁市西乡塘中小学幼教继续教育公需课自动弹窗识别并点击下一活动
// @version      1.0
// @description  识别弹窗并点击下一活动
// @match        http://xxtpx.southteacher.com/
// @grant        none
// @namespace https://greasyfork.org/users/780671
// @downloadURL https://update.greasyfork.org/scripts/472621/%E5%8D%97%E5%AE%81%E5%B8%82%E8%A5%BF%E4%B9%A1%E5%A1%98%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%B9%BC%E6%95%99%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%BC%B9%E7%AA%97%E8%AF%86%E5%88%AB%E5%B9%B6%E7%82%B9%E5%87%BB%E4%B8%8B%E4%B8%80%E6%B4%BB%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/472621/%E5%8D%97%E5%AE%81%E5%B8%82%E8%A5%BF%E4%B9%A1%E5%A1%98%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%B9%BC%E6%95%99%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%BC%B9%E7%AA%97%E8%AF%86%E5%88%AB%E5%B9%B6%E7%82%B9%E5%87%BB%E4%B8%8B%E4%B8%80%E6%B4%BB%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
    // 检测是否存在弹窗
    var popup = document.querySelector('.popup');
    if (popup) {
        // 查找下一个元素并点击
        var nextElement = popup.nextElementSibling;
        if (nextElement) {
            nextElement.click();
        }
    }
})();