// ==UserScript==
// @name         洛谷专栏保存站跳转
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在洛谷专栏页面添加保存站跳转按钮
// @author       Federico2903
// @match        https://www.luogu.com.cn/article/*
// @match        https://www.luogu.com/article/*
// @icon         https://www.luogu.com.cn/favicon.ico
// @grant        GM_addStyle
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/529285/%E6%B4%9B%E8%B0%B7%E4%B8%93%E6%A0%8F%E4%BF%9D%E5%AD%98%E7%AB%99%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/529285/%E6%B4%9B%E8%B0%B7%E4%B8%93%E6%A0%8F%E4%BF%9D%E5%AD%98%E7%AB%99%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let loc = 0;
    if (window.location.href.startsWith('https://www.luogu.com.cn')) loc = 1;
    if (!loc) {
        const checkContainer = setInterval(() => {
            const metasContainer = document.querySelector('.meta .metas');
            if (metasContainer) {
                clearInterval(checkContainer);
                const articleId = window.location.pathname.split('/')[2];
                const mirrorContainer = document.createElement('div');
                mirrorContainer.setAttribute('data-v-076e399a', '');
                mirrorContainer.setAttribute('style', 'margin-left: 1.5em');
                mirrorContainer.innerHTML = `
                <div data-v-076e399a class="label">保存站</div>
                <a class="mirror-link"
                   href="https://www.luogu.me/article/${articleId}"
                   target="_blank"
                   style="color: var(--lfe-color--blue-3);
                          text-decoration: none;
                          cursor: pointer;
                          transition: color 0.2s;">
                    前往专栏保存站
                </a>
            `;
                const link = mirrorContainer.querySelector('.mirror-link');
                link.addEventListener('mouseover', () => {
                    link.style.color = 'var(--lfe-color--blue-2)';
                });
                link.addEventListener('mouseout', () => {
                    link.style.color = 'var(--lfe-color--blue-3)';
                });

                metasContainer.appendChild(mirrorContainer);
            }
        }, 10);
    }
    else {
        const checkUrl = setInterval(() => {
            const cont = document.querySelector('#url');
            if (!cont) return;
            clearInterval(checkUrl);
            cont.innerHTML = cont.innerHTML.replaceAll('.com', '.me');
            const articleId = window.location.pathname.split('/')[2];
            const link = document.querySelector('a[href^="https://www.luogu.com/article/"]');
            link.setAttribute('href', link.href.replaceAll('.com', '.me'))
        }, 10);
    }
})();