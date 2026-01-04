// ==UserScript==
// @name         OPPO天气广告拦截器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  拦截 news.heytapdownload.com 上的OPPO天气广告和不必要元素，提供更清爽的浏览体验。
// @author       gemini and iamhcfhsgl
// @match        https://news.heytapdownload.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543412/OPPO%E5%A4%A9%E6%B0%94%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543412/OPPO%E5%A4%A9%E6%B0%94%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义要隐藏的元素的选择器数组
    const selectorsToHide = [
        '#oppo-cec-loading0',
        '#oppo-cec-news-inject-weather-warning-alert_weather_0_11',
        '#oppo-cec-news-inject-weather-warning-alert_weather_0_9',
        '#oppo-cec-news-inject-weather-warning-alert_weather_0_10',
        '#oppo-cec-news-inject-weather-warning-alert_weather_0_0',
        '#oppo-cec-news-inject-weather-warning-alert_weather_0_3',
        '#oppo-cec-news-inject-weather-warning-alert_weather_0_4',
        '#oppo-cec-news-inject-weather-warning-alert_weather_0_1',
        '#oppo-cec-news-inject-weather-warning-alert_weather_0_6',
        '#oppo-cec-news-inject-weather-warning-alert_weather_0_5',
        '#oppo-cec-news-inject-weather-warning-alert_weather_0_8',
        '.oppo-cec-weather-flow-header',
        '#oppo-cec-news-inject-typhoon-typhoon_weather_0_0',
        '#oppo-cec-news-inject-typhoon-typhoon_weather_0_1',
        '#oppo-cec-news-inject-typhoon-typhoon_weather_0_3',
        '#oppo-cec-news-inject-typhoon-typhoon_weather_0_4',
        '#oppo-cec-news-inject-typhoon-typhoon_weather_0_5',
        '#oppo-cec-news-inject-typhoon-typhoon_weather_0_6',
        '#oppo-cec-news-inject-typhoon-typhoon_weather_0_8',
        '#oppo-cec-news-inject-typhoon-typhoon_weather_0_9',
        '#oppo-cec-news-inject-typhoon-typhoon_weather_0_10',
        '#oppo-cec-news-inject-typhoon-typhoon_weather_0_11',
        '#oppo-cec-news-inject-rain-rain_weather_0_11',
        '#oppo-cec-news-inject-rain-rain_weather_0_10',
        '#oppo-cec-news-inject-rain-rain_weather_0_9',
        '#oppo-cec-news-inject-rain-rain_weather_0_6',
        '#oppo-cec-news-inject-rain-rain_weather_0_8',
        '#oppo-cec-news-inject-rain-rain_weather_0_5',
        '#oppo-cec-news-inject-rain-rain_weather_0_4',
        '#oppo-cec-news-inject-rain-rain_weather_0_3',
        '#news-inject-rain',
        '.rain_box',
        '#oppo-cec-news-inject-livingindex-chuangyi-livingindex_weather_0_11',
        '#oppo-cec-news-inject-livingindex-chuangyi-livingindex_weather_0_10',
        '#oppo-cec-news-inject-livingindex-chuangyi-livingindex_weather_0_9',
        '#oppo-cec-news-inject-livingindex-chuangyi-livingindex_weather_0_8',
        '#oppo-cec-news-inject-livingindex-chuangyi-livingindex_weather_0_6',
        '#oppo-cec-news-inject-livingindex-chuangyi-livingindex_weather_0_4',
        '#oppo-cec-news-inject-livingindex-chuangyi-livingindex_weather_0_3',
        '#oppo-cec-news-inject-livingindex-chuangyi-livingindex_weather_0_1',
        '#oppo-cec-news-inject-livingindex-chuangyi-livingindex_weather_0_0',
        '#oppo-cec-news-inject-livingindex-chuangyi-livingindex_weather_0_5',
        '#oppo-cec-news-inject-livingindex-fangshai-livingindex_weather_0_0', // 新增
        '#oppo-cec-news-inject-livingindex-fangshai-livingindex_weather_0_1', // 新增
        '#oppo-cec-news-inject-livingindex-fangshai-livingindex_weather_0_3', // 新增
        '#oppo-cec-news-inject-livingindex-fangshai-livingindex_weather_0_4', // 新增
        '#oppo-cec-news-inject-livingindex-fangshai-livingindex_weather_0_5', // 新增
        '#oppo-cec-news-inject-livingindex-fangshai-livingindex_weather_0_6', // 新增
        '#oppo-cec-news-inject-livingindex-fangshai-livingindex_weather_0_8', // 新增
        '#oppo-cec-news-inject-livingindex-fangshai-livingindex_weather_0_9', // 新增
        '#oppo-cec-news-inject-livingindex-fangshai-livingindex_weather_0_10', // 新增
        '#oppo-cec-news-inject-livingindex-fangshai-livingindex_weather_0_11', // 新增
        '#oppo-cec-news-inject-weather-info-infor_weather_0_0',
        '#oppo-cec-news-inject-weather-info-infor_weather_0_1',
        '#oppo-cec-news-inject-weather-info-infor_weather_0_3',
        '#oppo-cec-news-inject-weather-info-infor_weather_0_4',
        '#oppo-cec-news-inject-weather-info-infor_weather_0_5',
        '#oppo-cec-news-inject-weather-info-infor_weather_0_6',
        '#oppo-cec-news-inject-weather-info-infor_weather_0_8',
        '#oppo-cec-news-inject-weather-info-infor_weather_0_9',
        '#oppo-cec-news-inject-weather-info-infor_weather_0_10',
        '#oppo-cec-news-inject-weather-info-infor_weather_0_11',
        '#oppo-cec-news-inject-air-quality-quality_weather_0_0',
        '#oppo-cec-news-inject-air-quality-quality_weather_0_1',
        '#oppo-cec-news-inject-air-quality-quality_weather_0_3',
        '#oppo-cec-news-inject-air-quality-quality_weather_0_4',
        '#oppo-cec-news-inject-air-quality-quality_weather_0_5',
        '#oppo-cec-news-inject-air-quality-quality_weather_0_6',
        '#oppo-cec-news-inject-air-quality-quality_weather_0_8',
        '#oppo-cec-news-inject-air-quality-quality_weather_0_9',
        '#oppo-cec-news-inject-air-quality-quality_weather_0_10',
        '#oppo-cec-news-inject-air-quality-quality_weather_0_11',
        '#oppo-cec-news-inject-indexnew-15day_weather_0_0',
        '#oppo-cec-news-inject-indexnew-15day_weather_0_1',
        '#oppo-cec-news-inject-indexnew-15day_weather_0_3',
        '#oppo-cec-news-inject-indexnew-15day_weather_0_4',
        '#oppo-cec-news-inject-indexnew-15day_weather_0_5',
        '#oppo-cec-news-inject-indexnew-15day_weather_0_6',
        '#oppo-cec-news-inject-indexnew-15day_weather_0_8',
        '#oppo-cec-news-inject-indexnew-15day_weather_0_9',
        '#oppo-cec-news-inject-indexnew-15day_weather_0_10',
        '#oppo-cec-news-inject-indexnew-15day_weather_0_11',
        '#oppo-cec-news-inject-daily-weather-forecast-daily_weather_0_0',
        '#oppo-cec-news-inject-daily-weather-forecast-daily_weather_0_1',
        '#oppo-cec-news-inject-daily-weather-forecast-daily_weather_0_3',
        '#oppo-cec-news-inject-daily-weather-forecast-daily_weather_0_4',
        '#oppo-cec-news-inject-daily-weather-forecast-daily_weather_0_5',
        '#oppo-cec-news-inject-daily-weather-forecast-daily_weather_0_6',
        '#oppo-cec-news-inject-daily-weather-forecast-daily_weather_0_8',
        '#oppo-cec-news-inject-daily-weather-forecast-daily_weather_0_9',
        '#oppo-cec-news-inject-daily-weather-forecast-daily_weather_0_10',
        '#oppo-cec-news-inject-daily-weather-forecast-daily_weather_0_11',
        '#oppo-cec-news-inject-by-hour-hour_weather_0_0',
        '#oppo-cec-news-inject-by-hour-hour_weather_0_1',
        '#oppo-cec-news-inject-by-hour-hour_weather_0_3',
        '#oppo-cec-news-inject-by-hour-hour_weather_0_4',
        '#oppo-cec-news-inject-by-hour-hour_weather_0_5',
        '#oppo-cec-news-inject-by-hour-hour_weather_0_6',
        '#oppo-cec-news-inject-by-hour-hour_weather_0_8',
        '#oppo-cec-news-inject-by-hour-hour_weather_0_9',
        '#oppo-cec-news-inject-by-hour-hour_weather_0_10',
        '#oppo-cec-news-inject-by-hour-hour_weather_0_11',
        '#oppo-cec-news-inject-current-current_weather_0_0',
        '#oppo-cec-news-inject-current-current_weather_0_1',
        '#oppo-cec-news-inject-current-current_weather_0_3',
        '#oppo-cec-news-inject-current-current_weather_0_4',
        '#oppo-cec-news-inject-current-current_weather_0_5',
        '#oppo-cec-news-inject-current-current_weather_0_6',
        '#oppo-cec-news-inject-current-current_weather_0_8',
        '#oppo-cec-news-inject-current-current_weather_0_9',
        '#oppo-cec-news-inject-current-current_weather_0_10',
        '#oppo-cec-news-inject-current-current_weather_0_11'
    ];

    // 构建 CSS 隐藏规则
    const cssToHide = selectorsToHide.map(selector => `${selector} { display: none !important; }`).join('\n');

    // 使用 GM_addStyle 在页面加载前注入 CSS 规则
    GM_addStyle(cssToHide);

})();