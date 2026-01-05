// ==UserScript==
// @name	JVBan - Savoir qui est ban sans ouvrir sa CDV !
// @author	Sur une idée de PixelRaid codé par GarryMod
// @include     http://*.jeuxvideo.com/*
// @require     http://code.jquery.com/jquery-1.12.0.min.js
// @description	Savoir qui est ban sans ouvrir sa CDV !
// @version 0.0.1.20160420202910
// @namespace https://greasyfork.org/users/39736
// @downloadURL https://update.greasyfork.org/scripts/18980/JVBan%20-%20Savoir%20qui%20est%20ban%20sans%20ouvrir%20sa%20CDV%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/18980/JVBan%20-%20Savoir%20qui%20est%20ban%20sans%20ouvrir%20sa%20CDV%20%21.meta.js
// ==/UserScript==

var array = Array.prototype.slice.call(document.getElementsByClassName("bloc-pseudo-msg"));

for (var i = 0; i < array.length; i++) {
	var pseudo = array[i].innerHTML.replace(/\s/g, '');
	pseudo = pseudo.toLowerCase();
	var url = "http://www.jeuxvideo.com/profil/"+pseudo+"?mode=infos";
	
	$.ajax({
	  method: "GET",
	  url: url,
	  success: function(data){
      	if(data.indexOf("Le pseudo est banni.") > -1){
			array[i].style.textDecoration = "line-through";
			array[i].style.color = "#777";
			array[i].title = "Ce pseudo est banni";
		}
      },
	  async:false
	})
}
