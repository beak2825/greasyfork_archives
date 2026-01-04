// ==UserScript==
// @name         你的名字是？
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在贴吧用户首页查看用户名及旧版昵称
// @author       scientificworld
// @match        https://tieba.baidu.com/home/main*
// @grant        GM_xmlhttpRequest
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/471769/%E4%BD%A0%E7%9A%84%E5%90%8D%E5%AD%97%E6%98%AF%EF%BC%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/471769/%E4%BD%A0%E7%9A%84%E5%90%8D%E5%AD%97%E6%98%AF%EF%BC%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let params = new URL(location.href).search;
    if (params === '') return;
    fetch(`https://tieba.baidu.com/home/get/panel${params}`)
    .then(resp => resp.json())
    .then(async resp => {
        let userinfo = await (await fetch('https://tieba.baidu.com/f/user/json_userinfo')).json();
        if (userinfo && userinfo.data.user_portrait == resp.data.portrait.split('?')[0]) {
            document.querySelector('.userinfo_split').insertAdjacentHTML(
                'afterend',
                `<span>昵称:${resp.data.name_show}</span>
                <span class="userinfo_split"></span>`
            );
        } else {
            document.querySelector('.userinfo_sex').insertAdjacentHTML(
                'afterend',
                `<span>用户名:${resp.data.name}</span>
                <span class="userinfo_split"></span>
                <span>昵称:${resp.data.name_show}</span>
                <span class="userinfo_split"></span>`
            );
        }
    });
})();