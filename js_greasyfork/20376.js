// ==UserScript==
// @name         Landal bezettingskalender
// @namespace    http://software.telling.nl/
// @version      1.6.0
// @description  Adds a calendar to the 'Landal bezettingsrapportage'.
// @author       Simon Telling
// @include      https://www.landaleigenaren.nl/owner/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20376/Landal%20bezettingskalender.user.js
// @updateURL https://update.greasyfork.org/scripts/20376/Landal%20bezettingskalender.meta.js
// ==/UserScript==

/* Change log
1.0.0 (8 June 2016) Initial version
1.1.0 (9 June 2016) Mainly code clean-up
1.2.0 (29 november 2016) Moved the startdate forward to the first Friday of the year.
                         Moved the calendar to the top (before the details)
1.3.0 (31 December 2017) Added the bankholidays for 2018
1.4.0 (4 April 2017) Added the bankholidays for 2019
                     Added the class 'Vandaag'
1.5.0 (10 mei 2020) Added the bankholidays for 2020
1.6.0 (10 mei 2020) Added the bankholidays for 2021

*/

var strHTML;
var s;
var v;
var head;
var style;
var css;

var table = document.getElementsByClassName( "sort-table" )[0];
var jaar = location.search.split('year=')[1].substr(0, 4);
var hd = new Date(jaar + "-01-01");
var ed = new Date(jaar + "-12-31");
var cd = new Date();
var aantallen = {'Dagen':0,'Bezet':0, 'Voorkeur':0, 'Eigen-gebruik':0};

var LocalStorageVarName = 'Hist_' + location.search.split('resort=')[1].split('&')[0] + location.search.split('locationnumber=')[1].split('&')[0] + "-" + jaar + '-' + FormatDatum(cd, 'S');
// alert(LocalStorageVarName);

var fdnl = [[1, 1, 0, "Nieuwjaarsdag"],
			[27, 4, 0, "Koningsdag"],
			[5, 5, 0, "Bevrijdingsdag"],
			[25, 12, 0, "Eerste kerstdag"],
			[26, 12, 0, "Tweede kerstdag"],
			[25, 3, 2016, "Goede vrijdag"],
			[27, 3, 2016, "Eerste Paasdag"],
			[28, 3, 2016, "Tweede paasdag"],
			[5, 5, 2016, "Hemelvaartsdag"],
			[15, 5, 2016, "Eerste pinksterdag"],
			[16, 5, 2016, "Tweede pinksterdag"],
			[25, 6, 2016, "Rondje Texel"],
			[14, 4, 2017, "Goede vrijdag"],
			[16, 4, 2017, "Eerste Paasdag"],
			[17, 4, 2017, "Tweede Paasdag"],
			[25, 5, 2017, "Hemelvaartsdag"],
			[4, 6, 2017, "Eerste pinksterdag"],
			[5, 6, 2017, "Tweede pinksterdag"],
			[10, 6, 2017, "Rondje Texel"],
            [1, 4, 2018, "Eerste paasdag"],
            [2, 4, 2018, "Tweede paasdag"],
            [10, 5, 2018, "Hemelvaart"],
            [20, 5, 2018, "Eerste pinksterdag"],
            [21, 5, 2018, "Tweede pinksterdag"],
            [21, 4, 2019, "Eerste paasdag"],
            [22, 4, 2019, "Tweede paasdag"],
            [30, 5, 2019, "Hemelvaart"],
            [9, 6, 2019, "Eerste pinksterdag"],
            [10, 6, 2019, "Tweede pinksterdag"],
	    [12, 4, 2020, "Eerste paasdag"],
            [13, 4, 2020, "Tweede paasdag"],
            [21, 5, 2020, "Hemelvaart"],
            [31, 5, 2020, "Eerste pinksterdag"],
            [1, 6, 2020, "Tweede pinksterdag"],
	    [4, 4, 2021, "Eerste paasdag"],
            [5, 4, 2021, "Tweede paasdag"],
            [13, 5, 2021, "Hemelvaart"],
            [23, 5, 2021, "Eerste pinksterdag"],
            [24, 5, 2021, "Tweede pinksterdag"]];

while (hd.getDay() != 5) {
	hd.setDate(hd.getDate()+1);
}

ed.setDate(ed.getDate()+3);
while (ed.getDay() != 4) {
	ed.setDate(ed.getDate()+1);
}


strHTML = "<div id='TableCalendar'>\n" +
	"<table>\n" +
	"<tr>\n" +
	"<th>vrijdag</th>" +
	"<th>zaterdag</th>" +
	"<th>zondag</th>" +
	"<th>maandag</th>" +
	"<th>dinsdag</th>" +
	"<th>woensdag</th>" +
	"<th>donderdag</th>" +
	"</tr>\n" +
	"<tr>\n";

while (hd <= ed) {
	var i = KalRij(hd);

	aantallen.Dagen += 1;
	if (i < 0) {
		s = "Vrij";
	} else {
		aantallen.Bezet += 1;
		if (table.rows[i].cells[4].innerHTML.substr(0, 5) == "Eigen") {
			s = "Eigen-gebruik";
			aantallen['Eigen-gebruik'] += 1;
		} else if (table.rows[i].cells[5].innerHTML == "J") {
			s = "Voorkeur";
			aantallen.Voorkeur += 1;
		} else {
			s = "Bezet";
		}
		if (table.rows[i].cells[1].innerHTML == FormatDatum(hd, "E")) {
			s = "Aankomst";
		}
	}
    if (FormatDatum(hd, "S") == FormatDatum(cd, "S")) {
        v = " Vandaag";
    } else {
        v = "";
    }

	strHTML += "<td class=\"" + s + v + "\">\n";
    strHTML += "<ul>\n<li>";
	fd = 0;
	for(var i=0; i < fdnl.length; i++){
		if (Number(hd.getDate()) == fdnl[i][0] && Number(hd.getMonth()) == (fdnl[i][1]-1) && (fdnl[i][2] === 0 || Number(hd.getFullYear()) == fdnl[i][2])) {
			strHTML += "<li>" + fdnl[i][3] + "</li>\n";
			fd += 1;
		}
	}
	if (fd === 0) {
		strHTML += "<li>" + FormatDatum(hd) + "</li>";
	}

	strHTML += "</ul>\n";
	strHTML += "</td>";
	if (hd.getDay() == 4) {
		strHTML += "</tr>\n";
		if (hd < ed) {
			strHTML += "<tr>\n";
		}
	}
	hd.setDate(hd.getDate()+1);
}

