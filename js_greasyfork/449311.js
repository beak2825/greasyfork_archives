// ==UserScript==
// @name         quickMention
// @namespace https://greasyfork.org/users/694598
// @version      0.2
// @description  Double click on nickname in the right menu to quickly mention the user
// @author       Phobos
// @match        https://anichat.ru/
// @icon         https://anichat.ru/default_images/icon.png?v=1528136794
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449311/quickMention.user.js
// @updateURL https://update.greasyfork.org/scripts/449311/quickMention.meta.js
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