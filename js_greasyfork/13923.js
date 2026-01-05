// ==UserScript==
// @name           YouTube Show Buffer Speed
// @editor         Raphahxb (xbox)
// @description    Show Buffer Speed on Youtube
// @version	   1.0
// @include        htt*://*.youtube.com/*
// @grant		   none
// @match          http://*.youtube.com/*
// @match          https://*.youtube.com/*
// @encoding       UTF-8
// @namespace https://greasyfork.org/users/7000
// @downloadURL https://update.greasyfork.org/scripts/13923/YouTube%20Show%20Buffer%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/13923/YouTube%20Show%20Buffer%20Speed.meta.js
// ==/UserScript==


function bytesToSize(bytes, precision)
    {  
        var kilobyte = 1024;
        var megabyte = kilobyte * 1024;
        var gigabyte = megabyte * 1024;
        var terabyte = gigabyte * 1024;
       
        if ((bytes >= 0) && (bytes < kilobyte)) {
            return bytes + ' B';
     
        } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
            return (bytes / kilobyte).toFixed(precision) + ' KB';
     
        } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
            return (bytes / megabyte).toFixed(precision) + ' MB';
     
        } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
            return (bytes / gigabyte).toFixed(precision) + ' GB';
     
        } else if (bytes >= terabyte) {
            return (bytes / terabyte).toFixed(precision) + ' TB';
     
        } else {
            return bytes + ' B';
        }
    }
	
var d=1;
var lastbytes=0;
var loadedbytes=0;
var totalbytes=0;
var startedbytes=0;
function bytesloaded() {
    if(elem = document.getElementById('movie_player')) {
	
		if (typeof elem.getVideoBytesTotal == 'function') {
		//if (elem.getVideoBytesTotal()) {
			totalbytes = elem.getVideoBytesTotal();
			loadedbytes = elem.getVideoBytesLoaded();
			startedbytes = elem.getVideoStartBytes();
			//if (loadedbytes > 0) {
			//alert(d);
				if (d < 4) {
					/*
					var now = elem.getVideoBytesLoaded();
					var tot = (now-lastbytes2)*4;
					lastbytes2 = now;
					document.getElementById('bufferspeed').innerHTML = bytesToSize(tot) + "/s";
					*/
					
					

					if (document.getElementById('bytesload')) {
						document.getElementById('startedbytes').innerHTML = bytesToSize(startedbytes);
						document.getElementById('bytesload').innerHTML = bytesToSize(loadedbytes);
						document.getElementById('bytestotal').innerHTML = bytesToSize(totalbytes);
						d++;
					}
					else {
						document.getElementById('watch-headline-title').innerHTML +=  '<BR><span style="font-size:10px;" id="bufferspeed"></span>&nbsp;&nbsp;&nbsp;<span style="font-size:10px;" id="bytesload"></span><span style="font-size:10px;">/</span><span style="font-size:10px;" id="bytestotal"> </span>&nbsp;&nbsp;&nbsp;<span style="font-size:10px;" id="startedbytes"> </span>';
						document.getElementById('bytesload').innerHTML = bytesToSize(loadedbytes);
						document.getElementById('bytestotal').innerHTML = bytesToSize(totalbytes);
						document.getElementById('startedbytes').innerHTML = bytesToSize(startedbytes);
					}
				}
				else if (d == 4) {
					var now = elem.getVideoBytesLoaded();
					var tot = (now-lastbytes)/4;
					lastbytes = now;
					document.getElementById('bufferspeed').innerHTML = bytesToSize(tot) + "/s";
					document.getElementById('bytesload').innerHTML = bytesToSize(loadedbytes);
					document.getElementById('bytestotal').innerHTML = bytesToSize(totalbytes);
					document.getElementById('startedbytes').innerHTML = bytesToSize(startedbytes);
					d=1;
				}
			//}
			//alert(bytesToSize(loadedbytes) + "/" + bytesToSize(totalbytes));""
		//}
		}
	}
    setTimeout(function () {
        bytesloaded();
    }, 1000);
}
bytesloaded();