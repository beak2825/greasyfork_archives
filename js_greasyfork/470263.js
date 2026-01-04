// ==UserScript==
// @name         自动讲解
// @namespace    http://tampermonkey.net/
// @version      0.2.9
// @description  try to take over the world!
// @author       K（vx:houka8）
// @license MIT
// @match        https://buyin.jinritemai.com/dashboard/live/control*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jinritemai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470263/%E8%87%AA%E5%8A%A8%E8%AE%B2%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/470263/%E8%87%AA%E5%8A%A8%E8%AE%B2%E8%A7%A3.meta.js
// ==/UserScript==

(function () {
    setTimeout(function () {
        var b = document.createElement("div");
        b.id = "auto_speak";
        b.className = "actionItem-Mrn7Di";
        b.setAttribute("elementtiming", "element-timing");
        var a = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        a.setAttribute("width", "16");
        a.setAttribute("height", "16");
        a.setAttribute("fill", "none");
        a.setAttribute("class", "lvc2-grey-btn-wrapper");
        a.setAttribute("elementtiming", "element-timing");
        var c = document.createElementNS("http://www.w3.org/2000/svg", "path");
        c.setAttribute("d",
            "M14.5 8a.5.5 0 00-1 0h1zm-2.563-3.84a.5.5 0 10.716-.699l-.716.699zM13.5 8A5.5 5.5 0 018 13.5v1A6.5 6.5 0 0014.5 8h-1zM8 13.5A5.5 5.5 0 012.5 8h-1A6.5 6.5 0 008 14.5v-1zM2.5 8A5.5 5.5 0 018 2.5v-1A6.5 6.5 0 001.5 8h1zM8 2.5c1.544 0 2.938.635 3.937 1.66l.716-.699A6.482 6.482 0 008 1.5v1z");
        c.setAttribute("fill", "currentColor");
        c.setAttribute("elementtiming", "element-timing");
        var d = document.createElementNS("http://www.w3.org/2000/svg", "path");
        d.setAttribute("d", "M10.3 3.314a.5.5 0 100 1v-1zm2 .5v.5a.5.5 0 00.5-.5h-.5zm.5-2a.5.5 0 00-1 0h1zm-2.5 2.5h2v-1h-2v1zm2.5-.5v-2h-1v2h1z");
        d.setAttribute("fill", "currentColor");
        d.setAttribute("elementtiming", "element-timing");
        a.appendChild(c);
        a.appendChild(d);
        a.appendChild(c);
        b.appendChild(a);
        a = document.createTextNode("\u81ea\u52a8\u8bb2\u89e3");
        b.appendChild(a);
        document.querySelector("#app > div > div > div > div > div > div > div.actions-waJasF").appendChild(b);
        var f = document.getElementById("auto_speak"),
            g = !1,
            h = null;
        f.addEventListener("click", function () {
            g ? (f.style.color = "", g = !1,
                clearInterval(h), console.log("\u5df2\u5173\u95ed\u81ea\u52a8\u8bb2\u89e3")) : (g = !0, f.style.color = "blue", h = setInterval(function () {
                var e = document.querySelector("#live-control-goods-list-container > div > div > div:nth-child(1) > div > div > div:nth-child(1) > div > button");

                "\u8bb2\u89e3" == e.textContent && (e.click(), setTimeout(function () {
                    "\u53d6\u6d88\u8bb2\u89e3" == e.textContent && e.click()
                }, 12E3))
            }, 1E3), console.log("\u5df2\u5f00\u542f\u81ea\u52a8\u8bb2\u89e3"))
        })
    }, 3E3)
})();