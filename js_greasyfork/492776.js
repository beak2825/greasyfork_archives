// ==UserScript==
// @name         ScholarRead 布局优化
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  优化布局
// @author       pvz122
// @match        https://www.scholaread.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scholaread.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492776/ScholarRead%20%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/492776/ScholarRead%20%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var isOptimized = false;

    function optimize() {
        if (isOptimized) return;
        isOptimized = true;
        try {
            // 选择id为pages-container的元素，设置max-width为90%
            let contain = document.querySelector('#pages-container');
            contain.style.maxWidth = 'calc(100% - (12px + 30px) * 2)';
            contain.style.borderRadius = '8px';
            contain.style.transition = 'all 0.3s';
            // 选择class为el-space__item的每个元素，设置flex为initial
            document.querySelectorAll('.el-space__item').forEach(item => {
                item.style.flex = 'initial';
            });
            // 选择class为el-dropdown的元素，删除
            document.querySelector('.el-dropdown').remove();
            // 选择class为sr-header--purchase-dropdown的元素，删除
            document.querySelector('.sr-header--purchase-dropdown').remove();
            // 选择class为sr-header-wrapper的元素
            let header = document.querySelector('.sr-header-wrapper');
            header.style.height = 0;
            header.style.transition = 'opacity 0.2s';
            // 选择class为el-overlay的元素
            let menu = document.querySelector('.el-overlay');
            menu.style.transition = 'top 0.3s';
            // 选择class为brand-logo--app-icon的元素，复制，然后删除
            let logo = document.querySelector('.brand-logo--app-icon').cloneNode(true);
            document.querySelector('.brand-logo--app-icon').remove();
            // 将logo放在页面左下角，点击切换显示header
            logo.style.position = 'fixed';
            logo.style.bottom = '6px';
            logo.style.left = '6px';
            logo.style.zIndex = 9999;
            logo.style.width = '30px';
            logo.style.height = '30px';
            logo.style.cursor = 'pointer';
            // logo的子元素svg的borderRadius设为20%
            logo.querySelector('svg').style.borderRadius = '20%';
            logo.onclick = () => {
                if (header.style.display === 'none') {
                    header.style.display = 'block';
                    setTimeout(() => {
                        header.style.opacity = 1;
                    }, 10);
                    menu.style.height = 'calc(100% - 48px)';
                    menu.style.top = '48px';
                } else {
                    header.style.opacity = 0;
                    setTimeout(() => {
                        header.style.display = 'none';
                    }, 300);
                    menu.style.height = '100%';
                    menu.style.top = '0';
                }
            };
            // logo的id设为header-toggle
            logo.id = 'header-toggle';
            document.body.appendChild(logo);
            // 默认隐藏header
            header.style.display = 'none';
        } catch (error) {
            isOptimized = false;
        }
    }

    function de_optimize() {
        if (!isOptimized) return;
        isOptimized = false;
        try {
            // 删除header-toggle
            document.querySelector('#header-toggle').remove();
        } catch (error) {
            isOptimized = true;
        }
    }

    // 每1s检测是否优化并执行优化
    setInterval(() => {
        if (!location.href.startsWith('https://www.scholaread.cn/read/')) {
            de_optimize();
            return;
        } else if (!isOptimized) {
            optimize();
        }
    }, 1000);
})();