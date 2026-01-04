// ==UserScript==
// @name                知乎单个回答详情页移除多余元素
// @version             1.5
// @description         知乎单个回答详情页移除多余元素，用来截图或分享图
// @author              general
// @match               *://www.zhihu.com/*
// @match               *://zhuanlan.zhihu.com/*
// @require https://update.greasyfork.org/scripts/476797/1695027/tank%20util%20%E9%80%9A%E7%94%A8js%E5%B7%A5%E5%85%B7%E8%84%9A%E6%9C%AC.js
// @license             MIT
// @license             GPL-3.0 License
// @run-at              document-start
// @namespace http://tampermonkey.net
// @downloadURL https://update.greasyfork.org/scripts/511673/%E7%9F%A5%E4%B9%8E%E5%8D%95%E4%B8%AA%E5%9B%9E%E7%AD%94%E8%AF%A6%E6%83%85%E9%A1%B5%E7%A7%BB%E9%99%A4%E5%A4%9A%E4%BD%99%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/511673/%E7%9F%A5%E4%B9%8E%E5%8D%95%E4%B8%AA%E5%9B%9E%E7%AD%94%E8%AF%A6%E6%83%85%E9%A1%B5%E7%A7%BB%E9%99%A4%E5%A4%9A%E4%BD%99%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

/**
 * http://file.ikite.top/cdn/javascripts/tankUtils.js?t=20251114
 */

(function () {
    class ZhihuAnswerDetailPage {
        start() {
            const tankUtils = window.tankUtils;
            if (!tankUtils) {
                console.log("tankUtils 不存在，无法执行知乎单个回答详情页移除多余元素");
                return;
            }
            console.log("知乎单个回答详情页移除多余元素 开始");
            // 先添加按钮，根据按钮操作，是否要移除 dom
            if (tankUtils.isPC) {
                this.addPCOperationButton();
            } else {
                this.removeMobilePageDom();
            }
        }

        /**
         * 创建操作按钮
         */
        createRemoveDomButton() {
            const removeDomButton = document.createElement('button');
            removeDomButton.innerText = '移除其他元素';
            removeDomButton.classList.add('new-remove-button');
            window.tankUtils.commonSetDomStyle(removeDomButton, {
                padding: '4px 8px',
                'border-radius': '4px',
                background: '#ff7000',
                color: '#fff',
                'font-size': '16px',
            });
            return removeDomButton;
        }

        /**
         * PC 上，添加操作按钮
         */
        addPCOperationButton() {
            const newRemoveButton = document.querySelector('.new-remove-button');
            if (newRemoveButton) {
                return;
            }
            const removeDomButton = this.createRemoveDomButton();
            const questionHeaderTopics = window.tankUtils.findDom('.QuestionHeader-topics');
            if (questionHeaderTopics) {
                questionHeaderTopics.appendChild(removeDomButton);
            }
            removeDomButton.onclick = () => {
                this.removePCPageDom();
            };
        }

        /**
         * 移除 PC 页面上的 DOM
         */
        removePCPageDom() {
            {
                // 移除右边的侧边栏
                window.tankUtils.removeDom('.Question-sideColumn');

                // 移除右边的广告
                window.tankUtils.removeDom('.Question-sideColumnAdContainer');

                // 移除右边的关注者、被浏览
                window.tankUtils.removeDom('.QuestionFollowStatus');

                // 移除右边的作者 AnswerAuthor
                window.tankUtils.removeDom('.AnswerAuthor');

                // 移除页面底部的网站声明信息
                window.tankUtils.removeDom('[role="contentinfo"]');

                // 移除更多回答
                window.tankUtils.removeDom('.MoreAnswers');

                // 移除查看全部回答
                window.tankUtils.removeDom('.ViewAll');

                // 移除补充信息
                window.tankUtils.removeDom('[role="complementary"]');
            }
        }

        /**
         * 移除移动端页面上的 DOM
         */
        removeMobilePageDom() {
            {
                // 移除页面顶部的【打开App】
                const headerOpenBtn = window.tankUtils.findDom('.Button--withLabel');
                if (headerOpenBtn) {
                    const parentElementL1 = headerOpenBtn.parentElement;
                    parentElementL1.removeChild(headerOpenBtn);
                }
            }

            {
                // 移除作者信息
                window.tankUtils.removeDom('[itemprop="author"]');

                // 移除 App 内打开
                window.tankUtils.removeDom('.OpenInAppButton');

                // 移除右下角的 Avatar
                window.tankUtils.removeDom('.Avatar');
            }

            {
                // 移除 AI 总结
                const richContentDom = window.tankUtils.findDom('.RichContent');
                if (richContentDom && richContentDom.nextElementSibling) {
                    richContentDom.nextElementSibling.remove();
                }
            }

            {
                // oia-action-bar
                const oiaActionBar = window.tankUtils.findDom('.oia-action-bar');
                if (oiaActionBar) {
                    const agreeButton = window.tankUtils.findDom('.ZDI--AgreeFill24');
                    if (agreeButton) {
                        const agreeNumSpan = agreeButton.nextElementSibling;
                        if (agreeNumSpan) {
                            const innerText = (agreeNumSpan.innerText || '').replace('已赞同 ', '').trim();
                            if (innerText) {
                                const agreeNum = parseInt(innerText || 0);
                                agreeNumSpan.innerText = `${agreeNum}`;
                            }
                        }
                    }
                }
            }
        }
    }

    window.onload = function () {
        const zhihuAnswerDetailPage = new ZhihuAnswerDetailPage();
        setInterval(() => {
            zhihuAnswerDetailPage.start();
            console.log('知乎单个回答详情页移除多余元素 start()');
        }, 3000);
    };

})();

