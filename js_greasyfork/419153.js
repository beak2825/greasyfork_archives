// ==UserScript==
// @name         后花园的蔷薇-黑沼泽的淤泥
// @namespace    GSHHHHHH
// @version      0.2
// @description  文章下载，地址页链接激活
// @author       PY-DNG
// @include      https://*houhuayuan*
// @include      https://*zhaoze*
// @include      https://doll-houhuayuan.github.io/latest_address/
// @connect      doll-houhuayuan.github.io
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/419153/%E5%90%8E%E8%8A%B1%E5%9B%AD%E7%9A%84%E8%94%B7%E8%96%87-%E9%BB%91%E6%B2%BC%E6%B3%BD%E7%9A%84%E6%B7%A4%E6%B3%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/419153/%E5%90%8E%E8%8A%B1%E5%9B%AD%E7%9A%84%E8%94%B7%E8%96%87-%E9%BB%91%E6%B2%BC%E6%B3%BD%E7%9A%84%E6%B7%A4%E6%B3%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /******************** User Consts | 用户可修改区 *********************/
    /**/ // 开发者模式，是否输出调试信息
    /**/ const developer = false;
    /**/
    /**/ // 首次使用时用于识别页面
    /**/ const 蔷薇后花园默认地址 = 'https://houhuayuan.art/';
    /**/ const 黑沼泽俱乐部默认地址 = 'https://zhaoze.icu/';
    /***************** User Consts End | 用户可修改区结束 *****************/

    // Consts
    const TEXT_COPY_TIP = '双击复制本章内容';
    const TEXT_ADDRESS_TIP = '以上工作已经自动完成';
    const URL_HOST_ADDRESS = 'https://doll-houhuayuan.github.io/';
    const URL_API_ADDRESS = 'latest_address';

    // Locate page
    const HOST = location.href.match(/.+?\/{2,}.+?\//)[0];
    const API = location.href.replace(HOST, '').replace(/(\?.+|\/)$/, '');

    // Address update once a day, other cases use URL from local data. If no data found, use default.
    let zhaozeURL = GM_getValue('zhaozeURL', '');
    let huayuanURL = GM_getValue('huayuanURL', '');
    const d = new Date();
    const fulltime = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
    if(GM_getValue('timeUpdated', '') !== fulltime || !zhaozeURL || !huayuanURL) {getLatestAddress();};
    if(!zhaozeURL) {zhaozeURL = 黑沼泽俱乐部默认地址;};
    if(!huayuanURL) {huayuanURL = 蔷薇后花园默认地址;};

    // Address page
    if (HOST === URL_HOST_ADDRESS && API === URL_API_ADDRESS) {pageAddress();};

    // Article page
    if ([zhaozeURL, huayuanURL].includes(HOST) && API.match('tag/|signup') === null) {pageArticle();};

    // Function: Saving URLs
    function saveURLs() {
        const d = new Date();
        const fulltime = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
        GM_setValue('zhaozeURL', zhaozeURL);
        GM_setValue('huayuanURL', huayuanURL);
        GM_setValue('timeUpdated', fulltime);
    }

    // Page Function: latest_address
    function pageAddress() {
        const qwElement = document.querySelector('#蔷薇后花园 + p');
        const zzElement = document.querySelector('#黑沼泽俱乐部 + p');

        // Update URL
        huayuanURL = qwElement.innerHTML.replace(/censor:/ig, 'https://').replace(/-/ig, '.').replace(/\/?$/, '/');
        zhaozeURL = zzElement.innerHTML.replace(/censor:/ig, 'https://').replace(/-/ig, '.').replace(/\/?$/, '/');
        saveURLs();

        // Address autocorrect
        qwElement.innerHTML = qwElement.innerHTML.replace(/(.+)/, '<a href="{URL}" target="_blank">{URL}</a>'.replaceAll('{URL}', huayuanURL));
        zzElement.innerHTML = zzElement.innerHTML.replace(/(.+)/, '<a href="{URL}" target="_blank">{URL}</a>'.replaceAll('{URL}', zhaozeURL));

        // Announcement
        const announceBoard = document.querySelector('#说明 + ol');
        const lis = announceBoard.querySelectorAll('li');
        const newli = lis[0].cloneNode(true);
        newli.innerText = TEXT_ADDRESS_TIP;
        announceBoard.insertBefore(newli, lis[lis.length-1]);
        console.log(announceBoard, newli);
    }

    // Page Function: article
    function pageArticle() {
        let pageContent = getCurPageContent();
        initGUI();

        // Function: GUI initialization
        function initGUI() {
            const titleElement = document.querySelector('.entry-title');

            // Copy content while clicking on title
            titleElement.title = TEXT_COPY_TIP;
            titleElement.addEventListener('dblclick', copyCurPageContent);
        }

        // Function: Get current page text content
        function getCurPageContent() {
            let allContentPs, i = 0;
            while (!allContentPs || allContentPs.length === 0) {
                i++;
                allContentPs = document.querySelectorAll('div.entry-content:nth-child(' + String(i) + ') > p');
            }
            let content = '';
            for (i = 0; i < allContentPs.length; i++) {
                // ads? Bye-bye | 不是正文？N·M·S·L
                if (allContentPs[i].classList.length !== 0) {continue;};
                content += '\r\n' + allContentPs[i].innerText.replaceAll(/<>/ig)
            }
            return content;
        }

        // Function: Copy current page text content
        function copyCurPageContent() {
            // Get if we don't have pageContent yet
            if ([undefined, ''].includes(pageContent)) {
                let pageContent = getCurPageContent();
            }

            // Copy to clipboard
            copyText(pageContent);
        }
    }

    // Function: Get latest address
    function getLatestAddress() {
        GM_xmlhttpRequest({
            method : 'GET',
            url : URL_HOST_ADDRESS + URL_API_ADDRESS + '/',
            responseType : 'text',
            onload : function(request) {
                const HTML = request.responseText;
                zhaozeURL = HTML.match(/<h2 id="黑沼泽俱乐部">黑沼泽俱乐部<\/h2>\s*?<p>(.+?)<\/p>/i)[1].replace('censor:', 'https://').replace(/\/?$/, '/').replace('-', '.'),
                huayuanURL = HTML.match(/<h2 id="蔷薇后花园">蔷薇后花园<\/h2>\s*?<p>(.+?)<\/p>/i)[1].replace('censor:', 'https://').replace(/\/?$/, '/').replace('-', '.')
                saveURLs();
    	    }
        })
    }

    // Function: Copy text to clipboard
    function copyText(text) {
        // Create a new input for copying
        const newInput = document.createElement('textarea');
        document.body.appendChild(newInput);
        newInput.value = text;
        newInput.select();
        document.execCommand('copy');
        document.body.removeChild(newInput);
    }

    // Function: Download file
    function fileDownload(fileURL, fileName) {
        GM_xmlhttpRequest({
            method : 'GET',
            url : fileURL,
            responseType : 'blob',
            onload : function(request) {
                const blobURL = URL.createObjectURL(request.response);
                const a = document.createElement('a');
                a.href = blobURL;
                a.download = fileName;
                a.click();
    	    }
        })
    }
})();