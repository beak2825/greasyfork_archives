// ==UserScript==
// @name Hitbox Emotes
// @namespace https://twitter.com/gamingtom
// @namespace https://github.com/GamingTom/HitboxEmotes
// @namespace https://streamtip.com/h/gamingtom
// @description The original Hitbox Emotes script with ober 15,000 emotes! - Request your custom emotes and mod badges here!
// @include *.hitbox.tv/*
// @include *.vgstreams.com/*
// @include *.multistream.xuzia.com/*
// @icon http://i.imgur.com/fa1Kkku.png
// @version 1.3.9
// @downloadURL https://update.greasyfork.org/scripts/484/Hitbox%20Emotes.user.js
// @updateURL https://update.greasyfork.org/scripts/484/Hitbox%20Emotes.meta.js
// ==/UserScript==

//Feel free to donate! https://streamtip.com/h/gamingtom

function style_init()
{
    var CustomStyle = document.createElement('link');
	CustomStyle.setAttribute('rel', 'stylesheet');
	CustomStyle.setAttribute('type', 'text/css');
	CustomStyle.setAttribute('href', 'https://dl.dropboxusercontent.com/u/23313911/Hitbox%20Emotes/css/CustomStyle.css')    
    
	var head = document.getElementsByTagName('head')[0];
	if (head) {
        head.appendChild(CustomStyle);
		console.log("Hitbox Emotes: Custom style loaded")
    }
}

function javascript_init()
{	
	var TwitchGlobal = document.createElement('script');
	TwitchGlobal.type = 'text/javascript';
	TwitchGlobal.src = "https://dl.dropboxusercontent.com/u/23313911/Hitbox%20Emotes/javascript/TwitchGlobal.js";

	var TwitchSub = document.createElement('script'); //Thanks to the http://twitchemotes.com api!
	TwitchSub.type = 'text/javascript';
	TwitchSub.src = "https://dl.dropboxusercontent.com/u/23313911/Hitbox%20Emotes/javascript/TwitchSub.js";
	
	var BackupEmotes = document.createElement('script');
	BackupEmotes.type = 'text/javascript';
	BackupEmotes.src = "https://dl.dropboxusercontent.com/u/23313911/Hitbox%20Emotes/javascript/EmotesBackup.js";
	
	var CustomEmotes = document.createElement('script');
	CustomEmotes.type = 'text/javascript';
	CustomEmotes.src = "https://dl.dropboxusercontent.com/u/23313911/Hitbox%20Emotes/javascript/CustomEmotes.js";
	
	var CustomBadges = document.createElement('script');
	CustomBadges.type = 'text/javascript';
	CustomBadges.src = "https://dl.dropboxusercontent.com/u/23313911/Hitbox%20Emotes/javascript/CustomBadges.js";
    
	var head = document.getElementsByTagName('head')[0];
	if (head) {
		head.appendChild(TwitchGlobal);
		console.log("Hitbox Emotes: Global Twitch emotes loaded from " + TwitchGlobal.src)
		head.appendChild(TwitchSub);
		console.log("Hitbox Emotes: Subscriber Twitch emtoes loaded from " + TwitchSub.src)		
		head.appendChild(BackupEmotes);
		console.log("Hitbox Emotes: Backup emotes loaded from " + BackupEmotes.src)		
		head.appendChild(CustomEmotes);
		console.log("Hitbox Emotes: Custom emotes loaded from " + CustomEmotes.src)
		head.appendChild(CustomBadges);
	}
}

style_init();
window.onload = javascript_init;