// ==UserScript==
// @name              🚫NoMoreRestrict🚫
// @name:en           🚫NoMoreRestrict🚫
// @name:zh-CN        🚫限制你妹🚫
// @description       Get rid of the annoying restrictions on websites， including right-click, text selection, copy, save, etc.
// @description:en    Get rid of the annoying restrictions on websites， including right-click, text selection, copy, save, etc.
// @description:zh-CN 摆脱网站上各种沙壁限制，包括右键、文本选择、复制、保存等
// @version           1.3.4
// @namespace         https://github.com/WCY-dt
// @homepageURL       https://github.com/WCY-dt/NoMoreRestrict
// @supportURL        https://github.com/WCY-dt/NoMoreRestrict/issues/new?assignees=WCY-dt&labels=help+wanted
// @author            Ch3nyang
// @copyright         2024, Ch3nyang
// @license           MIT
// @match             *://*/*
// @icon              data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEzLDlIMTguNUwxMywzLjVWOU02LDJIMTRMMjAsOFYyMEEyLDIgMCAwLDEgMTgsMjJINkM0Ljg5LDIyIDQsMjEuMSA0LDIwVjRDNCwyLjg5IDQuODksMiA2LDJNMTAuNSwxMUM4LDExIDYsMTMgNiwxNS41QzYsMTggOCwyMCAxMC41LDIwQzEzLDIwIDE1LDE4IDE1LDE1LjVDMTUsMTMgMTMsMTEgMTAuNSwxMU0xMC41LDEyLjVBMywzIDAgMCwxIDEzLjUsMTUuNUMxMy41LDE2LjA2IDEzLjM1LDE2LjU4IDEzLjA4LDE3TDksMTIuOTJDOS40MiwxMi42NSA5Ljk0LDEyLjUgMTAuNSwxMi41TTcuNSwxNS41QzcuNSwxNC45NCA3LjY1LDE0LjQyIDcuOTIsMTRMMTIsMTguMDhDMTEuNTgsMTguMzUgMTEuMDYsMTguNSAxMC41LDE4LjVBMywzIDAgMCwxIDcuNSwxNS41WiIgZmlsbD0iI2NjMDAwMCIgLz48L3N2Zz4=
// @require           https://code.jquery.com/jquery-3.7.1.min.js
// @grant             GM_addStyle
// @grant             GM_registerMenuCommand
// @grant             GM_setValue
// @grant             GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/498848/%F0%9F%9A%ABNoMoreRestrict%F0%9F%9A%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/498848/%F0%9F%9A%ABNoMoreRestrict%F0%9F%9A%AB.meta.js
// ==/UserScript==

const $ = window.jQuery.noConflict(true);

/* Settings begin */
const settingsHtml = /*html*/ `
    <div id="no-more-restrict-settings" style="display: none;">
        <div id="no-more-restrict-settings-title">NoMoreRestrict Settings / 设置</div>
        <button id="no-more-restrict-close-btn">X</button>
        <input type="checkbox" id="no-more-restrict-disable-video-right-click">
        <label for="no-more-restrict-disable-video-right-click">Disable video sites from modifying the right-click menu / 禁用视频网站对右键菜单的修改</label>
    </div>
    <style>
        * #no-more-restrict-settings {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            background-color: white;
            border: 1px solid black;
            z-index: 9999;
        }

        * #no-more-restrict-settings input[type="checkbox"] {
            margin-right: 10px;
        }

        * #no-more-restrict-settings label {
            font-size: 16px;
        }

        * #no-more-restrict-settings-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
            margin-right: 20px;
        }

        * #no-more-restrict-close-btn {
            font-size: 20px;
            font-family: Arial, sans-serif;
            cursor: pointer;
            background-color: transparent;
            border: none;
            outline: none;
            position: absolute;
            top: 0;
            right: 0;
            margin: 5px 10px;
        }
    </style>
`;

document.body.insertAdjacentHTML('beforeend', settingsHtml);

document.getElementById('no-more-restrict-close-btn').addEventListener('click', function () {
    document.getElementById('no-more-restrict-settings').style.display = 'none';
});

let disableVideoRightClick = GM_getValue('no-more-restrict-disable-video-right-click', true);
document.getElementById('no-more-restrict-disable-video-right-click').checked = disableVideoRightClick;

