// ==UserScript==
// @name        The West - gespielte Abenteuer
// @namespace 	Abenteuer
// @author 		westernblumi
// @include https://*.the-west.*/game.php*
// @version	1.03
// @grant none
// @description Zeigt die Anzahl der gespielten Abenteuer an
// @downloadURL https://update.greasyfork.org/scripts/23649/The%20West%20-%20gespielte%20Abenteuer.user.js
// @updateURL https://update.greasyfork.org/scripts/23649/The%20West%20-%20gespielte%20Abenteuer.meta.js
// ==/UserScript==
(function (fn) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn.toString() + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
}) (function () {
    gespielteAbenteuer = {
		cache_name: 'gespielteAbenteuerCache1',
		blockedUsers: [],
        Images: {
          settings: 'data:image/png;base64,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',
		  },
      };
	  
      gespielteAbenteuer.Skript = {
        init: function () {
			
			Chat.Formatter.backup_formatMessage = Chat.Formatter.formatMessage;
			Chat.Formatter.formatMessage = function (msg, from, time, highlight, classNames) {
				classNames = classNames || '';
				
				var newDiv = $('<div></div>');
				newDiv.html(from);
				var short_name = $('.client_name', newDiv).text();
				if(gespielteAbenteuer.blockedUsers.includes(short_name)){
					return;
				} else {
					return["<table cellpadding='0' cellspacing='0' class='" + classNames + "'>", "<tr>", "<td style='white-space: nowrap;' class='chat_info'>", "<span class='chat_time'>[" + Chat.Formatter.formatTime(time) + "]</span>", "<span class='chat_from'>" + from + "</span>", "&nbsp;", "</td>", "<td class='chat_text " + (highlight ? "chat_highlight" : "") + "'>", msg, "</td>", "</tr>", "</table>"].join("");
				}
				
			}
			
			
			ChatWindow.Client.backup_onClick = ChatWindow.Client.onClick;
			ChatWindow.Client.onClick = function (args, id) {
					
				var client = Chat.Resource.Manager.getClient(id), isOnline;
				if (!client || client.myself)return;
				isOnline = Chat.Resource.Client.STATUS_OFFLINE != client.statusId;
				if (client.mpi) {
					var onAction = function (id) {
						switch (id) {
							case 0:
								Suggestion.showPopup('mpi', client.pname, client.id);
								break;
							case 1:
								if (gespielteAbenteuer.blockedUsers.includes(client.pname)) {
									
									gespielteAbenteuer.blockedUsers = jQuery.grep(gespielteAbenteuer.blockedUsers, function(value) {
										return value != client.pname;
									});
								}
								else {
									gespielteAbenteuer.blockedUsers.push(client.pname);
									localStorage[gespielteAbenteuer.cache_name] = JSON.stringify(gespielteAbenteuer.blockedUsers);
								}
								break;
						}
					};
					var selectbox = new west.gui.Selectbox().setHeader(client.pname).addItem(0, "Verstoß melden").addItem(1, gespielteAbenteuer.blockedUsers.includes(client.pname) ? "Nicht mehr ignorieren" : "Ignorieren").addListener(onAction).show(args[0]);
				}
				else {
					var onAction = function (id) {
						switch (id) {
							case 0:
								PlayerProfileWindow.open(client.playerId);
								break;
							case 1:
								if (Chat.IgnoreButler.contains(client.pname)) {
									new UserMessage("Du ignorierst diesen Spieler!").show();
								}
								else {
									if (!isOnline) {
										MessagesWindow.open('telegram', {
											insert_to : client.pname
										}
										);
									}
									else {
										var room = Chat.Resource.Manager.acquireRoom(client);
										if (room)room.openClick();
									}
								}
								break;
							case 2:
								if (Chat.IgnoreButler.contains(client.pname)) {
									Chat.IgnoreButler.unignore(client.pname);
								}
								else {
									Chat.IgnoreButler.ignore(client.pname);
								}
								break;
							case 3:
								Suggestion.showPopup('chat', '' + client.playerId + '');
								break;
							case 4:
								if (Chat.Friendslist.isFriend(client.id)) {
									FriendslistWindow.deleteFromFriendList(client.playerId);
								}
								else {
									FriendslistWindow.inviteIngameFriend(client.pname);
								}
								break;
						}
					};
					if (Chat.Friendslist.isFriend(client.id)) {
						var friendTxt = 'Freund entfernen';
					}
					else {
						var friendTxt = 'Als Freund einladen';
					}
					var selectbox = new west.gui.Selectbox().setHeader(client.pname).addItem(0, "Profil ansehen").addItem(1, isOnline ? "Anflüstern" : "Telegram schreiben").addItem(2, Chat.IgnoreButler.contains(client.pname) ? "Nicht mehr ignorieren" : "Ignorieren").addItem(3, "Verstoß melden").addItem(4, friendTxt).addListener(onAction).show(args[0]);
				}
		
			};
			
			gespielteAbenteuer.Skript.loadLocalStorage();
			
          var menuContainer = $('<div id="gespielteAbenteuer-menu" class="menulink" onclick="gespielteAbenteuer.GUI.opengespielteAbenteuerWindow();" title="' + 'gespielte Abenteuer' + '" />').css('background-image', 'url(' + gespielteAbenteuer.Images.settings + ')').css('background-position', '0px 0px').mouseenter(function () {
            $(this).css('background-position', '-25px 0px');
          }).mouseleave(function () {
            $(this).css('background-position', '0px 0px');
          });
          $('#ui_menubar').append($('<div class="ui_menucontainer" />').append(menuContainer).append('<div class="menucontainer_bottom" />'));
        },
		
		loadLocalStorage: function () {
			if ((typeof localStorage[gespielteAbenteuer.cache_name] === 'undefined') || (localStorage[gespielteAbenteuer.cache_name].length < 1))
			{
				//Kein User geblockt
			} 
			else
			{
				gespielteAbenteuer.blockedUsers = JSON.parse(localStorage[gespielteAbenteuer.cache_name]);
			}
		},
		
      };
      gespielteAbenteuer.GUI = {
		  
		opengespielteAbenteuerWindow: function () {
			Ajax.remoteCall('achievement','track',{achvid: 60004}, function(json)
			{
				if(!json.error){
					MessageSuccess("gespielte Abenteuer: " + json.current).show();
				}
			});
			
			Ajax.remoteCall('achievement','untrack',{}, function(json){});
		},
        
      };
	
    gespielteAbenteuer.Skript.init();
});