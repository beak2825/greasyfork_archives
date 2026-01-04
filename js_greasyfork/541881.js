// ==UserScript==
// @name         开始做站
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  按 Alt+2 后在后台打开一组 WordPress 后台页面（无菜单）
// @author       hsopen
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @connect      cdn.jsdelivr.net
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/541881/%E5%BC%80%E5%A7%8B%E5%81%9A%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/541881/%E5%BC%80%E5%A7%8B%E5%81%9A%E7%AB%99.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const configUrl = "https://raw.githubusercontent.com/hsopen/nai-helper/main/start-dev-config.json";

    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === '2') {
            e.preventDefault();

            console.log('[开始做站] Alt+2 被按下，正在加载配置...');

            // 获取配置文件
            GM_xmlhttpRequest({
                method: "GET",
                url: configUrl,
                onload: function (response) {
                    if (response.status !== 200) {
                        console.error('[开始做站] 加载配置失败', response.status);
                        return;
                    }

                    let configList;
                    try {
                        configList = JSON.parse(response.responseText);
                    } catch (e) {
                        console.error('[开始做站] 配置解析失败', e);
                        return;
                    }

                    const html = document.documentElement.innerHTML;

                    // 查找匹配的 name
                    const matched = configList.find(item => html.includes(item.name));

                    if (!matched) {
                        console.warn('[开始做站] 当前页面未匹配到任何站点名');
                        return;
                    }

                    const baseURL = location.origin;
                    for (const path of matched.openTabPath) {
                        GM_openInTab(baseURL + path, { active: false, insert: true });
                    }

                    console.log(`[开始做站] 已匹配站点 "${matched.name}"，后台页面正在打开`);
                },
                onerror: function (err) {
                    console.error('[开始做站] 网络请求失败', err);
                }
            });
        }
    });

})();
