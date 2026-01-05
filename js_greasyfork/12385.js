// ==UserScript==
// @name 		HWM Art Repair Info
// @version 	1.2
// @description 	HWM Mod - На странице инфы арта добавляет подсчёт суммы его ремонта и длительность ремонта
// @author 	- SAURON -
// @namespace 	mod  Mefistophel_Gr
// @include 	http://*heroeswm.ru/art_info.php*
// @include 	http://178.248.235.15/art_info.php*
// @include 	http://*.lordswm.com/art_info.php*
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/12385/HWM%20Art%20Repair%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/12385/HWM%20Art%20Repair%20Info.meta.js
// ==/UserScript==

// (c) 2015, - SAURON -  (http://www.heroeswm.ru/pl_info.php?id=3658084)
// (c) 2015, Mefistophel_Gr  (http://www.heroeswm.ru/pl_info.php?id=2287844)

var version = '1.2';

(function() {
    var str = document.body.innerHTML.split("Стоимость ремонта:")[1].replace(",","");
    var myRe = /<td>\d+<\/td>/;
    var price = myRe.exec(str)[0].split("td>")[1].split("<")[0]*1;
    var h = document.body.getElementsByTagName('b');

    var time = document.evaluate( "//b[contains(text(),'\u0440\u0435\u043C\u043E\u043D\u0442')]/following-sibling::table", document, null, XPathResult.ANY_TYPE, null ).iterateNext();
    var timeset = (parseInt(time.textContent.replace(',', '')) * 0.015).toFixed(0);

    for(var i = 0; i < h.length; i++) {
        if(h[i].innerHTML == ' Стоимость ремонта:') {
            var div = document.createElement('div');
            div.innerHTML += "<br>101% = " + (price * 1.01).toFixed();
            div.innerHTML += "<br>102% = " + (price * 1.02).toFixed();
            div.innerHTML += "<br>103% = " + (price * 1.03).toFixed();
            div.innerHTML += "<br>104% = " + (price * 1.04).toFixed();
            div.innerHTML += "<br>105% = " + (price * 1.05).toFixed();
            div.innerHTML += "<br>";
            div.innerHTML += "<br>Время ремонта " + timeset + " минут(ы) ";
                if (timeset > 60) { div.innerHTML += "или " + (timeset/60).toFixed(2) + " часа(ов)."; }
            div.innerHTML += "<br><br>";

            h[i].parentNode.appendChild(div);
            i = h.length + 1;
        }
    }
})();