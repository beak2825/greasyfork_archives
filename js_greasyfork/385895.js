// ==UserScript==
// @name         我愛蘋果日報
// @namespace    https://greasyfork.org/users/244830
// @version      1.1
// @description  Only for Academic Research
// @icon         https://img.appledaily.com.tw/appledaily/pinsite/64x64.ico
// @match        *://*.appledaily.com/*
// @match        *://*nextmag.com.tw/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385895/%E6%88%91%E6%84%9B%E8%98%8B%E6%9E%9C%E6%97%A5%E5%A0%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/385895/%E6%88%91%E6%84%9B%E8%98%8B%E6%9E%9C%E6%97%A5%E5%A0%B1.meta.js
// ==/UserScript==

var content = "";
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        content = this.responseText.replace("switch(e)", "switch('ad')").replace(/3000/g, "30000000000000000");
    }
}
xhr.open("GET", document.location.href, false);
xhr.send();

document.open();
console.log(content);
document.write(content);
document.close();