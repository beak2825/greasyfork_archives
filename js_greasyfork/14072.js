// ==UserScript==
// @name        StreamProtocol for Twitch and HitBox
// @namespace   sp-twitch
// @description Watch Twitch and HitBox in an external player
// @include http://www.twitch.tv/*
// @include https://www.twitch.tv/*
// @include http://www.hitbox.tv/*
// @include https://www.hitbox.tv/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14072/StreamProtocol%20for%20Twitch%20and%20HitBox.user.js
// @updateURL https://update.greasyfork.org/scripts/14072/StreamProtocol%20for%20Twitch%20and%20HitBox.meta.js
// ==/UserScript==
// Based on original version by https://greasyfork.org/en/users/3167-winceptor

console.log("grabbing");

var host = window.location.host;
	
var hook = function()
{
	if (host=="www.twitch.tv")
	{
		var div = document.querySelectorAll('.channel-actions')[0];
		if (div==null) {
			setTimeout(function(){hook();},1000);
			return
		}

		var user = document.URL.split("twitch.tv/")[1].split("/")[0];

		var tokenurl = 'http://api.twitch.tv/api/channels/' + user + '/access_token?grabber';
        $.get(tokenurl, function(data) {
            var token = data['token'];
            var signature = data['sig'];

            var url = 'http://usher.justin.tv/api/channel/hls/' + user + '.m3u8?allow_source=true&token=' + token + '&sig=' + signature;
            var urle = encodeURI(url);
            
            var newspan = document.createElement("span");
            newspan.innerHTML = '<span class="ember-view button action"><a href="stream+' + urle + '">View in external player</a></span>';
            div.appendChild(newspan);
        });
		console.log("Hooking...");
	}

	if (host=="www.hitbox.tv")
	{
		var div = document.querySelectorAll('.stats')[0];
		if (div==null) {
			setTimeout(function(){hook();},1000);
			return
		}

		var user = document.URL.split("hitbox.tv/")[1].split("/")[0];

		var url = 'http://api.hitbox.tv/player/hls/' + user + '.m3u8';

		var newspan = document.createElement("span");
		newspan.innerHTML = '<a href="stream+' + url + '">View in external player</a>';
		div.appendChild(newspan);    

		console.log("Hooking...");
	}
}

hook();

console.log("StreamProtocol for Twitch and HitBox: " + host);
