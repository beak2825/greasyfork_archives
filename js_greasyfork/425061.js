// ==UserScript==
// @name         Crunchyroll IFrame Player
// @namespace    https://github.com/itallolegal/crp-iframe-player
// @version      1.7
// @description  Tampermonkey vers by akda007
// @author       akda007
// @match        https://www.crunchyroll.com/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        none
// @icon         https://i.imgur.com/UhG1FLW.png
// @downloadURL https://update.greasyfork.org/scripts/425061/Crunchyroll%20IFrame%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/425061/Crunchyroll%20IFrame%20Player.meta.js
// ==/UserScript==

var HTML = document.documentElement.innerHTML;

//function que pega algo dentro dentro do html.
function pegaString(str, first_character, last_character) {
	if(str.match(first_character + "(.*)" + last_character) == null){
		return null;
	}else{
	    new_str = str.match(first_character + "(.*)" + last_character)[1].trim()
	    return(new_str)
    }
}
//function que mudar o player para um mais simples.
function importPlayer(){
		console.log("[CR Premium] Removendo player da Crunchyroll...");
		var elem = document.getElementById('showmedia_video_player');
    	elem.parentNode.removeChild(elem);

		console.log("[CR Premium] Pegando dados da stream...");
		var video_config_media = JSON.parse(pegaString(HTML, "vilos.config.media = ", ";"));

    	console.log("[CR Premium] Adicionando o jwplayer...");
    	ifrm = document.createElement("iframe");
    	ifrm.setAttribute("id", "frame");
		ifrm.setAttribute("src", "https://crpif.akda007.repl.co/");
		ifrm.setAttribute("width","100%");
		ifrm.setAttribute("height","100%");
		ifrm.setAttribute("frameborder","0");
		ifrm.setAttribute("scrolling","no");
		ifrm.setAttribute("allowfullscreen","allowfullscreen");
		ifrm.setAttribute("allow","autoplay; encrypted-media *");

		if(document.body.querySelector("#showmedia_video_box") != null){
			document.body.querySelector("#showmedia_video_box").appendChild(ifrm);
		}else{
			document.body.querySelector("#showmedia_video_box_wide").appendChild(ifrm);
		}

		//Remove Nota do topo sobre experimentar o premium
		if (document.body.querySelector(".freetrial-note") != null) {
			console.log("[CR Premium] Removendo Free Trial Note...");
			document.body.querySelector(".freetrial-note").style.display = "none";
		}

		//Remove avisos q o video nn pode ser visto
		if(document.body.querySelector(".showmedia-trailer-notice") != null){
			console.log("[CR Premium] Removendo Trailer Notice...");
			document.body.querySelector(".showmedia-trailer-notice").style.display = "none";
		}

		//Remove sugestão de inscrever-se para o trial gratuito
		if(document.body.querySelector("#showmedia_free_trial_signup") != null){
			console.log("[CR Premium] Removendo Free Trial Signup...");
			document.body.querySelector("#showmedia_free_trial_signup").style.display = "none";
		}


		ifrm.onload = function(){
			ifrm.contentWindow.postMessage({
           		'video_config_media': [JSON.stringify(video_config_media)],
           		'lang': [pegaString(HTML, 'LOCALE = "', '",')]
        	},"*");
	    };

		//console.log(video_config_media);
}
//function ao carregar pagina.
function onloadfunction() {
	if(pegaString(HTML, "vilos.config.media = ", ";") != null){
		importPlayer();
	}
}
document.addEventListener("DOMContentLoaded", onloadfunction());
