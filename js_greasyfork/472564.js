// ==UserScript==
// @name         软仓破解
// @namespace    https://greasyfork.org/users/325815
// @version      1.0
// @description  -
// @author       monat151
// @match        https://www.ruancang.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472564/%E8%BD%AF%E4%BB%93%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/472564/%E8%BD%AF%E4%BB%93%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const expire = () => {
        let date = new Date();
        date.setDate(date.getDate() + 5);
        document.cookie = "password=1;path=/;expires=" + date.toGMTString() + ";"
        alert(`破解成功,请刷新页面`)
    }

    setTimeout(() => {
        const _submit = document.querySelector('#submitPWD')
        if (_submit) {
            const passer = _submit.cloneNode(true)
            passer.innerHTML = '绕过验证'
            passer.style = 'margin-right: 45px;'
            passer.onclick = expire
            _submit.before(passer)
        } else {
            console.log('[软仓破解] 未找到验证面板。可能已经登入。')
        }
    }, 500);
})();