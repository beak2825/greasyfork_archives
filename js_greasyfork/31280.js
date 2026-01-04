// ==UserScript==
// @name         ccyycn get keys
// @namespace  none
// @version      0.5
// @description  get your keys
// @author       You
// @match        http://bundle.ccyycn.com/order/id/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/31280/ccyycn%20get%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/31280/ccyycn%20get%20keys.meta.js
// ==/UserScript==

GM_addStyle(".operation a{color:#fff;text-decoration: none;} .operation a:focus, .operation a:hover{color:#ccc;} .operation input{opacity: 0;position: absolute;top: 0;left: 0;}");

(function() {
	'use strict';
	let getKey = '<a class="scratch" href="javascript:;">一键刮Key</a> | <a class="exchange" href="javascript:;">一键兑换点数</a> | <a class="defaultCopy" href="javascript:;">复制所有Key(普通)</a> | <a class="asfCopy" href="javascript:;">复制所有Key(ASF)</a><input class="keys" type="text" value="">';
	let el = document.createElement('div');
	let ots = document.querySelector('.showkey-box');
	let after = document.querySelector('h2');
	let gkey= document.querySelectorAll('.container .deliver-game .deliver-gkey');
	el.className='operation';
	el.innerHTML = getKey;
	ots.insertBefore(el,after.nextSibling);
    ots.querySelector(".scratch").addEventListener("click", function(){
		gkey.forEach(function(e){
	    	let scrape = e.querySelector('.deliver-btn');
	        if(scrape){
	            scrape.click();
	        }
    	});
   	});
   	ots.querySelector(".exchange").addEventListener("click", function(){
		gkey.forEach(function(e){
	    	let scrape = e.querySelector('.exchange-btn');
	        if(scrape){
	            scrape.click();
	        }
    	});
   	});
   	let copyKey = function(copy) {
		copy.select();
		try{
			document.execCommand('copy');
			alert('复制成功');
		}catch(e){
			alert('复制失败');
		}
   	};
   	ots.querySelector(".defaultCopy").addEventListener("click", function(){
   		let name= [];
		let key = [];
		let generalKey = [];
   		gkey.forEach(function(e){
	    	let scrape = e.querySelector('.deliver-btn');
	        if(scrape){
	            return;
	        }
	        name = e.parentNode.previousElementSibling.querySelector('div').innerText.replace(/\s+/g,"");
        	key = e.innerText.replace(/\s+/g,"");
        	generalKey.push(name+':'+key);
    	});
		generalKey = generalKey.join(',');
		let copy = ots.querySelector('.keys');
		copy.value = generalKey;
		copyKey(copy);
   	});
	ots.querySelector(".asfCopy").addEventListener("click", function(){
		let name= [];
		let key = [];
		gkey.forEach(function(e){
	    	let scrape = e.querySelector('.deliver-btn');
	        if(scrape){
	            return;
	        }
        	key.push(e.innerText.replace(/\s+/g,""));
    	});
		key = key.join(',');
		let copy = ots.querySelector('.keys');
		copy.value = key;
		copyKey(copy);
   	});
    // Your code here...
})();