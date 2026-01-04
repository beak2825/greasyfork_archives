// ==UserScript==
// @name               TW Friends
// @name:cs            TW Friends
// @name:de            TW Friends
// @name:el            TW Friends
// @name:es            TW Friends
// @name:fr            TW Friends
// @name:it            TW Friends
// @name:pl            TW Friends
// @name:pt-PT         TW Friends
// @name:sk            TW Friends
// @name:tr            TW Friends
// @version            0.67
// @license            LGPLv3
// @description        Friend Management for The West Events
// @description:cs     Správa Přátel pro The West Eventy
// @description:de     Freundschaftsmanagement für The West Events
// @description:el     Διαχείριση Φίλων για τις Εκδηλώσεις του The West
// @description:es     Gestión de Amigos para Eventos de The West
// @description:fr     Gestion des Amis pour les Evénements de The West
// @description:it     Gestione amici per gli eventi The West
// @description:pl     Menadżer zarządzania Przyjaciółmi podczas eventów The West
// @description:pt-PT  Gestão de amigos para eventos no The West
// @description:sk     Manažovanie Priateľov pre The West Eventy
// @description:tr     The West Etkinlikleri İçin Arkadaş Yöneticisi
// @author             hiroaki
// @translation        Jamza (cs_CZ, sk_SK)
// @translation        pepe100 (es_ES)
// @translation        hepike (hu_HU)
// @translation        Jackssson (it_IT)
// @translation        Bartosz86 (pl_PL)
// @translation        jccwest (pt_PT)
// @translation        Oğuzhan Ünal (tr_TR)
// @match              https://*.the-west.com.br/game.php*
// @match              https://*.the-west.com.pt/game.php*
// @match              https://*.the-west.cz/game.php*
// @match              https://*.the-west.de/game.php*
// @match              https://*.the-west.dk/game.php*
// @match              https://*.the-west.es/game.php*
// @match              https://*.the-west.fr/game.php*
// @match              https://*.the-west.gr/game.php*
// @match              https://*.the-west.hu/game.php*
// @match              https://*.the-west.it/game.php*
// @match              https://*.the-west.net/game.php*
// @match              https://*.the-west.nl/game.php*
// @match              https://*.the-west.org/game.php*
// @match              https://*.the-west.pl/game.php*
// @match              https://*.the-west.ro/game.php*
// @match              https://*.the-west.ru.com/game.php*
// @match              https://*.the-west.se/game.php*
// @match              https://*.the-west.sk/game.php*
// @grant              none
// @namespace          https://greasyfork.org/users/3197
// @icon               https://cdn.rawgit.com/TWFriends/scripts/master/friends.png
// @downloadURL https://update.greasyfork.org/scripts/440965/TW%20Friends.user.js
// @updateURL https://update.greasyfork.org/scripts/440965/TW%20Friends.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function(fn) {
	var newScript = document.createElement('script');
	newScript.setAttribute("type", "application/javascript");
	newScript.textContent = '(' + fn + ')();';
	(document.body || document.head || document.documentElement).appendChild(newScript);
	newScript.parentNode.removeChild(newScript);
})(function() {
	var VERSION = 0.67;
	var URL_INSTALL = "https://greasyfork.org/scripts/2992-tw-friends";
	var URL_CODE = "https://greasyfork.org/scripts/2992-tw-friends/code/TW%20Friends.user.js";
	var URL_VERSION = "https://raw.githack.com/TWFriends/scripts/master/version.json";
	var scriptAuthor = "hiroaki";
	var scriptCredits = '<span style="display: inline-block; vertical-align: middle;">Bartosz86 🇵🇱, Jackssson 🇮🇹, Jamza 🇨🇿 🇸🇰, jccwest 🇵🇹, hepike 🇭🇺, pepe100 🇪🇸, Oğuzhan Ünal 🇹🇷,<br />noolas, Pnevma, Revolver Ocelot, tzanetos22</span>';
	var scriptName = "TW Friends";
	var scriptObject = "HiroFriends";
	this[scriptObject] = {
		helpers: {
			/* Inno buildDateObject() function currently buggy */
			buildDateObject: function(timeStr, isServerTime) {
				var regEx, match, d = new Date(0), today = new Date();
				regEx = /^(?:(3[01]|[012]?[0-9]|\*)\.(?:(1[012]|0?[1-9]|\*)\.((?:19|20)?\d\d|\*)))?(?: ?(2[0-3]|[01]?\d|\*)\:([0-5]?\d|\*)(?:\:([0-5]?\d|\*))?)?$/;
				if((match = timeStr.match(regEx))) {
					d.setFullYear(match[3] !== undefined ? (match[3] == '*' ? today.getFullYear() : parseInt(match[3], 10)) : today.getFullYear());
					d.setMonth(match[2] !== undefined ? (match[2] == '*' ? today.getMonth() : parseInt(match[2], 10) - 1) : today.getMonth());
					d.setDate(match[1] !== undefined ? (match[1] == '*' ? today.getDate() : parseInt(match[1], 10)) : today.getDate());
					d.setHours(match[4] !== undefined ? (match[4] == '*' ? today.getHours() : match[4]) : 0);
					d.setMinutes(match[5] !== undefined ? (match[5] == '*' ? today.getMinutes() : match[5]) : 0);
					d.setSeconds(match[6] !== undefined ? (match[6] == '*' ? today.getSeconds() : match[6]) : 0);
					d.setMilliseconds(0);
				}
				if(isServerTime) d = new Date(d - Game.serverTimeDifference);
				return d;
			},
			buildTimeStamp: function(timeStr, isServerTime) {
				return this.buildDateObject(timeStr, isServerTime).getTime();
			},
			countDown: function(element, until, formatter, onFinish) {
				var tick = function() {
					var now = Date.now()/1e3, remaining = until - now;
					if(remaining <= 0) return onFinish(element);
					$(element).text(remaining >= 1 ? formatter(remaining) : '.........................');
					setTimeout(tick, 1e3*(remaining <= 3600 ? remaining % 1 : remaining % 60));
				};
				if("function" !== typeof onFinish) onFinish = function(el) { $(el).text(); };
				if("function" !== typeof formatter) formatter = function(str) { return str.formatDurationBuffWay(); };
				tick();
			},
			debug: function(title = 'Debugger', data = '', icon = west.gui.Dialog.SYS_WARNING) {
				var now = new Date(), date_str = now.toTimeString();
				console.log('['+date_str+'|'+title+'] '+data);
				// new west.gui.Dialog(title, msg, icon).addButton("ok").show();
			},
			escapeHtml: function(raw) {
				return raw.replace(/[&<>"']/g, function onReplace(match) { return '&#' + match.charCodeAt(0) + ';'; });
			},
		},
		eventManager: {
			eventEnd: 0,
			eventName: '',
			eventInfo: {},
			init: function(eventName) {
				if(undefined === Game.sesData[eventName] || undefined === Game.sesData[eventName].friendsbar) return false;
				this.eventName = eventName;
				this.eventInfo = Game.sesData[eventName].friendsbar;
				if(undefined === Game.sesData[this.eventName].meta.end) return false;
				this.eventEnd = HiroFriends.helpers.buildTimeStamp(Game.sesData[this.eventName].meta.end) - Game.serverTimeDifference;
				var secondsLeft = this.timeLeft(), that = this;
				if(secondsLeft < 0) return false;
				if(HiroFriends.guiManager.init()) {
					HiroFriends.tombolaManager.init();
					HiroFriends.inventoryManager.init();
					HiroFriends.guiManager.buttonLoading();
					$.when( HiroFriends.friendManager.init() , HiroFriends.logManager.init() ).done(function() {
						HiroFriends.guiManager.buttonShow();
						secondsLeft = Math.max(0, that.timeLeft());
						// Timeout values too big to fit into a signed 32-bit integer may cause overflow 
						if(secondsLeft < 86400) setTimeout(function() { that.destroy(); }, 1e3*secondsLeft);
					});
				}
			},
			destroy: function() {
				if(this.timeLeft() < 0) {
					HiroFriends.tombolaManager.destroy();
					HiroFriends.logManager.destroy();
					HiroFriends.inventoryManager.destroy();
					HiroFriends.friendManager.destroy();
					HiroFriends.guiManager.destroy();
				}
			},
			timeLeft: function() {
				return(this.eventEnd/1e3 - Game.getServerTime());
			},
		},
		friendManager: {
			loaded: false,
			friends : {},
			canSend: 0,
			totalFriends : 0,
			pendingInvitations: 0,
			refetch: 0,
			timeout: null,
			init: function() {
				var that = this;
				return this.fetch().done(function() {
					that.loaded = true;
					HiroFriends.guiManager.spanCounter.show();
					EventHandler.listen('friend_added', that.processFriendAdded, that);
					EventHandler.listen('friend_removed', that.processFriendRemoved, that);
				});
			},
			destroy: function() {
				if(!this.loaded) return false;
				this.refetch = 0;
				if(this.timeout) clearTimeout(this.timeout);
				EventHandler.unlisten('friend_added', this.processFriendAdded, this);
				EventHandler.unlisten('friend_removed', this.processFriendRemoved, this);
				HiroFriends.guiManager.divFriendsAvail.hide(2000);
			},
			processFriendAdded: function(data) {
				if(data.playerId && !this.friends.hasOwnProperty(data.playerId)) this.reload();
			},
			processFriendRemoved: function(playerId) {
				if(playerId && this.friends.hasOwnProperty(playerId)) this.reload();
			},
			fetch: function() {
				if(this.timeout) clearTimeout(this.timeout);
				if(HiroFriends.eventManager.timeLeft() < 0) {
					$("#hiro_friends_container").slideUp(5000);
					throw "Event is over";
				}
				var now = Date.now()/1e3, server_time = Game.getServerTime(), that = this;
				return $.post("/game.php?window=friendsbar&mode=search", { search_type: "friends" }, function(data) {
					var can_send = 0, eventTimes = {}, friends = {}, should_fetch_again = HiroFriends.eventManager.eventInfo.cooldown, total = 0;
					$.each(data.eventActivations, function(key, val) {
						if(val.event_name === HiroFriends.eventManager.eventName) eventTimes[val.friend_id] = val.activation_time;
					});
					$.each(data.players, function(key, val) {
						var myLast, nextSent = 0;
						if(val.name !== Character.name) {
							myLast = (eventTimes[val.player_id] !== undefined) ? eventTimes[val.player_id]: 0;
							friends[val.player_id] = { name: val.name, activation_time: myLast };
							++ total;
							nextSend = myLast + HiroFriends.eventManager.eventInfo.cooldown - server_time;
							if(nextSend <= 0) ++ can_send;
							else should_fetch_again = Math.min(nextSend, should_fetch_again);
						}
					});
					that.friends = friends;
					that.canSend = can_send;
					that.totalFriends = total;
					HiroFriends.guiManager.updateCounters(can_send, total);
					if(that.totalFriends && should_fetch_again) {
						that.refetch = (now+should_fetch_again)*1e3;
						that.timeout = setTimeout(function() { that.fetch(); }, should_fetch_again*1e3);
					}
					else that.refetch = 0;
				});
			},
			getPendingInvitations: function() {
				return $.post("/game.php?window=character&mode=get_open_requests", function(data) {
					var openReq = 0;
					$.each(data.open_friends, function(key, val) { if(val.inviter_id != Character.playerId) ++ openReq; });
					HiroFriends.friendManager.pendingInvitations = openReq;
				});
			},
			pendingInvitationsMsg: function() {
				return this.pendingInvitations == 1 ? HiroFriends.localeManager.getMsg('pendingInvitation') : this.pendingInvitations+' '+HiroFriends.localeManager.getMsg('pendingInvitations');
			},
			reload: function() {
				if(!this.loaded) return false;
				var that = this;
				HiroFriends.guiManager.updateCounters(0, 0);
				return this.fetch().done(function() {
					HiroFriends.guiManager.updateCounters(that.canSend, that.totalFriends);
				});
			},
			remove: function(friendId) {
				new west.gui.Dialog(HiroFriends.localeManager.getMsg('removeFriend'), HiroFriends.localeManager.getMsg('removeConfirm')).setIcon(west.gui.Dialog.SYS_QUESTION).addButton("yes", function() {
					Ajax.remoteCall('character', 'cancel_friendship', { friend_id: friendId }, function(json) {
						if(json.result) {
							new UserMessage(HiroFriends.localeManager.getMsg('removeSuccess'), UserMessage.TYPE_SUCCESS).show();
							$("div.hiroFriendRow_" + friendId).remove();
							$("div.friendData_" + friendId, FriendslistWindow.DOM).remove();
							delete(HiroFriends.friendManager.friends[friendId]);
							if(HiroFriends.friendManager.canSend) -- HiroFriends.friendManager.canSend;
							if(HiroFriends.friendManager.totalFriends) -- HiroFriends.friendManager.totalFriends;
							HiroFriends.guiManager.updateCounters(HiroFriends.friendManager.canSend, HiroFriends.friendManager.totalFriends);
							Chat.Friendslist.removeFriend(friendId);
						}
						else new UserMessage(HiroFriends.localeManager.getMsg('removeFailed'), UserMessage.TYPE_ERROR).show();
					});
				}).addButton("no").show();
			},
		},
		guiManager: {
			cdnBase: '',
			currencyImage : '',
			divContainer: null,
			divMain: null,
			divSend: null,
			divFriendsAvail: null,
			divInventoryAvail: null,
			divTombola: null,
			eventImage: '',
			imgFriendsAvail: null,
			imgInventoryAvail: null,
			lastNotified: 0,
			loaded: false,
			spanCounter: null,
			spanFriendsAvail: null,
			spanFriendsTotal: null,
			spanInvitations: null,
			spanRefresh: null,
			init: function() {
				this.cdnBase = Game.cdnURL || "https://westzz.innogamescdn.com";
				this.currencyImage = this.cdnBase+"/images/icons/"+HiroFriends.eventManager.eventName+".png";
				this.eventImage = this.cdnBase+(('Octoberfest' == HiroFriends.eventManager.eventName) ? "/images/window/events/octoberfest/pretzels_icon.png" : "/images/interface/friendsbar/events/"+HiroFriends.eventManager.eventName+".png");
				if(this.addCss().addTopBar().addBottomBarFriendsIcon().addBottomBarInventoryIcon()) {
					this.showInvitations();
					this.loaded = true;
					return true;
				}
				return false;
			},
			destroy: function() {
				this.loaded = false;
				$("#hiro_friends_container").slideUp(5000);
			},
			buttonLoading: function() {
				this.divSend.removeClass().addClass("twhf_loading").show();
				return this;
			},
			buttonShow: function() {
				this.divSend.removeClass().addClass("twhf_ready").click(function() { HiroFriends.windowManager.open(); return false; }).show();
				return this;
			},
			addCss: function() {
				var my_css = "\n";
				my_css += "\t.twhf_loading { width: 35px; height: 27px; cursor: wait; }\n";
				my_css += "\t.twhf_ready   { width: 32px; height: 32px; background: url('"+this.eventImage+"') no-repeat; background-size: contain; }\n";
				my_css += "\t.hf_idx       { width: 24px; text-align: right; padding-right: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n";
				my_css += "\t.hf_player    { width: 120px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n";
				my_css += "\t.hf_action    { width: 100px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis }\n";
				my_css += "\t.hf_recv      { width: 60px; text-align: right; padding-right: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n";
				my_css += "\t.hf_sent      { width: 60px; text-align: right; padding-right: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n";
				my_css += "\t.hf_last      { width: 140px; text-align: right; padding-right: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n";
				my_css += "\t.hf_freq      { width: 80px; text-align: right; padding-right: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n";
				my_css += "\t.hf_delete    { width: 24px; text-align: center; }\n";
				my_css += "\t.hf_row       { height: 16px; line-height: 16px; }\n";
				my_css += "\t.hf_stat      { display: inline-block; width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n";
				my_css += "\t.hf_count     { display: inline-block; width: 60px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: bold; text-align: right; }\n";
				my_css += "\t.hf_drill     { white-space: nowrap; }\n";
				my_css += "\tdiv.hiro_friends_maindiv div.tbody .hf_idx, div.hiro_friends_maindiv div.tbody .hf_delete { background: url('"+this.cdnBase+"/images/tw2gui/table/cell_shadow_y.png'); }\n";
				$('<style id="twhf_css" type="text/css" title="'+scriptName+'">' + my_css + '</style>').appendTo("head");
				return this;
			},
			addBottomBarFriendsIcon: function() {
				this.divFriendsAvail = $("<div />", { style: "position: absolute; top: 0px; right: 0px; z-index: 18; width: 20px; height: 18px;" }).hide();
				this.imgFriendsAvail = $('<img src="'+this.currencyImage+'" alt="" title="'+scriptName+'">').click(function(){ HiroFriends.windowManager.open(); return false; });
				this.imgFriendsAvail.appendTo(this.divFriendsAvail);
				this.divFriendsAvail.appendTo("#ui_bottombar .ui_bottombar_wrapper .button:nth-child(3) .dock-image");
				return this;
			},
			addBottomBarInventoryIcon: function() {
				this.divInventoryAvail = $("<div />", { style: "position: absolute; top: 0px; right: 0px; z-index: 18; width: 20px; height: 18px;" }).hide().appendTo("#ui_bottombar .ui_bottombar_wrapper .button:first .dock-image");
				this.imgInventoryAvail = $('<img src="'+HiroFriends.guiManager.currencyImage+'" />').click(function(){ HiroFriends.inventoryManager.displayGenerators(); return false; }).appendTo(this.divInventoryAvail);
				return this;
			},
			addTopBar: function() {
				var that = this;
				this.divContainer = $("<div />", { id: "hiro_friends_container", style: "position: absolute; top: 32px; right: 50%; margin-right: 120px; z-index: 16; width: 180px; height: 36px; text-align: left; text-shadow: 1px 1px 1px #000; background: url('"+this.cdnBase+"/images/interface/custom_unit_counter_sprite.png?2') no-repeat scroll 50% 0px transparent;" }).hide();
				var divRefresh = $("<div />", { style: "width: 24px; height: 24px; position: absolute; left: 8px; top: 3px; z-index: 3; padding: 4px 0px 0px 4px;" });
				this.divMain = $("<div />", { style: "background: url('"+this.cdnBase+"/images/interface/custom_unit_counter_sprite.png?2') no-repeat scroll 0 -36px rgba(0, 0, 0, 0); height: 25px; left: 32px; line-height: 25px; padding: 0 5px; position: absolute; top: 3px; width: 105px; z-index: 1; text-shadow: 1px 1px 1px #000;" });
				this.divTombola = $("<div />", { style: "position: absolute; left: 2px; top: 4px; width: 52px; height: 16px;" });
				this.divSend = $("<div />", { title: HiroFriends.eventManager.eventInfo.label, style: "position: absolute; right: 0px; top: 2px; z-index: 3;" });
				this.spanRefresh = $('<span />', { title: HiroFriends.localeManager.getMsg('refresh'), style: "display: inline-block; width: 20px; height: 20px; background: url('"+this.cdnBase+"/images/tw2gui/window/window2_buttons.png?5') repeat scroll 0px -20px transparent;" })
					.on("mouseenter", function() { that.refreshPopup(); $(this).css("background-position", ""); })
					.on("mouseleave", function() { that.refreshPopup(); $(this).css("background-position", "0px -20px"); })
					.click(function() {
						if(HiroFriends.logManager.loaded) HiroFriends.logManager.reload();
						if(HiroFriends.friendManager.loaded) HiroFriends.friendManager.reload();
						if(HiroFriends.inventoryManager.loaded) HiroFriends.inventoryManager.check();
						if(HiroFriends.tombolaManager.loaded) HiroFriends.tombolaManager.reload();
						return false;
					}).appendTo(divRefresh);
				this.refreshPopup();
				this.spanFriendsAvail = $("<span />", { text: 0, title: HiroFriends.localeManager.getMsg('availFriends'), style: "color: #f8c57c; font-size: 13pt;" });
				this.spanFriendsTotal = $("<span />", { text: 0, title: HiroFriends.localeManager.getMsg('totalFriends') });
				this.spanCounter = $("<span />", { style: "position: absolute; right: 5px; bottom: 0px; height: 25px; line-height: 25px; color: lightgray; font-size: 11px;" }).append(this.spanFriendsAvail, $("<span> / </span>"), this.spanFriendsTotal);
				this.spanCounter.hide();
				this.divContainer.append(
					divRefresh,
					this.divMain.append(this.divTombola, this.spanCounter),
					this.divSend
				).appendTo("#user-interface");
				this.divContainer.show();
				return this;
			},
			chatNotify: function(text, stamp) {
				if(stamp > this.lastNotified) {
					this.lastNotified = stamp;
					var format = Chat.Formatter.formatMessage(Chat.Formatter.formatText(text, true), ' <b>'+scriptName+':</b>', Date.now(), true, "from_system"), rooms = Chat.Resource.Manager.getRooms();
					for(var room in rooms) rooms[room].addMessage(format);
				}
			},
			refreshPopup: function() {
				var content = '', now = Date.now(), timers = [ ];
				if(HiroFriends.tombolaManager.refetch > now) timers.push({ title: HiroFriends.tombolaManager.wofStatus.title, stamp: HiroFriends.tombolaManager.refetch });
				if(HiroFriends.friendManager.refetch > now) timers.push({ title: HiroFriends.eventManager.eventInfo.label, stamp: HiroFriends.friendManager.refetch });
				if(HiroFriends.inventoryManager.refetch > now) timers.push({ title: HiroFriends.localeManager.getMsg('inventory'), stamp: HiroFriends.inventoryManager.refetch });
				timers.sort(function(a,b) { return a.stamp - b.stamp; });
				content = '<table>';
				$.each(timers, function(key, val) {
					var date_str = val.stamp < HiroFriends.eventManager.eventEnd ? new Date(val.stamp).toDateTimeStringNice() : HiroFriends.localeManager.getMsg('nextYear');
					var diff_str = val.stamp < HiroFriends.eventManager.eventEnd ? ((val.stamp - now)/1e3).formatDurationBuffWay() : '';
					content += '<tr><td>'+val.title+':</td><td style="text-align: right; color: #996600;">'+diff_str+'</td><td style="padding-left: 8px; color: #000066;">'+date_str+'</td></tr>';
				});
				content += '<table>';
				this.spanRefresh.addMousePopup({'teaser': '<b>'+HiroFriends.localeManager.getMsg('refresh')+'</b>', 'content': content });
			},
			showInvitations: function() {
				var that = this;
				HiroFriends.friendManager.getPendingInvitations().done(function() {
					if(HiroFriends.friendManager.pendingInvitations) {
						that.spanCounter.css("right", "20px");
						that.spanInvitations = $("<span />", { title: HiroFriends.friendManager.pendingInvitationsMsg(), style: "position: absolute; right: 0px; width: 19px; height: 25px; background-image: url('"+that.cdnBase+"/images/interface/more.jpg'); background-repeat: no-repeat;" })
							.on("mouseenter", function() { $(this).css("background-position", "0 -25px"); })
							.on("mouseleave", function() { $(this).css("background-position", ""); })
							.click(function() { $(this).hide(); that.spanCounter.css("right", "5px"); FriendslistWindow.open('openrequests'); return false; })
							.appendTo(that.divMain).show();
					}
				});
				return this;
			},
			updateBottomBarFriendsIcon: function(canSend, total) {
				if(this.loaded) {
					if(canSend) {
						this.imgFriendsAvail.addMousePopup({'teaser': '<b>'+scriptName+'</b>', 'content': canSend+'/'+total });
						this.divFriendsAvail.show(3000);
					}
					else this.divFriendsAvail.hide();
				}
				return this;
			},
			updateBottomBarInventoryIcon: function(coolDownComplete, wallet) {
				this.imgInventoryAvail.attr('src', coolDownComplete ? HiroFriends.guiManager.cdnBase+'/images/icons/clock.png' : this.currencyImage);
				this.imgInventoryAvail.attr('title', wallet ? wallet+' <img src="' + this.currencyImage + '" alt="">' : '');
				if(wallet) this.divInventoryAvail.show(3000);
				else this.divInventoryAvail.hide(1000);
				return this;
			},
			updateStatsInventory: function(wallet) {
				var el = $(".hf_inv_row .hf_count"), from = "" !== el.text() && deformat_number(el.text()) || 0;
				west.common.countTo(el, wallet, from, function(val) { el.text(format_number(Math.ceil(val, 6))); });
				return this;
			},
			updateFriendsAvail: function(n) {
				west.common.countTo(this.spanFriendsAvail, parseInt(n));
				return this;
			},
			updateFriendsTotal: function(n) {
				west.common.countTo(this.spanFriendsTotal, parseInt(n));
				return this;
			},
			updateCounters: function(canSend, totalFriends) {
				this.updateFriendsAvail(canSend);
				this.updateFriendsTotal(totalFriends);
				this.updateBottomBarFriendsIcon(canSend, totalFriends);
				return this;
			},
		},
		inventoryManager: {
			generatorsInventory: [],
			generatorsAvailable: [],
			listeningSignals: [ 'inventory_loaded', 'inventory_changed', 'cooldown_changed', 'item_lifetime_changed', 'item_used' ],
			loaded: false,
			timeout: null,
			wallet: 0,
			refetch: 0,
			currencyGenerators: {
				Hearts: {
					2557000 : 1250,		/* Small Heart Bag - 1250 hearts */
					2558000 : 2500,		/* Large Heart Bag - 2500 hearts */
					2561000 : 100,		/* Love Apple - 100 hearts */
					2562000 : 500,		/* Sugar hearts - 500 hearts */
					2563000 : 650,		/* 650 hearts */
					2564000 : 1500,		/* 1500 hearts */
					2565000 : 3250,		/* 3250 hearts */
					2566000 : 9000,		/* 9000 hearts */
					2567000 : 16000,	/* 16000 hearts */
				},
				Easter: {
					2698000 : 2500,		/* Efficient Easter egg container - 2500 eggs */
					51980000: 25,		/* YYY Egg Container - 25 Eggs */
					51981000: 50,		/* YYY Egg Container - 50 Eggs */
					51982000: 100,		/* YYY Egg Container - 100 Eggs */
					51983000: 200,		/* YYY Egg Container - 200 Eggs */
					51984000: 300,		/* YYY Egg Container - 300 Eggs */
					51985000: 400,		/* YYY Egg Container - 400 Eggs */
					51986000: 500,		/* YYY Egg Container - 500 Eggs */
					2590000 : 650,		/* 650 Eggs */
					2591000 : 1500,		/* 1500 Eggs */
					2592000 : 3250,		/* 3250 Eggs */
					2593000 : 9000,		/* 9000 Eggs */
					2594000 : 16000,	/* 16000 Eggs */
				},
				Independence: {
					51482000 : 1250,	/* Fireworks container - 1250 fireworks */
					51483000 : 2500,	/* Large Fireworks container - 2500 fireworks */
					51484000 : 25,		/* Fireworks yellow case */
					51485000 : 50,		/* Fireworks green case */
					51486000 : 100,		/* Fireworks blue case */
					51487000 : 200,		/* Fireworks violet case */
					51488000 : 400,		/* Fireworks red case */
					2619000  : 650,		/* 650 Fireworks */
					2620000  : 1500,	/* 1500 Fireworks */
					2621000  : 3250,	/* 3250 Fireworks */
					2622000  : 9000,	/* 9000 Fireworks */
					2623000  : 16000,	/* 16000 Fireworks */
				},
				Octoberfest: {
					53042000 : 1250,	/* Pretzels Container - 1250 Pretzels */
					50691000 : 2500,	/* Bag of Pretzels - 2500 Pretzels */
					52646000 : 5,		/* 5 Pretzels */
					52213000 : 25,		/* 200 Pretzels */
					52214000 : 50,		/* 200 Pretzels */
					52215000 : 100,		/* 200 Pretzels */
					52216000 : 200,		/* 200 Pretzels */
					52217000 : 400,		/* 400 Pretzels */
					371000 : 650,		/* 650 Pretzels */
					973000 : 1500,		/* 1500 Pretzels */
					974000 : 3250,		/* 3250 Pretzels */
					975000 : 9000,		/* 9000 Pretzels */
					976000 : 16000,		/* 16000 Pretzels */
				},
				DayOfDead: {
					2665000  : 1250,	/* Flower pot - 1250 Cempasúchil flowers */
					2666000  : 2500,	/* Big Flower pot - 2500 Cempasúchil flowers */
					2675000  : 25,		/* Cempasúchil Case - 25 Cempasúchil flowers */
					51255000 : 50,		/* Cempasúchil Blue Case - 50 Cempasúchil flowers */
					51256000 : 100,		/* Cempasúchil Green Case - 100 Cempasúchil flowers */
					51257000 : 200,		/* Cempasúchil Violet Case - 200 Cempasúchil flowers */
					51258000 : 400,		/* Cempasúchil Red Case - 400 Cempasúchil flowers */
					2676000  : 650,		/* 650 Cempasúchils */
					2677000  : 1500,	/* 1500 Cempasúchils */
					2678000  : 3250,	/* 3250 Cempasúchils */
					2679000  : 9000,	/* 9000 Cempasúchils */
					2680000  : 16000,	/* 16000 Cempasúchils*/
				}
			},
			init: function() {
				this.listeningSignals = [ 'inventory_loaded', 'inventory_changed', 'cooldown_changed', 'item_lifetime_changed', 'item_used' ];
				this.loaded = true;
				this.check();
				EventHandler.listen(this.listeningSignals, this.signalHandler, this);
			},
			destroy: function() {
				clearTimeout(this.timeout);
				this.refetch = 0;
				this.loaded = false;
				EventHandler.unlisten(this.listeningSignals, this.signalHandler, this);
				HiroFriends.guiManager.divInventoryAvail.hide(2000);
			},
			check: function() {
				clearTimeout(this.timeout);
				if(!this.loaded) return false;
				var coolDownComplete = false, genAll = [], genNow = [], genTotal = 0, maxCoolDown = 0, now = new ServerDate().getTime()/1e3;
				var should_check_again = 0;
				var itemLinks = [ ];
				$.each(this.currencyGenerators[HiroFriends.eventManager.eventName], function(itemId, amount) {
					var invItem = Bag.getItemByItemId(itemId);
					if(invItem) {
						var coolDown = Bag.itemCooldown[itemId];
						var lifetime = invItem.lifetime || 0;
						genAll.push(invItem);
						if(invItem.count > 1) genTotal += invItem.count*amount;
						else if(lifetime >= 0) {
							if(!coolDown || (coolDown <= now && !invItem.obj.unique)) {
								genNow.push(invItem);
								genTotal += invItem.count*amount;
							}
							else if(coolDown <= now) {
								maxCoolDown = Math.max(maxCoolDown, coolDown);
								itemLinks.push('[item='+itemId+']');
								coolDownComplete = true;
								genNow.push(invItem);
								genTotal += amount;
							}
							else {
								should_check_again = should_check_again ? Math.min(should_check_again, coolDown - now) : coolDown - now;
							}
						}
					}
				});
				this.generatorsInventory = genAll;
				this.generatorsAvailable = genNow;
				this.wallet = genTotal;
				HiroFriends.guiManager.updateBottomBarInventoryIcon(coolDownComplete, this.wallet);
				HiroFriends.guiManager.updateStatsInventory(this.wallet);
				if(coolDownComplete) HiroFriends.guiManager.chatNotify('<a href="javascript:void(HiroFriends.inventoryManager.displayGenerators())"><img src="'+HiroFriends.guiManager.currencyImage+'" /> '+HiroFriends.localeManager.getMsg('inventory')+'</a>: '+itemLinks.join(" "), maxCoolDown);
				if(should_check_again) {
					var that = this;
					should_check_again *= 1e3;
					this.refetch = now*1e3 + should_check_again;
					this.timeout = setTimeout(function() { that.check(); }, should_check_again);
				}
				else this.refetch = 0;
				return this;
			},
			displayGenerators: function() {
				if(this.generatorsInventory.length > 0) {
					if(!Bag.loaded) {
						var that = this;
						EventHandler.listen('inventory_loaded', function() {
							that.openInventory();
							return EventHandler.ONE_TIME_EVENT;
						});
					}
					else this.openInventory();
				}
			},
			openInventory: function() {
				Wear.open();
				Inventory.showSearchResult(this.generatorsInventory);
			},
			signalHandler: function() {
				var that = this;
				setTimeout(function() { that.check(); }, 1e3);
			},
		},
		logManager: {
			counterSentOk: false,
			counterReceivedOk: false,
			deferred: null,
			drillCollected: { admin: 0, adventures: 0, construction: 0, duels: 0, fortBattles: 0, itemUse: 0, jobs: 0, npcDuels: 0, premium: 0, quests: 0, selfDrop: 0, other: 0 },
			drillSpent: { duelist25: { times: 0, cost: 0 }, duelist150: { times: 0, cost: 0 }, duelist800: { times: 0, cost: 0 }, bribe: { times: 0, cost: 0 }, timer: { times: 0, cost: 0 }, admin: { times: 0, cost: 0 }, other: { times: 0, cost: 0 } },
			entries: [],
			friendLog: {},
			loaded: false,
			locked: false,
			needsUpdate: true,
			refetch: 0,
			signalNewLog: null,
			signalReceived: null,
			signalSent: null,
			logTimeout: null,
			totalCollected: 0,
			totalFriends: 0,
			totalReceived: 0,
			totalSent: 0,
			totalSpent: 0,
			totalTimesSent: 0,
			firstLog: Date.now()/1e3,
			firstSent: Date.now()/1e3,
			lastLog: 0,
			newLastLog: 0,
			init: function() {
				var that = this;
				this.signalNewLog = Game.sesData[HiroFriends.eventManager.eventName].counter.key;
				this.signalReceived = Game.sesData[HiroFriends.eventManager.eventName].counter.key.replace('collected','received');
				this.signalSent = Game.sesData[HiroFriends.eventManager.eventName].counter.key.replace('collected','sent');
				EventHandler.listen(this.signalNewLog, this.updateStatus, this);
				EventHandler.listen(this.signalReceived, this.updateTotalReceived, this);
				EventHandler.listen(this.signalSent, this.updateTotalSent, this);
				return $.when(this.fetch()).done(function() {
					that.loaded = true;
				});
			},
			reload: function() {
				HiroFriends.guiManager.buttonLoading();
				return this.fetch().done(function() { HiroFriends.guiManager.buttonShow(); });
			},
			destroy: function() {
				clearTimeout(this.logTimeout);
				this.needsUpdate = false;
				this.refetch = 0;
				EventHandler.unlisten(this.signalSent, this.updateTotalSent, this);
				EventHandler.unlisten(this.signalReceived, this.updateTotalReceived, this);
			},
			fetch: function() {
				var limit = 100;
				if(!this.locked) {
					this.deferred = new $.Deferred();
					if(this.needsUpdate) {
						this.locked = true;
						clearTimeout(this.logTimeout);
						this.newLastLog = this.lastLog;
						this.needsUpdate = false;
						this.fetchLogPage(1, limit);
					}
					else this.deferred.resolve();
				}
				return this.deferred.promise();
			},
			fetchLogPage: function(page, limit) {
				var that = this;
				return $.ajax({ type: "POST", url: "/game.php?window=ses&mode=log", data: { ses_id: HiroFriends.eventManager.eventName, page: page, limit: limit }, success: function(data) {
					var count = 0, details, hasNext = data.hasNext, limit = data.limit, nextPage = data.page+1;
					$.each(data.entries, function(key, val) {
						count = parseInt(val.value);
						if(val.date < that.firstLog) that.firstLog = val.date;
						if(val.date <= that.lastLog) {
							hasNext = false;
							return false;
						}
						that.entries.push(val);
						if(val.date > that.newLastLog) that.newLastLog = val.date;
						switch(val.type) {
							case "friendDrop":
								if(null !== val.details) {
									details = JSON.parse(val.details);
									if(undefined === that.friendLog[details.player_id]) that.friendLog[details.player_id] = { name: details.name, total: count, timesSent: 0, datesRecv: [], datesSent: [] };
									else that.friendLog[details.player_id].total += count;
									that.friendLog[details.player_id].datesRecv.push(val.date);
								}
								that.totalFriends += count;
								that.totalCollected += count;
								break;
							case "friendSelfDrop":
								if(val.date < that.firstSent) that.firstSent = val.date;
								if(null !== val.details) {
									details = JSON.parse(val.details);
									if(undefined === that.friendLog[details.player_id]) that.friendLog[details.player_id] = { name: details.name, total: 0, timesSent: 1, datesRecv: [], datesSent: [] };
									else ++ that.friendLog[details.player_id].timesSent;
									that.friendLog[details.player_id].datesSent.push(val.date);
								}
								++ that.totalTimesSent;
								that.drillCollected.selfDrop += count;
								that.totalCollected += count;
								break;
							case "jobDrop":		that.drillCollected.jobs += count; that.totalCollected += count; break;
							case "buildDrop":	that.drillCollected.construction += count; that.totalCollected += count; break;
							case "duelDrop":	that.drillCollected.duels += count; that.totalCollected += count; break;
							case "duelNPCDrop":	that.drillCollected.npcDuels += count; that.totalCollected += count; break;
							case "battleDrop":	that.drillCollected.fortBattles += count; that.totalCollected += count; break;
							case "adventureDrop":	that.drillCollected.adventures += count; that.totalCollected += count; break;
							case "activatePremium":	that.drillCollected.premium += count; that.totalCollected += count; break;
							case "questDrop":	that.drillCollected.quests += count; that.totalCollected += count; break;
							case "itemUse":		that.drillCollected.itemUse += count; that.totalCollected += count; break;
							case "adminDrop":
								if(count > 0) {
									that.drillCollected.admin += count;
									++ that.drillCollected.admin.times;
									that.totalCollected += count;
								}
								else {
									that.drillSpent.admin.cost += count;
									++ that.drillSpent.admin.times;
									that.totalSpent += count;
								}
								break;
							case "wofPay":
								that.totalSpent += count;
								switch(val.details) {
									case "duelist25": that.drillSpent.duelist25.cost += count; ++ that.drillSpent.duelist25.times; break;
									case "duelist150": that.drillSpent.duelist150.cost += count; ++ that.drillSpent.duelist150.times; break;
									case "duelist800": that.drillSpent.duelist800.cost += count; ++ that.drillSpent.duelist800.times; break;

									case "sneakyshot": that.drillSpent.bribe.cost += count; ++ that.drillSpent.bribe.times; break;
									case "timerreset": that.drillSpent.timer.cost += count; ++ that.drillSpent.timer.times; break;
									default:
										if(count) {
											if(undefined === that.drillSpent[count]) that.drillSpent[count] = { times: 1, cost: count };
											else {
												that.drillSpent[count].cost += count;
												++ that.drillSpent[count].times;
											}
										}
								}
								break;
							default:
								if(count > 0) {
									that.drillCollected.other += count;
									that.totalCollected += count;
								}
								else {
									that.drillSpent.other.cost += count;
									++ that.drillSpent.other.times;
									that.totalSpent += count;
								}
						}
					});
					if(hasNext) return that.fetchLogPage(nextPage, limit, that.deferred);
					else {
						/* Done */
						that.lastLog = that.newLastLog;
						Chat.Request.Nop();
						/* Refetch logs in an hour if required */
						var now = Date.now(), will_fetch_again = 3600*1e3, logSent = 20*that.totalTimesSent;
						that.refetch = now + will_fetch_again;
						that.logTimeout = setTimeout(function() { that.fetch(); }, will_fetch_again);
						/* Update totals */
						if(that.totalReceived < that.totalFriends) that.totalReceived = that.totalFriends;
						if(that.totalSent < logSent) that.totalSent = logSent;
						that.locked = false;
						that.deferred.resolve();
					}
				} });
			},
			updateStatus: function(data) {
				var el = $(".hf_coll_row .hf_count"), from = "" !== el.text() && deformat_number(el.text()) || 0;
				var el2 = $(".hf_daily"), from2 = "" !== el2.text() && deformat_number(el2.text()) || 0;
				var now = Date.now()/1e3;
				var newValue = parseInt(data);
				var totalCollected = newValue + this.totalSpent;
				var dailyAverage = Math.round(totalCollected * 86400 / (now - HiroFriends.logManager.firstLog));
				this.needsUpdate = true;
				west.common.countTo(el, totalCollected, from, function(val) { el.text(format_number(Math.ceil(val, 6))); });
				west.common.countTo(el2, dailyAverage, from2, function(val) { el2.text(format_number(Math.ceil(val, 6))); });
			},
			updateTotalReceived: function(data) {
				var el = $(".hf_recv_row .hf_count"), el2 = $(".hf_friends"), currentValue = this.totalReceived;
				var newValue = parseInt(data);
				// In case Inno forgets again to reset stats
				if(newValue < currentValue) {
				}
				else if(newValue == currentValue) this.counterReceivedOk = true;
				else {
					if(newValue - currentValue == 20) this.counterReceivedOk = true;
					this.totalReceived = newValue;
					$(".hf_recv_row").css({"visibility": "visible"});
					west.common.countTo(el, this.totalReceived, currentValue, function(val) { el.text(format_number(Math.ceil(val, 6))); });
					if(this.counterReceivedOk) west.common.countTo(el2, this.totalReceived, currentValue, function(val) { el2.text(format_number(Math.ceil(val, 6))); });
				}
			},
			updateTotalSent: function(data) {
				var el = $(".hf_sent_row .hf_count"), currentValue = this.totalSent;
				var newValue = parseInt(data);
				// In case Inno forgets again to reset stats
				if(newValue < currentValue) {
				}
				else if(newValue == currentValue) this.counterSentOk = true;
				else {
					if(newValue - currentValue == 20) this.counterSentOk = true;
					this.totalSent = newValue;
					$(".hf_sent_row").css({"visibility": "visible"});
					west.common.countTo(el, this.totalSent, currentValue, function(val) { el.text(format_number(Math.ceil(val, 6))); });
				}
			},
		},
		tombolaManager: {
			refetch: 0,
			signalsPlayed: [ 'inventory_changed', 'char_nuggets_changed' ],
			signalWallet: '',
			loaded: false,
			timeout: null,
			wallet: 0,
			wofStatus: {},
			wofTimeout: null,
			wofTries: 0,
			wofType: undefined,
			init: function() {
				var that = this, wof_types = {
					'Hearts'	:	'heartswof',
					'Easter'	:	'easterwof',
					'Independence'	:	'independencewof',
					'Octoberfest'	:	'octoberwof',
					'DayOfDead'	:	'dayofdeadwof',
				};
				$.fn.hiro_wof_status = function(cat, wof_state) {
					var ar_title1 = HiroFriends.localeManager.getMsg('wofCat');
					var ar_title2 = HiroFriends.localeManager.getMsg('wofState');
					var ar_title3 = ar_title2[HiroFriends.eventManager.eventName];
					var title1_add = ('Easter' == HiroFriends.eventManager.eventName) ? ' ('+that.wofStatus.mode.opponentNames[that.wofStatus.prizes.enhancements[cat]] +')': '';
					if('Independence' == HiroFriends.eventManager.eventName) {
						switch(wof_state) {
							case 0	: $(this).css({ "background": "url('"+HiroFriends.guiManager.cdnBase+"/images/tw2gui/iconset.png?14') no-repeat -98px 0", "opacity": "0.5" }); break;
							case 1	: $(this).css({ "background": "url('"+HiroFriends.guiManager.cdnBase+"/images/tw2gui/iconset.png?14') no-repeat -82px -16px", "opacity": "1" }); break;
							case 2	: $(this).css({ "background": "url('"+HiroFriends.guiManager.cdnBase+"/images/tw2gui/iconset.png?14') no-repeat -98px -16px", "opacity": "1" }); break;
							case 3	: $(this).css({ "background": "url('"+HiroFriends.guiManager.cdnBase+"/images/tw2gui/iconset.png?14') no-repeat -128px -64px", "opacity": "1" }); break;
							default	: $(this).css({ "background": "url('"+HiroFriends.guiManager.cdnBase+"/images/tw2gui/iconset.png?14') no-repeat -2px -16px", "opacity": "0.5" });
						}
					}
					else switch(wof_state) {
						case 0	: $(this).css({ "background": "url('"+HiroFriends.guiManager.cdnBase+"/images/tw2gui/iconset.png?14') no-repeat -98px 0", "opacity": "0.5" }); break;
						case 1	: $(this).css({ "background": "url('"+HiroFriends.guiManager.cdnBase+"/images/tw2gui/iconset.png?14') no-repeat -82px -16px", "opacity": "1" }); break;
						case 2	: $(this).css({ "background": "url('"+HiroFriends.guiManager.cdnBase+"/images/tw2gui/iconset.png?14') no-repeat -112px -16px", "opacity": "1" }); break;
						case 3	: $(this).css({ "background": "url('"+HiroFriends.guiManager.cdnBase+"/images/tw2gui/iconset.png?14') no-repeat -98px -16px", "opacity": "1" }); break;
						default	: $(this).css({ "background": "url('"+HiroFriends.guiManager.cdnBase+"/images/tw2gui/iconset.png?14') no-repeat -2px -16px", "opacity": "0.5" });
					}
					$(this).addMousePopup({
						'teaser' : '<b>' + ar_title1[cat] + title1_add + '</b>',
						'content': '<div style="max-width: 250px;">' + ar_title3[wof_state] + '</div>'
					});
					$(this).off("click");
					if(wof_state > 1) $(this).click(function() { that.wofWindowOpen(); return false; }).css({ "cursor": "pointer" });
					else $(this).css({ "cursor": "help" });
					return $(this);
				};
				if(undefined === wof_types[HiroFriends.eventManager.eventName]) return false;
				this.wofType = wof_types[HiroFriends.eventManager.eventName];
				if('Octoberfest' !== HiroFriends.eventManager.eventName && 'Easter' !== HiroFriends.eventManager.eventName && 'Independence' != HiroFriends.eventManager.eventName) return false;
				this.wofTimeout = setTimeout(function() { that.initWof(); }, 1e3);
			},
			initGui: function() {
				for(var i = 0; i < 4; ++i)
					$("<div />", { id: "hiro_wof_"+i, style: "display: inline-block; width: 13px; height: 16px; background: url('"+HiroFriends.guiManager.cdnBase+"/images/tw2gui/iconset.png?14') no-repeat -2px -16px; opacity: 0.5;" }).appendTo(HiroFriends.guiManager.divTombola);
				return this;
			},
			initWof: function() {
				var that = this;
				clearTimeout(this.wofTimeout);
				if(this.loaded) return false;
				++ this.wofTries;
				try {
					west.wof.WofManager.load(that.wofType, function(data) {
						data.prizes.enhancements.sort(function(a, b) { return a - b; });
						that.wofStatus = data;
						if('easterwof' === that.wofType) {
							if(undefined !== data.mode && undefined !== data.mode.opponentNames) {
								if(undefined !== data.mode.opponentNames[25]) HiroFriends.localeManager.languages[HiroFriends.localeManager.localeScript].statDetails.duelist25 = data.mode.opponentNames[25];
								if(undefined !== data.mode.opponentNames[150]) HiroFriends.localeManager.languages[HiroFriends.localeManager.localeScript].statDetails.duelist150 = data.mode.opponentNames[150];
								if(undefined !== data.mode.opponentNames[800]) HiroFriends.localeManager.languages[HiroFriends.localeManager.localeScript].statDetails.duelist800 = data.mode.opponentNames[800];
							}
						}
						that.wallet = Character.ses_currency[HiroFriends.eventManager.eventName.toLowerCase()];
						that.loaded = true;
						that.initGui();
						that.timeout = setTimeout(function() { that.displayWofStatus(); }, 1e3);
						that.signalWallet = Game.sesData[HiroFriends.eventManager.eventName].counter.key;
						EventHandler.listen(that.signalWallet, that.signalWalletChanged, that);
						EventHandler.listen(that.signalsPlayed, that.signalPlayedHandler, that);
					}, function(data) {
						// Event is over?
					});
				} catch(x) {
					this.wofTimeout = setTimeout(function() { that.initWof(); }, that.WofTries * 1e3);
				}
			},
			destroy: function() {
				if(!this.loaded) return false;
				this.refetch = 0;
				clearTimeout(this.timeout);
				EventHandler.unlisten(this.signalWallet, this.signalWalletChanged, this);
				EventHandler.unlisten(this.signalsPlayed, this.signalPlayedHandler, this);
				HiroFriends.guiManager.divTombola.hide(2000);
			},
			cooldownEnds: function(cost) {
				if(!this.loaded) return false;
				var finishStamp = 0;
				if('Easter' == HiroFriends.eventManager.eventName) {
					if(undefined !== this.wofStatus.mode && undefined !== this.wofStatus.mode.cooldowns && undefined !== this.wofStatus.mode.cooldowns[cost]) {
						finishStamp = this.wofStatus.mode.cooldowns[cost].cdstamp || 0;
						return finishStamp;
					}
				}
				else if('Octoberfest' == HiroFriends.eventManager.eventName) {
					if(undefined !== this.wofStatus.window && undefined !== this.wofStatus.window.constructions && undefined !== this.wofStatus.window.constructions[cost]) {
						finishStamp = this.wofStatus.window.constructions[cost].buildTime || 0;
						return finishStamp;
					}
					if(undefined !== this.wofStatus.mode && undefined !== this.wofStatus.mode.states && undefined !== this.wofStatus.mode.states[cost]) {
						finishStamp = this.wofStatus.mode.states[cost].finish_date || 0;
					}
				}
				else if('Independence' == HiroFriends.eventManager.eventName) {
					if(undefined !== this.wofStatus.window && undefined !== this.wofStatus.window.constructions && undefined !== this.wofStatus.window.constructions[cost]) {
						finishStamp = this.wofStatus.window.constructions[cost].finish_date || 0;
						return finishStamp;
					}
					if(undefined !== this.wofStatus.mode && undefined !== this.wofStatus.mode.states && undefined !== this.wofStatus.mode.states[cost]) {
						finishStamp = this.wofStatus.mode.states[cost].finish_date || 0;
					}
				}
				return finishStamp;
			},
			displayWofStatus: function() {
				clearTimeout(this.timeout);
				if(!this.loaded) return false;
				var cost_bribe = this.wofStatus.mode.cost.bribe * this.wofStatus.mode.conversion.ses, now = Date.now(), refetch = 0, that = this;
				var should_check_again = 0;
				if(undefined === this.wofStatus.mode) return false;
				$.each(this.wofStatus.prizes.enhancements, function(key, cost) {
					var collected = true, currencyCost = cost * that.wofStatus.mode.conversion.ses, state = 0, finish = that.cooldownEnds(cost)*1e3;
					if(finish < now) {
						if('Independence' == HiroFriends.eventManager.eventName) {
							collected = that.wofStatus.mode.states[cost].collected;
							if(finish && !collected) state = 3;
							else if(that.wallet < currencyCost) state = 1;
							else state = 2;
						}
						else {
							if(that.wallet < currencyCost) state = 1;
							else if(that.wallet < currencyCost + cost_bribe) state = 2;
							else state = 3;
						}
					}
					else if(finish) {
						should_check_again = should_check_again ? Math.min(should_check_again, finish-now) : finish-now;
						refetch = refetch ? Math.min(refetch, finish) : finish;
					}
					$("#hiro_wof_"+key).hiro_wof_status(key, state);
				});
				if(should_check_again) {
					this.timeout = setTimeout(function() { that.displayWofStatus(); }, should_check_again);
				}
				this.refetch = refetch;
				return true;
			},
			reload: function() {
				if(!this.loaded) return false;
				var that = this;
				for(var i = 3; i >= 0; --i)
					$("#hiro_wof_"+i).css({ "background": "url('"+HiroFriends.guiManager.cdnBase+"/images/tw2gui/iconset.png?14') no-repeat 0 -16px", "opacity": "0.5" });
				this.requestData();
				this.timeout = setTimeout(function() { that.displayWofStatus(); }, 2e3);
			},
			requestData: function() {
				if(undefined !== this.wofStatus.window) this.wofStatus.window.requestData();
			},
			signalPlayedHandler: function() {
				if(!this.loaded) return false;
				var that = this;
				this.requestData();
				this.timeout = setTimeout(function() { that.displayWofStatus(); }, 2e3);
			},
			signalWalletChanged: function(data) {
				if(!this.loaded) return false;
				var newAmount = parseInt(data), that = this;
				if(newAmount <= this.wallet) {
					this.requestData();
				}
				this.wallet = newAmount;
				this.timeout = setTimeout(function() { that.displayWofStatus(); }, 2e3);
			},
			wofWindowOpen: function() {
				west.wof.WofManager.wofs[this.wofType].window.show();
				return false;
			},
		},
		updateManager: {
			canStore: false,
			lastChecked: 0,
			latestVersion: undefined,
			storageLastChecked: scriptObject+".lastChecked",
			storageVersion: scriptObject+".version",
			updated: false,
			init: function() {
				var now = Date.now(), that = this;
				this.canStore = this.storageAvailable('localStorage');
				if(this.canStore) {
					var previousVersion = localStorage.getItem(this.storageVersion) === null ? 0 : parseFloat(localStorage.getItem(this.storageVersion));
					this.lastChecked = localStorage.getItem(this.storageLastChecked) === null ? 0 : parseInt(localStorage.getItem(this.storageLastChecked));
					localStorage.setItem(this.storageVersion, VERSION);
					this.updated = previousVersion && VERSION > previousVersion;
				}
				if(now - this.lastChecked > 4 * 3600 * 1e3) setTimeout(function() { that.check(false); }, 2e3);
			},
			check: function(user_initiated) {
				var that = this;
				var URL_VERSION = "https://raw.githack.com/TWFriends/scripts/master/version.json";
				$.getJSON(URL_VERSION).done(function(data) {
					that.lastChecked = Date.now();
					if(that.canStore) localStorage.setItem(that.storageLastChecked, that.lastChecked);
					if(data['HiroFriends.latestVersion']) {
						that.latestVersion = data['HiroFriends.latestVersion'];
						if(that.latestVersion && that.latestVersion > VERSION) {
							var upgradeDialog = new west.gui.Dialog(scriptName + ' ' + HiroFriends.localeManager.getMsg('version')+' ' + that.latestVersion.toFixed(2), HiroFriends.localeManager.getMsg('version_upgrade'), west.gui.Dialog.SYS_WARNING).addButton('ok', function() {
								try { upgradeDialog.hide(); window.open(URL_CODE); } catch(e) {}
							}).addButton('cancel').show();
						}
						else if(user_initiated) new west.gui.Dialog(scriptName + ' ' + HiroFriends.localeManager.getMsg('version')+' ' + VERSION.toFixed(2), HiroFriends.localeManager.getMsg('version_ok'), west.gui.Dialog.SYS_OK).addButton("ok").show();
					}
				}).fail(function() {
					if(user_initiated) new west.gui.Dialog(scriptName, HiroFriends.localeManager.getMsg('version_checkFailed'), west.gui.Dialog.SYS_WARNING).addButton(HiroFriends.localeManager.getMsg('version_checkManual'), function() { window.open(URL_INSTALL, '_blank'); }).addButton("cancel").show();

					console.log(data['HiroFriends.latestVersion']);
				});
			},
			storageAvailable: function(type) {
				try {
					var storage = window[type], storageItem = scriptObject+'.testStorage';
					storage.setItem(storageItem, storageItem);
					storage.removeItem(storageItem);
					return true;
				} catch(e) { return false; }
			},
		},
		windowManager: {
			divMain: null,
			divTable: null,
			friends: [],
			gameWindow: null,
			loaded: false,
			scrollPane: null,
			table: null,
			buildStats: function() {
				var drills = [], details = '<div class="hf_stats" style="margin: 2px 8px 0px 8px;">', extended = '';
				details += '<div style="display: table-row; width: 100%;">';
				details += '<div style="display: table-cell; width: 240px; vertical-align: top;">';
				if(HiroFriends.logManager.loaded) {
					details += '<div class="hf_row hf_sent_row" style="visibility: '+(HiroFriends.logManager.totalSent ? "visible" : "hidden")+';"><span class="hf_stat">'+HiroFriends.localeManager.getMsg('youSent')+':</span><span class="hf_count">'+format_number(HiroFriends.logManager.totalSent)+'</span></div>';
					details += '<div class="hf_row hf_recv_row" style="visibility: '+(HiroFriends.logManager.totalReceived ? "visible" : "hidden")+';"><span class="hf_stat">'+HiroFriends.localeManager.getMsg('received')+':</span><span class="hf_count" style="color: #000099;">'+format_number(HiroFriends.logManager.totalReceived)+'</span></div>';
					details += '<div class="hf_row hf_coll_row"><span class="hf_stat">'+HiroFriends.localeManager.getMsg('collected')+':</span><span class="hf_count" style="color: #006600;">'+format_number(HiroFriends.logManager.totalCollected)+'</span></div>';
					if(HiroFriends.logManager.totalSpent) {
						details += '<div class="hf_row"><span class="hf_stat">'+HiroFriends.localeManager.getMsg('used')+':</span><span class="hf_count" style="color: #990000;">'+format_number(HiroFriends.logManager.totalSpent)+'</span></div>';
					}
				}
				if(HiroFriends.inventoryManager.generatorsInventory.length) {
					details += '<div class="hf_row hf_inv_row"><span class="hf_stat">'+HiroFriends.localeManager.getMsg('inventory')+':</span><a class="hf_count" href="javascript:void(HiroFriends.inventoryManager.displayGenerators());">'+format_number(HiroFriends.inventoryManager.wallet)+'</a></div>';
				}
				details += '</div>';
				if(HiroFriends.logManager.loaded && HiroFriends.logManager.totalCollected) {
					var now = Date.now()/1e3;
					var dailyAverage = Math.round(HiroFriends.logManager.totalCollected * 86400 / (now - HiroFriends.logManager.firstLog));
					details += '<div style="display: table-cell; vertical-align: top">';
					details += '<div class="hf_row"><b>'+HiroFriends.localeManager.getMsg('stats')+'</b> ('+HiroFriends.localeManager.getMsg('since')+' '+new Date(HiroFriends.logManager.firstLog*1e3).toDateTimeString()+') <span style="float: right;">(<b class="hf_daily" style="color: #006600;">'+format_number(dailyAverage)+'</b>/'+HiroFriends.localeManager.getMsg('perDay')+')</span></div>';
					extended = '<table><tr><td>'+HiroFriends.localeManager.getMsg('friends')+':</td><td style="font-weight: bold; text-align: right;">'+format_number(HiroFriends.logManager.totalFriends)+'</td></tr>';
					drills.push('<span class="hf_drill hf_recv_row">'+HiroFriends.localeManager.getMsg('friends')+': <b class="hf_friends" style="color: #000099">'+format_number(HiroFriends.logManager.totalFriends)+'</b></span>');
					$.each(Object.keys(HiroFriends.logManager.drillCollected), function(key, type) {
						var drill_count = HiroFriends.logManager.drillCollected[type];
						var localeObj = HiroFriends.localeManager.getMsg('statDetails') || { };
						var drill_name = localeObj[type] || type;
						extended += '<tr><td>'+drill_name+':</td><td style="font-weight: bold; text-align: right;">'+format_number(drill_count)+'</td></tr>';
						if(drill_count) drills.push('<span class="hf_drill">'+drill_name+': <b style="color: #006600;">'+format_number(drill_count)+'</b></span>');
					});
					extended += '</table>';
					details += '<div style="display: table-row; line-height: 16px;"><span style="display: table-cell; padding-right: 8px;" title="'+HiroFriends.helpers.escapeHtml(extended)+'"><img src="'+HiroFriends.guiManager.cdnBase+'/images/tw2gui/plusminus/plus_button.png"></span><span style="display: table-cell;">'+drills.join(", ")+'</span></div>';
					if(HiroFriends.logManager.totalSpent) {
						drills = [];
						$.each(Object.keys(HiroFriends.logManager.drillSpent), function(key, type) {
							var drill = HiroFriends.logManager.drillSpent[type];
							if(isNaN(parseInt(type))) {
								var localeObj = HiroFriends.localeManager.getMsg('statDetails') || { };
								var drill_name = localeObj[type] || type;
								if(drill.times) drills.push('<span class="hf_drill">'+drill_name+': <b style="color: #990000;">'+format_number(drill.cost)+'</b> ('+drill.times+'×)</span>');
							}
							else if(type !== "0") drills.push('<span class="hf_drill">'+drill.times+'×<b style="color: #990000;">'+format_number(type)+'</b></span>');
						});
						details += '<div style="display: table-row; line-height: 16px;"><span style="display: table-cell; padding-right: 8px;"><img src="'+HiroFriends.guiManager.cdnBase+'/images/tw2gui/plusminus/minus_button.png"></span><span style="display: table-cell;">'+drills.join(", ")+'</span></div>';
					}
					details += '</div>';
				}
				details += '</div>';
				details += '</div>';
				return details;
			},
			buildTable: function(sort) {
				var friend_time, server_time = Game.getServerTime(), that = this;
				this.calcFriends();
				switch(sort) {
					case "name"		:	this.friends.sort(this.sortByName); break;
					case "name_desc"	:	this.friends.sort(this.sortByName).reverse(); break;
					case "recv"		:	this.friends.sort(this.sortByRecv); break;
					case "recv_asc"		:	this.friends.sort(this.sortByRecv).reverse(); break;
					case "sent"		:	this.friends.sort(this.sortBySent); break;
					case "sent_asc"		:	this.friends.sort(this.sortBySent).reverse(); break;
					case "time_asc"		:	this.friends.sort(this.sortByTime).reverse(); break;
					case "freq"		:	this.friends.sort(this.sortByFreq); break;
					case "freq_desc"	:	this.friends.sort(this.sortByFreq).reverse(); break;
					case "last"		:	this.friends.sort(this.sortByLast); break;
					case "last_asc"		:	this.friends.sort(this.sortByLast).reverse(); break;
					default			:	sort = "time"; this.friends.sort(this.sortByTime);
				}
				var thName = $('<a title="'+HiroFriends.localeManager.getMsg('name')+'">'+HiroFriends.localeManager.getMsg('name')+'</a>').click(function(){ HiroFriends.windowManager.sortTable(sort == 'name' ? 'name_desc' : 'name'); return false; });
				var thAction = $('<a title="'+HiroFriends.eventManager.eventInfo.label+'">'+HiroFriends.eventManager.eventInfo.label+'</a>').click(function(){ HiroFriends.windowManager.sortTable(sort == 'time' ? 'time_asc' : 'time'); return false; });
				var thRecv = HiroFriends.logManager.loaded ? $('<a title="'+HiroFriends.localeManager.getMsg('received')+' ('+HiroFriends.localeManager.getMsg('since')+' '+new Date(HiroFriends.logManager.firstLog*1e3).toDateTimeString()+')">'+HiroFriends.localeManager.getMsg('received')+'</a>').click(function(){ HiroFriends.windowManager.sortTable(sort == 'recv' ? 'recv_asc' : 'recv'); return false; }) : '';
				var thSent = (HiroFriends.logManager.loaded && HiroFriends.logManager.drillCollected.selfDrop) ? $('<a title="'+HiroFriends.localeManager.getMsg('youSent')+' ('+HiroFriends.localeManager.getMsg('since')+' '+new Date(HiroFriends.logManager.firstSent*1e3).toDateTimeString()+')">'+HiroFriends.localeManager.getMsg('youSent')+'</a>').click(function(){ HiroFriends.windowManager.sortTable(sort == 'sent' ? 'sent_asc' : 'sent'); return false; }) : '';
				var thFreq = HiroFriends.logManager.loaded ? $('<a title="'+HiroFriends.localeManager.getMsg('frequency')+'">'+HiroFriends.localeManager.getMsg('frequency')+'</a>').click(function(){ HiroFriends.windowManager.sortTable(sort == 'freq' ? 'freq_desc' : 'freq'); return false; }) : '';
				var thLast = HiroFriends.logManager.loaded ? $('<a title="'+HiroFriends.localeManager.getMsg('lastReceived')+'">'+HiroFriends.localeManager.getMsg('lastReceived')+'</a>').click(function(){ HiroFriends.windowManager.sortTable(sort == 'last' ? 'last_asc' : 'last'); return false; }) : '';

				var hiroTable = new west.gui.Table().addColumn("hf_idx").addColumn("hf_player").addColumn("hf_action").addColumn("hf_recv").addColumn("hf_sent").addColumn("hf_last").addColumn("hf_freq").addColumn("hf_delete").appendToCell("head", "hf_idx", '&nbsp;').appendToCell("head", "hf_player", thName).appendToCell("head", "hf_action", thAction).appendToCell("head", "hf_recv", thRecv).appendToCell("head", "hf_sent", thSent).appendToCell("head", "hf_last", thLast).appendToCell("head", "hf_freq", thFreq).appendToCell("head", "hf_delete", '&nbsp;');
				var idx = 1;
				var now = Date.now()/1e3;
				$.each(this.friends, function(key, val) {
					var tdName, tdAction, tdRecv = '', tdSent = '', tdLast = '', tdFreq = '', tdRemove, color = '';
					friend_time = val.activation_time + HiroFriends.eventManager.eventInfo.cooldown - server_time;
					tdName = $('<a title="'+val.name+'">'+val.name+'</a>').click(function() { PlayerProfileWindow.open(parseInt(val.id)); return false; });
					tdRemove = $('<img style="width: 16px; height: 16px;" title="'+HiroFriends.localeManager.getMsg('removeFriend')+'" src="'+HiroFriends.guiManager.cdnBase+'/images/icons/delete.png" />').click(function() { HiroFriends.friendManager.remove(val.id); return false; });
					if(friend_time > HiroFriends.eventManager.timeLeft()) tdAction = '('+HiroFriends.localeManager.getMsg('nextYear')+')';
					else if(friend_time > 0) {
						tdAction = $('<span />');
						HiroFriends.helpers.countDown(tdAction, server_time+friend_time, function(str) { return "("+str.formatDurationBuffWay() +")"; }, function(element) { element.replaceWith(that.createLink(val.id)); } );
					}
					else tdAction = that.createLink(val.id);
					if(HiroFriends.logManager.loaded) {
						if(val.recv) {
							var recv_list = '', lastDate;
							HiroFriends.logManager.friendLog[val.id].datesRecv.sort(function(a, b){ return a-b; });
							recv_list += '<ol style=&quot;list-style-type: decimal; padding: 0 0 0 20px;&quot;>';
							$.each(HiroFriends.logManager.friendLog[val.id].datesRecv, function(dkey, dval) {
								recv_list += '<li style=&quot;display: list-item; white-space: nowrap;&quot;>' + new Date(dval * 1e3).toDateTimeStringNice() + '</li>';
							});
							recv_list += '<ol>';
							if(!val.recv) color = "#990000";
							else if(!HiroFriends.logManager.totalTimesSent) color = "#000000";
							else if(val.recv >= val.sent) color = "#006600";
							else if(val.recv == val.sent - 20) color = "#996600";
							else color = "#990000";
							tdRecv = '<span title="'+recv_list+'" style="color: '+color+'; cursor: help;">'+val.recv+'</span>';
							if(now - val.last < 129600) color = "#006600";
							else if(now - val.last < 172800) color = "#996600";
							else color = "#990000";
							lastDate = new Date(val.last*1e3);
							tdLast = '<span style="color: '+color+';" title="'+lastDate.toDateTimeStringNice()+'">'+lastDate.toDateTimeString()+'</span>';
							if(val.freq < 129600) color = "#006600";
							else if(val.freq < 172800) color = "#996600";
							else color = "#990000";
							tdFreq = val.freq > HiroFriends.eventManager.eventInfo.cooldown ? '<span title="'+val.freq.formatDurationBuffWay()+'" style="color: '+color+';">'+val.freq.formatDuration()+'</span>' : '';
						}
						else {
							tdRecv = '<span style="color: #990000;" title="?">0</span>';
							tdLast = '<span style="color: #990000;">'+HiroFriends.localeManager.getMsg('neverReceived')+'</span>';
							tdFreq = '<span style="color: #990000;">∞</span>';
						}
						if(val.sent) {
							var sent_list = '';
							HiroFriends.logManager.friendLog[val.id].datesSent.sort(function(a, b){ return a-b; });
							sent_list += '<ol style=&quot;list-style-type: decimal; padding: 0 0 0 20px;&quot;>';
							$.each(HiroFriends.logManager.friendLog[val.id].datesSent, function(dkey, dval) {
								sent_list += '<li style=&quot;display: list-item; white-space: nowrap;&quot;>' + new Date(dval * 1e3).toDateTimeStringNice() + '</li>';
							});
							sent_list += '<ol>';
							tdSent = '(<span title="'+sent_list+'" style="cursor: help;">'+val.sent+'</span>)';
						}
						else if(HiroFriends.logManager.totalTimesSent) tdSent = '(<span style="color: #990000;" title="?">0</span>)';
						else tdSent = '';
					}
					else tdRecv = tdSent = tdLast = tdFreq = '';
					hiroTable.appendRow(null, 'hiroFriendRow_'+val.id).appendToCell(-1, "hf_idx", idx).appendToCell(-1, "hf_player", tdName).appendToCell(-1, "hf_action", tdAction).appendToCell(-1, "hf_recv", tdRecv).appendToCell(-1, "hf_sent", tdSent).appendToCell(-1, "hf_last", tdLast).appendToCell(-1, "hf_freq", tdFreq).appendToCell(-1, "hf_delete", tdRemove);
					++ idx;
				});
				hiroTable.appendToCell('foot', 'hf_idx', '<a href="javascript:void(HiroFriends.updateManager.check(true));"><span style="display: inline-block; width: 16px; height: 16px; background: url(\''+HiroFriends.guiManager.cdnBase+'/images/tw2gui/iconset.png?14\') no-repeat -96px -80px; vertical-align: bottom"></a>');
				hiroTable.appendToCell('foot', 'hf_player', '<a target="_blank" href="'+URL_INSTALL+'">'+scriptName+'</a>');
				hiroTable.appendToCell('foot', 'hf_action', HiroFriends.localeManager.getMsg('version')+' ' + VERSION.toFixed(2));
				if('https://gr1.the-west.gr' == Game.gameURL || 'https://gr8.the-west.gr' == Game.gameURL || 'https://gr14.the-west.gr' == Game.gameURL) hiroTable.appendToCell('foot', 'hf_last', 'by <a href="javascript:void(PlayerProfileWindow.open(92184));">'+scriptAuthor+'</a>');
				else if('https://zz1.beta.the-west.net' == Game.gameURL) hiroTable.appendToCell('foot', 'hf_last', 'by <a href="javascript:void(PlayerProfileWindow.open(16866));">'+scriptAuthor+'</a>');
				else hiroTable.appendToCell('foot', 'hf_last', 'by '+scriptAuthor);
				if(HiroFriends.friendManager.pendingInvitations) hiroTable.appendToCell('foot', 'hf_delete', '<a href="javascript:void(FriendslistWindow.open(\'openrequests\'));"><img style="width:16px; height: 16px;" title="'+HiroFriends.friendManager.pendingInvitationsMsg()+'" src="'+HiroFriends.guiManager.cdnBase+'/images/icons/friends.png" alt="add" /></a>');
				if(HiroFriends.logManager.loaded) hiroTable.appendToCell('foot', 'hf_freq', $('<a>'+HiroFriends.localeManager.getMsg('exporter')+'</a>').click(function() {
					HiroFriends.logManager.entries.sort(function(a,b) { return a.date - b.date; });
					var tsv_friends = "id\t"+HiroFriends.localeManager.getMsg('name')+"\t"+HiroFriends.localeManager.getMsg('received')+"\t"+HiroFriends.localeManager.getMsg('youSent')+"\r\n";
					$.each(HiroFriends.logManager.friendLog, function(key,val) { tsv_friends += key+"\t"+val.name+"\t"+val.total+"\t"+20*val.timesSent+"\r\n"; });
					new west.gui.Dialog(HiroFriends.localeManager.getMsg('exporter'),'<b>'+HiroFriends.localeManager.getMsg('friends')+'</b> (<a download="TW Friends - '+HiroFriends.eventManager.eventName+' - '+ Game.worldName+' - '+Character.name+' - '+HiroFriends.localeManager.getMsg('friends')+' - '+Date.now()+'.tsv" href="data:text/tab-separated-values,'+encodeURI(tsv_friends)+'">TSV</a>):<br /><textarea cols="60" rows="8" style="width: 100%; height: 100px;">' + JSON.stringify(HiroFriends.logManager.friendLog) + '</textarea><br /><b>'+HiroFriends.localeManager.getMsg('everything')+'</b>:<br /><textarea cols="60" rows="8" style="width: 100%; height: 100px;">' + JSON.stringify(HiroFriends.logManager.entries) + '</textarea>').setModal(true,true,{bg:HiroFriends.guiManager.cdnBase+'/images/curtain_bg.png',opacity:0.7}).addButton("ok").show();
					return false;
				}) );
				return hiroTable;
			},
			buildWindow: function(sort) {
				this.calcFriends();
				if(this.divMain) this.divMain.remove();
				this.divMain = $('<div class="hiro_friends_maindiv" />');
				this.divTable = $('<div />');
				if(!this.friends.length) $('<h1 style="text-align: center; color: #990000; margin-bottom: 80px;">'+HiroFriends.localeManager.getMsg('noFriends')+'</h1>').appendTo(this.divTable);
				else {
					this.table = this.buildTable(sort);
					this.table.appendTo(this.divTable);
				}
				this.divTable.appendTo(this.divMain);
				if(HiroFriends.logManager.loaded || HiroFriends.inventoryManager.generatorsInventory.length) {
					var stats = this.buildStats();
					$(stats).appendTo(this.divMain);
				}
				this.gameWindow.hideLoader();
				this.scrollPane.appendContent(this.divMain);
				this.gameWindow.appendToContentPane(this.scrollPane.getMainDiv());
				this.loaded = true;
				EventHandler.listen('window_closed_'+this.gameWindow.getId(), this.onClose, this);
			},
			calcFriends: function() {
				var friends = [], now = Date.now()/1e3;
				$.each(HiroFriends.friendManager.friends, function(playerId, val) {
					var playerFreq = Number.MAX_VALUE, playerFirst = 0, playerLast = 0, playerTimes = 0, recv = 0, sent = 0;
					if(undefined !== HiroFriends.logManager.friendLog[playerId]) {
						recv = HiroFriends.logManager.friendLog[playerId].total;
						sent = 20*HiroFriends.logManager.friendLog[playerId].timesSent;
						playerTimes = HiroFriends.logManager.friendLog[playerId].datesRecv.length;
						playerFirst = Math.min.apply(null, HiroFriends.logManager.friendLog[playerId].datesRecv);
						playerLast = Math.max.apply(null, HiroFriends.logManager.friendLog[playerId].datesRecv);
						if(!playerTimes) playerFreq = Number.MAX_VALUE;
						else if(playerTimes == 1) playerFreq = now - playerLast;
						else if(now > playerLast + HiroFriends.eventManager.eventInfo.cooldown) playerFreq = (now - playerFirst) / playerTimes;
						else playerFreq = (playerLast - playerFirst) / (playerTimes - 1);
					}
					friends.push({ id: playerId, name: val.name, activation_time: val.activation_time, recv: recv, sent: sent, last: playerLast, freq: playerFreq });
				});
				this.friends = friends;
			},
			createLink: function(playerId) {
				return $('<a title="'+HiroFriends.eventManager.eventInfo.label+'">'+HiroFriends.eventManager.eventInfo.label+'</a>').click(function(e) {
					var instance = $(this);
					e.preventDefault();
					instance.parent().parent().remove();	/* Should be after the call, but never mind :) */
					Ajax.remoteCall("friendsbar", "event", { player_id: playerId, event: HiroFriends.eventManager.eventName }, function(response) {
						if(response.error) return MessageError(response.msg).show();
						// MessageSuccess(response.msg).show();
						HiroFriends.friendManager.friends[playerId].activation_time = Date.now()/1e3;
						if(HiroFriends.friendManager.canSend) -- HiroFriends.friendManager.canSend;
						HiroFriends.guiManager.updateCounters(HiroFriends.friendManager.canSend, HiroFriends.friendManager.totalFriends);
						if(null !== WestUi.FriendsBar.friendsBarUi && undefined !== WestUi.FriendsBar.friendsBarUi.friendsBar.eventActivations[playerId])
							WestUi.FriendsBar.friendsBarUi.friendsBar.eventActivations[playerId][HiroFriends.eventManager.eventName] = response.activationTime;
					});
					return false;
				});
			},
			onClose: function() {
				this.loaded = false;
				this.friends = [];
				if(this.divTable) this.divTable.remove();
				if(this.divMain) this.divMain.remove();
			},
			onReload: function() {
				this.friends = [];
				if(this.divTable) this.divTable.remove();
				if(this.divMain) this.divMain.remove();
				this.fill();
			},
			open: function() {
				this.gameWindow = wman.open("HiroFriends_"+HiroFriends.eventManager.eventName, null, "twhf_window").setMiniTitle(scriptName).setTitle(HiroFriends.eventManager.eventInfo.label).center();
				this.fill();
				this.gameWindow.addEventListener(TWE('WINDOW_RELOAD'), this.onReload, this);
			},
			fill: function() {
				this.gameWindow.showLoader();
				if(this.scrollPane) this.scrollPane.divMain.remove();
				else this.scrollPane = new west.gui.Scrollpane();
				if(!WestUi.FriendsBar.hidden) WestUi.FriendsBar.toggle();
				$.when( HiroFriends.logManager.fetch() , HiroFriends.friendManager.getPendingInvitations() ).done(function() {
					HiroFriends.windowManager.buildWindow('time');
				});
			},
			sortTable: function(sort) {
				var that = this;
				HiroFriends.logManager.fetch().done(function() {
					var newDiv = $('<div />');
					var newTable = that.buildTable(sort).appendTo(newDiv);
					newTable.appendTo(newDiv);
					that.divTable.replaceWith(newDiv);
					that.divTable = newDiv;
					that.table = newTable;
				});
			},
			sortByName: function(a, b) { return a.name.toLowerCase().localeCompare(b.name.toLowerCase()); },
			sortByRecv: function(a, b) { return b.recv - a.recv; },
			sortBySent: function(a, b) { return b.sent - a.sent; },
			sortByTime: function(a, b) { return a.activation_time - b.activation_time; },
			sortByFreq: function(a, b) { return a.freq - b.freq; },
			sortByLast: function(a, b) { return b.last - a.last; },
		},
		localeManager: {
			localeDefault: 'en_US',
			localeScript: 'en_US',
			getMsg: function(msg) {
				if(undefined !== this.languages[this.localeScript][msg]) return this.languages[this.localeScript][msg];
				if(undefined !== this.languages[this.localeDefault][msg]) return this.languages[this.localeDefault][msg];
				return '';
			},
			checkLanguages: function() {
				var langs = Object.keys(this.languages), messages = Object.keys(this.languages[this.localeDefault]), that = this;
				$.each(messages, function(i, msg) {
					$.each(langs, function(j, lang) {
						if(!that.languages[lang].hasOwnProperty(msg)) console.log('Missing '+lang+'.'+msg);
						else if(typeof that.languages[that.localeDefault][msg] == "object") {
							$.each(Object.keys(that.languages[that.localeDefault][msg]), function(k, msg2) {
								if(!that.languages[lang][msg].hasOwnProperty(msg2)) console.log('Missing '+lang+'.'+msg+'.'+msg2);
							});
						}
					});
				});
				$.each(langs, function(i, lang) {
					$.each(Object.keys(that.languages[lang]), function(j, msg) {
						if(!messages.includes(msg)) console.log('Obsolete message '+lang+'.'+msg);
						else if(typeof that.languages[lang][msg] == "object") {
							$.each(Object.keys(that.languages[lang][msg]), function(j, msg2) {
								if(!that.languages[that.localeDefault][msg].hasOwnProperty(msg2)) console.log('Obsolete message '+lang+'.'+msg+'.'+msg2);
							});
						}
					});
				});
			},
			setLocale: function(localeSelected) {
				this.localeScript = (undefined !== this.languages[localeSelected]) ? localeSelected : this.localeDefault;
			},
			languages: {
				cs_CZ: {
					description: '<h1>Správa Přátel pro The West Eventy</h1><p style="margin: 8pt;">Neklikej moc rychle, vyhneš se tím smůle :)</p><p style="margin: 8pt;">Podporované Eventy:</p><ul style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;"><li>Valentýn</li><li>Velikonoce</li><li>Den Nezávislosti</li><li>Oktoberfest</li><li>Dny mrtvých</li></ul><p style="margin: 8pt;"><a target="_blank" href="https://greasyfork.org/scripts/2992-tw-friends/feedback">Feedback</a>: Reportnutí bugu, Napády, Překlad (Angličtina).</p><p style="margin: 8pt;"><b>Credits</b>: '+scriptCredits+'</p>',
					version: 'verze',
					version_checkFailed: 'Nelze oveřit aktualizace',
					version_checkManual: 'Zkontroluj ručně',
					version_ok: 'Máš aktualní verzi',
					version_upgrade: 'Nová verze je dostupní. Chceš ji nyní stáhnout?',
					refresh: 'Refresh',
					availFriends: 'Počet přátel, kterým můžeš poslat',
					totalFriends: 'Počet přátel',
					pendingInvitation: 'Jedna nevyřízena pozvánka',
					pendingInvitations: 'nevyřízených pozvánek',
					noFriends: 'Žádní přátelé :(',
					name: 'Jméno',
					received: 'Obdrženo',
					lastReceived: 'Naposledy obdrženo',
					neverReceived: 'Nikdy',
					frequency: 'Frekvence',
					removeFriend: 'Odstranit přítele',
					removeConfirm: 'Vážne chceš odstranit tohohle přítele ze zeznamu?',
					removeSuccess: 'Přítel odstraněn ze zeznamu.',
					removeFailed: 'Přítel nemůže být odstraněn',
					exporter: 'Export',
					everything: 'Všechno',
					stats: 'Štatistiky',
					since: 'od',
					perDay: 'den',
					collected: 'Sesbíráno',
					youSent: 'Posláno',
					friends: 'Přátelé',
					used: 'Použito',
					statDetails: {
						admin: 'Zásah Admina',
						adventures: 'Dobrodružství',
						bribe: 'Úplatky',
						construction: 'Výstavba',
						duels: 'Duely',
						duelist25: 'Van Cliff',
						duelist150: 'Brinson',
						duelist800: 'Westwood',
						fortBattles: 'Bitvy',
						itemUse: 'Použité předměty',
						jobs: 'Práce',
						npcDuels: 'Duely s Bandity',
						premium: 'Nuggety',
						quests: 'Úkoly',
						selfDrop: 'Odměna',
						timer: 'Zkrácený čas',
						other: 'Ostatní',
					},
					inventory: 'Inventář',
					wofCat: [ 'Velice časté', 'Časté', 'Vzácné', 'Velice vzácné' ],
					wofState: {
						Easter: [ 'Waiting for the bandit to become available', 'Not enough eggs to challenge the bandit', 'Enough eggs to challenge the bandit', 'Enough eggs to challenge the bandit and bribe!' ],
						Independence: [ 'Construction in progress', 'Not enough fireworks to start the construction', 'Enough fireworks to start the construction', 'Collect Reward!' ],
						Octoberfest: [ 'Čekání na servírování', 'Nedostatek preclíků na zaplacení porce', 'Dostatek preclíků na zaplacení porce', 'Dostatek preclíků na zaplacení porce a podplacení servírky' ]
					},
					nextYear: 'Další rok',
					theEnd: 'Konec',
				},
				de_DE: {
					description: '<h1>Freundschaftsmanagement für The West Events</h1><p style="margin: 8pt;">Klicken Sie nicht zu schnell, um zu vermeiden, dass das Schicksal nicht gut mit Ihnen gemeint ist :)</p><p style="margin: 8pt;">Events Unterstützt:</p><ul style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;"><li>St. Valentinstag</li><li>Ostern</li><li>Unabhängigkeitstag</li><li>Oktoberfest</li><li>Tag der Toten</li></ul><p style="margin: 8pt;"><a target="_blank" href="https://greasyfork.org/scripts/2992-tw-friends/feedback">Rückmeldungen</a>: Bug Reports, Ideen, Übersetzungen.</p><p style="margin: 8pt;"><b>Kredite</b>: '+scriptCredits+'</p>',
					version: 'Version',
					version_checkFailed: 'Kann nicht nach Updates suchen',
					version_checkManual: 'Manuell prüfen',
					version_ok: 'Sie haben bereits die neueste Version',
					version_upgrade: 'Eine neue Version ist verfügbar. Möchten Sie jetzt eine Aktualisierung durchführen?',
					refresh: 'Aktualisieren',
					availFriends: 'Anzahl der Freunde, die Sie jetzt senden können',
					totalFriends: 'Anzahl Freunde',
					pendingInvitation: 'Eine ausstehende Einladung',
					pendingInvitations: 'ausstehende Einladungen',
					noFriends: 'Keine Freunde',
					name: 'Name',
					received: 'Empfangen',
					lastReceived: 'Letztes Mal',
					neverReceived: 'Nie',
					frequency: 'Frequenz',
					removeFriend: 'Freund entfernen',
					removeConfirm: 'Möchtest du diesen Spieler wirklich aus der Liste löschen?',
					removeSuccess: 'Freund von Liste entfernt.',
					removeFailed: 'Freund konnte nicht entfernt werden',
					exporter: 'Exportieren',
					everything: 'Alles',
					stats: 'Statistiken',
					since: 'seit',
					perDay: 'Tag',
					collected: 'Gesammelt',
					youSent: 'Gesendet',
					friends: 'Freunde',
					used: 'Verbraucht',
					statDetails: {
						admin: 'Admin-Intervention',
						adventures: 'Abenteuer',
						bribe: 'Bestechen',
						construction: 'Ausbau',
						duels: 'Duelle',
						duelist25: 'Van Cliff',
						duelist150: 'Brinson',
						duelist800: 'Westwood',
						fortBattles: 'Fortkämpfe',
						itemUse: 'Gegenstand verbrauchen',
						jobs: 'Arbeiten',
						npcDuels: 'Duelle gegen Banditen',
						premium: 'Nuggets',
						quests: 'Quests',
						selfDrop: 'Belohnung',
						timer: 'Servicezeit verkürzen',
						other: 'Andere',
					},
					inventory: 'Inventar',
					wofCat: [ 'Sehr Häufig', 'Häufig', 'Selten', 'Äußerst Selten' ],
					wofState: {
						Easter: [ 'Warten darauf, dass der Bandit verfügbar wird', 'Nicht genug Eier, um den Banditen herauszufordern', 'Genug Eier, um den Banditen herauszufordern', 'Genug Eier, um den Banditen herauszufordern und zu bestechen!' ],
						Independence: [ 'Der Bau ist im Gange', 'Nicht genug Feuerwerk, um den Bau zu beginnen', 'Genug Feuerwerk, um mit dem Bau zu beginnen', 'Belohnung sammeln!' ],
						Octoberfest: [ 'Warten auf das nächste Gericht serviert werden', 'Nicht genug Brezeln, um eine Portion zu bezahlen', 'Genug Brezeln, um eine Portion zu bezahlen', 'Genug Brezeln, um eine Portion zu bezahlen und der Kellner zu bestechen!' ]
					},
					nextYear: 'Nächstes Jahr',
					theEnd: 'Das Ende',
				},
				el_GR: {
					description: '<h1>Διαχείριση Φίλων για τις Εκδηλώσεις του The West</h1><p style="margin: 8pt;">Μην κλικάρετε πολύ γρήγορα, για να αποφύγετε ένα σερί κακής τύχης :)</p><p style="margin: 8pt;">Υποστηριζόμενες Εκδηλώσεις:</p><ul style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;"><li>Άγιος Βαλεντίνος</li><li>Πάσχα</li><li>Οκτόμπερφεστ</li><li>Ημέρα Ανεξαρτησίας</li><li>Ημέρα των Νεκρών</li></ul><p style="margin: 8pt;"><a target="_blank" href="https://forum.the-west.gr/showthread.php?t=8029">Συζήτηση στο Φόρουμ</a> | <a target="_blank" href="https://greasyfork.org/scripts/2992-tw-friends/feedback">Feedback</a>: Αναφορά Bugs, Ιδέες, Μεταφράσεις.</p><p style="margin: 8pt;"><b>Ευχαριστίες</b>: '+scriptCredits+'</p>',
					version: 'έκδοση',
					version_checkFailed: 'Ο αυτόματος έλεγχος για ενημερώσεις απέτυχε',
					version_checkManual: 'Μη αυτόματος έλεγχος',
					version_ok: 'Έχεις ήδη την τελευταία έκδοση',
					version_upgrade: 'Μια νέα έκδοση είναι διαθέσιμη. Θες να την εγκαταστήσεις;',
					refresh: 'Ανανέωση',
					availFriends: 'Αριθμός Φιλων στους οποίους μπορείς να στείλεις τώρα',
					totalFriends: 'Αριθμός Φίλων',
					pendingInvitation: 'Μία εκκρεμής πρόσκληση',
					pendingInvitations: 'εκκρεμείς πρoσκλήσεις',
					noFriends: 'Δεν έχεις φίλους',
					name: 'Όνομα',
					received: 'Έλαβες',
					lastReceived: 'Τελευταία λήψη',
					neverReceived: 'Ποτέ',
					frequency: 'Συχνότητα',
					removeFriend: 'Αφαίρεση φίλου',
					removeConfirm: 'Θέλεις πραγματικά να διαγράψεις αυτόν τον παίχτη από τη λίστα;',
					removeSuccess: 'Ο φίλος αφαιρέθηκε από τη λίστα.',
					removeFailed: 'Ο φίλος δεν μπόρεσε να αφαιρεθεί',
					exporter: 'Εξαγωγή',
					everything: 'Όλα',
					stats: 'Στατιστικά',
					since: 'από',
					perDay: 'μέρα',
					collected: 'Έχεις συλλέξει',
					youSent: 'Έστειλες',
					friends: 'Φίλοι',
					used: 'Έχεις καταναλώσει',
					statDetails: {
						admin: 'Παρέμβαση Διαχειριστών',
						adventures: 'Περιπέτειες',
						bribe: 'Δωροδοκίες',
						construction: 'Χτίσιμο',
						duels: 'Μονομαχίες',
						duelist25: 'Van Cliff',
						duelist150: 'Brinson',
						duelist800: 'Westwood',
						fortBattles: 'Μάχες Οχυρών',
						itemUse: 'Χρήση Αντικειμένων',
						jobs: 'Εργασίες',
						npcDuels: 'Μονομαχίες με Ληστές',
						premium: 'Χρήση Σβόλων',
						quests: 'Αποστολές',
						selfDrop: 'Ανταμοιβή',
						timer: 'Μείωση Χρόνου',
						other: 'Άλλα',
					},
					inventory: 'Αποθέματα',
					wofCat: [ 'Συνηθισμένα', 'Ασυνήθιστα', 'Σπάνια', 'Πολύ Σπάνια' ],
					wofState: {
						Easter: [ 'Περιμένεις να ετοιμαστεί ο ληστής', 'Δεν διαθέτεις αρκετά αυγά', 'Διαθέτεις αρκετά αυγά για να προκαλέσεις το ληστή', 'Διαθέτεις αρκετά αυγά για να προκαλέσεις το ληστή και να δωροδοκήσεις!' ],
						Independence: [ 'Κατασκευή σε εξέλιξη', 'Δεν διαθέτεις αρκετά πυροτεχνήματα για να ξεκινήσεις την κατασκευή', 'Διαθέτεις αρκετά πυροτεχνήματα για να ξεκινήσεις την κατασκευή', 'Συλλογή Ανταμοιβής!' ],
						Octoberfest: [ 'Περιμένεις να σερβιριστεί το επόμενο πιάτο', 'Δεν διαθέτεις αρκετά πρέτσελ', 'Διαθέτεις αρκετά πρέτσελ για να φας', 'Διαθέτεις αρκετά πρέτσελ για να φας και να δωροδοκήσεις!' ]
					},
					nextYear: 'Του χρόνου',
					theEnd: 'Τετέλεσται',
				},
				en_US: {
					description: '<h1>Friend Management for The West Events</h1><p style="margin: 8pt;">Don&#039;t click too fast, to avoid a streak of bad luck upon you :)</p><p style="margin: 8pt;">Supported Events:</p><ul style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;"><li>Valentine&#039;s Day</li><li>Easter</li><li>Independence Day</li><li>Oktoberfest</li><li>Day of the Dead</li></ul><p style="margin: 8pt;"><a target="_blank" href="https://greasyfork.org/scripts/2992-tw-friends/feedback">Feedback</a>: Bug Reports, Ideas, Translations (in English).</p><p style="margin: 8pt;"><b>Credits</b>: '+scriptCredits+'</p>',
					version: 'version',
					version_checkFailed: 'Unable to check for updates',
					version_checkManual: 'Check manually',
					version_ok: 'You already have the latest version',
					version_upgrade: 'A new version is available. Do you want to upgrade now?',
					refresh: 'Refresh',
					availFriends: 'Number of Friends you can send now',
					totalFriends: 'Number of Friends',
					pendingInvitation: 'One pending invitation',
					pendingInvitations: 'pending invitations',
					noFriends: 'No Friends',
					name: 'Name',
					received: 'Received',
					lastReceived: 'Last Received',
					neverReceived: 'Never',
					frequency: 'Frequency',
					removeFriend: 'Remove friend',
					removeConfirm: 'Do you really want to delete this player from the list?',
					removeSuccess: 'Friend removed from your list.',
					removeFailed: 'Friend could not be removed',
					exporter: 'Export',
					everything: 'Everything',
					stats: 'Stats',
					since: 'since',
					perDay: 'day',
					collected: 'Collected',
					youSent: 'Sent',
					friends: 'Friends',
					used: 'Spent',
					statDetails: {
						admin: 'Admin Intervention',
						adventures: 'Adventures',
						bribe: 'Bribe',
						construction: 'Construction',
						duels: 'Duels',
						duelist25: 'Van Cliff',
						duelist150: 'Brinson',
						duelist800: 'Westwood',
						fortBattles: 'Fort Battles',
						itemUse: 'Item Use',
						jobs: 'Jobs',
						npcDuels: 'Bandit Duels',
						premium: 'Premium Usage',
						quests: 'Quests',
						selfDrop: 'Recompense',
						timer: 'Shorten service time',
						other: 'Other',
					},
					inventory: 'Inventory',
					wofCat: [ 'Common', 'Uncommon', 'Rare', 'Very Rare' ],
					wofState: {
						Easter: [ 'Waiting for the bandit to become available', 'Not enough eggs to challenge the bandit', 'Enough eggs to challenge the bandit', 'Enough eggs to challenge the bandit and bribe!' ],
						Independence: [ 'Construction in progress', 'Not enough fireworks to start the construction', 'Enough fireworks to start the construction', 'Collect Reward!' ],
						Octoberfest: [ 'Waiting for the next dish to be served', 'Not enough pretzels to pay for a serving', 'Enough pretzels to pay for a serving', 'Enough pretzels to pay for a serving and bribe the waiting staff!' ]
					},
					nextYear: 'Next Year',
					theEnd: 'The End',
				},
				es_ES: {
					description: '<h1>Gestión de Amigos para Eventos de The West</h1><p style="margin: 8pt;">No haga clic demasiado rápido, para evitar una racha de mala suerte :)</p><p style="margin: 8pt;">Eventos soportados:</p><ul style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;"><li>Día de San Valentín</li><li>Pascua</li><li>Día de la Independencia</li><li>Oktoberfest</li><li>Día de los Muertos</li></ul><p style="margin: 8pt;"><a target="_blank" href="https://greasyfork.org/scripts/2992-tw-friends/feedback">Comentarios</a>: Bug Reports, Ideas, Translations (in English).</p><p style="margin: 8pt;"><b>Créditos</b>: '+scriptCredits+'</p>',
					version: 'versión',
					version_checkFailed: 'No se puede comprobar actualizaciones',
					version_checkManual: 'Compruebe manualmente',
					version_ok: 'Ya tienes la última versión',
					version_upgrade: 'Una nueva versión está disponible. ¿Quieres instalarla ahora?',
					refresh: 'Actualizar',
					availFriends: 'Número de Amigos que se puede enviar ahora',
					totalFriends: 'Número de Amigos',
					pendingInvitation: 'Una invitación pendiente',
					pendingInvitations: 'invitaciones pendientes',
					noFriends: 'Sin Amigos',
					name: 'Nombre',
					received: 'Recibidos',
					lastReceived: 'Ultima vez',
					neverReceived: 'Jamás',
					frequency: 'Frecuencia',
					removeFriend: 'Remover amigo',
					removeConfirm: '¿Estas seguro que quieres eliminar a este jugador de tu lista?',
					removeSuccess: 'Amigo removido de tu lista',
					removeFailed: 'El amigo no ha podido ser eliminado',
					exporter: 'Exportar',
					everything: 'Todo',
					stats: 'Estadísticas',
					since: 'desde',
					perDay: 'día',
					collected: 'Conseguidos',
					youSent: 'Enviados',
					friends: 'Amigos',
					used: 'Usados',
					statDetails: {
						admin: 'Intervención de los administradores',
						adventures: 'Aventuras',
						bribe: 'Soborno',
						construction: 'Ampliación',
						duels: 'Duelos',
						duelist25: 'Van Cliff',
						duelist150: 'Brinson',
						duelist800: 'Westwood',
						fortBattles: 'Batallas de fuertes',
						itemUse: 'Objetos usados',
						jobs: 'Trabajos',
						npcDuels: 'Duelos NPC',
						premium: 'Pepitas',
						quests: 'Busquedas',
						selfDrop: 'SelfDrop',
						timer: 'Reiniciar temporizadores',
						other: 'Otros',
					},
					inventory: 'Inventario',
					wofCat: [ 'Común', 'No común', 'Raro', 'Muy raro' ],
					wofState: {
						Easter: [ 'Esperando a que el bandido esté disponible', 'No tienes suficientes huevos', 'Tienes suficientes huevos para desafiar al bandido', 'Tienes suficientes huevos para desafiar al bandido y sobornar' ],
						Independence: [ 'Construcción en progreso', 'No tienes suficientes fuegos artificiales', 'Tienes suficientes fuegos artificiales para comenzar la construcción', '¡Recoger la recompensa!' ],
						Octoberfest: [ 'Esperando para ser servido', 'No tienes suficientes pretzels', 'Tienes suficientes pretzels para pagar', 'Tienes suficientes pretzels para pagar y sobornar' ]
					},
					nextYear: 'El próximo año',
					theEnd: 'Final',
				},
				fr_FR: {
					description: '<h1>Gestion des Amis pour les Evénements de The West</h1><p style="margin: 8pt;">Ne cliquez pas trop vite, pour éviter une série de malchance sur vous :)</p><p style="margin: 8pt;">Evénements:</p><ul style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;"><li>Saint Valentin</li><li>Pâques</li><li>Jour De L&#039;Indépendance</li><li>Oktoberfest</li><li>Jour des Morts</li></ul><p style="margin: 8pt;"><a target="_blank" href="https://greasyfork.org/scripts/2992-tw-friends/feedback">Commentaires</a>: Bug Reports, Ideas, Translations (in English).</p><p style="margin: 8pt;"><b>Credits</b>: '+scriptCredits+'</p>',
					version: 'version',
					version_checkFailed: 'Impossible de vérifier les mises à jour',
					version_checkManual: 'Vérifier manuellement',
					version_ok: 'Tu as déjà la dernière version',
					version_upgrade: 'Une nouvelle version est disponible. Installer maintenant?',
					refresh: 'Rafraîchir',
					availFriends: 'Nombre des amis que tu peux envoyer maintenant',
					totalFriends: 'Nombre des Amis',
					pendingInvitation: 'Une invitation en attente',
					pendingInvitations: 'invitations en attentes',
					noFriends: "Pas d'Amis",
					name: 'Nom',
					received: 'Tu as reçu',
					lastReceived: 'Dernière fois',
					neverReceived: 'Jamais',
					frequency: 'Fréquence',
					removeFriend: "Supprimer l'ami(e)",
					removeConfirm: 'Veux-tu vraiment supprimer ce joueur de la liste?',
					removeSuccess: 'Ami supprimé de la liste',
					removeFailed: "L'ami n'a pas pu être supprimé",
					exporter: 'Exportation',
					everything: 'Tout',
					stats: 'Statistiques',
					since: 'à partir de',
					perDay: 'jour',
					collected: 'Collectés',
					youSent: 'Tu as envoyé',
					friends: 'Amis',
					used: 'Utilisés',
					statDetails: {
						admin: 'Intervention des administrateurs',
						adventures: 'Aventures',
						bribe: 'Soudoyer',
						construction: 'Agrandissement',
						duels: 'Duels',
						duelist25: 'Van Cliff',
						duelist150: 'Brinson',
						duelist800: 'Westwood',
						fortBattles: 'Batailles',
						itemUse: 'Objets utilisés',
						jobs: 'Travaux',
						npcDuels: 'Duels PNJ',
						premium: 'Pépites',
						quests: 'Quêtes',
						selfDrop: 'Récompense',
						timer: 'Réduire la durée de construction',
						other: 'Autres',
					},
					inventory: 'Inventaire',
					wofCat: [ 'Commun', 'Non commun', 'Rare', 'Très rare' ],
					wofState: {
						Easter: [ "En attendant que le bandit devienne disponible", "Tu n'as pas assez d'oeufs", "Tu as assez d'oeufs pour défier le bandit", "Tu as assez d'oeufs pour défier le bandit et soudoyer!" ],
						Independence: [ "Construction en cours", "Tu n'as pas assez de feux d'artifice", "Tu as assez de feux d'artifice pour commencer la construction", 'Récoltez la récompense!' ],
						Octoberfest: [ "En attendant d'être servi", "Tu n'as pas assez de Bretzels", 'Tu as assez de Bretzels pour payer', 'Tu as assez de Bretzels pour payer et soudoyer!' ]
					},
					nextYear: "L'année prochaine",
					theEnd: 'La Fin',
				},
				hu_HU: {
					description: '<h1>Barátság menedzser a The West eseményekhez</h1><p style="margin: 8pt;">Ne klikkelj túlgyorsan, nehogy valami baj érjen :)</p><p style="margin: 8pt;">Támogatott események:</p><ul style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;"><li>Valentin nap</li><li>Húsvét</li><li>Függetlenség nap</li><li>Oktoberfest</li><li>Halottak napja</li></ul><p style="margin: 8pt;"><a target="_blank" href="https://greasyfork.org/scripts/2992-tw-friends/feedback">Visszajelzés</a>: Hibák jelentése, Ötletek, Fordítások (angolul).</p><p style="margin: 8pt;"><b>Készítők</b>: '+scriptCredits+'</p>',
					version: 'verzió',
					version_checkFailed: 'Nem sikerült a frissítéseket ellenőrizni',
					version_checkManual: 'Kézi ellenőrzés',
					version_ok: 'Már megvan a legfrissebb verzió',
					version_upgrade: 'Új verzió érhető el. Szeretnél frissíteni?',
					refresh: 'Frissítés',
					availFriends: 'Ennyi barátodnak tudsz még küldeni',
					totalFriends: 'Barátaid száma',
					pendingInvitation: 'Egy függő meghívó',
					pendingInvitations: 'függő meghívók',
					noFriends: 'Nincsenek barátaid',
					name: 'Név',
					received: 'Kapott',
					lastReceived: 'Utoljára kaptál',
					neverReceived: 'Soha',
					frequency: 'Gyakoriság',
					removeFriend: 'Barát eltávolítása',
					removeConfirm: 'Biztosan szeretnéd törölni a barátodat?',
					removeSuccess: 'Barát törölve a listáról.',
					removeFailed: 'Barát nem eltávolítható',
					exporter: 'Export',
					everything: 'Minden',
					stats: 'Státusz',
					since: 'óta',
					perDay: 'nap',
					collected: 'Gyűjtött',
					youSent: 'Küldött',
					friends: 'Barátoktól',
					used: 'Elköltött',
					statDetails: {
						admin: 'Admintól',
						adventures: 'Kalandokból',
						bribe: 'Megveszteget',
						construction: 'Építésből',
						duels: 'Párbajokból',
						duelist25: 'Van Cliff',
						duelist150: 'Brinson',
						duelist800: 'Westwood',
						fortBattles: 'Erődharcból',
						itemUse: 'Felhasznált tárgyakból',
						jobs: 'Munkákból',
						npcDuels: 'Bandita párbajokból',
						premium: 'Prémium használatból',
						quests: 'Küldetésekből',
						selfDrop: 'Jutalmakból',
						timer: 'Kiszolgáló idő rövidítése',
						other: 'Egyebekből',
					},
					inventory: 'Táska',
					wofCat: [ 'Gyakori', 'Nem gyakori', 'Ritka', 'Nagyon ritka' ],
					wofState: {
						Easter: [ 'Várakozás a bantitára, hogy elérhető legyen', 'Nincs elég tojásod, hogy kihívd a banditát', 'Elég tojásod van kihívni a banditát', 'Elég tojásod van kihívni a banditát és, hogy megvesztegesd!' ],
						Independence: [ 'Építkezés folyamatban van', 'Nincs elég tűzijátékod, hogy építkezz', 'Elegendő tűzijátékod van az építkezéshez', 'Díj begyűjtése!' ],
						Octoberfest: [ 'Várakozás a következő tálalásra', 'Nincs elég pereced, hogy fizess a szolgáltatásért', 'Elég pereced van, hogy fizess a szolgáltatásért', 'Elég pereced van, hogy fizess a szolgáltatásért és, hogy lefizesd a felszolgáló személyzetet!' ]
					},
					nextYear: 'Következő év',
					theEnd: 'Vége',
				},
				it_IT: {
					description: '<h1>Gestione amici per gli eventi The West</h1><p style="margin: 8pt;">Non clickare tropo veloce, per non essere bloccato :)</p><p style="margin: 8pt;">Eventi supportati:</p><ul style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;"><li>Giorno San Valentino</li><li>Pasqua</li><li>Giorno dell&#039;Independenza</li><li>Oktoberfest</li><li>Il giorno dei morti</li></ul><p style="margin: 8pt;"><a target="_blank" href="https://greasyfork.org/scripts/2992-tw-friends/feedback">Feedback</a>: Bug Report, Ideee, Traduzioni (in English).</p><p style="margin: 8pt;"><b>Credits</b>: '+scriptCredits+'</p>',
					version: 'versione',
					version_checkFailed: 'Impossibile verificare gli aggiornamenti',
					version_checkManual: 'Controllare manualmente',
					version_ok: "Hai già l'ultima versione",
					version_upgrade: 'Nuova versione disponibile. Vuoi aggiornare adesso?',
					refresh: 'Aggiorna',
					availFriends: 'Totale amici che puoi inviare adesso',
					totalFriends: 'Amici totale',
					pendingInvitation: 'Invito in attesa',
					pendingInvitations: 'inviti in attesa',
					noFriends: 'Non ci sono amici',
					name: 'Nome',
					received: 'Ricevuti',
					lastReceived: 'Ultima volta',
					neverReceived: 'Mai',
					frequency: 'Freqvenza',
					removeFriend: 'Rimuovi amico',
					removeConfirm: 'Sei sicuro di voler cancellare l&#039;amico dalla lista?',
					removeSuccess: 'Amico rimosso dalla tua lista.',
					removeFailed: 'Impossibile rimuovere l&#039;amico',
					exporter: 'Esporta',
					everything: 'Tutto',
					stats: 'Statistiche',
					since: 'dal',
					perDay: 'giorno',
					collected: 'Collezionate',
					youSent: 'Inviati',
					friends: 'Amici',
					used: 'Usato',
					statDetails: {
						admin: 'Interventi amministrativi',
						adventures: 'Avventure',
						bribe: 'Corruzione',
						construction: 'Costruzione',
						duels: 'Duelli',
						duelist25: 'Van Cliff',
						duelist150: 'Brinson',
						duelist800: 'Westwood',
						fortBattles: 'Battaglie forti',
						itemUse: 'Oggetti usati',
						jobs: 'Lavori',
						npcDuels: 'Duelli con NPC',
						premium: 'Pepite',
						quests: 'Missioni',
						selfDrop: 'Ricompensa',
						timer: 'Reseta Timer',
						other: 'Altro',
					},
					inventory: 'Inventario',
					wofCat: [ 'Molto comune', 'Comune', 'Raro', 'Molto raro' ],
					wofState: {
						Easter: [ 'Aspettando che il bandito diventi disponibile', 'Non hai abbastanza uova', 'Hai abbastanza uova per sfidare il bandito', 'Hai abbastanza uova per sfidare il bandito e corrompere' ],
						Independence: [ 'Lavori in corso', "Non hai abbastanza fuochi d'artificio", "Hai abbastanza fuochi d'artificio per iniziare la costruzione", 'Raccogli ricompensa!' ],
						Octoberfest: [ 'In attesa di essere servita', 'Non hai abbastanza pretzel', 'Hai abbastanza pretzel per pagare', 'Hai abbastanza pretzel per pagare e corrompere' ]
					},
					nextYear: 'Anno prossimo',
					theEnd: 'Fine',
				},
				pl_PL: {
					description: '<h1>Menadżer zarządzania Przyjaciółmi podczas eventów The West</h1><p style="margin: 8pt;">Nie klikaj zbyt szybko, bo to będzie bardzo niemiłe dla Ciebie :)</p><p style="margin: 8pt;">Obsługiwane Eventy:</p><ul style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;"><li>Walentynki</li><li>Wielkanoc</li><li>Dzień Niepodległości</li><li>Oktoberfest</li><li>Dia de los Muertos</li></ul><p style="margin: 8pt;"><a target="_blank" href="https://forum.the-west.pl/showthread.php?t=60424">Forum</a> | <a target="_blank" href="https://greasyfork.org/scripts/2992-tw-friends/feedback">Opinie</a>: Zgłaszanie błędów, pomysłów, propozycji zmian (w języku angielskim).</p><p style="margin: 8pt;"><b>Uznanie dla</b>: '+scriptCredits+'</p>',
					version: 'wersja',
					version_checkFailed: 'Nie można sprawdzić aktualizacji',
					version_checkManual: 'Sprawdź ręcznie',
					version_ok: 'Masz już najnowszą wersję',
					version_upgrade: 'Dostępna jest nowa wersja. Czy chcesz dokonać aktualizacji?',
					refresh: 'Odśwież',
					availFriends: 'Liczba przyjaciół do których można wysłać prezent',
					totalFriends: 'Łączna liczba przyjaciół',
					pendingInvitation: 'jedno oczekujące zaproszenie',
					pendingInvitations: 'oczekujących zaproszeń',
					noFriends: 'Brak przyjaciół',
					name: 'Nazwa gracza',
					received: 'Otrzymano',
					lastReceived: 'Ostatni raz',
					neverReceived: 'Nigdy',
					frequency: 'Częstotliwość',
					removeFriend: 'Usuń przyjaciela',
					removeConfirm: 'Czy na pewno chcesz usunąć tego gracza z listy przyjaciół?',
					removeSuccess: 'Przyjaciel usunięty z Twojej listy.',
					removeFailed: 'Nie można usunąć przyjaciela',
					exporter: 'Eksport',
					everything: 'Wszystko',
					stats: 'Statystyka',
					since: 'od',
					perDay: 'dzień',
					collected: 'Uzbierano',
					youSent: 'Wysłano',
					friends: 'Znajomi',
					used: 'Użyto',
					statDetails: {
						admin: 'Interwencje Administratorów',
						adventures: 'Przygody',
						bribe: 'Przekup',
						construction: 'Rozbudowa',
						duels: 'Pojedynki',
						duelist25: 'Van Cliff',
						duelist150: 'Brinson',
						duelist800: 'Westwood',
						fortBattles: 'Bitwy fortowe',
						itemUse: 'Użycie przedmiotów',
						jobs: 'Prace',
						npcDuels: 'Pojedynki z NPC',
						premium: 'Bryłki',
						quests: 'Zadania',
						selfDrop: 'Nagroda',
						timer: 'Zresetuj liczniki',
						other: 'Inne',
					},
					inventory: 'Ekwipunek',
					wofCat: [ 'Bardzo powszechny', 'Powszechny', 'Rzadki', 'Bardzo rzadki' ],
					wofState: {
						Easter: [ 'Waiting for the bandit to become available', 'Not enough eggs to challenge the bandit', 'Enough eggs to challenge the bandit', 'Enough eggs to challenge the bandit and bribe!' ],
						Independence: [ 'Construction in progress', 'Not enough fireworks to start the construction', 'Enough fireworks to start the construction', 'Collect Reward!' ],
						Octoberfest: [ 'Waiting for the next dish to be served', 'Not enough pretzels to pay for a serving', 'Enough pretzels to pay for a serving', 'Enough pretzels to pay for a serving and bribe the waiting staff!' ]
					},
					nextYear: 'W przyszłym roku',
					theEnd: 'Koniec',
				},
				pt_PT: {
					description: '<h1>Gestão de amigos para eventos no The West</h1><p style="margin: 8pt;">não clique rápido demais, para evitar uma maré de azar :)</p><p style="margin: 8pt;">Eventos suportados:</p><ul style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;"><li>Dia dos namorados</li><li>Páscoa</li><li>Dia da independência</li><li>Oktoberfest</li><li>Dia de los Muertos</li></ul><p style="margin: 8pt;"><a target="_blank" href="https://greasyfork.org/scripts/2992-tw-friends/feedback">Comentários</a>: Bug Reports, Ideas, Translations (in English).</p><p style="margin: 8pt;"><b>Créditos</b>: '+scriptCredits+'</p>',
					version: 'versão',
					version_checkFailed: 'Não é possível verificar atualizações',
					version_checkManual: 'Verifique manualmente',
					version_ok: 'Você já possui a versão mais recente',
					version_upgrade: 'A nova versão está disponível. Atualize agora?',
					refresh: 'Actualizar',
					availFriends: 'Número de amigos a quem pode enviar agora',
					totalFriends: 'Número de Amigos',
					pendingInvitation: 'Um convite pendente',
					pendingInvitations: 'convites pendentes',
					noFriends: 'Sem Amigos',
					name: 'Nome',
					received: 'Recebidos',
					lastReceived: 'Última vez',
					neverReceived: 'Nunca',
					frequency: 'Freqüência',
					removeFriend: 'Remover amigo',
					removeConfirm: 'Queres mesmo remover amigo da lista ?',
					removeSuccess: 'Amigo removido da lista',
					removeFailed: 'Amigo não pode ser removido',
					exporter: 'Exportar',
					everything: 'Tudo',
					stats: 'Estatísticas',
					since: 'desde',
					perDay: 'dia',
					collected: 'Recolhidos',
					youSent: 'Enviados',
					friends: 'Amigos',
					used: 'Usados',
					statDetails: {
						admin: 'Intervenção dos administradores',
						adventures: 'Aventuras MPI',
						bribe: 'Suborno',
						construction: 'Construção',
						duels: 'Duelos',
						duelist25: 'Van Cliff',
						duelist150: 'Brinson',
						duelist800: 'Westwood',
						fortBattles: 'Batalhas de Forte',
						itemUse: 'Itens usados',
						jobs: 'Trabalhos',
						npcDuels: 'Duelos NPC',
						premium: 'Pepitas',
						quests: 'Aventuras',
						selfDrop: 'Recompensa',
						timer: 'Reiniciar temporizadores',
						other: 'Outros',
					},
					inventory: 'Inventário',
					wofCat: [ 'Comum', 'Fora do Comum', 'Raro', 'Muito Raro' ],
					wofState: {
						Easter: [ 'Waiting for the bandit to become available', 'Not enough eggs to challenge the bandit', 'Enough eggs to challenge the bandit', 'Enough eggs to challenge the bandit and bribe!' ],
						Independence: [ 'Construção em progresso', 'Não há fogos de artifício suficientes para iniciar a construção', 'Bastante fogos de artifício para iniciar a construção', 'Coletar recompensa!' ],
						Octoberfest: [ 'Esperando que o próximo prato seja servido', 'Não há pretzels suficientes para pagar uma porção', 'Basta pretzels para pagar uma porção', 'Basta pretzels para pagar por um serviço e subornar a equipe de espera', 'Basta pretzels para pagar uma porção e subornar' ]
					},
					nextYear: 'Próximo Ano',
					theEnd: 'Final',
				},
				sk_SK: {
					description: '<h1>Manažovanie Priateľov pre The West Eventy</h1><p style="margin: 8pt;">Neklikaj moc rýchlo, vyhneš sa tým smole :)</p><p style="margin: 8pt;">Podporované Eventy:</p><ul style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;"><li>Valentín</li><li>Veľká noc</li><li>Den Nezávislosti</li><li>Oktoberfest</li><li>Dni mŕtvych</li></ul><p style="margin: 8pt;"><a target="_blank" href="https://greasyfork.org/scripts/2992-tw-friends/feedback">Feedback</a>: Reportnutie bugu, Napády, Preklad (Angličtina).</p><p style="margin: 8pt;"><b>Credits</b>: '+scriptCredits+'</p>',
					version: 'verzia',
					version_checkFailed: 'Nie je možné overiť aktualizácie',
					version_checkManual: 'Skontroluj ručne',
					version_ok: 'Máš aktuálnu verziu',
					version_upgrade: 'Je dostupná nová verzia. Chceš ju teraz stiahnuť?',
					refresh: 'Refresh',
					availFriends: 'Počet priateľov, ktorým môžeš poslať',
					totalFriends: 'Počet priateľov',
					pendingInvitation: 'Jedna nevyriešená pozvánka',
					pendingInvitations: 'nevyriešených pozvánok',
					noFriends: 'Žiadny priatelia :(',
					name: 'Meno',
					received: 'Obdržané',
					lastReceived: 'Naposledy obdržané',
					neverReceived: 'Nikdy',
					frequency: 'Frekvencia',
					removeFriend: 'Odstránit priateľa',
					removeConfirm: 'Vážne chceš odstrániť tohto priatela zo zoznamu?',
					removeSuccess: 'Priateľ odstránený zo zoznamu.',
					removeFailed: 'Priateľ nemôže byť odstránený',
					exporter: 'Export',
					everything: 'Všetko',
					stats: 'Štatistiky',
					since: 'od',
					perDay: 'deň',
					collected: 'Nazbierané',
					youSent: 'Poslané',
					friends: 'Priatelia',
					used: 'Použité',
					statDetails: {
						admin: 'Zásah Admina',
						adventures: 'Dobrodružstvá',
						bribe: 'Úplatky',
						construction: 'Výstavba',
						duels: 'Duely',
						duelist25: 'Van Cliff',
						duelist150: 'Brinson',
						duelist800: 'Westwood',
						fortBattles: 'Boje',
						itemUse: 'Použité predmety',
						jobs: 'Práce',
						npcDuels: 'Duely s Banditmi',
						premium: 'Nuggety',
						quests: 'Úlohy',
						selfDrop: 'Odmena',
						timer: 'Skrátený čas',
						other: 'Ostatné',
					},
					inventory: 'Inventár',
					wofCat: [ 'Veľmi časté', 'Časté', 'Vzácne', 'Veľmi vzácne' ],
					wofState: {
						Easter: [ 'Waiting for the bandit to become available', 'Not enough eggs to challenge the bandit', 'Enough eggs to challenge the bandit', 'Enough eggs to challenge the bandit and bribe!' ],
						Independence: [ 'Construction in progress', 'Not enough fireworks to start the construction', 'Enough fireworks to start the construction', 'Collect Reward!' ],
						Octoberfest: [ 'Čakanie na servírovanie', 'Nedostatok praclíkov na zaplatenie porcie', 'Dostatok praclíkov na zaplatenie porcie', 'Dostatok praclíkov na zaplatenie porcie a podplatenie servírky' ]
					},
					nextYear: 'Ďalší rok',
					theEnd: 'Koniec',
				},
				tr_TR: {
					description: '<h1>The West Etkinlikleri İçin Arkadaş Yöneticisi</h1><p style="margin: 8pt;">Üzerinde kara bulutların dolaşmasını istemiyorsan çok hızlı tıklama :)</p><p style="margin: 8pt;">Desteklenen Etkinlikler:</p><ul style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;"><li>Sevgililer Günü</li><li>Paskalya</li><li>Bağımsızlık Günü</li><li>Ekim Festivali</li><li>Ölülerin Günü</li></ul><p style="margin: 8pt;"><a target="_blank" href="https://greasyfork.org/scripts/2992-tw-friends/feedback">Geri Bildirim</a>: Açık Raporları, Fikirler, Çeviriler (İngilizce).</p><p style="margin: 8pt;"><b>Yapımcılar</b>: '+scriptCredits+'</p>',
					version: 'versiyon',
					version_checkFailed: 'Güncellemeleri kontrol edilemiyor',
					version_checkManual: 'Elle kontrol et',
					version_ok: 'En son sürümünüz var',
					version_upgrade: 'Yeni versiyon mevcut. Şimdi yükseltmek istiyor musun?',
					refresh: 'Yenile',
					availFriends: 'Şimdi gönderebileceğin arkadaş sayısı',
					totalFriends: 'Arkadaş Sayısı',
					pendingInvitation: 'Bir davetiye bekliyor',
					pendingInvitations: 'bekleyen davetiyeler',
					noFriends: 'Arkadaş Yok',
					name: 'İsim',
					received: 'Alınan',
					lastReceived: 'Son kez',
					neverReceived: 'Asla',
					frequency: 'Sıklık',
					removeFriend: 'Arkadaşı Sil',
					removeConfirm: 'Bu oyuncuyu gerçekten listeden silmek istiyor musun?',
					removeSuccess: 'Arkadaşın listeden silindi.',
					removeFailed: 'Arkadaş silinemedi',
					exporter: 'Çıkar',
					everything: 'Her şey',
					stats: 'İstatistikler',
					since: 'başlangıç',
					perDay: 'gün',
					collected: 'Toplanan',
					youSent: 'Gönderilen',
					friends: 'Arkadaşlar',
					used: 'Kullanılan',
					statDetails: {
						admin: 'Yöneticileri Müdahale',
						adventures: 'Maceralar',
						bribe: 'Rüşvet',
						construction: 'Kurma',
						duels: 'Düellolar',
						duelist25: 'Van Cliff',
						duelist150: 'Brinson',
						duelist800: 'Westwood',
						fortBattles: 'Kale Savaşları',
						itemUse: 'Kullanılan Ürünler',
						jobs: 'Çalışmalar',
						npcDuels: 'Haydut Düelloları',
						premium: 'Altın külçeleri',
						quests: 'Görevler',
						selfDrop: 'Ödül',
						timer: 'Zamanlayıcıyı Sıfırla',
						other: 'Diğer',
					},
					inventory: 'Envanter',
					wofCat: [ 'Sıradan', 'Sıradan olmayan', 'Nadir', 'Çok nadir' ],
					wofState: {
						Easter: [ 'Waiting for the bandit to become available', 'Not enough eggs to challenge the bandit', 'Enough eggs to challenge the bandit', 'Enough eggs to challenge the bandit and bribe!' ],
						Independence: [ 'Construction in progress', 'Not enough fireworks to start the construction', 'Enough fireworks to start the construction', 'Collect Reward!' ],
						Octoberfest: [ 'Bir sonraki tabak bekleniyor', 'Bu tabağa ödeme yapmak için yeterli tuzlu kraker yok', 'Bu tabağa ödeme yapmak için yeterli tuzlu kraker var', 'Bu tabağa ödeme yapmak ve bekleyen personele rüşvet vermek için yeterli tuzlu kraker var' ]
					},
					nextYear: 'Gelecek Yıl',
					theEnd: 'Son',
				},
			},
		},
		script: {
			api: null,
			listeningSignal: 'game_config_loaded',
			loaded: false,
			supportedEvents: [ 'Hearts', 'Easter', 'Independence', 'Octoberfest', 'DayOfDead' ],
			init: function() {
				var that = this;
				if(this.loaded) return false;
				EventHandler.listen(this.listeningSignal, function() {
					that.init();
					return EventHandler.ONE_TIME_EVENT;
				});
				if(!!(Game && Game.loaded)) {
					this.loaded = true;
					HiroFriends.localeManager.setLocale(Game.locale);
					this.api = TheWestApi.register(scriptObject, scriptName, '2.04', Game.version.toString(), scriptAuthor, URL_INSTALL);
					this.api.setGui(HiroFriends.localeManager.getMsg('description'));
					HiroFriends.updateManager.init();
					$.each(Object.keys(Game.sesData), function(key, eventName) {
						if(that.supportedEvents.includes(eventName)) {
							HiroFriends.eventManager.init(eventName);
							return false;
						}
					});
				}
			},
		},
	};
	$(function() { try { HiroFriends.script.init(); } catch(x) { console.trace(x); } });
});