// ==UserScript==
// @name         AutoDL 弹性部署显示 JupyterLab 链接
// @namespace    http://tampermonkey.net/
// @version      2025-12-18
// @description  AutoDL 弹性部署，容器列表，每个链接后面添加 JupyterLab 链接。
// @author       Ganlv
// @match        https://www.autodl.com/login*
// @match        https://www.autodl.com/subAccountLogin*
// @match        https://www.autodl.com/deploy*
// @match        https://www.autodl.com/console*
// @icon         https://www.autodl.com/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531233/AutoDL%20%E5%BC%B9%E6%80%A7%E9%83%A8%E7%BD%B2%E6%98%BE%E7%A4%BA%20JupyterLab%20%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/531233/AutoDL%20%E5%BC%B9%E6%80%A7%E9%83%A8%E7%BD%B2%E6%98%BE%E7%A4%BA%20JupyterLab%20%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    (async () => {
        while (true) {
            const matches = location.href.match(/\/deploy\/details\/([A-Za-z0-9]+?)\//);
            if (matches) {
                const deployment_uuid = matches[1];
                if (Array.from(document.querySelectorAll('tr.el-table__row > td:nth-child(6) .icon-fuzhi')).some(el => !el.parentElement.parentElement.querySelector('.jupyter-link'))) {
                    const isSubUser = Boolean(JSON.parse(localStorage.getItem('user'))?.sub_name)
                    const res = await fetch(isSubUser ? '/api/v1/sub_user/deployment/container/list': '/api/v1/deployment/container/list', {
                        method: 'POST',
                        headers: {
                            'Authorization': localStorage.getItem('token'),
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            deployment_uuid,
                            page_index: 1,
                            page_size: 100,
                        }),
                    }).then(res => res.json());
                    const serviceUrlMap = res.data.list.reduce((acc, v) => ({ ...acc, [v.uuid]: v.info.service_6006_port_url }), {});
                    const service6008UrlMap = res.data.list.reduce((acc, v) => ({ ...acc, [v.uuid]: v.info.service_6008_port_url }), {});
                    const jupyterUrlMap = res.data.list.reduce((acc, v) => ({ ...acc, [v.uuid]: `${v.info.service_6006_port_url.replace(/^https:\/\/u(\d+)-.*?\./, `https://a\$1-${v.uuid.slice(-13)}.`)}/jupyter?token=${v.info.jupyter_token}` }), {});
                    console.log(jupyterUrlMap);
                    document.querySelectorAll('.service-link').forEach(el => el.remove());
                    document.querySelectorAll('.jupyter-link').forEach(el => el.remove());
                    document.querySelectorAll('tr.el-table__row').forEach(el => {
                        const uuid = el.querySelector('td:nth-child(1) > div.cell > div > div:nth-child(2)').textContent;
                        const cellEl = el.querySelector('td:nth-child(7) .cell');
                        if (cellEl) {
                            cellEl.style.display = 'none';
                            if (serviceUrlMap[uuid]) {
                                const a = document.createElement('a');
                                a.href = serviceUrlMap[uuid];
                                a.target = '_blank';
                                a.className = 'service-link';
                                a.textContent = '6006:↗️';
                                a.style = 'display: block; padding-left: 10px; text-decoration: none';
                                cellEl.parentElement.appendChild(a);
                            }
                            if (service6008UrlMap[uuid]) {
                                const a = document.createElement('a');
                                a.href = service6008UrlMap[uuid];
                                a.target = '_blank';
                                a.className = 'service-link';
                                a.textContent = '6008:↗️';
                                a.style = 'display: block; padding-left: 10px; text-decoration: none';
                                cellEl.parentElement.appendChild(a);
                            }
                            if (jupyterUrlMap[uuid]) {
                                const a = document.createElement('a');
                                a.href = jupyterUrlMap[uuid];
                                a.target = '_blank';
                                a.className = 'jupyter-link';
                                a.innerHTML = 'JupyterLab';
                                a.style = 'display: block; padding-left: 10px; text-decoration: none';
                                cellEl.parentElement.appendChild(a);
                            }
                        }
                    });
                }
            }
            await sleep(1000);
        }
    })();
})();