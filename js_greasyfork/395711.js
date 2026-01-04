// ==UserScript==
// @name         AtCoder Problems Marker
// @namespace    iilj
// @version      2020.6.26.1
// @description  AtCoder Problems 上に表示される問題にユーザが独自のマーカー（解説ACなど）を付けられるようにします
// @author       iilj
// @supportURL   https://github.com/iilj/AtCoderProblemsExt/issues
// @match        https://kenkoooo.com/atcoder/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.contextMenu.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.ui.position.js
// @resource     css_contextmenu https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.contextMenu.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/395711/AtCoder%20Problems%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/395711/AtCoder%20Problems%20Marker.meta.js
// ==/UserScript==

/* globals $ */

(function () {
    'use strict';

    GM_addStyle(GM_getResourceText('css_contextmenu'));
    GM_addStyle(`
td.table-problem.apm-ac-after-reading-answer {
    background-color: #ffff88 !important;
}
    `);

    /**
     * key for localStorage to save ac-after-reading-answer state
     * @type {string}
     */
    const localStorageKey = "apm-hashset";
    /**
     * json string loaded from localStorage, or to save on localStorage
     * @type {string}
     */
    let json;
    /**
     * hashset to store whether the problem is marked as ac-after-reading-answer or not
     * @type {{[key:string]: number}}
     */
    let hash;
    /**
     * user id of AtCoder
     * @type {string}
     */
    let userId;

    /**
     * load ac-after-reading-answer state from localStorage
     */
    const loadHash = () => {
        json = localStorage.getItem(localStorageKey);
        hash = json ? JSON.parse(json) : {};
    }
    /**
     * save ac-after-reading-answer state to localStorage
     */
    const saveHash = () => {
        json = JSON.stringify(hash);
        localStorage.setItem(localStorageKey, json);
    }
    /**
     * url of problem -> key of hash
     *
     * @param {string} href
     * @returns {string | null} key of hash if valid url supplied, otherwise null
     */
    const href2key = (href) => {
        let result
        if (result = href.match(/^https?:\/\/atcoder\.jp\/contests\/([^\/]+)\/tasks\/([^\/]+)$/)) {
            return `${userId}/${result[1]}/${result[2]}`;
        }
        return null;
    };

    $.contextMenu({
        selector: '.table-problem',
        callback: (key, options) => {
            switch (key) {
                case "ac_after_reading_answer": {
                    const td = options.$trigger;
                    const href = td.find('a[href]').attr('href');
                    const key = href2key(href);
                    if (key in hash) {
                        delete hash[key];
                    } else {
                        hash[key] = 0;
                    }
                    td.toggleClass('apm-ac-after-reading-answer');
                    saveHash();
                    break;
                }
                case "about":
                    alert("解説ACした問題を Table ページ上でマークできます．マークした結果はブラウザに保存されます．");
            }
        },
        items: {
            "ac_after_reading_answer": { name: "解説AC On/Off" },
            "sep1": "---------",
            "about": { name: "About" }
        }
    });

    /**
     * Table 表示ページで "Show Accepted" の変更検知に利用する MutationObserver
     *
     * @type {MutationObserver}
     */
    let tableObserver;

    /**
     * Table 表示ページで表のセルの色を塗り分ける．
     *
     * @date 2020-01-27
     * @param {string} userId
     */
    const processTable = () => {
        const tableChanged = () => {
            if (tableObserver) {
                tableObserver.disconnect();
            }
            document.querySelectorAll('.table-problem').forEach(td => {
                const lnk = td.querySelector('a[href]');
                if (!lnk) {
                    return;
                }
                const key = href2key(lnk.href);
                if (!key) {
                    return;
                }
                if (key in hash) {
                    td.classList.add('apm-ac-after-reading-answer');
                }
            });
            if (tableObserver) {
                document.querySelectorAll('.react-bs-container-body').forEach(div => {
                    tableObserver.observe(div, { childList: true, subtree: true });
                });
            }
        };

        tableObserver = new MutationObserver(mutations => tableChanged());
        tableChanged();
        document.querySelectorAll('.react-bs-container-body').forEach(div => {
            tableObserver.observe(div, { childList: true, subtree: true });
        });
    }

    /**
     * ページ URL が変化した際のルートイベントハンドラ．
     *
     * @date 2020-01-27
     */
    const hrefChanged = () => {
        if (tableObserver) {
            tableObserver.disconnect();
        }

        /** @type {RegExpMatchArray} */
        let result;
        if (result = location.href.match(/^https?:\/\/kenkoooo\.com\/atcoder\/#\/table\/([^/?#]+)/)) {
            userId = result[1];
            processTable();
        }
    };

    // main
    loadHash();

    let href = location.href;
    const observer = new MutationObserver(mutations => {
        if (href === location.href) {
            return;
        }
        // href changed
        href = location.href;
        hrefChanged();
    });
    observer.observe(document, { childList: true, subtree: true });
    hrefChanged();
})();