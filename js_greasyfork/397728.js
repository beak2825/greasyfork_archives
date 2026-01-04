// ==UserScript==
// @name        Lutendo Amazon Links
// @namespace   https://greasyfork.org/de/users/456963-kobi-wan
// @author      kobi-wan
// @description Add Amazon product links to offers
// @include     *://app.lutendo.com/offers*
// @include     *://app.lutendo.com/dashboard*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require     https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @run-at      document-idle
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/397728/Lutendo%20Amazon%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/397728/Lutendo%20Amazon%20Links.meta.js
// ==/UserScript==

function addAmazonLink (jNode)
{
	// console.log (jNode.html());
	if (jNode.html().search('btn-success')==-1)
	{
		var campaignId = jNode.attr('id').substr(5);
		var aTag = document.createElement('a');
		var iTag = document.createElement('i');
		iTag.setAttribute('class', 'fa fa-amazon');
		aTag.setAttribute('href', '/amz/?m=&campaign=' + campaignId);
		aTag.setAttribute('class', 'btn btn-success');
		aTag.setAttribute('target', '_blank');
		aTag.setAttribute('title', 'Bei Amazon aufrufen');
		// aTag.innerText = 'Amz';
		aTag.appendChild(iTag);
		jNode.prepend(aTag);
	}
}

waitForKeyElements('.btn-group', addAmazonLink);
