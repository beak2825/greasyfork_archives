// ==UserScript==
// @name         A2Z Redirect
// @namespace    LucXas
// @version      1.0
// @description  Simple script that adds a button to redirect from Google PlayStore to A2Zapk.
// @author       LucXas
// @match        https://play.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=a2zapk.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447781/A2Z%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/447781/A2Z%20Redirect.meta.js
// ==/UserScript==
/* jshint esversion:6 */
if (window.location.href.indexOf("https://play.google.com/store/apps/details") > -1) {
    createButton();
}
let currentPage = location.href;
var button;
setInterval(function () {
    if (currentPage != location.href) {
        if (window.location.href.indexOf("https://play.google.com/store/apps/details") > -1) {
            currentPage = location.href;
            setTimeout(function () {
                addButton();
            }, 500);
        }
        currentPage = location.href;
    } else {
    }
}, 500);
function addButton() {
    var b = document.getElementById("a2z");
    if (document.contains(b)) {
        b.remove(this);
    }
    setTimeout(function () {
        createButton();
    }, 500);
}
function createButton() {
    var id = location.href.match(/.*?id=([a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+).*/)[1];
    button = document.createElement("button");
    button.innerHTML = '<button id="a2z">View on A2Z</button>';
    (function () {
        "usestrict";
        GM_addStyle(
            `#a2z{color:#fff;background-color:#01875f;width:unset;font-family:"GoogleSans",Roboto,Arial,sans-serif;line-height:1.25rem;font-size:.920rem;letter-spacing:.0178571429em;font-weight:500;height:36px;margin:6px0;cursor:default;margin-bottom:2px;margin-top:4px;min-height:40px;min-width:120px;padding:016px016px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;}#a2z:hover{background-color:#056449;cursor:pointer;}`
        );
    })();
    html().appendChild(button);
    button.addEventListener("click", function (c) {
        if (c.altKey) {
            window.open("https://a2zapk.com/History/" + id);
        } else window.open("https://a2zapk.com/apk/" + id + ".html");
    });
}
function html() {
    var html = [...document.querySelectorAll('[data-item-id^="%.@."]')].pop();
    return html;
}
