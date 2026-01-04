// ==UserScript==
// @name         综合希悦增强脚本
// @namespace    http://tampermonkey.net/
// @version      2025.1.14.3
// @description  综合恢复预测成绩及排名显示，强制关闭希悦窗口，并优化页面主题及PWA支持。
// @author       MarvinCui
// @match        https://chalk-c3.seiue.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=seiue.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523729/%E7%BB%BC%E5%90%88%E5%B8%8C%E6%82%A6%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/523729/%E7%BB%BC%E5%90%88%E5%B8%8C%E6%82%A6%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*******************************
     * 1. 页面头部优化
     *******************************/
    function optimizeHead() {
        const head = document.head;

        // 修改 theme-color
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', '#2D323D');
        } else {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            themeColorMeta.content = '#2D323D';
            head.appendChild(themeColorMeta);
        }

        // 添加 iOS PWA 支持的 meta 标签
        if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
            const metaApple = document.createElement('meta');
            metaApple.name = 'apple-mobile-web-app-capable';
            metaApple.content = 'yes';
            head.appendChild(metaApple);
        }

        // 添加 PWA 默认名称
        if (!document.querySelector('meta[name="apple-mobile-web-app-title"]')) {
            const metaAppTitle = document.createElement('meta');
            metaAppTitle.name = 'apple-mobile-web-app-title';
            metaAppTitle.content = '希悦校园';
            head.appendChild(metaAppTitle);
        }

        // 替换网站默认图标为指定图标
        const existingFavicon = document.querySelector('link[rel="icon"]');
        if (existingFavicon) {
            existingFavicon.href = 'https://www.seiue.com/assets/images/logo2.png';
        } else {
            const favicon = document.createElement('link');
            favicon.rel = 'icon';
            favicon.href = 'https://www.seiue.com/assets/images/logo2.png';
            head.appendChild(favicon);
        }

        // 添加 iOS Touch Icon
        if (!document.querySelector('link[rel="apple-touch-icon"]')) {
            const linkIcon = document.createElement('link');
            linkIcon.rel = 'apple-touch-icon';
            linkIcon.href = 'https://www.seiue.com/assets/images/logo2.png';
            head.appendChild(linkIcon);
        }
    }

    // 等待 DOM 内容加载完成后优化 head
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', optimizeHead);
    } else {
        optimizeHead();
    }

    /*******************************
     * 2. 恢复预测成绩及排名显示
     *******************************/
    function addXMLRequestCallback(callback){
        let oldSend, i;
        if( XMLHttpRequest.callbacks ) {
            XMLHttpRequest.callbacks.push(callback);
        } else {
            XMLHttpRequest.callbacks = [callback];
            oldSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function(){
                for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                    XMLHttpRequest.callbacks[i]( this );
                }
                oldSend.apply(this, arguments);
            }
        }
    }

    addXMLRequestCallback(function(xhr) {
        xhr.addEventListener("load", function(){
            if (xhr.readyState === 4 && xhr.status === 200 && xhr.responseURL.startsWith('https://api.seiue.com/vnas/klass/personal/class')) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    const grade = response.grade;
                    const gainedRank = grade.gained_rank;
                    const gainedBase = grade.gained_rank_base;
                    const rate = grade.gained_score_rate;
                    console.log('预测成绩及排名:', gainedRank, gainedBase, rate);
                    updateGradeDOM(gainedRank, gainedBase, rate);
                } catch (error) {
                    console.error('解析API响应时出错:', error);
                }
            }
        });
    });

    function updateGradeDOM(gainedRank, gainedBase, rate) {
        const parentSelector = '.sc-dsDzme.RHwBt';
        const parent = document.querySelector(parentSelector);
        if (!parent) {
            // 如果父元素尚未加载，等待1秒后重试
            setTimeout(() => {
                updateGradeDOM(gainedRank, gainedBase, rate);
            }, 1000);
            return;
        }

        // 检查是否已经添加过信息，避免重复
        if (parent.querySelector('.custom-grade-info')) {
            return;
        }

        // 创建排名信息盒子
        const blueBox = document.createElement('div');
        blueBox.className = 'sc-jYRipH hOfCdi sc-etChWs iXDMdq custom-grade-info';

        const rank = document.createElement('div');
        rank.className = 'sc-hYAvag iSuscE sc-hA-dQtl lhYmbR';
        rank.textContent = `${gainedRank} / ${gainedBase}`;

        const rankText = document.createElement('div');
        rankText.className = 'sc-hYAvag iSuscE sc-hA-dQtl lhYmbR';
        rankText.textContent = '排名';

        blueBox.appendChild(rank);
        blueBox.appendChild(rankText);

        // 创建预测得分信息盒子
        const blueBox2 = document.createElement('div');
        blueBox2.className = 'sc-jYRipH hOfCdi sc-etChWs iXDMdq custom-grade-info';

        const rateBox = document.createElement('div');
        rateBox.className = 'sc-hYAvag iSuscE sc-hA-dQtl lhYmbR';
        rateBox.textContent = `${(rate * 100).toFixed(2)}%`;

        const rateText = document.createElement('div');
        rateText.className = 'sc-hYAvag iSuscE sc-hA-dQtl lhYmbR';
        rateText.textContent = '预测得分';

        blueBox2.appendChild(rateBox);
        blueBox2.appendChild(rateText);

        // 将信息盒子添加到父元素
        parent.appendChild(blueBox);
        parent.appendChild(blueBox2);
    }

    /*******************************
     * 3. 强制关闭希悦窗口
     *******************************/
    (function closeSeiueModals() {
        'use strict';

        // 深度优先搜索判断是否包含特定属性
        function dfs(element) {
            const hasCloseModal = element.getAttribute("data-test-id") === "close-modal" ||
                                  element.getAttribute("id") === "image-editor";
            let flag = hasCloseModal;
            const children = element.childNodes;
            for(let i = 0; i < children.length; i++) {
                if(children[i].nodeType === 1) { // ELEMENT_NODE
                    flag = flag || dfs(children[i]);
                }
            }
            return flag;
        }

        // 移除不符合条件的模态窗口
        function removeUnwantedModals(){
            const modals = document.getElementsByClassName('ant-modal-root');
            const len = modals.length;
            for(let i = len - 1; i >= 0; i--){
                const modal = modals[i];
                if(!dfs(modal)){
                    modal.parentNode.removeChild(modal);
                    console.log('已关闭模态窗口:', modal);
                }
            }
        }

        // 监听按键事件
        document.addEventListener('keydown', function(e){
            if(e.key === 'Escape' || e.keyCode === 27){
                removeUnwantedModals();
            }
        });
    })();

})();