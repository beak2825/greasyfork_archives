// ==UserScript==
// @name         丝域论坛自动签到评论（带悬浮按钮）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  添加签到按钮，在新标签页中打开帖子并自动评论，自动领取奖励
// @author       AlphaCat
// @match        https://www.siyuvip.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @license      PRIVATE
// @downloadURL https://update.greasyfork.org/scripts/514728/%E4%B8%9D%E5%9F%9F%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%AF%84%E8%AE%BA%EF%BC%88%E5%B8%A6%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/514728/%E4%B8%9D%E5%9F%9F%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%AF%84%E8%AE%BA%EF%BC%88%E5%B8%A6%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE%EF%BC%89.meta.js
// ==/UserScript==

/*
 * 版权所有 (c) 2024 AlphaCat. 保留所有权利。
 *
 * 许可声明：
 * 1. 本脚本仅供个人使用，未经作者明确书面许可，不得用于任何商业目的。
 * 2. 禁止对本脚本进行修改、反编译、复制、分发或传播。
 * 3. 禁止将本脚本用于任何非法目的或违反网站服务条款的行为。
 * 4. 使用本脚本所产生的任何后果由使用者自行承担。
 * 5. 作者保留随时修改或终止本脚本的权利。
 *
 * 违反上述条款将追究法律责任。
 */

