// ==UserScript==
// @name        MUT My Items
// @description MUT My Items imports your Madden Ultimate Team items into maddenultimate.com.
// @namespace   maddenultimate.com
// @include     http://maddenultimate.com/cards/myitems.php
// @include     http://maddenultimate.com/cards/mutsearch.php*
// @version     1
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/14163/MUT%20My%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/14163/MUT%20My%20Items.meta.js
// ==/UserScript==

Function.prototype.bind = function( thisObject ) {
  var method = this;
  var oldargs = [].slice.call( arguments, 1 );
  return function () {
    var newargs = [].slice.call( arguments );
    return method.apply( thisObject, oldargs.concat( newargs ));
  };
}


var HIDDEN_DIV_ID = 'myItems';

var thisURL = document.URL;


//sortTables start
function sortTables() {
	if (!document.getElementsByTagName) return;
   var tbls = document.getElementsByTagName("table");
   	
   for (var ti=0;ti<tbls.length;ti++) {
       var thisTbl = tbls[ti];
       
       // The following line is from the original sorttable.js
	   // Any table to sort must have a class="sortable" and an unique ID
	   if (((' '+thisTbl.className+' ').indexOf("sortable") != -1) && (thisTbl.id)) {
	   ts_makeSortable(thisTbl);
	   }
   }
}

function ts_makeSortable (table) {

	
    if (table.rows && table.rows.length > 0) {
        var firstRow = table.rows[0];
    }
    if (!firstRow) return;
    
    // We have a first row: assume it's the header, and make its contents clickable links
    for (var i=0;i<firstRow.cells.length;i++) {
        var cell = firstRow.cells[i];
		var txt = ts_getInnerText(cell);
		
		// From here on slight modifications to the original
		// "onclick" won't work with Greasemonkey.
		// The number of the column is safed as a custom attribute for later reference when calling the ts_resortTabel function.
        cell.innerHTML = '<a href="javascript:void(0);" style="color: white;" class="sortheader" column="'+i+'">'+txt+'<span class="sortarrow"></span></a>';
		// Get link as object and addEventListener
		elmLinks = cell.getElementsByTagName("a")
		elmLinks[0].addEventListener(
		'click', 
		function(event){
			var lnk = event.target
			var  col = lnk.getAttribute('column')
			ts_resortTable(lnk, col)		// the call to the original function
			}, 
		false)
    }
}

// The rest has been left unchanged

function ts_getInnerText(el) {
	if (typeof el == "string") return el;
	if (typeof el == "undefined") { return el };
	if (el.innerText) return el.innerText;	//Not needed but it is faster
	var str = "";
	
	var cs = el.childNodes;
	var l = cs.length;
	for (var i = 0; i < l; i++) {
		switch (cs[i].nodeType) {
			case 1: //ELEMENT_NODE
				str += ts_getInnerText(cs[i]);
				break;
			case 3:	//TEXT_NODE
				str += cs[i].nodeValue;
				break;
		}
	}
	return str;
}

function ts_resortTable(lnk) {
    // get the span
    var span;

    for (var ci=0;ci<lnk.childNodes.length;ci++) {
        if (lnk.childNodes[ci].tagName && lnk.childNodes[ci].tagName.toLowerCase() == 'span') span = lnk.childNodes[ci];
    }
    var spantext =  ts_getInnerText(span);
    var td = lnk.parentNode;
    var column = td.cellIndex;
    var table =  getParent(td,'TABLE');

    // Work out a type for the column
    if (table.rows.length <= 1) return;
    var itm = ts_getInnerText(table.rows[1].cells[column]);
    sortfn = ts_sort_caseinsensitive;
    if (itm.match(/^\d\d[\/-]\d\d[\/-]\d\d\d\d$/)) sortfn = ts_sort_date;
    if (itm.match(/^\d\d[\/-]\d\d[\/-]\d\d$/)) sortfn = ts_sort_date;
    if (itm.match(/^[$]/)) sortfn = ts_sort_currency;
    if (itm.match(/^[\d\.]+$/)) sortfn = ts_sort_numeric;
    SORT_COLUMN_INDEX = column;
    var firstRow = new Array();
    var newRows = new Array();
   
    for (i=0;i<table.rows[0].length;i++) { firstRow[i] = table.rows[0][i]; }
    for (j=1;j<table.rows.length;j++) { newRows[j-1] = table.rows[j]; }

    newRows.sort(sortfn);

    if (span.getAttribute("sortdir") == 'up') {
        ARROW = '&darr;';
	span.setAttribute('sortdir','down');
    } else {
        ARROW = '&uarr;';
        newRows.reverse();
        span.setAttribute('sortdir','up');
    }    
    
    // We appendChild rows that already exist to the tbody, so it moves them rather than creating new ones
    // don't do sortbottom rows

	    for (i=0;i<newRows.length;i++) { 
		    if (!newRows[i].className || (newRows[i].className && (newRows[i].className.indexOf('sortbottom') == -1))){ 
			    if(newRows[i].innerHTML.indexOf('TOTALS') == -1){

			    	table.tBodies[0].appendChild(newRows[i]);

			    }
		    }
	    }

	    for (i=0;i<newRows.length;i++) { 
		  
			    if(newRows[i].innerHTML.indexOf('TOTALS') != -1){

			    	table.tBodies[0].appendChild(newRows[i]);

			    }
		
	    }

    // do sortbottom rows only
    //for (i=0;i<newRows.length;i++) { if (newRows[i].className && (newRows[i].className.indexOf('sortbottom') != -1)) table.tBodies[0].appendChild(newRows[i]);}
    
    // Delete any other arrows there may be showing
    var allspans = document.getElementsByTagName("span");
    for (var ci=0;ci<allspans.length;ci++) {
        if (allspans[ci].className == 'sortarrow') {
            if ( getParent(allspans[ci],"table") ==  getParent(lnk,"table")) { // in the same table as us?
                allspans[ci].innerHTML = '';
		//allspans[ci].innerHTML = '&nbsp;&nbsp;&nbsp;';
            }
        }
    }
        
    span.innerHTML = ARROW;
}

function getParent (el, pTagName) {
	if (el == null) return null;
	else if (el.nodeType == 1 && el.tagName.toLowerCase() == pTagName.toLowerCase())	// Gecko bug, supposed to be uppercase
		return el;
	else
		return  getParent(el.parentNode, pTagName);
}
function ts_sort_date(a,b) {
    // y2k notes: two digit years less than 50 are treated as 20XX, greater than 50 are treated as 19XX
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]);
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]);
    if (aa.length == 10) {
        dt1 = aa.substr(6,4)+aa.substr(3,2)+aa.substr(0,2);
    } else {
        yr = aa.substr(6,2);
        if (parseInt(yr) < 50) { yr = '20'+yr; } else { yr = '19'+yr; }
        dt1 = yr+aa.substr(3,2)+aa.substr(0,2);
    }
    if (bb.length == 10) {
        dt2 = bb.substr(6,4)+bb.substr(3,2)+bb.substr(0,2);
    } else {
        yr = bb.substr(6,2);
        if (parseInt(yr) < 50) { yr = '20'+yr; } else { yr = '19'+yr; }
        dt2 = yr+bb.substr(3,2)+bb.substr(0,2);
    }
    if (dt1==dt2) return 0;
    if (dt1<dt2) return -1;
    return 1;
}

