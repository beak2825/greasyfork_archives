// ==UserScript==
// @name         Advanced Link History SLT
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://cms.sletat.ru/LinkHistory.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388714/Advanced%20Link%20History%20SLT.user.js
// @updateURL https://update.greasyfork.org/scripts/388714/Advanced%20Link%20History%20SLT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getInfo(el, tableId, rowTmpId, rowPstId, sourceId, rowId) {
	var linksArr = document.querySelectorAll("#table0 > tbody > tr td:nth-child(7) > a");
	lastRequestPst = PageMethods._staticInstance.GetLinkInfo(
		tableId, rowPstId, false, sourceId,
		function(result) {
			//console.log(result);
			var resultInfo = result.split('<br />');
			var row = linksArr[rowId].parentElement.parentElement;
			var hotelCard = '<a href="https://cms.sletat.ru/HotelCard.aspx?hotel=' + rowPstId + '" target="_blank">' + row.children[4].innerText + '</a>';
			row.children[4].innerHTML = '<div style="border-bottom: 1px solid #afafaf7d">' + hotelCard + '</div><div style="border-bottom: 1px solid #afafaf7d">' + resultInfo[1] + '</div><div>' + resultInfo[2] + '</div>';
		});
	lastRequestTmp = PageMethods._staticInstance.GetLinkInfo(
		tableId, rowTmpId, true, sourceId,
		function(result) {
			//console.log(result);
			var resultInfo = result.split('<br />');
			var row = linksArr[rowId].parentElement.parentElement;
			var fixinGoogleLink = row.children[5].innerText.replace(/"/g, '');
            fixinGoogleLink = row.children[5].innerText.replace(/&/g, '%26');
			var hotelGoogleLink = '<a href="https://www.google.com/search?q=' + fixinGoogleLink + resultInfo[2].replace('Курорт:', '') + '" target="_blank">' + row.children[5].innerText + '</a>';
			row.children[5].innerHTML = '<div>' + hotelGoogleLink + '</div><div style="border-bottom: 1px solid #afafaf7d; border-top: 1px solid #afafaf7d; ">' + resultInfo[1] + '</div><div>' + resultInfo[2] + '</div>';
		});
}

function getLinksParam() {
	var linksArr = document.querySelectorAll("#table0 > tbody > tr td:nth-child(7) > a");
	for (var i = 0; i < linksArr.length; i++) {
		var param = linksArr[i].getAttribute('onmouseover');
		param = param.replace('showLinkInfo(', '');
		param = param.replace('); return false;', '');
		param = param.split(', ')
		var el = param[0];
		var tableId = param[1];
		var rowTmpId = param[2];
		var rowPstId = param[3];
		var sourceId = param[4];
		var rowId = i;
		getInfo(el, tableId, rowTmpId, rowPstId, sourceId, rowId)
	}
}

