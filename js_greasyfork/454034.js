// ==UserScript==
// @name         Game8 FF14 宝の地図 Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fix Game8 FF14 宝の地図 don't have navigate for area
// @author       TravorZhu
// @match        https://game8.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=game8.jp
// @grant        none
// @license      GPL3.0
// @downloadURL https://update.greasyfork.org/scripts/454034/Game8%20FF14%20%E5%AE%9D%E3%81%AE%E5%9C%B0%E5%9B%B3%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/454034/Game8%20FF14%20%E5%AE%9D%E3%81%AE%E5%9C%B0%E5%9B%B3%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let h2=Array.from(document.getElementsByClassName("a-header--2"));
    let l = Array.from(document.getElementsByClassName("a-header--3"));
    if(!h2[0].textContent.includes("地図G")){
        return
    }
    let a = document.createElement("div");
    a.id = "smenu";
    a.style = "position: fixed;right: 0px;top:0px;width:300px;"
    a.className = "game_menu";
    document.body.appendChild(a);

    l.forEach((lt) => {
        if (h2[1].compareDocumentPosition(lt) == 2){
            let ul = document.createElement('li')
        ul.className = "menuItem-listItem";
        a.appendChild(ul);

        let li = document.createElement("a");
        li.text = lt.textContent;
        li.href = "#" + lt.id;
        li.className = "menuItem-link"
        ul.appendChild(li)
        }


    }
    );


    // Your code here...
})();