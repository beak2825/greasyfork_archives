// ==UserScript==
// @name           	Mutik's DotD Script
// @namespace      	tag://kongregate
// @description    	Fork of ForTheGoodOfAll DotD script with new look and strongly optimized js code
// @author         	Mutik
// @version        	1.1.44
// @grant          	GM_xmlhttpRequest
// @grant          	GM_setValue
// @grant          	GM_getValue
// @grant          	unsafeWindow
// @include        	http://www.kongregate.com/games/5thPlanetGames/dawn-of-the-dragons*
// @include        	*50.18.191.15/kong/?DO_NOT_SHARE_THIS_LINK*
// @hompage        	http://www.dotdraids.pl
// @downloadURL https://update.greasyfork.org/scripts/12212/Mutik%27s%20DotD%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/12212/Mutik%27s%20DotD%20Script.meta.js
// ==/UserScript==

//best loop atm: for(var i=0, l=obj.length; i<l; ++i) - for with caching and pre-increment

if (window.location.host == "www.kongregate.com") {
    function main() {

        if (typeof GM_setValue == 'undefined') {
            var GM_setValue = function (name, value) {
                localStorage.setItem(name, (typeof value).substring(0, 1) + value);
            };
        }
        if (typeof GM_getValue == 'undefined') {
            var GM_getValue = function (name, dvalue) {
                var value = localStorage.getItem(name);
                if (typeof value != 'string') return dvalue;
                else {
                    var type = value.substring(0, 1);
                    value = value.substring(1);
                    if (type == 'b') return (value == 'true');
                    else if (type == 'n') return Number(value);
                    else return value;
                }
            };
        }
        //if (typeof GM_deleteValue == 'undefined') var GM_deleteValue = function(name) { localStorage.removeItem(name) };

        window.FPX = {
            LandBasePrices: [4000, 15000, 25000, 50000, 75000, 110000, 300000, 600000, 1200000],
            LandBaseIncome: [100, 300, 400, 700, 900, 1200, 2700, 4500, 8000],
            LandCostRatio: function (owned) {
                var landCosts = [4000, 15000, 25000, 50000, 75000, 110000, 300000, 600000, 1200000];
                var icr = [1, 1, 1, 1, 1, 1, 1, 1, 1];
                /*Income/Cost ratio*/
                var i = 9;
                while (i--) {
                    landCosts[i] += FPX.LandBasePrices[i] * owned[i] / 10;
                    icr[i] = FPX.LandBaseIncome[i] / landCosts[i];
                }
                return icr;
            }
        };
        window.timeSince = function (date, after) {
            if (typeof date === 'number') date = new Date(date);
            var seconds = Math.abs(Math.floor((new Date().getTime() - date.getTime()) / 1000));
            var interval = Math.floor(seconds / 31536000);
            var pretext = 'about ', posttext = after ? ' left' : ' ago';
            if (interval >= 1) return pretext + interval + ' year' + (interval == 1 ? '' : 's') + posttext;
            interval = Math.floor(seconds / 2592000);
            if (interval >= 1) return pretext + interval + ' month' + (interval == 1 ? '' : 's') + posttext;
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) return pretext + interval + ' day' + (interval == 1 ? '' : 's') + posttext;
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) return pretext + interval + ' hour' + (interval == 1 ? '' : 's') + posttext;
            interval = Math.floor(seconds / 60);
            if (interval >= 1) return interval + ' minute' + (interval == 1 ? '' : 's') + posttext;
            return Math.floor(seconds) + ' second' + (seconds == 1 ? '' : 's') + posttext;
        };
        window.isNumber = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };
        window.SRDotDX = {
            version: { major: "1.1.44", minor: 'Mutik\'s DotD Extension' },
			c: function (ele) {
				function Cele(ele) {
					this._ele = ele;
					this.ele = function() {return this._ele};
					this.set = function(param) {for (var attr in param) if (param.hasOwnProperty(attr)) this._ele.setAttribute(attr,param[attr]); return this};
					this.text = function(text) {this._ele.appendChild(document.createTextNode(text)); return this};
					this.html = function(text,overwrite) {this._ele.innerHTML = overwrite ? text : (this._ele.innerHTML + text); return this};
					this.on = function(event,func,bubble) {this._ele.addEventListener(event, func, bubble); return this};
					this.off = function(event,func,bubble) {this._ele.removeEventListener(event, func, bubble); return this};
					this.del = function() {this._ele.parentNode.removeChild(this._ele); return this};
					this.attach = function(method,dele) {
						if (typeof dele === 'string') dele = document.getElementById(dele);
						if (!(dele instanceof Node)) throw 'Invalid attachment element specified';
						else if (!/^(?:to|before|after)$/i.test(method)) throw 'Invalid append method specified';
						else if (method === 'to') dele.appendChild(this._ele);
						else if (method === 'before') dele.parentNode.insertBefore(this._ele, dele);
						else if (dele.nextSibling === null) dele.parentNode.appendChild(this._ele);
						else dele.parentNode.insertBefore(this._ele, dele.nextSibling);
						return this
					};
				}
				if (typeof ele === 'string') ele = ele.charAt(0) === '#' ? document.getElementById(ele.substring(1)) : document.createElement(ele);
				if (ele instanceof Node) return new Cele(ele);
				throw 'Invalid element type specified';
			},
			util: {
				isArrEq: function(a,b) {
					if(a.length !== b.length) return false;
					var ca = a.slice().sort().join(",");
					var cb = b.slice().sort().join(",");
					return ca === cb;
				},
				getChatLinks: function() {
					var obj, out = '<p style="font: normal 9pt \'Trebuchet MS\'">';
					for(var i = 0; i < SRDotDX.linksHistory.length; i++) {
						obj = SRDotDX.linksHistory[i];
						out += '('+(new Date(obj.t).toLocaleTimeString())+') <b>'+obj.u+'</b>: '+obj.m+'<br>';
					}
					out += '</p>';
					var x = window.open();
					x.document.open();
					x.document.write(out);
					x.document.close();
				},
                getChatNumber: function() {
                    var cont = document.getElementById('chat_rooms_container').children, i = 0;
                    for (i = 0; i < cont.length; i++) {
						if (cont[i].style.display === 'none' || cont[i].id.indexOf('alliance') === 0) continue;
						return i
                    }
                    return i;
                },
                getQueryVariable: function(v,s) {
                    var query = String(s || window.location.search.substring(1));
                    if (query.indexOf('?') > -1) query = query.substring(query.indexOf('?') + 1);
                    var vars = query.split('&');
                    var i = vars.length;
                    while(i--) {
                        var pair = vars[i].split('=');
                        if (decodeURIComponent(pair[0]) == v) return decodeURIComponent(pair[1]);
                    }
                    return '';
                },
                getRaidFromUrl: function(url) {
                    var r = {id: 0, boss: '', hash: '', diff: 0, sid: 1}, cnt = 0, i;

                    var reg = /[?&]([^=]+)=([^?&]+)/ig, p = url.replace(/&amp;/gi, '&').replace(/kv_&/gi, '&kv_').replace(/http:?/gi, '');
                    while ((i = reg.exec(p)) !== null) {
                        switch (i[1]) {
                            case 'kv_raid_id':
                            case 'raid_id': r.id = parseInt(i[2]); cnt++; break;
                            case 'kv_difficulty':
                            case 'difficulty': r.diff = parseInt(i[2]); cnt++; break;
                            case 'kv_raid_boss':
                            case 'raid_boss': r.boss = i[2]; cnt++; break;
                            case 'kv_hash':
                            case 'hash': r.hash = i[2]; cnt++; break;
                            case 'kv_serverid':
                            case 'serverid': r.sid = parseInt(i[2]); cnt++; break;
                        }
                    }
                    if (cnt < 4) return null;

                    return r;
                },
				getUserList: function() {
					var guildUsers = holodeck._chat_window._rooms_by_type.guild._users_list;
					var guild = holodeck._chat_window._rooms_by_type.guild._room.name || '*unknown*';
					var user, nign;
					console.log("[DotDX] Received guild roster list, number of entries: " + guildUsers.length);
					for (var i = 0, il = guildUsers.length; i < il; ++i) {
						user = guildUsers[i].username;
						nign = guildUsers[i]._game_character_name;
						if (typeof SRDotDX.config.ignUsers[user] === 'undefined') SRDotDX.config.ignUsers[user] = { ign: nign, gld: guild };
						else {
							if (SRDotDX.config.ignUsers[user].ign !== nign) SRDotDX.config.ignUsers[user].ign = nign;
							if (SRDotDX.config.ignUsers[user].gld !== guild) SRDotDX.config.ignUsers[user].gld = guild;
						}
					}
				},
				userListChanged: function(cb) {
					var chNum = cb.length;
					var guild = holodeck._chat_window._rooms_by_type.guild._room.name || '*unknown*';
					var type, user, nign;
					for (var i = 0; i < chNum; ++i) {
						type = cb[i].addedCount;
						console.log("[DotDX] UserList operation type: " + (type?"add":"remove"));
						if (type > 0) {
							if (cb[i].object[cb[i].index]) {
								user = cb[i].object[cb[i].index].username;
								nign = cb[i].object[cb[i].index]._game_character_name;

								if (typeof SRDotDX.config.ignUsers[user] === 'undefined') SRDotDX.config.ignUsers[user] = {
									ign: nign,
									gld: guild
								};
								else {
									if (SRDotDX.config.ignUsers[user].ign !== nign) SRDotDX.config.ignUsers[user].ign = nign;
									if (SRDotDX.config.ignUsers[user].gld !== guild) SRDotDX.config.ignUsers[user].gld = guild;
								}
								console.log("[DotDX] UserList User LogIn: " + user + " | " + nign);
							}
							//else console.log(cb[i]);
						}
						else console.log("[DotDX] UserList User LogOff: " + cb[i].removed[0].username + " | " + cb[i].removed[0]._game_character_name);
					}
				},
                getGameRoomNumber: function() {
                    if(typeof holodeck === 'object' && typeof holodeck.chatWindow === 'function')
						return parseInt(holodeck.chatWindow()._rooms_by_type.game._room.name.slice(-2));
                    return 0;
                },
                getShortNum: function(num) {
                    if (isNaN(num) || num < 0) return num;
                    if (num >= 1000000000000) return (num / 1000000000000).toPrecision(4) + 't';
                    if (num >= 1000000000) return (num / 1000000000).toPrecision(4) + 'b';
                    if (num >= 1000000) return (num / 1000000).toPrecision(4) + 'm';
                    if (num >= 1000) return (num / 1000).toPrecision(4) + 'k';
                    return num + ''
                },
                getShortNumMil: function(num) {
                    if (isNaN(num) || num < 0) return num;
                    if (num >= 1000000) return (num / 1000000).toPrecision(4) + 't';
                    if (num >= 1000) return (num / 1000).toPrecision(4) + 'b';
                    return num.toPrecision(4) + 'm'
                },
                objToUriString: function(obj) {
                    if (typeof obj === 'object') {
                        var str = '';
                        for (var i in obj) if (obj.hasOwnProperty(i)) str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]) + '&';
                        str = str.substring(0, str.length - 1);
                        return str
                    }
                    return '';
                },
				invokeGuildReload: function() {
					var gID = holodeck._chat_window._rooms_by_type.guild._room.guildId;
					holodeck._chat_window.joinRoom({type:'guild', guild_id: parseInt(gID)});
					setTimeout(SRDotDX.util.createGuildReload, 5000);
				},
				createGuildReload: function() {
					if (typeof Array.observe === 'function') {
						Array.unobserve(holodeck._chat_window._rooms_by_type.guild._users_list, SRDotDX.util.userListChanged);
						Array.observe(holodeck._chat_window._rooms_by_type.guild._users_list, SRDotDX.util.userListChanged);
					}
					SRDotDX.c('li').set({class:'action', onclick:"SRDotDX.util.invokeGuildReload()"}).text('Reload chat').attach('to',holodeck._chat_window._rooms_by_type.guild._chat_actions_options);
				},
				deRomanize: function(roman) {
					var lut = {I:1, V:5, X:10, L:50, C:100, D:500, M:1000};
					var arabic = 0, i = roman.length;
					while (i--) {
						if (lut[roman[i]] < lut[roman[i+1]]) arabic -= lut[roman[i]];
						else arabic += lut[roman[i]];
					}
					return arabic;
				},
                extEcho: function(msg) {
					var cw;
                    if (SRDotDX.alliance.isActive) cw = document.getElementById('alliance_chat_window');
					else {
						var cn = SRDotDX.util.getChatNumber();
						cw = document.getElementById('chat_rooms_container').children[SRDotDX.util.getChatNumber()].getElementsByClassName('chat_message_window')[0];
					}
                    var p = cw.getElementsByTagName('p');
                    var m;
                    if (p.length > 0 && p[p.length-1].className.indexOf('script') > -1) {
                        m = p[p.length-1].getElementsByClassName('message')[0];
                        m.innerHTML = m.innerHTML + '<hr>' + msg;
                    }
                    else {
                        m = SRDotDX.c('div').ele();
                        var mi = SRDotDX.c('div').attach('to',m).ele();
                        var mi2 = SRDotDX.c('p').set({class: 'script'}).attach('to',mi).ele();
                        SRDotDX.c('span').set({class: 'username DotDeXtension'}).html("DotDeXtension",true).attach('to',mi2);
                        SRDotDX.c('span').set({class: 'separator'}).html(": ",true).attach('to',mi2);
                        SRDotDX.c('span').set({class: 'message', name: 'SRDotDX_DotDeXtension'}).html('<br>'+msg,true).attach('to',mi2);
                        SRDotDX.c('span').set({class: 'clear'}).attach('to',mi2);
                        var div = cw.lastChild;
                        if(div) div.appendChild(mi);
                        else cw.appendChild(m);
                    }
                    setTimeout(SRDotDX.gui.scrollChat, 100, SRDotDX.alliance.isActive);
                },
                serialize: function(obj) {
                    var str = [];
                    for (var p in obj) if (obj.hasOwnProperty(p)) if (obj[p] !== null)
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                stringFormat: function() {
                    var s = arguments[0];
                    for (var i = 0; i < arguments.length - 1; i++) {
                        var reg = new RegExp("\\{" + i + "\\}", "gm");
                        s = s.replace(reg, arguments[i + 1]);
                    }
                    return s;
                }
            },
            config: (function() {
                var tmp, reqSave = false;
                try {tmp = JSON.parse(GM_getValue('SRDotDX', '{}'));}
                catch (e) {tmp = {};reqSave = true }

                //Raids tab vars
                tmp.filterSearchStringR 		= typeof tmp.filterSearchStringR 			=== 'string' 	? tmp.filterSearchStringR 			: '';
                tmp.fltIncVis 					= typeof tmp.fltIncVis 						=== 'boolean' 	? tmp.fltIncVis 					: false;
                tmp.fltExclFull 				= typeof tmp.fltExclFull 					=== 'boolean' 	? tmp.fltExclFull 					: false;
                tmp.fltShowAll 					= typeof tmp.fltShowAll 					=== 'boolean' 	? tmp.fltShowAll 					: false;

                //Options tab vars
                tmp.importFiltered 				= typeof tmp.importFiltered 				=== 'boolean' 	? tmp.importFiltered 				: true;
                tmp.hideRaidLinks 				= typeof tmp.hideRaidLinks 					=== 'boolean' 	? tmp.hideRaidLinks 				: false;
                tmp.hideBotLinks 				= typeof tmp.hideBotLinks 					=== 'boolean' 	? tmp.hideBotLinks 					: false;
                tmp.hideVisitedRaids 			= typeof tmp.hideVisitedRaids 				=== 'boolean' 	? tmp.hideVisitedRaids 				: false;
                tmp.hideVisitedRaidsInRaidList 	= typeof tmp.hideVisitedRaidsInRaidList 	=== 'boolean' 	? tmp.hideVisitedRaidsInRaidList 	: false;
                tmp.markMyRaidsVisted 			= typeof tmp.markMyRaidsVisted 				=== 'boolean' 	? tmp.markMyRaidsVisted 			: false;
                tmp.markImportedVisited 		= typeof tmp.markImportedVisited 			=== 'boolean' 	? tmp.markImportedVisited 			: false;
                tmp.FPXLandOwnedCount 			= typeof tmp.FPXLandOwnedCount 				=== 'object' 	? tmp.FPXLandOwnedCount 			: [0, 0, 0, 0, 0, 0, 0, 0, 0];
                tmp.prettyPost 					= typeof tmp.prettyPost 					=== 'boolean' 	? tmp.prettyPost 					: false;
				tmp.clearRMB 					= typeof tmp.clearRMB 						=== 'boolean' 	? tmp.clearRMB 						: false;
                tmp.showStatusOverlay 			= typeof tmp.showStatusOverlay 				=== 'boolean' 	? tmp.showStatusOverlay 			: false;
                tmp.confirmDeletes 				= typeof tmp.confirmDeletes 				=== 'boolean' 	? tmp.confirmDeletes 				: true;
                tmp.autoPostPaste 				= typeof tmp.autoPostPaste 					=== 'boolean' 	? tmp.autoPostPaste 				: false;
                tmp.whisperTo 					= typeof tmp.whisperTo 						=== 'string' 	? tmp.whisperTo 					: '';
                tmp.formatLinkOutput 			= typeof tmp.formatLinkOutput 				=== 'boolean' 	? tmp.formatLinkOutput 				: false;
                tmp.linkShowFs 					= typeof tmp.linkShowFs 					=== 'boolean' 	? tmp.linkShowFs 					: false;
                tmp.linkShowAp 					= typeof tmp.linkShowAp 					=== 'boolean' 	? tmp.linkShowAp 					: false;
                tmp.unvisitedRaidPruningMode 	= typeof tmp.unvisitedRaidPruningMode 		=== 'number' 	? tmp.unvisitedRaidPruningMode 		: 1;
                tmp.selectedRaids 				= typeof tmp.selectedRaids 					=== 'string' 	? tmp.selectedRaids 				: '';
                tmp.pastebinUrl 				= typeof tmp.pastebinUrl 					=== 'string' 	? tmp.pastebinUrl 					: '';
                tmp.bckColor 					= typeof tmp.bckColor 						=== 'string' 	? tmp.bckColor 						: 'fff';
                tmp.lastImported 				= typeof tmp.lastImported 					=== 'number' 	? tmp.lastImported 					: (new Date().getTime() - 1728000000);
                tmp.hideKongForum 				= typeof tmp.hideKongForum 					=== 'boolean' 	? tmp.hideKongForum 				: false;
                tmp.hideGameDetails 			= typeof tmp.hideGameDetails 				=== 'boolean' 	? tmp.hideGameDetails 				: false;
                tmp.hideGameTitle 				= typeof tmp.hideGameTitle 					=== 'boolean' 	? tmp.hideGameTitle 				: true;
                tmp.chatFilterString 			= typeof tmp.chatFilterString 				=== 'string' 	? tmp.chatFilterString 				: '';
                tmp.filterSearchStringC 		= typeof tmp.filterSearchStringC 			=== 'string' 	? tmp.filterSearchStringC 			: '';
                tmp.chatSize 					= typeof tmp.chatSize 						=== 'number' 	? tmp.chatSize 						: 300;
                tmp.sbEnable 					= typeof tmp.sbEnable 						=== 'boolean' 	? tmp.sbEnable 						: true;
                tmp.sbSlim 						= typeof tmp.sbSlim 						=== 'boolean' 	? tmp.sbSlim 						: false;
                tmp.sbRightSide 				= typeof tmp.sbRightSide 					=== 'boolean' 	? tmp.sbRightSide 					: false;
				tmp.formatLinks 				= typeof tmp.formatLinks 					=== 'boolean' 	? tmp.formatLinks 					: false;
				tmp.slimKongBar 				= typeof tmp.slimKongBar 					=== 'boolean' 	? tmp.slimKongBar 					: false;
                tmp.kongUser 					= typeof tmp.kongUser 						=== 'string' 	? tmp.kongUser 						: 'Guest';
                tmp.kongAuth 					= typeof tmp.kongAuth 						=== 'string' 	? tmp.kongAuth 						: '0';
                tmp.kongId 						= typeof tmp.kongId 						=== 'string' 	? tmp.kongId 						: '0';
                tmp.kongMsg 					= typeof tmp.kongMsg 						=== 'boolean' 	? tmp.kongMsg 						: false;
                tmp.hideGameTab 				= typeof tmp.hideGameTab 					=== 'boolean' 	? tmp.hideGameTab 					: false;
                tmp.hideAccTab 					= typeof tmp.hideAccTab 					=== 'boolean' 	? tmp.hideAccTab 					: false;
                tmp.dotdxTabName 				= typeof tmp.dotdxTabName 					=== 'string' 	? tmp.dotdxTabName 					: 'Raids';
                tmp.themeNum 					= typeof tmp.themeNum 						=== 'number' 	? tmp.themeNum 						: 1;
                tmp.fontNum 					= typeof tmp.fontNum 						=== 'number' 	? tmp.fontNum 						: 0;
                tmp.ignMode 					= typeof tmp.ignMode 						=== 'number' 	? tmp.ignMode 						: 1;
                tmp.hideScrollBar 				= typeof tmp.hideScrollBar 					=== 'boolean' 	? tmp.hideScrollBar 				: false;
				tmp.allianceChat 				= typeof tmp.allianceChat 					=== 'boolean' 	? tmp.allianceChat 					: false;
				tmp.allianceServer 				= typeof tmp.allianceServer 				=== 'string' 	? tmp.allianceServer 				: '';
				tmp.allianceName 				= typeof tmp.allianceName 					=== 'string' 	? tmp.allianceName 					: 'Alliance';
                tmp.hideWChat 					= typeof tmp.hideWChat 						=== 'boolean' 	? tmp.hideWChat 					: false;
                tmp.leftWChat 					= typeof tmp.leftWChat 						=== 'boolean' 	? tmp.leftWChat 					: false;
                tmp.removeWChat 				= typeof tmp.removeWChat 					=== 'boolean' 	? tmp.removeWChat 					: false;
                tmp.filterChatLinks 			= typeof tmp.filterChatLinks 				=== 'boolean' 	? tmp.filterChatLinks 				: true;
                tmp.filterRaidList 				= typeof tmp.filterRaidList 				=== 'boolean' 	? tmp.filterRaidList 				: false;
                tmp.newRaidsAtTopOfList 		= typeof tmp.newRaidsAtTopOfList 			=== 'boolean' 	? tmp.newRaidsAtTopOfList 			: false;
                tmp.serverMode 					= typeof tmp.serverMode 					=== 'number' 	? tmp.serverMode 					: 1;
                tmp.sbConfig 					= typeof tmp.sbConfig 						=== 'object' 	? tmp.sbConfig 						: [
												{"type": "label", "name": "Camps"},
												{"type": "btn", "name": "GoC", "cmd": "/camp goc"},
												{"type": "btn", "name": "MaM", "cmd": "/camp mam"},
												{"type": "btn", "name": "FW", "cmd": "/camp fw"},
												{"type": "label", "name": "Tiers"},
												{"type": "btn", "name": "Bella", "cmd": "/raid bella"},
												{"type": "btn", "name": "Xerk", "cmd": "/raid xerkara"},
												{"type": "btn", "name": "Tisi", "cmd": "/raid tisi"},
												{"type": "label", "name": "Join"},
												{"type": "btn", "name": "Farms", "cmd": "SRDotDX.gui.quickImportAndJoin(\'farm:nnm\',false)"},
												{"type": "label", "name": "Utils"},
												{"type": "btn", "color": "g", "name": "(Re)Load", "sname": "Reld", "cmd": "SRDotDX.reload()"},
												{"type": "btn", "color": "r", "name": "Unload", "sname": "Kill", "cmd": "/kill"},
												{"type": "btn", "name": "Room 1", "sname": "CR1", "cmd": "SRDotDX.gui.gotoRoom(1)"},
												{"type": "btn", "name": "Room 2", "sname": "CR2", "cmd": "SRDotDX.gui.gotoRoom(2)"},
												{"type": "btn", "name": "Room 8", "sname": "CR8", "cmd": "SRDotDX.gui.gotoRoom(8)"},
												{"type": "label", "name": "Sheets", "sname": "Help"},
												{"type": "btn", "name": "Magic", "sname": "Mag", "cmd": "https://docs.google.com/spreadsheets/d/1O0eVSnzlACP9XJDq0VN4kN51ESUusec3-gD4dKPHRNU"},
												{"type": "btn", "name": "Mount", "sname": "Mnt", "cmd": "https://docs.google.com/spreadsheet/ccc?key=0AiSpM5yAo8atdER2NEhHY3VjckRhdWctWV8yampQZUE"},
												{"type": "btn", "name": "Gear", "cmd": "https://docs.google.com/spreadsheet/lv?key=0AvP2qXrWcHBxdHpXZkUzTHNGNkVWbjE5c2VEZUNNMUE"},
												{"type": "label", "name": "Raids"},
												{"type": "jtxt"},
												{"type": "btn", "color": "g", "name": "Join", "cmd": "SRDotDX.gui.joinSelectedRaids(true)"},
												{"type": "btn", "color": "b", "name": "Import", "sname": "Imp", "cmd": "SRDotDX.gui.importFromServer()"},
												{"type": "btn", "color": "y", "name": "RaidBot", "sname": "Bot", "cmd": "SRDotDX.gui.switchBot()"} ];

                if (typeof tmp.mutedUsers  !== 'object') tmp.mutedUsers  = {};
                if (typeof tmp.ignUsers    !== 'object') tmp.ignUsers    = {};
				else if (typeof tmp.ignUsers[tmp.kongUser].ign !== 'string') {
					var uk = Object.keys(tmp.ignUsers);
					for (var k in uk) { if(tmp.ignUsers.hasOwnProperty(uk[k])) tmp.ignUsers[uk[k]] = { ign: tmp.ignUsers[uk[k]], gld: '*unknown*' }; }
				}
                if (typeof tmp.friendUsers !== 'object') tmp.friendUsers = {};
                if (typeof tmp.raidList    !== 'object') tmp.raidList    = {};
                if (typeof tmp.filters     !== 'object') tmp.filters     = [{},{}];
                if (typeof tmp.lastFilter  !== 'object') tmp.lastFilter  = typeof tmp.lastFilter === 'string' ? [tmp.lastFilter, tmp.lastFilter] : ["",""];
				if (tmp.filters.length !== 2) tmp.filters = [tmp.filters, tmp.filters];
				if (tmp.lastImported > (new Date().getTime())) tmp.lastImported = (new Date().getTime() - 1728000000);
                if (reqSave) GM_setValue('SRDotDX', JSON.stringify(tmp));

                // Delete expired raids
                for (var id in tmp.raidList) {
                    if(tmp.raidList.hasOwnProperty(id)) {
                        if (typeof tmp.raidList[id].magic === "undefined") tmp.raidList[id].magic = [0, 0, 0, 0, 0, 0];
                        if (typeof tmp.raidList[id].hp === "undefined") tmp.raidList[id].hp = 1.0;
                        if (typeof tmp.raidList[id].sid === "undefined") tmp.raidList[id].sid = 1;
                        if (typeof tmp.raidList[id].cs === "undefined") tmp.raidList[id].cs = 0;
                        if (typeof tmp.raidList[id].fs === "undefined") tmp.raidList[id].fs = 1;
						if (typeof tmp.raidList[id].ni === "undefined") tmp.raidList[id].ni = false;
                    }
                }

                tmp.addRaid = function (hash, id, boss, diff, sid, visited, user, ts, room, magic, hp, cs, fs) {
                    if ((/ /).test(user)) {
                        var reg = new RegExp('[0-9]+|[0-9a-zA-Z_]+', 'g');
                        room = reg.exec(user);
                        user = reg.exec(user);
                    }
                    if (typeof SRDotDX.config.raidList[id] !== 'object') {
                        var tStamp = typeof ts === 'undefined' || ts === null ? parseInt(new Date().getTime() / 1000) : parseInt(ts);
                        SRDotDX.config.raidList[id] = {
                            hash: hash, id: id, boss: boss, diff: diff, sid: sid, visited: visited, user: user, timeStamp: tStamp,
                            expTime: (typeof SRDotDX.raids[boss] === 'object' ? SRDotDX.raids[boss].duration : 24) * 3600 + tStamp,
                            room: room === undefined || room === null ? SRDotDX.util.getGameRoomNumber() : parseInt(room),
                            magic: magic === undefined || magic === null ? [0,0,0,0,0,0] : magic,
                            hp: hp === undefined || hp === null ? 1.0 : parseFloat(hp),
                            cs: cs === undefined || cs === null ? 0 : parseInt(cs),
                            fs: fs === undefined || fs === null ? (typeof SRDotDX.raids[boss] === 'object' ? SRDotDX.raids[boss].size : 1) : parseInt(fs),
							ni: magic === undefined
                        };
                        SRDotDX.gui.addRaid(id);
                    }
                    return SRDotDX.config.raidList[id]
                };
                tmp.save = function (b) {
                    b = typeof b == 'undefined' ? true : b;
                    GM_setValue('SRDotDX', JSON.stringify(SRDotDX.config));
                    if(b) setTimeout(SRDotDX.config.save, 60000, true);
                    else console.log('[DotDX] Manual config save invoked');
                };
                tmp.extSave = function(){SRDotDX.gframe('dotdx.save#'+JSON.stringify({'removeWChat':SRDotDX.config.removeWChat,'leftWChat':SRDotDX.config.leftWChat,'hideWChat':SRDotDX.config.hideWChat}));};
                return tmp;
            })(),
			alliance: {
				chat: null,
				chatcnt: 0,
				isActive: false,
				uservars : {
					usr: '*unknown*',
					ign: '*unknown*',
					gld: '*unknown*'
				},
				watchDog: null,
				getGuildTag: function(guild) {
					var roman = /^(.+\s)([IXV]+)$/.exec(guild);
					if (roman) guild = roman[1] + SRDotDX.util.deRomanize(roman[2]);
					var reg = /([A-Z]+|\w)\w*/g;
					var tag = '', part;
					while (part = reg.exec(guild)) tag += part[1];
					return tag
				},
				processMessage: function(user, inGameName, cls, time, message, pfx) {
					//console.log("[DotDX] aChat: " + time +"|"+user+"|"+inGameName+"|"+message);
					var usrCls = ["chat_message_window_username"];
					var curTs = new Date().getTime().toString();
					var isSelf = user === SRDotDX.config.kongUser;
					var usr = user;
					if ((this.chatcnt++) % 2) cls.push('even');
					if (pfx === 'u ') pfx = '';
					var ts = '', ign = '';
					var pClass = cls.join(' ');
					if (pClass.indexOf('emote') < 0 && pClass.indexOf('script') < 0) {
						var raid = SRDotDX.getRaidLink(message, user, true);
						if (raid) {
							cls.push('DotDX_raid');
							cls.push('DotDX_sid_' + raid.sid);
							cls.push('DotDX_diff_' + raid.diff);
							cls.push('DotDX_raidId_' + raid.id);
							if (raid.visited) cls.push('DotDX_visitedRaid');
							cls.push('DotDX_fltChat_' + raid.boss + '_' + (raid.diff - 1));
							message = raid.ptext + '<a href="' + raid.url + '" class="chatRaidLink ' + raid.id + '|' + raid.hash + '|' + raid.boss + '|' + raid.diff + '|' + raid.sid +
							'" style="float:right;" onmouseout="SRDotDX.gui.helpBox(\'chat_raids_overlay\',\'dotdm_' + curTs + '\',\'\',true);" onmouseover="SRDotDX.gui.helpBox(\'chat_raids_overlay\',\'dotdm_' + curTs + '\',' + raid.id + ',false);">' + raid.linkText() + '</a>' + raid.ntext;
							SRDotDX.gui.toggleRaid('visited', raid.id, raid.visited);
							SRDotDX.gui.joining ? SRDotDX.gui.pushRaidToJoinQueue(raid.id) : SRDotDX.gui.selectRaidsToJoin('chat');
						}
						else {
							var reg = /(^|.+?)(\s|\,|$|^)(https?:\/\/[^\,\s]+|$)/g;
							var part, msg = '';
							while (part = reg.exec(message)) {
								msg += part[1] + part[2];
								if (part[3].length > 0) {
									if (part[3].indexOf('http') === 0) msg += '<a href="' + part[3] + '" target="_blank" class="chat_link">' + part[3] + '</a>';
									else msg += part[3];
								}
							}
							message = msg;
						}

						if (SRDotDX.config.mutedUsers[usr]) cls.push('DotDX_hidden');
						isSelf && usrCls.push('is_self');

						if (inGameName !== '*unknown*') if (SRDotDX.config.ignUsers[usr] && SRDotDX.config.ignUsers[usr].ign !== inGameName) SRDotDX.config.ignUsers[usr].ign = inGameName;

						if (SRDotDX.config.ignUsers[usr] && SRDotDX.config.ignUsers[usr].ign !== '*unknown*') {
							switch (SRDotDX.config.ignMode) {
								case 2: ign = ' (' + SRDotDX.config.ignUsers[usr].ign + ')'; break;
								case 1: usr = SRDotDX.config.ignUsers[usr].ign; usrCls.push('ign'); break;
							}
						}
						ts = '(' + time.slice(0, 5) + ')&ensp;';
					}
					else if (pClass.indexOf('emote') > -1 && user !== '*unknown*') message =  user + ' ' + message;

					return '<p class="'+cls.join(' ')+'">' +
						'<span id="dotdm_'+curTs+'" class="slider" style="max-width:0" onmouseleave="this.style.maxWidth=\'0\'"></span>' +
						'<span class="timestamp">'+ts+'</span>' +
						'<span class="username '+usrCls.join(' ')+' dotdm_'+curTs+'" username="'+user+'" dotdxname="'+user+'" oncontextmenu="return false;">'+pfx+usr+'</span>' +
						'<span class="ign ingamename">'+ign+'</span>' +
						'<span class="separator">: </span>' +
						'<span name="SRDotDX_'+usr+'" class="message">'+message.trim()+'</span>' +
						'<span class="clear"></span></p>';
				},
				reloadChat: function() {
					if (SRDotDX.alliance.chat) {
						SRDotDX.alliance.chatcnt = 0;
						SRDotDX.alliance.chat.disconnect();
						//document.getElementById('alliance_chat_window').innerHTML = '';
						SRDotDX.alliance.chat.socket.reconnect();
					}
				},
				destroyChat: function() {
					if (SRDotDX.alliance.chat) try {SRDotDX.alliance.chat.socket.disconnect()} catch(e){console.log(e); SRDotDX.alliance.chat = null};

					if (SRDotDX.alliance.isActive) document.getElementById('guild_room_tab').children[0].dispatchEvent(new MouseEvent('click', { button: 1, cancelable: true}));

					SRDotDX.alliance.isActive = false;
					SRDotDX.alliance.chatcnt = 0;
					document.getElementsByClassName('room_name_container')[0].className = 'room_name_container h6_alt mbs';

					var node = document.getElementById('alliance_tab');
					if (node) node.parentNode.removeChild(node);
					node = document.getElementById('alliance_room');
					if (node) node.parentNode.removeChild(node);
					node = document.getElementById('alliance_number');
					if (node) node.parentNode.removeChild(node);

					SRDotDX.c('#chat_room_tabs').off('mouseup', SRDotDX.alliance.kongTabsEvent);

					SRDotDX.config.allianceChat = false;
					SRDotDX.c('#options_enableAllianceChat').ele().checked = false;
				},
				createChat: function() {

					SRDotDX.alliance.uservars.usr = SRDotDX.config.kongUser || '*unknown*';
					SRDotDX.alliance.uservars.ign = SRDotDX.config.ignUsers[SRDotDX.alliance.uservars.usr].ign || '*unknown*';
					SRDotDX.alliance.uservars.gld = SRDotDX.config.ignUsers[SRDotDX.alliance.uservars.usr].gld || '*unknown*';

					if (SRDotDX.alliance.chat) {
						SRDotDX.alliance.chat = io.connect(SRDotDX.config.allianceServer);
						SRDotDX.alliance.chat.watchDog = setTimeout(SRDotDX.alliance.destroyChat, 10000);
						SRDotDX.alliance.chat.socket.reconnect();
					}
					else {
						SRDotDX.alliance.chat = io.connect(SRDotDX.config.allianceServer);
						SRDotDX.alliance.chat.watchDog = setTimeout(SRDotDX.alliance.destroyChat, 10000);
						SRDotDX.alliance.chat.on('conn', function (data) {
							console.log(data);
							var user = SRDotDX.alliance.uservars;
							clearTimeout(SRDotDX.alliance.chat.watchDog);
							SRDotDX.alliance.chat.emit('join', {data: user.usr, ign: user.ign, guild: user.gld});
						});
						SRDotDX.alliance.chat.on('raids', function (data) {
							//console.log(data);
							var r = JSON.parse(data['data']), raid, cnt = 0;
							var swt = !SRDotDX.config.importFiltered, filter = SRDotDX.c('#DotDX_filters').ele().innerHTML;
							for (var i in r) if (r.hasOwnProperty(i)) {
								raid = r[i]; //console.log("[DotDX] blinkRC processing: " + raid.join('|'));
								if (!SRDotDX.config.raidList[i] && (swt || filter.indexOf('fltList_' + raid[0] + '_' + (parseInt(raid[1]) - 1)) < 0)) {
									SRDotDX.config.addRaid(raid[3], parseInt(raid[2]), raid[0], parseInt(raid[1]), parseInt(raid[4]), false, 'Alliance', null, '41');
									cnt++;
								}
							}
							var text = SRDotDX.alliance.processMessage('*unknown*', '*unknown*', ['emote'], '', 'Loaded ' + cnt + ' alliance raids to local database.', '');
							SRDotDX.c('div').html(text, true).attach('to', 'alliance_chat_window');
							SRDotDX.gui.selectRaidsToJoin('alliance raids');
						});
						SRDotDX.alliance.chat.on('dead', function (data) {
							console.log("[DotDX] Dead alliance chat event");
							console.log(data);
						});
						SRDotDX.alliance.chat.on('join', function (data) {
							//console.log(data);
							if (data.here) {
								var userName = data.name || null;
								var inGameName = data.ign && data.ign !== '*unknown*' ? data.ign : null;
								var guild = data.guild && data.guild !== '*unknown*' ? data.guild : null;
								if (userName) {
									if (SRDotDX.config.ignUsers[userName] !== 'object') SRDotDX.config.ignUsers[userName] = {
										ign: (inGameName || '*unknown*'),
										gld: (guild || '*unknown*')
									};
									else {
										if (inGameName && SRDotDX.config.ignUsers[userName].ign === '*unknown*') SRDotDX.config.ignUsers[userName].ign = inGameName;
										if (guild && SRDotDX.config.ignUsers[userName].gld === '*unknown*') SRDotDX.config.ignUsers[userName].gld = guild;
									}
								}
							}

							var userList = null;
							try {
								userList = JSON.parse(data.names);
							} catch (e) {
								console.log(e);
								return;
							}

							var prevItem = '', content = '', userData, cnt = 0;
							for (var usr in userList) {
								if (userList.hasOwnProperty(usr)) {
									if (userList[usr] === prevItem) continue;
									prevItem = userList[usr];
									cnt++;
									userData = SRDotDX.config.ignUsers[userList[usr]] || null;
									if (userData)
										content += '<div><span>' + ( userData.gld === '*unknown*' ? '???' : SRDotDX.alliance.getGuildTag(userData.gld) ) + '</span><span>' + userList[usr] + '</span><span>' +
										( userData.ign === '*unknown*' ? '' : '(' + userData.ign + ')' ) + '</span></div>';
									else
										content += '<div><span>???</span><span>' + userList[usr] + '</span><span></span></div>';
								}
							}
							SRDotDX.c('#alliance_number').html(cnt, true);
							SRDotDX.c('#alliance_users').html(content, true);
						});
						SRDotDX.alliance.chat.on('chat', function (data) {
							var msgPatt = /^.+<abbr.+'K:(.+?) D:(.+?) \((.+?)\).+?<font.+?>(.+\n?.*)<\/font>.*$/;
							var wToPatt = /^.+\n?.+?Sent to <y>(.+?)<\/y>.+>(.+\n?.*)<.+$/;
							var wFromPatt = /^.+>(.+?)<\/a>.+PM'd.+>(.+\n?.*)<.+$/;
							var userUnavail = /^.*<glowy>(.+)<\/glowy> not online.+$/;
							var match, text;
							if ((match = msgPatt.exec(data['data'])) !== null) {
								if (typeof SRDotDX.config.ignUsers[match[1]] !== "object") SRDotDX.config.ignUsers[match[1]] = {
									ign: match[2],
									gld: match[3]
								};
								else if (match[3] !== '*unknown*' && SRDotDX.config.ignUsers[match[1]].gld !== match[3]) SRDotDX.config.ignUsers[match[1]].gld = match[3];
								text = SRDotDX.alliance.processMessage(match[1], match[2], [], data['time'][0], match[4], SRDotDX.alliance.getGuildTag(match[3]) + ' ');
							}
							else if ((match = wToPatt.exec(data['data'])) !== null) {
								//console.log(data['data']);
								text = SRDotDX.alliance.processMessage(match[1], '*unknown*', ['whisper'], data['time'][0], match[2], 'To ');
							}
							else if ((match = wFromPatt.exec(data['data'])) !== null) {
								//console.log(data['data']);
								text = SRDotDX.alliance.processMessage(match[1], '*unknown*', ['whisper'], data['time'][0], match[2], 'From ');
							}
							else if ((match = userUnavail.exec(data['data'])) !== null)
								text = SRDotDX.alliance.processMessage(match[1], '*unknown*', ['whisper', 'emote'], '', 'is offline', '');
							else {
								text = SRDotDX.alliance.processMessage('*unknown*', '*unknown*', ['emote'], '', data['data'], '');
								console.log(data);
							}
							SRDotDX.c('div').html(text, true).attach('to', 'alliance_chat_window');
							//SRDotDX.c('#alliance_chat_window').html(text,false);
							if (SRDotDX.alliance.isActive) setTimeout(SRDotDX.gui.scrollChat, 100, true);
							else if (document.getElementById('alliance_tab').className.indexOf('unread') < 0) document.getElementById('alliance_tab').className += 'unread';
						});
					}
				},
				sendMessage: function(msg) {
					//console.log("[DotDX] Sending message: " + msg);
					var pic = document.getElementById('welcome_box_small_user_avatar').getAttribute('src') || '#';
					var user = SRDotDX.alliance.uservars;
					var gTag = SRDotDX.alliance.getGuildTag(user.gld);
					SRDotDX.alliance.chat.emit('chat', {
						data: "<img class='img' src='" + pic + "' /><z>(<y><abbr title='K:" + user.usr +
						" D:" + user.ign + " (" + user.gld + ")'>" + (gTag === 'u' ? '' : (gTag+': ') ) + (user.ign || user.usr) + "</abbr></y>): </z> " +
						'<font style="font-size: 12px; color: #ddd">' + msg + ' </font>'});
				},
				processImage: function(imgLink) {
					if (/^https?:\/\/.+?\.(png|gif|jpe?g)$/.test(imgLink)) SRDotDX.alliance.sendMessage('<br><img src="'+imgLink+'"/>');
					else SRDotDX.util.extEcho('Provided image link is not valid -> ' + imgLink);
				},
				allianceTabEvent: function(e) {
					if (e.which === 1) {
						e.stopPropagation(); e.preventDefault();
						// hide other chats
						var children = document.getElementById('chat_room_tabs').children, i, cl;
						for (i = 0, cl = children.length; i < cl; ++i) children[i].className = 'chat_room_tab';
						children = document.getElementsByClassName('chat_room_template');
						for (i = 0, cl = children.length; i < cl; ++i) children[i].style.display = "none";
						children = document.getElementById('chat_actions_container').children;
						for (i = 0, cl = children.length; i < cl; ++i) children[i].style.display = "none";

						// make alliance active
						document.getElementsByClassName('room_name_container')[0].className += ' alliance';
						document.getElementById('alliance_tab').className = 'active';
						document.getElementById('alliance_room').className = 'active';
						document.getElementsByClassName('room_name_container')[0].children[0].innerHTML = SRDotDX.config.allianceName;
						SRDotDX.alliance.isActive = true;

						// scroll to the bottom
						setTimeout(SRDotDX.gui.scrollChat, 100, true);
					}
					return false;
				},
				kongTabsEvent: function(e) {
					if (e.which === 1) {
						SRDotDX.alliance.isActive = false;
						document.getElementsByClassName('room_name_container')[0].className = 'room_name_container h6_alt mbs';
						if (document.getElementById('alliance_tab').className.indexOf('unread') < 0)
							document.getElementById('alliance_tab').className = '';
						else
							document.getElementById('alliance_tab').className = 'unread';
						document.getElementById('alliance_room').removeAttribute('class');
					}
				},
				createRoom: function() {
					if (document.getElementById('chat_room_tabs') !== null) {
						SRDotDX.c('div').set({id: 'alliance_tab', class: ''}).html('<a href="#">Alliance</a>', true).on('click', SRDotDX.alliance.allianceTabEvent).attach('after','chat_room_tabs');
						SRDotDX.c('div').set({id: 'alliance_room'}).html('<div class="chat_tabpane users_in_room" id="alliance_users"></div><div class="chat_message_window" id="alliance_chat_window" style="height:456px"></div><div class="chat_controls"><textarea id="alliance_input" class="chat_input"></textarea></div>', true).attach('to','chat_rooms_container');
						SRDotDX.c('span').set({id: 'alliance_number'}).attach('before', document.getElementsByClassName('room_name_container')[0].children[1]);
						SRDotDX.c('#chat_room_tabs').on('mouseup', SRDotDX.alliance.kongTabsEvent);
						SRDotDX.c('#alliance_input').on('keypress',function(e){
							if (e.keyCode === 13) {
								e.stopPropagation(); e.preventDefault();
								if (e.shiftKey) e.target.value += "<br>\n";
								else {
									if (e.target.value !== "") {
										if (e.target.value.charAt(0) === '/' && !(e.target.value.charAt(1) === 'w' && e.target.value.charAt(2) === ' ')) {
											console.log("[DotDX] Chat command: " + e.target.value);
											var link;
											if (e.target.value.indexOf('/img ') === 0) {
												link = e.target.value.split(' ')[1];
												if (link.indexOf('prntscr.com/') > 0) jQuery.ajax( { url: link, type: 'get', success: function(r){
													//console.log('[DotDX] xAjax resp: '+ r.responseText);
													var reg = /^.+<meta content="(.+)" property="og:image"\/>.+$/m;
													var link = r.responseText ? reg.exec(r.responseText) : null;
													if (link) SRDotDX.alliance.processImage(link[1]);
													else SRDotDX.util.extEcho('Provided LightShot link is not valid');
												} } );
												else SRDotDX.alliance.processImage(link);
											}

											else if (e.target.value.indexOf('/vid ') === 0) {
												link = e.target.value.split(' ')[1];
												var hash = /(^.+youtube.+|^watch.+|^v=|^)([A-Za-z0-9\-]{11})$/.exec(link);
												if (hash) {
													var data = '<embed wmode="opaque" src="http://www.youtube.com/v/'+hash[2]+'?version=3&rel=0&fs=1&showinfo=1&disablekb=0&modestbranding=1&controls=1&color=#333" type="application/x-shockwave-flash" allowfullscreen="true" width="100%" height="480" allowscriptaccess="always"></embed>';
													SRDotDX.alliance.sendMessage(data);
												}
												else SRDotDX.util.extEcho('Provided video hash/link is not valid or not supported -> ' + link);
											}

											else holodeck.processChatCommand(e.target.value);
										}
										else SRDotDX.alliance.sendMessage(e.target.value);
										e.target.value = "";
									}
								}
								return false;
							}
						});
						SRDotDX.c('#chat_room_tabs').on('mouseup', SRDotDX.alliance.kongTabsEvent);
						SRDotDX.alliance.createChat();
					}
				}
			},
			linksHistory: [],
            request: {
                importLock: false,
                joinAfterImport: false,
                fromChat: false,
                quickBtnLock: true,
                filterSearchStringT: "",
                raids: function (isinit, hours) {
                    if (!SRDotDX.gui.joining) {
                        var secs = 15 - parseInt((new Date().getTime() - SRDotDX.config.lastImported) / 1000);
                        if (secs > 0) {
                            SRDotDX.util.extEcho("You can import again in " + secs + " seconds.");
                            return
                        }
                        console.log("[DotDX] Importing raids from raids server ...");
                        if (!isinit)    this.initialize("Requesting raids");
                        else SRDotDX.request.tries++;
                        var h = hours ? ('&h=' + hours) : '';
                        SRDotDX.request.req({
                            eventName: "dotd.getraids",
                            url: "http://mutik.erley.org/download.php?u=" + SRDotDX.config.kongUser + h,
                            method: "GET",
                            headers: {"Content-Type": "application/JSON"},
                            timeout: 30000
                        });
                    }
                },
                poster: function (isInit) {
                    var txt = document.getElementById('DotDX_checkRaidPoster').value, id;
                    if (txt.length < 1) return;
                    if (isNaN(txt)) {
                        var r = SRDotDX.util.getRaidFromUrl(txt);
                        if (r === null) return;
                        id = r.id;
                    }
                    else id = parseInt(txt);
                    console.log("[DotDX] Requesting raid poster info from server...");
                    if (!isInit) this.initialize("Requesting raid poster data");
                    else SRDotDX.request.tries++;
                    SRDotDX.request.req({
                        eventName: "dotd.getposter",
                        url: "http://mutik.erley.org/getposter.php?i=" + id,
                        method: "GET",
                        headers: {"Content-Type": "application/JSON"},
                        timeout: 30000
                    });
                },
				version: function(isInit) {
					console.log("[DotDX] Requesting available script version from greasyfork...");
					if(!isInit) this.initialize("Requesting script version");
					else SRDotDX.request.tries++;
					SRDotDX.request.req({
						eventName: "dotd.getversion",
						url: "https://greasyfork.org/en/scripts/406-mutik-s-dotd-script",
						method: "GET",
						//headers: {"Content-Type": "application/JSON"},
						timeout: 30000
					});
				},
                initialize: function (str) {
                    SRDotDX.gui.doStatusOutput(str + "...", 3000, true);
                    SRDotDX.request.tries = 0;
                    SRDotDX.request.seconds = 0;
                    SRDotDX.request.complete = false;
                    SRDotDX.request.timer = setTimeout(SRDotDX.request.tick, 1000, str);
                },
                tick: function (str) {
                    if (!SRDotDX.request.complete) {
                        if (SRDotDX.request.seconds > 25) {
                            SRDotDX.gui.doStatusOutput("Request failed.", 3000, true);
                            return;
                        }
                        SRDotDX.request.seconds++;
                        SRDotDX.gui.doStatusOutput(str + " (" + SRDotDX.request.seconds + ")...", 1500, true);
                        SRDotDX.request.timer = setTimeout(SRDotDX.request.tick, 1000, str);
                    }
                },
                complete: false,
                seconds: 0,
                timer: 0,
                tries: 0,
                req: function (param) {
                    var a = document.createEvent("MessageEvent");
                    if (a.initMessageEvent) a.initMessageEvent("dotd.req", false, false, JSON.stringify(param), document.location.protocol + "//" + document.location.hostname, 0, window, null);
                    else a = new MessageEvent("dotd.req", {"origin": document.location.protocol + "//" + document.location.hostname, "lastEventId": 0, "source": window, "data": JSON.stringify(param)});
                    document.dispatchEvent(a);
                },
                init: function () {
                    document.addEventListener("dotd.joinraid", SRDotDX.request.joinRaidResponse, false);
                    document.addEventListener("dotd.getraids", SRDotDX.request.addRaids, false);
                    document.addEventListener("dotd.getposter", SRDotDX.request.getPoster, false);
					document.addEventListener("dotd.getversion", SRDotDX.request.getVersion, false);
                    delete this.init;
                },
                joinRaid: function (r) {
                    if (typeof r == 'object') {
                        if (!SRDotDX.gui.joining) SRDotDX.request.initialize("Joining " + (!SRDotDX.raids[r.boss] ? r.boss.capitalize().replace(/_/g, ' ') : SRDotDX.raids[r.boss].shortname));
                        var joinData = 'kongregate_username=' + SRDotDX.config.kongUser + '&kongregate_user_id=' + SRDotDX.config.kongId + '&kongregate_game_auth_token=' + SRDotDX.config.kongAuth;
                        SRDotDX.request.req({
                            eventName: "dotd.joinraid",
                            url: SRDotDX.util.stringFormat('http://50.18.191.15/kong/raidjoin.php?' + joinData + '&kv_action_type=raidhelp&kv_raid_id={0}&kv_hash={1}&serverid={2}', r.id, r.hash, r.sid),
                            method: "GET",
                            timeout: 30000
                        });
                    }
                },
                getPoster: function (e) {
                    var r, data = JSON.parse(e.data);
                    if (data.status != 200) {
                        if (SRDotDX.request.tries >= 3) {
                            SRDotDX.request.complete = true;
                            SRDotDX.gui.doStatusOutput("Raids server busy. Please try again in a moment.");
                            console.log('[DotDX] Raids request failed (url: ' + data.url + ')');
                            console.log(JSON.stringify(data));
                        } else {
                            console.log("[DotDX] Raids server unresponsive (status " + data.status + "). Trying again, " + SRDotDX.request.tries + " tries.");
                        }
                        return;
                    }
                    SRDotDX.request.complete = true;
                    try {
                        r = JSON.parse(data.responseText)
                    }
                    catch (ex) {
                        console.log("[DotDX] Checking raid poster request error");
                        console.log('[DotDX] responseText: ' + data.responseText);
                        return;
                    }
                    document.getElementById('DotDX_whoPosted_Raid').innerHTML = r.r;
                    document.getElementById('DotDX_whoPosted_Time').innerHTML = new Date(r.t * 1000).toLocaleString();
                    document.getElementById('DotDX_whoPosted_Poster').innerHTML = r.p;
                },
				getVersion: function(e) {
					var r, data = JSON.parse(e.data);
					SRDotDX.request.complete = true;
					var remoteVersion = "Unknown";
					if (data.status !== 200) {
						SRDotDX.gui.doStatusOutput("Greasyfork unresponsive.");
						console.log('[DotDX] Version request failed (url: ' + data.url + ')');
						console.log(JSON.stringify(data));
					}
					else remoteVersion = /<dd.+version.+>([\d\.]+)<.+dd>/.exec(data.responseText)[1];
					var d = '<span class="emph bold">' + SRDotDX.version.minor + '</span><br>';
					d += '<span class="bold">Installed version</span>: <span class="emph">' + SRDotDX.version.major + '</span><br>';
					d += '<span class="bold">Available version</span>: <span class="emph">' + remoteVersion + '</span><br>';
					if(SRDotDX.version.major === remoteVersion) d += 'Your script version is up to date.';
					else d += 'You can <a href="https://greasyfork.org/scripts/406-mutik-s-dotd-script" target="_blank">click here</a> to open greasyfork page with script and update.';
					SRDotDX.util.extEcho(d);
				},
                addRaids: function(e) {
                    var r, data = JSON.parse(e.data);
                    if (data.status != 200) {
                        if (SRDotDX.request.tries >= 3) {
                            SRDotDX.request.complete = true;
                            SRDotDX.gui.doStatusOutput("Raids server busy. Please try again in a moment.");
                            console.log('[DotDX] Raids request failed (url: ' + data.url + ')');
                            console.log(JSON.stringify(data));
                        } else {
                            console.log("[DotDX] Raids server unresponsive (status " + data.status + "). Trying again, " + SRDotDX.request.tries + " tries.");
                        }
                        return;
                    }
                    SRDotDX.request.complete = true;
                    try {
                        r = JSON.parse(data.responseText)
                    }
                    catch (ex) {
                        console.log("[DotDX] Raids importing error or no raids imported");
                        console.log('[DotDX] responseText: ' + data.responseText);
                        return;
                    }
                    SRDotDX.gui.doStatusOutput("Importing " + r.raids.length + " raids...");
                    var raid, n = 0, t = 0, i, il, j, jl;
                    var swt = !SRDotDX.config.importFiltered, filter = SRDotDX.c('#DotDX_filters').ele().innerHTML;
                    for(j = 0, jl = r.raids.length; j < jl; ++j) {
                        raid = r.raids[j];
                        if (swt || filter.indexOf('fltList_' + raid.b + '_' + (raid.d - 1)) < 0) {
                            t++;
                            if (typeof SRDotDX.config.raidList[raid.i] !== 'object') {
                                n++;
                                SRDotDX.config.addRaid(raid.h, parseInt(raid.i), raid.b, parseInt(raid.d), parseInt(raid.s), false, raid.p, raid.t, raid.r, raid.m.split("_").map(function (x) {
                                    return parseInt(x)
                                }), parseFloat(raid.hp), raid.cs, raid.fs);
                            }
                            else {
                                SRDotDX.config.raidList[raid.i].magic = raid.m.split("_").map(function(x){return parseInt(x)});
                                SRDotDX.config.raidList[raid.i].hp = parseFloat(raid.hp);
                                SRDotDX.config.raidList[raid.i].cs = parseInt(raid.cs);
                                SRDotDX.config.raidList[raid.i].fs = parseInt(raid.fs);
								SRDotDX.config.raidList[raid.i].ni = false;
                            }
                        }
                    }
                    console.log('[DotDX] Import raids from server complete');
                    var id = r.prune.length > 3 ? r.prune.split("_") : [];
                    //clean chat
                    var chat = document.getElementsByClassName('chat_message_window'), p, pe, d = 0;
                    for(var c = 0, cl = chat.length; c < cl; ++c) {
                        p = chat[c].getElementsByClassName('DotDX_raid'); i = 0;
                        while(pe = p[i++]) if(r.prune.indexOf((/DotDX_raidId_(\d+)/).exec(pe.className)[1]) > -1) pe.parentNode.removeChild(pe);
						p = chat[c].getElementsByTagName('div'); il = p.length;
						while(pe = p[i++]) if(pe.empty()) pe.parentNode.removeChild(pe);
                    }
                    //clean db
                    for(i = 0, il = id.length; i < il; ++i) if(SRDotDX.config.raidList[id[i]]) { delete SRDotDX.config.raidList[id[i]]; d++; }
                    console.log('[DotDX] Removing dead raids on import complete');
                    SRDotDX.gui.selectRaidsToJoin('import response');
                    SRDotDX.config.lastImported = new Date().getTime();
                    SRDotDX.util.extEcho('Imported ' + t + ' raids, ' + n + ' new, ' + d + ' pruned.');
                    if (SRDotDX.request.joinAfterImport) {
                        SRDotDX.gui.selectRaidsToJoin();
                        SRDotDX.gui.joinSelectedRaids(false);
                    }
                    SRDotDX.gui.doStatusOutput('Imported ' + n + ' new raids, ' + d + ' pruned.', 5000, true);
                },
                joinRaidResponse: function (e) {
                    var data = JSON.parse(e.data);
                    var statustxt = '';
                    SRDotDX.request.complete = true;
                    SRDotDX.gui.joinRaidComplete++;
                    if (data && data.status === 200 && data.responseText && data.url) {
                        var raidid = SRDotDX.util.getQueryVariable('kv_raid_id', data.url);
                        if (typeof SRDotDX.config.raidList[raidid] === 'object') {
                            SRDotDX.config.raidList[raidid].visited = true;
                            SRDotDX.gui.toggleRaid('visited', raidid, true);
                            SRDotDX.gui.raidListItemUpdate(raidid);
                            if (/successfully (re-)?joined/i.test(data.responseText)) {
                                SRDotDX.gui.joinRaidSuccessful++;
                                statustxt = (SRDotDX.raids[SRDotDX.config.raidList[raidid].boss] ? SRDotDX.raids[SRDotDX.config.raidList[raidid].boss].shortname : SRDotDX.config.raidList[raidid].boss) + " joined successfully.";
                            }
                            else if (/already a member/i.test(data.responseText)) {
                                statustxt = "Join Failed. You are already a member.";
                            }
                            else if (/already completed/i.test(data.responseText)) {
                                SRDotDX.gui.joinRaidDead++;
                                statustxt = "Join failed. Raid is dead.";
                                SRDotDX.gui.deleteRaidFromDB(raidid);
                            }
                            else if (/not a member of the guild/i.test(data.responseText)) {
                                SRDotDX.gui.joinRaidDead++;
                                statustxt = "Join failed. You are not member of that Guild.";
                                SRDotDX.gui.deleteRaidFromDB(raidid);
                            }
                            else if (/(invalid|find) raid (hash|ID)/i.test(data.responseText)) {
                                statustxt = "Join failed. Invalid hash or ID.";
                                SRDotDX.gui.joinRaidInvalid++;
                                SRDotDX.gui.deleteRaidFromDB(raidid);
                            }
                            else {
                                statustxt = 'Join failed. Unknown join response.';
                            }
                        }
                        else SRDotDX.gui.joinRaidInvalid++;
                    }
                    else {
                        console.log('[DotDX] Request timed out');
                        SRDotDX.gui.joinRaidInvalid++;
                        statustxt = "Join failed. Timeout.";
                    }
                    if (SRDotDX.gui.joining) {
                        if (SRDotDX.gui.joinRaidComplete >= SRDotDX.gui.joinRaidList.length) {
                            statustxt = "Finished joining. " + SRDotDX.gui.joinRaidSuccessful + " new, " + SRDotDX.gui.joinRaidDead + " dead.";
                            SRDotDX.gui.joinFinish(true);
                            if (SRDotDX.gui.joinRaidSuccessful > 2) SRDotDX.util.extEcho(statustxt);
                            setTimeout(SRDotDX.config.save, 3000, false)
                        }
                        else {
                            statustxt = "Joined " + SRDotDX.gui.joinRaidComplete + " of " + SRDotDX.gui.joinRaidList.length + ". " + SRDotDX.gui.joinRaidSuccessful + " new, " + SRDotDX.gui.joinRaidDead + " dead.";
                            if (SRDotDX.gui.joinRaidIndex < SRDotDX.gui.joinRaidList.length) SRDotDX.request.joinRaid(SRDotDX.gui.joinRaidList[SRDotDX.gui.joinRaidIndex++]);
                        }
                    }
                    else setTimeout(SRDotDX.config.save, 3000, false);
                    if (statustxt !== '') SRDotDX.gui.doStatusOutput(statustxt, 4000, true);
                }
            },
            getRaidDetailsBase: function (url) {
                var r = {diff: 0, hash: '', boss: '', id: 0, sid: 0}, i, cnt = 0;
                var reg = /[?&]([^=]+)=([^?&]+)/ig, p = url.replace(/&amp;/gi, '&').replace(/kv_&/gi, '&kv_');
                while ((i = reg.exec(p)) != null) {
                    switch (i[1]) {
                        case 'kv_raid_id':
                        case 'raid_id': r.id = parseInt(i[2]); cnt++; break;
                        case 'kv_difficulty':
                        case 'difficulty': r.diff = parseInt(i[2]); cnt++; break;
                        case 'kv_raid_boss':
                        case 'raid_boss': r.boss = i[2]; cnt++; break;
                        case 'kv_hash':
                        case 'hash': r.hash = i[2]; cnt++; break;
                        case 'kv_serverid':
                        case 'serverid': r.sid = parseInt(i[2]); cnt++; break;
                    }
                }
                if (cnt < 4) return false;

                r.diffLongText = ['Normal', 'Hard', 'Legendary', 'Nightmare'][r.diff - 1];
                r.diffShortText = ['N', 'H', 'L', 'NM'][r.diff - 1];
                var stats = SRDotDX.raids[r.boss];
                if (typeof stats === 'object') {
                    r.name = stats.name;
                    r.shortname = stats.shortname;
                    r.size = stats.size;
                    r.type = stats.type;
                    r.dur = stats.duration;
                    r.durText = stats.dur + "hrs";
                    r.stat = stats.stat;
                    r.statText = SRDotDX.getStatText(stats.stat);
                }
                else {
                    r.name = r.boss[0].toUpperCase() + r.boss.substring(1).replace(/_/g, " ");
                    r.shortname = r.name;
                    r.dur = 48;
                }
                return r;
            },
            getTierTxt: function (hp, ppl, ap) {
                var num = hp / ppl;
                num = ap ? num / 2 : num;
                if (num >= 1000000000000) return (num / 1000000000000).toPrecision(3) + 't';
                if (num >= 1000000000)    return (num / 1000000000).toPrecision(3) + 'b';
                if (num >= 1000000)       return (num / 1000000).toPrecision(3) + 'm';
                if (num >= 1000)          return (num / 1000).toPrecision(3) + 'k';
                                          return num + ''
            },
            getRaidDetails: function (url, user, visited, ts, room) {
                user = user ? user : '';
                var rVis = visited ? visited : user == SRDotDX.config.kongUser && SRDotDX.config.markMyRaidsVisted;
                var r = SRDotDX.util.getRaidFromUrl(url);
                if (r == null) return null;
                //if (r && typeof r.diff == 'number' && typeof r.hash == 'string' && typeof r.boss == 'string' && typeof r.id == 'string') {
                var filter = SRDotDX.c('#DotDX_filters').ele().innerHTML;
                r.visited = rVis;
                if (!SRDotDX.config.importFiltered || filter.indexOf('fltList_' + r.boss + '_' + (r.diff - 1)) < 0) {
                    var info = SRDotDX.config.raidList[r.id];
                    if (typeof info !== 'object') {
                        info = SRDotDX.config.addRaid(r.hash, r.id, r.boss, r.diff, r.sid, r.visited, user, ts, room);
                        if (typeof info === 'object') r.isNew = true;
                        else return null;
                    }
                    else r.isNew = false;
                    r.timeStamp = info.timeStamp;
                    r.visited = info.visited;
                }
                r.linkText = function () {
                    var raidInfo = SRDotDX.raids[r.boss];
                    var txt = '[&thinsp;' + ['', 'N', 'H', 'L', 'NM'][this.diff] + ' ';
                    txt += raidInfo ? raidInfo.shortname : r.boss.capitalize().replace(/_/g, ' ');
                    if (SRDotDX.config.linkShowFs) txt += raidInfo ? ', fs:' + SRDotDX.getTierTxt(raidInfo.health[this.diff - 1], raidInfo.size, false) : '';
                    if (SRDotDX.config.linkShowAp) txt += raidInfo ? ', ap:' + SRDotDX.getTierTxt(raidInfo.health[this.diff - 1], raidInfo.size, true) : '';
                    txt += (this.visited || r.visited) ? '|★' : '';
                    txt += '&thinsp;]';
                    return txt
                };
                return r;
            },
            getRaidLink: function (msg, user, all) {
                msg = msg.replace(/[\r\n]/g, '');
                a = all || false;
				var patt = all ? /^(.*?)((?:(?:https?:\/\/)?(?:www\.)?kongregate\.com)?\/games\/5thPlanetGames\/dawn-of-the-dragons(\?\S+))(.*)$/i : /^((?:(?!<a[ >]).)*)<a.*? href="((?:(?:https?:\/\/)?(?:www\.)?kongregate\.com)?\/games\/5thPlanetGames\/dawn-of-the-dragons(\?[^"]+))".*?<\/a>((?:(?!<\/?a[ >]).)*(?:<a.*? class="reply_link"[> ].*)?)$/i;
				var m = patt.exec(msg);

				if (m) {
                    var raid = SRDotDX.getRaidDetails(m[3], user);
                    if (raid) {
                        raid.ptext = m[1] ? m[1] : "";
                        raid.url = m[2].replace(/kv_&amp;/ig, '&amp;kv_');
                        raid.ntext = m[4] ? m[4] : "";
                        return raid;
                    }
                }
                return null
            },
            getPastebinLink: function (msg, user) {
                msg = msg.replace(/[\r\n]/g, '');
                var m = /^((?:(?!<a[ >]).)*)?http:\/\/pastebin\.com\/\w{8}((?:(?!<\/?a[ >]).)*(?:<a.*? class="reply_link"[> ].*)?)$/i.exec(msg);
                if (m) {
                    var pb = SRDotDX.getPasteDetails(/http:\/\/pastebin\.com\/\w{8}/i.exec(m[0]) + '', user);
                    if (typeof pb != 'undefined') {
                        pb.ptext = m[1] || '';
                        pb.ntext = m[2] || '';
                    }
                    return pb;
                }
                else return null;
            },
            getStatText: function (stat) {
                stat = stat.toLowerCase();
                var r = '';
                if (stat == '?' || stat == 'Unknown') return 'Unknown';
                if (stat.indexOf('s') > -1) r = 'Stamina';
                if (stat.indexOf('h') > -1) r += (r != '' ? (stat.indexOf('e') > -1 ? ', ' : ' and ') : '') + 'Honor';
                if (stat.indexOf('e') > -1) r += (r != '' ? ' and ' : '') + 'Energy';
                return r;
            },
            getTimestamp: function () {
				var date = new Date();
                return '(' + ('0' + (new Date().getHours())).slice(-2) + ':' + ('0' + (new Date().getMinutes())).slice(-2) + ')';
            },
            refreshRaidTab: function () {
                var el_out = document.getElementById('raid_list');
                var el_in1 = document.getElementById('mainRaidsFrame');
                var el_in2 = document.getElementById('topRaidPane');
                el_out.style.height = (el_in1.offsetHeight - el_in2.offsetHeight - 8) + 'px';
            },
            isFirefox: navigator.userAgent.indexOf('Firefox') > 0,
            gui: {
                setMessagesCount: function () {
                    var num = active_user.unreadWhispersCount() + active_user.unreadShoutsCount();
                    var ele = document.getElementById('profile_control_unread_message_count');
                    ele.innerHTML = num;
                    ele.style.display = num == 0 ? 'none' : 'block';
                    setTimeout(SRDotDX.gui.setMessagesCount, 60000);
                },
                gotoRoom: function (num) {
                    var numInt = parseInt(num);
                    if (isNaN(numInt) || numInt < 1 || numInt > 13) holodeck.chatWindow().activateRoomChooser();
                    else {
                        var roomObj = JSON.parse('{"type": "game", "xmpp_name": "138636-dawn-of-the-dragons-' + num + '", "name": "Dawn of the Dragons - Room #' + ('0' + num).slice(-2) + '", "id": "138636-dawn-of-the-dragons-' + num + '"}');
                        holodeck.joinRoom(roomObj);
                    }
                },
                httpCommand: function (url) {
                    window.open(url);
                },
                applySidebarUI: function (mode) { //-1:remove, 0:redraw, 1:create, 2:recreate
                    if(mode == -1 || mode == 2) {
                        document.getElementById('dotdx_sidebar').remove();
                        if (mode == -1) SRDotDX.gui.chatResize(SRDotDX.config.chatSize), document.getElementsByClassName("links_connect")[0].setAttribute('colspan', '2');
                    }
                    if(mode > -1) {
                        var sbElemObj, sbElemTxt, i, il;
                        if(mode > 0) {
                            if (mode == 1) document.getElementsByClassName("links_connect")[0].setAttribute('colspan', '3');
                            if (!SRDotDX.config.sbRightSide) document.getElementById('chat_container').style.marginLeft = "0px";
                            SRDotDX.c('td').set({id: 'dotdx_sidebar', style: 'width: ' + (SRDotDX.config.sbSlim ? '40' : '70') + 'px'})
                                .html('<div id="dotdx_sidebar_container"' + (SRDotDX.config.sbSlim ? ' class="slim"' : '') + '></div>', true)
                                .attach('after', SRDotDX.config.sbRightSide ? 'chat_container_cell' : 'gameholder');
                            SRDotDX.gui.chatResize(SRDotDX.config.chatSize);
                        }
                        if(mode == 0) {
                            sbElemTxt = '[' + document.getElementById('options_sbConfig').value + ']';
                            sbElemObj = JSON.parse(sbElemTxt);
                            SRDotDX.config.sbConfig = sbElemObj;
                            SRDotDX.config.save(false);
                        }
                        else sbElemObj = SRDotDX.config.sbConfig;
                        var slim = SRDotDX.config.sbSlim ? " slim" : "";
                        var sLen = SRDotDX.config.sbSlim ? 0 : 1;
                        var stopper = parseInt((document.getElementById('gameholder').offsetHeight - 36) / 26);
                        var sName = [["Ely","Elyssa"],["Kas","Kasan"]];
                        var sidebarElemHtml = '<div id="serverButton" class="' + slim + '" onclick="SRDotDX.gui.switchServer()">' + sName[SRDotDX.config.serverMode - 1][sLen] + '</div>', sbCmd = "", sbCls = 'class="';
                        for(i = 0, il = sbElemObj.length; i < il; ++i) {
                            if (i == stopper) break;
                            if (typeof sbElemObj[i] == 'undefined' || sbElemObj[i] == null) {
                                sidebarElemHtml += '<div></div>'; continue
                            }
                            if(sbElemObj[i].type == 'jtxt') {
                                sidebarElemHtml += '<input id="sbJoinStr" onkeyup="SRDotDX.gui.updateFilterTxt(this.value)" class="dotdx_chat_filter' + slim + '" type="text" value=""><div class="'+slim+'"></div>';
                                continue
                            }
                            if(sbElemObj[i].type == 'label') {
                                sidebarElemHtml += '<div class="label' + slim + '">';
                                if (SRDotDX.config.sbSlim) {
                                    if (typeof sbElemObj[i].sname == 'undefined') sidebarElemHtml += sbElemObj[i].name.substring(0, 4);
                                    else sidebarElemHtml += sbElemObj[i].sname;
                                }
                                else sidebarElemHtml += sbElemObj[i].name;
                                sidebarElemHtml += '</div>';
                                continue;
                            }
                            if(typeof sbElemObj[i].cmd != 'undefined') {
                                if (sbElemObj[i].cmd.charAt(0) == '/') sbCmd = 'SRDotDX.gui.chatCommand(\'' + sbElemObj[i].cmd + '\')';
                                else if (sbElemObj[i].cmd.indexOf('://') > 2) sbCmd = 'SRDotDX.gui.httpCommand(\'' + sbElemObj[i].cmd + '\')';
                                else sbCmd = sbElemObj[i].cmd.replace("'", "\'");
                            }
                            if(typeof sbElemObj[i].color != 'undefined') {
                                if (sbElemObj[i].color.charAt(0).toLowerCase() == 'b' && sbElemObj[i].color.toLowerCase() != 'black') sbCls += 'b';
                                else if (sbElemObj[i].color.charAt(0).toLowerCase() == 'g') sbCls += 'g';
                                else if (sbElemObj[i].color.charAt(0).toLowerCase() == 'r') sbCls += 'r';
                                else if (sbElemObj[i].color.charAt(0).toLowerCase() == 'y') sbCls += 'y';
                            }
                            sidebarElemHtml += '<button ' + sbCls + slim + '" ' + 'onclick="' + sbCmd + '">';
                            if(typeof sbElemObj[i].name == 'undefined') {
                                if (SRDotDX.config.sbSlim) sidebarElemHtml += 'Btn' + (i + 1);
                                else sidebarElemHtml += 'Button ' + (i + 1);
                            }
                            else {
                                if (SRDotDX.config.sbSlim)
                                    if (typeof sbElemObj[i].sname == 'undefined') sidebarElemHtml += sbElemObj[i].name.substring(0, 4);
                                    else sidebarElemHtml += sbElemObj[i].sname;
                                else sidebarElemHtml += sbElemObj[i].name
                            }
                            sidebarElemHtml += '</button>';
                            sbCmd = "";
                            sbCls = 'class="';
                        }
                        SRDotDX.c('#dotdx_sidebar_container').html(sidebarElemHtml, true);
                    }
                },
                toggleSlimSB: function () {
                    if (SRDotDX.config.sbEnable) {
                        this.applySidebarUI(2);
                        this.chatResize();
                    }
                },
                restoreDefaultSB: function () {
                    document.getElementById('options_sbConfig').value = '{"type":"label","name":"Camps"},\n\
                    {"type":"btn","name":"GoC","cmd":"/camp goc"},\n\
                    {"type":"btn","name":"MaM","cmd":"/camp mam"},\n\
                    {"type":"btn","name":"GD","cmd":"/camp gd"},\n\
                    {"type":"label","name":"Tiers"},\n\
                    {"type":"btn","name":"Bella","cmd":"/raid bella"},\n\
                    {"type":"btn","name":"Xerk","cmd":"/raid xerkara"},\n\
                    {"type":"btn","name":"Tisi","cmd":"/raid tisi"},\n\
                    {"type":"label","name":"Join"},\n\
                    {"type":"btn","name":"Farms","cmd":"SRDotDX.gui.quickImportAndJoin(\'farm:nnm\')"},\n\
                    {"type":"label","name":"Utils"},\n\
                    {"type":"btn","color":"g","name":"(Re)Load","sname":"Reld","cmd":"SRDotDX.reload()"},\n\
                    {"type":"btn","color":"r","name":"Unload","sname":"Kill","cmd":"/kill"},\n\
                    {"type":"btn","name":"Room 1","sname":"CR1","cmd":"SRDotDX.gui.gotoRoom(1)"},\n\
                    {"type":"btn","name":"Room 2","sname":"CR2","cmd":"SRDotDX.gui.gotoRoom(2)"},\n\
                    {"type":"btn","name":"Room 8","sname":"CR8","cmd":"SRDotDX.gui.gotoRoom(8)"},\n\
                    {"type":"label","name":"Sheets","sname":"Help"},\n\
                    {"type":"btn","name":"Magic","sname":"Mag","cmd":"https://docs.google.com/spreadsheets/d/1O0eVSnzlACP9XJDq0VN4kN51ESUusec3-gD4dKPHRNU"},\n\
                    {"type":"btn","name":"Mount","sname":"Mnt","cmd":"https://docs.google.com/spreadsheet/ccc?key=0AiSpM5yAo8atdER2NEhHY3VjckRhdWctWV8yampQZUE"},\n\
                    {"type":"btn","name":"Gear","cmd":"https://docs.google.com/spreadsheet/lv?key=0AvP2qXrWcHBxdHpXZkUzTHNGNkVWbjE5c2VEZUNNMUE"},\n\
                    {"type":"label","name":"Raids"},\n\
                    {"type":"jtxt"},\n\
                    {"type":"btn","color":"g","name":"Join","cmd":"SRDotDX.gui.joinSelectedRaids(true)"},\n\
                    {"type":"btn","color":"b","name":"Import","sname":"Imp","cmd":"SRDotDX.gui.importFromServer()"},\n\
                    {"type":"btn","color":"y","name":"RaidBot","sname":"Bot","cmd":"SRDotDX.gui.switchBot()"}';
                    SRDotDX.gui.applySidebarUI(0);
                },
                hideWC: function (init) {
                    var offset;
                    if(init) offset = SRDotDX.config.hideWChat ? -265 : 0;
                    else {
                        offset = SRDotDX.config.hideWChat ? 265 : -265;
                        SRDotDX.config.hideWChat = !SRDotDX.config.hideWChat;
                        document.getElementById('hideWCtxt').innerHTML = SRDotDX.config.hideWChat ? 'Show World Chat' : 'Hide World Chat';
                        SRDotDX.config.extSave();
                    }
                    var gmWidth = document.getElementById('gameholder').offsetWidth + offset;
                    document.getElementById('gameholder').style.width = gmWidth + "px";
                    document.getElementById('game').style.width = gmWidth + "px";
                    this.chatResize();
                },
                removeWC: function(rly) {
                    if(rly) {
                        SRDotDX.config.removeWChat = true;
                        var li = SRDotDX.c('#wcbutton').ele();
                        li.parentNode.removeChild(li);
                        if(!SRDotDX.config.hideWChat) {
                            SRDotDX.config.hideWChat = true;
                            this.hideWC(true);
                        }
                        SRDotDX.config.extSave();
                    }
                    else {
                        SRDotDX.config.removeWChat = false;
                        SRDotDX.c('li').set({id: 'wcbutton', class: 'rate'}).html('<a id="hideWCtxt" class="spritegame" href="http://www.kongregate.com/games/5thPlanetGames/dawn-of-the-dragons" onclick="SRDotDX.gui.hideWC(false); return false;">' + (SRDotDX.config.hideWChat ? 'Show World Chat' : 'Hide World Chat') + '</a>', false).attach('after', 'quicklinks_play_later_block');
                        SRDotDX.config.extSave();
                        setTimeout(activateGame,1000);
                    }
                },
                chatResize: function (chatSize) {
                    var size = chatSize || SRDotDX.config.chatSize;
                    SRDotDX.config.chatSize = size;
                    var gmWidth = document.getElementById('gameholder').offsetWidth;
                    var gmHeight = document.getElementById('gameholder').offsetHeight;
                    var sbWidth = SRDotDX.config.sbEnable ? (SRDotDX.config.sbSlim ? 40 : 70) : 0;
                    var hScroll = SRDotDX.config.hideScrollBar ? SRDotDX.gui.getScrollbarWidth() : 0;
                    var chatWidthInc = size - 300;
                    var chatCorr = chatWidthInc / 75 * 2;
                    var overallWidth = (292 + gmWidth + sbWidth + chatWidthInc) + "px";
                    document.getElementById('maingame').style.width = overallWidth;
                    document.getElementById('maingamecontent').style.width = overallWidth;
                    document.getElementById('flashframecontent').style.width = overallWidth;
                    document.getElementById('chat_container').style.width = size + "px";
                    document.getElementById('raid_list').style.width = 282 + hScroll + "px";
                    document.getElementById('raid_list').style.overflowY = hScroll ? 'scroll' : 'auto';
                    document.getElementById('chat_tab_pane').style.width = (size - 16) + "px";
                    document.getElementById('DotDX_chatResizeElems').innerHTML = '#kong_game_ui textarea.chat_input { width: ' + (size - 30) + 'px !important; }\
                                                                                #kong_game_ui div#chat_raids_overlay { width: ' + (size - 8) + 'px }\
                                                                                #kong_game_ui div#chat_raids_overlay > span { width: ' + (size - 18 - chatCorr) + 'px }\
                                                                                #kong_game_ui div.chat_message_window { height: ' + (gmHeight - 254) + 'px !important; width: ' + (size - 18 + hScroll) + 'px; overflow-y: ' + (hScroll ? 'scroll' : 'auto') + '; }\
                                                                                #kong_game_ui div#chat_rooms_container div.chat_tabpane.users_in_room { width: ' + (size - 22 + hScroll) + 'px }\
                                                                                div#dotdx_sidebar_container { height: ' + (gmHeight - 5) + 'px; ' + (SRDotDX.config.sbRightSide ? "text-align: left; padding-left: 1px; padding-right: 6px;" : "text-align: left; margin-left: 2px; padding-left: 6px") + ' }';
                },
                helpBox: function(boxId, magId, raidId, mouseOut) {
                    var boxDiv = document.getElementById(boxId);
                    var magSpan = document.getElementById(magId);
					var i, il;
                    if(mouseOut) {
                        SRDotDX.gui.CurrentRaidsOutputTimer = setTimeout(function(){document.getElementById('chat_raids_overlay').className = "";}, 1500);
                        if(magSpan) {
                            magSpan.style.maxWidth = "0";
                            setTimeout(function(){ document.getElementById(magId).innerHTML = "" }, 100);
                        }
                    }
                    else {
                        var info = SRDotDX.config.raidList[raidId], msg = 'Unknown', mWidth = "0", raid;
                        if (typeof info !== 'object') msg = 'Raid not in db (removed?)';
                        else if (typeof SRDotDX.raids[info.boss] == 'undefined') {
                            msg = '<span style="font-size: 12px;">' + info.boss.capitalize().replace(/_/ig, ' ') + ' on ' + ['Normal', 'Hard', 'Legendary', 'Nightmare'][info.diff - 1] + '</span>';
                        }
                        else {
                            var magE = info.magic.reduce(function(a,b){return a+b;});
                            raid = SRDotDX.raids[info.boss];
                            var diff = info.diff - 1;
                            if (magE) {
                                var magI = "";
                                for (i = 0, il = raid.nd; i < il; ++i) magI += '<span class="magic" style="background-position: -' + info.magic[i] * 16 + 'px 0">&nbsp;</span>';
                                magSpan.innerHTML = magI;
                                mWidth = (raid.nd * 18 + 10) + "px";
                            }
                            msg = '<span style="font-size: 12px;">' + raid.name + ' on ' + ['Normal', 'Hard', 'Legendary', 'Nightmare'][diff] + '</span><br>';
                            msg += (raid.type === '' ? '' : raid.type + ' | ') + SRDotDX.raidSizes[raid.size].name + ' Raid' + (diff == 3 ? ' | AP' : '');
                            var size = raid.size < 15 ? 10 : raid.size;
                            var fs = raid.health[diff] / (raid.size == 101 ? 100 : raid.size);
                            if (typeof raid.lt !== 'object') {
                                var epicRatio = SRDotDX.raidSizes[size].ratios;
                                if (size === 15) msg += '<br>fs:&thinsp;' + SRDotDX.util.getShortNum(fs) + ' | 65d:&thinsp;' + SRDotDX.util.getShortNum(fs * epicRatio[0]) + ' | 338d:&thinsp;' + SRDotDX.util.getShortNum(fs * epicRatio[9]) + ' | 375d:&thinsp;' + SRDotDX.util.getShortNum(fs * epicRatio[10]);
                                else msg += '<br>fs: ' + SRDotDX.util.getShortNum(fs) + ' | 1e: ' + SRDotDX.util.getShortNum(fs * epicRatio[0]) + ' | 2e: ' + SRDotDX.util.getShortNum(fs * epicRatio[2]) + ' | 2/3e: ' + SRDotDX.util.getShortNum(fs * epicRatio[3]);
                                //msg += '<br>2e: ' + epicRatio[2] + ' | 3e: ' + epicRatio[4] + ' | fs: ' + fs;
                            }
                            else if (typeof raid.lt === 'object') {
								if(raid.lt[0] !== 'u') {
									var ele = SRDotDX.lootTiers[raid.lt[diff]];
									var step = SRDotDX.config.chatSize === 450 ? 6 : (SRDotDX.config.chatSize === 375 ? 5 : 4);
									var steplow = step - 1;
									var tiers = ele['tiers'];
									var epics = ele['epics'];
									var best = ele['best'];
									var e = ele['e'] ? 'E' : '';
									var text = '</table>';
									var tier;
									for(i = tiers.length-1, il = -1; i > il; --i) {
										tier = (i % step == steplow ? '</td></tr><tr><td>' : '</td><td>' ) + epics[i]+ e + ':</td><td ' + (i === best ? 'class="best"' : '') + '>' + SRDotDX.util.getShortNumMil(tiers[i]);
										text = tier + text;
									}
									msg += '<table><tr><td>FS:</td><td>' + SRDotDX.util.getShortNum(fs) + text;
								}
								else msg += '<br>FS: &nbsp;&nbsp;&thinsp;' + SRDotDX.util.getShortNum(fs) + ' | Tiers not yet known.';
                            }
                            else {
                            }
                        }
                        if(magE) magSpan.style.maxWidth = mWidth;
                        document.getElementById(boxId + '_text').innerHTML = msg;
                        if(!(boxDiv.className.indexOf('active') > 0)) boxDiv.className = "active";
                        clearTimeout(SRDotDX.gui.CurrentRaidsOutputTimer);
                    }
                },
                displayHint: function (hint) {
                    var helpEl = document.getElementById('helpBox');
                    if(hint) {
                        helpEl.children[0].innerHTML = hint;
                        helpEl.style.maxHeight = '50px';
                        helpEl.style.borderTopWidth = '1px';
                    }
                    else {
                        helpEl.style.maxHeight = '0';
                        helpEl.style.borderTopWidth = '0';
                    }
                },
                refreshRaidList: function () {
                    document.getElementById('raid_list').innerHTML = "";
                    for(var i = 0, il = SRDotDX.gui.joinRaidList.length; i < il; ++i) SRDotDX.gui.addRaid(SRDotDX.gui.joinRaidList[i]);
                },
                diffTxt: [['DotDX_U','U'],['DotDX_N','N'],['DotDX_H','H'],['DotDX_L','L'],['DotDX_NM','NM']],
                addRaid: function (id) {
                    var r = typeof id === 'string' || typeof id === 'number' ? SRDotDX.config.raidList[id] : id;
                    var a = document.getElementById('raid_list');
                    if (r.boss) {
                        if (a !== null) {
                            var rd = typeof SRDotDX.raids[r.boss] != 'object' ? {shortname: r.boss.capitalize().replace(/_/ig, ' '), duration: 24} : SRDotDX.raids[r.boss];
                            var url = 'http://www.kongregate.com/games/5thPlanetGames/dawn-of-the-dragons?kv_action_type=raidhelp&kv_difficulty=' + r.diff + '&kv_hash=' + r.hash + '&kv_raid_boss=' + r.boss + '&kv_raid_id=' + r.id + '&kv_serverid=' + r.sid;
                            var hpr = (r.hp * 100).toPrecision(3), fCls = "";
                            var tlp = ((r.expTime - parseInt(new Date().getTime()/1000)) / (36 * rd.duration)).toPrecision(3);
                            var delta = hpr - tlp;
                            if (delta > 0) {
                                if (delta < 15) fCls = " failings";
                                else if (delta < 30) fCls = " failingm";
                                else fCls = " failingh";
                            }
                            var lii = SRDotDX.c('div').set({
                                class: 'raid_list_item ' + this.diffTxt[r.diff][0] + (r.visited ? ' DotDX_visitedRaidList' : ''),// + (r.nuked ? ' DotDX_nukedRaidList' : ''),
                                id: 'DotDX_' + r.id,
                                raidid: r.id
                            }).html(' \
						    <span class="DotDX_List_diff ' + this.diffTxt[r.diff][0] + '">' + this.diffTxt[r.diff][1] + '</span> \
							<a class="DotDX_RaidLink" href="' + url + '">' + rd.shortname + '</a> \
                            <span class="DotDX_RaidListVisited">' + (r.visited ? '&#9733;' : '') + (r.fs === 0 ? ' !' : '') + '</span> \
                            '+ //<a class="dotdxRaidListDelete" href="#">DEL</a>\
                            '<span class="DotDX_extInfo' + fCls + '">h|t: ' + hpr.slice(0,4) + '|' + tlp.slice(0,4) + ' %</span>\
						    ', true);
                            lii.attach('to', a);
                        }
                    }
                    else SRDotDX.gui.deleteRaidFromDB(id);
                },
                toggleRaidListDesc: function (el, mode) {
                    if(mode) {
                        clearTimeout(el.timerout);
                        el.timerin = setTimeout(function(){el.lastElementChild.style.display = "block";}, 500)
                    }
                    else {
                        clearTimeout(el.timerin);
                        el.timerout = setTimeout(function (){el.lastElementChild.style.display = "none";}, 50)
                    }
                    return false;
                },
                errorMessage: function (s, tag) {
                    tag = typeof tag === 'undefined' ? 'b' : tag;
                    SRDotDX.gui.doStatusOutput('<' + tag + '>' + s + '</' + tag + '>')
                },
                updateMessage: function () { SRDotDX.gui.doStatusOutput(SRDotDX.gui.standardMessage(), false, true) },
                postingMessage: function (i, ct) { SRDotDX.gui.doStatusOutput('Posting message ' + i + (typeof ct == 'undefined' ? '' : ' of ' + ct + '...'), false) },
                standardMessage: function () { return  Object.keys(SRDotDX.config.raidList).length + ' raids in db, ' + SRDotDX.gui.joinRaidList.length + ' selected to join'; },
                CurrentStatusOutputTimer: 0,
                doStatusOutput: function (str, msecs, showInChat) {
                    showInChat = showInChat === undefined ? true : showInChat;
                    msecs = msecs || 4000;
					var rel = document.getElementById('StatusOutput');
					var cel = document.getElementById('dotdx_chat_overlay');
					if(rel !== null) rel.innerHTML = str;
                    if(showInChat && cel !== null) cel.innerHTML = str;
                    if(msecs) {
                        if (SRDotDX.gui.CurrentStatusOutputTimer) clearTimeout(SRDotDX.gui.CurrentStatusOutputTimer);
                        SRDotDX.gui.CurrentStatusOutputTimer = setTimeout(function () {
							var rel = document.getElementById('StatusOutput');
							var cel = document.getElementById('dotdx_chat_overlay');
                            if(rel !== null) rel.innerHTML = SRDotDX.gui.standardMessage();
                            if(cel !== null) cel.innerHTML = SRDotDX.gui.standardMessage();
                        }, msecs);
                    }
                },
                toggleDisplay: function (elem, sender, el2) {
                    if (typeof elem == 'undefined') return;
                    var el = document.getElementById(elem);
                    var alls = document.getElementsByName(sender.getAttribute('name'));
                    if (alls.length > 0) {
                        for (var i = 0; i < alls.length; i++) {
                            if (alls[i].nodeName == 'P') alls[i].getElementsByTagName('span')[0].innerHTML = '+';
                            else alls[i].style.display = 'none';
                        }
                        el.style.display = 'block';
                        sender.getElementsByTagName('span')[0].innerHTML = '&minus;';
                    }
                    else {
                        if (el.style.display == 'none') {
                            el.style.display = 'block';
                            sender.getElementsByTagName('span')[0].innerHTML = '&minus;';
                        }
                        else {
                            el.style.display = 'none';
                            sender.getElementsByTagName('span')[0].innerHTML = '+';
                        }
                    }
                    if (typeof el2 == 'string') {
                        switch (el2) {
                            case 'raid_list': SRDotDX.refreshRaidTab(); break;
                            case 'share_list': document.getElementById('DotDX_raidsToSpam').style.height = ( 526 - document.getElementById('FPXShare').offsetHeight - document.getElementById('FPXImport').offsetHeight ) + "px";
                        }
                    }
                },
                Importing: false,
                deleteRaid: function(ele) {
                    var id = ele.getAttribute('raidid');
                    SRDotDX.gui.deleteRaidFromDB(id);
					if(!SRDotDX.gui.joining) SRDotDX.gui.refreshRaidList();
                },
                deleteRaidFromDB: function(id) {
                    var chat = document.getElementsByClassName('chat_message_window'), p, pe, i;
                    for(var c = 0, ci = chat.length; c < ci; ++c) {
                        p = chat[c].getElementsByClassName('DotDX_raid'); i = 0;
                        while(pe = p[i++]) if(pe.className.indexOf("DotDX_raidId_" + id) > -1) pe.parentNode.removeChild(pe);
                    }
                    if(SRDotDX.config.raidList[id]) delete SRDotDX.config.raidList[id];
                },
                FPXdeleteAllRaids: function() {
                    if (!SRDotDX.config.confirmDeletes || confirm('This will delete all ' + SRDotDX.config.raidList.length + ' raids stored. Continue? \n (This message can be disabled on the options tab.)')) {
                        for(var id in SRDotDX.config.raidList) if(SRDotDX.config.raidList[id]) delete SRDotDX.config.raidList[id];
                        var raidlistDIV = document.getElementById('raid_list');
                        while (raidlistDIV.hasChildNodes()) raidlistDIV.removeChild(raidlistDIV.lastChild);
                        localStorage.removeItem('raidList');
                        SRDotDX.gui.updateMessage();
                        console.log('[SRDotDX] Delete all raids finished.');
                    }
                },
                chatCommand: function (text) {
                    var elems = document.getElementsByClassName('chat_input');
                    var txt = [], i = elems.length;
                    while (i--) { txt[i] = elems[i].value; elems[i].value = text;  }
                    holodeck.activeDialogue().sendInput();
                    i = txt.length;
                    while (i--) elems[i].value = txt[i];
                },
                FPXdoWork: function (param1, whisper) {
                    var elems = document.getElementsByClassName('chat_input');
                    if (whisper && whisper != '') param1 = '/w ' + whisper + ' ' + param1;
                    var txt = [], i = elems.length;
                    while (i--) { txt[i] = elems[i].value; elems[i].value = param1; }
                    holodeck.activeDialogue().sendInput();
                    i = txt.length;
                    while (i--) elems[i].value = txt[i];
                },
                FPXformatRaidOutput: function (url) {
                    var pre = ''; //user && room ? '['+room+'|'+user+'] ' : '';
                    if (!SRDotDX.config.formatLinkOutput) return pre + url;
                    var r = SRDotDX.getRaidDetailsBase(url);
                    return pre + r.shortname + ' ' + r.diffShortText + ' ' + url;
                },
                isPosting: false,
                FPXTimerArray: [],
                FPXStopPosting: function () {
                    SRDotDX.gui.endSpammingRaids();
                    console.log('[DotDX] Spamming raids to chat... [cancelled]');
                    SRDotDX.util.extEcho('Raid posting cancelled');
                },
                endSpammingRaids: function () {
                    for(var i = 0, il = SRDotDX.gui.FPXTimerArray.length; i < il; ++i) clearTimeout(SRDotDX.gui.FPXTimerArray[i]);
                    SRDotDX.gui.isPosting = false;
                    document.getElementById('PostRaidsButton').value = 'Post';
                    document.getElementById('dotdx_share_post_button').value = 'Post Links to Chat';
                    document.getElementById('dotdx_share_post_button').value = 'Friend Share links';
                    SRDotDX.gui.doStatusOutput('Posting raids finished');
                    SRDotDX.gui.FPXTimerArray = [];
                    SRDotDX.config.save(false);
                },
                prepareSpammingRaids: function () {
                    SRDotDX.gui.isPosting = true;
                    document.getElementById('PostRaidsButton').value = 'Cancel';
                    document.getElementById('dotdx_share_post_button').value = 'Cancel';
                    document.getElementById('dotdx_friend_post_button').value = 'Cancel';
                    SRDotDX.gui.doStatusOutput('Posting raids started', false);
                },
                spamRaidsToFriends: function () {
                    SRDotDX.gui.prepareSpammingRaids();
                    var userList = [[],[],[],[],[]], keys = Object.keys(SRDotDX.config.friendUsers);
                    for(var k = 0, kl = keys.length; k < kl; ++k) for(var i = 0; i < 5; ++i) if(SRDotDX.config.friendUsers[keys[k]][i]) userList[i].push(keys[k]);
                    console.log('[DotDX] Spamming raids to friends... [started]');
                    var linkList = document.getElementById('DotDX_raidsToSpam').value;
                    if(linkList.length > 100) {
                        document.getElementById('DotDX_raidsToSpam').value = '';
                        var patt = new RegExp('http...www.kongregate.com.games.5thPlanetGames.dawn.of.the.dragons.[\\w\\s\\d_=&]+[^,]', 'ig');
                        var link, ct = 0, sel = 4, r, rs;
                        i = 0;
                        var timer = 500, ttw = 3050;
                        while ((link = patt.exec(linkList)) && SRDotDX.gui.isPosting) {
                            link = typeof link !== "string" ? link[0] : link;
                            r = SRDotDX.util.getRaidFromUrl(link);
                            rs = SRDotDX.raids[r.boss].size;
                            if (r.boss === 'serpina') sel = 0;
                            else if (rs < 26) sel = 1;
                            else if (rs === 50) sel = 2;
                            else if (rs === 100) sel = 3;
                            if(userList[sel].length > 0) {
                                for(var u = 0, ul = userList[sel].length; u < ul; ++u) {
                                    (function (p1, p2) {
                                        return SRDotDX.gui.FPXTimerArray[i] = setTimeout(function () {
                                            if (!SRDotDX.gui.isPosting) return;
                                            SRDotDX.gui.FPXdoWork(SRDotDX.gui.FPXformatRaidOutput(p1), p2);
                                            ++ct;
                                            SRDotDX.gui.postingMessage(ct, i);
                                        }, timer);
                                    })(link, userList[sel][u]);
                                    timer += ttw;
                                    i++;
                                }
                            }
                        }
                    }
                    SRDotDX.gui.FPXTimerArray[SRDotDX.gui.FPXTimerArray.length] = setTimeout(function () {
                        SRDotDX.gui.endSpammingRaids();
                        console.log('[DotDX] Spamming raids to friends... [stopped]');
                    }, timer);
                },
                FPXspamRaids: function () {
                    SRDotDX.gui.prepareSpammingRaids();
                    console.log('[DotDX] Spamming raids to chat... [started]');
					var linkList = document.getElementById('DotDX_raidsToSpam').value;
					if (linkList.length > 100) {
						document.getElementById('DotDX_raidsToSpam').value = '';
						var patt = new RegExp('http...www.kongregate.com.games.5thPlanetGames.dawn.of.the.dragons.[\\w\\s\\d_=&]+[^,]', 'ig');
						var link, ct = 0, i = 0;
						var timer = 500, ttw = 3050;
						var total = linkList.split(patt).length - 1;
						while ((link = patt.exec(linkList)) && SRDotDX.gui.isPosting) {
							(function (p1) {
								return SRDotDX.gui.FPXTimerArray[i] = setTimeout(function () {
									if (!SRDotDX.gui.isPosting) return;
									SRDotDX.gui.FPXdoWork(SRDotDX.gui.FPXformatRaidOutput(p1), SRDotDX.config.whisperTo);
									++ct;
									SRDotDX.gui.postingMessage(ct, total);
								}, timer);
							})(link);
							timer += ttw;
							i++;
						}
					}
					SRDotDX.gui.FPXTimerArray[SRDotDX.gui.FPXTimerArray.length] = setTimeout(function() {
						SRDotDX.gui.endSpammingRaids();
						console.log('[DotDX] Spamming raids to chat... [stopped]');
					}, timer);
                },
                quickImportAndJoin: function(joinStr, imp) {
                    SRDotDX.gui.updateFilterTxt(joinStr, false, true);
                    SRDotDX.request.quickBtnLock = false;
                    if(imp) {
						SRDotDX.request.joinAfterImport = true;
						SRDotDX.gui.importFromServer();
					}
                    else SRDotDX.gui.joinSelectedRaids();
                },
                importFromServer: function () {
                    var h = Math.ceil(((new Date).getTime() - SRDotDX.config.lastImported) / 3600000);
                    SRDotDX.util.extEcho('Importing raids from server');
                    SRDotDX.request.raids(false, h);
                },
                sortRaids: function () {
                    var raidArray = [], i, sortFunc;
                    var selectedSort = document.getElementById('FPXRaidSortSelection').value;
                    var selectedDir = document.getElementById('FPXRaidSortDirection').value;
                    var raidlistDIV = document.getElementById('raid_list');
                    var raidList = raidlistDIV.childNodes;
                    console.log('[SRDotDX] Sorting started ' + selectedSort + ' : ' + selectedDir);
                    i = raidList.length;
                    while (i--) raidArray.push(SRDotDX.config.raidList[raidList[i].getAttribute('raidid')]);
                    switch (selectedSort) {
                        case 'Id':
                            if (selectedDir == 'asc') sortFunc = function (a, b) {
                                if (!(typeof a.id === 'undefined' || typeof b.id === 'undefined') && a.id > b.id) return -1;
                                return 1;
                            };
                            else sortFunc = function (a, b) {
                                if (!(typeof a.id === 'undefined' || typeof b.id === 'undefined') && a.id < b.id) return -1;
                                return 1;
                            };
                            break;
                        case 'Time':
                            if (selectedDir == 'asc') sortFunc = function (a, b) {
                                if (!(typeof a.timeStamp === 'undefined' || typeof b.timeStamp === 'undefined') && a.timeStamp > b.timeStamp) return -1;
                                return 1;
                            };
                            else sortFunc = function (a, b) {
                                if (!(typeof a.timeStamp === 'undefined' || typeof b.timeStamp === 'undefined') && a.timeStamp < b.timeStamp) return -1;
                                return 1;
                            };
                            break;
                        case 'Name':
                            if (selectedDir == 'asc') sortFunc = function (a, b) {
                                a = SRDotDX.raids[a.boss];
                                b = SRDotDX.raids[b.boss];
                                //console.log(a + ' : ' + b + ' : ' + (typeof a === 'undefined') + ' : ' + (typeof b === 'undefined'));
                                if (!(typeof a === 'undefined' || typeof b === 'undefined') && a.name > b.name) return -1;
                                return 1;
                            };
                            else sortFunc = function (a, b) {
                                a = SRDotDX.raids[a.boss];
                                b = SRDotDX.raids[b.boss];
                                if (!(typeof a === 'undefined' || typeof b === 'undefined') && a.name < b.name) return -1;
                                return 1;
                            };
                            break;
                        case 'Diff':
                            if (selectedDir == 'asc') sortFunc = function (a, b) {
                                if (a.diff > b.diff) return -1;
                                return 1
                            };
                            else sortFunc = function (a, b) {
                                if (a.diff < b.diff) return -1;
                                return 1
                            };
                            break;
                    }
                    try {
                        raidArray.sort(sortFunc)
                    }
                    catch (e) {
                        console.log('[SRDotDX] Sorting error: ' + e);
                        return
                    }
                    raidlistDIV = document.getElementById('raid_list');
                    if(raidlistDIV !== null) while(raidlistDIV.hasChildNodes()) raidlistDIV.removeChild(raidlistDIV.lastChild);
                    i = raidArray.length;
                    while (i--) SRDotDX.gui.addRaid(raidArray[i]);
                    //SRDotDX.gui.FPXFilterRaidListByName();
                    console.log('[SRDotDX] Sorting finished');
                },
                joinRaidList: [],
                postRaidList: [],
                updateFilterTimeout: 0,
                filterSearchStringC: "",
                filterSearchStringR: "",
                updateFilterContext: true,
                includeDiff: function(str, dv) {
                    var diff = isNaN(parseInt(dv)) ? ({'n': 1, 'h': 2, 'l': 3, 'nm': 4, 'nnm': 0})[dv] || 5 : parseInt(dv);
                    var out = "";
                    var string = str.toString();
                    switch(diff) {
                        case 0: out = string.replace(/,|$/g, '_1,') + string.replace(/,|$/g, '_4,'); break;
                        case 1: case 2: case 3: case 4: out = string.replace(/,|$/g, '_' + diff + ','); break;
                        default: for(var i = 1; i < 5; ++i) out += string.replace(/,|$/g, '_' + i + ','); break;
                    }
                    return out.slice(0, -1);
                },
                updateFilterTxt: function(txt, fromRT, quick) {
                    clearTimeout(this.updateFilterTimeout);
                    var foundRaids = [], field, rf, i, il;
                    if(txt !== "") {
                        var searchArray = txt.split(/\s?\|\s?|\sor\s|\s?,\s?/ig);
						var keys = Object.keys(SRDotDX.raids);
                        for(i = 0, il = searchArray.length; i < il; ++i) {
                            field = searchArray[i].toLowerCase().split(':');
                            if (field[0] !== "") {
                                if(typeof SRDotDX.searchPatterns[field[0]] !== 'undefined') foundRaids.push(this.includeDiff(SRDotDX.searchPatterns[field[0]], field[1]));
                                else if(typeof SRDotDX.raids[field[0]] !== 'undefined') foundRaids.push(this.includeDiff(field[0], field[1]));
                                else {
                                    for(var k = 0, kl = keys.length; k < kl; ++k) {
                                            rf = (SRDotDX.raids[keys[k]].name + ':' + SRDotDX.raids[keys[k]].shortname + ':' + SRDotDX.raids[keys[k]].type).toLowerCase();
                                            if (rf.indexOf(field[0]) >= 0) foundRaids.push(this.includeDiff(keys[k], field[1]));
                                    }
                                }
                            }
                        }
                    }
                    var finalSearchString = foundRaids.length === 0 ? (txt !== "" ? "BREAK" : "" ) : "," + foundRaids.toString() + ",";
                    if(fromRT) {
                        SRDotDX.config.lastFilter[SRDotDX.config.serverMode - 1] = txt;
                        SRDotDX.config.filterSearchStringR = finalSearchString;
                    }
                    else if(quick) SRDotDX.request.filterSearchStringT = finalSearchString;
                    else {
                        var filterInputs = document.getElementsByClassName('dotdx_chat_filter');
                        for (i = 0, il = filterInputs.length; i < il; ++i) if(filterInputs[i].value !== txt) filterInputs[i].value = txt;
                        SRDotDX.config.chatFilterString = txt;
                        SRDotDX.config.filterSearchStringC = finalSearchString;
                    }
                    if(quick) {
                        SRDotDX.gui.selectRaidsToJoin('quick');
                        SRDotDX.config.save(false)
                    }
                    else this.updateFilterTimeout = setTimeout(function(){SRDotDX.gui.selectRaidsToJoin();SRDotDX.config.save(false)}, 300);
                },
                selectRaidsToJoin: function(from) {
                    if(SRDotDX.request.quickBtnLock) {
                        if(!SRDotDX.gui.joining) SRDotDX.gui.joinRaidList.length = 0;
                        SRDotDX.gui.updateFilterContext = document.getElementById('chat_tab').firstChild.className === 'active';
                        var searchString = from && from === 'quick' ? SRDotDX.request.filterSearchStringT : (SRDotDX.gui.updateFilterContext && SRDotDX.config.chatFilterString !== "" ? SRDotDX.config.filterSearchStringC : SRDotDX.config.filterSearchStringR);
                        var r, filter = SRDotDX.c('#DotDX_filters').ele().innerHTML, server = SRDotDX.config.serverMode, keys = Object.keys(SRDotDX.config.raidList);
                        if (searchString !== "BREAK") {
							for (var k = 0, kl = keys.length; k < kl; ++k) {
								r = SRDotDX.config.raidList[keys[k]];
								if (SRDotDX.config.fltShowAll || (r.sid === server &&
									((!SRDotDX.config.fltExclFull || r.fs > 0) && (SRDotDX.config.fltIncVis || !r.visited)) &&
									filter.indexOf('fltList_' + r.boss + '_' + (r.diff - 1)) < 0 &&
									(searchString === "" || searchString.indexOf("," + r.boss + "_" + r.diff + ",") >= 0) ))
									SRDotDX.gui.joinRaidList.push(r);
							}
						}
                        if (!SRDotDX.gui.joining) {
                            SRDotDX.gui.updateMessage();
                            SRDotDX.gui.refreshRaidList();
                        }
                    }
                },
                pushRaidToJoinQueue: function(id) {
                    var searchString = SRDotDX.gui.updateFilterContext && SRDotDX.config.chatFilterString !== "" ? SRDotDX.config.filterSearchStringC : SRDotDX.config.filterSearchStringR;
                    var r, filter = SRDotDX.c('#DotDX_filters').ele().innerHTML;
                    r = SRDotDX.config.raidList[id];
                    if(typeof r === 'object') {
                        if (SRDotDX.config.fltShowAll || (r.sid === SRDotDX.config.serverMode &&
                            ((!SRDotDX.config.fltExclFull || r.fs > 0) && (SRDotDX.config.fltIncVis || !r.visited)) &&
                            filter.indexOf('fltList_' + r.boss + '_' + (r.diff - 1)) < 0 &&
                            (searchString == "" || searchString.indexOf("," + r.boss + "_" + r.diff + ",") >= 0) ))
                            SRDotDX.gui.joinRaidList.push(r);
                    }
                },
                joining: false,
                joinRaidIndex: 0,
                joinRaidComplete: 0,
                joinRaidSuccessful: 0,
                joinRaidDead: 0,
                joinRaidInvalid: 0,
                joinSelectedRaids: function(fromChat) {
                    if (!this.joining) {
                        this.joining = true;
                        this.joinRaidIndex = 0;
                        this.joinRaidComplete = 0;
                        this.joinRaidSuccessful = 0;
                        this.joinRaidDead = 0;
                        this.joinRaidInvalid = 0;
                        if (SRDotDX.gui.joinRaidList.length == 0) {
                            this.joinFinish(true);
                            return
                        }
                        SRDotDX.c("#AutoJoinVisibleButton").ele().value = 'Cancel';
                        SRDotDX.c("#AutoImpJoinVisibleButton").ele().value = 'Cancel';
                        console.log('[DotDX] Joining ' + SRDotDX.gui.joinRaidList.length + ' raids');
                        while(SRDotDX.gui.joinRaidIndex < Math.min(20, SRDotDX.gui.joinRaidList.length)) SRDotDX.request.joinRaid(SRDotDX.gui.joinRaidList[SRDotDX.gui.joinRaidIndex++]);
                    }
                    else if(!fromChat) this.joinFinish();
                },
                joinFinish: function(recalc) {
                    this.joining = false;
                    SRDotDX.request.quickBtnLock = true;
                    SRDotDX.c("#AutoJoinVisibleButton").ele().value = 'Join';
                    SRDotDX.c("#AutoImpJoinVisibleButton").ele().value = 'Import & Join';
                    if (recalc) this.selectRaidsToJoin('joining finish');
                },
                refreshFriends: function() {
                    var content = "", ff, i, il, f = false, friend;
                    var parentDiv = SRDotDX.c('#FPXfsOptions');
					var friends = Object.keys(SRDotDX.config.friendUsers);
                    parentDiv.html('<span class="generic">User</span><span class="share">Srp</span><span class="share">Sml</span><span class="share">Med</span><span class="share">Lrg</span><span class="share" style="margin-right: 27px">Oth</span><hr style="width: 270px; margin: 3px auto 4px; border: 0; height: 1px; background-color: #999;">', true);
                    for(i = 0, il = friends.length; i < il; ++i) {
                            content += (f ? '<br>' : '') + '<span class="generic">' + friends[i] + '</span>' +
                            '<input type="checkbox" id="fs:' + friends[i] + ':0' + '"/><label for="fs:' + friends[i] + ':0' + '"></label>' +
                            '<input type="checkbox" id="fs:' + friends[i] + ':1' + '"/><label for="fs:' + friends[i] + ':1' + '"></label>' +
                            '<input type="checkbox" id="fs:' + friends[i] + ':2' + '"/><label for="fs:' + friends[i] + ':2' + '"></label>' +
                            '<input type="checkbox" id="fs:' + friends[i] + ':3' + '"/><label for="fs:' + friends[i] + ':3' + '"></label>' +
                            '<input type="checkbox" id="fs:' + friends[i] + ':4' + '"/><label for="fs:' + friends[i] + ':4' + '"></label>';
                            f = true;
                    }
                    parentDiv.html('<div style="overflow-y: scroll; width: 277px; height: 414px">' + content + '</div>', false);
					for(i = 0, il = friends.length; i < il; ++i) {
						ff = SRDotDX.config.friendUsers[friends[i]];
						SRDotDX.c('#fs:' + friends[i] + ':' + 0).on('click',SRDotDX.gui.fsEleClick).ele().checked = ff[0];
						SRDotDX.c('#fs:' + friends[i] + ':' + 1).on('click',SRDotDX.gui.fsEleClick).ele().checked = ff[1];
						SRDotDX.c('#fs:' + friends[i] + ':' + 2).on('click',SRDotDX.gui.fsEleClick).ele().checked = ff[2];
						SRDotDX.c('#fs:' + friends[i] + ':' + 3).on('click',SRDotDX.gui.fsEleClick).ele().checked = ff[3];
						SRDotDX.c('#fs:' + friends[i] + ':' + 4).on('click',SRDotDX.gui.fsEleClick).ele().checked = ff[4];
                            /*for (i = 0; i < 5; i++) SRDotDX.c('#fs:' + friends[i] + ':' + i).on('click', function (e) {
                                SRDotDX.gui.fsEleClick(e)
                            }).ele().checked = ff[i];*/
                    }
                },
                DeleteRaids: function() {
                    if(!this.joining) {
                        console.log('[DotDX] Erasing visible raids ...');
                        var rn = SRDotDX.gui.joinRaidList.length;
                        if(rn > 0 && (!SRDotDX.config.confirmDeletes || confirm('This will delete ' + rn + ' raids. Continue? \n (This message can be disabled on the options tab.)'))) {
                            for(var i = 0; i < rn; ++i) SRDotDX.gui.deleteRaidFromDB(SRDotDX.gui.joinRaidList[i].id);
                            SRDotDX.gui.doStatusOutput(i + ' raids deleted');
                            SRDotDX.gui.selectRaidsToJoin();
                            console.log('[DotDX] Erasing complete');
                        }
                    }
                },
                GetDumpText: function() {
                    var dumptext = "";
                    var pre = "http://www.kongregate.com/games/5thPlanetGames/dawn-of-the-dragons?kv_action_type=raidhelp";
                    var raid;
                    for(var i = 0, il = SRDotDX.gui.joinRaidList.length; i < il; ++i) {
                        raid = SRDotDX.gui.joinRaidList[i];
                        dumptext += pre + '&kv_raid_id=' + raid.id + '&kv_difficulty=' + raid.diff + '&kv_raid_boss=' + raid.boss + '&kv_hash=' + raid.hash + '&kv_serverid=' + raid.sid + ', ';
                    }
                    return dumptext;
                },
                RaidAction: function(f) {
                    switch(f) {
                        case 'share':
                            SRDotDX.gui.DumpRaidsToShare(true);
                            break;
                        case 'post':
                            if (SRDotDX.gui.isPosting) SRDotDX.gui.FPXStopPosting();
                            else { SRDotDX.gui.DumpRaidsToShare(); SRDotDX.gui.FPXspamRaids(); }
                            break;
                        case 'post_share':
                            if (SRDotDX.gui.isPosting) SRDotDX.gui.FPXStopPosting();
                            else SRDotDX.gui.FPXspamRaids();
                            break;
                        case 'post_friend':
                            if (SRDotDX.gui.isPosting) SRDotDX.gui.FPXStopPosting();
                            else SRDotDX.gui.spamRaidsToFriends();
                            break;
                        case 'delete':
                            SRDotDX.gui.DeleteRaids();
                            break;
                    }
                },
                DumpRaidsToShare: function(b) {
                    document.getElementById('DotDX_raidsToSpam').value = SRDotDX.gui.GetDumpText();
                    SRDotDX.gui.doStatusOutput('Copied ' + SRDotDX.gui.joinRaidList.length + ' raid links to share tab.');
                    console.log('[DotDX] Dumped ' + SRDotDX.gui.joinRaidList.length + ' to share');
                    if(b) {
                        var e = document.getElementById('lots_tab_pane').getElementsByTagName('li');
                        var i = e.length;
                        while (i--) if (e[i].getAttribute('class').indexOf('active') > -1) e[i].className = e[i].className.replace(/ active$/g, '');
                        (document.getElementById('FPXShareTab').parentNode).className += ' active';
                    }
                },
                BeginDeletingExpiredUnvisitedRaids: function() {
                    SRDotDX.gui.cleanRaidsDB();
                    setInterval(SRDotDX.gui.cleanRaidsDB, 600000)
                },
                cleanRaidsDB: function() {
                    var now = parseInt(new Date().getTime()/1000);
                    var r, st, cnt = 0, keys = Object.keys(SRDotDX.config.raidList);
                    for(var k = 0, kl = keys.length; k < kl; ++k) {
						r = SRDotDX.config.raidList[keys[k]];
						st = SRDotDX.raids[r.boss] !== undefined ? SRDotDX.raids[r.boss].stat : "S";
						if(st === "H" && (now-r.timeStamp)/3600 > 8) {
							SRDotDX.gui.deleteRaidFromDB(keys[k]);
							cnt++;
						}
						else if(st !== "H" && (now >= r.expTime || (r.ni && (now-r.timeStamp)/3600 > 3))) {
							SRDotDX.gui.deleteRaidFromDB(keys[k]);
							cnt++;
						}
                    }

					var chat = document.getElementsByClassName('chat_message_window'), p, pe, i;
					for(var c = 0, cl = chat.length; c < cl; ++c) {
						p = chat[c].getElementsByTagName('div'); i = 0;
						while(pe = p[i++]) if(pe.empty()) pe.parentNode.removeChild(pe);
					}

                    if(cnt > 0) {
                        SRDotDX.gui.doStatusOutput(cnt + ' expired raids removed from db.');
                        console.log('[DotDX] Number of expired raids removed: ' + cnt);
                        SRDotDX.gui.selectRaidsToJoin('prune');
                    }
                },
                switchBot: function() {
                    //console.log('[SRDotDX] Bot button clicked');
                    var chkBot = document.getElementById('SRDotDX_options_hideBotLinks');
                    chkBot.checked = !SRDotDX.config.hideBotLinks;
                    SRDotDX.config.hideBotLinks = chkBot.checked;
                    SRDotDX.c('#SRDotDX_botClass').html('.bot {display: ' + (chkBot.checked ? 'none !important' : 'block') + '}', true);
                    setTimeout(SRDotDX.gui.scrollChat, 50);
                },
                scrollChat: function(isAll) {
					if (isAll) {
						var c = document.getElementById('alliance_chat_window');
						c.scrollTop = c.scrollHeight;
					}
					else {
						var els = document.getElementById('chat_rooms_container').children;
						var i = SRDotDX.util.getChatNumber();
						if(els[i]) {
							var cw = els[i].getElementsByClassName('chat_message_window')[0];
							cw.scrollTop = cw.scrollHeight;
						}
					}
                },
                getScrollbarWidth: function() {
                    var scrollDiv = SRDotDX.c('div').set({id: "DotDX_scrollMeasure", style: "width:100px;height:100px;overflow:scroll;position:absolute;top:-9999px;"}).attach('to', document.body).ele();
                    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                    document.body.removeChild(document.getElementById('DotDX_scrollMeasure'));
                    return scrollbarWidth;
                },
                applyFontSize: function(num) {
                    var n = typeof num === 'number' ? num : SRDotDX.config.fontNum, s1, s2, mod = '';
                    //console.log("[DotDX] apply font size with id: " + n);
                    SRDotDX.config.fontNum = n;
                    switch(n) {
                        case 1: s1 = 12; s2 = 10; mod = '; vertical-align: top;'; break;
                        case 2: s1 = 10; s2 = 8; break;
                        default: s1 = 11; s2 = 9; break;
                    }
                    SRDotDX.c('#DotDX_fontClass').html('\
					#kong_game_ui div.chat_message_window p span.message, #kong_game_ui div.chat_message_window p span.separator, #kong_game_ui div.chat_message_window p span.username {font-size: ' + s1 + 'px}\
					#kong_game_ui div.chat_message_window p span.room, #kong_game_ui div.chat_message_window p span.timestamp {font-size: ' + s2 + 'px' + mod + '}\
					', true);
                },
                applyTabs: function() {
                    document.getElementById('lots_tab').firstChild.innerHTML = SRDotDX.config.dotdxTabName;
                    var elems = ["#DotDX_Dummy"];
                    if(SRDotDX.config.hideGameTab) elems.push("#kong_game_ui li#game_tab");
                    if(SRDotDX.config.hideAccTab) elems.push("#kong_game_ui li#accomplishments_tab");
                    SRDotDX.c('#DotDX_tabs').html(elems.join(", ") + ' { display: none !important }', true);
                },
                applyTheme: function(num) {
                    var n = typeof num == 'number' ? num : SRDotDX.config.themeNum;
                    //console.log("[DotDX] apply theme with id: " + n);
                    var c, check, radio;
                    SRDotDX.config.themeNum = n;
                    switch(n) {
                        case 1:
                            check = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAcCAYAAABoMT8aAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAJxSURBVEhL7VRLaxNRGL1QEIVs9AckDamZZPLOvDMzicZEjBltY5qnisFFKbgRVLoQEf0JVkShTUVQCl2oG9GNS0FcuXDpD3DrxneP3x0mfdimTXHjwoHDMN/cc+a73z1nmCAImVgs9joej39NJBLYAau07kM0Gu0EAoH9bHBR8W02m4WqqtB1fSg0TYMkSUgmkx+JI3l0xujLvzg5l8vBsizYtr0FvG6apiuSSqV4J8c8OmO8Pf4Fviifz6NQKGwLLmQYBtLpNEig5NHXBfiC7YgDcPH/ArsI/NUpbPTBMAx8wAWIsy5AxW8DJ/IFw8DfcyfKsvyTOi56dMYcx1nhWyCL/un9LeAC5XL5Xa1WEz06Y61Wa5zwst1uf+l0OtgBq7TmfbPZrDYajTGPzvacRup0jpAURdHnChDxzahpNNMZXCsWMJ+NfDoz7r/l8/n2cYEfo6RRz0i4YlpYadTxYrKClYOHPueCwXMj+SCXlXBZ1vG828SSU8Mj8sNsaAKq3x/c5ES7cASWTaahOydywbwk46qi41Wvi351CovUxUw48l0WonOhUGhsTcCkF8clBTOVMkqyCps/0/0GiTw728YikR9YeVwSIjAPR6/Tb+2AO0QuwAdUVXXcrVaozRbun3ZwPiPjdqmE5cY0+tT2gmFiNhKBFouDTmCzlblAMZPFPA2zf3IST2p1PO02sDxdd8lLioZeWIBFpzA0TIaqoRwWcS+Zcvf68BQRnSk8VhX0JsKwaBa7plHXdBwVRNxJpdE/4WBBN3CR9mzxmdCQR0qjQaSKGMNNql+g/ZqK6iZxb2nkJAqOIStrtX81jYz9Bt6mjYTW51PyAAAAAElFTkSuQmCC';
                            radio = 'iVBORw0KGgoAAAANSUhEUgAAAA0AAAAaCAYAAABsONZfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAI+SURBVDhPxZJNiBJhGMeHTgXdOrR0CUFdCTR1VscZW3W+Vs0P/JhZv2fVERSLukRBCEUHCRb6gKgg6tQlunrpVHSOztG9aLtsHQxcyv8+E22HcldvO/DjfWGe//M87/P8GfqO6Lp+PJ/P++m82Wg03vV6vXG/3//ZarW2isXiiP5dyGazvkwmc1LTtGPMH0GKgt92u90dEuBfOp3Oj0Kh8DKVSp2n8zRDgrPlcvkNZf1lmib2w/pPlUZUUWHocq1er08Mw8A8KpXKWJKkoSV6TZWwKCR6z6TT6S1qEYuSSCTGTDwe/04PxKKoqrrDRCKRD4qiYFFCodAnRhCEZyScRqNRzMOK83g8I0YUxUowGNwmMebhdru/yrI8YOhhZ3ief+z3+yeBQAD74fV6J9TaUxpckcnlcidoGDGWZZ9Tpm8+n29KYA8Knjqdzi/UzRMSVCmeZajXozT/UzSZVcp0dXl5+ZXD4fhst9u3bTbbR5fL9YJ2c92qYAnIdkuHaNh2s4lmrYYWYW4YMNvtgw1bL5Vgrq3hYiSKy6KIS5IIs6TBaDRmG7ak69igjQ84DnfOreIeLXOT53FFFFBb12cbNpNMwqQF3o3F8FBV/zLkWBhaEYVZho1LMprBEO7T+Yha3GOTW0FrXQMln2HYmIhqgMNtas2qYAkeyDJucT5UCzkr+H/DEpAFHgbL4kZIwJDEgxU/upk4EpTgAMPyiNCZVFQUs1lo6QwUSUI4HJ5vWEoCjqbIBbnf98MyrL60C6YGOtWmdTvcAAAAAElFTkSuQmCC';
                            c = ['#333', '#ddd', '#404040', '#fff', '#792c2c', '#333', '#101010', '0 0 5px #202020', '#333', '0 0 10px #000',
                                '#ccc', '#eee', '0 0 4px #555', '#000', '#444', '0 0 5px #888', '#fff', '#792c2c', '0 0 12px #fff', '#fff',
                                '#000', 'top,#aa4141,#5c2828', '0 0 5px #aaa;', '#555', '#000', '0 -2px 6px -3px #000', '#fff', '0 0 4px #000;', '#ccc', '#ddd',
                                'none', '#000', '0 0 5px 1px #222', '#444', '#fff', '#000', '#333', '0 0 8px #000', '#ccc', '#222',
                                '#111', '#fff', '0 0 4px #111', '#333', '#ddd', '#111', '#444', '#3a3a3a', '#111', 'none',
                                '#111', 'none', '#111', 'none', '#111', 'none', '#404040', '#60cc60', '#60cc60', '0 0 5px #00aa1a',
                                '#d6c96a', '#d6c96a', '0 0 5px #7e7400', '#e47070', '#e47070', '0 0 5px #aa0000', '#c28ee6', '#c28ee6', '0 0 5px #9000ff', '#000',
                                'top,#404040,#404040', '#000', 'top,#2a2a2a,#492c2c', '#78bcfa', '0 0 4px #000', '#6dc97c', '#ec6666', '#f8b60d', '0 0 5px #000', '#ccc',
                                '#fff', '0 0 6px #999', '#aaa', '#bbb', '#dfa160', '#ffb261', '0 0 4px #9b5812', '#000', '#404040', '0 0 6px #111',
                                '#eee', '#000', '0 0 3px #101010', '0 0 5px #000', 'top,#303030,#444', '#1a1a1a', '#000', '0 0 8px #fff', '#ddd', '#101010',
                                '0 0 3px #000', '0 0 5px #202020', 'top,#3a3a3a,#555', '#eee', '#000', '0 0 5px #000', '0 0 10px #111', 'top,#303030,#404040', '', '',
                                '', 'top,#303030,#406785', '', '', '', 'top,#303030,#306638', '', '', '', 'top,#303030,#693434',
                                '', '', '', 'top,#303030,#887E35', '#eaeaea', '0 0 5px #000', '#e0e0e0', '#101010', '0 0 5px #000', '0 0 5px #202020',
                                'top,#303030,#444', '', '', 'top,#2a2a2a,#222', '#eee', '#111', '0 0 5px #000', '0 0 4px #303030', 'top,#333,#555', '0 0 6px #101010',
                                'top,#2a2a2a,#404040', '#eee', '#1a1a1a', '0 0 5px #000', '0 0 5px #222', 'top,#333,#4a4a4a', '0 0 6px #111', '', 'top, #2a2a2a, #333', '0 0 6px #111',
                                '', 'top,#2a2a2a,#426B44', '0 0 6px #111', '', 'top,#2a2a2a,#40668d', '0 0 6px #111', '', 'top,#2a2a2a,#612525', '#e0e0e0', '#101010',
                                '0 0 5px #000', '0 0 8px #101010', 'top,#303030,#723434', 'top,#202020,#4d2424', '#eee', '0 0 4px #000', '#e0e0e0', '#888', 'top,#444,#555', '#eee',
                                '#000', '0 0 5px #000', '0 0 6px #111', 'left,#303030,#303030', '', '#aaa', '#000', '0 0 5px #000', 'top,#444,#444', '#606060',
                                '#101010', '#e5e5e5', '#f5f5f5', '0 0 6px #c0c0c0', '#eee', '#d83737', '0 0 3px #000', 'top,#404040,#556d52', 'top,#404040,#746c56', 'top,#404040,#664040',
                                'top,#404040,#604c70', '#00bb00', '#dbb32e', '#d13c3c', '#d16ad1', '#eee', '0 0 6px #000', '#101010', '0 0 5px #000', 'top,#2a2a2a,#3a3a3a',
                                '#777', '#e0e0e0', '0 0 5px #000', '#f0f0f0', '0 0 8px #000', '#e0e0e0', '0 0 5px #000', '#000', '#3a3a3a', '#303030',
                                '#000', '#202020', '', '#552727', '#686868', '#303030', '#c0c0c0', '', '#111', '#222',
                                '#e0e0e0', '#fff', '0 0 6px #999', '#ffda8e', '#ff8080', '#ff4040', '#ccc', '#2a2a2a'];
                            break;
                        default:
                            check = 'iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAC4SURBVDhPnZNRCsQgDAW9pPfxuCKICCIiyC62RPIksnEDU2zMlH7kGefc5xYzax5uas5ba19xjKEGxN67GhBba2pArLWqAbGUogbEnLMaEFNKakCMMaoBMYSgBkTvvRoQb3nEv0v64i/Wr94UiFIKToAopYDDZ0CUUkDMez4DIt/8PQkE7y2Rbz6905nfU3+JfPN3eDJoZon79hO8z++XKCVg7xEgSik4AaKUghMg3vKI83GLMcZ8AZMOnRQ6c3RxAAAAAElFTkSuQmCC';
                            radio = 'iVBORw0KGgoAAAANSUhEUgAAAA0AAAAaCAYAAABsONZfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAFpSURBVDhP1VJNi4IAEPV3durU1V/QJTAIT3WQopvRD4ggCTKrQ8d+gwkRlB+RKBHhW96sxUrrurdlBx7DvHnjqPOUr3E+nzGbzdDr9dBsNiWzJp9LirFYLNDpdLDdbnE6ncBgZk2e/Vz6GavVCsPhEEmSIMuyN5BnnzoZCIIA7XYbURTh8XiUgn3qqFcsy8Jms8H9fq8EddQr3W4Xh8MBt9utEtRRr2iahjAM5b2rQB31smm/3yOO40pQJ5t4h+VyicvlUgnqqJeDcqXnebK+DOxT9zo0/3+/38fxeITv+28gz/7rTs+Yz+fQdV1ewXVdcQMza/Ls59Ji8ImTyURsQ+8xsyafS97jnxh2vV5jPB5LrjQs/dVqtVCr1VCv1yWzJl9qWMdx0Gg0oKrqC6xt2y43rGmahYEnRqNRuWG5/rsh8qWGZcMwjMLAYDAQ/kfD8oN3ux2m06lk1r8y7PV6RZqmkv/SsIryAXc40Mw81bSxAAAAAElFTkSuQmCC';
                            c = ['#404040', '#303030', '#e0e0e0', '#000', '#f0f0f0', '#ccc', '#6a6a6a', '0 0 4px #707070', '#ddd', '0 0 5px #333',
                                '#666', '#222', '0 0 3px #ccc', '#aaa', '#e6e6e6', '0 0 5px #888', '#000', '#f5f5f5', '0 0 5px #999', '#000',
                                '#888', 'top,#fff,#ddd', '0 0 5px #555;', '#f6f6f6', '#888', '0 -2px 6px -4px #444', '#222', '', '#777', '#888',
                                'underline', '#888', '0 0 6px #999', '#fff', '#000', '#777', '#fff', '0 0 8px #999', '#4b4b4b', '#f0f0f0',
                                '#bbb', '#333', '0 0 4px #ddd', '#fff', '#222', '#d0d0d0', '#fff', '#f7f7f7', '#8ab389', 'top,#cbe7c4,#f3faf2',
                                '#adad68', 'top,#f7f0c8,#fcfbf8', '#b18780', 'top,#f3d7d1,#FCF7F7', '#a99abb', 'top,#ddd4e2,#f4f0f7', '#fff', '', '', '0 0 5px #aaa',
                                '', '', '0 0 5px #aaa', '', '', '0 0 5px #aaa', '', '', '0 0 5px #aaa', '#c0c0c0',
                                'top,#f0f0f0,#fff', '#a1b4be', 'top,#dce8f1,#eff4f7', '#276594', 'none', '#267422', '#973131', '#085088', 'none', '#444',
                                '#000', '0 0 6px #888', '#666', '#666', '#946a3d', '#946a3d', '0 0 4px #f5Cc68Aa', '#777', '#eee', '0 0 7px #777',
                                '#000', '#606060', '0 0 3px #707070', '0 0 4px #ccc', 'top,#fff,#ddd', '#808080', '#707070', '0 0 4px #909090', '#111', '#707070',
                                '0 0 5px #aaa', '0 0 5px #808080', 'top,#f5f5f5,#dadada', '#fff', '#444', '0 0 10px #eee', '0 0 7px #222', 'top,#999,#555', '#000', '0 0 10px #fff',
                                '0 0 7px #1c3a61', 'top,#dcf0fd,#6794b2', '#000', '0 0 10px #fff', '0 0 7px #3d6425', 'top,#effde5,#618d4f', '#000', '0 0 10px #fff', '0 0 7px #412222', 'top,#ffefef,#aa5858',
                                '#000', '0 0 10px #fff', '0 0 7px #807823', 'top,#fffbe0,#c9b41d', '#101010', '0 0 8px #fff', '#333', '#707070', '0 0 6px #999', '0 0 5px #808080',
                                'top,#f5f5f5,#dadada', '', '', 'top,#f5f5f5,#fff', '#222', '#999', '0 0 4px #ccc', '0 0 4px #ccc', 'top,#ccc,#eee', '0 0 4px #bbb',
                                'top,#ccc,#ddd', '#444', '#aaa', '', '0 0 3px #ddd', 'top, #eee, #fff', '0 0 5px #bbb', '0 0 3px #bbb', 'top,#fff,#ccc', '0 0 5px #a7ca9c',
                                '0 0 3px #bbb', 'top, #fff, #b9daaf', '0 0 5px #a9d3ff', '0 0 3px #bbb', 'top, #fff, #a4c8ee', '0 0 5px #ffbaba', '0 0 3px #bbb', 'top,#fff,#f0a4a4', '#222', '#aaa',
                                '', '0 0 4px -1px #aaa', 'top,#fff,#d1dfee', 'top, #dfe8f1,#fff', '#333', '', '#bbb', '#ccc', 'top,#eee,#fff', '#444',
                                '#aaa', '1px 1px 2px #ddd', '0 0 4px #ccc', 'left,#fff,#eee', '0 0 3px #ddd', '#aaa', '#aaa', '0 0 3px #ccc', 'top,#f5f5f5,#f6f6f6', '#fff',
                                '#e0e0e0', '#111', '#111', '0 0 8px #777', '#000', '#bd0000', '0 0 2px #ff8e8e', 'top,#d8ecd3,#f5f5f5', 'top,#faf4d2,#f5f5f5', 'top,#fae4df,#f5f5f5',
                                'top,#e9dcf3,#f5f5f5', '#00bb00', '#dbb32e', '#d13c3c', '#d16ad1', '#000', '0 0 6px #808080', '#808080', '0 0 5px #aaa', 'top,#d0d0d0,#f0f0f0',
                                '#ccc', '#222', '', '', '0 0 4px #ccc', '', '', '#bbb', '#fff', '',
                                '#bbb', '#efefef', '#fafafa', '#eff4f9', '#5f9ea0', '#eff4f9', '#606060', 'none', '#202020', '#ddd',
                                '#e0e0e0', '#fff', '0 0 6px #999', '#b97c00', '#c82929', '#b10000', '', ''];
                            break;
                    }

                    SRDotDX.c('#DotDX_themeClass').html('\
                #maingame, #quicklinks li, div.game_page_wrap, div#kong_game_ui, #kong_game_ui .tabpane {background-color:' + c[0] + ' !important;}\
                #kong_game_ui ul.main_tabs li.tab a, div#serverButton {color:' + c[1] + '; background-color:' + c[2] + '; border-color:' + c[95] + ';}\
                #kong_game_ui ul.main_tabs li.tab a.active, div#serverButton:hover {color:' + c[3] + '; background-color:' + c[4] + '; border-color:' + c[96] + '; text-shadow:' + c[97] + ';}\
                #kong_game_ui div#chat_tab_pane, div#dotdx_sidebar_container, #kong_game_ui div#lots_tab_pane, #kong_game_ui ul.main_tabs {background-color:' + c[5] + ' !important;}\
                #kong_game_ui div#chat_window, #kong_game_ui div#lots_tab_pane div#dotdx_shadow_wrapper {border-color:' + c[6] + '; box-shadow:' + c[7] + ';}\
                #kong_game_ui div#chat_window_header, #kong_game_ui div#lots_tab_pane div#dotdx_shadow_wrapper {background-color:' + c[8] + ';}\
                #kong_game_ui div#chat_window_header {box-shadow:' + c[9] + ';}\
                #kong_game_ui div#chat_window_header div.dotdx_chat_overlay {border-color:' + c[175] + ';}\
                #kong_game_ui div#chat_window_header div.room_name_container, #kong_game_ui div#dotdx_status_div, #kong_game_ui .panel_handle a, #kong_game_ui #accomplishments_pane_title {color:' + c[10] + ';}\
                #kong_game_ui div#chat_window_header div.room_name_container .room_name, #kong_game_ui div#chat_window_header div.dotdx_chat_overlay > span, #kong_game_ui div#dotdx_status_div span, #kong_game_ui div#chat_room_tabs div a, #kong_game_ui div#alliance_tab a, #kong_game_ui div#lots_tab_pane ul li.tab div.tab_head {color:' + c[11] + '; text-shadow:' + c[12] + ';}\
                #kong_game_ui div#chat_window_header div.room_name_container, #kong_game_ui div#chat_room_tabs div a, #kong_game_ui div#alliance_tab a, #kong_game_ui div#dotdx_status_div, #kong_game_ui div#lots_tab_pane ul li.tab div.tab_head {border-color:' + c[13] + '; background-color:' + c[14] + ';}\
                #kong_game_ui div#chat_room_tabs div a:hover, #kong_game_ui div#alliance_tab a:hover, #kong_game_ui div#lots_tab_pane ul li.tab div.tab_head:hover {text-shadow:' + c[15] + '}\
                #kong_game_ui div#chat_room_tabs div.active a, #kong_game_ui div#alliance_tab.active a, #kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_head {color:' + c[16] + '; background-color:' + c[17] + '; text-shadow:' + c[18] + ';}\
                #kong_game_ui div.chat_actions_container span.btn {color:' + c[19] + ' !important; border-color:' + c[20] + '; background:-webkit-linear-gradient(' + c[21] + '); background:-moz-linear-gradient(' + c[21] + ');}\
                #kong_game_ui div.chat_actions_container span.kong_ico.btn_target:active {text-shadow:' + c[22] + ';}\
                #kong_game_ui div#chat_rooms_container div.chat_tabpane.users_in_room, #kong_game_ui div#lots_tab_pane ul li.tab div.tab_pane { background-color:' + c[23] + '; border-color:' + c[24] + ';}\
                #kong_game_ui div#chat_rooms_container div.chat_tabpane.users_in_room { box-shadow: inset ' + c[25] + ';}\
                #kong_game_ui .user_row .username, #kong_game_ui div#lots_tab_pane ul { color:' + c[26] + '; text-shadow:' + c[27] + ';}\
                #kong_game_ui .user_row.away .username {color:' + c[28] + ';}\
                #kong_game_ui .user_row .guild-name {color:' + c[29] + ';}\
                #kong_game_ui .user_row .username {text-decoration:' + c[30] + ';}\
                #kong_game_ui div.chat_controls {border-color:' + c[31] + '; box-shadow:' + c[32] + ';}\
                #kong_game_ui div.chat_controls, #kong_game_ui textarea.chat_input {background-color:' + c[33] + ';}\
                #kong_game_ui textarea.chat_input {color:' + c[34] + ';}\
                #kong_game_ui div.chat_actions_container ul.chat_actions_list {border-color:' + c[35] + '; background-color:' + c[36] + '; box-shadow:' + c[37] + ';}\
                #kong_game_ui div.chat_actions_container ul.chat_actions_list li {border-color:' + c[36] + '; color:' + c[38] + ';}\
                #kong_game_ui div.chat_actions_container ul.chat_actions_list li:hover {background-color:' + c[39] + '; border-color:' + c[40] + '; color:' + c[41] + '; box-shadow:' + c[42] + ';}\
                #kong_game_ui div.chat_message_window {background-color:' + c[43] + '; color:' + c[44] + ';}\
                #kong_game_ui div.chat_message_window p {border-bottom-color:' + c[45] + '; border-top-color:' + c[46] + ';}\
                #kong_game_ui div.chat_message_window p.even {background-color:' + c[47] + ';}\
                #kong_game_ui div.chat_message_window p.DotDX_raid, #kong_game_ui div.chat_message_window p.whisper, #kong_game_ui div.chat_message_window p.script {border-top-color:' + c[56] + ';}\
				#kong_game_ui div.chat_message_window p.DotDX_diff_1 {border-bottom-color:' + c[48] + '; background: -webkit-linear-gradient(' + c[49] + '); background: -moz-linear-gradient(' + c[49] + ');} \
				#kong_game_ui div.chat_message_window p.DotDX_diff_2 {border-bottom-color:' + c[50] + '; background: -webkit-linear-gradient(' + c[51] + '); background: -moz-linear-gradient(' + c[51] + ');} \
				#kong_game_ui div.chat_message_window p.DotDX_diff_3 {border-bottom-color:' + c[52] + '; background: -webkit-linear-gradient(' + c[53] + '); background: -moz-linear-gradient(' + c[53] + ');} \
				#kong_game_ui div.chat_message_window p.DotDX_diff_4 {border-bottom-color:' + c[54] + '; background: -webkit-linear-gradient(' + c[55] + '); background: -moz-linear-gradient(' + c[55] + ');} \
                #kong_game_ui div.chat_message_window p span.message a {color:' + c[79] + '}\
                #kong_game_ui div.chat_message_window p span.message a:hover {color:' + c[80] + '; text-shadow:' + c[81] + ';}\
                #kong_game_ui div.chat_message_window p.DotDX_diff_1 span.message a {color:' + c[57] + '; text-shadow:' + c[74] + ';}\
                #kong_game_ui div.chat_message_window p.DotDX_diff_1 span.message a:hover {color:' + c[58] + '; text-shadow:' + c[59] + ';}\
                #kong_game_ui div.chat_message_window p.DotDX_diff_2 span.message a {color:' + c[60] + '; text-shadow:' + c[74] + ';}\
                #kong_game_ui div.chat_message_window p.DotDX_diff_2 span.message a:hover {color:' + c[61] + '; text-shadow:' + c[62] + ';}\
                #kong_game_ui div.chat_message_window p.DotDX_diff_3 span.message a {color:' + c[63] + '; text-shadow:' + c[74] + ';}\
                #kong_game_ui div.chat_message_window p.DotDX_diff_3 span.message a:hover {color:' + c[64] + '; text-shadow:' + c[65] + ';}\
                #kong_game_ui div.chat_message_window p.DotDX_diff_4 span.message a {color:' + c[66] + '; text-shadow:' + c[74] + ';}\
                #kong_game_ui div.chat_message_window p.DotDX_diff_4 span.message a:hover {color:' + c[67] + '; text-shadow:' + c[68] + ';}\
                #kong_game_ui div.chat_message_window p.script {border-bottom-color:' + c[69] + '; background: -webkit-linear-gradient(' + c[70] + '); background: -moz-linear-gradient(' + c[70] + ');}\
                #kong_game_ui div.chat_message_window p.whisper {border-bottom-color:' + c[71] + '; background: -webkit-linear-gradient(' + c[72] + '); background: -moz-linear-gradient(' + c[72] + '); }\
                #kong_game_ui div.chat_message_window p span.username, #kong_game_ui div.chat_message_window p.script span.emph {color:' + c[73] + '; text-shadow:' + c[74] + ';}\
                #kong_game_ui div.chat_message_window p span.username.ign {color:' + c[75] + ';}\
                #kong_game_ui div.chat_message_window p.sent_whisper span.username, #kong_game_ui div.chat_message_window p span.username.is_self, #kong_game_ui div.chat_message_window p.script span.emph {color:' + c[76] + ';}\
                #kong_game_ui div.chat_message_window p.emote {color:' + c[77] + '; text-shadow:' + c[78] + ';}\
                #kong_game_ui div.chat_message_window p span.room {color:' + c[82] + ';}\
                #kong_game_ui div.chat_message_window p span.timestamp, #kong_game_ui div.chat_message_window p span.ingamename {color:' + c[83] + ';}\
                #kong_game_ui div.chat_message_window p span.message a.reply_link {color:' + c[79] + '}\
                #kong_game_ui div.chat_message_window p span.message a.reply_link:hover {color:' + c[80] + '; text-shadow:' + c[81] + ';}\
                #kong_game_ui div.chat_message_window p span.message a.chat_link {color:' + c[84] + ';}\
                #kong_game_ui div.chat_message_window p span.message a.chat_link:hover {color:' + c[85] + '; text-shadow:' + c[86] + ';}\
                #kong_game_ui div.chat_message_window p > span.slider {border-color:' + c[87] + '; background:' + c[88] + '; box-shadow:' + c[89] + ';}\
                #kong_game_ui div#chat_raids_overlay {color:' + c[90] + '; border-color:' + c[91] + '; box-shadow:' + c[92] + '; text-shadow:' + c[93] + '; background: -webkit-linear-gradient(' + c[94] + '); background: -moz-linear-gradient(' + c[94] + ');}\
                div#dotdx_sidebar_container > button {color:' + c[98] + '; border-color:' + c[99] + '; text-shadow:' + c[100] + '; box-shadow:' + c[101] + '; background: -webkit-linear-gradient(' + c[102] + '); background: -moz-linear-gradient(' + c[102] + ');}\
                div#dotdx_sidebar_container > button:hover {color:' + c[103] + '; border-color:' + c[104] + '; text-shadow:' + c[105] + '; box-shadow:' + c[106] + '; background: -webkit-linear-gradient(' + c[107] + '); background: -moz-linear-gradient(' + c[107] + ');}\
                div#dotdx_sidebar_container > button.b:hover {color:' + c[108] + '; text-shadow:' + c[109] + '; box-shadow:' + c[110] + '; background: -webkit-linear-gradient(' + c[111] + '); background: -moz-linear-gradient(' + c[111] + ');}\
                div#dotdx_sidebar_container > button.g:hover {color:' + c[112] + '; text-shadow:' + c[113] + '; box-shadow:' + c[114] + '; background: -webkit-linear-gradient(' + c[115] + '); background: -moz-linear-gradient(' + c[115] + ');}\
                div#dotdx_sidebar_container > button.r:hover {color:' + c[116] + '; text-shadow:' + c[117] + '; box-shadow:' + c[118] + '; background: -webkit-linear-gradient(' + c[119] + '); background: -moz-linear-gradient(' + c[119] + ');}\
                div#dotdx_sidebar_container > button.y:hover {color:' + c[120] + '; text-shadow:' + c[121] + '; box-shadow:' + c[122] + '; background: -webkit-linear-gradient(' + c[123] + '); background: -moz-linear-gradient(' + c[123] + ');}\
                div#dotdx_sidebar_container > div.label {color:' + c[124] + '; text-shadow:' + c[125] + ';}\
                div#dotdx_sidebar_container > input[type=\"text\"] {color:' + c[126] + '; border-color:' + c[127] + '; text-shadow:' + c[128] + '; box-shadow:' + c[129] + '; background: -webkit-linear-gradient(' + c[130] + '); background: -moz-linear-gradient(' + c[130] + ');}\
                div#dotdx_sidebar_container > input[type=\"text\"]:hover, div#dotdx_sidebar_container > input[type=\"text\"]:focus {color:' + c[131] + '; border-color:' + c[132] + '; background: -webkit-linear-gradient(' + c[133] + '); background: -moz-linear-gradient(' + c[133] + ');}\
                #kong_game_ui div.tab_pane p.collapsingCategory {color:' + c[134] + '; border-color:' + c[135] + '; text-shadow:' + c[136] + '; box-shadow:' + c[137] + '; background: -webkit-linear-gradient(' + c[138] + '); background: -moz-linear-gradient(' + c[138] + ');}\
                #kong_game_ui div.tab_pane p.collapsingCategory:hover {box-shadow:' + c[139] + '; background: -webkit-linear-gradient(' + c[140] + '); background: -moz-linear-gradient(' + c[140] + ');}\
                #kong_game_ui div.tab_pane input[type=\"button\"] {color:' + c[141] + '; border-color:' + c[142] + '; text-shadow:' + c[143] + '; box-shadow:' + c[144] + '; background: -webkit-linear-gradient(' + c[145] + '); background: -moz-linear-gradient(' + c[145] + ');} \
				#kong_game_ui div.tab_pane input[type=\"button\"].generic:hover {box-shadow:' + c[146] + '; text-shadow:' + c[147] + '; background: -webkit-linear-gradient(' + c[148] + '); background: -moz-linear-gradient(' + c[148] + ');}\
				#kong_game_ui div.tab_pane input[type=\"button\"].green:hover, #kong_game_ui div.tab_pane input.landpmbuttonhigh {box-shadow:' + c[149] + '; text-shadow:' + c[150] + '; background: -webkit-linear-gradient(' + c[151] + '); background: -moz-linear-gradient(' + c[151] + ');}\
				#kong_game_ui div.tab_pane input[type=\"button\"].blue:hover {box-shadow:' + c[152] + '; text-shadow:' + c[153] + '; background: -webkit-linear-gradient(' + c[154] + '); background: -moz-linear-gradient(' + c[154] + ');}\
				#kong_game_ui div.tab_pane input[type=\"button\"].red:hover, #kong_game_ui div.tab_pane input[type=\"button\"][value=\"Cancel\"]:hover {box-shadow:' + c[155] + '; text-shadow:' + c[156] + '; background: -webkit-linear-gradient(' + c[157] + '); background: -moz-linear-gradient(' + c[157] + ');}\
				#kong_game_ui input#raidsBossFilter {color:' + c[158] + '; border-color:' + c[159] + '; text-shadow:' + c[160] + '; box-shadow:' + c[161] + '; background: -webkit-linear-gradient(' + c[162] + '); background: -moz-linear-gradient(' + c[162] + ');}\
				#kong_game_ui input#raidsBossFilter:hover, input#raidsBossFilter:focus {background: -webkit-linear-gradient(' + c[163] + '); background: -moz-linear-gradient(' + c[163] + ');}\
				ul#SRDotDX_tabpane_tabs input[type="text"].generic {color:' + c[164] + '; text-shadow:' + c[165] + '; border-bottom-color:' + c[166] + ';}\
				ul#SRDotDX_tabpane_tabs input[type="text"].generic:focus {border-color:' + c[167] + '; background: -webkit-linear-gradient(' + c[168] + '); background: -moz-linear-gradient(' + c[168] + ');}\
				textarea#DotDX_raidsToSpam, textarea#options_sbConfig {color:' + c[169] + '; border-color:' + c[170] + '; text-shadow:' + c[171] + '; box-shadow:' + c[172] + '; background: -webkit-linear-gradient(' + c[173] + '); background: -moz-linear-gradient(' + c[173] + ');}\
                #kong_game_ui span.notice {text-shadow:' + c[174] + ';}\
                #kong_game_ui ul#SRDotDX_tabpane_tabs input[type="checkbox"] + label:before {background: url(data:image/png;base64,' + check + ') 0 0 no-repeat}\
                #kong_game_ui ul#SRDotDX_tabpane_tabs input[type="checkbox"]:checked + label:before {background: url(data:image/png;base64,' + check + ') 0 -14px no-repeat}\
                #kong_game_ui ul#SRDotDX_tabpane_tabs input[type="radio"] + label:before {background: url(data:image/png;base64,' + radio + ') 0 0 no-repeat}\
                #kong_game_ui ul#SRDotDX_tabpane_tabs input[type="radio"]:checked + label:before {background: url(data:image/png;base64,' + radio + ') 0 -13px no-repeat}\
                #kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list {border-top-color:' + c[176] + '; box-shadow:' + c[177] + '; background: -webkit-linear-gradient(' + c[178] + '); background: -moz-linear-gradient(' + c[178] + ');}\
                #kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list .raid_list_item {border-top-color:' + c[179] + '; border-bottom-color:' + c[180] + ';}\
                a.DotDX_RaidLink {color:' + c[181] + ';}\
                a.DotDX_RaidLink:hover {color:' + c[182] + '; text-shadow:' + c[183] + ';}\
                a.dotdxRaidListDelete {color:' + c[184] + ';}\
                a.dotdxRaidListDelete:hover {color:' + c[185] + '; text-shadow:' + c[186] + ';}\
                #raid_list .raid_list_item.DotDX_N:hover {background: -webkit-linear-gradient(' + c[187] + '); background: -moz-linear-gradient(' + c[187] + ');}\
                #raid_list .raid_list_item.DotDX_H:hover {background: -webkit-linear-gradient(' + c[188] + '); background: -moz-linear-gradient(' + c[188] + ');}\
                #raid_list .raid_list_item.DotDX_L:hover {background: -webkit-linear-gradient(' + c[189] + '); background: -moz-linear-gradient(' + c[189] + ');}\
                #raid_list .raid_list_item.DotDX_NM:hover {background: -webkit-linear-gradient(' + c[190] + '); background: -moz-linear-gradient(' + c[190] + ');}\
                span.DotDX_List_diff.DotDX_N {color:' + c[191] + ';}\
                span.DotDX_List_diff.DotDX_H {color:' + c[192] + ';}\
                span.DotDX_List_diff.DotDX_L {color:' + c[193] + ';}\
                span.DotDX_List_diff.DotDX_NM {color:' + c[194] + ';}\
                #kong_game_ui div#helpBox { color:' + c[195] + '; box-shadow:' + c[196] + '; border-top-color:' + c[197] + '; text-shadow:' + c[198] + '; background: -webkit-linear-gradient(' + c[199] + '); background: -moz-linear-gradient(' + c[199] + ');}\
                #kong_game_ui div.chat_message_window p.script hr {background:' + c[200] + ';}\
                #kong_game_ui div.chat_message_window p.script span .title {color:' + c[201] + '; text-shadow:' + c[202] + ';}\
                #kong_game_ui div.chat_message_window p.script span .title:hover {color:' + c[203] + '; text-shadow:' + c[204] + ';}\
                table.raids, table.camps {color:' + c[205] + '; text-shadow:' + c[206] + ';} \
                table.raids td, table.camps td {border-color:' + c[207] + '; background:' + c[208] + ';}\
                table.raids td.ep, table.camps td.ep {background:' + c[209] + ';} \
                table.raids th, table.camps th {border-color:' + c[210] + '; background-color:' + c[211] + ';} \
                table.raids tr.head, table.camps tr.head {background:' + c[212] + ';} \
                table.raids tr.best td {background:' + c[213] + ';} \
                table.raids colgroup col.selected {border-color:' + c[214] + ';}\
                table.camps td.mark {background:' + c[215] + ';} \
                div.raid_list_item > span.DotDX_extInfo {color:' + c[216] + '; text-shadow:' + c[217] + ';}\
                #maingame, div.game_page_wrap {border-color:' + c[218] + ';}\
                body {background-color:' + c[219] + ' !important}\
                #quicklinks li a, #quicklinks li.rate {color:' + c[220] + '}\
                #quicklinks li a:hover {color:' + c[221] + '; text-shadow:' + c[222] + ';}\
                div.raid_list_item > span.DotDX_extInfo.failings {color:' + c[223] + ';}\
                div.raid_list_item > span.DotDX_extInfo.failingm {color:' + c[224] + ';}\
                div.raid_list_item > span.DotDX_extInfo.failingh {color:' + c[225] + ';}\
                div.cntrNotify {color:' + c[226] + '; background-color:' + c[227] + '; border-bottom-color:' + c[45] + ';}\
                #kong_game_ui div#alliance_tab.unread a { background-color: transparent; animation: tabDim 3s linear infinite; }\
                @keyframes tabDim {\
					0% {background-color: #444 }\
					50% {background-color: #653838 }\
					100% {background-color: #444 }\
                } \
                ', true); },
                createFilterTab: function () {
                    var sm = SRDotDX.config.serverMode - 1;
					var rdObj = Object.keys(SRDotDX.raids);
                    var i, il, raid, parentTableId = '', parentTable = '', cb;
                    var sectionID = ['Guild','Special','Small','Medium','Large','Epic','Colossal','Gigantic'];
                    for(i = 0; i < 8; ++i) document.getElementById('FPXRaidFilterWhat' + sectionID[i]).innerHTML = '';
                    for(i = 0, il = rdObj.length; i < il; ++i) {
                        raid = SRDotDX.raids[rdObj[i]];
                        parentTableId = 'FPX_options_cbs_' + raid.id;
                        parentTable = SRDotDX.c('tr').set({id: parentTableId}).html(' \
                        <td>' + raid.name + '</td> \
                        <td><input type="checkbox" id="cb_filter_' + raid.id + '_0' + '"/><label for="cb_filter_' + raid.id + '_0' + '"></label></td> \
                        <td><input type="checkbox" id="cb_filter_' + raid.id + '_1' + '"/><label for="cb_filter_' + raid.id + '_1' + '"></label></td> \
                        <td><input type="checkbox" id="cb_filter_' + raid.id + '_2' + '"/><label for="cb_filter_' + raid.id + '_2' + '"></label></td> \
                        <td><input type="checkbox" id="cb_filter_' + raid.id + '_3' + '"/><label for="cb_filter_' + raid.id + '_3' + '"></label></td> \
                        <td><input type="checkbox" id="cb_filter_' + raid.id + '_all' + '"/><label for="cb_filter_' + raid.id + '_all' + '"></label></td>', false);

                        if (raid.stat === 'H') parentTable.attach('to', 'FPXRaidFilterWhatGuild');
                        else if (raid.stat === 'ESH') parentTable.attach('to', 'FPXRaidFilterWhatSpecial');
                        else if (raid.size < 50) parentTable.attach('to', 'FPXRaidFilterWhatSmall');
                        else if (raid.size === 50) parentTable.attach('to', 'FPXRaidFilterWhatMedium');
                        else if (raid.size === 100) parentTable.attach('to', 'FPXRaidFilterWhatLarge');
                        else if (raid.size === 250) parentTable.attach('to', 'FPXRaidFilterWhatEpic');
                        else if (raid.size === 500) parentTable.attach('to', 'FPXRaidFilterWhatColossal');
                        else if (raid.size === 800) parentTable.attach('to', 'FPXRaidFilterWhatGigantic');

                        for(var j = 0; j < 4; ++j) {
                            cb = document.getElementById('cb_filter_' + raid.id + '_' + j);
                            cb.checked = !SRDotDX.config.filters[sm][raid.id][j];
                            cb.addEventListener("click", function(){
                                var s = SRDotDX.config.serverMode - 1;
                                var raidId = this.id.substr(10).slice(0,-2);
                                var diffIndex = parseInt(this.id.slice(-1));
                                SRDotDX.config.filters[s][raidId][diffIndex] = !this.checked;
                                var ele = document.getElementById('DotDX_filters');
                                var eletxt = ele.innerHTML;
                                var reg = new RegExp('.DotDX_fltChat_' + raidId + '_' + diffIndex + ', ', 'g');
                                if(SRDotDX.config.filterChatLinks) {
                                    if (!this.checked && !reg.test(eletxt)) eletxt = '.DotDX_fltChat_' + raidId + '_' + diffIndex + ', ' + eletxt;
                                    else if (this.checked) eletxt = eletxt.replace(reg, '');
                                }
                                reg = new RegExp('.DotDX_fltList_' + raidId + '_' + diffIndex + ', ', 'g');
                                if(SRDotDX.config.filterRaidList) {
                                    if (!this.checked && !reg.test(eletxt)) eletxt = '.DotDX_fltList_' + raidId + '_' + diffIndex + ', ' + eletxt;
                                    else if (this.checked) eletxt = eletxt.replace(reg, '');
                                }
                                ele.innerHTML = eletxt;

                                var f = SRDotDX.config.filters[s][raidId];
                                document.getElementById('cb_filter_' + raidId + '_all').checked = !f[0] && !f[1] && !f[2] && !f[3];
                                SRDotDX.config.save(false);
                            });
                        }
                        cb = document.getElementById('cb_filter_' + raid.id + '_all');
                        cb.checked = !(SRDotDX.config.filters[sm][raid.id][0] && SRDotDX.config.filters[sm][raid.id][1] && SRDotDX.config.filters[sm][raid.id][2] && SRDotDX.config.filters[sm][raid.id][3]);
                        cb.addEventListener('click', function(){
                            var s = SRDotDX.config.serverMode - 1;
                            var raidId = this.id.substr(10).slice(0,-4), reg;
                            var elem = document.getElementById('DotDX_filters');
                            var ele = elem.innerHTML;
                            var chk = this.checked;
                            for(j = 0; j < 4; ++j) {
                                document.getElementById('cb_filter_' + raidId + '_' + j).checked = chk;
                                SRDotDX.config.filters[s][raidId][j] = !chk;
                                reg = new RegExp('.DotDX_fltChat_' + raidId + '_' + j + ', ', 'g');
                                if (SRDotDX.config.filterChatLinks) {
                                    if (!chk && !reg.test(ele)) ele = '.DotDX_fltChat_' + raidId + '_' + j + ', ' + ele;
                                    else if (chk) ele = ele.replace(reg, '');
                                }
                                reg = new RegExp('.DotDX_fltList_' + raidId + '_' + j + ', ', 'g');
                                if (SRDotDX.config.filterRaidList) {
                                    if (!chk && !reg.test(ele)) ele = '.DotDX_fltList_' + raidId + '_' + j + ', ' + ele;
                                    else if (chk) ele = ele.replace(reg, '');
                                }
                            }
                            elem.innerHTML = ele;
                            SRDotDX.config.save(false);
                        });
                    }
                },
                toggleFiltering: function () {
					var sm = SRDotDX.config.serverMode - 1;
					var rdObj = Object.keys(SRDotDX.raids);
					var fltObj = Object.keys(SRDotDX.config.filters[sm]);
                    var query = '.DotDX_filter_dummy_0 ', i, il, frcId;
                    if(!SRDotDX.util.isArrEq(rdObj, fltObj)) {
                        for(i = 0, il = rdObj.length; i < il; ++i) if (typeof SRDotDX.config.filters[sm][rdObj[i]] === 'undefined') SRDotDX.config.filters[sm][rdObj[i]] = [true, true, true, false];
                        for(i = 0, il = fltObj.length; i < il; ++i) if(rdObj.indexOf(fltObj[i]) < 0) delete SRDotDX.config.filters[sm][fltObj[i]];
                        console.log('[DotDX] Filters array has been altered!');
                    }
                    if(SRDotDX.config.filterChatLinks) {
						frcId = '.DotDX_fltChat_';
						for(i = 0, il = rdObj.length; i < il; ++i) {
                            if (SRDotDX.config.filters[sm][rdObj[i]][0]) query = frcId + rdObj[i] + '_0, ' + query;
                            if (SRDotDX.config.filters[sm][rdObj[i]][1]) query = frcId + rdObj[i] + '_1, ' + query;
                            if (SRDotDX.config.filters[sm][rdObj[i]][2]) query = frcId + rdObj[i] + '_2, ' + query;
                            if (SRDotDX.config.filters[sm][rdObj[i]][3]) query = frcId + rdObj[i] + '_3, ' + query;
                        }
                    }
                    if(SRDotDX.config.filterRaidList) {
                        frcId = '.DotDX_fltList_';
						for(i = 0, il = rdObj.length; i < il; ++i) {
                            if (SRDotDX.config.filters[sm][rdObj[i]][0]) query = frcId + rdObj[i] + '_0, ' + query;
                            if (SRDotDX.config.filters[sm][rdObj[i]][1]) query = frcId + rdObj[i] + '_1, ' + query;
                            if (SRDotDX.config.filters[sm][rdObj[i]][2]) query = frcId + rdObj[i] + '_2, ' + query;
                            if (SRDotDX.config.filters[sm][rdObj[i]][3]) query = frcId + rdObj[i] + '_3, ' + query;
                        }
                    }
                    SRDotDX.c('#DotDX_filters').html(query + '{display: none !important}', true);
                },
                switchServer: function () {
                    var sm = SRDotDX.config.serverMode;
                    SRDotDX.config.serverMode = sm === 1 ? 2 : 1;
                    this.toggleFiltering();
                    this.createFilterTab();
                    this.applySidebarUI(0);
                    SRDotDX.c('#raidsBossFilter').ele().value = SRDotDX.config.lastFilter[SRDotDX.config.serverMode - 1];
                    this.updateFilterTxt(SRDotDX.config.lastFilter[SRDotDX.config.serverMode - 1], true);
                    //var grObj = {room: holodeck._chat_window._rooms_by_type["guild"]._room};
                    //holodeck._chat_window.leftRoom(grObj);
                    //holodeck._chat_window.bootstrapChat();
                    SRDotDX.c('#DotDX_serverModeRaids').html('#kong_game_ui p.DotDX_sid_' + (SRDotDX.config.serverMode == 2 ? '1' : '2') + ' {display: none !important}', true);
                    this.scrollChat();
                    SRDotDX.config.save(false);
                },
				applyKongBar: function() {
					var styleElem = SRDotDX.c('#DotDX_kongBar');
					if(SRDotDX.config.slimKongBar) styleElem.html('#header_logo, #new_nav_wrapper .main_navigation {display:none !important} #header {height:27px !important}',true);
					else styleElem.html('',true);
				},
                load: function() {
                    if (typeof holodeck._tabs.addTab === 'function' && document.getElementById('chat_rooms_container') !== null) {
						SRDotDX.c('li').set({class: 'control'}).html('<a href="#">'+(SRDotDX.config.slimKongBar?'Show':'Hide')+'</a>',true).on('click',function(e){e.preventDefault(); e.stopPropagation(); SRDotDX.config.slimKongBar=!SRDotDX.config.slimKongBar; e.target.innerHTML = (SRDotDX.config.slimKongBar?'Show':'Hide'); SRDotDX.gui.applyKongBar(); SRDotDX.config.save(false); return false}).attach('before',document.getElementById('nav_welcome_box').children[5]);
						SRDotDX.c('style').set({type: "text/css", id: 'DotDX_kongBar'}).attach('to', document.head);
						SRDotDX.c('style').set({type: "text/css", id: 'SRDotDX_botClass'}).text('.bot{display:' + (SRDotDX.config.hideBotLinks ? 'none !important' : 'block') + '}').attach('to', document.head);
                        SRDotDX.c('style').set({type: "text/css", id: 'SRDotDX_raidClass'}).text('.DotDX_raid {display:' + (SRDotDX.config.hideRaidLinks ? 'none !important' : 'block') + '}').attach('to', document.head);
                        SRDotDX.c('style').set({type: "text/css", id: 'SRDotDX_visitedRaidClass'}).text('.DotDX_visitedRaid{display: ' + (SRDotDX.config.hideVisitedRaids ? 'none !important' : 'block') + '}').attach('to', document.head);
                        SRDotDX.c('style').set({type: "text/css", id: 'DotDX_forum'}).text('div.game_page_wrap {padding-top: 16px; margin-top: 14px !important; background: #333 !important; display: ' + (SRDotDX.config.hideKongForum ? 'none' : 'block') + '}').attach('to', document.head);
                        SRDotDX.c('style').set({type: "text/css", id: 'DotDX_details'}).text('div.game_details_outer {margin-top: 14px !important; width: 900px !important; border: solid 20px #333 !important; display: ' + (SRDotDX.config.hideGameDetails ? 'none' : 'block') + '}').attach('to', document.head);
                        SRDotDX.c('style').set({type: "text/css", id: 'DotDX_filters'}).text('.DotDX_filter_dummy_0 {display: none !important}').attach('to', document.head);
                        SRDotDX.c('style').set({type: "text/css", id: 'DotDX_serverModeRaids'}).text('#kong_game_ui p.DotDX_sid_' + (SRDotDX.config.serverMode == 2 ? '1' : '2') + ' {display: none !important}').attach('to', document.head);
						SRDotDX.c('style').set({type: "text/css", id: 'DotDX_chatResizeElems'}).text('#kong_game_ui textarea.chat_input { width: 270px !important; }\
                    #kong_game_ui div#chat_raids_overlay { width: 292px }\
                    #kong_game_ui div#chat_raids_overlay > span { width: 282px }\
                    div#dotdx_sidebar_container { ' + (SRDotDX.config.sbRightSide ? "text-align: left; padding-left: 1px" : "text-align: left; margin-left: 2px; padding-left: 6px") + ' }').attach('to', document.head);
						SRDotDX.gui.applyKongBar();
                        SRDotDX.gui.toggleFiltering();

                        var elemPositionFix = "";
                        if (SRDotDX.isFirefox) {
                            elemPositionFix = " \
                        #kong_game_ui div#chat_room_tabs div a {padding: 3px 9px 4px 7px}\
                        #kong_game_ui div#alliance_tab a { padding: 5px 8px }\
                        #kong_game_ui div#lots_tab_pane ul li.tab div.tab_head {padding: 2px 7px 3px}\
                        #kong_game_ui span.generic {margin: 2px 6px 0}\
                        #kong_game_ui div#dotdx_status_div {padding: 5px 6px}\
                        #kong_game_ui div#chat_window_header div.dotdx_chat_overlay {margin-top: 4px; padding-top: 3px;}\
                        #kong_game_ui div#chat_raids_overlay {padding: 4px 0}\
                        #kong_game_ui div.chat_message_window p span.timestamp, #kong_game_ui div.chat_message_window p span.room {vertical-align: baseline}\
                        #kong_game_ui div.chat_message_window p {padding: 2px 5px 3px}\
                        #kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list .raid_list_item {padding: 2px;}\
                        .raid_list_item a.dotdxRaidListDelete {margin-top: 1px;}\
                        #kong_game_ui div.chat_message_window p span.ingamename {vertical-align: baseline;} \
                        a.DotDX_RaidLink {vertical-align: bottom}\
                        ";
                        }
                        else {
                            elemPositionFix = " \
                        #kong_game_ui div#chat_room_tabs div a {padding: 4px 9px 3px 7px}\
                        #kong_game_ui div#alliance_tab a { padding: 5px 8px }\
                        #kong_game_ui div#lots_tab_pane ul li.tab div.tab_head {padding: 3px 7px 2px}\
                        #kong_game_ui span.generic {margin: 3px 6px 0}\
                        #kong_game_ui div#dotdx_status_div {padding: 6px 6px 4px}\
                        #kong_game_ui div#chat_window_header div.dotdx_chat_overlay {margin-top: 3px; padding-top: 4px;}\
                        #kong_game_ui div#chat_raids_overlay {padding: 5px 0 3px}\
                        #kong_game_ui div.chat_message_window p span.timestamp, #kong_game_ui div.chat_message_window p span.room {vertical-align: text-top}\
                        #kong_game_ui div.chat_message_window p {padding: 3px 5px}\
                        #kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list .raid_list_item {padding: 3px 2px 1px;}\
                        #kong_game_ui div.chat_message_window p span.ingamename {vertical-align: top;} \
                        a.DotDX_RaidLink {vertical-align: text-bottom}\
                        ";
                        }
                        SRDotDX.c('style').set({type: "text/css"}).text(" \
					    " + (SRDotDX.config.hideGameTitle ? "ul#gamepage_categories_list, .horizontal_ad, span#kong_game_bf_300x250_2_holder, div#gamespotlight, div#dealspot_banner_holder, div#kong_bumper_preroll_600x400-ad-slot, div#gamepage_header, #kong_game_ui div#chat_default_content {display:none; !important} \
					    div.gamepage_header_outer, div.gamepage_header_inner, div.gamepage_header_outer h1 {height: 0 !important; padding: 0 !important; margin: 0 !important} \
						#primarylayout .maincontent {padding: 6px 0 !important} \
						" : "") + "div.raid_list_item.hidden, .DotDX_hidden, div.game_page_admindev_controls, div#subwrap, li#quicklinks_facebook, #shim {display:none !important} \
						#primarywrap {background-image: none !important; background-color: transparent !important;} \
						/* body {background-color: #" + SRDotDX.config.bckColor + " !important} */ \
						#maingame { border: 1px solid transparent }\
						#maingame .user_connection {margin-right: 10px;}\
						div#game { overflow:hidden }\
						div.upper_gamepage { background: transparent !important }\
						.user_connection #chat_connected_indicator {margin-right: 10px}\
						#FPXtt { position:absolute; display:block; } \
						#FPXtttop { display:block; height:5px; margin-left:5px; } \
						#FPXttcont { display:block; padding:2px 12px 3px 7px; margin-left:5px; background:#666; color:#fff; } \
						#FPXttbot {display:block;height:5px;margin-left:5px;} \
						.welcome-user>li {background-color: #710000}\
						.welcome-user>li:hover {background-color: #423f3e}\
						#kong_game_ui ul.main_tabs {height:30px; padding-left:7px}\
						#kong_game_ui ul.main_tabs li.tab:first-child { margin-left: 1px; }\
						#kong_game_ui ul.main_tabs li.tab a { padding: 6px 6px 4px; margin-top: 6px; border: 1px solid #000; margin-right: 3px;  transition: all .3s;}\
						#kong_game_ui ul.main_tabs li.tab a.active {margin-top: 5px; padding: 7px 6px 5px; border-radius: 5px 0 5px 0;}\
						/*#kong_game_ui div#chat_tab_pane {height: 645px !important}*/ \
						#kong_game_ui div#lots_tab_pane {padding: 8px; text-align: left; background-color: #777; height: 644px}\
						#kong_game_ui div#lots_tab_pane div#dotdx_shadow_wrapper { width: 282px; border: 1px solid #222; box-shadow: 0 0 12px #111; height: 643px; overflow: hidden; background-color: #ddd;}\
						#kong_game_ui div#chat_window { background-color: #fff; border: 1px solid #333; overflow: hidden; box-shadow: 0 0 8px 1px #333; }\
						#kong_game_ui div#chat_window_header { height: 69px; box-shadow: 0 0 5px #333; position: relative; background-color: #ddd; }\
						#kong_game_ui div#chat_window_header div.room_name_container { border-bottom: 1px solid #aaa; padding: 5px 7px 3px; margin: 0 !important; background-color: #e6e6e6; font-family: \"Trebuchet MS\", Helvetica, sans-serif }\
						#kong_game_ui div#chat_window_header div.room_name_container .room_name { font-family: \"Trebuchet MS\", Helvetica, sans-serif; color: #333; text-shadow: 0 0 3px #ccc; }\
						#kong_game_ui div#chat_window_header div.room_name_container #alliance_number { display: none; }\
						#kong_game_ui div#chat_window_header div.room_name_container.alliance #alliance_number { display: inline; }\
						#kong_game_ui div#chat_window_header div.room_name_container.alliance .number_in_room { display: none; }\
						#kong_game_ui div.chat_actions_container span.kong_ico { font-size: 12px !important; }\
						#kong_game_ui div.chat_actions_container ul.chat_actions_list { right: -1px; padding: 4px 0; border-radius: 5px 0 0 5px; top: 22px; border-color: #777; box-shadow: 0 0 8px #999; min-width: 122px; font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-size: 11px; }\
						#kong_game_ui div.chat_actions_container ul.chat_actions_list li { line-height: 20px; padding: 0 10px; border-width: 1px 0; border-color: #fff; border-style: solid; transition: box-shadow .5s;}\
						#kong_game_ui .chat_actions_container .chat_actions_list li:hover { background-color: #f0f0f0; border-color: #bbb; color: #333; box-shadow: 0 0 4px #ddd; position: relative; }\
						#kong_game_ui div.chat_actions_container span.btn_tools { height: 16px; line-height: initial !important; width: 20px; margin: 2px 3px; } \
						#kong_game_ui div#chat_window_header div.dotdx_chat_overlay { border-top: 1px solid #bbb; overflow: hidden; white-space: nowrap; } \
						#kong_game_ui div.chat_actions_container select { width: 92px; margin-top: 2px; font-family: \"Trebuchet MS\",Helvetica,sans-serif; font-style: italic; outline: none; background-color: #ddd; margin-right: 2px; } \
						#kong_game_ui div#chat_room_tabs div a, #kong_game_ui div#alliance_tab a { margin: 0; background: none; text-decoration: none; font-family: \"Trebuchet MS\",Helvetica,sans-serif; font-size: 11px; font-style: italic; transition: text-shadow .2s; border-right: 1px dotted #aaa; } \
						#kong_game_ui div#chat_rooms_container div.chat_tabpane.users_in_room { height: 89px; border: 1px solid #999; border-width: 1px 0; border-bottom-color: #888; box-shadow: inset 0 -2px 6px -4px #444; } \
						#kong_game_ui div#alliance_tab { position: relative; top: 3px; height: 0; }\
						#kong_game_ui div#alliance_room { display: none; }\
						#kong_game_ui div#alliance_room.active { display: block; }\
						#kong_game_ui div#alliance_users > div { font-size: 11px; } \
						#kong_game_ui div#alliance_users > div > span { display: inline-block; margin: 1px 2px; text-shadow: 0 0 5px #000; }\
						#kong_game_ui div#alliance_users > div > span:nth-child(1) { border: 1px solid #303030; padding: 0 5px 0 4px; font-weight: bold; font-size: 10px; border-radius: 0 7px 7px 0; color: #FFF; background-color: #792c2c; }\
						#kong_game_ui div#alliance_users > div > span:nth-child(2) { color: #F0F0F0; margin-left: 5px; }\
						#kong_game_ui div#alliance_users > div > span:nth-child(3) { color: #D0D0D0; font-style: italic; }\
						#kong_game_ui div#chat_raids_overlay { display:none; position: absolute; overflow: hidden; bottom: 488px; left: 3px; background-color: #e0e0e0; font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-size: 11px; border-width: 1px; border-style: solid; border-radius: 2px;}\
						#kong_game_ui div#chat_raids_overlay.active { display: block } \
						#kong_game_ui div#chat_raids_overlay > span { display: block; margin: 0 auto }\
						#kong_game_ui div.chat_controls {border-top: 1px solid #000; position: relative; }\
						#kong_game_ui div#lots_tab_pane ul { margin: 0px; padding: 0px; list-style-type: none; position: relative;} \
						#kong_game_ui div#lots_tab_pane ul li.tab { float: left; height: 100%; } \
						#kong_game_ui div#lots_tab_pane ul li.tab div.tab_head  { font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-size: 11px; font-style: italic; cursor: pointer; border-right: 1px dotted #aaa; transition: text-shadow .2s} \
						#kong_game_ui div#lots_tab_pane ul li.tab div.tab_pane  { display: none; border-top: 1px solid #888; width: 282px; height: 600px; padding-top: 2px;} \
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_head { cursor: default; }\
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane { position: absolute; display: block; left: 0px; }\
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list, \
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #paste_list {overflow-y: auto; font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-size: 12px; height: 449px; border-top: 1px solid #aaa; box-shadow: 0 0 3px #ccc; background: -webkit-linear-gradient(left, #fff, #eee); background: -moz-linear-gradient(left, #fff, #eee);} \
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list .raid_list_item {cursor: pointer; position: relative; border-width: 1px 0; border-style: solid; border-top-color: transparent; border-bottom-color: #ddd;} \
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list .raid_list_item.hidden {display:none;} \
						a.FPXImportLink, a.FPXDeleteLink { font: normal 10px Arial; border: 1px solid #c0c0c0; color:black; text-decoration:none; cursor:pointer; font-variant: small-caps; display: block; width: 40px; text-align: center; margin-right: 2px; background-color: #fff} \
						a.dotdxRaidListDelete { font: 10px \"Trebuchet MS\"; text-decoration: none; cursor: pointer; margin-right: 2px; float:right; display: inline} \
						a.DotDX_RaidLink {text-decoration:none; overflow: hidden; max-width: 135px; white-space: nowrap; text-overflow: ellipsis; display: inline-block; } \
						div.DotDX_ListPanel {border-top: 1px dashed #999; margin-top: 2px; padding-top: 2px; }\
						div.DotDX_ListPanel > span.raidListContent {font-style: italic} \
						#kong_game_ui p.user_count.full { color: crimson; } \
						#kong_game_ui div#lots_tab_pane a.pastebinlink {font: normal 11px Verdana; color:#333; text-decoration:none; cursor:pointer;} \
						#kong_game_ui div#lots_tab_pane a.pastebinlink:hover { text-decoration: underline; color: black } \
						#kong_game_ui div#lots_tab_pane span.pasteright, #kong_game_ui div#lots_tab_pane span.pasteleft {font: normal 11px Verdana; color: #333} \
						#kong_game_ui div#lots_tab_pane span.pasteright {float:right; padding-right: 6px} \
						#kong_game_ui div#lots_tab_pane span.pasteleft {float:left} \
						#kong_game_ui div.chat_message_window { position: relative; margin: 0; } \
						#kong_game_ui div.chat_message_window p {border-width: 1px 0; border-style: solid; margin: 0;} \
						#kong_game_ui div.chat_message_window p.DotDX_raid, #kong_game_ui div.chat_message_window p.whisper, #kong_game_ui div.chat_message_window p.script { border-top-color: #e5e5e5; }\
						#raid_list .raid_list_item.DotDX_N:hover {border-bottom-color: rgb(138, 179, 137); background: -webkit-linear-gradient(top,#CBE7C4,#F3FAF2); background: -moz-linear-gradient(top,#CBE7C4,#F3FAF2);} \
						#raid_list .raid_list_item.DotDX_H:hover {border-bottom-color: rgb(173, 173, 104); background: -webkit-linear-gradient(top,#F7F0C8,#FCFBF8); background: -moz-linear-gradient(top,#F7F0C8,#FCFBF8);} \
						#raid_list .raid_list_item.DotDX_L:hover {border-bottom-color: rgb(177, 135, 128); background: -webkit-linear-gradient(top,#F3D7D1,#FCF7F7); background: -moz-linear-gradient(top,#F3D7D1,#FCF7F7);} \
						#raid_list .raid_list_item.DotDX_NM:hover {border-bottom-color: rgb(169, 154, 187); background: -webkit-linear-gradient(top,#DDD4E2,#F4F0F7); background: -moz-linear-gradient(top,#DDD4E2,#F4F0F7);} \
						#kong_game_ui div.chat_message_window div.cntrNotify {border-width: 0px 0px 1px; border-style: solid;}\
						#kong_game_ui div.chat_message_window p.whisper {margin:0; border-bottom-color: #A1B4BE; background: -webkit-linear-gradient(top,#DCE8F1,#EFF4F7); background: -moz-linear-gradient(top,#DCE8F1,#EFF4F7); } \
						#kong_game_ui div.chat_message_window p.script {border-bottom-color: rgb(165, 165, 165); background: -webkit-linear-gradient(left,#f3f3f3,#fff); background: -moz-linear-gradient(left,#f3f3f3,#fff);} \
						#kong_game_ui div.chat_message_window p.script hr { height: 1px; border: 0; background: #ccc; margin: 4px 0 3px; }\
						#kong_game_ui div.chat_message_window p.script span { font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-size: 11px} \
						#kong_game_ui div.chat_message_window p.script span .title { text-decoration: none; font-size: 12px; font-weight: bold; color: #222 } \
						#kong_game_ui div.chat_message_window p.script span.bold {font-weight: bold}\
						#kong_game_ui div.chat_message_window p span.separator { margin-right: 0px; display:inline; float: none} \
						#kong_game_ui div.chat_message_window p span.username { color: rgb(39, 101, 148); text-decoration: none; cursor: pointer; display:inline; float: none } \
						#kong_game_ui div.chat_message_window p span.username.ign { color: rgb(38, 116, 34); }\
						#kong_game_ui div.chat_message_window p span.username.is_self { color: rgb(151, 49, 49); }\
						#kong_game_ui div.chat_message_window p span.username:hover { text-decoration: underline } \
						#kong_game_ui div.chat_message_window p span.timestamp {font-style: italic; font-size: 9px; color: #666;} \
						#kong_game_ui div.chat_message_window p span.ingamename {font-style: italic; font-size: 11px; color: #666;} \
						#kong_game_ui div.chat_message_window p span.message {line-height: 16px; word-wrap: break-word; display:inline; float: none} \
						#kong_game_ui div.chat_message_window p span.message img { max-width: 100%; max-height: 250px; margin: 2px auto; display: block; cursor: pointer; } \
						#kong_game_ui div.chat_message_window p span.message embed {width: 100%; height: auto; margin: 2px auto; display: block;} \
						#kong_game_ui div.chat_message_window p span.message a { text-decoration: none; color: #444; font-style: normal } \
						#kong_game_ui div.chat_message_window p span.message a:hover { color: #000; text-shadow: 0 0 6px #888; } \
						#kong_game_ui div.chat_message_window p span.message a.chat_link:hover { text-shadow: 0 0 4px #F5C68A; text-decoration: none; } \
                        #kong_game_ui div.chat_message_window p span.message a.chat_link { color: #946A3D; } \
                        #kong_game_ui div.chat_message_window p span.message a.reply_link {font-style: italic} \
                        #kong_game_ui div.chat_message_window p > span.slider {position: absolute; display: inline-block; border: 1px solid #777; border-left: 0; height: 24px; left: -2px; margin-top: -5px; border-radius: 0 5px 5px 0; background: #eee; box-shadow: 0 0 7px #777; transition: max-width .3s; overflow: hidden; white-space: nowrap;}\
                        #kong_game_ui div.chat_message_window p > span.slider > span.magic, div.raid_list_item span.DotDX_extMagics > span { background-image: url(data:image/png;base64,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); background-position-y: 0; width: 16px; display: inline-block; height: 16px; margin-right: 2px; margin-top: 4px }\
						div.raid_list_item span.DotDX_extMagics > span {margin-top: 0; vertical-align: text-top; margin-right: 1px; } \
						div.raid_list_item span.DotDX_extMagics {float:right}\
						#kong_game_ui div.chat_message_window p > span.slider > span.magic:first-child { margin-left: 5px; } \
						#kong_game_ui div.chat_message_window p > span.slider > span.magic:last-child { margin-right: 5px; } \
						#kong_game_ui div.chat_message_window p > span.slider > span.user { display: inline-block; height: 16px; margin-left: 5px; margin-top: 4px; vertical-align: text-top; font-style: italic; cursor: pointer}\
						#kong_game_ui div.chat_message_window p > span.slider > span.user:first-child { text-overflow: ellipsis; max-width: 80px; white-space: nowrap; overflow: hidden; padding: 0 3px; font-style: normal; }\
						#kong_game_ui div.chat_message_window p > span.slider > span.user:last-child { margin-right: 10px; } \
						#kong_game_ui div.chat_message_window p > span.slider > span.user:hover { text-shadow: 0 0 6px #888; } \
						#kong_game_ui div.chat_message_window p.emote {font-style: italic; color: #085088; text-align: center;} \
						#kong_game_ui div.chat_message_window p.emote span.username, #kong_game_ui div.chat_message_window p.emote span.separator { display: none; } \
						#kong_game_ui div.chat_message_window p span.room { color: #666; font-size: 9px;} \
						#kong_game_ui div.chat_message_window div.error_msg { background-color: #FFF8E0; margin: 0; padding: 3px 5px; border-bottom: 1px solid #ddd; font-size: 9px; color: #555; } \
						#kong_game_ui .chatOverlayMain {border-style: solid; border-color: #C2A71C; border-width: 1px 0; font-family: \"Trebuchet MS\", Helvetica, sans-serif; color: #fff; font-size: 11px; font-weight: normal; text-align: right} \
						#kong_game_ui .chatOverlayMain > span {padding: 3px 10px; cursor: pointer;} \
						#kong_game_ui .chatOverlayMain > span:hover {background-color: #C2A71C; font-style: italic; color: #555}\
						#kong_game_ui textarea.chat_input { height: 30px !important; margin: 0 !important; outline: none; padding: 4px 6px 4px } \
						#kong_game_ui div.dotdx_chat_buttons { position: relative; width: 100%; padding: " + (SRDotDX.isFirefox ? "0 0 1px" : "1px 0 0") + "; background-color: #eaeaea; font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-size: 11px; font-style: italic; color: #444; box-shadow: 0 0 6px -2px #333; border-width: 1px 0; border-style: solid; border-color: #888; background: -webkit-linear-gradient(top,#ddd,#f0f0f0); background: -moz-linear-gradient(top,#ddd,#f0f0f0);}\
						#kong_game_ui div.dotdx_chat_buttons > span { display: inline-block; padding: 3px 7px; cursor: pointer; transition: text-shadow .2s; }\
						#kong_game_ui input.dotdx_chat_filter { border: 1px solid #ccc; padding: 0 4px; display: inline-block; font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-size: 11px; font-style: italic; color: #333; width: 110px; background-color: #f7f7f7; outline: none; }\
						#kong_game_ui input.dotdx_chat_filter:focus { background-color: #fff }\
						div.dotdx_chat_buttons > span.active { text-shadow: 0 0 4px #aaa }\
						div.dotdx_chat_buttons > span:hover { text-shadow: 0 0 4px #888 }\
						div.tab_pane p.collapsingCategory { border: 1px solid #999; border-width: 1px 0; margin: 5px 0 0; cursor: pointer; background-color: #ddd; font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-size: 12px; padding: 2px 6px 1px; padding-right: 10px; box-shadow: 0 0 4px #ccc; background: -webkit-linear-gradient(top, #ccc, #eee); background: -moz-linear-gradient(top, #ccc, #eee); transition: all .3s; } \
						div.tab_pane p.collapsingCategory:hover { background: -webkit-linear-gradient(top, #ccc, #ddd); background: -moz-linear-gradient(top, #ccc, #ddd); box-shadow: 0 0 4px #bbb;}\
						div.tab_pane div.collapsingField { padding-top: 3px; }\
						xxx {display:block !important}\
						span.DotDX_RaidListVisited {padding: 0 3px; vertical-align: text-bottom} \
						span.DotDX_List_diff {display: inline-block; width: 20px; font-weight: bold; padding-left: 2px; vertical-align: text-bottom} \
						span.DotDX_List_diff.DotDX_N {color: #00BB00;} \
						span.DotDX_List_diff.DotDX_H {color: #DDAA00;} \
						span.DotDX_List_diff.DotDX_L {color: #FF0000;} \
						span.DotDX_List_diff.DotDX_NM {color: #BB00BB;} \
						div.tab_pane input, div.tab_pane select {border: 1px solid #ccc; padding: 1px} \
						div.tab_pane input {height: 14px;} \
						div.tab_pane select {height: 18px} \
						div.tab_pane input[type=\"button\"] {height: 26px; padding: 0 3px; color: #444; border: 1px solid #bbb; background-color: #f7f7f7; outline: none; box-shadow: 0 0 3px #ddd; background: -webkit-linear-gradient(top, #eee, #fff); background: -moz-linear-gradient(top, #eee, #fff); font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-size: 11px; border-radius: 2px; transition: all .3s} \
						div.tab_pane input[type=\"button\"].generic:hover {background: -webkit-linear-gradient(top, #fff, #ccc); background: -moz-linear-gradient(top, #fff, #ccc); box-shadow: 0 0 5px #bbb; text-shadow: 0 0 3px #bbb;}\
						div.tab_pane input[type=\"button\"].green:hover {background: -webkit-linear-gradient(top, #fff, #b9daaf); background: -moz-linear-gradient(top, #fff, #b9daaf); box-shadow: 0 0 5px #a7ca9c; text-shadow: 0 0 3px #bbb;}\
						div.tab_pane input[type=\"button\"].blue:hover {background: -webkit-linear-gradient(top, #fff, #a4c8ee); background: -moz-linear-gradient(top, #fff, #a4c8ee); box-shadow: 0 0 5px #a9d3ff; text-shadow: 0 0 3px #bbb;}\
						div.tab_pane input[type=\"button\"].red:hover,\
						div.tab_pane input[type=\"button\"][value=\"Cancel\"]:hover {background: -webkit-linear-gradient(top, #fff, #f0a4a4); background: -moz-linear-gradient(top, #fff, #f0a4a4); box-shadow: 0 0 5px #ffbaba; text-shadow: 0 0 3px #bbb;}\
						div.tab_pane input.landpmbutton { height: 20px; width: 22px; } \
						div.tab_pane input.landpmbuttonhigh { height: 20px; width: 22px; background-color: #82BA00; background: -webkit-linear-gradient(top,#8DC98D,#fff); background: -moz-linear-gradient(top,#8DC98D,#fff); } \
						div.tab_pane input.landtxtfield { padding: 2px 0; width: 50px; text-align: center} \
						div.tab_pane input.landtxtfieldc { padding: 2px 0; width: 100%; text-align: center } \
						div.tab_pane td.landname { padding-top: 3px} \
						div.tab_pane input.landsavebutton { height: 20px; width:100% } \
						table.raids, table.camps { font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-size: 10px; text-align: center; border-collapse: collapse;  margin: 5px auto } \
                        table.raids td { border: 1px solid #bbb; width: 55px; background-color: #fff; }\
                        table.camps td { border: 1px solid #bbb; width: 20px; background-color: #fff; }\
                        table.raids td.ep, table.camps td.ep { text-align: right; width: auto; padding: 0 6px; } \
                        table.raids th, table.camps th { border: 1px solid #bbb; background-color: #efefef; } \
                        table.raids tr.head, table.camps tr.head { background-color: #fafafa; } \
                        table.raids tr.split td, table.camps th { border-bottom-width: 2px; } \
                        table.raids tr.best td, table.camps td.mark { background-color: #eff4f9; } \
                        table.camps .tb {border-right-width: 2px} \
                        table.raids colgroup col.selected { border: 2px solid #5f9ea0; }\
                        ul#SRDotDX_tabpane_tabs input[type=\"checkbox\"] {display: none}\
                        ul#SRDotDX_tabpane_tabs input[type=\"checkbox\"] + label {font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-size: 12px; cursor: pointer;}\
					    ul#SRDotDX_tabpane_tabs input[type=\"checkbox\"] + label:before { content:\"\"; display:inline-block; width:18px; height:14px; position: relative; top: 3px; }\
                        ul#SRDotDX_tabpane_tabs input[type=\"checkbox\"].generic + label:before { margin-left: 6px }\
                        ul#SRDotDX_tabpane_tabs input[type=\"radio\"] {display: none}\
                        ul#SRDotDX_tabpane_tabs input[type=\"radio\"] + label {font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-size: 12px; cursor: pointer;}\
					    ul#SRDotDX_tabpane_tabs input[type=\"radio\"] + label:before { content:\"\"; display:inline-block; width:16px; height:13px; position: relative; top: 2px; }\
                        ul#SRDotDX_tabpane_tabs input[type=\"radio\"].generic + label:before { margin-left: 5px }\
                        ul#SRDotDX_tabpane_tabs input[type=\"text\"].generic { border: 1px dashed transparent; border-bottom-color: #bbb; padding: 0 1px; background-color: transparent; font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-size: 12px; color: #333; outline: none; height: 15px; text-align: center; }\
                        ul#SRDotDX_tabpane_tabs input[type=\"text\"].generic:hover { border-style: solid; }\
                        ul#SRDotDX_tabpane_tabs input[type=\"text\"].generic:focus {border-style: solid; border-color: #ccc; background: -webkit-linear-gradient(top,#eee,#fff); background: -moz-linear-gradient(top,#eee,#fff);}\
                        ul#SRDotDX_tabpane_tabs input[type=\"text\"][disabled].generic { color: #aaa; }\
                        ul#SRDotDX_tabpane_tabs input[type=\"text\"].color {float: right; margin-right: 6px; width: 40px;}\
                        input#raidsBossFilter {width: 260px; box-shadow: 0 0 4px -1px #aaa; outline: none; font-family: \"Trebuchet MS\", Helvetica, sans-serif;  font-size: 12px; padding: 3px 5px; background: -webkit-linear-gradient(top, #fff, #d1dfee); background: -moz-linear-gradient(top, #fff, #d1dfee); border-color: #aaa; margin: 4px auto; display: block; border-radius: 2px;}\
                        input#raidsBossFilter:hover, input#raidsBossFilter:focus {background: -webkit-linear-gradient(top, #DFE8F1, #fff); background: -moz-linear-gradient(top, #DFE8F1, #fff);}\
                        textarea#DotDX_raidsToSpam, textarea#options_sbConfig { border: 1px solid #aaa; width: 254px; margin-left: 6px; margin-top: 5px; margin-bottom: 4px; padding: 3px 7px; resize: none; outline: none; font-size: 10px; font-style: italic; }\
                        #kong_game_ui div#dotdx_status_div {font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-style: italic; font-size: 11px; margin: 0; border-bottom: 1px solid #aaa; }\
                        #kong_game_ui div#helpBox { padding: 0; position: absolute; bottom: 8px; overflow: hidden; width: 282px; transition: max-height .5s; border-top-width: 0; border-top-style: solid; font-family: \"Trebuchet MS\",Helvetica,sans-serif; font-size: 12px; font-style: italic;}\
                        #kong_game_ui div#helpBox > span {display: inline-block; padding: 11px 8px 9px;}\
                        #kong_game_ui span.generic { display: inline-block; font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-size: 12px; }\
                        #kong_game_ui span.notice { display: inline-block; font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-size: 10px; font-style: italic; margin: 3px 6px; }\
                        #kong_game_ui div#dotdx_usercontext { display: none; position: absolute; background-color: #eee; border: 1px solid #888; display: none; box-shadow: 0 0 8px #888; font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-size: 12px; background: -webkit-linear-gradient(top,#e7e7e7,#fff); background: -moz-linear-gradient(top,#e7e7e7,#fff); cursor: pointer;}\
                        #kong_game_ui div#dotdx_usercontext span { display: inline-block; padding: 3px 6px 2px }\
                        #kong_game_ui div#dotdx_usercontext span:hover { text-shadow: 0 0 3px #aaa; }\
                        #kong_game_ui td {vertical-align: middle}\
                        div#FPXfsOptions span.generic {float:left; clear:both}\
                        div#FPXfsOptions span.share { font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-size: 10px; margin-right: 10px; margin-right: 5px; display: inline-block; padding-top: 3px; }\
                        div#FPXfsOptions label { margin-right: 3px; }\
                        div#dotdx_sidebar_container { margin-top: 0; padding-top: 5px; overflow: hidden; }\
                        div#dotdx_sidebar_container > button {width: 60px; border: 1px solid #555; margin-bottom: 5px; font-size: 11px; font-family: \"Trebuchet MS\", Helvetica, sans-serif; height: 21px; transition-property: box-shadow, text-shadow, border-color, background; transition-duration: .5s; outline: none; position: relative; z-index: 9;}\
                        div#dotdx_sidebar_container > button:hover { position: relative; z-index: 40;}\
                        div#dotdx_sidebar_container > div.label { text-align: center; color: #fff; padding-top: 7px; height: 19px; text-shadow: 0 0 6px #fff; font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-size: 12px; }\
                        div#dotdx_sidebar_container > div { width: 60px; height: 26px }\
                        div#dotdx_sidebar_container > input[type=\"text\"] { border: 1px solid #555; margin-bottom: 5px; display: inline-block; font-family: \"Trebuchet MS\", Helvetica, sans-serif; font-size: 11px; font-style: italic; width: 46px; outline: none; height: 13px; text-align: center; position:absolute; z-index:3; padding: 3px 6px; transition: width .5s; }\
                        div#dotdx_sidebar_container > input[type=\"text\"].slim {width: 16px}\
                        div#dotdx_sidebar_container > input[type=\"text\"]:hover, div#dotdx_sidebar_container > input[type=\"text\"]:focus { width:250px; text-align: left; }\
                        div#dotdx_sidebar_container > div#serverButton {cursor: pointer; border: 1px solid #111; text-align: center; height: auto; width: 58px; padding: 4px 0px; box-shadow: 0px 0px 4px #222; margin-bottom: 7px; transition: all .5s ease 0s;}\
						div#dotdx_sidebar_container > div#serverButton:hover {border-radius: 5px;} \
						div#dotdx_sidebar_container > button.slim, div#dotdx_sidebar_container > div.slim {width: 30px}\
						div#dotdx_sidebar_container.slim {width: 32px}\
						div#dotdx_sidebar_container > div#serverButton.slim {width: 28px}\
						#kong_game_ui div#chat_room_tabs div a, #kong_game_ui div#alliance_tab a, #kong_game_ui div#lots_tab_pane ul li.tab div.tab_head {transition: all .3s;}\
                        div.raid_list_item > span.DotDX_extState { display: inline-block; width:27px; padding-top: 2px }\
                        div.raid_list_item > span.DotDX_extInfo { float: right; display:inline; margin-right: 5px; color:#c0c0c0; font-size: 11px }\
                        div.raid_list_item > br {clear:both}\
                        div.raid_list_item > span.DotDX_extInfo.failings {color: #ffda8e}\
                        div.raid_list_item > span.DotDX_extInfo.failingm {color: #ff8080}\
                        div.raid_list_item > span.DotDX_extInfo.failingh {color: #ff4040}\
                        #FPXRaidFilterWhatDiv table {max-height: 327px; overflow-y: auto;}\
                        #FPXRaidFilterWhatDiv table tr td:first-child {text-overflow: ellipsis; white-space: pre; overflow-x: hidden; width: 150px; display: inline-block;}\
                        #chat_raids_overlay table {margin-top: 2px;}\
                        #chat_raids_overlay table td {line-height: 13px;}\
                        #chat_raids_overlay table td.best {text-decoration: underline;}\
                        #chat_raids_overlay table td:nth-child(odd) {text-align: right; padding-right: 2px; min-width: 18px;}\
                        #chat_raids_overlay table td:nth-child(even) {width: 45px;}\
                    " + elemPositionFix).attach("to", document.head);
                        SRDotDX.c('style').set({type: "text/css", id: 'DotDX_themeClass'}).attach('to', document.head);
                        SRDotDX.gui.applyTheme();
                        SRDotDX.c('style').set({type: "text/css", id: 'DotDX_tabs'}).attach('to', document.head);
                        SRDotDX.c('style').set({type: "text/css", id: 'DotDX_fontClass'}).attach('to', document.head);
                        SRDotDX.gui.applyFontSize();
                        var link = SRDotDX.c('a').set({href: '#lots_tab_pane', class: ''}).html(SRDotDX.config.dotdxTabName, false).attach('to', SRDotDX.c('li').set({ class: 'tab', id: 'lots_tab' }).attach('after', 'chat_tab').ele()).ele();
                        var sbTmp = JSON.stringify(SRDotDX.config.sbConfig);
                        sbTmp = sbTmp.slice(1, sbTmp.length - 1).replace(/},/g, "},&#10;").replace(/l,/g, "l,&#10;");
                        var pane = SRDotDX.c('div').set({id: 'lots_tab_pane'}).html(' \
						<div id="dotdx_shadow_wrapper">\
						<div id="dotdx_status_div">DotDX: <span id="StatusOutput"></span></div> \
						<div style="height: 617px; overflow: hidden;">\
						<ul id="SRDotDX_tabpane_tabs"> \
							<li class="tab active"> \
								<div class="tab_head" id="raids_tab">Raids</div> \
								<div class="tab_pane" id="mainRaidsFrame"> \
									<div id="topRaidPane"> \
									<div id="FPXRaidFilterDiv" class="collapsible_panel"> \
										<p class="collapsingCategory" id="collapsingCat10" onclick="SRDotDX.gui.toggleDisplay(\'FPXRaidFiltering\', this, \'raid_list\')">Filtering<span style="float:right">&minus;</span></p> \
										<div id="FPXRaidFiltering" style="display:block" class="collapsingField"> \
											<input type="text" id="raidsBossFilter" name="FPXRaidBossNameFilter"> \
                                            <input type="checkbox" id="dotdx_flt_vis"><label for="dotdx_flt_vis" style="margin-right: 9px; margin-left:5px; display: inline-block">Incl visited</label>\
                                            <input type="checkbox" id="dotdx_flt_full"><label for="dotdx_flt_full" style="margin-right: 9px;">Excl full</label>\
                                            <input type="checkbox" id="dotdx_flt_all"><label for="dotdx_flt_all">Bypass filters</label>\
										</div> \
									</div> \
									<!-- <div id="FPXRaidSortingDiv" class="collapsible_panel"> \
										<p class="collapsingCategory" id="collapsingCat11" onclick="SRDotDX.gui.toggleDisplay(\'FPXRaidSort\', this, \'raid_list\')">Sorting<span style="float:right">+</span></p> \
										<div id="FPXRaidSort" style="display:none"> \
											<table> \
											<tr><td rowspan="2"><input type="button" class="regBtn" style="display:inline; height: 40px" id="SortRaidsButton" onClick="SRDotDX.gui.FPXSortRaids();return false;" value="Sort" onmouseout="SRDotDX.gui.turnNormal(this.id);" onmouseover="SRDotDX.gui.highlightButton(this.id,\'Sort raids based on selected criteria.\');"></td> \
											<td>&nbsp;Sort by: \
											<select style="width: 90px" id="FPXRaidSortSelection" tabIndex="-1"> \
												<option value="Time" selected>TimeStamp</option> \
												<option value="Name">Raid Name</option> \
												<option value="Diff">Difficulty</option> \
												<option value="Id">Raid Id</option> \
											</select> \
											<select style="width: 56px" id="FPXRaidSortDirection" tabIndex="-1"> \
												<option value="asc" selected>Asc</option> \
												<option value="desc">Desc</option> \
											</select></td></tr> \
											<tr><td style="padding: 2px"><input type="checkbox" id="SRDotDX_options_newRaidsAtTopOfRaidList"><div><label>New raids at top of raid list</label></div></td></tr> \
											</table> \
										</div> \
									</div> --> \
										<input style="width: 94px; margin-top: 6px; margin-left: 5px" name="ImportRaids" class="blue" id="ImportRaidsButton" onclick="SRDotDX.request.raids(false,1); return false;" tabIndex="-1" type="button" value="Import" onmouseout="SRDotDX.gui.displayHint();" onmouseover="SRDotDX.gui.displayHint(\'Import raids from server.\');">\
										<input style="width: 55px;" name="DumpRaids" class="generic" id="DumpRaidsButton" onclick="SRDotDX.gui.RaidAction(\'share\');return false;" tabIndex="-1" type="button" value="Share" onmouseout="SRDotDX.gui.displayHint();" onmouseover="SRDotDX.gui.displayHint(\'Copy all displayed raids to the share tab.\');"> \
										<input style="width: 55px;" name="PostRaids" class="generic" id="PostRaidsButton" onclick="SRDotDX.gui.RaidAction(\'post\');return false;" tabIndex="-1" type="button" value="Post" onmouseout="SRDotDX.gui.displayHint();" onmouseover="SRDotDX.gui.displayHint(\'Post all displayed raids to chat.\');"> \
										<input style="width: 55px;" name="DeleteRaids" class="red" id="DeleteRaidsButton" onclick="SRDotDX.gui.RaidAction(\'delete\'); return false;" tabIndex="-1" type="button" value="Delete" onmouseout="SRDotDX.gui.displayHint();" onmouseover="SRDotDX.gui.displayHint(\'Delete displayed raids.\');"><br> \
										<input style="width: 94px; margin-bottom: 7px; margin-left: 5px; margin-top: 4px"name="JoinRaids" class="green" id="AutoJoinVisibleButton" onclick="SRDotDX.gui.joinSelectedRaids(false) ;return false;" tabIndex="-1" type="button" value="Join" onmouseout="SRDotDX.gui.displayHint();" onmouseover="SRDotDX.gui.displayHint(\'Join all displayed (not dead) raids.\'); "> \
										<input style="width: 173px; margin-bottom: 5px; margin-top: 4px" name="ImpJoinRaids" class="green" id="AutoImpJoinVisibleButton" onclick="SRDotDX.request.joinAfterImport = true; SRDotDX.request.raids(false,1);return false;" tabIndex="-1" type="button" value="Import & Join" onmouseout="SRDotDX.gui.displayHint();" onmouseover="SRDotDX.gui.displayHint(\'Import from server and join all selected (not dead) raids.\'); "> \
									</div> \
									<div style="" id="raid_list" tabIndex="-1"></div> \
								</div> \
							</li> \
							<li class="tab"> \
							<div class="tab_head">Opts</div> \
								<div class="tab_pane"> \
									<div id="FPXRaidOptionsDiv" class="collapsible_panel"> \
										<p class="collapsingCategory" name="dotdxOptsTabs" id="collapsingCat20" onclick="SRDotDX.gui.toggleDisplay(\'FPXRaidOptions\', this)">Raid Options<span style="float:right">+</span></p> \
										<div id="FPXRaidOptions" name="dotdxOptsTabs" style="display:none" class="collapsingField"> \
												<input type="checkbox" id="SRDotDX_options_markMyRaidsVisited" class="generic"><label for="SRDotDX_options_markMyRaidsVisited">Mark raids posted by me as visited</label><br> \
												<input type="checkbox" id="SRDotDX_options_confirmWhenDeleting" class="generic"><label for="SRDotDX_options_confirmWhenDeleting">Confirm when manually deleting raids</label><br> \
												<input type="checkbox" id="SRDotDX_options_importFiltered" class="generic"><label for="SRDotDX_options_importFiltered">Add to database filtered raids only</label><br> \
										</div> \
									</div> \
									<div id="FPXChatOptionsDiv" class="collapsible_panel"> \
										<p class="collapsingCategory" name="dotdxOptsTabs" id="collapsingCat21" onclick="SRDotDX.gui.toggleDisplay(\'FPXChatOptions\', this)">Chat Options<span style="float:right">+</span></p> \
										<div id="FPXChatOptions" name="dotdxOptsTabs" style="display:none" class="collapsingField"> \
											<input type="checkbox" id="SRDotDX_options_hideRaidLinks" class="generic"><label for="SRDotDX_options_hideRaidLinks">Hide all raid links in chat</label><br> \
											<input type="checkbox" id="SRDotDX_options_hideBotLinks" class="generic"><label for="SRDotDX_options_hideBotLinks">Hide bot raid links in chat</label><br> \
											<input type="checkbox" id="SRDotDX_options_hideVisitedRaids" class="generic"><label for="SRDotDX_options_hideVisitedRaids">Hide visited raids in chat</label><br> \
											<input type="checkbox" id="options_formatChatLinks" class="generic"><label for="options_formatChatLinks">Format all links in chat</label><br> \
											<span class="generic">Chat size:</span>\
											<input type="radio" id="SRDotDX_options_chatSizeNormal" name="chatSize" value="300"/><label for="SRDotDX_options_chatSizeNormal">Normal</label> \
											<input type="radio" id="SRDotDX_options_chatSizePlus25" name="chatSize" value="375" class="generic"/><label for="SRDotDX_options_chatSizePlus25">+25%</label> \
											<input type="radio" id="SRDotDX_options_chatSizePlus50" name="chatSize" value="400" class="generic"/><label for="SRDotDX_options_chatSizePlus50">+50%</label><br> \
											<span class="generic">Font size:</span>\
											<input type="radio" id="SRDotDX_options_fontSizeNormal" name="fontSize" value="0"/><label for="SRDotDX_options_fontSizeNormal">Normal</label> \
											<input type="radio" id="SRDotDX_options_fontSizeSmaller" name="fontSize" value="2" class="generic"/><label for="SRDotDX_options_fontSizeSmaller">Smaller</label> \
											<input type="radio" id="SRDotDX_options_chatSizeBigger" name="fontSize" value="1" class="generic"/><label for="SRDotDX_options_chatSizeBigger">Bigger</label><br> \
											<span class="generic">IGN mode:</span>\
											<input type="radio" id="SRDotDX_options_ignHide" name="ignMode" value="0"/><label for="SRDotDX_options_ignHide">Hide</label> \
											<input type="radio" id="SRDotDX_options_ignReplace" name="ignMode" value="1" class="generic"/><label for="SRDotDX_options_ignReplace">Replace</label> \
											<input type="radio" id="SRDotDX_options_ignAttach" name="ignMode" value="2" class="generic"/><label for="SRDotDX_options_ignAttach">Attach</label><br> \
											<input type="checkbox" id="SRDotDX_options_hideScrollbar" class="generic"><label for="SRDotDX_options_hideScrollbar">Hide scrollbar for chat and user window</label><br> \
											<span class="generic">More info in raid links:</span> \
											<input type="checkbox" id="SRDotDX_options_showFS"><label for="SRDotDX_options_showFS">Show FS</label> \
											<input type="checkbox" id="SRDotDX_options_showAP" class="generic"><label for="SRDotDX_options_showAP">Show AP</label> \
										</div> \
									</div> \
									<div id="FPXAllianceOptionsDiv" class="collapsible_panel"> \
										<p class="collapsingCategory" name="dotdxOptsTabs" id="collapsingCat22" onclick="SRDotDX.gui.toggleDisplay(\'FPXAllianceOptions\', this)">Alliance Chat Options<span style="float:right">+</span></p> \
										<div id="FPXAllianceOptions" name="dotdxOptsTabs" style="display:none" class="collapsingField"> \
											<input type="checkbox" id="options_enableAllianceChat" class="generic"><label for="options_enableAllianceChat">Enable Alliance Chat</label><br>\
											<span class="generic">Server address: </span>\
								            <input type="text" class="generic" id="options_allianceServer" style="width:160px; text-align: left; vertical-align: bottom; margin-top: 4px;"><br>\
								            <span class="generic">Chat name: </span>\
								            <input type="text" class="generic" id="options_allianceName" style="width:160px; margin-left: 23px; text-align: left; vertical-align: bottom; margin-top: 4px;"><br>\
										</div> \
									</div> \
									<div id="FPXIntOptionsDiv" class="collapsible_panel"> \
										<p class="collapsingCategory" name="dotdxOptsTabs" id="collapsingCat23" onclick="SRDotDX.gui.toggleDisplay(\'FPXIntOptions\', this)">Interface Options<span style="float:right">+</span></p> \
										<div id="FPXIntOptions" name="dotdxOptsTabs" style="display:none" class="collapsingField"> \
										    <input type="checkbox" id="options_hideGameTitle" class="generic"><label for="options_hideGameTitle">Hide titlebar above game window</label><br>\
										    <input type="checkbox" id="options_hideGameDetails" class="generic"><label for="options_hideGameDetails">Hide details under game window</label><br>\
										    <input type="checkbox" id="options_hideKongForum" class="generic"><label for="options_hideKongForum">Hide forum under game window</label><br>\
										    <input type="checkbox" id="options_trueMsgCount" class="generic"><label for="options_trueMsgCount">Display true kong messages count</label><br>\
										    <input type="checkbox" id="options_hideGameTab" class="generic"><label for="options_hideGameTab">Hide Game tab</label><br>\
										    <input type="checkbox" id="options_hideAccTab" class="generic"><label for="options_hideAccTab">Hide Achievements tab</label><br>\
										    <input type="checkbox" id="options_clearRMB" class="generic"><label for="options_clearRMB">Use RMB to clear chat input field</label><br>\
										    <span class="generic">Script tab name</span><input type="text" class="generic color" id="options_dotdxTabName"><br> \
										    <span class="generic">Background color</span><input type="text" class="generic color" id="SRDotDX_colors_background"><br> \
										    <span class="generic">Theme:</span>\
                                            <input type="radio" id="theme_lightGrey" name="chatTheme" value="0"><label for="theme_lightGrey">Light Grey</label>\
										    <input type="radio" id="theme_crimsonBlack" name="chatTheme" value="1" class="generic"><label for="theme_crimsonBlack">Crimson Black</label>\
										    <span class="generic">World Chat:</span>\
										    <input type="checkbox" id="options_wcLeft" class="generic"><label for="options_wcLeft">Show on the left   </label><input type="checkbox" id="options_wcRemove" class="generic"><label for="options_wcRemove">Remove</label>\
										</div>\
									</div> \
									<div id="FPXsbOptionsDiv" class="collapsible_panel"> \
										<p class="collapsingCategory" name="dotdxOptsTabs" id="collapsingCat24" onclick="SRDotDX.gui.toggleDisplay(\'FPXsbOptions\', this)">Sidebar Options<span style="float:right">+</span></p> \
										<div id="FPXsbOptions" name="dotdxOptsTabs" style="display:none" class="collapsingField"> \
										    <input type="checkbox" id="options_sbEnable" class="generic"><label for="options_sbEnable">Enable DotDX Sidebar</label><br>\
										    <input type="checkbox" id="options_sbSlim" class="generic"><label for="options_sbSlim">Use slim Sidebar</label><br>\
										    <input type="checkbox" id="options_sbRightSide" class="generic"><label for="options_sbRightSide">Show sidebar on the right side of chat</label><br> \
                                            <textarea wrap="off" id="options_sbConfig" rows="25" style="overflow-y: hidden; overflow-x: scroll; white-space: nowrap">' + sbTmp + '</textarea> \
										    <input id="dotdx_sbConfigSave" style="margin: 0 0 2px 6px; width: 156px;" class="blue" type="button" value="Apply new sidebar layout" onclick="SRDotDX.gui.applySidebarUI(0); return false;">\
										    <input id="dotdx_sbConfigDefault" style="width: 110px;" class="red" type="button" value="Restore default" onclick="SRDotDX.gui.restoreDefaultSB(); return false;">\
										</div> \
									</div> \
									<div id="FPXfsOptionsDiv" class="collapsible_panel"> \
										<p class="collapsingCategory" name="dotdxOptsTabs" id="collapsingCat25" onclick="SRDotDX.gui.toggleDisplay(\'FPXfsOptions\', this)">Friend Share Options<span style="float:right">+</span></p> \
										<div id="FPXfsOptions" name="dotdxOptsTabs" style="display:none; text-align:right" class="collapsingField"> \
										</div> \
									</div> \
								</div> \
							</li> \
							<li class="tab"> \
								<div class="tab_head" id="FPXShareTab">Share</div> \
								<div class="tab_pane"> \
								    <div id="FPXRaidSpamDiv"> \
											<div id="FPXShareDiv" class="collapsible_panel"> \
												<p class="collapsingCategory" id="collapsingCat30" onclick="SRDotDX.gui.toggleDisplay(\'FPXShare\', this, \'share_list\')">Share<span style="float:right">+</span></p> \
										        <div id="FPXShare" style="display:block" class="collapsingField"> \
													<input type="checkbox" id="SRDotDX_options_formatLinkOutput" class="generic"><label for="SRDotDX_options_formatLinkOutput">Enable formatting of posted raid links</label><br> \
													<span class="generic">Whisper to </span><input type="text" class="generic" id="SRDotDX_options_whisperTo"><br>\
													<span class="notice">(if "whisper to" field is blank, raids will be posted public)</span> \
													<input id="dotdx_share_post_button" style="margin: 3px 0 0 6px; width: 133px" name="Submit" class="generic" type="button" tabIndex="-1" value="Post Links to Chat" onclick="SRDotDX.gui.RaidAction(\'post_share\');return false;"/> \
													<input id="dotdx_friend_post_button" style="width: 133px" name="Submit1" class="green" type="button" tabIndex="-1" value="Friend Share links" onclick="SRDotDX.gui.RaidAction(\'post_friend\');return false;"/><br> \
												</div> \
											</div> \
											<div id="FPXImportDiv" class="collapsible_panel" class="collapsingField"> \
												<p class="collapsingCategory" id="collapsingCat31" onclick="SRDotDX.gui.toggleDisplay(\'FPXImport\', this, \'share_list\')">Import<span style="float:right">+</span></p> \
										        <div id="FPXImport" style="display:none" class="collapsingField"> \
													<input type="checkbox" id="SRDotDX_options_markImportedRaidsVisited" class="generic"><label for="SRDotDX_options_markImportedRaidsVisited">Mark imported raids visited</label><br> \
                                                    <input style="margin-left: 6px; margin-top: 6px; width: 133px" name="Submit2" class="blue" type="button" tabIndex="-1" value="Import to Raid Tab" onClick="SRDotDX.gui.FPXimportRaids();return false;"/> \
													<input style="width: 133px" name="Submit3" class="blue" type="button" tabIndex="-1" value="Delete and Import" onClick="SRDotDX.gui.FPXdeleteAllRaids();SRDotDX.gui.FPXimportRaids();return false;"/> \
											    </div> \
											</div> \
									</div> \
									<textarea id="DotDX_raidsToSpam" name="FPXRaidSpamInput" style="height:437px;"></textarea> \
								</div> \
							</li> \
							<li class="tab"> \
								<div class="tab_head">Filter</div> \
								<div class="tab_pane"> \
									<div id="FPXRaidFilterDiv"> \
										<div id="FPXRaidFilterWhereDiv"> \
										<p class="collapsingCategory" id="collapsingCat40" onclick="SRDotDX.gui.toggleDisplay(\'FPXRaidFilterWhere\', this)">Filtering options<span style="float:right">+</span></p> \
										<div id="FPXRaidFilterWhere" style="display:block" class="collapsingField"> \
											<input type="checkbox" id="SRDotDX_options_perRaidFilterLinks" class="generic"><label for="SRDotDX_options_perRaidFilterLinks">Activate filtering on raid links</label><br> \
											<input type="checkbox" id="SRDotDX_options_perRaidFilterRaidList" class="generic"><label for="SRDotDX_options_perRaidFilterRaidList">Activate filtering on raid list tab</label><br> \
										</div>\
										</div> \
										<div id="FPXRaidFilterWhatDiv"> \
											<div id="FPXRaidTableSmallDiv" class="collapsible_panel"> \
												<p class="collapsingCategory" name="dotdxFilterTab" id="collapsingCat41" onclick="SRDotDX.gui.toggleDisplay(\'FPXRaidTableSmall\', this)">Small Raids<span style="float:right">+</span></p> \
												<table id="FPXRaidTableSmall" name="dotdxFilterTab" style="display:none" class="collapsingField"> \
													<col width="180"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><thead><tr><th>Raid</th><th>N</th><th>H</th><th>L</th><th>NM</th><th>All</th></tr></thead> \
													<tbody id="FPXRaidFilterWhatSmall"> \
														<!-- Dynamic content --> \
													</tbody> \
												</table> \
											</div> \
											<div id="FPXRaidTableMediumDiv" class="collapsible_panel"> \
												<p class="collapsingCategory" name="dotdxFilterTab" id="collapsingCat42" onclick="SRDotDX.gui.toggleDisplay(\'FPXRaidTableMedium\', this)">Medium Raids<span style="float:right">+</span></p> \
												<table id="FPXRaidTableMedium" name="dotdxFilterTab" style="display:none" class="collapsingField"> \
													<col width="180"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><thead><tr><th>Raid</th><th>N</th><th>H</th><th>L</th><th>NM</th><th>All</th></tr></thead> \
													<tbody id="FPXRaidFilterWhatMedium"> \
														<!-- Dynamic content --> \
													</tbody> \
												</table> \
											</div> \
											<div id="FPXRaidTableLargeDiv" class="collapsible_panel"> \
												<p class="collapsingCategory" name="dotdxFilterTab" id="collapsingCat43" onclick="SRDotDX.gui.toggleDisplay(\'FPXRaidTableLarge\', this)">Large Raids<span style="float:right">+</span></p> \
												<table id="FPXRaidTableLarge" name="dotdxFilterTab" style="display:none" class="collapsingField"> \
													<col width="180"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><thead><tr><th>Raid</th><th>N</th><th>H</th><th>L</th><th>NM</th><th>All</th></tr></thead> \
													<tbody id="FPXRaidFilterWhatLarge"> \
														<!-- Dynamic content --> \
													</tbody> \
												</table> \
											</div> \
											<div id="FPXRaidTableEpicDiv" class="collapsible_panel"> \
												<p class="collapsingCategory" name="dotdxFilterTab" id="collapsingCat44" onclick="SRDotDX.gui.toggleDisplay(\'FPXRaidTableEpic\', this)">Epic Raids<span style="float:right">+</span></p> \
												<table id="FPXRaidTableEpic" name="dotdxFilterTab" style="display:none" class="collapsingField"> \
													<col width="180"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><thead><tr><th>Raid</th><th>N</th><th>H</th><th>L</th><th>NM</th><th>All</th></tr></thead> \
													<tbody id="FPXRaidFilterWhatEpic"> \
														<!-- Dynamic content --> \
													</tbody> \
												</table> \
											</div> \
											<div id="FPXRaidTableColossalDiv" class="collapsible_panel"> \
												<p class="collapsingCategory" name="dotdxFilterTab" id="collapsingCat45" onclick="SRDotDX.gui.toggleDisplay(\'FPXRaidTableColossal\', this)">Colossal Raids<span style="float:right">+</span></p> \
												<table id="FPXRaidTableColossal" name="dotdxFilterTab" style="display:none" class="collapsingField"> \
													<col width="180"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><thead><tr><th>Raid</th><th>N</th><th>H</th><th>L</th><th>NM</th><th>All</th></tr></thead> \
													<tbody id="FPXRaidFilterWhatColossal"> \
														<!-- Dynamic content --> \
													</tbody> \
												</table> \
											</div> \
											<div id="FPXRaidTableGiganticDiv" class="collapsible_panel"> \
												<p class="collapsingCategory" name="dotdxFilterTab" id="collapsingCat46" onclick="SRDotDX.gui.toggleDisplay(\'FPXRaidTableGigantic\', this)">Gigantic Raids<span style="float:right">+</span></p> \
												<table id="FPXRaidTableGigantic" name="dotdxFilterTab" style="display:none" class="collapsingField"> \
													<col width="180"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><thead><tr><th>Raid</th><th>N</th><th>H</th><th>L</th><th>NM</th><th>All</th></tr></thead> \
													<tbody id="FPXRaidFilterWhatGigantic"> \
														<!-- Dynamic content --> \
													</tbody> \
												</table> \
											</div> \
											<div id="FPXRaidTableGuildDiv" class="collapsible_panel"> \
												<p class="collapsingCategory" name="dotdxFilterTab" id="collapsingCat47" onclick="SRDotDX.gui.toggleDisplay(\'FPXRaidTableGuild\', this)">Guild Raids<span style="float:right">+</span></p> \
												<table id="FPXRaidTableGuild" name="dotdxFilterTab" style="display:none; height: 330px; overflow-y: auto;" class="collapsingField"> \
													<col width="180"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><thead><tr><th>Raid</th><th>N</th><th>H</th><th>L</th><th>NM</th><th>All</th></tr></thead> \
													<tbody id="FPXRaidFilterWhatGuild"> \
														<!-- Dynamic content --> \
													</tbody> \
												</table> \
											</div> \
											<div id="FPXRaidTableSpecialDiv" class="collapsible_panel"> \
												<p class="collapsingCategory" name="dotdxFilterTab" id="collapsingCat48" onclick="SRDotDX.gui.toggleDisplay(\'FPXRaidTableSpecial\', this)">World Raids<span style="float:right">+</span></p> \
												<table id="FPXRaidTableSpecial" name="dotdxFilterTab" style="display:none" class="collapsingField"> \
													<col width="180"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><thead><tr><th>Raid</th><th>N</th><th>H</th><th>L</th><th>NM</th><th>All</th></tr></thead> \
													<tbody id="FPXRaidFilterWhatSpecial"> \
														<!-- Dynamic content --> \
													</tbody> \
												</table> \
											</div> \
										</div> \
									</div> \
								</div> \
							</li> \
							<li class="tab"> \
								<div class="tab_head">Util</div> \
								<div class="tab_pane"> \
                                    <div id="FPXLandCalcDiv" class="collapsible_panel"> \
                                        <p class="collapsingCategory" id="collapsingCat50" onclick="SRDotDX.gui.toggleDisplay(\'FPXLandCalc\', this)">Land Calculator<span style="float:right">+</span></p> \
                                        <div id="FPXLandCalc" style="display:block" class="collapsingField"> \
                                            <form id="FPXLand" name="FPXLandForm" onSubmit="return false;" style="padding-bottom:6px"> \
                                            <table style="margin: 0 auto; padding-right: 10px;"> \
                                                <tr><td class="landname" colspan="3">Cornfield</td><td style="width: 10px">&nbsp;</td><td class="landname" colspan="3">Stable</td></tr> \
                                                <tr> \
                                                    <td> <input class="landpmbutton red" id="a_1" name="FPXminusTen_1" type="button" value=" - " onClick="SRDotDX.gui.FPXLandButtonHandler(this, this.name);return false;" tabindex="10"/></td> \
                                                    <td> <input class="generic" maxlength="10" name="tf_1" onblur="SRDotDX.gui.FPXLandUpdater();" size="8" type="text" tabindex="1" /></td> \
                                                    <td> <input class="landpmbutton blue" id="b_1" name="FPXplusTen_1" type="button" value=" + " onClick="SRDotDX.gui.FPXLandButtonHandler(this, this.name);return false;" tabindex="11"/></td> \
                                                    <td></td> \
                                                    <td> <input class="landpmbutton red" id="a_2" name="FPXminusTen_2" type="button"   value=" - " onClick="SRDotDX.gui.FPXLandButtonHandler(this, this.name);return false;" tabindex="12"/></td> \
                                                    <td> <input class="generic" maxlength="10" name="tf_2" onblur="SRDotDX.gui.FPXLandUpdater();" size="8" type="text" tabindex="2" /></td> \
                                                    <td> <input class="landpmbutton blue" id="b_2" name="FPXplusTen_2" type="button"   value=" + " onClick="SRDotDX.gui.FPXLandButtonHandler(this, this.name);return false;" tabindex="13"/></td> \
                                                </tr> \
                                                <tr><td class="landname" colspan="3">Barn</td><td></td><td class="landname" colspan="3">Store</td></tr> \
                                                <tr> \
                                                    <td> <input class="landpmbutton red" id="a_3" name="FPXminusTen_3" type="button"   value=" - " onClick="SRDotDX.gui.FPXLandButtonHandler(this, this.name);return false;" tabindex="14"/></td> \
                                                    <td> <input class="generic" maxlength="10" name="tf_3" onblur="SRDotDX.gui.FPXLandUpdater();" size="8" type="text" tabindex="3" /></td> \
                                                    <td> <input class="landpmbutton blue" id="b_3" name="FPXplusTen_3" type="button"   value=" + " onClick="SRDotDX.gui.FPXLandButtonHandler(this, this.name);return false;" tabindex="15"/></td> \
                                                    <td></td> \
                                                    <td> <input class="landpmbutton red" id="a_4" name="FPXminusTen_4" type="button"   value=" - " onClick="SRDotDX.gui.FPXLandButtonHandler(this, this.name);return false;" tabindex="16"/></td> \
                                                    <td> <input class="generic" maxlength="10" name="tf_4" onblur="SRDotDX.gui.FPXLandUpdater();" size="8" type="text" tabindex="4" /></td> \
                                                    <td> <input class="landpmbutton blue" id="b_4" name="FPXplusTen_4" type="button"   value=" + " onClick="SRDotDX.gui.FPXLandButtonHandler(this, this.name);return false;" tabindex="17"/></td> \
                                                </tr> \
                                                <tr><td class="landname" colspan="3">Pub</td><td></td><td class="landname" colspan="3">Inn</td></tr> \
                                                <tr> \
                                                    <td> <input class="landpmbutton red" id="a_5" name="FPXminusTen_5" type="button"   value=" - " onClick="SRDotDX.gui.FPXLandButtonHandler(this, this.name);return false;" tabindex="18"/></td> \
                                                    <td> <input class="generic" maxlength="10" name="tf_5" onblur="SRDotDX.gui.FPXLandUpdater();" size="8" type="text" tabindex="5" /></td> \
                                                    <td> <input class="landpmbutton blue" id="b_5" name="FPXplusTen_5" type="button"   value=" + " onClick="SRDotDX.gui.FPXLandButtonHandler(this, this.name);return false;" tabindex="19"/></td> \
                                                    <td></td> \
                                                    <td> <input class="landpmbutton red" id="a_6" name="FPXminusTen_6" type="button"   value=" - " onClick="SRDotDX.gui.FPXLandButtonHandler(this, this.name);return false;" tabindex="20"/></td> \
                                                    <td> <input class="generic" maxlength="10" name="tf_6" onblur="SRDotDX.gui.FPXLandUpdater();" size="8" type="text" tabindex="6" /></td> \
                                                    <td> <input class="landpmbutton blue" id="b_6" name="FPXplusTen_6" type="button"   value=" + " onClick="SRDotDX.gui.FPXLandButtonHandler(this, this.name);return false;" tabindex="21"/></td> \
                                                </tr> \
                                                <tr><td class="landname" colspan="3">Sentry</td><td></td><td class="landname" colspan="3">Fort</td></tr> \
                                                <tr> \
                                                    <td> <input class="landpmbutton red" id="a_7" name="FPXminusTen_7" type="button"   value=" - " onClick="SRDotDX.gui.FPXLandButtonHandler(this, this.name);return false;" tabindex="22"/></td> \
                                                    <td> <input class="generic" maxlength="10" name="tf_7" onblur="SRDotDX.gui.FPXLandUpdater();" size="8" type="text" tabindex="7" /></td> \
                                                    <td> <input class="landpmbutton blue" id="b_7" name="FPXplusTen_7" type="button"   value=" + " onClick="SRDotDX.gui.FPXLandButtonHandler(this, this.name);return false;" tabindex="23"/></td> \
                                                    <td></td> \
                                                    <td> <input class="landpmbutton red" id="a_8" name="FPXminusTen_8" type="button"   value=" - " onClick="SRDotDX.gui.FPXLandButtonHandler(this, this.name);return false;" tabindex="24"/></td> \
                                                    <td> <input class="generic" maxlength="10" name="tf_8" onblur="SRDotDX.gui.FPXLandUpdater();" size="8" type="text" tabindex="8" /></td> \
                                                    <td> <input class="landpmbutton blue" id="b_8" name="FPXplusTen_8" type="button"   value=" + " onClick="SRDotDX.gui.FPXLandButtonHandler(this, this.name);return false;" tabindex="25"/></td> \
                                                </tr> \
                                                <tr><td class="landname" colspan="3">Castle</td></tr> \
                                                <tr> \
                                                    <td> <input class="landpmbutton red" id="a_9" name="FPXminusTen_9" type="button"   value=" - " onClick="SRDotDX.gui.FPXLandButtonHandler(this, this.name);return false;" tabindex="26"/></td> \
                                                    <td> <input  class="generic" maxlength="10" name="tf_9" onblur="SRDotDX.gui.FPXLandUpdater();" size="8" type="text" tabindex="9" /></td> \
                                                    <td> <input class="landpmbutton blue" id="b_9" name="FPXplusTen_9" type="button"   value=" + " onClick="SRDotDX.gui.FPXLandButtonHandler(this, this.name);return false;" tabindex="27"/></td> \
                                                    <td></td> \
                                                    <td colspan="3"> <input class="landsavebutton green" id="lsbutton" type="button" value="Save" onClick="SRDotDX.gui.FPXLandButtonSave();return false;" tabindex="28"/></td> \
                                                </tr> \
                                            </table> \
                                            </form> \
                                        </div> \
                                    </div>\
                                    <div id="WhoPostedMyRaidDiv" class="collapsible_panel"> \
								        <p class="collapsingCategory" id="collapsingCat51" onclick="SRDotDX.gui.toggleDisplay(\'WhoPostedMyRaid\', this)">Who posted my raid?<span style="float:right">+</span></p> \
								        <div id="WhoPostedMyRaid" style="display:block" class="collapsingField"> \
								            <span class="generic" style="margin-top:6px; margin-right: 2px">Raid link or id: </span>\
								            <input type="text" class="generic" id="DotDX_checkRaidPoster" style="width:120px">\
								            <input class="green" type="button" value="Check" onClick="SRDotDX.request.poster(); return false;" style="height:20px; width:46px"><br>\
											<span class="generic">Raid: </span><span class="generic" id="DotDX_whoPosted_Raid"></span><br> \
											<span class="generic">Time: </span><span class="generic" id="DotDX_whoPosted_Time"></span><br> \
											<span class="generic">Poster: </span><span class="generic" id="DotDX_whoPosted_Poster"></span><br> \
								        </div> \
								    </div>\
								</div> \
							</li>  \
						</ul> \
						</div>\
						<div id="helpBox" style="max-height:0"><span>Help message</span></div> \
						</div>\
					', false).attach('to', 'kong_game_ui').ele();
                        SRDotDX.c('style').set({type: "text/css", id: 'DotDX_colors'}).text(' \
                        .DotDX_filter_dummy_0 {display: none !important} \
                        ').attach('to', document.head);

                        //pane.style.height = document.getElementById('chat_tab_pane').style.height;
                        var e = pane.getElementsByClassName('tab_head');
                        for(var i = 0, il = e.length; i < il; ++i) {
                            e[i].addEventListener('click', function () {
                                if (!/\bactive\b/i.test(this.className)) {
                                    var e = document.getElementById("lots_tab_pane").getElementsByTagName("li");
									for(var i = 0, il = e.length; i < il; ++i) if(e[i].getAttribute("class").indexOf("active") > -1) e[i].className = e[i].className.replace(/ active$/g, "");
                                    this.parentNode.className += ' active';
                                }
                            });
                        }
                        holodeck._tabs.addTab(link);
                        SRDotDX.gui.applyTabs();
                        //Set up custom chat size
                        SRDotDX.gui.hideWC(true);

                        //Chat raids overlay div
                        SRDotDX.c('div').set({id: 'chat_raids_overlay'}).html('<span id="chat_raids_overlay_text"></span>', true).attach("to", 'chat_tab_pane');

                        //Sidebar elements generator
                        if (SRDotDX.config.sbEnable) SRDotDX.gui.applySidebarUI(1);


                        //spam tab
                        var FPXimpSpam = SRDotDX.c('#DotDX_raidsToSpam');
                        var FPXSpamText = 'Paste raid links here to share or import\n\nLinks must be comma (,) separated.';
                        FPXimpSpam.ele().value = FPXSpamText;
                        FPXimpSpam.on('blur', function(){if(this.value === '') this.value = FPXSpamText});
                        FPXimpSpam.on('focus', function(){if(this.value === FPXSpamText) this.value = ''});

                        //chat global listener
                        var chat_window = document.getElementById('chat_rooms_container');
                        chat_window.addEventListener('click', SRDotDX.gui.chatWindowMouseDown, true);
                        chat_window.addEventListener('contextmenu', SRDotDX.gui.chatWindowContextMenu, false);

                        //land tab
                        els = document.FPXLandForm;
                        for(i = 0; i < 9; ++i) els.elements['tf_' + (i + 1)].value = SRDotDX.config.FPXLandOwnedCount[i];
                        SRDotDX.gui.FPXLandUpdater();

                        //raid tab
                        var raids_tab = document.getElementById('raids_tab');
                        raids_tab.addEventListener('click', function () {
                            SRDotDX.gui.refreshRaidList();
                        }, false);

                        var raidBossFilter = SRDotDX.c('#raidsBossFilter');
                        raidBossFilter.ele().value = SRDotDX.config.lastFilter[SRDotDX.config.serverMode - 1];
                        raidBossFilter.on("keyup", function () {
                            SRDotDX.gui.updateFilterTxt(this.value, true);
                        });

                        var filterIncVis = SRDotDX.c('#dotdx_flt_vis');
                        filterIncVis.ele().checked = SRDotDX.config.fltIncVis;
                        filterIncVis.on('click', function () {
                            SRDotDX.config.fltIncVis = this.checked;
                            if(!document.getElementById('dotdx_flt_all').checked) SRDotDX.gui.selectRaidsToJoin('checkbox');
                        });

                        var filterExclFull = SRDotDX.c('#dotdx_flt_full');
                        filterExclFull.ele().checked = SRDotDX.config.fltExclFull;
                        filterExclFull.on('click', function () {
                            SRDotDX.config.fltExclFull = this.checked;
                            if(!document.getElementById('dotdx_flt_all').checked) SRDotDX.gui.selectRaidsToJoin('checkbox');
                        });

                        var filterShowAll = SRDotDX.c('#dotdx_flt_all');
                        filterShowAll.ele().checked = SRDotDX.config.fltShowAll;
                        filterShowAll.on('click', function () {
                            SRDotDX.config.fltShowAll = this.checked;
                            SRDotDX.gui.selectRaidsToJoin('checkbox')
                        });

                        //raidlist global click listener
                        var raid_list = document.getElementById('raid_list');
                        raid_list.addEventListener('click', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            return false
                        }, false);
                        raid_list.addEventListener('mousedown', function (e) {
                            SRDotDX.gui.FPXraidListMouseDown(e)
                        }, false);

                        //options tab
                        var optsImportFiltered = SRDotDX.c('#SRDotDX_options_importFiltered');
                        optsImportFiltered.ele().checked = SRDotDX.config.importFiltered;
                        optsImportFiltered.on('click', function () {
                            SRDotDX.config.importFiltered = this.checked;
                            SRDotDX.config.save(false)
                        });

                        var optsShowFs = SRDotDX.c('#SRDotDX_options_showFS');
                        optsShowFs.ele().checked = SRDotDX.config.linkShowFs;
                        optsShowFs.on('click', function () {
                            SRDotDX.config.linkShowFs = this.checked;
                            SRDotDX.config.save(false)
                        });

                        var optsShowAp = SRDotDX.c('#SRDotDX_options_showAP');
                        optsShowAp.ele().checked = SRDotDX.config.linkShowAp;
                        optsShowAp.on('click', function () {
                            SRDotDX.config.linkShowAp = this.checked;
                            SRDotDX.config.save(false)
                        });

                        var optsHideARaids = SRDotDX.c('#SRDotDX_options_hideRaidLinks');
                        var optsHideBRaids = SRDotDX.c('#SRDotDX_options_hideBotLinks');
                        var optsHideVRaids = SRDotDX.c('#SRDotDX_options_hideVisitedRaids');
                        var optsConfirmDeletes = SRDotDX.c('#SRDotDX_options_confirmWhenDeleting');
                        var optsMarkImportedVisited = SRDotDX.c('#SRDotDX_options_markImportedRaidsVisited');
                        var optsWhisperTo = SRDotDX.c('#SRDotDX_options_whisperTo');
                        var optsMarkMyRaidsVisited = SRDotDX.c('#SRDotDX_options_markMyRaidsVisited');
                        var optsFormatLinkOutput = SRDotDX.c('#SRDotDX_options_formatLinkOutput');

                        var optsChatSizeNormal = SRDotDX.c('#SRDotDX_options_chatSizeNormal');
                        optsChatSizeNormal.on('click', function(){SRDotDX.gui.chatResize(300)});
                        var optsChatSizePlus25 = SRDotDX.c('#SRDotDX_options_chatSizePlus25');
                        optsChatSizePlus25.on('click', function(){SRDotDX.gui.chatResize(375)});
                        var optsChatSizePlus50 = SRDotDX.c('#SRDotDX_options_chatSizePlus50');
                        optsChatSizePlus50.on('click', function(){SRDotDX.gui.chatResize(450)});
                        switch (SRDotDX.config.chatSize) {
                            case 300: optsChatSizeNormal.ele().checked = true; break;
                            case 375: optsChatSizePlus25.ele().checked = true; break;
                            case 450: optsChatSizePlus50.ele().checked = true; break;
                            default: optsChatSizeNormal.ele().checked = true; break;
                        }

                        var optsChatFontNormal = SRDotDX.c('#SRDotDX_options_fontSizeNormal');
                        optsChatFontNormal.on('click', function () {
                            SRDotDX.gui.applyFontSize(0)
                        });
                        var optsChatFontSmaller = SRDotDX.c('#SRDotDX_options_fontSizeSmaller');
                        optsChatFontSmaller.on('click', function () {
                            SRDotDX.gui.applyFontSize(2)
                        });
                        var optsChatFontBigger = SRDotDX.c('#SRDotDX_options_chatSizeBigger');
                        optsChatFontBigger.on('click', function () {
                            SRDotDX.gui.applyFontSize(1)
                        });
                        switch (SRDotDX.config.fontNum) {
                            case 2: optsChatFontSmaller.ele().checked = true; break;
                            case 1: optsChatFontBigger.ele().checked = true; break;
                            default: optsChatFontNormal.ele().checked = true; break;
                        }

                        var optsChatHideScrollbar = SRDotDX.c('#SRDotDX_options_hideScrollbar');
                        optsChatHideScrollbar.ele().checked = SRDotDX.config.hideScrollBar;
                        optsChatHideScrollbar.on('click', function () {
                            SRDotDX.config.hideScrollBar = this.checked;
                            SRDotDX.config.save(false);
                            SRDotDX.gui.chatResize();
                        });

                        var optsHideKongForum = SRDotDX.c('#options_hideKongForum');
                        optsHideKongForum.ele().checked = SRDotDX.config.hideKongForum;
                        optsHideKongForum.on('click', function () {
                            SRDotDX.config.hideKongForum = this.checked;
                            SRDotDX.c('#DotDX_forum').html('div.game_page_wrap {padding-top: 16px; margin-top: 14px !important; background: #333 !important; display: ' + (SRDotDX.config.hideKongForum ? 'none' : 'block') + '}', true)
                        });

                        var optsHideGameDetails = SRDotDX.c('#options_hideGameDetails');
                        optsHideGameDetails.ele().checked = SRDotDX.config.hideGameDetails;
                        optsHideGameDetails.on('click', function () {
                            SRDotDX.config.hideGameDetails = this.checked;
                            SRDotDX.c('#DotDX_details').html('div.game_details_outer {margin-top: 14px !important; width: 900px !important; border: solid 20px #333 !important; display: ' + (SRDotDX.config.hideGameDetails ? 'none' : 'block') + '}', true)
                        });

                        var optsHideGameTitle = SRDotDX.c('#options_hideGameTitle');
                        optsHideGameTitle.ele().checked = SRDotDX.config.hideGameTitle;
                        optsHideGameTitle.on('click', function () {
                            SRDotDX.config.hideGameTitle = this.checked
                        });

                        var optsTrueMsgCount = SRDotDX.c('#options_trueMsgCount');
                        optsTrueMsgCount.ele().checked = SRDotDX.config.kongMsg;
                        optsTrueMsgCount.on('click', function () {
                            SRDotDX.config.kongMsg = this.checked
                        });
                        if (SRDotDX.config.kongMsg) SRDotDX.gui.setMessagesCount();

                        var optsHideGameTab = SRDotDX.c('#options_hideGameTab');
                        optsHideGameTab.ele().checked = SRDotDX.config.hideGameTab;
                        optsHideGameTab.on('click', function () {
                            SRDotDX.config.hideGameTab = this.checked;
                            SRDotDX.gui.applyTabs()
                        });

                        var optsHideAccTab = SRDotDX.c('#options_hideAccTab');
                        optsHideAccTab.ele().checked = SRDotDX.config.hideAccTab;
                        optsHideAccTab.on('click', function () {
                            SRDotDX.config.hideAccTab = this.checked;
                            SRDotDX.gui.applyTabs()
                        });

                        var optsDotdxTabName = SRDotDX.c('#options_dotdxTabName');
                        optsDotdxTabName.ele().value = SRDotDX.config.dotdxTabName;
                        optsDotdxTabName.on('keyup', function () {
                            SRDotDX.config.dotdxTabName = this.value;
                            SRDotDX.gui.applyTabs()
                        });

						var optsFormatChatLinks = SRDotDX.c('#options_formatChatLinks');
						optsFormatChatLinks.ele().checked = SRDotDX.config.formatLinks;
						optsFormatChatLinks.on('click', function(){SRDotDX.config.formatLinks = this.checked;});

						var optsAllianceServer = SRDotDX.c('#options_allianceServer');
						optsAllianceServer.ele().value = SRDotDX.config.allianceServer;
						optsAllianceServer.on('keyup', function(){SRDotDX.config.allianceServer = this.value});

						var optsAllianceName = SRDotDX.c('#options_allianceName');
						optsAllianceName.ele().value = SRDotDX.config.allianceName;
						optsAllianceName.on('keyup', function(){SRDotDX.config.allianceName = this.value; if(SRDotDX.alliance.isActive) document.getElementsByClassName('room_name_container')[0].children[0].innerHTML = this.value;});

						var optsEnableAllianceChat = SRDotDX.c('#options_enableAllianceChat');
						optsEnableAllianceChat.ele().checked = SRDotDX.config.allianceChat;
						optsEnableAllianceChat.on('click', function(){
							if (/^https?:\/\/.+?:\d{2,5}$/.test(SRDotDX.config.allianceServer)) {
								SRDotDX.config.allianceChat = this.checked;
								if (this.checked) SRDotDX.alliance.createRoom();
								else SRDotDX.alliance.destroyChat();
							}
							else this.checked = false;
						});

						var optsClearRMB = SRDotDX.c('#options_clearRMB');
						optsClearRMB.ele().checked = SRDotDX.config.clearRMB;
						optsClearRMB.on('click', function (){SRDotDX.config.clearRMB = this.checked;});

                        var optsChatIgnHide = SRDotDX.c('#SRDotDX_options_ignHide');
                        optsChatIgnHide.on('click', function(){SRDotDX.config.ignMode = 0});
                        var optsChatIgnReplace = SRDotDX.c('#SRDotDX_options_ignReplace');
                        optsChatIgnReplace.on('click', function(){SRDotDX.config.ignMode = 1});
                        var optsChatIgnAttach = SRDotDX.c('#SRDotDX_options_ignAttach');
                        optsChatIgnAttach.on('click', function(){SRDotDX.config.ignMode = 2});
                        switch(SRDotDX.config.ignMode) {
                            case 0: optsChatIgnHide.ele().checked = true; break;
                            case 1: optsChatIgnReplace.ele().checked = true; break;
                            case 2: optsChatIgnAttach.ele().checked = true; break;
                        }

                        var optsChatThemeLightGrey = SRDotDX.c('#theme_lightGrey');
                        optsChatThemeLightGrey.on('click', function(){SRDotDX.gui.applyTheme(0)});
                        var optsChatThemeCrimsonBlack = SRDotDX.c('#theme_crimsonBlack');
                        optsChatThemeCrimsonBlack.on('click', function(){SRDotDX.gui.applyTheme(1)});
                        switch(SRDotDX.config.themeNum) {
                            case 1: optsChatThemeCrimsonBlack.ele().checked = true; break;
                            case 0: optsChatThemeLightGrey.ele().checked = true; break;
                        }

                        var optsWcLeft = SRDotDX.c('#options_wcLeft');
                        optsWcLeft.ele().checked = SRDotDX.config.leftWChat;
                        optsWcLeft.on('click', function(){
                            SRDotDX.config.leftWChat = this.checked;
                            SRDotDX.config.extSave();
                        });

                        var optsWcRemove = SRDotDX.c('#options_wcRemove');
                        optsWcRemove.ele().checked = SRDotDX.config.removeWChat;
                        optsWcRemove.on('click', function(){SRDotDX.gui.removeWC(this.checked)});

                        //Opts -> Sidebar Options
                        var optsSbEnable = SRDotDX.c('#options_sbEnable');
                        optsSbEnable.ele().checked = SRDotDX.config.sbEnable;
                        optsSbEnable.on('click', function () {
                            SRDotDX.config.sbEnable = this.checked;
                            SRDotDX.gui.applySidebarUI(this.checked ? 1 : -1);
                            SRDotDX.config.save(false)
                        });

                        var optsSbRightSide = SRDotDX.c('#options_sbRightSide');
                        optsSbRightSide.ele().checked = SRDotDX.config.sbRightSide;
                        optsSbRightSide.on('click', function () {
                            SRDotDX.config.sbRightSide = this.checked;
                            SRDotDX.gui.applySidebarUI(2);
                            SRDotDX.config.save(false)
                        });

                        //var optsCbDisable = SRDotDX.c('#options_cbDisable');
                        //optsCbDisable.ele().checked = SRDotDX.config.cbDisable;
                        //optsCbDisable.on('click', function(){ SRDotDX.config.cbDisable = this.checked; SRDotDX.config.save(false) });

                        var optsSlimSB = SRDotDX.c('#options_sbSlim');
                        optsSlimSB.ele().checked = SRDotDX.config.sbSlim;
                        optsSlimSB.on('click', function () {
                            SRDotDX.config.sbSlim = this.checked;
                            SRDotDX.config.save(false);
                            SRDotDX.gui.toggleSlimSB();
                        });

                        optsMarkMyRaidsVisited.ele().checked = SRDotDX.config.markMyRaidsVisted;
                        optsFormatLinkOutput.ele().checked = SRDotDX.config.formatLinkOutput;
                        optsMarkImportedVisited.ele().checked = SRDotDX.config.markImportedVisited;
                        optsWhisperTo.ele().value = SRDotDX.config.whisperTo;
                        optsConfirmDeletes.ele().checked = SRDotDX.config.confirmDeletes;
                        SRDotDX.c('#SRDotDX_colors_background').ele().value = SRDotDX.config.bckColor;
                        optsHideVRaids.ele().checked = SRDotDX.config.hideVisitedRaids;
                        optsHideBRaids.ele().checked = SRDotDX.config.hideBotLinks;
                        if (SRDotDX.config.hideRaidLinks) {
                            optsHideARaids.ele().checked = true;
                            optsHideVRaids.ele().disabled = true;
                            optsHideBRaids.ele().disabled = true;
                        }

                        optsConfirmDeletes.on('click', function(){SRDotDX.config.confirmDeletes = this.checked});
                        optsMarkImportedVisited.on("click", function(){SRDotDX.config.markImportedVisited = this.checked;});
                        optsWhisperTo.on("change", function () {
                            console.log("[SRDotDX] Whisper person changed to " + this.value);
                            SRDotDX.config.whisperTo = this.value;
                        });
                        SRDotDX.c('#SRDotDX_colors_background').on("change", function(){SRDotDX.config.bckColor = this.value;});
                        optsFormatLinkOutput.on("click", function(){SRDotDX.config.formatLinkOutput = this.checked;});
                        optsMarkMyRaidsVisited.on("click", function(){SRDotDX.config.markMyRaidsVisted = this.checked;});
                        optsHideARaids.on("click", function(){
                            document.getElementById('SRDotDX_options_hideVisitedRaids').disabled = this.checked;
                            document.getElementById('SRDotDX_options_hideSeenRaids').disabled = this.checked;
                            SRDotDX.config.hideRaidLinks = this.checked;
                            SRDotDX.c('#SRDotDX_raidClass').html('.DotDX_raid {display: ' + (this.checked ? 'none !important' : 'block') + '}', true);
                        }, true);
                        optsHideBRaids.on("click", function(){SRDotDX.gui.switchBot()}, true);
                        optsHideVRaids.on("click", function(){
                            SRDotDX.config.hideVisitedRaids = this.checked;
                            SRDotDX.c('#SRDotDX_visitedRaidClass').html('.SRDotDX_visitedRaid {display: ' + (this.checked ? 'none !important' : 'block') + '}', true);
                        }, true);

                        //CHAT TAB CLICK SCROLL (id=chat_tab, class=chat_message_window)
						document.getElementById('chat_tab').addEventListener("click", function() {
							document.getElementById('lots_tab_pane').style.display = 'none';
                            setTimeout(function(){
                                SRDotDX.gui.scrollChat();
                                SRDotDX.gui.selectRaidsToJoin();
                            }, 50);
                        }, true);

                        //RAIDS TAB CLICK EVENT LISTENER
						document.getElementById('lots_tab').addEventListener("click", function() {
                            setTimeout(SRDotDX.gui.selectRaidsToJoin, 50)
                        }, true);

                        //FriendShare
                        SRDotDX.gui.refreshFriends();

                        // Filtering tab
                        SRDotDX.gui.createFilterTab();

                        var filterChatCb = SRDotDX.c('#SRDotDX_options_perRaidFilterLinks');
                        filterChatCb.on("click", function () {
                            SRDotDX.config.filterChatLinks = this.checked;
                            SRDotDX.gui.toggleFiltering();
                        }, true).ele().checked = SRDotDX.config.filterChatLinks;

                        var filterListCb = SRDotDX.c('#SRDotDX_options_perRaidFilterRaidList');
                        filterListCb.on("click", function () {
                            SRDotDX.config.filterRaidList = this.checked;
                            SRDotDX.gui.toggleFiltering();
                        }, true).ele().checked = SRDotDX.config.filterRaidList;

                        SRDotDX.c('li').set({class: 'rate'}).html('<a class="spritegame" href="http://www.kongregate.com/games/5thPlanetGames/dawn-of-the-dragons" onclick="SRDotDX.reload(); return false;">Reload Game</a>', false).attach('after', 'quicklinks_favorite_block');
                        if(!SRDotDX.config.removeWChat) SRDotDX.c('li').set({id: 'wcbutton', class: 'rate'}).html('<a id="hideWCtxt" class="spritegame" href="http://www.kongregate.com/games/5thPlanetGames/dawn-of-the-dragons" onclick="SRDotDX.gui.hideWC(false); return false;">' + (SRDotDX.config.hideWChat ? 'Show World Chat' : 'Hide World Chat') + '</a>', false).attach('after', 'quicklinks_play_later_block');

                        //Chat buttons overlay div
                        var hd = document.getElementById('chat_window_header').getElementsByClassName('room_name_container')[0].innerHTML;
                        document.getElementById('chat_window_header').getElementsByClassName('room_name_container')[0].innerHTML = hd + '<div class="dotdx_chat_overlay">DotDX: <span id="dotdx_chat_overlay"></span></div>';
                        setTimeout(SRDotDX.gui.BeginDeletingExpiredUnvisitedRaids, 10000);
                        //SRDotDX.util.updateUser(true);
                        window.userInt = setInterval(function(){
                            if(typeof active_user == 'object' && active_user.username().toLowerCase() != 'guest') {
                                SRDotDX.config.kongUser = active_user.username();
                                SRDotDX.config.kongId = active_user.id();
                                SRDotDX.config.kongAuth = active_user.gameAuthToken();
                                console.log("[DotDX] Initialized user: " + SRDotDX.config.kongUser + " | " + SRDotDX.config.kongId);
                                clearInterval(window.userInt);
                            }
                            else console.log("[DotDX] User init failed... trying again");
                        },3000);
                        window.guildInt = setInterval(function(){
                            if( typeof holodeck === 'object' &&
                                typeof holodeck._chat_window === 'object' &&
								typeof holodeck._chat_window._rooms_by_type === 'object' &&
								typeof holodeck._chat_window._rooms_by_type.guild === 'object' &&
								typeof holodeck._chat_window._rooms_by_type.guild._users_list === 'object') {
								clearInterval(window.guildInt);
								SRDotDX.util.createGuildReload();
								SRDotDX.util.getUserList();
								if (SRDotDX.config.allianceChat) SRDotDX.alliance.createRoom();
								if (typeof Array.observe === 'function') Array.observe(holodeck._chat_window._rooms_by_type.guild._users_list, SRDotDX.util.userListChanged);
								else setInterval(SRDotDX.util.getUserList, 600000);
							}
                            else console.log("[DotDX] Guild roster not processed... trying again");
                        },10000);

                        console.log('[DotDX] DotDeXtension loading complete');
                        SRDotDX.gui.doStatusOutput('Loaded successfully', 2000, false);
						setTimeout(function(){delete SRDotDX.gui.load; delete SRDotDX.load},1000);
                        setTimeout(SRDotDX.config.save, 2000);

						//SRDotDX.c('#shim').del();
                    }
                    else {
                        setTimeout(SRDotDX.gui.load, 500)
                    }
                },
                fsEleClick: function (e) {
                    e = e || window.event;
                    var el = e.target.id.split(':');
                    if (el[0] == 'fs') {
                        SRDotDX.config.friendUsers[el[1]][el[2]] = e.target.checked;
                    }
                },
                FPXraidLinkClick: function(id) {
                    if (!SRDotDX.gui.joining) SRDotDX.request.joinRaid(SRDotDX.config.raidList[id]);
                    else SRDotDX.gui.joinRaidList.push(SRDotDX.config.raidList[id]);
                },
                FPXLandButtonHandler: function (ele, name) {
                    var x = name.charAt(name.length - 1), sign = 1;
                    if (name.charAt(3) != 'p')sign = -1;
                    document.FPXLandForm.elements["tf_" + x].value = parseInt(document.FPXLandForm.elements["tf_" + x].value, 10) + (10 * sign);
                    SRDotDX.gui.FPXLandUpdater();
                },
                FPXLandUpdater: function () {
                    var owned = [0, 0, 0, 0, 0, 0, 0, 0, 0], els = document.FPXLandForm, i = 9;
                    while (i--) owned[i] = parseInt(els.elements['tf_' + (i + 1)].value, 10);
                    var ratio = FPX.LandCostRatio(owned), best = 0, cn;
                    i = 9;
                    while (i--) {
                        cn = document.getElementById('b_' + (i + 1)).className;
                        if (cn.indexOf('landpmbutton ') == -1) document.getElementById('b_' + (i + 1)).className = cn.replace('landpmbuttonhigh', 'landpmbutton');
                        //document.getElementById('b_'+(i+1)).prevClassName = 'landpmbutton';
                        if (ratio[i] > ratio[best]) best = i;
                    }
                    cn = document.getElementById('b_' + (best + 1)).className;
                    document.getElementById('b_' + (best + 1)).className = cn.replace('landpmbutton', 'landpmbuttonhigh');
                },
                FPXLandButtonSave: function () {
                    var els = document.FPXLandForm, i = 9;
                    while (i--) SRDotDX.config.FPXLandOwnedCount[i] = els.elements['tf_' + (i + 1)].value;
                    SRDotDX.config.save(false);
                    SRDotDX.gui.doStatusOutput('Land count saved!');
                },
                FPXraidListMouseDown: function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var classtype = e.target.className;
                    e = e || window.event;
                    if (e.which == 1) {
                        switch (classtype) {
                            case 'dotdxRaidListDelete':
                                SRDotDX.gui.deleteRaid(e.target.parentNode);
                                break;
                            case 'DotDX_RaidLink':
                                SRDotDX.gui.FPXraidLinkClick(e.target.parentNode.getAttribute("raidid"));
                                break;
                        }
                    }
                },
                chatWindowContextMenu: function (e) {
                    e = e || window.event;
                    var clickedClass = e.target.className.split(" "), nick = "";
                    console.log('[DotDX] Chat window menu [' + e.target.className + ']');
                    if (clickedClass[0] === 'username' && clickedClass[1] === 'chat_message_window_username') {
                        nick = e.target.getAttribute('dotdxname');
                        var frTxt = SRDotDX.config.friendUsers[nick]?'unFriend':'Friend';
                        var uMenu = document.getElementById(clickedClass[clickedClass.length - 1]);
                        if(uMenu !== null) {
							uMenu.innerHTML = '<span class="user dotdx_name_' + nick + '">' + nick + '</span><span class="user dotdx_friend_' + nick + '">' + frTxt + '</span><span class="user dotdx_slap_' + nick + '">Slap</span><span class="user dotdx_mute_' + nick + '">Mute</span>';
							uMenu.style.maxWidth = "220px";
						}
						e.preventDefault();
						e.stopPropagation();
                    }
					else if(clickedClass[0] === 'chat_input' && SRDotDX.config.clearRMB) {
						e.target.value = '';
						e.preventDefault();
						e.stopPropagation();
					}
                    return false;
                },
                chatWindowMouseDown: function (e) {
                    e = e || window.event;
                    var clickedClass = e.target.className.split(" "), nick = "";
                    //console.log('[DotDX] Chat window (' + e.which + ') [' + e.target.className + ']');
					if(e.which === 1) {
						switch(clickedClass[0]) {
							case 'username':
								if(clickedClass[1] === 'chat_message_window_username')
								{
									e.preventDefault();
									e.stopPropagation();
									nick = e.target.getAttribute('dotdxname');
									console.log("[DotDX] Whisp to user with nick [" + nick + "]");
									if (SRDotDX.alliance.isActive) {
										var txt = document.getElementById('alliance_input');
										txt.value = '/w ' + nick + ' ';
										txt.focus();
									}
									else holodeck.chatWindow().insertPrivateMessagePrefixFor(nick);
								}
								break;
							case 'chatRaidLink':
								e.preventDefault();
								e.stopPropagation();
								var raid = clickedClass[1].split("|");
								var rObj = {id: raid[0], hash: raid[1], boss: raid[2], diff: raid[3], sid: raid[4]};
								if (!SRDotDX.gui.joining) SRDotDX.request.joinRaid(rObj);
								else SRDotDX.gui.joinRaidList.push(rObj);
								break;
							case 'user':
								e.preventDefault();
								e.stopPropagation();
								var classTokens = clickedClass[1].split("_");
								switch (classTokens[1]) {
									case 'slap':
										var num = Math.round((Math.random() * (SRDotDX.slapSentences.length - 1)));
										SRDotDX.gui.FPXdoWork('*' + SRDotDX.slapSentences[num].replace(/<nick>/g, classTokens[2]) + '*');
										break;
									case 'mute':
										SRDotDX.config.mutedUsers[classTokens[2]] = true;
										SRDotDX.config.save(false);
										break;
									case 'friend':
										if (typeof SRDotDX.config.friendUsers[classTokens[2]] == 'object') delete SRDotDX.config.friendUsers[classTokens[2]];
										else SRDotDX.config.friendUsers[classTokens[2]] = [false, false, false, false, true];
										SRDotDX.config.save(false);
										SRDotDX.gui.refreshFriends();
										break;
									case 'name':
										holodeck.showMiniProfile(classTokens[2]);
										break;
								}
								e.target.parentNode.style.maxWidth = "0";
								break;
							default:
								//console.log('[DotDX] Chat window (' + e.which + ') Tag [' + e.target.tagName + ']');
								if (e.target.tagName === 'IMG') {
									var imgSrc =  e.target.getAttribute('src');
									if (/^https?:\/\/.+?\.(png|gif|jpe?g)$/.test(imgSrc)){
										console.log("[DotDX] Open new tab with image: " + imgSrc);
										window.open(imgSrc);
									}
								}
						}
						return false;
					}
                },
                raidListItemUpdate: function (id) {
					var ele = document.getElementById('DotDX_' + id);
					var r = SRDotDX.config.raidList[id];
					if(ele !== null && typeof r === 'object') ele.children[2].innerHTML = (r.visited ? '&#9733;' : '');
                },
                raidListItemRemoveById: function (id) {
                    var ele = document.getElementById('DotDX_' + id);
                    if(ele !== null) ele.parentNode.removeChild(ele);
                },
                toggleCSS: function (p) {
                    if (p) {
                        var ele = document.getElementById(p.id);
                        if(ele !== null) {
                            document.head.removeChild(ele);
                            SRDotDX.c("style").set({ type: "text/css", id: p.id }).text(p.cls).attach("to", document.head);
                        }
                    }
                },
                toggleRaid: function (type, id, tog) {
                    var d = document.getElementsByClassName("DotDX_raidId_" + id);
                    if (typeof SRDotDX.config.raidList[id] === 'object') {
                        var raid = SRDotDX.config.raidList[id];
                        raid = SRDotDX.getRaidDetails("&kv_difficulty=" + raid.diff + "&kv_hash=" + raid.hash + "&kv_raid_boss=" + raid.boss + "&kv_raid_id=" + raid.id);
                    }
                    for(var i = 0, il = d.length; i < il; ++i) {
                        if (tog && d[i].className.indexOf('DotDX_' + type + 'Raid') < 0) d[i].className += ' DotDX_' + type + 'Raid';
                        else if (!tog && d[i].className.indexOf('DotDX_' + type + 'Raid') >= 0) d[i].className = d[i].className.replace(new RegExp('DotDX_' + type + 'Raid( |$)', 'i'), '');
                        if (typeof raid === 'object') d[i].getElementsByTagName('a')[0].innerHTML = raid.linkText();
                    }
                }
            },
			searchPatterns: {
				z1: ['kobold', 'scorp', 'ogre'],
				z2: ['rhino', 'alice', 'lurker'],
				z3: ['4ogre', 'squid', 'batman', 'drag', 'tainted'],
				z4: ['bmane', '3dawg', 'hydra', 'sircai', 'tyranthius'],
				z5: ['ironclad', 'zombiehorde', 'stein', 'bogstench', 'nalagarst'],
				z6: ['gunnar', 'nidhogg', 'kang', 'ulfrik', 'kalaxia'],
				z7: ['maraak', 'erakka_sak', 'wexxa', 'guilbert', 'bellarius'],
				z8: ['hargamesh', 'grimsly', 'rift', 'sisters', 'mardachus'],
				z9: ['mesyra', 'nimrod', 'phaedra', 'tenebra', 'valanazes'],
				'z1_9': ['kobold', 'scorp', 'ogre', 'rhino', 'alice', 'lurker', '4ogre', 'squid', 'batman', 'drag', 'tainted', 'bmane', '3dawg', 'hydra', 'sircai', 'tyranthius', 'ironclad', 'zombiehorde', 'stein', 'bogstench', 'nalagarst', 'gunnar', 'nidhogg', 'kang', 'ulfrik', 'kalaxia', 'maraak', 'erakka_sak', 'wexxa', 'guilbert', 'bellarius', 'hargamesh', 'grimsly', 'rift', 'sisters', 'mardachus', 'mesyra', 'nimrod', 'phaedra', 'tenebra', 'valanazes'],
				'z9.5': ['pumpkin', 'jacksrevenge1'],
				'z9.7': ['hellemental', 'shadow'],
				z10: ['krugnug', 'tomb_gargoyle', 'leonine_watcher', 'centurion_marius', 'caracalla'],
				z14: ['zugen', 'gulkinari', 'verkiteia', 'cannibal_barbarians'],
				z15: ['korxun', 'xerkara', 'shaar', 'nereidon', 'drulcharus'],
				z16: ['bad_blood','way_warden','draconic_dreams','doppelganger'],
				farm: ['maraak', 'erakka_sak', 'wexxa', 'guilbert', 'bellarius', 'drag', 'tainted', 'ogre', 'scorp', 'baroness'],
				flute: ['kobold', 'scorp', 'ogre', 'rhino', 'alice', 'lurker', '4ogre', 'squid', 'batman', 'drag', 'tainted', 'harpy', 'spider', 'djinn', 'evilgnome', 'basilisk', 'roc', 'gladiators', 'chimera', 'crabshark', 'gorgon', 'warewolfpack', 'blobmonster', 'giantgolem'],
				tower: ['thaltherda', 'hurkus', 'malleus', 'yydians_sanctuary', 'clockwork_dragon', 'krxunara', 'karkata', 'corrupted_wilds', 'marble_colossus'],
				small: ['kobold', 'rhino', 'bmane', '4ogre', 'serpina', 'dragons_lair', 'gunnar', 'hargamesh', 'ironclad', 'krugnug', 'maraak', 'thaltherda', 'zugen', 'nereidon', 'mestr_rekkr_rematch', 'ghostly_alchemist', 'master_ninja_bakku','valtrias','bad_blood'],
				medium: ['alice', 'erakka_sak', 'grimsly', '3dawg', 'scorp', 'nidhogg', 'tomb_gargoyle', 'squid', 'tisiphone', 'zombiehorde', 'baroness', 'hurkus', 'gulkinari', 'korxun', 'drunken_ragunt', 'shadow', 'rudaru_the_axe_master','doppelganger'],
				large: ['ogre', 'batman', 'hydra', 'kang', 'leonine_watcher', 'lurker', 'rift', 'stein', 'wexxa', 'teremarthu', 'zralkthalat', 'malleus', 'verkiteia', 'drulcharus', 'gigantomachy', 'green_killers', 'yule_present_bearer','clockwork_giant','blood_dancer'],
				epic: ['bogstench', 'centurion_marius', 'drag', 'tainted', 'guilbert', 'pumpkin', 'jacksrevenge1', 'mesyra', 'nimrod', 'phaedra', 'sircai', 'sisters', 'ulfrik', 'frogmen_assassins', 'burbata', 'yydians_sanctuary', 'grundus', 'shaar', 'tuxargus', 'nylatrix', 'rannveig', 'legion_of_darkness', 'valley_of_death', 'murgrux_the_mangler', 'marble_colossus', 'drakes_fire_elemental'],
				colossal: ['bellarius', 'caracalla', 'kalaxia', 'tyranthius', 'mardachus', 'nalagarst', 'tenebra', 'valanazes', 'siculus', 'ruzzik', 'cannibal_barbarians', 'vortex_abomination', 'xerkara', 'keron', 'clockwork_dragon', 'krxunara', 'hellemental', 'kanehuar_yachu', 'karkata', 'thratus_abomination', 'way_warden', 'faetouched_dragon','vineborn_behemoth','badland_ambusher'],
				gigantic: ['imryx', 'trekex', 'gataalli_huxac', 'kessov_fort', 'corrupted_wilds','draconic_dreams','horthania_stam','jormungan_the_sea_storm_stam', 'euryino'],
				glyph: ['maraak', 'erakka_sak', 'wexxa', 'guilbert', 'bellarius'],
				goblin: ['master_ninja_bakku', 'green_killers'],
				citadel: ['thaltherda', 'hurkus', 'malleus', 'yydians_sanctuary', 'clockwork_dragon', 'krxunara', 'karkata',  'corrupted_wilds', 'marble_colossus'],
				festival: ['vortex_abomination', 'drunken_ragunt', 'mestr_rekkr_rematch', 'valley_of_death', 'green_killers', 'murgrux_the_mangler', 'euryino'],
				aquatic: ['dirthax', 'frogmen_assassins', 'lurker', 'nidhogg', 'crabshark', 'squid', 'thaltherda', 'nereidon', 'krxunara', 'trekex', 'paracoprion', 'bog_bodies','karkata','jormungan_the_sea_storm_stam', 'euryino'],
				beastman: ['bmane', 'burbata', 'frogmen_assassins', 'batman', 'war_boar', 'hargamesh', 'hurkus', 'krugnug', 'malleus', 'scorp', 'ruzzik', 'squid', 'korxun', 'shaar', 'nereidon', 'drulcharus', 'trekex'],
				beasts: ['lurker', 'rhino', '3dawg', 'nidhogg', 'hydra', 'kang', 'wexxa', 'karkata', 'nrlux', 'spider', 'basilisk', 'chimera', 'doomglare', 'roc', 'crabshark', 'dirthax', 'nrlux', 'paracoprion', 'corrupted_wilds'],
				bludheim: ['gunnar', 'nidhogg', 'kang', 'ulfrik', 'kalaxia'],
				colosseum: ['gladiators', 'serpina', 'crabshark', 'tisiphone', 'chimera', 'green_killers', 'marble_colossus','blood_dancer'],
				construct: ['cedric', 'erakka_sak', 'giantgolem', 'leonine_watcher', 'tomb_gargoyle', 'stein', 'yydians_sanctuary', 'clockwork_dragon', 'clockwork_giant', 'thratus_abomination', 'marble_colossus'],
				demon: ['apoc_demon', '3dawg', 'tyranthius', 'lunacy', 'salome', 'sircai', 'blobmonster', 'malchar', 'zralkthalat', 'krxunara', 'adrastos', 'hellemental','valtrias'],
				dragon: ['bellarius', 'corrupterebus', 'dragons_lair', 'echidna', 'drag', 'kalaxia', 'krykagrius', 'mardachus', 'mesyra', 'nalagarst', 'nimrod', 'phaedra', 'rhalmarius_the_despoiler', 'tainted', 'tenebra', 'thaltherda', 'tisiphone', 'grundus', 'valanazes', 'verkiteia', 'winter_kessov', 'xerkara', 'nereidon', 'drulcharus', 'keron', 'tuxargus', 'nylatrix', 'clockwork_dragon', 'imryx', 'draconic_dreams', 'horthania_stam', 'jormungan_the_sea_storm_stam', 'drakes_fire_elemental', 'faetouched_dragon'],
				giant: ['gigantomachy', 'gataalli_huxac', 'kanehuar_yachu','clockwork_giant','aberrant_strength_serum'],
				guild: ['harpy', 'spider', 'djinn', 'evilgnome', 'basilisk', 'roc', 'gladiators', 'chimera', 'crabshark', 'gorgon', 'werewolfpack', 'blobmonster', 'giantgolem', 'slaughterers', 'lunacy', 'felendis', 'agony', 'fairy_prince', 'war_boar', 'dirthax', 'dreadbloom', 'rhalmarius_the_despoiler', 'gladiators', 'krasgore', 'xessus', 'malchar', 'nrlux', 'salome', 'apoc_demon', 'grundus', 'tuxargus', 'nylatrix', 'keron', 'adrastos', 'doomglare', 'darhednal', 'paracoprion', 'bog_bodies', 'clockwork_giant', 'drakes_fire_elemental', 'faetouched_dragon', 'aberrant_strength_serum'],
				human: ['agony', 'rhino', 'gladiators', 'baroness', 'warewolfpack', 'alice', 'cannibal_barbarians', 'guilbert', 'gunnar', 'pumpkin', 'jacksrevenge1', 'lunacy', 'slaughterers', 'ulfrik', 'mestr_rekkr_rematch', 'rannveig', 'adrastos', 'legion_of_darkness', 'yule_present_bearer', 'bad_blood'],
				magical: ['djinn', 'grimsly', 'hargamesh', 'fairy_prince', 'rift', 'sisters', 'vortex_abomination', 'grundus', 'shadow', 'bog_bodies', 'corrupted_wilds','way_warden', 'doppelganger', 'drakes_fire_elemental', 'faetouched_dragon' ,'blood_dancer'],
				ogre: ['ogre', '4ogre', 'felendis', 'zugen', 'korxun', 'drunken_ragunt', 'valley_of_death', 'murgrux_the_mangler'],
				orc: ['darhednal', 'rudaru_the_axe_master', 'green_killers'],
				plant: ['vineborn_behemoth', 'badland_ambusher'],
				oddish: ['vineborn_behemoth', 'badland_ambusher'],
				qwiladrian: ['gulkinari', 'teremarthu', 'vortex_abomination'],
				ryndor: ['bmane', '3dawg', 'hydra', 'sircai', 'tyranthius'],
				siege: ['echidna', 'ulfrik', 'yydians_sanctuary', 'drunken_ragunt', 'kessov_fort'],
				terror: ['euryino'],
				undead: ['agony', 'bogstench', 'serpina', 'ironclad', 'malleus', 'nalagarst', 'stein', 'siculus', 'zombiehorde', 'caracalla', 'centurion_marius', 'ghostly_alchemist'],
				underground: ['maraak', 'erakka_sak', 'wexxa', 'guilbert', 'bellarius', 'spider', 'tomb_gargoyle', 'leonine_watcher', 'centurion_marius', 'caracalla', 'dragons_lair', 'kang', '3dawg', 'lurker', 'salome', 'stein', 'imryx']
			},
			raids: {
				aberrant_strength_serum: {name: 'Aberrant Strength Potion', shortname: 'Strength Potion', id: 'aberrant_strength_serum', type: 'Giant', stat: 'H', size:10, nd:2, duration:24, health: [2000000000,2500000000,3400000000,4000000000,0,0], lt: ['pot','pot','pot','pot']},
				adrastos: {name: 'Adrastos of the Kavala ', shortname: 'Adrastos', id: 'adrastos', type: 'Human, Demon', stat: 'H', size: 101, nd: 5, duration: 192, health: [5000000000, 6250000000, 8750000000, 10000000000, 0, 0], lt: ['keron', 'keron', 'keron', 'keron']},
				agony: {name: 'Agony', shortname: 'Agony', id: 'agony', type: 'Undead, Human', stat: 'H', size: 101, nd: 5, duration: 168, health: [700000000, 875000000, 1120000000, 1400000000, 0, 0]},
				apoc_demon: {name: 'Apocolocyntosised Demon', shortname: 'Apoc', id: 'apoc_demon', type: 'Demon', stat: 'H', size: 50, nd: 3, duration: 144, health: [500000000, 750000000, 1000000000, 2000000000, 0, 0], lt: ['apoc', 'apoc', 'apoc', 'apoc']},
				djinn: {name: 'Al-Azab', shortname: 'Azab', id: 'djinn', type: 'Magical Creature', stat: 'H', size: 100, nd: 4, duration: 168, health: [55000000, 68750000, 88000000, 110000000, 0, 0]},
				spider: {name: 'Arachna', shortname: 'Arachna', id: 'spider', type: 'Underground, Beast', stat: 'H', size: 50, nd: 3, duration: 144, health: [22000000, 27500000, 35200000, 44000000, 0, 0]},
				rhino: {name: 'Ataxes', shortname: 'Ataxes', id: 'rhino', type: 'Human, Beast', stat: 'S', size: 10, nd: 2, duration: 120, health: [2000000, 2500000, 3200000, 4000000, 0, 0]},
				badland_ambusher: {name: 'Badland Ambusher', shortname: 'Badlands', id: 'badland_ambusher', type: 'Plant', stat: 'S', size:500, nd:6, duration:96, health: [225000000000,450000000000,675000000000,900000000000,0,0], lt: ['u','u','u','u']},
				gladiators: {name: 'Batiatus Gladiators ', shortname: 'Gladiators', id: 'gladiators', type: 'Colosseum, Human', stat: 'H', size: 10, nd: 2, duration: 120, health: [12000000, 15000000, 19200000, 24000000, 0, 0]},
				bellarius: {name: 'Bellarius the Guardian', shortname: 'Bellarius', id: 'bellarius', type: 'Dragon, Underground', stat: 'S', size: 500, nd: 6, duration: 96, health: [900000000, 1125000000, 1440000000, 1800000000, 0, 0]},
				bad_blood: {name: 'Bad Blood', shortname: 'Bad Blood', id: 'bad_blood', type: 'Human', stat: 'S', size:30, nd:4, duration:48, health: [8000000000,16000000000,24000000000,32000000000,0,0], lt: ['badb','badb','badb','badb']},
				baroness: {name: 'The Baroness', shortname: 'Baroness', id: 'baroness', type: 'Human', stat: 'S', size: 50, nd: 3, duration: 60, health: [68000000, 85000000, 108800000, 136000000, 0, 0]},
				werewolfpack: {name: 'The Black Moon Pack', shortname: 'Black Moon', id: 'werewolfpack', type: 'Human', stat: 'H', size: 50, nd: 3, duration: 144, health: [135000000, 168750000, 216000000, 270000000, 0, 0]},
				blood_dancer: {name: 'Blood Dancer', shortname: 'Blood Dancer', id: 'blood_dancer', type: 'Magical Creature, Colosseum', stat: 'S', size:100, nd:5, duration:48, health: [50000000000,100000000000,150000000000,200000000000,0,0], lt: ['danc','danc','danc','danc']},
				alice: {name: 'Bloody Alice', shortname: 'Alice', id: 'alice', type: 'Human', stat: 'S', size: 50, nd: 3, duration: 120, health: [15000000, 18750000, 24000000, 30000000, 0, 0]},
				bog_bodies: {name: 'The Bog Bodies', shortname: 'Bog Bodies', id: 'bog_bodies', type: 'Magical Creature, Aquatic', stat: 'H', size:101, nd:5, duration:192, health: [3750000000,7500000000,11250000000,15000000000,0,0], lt: ['keron', 'keron', 'keron', 'keron']},
				bogstench: {name: 'Bogstench', shortname: 'Bogstench', id: 'bogstench', type: 'Undead', stat: 'S', size: 250, nd: 5, duration: 96, health: [450000000, 562500000, 720000000, 900000000, 0, 0]},
				'4ogre': {name: 'Briareus the Butcher', shortname: 'Briareus', id: '4ogre', type: 'Ogre', stat: 'S', size: 10, nd: 2, duration: 72, health: [4500000, 5625000, 7200000, 9000000, 0, 0]},
				bmane: {name: 'Bloodmane', shortname: 'Bloodmane', id: 'bmane', type: 'Beastman, Ryndor', stat: 'S', size: 10, nd: 2, duration: 72, health: [7000000, 8750000, 11200000, 14000000, 0, 0]},
				burbata: {name: 'Burbata the Spine-Crusher', shortname: 'Burbata', id: 'burbata', type: 'Beastman', stat: 'S', size: 250, nd: 5, duration: 96, health: [1000000000, 2000000000, 3500000000, 5000000000, 0, 0], lt: ['z10', 'z10', 'z10', 'z10']},
				cannibal_barbarians: {name: 'Cannibal Barbarians', shortname: 'Cannibals', id: 'cannibal_barbarians', type: 'Human', stat: 'S', size: 500, nd: 6, duration: 128, health: [60000000000, 90000000000, 180000000000, 240000000000, 0, 0], lt: ['canib', 'canib', 'canib', 'canib']},
				cedric: {name: 'Cedric the Smashable', shortname: 'Cedric', id: 'cedric', type: 'Construct', stat: 'ESH', size: 90000, nd: 0, duration: 24, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
				caracalla: {name: 'Caracalla', shortname: 'Caracalla', id: 'caracalla', type: 'Undead, Underground', stat: 'S', size: 500, nd: 6, duration: 128, health: [50000000000, 75000000000, 150000000000, 200000000000, 0, 0], lt: ['cara', 'cara', 'cara', 'cara']},
				harpy: {name: 'Celeano', shortname: 'Celeano', id: 'harpy', type: '', stat: 'H', size: 10, nd: 2, duration: 120, health: [3000000, 3750000, 4800000, 6000000, 0, 0]},
				centurion_marius: {name: 'Centurion Marius', shortname: 'Marius', id: 'centurion_marius', type: 'Undead, Underground', stat: 'S', size: 250, nd: 5, duration: 96, health: [10000000000, 12000000000, 16000000000, 40000000000, 0, 0], lt: ['z10', 'z10', 'z10', 'z10']},
				kobold: {name: 'Chieftain Horgrak', shortname: 'Horgrak', id: 'kobold', type: '', stat: 'S', size: 10, nd: 2, duration: 168, health: [150000, 187500, 240000, 300000, 0, 0]},
				clockwork_dragon: {name: 'Clockwork Dragon', shortname: 'Clock Dragon', id: 'clockwork_dragon', type: 'Construct, Dragon', stat: 'S', size: 500, nd: 6, duration: 128, health: [70000000000, 140000000000, 210000000000, 280000000000], lt: ['clock', 'clock', 'clock', 'clock']},
				clockwork_giant: {name: 'Clockwork Giant',shortname: 'Clockwork Giant',id: 'clockwork_giant', type: 'Construct, Giant', stat: 'H', size:100, nd:4, duration:12, health: [5000000000,10000000000,15000000000,20000000000,0,0], lt: ['cwg','cwg','cwg','cwg']},
				corrupterebus: {name: 'Corrupted Erebus', shortname: 'Cbus', id: 'corrupterebus', type: 'Dragon', stat: 'ESH', size: 90000, nd: 0, duration: 96, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
				corrupted_wilds: {name: 'Corrupted Wilds',shortname: 'Corrupted Wilds',id: 'corrupted_wilds', type: 'Magical Creature, Beast', stat: 'S', size:800, nd:6, duration:128, health: [325000000000,650000000000,975000000000,1300000000000,0,0], lt: ['wlds','wlds','wlds','wlds']},
				serpina: {name: 'Countess Serpina', shortname: 'Serpina', id: 'serpina', type: 'Colosseum, Undead', stat: 'E', size: 15, nd: 2, duration: 5, health: [75000000, 112500000, 150000000, 187500000, 0, 0]},
				darhednal: {name: 'Dar\'Hed\'Nal', shortname: 'Dar\'Hed\'Nal', id: 'darhednal', type: 'Orc', stat: 'H', size: 50, nd: 3, duration: 144, health: [500000000, 1000000000, 1500000000, 2000000000, 0, 0], lt: ['keron', 'keron', 'keron', 'keron']},
				basilisk: {name: 'Deathglare', shortname: 'Deathglare', id: 'basilisk', type: 'Beast', stat: 'H', size: 50, nd: 3, duration: 144, health: [45000000, 56250000, 72000000, 90000000, 0, 0]},
				dirthax: {name: 'Dirthax', shortname: 'Dirthax', id: 'dirthax', type: 'Aquatic, Beast', stat: 'H', size: 100, nd: 4, duration: 168, health: [550000000, 687500000, 880000000, 1100000000, 0, 0]},
				doomglare: {name: 'Doomglare', shortname: 'Doomglare', id: 'doomglare', type: 'Beast', stat: 'H', size: 100, nd: 4, duration: 12, health: [500000000, 1250000000, 2000000000, 3000000000, 0, 0], lt: ['keron', 'keron', 'keron', 'keron']},
				doppelganger: {name: 'Doppelganger', shortname: 'Doppelganger', id: 'doppelganger', type: 'Magical Creature', stat: 'S', size:50, nd:5, duration:60, health: [12000000000,24000000000,36000000000,48000000000,0,0], lt: ['dopp','dopp','dopp','dopp']},
				draconic_dreams: {name: 'Draconic Dreams', shortname: 'D. Dreams',id: 'draconic_dreams', type: 'Dragon', stat: 'S', size:800, nd:6, duration:128, health: [500000000000,1000000000000,1500000000000,2000000000000,0,0], lt: ['drac','drac','drac','drac']},
				dragons_lair: {name: 'Dragons Lair', shortname: 'Lair', id: 'dragons_lair', type: 'Dragon, Underground', stat: 'S', size: 13, nd: 2, duration: 5, health: [100000000, 500000000, 1000000000, 1500000000, 0, 0], lt: ['nDl', 'hDl', 'lDl', 'nmDl']},
				drakes_fire_elemental: {name: 'Drake\'s Fire Elemental', shortname: 'Fire Elemental', id: 'drakes_fire_elemental', type: 'Magical Creature, Dragon', stat: 'H', size:50, nd:5, duration:48, health: [12000000000,16000000000,20000000000,24000000000,0,0], lt: ['fel','fel','fel','fel']},
				drulcharus: {name: 'Drulcharus', shortname: 'Drulcharus', id: 'drulcharus', type: 'Dragon, Beastman', stat: 'S', size: 100, nd: 5, duration: 72, health: [10000000000, 15000000000, 20000000000, 25000000000, 0, 0], lt: ['z15hi', 'z15hi', 'z15hi', 'z15hi']},
				drunken_ragunt: {name: 'Drunken Ragunt', shortname: 'Ragunt', id: 'drunken_ragunt', type: 'Siege, Ogre', stat: 'S', size: 50, nd: 5, duration: 60, health: [8500000000, 14450000000, 18700000000, 25500000000, 0, 0], lt: ['rag', 'rag', 'rag', 'rag']},
				echidna: {name: 'Echidna', shortname: 'Echidna', id: 'echidna', type: 'Dragon, Siege', stat: 'ESH', size: 90000, nd: 0, duration: 96, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
				kessov_fort: {name: 'Engines of War', shortname: 'Engines of War', id: 'kessov_fort', type: 'Siege', stat: 'S', size: 800, nd: 6, duration: 128, health: [300000000000, 600000000000, 900000000000, 1200000000000, 0, 0], lt: ['eow', 'eow', 'eow', 'eow']},
				erakka_sak: {name: 'Erakka-Sak', shortname: 'Erakka-Sak', id: 'erakka_sak', type: 'Underground, Construct', stat: 'S', size: 50, nd: 3, duration: 60, health: [62000000, 77500000, 99200000, 124000000, 0, 0]},
				giantgolem: {name: 'Euphronios', shortname: 'Euphronios', id: 'giantgolem', type: 'Construct', stat: 'H', size: 101, nd: 5, duration: 168, health: [450000000, 562500000, 720000000, 900000000, 0, 0]},
				euryino: {name: 'Euryino, The Fifth Terror', shortname: 'Euryino', id: 'euryino', type: 'Aquatic, Festival, Terror', stat: 'S', size:800, nd:6, duration:96, health: [900000000000,1800000000000,2700000000000,3600000000000,0,0], lt: ['eio','eio','eio','eio']},
				echthros: {name: 'Echthros', shortname: 'Echty', id: 'echthros', type: '', stat: 'ESH', size: 90000, nd: 2, duration: 96, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
				drag: {name: 'Erebus the Black', shortname: 'Erebus', id: 'drag', type: 'Dragon', stat: 'S', size: 250, nd: 5, duration: 168, health: [150000000, 187500000, 240000000, 300000000, 0, 0]},
				faetouched_dragon: {name: 'Faetouched Dragon',shortname: 'Fae Dragon',id: 'faetouched_dragon', type: 'Magical Creature, Dragon', stat: 'H', size:100, nd:6, duration:48, health: [25000000000,33000000000,41000000000,50000000000,0,0], lt: ['fae','fae','fae','fae']},
				frogmen_assassins: {name: 'Frog-Men Assassins', shortname: 'Frog-Men', id: 'frogmen_assassins', type: 'Beastman, Aquatic', stat: 'S', size: 250, nd: 5, duration: 96, health: [16000000000, 24000000000, 32000000000, 64000000000, 0, 0], lt: ['cara', 'cara', 'cara', 'cara']},
				felendis: {name: 'Felendis & Shaoquin', shortname: 'Banhammer', id: 'felendis', type: 'Ogre', stat: 'H', size: 100, nd: 4, duration: 168, health: [441823718, 549238221, 707842125, 888007007, 0, 0]},
				gataalli_huxac: {name: 'Gataalli Huxac', shortname: 'Gataalli', id: 'gataalli_huxac', type: 'Giant', stat: 'S', size: 800, nd: 6, duration: 128, health: [375000000000, 750000000000, 1125000000000, 1500000000000], lt: ['gat', 'gat', 'gat', 'gat']},
				ogre: {name: 'General Grune', shortname: 'Grune', id: 'ogre', type: 'Ogre', stat: 'S', size: 100, nd: 4, duration: 172, health: [20000000, 25000000, 32000000, 40000000, 0, 0]},
				korxun: {name: 'General Korxun', shortname: 'Korxun', id: 'korxun', type: 'Beastman, Ogre', stat: 'S', size: 50, nd: 4, duration: 60, health: [8000000000, 12000000000, 16000000000, 20000000000, 0, 0], lt: ['z15lo', 'z15lo', 'z15lo', 'z15lo']},
				ghostly_alchemist: {name: 'Ghostly Alchemist', shortname: 'Alchemist', id: 'ghostly_alchemist', type: 'Undead', stat: 'S', size: 25, nd: 4, duration: 48, health: [5000000000, 10000000000, 15000000000, 20000000000], lt: ['alch', 'alch', 'alch', 'alch']},
				dreadbloom: {name: 'Giant Dreadbloom', shortname: 'Dreadbloom', id: 'dreadbloom', type: '', stat: 'H', size: 101, nd: 5, duration: 192, health: [900000000, 1125000000, 1440000000, 1800000000, 0, 0]},
				gigantomachy: {name: 'Gigantomachy', shortname: 'Gigantomachy', id: 'gigantomachy', type: 'Giant', stat: 'S', size: 100, nd: 5, duration: 72, health: [25000000000, 50000000000, 75000000000, 100000000000], lt: ['gig', 'gig', 'gig', 'gig']},
				batman: {name: 'Gravlok the Night-Hunter', shortname: 'Gravlok', id: 'batman', type: 'Beastman', stat: 'S', size: 100, nd: 4, duration: 72, health: [50000000, 62500000, 80000000, 100000000, 0, 0]},
				green_killers: {name: 'Green Killers', shortname: 'Green Killers', id: 'green_killers', type: 'Orc, Goblin, Festival, Colosseum', stat: 'S', size: 100, nd: 4, duration: 48, health: [12500000000, 25000000000, 37500000000, 50000000000, 0, 0], lt: ['gk', 'gk', 'gk', 'gk']},
				evilgnome: {name: 'Groblar Deathcap', shortname: 'Groblar', id: 'evilgnome', type: '', stat: 'H', size: 10, nd: 2, duration: 120, health: [6000000, 7500000, 9600000, 12000000, 0, 0]},
				grundus: {name: 'Grundus', shortname: 'Grundus', id: 'grundus', type: 'Dragon, Magical Creature', stat: 'H', size: 101, nd: 5, duration: 72, health: [800000000, 1600000000, 4000000000, 12000000000]},
				guilbert: {name: 'Guilbert the Mad', shortname: 'Guilbert', id: 'guilbert', type: 'Underground, Human', stat: 'S', size: 250, nd: 5, duration: 96, health: [550000000, 687500000, 880000000, 1100000000, 0, 0]},
				gulkinari: {name: 'Gulkinari', shortname: 'Gulkinari', id: 'gulkinari', type: 'Qwiladrian', stat: 'S', size: 50, nd: 4, duration: 60, health: [7500000000, 9375000000, 12000000000, 15000000000, 0, 0], lt: ['gulk', 'gulk', 'gulk', 'gulk']},
				gunnar: {name: 'Gunnar the Berserk', shortname: 'Gunnar', id: 'gunnar', type: 'Bludheim, Human', stat: 'S', size: 10, nd: 2, duration: 48, health: [12000000, 15000000, 19200000, 24000000, 0, 0]},
				war_boar: {name: 'Hammer', shortname: 'Hammer', id: 'war_boar', type: 'Beastman', stat: 'H', size: 50, nd: 3, duration: 144, health: [220000000, 275000000, 352000000, 440000000, 0, 0]},
				hargamesh: {name: 'Hargamesh', shortname: 'Hargamesh', id: 'hargamesh', type: 'Beastman, Magical Creature', stat: 'S', size: 10, nd: 2, duration: 48, health: [18000000, 22500000, 28800000, 36000000, 0, 0]},
				grimsly: {name: 'Headmaster Grimsly', shortname: 'Grimsly', id: 'grimsly', type: 'Magical Creature', stat: 'S', size: 50, nd: 3, duration: 60, health: [72000000, 90000000, 115200000, 144000000, 0, 0]},
				hellemental: {name: 'Hellemental', shortname: 'Hellemental', id: 'hellemental', type: 'Demon', stat: 'S', size: 500, nd: 6, duration: 128, health: [75000000000, 150000000000, 225000000000, 300000000000, 0, 0], lt: ['hell', 'hell', 'hell', 'hell']},
				horthania_stam: {name: 'Horthania the Grey', shortname: 'Horthania', id: 'horthania_stam', type: 'Dragon', stat: 'S', size:800, nd:6, duration:128, health: [500000000000,1000000000000,1500000000000,2000000000000,0,0], lt: ['hort','hort','hort','hort']},
				hurkus: {name: 'Hurkus the Eviscerator', shortname: 'Hurkus', id: 'hurkus', type: 'Beastman', stat: 'S', size: 50, nd: 4, duration: 60, health: [2812500000, 4218750000, 5625000000, 11250000000, 0, 0], lt: ['hurk', 'hurk', 'hurk', 'hurk']},
				hydra: {name: 'Hydra', shortname: 'Hydra', id: 'hydra', type: 'Ryndor, Beast', stat: 'S', size: 100, nd: 4, duration: 72, health: [65000000, 81250000, 104000000, 130000000, 0, 0]},
				imryx: {name: 'Imryx the Incinerator', shortname: 'Imryx', id: 'imryx', type: 'Underground, Dragon', stat: 'S', size: 800, nd: 6, duration: 128, health: [180000000000, 360000000000, 540000000000, 720000000000, 0, 0], lt: ['imx', 'imx', 'imx', 'imx']},
				ironclad: {name: 'Ironclad', shortname: 'Ironclad', id: 'ironclad', type: 'Undead', stat: 'S', size: 10, nd: 2, duration: 48, health: [10000000, 12500000, 16000000, 20000000, 0, 0]}, //0.5/0.625/0.8/1
				pumpkin: {name: 'Jack', shortname: 'Jack', id: 'pumpkin', type: 'Human', stat: 'S', size: 250, nd: 6, duration: 48, health: [1000000000, 1500000000, 2000000000, 3000000000], lt: ['njack', 'hjack', 'ljack', 'nmjack']},
				jacksrevenge1: {name: 'Jack\'s Revenge', shortname: 'Revenge', id: 'jacksrevenge1', type: 'Human', stat: 'S', size: 250, nd: 6, duration: 48, health: [5000000000, 7500000000, 10000000000, 15000000000], lt: ['njr', 'hjr', 'ljr', 'nmjr']},
				jormungan_the_sea_storm_stam: {name: 'Jormungan the Sea-Storm', shortname: 'Jormungan', id: 'jormungan_the_sea_storm_stam', type: 'Dragon, Aquatic', stat: 'S', size:800, nd:6, duration:128, health: [750000000000,1500000000000,2250000000000,3000000000000,0,0], lt: ['jorm','jorm','jorm','jorm']},
				kang: {name: 'Kang-Gsod', shortname: 'Kang', id: 'kang', type: 'Bludheim, Underground, Beast', stat: 'S', size: 100, nd: 4, duration: 72, health: [95000000, 118750000, 152000000, 190000000, 0, 0]},
				'3dawg': {name: 'Kerberos', shortname: 'Kerberos', id: '3dawg', type: 'Demon, Underground, Ryndor, Beast', stat: 'S', size: 50, nd: 3, duration: 72, health: [35000000, 43750000, 56000000, 70000000, 0, 0]},
				keron: {name: 'Keron the Sky-Shaker', shortname: 'Keron', id: 'keron', type: 'Dragon', stat: 'H', size: 101, nd: 6, duration: 192, health: [15000000000, 18750000000, 24000000000, 30000000000, 0, 0], lt: ['keron', 'keron', 'keron', 'keron']},
				kessovtowers: {name: 'Kessov Towers', shortname: 'Towers', id: 'kessovtowers', type: 'Siege', stat: 'ESH', size: 90000, nd: 0, duration: 120, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
				kessovtower: {name: 'Treachery and the Tower', shortname: 'Treachery', id: 'kessovtower', type: 'Siege', stat: 'ESH', size: 90000, nd: 0, duration: 24, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
				kessovforts: {name: 'Kessov Forts', shortname: 'Forts', id: 'kessovforts', type: 'Siege', stat: 'ESH', size: 90000, nd: 0, duration: 120, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
				kessovcastle: {name: 'Kessov Castle', shortname: 'Castle', id: 'kessovcastle', type: 'Siege', stat: 'ESH', size: 90000, nd: 0, duration: 144, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
				kalaxia: {name: 'Kalaxia the Far-Seer', shortname: 'Kalaxia', id: 'kalaxia', type: 'Dragon, Bludheim', stat: 'S', size: 500, nd: 6, duration: 96, health: [800000000, 1000000000, 1280000000, 1600000000, 0, 0]},
				kanehuar_yachu: {name: 'Kanehuar Yachu', shortname: 'Kanehuar Yachu', id: 'kanehuar_yachu', type: 'Giant', stat: 'S', size: 500, nd: 6, duration: 128, health: [100000000000, 200000000000, 300000000000, 400000000000, 0, 0], lt: ['kane', 'kane', 'kane', 'kane']},
				karkata: {name: 'Karkata', shortname: 'Karkata',id: 'karkata', type: 'Aquatic, Beast', stat: 'S', size:500, nd:6, duration:128, health: [95000000000,190000000000,285000000000,380000000000,0,0], lt: ['kark','kark','kark','kark']},
				krugnug: {name: 'Krugnug', shortname: 'Krugnug', id: 'krugnug', type: 'Beastman', stat: 'S', size: 25, nd: 4, duration: 48, health: [1000000000, 1500000000, 2000000000, 4000000000, 0, 0], lt: ['z10', 'z10', 'z10', 'z10']},
				krxunara: {name: 'Kr\'xunara of the Bloody Waves', shortname: 'Kr\'xunara', id: 'krxunara', type: 'Aquatic, Demon', stat: 'S', size: 500, nd: 6, duration: 128, health: [62500000000, 125000000000, 187500000000, 250000000000], lt: ['krx', 'krx', 'krx', 'krx']},
				krykagrius: {name: 'Krykagrius', shortname: 'Krykagrius', id: 'krykagrius', type: 'Dragon', stat: 'ESH', size: 90000, nd: 0, duration: 72, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
				legion_of_darkness: {name: 'Legions of Darkness', shortname: 'Darkness', id: 'legion_of_darkness', type: 'Human', stat: 'S', size: 250, nd: 5, duration: 96, health: [20000000000, 40000000000, 60000000000, 80000000000], lt: ['dark', 'dark', 'dark', 'dark']},
				leonine_watcher: {name: 'Leonine', shortname: 'Leonine', id: 'leonine_watcher', type: 'Underground, Construct', stat: 'S', size: 100, nd: 5, duration: 48, health: [4000000000, 6000000000, 8000000000, 16000000000, 0, 0], lt: ['z10', 'z10', 'z10', 'z10']},
				tyranthius: {name: 'Lord Tyranthius', shortname: 'Tyranthius', id: 'tyranthius', type: 'Demon, Ryndor', stat: 'S', size: 500, nd: 6, duration: 168, health: [600000000, 750000000, 960000000, 1200000000, 0, 0]},
				lunacy: {name: 'Lunatics', shortname: 'Lunatics', id: 'lunacy', type: 'Demon, Human', stat: 'H', size: 50, nd: 3, duration: 144, health: [180000000, 225000000, 288000000, 360000000, 0, 0]},
				lurker: {name: 'Lurking Horror', shortname: 'Lurking Horror', id: 'lurker', type: 'Underground, Aquatic, Beast', stat: 'S', size: 100, nd: 4, duration: 120, health: [35000000, 43750000, 56000000, 70000000, 0, 0]},
				malleus: {name: 'Malleus Vivorum', shortname: 'Malleus', id: 'malleus', type: 'Beastman, Undead', stat: 'S', size: 100, nd: 5, duration: 72, health: [8000000000, 12000000000, 16000000000, 20000000000, 0, 0], lt: ['mall', 'mall', 'mall', 'mall']},
				maraak: {name: 'Maraak the Impaler', shortname: 'Maraak', id: 'maraak', type: 'Underground', stat: 'S', size: 10, nd: 2, duration: 48, health: [15000000, 18750000, 24000000, 30000000, 0, 0]},
				marble_colossus: {name: 'Marble Colossus', shortname: 'Colossus', id: 'marble_colossus', type: 'Construct, Colosseum', stat: 'S', size:250, nd:6, duration:84, health: [30000000000,60000000000,90000000000,120000000000,0,0], lt: ['marb','marb','marb','marb']},
				mardachus: {name: 'Mardachus the Destroyer', shortname: 'Mardachus', id: 'mardachus', type: 'Dragon', stat: 'S', size: 500, nd: 6, duration: 96, health: [1100000000, 1375000000, 1760000000, 2200000000, 0, 0]},
				master_ninja_bakku: {name: 'Master Ninja Bakku', shortname: 'Bakku', id: 'master_ninja_bakku', type: 'Goblin', stat: 'S', size: 25, nd: 4, duration: 48, health: [5500000000, 11000000000, 16500000000, 22000000000, 0, 0], lt: ['bak', 'bak', 'bak', 'bak']},
				scorp: {name: 'Mazalu', shortname: 'Mazalu', id: 'scorp', type: 'Beastman', stat: 'S', size: 50, nd: 3, duration: 168, health: [5000000, 6250000, 8000000, 10000000, 0, 0]},
				mestr_rekkr_rematch: {name: 'Mestr Rekkr Rematch', shortname: 'Rekkr II', id: 'mestr_rekkr_rematch', type: 'Human', stat: 'S', size: 25, nd: 4, duration: 48, health: [6000000000, 9000000000, 13200000000, 18000000000, 0, 0], lt: ['rekkr', 'rekkr', 'rekkr', 'rekkr']},
				mesyra: {name: 'Mesyra the Watcher', shortname: 'Mesyra', id: 'mesyra', type: 'Dragon', stat: 'S', size: 250, nd: 5, duration: 96, health: [1000000000, 1250000000, 1600000000, 2000000000, 0, 0]},
				murgrux_the_mangler: {name: 'Murgrux the Mangler', shortname: 'Murgrux', id: 'murgrux_the_mangler', type: 'Ogre, Festival', stat: 'S', size: 250, nd: 5, duration: 48, health: [25000000000, 50000000000, 75000000000, 100000000000, 0, 0], lt: ['murg', 'murg', 'murg', 'murg']},
				nalagarst: {name: 'Nalagarst', shortname: 'Nalagarst', id: 'nalagarst', type: 'Dragon, Undead', stat: 'S', size: 500, nd: 6, duration: 98, health: [700000000, 875000000, 1120000000, 1400000000, 0, 0]},
				nereidon: {name: 'Nereidon the Sea Slayer', shortname: 'Nereidon', id: 'nereidon', type: 'Dragon, Beastman, Aquatic', stat: 'S', size: 30, nd: 3, duration: 48, health: [6000000000, 9000000000, 12000000000, 15000000000, 0, 0], lt: ['z15lo', 'z15lo', 'z15lo', 'z15lo']},
				nidhogg: {name: 'Nidhogg', shortname: 'Nidhogg', id: 'nidhogg', type: 'Bludheim, Aquatic, Beast', stat: 'S', size: 50, nd: 3, duration: 60, health: [52000000, 65000000, 83200000, 104000000, 0, 0]},
				nimrod: {name: 'Nimrod the Hunter', shortname: 'Nimrod', id: 'nimrod', type: 'Dragon', stat: 'S', size: 250, nd: 5, duration: 96, health: [1200000000, 1500000000, 1920000000, 2400000000, 0, 0]},
				nylatrix: {name: 'Nylatrix', shortname: 'Nylatrix', id: 'nylatrix', type: 'Dragon', stat: 'H', size: 101, nd: 5, duration: 192, health: [2000000000, 2500000000, 3400000000, 4000000000, 0, 0], lt: ['nker', 'hker', 'lker', 'nmker']},
				paracoprion: {name: 'Paracoprion', shortname: 'Paracoprion', id: 'paracoprion', type: 'Aquatic, Beast', stat: 'H', size:101, nd:5, duration:192, health: [2000000000,4000000000,6000000000,8000000000,0,0], lt: ['keron', 'keron', 'keron', 'keron']},
				phaedra: {name: 'Phaedra the Deceiver', shortname: 'Phaedra', id: 'phaedra', type: 'Dragon', stat: 'S', size: 250, nd: 5, duration: 96, health: [1400000000, 1750000000, 2240000000, 2800000000, 0, 0]},
				fairy_prince: {name: 'Prince Obyron', shortname: 'Obyron', id: 'fairy_prince', type: 'Magical Creature', stat: 'H', size: 10, nd: 2, duration: 120, health: [30000000, 37500000, 48000000, 60000000, 0, 0]},
				roc: {name: 'Ragetalon', shortname: 'Ragetalon', id: 'roc', type: 'Beast', stat: 'H', size: 100, nd: 4, duration: 168, health: [110000000, 137500000, 176000000, 220000000, 0, 0]},
				rannveig: {name: 'Rannveig', shortname: 'Rannveig', id: 'rannveig', type: 'Human', stat: 'E', size: 250, nd: 6, duration: 128, health: [15000000000, 30000000000, 45000000000, 60000000000, 0, 0], lt: ['rann', 'rann', 'rann', 'rann']},
				rhalmarius_the_despoiler: {name: 'Rhalmarius the Despoiler', shortname: 'Rhalmarius', id: 'rhalmarius_the_despoiler', type: 'Dragon', stat: 'H', size: 100, nd: 6, duration: 84, health: [500000000, 1250000000, 3125000000, 7812500000, 0, 0]},
				tomb_gargoyle: {name: 'Riddler Gargoyle', shortname: 'Riddler', id: 'tomb_gargoyle', type: 'Underground, Construct', stat: 'S', size: 50, nd: 4, duration: 48, health: [2000000000, 3000000000, 4000000000, 8000000000, 0, 0], lt: ['z10', 'z10', 'z10', 'z10']},
				rift: {name: 'Rift the Mauler', shortname: 'Rift', id: 'rift', type: 'Magical Creature', stat: 'S', size: 100, nd: 4, duration: 72, health: [125000000, 156250000, 200000000, 250000000, 0, 0]},
				rudaru_the_axe_master: {name: 'Rudaru the Axe Master', shortname: 'Rudaru', id: 'rudaru_the_axe_master', type: 'Orc', stat: 'S', size: 50, nd: 4, duration: 48, health: [10500000000, 21000000000, 31500000000, 36750000000, 0, 0], lt: ['rud', 'rud', 'rud', 'rud']},
				ruzzik: {name: 'Ruzzik the Slayer', shortname: 'Ruzzik', id: 'ruzzik', type: 'Beastman', stat: 'S', size: 500, nd: 6, duration: 128, health: [55000000000, 82500000000, 165000000000, 220000000000, 0, 0], lt: ['ruzz', 'ruzz', 'ruzz', 'ruzz']},
				salome: {name: 'Salome the Seductress', shortname: 'Salome', id: 'salome', type: 'Demon, Underground', stat: 'H', size: 100, nd: 4, duration: 48, health: [666000000, 832500000, 1065600000, 1332000000, 0, 0], lt: ['nSlut', 'hSlut', 'lSlut', 'nmSlut']},
				crabshark: {name: 'Scuttlegore', shortname: 'Scuttlegore', id: 'crabshark', type: 'Colosseum, Aquatic, Beast', stat: 'H', size: 100, nd: 4, duration: 168, health: [220000000, 275000000, 352000000, 440000000, 0, 0]},
				squid: {name: 'Scylla', shortname: 'Scylla', id: 'squid', type: 'Beastman, Aquatic', stat: 'S', size: 50, nd: 3, duration: 72, health: [25000000, 31250000, 40000000, 50000000, 0, 0]},
				shaar: {name: 'Shaar the Reaver', shortname: 'Shaar', id: 'shaar', type: 'Beastman', stat: 'S', size: 250, nd: 6, duration: 96, health: [12000000000, 24000000000, 36000000000, 60000000000, 0, 0], lt: ['z15hi', 'z15hi', 'z15hi', 'z15hi']},
				shadow: {name: 'Shadow', shortname: 'Shadow', id: 'shadow', type: 'Magical Creature', stat: 'S', size: 50, nd: 5, duration: 60, health: [10000000000, 17000000000, 25000000000, 35000000000, 0, 0], lt: ['shd', 'shd', 'shd', 'shd']},
				sircai: {name: 'Sir Cai', shortname: 'Sir Cai', id: 'sircai', type: 'Demon, Ryndor', stat: 'S', size: 250, nd: 5, duration: 168, health: [350000000, 437500000, 560000000, 700000000, 0, 0]},
				sisters: {name: 'Sisters of the Song', shortname: 'Sisters', id: 'sisters', type: 'Magical Creature', stat: 'S', size: 250, nd: 5, duration: 96, health: [600000000, 750000000, 960000000, 1200000000, 0, 0]},
				slaughterers: {name: 'Slaughterers Six', shortname: 'Slaughterers', id: 'slaughterers', type: 'Human', stat: 'H', size: 10, nd: 2, duration: 120, health: [24000000, 30000000, 38400000, 48000000, 0, 0]},
				stein: {name: 'Stein', shortname: 'Stein', id: 'stein', type: 'Undead, Underground, Construct', stat: 'S', size: 100, nd: 4, duration: 72, health: [80000000, 100000000, 128000000, 160000000, 0, 0]},
				siculus: {name: 'Count Siculus\' Phantom', shortname: 'Siculus', id: 'siculus', type: 'Undead', stat: 'S', size: 500, nd: 6, duration: 128, health: [850000000, 1700000000, 2975000000, 4250000000, 0, 0], lt: ['sic', 'sic', 'sic', 'sic']},
				tainted: {name: 'Tainted Erebus', shortname: 'Tainted', id: 'tainted', type: 'Dragon', stat: 'S', size: 250, nd: 5, duration: 168, health: [250000000, 312500000, 400000000, 500000000, 0, 0]},
				tenebra: {name: 'Tenebra Shadow Mistress', shortname: 'Tenebra', id: 'tenebra', type: 'Dragon', stat: 'S', size: 500, nd: 6, duration: 128, health: [2000000000, 2500000000, 3200000000, 4000000000, 0, 0]},
				thaltherda: {name: 'Thaltherda the Sea-Slitherer', shortname: 'Thaltherda', id: 'thaltherda', type: 'Aquatic, Dragon', stat: 'S', size: 25, nd: 4, duration: 48, health: [3000000000, 4500000000, 6000000000, 7500000000, 0, 0], lt: ['nessy', 'nessy', 'nessy', 'nessy']},
				thratus_abomination: {name: 'Thratu\'s Abomination',shortname: 'Abomination',id: 'thratus_abomination', type: 'Construct', stat: 'S', size:500, nd:6, duration:128, health: [90000000000,180000000000,270000000000,360000000000,0,0], lt: ['abo','abo','abo','abo']},
				tisiphone: {name: 'Tisiphone the Vengeful', shortname: 'Tisiphone', id: 'tisiphone', type: 'Dragon, Colosseum', stat: 'E', size: 50, nd: 3, duration: 12, health: [500000000, 2500000000, 5000000000, 7500000000, 0, 0], lt: ['nTisi', 'hTisi', 'lTisi', 'nmTisi']},
				teremarthu: {name: 'Teremarthu', shortname: 'Teremarthu', id: 'teremarthu', type: 'Qwiladrian', stat: 'S', size: 100, nd: 5, duration: 48, health: [6000000000, 9000000000, 12000000000, 24000000000, 0, 0], lt: ['z10', 'z10', 'z10', 'z10']},
				chimera: {name: 'Tetrarchos', shortname: 'Tetrarchos', id: 'chimera', type: 'Colosseum, Beast', stat: 'H', size: 50, nd: 3, duration: 144, health: [90000000, 112500000, 144000000, 180000000, 0, 0]},
				gorgon: {name: 'Tithrasia', shortname: 'Tithrasia', id: 'gorgon', type: '', stat: 'H', size: 10, nd: 2, duration: 120, health: [18000000, 22500000, 28800000, 36000000, 0, 0]},
				trekex: {name: 'Trekex\'s Amphibious Assault', shortname: 'Trekex', id: 'trekex', type: 'Aquatic, Beastman', stat: 'S', size: 800, nd: 6, duration: 128, health: [250000000000, 500000000000, 750000000000, 1000000000000], lt: ['trex', 'trex', 'trex', 'trex']},
				tuxargus: {name: 'Tuxargus', shortname: 'Tuxargus', id: 'tuxargus', type: 'Dragon', stat: 'H', size: 101, nd: 5, duration: 192, health: [2000000000, 2500000000, 3400000000, 4000000000, 0, 0], lt: ['nker', 'hker', 'lker', 'nmker']},
				ulfrik: {name: 'Ulfrik', shortname: 'Ulfrik', id: 'ulfrik', type: 'Bludheim, Siege, Human', stat: 'S', size: 250, nd: 5, duration: 96, health: [500000000, 625000000, 800000000, 1000000000, 0, 0]},
				valanazes: {name: 'Valanazes the Gold', shortname: 'Valanazes', id: 'valanazes', type: 'Dragon', stat: 'S', size: 500, nd: 6, duration: 128, health: [2400000000, 3000000000, 3840000000, 4800000000, 0, 0]},
				valley_of_death: {name: 'Valley of Death', shortname: 'Valley of Death', id: 'valley_of_death', type: 'Ogre, Festival', stat: 'S', size: 250, nd: 5, duration: 48, health: [22000000000, 44000000000, 66000000000, 88000000000, 0, 0], lt: ['valley', 'valley', 'valley', 'valley']},
				valtrias: {name: 'Valtrias', shortname: 'Valtrias', id: 'valtrias', type: 'Demon', stat: 'S', size:25, nd:4, duration:48, health: [6250000000, 12500000000, 18750000000, 25000000000, 0, 0], lt: ['val','val','val','val']},
				blobmonster: {name: 'Varlachleth', shortname: 'Varlachleth', id: 'blobmonster', type: 'Demon', stat: 'H', size: 100, nd: 4, duration: 168, health: [330000000, 412500000, 528000000, 660000000, 0, 0]},
				verkiteia: {name: 'Verkiteia', shortname: 'Verkiteia', id: 'verkiteia', type: 'Dragon', stat: 'S', size: 100, nd: 5, duration: 72, health: [11250000000, 14062500000, 18000000000, 22500000000, 0, 0], lt: ['verk', 'verk', 'verk', 'verk']},
				vineborn_behemoth: {name: 'Vineborn Behemoth', shortname: 'Behemoth', id: 'vineborn_behemoth', type: 'Plant', stat: 'S', size:500, nd:6, duration:96, health: [200000000000,400000000000,600000000000,800000000000,0,0], lt: ['bhm','bhm','bhm','bhm']},
				vortex_abomination: {name: 'Vortex Abomination', shortname: 'Vortex', id: 'vortex_abomination', type: 'Qwiladrian, Magical Creature', stat: 'S', size: 500, nd: 6, duration: 128, health: [50000000000, 75000000000, 110000000000, 205000000000, 0, 0], lt: ['vort', 'vort', 'vort', 'vort']},
				zugen: {name: 'Warlord Zugen', shortname: 'Zugen', id: 'zugen', type: 'Ogre', stat: 'S', size: 25, nd: 4, duration: 48, health: [4000000000, 6000000000, 8000000000, 10000000000, 0, 0], lt: ['zugen', 'zugen', 'zugen', 'zugen']},
				way_warden: {name: 'Way Warden', shortname: 'Way Warden', id: 'way_warden', type: 'Magical Creature', stat: 'S', size:500, nd:6, duration:128, health: [115000000000,230000000000,345000000000,460000000000,0,0], lt: ['way','way','way','way']},
				wexxa: {name: 'Wexxa the Worm-Tamer', shortname: 'Wexxa', id: 'wexxa', type: 'Underground, Beast', stat: 'S', size: 100, nd: 4, duration: 72, health: [110000000, 137500000, 176000000, 220000000, 0, 0]},
				winter_kessov: {name: 'Blood Will Run Cold', shortname: 'Cold Blood', id: 'winter_kessov', type: 'Dragon, Siege', stat: 'ESH', size: 90000, nd: 0, duration: 290, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
				xessus: {name: 'Xessus of the Grim Wood', shortname: 'Xessus', id: 'xessus', type: '', stat: 'H', size: 100, nd: 4, duration: 48, health: [500000000, 625000000, 800000000, 1000000000, 0, 0], lt: ['nIns', 'hIns', 'lIns', 'nmIns']},
				malchar: {name: 'Malchar the Tri-Eyed', shortname: 'Malchar', id: 'malchar', type: 'Demon', stat: 'H', size: 100, nd: 4, duration: 48, health: [500000000, 625000000, 800000000, 1000000000, 0, 0], lt: ['nIns', 'hIns', 'lIns', 'nmIns']},
				krasgore: {name: 'Krasgore', shortname: 'Krasgore', id: 'krasgore', type: '', stat: 'H', size: 100, nd: 4, duration: 48, health: [500000000, 625000000, 800000000, 1000000000, 0, 0], lt: ['nIns', 'hIns', 'lIns', 'nmIns']},
				nrlux: {name: 'N\'rlux the Devourer', shortname: 'N\'rlux', id: 'nrlux', type: 'Giant Insect, Beast', stat: 'H', size: 100, nd: 6, duration: 48, health: [10000000000, 12500000000, 16000000000, 20000000000, 0, 0], lt: ['lux', 'lux', 'lux', 'lux']},
				xerkara: {name: 'Xerkara', shortname: 'Xerkara', id: 'xerkara', type: 'Dragon', stat: 'S', size: 500, nd: 6, duration: 128, health: [65000000000, 113750000000, 143000000000, 260000000000, 0, 0], lt: ['z15hi', 'z15hi', 'z15hi', 'z15hi']},
				yule_present_bearer: {name: 'Yule Present Bearer', shortname: 'Present Bearer', id: 'yule_present_bearer', type: 'Human', stat: 'S', size: 100, nd: 5, duration: 48, health: [30000000000, 60000000000, 90000000000, 120000000000, 0, 0], lt: ['yule', 'yule', 'yule', 'yule']},
				yydians_sanctuary: {name: 'Yydian\'s Sanctuary', shortname: 'Yydian', id: 'yydians_sanctuary', type: 'Siege, Construct', stat: 'S', size: 250, nd: 5, duration: 96, health: [10000000000, 20000000000, 30000000000, 50000000000, 0, 0], lt: ['yyd', 'yyd', 'yyd', 'yyd']},
				zombiehorde: {name: 'Zombie Horde', shortname: 'Zombies', id: 'zombiehorde', type: 'Undead', stat: 'S', size: 50, nd: 3, duration: 60, health: [45000000, 56250000, 72000000, 90000000, 0, 0]},
				zralkthalat: {name: 'Z\'ralk\'thalat', shortname: 'Z\'ralk\'thalat', id: 'zralkthalat', type: 'Demon', stat: 'S', size: 100, nd: 4, duration: 72, health: [8750000000, 13125000000, 17500000000, 35000000000, 0, 0], lt: ['z10', 'z10', 'z10', 'z10']}
			},

			raidSizes: {
				10: { name: 'Small', ratios: [0.6, 0.9, 1.2, 1.6, 2.5, 3.5], enames: ['1E6T', '1E8T', '2E', '2/3E', '3E', '3/4E'] },
				13: { name: 'Small' },
				15: { name: 'Small', ratios: [0.45, 0.6, 0.755, 0.9, 1.05, 1.2, 1.35, 1.5, 1.65, 1.8, 1.95], enames: ['65D', '92D', '119D', '146D', '173D', '200D', '227D', '264D', '301D', '338D', '375D'] },
				25: { name: 'Small', ratios: [0.6, 0.9, 1.2, 1.6, 2.5, 3.5], enames: ['1E6T', '1E8T', '2E', '2/3E', '3E', '3/4E'] },
				30: { name: 'Small', ratios: [0.6, 0.9, 1.2, 1.6, 2.5, 3.5], enames: ['1E6T', '1E8T', '2E', '2/3E', '3E', '3/4E'] },
				50: { name: 'Medium', ratios: [0.7, 0.95, 2.05, 3.125, 6.75, 8.5], enames: ['1E6T', '1E8T', '2E', '2/3E', '3E', '3/4E'] },
				100: { name: 'Large', ratios: [0.9, 1.5, 2.2, 3.2, 6.5, 9.0], enames: ['1E6T', '1E8T', '2E', '2/3E', '3E', '3/4E'] },
				101: { name: 'Epic', ratios: [0.225, 0.325, 0.625, 1.775, 4.525, 10.25], enames: ['1E6T', '1E8T', '2E', '2/3E', '3E', '3/4E'] },
				250: { name: 'Epic', ratios: [0.225, 0.325, 0.625, 1.775, 4.525, 10.25], enames: ['1E6T', '1E8T', '2E', '2/3E', '3E', '3/4E'] },
				500: { name: 'Colossal', ratios: [0.45, 0, 0.65, 1.25, 2.5, 9.0], enames: ['1E6T', '1E8T', '2E', '2/3E', '3E', '3/4E'] },
				800: { name: 'Gigantic' },
				90000: { name: 'World' }
			},

			lootTiers: {
				u: { tiers: ['Not yet known'], epics: [0], best: 0},
				eio: { tiers: ['Similar to Jorm + 150b MS'], epics: [0], best: 0},
				bhm: {tiers: [200,300,400,500,600,700,800,900,1000,1250,1500,1750,2000,2250,2500,2750,3000,4000,5000,6000,8000,10000,12500,15000,20000,25000,30000,40000,50000], epics: [4,6,10,14,18,19,23,26,29,32,36,40,44,48,53,60,72,83,98,114,125,136,146,157,177,190,203,0,230], best: 8, e: false},
				pot: { tiers: [50,100,200,300,400,500,750,1000], epics: [1,5,7,10,13,15,17,20], best: 2, e: true },
				danc: { tiers: [250,500,750,1000,1500,2000,2500,3000,3500,4000,5000,8000], epics: [4,14,19,25,30,40,54,63,65,70,90,112], best: 3, e: false },
				fel: { tiers: [200,300,500,750,1000,1500,2000,2500,3000,4000,5000,7500,10000], epics: [8,12,16,21,25,33,42,48,54,63,71,81,90], best: 1, e: false},
				fae: { tiers: [200,300,500,750,1000,1500,2000,2500,3000,4000,5000,7500,10000,15000,20000], epics: [8,12,16,21,25,34,42,49,56,65,74,86,97,116,134], best: 1, e: false},
				hort: { tiers: [200,300,500,1000,1500,2000,2500,3000,4000,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000,25000,30000,40000,50000,60000,75000], epics: [0,1,6,13,22,32,40,48,55,65,70,74,78,86,94,98,105,110,119,126,134,149,200,237,275], best: 7, e: false},
				jorm: { tiers: [200,300,500,1000,1500,2000,2500,3000,4000,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000,25000,30000,40000,50000,60000,70000,80000,90000,100000], epics: [0,1,6,13,22,32,40,48,55,65,70,74,78,86,94,98,105,110,119,126,134,149,200,238,276,315,353,400], best: 7, e: false},
				drac: { tiers: [1000,1500,2000,2500,3000,4000,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000,25000,30000,40000,50000,60000,70000,80000,90000,100000], epics: [15,23,31,40,48,57,65,69,74,78,86,94,98,103,110,117,126,134,150,198,236,273,311,348,398], best: 4, e: false },
				dopp: { tiers: [100,250,500,750,1000,1250,1500,2000,2500], epics: [1,2,7,12,18,20,25,31,35], best: 4, e: false},
				badb: { tiers: [100,250,500,800,1000,1250,1500,2000,2500,5000], epics: [1,2,5,10,13,17,22,26,30,49], best: 6, e: false},
				way: { tiers: [100,200,300,400,500,600,700,800,880,1000,1250,1500,1750,2000,2250,2500,2750,3000,4000,5000,6000,8000,10000,12500,15000,20000,25000], epics: [3,6,7,8,10,11,13,14,15,17,21,25,29,31,37,42,45,50,54,62,70,78,85,95,106,126,136], best: 4, e: false},
				marb: { tiers: [100,200,300,400,500,600,700,800,900,1000,1400,2000], epics: [2,4,6,8,10,12,14,16,18,21,32,43], best: 10, e: false},
				abo: { tiers: [200,300,400,500,600,700,800,900,1000,1250,1500,1750,2000,2250,2500,2750,3000,4000,5000,6000,8000,10000,12500,15000,20000], epics: [6,7,8,10,11,12,13,14,17,21,25,29,33,37,41,45,49,53,60,68,76,83,94,105,126], best: 2, e: false },
				wlds: { tiers: [750,1000,1500,2000,2500,3000,4000,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000,25000,30000,40000], epics: [5,10,15,22,28,37,42,47,52,57,62,67,72,77,82,87,93,100,107,120], best: 5, e: false },
				cwg: { tiers: [100,200,750,1250,1500,2000,2500,3750,5000], epics: [1,2,3,4,5,8,10,12,15], best: 0, e: true },
				val: { tiers: [50,100,250,500,750,1000,1250,1500,2000,2500,5000], epics: [1,2,4,17,21,27,35,44,53,61,99], best: 3, e: false},
				kark: { tiers: [200,300,400,500,600,700,800,900,1000,1250,1500,1750,2000,2250,2500,2750,3000,4000,5000,6000,8000,10000,12500,15000], epics: [8,9,10,11,12,13,14,15,17,20,24,29,32,36,40,44,48,52,59,66,73,80,90,100], best: 2, e: false},
				yule: { tiers: [100,200,300,400,500,750,1000,1500,2000,2500,3000,3500,4000,4500,5000,10000], epics: [0,4,8,10,15,20,30,35,40,50,70,75,80,90,95,125], best: 5, e: true },
				eow: { tiers: [100,200,300,500,1000,1500,2000,2500,3000,4000,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000,25000,30000,35000,40000], epics: [1,2,3,5,10,15,22,28,37,42,47,52,57,63,68,73,78,83,88,95,101,108,115,121], best: 8, e: false },
				gk: { tiers: [150,250,300,400,500,750,1000,1500,2000,2500,3500,5000], epics: [5,6,9,10,12,14,17,23,30,35,49,67], best: 2, e: false },
				murg: { tiers: [150,250,500,750,1000,1500,2000,2500,3000,3500,4000,4500,5000], epics: [0,1,2,5,10,15,31,41,57,67,72,78,87], best: 9, e: false},
				valley: { tiers: [150,250,500,750,1000,1500,2000,2500,3000,3500,4000,4500,5000,6500,8000], epics: [0,1,2,5,10,15,21,35,60,63,67,72,76,84,92], best: 8, e: false},
				bak: { tiers: [100,200,250,300,400,500,650,800,1000,1250,1500,2000], epics: [3,8,10,11,12,15,18,20,26,30,38,47], best: 5, e: false},
				rud: { tiers: [300,500,750,1000,1500], epics: [13,15,17,25,32], best: 1, e: false},
				imx: { tiers: [100,150,200,250,300,400,500,750,1000,1250,1500,1750,2000,2500,3000,3500,4000,4500,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000,25000], epics: [16,21,26,32,38,44,51,69,86,118,142,166,191,239,286,330,355,381,408,435,462,489,516,544,592,640,688,736,815], best: 13, e: false},
				shd: { tiers: [50,75,100,150,200,250,300,500,750,1000], epics: [1,2,5,8,10,12,14,16,19,25], best: 6, e: false},
				hell: { tiers: [200,250,300,500,750,1000,1500,2000,2500,3000,4000,5000,6000,8000,10000], epics: [8,12,16,25,28,34,41,50,58,64,71,77,85,102,120], best: 2, e: false},
				kane: { tiers: [200,250,300,500,750,1000,1500,2000,2500,3000,4000,5000,6000,8000,10000,12500,15000], epics: [6,10,14,21,27,30,37,45,54,62,68,75,81,93,110,127,141], best: 3, e: false},
				dark: { tiers: [200,300,500,750,1000,1500,2000,2500,3000,4000,5000], epics: [2,4,8,14,18,30,40,50,60,75,85], best: 7, e: false},
				gat: { tiers: [1000,1500,2000,2500,3000,4000,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000,25000,30000,40000], epics: [27,48,66,81,94,103,122,132,144,158,176,194,204,209,219,225,242,284,301], best: 2, e: false},
				trex: { tiers: [100,150,200,250,300,400,500,750,1000,1250,1500,1750,2000,2500,3000,3500,4000,4500,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000], epics: [21,28,38,44,47,59,68,94,119,147,179,215,250,308,381,431,498,546,557,593,627,661,691,725,790,861,926,980], best: 14, e: false},
				alch: { tiers: [100,150,200,250,300,400,500,650,800,1000,1250,1500], epics: [4,6,8,9,11,13,15,17,19,20,25,32], best: 5, e: false},
				rann: { tiers: [100,200,300,400,500,600,700,800,900,1000,2000,3000], epics: [12,24,36,48,61,73,85,97,109,122,245,369], best: 9, e: false },
				clock: { tiers: [300,400,750,1000,1500,2000,2500,3000,4000,5000,6000,8000,10000], epics: [56,66,94,118,192,226,254,270,290,360,368,400,460], best: 0, e: false},
				krx: { tiers: [300,400,750,1000,1500,2000,2500,3000,4000,5000,6000,8000], epics: [56,66,94,118,192,226,254,270,290,360,368,400], best: 0, e: false},
				gig: { tiers: [200,300,400,500,750,1000,1500,2000,2500,5000,8000], epics: [36,48,63,76,94,111,146,199,256,400,490], best: 3, e: false},
				rekkr: { tiers: [250,300,400,500,720,1000,1500,2500,3500], epics: [10,11,15,18,23,26,34,37,51], best: 2, e: true},
				rag: { tiers: [225,310,400,510,750,1000,1500,2500,5000], epics: [11,13,17,19,23,27,37,39,61], best: 2, e: true},
				z15lo: { tiers: [225,240,300,400,750,1000,1500,2500,5000], epics: [8,9,14,16,19,23,33,36,48], best: 2, e: true},
				z15hi: { tiers: [225,240,300,400,750,1000,1500,2500,5000,8000], epics: [8,9,14,16,19,23,33,60,90,100], best: 2, e: true},
				apoc: { tiers: [12,24,36,40,60,80,100,120,140,160,180], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true },
				cara: { tiers: [400,500,600,700,800,900,1000,1250,1500,1750,2000,2250,2500,2750,3000], epics: [10,11,12,13,14,15,16,20,24,28,32,36,40,44,48], best: 0, e: true },
				zugen: { tiers: [120,180,225,240,300,400,750,1000,1500], epics: [8,9,10,11,14,16,19,23,33], best: 4, e: true},
				gulk: { tiers: [90,135,150,180,225,300,550,900,1500], epics: [2,5,7,9,11,15,18,22,34], best: 5, e: true },
				verk: { tiers: [100,175,250,300,375,450,525,600,900,1500], epics: [3,8,12,13,15,16,18,21,23,36], best: 2, e: true},
				canib: { tiers: [250,300,380,480,580,660,900,1500,2000,2800,3500], epics: [12,13,14,17,18,21,23,34,46,68,88], best: 0, e: true},
				ruzz: { tiers: [300,400,500,600,700,800,900,1000,1250,1500,1750,2000,2250,2500,2750,3000], epics: [2,5,11,12,13,14,15,16,20,24,28,32,36,40,44,48], best: 2, e: true },
				z10: { tiers: [100,200,300,400,500,600,700,800,900,1000], epics: [7,8,9,10,11,12,13,14,15,16], best: 0, e: true },
				nmDl: { tiers: [105,135,150,225,300,375,450,525,600,675], epics: [2,4,6,8,10,12,14,16,18,20], best: 2, e: true },
				lDl: { tiers: [70,90,100,150,200,250,300,350,400,450], epics: [2,4,6,8,10,12,14,16,18,20], best: 2, e: true },
				hDl: { tiers: [35,45,50,75,100,125,150,175,200,225], epics: [2,4,6,8,10,12,14,16,18,20], best: 2, e: true },
				nDl: { tiers: [7,9,10,15,20,25,30,35,40,45], epics: [2,4,6,8,10,12,14,16,18,20], best: 2, e: true },
				nmTisi: { tiers: [75,105,135,150,225,300,375,450,525,600,675], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true },
				lTisi: { tiers: [50,70,90,100,150,200,250,300,350,400,450], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true },
				hTisi: { tiers: [25,35,45,50,75,100,125,150,175,200,225], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true },
				nTisi: { tiers: [5,7,9,10,15,20,25,30,35,40,45], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true },
				njack: { tiers: [4,20,24,48,72,96,120,144,168,192], epics: [2,3,4,6,7,8,9,10,11,12], best: 0, e: true},
				hjack: { tiers: [6,30,36,72,108,144,180,216,252,288], epics: [2,3,4,6,7,8,9,10,11,12], best: 0, e: true},
				ljack: { tiers: [8,40,48,96,144,192,240,288,336,384], epics: [2,3,4,6,7,8,9,10,11,12], best: 0, e: true},
				nmjack: { tiers: [12,60,72,144,216,288,360,432,504,576], epics: [2,3,4,6,7,8,9,10,11,12], best: 0, e: true},
				hjr: { tiers: [30,150,180,360,750,1500], epics: [8,12,16,27,36,72], best: 0, e: true},
				njr: { tiers: [20,100,120,240,500,1000], epics: [8,12,16,27,36,72], best: 0, e: true},
				ljr: { tiers: [40,200,240,480,1000,2000], epics: [8,12,16,27,36,72], best: 0, e: true},
				nmjr: { tiers: [60,300,360,720,1500,3000], epics: [8,12,16,27,36,72], best: 0, e: true},
				yyd: { tiers: [125,175,250,300,375,450,525,625,900,1500], epics: [3,8,12,13,15,16,18,21,23,36], best: 2, e: true},
				nessy: { tiers: [120,180,225,240,300,500,750,1000], epics: [9,10,11,12,13,14,17,20], best: 1, e: true},
				hurk: { tiers: [90,135,150,180,225,300,550,900], epics: [3,7,10,12,15,19,26,30], best: 2, e: true},
				mall: { tiers: [100,150,225,300,375,450,525,600,900], epics: [3,8,11,12,14,16,18,20,24], best: 1, e: true},
				nIns: { tiers: [5,7,9,10,15,20,25,30,35,40,45], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				hIns: { tiers: [6.250,8.750,11.25,12.50,18.75,25,31.25,37.50,43.75,50,56.25], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				lIns: { tiers: [8,11.20,14.40,16,24,32,40,48,56,64,72], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				nmIns: { tiers: [10,14,18,20,30,40,50,60,70,80,90], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				nker: { tiers: [20,28,36,40,60,80,100,120,140,160,180], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				hker: { tiers: [25,35,45,50,75,100,125,150,175,200,225], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				lker: { tiers: [32,44.80,57.60,64,96,128,160,192,224,256,288], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				nmker: { tiers: [40,56,72,80,120,160,200,240,280,320,360], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				nSlut: { tiers: [6.660,9.324,11.99,13.32,19.98,26.64,33.30,39.96,46.62,53.28,59.94], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				hSlut: { tiers: [8.325,11.66,14.99,16.65,24.98,33.30,41.63,49.95,58.28,66.60,74.93], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				lSlut: { tiers: [10.66,14.92,19.18,21.31,31.97,42.62,53.28,63.94,74.59,85.25,95.90], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				nmSlut: { tiers: [13.32,18.65,23.98,26.64,39.96,53.28,66.60,79.92,93.24,106.6,119.9], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				sic: { tiers: [400,500,600,700,800,900,1000,2000], epics: [10,11,12,13,14,15,16,32], best: 0, e: true},
				vort: { tiers: [200,300,400,500,600,700,800,900,1000,1500,2000,2500,3000,3500], epics: [3,10,14,15,17,18,21,23,32,37,44,52,58,90], best: 1, e: true},
				lux: { tiers: [8,17,26,35,45,56,67,78,90,103,116,129,143,157,173,188,202,220,238,255,270,293,311,330,350], epics: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26], best: 9, e: true },
				keron: { tiers: [8,17,26,35,45,56,67,78,90,103,116,129,143,157,173,188,202,220,238,255,270,293,311,330,350,1000], epics: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,30], best: 9, e: true }
			},
			camps: {
				bob: {name: 'Bastion of Blood', time: [120, 96], prefixes: 'Regenerating, Morphling, Vengeful, Chilling', numNodes: 6, nodes: ['bmp', 'gor', 'chi', 'zh', 'sic', 'bob'],
					mods: ['Speed Run: halved camp timer, +20% guild rep from EoC', 'Hailstorm: +1 prefix, +20% guild exp from EoC', 'Nerfed: -30% player damage, special loot from EoC'],
					tiers: [[5, 31, 0],[25, 32, 0],[75, 33, 0],[100, 34, 0],[200, 35, 7],[250, 36, 8],[320, 37, 9],[375, 38, 10],[480, 39, 11],[550, 43, 14],[640, 46, 17],[960, 48, 22],[1500, 50, 24],[2400, 53, 26],[2750, 55, 29],[5000, 62, 38],[7000, 64, 42],[10000, 69, 47],[15000, 74, 52]],
					bmp: {name: 'Black Moon Pack', sname: 'Bmp', type: 'Human, Campaign', size: 25, hp: [6000, 18000], gold: false,                         tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]},
					gor: {name: 'Gorgon', sname: 'Gor', type: 'Campaign', size: 50, hp: [12000, 36000], gold: false,                                        tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]},
					chi: {name: 'Chimera', sname: 'Chi', type: 'Campaign', size: 75, hp: [28000, 84000], gold: false,                                       tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]},
					zh: {name: 'Zombie Horde', sname: 'ZH', type: 'Campaign, Undead', size: 100, hp: [50000, 150000], gold: false,                          tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]},
					sic: {name: 'Byron Siculus', sname: 'Sic', type: 'Campaign', size: 100, hp: [50000, 150000], gold: true,                                tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]},
					bob: {name: 'Bastion of Blood', sname: 'BoB', type: 'Campaign, Undead, Siege', size: 100, hp: [50000, 150000], gold: false,             tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}},
				mam: {name: 'Monsters and Magma', time: [120, 96], prefixes: 'Regenerating, Vengeful, Chilling, Curse', numNodes: 7, nodes: ['wlp', 'tos', 'gol', 'ele', 'gmh', 'wrm', 'imx'],
					mods: ['Speed Run: halved camp timer, +20% guild rep from EoC', 'Hailstorm: +1 prefix, +20% guild exp from EoC', 'Fatigued: -45% player damage, special loot and +3 slots from EoC', 'Endurance Run: Node timer set to 4h, Molten Troves in EoC'],
					tiers: [[5, 31, 0],[25, 32, 0],[75, 33, 0],[100, 34, 0],[200, 35, 7],[250, 36, 8],[320, 37, 9],[375, 38, 10],[480, 39, 11],[550, 40, 12],[640, 41, 13],[960, 42, 14],[1500, 43, 15],[2400, 44, 16],[2750, 45, 17],[4500, 58, 24],[5000, 62, 38],[5500, 64, 26],[7000, 64, 42],[7500, 74, 28],[10000, 69, 47],[15000, 74, 52]],
					wlp: {name: 'Imryx\'s Whelps', sname: 'Wlp', type: 'Dragon, Underground, Campaign', size: 25, hp: [7000, 21000], gold: false,           tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0]},
					tos: {name: 'Magma Tossers', sname: 'Tos', type: 'Underground, Construct, Campaign', size: 50, hp: [13000, 39000], gold: false,         tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0]},
					gol: {name: 'Magma Golem', sname: 'Gol', type: 'Underground, Construct, Campaign', size: 50, hp: [16000, 48000], gold: true,            tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0]},
					ele: {name: 'Magma Elemental', sname: 'Ele', type: 'Underground, Magical Creature, Campaign', size: 75, hp: [30000, 90000], gold: false,tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0]},
					gmh: {name: 'Grt. Magma Horror', sname: 'Gmh', type: 'Campaign, Undead', size: 100, hp: [55000, 165000], gold: false,                   tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1]},
					wrm: {name: 'Magma Worm', sname: 'Wrm', type: 'Underground, Campaign', size: 100, hp: [60000, 180000], gold: true,                      tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1]},
					imx: {name: 'Imryx the Incinerator', sname: 'Imx', type: 'Dragon, Underground, Campaign', size: 100, hp: [65000, 195000], gold: false,  tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0]}},
				gd: {name: 'The Grey Death', time: [120, 96], prefixes: 'Regenerating, Vengeful, Chilling, Curse', numNodes: 6, nodes: ['crk', 'zrn', 'nun', 'tms', 'crn', 'hrt'],
					mods: ['Speed Run: halved camp timer, +20% guild rep from EoC', 'Hailstorm: +1 prefix, +20% guild exp from EoC', 'Fatigued: -45% player damage, special loot and +3 slots from EoC'],
					tiers: [[25, 31, 0],[100, 34, 0],[200, 36, 6],[300, 38, 9],[500, 40, 14],[750, 42, 16],[1000, 45, 18],[2500, 48, 21],[4100, 50, 25],[6500, 58, 29],[6500, 54, 27],[8500, 62, 31],[8500, 63, 32],[10000, 64, 33],[15000, 66, 35],[20000, 68, 37],[30000, 70, 39],[40000, 73, 41]],
					crk: {name: 'Carshk the Marauder', sname: 'Crk', type: 'Campaign', size: 25, hp: [8000, 25600], gold: false,                            tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0]},
					zrn: {name: 'Zranras', sname: 'Zrn', type: 'Campaign, Beastman', size: 50, hp: [15000, 48000], gold: false,                             tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0]},
					nun: {name: 'General Nund', sname: 'Nun', type: 'Campaign, Ogre', size: 50, hp: [20000, 50000], gold: false,                            tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0]},
					tms: {name: 'Thurmavus the Ripper', sname: 'Tms', type: 'Campaign, Dragon', size: 100, hp: [75000, 202500], gold: false,                tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1]},
					crn: {name: 'Craenaestra the Stalker', sname: 'Crn', type: 'Campaign, Dragon', size: 100, hp: [80000, 224000], gold: true,              tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1]},
					hrt: {name: 'Horthania the Grey', sname: 'Hrt', type: 'Campaign, Dragon', size: 100, hp: [90000, 270000], gold: false,                  tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1]}},
				goc: {name: 'Giants of Chalua', time: [120, 96], prefixes: 'Regenerating, Vengeful, Chilling, Curse', numNodes: 6, nodes: ['mwm', 'bl', 'gh', 'fgs', 'gc', 'ha'],
					mods: ['Speed Run: halved camp timer, +20% guild rep from EoC', 'Hailstorm: +1 prefix, +20% guild exp from EoC', 'Fatigued: -45% player damage, Boss loot from EoC', 'Endurance Run: Node timer set to 4h, 10 guild tokens in EoC'],
					tiers: [[25, 32, 0, 0],[150, 34, 0, 0],[250, 35, 7, 0],[480, 39, 11, 0],[640, 41, 16, 0],[960, 42, 18, 1],[1500, 43, 19, 1],[2500, 45, 21, 3],[4750, 48, 25, 4],[5500, 52, 27, 5],[6400, 54, 29, 5],[8750, 56, 31, 6],[10000, 58, 34, 6],[15000, 60, 38, 8],[25000, 64, 44, 9],[30000, 66, 46, 9],[35000, 68, 48, 9],[40000, 70, 50, 9],[50000, 74, 56, 10]],
					mwm: {name: 'Monkey Warrior Minions', sname: 'MWM', type: 'Human, Campaign', size: 25, hp: [15000, 45000], gold: false,                 tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]},
					bl: {name: 'Basileus Lizard', sname: 'BL', type: 'Campaign', size: 50, hp: [25000, 75000], gold: false,                                 tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]},
					gh: {name: 'Giant Hunter', sname: 'GH', type: 'Giant, Campaign', size: 75, hp: [55000, 165000], gold: false,                            tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0]},
					fgs: {name: 'Fire Giant Shaman', sname: 'FGS', type: 'Giant, Campaign', size: 100, hp: [100000, 250000], gold: false,                   tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0]},
					gc: {name: 'Giant Cook', sname: 'GC', type: 'Giant, Campaign', size: 100, hp: [125000, 312500], gold: true,                             tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0]},
					ha: {name: 'Hitullpa Aatqui', sname: 'HA', type: 'Giant, Campaign', size: 100, hp: [150000, 375000], gold: false,                       tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1]}},
				fw: {name: 'The Frozen War', time: [120, 96], prefixes: 'Frighten Mount, Ethereal, Trample, Intimidate, Vulnerable, Vengeful, Chilling, Curse', numNodes: 6, nodes: ['ur', 'fe', 'nsg', 'bsn', 'bsh', 'eiw'],
					mods: ['Speed Run: halved camp timer, +20% guild rep from EoC', 'Hailstorm: +1 prefix, +20% guild exp from EoC', 'Fatigued: -45% player damage, Extra loot from EoC', 'Endurance Run: Node timer set to 4h, 10 guild tokens in EoC'],
					tiers: [[25, 32, 0, 0],[150, 34, 0, 0],[250, 35, 7, 0],[480, 39, 11, 0],[640, 41, 16, 0],[960, 42, 18, 1],[1500, 86, 38, 1],[2500, 90, 42, 3],[4750, 96, 50, 4],[5500, 104, 54, 5],[6400, 108, 58, 5],[8750, 112, 62, 6],[10000, 116, 68, 6],[15000, 120, 76, 8],[10000, 112, 62, 6],[15000, 116, 68, 8],[25000, 120, 76, 9],[30000, 132, 92, 9],[35000, 136, 96, 9],[40000, 140, 100, 9],[50000, 150, 112, 9]],
					ur: {name: 'Ursine Raiders', sname: 'UR', type: 'Aquatic, Human, Campaign', size: 25, hp: [18000, 54000], gold: false,                  tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0]},
					fe: {name: 'Frost Elemental', sname: 'FE', type: 'Aquatic, Magical Cereature, Campaign', size: 50, hp: [28000, 84000], gold: false,     tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0]},
					nsg: {name: 'Northern Sea Giant', sname: 'NSG', type: 'Aquatic, Giant, Campaign', size: 100, hp: [105000, 262500], gold: false,         tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0]},
					bsn: {name: 'Konguar, Giant King & Jormungan the Sea-Storm (Normal)', sname: 'BSN', type: 'Aquatic, Dragon, Giant, Campaign', size: 100, hp: [160000, 400000], gold: false, tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], epics: [0,0,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1]},
					bsh: {name: 'Konguar, Giant King & Jormungan the Sea-Storm (Hard)', sname: 'BSH', type: 'Aquatic, Dragon, Giant, Campaign', size: 100, hp: [160000, 400000], gold: false, tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], epics: [0,0,0,0,0,1,1,1,2,2,3,0,0,0,3,4,4,5,5,6,6]},
					eiw: {name: 'Elvigar the Ice Waver', sname: 'EIW', type: 'Aquatic, Undead, Campaign', size: 100, hp: [170000, 425000], gold: true,      tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], epics: [0,0,0,0,0,1,1,1,1,1,2,0,0,0,3,4,5,6,7,8,10]}}
			},
            linkNames: { 'prntscr.com': 'LightShot', 'www.youtube.com': 'YouTube', 'i.imgur.com': 'imgur', 'imgur.com': 'imgur', 'docs.google.com': 'Google Docs', 'userscripts.org': 'Script', 'www.dawnofthedragons.com': 'DotD Forum', 'dotd.wikia.com': 'DotD Wiki', 'www.fooby.de': 'DotD Log Analyzer'},
            //raidArray: [],
            slapSentences: [
                'slaps <nick> in the face with a rotten old fish',
                'slaps <nick> around with a glove',
                'slaps <nick> around with an armoured glove',
                'hacks into <nick>\'s computer and slaps <nick> up side the head with a rubber chicken',
                'slaps <nick> around a bit with a wet noddle',
                'slaps <nick> about the head and shoulders with a rubber chicken',
                'slaps <nick>\'s face so hard, <nick> has to walk backwards from now on',
                'slaps some sense into <nick> with a red brick',
                'slaps <nick> with a herring',
                'slaps <nick> with a fire hose',
                'slaps <nick> with a huge law suit',
                'slaps <nick> with a great big, wet, 100% rubber duck',
                'slaps <nick> with a large dildo'
            ],
            reload: function () { SRDotDX.util.extEcho('Reloading, please wait...'); activateGame(); },
            gframe: function(msg) { if(typeof document.getElementById('gameiframe') === 'object' && typeof document.getElementById('gameiframe').contentWindow === 'object') document.getElementById('gameiframe').contentWindow.postMessage(msg, '*'); },
            fails: 0,
            load: function () {
                if (typeof holodeck === 'object' && holodeck.ready && typeof ChatDialogue === 'function' && typeof activateGame === 'function' && typeof jQuery === 'function') {
                    ChatDialogue.prototype.sendInput = function () {
						//workaround for broken raid links - fixing on the fly
                        var b = this._input_node.value.replace(/kv_&/ig, "&kv_");
                        var a = b.match(/(?:.|\n){1,240}(\b|$)/g);
                        if(a !== null) {
							var al = a.length - 1, i;
							if (al < 1 || this._input_node.value.charAt(0) == '/') this._holodeck.processChatCommand(a[0]) && this._holodeck.filterOutgoingMessage(a[0], this._onInputFunction);
							else {
								var msg, tout = 50;
								for(i = 0; i <= al; i++) {
									msg = (i == 0 ? '' : '... ') + a[i] + (i == al ? '' : '...');
									(function (a, b) {
										return SRDotDX.gui.FPXTimerArray[i] = setTimeout(function(){b._holodeck.filterOutgoingMessage(a,b._onInputFunction)},tout);
									})(msg, holodeck._active_dialogue);
									tout += 500;
								}
							}
						}
                        this._input_node.value = "";
                    };
                    ChatDialogue.prototype.SRDotDX_emote = function (msg) {
                        var user = holodeck._active_user.chatUsername();
                        this.displayUnsanitizedMessage(user, '**' + user + ' ' + msg + '**', {class: 'emote'}, {});
                    };
                    ChatDialogue.MESSAGE_TEMPLATE = new Template('<p class="#{classNames}"><span id="dotdm_#{magId}" class="slider" style="max-width:0" onmouseleave="this.style.maxWidth=\'0\'"></span><span class="timestamp">#{timestamp}</span><span class="room">#{room}</span></span><span class="username #{userClassNames} dotdm_#{magId}" username="#{username}" dotdxname="#{dotdxusr}" oncontextmenu="return false;">#{prefix}#{user}</span><span class="ign ingamename">#{ign}</span><span class="separator">: </span><span name="SRDotDX_#{dotdxusr}" class="message">#{message}</span><span class="clear"></span></p>');

                    Holodeck.prototype.addDotdChatCommand = function (a, b) {
                        a = a.split(',');
                        for (var i = 0; i < a.length; i++) {
                            this._chat_commands[a[i]] || (this._chat_commands[a[i]] = []);
                            this._chat_commands[a[i]].push(b)
                        }
                    };
                    ChatDialogue.prototype.displayUnsanitizedMessage = function (usr, msg, cls, pfx) {
                        cls || (cls = {});
                        pfx || (pfx = {});
                        var active_room, allow_mutes = (active_room = this._holodeck.chatWindow().activeRoom()) && !active_room.canUserModerate(active_room.self()) || pfx.whisper;
                        if (!allow_mutes || !this._user_manager.isMuted(usr)) {
                            var e = !pfx.non_user ? "chat_message_window_username" : "chat_message_window_undecorated_username";
                            var f = usr == this._user_manager.username(), h = [], rm = '';
                            var curTs = new Date().getTime().toString();
							var kongUsr = usr;
                            if (msg.charAt(0) == '[' && (msg.charAt(2) == '|' || msg.charAt(3) == '|')) {
                                var sp = msg.split(']');
                                rm = sp[0].split('|')[0] + ']&ensp;';
                                usr = sp[0].split('|')[1];
                                msg = sp[1];
                                h.push('bot')
                            }
							var trueUsr = usr;
                            e = [e];
                            pfx = pfx['private'] ? 'To ' : '';
                            if (cls['class'] != 'script') this._messages_count % 2 && h.push("even"), this._messages_count++;
                            cls['class'] && h.push(cls['class']);
                            if ((!cls['class'] || cls['class'].indexOf('emote') == -1) && msg.charAt(0) == '*' && msg.charAt(2) != '*') {
                                var msgLen = msg.length;
                                if (msgLen > 5) {
                                    msg = '**' + usr + ' ' + (msg.charAt(msgLen - 1) == '*' ? msg.slice(1, msgLen - 1) : msg.slice(1, msgLen)) + '**';
                                    h.push('emote');
                                }
                            }
                            var rUsr = h.join(' ').indexOf('sent_whisper') > -1 ? this._user_manager.username() : usr;
                            var raid = SRDotDX.getRaidLink(msg, rUsr);
                            if (raid) {
                                h.push('DotDX_raid');
                                h.push('DotDX_sid_' + raid.sid);
                                h.push('DotDX_diff_' + raid.diff);
                                h.push('DotDX_raidId_' + raid.id);
                                if (raid.visited) h.push('DotDX_visitedRaid');
                                h.push('DotDX_fltChat_' + raid.boss + '_' + (raid.diff - 1));
                                msg = raid.ptext + '<a href="' + raid.url + '" class="chatRaidLink ' + raid.id + '|' + raid.hash + '|' + raid.boss + '|' + raid.diff + '|' + raid.sid + '" style="float:right;" onmouseout="SRDotDX.gui.helpBox(\'chat_raids_overlay\',\'dotdm_' + curTs + '\',\'\',true);" onmouseover="SRDotDX.gui.helpBox(\'chat_raids_overlay\',\'dotdm_' + curTs + '\',' + raid.id + ',false);">' + raid.linkText() + '</a>' + raid.ntext;
                                SRDotDX.gui.toggleRaid('visited', raid.id, raid.visited);
                                SRDotDX.gui.joining ? SRDotDX.gui.pushRaidToJoinQueue(raid.id) : SRDotDX.gui.selectRaidsToJoin('chat');
                            }
                            else {
                                //var linkReg = /((?:ht|(?:t|s)?f)tps?\:(?:\/\/))?((?:[a-z\d\-\_]+?\.)+[a-z]{2,4}\b|\b(?:[1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?:\.(?:[0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3}\b)((?:\/[\w\/\.\-\,\:\%\#\=]+)?(?:\/?\?[\w\-\#\:\?\=\&\.\;]*|\/?\#(?:\w+)?)?\b)?/g;
								var linkReg = /(?:^|\s|,|;)(((?:ht|(?:t|s)?f)tps?:(?:\/\/))([\w\.\-]{4,}[a-z0-9])([\w\/\?\.\-=&#:;%()!]*[\w#;)])?)/g;
								var links, link, lname, lidx, found = false;
                                while((links = linkReg.exec(msg))) {
									found = true;
                                    console.log('[DotDX] Link found: ' + msg);
                                    if(!/kongregate.com/i.test(links[1]) && !/\.\./.test(links[1])){
										link = links[1].replace(/&amp;/ig,'&').replace(/&nbsp;/ig,'');
										lname = SRDotDX.config.formatLinks ? (SRDotDX.linkNames[links[3]] ? ('['+SRDotDX.linkNames[links[3]]+']') : links[3]) : link;
                                        link = '<a href="' + link + '" target="_blank" class="chat_link">' + lname + '</a>';
										linkReg.lastIndex += link.length - links[1].length;
										lidx = links.index + links.indexOf(links[1]);
                                        msg = msg.substring(0, lidx) + link + msg.substring(lidx + links[1].length, msg.length);
                                    }
                                }
								if(found) SRDotDX.linksHistory.push({t:new Date().getTime(), u:usr, m:msg});
                            }
                            var ign = '';
                            if (SRDotDX.config.mutedUsers[usr]) h.push('DotDX_hidden');

                            var fCls = h.join(' ');
                            if (SRDotDX.config.ignUsers[usr] && SRDotDX.config.ignUsers[usr].ign !== '*unknown*' && fCls.indexOf('emote') < 0) {
                                switch(SRDotDX.config.ignMode) {
                                    case 2: ign = ' ('+SRDotDX.config.ignUsers[usr].ign+')'; break;
                                    case 1: usr = SRDotDX.config.ignUsers[usr].ign; e.push('ign'); break;
                                }
                            }
                            var ts = fCls.indexOf('emote') > -1 || fCls.indexOf('script') > -1 ? '' : ('(' + ('0' + (new Date().getHours())).slice(-2) + ':' + ('0' + (new Date().getMinutes())).slice(-2) + ')&ensp;');
                            f && e.push('is_self');

                            usr = ChatDialogue.MESSAGE_TEMPLATE.evaluate({prefix: pfx, user: usr, username: kongUsr, dotdxusr: trueUsr, ign: ign, message: msg, classNames: fCls, userClassNames: e.join(' '), timestamp: ts, room: rm, magId: curTs });
                            this.insert(usr);
                        }
                    };
                    ChatRoomGroup.prototype.buildRegularRoomNode = function (a) {
                        var b = new Element("li", {"class": 0 === i % 2 ? "even room" : "odd room"});
                        b.room = a;
                        var c = (new Element("p", {"class": "name"})).update(a.name);
                        a.premium_only && (active_user.isPremium() || c.addClassName("upsell"), c.addClassName("premium_room_icon spritesite"));
                        b.insert(c);
                        b.insert((new Element("p", {"class": "user_count" + (a.joinable ? "" : " full")})).update(a.total_user_count));
                        b.insert(new Element("div", {style: "clear:both;"}));
                        return b
                    };
					jQuery.ajax = (function(_ajax){
						var protocol = location.protocol, hostname = location.hostname, exRegex = new RegExp(protocol + '//' + hostname),
							YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?', query = 'select * from html where url="{URL}" and xpath="*"';
						function isExternal(url) { return !exRegex.test(url) && /:\/\//.test(url); }
						return function(o) {
							var url = o.url;
							if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
								o.url = YQL; o.dataType = 'json';
								o.data = { q: query.replace( '{URL}', url + (o.data ? (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data) : '') ), format: 'xml' };
								if (!o.success && o.complete) { o.success = o.complete; delete o.complete; }
								o.success = (function(_success){ return function(data) { if (_success) { _success.call(this, { responseText: data.results[0].replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '') }, 'success'); } }; })(o.success);
							}
							return _ajax.apply(this, arguments);
						};
					})(jQuery.ajax);
                    holodeck.addDotdChatCommand("stop", function (deck, text) {
                        if (SRDotDX.gui.isPosting) SRDotDX.gui.FPXStopPosting();
                        else SRDotDX.util.extEcho('<b>/stop</b>: Links are not being posted. Stop command invalid.');
                        return false;
                    });
                    holodeck.addDotdChatCommand("e", function (deck, text) {
                        var s = text.slice(2);
                        if (s != "") holodeck.activeDialogue().SRDotDX_emote(s);
                        else SRDotDX.util.extEcho('<b>/e</b>: Empty message specified');
                        return false;
                    });
                    holodeck.addDotdChatCommand("kill", function (deck, text) {
                        document.getElementById("gameiframe").src = "";
                        SRDotDX.util.extEcho('Game window killed, have a nice chatting.');
                        return false;
                    });
                    holodeck.addDotdChatCommand("update", function (deck, text) {
						SRDotDX.request.version();
                        return false;
                    });
                    holodeck.addDotdChatCommand("help", function (deck, text) {
                        var d = "<b>Available chat commands:</b><br>";
                        d += "/stop /e /kill /update /reload /relaod /rl /reloaf /mute /unmute /mutelist /ign /unign /ignlist /friend /unfriend /script /clear /cls /clearx /clx /getlinks /wikil /import /imp /fs /room /ijoin /join /wiki /guide /manual /slap /sh /camp /perc /citadel /raid /rd /help";
                        d += '<br><br><a href="https://docs.google.com/document/d/14X0WhnJrISQbxdfQv_scJbG1sUyXdE2g4iMfHmLM0E0/edit" target="_blank">You can click here to navigate to script guide for detailed instructions or use /guide and /manual commands.</a>';
                        SRDotDX.util.extEcho(d);
                        return false;
                    });
                    holodeck.addDotdChatCommand("reload,relaod,rl,reloaf", function (deck, text) {
                        SRDotDX.reload();
                        return false;
                    });
                    holodeck.addDotdChatCommand("mute", function (deck, text) {
                        var s = text.split(" ");
                        if (s.length == 2 && s[1] != "") {
                            SRDotDX.config.mutedUsers[s[1]] = true;
                            SRDotDX.util.extEcho('User "' + s[1] + '" muted.  Use the /unmute command to undo, and the /mutelist to see all muted users.');
                            SRDotDX.config.save(false);
                        }
						else SRDotDX.util.extEcho('<b>/mute</b>: Invalid parameters specified. The proper syntax is "/mute [username]".');
                        return false;
                    });
                    holodeck.addDotdChatCommand("ign", function (deck, text) {
                        var s = text.split(" ");
                        if (s.length == 3 && s[1] != "" && s[2] != "") {
                            SRDotDX.config.ignUsers[s[1]] = { ign: s[2], gld: '*unknown*'}; //s[2];
                            SRDotDX.util.extEcho(s[1] + '\'s ign "' + s[2] + '" added.  Use the /unign command to undo, and the /ignlist to see all users with known ign.');
                            SRDotDX.config.save(false);
                        }
                        else SRDotDX.util.extEcho('<b>/ign</b>: Invalid parameters specified. The proper syntax is "/ign [kong username] [in game name]".');
                        return false;
                    });
                    holodeck.addDotdChatCommand('unmute', function (deck, text) {
                        var s = text.split(' ');
                        if (s.length === 2 && s[1] !== '') {
                            if (s[1] === 'all') {
                                for (var u in SRDotDX.config.mutedUsers) delete SRDotDX.config.mutedUsers[u];
                                SRDotDX.config.save(false);
                                SRDotDX.util.extEcho('All users unmuted.');
                            }
                            else if (SRDotDX.config.mutedUsers[s[1]]) {
                                delete SRDotDX.config.mutedUsers[s[1]];
                                SRDotDX.util.extEcho('User "' + s[1] + '" unmuted.');
                                SRDotDX.config.save(false);
                            }
                            else SRDotDX.util.extEcho('No muted user "' + s[1] + '" found.');
                        }
                        else SRDotDX.util.extEcho('<b>/unmute</b>: Invalid parameters specified. The proper syntax is "/unmute [username]". "/unmute all" can be used to unmute all muted users.');
                        return false;
                    });
                    holodeck.addDotdChatCommand('unign', function (deck, text) {
                        var s = text.split(' ');
                        if (s.length === 2 && s[1] !== '') {
                            if (s[1] === 'all') {
                                for (var u in SRDotDX.config.ignUsers) delete SRDotDX.config.ignUsers[u];
                                SRDotDX.config.save(false);
                                SRDotDX.util.extEcho('All users removed from IGN list.');
                            }
                            else if (SRDotDX.config.ignUsers[s[1]]) {
                                delete SRDotDX.config.ignUsers[s[1]];
                                SRDotDX.util.extEcho('Removed ' + s[1] + '\'s IGN.');
                                SRDotDX.config.save(false);
                            }
                            else SRDotDX.util.extEcho('No IGN of user "' + s[1] + '" found.');
                        }
                        else SRDotDX.util.extEcho('<b>/unign</b>: Invalid parameters specified. The proper syntax is "/unign [username]". "/unign all" can be used to clear IGN list.');
                        return false;
                    });
                    holodeck.addDotdChatCommand('mutelist', function (deck, text) {
                        var s = '<b>List of users currently muted:</b><br/>';
                        var i = 0;
                        for (var u in SRDotDX.config.mutedUsers) {
                            s += u + '<br>';
                            i++
                        }
                        if (i == 0) s = 'No users currently muted.<br/>';
                        s += '<br>Use the /mute and /unmute commands to add or remove users on this list.';
                        SRDotDX.util.extEcho(s);
                        return false;
                    });
                    holodeck.addDotdChatCommand('ignlist', function (deck, text) {
                        var s = '<b>List of known users IGN:</b><br>';
                        if (SRDotDX.config.ignUsers.length === 0) s = 'No users added to IGN list.<br/>';
                        else for (var u in SRDotDX.config.ignUsers) s += u + ':' + SRDotDX.config.ignUsers[u].ign + '<br/>';
                        s += '<br>Use the /ign and /unign commands to add or remove users on this list.';
                        SRDotDX.util.extEcho(s);
                        return false;
                    });
                    holodeck.addDotdChatCommand('script', function (deck, text) {
                        SRDotDX.gui.FPXdoWork('Script link: https://greasyfork.org/scripts/406-mutik-s-dotd-script');
                        return false;
                    });
                    holodeck.addDotdChatCommand('clear,cls', function (deck, text) {
                        holodeck.activeDialogue().clear();
                        return false
                    });
					holodeck.addDotdChatCommand('clearx,clx', function (deck, text) {
						var x = document.getElementsByClassName('script');
						var i = x.length;
						while(i--) x[i].parentNode.removeChild(x[i]);
						setTimeout(SRDotDX.gui.scrollChat, 50);
						return false
					});
                    holodeck.addDotdChatCommand('wikil', function (deck, text) {
                        SRDotDX.gui.FPXdoWork('http://dotd.wikia.com/wiki/Dawn_of_the_Dragons_Wiki');
                        return false;
                    });
                    holodeck.addDotdChatCommand('import,imp', function (deck, text) {
						SRDotDX.util.extEcho('Importing all raids from server');
						SRDotDX.request.raids();
                        return false;
                    });
                    holodeck.addDotdChatCommand('friend', function (deck, text) {
                        var s = text.split(" ");
                        if (s.length == 2 && s[1] != "") {
                            if (typeof SRDotDX.config.friendUsers[s[1]] != 'object') {
                                SRDotDX.config.friendUsers[s[1]] = [false, false, false, false, true];
                                SRDotDX.config.save(false);
                                SRDotDX.gui.refreshFriends();
                                SRDotDX.util.extEcho('Added ' + s[1] + ' to friends');
                            }
                        }
                        return false;
                    });
                    holodeck.addDotdChatCommand('unfriend', function (deck, text) {
                        var s = text.split(" ");
                        if (s[1] == 'all') {
                            for (var u in SRDotDX.config.friendUsers) delete SRDotDX.config.friendUsers[u];
                            SRDotDX.config.save(false);
                            SRDotDX.gui.refreshFriends();
                            SRDotDX.util.extEcho('All users removed from friend list.');
                        }
                        else if (SRDotDX.config.friendUsers[s[1]]) {
                            delete SRDotDX.config.friendUsers[s[1]];
                            SRDotDX.config.save(false);
                            SRDotDX.gui.refreshFriends();
                            SRDotDX.util.extEcho('Removed ' + s[1] + ' from friends');
                        }
                        else SRDotDX.util.extEcho('User "' + s[1] + '" not found on friend list.');
                        return false;
                    });
                    holodeck.addDotdChatCommand('fs', function (deck, text) {
                        var cmd = text.split(' ');
                        if (cmd[0] === '/fs' && cmd[1]) {
                            SRDotDX.util.extEcho('Posting raid to friends');
                            document.getElementById('DotDX_raidsToSpam').value = cmd[1];
                            SRDotDX.gui.spamRaidsToFriends();
                        }
                        else SRDotDX.util.extEcho('Wrong syntax. Usage: /fs <raid link>');
                        return false;
                    });
                    holodeck.addDotdChatCommand('room', function (deck, text) {
                        var cmd = text.split(' ');
                        if (cmd[0] === '/room' && cmd[1]) SRDotDX.gui.gotoRoom(cmd[1]);
                        else SRDotDX.gui.gotoRoom(0);
                        return false;
                    });
					holodeck.addDotdChatCommand('getlinks', function (deck, text) {
						SRDotDX.util.getChatLinks();
						SRDotDX.util.extEcho('Links opened in new tab');
						return false;
					});
                    holodeck.addDotdChatCommand('ijoin,join', function (deck, text) {
                        if (text.charAt(1) === 'j') SRDotDX.gui.quickImportAndJoin(text.slice(6));
                        else SRDotDX.gui.quickImportAndJoin(text.slice(7), true);
                        return false;
                    });
                    holodeck.addDotdChatCommand('wiki', function (deck, text) {
                        var p = /^\/wiki (.*?)$/i.exec(text);
                        if (p) {
                            window.open('http://dotd.wikia.com/wiki/Special:Search?search=' + p[1]);
                            SRDotDX.util.extEcho('Wiki search opened.');
                        }
                        else SRDotDX.util.extEcho('<b>/wiki</b>: Invalid parameters specified');
                        return false;
                    });
                    holodeck.addDotdChatCommand('guide,manual', function (deck, text) {
                        window.open('https://docs.google.com/document/d/14X0WhnJrISQbxdfQv_scJbG1sUyXdE2g4iMfHmLM0E0/edit');
                        SRDotDX.util.extEcho('Script guide opened in new tab/window.');
                        return false;
                    });
                    holodeck.addDotdChatCommand('slap', function (deck, text) {
                        var p = /^\/slap (.*?)$/i.exec(text);
                        if (p) {
                            var num = Math.round((Math.random() * (SRDotDX.slapSentences.length - 1)));
                            SRDotDX.gui.FPXdoWork('*' + SRDotDX.slapSentences[num].replace(/<nick>/g, p[1]) + '*');
                        }
                        else SRDotDX.util.extEcho('<b>/slap</b>: Invalid parameters specified');
                        return false;
                    });
                    holodeck.addDotdChatCommand('sh', function (deck, text) {
                        var p = /^\/sh (.*?)$/i.exec(text);
                        if (p) {
                            var fnd1 = p[1].toLowerCase(), fnd2 = p[1].length, found = false, sho;
                            for (i in SRDotDX.shortcuts) {
                                if (SRDotDX.shortcuts.hasOwnProperty(i)) {
                                    sho = SRDotDX.shortcuts[i];
                                    if (sho.n.toLowerCase().indexOf(fnd1) > -1 && sho.n.length == fnd2) {
                                        SRDotDX.util.extEcho('<b>' + sho.bn + '</b>: ' + sho.desc);
                                        found = true;
                                    }
                                }
                            }
                            if (!found) SRDotDX.util.extEcho('<b>/sh</b>: Shortcut not found in db');
                        }
                        else SRDotDX.util.extEcho('<b>/sh</b>: No parameters specified');
                        return false;
                    });
                    holodeck.addDotdChatCommand('perc', function (deck, text) {
                        var bok = text.indexOf('bok', 4);
                        var cwp = text.indexOf('cwp', 4);
                        var empty = text.length < 6;
                        var output = "";
                        if (bok >= 0 || empty) output = "<b>Book of Knowledge Perc. Tiers:</b><br>\
					1 : Brown/Grey<br>\
					4k : Brown/Grey/Green<br>\
					6k : Grey/Green<br>\
					10k : Grey/Green/Blue<br>\
					14k : Green/Blue<br>\
					16k : Green/Blue/Purple<br>\
					18k : Blue/Purple<br>\
					22k : Blue/Purple/Orange<br>\
					24k : Purple/Orange<br>\
					30k : Orange<br>\
					33k : Orange/Red (more orange)<br>\
					36k : Orange/Red (more red)<br>\
					50k : Orange/Red (even more red)<br>\
					70k : Red<br>\
					80k : Red/Bronze<br>\
					90k : Red/Bronze<br>\
					100k : ???<br>\
					110k : Bronze/Silver<br>\
					120k : Bronze/Silver<br>\
					130k : Bronze/Silver<br>\
					140k : Silver<br>\
					150k : Silver/Gold<br>\
					160k : Silver/Gold<br>\
					170k : Silver/Gold";
                        if (empty) output += "<br>\
					-------------------------------------------------<br>";
                        if (cwp >= 0 || empty) output += "<b>Clockwork Parts Perc. Tiers:</b><br>\
					1-1999: 10x Perf. Clockwork Part<br>\
                    2000-3999: 25x Perf. Clockwork Part<br>\
                    4000-5999: 40x Perf. Clockwork Part<br>\
                    6000-7999: 55x Perf. Clockwork Part<br>\
                    8000-9999: 70x Perf. Clockwork Part<br>\
                    10000-11999: 85x Perf. Clockwork Part<br>\
                    12000-13999: 100x Perf. Clockwork Part<br>\
                    14000-15999: 115x Perf. Clockwork Part<br>\
                    16000-17999: 130x Perf. Clockwork Part<br>\
                    18000-19999: 145x Perf. Clockwork Part<br>\
                    20000-21999: 160x Perf. Clockwork Part<br>\
                    22000-23999: 175x Perf. Clockwork Part<br>\
                    24000-25999: 190x Perf. Clockwork Part<br>\
                    26000-27999: 205x Perf. Clockwork Part<br>\
                    28000-29999: 220x Perf. Clockwork Part<br>\
                    30000-32999: 235x Perf. Clockwork Part<br>\
                    33000-35999: 245x Perf. Clockwork Part<br>\
                    36000+ : 260x Perf. Clockwork Part";
                        SRDotDX.util.extEcho(output);
                        return false;
                    });
                    holodeck.addDotdChatCommand('citadel', function (deck, text) {
                        SRDotDX.util.extEcho("Barrack Book = Grune N Quest<br>\
                Barrack Scroll 1 = Hydra NM Raid<br>\
                Barrack Scroll 2 = Research Library book<br>\
                Barrack Scroll 3 = Rhalmarius the Despoiler NM Raid/Crafting<br>\
                Barrack Scroll 4 = The New Claw (World Raid) craft<br>\
                Barrack Scroll 5 = Burbata the Spine-Crusher NM Raid<br>\
                Barrack Scroll 6 = Temp loot from Hargamesh/Grimsly NM Raids<br>\
                Barrack Scroll 7 = The Baroness NM Quest<br>\
                Barrack Scroll 8 = Crafting from Imryx the Incinerator NM Raid<br>\
                Armorsmith Book = Lurking Horror N Quest<br>\
                Armorsmith Scroll 1 = Nalagarst NM Raid<br>\
                Armorsmith Scroll 2 = Research Library 1<br>\
                Armorsmith Scroll 3 = Dragon's Lair NM Raid<br>\
                Armorsmith Scroll 4 = Temp loot from Rift/Sisters NM Raid<br>\
                Armorsmith Scroll 5 = Baroness NM Raid<br>\
                Weaponsmith Book = Erebus N Quest<br>\
                Weaponsmith Scroll 1 = Baroness NM Raid<br>\
                Weaponsmith Scroll 2 = Research Library 1<br>\
                Weaponsmith Scroll 3 = Dragon's Lair NM Raid<br>\
                Weaponsmith Scroll 4 = Temp loot from Mardachus NM Raid<br>\
                Weaponsmith Scroll 5 = Warlord Zugen NM Raid<br>\
                Alchemist Book = Nalagarst N Quest<br>\
                Alchemist Scroll 1 = Kalaxia N Quest<br>\
                Alchemist Scroll 2 = Research Library 5<br>\
                Alchemist Scroll 3 = The New Claw (World Raid)<br>\
                Alchemist Scroll 4 = Teremarthu NM Raid<br>\
                Research Book = Bellarius N Quest<br>\
                Research Library Scroll 1 = Mardachus NM Raid<br>\
                Research Library Scroll 2 = Valanazes NM Raid<br>\
                Research Library Scroll 3 = Teremarthu NM Raid<br>\
                Research Library Scroll 4 = Z'ralk'thalat NM Raid<br>\
                Research Library Scroll 5 = Simulacrum of Dahrizon NM Quest<br>\
                Research Library Scroll 6 = Count Siculus' Phantom N Quest<br>\
                Pet Emporium Book = Count Siculus' Phantom N Quest<br>\
                Pet Emporium Scroll 1 = Research Library 4<br>\
                Pet Emporium Scroll 2 = Cannibal Barbarians NM Raid<br>\
                Stables Book = Valanazes N Quest<br>\
                Stables Scroll 1 = Frog-men Assassins NM Raid<br>\
                Stables Scroll 2 = Research Library 2<br>\
                Stables Scroll 3 = Mount Chest<br>\
                Training Ground Book = Teremarthu N Quest<br>\
                Training Ground Scroll 1 = Research Library 3<br>\
                Training Ground Scroll 2 = Temporary loot from Z7 NM Raids<br>\
                Training Ground Scroll 3 = Invasion Rank: Wyrm-Commander<br>\
                Training Ground Scroll 4 = Invasion Rank: Chief Battlefield Overseer<br>\
                Training Ground Scroll 5 = Count Siculus' Phantom L&NM Raid<br>\
                Training Ground Scroll 6 = Thaltherda the Sea-Slitherer NM Raid<br>\
                Wizard's Tower Book = Ruzzik the Slayer N Quest<br>\
                Wizard's Tower Scroll 1 = Salome the Seductress NM Raid<br>\
                Wizard's Tower Scroll 2 = Kalaxia the Far-Seer NM Raid<br>\
                Wizard's Tower Scroll 3 = Yydian's Sanctuary NM Raid<br>\
                Wizard's Tower Scroll 4 = Drulcharus NM Raid<br>\
                Jeweler Book = Krugnug N Quest<br>\
                Jeweler Scroll 1 = Thaltherda the Sea-Slitherer NM Raid<br>\
                Jeweler Scroll 2 = Crafting (General/Events)<br>\
                Jeweler Scroll 3 = Spectral Erebus Raid/Crafting");
                        return false;
                    });
                    holodeck.addDotdChatCommand('camp', function(deck, text) {
                        var p = text.split(' '), msg = '';
                        if (p[1] && SRDotDX.camps.hasOwnProperty(p[1].toLowerCase())) {
                            var camp = SRDotDX.camps[p[1].toLowerCase()];
                            var num = camp.tiers[0].length, j, jl;
                            msg += '<a class="title" target="_blank" href="http://dotd.wikia.com/wiki/' + camp.name.replace(/ /g, '_').replace(/'/g, "%27") + '">' + camp.name + '</a>';
                            msg += '<br>Camp time: N ' + camp.time[0] + 'h, H ' + camp.time[1] + 'h<br>Prefixes: ' + camp.prefixes;
                            msg += '<br><table class="camps"><thead><tr><th>Dmg</th><th>CU</th>' + (num > 3 ? '<th>R</th><th class="tb">E</th>' : '<th class="tb">RE</th>');
                            for(var i = 0, il = camp.numNodes; i < il; ++i) msg += '<th>' + camp[camp.nodes[i]].sname + '</th>'; msg += '</tr></thead><tbody>';
                            if(num > 3) {
                                for(i = 0, il = camp.tiers.length; i < il; ++i) {
                                    msg += '<tr class="head"><td class="ep">' + SRDotDX.util.getShortNumMil(camp.tiers[i][0]) + '</td><td>' + camp.tiers[i][1] + '</td><td>' + camp.tiers[i][2] + '</td><td class="tb">' + camp.tiers[i][3] + '</td>';
                                    for(j = 0, jl = camp.numNodes; j < jl; ++j) msg += camp[camp.nodes[j]].tiers[i] ? '<td class="mark">'+(camp[camp.nodes[j]].epics !== undefined ? camp[camp.nodes[j]].epics[i] : '&#x2713;' )+'</td>' : '<td></td>';
                                }
                            }
                            else {
								for(i = 0, il = camp.tiers.length; i < il; ++i) {
                                    msg += '<tr class="head"><td class="ep">' + SRDotDX.util.getShortNumMil(camp.tiers[i][0]) + '</td><td>' + camp.tiers[i][1] + '</td><td class="tb">' + camp.tiers[i][2] + '</td>';
                                    for(j = 0, jl = camp.numNodes; j < jl; ++j) msg += camp[camp.nodes[j]].tiers[i] ? '<td class="mark">&#x2713;</td>' : '<td></td>';
                                }
                            }
                            msg += '</tbody></table>';
                            var node;
							for(i = 0, il = camp.numNodes; i < il; ++i) {
                                node = camp[camp.nodes[i]];
                                msg += (i ? '<br>' : '') + node.sname + ' &mdash; ' + node.name + ', FS: N ' + SRDotDX.util.getShortNumMil(node.hp[0] / node.size) + ' / H ' + SRDotDX.util.getShortNumMil(node.hp[1] / node.size);
                            }
                            SRDotDX.util.extEcho(msg);
                        }
                        else SRDotDX.util.extEcho('No campaigns found matching "' + (p[1] ? p[1] : '') + '". Valid values are: ' + Object.keys(SRDotDX.camps).join(', '));
                        return false;
                    });
                    holodeck.addDotdChatCommand('raid,rd', function(deck, text) {
                        var p = text.split(' ');
                        if(p[1]) {
                            var msg = '', j, jl;
                            var diff = !isNaN(p[2]) ? p[2] - 1 : -1;
                            var fnd = p[1].toLowerCase();
							var keys = Object.keys(SRDotDX.raids);
                            for(var k = 0, kl = keys.length; k < kl; ++k) {
								var raid = SRDotDX.raids[keys[k]];
								if(raid.name.toLowerCase().indexOf(fnd) > -1) {
									if(msg !== '') msg += '<hr>';
									msg += '<a class="title" target="_blank" href="http://dotd.wikia.com/wiki/' + raid.name.replace(/ /g, '_').replace(/'/g, "%27") + (raid.stat === 'H' ? '_(Guild_Raid)">' : '_(Raid)">') + raid.name + '</a>';
									msg += '<br>' + (raid.type === '' ? '' : raid.type + '<br>') + SRDotDX.raidSizes[raid.size].name + ' Raid (' + (raid.size === 101 ? 100 : raid.size) + ' slots) | ' + raid.duration + 'h';
									msg += '<br><table class="raids">';
									switch(diff) {
										case 0: msg += '<colgroup><col><col class="selected"><col><col><col></colgroup>'; break;
										case 1: msg += '<colgroup><col><col><col class="selected"><col><col></colgroup>'; break;
										case 2: msg += '<colgroup><col><col><col><col class="selected"><col></colgroup>'; break;
										case 3: msg += '<colgroup><col><col><col><col><col class="selected"></colgroup>'; break;
										default: msg += '<colgroup><col><col><col><col><col></colgroup>'; break;
									}
									var size = raid.size < 15 ? 10 : raid.size, fs = [];
									for(j = 0; j < 4; ++j) fs[j] = raid.health[j] / (raid.size == 101 ? 100 : raid.size);
									msg += '<thead> \
										<tr><th style="border:0; background-color: transparent;"></th><th>Normal</th><th>Hard</th><th>Legend</th><th>NMare</th></tr> \
									</thead> \
									<tbody> \
										<tr class="head"><td class="ep">HP</td><td>' + SRDotDX.util.getShortNum(raid.health[0]) + '</td><td>' + SRDotDX.util.getShortNum(raid.health[1]) + '</td><td>' + SRDotDX.util.getShortNum(raid.health[2]) + '</td><td>' + SRDotDX.util.getShortNum(raid.health[3]) + '</td></tr> \
										<tr class="head"><td class="ep">FS</td><td>' + SRDotDX.util.getShortNum(fs[0]) + '</td><td>' + SRDotDX.util.getShortNum(fs[1]) + '</td><td>' + SRDotDX.util.getShortNum(fs[2]) + '</td><td>' + SRDotDX.util.getShortNum(fs[3]) + '</td></tr> \
										<tr class="head split"><td class="ep">AP</td><td>&mdash;</td><td>&mdash;</td><td>&mdash;</td><td>' + SRDotDX.util.getShortNum(fs[3] / 2.0) + '</td></tr>';
									if(typeof raid.lt !== 'object' && raid.id !== 'rhalmarius_the_despoiler' && raid.id !== 'grundus' && raid.size < 10000) {
										var ratio = SRDotDX.raidSizes[size].ratios;
										var ename = SRDotDX.raidSizes[size].enames;
										for (j = 0, jl = ratio.length; j < jl; ++j) if (ratio[j] > 0) msg += '<tr><td class="ep">' + ename[j] + '</td><td>' + SRDotDX.util.getShortNum(fs[0] * ratio[j]) + '</td><td>' + SRDotDX.util.getShortNum(fs[1] * ratio[j]) + '</td><td>' + SRDotDX.util.getShortNum(fs[2] * ratio[j]) + '</td><td>' + SRDotDX.util.getShortNum(fs[3] * ratio[j]) + '</td></tr>';
									}
									else if (typeof raid.lt === 'object') {
										var elen = SRDotDX.lootTiers[raid.lt[0]].tiers;
										var eleh = SRDotDX.lootTiers[raid.lt[1]].tiers;
										var elel = SRDotDX.lootTiers[raid.lt[2]].tiers;
										var elenm = SRDotDX.lootTiers[raid.lt[3]].tiers;
										var epics = SRDotDX.lootTiers[raid.lt[0]].epics;
										var best = SRDotDX.lootTiers[raid.lt[0]].best;
										var e = SRDotDX.lootTiers[raid.lt[0]].e ? 'E' : '';
										if(typeof elen[0] === 'number') for(j = 0, jl = epics.length; j < jl; ++j) msg += '<tr' + (j === best ? ' class="best"' : '') + '><td class="ep">' + epics[j] + e + '</td><td>' + SRDotDX.util.getShortNumMil(elen[j]) + '</td><td>' + SRDotDX.util.getShortNumMil(eleh[j]) + '</td><td>' + SRDotDX.util.getShortNumMil(elel[j]) + '</td><td>' + SRDotDX.util.getShortNumMil(elenm[j]) + '</td></tr>';
										else msg += '<tr><td class="ep">-</td><td>' + elen[0] + '</td><td>' + eleh[0] + '</td><td>' + elel[0] + '</td><td>' + elenm[0] + '</td></tr>';
									}
									msg += '</tbody></table>';
								}
                            }
                            if (msg != '') SRDotDX.util.extEcho(msg);
                            else SRDotDX.util.extEcho('No raids found matching: ' + p[1]);
                        }
                        else SRDotDX.util.extEcho('<b>/raid</b>: Invalid parameters specified (<a href="#" onclick="SRDotDX.gui.help(\'raid\')">help</a>)');
                        return false;
                    });
                    window.onbeforeunload = function(){SRDotDX.config.save(false)};
                    SRDotDX.fails = 0;
                    console.log('[DotDX] Core loaded. Loading user interface...');
                    SRDotDX.gui.load();
                    SRDotDX.request.init();
                    setTimeout(function(){delete SRDotDX.load}, 100);
                }
                else if(++SRDotDX.fails < 20) {
                    console.log('[DotDX] Missing needed Kong resources (try:' + SRDotDX.fails + '), retrying in 0.75 second...');
                    setTimeout(SRDotDX.load, 750);
                }
                else {
                    console.log('[DotDX] Unable to locate required Kong resources. Loading aborted');
                    setTimeout(function(){delete SRDotDX}, 1);
                }
            }
        };
        console.log('[DotDX] Initialized. Checking for needed Kong resources ...');
        SRDotDX.load();
    }

    console.log('[DotDX] Initializing ...');
    if (window.top == window.self) {
		document.addEventListener("dotd.req", function (param) {
			var p = JSON.parse(param.data);
			if (p.wrappedJSObject) p = p.wrappedJSObject;
			p.callback = function (e, r) {
				this.onload = null;
				this.onerror = null;
				this.ontimeout = null;
				this.event = e;
				this.status = r.status;
				this.responseText = r.responseText;
				var c = document.createEvent("MessageEvent");
				if (c.initMessageEvent) c.initMessageEvent(this.eventName, false, false, JSON.stringify(this), document.location.protocol + "//" + document.location.hostname, 1, unsafeWindow, null);
				else c = new MessageEvent(this.eventName, {"origin": document.location.protocol + "//" + document.location.hostname, "lastEventId": 1, "source": unsafeWindow, "data": JSON.stringify(this)});
				document.dispatchEvent(c);
			};
			p.onload = p.callback.bind(p, "load");
			p.onerror = p.callback.bind(p, "error");
			p.ontimeout = p.callback.bind(p, "timeout");
			setTimeout(function(){ GM_xmlhttpRequest(p) }, 1);
		});
		var scr = document.createElement('script');
		scr.setAttribute('src','http://mutik.erley.org/chat/socket.io.js');
		document.head.appendChild(scr);
		scr = document.createElement('script');
		scr.appendChild(document.createTextNode('(' + main + ')()'));
		document.head.appendChild(scr);
    }
}
else if(window.location.host === '50.18.191.15') {
	if (typeof GM_setValue === 'undefined') {
		var GM_setValue = function (name, value) {
			localStorage.setItem(name, (typeof value).substring(0, 1) + value);
		}
	}
	if (typeof GM_getValue === 'undefined') {
		var GM_getValue = function (name, dvalue)
		{
			var value = localStorage.getItem(name);
			if (typeof value !== 'string') return dvalue;
			else {
				var type = value.substring(0, 1);
				value = value.substring(1);
				if (type === 'b') return (value === 'true');
				else if (type === 'n') return Number(value);
				else return value;
			}
		};
	}
    window.onmessage = function(e) {
        var c = e.data.split('#');
        if(c[0].indexOf('dotdx') !== -1) {
            if(c[0] === 'dotdx.save') {
                GM_setValue('DotDXext', c[1]);
                console.log("[DotDX] Saved data: "+c[1]);
            }
            var conf = JSON.parse(c[1]);
            if(conf.removeWChat) {
                if(document.getElementById('swfdiv') !== null) document.getElementById('swfdiv').parentNode.style.left = '0px';
                if(document.getElementById('chatdiv') !== null) {
                    var remdiv = document.getElementById('chatdiv').parentNode;
                    remdiv.parentNode.removeChild(remdiv);
                }
            }
            else if(conf.leftWChat && !conf.hideWChat) {
                if(document.getElementById('chatdiv') !== null) document.getElementById('chatdiv').parentNode.style.left = '0px';
                if(document.getElementById('swfdiv') !== null) document.getElementById('swfdiv').parentNode.style.left = '265px';
            }
            else {
                if(document.getElementById('chatdiv') !== null) document.getElementById('chatdiv').parentNode.style.left = '760px';
                if(document.getElementById('swfdiv') !== null) document.getElementById('swfdiv').parentNode.style.left = '0px';
            }
        }
    };
    if (typeof GM_getValue("DotDXext") !== 'string') GM_setValue("DotDXext",JSON.stringify({'removeWChat':false,'leftWChat':false,'hideWChat':false}));
    window.postMessage('dotdx.init#'+GM_getValue('DotDXext'),'*');
    console.log("[DotDX] Injected code into GameFrame");
}