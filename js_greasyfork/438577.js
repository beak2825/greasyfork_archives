// ==UserScript==
// @name              Overleaf PDF Viewer Page Numbers
// @name:zh-CN        Overleaf PDF 预览界面显示页码
// @namespace         a23187.cn
// @version           0.0.1
// @description       show page numbers in PDF preview panel
// @description:zh-cn 在 Overleaf 的 PDF 预览界面中显示页码
// @author            a23187
// @match             https://www.overleaf.com/project/*
// @icon              https://www.overleaf.com/favicon.ico
// @grant             none
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/438577/Overleaf%20PDF%20Viewer%20Page%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/438577/Overleaf%20PDF%20Viewer%20Page%20Numbers.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const id = setInterval(() => {
        const btns = document.querySelector('.pdfjs-controls .btn-group');
        if (!btns) {
            return;
        }

        const btn = btns.lastElementChild.cloneNode();
        btn.href = '#';
        btn.innerText = 'p/P';

        function isInViewport(e) {
            const rect = e.getBoundingClientRect();
            const midPoint = (window.innerHeight || document.documentElement.clientHeight) / 2;
            return rect.top <= midPoint && midPoint <= rect.bottom;
        }
        const pages = document.getElementsByClassName('pdf-page-container page-container ng-scope');
        btn.onclick = () => {
            for (let i = 0; i < pages.length; ++i) {
                if (isInViewport(pages[i])) {
                    btn.innerText = `${i + 1}/${pages.length}`;
                    break;
                }
            }
        };

        btns.appendChild(btn);

        clearInterval(id);
    }, 1000);
})();
