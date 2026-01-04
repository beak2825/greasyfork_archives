// ==UserScript==
// @name         bilibili首页拉黑
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  在哔哩哔哩首页视频卡片上添加拉黑功能，拉黑后清空卡片内容。
// @author       yingming006
// @match        https://www.bilibili.com/
// @include      https://www.bilibili.com/?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527851/bilibili%E9%A6%96%E9%A1%B5%E6%8B%89%E9%BB%91.user.js
// @updateURL https://update.greasyfork.org/scripts/527851/bilibili%E9%A6%96%E9%A1%B5%E6%8B%89%E9%BB%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 视频卡片的选择器
    const VIDEO_CARD_SELECTOR = '.bili-video-card__wrap, .video-card';
    const INFO_BOTTOM_SELECTOR = '.bili-video-card__info--bottom, .video-card__info--bottom';

    class HomeBlacklist {
        constructor() {
            this.init();
        }

        init() {
            this.addBlackButtons();

            // 延迟重试，确保动态加载的内容也能添加按钮
            setTimeout(() => {
                if (!document.querySelector('.addBlacklistBtn')) {
                    this.addBlackButtons();
                }
            }, 2000);
        }

        // 获取cookie中的指定值
        getCookieValue(cookieName) {
            let name = cookieName + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let cookieArray = decodedCookie.split(';');
            for (let i = 0; i < cookieArray.length; i++) {
                let cookie = cookieArray[i].trim();
                if (cookie.indexOf(name) === 0) {
                    return cookie.substring(name.length, cookie.length);
                }
            }
            return "";
        }

        // B站黑名单API调用
        addToBlacklist(fid) {
            if (!fid) return Promise.reject('无用户ID');
            const csrf = this.getCookieValue('bili_jct');
            return fetch("https://api.bilibili.com/x/relation/modify", {
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
                body: `fid=${fid}&act=5&re_src=11&gaia_source=web_main&csrf=${csrf}`,
                method: "POST",
                mode: "cors",
                credentials: "include"
            }).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('拉黑失败');
            });
        }

        // 添加拉黑按钮
        addBlackButtons() {
            const videoCards = document.querySelectorAll(VIDEO_CARD_SELECTOR);

            videoCards.forEach(card => {
                const authorLink = card.querySelector('.bili-video-card__info--owner, .video-card__info--owner');
                if (!authorLink) return;

                // 从href中提取用户ID
                const href = authorLink.getAttribute('href');
                const fid = href?.match(/space\.bilibili\.com\/(\d+)/)?.[1];
                if (!fid) return;

                const infoBottom = card.querySelector(INFO_BOTTOM_SELECTOR);
                if (!infoBottom) return;

                // 检查是否已添加按钮
                if (infoBottom.querySelector('.addBlacklistBtn')) return;

                // 创建拉黑按钮
                const btn = document.createElement('button');
                btn.className = 'addBlacklistBtn';
                btn.textContent = '拉黑';
                btn.style.cssText = `
                    margin-left: 8px;
                    padding: 2px 8px;
                    background: #fff;
                    border: 1px solid #e3e5e7;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    color: #18191c;
                `;

                // 点击事件：拉黑并清空卡片内容
                btn.onclick = () => {
                    this.addToBlacklist(fid).then(() => {
                        // 清空卡片内容，保留占位
                        card.innerHTML = '';
                        card.style.background = '#f5f5f5'; // 可选：添加背景色提示已清空
                        card.style.height = 'auto'; // 保持高度自适应原有空间
                    }).catch(err => {
                        alert('拉黑失败，请检查网络或登录状态');
                    });
                };

                // 插入按钮
                infoBottom.appendChild(btn);
            });
        }
    }

    // 实例化并监听页面变化
    const blacklist = new HomeBlacklist();

    // 监听动态加载的卡片
    const observer = new MutationObserver(() => {
        blacklist.addBlackButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();