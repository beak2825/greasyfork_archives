// ==UserScript==
// @name        [网页加载加速]CDNJS/UNPKG资源自动更换
// @description 自动替换网页中的CDNJS和UNPKG脚本/JS/CSS和图片资源，避免因资源无法连接或加载慢而导致的网页卡顿，显著提高网页加载速度
// @include     *
// @version     1
// @grant       none
// @namespace https://greasyfork.org/users/1302675
// @downloadURL https://update.greasyfork.org/scripts/495185/%5B%E7%BD%91%E9%A1%B5%E5%8A%A0%E8%BD%BD%E5%8A%A0%E9%80%9F%5DCDNJSUNPKG%E8%B5%84%E6%BA%90%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/495185/%5B%E7%BD%91%E9%A1%B5%E5%8A%A0%E8%BD%BD%E5%8A%A0%E9%80%9F%5DCDNJSUNPKG%E8%B5%84%E6%BA%90%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    const cdnUrls = {
        'cdnjs.cloudflare.com/ajax/libs': 's4.zstatic.net/ajax/libs',
        'unpkg.com': 's4.zstatic.net/npm',
        'cdn.jsdelivr.net/npm': 's4.zstatic.net/npm',
        'fastly.jsdelivr.net/npm': 's4.zstatic.net/npm'
    };

    const scriptTags = document.getElementsByTagName('script');
    for (let i = 0; i < scriptTags.length; i++) {
        const scriptTag = scriptTags[i];
        const src = scriptTag.getAttribute('src');
        if (src) {
            for (const cdnUrl in cdnUrls) {
                if (src.includes(cdnUrl)) {
                    const newSrc = src.replace(cdnUrl, cdnUrls[cdnUrl]);
                    scriptTag.setAttribute('src', newSrc);
                    break;
                }
            }
        }
    }

    const linkTags = document.getElementsByTagName('link');
    for (let i = 0; i < linkTags.length; i++) {
        const linkTag = linkTags[i];
        const href = linkTag.getAttribute('href');
        if (href) {
            for (const cdnUrl in cdnUrls) {
                if (href.includes(cdnUrl)) {
                    const newHref = href.replace(cdnUrl, cdnUrls[cdnUrl]);
                    linkTag.setAttribute('href', newHref);
                    break;
                }
            }
        }
    }
})();
