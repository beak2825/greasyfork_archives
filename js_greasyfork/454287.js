// ==UserScript==
// @name         XVIDEOS M3U8视频地址获取
// @namespace    www.xvideos.com.video
// @version      0.1
// @description  自动显示M3U8文件下载按钮
// @author       You
// @match        https://www.xvideos.com/video*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xvideos.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454287/XVIDEOS%20M3U8%E8%A7%86%E9%A2%91%E5%9C%B0%E5%9D%80%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/454287/XVIDEOS%20M3U8%E8%A7%86%E9%A2%91%E5%9C%B0%E5%9D%80%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var url_hls = html5player.url_hls
    $.get(url_hls, function (data) {
        data = data.split('#EXT-X-STREAM-INF')
        data.splice(0, 1)
        var html = ''
        data.forEach(item => {
            var name = /NAME="(.*?)"/.exec(item)[1]
            var url = (html5player.url_hls + '#').replace(/hls.m3u8.*#/, /\n(hls-.*)\n?/.exec(item)[1])
            html += `<a style="margin-right: 20px; padding: 5px 10px; border: 1px solid;" href="${url}">${name}</a>`
        })
        $('#video-tabs').append(`<div style="margin-bottom: 10px; margin-top: 10px; font-size: 20px;">M3U8视频地址 (右键复制)：${html}</div>`)
    })

})();
