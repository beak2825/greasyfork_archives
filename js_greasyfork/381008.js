// ==UserScript==
// @name airtel money
// @match https://ecom.airtelbank.com/irctc/*
// @grant none
// @namespace airtell fill
// @description contect me butter knowedge
// @version 1
// @downloadURL https://update.greasyfork.org/scripts/381008/airtel%20money.user.js
// @updateURL https://update.greasyfork.org/scripts/381008/airtel%20money.meta.js
// ==/UserScript==
/* Airtel Money */
setInterval(function () {airt();}, 1000);
var use=0;
var pass=0;
var sub=0;
function airt(){
var inp = new Event("input");
var focu = new Event("focus");
var come = new Event("compositionend");
var blu = new Event("blur");
var coms  = new Event("compositionstart");
var chan = new Event("change");
var cli = new Event("click");
var su = new Event("submit");
var des = new Event("$destroy");
	if(use !=1)
			{
				document.getElementById('usernameInput').dispatchEvent(blu);
				document.getElementById('usernameInput').dispatchEvent(inp);
				document.getElementById('usernameInput').value= "*********";
				document.getElementById('usernameInput').dispatchEvent(chan);
                document.getElementById('usernameInput').dispatchEvent(come);
                document.getElementById('usernameInput').dispatchEvent(coms);
				use=1;
			}
  if(pass !=1)
			{
				document.getElementById('mpinInput').dispatchEvent(blu);
				document.getElementById('mpinInput').dispatchEvent(inp);
				document.getElementById('mpinInput').value= "***";
				document.getElementById('mpinInput').dispatchEvent(chan);
                document.getElementById('mpinInput').dispatchEvent(come);
                document.getElementById('mpinInput').dispatchEvent(coms);
				pass=1;
			}
if(use == 1 && pass == 1 && sub == 0)
                    {
                      document.getElementsByTagName('button')[0].addEventListener('click', function () {
                      document.getElementsByTagName('button')[0].dispatchEvent(cli);
                     document.getElementsByTagName('button')[0].dispatchEvent(des);
                     document.getElementsByTagName('button')[0].dispatchEvent(des);
                      document.getElementsByTagName('button')[0].dispatchEvent(su);
                    });
                      sub=1;
                    setTimeout(function(){ document.getElementsByTagName('button')[0].click(); }, 1000);
                    }
          
}
airt();