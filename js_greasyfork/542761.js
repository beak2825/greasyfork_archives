// ==UserScript==
// @name         Google Play APKMirror Link
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在Google Play应用页面添加APKMirror搜索按钮
// @author       XYZ
// @match        https://play.google.com/store/apps/details?id=*
// @match        https://play.google.com/store/apps/details/*?id=*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&url=http://play.google.com&size=32
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542761/Google%20Play%20APKMirror%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/542761/Google%20Play%20APKMirror%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前应用包名
    const appId = new URLSearchParams(window.location.search).get('id');
    if (!appId) return;

    // 创建APKMirror搜索按钮
    function createAPKButton() {
        const container = document.createElement('div');
        container.className = 'u4ICaf';

        const button = document.createElement('button');
        button.className = 'P9KVBf VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 MjT6xe sOCCfd brKGGd BhQfub ishze P44HY';
        button.setAttribute('aria-label', 'Search APKMirror');
        button.onclick = function() {
            window.open(`https://www.apkmirror.com/?post_type=app_release&searchtype=apk&s=${appId}`, '_blank');
        };

        const span = document.createElement('span');
        span.textContent = 'APKMirror';
        button.appendChild(span);

        container.appendChild(button);
        return container;
    }

    // 在安装按钮旁插入APKMirror按钮
    function insertButton() {
        const buttonContainer = document.querySelector('.kk2r5b .edaMIf .bGJWSe > c-wiz > div');
        if (!buttonContainer) return false;

        // 检查是否已存在APKMirror按钮
        if (buttonContainer.querySelector('.P9KVBf')) return false;

        const apkButton = createAPKButton();
        buttonContainer.appendChild(apkButton);
        return true;
    }

    // 尝试插入按钮，失败则监听DOM变化
    if (!insertButton()) {
        const observer = new MutationObserver((mutations, obs) => {
            if (insertButton()) {
                obs.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();