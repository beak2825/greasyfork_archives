// ==UserScript==
// @name       Usuwanie niebieskich
// @namespace  http://www.wykop.pl/*
// @version    1.3
// @description usuwa niebieskich z wykopu
// @include     *://www.wykop.pl/*
// @exclude      *://www.wykop.pl/cdn/*
// @copyright  Arkatch, mihaubiauek
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/33037/Usuwanie%20niebieskich.user.js
// @updateURL https://update.greasyfork.org/scripts/33037/Usuwanie%20niebieskich.meta.js
// ==/UserScript==
(function(){
$("img.lazy").each(function(){$(this).attr("src",$(this).data("original"));});
try{
var MORE = document.getElementsByClassName('more');
for(var i = 0, len = MORE.length; i < len; i++) {
    MORE[i].onclick = function(){setTimeout(PAS, 1000);setTimeout(PAS, 4000);};
}}catch(e){
return;
}
})();
(function(){
try{
document.getElementById('newEntriesCounter').onclick = function(){setTimeout(PAS, 1000);setTimeout(PAS, 4000);};
}catch(e){
return;
}
})();
PAS();
function PAS(){
	var PASEK = document.getElementsByClassName('avatar male lazy');
	for(var i = 0;i<PASEK.length;i++){
		PASEK[i].closest('li').style.display = "none";
    }
}