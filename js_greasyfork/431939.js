// ==UserScript==
// @name         Beatport audiofile links in console
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  test
// @author       You
// @match        https://www.beatport.com/*
// @icon         https://www.google.com/s2/favicons?domain=beatport.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431939/Beatport%20audiofile%20links%20in%20console.user.js
// @updateURL https://update.greasyfork.org/scripts/431939/Beatport%20audiofile%20links%20in%20console.meta.js
// ==/UserScript==
var started=false;
(function() {
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        console.log('request started!');
        this.addEventListener('load', function() {
            //console.log('request completed!');
            //console.log(this); //this.responseURL: "https://needledrop.beatport.com/1630345460_d6a1fc98467177c84ebc0702e5a4e440ceec600c/8/6/4/8643d4f7-9319-4971-b9fd-4329a376e3e7.128k.aac-56.aac?start=0&end=509080"
            //console.log(this.readyState);
            //console.log(this.responseText);
            if(!started)
            {
				//started=true;
                if (this.responseURL.includes('needledrop.beatport.com') && this.responseURL.includes('m3u8') )
                {
					var endTimestamp = parseInt(this.responseURL.replace(/(.*)end\=/g,''));
					var seconds = endTimestamp/1000;
					generateUrls(this.responseURL, seconds);
				}
            }
        });
        origOpen.apply(this, arguments);
    };
})();

function generateUrls(url, seconds){
	var parts= Math.ceil(seconds/5);
	var urls=[];
	for(var i=1; i<=parts; i++){
		urls.push( url.replace('.m3u8', '-'+i+'.aac'));
	}
	console.log(urls);
	console.log(urls.join("\r\n"));
}