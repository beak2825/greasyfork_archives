// ==UserScript==
// @name         1825NavLink
// @description  Rajoute le lien du 18-25 dans le menu de navigation des forums
// @version      5
// @grant        none
// @match        http://www.jeuxvideo.com/*
// @match        http://m.jeuxvideo.com/*
// @match        https://www.jeuxvideo.com/*
// @match        https://m.jeuxvideo.com/*
// @author       Alectrona
// @language     fr
// @namespace    https://greasyfork.org/users/396340
// @downloadURL https://update.greasyfork.org/scripts/392173/1825NavLink.user.js
// @updateURL https://update.greasyfork.org/scripts/392173/1825NavLink.meta.js
// ==/UserScript==


var docLinks = document.getElementsByClassName('nav-link');

var parent;
for(var i=0;i < docLinks.length; i++){
	if(docLinks[i].innerHTML == 'Forums' && docLinks[i].href == 'http://www.jeuxvideo.com/forums.htm'){
		parent = docLinks[i].parentNode;
		break;

	}

}

if (parent !== undefined) {
var links = parent.getElementsByTagName('ul')[0].getElementsByTagName('li');

links[1].firstChild.href = "http://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm";
links[1].firstChild.innerHTML = "Blabla 18-25 ans";
links[2].firstChild.href = "http://www.jeuxvideo.com/forums/0-19163-0-1-0-1-0-league-of-legends.htm";
links[2].firstChild.innerHTML = "League of Legends";
links[3].firstChild.href = "http://www.jeuxvideo.com/forums/0-78-0-1-0-1-0-musculation-nutrition.htm";
links[3].firstChild.innerHTML = "Musculation & Nutrition";
  
//links[2].firstChild.href = "http://www.jeuxvideo.com/forums/0-19163-0-1-0-1-0-league-of-legends.htm";
//links[2].firstChild.innerHTML = "League of Legends";
  
//links[3] désigne le 3ème lien, links[4] le 4ème, etc.
  
}