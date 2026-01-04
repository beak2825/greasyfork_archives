// ==UserScript==
// @namespace    https://github.com/Germxu
// @homepage     https://github.com/Germxu/Scripts-for-TamperMonkey
// @supportURL   https://github.com/Germxu/Scripts-for-TamperMonkey/issues/new
// @version      1.1.2
// @author       Finn
// @license      MIT
// @name         Show Password by double-click
// @name:zh-CN     查看密码
// @description   😎 Show password by double-click, and auto hide after 5 seconds, also hide when it blurs
// @description:zh-CN  😎双击显示密码, 5秒自动隐藏, 失去焦点自动隐藏
// @include     *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426577/Show%20Password%20by%20double-click.user.js
// @updateURL https://update.greasyfork.org/scripts/426577/Show%20Password%20by%20double-click.meta.js
// ==/UserScript==

(function () {
    'use strict';
    document.addEventListener("dblclick", e => {
        const ev = e.target;
        if (ev.nodeName === "INPUT" && ev.getAttribute("type") === "password") {
            const v = ev.value
            ev.setAttribute("type", "text");
            ev.value = v
            setTimeout(() => { ev.setAttribute("type", "password") }, 5000)
            ev.onblur= () => ev.setAttribute("type", "password")
        }
    })
})();