// ==UserScript==
// @name         Zakopywator
// @version      1.0
// @description  skrypt do zakopywania domen w wykopalisku
// @author       trzye
// @grant        none
// @include      http://www.wykop.pl/wykopalisko/*
// @namespace https://greasyfork.org/users/13725
// @downloadURL https://update.greasyfork.org/scripts/11287/Zakopywator.user.js
// @updateURL https://update.greasyfork.org/scripts/11287/Zakopywator.meta.js
// ==/UserScript==

var domeny = ['youtu.be', 'youtube.com']; //<< TUTAJ ZAMIEŃ DOMENY (można dopisać więcej domen, albo usunąć drugą)

function zakopDomene(doZakopania) {
    var zakopane = 0;
    var znaleziska = document.getElementsByClassName('article clearfix preview   dC');
    var zrodlo;
    var downvote;
    for (var j = 0; j < znaleziska.length; j++) {
        var znalezisko = znaleziska[j];
        zrodlo = znalezisko.getElementsByClassName('fix-tagline')[0].getElementsByClassName('affect');
        zrodlo = zrodlo[1].innerHTML.toString();
        if (zrodlo == doZakopania) {
            downvote = znalezisko.getElementsByClassName('dropdown fix-dropdown bodyClosable');
            if (downvote.length > 0) {
                downvote = downvote[0].getElementsByClassName('ajax');
                if (downvote.length > 4) {
                    console.log(downvote[4].href);
                    downvote[4].click();
                    zakopane++;
                }
            }
        }
    }
    if(zakopane > 0)
        alert("W domenie " + doZakopania + " zakopano: " + zakopane);
}

for(var j = 0; j < domeny.length; j++)
    zakopDomene(domeny[j]);
var linki = document.getElementsByClassName('wblock rbl-block pager')[0].getElementsByClassName('button');
if(linki[linki.length-1].innerHTML == 'następna')
    linki[linki.length-1].click();