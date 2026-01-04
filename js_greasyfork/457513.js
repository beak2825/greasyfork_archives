// ==UserScript==
// @name         Mathletics Live Hack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  If this doesn't work, copy the code underneath "console.inspect" and paste it into inspect console tab! There are 2 codes btw, the first one is a quick, fast one, here are the README.MD instructions for usage! ;)              Once Countdown timer to the start of the game has finished, For Single Question Solve Press Up Arrow For Exactly 150 Question Solve Press Left Arrow For Solve Every 400 ~ 500ms (random) Press Down Arrow For As Fast As Possible Solve Press Right Arrow
// @author       Andromeda
// @icon         https://www.google.com/s2/favicons?domain=mathletics.com
// @grant        none
// @match        http://live.mathletics.com/*
// @match        *://live.mathletics.com/*
// @downloadURL https://update.greasyfork.org/scripts/457513/Mathletics%20Live%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/457513/Mathletics%20Live%20Hack.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
})();
 
!function(){"use strict";var e,s,t=0,a=new WebSocket("ws://localhost:8080"),n=0,c=!0;function i(e){n=0,t=0,$(".questions-text-alignment").change(function(){(t<e-1||-1==e)&&setTimeout(function(){r()},0),t++}),r()}function r(){var s=document.getElementsByClassName("questions-text-alignment")[0].innerText.trim(),t=s.split(" ");if(s.startsWith("Half"))m=t[2]/2;else if(s.startsWith("How")){var a,i=[1,60,3600],r=[];t.forEach(function(e){isNaN(e)||""==e||(a=e)}),[2,5].forEach(function(e){switch(t[e]){case"hours":r.push(i[0]);break;case"minutes":r.push(i[1]);break;case"seconds":r.push(i[2])}}),r[0]<r[1]?m=a*(r[0]/r[1]):r[0]>r[1]&&(m=a/(r[1]/r[0]))}else if(s.endsWith("m")){var u,h=1,p="na",f=[1,100,1e3],l=[];if(t.join("").split("=").forEach(function(e){switch(e){case"m":l.push(f[0]);break;case"cm":l.push(f[1]);break;case"mm":l.push(f[2]);break;default:var s=[];switch(e.split("").forEach(function(e){isNaN(e)&&s.push(e)}),h=e.substring(0,e.length-s.join("").length),p=0==l.length?"r":"l",s.join("")){case"m":l.push(f[0]);break;case"cm":l.push(f[1]);break;case"mm":l.push(f[2])}}}),u=l[0]<l[1]?l[1]/l[0]:l[0]/l[1],"na"==p)" "==document.getElementsByClassName("questions-text-alignment")[0].innerText.split("")[0]&&(p="l");"l"==p&&(l.push(l[0]),l.shift()),l[0]<l[1]?m=h*u:l[0]>l[1]&&(m=h/u)}else if(s.endsWith("="))switch(t.length){case 4:var m;switch(e=t[1]){case"+":m=parseInt(t[0])+parseInt(t[2]);break;case"-":m=parseInt(t[0])-parseInt(t[2]);break;case"×":m=parseInt(t[0])*parseInt(t[2]);break;case"÷":m=parseInt(t[0])/parseInt(t[2])}break;case 5:t[4]=t[4].substring(0,t[4].length-1),m=parseInt(t[0])+parseInt(t[2])+parseInt(t[4]);break;case 6:m=parseInt(t[0])+parseInt(t[2])+parseInt(t[4])}else{var b=[];switch(e=t[1],t.forEach(function(e){isNaN(e)||""==e||b.push(e)}),e){case"+":m=b[1]-b[0];break;case"×":m=b[1]/b[0]}}isNaN(m)?n<2&&!c&&(n++,o(0)):o(m)}function o(e){a.send(e)}document.onkeydown=function(e){switch(e.keyCode){case 37:i(150);break;case 38:r();break;case 39:i(-1);break;case 40:c=(t=[400,500])[0],o=t[1],s=!0,n=0,setTimeout(function(){s=!1},6e4),function e(){s&&(a=Math.round(Math.random()*(o-c))+c,setTimeout(function(){r(),e()},a))}()}var t,a,c,o}}();
 
console.inspect
var time = 60; var clock = 300; function TimeHack(){
    setInterval(function Applytime() {
 document.getElementsByClassName('timerLabel whiteTextWithShadow font-60 ng-binding')["0"].innerText = time; document.getElementsByClassName('timerLabel whiteTextWithShadow font-60 ng-binding')["0"].innerHtml = time;
  document.getElementsByClassName('clockHand').rotate = clock;
}, 1);}; function TimeHackm() {
    setInterval(function Addtime() {
time = time + 1;
clock = clock + 6;
}, 1000);}
    var score = 1;
    function ScoreHack(){
    setInterval(function ApplyScore() {
score = score + 1
 document.getElementById("scoreBar0").innerText = score ;
}, 1);};
 
alert("This hack was made by Andromeda on Greasyfork / Tampermonkey, Discord: andromeda#3410")
 
var btn = document.createElement("BUTTON");
    document.body.appendChild(btn);
    btn.setAttribute("onclick","ShowAwnser()");
    btn.setAttribute("id","dashow")
     var t = document.createTextNode("A Spam Bot");
    btn.appendChild(t);
var btnt = document.createElement("BUTTON");
    document.body.appendChild(btnt);
    btnt.setAttribute("onclick","TimeHack(); TimeHackm()")
    btnt.setAttribute("id","dasho")
     var tt = document.createTextNode("Time Cheat");
    btnt.appendChild(tt);
    var btnd = document.createElement("BUTTON");
    document.body.appendChild(btnd);
    btnd.setAttribute("onclick","ScoreHack()");
    btnd.setAttribute("id","dashowd")
     var td = document.createTextNode("Find Points");
    btnd.appendChild(td);
 
 
 
 
function ShowAwnser(){
 
 var nums = document.getElementsByClassName('questions-text-alignment whiteTextWithShadow question-size-v4')["0"].innerText;
 var add = nums.split('+' && '=');
 var equasion = add[0];
 function addbits(s){
    var total= 0, s= s.match(/[+\-]*(\.\d+|\d+(\.\d+)?)/g) || [];
    while(s.length){
        total+= parseFloat(s.shift());
    }
    return total;
}
 var awnser = addbits(equasion)
 
var nums = document.getElementsByClassName('questions-text-alignment whiteTextWithShadow question-size-v4')["0"].innerText;
 var add = nums.split('+' && '=');
 var equasion = add[0];
 function addbits(s){
    var total= 0, s= s.match(/[+\-]*(\.\d+|\d+(\.\d+)?)/g) || [];
    while(s.length){
        total+= parseFloat(s.shift());
    }
    return total;
}
 var awnser = addbits(equasion)
 
document.getElementById('dashow').innerText = awnser;
 document.getElementsByClassName("questions-input-adjustment questions-input-width-v3")["0"].value = awnser;
}
 
 window.addEventListener("keydown", checkKeyPressed, false);
 
function checkKeyPressed(e) {
    if (e.keyCode == "65") {
       ShowAwnser()
    }
}