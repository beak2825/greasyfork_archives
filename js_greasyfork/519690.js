// ==UserScript==
// @name         Kemono FIX+Download
// @namespace    GPT
// @version      1.2.3
// @description  Embeds a "Download" button before each file element and starts downloading and saving it to your computer, can use constant to change replace kemono image server if standart not work. Improved version: download buttons, optimized MutationObserver, simplified and accelerated and optimized code.
// @description:ru  Встраивает кнопку Download перед каждым элементом с файлами и запускает скачивание с сохранением на компьютер, так же имеет константу для смены сервера изображений если стандартный не работает. Улучшенная версия: кнопки загрузки, оптимизированный MutationObserver, упрощённый и ускоренный и оптимизированный код.
// @author       Wizzergod
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kemono.su
// @homepageURL  https://greasyfork.org/ru/users/712283-wizzergod
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM.xmlHttpRequest
// @grant        GM_getResourceUrl
// @grant        GM.openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        GM_notification
// @match        *://kemono.su/*
// @match        *://kemono.party/*
// @match        *://coomer.su/*
// @match        *://*.patreon.com/*
// @match        *://*.fanbox.cc/*
// @match        *://*.pixiv.net/*
// @match        *://*.discord.com/*
// @match        *://*.fantia.jp/*
// @match        *://*.boosty.to/*
// @match        *://*.dlsite.com/*
// @match        *://*.gumroad.com/*
// @match        *://*.subscribestar.com/*
// @match        *://*.subscribestar.adult/*
// @match        *://*.onlyfans.com/*
// @match        *://*.candfans.jp/*
// @connect      kemono.party
// @connect      kemono.su
// @connect      coomer.su
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519690/Kemono%20FIX%2BDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/519690/Kemono%20FIX%2BDownload.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ENABLE_IMAGE_REPLACEMENT = 0;
    const ENABLE_URL_REPLACEMENT = 0;
    const ENABLE_MUTATION_OBSERVER = 1;

    const CONFIG = {
        INCLUDE_AUTHOR: 0,
        INCLUDE_SERVICE: 0,
        INCLUDE_USER: 0,
        INCLUDE_POSTID: 0
    };

    const SELECTORS = {
        THUMBNAILS: '.post__thumbnail',
        FILE_LINK: 'a.fileThumb',
        IMAGE_LINK: '.post__thumbnail a.fileThumb.image-link'
    };

    const debounce = (callback, delay = 300) => {
        clearTimeout(debounce._t);
        debounce._t = setTimeout(callback, delay);
    };

    const getMeta = name => document.querySelector(`meta[name="${name}"]`)?.content || null;

    const sanitize = str => str.replace(/[\\/:"*?<>|]+/g, '_');

    const getFileName = url => {
        try {
            const u = new URL(url);
            const f = u.searchParams.get('f');
            return sanitize(f || u.pathname.split('/').pop());
        } catch {
            return sanitize(url.split('/').pop());
        }
    };

    const getPostData = () => {
        const path = location.pathname.split('/').filter(Boolean);
        return {
            service: getMeta('service') || path[0],
            user: getMeta('user') || (path[1] === 'user' ? path[2] : null),
            postid: getMeta('id') || (path[3] === 'post' ? path[4] : null)
        };
    };

    const getAuthor = () => {
        const el = document.querySelector('a.post__user-name.fancy-link--kemono');
        return el ? sanitize(el.textContent.trim()) : null;
    };

    const makeFileName = (original) => {
        const data = getPostData();
        const parts = [];
        if (CONFIG.INCLUDE_AUTHOR && getAuthor()) parts.push(getAuthor());
        if (CONFIG.INCLUDE_SERVICE && data.service) parts.push(data.service);
        if (CONFIG.INCLUDE_USER && data.user) parts.push(data.user);
        if (CONFIG.INCLUDE_POSTID && data.postid) parts.push(data.postid);
        parts.push(original);
        return parts.join('_');
    };

    const download = (url) => {
        const fileName = makeFileName(getFileName(url));
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            responseType: 'blob',
            onload: res => {
                const blobUrl = URL.createObjectURL(res.response);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    URL.revokeObjectURL(blobUrl);
                    a.remove();
                }, 200);
            },
            onerror: () => alert('Ошибка при скачивании файла')
        });
    };

    const createButton = (url) => {
        const btn = document.createElement('button');
        btn.className = 'download-button';
        btn.textContent = 'Download';
        btn.onclick = e => {
            e.preventDefault();
            download(url);
        };
        return btn;
    };

    const insertButtons = () => {
        document.querySelectorAll(SELECTORS.THUMBNAILS).forEach(thumbnail => {
            if (thumbnail.querySelector('.download-container')) return;
            const link = thumbnail.querySelector(SELECTORS.FILE_LINK) || thumbnail.querySelector('a[href*="/download/"]');
            if (!link) return;
            const container = document.createElement('div');
            container.className = 'download-container';
            container.appendChild(createButton(link.href));
            thumbnail.appendChild(container);
        });
    };

    const addStyles = () =>GM_addStyle(`
        .download-container {
            padding: 7px;
            text-align: center;
            border: none;
            width: 100%;
            display: inline-block;
            justify-content: center;
            transform: translate(0%, -110%);
        }

        .download-button {
            padding: 1px 7%;
            background-color: #4CAF50;
            background-position: center;
            background-repeat: no-repeat;
            color: white;
            border: solid rgba(128,128,128,.7) .125em;
            cursor: pointer;
            font-size: 14px;
            display: inline-block;
            min-width: 80%;
            width: 98%;
            text-align: center;
            border-radius: 5px;
            box-shadow: 0 1px 5px rgba(0, 0, 0, 0.57), -3px -3px rgba(0, 0, 0, .1) inset;
            transition: transform 0.3s ease, background-color 0.3s ease;
            justify-content: center;
            font-size: 20px;
            opacity: 0.8;
        }

        .download-button:hover {
            background-color: #4C9CAF;
        }

        .post__thumbnail {
            max-width: 10%;
            min-width: 20%;
            height: auto;
            cursor: pointer;
            padding: 5px;
            border: 5px;
            display: inline-flex;
            flex-direction: column;
            flex-wrap: wrap;
            align-content: center;
            justify-content: space-between;
            align-items: center;
            margin-top: -3.5%;
        }

        .post__thumbnail img:hover {
            transform: scale(1.1);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease, background-color 0.3s ease;
        }

        .post__thumbnail img {
            cursor: pointer;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease, background-color 0.3s ease;
            border: solid rgba(128,128,128,.7) .125em;
        }

        .post-card__image-container {
            max-width: 100%;
            height: auto;
        }

        .post__files {
            display: flex;
            padding: 50px;
            border: 5px;
            max-width: 100%;
            min-width: 70%;
            flex-direction: row;
            flex-wrap: wrap;
            align-content: center;
            justify-content: center;
            align-items: center;
        }

        [data-testid='tracklist-row'] .newButtonClass {
            position: absolute;
            top: 50%;
            right: calc(100% + 10px);
            transform: translateY(-50%);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

       .post__content p img, .post__content h2 img, .post__content h3 img {
            width: 20%;
            cursor: pointer;
            border: solid rgba(128,128,128,.7) .125em;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            margin: 5px auto;
            border-radius: 10px;
            transition: transform 0.3s ease, background-color 0.3s ease;
        }
       .post__content p img:hover, .post__content h2 img:hover, .post__content h3 img:hover {
            transform: translate(50%) scale(1.5);
            z-index: 9999;
       }

       .post__content p {
         padding: 1px 7%;
         margin: 5px;
        }

        a.post__attachment-link {
            position: relative;
        }

        .post__nav-links {
            position: sticky;
            top: 0;
            z-index: 100;
            background-color: #000000ba;
            border: solid rgba(128,128,128,.7) .125em;
            border-radius: 10px;
            width:99%;
            top: 5px;
            margin: 5px auto;
        }

    `);

    const init = () => {
        addStyles();
        insertButtons();
        if (ENABLE_MUTATION_OBSERVER && window.MutationObserver) {
            new MutationObserver(() => debounce(insertButtons, 200))
                .observe(document.body, {childList: true, subtree: true});
        }
    };

    init();
})();
