// ==UserScript==
// @name         dmhy-torrent-auto-rename
// @name:zh-CN   动漫花园种子自动重命名
// @description  auto rename torrent for dmhy
// @description:zh-CN 自动将动漫花园的会员专用链接所指向的文件文件名改为标题名
// @match        *://dmhy.org/topics/view/*
// @match        *://www.dmhy.org/topics/view/*
// @match        *://share.dmhy.org/topics/view/*
// @author       菜姬
// @version      0.5
// @namespace    https://greasyfork.org/users/171607
// @grant        GM_xmlhttpRequest
// @connect      dmhy.org
// @license      GPL version 3
// @encoding     utf-8
// @downloadURL https://update.greasyfork.org/scripts/38742/dmhy-torrent-auto-rename.user.js
// @updateURL https://update.greasyfork.org/scripts/38742/dmhy-torrent-auto-rename.meta.js
// ==/UserScript==
(function () {
    const ensureProtocol = (url) => {
        if (url.startsWith('//')) {
            const protocol = window.location.protocol;
            return protocol + url;
        }
        return url;
    };

    const urlblock = document.querySelector('#tabs-1 > p:nth-child(1) > a');
    const url = ensureProtocol(urlblock.href);
    const filename = urlblock.textContent + ".torrent";
    urlblock.onclick = (e) => {
        e.preventDefault();
        GM_xmlhttpRequest({
            method: "get",
            url: url,
            responseType: "arraybuffer",
            onload: function (r) {
                const blob = new Blob([r.response], { type: "application/octet-stream" });
                const anchor = document.createElement("a");
                anchor.href = URL.createObjectURL(blob);
                anchor.download = filename;
                anchor.style.display = "none";
                document.body.append(anchor);
                anchor.click();
                setTimeout(() => {
                    document.body.removeChild(anchor);
                    URL.revokeObjectURL(anchor.href);
                }, 0);
            }
        });
    };
})();