// ==UserScript==
// @name         follower diff for douban
// @namespace    http://laika42.top
// @version      0.1
// @description  show the change of your follower
// @author       harryhare
// @license      GPL 3.0
// @icon         https://raw.githubusercontent.com/harryhare/userscript/master/index.png
// @match        https://www.douban.com/contacts/rlist*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/370020/follower%20diff%20for%20douban.user.js
// @updateURL https://update.greasyfork.org/scripts/370020/follower%20diff%20for%20douban.meta.js
// ==/UserScript==

const gm_key="followers";
const interval=1000;

function getContent(response){
    var parser=new window.DOMParser();
    var xmlDoc=parser.parseFromString(response,"text/html");
	//xmlDoc.getElementsByTagName('textarea')[0].innerHTML;
	var users=xmlDoc.querySelectorAll("ul.user-list li");
	//console.log(users);
	var l=[];
	for (var i=0;i<users.length;i++){
		var user= users[i];
		var info=user.querySelector(".info h3 a")
		var id=user.id;
		var name=info.title;
		var url=info.href;
		l.push({id:id,name:name,url:url});
	}
    return l;
}


var page=0;
var followers=[]
function visit(){
    var xhr=new XMLHttpRequest()
    var url="/contacts/rlist?start="+(page*20);
    console.log('visit',url);
    xhr.open("GET",url,true);
    xhr.onreadystatechange = function (){
		if(xhr.readyState != 4 || xhr.status != 200 ){
			return;
		}
		//console.warn(xhr.responseText);
		var l=getContent(xhr.responseText);
		//console.warn(l);
		followers.push(...l);
		if(l.length>=20){
			page++;
			var interval_id = window.setInterval(()=>{
				window.clearInterval(interval_id);
				visit();
				},interval);
		}else{
			finish();
		}
	}
    xhr.send();
}

var mode=""

function finish(){
	if(mode=='save'){
		console.log(mode);
		console.log(followers);
		var follower_map=new Map()
		for(var i = 0;i<followers.length;i++){
			var f=followers[followers.length-1-i]
			follower_map[f.id]={
				name:f.name,
				url:f.url,
				index:i,
			}
		}
		GM_setValue(gm_key,follower_map);
	}else if(mode=='diff'){
		console.log(mode);
		var add_list=[];
		var left_list=[];
		var follower_map=GM_getValue(gm_key)
		for(var i = 0;i<followers.length;i++){
			var f=followers[followers.length-1-i]
			if(!follower_map[f.id]){
				add_list.push({
					id:f.id,
					name:f.name,
					url:f.url,
					index:i});
			}else{
				delete follower_map[f.id];
			}
		}
		console.log(follower_map);
		for (var id in follower_map){
			left_list.push(follower_map[id]);
		}
		
		console.log("who follow you");
		console.log(add_list);
		console.log("who left you");
		console.log(left_list);
	}
	console.log("done");
}


function on_save(){
	page=0
	mode="save"
	if(followers!==[]){
		finish();
	}else{	
		visit();
	}
}

function on_diff(){
	var v=GM_getValue(gm_key)
	if(v.length==0){
		console.warn("please save first")
		return
	}
	page=0;
	followers=[];
	mode="diff";
    visit();
}

(function() {
    'use strict';
	var p_node=document.querySelector("body div#wrapper div#content div.clearfix div.aside div.mod");
    var p1=document.createElement('p');
	p1.class="pl2"
    p1.innerHTML=">\n<a>save followers</a>";
    p1.onclick=on_save;
	p_node.append(p1);
	var p2=document.createElement('p');
	p2.class="pl2"
    p2.innerHTML=">\n<a>diff followers</a>";
    p2.onclick=on_diff;
	p_node.append(p2);
	
})();