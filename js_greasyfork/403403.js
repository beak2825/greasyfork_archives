// ==UserScript==
// @name         douban 备用点赞
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  豆瓣广播详情页点赞坏掉，增加备用点赞按钮
// @author       harryhare
// @license      GPL 3.0
// @icon         https://raw.githubusercontent.com/harryhare/userscript/master/index.png
// @match        https://www.douban.com/people/*/status/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403403/douban%20%E5%A4%87%E7%94%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/403403/douban%20%E5%A4%87%E7%94%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

var button;
var liked;
var like_container;
var num_container;

function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        var c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1){
            c_start=c_start + c_name.length+1;
            var c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
}

function on_click(sid,ck){
	if(liked){
		do_unlike(sid,ck);
	}else{
		do_like(sid,ck);
	}
}


function on_succ(xmlhttp){
	var r=JSON.parse(xmlhttp.response);
	//console.log(r);
	//console.log(r.count);
	var n="";
	if(r && r.count){
		n=r.count;
	}
	if(liked){
			button.innerHTML="备用赞"+n;
			liked=false;
	}else{
			button.innerHTML="已赞"+n;
			liked=true;
	}
	//console.log("done!");
}


function do_unlike(sid, ck){
	var xmlhttp=new XMLHttpRequest();
    var url="https://www.douban.com/j/status/unlike";
    var data="sid="+sid+"&ck="+ck;
    //console.log("like: sid="+sid+"& ck="+ck);
    xmlhttp.open("POST",url,true);
    xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xmlhttp.onreadystatechange=function(){
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
			on_succ(xmlhttp);
		}
	};
    xmlhttp.send(data);
}


function do_like(sid, ck){
	var xmlhttp=new XMLHttpRequest();
    var url="https://www.douban.com/j/status/like";
    var data="sid="+sid+"&ck="+ck;
    //console.log("like: sid="+sid+"& ck="+ck);
    xmlhttp.open("POST",url,true);
    xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xmlhttp.onreadystatechange=function(){
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
			on_succ(xmlhttp);
		}
	};
    xmlhttp.send(data);
}

(function() {
    'use strict';

    var x=document.querySelectorAll("div.action-react")[0];
	if(!x){
		return;
	}

	//var y=document.querySelectorAll("div.status-item")[0];
	var y = x.children[0];
	if(!y){
		return;
	}

	//var sid=y.getAttribute("data-sid");
	var sid=y.getAttribute("data-object_id");
	var ck=getCookie("ck");

	like_container=y.children[0];
	num_container=y.children[1];
	liked = (y.children[0].innerText==="已赞");
    button=document.createElement('button');

	if(liked==false){
		button.innerHTML='备用赞 '+num_container.innerText ;
	}else{
		button.innerHTML='已赞 '+num_container.innerText;
	}
	button.onclick=(e)=>{

		on_click(sid,ck);
	};
	x.appendChild(button);
})();