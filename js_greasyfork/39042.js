// ==UserScript== 
// @name HWM_Resources_Cost 
// @description Отображает на странице персонажа общую стоимость ресурсов (дерево, руда, ртуть и т.п.) по цене 170/350 и общую стоимость элементов немного ниже рыночной 
// @namespace Zeleax 
// @author Zeleax 
// @include http://www.heroeswm.ru/pl_info.php* 
// @include http://178.248.235.15/pl_info.php* 
// @include http://www.lordswm.com/pl_info.php* 
// @grant none 
// @version 1.4 
// @downloadURL https://update.greasyfork.org/scripts/39042/HWM_Resources_Cost.user.js
// @updateURL https://update.greasyfork.org/scripts/39042/HWM_Resources_Cost.meta.js
// ==/UserScript==   

// Цены 
var resPrices = {"gold": 1, "wood": 180, "ore": 180, "mercury": 360, "sulfur": 360, "crystal": 360, "gem": 360} // ресурсы 
var elPrices = {"абразив":800, "змеиный яд":230, "клык тигра":720, "ледяной кристалл":1700, "лунный камень":2700, "огненный кристалл":1900, "осколок метеорита":2600, " цветок ведьм":230, "цветок ветров":1900, "цветок папоротника":180, "ядовитый гриб":200, "Мифриловая руда":460}; // элементы

// Ресурсы 
var resRow = getElementByXpath("/html/body/center/table/tbody/tr/td/table[1]/tbody/tr[1]/td[2]/table/tbody/tr"); 
var resArr = resRow.getElementsByTagName('img'); 
var resSum = 0; 

for(var i=0, el; el=resArr[i]; i++) 
if((imgname = el.getAttribute('src')) && (res = /([a-z]{1,}).gif/.exec(imgname)) && (res[1]) && (rPrice = resPrices[res[1]]) ) 
resSum += parseInt(el.parentNode.nextSibling.firstChild.innerHTML.replace(',',''), 10) * rPrice; 

createCell(resRow.insertCell(-1), " = "+resSum, 'resRow'); 


// Элементы 
var tbl = getElementByXpath("/html/body/center/table[2]"); 
var t = document.getElementsByTagName("td"); 
var res = null; 
for(i=0;el=t[i];i++) if(el.innerHTML == '<b>Ресурсы</b>') {res=el; break;}; 
if(res) elCell = res.parentNode.nextSibling.firstChild; 

var elSum = 0; 
var myRe = /<b>(\D+)<\D+: (\d+)/g; 
while (res = myRe.exec(elCell.innerHTML)) 
if(ePrice= elPrices[res[1]]) elSum += parseInt(res[2])*ePrice; 

if(elSum>0) elCell.innerHTML += '<br>&nbsp;&nbsp;&nbsp;&nbsp;стоимость элементов: '+elSum; 
var kap = elSum + resSum; 
elCell.innerHTML += '<br>&nbsp;&nbsp;&nbsp;&nbsp;общий капитал: '+kap; 


// create DIV element and append to the table cell 
function createCell(cell, text, style) { 
var div = document.createElement('div'), // create DIV element 
txt = document.createTextNode(text); // create text node 
div.appendChild(txt); // append text node to the DIV 
div.setAttribute('class', style); // set DIV class attribute 
div.setAttribute('className', style); // set DIV class attribute for IE (?!) 
cell.appendChild(div); // append DIV to the table cell 
} 

function getElementByXpath (path) {return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}