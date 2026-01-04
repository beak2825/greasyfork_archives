// ==UserScript==
// @name         DMHYReadFilter
// @namespace    https://github.com/lycloudqaq/ThreadViewed-Darker
// @version      1.1
// @description  加深点击后的条目
// @author       lycloud
// @match        *://share.dmhy.org/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/391755/DMHYReadFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/391755/DMHYReadFilter.meta.js
// ==/UserScript==


(function () {
    var filterTr = document.querySelectorAll("table#topic_list>tbody>tr.even");
    for (var i = 0; i < 40; i++) {
        filterTr[i].setAttribute("class", "odd")
    }
    filterTr = document.querySelector("table#topic_list");
    filterTr.setAttribute("border", "1");
    filterTr.setAttribute("style", "border-collapse: collapse;border-color: #000;");
})();

(function () {
    var readArray = [];
    readArray = readArray.concat(GM_getValue('read'));

    var aFilter = document.querySelectorAll('tr>.title>a');
    for (var i = 0; i < aFilter.length; i++) {
        var id = parseInt(aFilter[i].href.slice(35, 41));
        if (readArray.includes(id) == true) {
            aFilter[i].parentNode.parentNode.setAttribute("style", "background-color:#ccc;");
        }

        aFilter[i].addEventListener('mousedown', function () {
            id = parseInt(this.href.slice(35, 41));
            if (readArray.includes(id) == false) {
                readArray.push(id);
                if (readArray.length > 320) { readArray.shift() };
                GM_setValue('read', readArray);
                this.parentNode.parentNode.setAttribute("style", "background-color:#ccc;");
            }
        })
    }
})();