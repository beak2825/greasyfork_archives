// ==UserScript==
// @name         JDCookiesExporter
// @namespace    https://github.com/ukid
// @version      1.0
// @description  一键复制京东手机网页版鉴权Cookies!
// @author       Ukid
// @match        https://*.m.jd.com/*
// @icon         https://www.jd.com/favicon.ico
// @grant        GM.cookie
// @grant        GM.setClipboard
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/450952/JDCookiesExporter.user.js
// @updateURL https://update.greasyfork.org/scripts/450952/JDCookiesExporter.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    GM.registerMenuCommand('复制Cookies', function(){
        Promise.all([GM.cookie.list({ name: 'pt_key' }), GM.cookie.list({ name: 'pt_pin' })]).then(values => {
            const cookie = values.map(x => x.length > 0 ? x[0] : null)
            .filter(x => x!==null)
            .map(x => `${x.name}=${x.value};`)
            .join('');

            console.log(`>>>>>>>>>>>>>> cookie = ${cookie} <<<<<<<<<<<<<<<<<`);
            if(cookie.length > 0) {
                alert('复制成功!');
                GM.setClipboard(cookie);
            } else {
                alert('未找到Cookies!');
            }
        });
    });

    GM.registerMenuCommand('登出', function(){
        GM.cookie.delete({ name: 'pt_key' });
        GM.cookie.delete({ name: 'pt_pin' });
        location.reload();
    });
})();