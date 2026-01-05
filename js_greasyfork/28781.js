// ==UserScript==
// @name        The West - westernblumi Alpha Test
// @namespace 	Test
// @author 		westernblumi
// @include https://*.the-west.*/game.php*
// @version	0.06
// @grant none
// @description The West - westernblumi Alpha Tests
// @downloadURL https://update.greasyfork.org/scripts/28781/The%20West%20-%20westernblumi%20Alpha%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/28781/The%20West%20-%20westernblumi%20Alpha%20Test.meta.js
// ==/UserScript==
(function (fn) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn.toString() + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
}) (function () {
	westernblumiAlphaTest = {};
	
    westernblumiAlphaTest.Skript = {
		
		replaceAffronts: function (msg) {
			msg = msg.replace('dämlich', ' add me ');
			msg = msg.replace('hässlich', ' add me ');
			msg = msg.replace('pimmelverlängerer', ' add me ');
			msg = msg.replace('2cm Errektion', ' add me ');
			msg = msg.replace('arbeitslos', ' add me ');
			msg = msg.replace('ungebildet', ' add me ');
			msg = msg.replace('pussy', ' add me ');
			return msg;
		},
		
        init: function () {
			console.log('SUCCESSFULL LAUNCH OF westernblumiAlphaTest');
			
			/*Chat.sendMessage_backup = Chat.sendMessage;
			Chat.sendMessage = function (message, room) {
				console.log('before: ' + message);
				message = replaceAffronts(message);
				console.log('after: ' + message);
				Chat.sendMessage_backup.call(this, message, room);
			};*/
			
			MultiplayerWindow.sendLobbyMessage_backup = MultiplayerWindow.sendLobbyMessage;
			MultiplayerWindow.sendLobbyMessage = function (msg) {
				//console.log('before sendLobbyMessage: ' + msg);
				msg =  westernblumiAlphaTest.Skript.replaceAffronts(msg);
				//console.log('after sendLobbyMessage: ' + msg);
				MultiplayerWindow.sendLobbyMessage_backup.call(this, msg);
			};
			
			west.mission.GameChat.prototype.onSendMessage_backup = west.mission.GameChat.prototype.onSendMessage;
			west.mission.GameChat.prototype.onSendMessage = function (msg) {
				//console.log('before GameChat onSendMessage: ' + msg);
				msg = westernblumiAlphaTest.Skript.replaceAffronts(msg);
				//console.log('after GameChat onSendMessage: ' + msg);
				west.mission.GameChat.prototype.onSendMessage_backup.call(this, msg);
			};
			
			west.mission.AfterChat.prototype.onSendMessage_backup = west.mission.AfterChat.prototype.onSendMessage;
			west.mission.AfterChat.prototype.onSendMessage = function (msg) {
				//console.log('before AfterChat onSendMessage: ' + msg);
				msg = westernblumiAlphaTest.Skript.replaceAffronts(msg);
				//console.log('after AfterChat onSendMessage: ' + msg);
				west.mission.AfterChat.prototype.onSendMessage_backup.call(this, msg);
			};
        },
		
    };
	
    westernblumiAlphaTest.Skript.init();
});