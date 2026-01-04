// ==UserScript==
// @name         Slag (Kréta segédprogram)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fantom jegyek hozzáadása átlagszámítás céljából
// @author       mgabor
// @match        *://*.e-kreta.hu/TanuloErtekeles/Osztalyzatok
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400269/Slag%20%28Kr%C3%A9ta%20seg%C3%A9dprogram%29.user.js
// @updateURL https://update.greasyfork.org/scripts/400269/Slag%20%28Kr%C3%A9ta%20seg%C3%A9dprogram%29.meta.js
// ==/UserScript==

var sulyok = [50, 100, 200];
var jegyek = {
    50: (jegy) => '<span style="color: #000000; padding: 1px 3px 1px 3px;" data-tanuloertekeles="' + jegy + '" data-tipusmod="Normál jegy" data-suly="Súly: 50%">' + jegy + '</span>',
    100: (jegy) => '<span style="color: #31c400; padding: 1px 3px 1px 3px;" data-tanuloertekeles="' + jegy + '" data-tipusmod="Kis jegy" data-suly="Súly: 100%">' + jegy + '</span>',
    200: (jegy) => '<span style="color: #fa0808; padding: 1px 3px 1px 3px;" data-tanuloertekeles="' + jegy + '" data-tipusmod="Témazáró jegy" data-suly="Súly: 200%">' + jegy + '</span>'
}

function addMark() {
    if (this.value == "+") {
        return
    }

    var v = this.value.split("|");
    var jegy = v[0];
    var suly = v[1];

    this.parentElement.insertAdjacentHTML('beforeend', jegyek[suly](jegy));

    this.parentElement.parentElement.querySelector("td.atlag").innerText = calculateAvg(this).toFixed(3);
    this.parentElement.parentElement.querySelector("td.atlag").style.fontStyle = "italic";

    this.selectedIndex = 0;
}

function calculateAvg(element) {
    var jegyek = element.parentElement.parentElement.querySelectorAll('span[data-tanuloertekeles]:not([data-tipusmod="Félévi jegy/értékelés"])');

    var sum = 0;
    var div = 0;

    for (var i = 0; i < jegyek.length; ++i) {
        var suly = parseInt(jegyek[i].dataset.suly.substr(6));
        sum += parseInt(jegyek[i].dataset.tanuloertekeles) * suly;
        div += suly;
    }

    return sum / div;
}

function addSelectors() {
    var sorok = document.getElementsByClassName("k-master-row");

    if (0 === sorok.length) {
        setTimeout(addSelectors, 500);
        return;
    }

    for (var i = 0; i < sorok.length; ++i) {
        var selectList = document.createElement("select");
        selectList.style.float = "right";
        selectList.onchange = addMark;

        var option = document.createElement("option");
        option.value = "+";
        option.text = "+";
        selectList.appendChild(option);

        for (var jegy = 1; jegy <= 5; ++jegy) {
            for (var suly = 0; suly < sulyok.length; ++suly) {
                option = document.createElement("option");
                option.value = jegy + "|" + sulyok[suly];
                option.text = jegy + " (" + sulyok[suly] + "%)";
                selectList.appendChild(option);
            }
        }

        var newcell = document.createElement("td");
        newcell.appendChild(selectList);

        sorok[i].append(newcell);
    }

    var headerek = document.querySelectorAll("thead.k-grid-header > tr");
    for (i = 0; i < headerek.length; ++i) {
        var newheader = document.createElement("th");
        newheader.innerText = "Extra";
        newheader.style.width = "200px";
        headerek[i].append(newheader);
    }
}

(function() {
    'use strict';

    addSelectors();
})();