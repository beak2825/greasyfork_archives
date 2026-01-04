// ==UserScript==
// @name         自定义 Bangumi 的 背景
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  自定义 bgm.tv、bangumi.tv 和 chii.in 的 背景
// @author       墨云
// @match        *://bgm.tv/*
// @match        *://bangumi.tv/*
// @match        *://chii.in/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/519093/%E8%87%AA%E5%AE%9A%E4%B9%89%20Bangumi%20%E7%9A%84%20%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/519093/%E8%87%AA%E5%AE%9A%E4%B9%89%20Bangumi%20%E7%9A%84%20%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认设置
    let settings = {
        opacity: 0.5,
        backgroundImage: 'https://p.sda1.dev/20/8e251c2308d4d5cffaf1098cee9a12c8/6.jpg',
        textBrightness: 1 // 默认文字亮度
    };

    // 加载设置
    function loadSettings() {
        const savedSettings = localStorage.getItem('customCssSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
        }
    }

    // 保存设置
    function saveSettings() {
        localStorage.setItem('customCssSettings', JSON.stringify(settings));
        applyStyles();
    }

    // 应用样式
    function applyStyles() {
        const css = `
html::after {
    content: '';
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    opacity: ${settings.opacity};
    background: linear-gradient(to right, rgb(250, 187, 187), rgb(238, 130, 146));
    background-image: url("${settings.backgroundImage}");
    background-size: cover;
    z-index: -1;
}
body {
    background: rgba(255, 255, 255, 1);
    color: #000; /* 加深文本颜色 */
}
#prgManager, #footerLinks, #columnTimelineInnerWrapper, .SidePanelMini.clearit, .calendarMini, .sidePanelHome, .subjectNav, #wiki_act-all, #latest_all, #empty_infobox, .subject_tag_section, .sideTpcList, tbody, #browserItemList {
    background: none !重要;
    opacity: 0.7;
    position: relative;
    font-weight: bold;
    color: #000 !重要;
    border-radius: 10px; /* 圆角 */
}
#prgManager img, #footerLinks img, #columnTimelineInnerWrapper img, .SidePanelMini.clearit img, .calendarMini img, .sidePanelHome img, .subjectNav img, #wiki_act-all img, #latest_all img, #empty_infobox img, .subject_tag_section img, .sideTpcList img,
.avatarNeue.avatarSize48 img, .avatar img, #browserItemList img {
    opacity: 1 !重要;
}
#prgManager::after, #footerLinks::after, #columnTimelineInnerWrapper::after, .SidePanelMini.clearit::after, .calendarMini::after, .sidePanelHome::after, .subjectNav::after, #wiki_act-all::after, #latest_all::after, #empty_infobox::after, .subject_tag_section::after, .sideTpcList::after, #browserItemList::after {
    content: "";
    background: inherit;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.5;
    pointer-events: none;
}
/* Add the following CSS to target <span> tags */
span {
    filter: brightness(${settings.textBrightness}); /* Adjust the value to change text brightness */
    font-weight: bold; /* Optional: to make the text bolder */
}
`;
        let style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // 创建设置面板
    function createSettingsPanel() {
        const backgroundImage = prompt('请输入背景图链接：', settings.backgroundImage);
        if (backgroundImage !== null) {
            settings.backgroundImage = backgroundImage;
        }

        const opacity = prompt('请输入透明度 (0 到 1 之间的数值)：', settings.opacity);
        if (opacity !== null) {
            settings.opacity = parseFloat(opacity);
        }

        const textBrightness = prompt('请输入文字亮度 (0 到 1 之间的数值)：', settings.textBrightness);
        if (textBrightness !== null) {
            settings.textBrightness = parseFloat(textBrightness);
        }

        saveSettings();
    }

    // 插入设置面板按钮
    function insertSettingsButton() {
        const secTab = document.querySelector('.secTab.rr');
        if (secTab) {
            const li = document.createElement('li');
            li.innerHTML = '<a href="javascript:void(0);" id="customSettingsButton">自定义背景设置</a>';

            const baseSettingTab = secTab.querySelector('li:nth-child(2)');
            if (baseSettingTab) {
                secTab.insertBefore(li, baseSettingTab);
            }

            document.getElementById('customSettingsButton').addEventListener('click', createSettingsPanel);
        }
    }

    // 初始化
    function initialize() {
        const settingsPages = [
            /^https:\/\/bgm\.tv\/settings/,
            /^https:\/\/chii\.in\/settings/,
            /^https:\/\/bangumi\.tv\/settings/
        ];

        if (settingsPages.some(regex => regex.test(window.location.href))) {
            insertSettingsButton();
        }

        loadSettings();
        applyStyles();
    }

    initialize();
    
    // 注册菜单命令
    GM_registerMenuCommand('自定义背景设置', createSettingsPanel);

})();
