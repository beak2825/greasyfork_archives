// ==UserScript==
// @name         Arxiv Tiny Tool
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  add some userful link while open arxiv website and replace page title with paper title in arxiv pdf
// @description:zh-CN  在打arxiv页面添加了一些有用的链接，用论文的标题替换arxiv pdf 页面的标题
// @author       hiboy & ChatGPT
// @match        *://arxiv.org/*
// @match        *://cn.arxiv.org/*
// @match        *://xxx.itp.ac.cn/*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://arxiv.org&size=64
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466308/Arxiv%20Tiny%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/466308/Arxiv%20Tiny%20Tool.meta.js
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
    function insertLink(link, text){
        let ul = document.querySelector('div.full-text ul');

        if (ul){
            // Insert cnPDF download link after the PDF download link
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = link;
            a.textContent = text;
            li.appendChild(a);
            ul.insertBefore(li, ul.children[2]);
        }
    }

    function addCnPdfLink() {
        // Get the PDF download link
        // const pdfLink = document.querySelector('.abs-button.download-pdf');
        let a = document.querySelector('div.full-text ul li a.abs-button');
        const line = document.createTextNode(" | ");
        a.textContent = 'PDF';
        const a1 = a.cloneNode();
        a1.textContent = '国内';
        a1.href = `http://xxx.itp.ac.cn/pdf/${paperId}.pdf`
        a.parentNode.appendChild(line);
        a.parentNode.appendChild(a1);
        console.log("[arxiv-cnPDF] Link added successfully");
    }

    function addHtml5Link() {
        const newLink = window.location.href.replace('arxiv','ar5iv');
        insertLink(newLink, 'html5');
    }

    function addDownloadLink() {
        // Get the PDF download link
        var ul = document.querySelector('.full-text ul');
        if (ul){
            const title = document.getElementsByClassName("title mathjax")[0].innerText;
            const yearMeta = document.querySelector('meta[name="citation_date"]');
            const year = yearMeta.getAttribute('content').split('/')[0];
            const filename = title + " " + year + ".pdf";
            var download_url = window.location.href.replace('/abs/','/pdf/');
            if (!download_url.endsWith('.pdf')){
                download_url = download_url + '.pdf';
            }
            var link = document.createElement("a");
            link.id = "rename_download";
            link.textContent = "Download";
            link.href = download_url
            link.download = filename;

            var li = document.createElement("li");
            li.append(link);
            ul.insertBefore(li, ul.children[2]);
            console.log("[arxiv-download] Link added successfully");
        }
    }

    console.log('Script started');
    if (window.location.href.indexOf('/pdf/') !== -1) {
        createArxivButton();
        modifyTitle();
    } else if (window.location.href.indexOf('/abs/') !== -1) {
        // openPdfInNewTab();
        addDownloadLink();
        addHtml5Link();
        addCnPdfLink();

    }

})();
