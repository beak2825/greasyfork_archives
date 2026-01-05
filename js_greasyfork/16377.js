// ==UserScript==
// @author              code:Tamozhnya1; style: sw.East; modifications: Alena17
// @collaborator        style: sw.East
// @collaborator        modifications: Alena17
// @name                Salary Style Mod
// @name:ru             Подсчет зарплаты HWM
// @description         Показывает зарплату на предприятии с учетом и отображением коэффициента ГР
// @icon                http://i.imgur.com/GScgZzY.jpg
// @version             1.1.4
// @encoding 	        utf-8
// @include             *//*heroeswm.*/home.php
// @include             *//*heroeswm.*/object-info.php*
// @include             *//178.248.235.15/home.php
// @include             *//178.248.235.15/object-info.php*
// @include             *//*lordswm.*/home.php
// @include             *//*lordswm.*/object-info.php*
// @grant               GM_addStyle
// @grant               GM_xmlhttpRequest
// @grant               GM_info
// @grant               GM_getMetadata
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_registerMenuCommand
// @homeURL             https://openuserjs.org/scripts/chesheerk/Salary_Style_Mod
// @copyright           2014-15, code:Tamozhnya1;  style: sw.East; modifications: Alena17
// @license             MIT
// @namespace https://greasyfork.org/users/3065
// @downloadURL https://update.greasyfork.org/scripts/16377/Salary%20Style%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/16377/Salary%20Style%20Mod.meta.js
// ==/UserScript==

