// ==UserScript==
// @name        WuxiaWorld.com_Saca_Comentrarios
// @version     1
// @namespace   zack0zack
// @description WuxiaWorld.com saca los comentarios
// @icon	
// @include     *www.wuxiaworld.com/*
// @downloadURL https://update.greasyfork.org/scripts/35693/WuxiaWorldcom_Saca_Comentrarios.user.js
// @updateURL https://update.greasyfork.org/scripts/35693/WuxiaWorldcom_Saca_Comentrarios.meta.js
// ==/UserScript==


function remove(w){
  if (w){
	w.parentNode.removeChild( w );
  }
}


remove( document.getElementById('comments') );
remove( document.getElementById('meta-2') );
remove( document.getElementById('categories-3') );
for(i=10; i < 90 ; i++ ) {
   remove( document.getElementById('simple_progress_bar-' + i) );
   remove( document.getElementById('ai_widget-' + i) );
   remove( document.getElementById('text-' + i) );
}


window.addEventListener("load",function() {

// var evt = document.createEvent("MouseEvents");
// evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
// document.getElementsByTagName('button')[0].dispatchEvent(evt);

 remove( document.getElementById('comments') );
 remove( document.getElementById('meta-2') );
 remove( document.getElementById('categories-3') );
 for(i=10; i < 40 ; i++ ) {
   remove( document.getElementById('simple_progress_bar-' + i) );
   remove( document.getElementById('ai_widget-' + i) );
   remove( document.getElementById('text-' + i) );
 }
},true)
