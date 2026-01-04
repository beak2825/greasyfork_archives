// ==UserScript==
// @name            ilosc_wojska1
// @namespace       d:\serwerek\ilosc_wojska1.js
// @description     Kalkulator ataku
// @include         http://s*.kingsage.*
// @exclude         http://s*.kingsage.pl/forum.*
// @grant           GM_getValue
// @grant           GM_setValue
// @version 0.0.1.20171211155818
// @downloadURL https://update.greasyfork.org/scripts/36256/ilosc_wojska1.user.js
// @updateURL https://update.greasyfork.org/scripts/36256/ilosc_wojska1.meta.js
// ==/UserScript==
var syrenka;
syrenka = 'data:audio/mpeg;base64,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';
// ===  formatowanie tysięcy np. 1000000 zamieni na 1,000,000 ===
function formatujTysiace(nStr) {
  nStr += '';
  var x = nStr.split('.'),
  x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '',
  rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1))
  x1 = x1.replace(rgx, '$1' + '.' + '$2');
  return x1 + x2;
}
// ===  Dodanie jednej kolumny w zestawieniu  ===================

function tddod(j) {
  var findPattern = '/html/body/div[3]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/div[6]/div/table/tbody/tr[' + (j + 1) + ']';
  var resultLinks = document.evaluate(findPattern, document, null, XPathResult.ANY_TYPE, null);
  var rst = resultLinks.iterateNext();
  rst.innerHTML = rst.innerHTML + '<td style = "text-align:right;"> ' + text2 + '<b> pkt.</b> </td>';
}
//=== inicjowanie sygnalu

function init()
{
  if (!GM_getValue('boolsound'))
  {
    GM_setValue('boolsound', false)
  }
  var icon = document.createElement('img')
  icon.setAttribute('style', 'position:absolute;top:40px;left:40px;z-index:10000;')
  icon.addEventListener('click', function () {
    GM_setValue('boolsound', !GM_getValue('boolsound'));
    document.location.reload();
  }, true); //
  if (GM_getValue('boolsound'))
  {
    icon.setAttribute('src', '/img/worker.png')
    icon.setAttribute('title', 'KingsAge Attackalarm - on')
  } else
  {
    icon.setAttribute('src', '/img/layout/role_ico_close.png')
    icon.setAttribute('title', 'KingsAge Attackalarm - off')
  }
  document.body.appendChild(icon)
}
// == atak na Ciebie

function checkattack() {
  tds = document.getElementsByClassName('lay_tower_left_top_attack') [0]
  if (tds) {
    if (GM_getValue('boolsound')) {
      syren = document.createElement('object')
      syren.setAttribute('data', syrenka)
      syren.setAttribute('hidden', true)
      syren.setAttribute('loop', false)
      syren.innerHTML = '<embed />'
      document.body.appendChild(syren)
      setTimeout('document.location.reload()', RELOADTIME * 400);
    }
  }
}
//usunuecie denerwujacej reklamy po prawej stronie

var findPattern = '/html/body/div[3]/div/div';
var resultLinks = document.evaluate(findPattern, document, null, XPathResult.ANY_TYPE, null);
var rst = resultLinks.iterateNext();
rst.innerHTML = '';
//start kalkulatora
var qs = new Array();
var loc = location.search;
if (loc) {
  loc = loc.substring(1);
  var parms = loc.split('&');
  for (var i = 0; i < parms.length; i++) {
    nameValue = parms[i].split('=');
    qs[nameValue[0]] = unescape(nameValue[1]);
  }
}
var RELOADTIME = 30; //Reloadtime in secounds
window.addEventListener('load', function () {
  init();
  checkattack();
}, true);
setTimeout('document.location.reload()', RELOADTIME * 6000);
//===  ZAKLADKA SOJUSZ + WOJO ===================================
if (qs['s'].toString() == 'info_member') {
  var div;
  var table;
  var division;
  var links;
  var i;
  var j = 0;
  var text;
  var osad = 0;
  table = document.getElementsByClassName('borderlist');
  if (!table) return;
  if (document.location.href.indexOf('info_player') == - 1) {
    for (i = 2; i < table.length; i++) {
      links = table[i].getElementsByTagName('tr');
      //wyszukanie i wpisanie naglowka TH
      var findPattern = '/html/body/div[3]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/div[6]/div/table/tbody/tr';
      var resultLinks = document.evaluate(findPattern, document, null, XPathResult.ANY_TYPE, null);
      var rst = resultLinks.iterateNext();
      rst.innerHTML = rst.innerHTML + '<th style="width:120px; text-align:right;"> Za wojsko</th>';
      //petla poszczegolnych wierszy
      for (j = 1; j < links.length; j++) {
        division = links[j].getElementsByTagName('td');
        text2 = division[2].textContent;
        text2 = text2.replace('.', '');
        text2 = text2.replace('.', '');
        osad = division[3].textContent;
        if (osad == 0) {
          text2 == 0;
        } else {
          text2 == text2 - (2550 * (osad - 1));
        }
        tddod(j);
      }
    }
  }
}
//===  ILOSC WOJSKA GRACZA  =====================================

