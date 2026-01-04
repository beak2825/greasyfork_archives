// ==UserScript==
// @name         彩云小译翻译字体高亮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  高亮彩云小译翻译字体的颜色。
// @author       eryisan
// @match        *://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454505/%E5%BD%A9%E4%BA%91%E5%B0%8F%E8%AF%91%E7%BF%BB%E8%AF%91%E5%AD%97%E4%BD%93%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/454505/%E5%BD%A9%E4%BA%91%E5%B0%8F%E8%AF%91%E7%BF%BB%E8%AF%91%E5%AD%97%E4%BD%93%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const content = document.querySelector("html");
    content.addEventListener("DOMSubtreeModified", function () {
        const el = document.querySelectorAll("[data-vfjtx1rfwfrfvefsr0vu]");
          el.forEach(n => {
          n.style.color = "red";
          n.style.fontWeight = "450";
        });

    })
})();