function ts_sort_currency(a,b) { 
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]).replace(/[^0-9.]/g,'');
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]).replace(/[^0-9.]/g,'');
    return parseFloat(aa) - parseFloat(bb);
}



function ts_sort_numeric(a,b) { 
    aa = parseFloat(ts_getInnerText(a.cells[SORT_COLUMN_INDEX]));
    if (isNaN(aa)) aa = 0;
    bb = parseFloat(ts_getInnerText(b.cells[SORT_COLUMN_INDEX])); 
    if (isNaN(bb)) bb = 0;
    return aa-bb;
}

function ts_sort_caseinsensitive(a,b) {
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]).toLowerCase();
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]).toLowerCase();
    if (aa==bb) return 0;
    if (aa<bb) return -1;
    return 1;
}


function ts_sort_default(a,b) {
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]);
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]);
    if (aa==bb) return 0;
    if (aa<bb) return -1;
    return 1;
}


function addEvent(elm, evType, fn, useCapture)
// addEvent and removeEvent
// cross-browser event handling for IE5+,  NS6 and Mozilla
{
  if (elm.addEventListener){
    elm.addEventListener(evType, fn, useCapture);
    return true;
  } else if (elm.attachEvent){
    var r = elm.attachEvent("on"+evType, fn);
    return r;
  } else {
    alert("Handler could not be removed");
  }
} 

//end 


var tick = 'data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%A0IDATx%9Cc%60%18%05%24%81%DC%3E%F5%FF%B9%7D%EA%FF%C9%D6%FC%FE%FF%FE%FF%EF%FF%EFG1%84%85X%CDuy%FD%0C%F7~v%93%EE%CC%DC%3E%F5%FFO%7F%AC%FC%BF%E7%AD%E6%FF%3Do51%BC%C0%82%AE%B9%28%AD%0C%CA%EB%FA%CF%C0%C0%C0P%94V%C6p%E2u2%03%03%03%03%C3%81%D5%D2%0C%93%8Bn2%E24%80%81%81%01%AE8%3Fe%06%0A%FF%D8zu%0C%CD%0C%0C%0C%0C%18%02%B9%7D%EA%FF%03%12XQ%C46%2C%F8%8DU3N%90%DB%A7%FE%FF%C6%FF%C4%FF7%FE%27R%16mdk%1EZ%00%00%E5%A2RXz%E3%15z%00%00%00%00IEND%AEB%60%82';

