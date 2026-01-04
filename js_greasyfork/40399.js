// ==UserScript==
// @name         Bonnae News
// @namespace    https://github.com/harryhare/Bonnae-News
// @version      0.7.0
// @description  for Bonnae broadcast on douban.com
// @author       harryhare
// @license      GPL 3.0
// @icon         https://raw.githubusercontent.com/harryhare/userscript/master/index.png
// @match        https://www.douban.com/**
// @include      https://www.douban.com/**
// @match        https://m.douban.com/**
// @include      https://m.douban.com/**
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/40399/Bonnae%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/40399/Bonnae%20News.meta.js
// ==/UserScript==

function get_targets(){
	if (window.location.href.startsWith("https://www.douban.com")){
		return get_targets_for_www();
	}
	if (window.location.href.startsWith("https://m.douban.com")){
		return get_targets_for_m();
	}
}
function get_targets_for_www(){
	return document.querySelectorAll('.new-status .status-item[data-uid="1540691"] .mod .bd .status-saying blockquote p');
}
function get_targets_for_m(){
	var targets=[];
	var ss=document.querySelectorAll('ul.status-list li div.desc a[href="/people/1540691/"]');
	for(let i=0;i<ss.length;i++){
		var t=ss[i].parentElement.parentElement.querySelector("div.content div");
		if (t!=null){
			targets.push(t);
		}
	}
	return targets;
}


function attach_result(t,href){
	if (window.location.href.startsWith("https://www.douban.com")){
		return attach_result_for_www(t,href);
	}
	if (window.location.href.startsWith("https://m.douban.com")){
		return attach_result_for_m(t,href);
	}
}

function attach_result_for_www(t,href){
	var n1=document.createElement('a');
	var n2=document.createElement('blockquote');
	n2.appendChild(n1);

	n1.textContent=href;
	n1.setAttribute('href',href);
	t.parentElement.parentElement.appendChild(n2);
	return;
}

function attach_result_for_m(t,href){
	var n1=document.createElement('a');
	n1.textContent=href;
	n1.setAttribute('href',href);
	t.parentElement.parentElement.parentElement.appendChild(n1);
	return;
}


function edit_page() {
	/*
	http://upaste.me/xxxxx
	https://slexy.org/view/xxxxx
	https://paste2.org/xxxxx (注意代码区分大小写)
	https://paste.ee/p/xxxxx
	*/
	var targets = get_targets();
	console.log("total targets"+targets.length);
	var url_prefix=new Map();
	url_prefix['upaste.me']='http://upaste.me/';
	url_prefix['slexy.org']='https://slexy.org/view/';
	url_prefix['paste2.org']='https://paste2.org/';
	url_prefix['paste.ee']='https://paste.ee/p/'
	const default_prefix='upaste.me';
	const max_code_length=100;

	for(let i=0;i<targets.length;i++){
		var t=targets[i];
		var content=t.textContent;
		if(content.length>max_code_length){
			continue;
		}
		var reg=/([a-zA-Z0-9]{4,})\s*\(\s*([a-z0-9]+.[a-z]+)(\/[a-zA-Z0-9]+\/)?\s*\)/g;
		var reg2=/([a-zA-Z0-9]{10,})/g;
		var result=reg.exec(content);
		var href='';
		var find=false;
		if(result && result.length>2 && result[2]){
			href=url_prefix[result[2]]+result[1];
			find=true;
		}
		if(!find){
			result=reg2.exec(content);
			if(result && result.length>1){
				href=url_prefix[default_prefix]+result[1];
				find=true;
			}
		}
		if(find){
			attach_result(t,href);
		}
	}
}

(function(){
	if (window.location.href.startsWith("https://www.douban.com")){
		edit_page();
	}
	if (window.location.href.startsWith("https://m.douban.com")){
		setTimeout(edit_page,2000);
	}
})();
