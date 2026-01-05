// ==UserScript==
// @name        Forældreintra
// @namespace   http://maagensen.dk
// @description Forældreintra udnytter hele skærmen, istedet for at være 2003 agtigt
// @include     http://www.buskelundskolen.silkeborg.dk/Infoweb/*
// @include     https://www.buskelundskolen.silkeborg.dk/Infoweb/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4390/For%C3%A6ldreintra.user.js
// @updateURL https://update.greasyfork.org/scripts/4390/For%C3%A6ldreintra.meta.js
// ==/UserScript==
var fs = document.getElementsByTagName("frameset"); 
for (var i=0; i<fs.length; i++){
  if (fs[i].getAttribute("cols") == "*,1,1024,1,*") {
    fs[i].setAttribute("cols", "*,1,100%,1,*");
    break;
  }
}

function enableAutoComplete(element) {
	if (element.hasAttribute("autocomplete"))
		element.setAttribute("autocomplete","on");
}

allfields=document.getElementsByClassName("field");
for (i=0; i<allfields.length; ++i)
	enableAutoComplete(allfields[i]);

for (i=0; i<document.forms.length; ++i)
	enableAutoComplete(document.forms[i]);