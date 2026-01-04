// ==UserScript==
// @name         SlashJs
// @namespace    http://tampermonkey.net/
// @version      Alpha 1.0.0
// @description  No need for javascript with this library. Use commands inside of elements such as /time, /animate, and more!
// @author       James D Melix
// @match        *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// ==/UserScript==

let slash = (func) => {
 
 // Variable Set up -- For Now
 let date = new Date();
 let hour;
 let second;
 let minute;
 
 let type;
 if (func[0] + func[1] == '//') {
  type = '//';
 } else if (func[0] == '/' && func[1] != '/') {
  type = '/';
 } else {
  type = func;
 }
 switch(type) {
  case '/':
   switch(func) {
	   case '/time':
		hour = date.getHours();
		if (hour > 12) {
			hour -= 12;
		}
		minute = date.getMinutes();
		if (minute < 10) {
			minute = `0${minute}`;
		}
		return `${hour}:${minute}`;
	   
	   case '/timefull':
		hour = date.getHours();
		if (hour > 12) {
			hour -= 12;
		}
		minute = date.getMinutes();
		if (minute < 10) {
			minute = `0${minute}`;
		}
		second = date.getSeconds();
		if (second < 10) {
			second = `0${second}`;
		}
		return `${hour}:${minute}:${second}`;
	   
	   default:
	    let funcE = func.split('/')[1];
		return `function unknown @ ${funcE}`;
   }
  break;
  
  case '//':
   // Edit Function
   
  break;
  
  case 'update':
   // Find all commands and update
   var els = document.getElementsByAttribute('slash.autoupdate');
   for (let p = 0; p < els.length; p++) {
	els[p].innerHTML = slash(els[p].attributes['slash.vari'].value);
   }
  break;
  
  case 'exe':
   var els = document.getElementsByTagName('*');
   for (let i = 0; i < els.length; i++) {
	   let elsInnerHTML = els[i].innerHTML;
	   let fin = '';
	   elsInnerHTML = elsInnerHTML.split(' ');
	   for (let o = 0; o < elsInnerHTML.length; o++) {
		   var word = elsInnerHTML[o];
		   if (word[0] == '/' && word[1] != '/') {
			   fin = fin + '<span slash.autoupdate="true" slash.vari="' + word + '"></span>';
		   } else {
			   fin = fin + ' ' + word;
		   }
	   }
	   els[i].innerHTML = fin;
   }
  break;
  
  default:
    console.error(`function not found @ ${func}()`);
  break;
 }
};
setTimeout( function() {
	setInterval( function() { slash('exe');slash('update'); }, 250);
}, 150);