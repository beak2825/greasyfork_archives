// ==UserScript==
// @name         OA插件
// @namespace    OA插件
// @version      0.1
// @description  try to take over the world!
// @author       NJY
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400085/OA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/400085/OA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

function main(){
    let list = document.querySelectorAll(".tar");
    for (let i = 0; i < list.length; i++) {
        let tp= list[i].parentNode;
        tp.removeChild(list[i]);
        let l1 = document.createElement("li");
        l1.innerHTML = "有库存";
        let l2 = document.createElement("li");
        l2.innerHTML = "已用完";
        l2.className="tar select";
        tp.appendChild(l1);
        tp.appendChild(l2);
        tp.onmouseover=function (e) {
            l2.className="tar";
        };
        tp.onmouseleave=function (e) {
            l2.className="tar select";
        };
        l1.onclick=function () {
            console.log("aaa");
        };
        l2.onclick=function () {
            console.log("bbb");
        }
    }
}