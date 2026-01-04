// ==UserScript==
// @name     auxmoney links
// @version  1
// @include  https://www.auxmoney.com/anlegercockpit/returns
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant    GM_addStyle
// @grant    GM.getValue
// @namespace https://greasyfork.org/users/160615
// @description Ändert die Links zu den Projekt-Details in der Zinsübersicht
// @downloadURL https://update.greasyfork.org/scripts/380374/auxmoney%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/380374/auxmoney%20links.meta.js
// ==/UserScript==

var regex = /(\/project\/details\/)([0-9]+)$/i;

/*
function modifyLinks () {
  var links = document.getElementsByTagName("a"); //array
  var regex = /^(.*)(auxmoney\.com\/)(project\/)details\/([0-9]+)$/i;
  
  for (var i=0,imax=links.length; i<imax; i++) {
    links[i].href = links[i].href.replace(regex,"$1$2anlegercockpit/projects/details/$4");
    console.log(links[i].href);
  }
}
*/

//waitForKeyElements ("tr.uxTable--accordionHead.isOpen", setupMyClass);
waitForKeyElements ("tr.uxTable--accordionContent", setupMyClass);


function setupMyClass (jNode) {
  //modifyLinks();
  //console.log(jNode);
  // change the className
  // this has two effects: we won't find the element again
  // the row will remain visible if we open another month
  // this allows the user to open _all_ months and copy the whole table to analyze data elsewhere
  jNode[0].className = "uxTable--changedLink";
  var linkText = jNode[0].childNodes[1].childNodes[0].attributes["href"].value;
  //console.log(jNode[0].childNodes[1].childNodes[0].attributes["href"].value);
  linkText = linkText.replace(regex, "/anlegercockpit/projects/details/$2")
  //console.log(linkText);
  jNode[0].childNodes[1].childNodes[0].attributes["href"].value = linkText;
}

//modifyLinks();
