// ==UserScript==
// @name        HWM_Repair_Costs
// @namespace   Zeleax
// @description На странице артефакта добавляет таблицу со стоимостью ремонта (10%, 20%, ...) и возможность передачи суммы своим кузнецам
// @include     http://www.heroeswm.ru/art_info.php?id=*
// @include     http://qrator.heroeswm.ru/art_info.php?id=*
// @include     http://178.248.235.15/art_info.php?id=*
// @include     http://www.lordswm.com/art_info.php?id=*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10289/HWM_Repair_Costs.user.js
// @updateURL https://update.greasyfork.org/scripts/10289/HWM_Repair_Costs.meta.js
// ==/UserScript==
var percents = [10,20,30,47,57,67,77,87,97]; // проценты
var kuznec = {'_Брат_ ': [60,57,2]} // кузнецы ('имя': [эффект, цена,+золотаСверху])

artName = '';
if((els = document.getElementsByClassName('wbwhite')) && (el = els[0].firstChild))
   artName = el.innerHTML;

var repCostTbl = getI( "//b[contains(text(),'Стоимость ремонта:')]" ).snapshotItem(0).nextSibling;
if((res=/<td>([0-9,]+)<\/td>/.exec(repCostTbl.innerHTML)) && (remont = parseInt(res[1].replace(',',''))))
{
   var t = document.createElement("table");
   t.setAttribute('border','1');

   var row1 =  t.insertRow(-1);
   c1 = row1.insertCell(0);
   c1.innerHTML='Цена, %'
   var row2 =  t.insertRow(-1);
   c2 = row2.insertCell(0);
   c2.innerHTML='Стоимость';
   
   for(i=0;p=percents[i];i++){
      c1 = row1.insertCell(i+1);
      c1.innerHTML = p;
      c2 = row2.insertCell(i+1);
      c2.innerHTML =Math.ceil(remont*p /100);     
   }
   
   repCostTbl .parentNode.insertBefore(t, repCostTbl .nextSibling);
   
   var d = document.createElement("div");
   d.innerHTML = '';
   for(property in kuznec){
      sumRem = Math.ceil(kuznec[property][1]*remont/100)+kuznec[property][2];
      d.innerHTML +='<a title="Передать '+sumRem+' золота" href="'+document.location.origin+'/transfer.php?gold='+sumRem+'&desc=за ремонт '+artName+'&nick='+property+'"><b>'+property+'('+kuznec[property][0]+'/'+kuznec[property][1]+')'+'</b></a>'+' &nbsp;&nbsp;';
      }
   t .parentNode.insertBefore(d, t .nextSibling);
}

function getI(xpath,elem){return document.evaluate(xpath,(!elem?document:elem),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}