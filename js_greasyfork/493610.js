// ==UserScript==
// @name         赛马娘官网中文翻译
// @namespace    http://umamusume.jp/
// @version      1.1.0
// @description  为赛马娘官网内容提供中文翻译。
// @author       yingyingyingqwq
// @match        *://umamusume.jp/*
// @icon         https://umamusume.jp/favicon.ico
// @grant        GM_getResourceText
// @resource     Replacements https://umasite.yingqwq.cn/Replacements.json
// @downloadURL https://update.greasyfork.org/scripts/493610/%E8%B5%9B%E9%A9%AC%E5%A8%98%E5%AE%98%E7%BD%91%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/493610/%E8%B5%9B%E9%A9%AC%E5%A8%98%E5%AE%98%E7%BD%91%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const Replacements = JSON.parse(GM_getResourceText("Replacements"));

    const IMGreplace = Replacements[3].images

    function replaceImageSource() {
        const path = window.location.pathname;
        if (IMGreplace[path]) {
            const imgConfig = IMGreplace[path];

            for (const altValue in imgConfig) {
                const images = document.querySelectorAll(`img[alt="${altValue}"]`);
                const replacements = imgConfig[altValue];

                images.forEach((img, index) => {
                    if (replacements[index + 1]) {
                        img.src = replacements[index + 1];
                    }
                });
            }
        }
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 预编译所有替换规则
    const compiledReplacements = Replacements.map(replacement => {
        const partialPatterns = Object.keys(replacement.partial || {}).flatMap(key => {
            if (replacement.type === 'url' || replacement.type === 'element') {
                return Object.keys(replacement.partial[key]).map(subKey => ({
                    regex: new RegExp(escapeRegExp(subKey), 'g'),
                    value: replacement.partial[key][subKey],
                    matchType: "partial",
                    context: key
                }));
            } else {
                return {
                    regex: new RegExp(escapeRegExp(key), 'g'),
                    value: replacement.partial[key],
                    matchType: "partial"
                };
            }
        });
        const fullPatterns = Object.keys(replacement.full || {}).flatMap(key => {
            if (replacement.type === 'url' || replacement.type === 'element') {
                return Object.keys(replacement.full[key]).map(subKey => ({
                    regex: new RegExp(escapeRegExp(subKey)),
                    value: replacement.full[key][subKey],
                    matchType: "full",
                    context: key
                }));
            } else {
                return {
                    regex: new RegExp(escapeRegExp(key)),
                    value: replacement.full[key],
                    matchType: "full"
                };
            }
        });
        return { ...replacement, patterns: [...partialPatterns, ...fullPatterns] };
    });

    function getReplacementsForURL() {
        const path = window.location.pathname;
        return compiledReplacements.filter(replacement =>
            replacement.type === "global" ||
            (replacement.type === "url" && replacement.patterns.some(pattern => pattern.context === path))
        );
    }

    function getReplacementsForElement(element) {
        const dataAttributes = Array.from(element.attributes).map(attr => attr.name);
        return compiledReplacements.filter(replacement =>
            replacement.type === "global" ||
            (replacement.type === "element" && replacement.patterns.some(pattern => dataAttributes.includes(pattern.context)))
        );
    }

    function ReplaceText(node) {
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
        let currentNode = walker.nextNode();
        const urlReplacements = getReplacementsForURL();

        while (currentNode) {
            const elementReplacements = getReplacementsForElement(currentNode.parentElement);
            const allReplacements = [...urlReplacements, ...elementReplacements];

            let text = currentNode.nodeValue;
            allReplacements.forEach(({ patterns }) => {
                patterns.forEach(({ regex, value, matchType, context }) => {
                    if (context && window.location.pathname !== context && !currentNode.parentElement.hasAttribute(context)) return;
                    if (matchType === "partial") {
                        text = text.replace(regex, value);
                    } else if (matchType === "full" && text === regex.source) {
                        text = value;
                    }
                });
            });
            if (text !== currentNode.nodeValue) {
                currentNode.nodeValue = text;
            }
            currentNode = walker.nextNode();
        }
    }

    function ReplaceTitle() {
        let title = document.title;
        const urlReplacements = getReplacementsForURL();

        urlReplacements.forEach(({ patterns }) => {
            patterns.forEach(({ regex, value, matchType, context }) => {
                if (context && window.location.pathname !== context) return;
                if (matchType === "partial") {
                    title = title.replace(regex, value);
                } else if (matchType === "full" && title === regex.source) {
                    title = value;
                }
            });
        });
        document.title = title;
    }
    

    function replaceYoutubeVideo() {
        const videoMapping = Replacements[4].videos
    
        const youtubeIframes = document.querySelectorAll('iframe[src*="youtube-nocookie.com/embed/"]');
    
        youtubeIframes.forEach(iframe => {
            const youtubeUrl = new URL(iframe.src);
            const videoId = youtubeUrl.pathname.split('/').pop();
    
            const bilibiliId = videoMapping[videoId];
            if (bilibiliId) {
                const bilibiliUrl = `https://player.bilibili.com/player.html?bvid=${bilibiliId}&high_quality=1`;
    
                const bilibiliIframe = document.createElement('iframe');
                bilibiliIframe.src = bilibiliUrl;
                bilibiliIframe.width = iframe.width;
                bilibiliIframe.height = iframe.height;
                bilibiliIframe.frameBorder = "0";
                bilibiliIframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                bilibiliIframe.allowFullscreen = true;
    
                iframe.parentNode.replaceChild(bilibiliIframe, iframe);
            }
        });
    }

    function changeFont() {
        if (!document.querySelector('#customFontStyle')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'customFontStyle';
            document.head.appendChild(styleElement);
            styleElement.textContent = `
                body,label,.character-detail__visual-catch,.font-style-italic,.catch-text  {
                    font-family: Misans,YakuHanJP,Roboto,Zen Kaku Gothic New,sans-serif,微软雅黑 !important;
                }
                .mainstory-part1-section[data-v-dbd344ea],.font-weight-regular {
                    font-family: Noto Serif SC,Noto Serif JP,serif !important;
                }
            `;
        }
    }

    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            ReplaceText(document.body);
            ReplaceTitle();
            replaceImageSource();
            replaceYoutubeVideo()
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function loadMiSansFont() {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.crossOrigin = 'anonymous';
        link.href = 'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Medium.min.css';

        document.head.appendChild(link);
    }

    function loadSongFont() {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.crossOrigin = 'anonymous';
        link.href = 'https://fonts.font.im/css2?family=Noto+Serif+SC:wght@200..900&display=swap';

        document.head.appendChild(link);
    }

    loadMiSansFont();
    loadSongFont();
    ReplaceText(document.body);
    ReplaceTitle();
    changeFont();
    observeDOMChanges();
    replaceImageSource();
    replaceYoutubeVideo()
})();