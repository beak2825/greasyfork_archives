// ==UserScript==
// @name         xsanime links grabber
// @namespace    http://okanime.com/
// @version      1.0
// @description  get links from xsanime
// @author       alsaibi
// @match        https://www.xsanime.com/episode/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401329/xsanime%20links%20grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/401329/xsanime%20links%20grabber.meta.js
// ==/UserScript==

(function() {
    'use strict';
     function get_links(){
        let win = window.open("new:blank");
         let bar = document.querySelector("#DownloadTable > div:nth-child(2)");
         for(let i = 0; i < bar.childElementCount; i++) {
              win.document.write("<p>" + bar.children[i].children[1].children[0].href + "<\p>")
       }
     }
    let watch_bar = document.querySelector("body > section > div > div > div.MasterSDingle > div.all > div.leftSingle > div.WatchServersMain > div.wssection > ul");
    let button = document.createElement("Li");
    button.innerText = "الروابط";
    let att = document.createAttribute("class");
    let att3 = document.createAttribute("style");
    att3.value = 'order: 1;';
    button.setAttributeNode(att);
    button.setAttributeNode(att3);
    watch_bar.appendChild(button);
    if (button) {
    button.addEventListener ("click", get_links , false);
    }
})();