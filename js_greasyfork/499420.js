// ==UserScript==
// @name HWM_Resources_Cost_GRA
// @description   Отображает на странице персонажа общую стоимость ресурсов (дерево, руда, ртуть и т.п.) по цене 180/360 и общую стоимость
// @namespace  Nexterot
// @author  Nexterot
// @include https://www.heroeswm.ru/pl_info.php*
// @include https://178.248.235.15/pl_info.php*
// @include https://www.lordswm.com/pl_info.php*
// @include https://my.lordswm.com/pl_info.php*
// @grant   none
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/499420/HWM_Resources_Cost_GRA.user.js
// @updateURL https://update.greasyfork.org/scripts/499420/HWM_Resources_Cost_GRA.meta.js
// ==/UserScript==
function getFloat(id){
  return parseFloat(id.replace(/,/, '.'));
}
// Цены
var resPrices = {"wood": 180, "ore": 180, "mercury": 360, "sulfur": 360, "crystal": 360, "gem": 360} // ресурсы
var elPrices = {"Сталь":759, "Мифриловая руда":460, "Кожа":180, "Никель":1698, "Мифрил":3325, "Орихалк":11000, "Волшебный порошок":2074, "Обсидиан":2000}; // элементы
var goldElem = document.querySelector("table.wblight:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > b:nth-child(1)");
// Ресурсы
var resRow =  getElementByXpath("/html/body/center/table/tbody/tr/td/table[1]/tbody/tr[1]/td[2]/table/tbody/tr");
console.log(resRow);
var resArr = resRow.getElementsByTagName('img');
let gold = (getElementByXpath("/html/body/center/table/tbody/tr/td/table[1]/tbody/tr[1]/td[2]/table/tbody/tr/td[2]/b").innerHTML).replace(/,/g,"")
let wood = getElementByXpath("/html/body/center/table/tbody/tr/td/table[1]/tbody/tr[1]/td[2]/table/tbody/tr/td[4]/b").innerHTML*180;
let ore = getElementByXpath("/html/body/center/table/tbody/tr/td/table[1]/tbody/tr[1]/td[2]/table/tbody/tr/td[6]/b").innerHTML*180;
let mercury = getElementByXpath("/html/body/center/table/tbody/tr/td/table[1]/tbody/tr[1]/td[2]/table/tbody/tr/td[8]/b").innerHTML*360;
let sulfur = getElementByXpath("/html/body/center/table/tbody/tr/td/table[1]/tbody/tr[1]/td[2]/table/tbody/tr/td[10]/b").innerHTML*360;
let crystal = getElementByXpath("/html/body/center/table/tbody/tr/td/table[1]/tbody/tr[1]/td[2]/table/tbody/tr/td[12]/b").innerHTML*360;
let gem = getElementByXpath("/html/body/center/table/tbody/tr/td/table[1]/tbody/tr[1]/td[2]/table/tbody/tr/td[14]/b").innerHTML*360;

let resSum = parseInt(gold)+wood+ore+mercury+sulfur+crystal+gem;
//createCell(resRow.insertCell(-1), " = "+resSum, 'resRow');

console.log(resSum);

// Элементы
var tbl = getElementByXpath("/html/body/center/table[2]");
var t = document.getElementsByTagName("td");
var res = null;
for(i=0;el=t[i];i++) if(el.innerHTML == '<b>Ресурсы</b>') {res=el; break;};
if(res) {
    elCell = res.parentNode.nextSibling.firstChild;
}
var matches, ePrice;
var re = /&nbsp;&nbsp;([^<]+):&nbsp;([0-9,]+)<br>/gmi;
var elSum = 0;
while(res = re.exec(elCell.innerHTML)){
    if(ePrice= elPrices[res[1]]) {
        console.log(elSum);
        elSum += parseInt(res[2])*ePrice;
    }
}

console.log((goldElem.innerHTML));
gold=goldElem.innerText;
gold=getFloat(gold);
console.log(gold);
gold*=1000;
console.log(gold);
elSum=elSum+resSum;
if(elSum>0) {
    elCell.innerHTML += '<br><br>&nbsp;&nbsp;<b>стоимость ресурсов: '+elSum.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</b>';
}

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
