// ==UserScript==
// @name               ToAlphaXiv
// @name:zh-CN 　      跳转到AlphaXiv
// @name:ja            AlphaXivへ
// @namespace          http://tampermonkey.net/
// @version            2025-03-19-1
// @description        Add AlphaXiv link to arXiv abstract page, and add a button to go back
// @description:zh-cn  增加到 AlphaXiv 的链接，并添加一个回到 ArXiv 的按钮
// @description:ja     AlphaXiv へのリンクをインサート、そして戻るボタンも。
// @author             majoranaoedipus@posteo.org, barret.china@gmail.com
// @match              https://arxiv.org/abs/*
// @match              https://www.arxiv.org/abs/*
// @match              https://www.alphaxiv.org/abs/*
// @match              https://alphaxiv.org/abs/*
// @icon               https://alphaxiv.org/icon.ico
// @grant              none
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/502558/ToAlphaXiv.user.js
// @updateURL https://update.greasyfork.org/scripts/502558/ToAlphaXiv.meta.js
// ==/UserScript==
if (window.location.hostname === 'arxiv.org') {
    (function() {
        'use strict';
        const createLink = function(name, url) {
            const link = document.createElement('a');
            link.style.cssText = `display: inline-block; border-left: 2px solid #fff; padding-left: 10px; margin-left: 10px;`;
            link.target = '_blank';
            link.href = url;
            link.textContent = name;
            return link;
        };

        const href = window.location.href;
        const alphaXivEntry = createLink('AlphaXiv', href.replace('arxiv.org', 'alphaxiv.org'));

        const target = document.querySelector('.header-breadcrumbs');
        target.appendChild(alphaXivEntry);
    })();
} else {
    (function() {
        'use strict';
        const createLink = function(name, url) {
            const newButton = document.createElement('a');
            newButton.href = url;
            newButton.target = '_blank';
            newButton.className = 'group flex h-[30px] items-center justify-between rounded-lg border px-2 text-sm transition-all border-gray-600 bg-white text-gray-600 hover:bg-gray-100';

            const buttonText = document.createElement('span');
            buttonText.textContent = name;
            buttonText.className = 'font-medium text-gray-600';

            newButton.appendChild(buttonText);

            return newButton;
        };
        const observer = new MutationObserver(() => {
            const targetContainer = document.querySelector(".flex.items-center.space-x-2");
            if (targetContainer) {
                const href = window.location.href;
                const alphaXivEntry = createLink('Back to ArXiv', href.replace('alphaxiv.org', 'arxiv.org'));

                targetContainer.appendChild(alphaXivEntry);
                observer.disconnect(); // 停止监听
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    })();
}