main();
function main() {
	setK();
	if(/object-info.php/.test(location.href)) {
		var strSalary = ustring("Зарплата: ");
		var tds = document.getElementsByTagName("td");
		for (var i = 0; i < tds.length; i++) {
			var td = tds[i];
			if(td.innerHTML == strSalary) {
			  var tdSalary = td;
			  break;
			}
		}
		var b = tdSalary.nextSibling.firstChild.firstChild.firstChild.firstChild.lastChild.firstChild;
		var salary = "";
        salary = parseInt(b.innerHTML);
		var k = parseFloat(GM_getValue(getNick(), "1.0"));
/* Style */
        var cssStyle = "";
		cssStyle += "body > center:nth-child(2) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(11) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3){display: none;}.salary{display:inline-block;text-align:center;padding:3px 6px;margin:0;font-size:11px;font-weight:bold;line-height:14px;color:#fff;vertical-align:baseline;white-space:nowrap;background-color:#666;border:1px solid #fff;text-decoration:none;box-shadow:1px 1px 2px rgba(0,0,0,.1);}.salary:hover,.salary:focus{color:#fff;opacity:.85;text-decoration:none;cursor:help;}.salary-light_blue{background-color:#719DAB;}.salary-blue{background-color:#7189AB;}.tt-wrapper{padding:0;width:435px;height:20px;margin:0 auto 0 auto;}ul.tt-wrapper{list-style:none !important;}.tt-wrapper li{float:left;}.tt-wrapper li a{display:block;width:24px;height:14.5px;margin:0;outline:none;position:relative;z-index:2;}.tt-wrapper li a span{width:115px;height:auto;padding:5px;left:50%;margin-left:-32px;font-family:Georgia, serif;font-weight:400;font-style:italic;font-size:14px;color:#fff;text-shadow:1px 1px 1px rgba(0, 0, 0, .1);text-align:center;border:4px solid #fff;background:rgba(113,156,171,.85);text-indent:0;position:absolute;pointer-events:none;bottom:30px;opacity:0;box-shadow:0 3px 8px rgba(0,0,0,.2);-webkit-transition:all .3s ease-in-out;-moz-transition:all .3s ease-in-out;-o-transition:all .3s ease-in-out;-ms-transition:all .3s ease-in-out;transition:all .3s ease-in-out;-webkit-transform:rotate(0deg) scale(.2);-moz-transform:rotate(0deg) scale(.2);-o-transform:rotate(0deg) scale(.2);-ms-transform:rotate(0deg) scale(.2);transform:rotate(0deg) scale(.2);}.tt-wrapper li a:hover span{opacity:.9;bottom:55px;-webkit-transform:rotate(-45deg) scale(1);-moz-transform:rotate(-45deg) scale(1);-o-transform:rotate(-45deg) scale(1);-ms-transform:rotate(-45deg) scale(1);transform:rotate(-45deg) scale(1);}.tt-wrapper li a:hover span.tt-blue{background-color:#7189AB;}";
        GM_addStyle(cssStyle);
/* Style End */
		  b.innerHTML = "<ul class=\"tt-wrapper\">"+
                            "<li><a class=\"salary salary-light_blue\" href=\"#\">" + b.innerHTML + "<span>Зарплата</span></a></li>"+
                            "<li><a class=\"salary\" href=\"#\"> х </a></li>"+
                            "<li><a class=\"salary salary-light_blue\" href=\"#\">" + k + "<span>Коэф. ГР</span></a></li>"+
                            "<li><a class=\"salary\" href=\"#\"> = </a></li>"+
                            "<li><a class=\"salary salary-blue\" style=\"width: auto;\" href=\"#\">" + Math.round(salary * k) + "<span class=\"tt-blue\">Итоговая сумма</span></a></li>"+
                        "</ul>";
	}
}
function setK(){
	if(/home.php$/.test(location.href)) {
		var guildWorkersString = ustring("Гильдия Рабочих:");
		var indexOfGuildWorkers = document.body.innerHTML.indexOf(guildWorkersString);
		var guildWorkersValue = parseInt(trim(document.body.innerHTML.substr(indexOfGuildWorkers + 17, 2)));
        var k = parseFloat(GM_getValue(getNick(), "1.0"));
		k = ["1.0", "1.1", "1.2", "1.4", "1.6", "1.8", "2.0", "2.2", "2.4", "2.6", "2.8", "3.0", "3.2"];
		GM_setValue(getNick(), k[guildWorkersValue]);
	}
}
function getNick() {
	var els = document.getElementsByTagName('embed');
	var nick = "";
	for( var i = 0; i < els.length; i++ ) {
		var el = els[i];
		if( el.src.match(/heart.swf/) ) {
			var vs = el.getAttribute("FlashVars").split('|') ;
			if (vs[3]) {
				nick = vs[3];
				break;
			}
		}
	}
	return nick;
}
function uchar(s) {
	switch (s[0]) {case "А": return "\u0410"; case "Б": return "\u0411"; case "В": return "\u0412"; case "Г": return "\u0413"; case "Д": return "\u0414"; case "Е": return "\u0415"; case "Ж": return "\u0416"; case "З": return "\u0417"; case "И": return "\u0418"; case "Й": return "\u0419"; case "К": return "\u041a"; case "Л": return "\u041b"; case "М": return "\u041c"; case "Н": return "\u041d"; case "О": return "\u041e"; case "П": return "\u041f"; case "Р": return "\u0420"; case "С": return "\u0421"; case "Т": return "\u0422"; case "У": return "\u0423"; case "Ф": return "\u0424"; case "Х": return "\u0425"; case "Ц": return "\u0426"; case "Ч": return "\u0427"; case "Ш": return "\u0428"; case "Щ": return "\u0429"; case "Ъ": return "\u042a"; case "Ы": return "\u042b"; case "Ь": return "\u042c"; case "Э": return "\u042d"; case "Ю": return "\u042e"; case "Я": return "\u042f"; case "а": return "\u0430"; case "б": return "\u0431"; case "в": return "\u0432"; case "г": return "\u0433"; case "д": return "\u0434"; case "е": return "\u0435"; case "ж": return "\u0436"; case "з": return "\u0437"; case "и": return "\u0438"; case "й": return "\u0439"; case "к": return "\u043a"; case "л": return "\u043b"; case "м": return "\u043c"; case "н": return "\u043d"; case "о": return "\u043e"; case "п": return "\u043f"; case "р": return "\u0440"; case "с": return "\u0441"; case "т": return "\u0442"; case "у": return "\u0443"; case "ф": return "\u0444"; case "х": return "\u0445"; case "ц": return "\u0446"; case "ч": return "\u0447"; case "ш": return "\u0448"; case "щ": return "\u0449"; case "ъ": return "\u044a"; case "ы": return "\u044b"; case "ь": return "\u044c"; case "э": return "\u044d"; case "ю": return "\u044e"; case "я": return "\u044f"; case "Ё": return "\u0401"; case "ё": return "\u0451"; default: return s[0];}}
function ustring(s) {
    s = String(s);
    var result = "";
    for (var i = 0; i < s.length; i++)
        result += uchar(s[i]);
    return result;
}
function trim(string) {
	return string.replace(/(^\s+)|(\s+$)/g, "");
}
