// ==UserScript==
// @name         VK FLIP
// @namespace    FIX
// @version      1.0.0
// @description  flipped text vk
// @copyright       2017, Juice
// @author       Alexey Juice
// @include         *://vk.com/*
// @include         *://m.vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26425/VK%20FLIP.user.js
// @updateURL https://update.greasyfork.org/scripts/26425/VK%20FLIP.meta.js
// ==/UserScript==
(function(){
var papent = document.getElementsByTagName("ol")[0];
var li = document.getElementsByTagName("li")[0];
var p_prime = li.cloneNode(true);
p_prime.id = 'leet';
p_prime.querySelectorAll('span > span')[3].innerHTML = "hapkomah_mode";
p_prime.querySelector('a').href = '#';
p_prime.querySelector('a').id = 'link_flink';
papent.insertBefore(p_prime, papent.children[9]);
document.getElementById('link_flink').onclick=function () {alert('у вас получилось кликнуть');};
console.log(document.getElementById('link_flink').onclick);
})();

function flip() { 
var result = flipString (document.getElementById('original').value.toLowerCase()); 
document.getElementById('flipped').value = result;
}
function flipString(aString) { 
	var last = aString.length; 
	var result = new Array(aString.length) 
	for ( var i = 0; i <= last; i++) 
	{ 
		var c = aString.charAt(i) 
		var r = flipTable[c] 
		result[i] = r != undefined ? r : c 
	} 
	return result.join('')
}
var flipTable = {
а : 'a',
б : '6',
в : '8',  
г : 'r',
д : 'g',
е : 'e', 
ж : 'zh',
з : '3',
и : 'u', 
й : 'u',
к : 'k',
л : 'v',
м : 'm',
н : 'h',
о : 'o',
п : 'n',
р : 'p',
с : 'c',
т : 't',
у : 'y',
ф : 'q',
х : 'x',
ц : 'ts',
ч : '4',
ш : 'w',
щ : 'w',
ъ : 'b',
ы : 'bl',
ь : 'b',
э : '3',
ю : 'lo',
я : 'ja',
'.' : '0',
',' : '9',
':' : '%',
'"' : '^',
'?' : '7', 
'!' : '1',
'-' : '~',
'/' : '&',
'(' : '<',
')' : '>',
'\r' : '\n'
} 
for (i in flipTable) { flipTable[flipTable[i]] = i}