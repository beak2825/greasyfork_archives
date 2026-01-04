// ==UserScript==
// @name         Enviar IP server agar a Clan Vikings
// @namespace    http://tampermonkey.net/
// @version      0.91
// @description  gets the agar.io server IP link and posts it to discord
// @author       σмg ι ℓσνє уσυ!
// @Edited       V King Ragnar
// @match        http://agar.io/*
// @match        https://agar.io/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/32132/Enviar%20IP%20server%20agar%20a%20Clan%20Vikings.user.js
// @updateURL https://update.greasyfork.org/scripts/32132/Enviar%20IP%20server%20agar%20a%20Clan%20Vikings.meta.js
// ==/UserScript==




(function() {
	'use strict';
//	alert('Send Agar Server To Discord script successfully launched.');
	console.log('Send Agar Server To Discord script successfully launched.');
	function popAgarURL( fun )
	{
		var originalWSSend = WebSocket.prototype.send;
		window.__WS_send = WebSocket.prototype.send;
		var restoreWebSocketSend = false;
		WebSocket.prototype.send = function(b)
		{
			try
			{ restoreWebSocketSend = fun( this ); originalWSSend.apply(this, [b]); } catch (e){console.log('exception: ', e, 'exception message: ', e.message ); }
			// If the function parameter returns true then we stop hijacking the websocket send and restore the original.
			if( restoreWebSocketSend )
			{
				try{ WebSocket.prototype.send = originalWSSend;	}
				catch (e) {	window.__WS_send.apply(this, [b]); WebSocket.prototype.send = window.__WS_send;	}
			}
		};
	};

	var serverlinks = null;
	var retryCount = 0;
	var retryMax = 5;
	popAgarURL( function(ws) {
			var c = /((?:[0-9]{1,3}(?:\.|\-)){1,3}[0-9]{1,3})(?:.*?)?(\:[0-9]{1,5})/,
			d = c.exec(ws.url);
			var aa = document.createElement('aa');
			aa.href = "http://"+d[1].replace(/-/g,'.')+d[2];
			var port = aa.href.split('/')[2].split(':')[1]; 
			console.log('Ogar server port: '+ port);
			if (port == '3000') {
				retryCount++;
			}
			else
			{
				serverlinks="http://agar.io/?sip="+d[1].replace(/-/g,'.')+d[2]+" = regular"+"\r\n"+"http://agar.io/a?sip="+d[1].replace(/-/g,'.')+d[2]+" = ogario"+"\r\n";
			}
			return serverlinks || retryCount >= retryMax;
	});

	setTimeout(function(){
		var buttons = $.find('#agario-main-buttons');
		
		var generalChannel="https://discordapp.com/api/webhooks/344395219078348810/fOQ1_e2QnOJeQtmCXNEZJMiP9-8oB7lLBUHifGvzcqJBknxlMckIlcYW3u7nieySpavv";
		var serverChannel= "https://discordapp.com/api/webhooks/344395659610292224/iC1cwM2NnvTSQJQwhG_X3F2OM5D5EtDkgiLZBHe5MWtyh4Ii4MibwiUDWKNWJEzh4lZC";
		
		function postToDiscordEvent()
		{
			if( !serverlinks )
			{
				displayAlertNotification();
			}
			else
			{
				postToDiscord( serverChannel, false, serverlinks );
				postToDiscord( generalChannel, true, serverlinks );
				displayDiscordNotification();
			}
		}

		//kitty chat support
		$('#message').keydown(function (e) {
			var keyCode = e.keyCode || e.which;
			if (keyCode == 13) {
				console.log('This is displayed when enter pressed on chat box:\r\n'+$('#message')[0].value);
				postChatToDiscord(generalChannel,$('#message')[0].value, serverlinks);
			}
		});

		//add IP button 
		var postIPToDiscordButton = $('<button/>',
		{
			text: 'Post Server IP to Discord',
			class: 'btn btn-play btn-primary btn-needs-server'
		});
		postIPToDiscordButton[0].onclick = postToDiscordEvent;

		buttons[0].append($('<br/>')[0]);
		buttons[0].append(postIPToDiscordButton[0]);
		buttons[0].append($('<br/>')[0]);
		// menu function
		GM_registerMenuCommand('Post Agar Server IP to Discord', postToDiscordEvent, 'r');
	},10000);
//	alert('Send Agar Server To Discord script finished.');

	function displayDiscordNotification() {
		var discText='Server Sent to Discord.';
		$('body').append('<div id="serverDiscord" class="agario-panel" style="position:fixed;width:18%;height:10%;right:0;background-color: rgba(0,0,255,0.9);z-index:100;"><div style="float: center;color: white;"><h3>'+discText+'</h2></div></div>');
		setTimeout(function () {
			$('#serverDiscord').remove();
		}, 3000);
	}

	function displayAlertNotification() {
		var alertText='Problem occurred while sending Server to Discord! \r\n Please try again or refresh';
		$('body').append('<div id="serverDiscord" class="agario-panel" style="position:fixed;width:18%;height:10%;right:0;background-color: rgba(255,0,0,0.9);z-index:100;"><div style="float: center;color: white;"><h3>'+alertText+'</h2></div></div>');
		setTimeout(function () {
			$('#serverDiscord').remove();
		}, 3000);
	}

	function displayNoIPNotification() {
		var alertText='Could not obtain server IP \r\n Please try again or refresh';
		$('body').append('<div id="serverDiscord" class="agario-panel" style="position:fixed;width:18%;height:10%;right:0;background-color: rgba(255,0,0,0.9);z-index:100;"><div style="float: center;color: white;"><h3>'+alertText+'</h2></div></div>');
		setTimeout(function () {
			$('#serverDiscord').remove();
		}, 3000);
	}	

	var previousUrl = "";

	function postChatToDiscord(discordUrl, chatMsg, serverlinks) {
		if (chatMsg.startsWith(';')) {
			//remove semicolon
			chatMsg = chatMsg.slice(1); 
			// Sending and receiving data in JSON format using POST mothod
			//
			var xhr = new XMLHttpRequest();
			console.log('discord url: ' + discordUrl);
			xhr.open("POST", discordUrl, true);
			xhr.setRequestHeader("Content-type", "application/json");
			var nick = $.find('#nick');
			var discordMsg="\\_\\_\\_\\_\\_\\_\\_\r\n"+nick[0].value+"\r\nGAMECHAT: "+chatMsg;
			var data = JSON.stringify({"content":discordMsg});
			xhr.send(data);
			console.log('chatMsg:', chatMsg);
			var xhr2 = new XMLHttpRequest();
			xhr2.open("POST", discordUrl, true);
			xhr2.setRequestHeader("Content-type", "application/json");
			discordMsg="Server:\r\n"+serverlinks;
			data = JSON.stringify({"content":discordMsg});
			xhr2.send(data);
		}

	}

	function postToDiscord(discordUrl, isGeneralChannel, serverlinks) {
		//hack to prevent strange post duplication bug
		if (previousUrl!=discordUrl) {
			// Sending and receiving data in JSON format using POST mothod
			var xhr = new XMLHttpRequest();
			var url = discordUrl;
			console.log('discord url: ' + url);
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4 && xhr.status == 200) {
					var json = JSON.parse(xhr.responseText);
					console.log(json.email + ", " + json.password);
				}
			};
			var nick = $.find('#nick');
			var discordMsg="\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\r\n"+"Poster: "+nick[0].value+"\r\n\r\n"+serverlinks;
			if (isGeneralChannel) {
				discordMsg+="\r\nAlso posted in #serverlinks";
			}

			var data = JSON.stringify({"content":discordMsg});
			xhr.send(data);
			console.log('Formatted Serverlinks:');
			console.log(serverlinks);
			previousUrl=discordUrl;
		}
	}
})();