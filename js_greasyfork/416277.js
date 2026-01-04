// ==UserScript==
// @name     AntiTestportal
// @description Blokowanie wykrywania wyjścia ze strony przez testportal
// @version  1
// @grant    none
// @match    *://*.testportal.pl/*
// @namespace https://greasyfork.org/users/706075
// @downloadURL https://update.greasyfork.org/scripts/416277/AntiTestportal.user.js
// @updateURL https://update.greasyfork.org/scripts/416277/AntiTestportal.meta.js
// ==/UserScript==
function run() {
    try {
        var n = RegExp.prototype.test;
        (RegExp.prototype.test = function (t) {
            return !(!this.toString().includes("native code") || !this.toString().includes("function")) || n.call(this, t);
        }),
            (document.hasFocus = function () {
                return !0;
            });
    } catch (err) {
        console.log("error");
    }
}
function inject(func) {
    var funcString = func.toString(),
        elem = document.createElement("script");
    (elem.innerHTML = "(" + funcString + ")()"), document.body.appendChild(elem);
}
window.onload = function () {
    inject(run);
};