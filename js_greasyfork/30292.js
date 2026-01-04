// ==UserScript==
// @name         Send Agario SIP To Discord
// @namespace    http://tampermonkey.net/
// @version      1.94
// @description  Gets the agario server IP link and posts it to discord
// @author       σмg ι ℓσνє уσυ! Published by Jimboy3100
// @match        http://agar.io/*
// @match        https://agar.io/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/30292/Send%20Agario%20SIP%20To%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/30292/Send%20Agario%20SIP%20To%20Discord.meta.js
// ==/UserScript==

///////////////////////////////////////////////////////////////////////////////////////////////
//Written by σмg ι ℓσνє уσυ! (Joe Bigglesworth), published by Jimboy3100 on general form
//Put your webhook for generalChannel and serverChannel (2nd webhook) for the script to work

var generalChannel = "https://discord.com/api/webhooks/1146954240091234416/xmsHYTnT7SZRcHQF3KhuwPTZXfzDs2w3u7hsZUbIqVs0Nyh3r12YflR9XtUDvau-c4vC";
var serverChannel = "https://discordapp.com/api/webhooks/.../...";
///////////////////////////////////////////////////////////////////////////////////////////////		

window.messageone;
var discordcodetosend;

function displayDiscordNotification() {
	var discText = '<b>[SERVER]</b>: Server Sent to Discord.';

	if (window.messageone == "0" || window.messageone == "1") { //IF using Legend Mod
		toastr["info"](discText).css("width", "300px");
	} else {
		$('body').append('<div id="serverDiscord" class="agario-panel" style="position:fixed;width:18%;height:10%;right:0;background-color: rgba(0,0,255,0.5);z-index:100;"><div style="float: center;color: white;"><h3>' + discText + '</h2></div></div>');
		setTimeout(function() {
			$('#serverDiscord').remove();
		}, 1000);
	}
}

var previousUrl = "";

function popAgarURL(fun) {
	var a = WebSocket.prototype.send;
	window.__WS_send = WebSocket.prototype.send
	WebSocket.prototype.send = function(b) {
		//debugger;
		console.log(this.url)
		var vanilla;
		var ogartest = $('#menu-footer').text();
		try {
			var d = /[^:\/]+\.agar\.io/.exec(this.url);
			//var c = /((?:[0-9]{1,3}(?:\.|\-)){1,3}[0-9]{1,3})(?:.*?)?(\:[0-9]{1,5})/,
			//d = c.exec(this.url);
			//ogario support
			var serverlinks;
			if (window.messageone == "0" || window.messageone == "1") { //IF using Legend Mod
				serverlinks = window.location.href + "&?pass=" + $("#clantag").val();
			} else if ($("#connect").hasClass("agartoolbtn")) { //IF using Agar Tools
				serverlinks = "https://agar.io/?sip=" + "live-arena-" + $("#server").val() + ".agar.io";
			} else if (vanilla != null) { //IF using Vanilla
				var maketheserver = $("#btn-dc-input").val();
				maketheserver = maketheserver.split('live', 2).pop();
				maketheserver = 'live' + maketheserver;
				maketheserver.replace(':80', '');
				serverlinks = "https://agar.io/?sip=" + maketheserver;
			} else if (~ogartest.indexOf("ogario")) {
				serverlinks = "https://agar.io/?sip=" + "live-arena-" + $("#server-token").val() + ".agar.io" + "&?pass=" + $("#clantag").val();
			} else {
				serverlinks = "https://agar.io/?sip=" + d[0];
			}
			//console.log(serverlinks);
			//ally support
			//    var serverlinks="https://agar.io/?sip="+d[1].replace(/-/g,'.')+d[2]+" = regular";
			//    if( $('#btn-dc-input').length )         // use this if you are using id to check
			//   {
			//        serverlinks += "\r\n"+$('#btn-dc-input')[0].value+" = Ally"+"\r\n";
			//    }
			fun(serverlinks);
		} catch (e) {
			console.log('exception: ' + e.message);
		}
		try {
			a.apply(this, [b]);
			WebSocket.prototype.send = a;
		} catch (e) {
			window.__WS_send.apply(this, [b]);
			WebSocket.prototype.send = window.__WS_send;
		}
	};
}

