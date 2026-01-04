// ==UserScript==
// @name            Twilight Heroes Autobox
// @description     This script adds a button for getting and equipping black box in the web game Twilight Heroes.
// @namespace       Twilight Heroes
// @match           https://www.twilightheroes.com/criminology.php*
// @match           https://twilightheroes.com/criminology.php*
// @match  	        https://www.twilightheroes.com/main.php*
// @match  	        https://twilightheroes.com/main.php*
// @version         2
// @history         v2: The script broke when the game switched over to HTTPS. v2 fixes this issue. also replaced include with match for wider compatibility
// @history         v1: Initial script by Heather Robinson, whose scrips can be found here https://userscripts-mirror.org/users/110369
// @downloadURL https://update.greasyfork.org/scripts/38222/Twilight%20Heroes%20Autobox.user.js
// @updateURL https://update.greasyfork.org/scripts/38222/Twilight%20Heroes%20Autobox.meta.js
// ==/UserScript==

function zz(){
	var t='https://'+location.host+'/criminology.php';
	localStorage.setItem('gfb','true');
	location.href=t;}

if(/main/.exec(location.href)){
	var c=document.getElementsByTagName('center')[0];
	var b=document.createElement('button');
	b.innerHTML='Get & Equip Black Box';
	c.parentNode.insertBefore(b,c);
	b.addEventListener('click',zz,true);}
else if(localStorage.getItem('gfb')){
	var a=document.getElementsByTagName('form');
	if(a.length>3)
		a[2].submit();
	else{
		a=document.getElementsByTagName('a')[0];
		localStorage.removeItem('gfb');
		location.href=a.href;}}
