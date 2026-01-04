// ==UserScript==
// @name        隐藏认领已满
// @namespace   https://www.tampermonkey.net
// @include     https://*sunday*/torrents.php*
// @version     1.0
// @author      benz1
// @description 隐藏认领已满的种子
// @downloadURL https://update.greasyfork.org/scripts/474391/%E9%9A%90%E8%97%8F%E8%AE%A4%E9%A2%86%E5%B7%B2%E6%BB%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/474391/%E9%9A%90%E8%97%8F%E8%AE%A4%E9%A2%86%E5%B7%B2%E6%BB%A1.meta.js
// ==/UserScript==

function hide() {
    document
        .querySelector(".torrents")
        .querySelectorAll("tbody > tr")
        .forEach(function hide(node) {
            if (node.querySelector('span[title="认领人数已满"]')) {
                node.setAttribute("hidden", "hidden");
            }
        });
}

function unhide() {
    document.querySelectorAll("[hidden]").forEach((node) => node.removeAttribute("hidden"));
}

function handleClick(checkbox) {
    if (checkbox.checked) {
        hide();
    } else {
        unhide();
    }
}

let checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.id = "hidden";
checkbox.setAttribute("onclick", "handleClick(this)");
let checkbox_lable = document.createElement("lable");
checkbox_lable.for = "hidden";
checkbox_lable.innerText = "隐藏认领已满";

document.querySelector(".torrents").before(checkbox);
document.querySelector(".torrents").before(checkbox_lable);

unsafeWindow.handleClick = handleClick;
