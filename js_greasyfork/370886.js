// ==UserScript==
// @name         search broadcast for douban
// @namespace    harryhare.github.io
// @version      0.2.3
// @description  search user braodcast
// @author       harryhare
// @license      GPL 3.0
// @icon         https://raw.githubusercontent.com/harryhare/userscript/master/index.png
// @match        https://www.douban.com/people/*/statuses**
// @match        https://www.douban.com
// @match        https://www.douban.com/?p=*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/370886/search%20broadcast%20for%20douban.user.js
// @updateURL https://update.greasyfork.org/scripts/370886/search%20broadcast%20for%20douban.meta.js
// ==/UserScript==

const gm_key="douban_user_status";
const interval=2000;

var stop_signal=false;

var search_text;
var search_page;
var max_page;
var user_name;
var old_data;
var cached_status;
var cached_ids_set;
var latest_cached_id="";
var latest_cached_time="";

var result_container;
var status_container;
var search_button;
var stop_button;


var page=1;
var statuses=[];

function getContent(response){
	var target_string=search_text.value;
	var target_exp=new RegExp(target_string,"i");
	var parser=new window.DOMParser();
	var xmlDoc=parser.parseFromString(response,"text/html");
	//xmlDoc.getElementsByTagName('textarea')[0].innerHTML;
	var statuse_nodes=xmlDoc.querySelectorAll("div.stream-items div.new-status.status-wrapper");
	user_name = get_user_id();
	//console.log(statuses);
	for (var i=0;i<statuse_nodes.length;i++){
		var status= statuse_nodes[i];
		var create_time=status.querySelector("div.status-item div.mod div.bd div.actions span.created_at");
		var status_id=status.getAttribute('data-sid');
		//console.log("new status id: ",status_id);
		if(cached_ids_set.has(status_id)){
			//search in cached data
			cached_status=GM_getValue(gm_key)[user_name];
			for(let data of cached_status){
				var status=parser.parseFromString(data,"text/html").body.firstChild;
				var text=status.innerHTML;
				if(text.search(target_exp)!=-1){
					result_container.append(status);
				}
			}

			//merge
			console.log("new statuses: ");
			console.log(statuses.length);
			console.log("cached status: ");
			console.log(cached_status.length);
			statuses.push(...cached_status)

			console.log("merged status: ");
			console.log(statuses.length);
			return true;
		}
		//change time until now to post time
		if(create_time){
			var create_time_a=create_time.querySelector("a");
			if(create_time_a){
				create_time_a.innerHTML=create_time.getAttribute('title');
				statuses.push(status.outerHTML);
			}
		}

		var text=status.innerHTML;
		if(text.search(target_exp)!=-1){
			result_container.append(status);
		}
	}
	return statuse_nodes.length==0;
}


function visit(){
	var xhr=new XMLHttpRequest();
	var url=get_base_url()+"?p="+page;
	console.log('visit',url);
	status_container.innerHTML="正在搜索第"+page+"页...";
	xhr.open("GET",url,true);
	xhr.onreadystatechange = function (){
		if(xhr.readyState != 4 || xhr.status != 200 ){
			return;
		}
		console.log("recv:",url);
		//console.warn(xhr.responseText);
		let reach_end=getContent(xhr.responseText);
		if(page<max_page && reach_end==false && stop_signal==false){
			page++;
			var interval_id = window.setInterval(()=>{
				window.clearInterval(interval_id);
				visit();
				},interval);
		}else{
			finish();
		}
	};
	xhr.send();
}

var mode=""

function finish(){
	//save
	user_name=get_user_id();
	old_data[user_name]=statuses;
	GM_setValue(gm_key,old_data);


	//show finish
	console.log("done");
	search_button.disabled=false;
	stop_button.disabled=true;
	status_container.innerHTML="搜索完成";
}