if(thisURL.indexOf('mutsearch.php') != -1){

	var playerString = GM_getValue('playerString','');
	var playerStringArray = playerString.split('*');

	var playerID;
	var players;
	var player =  document.evaluate("//a/@href[contains(string(),'cardimage')]",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	var playerRows =  document.evaluate("//tr[@class='altrow']/td[1]|//tr[@class='text10']/td[1]",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);


	for (var i = 0; i < player.snapshotLength; i++) {

		var myIMG = document.createElement('td');
		

		players = player.snapshotItem(i);

		playerID = players.textContent.substring(players.textContent.indexOf('cardimage/') + 10, players.textContent.indexOf('\',%20'));


		for (var j = 0; j < playerStringArray.length; j++) {

			var playerStringArrayRecord = playerStringArray[j].split(',');

			if(playerStringArrayRecord[58] == playerID){

				myIMG.innerHTML = playerRows.snapshotItem(i).innerHTML + '<img src="' + tick + '">';
				playerRowsHTML = myIMG + playerRows.snapshotItem(i).innerHTML; 	
				playerRows.snapshotItem(i).parentNode.replaceChild(myIMG,playerRows.snapshotItem(i));

			}

		}


	}

}

if(thisURL == 'http://maddenultimate.com/cards/myitems.php'){

	var tierOptionArray = new Array();
	var teamArray = new Array();
	var positionArray = new Array();
	var ratingArray = new Array();
	var programArray = new Array();

	var searchMenu =  document.evaluate("//div[@id='search menu']",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	searchMenu = searchMenu.snapshotItem(0);
	searchMenu.setAttribute('style','display: inline;');

	var tableStart =  document.evaluate("//table[@name='myitems']",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	tableStart = tableStart.snapshotItem(0);

	var tierOption;
	var tierOptions =  document.evaluate("//select[@name='Tier']/option/@value",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);	

	for (var i = 0; i < tierOptions.snapshotLength; i++) {

		var tierOption = tierOptions.snapshotItem(i);

		tierOptionArray.push(tierOption.textContent);			

	}

	var team;
	var teams =  document.evaluate("//select[@name='Team']/option/@value",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	for (var i = 0; i < teams.snapshotLength; i++) {

		var team = teams.snapshotItem(i);

		
		teamArray.push(team.textContent);
	}

	var position;
	var positions =  document.evaluate("//select[@name='Position']/option/@value",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	for (var i = 0; i < positions.snapshotLength; i++) {

		var position = positions.snapshotItem(i);
		
		positionArray.push(position.textContent);
	}

	var rating;
	var ratings =  document.evaluate("//select[@name='Rating']/option/@value",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	for (var i = 0; i < ratings.snapshotLength; i++) {

		var rating = ratings.snapshotItem(i);
		
		ratingArray.push(rating.textContent);
	}

	var program;
	var programs =  document.evaluate("//select[@name='Program']/option/@value",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	for (var i = 0; i < programs.snapshotLength; i++) {

		var program = programs.snapshotItem(i);
		
		programArray.push(program.textContent);
	}

	var myTable = document.createElement('table');

	myTable.setAttribute('width', '850');
	myTable.setAttribute('cellspacing', '0');
	myTable.setAttribute('cellpadding', '3');
	myTable.setAttribute('border', '0');
	myTable.setAttribute('align', 'center');
	myTable.setAttribute('class', 'sortable');
	myTable.setAttribute('id', '113');

	var myTable2 = document.createElement('table');

	myTable2.setAttribute('width', '850');
	myTable2.setAttribute('cellspacing', '0');
	myTable2.setAttribute('cellpadding', '3');
	myTable2.setAttribute('border', '0');
	myTable2.setAttribute('align', 'center');


	var playerString = GM_getValue('playerString','');
	var pricing = GM_getValue('gmPricing','');

	myPlatform = GM_getValue('platform','');
	myPlatform = myPlatform.toUpperCase(); 
	myCoins = GM_getValue('coins','');
	myGamerTag = GM_getValue('gamerTag','');
	myGamerTag = myGamerTag.toUpperCase(); 

	var noResults = GM_getValue('noResults','');
	GM_setValue('noResults','');

	var playerStringArray = playerString.split('*');

	playerStringArray = playerStringArray.sort(sortNumber);

	var pricingArray = pricing.split('*');

	var myPrices = '';

	if(noResults == 'No Results Found'){

		var myHTML2 = '<tr class="title" align="center"><td colspan="10">No Results Found</td></tr><tr class="title"><td colspan="10">' + myGamerTag + ' (' + myPlatform + ') ' + 'Coins: ' + myCoins +'</td></tr>';

		var myHTML = '<tr class="alttitle"><td width="200">Name</td><td>Team</td><td>Tier</td><td>OVR</td><td>Position</td><td>Price</td></tr>';

	}
	else
	{


		var myHTML2 = '<tr class="title"><td colspan="10">' + myGamerTag + ' (' + myPlatform + ') ' + 'Coins: ' + myCoins +'</td></tr>';
		var myHTML = '<tr class="alttitle"><td width="200">Name</td><td>Team</td><td>Tier</td><td>OVR</td><td>Position</td><td>Price</td></tr>';		

	}


	var myClass;
	var myStyle;

	for (var i=0;i < playerStringArray.length-1;i++){

		if(i % 2 == 0)
		{

			myClass = 'text10';

		}
		else
		{

			myClass = 'altrow';

		}

		var playerStringArrayRecord = playerStringArray[i].split(',');		

		switch(playerStringArrayRecord[5]) {
		    case 'Gold':
		        myStyle = 'style=\"color:#DAA520;\"'
		        break;
		    case 'Silver':
		        myStyle = 'style=\"color:#606060;\"'
		        break;
		    case 'Bronze':
		        myStyle = 'style=\"color:#A52A2A;\"'
		        break;
		    case 'Elite':
		        myStyle = 'style=\"color:#D63839;\"'
		        break;			
		} 
		

			myHTML = myHTML + '<tr class="' + myClass + '" nowrap="">' + '<td><a href="javascript:openWindow(\'/cards/cardimage/' + playerStringArrayRecord[58] + '\',%20\'_blank\',%20330,%20400,%20\'scrollbars=no\')">' + playerStringArrayRecord[0] + ' ' + playerStringArrayRecord[1] + '</a></td><td nowrap="">' + playerStringArrayRecord[2] + '</td><td ' + myStyle + ' nowrap="">' + playerStringArrayRecord[5] + '</td><td>' + playerStringArrayRecord[4] + '</td><td nowrap="">' + playerStringArrayRecord[3] + '</td><td nowrap="">';


		for (var j=0;j < pricingArray.length;j++){

			var pricingArrayRecord = pricingArray[j].split('|');			


			if(pricingArrayRecord[0] == playerStringArrayRecord[58]){


				myHTML = myHTML + pricingArrayRecord[1] + '</td></tr>';


			}

		}

		if(myPrices = ''){

			myPrices = '</td></tr>';

		}

		myHTML = myHTML + myPrices;

	}

	myTable2.innerHTML = myHTML2;
	myTable.innerHTML = myHTML;

	if(playerString != ''){

		tableStart.parentNode.insertBefore(myTable2,tableStart);
		tableStart.parentNode.replaceChild(myTable,tableStart);

	}

	sortTables();


}//if(thisURL == 'http://maddenultimate.com/cards/myitems.php')


function checkLogin(){

	GM_xmlhttpRequest({
	    method: 'GET',
	    url: 'http://www.easports.com/madden-nfl/ultimate-team/web-app/data/1/check_login' ,
	    headers: {
	        'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
	        'Accept': 'application/atom+xml,application/xml,text/xml',
	    },
	    onload:function(details) {
	           var s2 = new String(details.responseText);
		   var document = appendToDocument(s2);
		   s2 = s2.replace(/\r\n/g,'');

		if(s2 == '{"isLoggedIn":true}'){

			GM_setValue('playerString','');
			GM_setValue('gmPricing','');

			myTable.innerHTML = '';
			myTable2.innerHTML = '';
			document.body.style.cursor = "wait";
			setTimeout( callSecondGM_xmlhttpRequest, 1);

		}
		else
		{
			
			alert('Please connect to Madden Ultimate Team first.');

		}		
	
	    }
	});

}

var persona;
var platform;
var coins;
var gamerTag;
var eaIDArray = new Array();

function callSecondGM_xmlhttpRequest(){

	GM_xmlhttpRequest({
	    method: 'GET',
	    url: 'http://www.easports.com/madden-nfl/ultimate-team/web-app/data/1/user_info?' + new Date().getTime() ,
	    headers: {
	        'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
	        'Accept': 'application/atom+xml,application/xml,text/xml',
	    },
	    onload:function(details) {
	           var s2 = new String(details.responseText);
		   var document = appendToDocument(s2);
		   s2 = s2.replace(/\r\n/g,'');
		   	
	persona = s2.substring(s2.indexOf('personas":[{"id":') + 17, s2.indexOf(',"name'));
	platform = s2.substring(s2.indexOf('platform":"') + 11, s2.indexOf('","isSelected'));
	coins = s2.substring(s2.indexOf('coins":') + 7, s2.indexOf(',"teamInfo'));
	gamerTag = s2.substring(s2.indexOf('name":"') + 7, s2.indexOf('","platform'));

	GM_setValue('platform',platform);
	GM_setValue('coins',coins);
	GM_setValue('gamerTag',gamerTag);


	setTimeout( callThirdGM_xmlhttpRequest, 1);
	

 	   }
	});




}


function callThirdGM_xmlhttpRequest(){

	var j = 0;

	for (var i=1;i < 40;i++){

		j = 1+i;

  				GM_xmlhttpRequest({
				      method: 'GET',
		      		url: 'http://www.easports.com/madden-nfl/ultimate-team/web-app/data/1/cards/player/' + i + '?sort=ovr&asc=0&state=owned&persona=' + persona,
			      	headers: {
			        	  'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
				          'Accept': 'application/atom+xml,application/xml,text/xml',
				      },
				      onload:callback_function2.bind( {}, i, j )
				  });		

	}	


}

function callFourthGM_xmlhttpRequest(){

	var j = 0;


	for (var i=0;i < eaIDArray.length;i++){	

		j = 1+i;

  				GM_xmlhttpRequest({
				      method: 'GET',
		      		url: 'http://www.easports.com/madden-nfl/ultimate-team/web-app/data/1/auctions/' + eaIDArray[i],
			      	headers: {
			        	  'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
				          'Accept': 'application/atom+xml,application/xml,text/xml',
				      },
				      onload:callback_function3.bind( {}, i, j )
				  });		


	}


}


var pricing = '';


var callback_function2_count = 0;

var getMyItemsButton =  document.evaluate("//input[@id='getmyitems']",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
getMyItemsButton = getMyItemsButton.snapshotItem(0);

progressDiv = document.createElement("div");
progressDiv.setAttribute('class','text12');


function callback_function2(parameter1, parameter2, responseDetails){


	var currentPCT = callback_function2_count/76 * 100;
	currentPCT = Math.round(currentPCT);

	if(currentPCT > 100){

		currentPCT = 100;

	}

	progressDiv.innerHTML = currentPCT + '%';

	if(callback_function2_count == 0){

		getMyItemsButton.parentNode.replaceChild(progressDiv,getMyItemsButton);

	}


	callback_function2_count++;

	console.log(callback_function2_count);

	var data;

	data = responseDetails.responseText;

	var recordsArray = data.split("}}");
	var recordsArrayLength = recordsArray.length;	

	playerString = '';

	for (var i=0;i < recordsArrayLength-1;i++){	

var acc = undefined;
var age = undefined;
var agi = undefined;
var awr = undefined;
var bcv = undefined;
var bshd = undefined;
var cary = undefined;
var cint = undefined;
var ctch = undefined;
var elus = undefined;
var fmov = undefined;
var ht = undefined;
var hp = undefined;
var age = undefined;
var impb = undefined;
var inj = undefined;
var jerseyNumber = undefined;
var jkm = undefined;
var jmp = undefined;
var kacc = undefined;
var kpow = undefined;
var mcov = undefined;
var pac = undefined;
var pbft = undefined;
var pbk = undefined;
var pbst = undefined;
var pmov = undefined;
var prec = undefined;
var pres = undefined;
var pur = undefined;
var rbft = undefined;
var rbk = undefined;
var rbst = undefined;
var ret = undefined;
var rls = undefined;
var rrun = undefined;
var scat = undefined;
var sfa = undefined;
var spd = undefined;
var spm = undefined;
var sta = undefined;
var str = undefined;
var tckl = undefined;
var tdep = undefined;
var tgh = undefined;
var tacc = undefined;
var tmid = undefined;
var tpow = undefined;
var trck = undefined;
var tsht = undefined;
var weight = undefined;
var zcov = undefined;
var ovr = undefined;
var eaid = undefined;
var category = undefined;
var tier = undefined;
var type = undefined;
var cardImageUrl2 = undefined;
var dupImage = undefined;
var description = undefined;
var longDescription = undefined;
var program = undefined;
var position = undefined;
var chemistry = undefined;
var firstName = undefined;
var lastName = undefined;
var team = undefined;
var isLight = undefined;
var label = undefined;
var officialType = undefined;
var uniformName = undefined;
var stadiumID = undefined;
var coachID = undefined;
var chm = undefined;
var def = undefined;
var kno = undefined;
var mot = undefined;
var off = undefined;
var wor = undefined;
var playbookID = undefined;
var isOffensive = undefined;
var id = undefined;

	

	if(recordsArray[i].indexOf('"acc":') != -1){

		var acc = recordsArray[i].substring(recordsArray[i].indexOf('"acc":')+6,recordsArray[i].indexOf('"acc":')+8);
		acc = acc.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('"age":') != -1){

		var age = recordsArray[i].substring(recordsArray[i].indexOf('"age":')+6,recordsArray[i].indexOf('"age":')+8);
		age = age.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('agi":') != -1){

		var agi = recordsArray[i].substring(recordsArray[i].indexOf('agi":')+5,recordsArray[i].indexOf('agi":')+7);
		agi = agi.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('awr":') != -1){

		var awr = recordsArray[i].substring(recordsArray[i].indexOf('awr":')+5,recordsArray[i].indexOf('awr":')+7);
		awr = awr.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('bcv":') != -1){

		var bcv = recordsArray[i].substring(recordsArray[i].indexOf('bcv":')+5,recordsArray[i].indexOf('bcv":')+7);
		bcv = bcv.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('bshd":') != -1){

		var bshd = recordsArray[i].substring(recordsArray[i].indexOf('bshd":')+6,recordsArray[i].indexOf('bshd":')+8);
		bshd = bshd.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('cary":') != -1){

		var cary = recordsArray[i].substring(recordsArray[i].indexOf('cary":')+6,recordsArray[i].indexOf('cary":')+8);
		cary = cary.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('cint":') != -1){

		var cint = recordsArray[i].substring(recordsArray[i].indexOf('cint":')+6,recordsArray[i].indexOf('cint":')+8);
		cint = cint.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('ctch":') != -1){

		var ctch = recordsArray[i].substring(recordsArray[i].indexOf('ctch":')+6,recordsArray[i].indexOf('ctch":')+8);
		ctch = ctch.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('elus":') != -1){

		var elus = recordsArray[i].substring(recordsArray[i].indexOf('elus":')+6,recordsArray[i].indexOf('elus":')+8);
		elus = elus.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('fmov":') != -1){

		var fmov = recordsArray[i].substring(recordsArray[i].indexOf('fmov":')+6,recordsArray[i].indexOf('fmov":')+8);
		fmov = fmov.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('"ht":"') != -1){

		var ht = recordsArray[i].substring(recordsArray[i].indexOf('"ht":"')+6,recordsArray[i].indexOf('\\"","hp":'));

	}

	if(recordsArray[i].indexOf('hp":') != -1){

		var hp = recordsArray[i].substring(recordsArray[i].indexOf('hp":')+4,recordsArray[i].indexOf('hp":')+6);
		hp = hp.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('impb":') != -1){

		var impb = recordsArray[i].substring(recordsArray[i].indexOf('impb":')+6,recordsArray[i].indexOf('impb":')+8);
		impb = impb.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('inj":') != -1){

		var inj = recordsArray[i].substring(recordsArray[i].indexOf('inj":')+5,recordsArray[i].indexOf('inj":')+7);
		inj = inj.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('jerseyNumber":') != -1){

		var jerseyNumber = recordsArray[i].substring(recordsArray[i].indexOf('jerseyNumber":')+14,recordsArray[i].indexOf(',"jkm":'));
		jerseyNumber = jerseyNumber.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('jkm":') != -1){

		var jkm = recordsArray[i].substring(recordsArray[i].indexOf('jkm":')+5,recordsArray[i].indexOf('jkm":')+7);	
		jkm = jkm.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('jmp":') != -1){

		var jmp = recordsArray[i].substring(recordsArray[i].indexOf('jmp":')+5,recordsArray[i].indexOf('jmp":')+7);
		jmp = jmp.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('kacc":') != -1){

		var kacc = recordsArray[i].substring(recordsArray[i].indexOf('kacc":')+6,recordsArray[i].indexOf('kacc":')+8);	
		kacc = kacc.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('kpow":') != -1){

		var kpow = recordsArray[i].substring(recordsArray[i].indexOf('kpow":')+6,recordsArray[i].indexOf('kpow":')+8);
		kpow = kpow.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('mcov":') != -1){

		var mcov = recordsArray[i].substring(recordsArray[i].indexOf('mcov":')+6,recordsArray[i].indexOf('mcov":')+8);
		mcov = mcov.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('pac":') != -1){

		var pac = recordsArray[i].substring(recordsArray[i].indexOf('pac":')+5,recordsArray[i].indexOf('pac":')+7);
		pac = pac.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('pbft":') != -1){

		var pbft = recordsArray[i].substring(recordsArray[i].indexOf('pbft":')+6,recordsArray[i].indexOf('pbft":')+8);	
		pbft = pbft.replace(/,/,'');	

	}

	if(recordsArray[i].indexOf('pbk":') != -1){

		var pbk = recordsArray[i].substring(recordsArray[i].indexOf('pbk":')+5,recordsArray[i].indexOf('pbk":')+7);	
		pbk = pbk.replace(/,/,'');
	
	}

	if(recordsArray[i].indexOf('pbst":') != -1){

		var pbst = recordsArray[i].substring(recordsArray[i].indexOf('pbst":')+6,recordsArray[i].indexOf('pbst":')+8);
		pbst = pbst.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('pmov":') != -1){

		var pmov = recordsArray[i].substring(recordsArray[i].indexOf('pmov":')+6,recordsArray[i].indexOf('pmov":')+8);
		pmov = pmov.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('prec":') != -1){

		var prec = recordsArray[i].substring(recordsArray[i].indexOf('prec":')+6,recordsArray[i].indexOf('prec":')+8);
		prec = prec.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('pres":') != -1){

		var pres = recordsArray[i].substring(recordsArray[i].indexOf('pres":')+6,recordsArray[i].indexOf('pres":')+8);
		pres = pres.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('pur":') != -1){

		var pur = recordsArray[i].substring(recordsArray[i].indexOf('pur":')+5,recordsArray[i].indexOf('pur":')+7);
		pur = pur.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('rbft":') != -1){

		var rbft = recordsArray[i].substring(recordsArray[i].indexOf('rbft":')+6,recordsArray[i].indexOf('rbft":')+8);
		rbft = rbft.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('rbk":') != -1){

		var rbk = recordsArray[i].substring(recordsArray[i].indexOf('rbk":')+5,recordsArray[i].indexOf('rbk":')+7);
		rbk = rbk.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('rbst":') != -1){

		var rbst = recordsArray[i].substring(recordsArray[i].indexOf('rbst":')+6,recordsArray[i].indexOf('rbst":')+8);
		rbst = rbst.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('ret":') != -1){

		var ret = recordsArray[i].substring(recordsArray[i].indexOf('ret":')+5,recordsArray[i].indexOf('ret":')+7);
		ret = ret.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('rls":') != -1){

		var rls = recordsArray[i].substring(recordsArray[i].indexOf('rls":')+5,recordsArray[i].indexOf('rls":')+7);
		rls = rls.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('rrun":') != -1){

		var rrun = recordsArray[i].substring(recordsArray[i].indexOf('rrun":')+6,recordsArray[i].indexOf('rrun":')+8);
		rrun = rrun.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('scat":') != -1){

		var scat = recordsArray[i].substring(recordsArray[i].indexOf('scat":')+6,recordsArray[i].indexOf('scat":')+8);
		scat = scat.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('sfa":') != -1){

		var sfa = recordsArray[i].substring(recordsArray[i].indexOf('sfa":')+5,recordsArray[i].indexOf('sfa":')+7);
		sfa = sfa.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('spd":') != -1){

		var spd = recordsArray[i].substring(recordsArray[i].indexOf('spd":')+5,recordsArray[i].indexOf('spd":')+7);
		spd = spd.replace(/,/,'');

	} 

	if(recordsArray[i].indexOf('spm":') != -1){

		var spm = recordsArray[i].substring(recordsArray[i].indexOf('spm":')+5,recordsArray[i].indexOf('spm":')+7);
		spm = spm.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('sta":') != -1){

		var sta = recordsArray[i].substring(recordsArray[i].indexOf('sta":')+5,recordsArray[i].indexOf('sta":')+7);
		sta = sta.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('str":') != -1){

		var str = recordsArray[i].substring(recordsArray[i].indexOf('str":')+5,recordsArray[i].indexOf('str":')+7);
		str = str.replace(/,/,'');

	} 

	if(recordsArray[i].indexOf('tckl":') != -1){

		var tckl = recordsArray[i].substring(recordsArray[i].indexOf('tckl":')+6,recordsArray[i].indexOf('tckl":')+8);
		tckl = tckl.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('tdep":') != -1){

		var tdep = recordsArray[i].substring(recordsArray[i].indexOf('tdep":')+6,recordsArray[i].indexOf('tdep":')+8);
		tdep = tdep.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('tgh":') != -1){

		var tgh = recordsArray[i].substring(recordsArray[i].indexOf('tgh":')+5,recordsArray[i].indexOf('tgh":')+7);
		tgh = tgh.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('tacc":') != -1){

		var tacc = recordsArray[i].substring(recordsArray[i].indexOf('tacc":')+6,recordsArray[i].indexOf('tacc":')+8);
		tacc = tacc.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('tmid":') != -1){

		var tmid = recordsArray[i].substring(recordsArray[i].indexOf('tmid":')+6,recordsArray[i].indexOf('tmid":')+8);
		tmid = tmid.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('tpow":') != -1){

		var tpow = recordsArray[i].substring(recordsArray[i].indexOf('tpow":')+6,recordsArray[i].indexOf('tpow":')+8);
		tpow = tpow.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('trck":') != -1){

		var trck = recordsArray[i].substring(recordsArray[i].indexOf('trck":')+6,recordsArray[i].indexOf('trck":')+8);
		trck = trck.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('tsht":') != -1){

		var tsht = recordsArray[i].substring(recordsArray[i].indexOf('tsht":')+6,recordsArray[i].indexOf('tsht":')+8);
		tsht = tsht.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('weight":') != -1){

		var weight = recordsArray[i].substring(recordsArray[i].indexOf('weight":')+8,recordsArray[i].indexOf('weight":')+11);
		weight = weight.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('zcov":') != -1){

		var zcov = recordsArray[i].substring(recordsArray[i].indexOf('zcov":')+6,recordsArray[i].indexOf('zcov":')+8);
		zcov = zcov.replace(/,/,'');

	}

	if(recordsArray[i].indexOf('ovr":') != -1){

		var ovr = recordsArray[i].substring(recordsArray[i].indexOf('ovr":')+5,recordsArray[i].indexOf('ovr":')+7);
		ovr = ovr.replace(/,/,'');

	}


		if(recordsArray[i].indexOf('category":"') != -1){

			var category = recordsArray[i].substring(recordsArray[i].indexOf('category":"')+11,recordsArray[i].indexOf('category":"')+18);


			if(category == 'offense'){

				var eaID = recordsArray[i].substring(recordsArray[i].indexOf('offense","id":')+14,recordsArray[i].indexOf(',"value"'));

			}
			else if(category == 'defense'){

				var eaID = recordsArray[i].substring(recordsArray[i].indexOf('defense","id":')+14,recordsArray[i].indexOf(',"value"'));		
			}	
			else if(category == 'special'){

				var eaID = recordsArray[i].substring(recordsArray[i].indexOf('special","id":')+14,recordsArray[i].indexOf(',"value"'));		
			}			

		}


	
	if(recordsArray[i].indexOf('tier":"') != -1){

		var tier = recordsArray[i].substring(recordsArray[i].indexOf('tier":"')+7,recordsArray[i].indexOf('","type'));	

	}

	if(recordsArray[i].indexOf('","type":"') != -1){

		var type = recordsArray[i].substring(recordsArray[i].indexOf('","type":"')+10,recordsArray[i].indexOf('","discardValue'));
		type = camelize(type);
		
	}



		if(trim(recordsArray[i].substring(recordsArray[i].indexOf('description":"')+14,recordsArray[i].indexOf('","longDescription'))) != ''){

			var description = trim(recordsArray[i].substring(recordsArray[i].indexOf('description":"')+14,recordsArray[i].indexOf('","longDescription')));


		}

		if(description == undefined){

			description = '';

		}

	


	if(recordsArray[i].indexOf('longDescription":"') != -1){

		var longDescription = trim(recordsArray[i].substring(recordsArray[i].indexOf('longDescription":"')+18,recordsArray[i].indexOf('","program":{"name":"')));	


	}

	if(recordsArray[i].indexOf('","stampImage') != -1){	

		var program = recordsArray[i].substring(recordsArray[i].indexOf('program":{"name":"')+18,recordsArray[i].indexOf('","stampImage'));	
		
	}

	if(recordsArray[i].indexOf('position":"') != -1){

		var position = recordsArray[i].substring(recordsArray[i].indexOf('position":"')+11,recordsArray[i].indexOf('","lastName'));
		
	}

	if(recordsArray[i].indexOf('chemistry":{"') != -1){	

		var chemistry = recordsArray[i].substring(recordsArray[i].indexOf('chemistry":{"')+13,recordsArray[i].indexOf('},"portrait'));

		chemistry = chemistry.replace(/"/g,'');

	}


	if(recordsArray[i].indexOf('firstName":"') != -1){

		var firstName  = recordsArray[i].substring(recordsArray[i].indexOf('firstName":"')+12,recordsArray[i].indexOf('cardBack'));

		firstName = firstName.substring(0,firstName.indexOf('","name'));


	}

	if(recordsArray[i].indexOf('lastName":"') != -1){

		var lastName  = recordsArray[i].substring(recordsArray[i].indexOf('lastName":"')+11,recordsArray[i].indexOf('","firstName'));


	}


	if(recordsArray[i].indexOf('abbr":"') != -1){

		var team = recordsArray[i].substring(recordsArray[i].indexOf('abbr":"')+7,recordsArray[i].indexOf('abbr":"')+10);
		team = team.replace(/"/g,'');

		if(team == undefined){

			team = '';

		}

		var teamAbr;

	switch(team)
	{

		case 'CHI':
			teamAbr = "chi";
			team = "Bears";

		break;

		case 'CIN':
			teamAbr = "cin";
			team = 'Bengals';
			break;

		case 'BUF':
			teamAbr = "buf";
			team= 'Bills';
			break;			

		case 'DEN':
			teamAbr = "den";
			team= 'Broncos';
			break;

		case 'CLE':
			teamAbr = "cle";
			team= 'Browns';
			break;

		case 'TB':
			teamAbr = "tb";
			team= 'Buccaneers';
			break;

		case 'ARI':
			teamAbr = "az";
			team= 'Cardinals';
			break;

		case 'SD':
			teamAbr = "sd";
			team= 'Chargers';
			break;

		case 'KC':
			teamAbr = "kc";
			team= 'Chiefs';
			break;

		case 'IND':
			teamAbr = "ind";
			team= 'Colts';
			break;

		case 'DAL':
			teamAbr = "dal";
			team= 'Cowboys';
			break;

		case 'MIA':
			teamAbr = "mia";
			team= 'Dolphins';
			break;

		case 'PHI':
			teamAbr = "phi";
			team= 'Eagles';
			break;

		case 'ATL':
			teamAbr = "atl";
			team= 'Falcons';
			break;			

		case 'SF':
			teamAbr = "sf";
			team= '49ers';
			break;

		case 'NYG':
			teamAbr = "nyg";
			team= 'Giants';
			break;

		case 'JAX':
			teamAbr = "jac";
			team= 'Jaguars';
			break;

		case 'NYJ':
			teamAbr = "nyj";
			team= 'Jets';
			break;

		case 'DET':
			teamAbr = "det";
			team= 'Lions';
			break;

		case 'GB':
			teamAbr = "gb";
			team= 'Packers';
			break;

		case 'CAR':
			teamAbr = "car";
			team= 'Panthers';
			break;

		case 'NE':
			teamAbr = "ne";
			team= 'Patriots';
			break;

		case 'OAK':
			teamAbr = "oak";
			team= 'Raiders';
			break;

		case 'STL':
			teamAbr = "stl";
			team= 'Rams';
			break;

		case 'BAL':
			teamAbr = "bal";
			team= 'Ravens';
			break;

		case 'WAS':
			teamAbr = "was";
			team= 'Redskins';
			break;

		case 'NO':
			teamAbr = "no";
			team= 'Saints';
			break;

		case 'SEA':
			teamAbr = "sea";
			team= 'Seahawks';
			break;

		case 'PIT':
			teamAbr = "pit";
			team= 'Steelers';
			break;

		case 'TEN':
			teamAbr = "ten";
			team= 'Titans';
			break;

		case 'MIN':
			teamAbr = "min";
			team= 'Vikings';
			break;	

		case 'HOU':
			teamAbr = "hou";
			team= 'Texans';
			break;	

		case 'LEG':
			teamAbr = "leg";
			team= 'Legends';
			break;					
	}

	}//if(recordsArray[i].indexOf('abbr":"') != -1)	
	
	var tierID;

	switch(tier)
	{
	case 'BRONZE':
	  tier = 'Bronze';
	  tierID = 'usm16';
	 break;
	case 'GOLD':
	  tier = 'Gold';
	  tierID = 'usm16';
	  break;
	case 'ROOKIE':
	  tier = 'Rookie';
	  tierID = 'room16';
	  break;
	case 'ELITE':
	  tier = 'Elite';
	  tierID = 'elitem16';
	  break;
	case 'BONUS':
	  tier = 'Bonus';
	  tierID = 'bonm16';
	  break;
	case 'SILVER':
	  tier = 'Silver';
	  tierID = 'usm16';
	  break;
	case 'LEGEND':
	  tier = 'Legendary';
	  tierID = 'legm16';
	  break;
	case 'FANTASY':
	  tier = 'Fantasy';
	  tierID = 'fanm16';
	  break;	 
	case 'GHOST':
	  tier = 'Ghost';
	  tierID = 'ghm16';
	  break;	  
	}

	//uniforms
	if(recordsArray[i].indexOf(',"label') != -1){

		var isLight = recordsArray[i].substring(recordsArray[i].indexOf('isLight":')+9,recordsArray[i].indexOf(',"label'));
		
	}

	if(recordsArray[i].indexOf('","officialType') != -1){

		var label = recordsArray[i].substring(recordsArray[i].indexOf('label":"')+8,recordsArray[i].indexOf('","officialType'));
		
	}

	if(recordsArray[i].indexOf('","uniformName') != -1){

		var officialType = recordsArray[i].substring(recordsArray[i].indexOf('officialType":"')+15,recordsArray[i].indexOf('","uniformName'));
		
	}	

	if(recordsArray[i].indexOf('uniformName":"') != -1){

		var uniformName = recordsArray[i].substring(recordsArray[i].indexOf('uniformName":"')+14,recordsArray[i].indexOf('","id'));
		
	}	

	//Stadiums
	if(recordsArray[i].indexOf('stadiumId":') != -1){

		var stadiumID = recordsArray[i].substring(recordsArray[i].indexOf('stadiumId":')+11,recordsArray[i].indexOf(',"id'));
		
	}

	//Coaches
	
	if(recordsArray[i].indexOf(',"chm') != -1){

		var coachID = recordsArray[i].substring(recordsArray[i].indexOf('coachId":')+9,recordsArray[i].indexOf(',"chm'));
		
	}

	if(recordsArray[i].indexOf(',"def') != -1){

		var chm = recordsArray[i].substring(recordsArray[i].indexOf('chm":')+5,recordsArray[i].indexOf(',"def'));
		
	}

	if(recordsArray[i].indexOf(',"kno') != -1){

		var def = recordsArray[i].substring(recordsArray[i].indexOf('def":')+5,recordsArray[i].indexOf(',"kno'));
		
	}

	if(recordsArray[i].indexOf(',"mot') != -1){

		var kno = recordsArray[i].substring(recordsArray[i].indexOf('kno":')+5,recordsArray[i].indexOf(',"mot'));
		
	}

	if(recordsArray[i].indexOf(',"off') != -1){

		var mot = recordsArray[i].substring(recordsArray[i].indexOf('mot":')+5,recordsArray[i].indexOf(',"off'));
		
	}

	if(recordsArray[i].indexOf(',"ovr') != -1){

		var off = recordsArray[i].substring(recordsArray[i].indexOf('off":')+5,recordsArray[i].indexOf(',"ovr'));
		
	}

	//ovr already listed
	

	if(recordsArray[i].indexOf('wor":') != -1){

		var wor = recordsArray[i].substring(recordsArray[i].indexOf('wor":')+5,recordsArray[i].indexOf(',"id'));
		
	}

	//Playbooks
	if(recordsArray[i].indexOf('playbookId":') != -1){

		var playbookID = recordsArray[i].substring(recordsArray[i].indexOf('playbookId":')+12,recordsArray[i].indexOf(',"name'));
		
	}

	if(recordsArray[i].indexOf('isOffensive":') != -1){

		var isOffensive = recordsArray[i].substring(recordsArray[i].indexOf('isOffensive":')+13,recordsArray[i].indexOf(',"id'));
		
	}


	if(lastName != undefined){

		var id = "'" + teamAbr + lastName.toLowerCase() + firstName.substring(0,1).toLowerCase() + ovr + tierID  + "'";	

		var idNoQuotes = teamAbr + lastName.toLowerCase() + firstName.substring(0,1).toLowerCase() + ovr + tierID;

		idNoQuotes = idNoQuotes.replace(/'/g,'\\\'');

		if(playerString.indexOf(idNoQuotes)!=-1){

			myCount++;
			id = "'" + idNoQuotes + myCount + "'";

		}

				

	}		


		playerString = playerString + firstName + "," + lastName + "," + team + "," + position + "," + ovr + "," + tier + "," + acc + "," + age + "," + agi + "," + awr + "," + bcv + "," + bshd + "," + cary + "," + cint + "," + ctch + "," + elus + "," + fmov + "," + ht + "," + hp + "," + impb + "," + inj + "," + jerseyNumber + "," + jkm + "," + jmp + "," + kacc + "," + kpow + "," + mcov + "," + pac + "," + pbft + "," + pbk + "," + pbst + "," + pmov + "," + prec + "," + pres + "," + pur + "," + rbft + "," + rbk + "," + rbst + "," + ret + "," + rls + "," + rrun + "," + scat + "," + sfa + "," + spd + "," + spm + "," + sta + "," + str + "," + tckl + "," + tdep + "," + tgh + "," + tacc + "," + tmid + "," + tpow + "," + trck + "," + tsht + "," + weight + "," + zcov + "," + category + "," + eaID + "," + description + "," + longDescription + "," + program + "," + chemistry + "," + type + "*";	
	
	eaIDArray.push(eaID);

	}//for (var i=0;i < recordsArrayLength-1;i++)


	playerString = playerString.replace(/undefined/g,'');

	var storedPlayerString = GM_getValue('playerString','');
	storedPlayerString = storedPlayerString + playerString;
	GM_setValue('playerString',storedPlayerString);


	if(callback_function2_count == 39){	


		setTimeout( callFourthGM_xmlhttpRequest, 1);

	}


}//function callback_function2(parameter1, parameter2, responseDetails)

var callback_function3_count = 0;
var callback_function2_count_continued = 39;

function callback_function3(parameter1, parameter2, responseDetails){

	var storedPlayerString = GM_getValue('playerString','');
	storedPlayerStringArray = storedPlayerString.split('*');
	storedPlayerStringArrayLength = storedPlayerStringArray.length-1;

	var currentPCT = callback_function2_count_continued/76 * 100;
	currentPCT = Math.round(currentPCT);

	if(currentPCT > 100){

		currentPCT = 100;

	}

	progressDiv.innerHTML = currentPCT + '%';


	callback_function3_count++;
	callback_function2_count_continued++;

	var data;

	data = responseDetails.responseText;	

	var dataArray = data.split('}');

	pricing = '';

	for (var i=0;i < dataArray.length-1;i++){

		var thePlatform = dataArray[i].substring(dataArray[i].indexOf('platform":"') + 11,dataArray[i].indexOf('","formatttedTimeRemaining'));

		if(thePlatform == platform){
		
			var currentBid = dataArray[i].substring(dataArray[i].indexOf('currentBid":') + 12,dataArray[i].indexOf(',"secondsRemaining'));			
			pricing = pricing + eaIDArray[parameter1] + '|' + currentBid + '*';

			break;
		}

	}

	var storedPricing = GM_getValue('gmPricing','');
	storedPricing = storedPricing + pricing;
	GM_setValue('gmPricing',storedPricing);


	if(callback_function3_count == storedPlayerStringArrayLength){

		window.location = thisURL;

	}


}

function appendToDocument(html) {
        var div = document.getElementById(HIDDEN_DIV_ID);
        if (!div) {
            div = document.createElement("div");
            document.body.appendChild(div);
            div.id = HIDDEN_DIV_ID;
            div.style.display = 'none';
        }
        div.innerHTML = html;

        return document;
}

function trim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g,"");
}

function camelize(s) {
  return (s||'').toLowerCase().replace(/(\b|-)\w/g, function(m) {
    return m.toUpperCase().replace(/-/,'');
  });
}



var myTier = '';
var myTeam = '';
var myPosition = '';
var myRating = '';
var myProgram = '';
var myValue;

document.addEventListener('click', function(event) {


	switch(event.target.id) {
		case 'Tier':
			for (var i=0;i < tierOptionArray.length;i++){

				if(event.target.value == tierOptionArray[i]){

					myTier = tierOptionArray[i];


				}

			}
		break;

		case 'Team':
			for (var i=0;i < teamArray.length;i++){

				if(event.target.value == teamArray[i]){

					myTeam = teamArray[i];
					
				}

			}
		break;		

		case 'Position':
			for (var i=0;i < positionArray.length;i++){

				if(event.target.value == positionArray[i]){

					myPosition = positionArray[i];					

				}

			}
		break;

		case 'Rating':
			for (var i=0;i < ratingArray.length;i++){

				if(event.target.value == ratingArray[i]){

					myRating = ratingArray[i];					

				}

			}
		break;		

		case 'Program':
			for (var i=0;i < programArray.length;i++){

				if(event.target.value == programArray[i]){

					myProgram = programArray[i];


				}

			}
		break;	

		case 'getmyitems':

			checkLogin();

		break		

	}


	switch(event.target.value) {
	
		case 'Submit Query':

			var modifiedPlayerString = '';

			for (var i=0;i < playerStringArray.length;i++){

				if(myTier != '' && playerStringArray[i].indexOf(myTier) != -1){

					playerStringArrayRecord = playerStringArray[i].split(',');

					if(playerStringArrayRecord[5] == myTier){

						modifiedPlayerString = modifiedPlayerString + playerStringArray[i] + '*';

					}

				}


				if(myTeam != '' && playerStringArray[i].indexOf(myTeam) != -1){

					playerStringArrayRecord = playerStringArray[i].split(',');

					if(playerStringArrayRecord[2] == myTeam){

						modifiedPlayerString = modifiedPlayerString + playerStringArray[i] + '*';

					}

				}

				if(myPosition != '' && playerStringArray[i].indexOf(myPosition) != -1){

					playerStringArrayRecord = playerStringArray[i].split(',');

					if(playerStringArrayRecord[3] == myPosition){

						modifiedPlayerString = modifiedPlayerString + playerStringArray[i] + '*';

					}

				}

				if(myRating != ''){

					var myRatingLower = myRating.substring(0,myRating.indexOf('-'));
					var myRatingUpper = myRating.substring(myRating.indexOf('-')+1);

					playerStringArrayRecord = playerStringArray[i].split(',');

					if(playerStringArrayRecord[4] >= myRatingLower && playerStringArrayRecord[4] <= myRatingUpper){

						modifiedPlayerString = modifiedPlayerString + playerStringArray[i] + '*';

					}

				}

				if(myProgram != '' && playerStringArray[i].indexOf(myProgram) != -1){

					modifiedPlayerString = modifiedPlayerString + playerStringArray[i] + '*';

				}				

			}

			if(modifiedPlayerString != ''){

				modifiedPlayerStringArray = modifiedPlayerString.split('*');


				var myPrices = '';

				var myHTML2 = '<tr class="title"><td colspan="10">' + myGamerTag + ' (' + myPlatform + ') ' + 'Coins: ' + myCoins +'</td></tr>';
						
				var myHTML = '<tr class="alttitle"><td width="200">Name</td><td>Team</td><td>Tier</td><td>OVR</td><td>Position</td><td>Price</td></tr>';
				var myClass;
				var myStyle;

				for (var i=0;i < modifiedPlayerStringArray.length-1;i++){

					if(i % 2 == 0)
					{

						myClass = 'text10';

					}
					else
					{

						myClass = 'altrow';

					}

					var modifiedPlayerStringArrayRecord = modifiedPlayerStringArray[i].split(',');		

					switch(modifiedPlayerStringArrayRecord[5]) {
		 			   case 'Gold':
		  			      myStyle = 'style=\"color:#DAA520;\"'
		   			     break;
					    case 'Silver':
					        myStyle = 'style=\"color:#606060;\"'
					        break;
					    case 'Bronze':
		 			       myStyle = 'style=\"color:#A52A2A;\"'
		  			      break;
		 			   case 'Elite':
		 			       myStyle = 'style=\"color:#D63839;\"'
		 			       break;			
					} 

					myHTML = myHTML + '<tr class="' + myClass + '" nowrap="">' + '<td><a href="javascript:openWindow(\'/cards/cardimage/' + playerStringArrayRecord[58] + '\',%20\'_blank\',%20330,%20400,%20\'scrollbars=no\')">' + modifiedPlayerStringArrayRecord[0] + ' ' + modifiedPlayerStringArrayRecord[1] + '</a></td><td nowrap="">' + modifiedPlayerStringArrayRecord[2] + '</td><td ' + myStyle + ' nowrap="">' + modifiedPlayerStringArrayRecord[5] + '</td><td>' + modifiedPlayerStringArrayRecord[4] + '</td><td nowrap="">' + modifiedPlayerStringArrayRecord[3] + '</td><td nowrap="">';					
					for (var j=0;j < pricingArray.length;j++){

						var pricingArrayRecord = pricingArray[j].split('|');			


						if(pricingArrayRecord[0] == playerStringArrayRecord[58]){

							myHTML = myHTML + pricingArrayRecord[1] + '</td></tr>';
						
						}

					}

					if(myPrices = ''){

						myPrices = '</td></tr>';

					}

					myHTML = myHTML + myPrices;


				}//for (var i=0;i < modifiedPlayerStringArray.length-1;i++)

				myTable2.innerHTML = myHTML2;
				myTable.innerHTML = myHTML;

				tableStart.parentNode.insertBefore(myTable2,tableStart);
				tableStart.parentNode.insertBefore(myTable,tableStart);

			}//if(modifiedPlayerString != '')
			else
			{


				var allDropDowns = myTier + myTeam + myPosition + myRating + myProgram;	


				if(allDropDowns.indexOf('ALL') == -1 && allDropDowns != ''){			

					GM_setValue('noResults','No Results Found');

				}

				window.location = thisURL;
			}			

		        break;	
		case 'By Name':
		        var text =  document.evaluate("//input[@id='txtlastname2']",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			text = text.snapshotItem(0);
			myValue = text.value;

			var modifiedPlayerString = '';

			for (var i=0;i < playerStringArray.length;i++){

				var re = new RegExp(myValue + '.*', 'i');

				if(myValue != '' && playerStringArray[i].match(re)){							

					modifiedPlayerString = modifiedPlayerString + playerStringArray[i] + '*';
					
				}

			}

			if(modifiedPlayerString != ''){

				modifiedPlayerStringArray = modifiedPlayerString.split('*');


				var myPrices = '';

				var myHTML2 = '<tr class="title"><td colspan="10">' + myGamerTag + ' (' + myPlatform + ') ' + 'Coins: ' + myCoins +'</td></tr>';
				var myHTML = '<tr class="alttitle"><td width="200">Name</td><td>Team</td><td>Tier</td><td>OVR</td><td>Position</td><td>Price</td></tr>';
				var myClass;
				var myStyle;

				for (var i=0;i < modifiedPlayerStringArray.length-1;i++){

					if(i % 2 == 0)
					{

						myClass = 'text10';

					}
					else
					{

						myClass = 'altrow';

					}

					var modifiedPlayerStringArrayRecord = modifiedPlayerStringArray[i].split(',');		

					switch(modifiedPlayerStringArrayRecord[5]) {
		 			   case 'Gold':
		  			      myStyle = 'style=\"color:#DAA520;\"'
		   			     break;
					    case 'Silver':
					        myStyle = 'style=\"color:#606060;\"'
					        break;
					    case 'Bronze':
		 			       myStyle = 'style=\"color:#A52A2A;\"'
		  			      break;
		 			   case 'Elite':
		 			       myStyle = 'style=\"color:#D63839;\"'
		 			       break;			
					} 

					myHTML = myHTML + '<tr class="' + myClass + '" nowrap="">' + '<td><a href="javascript:openWindow(\'/cards/cardimage/' + playerStringArrayRecord[58] + '\',%20\'_blank\',%20330,%20400,%20\'scrollbars=no\')">' + modifiedPlayerStringArrayRecord[0] + ' ' + modifiedPlayerStringArrayRecord[1] + '</a></td><td nowrap="">' + modifiedPlayerStringArrayRecord[2] + '</td><td ' + myStyle + ' nowrap="">' + modifiedPlayerStringArrayRecord[5] + '</td><td>' + modifiedPlayerStringArrayRecord[4] + '</td><td nowrap="">' + modifiedPlayerStringArrayRecord[3] + '</td><td nowrap="">';					
					for (var j=0;j < pricingArray.length;j++){

						var pricingArrayRecord = pricingArray[j].split('|');			


						if(pricingArrayRecord[0] == playerStringArrayRecord[58]){

							myHTML = myHTML + pricingArrayRecord[1] + '</td></tr>';
						
						}

					}

					if(myPrices = ''){

						myPrices = '</td></tr>';

					}

					myHTML = myHTML + myPrices;


				}//for (var i=0;i < modifiedPlayerStringArray.length-1;i++)

				myTable2.innerHTML = myHTML2;
				myTable.innerHTML = myHTML;
	
				tableStart.parentNode.insertBefore(myTable2,tableStart);
				tableStart.parentNode.insertBefore(myTable,tableStart);

			}//if(modifiedPlayerString != '')
			else
			{
				GM_setValue('noResults','No Results Found');
				window.location = thisURL;
			}			

		        break;	

		
 	}//switch(event.target.value)


}, true);

function sortNumber(a,b)
{

	var bArray = b.split(',');
	var aArray = a.split(',');

	return bArray[4] - aArray[4];
		
}




