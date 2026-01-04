// ==UserScript==
// @name         Cuties Unofficial Usergroup
// @namespace    https://www.v3rmillion.net/
// @version      1.1
// @description  owo
// @author       Segfault
// @match        https://v3rmillion.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382459/Cuties%20Unofficial%20Usergroup.user.js
// @updateURL https://update.greasyfork.org/scripts/382459/Cuties%20Unofficial%20Usergroup.meta.js
// ==/UserScript==

let cuties = ["2", "584265", "1439", "520567", "1034337", "1013658", "172565"];

for(let j=0; j<cuties.length;j++){
  cuties[j] = "=" + cuties[j] + "$";
}

let imgs = document.getElementsByTagName('img');
for(let i=0;i<imgs.length;i++){
  if(imgs[i].src.indexOf("UserBars/")>-1 && imgs[i].alt!=null && imgs[i].parentNode!=null && imgs[i].parentNode.parentNode!=null){
    let proflink = imgs[i].parentNode.parentNode.getElementsByClassName('largetext');
    if(proflink[0]!=null){
      let pA = proflink[0].getElementsByTagName('a')[0].href;
      if(new RegExp(cuties.join("|")).test(pA)){
        console.log(proflink[0].innerHTML);
        imgs[i].src = 'https://i.imgur.com/gA7R5ZQ.png';
        proflink[0].innerHTML = proflink[0].innerHTML.replace(/color:(\s)?#.*;/gm, "color:#FF4CD8;");
      }
    }
  }
}