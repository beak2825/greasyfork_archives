// ==UserScript==
// @name            Appstorrent 翻译切换器
// @name:en         Appstorrent Language Switcher
// @namespace       https://greasyfork.org/zh-CN/scripts/490641
// @version         1.3
// @description     为appstorrent.ru自动切换翻译语言
// @description:en  Automatically switch translation language for appstorrent.ru
// @author          Corlius
// @homepageURL     https://github.com/Corlius/Corlius-Scripts
// @icon            https://www.google.com/s2/favicons?sz=64&domain=appstorrent.ru
// @license         MIT
// @match           https://appstorrent.ru/*
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/490641/Appstorrent%20%E7%BF%BB%E8%AF%91%E5%88%87%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/490641/Appstorrent%20%E7%BF%BB%E8%AF%91%E5%88%87%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isFirstInstall() {
        const isInstalled = GM_getValue('isInstalled', false);
        if (!isInstalled) {
            GM_setValue('isInstalled', true);
            return true;
        }
        return false;
    }

    if (isFirstInstall()) {
        const detailsPageLangInitial = prompt('请选择详情页面的默认语言:\nPlease select the default language for the details pages:\nr = ru 俄语\ne = en 英语\nd = de 德语\nz = zh-TW 中文', 'e');
        const otherPageLangInitial = prompt('请选择其他页面的默认语言:\nPlease select the default language of other pages:\nr = ru 俄语\ne = en 英语\nd = de 德语\nz = zh-TW 中文', 'e');
        const pollingInterval = prompt('请设置监听间隔(毫秒),默认为1500:\nPlease set the listening interval (milliseconds), the default is 1500.', '1500');
    
        GM_setValue('detailsPageLangInitial', detailsPageLangInitial);
        GM_setValue('otherPageLangInitial', otherPageLangInitial); 
        GM_setValue('pollingInterval', pollingInterval);
        window.location.reload();
    }

    // 根据语言代号改变网页语言的函数
    function changeLanguage(languageCode) {
        let languageSelector = document.querySelector(`a[data-google-lang="${languageCode}"]`);
        if (languageSelector) {
            languageSelector.click();
        }
    }

    // 语言映射
    const languageMapping = {
        'r': 'ru',
        'e': 'en',
        'd': 'de',
        'z': 'zh-TW'
    }

    // 获取用户设置的语言首字母
    function getLanguage(firstLetter) {
        return languageMapping[firstLetter] || 'en'; // 默认为英语
    }

    // 获取用户设置的语言
    var detailsPageLangInitial = GM_getValue('detailsPageLangInitial', 'e');
    var otherPageLangInitial = GM_getValue('otherPageLangInitial', 'e');

    // 获取用户设置的监听间隔
    var pollingInterval = GM_getValue('pollingInterval', 1500);

    // 转换用户设置的语言首字母为完整的语言代码
    var detailsPageLang = getLanguage(detailsPageLangInitial);
    var otherPageLang = getLanguage(otherPageLangInitial);

    // 检查当前页面是否是详情页
    var isDetailsPage = window.location.pathname.endsWith(".html");

    // 每pollingInterval毫秒监听一次页面语言变化并更新
    setInterval(function() {
        var currentLang = document.documentElement.getAttribute('lang');
        var targetLang = isDetailsPage ? detailsPageLang : otherPageLang;
        if (currentLang !== targetLang) {
            changeLanguage(targetLang);
        }
    }, pollingInterval);

    // 添加语言选择命令到菜单
    GM_registerMenuCommand('设置详情页语言 / Set details page language', function() {
        var langInitial = prompt('r = ru 俄语，e = en 英语，d= de 德语，z = zh-TW中文:', detailsPageLangInitial);
        if (langInitial) {
            GM_setValue('detailsPageLangInitial', langInitial);
            window.location.reload();
        }
    });

    GM_registerMenuCommand('设置其他页面语言 / Setting other page languages', function() {
        var langInitial = prompt('r = ru 俄语，e = en 英语，d= de 德语，z = zh-TW中文:', otherPageLangInitial);
        if (langInitial) {
            GM_setValue('otherPageLangInitial', langInitial);
            window.location.reload();
        }
    });

    // 添加设置监听间隔命令到菜单
    GM_registerMenuCommand('设置监听间隔 / Set the listening interval', function() {
        var interval = prompt('默认值为1500毫秒，如果遇到页面频繁刷新，请提高此参数：\nThe default value is 1500 ms, if you encounter frequent page refreshes, please increase this parameter:', pollingInterval);
        if (interval !== null) {
            GM_setValue('pollingInterval', interval);
            window.location.reload();
        }
    });
})();