// ==UserScript==
// @name         ユウパケット自動チェックツール
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       le seul
// @match        https://mgr.post.japanpost.jp/C30P01EventAction.do
// @match        https://mgr.post.japanpost.jp/A10P01EventAction.do
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40791/%E3%83%A6%E3%82%A6%E3%83%91%E3%82%B1%E3%83%83%E3%83%88%E8%87%AA%E5%8B%95%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/40791/%E3%83%A6%E3%82%A6%E3%83%91%E3%82%B1%E3%83%83%E3%83%88%E8%87%AA%E5%8B%95%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

(function(){
	var script=document.createElement('script');
	/*jshint multistr: true */
	script.innerHTML="\
        function ToDBC(txtstring) {\
            var tmp = '';\
            for (var i = 0; i < txtstring.length; i++) {\
                if (txtstring.charCodeAt(i) == 32) {\
                    tmp = tmp + String.fromCharCode(12288);\
                    }\
                if (txtstring.charCodeAt(i) < 127) {\
                    tmp = tmp + String.fromCharCode(txtstring.charCodeAt(i) + 65248);\
                    }\
                }\
            return tmp;\
        }\
		function check(){\
	       	var S=document.getElementById('order-number').value.split('\\n');\
	       	L=[];\
	       	for (var i=0;i<S.length;i++){\
	       		if (L.indexOf(S[i].replace(' ',''))<0){\
	       			if (S[i].replace(' ','')!==''){\
	       				L.push(S[i].replace(' ',''));\
	       				}}}\
	       	var leng=L.length;\
	       	var odd=document.getElementsByClassName('CellOdd');\
	       	var len1=odd.length;\
	       	var even=document.getElementsByClassName('CellEven');\
	       	var len2=even.length;\
			for (var m=0;m<len1;m++){\
				var text=odd[m].innerHTML;\
				for (var b=0;b<leng;b++){\
					var dh=L[b].slice(11,15)+'-'+L[b].slice(18);\
					if(text.indexOf(ToDBC(dh))>=0){\
						odd[m].getElementsByTagName('input')[0].click();\
						}}}\
			for (var n=0;n<len2;n++){\
				var text1=even[n].innerHTML;\
				for (var p=0;p<leng;p++){\
					dh2=L[p].slice(11,15)+'-'+L[p].slice(18);\
					if(text1.indexOf(ToDBC(dh2))>=0){\
						even[n].getElementsByTagName('input')[0].click();\
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
	button.innerHTML='チェック';
	form.appendChild(textarea);
	form.appendChild(button);
	document.getElementsByClassName('help')[0].appendChild(form);
})();