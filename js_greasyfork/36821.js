// ==UserScript==
// @name     jkanime publicidad
// @author daryo
// @version  2.7
// @grant    none
// @locale http://jkanime.net/*
// @include http://jkanime.net/*
// @include https://openload.co/embed/*
// @namespace https://greasyfork.org/users/34246
// @description bloquear popups jkanime
// @downloadURL https://update.greasyfork.org/scripts/36821/jkanime%20publicidad.user.js
// @updateURL https://update.greasyfork.org/scripts/36821/jkanime%20publicidad.meta.js
// ==/UserScript==
if(location.hostname=="openload.co"){
window.addEventListener('load', function() {
    // your code here
   window.stop();
}, false);
}

else if(location.hostname=="jkanime.net"){
  var x = document.getElementsByTagName("BODY")[0];
	addEventListener("click",function(e){ e.stopPropagation();},true);


  var enlaces=document.getElementsByClassName('player_conte');
  var panel=document.getElementsByClassName('video_option')[0];
  if(enlaces != null && panel!= null){
  panel.parentNode.removeChild(panel);
  var contenedor=document.getElementById('videobox_content');
  var hijoprimero=contenedor.childNodes[0];
	for(a=0;a<enlaces.length;a++){
  	var bot= document.createElement('a');
		bot.innerHTML="opcion "+(enlaces.length-a)+" ";
  	bot.target="_blank";
  	bot.href=enlaces[a].src;
  	bot.style.backgroundColor= "yellow";
  	bot.style.padding="6px";
  	bot.style.borderStyle="solid";
  	contenedor.insertBefore(bot,hijoprimero);
  	var hijoprimero=bot;
  }
  var contenedor=document.getElementsByClassName('btn_nav_n')[0];
  var enlace=String(contenedor.onclick);
  var link=enlace.match(/javascript\:location.href=\'(.*)\'/)[1];
  contenedor.innerHTML="<a href="+link+" style='text-decoration: none; color:white;'> capitulo siguiente </a>";
  }
else{
  var capitulos=document.getElementsByClassName('listpag list22');
  if(capitulos!=null){
  var cantidad=capitulos.length;
  for(a=0;a<cantidad;a++){
  capitulos[a].setAttribute('onmouseup','window.location.href="'+capitulos[a].href+'";  location.reload(); ');
  }
  }

}
}