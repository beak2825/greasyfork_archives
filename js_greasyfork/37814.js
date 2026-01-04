// ==UserScript==
// @name       zmien pasek
// @namespace  https://www.wykop.pl/*
// @version    1.0
// @description zmien
// @include     *://www.wykop.pl/*
// @copyright  Arkatch
// @downloadURL https://update.greasyfork.org/scripts/37814/zmien%20pasek.user.js
// @updateURL https://update.greasyfork.org/scripts/37814/zmien%20pasek.meta.js
// ==/UserScript==

function setSex(nick){
	let x = document.querySelectorAll('a.profile[href="https://www.wykop.pl/ludzie/'+nick+'/"] > img');
	for(let elem of x)
	elem.setAttribute('class', 'avatar female lazy');
}
function loaded(){
	setSex('mgnfic');
}
function reloadAvatar(){
	return new Promise((resolve, reject)=>{
		setTimeout(()=>{
			resolve();
		}, 600);
	}).then(()=>{
		loaded();
	});
}
function eventList(){
	let x = document.querySelectorAll('.more > a.affect.ajax');
	for(let i of x){
		i.addEventListener('click', reloadAvatar, false);
	}
}
{
	document.onreadystatechange = ()=>{
		let s = document.readyState;
		if(s === "interactive" || s === "complete") {
			loaded();
			eventList();
		}
	};
}