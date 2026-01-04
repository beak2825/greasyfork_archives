// ==UserScript==
// @name         Filtr misji dla Rebeliantów
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Filtr misji dla Rebeliantów - mega multi kox 3000 premium
// @author       niby informatyk
// @match        https://www.operatorratunkowy.pl/vehicles/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476771/Filtr%20misji%20dla%20Rebeliant%C3%B3w.user.js
// @updateURL https://update.greasyfork.org/scripts/476771/Filtr%20misji%20dla%20Rebeliant%C3%B3w.meta.js
// ==/UserScript==

var $ = window.jQuery;



(function() {
    'use strict';

    const dobrze_platne = ['Kolizja samolotów na pasie startowym', 'Rozległe zamieszki', 'Poszukiwania wielkoobszarowe', 'Festiwal', 'Katastrofa samolotu pasażerskiego', 'Wybuch zbiorników chemicznych', 'Rozległy pożar lasu', 'Zawalona kamienica', 'Wykolejenie się pociągu z substancją radioaktywną', 'Awaryjne lądowanie samolotu pasażerskiego na wodzie', 'Niebezpieczeństwo na lotnisku', 'Pożar spalarni śmieci', 'Pożar oczyszczalni ścieków', 'Wypadek kolejowy - Zderzenie czołowe dwóch pociągów', 'Pożar w budynku magazynowym nawozów', 'Eksplozja w parku wodnym', 'Rozległy pożar zboża na pniu', 'Aktywny strzelec', 'Pożar biurowca', 'Duży niebezpieczny protest', 'Niebezpieczeństwo w centrum handlowym', 'Pożar na stacji benzynowej', 'Zawalony tunel', 'Średni niebezpieczny protest', 'Pożar w magazynie chemicznym', 'Wybuch w fabryce fajerwerków', 'Średnie ekstremistyczne zamieszki', 'Pożar w terminalu lotniska', 'Wyciek w parku wodnym', 'Rozległy pożar pola', 'Zawalony dach sklepu', 'Pożar elektrowni', 'Pożar Fabryki Chemikaliów', 'Pożar w parku wodnym', 'Demonstracja antyrządowa', 'Duży pożar lasu', 'Duży pożar zboża na pniu', 'Ewakuacja biurowca', 'Pożar szeregowca', 'Poszukiwania zbiegłego przestępcy', 'Pożar w więzieniu', 'Duży protest', 'Eksplozja silosu', 'Poszukiwania osoby na otwartym terenie', 'Zawalony budynek mieszkalny', 'Duże zamieszki', 'Pożar hangaru', 'Poważny wypadek na autostradzie', 'Zaginięcie w lesie', 'Zabezpieczenie meczu piłkarskiego', 'Napad na bank', 'Pożar dużego parku', 'Zawalony dach budynku', 'Alarm Bombowy w Szpitalu', 'Wypadek z udziałem cysterny przewożącej niebezpieczną substancję', 'Średni protest', 'Pożar biblioteki', 'Alarm Bombowy w Hotelu', 'Małe ekstremistyczne zamieszki', 'Zawalenie mostu', 'Pożar Dużego Magazynu', 'Pożar hali z transformatorem', 'Pożar rafinerii', 'Mały niebezpieczny protest', 'Zagrożenie skażeniem chemicznym w pociągu', 'Rozległy pożar wysypiska śmieci', 'Zawalenie się wieży kościoła', 'Przerwanie wału przeciwpowodziowego'];
    const ile_platne = ['50000', '48000', '42000', '41600', '40600', '40600', '40000', '38000', '35000', '32000', '30000', '29500', '28900', '28000', '27500', '24000', '21500', '21300', '20900', '20700', '19000', '18900', '18900', '18525', '18500', '18000', '17135', '17000', '16550', '16500', '16500', '16350', '16200', '16000', '15500', '15500', '15500', '15000', '15000', '14500', '14500', '14375', '14000', '14000', '14000', '13800', '13000', '12890', '12800', '12535', '12500', '12500', '12500', '12000', '11410', '11270', '11250', '11000', '10925', '10910', '10900', '10800', '10600', '10595', '10500', '10300', '10200', '10050'];

    let missions_30 = [];
    let missions_27 = [];
    let missions_15 = [];
    let missions_8 = [];

    let firstP = true;
    let i = 1;

    while (firstP) {
        firstP = document.evaluate('//*[@id="mission_alliance"]/table/tbody/tr['+ i +']/td[3]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (firstP) {
            let ile = ile_platne[dobrze_platne.indexOf(firstP.textContent)];
            if (dobrze_platne.includes(firstP.textContent) && firstP.parentNode.parentNode.innerHTML.includes("glyphicon glyphicon-asterisk")) {
                //console.log("jest" + firstP.parentNode.parentNode.innerHTML);
                if (ile > 30000) {
                    firstP.innerHTML = firstP.innerHTML + "<span style='background-color: red; font-size: 30px;'> " + ile.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); + " </span>";
                    missions_30.push(firstP.parentElement.innerHTML.split("\"")[1]);
                } else if (ile > 27000) {
                    firstP.innerHTML = firstP.innerHTML + "<span style='background-color: orange; font-size: 30px;'> " + ile.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); + " </span>";
                    missions_27.push(firstP.parentElement.innerHTML.split("\"")[1]);
                } else if (ile > 15000) {
                    firstP.innerHTML = firstP.innerHTML + "<span style='background-color: yellow; font-size: 30px;'> " + ile.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); + " </span>";
                    missions_15.push(firstP.parentElement.innerHTML.split("\"")[1]);
                }
                else if (ile > 8000) {
                    firstP.innerHTML = firstP.innerHTML + "<span style='background-color: grey; font-size: 30px;'> " + ile.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); + " </span>";
                    missions_8.push(firstP.parentElement.innerHTML.split("\"")[1]);
                } else {
                    firstP.parentNode.parentNode.style.display='none';
                }
            } else {
                    firstP.parentNode.parentNode.style.display='none';
                    //console.log("Mało płatna: " + firstP.textContent);
            };
        };
        i = i + 1;
    };


    $(".breadcrumb").append('<a id="open_one_card" class="btn btn-success">Otworz 1 karte </a>');

var mission_number_to_open = 0;
function open_next_mission() {

    var misje = missions_30.concat(missions_27).concat(missions_15).concat(missions_8);
       if(typeof misje[mission_number_to_open] !== "undefined") {
           var myChild = window.open("https://www.operatorratunkowy.pl" + misje[mission_number_to_open], "_blank");
           myChild.blur();

       }
    mission_number_to_open = mission_number_to_open + 1;
}


document.querySelector("#open_one_card").addEventListener ("click", function() { open_next_mission(); } , false);



function onKeydown(evt) {
// Use https://keycode.info/ to get keys
    if (evt.keyCode == 113) {
        open_next_mission();
    }
}
document.addEventListener('keydown', onKeydown, true);


})();













