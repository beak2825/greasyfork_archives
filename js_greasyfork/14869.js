// ==UserScript==
// @name        刷馒头
// @namespace   saki
// @include     https://weida.we.jaeapp.com/pc/task/show?id=123134&seller_nick=%E6%BC%AB%E8%B8%AA%E6%97%97%E8%88%B0%E5%BA%97
// @version     1
// @grant       none
// @description    just a simple script to get more steamed buns
// @downloadURL https://update.greasyfork.org/scripts/14869/%E5%88%B7%E9%A6%92%E5%A4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/14869/%E5%88%B7%E9%A6%92%E5%A4%B4.meta.js
// ==/UserScript==



console.log('start');
if (document.getElementsByClassName('submit_btn')){
	setTimeout(shua,500);
}else{
	shua;
}
function shua(){
	var timeDelay = 0;
	var Time=new Date();
	var min = Time.getMinutes();
	var hr = Time.getHours();
	var targettime = {
		hour: document.getElementsByClassName('font_hl')[0].innerHTML.substr(0, 2),
		minute: document.getElementsByClassName('font_hl')[0].innerHTML.substr(3, 2),
		sec: document.getElementsByClassName('font_hl')[0].innerHTML.substr(6, 2)
	};
	if(hr==targettime.hour && min>=targettime.minute){
	  	document.getElementsByClassName('submit_btn')[0].click();
	  	console.log('complete');
	}else{
		timeDelay = (hr==targettime.hour&&Math.abs(min-targettime.minute)<2)?(100):(200*(Math.abs(hr-targettime.hour)*3600+Math.abs(min-targettime.minute)*60));
		console.log(timeDelay);
		setTimeout("window.location.reload();", timeDelay);
		console.log('reload');
	}	
}