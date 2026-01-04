// ==UserScript==
// @name        Rimuovi gioco d'azzardo da scambieuropei.info
// @namespace   StephenP
// @match       https://www.scambieuropei.info/*
// @grant       none
// @license     CC-PDDC
// @version     1.1
// @author      StephenP
// @description Questo script prova a rimuovere da ScambiEuropei.info i finti articoli, che sono in realtà pubblicità ai casinò online.
// @downloadURL https://update.greasyfork.org/scripts/505299/Rimuovi%20gioco%20d%27azzardo%20da%20scambieuropeiinfo.user.js
// @updateURL https://update.greasyfork.org/scripts/505299/Rimuovi%20gioco%20d%27azzardo%20da%20scambieuropeiinfo.meta.js
// ==/UserScript==
let articles=document.body.getElementsByTagName("ARTICLE");
if(articles.length==0){
  articles=document.body.getElementsByClassName("c-post-content");
}
const azzardo=/gioco online|giocare online|casin|scomme|gambl|gaming/g
let tbr=[]
for(let a of articles){
  if(a.innerHTML.match(azzardo)){
    if(document.getElementById("pageContent")){
        if(document.getElementById("pageContent").getElementsByTagName("ARTICLE").length==1){
             a.innerHTML="\<h2\>Lo script \"Rimuovi gioco d'azzardo da scambieuropei.info\" ha nascosto questo articolo perché sembra essere una pubblicità al gioco d'azzardo.\</h2\>"
        }
    }
    else if(document.body.getElementsByClassName("c-post-content").length==1){
      a.innerHTML="\<h2\>Lo script \"Rimuovi gioco d'azzardo da scambieuropei.info\" ha nascosto questo articolo perché sembra essere una pubblicità al gioco d'azzardo.\</h2\>"
    }
    else{
      if(a.parentNode.parentNode.classList.contains("carousel-inner")){
        a.firstChild.innerHTML="";
      }
      else{
        tbr.push(a);
      }
    }
  }
}
let menuEntries=document.body.getElementsByClassName("col-xs-3");
for(let e of menuEntries){
  if(e.innerHTML.match(azzardo)){
    tbr.push(e);
  }
}
for(let r of tbr){
  r.remove();
}