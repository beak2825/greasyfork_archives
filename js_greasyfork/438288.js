// ==UserScript==
// @name         Bonk.io hax
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  hax bonk.io
// @author       mastery3
// @license      GNU
// @match        https://bonk.io/gameframe-release.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/438288/Bonkio%20hax.user.js
// @updateURL https://update.greasyfork.org/scripts/438288/Bonkio%20hax.meta.js
// ==/UserScript==
let injector = function(originalSrc) {
    let src = originalSrc;
    src = `
	 	    var fullscreenconsoleactivated = false;
		    window.bonkExposed = {};
	`       + src;
    src = src.replace(
        /(?<=\[[A-Za-z0-9]*\.[A-Za-z0-9]*\(107\),[A-Za-z0-9]*\.[A-Za-z0-9]*\(1131\),[A-Za-z0-9]*\.[A-Za-z0-9]*\(1132\),[A-Za-z0-9]*\.[A-Za-z0-9]*\(1133\),[A-Za-z0-9]*\.[A-Za-z0-9]*\(116\))\];/,
        ", 'bs', 'v'];");

    const RED_FUNCTION_NAME = src.match(

        /(?<=function )[A-Za-z0-9]*(?=\(\)\{var [A-Za-z0-9]*=\[arguments\];[A-Za-z0-9]*\[4\]=[A-Za-z0-9]*;[A-Za-z0-9]*\[3\][A-Za-z0-9]*\[[A-Za-z0-9]*\[4\]\[782\]\]\(2\);\})/)[0];
    src = src.replace(
        /(?<=function [A-Za-z0-9]*\(\)\{var [A-Za-z0-9]*=\[arguments\];[A-Za-z0-9]*\[4\]=[A-Za-z0-9]*;[A-Za-z0-9]*\[3\][A-Za-z0-9]*\[[A-Za-z0-9]*\[4\]\[782\]\]\(2\);\})/,
        "; window.bonkExposed.red = " + RED_FUNCTION_NAME + ";");

    const GREEN_FUNCTION_NAME = src.match(
        /(?<=function )[A-Za-z0-9]*(?=\(\)\{var [A-Za-z0-9]*=\[arguments\];[A-Za-z0-9]*\[4\]=[A-Za-z0-9]*;[A-Za-z0-9]*\[3\]\[[A-Za-z0-9]*\[4\]\[782\]\]\(4\);\})/)[0];
    src = src.replace(
        /(?<=function [A-Za-z0-9]*\(\){var [A-Za-z0-9]*=\[arguments\];[A-Za-z0-9]*\[4\]=[A-Za-z0-9]*;[A-Za-z0-9]*\[3\]\[[A-Za-z0-9]*\[4\]\[782\]\]\(4\);})/,
        "; window.bonkExposed.green = " + GREEN_FUNCTION_NAME + ";");

    const BLUE_FUNCTION_NAME = src.match(
        /(?<=function )[A-Za-z0-9]*(?=\(\)\{var [A-Za-z0-9]*=\[arguments\];[A-Za-z0-9]*\[7\]=[A-Za-z0-9]*;[A-Za-z0-9]*\[3\]\[[A-Za-z0-9]*\[7\]\[782\]\]\(3\);\})/)[0];
    src = src.replace(
        /(?<=function [A-Za-z0-9]*\(\)\{var [A-Za-z0-9]*=\[arguments\];[A-Za-z0-9]*\[7\]=[A-Za-z0-9]*;[A-Za-z0-9]*\[3\]\[[A-Za-z0-9]*\[7\]\[782\]\]\(3\);\})/,
        "; window.bonkExposed.blue = " + BLUE_FUNCTION_NAME + ";");

    const YELLOW_FUNCTION_NAME = src.match(
        /(?<=function )[A-Za-z0-9]*(?=\(\)\{[A-Za-z0-9]*\.[A-Za-z0-9]*\(\);var [A-Za-z0-9]*=\[arguments\];[A-Za-z0-9]*\[3\]=[A-Za-z0-9]*;[A-Za-z0-9]*\[3\]\[[A-Za-z0-9]*\[3\]\[782\]\]\(5\);\})/)[0];
    src = src.replace(
        /(?<=function [A-Za-z0-9]*\(\)\{[A-Za-z0-9]*\.[A-Za-z0-9]*\(\);var [A-Za-z0-9]*=\[arguments\];[A-Za-z0-9]*\[3\]=[A-Za-z0-9]*;[A-Za-z0-9]*\[3\]\[[A-Za-z0-9]*\[3\]\[782\]\]\(5\);\})/,
        "; window.bonkExposed.yellow = " + YELLOW_FUNCTION_NAME + ";");

    const FFA_FUNCTION_NAME = src.match(
        /(?<=function )[A-Za-z0-9]*(?=\(\)\{var [A-Za-z0-9]*=\[arguments\];[A-Za-z0-9]*\[4\]=[A-Za-z0-9]*;if\([A-Za-z0-9]*\[0\]\[2\]\[[A-Za-z0-9]*\[4\]\[114\]\] == false\)\{[A-Za-z0-9]*\[3\]\[D3G\[4\]\[782\]\]\(1\);\}else \{[A-Za-z0-9]*\[3\]\[[A-Za-z0-9]*\[4\]\[782\]\]\(2\);\})/)[0];
    src = src.replace(
        /(function [A-Za-z0-9]*\(\)\{var [A-Za-z0-9]*=\[arguments\];[A-Za-z0-9]*\[4\]=[A-Za-z0-9]*;if\([A-Za-z0-9]*\[0\]\[2\]\[[A-Za-z0-9]*\[4\]\[114\]\] == false\)\{[A-Za-z0-9]*\[3\]\[D3G\[4\]\[782\]\]\(1\);\}else \{[A-Za-z0-9]*\[3\]\[[A-Za-z0-9]*\[4\]\[782\]\]\(2\);\}\})/,
        "$1; window.bonkExposed.ffa = " + FFA_FUNCTION_NAME + ";");
    src = src.replace(
        /(?<=function [A-Za-z0-9]*\(\)\{var [A-Za-z0-9]*=\[arguments\];[A-Za-z0-9]*\[4\]=[A-Za-z0-9]*;if\()[A-Za-z0-9]*\[0\]\[2\]\[[A-Za-z0-9]*\[4\]\[114\]\] == false(?=\)\{[A-Za-z0-9]*\[3\]\[D3G\[4\]\[782\]\]\(1\);\}else \{[A-Za-z0-9]*\[3\]\[[A-Za-z0-9]*\[4\]\[782\]\]\(2\);\}\})/,
        "true");


    const SPEC_FUNCTION_NAME = src.match(
        /(?<=function )[A-Za-z0-9]*(?=\(\)\{[A-Za-z0-9]*\.[A-Za-z0-9]*\(\);var [A-Za-z0-9]*=\[arguments\];[A-Za-z0-9]*\[3\]=[A-Za-z0-9]*;[A-Za-z0-9]*\[3\]\[[A-Za-z0-9]*\[3\]\[782\]\]\(0\);\})/)[0];
    src = src.replace(
        /(?<=function [A-Za-z0-9]*\(\)\{[A-Za-z0-9]*\.[A-Za-z0-9]*\(\);var [A-Za-z0-9]*=\[arguments\];[A-Za-z0-9]*\[3\]=[A-Za-z0-9]*;[A-Za-z0-9]*\[3\]\[[A-Za-z0-9]*\[3\]\[782\]\]\(0\);\})/,
        "; window.bonkExposed.spec = " + SPEC_FUNCTION_NAME + ";");


    src = src.replace(
        /(?<=[A-Za-z0-9]*\[0\]\[0\]\[[A-Za-z0-9]*\[2\]\[367\]\] == 13)/,
        "&& !fullscreenconsoleactivated");
    src = src.replace(
        /(?<=[A-Za-z0-9]*\[0\]\[0\]\[[A-Za-z0-9]*\[6\]\[367\]\] === 13 && [A-Za-z0-9]*\[36\] == false)/,
        "&& !fullscreenconsoleactivated");


    src = src.replace(
        /[A-Za-z0-9]*\[0\]\[2\]\[[A-Za-z0-9]*\[1\]\[565\]\]=Math\[[A-Za-z0-9]*\[1\]\[193\]\]\(Math\[[A-Za-z0-9]*\[1\]\[192\]\]\(1,[A-Za-z0-9]*\[0\]\[2\]\[[A-Za-z0-9]*\[1\]\[565\]\]\),9\);if\(isNaN\([A-Za-z0-9]*\[0\]\[2\]\[[A-Za-z0-9]*\[1\]\[565\]\]\)\)\{[A-Za-z0-9]*\[0\]\[2\]\[[A-Za-z0-9]*\[1\]\[565\]\]=3;\}/, ""
    );

    src = src.replace(
        /[A-Za-z0-9]*\[86\]\[[A-Za-z0-9]*\[1\]\[744\]\]=[A-Za-z0-9]*\[0\]\[2\][[A-Za-z0-9]*\[1\]\[565\]\]/, ""
    );


    src = src.replace(
        /(?<=function [A-Za-z0-9]*\([A-Za-z0-9]*\)\{var [A-Za-z0-9]*=\[arguments\];[A-Za-z0-9]*\[1\]=[A-Za-z0-9]*;if\([A-Za-z0-9]*\[86\]\[[A-Za-z0-9]*\[1\]\[744\]\] == [A-Za-z0-9]*\.[A-Za-z0-9]*\(1768\)\)\{return;\}[A-Za-z0-9]*\[0\]\[2\]\[[A-Za-z0-9]*\[1\]\[565\]\]=)parseInt/,
        "parseFloat"
    );

    src += `(function() {
		function saferEval() { // See, this is why you generally don't use eval.
			arguments[1] = arguments[1] ?? {};
			let INTERNAL_ARGUMENTS_OLD = Object.assign({}, arguments); // Move "arguments" to a new variable.
			this.arguments = {}; // We need to use 'this' here; using let will result in a "Cannot access arguments before initialization" error.
			for (let i in INTERNAL_ARGUMENTS_OLD[1]) {
				this[i] = INTERNAL_ARGUMENTS_OLD[1][i]; // Create new variables for imported variables.
			};
			return eval("INTERNAL_ARGUMENTS_OLD = undefined; undefined; " + INTERNAL_ARGUMENTS_OLD[0]); // We need to disable INTERNAL_ARGUMENTS_OLD, but we must let the javascript expand first.
		}
		(function(){
						let fullscreenconsole = document.createElement("div");
				fullscreenconsole.id = "console";
				fullscreenconsole.className = "console";
				fullscreenconsole.style.display = "block";
				fullscreenconsole.style.position = "absolute";
				fullscreenconsole.style.left = "0px";
				fullscreenconsole.style.top = "0px";
				fullscreenconsole.style.width = "100%";
				fullscreenconsole.style.height = "100%";
				fullscreenconsole.style.backgroundColor = "#000000";
				fullscreenconsole.style.color = "#FFFFFF";
				fullscreenconsole.style.fontFamily = "'Fira Code'";
				fullscreenconsole.style.wordWrap = "break-word";
				fullscreenconsole.style.overflow = "hidden";
				fullscreenconsole.innerHTML = "<text style='color: lime'>Welcome to the console!<br/> - If you got here accidentally, you can exit by using Ctrl+Alt+C.<br/> - Type 'help' for some commands.<br/> - Enjoy!<br/><br/></text><text style='color: lime'>&gt;&gt; </text>";
				let charsTyped = 0;
				let charsTypedValue = "";
				let textA = false;
				fullscreenconsole.style.display = "none";
			let consoleOn = false;
						function displayInConsole(html) {
					if (textA) {
						fullscreenconsole.innerHTML = fullscreenconsole.innerHTML.slice(0, -1) + html + "_";
					} else {
						fullscreenconsole.innerHTML += html;
					}
					$(fullscreenconsole).scrollTop(Number.MAX_SAFE_INTEGER);
				};
				function addInput(char) {
					charsTyped += 1;
					charsTypedValue += char;
					displayInConsole(char);
				};
			var bonk = {};
			window.bonk = bonk;
			function sleep(ms) {
				return new Promise(resolve => setTimeout(resolve, ms));
			}
			bonk.chat = function chat(arg, options) {
				options = options ?? {};
				let prev_message = document.getElementById("newbonklobby_chat_input").value;
				let prev_message2 = document.getElementById("ingamechatinputtext").value;
				options.nospace = options.nospace ?? false;
				document.getElementById("newbonklobby_chat_input").value = (!options.nospace ? " " : "") + arg;

				document.getElementById("ingamechatinputtext").value = (!options.nospace ? " " : "") + arg;
				document.fire("keydown", {keyCode:13});
				document.fire("keydown", {keyCode:13});
				document.getElementById("newbonklobby_chat_input").value = prev_message;
				document.getElementById("ingamechatinputtext").value = prev_message2;
			}

			bonk.setTeam = function setTeam(a, b) {
				if (b === undefined) {
					if (a === "spec") {
						bonkExposed.spec();
					} else if (a === "ffa") {
						bonkExposed.ffa();
					} else if (a === "red" || (a === "random" && Math.random() < 0.25)) {
						bonkExposed.red();
					} else if (a === "yellow" || (a === "random" && Math.random() < 0.33)) {
						bonkExposed.yellow();
					} else if (a === "green" || (a === "random" && Math.random() < 0.5)) {
						bonkExposed.green();
					} else if (a === "blue" || (a === "random")) {
						bonkExposed.blue();
					} else {
						throw Error("Invalid team " + a + ".");
					}
				} else if (b === "all") {
					bonk.setAllTeam(a);
				} else {
					window.document.getElementsByClassName("newbonklobby_playerentry")[b].click();
					if (window.document.getElementsByClassName("newbonklobby_playerentry_menu_button").length === 1) {
						if (window.document.getElementsByClassName("newbonklobby_playerentry_menu_button")[0].innerHTML === "MOVE TO...") {
							window.document.getElementsByClassName("newbonklobby_playerentry_menu_button")[0].click();
							if (a === "spec") {
								window.document.getElementsByClassName("newbonklobby_playerentry_menu_button")[1].click();
							} else if (a === "ffa") {
								bonkExposed.ffa();
							} else if (a === "red" || (a === "random" && Math.random() < 0.25)) {
								bonkExposed.red();
							} else if (a === "yellow" || (a === "random" && Math.random() < 0.33)) {
								bonkExposed.yellow();
							} else if (a === "green" || (a === "random" && Math.random() < 0.5)) {
								bonkExposed.green();
							} else if (a === "blue" || a === "random") {
								bonkExposed.blue();
							}
						} else {
							throw Error("You are not host.");
						}
					} else if (window.document.getElementsByClassName("newbonklobby_playerentry_menu_button").length === 4) {
						window.document.getElementsByClassName("newbonklobby_playerentry_menu_button")[2].click();
						if (a === "spec") {
							window.document.getElementsByClassName("newbonklobby_playerentry_menu_button")[4].click();
						} else if (a === "ffa") {
							window.document.getElementsByClassName("newbonklobby_playerentry_menu_button")[5].click();
						} else if (a === "red" || (a === "random" && Math.random() < 0.25)) {
							window.document.getElementsByClassName("newbonklobby_playerentry_menu_button")[6].click();
						} else if (a === "yellow" || (a === "random" && Math.random() < 0.33)) {
							window.document.getElementsByClassName("newbonklobby_playerentry_menu_button")[9].click();
						} else if (a === "green" || (a === "random" && Math.random() < 0.5)) {
							window.document.getElementsByClassName("newbonklobby_playerentry_menu_button")[8].click();
						} else if (a === "blue" ||(a === "random")) {
							window.document.getElementsByClassName("newbonklobby_playerentry_menu_button")[7].click();
						}
					} else if (window.document.getElementsByClassName("newbonklobby_playerentry_menu_button").length === 5) {
						window.document.getElementsByClassName("newbonklobby_playerentry_menu_button")[2].click();
						if (a === "spec") {
							window.document.getElementsByClassName("newbonklobby_playerentry_menu_button")[5].click();
						} else if (a === "ffa") {
							window.document.getElementsByClassName("newbonklobby_playerentry_menu_button")[6].click();
						} else if (a === "red" || (a === "random" && Math.random() < 0.25)) {
							window.document.getElementsByClassName("newbonklobby_playerentry_menu_button")[7].click();
						} else if (a === "yellow" || (a === "random" && Math.random() < 0.33)) {
							window.document.getElementsByClassName("newbonklobby_playerentry_menu_button")[10].click();
						} else if (a === "green" || (a === "random" && Math.random() < 0.5)) {
							window.document.getElementsByClassName("newbonklobby_playerentry_menu_button")[9].click();
						} else if (a === "blue" ||(a === "random")) {
							window.document.getElementsByClassName("newbonklobby_playerentry_menu_button")[8].click();
						}
					} else {
						throw new Error("Not implemented.");
					}
				}
			}
			bonk.setAllTeam = function setAllTeam(a) {
				for(var i=0;i<7;i++){
					try {
						bonk.setTeam(a, i);
					} catch(e) {
						console.error(e);
					}
				}
			}
			bonk.breakGame = function breakGame(a) {
				while (window.document.getElementById("newbonklobby_modetext").innerHTML != "Football") {
					window.document.getElementById("newbonklobby_modebutton").click();
				};
				window.document.getElementById("newbonklobby_teamsbutton").click();
			}
			bonk.ready = function ready() {
				window.document.getElementById("newbonklobby_readybutton").click();
			}
			bonk.start = function start() {
				window.document.getElementById("newbonklobby_startbutton").click();
			}
			function displayInChat(message, LobbyColor, InGameColor, options) {
				options = options ?? {};
				LobbyColor = LobbyColor ?? "#8800FF";
				InGameColor = InGameColor ?? "#AA88FF";
				let A = document.createElement("div");
				let B = document.createElement("span");
				B.className = "newbonklobby_chat_status";
				B.style.color = LobbyColor;
				A.appendChild(B);
				B.innerHTML = (options.sanitize ?? true) ? message.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;') : message;
				let C = document.createElement("div");
				let D = document.createElement("span");
				D.style.color = InGameColor;
				C.appendChild(D);
				let a = false;
				if(document.getElementById("newbonklobby_chat_content").scrollHeight - document.getElementById("newbonklobby_chat_content").scrollTop > document.getElementById("newbonklobby_chat_content").clientHeight - 1) {
					a = true;
				}
				document.getElementById("newbonklobby_chat_content").appendChild(A);
				document.getElementById("ingamechatcontent").appendChild(C);
				if (a) { $('#newbonklobby_chat_content').scrollTop(Number.MAX_SAFE_INTEGER); };
				$('#ingamechatcontent').scrollTop(Number.MAX_SAFE_INTEGER);
			}
			bonk.displayInChat = displayInChat;
			bonk.console = {};
			bonk.console.log = function(message) {
				if (consoleOn) {
					displayInConsole("~ " + message + "<br/>");
				} else {
					bonk.displayInChat("~ " + message, "#0044FF", "#6688FF");
				}
			};
			bonk.console.info = function(message) {
				if (consoleOn) {
					displayInConsole("(i) " + message + "<br/>");
				} else {
					bonk.displayInChat("(i) " + message, "#0044FF", "#6688FF");
				}
			};
			bonk.console.warn = function(message) {
				if (consoleOn) {
					displayInConsole("<text style='color: orange'>} " + message + "<br/></text>");
				} else {
					bonk.displayInChat("} " + message, "#CC6600", "#FFFF00");
				};

			};
			bonk.console.error = function(message) {
				if (consoleOn) {
				displayInConsole("<text style='color: red'>! " + message + "<br/></text>");
				} else {
					bonk.displayInChat("! " + message, "#FF0000", "#FF4444");
				};
			};
			bonk.console.clear = function() {
				if (!consoleOn) {
					bonk.clearChat();
				} else {
					document.getElementById("console").innerHTML = "";
				}
			};
			bonk.debug = false;
			bonk.console.debug = function(message) {
				if (bonk.debug) {
					bonk.displayInChat("# " + message, "#AAAAAA", "#AAAAAA");
				}
			};
			bonk.bindKeys = function bindKeys() {
				$(document).keydown(function(keyPressed) {
					if (keyPressed.keyCode === 13 && keyPressed.altKey) {
						if (keyPressed.shiftKey) {
							bonk.start();
							// Alt+Shift+Enter
						} else {
							bonk.ready(); // Alt+Enter
						}
						return false;
					} else if (keyPressed.keyCode === 82 && keyPressed.altKey) {
						if (keyPressed.shiftKey) {
							bonk.setAllTeam("red"); // Alt+Shift+R
						}
						else {
							bonk.setTeam("red"); // Alt+R
						}
					} else if (keyPressed.keyCode === 89 && keyPressed.altKey) {
						if (keyPressed.shiftKey) {
							bonk.setAllTeam("yellow"); // Alt+Shift+Y
							return false;
						}
						else {
							bonk.setTeam("yellow"); // Alt+Y
						}
						return false;
					} else if (keyPressed.keyCode === 71 && keyPressed.altKey) {
						if (keyPressed.shiftKey) {
							bonk.setAllTeam("green"); // Alt+Shift+G
						}
						else {
							bonk.setTeam("green"); // Alt+G
						}
					} else if (keyPressed.keyCode === 66 && keyPressed.altKey) {
						if (keyPressed.shiftKey) {
							bonk.setAllTeam("blue"); // Alt+Shift+B
							return false;
						}
						else {
							bonk.setTeam("blue"); // Alt+B
						}
					} else if (keyPressed.keyCode === 191 && keyPressed.altKey) {
						if (keyPressed.shiftKey) {
							bonk.setAllTeam("random"); // Alt+Shift+?
						}
						else {
							bonk.setTeam("random"); // Alt+?
						}
					} else if (keyPressed.keyCode === 70 && keyPressed.altKey) {
						if (keyPressed.shiftKey) {
							bonk.setAllTeam("ffa"); // Alt+Shift+F
						}
						else {
							bonk.setTeam("ffa"); // Alt+F
						}
					} else if (keyPressed.keyCode === 83 && keyPressed.altKey) {
						if (keyPressed.shiftKey) {
							bonk.setAllTeam("spec"); // Alt+Shift+S
						}
						else {
							bonk.setTeam("spec"); // Alt+S
						}
						return false;
					} else if (keyPressed.keyCode === 77 && keyPressed.altKey) {
						document.getElementById("newbonklobby_modebutton").click(); // Alt+M
					} else if (keyPressed.keyCode === 84 && keyPressed.altKey) {
						document.getElementById("newbonklobby_teamsbutton").click(); // Alt+T
					}
				});
			}
			bonk.clearChat = function() {
				while(document.getElementById("newbonklobby_chat_content").children.length > 0) {
					document.getElementById("newbonklobby_chat_content").children[0].remove();
				}
				while(document.getElementById("ingamechatcontent").children.length > 0) {
					document.getElementById("ingamechatcontent").children[0].remove();
				}
			};
			bonk.readMessage = function readMessage(a) {
				var b = {};
				if (document.querySelectorAll("#ingamechatcontent .ingamechatname") === null || document.querySelectorAll("#ingamechatcontent .ingamechatname") === undefined) {
					return { name: null, message: null };
				};
				if (document.querySelectorAll("#ingamechatcontent .ingamechatname")[document.querySelectorAll("#ingamechatcontent .ingamechatname").length+a] === null || document.querySelectorAll("#ingamechatcontent .ingamechatname")[document.querySelectorAll("#ingamechatcontent .ingamechatname").length+a] === undefined) {
					return { name: null, message: null };
				};
				if (a < 0) {
					b.name = document.querySelectorAll("#ingamechatcontent .ingamechatname")[document.querySelectorAll("#ingamechatcontent .ingamechatname").length+a].innerHTML.replace(/\\&lt;/, "<").replace(/\\&gt;/, ">").replace(/\\&amp;/, "&").slice(0, -1);
					b.message = document.querySelectorAll("#ingamechatcontent .ingamechatmessage")[document.querySelectorAll("#ingamechatcontent .ingamechatmessage").length+a].innerHTML.replace(/\\&lt;/, "<").replace(/\\&gt;/, ">").replace(/\\&amp;/, "&").slice(1);
				} else {
					b.name = document.querySelectorAll("#ingamechatcontent .ingamechatname")[a].innerHTML.replace(/\\&lt;/, "<").replace(/\\&gt;/, ">").replace(/\\&amp;/, "&").slice(0, -1);
					b.message = document.querySelectorAll("#ingamechatcontent .ingamechatmessage")[a].innerHTML.replace(/\\&lt;/, "<").replace(/\\&gt;/, ">").replace(/\\&amp;/, "&").slice(1);
				}
				return b;
			}
			let command = (function() {
				let output = function(...args) {
					return output.execute(...args);
				};
				let commands = {};
				class Parse_T {
					constructor() {
					}
				}
				function parse_1(input, options) {
					options = options ?? {};
					let output = new Parse_T();

					output.tokens = [];
					output.input = input;

					if (input == "") {
						return output;
					}

					let tokens = [];
					{
						let escaped = false;
						function addToOut(input) {
							if (tokens.length === 0 || tokens[tokens.length - 1].type !== "text") {
								tokens.push({type: "text", value: ""});
							};
							tokens[tokens.length - 1].value += input;
						};
						let stack = [];
						for (let i = 0; i < input.length; i += 1) {
							switch(input[i]) {
								case "\\\\":
									if (!escaped && (stack.length === 0 || stack[stack.length - 1] !== "\\'")) {
										escaped = true;
										addToOut("\\\\");
									} else {
										escaped = false;
										addToOut("\\\\");
									}
									break;
								case "\\"":
									if (!escaped && (stack.length === 0 || stack[stack.length - 1] !== "'")) {
										if (stack.length === 0 || (stack[stack.length - 1] !== "\\"")) {
											stack.push("\\"");
										} else {
											stack.pop();
										};
									}
									addToOut("\\"");
									break;
								case "~":
									if ((stack.length === 0 || (stack[stack.length - 1] !== "\\'"))) {
										if (!escaped && (stack.length === 0 || stack[stack.length - 1] !== "'") && i !== input.length - 1 && input[i + 1] === "{") {
											stack.push("~{");
											i += 2;
											tokens.push({type: "command", value: ""});
											var stack2 = [];
											for(; ; i++) {
												if (i === input.length) {
													if (stack2.length >= 0 && stack2[stack2.length - 1] === "\\'") {
														throw SyntaxError("Unclosed '.");
													} else if (stack2.length >= 0 && stack2[stack2.length - 1] == "\\"") {
														throw SyntaxError("Unclosed \\".");
													} else {
														throw SyntaxError("Unclosed ~{.");
													}
												}
												if (input[i] === "\\'") {
													if (stack2.length >= 0 && stack2[stack2.length - 1] === "\\'") {
														stack2.pop();
													} else if (stack2.length === 0 || stack2[stack2.length - 1] !== "\\"") {
														stack2.push("\\'");
													};
												} else if (input[i] === "\\"") {
													if (stack2.length >= 0 && stack2[stack2.length - 1] === "\\"") {
														stack2.pop();
													} else if (stack2.length === 0 || stack2[stack2.length - 1] !== "\\'") {
														stack2.push("\\"");
													};
												} else if (input[i] === "}" && stack2.length === 0) {
													break;
												}
												tokens[tokens.length - 1].value += input[i];
											}
											stack.pop();
										} else {
											addToOut("~");
										}
									} else {
										addToOut("~");
									}
									break;
								case "'":
									if (!escaped && (stack.length === 0 || stack[stack.length - 1] !== "\\"")) {
										if (stack.length === 0 || stack[stack.length - 1] !== "'") {
											stack.push("\\'");
										} else {
											stack.pop();
										};
									}
									addToOut("'");
									break;
								default:
									addToOut(input[i]);
									escaped = false;
									break;
							}
						}
						if (stack.length !== 0) {
							if (stack[stack.length - 1] === "\\"") {
								throw SyntaxError("Unclosed \\".");
							} else if (stack[stack.length - 1] === "'") {
								throw SyntaxError("Unclosed '.");
							}
						}
					}
					output.tokens = tokens;
					options.parse_1 = output;
					return output;
				};
				output.parse_1 = parse_1;

				function parse_2(input, options) {
					options = options ?? {};
					let output = "";
					for(let i = 0; i < input.tokens.length; i++) {
						if (input.tokens[i].type === "text") {
							output += input.tokens[i].value;
						} else if (input.tokens[i].type === "command") {
							output += executeCommand(input.tokens[i].value, options);
						}
					}
					options.parse_2 = output;
					return output;
				}
				output.parse_2 = parse_2;

				function parse_3(input, options) {
					options = options ?? {};
					let output = "";
					let doubleQuoted = false;
					let singleQuoted = false;
					let escaped = false;
					for(let i = 0; i < input.length; i++) {
						if (input[i] === "\\\\" && !escaped && !singleQuoted) {
							escaped = true;
						} else if (input[i] === "\\"" && !escaped && !singleQuoted) {
							doubleQuoted = !doubleQuoted;
						} else if (input[i] === "\\'" && !escaped && !doubleQuoted) {
							singleQuoted = !singleQuoted;
						} else {
							if ((input[i] === " " && doubleQuoted) || singleQuoted || escaped) {
								output += "\\\\";
							};
							output += input[i];
							escaped = false;
						}
					};
					options.parse_3 = output;
					return output;
				}
				output.parse_3 = parse_3;

				function parse_4(input, options) {
					options = options ?? {};
					let output = {};
					let escaped = false;
					output.command = "";
					output.arguments = [];
					let i = 0;
					for(; i < input.length; i++) {
						if (input[i] == " " && !escaped) {
							i++;
							break;
						} else if (input[i] == "\\\\" && !escaped) {
							escaped = true;
						} else {
							escaped = false;
							output.command += input[i];
						};
					};
					if (i === input.length) {
						return output;
					}
					output.arguments.push("");
					for(; i < input.length; i++) {
						if (input[i] == " " && !escaped) {
							output.arguments.push("");
						} else if (input[i] == "\\\\" && !escaped) {
							escaped = true;
						} else {
							escaped = false;
							output.arguments[output.arguments.length - 1] += input[i];
						};
					};
					options.parse_4 = output;
					return output;
				};
				output.parse_4 = parse_4;

				class Permissions {
					constructor() {
						let permissions = { permission_r: true, permission_w: true, permission_x: true };
						function allow(permission) {
							permissions["permission_" + permission] = true;
						}
						function deny(permission) {
							permissions["permission_" + permission] = false;
						};
						function unset(permission) {
							permissions["permission_" + permission] = undefined;
						};
						function get(permission) {
							return permissions["permission_" + permission];
						};
						this.allow = allow;
						this.deny = deny;
						this.unset = unset;
						this.get = get;
					};
				};

				output.Permissions = Permissions;

				let internal1 = (function() {
					let output = {};
					let commands = {};
					function setCommand(name, func, options) {
						options = options ?? {};
						options.permissions = options.permissions ?? new Permissions();
						options.input_reference = options.input_reference ?? { reference: undefined };
						options.parse_2_reference = options.parse_2_reference ?? { reference: undefined };
						options.parse_3_reference = options.parse_3_reference ?? { reference: undefined };
						if (options.permissions.get("w_command_" + name) ?? options.permissions.get("w_command") ?? options.permissions.get("w") ?? true) {
							commands["command_" + name] = { function: func, enabled: true, input_reference: options.input_reference, parse_2_reference: options.parse_2_reference , parse_3_reference: options.parse_3_reference };
						} else {
							throw Error("Access denied.");
						};
					};
					output.setCommand = setCommand;

					function setAlias(name, func, options) {
						options = options ?? {};
						options.permissions = options.permissions ?? new Permissions();
						if (options.permissions.get("w_alias_" + name) ?? options.permissions.get("w_command") ?? options.permissions.get("w") ?? true) {
							commands["alias_" + name] = { function: func, enabled: true };
						} else {
							throw Error("Access denied.");
						};
					};
					output.setAlias = setAlias;

					function getCommand(name, options) {
						options = options ?? {};
						options.permissions = options.permissions ?? new Permissions();
						options.parse_2_reference = options.parse_2_reference ?? {};
						options.input_reference = options.input_reference ?? {};
						options.parse_3_reference = options.parse_3_reference ?? {};
						options.input = options.input ?? "";
						options.parse_2 = options.parse_2 ?? "";
						options.parse_3 = options.parse_3 ?? "";
						if (options.permissions.get("r_command_" + name) ?? options.permissions.get("r_command") ?? options.permissions.get("r") ?? true) {
						} else {
							throw Error("Access denied.");
						};
						if (commands["command_" + name] !== undefined && commands["command_" + name].enabled === true) {
							return function (...args) {
								if (options.permissions.get("x_command_" + name) ?? options.permissions.get("x_command") ?? options.permissions.get("x") ?? true) {
									commands["command_" + name].input_reference.reference = options.input;
									commands["command_" + name].parse_2_reference.reference = options.parse_2;
									commands["command_" + name].parse_3_reference.reference = options.parse_3;
									return commands["command_" + name].function(...args);
								}
								else {
									throw Error("Access Denied.");
								};
							}
						} else {
							throw ReferenceError("Command '" + name.replace(/'/g, "'\\\\''") + "' not found.");
						};
					};
					output.getCommand = getCommand;

					function getAlias(name, options) {
						options = options ?? {};
						options.permissions = options.permissions ?? new Permissions();
						if (options.permissions.get("r_alias_" + name) ?? options.permissions.get("r_alias") ?? options.permissions.get("r") ?? true) {
						} else {
							throw Error("Access denied.");
						};
						if (commands["alias_" + name] !== undefined && commands["alias_" + name].enabled === true) {
							return commands["alias_" + name].function;
						} else {
							throw ReferenceError("Alias '" + name.replace(/'/g, "'\\\\''") + "' not found.");
						};
					};
					output.getAlias = getAlias;

					function commandEnabled(name, options) {
						options = options ?? {};
						options.permissions = options.permissions ?? new Permissions();
						if (options.permissions.get("r_command_" + name) ?? options.permissions.get("r_command") ?? options.permissions.get("r") ?? true) {
						} else {
							throw Error("Access denied.");
						};
						if (commands["command_" + name] !== undefined) {
							return commands["command_" + name].enabled;
						} else {
							return false;
						};
					};
					output.commandEnabled = commandEnabled;

					function aliasEnabled(name, options) {
						options = options ?? {};
						options.permissions = options.permissions ?? new Permissions();
						if (options.permissions.get("r_alias_" + name) ?? options.permissions.get("r_alias") ?? options.permissions.get("r") ?? true) {
						} else {
							throw Error("Access denied.");
						};
						if (commands["alias_" + name] !== undefined) {
							return commands["alias_" + name].enabled;
						} else {
							return false;
						};
					};
					output.aliasEnabled = aliasEnabled;

					function enableCommand(name, options) {
						options = options ?? {};
						options.permissions = options.permissions ?? new Permissions();
						if (options.permissions.get("w_command_" + name) ?? options.permissions.get("w_command") ?? options.permissions.get("w") ?? true) {
						} else {
							throw Error("Access denied.");
						};
						if (commands["command_" + name] !== undefined) {
							commands["command_" + name].enabled = true;
						} else {
							throw ReferenceError("Command '" + name.replace(/'/g, "'\\\\''") + "' not found.");
						};
					};
					output.enableCommand = enableCommand;

					function enableAlias(name, options) {
						options = options ?? {};
						options.permissions = options.permissions ?? new Permissions();
						if (options.permissions.get("w_alias_" + name) ?? options.permissions.get("w_command") ?? options.permissions.get("w") ?? true) {
						} else {
							throw Error("Access denied.");
						};
						if (commands["alias_" + name] !== undefined) {
							commands["alias_" + name].enabled = true;
						} else {
							throw ReferenceError("Alias '" + name.replace(/'/g, "'\\\\''") + "' not found.");
						};
					};
					output.enableAlias = enableAlias;

					function disableCommand(name, options) {
						options = options ?? {};
						options.permissions = options.permissions ?? new Permissions();
						if (options.permissions.get("w_command_" + name) ?? options.permissions.get("w_command") ?? options.permissions.get("w") ?? true) {
						} else {
							throw Error("Access denied.");
						};
						if (commands["command_" + name] !== undefined) {
							commands["command_" + name].enabled = false;
						} else {
							throw ReferenceError("Command '" + name.replace(/'/g, "'\\\\''") + "' not found.");
						};
					};
					output.disableCommand = disableCommand;

					function disableAlias(name, options) {
						options = options ?? {};
						options.permissions = options.permissions ?? new Permissions();
						if (options.permissions.get("w_alias_" + name) ?? options.permissions.get("w_alias") ?? options.permissions.get("w") ?? true) {
						} else {
							throw Error("Access denied.");
						};
						if (commands["alias_" + name] !== undefined) {
							commands["alias_" + name].enabled = false;
						} else {
							throw ReferenceError("Alias '" + name.replace(/'/g, "'\\\\''") + "' not found.");
						};
					};
					output.disableAlias = disableAlias;

					function deleteCommand(name, options) {
						options = options ?? {};
						options.permissions = options.permissions ?? new Permissions();
						if (options.permissions.get("w_command_" + name) ?? options.permissions.get("w_command") ?? options.permissions.get("w") ?? true) {
						} else {
							throw Error("Access denied.");
						};
						if (commands["command_" + name] !== undefined) {
							commands["command_" + name] = undefined;
						} else {
							throw ReferenceError("Command '" + name.replace(/'/g, "'\\\\''") + "' not found.");
						};
					};
					output.deleteCommand = deleteCommand;

					function deleteAlias(name, options) {
						options = options ?? {};
						options.permissions = options.permissions ?? new Permissions();
						if (options.permissions.get("w_alias_" + name) ?? options.permissions.get("w_alias") ?? options.permissions.get("w") ?? true) {
						} else {
							throw Error("Access denied.");
						};
						if (commands["alias_" + name] !== undefined) {
							commands["alias_" + name] = undefined;
						} else {
							throw ReferenceError("Alias '" + name.replace(/'/g, "'\\\\''") + "' not found.");
						};
					};
					output.deleteAlias = deleteAlias;

					function commandExists(name, options) {
						options = options ?? {};
						options.permissions = options.permissions ?? new Permissions();
						if (options.permissions.get("r_command_" + name) ?? options.permissions.get("r_command") ?? options.permissions.get("r") ?? true) {
						} else {
							throw Error("Access denied.");
						};
						return commands["command_" + name] !== undefined;
					};
					output.commandExists = commandExists;

					function aliasExists(name, options) {
						options = options ?? {};
						options.permissions = options.permissions ?? new Permissions();
						if (options.permissions.get("r_alias_" + name) ?? options.permissions.get("r_alias") ?? options.permissions.get("r") ?? true) {
						} else {
							throw Error("Access denied.");
						};
						return commands["alias_" + name] !== undefined;
					};
					output.aliasExists = aliasExists;

					return output;
				})();

				let setCommand = internal1.setCommand;
				let getCommand = internal1.getCommand;
				let enableCommand = internal1.enableCommand;
				let disableCommand = internal1.disableCommand;
				let deleteCommand = internal1.deleteCommand;

				let setAlias = internal1.setAlias;
				let getAlias = internal1.getAlias;
				let enableAlias = internal1.enableAlias;
				let disableAlias = internal1.disableAlias;
				let deleteAlias = internal1.deleteAlias;

				let commandExists = internal1.commandExists;
				let aliasExists = internal1.aliasExists;

				let commandEnabled = internal1.commandEnabled;
				let aliasEnabled = internal1.aliasEnabled;

				output.setCommand = setCommand;
				output.getCommand = getCommand;
				output.enableCommand = enableCommand;
				output.disableCommand = disableCommand;
				output.deleteCommand = deleteCommand;

				output.setAlias = setAlias;
				output.getAlias = getAlias;
				output.enableAlias = enableAlias;
				output.disableAlias = disableAlias;
				output.deleteAlias = deleteAlias;

				output.commandExists = commandExists;
				output.aliasExists = aliasExists;

				output.commandEnabled = commandExists;
				output.aliasEnabled = aliasEnabled;

				Object.freeze(output.setCommand);
				Object.freeze(output.getCommand);
				Object.freeze(output.enableCommand);
				Object.freeze(output.disableCommand);
				Object.freeze(output.deleteCommand);

				Object.freeze(output.setAlias);
				Object.freeze(output.getAlias);
				Object.freeze(output.enableAlias);
				Object.freeze(output.disableAlias);
				Object.freeze(output.deleteAlias);

				Object.freeze(output.commandExists);
				Object.freeze(output.aliasExists);

				function executeCommand(command, options) {
					options = options ?? {};
					let parsed = parse_4(parse_3(parse_2(parse_1(command, options), options), options), options);
					let joinedArgumentsIfAlias = "";
					for(let i = 0; i < parsed.arguments.length; i++) {
						joinedArgumentsIfAlias += parsed.arguments[i].replace(/\\\\/, "\\\\\\\\").replace(/ /, "\\\\ ");
						if (i !== parsed.arguments.length - 1) {
							joinedArgumentsIfAlias += " ";
						}
					}
					if (aliasExists(parsed.command)) {
						options.permissions = options.permissions ?? new Permissions();
						if (options.permissions.get("x_alias_" + parsed.command) ?? options.permissions.get("x_alias") ?? options.permissions.get("x") ?? true) {
						} else {
							throw Error("Access denied.");
						};
						return executeCommand(getAlias(parsed.command, options) + (parsed.arguments.length === 0 ? "" : " ") + joinedArgumentsIfAlias, options);
					} else {
						return getCommand(parsed.command, options)(...parsed.arguments);
					};
				};

				output.execute = executeCommand;
				Object.freeze(output.execute);

				setCommand("help", function (...arguments) {
					if (arguments.length === 0) {
						bonk.console.log("help - Display this help menu.");
						bonk.console.log("enable - Enable the specified command.");
						bonk.console.log("disable - Disable the specified command.");
						bonk.console.log("delete-command - Delete the specified command.");
						bonk.console.log("clear - Clear the chat.");
						bonk.console.log("chat - Send the specified message.");
						bonk.console.log("team / join - Join the specified team.");
						bonk.console.log("ready - Trigger ready.");
						bonk.console.log("command-from-js - Import the specified function as a command.");
						bonk.console.log("alias / bind - Create or get an alias.");
						bonk.console.log("unalias / unbind - Remove an alias.");
						bonk.console.log("exists - Get if a command exists. If a command exists but is not enabled, this will return true.");
						bonk.console.log("enabled - Get if a command exists and is enabled.");
					} else {
						throw Error("Too many arguments provided.");
					};
				});

				setCommand("enable", function (...arguments) {
					if (arguments.length >= 1) {
						for(let i = 0; i < arguments.length; i++) {
							if (aliasExists(arguments[i])) {
								enableAlias(arguments[i]);
							} else {
								enableCommand(arguments[i]);
							};
						}
					} else {
						throw Error("No arguments provided.");
					};
				});

				setCommand("disable", function (...arguments) {
					if (arguments.length >= 1) {
						for(let i = 0; i < arguments.length; i++) {
							if (aliasExists(arguments[i]) && aliasEnabled(arguments[i])) {
								disableAlias(arguments[i]);
							} else {
								disableCommand(arguments[i]);
							};
						}
					} else {
						throw Error("No arguments provided.");
					};
				});

				setCommand("return", function (...arguments) {
					if (arguments.length === 1) {
						return arguments[0];
					} else if (arguments.length > 1) {
						throw Error("Too many arguments.");
					} else {
						throw Error("No arguments provided.");
					}
				});

				setCommand("delete-command", function (...arguments) {
					if (arguments.length >= 1) {
						for(let i = 0; i < arguments.length; i++) {
							if (aliasExists(arguments[i])) {
								deleteAlias(arguments[i]);
							} else {
								deleteCommand(arguments[i]);
							};
						}
					} else {
						throw Error("No arguments provided.");
					};
				});

				 let banlist = [];
				window.banlist = banlist;
				setCommand("ban", function (...arguments) {
					if (arguments.length === 1) {
						bonk.chat("/kick \\"" + arguments[0] + "\\"", { nospace: true});
						banlist.push(arguments[0]);

					} else if (arguments.length === 0) {
						throw Error("No arguments provided.");
					} else {
						throw Error("Too many arguments provided.");
					};;
				});
				setInterval(function() {
							if (document.querySelectorAll("#newbonklobby_chat_content .newbonklobby_chat_status").length === 0) {
								return;
							}
						   banlist.forEach((i) => {
		  if (document.querySelectorAll("#newbonklobby_chat_content .newbonklobby_chat_status")[document.querySelectorAll("#newbonklobby_chat_content .newbonklobby_chat_status").length-1].innerText === "* " + i +" has joined the game") {
			  bonk.chat("/kick \\"" + i + "\\"", { nospace: true});
		  }
							});
							if (document.querySelectorAll("#newbonklobby_chat_content .newbonklobby_chat_status").length === 0) {
								return;
							}
						   banlist.forEach((i) => {
								if (document.querySelectorAll("#ingamechatcontent .ingamechatstatus")[document.querySelectorAll("#ingamechatcontent .ingamechatstatus").length-1].innerText === "* " + i +" has joined the game.") {
									bonk.chat("/kick \\"" + i + "\\"", { nospace: true});
								}
							});
							if (document.querySelectorAll("#ingamechatcontent .ingamechatstatus").length === 0) {
								return;
							}
						}, 10);
				setCommand("chat", function (...arguments) {
					if (arguments.length === 1) {
						bonk.chat(arguments[0]);
					} else if (arguments.length === 0) {
						throw Error("No arguments provided.");
					} else {
						throw Error("Too many arguments provided.");
					};;
				});

				setCommand("ready", function (...arguments) {
					if (arguments.length === 0) {
						bonk.ready();
					} else {
						throw Error("Too many arguments provided.");
					}
				});

				setCommand("clear", function (...arguments) {
					if (arguments.length == 0) {
						bonk.console.clear();
					} else {
						throw Error("Too many arguments provided.");
					};
				});

				setCommand("console", function (...arguments) {
					if (arguments.length === 0) {
						consoleOn = true;
						fullscreenconsoleactivated = true;
						fullscreenconsole.style.display = "block";
					} else {
						throw Error("Too many arguments provided.");
					}
				});

				setCommand("game", function (...arguments) {
					if (arguments.length === 0) {
						consoleOn = false;
						fullscreenconsoleactivated = false;
						fullscreenconsole.style.display = "none";
					} else {
						throw Error("Too many arguments provided.");
					}
				});

				setCommand("team", function (...arguments) {
					if (arguments.length == 1) {
						try {
							bonk.setTeam(arguments[0]);
							bonk.console.log("Set team to '" + arguments[0].replace(/'/, "\\'\\\\\\'\\'") + "'.");
						} catch (e) {
							if (e.message == "Invalid team " + arguments[0] + ".") {
								throw Error("Invalid team '" + arguments[0].replace(/'/, "\\'\\\\\\'\\'") + "'.");
							} else {
								throw e;
							};
						}
					} else if (arguments.length > 1) {
						throw Error("Too many arguments.");
					} else {
						throw Error("Not enough arguments.");
					}
				});

				setCommand("eval", function (...arguments) {
					if (arguments.length == 1) {
						let a = saferEval(arguments[0], {});
						return (a === undefined ? "undefined" : (a === null ? "null" : a));
					} else if (arguments.length > 1) {
						throw Error("Too many arguments.");
					} else {
						throw Error("Not enough arguments.");
					}
				});

				setCommand("eval-no-return", function (...arguments) {
					if (arguments.length == 1) {
						let a = saferEval(arguments[0], {});
						//return (a === undefined ? "undefined" : (a === null ? "null" : a));
					} else if (arguments.length > 1) {
						throw Error("Too many arguments.");
					} else {
						throw Error("Not enough arguments.");
					}
				});

				setCommand("js", getCommand("eval"));

				setCommand("alias", function (...arguments) {
					if (arguments.length == 2) {
						setAlias(arguments[0], arguments[1]);
						return getAlias(arguments[0]);
					} else if (arguments.length == 1) {
						return getAlias(arguments[0]);
					} else if (arguments.length > 2) {
						throw Error("Too many arguments.");
					} else {
						throw Error("Not enough arguments.");
					}
				});

				setCommand("bind", getCommand("alias"));

				setCommand("unalias", function (...arguments) {
					if (arguments.length == 1) {
						deleteAlias(arguments[0]);
					} else if (arguments.length > 1) {
						throw Error("Too many arguments.");
					} else {
						throw Error("Not enough arguments.");
					}
				});

				setCommand("unbind", getCommand("unalias"));

				setCommand("command-from-js", function (...arguments) {
					if (arguments.length == 2) {
						setCommand(arguments[0], new Function("return (" + arguments[1] + ");")());
					} else if (arguments.length > 2) {
						throw Error("Too many arguments.");
					} else {
						throw Error("Not enough arguments.");
					}
				});

				setCommand("join", function (...arguments) {
					if (arguments.length == 1) {
						try {
							bonk.setTeam(arguments[0]);
							bonk.console.log("Set team to '" + arguments[0].replace(/'/, "\\'\\\\\\'\\'") + "'.");
						} catch (e) {
							if (e.message == "Invalid team " + arguments[0] + ".") {
								throw Error("Invalid team '" + arguments[0].replace(/'/, "\\'\\\\\\'\\'") + "'.");
							} else {
								throw e;
							};
						}
					} else if (arguments.length > 1) {
						throw Error("Too many arguments.");
					} else {
						console.error("Not enough arguments.");
						throw Error("Not enough arguments.");
					}
				});

				setCommand("exists", function (...arguments) {
					if (arguments.length == 1) {
						return commandExists(arguments[0]) || aliasExists(arguments[0]);
					} else if (arguments.length > 1) {
						throw Error("Too many arguments.");
					} else {
						console.error("Not enough arguments.");
						throw Error("Not enough arguments.");
					}
				});

				setCommand("enabled", function (...arguments) {
					if (arguments.length == 1) {
						return commandEnabled(arguments[0]) || aliasEnabled(arguments[0]);
					} else if (arguments.length > 1) {
						throw Error("Too many arguments.");
					} else {
						console.error("Not enough arguments.");
						throw Error("Not enough arguments.");
					}
				});

				return output;
			})();
			bonk.command = command;
			//*/

			setTimeout(async function() {
				while ($ === undefined) {
					await sleep(1);
				};
				bonk.bindKeys();
				setInterval(function() {
					document.getElementById("newbonklobby_roundsinput").removeAttribute("maxlength");
				}, 100);
				window.displayInConsole = displayInConsole;
				setInterval(function() {
					if (!textA) {
						fullscreenconsole.innerHTML += "_";
					} else {
						fullscreenconsole.innerHTML = fullscreenconsole.innerHTML.slice(0, -1);
					};
					textA = !textA;
				}, 500);
				document.addEventListener("keydown", function(e) {
					if (consoleOn) {
						if (e.key === "a" && !e.ctrlKey && !e.altKey) {
						addInput("a");
					} else if (e.key === "A" && !e.ctrlKey && !e.altKey) {
						addInput("A");
					} else if (e.key === "b" && !e.ctrlKey && !e.altKey) {
						addInput("b");
					} else if (e.key === "B" && !e.ctrlKey && !e.altKey) {
						addInput("B");
					} else if (e.key === "c" && !e.ctrlKey && !e.altKey) {
						addInput("c");
					} else if ((e.key === "c" || e.key === "C") && e.ctrlKey && e.altKey) {
						fullscreenconsole.style.display = "none";
						consoleOn = false;
						fullscreenconsoleactivated = false;
					} else if (e.key === "C" && !e.ctrlKey && !e.altKey) {
						addInput("C");
					} else if (e.key === "d" && !e.ctrlKey && !e.altKey) {
						addInput("d");
					} else if (e.key === "D" && !e.ctrlKey && !e.altKey) {
						addInput("D");
					} else if (e.key === "e" && !e.ctrlKey && !e.altKey) {
						addInput("e");
					} else if (e.key === "E" && !e.ctrlKey && !e.altKey) {
						addInput("E");
					} else if (e.key === "f" && !e.ctrlKey && !e.altKey) {
						addInput("f");
					} else if (e.key === "F" && !e.ctrlKey && !e.altKey) {
						addInput("F");
					} else if (e.key === "g" && !e.ctrlKey && !e.altKey) {
						addInput("g");
					} else if (e.key === "G" && !e.ctrlKey && !e.altKey) {
						addInput("G");
					} else if (e.key === "h" && !e.ctrlKey && !e.altKey) {
						addInput("h");
					} else if (e.key === "H" && !e.ctrlKey && !e.altKey) {
						addInput("H");
					} else if (e.key === "i" && !e.ctrlKey && !e.altKey) {
						addInput("i");
					} else if (e.key === "I" && !e.ctrlKey && !e.altKey) {
						addInput("I");
					} else if (e.key === "j" && !e.ctrlKey && !e.altKey) {
						addInput("j");
					} else if (e.key === "J" && !e.ctrlKey && !e.altKey) {
						addInput("J");
					} else if (e.key === "k" && !e.ctrlKey && !e.altKey) {
						addInput("k");
					} else if (e.key === "K" && !e.ctrlKey && !e.altKey) {
						addInput("K");
					} else if (e.key === "l" && !e.ctrlKey && !e.altKey) {
						addInput("l");
					} else if (e.key === "L" && !e.ctrlKey && !e.altKey) {
						addInput("L");
					} else if (e.key === "m" && !e.ctrlKey && !e.altKey) {
						addInput("m");
					} else if (e.key === "M" && !e.ctrlKey && !e.altKey) {
						addInput("M");
					} else if (e.key === "n" && !e.ctrlKey && !e.altKey) {
						addInput("n");
					} else if (e.key === "N" && !e.ctrlKey && !e.altKey) {
						addInput("N");
					} else if (e.key === "o" && !e.ctrlKey && !e.altKey) {
						addInput("o");
					} else if (e.key === "O" && !e.ctrlKey && !e.altKey) {
						addInput("O");
					} else if (e.key === "p" && !e.ctrlKey && !e.altKey) {
						addInput("p");
					} else if (e.key === "P" && !e.ctrlKey && !e.altKey) {
						addInput("P");
					} else if (e.key === "q" && !e.ctrlKey && !e.altKey) {
						addInput("q");
					} else if (e.key === "Q" && !e.ctrlKey && !e.altKey) {
						addInput("Q");
					} else if (e.key === "r" && !e.ctrlKey && !e.altKey) {
						addInput("r");
					} else if (e.key === "R" && !e.ctrlKey && !e.altKey) {
						addInput("R");
					} else if (e.key === "s" && !e.ctrlKey && !e.altKey) {
						addInput("s");
					} else if (e.key === "S" && !e.ctrlKey && !e.altKey) {
						addInput("S");
					} else if (e.key === "t" && !e.ctrlKey && !e.altKey) {
						addInput("t");
					} else if (e.key === "T" && !e.ctrlKey && !e.altKey) {
						addInput("T");
					} else if (e.key === "u" && !e.ctrlKey && !e.altKey) {
						addInput("u");
					} else if (e.key === "U" && !e.ctrlKey && !e.altKey) {
						addInput("U");
					} else if (e.key === "v" && !e.ctrlKey && !e.altKey) {
						addInput("v");
					} else if (e.key === "V" && !e.ctrlKey && !e.altKey) {
						addInput("V");
					} else if (e.key === "w" && !e.ctrlKey && !e.altKey) {
						addInput("w");
					} else if (e.key === "W" && !e.ctrlKey && !e.altKey) {
						addInput("W");
					} else if (e.key === "x" && !e.ctrlKey && !e.altKey) {
						addInput("x");
					} else if (e.key === "X" && !e.ctrlKey && !e.altKey) {
						addInput("X");
					} else if (e.key === "y" && !e.ctrlKey && !e.altKey) {
						addInput("y");
					} else if (e.key === "Y" && !e.ctrlKey && !e.altKey) {
						addInput("Y");
					} else if (e.key === "z" && !e.ctrlKey && !e.altKey) {
						addInput("z");
					} else if (e.key === "Z" && !e.ctrlKey && !e.altKey) {
						addInput("Z");
					} else if (e.key === "0" && !e.ctrlKey && !e.altKey) {
						addInput("0");
					} else if (e.key === ")" && !e.ctrlKey && !e.altKey) {
						addInput(")");
					} else if (e.key === "1" && !e.ctrlKey && !e.altKey) {
						addInput("1");
					} else if (e.key === "!" && !e.ctrlKey && !e.altKey) {
						addInput("!");
					} else if (e.key === "2" && !e.ctrlKey && !e.altKey) {
						addInput("2");
					} else if (e.key === "@" && !e.ctrlKey && !e.altKey) {
						addInput("@");
					} else if (e.key === "3" && !e.ctrlKey && !e.altKey) {
						addInput("3");
					} else if (e.key === "#" && !e.ctrlKey && !e.altKey) {
						addInput("#");
					} else if (e.key === "4" && !e.ctrlKey && !e.altKey) {
						addInput("4");
					} else if (e.key === "$" && !e.ctrlKey && !e.altKey) {
						addInput("$");
					} else if (e.key === "5" && !e.ctrlKey && !e.altKey) {
						addInput("5");
					} else if (e.key === "%" && !e.ctrlKey && !e.altKey) {
						addInput("%");
					} else if (e.key === "6" && !e.ctrlKey && !e.altKey) {
						addInput("6");
					} else if (e.key === "^" && !e.ctrlKey && !e.altKey) {
						addInput("^");
					} else if (e.key === "7" && !e.ctrlKey && !e.altKey) {
						addInput("7");
					} else if (e.key === "&" && !e.ctrlKey && !e.altKey) {
						addInput("&");
					} else if (e.key === "8" && !e.ctrlKey && !e.altKey) {
						addInput("8");
					} else if (e.key === "*" && !e.ctrlKey && !e.altKey) {
						addInput("*");
					} else if (e.key === "9" && !e.ctrlKey && !e.altKey) {
						addInput("9");
					} else if (e.key === "(" && !e.ctrlKey && !e.altKey) {
						addInput("(");
					} else if (e.key === "~" && !e.ctrlKey && !e.altKey) {
						addInput("~");
					} else if (e.key === "\`" && !e.ctrlKey && !e.altKey) {
						addInput("\`");
					} else if (e.key === "[" && !e.ctrlKey && !e.altKey) {
						addInput("[");
					} else if (e.key === "{" && !e.ctrlKey && !e.altKey) {
						addInput("{");
					} else if (e.key === "]" && !e.ctrlKey && !e.altKey) {
						addInput("]");
					} else if (e.key === "}" && !e.ctrlKey && !e.altKey) {
						addInput("}");
					} else if (e.key === ":" && !e.ctrlKey && !e.altKey) {
						addInput(":");
					} else if (e.key === ";" && !e.ctrlKey && !e.altKey) {
						addInput(";");
					} else if (e.key === "'" && !e.ctrlKey && !e.altKey) {
						addInput("'");
					} else if (e.key === "\\"" && !e.ctrlKey && !e.altKey) {
						addInput("\\"");
					} else if (e.key === "<" && !e.ctrlKey && !e.altKey) {
						addInput("&lt;");
					} else if (e.key === ">" && !e.ctrlKey && !e.altKey) {
						addInput("&gt;");
					} else if (e.key === "?" && !e.ctrlKey && !e.altKey) {
						addInput("?");
					} else if (e.key === "/" && !e.ctrlKey && !e.altKey) {
						addInput("/");
					} else if (e.key === " " && !e.ctrlKey && !e.altKey) {
						addInput(" ");
					} else if (e.key === "=" && !e.ctrlKey && !e.altKey) {
						addInput("=");
					} else if (e.key === "-" && !e.ctrlKey && !e.altKey) {
						addInput("-");
					} else if (e.key === "_" && !e.ctrlKey && !e.altKey) {
						addInput("_");
					} else if (e.key === "+" && !e.ctrlKey && !e.altKey) {
						addInput("+");
					} else if (e.key === "|" && !e.ctrlKey && !e.altKey) {
						addInput("|");
					} else if (e.key === "\\\\" && !e.ctrlKey && !e.altKey) {
						addInput("\\\\");
					} else if (e.key === "." && !e.ctrlKey && !e.altKey) {
						addInput(".");
					} else if (e.key === "," && !e.ctrlKey && !e.altKey) {
						addInput(",");
					} else if ((e.key === "Backspace" && !e.ctrlKey && !e.altKey) || (e.key === "h" || e.key === "H" || e.key === "Backspace" && e.ctrlKey && !e.altKey)) {
						if (textA) {
							if (charsTyped === 0) {

							} else {
								fullscreenconsole.innerHTML = fullscreenconsole.innerHTML.replace(/<br\\/>/g, "\\n").replace(/\\<text style=\\'color: green\\'\\>/g, "\\u100000").replace(/\\<text style=\\'color: red\\'\\>/g, "\\u100004").replace(/<text style=\\'color: orange\\'\\>/g, "\\u100003").replace(/\\<text style='color: lime'\\>/g, "\\u1002").replace(/\\<\\/text\\>/g, "\\u100001").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&").slice(0, -2).replace(/&/g, "&amp;").replace(/&gt;/g, "&gt;").replace(/&lt;/g, "<").replace(/\\n/g, "<br/>").replace(/\\u100000/g, "<text style='color: green'>").replace(/\\u1002/g, "<text style='color: lime'>").replace(/\\u100004/g, "<text style='color: red'>").replace(/\\u100001/g, "<\\/text>") + "_";
								charsTyped -= 1;
								charsTypedValue = charsTypedValue.slice(0, -1);
							}
						} else {
							if (charsTyped === 0) {

							} else {
								fullscreenconsole.innerHTML = fullscreenconsole.innerHTML.replace(/<br\\/>/g, "\\n").replace(/<text style=\\'color: green\\'\\>/g, "\\u100000").replace(/\\<text style=\\'color: red\\'\\>/g, "\\u100004").replace(/<text style=\\'color: orange\\'\\>/g, "\\u100003").replace(/\\<text style=\\'color: lime\\'\\>/g, "\\u1002").replace(/\\<\\/text\\>/g, "\\u100001").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&").slice(0, -1).replace(/&/g, "&amp;").replace(/&gt;/g, "&gt;").replace(/&lt;/g, "<").replace(/\\n/g, "<br/>").replace(/\\u100000/g, "<text style='color: green'>").replace(/\\u1002/g, "<text style='color: lime'>").replace(/\\u100003/g, "<text style='color: orange'>").replace(/\\u100004/g, "<text style='color: red'>").replace(/\\u100001/g, "<\\/text>");
								charsTyped -= 1;
								charsTypedValue = charsTypedValue.slice(0, -1);
							}
						}
					} else if (e.key === "Enter" && !e.ctrlKey && !e.altKey) {
						charsTyped = 0;
						displayInConsole("<br/>");
						if (charsTypedValue !== "") {
							try {
								let options = { input: charsTypedValue.slice(1) };
								let a = bonk.command(charsTypedValue, options);
								if (a !== undefined) {
									displayInConsole("<text style='color: orange'>&gt; " + a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</text><br/>");
								}
							} catch(e) {
								displayInConsole("<text style='color: red'>! " + e.message + "<br/></text>");
							}
						}
						displayInConsole("<text style='color: lime'>&gt;&gt; </text>");
						charsTypedValue = "";
					};
					return false;
					}
					else
					{
						if ((e.key === "c" || e.key === "C") && e.altKey && e.ctrlKey) {
							consoleOn = true;
							fullscreenconsoleactivated = true;
							fullscreenconsole.style.display = "block";
						};
					};
				});
				document.getElementById("bonkiocontainer").appendChild(fullscreenconsole);
				Node.prototype.fire=function(type,options){ // Credits to LEGENDBOSS123 for this function
					var event=new CustomEvent(type);
					for(var p in options){
						event[p]=options[p];
					}
					this.dispatchEvent(event);
				}
				HTMLElement.prototype.addEventListenerOld = HTMLElement.prototype.addEventListener;
				//HTMLElement.prototype.addEventListener = function addEventListener(a, b, c, d, e, f, g, h, i, j) {
				//    this.addEventListenerOld(a,b,c,d,e,f,g,h,i,j); eventHandlers.push([this, a, b, c, d, e, f, g, h, i, j]);
				//}
				var old_1 = document.getElementById("newbonklobby_chat_input").onkeydown ?? function(){};
				document.getElementById("newbonklobby_chat_input").onkeydown = function(e) {
					if (consoleOn) {
						var old_msg = "";
						console.log(document.getElementById("newbonklobby_chat_lowerinstruction").style.visibility);
						if (e.keyCode == 13) {
							old_msg = document.getElementById("newbonklobby_chat_input").value;
							document.getElementById("newbonklobby_chat_input").value = "";
							console.log(document.getElementById("newbonklobby_chat_lowerinstruction").style.visibility);
							if (document.getElementById("newbonklobby_chat_lowerinstruction").style.visibility !== "hidden") {
								console.log(true);
								document.fire("keydown", {keyCode: 13});
							}
							document.getElementById("newbonklobby_chat_input").value = old_msg;
							setTimeout( function() {
								if (document.getElementById("newbonklobby_chat_lowerinstruction").style.visibility === "hidden") {
									console.log(true);
									document.fire("keydown", {keyCode: 13});
								}
							}, 1000);
						}
						document.getElementById("newbonklobby_chat_input").value = "";
					} else {
					old_1(e);
					var msg = document.getElementById("newbonklobby_chat_input").value;

					if (e.keyCode == 13 && msg[0] == "~") {
						/*
						displayInChat(">> " + msg, "#00BB00", "#00FF00")
						var args = cmdArgParser(msg);
						if (args.error) {
							if (args.errorMsg !== undefined) {
								bonk.console.error(args.errorMsg);
							}
							document.getElementById("newbonklobby_chat_input").value = "";
							return;
						}
						let a = executeCommand(args);
						if (a.error) {
							if (a.errorMsg !== undefined) {
								bonk.console.error(a.errorMsg);
							}
							document.getElementById("newbonklobby_chat_input").value = "";
							return;
						}
						if (a.output !== undefined) {
							displayInChat("> " + a.output, "#FF5500", "#FFAA66");
						}
						document.getElementById("newbonklobby_chat_input").value = "";
						*/
						try {
							displayInChat(">> " + msg, "#00BB00", "#00FF00");
							let options = { input: msg.slice(1) };
							let a = bonk.command(msg.slice(1), options);
							if (a !== undefined) {
								displayInChat("> " + a, "#FF5500", "#FFAA66");
							}
						} catch(e) {
							bonk.console.error(e.message);
						}
						document.getElementById("newbonklobby_chat_input").value = "";
					}
					}
				}
				var old_2 = document.getElementById("ingamechatinputtext").onkeydown ?? function(){};
				document.getElementById("ingamechatinputtext").onkeydown = function(e) {
					if (consoleOn) {
						var old_msg = "";
						if (e.keyCode == 13) {
							old_msg = document.getElementById("ingamechatinputtext");
							document.getElementById("ingamechatinputtext").value = "";
							//document.fire("keydown", {keyCode: 13});
							setTimeout(function() {document.getElementById("ingamechatinputtext").innerHTML = old_msg;}, 500);
						}
						document.getElementById("ingamechatinputtext").value = "";
					} else {
					old_2(e);
					var msg = document.getElementById("ingamechatinputtext").value;
					if (e.keyCode == 13 && msg[0] == "~") {
						/*
						displayInChat(">> " + msg, "#00BB00", "#00FF00")
						var args = cmdArgParser(msg);
						if (args.error) {
							if (args.errorMsg !== undefined) {
								bonk.console.error(args.errorMsg);
							}
							document.getElementById("ingamechatinputtext").value = "";
							return;
						}
						let a = executeCommand(args);
						if (a.error) {
							if (a.errorMsg !== undefined) {
								bonk.console.error(a.errorMsg);
							}
							document.getElementById("ingamechatinputtext").value = "";
							return;
						}
						if (a.output !== undefined) {
							displayInChat("> " + a.output, "#FF5500", "#FFAA66");
						}
						document.getElementById("ingamechatinputtext").value = "";
						*/
						try {
							displayInChat(">> " + msg, "#00BB00", "#00FF00");
							let options = { input: msg.slice(1) };
							let a = bonk.command(msg.slice(1), options);
							if (a !== undefined) {
								displayInChat("> " + a, "#FF5500", "#FFAA66");
							}
						} catch(e) {
							bonk.console.error(e.message);
						}
						document.getElementById("ingamechatinputtext").value = "";
					}
					}
				}
				bonk.color = {};
				bonk.color.chatNames = false;
				var firstChat = "";
				setTimeout((async function() { while(true) {
					await sleep(30);
					for(let i=0;i<document.getElementsByClassName("ingamechatname").length;i++) {
						document.getElementsByClassName("ingamechatname")[i].style.color =
							document.getElementsByClassName("ingamechatname")[i].innerText.slice(0, -1) == document.getElementById("pretty_top_name").innerText ? "#00FF00" : "#00FFFF";
					}
					for(let i=0;i<document.getElementsByClassName("ingamechatstatus").length;i++) {
						document.getElementsByClassName("ingamechatstatus")[i].style.color = "#44AAFF";
					}
				}})(), 0);
				{
					let permissions = (function() {
						let output = {};
						function get(key) {
							if (output["perm_" + key] === undefined) {
								let a = new bonk.command.Permissions();
								a.deny("r");
								a.deny("w");
								a.deny("x");
								output["perm_" + key] = a;
							};
							return output["perm_" + key];
						}
						function set(key, val) {
							if (output["perm_" + key] === undefined) {
								let a = new bonk.command.Permissions();
								a.deny("r");
								a.deny("w");
								a.deny("x");
								output["perm_" + key] = a;
							};
							output["perm_" + key] = val;
						}
						output.get = get;
						output.set = set;
						return output;
					})();
					let input_ref = { reference: "" };
					let parse_2_ref = { reference: "" };
					let parse_3_ref = { reference: "" };
					bonk.command.setCommand("remote", function(...arguments) {
						if (arguments.length === 0) {
							throw Error("No arguments provided.");
						} else if (arguments[0] === "permissions") {
							if (arguments.length <= 2) {
								throw Error("Not enough arguments.");
							} else if (arguments.length === 3) {
								if (permissions.get(arguments[1]) === undefined) {
									let a = new bonk.command.Permissions();
									a.deny("r");
									a.deny("w");
									a.deny("x");
									permissions.set(arguments[1], a);
								};
								return permissions.get(arguments[1]).get(arguments[2]) ?? false;
							} else if (arguments.length === 4) {
								if (permissions.get(arguments[1]) === undefined) {
									let a = new bonk.command.Permissions();
									a.deny("r");
									a.deny("w");
									a.deny("x");
									permissions.set(arguments[1], a);
								};
								return permissions.get(arguments[1])[arguments[3] === "true" ? "allow" : (arguments[3] === "unset" ? "unset" : "deny")](arguments[2]);
							} else {
								throw Error("Too many arguments.");
							}
						} else if (arguments[0] === "user") {
							let parse_3 = parse_3_ref.reference;
							let parse_5 = "";
							let spaces = 0;
							let escaped = false;
							let i = 0;
							for (; i < parse_3.length; i++) {
								if (parse_3[i] === " " && !escaped) {
									spaces += 1;
									parse_5 += " ";
									if (spaces === 3) {
										i++;
										break;
									}
								} else if (parse_3[i] === "\\\\" && !escaped) {
									escaped = true;
								} else if (parse_3[i] === " " && escaped) {
									escaped = false;
									parse_5 += "\\\\ ";
								} else {
									escaped = false;
									parse_5 += parse_3[i];
								};
							};
							for (; i < parse_3.length; i += 1) {
								if (parse_3[i] === "\\\\" && !escaped)  {
									 escaped = true;
								 } else {
									 if ((parse_3[i] === " " || parse_3[i] === "\\"" || parse_3[i] === "'") && escaped) {
										parse_5 += "\\\\";
									}
									 escaped = false;
									 parse_5 += parse_3[i];
								 }
							};
							bonk.chat(" ~" + parse_5, { nospace: true});
						} else {
							let parse_3 = parse_3_ref.reference;
							let parse_5 = "";
							let spaces = 0;
							let escaped = false;
							let i = 0;
							for (; i < parse_3.length; i++) {
								if (parse_3[i] === " " && !escaped) {
									spaces += 1;
									parse_5 += " ";
									if (spaces === 2) {
										i++;
										break;
									}
								} else if (parse_3[i] === "\\\\" && !escaped) {
									escaped = true;
								} else if (parse_3[i] === " " && escaped) {
									escaped = false;
									parse_5 += "\\\\ ";
								} else {
									if (parse_3[i] === " " && escaped) {
										parse_5 += "\\\\";
									}
									escaped = false;
									parse_5 += parse_3[i];
								};
							};
							 for (; i < parse_3.length; i += 1) {
								 if (parse_3[i] === "\\\\" && !escaped)  {
									 escaped = true;
								 } else {
									 if ((parse_3[i] === " " || parse_3[i] === "\\"" || parse_3[i] === "'") && escaped) {
										parse_5 += "\\\\";
									}
									 escaped = false;
									 parse_5 += parse_3[i];
								 }
								 }
							bonk.chat(" ~" + parse_5, { nospace: true });
						}
					}, { input_reference: input_ref, parse_2_reference: parse_2_ref, parse_3_reference: parse_3_ref });
					(function() {
						let last_message = document.querySelectorAll("#ingamechatcontent .ingamechatname")[document.querySelectorAll("#ingamechatcontent .ingamechatname").length-1];

						setTimeout(async function() {
							while(true) {
								await sleep(30);
								if (last_message !== document.querySelectorAll("#ingamechatcontent .ingamechatname")[document.querySelectorAll("#ingamechatcontent .ingamechatname").length-1]) {
									if (bonk.readMessage(-1).message === null) {
										continue;
									}
									if (bonk.readMessage(-1).message.indexOf(" ~remote " + document.getElementById("pretty_top_name").innerText.replace(/ /, "\\\\ ") + " ") === 0) {
										try {
											displayInChat(">> " + bonk.readMessage(-1).message.slice(10 + document.getElementById("pretty_top_name").innerText.replace(/ /, "\\\\ ").length), "#00BB00", "#00FF00");
											let options = { input: bonk.readMessage(-1).message.slice(10 + document.getElementById("pretty_top_name").innerText.replace(/ /, "\\\\ ").length).slice(1), permissions: permissions.get(bonk.readMessage(-1).name) };
											let a = bonk.command(bonk.readMessage(-1).message.slice(10 + document.getElementById("pretty_top_name").innerText.replace(/ /, "\\\\ ").length), options);
											if (a !== undefined) {
												displayInChat("> " + a, "#FF5500", "#FFAA66");
												bonk.chat("Output: " + a);
											}
										} catch(e) {
											bonk.console.error(e.message);
											bonk.chat("Error: " + e.message);
										}
									} else if (bonk.readMessage(-1).message.indexOf("~remote " + document.getElementById("pretty_top_name").innerText.replace(/ /, "\\\\ ") + " ") === 0) {
										try {
											displayInChat(">> " + bonk.readMessage(-1).message.slice(9 + document.getElementById("pretty_top_name").innerText.replace(/ /, "\\\\ ").length), "#00BB00", "#00FF00");
											let options = { input: "~" + bonk.readMessage(-1).message.slice(9 + document.getElementById("pretty_top_name").innerText.replace(/ /, "\\\\ ").length).slice(1), permissions: permissions.get(bonk.readMessage(-1).name) };
											let a = bonk.command(bonk.readMessage(-1).message.slice(9 + document.getElementById("pretty_top_name").innerText.replace(/ /, "\\\\ ").length), options);
											if (a !== undefined) {
												displayInChat("> " + a, "#FF5500", "#FFAA66");
												bonk.chat("Output: " + a);
											}
										} catch(e) {
											bonk.console.error(e.message);
											bonk.chat("Error: " + e.message);
										}
									} else if (bonk.readMessage(-1).message.indexOf(" ~remote user " + document.getElementById("pretty_top_name").innerText.replace(/ /, "\\\\ ") + " ") === 0) {
										try {
											displayInChat(">> " + bonk.readMessage(-1).message.slice(15 + document.getElementById("pretty_top_name").innerText.replace(/ /, "\\\\ ").length), "#00BB00", "#00FF00");
											let options = { input: "~" + bonk.readMessage(-1).message.slice(15 + document.getElementById("pretty_top_name").innerText.length).replace(/ /, "\\\\ ").slice(1), permissions: permissions.get(bonk.readMessage(-1).name) };
											let a = bonk.command(bonk.readMessage(-1).message.slice(15 + document.getElementById("pretty_top_name").innerText.replace(/ /, "\\\\ ").length), options);
											if (a !== undefined) {
												displayInChat("> " + a, "#FF5500", "#FFAA66");
												bonk.chat("Output: " + a);
											}
										} catch(e) {
											bonk.console.error(e.message);
											bonk.chat("Error: " + e.message);
										}
									} else if (bonk.readMessage(-1).message.indexOf("~remote user " + document.getElementById("pretty_top_name").innerText.replace(/ /, "\\\\ ") + " ") === 0) {
										try {
											displayInChat(">> " + bonk.readMessage(-1).message.slice(14 + document.getElementById("pretty_top_name").innerTextreplace(/ /, "\\\\ ").length), "#00BB00", "#00FF00");
											let options = { input: "~" + bonk.readMessage(-1).message.slice(14 + document.getElementById("pretty_top_name").innerText.replace(/ /, "\\\\ ").length).slice(1), permissions: permissions.get(bonk.readMessage(-1).name) };
											let a = bonk.command(bonk.readMessage(-1).message.slice(14 + document.getElementById("pretty_top_name").innerText.replace(/ /, "\\\\ ").length), options);
											if (a !== undefined) {
												displayInChat("> " + a, "#FF5500", "#FFAA66");
												bonk.chat("Output: " + a);
											}
										} catch(e) {
											bonk.console.error(e.message);
											bonk.chat("Error: " + e.message);
										}
									}
									last_message = document.querySelectorAll("#ingamechatcontent .ingamechatname")[document.querySelectorAll("#ingamechatcontent .ingamechatname").length-1];

								}
							}
						}, 0);})();
				};
			}, 0);
		})();
	})();`;
    return src;
};
if(!Object.hasOwnProperty(window, "bonkCodeInjectors")) {
    window.bonkCodeInjectors = []
};
window.bonkCodeInjectors.push(injector);
console.log("Bonk.io hax injector loaded");