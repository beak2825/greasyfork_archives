// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://cn.pornhubpremium.com/view_video.php*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/400147/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/400147/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let int = setInterval(()=>{
        if (window.quality_240p) {
            clearInterval(int);
            let url, quality;
            try {
                url = quality_240p;quality = "240p";
                url = quality_480p;quality = "480p";
                url = quality_720p;quality = "720p";
                url = quality_1080p;quality = "1080p";
                url = quality_1440p;quality = "1440p";
                url = quality_2160p;quality = "2160p";
            } catch (e) {
                console.log(url)
            }
            window.downloadRemote = async () => {
                let elem = document.querySelector("div.thumb").nextElementSibling.firstElementChild;
                console.log("Clicked!");
                await fetch("https://aria2.imlxy.net:6800/jsonrpc", {
                    method: "POST",
                    mode: "no-cors",
                    body: JSON.stringify({
                        'id': '',
                        'jsonrpc': '2.0',
                        'method': 'aria2.addUri',
                        'params': [[url], {'out': `${elem.href.substring(elem.href.indexOf("=") + 1)}_${elem.innerText}_${quality}.mp4`}]
                    })
                })
            };
            document.querySelector(".tab-menu-wrapper-row").innerHTML += '<div class="tab-menu-wrapper-cell"><div class="tab-menu-item tooltipTrig" data-tab="add-to-tab" onclick="downloadRemote();" data-title="添加至离线下载"><i class="main-sprite-dark-2"></i><span>离线下载</span></div></div>'
        }
    },200)
    // Your code here...
})();