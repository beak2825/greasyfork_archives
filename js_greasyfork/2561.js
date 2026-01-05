// ==UserScript==
// @name BPCM
// @author Chet Manley
// @version 0.1
// @description BPCM x
// @include https://www.mturkcontent.com/*
// @include https://s3.amazonaws.com/mturk_bulk/hits/*
// @require http://code.jquery.com/jquery-latest.min.js
// @namespace x
// @downloadURL https://update.greasyfork.org/scripts/2561/BPCM.user.js
// @updateURL https://update.greasyfork.org/scripts/2561/BPCM.meta.js
// ==/UserScript==
 
var from_zip = $("#mturk_form > p:nth-child(12) > b").text().trim();
var to_zip = $("#mturk_form > p:nth-child(13) > b").text().trim();
 
console.log(from_zip)
console.log(to_zip)
 
window.open("https://www.uship.com/quotes/view.aspx?c=79&z1=" + from_zip + "&z2=" + to_zip + "&country1ID=1&country2ID=1&a_year=2012&a_make=30&a_model=14804&a_running=true",'','width=900,height=600');
 
$('#Q1Url').focus();