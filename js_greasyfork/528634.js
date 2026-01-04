// ==UserScript==
// @name         天大验证码识别
// @namespace    http://tampermonkey.net/
// @version      2025-03-05
// @description  天津大学教育系统统一身份认证验证码识别脚本
// @author       口x口(Github:kly777)
// @license      MIT
// @match        https://sso.tju.edu.cn/cas/login*
// @icon         http://classes.tju.edu.cn/eams/avatar/my.action
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js
// @downloadURL https://update.greasyfork.org/scripts/528634/%E5%A4%A9%E5%A4%A7%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AF%86%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/528634/%E5%A4%A9%E5%A4%A7%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AF%86%E5%88%AB.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    await new Promise((resolve) => {
        if (window.Tesseract) resolve();
        else window.addEventListener('TesseractLoaded', resolve);
    });

    const { createWorker } = Tesseract;
    const worker = await createWorker();

    try {
        const imageUrl = 'https://sso.tju.edu.cn/cas/code';
        const { data: { text } } = await worker.recognize(imageUrl);
        //  console.log('识别结果:', text);

        const input = document.getElementById('code');
        if (input) input.value = text.trim();

        const login = document.getElementById('index_login_btn');
        login.click();
    } catch (error) {
        //console.error('识别失败:', error);
    } finally {
        await worker.terminate();
    }
})();