// ==UserScript==
// @name         Shopify-Plus
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Stats link for products
// @author       Syncxplus
// @license      Unlicense
// @match        http*://*.myshopify.com/admin/products*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/459696/Shopify-Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/459696/Shopify-Plus.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("sx: script running");

    let top = document.getElementById("AppFrameTopBar").offsetHeight + 2;
    let button = "<div id='sx-btn' style='background:gray;border-radius:5%;color:white;cursor:pointer;padding:0 .5rem;display:flex;font-size:.75rem;position:fixed;height:auto;top:" + top + ";left:1;z-index:9999'>" +
        "<div id='sx-btn-init'>Init</div>" +
        "<hr style='margin:.2rem .25rem;color:lightgray'/>" +
        "<div id='sx-btn-register'>Register</div>" +
        "<hr style='margin:.2rem .25rem;color:lightgray'/>" +
        "<div id='sx-btn-clear'>Clear</div>" +
        "</div>";
    document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin", button);

    document.getElementById("sx-btn-init").onclick = function () {
        if (location.pathname.split("/").pop() == "products" && document.querySelectorAll("span.sx-clk-plan").length == 0) {
            console.log("init");
            document.querySelectorAll("tbody tr").forEach(function (o) {
                let attr = o.querySelector("input[type=checkbox]").getAttribute("id") || '';
                if (attr.indexOf("/Product/") != -1) {
                    let id = attr.split("/").pop();
                    o.insertAdjacentHTML("beforeEnd", "<td><span class='sx-clk-plan' style='color:lightgray;cursor:not-allowed' data-id=" + id + ">散单统计</span></td>");
                }
            })
        }
    }

    document.getElementById("sx-btn-register").onclick = function () {
        if (document.querySelectorAll("span.sx-clk-plan").length > 0 && document.querySelector("span.sx-clk-plan").style.color == "lightgray") {
            console.log("register");
            document.querySelectorAll("span.sx-clk-plan").forEach(function (s) {
                s.style.color = "black";
                s.style.cursor = "pointer";
                s.addEventListener("click", function (e) {
                    e.stopPropagation();
                    let id = e.target.getAttribute("data-id");
                    let name = location.host.split(".").shift();
                    window.open("https://oms.onlymaker.cn/Plan?id=" + id + "&name=" + name);
                })
            })
        }
    }

    document.getElementById("sx-btn-clear").onclick = function () {
        document.querySelectorAll("tr td:last-of-type").forEach(function (e) {
            if (e.querySelector("span.sx-clk-plan")) {
                e.remove();
            }
        })
    }
})();