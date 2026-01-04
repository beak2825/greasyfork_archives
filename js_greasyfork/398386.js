// ==UserScript== 
// @name Loopings.nl Ad-wall
// @namespace http://www.looopings.nl/
// @description Verbergen van de Ad-wall van looopings.nl
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @include https://*.looopings.nl/*
// @version 0.0.1.20200321130555
// @downloadURL https://update.greasyfork.org/scripts/398386/Loopingsnl%20Ad-wall.user.js
// @updateURL https://update.greasyfork.org/scripts/398386/Loopingsnl%20Ad-wall.meta.js
// ==/UserScript==   
$(document).ready(function(){
  var div_id = $("style").text()
  div_id= div_id.split('{');
	$( div_id[0] ).hide();
});