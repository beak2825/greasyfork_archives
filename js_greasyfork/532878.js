// ==UserScript==
// @name		将洛谷一些粗略数字改为精确数字
// @namespace	https://www.luogu.com.cn/user/576074
// @license		SATA
// @version		1.3
// @description	将洛谷一些粗略数字（例如题目提交人数和通过人数）改为精确数字
// @author		123asdf123
// @match		*://www.luogu.com.cn/*
// @icon		https://asdf123asdf123asdf123.github.io/exact numbers.png
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/532878/%E5%B0%86%E6%B4%9B%E8%B0%B7%E4%B8%80%E4%BA%9B%E7%B2%97%E7%95%A5%E6%95%B0%E5%AD%97%E6%94%B9%E4%B8%BA%E7%B2%BE%E7%A1%AE%E6%95%B0%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/532878/%E5%B0%86%E6%B4%9B%E8%B0%B7%E4%B8%80%E4%BA%9B%E7%B2%97%E7%95%A5%E6%95%B0%E5%AD%97%E6%94%B9%E4%B8%BA%E7%B2%BE%E7%A1%AE%E6%95%B0%E5%AD%97.meta.js
// ==/UserScript==
var parser=new DOMParser(),ourl="";
function updd(newdoc){
	var x=JSON.parse(newdoc.getElementById("lentille-context").innerText),alls=x.data.problem.totalSubmit,acs=x.data.problem.totalAccepted,ch=document.querySelector("div.stat.stacked.with-vr.color-inv");
	ch.children[0].children[1].innerText=alls;ch.children[1].children[1].innerText=acs;
}
function updc(x){
	var cnt=x.currentData.contest.totalParticipants,ch=document.querySelector("div.stat.color-inverse");
	ch.children[1].children[1].innerText=cnt;
}
function updc2(x){
	var cnt=x.currentData.training.markCount,ch=document.querySelector("div.stat.color-inverse");
	ch.children[1].children[1].innerText=cnt;
}
function updc3(x){
	var cnt=x.currentData.team.memberCount,ch=document.querySelector("div.stat.color-inverse");
	ch.children[0].children[1].innerText=cnt;
}
function updc4(x){
	var fingc=x.currentData.user.followingCount,ferc=x.currentData.user.followerCount,alls=x.currentData.user.submittedProblemCount,acs=x.currentData.user.passedProblemCount,rk=x.currentData.user.ranking,ch=document.querySelector("div.stats.normal");
	ch.children[0].children[0].children[1].innerText=fingc;
	ch.children[1].children[0].children[1].innerText=ferc;
	ch.children[2].children[0].children[1].innerText=alls;
	ch.children[3].children[0].children[1].innerText=acs;
	ch.children[4].children[0].children[1].innerText=rk;
}
function upd(){
    if(window.location.href!=ourl){
        if(window.location.href.indexOf("www.luogu.com.cn/problem")!=-1&&window.location.href.indexOf("solution")==-1&&window.location.href.indexOf("list")==-1){
            fetch(window.location.href).then(response=>response.text()).then(data=>(updd(parser.parseFromString(data,"text/html"))));
        }
        if(window.location.href.indexOf("www.luogu.com.cn/contest")!=-1&&window.location.href.indexOf("list")==-1&&window.location.href.indexOf("_contentOnly")==-1){
            fetch(window.location.href.slice(0,-window.location.hash.length)+"?_contentOnly").then(response=>response.json()).then(data=>(updc(data)));
        }
        if(window.location.href.indexOf("www.luogu.com.cn/training")!=-1&&window.location.href.indexOf("list")==-1&&window.location.href.indexOf("_contentOnly")==-1){
            fetch(window.location.href.slice(0,-window.location.hash.length)+"?_contentOnly").then(response=>response.json()).then(data=>(updc2(data)));
        }
        if(window.location.href.indexOf("www.luogu.com.cn/team")!=-1&&window.location.href.indexOf("_contentOnly")==-1){
            fetch(window.location.href.slice(0,-window.location.hash.length)+"?_contentOnly").then(response=>response.json()).then(data=>(updc3(data)));
        }
        if(window.location.href.indexOf("www.luogu.com.cn/user")!=-1&&window.location.href.indexOf("_contentOnly")==-1){
            fetch(window.location.href.slice(0,-window.location.hash.length)+"?_contentOnly").then(response=>response.json()).then(data=>(updc4(data)));
        }
        ourl=window.location.href;
    }
}
(function(){
	'use strict';
	setInterval(upd,50);
})();