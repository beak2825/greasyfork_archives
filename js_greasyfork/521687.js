// ==UserScript==
// @name         Bangumi 屏蔽色情条目
// @version      0.6
// @description  使用前请登出bangumi.tv的账号,登录并使用bgm.tv的账号
// @author       sedoruee
// @match        *://bgm.tv/*
// @match        *://bangumi.tv/*
// @match        *://chii.in/*
// @grant        none
// @namespace https://greasyfork.org/users/1383632
// @downloadURL https://update.greasyfork.org/scripts/521687/Bangumi%20%E5%B1%8F%E8%94%BD%E8%89%B2%E6%83%85%E6%9D%A1%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/521687/Bangumi%20%E5%B1%8F%E8%94%BD%E8%89%B2%E6%83%85%E6%9D%A1%E7%9B%AE.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const host = window.location.host;
    const isBgm = host === 'bgm.tv' || host === 'chii.in';

    function replaceLinks(targetHost) {
        const links = document.querySelectorAll('a[href]');
        for (const link of links) {
            // 排除 div.page_inner, ul.browserCoverMedium, div.subject_section 元素
            if (link.closest('div.page_inner, ul.browserCoverMedium, div.subject_section')) continue;

            const href = link.href;
            const regex = /^(https?:\/\/)(bgm\.tv|chii\.in|bangumi\.tv)(\/(subject|game|book|anime|index)(\/(\d+|(tag.*)?))?)/;

            if (regex.test(href)) {
                const match = href.match(regex);
                const targetDomain = match[2];
                const targetPath = match[3];
                const targetType = match[4];
                const targetFurther = match[6];

                // 获取当前页面的路径部分和类型
                const currentPathRegex = /^\/((subject|game|book|anime|index)(\/(\d+|(tag.*)?))?)/;
                const currentPathMatch = window.location.pathname.match(currentPathRegex);
                const currentType = currentPathMatch ? currentPathMatch[2] : null;
                const currentFurther = currentPathMatch ? currentPathMatch[4] : null;

                // 只有当前页面和目标链接都是 /subject, /game, /book, /anime, /index 且后面没有内容 且域名相同，才保留域名
                const shouldKeepDomain =
                    currentType &&
                    targetType &&
                    currentType === targetType &&
                    !currentFurther &&
                    !targetFurther &&
                    targetDomain === host;

                if (shouldKeepDomain) {
                    continue; // 保持当前域名
                }

                if (isBgm) {
                    link.href = href.replace(regex, `$1bangumi.tv$3`);
                } else {
                    link.href = href.replace(regex, `$1bgm.tv$3`);
                }
            }
        }
    }

    if (isBgm) {
        replaceLinks('bangumi.tv');
    } else {
        replaceLinks('bgm.tv');
    }

    // 监听 DOM 变化，处理动态加载的内容
    const observer = new MutationObserver(() => {
        if (isBgm) {
            replaceLinks('bangumi.tv');
        } else {
            replaceLinks('bgm.tv');
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();