// ==UserScript==
// @name               TW Friends IT
// @name:it            TW Friends Italiano
// @version            0.28
// @license            LGPLv3
// @description        Friend Management for The West Events
// @description:it     Gestione Amici nei eventi The West
// @author             hiroaki
// @translation        Jackson (it_IT)
// @include            http*://*.the-west.*/game.php*
// @include            http*://*.tw.innogames.*/game.php*
// @grant              none
// @namespace          https://greasyfork.org/users/3197
// @icon               https://cdn.rawgit.com/TWFriends/scripts/master/friends.png
// @downloadURL https://update.greasyfork.org/scripts/31148/TW%20Friends%20IT.user.js
// @updateURL https://update.greasyfork.org/scripts/31148/TW%20Friends%20IT.meta.js
// ==/UserScript==

function hiroFriendsScript(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
}
hiroFriendsScript(function() {
    var VERSION = 0.28;
    var installURL = "https://greasyfork.org/it/scripts/31148-tw-friends-it";
    var codeURL = "https://greasyfork.org/scripts/31148-tw-friends-it/code/TW%20Friends%20IT.user.js";
    var versionURL = "https://gist.githubusercontent.com/TWFriends/974718d615afe3d2c2a2/raw/version?"+Date.now();
    var scriptName = "TW Friends Italiano";
    var scriptAuthor = "hiroaki";
    var scriptTranslate = "Jackson";
    var refreshMs = 10 * 60 * 1e3;   // 10 minutes
    var enableLog = true;
    var enableInv = true;
    var enableVersionCheck = false;
    HiroFriends = {
        api: TheWestApi.register('HiroFriends', scriptName, '2.04', Game.version.toString(), scriptAuthor, scriptTranslate, installURL),
        version: VERSION,
        latestVersion: undefined,
        storageItem: "HiroFriends.version",
        cdnBase: '',
        eventCurrencyImage : '',
        eventName : '',
        eventInfo : {},
        eventEndStamp : 0,
        friends : {},
        interval: false,
        locale: 'it_IT',
        pendingInvitations: 0,
        messages: {
            it_IT: {
                description: '<h1>Gestione Amici nei eventi The West</h1><p style="margin: 8pt;">Eventi supportati:</p><ul style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;"><li>Il Giorno di SanValentino</li><li>Pasqua</li><li>Giorno dell&#039;Indipendenza</li><li>Oktoberfest</li><li>Il giorno della morte</li></ul><p style="margin: 8pt;"><a target="_blank" href="https://greasyfork.org/it/users/136590-ruslan-jackson">Feedback</a>: Translation error. </p><p style="margin: 8pt;"><b>Credits</b>: Jackson</p>',
                version: 'versione',
                upgrade: 'Nuova versione disponibile. Vuoi aggiornare adesso?',
                refresh: 'Aggiorna',
                timeLeft: 'Tempo rimasto alla fine dell&#039;evento',
                serverTime: 'orario server',
                availFriends: 'Totale amici che puoi inviare adesso',
                totalFriends: 'Totale amici',
                pendingInvitation: 'Invito in attesa',
                pendingInvitations: 'inviti in attesa',
                noFriends: 'Non ci sono amici',
                name: 'Nome',
                received: 'Ricevuto',
                frequency: 'Frequenza',
                removeFriend: 'Cancella amico',
                removeConfirm: 'Sei sicuro di voler rimouvere l&#039;amico dalla lista?',
                removeSuccess: 'L&#039;amico rimosso con successo.',
                removeFailed: 'Impossibile rimuovere l&#039;amico',
                exporter: 'Esporta',
                everything: 'Tutto',
                stats: 'Statistiche',
                since: 'dal',
                collected: 'Collezionate',
                friends: 'Amici',
                jobs: 'Lavori',
                fortBattles: 'Bataglie ai forti',
                adventures: 'Avventure',
                duels: 'Duelli',
                npcDuels: 'NPC Duelli',
                construction: 'Costruzioni',
                quests: 'Missioni',
                itemUse: 'Oggetti usati',
                other: 'Altro',
                used: 'Usato',
                timerReset: 'Reseta orario',
                bribe: 'Bribe',
                gameAction: 'Azione evento del gioco',
                inventory: 'Inventario',
                nextYear: 'Anno prossimo',
                theEnd: 'Fine',
            },
        },
        timeLeft : 0,
        total : 0,
        avail: 0,
        log: { firstLog: Date.now()/1e3, lastLog: 0, newLastLog: 0, friendLog: {}, entries: [], count_friends: 0, count_job: 0, count_duel: 0, count_npc: 0, count_fort: 0, count_mpi: 0, count_quest: 0, count_build: 0, count_item: 0, count_other: 0, count_reset: 0, count_bribe: 0, count_action: 0, times_reset: 0, times_bribe: 0, received: 0, used: 0 },
        spanCounter: $("<span />", { id: "hiro_friends_counter", style: "position: absolute; right: 5px; color: #f8c57c; font-size: 13pt; height: 25px; line-height: 25px; bottom: 0px" }),
        spanInvitations: null,
        spanTimeLeft: null,
        divFriendsAvail: null,
        imgFriendsAvail: null,
        /* Inno buildDateObject() function currently buggy */
        buildDateObject: function(timeStr, isServerTime) {
            var regEx, match, d = new Date(0), today = new Date();
            regEx = /^(?:(3[01]|[012]?[0-9]|\*)\.(?:(1[012]|0?[1-9]|\*)\.((?:19|20)?\d\d|\*)))?(?: ?(2[0-3]|[01]?\d|\*)\:([0-5]?\d|\*)(?:\:([0-5]?\d|\*))?)?$/;
            if(match = timeStr.match(regEx)) {
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
        buildTimeStamp: function (timeStr, isServerTime) {
            return this.buildDateObject(timeStr, isServerTime).getTime();
        },
        items: {
            Hearts: {
                2557000 : 1250,     /* Small Heart Bag - 1250 hearts */
                2558000 : 2500,     /* Large Heart Bag - 2500 hearts */
                2561000 : 100,      /* Love Apple - 100 hearts */
                2562000 : 500,      /* Sugar hearts - 500 hearts */
                2563000 : 650,      /* 650 hearts */
                2564000 : 1500,     /* 1500 hearts */
                2565000 : 3250,     /* 3250 hearts */
                2566000 : 9000,     /* 9000 hearts */
                2567000 : 16000,    /* 16000 hearts */
            },
            Easter: {
                2698000 : 2500,     /* Efficient Easter egg container - 2500 eggs */
                2590000 : 650,      /* 650 Eggs */
                2591000 : 1500,     /* 1500 Eggs */
                2592000 : 3250,     /* 3250 Eggs */
                2593000 : 9000,     /* 9000 Eggs */
                2594000 : 16000,    /* 16000 Eggs */
            },
            Independence: {
                2619000 : 650,
                2620000 : 1500,
                2621000 : 3250,
                2622000 : 9000,
                2623000 : 16000,
            },
            Octoberfest: {
                371000 : 650,
                973000 : 1500,
                974000 : 3250,
                975000 : 9000,
                976000 : 16000,
            },
            DayOfDead: {
                2665000 : 1250,     /* Flower pot - 1250 Cempasúchil flowers */
                2666000 : 2500,     /* Big Flower pot - 2500 Cempasúchil flowers */
                2675000 : 25,       /* Cempasúchil Case - 25 Cempasúchil flowers */
                2676000 : 650,
                2677000 : 1500,
                2678000 : 3250,
                2679000 : 9000,
                2680000 : 16000,
            }
        },
        eventItems: {
            divInventory: null,
            imgInventory: null,
            imgTitle: '',
            Inventory: [],
            Available: [],
            total: 0,
            coolDownComplete: false,
            check: function () {
                HiroFriends.eventItems.Inventory = [];
                HiroFriends.eventItems.Available = [];
                HiroFriends.eventItems.total = 0;
                HiroFriends.eventItems.coolDownComplete = false;
                if(undefined === HiroFriends.items[HiroFriends.eventName]) return false;
                var now = new ServerDate().getTime()/1e3, coolDown, invItem;
                $.each(HiroFriends.items[HiroFriends.eventName], function(itemId, amount) {
                    invItem = Bag.getItemByItemId(itemId);
                    if(invItem) {
                        HiroFriends.eventItems.Inventory.push(invItem);
                        coolDown = Bag.itemCooldown[itemId];
                        if(!coolDown) {
                            HiroFriends.eventItems.Available.push(invItem);
                            HiroFriends.eventItems.total += invItem.count*amount;
                        }
                        else if(coolDown <= now) {
                            HiroFriends.eventItems.coolDownComplete = true;
                            HiroFriends.eventItems.Available.push(invItem);
                            HiroFriends.eventItems.total += amount;
                        }
                    }
                });
                HiroFriends.eventItems.imgInventory.attr('src', HiroFriends.eventItems.coolDownComplete ? HiroFriends.cdnBase+'/images/icons/clock.png' : HiroFriends.eventCurrencyImage);
                HiroFriends.eventItems.imgInventory.attr('title', HiroFriends.eventItems.total ? HiroFriends.eventItems.total+' <img src="' + HiroFriends.eventCurrencyImage + '" alt="">' : '');
                return true;
            },
            display: function() {
                HiroFriends.eventItems.check();
                if(HiroFriends.eventItems.Inventory.length > 0) {
                    if(!Bag.loaded) {
                        EventHandler.listen('inventory_loaded', function () {
                            Wear.open();
                            Inventory.showSearchResult(HiroFriends.eventItems.Inventory);
                            return EventHandler.ONE_TIME_EVENT;
                        });
                        Bag.loadItems();
                    }
                    else {
                        Wear.open();
                        Inventory.showSearchResult(HiroFriends.eventItems.Inventory);
                    }
                }
                HiroFriends.eventItems.divInventory.hide();
            },
        },
        display: function(sort) {
            var friend_time, server_time = Game.getServerTime();
            var maindiv = $('<div class="hiro_friends_maindiv" />');
            var friends = [];
            for(var key in this.friends) if(this.friends.hasOwnProperty(key)) friends.push({ id: key, name: this.friends[key].name, activation_time: this.friends[key].activation_time, recv: this.friends[key].recv });
            if(!friends.length) $('<h1 style="text-align: center; color: #990000; margin-bottom: 80px;">'+this.localeMsg('noFriends')+'</h1>').appendTo(maindiv);
            else {
                var hiroTable;
                switch(sort) {
                    case "name"     :   friends.sort(this.sortByName); break;
                    case "name_desc":   friends.sort(this.sortByName).reverse(); break;
                    case "recv"     :   friends.sort(this.sortByRecv); break;
                    case "recv_asc" :   friends.sort(this.sortByRecv).reverse(); break;
                    case "time_asc" :   friends.sort(this.sortByTime).reverse(); break;
                    case "time" :
                    default     :   sort = "time"; friends.sort(this.sortByTime);
                }
                var thName = $('<a style="cursor: pointer;"><img src="'+this.cdnBase+'/images/icons/user.png" alt="" />&nbsp;'+this.localeMsg('name')+'</a>').click(function(){ HiroFriends.display(sort == 'name' ? 'name_desc' : 'name'); return false; });
                var thAction = $('<a style="cursor: pointer;"><img src="'+this.cdnBase+'/images/icons/clock.png" alt="" />&nbsp;'+this.eventInfo.label+'</a>').click(function(){ HiroFriends.display(sort == 'time' ? 'time_asc' : 'time'); return false; });
                var thRecv = enableLog ? $('<a style="cursor: pointer;" title="'+this.localeMsg('since')+' '+new Date(this.log.firstLog*1e3).toDateTimeString()+'"><img src="'+this.cdnBase+'/images/icons/watch.png" alt="" />&nbsp;'+this.localeMsg('received')+'</a>').click(function(){ HiroFriends.display(sort == 'recv' ? 'recv_asc' : 'recv'); return false; }) : '';
                hiroTable = new west.gui.Table().appendTo(maindiv).addColumn("hf_idx").addColumn("hf_player").addColumn("hf_action").addColumn("hf_log").addColumn("hf_delete").appendToCell("head", "hf_idx", '&nbsp;').appendToCell("head", "hf_player", thName).appendToCell("head", "hf_action", thAction).appendToCell("head","hf_log",thRecv).appendToCell("head", "hf_delete", '&nbsp;');
                var idx = 1;
                var now = Date.now()/1e3;
                $.each(friends, function(key, val) {
                    var actionCell, recvCell;
                    friend_time = val.activation_time + HiroFriends.eventInfo.cooldown - server_time;
                    if(friend_time > HiroFriends.timeLeft) actionCell = '('+HiroFriends.localeMsg('nextYear')+')';
                    else if(friend_time > 0) actionCell = '('+friend_time.formatDurationBuffWay()+')';
                    else {
                        actionCell = $('<a style="cursor: pointer;">'+HiroFriends.eventInfo.label+'</a>').click({ id: val.id, ev: HiroFriends.eventName }, function(e) {
                            $(this).parent().parent().remove();
                            Ajax.remoteCall("friendsbar", "event", { player_id: val.id, event: HiroFriends.eventName }, function(response) {
                                if(response.error) return MessageError(response.msg).show();
                                MessageSuccess(response.msg).show();
                                HiroFriends.friends[val.id].activation_time = Date.now()/1e3;
                                if(HiroFriends.avail) -- HiroFriends.avail;
                                HiroFriends.updateCounter();
                                if(WestUi.FriendsBar.friendsBarUi !== null)
                                    WestUi.FriendsBar.friendsBarUi.friendsBar.eventActivations[val.id][HiroFriends.eventName] = response.activationTime;
                            });
                            return false;
                        });
                    }
                    recvCell = '';
                    if(enableLog) {
                        if(val.recv) {
                            var recv_list = '';
                            HiroFriends.log.friendLog[val.id].dates.sort(function(a, b){ return new Date(a)-new Date(b); });
                            if(HiroFriends.log.friendLog[val.id].total && HiroFriends.log.friendLog[val.id].dates.length > 1) {
                                recv_list += '<p style=&quot;text-align: center; margin-bottom: 8px;&quot;>'+HiroFriends.localeMsg('frequency')+': <b>'+((now - HiroFriends.log.friendLog[val.id].dates[0]) / (HiroFriends.log.friendLog[val.id].dates.length-1)).formatDuration()+'</b></p>';
                            }
                            recv_list += '<ol style=&quot;list-style-type: decimal; padding: 0 0 0 20px;&quot;>';
                            $.each(HiroFriends.log.friendLog[val.id].dates, function(dkey, dval) {
                                recv_list += '<li style=&quot;display: list-item; white-space: nowrap;&quot;>' + new Date(dval * 1e3).toDateTimeStringNice() + '</li>';
                            });
                            recv_list += '<ol>';
                            recvCell = '<span title="'+recv_list+'" style="cursor: help;">'+val.recv+'</span>';
                        }
                        else recvCell = val.recv;
                    }
                    hiroTable.appendRow(null, 'hiroFriendRow_'+val.id)
                        .appendToCell(-1, "hf_idx", idx)
                        .appendToCell(-1, "hf_player", '<a href="javascript:void(PlayerProfileWindow.open('+val.id+'));">' + val.name + '</a>')
                        .appendToCell(-1, "hf_action", actionCell)
                        .appendToCell(-1, "hf_log", recvCell)
                        .appendToCell(-1, "hf_delete", '<a href="javascript:void(HiroFriends.removeFriend('+val.id+'));"><img style="width:16px; height: 16px;" title="'+HiroFriends.localeMsg('removeFriend')+'" src="'+HiroFriends.cdnBase+'/images/icons/delete.png" alt="delete" /></a>');
                    ++ idx;
                });
                hiroTable.appendToCell('foot', 'hf_idx', '<a target="_blank" href="'+installURL+'"><img src="'+this.cdnBase+'/images/icons/link.png" alt=""></a>');
                hiroTable.appendToCell('foot', 'hf_player', '<a target="_blank" href="'+installURL+'">'+scriptName+'</a> '+this.localeMsg('version')+' ' + this.version.toFixed(2));
                if('https://it1.the-west.it' == Game.gameURL || 'https://it13.the-west.it' == Game.gameURL || 'https://it5.the-west.gr' == Game.gameURL) hiroTable.appendToCell('foot', 'hf_action', 'tradotto da <a href="javascript:void(PlayerProfileWindow.open(542314));">'+scriptTranslate+'</a>');
                else if('https://zz1.beta.the-west.net' == Game.gameURL) hiroTable.appendToCell('foot', 'hf_action', 'by <a href="javascript:void(PlayerProfileWindow.open(542314));">'+scriptTranslate+'</a>');
                else hiroTable.appendToCell('foot', 'hf_action', 'trad. '+scriptTranslate);
                if(this.pendingInvitations) hiroTable.appendToCell('foot', 'hf_delete', '<a href="javascript:void(FriendslistWindow.open(\'openrequests\'));"><img style="width:16px; height: 16px;" title="'+this.pendingInvitationsMsg()+'" src="'+this.cdnBase+'/images/icons/friends.png" alt="add" /></a>');
                if(enableLog) hiroTable.appendToCell('foot', 'hf_log', $('<a style="cursor: pointer;">'+HiroFriends.localeMsg('exporter')+'</a>').click(function() {
                    HiroFriends.log.entries.sort(function(a,b) { return a.date - b.date; });
                    var tsv_friends = "id\t"+HiroFriends.localeMsg('name')+"\t"+HiroFriends.localeMsg('received')+"\r\n";
                    $.each(HiroFriends.log.friendLog, function(key,val) { tsv_friends += key+"\t"+val.name+"\t"+val.total+"\r\n"; });
                    new west.gui.Dialog(HiroFriends.localeMsg('exporter'),'<b>'+HiroFriends.localeMsg('friends')+'</b> (<a download="TW Friends - '+HiroFriends.eventName+' - '+ Game.worldName+' - '+Character.name+' - '+HiroFriends.localeMsg('friends')+' - '+Date.now()+'.tsv" href="data:text/tab-separated-values,'+encodeURI(tsv_friends)+'">TSV</a>):<br /><textarea cols="60" rows="8" style="width: 100%; height: 100px;">' + JSON.stringify(HiroFriends.log.friendLog) + '</textarea><br /><b>'+HiroFriends.localeMsg('everything')+'</b>:<br /><textarea cols="60" rows="8" style="width: 100%; height: 100px;">' + JSON.stringify(HiroFriends.log.entries) + '</textarea>').setModal(true,true,{bg:HiroFriends.cdnBase+'/images/curtain_bg.png',opacity:0.7}).addButton("ok").show();
                    return false;
                }) );
            }
            if(enableLog || this.eventItems.total) {
                var statsTable = '<table style="margin: auto; width: 96%;">';
                if(enableLog) statsTable += '<tr><th colspan="3" style="border-bottom: 1px dotted;">'+this.localeMsg('stats')+' ('+this.localeMsg('since')+' '+new Date(this.log.firstLog*1e3).toDateTimeString()+')</th></tr><tr style="vertical-align: top;"><td style="white-space: nowrap;">'+this.localeMsg('collected')+':</td><td style="color: #006600; font-weight: bold; text-align: right; padding-right: 8pt;">'+this.log.received+'</td><td> <span style="white-space: nowrap;">'+this.localeMsg('friends')+': <b>'+this.log.count_friends+'</b>,</span> <span style="white-space: nowrap;">'+this.localeMsg('jobs')+': <b>'+this.log.count_job+'</b>,</span> <span style="white-space: nowrap;">'+this.localeMsg('fortBattles')+': <b>'+this.log.count_fort+'</b>,</span> <span style="white-space: nowrap;">'+this.localeMsg('adventures')+': <b>'+this.log.count_mpi+'</b>,</span> <span style="white-space: nowrap;">'+this.localeMsg('duels')+': <b>'+this.log.count_duel+'</b>,</span> <span style="white-space: nowrap;">'+this.localeMsg('npcDuels')+': <b>'+this.log.count_npc+'</b>,</span> <span style="white-space: nowrap;">'+this.localeMsg('construction')+': <b>'+this.log.count_build+'</b>,</span> <span style="white-space: nowrap;">'+this.localeMsg('quests')+': <b>'+this.log.count_quest+'</b>,</span> <span style="white-space: nowrap;">'+this.localeMsg('itemUse')+': <b>'+this.log.count_item+'</b>,</span> <span style="white-space: nowrap;">'+this.localeMsg('other')+': <b>'+this.log.count_other+'</b></span></td></tr>'+(this.log.used?'<tr style="vertical-align: top;"><td style="white-space: nowrap;">'+this.localeMsg('used')+':</td><td style="color: #660000; font-weight: bold; text-align: right; padding-right: 8pt;">'+this.log.used+'</td><td>'+(this.log.count_reset?'<span style="white-space: nowrap;">'+this.localeMsg('timerReset')+': <b>'+this.log.count_reset+'</b> (#'+this.log.times_reset+'),</span> ' : '')+(this.log.count_action?'<span style="white-space: nowrap;">'+this.localeMsg('gameAction')+': <b>'+this.log.count_action+'</b>,</span> ' : '')+(this.log.count_bribe?'<span style="white-space: nowrap;">'+this.localeMsg('bribe')+': <b>'+this.log.count_bribe+'</b> (#'+this.log.times_bribe+')</span>' : '')+'</td></tr>' : '');
                if(this.eventItems.total) statsTable += '<tr><td style="white-space: nowrap;">'+this.localeMsg('inventory')+':</td><td style="text-align: right; padding-right: 8pt;"><a href="javascript:void(HiroFriends.eventItems.display());">'+this.eventItems.total+'</a></td><td>&nbsp;</td></tr>';
                statsTable += '</table>';
                $(statsTable).appendTo(maindiv);
            }
            var hiroPane = new west.gui.Scrollpane();
            hiroPane.appendContent(maindiv);
            var hiroWindow = wman.open("HiroFriends_"+this.eventName, null, "noreload").setMiniTitle(this.eventInfo.label).setTitle(this.eventInfo.label).appendToContentPane(hiroPane.getMainDiv());
        },
        eventManager: function(eventName) {
            if(undefined === Game.sesData[eventName] || undefined === Game.sesData[eventName].friendsbar) return false;
            this.eventName = eventName;
            this.eventInfo = Game.sesData[eventName].friendsbar;
            if(undefined === Game.sesData[this.eventName].meta.end) return false;
            this.eventEndStamp = (this.buildTimeStamp(Game.sesData[this.eventName].meta.end) - Game.serverTimeDifference) / 1e3;
            this.timeLeft = this.eventEndStamp - Game.getServerTime();
            if(this.timeLeft < 0) return false;
            this.cdnBase = (undefined === Game.cdnURL) ? "https://westzzs.innogamescdn.com" : Game.cdnURL;
            $.when(this.getLog()).done(function() {
                HiroFriends.design();
            });
        },
        design: function() {
            HiroFriends.spanTimeLeft = $("<span />", { id: "hiro_event_timeleft", style: "position: absolute; left: 5px; color: #d3d3d3; font-size: 11px; height: 25px; line-height: 25px; cursor: pointer", title: HiroFriends.localeMsg('timeLeft')+'<br />('+new Date(HiroFriends.buildTimeStamp(Game.sesData[HiroFriends.eventName].meta.end)).toDateTimeStringNice()+' '+HiroFriends.localeMsg('serverTime')+')' });
            var eventImage = HiroFriends.cdnBase + "/images/interface/friendsbar/events/" + HiroFriends.eventName + ".png"; // event based
            if(HiroFriends.eventName == 'Octoberfest') eventImage = HiroFriends.cdnBase + "/images/window/events/octoberfest/pretzels_icon.png";
            var divContainer = $("<div />", { id: "hiro_friends_container", style: "position: absolute; top: 32px; right: 50%; margin-right: 120px; z-index: 16; width: 180px; height: 36px; text-align: left; text-shadow: 1px 1px 1px #000; background: url('"+HiroFriends.cdnBase+"/images/interface/custom_unit_counter_sprite.png?2') no-repeat scroll 50% 0px transparent;" })
            var divCounter = $("<div />", { id: "hiro_friends", style: "background: url('"+HiroFriends.cdnBase+"/images/interface/custom_unit_counter_sprite.png?2') no-repeat scroll 0 -36px rgba(0, 0, 0, 0); height: 25px; left: 32px; line-height: 25px; padding: 0 5px; position: absolute; top: 3px; width: 105px; z-index: 1; text-shadow: 1px 1px 1px #000;" });
            var divRefresh = $("<div />", { style: "width: 24px; height: 24px; position: absolute; left: 8px; top: 3px; z-index: 3; padding: 4px 0px 0px 4px;" });
            var spanRefresh = $('<span />', { title: HiroFriends.localeMsg('refresh'), style: "display: inline-block; width: 20px; height: 20px; cursor: pointer; background: url('"+HiroFriends.cdnBase+"/images/tw2gui/window/window2_buttons.png?5') repeat scroll 0px -20px transparent;" });
            var spanSend = $("<span />", { style: "width: 26px; height: 26px; left: auto; position: absolute; right: 7px; top: 2px; z-index: 3;" });
            var imageSend = $("<img />", { src: eventImage, title: HiroFriends.eventInfo.label, style: "width: 26px; height: 26px; cursor: pointer" });
            if(HiroFriends.pendingInvitations) {
                HiroFriends.spanCounter.css("right", "20px");
                HiroFriends.spanInvitations = $("<span />", { id: "hiro_friends_invitations", title: HiroFriends.pendingInvitationsMsg(), style: "position: absolute; right: 0px; width: 19px; height: 25px; background-image: url('"+HiroFriends.cdnBase+"/images/interface/more.jpg'); background-repeat: no-repeat;" });
                HiroFriends.spanInvitations.hover(function() { $(this).css("background-position", "0px -25px"); }, function() { $(this).css("background-position", ""); });
                HiroFriends.spanInvitations.click(function() { $(this).hide(); HiroFriends.spanCounter.css("right", "5px"); FriendslistWindow.open('openrequests'); return false; });
                divCounter.append(HiroFriends.spanInvitations);
            }
            divContainer.append(divRefresh.append(spanRefresh), spanSend.append(imageSend), divCounter.append(HiroFriends.spanTimeLeft, HiroFriends.spanCounter)).appendTo("#user-interface");
            spanRefresh.hover(function() { $(this).css("background-position", ""); }, function() { $(this).css("background-position", "0px -20px"); });
            spanRefresh.click(function() { HiroFriends.spanCounter.slideUp(500, function() { HiroFriends.fetch(); }).slideDown(1500); return false; });
            imageSend.click(function() { HiroFriends.open(); return false; });
            HiroFriends.eventCurrencyImage = "/images/icons/"+HiroFriends.eventName+".png";
            if(enableInv) {
                HiroFriends.eventItems.divInventory = $("<div />", { id: "hiro_friends_inventory_container", style: "position: absolute; top: 0px; right: 0px; z-index: 18; width: 20px; height: 18px;" }).hide().appendTo("#ui_bottombar .ui_bottombar_wrapper .button:first .dock-image");
                HiroFriends.eventItems.imgInventory = $('<img src="'+HiroFriends.eventCurrencyImage+'" alt="" title="">').click(function(e){ e.preventDefault(); HiroFriends.eventItems.display(); return false; }).appendTo(HiroFriends.eventItems.divInventory);
            }
            HiroFriends.divFriendsAvail = $("<div />", { id: "hiro_friends_bottombar_friends", style: "position: absolute; top: 0px; right: 0px; z-index: 18; width: 20px; height: 18px;" }).hide().appendTo("#ui_bottombar .ui_bottombar_wrapper .button:nth-child(3) .dock-image");
            HiroFriends.imgFriendsAvail = $('<img src="'+HiroFriends.eventCurrencyImage+'" alt="" title="'+scriptName+'">').click(function(e){ e.preventDefault(); HiroFriends.open(); return false; }).appendTo(HiroFriends.divFriendsAvail);
            HiroFriends.updateTimer();
            if(typeof(Storage) !== "undefined") {
                var previousVersion = (localStorage.getItem(HiroFriends.storageItem) === null) ? 0 : parseFloat(localStorage.getItem(HiroFriends.storageItem));
                localStorage.setItem(HiroFriends.storageItem, HiroFriends.version);
                // if(previousVersion && HiroFriends.version > previousVersion) var msg=new west.gui.Dialog("TW Friends", "Script upgraded to version "+HiroFriends.version, west.gui.Dialog.SYS_WARNING).addButton("OK").show();
            }
            $("<style>.hf_idx { width: 32px; text-align: right; padding-right: 8px; } .hf_player { width: 250px; } .hf_action { width: 200px; } .hf_log { width: 100px; text-align: right; padding-right: 8px; } .hf_delete { width: 40px; text-align: center; } div.tbody .hf_idx, div.tbody .hf_delete { background-image: url('"+HiroFriends.cdnBase+"/images/tw2gui/table/cell_shadow_y.png'); }</style>").appendTo("head");
            HiroFriends.fetch();
        },
        fetch: function() {
            if(this.interval !== false) clearInterval(this.interval);
            var event_times = {};
            var friends = {}, total = 0, avail = 0, recv = 0;
            var server_time = Game.getServerTime(), activation_time, friend_time;
            if(this.timeLeft < 0) {
                $("#hiro_friends_container").slideUp(5000);
                if(enableInv) HiroFriends.eventItems.divInventory.hide(5000);
                throw "Event is over";
            }
            if(enableInv) {
                if(HiroFriends.eventItems.check() && HiroFriends.eventItems.Available.length > 0)
                    HiroFriends.eventItems.divInventory.show(5000);
                else HiroFriends.eventItems.divInventory.hide();
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
                HiroFriends.updateCounter();
                if(HiroFriends.avail) {
                    HiroFriends.imgFriendsAvail.attr('title', 'TW Friends: '+HiroFriends.avail+'/'+HiroFriends.total);
                    HiroFriends.divFriendsAvail.show(5000);
                }
                else HiroFriends.divFriendsAvail.hide();
                HiroFriends.interval = setInterval(function() { HiroFriends.fetch(); }, refreshMs);
            });
        },
        getLogPage: function(page, limit, deferred) {
            return $.ajax({ type: "POST", url: "/game.php?window=ses&mode=log", data: { ses_id: HiroFriends.eventName, page: page, limit: limit }, success: function(data) {
                var details;
                var hasNext = data.hasNext;
                var count = 0;
                var limit = data.limit;
                page = data.page + 1;
                $.each(data.entries, function(key, val) {
                    count = parseInt(val.value);
                    if(val.date < HiroFriends.log.firstLog) HiroFriends.log.firstLog = val.date;
                    if(val.date <= HiroFriends.log.lastLog) {
                        hasNext = false;
                        return false;
                    }
                    HiroFriends.log.entries.push(val);
                    if(val.date > HiroFriends.log.newLastLog) {
                        HiroFriends.log.newLastLog = val.date;
                    }
                    switch(val.type) {
                        case "friendDrop":
                            if(null !== val.details) {
                                details = JSON.parse(val.details);
                                if(undefined !== HiroFriends.friends[details.player_id]) HiroFriends.friends[details.player_id].recv += count;
                                if(undefined === HiroFriends.log.friendLog[details.player_id]) HiroFriends.log.friendLog[details.player_id] = { name: details.name, total: count, dates: [] };
                                else HiroFriends.log.friendLog[details.player_id].total += count;
                                HiroFriends.log.friendLog[details.player_id].dates.push(val.date);
                            }
                            HiroFriends.log.count_friends += count;
                            HiroFriends.log.received += count;
                            break;
                        case "jobDrop":     HiroFriends.log.count_job += count; HiroFriends.log.received += count; break;
                        case "buildDrop":   HiroFriends.log.count_build += count; HiroFriends.log.received += count; break;
                        case "duelDrop":    HiroFriends.log.count_duel += count; HiroFriends.log.received += count; break;
                        case "duelNPCDrop": HiroFriends.log.count_npc += count; HiroFriends.log.received += count; break;
                        case "battleDrop":  HiroFriends.log.count_fort += count; HiroFriends.log.received += count; break;
                        case "adventureDrop":   HiroFriends.log.count_mpi += count; HiroFriends.log.received += count; break;
                        case "questDrop":   HiroFriends.log.count_quest += count; HiroFriends.log.received += count; break;
                        case "itemUse":     HiroFriends.log.count_item += count; HiroFriends.log.received += count; break;
                        case "wofPay":
                            HiroFriends.log.used += count;
                            if(null !== val.details) {
                                if(val.details == "timerreset") {
                                    HiroFriends.log.count_reset += count;
                                    ++ HiroFriends.log.times_reset;
                                }
                                else if(val.details == "sneakyshot") {
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
                if (hasNext) return HiroFriends.getLogPage(page, limit, deferred);
                else {
                    /* Done */
                    HiroFriends.log.lastLog = HiroFriends.log.newLastLog;
                    Chat.Request.Nop();
                    deferred.resolve();
                }
            } });
        },
        getLog: function() {
            if(enableLog) {
                var deferred = new $.Deferred();
                var limit = 100;
                HiroFriends.log.newLastLog = HiroFriends.log.lastLog;
                this.getLogPage(1, limit, deferred);
                return deferred.promise();
            }
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
            $.when(this.getLog()).done(function() {
                HiroFriends.fetch().done(function() {
                    HiroFriends.divFriendsAvail.hide();
                    HiroFriends.getPendingInvitations().done(function() {
                        HiroFriends.display('time');
                    });
                });
            });
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
            setTimeout(function() { HiroFriends.updateTimer(); }, seconds * 1e3);
        },
        scriptInit: function(tries, maxTries) {
            var ev, eventName;
            if(tries >= maxTries) return false;
            if(Game && Game.loaded && Character.playerId) {
                this.locale = (undefined === Game.locale || undefined == this.messages[Game.locale]) ? "en_US" : Game.locale;
                this.api.setGui(this.localeMsg('description'));
                if (enableVersionCheck) {
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
                }
                for(eventName in Game.sesData) {
                    if(!Game.sesData.hasOwnProperty(eventName)) continue;
                    var ev = Game.sesData[eventName];
                    if(!ev.friendsbar) continue;
                    if('Hearts' == eventName || 'Easter' == eventName || 'Independence' == eventName || 'DayOfDead' == eventName || 'Octoberfest' == eventName) {
                        this.getPendingInvitations().done(function() {
                            HiroFriends.eventManager(eventName);
                        });
                        return false;
                    }
                }
                return true;
            }
            ++ tries;
            setTimeout(function() { HiroFriends.scriptInit(tries, maxTries); }, tries * 1e3);
        },
    }
    try { HiroFriends.scriptInit(0, 100); } catch(e) { }
});

