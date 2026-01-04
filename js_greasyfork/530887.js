// ==UserScript==
// @name         Copy RSS Feed
// @name:zh      复制RSS地址
// @name:zh-CN   复制RSS地址
// @description         Automatically detect and quickly display the RSS subscription information of the current website for easy copying.
// @description:zh      自动检测并快捷展示当前网站的 RSS 订阅信息，方便复制(Copy RSS Feed)
// @description:zh-CN   自动检测并快捷展示当前网站的 RSS 订阅信息，方便复制(Copy RSS Feed)
// @author       Wilsonyiyi
// @namespace    https://github.com/wilsonyiyi
// @icon         data:image/png;base64,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
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      GPL3.0
// @version      1.0.3
// @downloadURL https://update.greasyfork.org/scripts/530887/Copy%20RSS%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/530887/Copy%20RSS%20Feed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #__wilsonyiyi__rss-float-container {
            position: fixed;
            right: -30px;
            top: 30%;
            height: 40px;
            z-index: 9999;
            display: flex;
            align-items: center;
            transition: all 0.3s ease;
            overflow: visible;
        }
        #__wilsonyiyi__rss-float-container:hover {
            right: 0;
        }

        #__wilsonyiyi__rss-float-btn {
            width: 40px;
            height: 40px;
            background: #ff9800;
            border-top-left-radius: 20px;
            border-bottom-left-radius: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            user-select: none;
            position: relative;
        }

        #__wilsonyiyi__rss-float-btn:hover {
            background: #ff7d00;
        }

        #__wilsonyiyi__rss-float-btn svg {
            width: 24px;
            height: 24px;
            fill: white;
        }

        #__wilsonyiyi__rss-label {
            height: 40px;
            line-height: 40px;
            background: #ff9800;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 14px;
            padding: 0 15px;
            white-space: nowrap;
            max-width: 0;
            overflow: hidden;
            transition: max-width 0.3s ease;
            cursor: pointer;
        }

        #__wilsonyiyi__rss-float-container:hover #__wilsonyiyi__rss-label {
            max-width: 200px;
        }

        #__wilsonyiyi__rss-close-btn {
            width: 40px;
            height: 40px;
            background: #ff9800;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            max-width: 0;
            overflow: hidden;
            transition: max-width 0.3s ease;
        }

        #__wilsonyiyi__rss-float-container:hover #__wilsonyiyi__rss-close-btn {
            max-width: 40px;
        }

        #__wilsonyiyi__rss-close-btn svg {
            width: 16px;
            height: 16px;
            fill: white;
            min-width: 16px;
        }

        #__wilsonyiyi__rss-toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        #__wilsonyiyi__rss-toast.show {
            opacity: 1;
        }
    `);

    const findRssLinksByLinkTag = () => {
        const links = document.querySelectorAll('link[type="application/rss+xml"], link[type="application/atom+xml"]');
        return Array.from(links).map(link => link.href);
    };

    const findRssLinksByATag = () => {
      const links = Array.from(document.querySelectorAll('a')).filter(x => x.href.endsWith('.xml'))
      return Array.from(links).map(link => link.href);
    }

    const getRssLinks = () => {
      const r1 = findRssLinksByLinkTag()
      if (r1.length) return r1

      const r2 = findRssLinksByATag()
      if (r2.length) return r2

      return []
    }

    const createFloatButton = (rssLink) => {
        const container = document.createElement('div');
        container.id = '__wilsonyiyi__rss-float-container';

        const button = document.createElement('div');
        button.id = '__wilsonyiyi__rss-float-btn';
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.18,15.64A2.18,2.18 0 0,1 8.36,17.82C8.36,19 7.38,20 6.18,20C5,20 4,19 4,17.82A2.18,2.18 0 0,1 6.18,15.64M4,4.44A15.56,15.56 0 0,1 19.56,20H16.73A12.73,12.73 0 0,0 4,7.27V4.44M4,10.1A9.9,9.9 0 0,1 13.9,20H11.07A7.07,7.07 0 0,0 4,12.93V10.1Z"/></svg>';

        const label = document.createElement('div');
        label.id = '__wilsonyiyi__rss-label';
        label.textContent = 'Copy RSS Feed';

        const closeBtn = document.createElement('div');
        closeBtn.id = '__wilsonyiyi__rss-close-btn';
        closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>';

        container.appendChild(button);
        container.appendChild(label);
        container.appendChild(closeBtn);

        document.body.appendChild(container);

        const copyRssLink = () => {
            GM_setClipboard(rssLink);
            showToast('🎉 Copied 🎉');
        };

        button.addEventListener('click', copyRssLink);
        label.addEventListener('click', copyRssLink);

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            container.style.display = 'none';
        });

        return container;
    };

    const createToast = () => {
        const toast = document.createElement('div');
        toast.id = '__wilsonyiyi__rss-toast';
        document.body.appendChild(toast);
        return toast;
    };

    const showToast = (message) => {
        const toast = document.getElementById('__wilsonyiyi__rss-toast') || createToast();
        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    };

    const init = () => {
        const rssLinks = getRssLinks();

        if (rssLinks.length > 0) {
            createFloatButton(rssLinks[0]);
            createToast();
        }
    };

    window.addEventListener('load', init);
})();