// ==UserScript==
// @name        UF AntiAdfly
// @namespace   UF AntiAdfly
// @version     1.3.2
// @author      Kamichama
// @description Muestra directamente los enlaces de Unión Fansub sin pasar por Adf.ly y bloquea los popups al navegar por el foro.
// @grant       none
// @include     *unionfansub.com/*
// @downloadURL https://update.greasyfork.org/scripts/14956/UF%20AntiAdfly.user.js
// @updateURL https://update.greasyfork.org/scripts/14956/UF%20AntiAdfly.meta.js
// ==/UserScript==
var links = document.links;
var link;
for(var i=links.length-1; i >=0; i--){
  link = links[i];
  link.href = link.href.replace("sh.st/st/22e035111b405ce11eb74e9a5c84527b/out.unionfansub.com/3096066/", '');
              link.href = link.href.replace("~~4dfl7SUCKS~~", '#');
              link.href = link.href.replace("adf.ly/3096066/int/parche.unionfansub.com", '');
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