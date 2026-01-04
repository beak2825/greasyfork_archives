// ==UserScript==
// @name         Sprint Color Spectrum Sprint
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  shows colored usernames based on 40L Sprint time
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385652/Sprint%20Color%20Spectrum%20Sprint.user.js
// @updateURL https://update.greasyfork.org/scripts/385652/Sprint%20Color%20Spectrum%20Sprint.meta.js
// ==/UserScript==

/**************************
Sprint Color Spectrum Script       
**************************/

(function() {
    window.addEventListener('load', function(){

function colorize(limit){
    Game["links"] = document.getElementsByTagName('a')
	for (var o = 0; (o < Game["links"].length) && limit; o++) {
		var regexp = /(https:\/\/jstris\.jezevec10\.com\/u\/)([^\/]*)(.*)/g;
		var parts = regexp.exec(Game["links"][o].href);
		if(parts && parts[2] && !parts[3]){
            var execEval=`limit--;
			var url = "https://jstris.jezevec10.com/api/u/"+parts[2]+"/records/1?mode=1"
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
			  if (this.readyState == 4 && this.status == 200) {
			  	var best = 25
			  	var worst = 100
                var a = [255,0,0] //best
				var b = [128,0,128] //medium
				var d = [0,255,255] //worst
			    var min = JSON.parse(this.responseText).min;
				(min!=0&&min<best)&&(min=best);min>worst&&(min=worst);
				var c=2*((min-best)/(worst-best));1<=c&&(--c,a=b,b=d);
				var e=[parseInt(0|a[0]+(b[0]-a[0])*c,10),parseInt(0|a[1]+(b[1]-a[1])*c,10),parseInt(0|a[2]+(b[2]-a[2])*c,10)];
				var color = "rgb("+e[0]+","+e[1]+","+e[2]+")"
				min||(color='rgb(75,75,75)')
			    Game["links"][`+o+`].style.color = color
			  }
			};
			xhr.open("GET", url, true);
			xhr.send();`
            eval(execEval)
		}
	}
}

Game["colorize"] = colorize;

if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}

var sendChatFunc = Live['prototype']['sendChat'].toString()
var params3 = getParams(sendChatFunc)


sendChatFunc = "if(chatInput.value.startsWith('/color')){amount=chatInput.value.split(' ')[1];Game['colorize'](+amount);chatInput.value='';msg=document.createElement('div');msg.className='chl srv';msg.innerHTML='Colorizing '+amount+' username(s)';ch1.appendChild(msg);return}" + trim(sendChatFunc)
Live['prototype']["sendChat"] = new Function(...params3, sendChatFunc);

});
})();