function postToDiscord(discordUrl, isGeneralChannel) {
	popAgarURL(function(serverlinks) {
		//hack to prevent strange post duplication bug
		//if (previousUrl!=discordUrl) {
		// Sending and receiving data in JSON format using POST mothod
		//
		var xhr = new XMLHttpRequest();
		var url = discordUrl;
		console.log('discord url: ' + url);
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				/*window.idkwhatthisis=xhr.responseText;
				var json = JSON.parse(xhr.responseText);
				console.log(json.email + ", " + json.password);*/
			}
		};
		var nick = $.find('#nick');
		//  console.log('nick: '+nick[0].value);
		var discordMsg = "\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\r\n" + "Poster: " + nick[0].value + "\r\n\r\n" + serverlinks;
		if (isGeneralChannel) {
			//discordMsg+="\r\n@everyone";
			//discordMsg+="\r\nAlso posted in #serverlinks";
			discordMsg += "\r\n";
		}
		var discordskintosend;
		if ($("#skin").length) {
			discordskintosend = $("#skin").val()
		}
		var discordtagtosend;
		if ($("#clantag").length) {
			discordtagtosend = $("#clantag").val()
		}
		var discordregiontosend;
		var discordmodetosend;
		if ($("#region").length && $("#gamemode").length) {
			discordregiontosend = $("#region").val()
			discordmodetosend = $("#gamemode").val()
		}

		var discregmod = discordregiontosend + discordmodetosend;
		var discordtop;
		if (window.messageone == "0" || window.messageone == "1") {
			discordtop = $("#leaderboard-positions").text()
		}
		var discordteam;
		if (window.teammatelegendmodnicks) {
			discordteam = window.teammatelegendmodnicks.toString();
		}
		var discordimageuser;
		if ($(".agario-profile-picture").length) {
			discordimageuser = $(".agario-profile-picture").attr('src');
		}
		if (discordtagtosend && discordtagtosend != "") {
			discordcodetosend = {
				//"username": "Agario to Discord Webhook",
				//"avatar_url": "https://jimboy3100.github.io/banners/CropedImage128.gif",
				//  "content": discordMsg,
				"embeds": [{
					"author": {
						"name": nick[0].value,
						"url": serverlinks,
						"icon_url": discordimageuser
					},
					"title": serverlinks,
					"url": serverlinks,
					//      "description": "[Click here]("+serverlinks+")",
					"color": 15258703,
					"fields": [{
							"name": "Tag / Password",
							"value": discordtagtosend,
							"inline": true
						},
						{
							"name": "Region / Mode",
							"value": discregmod,
							"inline": true
						},
						{
							"name": "Leaderboard",
							"value": discordtop
						}
					],
					"thumbnail": {
						"url": discordskintosend
					},
					"image": {
						"url": "https://upload.wikimedia.org/wikipedia/commons/5/5a/A_picture_from_China_every_day_108.jpg"
					},
					"footer": {
						"text": "* Discord webhook by Legend mod for agario",
					}
				}]
			}
		} else {
			discordcodetosend = {
				//"username": "Agario to Discord Webhook",
				//"avatar_url": "https://jimboy3100.github.io/banners/CropedImage128.gif",
				//  "content": discordMsg,
				"embeds": [{
					"author": {
						"name": nick[0].value,
						"url": serverlinks,
						"icon_url": discordimageuser
					},
					"title": "Join my agario server",
					"url": serverlinks,
					//      "description": "[Click here]("+serverlinks+")",
					"color": 15258703,
					"fields": [{
							"name": "Region / Mode",
							"value": discregmod,
						},
						{
							"name": "Leaderboard",
							"value": discordtop
						}
					],
					"thumbnail": {
						"url": discordskintosend
					},
					"image": {
						"url": "https://upload.wikimedia.org/wikipedia/commons/5/5a/A_picture_from_China_every_day_108.jpg"
					},
					"footer": {
						"text": "* Discord webhook by Legend mod for agario",
					}
				}]
			}
		}

		var data = JSON.stringify(discordcodetosend);
		//var data = JSON.stringify({"content":serverlinks});
		xhr.send(data);
		console.log('Formatted Serverlinks:');
		console.log(serverlinks);
		//}
		previousUrl = discordUrl;
	});
}


(function() {
	'use strict';
	setTimeout(function() {
		if (window.messageone == "0" || window.messageone == "1") {
			generalChannel = localStorage.getItem("discwebhook1");
			serverChannel = localStorage.getItem("discwebhook2");
		}
		var r = $('<button/>', {
			text: 'Post Server IP to Discord',
			class: 'btn btn-primary btn',
			style: 'width: 100%;margin-top: 0px'
		});
		if (window.discordsip == null) {
			window.discordsip = true;
			var a;
			if (window.messageone == "0" || window.messageone == "1") {
				a = $.find('#agario-main-buttons');
				//a[0].append($('<br/>')[0]);
				a[0].append(r[0]);
				//a[0].append($('<br/>')[0]);			
			} else {
				a = $('#title');
				a.before(r[0]);
				a.remove();
			}
			r[0].onclick = function() {

				postToDiscord(serverChannel, false);
				postToDiscord(generalChannel, true);
				displayDiscordNotification();
			};
		}
		// menu function
		var GM_registerMenuCommand;
		if (GM_registerMenuCommand) {
			GM_registerMenuCommand('Post Agar Server IP to Discord', function() {
				postToDiscord(serverChannel, false);
				postToDiscord(generalChannel, true);
				displayDiscordNotification();
			}, 'r');
		}
	}, 4000);

})();
