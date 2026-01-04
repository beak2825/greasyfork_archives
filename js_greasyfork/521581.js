// ==UserScript==
// @name         ExHentai Cookie设置器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动设置ExHentai的Cookie
// @author       mmi
// @match        https://exhentai.org/*
// @grant        GM_cookie
// @grant        GM.cookie
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521581/ExHentai%20Cookie%E8%AE%BE%E7%BD%AE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/521581/ExHentai%20Cookie%E8%AE%BE%E7%BD%AE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const cookies = [
        {
            name: 'igneous',
            value: 'INPUT YOURS'
        },
        {
            name: 'sk',
            value: 'INPUT YOURS'
        },
        {
            name: 'ipb_member_id',
            value: 'INPUT YOURS'
        },
        {
            name: 'ipb_pass_hash',
            value: 'INPUT YOURS'
        }
    ];

    // 检查是否已经设置过cookie
    if (!document.cookie.includes('ipb_member_id')) {
        // 删除现有cookie
        cookies.forEach(cookie => {
            GM.cookie.delete({
                name: cookie.name,
                domain: 'exhentai.org',
                path: '/'
            });
        });

        // 设置新cookie
        Promise.all(cookies.map(cookie => 
            GM.cookie.set({
                name: cookie.name,
                value: cookie.value,
                domain: 'exhentai.org',
                path: '/',
                secure: true,
                httpOnly: false
            })
        )).then(() => {
            // 所有cookie设置完成后刷新页面
            location.reload();
        });
    }
})();
