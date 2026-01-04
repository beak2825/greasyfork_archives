// ==UserScript==
// @name        TuManga Sacar ADS
// @version     1
// @namespace   zack0zack
// @description Quita las Propagandas ADS
// @include     *www.tumangaonline.com*
// @exclude     *www.tumangaonline.com/visor/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35713/TuManga%20Sacar%20ADS.user.js
// @updateURL https://update.greasyfork.org/scripts/35713/TuManga%20Sacar%20ADS.meta.js
// ==/UserScript==


window.setTimeout(function(){
var i, v = document.getElementsByTagName('div');
for(i=0; i < v.length ; i++ ) {
  if (v[i].id.substring(0, 6) == 'BB_SK_'){
//    alert( v[i].id );
    remove(v[i].parentNode);
  }
}
}, 1000);


var i, v = document.getElementsByTagName('div');
for(i=0; i < v.length ; i++ ) {
  if (v[i].id.substring(0, 6) == 'BB_SK_'){
	remove(v[i].parentNode);
  }

  if (v[i].className == 'Flash_L'){
	v[i].parentNode.removeChild( v[i] );
  }
  if (v[i].className == 'Flash_R'){
	v[i].parentNode.removeChild( v[i] );
  }
  if (v[i].className == 'Flash_L  hidden-xs hidden-sm hidden-md'){
	v[i].parentNode.removeChild( v[i] );
  }
  if (v[i].className == 'Flash_R  hidden-xs hidden-sm hidden-md'){
	v[i].parentNode.removeChild( v[i] );
  }
  if (v[i].className == 'Flash_L hidden-xs hidden-sm hidden-md'){
	v[i].parentNode.removeChild( v[i] );
  }
  if (v[i].className == 'Flash_R hidden-xs hidden-sm hidden-md'){
	v[i].parentNode.removeChild( v[i] );
  }


  if (v[i].className == 'ng-scope'){
//	v[i].parentNode.removeChild( v[i].parentNode );
  }
}


var i, v = document.getElementsByTagName('iframe');
for(i=0;i < v.length; i++ ) {
	if (v[i]){
		v[i].parentNode.removeChild( v[i] );
	}
}

//var i, v = document.getElementsByTagName('div');
//i= v.length - 1;
//v[i].parentNode.removeChild( v[i] );
//i= v.length;
//v[i].parentNode.removeChild( v[i] );



var v = document.getElementById('taboola-above-article-thumbnails');
if (v){
	v.parentNode.removeChild( v );
}



window.addEventListener("load",function() {

 var v = document.getElementById('taboola-above-article-thumbnails');
 if (v){
	v.parentNode.removeChild( v );
 }

 var i, v = document.getElementsByTagName('iframe');
 for(i=0;i < v.length; i++ ) {
	if (v[i]){
		v[i].parentNode.removeChild( v[i] );
	}
 }

 var i, v = document.getElementsByTagName('div');
 for(i=0; i < v.length ; i++ ) {
   if (v[i].className == 'Flash_L'){
	v[i].parentNode.removeChild( v[i] );
   }
   if (v[i].className == 'Flash_R'){
	v[i].parentNode.removeChild( v[i] );
   }
   if (v[i].className == 'Flash_L  hidden-xs hidden-sm hidden-md'){
	v[i].parentNode.removeChild( v[i] );
   }
   if (v[i].className == 'Flash_R  hidden-xs hidden-sm hidden-md'){
	v[i].parentNode.removeChild( v[i] );
   }
   if (v[i].className == 'Flash_L hidden-xs hidden-sm hidden-md'){
	v[i].parentNode.removeChild( v[i] );
   }
   if (v[i].className == 'Flash_R hidden-xs hidden-sm hidden-md'){
	v[i].parentNode.removeChild( v[i] );
   }

   if (v[i].id.substring(0, 6) == 'BB_SK_'){
	remove(v[i].parentNode);
   }

   if (v[i].className == 'ng-scope'){
//	v[i].parentNode.removeChild( v[i].parentNode );
   }

 }
},true)
