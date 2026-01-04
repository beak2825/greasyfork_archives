// ==UserScript==
// @name        UF exe
// @namespace   UF exe
// @version     2.0
// @author      Nadie
// @description Muestra directamente los enlaces de Unión Fansub sin pasar por exe.io y bloquea los popups al navegar por el foro.
// @grant       none
// @include     *unionfansub.com/*
// @downloadURL https://update.greasyfork.org/scripts/404503/UF%20exe.user.js
// @updateURL https://update.greasyfork.org/scripts/404503/UF%20exe.meta.js
// ==/UserScript==
var links = document.links;
var link;
for(var i=links.length-1; i >=0; i--){
  link = links[i];
  link.href = link.href.replace("https://exe.io/st?api=a89576850dfda3a0295ac01c036af4b0dfa5b272&url=", '');
  if (!link.href.includes(".php")) {
      
      link.href = link.href.replace("foro.unionfansub.com/", '');
      
   
  }
              
}

function NoOpen(e){return 1}
parent.open=NoOpen;
this.open=NoOpen;
window.open=NoOpen;
open=NoOpen;

window.open = function(){
return;
}

open = function(){
return;
}


this.open = function(){
return;
}


parent.open = function(){
return;
} 