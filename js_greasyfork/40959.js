// ==UserScript==
// @name         a-z-rezensionen goes Anon.to
// @namespace    de.a-z-rezensionen.goes.anon
// @version      0.1
// @description  Quelle:
//               https://stackoverflow.com/questions/13282052/change-links-and-words-using-greasemonkey
//               Mich hat es die ganze Zeit genervt, das die Links nicht alle Anonymisiert worden sind
//               und sich auch nicht einheitlich in einem neuen Fenster geöffnet haben,
//               daher nun ein kleines Script das dieses Verhalten anpasst.
// @author       MatzeWI
// @match        https://test.a-z-rezensionen.de/detailansicht/*
// @match        https://test.a-z-rezensionen.de/meine-bewertungen/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40959/a-z-rezensionen%20goes%20Anonto.user.js
// @updateURL https://update.greasyfork.org/scripts/40959/a-z-rezensionen%20goes%20Anonto.meta.js
// ==/UserScript==

(function() {
    'use strict';
var url1,url2;
url1 = ['www.amazon.de'];
url2 = ['anon.to/?https://www.amazon.de'];
var a, links;
var tmp="a";
var p,q;
links = document.getElementsByTagName('a');
for (var i = 0; i < links.length; i++) {
    a = links[i];
    for(var j=0;j<url1.length; j++)
    {
    tmp = a.href+"" ;
    if(tmp.indexOf(url1[j]) != -1)
    {
    p=tmp.indexOf(url1[j]) ;
    q="https://";
    q = q + url2[j] + tmp.substring(p+url1[j].length,tmp.length);
    a.href=q;
    a.target="_blank";
    }
    }
    }
})();