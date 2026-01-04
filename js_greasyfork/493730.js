// ==UserScript==
// @name         also an Arxiv Tiny Tool
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Based on Arxiv Tiny Tool. Fix download and rename function through downloading with blob.
// @description:zh-CN  基于Arxiv Tiny Tool 修改. 使用blob下载以自动重命名.
// @author       hiboy & ChatGPT & Chris
// @match        *://arxiv.org/*
// @match        *://cn.arxiv.org/*
// @match        *://xxx.itp.ac.cn/*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://arxiv.org&size=64
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
//  @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/493730/also%20an%20Arxiv%20Tiny%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/493730/also%20an%20Arxiv%20Tiny%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var newTitle = '';
    const paperId = window.location.pathname.match(/\/(\d+\.\d+)/)[1];

    function getCurrentTime() {
        const now = new Date();
        const hour = now.getHours().toString().padStart(2, '0');
        const minute = now.getMinutes().toString().padStart(2, '0');
        const second = now.getSeconds().toString().padStart(2, '0');
        const millisecond = now.getMilliseconds().toString().padStart(3, '0');
        return `${hour}:${minute}:${second}.${millisecond}`;
    }


    function modifyTitle() {

        var apiUrl = 'https://export.arxiv.org/api/query?id_list=' + paperId;
        var maxUpdateMinute = 5;

        // 定时器，初始时间间隔
        let intervalTime = 1000;

        let intervalId = setInterval(updateTabTitle, intervalTime);
        function updateTabTitle() {

            if (!newTitle) {
                console.log('Fetching paper title for ' + paperId);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: apiUrl,
                    onload: function(response) {
                        var parser = new DOMParser();
                        var xmlDoc = parser.parseFromString(response.responseText, 'text/xml');
                        var title = xmlDoc.querySelector('entry>title').textContent;
                        newTitle = '[' + paperId + '] ' + title;
                        console.log(`[${getCurrentTime()}]`,'Title modified for ' + newTitle);
                    }
                });
            } else {
                console.log(`[${getCurrentTime()}]`,'set title to', newTitle);
                document.title = '';
                document.title = newTitle;
            }

            clearInterval(intervalId);

            // 每执行一次翻倍间隔时间
            intervalTime *= 2;
            // 如果间隔时间在maxUpdateMinute分钟内，则设置新的定时器
            if (intervalTime < maxUpdateMinute * 60 * 1000) {
                intervalId = setInterval(updateTabTitle, intervalTime);
            }
        }

    }

    function createArxivButton() {
        var btn = document.createElement("button");
        btn.setAttribute('style', 'position:absolute;' +
                         'z-index:1000;' +
                         'right:135px;' +
                         'top:12px;' +
                         'height:36px;' +
                         'padding:5px 10px;' +
                         'background-color:#323639;' +
                         'border-radius:50%;' +
                         'border:none;' +
                         'color:#ffffff;' +
                         'font-size:16px;' +
                         'font-weight:500;' +
                         'text-transform:uppercase;' +
                         'letter-spacing:0.5px;' +
                         'text-align:center;' +
                         'vehical-align: middle;' +
                         'cursor:pointer;' +
                         // 'box-shadow:0px 2px 4px rgba(0,0,0,0.25);' +
                         'transition:background-color 0.2s ease-in-out,box-shadow 0.2s ease-in-out;' +
                         ':hover{background-color:#1b1d1f;rgba(0,0,0,0.5);}');
        btn.setAttribute('id', "btn");
        btn.innerText = "arixv";
        btn.onclick = function() {
            var home_url = `https://arxiv.org/abs/${paperId}`;
            window.open(home_url);
        };
        btn.onmouseover = function() {
            this.style.backgroundColor = "#424649";
        };
        btn.onmouseout = function() {
            this.style.backgroundColor = "#323639";
        };
        document.body.appendChild(btn);

    }
    function openPdfInNewTab() {
        // assume the first link is pdf
        var pdfLink = document.querySelector('.full-text ul li a');
        pdfLink.target = "_blank";
    }

    function addCnPdfLink() {
        // Get the PDF download link
        const pdfLink = document.querySelector('.abs-button.download-pdf');

        if (pdfLink){
            // Construct cnPDF download link
            const cnPDFLink = `http://xxx.itp.ac.cn/pdf/${paperId}.pdf`;

            // Insert cnPDF download link after the PDF download link
            const newLinkHTML = `<li><a href="${cnPDFLink}" class="abs-button download-cnPDF" target="_blank">PDF(cn)</a></li>`;
            pdfLink.insertAdjacentHTML('afterend', newLinkHTML);
            console.log("[arxiv-cnPDF] Link added successfully");
        }
    }

    function addHtml5Link() {
        // Get the PDF download link
        var pdfLink = document.querySelector('.full-text ul li');
        if (pdfLink){
            // Construct HTML5 download link
            const newLink = window.location.href.replace('arxiv','ar5iv');

            // Insert HTML5 download link before the PDF download link
            const newLinkHTML = `<li><a href="${newLink}" class="abs-button html5" target="_blank">HTML5</a></li>`;
            pdfLink.insertAdjacentHTML('beforebegin', newLinkHTML);
            console.log("[arxiv-HTML5] Link added successfully");
        }
    }
    
    // 下载url(解决跨域a.download不生效问题)
    function downloadFile(url, fileName) {
        const x = new XMLHttpRequest()
        x.open("GET", url, true)
        x.responseType = 'blob'
        x.onload = function(e) {
          const url = window.URL.createObjectURL(x.response)
          const a = document.createElement('a')
          a.href = url
          a.target = '_blank'
          a.download = fileName
          a.click()
          a.remove()
        }
        x.send()
    }

    function addDownloadLink() {
        // Get the PDF download link
        var pdfLink = document.querySelector('.full-text ul li');
        if (pdfLink){
            const title = document.getElementsByClassName("title mathjax")[0].innerText;
            const yearMeta = document.querySelector('meta[name="citation_date"]');
            const year = yearMeta.getAttribute('content').split('/')[0];
            const filename = title + " " + paperId + ".pdf";
            var download_url = window.location.href.replace('/abs/','/pdf/');
            var link = document.createElement("button");
            link.id = "rename_download";
            link.textContent = "Download Renamed PDF";
            // link.setAttribute("href", download_url);
            // link.setAttribute("download", filename);
            link.onclick = function() {
                downloadFile(download_url, filename);
              };

            var li = document.createElement("li");
            li.append(link);
            pdfLink.append(li);
            console.log("[arxiv-download] Link added successfully");
        }
    }

    console.log('Script started');
    if (window.location.href.indexOf('/pdf/') !== -1) {
        createArxivButton();
        modifyTitle();
    } else if (window.location.href.indexOf('/abs/') !== -1) {
        openPdfInNewTab();
        addDownloadLink();
        addCnPdfLink();
        addHtml5Link();
    }

})();

