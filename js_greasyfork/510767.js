// ==UserScript==
// @name         ResearchGate下载PDF
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  打开ResearchGate下载PDF页面
// @author       HuanZhi
// @match        https://www.researchgate.net/*
// @grant        unsafewindow
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/510767/ResearchGate%E4%B8%8B%E8%BD%BDPDF.user.js
// @updateURL https://update.greasyfork.org/scripts/510767/ResearchGate%E4%B8%8B%E8%BD%BDPDF.meta.js
// ==/UserScript==
(function(){
    //添加按钮显示
    AddDownloadButton()
}
)();

// 下载按钮
function AddDownloadButton(){
    var download_btn = document.createElement("button");
    download_btn.setAttribute('style', "position:absolute; z-index:1000; right:10px; top:55px; height:28px; background-color:#3E8CD0; border:none; color:white; font-size:16px; cursor:pointer; border-radius:1em;");
    download_btn.setAttribute('id', "download_btn");
    download_btn.textContent = '输入关键词';
    document.body.appendChild(download_btn);
    download_btn.onmouseover = function() {
        this.style.backgroundColor="#e9686b";
    };
    download_btn.onmouseout = function() {
        this.style.backgroundColor="#3E8CD0";
    };
    download_btn.onclick = startSearchQueue;
    
    // 监听滚动事件，更新按钮位置
    window.addEventListener('scroll', function() {
        // 更新按钮的top位置
        download_btn.style.top = window.pageYOffset + 55 + 'px';
    });
}

// Function to display the prompt and start the search
function startSearchQueue() {
        const keywords = prompt("输入关键词,windows格式换行分割:");
        if (keywords) {
            const keywordArray = keywords.split('\r\n').map(k => k.trim());
            
            // 循环遍历所有链接
            keywordArray.forEach(function(keyword) {
                // 新标签页打开链接
            window.open(`https://www.researchgate.net/search.Search.html?query=${keyword}&type=publication`, '_blank');

            });
        }
    }

