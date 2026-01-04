// ==UserScript==
// @name         External Link Auto Redirect
// @name:zh-CN   外链自动重定向
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  redirect to the real URL directly when clicking on a link that contains a redirect URL. Please manually add this site when entering the redirect page the first time 
// @description:zh-CN  点击包含重定向 URL 的链接时，直接跳转到到真实的 URL,首次进入跳转页面，请手动添加此站点
// @author       uiliugang
// @run-at       document-start
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462796/External%20Link%20Auto%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/462796/External%20Link%20Auto%20Redirect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const httpPattern = /http/g;
    const domain = window.location.hostname;
    const firstHttpExcludeWords = ['portal','proxy','player','vpn','search','api','convert','sorry', 'qrcode', 'aptcha', 'account', 'login', 'sign', 'auth', 'logout', 'register', 'upload', 'share', 'live', 'watch'];
    const secondHttpExcludeWords = ['.m3u8', '.flv', '.ts']
    const isChinese = checkLocalChineseLanguage();
    insertMenu();

    function checkLocalChineseLanguage() {
        const chineseLanguages = ["zh", "zh-CN", "zh-HK", "zh-TW", "zh-MO", "zh-SG", "zh-MY"];
        const lang = navigator.language || navigator.userLanguage || "en-US";
        return chineseLanguages.includes(lang);
    }

    function insertMenu(){
        const addDomain = ` ${isChinese ? "启用: "+ domain: "Enabled: "+ domain}`;
        const deleteDomain = ` ${isChinese ? "关闭: "+ domain: "Disabled: "+ domain}`;
        GM_registerMenuCommand(addDomain, function() {
            GM_setValue(domain, "1");
        });
        GM_registerMenuCommand(deleteDomain, function() {
            GM_deleteValue(domain);
        });
    }

    function isAllowedWebsites(domain){
        if (GM_getValue(domain, null)=="1") {
            return true;
        }
        return false;
    }

    function parseUrl(redirectURL) {
        let index = findSecondHttpPosition(redirectURL);
        if (index !== -1) {
            let realUrl = redirectURL.substring(index);
            let firstHttp = redirectURL.substring(0, index).toLowerCase();
            let secondHttp = realUrl.toLowerCase();

            for (const ext of firstHttpExcludeWords) {
                if (firstHttp.includes(ext)) {
                    console.log(`firstHttpExcludeWord: ${ext}`);
                    return null;
                }
            }

            for (const ext of secondHttpExcludeWords) {
                if (secondHttp.includes(ext)) {
                    console.log(`secondHttpExcludeWord: ${ext}`);
                    return null;
                }
            }

            realUrl = decodeURIComponent(realUrl);
            
            if (isValidUrl(realUrl)) {
                return realUrl;
            }
        }
        return null;
    }

    function findSecondHttpPosition(redirectURL) {
        let match;
        let position = -1;
        let count = 0;

        while ((match = httpPattern.exec(redirectURL)) !== null) {
            count++;
            if (count === 2) {
                position = match.index;
                return position;
            }
        }
        return -1;
    }

    function isValidUrl(realUrl) {
        try {
            let url = new URL(realUrl);
            return true;
        } catch (e) {
            return false;
        }
    }

    document.addEventListener('click', function (e) {
        const element = e.target.closest('a[href]');
        if (isAllowedWebsites(domain) && element) {
            const parsedUrl = parseUrl(element.href);
            if (parsedUrl) {
                e.preventDefault();
                window.open(parsedUrl, '_blank');
            }
        }
    });

    if (isAllowedWebsites(domain)){
        let parsedUrl = parseUrl(window.location.href);
        if (parsedUrl) {
            window.location.replace(parsedUrl);
            console.log(`parsed URL: ${parsedUrl}`);
        }
    }
})();
