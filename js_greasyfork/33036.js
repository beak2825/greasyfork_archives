// ==UserScript==
// @name       Usuwanie różowych 
// @namespace  http://www.wykop.pl/*
// @version    1.4
// @description usuwa różowe z wykopu
// @include     *://www.wykop.pl/*
// @exclude      *://www.wykop.pl/cdn/*
// @copyright  Arkatch
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/33036/Usuwanie%20r%C3%B3%C5%BCowych.user.js
// @updateURL https://update.greasyfork.org/scripts/33036/Usuwanie%20r%C3%B3%C5%BCowych.meta.js
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
window.onload = function(){setInterval(PAS, 1000);};
setInterval(function(){	$("img.lazy").each(function(){$(this).attr("src",$(this).data("original"));});}, 500);
function PAS(){

	try{
	var PASEK = document.getElementsByClassName('avatar male lazy');
	var PASEK2 = document.querySelectorAll('img[class="avatar  lazy"]');
	for(var i = 0;i<PASEK.length;i++){
		PASEK[i].closest('li').style.display = "none";
    }
	for(var i = 0;i<PASEK2.length;i++){
		PASEK2[i].closest('li').style.display = "none";
    }
	}catch(e){}
}