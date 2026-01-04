// ==UserScript==
// @name        圖片下載器
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description 使用右鍵菜單下載不同網站的圖片
// @match       *://*.x.com/*
// @match       *://*.bilibili.com/*
// @match       *://*.miyoushe.com/*
// @match       *://*.hoyolab.com/*
// @match       *://*.google.com/books/reader*
// @match       *://*.kuwo.cn/play_detail/*
// @grant       GM_download
// @grant       GM_registerMenuCommand
// @run-at      document-start
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/542665/%E5%9C%96%E7%89%87%E4%B8%8B%E8%BC%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542665/%E5%9C%96%E7%89%87%E4%B8%8B%E8%BC%89%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //解除米游社大圖檢視的兩層防護
    //(1) .img-mask               → 禁用 pointer-events
    //(2) img.viewer-move         → 恢復 pointer-events
    if (location.hostname.endsWith('miyoushe.com') || location.hostname.endsWith('hoyolab.com')) {
        const css = `
            /* 讓遮罩不再攔截滑鼠事件 */
            .viewer-canvas .img-mask{
                pointer-events: none !important;
            }
            /* 讓圖片重新能接收右鍵事件／選單 */
            .viewer-canvas img.viewer-move{
                pointer-events: auto !important;
                z-index: 10 !important;   /* 保險起見，放到遮罩之上 */
            }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.documentElement.appendChild(style);
    }

    let Main_imgUrl='None';
    let Main_fileName='None';

    // 解析圖片 URL 和文件名
    function getImageUrl(imgElement) {
        let imgUrl = imgElement.src.startsWith('http') ? imgElement.src : 'https:' + imgElement.src;

        // 如果 URL 包含 '@'，則刪除 '@' 後面的參數
        if (imgUrl.includes('@')) {
            imgUrl = imgUrl.split('@')[0];
        }

        return imgUrl;
    }

    // 註冊下載圖片的選項到系統右鍵菜單
    document.addEventListener('contextmenu', function(e) {
        console.log(`[圖片下載器] 右鍵點擊事件`);
        let img = e.target.closest('img'); // 尋找最近的 img 元素
        /* 若點到米游社的 .img-mask，往父節點找真正的 <img> */
        if (!img && e.target.classList.contains('img-mask')) {
            img = e.target.parentElement?.querySelector('img');
        }
        if (!img) return; // 點的不是圖片，直接跳過
        /* 若點到米游社的 .img-mask，往父節點找真正的 <img> */
        if (!img && e.target.classList.contains('img-mask')) {
            img = e.target.parentElement?.querySelector('img');
        }
        if (!img) return; // 點的不是圖片，直接跳過
        Main_imgUrl = getImageUrl(img);

        let host = window.location;
        if (host.hostname.includes('x.com')) {
            const tweetId = host.pathname.split('/')[3];
            Main_fileName = `X ${tweetId}.jpg`;
        } else if (host.hostname.includes('bilibili.com')) {
            const biliId = host.pathname.split('/')[2];
            Main_fileName = `bili ${biliId}${Main_imgUrl.slice(Main_imgUrl.lastIndexOf('.'))}`;
        } else if (host.hostname.includes('miyoushe.com')){
            const mysId = host.pathname.split('/')[3];
            Main_fileName = `mys ${mysId}${Main_imgUrl.slice(Main_imgUrl.lastIndexOf('.'))}`;
        } else if (host.hostname.includes('hoyolab.com')){
            const { origin,pathname } = new URL(Main_imgUrl);
            const filename = pathname.split('/').pop(); // 取最後一段檔名
            const parts = filename.split('.'); // 以點切開
            const hylabId = host.pathname.split('/')[2];
            Main_fileName = `hylab ${hylabId}.${parts[1]}`;
            Main_imgUrl = origin + pathname
        } else if (host.hostname.includes('kuwo.cn')){
            const kuwoId = host.pathname.split('/')[2] || 'unknown';
            Main_fileName = `kuwo ${kuwoId}${Main_imgUrl.slice(Main_imgUrl.lastIndexOf('.'))}`;
            const { origin, pathname } = new URL(Main_imgUrl);
            const hiResPath = pathname.replace(/albumcover\/\d+\//, 'albumcover/5000/');
            Main_imgUrl = origin + hiResPath;
        } else {
            Main_fileName = `A.jif`;
        }
        console.log(`[圖片下載器] 解析到的圖片 URL ${Main_imgUrl}`);
        console.log(`[圖片下載器] 名稱 ${Main_fileName}`);
    },{ capture: true });

    // 註冊菜單命令
    GM_registerMenuCommand("Download", function() {
        if(Main_imgUrl!='None' && Main_fileName!='None'){
            console.log(`[圖片下載器] 開始下載圖片`);
            GM_download({url: Main_imgUrl,name: Main_fileName,});
        }else{
            console.log(`[圖片下載器] 圖片解析失敗`);
        }
    });

})();
