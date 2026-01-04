// ==UserScript==
// @name         Luogu Real Academic
// @namespace    http://tampermonkey.net/
// @version      v1.2
// @description  Customized for EricWan, script writer limesarine
// @author       limesarine
// @match        *://www.luogu.com/*
// @match        *://www.luogu.com.cn/*
// @license      © 2024 Limesarine. All rights reserved.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510442/Luogu%20Real%20Academic.user.js
// @updateURL https://update.greasyfork.org/scripts/510442/Luogu%20Real%20Academic.meta.js
// ==/UserScript==
function getDiscuss() {
	let divs=document.getElementsByClassName('lg-article');
	for(let i=0;i<divs.length;i++) {
		if(divs[i].childNodes[1] && divs[i].childNodes[1].innerText
		   && divs[i].childNodes[1].innerText.includes('最近讨论'))
			return divs[i];
	}
}
function deal() {
	let url=location.href;
	if(url.includes('?forum=problem') || url.includes('?forum=academics')
	  || url.includes('?forum=relevantaffairs') || url.includes('?forum=service')) {
		location.href="/";
	}
	if(url.match(/.*?\/discuss\/\d(\d)*?/) && document.getElementsByClassName('side')[0] && document.getElementsByClassName('side')[0].childNodes[1]) {
		let e=document.getElementsByClassName('side')[0].childNodes[1].childNodes[3];
        if(e)
        {
            let txt=e.innerText;
            if(txt.includes('灌水')) {
                location.href="/";
            }
        }
	}
	if(url.endsWith(".cn/") || url.endsWith(".com/") ||
	   url.endsWith("cn/") || url.endsWith("com/")) {
		let e=getDiscuss().childNodes;
		for(let i=2;i<e.length;i++) {
			if(e[i] && e[i].innerText
               && e[i].tagName && e[i].tagName.toLowerCase()=="section"
               && !(
                e[i].childNodes[1] && e[i].childNodes[1].childNodes[3] && e[i].childNodes[1].childNodes[3].childNodes[7].childNodes[6]
                && e[i].childNodes[1].childNodes[3].childNodes[7].childNodes[6].innerText.includes('置顶')))
				e[i].style.display="none";
		}
	}
}
(function() {
    'use strict';

    deal();
    const observer=new MutationObserver(function(mutationsList,observer){
    	deal();
    });
    observer.observe(document,{childList:true,subtree:true});
})();