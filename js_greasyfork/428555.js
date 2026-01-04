// ==UserScript==
// @name         LNK_kukla
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  ГВД HWM - Кукла (надетые арты) на любой странице, кроме боя. Открывается кликом по букве К в левом верхнем углу 
// @author       LNK
// @include      *heroeswm.ru*
// @exclude      *heroeswm.ru/war.php*
// @exclude      *daily*

// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/428555/LNK_kukla.user.js
// @updateURL https://update.greasyfork.org/scripts/428555/LNK_kukla.meta.js
// ==/UserScript==

(function() {
    'use strict';

function getPage(aURL) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', aURL, false);
	xhr.overrideMimeType('text/html; charset=windows-1251');
	xhr.send();
	if (xhr.status != 200) {
		return ( 'Ошибка ' + xhr.status + ': ' + xhr.statusText );
	} else {
		return ( xhr.responseText );
	}
} // getPage

    function switchKukla() {
        var kuklaId = document.getElementById('kuklaDiv');
        if (kuklaId) { kuklaId.remove(); return; }
        var pText = getPage('inventory.php');
//        var divText = pText.slice(pText.indexOf('<div class="inv_doll_and_stats_outside">'), pText.indexOf('<div class="inv_separator3">'));
        var divText = pText.slice(pText.indexOf('<div id="inv_doll_stats"'), pText.indexOf('<div class="inventory_stats'));
        var kuklaDiv = document.createElement('div');
        kuklaDiv.id = 'kuklaDiv';
        kuklaDiv.innerHTML = divText;
        kuklaDiv.style = 'background-color: #A6DFF0; position: fixed; top: 20px; left: 20px; z-index: 9954; width: 250px; height: 250px; display:flex; flex-direction: column;';
        document.body.appendChild(kuklaDiv);
        //alert('Не найдена кукла на странице инвентаря');
        //alert(divText.slice(divText.length-50));
    }

    var kuklaMark = document.createElement('div');
    kuklaMark.id = 'kuklaMark';
	kuklaMark.innerHTML = 'K';
	kuklaMark.style = 'background-color: #A6DFF0; position: fixed; top: 2px; left: 2px; z-index: 9955; text-align: center; cursor: pointer; width: 20px; height: 20px; ';
	document.body.appendChild(kuklaMark);
    document.getElementById('kuklaMark').onclick = switchKukla;

	
})();