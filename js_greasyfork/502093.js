// ==UserScript==
// @name         Douyin embedded videos on voz
// @namespace    Douyin on voz
// @version      1.0
// @description  Replace Douyin links with embedded videos on Voz forum
// @icon         https://www.google.com/s2/favicons?sz=64&domain=voz.vn
// @author       kylyte
// @match        https://voz.vn/t/*
// @match        https://voz.vn/conversations/*
// @match        https://voz.vn/whats-new/profile-posts/*
// @match        https://voz.vn/u/*
// @run-at       document-idle
// @license      GPL-3.0
// @grant        GM_xmlhttpRequest
// @connect      douyin.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/502093/Douyin%20embedded%20videos%20on%20voz.user.js
// @updateURL https://update.greasyfork.org/scripts/502093/Douyin%20embedded%20videos%20on%20voz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createIframe(videoId) {
        var iframe = document.createElement('iframe');
        iframe.width = "325";
        iframe.height = "735";
        iframe.frameBorder = "0";
        iframe.src = `https://open.douyin.com/player/video?vid=${videoId}&autoplay=0`;
        iframe.referrerPolicy = "unsafe-url";
        iframe.allowFullscreen = true;
        return iframe;
    }

    function replaceDouyinLinks() {
        document.querySelectorAll('a.link--external').forEach(function(link) {
            var href = link.href;
            if (href) {
                if (href.includes('v.douyin.com')) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: href,
                        onload: function(response) {
                            var finalUrl = response.finalUrl;
                            var videoIdMatch = finalUrl.match(/video\/(\d+)/);
                            if (videoIdMatch && videoIdMatch[1]) {
                                var videoId = videoIdMatch[1];
                                var iframe = createIframe(videoId);
                                link.parentNode.replaceChild(iframe, link);
                            }
                        }
                    });
                } else if (href.includes('www.douyin.com/video/')) {
                    var videoIdMatch = href.match(/video\/(\d+)/);
                    if (videoIdMatch && videoIdMatch[1]) {
                        var videoId = videoIdMatch[1];
                        var iframe = createIframe(videoId);
                        link.parentNode.replaceChild(iframe, link);
                    }
                }
            }
        });
    }

    window.addEventListener('load', replaceDouyinLinks);
    const observer = new MutationObserver(replaceDouyinLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();