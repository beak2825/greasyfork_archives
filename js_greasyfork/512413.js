// ==UserScript==
// @name         Nyaa Enhancer
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  調整帖子欄寬、增加帖子序號、增加作者連結、增加下載連結
// @license MIT
// @author       scbmark
// @match        https://sukebei.nyaa.si/*
// @match        https://nyaa.si/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/512413/Nyaa%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/512413/Nyaa%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const configCss = `
        #gm_config {
            background: #fff;
            color: #000;
        }
        .config_header {
            background: #444;
            color: #fff;
            padding: 6px;
        }
    `;

    GM_addStyle(configCss);

    const GM_config = {
        fields: {
            qb_host: {
                label: "qBittorrent 位置 (例: http://192.168.1.100:8080)",
                type: "text",
                default: "http://192.168.1.100:8080"
            },
            qb_username: {
                label: "帳號",
                type: "text",
                default: "admin"
            },
            qb_password: {
                label: "密碼",
                type: "password",
                default: "adminadmin"
            }
        },
        open: function () {
            const html = `
                <div id="gm_config">
                    <div class="config_header">設定 qBittorrent 資訊</div>
                    <label>${this.fields.qb_host.label}<br>
                        <input id="gm_host" type="text" value="${GM_getValue('qb_host', this.fields.qb_host.default)}">
                    </label><br><br>
                    <label>${this.fields.qb_username.label}<br>
                        <input id="gm_user" type="text" value="${GM_getValue('qb_username', this.fields.qb_username.default)}">
                    </label><br><br>
                    <label>${this.fields.qb_password.label}<br>
                        <input id="gm_pass" type="password" value="${GM_getValue('qb_password', this.fields.qb_password.default)}">
                    </label><br><br>
                    <button id="gm_save">儲存</button>
                    <button id="gm_cancel">取消</button>
                </div>
            `;
            const wrapper = document.createElement('div');
            wrapper.innerHTML = html;
            Object.assign(wrapper.style, {
                position: 'fixed',
                top: '20%',
                left: '30%',
                padding: '20px',
                border: '2px solid #333',
                zIndex: 9999,
                background: '#fff'
            });
            document.body.appendChild(wrapper);

            wrapper.querySelector('#gm_save').onclick = () => {
                GM_setValue('qb_host', document.getElementById('gm_host').value);
                GM_setValue('qb_username', document.getElementById('gm_user').value);
                GM_setValue('qb_password', document.getElementById('gm_pass').value);
                document.body.removeChild(wrapper);
                alert('已儲存設定');
                window.location.reload();
            };

            wrapper.querySelector('#gm_cancel').onclick = () => {
                document.body.removeChild(wrapper);
            };
        }
    };

    GM_registerMenuCommand("⚙ 設定 qBittorrent", () => GM_config.open());

    const QB_HOST = GM_getValue('qb_host', 'http://192.168.1.100:8080');
    const QB_USERNAME = GM_getValue('qb_username', 'admin');
    const QB_PASSWORD = GM_getValue('qb_password', 'adminadmin');

    function addSubmitterLink() {
        const h3 = document.querySelector('h3');
        const span = h3.querySelector('span');
        if (span) {
            const text = span.textContent;
            const link = document.createElement('a');
            link.href = 'https://sukebei.nyaa.si/user/' + text;
            link.textContent = text;

            span.parentNode.replaceChild(link, span);
        }
    }

    function changeWidth() {
        var containers = document.getElementsByClassName('container');

        for (var i = 0; i < containers.length; i++) {
            containers[i].style.width = '90%';
        }
    }


    function addNumbering() {
        const table = document.querySelector('table');
        if (!table) return;

        const rows = Array.from(table.querySelectorAll('tr'));

        rows.forEach((row, index) => {
            const numberCell = document.createElement(index === 0 ? 'th' : 'td');
            numberCell.style.fontWeight = 'bold';
            numberCell.style.width = '30px';
            numberCell.style.textAlign = 'center';
            numberCell.textContent = index === 0 ? '序號' : index;
            row.appendChild(numberCell, row.firstChild);
        });
    }

    function addMagnetDownloadButton() {
        const links = Array.from(document.querySelectorAll('a[href^="magnet:"]'));
        for (const link of links) {
            const magnet = link.href;

            const btn = document.createElement('button');
            btn.innerText = '送到 qB';
            btn.style.marginLeft = '5px';
            btn.style.padding = '2px 6px';
            btn.style.fontSize = '12px';

            btn.addEventListener('click', () => {
                loginAndAddTorrent(magnet);
            });

            link.insertAdjacentElement('afterend', btn);
        }
    }

    function loginAndAddTorrent(magnet) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: `${QB_HOST}/api/v2/auth/login`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: `username=${encodeURIComponent(QB_USERNAME)}&password=${encodeURIComponent(QB_PASSWORD)}`,
            onload: function (response) {
                if (response.status === 200) {
                    addMagnet(magnet);
                } else {
                    alert('登入失敗');
                }
            }
        });
    }

    function addMagnet(magnet) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: `${QB_HOST}/api/v2/torrents/add`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: `urls=${encodeURIComponent(magnet)}`,
            onload: function (response) {
                if (response.status === 200) {
                    console.log('成功', '已成功加入 qBittorrent');
                } else {
                    alert('失敗', '加入失敗，狀態碼: ' + response.status);
                }
            }
        });
    }

    window.addEventListener('load', addSubmitterLink);
    window.addEventListener('load', changeWidth);
    window.addEventListener('load', addNumbering);
    window.addEventListener('load', addMagnetDownloadButton);
})();