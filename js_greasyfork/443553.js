// ==UserScript==
// @name        给 p5js.org 加分段
// @namespace   leizingyiu.net
// @match       http*://p5js.org/*
// @grant       none
// @version     0.0.1
// @author      leizingyiu
// @description 2022/4/18 12:38:58
// @license     GNU AGPLv3 
// @downloadURL https://update.greasyfork.org/scripts/443553/%E7%BB%99%20p5jsorg%20%E5%8A%A0%E5%88%86%E6%AE%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/443553/%E7%BB%99%20p5jsorg%20%E5%8A%A0%E5%88%86%E6%AE%B5.meta.js
// ==/UserScript==


function yiu_styling_p5js_org(){
  [...document.querySelectorAll('p')].map(p=>{
    p.innerHTML=p.innerHTML.replace(/(•)/g,`<span class='yiu_br'></span>$1`);
  });

  var style_id='yiu_style';
  var style_innerHTML=`
  .yiu_br{
  height:1em;
  width:100%;
  display:block;
  }
  
  p{
    border-top: solid 1px #eee;
    margin-top: 1em;
  }
  
  .paramtype p {
    border-top: initial;
    margin-top: initial;
  }
  
  .paramtype p em{
    display:block;
    margin-top:1em;
  }
  
  .paramname{
    max-width: 25%;
  }
  `;

  if(document.getElementById(style_id)){
    document.getElementById(style_id).innerHTML=style_innerHTML;
  }else{
    let style=document.createElement('style');
    style.id=style_id;
    style.innerHTML=style_innerHTML;
    document.head.appendChild(style);
  }
}

if(document.body){
  main=String(yiu_styling_p5js_org);
  
  window.addEventListener('load',()=>{
    setTimeout("eval('('+main+')()')",500);
  });
}


