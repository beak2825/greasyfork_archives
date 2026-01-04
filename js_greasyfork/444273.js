// ==UserScript==
// @name              Overleaf PDF Viewer Page Numbers
// @name:zh-CN        Overleaf PDF 预览界面显示页码
// @namespace         acoder.me
// @version           0.0.3
// @description       show page numbers in PDF preview panel
// @description:zh-cn 在 Overleaf 的 PDF 预览界面中显示页码
// @author            hengzhang,a23187
// @match             https://www.overleaf.com/project/*
// @icon              https://www.overleaf.com/favicon.ico
// @grant             none
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/444273/Overleaf%20PDF%20Viewer%20Page%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/444273/Overleaf%20PDF%20Viewer%20Page%20Numbers.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const id = setInterval(() => {
        document.body.style.overflow = 'hidden';
        const btns = document.querySelector('.pdfjs-controls .btn-group');
        if (!btns) {
            return;
        }
       // document.body.style.position = 'fixed';


        const btn = btns.lastElementChild.cloneNode();
        btn.href = '#';
        btn.innerText = 'p/P';

        function isInViewport(e) {
            const rect = e.getBoundingClientRect();
            const midPoint = (window.innerHeight || document.documentElement.clientHeight) / 2;
            return rect.top <= midPoint && midPoint <= rect.bottom;
        }
        const pages = document.getElementsByClassName('page');
        function displayCurrentPage(){
            for (let i = 0; i < pages.length; ++i) {
                if (isInViewport(pages[i])) {
                    btn.innerText = `${i + 1}/${pages.length}`;
                    return `${i + 1}/${pages.length}`;
                }
            }
        };

        function writeToRightToolbar(text) {
            for (let toolbar of document.getElementsByClassName("toolbar toolbar-pdf toolbar-pdf-hybrid btn-toolbar")) {
                for (let item of toolbar.childNodes) {
                    if (item.className === 'toolbar-pdf-right') {
                        item.style.color = 'white'
                        item.innerHTML = text === 'undefined' | text === undefined ? '' : text;
                    }
                }
            }
        }
        document.getElementsByClassName("full-size ui-layout-container")[0].style.overflow = 'unset';

        //document.getElementsByClassName("pdfjs-viewer-inner")[0].addEventListener('onscroll', () => { writeToRightToolbar(displayCurrentPage());});
        setInterval(() => { writeToRightToolbar(displayCurrentPage());}, 300);
        btn.onclick = () => {
            displayCurrentPage();
        };
        let pdfControls = document.getElementsByClassName("pdfjs-controls");
        if(pdfControls.length >= 0) {
            pdfControls[0].addEventListener('mouseover', () => {displayCurrentPage();});
        }
        btns.appendChild(btn);
        clearInterval(id);
    }, 1000);
})();
