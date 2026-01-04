// ==UserScript==
// @name         Telegram App Creator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动化创建 Telegram 应用程序
// @author       HgTRojan
// @match        https://my.telegram.org/apps
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500444/Telegram%20App%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/500444/Telegram%20App%20Creator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置变量
    const appTitle = 'Your App Title';
    const appShortname = 'YourShortName';
    const appUrl = 'https://yourapp.example.com';
    const appDescription = 'Your app description';
    const repetitions = 3000; // 重复次数

    // 等待函数
    const waitForSelector = (selector, timeout = 5000) => {
        return new Promise((resolve, reject) => {
            const interval = 100;
            let elapsed = 0;
            const checkExist = setInterval(() => {
                if (document.querySelector(selector)) {
                    clearInterval(checkExist);
                    resolve();
                }
                elapsed += interval;
                if (elapsed >= timeout) {
                    clearInterval(checkExist);
                    reject(`Timeout waiting for selector: ${selector}`);
                }
            }, interval);
        });
    };

    // 表单填写和提交函数
    const createApp = async () => {
        try {
            await waitForSelector('#app_title');
            document.querySelector('#app_title').click();
            document.querySelector('#app_title').value = appTitle;

            await waitForSelector('#app_shortname');
            document.querySelector('#app_shortname').click();
            document.querySelector('#app_shortname').value = appShortname;

            await waitForSelector('#app_url');
            document.querySelector('#app_url').click();
            document.querySelector('#app_url').value = appUrl;

            await waitForSelector('div:nth-of-type(4) div:nth-of-type(6)');
            document.querySelector('div:nth-of-type(4) div:nth-of-type(6)').click();

            await waitForSelector('div:nth-of-type(6) > label');
            document.querySelector('div:nth-of-type(6) > label').click();

            await waitForSelector('#app_desc');
            document.querySelector('#app_desc').click();
            document.querySelector('#app_desc').value = appDescription;

            await waitForSelector('#app_save_btn');
            document.querySelector('#app_save_btn').click();

            console.log('Application created successfully.');
        } catch (error) {
            console.error('Error creating application:', error);
        }
    };

    // 主函数
    const main = async () => {
        for (let i = 0; i < repetitions; i++) {
            console.log(`Creating application ${i + 1}...`);
            await createApp();
        }
    };

    // 执行主函数
    main();
})();
