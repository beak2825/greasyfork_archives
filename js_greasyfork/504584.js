// ==UserScript==
// @name         快手-自动讲解-置顶版
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  V(houka8)
// @author       K
// @match        https://zs.kwaixiaodian.com/page/helper*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jinritemai.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504584/%E5%BF%AB%E6%89%8B-%E8%87%AA%E5%8A%A8%E8%AE%B2%E8%A7%A3-%E7%BD%AE%E9%A1%B6%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/504584/%E5%BF%AB%E6%89%8B-%E8%87%AA%E5%8A%A8%E8%AE%B2%E8%A7%A3-%E7%BD%AE%E9%A1%B6%E7%89%88.meta.js
// ==/UserScript==

var zkjl_interval_time = 8e3,
    run_start = !1;
!async function () {
    async function t(t) {
        return new Promise(e => setTimeout(e, t))
    }
    await t(3e3);
    var e = document.createElement("div");
    e.id = "auto_speak", e.className = "ant-space-item";
    var i = document.createElement("span");
    i.setAttribute("class", "function-item--KL0QI");
    var n = document.createElement("span");
    n.setAttribute("class", "name--Sw0wd");
    var d = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    d.setAttribute("width", "16"), d.setAttribute("height", "16"), d.setAttribute("fill", "none");
    var a = document.createElementNS("http://www.w3.org/2000/svg", "path");
    a.setAttribute("d", "M3.60869 7.99844C3.60869 5.56838 5.57864 3.59844 8.00869 3.59844C9.37736 3.59844 10.6 4.22277 11.4079 5.20437L10.2321 6.02767L13.5911 7.33797L13.5087 3.73336L12.3932 4.51444C11.3682 3.22607 9.785 2.39844 8.00869 2.39844C4.9159 2.39844 2.40869 4.90564 2.40869 7.99844C2.40869 11.0912 4.9159 13.5984 8.00869 13.5984C9.84119 13.5984 11.4681 12.7176 12.4888 11.3588L12.8491 10.879L11.8897 10.1584L11.5293 10.6381C10.7256 11.7082 9.44782 12.3984 8.00869 12.3984C5.57864 12.3984 3.60869 10.4285 3.60869 7.99844Z"), a.setAttribute("fill-rule", "evenodd"), a.setAttribute("clip-rule", "evenodd"), a.setAttribute("fill", "#2C2E30"), a.setAttribute("class", "function-item-icon-fill"), d.appendChild(a), i.appendChild(d), n.textContent = "自动讲解", i.appendChild(n), e.appendChild(i), document.querySelector("#rc-tabs-1-panel-c1 > div.bar--Cu3LF > div.right--aBRON > div").appendChild(e);
    var r = document.getElementById("auto_speak"),
        l = r.querySelector("span"),
        c = r.querySelector("span").querySelector("path"),
        o = !1;
    r.addEventListener("click", async function () {
        if (o) l.classList.remove("highlight--dWZUI"), c.setAttribute("fill", "#2C2E30"), o = !1, console.log("已关闭自动讲解");
        else {
            for (o = !0, l.classList.add("highlight--dWZUI"), c.setAttribute("fill", "#326BFB"); o;) {
                var e = document.querySelector('div[data-test-id="virtuoso-item-list"] > div > div > div.item-container--Er94m > div > div > div >div > div > div > div >div.btn--OTmv0 > div >button:nth-child(4)');
                if ("开始讲解" == e.textContent && e.click(), await t(zkjl_interval_time), "结束讲解" == (e = document.querySelector('div[data-test-id="virtuoso-item-list"] > div > div > div.item-container--Er94m > div > div > div >div > div > div > div >div.btn--OTmv0 > div >button:nth-child(4)')).textContent) e.click(), await t(3e3), document.querySelector("div.ant-modal-confirm-btns > button.ant-btn.ant-btn-primary").click()
            }
            console.log("已开启自动讲解")
        }
    })
}();