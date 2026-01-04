// ==UserScript==
// @name         百度时间戳获取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  百度时间戳
// @author       xiaobao
// @match        https://www.baidu.com/s?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467221/%E7%99%BE%E5%BA%A6%E6%97%B6%E9%97%B4%E6%88%B3%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/467221/%E7%99%BE%E5%BA%A6%E6%97%B6%E9%97%B4%E6%88%B3%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $('html').bind('DOMSubtreeModified', function (e) {
        if (!document.querySelector("#sjc")) {
            var box1 = document.querySelector("#content_right")
            var input1 = document.createElement("textarea");
            input1.id = "sjc"
            input1.style.height = "200px"
            input1.style.width = "800px"
            input1.value = showGetTime()
            box1.insertAdjacentElement("beforeend", input1);
        }
    });
})();


function showGetTime() {
    let a1 = document.querySelectorAll("#content_left [srcid]");
    let ra = []
    a1.forEach(element => {
        if (element.querySelector("h3") != null) {
            let bt = element.querySelector("h3").innerText;
            let lj = element.getAttribute("mu");
            let s1 = getDateFromString(element.innerText)
            if (s1 != "") {
                ra.push(bt + "|" + lj + "|" + s1 + "," + (s1 + 86400))
            }
        }
    });
    return ra.join("\n");
}
function getDateFromString(str) {
    var reg = /(\d+)年(\d+)月(\d+)日/;
    var s = str.match(reg);
    var result = "";
    if (s) {
        result = new Date(s[1], s[2] - 1, s[3]).getTime() / 1000;
    }
    return result;
}