// ==UserScript==
// @name        Librus - maksymalna ilość jedynek
// @namespace   xdxdxdxd
// @description Automatycznie liczy ile jedynek każdej wagi możesz jeszcze dostać z każdego przedmiotu, aby być nadal mieć średnią 1.65 lub wyżej.
// @include     https://synergia.librus.pl/przegladaj_oceny/uczen
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29725/Librus%20-%20maksymalna%20ilo%C5%9B%C4%87%20jedynek.user.js
// @updateURL https://update.greasyfork.org/scripts/29725/Librus%20-%20maksymalna%20ilo%C5%9B%C4%87%20jedynek.meta.js
// ==/UserScript==

"use strict";var calculatePossible1s=function(a,b,c){for(var d=0,e=a/b,f=a/b;1.65<e&&1.65<(a+c)/(b+c);)a+=c,b+=c,e=a/b,1.65<a/b&&(d++,f=a/b);return[d,f.toFixed(3)]},translateGrade=function(a){return 2===a.length&&("nb"===a?a=0:"+"===a[1]?a=a[0]+".5":"-"===a[1]&&(a=+a[0]-0.25)),+a},gradeRows=[].slice.call(document.querySelectorAll(".line0 > td:not(:empty):not([class]), .line1 > td:not(:empty):not([class])")).filter(function(a){return"SPAN"===a.childNodes[0].nodeName});gradeRows.forEach(function(a){var b=0,c=0;[].slice.call(a.childNodes).forEach(function(h){var i,j;h.className?(i=h.childNodes[1].title,j=translateGrade(h.childNodes[1].textContent)):(i=h.childNodes[2].childNodes[1].title,j=translateGrade(h.childNodes[2].childNodes[1].textContent));var k=+i.charAt(i.indexOf("Waga")+6);isNaN(j)||(b+=j*k,c+=k)});var d=calculatePossible1s(b,c,3),e=calculatePossible1s(b,c,2),f=calculatePossible1s(b,c,1),g=document.createElement("span");g.innerHTML="\n    <span class=\"grade-box\" style=\"background-color:black;color:white; border: 4px solid gold;\">\n        <a class=\"ocena\" href=\"#\" style=\"color: white;font-weight: bold;\" title=\"\nIlo\u015B\u0107 jedynek wagi 3 kt\xF3re mo\u017Cesz otrzyma\u0107: "+d[0]+"\nPozostanie ci \u015Brednia: "+d[1]+"\n\nIlo\u015B\u0107 jedynek wagi 2 kt\xF3re mo\u017Cesz otrzyma\u0107: "+e[0]+"\nPozostanie ci \u015Brednia: "+e[1]+"\n\nIlo\u015B\u0107 jedynek wagi 1 kt\xF3re mo\u017Cesz otrzyma\u0107: "+f[0]+"\nPozostanie ci \u015Brednia: "+f[1]+"\n            \">"+d[0]+"\n        </a>\n    </span>",a.appendChild(g)});