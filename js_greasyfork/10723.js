// ==UserScript==
// @name              TW Etkinlik Yardımcısı
// @version           1.1
// @description       Etkinlik Yardımcısı
// @author            bluebull
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
// @match              https://*.the-west.ru/game.php*
// @match              https://*.the-west.se/game.php*
// @match              https://*.the-west.sk/game.php*
// @grant             none
// @namespace https://greasyfork.org/users/12879
// @downloadURL https://update.greasyfork.org/scripts/10723/TW%20Etkinlik%20Yard%C4%B1mc%C4%B1s%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/10723/TW%20Etkinlik%20Yard%C4%B1mc%C4%B1s%C4%B1.meta.js
// ==/UserScript==

function bluebullFriendsScript(fn) {
	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.textContent = '(' + fn + ')();';
	document.body.appendChild(script);
	document.body.removeChild(script);
}
bluebullFriendsScript(function() {
	var VERSION = 0.33;
    var authotURL = "https://twitter.com/Piyon_Mmt";
	var installURL = "https://greasyfork.org/tr/scripts/10723-tw-etkinlik-yardımcısı";
	var codeURL = "https://greasyfork.org/tr/scripts/10723-tw-etkinlik-yardımcısı/code/TW%20Etkinlik%20Yardımcısı.user.js";
	var versionURL = "https://gist.githubusercontent.com/TWFriends/974718d615afe3d2c2a2/raw/version?"+Date.now();
	var scriptName = "TW Etkinlik Yardımcısı";
	var scriptAuthor = "bluebull";
	var refreshMs = 2 * 60 * 1e3;	// 2 minutes
	var enableLog = true;
	BluebullFriends = {
		api: TheWestApi.register('BleubullFriends', scriptName, '2.04', Game.version.toString(), scriptAuthor, installURL),
		version: VERSION,
		latestVersion: undefined,
		storageItem: "Bluebull.version",
		cdnBase: '',
		eventName : '',
		eventInfo : {},
		eventEndStamp : 0,
		friends : {},
		interval: false,
		locale: 'tr_TR',
		pendingInvitations: 0,
		messages: {
			tr_TR: {
				description: '<h1>The West Etkinlik Yardımcısı</h1><p style="margin: 10pt;">Çok hızlı tıklamayın, sonra sıkıntı olmasın ;)</p><p style="margin: 10pt;">Desteklediği Etkinlikler:</p><ul style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;"><li>Sevgililer Günü</li><li>Easter</li><li>Bağımsızlık Bayramı</li><li>Ölüler Günü</li></ul>',
				version: 'Sürüm',
				upgrade: 'Yeni sürüm mevcut, güncellemek ister misin?',
				refresh: 'Yenile',
				timeLeft: 'Etkinliğin bitmesine kalan zaman',
				serverTime: 'Sunucu saati',
				availFriends: 'Gönderebileceğin arkadaş sayısı',
				totalFriends: 'Toplam arkadaş sayısı',
				pendingInvitation: 'Bir davet',
				pendingInvitations: 'Tüm davetler',
				noFriends: 'Arkadaşın yok',
				name: 'İsim',
				received: 'Alınan',
				frequency: 'Bekleme süresi',
				removeFriend: 'Arkadaşı kaldır',
				removeConfirm: 'Arkadaşını kaldırmak istediğine emin misin?',
				removeSuccess: 'Arkadaşın başarıyla listeden kaldırıldı',
				removeFailed: 'Arkadaş kaldırılamadı',
				exporter: 'Kod',
				everything: 'Her şey',
				stats: 'İstatistikler',
				since: 'Son güncelleme',
				collected: 'Toplanan',
				friends: 'Arkadaşlardan',
				jobs: 'Çalışmalardan',
				fortBattles: 'Kale Savaşlarından',
				adventures: 'Maceralardan',
				duels: 'Düellolardan',
				npcDuels: 'NPC Düellolarından',
				construction: 'İnşaatlardan',
				itemUse: 'Eşya Kullanımından',
				other: 'Diğer',
				used: 'Kullanıldı',
				timerReset: 'Sayıcı sıfırlandı',
				bribe: 'Rüşvet ödendi',
				gameAction: 'Etkinlik',
				nextYear: 'Sonraki yıl',
				theEnd: 'Son',
			},
		},
		timeLeft : 0,
		total : 0,
		avail: 0,
		log: { firstLog: Date.now()/1e3, lastLog: 0, friendLog: {}, entries: [], count_friends: 0, count_job: 0, count_duel: 0, count_npc: 0, count_fort: 0, count_mpi: 0, count_build: 0, count_item: 0, count_other: 0, count_reset: 0, count_bribe: 0, count_action: 0, times_reset: 0, times_bribe: 0, received: 0, used: 0 },
		spanCounter: $("<span />", { id: "bluebull_friends_counter", style: "position: absolute; right: 5px; color: #f8c57c; font-size: 13pt; height: 25px; line-height: 25px; bottom: 0px" }),
		spanInvitations: null,
		spanTimeLeft: null,
		display: function(sort) {
			var friend_time, server_time = Game.getServerTime();
			var maindiv = $('<div class="bluebull_friends_maindiv" />');
			var friends = [];
			for(var key in this.friends) if(this.friends.hasOwnProperty(key)) friends.push({ id: key, name: this.friends[key].name, activation_time: this.friends[key].activation_time, recv: this.friends[key].recv });
			if(!friends.length) $('<h1 style="text-align: center; color: #990000; margin-bottom: 80px;">'+this.localeMsg('noFriends')+'</h1>').appendTo(maindiv);
			else {
				var bluebullTable;
				switch(sort) {
					case "name" 	:	friends.sort(this.sortByName); break;
					case "name_desc":	friends.sort(this.sortByName).reverse(); break;
					case "recv" 	:	friends.sort(this.sortByRecv); break;
					case "recv_asc"	:	friends.sort(this.sortByRecv).reverse(); break;
					case "time_asc"	:	friends.sort(this.sortByTime).reverse(); break;
					case "time"	:
					default		:	sort = "time"; friends.sort(this.sortByTime);
				}
				var thName = $('<a style="cursor: pointer;"><img src="'+this.cdnBase+'/images/icons/user.png" alt="" />&nbsp;'+this.localeMsg('name')+'</a>').click(function(){ BluebullFriends.display(sort == 'name' ? 'name_desc' : 'name'); return false; });
				var thAction = $('<a style="cursor: pointer;"><img src="'+this.cdnBase+'/images/icons/clock.png" alt="" />&nbsp;'+this.eventInfo.label+'</a>').click(function(){ bluebullFriends.display(sort == 'time' ? 'time_asc' : 'time'); return false; });
				var thRecv = enableLog ? $('<a style="cursor: pointer;" title="'+this.localeMsg('since')+' '+new Date(this.log.firstLog*1e3).toDateTimeString()+'"><img src="'+this.cdnBase+'/images/icons/watch.png" alt="" />&nbsp;'+this.localeMsg('received')+'</a>').click(function(){ BluebullFriends.display(sort == 'recv' ? 'recv_asc' : 'recv'); return false; }) : '';
				bluebullTable = new west.gui.Table().appendTo(maindiv).addColumn("hf_idx").addColumn("hf_player").addColumn("hf_action").addColumn("hf_log").addColumn("hf_delete").appendToCell("head", "hf_idx", '&nbsp;').appendToCell("head", "hf_player", thName).appendToCell("head", "hf_action", thAction).appendToCell("head","hf_log",thRecv).appendToCell("head", "hf_delete", '&nbsp;');
				var idx = 1;
				var now = Date.now()/1e3;
				$.each(friends, function(key, val) {
					var actionCell, recvCell;
					friend_time = val.activation_time + BluebullFriends.eventInfo.cooldown - server_time;
					if(friend_time > BluebullFriends.timeLeft) actionCell = '('+BluebullFriends.localeMsg('nextYear')+')';
					else if(friend_time > 0) actionCell = '('+friend_time.formatDurationBuffWay()+')';
					else {
						actionCell = $('<a style="cursor: pointer;">'+BluebullFriends.eventInfo.label+'</a>').click({ id: val.id, ev: BluebullFriends.eventName }, function(e) {
							$(this).parent().parent().remove();
							Ajax.remoteCall("friendsbar", "event", { player_id: val.id, event: BluebullFriends.eventName }, function(response) {
								if(response.error) return MessageError(response.msg).show();
								MessageSuccess(response.msg).show();
								BluebullFriends.friends[val.id].activation_time = Date.now()/1e3;
								if(BluebullFriends.avail) -- BluebullFriends.avail;
								BluebullFriends.updateCounter();
								if(WestUi.FriendsBar.friendsBarUi !== null)
									WestUi.FriendsBar.friendsBarUi.friendsBar.eventActivations[val.id][BluebullFriends.eventName] = response.activationTime;
							});
							return false;
						});
					}
					recvCell = '';
					if(enableLog) {
						if(val.recv) {
							var recv_list = '';
							BluebullFriends.log.friendLog[val.id].dates.sort(function(a, b){ return new Date(a)-new Date(b); });
							if(BluebullFriends.log.friendLog[val.id].total && BluebullFriends.log.friendLog[val.id].dates.length > 1) {
								recv_list += '<p style=&quot;text-align: center; margin-bottom: 8px;&quot;>'+BluebullFriends.localeMsg('frequency')+': <b>'+((now - BluebullFriends.log.friendLog[val.id].dates[0]) / (BluebullFriends.log.friendLog[val.id].dates.length-1)).formatDuration()+'</b></p>';
							}
							recv_list += '<ol style=&quot;list-style-type: decimal; padding: 0 0 0 20px;&quot;>';
							$.each(BluebullFriends.log.friendLog[val.id].dates, function(dkey, dval) {
								recv_list += '<li style=&quot;display: list-item; white-space: nowrap;&quot;>' + new Date(dval * 1e3).toDateTimeStringNice() + '</li>';
							});
							recv_list += '<ol>';
							recvCell = '<span title="'+recv_list+'" style="cursor: help;">'+val.recv+'</span>';
						}
						else recvCell = val.recv;
					}
					bluebullTable.appendRow(null, 'bluebullFriendRow_'+val.id)
						.appendToCell(-1, "hf_idx", idx)
						.appendToCell(-1, "hf_player", '<a href="javascript:void(PlayerProfileWindow.open('+val.id+'));">' + val.name + '</a>')
						.appendToCell(-1, "hf_action", actionCell)
						.appendToCell(-1, "hf_log", recvCell)
						.appendToCell(-1, "hf_delete", '<a href="javascript:void(BluebullFriends.removeFriend('+val.id+'));"><img style="width:16px; height: 16px;" title="'+BluebullFriends.localeMsg('removeFriend')+'" src="'+BluebullFriends.cdnBase+'/images/icons/delete.png" alt="delete" /></a>');
					++ idx;
				});
                bluebullTable.appendToCell('foot', 'hf_idx', '<a target="_blank" href="'+authotURL+'"><img src="'+this.cdnBase+'/images/icons/link.png" alt=""></a>');
				bluebullTable.appendToCell('foot', 'hf_player', '<a target="_blank" href="'+authotURL+'">Bana Ulaşmak İçin</a> '+this.localeMsg('version')+' ' + this.version.toFixed(2));
				if('http://gr1.the-west.gr' == Game.gameURL || 'http://gr4.the-west.gr' == Game.gameURL || 'http://gr5.the-west.gr' == Game.gameURL) bluebullTable.appendToCell('foot', 'hf_action', 'by <a href="javascript:void(PlayerProfileWindow.open(92184));">'+scriptAuthor+'</a>');
				else if('https://zz1.beta.the-west.net' == Game.gameURL) bluebullTable.appendToCell('foot', 'hf_action', 'by <a href="javascript:void(PlayerProfileWindow.open(16866));">'+scriptAuthor+'</a>');
				if (this.pendingInvitations) bluebullTable.appendToCell('foot', 'hf_delete', '<a href="javascript:void(FriendslistWindow.open(\'openrequests\'));"><img style="width:16px; height: 16px;" title="'+this.pendingInvitationsMsg()+'" src="'+this.cdnBase+'/images/icons/friends.png" alt="add" /></a>');
				if(enableLog) bluebullTable.appendToCell('foot', 'hf_log', $('<a style="cursor: pointer;">'+BluebullFriends.localeMsg('exporter')+'</a>').click(function() {
					BluebullFriends.log.entries.sort(function(a,b) { return a.date - b.date; });
					var tsv_friends = "id\t"+BluebullFriends.localeMsg('name')+"\t"+BluebullFriends.localeMsg('received')+"\r\n";
					$.each(BluebullFriends.log.friendLog, function(key,val) { tsv_friends += key+"\t"+val.name+"\t"+val.total+"\r\n"; });
					new west.gui.Dialog(BluebullFriends.localeMsg('exporter'),'<b>'+BluebullFriends.localeMsg('friends')+'</b> (<a download="TW Friends - '+BluebullFriends.eventName+' - '+ Game.worldName+' - '+Character.name+' - '+BluebullFriends.localeMsg('friends')+' - '+Date.now()+'.tsv" href="data:text/tab-separated-values,'+encodeURI(tsv_friends)+'">TSV</a>):<br /><textarea cols="60" rows="8" style="width: 100%; height: 100px;">' + JSON.stringify(BluebullFriends.log.friendLog) + '</textarea><br /><b>'+BluebullFriends.localeMsg('everything')+'</b>:<br /><textarea cols="60" rows="8" style="width: 100%; height: 100px;">' + JSON.stringify(BluebullFriends.log.entries) + '</textarea>').setModal(true,true,{bg:BluebullFriends.cdnBase+'/images/curtain_bg.png',opacity:0.7}).addButton("ok").show();
					return false;
				}) );
			}
			if(enableLog) {
				var statsTable = $('<table style="margin: auto; width: 96%;"><tr><th colspan="3" style="border-bottom: 1px dotted;">'+this.localeMsg('stats')+' ('+this.localeMsg('since')+' '+new Date(this.log.firstLog*1e3).toDateTimeString()+')</th></tr><tr style="vertical-align: top;"><td style="white-space: nowrap;">'+this.localeMsg('collected')+':</td><td style="color: #006600; font-weight: bold; text-align: right; padding-right: 8pt;">'+this.log.received+'</td><td> <span style="white-space: nowrap;">'+this.localeMsg('friends')+': <b>'+this.log.count_friends+'</b>,</span> <span style="white-space: nowrap;">'+this.localeMsg('jobs')+': <b>'+this.log.count_job+'</b>,</span> <span style="white-space: nowrap;">'+this.localeMsg('fortBattles')+': <b>'+this.log.count_fort+'</b>,</span> <span style="white-space: nowrap;">'+this.localeMsg('adventures')+': <b>'+this.log.count_mpi+'</b>,</span> <span style="white-space: nowrap;">'+this.localeMsg('duels')+': <b>'+this.log.count_duel+'</b>,</span> <span style="white-space: nowrap;">'+this.localeMsg('npcDuels')+': <b>'+this.log.count_npc+'</b>,</span> <span style="white-space: nowrap;">'+this.localeMsg('construction')+': <b>'+this.log.count_build+'</b>,</span> <span style="white-space: nowrap;">'+this.localeMsg('itemUse')+': <b>'+this.log.count_item+'</b>,</span> <span style="white-space: nowrap;">'+this.localeMsg('other')+': <b>'+this.log.count_other+'</b></span></td></tr>'+(this.log.used?'<tr style="vertical-align: top;"><td style="white-space: nowrap;">'+this.localeMsg('used')+':</td><td style="color: #660000; font-weight: bold; text-align: right; padding-right: 8pt;">'+this.log.used+'</td><td>'+(this.log.count_reset?'<span style="white-space: nowrap;">'+this.localeMsg('timerReset')+': <b>'+this.log.count_reset+'</b> (#'+this.log.times_reset+'),</span> ' : '')+(this.log.count_action?'<span style="white-space: nowrap;">'+this.localeMsg('gameAction')+': <b>'+this.log.count_action+'</b>,</span> ' : '')+(this.log.count_bribe?'<span style="white-space: nowrap;">'+this.localeMsg('bribe')+': <b>'+this.log.count_bribe+'</b> (#'+this.log.times_bribe+')</span>' : '')+'</td></tr>' : '') + '</table>').appendTo(maindiv);
			}
			var bluebullPane = new west.gui.Scrollpane();
			bluebullPane.appendContent(maindiv);
			var bluebullWindow = wman.open("BluebullFriends_"+this.eventName, null, "noreload").setMiniTitle(this.eventInfo.label).setTitle(this.eventInfo.label).appendToContentPane(bluebullPane.getMainDiv());
		},
		eventManager: function(eventName) {
			if(undefined === Game.sesData[eventName] || undefined === Game.sesData[eventName].friendsbar) return false;
			this.eventName = eventName;
			this.eventInfo = Game.sesData[eventName].friendsbar;
			if(undefined === Game.sesData[this.eventName].meta.end) return false;
			this.eventEndStamp = (buildTimestamp(Game.sesData[this.eventName].meta.end) - Game.serverTimeDifference) / 1e3;
			this.timeLeft = this.eventEndStamp - Game.getServerTime();
			if(this.timeLeft < 0) return false;
			this.cdnBase = (undefined === Game.cdnURL) ? "https://westzzs.innogamescdn.com" : Game.cdnURL;
			if(enableLog) this.getLog();
			this.spanTimeLeft = $("<span />", { id: "bluebull_event_timeleft", style: "position: absolute; left: 5px; color: #d3d3d3; font-size: 11px; height: 25px; line-height: 25px; cursor: pointer", title: this.localeMsg('timeLeft')+'<br />('+new Date(buildTimestamp(Game.sesData[this.eventName].meta.end)).toDateTimeStringNice()+' '+this.localeMsg('serverTime')+')' });
			var eventImage = this.cdnBase + "/images/interface/friendsbar/events/" + this.eventName + ".png";	// event based
			var divContainer = $("<div />", { id: "bluebull_friends_container", style: "position: absolute; top: 32px; right: 50%; margin-right: 120px; z-index: 16; width: 180px; height: 36px; text-align: left; text-shadow: 1px 1px 1px #000; background: url('"+this.cdnBase+"/images/interface/custom_unit_counter_sprite.png?2') no-repeat scroll 50% 0px transparent;" })
			var divCounter = $("<div />", { id: "bluebull_friends", style: "background: url('"+this.cdnBase+"/images/interface/custom_unit_counter_sprite.png?2') no-repeat scroll 0 -36px rgba(0, 0, 0, 0); height: 25px; left: 32px; line-height: 25px; padding: 0 5px; position: absolute; top: 3px; width: 105px; z-index: 1; text-shadow: 1px 1px 1px #000;" });
			var divRefresh = $("<div />", { style: "width: 24px; height: 24px; position: absolute; left: 8px; top: 3px; z-index: 3; padding: 4px 0px 0px 4px;" });
			var spanRefresh = $('<span />', { title: this.localeMsg('refresh'), style: "display: inline-block; width: 20px; height: 20px; cursor: pointer; background: url('"+this.cdnBase+"/images/tw2gui/window/window2_buttons.png?5') repeat scroll 0px -20px transparent;" });
			var spanSend = $("<span />", { style: "width: 26px; height: 26px; left: auto; position: absolute; right: 7px; top: 2px; z-index: 3;" });
			var imageSend = $("<img />", { src: eventImage, title: this.eventInfo.label, style: "width: 26px; height: 26px; cursor: pointer" });
			if(this.pendingInvitations) {
				this.spanCounter.css("right", "20px");
				this.spanInvitations = $("<span />", { id: "bluebull_friends_invitations", title: BluebullFriends.pendingInvitationsMsg(), style: "position: absolute; right: 0px; width: 19px; height: 25px; background-image: url('"+this.cdnBase+"/images/interface/more.jpg'); background-repeat: no-repeat;" });
				this.spanInvitations.hover(function() { $(this).css("background-position", "0px -25px"); }, function() { $(this).css("background-position", ""); });
				this.spanInvitations.click(function() { $(this).hide(); BluebullFriends.spanCounter.css("right", "5px"); FriendslistWindow.open('openrequests'); return false; });
				divCounter.append(this.spanInvitations);
			}
			divContainer.append(divRefresh.append(spanRefresh), spanSend.append(imageSend), divCounter.append(this.spanTimeLeft, this.spanCounter)).appendTo("#user-interface");
			spanRefresh.hover(function() { $(this).css("background-position", ""); }, function() { $(this).css("background-position", "0px -20px"); });
			spanRefresh.click(function() { BluebullFriends.spanCounter.slideUp(500, function() { BluebullFriends.fetch(); }).slideDown(1500); return false; });
			imageSend.click(function() { BluebullFriends.open(); return false; });
			this.updateTimer();
			if(typeof(Storage) !== "undefined") {
				var previousVersion = (localStorage.getItem(this.storageItem) === null) ? 0 : parseFloat(localStorage.getItem(this.storageItem));
				localStorage.setItem(this.storageItem, this.version);
				// if(previousVersion && this.version > previousVersion) var msg=new west.gui.Dialog("TW Friends", "Script upgraded to version "+this.version, west.gui.Dialog.SYS_WARNING).addButton("OK").show();
			}
			$("<style>.hf_idx { width: 32px; text-align: right; padding-right: 8px; } .hf_player { width: 250px; } .hf_action { width: 200px; } .hf_log { width: 100px; text-align: right; padding-right: 8px; } .hf_delete { width: 40px; text-align: center; } div.tbody .hf_idx, div.tbody .hf_delete { background-image: url('"+this.cdnBase+"/images/tw2gui/table/cell_shadow_y.png'); }</style>").appendTo("head");
			return true;
		},
		fetch: function() {
			if(this.interval !== false) clearInterval(this.interval);
			var event_times = {};
			var friends = {}, total = 0, avail = 0, recv = 0;
			var server_time = Game.getServerTime(), activation_time, friend_time;
			if(this.timeLeft < 0) {
				$("#bluebull_friends_container").slideUp(5000);
				throw "Event is over";
			}
			return $.post("/game.php?window=friendsbar&mode=search", { search_type: "friends" } , function(data) {
				$.each(data.eventActivations, function(key, val) {
					if(val.event_name == BluebullFriends.eventName) event_times[val.friend_id] = val.activation_time;
				});
				$.each(data.players, function(key, val) {
					if(val.name !== Character.name) {
						activation_time = (event_times[val.player_id] !== undefined) ? event_times[val.player_id]: 0;
						if(undefined === BluebullFriends.log.friendLog[val.player_id]) {
							recv = 0;
							BluebullFriends.log.friendLog[val.player_id] = { name: val.name, total: 0, dates: [] };
						}
						else recv = BluebullFriends.log.friendLog[val.player_id].total;
						friends[val.player_id] = { name: val.name, activation_time: activation_time, recv: recv };
						++ total;
						if(activation_time + BluebullFriends.eventInfo.cooldown - server_time <= 0) ++ avail;
					}
				});
				BluebullFriends.friends = friends;
				BluebullFriends.avail = avail;
				BluebullFriends.total = total;
				BluebullFriends.interval = setInterval(function() { BluebullFriends.fetch(); }, refreshMs);
				BluebullFriends.updateCounter();
			});
		},
		getLog: function() {
			var hasNext = true;
			var limit = 100;
			var page = 1;
			var count = 0;
			var details;
			var maxDate = BluebullFriends.log.lastLog;
			while(hasNext) {
				$.ajax({ type: "POST", url: "/game.php?window=ses&mode=log", data: { ses_id: BluebullFriends.eventName, page: page, limit: limit }, async: false, success: function(data) {
					hasNext = data.hasNext;
					limit = data.limit;
					page = data.page + 1;
					$.each(data.entries, function(key, val) {
						count = parseInt(val.value);
						if(val.date < BluebullFriends.log.firstLog) BluebullFriends.log.firstLog = val.date;
						if(val.date <= BluebullFriends.log.lastLog) {
							hasNext = false;
							return false;
						}
						BluebullFriends.log.entries.push(val);
						if(val.date > maxDate) maxDate = val.date;
						switch(val.type) {
							case "friendDrop":
								if (null !== val.details) {
									details = JSON.parse(val.details);
									if(undefined !== BluebullFriends.friends[details.player_id]) BluebullFriends.friends[details.player_id].recv += count;
									if(undefined === BluebullFriends.log.friendLog[details.player_id]) BluebullFriends.log.friendLog[details.player_id] = { name: details.name, total: count, dates: [] };
									else BluebullFriends.log.friendLog[details.player_id].total += count;
									BluebullFriends.log.friendLog[details.player_id].dates.push(val.date);
								}
								BluebullFriends.log.count_friends += count;
								BluebullFriends.log.received += count;
								break;
							case "jobDrop":		BluebullFriends.log.count_job += count; BluebullFriends.log.received += count; break;
							case "buildDrop":	BluebullFriends.log.count_build += count; BluebullFriends.log.received += count; break;
							case "duelDrop":	BluebullFriends.log.count_duel += count; BluebullFriends.log.received += count; break;
							case "duelNPCDrop":	BluebullFriends.log.count_npc += count; BluebullFriends.log.received += count; break;
							case "battleDrop":	BluebullFriends.log.count_fort += count; BluebullFriends.log.received += count; break;
							case "adventureDrop":	BluebullFriends.log.count_mpi += count; BluebullFriends.log.received += count; break;
							case "itemUse":		BluebullFriends.log.count_item += count; BluebullFriends.log.received += count; break;
							case "wofPay":
								BluebullFriends.log.used += count;
								if (null !== val.details) {
									if(val.details == "timerreset") {
										BluebullFriends.log.count_reset += count;
										++ BluebullFriends.log.times_reset;
									}
									else if(val.details == "sneakyshot") {
										BluebullFriends.log.count_bribe += count;
										++ BluebullFriends.log.times_bribe;
									}
								}
								break;
							default:
								BluebullFriends.log.count_other += count;
								BluebullFriends.log.received += count;
						}
					});
				} });
			}
			this.log.lastLog = maxDate;
			Chat.Request.Nop();
		},
		getPendingInvitations: function() {
			return $.post("/game.php?window=character&mode=get_open_requests", function(data) {
				var openReq = 0;
				$.each(data.open_friends, function(key, val) { if(val.inviter_id != Character.playerId) ++ openReq; });
				BluebullFriends.pendingInvitations = openReq;
			});
		},
		localeMsg: function(msg) {
			if(undefined !== this.messages[this.locale][msg]) return this.messages[this.locale][msg];
			if(undefined !== this.messages['en_US'][msg]) return this.messages['en_US'][msg];
			return '';
		},
		open: function() {
			if(!WestUi.FriendsBar.hidden) WestUi.FriendsBar.toggle();
			if(enableLog) this.getLog();
			return this.fetch().done(function() { BluebullFriends.getPendingInvitations().done(function() { BluebullFriends.display('time'); }) });
		},
		pendingInvitationsMsg: function() { return this.pendingInvitations == 1 ? this.localeMsg('pendingInvitation') : this.pendingInvitations+' '+this.localeMsg('pendingInvitations'); },
		removeFriend: function(charId) {
			new west.gui.Dialog(BluebullFriends.localeMsg('removeFriend'), BluebullFriends.localeMsg('removeConfirm')).setIcon(west.gui.Dialog.SYS_QUESTION).addButton("yes", function() {
				Ajax.remoteCall('character', 'cancel_friendship', { friend_id: charId }, function(json) {
					if(json["result"]) {
						new UserMessage(BluebullFriends.localeMsg('removeSuccess'), UserMessage.TYPE_SUCCESS).show();
						$("div.bluebullFriendRow_" + charId).remove();
						$("div.friendData_" + charId, FriendslistWindow.DOM).remove();
						delete(BluebullFriends.friends[charId]);
						if(BluebullFriends.avail) -- BluebullFriends.avail;
						if(BluebullFriends.total) -- BluebullFriends.total;
						BluebullFriends.updateCounter();
						Chat.Friendslist.removeFriend(charId);
					}
					else new UserMessage(BluebullFriends.localeMsg('removeFailed'), UserMessage.TYPE_ERROR).show();
				})
			}).addButton("no").show();
		},
		sortByName: function(a, b) { return a.name.toLowerCase().localeCompare(b.name.toLowerCase()); },
		sortByRecv: function(a, b) { return b.recv - a.recv; },
		sortByTime: function(a, b) { return a.activation_time - b.activation_time; },
		updateCounter: function() {
			this.spanCounter.html('<span title="'+this.localeMsg('availFriends')+'">'+this.avail+'</span> <span style="color: #d3d3d3; font-size: 11px;" title="'+this.localeMsg('totalFriends')+'">/ '+this.total+'</span>');
		},
		updateTimer: function() {
			this.timeLeft = this.eventEndStamp - Game.getServerTime();
			if(this.timeLeft <= 0) {
				this.spanTimeLeft.html(this.localeMsg('theEnd'));
				this.fetch();
				return;
			}
			this.spanTimeLeft.html(this.timeLeft.formatDurationBuffWay());
			var seconds = 0;
			if(this.timeLeft < 70) seconds = 1;
			else if(this.timeLeft < 3660) seconds = 10;
			else if(this.timeLeft < 86520) seconds = 60;
			else seconds = 120;
			setTimeout(function() { BluebullFriends.updateTimer(); }, seconds * 1e3);
		},
		scriptInit: function(tries, maxTries) {
			var ev, eventName;
			if(tries >= maxTries) return false;
			if(Game && Game.loaded && Character.playerId) {
				this.locale = (undefined === Game.locale || undefined == this.messages[Game.locale]) ? "en_US" : Game.locale;
				this.api.setGui(this.localeMsg('description'));
				try {
					$.getScript(versionURL).done(function() {
						if(BluebullFriends.latestVersion && BluebullFriends.latestVersion > VERSION) {
							var upgradeDialog = new west.gui.Dialog(scriptName, BluebullFriends.localeMsg('upgrade'), west.gui.Dialog.SYS_WARNING).addButton('ok', function() {
								try { upgradeDialog.hide(); location.href = codeURL; } catch(e) {}
							}).addButton('cancel').show();
						}
					});
				}
				catch(e) { }
				for(eventName in Game.sesData) {
					if(!Game.sesData.hasOwnProperty(eventName)) continue;
					var ev = Game.sesData[eventName];
					if(!ev.friendsbar) continue;
					if('Hearts' == eventName || 'Easter' == eventName || 'Independence' == eventName || 'DayOfDead' == eventName || 'Octoberfest' == eventName) {
						this.getPendingInvitations().done(function() {
							if(BluebullFriends.eventManager(eventName)) BluebullFriends.fetch();
						});
						return false;
					}
				}
				return true;
			}
			++ tries;
			setTimeout(function() { BluebullFriends.scriptInit(tries, maxTries); }, tries * 1e3);
		},
	}
	try { BluebullFriends.scriptInit(0, 100); } catch(e) { }
});