// ==UserScript==
// @name         Bonnae News With Text
// @namespace    https://github.com/harryhare/userscript
// @version      0.7.6
// @description  for Bonnae broadcast on douban.com
// @author       harryhare
// @license      GPL 3.0
// @icon         https://raw.githubusercontent.com/harryhare/Bonnae-News/master/index.png
// @match        https://www.douban.com/**
// @include      https://www.douban.com/**
// @match        https://m.douban.com/**
// @include      https://m.douban.com/**
// @grant        GM_xmlhttpRequest
// @connect      upaste.me
// @connect      slexy.org
// @connect      paste2.org
// @connect      paste.ee
// @downloadURL https://update.greasyfork.org/scripts/40424/Bonnae%20News%20With%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/40424/Bonnae%20News%20With%20Text.meta.js
// ==/UserScript==

/*
	http://upaste.me/xxxxx
	https://slexy.org/view/xxxxx
	https://paste2.org/xxxxx
	https://paste.ee/p/xxxxx
*/
var url_prefix=new Map();
url_prefix['upaste.me']='http://upaste.me/';
url_prefix['slexy.org']='https://slexy.org/view/';
url_prefix['paste2.org']='https://paste2.org/';
url_prefix['paste.ee']='https://paste.ee/p/';
const default_prefix='slexy.org';
const max_code_length=100;
var url_getContent=new Map();
url_getContent['upaste.me']=getContent1;
url_getContent['slexy.org']=getContent2;
url_getContent['paste2.org']=getContent3;
url_getContent['paste.ee']=getContent4;
var url_node=new Map();
var url_node_multi=new Map();

function getContent1(doc){
	return doc.getElementsByTagName('textarea')[0].innerHTML;
}
function getContent2(doc){
	return doc.getElementsByClassName('text')[0].innerHTML;
}
function getContent3(doc){
	return doc.getElementsByClassName('highlight code')[0].innerHTML;
}
function getContent4(doc){
	return doc.getElementsByClassName('editor')[0].innerHTML;
}
function getContent(response){
	var parser=new window.DOMParser();
	var x=response.response;
	var xmlDoc=parser.parseFromString(x,"text/html");
	var url=response.finalUrl;
	var text='';
	var reg=/https?:\/\/([a-zA-Z0-9]+\.[a-z]+)(\/p\/)?/g;
	var result=reg.exec(url);
	if(result && result.length>1 && result[1] && url_getContent[result[1]]){
		return url_getContent[result[1]](xmlDoc);
	}
	return "";
}

function attachContent(response){
	if(response.status!=200){
		return;
	}
	if(!url_node[response.finalUrl]){
		return;
	}
	for(var i=0;i<url_node[response.finalUrl].length;i++){
		var node=url_node[response.finalUrl][i]
		if(!node){
		    return;
		}
		var text=getContent(response);
		if(!text){
		    return;
		}
		node.innerHTML=text;
		node.style='height:52px; overflow: hidden;';
	}
}

function onClick(e){
	//console.log(e.target.attachId);
	var n3=url_node_multi[e.target.attachId];
	if(e.target.innerHTML=='收起'){
		e.target.innerHTML='展开';
		n3.style='height:52px; overflow: hidden;';
	}else{
		e.target.innerHTML='收起';
		n3.style='';
	}
	e.stopPropagation();
}

function get_targets(){
	if (window.location.href.startsWith("https://www.douban.com")){
		return get_targets_for_www();
	}
	if (window.location.href.startsWith("https://m.douban.com")){
		return get_targets_for_m();
	}
}
function get_targets_for_www(){
	return document.querySelectorAll('.new-status .status-item[data-uid="54714905"] .mod .bd .status-saying blockquote p,.new-status .status-item[data-uid="61954750"] .mod .bd .status-saying blockquote p')
}
function get_targets_for_m(){
	var targets=[];
	var ss=document.querySelectorAll('ul.status-list li div.desc a[href="/people/54714905/"],ul.status-list li div.desc a[href="/people/54714905/"] a[href="/people/61954750/"]');
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
	t=t.parentElement;
	var n0=document.createElement('div');
	var n1=document.createElement('blockquote');
	var a=document.createElement('a');
	var b=document.createElement('button');
	t.parentElement.appendChild(n0);
	n0.appendChild(n1);
	n1.appendChild(a);
	n1.appendChild(b);
	a.textContent=href;
	a.setAttribute('href',href);
	b.innerHTML='展开';
	b.onclick=onClick;
	var text=document.createElement('blockquote');
	n0.appendChild(text);
	if(url_node[href]){
		url_node[href].push(text);
	}else{
		url_node[href]=[text];
	}
	b.attachId=href+url_node[href].length;
	url_node_multi[b.attachId]=text;
	text.id=href;
	GM_xmlhttpRequest({
		method: "GET",
		url: href,
		onload: attachContent,
	});
}

function attach_result_for_m(t,href){
	var n0=document.createElement('div');
	var a=document.createElement('a');
	var b=document.createElement('button');
	n0.appendChild(a);
	n0.appendChild(b);
	a.textContent=href;
	a.setAttribute('href',href);
	b.innerHTML='展开';
	b.onclick=onClick;
	var text=document.createElement('div');
	n0.appendChild(text);
	if(url_node[href]){
		url_node[href].push(text);
	}else{
		url_node[href]=[text];
	}
	b.attachId=href+url_node[href].length;
	url_node_multi[b.attachId]=text;
	text.id=href;
	GM_xmlhttpRequest({
		method: "GET",
		url: href,
		onload: attachContent,
	});
	t.parentElement.parentElement.parentElement.appendChild(n0);
}


function edit_page() {
	'use strict';
	var targets=get_targets();

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
