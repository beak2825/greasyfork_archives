// ==UserScript==

// @name        Import
// @description Import your card collection in CSV spreadsheet format into tradingcarddb.com
// @namespace   baseballsimulator.com
// @include     http://www.tradingcarddb.com/CollectionAddMultiples.cfm/sid/*
// @version     1
// @grant       GM_log
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/24797/Import.user.js
// @updateURL https://update.greasyfork.org/scripts/24797/Import.meta.js
// ==/UserScript==

var thisURL = document.URL;

if(thisURL.indexOf('?PageIndex=') != -1){

	var pageIndex = thisURL.substring(thisURL.indexOf('=')+1);

}

var retrievedValue = GM_getValue('value','');

var form = document.evaluate("//form[@id='CFForm_1']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
form = form.snapshotItem(0);

var button = document.evaluate("//form[@id='add']/p/button[@class='btn btn-primary']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
button = button.snapshotItem(0);

var endPagination;
var endPaginations = document.evaluate("//nav/ul[@class='pagination']/li/a/@href", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i = 0; i < endPaginations.snapshotLength; i++) {

	endPagination = endPaginations.snapshotItem(i);

}


endPagination = endPagination.textContent;
endPagination = endPagination.substring(endPagination.indexOf('=')+1);


if(thisURL.indexOf('?PageIndex=') == -1){

	GM_setValue('endPagination',endPagination);

}


var set = document.evaluate("//table/tbody/tr/td/h1", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
set = set.snapshotItem(0);
set = set.textContent;

var cardYear = set.substring(0,4);
set = set.substring(5);

var amounts = document.evaluate("//table[@class='table table-condensed table-hover']/tbody/tr/td[4]/select", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

var cardNumber;
var cardNumbers = document.evaluate("//table[@class='table table-condensed table-hover']/tbody/tr/td[6]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i = 0; i < cardNumbers.snapshotLength; i++) {

	cardNumber = cardNumbers.snapshotItem(i);
	
	cardNumber = trim(cardNumber.textContent);

	if(retrievedValue != ''){

		var retrievedValueArray = retrievedValue.split('\n');
	
		for (var j = 0; j < retrievedValueArray.length; j++) {

			var retrievedValueArrayRecord = retrievedValueArray[j].split(',');
			var year = retrievedValueArrayRecord[1];
			var number = retrievedValueArrayRecord[5];
			var amount = retrievedValueArrayRecord[6];

			

			if(cardNumber == number && cardYear == year){

				switch(amount) {
    					case '1':
        				amounts.snapshotItem(i).selectedIndex = 1;
        				break;
    					case '2':
					amounts.snapshotItem(i).selectedIndex = 2;
        				break;
    					case '3':
					amounts.snapshotItem(i).selectedIndex = 3;
        				break;
    					case '4':
					amounts.snapshotItem(i).selectedIndex = 4;
        				break;					
    					case '5':
					amounts.snapshotItem(i).selectedIndex = 5;
        				break;					
    					case '6':
					amounts.snapshotItem(i).selectedIndex = 6;
        				break;					
    					case '7':
					amounts.snapshotItem(i).selectedIndex = 7;
        				break;
    					case '8':
					amounts.snapshotItem(i).selectedIndex = 8;
        				break;					
    					case '9':
					amounts.snapshotItem(i).selectedIndex = 9;
        				break;					
    					case '10':
					amounts.snapshotItem(i).selectedIndex = 10;
        				break;					
				} 				


			}
		
		}

	}	

}

var pageIndex = GM_getValue('currentPage','');
var endPagination = GM_getValue('endPagination','');
var isImport = GM_getValue('isImport',false); 

if(endPagination == "#"){

	GM_setValue('currentPage',1);
	GM_setValue('isImport',false);

}


if(parseInt(pageIndex) <= parseInt(endPagination) && isImport == true){


	if(thisURL.indexOf('?ACTION=ADD') != -1){

		
		pageIndex = parseInt(pageIndex) + 1;
		GM_setValue('currentPage',pageIndex);
		var newURL = thisURL.substring(0,thisURL.indexOf('?')+1) + 'PageIndex=' + pageIndex;
		window.location = newURL;

	}
	else
	{

		click(button);

	}

}



var myText = document.createElement('div');
myText.setAttribute('id','excel');
myText.innerHTML ='<textarea id="excel" style="width:70%;" rows=40 type="text"  WRAP=OFF /></textarea>';

var myButton = document.createElement("button");
myButton.innerHTML = 'Import';
myButton.setAttribute('type','button');

myButton.setAttribute('value','Import');



if(thisURL.indexOf('?PageIndex=') != -1){

	myButton.setAttribute('disabled','true');
	myButton.setAttribute('style','color:Grey; text-decoration:none;');
}



form.parentNode.insertBefore(myButton,form.followingSibling); 
form.parentNode.insertBefore(myText,form.followingSibling); 



function makeCounter(textarea){
   if(!textarea || textarea._already_count)
     return;
  var length = -1;

   setInterval(function(){
     var taLength = textarea.value.length;
     if(taLength != length){
       length = taLength;
       count();
     }
   }, 100);

   var div = document.createElement("div");
   with(div.style){
     textAlign = "left";
     backgroundColor = "#FFFFFF";
     color = "black";
   }
  //div.appendChild(document.createTextNode("Count:"));
  var countArea = document.createElement("span");
  countArea.style.margin = "5px";
  //div.appendChild(countArea);

  var checks = "line,space,tab".split(",");
  var inputs =  checks.map(function(check){
    var label = document.createElement("label");
    var input =document.createElement("input");
    input.type = "checkbox";
    input.style.margin = "2px";
    label.appendChild(input);
    label.appendChild(document.createTextNode(check));

    return input;
  });
  inputs.forEach(function(input){
   input.addEventListener("change", count, true)
  });
  textarea.parentNode.insertBefore(div, textarea.nextSibling);
  textarea._already_count = true;

  function count(){
     var value = textarea.value;

     	if(value != ''){

		GM_setValue('value',value);

	}

     var filter = {
       line: /\r|\n/g,
       space: /\s/g,
      tab: /\t/g
    };

     inputs[1].checked = true;

    for(var i=0;i<checks.length;i++){
      if(inputs[i].checked){
        value = value.replace(filter[checks[i]], "");
      }
     }
     var num = value.length;
       countArea.innerHTML = num;
  }
 }

 var tas = document.getElementsByTagName("textarea");

 
 Array.prototype.forEach.call(tas, function(ta){

	makeCounter(ta);
 });

document.addEventListener('click', function(event) {


	if(event.target.getAttribute('value') == 'Import'){

		GM_setValue('isImport',true);
		window.location = thisURL + '?PageIndex=1';


	}


}, true);


function trim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g,"");
}

function click(elm) {
     var evt = document.createEvent('MouseEvents');
     evt.initMouseEvent('click', true, true, window, 0, 1, 1, 1, 1, false, false, false, false, 0, null);
     elm.dispatchEvent(evt);
}

