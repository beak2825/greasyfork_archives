// ==UserScript==
// @name         DICMusic Unchecked
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  自动打开未检查的专辑链接
// @match        https://dicmusic.com/torrents.php*
// @exclude      https://dicmusic.com/torrents.php?id=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525947/DICMusic%20Unchecked.user.js
// @updateURL https://update.greasyfork.org/scripts/525947/DICMusic%20Unchecked.meta.js
// ==/UserScript==

// 用户配置 - 设置一次性打开的最大链接数量 (0 表示不限制)
const MAX_LINKS = 20;

(function() {
    'use strict';

    function isUserUploadedList() {
        const params = new URLSearchParams(window.location.search);
        return params.has('type') && params.get('type') === 'uploaded' && params.has('userid');
    }

    function collectTorrentGroups() {
        return Array.from(document.querySelectorAll('tr.group:not(.torrent_all_checked) a[href^="torrents.php?id="]'))
            .map(link => 'https://dicmusic.com/' + link.getAttribute('href'));
    }

    function collectUserUploadedGroups() {
        const links = new Set(); // 使用 Set 来自动去重
        document.querySelectorAll('div.group_info.clear').forEach(div => {
            // 寻找未检查状态图标
            const uncheckedIcon = div.querySelector('i.far.fa-circle');
            if (!uncheckedIcon) return;

            // 查找链接
            const tooltipLink = div.querySelector('a.tooltip[dir="ltr"][href^="torrents"]');
            if (tooltipLink) {
                // 获取原始链接（PL）
                const href = tooltipLink.getAttribute('href');
                // 只保留 id 参数（Torrent Group）
                const match = href.match(/torrents\.php\?id=\d+/);
                if (match) {
                    links.add('https://dicmusic.com/' + match[0]);
                }
            }
        });
        return Array.from(links); // 转换回数组
    }

    function init() {
        const statsPanel = document.querySelector('.alertbar.blend');
        if (!statsPanel) return;

        const button = document.createElement('a');
        button.textContent = 'Open Unchecked';
        button.href = 'javascript:void(0);';
        button.style.marginLeft = '10px';

        statsPanel.appendChild(button);

        button.addEventListener('click', function() {
            let albumLinks;
            if (isUserUploadedList()) {
                albumLinks = collectUserUploadedGroups();
            } else {
                albumLinks = collectTorrentGroups();
            }

            const linksToOpen = MAX_LINKS > 0 ? albumLinks.slice(0, MAX_LINKS) : albumLinks;

            if (MAX_LINKS > 0 && albumLinks.length > MAX_LINKS) {
                alert(`已设置最大打开链接数为 ${MAX_LINKS}\n找到 ${albumLinks.length} 个链接，将只打开前 ${MAX_LINKS} 个\n处理完成后按需刷新本页面以更新checked状态`);
            }

            linksToOpen.forEach(url => window.open(url, '_blank'));
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();