document.getElementById('no-more-restrict-disable-video-right-click').addEventListener('change', (event) => {
    GM_setValue('no-more-restrict-disable-video-right-click', event.target.checked);
    disableVideoRightClick = event.target.checked;
    window.location.reload();
});

const menuToggleSettings = GM_registerMenuCommand('Toggle Settings', () => {
    const settingsDiv = document.getElementById('no-more-restrict-settings');
    if (settingsDiv.style.display === 'none') {
        settingsDiv.style.display = 'block';
    } else {
        settingsDiv.style.display = 'none';
    }
});
/* Settings end */

const siteRightClickExclude = [
    'alist.11zhang.com',
    'web.oopz.cn',
];

const siteCopyExclude = [
];

const siteSelectExclude = [
];

const siteSaveExclude = [
];

(function () {
    'use strict';

    const disableVideoRightClick = GM_getValue('no-more-restrict-disable-video-right-click', true);

    // Block the restriction of right-click
    document.addEventListener('contextmenu', function (event) {
        if (!(
            (!disableVideoRightClick && event.target.tagName === 'VIDEO')
            || siteRightClickExclude.some(site => window.location.hostname.includes(site))
        )) {
            event.stopPropagation();
        }
    }, true);

    // Block the restriction of copy
    document.addEventListener('copy', function (event) {
        if (!siteCopyExclude.some(site => window.location.hostname.includes(site))) {
            event.stopPropagation();
        }
    }, true);

    // Block the restriction of select
    if (!siteSelectExclude.some(site => window.location.hostname.includes(site))) {
        const style = document.createElement('style');
        style.innerHTML = '* { -webkit-user-select: auto !important; -moz-user-select: auto !important; -ms-user-select: auto !important; user-select: auto !important; }';
        document.head.appendChild(style);
    }

    // Block the restriction of save
    document.addEventListener('contextmenu', function (event) {
        if (
            ['IMG', 'VIDEO', 'AUDIO'].includes(event.target.nodeName)
            && (!siteSaveExclude.some(site => window.location.hostname.includes(site)))
        ) {
            event.preventDefault();
        }
    });

    // Handle the site-specific restrictions
    switch (window.location.hostname) {
        case 'blog.csdn.net':
            handleSiteCsdn();
            break;
        case 'wenku.baidu.com':
            handleSiteBaiduwenku();
            break;
        case 'c.pc.qq.com':
            handleSiteQq();
            break;
        case '16map.com':
            handleSite16map();
            break;
        default:
            break;
    }
})();

function handleSiteCsdn() {
    // Modify the copy button
    $('code>div').each(function () {
        const copyButton = $(this);
        const codeBlock = copyButton.closest('code');
        const preBlock = codeBlock.parent();

        // always show copyBotton
        copyButton.css('display', 'block');

        // copy code to clipboard
        copyButton.on('click', function () {
            const code = codeBlock.text();
            navigator.clipboard.writeText(code);
        });

        // change the title of copyButton
        copyButton.attr('data-title', '直接复制');

        // delete `data-report-click` attribute
        copyButton.removeAttr('data-report-click');

        // delete `onclick` attribute of codeBlock
        codeBlock.removeAttr('onclick');
    });
}

function handleSiteBaiduwenku() {
    setTimeout(() => {
        // auto click the `show all` button after waiting for 3 seconds
        const showAllButton = $('.load-more-link .text-arrow-wrap');
        console.log(showAllButton);
        if (showAllButton.length > 0) {
            showAllButton.click();
        }
    }, 3000); // Wait for 3000 milliseconds (3 seconds) before executing the code inside setTimeout
}

function handleSiteQq() {
    // If find pfurl, go to the real page
    const pfurl = new URLSearchParams(window.location.search).get('pfurl');
    if (pfurl) {
        // URL decode
        const url = decodeURIComponent(pfurl);
        window
            .open(url, '_self')
            .focus();
    }
}

function handleSite16map() {
    // Block the restriction of select
    const style = document.createElement('style');
    style.innerHTML = 'body * :not(input):not(textarea) { -webkit-user-select: auto !important; -moz-user-select: auto !important; -ms-user-select: auto !important; user-select: auto !important; }';
    document.head.appendChild(style);
}