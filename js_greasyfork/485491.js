// ==UserScript==
// @name             为 qBittorrent 的tracker列表增加筛选
// @name:en          add tracker list filter for qBitorrent webUI
// @namespace        localhost
// @version          0.2
// @description      在webUI的右键菜单中增加批量复制字段的功能，可直接粘贴到excel
// @description:en   add a contextmenu item to batch copy torrent information in order to pasting to Excel
// @author           flashlab
// @match            http://127.0.0.1:8080/
// @icon             https://www.qbittorrent.org/favicon.ico
// @license          MIT
// @run-at           document-end
// @downloadURL https://update.greasyfork.org/scripts/485491/%E4%B8%BA%20qBittorrent%20%E7%9A%84tracker%E5%88%97%E8%A1%A8%E5%A2%9E%E5%8A%A0%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/485491/%E4%B8%BA%20qBittorrent%20%E7%9A%84tracker%E5%88%97%E8%A1%A8%E5%A2%9E%E5%8A%A0%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const newItem = `<input id="trackersFilterInput" type="text" placeholder="过滤 tracker 列表..." autocomplete="off" autocorrect="off" autocapitalize="none" style="
    background-image: url(../images/trackers.svg);
    background-repeat: no-repeat;
    background-size: 1.3em;
    padding: 0 0 0 1.5em;
    width: 120px;
    margin: 0.2em;
    font-size: 13px;">`
    window.addEventListener('load', function () {
        function waitForElm(selector) {
            return new Promise(resolve => {
                if (document.querySelector(selector)) {
                    return resolve(document.querySelector(selector));
                }
                const observer = new MutationObserver(mutations => {
                    if (document.querySelector(selector)) {
                        observer.disconnect();
                        resolve(document.querySelector(selector));
                    }
                });
                observer.observe(document.querySelector('#Filters'), {
                    childList: true,
                    subtree: true
                });
            });
        }
        waitForElm('#trackerFilterList>li>a>img').then((el) => {
            const trackerlist = document.getElementById('trackerFilterList');
            if (!trackerlist) return;
            const lists = trackerlist.children
            if (lists.length == 0) return;
            trackerlist.insertAdjacentHTML('beforebegin', newItem)
            const filterInput = document.getElementById('trackersFilterInput');
            filterInput.style.backgroundImage = `url(${lists[0].querySelector('img').src})`;
            function reset() {
                Array.from(trackerlist.querySelectorAll('li.invisible')).forEach(
                  (el) => el.classList.remove('invisible')
                );
            }
            filterInput.addEventListener('keyup', function (e) {
                const key = new RegExp(e.target.value, 'gi');
                if( e.target.value.length < 2) return reset();
                Array.from(lists).slice(1).forEach(
                    (el) => el.classList.toggle('invisible', !el.innerText.match(key))
                )
            })
        })
    })
})();