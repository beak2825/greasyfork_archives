// ==UserScript==
// @name              MIUI 主题下载器
// @namespace         https://github.com/vcheckzen/MIUIThemeDownloader
// @version           1.1.1
// @icon              http://www.xiaomi.com/favicon.ico
// @description       恢复 MIUI 主题官网的下载按钮
// @author            https://github.com/vcheckzen
// @supportURL        https://github.com/vcheckzen/MIUIThemeDownloader/issues
// @require           https://cdn.jsdelivr.net/npm/jquery/dist/jquery.slim.min.js
// @match             *zhuti.xiaomi.com/detail/*
// @grant             GM_xmlhttpRequest
// @run-at            document-end
// @downloadURL https://update.greasyfork.org/scripts/374648/MIUI%20%E4%B8%BB%E9%A2%98%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/374648/MIUI%20%E4%B8%BB%E9%A2%98%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(() => {
    'use strict';
    GM_xmlhttpRequest({
        method: 'GET', url: location.href.replace(atob('emh1dGkueGlhb21pLmNvbS9kZXRhaWw='),
            atob('dGhtLm1hcmtldC54aWFvbWkuY29tL3RobS9kb3dubG9hZC92Mg=='))
            + `?miuiUIVersion=${document.querySelector('a.uiversion.ved').innerHTML}`,
        onload: res => $('#J-downWrap').append(
            `<form class="detail-buy" action="${JSON.parse(res.responseText).apiData.downloadUrl}">
                <button class="btn-buy J_Push" type="submit">下载</button>
            </form>`)
    });
})();
