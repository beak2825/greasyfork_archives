// ==UserScript==
// @name         rakuten-check-order
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       le seul
// @match        https://order.rms.rakuten.co.jp/rms/mall/order/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40413/rakuten-check-order.user.js
// @updateURL https://update.greasyfork.org/scripts/40413/rakuten-check-order.meta.js
// ==/UserScript==

(function(){
	var script=document.createElement('script');
	/*jshint multistr: true */
	script.innerHTML="\
       function check(){\
	       	var S=document.getElementById('order-number').value.split('\\n');\
	       	L=[];\
	       	for (var i=0;i<S.length;i++){\
	       		if (L.indexOf(S[i].replace(' ',''))<0){\
	       			if (S[i].replace(' ','')!==''){\
	       				L.push(S[i].replace(' ',''));\
	       				}}}\
	       	var leng=L.length;\
	       	var lines=document.getElementsByClassName('odd');\
	       	var len1=lines.length;\
	       	var lines2=document.getElementsByClassName('even');\
	       	var len2=lines2.length;\
			for (var m=0;m<len1;m++){\
				var text=lines[m].innerHTML;\
				for (var b=0;b<leng;b++){\
					if(text.indexOf(L[b])>=0){\
						document.getElementsByName('order_number')[4*m].click();\
						}}}\
			for (var n=0;n<len2;n++){\
				var text1=lines2[n].innerHTML;\
				for (var p=0;p<leng;p++){\
					if(text1.indexOf(L[p])>=0){\
						document.getElementsByName('order_number')[4*n+2].click();\
						}}}\
	       	}";
	document.getElementsByTagName('head')[0].appendChild(script);
	var form=document.createElement('form');
	var textarea=document.createElement('textarea');
	textarea.setAttribute('id','order-number');
	textarea.setAttribute('style','width:200px;height:80px;');
	var button=document.createElement('button');
	button.setAttribute('type','button');
	button.setAttribute('onClick','check()');
	button.innerHTML='提交';
	form.appendChild(textarea);
	form.appendChild(button);
	document.getElementById('contentsWrap').appendChild(form);
})();