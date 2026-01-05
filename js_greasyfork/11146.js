// ==UserScript==
// @name       jawz OCMP35
// @version    1.0
// @description  something useful
// @match      https://grainger.crowdcomputingsystems.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/11146/jawz%20OCMP35.user.js
// @updateURL https://update.greasyfork.org/scripts/11146/jawz%20OCMP35.meta.js
// ==/UserScript==

var allText = $('body').text();
if (allText.indexOf("Determine the category for a product") >= 0) {
    window.onbeforeunload = function (e) {
        popupW.close();
    }
    var url = allText.match("Product Description:(.*)")
    url = url[0];
    url = url.substring(21, url.length-14);
    url = url.replace(/[" "]/g, "+");
    url = url.replace("&", "%26");
    url = url.replace(",", "%2C");
    url = url.replace("/", "%2F");
    var grainger_URL = "http://www.grainger.com/search?nls=1&searchQuery=" + url;
    
    var halfScreen = screen.width/2; 
    var windowHeight = screen.height; 
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
    popupW = window.open(grainger_URL,'remote','height=' + windowHeight + ',width=' + halfScreen + ', left=' + halfScreen + ',top=0' + specs,false);
    
} else if (allText.indexOf("Place the Product in the Correct Category") >= 0) {
    window.onbeforeunload = function (e) {
        popupW.close();
    }
    var url = $('span[style="background-color: rgb(255, 255, 153);"]').text();
    url = url.replace(/[" "]/g, "+");
    url = url.replace("&", "%26");
    url = url.replace(",", "%2C");
    url = url.replace("/", "%2F");
    var grainger_URL = "http://www.grainger.com/search?nls=1&searchQuery=" + url;
    
    var halfScreen = screen.width/2; 
    var windowHeight = screen.height; 
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
    popupW = window.open(grainger_URL,'remote','height=' + windowHeight + ',width=' + halfScreen + ', left=' + halfScreen + ',top=0' + specs,false);
    
}