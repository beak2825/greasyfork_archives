// ==UserScript==
// @name         Okoun.cz - skoč dolů
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.okoun.cz/*
// @icon         https://www.google.com/s2/favicons?domain=okoun.cz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427907/Okouncz%20-%20sko%C4%8D%20dol%C5%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/427907/Okouncz%20-%20sko%C4%8D%20dol%C5%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var elements = document.getElementsByClassName('menu');
    var menuDiv = elements[0];
    var news = document.querySelectorAll("div.item.new");

    if (news) {
        var last = news[news.length - 1];
        var lastId = last.getAttribute('id');
        menuDiv.innerHTML += '<span>&nbsp;<a href="javascript:document.getElementById(\'' + lastId + '\').scrollIntoView(); ;">&dArr; Skoč na první nový</a></span>';
    } else {
        menuDiv.innerHTML += '<span>&nbsp;<a href="javascript:window.scrollTo(0,document.body.scrollHeight);">&dArr; Skoč dolů</a></span>';
    }

})();