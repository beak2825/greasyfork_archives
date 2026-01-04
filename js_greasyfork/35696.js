// ==UserScript==
// @name        TuMangaOnline WebSite Error
// @version     1
// @namespace   zack0zack
// @description Recarga la pagina cuando da Error 502
// @icon	
// @include     *www.tumangaonline.com/*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35696/TuMangaOnline%20WebSite%20Error.user.js
// @updateURL https://update.greasyfork.org/scripts/35696/TuMangaOnline%20WebSite%20Error.meta.js
// ==/UserScript==




window.addEventListener("load",function() {
 window.setTimeout(function(){

 var i, v = document.getElementsByTagName('i');
 for(i=0; i < v.length ; i++ ) {
    if (v[i].className == 'fa fa-fw icon-paper-stack'){			// cf-btn cf-btn-success
	//click elemento
	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	v[i].parentNode.dispatchEvent(evt);
    }
 }


var i, v = document.getElementsByTagName('div');
for(i=0; i < v.length ; i++ ) {
  if (v[i].id.substring(0, 6) == 'BB_SK_'){
//    alert( v[i].id );
    remove(v[i].parentNode);
  }
}

 }, 2500);
},true)



function remove(w){
  if (w){
	w.parentNode.removeChild( w );
  }else{
	if ( document.getElementById(w) ){
		document.getElementById(w).parentNode.removeChild( document.getElementById(w) );
	}
  }
}
