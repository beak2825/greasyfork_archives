// ==UserScript==
// @name         quickMention
// @namespace    https://gist.github.com/yegorgunko
// @version      0.5
// @description  Double click on nickname in the right menu to quickly mention the user
// @author       Yegor Gunko
// @match        https://shikme.chat/
// @icon         https://shikme.chat/default_images/icon.png?v=1528136794
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413057/quickMention.user.js
// @updateURL https://update.greasyfork.org/scripts/413057/quickMention.meta.js
// ==/UserScript==
const quickMention = () => {
    document.body.addEventListener("dblclick", e => {
        if (e.target.classList.contains("username")) {
            const t = document.getElementById("content");
            t.value += `${e.target.innerHTML}, `, t.focus()
        }
    })
};
document.addEventListener("DOMContentLoaded", void document.body.addEventListener("dblclick", e => {
    if (e.target.classList.contains("username")) {
        const t = document.getElementById("content");
        t.value += `${e.target.innerHTML}, `, t.focus()
    }
}), !1);