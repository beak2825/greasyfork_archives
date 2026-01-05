// ==UserScript==
// @name			emjack++
// @version			3.4.3
// @description		The new emjack
// @match			https://epicmafia.com/game/*
// @author       Foxie, Croned
// @namespace https://greasyfork.org/en/users/9694-croned
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/10698/emjack%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/10698/emjack%2B%2B.meta.js
// ==/UserScript==

unsafeWindow.GM_setValue = GM_setValue;
unsafeWindow.GM_getValue = GM_getValue;
unsafeWindow.notes = {};

inject = document.createElement("script");
inject.id = "emjack";
inject.textContent = "void " + String(function () {

	//initiate
	var scope = $(document.body).scope(),
		dev = false,
		settings = scope.settings;
	function log(msg) {
		scope.log(msg, "ejack");
	}
	var roleDisplay = false;
	var voteTracker = { "length": 0, "users": {}, "voted": {} };
	var query;
	var showvotes = true;
	var setWill = false;
	window.voteList = {};
    var lastActive = false;
	//abort if not mafia
	var gamemode = document.title.match(/([\w\s]+)\s-/)[1];
	if (gamemode !== "Epicmafia" || scope.compete || scope.ranked || scope.record) {
		return;
	}

    $("body").mousemove(function() {lastActive = new Date().getTime()});
    $("body").keypress(function() {lastActive = new Date().getTime()});
    
	//load config
	if (localStorage.notes && !scope.ranked) {
		notes = JSON.parse(localStorage.notes);
	}

	//intercept packets
	scope.execute_cmds = function (initial) {
		//console.log("Init:" + initial);
		return function (pkg) {
			initial.call(scope, pkg);
			//console.log(pkg);
			for (var i = 0, cmd, data; i < pkg.length; ++i) {
				cmd = pkg[i][0];
				//console.log("COMMAND:" + cmd);
				data = pkg[i][1];
				//console.log("DATA:" + data);
				if (dev) {
					console.log(cmd, data);
				}
				if (cmd === "a") {
					if (!ranked) {
						if (!options.fastgame) {
							scope.set_option("fastgame");
						}
						if (!options.nospectate) {
							scope.set_option("nospectate");
						}
					}
				}
				else if (cmd === "join") {
					log(data.user + " has joined");
				}
				else if (cmd === "leave") {
					log(data.user + " has left");
				}
				else if (cmd === "kill") {
					scope.users[data.target].dead = true;
				}
				else if (cmd === "kk") {
					scope.users[data.user].dead = true;
				}
				else if (cmd === "speech") {
					if (data.type === "contact") {
						log("The roles are... " + data.data.join(", "));
					}
				}
				else if (cmd === "ms") {
					if (data === "Zombie wins!") {
						log("brraaaaaaiiinnnsss...");
					}
				}
				else if (cmd === "m") {
					if (data.meet === "mafia" && data.choosedata) {
						for (var key in scope.users) {
							if (!data.choosedata[key] && !scope.users[key].dead) {
								if (!scope.users[key].revealed) {
									scope.select_role(key, "mafia");
								}
								if (data.members.indexOf(key) === -1) {
									log(key + " is your partner!");
								}
							}
						}
					}
				}
				else if (cmd == "p") {
					if (data.meet == "village") {
						var vote;
						voteList = {};

						$(".meet_entity[id*='target']").each(function () {
							vote = $(this).text().replace(/votes/g, "");
							vote = vote.replace(/vote/g, "");
							vote = vote.replace(/ /g, "");
							if (vote) {
								if (voteList[vote]) {
									voteList[vote]++;
								}
								else {
									voteList[vote] = 1;
								}
							}
						});
					}
				}
			}
		}
	}(scope.execute_cmds);

	//chat input
	$(window).on("keydown", function (event) {
		if (event.target.value === undefined && !event.ctrlKey && !event.metaKey) {
			$("#typebox").focus();
		}
	});
	scope.keypress = function (initial) {
		return function (event) {
			if (event.which === 13) {
				var input = event.target.value;
				if (input[0] === "/") {
					var cmd = input.match(/\/(\w+)/)[1],
						data = input.match(/\/\w+\s?(.+)?/)[1];
					if (cmd === "dev") {
						dev = !dev;
						log(dev ? "Logging on" : "Logging off");
					}
					else if (cmd === "help") {
						log("/me - action message");
						log("/ping - ping living players");
						log("/join - join first open game");
						log("/host - host game with current setup");
						log("/games - list open games");
					}
					else if (cmd === "clear") {
						$(".ejack").remove();
					}
					else if (cmd === "ping") {
						var ping = [];
						for (var key in scope.users) {
							if (!scope.users[key].dead) {
								ping.push(key);
							}
						}
						event.target.value = ping.join(" ");
						initial.call(scope, event);
						return;
					}
					else if (cmd === "kick") {
						if (data) {
							data = data.toLowerCase();
							for (var key in scope.users) {
								if (key.toLowerCase() === data) {
									scope.ban(scope.users[key].id);
									break;
								}
							}
						}
					}
					else if (cmd === "emotes") {
						log("global - " + Object.keys(_emotes).join(" "));
						log("lobby - " + Object.keys(lobby_emotes).join(" "));
					}
					else if (cmd === "whois") {
						if (data) {
							data = data.toLowerCase();
							for (var key in scope.users) {
								if (data === "all" || key.toLowerCase() === data) {
									log(key + " (" + scope.users[key].id + ")");
									var emotes = scope.users[key].emotes;
									log(" -- emotes: " + (
										emotes ? Object.keys(emotes).join(" ") : "none"
										));
									if (data !== "all") {
										break;
									}
								}
							}
						}
					}
					else if (cmd === "games") {
						var a,
							div,
							chat = document.getElementById("window");
						lobbyGames({
							status_id: 0,
							password: false
						}, function (table) {
							a = document.createElement("a");
							a.textContent = "Table " + table.id;
							a.addEventListener("click", function (event) {
								leaveand(function () {
									location.href = "/game/" + table.id;
								});
							});
							div = document.createElement("div");
							div.className = "log ejack";
							div.appendChild(a);
							div.appendChild(document.createTextNode(" - " + table.numplayers + " / " + table.target + " players"));
							chat.appendChild(div);
							chat.scrollTop = chat.scrollHeight;
						});
					}
					else if (cmd === "join") {
						lobbyGames({
							status_id: 0,
							target: 12,
							password: false
						}, function (table) {
							leaveand(function () {
								location.href = "/game/" + table.id;
							});
							return true;
						}
							);
					}
					else if (cmd === "host") {
						leaveand(function () {
							$.getJSON("/game/add/mafia", {
								setupid: scope.setup_id,
								ranked: false,
								add_title: data === undefined ? 0 : 1,
								game_title: data
							}, function (json) {
								if (json[1].table) {
									location.href = "/game/" + json[1].table;
								}
							}
								);
						});
					}
					else if (cmd === "leave") {
						scope.definite_leave();
					}
					else if (cmd === "me") {
						if (data) {
							initial.call(scope, event);
							return;
						}
						else {
							log("Add text!");
							log("i.e.: /me slaps Foxie with a fish");
						}
					}
					else if (cmd == "toggle") {
						if (showvotes) {
							showvotes = false;
							$(".jackVote").hide();
							showVotesSetting = false;
						}
						else {
							showvotes = true;
							$(".jackVote").show();
							showVotesSetting = true;
						}

					}
					else if (cmd == "role") {
						if (data) {
							data = data.toLowerCase();
						}
						else {
							data = scope.users[scope.user].role;
						}
						var roleurl = "/role/" + data + "/info/roleid";
						var roleInfo = $.ajax({ method: "GET", url: roleurl, async: false });
						roleInfo = roleInfo.responseText;
						var roleHTML = $(roleInfo);
						var roleName = roleHTML.find("h4").text();
						if (roleName.length > 0) {
							var roleAttrs = roleHTML.find("li");
							log(roleName + ":");
							for (var i = 0; i < roleAttrs.length; i++) {
								log("* " + roleAttrs[i].textContent);
							}
						}
						else {
							log("Role does not exist!");
						}

					}
                    else if (cmd == "afk") {
                        if (autoAfkSetting) {
                            autoAfkSetting = false;
                            errordisplay(".errordisplay", "AFK Mode Off!");
                        } else {
                            autoAfkSetting = true;
                            errordisplay(".errordisplay", "AFK Mode On!");
                        }
                    }
                    else if (cmd == "nl") {
                        $(".booth_noimg").click();
                    }
                    else if (cmd == "vote") {
                        $(".one_booth_choice:contains('" + data + "')").click();
                    }
                    else if (cmd == "bug") {
                        $.post("/message", {msg: data, subject: "emjack Bug Report", "recipients[]": 392447});
                        log("Bug report sent!");
                    }
                    else if (cmd == "suggest") {
                        $.post("/message", {msg: data, subject: "emjack Suggestion", "recipients[]": 392447});
                        log("Suggestion sent!");
                    }
					event.target.value = "";
					return;
				}
			}
			initial.call(scope, event);
		};
	}(scope.keypress);

	//anti-votespam
	var votetimes = [];
	$(document).on("click", ".one_booth_choice", function (event) {
		var now = Date.now();
		for (var i = votetimes.length; i--;) {
			if (now - votetimes[i] > 5000) {
				votetimes.splice(i, 1);
			}
		}
		votetimes.push(now);
		if (votetimes.length > 10) {
			log("You're voting too fast!");
			event.stopPropogation();
		}
	});
	void function (eventlist) {
		eventlist.unshift(eventlist[eventlist.length - 1]);
		eventlist.pop();
	}($._data(document).events.click);

	//utility
	function leaveand(callback) {
		scope.redirect_back = callback;
		scope.definite_leave();
	};
	function lobbyGames(criteria, callback) {
		$.ajax({ url: "/game/find?page=1", method: "get" }).success(function (json) {
			var criterion,
				openGames = [],
				games = JSON.parse(json[1]);
			games.data.forEach(function (table) {
				for (criterion in criteria) {
					if (criteria[criterion] !== table[criterion]) {
						return;
					}
				}
				openGames.push(table);
			})
			if (openGames.length === 0) {
				log("No open games available!");
			}
			else {
				openGames.some(function (table) {
					return callback(table);
				});
			}
		});
	};

	//clickable links
	vocabs.push("https?://.+");
	$(document).delegate(".acronym", "click", function () {
		if (/\bhttps?:\/\/.+\b/ig.test(this.textContent)) {
			window.open(this.textContent, "_blank");
		}
	});

	//manage notes
	if (!scope.ranked) {
		$(document).on("mouseenter", ".user_li", function (event) {
			this.setAttribute("title", notes[this.dataset.uname] || "no notes for " + this.dataset.uname);
		});
		$(document).on("click", ".user_note", function (event) {
			var user = scope.selected_user;
			if (user.details.notes === undefined) {
				user.details.notes = notes[user.username] || "";
				$(".notes").val(user.details.notes);
			}
		});
		$(".notes").on("keyup", function (event) {
			notes[scope.selected_user.username] = this.value;
		});
	}

	//Init Vote Tracker
	var setVoteInt = setInterval(function () {
		if (scope.user_list.length > 0 && $(".jackVote").length == 0 && scope.gamestate > 0) {
			for (var i = 0; i < scope.user_list.length; i++) {
				if (!scope.users[scope.user_list[i]].dead) {
					query = "[data-uname*='" + scope.user_list[i] + "']";
					$(query).prepend("<span class='jackVote'>0</span>");
				}
			}
			$(".jackVote").hide();
			clearInterval(setVoteInt);
		}
	}, 100);

	//Role Info, voteTracker, and setWill
	setInterval(function () {

		//voteTracker
		if (scope.is_day() && showvotes) {
			$(".jackVote").show();
			for (var i = 0; i < scope.user_list.length; i++) {
				query = "[data-uname*='" + scope.user_list[i] + "']";
				if (voteList[scope.user_list[i]]) {
					$(query).find(".jackVote").text(voteList[scope.user_list[i]]);
				}
				else {
					$(query).find(".jackVote").text("0");
				}
			}
		}
		else {
			$(".jackVote").hide();
		}

		//Role Display
		if (!roleDisplay && scope.gamestate > 0 && scope.users[scope.user].role) {
			var role = scope.users[scope.user].role;
			var alignment = scope.role_data[scope.users[scope.user].role];
			$(".gamesetup").append("<li class='jackLi'>Role: <span id='jackRole' class='jackSpan'></span> Alignment: <span id='jackAlign' class='jackSpan'></span></li>");
			$(".jackLi").css({
				"color": "#b44",
				"font-weight": "bold",
				"margin-left": "10px"
			});
			$(".jackSpan").css({
				"color": "black",
				"margin-right": "5px"
			});
			$("#jackRole").text(role);
			$("#jackAlign").text(alignment);
			roleDisplay = true;
		}

		//setWill
		if (scope.is_night() && scope.gamestate == 1 && !setWill && scope.role_data[scope.users[scope.user].role] != "mafia") {
			scope.lastwill = scope.user + ", " + scope.users[scope.user].role;
			scope.update_will();
			setWill = true;
		}
        
        //Typebox always visible
        $("#speak_container").removeClass("ng-hide");
	}, 100);
    
    //AFK Mode
    var gamestates = {};
    var chosenYet;
    var choices;

    function doVote() {
        $(".booth_choices").each(function() {
            chosenYet = false;
            choices = $(this).find(".booth_inner");

            choices.each(function(index) {
                if ($(this).text() == "no one") {
                    $(this).click();
                    chosenYet = true;
                }
                else if (!chosenYet && (choices.length - 1) == index) {
                    $(this).first().click();
                    chosenYet = true;
                }
            });
        });

        $(".inputchoice").click();

        gamestates[scope.gamestate] = true;
    }
    
    setInterval(function(){
        var currentTime = new Date().getTime();
        if (!gamestates[scope.gamestate] && autoAfkSetting) {
            if (Math.round( (currentTime - lastActive) / 1000 ) >= 5 && !$("#id_" + scope.user).text().replace("You", "").replace(" ", "") && scope.kick_countdown == "Time is up!") {
                doVote();
            }
        }
        
        
    }, 5000);

	//save settings
	var emjackSettings = {
		acronym: false,
		emoticons: false,
		fullscreen: false,
		mutemusic: false,
		muting: false,
		timestamp: false,
		voting: false
	};

	setTrue = function (setting) {
		var selector = "#" + setting;
		$(selector).click();
	};

	var showVotesSetting = false;

	emjackSettings.acronym = GM_getValue("emjack_acronym");
	emjackSettings.emoticons = GM_getValue("emjack_emoticons");
	emjackSettings.fullscreen = GM_getValue("emjack_fullscreen");
	emjackSettings.mutemusic = GM_getValue("emjack_mutemusic");
	emjackSettings.muting = GM_getValue("emjack_muting");
	emjackSettings.timestamp = GM_getValue("emjack_timestamp");
	emjackSettings.voting = GM_getValue("emjack_voting");
	showVotesSetting = GM_getValue("emjack_showvotes");
	autoAfkSetting = GM_getValue("emjack_autoafk");

	for (var set in emjackSettings) {
		if (emjackSettings.hasOwnProperty(set)) {
			if (emjackSettings[set] && !scope.settings[set]) {
				setTrue(set);
			}
		}
	}

	if (!showVotesSetting) {
		showvotes = false;
		$(".jackVote").hide();
	}

	$(window).on("beforeunload", function (event) {
		localStorage.notes = JSON.stringify(notes);
		for (set in scope.settings) {
			if (scope.settings.hasOwnProperty(set)) {
				saveSettings(set, scope.settings);
			}
		}
		GM_setValue("emjack_showvotes", showVotesSetting);
		GM_setValue("emjack_autoafk", autoAfkSetting);
	});

	saveSettings = function (set, settings) {
		GM_setValue("emjack_" + set, settings[set]);
	}


	console.log("emjack++ activated!");
} + "()");
window.addEventListener("load", function (event) {
	document.body.appendChild(inject);
});