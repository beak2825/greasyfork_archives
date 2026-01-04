// ==UserScript==
// @name         bdmozon 自动切换账号登录
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在登录页面插入账号切换菜单，自动获取 Cookie 设置登录态
// @match        https://www.bdmozon.com/authentication/login
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      124.222.55.161
// @license      TANGMING

// @downloadURL https://update.greasyfork.org/scripts/544394/bdmozon%20%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%B4%A6%E5%8F%B7%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/544394/bdmozon%20%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%B4%A6%E5%8F%B7%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const userList = ['2304', '2301', '2302','2305','li5371901','2306']; // 自行修改

    // 插入账号选择面板
    const panel = document.createElement('div');
    panel.innerHTML = `
        <div id="userSwitcher">
            <label>选择账号:</label>
            <select id="accountSelector">
                ${userList.map(u => `<option value="${u}">${u}</option>`).join('')}
            </select>
            <button id="loginByCookie">登录</button>
        </div>
    `;
    document.body.appendChild(panel);

    GM_addStyle(`
        #userSwitcher {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 9999;
            font-size: 14px;
        }
    `);

    // 登录按钮点击事件
    document.getElementById('loginByCookie').onclick = () => {
        const username = document.getElementById('accountSelector').value;
        console.log(`请求 Cookie：${username}`);

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://124.222.55.161:31695/get_bdm_cookie',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ username }),
            onload: function (response) {
                try {
                    const result = JSON.parse(response.responseText);

                    if (result.code === 200 && result.data && result.data.cookie) {
                        const rawCookies = result.data.cookie; // 是一个字符串
                        document.cookie = `Authorization=${rawCookies}; path=/; domain=bdmozon.com`;
                        console.log("设置 Cookie:", rawCookies);

                        alert("Cookie 设置成功，请刷新页面");
                    } else {
                        alert("获取 Cookie 失败：" + result.msg);
                    }
                } catch (e) {
                    alert("解析 Cookie 出错：" + e.message);
                }
            },
            onerror: function (err) {
                alert("请求失败：" + JSON.stringify(err));
            }
        });
    };
})();