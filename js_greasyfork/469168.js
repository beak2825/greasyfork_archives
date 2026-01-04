// ==UserScript==
// @name         LNK_repaire_time
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  HWM ГВД время возврата арта из ремонта
// @author       LNK
// @match        https://www.heroeswm.ru/arts_arenda.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469168/LNK_repaire_time.user.js
// @updateURL https://update.greasyfork.org/scripts/469168/LNK_repaire_time.meta.js
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

    
    
    var tabl = document.querySelectorAll('TABLE.wblight')[0];
    var artCode, repCost, n, retTime;
    var lines = tabl.getElementsByTagName('tr');
    for (var l = 0; l < lines.length; l++) {
        if ((lines[l].innerHTML.indexOf('Ремонт: да') < 0) || (lines[l].innerHTML.indexOf('До <font color="red"><b>') < 0)) {
            continue;
        }
        artCode = lines[l].firstChild.firstChild.getElementsByTagName('a')[0].href.split('=');
        repCost = getPage('art_info.php?id='+artCode[1]);
        n = repCost.indexOf('Стоимость ремонта:');
        if (n > 0) {
            repCost = repCost.slice(n);
            n = repCost.indexOf('"Золото" alt=""  class="rs" ></td><td>');
            repCost = repCost.slice(n+38);
            repCost = repCost.slice(0,repCost.indexOf('<')).replace(',','').replace('.','');
            repCost = repCost / 4000 * 60;
            n = lines[l].innerHTML.indexOf('До <font color="red"><b>');
            retTime = lines[l].innerHTML.slice(n+24);
            retTime = retTime.slice(0,retTime.indexOf('<'));
            retTime = retTime.replace(/(\d+)-(\d+)-(\d+)/, '20$3-$2-$1T').replace(' ','');
            var d = new Date(retTime);
            d.setMinutes(d.getMinutes() + repCost);
            //alert(retTime);
            lines[l].innerHTML = lines[l].innerHTML.replace('Ремонт: да','Ремонт до ' + d.toLocaleString().slice(0,-3));
        }
        
    }
    return 1;
    //border=0 title="Золото" alt=""  class="rs" ></td><td>7,239</td>
    // 1час - 4000 золотых стоимость ремонта разделить на 4000 и умножить на 60 (получится в минутах)
    
})();