// ==UserScript==
// NOWA WERSJA - POPRAWIONA
// @name     DziennikoNaprawiacz
// @author	 morsisko
// @version  2
// @grant    none
// @match	   https://iuczniowie.progman.pl/*/mod_panelRodzica/Oceny.aspx
// @description Skrypt przywracajacy poprawne wyswietlanie ocen
// @namespace https://greasyfork.org/users/166829
// @downloadURL https://update.greasyfork.org/scripts/367953/DziennikoNaprawiacz.user.js
// @updateURL https://update.greasyfork.org/scripts/367953/DziennikoNaprawiacz.meta.js
// ==/UserScript==

function getTranslation(percent)
{
  if (percent <= 37)
    return 1;

  else if (percent <= 53)
    return 2;

  else if (percent <= 69)
    return 3;

  else if (percent <= 85)
    return 4;

  else if (percent <= 100)
    return 5;

  return 6;
}

function calculatePoints(przedmiot)
{
  var current = 0;
  var max = 0;

  for (var i = 0; i < przedmiot.Oceny.length; ++i)
  {
    var currentMark = przedmiot.Oceny[i];
    if (!currentMark.DoSredniej)
      continue;

    current += currentMark.WartoscDoSred;
    max += currentMark.MaxIloscPunktow;
  }

  var percent = current/max*100;
  return [current, max, percent, getTranslation(percent)];
}

