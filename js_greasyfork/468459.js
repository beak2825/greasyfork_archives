// ==UserScript==
// @name         Planner MS
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fix MS Planner web app
// @author       WuuDee
// @license      MIT
// @match        https://tasks.office.com/student.pwr.edu.pl/pl-PL/Home/Planner/
// @match        https://tasks.office.com/student.pwr.edu.pl/pl/Home/Planner/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=office.com
// @grant        GM_addStyle
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/468459/Planner%20MS.user.js
// @updateURL https://update.greasyfork.org/scripts/468459/Planner%20MS.meta.js
// ==/UserScript==

(function() {
    'use strict';

function ss(s) { // zmień/dodaj styl
GM_addStyle(s.replaceAll(`;`,` !important;`));
}
function uk(s) { // ukryj
GM_addStyle(s+" { display: none !important; }");
}
GM_addStyle(`
:root {
  --WD_tlo_glowne:         #c0c0c0;
  --WD_tlo_pasow_naglowki: #b0b0b0;
  --WD_tlo_tytul_pasa:     #FFFFFF;
  --WD_txt_tytul_pasa:     #000000;
  --WD_tlo_pasow:          #D0D0D0;
  --WD_tlo_zadania1:       #FcFcFc;
  --WD_tlo_zadania2:       #FaFaFa;
  --WD_txt_tytul_zadania:  #000066;
  --WD_tlo_btn_dodaj:      #ADADAD;
  --WD_txt_btn_dodaj:      #7B7B7B;
  --WD_tlo_edycja_zad:     #D8D8D8;
  --WD_tlo_btn_donetasks:  #dddddd;
  --WD_tlo_calend_dzien:   #cccccc;
  --WD_tlo_calend_event1:  #CC0107;
  --WD_txt_calend_event1:  #EEEEEE;
  --WD_tlo_calend_header:  #cccccc;
}
`);
//-------------------------------------------------- nazwa tablicy u góry +ikona z lewej od nazwy
ss(`
div.primaryTextSectionContainer {
  background-color: var(--WD_tlo_btn_donetasks);
  padding-left: 4px;
}
`);
uk("img.icon");
//-------------------------------------------------- ikona różowa "WD" w wykonanych zadaniach
uk("div.ms-Persona-imageArea");
//uk("primaryIconBadge css-180");
//uk("ms-Image icon text-wrapper linkIcon dynamicIcon root-258");
//-------------------------------------------------- ikonka mała w zadaniach -wykonawcy
uk("div.assignDiv");
//-------------------------------------------------- padding zawartości karty
ss(`
div.topBar.css-224 {
  padding-bottom: 2px;
  padding-top: 2px;
  padding-left: 3px;
}
`);
//-------------------------------------------------- Zmniejszenie odległości między tytułem zadania lub ostatnim checkitem a panelikiem z datą poniżej lub dolnym brzegiem kartki (indicatorRow css-222)
ss(`.css-222 {
  margin-top: 3px;
}
`);
//-------------------------------------------------- tytuł zadania-karty
ss(`div.title {
  color: var(--WD_txt_tytul_zadania);
  font-weight: 500;
  font-style: normal;
}
`);
//-------------------------------------------------- tło pasów
ss(`div.scrollable {
  background-color: var(--WD_tlo_pasow);
}
`);
//-------------------------------------------------- tło zadania
ss(`div.topBar {
  background-color: var(--WD_tlo_zadania1);
}
`);
ss(`div.bottomBar {
  background-color: var(--WD_tlo_zadania2);
}
`);
//-------------------------------------------------- nagłówki kolumn - pasów (tytuł + przycisk +Dodaj zadanie)
ss(`div.columnHeader {
  background-color: var(--WD_tlo_pasow_naglowki);
}
`);

//-------------------------------------------------- tło tablicy pod kartami, +górne, +bocznego panelu lewego
ss(`div.content {
  background-color: var(--WD_tlo_glowne);
}
`);
//-------------------------------------------------- tło paneliku z lewej u góry z menu hamburgera
ss(`div.header {
  background-color: var(--WD_tlo_glowne);
}
`);
//-------------------------------------------------- tło paneliku z lewej u dołu z Pobierz apkę
ss(`div.footer {
  background-color: var(--WD_tlo_glowne);
}
`);
//-------------------------------------------------- przycisk +Dodaj zadanie nad pasem
ss(`div.addButton.active_0 {
  background-color: var(--WD_tlo_btn_dodaj);
}
`);
//-------------------------------------------------- tytuł-nazwa pasa
ss(`div.titleSection {
  color: var(--WD_txt_tytul_pasa);
  font-size: 18px;
  font-weight: 500;
  font-style: normal;
  background-color: var(--WD_tlo_tytul_pasa);
  padding-left: 6px;
}
`);
//-------------------------------------------------- napis "+Dodaj zadanie" na przycisku
ss(`span.addTaskText {
  color: var(--WD_txt_btn_dodaj);
}
`);
//-------------------------------------------------- tło wnętrza edycji zadania
ss(`div.taskEditor {
  background-color: var(--WD_tlo_edycja_zad);
}
`);
//-------------------------------------------------- tło przycisku rozwinięcia zadań wykonanych
ss(`button.sectionToggleButton {
  background-color: var(--WD_tlo_btn_donetasks);
}
`);
//-------------------------------------------------- kalendarz dzień tło
ss(`div.fc-daygrid-day-frame.fc-scrollgrid-sync-inner {
 background-color: var(--WD_tlo_calend_dzien);
}
`);
//-------------------------------------------------- kalendarz zdarzenie
ss(`div.taskEvent {
  background-color: var(--WD_tlo_calend_event1);
  color: var(--WD_txt_calend_event1);
}
`);
//-------------------------------------------------- =kalendarz tydzień nagłówek lewa i prawa strona/połowa
ss(`div.headerToolbarLeft {
 background-color: var(--WD_tlo_calend_header);
}
`);
ss(`div.headerToolbarRight {
 background-color: var(--WD_tlo_calend_header);
}
`);
//--------------------------------------------------
ss(`addButton.css-207.active_0 {
 height: 20px;
}
`);

// ścieżka tagów.stylów (3kropki tzn. że są dodane style kolejne do tagu):
// div.taskBoardCard... / div.ms-FocusZone... / div.taskCard... / div.container / div.textContent... / ul.labels / li."" / div.labelTag...  <== etykietki kolorowe
// div.taskBoardCard... / div.ms-FocusZone... / div.taskCard... / div.container / div.textContent... / div.topBar... / div.titleRow / div.title  <== topBar to główny panelik zadania
// div.taskBoardCard... / div.ms-FocusZone... / div.taskCard... / div.container / div.textContent... / div.bottomBar  <== najniższy panelik zadania - z datą wykonania i in.
// ul.labels - można schować górny panelik z labelsami
// div topBar / titleRow - bkg color tytułu zadania

/* STARE PORZUCONE
// kolorujemy całą górną część kartki-zadania, gdy jest etykieta koloru z "." w nazwie.
function Gogo(){
    var eles = document.getElementsByClassName('labelTag');
    for(var i = 0; i < eles.length; i++){
        var t=eles[i].getAttribute("title");
        if (t.indexOf(".")>=0) {
            eles[i].parentElement.parentElement.style.backgroundColor = window.getComputedStyle(eles[i]).backgroundColor;
            eles[i].style.padding = "1px 110px 12px";
            eles[i].style.fontSize="16px";
            eles[i].style.fontWeight="700";
        }
    }
    setTimeout(Gogo, 1000); // trzeba to robić cyklicznie, bo zadania niewidoczne i znikające z pola widzenia są przywracane autom. do pierwotnego stylu.
} */

var razy=10; // na początku od załadowania strony ile razy po 100ms wykonać funkcję. Po tylu szybkich razach leci wolniej, co mniej czasu.

function Gogo2(){
    const dnityg = ["ndz","pon","wto","śro","czw","ptk","sob"];
    var ele_label, ele_title, ele_label_txt, tsk_s, lbl_s, s, arr=[], sa=[], d,dzis,dif;
    var eles = document.getElementsByClassName('textContent'); // wszystkie zadania w każdym pasie
    // ROBIMY "okładkę" czyli zamieniamy zadanie na separator w kolorze jak etykietka-kolor i z tytułem jak tytuł zadania, którego treść chowamy
    for(var i = 0; i < eles.length; i++){
        arr = eles[i].getElementsByClassName('labelTag'); // panelik górny z kolorową etykietką
        ele_label = arr[0]; // pierwsza etykietka
        if (ele_label) {
            arr = eles[i].getElementsByClassName('title'); // karta zadania - tytuł zadania
            ele_title = arr[0]; // jest tylko jeden taki, nr 0.
            tsk_s = ele_title.innerText;
            if (tsk_s.indexOf("_")>=0) { // jeśli tytuł zadania ma znak specjalny, to chowamy treść karty, panelik etykiety kolorujemy i wpisujemy doń tytuł zadania, bez znaku spec./////////////////////////// COVER
                tsk_s = tsk_s.replace("_","");
                ele_title.parentElement.parentElement.style.display = "none";
                ele_label_txt = ele_label.getElementsByTagName('span')[0];
                if ((ele_label_txt) && (ele_label_txt.innerText != tsk_s)) { ele_label_txt.innerText = tsk_s; }
                ele_label.parentElement.parentElement.parentElement.style.backgroundColor = window.getComputedStyle(ele_label).backgroundColor;
                ele_label.style.maxWidth="250px";
                ele_label.style.width="240px";
                ele_label_txt.style.height="20px";
                ele_label.style.fontSize="16px";
                ele_label.style.fontWeight="700";
                ele_label.style.paddingBottom="8px";
            } else if (tsk_s.indexOf("'")>=0) { // jesli zadanie ma kolor-etykietę oraz w tytule zadania jest ten znak, to schowaj pasek etykiet i pokoloruj tytuł zadania kolorem etykiety: ////////////////// ETYKIETA KOLOR NA CAŁY TYTUŁ
                eles[i].getElementsByClassName('labels')[0].style.display="none";
                eles[i].getElementsByClassName('topBar')[0].getElementsByClassName('title')[0].style.setProperty("background-color", window.getComputedStyle(ele_label).backgroundColor, "important");
                eles[i].getElementsByClassName('topBar')[0].getElementsByClassName('title')[0].style.setProperty("color", window.getComputedStyle(ele_label).color, "important");
                eles[i].getElementsByClassName('topBar')[0].getElementsByClassName('title')[0].style.paddingLeft="6px";
                //eles[i].getElementsByClassName('topBar')[0].getElementsByClassName('title')[0].style.textAlign="center";
                tsk_s = tsk_s.replace("'","");
                if (ele_title.innerText != tsk_s) { ele_title.innerText = tsk_s; }
            }
        }
    }
    // DODAJEMY dzień tygodnia do daty zadania na karcie, jeśli jest:
    // div class dueDateIndicator: ma atrybut "title" i tam albo title="Ustaw datę ukończenia", albo np. title=" Termin wykonania: 5 czerwca 2023 "
    // Ten dueDateIndicator ma 2 dzieci: tag <i> z ikoną kalendarza, oraz <span class="calendarLabel..."> innerText="05.06." (dd.mm. -długość=6) lub gdy brak daty innerText="Do".
    eles = document.getElementsByClassName('dueDateIndicator');
    dzis = new Date();
    for(i = 0; i < eles.length; i++){
        s=eles[i].getAttribute("title");
        arr = eles[i].getElementsByClassName('calendarLabel');
        if ((s.indexOf("Termin wykonania:")>=0) && (arr[0].innerText.length==6)) {
            sa=s.split(" "); // 3:d, 4:m, 5:r
            d = new Date(sa[5],arr[0].innerText.split(".")[1]-1,sa[3]); // miesiąc 1 ma nr 0, stąd -1.
            s=dnityg[d.getDay()]; // getDay() = 0..6, od ndz
            arr[0].innerText=arr[0].innerText+" "+s;
            dif = Math.ceil(Math.abs(d - dzis) / (1000 * 60 * 60 * 24)); // za ile dni jest ta data wykonania (wylicza różnicę dat w dniach)
            if (dif<=1) { arr[0].style.backgroundColor="#FF8C00" } // jeśli to jutro (dif=1), lub dziś (dif=0) lub stare (dif<0) to daj tło
            //console.log(d.toString()+" "+s+" "+dif);
            eles[i].style.marginTop="0px";
        }
    }
    setTimeout(Gogo2, 1000-900*(razy>0)); // trzeba to robić cyklicznie, bo zadania niewidoczne i znikające z pola widzenia są przywracane autom. do pierwotnego stylu. Pierwsze n razy
    if (razy>0) { razy--;}
}

document.addEventListener('DOMContentLoaded', function() {
   Gogo2();
}, false);

})();