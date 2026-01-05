// ==UserScript==
// @name         EM Console
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      0.63
// @description  A console to run quick commands on Epicmafia
// @author       Croned
// @match        https://epicmafia.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27646/EM%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/27646/EM%20Console.meta.js
// ==/UserScript==

(function(window) {
    'use strict';
	
	if(!window.jQuery) {
	   var script = document.createElement('script');
	   script.type = "text/javascript";
	   script.src = "https://code.jquery.com/jquery-latest.js";
	   document.head.appendChild(script);
	}
	
	var localStorage = window.localStorage;
	var app = localStorage.emconsole;
	if (app) {
		app = JSON.parse(app);
	}
	else {
		app = {
			version: "0.22",
			show: "none",
			goto: {
				mods: "/moderator",
				home: "/home",
				round: "/round",
				reports: "/reports",
				pm: "/message",
				pms: "/message",
				msg: "/message",
				message: "/message",
				family: "/family",
				forum: "/forum",
				forums: "/forum"
			},
			lobbies: {
				main: 1,
				sandbox: 5,
				sbox: 5,
				games: 6,
				survivor: 27,
				vivor: 27
			},
			custom: {
				commands: {}
			}
		};
	}
	
    var containerCSS = "\
        position: fixed;\
        width: 100%;\
        padding: 3px;\
        text-align: center;\
        bottom: 0px;\
        display: " + app.show + ";\
		z-index: 100;\
    ";
    var consoleCSS = "\
        width: 50%;\
        height: 20px;\
		-webkit-box-shadow: 0px 0px 20px 1px rgba(0,0,0,0.75);\
		-moz-box-shadow: 0px 0px 20px 1px rgba(0,0,0,0.75);\
		box-shadow: 0px 0px 20px 1px rgba(0,0,0,0.75);\
    ";
    var container = document.createElement("div");
    var cons = document.createElement("input");
	
	var helpPage = "\
		<h1>EM Console Commands</h1>\
		* = optional\
		<ul>\
			<li>\
				<b>help</b> - Show this page\
			</li>\
			<li>\
				<b>[goto, go]</b> - Navigate to the specified page\
				<ul>\
					<li><i>go mods</i></li>\
					<li><i>go home</i></li>\
					<li><i>go round</i></li>\
					<li><i>go reports</i></li>\
					<li><i>go family</i></li>\
					<li><i>go [pm, pms, msg, message]</i></li>\
					<li><i>go [forum, forums]</i></li>\
					<li><i>go [lobby, l] *[name, id]</i></li>\
					<li><i>go user *[name, id]</i></li>\
				</ul>\
			</li>\
			<li>\
				<b>[back, b]</b> - Navigate back in history\
			</li>\
			<li>\
				<b>[foreward, fwd, fr]</b> - Navigate foreward in history\
			</li>\
			<li>\
				<b>[refresh, re, r]</b> - Refresh the page\
			</li>\
			<li>\
				<b>top</b> - Scroll to top of page\
			</li>\
			<li>\
				<b>[bottom, bot]</b> - Scroll to bottom of page\
			</li>\
			<li>\
				<b>[up, u]</b> - Scroll up partially\
			</li>\
			<li>\
				<b>[down, d]</b> - Scroll down partially\
			</li>\
			<li>\
				<b>pm</b> - Send a private message\
				<ul>\
					<li><i>pm [name, id] message</i></li>\
				</ul>\
			</li>\
			<li>\
				<b>set</b> - Customize the console\
				<ul>\
					<li><i>set cmd [newCommand] [oldCommand]</i> - Make/edit a custom command that mimics a preexisting one</li>\
					<li><i>set goto [key] [url]</i> - Make/edit a goto key</li>\
					<li><i>set delete [command]</i> - Deletes a custom command</li>\
					<li><i>set delete goto [key]</i> - Deletes a goto key</li>\
				</ul>\
			</li>\
			<li>\
				<b>[forum, f]</b> - Navigate the forums\
				<ul>\
					<li><i>f [next, n]</i> - Go to next page</li>\
					<li><i>f [prev, pr]</i> - Go to previous page</li>\
					<li><i>f [first, f]</i> - Go to first page</li>\
					<li><i>f [last, l]</i> - Go to last page</li>\
					<li><i>f [page, p] page#</i> - Go to specific page</li>\
					<li><i>f [recent, re] index</i> - Go to specific thread from recent topics in lobby</li>\
				</ul>\
			</li>\
			<li>\
				<b>poke</b> - Return all pokes from user page\
			</li>\
			<li>\
				<b>alt</b> - Switch to an alt\
				<ul>\
					<li><i>alt [name, partialName]</i></li>\
				</ul>\
			</li>\
		</ul>\
	";
	
    var process = function (cmd) {
		var shouldSave = true;
        var args = cmd.toLowerCase().split(" ");
		
		try {
			switch (args[0]) {
				case "help":
					window.open().document.body.innerHTML += helpPage;
					break;
				case "goto":
				case "go":
					switch (args[1]) {
						case "lobby":
						case "l":
							if (args.length > 2) {
								var lobbyButton;
								if (!parseInt(args[2])) {
									lobbyButton = document.querySelectorAll("[ng-click='goto_lobby(" + app.lobbies[args[2]] + ")']");
									if (window.location.pathname == "/lobby" && lobbyButton.length) {
										lobbyButton[0].click();
									}
									else {
										window.location.href = "/lobby#?id=" + app.lobbies[args[2]];
									}
								}
								else {
									lobbyButton = document.querySelectorAll("[ng-click='goto_lobby(" + args[2] + ")']");
									if (window.location.pathname == "/lobby" && lobbyButton.length) {
										lobbyButton[0].click();
									}
									else {
										window.location.href = "/lobby#?id=" + args[2];
									}
								}
							}
							else {
								window.location.href = "/lobby";
							}
							
							if (window.location.pathname == "/lobby") {
								window.location.reload();
							}
							break;
						case "user":
							if (args.length > 2) {
								if (!parseInt(args[2])) {
									getId(args[2], function (id) {
										if (id) {
											window.location.href = "/user/" + id;
										}
									});
								}
								else {
									window.location.href = "/user/" + args[2];
								}
							}
							else {
								window.location.href = "/user";
							}
							break;
						default:
							if (app.goto[args[1]]) {
								window.location.href = app.goto[args[1]];
							}
					}
					break;
				case "back":
				case "b":
					window.history.back();
				case "forward":
				case "fwd":
				case "fr":
					window.history.forward();
					break;
				case "reset":
					shouldSave = false;
					localStorage.removeItem("emconsole");
					window.location.reload();
					break;
				case "refresh":
				case "re":
				case "r":
					window.location.reload();
					break;
				case "top":
					window.scrollTo(0, 0);
					break;
				case "bottom":
				case "bot":
					window.scrollTo(0,document.body.scrollHeight);
					break;
				case "up":
				case "u":
					window.scroll(0, window.scrollY - 500);
					break;
				case "down":
				case "d":
					window.scroll(0, window.scrollY + 500);
					break;
				case "pm":
					var msg = "";
					for (var i = 2; i < args.length; i++) {
						msg += (args[i] + " ");
					}
					
					if (!parseInt(args[1])) {
						getId(args[1], function (id) {
							$.post("/message", {msg: msg, subject: "", "recipients[]": id});
						});
					}
					else {
						$.post("/message", {msg: msg, subject: "", "recipients[]": args[1]});
					}
					break;
				case "set":
					switch(args[1]) {
						case "cmd":
							app.custom.commands[args[2]] = args[3];
							break;
						case "delete":
							switch (args[2]) {
								case "goto":
									delete app.goto[args[3]];
									break;
								default:
									delete app.custom.commands[args[2]];
							}
							break;
						case "goto":
							app.goto[args[2]] = args[3];
							break;
					}
					break;
				case "forum":
				case "f":
					var curButton = document.getElementsByClassName("selected")[0];
					switch(args[1]) {
						case "next":
						case "n":
								window.location.href = curButton.nextSibling.childNodes[0].href;
							break;
						case "prev":
						case "pr":
							window.location.href = curButton.previousSibling.childNodes[0].href;
							break;
						case "last":
						case "l":
							window.location.href = document.getElementsByClassName("pagenav")[0].childNodes[document.getElementsByClassName("pagenav")[0].childNodes.length - 1].childNodes[0].href;
							break;
						case "first":
						case "f":
							window.location.href = document.getElementsByClassName("pagenav")[0].childNodes[0].childNodes[0].href;
							break;
						case "page":
						case "p":
							window.location.href = "/topic/" + window.location.pathname.split("/")[2] + "?page=" + args[2];
							break;
						case "recent":
						case "re":
							window.location.href = document.getElementsByClassName("recent_topic")[args[2] - 1].childNodes[1].childNodes[0].href;
							break;
					}
					break;
				case "poke":
					var pokes = [];
					var i = 0;
					var poke = function () {
						$.get(pokes[i], function () {
							i ++;
							if (i < pokes.length) {
								poke();
							}
						});
					};
					
					$(".poke_back").each(function() {
						pokes.push($(this).attr("href"));
					});
					poke();
					break;
				case "alt":
					$.get("/user/alts", function (data) {
						data = data.alts;
						if (parseInt(args[1])) {
							window.location.href = "/user/load/" + data[args[1]].id;
						}
						else {
							for (var i in data) {
								if (data[i].username.toLowerCase().indexOf(args[1]) != -1) {
									window.location.href = "/user/load/" + data[i].id;
								}
							}
						}
					});
					break;
				case "close":
					window.close();
					break;
				default:
					if (app.custom.commands[args[0]]) {
						args[0] = app.custom.commands[args[0]];
						process(args.join(" "));
					}
			}
		}
		catch (e) {
			//error
		}
		
		if (shouldSave) {
			save();
		}
    };
    
    var save = function () {
        localStorage.emconsole = JSON.stringify(app);
    };
	
    var getId = function (name, cb) {
        var id;
        $.get("https://epicmafia.com/user/search?q=" + name, function (data) {
            data = data.data;
            if (data.length > 0) {
                id = data[0].id;
                cb(id);
            }
            else {
				cb(false);
            }
        });
    };
	
	var error = function (err) {
		//
		console.log(err);
	};
    
    container.id = "console";
    container.style.cssText = containerCSS;
    cons.style.cssText = consoleCSS;
    
    container.appendChild(cons);
    document.body.appendChild(container);

    document.onkeydown = function (e) {
        if (e.which == 192 && e.ctrlKey) {
            if (container.style.display == "none") {
                container.style.display = "block";
                cons.focus();
				app.show = "block";
				save();
            }
            else {
                container.style.display = "none";
				app.show = "none";
				save();
            }
        }
        else if (e.which == 27) {
            //escape
            container.style.display = "none";
			app.show = "none";
			save();
        }
        else if (e.which == 13 && container.style.display == "block") {
            //enter
            process(cons.value);
			cons.value = "";
        }
		else if (e.which == 192 && app.show == "block") {
			//~
			e.preventDefault();
			cons.focus();
		}
    };
	
	cons.focus();
	if (app.version != GM_info.script.version) {
		window.open().document.body.innerHTML += "\
		<h1>What's new in EM Console version " + GM_info.script.version + "</h1>\
		<ul>\
			<li>Added ability to return all pokes from user page</li>\
			<li>Added alt switching</li>\
		</ul>\
		";
		app.version = GM_info.script.version;
		save();
	}
	
})(window);