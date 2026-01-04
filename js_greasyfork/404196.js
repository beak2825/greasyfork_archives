// ==UserScript==
// @name         动漫花园列表页增强
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  列表页下载种子+批量复制种子/磁链链接
// @author       菜姬
// @match        *://dmhy.org/
// @match        *://dmhy.org/topics/list*
// @match        *://www.dmhy.org/
// @match        *://www.dmhy.org/topics/list*
// @match        *://share.dmhy.org/
// @match        *://share.dmhy.org/topics/list*
// @grant        GM_xmlhttpRequest
// @connect      dmhy.org
// @downloadURL https://update.greasyfork.org/scripts/404196/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E5%88%97%E8%A1%A8%E9%A1%B5%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/404196/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E5%88%97%E8%A1%A8%E9%A1%B5%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ensureProtocol = (url) => {
        if (url.startsWith('//')) {
            const protocol = window.location.protocol;
            return protocol + url;
        }
        return url;
    };

    const downloadFile = (url, filename) => {
        GM_xmlhttpRequest({
            method: "get",
            url: url,
            timeout: 5000,
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

    const reflush = () => {
        if (!changeToTorrentLink) {
            document.querySelectorAll('a.arrow-magnet').forEach((item, index, arr) => {
                item.title = '磁力下載';
                item.onclick = null;
            });
        }
        else {
            document.querySelectorAll('a.arrow-magnet').forEach((item, index, arr) => {
                item.title = '下載種子';
                item.onclick = (e) => {
                    e.preventDefault();
                    const link = item.parentElement.previousElementSibling.querySelector("td>a");
                    GM_xmlhttpRequest({
                        method: "get",
                        url: link.href,
                        responseType: "text",
                        onload: function (r) {
                            const html = r.response;
                            const match = html.match(/<a href="(.+?dl\.dmhy\.org\/[^"]+)">(.+?)<\/a>/);
                            const url = ensureProtocol(match[1]);
                            const filename = match[2] + ".torrent";
                            downloadFile(url, filename);
                        }
                    });
                };
            });
        }
    };

    let changeToTorrentLink = localStorage.changeToTorrentLink === "true";

    {
        const row4 = document.querySelector('#topic_list > thead > tr > th:nth-child(4) > span');
        row4.onclick = (e) => {
            changeToTorrentLink = !changeToTorrentLink;
            localStorage.changeToTorrentLink = changeToTorrentLink;
            e.target.textContent = changeToTorrentLink ? "種子" : "磁鏈";
            reflush();
        };
        reflush();
        row4.textContent = changeToTorrentLink ? "種子" : "磁鏈";
        const row6 = document.querySelector('#topic_list > thead > tr > th:nth-child(6) > span');
        row6.textContent = "做種";
    }

    {
        const copyAllButton = document.createElement('a');
        copyAllButton.href = "javascript:;";
        copyAllButton.textContent = "複製全部";
        copyAllButton.onclick = (e) => {
            const text = [];
            document.querySelectorAll('a.arrow-magnet').forEach((item, index, arr) => {
                if (changeToTorrentLink) {
                    const link = item.parentElement.previousElementSibling.querySelector("td>a");
                    GM_xmlhttpRequest({
                        method: "get",
                        url: link.href,
                        timeout: 5000,
                        responseType: "text",
                        onload: function (r) {
                            const html = r.response;
                            const match = html.match(/<a href="(.+?dl\.dmhy\.org\/[^"]+)">(.+?)<\/a>/);
                            const url = ensureProtocol(match[1]);
                            text.push(url);
                        }
                    });
                }
                else {
                    text.push(item.href);
                }
            });
            window.navigator.clipboard.writeText(text.join('\n')).then(() => {
                alert('複製成功');
            }, (e) => {
                console.error(e);
            })
        };
        document.querySelector('div.nav_title > div.fr').appendChild(copyAllButton);
    };
})();