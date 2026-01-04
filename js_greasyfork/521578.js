// ==UserScript==
// @name         Bangumi Cookie设置器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动设置Bangumi的Cookie
// @author       mmi
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @grant        GM_cookie
// @grant        GM.cookie
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521578/Bangumi%20Cookie%E8%AE%BE%E7%BD%AE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/521578/Bangumi%20Cookie%E8%AE%BE%E7%BD%AE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const cookies = [
        {
            name: 'chii_sid',
            value: 'INPUT YOURS'
        },
        {
            name: 'chii_auth',
            value: 'INPUT YOURS'
        },
        {
            name: 'chii_sec_id',
            value: 'INPUT YOURS'
        }
    ];

    // 检查是否已经设置过cookie
    if (!document.cookie.includes('chii_auth')) {
        // 删除现有cookie
        cookies.forEach(cookie => {
            GM.cookie.delete({
                name: cookie.name,
                domain: '.bgm.tv',
                path: '/'
            });
        });

        // 设置新cookie
        Promise.all(cookies.map(cookie => 
            GM.cookie.set({
                name: cookie.name,
                value: cookie.value,
                domain: '.bgm.tv',
                path: '/',
                secure: false,
                httpOnly: false
            })
        )).then(() => {
            // 所有cookie设置完成后刷新页面
            location.reload();
        });
    }
})();