strHTML += "</table>\n";
strHTML += "</div>  <!-- Einde TableCalendar -->\n";

strHTML += "<div id='Legenda'>" +
	"<ul>" +
	"<li>Legenda:</li>" +
	"<li class='Vrij'>Vrij</li>" +
	"<li class='Aankomst'>Aankomst</li>";
if (aantallen.Bezet > 0) {
	strHTML += "<li class='Bezet'>Bezet (" + DispPerc(aantallen.Bezet, aantallen.Dagen) + ")</li>";
}
if (aantallen.Voorkeur > 0) {
	strHTML += "<li class='Voorkeur'>Voorkeur (" + DispPerc(aantallen.Voorkeur, aantallen.Bezet) + ")</li>";
}
if (aantallen['Eigen-gebruik'] > 0) {
	strHTML += "<li class='Eigen-gebruik'>Eigen gebruik (" + DispPerc(aantallen['Eigen-gebruik'], aantallen.Bezet) + ")</li>";
}
strHTML += "</ul>\n" +
	"</div>  <!-- Einde Legenda -->\n";

css = "#TableCalendar { font-size: 8pt; margin-top: 10px; margin-bottom: 5x; }\n" +
	"#TableCalendar table{ margin-bottom: 0; margin-left: 3px; border-style: solid; border-width: 1pt; }\n" +
	".Bezet { color: #70BC1F; background-color: #f2f2f2; }\n" +
	".Aankomst { color: blue; background-color: #f2f2f2; }\n" +
	".Eigen-gebruik { color: orange; background-color: #f2f2f2; }\n" +
	".Voorkeur { color: red; background-color: #f2f2f2; }\n" +
	".Vrij { color: grey; }\n" +
    "#TableCalendar .Vandaag { border-width: 3px; }\n" +
	"#TableCalendar tr { vertical-align: top; height: 70px; }\n" +
	"#TableCalendar tr:first-child { vertical-align: middle; height: 35px; }\n" +
	"#TableCalendar th { color: white; background-color: #70BC1F; vertical-align: middle; }\n" +
	"#TableCalendar td { width: 100px; padding: 5px; border-style: solid; border-color: grey; border-width: 1px; }\n" +
	"#TableCalendar ul { list-style-type: none; margin-top: 0; margin-left: 0; margin-right: 0; padding-top: 0; padding-left: 0; padding-right: 0; }\n" +
	"#TableCalendar li:first-child { text-align: right; }\n" +
	"#Legenda {margin-bottom: 10px; padding-left: 0; text-align: center; color: black;}\n" +
	"#Legenda li { display: inline; margin-left: 0; margin-right: 14px; font-size: 11pt; }\n";

// #70BC1F = Groen Landal

head = document.getElementsByTagName('head')[0];
if (!head) { return; }
style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = css;
head.appendChild(style);

var text = document.createElement("Div");
text.innerHTML = strHTML;
var child = document.getElementsByClassName('sort-table')[0];
child.parentNode.insertBefore(text, child);

function FormatDatum(pDate, pOutput)
{
	if (pOutput == "E") {
		return ("0" + pDate.getDate()).slice(-2) + "-" + ("0" + (pDate.getMonth()+1)).slice(-2) + "-" + pDate.getFullYear();
	} else if (pOutput == "S") {
		return (pDate.getFullYear() * 10000) + ((pDate.getMonth()+1) * 100) + pDate.getDate();
	} else {
		var dow = ["zo", "ma", "di", "wo", "do", "vr", "za"];
		var mndnm = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
		if (pDate.getDay() == 5) {
			return dow[pDate.getDay()] + " " + pDate.getDate() + " " + mndnm[pDate.getMonth()];
		} else {
			return dow[pDate.getDay()] + " " + pDate.getDate();
		}
	}
}

function KalRij(pDate)
{
	for ( var rij=1; rij < table.rows.length; rij++ ) {
		var d1 = new Date(table.rows[rij].cells[1].innerHTML.substr(6) + "-" + table.rows[rij].cells[1].innerHTML.substr(3, 2) + "-" + table.rows[rij].cells[1].innerHTML.substr(0, 2)).setHours(0, 0, 0, 0);
		var d2 = new Date(table.rows[rij].cells[2].innerHTML.substr(6) + "-" + table.rows[rij].cells[2].innerHTML.substr(3, 2) + "-" + table.rows[rij].cells[2].innerHTML.substr(0, 2)).setHours(0, 0, 0, 0);

		if (pDate >= d1 && pDate < d2) {
			return rij;
		}
	}
	return -1;
}

function DispPerc(Teller, Noemer) {
	var rv;

	if (Noemer !== 0) {
		rv = (Teller / Noemer) * 100;
		rv = Math.round(rv * 100) / 100;
		rv = rv.toString() + " %";
	} else {
		rv = "NA";
	}
	return rv;
}