if (qs['s'].toString() == 'info_player') {
  var div;
  var table;
  var division;
  var links;
  var i;
  var j = 1;
  var text;
  var suma_pkt;
  var linek1;
  var linek;
  var text3 = 0;
  var findPattern = '/html/body/div[3]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/div[6]/div/table/tbody/tr/td/table/tbody/tr/th';
  var resultLinks = document.evaluate(findPattern, document, null, XPathResult.ANY_TYPE, null);
  var rst = resultLinks.iterateNext();
  var wyn = rst.innerHTML;
  wyn = wyn.replace(/ /g, '');
  wyn1 = wyn.slice(17);
  table = document.getElementsByClassName('borderlist');
  if (!table) return;
  links = table[2].getElementsByTagName('tr');
  suma_pkt = links[2].getElementsByTagName('td');
  text1 = suma_pkt[1].textContent;
  text1 = text1.replace('.', '');
  text1 = text1.replace('.', '');
  linek = document.getElementsByClassName('borderlist');
  if (!linek) return;
  if (document.location.href.indexOf('info_village') == - 1) {
    for (i = 3; i < linek.length; i++) {
      linek1 = linek[i].getElementsByTagName('tr');
      for (j; j < linek1.length; j++) {
        division = linek1[j].getElementsByTagName('td');
        text2 = division[2].textContent;
        text2 = text2.replace('.', '');
        text3 = Number(text3) + Number(text2);
      }
    }
  }
  wojsko = Number(text1 - (text3 + ((j - 2) * 2250)));
  woj_osadka = Math.round(wojsko / (j - 1));
  wojsko = formatujTysiace(wojsko);
  woj_osadka = formatujTysiace(woj_osadka);
  text1 = formatujTysiace(text1);
  text3 = formatujTysiace(text3);
  var findPattern = '/html/body/div[3]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/div[6]/div';
  var resultLinks = document.evaluate(findPattern, document, null, XPathResult.ANY_TYPE, null);
  var rst = resultLinks.iterateNext();
  rst.innerHTML = rst.innerHTML + '<table style="width: 300px;" class="borderlist"><tbody><tr><th>Punkty za wojsko:</th><th>PUNKTY</th></tr><tr><td>Kto</td><td style="text-align:right;"><b>' + wyn1 + '</b></td></tr><tr><td>Calosc</td><td style="text-align:right;"><b>' + text1 + ' pkt.</b></td></tr><tr><td>Osady</td><td style="text-align:right;"><b>' + (j - 1) + ' szt.</b> </td></tr><tr><td>Wojsko calosc</td><td style="text-align:right;"><b>' + wojsko + ' pkt.</b></td></tr><tr><td>Wojsko na osadke</td><td style="text-align:right;"><b>' + woj_osadka + ' pkt.</b></td></tr></tbody></table>';
}
//
//Kalkulator ataku

