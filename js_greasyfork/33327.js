// ==UserScript==
// @name         VirtualPOS наценка
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Подсчет процента наценки в VirtualPOS. Розничная цена, Цена закупки и Наценка должны быть доступны.
// @author       Roman Potapov
// @match        *.virtpos.ru/console/inflow/view/id/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33327/VirtualPOS%20%D0%BD%D0%B0%D1%86%D0%B5%D0%BD%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/33327/VirtualPOS%20%D0%BD%D0%B0%D1%86%D0%B5%D0%BD%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function() {var arr = [['Розничная цена', '0'], ['Цена закупки', '0'], ['Наценка', '0']];
var div = document.getElementsByClassName('items table table-bordered');
var div1 = div.item(0).getElementsByTagName('thead').item(0).getElementsByTagName('th');
var div2 = div.item(0).getElementsByTagName('tbody').item(0).getElementsByTagName('tr');
for(var i=0; i<div1.length; i++)
{
	switch(div1[i].innerHTML)
	{
	case arr[0][0]: var _p = i;break;
	case arr[1][0]: var _b = i;break;
	case arr[2][0]: var _t = i;break;
	default: break;
	}
}
for(var i=0; i<div2.length; i++) {
    var tmp1 = Number(div2.item(i).getElementsByTagName('td').item(_p).textContent);
    var tmp2 =  Number(div2.item(i).getElementsByTagName('td').item(_b).textContent);
    div2.item(i).getElementsByTagName('td').item(_t).innerHTML = Math.round(tmp1/(tmp2)*100-100) + '%';}
})();