// ==UserScript==
// @name     	Corne's changes to iLead
// @description:en  Greasemonkey script in order to change some stuff on iLead
// @version  	4
// @grant    	none
// @include 	http://ictalfa.nl/ilead/stud/*
// @include 	http://*.ictalfa.nl/ilead/stud/*
// @include 	https://ictalfa.nl/ilead/stud/*
// @include 	https://*.ictalfa.nl/ilead/stud/*
// @namespace https://greasyfork.org/users/167723
// @description User script in order to change some stuff on iLead
// @downloadURL https://update.greasyfork.org/scripts/37692/Corne%27s%20changes%20to%20iLead.user.js
// @updateURL https://update.greasyfork.org/scripts/37692/Corne%27s%20changes%20to%20iLead.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function checkGetParameter( name, url ) {
   	if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}

function replaceQueryParam(param, newval, search) {
    var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
    var query = search.replace(regex, "$1").replace(/&$/, '');

    return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
}

if (window.location.href.indexOf("studvoortgang") != -1)
{
	addGlobalStyle(`
		#main > div:nth-child(5) {
			max-height: none !important;
		}

		#main > div:nth-child(7) {
			min-height: 300px;
			height: auto !important;
		}
		
		#tabel td.streeponder {
    	display: flex;
			justify-content: space-between;
		}
	`);
  
  if(checkGetParameter("hid", window.location.href) == null)
  {
   var str = window.location.search;
   str = replaceQueryParam('hid', 1, str);
   window.location = window.location.pathname + str;
    //window.location.replace("https://ictalfa.nl/ilead/stud/studvoortgang.php?hid=1");
  }
}

if (window.location.href.indexOf("persoonlijk") != -1)
{
	addGlobalStyle(`
		#main > div:nth-child(4), #main > div:nth-child(6) {
			min-height: 300px;
			height: auto !important;
		}

		#periodebalk > table:nth-child(1) {
			width: 100% !important;
		}

		#periodebalk > table > td * {
			border: 1px dashed #999 !important;
		}

		#periodebalk > table, #periodebalk > table > th *{
			border: 2px solid silver !important;
			border-collapse: collapse;
		}
	`);
}