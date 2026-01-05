// ==UserScript==
// @name         Średnia do dziennika
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  Dodaje średnią ocen
// @author       Rysiu
// @match        https://*.edu.gdansk.pl/gdansk/zsl/Oceny.mvc/*
// @match        https://*.edu.gdansk.pl/gdansk/ZSL/Oceny.mvc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27305/%C5%9Arednia%20do%20dziennika.user.js
// @updateURL https://update.greasyfork.org/scripts/27305/%C5%9Arednia%20do%20dziennika.meta.js
// ==/UserScript==
function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function roundNumber(num, scale) {
    var number = Math.round(num * Math.pow(10, scale)) / Math.pow(10, scale);
    if(num - number > 0) {
        return (number + Math.floor(2 * Math.round((num - number) * Math.pow(10, (scale + 1))) / 10) / Math.pow(10, scale));
    } else {
        return number;
    }
}

(function() {

    //Tworzy naglowek
    var tableHead = document.querySelector('thead > tr');

    var newHead = document.createElement('th');
    newHead.innerHTML = 'Średnia';

    insertAfter(newHead, tableHead.querySelectorAll('th')[1]);

    //Znajduje rzedy z ocenami
    var rzedy = document.querySelectorAll('.break-word'), i, j;
    for (i = 0; i < rzedy.length; ++i) {

        //Przeskakuje brak ocen
        if(rzedy[i].innerHTML == "Brak ocen")
        {
            var clearAverage = document.createElement('td');
            clearAverage.innerHTML = '-';
            insertAfter(clearAverage, rzedy[i]);
            continue;
        }

        //Znajduje oceny czastkowe
        var oceny = rzedy[i].querySelectorAll('span'), suma = 0, waga = 0;
        for (j = 0; j < oceny.length; ++j) {
            //Znajduje bledne oceny
            if(oceny[j].innerHTML.length > 2) continue;
            if( isNaN(parseInt(oceny[j].innerHTML[0]))) continue;
            
            //Wyciaga wage
            opisOceny = oceny[j].outerHTML;
            pozycjaWagi = opisOceny.search("Waga: ");
            pozycjaKoncaWagi = opisOceny.search("<br/>Data:");
            wagaString = opisOceny.substring(pozycjaWagi + 6, pozycjaKoncaWagi);
            wagaString = wagaString.replace(',','.');
            wagaFloat = parseFloat(wagaString);

            //Wyciaga ocene
            ocenaString = oceny[j].innerHTML;
            ocenaFloat = parseFloat(ocenaString);
            if(ocenaString[1] === '-') ocenaFloat -= 0.25;
            if(ocenaString[1] === '+') ocenaFloat += 0.25;

            suma += ocenaFloat * wagaFloat;
            waga += wagaFloat;
        }

        var newAverage = document.createElement('td');
        if(isNaN(suma/waga)) newAverage.innerHTML = '-';
        else newAverage.innerHTML = roundNumber(suma/waga, 2);
        
        insertAfter(newAverage, rzedy[i]);

        suma = 0;
        waga = 0;
    }
})();