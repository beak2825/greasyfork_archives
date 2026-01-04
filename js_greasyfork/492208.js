// ==UserScript==
// @name         SJTU场馆后台管理核销自动刷新
// @namespace    http://tampermonkey.net/
// @version      v2.1
// @description  场馆预约核销自动刷新并自动打开个人订单，然后在iframe中点击场地核销
// @author       eternal-echo
// @match        https://sports.sjtu.edu.cn/index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sjtu.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492208/SJTU%E5%9C%BA%E9%A6%86%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E6%A0%B8%E9%94%80%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/492208/SJTU%E5%9C%BA%E9%A6%86%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E6%A0%B8%E9%94%80%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('核销自动刷新脚本已加载');

    // 尝试点击“个人订单”链接
    const tryClickPersonalOrder = () => {
        const personalOrderLink = document.querySelector('a.menuItem[href="/venue/personal"]');
        if (personalOrderLink && personalOrderLink.offsetParent !== null) {
            console.log('“个人订单”链接可见，正在尝试点击');
            personalOrderLink.click();
            // 延迟监控iframe加载，确保页面及JavaScript逻辑加载完成
            setTimeout(monitorIframeForVerificationButton, 1000); // 增加延迟，等待iframe加载
            return true;
        } else {
            console.log('未找到“个人订单”链接或链接不可见');
            return false;
        }
    };

    // 监控iframe加载，等待“场地核销”按钮加载完成后点击
    const monitorIframeForVerificationButton = () => {
        const iframe = document.querySelector('.RuoYi_iframe[name="iframe2"]');
        if (!iframe) {
            console.log('未找到指定的iframe，无法设置监控。');
            return;
        }
        console.log('找到指定的iframe');

        // 延时1s后尝试点击“场地核销”按钮
        setTimeout(() => {
            try {
                iframe.contentDocument.querySelector('#toolbar > a.btn.btn-info.btn-xs').click()
            } catch (e) {
                console.error('访问iframe内容失败:', e);
            }
        }, 1000);
    };

    // 页面完全加载后执行操作
    window.addEventListener('load', function() {
        console.log('页面已完全加载');
        if (!tryClickPersonalOrder()) {
            // 如果“个人订单”链接不可见，尝试展开父级菜单
            const parentMenus = document.querySelectorAll('.fa.arrow');
            parentMenus.forEach(menu => menu.click());
            setTimeout(tryClickPersonalOrder, 500); // 延迟尝试点击“个人订单”链接
        }
    });

    // 设置定时器，29分钟刷新页面
    setInterval(function() {
        console.log('正在刷新页面...');
        window.location.reload();
    }, 29 * 60 * 1000);
})();
