// ==UserScript==
// @name        New Jalali Date for Trello
// @namespace   FMoosavi
// @description Jalali date updated for trello with support for all formats
// @include     https://trello.com/*
// @include     http://trello.com/*
// @version     0.0.2 beta
// @downloadURL https://update.greasyfork.org/scripts/382233/New%20Jalali%20Date%20for%20Trello.user.js
// @updateURL https://update.greasyfork.org/scripts/382233/New%20Jalali%20Date%20for%20Trello.meta.js
// ==/UserScript==

fetch('https://unpkg.com/jalali-moment/dist/jalali-moment.browser.js').then(res => {return res.text()}).then(res=>{eval(res);

var today = new Date();
var pats=[{p:/(\w{3} \d\d?, \d{4})/,f:'MMM D, YYYY',j:'YY/M/D'},{p:/(\w{3} \d\d?)/,f:'MMM D',j:'D MMM'}];

setInterval(function(){
	document.querySelectorAll('.js-due-date-text:not([jalalized]),.action-card:not([jalalized]),.date:not([jalalized]),.js-date-text:not([jalalized])').forEach(item=>{
	var d=item.innerText, m, isdate=false;
		for(var i=0; i<pats.length; i++){
		var pat=pats[i];
			if(pat.p.test(d)){
				m=moment(d,pat.f);
var patj= pat.j;
if(m.year()<2000){
	m=m.year(today.getFullYear());
if(m.month()<2||(m.month()==2 && m.date()<22))
patj = 'YY/M/D';
} else
if((m.year()===(today.getFullYear()+1))&&(m.month()<2||(m.month()==2 && m.date()<20)))
patj = 'D MMM';
				item.innerHTML = d.replace(pat.p,"<span dir=rtl>"+m.locale('fa').format(patj)+"</span>");
				isdate=true;
				break;
			}
		}
if(isdate===false)
item.innerText=d.replace('tomorrow','فردا').replace('yesterday','دیروز');
//item.setAttribute('jalalized',"");
	});
}, 3000);
});
