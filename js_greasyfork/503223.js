// ==UserScript==
// @name         eh磁力链点击助手
// @namespace    com.xioxin.EhTagMagnetHelper
// @version      0.1
// @description  在种子列表点击磁力链下载
// @author       Wei Zong
// @match        *://exhentai.org/gallerytorrents.php*
// @match        *://e-hentai.org/gallerytorrents.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503223/eh%E7%A3%81%E5%8A%9B%E9%93%BE%E7%82%B9%E5%87%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/503223/eh%E7%A3%81%E5%8A%9B%E9%93%BE%E7%82%B9%E5%87%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    const tableList = document.querySelectorAll("#torrentinfo form table");
    if (tableList && tableList.length) {
        tableList.forEach((table) => {
            const href = table.querySelector('a')?.href;
            if (!href) return;
            const magnet = href.replace(/.*?([0-9a-f]{40}).*$/i,"magnet:?xt=urn:btih:$1");
            if (magnet.length != 60) return;

            // 创建新的磁链超链接元素
            const magnetLink = document.createElement('a');
            magnetLink.href = magnet;
            magnetLink.textContent = magnet;
            magnetLink.style.display = 'block'; // 使链接显示在新行
            magnetLink.style.marginTop = '5px'; // 添加一些间距

            // 将新元素插入到原链接的下方
            table.querySelector('a').parentNode.appendChild(magnetLink);
        });
    }
})();
