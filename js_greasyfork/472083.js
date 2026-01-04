// ==UserScript==
// @name         Okoun - Skoč dolů
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Skoč dolů nebo Skoč na první nový
// @author       You
// @include      *.okoun.cz/boards/*
// @match        https://www.okoun.cz/boards/*
// @icon         https://opu.peklo.biz/p/23/07/24/1690208260-9b0c4.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472083/Okoun%20-%20Sko%C4%8D%20dol%C5%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/472083/Okoun%20-%20Sko%C4%8D%20dol%C5%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var elements = document.getElementsByClassName('menu');
    var menuDiv = elements[0];
    var news = document.querySelectorAll("div.item.new");

    if (news.length > 0) {
        var last = news[news.length - 1];
        var lastId = last.getAttribute('id');
        menuDiv.innerHTML += '<span>&nbsp;<a href="javascript:document.getElementById(\'' + lastId + '\').scrollIntoView(); ;">&dArr; Skoč na první nový</a></span>';
    } else {
        menuDiv.innerHTML += '<span>&nbsp;<a href="javascript:window.scrollTo(0,document.body.scrollHeight);">&dArr; Skoč dolů</a></span>';
    }

})();