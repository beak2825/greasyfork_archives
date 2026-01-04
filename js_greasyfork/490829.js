// ==UserScript==
// @name         自动讲解
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  自动讲解-键盘监听版
// @author       K（vx:houka8）
// @license MIT
// @match        https://buyin.jinritemai.com/dashboard/live/control*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jinritemai.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490829/%E8%87%AA%E5%8A%A8%E8%AE%B2%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/490829/%E8%87%AA%E5%8A%A8%E8%AE%B2%E8%A7%A3.meta.js
// ==/UserScript==

(function () {
    var e = !1,
        t = null;

    function i(i) {
        var n = document.getElementById("auto_speak");
        e ? (n.style.color = "", e = !1, clearInterval(t), console.log("已关闭自动讲解")) : (e = !0, n.style.color = "blue", t = setInterval((function () {
            var e = document.querySelector("#live-control-goods-list-container > div > div > div:nth-child(" + i + ") > div > div > div:last-child > button");
            "讲解" == e.textContent && (e.click(), setTimeout((() => {
                "取消讲解" == e.textContent && e.click()
            }), 8e3))
        }), 1e3), console.log("已开启自动讲解"))
    }
    setTimeout((() => {
        var e = document.createElement("div");
        e.id = "auto_speak", e.className = "actionItem-g1reOF", e.setAttribute("elementtiming", "element-timing");
        var t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        t.setAttribute("width", "16"), t.setAttribute("height", "16"), t.setAttribute("fill", "none"), t.setAttribute("class", "index__icon___OBHLB"), t.setAttribute("elementtiming", "element-timing");
        var n = document.createElementNS("http://www.w3.org/2000/svg", "path");
        n.setAttribute("d", "M14.5 8a.5.5 0 00-1 0h1zm-2.563-3.84a.5.5 0 10.716-.699l-.716.699zM13.5 8A5.5 5.5 0 018 13.5v1A6.5 6.5 0 0014.5 8h-1zM8 13.5A5.5 5.5 0 012.5 8h-1A6.5 6.5 0 008 14.5v-1zM2.5 8A5.5 5.5 0 018 2.5v-1A6.5 6.5 0 001.5 8h1zM8 2.5c1.544 0 2.938.635 3.937 1.66l.716-.699A6.482 6.482 0 008 1.5v1z"), n.setAttribute("fill", "currentColor"), n.setAttribute("elementtiming", "element-timing");
        var a = document.createElementNS("http://www.w3.org/2000/svg", "path");
        a.setAttribute("d", "M10.3 3.314a.5.5 0 100 1v-1zm2 .5v.5a.5.5 0 00.5-.5h-.5zm.5-2a.5.5 0 00-1 0h1zm-2.5 2.5h2v-1h-2v1zm2.5-.5v-2h-1v2h1z"), a.setAttribute("fill", "currentColor"), a.setAttribute("elementtiming", "element-timing"), t.appendChild(n), t.appendChild(a), t.appendChild(n), e.appendChild(t);
        var l = document.createTextNode("自动讲解");
        e.appendChild(l), document.querySelector("#app > div > div > div > div > div > div > div > div > div > div.actions-PZ7r2A").appendChild(e), document.addEventListener("keydown", (function (e) {
            switch (e.keyCode) {
                case 49:
                    i(1);
                    break;
                case 50:
                    i(2);
                    break;
                case 51:
                    i(3);
                    break;
                case 52:
                    i(4);
                    break;
                case 53:
                    i(5);
                    break;
                case 54:
                    i(6);
                    break;
                case 55:
                    i(7);
                    break;
                case 56:
                    i(8);
                    break;
                case 57:
                    i(9);
                    break;
                case 97:
                    i(1);
                    break;
                case 98:
                    i(2);
                    break;
                case 99:
                    i(3);
                    break;
                case 100:
                    i(4);
                    break;
                case 101:
                    i(5);
                    break;
                case 102:
                    i(6);
                    break;
                case 103:
                    i(7);
                    break;
                case 104:
                    i(8);
                    break;
                case 105:
                    i(9);
                    break;
            }
        }))
    }), 3e3)

})();