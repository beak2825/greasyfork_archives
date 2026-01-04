// ==UserScript==
// @name     SearXNG Remove Unused Languages
// @name:tr  SearXNG'de Kullanılmayan Dilleri Kaldır
// @namespace https://animegirls.info/
// @version  1
// @grant    none
// @match		 https://search.inetol.net/search*
// @author	 Emilia
// @description	A script to remove unused languages from SearXNG
// @description:tr 	SearXNG'den kullanılmayan dilleri kaldırmaya yarayan bir script.
// @icon		 https://search.inetol.net/static/themes/simple/img/favicon.svg
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467436/SearXNG%20Remove%20Unused%20Languages.user.js
// @updateURL https://update.greasyfork.org/scripts/467436/SearXNG%20Remove%20Unused%20Languages.meta.js
// ==/UserScript==


var languages = ["tr-TR", 
                 "en-US"];
var select = document.getElementById("language");

function deleteLanguages() {
  for (var i = 0; i < select.length; i++){
    var option = select.options[i];
    if(!languages.includes(option.value)){
    	select.remove(i);
    }
  }
}

for (var x = 0; x < 10; x++){
	deleteLanguages();
}