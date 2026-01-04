// ==UserScript==
// @name         DriverIdentifier.com driver downloader WITHOUT login or register!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download drivers without login/register on DriverIdentifier!
// @author       #EMBER
// @match        https://www.driveridentifier.com/scan/*/driver-detail/*
// @match        http://www.driveridentifier.com/scan/*/driver-detail/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/405746/DriverIdentifiercom%20driver%20downloader%20WITHOUT%20login%20or%20register%21.user.js
// @updateURL https://update.greasyfork.org/scripts/405746/DriverIdentifiercom%20driver%20downloader%20WITHOUT%20login%20or%20register%21.meta.js
// ==/UserScript==

(function() {
try{
    var scriptStart = 2000;
    setTimeout(()=>{
      var link = $("a").eq(11).attr('href');
        min(link);
    }, scriptStart)

    function min(link)
    {
        var s = 0;
        var dlink = link.split('=')[1];
		var ampPos = dlink.indexOf('&');
		if(ampPos != -1) {
		  s = dlink.substring(0, ampPos);
            decodeURL(s);
        }
    }

    function decodeURL(val)
    {
       if(val != 0)
       {
        var decoded = decodeURIComponent(val);
        $("a").eq(11).attr('href', decoded);
       }
    }

}catch(ex){}
})();