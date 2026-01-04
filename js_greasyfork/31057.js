// ==UserScript==
// @name           ARUBA Cloud VAT Calc
// @namespace      http://svn.tothimre.changeip.net
// @description    Allow VAT increase/decrease in ARUBA Cloud's top-up credit page 
// @description-hu Az ARUBA Cloud kredit feltöltés oldalán lehetőséget ad az összeget áfával növelni/csökkenteni
// @author         Tóth Imre
// @copyright      (C) 2017  Tóth Imre
// @include        https://megrendeles.arubacloud.hu/Steps/Amount.aspx*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @version        1.0
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/31057/ARUBA%20Cloud%20VAT%20Calc.user.js
// @updateURL https://update.greasyfork.org/scripts/31057/ARUBA%20Cloud%20VAT%20Calc.meta.js
// ==/UserScript==

/** ARUBA Cloud VAT Calc
 *  Copyright (C) 2017  Tóth Imre (ti00652 at gmail)
 *
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 *  Ez a program szabad szoftver; terjeszthető illetve módosítható a 
 *  Free Software Foundation által kiadott GNU General Public License
 *  dokumentumában leírtak; akár a licenc 3-as, akár (tetszőleges) későbbi 
 *  változata szerint.
 *
 *  Ez a program abban a reményben kerül közreadásra, hogy hasznos lesz, 
 *  de minden egyéb GARANCIA NÉLKÜL, az ELADHATÓSÁGRA vagy VALAMELY CÉLRA 
 *  VALÓ ALKALMAZHATÓSÁGRA való származtatott garanciát is beleértve. 
 *  További részleteket a GNU General Public License tartalmaz.
 *
 *  A felhasználónak a programmal együtt meg kell kapnia a GNU General 
 *  Public License egy példányát; ha mégsem kapta meg, akkor
 *  tekintse meg a <http://www.gnu.org/licenses/> oldalon (nem hivatalos magyar
 *  fordítás: <http://gnu.hu/gplv3.html/>).
 */


// beállítások
var vat = 27;	// % 


function vat_increase() {
	this.blur();
	calc_vat();
	return false;
}

function vat_decrease() {
	this.blur();
	calc_vat(true);
	return false;
}

function calc_vat(decrease) {
	var old_amount = input.val();	// a 'parseFloat()' itt nem kell: az oldal elintézi, hogy csak szám lehet
	var new_amount;
	if (decrease)
		new_amount = old_amount / cons;
	else
		new_amount = old_amount * cons;
	input.val(Math.round(new_amount));
	input.attr("title", new_amount);
}


var cons = vat / 100 + 1;
var input = $("#ctl00_ContentPlaceHolder1_ctl00_txtAmount");
GM_addStyle("a.acvc { background: none; display: inline; }");
var lang = $("#ContentPlaceHolder1_ctl00_imgStep").attr("src").match(/step-amount-(\w+)\.png$/i)[1];
var text;
switch (lang) {
	case "hu":
		text = "ÁFA";
		break;
	case "en":
	default:
		text = "VAT";
}
$("#ContentPlaceHolder1_ctl00_lblAmountRequiredField").after(' <a id="acvc_decrease"></a> <a id="acvc_increase"></a>');
$("#acvc_decrease").addClass("acvc").text("-" + text).attr("href", "#").click(vat_decrease);
$("#acvc_increase").addClass("acvc").text("+" + text).attr("href", "#").click(vat_increase);
