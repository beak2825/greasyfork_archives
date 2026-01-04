// ==UserScript==
// @name         friDay Video Tool
// @namespace    https://video.friday.tw/
// @version      1.0
// @description  Only for Academic Research
// @author       unnamed
// @icon         https://video.friday.tw/img/favicon.ico
// @match        https://video.friday.tw/player*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377494/friDay%20Video%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/377494/friDay%20Video%20Tool.meta.js
// ==/UserScript==

var content = "";
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        content = this.responseText.replace("/js/streaming.js", "https://rawcdn.githack.com/SuperKMT/ott_tool/3df1630f103200f6694e33a2d339d5dc5d2c5746/friday/streaming.js");
    }
}
xhr.open("GET", document.location.href, false);
xhr.send();

document.open();
document.write(content);
document.close();