if (qs['m'].toString() == 'attacks') {
  var locs = window.location.toString();
  var ls = locs.slice(7, 11);
  var table;
  var division;
  var links;
  var i = 2;
  var j;
  var text;
  var temp_x;
  var temp_y;
  //wyznaczanie j jezeli jest wiecej niz jedna zakladka
  var findPattern = '/html/body/div[3]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/div[6]/div/table/tbody/tr/td/b';
  var resultLinks = document.evaluate(findPattern, document, null, XPathResult.ANY_TYPE, null);
  var rst = resultLinks.iterateNext();
  if (!rst) j = 1;
   else j = 2;
  // szukaj tagu table (borderlist)
  table = document.getElementsByClassName('borderlist');
  if (!table) return;
  if (document.location.href.indexOf('info_village') == - 1) {
    // przeszukaj tabele
    for (i; i < table.length; i++) {
      links = table[i].getElementsByTagName('tr');
      for (j; j < links.length; j++) {
        // links.length -> kolejne kolumny  od 0-4
        division = links[j].getElementsByTagName('td');
        //alert( parseint.division[1]);
        //pobranie danych osady i 1 gracza z 2 rubryki takie rowiazanie
        text1 = division[1].textContent;
        text2 = Number(text1.slice( - 16, - 13));
        text3 = Number(text1.slice( - 12, - 9));
        //pobranie danych osady 2 gracza  z 3 rubryki
        text4 = division[2].textContent;
        text5 = Number(text4.slice( - 16, - 13));
        text6 = Number(text4.slice( - 12, - 9));
        //obliczanie odleglosci miedzy osadami
        temp_x = Number(text2 - text5);
        temp_y = Number(text3 - text6);
        a_odl = Math.sqrt(Math.pow(temp_x, 2) + Math.pow(temp_y, 2));
        b_flag = division[3].textContent;
        a_flag = division[4].textContent;
        b_sek = Number(a_flag.slice( - 2));
        //alert (b_flag +':'+ b_sek);
        //pobranie czasu i przeliczenie na min  z 5-tej rubryki
        a_spr = a_flag.indexOf('D');
        if (a_spr == - 1) a_dni2 = 0;
         else a_dni2 = a_flag.substring(0, a_spr);
        a_min2 = Number(a_flag.slice( - 5, - 3));
        a_godz2 = Number(a_flag.slice( - 8, - 6));
        a_min2 = (a_dni2 * 1440) + (a_godz2 * 60) + a_min2;
        if (ls.toString() == 's18.') {
          a_min2 = 2 * a_min2; //dla serwera 18
        }
        if (ls.toString() == 's30.') {
          a_min2 = 4 * a_min2; //dla serwera 19, 30
        }
        if (ls.toString() == 's21.') {
          a_min2 = 2 * a_min2; //dla serwera 21
        }
        //Szpieg 								2
        //Krzyżowiec 								3
        //Czarny rycerz 							3
        //W?ciekły wojownik,Giermek,Długi łuk 		5
        //Wiejska milicja 							5
        //Templariusz 								6
        //Taran ,Katapulta 							9
        //Hrabia 								9
        //To wszystko dla s30 ale nie jest wymagane

        if (a_odl - a_min2 / 9 > 0) k = '<img src="/img/units/unit_spy.png"/>Sz';
         else if (a_odl - a_min2 / 10 > 0) k = '<img src="/img/units/unit_light.png"/>K';
         else if (a_odl - a_min2 / 11 > 0) k = '<img src="/img/units/unit_heavy.png"/>Cr';
         else if (a_odl - a_min2 / 18 > 0) k = '<img src="http://s1.kingsage.org/img/units/unit_axe.png"/>Ww';
         else if (a_odl - a_min2 / 20 > 0) k = '<img src="http://s1.kingsage.org/img/units/unit_farmer.png"/>Mil';
         else if (a_odl - a_min2 / 22 > 0) k = '<img src="http://s1.kingsage.org/img/units/unit_sword.png"/>Tmp';
         else if (a_odl - a_min2 / 30 > 0) k = '<img src="http://s1.kingsage.org/img/units/unit_kata.png"/>Tar';
         else if (a_odl - a_min2 / 35 > 0) k = '<img src="http://s1.kingsage.org/img/units/unit_snob.png"/><b>Grubas</b>';
        //wpisujemy k do pierwszej kratki
        division[0].innerHTML = k;
      }
    }
  }
}