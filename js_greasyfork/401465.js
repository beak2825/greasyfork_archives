// ==UserScript==
// @name      使用Sayobot源下载Akatsuki网页的谱面
// @name:en      AkaSmoothDownloader
// @description  面向CN Akatsuki玩家的谱面镜像下载器, 支持sayobot源
// @description:en  Allow CN Akatsuki player downloads Beatmaps with Sayobot mirror site
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       TROU2004
// @include      *akatsuki.pw*
// @downloadURL https://update.greasyfork.org/scripts/401465/%E4%BD%BF%E7%94%A8Sayobot%E6%BA%90%E4%B8%8B%E8%BD%BDAkatsuki%E7%BD%91%E9%A1%B5%E7%9A%84%E8%B0%B1%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/401465/%E4%BD%BF%E7%94%A8Sayobot%E6%BA%90%E4%B8%8B%E8%BD%BDAkatsuki%E7%BD%91%E9%A1%B5%E7%9A%84%E8%B0%B1%E9%9D%A2.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", function(){
    let mainInterval = setInterval(function () {
        let href = window.location.href
        if (href.indexOf("akatsuki.pw/b/") != -1) {
            var dirLink = document.querySelector("body > div.ui.full.height.main.wrapper > div.h-container > div:nth-child(2) > div.ui.segments > div > div > div > div.full-centered.column > div > a.ui.pink.labeled.icon.button").href
            if (dirLink.indexOf("osu://dl/") != -1) {
                var bmsetid = dirLink.substring(dirLink.indexOf("dl/") + 3, dirLink.length)
                window.location.href = "https://txy1.sayobot.cn/beatmaps/download/novideo/" + bmsetid
                clearInterval(mainInterval)
            }
        }
    }, 200)
})