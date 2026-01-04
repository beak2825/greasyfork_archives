// ==UserScript==
// @name         Toefl-Fontfamily-Change
// @namespace    https://www.zuozuovera.com
// @version      0.31
// @description  Try to make Toefl Test in KMF and Xiaozhan more like True Toefl Enviroment!
// @author       VeraZuo
// @match        https://toefl.kmf.com/*
// @match        https://top.zhan.com/toefl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377254/Toefl-Fontfamily-Change.user.js
// @updateURL https://update.greasyfork.org/scripts/377254/Toefl-Fontfamily-Change.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var body = document.body;
    if (window.location.href.match("https://top.zhan.com/toefl/simulate/")){
        var p = document.getElementsByTagName("p");
        for (var i=0;i<p.length;i++)
        {
            p[i].style.fontFamily = 'Arial Narrow';
        }
        var s = document.getElementsByTagName("span");
        for (var j=0;j<s.length;j++)
        {
            s[j].style.fontFamily = 'Arial Narrow';
        }
    }

    body.style.fontFamily = 'Arial Narrow';

})();