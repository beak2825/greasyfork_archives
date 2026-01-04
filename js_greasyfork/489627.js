// ==UserScript==
// @name         双击显示密码double click show password
// @namespace    https://172hk.top/
// @version      2024.03.13
// @description  双击密码输入框显示密码明文，5秒后或者点击其他地方恢复加密 Double-click the password input box to display the password plaintext, after 5 seconds, or click elsewhere to restore the encryption
// @author       朱颜科技
// @match        *://*/*
// @icon         https://hbimg.huabanimg.com/50c02765eb335ab6cafbb23cdcdd35dfb509698941e4-75uiH4_fw658
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489627/%E5%8F%8C%E5%87%BB%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81double%20click%20show%20password.user.js
// @updateURL https://update.greasyfork.org/scripts/489627/%E5%8F%8C%E5%87%BB%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81double%20click%20show%20password.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let timeout;
    document.addEventListener("dblclick", e => {
        const ev = e.target;
        if (ev.nodeName === "INPUT" && ev.getAttribute("type") === "password") {
            ev.setAttribute("type", "password_zykj");
            //失去焦点恢复加密
            ev.onblur = () => ev.setAttribute("type", "password");
            //清除之前的定时器
            clearTimeout(timeout);
            //定时5秒后恢复加密
            timeout = setTimeout(() => {
                ev.setAttribute("type", "password")
            }, 5000);
        }
    })

})();