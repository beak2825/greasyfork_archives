// ==UserScript==
// @name Outlook Title Emails
// @description View title of emails in Outlook.com
// @author Tafarel Carvalho
// @include http*://*outlook.live.com/*
// @version 4.3
// @namespace https://greasyfork.org/users/43566
// @downloadURL https://update.greasyfork.org/scripts/19659/Outlook%20Title%20Emails.user.js
// @updateURL https://update.greasyfork.org/scripts/19659/Outlook%20Title%20Emails.meta.js
// ==/UserScript==

//23/11/2015
//Nova Atualização do aplicativos da Microsoft
//Script ficou mais enxuto

function main() {
  
	var boxEmails,froms,subjects,element,texto;

	boxEmails=document;
	
	//from
	froms=boxEmails.getElementsByClassName('_lvv_d');//BOXEs para evento de passar o mouse
	for(var iArea=0; iArea<froms.length; ++iArea) { //percorre a elemento para o evento
			
		element=froms[iArea];//Boxe para evento...
		texto=element.getElementsByTagName('span')[0].innerHTML;
		element.setAttribute('title',texto);
	}
	
	//subject
	subjects=boxEmails.getElementsByClassName('_lvv_q');//BOXEs para evento de passar o mouse
	for(var iArea=0; iArea<subjects.length; ++iArea) { //percorre a elemento para o evento

	    element=subjects[iArea];//Boxe para evento...
	    texto=element.getElementsByTagName('span')[0].innerHTML;
	    element.setAttribute('title',texto);
	    //element.setAttribute('onclick','document.title="Outlook - '+texto+'";');
	    
	}
	
	//document.getElementsByClassName('g_close')[0].setAttribute('onclick','document.title="'+firstTitle+'";');
}

setInterval(function(){main()},6000);
