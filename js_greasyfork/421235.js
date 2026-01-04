// ==UserScript==
// @name        色图页自动访问
// @namespace   https://greasyfork.org/users/129402
// @include     /.*/
// @grant       unsafeWindow
// @version     1.0.0
// @author      AnnAngela
// @description 色图页自动访问全文
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/421235/%E8%89%B2%E5%9B%BE%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%AE%BF%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/421235/%E8%89%B2%E5%9B%BE%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%AE%BF%E9%97%AE.meta.js
// ==/UserScript==
"use strict";
(() => {
    const t = new URL(location.href).searchParams.get("t");
    if (typeof t !== "string" || t.length === 0 || !unsafeWindow.document.querySelector(`input[name="t"][value="${t}"]`) || !unsafeWindow.document.querySelector('input[name="pwd"]') || !unsafeWindow.document.querySelector("input[name=\"tj\"]")) {
        return;
    }
    if (!confirm("请问这是否是色图页？")) {
        return;
    }
    const meta = Array.from(new Set(Array.from(unsafeWindow.document.querySelectorAll('meta[name="description"], meta[itemprop="description"]')).map(({ content }) => content.match(/(?<=:|：).+$/)?.[0]?.trim())).values());
    if (meta.length === 0) {
        alert("获取密码失败，请将本页面链接发给作者以便进一步适配");
        return;
    }
    let pwd;
    if (meta.length === 1) {
        pwd = meta[0];
    } else {
        while (!meta.includes(pwd)) {
            pwd = prompt(`${typeof pwd !== "string" ? "检测到多个密码" : "输入错误"}，请选择其中一个输入：${JSON.stringify(meta, null, 4).replace(/^\[|,(?=\n)|\]$/g, "")}`);
        }
    }
    unsafeWindow.document.querySelector('input[name="pwd"]').value = pwd;
    unsafeWindow.scrollTo(0, unsafeWindow.document.body.scrollHeight);
    unsafeWindow.document.querySelector("input[name=\"tj\"]").click();
})();