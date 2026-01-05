// ==UserScript==
// @name			emjack-s
// @version			3.0.5
// @description		site version
// @match			https://epicmafia.com/game/*
// @namespace https://greasyfork.org/users/4723
// @downloadURL https://update.greasyfork.org/scripts/5191/emjack-s.user.js
// @updateURL https://update.greasyfork.org/scripts/5191/emjack-s.meta.js
// ==/UserScript==
inject=document.createElement("script");
inject.textContent="void "+String(function() {

	//initiate
	var	scope=$(document.body).scope(),
		dev=false,
		notes={},
		settings={};
	function log(msg) {
		scope.log(msg, "ejack");
		};

	//abort if not mafia
	var	gamemode=document.title.match(/([\w\s]+)\s-/)[1];
	if(gamemode!=="Epicmafia") {
		return;
		}

	//load config
	if(localStorage.notes && !scope.ranked) {
		notes=JSON.parse(localStorage.notes);
		}
	if(localStorage.ejsettings) {
		settings=JSON.parse(localStorage.ejsettings);
		}

	//intercept packets
	scope.execute_cmds=function(initial) {
		return function(pkg) {
			initial.call(scope, pkg);
			for(var i=0, cmd, data; i<pkg.length; ++i) {
				cmd=pkg[i][0];
				data=pkg[i][1];
				if(dev) {
					console.log(cmd, data);
					}
				if(cmd==="a") {
					if(!ranked) {
						if(!options.fastgame) {
							scope.set_option("fastgame");
							}
						if(!options.nospectate) {
							scope.set_option("nospectate");
							}
						}
					}
				else if(cmd==="join") {
					log(data.user+" has joined");
					}
				else if(cmd==="leave") {
					log(data.user+" has left");
					}
				else if(cmd==="kill") {
					scope.users[data.target].dead=true;
					}
				else if(cmd==="kk") {
					scope.users[data.user].dead=true;
					}
				else if(cmd==="speech") {
					if(data.type==="contact") {
						log("The roles are... "+data.data.join(", "));
						}
					}
				else if(cmd==="ms") {
					if(data==="Zombie wins!") {
						log("brraaaaaaiiinnnsss...");
						}
					}
				else if(cmd==="m") {
					if(data.meet==="mafia" && data.choosedata) {
						for(var key in scope.users) {
							if(!data.choosedata[key] && !scope.users[key].dead) {
								if(!scope.users[key].revealed) {
									scope.select_role(key, "mafia");
									}
								if(data.members.indexOf(key)===-1) {
									log(key+" is your partner!");
									}
								}
							}
						}
					}
				}
			}
		}(scope.execute_cmds);

	//chat input
	$(window).on("keydown",function(event) {
		if(event.target.value===undefined) {
			$("#typebox").focus();
			}
		});
	scope.keypress=function(initial) {
		return function(event) {
			if(event.which===13) {
				var	input=event.target.value;
				if(input[0]==="/") {
					var	cmd=input.match(/\/(\w+)/)[1],
						data=input.match(/\/\w+\s?(.+)?/)[1];
					if(cmd==="dev") {
						dev=!dev;
						log(dev?"Logging on":"Logging off");
						}
					else if(cmd==="help") {
						log("/me - action message");
						log("/ping - ping living players");
						log("/join - join first open game");
						log("/host - host game with current setup");
						log("/games - list open games");
						}
					else if(cmd==="clear") {
						$(".ejack").remove();
						}
					else if(cmd==="ping") {
						var	ping=[];
						for(var key in scope.users) {
							if(!scope.users[key].dead) {
								ping.push(key);
								}
							}
						event.target.value=ping.join(" ");
						initial.call(scope, event);
						return;
						}
					else if(cmd==="kick") {
						if(data) {
							data=data.toLowerCase();
							for(var key in scope.users) {
								if(key.toLowerCase()===data) {
									scope.ban(scope.users[key].id);
									break;
									}
								}
							}
						}
					else if(cmd==="emotes") {
						log("global - "+Object.keys(_emotes).join(" "));
						log("lobby - "+Object.keys(lobby_emotes).join(" "));
						}
					else if(cmd==="whois") {
						if(data) {
							data=data.toLowerCase();
							for(var key in scope.users) {
								if(data==="all" || key.toLowerCase()===data) {
									log(key+" ("+scope.users[key].id+")");
									var	emotes=scope.users[key].emotes;
									log(" -- emotes: "+(
										emotes?Object.keys(emotes).join(" "):"none"
										));
									if(data!=="all") {
										break;
										}
									}
								}
							}
						}
					else if(cmd==="games") {
						var	a,
							div,
							chat=document.getElementById("window");
						lobbyGames({
							status_id: 0,
							password: false
							}, function(table) {
							a=document.createElement("a");
							a.textContent="Table "+table.id;
							a.addEventListener("click", function(event) {
								leaveand(function() {
									location.href="/game/"+table.id;
									});
								});
							div=document.createElement("div");
							div.className="log ejack";
							div.appendChild(a);
							div.appendChild(document.createTextNode(" - "+table.numplayers+" / "+table.target+" players"));
							chat.appendChild(div);
							chat.scrollTop=chat.scrollHeight;
							});
						}
					else if(cmd==="join") {
						lobbyGames({
							status_id: 0,
							target: 12,
							password: false
							}, function(table) {
								leaveand(function() {
									location.href="/game/"+table.id;
									});
								return true;
								}
							);
						}
					else if(cmd==="host") {
						leaveand(function() {
							$.getJSON("/game/add/mafia", {
								setupid: scope.setup_id,
								ranked: false,
								add_title: data===undefined?0:1,
								game_title: data
								}, function(json) {
									if(json[1].table) {
										location.href="/game/"+json[1].table;
										}
									}
								);
							});
						}
					else if(cmd==="leave") {
						scope.definite_leave();
						}
					else if(cmd==="me") {
						if(data) {
							initial.call(scope, event);
							return;
							}
						else {
							log("Add text!");
							log("i.e.: /me slaps Foxie with a fish");
							}
						}
					event.target.value="";
					return;
					}
				}
			initial.call(scope, event);
			};
		}(scope.keypress);

	//anti-votespam
	var	votetimes=[];
	$(document).on("click", ".one_booth_choice", function(event) {
		var	now=Date.now();
		for(var i=votetimes.length; i--;) {
			if(now-votetimes[i]>5000) {
				votetimes.splice(i, 1);
				}
			}
		votetimes.push(now);
		if(votetimes.length>5) {
			log("You're voting too fast!");
			event.stopPropogation();
			}
		});
	void function(eventlist) {
		eventlist.unshift(eventlist[eventlist.length-1]);
		eventlist.pop();
		}($._data(document).events.click);

	//utility
	function leaveand(callback) {
		scope.redirect_back=callback;
		scope.definite_leave();
		};
	function lobbyGames(criteria,callback) {
		$.ajax({url: "/game/find?page=1", method: "get"}).success(function(json) {
			var	criterion,
				openGames=[],
				games=JSON.parse(json[1]);
			games.data.forEach(function(table) {
				for(criterion in criteria) {
					if(criteria[criterion]!==table[criterion]) {
						return;
						}
					}
				openGames.push(table);
				})
			if(openGames.length===0) {
				log("No open games available!");
				}
			else {
				openGames.some(function(table) {
					return callback(table);
					});
				}
			});
		};

	//clickable links
	vocabs.push("https?://.+");
	$(document).delegate(".acronym", "click", function() {
		if(/\bhttps?:\/\/.+\b/ig.test(this.textContent)) {
			window.open(this.textContent, "_blank");
			}
		});

	//manage notes
	if(!scope.ranked) {
		$(document).on("mouseenter", ".user_li", function(event) {
			this.setAttribute("title", notes[this.dataset.uname]||"no notes for "+this.dataset.uname);
			});
		$(document).on("click", ".user_note", function(event) {
			var	user=scope.selected_user;
			if(user.details.notes===undefined) {
				user.details.notes=notes[user.username]||"";
				$(".notes").val(user.details.notes);
				}
			});
		$(".notes").on("keyup",function(event) {
			notes[scope.selected_user.username]=this.value;
			});
		}

	//save settings
	$(window).on("beforeunload",function(event) {
		localStorage.notes=JSON.stringify(notes);
		localStorage.ejsettings=JSON.stringify(settings);
		});

	}+"()");
window.addEventListener("load", function(event) {
	document.body.appendChild(inject);
	});