// ==UserScript==
// @name         LNK_lotHistory
// @namespace    LNK
// @version      1.3
// @description  ведет историю выставленных лотов, показывает ее на странице выставления лота. также можно добавить лоты из протокола передач
// @include      *heroeswm.ru/auction_new_lot.php*
// @include      *heroeswm.ru/auction_accept_new_lot.php*
// @include      *heroeswm.ru/pl_transfers.php?id=*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/459331/LNK_lotHistory.user.js
// @updateURL https://update.greasyfork.org/scripts/459331/LNK_lotHistory.meta.js
// ==/UserScript==

(function() {
    'use strict';

function getValue(varName, defaultValue) {
	if (defaultValue == undefined) { defaultValue = ''; }
	return GM_getValue(varName, defaultValue);
} // getValue

function setValue(varName, theValue) {
	GM_setValue(varName, theValue);
} // setValue

function deleteValue(valueToDel) {
	GM_deleteValue(valueToDel);
} // deleteValue

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

function getNewLot() { //https://www.heroeswm.ru/auction_accept_new_lot.php?msg_type=1&new_lot_id=118155890&pl_id=5558048&sign=96c52af4ebaa8c7e334dec6b9b7fb1ff
    var paramsS = location.search;
    var paramsV = new URLSearchParams(paramsS);
    var id = parseInt(paramsV.get("new_lot_id"));
    if (id) { return id;}
    else { alert('Не могу определить номер лота(. Обратиттесь к автору скрипта'); return false; }
} // getNewLot

function getLotName(lotNum) {
	var curLot = getPage('/auction_lot_protocol.php?' + lotNum);
	var n = curLot.indexOf('лот #');
	if (n < 0) {return false;}
	curLot = curLot.substr(n+5);
	curLot = curLot.replace(/\s*\<.*?\>\s*/g, " ");
	curLot = curLot.replace(/\s*\[.*?\]\s*/g, " ");
	n = curLot.indexOf(' по ');
	if (n < 0) {return false;}
	curLot = curLot.substring(0,n);
	n = curLot.indexOf('Выставлено на продажу');
	curLot = curLot.substr(n+22).trim();
	n = curLot.indexOf(' шт.');
	if (n>0) {
		curLot = curLot.substring(0,n-2).trim();
	}
	return curLot;
} // getLotName

function addLot(lotName,lotNum) {
	var lots = [];
	var lotNums = [];
	var lotsVar = getValue('lotHistory_lots');
	if (lotsVar == '') {lots = [];}
	else {lots = JSON.parse(getValue('lotHistory_lots'));}
	if (!(lots.length > 0)) {lots = [];}
	var found = false;
	var add = false;
	for (var i = 0; i < lots.length; i++) {
		if (lots[i][0] == lotName) {
			found = true;
			break;
		}
	}
	if (found) {
		if (!lots[i].includes(lotNum)) {
			lots[i].splice(1, 0, lotNum);
			if (lots[i].length > (maxLotNum+1)) { lots[i].pop(); }
			add = true;
		}
	} else {
		lotNums = [lotName,lotNum];
		lots.push(lotNums);
		add = true;
	}
	setValue('lotHistory_lots',JSON.stringify(lots));
	return add;
} // addLot

function getAnyHistory() {getLotHistory(this.innerHTML.trim());}

function getAllHistory() {
	var lots = [];
	var lotNums = [];
	var i, i1;
	var lotTbl = document.createElement('table');
	lotTbl.align="center";
	lotTbl.width="970px";
	lotTbl.style.borderCollapse = 'collapse';
	lotTbl.setAttribute('border',2);
	lotTbl.setAttribute('cellpadding',4);
	var tabText = '';
	var lotsText = getValue('lotHistory_lots','');
	if (lotsText != '') {
        lots = JSON.parse(lotsText);
        lots.sort();
    }
	for (i = 0; i < lots.length; i++) {
		tabText += '<tr>';
		lotNums = lots[i];
		for (i1 = 0; i1 < lotNums.length; i1++) {
			if (i1 == 0) {
				tabText +='<td id="lot'+i+'" style = "cursor: pointer;"> '+lotNums[i1]+' </td>';
			} else {
				tabText +='<td> <a href="auction_lot_protocol.php?id='+lotNums[i1]+'">'+lotNums[i1]+'</a> </td>';
			}
		}
		tabText += '</tr> ';
	}
	if (tabText == '') {
        tabText = '<tr><td> Список лотов пуст. Список заполняется автоматически при торговле или кнопкой внизу страницы протокола передач </td></tr>';
    }
	lotTbl.innerHTML = '<tbody>' + tabText + '</tbody>';
	document.body.insertBefore(lotTbl,document.getElementById('paramTbl'));
	for (i = 0; i < lots.length; i++) {
		document.getElementById('lot'+i).onclick = getAnyHistory;
	}
	return true;
} // getAllHistory

function lotInfo(lotNum,lotName) {
	var curLot = getPage('/auction_lot_protocol.php?id=' + lotNum);
	var n = curLot.indexOf('лот #');
    var zaBoyRem = '';
	if (n < 0) {return false;}
	curLot = curLot.substr(n+5);
	n = curLot.indexOf('art_info.php?id=');
	var lotVal = curLot.substring(n,curLot.indexOf('"',n));
	lotVal = lotVal.substr(lotVal.indexOf('=')+1);
	n = lotVal.indexOf('&');
	if (n>0) { lotVal = lotVal.substring(0,n); }
	//alert(lotVal);alert(n);
	if (lotNum != curLot.substring(0,curLot.indexOf('<'))) return '<td>Не совпадает номер лота</td>';
	curLot = curLot.replace(/\s*\<.*?\>\s*/g, " ");
	var lotState = sale;
	if (curLot.indexOf('Товар распродан') > 0) {lotState = sold;}
	if (curLot.indexOf('Торги закончены') > 0) {lotState = ret;}
	n = curLot.indexOf('Выставлено на продажу');
	var putOn = 'Выставлено ' + curLot.substr(n-22,17);
	var res = 'Еще в продаже';
	n = curLot.indexOf('Товар распродан');
	if (lotState == sold) {res = 'Продано ' + curLot.substr(n-22,17);}
	n = curLot.indexOf('Торги закончены');
	if (lotState == ret) {res = 'Возврат ' + curLot.substr(n-22,17);}
	var prochka = 0, prochkaFull = 0, prochkaS = '';
	n = curLot.indexOf('[');
	if (n>0) {
		if (isNaN(curLot[n+1])) { n = curLot.indexOf('[',n+1); }
		if (isNaN(curLot[n+1])) { n = curLot.indexOf('[',n+1); }
		prochka = parseInt(curLot.substring(n+1,curLot.indexOf('/')));
		prochkaS = curLot.substring(n,curLot.indexOf(']',n)+1);
		prochkaFull = prochkaS.substring(prochkaS.indexOf('/')+1,prochkaS.indexOf(']'));
	}
	var Qty = 1;
	n = curLot.indexOf(' шт. по ');
	if (n>0) {
		Qty = parseInt(curLot.substr(n-2,2).trim());
	}
	var price = 0;
	n = curLot.indexOf(' по ');
	if (n>0) {
		price = parseInt(curLot.substring(n+4,curLot.indexOf('золота',n)-1).trim());
	}
	var zaBoy = '';
	if (lotVal) {
		if (unsafeWindow.calcZaboyR) {
            zaBoyRem = unsafeWindow.calcZaboyR(lotVal, prochka, prochkaFull, price);
            if (zaBoyRem.zaBoy) { zaBoyRem = ' / ' + zaBoyRem.zaBoy + ' P'; }
            else { zaBoyRem = ''; }
        }
	}
	if (prochka > 0) { zaBoy = ' (' + Math.round(price/prochka) + ' за бой'+zaBoyRem+') '; }
	return ('<td><a href="auction_lot_protocol.php?id='+lotNum+'">'+lotNum+'</a> ' +
			putOn + ' ' + Qty + ' шт. ' + prochkaS + ' ' + price + ' за шт.' + zaBoy + ' -> ' + res + '</td>');
}//lotInfo

function addHistory() {
	var marketPage = getPage(location.href);
	var lotName, lotNum;
	var i = 0;
	var found = false;
	var n = marketPage.indexOf('Продан ');
	if (n < 0) { alert('Не могу найти протокол'); return false;}
	marketPage = marketPage.substr(n-10);
	marketPage = marketPage.replace(/\s*\<.*?\>\s*/g, " ");
	marketPage = marketPage.replace(/\s*\[.*?\]\s*/g, " ");
	while ((n = marketPage.indexOf('Продан ')) >=0) {
		marketPage = marketPage.substr(n);
		found = false;
		if ((n = marketPage.indexOf('предмет')) == 7) {
			lotName = marketPage.substring(n+9,marketPage.indexOf('"',n+10));
			found = true;
		}
		if ((n = marketPage.indexOf('сертификат')) == 7) {
			lotName = marketPage.substring(n,marketPage.indexOf(' за ',n));
			lotName = lotName.replace('сертификат на постройку 1% дома в','Сертификат 1% для');
			found = true;
		}
		if (found) {
			n = marketPage.indexOf('лот #'); n += 5;
			lotNum = marketPage.substring(n,marketPage.indexOf(' ',n));
			marketPage = marketPage.substr(n);
			//alert('-'+lotName+'-'+lotNum+'-');
			if (addLot(lotName,lotNum)) {i++;}
		} else { marketPage = marketPage.substr(1); }
	}
	alert('Добавлено лотов: '+i);
	return true;
}//addHistory

function getHistory() {
	var lotName = document.getElementById('sel').options[document.getElementById('sel').selectedIndex].text;
	var n = lotName.indexOf('/');
	if (n > 0) {
		if (!isNaN(lotName[n-2])) {n--;}
		if (!isNaN(lotName[n-2])) {n--;}
		lotName = lotName.substring(0,n-1);
	}
	n = lotName.indexOf('(');
	if (n > 0) {
		lotName = lotName.substring(0,n-1);
	}
	n = lotName.indexOf('[');
	if (n > 0) {
		lotName = lotName.substring(0,n-1);
	}
	lotName = lotName.trim();
	getLotHistory(lotName);
} // getHistory

function getLotHistory(lotName) {
	var waitMes = document.createElement('a');
	waitMes.innerHTML = '<b> <br> Получаем данные. Подождите... </b>';
	waitMes.style = 'background-color: #A6DFF0; box-shadow: 0 0 3px rgba(0,0,0,1);'+
					'position: fixed; top: 50%; right: 50%; width: 200px; height: 70px; z-index: 9555; text-align: center;';
	document.body.append(waitMes);
	var lots = [];
	var lotNums = [];
	var i, i1;
	var lotTbl = document.createElement('table');
	lotTbl.id = 'lotTbl';
	lotTbl.align="center";
	lotTbl.width="970px";
	lotTbl.style.borderCollapse = 'collapse';
	lotTbl.setAttribute('border',2);
	lotTbl.setAttribute('cellpadding',4);
	var tabText = '<tbody> ';
	var lotsText = getValue('lotHistory_lots','');
	if (lotsText != '') {
        lots = JSON.parse(lotsText);
        lots.sort();
    }
	var found = false;
	for (i = 0; i < lots.length; i++) {
		lotNums = lots[i];
		if (lotNums[0]) { lotNums[0] = lotNums[0].replace('икат 1% для','икат для'); }
		if (lotNums[0] == lotName) {
			for (i1 = 0; i1 < lotNums.length; i1++) {
				tabText += '<tr>';
				if (i1 == 0) {
					tabText += '<td> '+lotName+' </td>';
				} else {
					tabText += lotInfo(lotNums[i1],lotName);
				}
				tabText += '</tr> ';
			}
			found = true;
			break;
		}
	}
	tabText += '</tbody>';
	if (found) {lotTbl.innerHTML = tabText;}
	else {lotTbl.innerHTML = '<tbody><tr><td> Таких лотов нет в сохраненных данных. Список заполняется автоматически при торговле или кнопкой внизу страницы протокола передач </td></tr></tbody>';}
	var prevTbl = document.getElementById("lotTbl");
	if (prevTbl) {prevTbl.remove();}
	document.getElementById('paramTbl').before(lotTbl);
	waitMes.remove();
	return true;
} // getLotHistory

var sale = 0, sold = 1, ret = 2;
var maxLotNum = 10;

function main() {
    var paramTbl;
	if (location.href.indexOf('pl_transfers.php?id=') > 0) {
		paramTbl = document.createElement('table');
		paramTbl.innerHTML =
			'<tbody> '+
				'<tr> '+
					'<td align="center"> <input type="button" id="butAddHistory" value="Добавить в историю продаж лоты с этой страницы" /></td>'+
				'</tr> '+
			'</tbody>';
		paramTbl.id="paramTbl";
		paramTbl.align="center";
		paramTbl.width="970px";
		paramTbl.style.borderCollapse = 'collapse';
		paramTbl.setAttribute('border',2);
		paramTbl.setAttribute('cellpadding',4);
		document.body.append(paramTbl);
		document.getElementById('butAddHistory').onclick = addHistory;
		return 0;
	}
	if (location.href.indexOf('auction_new_lot.php') > 0) {
		paramTbl = document.createElement('table');
		paramTbl.innerHTML =
			'<tbody> '+
				'<tr> '+
					'<td align="center"> <input type="button" id="butGetHistory" value="Посмотреть историю лота" /></td>'+
					'<td align="center"> <input type="button" id="butGetAllHistory" value="Посмотреть все сохраненные лоты" /></td>'+
				'</tr> '+
			'</tbody>';
		paramTbl.id="paramTbl";
		paramTbl.align="center";
		paramTbl.width="970px";
		paramTbl.style.borderCollapse = 'collapse';
		paramTbl.setAttribute('border',2);
		paramTbl.setAttribute('cellpadding',4);
		document.body.append(paramTbl);
		document.getElementById('butGetHistory').onclick = getHistory;
		document.getElementById('butGetAllHistory').onclick = getAllHistory;
		return 0;
	}
	if (location.href.indexOf('auction_accept_new_lot.php') > 0) {
		var lotNum = getNewLot();
		if (!lotNum) {return 0;}
		var lotNumCRC = document.querySelector('a[href*="auction_lot_protocol.php?id="]');
                lotNumCRC = lotNumCRC.href.slice(lotNumCRC.href.indexOf('id='));
		var lotName = getLotName(lotNumCRC);
		addLot(lotName,lotNum);
		paramTbl = document.createElement('table');
		paramTbl.innerHTML =
			'<tbody> '+
				'<tr> <td align="center"> Добавлено в историю продаж: '+lotName+' (лот '+lotNum+')</td> </tr> '+
			'</tbody>';
		paramTbl.align="center";
		paramTbl.width="970px";
		paramTbl.style.borderCollapse = 'collapse';
		paramTbl.setAttribute('border',2);
		paramTbl.setAttribute('cellpadding',4);
		document.body.append(paramTbl);
		return 0;
	}
	return 0;
} // main

main();


})();
