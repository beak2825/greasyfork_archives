// ==UserScript==
// @name         yande.re keypress q-e-double-skip 双页跳转
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  使用键 Q 向前跳转2页，使用键 E 向后跳转2页
// @author       rowink
// @match        https://yande.re/post
// @match        https://yande.re/post?page*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437600/yandere%20keypress%20q-e-double-skip%20%E5%8F%8C%E9%A1%B5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/437600/yandere%20keypress%20q-e-double-skip%20%E5%8F%8C%E9%A1%B5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
    "use strict";
    let url = window.location.href;
    let page = parseInt(url.split("=")[1]);
    page = page > 0 ? page : 1;
    let pagination = document.getElementById("paginator").getElementsByClassName("pagination")[0];
    let pages = pagination.getElementsByTagName("a");
    let last_page = pages[pages.length - 2].textContent;
    window.addEventListener('keypress', function (e) {
        if (e.code == "KeyQ" && page > 1) {
            window.location.href = "https://yande.re/post?page=" + (page - 2);
        }
        if (e.code == "KeyE" && page < last_page) {
            window.location.href = "https://yande.re/post?page=" + (page + 2);
        }
    });
})();