// ==UserScript==
// @name         简单修改知识星球样式以适配移动端
// @namespace    https://axutongxue.com/
// @version      0.2
// @description  知识星球网页版移动端适配
// @author       阿虚同学
// @match        https://wx.zsxq.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527427/%E7%AE%80%E5%8D%95%E4%BF%AE%E6%94%B9%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E6%A0%B7%E5%BC%8F%E4%BB%A5%E9%80%82%E9%85%8D%E7%A7%BB%E5%8A%A8%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/527427/%E7%AE%80%E5%8D%95%E4%BF%AE%E6%94%B9%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E6%A0%B7%E5%BC%8F%E4%BB%A5%E9%80%82%E9%85%8D%E7%A7%BB%E5%8A%A8%E7%AB%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const mainContentContainer = document.querySelector('.main-content-container');
    if (mainContentContainer) {
      mainContentContainer.style.setProperty('margin-left', '5%', 'important');
      mainContentContainer.style.setProperty('margin-right', '5%', 'important');
      mainContentContainer.style.setProperty('width', '100%', 'important');
      mainContentContainer.style.setProperty('max-width', '428px', 'important');
    }

    const groupPreviewContainer = document.querySelector('.group-preview-container');
    if (groupPreviewContainer) {
      groupPreviewContainer.style.setProperty('margin-left', '85%', 'important');
    }

    const searchcontainer = document.querySelector('.search-container');
    if (searchcontainer) {
      searchcontainer.style.setProperty('margin-left', '5%', 'important');
      searchcontainer.style.setProperty('margin-right', '5%', 'important');
      searchcontainer.style.setProperty('width', '300px', 'important');
    }


    const targetClasses = ['group-preview-wrapper', 'group-list-container','logo-container','redirect','user-container'];

    const observer = new MutationObserver(() => {
        hideTargetElements();
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // 初始执行+周期性检查（应对懒加载）
    hideTargetElements();
    setInterval(hideTargetElements, 1000);

    function hideTargetElements() {
        targetClasses.forEach(className => {
            document.querySelectorAll(`.${className}`).forEach(element => {
                element.style.display = 'none';
            });
        });
    }
})();