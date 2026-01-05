// ==UserScript==
// @name           Pokec.sk - skrytie zbytocnych elementov
// @namespace      http://
// @description    Skrytie par zbytocnych elementov Stretko, Plus, Radio, Archiv, Reklama ...
// @include        http://pokec-sklo.azet.sk/miestnost/*
// @include        http://www-pokec.azet.sk/miestnost/*
// @icon           http://s.aimg.sk/pokec_base/css/favicon.ico
// @grant          GM_addStyle
// @author         MaxSVK
// @version        1.1
// @date           2014-July-27
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/3679/Pokecsk%20-%20skrytie%20zbytocnych%20elementov.user.js
// @updateURL https://update.greasyfork.org/scripts/3679/Pokecsk%20-%20skrytie%20zbytocnych%20elementov.meta.js
// ==/UserScript==

/* ********** Add new CSS *************************************************** */

GM_addStyle(
	// stretko
	".chcemSaStretnut, #stretkoSubMenu {display: none !important;}" +
	// reklamna lista
	"#auto_reklama {display:none !important;}" +
	// funkcie plus
	"#plusSubMenu, #nahodneSmajliky, .extraPlus.nema_plus, .ako_aktivovat {display:none !important;}" +
	// radio
	"#pokecRadio {display:none !important;}" +
	// ponuka prepnut na stare sklo a archiv
	".dalsie_info.info {display: none !important;}" +
	// reklama na spodku
	"#reklama {display:none !important;}"
);