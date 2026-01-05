// ==UserScript==
// @name        HWM_Count_Clan_Medals
// @namespace   Рианти
// @description Подсчет общего кол-ва медалей, турнирного золота членов клана
// @include     http://www.heroeswm.ru/clan_info.php?id=*
// @version     1
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/12726/HWM_Count_Clan_Medals.user.js
// @updateURL https://update.greasyfork.org/scripts/12726/HWM_Count_Clan_Medals.meta.js
// ==/UserScript==

function requestPage (url, onloadHandler){
  console.log('loading: ', url);
  try{
    GM_xmlhttpRequest({
      overrideMimeType: 'text/plain; charset=windows-1251',
      synchronous: false,
      url: url,
      method: "GET",
      onload: function(response){
        onloadHandler(new DOMParser().parseFromString(response.responseText, 'text/html').documentElement);
      },
      onerror: function(){ setTimeout(function(){ requestPage (url, onloadHandler) }, 1000) },
      ontimeout: function(){ setTimeout(function(){ requestPage (url, onloadHandler) }, 1000) },
      timeout: 5000
    });
  } catch (e) {
    console.log(e);
  }
}

function typeMedals (dom){
  try{
    var cells = dom.querySelectorAll('.srch > td');
    if(!cells.length) return [0,0,0,0,0];
    var colVals = [];
    for (var i = 0; i < 5; i ++){
      colVals[i] = parseInt(cells[i + 2].innerHTML.replace(/<[^>]+>/,'').replace(/ /,''));
    }
    return colVals;
  } catch (E) { console.log(E) }
}

function collectPlayers()
{
  var outputArray = [];
  try {
    var p = document.querySelectorAll('a[href*="pl_info.php?id="]');
    dataTable = p[p.length-1].parentElement.parentElement.parentElement;
    var cells = dataTable.querySelectorAll("td"); //relevant cells are 3, 5 in each row
    var rows =cells.length/5;
    var tmp,plID,plNick,plLVL;

    for (var i = 0; i < rows; i++) {
      plLVL = parseInt(cells[i * 5 + 3].innerHTML);
      tmp = cells[i * 5 + 2].getElementsByClassName('pi')[0];
      plID = tmp.href.split('=')[1];
      plNick = tmp.innerHTML;
      outputArray.push({plID: plID, plNick: plNick, plLVL: plLVL})
    }
    return outputArray;
  } catch (e) {
    console.log(e);
  }
}

function collectPlayerData(plID){
  var player = allPlayers[plID];
  _workArr = [player.plNick, player.plLVL];
  requestPage (pages[0] + player.plID, function(dom){
    _workArr = _workArr.concat(typeMedals (dom));
    requestPage (pages[1] + player.plID, function(dom){
      _workArr = _workArr.concat(typeMedals (dom));
      requestPage (pages[2] + player.plID, function(dom){
        _workArr = _workArr.concat(typeMedals (dom));
        requestPage (pages[3] + player.plID, function(dom){
          try{
            _workArr = _workArr.concat(typeMedals (dom));
            fOutput.push(_workArr);
            console.log(_workArr)
            dataTable.querySelector('a[href*="id=' + player.plID + '"]').style.color = 'white';
            if (plID < allPlayers.length - 1) collectPlayerData(plID + 1);
            else {
              console.log(fOutput);
              downloadCSV(fOutput);
            }
          } catch (e){ console.log(e); console.log(fOutput); downloadCSV(fOutput);}
        });
      });
    });
  });
}

function downloadCSV(twoDArray){
    var csvContent = "data:text/csv;charset=utf-8,";
    for(var row in twoDArray){
        csvContent += twoDArray[row].join("|").replace(/\./g, ',') + "\n";
    }
    var encodedUri = encodeURI(csvContent);
    alert('Сейчас вам будет предложено загрузить файл со статистикой. При сохранении установите расширешие .csv\nВ дальнейшем, вы сможете открыть его для работы в Экселе или аналогах.');
    window.open(encodedUri);
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

var _workArr;
var dataTable;

var pages = [
  'http://bizzle.ru/hwm/pvp_tour/?typetour=1&srch=', // МТ
  'http://bizzle.ru/hwm/pvp_tour/?typetour=2&srch=', // ПТ
  'http://bizzle.ru/hwm/pvp_tour/?typetour=4&srch=', // СмТ
  'http://bizzle.ru/hwm/pvp_tour/?typetour=5&srch=' // ПТЭ
];

var fOutput = [
  [
  'Ник', 'БУ', 'МТ-Зол', 'МТ-Сер', 'МТ-бронз', 'МТ-10%', 'МТ-доход', 'ПТ-Зол', 'ПТ-Сер', 'ПТ-бронз', 'ПТ-10%', 'ПТ-доход', 'СмТ-Зол', 'СмТ-Сер', 'СмТ-бронз', 'СмТ-10%', 'СмТ-доход', 'ПТЭ-Зол', 'ПТЭ-Сер', 'ПТЭ-бронз', 'ПТЭ-10%', 'ПТЭ-доход'
  ]
];

var allPlayers = collectPlayers();

addQuickLink ('Считать медали', 'count_medals',
              function (){
                collectPlayerData(0);
              });