// ==UserScript==
// @name         CC auto-do
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  try to take over the world!
// @author       You
// @match        http://www.neopets.com/charitycorner/2018/np.phtml
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39444/CC%20auto-do.user.js
// @updateURL https://update.greasyfork.org/scripts/39444/CC%20auto-do.meta.js
// ==/UserScript==

var time=2000;
if($("#gift1 > select > option").length>=8){

setTimeout(function(){
$('#gift1 > select').val('1');
$('#gift1 > select').trigger('change');
},time)

time+=Math.random()*500+500;

setTimeout(function(){
$('#gift2 > select').val('2');
$('#gift2 > select').trigger('change');
},time)

time+=Math.random()*500+500;


setTimeout(function(){
$('#gift3 > select').val('3');
$('#gift3 > select').trigger('change');
},time)

time+=Math.random()*500+500;


setTimeout(function(){
$('#gift4 > select').val('4');
$('#gift4 > select').trigger('change');
},time)

time+=Math.random()*500+500;


setTimeout(function(){
$('#gift5 > select').val('5');
$('#gift5 > select').trigger('change');
},time)

time+=Math.random()*500+500;


setTimeout(function(){
$('.buttonDonate').trigger('click');
},time)

time+=Math.random()*2000+5000+Math.floor(Math.random()*3)*10000;
setTimeout(function(){
window.location.replace("http://www.neopets.com/charitycorner/2018/np.phtml")
},time);




}
