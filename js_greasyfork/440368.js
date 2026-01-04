// ==UserScript==
// @name         fsofso.com / fsoufsou.com 隐身窗口自动登录
// @version      0.2.1
// @description  fsofso.com / fsoufsou.com 内测用户已经可以使用了，但是现在的fsou只能登录才能使用，在切换隐身窗口时不能直接使用，还得登录。这个脚本可以让登录信息自动同步。（前提是在普通窗口已经登录了。）
// @author       kj863257
// @match        https://fsofso.com/*
// @match        https://fsoufsou.com/*
// @icon         https://cdn.fsofso.com/static/assets/favicon.ico
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_listValues
// @run-at document-start
// @license  MIT
// @namespace https://greasyfork.org/users/168722
// @downloadURL https://update.greasyfork.org/scripts/440368/fsofsocom%20%20fsoufsoucom%20%E9%9A%90%E8%BA%AB%E7%AA%97%E5%8F%A3%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/440368/fsofsocom%20%20fsoufsoucom%20%E9%9A%90%E8%BA%AB%E7%AA%97%E5%8F%A3%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //console.log(GM_listValues().map(e=>({[e]:GM_getValue(e)})))
    if(!localStorage.token || !GM_getValue('VAL')){
        if(!GM_getValue('VAL')){
            return;
        }
        let val = JSON.parse(GM_getValue('VAL'))
        sessionStorage.u_s_d = val.u_s_d;
        localStorage.token = val.token;
        localStorage.ud = val.ud;
        localStorage.user = val.user;
        console.log('已恢复登录信息')
    } else {
        let json = {}
        json.u_s_d = sessionStorage.u_s_d;
        json.token = localStorage.token;
        json.ud = localStorage.ud;
        json.user = localStorage.user;
        GM_setValue('VAL', JSON.stringify(json))
        console.log('已记录登录信息')
    }
})();