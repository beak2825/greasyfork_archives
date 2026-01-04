// ==UserScript==
// @name         手机端网页调试 (Eruda 汉化版)
// @version      2025.6.7
// @description  为当前页面增加汉化版 Eruda 调试
// @author       Yikang666
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/997807
// @downloadURL https://update.greasyfork.org/scripts/538655/%E6%89%8B%E6%9C%BA%E7%AB%AF%E7%BD%91%E9%A1%B5%E8%B0%83%E8%AF%95%20%28Eruda%20%E6%B1%89%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538655/%E6%89%8B%E6%9C%BA%E7%AB%AF%E7%BD%91%E9%A1%B5%E8%B0%83%E8%AF%95%20%28Eruda%20%E6%B1%89%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    var s = document.createElement("script");
    s.src = "https://cdn.jsdmirror.cn/gh/Yikang666/eruda-zh/dist/index.js";
    s.addEventListener(
        "load",
        function() {
            eruda.init();
        },
        false
    );
    document.body.appendChild(s);
})();