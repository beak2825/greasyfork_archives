// ==UserScript==
// @name       kod
// @namespace  http://www.wykop.pl/*
// @version    1.0
// @description koddd
// @match      *://www.wykop.pl/*
// @copyright  Arkatch
// @downloadURL https://update.greasyfork.org/scripts/34565/kod.user.js
// @updateURL https://update.greasyfork.org/scripts/34565/kod.meta.js
// ==/UserScript==
(function(){
function decryptText(){ var x = document.getElementsByClassName('text'); var i, k,  h = x.length, p; for(k=0;k<h;k++){ try{ p = x[k].getElementsByTagName('p')[0]; t = p.innerText.split(" "); let j = t.length; for(i = 0;i<j;i++){ let string = t[i]; if(string[0]=="$"){ let temp = ''; for(let kt = 1;kt<string.length;kt++){ if(string[kt] == "#"){ break; } temp += textDecrypt(string[kt]); } t[i] = temp; }else{ continue; } } p.innerHTML = t.join(" "); }catch(e){ console.log(e); } } } function textDecrypt(oldText){ if(oldText === 'd'){ return 'a'; }else if(oldText === 'e'){ return 'b'; }else if(oldText === 'f'){ return 'c'; }else if(oldText === 'g'){ return 'd'; }else if(oldText === 'h'){ return 'e'; }else if(oldText === 'i'){ return 'f'; }else if(oldText === 'j'){ return 'g'; }else if(oldText === 'k'){ return 'h'; }else if(oldText === 'l'){ return 'i'; }else if(oldText === 'm'){ return 'j'; }else if(oldText === 'n'){ return 'k'; }else if(oldText === 'o'){ return 'l'; }else if(oldText === 'p'){ return 'm'; }else if(oldText === 'r'){ return 'n'; }else if(oldText === 's'){ return 'o'; }else if(oldText === 't'){ return 'p'; }else if(oldText === 'u'){ return 'r'; }else if(oldText === 'w'){ return 's'; }else if(oldText === 'y'){ return 't'; }else if(oldText === 'z'){ return 'u'; }else if(oldText === 'a'){ return 'w'; }else if(oldText === 'b'){ return 'y'; }else if(oldText === 'c'){ return 'z'; }else if(oldText === '?'){ return ','; }else if(oldText === '!'){ return '.'; }else{ return oldText; } } decryptText();
})();