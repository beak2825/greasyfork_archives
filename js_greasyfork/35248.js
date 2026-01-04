// ==UserScript==
// @name           Remove Duplicate Comments
// @namespace      embarcadero.com
// @include        https://na*.salesforce.com/*
// @include        https://cs*.salesforce.com/*
// @version     1
// @description Remove duplicate comments
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/35248/Remove%20Duplicate%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/35248/Remove%20Duplicate%20Comments.meta.js
// ==/UserScript==

//Using case 00241827 for testing


var thisURL = document.URL;


(async function() {
  
var	myDisableScript = await GM.getValue('disableScript','false');

//Add script disable link

var scriptDisable = document.evaluate("//td[@class='pbHelp'][contains(string(),'Case Comments Help')]/span/a",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

scriptDisable = scriptDisable.snapshotItem(0);
var newSpan = document.createElement("td");
newSpan.setAttribute('class', 'pbHelp');

if(myDisableScript == 'true'){

	newSpan.innerHTML = '<a class="actionLink" style="cursor: pointer;color: #015BA7;" Title="Enable GM Script">Enable GM Script</a> |';

}
else
{

	newSpan.innerHTML = '<a class="actionLink" style="cursor: pointer;color: #015BA7;" Title="Disable GM Script">Disable GM Script</a> |';

}
  
if(scriptDisable != null){

	//scriptDisable.parentNode.insertBefore(newSpan,scriptDisable); commented out on 11/16/2017

}
  
if(myDisableScript == 'false'){


//Highlight Case Detail section for Platinum customers

var pbSubsection = document.evaluate("//div[@class='pbSubsection']",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
pbSubsection = pbSubsection.snapshotItem(0);

//var plat = document.evaluate("//div[@id='00NG000000ElI6b_ileinner']/img/@title",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var plat = document.evaluate("//div[@id='00Nf0000001CJpj_ileinner']/img/@title",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);//idera server

if(plat != null){

	plat = plat.snapshotItem(0);

	if(plat != null){

		plat = plat.textContent;

	}


	if(plat == 'Checked'){

		if(scriptDisable != null){	

			//chose color from http://www.workwithcolor.com/color-chart-full-01.htm
			pbSubsection.setAttribute('style','background-color: #E5E4E2');	
			

		}

	}

}

setTimeout( delay, 5000);

//Remove blue shading when mousing over comments.
var mouseover;
var mouseovers = document.getElementsByTagName('tr');

	for (var i = 0; i < mouseovers.length; i++) {
		var mouseover = mouseovers[i];

		if (mouseover.getAttribute('onmouseover')) {

			mouseover.setAttribute('onmouseover', '');			

		}		
	}

	




//Add toggle button to hide or show comments
var edit;
var edit2;
var newEdit;

var edits = document.evaluate("//td[@class='actionColumn'][contains(string(),'Make Public')]",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	for (var i=0;i < edits.snapshotLength;i++)
	{

		edit = edits.snapshotItem(i);
		edit2 = edit.innerHTML;

		

		newDIVLocation = document.createElement("td");	
		newDIVLocation.setAttribute('class', 'actionColumn');
		newDIVLocation.setAttribute('nowrap', 'nowrap');		
		

		newEdit = ' | <a class="actionLink" style="cursor: pointer;" id="' + i + '" Title="Show Hidden Comments">S</a>';
		newDIVLocation.innerHTML = edit2 + newEdit;			

		//edit.parentNode.replaceChild(newDIVLocation,edit);   commented out on 11/16/2017


	}



//Hide comments
var comment;
var comment2;
var comment3;

var theString = '';

var dupeArray = new Array();
var dupeArray2 = new Array();

var comments = document.evaluate("//td[@class=' dataCell  '][contains(string(),'Created By:')]",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);



	for (var i=0;i < comments.snapshotLength;i++)
	{

		comment = comments.snapshotItem(i);
		comment2 = comment.innerHTML;
		comment3 = '';
		
		newDIVLocation = document.createElement("td");
		newDIVLocation.setAttribute('class', '  dataCell  ');


		if(comment2.indexOf('--------------- Original Message ---------------') != -1 && comment2.indexOf('-----Original Message-----') == -1)
		{

			
			comment3 =  comment2.substring(0,comment2.indexOf('--------------- Original Message ---------------'));
			newDIVLocation.innerHTML = comment3;

			
			comment.parentNode.replaceChild(newDIVLocation,comment);

		}
		else if(comment2.indexOf('--------------- Original Message ---------------') != -1 && comment2.indexOf('--------------- Original Message ---------------') < comment2.indexOf('-----Original Message-----')){

			comment3 = comment2.substring(0,comment2.indexOf('--------------- Original Message ---------------'));


			newDIVLocation.innerHTML = comment3;
			
			comment.parentNode.replaceChild(newDIVLocation,comment);			
			

		}

		

		if(comment2.indexOf('-----Original Message-----') != -1 && comment2.indexOf('--------------- Original Message ---------------') == -1)
		{

			comment3 = comment2.substring(0,comment2.indexOf('-----Original Message-----'));


			newDIVLocation.innerHTML = comment3;

			newDIVLocation.setAttribute('BGCOLOR','#FFFFCC');
			
			comment.parentNode.replaceChild(newDIVLocation,comment);

						

		}	
		else if(comment2.indexOf('-----Original Message-----') != -1 && comment2.indexOf('-----Original Message-----') < comment2.indexOf('--------------- Original Message ---------------')) {

			comment3 = comment2.substring(0,comment2.indexOf('-----Original Message-----'));

			newDIVLocation.innerHTML = comment3;

			newDIVLocation.setAttribute('BGCOLOR','#FFFFCC');
			
			comment.parentNode.replaceChild(newDIVLocation,comment);

						

		}

		if(comment3 == ''){

			comment3 = comment2;

		}

		theString = theString + i + '|*|' + comment2 + '|*|' + comment3 + '|**|';	


		

		await GM.setValue("dupes",theString);

	}//for (var i=0;i < comments.snapshotLength;i++)


}//if(myDisableScript == 'false'){
 
//
document.addEventListener('click', function(event) {

	if(event.target.text == 'Disable GM Script'){

		GM.setValue('disableScript','true');
		window.location = thisURL;
	}
  
	if(event.target.text == 'Enable GM Script'){

		GM.setValue('disableScript','false');
		window.location = thisURL;
	} 
  
  
	if( event.target.getAttribute('Title')=='Show Hidden Comments'){


		var theID = event.target.getAttribute('id');

    (async function() {
		var d = await GM.getValue("dupes");
     })();

		if (d != "") dupeArray = d.split("|**|");	

		for (var i=0;i < dupeArray.length;i++){

			dupeArray2 = dupeArray[i].split("|*|");	

			

			if(dupeArray2[0] == theID){

				event.target.parentNode.nextSibling.nextSibling.innerHTML = dupeArray2[1];
				event.target.innerHTML = 'H';
				event.target.setAttribute('Title','Hide Duplicate Comments');


			}		

		}

	}  
	else if( event.target.getAttribute('Title')=='Hide Duplicate Comments'){	

		var theID = event.target.getAttribute('id');

 
		var d =  GM.getValue("dupes");
      
		if (d != "") dupeArray = d.split("|**|");	

		for (var i=0;i < dupeArray.length;i++){

			dupeArray2 = dupeArray[i].split("|*|");	

			if(dupeArray2[0] == theID){

				event.target.parentNode.nextSibling.nextSibling.innerHTML = dupeArray2[2];
				event.target.innerHTML = 'S';
				event.target.setAttribute('Title','Show Hidden Comments');			

			}		

		}


	}

}, true);  
//  
  
  
  
function delay(){

	//highlight Platinum Support cases in Views
	//Drawbacks: 5 second delay and user needs to refresh tab
	var plat;
	//var plats = document.evaluate("//div[contains(@id,'00NG000000ElI6b')]/img/@title",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	var plats = document.evaluate("//div[contains(@id,'00Nf0000001CJpj')]/img/@title",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);//idera server

	var caseLists = document.evaluate("//table[@class='x-grid3-row-table']",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

		for (var i=0;i < plats.snapshotLength;i++){

			plat = plats.snapshotItem(i);

			if(plat.textContent == 'Checked'){

				//pbSubsection.setAttribute('style','background-color: #E5E4E2');	
				//console.log(caseLists.snapshotItem(i).getAttribute('style'));
				var currentStyle = caseLists.snapshotItem(i).getAttribute('style');
				var currentStyle = currentStyle + 'background-color: #E5E4E2;';
				caseLists.snapshotItem(i).setAttribute('style',currentStyle);

			}
		}	

}  
  
  
})();








