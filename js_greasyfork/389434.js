// ==UserScript==
// @name         AutoCompare w/o highlight SLT
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  try to take over the world!
// @author       You
// @match        https://cms.sletat.ru/LinkHotels*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/389434/AutoCompare%20wo%20highlight%20SLT.user.js
// @updateURL https://update.greasyfork.org/scripts/389434/AutoCompare%20wo%20highlight%20SLT.meta.js
// ==/UserScript==


(function() {
    'use strict';


var delayListOpen = 600;

function getCompare() {
    /*
	var str = document.querySelector("#linkHead").innerText.replace('[', '');
	for (var count = 0; count < 4; count++){
		str = str.replace(' [', '');
	}
	var arr = str.split(']', 5);
// delete * and category
	arr[0] = arr[0].replace(/\d\*\s/,'');

	var hotel = document.querySelectorAll("#SLT_container > div.SLT_queryresult td.SLT_col0");
	for (var i = 0; i < hotel.length; i++){
		if (hotel[i].innerText.toLowerCase().indexOf(arr[0].toLowerCase()) >= 0) {
			hotel[i].style.color='green';
		}
	}
//delete 'hotel'
	arr[0] = arr[0].toLowerCase();
	arr[0] = arr[0].replace(' hotel','');
	arr[0] = arr[0].replace('hotel ','');
//other filters
    arr[0] = arr[0].replace(' (aj)','');
    arr[0] = arr[0].replace(' (e)','');
    arr[0] = arr[0].replace(' (e2)','');
    arr[0] = arr[0].replace(' spo','');


    arr[2] = arr[2].replace('.Другие районы','');
    arr[2] = arr[2].replace(' (Регион)','');
// сравнение и закркаска
	for (var i = 0; i < hotel.length; i++){
		if (hotel[i].innerText.toLowerCase().indexOf(arr[0]) >= 0) {
			hotel[i].style.color='green';
		}
        if (hotel[i].innerText.indexOf('Экскурсионная программа') >= 0) {
			hotel[i].style.color='#cd18ef';
		}
	}
//end delete filters
	var star = document.querySelectorAll("#SLT_container > div.SLT_queryresult td.SLT_col2");
	for (var i = 0; i < star.length; i++){
		if (star[i].innerText == arr[1]) {
			star[i].style.color='green';
		}
	}

	var town = document.querySelectorAll("#SLT_container > div.SLT_queryresult td.SLT_col3");
	for (var i = 0; i < town.length; i++){
		if (town[i].innerText.toLowerCase().indexOf(arr[2].toLowerCase()) >= 0) {
			town[i].style.color='green';
		}
	}*/
}
window.onkeydown = getChange;
function getChange(event) {
		if (event.keyCode === 13 ) {
			setTimeout(restartDelay, 200);
		}
	}
function attrChekBoxes() {
	var getChekBoxes = document.querySelectorAll("#SLT_container > div.SLT_queryresult > div > table > tbody .SLT_treechild > td.SLT_col0 > a");
		for (var i = 0; i < getChekBoxes.length; i++){
			getChekBoxes[i].addEventListener ("click", getCompareDelay, false);
		}
	}
attrChekBoxes();

function attrLinkBtn() {
			document.querySelector("#submitter").addEventListener ("click", restartDelay, false);
			document.querySelector("#imgCancelChanges").addEventListener ("click", restartDelay, false);
			document.querySelector("#SLT_container > div.SLT_querycontrol > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type=button]:nth-child(1)").addEventListener ("click", restartDelay, false);
			document.querySelector("#SLT_container > div.SLT_querycontrol > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type=button]:nth-child(2)").addEventListener ("click", restartDelay, false);
			document.querySelector("#SLT_container > div.SLT_querycontrol > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type=button]:nth-child(3)").addEventListener ("click", restartDelay, false);
	}
attrLinkBtn();
//getCompare();

function restartDelay() {
    var searchResults = document.querySelector("#SLT_container > div.SLT_queryresult > div.SLT_hotelsList");
    if(!searchResults) return setTimeout(restartDelay, 200);
    setTimeout(getCompare, 100);
    setTimeout(attrLinkBtn, 100);
    setTimeout(attrChekBoxes, 100);
    setTimeout(initCheckBoxes, 100);
    setTimeout(toLink, 100);
    //setTimeout(descriptionFix, 100);
    setTimeout(fixColumns, 100);

	}
function getCompareDelay() {
    setTimeout(getCompare, delayListOpen);
    //setTimeout(descriptionFix, delayListOpen);
	}


//selected rows
function initCheckBoxes() {
    var checkBoxes = document.querySelectorAll(".SLT_nolinkshotel > .SLT_col0:nth-child(1)")
    for (var i = 0; i < checkBoxes.length; i++) {
        checkBoxes[i].children[0].addEventListener("click", changeBgColor, false);
       // checkBoxes[i].children[1].addEventListener("click", changeBgColor, false);
    }
}
function changeBgColor() {
    var row = this.parentElement.parentElement;
		if (row.classList[1] == "checked") {
			row.setAttribute("style", "background-color: none;");
			row.classList.remove("checked")
		} else if (row.classList[1] !== "checked") {
			row.setAttribute("style", "background-color: #86ff8680");
			row.classList.add("checked");
		}
}

function toLink() {
    var hotelRows = document.querySelectorAll("#SLT_container > div.SLT_queryresult > div > table > tbody .SLT_nolinkshotel");
    for (var i = 0; i < hotelRows.length; i++) {
        var hotelName = hotelRows[i].children[0].innerText;
        hotelName = hotelName.replace(':','');
        hotelName = hotelName.replace('"','');
        hotelName = hotelName.replace('"','');
        hotelName = hotelName.replace('&','%26');
        hotelName = hotelName.replace('&','%26');
        hotelRows[i].children[6].innerHTML = '<a href="https://www.google.com/search?q=' + hotelName + " " + hotelRows[i].children[5].innerText + " " + hotelRows[i].children[6].innerText + '" target="_blank">' + hotelRows[i].children[6].innerHTML  + '</a>';
        hotelRows[i].children[6].children[0].setAttribute("style", "text-decoration: none; color: #666666;")
    }
}

function fixColumns() {
var expandList = document.querySelectorAll("#SLT_container table.maintable tr.SLT_expandblock");
for (var i = 0; i < expandList.length; i++) {
expandList[i].firstElementChild.setAttribute('colspan', 7);}
}


function fixColumnsWidth() {
       SLT_Hotels.options.tpl_rootnode.template[16] = '<td class="SLT_col0">';
SLT_Hotels.options.tpl_rootnode.template[19] = '<td class="SLT_col2"> <a class="SLT_hotelurl" href="HotelCard.aspx?hotel=';
SLT_Hotels.options.tpl_childnode.template[6] = '<td class="SLT_col0">';
SLT_Hotels.options.tpl_rootnochild.template[19] = '<td class="SLT_col0">';
//SLT_Hotels.options.tpl_rootnochild.template[22] = '<td class="SLT_col2"> </td><td class="SLT_col1">';
    document.querySelector("#SLT_container").style.width = '1300px';
    document.querySelector("#SLT_containerhead").style.width = '1320px';
}
fixColumnsWidth();

})();