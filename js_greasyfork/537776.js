// ==UserScript==
// @name         nicePT分类图标替换
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  替换分类中的图标，一目了然
// @match        https://www.nicept.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537776/nicePT%E5%88%86%E7%B1%BB%E5%9B%BE%E6%A0%87%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/537776/nicePT%E5%88%86%E7%B1%BB%E5%9B%BE%E6%A0%87%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 图标匹配规则
    const iconMap = [
        {
            match: /写真、套图/,
            url: "https://i.postimg.cc/HnssHKPN/xz.png"
        },
        {
            match: /动漫/,
            url: "https://i.postimg.cc/4NsxQKf5/dm.png"
        },
        {
            match: /欧美/,
            url: "https://i.postimg.cc/VNMxhR4b/om.png"
        },
        {
            match: /日本无码/,
            url: "https://i.postimg.cc/6qGnV8Bw/rb.png"
        },
        {
            match: /其他（限制级）/,
            url: "https://i.postimg.cc/dtk4n05h/qt.png"
        },
        {
            match: /日本有码/,
            url: "https://i.postimg.cc/4NgQv1HS/rq.png"
        },
        {
            match: /SM调教/,
            url: "https://i.postimg.cc/VNpjJ9c4/sm.png"
        },
        {
            match: /真人秀，自拍（限制级）/,
            url: "https://i.postimg.cc/MHBrFKzb/Snip-2025-05-31-00-07-17-Chat-GPT.png"
        }
    ];

    function replaceIcons() {
        // 同时查找 c_doc 和 c_movies 两种图标
        const icons = document.querySelectorAll('img.c_doc, img.c_movies');

        icons.forEach(img => {
            const descriptor = img.alt || img.title || '';

            for (const rule of iconMap) {
                if (rule.match.test(descriptor)) {
                    const div = document.createElement("div");

                    div.style.display = "inline-block";
                    div.style.width = img.width ? `${img.width}px` : '45px';
                    div.style.height = img.height ? `${img.height}px` : '45px';

                    div.style.backgroundImage = `url(${rule.url})`;
                    div.style.backgroundSize = "cover";
                    div.style.backgroundRepeat = "no-repeat";
                    div.style.backgroundPosition = "center";

                    if (img.title) div.title = img.title;

                    img.replaceWith(div);
                    break; // 找到匹配就停止
                }
            }
        });
    }

    replaceIcons();

    // 监听动态内容
    const observer = new MutationObserver(replaceIcons);
    observer.observe(document.body, { childList: true, subtree: true });
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-05-30
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();