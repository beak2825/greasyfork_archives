// ==UserScript==
// @name         菁师帮试卷下载
// @namespace    https://laoyu.12580.wang/
// @version      1.4
// @description  单页(免v)下载
// @author       御清弦
// @icon         https://www.jingshibang.com/favicon.ico
// @match        https://www.jingshibang.com/home/detailPape/*
// @match        https://www.jingshibang.com/home/detailPape*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506980/%E8%8F%81%E5%B8%88%E5%B8%AE%E8%AF%95%E5%8D%B7%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/506980/%E8%8F%81%E5%B8%88%E5%B8%AE%E8%AF%95%E5%8D%B7%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const originalOpen = XMLHttpRequest.prototype.open;
    const containerCssText = 'position: fixed;height: 40px;line-height: 37px;top: 40px;left: 10px;z-index: 999;background-color: #fad4ae;color:white;padding: 0 10px;font-size: 1.5em;';
    const linkaCssText = 'position: absolute;height: 37px;width:100px;line-height: 37px;top: 40px;left: 0px;z-index: 999;background-color: #fdafad;color:white;padding: 0 10px;';
    const linkbCssText = 'position: absolute;height: 37px;width:100px;line-height: 37px;top: 40px;left: 100px;z-index: 999;background-color: #b6e3e9;color:white;padding: 0 10px;';
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4) {
                if (url.startsWith('https://www.jingshibang.com/api/product')) {
                    console.log('Request URL:', url);
                    try {
                        const response = JSON.parse(this.responseText);
                        if (response.data && response.data.storeInfo && response.data.storeInfo.pdf_answer) {
                            const pdfAnswer = response.data.storeInfo.pdf_answer;
                            const wordAnswer = response.data.storeInfo.word_answer;
                            const storeName = response.data.storeInfo.store_name;
                            const downloadUrl = `https://www.jingshibang.com/api/public/filedown?filepath=${encodeURIComponent(pdfAnswer)}`;
                            const divContainer = document.createElement('div');
                            divContainer.classList.add('download-link-container');
                            divContainer.textContent = storeName;
                            divContainer.style.cssText = containerCssText;
                            const linka = document.createElement('a');
                            linka.href = `https://www.jingshibang.com/api/public/filedown?filepath=${encodeURIComponent(pdfAnswer)}`;
                            linka.textContent = ('下载PDF');
                            linka.style.cssText = linkaCssText;
                            linka.target = '_blank';
                            divContainer.appendChild(linka);
                            const linkb = document.createElement('a');
                            linkb.href = `https://www.jingshibang.com/api/public/filedown?filepath=${encodeURIComponent(wordAnswer)}`;
                            linkb.textContent = ('下载Word');
                            linkb.style.cssText = linkbCssText;
                            linkb.target = '_blank';
                            divContainer.appendChild(linkb);
                            document.body.appendChild(divContainer);
                        } else {
                            console.log('PDF Answer not found in the response');
                        }
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                    }
                }
            }
        }, false);
        originalOpen.apply(this, arguments);
    };
})();