// ==UserScript==
// @name         TapTap下载助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       ywl
// @description  直接从TAPTAP网页下载APK
// @match        *://*.taptap.com/app/*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcss.com/blueimp-md5/2.10.0/js/md5.min.js
// @downloadURL https://update.greasyfork.org/scripts/404179/TapTap%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/404179/TapTap%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getAppId() {
    return document.querySelector("div.taptap-button-download").getAttribute('data-app-id');
}

function newUUID() {
    function s1() {
        const hex = "0123456789abcdef";
        const index = getRandomInt(0, 16);
        return hex[index];
    }
    function s4() {
        return `${s1()}${s1()}${s1()}${s1()}`;
    }
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

function newNonce() {
    const table = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let s = '';
    for (let i = 0; i < 5; ++i) {
        s += table[getRandomInt(0, table.length)];
    }
    return s;
}

function api(host, id, callback) {
    const uid = newUUID();
    const nonce = newNonce();
    const time = Math.round(new Date().getTime() / 1000);
    const xua = encodeURIComponent(`V=1&PN=TapTap&VN_CODE=316&LOC=CN&LANG=zh_CN&CH=default&UID=${uid}`);
    let data = `end_point=d1&id=${id}&node=${uid}&nonce=${nonce}&time=${time}`;
    let sign = md5(`X-UA=V=1&PN=TapTap&VN_CODE=316&LOC=CN&LANG=zh_CN&CH=default&UID=${uid}&${data}3WbiQdyuXxCKESzlLa8hq2v3aiMpKeHg`);
    const url = `${host}?X-UA=${xua}`;
    GM_xmlhttpRequest({
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'okhttp/3.6.0',
        },
        data: `sign=${sign}&${data}`,
        onload: function(response) {
            const r = JSON.parse(response.responseText);
            callback(r);
        }
    });
}

function f1() {
    const btn = document.querySelector("button[data-taptap-card-app='#installModal']");
    if (btn) {
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();

            const appId = getAppId();
            console.log(`appId: ${appId}`);
            api('https://api.taptapdada.com/app/v1/detail', appId, r => {
                if (r.success) {
                    const apkId = r.data.download.apk_id;
                    console.log(`apkId: ${apkId}`);
                    api('https://api.taptapdada.com/apk/v1/detail', apkId, r => {
                        if (r.success) {
                            const url = r.data.apk.download;
                            console.log(`download: ${url}`);
                            location.href = url;
                        } else {
                            console.log(r.message);
                        }
                    });
                } else {
                    console.log(r.message);
                }
            });
        };
    }
}

(function() {
    f1();
})();