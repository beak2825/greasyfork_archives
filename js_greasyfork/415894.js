// ==UserScript==
// @name         atcoder-standings-lang
// @namespace    iilj
// @version      2020.11.12.0
// @description  AtCoder の順位表に最多提出言語を追加します．uesugi6111 さん作のスクリプトが元ネタです．
// @author       iilj
// @supportURL   https://github.com/iilj/atcoder-standings-lang/issues
// @match        https://atcoder.jp/contests/*/standings*
// @downloadURL https://update.greasyfork.org/scripts/415894/atcoder-standings-lang.user.js
// @updateURL https://update.greasyfork.org/scripts/415894/atcoder-standings-lang.meta.js
// ==/UserScript==

/* globals $ */

/**
 * ユーザID/言語ごとの提出数
 * @typedef {Object} UserLangEntry
 * @property {string} user_id ユーザ ID
 * @property {string} language 言語名
 * @property {number} count 提出数
 */

(() => {
    'use strict';

    /** @type {Map<string, UserLangEntry[]>} */
    const userLangEntryMap = new Map();

    const fetchLangJson = async () => {
        console.log('@kenkooooさんありがとう');
        console.log('うえすぎさんありがとう');
        // 2e5 個くらい要素があるのでキャッシュする
        const res = await fetch("https://kenkoooo.com/atcoder/resources/lang.json", { cache: 'force-cache' });
        /** @type {UserLangEntry[]} */
        const userLangEntries = await res.json();

        // prepare map
        userLangEntries.forEach(userLangEntry => {
            if (userLangEntryMap.has(userLangEntry.user_id)) {
                userLangEntryMap.get(userLangEntry.user_id).push(userLangEntry);
            } else {
                userLangEntryMap.set(userLangEntry.user_id, [userLangEntry]);
            }
        });

        // sort arrays
        userLangEntryMap.forEach(userLangArray => {
            userLangArray.sort((a, b) => b.count - a.count); // in place
        });
    };

    /** @type {(anchor: HTMLAnchorElement) => void} */
    const updateAnchor = (anchor) => {
        if (!anchor.href.includes('/users/')) return;

        const user_id = anchor.text.trim();
        if (!userLangEntryMap.has(user_id)) return;

        const userLangArray = userLangEntryMap.get(user_id);

        const tooltipHtml = userLangArray.map((userLangEntry) =>
            `${userLangEntry.language} : ${userLangEntry.count}`
        ).join('<br>');

        let langHtml = userLangArray[0].language;
        if (userLangArray.length >= 2) {
            langHtml += '<div style="font-size:10px;display:inline;">'
                + `/${userLangArray[1].language}`
                + (userLangArray.length >= 3 ? `/${userLangArray[2].language}` : '')
                + ' </div>';
        }

        anchor.insertAdjacentHTML('beforeend',
            '/'
            + '<div data-toggle="tooltip" data-html="true" data-placement="right" style="font-size:12px;display:inline;" title="'
            + tooltipHtml + '">'
            + langHtml
            + '</div>');
    };

    /** @type {(tbody: HTMLTableSectionElement) => void} */
    const updateTable = (tbody) => {
        tbody.querySelectorAll('.username').forEach(anchor => {
            updateAnchor(anchor);
        });
        $('[data-toggle="tooltip"]').tooltip();
    };

    /** @type {HTMLTableSectionElement} */
    let tbody = null;

    const tableObserver = new MutationObserver(() => {
        updateTable(tbody);
    });
    const parentObserver = new MutationObserver(async () => {
        tbody = document.getElementById('standings-tbody');
        if (tbody) {
            parentObserver.disconnect();
            await fetchLangJson();
            updateTable(tbody);
            tableObserver.observe(
                tbody,
                { childList: true }
            )
        }
    });
    parentObserver.observe(
        document.getElementById('vue-standings'),
        { childList: true, subtree: true }
    );
})();
