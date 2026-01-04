// ==UserScript==
// @name         小狐狸/橘猫
// @version      0.5.4
// @description  破解小狐狸/橘猫VIP
// @namespace    血小板
// @license      MIT
// @include      https://*.cyou/
// @include      https://*.xyz/
// @include      https://*.shop/
// @match        https://xgm.jmmae.xyz/
// @match        https://xme.jmmcc.xyz/
// @include      https://o61e.judoegg.com/*
// @downloadURL https://update.greasyfork.org/scripts/492981/%E5%B0%8F%E7%8B%90%E7%8B%B8%E6%A9%98%E7%8C%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/492981/%E5%B0%8F%E7%8B%90%E7%8B%B8%E6%A9%98%E7%8C%AB.meta.js
// ==/UserScript==

(function() {
    // 小狐狸网址: http://yj.yjdz240001.cyou:7773
    // 橘猫网址: https://xgm.jmmae.xyz/ 或 https://xme.jmmcc.xyz/
    // 将m3u8复制到以下网址观看视频: https://m3u8-video-player.pages.dev/#video_url=
    // 将m3u8复制到以下网址下载视频: https://tools.thatwind.com/tool/m3u8downloader
    let last = "";
    setInterval(() => {
        if (location.href != last)
            // 小狐狸(兼容PC/手机版)
            if (location.href.match("https://.*?/#/.*?videoInfo") != null) {
                last = location.href; // 避免倒退时进入跳转循环
                setTimeout (() => {
                    try {
                        // let a = document.getElementsByClassName("subjectBox")[0].firstChild.children[2].children[1].style.backgroundImage.substring(31,48);
                        let urlData = document.getElementsByClassName("userLoginInfoBox")[0].parentElement.parentElement.style.backgroundImage;
                        let urlAt = 0;
                        while (urlData.substring(urlAt, urlAt + 3) != "/20") urlAt++;
                        let a = urlData.substring(urlAt + 1, urlAt + 18);
                        // location.replace("https://m3u8-video-player.pages.dev/#video_url=https://byym304.cyou/" + a + "/index.m3u8");
                        location.replace("https://m3u8-video-player.pages.dev/#video_url=" + urlData.substring(5, urlAt + 18) + "/index.m3u8");
                        // ptsp.byym24095.cyou, byym308.cyou, sy.byym24104.cyou
                    } catch {}
                }, 800);
            }
            // 橘猫(兼容PC/手机版)
            else if (location.href.match("https://xgm.jmmae.xyz/#/.*?videoInfo") != null || location.href.match("https://xme.jmmcc.xyz/#/.*?videoInfo") != null) {
                last = location.href; // 避免倒退时进入跳转循环
                let timeId = last.substring(last.search("videoId=") + 8);
                let dataUrl = last.substring(0, 21) + "/view/getLikeVideoList/" + timeId + "/";
                for(let i = 1; i < 5; i++) // 其他页
                    fetch(dataUrl+i,{method: 'POST',headers: new Headers(),redirect: 'follow'}) // 重新访问获取数据
                        .then(response => response.json())
                        .then(data => {
                        let idAt = data.search(timeId);
                        if (idAt<0) return; // 下一页
                        let urlAt = data.substring(idAt-270,idAt).search("playUrl") + idAt - 270 + 10;
                        let urlEnd = data.substring(urlAt,idAt).search("m3u8") + urlAt + 4;
                        location.replace("https://m3u8-video-player.pages.dev/#video_url=" + data.substring(urlAt,urlEnd));
                        i = 100; // 跳出循环
                    })
                        .catch(error => console.error('Error fetching data:', error));
            }
            // 91国产呦呦
            else if (location.href.match("https://.*?.judoegg.com/vid") != null || location.href.match("https://xme.jmmcc.xyz/#/.*?videoInfo") != null) {
                last = location.href; // 避免倒退时进入跳转循环
                try {
                    location.replace("https://o61e.judoegg.com" + m3u8_url);
                    // location.replace("https://m3u8-video-player.pages.dev/#video_url=https://o61e.judoegg.com" + m3u8_url);
                } catch {}
            }
    }, 2000);
})();