function getCompare() {
	var rows = document.querySelectorAll("#table0 > tbody > tr");
	for (var i = 0; i < rows.length; i++) {
        if (rows[i].children[5].childElementCount > 0 & rows[i].children[4].childElementCount > 0) {
		var mainHotel = rows[i].children[4].children[0].innerText.toLowerCase();
		var secondaryHotel = rows[i].children[5].children[0].innerText.toLowerCase();
		var mainStar = rows[i].children[4].children[1].innerText.toLowerCase();
		var secondaryStar = rows[i].children[5].children[1].innerText.toLowerCase();
		var mainResort = rows[i].children[4].children[2].innerText.toLowerCase();
		var secondaryResort = rows[i].children[5].children[2].innerText.toLowerCase();

		// del * and cat
		secondaryHotel = secondaryHotel.replace(/\d\*\s/, '');
		secondaryHotel = secondaryHotel.replace(/\s\d\*/, '');

        
		//other filters
		secondaryHotel = secondaryHotel.replace(' (aj)', '');
		secondaryHotel = secondaryHotel.replace(' (e)', '');
		secondaryHotel = secondaryHotel.replace(' (e2)', '');
        secondaryHotel = secondaryHotel.replace('.', '');

		mainResort = mainResort.replace('-', ' ');
		mainResort = mainResort.replace('-', ' ');
		secondaryResort = secondaryResort.replace('-', ' ');
		secondaryResort = secondaryResort.replace('-', ' ');
		mainResort = mainResort.replace('курорт: ', '');
		secondaryResort = secondaryResort.replace('курорт: ', '');
        secondaryResort = secondaryResort.replace(' (регион)', '');
        secondaryResort = secondaryResort.replace('остров', '');

        secondaryHotel = secondaryHotel.replace('è', 'e');
        secondaryHotel = secondaryHotel.replace('è', 'e');
        secondaryHotel = secondaryHotel.replace('é', 'e');
        secondaryHotel = secondaryHotel.replace('é', 'e');
        secondaryHotel = secondaryHotel.replace('ô', 'o');
        secondaryHotel = secondaryHotel.replace('ô', 'o');

        mainHotel = mainHotel.replace("'", "");
        secondaryHotel = secondaryHotel.replace("'", "");
        mainHotel = mainHotel.replace("`", "");
        secondaryHotel = secondaryHotel.replace("`", "");
        mainHotel = mainHotel.replace('&', 'and');
        secondaryHotel = secondaryHotel.replace('&', 'and');
        secondaryHotel = secondaryHotel.replace(' (the)', '');

        //delete 'hotel'
		secondaryHotel = secondaryHotel.replace(' hotel', '');
		secondaryHotel = secondaryHotel.replace('hotel ', '');
        mainHotel = mainHotel.replace(' hotel', '');
		mainHotel = mainHotel.replace('hotel ', '');

		if (mainHotel.indexOf(secondaryHotel) >= 0) {
			rows[i].children[4].children[0].style.background = '#cbffcb';
			rows[i].children[5].children[0].style.background = '#cbffcb';
			//console.log('1');
		}
		if (mainStar.indexOf(secondaryStar) >= 0) {
			rows[i].children[4].children[1].style.background = '#cbffcb';
			rows[i].children[5].children[1].style.background = '#cbffcb';
		}
		if (mainResort.indexOf(secondaryResort) >= 0) {
			rows[i].children[4].children[2].style.background = '#cbffcb';
			rows[i].children[5].children[2].style.background = '#cbffcb';
			//console.log('1');
		}
		if ( rows[i].children[7].children.length == 0) {
			rows[i].children[4].children[0].style.background = '#ffd2cb';
			rows[i].children[5].children[0].style.background = '#ffd2cb';
			rows[i].children[4].children[1].style.background = '#ffd2cb';
			rows[i].children[5].children[1].style.background = '#ffd2cb';
			rows[i].children[4].children[2].style.background = '#ffd2cb';
			rows[i].children[5].children[2].style.background = '#ffd2cb';
		}
        if (mainHotel.indexOf('экскурсионная программа') == 0) {
			rows[i].children[4].children[0].style.background = '#fffcba';
			rows[i].children[5].children[0].style.background = '#fffcba';
			rows[i].children[4].children[1].style.background = '#fffcba';
			rows[i].children[5].children[1].style.background = '#fffcba';
			rows[i].children[4].children[2].style.background = '#fffcba';
			rows[i].children[5].children[2].style.background = '#fffcba';
		}}
	}
}

function defaultCompare() {
	var rows = document.querySelectorAll("#table0 > tbody > tr");
		for (var i = 0; i < rows.length; i++) {
			rows[i].children[4].children[0].style.background = 'none';
			rows[i].children[5].children[0].style.background = 'none';
			rows[i].children[4].children[1].style.background = 'none';
			rows[i].children[5].children[1].style.background = 'none';
			rows[i].children[4].children[2].style.background = 'none';
			rows[i].children[5].children[2].style.background = 'none';
	}
}

var btnsContainer = document.querySelector("#content-wrap > div:nth-child(5)");
var addInfo = document.createElement('div');
    addInfo.innerHTML = ("Загрузить инфу");
    addInfo.classList.add('button');
    addInfo.setAttribute("style", "margin-left: 4px; width: 89px; font: bold 1em Arial, Sans-serif;font-weight: bold;border: 1px solid #ccc;background: #F0F0F0;padding: 3px 5px;color: #4284B0;cursor: pointer; display: inline-block;");
	btnsContainer.appendChild(addInfo);
var addCompare = document.createElement('div');
    addCompare.innerHTML = ("Включить сравнение");
    addInfo.classList.add('button');
    addCompare.setAttribute("style", "margin-left: 8px; width: 118px; font: bold 1em Arial, Sans-serif;font-weight: bold;border: 1px solid #ccc;background: #F0F0F0;padding: 3px 5px;color: #4284B0;cursor: pointer; display: inline-block;");
    addCompare.classList.add('button');
	btnsContainer.appendChild(addCompare);
var removeCompare = document.createElement('div');
    removeCompare.innerHTML = ("Отключить сравнение");
    addInfo.classList.add('button');
    removeCompare.setAttribute("style", "margin-left: 8px; width: 125px; font: bold 1em Arial, Sans-serif;font-weight: bold;border: 1px solid #ccc;background: #F0F0F0;padding: 3px 5px;color: #4284B0;cursor: pointer; display: inline-block;");
    removeCompare.classList.add('button');
	btnsContainer.appendChild(removeCompare);


addInfo.addEventListener("click", getLinksParam, false);
addCompare.addEventListener("click", getCompare, false);
removeCompare.addEventListener("click", defaultCompare, false);

})();