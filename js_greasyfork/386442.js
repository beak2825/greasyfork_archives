// ==UserScript==
// @name         csdn copy
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  copy without login!
// @author       longslee
// @match        https://blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386442/csdn%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/386442/csdn%20copy.meta.js
// ==/UserScript==

+function() {
    'use strict';
    // Your code here...
    //auto expand
    //document.getElementById('btn-readmore').click();
    document.getElementsByClassName('btn-readmore')[0].click();
    document.getElementById('mainBox').style.width = '900px';

    var regDiv = document.getElementById('passportbox');
    regDiv.style.display="none";

    var loginShadow = document.getElementsByClassName('login-mark')[0];
    loginShadow.style.display="none";



	if(typeof mdcp != 'undefined'){
		mdcp.signin = function(event){
		var div = event.target.parentElement;
		var txt = div.innerText;
		var tx=document.createElement("textarea");
		tx.id='bucunzai'
		tx.value=txt;
		document.body.appendChild(tx);
		var bucunzai = document.getElementById('bucunzai');
		bucunzai.select();
		document.execCommand("copy");
		bucunzai.parentNode.removeChild(bucunzai);
	   }
	}

   if(typeof hljs != 'undefined'){
		hljs.signin = function(event){
			debugger;
			var div = event.target.parentElement;
			var txt = div.innerText;
			var tx=document.createElement("textarea");
			tx.id='bucunzai'
			tx.value=txt;
			document.body.appendChild(tx);
			var bucunzai = document.getElementById('bucunzai');
			bucunzai.select();
			document.execCommand("copy");
			bucunzai.parentNode.removeChild(bucunzai);
		}
	}
}();