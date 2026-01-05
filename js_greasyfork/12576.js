// ==UserScript==
// @name       jawz Binoy Bhansali
// @version    1.7
// @author	   jawz
// @description  jizzle
// @match      https://s3.amazonaws.com/mturk_bulk/hits/*
// @require     https://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/12576/jawz%20Binoy%20Bhansali.user.js
// @updateURL https://update.greasyfork.org/scripts/12576/jawz%20Binoy%20Bhansali.meta.js
// ==/UserScript==
//web_url
var Search = 'http://www.crunchbase.com/search?show_results=1&homepage_search_input=';
var url = Search + $('td:contains(Company Name)').next().text().replace(/ /g, '+');
var url2 = 'http://' + $('td:contains(Company Website)').next().text().replace('http://', '').replace('https://', '');

var windowLeft = window.screenX;
var windowTop = window.screenY;
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight + 47;
var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=no,titlebar=yes";

if (url2.indexOf('N/A') >= 0)
    url2 = 'https://www.google.com/search?q=' + $('td:contains(Company Name)').next().text().replace(/&/g, '%26').replace(/'/g, '%27') + ' Healthcare';
else
    var popup = window.open(url, 'remote', 'height=' + ((windowHeight / 2) - 50) + ', width=' + windowWidth + ', left=' + (windowLeft + windowWidth) + ',top=' + windowTop + specs,false);
var popup2 = window.open(url2, 'remote1', 'height=' + (windowHeight / 2) + ', width=' + windowWidth + ', left=' + (windowLeft + windowWidth) + ',top=' + (windowTop + windowHeight / 2) + specs,false);
        
window.onbeforeunload = function (e) { 
    popup2.close();
    popup.close();
}

$(document).keyup(function (event) {
	var key = event.keyCode;
	        
	if (key=='65') {
	    $('input').eq(2).val('Active');
        $('#submitButton').click();
	}
	        
	if (key=='83') {
	    $('input').eq(2).val('Sold/Acquired');
        $('#submitButton').click();
	}
	        
	if (key=='70') {
	    $('input').eq(2).val('Failed/Shut Down');
        $('#submitButton').click();
    }
    
    if (key=='78') {
	    $('input').eq(1).val('N/A');
        $('#submitButton').click();
    }
});