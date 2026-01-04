// ==UserScript==
// @name         baidu doc ppt image
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  use baidu doc ppt image
// @author       You
// @match        https://wenku.baidu.com/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441795/baidu%20doc%20ppt%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/441795/baidu%20doc%20ppt%20image.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var btn1=document.createElement("div");
    //var node1=document.createTextNode("1倍");
    btn1.innerHTML = "<div width=100 height=150><button>***获取图片地址***</button></div>";
    //btn1.appendChild(node1);
    //var elm=document.getElementById("video-toolbar");
    //elm.appendChild(btn1);
    var headings = document.evaluate('//*[contains(@class, "doc-btns-wrap")]', document, null, XPathResult.ANY_TYPE, null);
    var buttonParent = headings.iterateNext();
    buttonParent.parentNode.appendChild(btn1);

    btn1.onclick=function(){
        var headings = document.evaluate('//*[contains(@class, "page-item")]/div[1]/img', document, null, XPathResult.ANY_TYPE, null);
        var thisHeading = headings.iterateNext();
        var value="<span><textarea rows=50 cols=110>";
        while (thisHeading) {
            value = value.concat(thisHeading.src + "\n")
            thisHeading = headings.iterateNext();
        }
        value = value.concat("</textarea></span>")
        console.info(value);
        headings = headings = document.evaluate('//*[contains(@class, "doc-summary-wrap")]', document, null, XPathResult.ANY_TYPE, null);
        thisHeading = headings.iterateNext();
        console.info(thisHeading)
        thisHeading.innerHTML = value;
    }
    btn1.style.marginTop="10px";
})();