// ==UserScript==
// @name         91pu
// @version      1.1
// @description  Only for Academic Research
// @author       unnamed
// @match        http*://www.91pu.com.tw/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/244830
// @downloadURL https://update.greasyfork.org/scripts/404531/91pu.user.js
// @updateURL https://update.greasyfork.org/scripts/404531/91pu.meta.js
// ==/UserScript==

var content = "";
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        content = this.responseText.replace("/templets/pu/js/global.js", "https://rawcdn.githack.com/SuperKMT/ott_tool/bee51a0c761486983e4a1a4fddceb6eb307735b1/91pu.js");
    }
}
xhr.open("GET", document.location.href, false);
xhr.send();

document.open();
document.write(content);
document.close();