function budujWiersz_OcenyZwykle(przedmiot, numer, sem3i4) {

    if (opisoweNaPodstawieOcen && ((wyswietlanePrzedmiotyOpisowe && !przedmiot.opisowy) || (!wyswietlanePrzedmiotyOpisowe && przedmiot.opisowy)))
        return "";

		if (alreadyListed.indexOf(przedmiot.IdPrzedmiotu) >= 0)
    {
      toSkip += 1;
      return "";
    }

  	numer -= toSkip;
  	alreadyListed.push(przedmiot.IdPrzedmiotu);

  	if (przedmiot.Oceny.length > 1 && przedmiot.Oceny[0].idK == przedmiot.Oceny[1].idK)
    {
      var i = przedmiot.Oceny.length;

      while (i--) {
        (i + 1) % 2 == 0 && przedmiot.Oceny.splice(i, 1);
      }
    }



    var j;
    var wiersz;
    var numerWiersza = 0;
    var clOrange, clGreen, clYellow;

    var oceny1i3 = "";
    var oceny2i4 = "";
    var ocenak1i3 = "";
    var ocenak2i4 = "";

    //sprawdzamy czy wiersz jest parzysty
    if (numer % 2 == 0) {
        numerWiersza = 1;
        clOrange = '#FFF3E5';
        clGreen = '#F3FFE5';
        clYellow = '#FFFFE5';
    } else {
        numerWiersza = 2;
        clOrange = '#FFE6CC';
        clGreen = '#E7FFCC';
        clYellow = '#FFFFCC';
    }

    //oceny z tego przedmiotu
    for (j = 0; j < przedmiot.Oceny.length; j++) {

        var tmpOcena = przedmiot.Oceny[j];
        var strHistoria = budujHistorieOceny(tmpOcena.Historia, numer + '_' + j);
        var strOcena = budujOcene(tmpOcena, numer + '_' + sem3i4 + '_' + j) + ' ';

        //semestr 1 i 3
        if ((tmpOcena.Semestr == 1 && !sem3i4) || (tmpOcena.Semestr == 3 && sem3i4)) {
            if (tmpOcena.Typ == 0)
                oceny1i3 = oceny1i3 + strHistoria + strOcena;
            else
                ocenak1i3 = ocenak1i3 + strOcena;
        }

        //semestr 2 i 4
        if ((tmpOcena.Semestr == 2 && !sem3i4) || (tmpOcena.Semestr == 4 && sem3i4)) {
            if (tmpOcena.Typ == 0)
                oceny2i4 = oceny2i4 + strHistoria + strOcena;
            else
                ocenak2i4 = ocenak2i4 + strOcena;
        }
    }

  	var calculated = calculatePoints(przedmiot);
    //sklejenie całego wiersza
    if (pokazPunktowe) {
        wiersz = '<tr class="styl_wiersza' + numerWiersza + '">' +
            '<td style="text-align:left;  background-color:' + clGreen + ';">' + przedmiot.Przedmiot + "</td>" +
            '<td class="malyFont" style="text-align:left;">' + oceny1i3 + "</td>" +
            '<td class="malyFont" style="text-align:center;">' + ocenak1i3 + "</td>" +
            '<td class="malyFont srSem" style="text-align:center; background-color:' + clOrange + ';">' + przedmiot.PunktyWSemestrach[0].Suma + "</td>" +
            '<td class="malyFont srSem" style="text-align:center; background-color:' + clOrange + ';">' + przedmiot.PunktyWSemestrach[0].Max + "</td>" +
            '<td class="malyFont srSem" style="text-align:center; background-color:' + clOrange + ';">' + przedmiot.PunktyWSemestrach[0].Procent + "</td>";

        if (pokazPropozycjeOceny)
            wiersz += '<td class="malyFont srSem" style="text-align:center; background-color:' + clYellow + ';">' + przedmiot.PunktyWSemestrach[0].PropozycjaOceny + "</td>";

        wiersz += '<td class="malyFont" style="text-align:left;">' + oceny2i4 + "</td>" +
            '<td class="malyFont" style="text-align:center;">' + ocenak2i4 + "</td>" +
            '<td class="malyFont" style="text-align:center; background-color:' + clOrange + ';">' + calculated[0].toString() + "</td>" +
            '<td class="malyFont" style="text-align:center; background-color:' + clOrange + ';">' + calculated[1].toString() + "</td>";

        if (pokazPropozycjeOceny) {
            wiersz += '<td class="malyFont" style="text-align:center; background-color:' + clOrange + ';">' + (Math.round(calculated[2] * 100) / 100).toString() + "%</td>";
            wiersz += '<td class="malyFont styl_wiersza_prawy" style="text-align:center; background-color:' + clYellow + ';">' + calculated[3].toString() + "</td>";
        }
        else
            wiersz += '<td class="malyFont styl_wiersza_prawy" style="text-align:center; background-color:' + clOrange + ';">' + "5" + "</td>";

        wiersz += '</tr>';
    }
    else {
        wiersz = '<tr class="styl_wiersza' + numerWiersza + '">' +
            '<td style="text-align:left; background-color:' + clGreen + ';">' + przedmiot.Przedmiot + "</td>" +
            '<td class="malyFont" style="text-align:left;">' + oceny1i3 + "</td>" +
            '<td class="malyFont srednia" style="text-align:center;">' + (sem3i4 == false ? przedmiot.SrednieWSemestrach[0] : przedmiot.SrednieWSemestrach[2]) + "</td>" +
            '<td class="malyFont" style="overflow:hidden; text-align:center; background-color:' + clYellow + ';">' + ocenak1i3 + "</td>" +
            '<td class="malyFont" style="text-align:left;">' + oceny2i4 + "</td>" +
            '<td class="malyFont srednia" style="text-align:center;">' + (sem3i4 == false ? przedmiot.SrednieWSemestrach[1] : przedmiot.SrednieWSemestrach[3]) + "</td>";

        klasaDlaKolumnyPosumowania = (sem3i4 ? 'podsumowanieRokuSem4' : 'podsumowanieRokuSem2');

        if (pokazSrednia) {
            wiersz += '<td class="malyFont styl_wiersza_prawy" style="overflow:hidden; text-align:center; background-color:' + clYellow + ';">' + ocenak2i4 + "</td>" +
                '<td class="malyFont srednia styl_wiersza_prawy ' + klasaDlaKolumnyPosumowania + '" style="text-align:center;">' + przedmiot.SrednieCaloroczne + "</td>" +
                '</tr>';
        } else {
            wiersz += '<td class="malyFont styl_wiersza_prawy" style="overflow:hidden; text-align:center; background-color:' + clYellow + ';">' + ocenak2i4 + "</td>" +
                '<td class="malyFont srednia ' + klasaDlaKolumnyPosumowania + '" style="text-align:center;">' + przedmiot.SrednieCaloroczne + "</td>" +
                '</tr>';
        }
    }

    return wiersz;
}

var scriptNode          = document.createElement('script');
scriptNode.type         = "text/javascript";
scriptNode.textContent  = "var toSkip = 0; var alreadyListed = [];" + getTranslation.toString() + calculatePoints.toString() + budujWiersz_OcenyZwykle.toString();
var targ                = document.getElementsByTagName ('head')[0] || document.body;
targ.appendChild (scriptNode);