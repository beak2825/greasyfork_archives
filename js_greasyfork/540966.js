// ==UserScript==
// @name         X/Twitter Wide Screen Optimization (Firefox Only) (X/推特宽屏优化 - 仅限Firefox)
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  优化 X (Twitter) 在宽屏显示器上的布局，修复推文多图片和视频显示问题，使其宽度自适应屏幕。其他浏览器有显示问题，建议在Firefox上使用。
// @author       vnry
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/540966/XTwitter%20Wide%20Screen%20Optimization%20%28Firefox%20Only%29%20%28X%E6%8E%A8%E7%89%B9%E5%AE%BD%E5%B1%8F%E4%BC%98%E5%8C%96%20-%20%E4%BB%85%E9%99%90Firefox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540966/XTwitter%20Wide%20Screen%20Optimization%20%28Firefox%20Only%29%20%28X%E6%8E%A8%E7%89%B9%E5%AE%BD%E5%B1%8F%E4%BC%98%E5%8C%96%20-%20%E4%BB%85%E9%99%90Firefox%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
@media (min-width: 1600px) {
    html, body {
        height: auto !important;
        min-height: 100vh !important;
        overflow-x: hidden !important;
        overflow-y: auto !important;
        -webkit-text-size-adjust: 100%;
        tab-size: 4;
        font-feature-settings: normal;
        font-variation-settings: normal;
        -webkit-tap-highlight-color: transparent;
        font-size: 15px;
        color-scheme: dark;
        line-height: inherit;
        font-family: TwitterChirp, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: hsl(var(--foreground));
        scrollbar-color: rgb(62, 65, 68) rgb(22, 24, 28);
        pointer-events: auto;
        cursor: default;
        text-shadow: none !important;
        align-items: stretch;
        background-color: rgba(0,0,0,0.00);
        border: 0 solid black;
        box-sizing: border-box;
        display: block;
        flex-basis: auto;
        flex-shrink: 0;
        list-style: none;
        margin: 0px;
        min-height: 0px;
        min-width: 0px;
        padding: 0px;
        position: relative;
        text-decoration: none;
        z-index: 0;
    }

    #react-root,
    #react-root > div:first-child,
    .css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz {
        width: 100% !important;
        max-width: unset !important;
        min-width: unset !important;
        flex: 1 1 auto !important;
        height: auto !important;
        min-height: 100vh !important;
        overflow: visible !important;
    }
    header[role='banner'] {
        flex-grow: 0 !important;
        width: 70px !important;
        min-width: 70px !important;
        max-width: 70px !important;
        flex-shrink: 0 !important;
    }
    header[role='banner'] > div:first-child {
        width: 100% !important;
        align-items: center !important;
    }
    header[role='banner'] nav[role='navigation'] a div[dir="ltr"] span.css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3 {
        display: none !important;
    }
    nav[role='navigation'] > * > div:first-child > div[dir=auto]:last-child {
        display: none !important;
    }
    a[data-testid='SideNav_NewTweet_Button'] {
        width: 48px !important;
        min-width: 48px !important;
        height: 48px !important;
        min-height: 48px !important;
        padding: 0 !important;
        border-radius: 50% !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        background-color: rgb(29, 155, 240) !important;
        color: white !important;
    }
    a[data-testid='SideNav_NewTweet_Button'] span {
        display: none !important;
    }
    a[data-testid='SideNav_NewTweet_Button'] svg {
        display: block !important;
        width: 1.5em !important;
        height: 1.5em !important;
        fill: currentcolor !important;
    }
    div[data-testid='SideNav_AccountSwitcher_Button'] {
        padding: 4px !important;
    }
    div[data-testid='SideNav_AccountSwitcher_Button'] > div:nth-child(2),
    div[data-testid='SideNav_AccountSwitcher_Button'] > div:nth-child(3) {
        display: none !important;
    }
    main[role='main'] {
        width: 100% !important;
        flex-grow: 1 !important;
        flex-shrink: 1 !important;
        height: auto !important;
        min-height: 100% !important;
        overflow-y: visible !important;
        display: flex !important;
        flex-direction: column !important;
    }
    main[role='main'] > div:first-child {
        width: 100% !important;
        max-width: unset !important;
        margin: 0 !important;
        flex-grow: 1 !important;
        flex-shrink: 1 !important;
        height: auto !important;
        min-height: 100% !important;
        display: flex !important;
        flex-direction: row !important;
    }
    main[role='main'] > div:first-child > div:nth-child(2) > div:first-child {
        width: 100% !important;
        max-width: unset !important;
        margin: 0 !important;
        flex-grow: 1 !important;
        flex-shrink: 1 !important;
        height: auto !important;
        min-height: 100% !important;
    }
    [data-testid='primaryColumn'] {
        max-width: 1800px !important;
        width: 100% !important;
        flex-grow: 1 !important;
        flex-shrink: 1 !important;
        margin-left: auto !important;
        margin-right: auto !important;
        border-left: none !important;
        border-right: none !important;
        height: auto !important;
        min-height: 100% !important;
        overflow-y: visible !important;
    }

    [data-testid='primaryColumn'] > div > div:nth-child(2) {
        width: 100% !important;
        max-width: unset !important;
        flex-basis: auto !important;
        margin-left: auto !important;
        margin-right: auto !important;
    }

    [data-testid='primaryColumn'] div.css-175oi2r.r-16y2uox.r-1wbh5a2.r-1ny4l3l {
        width: 100% !important;
        max-width: unset !important;
        flex-basis: auto !important;
        margin-left: auto !important;
        margin-right: auto !important;
    }

    article[data-testid="tweet"] [data-testid="tweetPhoto"] img.css-9pa8cd:not([src*="amplify_video_thumb"]) {
        width: 100% !important;
        height: auto !important;
        max-height: 80vh !important;
        object-fit: contain !important;
    }

    article[data-testid="tweet"] .r-1kqtdi0 {
        height: auto !important;
        min-height: 0 !important;
    }

    [data-testid='primaryColumn'] > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child {
        max-width: 100% !important;
        width: 100% !important;
        margin: auto !important;
    }
    [data-testid='primaryColumn'] > div:first-child > div:last-child {
        width: 95% !important;
        max-width: unset !important;
        margin: auto !important;
    }
    [data-testid='sidebarColumn'] {
        width: 300px !important;
        max-width: 300px !important;
        flex-grow: 0 !important;
        flex-shrink: 0 !important;
        margin-left: 20px !important;
        height: auto !important;
        min-height: 100% !important;
        overflow-y: visible !important;
    }
    [data-testid='sidebarColumn'] > div:first-child > div:last-child,
    [data-testid='sidebarColumn'] > div:first-child > div:last-child > div:first-child > div:first-child > div:first-child > div:first-child {
        width: 100% !important;
    }
    .css-175oi2r.r-1xpp3t0 {
        width: 100% !important;
        max-width: unset !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
    .css-175oi2r.r-f8sm7e.r-13qz1uu.r-1ye8kvj {
        max-width: 1800px !important;
        width: 100% !important;
        margin-left: auto !important;
        margin-right: auto !important;
        height: auto !important;
        min-height: 100% !important;
        overflow-y: visible !important;
    }
    [aria-labelledby='master-header'] {
        max-width: 100% !important;
        margin: 0 !important;
        width: 250px !important;
        flex-shrink: 0 !important;
        flex-grow: 0 !important;
    }
    [aria-labelledby='detail-header'] {
        width: auto !important;
        max-width: 100% !important;
        margin: 0 !important;
        flex-grow: 1 !important;
    }
    [aria-labelledby='detail-header'] > div:nth-child(2) > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > div:nth-child(2),
    [aria-labelledby='detail-header'] > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child {
        width: 90% !important;
        max-width: 90% !important;
        margin: auto !important;
    }
    [role='main'] > div:first-child > div:first-child > div:first-child {
        max-width: 100% !important;
    }
    [data-testid='primaryColumn'] > div:first-child > div:first-child > div:last-child > div:first-child > div:last-child {
        width: 95% !important;
        max-width: unset !important;
        margin: auto !important;
    }
}
    `;
    document.head.appendChild(style);

})();
