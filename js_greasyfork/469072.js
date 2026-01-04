// ==UserScript==
// @name         百度标号
// @namespace    http://blog.sxnxcy.com/
// @version      1.0.1
// @icon         https://www.baidu.com/favicon.ico
// @description  结果标号
// @author       xiaobao
// @license      CC-BY-4.0
// @run-at       document-start
// @match        *://www.baidu.com/s*

// @downloadURL https://update.greasyfork.org/scripts/469072/%E7%99%BE%E5%BA%A6%E6%A0%87%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/469072/%E7%99%BE%E5%BA%A6%E6%A0%87%E5%8F%B7.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function () {
    t()
})
function t() {
    debugger
    if (document.querySelector('[srcid="28608"]') != null) {
        document.querySelector('[srcid="28608"]').remove();
    }
    let e = document.querySelectorAll("#content_left>[srcid]");
    for (var r = 0; r < e.length; r++) {
        var ss = "<span style='font-size:24px;margin-right: 5px;'>" + (r + 1) + "</span>"
        e[r].querySelector("a").innerHTML = ss + e[r].querySelector("a").innerHTML
    }
}