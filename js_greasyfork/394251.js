// ==UserScript==
// @name         EgyBest next and previous buttons
// @version      0.1
// @description  هذا الكود يضيف لك امكانية الولوج الى الحلقة التالية او السابقة بسهولة فقط بالضغط على الزر تحت مشغل الحلقة
// @author       bil-X
// @match        https://sela.egybest.xyz/episode/*
// @grant        none
// @namespace https://greasyfork.org/users/428705
// @downloadURL https://update.greasyfork.org/scripts/394251/EgyBest%20next%20and%20previous%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/394251/EgyBest%20next%20and%20previous%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ss = document.createElement('script');
    ss.text = 'function fresh(a){document.location.replace(a);};' ;
    document.head.appendChild(ss);

    var url = window.location.href;

    var c = document.getElementsByClassName("mbox tam")[0];
    var nextURL= url.replace(url.match(/ep-(\d+)/)[0],"ep-" + (Number(url.match(/ep-(\d+)/)[1]) + 1) );
    var prevURL= url.replace(url.match(/ep-(\d+)/)[0],"ep-" + (Number(url.match(/ep-(\d+)/)[1]) - 1) );
    var sp = document.createElement("label");
    var btnNext = document.createElement("button");
    var btnPrev = document.createElement("button");

    btnNext.setAttribute("class","btn b vam");
    btnPrev.setAttribute("class","btn b vam");

    btnNext.setAttribute("id","nxt");
    btnPrev.setAttribute("id","prv");

    btnNext.setAttribute("value",nextURL);
    btnPrev.setAttribute("value",prevURL);

    btnNext.setAttribute('onclick','fresh(this.getAttribute("value"))');
    btnPrev.setAttribute('onclick','fresh(this.getAttribute("value"))');

    btnNext.innerText = "الحلقة التالية";
    btnPrev.innerText = "الحلقة السابقة";

    btnNext.setAttribute("style",'font-family: inherit;');
    btnPrev.setAttribute("style",'font-family: inherit;');

    sp.innerText = "      ";
    c.appendChild(document.createElement("br"));
    c.appendChild(btnNext);c.appendChild(sp);
    c.appendChild(btnPrev);
})();