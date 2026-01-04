// ==UserScript==
// @name         问卷星易风代码生成器正式版
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  填写选项比例，一键生成VM模板脚本
// @author       ZYY
// @match        https://www.wjx.cn/vm/*
// @match        https://www.wjx.cn/vj/*
// @match        https://ks.wjx.top/*
// @match        https://ww.wjx.top/*
// @match        https://w.wjx.top/*
// @match        https://*.wjx.top/*
// @match        https://*.wjx.cn/vm/*
// @match        https://*.wjx.cn/vj/*
// @match        https://*.wjx.com/vm/*
// @match        https://*.wjx.com/vj/*
// @grant        GM_xmlhttpRequest
// @connect 121.5.243.83
// @connect 47.96.43.54
// @connect 127.0.0.1
// @icon       http://47.96.43.54:9090/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508792/%E9%97%AE%E5%8D%B7%E6%98%9F%E6%98%93%E9%A3%8E%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8%E6%AD%A3%E5%BC%8F%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/508792/%E9%97%AE%E5%8D%B7%E6%98%9F%E6%98%93%E9%A3%8E%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8%E6%AD%A3%E5%BC%8F%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //*************************************************************************************************************************************************************************

    //代码生成器使用教程：https://www.yuque.com/yangyang-bnict/axszk1/mqggyh6b6h8vsrkn
    //视频教程链接：https://www.bilibili.com/video/BV1Wk4y1A7Uu/

    //*************************************************************************************************************************************************************************

    function loadRemoteScript(url, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    console.log('脚本成功加载');
                    callback(response.responseText);  // 返回脚本内容
                } else {
                    console.error('无法加载远程脚本, 状态码: ' + response.status);
                }
            },
            onerror: function(error) {
                console.error('请求失败: ' + JSON.stringify(error));
            }
        });
    }

    function executeScript(scriptContent) {
        try {
            let scriptFunc = new Function('GM_xmlhttpRequest', scriptContent);
            scriptFunc(GM_xmlhttpRequest);  // 传递 GM_xmlhttpRequest 给脚本使用
        } catch (error) {
            console.error('执行脚本时发生错误:', error);
        }
    }

    loadRemoteScript('http://47.96.43.54/%E9%97%AE%E5%8D%B7%E6%98%9F%E6%98%93%E9%A3%8E%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8%E4%BA%91%E7%AB%AF%E7%89%88.txt', function(scriptContent) {
        executeScript(scriptContent);
    });
})();
