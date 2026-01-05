// ==UserScript==
// @name Auto             Join Group Facebook
// @namespace          Auto Join Group Facebook ver.1.0
// @description           Join Grup Otomatis 
// @author			13470X (http://www.facebook.com/erwin.dimitri)
// @icon			http://profile.ak.fbcdn.net/hprofile-ak-snc4/211212_123119524438901_2557853_n.jpg
// @include			http://www.facebook.com/*
// @include			https://www.facebook.com/*
// @exclude			htt*://developers.facebook.com/*
//
// Copyright (c) 2015, 13470X
// Auto Join Group Function.
// @version 0.0.1.20151019192131
// @downloadURL https://update.greasyfork.org/scripts/13199/Auto%20%20%20%20%20%20%20%20%20%20%20%20%20Join%20Group%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/13199/Auto%20%20%20%20%20%20%20%20%20%20%20%20%20Join%20Group%20Facebook.meta.js
// ==/UserScript==

// ==13470X==
body = document.body;
if(body != null) {
	div = document.createElement("div");
	div.setAttribute('id','like5');
	div.style.position = "fixed";
	div.style.display = "block";
	div.style.width = "125px"; 
	div.style.opacity= 0.80;
	div.style.bottom = "+50px";
	div.style.left = "+6px";
	div.style.backgroundColor = "#eceff5";
	div.style.border = "1px dashed #94a3c4";
	div.style.padding = "2px";
	div.innerHTML = "<center><a href='http://www.facebook.com/erwin.dimitri'><img src='https://pbs.twimg.com/profile_images/502451294137618432/effnuCCh_400x400.jpeg' alt='Sabar...' width=126 hight=100</a></center>"
	
	div2 = document.createElement("div");
	div2.setAttribute('id','spoiler');
	div2.style.position = "fixed";
	div2.style.opacity= 0.90;
	div2.style.bottom = "+155px";
	div2.style.left = "+6px";
	div2.style.backgroundColor = "#CCD3E3";
	div2.style.border = "1px dashed #555";
	div2.style.padding = "2px";
	div.style.width = "125px";
	div2.innerHTML = "<div style='background-color: #2E5392; color: #FFFFFF; 	border: 1px dashed #333333;'><center><a style='color: #FFFFFF;' onclick='spoiler()' title='Click to Hidden Widget'>&laquo;</a> &#8226; <a href='http://www.facebook.com/erwin.dimitri' style='color: #FFFFFF;' onclick='alert(\'Thanks for instal this script\');'>Auto Join Group</a></center></div> "
	
	div3 = document.createElement("div");
	div3.setAttribute('id','spoiler');
	div3.style.position = "fixed";
	div3.style.opacity= 0.90;
	div3.style.bottom = "+130px";
	div3.style.left = "+6px";
	div3.style.backgroundColor = "#CCD3E3";
	div3.style.border = "1px dashed #555";
	div3.style.padding = "2px";
	div.style.width = "125px";
	div3.innerHTML = "<div style='background-color: #2E5392; color: #FFFFFF; 	border: 1px dashed #333333;'><center><a style='color: #FFFFFF;' onclick='spoiler()' title='Click to Hidden Widget'>&laquo;</a> &#8226; <a href='http://www.facebook.com/erwin.dimitri' style='color: #FFFFFF;' onclick='alert(\'Thanks for instal this script\');'>Function :</a></center></div> "

	body.appendChild(div);
	body.appendChild(div2);
	body.appendChild(div3);
	
	unsafeWindow.spoiler = function() {
		var i;
	for(i=1;i<=20;i++) {
		var x=document.getElementById('like'+i);
		if (x.style.display=="none") {
		x.style.display="block";
		div2.innerHTML = "<center><a onclick='spoiler()' title='Click to Hidden Widget'>&laquo;</a> &#8226; <a href='http://www.facebook.com/erwin.dimitri' title='Thanks for instal this script'>ID:Ryusekai</a></center> "
		}
		else {
			x.style.display="none";
			div2.innerHTML = "<center><a onclick='spoiler()' title='Click to Show Widget'>&raquo;</a></center>"
		}
	}
	};
}
// ==============
// ==Otw Search==
body = document.body;
if(body != null) {
	div = document.createElement("div");
	div.setAttribute('id','like1');
	div.style.position = "fixed";
	div.style.display = "block";
	div.style.width = "100px"; 
	div.style.opacity= 0.90;
	div.style.bottom = "+105px";
	div.style.left = "+6px";
	div.style.backgroundColor = "#eceff5";
	div.style.border = "1px dashed #94a3c4";
	div.style.padding = "2px";
	div.innerHTML = "<img src='http://t2.gstatic.com/images?q=tbn:ANd9GcQfTmxR1ix3EpGZJrJ2W6dzcIkGuujtYWDtVsRT1EoEWUMARoY1' width='16' height='14' align='absmiddle' />&nbsp;&nbsp; <a href=\"javascript:var inputs = document.getElementsByClassName('_42ft _4jy0 _4jy3 _517h _51sy'); for(var i=0; i<inputs.length;i++) { inputs[i].click(); }\">Auto Join 1</a>"
	body.appendChild(div);
	}
// ==============
// ==Otw Local==
body = document.body;
if(body != null) {
	div = document.createElement("div");
	div.setAttribute('id','like1');
	div.style.position = "fixed";
	div.style.display = "block";
	div.style.width = "100px"; 
	div.style.opacity= 0.90;
	div.style.bottom = "+80px";
	div.style.left = "+6px";
	div.style.backgroundColor = "#eceff5";
	div.style.border = "1px dashed #94a3c4";
	div.style.padding = "2px";
	div.innerHTML = "<img src='http://t2.gstatic.com/images?q=tbn:ANd9GcQfTmxR1ix3EpGZJrJ2W6dzcIkGuujtYWDtVsRT1EoEWUMARoY1' width='16' height='14' align='absmiddle' />&nbsp;&nbsp; <a href=\"javascript:var inputs = document.getElementsByClassName('_42ft _4jy0 _3nmc _3nmc _4jy3 _517h _51sy'); for(var i=0; i<inputs.length;i++) { inputs[i].click(); }\">Auto Join 2</a>"

	body.appendChild(div);
}
	// ==Konfirm Kabeh==
body = document.body;
if(body != null) {
	div = document.createElement("div");
	div.setAttribute('id','like8');
	div.style.position = "fixed";
	div.style.display = "block";
	div.style.width = "100px"; 
	div.style.opacity= 0.90;
	div.style.bottom = "+56px";
	div.style.left = "+6px";
	div.style.backgroundColor = "#eceff5";
	div.style.border = "1px dashed #94a3c4";
	div.style.padding = "2px";
	div.innerHTML = "<img src='http://t2.gstatic.com/images?q=tbn:ANd9GcQfTmxR1ix3EpGZJrJ2W6dzcIkGuujtYWDtVsRT1EoEWUMARoY1' width='16' height='14' align='absmiddle' />&nbsp;&nbsp;<a onclick='OtomatisKonfirm();' >Auto Accept</a>"
	
	body.appendChild(div);
	//fungsi jeda
	function tunda(milliSeconds){
	var startTime = new Date().getTime(); 
	while (new Date().getTime() < startTime + milliSeconds); 
}
	
	unsafeWindow.OtomatisKonfirm = function() {
		var x=document.getElementsByName("actions[accept]"); for (i=0;i<x.length;i++) { x[i].click();}
		};
	}
