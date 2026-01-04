// ==UserScript==
// @name         Open2ch Imgur一括削除
// @namespace    https://onjmin.glitch.me/
// @version      1.0.0
// @description  ポチポチせず削除できる
// @author       おんJ民
// @match        https://hayabusa.open2ch.net/setting/imgur_history.cgi
// @icon         https://avatars.githubusercontent.com/u/88383494
// @grant        GM.registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @license      GNU Affero General Public License v3.0 or later
// @downloadURL https://update.greasyfork.org/scripts/540927/Open2ch%20Imgur%E4%B8%80%E6%8B%AC%E5%89%8A%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/540927/Open2ch%20Imgur%E4%B8%80%E6%8B%AC%E5%89%8A%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const key = "clientId";

    GM.registerMenuCommand('Imgur APIのClient-ID登録', async () => {
        const clientId = await GM.getValue(key);
        const v = prompt(`Imgur APIのClient-ID入力（現在値：${clientId}）`);
        if (v) GM.setValue(key, v);
    });

    // [[deletehash, imgurID]...]
    const extractDeleteList = () => [...document.querySelectorAll("a")].map(v=>v.href).flatMap(v=>v.match(/imgur_delete.+:.+:/)?.[0] ?? []).map(v => v.slice(0,-1).split(/\=|:/).slice(-2));

    const onClick = async () => {
        const list = extractDeleteList();

        if (!list.length) {
            alert('削除対象が見つかりませんでした');
            return;
        }

        if (!confirm(`${list.length} 件を本当に削除しますか？`)) return;
        const clientId = await GM.getValue(key);
        if (!clientId) return alert("Imgur APIのClient-ID登録を済ませてください");

        for (const [deletehash, imgurID] of list) {
            try {
                const res = await fetch(`https://api.imgur.com/3/image/${deletehash}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Client-ID ${clientId}`
                    }
                });
                const json = await res.json();
                json.success
                    ? console.log(`Deleted: ${imgurID}`)
                : console.warn(`Failed: ${imgurID}`, json);
            } catch (err) {
                console.error(`Error deleting ${imgurID}:`, err);
            }
        }

        alert('削除処理が完了しました（詳細はコンソールを確認）');
    };

    const button = Object.assign(document.createElement('button'), {
        textContent: 'Imgur Bulk Delete',
        style: `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                padding: 10px 15px;
                background-color: #d9534f;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            `
    });
    button.addEventListener('click', onClick);
    document.body.appendChild(button);
})();