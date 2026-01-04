// ==UserScript==
// @name           Show Attachments
// @namespace      http://embarcadero.com/
// @description    Create clickable attachments
// @include        https://na*.salesforce.com/*
// @include        https://cs*.salesforce.com/*
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.xmlHttpRequest
// @version 0.0.1.20171116164118
// @downloadURL https://update.greasyfork.org/scripts/35243/Show%20Attachments.user.js
// @updateURL https://update.greasyfork.org/scripts/35243/Show%20Attachments.meta.js
// ==/UserScript==

//Good sample:
//https://na11.salesforce.com/ui/email/EmailMessageListPage?id=500G00000089jSa

Function.prototype.bind = function( thisObject ) {
  var method = this;
  var oldargs = [].slice.call( arguments, 1 );
  return function () {
    var newargs = [].slice.call( arguments );
    return method.apply( thisObject, oldargs.concat( newargs ));
  };
}



var emailHasAttach;
var emailURL;
var thisURL = "https://" + document.domain;

var fileArray = new Array();
var fileArray2 = new Array();


var emailHasAttachs = document.evaluate("//div[@class='bEmailStatus']/img[@src='/img/emailHasAttach.gif']/following::td[@class=' dataCell  '][1]/a/@href",
document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

var j = 0;

for (var i=0;i < emailHasAttachs.snapshotLength;i++)
{

	emailHasAttach = emailHasAttachs.snapshotItem(i);
	emailHasAttach = emailHasAttach.nodeValue;
	
	emailURL = thisURL + emailHasAttach;


	j = 1+i;


  GM.xmlHttpRequest({
      method: 'GET',
      url: emailURL,
      headers: {
          'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
          'Accept': 'application/atom+xml,application/xml,text/xml',
      },
      onload:callback_function.bind( {}, i, j )
  }); 	


}



function callback_function(parameter1, parameter2, responseDetails)
{

	var data;
	var result;


	data = responseDetails.responseText;

	  var patternString = 'class="actionLink" target="_blank" title="View - ';

	

	var pattern = new RegExp(patternString, "g");

	var fileName;

	var patternLocationString = '';

	while((result = pattern.exec(data)) != null){



		var patternLocation = data.substring(result.index + 49,result.index + 600);
		

		patternLocation = patternLocation.substring(patternLocation.indexOf('delID=') + 6,patternLocation.indexOf('&amp;'));

		fileName = data.substring(result.index + 60,result.index + 600);
		fileName = fileName.substring(0,fileName.indexOf('">'));
		

		patternLocationString += '<a href="https://c.na11.content.force.com/servlet/servlet.FileDownload?file='+ patternLocation + '">' + fileName + '</a> | ';


	}


	patternLocationString = patternLocationString.substring(0,patternLocationString.length -3);

	fileArray2[parameter1] = patternLocationString;


}


setTimeout( delay, 4000); 

function delay(){

	var emailHasAttach;

	var emailHasAttachs = document.evaluate("//div[@class='bEmailStatus']/img[@src='/img/emailHasAttach.gif']/following::td[@class=' dataCell  '][1]/a",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	for (var k=0;k < emailHasAttachs.snapshotLength;k++)
	{

		emailHasAttach = emailHasAttachs.snapshotItem(k);

		colElement = document.createElement("td");
		colElement.innerHTML = fileArray2[k];

		if(colElement.innerHTML == 'undefined'){
			colElement.innerHTML = 'Oops!  Please try refreshing the page.';
		}


		emailHasAttach.parentNode.insertBefore(colElement,emailHasAttach.followingSibling);

	}


}


