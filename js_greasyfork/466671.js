// ==UserScript==
// @name     keydrop
// @grant    none
// @match    https://key-drop.com/pl/case-battle/*
// @match    https://key-drop.com/en/case-battle/*
// @version  1.3
// @author   Ugefen
// @description keydrop code battle
// @namespace https://www.tampermonkey.net/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466671/keydrop.user.js
// @updateURL https://update.greasyfork.org/scripts/466671/keydrop.meta.js
// ==/UserScript==
 
 
 
let count;
 
let parent;
let child1;
let child2;
let chpar1;
let chpar2;
let chpar3;
let chparch1;
let chparch2;
let chparch3;
let state = 0;
let codes = [];
 
function getCount(){
count = document.querySelectorAll('.rounded-bl-lg').length;
 
  for(let i = 0;i<count;i++){
    parent = document.querySelectorAll('.rounded-tl-lg')[i];
          child1 = parent.childNodes[0];


    if(child1.childNodes.length==1){
      child2 = child1.childNodes[0];
      chpar1 = child1.parentNode;
      chpar2 = chpar1.parentNode;
      chpar3 = chpar2.parentNode;
      chparch1 = chpar3.childNodes[4];
      chparch2 = chparch1.childNodes[0];
      chparch3 = chparch2.childNodes[0];
     if(child2.innerHTML=="FREE"){
        if(!codes.includes(chparch3.href.split('/')[5])){
           window.open(chparch3.href, '_blank'); 
        codes.push(chparch3.href.split('/')[5]);
                   }
        }
    }
    
 
}

  
}

 
addEventListener('keydown',checkKey,false);
 
function checkKey(e){

  	if(e.keyCode==221){
      state=1;
customLoop();
	}
}
 
function customLoop(){
  getCount();
setTimeout(customLoop,100);
}