// ==UserScript==
// @name       jawz Emily McHale
// @version    1.0
// @author	   jawz
// @description  Something
// @match      https://s3.amazonaws.com/mturk_bulk/hits/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/13224/jawz%20Emily%20McHale.user.js
// @updateURL https://update.greasyfork.org/scripts/13224/jawz%20Emily%20McHale.meta.js
// ==/UserScript==

if ($('h3:contains("Find the Postal Code")').length) {
    var one = $('p').eq(1).find('b').text();
    var two = $('p').eq(2).find('b').text();
    var three = $('p').eq(3).find('b').text();
    var four = $('p').eq(4).find('b').text();
    var together = one + ' ' + two + ' ' + three + ' ' + four;
    
    var url = "http://www.google.com/search?q=" + together;
    url = url.replace(/&/g, "%26").replace(/#/g, "%23").replace(/[ ]/g, "+");
    var windowLeft = window.screenX;
    var windowTop = window.screenY;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight + 47;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=no,titlebar=yes";
    
    var popup = window.open(url, 'remote', 'height=' + windowHeight + ', width=' + windowWidth + ', left=' + (windowLeft + windowWidth) + ',top=' + windowTop + specs,false);
    
    window.onbeforeunload = function (e) { popup.close(); }
}