// ==UserScript==
// @name         KmAd-Mini
// @namespace    https://github.com/emokui
// @version      2.0
// @description  R18快猫短视频去广告+自动登录
// @author       𝙁𝙖𝙩𝙖𝙡𝙚𝙫𝙚𝙡
// @match        https://4b55n57.xyz/km/*
// @match        https://kmsvip.pages.dev/km/*
// @match        https://kmvip.pages.dev/km/*
// @match        http://23.225.181.59/km/*
// @match        https://24y2if5.xyz/km/*
// @match        https://i4433b6.xyz/km/*
// @match        https://4uchxzz.xyz/km/*
// @match        https://kmsvip.xyz/km/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529471/KmAd-Mini.user.js
// @updateURL https://update.greasyfork.org/scripts/529471/KmAd-Mini.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const ACCOUNT = '你的账号';
    const PASSWORD = '你的密码';

    const fillCredentials = () => {
        const inputAccount = document.querySelector('div.login-account input[type="text"][placeholder="请输入账号（邮箱）"]');
        const inputPassword = document.querySelector('div.login-account input[type="password"][placeholder="请输入密码"]');
        const loginButton = document.querySelector('div.buttonbox');

        if (inputAccount && inputPassword && loginButton) {
            [inputAccount, inputPassword].forEach((input, index) => {
                input.value = index === 0 ? ACCOUNT : PASSWORD;
                ['input', 'change', 'blur'].forEach(eventType => {
                    input.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
                });
            });
            loginButton.click();
        }
    };

    const removeElements = () => {
        try {
            const adImages = document.querySelectorAll('ul.g-list img');
            adImages.forEach(img => {
                img.remove();
            });

            const adList = document.querySelector('ul.g-list');
            if (adList) {
                adList.remove();
            }

            document.querySelectorAll('.van-notice-bar, .swiper, .vip_ad, .bootup, .download').forEach(el => el.remove());

            const overlay = document.querySelector('.van-overlay');
            if (overlay) {
                overlay.style.display = 'none';
            }

            const bottomImage = document.querySelector('img[src="static/img/collectdesktop.ff055cee.png"]');
            if (bottomImage) {
                bottomImage.style.display = 'none';  // 隐藏底部弹窗图片
            }

            // 隐藏弹窗
            const popup = document.querySelector('.van-popup.van-popup--center');
            if (popup) {
                popup.style.display = 'none';  // 隐藏整个公告弹窗
            }
        } catch (error) {}
    };

    const observer = new MutationObserver(() => {
        fillCredentials();
        removeElements();
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
})();