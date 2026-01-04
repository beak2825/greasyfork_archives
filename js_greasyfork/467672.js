// ==UserScript==
// @name           Jlab Fake Results
// @description    Shows That You All The Questions Correct and stuff
// @include        *://education.jlab.org/solquiz/question.html*
// @author       levisurely
// @license      Apache-2.0
// @version 0.0.2
// @grant        none
// @namespace https://github.com/horsehair/userscripts/blob/main/Jlab%20Fake%20Results.user.js
// @downloadURL https://update.greasyfork.org/scripts/467672/Jlab%20Fake%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/467672/Jlab%20Fake%20Results.meta.js
// ==/UserScript==

(function() {
    'use strict';

var NumOfQs = document.getElementsByClassName('rresult').length
var oC=document.getElementsByClassName('ansi').length
var oR=document.getElementsByClassName('ansc').length
for (var i=1;i<NumOfQs;i++) {
	if (!document.getElementsByClassName('ansi')){
		break;
	}
	if (document.getElementsByClassName('ansi').length!=0){
document.getElementsByClassName("ansi")[0].innerText = "Correct!";
document.getElementsByClassName("ansi")[0].className = "ansc";
	}
}

document.querySelector("#recovery > p > span").innerText = `1972352911${Math.floor(Math.random() * 100)}`
document.getElementById('totalscore').innerHTML='Total Score: 100.00%';
document.getElementsByClassName('tableres')[0].innerHTML='You answered '+NumOfQs+' questions out of '+NumOfQs+' correctly!';
document.getElementsByClassName('tablescore')[0].innerHTML='Score for this section: 100.00%';

})();