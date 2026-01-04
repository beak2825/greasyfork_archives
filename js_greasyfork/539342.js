// ==UserScript==
// @name        跳转旧版本工作流
// @namespace   Violentmonkey Scripts
// @match       *://eai.datastory.com.cn/*
// @match       *://eai-new.dev.datastory.com.cn/*
// @grant       none
// @version     1.6
// @author      -
// @description  拦截特定格式的路径并提取变量进行重定向
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539342/%E8%B7%B3%E8%BD%AC%E6%97%A7%E7%89%88%E6%9C%AC%E5%B7%A5%E4%BD%9C%E6%B5%81.user.js
// @updateURL https://update.greasyfork.org/scripts/539342/%E8%B7%B3%E8%BD%AC%E6%97%A7%E7%89%88%E6%9C%AC%E5%B7%A5%E4%BD%9C%E6%B5%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 目标重定向URL模板，可以包含占位符如{id}
    const redirectTemplate = '/workspace/{workspaceId}/app/{appId}/workflow';

    // 保存原始的window.open方法
    const originalOpen = window.open;

    // 替换window.open为自定义函数
    window.open = function(url, target, features) {
         const redirectUrl = getRedirectUrl(url);
        return originalOpen.call(this, redirectUrl || url, target, features);
    };

    // 获取重定向URL，如果不匹配则返回null
    function getRedirectUrl(url) {
      console.log(url)
        // 正则表达式匹配 /next/workspace/{变量1}/app/{变量2}/workflow 格式
        const match = url.match(/\/next\/workspace\/([^/]+)\/app\/([^/]+)\/workflow/i);

        if (match) {
            const workspaceId = match[1]; // 第一个变量
            const appId = match[2];       // 第二个变量

            // 替换模板中的占位符
            return redirectTemplate
                .replace('{workspaceId}', workspaceId)
                .replace('{appId}', appId);
        }

        return null;
    }

})();