// ==UserScript==
// @name HWM_Resources_Cost
// @description   Отображает на странице персонажа общую стоимость ресурсов (дерево, руда, ртуть и т.п.) по цене 170/350 и общую стоимость элементов немного ниже рыночной
// @namespace  Zeleax
// @author  Zeleax
// @include http://www.heroeswm.ru/pl_info.php*
// @include http://178.248.235.15/pl_info.php*
// @include http://www.lordswm.com/pl_info.php*
// @include https://www.heroeswm.ru/pl_info.php*
// @include https://178.248.235.15/pl_info.php*
// @include https://www.lordswm.com/pl_info.php*
// @grant   none
// @version 1.4.2
// @downloadURL https://update.greasyfork.org/scripts/373975/HWM_Resources_Cost.user.js
// @updateURL https://update.greasyfork.org/scripts/373975/HWM_Resources_Cost.meta.js
// ==/UserScript==

// Цены
var resPrices = {"wood": 175, "ore": 175, "mercury": 355, "sulfur": 355, "crystal": 355, "gem": 355} // ресурсы
var elPrices = {"абразив":800, "змеиный яд":100, "клык тигра":500, "ледяной кристалл":1600, "лунный камень":3300, "огненный кристалл":1500, "осколок метеорита":2300, " цветок ведьм":100, "цветок ветров":2300, "цветок папоротника":150, "ядовитый гриб":100}; // элементы

// Ресурсы
var resRow =  getElementByXpath("/html/body/center/table/tbody/tr/td/table[1]/tbody/tr[1]/td[2]/table/tbody/tr");
var resArr = resRow.getElementsByTagName('img');
var resSum = 0;
var goldSum = 0;

for(var i=0, el; el=resArr[i]; i++)
{
    if((imgname = el.getAttribute('src')) && (res = /([a-z]{1,}).gif/.exec(imgname)) && (res[1]) && (rPrice = resPrices[res[1]]) )
        resSum += parseInt(el.parentNode.nextSibling.firstChild.innerHTML.replace(',',''), 10) * rPrice;
    else
        goldSum += parseInt(el.parentNode.nextSibling.firstChild.innerHTML.replace(',',''), 10);
}

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
elCell.innerHTML += '<br>&nbsp;&nbsp;&nbsp;&nbsp;Всех ресурсов: '+(elSum + resSum + goldSum);

// create DIV element and append to the table cell
function createCell(cell, text, style) {
    var div = document.createElement('div'), // create DIV element
        txt = document.createTextNode(text); // create text node
    div.appendChild(txt);                    // append text node to the DIV
    div.setAttribute('class', style);        // set DIV class attribute
    div.setAttribute('className', style);    // set DIV class attribute for IE (?!)
    cell.appendChild(div);                   // append DIV to the table cell
}

function getElementByXpath (path) {return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}
