// ==UserScript==
// @name        [deprecated] muahahaha lanacion
// @namespace   muahahaha
// @include     http://www.lanacion.com.ar/*
// @version     1.2.1
// @grant       none
// @description remove de register modal box
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/10719/%5Bdeprecated%5D%20muahahaha%20lanacion.user.js
// @updateURL https://update.greasyfork.org/scripts/10719/%5Bdeprecated%5D%20muahahaha%20lanacion.meta.js
// ==/UserScript==

function f(){
  if(
    document.readyState==='complete'
    &&document.querySelector('div.lnmodal.pantalla-completa.login')
  ){
    console.log(1,new Date());
    document.querySelector('div.lnmodal.pantalla-completa.login').parentElement.removeChild(document.querySelector('div.lnmodal.pantalla-completa.login'));
  }
  else if(document.body.className){
    console.log(0,new Date());
    setTimeout(f,1000);
  }
}
f();