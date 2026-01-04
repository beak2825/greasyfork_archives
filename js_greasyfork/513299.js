// ==UserScript==
// @name         Daimayuan Online Judge++
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  增强Daimayuan OJ的功能
// @author       Chen Jun
// @match        *://oj.daimayuan.top/*
// @icon         <$ICON$>
// @grant        none
// @license      MIT
// @antifeature  membership

// @downloadURL https://update.greasyfork.org/scripts/513299/Daimayuan%20Online%20Judge%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/513299/Daimayuan%20Online%20Judge%2B%2B.meta.js
// ==/UserScript==
(function() {
	// value defines
	var username='YuMo';
	var a;
	// end
	
	// All styles define
	a=document.querySelector("head");
	var tmp=document.createElement("style");
	tmp.innerHTML="\
.ac{	animation: colorful 1s linear infinite;}a.btn{	background-color: rgb(0,200,0) !important;	border-color: rgb(0,200,0) !important;}.btn:hover{	color: #ffffff !important;	background-color: rgb(0,170,0) !important;	border-color: rgb(0,170,0) !important;}.btn:active{	background-color: rgb(0,170,0) !important;	border-color: rgb(0,170,0) !important;}.btn:focus,a.page-link:focus{	box-shadow : 0 0 0 .2rem hsla(120, 100%, 63%, 0.5) !important;}a{	color: rgb(0,200,0);}.page-item>a.page-link:not(.page-item.active){	color: rgb(0,200,0);}.page-item.active>a.page-item{	color: #ffffff;	background-color: rgb(0,200,0);}a:hover,.page-item:not(.page-item.active)>.page-link:hover{	color : rgb(0, 170, 0);}.card-header.bg-info{	background-color: rgb(0,200,0) !important;}.card.border-info{	border-color: rgb(0,200,0) !important;}.btn-outline-primary[type='submit']{	color: rgb(0,200,0);	border-color: rgb(0,200,0);}span.uoj-username{	animation: colorful 1s linear infinite !important;}.show>.nav-link{	background-color: #00000000 !important;}@keyframes colorful {	0%{		color : hsl(0,100%,40%);	}	10%{		color : hsl(36,100%,40%);	}	20%{		color : hsl(72,100%,40%);	}	30%{		color : hsl(108,100%,40%);	}	40%{		color : hsl(144,100%,40%);	}	40%{		color : hsl(180,100%,40%);	}	60%{		color : hsl(216,100%,40%);	}	70%{		color : hsl(252,100%,40%);	}	80%{		color : hsl(288,100%,40%);	}	90%{		color : hsl(324,100%,40%);	}	100%{		color : hsl(360,100%,40%);	}}\
";
	a.appendChild(tmp);
	// end

	// Progress Bar Update
	a=document.querySelectorAll('.progress-bar');
	for (var i=0;i<a.length;i++) {
        let x=a[i];
        x.classList.add("progress-bar-striped");
        x.classList.add("progress-bar-animated");
        x.style['background-color']='rgb(0,200,0)';
    }
	// end

	// Username style change (yourself)
	if(location.href.search('standing')!=-1){
		var str='a[href="http://oj.daimayuan.top/user/profile/xxx"]{animation: colorful 1s linear infinite;}';
		str=str.replace('xxx',username);
		var ss=document.createElement('style');
		ss.innerHTML=str;
		a=document.querySelector('head');
		a.appendChild(ss);
	}
	var str='.uoj-username:not(span,[href="http://oj.daimayuan.top/user/profile/xxx"]){color: rgb(0,200,0) !important;}';
	if(location.href.search('standing')==-1){
		str=str.replace(',[href="http://oj.daimayuan.top/user/profile/xxx"]','');
	}
	str=str.replace('xxx',username);
	var ss=document.createElement('style');
	ss.innerHTML=str;
	a=document.querySelector('head');
	a.appendChild(ss);
	// end
	
	// 100 -> colorful
	if(location.href.search('submission')!=-1){
		a=document.querySelectorAll(".uoj-score");
		for(let x of a){
			if(x.innerHTML=="100")
			x.classList.add("ac");
		}
	}
	a=document.querySelector('head');
	tmp=document.createElement("style");
	// end
})();