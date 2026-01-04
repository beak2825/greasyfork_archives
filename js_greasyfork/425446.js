// ==UserScript==
// @name         Qidian Get Chapter Date
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      1.1.0
// @description  Fetches and displays the chapter dates for Qidian books
// @author       Quin15
// @match        https://book.qidian.com/info/*
// @icon         https://www.google.com/s2/favicons?domain=qidian.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425446/Qidian%20Get%20Chapter%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/425446/Qidian%20Get%20Chapter%20Date.meta.js
// ==/UserScript==

var checkElems = function() {if (document.querySelector('.volume .cf li')) {injectDates()} else {setTimeout(checkElems, 100);}};
checkElems();

var injectDates = function() {
    var chaplist = document.querySelectorAll('.volume .cf li')
    for (var i = 0; i < chaplist.length; i++) {
        var date = chaplist[i].firstElementChild.title.replace('首发时间：', '').substr(0, 10);
        var dateElem = document.createElement('div');
        dateElem.style = "width: 100%; color: #888; font-size: 12px; line-height: 0;";
        dateElem.innerText = date;
        chaplist[i].style.height = "50px";
        chaplist[i].firstElementChild.style.float = "none"
        chaplist[i].appendChild(dateElem)
    };
};