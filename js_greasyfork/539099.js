// ==UserScript==
// @name         TONG-彼岸图网4K抓取
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  彼岸图网图片批量下载，现代美化GUI，支持暂停/继续
// @author       tong
// @match        https://pic.netbian.com/*
// @grant        none
// @license      MTT
// @downloadURL https://update.greasyfork.org/scripts/539099/TONG-%E5%BD%BC%E5%B2%B8%E5%9B%BE%E7%BD%914K%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/539099/TONG-%E5%BD%BC%E5%B2%B8%E5%9B%BE%E7%BD%914K%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局状态
    let isStopped = false;
    let currentIndex = 0;
    let allDetailUrls = [];
    let category = '';
    let pageCount = 0;

    // ====== 创建美化GUI界面 ======
    function createGUI() {
        if (document.getElementById('bian-crawler-gui')) return;

        const gui = document.createElement('div');
        gui.id = 'bian-crawler-gui';
        gui.style.position = 'fixed';
        gui.style.top = '40px';
        gui.style.right = '40px';
        gui.style.zIndex = 999999999;
        gui.style.background = 'rgba(255,255,255,0.98)';
        gui.style.border = '2px solid #4a90e2';
        gui.style.borderRadius = '18px';
        gui.style.boxShadow = '0 8px 32px 0 rgba(74,144,226,0.25), 0 1.5px 8px #aaa';
        gui.style.padding = '36px 44px 28px 44px';
        gui.style.fontSize = '20px';
        gui.style.color = '#222';
        gui.style.width = '420px';
        gui.style.userSelect = 'none';
        gui.style.pointerEvents = 'auto';

        gui.innerHTML = `
            <div style="font-weight:bold;font-size:28px;margin-bottom:18px;color:#357ae8;letter-spacing:1px;text-align:center;">
                彼岸图网4K图片批量下载
            </div>
            <div style="margin-bottom:18px;">
                <label>分类字段：</label>
                <input id="bian-category" type="text" value="4kdongman" style="width:180px;font-size:18px;padding:4px 8px;border-radius:6px;border:1.5px solid #b0c4de;">
            </div>
            <div style="margin-bottom:18px;">
                <label>爬取页数：</label>
                <input id="bian-pagecount" type="number" value="2" min="1" style="width:80px;font-size:18px;padding:4px 8px;border-radius:6px;border:1.5px solid #b0c4de;">
            </div>
            <button id="bian-start" style="
                background: linear-gradient(90deg,#4a90e2 0%,#357ae8 100%);
                color: #fff;
                font-size: 20px;
                border: none;
                border-radius: 8px;
                padding: 10px 36px;
                margin-right: 18px;
                cursor: pointer;
                box-shadow: 0 2px 8px #b0c4de;
                transition: background 0.2s;
            ">开始爬取</button>
            <button id="bian-stop" style="
                background: #fff;
                color: #e23c3c;
                font-size: 20px;
                border: 2px solid #e23c3c;
                border-radius: 8px;
                padding: 10px 24px;
                margin-right: 18px;
                cursor: pointer;
                transition: background 0.2s;
            ">停止</button>
            <button id="bian-close" style="
                background: #fff;
                color: #357ae8;
                font-size: 20px;
                border: 2px solid #4a90e2;
                border-radius: 8px;
                padding: 10px 24px;
                cursor: pointer;
                transition: background 0.2s;
            ">关闭</button>
            <div id="bian-status" style="margin-top:18px;color:#007b00;font-size:17px;min-height:28px;"></div>
            <div style="margin-top:10px;color:#e23c3c;font-size:14px;">首次批量下载时请允许浏览器自动下载多个文件</div>
        `;
        document.body.appendChild(gui);

        gui.addEventListener('mousedown', function(e) {
            gui.style.zIndex = 999999999;
        });

        document.getElementById('bian-close').onclick = () => gui.remove();
        document.getElementById('bian-start').onclick = startCrawl;
        document.getElementById('bian-stop').onclick = stopCrawl;
    }

    // ====== 停止按钮逻辑 ======
    function stopCrawl() {
        isStopped = true;
        const statusDiv = document.getElementById('bian-status');
        statusDiv.textContent = '已停止，点击“开始爬取”可继续。';
    }

    // ====== 主爬取逻辑 ======
    async function startCrawl() {
        const statusDiv = document.getElementById('bian-status');
        // 如果是继续任务
        if (allDetailUrls.length > 0 && isStopped && currentIndex < allDetailUrls.length) {
            isStopped = false;
            statusDiv.textContent = '继续爬取...';
            await downloadImages();
            return;
        }

        // 否则为新任务
        category = document.getElementById('bian-category').value.trim();
        pageCount = parseInt(document.getElementById('bian-pagecount').value.trim());
        if (!category) {
            statusDiv.textContent = '请填写分类字段！';
            return;
        }
        if (!pageCount || pageCount < 1) {
            statusDiv.textContent = '请填写有效的页数！';
            return;
        }

        isStopped = false;
        currentIndex = 0;
        allDetailUrls = [];

        statusDiv.textContent = '开始爬取...';

        for (let page = 1; page <= pageCount; page++) {
            if (isStopped) {
                statusDiv.textContent = '已停止，点击“开始爬取”可继续。';
                return;
            }
            statusDiv.textContent = `正在获取第${page}页的图片详情链接...`;
            let url = page === 1
                ? `https://pic.netbian.com/${category}/index.html`
                : `https://pic.netbian.com/${category}/index_${page}.html`;
            let resp = await fetch(url, {credentials: 'include'});
            let text = await resp.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(text, 'text/html');
            let links = Array.from(doc.querySelectorAll("ul.clearfix li a"))
                .map(a => a.getAttribute('href'));
            allDetailUrls.push(...links);
        }

        statusDiv.textContent = `共获取到${allDetailUrls.length}个详情页链接，开始下载图片...`;
        await downloadImages();
    }

    // ====== 下载图片逻辑（支持断点续传）======
    async function downloadImages() {
        const statusDiv = document.getElementById('bian-status');
        for (; currentIndex < allDetailUrls.length; currentIndex++) {
            if (isStopped) {
                statusDiv.textContent = '已停止，点击“开始爬取”可继续。';
                return;
            }
            let detailUrl = allDetailUrls[currentIndex];
            let imgUrl = await getImageUrl(detailUrl);
            if (imgUrl) {
                let filename = `pic_${currentIndex + 1}.jpg`;
                statusDiv.textContent = `正在下载第${currentIndex + 1}张图片...`;
                downloadImage(imgUrl, filename);
                await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));
            }
        }
        statusDiv.textContent = '下载完成！';
        alert('下载完成！');
        // 重置状态
        allDetailUrls = [];
        currentIndex = 0;
    }

    // 获取大图URL
    async function getImageUrl(detailUrl) {
        let url = 'https://pic.netbian.com' + detailUrl;
        let resp = await fetch(url, {credentials: 'include'});
        let text = await resp.text();
        let parser = new DOMParser();
        let doc = parser.parseFromString(text, 'text/html');
        let img = doc.querySelector("div.photo-pic a img");
        return img ? 'https://pic.netbian.com' + img.getAttribute('src') : null;
    }

    // 下载图片
    function downloadImage(imgUrl, filename) {
        let a = document.createElement('a');
        a.href = imgUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // ====== 页面加载后自动插入GUI ======
    setTimeout(createGUI, 1000);

    // 保证GUI始终在最顶层
    const observer = new MutationObserver(() => {
        const gui = document.getElementById('bian-crawler-gui');
        if (gui) gui.style.zIndex = 999999999;
    });
    observer.observe(document.body, {childList: true, subtree: true});
})();