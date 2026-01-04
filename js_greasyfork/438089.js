// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  É um script de usar no ab60ac47cf
// @author       You
// @match        https://freebitco.in/
// @icon         https://www.google.com/s2/favicons?domain=freebitco.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438089/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/438089/New%20Userscript.meta.js
// ==/UserScript==


(function() {
    'use strict';

var meuIP = "-";

var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", 'https://ipinfo.io/json');
  xmlhttp.send();
  xmlhttp.onload = function(e) {
    //alert("Seu IP é: "+JSON.parse(xmlhttp.response).ip);
      meuIP = JSON.parse(xmlhttp.response).ip;
  }


setInterval(function(){
    if(document.getElementsByClassName("h-captcha")[0].innerHTML.length > 2000){
        document.getElementById("free_play_form_button").click();

	setInterval(function(){
		if(document.getElementById("free_play_error").innerText.includes(" IP ")){
			document.getElementsByTagName("title")[0].innerText = "erroIP"+
            " ("+document.getElementsByClassName("balanceli")[0].innerText.replace(" BTC","")+");"+meuIP;

		}else if(document.getElementById("free_play_result").innerText.includes("You win 0.")){
			document.getElementsByTagName("title")[0].innerText = "GG!" +
            document.getElementById("free_play_result").innerText.split(',')[0].replace("You win ","").replace(" BTC","") +
		    " ("+document.getElementsByClassName("balanceli")[0].innerText.replace(" BTC","")+");"+meuIP;

        }
	},100);

    }
},25000);

})();