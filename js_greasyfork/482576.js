// ==UserScript==
// @name             谁是股批
// @name:en          who-is-browser-gamer
// @namespace        lanyangzhi.github.io
// @version          0.9.1_dev
// @description      "有没有人做一个插件，点开石之家的主页，自动查 logs 然后显示出来"
// @description:en   FFXIV Chinese Official Server modifi scripts
// @author           Lanyangzhi
// @license          MIT
// @icon             https://assets.rpglogs.cn/img/ff/favicon.png
// @match            *://ff14risingstones.web.sdo.com/*
// @exclude          /^https:\/\/ff14risingstones\.web\.sdo\.com\/pc\/index\.html#\/recruit\/beginner.*$/
// @run-at           document-idle
// @downloadURL https://update.greasyfork.org/scripts/482576/%E8%B0%81%E6%98%AF%E8%82%A1%E6%89%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/482576/%E8%B0%81%E6%98%AF%E8%82%A1%E6%89%B9.meta.js
// ==/UserScript==




(function() {
    'use strict';

    if (location.href == 'https://ff14risingstones.web.sdo.com/pc/index.html#/recruit/party') {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.target.classList.contains('el-menu-item') && mutation.target.classList.contains('is-active')) {
                    location.reload();
                }
                else if (mutation.addedNodes.length) {
                    addIcons();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

        function addIcons() {
            const usernames = document.querySelectorAll('.ft20');
            usernames.forEach((usernameElement) => {
                const serverElement = document.querySelector('.mt3 span:nth-child(3)');
                if (serverElement) {
                    const username = usernameElement.textContent.trim();
                    const server = serverElement.textContent.trim();
                    const fflogsUrl = `https://cn.fflogs.com/character/CN/${server}/${username}`;
                    if (!usernameElement.querySelector('.fflogs-icon')) {
                        const icon = document.createElement('a');
                        icon.href = fflogsUrl;
                        icon.target = '_blank';
                        icon.className = 'fflogs-icon';
                        icon.style.marginLeft = '5px';
                        icon.innerHTML = '<img src="https://assets.rpglogs.cn/img/ff/favicon.png" alt="FFLogs" style="width:20px;height:20px;">';
                        usernameElement.appendChild(icon);
                    }
                }
            });
        }
        window.onload = addIcons();
    }
})();
