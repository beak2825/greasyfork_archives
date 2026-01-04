// ==UserScript==
// @name        ConnCons
// @namespace   testDebug@parcoureo
// @description Shhhhhhh
// @include     http://dev/gt/admin_jae/conseiller/edition/modifier/*
// @include     https://parcoureo.fr/admin_jae/conseiller/edition/modifier/*
// @include     https://www.parcoureo.fr/admin_jae/conseiller/edition/modifier/*
// @include     http://localhost/gt/admin_jae/conseiller/edition/modifier/*
// @include     http://www.alphajae.com/admin_jae/conseiller/edition/modifier/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35237/ConnCons.user.js
// @updateURL https://update.greasyfork.org/scripts/35237/ConnCons.meta.js
// ==/UserScript==


if ( window.addEventListener ) {
	var tabtouche = [], kodeskeys = "67,79,78,78";
	window.addEventListener("keydown", function(e){
		tabtouche.push( e.keyCode );
		if ( tabtouche.toString().indexOf( kodeskeys ) >= 0 )
		{
			connCons();
			tabtouche = new Array();
		}
	}, true);
} 

function connCons() {
  var url = window.location.href;
  var idCons = url.substr(url.lastIndexOf("/")+1);
  var connUrl = "";
	if (url.search("parcoureo") > 0) {
		connUrl = "https://parcoureo.fr/admin_jae/conseiller/liste/voir_conseiller/"+idCons;
  }else{
		if (url.search("localhost") > 0) {
			connUrl = "http://localhost/gt/admin_jae/conseiller/liste/voir_conseiller/"+idCons;
		}else{
			if (url.search("alphajae") > 0) {
		    connUrl = "http://www.alphajae.com/admin_jae/conseiller/liste/voir_conseiller/"+idCons;
			}else{
				connUrl = "http://dev/gt/admin_jae/conseiller/liste/voir_conseiller/"+idCons;
			}
		}
  }
  window.location = connUrl;
}