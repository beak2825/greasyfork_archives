// ==UserScript==
// @name         Boss直聘去版权信息
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除Boss直聘复制时的版权信息
// @author       You
// @match        https://www.zhipin.com/web/geek/job-recommend*
// @match        https://www.zhipin.com/job_detail/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/520869/Boss%E7%9B%B4%E8%81%98%E5%8E%BB%E7%89%88%E6%9D%83%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/520869/Boss%E7%9B%B4%E8%81%98%E5%8E%BB%E7%89%88%E6%9D%83%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 查找 JobCardDetail 组件对应的 Vue 实例
        let jobCardDetailVueInstance = findVueInstance(document.querySelector('.job-detail-container'));

        if (jobCardDetailVueInstance) {
            // 禁用 mixStatementAction 方法
            jobCardDetailVueInstance.mixStatementAction = function() {
                console.log('Boss直聘版权信息注入已被禁用');
            };
            console.log('Boss直聘版权信息注入禁用脚本已生效');
        } else {
            console.warn('未找到 JobCardDetail 组件的 Vue 实例');
        }
    });

    // 查找 Vue 实例的函数
    function findVueInstance(element) {
        if (!element) return null;

        for (const key in element) {
            if (key.startsWith('__vue__')) {
                return element[key];
            }
        }

        return null;
    }
})();