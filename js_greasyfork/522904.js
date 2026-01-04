// ==UserScript==
// @name         kmAd
// @namespace    https://github.com/emokui
// @version      1.30
// @description  R18快猫短视频去广告+自动登录 仅适配移动端网页（新增cdn站点加速观看，在match查看网址）
// @author       𝙁𝙖𝙩𝙖𝙡𝙚𝙫𝙚𝙡
// @match        https://4b55n57.xyz/km/*
// @match        https://kmsvip.pages.dev/km/*
// @match        https://kmvip.pages.dev/km/*
// @match        http://23.225.181.59/km/*
// @match        https://24y2if5.xyz/km/*
// @match        https://i4433b6.xyz/km/*
// @match        https://4uchxzz.xyz/km/*
// @match        https://kmsvip.xyz/km/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/522904/kmAd.user.js
// @updateURL https://update.greasyfork.org/scripts/522904/kmAd.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 可编辑的账号和密码
    const ACCOUNT = '你的账号'
    const PASSWORD = '你的密码'

    // 广告图片的域名前缀
    const adDomains = [
        'https://ad.xmmnsd.com/uploads/images/',
        'https://69vvnstttaaa888.dzlndygh.com/i/',
        'https://hongniu.getehu.com/i/',
        'https://ad.xmmnsl.com/uploads/images/'
    ];

    // 自动填充账号和密码
    const fillCredentials = () => {
        const inputAccount = document.querySelector('div.login-account input[type="text"][placeholder="请输入账号（邮箱）"]');
        const inputPassword = document.querySelector('div.login-account input[type="password"][placeholder="请输入密码"]');
        const loginButton = document.querySelector('div.buttonbox');

        if (inputAccount && inputPassword && loginButton) {
            inputAccount.value = ACCOUNT;
            const eventAccount = new Event('input', { bubbles: true, cancelable: true });
            inputAccount.dispatchEvent(eventAccount);

            inputPassword.value = PASSWORD;
            const eventPassword = new Event('input', { bubbles: true, cancelable: true });
            inputPassword.dispatchEvent(eventPassword);

            const blurEventAccount = new Event('blur', { bubbles: true, cancelable: true });
            inputAccount.dispatchEvent(blurEventAccount);

            const blurEventPassword = new Event('blur', { bubbles: true, cancelable: true });
            inputPassword.dispatchEvent(blurEventPassword);

            loginButton.click();
        }
    };

    // 移除广告图片、链接和特定元素
    const removeElements = () => {
        try {
            const imgs = document.querySelectorAll('img');
            const links = document.querySelectorAll('a[href=""][target="_blank"]');
            const overlays = document.querySelectorAll('div.van-overlay');
            const popups = document.querySelectorAll('div.van-popup');
            const tabs = document.querySelectorAll('div.my-tab');

            imgs.forEach(img => {
                if (adDomains.some(domain => img.src.startsWith(domain))) {
                    img.remove();
                }
            });

            links.forEach(link => {
                const img = link.querySelector('img');
                if (img && adDomains.some(domain => img.src.startsWith(domain))) {
                    link.remove();
                }
            });

            overlays.forEach(element => {
                const zIndex = parseInt(element.style.zIndex || element.style['z-index']);
                if (zIndex >= 2000 && zIndex <= 2150) {
                    element.remove();
                }
            });

            popups.forEach(element => {
                const zIndex = parseInt(element.style.zIndex || element.style['z-index']);
                if (zIndex >= 2000 && zIndex <= 2150 && element.querySelector('p')?.innerText.includes('系统公告')) {
                    element.remove();
                }
            });

            tabs.forEach(element => {
                const tabText = element.querySelector('.tab span')?.innerText?.trim();
                const image = element.querySelector('img.gobox');
                if ((tabText === '优秀推荐应用' || tabText === '线路切换' || tabText === '意见反馈') && image) {
                    element.remove();
                }

                if (tabText === '消息通知') {
                    element.querySelectorAll('img').forEach(img => img.remove());
                    element.remove();
                }
            });

            const imgElement = document.querySelector('img[src="static/img/55.3423f9c1.jpg"]');
            if (imgElement) {
                imgElement.src = 'https://suguru.pages.dev/raw/icon/Mine/Musashi.png';
            }

            // 移除其他广告元素
            const selectors = [
                'ul.g-list', '.van-notice-bar', '.swiper', '.vip_ad',
                'div[style="width: 100%; height: 10px; background: rgb(241, 241, 241); margin-top: 0.4rem;"]',
                'div.collect', 'div.timeout', 'div.bootup', '.download',
                'ul.foot-box', '.share-box', '.gbox'
            ];

            selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(element => {
                    element.remove();
                });
            });
        } catch (error) {
            console.error('移除广告过程中发生错误:', error);
        }
    };

    // 使用 MutationObserver 动态监控 DOM 变化
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                // 每当页面发生变化时，检查并自动填充账号和密码
                fillCredentials();
                removeElements(); // 每次变化时，清除广告
            }
        });
    });

    // 观察文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
    });

    console.log('广告和提示信息屏蔽脚本已加载，并启用了动态监听');

})();