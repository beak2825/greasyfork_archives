// ==UserScript==
// @name         BiliBili BV to AV
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动跳转链接到原始av链接
// @author       Harumoto
// @match        https://*.bilibili.com/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/398629/BiliBili%20BV%20to%20AV.user.js
// @updateURL https://update.greasyfork.org/scripts/398629/BiliBili%20BV%20to%20AV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.warn("BV to AV is Running...");

    var isBV = false;

    var table='fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF'
	var tr={}
	for(var i=0;i<58;i++) {
		tr[table[i]]=i
	}
	var s=[11,10,3,8,4,6]
	var xor=177451812
	var add=8728348608
	var final="";

	function toAV(fromBV) {
		var r=0
		for(var i=0;i<6;i++) {
			r+=tr[fromBV[s[i]]]*Math.pow(58,i);
		}

		return (r-add)^xor
	}

   console.warn(location.href);
   var ourl = location.href;
   var bvnum = "";

    var p = '';

     for(var i=0;i<ourl.length;i++) {
   		if(ourl[i] == '=' && ourl[i-1] == 'p') {
            p = ourl[i+1];
        }
   }

   for(var i=0;i<ourl.length;i++) {
   		if(ourl[i-1] == '/' && (ourl[i] == 'B' || ourl[i] == 'b')) {
   			isBV = true;
   			for(var j=i;j<100;j++) {
   				console.log(ourl[j]);
   				bvnum += ourl[j];
   				if(ourl[j+1] == '?' || ourl[j+1] == '/' || j==ourl.length) {
                    console.warn("the bv number is: "+bvnum);
                    isBV = true;
   					break;
   				}
   			}
   		}else{
   			isBV=false;
   		}
   }

   if(isBV = true){
       if(bvnum[0] == 'B' || bvnum[0] == 'b'){
       	console.warn("Attention: Redirecting...");
       if(p==''){
         location.href = "https://www.bilibili.com/video/av"+toAV(bvnum).toString();
       }else{location.href = "https://www.bilibili.com/video/av"+toAV(bvnum).toString()+"?p="+p;  }
   }
   }

   function jumpav(url)
   {
   	location.href=url;
   }

})();