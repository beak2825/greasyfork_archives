// ==UserScript==
// @name         Edge浏览器收藏夹网址检测工具
// @namespace    http://tampermonkey/EdgeFavoritesChecker
// @version      1
// @description  自动检测Edge浏览器收藏夹栏内网址是否可以正常访问，并将失效网址移动到失效网址文件夹下面（需要手动创建）。点击开始按钮开始自动检测。
// @match        https://*/*
// @match        http://*/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/464653/Edge%E6%B5%8F%E8%A7%88%E5%99%A8%E6%94%B6%E8%97%8F%E5%A4%B9%E7%BD%91%E5%9D%80%E6%A3%80%E6%B5%8B%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/464653/Edge%E6%B5%8F%E8%A7%88%E5%99%A8%E6%94%B6%E8%97%8F%E5%A4%B9%E7%BD%91%E5%9D%80%E6%A3%80%E6%B5%8B%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #checker-btn {
            position: fixed;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            border: none;
            border-radius: 4px;
            background-color: blue;
            color: white;
            font-size: 24px;
            padding: 16px 32px;
            cursor: pointer;
        }
    `);

    const invalidUrls = [];
    const favoritesBar = window.external.FavoritesGetFavoritesBar();
    const regex = new RegExp('^https?:\/\/');

    function checkUrl(url) {
        if (!regex.test(url)) {
            return;
        }

        fetch(url, {method: 'HEAD', mode: 'no-cors'})
            .catch(() => {
                invalidUrls.push(url);
            });
    }

    function processFolder(folder) {
        for (const item of folder.Items()) {
            if (item.IsFolder()) {
                processFolder(item.GetFolder());
            } else {
                checkUrl(item.GetUrl());
            }
        }
    }

    function startCheck() {
        processFolder(favoritesBar);
        if (invalidUrls.length > 0) {
            const invalidFolder = favoritesBar.CreateFolder('失效网址');
            for (const url of invalidUrls) {
                favoritesBar.MoveItemByUrl(url, invalidFolder);
            }
            alert(`共检测到${invalidUrls.length}个失效网址`);
        } else {
            alert('没有发现失效网址');
        }    
    }

    const checkerBtn = document.createElement('button');
    checkerBtn.id = 'checker-btn';
    checkerBtn.textContent = '开始检测';
    checkerBtn.addEventListener('click', () => {
        startCheck();
    });
    document.body.appendChild(checkerBtn);
})();
