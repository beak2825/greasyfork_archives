// ==UserScript==
// @name              TW Friends
// @name:pl           TW Friends
// @version           0.25
// @description       Friend Management for The West Events
// @description:pl    Zarządzanie wysyłką nagród podczas Eventów w The West
// @author            hiroaki
// @translation       pepe100 (es_ES)
// @translation       jccwest (pt_PT)
// @include           http://*.the-west.*/game.php*
// @include           https://*.the-west.*/game.php*
// @include           http://*.tw.innogames.*/game.php*
// @include           https://*.tw.innogames.*/game.php*
// @grant             none
// @namespace         https://greasyfork.org/users/26244
// @downloadURL https://update.greasyfork.org/scripts/17278/TW%20Friends.user.js
// @updateURL https://update.greasyfork.org/scripts/17278/TW%20Friends.meta.js
// ==/UserScript==

function hiroFriendsScript(fn) {
	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.textContent = '(' + fn + ')();';
	document.body.appendChild(script);
	document.body.removeChild(script);
}
hiroFriendsScript(function() {
	var VERSION = 0.25;
	var installURL = "https://greasyfork.org/scripts/17278-tw-friends";
	var codeURL = "https://greasyfork.org/scripts/17278-tw-friends/code/TW%20Friends.user.js";
	var versionURL = "https://gist.githubusercontent.com/TWFriends/974718d615afe3d2c2a2/raw/version?"+Date.now();
	var scriptName = "TW Friends";
	var scriptAuthor = "hiroaki";
	var refreshMs = 2 * 60 * 1e3;	// 2 minutes
	var enableLog = true;
	HiroFriends = {
		api: TheWestApi.register('HiroFriends', scriptName, '2.04', Game.version.toString(), scriptAuthor, installURL),
		version: VERSION,
		latestVersion: undefined,
		storageItem: "HiroFriends.version",
		cdnBase: '',
		eventName : '',
		eventInfo : {},
		eventEndStamp : 0,
		friends : {},
		interval: false,
		locale: 'en_US',
		pendingInvitations: 0,
        css: {
            stats  : "border-bottom: 1px dotted; text-align: right;",
            allTxt : "width: 26%; border-bottom: 1px dotted; padding-left: 5px; font-weight: bold;",
            allVal : "width: 7%; border-bottom: 1px dotted; padding-right: 10px; font-weight: bold; text-align: right; color: #006600;",
            oneTxt : "width: 26%; padding-left: 10px;",
            oneVal : "width: 7%; padding-right: 10px; text-align: right; font-weight: bold;"
        },
		messages: {
            pl_PL: {
				description: '<div style="margin: 20pt;">' +
                             '<h3>Zarządzaj wysyłką nagród podczas Eventów w The West</h3>' +
                             '<p>Nie klikaj zbyt szybko, aby uniknąc zawieszenia się gry ;)</p><br />' +
                             '<p>Wspierane Eventy:</p>' +
                             '<ul style="list-style: disc inside; padding-bottom: 20px;">' +
                             '  <li>Walentynki</li>' +
                             '  <li>Wielkanoc</li>' +
                             '  <li>Dzień niepodległości</li>' +
                             '  <li>Oktoberfest</li>' +
                             '  <li>Dzień śmierci</li>' +
                             '</ul>' +
                             '<p><a target="_blank" href="https://greasyfork.org/scripts/2992-tw-friends/feedback">Wokół skryptu</a>: Raporty błędów, Pomysły, Tłumaczenia (po angielsku)</p><br />' +
                             '<b>Autorzy</b>: jccwest, noolas, pepe100, Pnevma</p></div>',
				version: 'wersja',
				upgrade: 'Dostępna jest nowa wersja. Chcesz aktualizować teraz?',
				refresh: 'Odśwież',
				timeLeft: 'Event będzie trwać do ',
				serverTime: 'czasu serwera',
				availFriends: 'Ilość przyjaciół którym możesz wysłać nagrodę',
				totalFriends: 'Ilość przyjaciół',
				pendingInvitation: 'Jedno oczekujące zaproszenie',
				pendingInvitations: 'Oczekujące zaproszenia',
				noFriends: 'Brak przyjaciół',
				name: 'Nazwa gracza',
				received: 'Otrzymane',
				frequency: 'Częstotliwość',
                remove: 'Usuń',
				removeFriend: 'Usuń przyjaciela',
				removeConfirm: 'Czy na pewno chcesz usunąć przyjaciela z listy?',
				removeSuccess: 'Usunięto przyjaciela.',
				removeFailed: 'Przyjaciel nie może sostać usunięty',
				exporter: 'Eksportuj',
				everything: 'Everything',
				stats: 'Statystyki prowadzone',
				since: 'od',
				collected: 'Zebrane ogółem',
				friends: 'Przyjaciele',
				jobs: 'Prace',
				fortBattles: 'Bitwy',
				adventures: 'Przygody',
				duels: 'Pojedynki',
				npcDuels: 'NPC',
				construction: 'Budowanie',
				itemUse: 'Użyte przedmioty',
				other: 'Pozostałe',
				used: 'Zużyte ogółem',
				timerReset: 'Reset zegara',
				bribe: 'Łapówki',
				gameAction: 'Akcje eventowe',
				nextYear: 'Przyszły rok',
				theEnd: 'Koniec',
			},
			en_US: {
				description: '<h1>Friend Management for The West Events</h1><p style="margin: 8pt;">Don&#039;t click too fast, to avoid a streak of bad luck upon you :)</p><p style="margin: 8pt;">Supported Events:</p><ul style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;"><li>Valentine&#039;s Day</li><li>Easter</li><li>Independence Day</li><li>Oktoberfest</li><li>Day of the Dead</li></ul><p style="margin: 8pt;"><a target="_blank" href="https://greasyfork.org/scripts/2992-tw-friends/feedback">Feedback</a>: Bug Reports, Ideas, Translations (in English).</p><p style="margin: 8pt;"><b>Credits</b>: jccwest, noolas, pepe100, Pnevma</p>',
				version: 'version',
				upgrade: 'A new version is available. Do you want to upgrade now?',
				refresh: 'Refresh',
				timeLeft: 'Time Left until the event ends',
				serverTime: 'server time',
				availFriends: 'Number of Friends you can send now',
				totalFriends: 'Number of Friends',
				pendingInvitation: 'One pending invitation',
				pendingInvitations: 'pending invitations',
				noFriends: 'No Friends',
				name: 'Name',
				received: 'Received',
				frequency: 'Frequency',
                remove: 'Remove',
				removeFriend: 'Remove friend',
				removeConfirm: 'Do you really want to delete this player from the list?',
				removeSuccess: 'Friend removed from your list.',
				removeFailed: 'Friend could not be removed',
				exporter: 'Export',
				everything: 'Everything',
				stats: 'Stats',
				since: 'since',
				collected: 'Collected',
				friends: 'Friends',
				jobs: 'Jobs',
				fortBattles: 'Fort Battles',
				adventures: 'Adventures',
				duels: 'Duels',
				npcDuels: 'NPC Duels',
				construction: 'Construction',
				itemUse: 'Item Use',
				other: 'Other',
				used: 'Used',
				timerReset: 'Reset Timers',
				bribe: 'Bribe',
				gameAction: 'Event game action',
				nextYear: 'Next Year',
				theEnd: 'The End',
			},
		},
		timeLeft : 0,
		total : 0,
		avail: 0,
		log: {
            firstLog: Date.now()/1e3,
            lastLog: 0,
            friendLog: {},
            entries: [],
            count_friends: 0,
            count_job: 0,
            count_duel: 0,
            count_npc: 0,
            count_fort: 0,
            count_mpi: 0,
            count_build: 0,
            count_item: 0,
            count_other: 0,
            count_reset: 0,
            count_bribe: 0,
            count_action: 0,
            times_reset: 0,
            times_bribe: 0,
            received: 0,
            used: 0 },
		spanCounter: $("<span />", { id: "hiro_friends_counter", style: "position: absolute; right: 5px; color: #f8c57c; font-size: 13pt; height: 25px; line-height: 25px; bottom: 0px" }),
		spanInvitations: null,
		spanTimeLeft: null,
		display: function(sort) {
			var friend_time, server_time = Game.getServerTime();
			var maindiv = $('<div class="hiro_friends_maindiv" />');
			var friends = [];
			for(var key in this.friends) if(this.friends.hasOwnProperty(key)) friends.push({ id: key, name: this.friends[key].name, activation_time: this.friends[key].activation_time, recv: this.friends[key].recv });
			if(!friends.length) $('<h1 />').attr('style',"text-align: center; color: #990000; margin-bottom: 80px;").append(this.localeMsg('noFriends')).appendTo(maindiv);
			else {
				var hiroTable;
				switch(sort) {
					case "name" 	:	friends.sort(this.sortByName); break;
					case "name_desc":	friends.sort(this.sortByName).reverse(); break;
					case "recv" 	:	friends.sort(this.sortByRecv); break;
					case "recv_asc"	:	friends.sort(this.sortByRecv).reverse(); break;
					case "time_asc"	:	friends.sort(this.sortByTime).reverse(); break;
					case "time"	:
					default		:	sort = "time"; friends.sort(this.sortByTime);
				}
				var thName   = $('<a style="cursor: pointer;">&nbsp;' + this.localeMsg('name') + '</a>').click(function(){ HiroFriends.display(sort == 'name' ? 'name_desc' : 'name'); return false; });
				var thAction = $('<a style="cursor: pointer;">&nbsp;' + this.eventInfo.label   + '</a>').click(function(){ HiroFriends.display(sort == 'time' ? 'time_asc'  : 'time'); return false; });
                var title = ' title="' + this.localeMsg('since') + ' ' + new Date(this.log.firstLog*1e3).toDateTimeString() + '"';
				var thRecv = enableLog ? $('<a style="cursor: pointer;"' + title + '>' + this.localeMsg('received') + '</a>').click(function(){ HiroFriends.display(sort == 'recv' ? 'recv_asc' : 'recv'); return false; }) : '';
				hiroTable = new west.gui.Table().appendTo(maindiv).addColumn("hf_idx").addColumn("hf_player").addColumn("hf_action").addColumn("hf_log").addColumn("hf_delete");
                hiroTable.appendToCell("head", "hf_idx", '&nbsp;').appendToCell("head", "hf_player", thName).appendToCell("head", "hf_action", thAction).appendToCell("head","hf_log",thRecv).appendToCell("head", "hf_delete", this.localeMsg('remove'));
				var idx = 1;
				var now = Date.now()/1e3;
				$.each(friends, function(key, val) {
					var actionCell, recvCell;
					friend_time = val.activation_time + HiroFriends.eventInfo.cooldown - server_time;
					if (friend_time > HiroFriends.timeLeft)
                        actionCell = '(' + HiroFriends.localeMsg('nextYear') + ')';
					else if (friend_time > 0)
                        actionCell = '(' + friend_time.formatDurationBuffWay() + ')';
					else {
						actionCell = $('<a style="cursor: pointer;">' + HiroFriends.eventInfo.label + '</a>').click({ id: val.id, ev: HiroFriends.eventName }, function(e) {
							$(this).parent().parent().remove();
							Ajax.remoteCall("friendsbar", "event", { player_id: val.id, event: HiroFriends.eventName }, function(response) {
								if (response.error)
                                    return MessageError(response.msg).show();
								MessageSuccess(response.msg).show();
								HiroFriends.friends[val.id].activation_time = Date.now()/1e3;
								if (HiroFriends.avail) -- HiroFriends.avail;
								HiroFriends.updateCounter();
								if (WestUi.FriendsBar.friendsBarUi !== null)
									WestUi.FriendsBar.friendsBarUi.friendsBar.eventActivations[val.id][HiroFriends.eventName] = response.activationTime;
							});
							return false;
						});
					}
					recvCell = '';
					if (enableLog) {
						if (val.recv) {
							var recv_list = '';
							HiroFriends.log.friendLog[val.id].dates.sort(function(a, b) { return new Date(a) - new Date(b); });
							if (HiroFriends.log.friendLog[val.id].total && HiroFriends.log.friendLog[val.id].dates.length > 1) {
								recv_list += '<p style="text-align: center; margin-bottom: 8px;">' + HiroFriends.localeMsg('frequency') + ': <b>' + ((now - HiroFriends.log.friendLog[val.id].dates[0]) / (HiroFriends.log.friendLog[val.id].dates.length-1)).formatDuration() + '</b></p>';
							}
							recv_list += '<ol style="list-style-type: decimal; padding: 0 0 0 20px;">';
							$.each(HiroFriends.log.friendLog[val.id].dates, function(dkey, dval) {
								recv_list += '<li style="display: list-item; white-space: nowrap;">' + new Date(dval * 1e3).toDateTimeStringNice() + '</li>';
							});
							recv_list += '</ol>';
                            recvCell = $('<span />').attr('style', 'cursor: help;').append(val.recv).addMousePopup(recv_list);
						} else recvCell = val.recv;
					}
					hiroTable.appendRow(null, 'hiroFriendRow_' + val.id);
					hiroTable.appendToCell(-1, "hf_idx", idx);
					hiroTable.appendToCell(-1, "hf_player", '&nbsp; &nbsp; &nbsp; <a href="javascript:void(PlayerProfileWindow.open(' + val.id + '));">' + val.name + '</a>');
					hiroTable.appendToCell(-1, "hf_action", actionCell);
					hiroTable.appendToCell(-1, "hf_log", recvCell);
					hiroTable.appendToCell(-1, "hf_delete", '<a href="javascript:void(HiroFriends.removeFriend(' + val.id + '));">' +
                                                            '<img style="width:16px; height: 16px;" ' +
                                                                 'title="' + HiroFriends.localeMsg('removeFriend') + '" ' +
                                                                 'src="' + HiroFriends.cdnBase + '/images/icons/delete.png" ' +
                                                                 'alt="delete" />' +
                                                            '</a>');
					++ idx;
				});
				hiroTable.appendToCell('foot', 'hf_idx', '<a target="_blank" href="' + installURL + '"><img src="' + this.cdnBase + '/images/icons/link.png" alt=""></a>');
				hiroTable.appendToCell('foot', 'hf_player', '<a target="_blank" href="' + installURL + '">TW Friends</a> ' + this.localeMsg('version') + ' ' + this.version.toFixed(2));
				if ('https://gr1.the-west.gr' == Game.gameURL || 'https://gr4.the-west.gr' == Game.gameURL || 'https://gr5.the-west.gr' == Game.gameURL)
                    hiroTable.appendToCell('foot', 'hf_action', 'by <a href="javascript:void(PlayerProfileWindow.open(92184));">' + scriptAuthor + '</a>');
				else if ('https://zz1.beta.the-west.net' == Game.gameURL)
                    hiroTable.appendToCell('foot', 'hf_action', 'by <a href="javascript:void(PlayerProfileWindow.open(16866));">' + scriptAuthor + '</a>');
                if (this.pendingInvitations) {
                    hiroTable.appendToCell('foot', 'hf_delete', '<a href="javascript:void(FriendslistWindow.open(\'openrequests\'));">' +
                                                                '<img style="width:16px; height: 16px;" ' +
                                                                     'title="' + this.pendingInvitationsMsg() + '" ' +
                                                                     'src="' + this.cdnBase + '/images/icons/friends.png" ' +
                                                                     'alt="add" />' +
                                                                '</a>');
                }
                if(enableLog) {
                    hiroTable.appendToCell('foot', 'hf_log', $('<a style="cursor: pointer;">' + HiroFriends.localeMsg('exporter') + '</a>').click(function() {
                        HiroFriends.log.entries.sort(function(a,b) { return a.date - b.date; });
                        var tsv_friends = "id\t" + HiroFriends.localeMsg('name') + "\t" + HiroFriends.localeMsg('received') + "\r\n";
                        $.each(HiroFriends.log.friendLog, function(key,val) { tsv_friends += key + "\t" + val.name + "\t" + val.total + "\r\n"; });
                        new west.gui.Dialog(HiroFriends.localeMsg('exporter'), '<b>' + HiroFriends.localeMsg('friends')    + '</b> (<a download="TW Friends - ' + HiroFriends.eventName + ' - ' + Game.worldName + ' - ' + Character.name + ' - ' + HiroFriends.localeMsg('friends') + ' - ' + Date.now() + '.tsv" href="data:text/tab-separated-values,' + encodeURI(tsv_friends) + '">TSV</a>):<br />' +
                                                                               '<textarea cols="60" rows="8" style="width: 100%; height: 100px;">' + JSON.stringify(HiroFriends.log.friendLog) + '</textarea><br />' +
                                                                               '<b>' + HiroFriends.localeMsg('everything') + '</b>:<br />' +
                                                                               '<textarea cols="60" rows="8" style="width: 100%; height: 100px;">' + JSON.stringify(HiroFriends.log.entries)   + '</textarea>')
                                    .setModal(true, true, {bg:HiroFriends.cdnBase + '/images/curtain_bg.png', opacity: 0.7}).addButton("ok").show();
                        return false;
                    }) );
                }
            }
			if(enableLog) {
				var statsTable = $('<table style="margin: auto; width: 96%;">' +
                                   //'<tr>' +
                                   //'  <th style="' + this.css.stats + '">' + this.localeMsg('stats') + ' ' + this.localeMsg('since') + ':</th>' +
                                   //'  <th style="' + this.css.stats + '" colspan="5">' + new Date(this.log.firstLog*1e3).toDateTimeString() + '</th>' +
                                   //'</tr>' +
                                   '<tr>' +
                                   '    <td style="' + this.css.allTxt + '">' + this.localeMsg('collected') + ':</td>' +
                                   '    <td style="' + this.css.allVal + '">' + this.log.received + '</td>' +
                                   '    <td style="' + this.css.stats  + '" colspan="4">' + this.localeMsg('stats') + ' ' + this.localeMsg('since') + ': <b>' + new Date(this.log.firstLog*1e3).toDateTimeString() + '</b></td>' +
                                   '</tr>' +
                                   '<tr><td style="' + this.css.oneTxt + '">' + this.localeMsg('friends')      + ':</td><td style="' + this.css.oneVal + '">' + this.log.count_friends + '</td>' +
                                   '    <td style="' + this.css.oneTxt + '">' + this.localeMsg('npcDuels')     + ':</td><td style="' + this.css.oneVal + '">' + this.log.count_npc     + '</td>' +
                                   '    <td style="' + this.css.oneTxt + '">' + this.localeMsg('fortBattles')  + ':</td><td style="' + this.css.oneVal + '">' + this.log.count_fort    + '</td></tr>' +

                                   '<tr><td style="' + this.css.oneTxt + '">' + this.localeMsg('jobs')         + ':</td><td style="' + this.css.oneVal + '">' + this.log.count_job     + '</td>' +
                                   '    <td style="' + this.css.oneTxt + '">' + this.localeMsg('duels')        + ':</td><td style="' + this.css.oneVal + '">' + this.log.count_duel    + '</td>' +
                                   '    <td style="' + this.css.oneTxt + '">' + this.localeMsg('adventures')   + ':</td><td style="' + this.css.oneVal + '">' + this.log.count_mpi     + '</td></tr>' +

                                   '<tr><td style="' + this.css.oneTxt + ' border-bottom: 1px dotted;">' + this.localeMsg('itemUse')      + ':</td><td style="' + this.css.oneVal + ' border-bottom: 1px dotted;">' + this.log.count_item    + '</td>' +
                                   '    <td style="' + this.css.oneTxt + ' border-bottom: 1px dotted;">' + this.localeMsg('construction') + ':</td><td style="' + this.css.oneVal + ' border-bottom: 1px dotted;">' + this.log.count_build   + '</td>' +
                                   '    <td style="' + this.css.oneTxt + ' border-bottom: 1px dotted;">' + this.localeMsg('other')        + ':</td><td style="' + this.css.oneVal + ' border-bottom: 1px dotted;">' + this.log.count_other   + '</td></tr>' +

                  (this.log.used ? '<tr style="vertical-align: top;">' +
                                   '    <td style="' + this.css.allTxt + '">' + this.localeMsg('used') + ':</td>' +
                                   '    <td style="' + this.css.allVal + ' color: #660000;">' + this.log.used + '</td>' +
                                   '    <td style="border-bottom: 1px dotted;" colspan="4">&nbsp;</td>' +
                                   '</tr>' +
                                   '<tr>' + 
          (this.log.count_reset  ? '    <td style="' + this.css.oneTxt + '">' + this.localeMsg('timerReset')   + ':</td><td style="' + this.css.oneVal + '">' + this.log.count_reset   + '</td>' : '') +
          (this.log.count_action ? '    <td style="' + this.css.oneTxt + '">' + this.localeMsg('gameAction')   + ':</td><td style="' + this.css.oneVal + '">' + this.log.count_action  + '</td>' : '') +
          (this.log.count_bribe  ? '    <td style="' + this.css.oneTxt + '">' + this.localeMsg('bribe')        + ':</td><td style="' + this.css.oneVal + '">' + this.log.count_bribe   + '</td>' : '') +
                                   '</tr>' : '') +
                                   '</table>').appendTo(maindiv);
			}
			var hiroPane = new west.gui.Scrollpane();
			hiroPane.appendContent(maindiv);
			var hiroWindow = wman.open("HiroFriends_"+this.eventName, null, "noreload").setMiniTitle(this.eventInfo.label).setTitle(this.eventInfo.label).appendToContentPane(hiroPane.getMainDiv());
		},
		eventManager: function(eventName) {
			if (undefined === Game.sesData[eventName] || undefined === Game.sesData[eventName].friendsbar) return false;
			this.eventName = eventName;
			this.eventInfo = Game.sesData[eventName].friendsbar;
			if (undefined === Game.sesData[this.eventName].meta.end) return false;
			this.eventEndStamp = (buildTimestamp(Game.sesData[this.eventName].meta.end) - Game.serverTimeDifference) / 1e3;
			this.timeLeft = this.eventEndStamp - Game.getServerTime();
			if (this.timeLeft < 0) return false;
			this.cdnBase = (undefined === Game.cdnURL) ? "https://westzzs.innogamescdn.com" : Game.cdnURL;
			if (enableLog) this.getLog();
			this.spanTimeLeft = $("<span />", {id: "hiro_event_timeleft",
                                               style: "position: absolute; left: 5px; color: #d3d3d3; font-size: 11px; height: 25px; line-height: 25px; cursor: pointer",
                                               title: this.eventName + ' ' + this.localeMsg('timeLeft') + '<br />(' + new Date(buildTimestamp(Game.sesData[this.eventName].meta.end)).toDateTimeStringNice() + ' ' + this.localeMsg('serverTime') + ')' });
			var eventImage = this.cdnBase + "/images/interface/friendsbar/events/" + this.eventName + ".png";	// event based
			if (eventName == 'Octoberfest')
                eventImage = this.cdnBase + "/images/window/events/octoberfest/pretzels_icon.png";
			var divContainer = $("<div />", {id: "hiro_friends_container",
                                             style: "position: absolute; top: 32px; right: 50%; margin-right: 120px; z-index: 16; width: 180px; height: 36px; text-align: left; text-shadow: 1px 1px 1px #000; background: url('"+this.cdnBase+"/images/interface/custom_unit_counter_sprite.png?2') no-repeat scroll 50% 0px transparent;" });
			var divCounter   = $("<div />", {id: "hiro_friends",
                                           style: "background: url('"+this.cdnBase+"/images/interface/custom_unit_counter_sprite.png?2') no-repeat scroll 0 -36px rgba(0, 0, 0, 0); height: 25px; left: 32px; line-height: 25px; padding: 0 5px; position: absolute; top: 3px; width: 105px; z-index: 1; text-shadow: 1px 1px 1px #000;" });
			var divRefresh = $("<div />", {style: "width: 24px; height: 24px; position: absolute; left: 8px; top: 3px; z-index: 3; padding: 4px 0px 0px 4px;" });
			var spanRefresh = $('<span />', {title: this.localeMsg('refresh'),
                                             style: "display: inline-block; width: 20px; height: 20px; cursor: pointer; background: url('"+this.cdnBase+"/images/tw2gui/window/window2_buttons.png?5') repeat scroll 0px -20px transparent;" });
			var spanSend = $("<span />", {style: "width: 26px; height: 26px; left: auto; position: absolute; right: 7px; top: 2px; z-index: 3;" });
			var imageSend = $("<img />", {src: eventImage,
                                          title: this.eventInfo.label,
                                          style: "width: 26px; height: 26px; cursor: pointer" });
			if(this.pendingInvitations) {
				this.spanCounter.css("right", "20px");
				this.spanInvitations = $("<span />", { id: "hiro_friends_invitations", title: HiroFriends.pendingInvitationsMsg(), style: "position: absolute; right: 0px; width: 19px; height: 25px; background-image: url('"+this.cdnBase+"/images/interface/more.jpg'); background-repeat: no-repeat;" });
				this.spanInvitations.hover(function() { $(this).css("background-position", "0px -25px"); }, function() { $(this).css("background-position", ""); });
				this.spanInvitations.click(function() { $(this).hide(); HiroFriends.spanCounter.css("right", "5px"); FriendslistWindow.open('openrequests'); return false; });
				divCounter.append(this.spanInvitations);
			}
			divContainer.append(divRefresh.append(spanRefresh), spanSend.append(imageSend), divCounter.append(this.spanTimeLeft, this.spanCounter)).appendTo("#user-interface");
			spanRefresh.hover(function() { $(this).css("background-position", ""); }, function() { $(this).css("background-position", "0px -20px"); });
			spanRefresh.click(function() { HiroFriends.spanCounter.slideUp(500, function() { HiroFriends.fetch(); }).slideDown(1500); return false; });
			imageSend.click(function() { HiroFriends.open(); return false; });
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
				$("#hiro_friends_container").slideUp(5000);
				throw "Event is over";
			}
			return $.post("/game.php?window=friendsbar&mode=search", { search_type: "friends" } , function(data) {
				$.each(data.eventActivations, function(key, val) {
					if(val.event_name == HiroFriends.eventName) event_times[val.friend_id] = val.activation_time;
				});
				$.each(data.players, function(key, val) {
					if(val.name !== Character.name) {
						activation_time = (event_times[val.player_id] !== undefined) ? event_times[val.player_id]: 0;
						if(undefined === HiroFriends.log.friendLog[val.player_id]) {
							recv = 0;
							HiroFriends.log.friendLog[val.player_id] = { name: val.name, total: 0, dates: [] };
						}
						else recv = HiroFriends.log.friendLog[val.player_id].total;
						friends[val.player_id] = { name: val.name, activation_time: activation_time, recv: recv };
						++ total;
						if(activation_time + HiroFriends.eventInfo.cooldown - server_time <= 0) ++ avail;
					}
				});
				HiroFriends.friends = friends;
				HiroFriends.avail = avail;
				HiroFriends.total = total;
				HiroFriends.interval = setInterval(function() { HiroFriends.fetch(); }, refreshMs);
				HiroFriends.updateCounter();
			});
		},
		getLog: function() {
			var hasNext = true;
			var limit = 100;
			var page = 1;
			var count = 0;
			var details;
			var maxDate = HiroFriends.log.lastLog;
			while(hasNext) {
				$.ajax({ type: "POST", url: "/game.php?window=ses&mode=log", data: { ses_id: HiroFriends.eventName, page: page, limit: limit }, async: false, success: function(data) {
					hasNext = data.hasNext;
					limit = data.limit;
					page = data.page + 1;
					$.each(data.entries, function(key, val) {
						count = parseInt(val.value);
						if (val.date < HiroFriends.log.firstLog) HiroFriends.log.firstLog = val.date;
						if (val.date <= HiroFriends.log.lastLog) {
							hasNext = false;
							return false;
						}
						HiroFriends.log.entries.push(val);
						if(val.date > maxDate) maxDate = val.date;
						switch(val.type) {
							case "friendDrop":
								if (null !== val.details) {
									details = JSON.parse(val.details);
									if (undefined !== HiroFriends.friends[details.player_id]) HiroFriends.friends[details.player_id].recv += count;
									if (undefined === HiroFriends.log.friendLog[details.player_id]) HiroFriends.log.friendLog[details.player_id] = { name: details.name, total: count, dates: [] };
									else HiroFriends.log.friendLog[details.player_id].total += count;
									HiroFriends.log.friendLog[details.player_id].dates.push(val.date);
								}
								HiroFriends.log.count_friends += count;
								HiroFriends.log.received += count;
								break;
							case "jobDrop":		  HiroFriends.log.count_job   += count; HiroFriends.log.received += count; break;
							case "buildDrop":	  HiroFriends.log.count_build += count; HiroFriends.log.received += count; break;
							case "duelDrop":	  HiroFriends.log.count_duel  += count; HiroFriends.log.received += count; break;
							case "duelNPCDrop":	  HiroFriends.log.count_npc   += count; HiroFriends.log.received += count; break;
							case "battleDrop":	  HiroFriends.log.count_fort  += count; HiroFriends.log.received += count; break;
							case "adventureDrop": HiroFriends.log.count_mpi   += count; HiroFriends.log.received += count; break;
							case "itemUse":		  HiroFriends.log.count_item  += count; HiroFriends.log.received += count; break;
							case "wofPay":
								HiroFriends.log.used += count;
								if (null !== val.details) {
									if (val.details == "timerreset") {
										HiroFriends.log.count_reset += count;
										++ HiroFriends.log.times_reset;
									} else if(val.details == "sneakyshot") {
										HiroFriends.log.count_bribe += count;
										++ HiroFriends.log.times_bribe;
									}
								}
								break;
							default:
								HiroFriends.log.count_other += count;
								HiroFriends.log.received += count;
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
				HiroFriends.pendingInvitations = openReq;
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
			return this.fetch().done(function() { HiroFriends.getPendingInvitations().done(function() { HiroFriends.display('time'); });});
		},
		pendingInvitationsMsg: function() { return this.pendingInvitations == 1 ? this.localeMsg('pendingInvitation') : this.pendingInvitations+' '+this.localeMsg('pendingInvitations'); },
		removeFriend: function(charId) {
			new west.gui.Dialog(HiroFriends.localeMsg('removeFriend'), HiroFriends.localeMsg('removeConfirm')).setIcon(west.gui.Dialog.SYS_QUESTION).addButton("yes", function() {
				Ajax.remoteCall('character', 'cancel_friendship', { friend_id: charId }, function(json) {
					if(json["result"]) {
						new UserMessage(HiroFriends.localeMsg('removeSuccess'), UserMessage.TYPE_SUCCESS).show();
						$("div.hiroFriendRow_" + charId).remove();
						$("div.friendData_" + charId, FriendslistWindow.DOM).remove();
						delete(HiroFriends.friends[charId]);
						if(HiroFriends.avail) -- HiroFriends.avail;
						if(HiroFriends.total) -- HiroFriends.total;
						HiroFriends.updateCounter();
						Chat.Friendslist.removeFriend(charId);
					}
					else new UserMessage(HiroFriends.localeMsg('removeFailed'), UserMessage.TYPE_ERROR).show();
				});
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
			setTimeout(function() { HiroFriends.updateTimer(); }, seconds * 1e3);
		},
		scriptInit: function(tries, maxTries) {
			var ev, eventName;
			if(tries >= maxTries) return false;
			if(Game && Game.loaded && Character.playerId) {
				this.locale = (undefined === Game.locale || undefined == this.messages[Game.locale]) ? "en_US" : Game.locale;
				this.api.setGui(this.localeMsg('description'));
				try {
					$.getScript(versionURL).done(function() {
						if(HiroFriends.latestVersion && HiroFriends.latestVersion > VERSION) {
							var upgradeDialog = new west.gui.Dialog(scriptName, HiroFriends.localeMsg('upgrade'), west.gui.Dialog.SYS_WARNING).addButton('ok', function() {
								try { upgradeDialog.hide(); location.href = codeURL; } catch(e) {}
							}).addButton('cancel').show();
						}
					});
				}
				catch(e) { }
				for(eventName in Game.sesData) {
					if(!Game.sesData.hasOwnProperty(eventName)) continue;
					ev = Game.sesData[eventName];
					if(!ev.friendsbar) continue;
					if('Hearts' == eventName || 'Easter' == eventName || 'Independence' == eventName || 'DayOfDead' == eventName || 'Octoberfest' == eventName) {
						this.getPendingInvitations().done(function() {
							if(HiroFriends.eventManager(eventName)) HiroFriends.fetch();
						});
						return false;
					}
				}
				return true;
			}
			++ tries;
			setTimeout(function() { HiroFriends.scriptInit(tries, maxTries); }, tries * 1e3);
		},
	};
	try { HiroFriends.scriptInit(0, 100); } catch(e) { }
});