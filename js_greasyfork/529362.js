// ==UserScript==
// @name         WebDAV Image Saver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  通过右键菜单保存图片到WebDAV服务器
// @author       YourName
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @license MI
// @downloadURL https://update.greasyfork.org/scripts/529362/WebDAV%20Image%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/529362/WebDAV%20Image%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastImageSrc = null;

    // 监听右键菜单事件，记录最后选中的图片
    document.addEventListener('contextmenu', function(e) {
        const target = e.target;
        if (target.tagName === 'IMG' && target.src) {
            lastImageSrc = target.src;
        } else {
            lastImageSrc = null;
        }
    });

    // 注册右键菜单命令
    GM_registerMenuCommand('保存图片到WebDAV', saveImageToWebDAV);
    GM_registerMenuCommand('配置WebDAV设置', configureWebDAV);

    // 配置WebDAV参数
    function configureWebDAV() {
        const webdavUrl = prompt('请输入WebDAV URL:', GM_getValue('webdavUrl', ''));
        const username = prompt('请输入用户名:', GM_getValue('username', ''));
        const password = prompt('请输入密码:', GM_getValue('password', ''));
        const savePath = prompt('请输入保存路径（以/结尾）:', GM_getValue('savePath', '/'));

        if (webdavUrl && username && password) {
            GM_setValue('webdavUrl', webdavUrl);
            GM_setValue('username', username);
            GM_setValue('password', password);
            GM_setValue('savePath', savePath || '/');
            alert('配置已保存！');
        }
    }

    // 保存图片到WebDAV
    function saveImageToWebDAV() {
        if (!lastImageSrc) {
            alert('请先右键选中要保存的图片！');
            return;
        }

        const webdavUrl = GM_getValue('webdavUrl');
        const username = GM_getValue('username');
        const password = GM_getValue('password');
        const savePath = GM_getValue('savePath', '/');

        if (!webdavUrl || !username || !password) {
            alert('请先配置WebDAV参数！');
            return configureWebDAV();
        }

        // 获取文件名
        const fileName = lastImageSrc.split('/').pop().split('?')[0];
        const fullUrl = webdavUrl.replace(/\/$/, '') + savePath.replace(/\/$/, '') + '/' + fileName;

        // 下载图片
        GM_xmlhttpRequest({
            method: 'GET',
            url: lastImageSrc,
            responseType: 'blob',
            onload: function(response) {
                if (response.status !== 200) {
                    return alert('图片下载失败！');
                }

                // 上传到WebDAV
                GM_xmlhttpRequest({
                    method: 'PUT',
                    url: fullUrl,
                    headers: {
                        'Authorization': 'Basic ' + btoa(username + ':' + password)
                    },
                    data: response.response,
                    onload: function(res) {
                        if (res.status === 201 || res.status === 204) {
                            GM_notification({
                                text: '图片保存成功！',
                                title: 'WebDAV上传',
                                timeout: 3000
                            });
                        } else {
                            alert(`上传失败：${res.status} ${res.statusText}`);
                        }
                    },
                    onerror: function(err) {
                        alert('网络请求失败，请检查配置！');
                        console.error(err);
                    }
                });
            },
            onerror: function(err) {
                alert('图片下载失败！');
                console.error(err);
            }
        });
    }
})();