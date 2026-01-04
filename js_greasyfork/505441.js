// ==UserScript==
// @name         opgg去广告
// @namespace    http://akiyamamio.online/
// @version      0.0.7
// @description  去除opgg 英雄联盟,云顶之弈,无畏契约的左侧视屏广告
// @author       alive
// @match        *://*.op.gg/*
// @icon         https://s-lol-web.op.gg/favicon.ico
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/505441/opgg%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/505441/opgg%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // JSON 配置对象
    const configData = {
        configs: [
            {
                configName: "LOL_Config",
                urlPattern: ".*://www.op.gg/.*",
                adSelectors: [
                    "#opgg-video",
                    "#primisPlayerContainerDiv",
                    "#banner-container",
                    "#opgg-kit-house-image-banner",
                    ".vm-skin",
                    ".vm-footer",
                    ".banner-container",
                    "#banner-container",
                    ".banner",
                    "#aniplayer",
                    "div[style='width: 405px; height: 228px;']",
                    "div[class='css-14mw2gw e1ye94yl7']",
                    "div[style='position: fixed; overflow: hidden; pointer-events: none; inset: 255px 1314.5px 0px 0px; text-align: right; z-index: 2;']",
                    "div[style='position: fixed; overflow: hidden; pointer-events: none; inset: 255px 0px 0px 1314.5px; text-align: left; z-index: 2;']"
                ]
            },
            {
                configName: "TFT_Config",
                urlPattern: ".*://tft.op.gg/.*",
                adSelectors: [
                    "#opgg-kit-house-image-banner",
                    "#video-meta-trend-ad",
                    "#video-tools-ad",
                    ".css-13lit7a",
                    ".desktop",
                    ".css-1t8t0it"
                ]
            },
            {
                configName: "V_Config",
                urlPattern: ".*://valorant.op.gg/.*",
                adSelectors: [
                    "#opgg-kit-house-image-banner",
                    "#video-leaderboards-ad",
                    "#video-stats-ad",
                    "#video-crosshair-ad",
                    "#video-agents-ad",
                    "#video-weapons-ad",
                    "#video-profile-ad",
                    ".ad",
                    ".ad--desktop",
                    "#primis_container_div"
                ]
            }
        ]
    };

    // Config 对象
    function Config(configName, urlPattern, adSelectors) {
        this.configName = configName;
        this.urlPattern = urlPattern;
        this.adSelectors = adSelectors;
    }

    // 获取广告选择器的方法，直接返回选择器字符串
    Config.prototype.getADSelector = function () {
        return this.adSelectors.join(",");
    };

    // 动态创建Config的函数，根据当前URL匹配并创建
    function createConfigIfMatch(configName, urlPattern, adSelectors) {
        const currentUrl = window.location.href; // 获取当前页面的URL
        const pattern = new RegExp(urlPattern); // 创建正则表达式

        // 判断当前URL是否匹配指定的URL模式
        return pattern.test(currentUrl) ? new Config(configName, urlPattern, adSelectors) : null;
    }

    // 动态创建多个配置对象，从 JSON 数据中读取
    const configs = configData.configs
        .map(({ configName, urlPattern, adSelectors }) =>
            createConfigIfMatch(configName, urlPattern, adSelectors)
        )
        .filter(config => config !== null); // 过滤掉没有匹配的配置

    if (configs.length > 0) {
        const matchedConfig = configs[0]; // 使用匹配到的第一个配置
        console.log("匹配到的配置:", matchedConfig.configName);
        const adSelector = matchedConfig.getADSelector();

        // 观察DOM并自动隐藏广告
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' || (mutation.type === 'attributes' && mutation.attributeName === 'style')) {
                    hideAdsAndIframes(adSelector);
                }
            });
        });

        // 开始观察DOM的变化，监听子元素、属性的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style'] // 只监听`style`属性的变化
        });

        // 初始隐藏广告和 iframe
        hideAdsAndIframes(adSelector);
    } else {
        console.log("没有找到匹配的配置");
    }

    // 隐藏广告和 iframe 的函数
    function hideAdsAndIframes(adSelector) {
        // 隐藏广告元素
        const elements = document.querySelectorAll(adSelector);
        elements.forEach(element => {
            if (element && element.style.display !== 'none') {
                element.style.display = 'none';
            }
        });

        // 隐藏所有 iframes
        const iframes = document.getElementsByTagName('iframe');
        Array.from(iframes).forEach(iframe => {
            if (iframe && iframe.style.display !== 'none') {
                iframe.style.display = 'none';
            }
        });
    }
})();

