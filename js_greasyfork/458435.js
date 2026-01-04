// ==UserScript==
// @name 力扣中文站重定向到 LeetCode 国际站
// @namespace https://greasyfork.org/zh-CN/users/459661-cycychenyi
// @version 0.1.1
// @description 如果当前链接在 LeetCode 国际站可访问，则重定向。如果当前链接在 LeetCode 国际站不可访问（比如力扣中文站独家题库），则不做处理。
// @author cycychenyi
// @match https://leetcode.cn/*
// @match https://leetcode-cn.com/*
// @grant GM_xmlhttpRequest
// @connect leetcode.com
// @downloadURL https://update.greasyfork.org/scripts/458435/%E5%8A%9B%E6%89%A3%E4%B8%AD%E6%96%87%E7%AB%99%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%20LeetCode%20%E5%9B%BD%E9%99%85%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/458435/%E5%8A%9B%E6%89%A3%E4%B8%AD%E6%96%87%E7%AB%99%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%20LeetCode%20%E5%9B%BD%E9%99%85%E7%AB%99.meta.js
// ==/UserScript==

async function redirectIfPossible() {
    const redirectUrl = getRedirectUrl('leetcode.com');
    if (await isValidUrl(redirectUrl)) {
        redirect(redirectUrl);
    }
}

function getRedirectUrl(redirectHostname) {
    const url = new URL(location.href);
    url.hostname = redirectHostname;
    return url;
}

async function isValidUrl(url) {
    const response = await visit(url);
    return response.status == 200;
}

function visit(url) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: response => resolve(response)
        });
    });
}

function redirect(url) {
    location.assign(url);
}

redirectIfPossible();
