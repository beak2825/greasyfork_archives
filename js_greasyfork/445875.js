// ==UserScript==
// @name         FMCSA File print name change
// @namespace    fmcsa_file_print_change
// @version      0.1
// @description  File print cleanup
// @author       alicemq
// @match        https://clearinghouse.fmcsa.dot.gov/*
// @icon         https://www.google.com/s2/favicons?domain=mozilla.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445875/FMCSA%20File%20print%20name%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/445875/FMCSA%20File%20print%20name%20change.meta.js
// ==/UserScript==

var minusdays = 1
//CIA NUSISTATO KIEK DIENU minus - rasyti teigiama skaiciu

var company;
var comp_search = "Employer Conducting Query: ";
var bTags = document.getElementsByTagName("h5");
var initialWindowTitle = null;
var aTags = document.getElementsByTagName("label");
var searchText = "Name:";
var found;
var trim_end_DOT = "USDOT";

for (var i = 0; i < aTags.length; i++) {
  if (aTags[i].textContent == searchText) {
    found = aTags[i].nextSibling.textContent;
    break;
  }
}

for (var h = 0; h < bTags.length; h++) {
  if (bTags[h].textContent.startsWith(comp_search)) {

      company = bTags[h].textContent.replace(comp_search,"");
    break;
  }
}

if ( company.includes(trim_end_DOT)) {
company = company.substring( 0, company.indexOf( " (USDOT" ) ).trim();
}
else {
console.log(company)
}

let options = {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  },
formatter = new Intl.DateTimeFormat('en-US', options);
var ddata = new Date()
ddata.setDate( ddata.getDate() - minusdays)
console.log(formatter.format(ddata).split('/'));
var date = formatter.format(ddata);
var month = date.split('/')[0];
var dayone = date.split('/')[1];
var year = date.split('/')[2];

function pavadinimas() {
    'use strict';
initialWindowTitle = window.document.title;
    window.document.title = month + " " + dayone + " " + year + " CH "+ found.toUpperCase() +" " + company.toUpperCase();
}
pavadinimas();
