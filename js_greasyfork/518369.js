// ==UserScript==
// @name         Youtube Timer
// @namespace    http://tampermonkey.net/
// @version      V1.0
// @description  NO STRINGS ATTACHED TO ME~~
// @author       TJ365W
// @match        *://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518369/Youtube%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/518369/Youtube%20Timer.meta.js
// ==/UserScript==
//this is the first version of ytb timer, written by TJ365W,I plan to make this open source and as customizable as possible, it will be slow and sure proccess.Running localStorage.clear() will reset
// the extension to its initial install state, to simply reset the timer delete the 'a' parameter from local storage.


function anchor(){
    if(window.location.href!=url){urload()}}
function urload(){if(m){setTimeout(function(){window.location.href = url},1000)};//redirects url
de_distract()}

function de_distract() {//main body for lock on tool
    if(url){
  setTimeout(function(){
document.getElementById('logo-icon').addEventListener('click',urload);//loads eventlisteners
try{
document.getElementById('below').addEventListener('click',anchor);
document.getElementById('secondary-inner').addEventListener('click',urload);
}
catch(err){document.getElementById('contents').addEventListener('click',urload)}},2000);
}}



//block and image
function block(){
document.body.innerHTML='';
     document.body.style.overflowY = 'hidden';
const img = document.createElement('img');
img.src = localStorage.getItem("imglink")||'https://i.pinimg.com/originals/d9/c3/14/d9c314ef171df6071278be39a4a85101.gif';
document.body.appendChild(img);
img.style.width = '100%';
img.style.height = '100%';
}



function timer(a) {
        if(a<t*60){
    setTimeout(function(){if(window.location.href!=url){a++;localStorage.setItem("a", a)};timer(a)},1000);//main timer
            } else{block();}
}
'use strict';
let t = localStorage.getItem("t")||5;//stores timer setting

let url =localStorage.getItem("url")||0//stores de distractor setting
let m = localStorage.getItem("m")//on-off
if(m!="false"){m=true}

document.addEventListener('keydown', (event) => {//adds keyboard shortcuts
     if (event.altKey && event.key==='q'){ m=!m;
                  let msg= m ? 'de-distractor on' : 'de-distractor off';
                                          localStorage.setItem("m", m);//de-deistractor on-off
                                          alert(msg)}
    else if(event.altKey && event.key==='t'){
    t =prompt('enter in minutes')||localStorage.getItem("t")||5;//timer setting prompt
    localStorage.setItem("t", t);
    }
    else if (event.altKey && event.key==='a'){//lock url key
      url =window.location.href;
      localStorage.setItem("url", url);
         alert('this page has been locked on to.');
     }
    else if(event.altKey && event.key==='z'){let imglink = prompt('add link for block background.')||'https://i.pinimg.com/originals/d9/c3/14/d9c314ef171df6071278be39a4a85101.gif'//block image prompt
     localStorage.setItem("imglink", imglink);}
})

const lastRun = localStorage.getItem("lastRunDate")||0;//main script
const today = new Date().toISOString().split("T")[0];
if (lastRun!=today){
localStorage.setItem("lastRunDate", today)
let a =0;
timer(a);
}else{
let a = parseInt(localStorage.getItem("a")||1);
timer(a)
}



de_distract();//still main script
window.addEventListener('popstate',urload);