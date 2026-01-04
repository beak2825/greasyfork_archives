// ==UserScript==
// @name         Lunar Temple
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       lichdkimba
// @match        http://www.neopets.com/shenkuu/lunar/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34446/Lunar%20Temple.user.js
// @updateURL https://update.greasyfork.org/scripts/34446/Lunar%20Temple.meta.js
// ==/UserScript==

var patt1=new RegExp("angleKreludor=[0-9]*");
var patt2=new RegExp("[0-9]+");
var myint=patt2.exec(patt1.exec($('embed')[0].src))[0]; 
var arr1=[0,12,34,57,79,102,124,147,169,192,214,237,259,282,304,327,349,361];
function gen_phrase(num){
if(num>=9){
console.log('第一行','第'+(num-8)+'个');
}else{
console.log('第二行','第'+(num)+'个');
}
}

for(var i=0;i<arr1.length;i++){
if(myint>=arr1[i]&&myint<arr1[i+1]){
if(i===17){
gen_phrase(1);
}else{
gen_phrase(i+1);
}
}
}