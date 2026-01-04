// ==UserScript==
// @name         qb菜单中增加恢复已完成种子功能
// @name:en      enable resuming all completed from qB-WebUI
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  只恢复已完成种子的做种状态
// @description:en add button to qb WebUI, only resume COMPLETED torrents.
// @author       flashlab
// @match        http://localhost:8080/
// @icon         https://www.qbittorrent.org/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490245/qb%E8%8F%9C%E5%8D%95%E4%B8%AD%E5%A2%9E%E5%8A%A0%E6%81%A2%E5%A4%8D%E5%B7%B2%E5%AE%8C%E6%88%90%E7%A7%8D%E5%AD%90%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/490245/qb%E8%8F%9C%E5%8D%95%E4%B8%AD%E5%A2%9E%E5%8A%A0%E6%81%A2%E5%A4%8D%E5%B7%B2%E5%AE%8C%E6%88%90%E7%A7%8D%E5%AD%90%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==
/* globals torrentsTable CATEGORIES_ALL TAGS_ALL TRACKERS_ALL */
(function() {
    'use strict';
    const action_key = "开始"; //<= 引号中可替换为"暂停"
    const baseURL = window.location.origin + '/api/v2/torrents/';
    const req = (action, data) => {
        const url = baseURL + action;
        try {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: data
            }).then(response => {
                //console.log(response);
                if (response.status >= 400) throw new Error('Bad response from server');
            }).catch(error => {
                console.error(action, error);
                alert(`操作失败！请检查网络！`)
            });
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
    const nav = document.querySelector('#desktopNavbar>ul>li:nth-of-type(2)>ul');
    if (!nav) return;
    nav.insertAdjacentHTML('afterbegin', `<li>
    <a id="resumeCompleted">
    <img class="MyMenuIcon" width="16" height="16" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='2 0 25 25'>
    <text y='1em' font-size='21'>✔️</text></svg>">全部${action_key}已完成</a></li>`);
    document.getElementById('resumeCompleted').addEventListener('click', async (e) => {
        const tList = torrentsTable.getFilteredTorrentsHashes('completed', CATEGORIES_ALL, TAGS_ALL, TRACKERS_ALL);
        if(confirm(`是否${action_key} ${tList.length} 个种子？`)) {
            await req(action_key == '开始' ? 'resume': 'pause', new URLSearchParams({
                'hashes': tList.join('|')
            }));
            alert('已完成！')
        }
    })
})();