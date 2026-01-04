// ==UserScript==
// @name         拷贝漫画书架显示上次观看章节
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  我的书架中展示上次阅读章节，并可以直接跳转阅读。
// @author       xx
// @match        *://*.copymanga.com/*
// @match        *://*.copymanga.org/*
// @match        *://*.copymanga.net/*
// @match        *://*.copymanga.info/*
// @match        *://*.copymanga.site/*
// @match        *://*.copymanga.tv/*
// @match        *://copymanga.com/*
// @match        *://copymanga.org/*
// @match        *://copymanga.net/*
// @match        *://copymanga.info/*
// @match        *://copymanga.site/*
// @match        *://copymanga.tv/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483295/%E6%8B%B7%E8%B4%9D%E6%BC%AB%E7%94%BB%E4%B9%A6%E6%9E%B6%E6%98%BE%E7%A4%BA%E4%B8%8A%E6%AC%A1%E8%A7%82%E7%9C%8B%E7%AB%A0%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/483295/%E6%8B%B7%E8%B4%9D%E6%BC%AB%E7%94%BB%E4%B9%A6%E6%9E%B6%E6%98%BE%E7%A4%BA%E4%B8%8A%E6%AC%A1%E8%A7%82%E7%9C%8B%E7%AB%A0%E8%8A%82.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const OriginalXMLHttpRequest = window.XMLHttpRequest;

    window.XMLHttpRequest = function() {
        const xhr = new OriginalXMLHttpRequest();

        xhr.addEventListener('readystatechange', function() {
            if (xhr.readyState === 4) {
                const url = xhr.responseURL;
                if (!url.includes('/member/collect/comics')) return;
                const response = JSON.parse(xhr.response);
                const list = response.results.list.map(item => ({ ...(item.last_browse || {}), path_word: item.comic.path_word }));
                changeView(list)
            }
        });

        return xhr;
    };

    function changeView(list) {
        setTimeout(() => {
          const main = document.getElementsByClassName('man_')[0];
           Array.from(main.children).forEach((child, index) => {
               child.style.position = 'relative';
               const current = list[index];
               const lastP = child.querySelector(`#${current.path_word}`);
               if (lastP) child.removeChild(lastP);
               const p = document.createElement('p');
               p.id = current.path_word;
               p.innerHTML = current.last_browse_id ? `<a href="/comic/${current.path_word}/chapter/${current.last_browse_id}" target='_blank'>上次阅读:  ${current.last_browse_name}</a>` : '还没看过';
               p.style.width = '100%';
               p.style.position = 'absolute';
               p.style.bottom = '10px';
               child.appendChild(p);
          })
        }, 0)
    }
})();