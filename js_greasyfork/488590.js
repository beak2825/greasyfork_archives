// ==UserScript==
// @name         LittleSkin皮肤下载
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @license      MIT
// @description  下载LittleSkin皮肤文件 QQ群：791213962
// @author       清欢
// @match        https://littleskin.cn/skinlib/show/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/488590/LittleSkin%E7%9A%AE%E8%82%A4%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/488590/LittleSkin%E7%9A%AE%E8%82%A4%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数用于弹窗，根据设置决定是否触发
    function showAlert(message) {
        var showAlerts = GM_getValue('showAlerts', true); // 默认为true
        if (showAlerts) {
            alert(message);
        }
    }

    // 注册一个菜单命令来切换alert
    GM_registerMenuCommand('弹窗提示开关', function() {
        var showAlerts = GM_getValue('showAlerts', true);
        GM_setValue('showAlerts', !showAlerts);
        // 使用不受设置影响的alert来提醒用户
        alert('弹窗提示已' + (!showAlerts ? '开启' : '关闭') + '.');
    });

    // 等待页面加载DOM
    window.addEventListener('load', function() {
        // 查找ID为'side'的元素
        var sideElement = document.getElementById('side');
        if (sideElement) {
            // 创建一个按钮元素
            var button = document.createElement('button');
            button.innerText = '下载皮肤文件';
            button.style.width = '360px';
            button.style.height = '51px';
            button.style.backgroundColor = '#007bff';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';

            // 为按钮添加点击事件监听器
            button.addEventListener('click', function() {
                // 获取皮肤ID
                var skinId = window.location.pathname.split('/').pop();

                // 获取hash值的API URL
                var apiUrl = 'https://littleskin.cn/texture/' + skinId;

                // 发起GET请求获取hash
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: apiUrl,
                    onload: function(response) {
                        // 解析JSON以获取hash值
                        var jsonResponse = JSON.parse(response.responseText);
                        var hash = jsonResponse.hash;

                        if (hash) {
                            // 创建图片的URL
                            var textureUrl = 'https://littleskin.cn/textures/' + hash;

                            // 获取文件名
                            var fileName = document.querySelector('.col-7.text-truncate').textContent;

                            // 使用GM_download下载图片
                            GM_download({
                                url: textureUrl,
                                name: fileName,
                                onload: function() {
                                    showAlert('下载成功！');
                                },
                                onerror: function() {
                                    showAlert('下载失败！');
                                }
                            });
                        } else {
                            showAlert('无法获取皮肤文件。');
                        }
                    },
                    onerror: function() {
                        showAlert('无法获取皮肤信息。');
                    }
                });
            });

            // 将按钮添加到ID为'side'的元素内
            sideElement.appendChild(button);
        }
    }, false);
})();