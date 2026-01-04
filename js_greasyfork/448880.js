// ==UserScript==
// @name              原神米游社签到
// @version           0.1.5
// @description       【已失效】在网页端执行米游社原神每日签到
// @author            asadahimeka
// @namespace         https://www.nanoka.top
// @license           MIT
// @match             https://bbs.mihoyo.com/ys*
// @require           https://cdn.jsdelivr.net/npm/js-md5@0.7.3/build/md5.min.js
// @source            https://github.com/asadahimeka/userscripts
// @supportURL        https://github.com/asadahimeka/userscripts/issues
// @connect           api-takumi.mihoyo.com
// @grant             GM_xmlhttpRequest
// @grant             GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/448880/%E5%8E%9F%E7%A5%9E%E7%B1%B3%E6%B8%B8%E7%A4%BE%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/448880/%E5%8E%9F%E7%A5%9E%E7%B1%B3%E6%B8%B8%E7%A4%BE%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
  "use strict";
  ;
  /*!
   * Forked from https://greasyfork.org/zh-CN/scripts/432059
   * Copyright © 苏芣苡 (https://space.bilibili.com/52159566)
   * License MIT
   */
  const APP_VERSION = "2.33.1";
  const CLIENT_TYPE = "4";
  const USER_AGENT = `Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/${APP_VERSION}`;
  const REFERER = "https://webstatic.mihoyo.com/bbs/event/signin-ys/index.html?bbs_auth_required=true&act_id=e202009291139501&utm_source=bbs&utm_medium=mys&utm_campaign=icon";
  const HOST = "api-takumi.mihoyo.com";
  const GET_ROLE_URL = "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn";
  const SIGN_URL = "https://api-takumi.mihoyo.com/event/bbs_sign_reward/sign";
  const DEVICE_ID = "7ab3bc70b846186b9da1e816e6c6f08d";
  function getDS() {
    const s = "1OUn34iIy84ypu9cpXyun2VaQ2zuFeLm";
    const t = Math.floor(Date.now() / 1e3);
    const r = Math.random().toString(36).slice(-6);
    const c = `salt=${s}&t=${t}&r=${r}`;
    const ds = `${t},${r},${md5(c)}`;
    return ds;
  }
  function getHeaders() {
    return {
      "User-Agent": USER_AGENT,
      "Referer": REFERER,
      "Host": HOST,
      "DS": getDS(),
      "x-rpc-app_version": APP_VERSION,
      "x-rpc-client_type": CLIENT_TYPE,
      "x-rpc-device_id": DEVICE_ID,
      "Cookie": localStorage.MYS_COOKIE || document.cookie
    };
  }
  function request(url, { headers, body, method } = {}) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url,
        method,
        data: body,
        headers,
        onload: (xhr) => resolve({ json: () => JSON.parse(xhr.responseText) }),
        onerror: reject
      });
    });
  }
  async function getUserGameRolesByCookie() {
    const resp = await request(GET_ROLE_URL, {
      headers: getHeaders(),
      method: "GET"
    });
    const { retcode, data, message } = await resp.json();
    if (retcode != 0)
      throw new Error(message);
    return data.list;
  }
  async function sign({ region, game_uid: uid, region_name, nickname, level }) {
    const resp = await request(SIGN_URL, {
      headers: getHeaders(),
      body: JSON.stringify({ act_id: "e202009291139501", region, uid }),
      method: "POST"
    });
    const { message } = await resp.json();
    const now = new Date().toLocaleString("zh-cn-u-hc-h23");
    if (message !== 'OK') localStorage.removeItem('MYS_COOKIE');
    const tips = `${now}
\u3010${region_name}\u3011\u2014 ${nickname}
\u3010Lv : ${level}\u3011\u2014 ${uid}
\u7B7E\u5230\u7ED3\u679C\uFF1A${message}`;
    return tips;
  }
  async function pushNotice(content) {
    alert(content);
  }
  async function runCommand() {
    try {
      if (!document.cookie.includes("cookie_token=") && !localStorage.MYS_COOKIE) {
        localStorage.MYS_COOKIE = prompt("\u8F93\u5165\u7C73\u6E38\u793E Cookie") || '';
      }
      const list = await getUserGameRolesByCookie();
      for (const item of list) {
        const tips = await sign(item);
        await pushNotice(tips);
      }
    } catch (error) {
      localStorage.removeItem('MYS_COOKIE')
      await pushNotice(`\u7B7E\u5230\u5931\u8D25\uFF1A${error.message}`);
    }
  }
  GM_registerMenuCommand("\u7B7E\u5230", runCommand);
})();
