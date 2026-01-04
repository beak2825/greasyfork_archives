// ==UserScript==
// @name         Daimayuan Online Judge++ - Js
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  增强Daimayuan OJ的功能
// @author       Chen Jun
// @match        *://oj.daimayuan.top/*
// @icon         <$ICON$>
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/519328/Daimayuan%20Online%20Judge%2B%2B%20-%20Js.user.js
// @updateURL https://update.greasyfork.org/scripts/519328/Daimayuan%20Online%20Judge%2B%2B%20-%20Js.meta.js
// ==/UserScript==
function query(url,node){
	function reqListener(){
		var tmp=new Document();
		var tt=document.createElement('html');
		tt.innerHTML=this.responseText;
		tmp.appendChild(tt);
		console.log(tmp);
		var t=tmp.querySelectorAll(".col-sm-2");
		if(t.length==0){
			node.title='Contest solving : no results.';
		}
		for(let x of t){
            console.log(x);
			if(x.innerHTML=='Wrong Answer'){
				node.innerHTML+='-WA';
				break;
			}
			if(x.innerHTML=='Time Limit Exceeded'){
				node.innerHTML+='-TLE';
				break;
			}
			if(x.innerHTML=='Runtime Error'){
				node.innerHTML+='-RE';
				break;
			}
			if(x.innerHTML=='Memory Limit Exceeded'){
				node.innerHTML+='-MLE';
				break;
			}
		}
	}
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", reqListener);
	oReq.open("GET", url);
	oReq.send();
}
(function() {
	// value defines
	var username='panda888';
	var a;
	// end

	// 100 -> colorful
	if(location.href.search('submission')!=-1){
		a=document.querySelectorAll(".uoj-score");
		for(let x of a){
			if(x.innerHTML=="100"){
                x.innerHTML+='-AC'
				continue;
			}
			var url=x.href;
			query(url,x);
		}
		a=document.querySelectorAll(".small");
		for(let x of a){
			if(x.innerHTML=="Compile Error"){
				x.classList='uoj-score';
				x.innerHTML='CE';
                x.style='color: rgb(204, 0, 0)';
			}
		}
	}
	// end

})();