// ==UserScript==
// @name        AltınMatik
// @author      ScriptAdam
// @namespace   ScriptAdam
// @version     1
// @description altın
// @include     https://tr68.klanlar.org/game.php?*screen=snob*
// @icon        https://img.icons8.com/cotton/64/000000/coins--v1.png
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/439992/Alt%C4%B1nMatik.user.js
// @updateURL https://update.greasyfork.org/scripts/439992/Alt%C4%B1nMatik.meta.js
// ==/UserScript==
// koordinatı değiştir
if (document.getElementById("menu_row2").innerHTML.includes("573|500")){

if ($('#coin_mint_fill_max').length > 0) {
	$('#coin_mint_fill_max').click();

	setTimeout(() => {
		$('input.btn.btn-default').click();
	}, 500);
}

setTimeout(() => {
	location.reload();
}, 1000 * 60 * 3);
}