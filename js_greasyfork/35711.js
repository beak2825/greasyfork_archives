// ==UserScript==
// @name        MistyCloudTranslations
// @version     1
// @namespace   zack0zack
// @description limpia la pagina MistyCloudTranslations.com
// @include     *www.mistycloudtranslations.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35711/MistyCloudTranslations.user.js
// @updateURL https://update.greasyfork.org/scripts/35711/MistyCloudTranslations.meta.js
// ==/UserScript==


var i;
for(i=1; i < 90 ; i++ ) {
//   remove( document.getElementById('' + i) );
   remove( document.getElementById('text-' + i) );
   remove( document.getElementById('media_image-' + i) );
   remove( document.getElementById('search-' + i) );
   remove( document.getElementById('blog_subscription-' + i) );
   remove( document.getElementById('tag_cloud-' + i) );
}


var i, v = document.getElementsByTagName('img');
for(i=0; i < v.length ; i++ ) {
  if (v[i].src == 'http://www.mistycloudtranslations.com/wp-content/uploads/2017/03/Main-Logo-Small2-1.jpg'){
    remove( v[i].parentNode.parentNode.parentNode );
  }
}



window.addEventListener("load",function() {

 var i, v = document.getElementsByTagName('img');
 for(i=0; i < v.length ; i++ ) {
   if (v[i].src == 'http://www.mistycloudtranslations.com/wp-content/uploads/2017/03/Main-Logo-Small2-1.jpg'){
	remove( v[i].parentNode.parentNode.parentNode );
   }
 }

 for(i=1; i < 90 ; i++ ) {
//   remove( document.getElementById('' + i) );
   remove( document.getElementById('text-' + i) );
   remove( document.getElementById('media_image-' + i) );
   remove( document.getElementById('search-' + i) );
   remove( document.getElementById('blog_subscription-' + i) );
   remove( document.getElementById('tag_cloud-' + i) );
 }
},true)

function remove(w){
  if (w){
	w.parentNode.removeChild( w );
  }
}
