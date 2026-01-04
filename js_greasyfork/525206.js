// ==UserScript==
// @name         JD_Cookie
// @version      0.7
// @description  自动更新青龙面板环境变量
// @author       Chea
// @match        https://plogin.m.jd.com/login/login*
// @match        https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      GNU GPLv3
// @connect      修改为你的青龙面板地址（示例：192.168.1.1）
// @namespace https://greasyfork.org/users/15670
// @downloadURL https://update.greasyfork.org/scripts/525206/JD_Cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/525206/JD_Cookie.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 定义配置项的键名
    const CONFIG_KEYS = {
        URL_HOST: "JD_Cookie_URL_HOST",
        CLIENT_ID: "JD_Cookie_Client_ID",
        CLIENT_SECRET: "JD_Cookie_Client_Secret"
    };

    // 从存储中获取配置，如果不存在则返回默认值
    const URL_HOST = GM_getValue(CONFIG_KEYS.URL_HOST, "");
    const Client_ID = GM_getValue(CONFIG_KEYS.CLIENT_ID, "");
    const Client_Secret = GM_getValue(CONFIG_KEYS.CLIENT_SECRET, "");

    const ENV_NAME = "JD_COOKIE";

    // 注册菜单命令，允许用户设置配置
    GM_registerMenuCommand("设置青龙面板地址", () => {
        const url = prompt("请输入青龙面板地址（例如：http://192.168.1.1:5700）：", URL_HOST);
        if (url !== null) {
            GM_setValue(CONFIG_KEYS.URL_HOST, url);
            alert("青龙面板地址已更新为：" + url);
        }
    });

    GM_registerMenuCommand("设置Client_ID", () => {
        const clientId = prompt("请输入Client_ID：", Client_ID);
        if (clientId !== null) {
            GM_setValue(CONFIG_KEYS.CLIENT_ID, clientId);
            alert("Client_ID已更新为：" + clientId);
        }
    });

    GM_registerMenuCommand("设置Client_Secret", () => {
        const clientSecret = prompt("请输入Client_Secret：", Client_Secret);
        if (clientSecret !== null) {
            GM_setValue(CONFIG_KEYS.CLIENT_SECRET, clientSecret);
            alert("Client_Secret已更新为：" + clientSecret);
        }
    });

    // 检查配置是否完整
    if (!URL_HOST || !Client_ID || !Client_Secret) {
        alert("请先设置青龙面板地址、Client_ID和Client_Secret！");
        return;
    }

    let url = window.location.href;
    console.log("当前页面URL:", url);

    if (url.indexOf("index.action?resourceValue=bean") !== -1) {
        console.log("检测到正确的页面，开始获取Cookie...");
        let ready = setInterval(async function () {
            try {
                // 使用 GM_cookie 获取 Cookie
                const cookies = await GM_cookie.list({ domain: "bean.m.jd.com" });
                console.log("从 GM_cookie 获取的Cookie:", cookies);

                if (!cookies || cookies.length === 0) {
                    console.log("未找到任何 Cookie，请检查域名是否正确。");
                    return;
                }

                let JD_cookie = "";
                for (let cookie of cookies) {
                    if (cookie.name === "pt_key" || cookie.name === "pt_pin") {
                        JD_cookie += `${cookie.name}=${cookie.value};`;
                    }
                }

                if (JD_cookie) {
                    console.log("拼接后的Cookie:", JD_cookie);
                    clearInterval(ready); // 停止定时器
                    get_token(JD_cookie);
                } else {
                    console.log("未找到 pt_key 或 pt_pin Cookie");
                }
            } catch (error) {
                console.error("获取 Cookie 时出错:", error);
            }
        }, 1000);
    }

    // 封装GM_xmlhttpRequest ---start---
    async function GM_fetch(details) {
        return new Promise((resolve, reject) => {
            switch (details.responseType) {
                case "stream":
                    details.onloadstart = (res) => {
                        resolve(res)
                    }
                    break;
                default:
                    details.onload = (res) => {
                        resolve(res)
                    };
            }

            details.onerror = (res) => {
                reject(res)
            };
            details.ontimeout = (res) => {
                reject(res)
            };
            details.onabort = (res) => {
                reject(res)
            };

            GM_xmlhttpRequest(details);
        });
    }
    // 封装GM_xmlhttpRequest ---end---

    async function get_token(JD_cookie) {
        console.log("开始获取青龙面板Token...");
        let rr = await GM_fetch({
            method: "GET",
            url: URL_HOST + "/open/auth/token?client_id=" + Client_ID + "&client_secret=" + Client_Secret,
            headers: {
                "content-type": "application/json",
            }
        });
        if (rr.status == 200) {
            console.log("成功获取青龙面板Token:", rr.responseText);
            let ql_token = JSON.parse(rr.responseText).data.token;
            console.log("青龙面板Token:", ql_token);
            let res = await GM_fetch({
                method: "GET",
                url: URL_HOST + "/open/envs?searchValue=" + ENV_NAME,
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Bearer " + ql_token,
                }
            });
            if (res.status == 200) {
                console.log("成功获取环境变量:", res.responseText);
                let envs = JSON.parse(res.responseText).data;
                if (envs.length > 0) {
                    let id = envs[0].id;
                    console.log("环境变量ID:", id);
                    let ress = await GM_fetch({
                        method: "PUT",
                        url: URL_HOST + "/open/envs",
                        headers: {
                            "content-type": "application/json",
                            "Authorization": "Bearer " + ql_token,
                        },
                        data: JSON.stringify({ "id": id, "name": ENV_NAME, "value": JD_cookie })
                    });
                    if (ress.status == 200) {
                        console.log("成功更新环境变量:", ress.responseText);
                        alert("环境变量更新成功！");
                    } else {
                        console.error("更新环境变量失败:", ress);
                        alert("环境变量更新失败，请检查青龙面板日志！");
                    }
                } else {
                    console.error("未找到环境变量:", ENV_NAME);
                    alert("未找到环境变量，请先在青龙面板中创建！");
                }
            } else {
                console.error("获取环境变量失败:", res);
                alert("获取环境变量失败，请检查青龙面板配置！");
            }
        } else {
            console.error("获取青龙面板Token失败:", rr);
            alert("获取青龙面板Token失败，请检查Client_ID和Client_Secret！");
        }
    }
})();