// ==UserScript==
// @name         琉璃神社 自动链接
// @namespace    https://js.zombie110year.top
// @version      0.2
// @description  将琉璃神社的磁力链接标注出来
// @author       zombie110year
// @match        https://www.liuli.cat/wp/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402166/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%20%E8%87%AA%E5%8A%A8%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/402166/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%20%E8%87%AA%E5%8A%A8%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

'use strict';
(async function() {
    const css_before = `{content: "神秘代码";margin: 0 1em 0 0;padding: 0 0.2em;}`;
    const css = `{display: inline-block;background: whitesmoke;color: black;font-weight: bold;}`;
    let style = document.querySelector("style#gm-insert-style") || (function () {
        let block = document.createElement("style");
        block.setAttribute("id", "gm-insert-style");
        document.head.appendChild(block);
        return block;
    })();
    style.sheet.insertRule(`.mysterious-code::before ${css_before}`);
    style.sheet.insertRule(`.mysterious-code ${css}`);
})().then(async function() {
    const MAG_RE = /[a-fA-F\d]{40,}/g;
    let PAGE_EL = document.getElementById("content");
    let output = PAGE_EL.innerHTML.replace(MAG_RE, `<a class="mysterious-code" href="magnet:?xt=urn:btih:$&">$&</a>`);
    PAGE_EL.innerHTML = output;
});