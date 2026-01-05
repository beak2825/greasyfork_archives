// ==UserScript==
// @name       jawz David White
// @version    1.0
// @author	   jawz
// @description  adsfd
// @match      https://s3.amazonaws.com/mturk_bulk/hits/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/12901/jawz%20David%20White.user.js
// @updateURL https://update.greasyfork.org/scripts/12901/jawz%20David%20White.meta.js
// ==/UserScript==

url1 = $('a').eq(0).attr("href");
url2 = $('a').eq(1).attr("href");
var windowLeft = window.screenX;
var windowTop = window.screenY;
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight - 300;
var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=no,titlebar=yes";
    
var popup = window.open(url1, 'remote', 'height=' + ((windowHeight / 2) - 50) + ', width=' + windowWidth + ', left=' + (windowLeft + windowWidth) + ',top=' + windowTop + specs,false);
var popup2 = window.open(url2, 'remote1', 'height=' + (windowHeight / 2) + ', width=' + windowWidth + ', left=' + (windowLeft + windowWidth) + ',top=' + (windowTop + windowHeight / 2) + specs,false);
        
window.onbeforeunload = function (e) { 
    popup.close();
    popup2.close();
}

$('input[name="Q1Answer"]').click(function() {
    $('#submitButton').click();
});