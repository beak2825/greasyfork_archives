// ==UserScript==
// @name        Translate and Define
// @namespace   407d4100-4661-11e4-916c-0800200c9a66
// @description Allows you to translate and define highlighted text
// @version     1.0.0
// @include     *
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5432/Translate%20and%20Define.user.js
// @updateURL https://update.greasyfork.org/scripts/5432/Translate%20and%20Define.meta.js
// ==/UserScript==

tad_ctxmenu = document.createElement("menu");
tad_ctxmenu.innerHTML = '\
	<menuitem id="tad_define" label="Define selection" onclick="window.open(\'http://dictionary.reference.com/browse/\'+window.getSelection(), \'_blank\')" icon="https://cdn4.iconfinder.com/data/icons/gnome-desktop-icons-png/PNG/64/Accessories-Dictionary-64.png"></menuitem>\
	<menu id="tad_translate" label="Translate selection" icon="https://cdn1.iconfinder.com/data/icons/google_jfk_icons_by_carlosjj/128/translate.png">\
		<menuitem label="Translate to Arabic" onclick="window.open(\'http://www.translate.google.com/#auto/ar/\'+window.getSelection(), \'_blank\')"></menuitem>\
		<menuitem label="Translate to Bengali" onclick="window.open(\'http://www.translate.google.com/#auto/bn/\'+window.getSelection(), \'_blank\')"></menuitem>\
		<menuitem label="Translate to Chinese (Simplified)" onclick="window.open(\'http://www.translate.google.com/#auto/zh-CN/\'+window.getSelection(), \'_blank\')"></menuitem>\
		<menuitem label="Translate to French" onclick="window.open(\'http://www.translate.google.com/#auto/fr/\'+window.getSelection(), \'_blank\')"></menuitem>\
		<menuitem label="Translate to Hindi" onclick="window.open(\'http://www.translate.google.com/#auto/hi/\'+window.getSelection(), \'_blank\')"></menuitem>\
		<menuitem label="Translate to Indonesian" onclick="window.open(\'http://www.translate.google.com/#auto/id/\'+window.getSelection(), \'_blank\')"></menuitem>\
		<menuitem label="Translate to Russian" onclick="window.open(\'http://www.translate.google.com/#auto/ru/\'+window.getSelection(), \'_blank\')"></menuitem>\
		<menuitem label="Translate to Portuguese" onclick="window.open(\'http://www.translate.google.com/#auto/pt/\'+window.getSelection(), \'_blank\')"></menuitem>\
		<menuitem label="Translate to Spanish" onclick="window.open(\'http://www.translate.google.com/#auto/es/\'+window.getSelection(), \'_blank\')"></menuitem>\
		<menu label="More...">\
			<menuitem label="Bulgarian" onclick="window.open(\'http://www.translate.google.com/#auto/bg/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Catalan" onclick="window.open(\'http://www.translate.google.com/#auto/ca/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Chinese (Traditional)" onclick="window.open(\'http://www.translate.google.com/#auto/zh_TW/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Czech" onclick="window.open(\'http://www.translate.google.com/#auto/cs/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Danish" onclick="window.open(\'http://www.translate.google.com/#auto/da/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Dutch" onclick="window.open(\'http://www.translate.google.com/#auto/nl/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Estonian" onclick="window.open(\'http://www.translate.google.com/#auto/et/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Finnish" onclick="window.open(\'http://www.translate.google.com/#auto/fi/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="German" onclick="window.open(\'http://www.translate.google.com/#auto/de/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Greek" onclick="window.open(\'http://www.translate.google.com/#auto/el/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Haitian Creole" onclick="window.open(\'http://www.translate.google.com/#auto/ht/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Hebrew" onclick="window.open(\'http://www.translate.google.com/#auto/iw/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Hmong" onclick="window.open(\'http://www.translate.google.com/#auto/hmn/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Hungarian" onclick="window.open(\'http://www.translate.google.com/#auto/hu/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Italian" onclick="window.open(\'http://www.translate.google.com/#auto/it/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Japanese" onclick="window.open(\'http://www.translate.google.com/#auto/ja/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Korean" onclick="window.open(\'http://www.translate.google.com/#auto/ko/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Latvian" onclick="window.open(\'http://www.translate.google.com/#auto/lv/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Lithuanian" onclick="window.open(\'http://www.translate.google.com/#auto/lt/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Malay" onclick="window.open(\'http://www.translate.google.com/#auto/ms/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Maltese" onclick="window.open(\'http://www.translate.google.com/#auto/mt/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Norwegian" onclick="window.open(\'http://www.translate.google.com/#auto/no/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Persian" onclick="window.open(\'http://www.translate.google.com/#auto/fa/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Polish" onclick="window.open(\'http://www.translate.google.com/#auto/pl/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Romanian" onclick="window.open(\'http://www.translate.google.com/#auto/ro/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Slovak" onclick="window.open(\'http://www.translate.google.com/#auto/sk/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Slovenian" onclick="window.open(\'http://www.translate.google.com/#auto/sl/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Swedish" onclick="window.open(\'http://www.translate.google.com/#auto/sv/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Thai" onclick="window.open(\'http://www.translate.google.com/#auto/th/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Turkish" onclick="window.open(\'http://www.translate.google.com/#auto/tr/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Ukranian" onclick="window.open(\'http://www.translate.google.com/#auto/uk/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Urdu" onclick="window.open(\'http://www.translate.google.com/#auto/ur/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Vietnamese" onclick="window.open(\'http://www.translate.google.com/#auto/vi/\'+window.getSelection(), \'_blank\')"></menuitem>\
			<menuitem label="Welsh" onclick="window.open(\'http://www.translate.google.com/#auto/cy/\'+window.getSelection(), \'_blank\')"></menuitem>\
		</menu>\
	</menu>\
	<menuitem label="Translate to English" onclick="window.open(\'http://www.translate.google.com/#auto/en/\'+window.getSelection(), \'_blank\')" icon="https://cdn1.iconfinder.com/data/icons/google_jfk_icons_by_carlosjj/128/translate.png"></menuitem>\
	<menuitem id="tad_wikipedia" label="Find on Wikipedia" onclick="window.open(\'http://en.wikipedia.org/w/index.php?go=Go&search=\'+window.getSelection(), \'_blank\')" icon="http://upload.wikimedia.org/wikipedia/meta/0/08/Wikipedia-logo-v2_1x.png"></menuitem>\
';
tad_ctxmenu.id = "tad_ctxmenu";
tad_ctxmenu.type = "context";

document.body.appendChild(tad_ctxmenu);
setInterval(function() {
	selection = window.getSelection().toString();
	if(selection != "") {
		if(selection.length <= 15) {
			document.getElementById("tad_define").label = "Define \"" + selection + "\"";
			document.getElementById("tad_translate").label = "Translate \"" + selection + "\"";
			document.getElementById("tad_wikipedia").label = "Find \"" + selection + "\" on Wikipedia";
		}
		else {
			document.getElementById("tad_define").label = "Define \"" + selection.slice(0, 15) + "…\"";
			document.getElementById("tad_translate").label = "Translate \"" + selection.slice(0, 15) + "…\"";
			document.getElementById("tad_wikipedia").label = "Find \"" + selection.slice(0, 15) + "…\" on Wikipedia";
		}
		document.body.setAttribute("contextmenu", "tad_ctxmenu");
	}
	else document.body.removeAttribute("contextmenu");
}, 100);