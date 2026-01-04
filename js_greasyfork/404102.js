// ==UserScript==
// @name         Licytacje BW
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Koloruje odpowiednio wiersze podczas aukcji itemów które są więcej warte jako "złom" :D
// @author       Varriz
// @include     *.bloodwars.interia.pl/?a=auction&do=itemlist*
// @include     *.bloodwars.interia.pl/?a=settings*
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/404102/Licytacje%20BW.user.js
// @updateURL https://update.greasyfork.org/scripts/404102/Licytacje%20BW.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var id = location.host.split('.') [0];
    if (location.host.split('.') [2] == 'net') {
        id = id + 'en';
    }
    var a = location.search;
    if (a == '?a=settings') {
        var div = document.getElementsByClassName('hr720') [0];

        var opcje = '<br /><br /><span style="color: #fff; text-shadow: 0px -1px 4px white, 0px -2px 10px yellow, 0px -10px 20px #ff8000, 0px -18px 40px red; font: 20px \'BlackJackRegular\'";>LicytacjeMOD made by Varriz</span><br /><br />';

        opcje += '<center><table width="90%" style="text-align: left; margin-top: 5px; font-family: \'Lucida Grande\', \'Lucida Sans Unicode\', Helvetica, Arial;">';

        opcje += '<tr><td>Ustaw cenę złomu w pr: <input type="text" id="L_zlomValue" value="' + GM_getValue(id + 'L_zlomValue', '100') + '"></td></tr>';
        opcje += '<tr><td>Ustaw próg podświetlania (0.8 -> 80% ceny rynkowej złomu w PLN): <input type="text" id="L_progValue" value="' + GM_getValue(id + 'L_progValue', '0.8') + '"></td></tr>';
        opcje += '<tr><td>Ustaw kolor podświetlania (nazwa po angielsku lub HEX): <input type="text" id="L_colorValue" value="' + GM_getValue(id + 'L_colorValue', 'red') + '"></td></tr>';
        opcje += '</table></center><BR><BR>';
        div.innerHTML += opcje;

        document.getElementById('L_zlomValue').addEventListener('keyup', function () {
            GM_setValue(id + 'L_zlomValue', this.value);
        }, false);

        document.getElementById('L_progValue').addEventListener('keyup', function () {
            GM_setValue(id + 'L_progValue', this.value);
        }, false);

        document.getElementById('L_colorValue').addEventListener('keyup', function () {
            GM_setValue(id + 'L_colorValue', this.value);
        }, false);

        document.getElementById('content-mid').style.minHeight = '1000px';
    }

    var cenaZlomu = parseInt(GM_getValue(id + 'L_zlomValue', '100'));
    var prog = parseFloat(GM_getValue(id + 'L_progValue', '0.8'));
    var color = GM_getValue(id + 'L_colorValue', 'red')

    var rows = document.querySelectorAll(".auctionRow");
    rows.forEach(function (row, i) {
        var span = row.querySelector("td:nth-child(2) > span");
        var itemOnclickText = span.getAttribute('onclick');
        var isWinning = row.querySelector("td:nth-child(1)").innerHTML.indexOf('src="gfx/aubid.gif"') > -1;
        var rowBold = false;
        if(itemOnclickText && !isWinning) {
            var s = itemOnclickText.split("Cena sprzedaży:</b> ")
            if (s.length) {
                var t = s[1].split(" PLN")[0];
                //var insideSpan = span.querySelector("span");
                span.textContent += " | " + t;

                var pln = parseFloat(t.replace(/\s/g, ''));
                var currentOffer = row.querySelector("td:nth-child(4)").innerText.replace(/\s/g, '');

                if(currentOffer === "-brak-") currentOffer = 48; //trochę mniej niż połowa (50pr)
                var prGiven = parseFloat(currentOffer);

                var iloscZlomuZItema = pln/20000;
                var wartoscZlomu = iloscZlomuZItema * cenaZlomu

                if(wartoscZlomu * prog > prGiven) rowBold = true;
            }

            if(rowBold) {
                row.style.color = color;
                row.classList.add('cheap');
            }
        }
    });

    function buyTopJunk () {
        var firstJunkBuyBtn = document.querySelector('.cheap td:nth-child(7) img');
        if(firstJunkBuyBtn) {
            firstJunkBuyBtn.click();
            document.getElementById('bidBtn').click();
        }
    }

    var filterContainer = document.getElementsByClassName('itemFilterSelectContainer')[0];
    filterContainer.innerHTML += '<input type="button" class="button actionButton" style="margin-left: 20px; margin-top: 7px;" id="buyBtn" value="Kup Złom">';
    document.getElementById('buyBtn').addEventListener('click', function () {
        buyTopJunk();
    }, false);
})();