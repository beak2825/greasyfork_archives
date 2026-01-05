// ==UserScript==
// @name        HWM_BC_Last_Online
// @namespace   Рианти
// @description Последний онлайн персонажей в клане
// @include     http://www.heroeswm.ru/clan_info.php?id=*
// @version     1
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/12724/HWM_BC_Last_Online.user.js
// @updateURL https://update.greasyfork.org/scripts/12724/HWM_BC_Last_Online.meta.js
// ==/UserScript==

try{
  addQuickLink ('Последний онлайн', 'last_online',
                function (){
                  work();
                  });
  
} catch(e){
  console.log(e);
}

function addQuickLink (label, id, action){
  var quickLinksTableTR = document.querySelector('body > center:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1)');
  var td = document.createElement('td');
  td.innerHTML = '<div id="breadcrumbs" style="z-index: auto;"><ul style="z-index: auto;"><li class="subnav" style="z-index: auto;"><nobr>\
| <a class="pi" id="' + id + '" href="javascript:void(0)">' + label + '</a>\
</nobr></li></ul></div>';
  quickLinksTableTR.appendChild(td);
  var elem = document.getElementById(id);
  elem.onclick = action;
}

function work (){
  try{
  var p = document.querySelectorAll('a[href*="pl_info.php?id="]');
  var dataTable = p[p.length-1].parentElement.parentElement.parentElement;    
  var cells = dataTable.querySelectorAll("td"); //relevant cells are 3, 5 in each row
  var rows =cells.length/5;
  var tmp,plID,plNick,plLVL;

  for (var i = 0; i < rows; i++) {
    tmp = cells[i * 5 + 2].getElementsByClassName('pi')[0];
    plID = tmp.href.split('=')[1];
    try{
    cells[i * 5 + 4].innerHTML = getPageContent('http://www.heroeswm.ru/pl_info.php?id=' + plID).querySelector('td:nth-child(2) > i:nth-child(1)').innerHTML;
    } catch(e) { cells[i * 5 + 4].innerHTML = 'Онлайн' }
  }
  } catch (E) {console.log(E,getPageContent('http://www.heroeswm.ru/pl_info.php?id=' + plID).innerHTML)}
}

function getPageContent(url)
{
    try {
    console.log('loading: ', url);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, false);
    xmlhttp.overrideMimeType('text/plain; charset=windows-1251');
    xmlhttp.send(null);
    if(xmlhttp.status == 200)
        return new DOMParser().parseFromString(xmlhttp.responseText, 'text/html').documentElement;
    return '';
    } catch ( e ) {
        return getPageContent(url);
    }
}
