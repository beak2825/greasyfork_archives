// ==UserScript==
// @name        Loteria paragonowa - asystent
// @namespace   pl.loteria.paragonowa.asystent
// @include     https://loteriaparagonowa.gov.pl/
// @version     1
// @license			GPLv3
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @description Userscript to assist on https://loteriaparagonowa.gov.pl/. Lottery for Polish citizens.
// @description:pl Asystent do loterii paragonowej https://loteriaparagonowa.gov.pl/. Pomaga przy dodawaniu nowych paragonów.
// @downloadURL https://update.greasyfork.org/scripts/13134/Loteria%20paragonowa%20-%20asystent.user.js
// @updateURL https://update.greasyfork.org/scripts/13134/Loteria%20paragonowa%20-%20asystent.meta.js
// ==/UserScript==

// UWAGA: Instalując zgadzasz się na automatyczne zaznaczanie pól 
// _Sprawdziłem poprawność uzupełnionych danych_ oraz 
// _Akceptuję regulamin i wyrażam zgodę na przetwarzanie moich danych_ w formularzu
// dodawania paragonu.

/*  This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
		
		Niniejszy program jest wolnym oprogramowaniem – możesz go rozpowszechniać dalej
		i/lub modyfikować na warunkach Powszechnej Licencji Publicznej GNU wydanej przez
		Fundację Wolnego Oprogramowania, według wersji 3 tej Licencji lub dowolnej z
		późniejszych wersji.

		Niniejszy program rozpowszechniany jest z nadzieją, iż będzie on użyteczny –
		jednak BEZ ŻADNEJ GWARANCJI, nawet domyślnej gwarancji PRZYDATNOŚCI HANDLOWEJ
		albo PRZYDATNOŚCI DO OKREŚLONYCH ZASTOSOWAŃ. Bliższe informacje na ten temat
		można uzyskać z Powszechnej Licencji Publicznej GNU.

		Kopia Powszechnej Licencji Publicznej GNU powinna zostać ci dostarczona razem z
		tym programem. Jeżeli nie została dostarczona, odwiedź <http://www.gnu.org/licenses/>.
		*/

GM_registerMenuCommand("NIP - format 3-3-2-2", nip3322);
GM_registerMenuCommand("NIP - format 3-2-2-3", nip3223);
GM_registerMenuCommand("NIP - formatowanie wyłączone", nip0);

function nip3322(){
	GM_setValue("nipFormat", "3322");
}

function nip3223(){
	GM_setValue("nipFormat", "3223");
}

function nip0(){
	GM_setValue("nipFormat", "0");
}

function getnipFormat(){
	return GM_getValue("nipFormat");
}
var nipFormat = getnipFormat();

if (nipFormat === null) nipFormat = "3322";
if (nipFormat === "3322"){
	document.getElementById('nip_3').insertAdjacentHTML("afterend", "-");
	document.getElementById('nip_6').insertAdjacentHTML("afterend", "-");
	document.getElementById('nip_8').insertAdjacentHTML("afterend", "-");
}
else if (nipFormat === "3223"){
	document.getElementById('nip_3').insertAdjacentHTML("afterend", "-");
	document.getElementById('nip_5').insertAdjacentHTML("afterend", "-");
	document.getElementById('nip_7').insertAdjacentHTML("afterend", "-");
}
else if (nipFormat === "0") ;

var script = document.createElement("script");
script.innerHTML = "function turnOnCheckbox(id){ \n" +
	"if (document.getElementById(id).checked === true); \n" +
	"else if (document.getElementById(id).checked === false)  document.getElementById(id).click(); \n" +
"}";
document.head.appendChild(script);


document.getElementById('nip_10').setAttribute("onkeyup", "document.getElementById(\"dzien\").focus();");
document.getElementById('dzien').setAttribute("onkeyup", "if (this.value.length > 1) document.getElementById(\"nr_wydruku\").focus();");
document.getElementById('kwota_gr').setAttribute("onkeyup", "if (this.value.length > 1) turnOnCheckbox(\'sprawdzone\');");

document.getElementById("zgoda_dane").setAttribute("checked", true);

document.getElementById("rok").value = new Date().getFullYear();
document.getElementById("miesiac").value = ("0" + (new Date().getMonth() + 1)).slice(-2);

var captcha = document.getElementById('captcha-operation').innerHTML;
document.getElementById('captcha-input').value = eval(captcha);