(function() {
    'use strict';

    // 按钮样式
    const styles = `
        #autoSignInButton {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 80px;
            height: 36px;
            padding: 0 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            text-align: center;
            line-height: 1;
            margin: 0;
            outline: none;
        }

        #autoSignInButton:hover {
            background-color: #45a049;
            transform: scale(1.05);
        }

        #autoSignInButton:active {
            transform: scale(0.95);
        }

        #autoSignInButton.loading {
            padding-right: 36px;
        }

        #autoSignInButton.loading::after {
            content: '';
            position: absolute;
            right: 8px;
            width: 16px;
            height: 16px;
            border: 2px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: button-loading-spinner 1s linear infinite;
        }

        @keyframes button-loading-spinner {
            from {
                transform: rotate(0turn);
            }
            to {
                transform: rotate(1turn);
            }
        }
    `;
    // 注入样式
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // 等待元素出现的函数
    function waitForElement(selector, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            function checkElement() {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime >= timeout) {
                    reject(new Error(`等待元素 ${selector} 超时`));
                } else {
                    setTimeout(checkElement, 500);
                }
            }
            checkElement();
        });
    }

    // 等待页面加载完成的函数
    function waitForPageLoad() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }

    // 创建悬浮按钮
    function createFloatingButton() {
        const button = document.createElement('button');
        button.id = 'autoSignInButton';
        button.textContent = '签到';
        document.body.appendChild(button);

        // 从存储中获取上次的位置
        const savedLeft = GM_getValue('buttonLeft');
        const savedTop = GM_getValue('buttonTop');
        if (savedLeft && savedTop) {
            button.style.left = savedLeft;
            button.style.right = 'auto';
            button.style.top = savedTop;
            button.style.bottom = 'auto';
        }

        // 初始化拖拽功能
        $(button).draggable({
            start: function() {
                $(this).css('transition', 'none');
            },
            stop: function(event, ui) {
                $(this).css('transition', 'all 0.3s ease');
                GM_setValue('buttonLeft', ui.position.left + 'px');
                GM_setValue('buttonTop', ui.position.top + 'px');
            },
            containment: 'window'
        });

        // 添加点击事件
        button.addEventListener('click', startSignInProcess);
    }

    // 从菜单获取签到链接
    function getSignInURLFromMenu() {
        const menuLink = document.querySelector('#menu #mn_public_1[href*="public.php?action=sign_in"]');
        if (menuLink) {
            // 获取基础URL
            const baseURL = window.location.origin;
            // 拼接完整的签到链接
            return baseURL + '/' + menuLink.getAttribute('href');
        }
        return null;
    }

    // 格式化日期函数：返回 yyyy-mm-dd 格式
    function getFormattedDate() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    // 格式化时间函数：返回 yyyy年mm月dd日HH:MM:SS 格式
    function getFormattedDateTime() {
        const now = new Date();
        return `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日`
             + `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    }

    // 查找目标帖子链接
    function findTargetPostURL() {
        const targetTitle = `[${getFormattedDate()}] 今日抢楼签到赚钱帖`;
        const links = document.querySelectorAll('a');
        for (let link of links) {
            if (link.textContent.trim() === targetTitle) {
                return link.href;
            }
        }
        return null;
    }

    // 在帖子页面中提交评论并领取奖励
    async function submitCommentAndClaimReward() {
        try {
            console.log('等待页面加载...');
            await waitForPageLoad();

            console.log('等待评论框出现...');
            const commentBox = await waitForElement('textarea[name="message"]');

            console.log('等待提交按钮出现...');
            const submitButton = await waitForElement('button[type="submit"]');

            // 滚动到评论框
            commentBox.scrollIntoView({ behavior: 'smooth' });

            // 等待滚动完成
            await new Promise(resolve => setTimeout(resolve, 500));

            // 设置评论内容
            const commentText = `[${getFormattedDateTime()}] 来签到赚金币咯~`;
            commentBox.value = commentText;

            // 触发输入事件
            commentBox.dispatchEvent(new Event('input', { bubbles: true }));
            commentBox.dispatchEvent(new Event('change', { bubbles: true }));

            // 确保评论内容已经设置
            await new Promise(resolve => setTimeout(resolve, 500));

            // 点击提交按钮
            console.log('提交评论...');
            submitButton.click();
            console.log('评论已提交:', commentText);

            // 等待评论提交完成
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 滚动到页面顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // 等待滚动完成
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 查找并点击领取奖励链接
            console.log('查找领取奖励链接...');
            const links = document.querySelectorAll('a');
            let rewardLink = null;
            for (let link of links) {
                if (link.textContent.includes('回复帖子签到后，点这领取')) {
                    rewardLink = link;
                    break;
                }
            }

            if (rewardLink) {
                console.log('找到领取链接，点击领取...');
                rewardLink.click();
                
                // 等待一段时间确保奖励领取成功
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // 关闭当前标签页
                console.log('签到完成，关闭标签页...');
                window.close();
            } else {
                console.error('未找到领取链接');
            }

        } catch (error) {
            console.error('提交评论或领取奖励失败:', error);
        }
    }

    // 更新按钮状态的函数
    function updateButtonStatus(status, text, color = null) {
        const button = document.getElementById('autoSignInButton');
        if (!button) return;

        button.textContent = text;
        if (status === 'loading') {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
        if (color) {
            button.style.backgroundColor = color;
        }
    }

    // 检查是否为目标帖子
    function isTargetPost() {
        const today = getFormattedDate();
        const pageTitle = document.title;
        return pageTitle.includes(today) && pageTitle.includes('今日抢楼签到赚钱帖');
    }

    // 签到流程
    async function startSignInProcess() {
        updateButtonStatus('loading', '准备签到...');

        try {
            // 先从菜单获取签到链接
            const signInURL = getSignInURLFromMenu();

            if (!signInURL) {
                throw new Error('未找到签到入口');
            }

            // 在新标签页中打开签到链接
            const newTab = GM_openInTab(signInURL, {
                active: false,  // 不切换到新标签页
                insert: true,
                setParent: true
            });

            // 监听新标签页加载完成事件
            newTab.onclose = () => {
                console.log('签到标签页已关闭');
                updateButtonStatus('normal', '签到', '#4CAF50');
            };

            // 立即恢复按钮状态，不等待标签页关闭
            updateButtonStatus('normal', '签到', '#4CAF50');

        } catch (error) {
            console.error('签到过程出错:', error);
            updateButtonStatus('error', error.message || '出错了', '#FF4444');
            setTimeout(() => {
                updateButtonStatus('normal', '签到', '#4CAF50');
            }, 2000);
        }
    }

    // 主函数
    async function main() {
        // 在所有页面创建悬浮按钮
        createFloatingButton();

        // 如果当前是帖子页面，检查是否为目标帖子
        if (window.location.href.includes('thread')) {
            // 等待页面标题加载完成
            await waitForPageLoad();
            if (isTargetPost()) {
                console.log('检测到目标帖子，准备提交评论...');
                // 延迟执行评论操作，确保页面完全加载
                setTimeout(submitCommentAndClaimReward, 2000);
            }
        }
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();