// ==UserScript==
// @name        C&C:TA Shortcuts
// @namespace   CnC_TA_Shortcuts
// @author  	Vulcano
// @version     1.0.0.2
// @date        2015-03-26
// @copyright   (c) by Vulcanion.com
// @license     Vulcanion.com
// @URL         http://Vulcanion.com
// @icon        http://Images.Vulcanion.com/Vulcanion/Vulcano_62x64.png
// @description give some shortcuts like [coords], [player], [alliances] or BB-Codes
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15068/CC%3ATA%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/15068/CC%3ATA%20Shortcuts.meta.js
// ==/UserScript==

function Ini() {
	m = "C&C:TA Shortcuts loaded successfully !!!";
	if (typeof console != 'undefined') console.log(m);
	else if (window.opera) opera.postError(m);
	else GM_log(m);
};

(function () {
    console.log("C&C:TA Shortcuts loading ...");
	var CnCTAShortcutsMain = function () {
			var IsDEBUG = false;
			function log(m) {
				if (IsDEBUG) {
					if (typeof console != 'undefined') console.log(m);
					else if (window.opera) opera.postError(m);
					else GM_log(m);
				}
			};
			log("IsDEBUG = true");
			function createInstance() {
				var VLC = {};
				qx.Class.define("VLC.main", {
					type: "singleton",
					extend: qx.core.Object,
					members: {
						Coords: "First, just move mouse cursor over some map coordinates numbers ex. 0:0",
						initialize: function () {
							window.addEventListener("keyup", this.onKey, false);
							window.addEventListener("mouseover", this.onMouseOver, false);
						},
						GetCaretPosition: function (ctrl) {
							var CaretPos = 0;
							if (document.selection) {
								ctrl.focus();
								var Sel = document.selection.createRange();
								Sel.moveStart('character', -ctrl.value.length);
								CaretPos = Sel.text.length;
							}

							else if (ctrl.selectionStart || ctrl.selectionStart == '0') CaretPos = ctrl.selectionStart;
							return (CaretPos);
						},
						SetCaretPosition: function (ctrl, pos) {
							if (ctrl.setSelectionRange) {
								ctrl.focus();
								ctrl.setSelectionRange(pos, pos);
							} else if (ctrl.createTextRange) {
								var range = ctrl.createTextRange();
								range.collapse(true);
								range.moveEnd('character', pos);
								range.moveStart('character', pos);
								range.select();
							}
						},
						onKey: function (ev) {
							var s = String.fromCharCode(ev.keyCode);
							var MRH = window.VLC.main.getInstance();

							// ALT+
							if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey) {
								// log("Alt+" + s);

								switch (s) {
                case "S":
									// insert [coords][/coords]
									var inputField = document.querySelector('input:focus, textarea:focus');
									if (inputField != null) {
										var position = MRH.GetCaretPosition(inputField);
										var txt = inputField.value;
										var insert = "[coords][/coords]";
										inputField.value = txt.substring(0, position) + insert + txt.substring(position, txt.length);
										MRH.SetCaretPosition(inputField, position + ("[coords]").length);
						 			}
									break;
                case "G":
									// insert [alliances][/alliances]
									var inputField = document.querySelector('input:focus, textarea:focus');
									if (inputField != null) {
										var position = MRH.GetCaretPosition(inputField);
										var txt = inputField.value;
										var insert = "[alliance][/alliance]";
										inputField.value = txt.substring(0, position) + insert + txt.substring(position, txt.length);
										MRH.SetCaretPosition(inputField, position + ("[alliance]").length);
						 			}
									break;
                case "I":
									// insert [i][/i] (italic)
									var inputField = document.querySelector('input:focus, textarea:focus');
									if (inputField != null) {
										var position = MRH.GetCaretPosition(inputField);
										var txt = inputField.value;
										var insert = "[i][/i]";
										inputField.value = txt.substring(0, position) + insert + txt.substring(position, txt.length);
										MRH.SetCaretPosition(inputField, position + ("[i]").length);
						 			}
									break;                    
				case "J":
									// moving mouse OVER map coordinates then the shortcut and it will automatically insert in [coords]
									var inputField = document.querySelector('input:focus, textarea:focus');
									if (inputField != null) {
										if (this.Coords != null) {
											var position = MRH.GetCaretPosition(inputField);
											var txt = inputField.value;
											var insert = "[coords]" + this.Coords + "[/coords]";
											inputField.value = txt.substring(0, position) + insert + txt.substring(position, txt.length);
											MRH.SetCaretPosition(inputField, position + insert.length);
										}
									}
									break;
                case "O":
									// insert [b][/b] (bold)
									var inputField = document.querySelector('input:focus, textarea:focus');
									if (inputField != null) {
										var position = MRH.GetCaretPosition(inputField);
										var txt = inputField.value;
										var insert = "[b][/b]";
										inputField.value = txt.substring(0, position) + insert + txt.substring(position, txt.length);
										MRH.SetCaretPosition(inputField, position + ("[b]").length);
						 			}
									break;
                case "P":
									// insert [player][/player]
									var inputField = document.querySelector('input:focus, textarea:focus');
									if (inputField != null) {
										var position = MRH.GetCaretPosition(inputField);
										var txt = inputField.value;
								 		var insert = "[player][/player]";
										inputField.value = txt.substring(0, position) + insert + txt.substring(position, txt.length);
										MRH.SetCaretPosition(inputField, position + ("[player]").length);
						 			}
									break; 
                case "R":
									// insert [s][/s] (strike)
									var inputField = document.querySelector('input:focus, textarea:focus');
									if (inputField != null) {
										var position = MRH.GetCaretPosition(inputField);
										var txt = inputField.value;
										var insert = "[s][/s]";
										inputField.value = txt.substring(0, position) + insert + txt.substring(position, txt.length);
										MRH.SetCaretPosition(inputField, position + ("[s]").length);
						 			}
									break;
				case "T":
									// insert [u][/u] (underline)
									var inputField = document.querySelector('input:focus, textarea:focus');
									if (inputField != null) {
										var position = MRH.GetCaretPosition(inputField);
										var txt = inputField.value;
										var insert = "[u][/u]";
										inputField.value = txt.substring(0, position) + insert + txt.substring(position, txt.length);
										MRH.SetCaretPosition(inputField, position + ("[u]").length);
						 			}
									break;
				case "U":
									// insert [url][/url]
									var inputField = document.querySelector('input:focus, textarea:focus');
									if (inputField != null) {
										var position = MRH.GetCaretPosition(inputField);
										var txt = inputField.value;
										var insert = "[url][/url]";
										inputField.value = txt.substring(0, position) + insert + txt.substring(position, txt.length);
										MRH.SetCaretPosition(inputField, position + ("[url]").length);
						 			}
									break;
				case "Z":
									// popup windows with insert an URL in [url][/url]
									var inputField = document.querySelector('input:focus, textarea:focus');
									if (inputField != null) {
										this.Coords = prompt("Input site Ex. http://Vulcanion.com", "");
										if (Coords != null) {
											var position = MRH.GetCaretPosition(inputField);
											var txt = inputField.value;
											var insert = "[url]" + this.Coords + "[/url]";
											inputField.value = txt.substring(0, position) + insert + txt.substring(position, txt.length);
											MRH.SetCaretPosition(inputField, position + insert.length);
										}
									}
									break;                    


								default:
									log("Other letter (" + s + ")");
								}
							}
						},
						onMouseOver: function (ev) {					
							var tag = ev.target.tagName;
							if (tag == "B" || tag == "DIV" || tag == "A") {
								var s = ev.target.textContent;
								var semicolon = s.indexOf(":");
								if (semicolon > 0) {
									var n1 = s.substring(0, semicolon);
									var n2 = s.substring(semicolon + 1, s.lenght);
									if (isFinite(n1) && isFinite(n2)) {
                                                                                if(s.length==5 && s[0]=="0") return;
										Coords = s;
										ClientLib.Vis.VisMain.GetInstance().PlayUISound('sounds/CollectTiberium');
									}
								}
							}
						},
					}
				});
			}


			function CnCTAShortcuts_checkIfLoaded() {
				try {
					if (typeof qx != 'undefined') {
						ap = qx.core.Init.getApplication();
						mb = qx.core.Init.getApplication().getMenuBar();
						if (ap && mb) {
							createInstance();
							window.VLC.main.getInstance().initialize();
						} else window.setTimeout(CnCTAShortcuts_checkIfLoaded, 1000);
					} else {
						window.setTimeout(CnCTAShortcuts_checkIfLoaded, 1000);
					}
				} catch (e) {
					if (typeof console != 'undefined') console.log(e);
					else if (window.opera) opera.postError(e);
					else GM_log(e);
				}
			}
			if (/commandandconquer\.com/i.test(document.domain)) {
				window.setTimeout(CnCTAShortcuts_checkIfLoaded, 1000);
			}
		}

	if (window.location.pathname != ("/login/auth")) {
		var TACScript = document.createElement("script");
		TACScript.innerHTML = "(" + CnCTAShortcutsMain.toString() + ")();";
		TACScript.type = "text/javascript";
		if (/commandandconquer\.com/i.test(document.domain)) {
			document.getElementsByTagName("head")[0].appendChild(TACScript);
		}
	}
})();

Ini();