function on_search(){
	console.log("do search");
	console.log("search text: ",search_text.value);
	console.log("max page: ",search_page.value);
	console.log("target user name: ",user_name);
	old_data=GM_getValue(gm_key);
	//console.log(old_data);
	if(!old_data){
		old_data=new Map();
	}

	//find the latest status id in old_data
	cached_status=[];
	cached_ids_set=new Set();
	if(old_data[user_name] && old_data[user_name].length>0){
		cached_status=old_data[user_name];
		var parser=new window.DOMParser();
		//var node=parser.parseFromString(old_data[user_name][0],"text/html").body.firstChild;
		//latest_cached_id=node.getAttribute('data-sid');
		//var create_time_node=node.querySelector("div.status-item div.mod div.bd div.actions span.created_at");
		//latest_cached_time=node.getAttribute('title');
		//console.log("last cached status id: ",latest_cached_id);
		for(let data of cached_status){
			var node=parser.parseFromString(data,"text/html").body.firstChild;
			var id=node.getAttribute('data-sid');
			cached_ids_set.add(id);
		}
	}

	//limit cache pages
	max_page=parseInt(search_page.value);
	if(!max_page||max_page<=1){
		max_page=20;
	}

	//disable search button and show progress
	result_container.innerHTML="";
	search_button.disabled=true;
	stop_button.disabled=false;
	stop_signal=false;

	//start visit
	page=1;
	statuses=[];
	visit();
}


function on_clean(){
	console.log("clean cache data");
	GM_setValue(gm_key,{});
}


function on_stop(){
	stop_signal=true;
}


function test(){
	console.log(search_text.value);
	console.log(search_page.value);
	console.log(user_name);
}

function get_base_url(){
	var reg=/https?:\/\/www.douban.com\/people\/([^\/]+)\/statuses.*/g;
	var result=reg.exec(window.location);
	if(result && result.length==2){
		return "/people/"+user_name+"/statuses";
	}
	var reg2=/https?:\/\/www.douban.com/g;
	var result2=reg.exec(window.location);
	if(result && result.length==1){
		return "/";
	}
	return "";
}

function get_user_id(){
	var reg=/https?:\/\/www.douban.com\/people\/([^\/]+)\/statuses.*/g;
	var result=reg.exec(window.location);
	if(result && result.length==2){
		return result[1];
	}
	var reg2=/https?:\/\/www.douban.com.*/g;
	var result2=reg2.exec(window.location);
	if(result2 && result2.length==1){
		return "$$self_feed$$";
	}
	return "";
}

(function() {
	'use strict';

	user_name=get_user_id();
	if(user_name===""){
		console.warn("error url");
		return;
	}

	var p_node=document.querySelector("body div#wrapper div#content div.clearfix div.aside");

	var container=document.createElement('div');
	container.style='background-color:#eeeeee;display: -webkit-flex; display: flex; flex-direction: column;';
	p_node.append(container);

	var title=document.createElement('div');
	title.innerHTML="搜索广播";
	container.append(title);

	//inputs
	var search_container=document.createElement('div');
	search_container.style='display: -webkit-flex; display: flex; flex-direction: row;  justify-content: space-between ;';
	container.append(search_container);

	var text1=document.createElement('div');
	text1.innerHTML="关键字：";
	search_container.append(text1);

	search_text=document.createElement('input');
	search_text.style="width:220px;flex:0 1 auto;";
	search_container.append(search_text);

	var page_container=document.createElement('div');
	page_container.style='display: -webkit-flex; display: flex; flex-direction: row; justify-content: space-between ;';
	container.append(page_container);

	var text2=document.createElement('div');
	text2.innerHTML="最大页数：";
	page_container.append(text2);

	search_page=document.createElement('input');
	search_page.style="width:220px;flex:0 1 auto;";
	page_container.append(search_page);
	search_page.value='10';

	//buttons
	var button_container=document.createElement('div');
	button_container.style='display: -webkit-flex; display: flex; flex-direction: row; justify-content: space-around ;';
	container.append(button_container);

	search_button=document.createElement('button');
	search_button.innerHTML="search";
	search_button.onclick=on_search;
	search_button.id="search";
	button_container.append(search_button);

	stop_button=document.createElement('button');
	stop_button.innerHTML="stop searching";
	stop_button.onclick=on_stop;
	stop_button.id="stop";
	stop_button.disabled=true;
	button_container.append(stop_button);

	var clean_button=document.createElement('button');
	clean_button.innerHTML="clean cache";
	clean_button.onclick=on_clean;
	clean_button.id="clean";
	button_container.append(clean_button);

	//var test_button=document.createElement('button');
	//test_button.innerHTML="test";
	//test_button.onclick=test;
	//test_button.id="test";
	//button_container.append(test_button);

	//results
	status_container=document.createElement('div');
	container.append(status_container);
	result_container=document.createElement('div');
	container.append(result_container);
})();
