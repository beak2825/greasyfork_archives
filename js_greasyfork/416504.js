// ==UserScript==
// @name         Crunchyroll Web Player
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Este script Permite ver todos os vídeos do site crunchyroll.
// @author       Oltiz
// @match        http://www.crunchyroll.com/*
// @match        https://www.crunchyroll.com/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/416504/Crunchyroll%20Web%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/416504/Crunchyroll%20Web%20Player.meta.js
// ==/UserScript==

function string(str, first_character, last_character) {
	if(str.match(first_character + "(.*)" + last_character) == null) {
		return null;
	}else{
	    return str.match(first_character + "(.*)" + last_character)[1].trim()
    }
}

function playerJS(html)
{	
	document.querySelector("#showmedia_free_trial_signup").style.display = "none";
	document.querySelector(".showmedia-trailer-notice").style.display = "none";
	document.querySelector(".try-free-header-menu-item").style.display = "none";

	const player = document.getElementById('showmedia_video_player');
	player.parentNode.removeChild(player);
	const config_media = JSON.parse(string(html, "vilos.config.media = ", ";"));

	let frame;
	frame = document.createElement("iframe");
	frame.setAttribute("id", "frame"); 
	frame.setAttribute("src", "https://codevinc.github.io/"); 
	frame.setAttribute("width","100%");
	frame.setAttribute("height","100%");
	frame.setAttribute("frameborder","0");
	frame.setAttribute("scrolling","no");
	frame.setAttribute("allowfullscreen","allowfullscreen");
	frame.setAttribute("allow","autoplay; encrypted-media *");


	if(document.body.querySelector("#showmedia_video_box") != null)
	{
		document.body.querySelector("#showmedia_video_box").appendChild(frame);
	} else {
		document.body.querySelector("#showmedia_video_box_wide").appendChild(frame);
	}

	frame.onload = function(){
		frame.contentWindow.postMessage({
       		'video_config_media': [JSON.stringify(config_media)]
    	},"*");
    };
}

function onloadfunction() 
{
	const html = document.getElementsByTagName('body')[0].innerHTML;

	if(string(html, "vilos.config.media = ", ";") != null){
		playerJS(html);
	}
}

document.addEventListener("DOMContentLoaded", onloadfunction());
