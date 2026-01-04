// ==UserScript==
// @name         京东直播网页增加HLS支持
// @namespace    https://tampermonkey.net/
// @version      1.0.0
// @description  部分浏览器无法直接播放京东的m3u8直播流,需要给网页加上hls支持后即可正常播放.该脚本需配合守候购物小助手v3.10.2以上版本使用.
// @author       苦苦守候
// @match        https://lives.jd.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479371/%E4%BA%AC%E4%B8%9C%E7%9B%B4%E6%92%AD%E7%BD%91%E9%A1%B5%E5%A2%9E%E5%8A%A0HLS%E6%94%AF%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/479371/%E4%BA%AC%E4%B8%9C%E7%9B%B4%E6%92%AD%E7%BD%91%E9%A1%B5%E5%A2%9E%E5%8A%A0HLS%E6%94%AF%E6%8C%81.meta.js
// ==/UserScript==

(function() {
    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
    script.onload = function() {
        let init = function(video) {
            if (!video.getAttribute('hls-inited')) {
                let hls = null;
                let load = function() {
                    let src = video.src;
                    if (!src || src.indexOf('.m3u8') < 0)
                        return
                    if (!hls) {
                        hls = new Hls();
                        hls.attachMedia(video);
                    }
                    hls.loadSource(src);
                }
                video.addEventListener("error", function() {
                    load();
                }, false);
                video.addEventListener("DOMNodeRemovedFromDocument",function(){
                    if(hls){
                        hls.destroy()
                    }
                }, false);
                video.setAttribute('hls-inited', 'ok');
            }
        }
        document.getElementsByTagName("video").forEach(init)
        document.body.addEventListener("DOMNodeInserted", function(e) {
            let ele = e.relatedNode;
            if (ele.tagName === 'VIDEO') {
                init(ele);
            }
            ele.getElementsByTagName("video").forEach(init)
        })
    }
    var s = document.querySelector("#app");
    s.parentNode.insertBefore(script, s);

})();