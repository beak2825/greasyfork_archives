// ==UserScript==
// @name         [HWM] countMonstersArts
// @version      0.10.0
// @description  Подсчёт количества наноартов
// @author       Komdosh
// @match        http*://*.heroeswm.ru/arts_for_monsters.php*
// @grant        none
// @namespace https://greasyfork.org/users/13829
// @downloadURL https://update.greasyfork.org/scripts/12701/%5BHWM%5D%20countMonstersArts.user.js
// @updateURL https://update.greasyfork.org/scripts/12701/%5BHWM%5D%20countMonstersArts.meta.js
// ==/UserScript==

var headers = Array.from(document.querySelectorAll("td>b, td>a")).slice(0,9);
var count = 0;

for (var header of headers){
   count+=parseInt(header.innerHTML.split('(')[1].split(')')[0]);
}

var center = document.querySelector("center > b");
center.innerHTML+="<br>Количество артефактов существ: "+count;


var lsName = 'KomdoshScript_ArtsForMonsterCount';
if(!localStorage.getItem(lsName)){
    localStorage.setItem(lsName, count);
}

if(localStorage.getItem(lsName) && localStorage.getItem(lsName)<count){
    var all = localStorage.getItem('HWMCMA');
    center.innerHTML+=" <font color='green' weight='bold'>+"+(count-all)+"</font>";
    localStorage.setItem('HWMCMA', count);
}