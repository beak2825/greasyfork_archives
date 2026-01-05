// ==UserScript==
// @name        CC Tiberium Alliances Pack - by flyerdp
// @description The most usefull scripts for C&C Tiberium Alliance.
// @version     2.0.0
// @namespace   http*://*alliances*.com/*
// @include     http*://*alliances*.com/*
// @icon        http://s3.amazonaws.com/uso_ss/icon/171353/large.png?1371656082
// @grant       GM_getValue
// @grant       GM_log
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @author      flyerdp
// @locale      US
/* 
Pack list : 
 1 - Multi Session *version 0.5*
 2 - Infernal Wrapper (API needed) *version 0.390737.5*
 3 - Chat Helper Enhanced *version 3.2.0*
 4 - CNCOpt Link Button *version 1.7.6*
 5 - Coords Button *version 2.0.1*
 7 - MaelstromTools Dev *version 0.1.4.0*
 8 - Maelstrom ADDON Basescanner *version 1.8.5*
 9 - Dev AddonMainMenu *version 0.2*
10 - Navigate To Coords *version 1.1*
11- POIs Analyser *version 2.0.3*
12 - PvP/PvE Ranking within the Alliance *version 1.2*
13 - PvP/PvE Player Info Mod *version 1.2*
14 - WarChiefs - Tiberium Alliances Upgrade Base/Defense/Army *version 13.10.30*
15 - Zoom (SKY) *version Mar 11, 2013*
16 - Sector HUD *version 13.12.18*
17 - Title Mod *version 0.7.0*
18 - Tiberium Alliances Zoom (KOMMANDO)
19 - mhNavigator - Tiberium Alliances *version 1.3*
20 - COORDS 500:500 *version 1.2*
21 - Info Sticker *version 1.11.07*
22 - Tiberium Alliances Map (Elda-Mod) *version 2.0*
23 - Tiberium Alliances Info - Updated Layout *version 1.0.4*
24 - TA World Map *version 1.2 - Now works, found in *Scripts menu at top and allows up to 99 alliances and has enlarged HUD and a reset button for when someone changes their alliance name and the scanner hangs
25 - "Alliance Officials" Message Mod
26 - CDSIM 6.6
*/
// @downloadURL https://update.greasyfork.org/scripts/22398/CC%20Tiberium%20Alliances%20Pack%20-%20by%20flyerdp.user.js
// @updateURL https://update.greasyfork.org/scripts/22398/CC%20Tiberium%20Alliances%20Pack%20-%20by%20flyerdp.meta.js
// ==/UserScript==

// type: /chelp in any text box and hit <enter> for a list of commands

/***********************************************************************************
Multi Session ***** Version 0.5b
***********************************************************************************/

var $;

function log_it(e){
    if (typeof console != 'undefined') console.log('[Multi-Session] ', e);
    else if (window.opera) opera.postError('[Multi-Session] '+ e);
    else GM_log('[Multi-Session] '+ e);   
}

(function(){
    log_it("Wait for load....");
    cnc_ms_run1();   
})();

function cnc_ms_run1() {
    var head = document.getElementsByTagName('head')[0];
    if(!head)  {
        log_it("Wait for load....");
        window.setTimeout(cnc_ms_run1, 100);
    } else {
        if (typeof unsafeWindow.jQuery == 'undefined') {
            log_it("No Jquery Load it....");
            
            var jQuery_js = unsafeWindow.document.createElement('script');
            
            jQuery_js.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js';
            jQuery_js.type = 'text/javascript';
            jQuery_js.async = true;
            
            
           // head.insertBefore(jQuery_js, head.firstChild);
           	//head.appendChild(jQuery_js);
            
        }
        cnc_ms_run2();
    }
}



var wait_counter = 0;


function cnc_ms_run2() {
    if (typeof unsafeWindow.jQuery == 'undefined' ) {
        log_it("Wait for Jquery.... ");
        wait_counter = wait_counter + 1;
        window.setTimeout(cnc_ms_run2, 100);
    } else {
        $ = unsafeWindow.jQuery.noConflict(true);
        log_it("Jquery.... Done");
        $('.p4fnav-block').prepend('<div style="display:block;float:left;cursor:pointer;"><div class="p4fnav-topnav-separator"></div><span name="new_session" class="p4fnav-url">New Session</span></div>');          
        $('.returned-user').append(' - <b><span name="new_session" class="change-server" style="cursor:pointer;">New Session</span></b>');  
        
        
        $('[name="new_session"]').live("click", function(){
  			cncms_new_session();
		});
             
    }
}

  
function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}


function cncms_new_session() {
    eraseCookie("JSESSIONID");
    eraseCookie("Rememberme");
    eraseCookie("commandandconquer_remember_me");
    eraseCookie("commandandconquer_remember_me_success");
    window.location.reload();
}

/***********************************************************************************
Infernal Wrapper (API needed) ***** Version 0.390737.5
***********************************************************************************/
// ==UserScript==
// @namespace   https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @grant       none
// ==UserScript==
(function () {
    var CCTAWrapper_main = function () {
        try {
            _log = function () {
                if (typeof console != 'undefined') console.log(arguments);
                else if (window.opera) opera.postError(arguments);
                else GM_log(arguments);
            }

            function createCCTAWrapper() {
                console.log('CCTAWrapper loaded');
                _log('wrapper loading' + PerforceChangelist);
                System = $I;
                SharedLib = $I;
                var strFunction;
                
                // SharedLib.Combat.CbtSimulation.prototype.DoStep
                for (var x in $I) {
                    for (var key in $I[x].prototype) {
                        if ($I[x].prototype.hasOwnProperty(key) && typeof($I[x].prototype[key]) === 'function') {  // reduced iterations from 20K to 12K
                            strFunction = $I[x].prototype[key].toString();
                            if (strFunction.indexOf("().l;var b;for (var d = 0 ; d < c.length ; d++){b = c[d];if((b.") > -1) {
                                $I[x].prototype.DoStep = $I[x].prototype[key];
                                console.log("SharedLib.Combat.CbtSimulation.prototype.DoStep = $I." + x + ".prototype." + key);
                                break;
                            }
                        }
                    }
                }

                // ClientLib.Data.CityRepair.prototype.CanRepair
                for (var key in ClientLib.Data.CityRepair.prototype) {
                    if (typeof ClientLib.Data.CityRepair.prototype[key] === 'function') {
                        strFunction = ClientLib.Data.CityRepair.prototype[key].toString();
                        if (strFunction.indexOf("DefenseSetup") > -1 && strFunction.indexOf("DamagedEntity") > -1) {  // order important to reduce iterations
                            ClientLib.Data.CityRepair.prototype.CanRepair = ClientLib.Data.CityRepair.prototype[key];
                            console.log("ClientLib.Data.CityRepair.prototype.CanRepair = ClientLib.Data.CityRepair.prototype." + key);
                            break;
                        }
                    }
                }

                // ClientLib.Data.CityRepair.prototype.UpdateCachedFullRepairAllCost
                for (var key in ClientLib.Data.CityRepair.prototype) {
                    if (typeof ClientLib.Data.CityRepair.prototype[key] === 'function') {
                        strFunction = ClientLib.Data.CityRepair.prototype[key].toString();
                        if (strFunction.indexOf("Type==7") > -1 && strFunction.indexOf("var a=0;if") > -1) {  // order important to reduce iterations
                            ClientLib.Data.CityRepair.prototype.UpdateCachedFullRepairAllCost = ClientLib.Data.CityRepair.prototype[key];
                            console.log("ClientLib.Data.CityRepair.prototype.UpdateCachedFullRepairAllCost = ClientLib.Data.CityRepair.prototype." + key);
                            break;
                        }
                    }
                }

                // ClientLib.Data.CityUnits.prototype.get_OffenseUnits
                strFunction = ClientLib.Data.CityUnits.prototype.HasUnitMdbId.toString();
                var searchString = "for (var b in {d:this.";
                var startPos = strFunction.indexOf(searchString) + searchString.length;
                var fn_name = strFunction.slice(startPos, startPos + 6);
                strFunction = "var $createHelper;return this." + fn_name + ";";
                var fn = Function('', strFunction);
                ClientLib.Data.CityUnits.prototype.get_OffenseUnits = fn;
                console.log("ClientLib.Data.CityUnits.prototype.get_OffenseUnits = function(){var $createHelper;return this." + fn_name + ";}");

                // ClientLib.Data.CityUnits.prototype.get_DefenseUnits
                strFunction = ClientLib.Data.CityUnits.prototype.HasUnitMdbId.toString();
                searchString = "for (var c in {d:this.";
                startPos = strFunction.indexOf(searchString) + searchString.length;
                fn_name = strFunction.slice(startPos, startPos + 6);
                strFunction = "var $createHelper;return this." + fn_name + ";";
                fn = Function('', strFunction);
                ClientLib.Data.CityUnits.prototype.get_DefenseUnits = fn;
                console.log("ClientLib.Data.CityUnits.prototype.get_DefenseUnits = function(){var $createHelper;return this." + fn_name + ";}");

                // ClientLib.Vis.Battleground.Battleground.prototype.get_Simulation
                strFunction = ClientLib.Vis.Battleground.Battleground.prototype.StartBattle.toString();
                searchString = "=0;for(var a=0; (a<9); a++){this.";
                startPos = strFunction.indexOf(searchString) + searchString.length;
                fn_name = strFunction.slice(startPos, startPos + 6);
                strFunction = "return this." + fn_name + ";";
                fn = Function('', strFunction);
                ClientLib.Vis.Battleground.Battleground.prototype.get_Simulation = fn;
                console.log("ClientLib.Vis.Battleground.Battleground.prototype.get_Simulation = function(){return this." + fn_name + ";}");

                // GetNerfBoostModifier
                if (typeof ClientLib.Vis.Battleground.Battleground.prototype.GetNerfAndBoostModifier == 'undefined') ClientLib.Vis.Battleground.Battleground.prototype.GetNerfAndBoostModifier = ClientLib.Base.Util.GetNerfAndBoostModifier;

                _log('wrapper loaded');
            }
        } catch (e) {
            console.log("createCCTAWrapper: ", e);
        }

        function CCTAWrapper_checkIfLoaded() {
            try {
                if (typeof qx !== 'undefined') {
                    createCCTAWrapper();
                } else {
                    window.setTimeout(CCTAWrapper_checkIfLoaded, 1000);
                }
            } catch (e) {
                CCTAWrapper_IsInstalled = false;
                console.log("CCTAWrapper_checkIfLoaded: ", e);
            }
        }

        if (/commandandconquer\.com/i.test(document.domain)) {
            window.setTimeout(CCTAWrapper_checkIfLoaded, 1000);
        }
    }

    try {
        var CCTAWrapper = document.createElement("script");
        CCTAWrapper.innerHTML = "var CCTAWrapper_IsInstalled = true; (" + CCTAWrapper_main.toString() + ")();";
        CCTAWrapper.type = "text/javascript";
        if (/commandandconquer\.com/i.test(document.domain)) {
            document.getElementsByTagName("head")[0].appendChild(CCTAWrapper);
        }
    } catch (e) {
        console.log("CCTAWrapper: init error: ", e);
    }
})();

/***********************************************************************************
Dev AddonMainMenu ***** Version 0.2
***********************************************************************************/
// ==UserScript==
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @license     CC BY-NC-ND 3.0 - http://creativecommons.org/licenses/by-nc-nd/3.0/
// ==UserScript==
(function () {
	var AMMinnerHTML = function () {
		function AMM() {
			qx.Class.define("Addons.AddonMainMenu",{
				type : "singleton",
				extend : qx.core.Object,
				construct: function () { 				
					this.mainMenuContent = new qx.ui.menu.Menu();
					this.mainMenuButton = new qx.ui.form.MenuButton("*Scripts", null , this.mainMenuContent);
					this.mainMenuButton.set({
						width : 80,
						appearance : "button-bar-right",
						toolTipText : "List of AddonCommands"
					});
					var mainBar = qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_MENU);
                    var childs = mainBar.getChildren()[1].getChildren();
                    
                    for( var z = childs.length - 1; z>=0;z--){	                       
						if( typeof childs[z].setAppearance === "function"){							
							if( childs[z].getAppearance() == "button-bar-right"){
								childs[z].setAppearance("button-bar-center");
							}
						}
                    }
					
					mainBar.getChildren()[1].add(this.mainMenuButton);					
					mainBar.getChildren()[0].setScale(true); //kosmetik
					mainBar.getChildren()[0].setWidth(764 + 80 );	//kosmetik				
					//console.log("Button added");
                    Addons_AddonMainMenu = "loaded";
				},
				members :
				{
					mainMenuContent : null,
					mainMenuButton : null,
					AddMainMenu: function (name,command,key) {
						if(name == null){
							console.log("Addons.AddonMainMenu.AddSubMenu: name empty");
							return;
						}
						if(command == null){
							console.log("Addons.AddonMainMenu.AddMainMenu: command empty");
							return;
						}
						if(key != null){
							var newCommand = new qx.ui.core.Command(key);
							newCommand.addListener("execute", command);
							var button = new qx.ui.menu.Button(name, null, newCommand);
						} else {
							var button = new qx.ui.menu.Button(name);
							button.addListener("execute", command);
						}
						
						this.mainMenuContent.add(button);
						
					},
					AddSubMainMenu: function (name) {	
						if(name == null){
							console.log("Addons.AddonMainMenu.AddSubMainMenu: name empty");
							return;
						}					
						var subMenu = new qx.ui.menu.Menu;
						var button = new qx.ui.menu.Button(name, null, null, subMenu);
						this.mainMenuContent.add(button);
						return subMenu;
					},
					AddSubMenu: function (subMenu,name,command,key) {		
						if(name == null){
							console.log("Addons.AddonMainMenu.AddSubMenu: name empty");
							return;
						}
						if(command == null){
							console.log("Addons.AddonMainMenu.AddSubMenu: command empty");
							return;
						}						
						if(subMenu == null){
							console.log("Addons.AddonMainMenu.AddSubMenu: subMenu empty");
							return;
						}
						
						if(key != null){
							var newCommand = new qx.ui.core.Command(key);
							newCommand.addListener("execute", command);
							var button = new qx.ui.menu.Button(name, null, newCommand);
						} else {
							var button = new qx.ui.menu.Button(name);
							button.addListener("execute", command);
						}						
						subMenu.add(button);
						
						
						
						
						var subMenu = new qx.ui.menu.Menu;
						var actionsButton = new qx.ui.menu.Button(name, null, null, subMenu);
						return subMenu;
					}
				}
			});
            Addons.AddonMainMenu.getInstance();
            
			//-----TESTING------
			//var addonmenu  = Addons.AddonMainMenu.getInstance();		
			//addonmenu.AddMainMenu("TestMainButton",function(){debugfunction("1");},"ALT+J");
			//--SUBMENUS--
			//var submenu = addonmenu.AddSubMainMenu("TestSubMenu");
			//addonmenu.AddSubMenu(submenu,"TestSubButton 1",function(){debugfunction("2");},"ALT+L");
			//addonmenu.AddSubMenu(submenu,"TestSubButton 2",function(){debugfunction("3");});
			//addonmenu.AddSubMenu(submenu,"TestSubButton 3",function(){debugfunction("4");});
			
			//function debugfunction(k){
            	//console.log("working key:" + k);
			//}
		}
		
		
		
		function AMM_checkIfLoaded() {
			try {
				if (typeof qx != 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION) && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION).isVisible()) {
					AMM();
				} else {
					window.setTimeout(AMM_checkIfLoaded, 1000);
				}
			} catch (e) {
				console.log("AMM_checkIfLoaded: ", e);
			}
		}
		if (/commandandconquer\.com/i.test(document.domain)) {
			window.setTimeout(AMM_checkIfLoaded, 1000);
            Addons_AddonMainMenu = "install";
		}
	}
	try {
		var AMMS = document.createElement("script");
		AMMS.innerHTML = "(" + AMMinnerHTML.toString() + ")();";
		AMMS.type = "text/javascript";
		if (/commandandconquer\.com/i.test(document.domain)) {
			document.getElementsByTagName("head")[0].appendChild(AMMS);
		}
	} catch (e) {
		console.log("AMMinnerHTML init error: ", e);
	}
})();

/***********************************************************************************
Chat Helper Enhanced ***** Version 3.1.6
***********************************************************************************/
// ==UserScript==
// @include     https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// ==UserScript==
// window.chatHelper_suppressBrowserAltKeys suppresses normal browser menu keys [Alt+(a,p,b,i,u,s)] when you are in a textarea so that the menus don't open.
// ==UserScript==
(function () {
	var chatHelper_main = function () {
		window.chatHelper_debug = 0; //initial debug level, top level for easy console access
		var chlog = function chlog(str,lvl){
			if (lvl > 0) { //lvl 1+
				if (window.chatHelper_debug == 1) { // lvl 1
					console.log("ChatHelper_debug: "+str+"\n");
				}
				if (window.chatHelper_debug == 2) { // lvl 2
					console.log("ChatHelper_debug: "+str+"\n");
				}
				
			} else { //lvl 0 or no arg passed to lvl
				console.log("ChatHelper_log: "+str+"\n");
			}
		};
		try {
			function createchatHelper() {
				var onkeyupDelay = 50; //ms to wait after a keyupevent before searching contacts list. Lower for faster searching. Higher for better performance.
				window.chatHelper_suppressBrowserAltKeys = true;
				window.chatHelper_version = "3.1.6";
				window.chatHelper_name = "C&C: Tiberium Alliances Chat Helper Enhanced";
				chlog(window.chatHelper_name + ' v' + window.chatHelper_version + ': loading.',0);
				var saveObj = {
					saveObjVer : "3.1.6",
					contacts : []
				}
				
				var validCharPatt = /[-\w\.]/;
				var isWhisp = false;
				var contacts = [];
				var timer;
				var _sub;

				
				function getCaretPos(obj) {
					// getCaretPos from: http://userscripts.org/scripts/show/151099
					obj.focus();
					
					if (obj.selectionStart) {
						return obj.selectionStart; //Gecko
					} else if (document.selection) //IE
					{
						var sel = document.selection.createRange();
						var clone = sel.duplicate();
						sel.collapse(true);
						clone.moveToElementText(obj);
						clone.setEndPoint('EndToEnd', sel);
						return clone.text.length;
					}
					
					return 0;
				}
				
				function moveCaret(inputObject, pos) {
					// moveCaretPos from: http://userscripts.org/scripts/show/151099
					if (inputObject.selectionStart) {
						inputObject.setSelectionRange(pos, pos);
						inputObject.focus();
					}
				}
				
				function getCursorWordPos(inputField) {
					var pos = getCaretPos(inputField);
					var inText = inputField.value;
					var lc = inText.charAt(pos - 1);
					if (lc.match(validCharPatt) != null) {
						var sPos = pos;
						var ePos = pos;
						var t = inputField.value;
						while (sPos >= 0 && t.charAt(sPos - 1).match(validCharPatt) != null) {
							sPos--;
						}
						while (ePos <= t.length && t.charAt(ePos).match(validCharPatt) != null) {
							ePos++;
						}
						//inputField.setSelectionRange(sPos,ePos);
						return [sPos, ePos];
					}
				}
				
				function tagWith(tag, inputField) {
					var eTag = tag.replace('[', '[/'); //closing tag
					var tagLen = tag.length;
					var eTagLen = eTag.length;
					if (inputField != null) {
						var pos = getCaretPos(inputField);
						var inText = inputField.value;
						//save scroll position
						if (inputField.type === 'textarea')
							var st = inputField.scrollTop;
						//if there is selected text
						if (inputField.selectionStart !== inputField.selectionEnd) {
							var a = inText.slice(0, inputField.selectionStart);
							var b = inText.slice(inputField.selectionStart, inputField.selectionEnd);
							var c = inText.slice(inputField.selectionEnd, inText.length);
							inputField.value = a + tag + b + eTag + c;
							moveCaret(inputField, pos + tagLen + eTagLen + b.length);
							//if ((input IS empty) OR (the last char was a space)) AND next char ISNOT a left sqbracket
						} else if ((inText === "" || inText.charAt(pos - 1) === " ") && (inText.charAt(pos) !== '[')) {
							inputField.value = inText.substr(0, pos) + tag + eTag + inText.substr(pos, inText.length);
							moveCaret(inputField, pos + tagLen);
							//if last character is a valid playername character
						} else if (inText.charAt(pos - 1).match(validCharPatt) != null) {
							var arr = getCursorWordPos(inputField); //
							var s = arr[0];
							var e = arr[1];
							inputField.value = inText.slice(0, s) + tag + inText.slice(s, e) + eTag + inText.slice(e, inText.length);
							moveCaret(inputField, e + tagLen + eTagLen);
						}
						//restore scroll position
						if (inputField.type === 'textarea')
							inputField.scrollTop = st;
					}
				}
				
				function showHelp() {
					alert("Type /chelp in any text box to show this message.\n\nEnter key in chat:\tsearches your chat string for Urls and Coords and wraps them before submission.\n\nAlt + 1\t:\tsearches for Urls and Coords in a message or forum post and tags accordingly. Cursor is moved to the beginning.\nAlt + 2\t:\tManual URL insertion popup window\nAlt + 0\t:\tclears all tags\n\nWord wraps: tags a selected word -or- tags the word where the cursor is (if chat is empty or you hit <space> empty tags are inserted).\nAttempts to preserve cursor and scroll position.\n|\tAlt + p or Alt + 3\t:\tplayer tags\n|\tAlt + a or Alt + 4\t:\talliance tags\n|\tAlt + b\t\t\t:\tbold tags\n|\tAlt + i\t\t\t:\titalic tags\n|\tAlt + u\t\t\t:\tunderline tags\n|__\tAlt + s\t\t\t:\tstrikethrough tags\n\nContact list commands:\n/list -or- /contacts\n/add\n/del\n/del all - wipes your whole contact list");
				}
				
				function saveData() {
					saveObj.contacts = contacts;
					var jString = JSON.stringify(saveObj);
					chlog("saveJSON: "+jString, 1);
					localStorage.setItem('chatHelper', jString);
				}

				function loadData() {
					try{
						if (localStorage.getItem('myContacts')) { //should be removed eventually
							var dat = localStorage.getItem('myContacts');
							dat = dat.split(',');
							saveObj.contacts = dat;
							
							//unset old storage 
							localStorage.removeItem('myContacts');
						} else if (localStorage.getItem('chatHelper')) {
							var saveObjTmp = JSON.parse(localStorage.getItem('chatHelper'));
							if (saveObjTmp.saveObjVer != window.chatHelper_version){
								//version changed
								var va = saveObjTmp.saveObjVer.split('.');
								var vb = window.chatHelper_version.split('.');
								
								if (va[0] != vb[0]){ //major version change
									chlog("ChatHelper: Major version change from v"+va[0]+"."+va[1]+"."+va[2]+" to v"+vb[0]+"."+vb[1]+"."+vb[2]);
								} else {
									if (va[1] != vb[1]){ //minor version change
										chlog("ChatHelper: Minor version change from v"+va[0]+"."+va[1]+"."+va[2]+" to v"+vb[0]+"."+vb[1]+"."+vb[2]);
									} else {
										if (va[2] != vb[2]){ //patch release
											chlog("ChatHelper: Version Patched from v"+va[0]+"."+va[1]+"."+va[2]+" to v"+vb[0]+"."+vb[1]+"."+vb[2]);
										}
									}
								}
							} else {
								//no version change
								localStorage.getItem('chatHelper');
							}
							saveObj = saveObjTmp;
						}
						contacts = saveObj.contacts;
						saveData();
					}catch(err){
						chlog(err);
					}
				}
				
				if (!localStorage.myContacts) {
					chlog("Deprecated contacts variable does not exist.",1);
					loadData();
				} else {
					//contacts = loadData();
					loadData();
					chlog("Contacts: " + contacts, 1);
				}
				
				function saveContact(fr) {
					chlog("Number of contacts == "+contacts.length,1);
					contacts.push(fr);
					chlog(fr + " added to contacts list.",1);
					saveData();
				}
				
				function caseInsensitiveSort(a, b) {
					a = a.toLowerCase();
					b = b.toLowerCase();
					if (a > b)
						return 1;
					if (a < b)
						return -1;
					return 0;
				}
				
				function listContacts() {
					var len = contacts.length;
					var a = contacts.sort(caseInsensitiveSort);
					if (len == 1) {
						alert(len + " Contact:\n\n" + a.join("\n") + "\n");
					} else if (len > 1) {
						alert(len + " Contacts:\n\n" + a.join("\n") + "\n");
					} else {
						var p = prompt("Your contacts list is empty.\n\nType a name here to add a contact:\n", "");
						if (p) {
							saveContact(p);
						}
					}
				}
				
				function deleteContact(fr) {
					if (fr === "all") {
						contacts = [];
						chlog("All contacts deleted",1);
						saveData();
					} else {
						var ind = contacts.indexOf(fr);
						if (ind > -1) {
							saveObj.contacts = contacts.splice(ind, 1);
							saveData();
							chlog(contacts,1);
							chlog(fr + " deleted from contacts list.");
						}
					}
				}
				function keyUpTimer(kEv) {
					kEv = kEv || window.event;
					if (kEv.target.type === "text" && kEv.target.value != '') {
						var inputField = kEv.target;
						var inText = inputField.value;
						var len = inText.length;
						var sub;
						var kc = kEv.keyCode;
						if (len >= 10 && inText.match(/^(\/whisper)/) != null) {
							isWhisp = true;
						}
						if (isWhisp && len >= 10 && !kEv.altGraphKey && !kEv.ctrlKey && !kEv.altKey && kc > 47 && kc < 91) {
							chlog("keyUpTimer keyCode =="+kEv.keyCode,1);
							sub = inText.substr(9);
							if (!sub.match(/\s/)) {
								for (var i = 0; i < contacts.length; i++) {
									var slen = sub.length;
									if (contacts[i][slen - 1] === sub[slen - 1] && contacts[i].substr(0, slen) == sub) {
										inputField.value = "/whisper " + contacts[i] + " ";
										inputField.setSelectionRange(10 + slen - 1, 10 + contacts[i].length, "forward");
									}
								}
							} else {
								isWhisp = false;
							}
						} else {
							isWhisp = false;
						}
					}
				}
				
				document.onkeyup = function (kEv) {
					clearTimeout(timer);
					timer = setTimeout(function () {
							keyUpTimer(kEv);
						}, onkeyupDelay);
				}
				
				function delayedConfirm() {
					if (confirm("Add " + _sub + " to your contacts list?\n\nYou can see a list of your contacts by typing /list")) {
						saveContact(_sub);
					}
				}
				
				function autoTag(inputField, inText) {
					var isUrl = false;
					var lookBack;
					//the code here is mostly from Bruce Doan: http://userscripts.org/scripts/show/151965
					////auto url
					inText = inText.replace(/(\[url\])*(https?:\/\/)([\da-z\.-]+)(\.[a-z]{2,6})([\/\w\.\-\=\?\&\%\+\|#:;,~\*\(\)\$]*)*\/?(\[\/url\])*/gi, function () {
							var result = new Array();
							var protocol = arguments[2].match(/https?:\/\//);
							for (var i in arguments){
								chlog("autoTag url reg arg "+i + "= " + arguments[i],1);
							}
							result.push('[url]');
							result.push(arguments[2]); // http[s]://
							result.push(arguments[3]); // domain
							result.push(arguments[4]); // ext
							result.push(arguments[5]); // query string
							result.push('[/url]');
							if (protocol === null){
								chlog("autotag url - no protocol",2);
							} else {
								isUrl = true;
								chlog("bypassing coords tagging\n detected protocol = " + protocol,2);
								
							}
							return result.join('');
						});
					////auto coords
					if (!isUrl) {
						chlog("checking for coords",1);
						lookBack = inText.replace(/(\[coords\])?([#])?([0-9]{3,4})[:.]([0-9]{3,4})([:.]\w+)?(\[\/coords\])?/gi, function () {
								for (var i in arguments){
									chlog("autoTag coords reg arg " + i + " = " + arguments[i],1);
								}
								var hashBefore = arguments[2];
								chlog("hashBefore "+hashBefore,1);
								if (!hashBefore) {
									chlog("no hash returning");
									var result = new Array();
									result.push('[coords]');
									result.push(arguments[3]);
									result.push(':');
									result.push(arguments[4]);
									if (arguments[5] != undefined) {
										result.push(arguments[5].replace('.', ':'));
									}
									result.push('[/coords]');
									return result.join('');
								} else {
									return arguments[0];
								}
							});
						inText = lookBack;
						chlog("lookedback",1);
						chlog("LB string: "+lookBack,1);
					}
					// shorthand for player
					inText = inText.replace(/\[p\]([a-z0-9_\-\s]+)\[\/p\]/gi, '[player]$1[/player]');
					// shorthand for alliance
					inText = inText.replace(/\[a\]([a-z0-9_\-\s]+)\[\/a\]/gi, '[alliance]$1[/alliance]');
					
					return inText;
				}
				
				document.onkeydown = function (kEv) {
					kEv = kEv || window.event;
					
					/* Tab key
					if (kEv.keyCode == 9){
						chlog("Tab key pressed",1)
						var input = qx.core.Init.getApplication().getChat().getChatWidget().getEditable(); // Input
						kEv.preventDefault();
						kEv.stopPropagation();
					}
					 */
					if (!kEv.shiftKey && kEv.keyCode === 13 && (kEv.target.type === "text" || kEv.target.type === "textarea")) {
						var inputField = kEv.target;
						var inText = inputField.value;
						var add = inText.match(/^(\/add)/);
						var del = inText.match(/^(\/del)/);
						var showContacts = inText.match(/^((\/contacts)|(\/list))/);
						var sub;
						var cf;
						if (inText.match(/^(\/whisper)/) != null || add != null) {
							if (add != null) {
								sub = inText.substr(5);
							} else {
								sub = inText.substr(9);
							}
							if (sub.match(/^(\w*)\s/)) {
								//if space after player name (is a whisper or a typo)
								var arr = sub.match(/^(\w*)/);
								sub = arr[0].replace(/\s$/, "");
								if (contacts.indexOf(sub) == -1) {
									//not in contacts list
									_sub = sub;
									setTimeout(delayedConfirm, 500);
								}
							} else if (contacts.indexOf(sub) == -1) {
								//no message to send, not in contacts, promt to add, clear input
								chlog("clearing input field",1);
								inputField.focus(); //?necessary?
								inputField.value = "";
								var cf = confirm("Add " + sub + " to your contacts list?\n\nYou can see a list of your contacts by typing /list");
								if (cf) {
									saveContact(sub);
									return false;
								} else {
									return false;
								}
							} else if (sub && contacts.indexOf(sub) > -1) {
								//not a whisper, reject duplicate contact
								alert(sub + " is already in your contacts list.");
							}
						}
						//remove contact(s)
						if (del) {
							sub = inText.substr(5);
							chlog("clearing input field",1);
							inputField.value = "";
							if ((contacts.indexOf(sub) > -1 || sub == "all") && confirm("Really delete " + sub + " from your contacts?")) {
								deleteContact(sub);
							} else {
								alert(sub + " is not in your contacts list.");
							}
							return false;
						}
						// show contacts list
						if (showContacts) {
							chlog("clearing input field",1);
							inputField.value = "";
							listContacts();
							return false;
							
						}
						// /chelp dialog
						if (inText.length === 6 && inText.match(/^(\/chelp)/) != null) {
							chlog("clearing input field",1);
							inputField.value = "";
							showHelp();
							return false;
						}
						
						if (inputField != null && inputField.type === "text" && inText !== "") {
							chlog("onEnter auto-tagging",1);
							
							inText = autoTag(inputField, inText); //auto-tag
							
							if (inText !== inputField.value) {
								inputField.value = inText;
							}
						}
					}
					
					if (kEv.altKey && !kEv.shiftKey && !kEv.altGraphKey && !kEv.ctrlKey && kEv.target != null && (kEv.target.type === "textarea" || kEv.target.type === "text")) {
						var inputField = kEv.target;
						var inText = inputField.value;
						// Alt key, not Ctrl or AltGr
						if (kEv.altKey && !kEv.altGraphKey && !kEv.ctrlKey) {
							var cc = kEv.charCode;
							var kc = kEv.keyCode;
							chlog("charCode == "+cc,1);
							chlog("keyCode == "+kc,1);

							/* Alt+1 for auto Coordinates/Urls in message body */
							if (inputField.type === "textarea" && (cc === 49 || kc === 49)) {
								var pos = getCaretPos(inputField);
								chlog("attempting Alt+1 message auto-tag",1);
								if (inputField != null) {
									var st = inputField.scrollTop;
									
									inText = autoTag(inputField, inText); //auto-tag
									
									if (inText !== "" || inText !== inputField.value) {
										inputField.value = inText;
										inputField.scrollTop = st;
										moveCaret(inputField, 0);
									}
								}
							}
							/* Alt+2 for URLs fallback */
							if (cc === 50 || kc === 50) {
								if (inputField != null) {
									var url = prompt("Website (Syntax: google.com or www.google.com)", "");
									if (url != null) {
										inputField.value += '[url]' + url + '[/url]';
									}
								}
							}
							/* Alt+3 or Alt+p for players */
							if ((cc === 112 || kc === 80) || (cc === 51 || kc === 51)) {
								tagWith('[player]', inputField);
								if (window.chatHelper_suppressBrowserAltKeys)
									return false;
							}
							/* Alt+4 or Alt+a for alliances */
							if ((cc === 97 || kc === 65) || (cc === 52 || kc === 52)) {
								tagWith('[alliance]', inputField);
								if (window.chatHelper_suppressBrowserAltKeys)
									return false;
							}
							/* Alt+0 to clear tags */
							if (cc === 48 || kc === 48) {
								if (inputField.type === 'textarea')
									var st = inputField.scrollTop;
								if (inputField != null) {
									inText = inText.replace(/\[\/?coords\]/gi, '');
									inText = inText.replace(/\[\/?url\]/gi, '');
									inText = inText.replace(/\[\/?player\]/gi, '');
									inText = inText.replace(/\[\/?alliance\]/gi, '');
									inText = inText.replace(/\[\/?b\]/gi, '');
									inText = inText.replace(/\[\/?i\]/gi, '');
									inText = inText.replace(/\[\/?u\]/gi, '');
									inText = inText.replace(/\[\/?s\]/gi, '');
									inputField.value = inText;
								}
								if (inputField.type === 'textarea')
									inputField.scrollTop = st;
							}
							/* Alt+b for bold */
							if (cc === 98 || kc === 66) {
								tagWith('[b]', inputField);
								if (window.chatHelper_suppressBrowserAltKeys)
									return false;
							}
							/* Alt+i for italics */
							if (cc === 105 || kc === 73) {
								tagWith('[i]', inputField);
								if (window.chatHelper_suppressBrowserAltKeys)
									return false;
							}
							/* Alt+u for underline */
							if (cc === 117 || kc === 85) {
								tagWith('[u]', inputField);
								if (window.chatHelper_suppressBrowserAltKeys)
									return false;
							}
							/* Alt+s for strikethrough */
							if (cc === 115 || kc === 83) {
								tagWith('[s]', inputField);
								if (window.chatHelper_suppressBrowserAltKeys)
									return false;
							}
						}
					}
				}
			}
		} catch (err) {
			chlog("createchatHelper: "+ err,1);
			console.error(err);
		}
		
		function chatHelper_checkIfLoaded() {
			try {
				if (typeof qx !== 'undefined') {
					createchatHelper();
				} else {
					window.setTimeout(chatHelper_checkIfLoaded, 1333);
				}
			} catch (err) {
				console.log("chatHelper_checkIfLoaded: ", err);
			}
		}
		window.setTimeout(chatHelper_checkIfLoaded, 1333);
	};
	try {
		var chatHelper = document.createElement("script");
		chatHelper.innerHTML = "(" + chatHelper_main.toString() + ")();";
		chatHelper.type = "text/javascript";
		document.getElementsByTagName("head")[0].appendChild(chatHelper);
	} catch (err) {
		console.log("chatHelper: init error: ", err);
	}
})();
// ==UserScript==
// @name        C&C: Tiberium Alliances Chat Helper Enhanced Yiannis Mod
// @namespace   https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @description Automates the use of chat and message BB-Codes: [coords][url][player][alliance][b][i][s][u] - Contact list for whispering - Type /chelp <enter> in chat for help.
// @include     https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version     3.2.0
// @icon        https://sites.google.com/site/titlemod/home/favicon.png
// @grant       none
// ==/UserScript==
 
// type: /chelp in any text box and hit <enter> for a list of commands
 
// Please report urls that are not tagged properly
 
// window.chatHelper_suppressBrowserAltKeys suppresses normal browser menu keys [Alt+(a,p,b,i,u,s)] when you are in a textarea so that the menus don't open.
 
(function () {
    var chatHelper_main = function () {
        window.chatHelper_debug = 0; //initial debug level, top level for easy console access
        var chlog = function chlog(str,lvl){
            if (lvl > 0) { //lvl 1+
                if (window.chatHelper_debug == 1) { // lvl 1
                    console.log("ChatHelper_debug: "+str+"\n");
                }
                if (window.chatHelper_debug == 2) { // lvl 2
                    console.log("ChatHelper_debug: "+str+"\n");
                }
 
            } else { //lvl 0 or no arg passed to lvl
                console.log("ChatHelper_log: "+str+"\n");
            }
        };
        try {
            function createchatHelper() {
                var onkeyupDelay = 50; //ms to wait after a keyupevent before searching contacts list. Lower for faster searching. Higher for better performance.
                window.chatHelper_suppressBrowserAltKeys = true;
                window.chatHelper_version = "3.2.0";
                window.chatHelper_name = "C&C: Tiberium Alliances Chat Helper Enhanced";
                chlog(window.chatHelper_name + ' v' + window.chatHelper_version + ': loading.',0);
                var saveObj = {
                    saveObjVer : "3.2.0",
                    contacts : []
                };
 
                var validCharPatt = /[-\w\.]/;
                var isWhisp = false;
                var contacts = [];
                var timer;
                var _sub;
 
 
                function getCaretPos(obj) {
                    // getCaretPos from: http://userscripts.org/scripts/show/151099
                    obj.focus();
 
                    if (obj.selectionStart) {
                        return obj.selectionStart; //Gecko
                    } else if (document.selection) //IE
                    {
                        var sel = document.selection.createRange();
                        var clone = sel.duplicate();
                        sel.collapse(true);
                        clone.moveToElementText(obj);
                        clone.setEndPoint('EndToEnd', sel);
                        return clone.text.length;
                    }
 
                    return 0;
                }
 
                function moveCaret(inputObject, pos) {
                    // moveCaretPos from: http://userscripts.org/scripts/show/151099
                    if (inputObject.selectionStart) {
                        inputObject.setSelectionRange(pos, pos);
                        inputObject.focus();
                    }
                }
 
                function getCursorWordPos(inputField) {
                    var pos = getCaretPos(inputField);
                    var inText = inputField.value;
                    var lc = inText.charAt(pos - 1);
                    if (lc.match(validCharPatt) !== null) {
                        var sPos = pos;
                        var ePos = pos;
                        var t = inputField.value;
                        while (sPos >= 0 && t.charAt(sPos - 1).match(validCharPatt) !== null) {
                            sPos--;
                        }
                        while (ePos <= t.length && t.charAt(ePos).match(validCharPatt) !== null) {
                            ePos++;
                        }
                        //inputField.setSelectionRange(sPos,ePos);
                        return [sPos, ePos];
                    }
                }
 
                function tagWith(tag, inputField) {
                    var eTag = tag.replace('[', '[/'); //closing tag
                    var tagLen = tag.length;
                    var eTagLen = eTag.length;
                    if (inputField !== null) {
                        var pos = getCaretPos(inputField);
                        var inText = inputField.value;
                        //save scroll position
                        if (inputField.type === 'textarea')
                            var st = inputField.scrollTop;
                        //if there is selected text
                        if (inputField.selectionStart !== inputField.selectionEnd) {
                            var a = inText.slice(0, inputField.selectionStart);
                            var b = inText.slice(inputField.selectionStart, inputField.selectionEnd);
                            var c = inText.slice(inputField.selectionEnd, inText.length);
                            inputField.value = a + tag + b + eTag + c;
                            moveCaret(inputField, pos + tagLen + eTagLen + b.length);
                            //if ((input IS empty) OR (the last char was a space)) AND next char ISNOT a left sqbracket
                        } else if ((inText === "" || inText.charAt(pos - 1) === " ") && (inText.charAt(pos) !== '[')) {
                            inputField.value = inText.substr(0, pos) + tag + eTag + inText.substr(pos, inText.length);
                            moveCaret(inputField, pos + tagLen);
                            //if last character is a valid playername character
                        } else if (inText.charAt(pos - 1).match(validCharPatt) !== null) {
                            var arr = getCursorWordPos(inputField); //
                            var s = arr[0];
                            var e = arr[1];
                            inputField.value = inText.slice(0, s) + tag + inText.slice(s, e) + eTag + inText.slice(e, inText.length);
                            moveCaret(inputField, e + tagLen + eTagLen);
                        }
                        //restore scroll position
                        if (inputField.type === 'textarea')
                            inputField.scrollTop = st;
                    }
                }
 
                function showHelp() {
                    alert("Type /chelp in any text box to show this message.\n\nEnter key in chat:\tsearches your chat string for Urls and Coords and wraps them before submission.\n\nAlt + 1\t:\tsearches for Urls and Coords in a message or forum post and tags accordingly. Cursor is moved to the beginning.\nAlt + 2\t:\tManual URL insertion popup window\nAlt + 0\t:\tclears all tags\n\nWord wraps: tags a selected word -or- tags the word where the cursor is (if chat is empty or you hit <space> empty tags are inserted).\nAttempts to preserve cursor and scroll position.\n|\tAlt + p or Alt + 3\t:\tplayer tags\n|\tAlt + a or Alt + 4\t:\talliance tags\n|\tAlt + b\t\t\t:\tbold tags\n|\tAlt + i\t\t\t:\titalic tags\n|\tAlt + u\t\t\t:\tunderline tags\n|__\tAlt + s\t\t\t:\tstrikethrough tags\n\nContact list commands:\n/list -or- /contacts\n/add\n/del\n/del all - wipes your whole contact list");
                }
 
                function saveData() {
                    saveObj.contacts = contacts;
                    var jString = JSON.stringify(saveObj);
                    chlog("saveJSON: "+jString, 1);
                    localStorage.setItem('chatHelper', jString);
                }
 
                function loadData() {
                    try{
                        if (localStorage.getItem('myContacts')) { //should be removed eventually
                            var dat = localStorage.getItem('myContacts');
                            dat = dat.split(',');
                            saveObj.contacts = dat;
 
                            //unset old storage 
                            localStorage.removeItem('myContacts');
                        } else if (localStorage.getItem('chatHelper')) {
                            var saveObjTmp = JSON.parse(localStorage.getItem('chatHelper'));
                            if (saveObjTmp.saveObjVer != window.chatHelper_version){
                                //version changed
                                var va = saveObjTmp.saveObjVer.split('.');
                                var vb = window.chatHelper_version.split('.');
 
                                if (va[0] != vb[0]){ //major version change
                                    chlog("ChatHelper: Major version change from v"+va[0]+"."+va[1]+"."+va[2]+" to v"+vb[0]+"."+vb[1]+"."+vb[2]);
                                } else {
                                    if (va[1] != vb[1]){ //minor version change
                                        chlog("ChatHelper: Minor version change from v"+va[0]+"."+va[1]+"."+va[2]+" to v"+vb[0]+"."+vb[1]+"."+vb[2]);
                                    } else {
                                        if (va[2] != vb[2]){ //patch release
                                            chlog("ChatHelper: Version Patched from v"+va[0]+"."+va[1]+"."+va[2]+" to v"+vb[0]+"."+vb[1]+"."+vb[2]);
                                        }
                                    }
                                }
                            } else {
                                //no version change
                                localStorage.getItem('chatHelper');
                            }
                            saveObj = saveObjTmp;
                        }
                        contacts = saveObj.contacts;
                        saveData();
                    }catch(err){
                        chlog(err);
                    }
                }
 
                if (!localStorage.myContacts) {
                    chlog("Deprecated contacts variable does not exist.",1);
                    loadData();
                } else {
                    //contacts = loadData();
                    loadData();
                    chlog("Contacts: " + contacts, 1);
                }
 
                function saveContact(fr) {
                    chlog("Number of contacts == "+contacts.length,1);
                    contacts.push(fr);
                    chlog(fr + " added to contacts list.",1);
                    saveData();
                }
 
                function caseInsensitiveSort(a, b) {
                    a = a.toLowerCase();
                    b = b.toLowerCase();
                    if (a > b)
                        return 1;
                    if (a < b)
                        return -1;
                    return 0;
                }
 
                function listContacts() {
                    var len = contacts.length;
                    var a = contacts.sort(caseInsensitiveSort);
                    if (len == 1) {
                        alert(len + " Contact:\n\n" + a.join("\n") + "\n");
                    } else if (len > 1) {
                        alert(len + " Contacts:\n\n" + a.join("\n") + "\n");
                    } else {
                        var p = prompt("Your contacts list is empty.\n\nType a name here to add a contact:\n", "");
                        if (p) {
                            saveContact(p);
                        }
                    }
                }
 
                function deleteContact(fr) {
                    if (fr === "all") {
                        contacts = [];
                        chlog("All contacts deleted",1);
                        saveData();
                    } else {
                        var ind = contacts.indexOf(fr);
                        if (ind > -1) {
                            saveObj.contacts = contacts.splice(ind, 1);
                            saveData();
                            chlog(contacts,1);
                            chlog(fr + " deleted from contacts list.");
                        }
                    }
                }
                function keyUpTimer(kEv) {
                    kEv = kEv || window.event;
                    if (kEv.target.type === "text" && kEv.target.value !== '') {
                        var inputField = kEv.target;
                        var inText = inputField.value;
                        var len = inText.length;
                        var sub;
                        var kc = kEv.keyCode;
                        if (len >= 10 && inText.match(/^(\/whisper)/) !== null) {
                            isWhisp = true;
                        }
                        if (isWhisp && len >= 10 && !kEv.altGraphKey && !kEv.ctrlKey && !kEv.altKey && kc > 47 && kc < 91) {
                            chlog("keyUpTimer keyCode =="+kEv.keyCode,1);
                            sub = inText.substr(9);
                            if (!sub.match(/\s/)) {
                                for (var i = 0; i < contacts.length; i++) {
                                    var slen = sub.length;
                                    if (contacts[i][slen - 1] === sub[slen - 1] && contacts[i].substr(0, slen) == sub) {
                                        inputField.value = "/whisper " + contacts[i] + " ";
                                        inputField.setSelectionRange(10 + slen - 1, 10 + contacts[i].length, "forward");
                                    }
                                }
                            } else {
                                isWhisp = false;
                            }
                        } else {
                            isWhisp = false;
                        }
                    }
                }
 
                document.onkeyup = function (kEv) {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        keyUpTimer(kEv);
                    }, onkeyupDelay);
                };
 
                function delayedConfirm() {
                    if (confirm("Add " + _sub + " to your contacts list?\n\nYou can see a list of your contacts by typing /list")) {
                        saveContact(_sub);
                    }
                }
 
                function autoTag(inputField, inText) {
//                    var isUrl = false;
//                    var lookBack;
                    ////auto coords
                    inText = inText.replace(/(\[coords\])*([0-9]{3,4})[:|.]([0-9]{3,4})([:|.]\w+)?(\[\/coords\])*/gi, function(){
                        var result = new Array();
                        result.push('[coords]');
                        result.push(arguments[2]);
                        result.push(':');
                        result.push(arguments[3]);
                        if(arguments[4] !== undefined) {
                            result.push(arguments[4].replace('.',':'));
                        }
                        result.push('[/coords]');
                        return result.join('');
                    });                    // shorthand for player
                    ////auto url
                    inText = inText.replace(/(\[url\])*(https?:\/\/)?([\da-z\.-]+)(\.[a-z]{2,6})([\/\w\.\-\=\?\&#]*)*\/?(\[\/url\])*/gi, function(){
                        var result = new Array();
                        result.push('[url]');
                        result.push(arguments[2]); // http[s]://
                        result.push(arguments[3]); // domain
                        result.push(arguments[4]); // ext
                        result.push(arguments[5]); // query string
                        result.push('[/url]');
                        return result.join('');
                    });
                    inText = inText.replace(/\[p\]([a-z0-9_\-\s]+)\[\/p\]/gi, '[player]$1[/player]');
                    // shorthand for alliance
                    inText = inText.replace(/\[a\]([a-z0-9_\-\s]+)\[\/a\]/gi, '[alliance]$1[/alliance]');
 
                    return inText;
                }
 
                document.onkeydown = function (kEv) {
                    kEv = kEv || window.event;
 
                    /* Tab key
                    if (kEv.keyCode == 9){
                        chlog("Tab key pressed",1)
                        var input = qx.core.Init.getApplication().getChat().getChatWidget().getEditable(); // Input
                        kEv.preventDefault();
                        kEv.stopPropagation();
                    }
                     */
                    if (kEv.keyCode === 13) {
                        var inputField = document.querySelector('input:focus, textarea:focus');
                        var inText = inputField.value;
                        var add = inText.match(/^(\/add)/);
                        var del = inText.match(/^(\/del)/);
                        var showContacts = inText.match(/^((\/contacts)|(\/list))/);
                        var sub;
                        var cf;
                        if (inText.match(/^(\/whisper)/) !== null || add !== null) {
                            if (add !== null) {
                                sub = inText.substr(5);
                            } else {
                                sub = inText.substr(9);
                            }
                            if (sub.match(/^(\w*)\s/)) {
                                //if space after player name (is a whisper or a typo)
                                var arr = sub.match(/^(\w*)/);
                                sub = arr[0].replace(/\s$/, "");
                                if (contacts.indexOf(sub) == -1) {
                                    //not in contacts list
                                    _sub = sub;
                                    setTimeout(delayedConfirm, 500);
                                }
                            } else if (contacts.indexOf(sub) == -1) {
                                //no message to send, not in contacts, promt to add, clear input
                                chlog("clearing input field",1);
                                inputField.focus(); //?necessary?
                                inputField.value = "";
                                var cf = confirm("Add " + sub + " to your contacts list?\n\nYou can see a list of your contacts by typing /list");
                                if (cf) {
                                    saveContact(sub);
                                    return false;
                                } else {
                                    return false;
                                }
                            } else if (sub && contacts.indexOf(sub) > -1) {
                                //not a whisper, reject duplicate contact
                                alert(sub + " is already in your contacts list.");
                            }
                        }
                        //remove contact(s)
                        if (del) {
                            sub = inText.substr(5);
                            chlog("clearing input field",1);
                            inputField.value = "";
                            if ((contacts.indexOf(sub) > -1 || sub == "all") && confirm("Really delete " + sub + " from your contacts?")) {
                                deleteContact(sub);
                            } else {
                                alert(sub + " is not in your contacts list.");
                            }
                            return false;
                        }
                        // show contacts list
                        if (showContacts) {
                            chlog("clearing input field",1);
                            inputField.value = "";
                            listContacts();
                            return false;
 
                        }
                        // /chelp dialog
                        if (inText.length === 6 && inText.match(/^(\/chelp)/) !== null) {
                            chlog("clearing input field",1);
                            inputField.value = "";
                            showHelp();
                            return false;
                        }
 
                        if (inputField !== null) {
                            chlog("onEnter auto-tagging",1);
 
                            inText = autoTag(inputField, inText); //auto-tag
 
                            if (inText !== inputField.value) {
                                inputField.value = inText;
                            }
                        }
                    }
 
                    if (kEv.altKey && !kEv.shiftKey && !kEv.altGraphKey && !kEv.ctrlKey && kEv.target !== null && (kEv.target.type === "textarea" || kEv.target.type === "text")) {
                        var inputField = kEv.target;
                        var inText = inputField.value;
                        // Alt key, not Ctrl or AltGr
                        if (kEv.altKey && !kEv.altGraphKey && !kEv.ctrlKey) {
                            var cc = kEv.charCode;
                            var kc = kEv.keyCode;
                            chlog("charCode == "+cc,1);
                            chlog("keyCode == "+kc,1);
 
                            /* Alt+1 for auto Coordinates/Urls in message body */
                            if (inputField.type === "textarea" && (cc === 49 || kc === 49)) {
                                var pos = getCaretPos(inputField);
                                chlog("attempting Alt+1 message auto-tag",1);
                                if (inputField !== null) {
                                    var st = inputField.scrollTop;
 
                                    inText = autoTag(inputField, inText); //auto-tag
 
                                    if (inText !== "" || inText !== inputField.value) {
                                        inputField.value = inText;
                                        inputField.scrollTop = st;
                                        moveCaret(inputField, 0);
                                    }
                                }
                            }
                            /* Alt+2 for URLs fallback */
                            if (cc === 50 || kc === 50) {
                                if (inputField !== null) {
                                    var url = prompt("Website (Syntax: google.com or www.google.com)", "");
                                    if (url !== null) {
                                        inputField.value += '[url]' + url + '[/url]';
                                    }
                                }
                            }
                            /* Alt+3 or Alt+p for players */
                            if ((cc === 112 || kc === 80) || (cc === 51 || kc === 51)) {
                                tagWith('[player]', inputField);
                                if (window.chatHelper_suppressBrowserAltKeys)
                                    return false;
                            }
                            /* Alt+4 or Alt+a for alliances */
                            if ((cc === 97 || kc === 65) || (cc === 52 || kc === 52)) {
                                tagWith('[alliance]', inputField);
                                if (window.chatHelper_suppressBrowserAltKeys)
                                    return false;
                            }
                            /* Alt+0 to clear tags */
                            if (cc === 48 || kc === 48) {
                                if (inputField.type === 'textarea')
                                    var st = inputField.scrollTop;
                                if (inputField !== null) {
                                    inText = inText.replace(/\[\/?coords\]/gi, '');
                                    inText = inText.replace(/\[\/?url\]/gi, '');
                                    inText = inText.replace(/\[\/?player\]/gi, '');
                                    inText = inText.replace(/\[\/?alliance\]/gi, '');
                                    inText = inText.replace(/\[\/?b\]/gi, '');
                                    inText = inText.replace(/\[\/?i\]/gi, '');
                                    inText = inText.replace(/\[\/?u\]/gi, '');
                                    inText = inText.replace(/\[\/?s\]/gi, '');
                                    inputField.value = inText;
                                }
                                if (inputField.type === 'textarea')
                                    inputField.scrollTop = st;
                            }
                            /* Alt+b for bold */
                            if (cc === 98 || kc === 66) {
                                tagWith('[b]', inputField);
                                if (window.chatHelper_suppressBrowserAltKeys)
                                    return false;
                            }
                            /* Alt+i for italics */
                            //if (cc === 105 || kc === 73) {
                            //    tagWith('[i]', inputField);
                            //    if (window.chatHelper_suppressBrowserAltKeys)
                            //        return false;
                            //}
                            /* Alt+u for underline */
                            if (cc === 117 || kc === 85) {
                                tagWith('[u]', inputField);
                                if (window.chatHelper_suppressBrowserAltKeys)
                                    return false;
                            }
                            /* Alt+s for strikethrough */
                            if (cc === 115 || kc === 83) {
                                tagWith('[s]', inputField);
                                if (window.chatHelper_suppressBrowserAltKeys)
                                    return false;
                            }
                        }
                    }
                };
           }
    }catch (err) {
        chlog("createchatHelper: "+ err,1);
        console.error(err);
        }
 
    function chatHelper_checkIfLoaded() {
        try {
            if (typeof qx !== 'undefined') {
                createchatHelper();
            } else {
                window.setTimeout(chatHelper_checkIfLoaded, 1333);
            }
        } catch (err) {
            console.log("chatHelper_checkIfLoaded: ", err);
        }
    }
    window.setTimeout(chatHelper_checkIfLoaded, 1333);
};
 try {
 var chatHelper = document.createElement("script");
chatHelper.innerHTML = "(" + chatHelper_main.toString() + ")();";
chatHelper.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(chatHelper);
} catch (err) {
    console.log("chatHelper: init error: ", err);
}
})();

/***********************************************************************************
CNCOpt Link Button
***********************************************************************************/

// ==UserScript==
// @version       1.7.6b
// @updateURL     https://userscripts.org/scripts/source/131289.meta.js
// @downloadURL   https://userscripts.org/scripts/source/131289.user.js
// @name          C&C:TA CNCOpt Link Button for SC
// @namespace     http://cncopt.com/
// @icon          http://cncopt.com/favicon.ico
// @description   Creates a "CNCOpt" button when selecting a base in Command & Conquer: Tiberium Alliances. The share button takes you to http://cncopt.com/ and fills in the selected base information so you can analyze or share the base.
// @include       http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include       http*://*.cncopt.com/*
// @include       http*://cncopt.com/*
// @grant         GM_log
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @grant         GM_xmlhttpRequest
// @grant         GM_updatingEnabled
// @grant         unsafeWindow
// @contributor   PythEch (http://http://userscripts.org/users/220246)
// @contributor   jerbri (http://userscripts.org/users/507954)
// @contributor   Der_Flake
// ==/UserScript==
/* 

2013-03-03: Special thanks to jerbri for fixing this up so it worked again!
2012-11-25: Special thanks to PythEch for fixing this up so it worked again!

*/
var scity = null;
var tcity = null;
var tbase = null;
try {
  unsafeWindow.__cncopt_version = "1.7.6";
  (function () {
    var cncopt_main = function () {

      var defense_unit_map = {
        /* GDI Defense Units */"GDI_Wall": "w",
        "GDI_Cannon": "c",
        "GDI_Antitank Barrier": "t",
        "GDI_Barbwire": "b",
        "GDI_Turret": "m",
        "GDI_Flak": "f",
        "GDI_Art Inf": "r",
        "GDI_Art Air": "e",
        "GDI_Art Tank": "a",
        "GDI_Def_APC Guardian": "g",
        "GDI_Def_Missile Squad": "q",
        "GDI_Def_Pitbull": "p",
        "GDI_Def_Predator": "d",
        "GDI_Def_Sniper": "s",
        "GDI_Def_Zone Trooper": "z",
        /* Nod Defense Units */"NOD_Def_Antitank Barrier": "t",
        "NOD_Def_Art Air": "e",
        "NOD_Def_Art Inf": "r",
        "NOD_Def_Art Tank": "a",
        "NOD_Def_Attack Bike": "p",
        "NOD_Def_Barbwire": "b",
        "NOD_Def_Black Hand": "z",
        "NOD_Def_Cannon": "c",
        "NOD_Def_Confessor": "s",
        "NOD_Def_Flak": "f",
        "NOD_Def_MG Nest": "m",
        "NOD_Def_Militant Rocket Soldiers": "q",
        "NOD_Def_Reckoner": "g",
        "NOD_Def_Scorpion Tank": "d",
        "NOD_Def_Wall": "w",

        /* Forgotten Defense Units */"FOR_Wall": "w",
        "FOR_Barbwire_VS_Inf": "b",
        "FOR_Barrier_VS_Veh": "t",
        "FOR_Inf_VS_Inf": "g",
        "FOR_Inf_VS_Veh": "r",
        "FOR_Inf_VS_Air": "q",
        "FOR_Sniper": "n",
        "FOR_Mammoth": "y",
        "FOR_Veh_VS_Inf": "o",
        "FOR_Veh_VS_Veh": "s",
        "FOR_Veh_VS_Air": "u",
        "FOR_Turret_VS_Inf": "m",
        "FOR_Turret_VS_Inf_ranged": "a",
        "FOR_Turret_VS_Veh": "v",
        "FOR_Turret_VS_Veh_ranged": "d",
        "FOR_Turret_VS_Air": "f",
        "FOR_Turret_VS_Air_ranged": "e",
        "": ""
      };

      var offense_unit_map = {
        /* GDI Offense Units */"GDI_APC Guardian": "g",
        "GDI_Commando": "c",
        "GDI_Firehawk": "f",
        "GDI_Juggernaut": "j",
        "GDI_Kodiak": "k",
        "GDI_Mammoth": "m",
        "GDI_Missile Squad": "q",
        "GDI_Orca": "o",
        "GDI_Paladin": "a",
        "GDI_Pitbull": "p",
        "GDI_Predator": "d",
        "GDI_Riflemen": "r",
        "GDI_Sniper Team": "s",
        "GDI_Zone Trooper": "z",

        /* Nod Offense Units */"NOD_Attack Bike": "b",
        "NOD_Avatar": "a",
        "NOD_Black Hand": "z",
        "NOD_Cobra": "r",
        "NOD_Commando": "c",
        "NOD_Confessor": "s",
        "NOD_Militant Rocket Soldiers": "q",
        "NOD_Militants": "m",
        "NOD_Reckoner": "k",
        "NOD_Salamander": "l",
        "NOD_Scorpion Tank": "o",
        "NOD_Specter Artilery": "p",
        "NOD_Venom": "v",
        "NOD_Vertigo": "t",
        "": ""
      };


      function findTechLayout(city) {
        for (var k in city) {
          //console.log(typeof(city[k]), "1.city[", k, "]", city[k])
          if ((typeof (city[k]) == "object") && city[k] && 0 in city[k] && 8 in city[k]) {
            if ((typeof (city[k][0]) == "object") && city[k][0] && city[k][0] && 0 in city[k][0] && 15 in city[k][0]) {
              if ((typeof (city[k][0][0]) == "object") && city[k][0][0] && "BuildingIndex" in city[k][0][0]) {
                return city[k];
              }
            }
          }
        }
        return null;
      }

      function findBuildings(city) {
        var cityBuildings = city.get_CityBuildingsData();
        for (var k in cityBuildings) {
          if (PerforceChangelist >= 376877) {
            if ((typeof (cityBuildings[k]) === "object") && cityBuildings[k] && "d" in cityBuildings[k] && "c" in cityBuildings[k] && cityBuildings[k].c > 0) {
              return cityBuildings[k].d;
            }
          } else {
            if ((typeof (cityBuildings[k]) === "object") && cityBuildings[k] && "l" in cityBuildings[k]) {
              return cityBuildings[k].l;
            }
          }
        }
      }

      function isOffenseUnit(unit) {
        return (unit.get_UnitGameData_Obj().n in offense_unit_map);
      }

      function isDefenseUnit(unit) {
        return (unit.get_UnitGameData_Obj().n in defense_unit_map);
      }

      function getUnitArrays(city) {
        var ret = [];
        for (var k in city) {
          if ((typeof (city[k]) == "object") && city[k]) {
            for (var k2 in city[k]) {
              if (PerforceChangelist >= 376877) {
                if ((typeof (city[k][k2]) == "object") && city[k][k2] && "d" in city[k][k2]) {
                  var lst = city[k][k2].d;
                  if ((typeof (lst) == "object") && lst) {
                    for (var i in lst) {
                      if (typeof (lst[i]) == "object" && lst[i] && "get_CurrentLevel" in lst[i]) {
                        ret.push(lst);
                      }
                    }
                  }
                }
              } else {
                if ((typeof (city[k][k2]) == "object") && city[k][k2] && "l" in city[k][k2]) {
                  var lst = city[k][k2].l;
                  if ((typeof (lst) == "object") && lst) {
                    for (var i in lst) {
                      if (typeof (lst[i]) == "object" && lst[i] && "get_CurrentLevel" in lst[i]) {
                        ret.push(lst);
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return ret;
      }

      function getDefenseUnits(city) {
        var arr = getUnitArrays(city);
        for (var i = 0; i < arr.length; ++i) {
          for (var j in arr[i]) {
            if (isDefenseUnit(arr[i][j])) {
              return arr[i];
            }
          }
        }
        return [];
      }

      function getOffenseUnits(city) {
        var arr = getUnitArrays(city);
        for (var i = 0; i < arr.length; ++i) {
          for (var j in arr[i]) {
            if (isOffenseUnit(arr[i][j])) {
              return arr[i];
            }
          }
        }
        return [];
      }


      function cncopt_create() {
        console.log("CNCOpt Link Button v" + window.__cncopt_version + " loaded");
        var cncopt = {
          selected_base: null,
          keymap: {
            /* GDI Buildings */"GDI_Accumulator": "a",
            "GDI_Refinery": "r",
            "GDI_Trade Center": "u",
            "GDI_Silo": "s",
            "GDI_Power Plant": "p",
            "GDI_Construction Yard": "y",
            "GDI_Airport": "d",
            "GDI_Barracks": "b",
            "GDI_Factory": "f",
            "GDI_Defense HQ": "q",
            "GDI_Defense Facility": "w",
            "GDI_Command Center": "e",
            "GDI_Support_Art": "z",
            "GDI_Support_Air": "x",
            "GDI_Support_Ion": "i",
            /* Forgotten Buildings */"FOR_Silo": "s",
            "FOR_Refinery": "r",
            "FOR_Tiberium Booster": "b",
            "FOR_Crystal Booster": "v",
            "FOR_Trade Center": "u",
            "FOR_Defense Facility": "w",
            "FOR_Construction Yard": "y",
            "FOR_Harvester_Tiberium": "h",
            "FOR_Defense HQ": "q",
            "FOR_Harvester_Crystal": "n",
            /* Nod Buildings */"NOD_Refinery": "r",
            "NOD_Power Plant": "p",
            "NOD_Harvester": "h",
            "NOD_Construction Yard": "y",
            "NOD_Airport": "d",
            "NOD_Trade Center": "u",
            "NOD_Defense HQ": "q",
            "NOD_Barracks": "b",
            "NOD_Silo": "s",
            "NOD_Factory": "f",
            "NOD_Harvester_Crystal": "n",
            "NOD_Command Post": "e",
            "NOD_Support_Art": "z",
            "NOD_Support_Ion": "i",
            "NOD_Accumulator": "a",
            "NOD_Support_Air": "x",
            "NOD_Defense Facility": "w",
            //"NOD_Tech Lab": "",
            //"NOD_Recruitment Hub": "X",
            //"NOD_Temple of Nod": "X",

            /* GDI Defense Units */"GDI_Wall": "w",
            "GDI_Cannon": "c",
            "GDI_Antitank Barrier": "t",
            "GDI_Barbwire": "b",
            "GDI_Turret": "m",
            "GDI_Flak": "f",
            "GDI_Art Inf": "r",
            "GDI_Art Air": "e",
            "GDI_Art Tank": "a",
            "GDI_Def_APC Guardian": "g",
            "GDI_Def_Missile Squad": "q",
            "GDI_Def_Pitbull": "p",
            "GDI_Def_Predator": "d",
            "GDI_Def_Sniper": "s",
            "GDI_Def_Zone Trooper": "z",
            /* Nod Defense Units */"NOD_Def_Antitank Barrier": "t",
            "NOD_Def_Art Air": "e",
            "NOD_Def_Art Inf": "r",
            "NOD_Def_Art Tank": "a",
            "NOD_Def_Attack Bike": "p",
            "NOD_Def_Barbwire": "b",
            "NOD_Def_Black Hand": "z",
            "NOD_Def_Cannon": "c",
            "NOD_Def_Confessor": "s",
            "NOD_Def_Flak": "f",
            "NOD_Def_MG Nest": "m",
            "NOD_Def_Militant Rocket Soldiers": "q",
            "NOD_Def_Reckoner": "g",
            "NOD_Def_Scorpion Tank": "d",
            "NOD_Def_Wall": "w",

            /* Forgotten Defense Units */"FOR_Wall": "w",
            "FOR_Barbwire_VS_Inf": "b",
            "FOR_Barrier_VS_Veh": "t",
            "FOR_Inf_VS_Inf": "g",
            "FOR_Inf_VS_Veh": "r",
            "FOR_Inf_VS_Air": "q",
            "FOR_Sniper": "n",
            "FOR_Mammoth": "y",
            "FOR_Veh_VS_Inf": "o",
            "FOR_Veh_VS_Veh": "s",
            "FOR_Veh_VS_Air": "u",
            "FOR_Turret_VS_Inf": "m",
            "FOR_Turret_VS_Inf_ranged": "a",
            "FOR_Turret_VS_Veh": "v",
            "FOR_Turret_VS_Veh_ranged": "d",
            "FOR_Turret_VS_Air": "f",
            "FOR_Turret_VS_Air_ranged": "e",

            /* GDI Offense Units */"GDI_APC Guardian": "g",
            "GDI_Commando": "c",
            "GDI_Firehawk": "f",
            "GDI_Juggernaut": "j",
            "GDI_Kodiak": "k",
            "GDI_Mammoth": "m",
            "GDI_Missile Squad": "q",
            "GDI_Orca": "o",
            "GDI_Paladin": "a",
            "GDI_Pitbull": "p",
            "GDI_Predator": "d",
            "GDI_Riflemen": "r",
            "GDI_Sniper Team": "s",
            "GDI_Zone Trooper": "z",

            /* Nod Offense Units */"NOD_Attack Bike": "b",
            "NOD_Avatar": "a",
            "NOD_Black Hand": "z",
            "NOD_Cobra": "r",
            "NOD_Commando": "c",
            "NOD_Confessor": "s",
            "NOD_Militant Rocket Soldiers": "q",
            "NOD_Militants": "m",
            "NOD_Reckoner": "k",
            "NOD_Salamander": "l",
            "NOD_Scorpion Tank": "o",
            "NOD_Specter Artilery": "p",
            "NOD_Venom": "v",
            "NOD_Vertigo": "t",

            "<last>": "."
          },
          make_sharelink: function () {
            try {
              var selected_base = cncopt.selected_base;
              var city_id = selected_base.get_Id();
              var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(city_id);
              var own_city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
              var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
              var server = ClientLib.Data.MainData.GetInstance().get_Server();
              var doLinkCity = (city.get_CityFaction() > 2 ? own_city.get_CityFaction() : city.get_CityFaction());
              var doCity = (city.get_CityFaction() > 2 ? own_city : city);
              tbase = selected_base;
              tcity = city;
              scity = own_city;
              //console.log("Target City: ", city);
              //console.log("Own City: ", own_city);
              var link = "http://cncopt.com/?map=";
              link += "3|"; /* link version */
              switch (city.get_CityFaction()) {
                case 1:
                  /* GDI */
                  link += "G|";
                  break;
                case 2:
                  /* NOD */
                  link += "N|";
                  break;
                case 3:
                  /* FOR faction - unseen, but in GAMEDATA */
                case 4:
                  /* Forgotten Bases */
                case 5:
                  /* Forgotten Camps */
                case 6:
                  /* Forgotten Outposts */
                  link += "F|";
                  break;
                default:
                  console.log("cncopt: Unknown faction: " + city.get_CityFaction());
                  link += "E|";
                  break;
              }
              //switch (own_city.get_CityFaction()) {
              switch (doLinkCity) {
                case 1:
                  /* GDI */
                  link += "G|";
                  break;
                case 2:
                  /* NOD */
                  link += "N|";
                  break;
                case 3:
                  /* FOR faction - unseen, but in GAMEDATA */
                case 4:
                  /* Forgotten Bases */
                case 5:
                  /* Forgotten Camps */
                case 6:
                  /* Forgotten Outposts */
                  link += "F|";
                  break;
                default:
                  console.log("cncopt: Unknown faction: " + own_city.get_CityFaction());
                  link += "E|";
                  break;
              }
              link += city.get_Name() + "|";
              defense_units = []
              for (var i = 0; i < 20; ++i) {
                var col = [];
                for (var j = 0; j < 9; ++j) {
                  col.push(null);
                }
                defense_units.push(col)
              }
              var defense_unit_list = getDefenseUnits(city);
              if (PerforceChangelist >= 376877) {
                for (var i in defense_unit_list) {
                  var unit = defense_unit_list[i];
                  defense_units[unit.get_CoordX()][unit.get_CoordY() + 8] = unit;
                }
              } else {
                for (var i = 0; i < defense_unit_list.length; ++i) {
                  var unit = defense_unit_list[i];
                  defense_units[unit.get_CoordX()][unit.get_CoordY() + 8] = unit;
                }
              }

              offense_units = []
              for (var i = 0; i < 20; ++i) {
                var col = [];
                for (var j = 0; j < 9; ++j) {
                  col.push(null);
                }
                offense_units.push(col)
              }

              //var offense_unit_list = getOffenseUnits(own_city);
              var offense_unit_list = getOffenseUnits(doCity);
              if (PerforceChangelist >= 376877) {
                for (var i in offense_unit_list) {
                  var unit = offense_unit_list[i];
                  offense_units[unit.get_CoordX()][unit.get_CoordY() + 16] = unit;
                }
              } else {
                for (var i = 0; i < offense_unit_list.length; ++i) {
                  var unit = offense_unit_list[i];
                  offense_units[unit.get_CoordX()][unit.get_CoordY() + 16] = unit;
                }
              }

              var techLayout = findTechLayout(city);
              var buildings = findBuildings(city);
              for (var i = 0; i < 20; ++i) {
                row = [];
                for (var j = 0; j < 9; ++j) {
                  var spot = i > 16 ? null : techLayout[j][i];
                  var level = 0;
                  var building = null;
                  if (spot && spot.BuildingIndex >= 0) {
                    building = buildings[spot.BuildingIndex];
                    level = building.get_CurrentLevel();
                  }
                  var defense_unit = defense_units[j][i];
                  if (defense_unit) {
                    level = defense_unit.get_CurrentLevel();
                  }
                  var offense_unit = offense_units[j][i];
                  if (offense_unit) {
                    level = offense_unit.get_CurrentLevel();
                  }
                  if (level > 1) {
                    link += level;
                  }

                  switch (i > 16 ? 0 : city.GetResourceType(j, i)) {
                    case 0:
                      if (building) {
                        var techId = building.get_MdbBuildingId();
                        if (GAMEDATA.Tech[techId].n in cncopt.keymap) {
                          link += cncopt.keymap[GAMEDATA.Tech[techId].n];
                        } else {
                          console.log("cncopt [5]: Unhandled building: " + techId, building);
                          link += ".";
                        }
                      } else if (defense_unit) {
                        if (defense_unit.get_UnitGameData_Obj().n in cncopt.keymap) {
                          link += cncopt.keymap[defense_unit.get_UnitGameData_Obj().n];
                        } else {
                          console.log("cncopt [5]: Unhandled unit: " + defense_unit.get_UnitGameData_Obj().n);
                          link += ".";
                        }
                      } else if (offense_unit) {
                        if (offense_unit.get_UnitGameData_Obj().n in cncopt.keymap) {
                          link += cncopt.keymap[offense_unit.get_UnitGameData_Obj().n];
                        } else {
                          console.log("cncopt [5]: Unhandled unit: " + offense_unit.get_UnitGameData_Obj().n);
                          link += ".";
                        }
                      } else {
                        link += ".";
                      }
                      break;
                    case 1:
                      /* Crystal */
                      if (spot.BuildingIndex < 0) link += "c";
                      else link += "n";
                      break;
                    case 2:
                      /* Tiberium */
                      if (spot.BuildingIndex < 0) link += "t";
                      else link += "h";
                      break;
                    case 4:
                      /* Woods */
                      link += "j";
                      break;
                    case 5:
                      /* Scrub */
                      link += "h";
                      break;
                    case 6:
                      /* Oil */
                      link += "l";
                      break;
                    case 7:
                      /* Swamp */
                      link += "k";
                      break;
                    default:
                      console.log("cncopt [4]: Unhandled resource type: " + city.GetResourceType(j, i));
                      link += ".";
                      break;
                  }
                }
              }
              /* Tack on our alliance bonuses */
              if (alliance && scity.get_AllianceId() == tcity.get_AllianceId()) {
                link += "|" + alliance.get_POITiberiumBonus();
                link += "|" + alliance.get_POICrystalBonus();
                link += "|" + alliance.get_POIPowerBonus();
                link += "|" + alliance.get_POIInfantryBonus();
                link += "|" + alliance.get_POIVehicleBonus();
                link += "|" + alliance.get_POIAirBonus();
                link += "|" + alliance.get_POIDefenseBonus();
              }
              if (server.get_TechLevelUpgradeFactorBonusAmount() != 1.20) {
                  link += "|newEconomy";
              }

              //console.log(link);
              window.open(link, "_blank");
            } catch (e) {
              console.log("cncopt [1]: ", e);
            }
          }
        };
        if (!webfrontend.gui.region.RegionCityMenu.prototype.__cncopt_real_showMenu) {
          webfrontend.gui.region.RegionCityMenu.prototype.__cncopt_real_showMenu = webfrontend.gui.region.RegionCityMenu.prototype.showMenu;
        }

        var check_ct = 0;
        var check_timer = null;
        var button_enabled = 123456;
        /* Wrap showMenu so we can inject our Sharelink at the end of menus and
         * sync Base object to our cncopt.selected_base variable  */
        webfrontend.gui.region.RegionCityMenu.prototype.showMenu = function (selected_base) {
          try {
            var self = this;
            //console.log(selected_base);
            cncopt.selected_base = selected_base;
            if (this.__cncopt_initialized != 1) {
              this.__cncopt_initialized = 1;
              this.__cncopt_links = [];
              for (var i in this) {
                try {
                  if (this[i] && this[i].basename == "Composite") {
                    var link = new qx.ui.form.Button("CNCOpt", "http://cncopt.com/favicon.ico");
                    link.addListener("execute", function () {
                      var bt = qx.core.Init.getApplication();
                      bt.getBackgroundArea().closeCityInfo();
                      cncopt.make_sharelink();
                    });
                    this[i].add(link);
                    this.__cncopt_links.push(link)
                  }
                } catch (e) {
                  console.log("cncopt [2]: ", e);
                }
              }
            }
            var tf = false;
            switch (selected_base.get_VisObjectType()) {
              case ClientLib.Vis.VisObject.EObjectType.RegionCityType:
                switch (selected_base.get_Type()) {
                  case ClientLib.Vis.Region.RegionCity.ERegionCityType.Own:
                    tf = true;
                    break;
                  case ClientLib.Vis.Region.RegionCity.ERegionCityType.Alliance:
                  case ClientLib.Vis.Region.RegionCity.ERegionCityType.Enemy:
                    tf = true;
                    break;
                }
                break;
              case ClientLib.Vis.VisObject.EObjectType.RegionGhostCity:
                tf = false;
                console.log("cncopt: Ghost City selected.. ignoring because we don't know what to do here");
                break;
              case ClientLib.Vis.VisObject.EObjectType.RegionNPCBase:
                tf = true;
                break;
              case ClientLib.Vis.VisObject.EObjectType.RegionNPCCamp:
                tf = true;
                break;
            }

            var orig_tf = tf;

            function check_if_button_should_be_enabled() {
              try {
                tf = orig_tf;
                var selected_base = cncopt.selected_base;
                var still_loading = false;
                if (check_timer != null) {
                  clearTimeout(check_timer);
                }

                /* When a city is selected, the data for the city is loaded in the background.. once the 
                 * data arrives, this method is called again with these fields set, but until it does
                 * we can't actually generate the link.. so this section of the code grays out the button
                 * until the data is ready, then it'll light up. */
                if (selected_base && selected_base.get_Id) {
                  var city_id = selected_base.get_Id();
                  var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(city_id);
                  //if (!city || !city.m_CityUnits || !city.m_CityUnits.m_DefenseUnits) {
                  //console.log("City", city);
                  //console.log("get_OwnerId", city.get_OwnerId());
                  if (!city || city.get_OwnerId() == 0) {
                    still_loading = true;
                    tf = false;
                  }
                } else {
                  tf = false;
                }
                if (tf != button_enabled) {
                  button_enabled = tf;
                  for (var i = 0; i < self.__cncopt_links.length; ++i) {
                    self.__cncopt_links[i].setEnabled(tf);
                  }
                }
                if (!still_loading) {
                  check_ct = 0;
                } else {
                  if (check_ct > 0) {
                    check_ct--;
                    check_timer = setTimeout(check_if_button_should_be_enabled, 100);
                  } else {
                    check_timer = null;
                  }
                }
              } catch (e) {
                console.log("cncopt [3]: ", e);
                tf = false;
              }
            }

            check_ct = 50;
            check_if_button_should_be_enabled();
          } catch (e) {
            console.log("cncopt [3]: ", e);
          }
          this.__cncopt_real_showMenu(selected_base);
        }
      }


      /* Nice load check (ripped from AmpliDude's LoU Tweak script) */
      function cnc_check_if_loaded() {
        try {
          if (typeof qx != 'undefined') {
            a = qx.core.Init.getApplication(); // application
            if (a) {
              cncopt_create();
            } else {
              window.setTimeout(cnc_check_if_loaded, 1000);
            }
          } else {
            window.setTimeout(cnc_check_if_loaded, 1000);
          }
        } catch (e) {
          if (typeof console != 'undefined') console.log(e);
          else if (window.opera) opera.postError(e);
          else GM_log(e);
        }
      }
      if (/commandandconquer\.com/i.test(document.domain)) window.setTimeout(cnc_check_if_loaded, 1000);
    }

    // injecting because we can't seem to hook into the game interface via unsafeWindow 
    //   (Ripped from AmpliDude's LoU Tweak script)
    var script_block = document.createElement("script");
    txt = cncopt_main.toString();
    script_block.innerHTML = "(" + txt + ")();";
    script_block.type = "text/javascript";
    if (/commandandconquer\.com/i.test(document.domain)) document.getElementsByTagName("head")[0].appendChild(script_block);
  })();
} catch (e) {
  GM_log(e);
}

/***********************************************************************************
Coords Button - All ***** Version 2.0.1
***********************************************************************************/
// ==UserScript==
// @include https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// ==UserScript==
(function () {
  var CNCTACoordsButtonAll_main = function () {
    try {
      function createCoordsButton() {
        console.log('C&C:Tiberium Alliances Coords Button All loaded.');
 
        /*
        $a = qx.core.Init.getApplication(); // Application
        $c = $a.getChat(); // ChatWindow
        $w = $c.getChatWidget(); // ChatWidget
        $i = $cw.getEditable(); // Input
        $d = $i.getContentElement().getDomElement(); // Input DOM Element
        */
 
        var coordsButton = {
          selectedBase: null,
          pasteCoords: function(){
            var $i = qx.core.Init.getApplication().getChat().getChatWidget().getEditable(); // Input
            var $d = $i.getContentElement().getDomElement(); // Input DOM Element
 
            var result = new Array();
            result.push($d.value.substring(0,$d.selectionStart)); // start
 
            result.push('[coords]' + coordsButton.selectedBase.get_RawX() + ':' + coordsButton.selectedBase.get_RawY() + '[/coords]');
 
            result.push($d.value.substring($d.selectionEnd, $d.value.length)); // end
 
            $i.setValue(result.join(' '));
          }
        };
 
        if (!webfrontend.gui.region.RegionCityMenu.prototype.__coordsButton_showMenu) {
          webfrontend.gui.region.RegionCityMenu.prototype.__coordsButton_showMenu = webfrontend.gui.region.RegionCityMenu.prototype.showMenu;
       
          webfrontend.gui.region.RegionCityMenu.prototype.showMenu = function (selectedVisObject) {
            coordsButton.selectedBase = selectedVisObject;
            if (this.__coordsButton_initialized != 1) {
              this.__coordsButton_initialized = 1;
              this.__newComposite = new qx.ui.container.Composite(new qx.ui.layout.VBox(0)).set({
                padding: 2
              });
              for(i in this) {
                if(this[i] && this[i].basename == "Composite") {
                  var button = new qx.ui.form.Button("Paste Coords");
                  button.addListener("execute", function () {
                    coordsButton.pasteCoords();
                  });            
                  this[i].add(button);
                }
              }
            }
            this.__coordsButton_showMenu(selectedVisObject);
            switch (selectedVisObject.get_VisObjectType()) {
              case ClientLib.Vis.VisObject.EObjectType.RegionPointOfInterest:
              case ClientLib.Vis.VisObject.EObjectType.RegionRuin:
              case ClientLib.Vis.VisObject.EObjectType.RegionHubControl:
              case ClientLib.Vis.VisObject.EObjectType.RegionHubServer:
                this.add(this.__newComposite);
                break;
            }
          }
        }
      }    
    } catch (e) {
      console.log("createCoordsButton: ", e);
    }
 
    function CNCTACoordsButtonAll_checkIfLoaded() {
      try {
        if (typeof qx !== 'undefined') {
          createCoordsButton();
        } else {
          window.setTimeout(CNCTACoordsButtonAll_checkIfLoaded, 1000);
        }
      } catch (e) {
        console.log("CNCTACoordsButtonAll_checkIfLoaded: ", e);
      }
    }
  window.setTimeout(CNCTACoordsButtonAll_checkIfLoaded, 1000);
  };
  try {
    var CNCTACoordsButtonAll = document.createElement("script");
    CNCTACoordsButtonAll.innerHTML = "(" + CNCTACoordsButtonAll_main.toString() + ")();";
    CNCTACoordsButtonAll.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(CNCTACoordsButtonAll);
  } catch (e) {
    console.log("CNCTACoordsButtonAll: init error: ", e);
  }
})();

// ==UserScript==
// @name        MaelstromTools Dev
// @namespace   MaelstromTools
// @description Just a set of statistics & summaries about repair time and base resources. Mainly for internal use, but you are free to test and comment it.
// @version     0.1.4.0
// @author      Gryphon, Maelstrom, HuffyLuf, KRS_L and Krisan
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// ==/UserScript==
/*
var offense_units = own_city.get_CityArmyFormationsManager().GetFormationByTargetBaseId(current_city.get_Id()).get_ArmyUnits().l;
System.Int64 GetForumIdByType (ClientLib.Data.Forum.EForumType eForumType)
static ClientLib.Data.Forum.EForumType NormalForum
System.Collections.Generic.List$1 get_ForumsAlliance ()
System.Void CreateThread (System.Int64 forumId ,System.String threadTitle ,System.String threadPost ,System.Boolean autoSubscribe)
System.Void CreatePost (System.Int64 forumId ,System.Int64 threadId ,System.String postMessage)
System.Void StartGetForumThreadData (System.Int64 forumId ,System.Int32 skip ,System.Int32 take)
System.Void OnForumThreadDataReceived (System.Object context ,System.Object result)
System.Void add_ThreadsFetched (ClientLib.Data.ForumThreadsFetched value)
System.Void MarkThreadsAsRead (System.Int64 forumId ,System.Int64[] threadIds)

var score = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(lvl);
var scoreNext = ClientLib.Base.PointOfInterestTypes.GetNextScore(score);
var resBonus = ClientLib.Base.PointOfInterestTypes.GetBonusByType(ClientLib.Base.EPOIType.TiberiumBonus, score);
var unitBonus = ClientLib.Base.PointOfInterestTypes.GetBonusByType(ClientLib.Base.EPOIType.InfanteryBonus, score);
console.log("POI lvl" + lvl + "gives " + score + "points, next lvl at " + scoreNext + " points. Resource bonus: " + resBonus + " Unit bonus: " + unitBonus + "%");

ClientLib.Data.Player
get_ResearchPoints
GetCreditsCount
GetCreditsGrowth
ClientLib.Data.PlayerResearch get_PlayerResearch ()
ClientLib.Data.PlayerResearchItem GetResearchItemFomMdbId (System.Int32 _mdbId)
ClientLib.Data.PlayerResearchItem.System.Object get_NextLevelInfo_Obj ()

var cw=ClientLib.Data.MainData.GetInstance().get_Player().get_Faction();
var cj=ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(ClientLib.Base.ETechName.Research_BaseFound,cw);
var cd=cr.GetResearchItemFomMdbId(cj);
 */
(function () {
  var MaelstromTools_main = function () {
    try {
      function CCTAWrapperIsInstalled() {
        return (typeof (CCTAWrapper_IsInstalled) != 'undefined' && CCTAWrapper_IsInstalled);
      }

      function createMaelstromTools() {
        console.log('MaelstromTools loaded');

        qx.Class.define("MaelstromTools.Language", {
          type: "singleton",
          extend: qx.core.Object,
          construct: function (language) {
            this.Languages = ['de', 'pt', 'fr', 'tr']; // en is default, not needed in here!
            if (language != null) {
              this.MyLanguage = language;
            }
          },
          members: {
            MyLanguage: "en",
            Languages: null,
            Data: null,

            loadData: function (language) {
              var l = this.Languages.indexOf(language);

              if (l < 0) {
                this.Data = null;
                return;
              }

              this.Data = new Object();
              this.Data["Collect all packages"] = ["Alle Pakete einsammeln", "Recolher todos os pacotes", "Récupérez tous les paquets", "Tüm paketleri topla"][l];
              this.Data["Overall production"] = ["Produktionsübersicht", "Produção global", "La production globale", "Genel üretim"][l];
              this.Data["Army overview"] = ["Truppenübersicht", "Vista Geral de Exército", "Armée aperçu", "Ordu önizlemesi"][l];
              this.Data["Base resources"] = ["Basis Ressourcen", "Recursos base", "ressources de base", "Üs önizlemesi"][l];
              this.Data["Main menu"] = ["Hauptmenü", "Menu Principal", "menu principal", "Ana menü"][l];
              this.Data["Repair all units"] = ["Alle Einheiten reparieren", "Reparar todas as unidades", "Réparer toutes les unités", "Tüm üniteleri onar"][l];
              this.Data["Repair all defense buildings"] = ["Alle Verteidigungsgebäude reparieren", "Reparar todos os edifícios de defesa", "Réparer tous les bâtiments de défense", "Tüm savunma binalarını onar"][l];
              this.Data["Repair all buildings"] = ["Alle Gebäurde reparieren", "Reparar todos os edifícios", "Réparer tous les bâtiments", "Tüm binaları onar"][l];
              this.Data["Base status overview"] = ["Basisübersicht", "Estado geral da base", "aperçu de l'état de base", "Üs durumu önizlemesi"][l];
              this.Data["Upgrade priority overview"] = ["Upgrade Übersicht", "Prioridade de upgrades", "aperçu des priorités de mise à niveau", "Yükseltme önceliği önizlemesi"][l];
              this.Data["MaelstromTools Preferences"] = ["MaelstromTools Einstellungen", "Preferências de MaelstromTools", "Préférences MaelstromTools", "MaelstromTools Ayarları"][l];
              this.Data["Options"] = ["Einstellungen", "Opções", "Options", "Seçenekler"][l];
              this.Data["Target out of range, no resource calculation possible"] = ["Ziel nicht in Reichweite, kann die plünderbaren Ressourcen nicht berechnen", "Alvo fora do alcance, não é possivel calcular os recursos", "Cible hors de portée, pas de calcul de ressources possible", "Hedef menzil dışında, kaynak hesaplaması olanaksız"][l];
              this.Data["Lootable resources"] = ["Plünderbare Ressourcen", "Recursos roubáveis", "Ressources à piller", "Yağmalanabilir kaynaklar"][l];
              this.Data["per CP"] = ["pro KP", "por PC", "par PC", "KP başına"][l];
              this.Data["2nd run"] = ["2. Angriff", "2º ataque", "2° attaque", "2. saldırı"][l];
              this.Data["3rd run"] = ["3. Angriff", "3º ataque", "3° attaque", "3. saldırı"][l];
              this.Data["Calculating resources..."] = ["Berechne plünderbare Ressourcen...", "A calcular recursos...", "calcul de ressources ...", "Kaynaklar hesaplanıyor..."][l];
              this.Data["Next MCV"] = ["MBF", "MCV", "VCM"][l];
              this.Data["Show time to next MCV"] = ["Zeige Zeit bis zum nächsten MBF", "Mostrar tempo restante até ao próximo MCV", "Afficher l'heure pour le prochain VCM ", "Sırdaki MCV için gereken süreyi göster"][l];
              this.Data["Show lootable resources (restart required)"] = ["Zeige plünderbare Ressourcen (Neustart nötig)", "Mostrar recursos roubáveis (é necessário reiniciar)", "Afficher les ressources fouiller (redémarrage nécessaire)", "Yağmalanabilir kaynakları göster (yeniden başlatma gerekli)"][l];
              this.Data["Use dedicated Main Menu (restart required)"] = ["Verwende extra Hauptmenü (Neustart nötig)", "Usar botão para o Menu Principal (é necessário reiniciar)", "Utiliser dédiée du menu principal (redémarrage nécessaire)", "Ana menü tuşunu kullan (yeniden başlatma gerekli)"][l];
              this.Data["Autocollect packages"] = ["Sammle Pakete automatisch", "Auto recolher pacotes", "paquets autocollecté", "Paketleri otomatik topla"][l];
              this.Data["Autorepair units"] = ["Repariere Einheiten automatisch", "Auto reparar o exército", "unités autoréparé", "Üniteleri otomatik onar"][l];
              this.Data["Autorepair defense (higher prio than buildings)"] = ["Repariere Verteidigung automatisch (höhere Prio als Gebäude)", "Auto reparar defesa (maior prioridade do que os edifícios)", "réparation automatique la défense (priorité plus élevé que les bâtiments) ", "Savunmayı otomatik onar (binalardan daha yüksek öncelikli olarak)"][l];
              this.Data["Autorepair buildings"] = ["Repariere Gebäude automatisch", "Auto reparar edifícios", "bâtiments autoréparé", "Binaları otomatik onar"][l];
              this.Data["Automatic interval in minutes"] = ["Auto-Intervall in Minuten", "Intervalo de tempo automático (em minutos)", "intervalle automatique en quelques minutes", "Otomatik toplama aralığı (dk)"][l];
              this.Data["Apply changes"] = ["Speichern", "Confirmar", "Appliquer changements", "Uygula"][l];
              this.Data["Discard changes"] = ["Abbrechen", "Cancelar", "Annuler changements", "İptal"][l];
              this.Data["Reset to default"] = ["Auf Standard zurücksetzen", "Definições padrão", "Réinitialiser", "Sıfırla"][l];
              this.Data["Continuous"] = ["Kontinuierlich", "Contínua", "continue", "Sürekli"][l];
              this.Data["Bonus"] = ["Pakete", "Bónus", "Bonus", "Bonus"][l];
              this.Data["POI"] = ["POI", "POI", "POI", "POI"][l];
              this.Data["Total / h"] = ["Gesamt / h", "Total / h", "Total / h", "Toplam / sa."][l];
              this.Data["Repaircharges"] = ["Reparaturzeiten", "Custo de reparação", "frais de réparation", "Onarım maliyeti"][l];
              this.Data["Repairtime"] = ["Max. verfügbar", "Tempo de reparação", "Temps de réparation", "Onarım süresi"][l];
              this.Data["Attacks"] = ["Angriffe", "Ataques", "Attaques", "Saldırılar"][l];
              this.Data[MaelstromTools.Statics.Infantry] = ["Infanterie", "Infantaria", "Infanterie", "Piyade"][l];
              this.Data[MaelstromTools.Statics.Vehicle] = ["Fahrzeuge", "Veículos", "Vehicule", "Motorlu B."][l];
              this.Data[MaelstromTools.Statics.Aircraft] = ["Flugzeuge", "Aeronaves", "Aviation", "Hava A."][l];
              this.Data[MaelstromTools.Statics.Tiberium] = ["Tiberium", "Tibério", "Tiberium", "Tiberium"][l];
              this.Data[MaelstromTools.Statics.Crystal] = ["Kristalle", "Cristal", "Cristal", "Kristal"][l];
              this.Data[MaelstromTools.Statics.Power] = ["Strom", "Potência", "Energie", "Güç"][l];
              this.Data[MaelstromTools.Statics.Dollar] = ["Credits", "Créditos", "Crédit", "Kredi"][l];
              this.Data[MaelstromTools.Statics.Research] = ["Forschung", "Investigação", "Recherche", "Araştırma"][l];
              this.Data["Base"] = ["Basis", "Base", "Base", "Üs"][l];
              this.Data["Defense"] = ["Verteidigung", "Defesa", "Défense", "Savunma"][l];
              this.Data["Army"] = ["Armee", "Exército", "Armée", "Ordu"][l];
              this.Data["Level"] = ["Stufe", "Nível", "Niveau", "Seviye"][l];
              this.Data["Buildings"] = ["Gebäude", "Edifícios", "Bâtiments", "Binalar"][l];
              this.Data["Health"] = ["Leben", "Vida", "Santé", "Sağlık"][l];
              this.Data["Units"] = ["Einheiten", "Unidades", "Unités", "Üniteler"][l];
              this.Data["Hide Mission Tracker"] = ["Missionsfenster ausblenden", "Esconder janela das Missões", "Cacher la fenêtre de mission", "Görev İzleyicisini Gizle"][l];
              this.Data["none"] = ["keine", "nenhum", "aucun", "hiçbiri"][l];
              this.Data["Cooldown"] = ["Cooldown", "Relocalização", "Recharge", "Cooldown"][l];
              this.Data["Protection"] = ["Geschützt bis", "Protecção", "Protection", "Koruma"][l];
              this.Data["Available weapon"] = ["Verfügbare Artillerie", "Apoio disponível", "arme disponible", "Mevcut silah"][l];
              this.Data["Calibrated on"] = ["Kalibriert auf", "Calibrado em", "Calibré sur ", "Kalibreli"][l];
              this.Data["Total resources"] = ["Gesamt", "Total de recursos", "Ressources totales", "Toplam kaynaklar"][l];
              this.Data["Max. storage"] = ["Max. Kapazität", "Armazenamento Máx.", "Max. de stockage", "Maks. Depo"][l];
              this.Data["Storage full!"] = ["Lager voll!", "Armazenamento cheio!", "Stockage plein", "Depo dolu!"][l];
              this.Data["Storage"] = ["Lagerstand", "Armazenamento", "Stockage", "Depo"][l];
              this.Data["display only top buildings"] = ["Nur Top-Gebäude anzeigen", "Mostrar apenas melhores edifícios", "afficher uniquement les bâtiments principaux", "yalnızca en iyi binaları göster"][l];
              this.Data["display only affordable buildings"] = ["Nur einsetzbare Gebäude anzeigen", "Mostrar apenas edíficios acessíveis", "afficher uniquement les bâtiments abordables", "yalnızca satın alınabilir binaları göster"][l];
              this.Data["City"] = ["Stadt", "Base", "Base", "Şehir"][l];
              this.Data["Type (coord)"] = ["Typ (Koord.)", "Escrever (coord)", "Type (coord)", "Tip (koord.)"][l];
              this.Data["to Level"] = ["Auf Stufe", "para nível", "à Niveau ", "Seviye için"][l];
              this.Data["Gain/h"] = ["Zuwachs/h", "Melhoria/h", "Gain / h", "Kazanç / sa."][l];
              this.Data["Factor"] = ["Faktor", "Factor", "Facteur", "Faktör"][l];
              this.Data["Tib/gain"] = ["Tib./Zuwachs", "Tib/melhoria", "Tib / gain", "Tib/Kazanç"][l];
              this.Data["Pow/gain"] = ["Strom/Zuwachs", "Potencia/melhoria", "Puissance / Gain", "Güç/Kazanç"][l];
              this.Data["ETA"] = ["Verfügbar in", "Tempo restante", "Temps restant", "Kalan Zaman"][l];
              this.Data["Upgrade"] = ["Aufrüsten", "Upgrade", "Upgrade", "Yükselt"][l];
              this.Data["Powerplant"] = ["Kratfwerk", "Central de Energia", "Centrale", "Güç Santrali"][l];
              this.Data["Refinery"] = ["Raffinerie", "Refinaria", "Raffinerie", "Rafineri"][l];
              this.Data["Harvester"] = ["Sammler", "Harvester", "Collecteur", "Biçerdöver"][l];
              this.Data["Silo"] = ["Silo", "Silo", "Silo", "Silo"][l];
              this.Data["Accumulator"] = ["Akkumulator", "Acumulador", "Accumulateur", "Akümülatör"][l];
              this.Data["Calibrate support"] = ["Artillerie kalibrieren", "Calibrar apoio", "Calibrer soutien", "Takviyeyi kalibre et"][l];
              this.Data["Access"] = ["Öffne", "Aceder", "Accès ", "Aç"][l];
              this.Data["Focus on"] = ["Zentriere auf", "Concentrar em", "Centré sur", "Odaklan"][l];
              this.Data["Possible attacks from this base (available CP)"] = ["Mögliche Angriffe (verfügbare KP)", "Possible attacks from this base (available CP)","Possible attacks from this base (available CP)", "Bu üsten yapılması mümkün olan saldırılar (mevcut KP)"][l];
              //this.Data[""] = [""][l];
            },
            get: function (ident) {
              return this.gt(ident);
            },
            gt: function (ident) {
              if (!this.Data || !this.Data[ident]) {
                /*if(!parseInt(ident.substr(0, 1), 10) && ident != "0") {
                  console.log("missing language data: " + ident);
                }*/
                return ident;
              }
              return this.Data[ident];
            }
          }
        }),

        // define Base
        qx.Class.define("MaelstromTools.Base", {
          type: "singleton",
          extend: qx.core.Object,
          members: {
            /* Desktop */
            timerInterval: 1500,
            mainTimerInterval: 5000,
            lootStatusInfoInterval: null,
            images: null,
            mWindows: null,
            mainMenuWindow: null,

            itemsOnDesktop: null,
            itemsOnDesktopCount: null,
            itemsInMainMenu: null,
            itemsInMainMenuCount: null,
            buttonCollectAllResources: null,
            buttonRepairAllUnits: null,
            buttonRepairAllBuildings: null,

            lootWidget: null,

            initialize: function () {
              try {
                //console.log(qx.locale.Manager.getInstance().getLocale());
                Lang.loadData(qx.locale.Manager.getInstance().getLocale());
                //console.log("Client version: " + MaelstromTools.Wrapper.GetClientVersion());
                this.itemsOnDesktopCount = new Array();
                this.itemsOnDesktop = new Object();
                this.itemsInMainMenuCount = new Array();
                this.itemsInMainMenu = new Object();

                var fileManager = ClientLib.File.FileManager.GetInstance();
                //ui/icons/icon_mainui_defense_button
                //ui/icons/icon_mainui_base_button
                //ui/icons/icon_army_points
                //icon_def_army_points
                var factionText = ClientLib.Base.Util.GetFactionGuiPatchText();
                this.createNewImage(MaelstromTools.Statics.Tiberium, "ui/common/icn_res_tiberium.png", fileManager);
                this.createNewImage(MaelstromTools.Statics.Crystal, "ui/common/icn_res_chrystal.png", fileManager);
                this.createNewImage(MaelstromTools.Statics.Power, "ui/common/icn_res_power.png", fileManager);
                this.createNewImage(MaelstromTools.Statics.Dollar, "ui/common/icn_res_dollar.png", fileManager);
                this.createNewImage(MaelstromTools.Statics.Research, "ui/common/icn_res_research.png", fileManager);
                this.createNewImage("Sum", "ui/common/icn_build_slots.png", fileManager);
                this.createNewImage("AccessBase", "ui/" + factionText + "/icons/icon_mainui_enterbase.png", fileManager);
                this.createNewImage("FocusBase", "ui/" + factionText + "/icons/icon_mainui_focusbase.png", fileManager);
                this.createNewImage("Packages", "ui/" + factionText + "/icons/icon_collect_packages.png", fileManager);
                this.createNewImage("RepairAllUnits", "ui/" + factionText + "/icons/icon_army_points.png", fileManager);
                this.createNewImage("RepairAllBuildings", "ui/" + factionText + "/icons/icn_build_slots.png", fileManager);
                this.createNewImage("ResourceOverviewMenu", "ui/common/icn_res_chrystal.png", fileManager);
                this.createNewImage("ProductionMenu", "ui/" + factionText + "/icons/icn_build_slots.png", fileManager);
                this.createNewImage("RepairTimeMenu", "ui/" + factionText + "/icons/icon_repair_all_button.png", fileManager);
                this.createNewImage("Crosshair", "ui/icons/icon_support_tnk_white.png", fileManager);
                this.createNewImage("UpgradeBuilding", "ui/" + factionText + "/icons/icon_building_detail_upgrade.png", fileManager);

                this.createNewWindow("MainMenu", "R", 125, 140, 120, 100, "B");
                this.createNewWindow("Production", "L", 120, 60, 340, 140);
                this.createNewWindow("RepairTime", "L", 120, 60, 340, 140);
                this.createNewWindow("ResourceOverview", "L", 120, 60, 340, 140);
                this.createNewWindow("BaseStatusOverview", "L", 120, 60, 340, 140);
                this.createNewWindow("Preferences", "L", 120, 60, 440, 140);
                this.createNewWindow("UpgradePriority", "L", 120, 60, 870, 400);

                if (!this.mainMenuWindow) {
                  this.mainMenuWindow = new qx.ui.popup.Popup(new qx.ui.layout.Canvas()).set({
                    //backgroundColor: "#303030",
                    padding: 5,
                    paddingRight: 0
                  });
                  if (MT_Preferences.Settings.useDedicatedMainMenu) {
                    this.mainMenuWindow.setPlaceMethod("mouse");
                    this.mainMenuWindow.setPosition("top-left");
                  } else {
                    this.mainMenuWindow.setPlaceMethod("widget");
                    this.mainMenuWindow.setPosition("bottom-right");
                    this.mainMenuWindow.setAutoHide(false);
                    this.mainMenuWindow.setBackgroundColor("transparent");
                    this.mainMenuWindow.setShadow(null);
                    this.mainMenuWindow.setDecorator(new qx.ui.decoration.Background());
                  }
                }

                var desktopPositionModifier = 0;

                this.buttonCollectAllResources = this.createDesktopButton(Lang.gt("Collect all packages"), "Packages", true, this.desktopPosition(desktopPositionModifier));
                this.buttonCollectAllResources.addListener("execute", this.collectAllPackages, this);

                var openProductionWindowButton = this.createDesktopButton(Lang.gt("Overall production"), "ProductionMenu", false, this.desktopPosition(desktopPositionModifier));
                openProductionWindowButton.addListener("execute", function () {
                  window.MaelstromTools.Production.getInstance().openWindow("Production", Lang.gt("Overall production"));
                }, this);

                var openResourceOverviewWindowButton = this.createDesktopButton(Lang.gt("Base resources"), "ResourceOverviewMenu", false, this.desktopPosition(desktopPositionModifier));
                openResourceOverviewWindowButton.addListener("execute", function () {
                  window.MaelstromTools.ResourceOverview.getInstance().openWindow("ResourceOverview", Lang.gt("Base resources"));
                }, this);

                desktopPositionModifier++;
                var openMainMenuButton = this.createDesktopButton(Lang.gt("Main menu"), "ProductionMenu", false, this.desktopPosition(desktopPositionModifier));
                openMainMenuButton.addListener("click", function (e) {
                  this.mainMenuWindow.placeToMouse(e);
                  this.mainMenuWindow.show();
                }, this);

                this.buttonRepairAllUnits = this.createDesktopButton(Lang.gt("Repair all units"), "RepairAllUnits", true, this.desktopPosition(desktopPositionModifier));
                this.buttonRepairAllUnits.addListener("execute", this.repairAllUnits, this);

                this.buttonRepairAllBuildings = this.createDesktopButton(Lang.gt("Repair all buildings"), "RepairAllBuildings", true, this.desktopPosition(desktopPositionModifier));
                this.buttonRepairAllBuildings.addListener("execute", this.repairAllBuildings, this);

                var openRepairTimeWindowButton = this.createDesktopButton(Lang.gt("Army overview"), "RepairTimeMenu", false, this.desktopPosition(desktopPositionModifier));
                openRepairTimeWindowButton.addListener("execute", function () {
                  window.MaelstromTools.RepairTime.getInstance().openWindow("RepairTime", Lang.gt("Army overview"));
                }, this);

                var openBaseStatusOverview = this.createDesktopButton(Lang.gt("Base status overview"), "Crosshair", false, this.desktopPosition(desktopPositionModifier));
                openBaseStatusOverview.addListener("execute", function () {
                  window.MaelstromTools.BaseStatus.getInstance().openWindow("BaseStatusOverview", Lang.gt("Base status overview"));
                }, this);

                desktopPositionModifier++;
                var openHuffyUpgradeOverview = this.createDesktopButton(Lang.gt("Upgrade priority overview"), "UpgradeBuilding", false, this.desktopPosition(desktopPositionModifier));
                openHuffyUpgradeOverview.addListener("execute", function () {
                  window.HuffyTools.UpgradePriorityGUI.getInstance().openWindow("UpgradePriority", Lang.gt("Upgrade priority overview"));
                }, this);

                desktopPositionModifier++;
                var preferencesButton = new qx.ui.form.Button(Lang.gt("Options")).set({
                  appearance: "button-text-small",
                  width: 100,
                  minWidth: 100,
                  maxWidth: 100
                });
                preferencesButton.setUserData("desktopPosition", this.desktopPosition(desktopPositionModifier));
                preferencesButton.addListener("execute", function () {
                  window.MaelstromTools.Preferences.getInstance().openWindow("Preferences", Lang.gt("MaelstromTools Preferences"), true);
                }, this);

                if (MT_Preferences.Settings.useDedicatedMainMenu) {
                  this.addToDesktop("MainMenu", openMainMenuButton);
                }
                this.addToMainMenu("ResourceOverviewMenu", openResourceOverviewWindowButton);
                this.addToMainMenu("ProductionMenu", openProductionWindowButton);
                this.addToMainMenu("BaseStatusMenu", openBaseStatusOverview);
                this.addToMainMenu("RepairTimeMenu", openRepairTimeWindowButton);
                this.addToMainMenu("UpgradeBuilding", openHuffyUpgradeOverview);

                this.addToMainMenu("PreferencesMenu", preferencesButton);

                if (!MT_Preferences.Settings.useDedicatedMainMenu) {
                  this.mainMenuWindow.show();
                  var target = qx.core.Init.getApplication().getOptionsBar(); //getServerBar(); //qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_APPOINTMENTS);
                  this.mainMenuWindow.placeToWidget(target, true);
                }

                webfrontend.gui.chat.ChatWidget.recvbufsize = MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.CHATHISTORYLENGTH, 64);
                this.runSecondlyTimer();
                this.runMainTimer();
                this.runAutoCollectTimer();
              } catch (e) {
                console.log("MaelstromTools.initialize: ", e);
              }
            },

            desktopPosition: function (modifier) {
              if (!modifier) modifier = 0;
              return modifier;
            },

            createDesktopButton: function (title, imageName, isNotification, desktopPosition) {
              try {
                if (!isNotification) {
                  isNotification = false;
                }
                if (!desktopPosition) {
                  desktopPosition = this.desktopPosition();
                }
                var desktopButton = new qx.ui.form.Button(null, this.images[imageName]).set({
                  toolTipText: title,
                  width: 50,
                  height: 40,
                  maxWidth: 50,
                  maxHeight: 40,
                  appearance: (isNotification ? "button-standard-nod" : "button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                  center: true
                });

                desktopButton.setUserData("isNotification", isNotification);
                desktopButton.setUserData("desktopPosition", desktopPosition);
                return desktopButton;
              } catch (e) {
                console.log("MaelstromTools.createDesktopButton: ", e);
              }
            },

            createNewImage: function (name, path, fileManager) {
              try {
                if (!this.images) {
                  this.images = new Object();
                }
                if (!fileManager) {
                  return;
                }

                this.images[name] = fileManager.GetPhysicalPath(path);
              } catch (e) {
                console.log("MaelstromTools.createNewImage: ", e);
              }
            },

            createNewWindow: function (name, align, x, y, w, h, alignV) {
              try {
                if (!this.mWindows) {
                  this.mWindows = new Object();
                }
                this.mWindows[name] = new Object();
                this.mWindows[name]["Align"] = align;
                this.mWindows[name]["AlignV"] = alignV;
                this.mWindows[name]["x"] = x;
                this.mWindows[name]["y"] = y;
                this.mWindows[name]["w"] = w;
                this.mWindows[name]["h"] = h;
              } catch (e) {
                console.log("MaelstromTools.createNewWindow: ", e);
              }
            },

            addToMainMenu: function (name, button) {
              try {
                /*if(!this.useDedicatedMainMenu) {
                  return;
                }*/
                if (this.itemsInMainMenu[name] != null) {
                  return;
                }
                var desktopPosition = button.getUserData("desktopPosition");
                var isNotification = button.getUserData("isNotification");
                if (!desktopPosition) {
                  desktopPosition = this.desktopPosition();
                }
                if (!isNotification) {
                  isNotification = false;
                }

                if (isNotification && MT_Preferences.Settings.useDedicatedMainMenu) {
                  this.addToDesktop(name, button);
                } else {
                  if (!this.itemsInMainMenuCount[desktopPosition]) {
                    this.itemsInMainMenuCount[desktopPosition] = 0;
                  }
                  this.mainMenuWindow.add(button, {
                    right: 5 + (52 * this.itemsInMainMenuCount[desktopPosition]),
                    top: 0 + (42 * (desktopPosition)) //bottom: 0 - (42 * (desktopPosition - 1))
                  });

                  this.itemsInMainMenu[name] = button;
                  this.itemsInMainMenuCount[desktopPosition]++;
                }
              } catch (e) {
                console.log("MaelstromTools.addToMainMenu: ", e);
              }
            },

            removeFromMainMenu: function (name, rearrange) {
              try {
                if (rearrange == null) {
                  rearrange = true;
                }
                if (this.itemsOnDesktop[name] != null) {
                  var isNotification = this.itemsOnDesktop[name].getUserData("isNotification");
                  if (!isNotification) {
                    isNotification = false;
                  }
                  if (isNotification && MT_Preferences.Settings.useDedicatedMainMenu) {
                    this.removeFromDesktop(name, rearrange);
                  }
                } else if (this.itemsInMainMenu[name] != null) {
                  var desktopPosition = this.itemsInMainMenu[name].getUserData("desktopPosition");
                  var isNotification = this.itemsInMainMenu[name].getUserData("isNotification");
                  if (!desktopPosition) {
                    desktopPosition = this.desktopPosition();
                  }
                  if (!isNotification) {
                    isNotification = false;
                  }

                  this.mainMenuWindow.remove(this.itemsInMainMenu[name]);
                  this.itemsInMainMenu[name] = null;
                  this.itemsInMainMenuCount[desktopPosition]--;

                  if (rearrange && this.itemsInMainMenu[desktopPosition] > 1) {
                    var tmpItems = new Object();
                    // remove notifications 
                    for (var itemName in this.itemsOnDesktop) {
                      if (this.itemsInMainMenu[itemName] == null) {
                        continue;
                      }
                      if (!isNotification) {
                        continue;
                      }
                      tmpItems[itemName] = this.itemsInMainMenu[itemName];
                      this.removeFromMainMenu(itemName, false);
                    }
                    // rearrange notifications
                    for (var itemName2 in tmpItems) {
                      var tmp = tmpItems[itemName2];
                      if (tmp == null) {
                        continue;
                      }
                      this.addToMainMenu(itemName2, tmp);
                    }
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.removeFromDesktop: ", e);
              }
            },

            addToDesktop: function (name, button) {
              try {
                if (this.itemsOnDesktop[name] != null) {
                  return;
                }
                var desktopPosition = button.getUserData("desktopPosition");
                if (!desktopPosition) {
                  desktopPosition = this.desktopPosition();
                }

                if (!this.itemsOnDesktopCount[desktopPosition]) {
                  this.itemsOnDesktopCount[desktopPosition] = 0;
                }

                var app = qx.core.Init.getApplication();
                //var navBar = app.getNavigationBar();

                // console.log("add to Desktop at pos: " + this.itemsOnDesktopCount);
                app.getDesktop().add(button, {
                  //right: navBar.getBounds().width + (52 * this.itemsOnDesktopCount[desktopPosition]),
                  //top: 42 * (desktopPosition - 1)
                  right: 5 + (52 * this.itemsOnDesktopCount[desktopPosition]),
                  //top: this.initialAppointmentBarHeight + 125 + (42 * (desktopPosition - 1))
                  bottom: 140 - (42 * (desktopPosition - 1))
                });

                this.itemsOnDesktop[name] = button;
                this.itemsOnDesktopCount[desktopPosition]++;
              } catch (e) {
                console.log("MaelstromTools.addToDesktop: ", e);
              }
            },

            removeFromDesktop: function (name, rearrange) {
              try {
                if (rearrange == null) {
                  rearrange = true;
                }
                var app = qx.core.Init.getApplication();

                if (this.itemsOnDesktop[name] != null) {
                  var desktopPosition = this.itemsOnDesktop[name].getUserData("desktopPosition");
                  var isNotification = this.itemsOnDesktop[name].getUserData("isNotification");
                  if (!desktopPosition) {
                    desktopPosition = this.desktopPosition();
                  }
                  if (!isNotification) {
                    isNotification = false;
                  }

                  app.getDesktop().remove(this.itemsOnDesktop[name]);
                  this.itemsOnDesktop[name] = null;
                  this.itemsOnDesktopCount[desktopPosition]--;

                  if (rearrange && this.itemsOnDesktopCount[desktopPosition] > 1) {
                    var tmpItems = new Object();
                    // remove notifications 
                    for (var itemName in this.itemsOnDesktop) {
                      if (this.itemsOnDesktop[itemName] == null) {
                        continue;
                      }
                      if (!this.itemsOnDesktop[itemName].getUserData("isNotification")) {
                        continue;
                      }
                      tmpItems[itemName] = this.itemsOnDesktop[itemName];
                      this.removeFromDesktop(itemName, false);
                    }
                    // rearrange notifications
                    for (var itemName2 in tmpItems) {
                      var tmp = tmpItems[itemName2];
                      if (tmp == null) {
                        continue;
                      }
                      this.addToMainMenu(itemName2, tmp);
                    }
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.removeFromDesktop: ", e);
              }
            },

            runSecondlyTimer: function () {
              try {
                this.calculateCostsForNextMCV();

                var self = this;
                window.setTimeout(function () {
                  self.runSecondlyTimer();
                }, 1000);
              } catch (e) {
                console.log("MaelstromTools.runSecondlyTimer: ", e);
              }
            },

            runMainTimer: function () {
              try {
                this.checkForPackages();
                if (CCTAWrapperIsInstalled()) {
                  this.checkRepairAllUnits();
                  this.checkRepairAllBuildings();
                }

                var missionTracker = typeof (qx.core.Init.getApplication().getMissionsBar) === 'function' ? qx.core.Init.getApplication().getMissionsBar() : qx.core.Init.getApplication().getMissionTracker(); //fix for PerforceChangelist>=376877
                if (MT_Preferences.Settings.autoHideMissionTracker) {
                  if (missionTracker.isVisible()) {
                    missionTracker.hide();
                  }
                  if (typeof (qx.core.Init.getApplication().getMissionsBar) === 'function') {
                    if (qx.core.Init.getApplication().getMissionsBar().getSizeHint().height != 0) {
                      qx.core.Init.getApplication().getMissionsBar().getSizeHint().height = 0;
                      qx.core.Init.getApplication().triggerDesktopResize();
                    }
                  }
                } else {
                  if (!missionTracker.isVisible()) {
                    missionTracker.show();
                    if (typeof (qx.core.Init.getApplication().getMissionsBar) === 'function') {
                      qx.core.Init.getApplication().getMissionsBar().initHeight();
                      qx.core.Init.getApplication().triggerDesktopResize();
                    }
                  }
                }
                
                var self = this;
                window.setTimeout(function () {
                  self.runMainTimer();
                }, this.mainTimerInterval);
              } catch (e) {
                console.log("MaelstromTools.runMainTimer: ", e);
              }
            },

            runAutoCollectTimer: function () {
              try {
                //console.log("runAutoCollectTimer ", MT_Preferences.Settings.AutoCollectTimer);
                if (!CCTAWrapperIsInstalled()) return; // run timer only then wrapper is running
                if (this.checkForPackages() && MT_Preferences.Settings.autoCollectPackages) {
                  this.collectAllPackages();
                }
                if (this.checkRepairAllUnits() && MT_Preferences.Settings.autoRepairUnits) {
                  this.repairAllUnits();
                }
                if (this.checkRepairAllBuildings() && MT_Preferences.Settings.autoRepairBuildings) {
                  this.repairAllBuildings();
                }

                var self = this;
                window.setTimeout(function () {
                  self.runAutoCollectTimer();
                }, MT_Preferences.Settings.AutoCollectTimer * 60000);
              } catch (e) {
                console.log("MaelstromTools.runMainTimer: ", e);
              }
            },

            openWindow: function (windowObj, windowName, skipMoveWindow) {
              try {
                if (!windowObj.isVisible()) {
                  if (windowName == "MainMenu") {
                    windowObj.show();
                  } else {
                    if (!skipMoveWindow) {
                      this.moveWindow(windowObj, windowName);
                    }
                    windowObj.open();
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.openWindow: ", e);
              }
            },

            moveWindow: function (windowObj, windowName) {
              try {
                var x = this.mWindows[windowName]["x"];
                var y = this.mWindows[windowName]["y"];
                if (this.mWindows[windowName]["Align"] == "R") {
                  x = qx.bom.Viewport.getWidth(window) - this.mWindows[windowName]["x"];
                }
                if (this.mWindows[windowName]["AlignV"] == "B") {
                  y = qx.bom.Viewport.getHeight(window) - this.mWindows[windowName]["y"] - windowObj.height;
                }
                windowObj.moveTo(x, y);
                if (windowName != "MainMenu") {
                  windowObj.setHeight(this.mWindows[windowName]["h"]);
                  windowObj.setWidth(this.mWindows[windowName]["w"]);
                }
              } catch (e) {
                console.log("MaelstromTools.moveWindow: ", e);
              }
            },

            checkForPackages: function () {
              try {
                MT_Cache.updateCityCache();

                for (var cname in MT_Cache.Cities) {
                  var ncity = MT_Cache.Cities[cname].Object;
                  if (ncity.get_CityBuildingsData().get_HasCollectableBuildings()) {
                    this.addToMainMenu("CollectAllResources", this.buttonCollectAllResources);
                    return true;
                  }
                }
                this.removeFromMainMenu("CollectAllResources");
                return false;
              } catch (e) {
                console.log("MaelstromTools.checkForPackages: ", e);
                return false;
              }
            },

            collectAllPackages: function () {
              try {
                MT_Cache.updateCityCache();
                for (var cname in MT_Cache.Cities) {
                  var ncity = MT_Cache.Cities[cname].Object;
                  if (ncity.get_CityBuildingsData().get_HasCollectableBuildings()) {
                    if (MT_Cache.CityCount <= 1) {
                      var buildings = ncity.get_Buildings().d;
                      for (var x in buildings) {
                        var building = buildings[x];
                        if (building.get_ProducesPackages() && building.get_ReadyToCollect()) {
                          ClientLib.Net.CommunicationManager.GetInstance().SendCommand("CollectResource",{cityid:ncity.get_Id(), posX:building.get_CoordX(),posY:building.get_CoordY()}, null, null, true);
                        }
                      }
                    } else {
                      ncity.CollectAllResources();
                    }
                  }
                }
                this.removeFromMainMenu("CollectAllResources");
              } catch (e) {
                console.log("MaelstromTools.collectAllPackages: ", e);
              }
            },

            checkRepairAll: function (visMode, buttonName, button) {
              try {
                MT_Cache.updateCityCache();

                for (var cname in MT_Cache.Cities) {
                  var ncity = MT_Cache.Cities[cname].Object;
                  if (MaelstromTools.Wrapper.CanRepairAll(ncity, visMode)) {
                    this.addToMainMenu(buttonName, button);
                    return true;
                  }
                }

                this.removeFromMainMenu(buttonName);
                return false;
              } catch (e) {
                console.log("MaelstromTools.checkRepairAll: ", e);
                return false;
              }
            },

            checkRepairAllUnits: function () {
              return this.checkRepairAll(ClientLib.Vis.Mode.ArmySetup, "RepairAllUnits", this.buttonRepairAllUnits);
            },

            checkRepairAllBuildings: function () {
              return this.checkRepairAll(ClientLib.Vis.Mode.City, "RepairAllBuildings", this.buttonRepairAllBuildings);
            },

            repairAll: function (visMode, buttonName) {
              try {
                MT_Cache.updateCityCache();

                for (var cname in MT_Cache.Cities) {
                  var ncity = MT_Cache.Cities[cname].Object;
                  if (MaelstromTools.Wrapper.CanRepairAll(ncity, visMode)) {
                    MaelstromTools.Wrapper.RepairAll(ncity, visMode);
                  }

                }
                this.removeFromMainMenu(buttonName);
              } catch (e) {
                console.log("MaelstromTools.repairAll: ", e);
              }
            },

            //ClientLib.Data.City.prototype.get_CityRepairData
            //ClientLib.Data.CityRepair.prototype.CanRepairAll
            //ClientLib.Data.CityRepair.prototype.RepairAll
            repairAllUnits: function () {
              try {
                this.repairAll(ClientLib.Vis.Mode.ArmySetup, "RepairAllUnits");
              } catch (e) {
                console.log("MaelstromTools.repairAllUnits: ", e);
              }
            },

            repairAllBuildings: function () {
              try {
                this.repairAll(ClientLib.Vis.Mode.City, "RepairAllBuildings");
              } catch (e) {
                console.log("MaelstromTools.repairAllBuildings: ", e);
              }
            },

            updateLoot: function (ident, visCity, widget) {
              try {
                clearInterval(this.lootStatusInfoInterval);
                if (!MT_Preferences.Settings.showLoot) {
                  if (this.lootWidget[ident]) {
                    this.lootWidget[ident].removeAll();
                  }
                  return;
                }

                var baseLoadState = MT_Cache.updateLoot(visCity);
                if (baseLoadState == -2) { // base already cached and base not changed
                  return;
                }

                if (!this.lootWidget) {
                  this.lootWidget = new Object();
                }
                if (!this.lootWidget[ident]) {
                  this.lootWidget[ident] = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 5));
                  this.lootWidget[ident].setTextColor("white");
                  widget.add(this.lootWidget[ident]);
                }
                var lootWidget = this.lootWidget[ident];

                var rowIdx = 1;
                var colIdx = 1;
                lootWidget.removeAll();
                switch (baseLoadState) {
                  case -1:
                    {
                      MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, "Target out of range, no resource calculation possible", null, null, 'bold', null);
                      break;
                    }
                  case 1:
                    {
                      var Resources = MT_Cache.SelectedBaseResources;
                      this.createResourceLabels(lootWidget, ++rowIdx, "Possible attacks from this base (available CP)", Resources, - 1);
                      this.createResourceLabels(lootWidget, ++rowIdx, "Lootable resources", Resources, 1);
                      this.createResourceLabels(lootWidget, ++rowIdx, "per CP", Resources, 1 * Resources.CPNeeded);
                      this.createResourceLabels(lootWidget, ++rowIdx, "2nd run", Resources, 2 * Resources.CPNeeded);
                      this.createResourceLabels(lootWidget, ++rowIdx, "3rd run", Resources, 3 * Resources.CPNeeded);
                      break;
                    }
                  default:
                    {
                      MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, "Calculating resources...", null, null, 'bold', null);
                      this.lootStatusInfoInterval = setInterval(function () {
                        MaelstromTools.Base.getInstance().updateLoot(ident, visCity, widget);
                      }, 100);
                      break;
                    }
                }
              } catch (e) {
                console.log("MaelstromTools.updateLoot: ", e);
              }
            },

            createResourceLabels: function (lootWidget, rowIdx, Label, Resources, Modifier) {
              var colIdx = 1;
              var font = (Modifier > 1 ? null : 'bold');

              if (Modifier == -1 && Resources.CPNeeded > 0) {
                Label = Lang.gt(Label) + ": " + Math.floor(ClientLib.Data.MainData.GetInstance().get_Player().GetCommandPointCount() / Resources.CPNeeded);
                MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, Label, null, 'left', font, null, 9);
                return;
              }
              colIdx = 1;
              if (Modifier > 0) {
                MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, Lang.gt(Label) + ":", null, null, font);
                MaelstromTools.Util.addImage(lootWidget, rowIdx, colIdx++, MaelstromTools.Util.getImage(MaelstromTools.Statics.Research));
                MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Resources[MaelstromTools.Statics.Research] / Modifier), 50, 'right', font);
                MaelstromTools.Util.addImage(lootWidget, rowIdx, colIdx++, MaelstromTools.Util.getImage(MaelstromTools.Statics.Tiberium));
                MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Resources[MaelstromTools.Statics.Tiberium] / Modifier), 50, 'right', font);
                MaelstromTools.Util.addImage(lootWidget, rowIdx, colIdx++, MaelstromTools.Util.getImage(MaelstromTools.Statics.Crystal));
                MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Resources[MaelstromTools.Statics.Crystal] / Modifier), 50, 'right', font);
                MaelstromTools.Util.addImage(lootWidget, rowIdx, colIdx++, MaelstromTools.Util.getImage(MaelstromTools.Statics.Dollar));
                MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Resources[MaelstromTools.Statics.Dollar] / Modifier), 50, 'right', font);
                MaelstromTools.Util.addImage(lootWidget, rowIdx, colIdx++, MaelstromTools.Util.getImage("Sum"));
                MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Resources["Total"] / Modifier), 50, 'right', font);
              }
            },

            mcvPopup: null,
            mcvPopupX : 0,
            mcvPopupY : 0,
            mcvTimerLabel: null,
			mcvRPLabel: null,
            calculateCostsForNextMCV: function () {
              try {
                if (!MT_Preferences.Settings.showCostsForNextMCV) {
                  if (this.mcvPopup) {
                    this.mcvPopup.close();
                  }
                  return;
                }
                var player = ClientLib.Data.MainData.GetInstance().get_Player();
                var cw = player.get_Faction();
                var cj = ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(ClientLib.Base.ETechName.Research_BaseFound, cw);
                var cr = player.get_PlayerResearch();
                var cd = cr.GetResearchItemFomMdbId(cj);
                if (cd == null) {
                  if (this.mcvPopup) {
                    this.mcvPopup.close();
                  }
                  return;
                }

                if (!this.mcvPopup) {
                  this.mcvPopup = new qx.ui.window.Window("").set({
                    contentPadding : 0,
                    showMinimize : false,
                    showMaximize : false,
                    showClose : false,
                    resizable : false
                  });
                  this.mcvPopup.setLayout(new qx.ui.layout.VBox(2));
                  this.mcvPopup.addListener("move", function (e) {
                    var base = MaelstromTools.Base.getInstance();
                    var size = qx.core.Init.getApplication().getRoot().getBounds();
                    var value = size.width - e.getData().left;
					//Added sizeClientHeight and sizeClientWidth
					var sizeClientWidth = document.documentElement.clientWidth
					var sizeClientHeight = document.documentElement.clientHeight
					//Modified "base.mcvPopupX = value < 0 ? 150 : value;" to keep "x" of mcv timer
					//position from exceeding the window size.
                    base.mcvPopupX = value < 0 || value > sizeClientWidth ? 150 : value;
                    value = size.height - e.getData().top;
					//Modified "base.mcvPopupY = value < 0 ? 70 : value;" to keep "Y" of mcv timer
					//position from exceeding the window size.
                    base.mcvPopupY = value < 0 || value > sizeClientHeight ? 70 : value;
                    MaelstromTools.LocalStorage.set("mcvPopup", {
                      x : base.mcvPopupX,
                      y : base.mcvPopupY
                    });
                  });
                  var font = qx.bom.Font.fromString('bold').set({
                    size: 20
                  });
				  
				  var font2 = qx.bom.Font.fromString('bold').set({
                    size: 15
                  });

                  this.mcvTimerLabel = new qx.ui.basic.Label().set({
                    font: font,
                    textColor: 'red',
                    width: 155,
                    textAlign: 'center',
                    marginBottom : 1
                  });
				  
				  this.mcvRPLabel = new qx.ui.basic.Label().set({
                    font: font2,
                    textColor: 'red',
                    width: 155,
                    textAlign: 'center',
                    marginBottom : 5
                  });
				  
                  this.mcvPopup.add(this.mcvTimerLabel);
				  this.mcvPopup.add(this.mcvRPLabel);
                  var serverBar = qx.core.Init.getApplication().getServerBar().getBounds();
                  var pos = MaelstromTools.LocalStorage.get("mcvPopup", {
                      x : serverBar.width + 150,
                      y : 70
                    });
                  this.mcvPopupX = pos.x;
                  this.mcvPopupY = pos.y;
                  this.mcvPopup.open();
                }
                var size = qx.core.Init.getApplication().getRoot().getBounds();
                this.mcvPopup.moveTo(size.width - this.mcvPopupX, size.height - this.mcvPopupY);

                var nextLevelInfo = cd.get_NextLevelInfo_Obj();
                var resourcesNeeded = new Array();
                for (var i in nextLevelInfo.rr) {
                  if (nextLevelInfo.rr[i].t > 0) {
                    resourcesNeeded[nextLevelInfo.rr[i].t] = nextLevelInfo.rr[i].c;
                  }
                }
                var researchNeeded = resourcesNeeded[ClientLib.Base.EResourceType.ResearchPoints];
                var currentResearchPoints = player.get_ResearchPoints();

                var creditsNeeded = resourcesNeeded[ClientLib.Base.EResourceType.Gold];
                var creditsResourceData = player.get_Credits();
                var creditGrowthPerHour = (creditsResourceData.Delta + creditsResourceData.ExtraBonusDelta) * ClientLib.Data.MainData.GetInstance().get_Time().get_StepsPerHour();
                var creditTimeLeftInHours = (creditsNeeded - player.GetCreditsCount()) / creditGrowthPerHour;

                if (creditGrowthPerHour == 0 || creditTimeLeftInHours <= 0) {
                  if (this.mcvPopup) {
                    this.mcvPopup.close();
                  }
                  return;
                }

                this.mcvPopup.setCaption(Lang.gt("Next MCV") + " ($ " + MaelstromTools.Wrapper.FormatNumbersCompact(creditsNeeded) + ")");
                this.mcvTimerLabel.setValue((MaelstromTools.Wrapper.FormatTimespan(creditTimeLeftInHours * 60 * 60)));
				this.mcvRPLabel.setValue("RP: " + MaelstromTools.Wrapper.FormatNumbersCompact(researchNeeded - currentResearchPoints) + "");

                if (!this.mcvPopup.isVisible()) {
                  this.mcvPopup.open();
                }
              } catch (e) {
                console.log("calculateCostsForNextMCV", e);
              }
            }
          }
        });

        // define Preferences
        qx.Class.define("MaelstromTools.Preferences", {
          type: "singleton",
          extend: qx.core.Object,

          statics: {
            USEDEDICATEDMAINMENU: "useDedicatedMainMenu",
            AUTOCOLLECTPACKAGES: "autoCollectPackages",
            AUTOREPAIRUNITS: "autoRepairUnits",
            AUTOREPAIRBUILDINGS: "autoRepairBuildings",
            AUTOHIDEMISSIONTRACKER: "autoHideMissionTracker",
            AUTOCOLLECTTIMER: "AutoCollectTimer",
            SHOWLOOT: "showLoot",
            SHOWCOSTSFORNEXTMCV: "showCostsForNextMCV",
            CHATHISTORYLENGTH: "ChatHistoryLength"
          },

          members: {
            Window: null,
            Widget: null,
            Settings: null,
            FormElements: null,

            readOptions: function () {
              try {
                if (!this.Settings) {
                  this.Settings = new Object();
                }

                /*
                if(MaelstromTools.LocalStorage.get("useDedicatedMainMenu") == null) {
                  if(qx.bom.Viewport.getWidth(window) > 1800) {
                    this.Settings["useDedicatedMainMenu"] = false;
                  }
                } else {
                  this.Settings["useDedicatedMainMenu"] = (MaelstromTools.LocalStorage.get("useDedicatedMainMenu", 1) == 1);
                }*/
                this.Settings[MaelstromTools.Preferences.USEDEDICATEDMAINMENU] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.USEDEDICATEDMAINMENU, 1) == 1);
                this.Settings[MaelstromTools.Preferences.AUTOCOLLECTPACKAGES] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.AUTOCOLLECTPACKAGES, 0) == 1);
                this.Settings[MaelstromTools.Preferences.AUTOREPAIRUNITS] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.AUTOREPAIRUNITS, 0) == 1);
                this.Settings[MaelstromTools.Preferences.AUTOREPAIRBUILDINGS] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.AUTOREPAIRBUILDINGS, 0) == 1);
                this.Settings[MaelstromTools.Preferences.AUTOHIDEMISSIONTRACKER] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.AUTOHIDEMISSIONTRACKER, 0) == 1);
                this.Settings[MaelstromTools.Preferences.AUTOCOLLECTTIMER] = MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.AUTOCOLLECTTIMER, 60);
                this.Settings[MaelstromTools.Preferences.SHOWLOOT] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.SHOWLOOT, 1) == 1);
                this.Settings[MaelstromTools.Preferences.SHOWCOSTSFORNEXTMCV] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.SHOWCOSTSFORNEXTMCV, 1) == 1);
                this.Settings[MaelstromTools.Preferences.CHATHISTORYLENGTH] = MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.CHATHISTORYLENGTH, 64);

                if (!CCTAWrapperIsInstalled()) {
                  this.Settings[MaelstromTools.Preferences.AUTOREPAIRUNITS] = false;
                  this.Settings[MaelstromTools.Preferences.AUTOREPAIRBUILDINGS] = false;
                  //this.Settings[MaelstromTools.Preferences.SHOWLOOT] = false;
                }
                //console.log(this.Settings);

              } catch (e) {
                console.log("MaelstromTools.Preferences.readOptions: ", e);
              }
            },

            openWindow: function (WindowName, WindowTitle) {
              try {
                if (!this.Window) {
                  //this.Window = new qx.ui.window.Window(WindowTitle).set({
                  this.Window = new webfrontend.gui.OverlayWindow().set({
                    autoHide: false,
                    title: WindowTitle,
                    minHeight: 350

                    //resizable: false,
                    //showMaximize:false,
                    //showMinimize:false,
                    //allowMaximize:false,
                    //allowMinimize:false,
                    //showStatusbar: false
                  });
                  this.Window.clientArea.setPadding(10);
                  this.Window.clientArea.setLayout(new qx.ui.layout.VBox(3));

                  this.Widget = new qx.ui.container.Composite(new qx.ui.layout.Grid().set({
                    spacingX: 5,
                    spacingY: 5
                  }));

                  //this.Widget.setTextColor("white");

                  this.Window.clientArea.add(this.Widget);
                }

                if (this.Window.isVisible()) {
                  this.Window.close();
                } else {
                  MT_Base.openWindow(this.Window, WindowName);
                  this.setWidgetLabels();
                }
              } catch (e) {
                console.log("MaelstromTools.Preferences.openWindow: ", e);
              }
            },

            addFormElement: function (name, element) {
              this.FormElements[name] = element;
            },

            setWidgetLabels: function () {
              try {
                this.readOptions();

                this.FormElements = new Object();
                this.Widget.removeAll();
                var rowIdx = 1;
                var colIdx = 1;

                var chkAutoHideMissionTracker = new qx.ui.form.CheckBox(Lang.gt("Hide Mission Tracker")).set({
                  value: this.Settings[MaelstromTools.Preferences.AUTOHIDEMISSIONTRACKER] == 1
                });
                var chkUseDedicatedMainMenu = new qx.ui.form.CheckBox(Lang.gt("Use dedicated Main Menu (restart required)")).set({
                  value: this.Settings[MaelstromTools.Preferences.USEDEDICATEDMAINMENU] == 1
                });
                var chkShowLoot = new qx.ui.form.CheckBox(Lang.gt("Show lootable resources (restart required)")).set({
                  value: this.Settings[MaelstromTools.Preferences.SHOWLOOT] == 1/*,
                  enabled: CCTAWrapperIsInstalled()*/
                });
                var chkCostsNextMCV = new qx.ui.form.CheckBox(Lang.gt("Show time to next MCV")).set({
                  value: this.Settings[MaelstromTools.Preferences.SHOWCOSTSFORNEXTMCV] == 1
                });
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkAutoHideMissionTracker, 2);
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkUseDedicatedMainMenu, 2);
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkShowLoot, 2);
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkCostsNextMCV, 2);

                var chkAutoCollectPackages = new qx.ui.form.CheckBox(Lang.gt("Autocollect packages")).set({
                  value: this.Settings[MaelstromTools.Preferences.AUTOCOLLECTPACKAGES] == 1
                });
                var chkAutoRepairUnits = new qx.ui.form.CheckBox(Lang.gt("Autorepair units")).set({
                  value: this.Settings[MaelstromTools.Preferences.AUTOREPAIRUNITS] == 1,
                  enabled: CCTAWrapperIsInstalled()
                });
                var chkAutoRepairBuildings = new qx.ui.form.CheckBox(Lang.gt("Autorepair buildings")).set({
                  value: this.Settings[MaelstromTools.Preferences.AUTOREPAIRBUILDINGS] == 1,
                  enabled: CCTAWrapperIsInstalled()
                });

                var spinnerChatHistoryLength = new qx.ui.form.Spinner().set({
                  minimum: 64,
                  maximum: 512,
                  value: this.Settings[MaelstromTools.Preferences.CHATHISTORYLENGTH]
                });

                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx, Lang.gt("Chat history length") + " (" + spinnerChatHistoryLength.getMinimum() + " - " + spinnerChatHistoryLength.getMaximum() + ")");
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx + 1, spinnerChatHistoryLength);

                var spinnerAutoCollectTimer = new qx.ui.form.Spinner().set({
                  minimum: 5,
                  maximum: 60 * 6,
                  value: this.Settings[MaelstromTools.Preferences.AUTOCOLLECTTIMER]
                });

                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx, Lang.gt("Automatic interval in minutes") + " (" + spinnerAutoCollectTimer.getMinimum() + " - " + spinnerAutoCollectTimer.getMaximum() + ")");
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx + 1, spinnerAutoCollectTimer);
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkAutoCollectPackages, 2);
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkAutoRepairUnits, 2);
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkAutoRepairBuildings, 2);

                var applyButton = new qx.ui.form.Button(Lang.gt("Apply changes")).set({
                  appearance: "button-detailview-small",
                  width: 120,
                  minWidth: 120,
                  maxWidth: 120
                });
                applyButton.addListener("execute", this.applyChanges, this);

                var cancelButton = new qx.ui.form.Button(Lang.gt("Discard changes")).set({
                  appearance: "button-detailview-small",
                  width: 120,
                  minWidth: 120,
                  maxWidth: 120
                });
                cancelButton.addListener("execute", function () {
                  this.Window.close();
                }, this);

                var resetButton = new qx.ui.form.Button(Lang.gt("Reset to default")).set({
                  appearance: "button-detailview-small",
                  width: 120,
                  minWidth: 120,
                  maxWidth: 120
                });
                resetButton.addListener("execute", this.resetToDefault, this);

                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, resetButton);
                colIdx = 1;
                MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, cancelButton);
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, applyButton);

                this.addFormElement(MaelstromTools.Preferences.AUTOHIDEMISSIONTRACKER, chkAutoHideMissionTracker);
                this.addFormElement(MaelstromTools.Preferences.USEDEDICATEDMAINMENU, chkUseDedicatedMainMenu);
                this.addFormElement(MaelstromTools.Preferences.SHOWLOOT, chkShowLoot);
                this.addFormElement(MaelstromTools.Preferences.SHOWCOSTSFORNEXTMCV, chkCostsNextMCV);
                this.addFormElement(MaelstromTools.Preferences.AUTOCOLLECTPACKAGES, chkAutoCollectPackages);
                this.addFormElement(MaelstromTools.Preferences.AUTOREPAIRUNITS, chkAutoRepairUnits);
                this.addFormElement(MaelstromTools.Preferences.AUTOREPAIRBUILDINGS, chkAutoRepairBuildings);
                this.addFormElement(MaelstromTools.Preferences.AUTOCOLLECTTIMER, spinnerAutoCollectTimer);
                this.addFormElement(MaelstromTools.Preferences.CHATHISTORYLENGTH, spinnerChatHistoryLength);
              } catch (e) {
                console.log("MaelstromTools.Preferences.setWidgetLabels: ", e);
              }
            },

            applyChanges: function () {
              try {
                var autoRunNeeded = false;
                for (var idx in this.FormElements) {
                  var element = this.FormElements[idx];
                  if (idx == MaelstromTools.Preferences.AUTOCOLLECTTIMER) {
                    autoRunNeeded = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.AUTOCOLLECTTIMER, 0) != element.getValue());
                  }
                  if (idx == MaelstromTools.Preferences.CHATHISTORYLENGTH) {
                    webfrontend.gui.chat.ChatWidget.recvbufsize = element.getValue();
                  }
                  MaelstromTools.LocalStorage.set(idx, element.getValue());
                }
                this.readOptions();
                if (autoRunNeeded) {
                  MT_Base.runAutoCollectTimer();
                }
                this.Window.close();
              } catch (e) {
                console.log("MaelstromTools.Preferences.applyChanges: ", e);
              }
            },

            resetToDefault: function () {
              try {
                MaelstromTools.LocalStorage.clearAll();
                this.setWidgetLabels();
              } catch (e) {
                console.log("MaelstromTools.Preferences.resetToDefault: ", e);
              }
            }
          }
        });

        // define DefaultObject
        qx.Class.define("MaelstromTools.DefaultObject", {
          type: "abstract",
          extend: qx.core.Object,
          members: {
            Window: null,
            Widget: null,
            Cache: {}, //k null
            IsTimerEnabled: true,

            calc: function () {
              try {
                if (this.Window.isVisible()) {
                  this.updateCache();
                  this.setWidgetLabels();
                  if (this.IsTimerEnabled) {
                    var self = this;
                    window.setTimeout(function () {
                      self.calc();
                    }, MT_Base.timerInterval);
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.DefaultObject.calc: ", e);
              }
            },

            openWindow: function (WindowName, WindowTitle) {
              try {
                if (!this.Window) {
                  this.Window = new qx.ui.window.Window(WindowTitle).set({
                    resizable: false,
                    showMaximize: false,
                    showMinimize: false,
                    allowMaximize: false,
                    allowMinimize: false,
                    showStatusbar: false
                  });
                  this.Window.setPadding(10);
                  this.Window.setLayout(new qx.ui.layout.VBox(3));

                  this.Widget = new qx.ui.container.Composite(new qx.ui.layout.Grid());
                  this.Widget.setTextColor("white");

                  this.Window.add(this.Widget);
                }

                if (this.Window.isVisible()) {
                  this.Window.close();
                } else {
                  MT_Base.openWindow(this.Window, WindowName);
                  this.calc();
                }
              } catch (e) {
                console.log("MaelstromTools.DefaultObject.openWindow: ", e);
              }
            }
          }
        });

        // define Production
        qx.Class.define("MaelstromTools.Production", {
          type: "singleton",
          extend: MaelstromTools.DefaultObject,
          members: {
            updateCache: function (onlyForCity) {
              try {
                MT_Cache.updateCityCache();
                var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                //this.Cache = Object();

                for (var cname in MT_Cache.Cities) {
                  if (onlyForCity != null && onlyForCity != cname) {
                    continue;
                  }
                  var ncity = MT_Cache.Cities[cname].Object;
                  if (typeof (this.Cache[cname]) !== 'object') this.Cache[cname] = {};
                  if (typeof (this.Cache[cname][MaelstromTools.Statics.Tiberium]) !== 'object') this.Cache[cname][MaelstromTools.Statics.Tiberium] = {}; // all have to be checked, 
                  if (typeof (this.Cache[cname][MaelstromTools.Statics.Crystal]) !== 'object') this.Cache[cname][MaelstromTools.Statics.Crystal] = {}; // this.Cache[cname] can be created inside different namespaces
                  if (typeof (this.Cache[cname][MaelstromTools.Statics.Power]) !== 'object') this.Cache[cname][MaelstromTools.Statics.Power] = {}; // like the RepairTime etc... without those objs
                  if (typeof (this.Cache[cname][MaelstromTools.Statics.Dollar]) !== 'object') this.Cache[cname][MaelstromTools.Statics.Dollar] = {};

                  this.Cache[cname]["ProductionStopped"] = ncity.get_IsGhostMode();
                  this.Cache[cname]["PackagesStopped"] = (ncity.get_hasCooldown() || ncity.get_IsGhostMode());
                  this.Cache[cname][MaelstromTools.Statics.Tiberium]["Delta"] = ncity.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false); // (production.d[ClientLib.Base.EResourceType.Tiberium]['Delta'] * serverTime.get_StepsPerHour());
                  this.Cache[cname][MaelstromTools.Statics.Tiberium]["ExtraBonusDelta"] = ncity.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Tiberium); //(production.d[ClientLib.Base.EResourceType.Tiberium]['ExtraBonusDelta'] * serverTime.get_StepsPerHour());
                  this.Cache[cname][MaelstromTools.Statics.Tiberium]["POI"] = alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Tiberium);
                  this.Cache[cname][MaelstromTools.Statics.Crystal]["Delta"] = ncity.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false); //(production.d[ClientLib.Base.EResourceType.Crystal]['Delta'] * serverTime.get_StepsPerHour());
                  this.Cache[cname][MaelstromTools.Statics.Crystal]["ExtraBonusDelta"] = ncity.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Crystal); //(production.d[ClientLib.Base.EResourceType.Crystal]['ExtraBonusDelta'] * serverTime.get_StepsPerHour());
                  this.Cache[cname][MaelstromTools.Statics.Crystal]["POI"] = alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Crystal);
                  this.Cache[cname][MaelstromTools.Statics.Power]["Delta"] = ncity.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false); //(production.d[ClientLib.Base.EResourceType.Power]['Delta'] * serverTime.get_StepsPerHour());
                  this.Cache[cname][MaelstromTools.Statics.Power]["ExtraBonusDelta"] = ncity.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Power); // (production.d[ClientLib.Base.EResourceType.Power]['ExtraBonusDelta'] * serverTime.get_StepsPerHour());
                  this.Cache[cname][MaelstromTools.Statics.Power]["POI"] = alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Power);
                  this.Cache[cname][MaelstromTools.Statics.Dollar]["Delta"] = ClientLib.Base.Resource.GetResourceGrowPerHour(ncity.get_CityCreditsProduction(), false); // (ncity.get_CityCreditsProduction()['Delta'] * serverTime.get_StepsPerHour());
                  this.Cache[cname][MaelstromTools.Statics.Dollar]["ExtraBonusDelta"] = ClientLib.Base.Resource.GetResourceBonusGrowPerHour(ncity.get_CityCreditsProduction(), false); // (ncity.get_CityCreditsProduction()['ExtraBonusDelta'] * serverTime.get_StepsPerHour());
                  this.Cache[cname][MaelstromTools.Statics.Dollar]["POI"] = 0;
                  this.Cache[cname]["BaseLevel"] = MaelstromTools.Wrapper.GetBaseLevel(ncity);
                  if (onlyForCity != null && onlyForCity == cname) return this.Cache[cname];
                }
              } catch (e) {
                console.log("MaelstromTools.Production.updateCache: ", e);
              }
            },

            createProductionLabels2: function (rowIdx, colIdx, cityName, resourceType) {
              try {
                if (cityName == "-Total-") {
                  var Totals = Object();
                  Totals["Delta"] = 0;
                  Totals["ExtraBonusDelta"] = 0;
                  Totals["POI"] = 0;
                  Totals["Total"] = 0;

                  for (var cname in this.Cache) {
                    Totals["Delta"] += this.Cache[cname][resourceType]['Delta'];
                    Totals["ExtraBonusDelta"] += this.Cache[cname][resourceType]['ExtraBonusDelta'];
                    Totals["POI"] += this.Cache[cname][resourceType]['POI'];
                  }
                  Totals["Total"] = Totals['Delta'] + Totals['ExtraBonusDelta'] + Totals['POI'];

                  rowIdx++;

                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(Totals['Delta']), 80, 'right', 'bold');
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(Totals['ExtraBonusDelta']), 80, 'right', 'bold');
                  if (resourceType != MaelstromTools.Statics.Dollar) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(Totals['POI']), 80, 'right', 'bold');
                  } else {
                    rowIdx++;
                  }
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(Totals['Total']), 80, 'right', 'bold');
                } else if (cityName == "-Labels-") {
                  MaelstromTools.Util.addImage(this.Widget, rowIdx++, colIdx, MaelstromTools.Util.getImage(resourceType));
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, "Continuous", 100, 'left');
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, "Bonus", 100, 'left');
                  if (resourceType != MaelstromTools.Statics.Dollar) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, "POI", 100, 'left');
                  } else {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, "Total / BaseLevel", 100, 'left');
                  }
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, "Total / h", 100, 'left');
                } else {
                  var cityCache = this.Cache[cityName];
                  if (rowIdx > 2) {
                    rowIdx++;
                  }
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[resourceType]['Delta']), 80, 'right', null, ((cityCache["ProductionStopped"] || cityCache[resourceType]['Delta'] == 0) ? "red" : "white"));
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[resourceType]['ExtraBonusDelta']), 80, 'right', null, ((cityCache["PackagesStopped"] || cityCache[resourceType]['ExtraBonusDelta'] == 0) ? "red" : "white"));
                  if (resourceType != MaelstromTools.Statics.Dollar) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[resourceType]['POI']), 80, 'right', null, (cityCache[resourceType]['POI'] == 0 ? "red" : "white"));
                  } else {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact((cityCache[resourceType]['Delta'] + cityCache[resourceType]['ExtraBonusDelta'] + cityCache[resourceType]['POI']) / cityCache["BaseLevel"]), 80, 'right');
                  }
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[resourceType]['Delta'] + cityCache[resourceType]['ExtraBonusDelta'] + cityCache[resourceType]['POI']), 80, 'right', 'bold');
                }
                return rowIdx;
              } catch (e) {
                console.log("MaelstromTools.Production.createProductionLabels2: ", e);
              }
            },

            setWidgetLabels: function () {
              try {
                this.Widget.removeAll();

                var rowIdx = 1;
                var colIdx = 1;

                rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Labels-", MaelstromTools.Statics.Tiberium);
                rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Labels-", MaelstromTools.Statics.Crystal);
                rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Labels-", MaelstromTools.Statics.Power);
                rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Labels-", MaelstromTools.Statics.Dollar);

                colIdx++;
                for (var cityName in this.Cache) {
                  rowIdx = 1;
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, cityName, 80, 'right');

                  rowIdx = this.createProductionLabels2(rowIdx, colIdx, cityName, MaelstromTools.Statics.Tiberium);
                  rowIdx = this.createProductionLabels2(rowIdx, colIdx, cityName, MaelstromTools.Statics.Crystal);
                  rowIdx = this.createProductionLabels2(rowIdx, colIdx, cityName, MaelstromTools.Statics.Power);
                  rowIdx = this.createProductionLabels2(rowIdx, colIdx, cityName, MaelstromTools.Statics.Dollar);

                  MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, MaelstromTools.Util.getAccessBaseButton(cityName));
                }

                rowIdx = 1;
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx, "Total / h", 80, 'right', 'bold');

                rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Total-", MaelstromTools.Statics.Tiberium);
                rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Total-", MaelstromTools.Statics.Crystal);
                rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Total-", MaelstromTools.Statics.Power);
                rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Total-", MaelstromTools.Statics.Dollar);
              } catch (e) {
                console.log("MaelstromTools.Production.setWidgetLabels: ", e);
              }
            }
          }
        });

        // define RepairTime
        qx.Class.define("MaelstromTools.RepairTime", {
          type: "singleton",
          extend: MaelstromTools.DefaultObject,
          members: {

            updateCache: function () {
              try {
                MT_Cache.updateCityCache();
                this.Cache = Object();

                for (var cname in MT_Cache.Cities) {
                  var ncity = MT_Cache.Cities[cname].Object;
                  var RepLargest = '';

                  this.Cache[cname] = Object();
                  this.Cache[cname]["RepairTime"] = Object();
                  this.Cache[cname]["Repaircharge"] = Object();
                  this.Cache[cname]["Repaircharge"]["Smallest"] = 999999999;
                  this.Cache[cname]["RepairTime"]["Largest"] = 0;

                  this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Infantry] = ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false);
                  this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Vehicle] = ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false);
                  this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Aircraft] = ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false);
                  this.Cache[cname]["RepairTime"]["Maximum"] = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.RepairChargeInf);
                  this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Infantry] = ncity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeInf);
                  this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Vehicle] = ncity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeVeh);
                  this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Aircraft] = ncity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeAir);

                  if (this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Infantry] < this.Cache[cname]["Repaircharge"]["Smallest"]) {
                    this.Cache[cname]["Repaircharge"]["Smallest"] = this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Infantry];
                  }
                  if (this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Vehicle] < this.Cache[cname]["Repaircharge"]["Smallest"]) {
                    this.Cache[cname]["Repaircharge"]["Smallest"] = this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Vehicle];
                  }
                  if (this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Aircraft] < this.Cache[cname]["Repaircharge"]["Smallest"]) {
                    this.Cache[cname]["Repaircharge"]["Smallest"] = this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Aircraft];
                  }

                  if (this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Infantry] > this.Cache[cname]["RepairTime"]["Largest"]) {
                    this.Cache[cname]["RepairTime"]["Largest"] = this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Infantry];
                    RepLargest = "Infantry";
                  }
                  if (this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Vehicle] > this.Cache[cname]["RepairTime"]["Largest"]) {
                    this.Cache[cname]["RepairTime"]["Largest"] = this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Vehicle];
                    RepLargest = "Vehicle";
                  }
                  if (this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Aircraft] > this.Cache[cname]["RepairTime"]["Largest"]) {
                    this.Cache[cname]["RepairTime"]["Largest"] = this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Aircraft];
                    RepLargest = "Aircraft";
                  }

                  //PossibleAttacks and MaxAttacks fixes
                  var offHealth = ncity.GetOffenseConditionInPercent();
                  if (RepLargest !== '') {
                    this.Cache[cname]["RepairTime"]["LargestDiv"] = this.Cache[cname]["RepairTime"][RepLargest];
                    var i = Math.ceil(this.Cache[cname]["Repaircharge"].Smallest / this.Cache[cname]["RepairTime"].LargestDiv); //fix
                    var j = this.Cache[cname]["Repaircharge"].Smallest / this.Cache[cname]["RepairTime"].LargestDiv;
                    if (offHealth !== 100) { i--; i += '*';} // Decrease number of attacks by 1 when unit unhealthy. Additional visual info: asterisk when units aren't healthy
                    this.Cache[cname]["RepairTime"]["PossibleAttacks"] = i;
                    var k = this.Cache[cname]["RepairTime"].Maximum / this.Cache[cname]["RepairTime"].LargestDiv;
                    this.Cache[cname]["RepairTime"]["MaxAttacks"] = Math.ceil(k); //fix
                  } else {
                    this.Cache[cname]["RepairTime"]["LargestDiv"] = 0;
                    this.Cache[cname]["RepairTime"]["PossibleAttacks"] = 0;
                    this.Cache[cname]["RepairTime"]["MaxAttacks"] = 0;
                  }

                  var unitsData = ncity.get_CityUnitsData();
                  this.Cache[cname]["Base"] = Object();
                  this.Cache[cname]["Base"]["Level"] = MaelstromTools.Wrapper.GetBaseLevel(ncity);
                  this.Cache[cname]["Base"]["UnitLimit"] = ncity.GetBuildingSlotLimit(); //ncity.GetNumBuildings();
                  this.Cache[cname]["Base"]["TotalHeadCount"] = ncity.GetBuildingSlotCount();
                  this.Cache[cname]["Base"]["FreeHeadCount"] = this.Cache[cname]["Base"]["UnitLimit"] - this.Cache[cname]["Base"]["TotalHeadCount"];
                  this.Cache[cname]["Base"]["HealthInPercent"] = ncity.GetBuildingsConditionInPercent();

                  this.Cache[cname]["Offense"] = Object();
                  this.Cache[cname]["Offense"]["Level"] = (Math.floor(ncity.get_LvlOffense() * 100) / 100).toFixed(2);
                  this.Cache[cname]["Offense"]["UnitLimit"] = unitsData.get_UnitLimitOffense();
                  this.Cache[cname]["Offense"]["TotalHeadCount"] = unitsData.get_TotalOffenseHeadCount();
                  this.Cache[cname]["Offense"]["FreeHeadCount"] = unitsData.get_FreeOffenseHeadCount();
                  this.Cache[cname]["Offense"]["HealthInPercent"] = offHealth > 0 ? offHealth : 0;

                  this.Cache[cname]["Defense"] = Object();
                  this.Cache[cname]["Defense"]["Level"] = (Math.floor(ncity.get_LvlDefense() * 100) / 100).toFixed(2);
                  this.Cache[cname]["Defense"]["UnitLimit"] = unitsData.get_UnitLimitDefense();
                  this.Cache[cname]["Defense"]["TotalHeadCount"] = unitsData.get_TotalDefenseHeadCount();
                  this.Cache[cname]["Defense"]["FreeHeadCount"] = unitsData.get_FreeDefenseHeadCount();
                  this.Cache[cname]["Defense"]["HealthInPercent"] = ncity.GetDefenseConditionInPercent() > 0 ? ncity.GetDefenseConditionInPercent() : 0;

                  //console.log(ncity.get_CityUnitsData().get_UnitLimitOffense() + " / " + ncity.get_CityUnitsData().get_TotalOffenseHeadCount() + " = " + ncity.get_CityUnitsData().get_FreeOffenseHeadCount());
                  //console.log(ncity.get_CityUnitsData().get_UnitLimitDefense() + " / " + ncity.get_CityUnitsData().get_TotalDefenseHeadCount() + " = " + ncity.get_CityUnitsData().get_FreeDefenseHeadCount());
                }
              } catch (e) {
                console.log("MaelstromTools.RepairTime.updateCache: ", e);
              }
            },

            setWidgetLabels: function () {
              try {
                this.Widget.removeAll();
                var rowIdx = 1;

                rowIdx = this.createOverviewLabels(rowIdx);
                rowIdx = this.createRepairchargeLabels(rowIdx);
              } catch (e) {
                console.log("MaelstromTools.RepairTime.setWidgetLabels: ", e);
              }
            },

            createRepairchargeLabels: function (rowIdx) {
              try {
                var colIdx = 2;
                MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx++, "Repaircharges", null, 'left', null, null, 3);
                colIdx = 2;

                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Statics.Infantry, 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Statics.Vehicle, 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Statics.Aircraft, 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Repairtime", 80, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Attacks", 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Next at", 80, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Max+1 at", 80, 'right');

                rowIdx++;
                for (var cityName in this.Cache) {
                  var cityCache = this.Cache[cityName];
                  if (cityCache.Offense.UnitLimit == 0) {
                    continue;
                  }
                  colIdx = 1;
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityName, 80, 'left');

                  // Skip bases with no armies
                  if (cityCache.Offense.UnitLimit > 0) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatTimespan(cityCache.RepairTime.Infantry), 60, 'right', null, (cityCache.RepairTime.Infantry == cityCache.RepairTime.LargestDiv ? "yellow" : "white"));
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatTimespan(cityCache.RepairTime.Vehicle), 60, 'right', null, (cityCache.RepairTime.Vehicle == cityCache.RepairTime.LargestDiv ? "yellow" : "white"));
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatTimespan(cityCache.RepairTime.Aircraft), 60, 'right', null, (cityCache.RepairTime.Aircraft == cityCache.RepairTime.LargestDiv ? "yellow" : "white"));
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatTimespan(cityCache.Repaircharge.Smallest), 80, 'right');
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.RepairTime.PossibleAttacks + " / " + cityCache.RepairTime.MaxAttacks, 60, 'right', null, (cityCache.Offense.HealthInPercent !== 100 ? 'red' : null)); // mark red when unhealthy
                    var i = cityCache.RepairTime.LargestDiv * cityCache.RepairTime.PossibleAttacks;
                    var j = cityCache.RepairTime.LargestDiv * cityCache.RepairTime.MaxAttacks;
                    (i>0) ? MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatTimespan(i), 80, 'right', null, (i > cityCache.RepairTime.Maximum ? "yellow" : "white")) : colIdx++; /// yellow if more than Maximum RT
                    (j>0) ? MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatTimespan(j), 80, 'right') : colIdx++;
                  } else {
                    colIdx += 7;
                  }

                  colIdx += 4;
                  MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, MaelstromTools.Util.getAccessBaseButton(cityName, PerforceChangelist >= 376877 ? ClientLib.Data.PlayerAreaViewMode.pavmPlayerOffense : webfrontend.gui.PlayArea.PlayArea.modes.EMode_PlayerOffense));
                  rowIdx += 2;
                }

                return rowIdx;
              } catch (e) {
                console.log("MaelstromTools.RepairTime.createRepairchargeLabels: ", e);
              }
            },

            createOverviewLabels: function (rowIdx) {
              try {
                var colIdx = 2;

                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx, "Base", 60, 'right');
                colIdx += 3;
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx, "Defense", 60, 'right');
                colIdx += 3;
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx, "Army", 60, 'right');

                rowIdx++;
                colIdx = 2;

                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Level", 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Buildings", 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Health", 60, 'right');

                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Level", 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Buildings", 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Health", 60, 'right');

                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Level", 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Units", 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Health", 60, 'right');

                rowIdx++;
                for (var cityName in this.Cache) {
                  var cityCache = this.Cache[cityName];
                  colIdx = 1;

                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityName, 80, 'left');

                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Base.Level, 60, 'right');
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Base.TotalHeadCount + " / " + cityCache.Base.UnitLimit, 60, 'right', null, (cityCache.Base.FreeHeadCount >= 1 ? "red" : "white"));
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Base.HealthInPercent + "%", 60, 'right', null, (cityCache.Base.HealthInPercent < 25 ? "red" : (cityCache.Base.HealthInPercent < 100 ? "yellow" : "white")));

                  if (cityCache.Defense.UnitLimit > 0) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Defense.Level, 60, 'right');
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Defense.TotalHeadCount + " / " + cityCache.Defense.UnitLimit, 60, 'right', null, (cityCache.Defense.FreeHeadCount >= 5 ? "red" : (cityCache.Defense.FreeHeadCount >= 3 ? "yellow" : "white")));
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Defense.HealthInPercent + "%", 60, 'right', null, (cityCache.Defense.HealthInPercent < 25 ? "red" : (cityCache.Defense.HealthInPercent < 100 ? "yellow" : "white")));
                  } else {
                    colIdx += 3;
                  }

                  // Skip bases with no armies
                  if (cityCache.Offense.UnitLimit > 0) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Offense.Level, 60, 'right');
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Offense.TotalHeadCount + " / " + cityCache.Offense.UnitLimit, 60, 'right', null, (cityCache.Offense.FreeHeadCount >= 10 ? "red" : (cityCache.Offense.FreeHeadCount >= 5 ? "yellow" : "white")));
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Offense.HealthInPercent + "%", 60, 'right', null, (cityCache.Offense.HealthInPercent < 25 ? "red" : (cityCache.Offense.HealthInPercent < 100 ? "yellow" : "white")));
                  } else {
                    colIdx += 3;
                  }

                  MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, MaelstromTools.Util.getAccessBaseButton(cityName));
                  rowIdx += 2;
                }
                return rowIdx;
              } catch (e) {
                console.log("MaelstromTools.RepairTime.createOverviewLabels: ", e);
              }
            }

          }
        });

        // define ResourceOverview
        qx.Class.define("MaelstromTools.ResourceOverview", {
          type: "singleton",
          extend: MaelstromTools.DefaultObject,
          members: {
            Table: null,
            Model: null,

            updateCache: function () {
              try {
                MT_Cache.updateCityCache();
                this.Cache = Object();

                for (var cname in MT_Cache.Cities) {
                  var ncity = MT_Cache.Cities[cname].Object;
                  var mtime = ClientLib.Data.MainData.GetInstance().get_Time();

                  this.Cache[cname] = Object();
                  this.Cache[cname][MaelstromTools.Statics.Tiberium] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Tiberium);
                  this.Cache[cname][MaelstromTools.Statics.Tiberium + "Max"] = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.Tiberium);
                  this.Cache[cname][MaelstromTools.Statics.Tiberium + "Full"] = mtime.GetJSStepTime(ncity.GetResourceStorageFullStep(ClientLib.Base.EResourceType.Tiberium));
                  this.Cache[cname][MaelstromTools.Statics.Crystal] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Crystal);
                  this.Cache[cname][MaelstromTools.Statics.Crystal + "Max"] = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.Crystal);
                  this.Cache[cname][MaelstromTools.Statics.Crystal + "Full"] = mtime.GetJSStepTime(ncity.GetResourceStorageFullStep(ClientLib.Base.EResourceType.Crystal));
                  this.Cache[cname][MaelstromTools.Statics.Power] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Power);
                  this.Cache[cname][MaelstromTools.Statics.Power + "Max"] = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.Power);
                  this.Cache[cname][MaelstromTools.Statics.Power + "Full"] = mtime.GetJSStepTime(ncity.GetResourceStorageFullStep(ClientLib.Base.EResourceType.Power));
                }

              } catch (e) {
                console.log("MaelstromTools.ResourceOverview.updateCache: ", e);
              }
            },
/*
            setWidgetLabelsTable: function () {
              try {
                if (!this.Table) {
                  this.Widget.setLayout(new qx.ui.layout.HBox());

                  this.Model = new qx.ui.table.model.Simple();
                  this.Model.setColumns(["City", "Tib. Storage", "Tiberium", "Full", "Crystal", "Full", "Power", "Storage", "Full"]);
                  this.Table = new qx.ui.table.Table(this.Model);
                  this.Widget.add(this.Table, {
                    flex: 1
                  });
                }

                var Totals = Object();
                Totals[MaelstromTools.Statics.Tiberium] = 0;
                Totals[MaelstromTools.Statics.Crystal] = 0;
                Totals[MaelstromTools.Statics.Power] = 0;
                Totals[MaelstromTools.Statics.Tiberium + "Max"] = 0;
                Totals[MaelstromTools.Statics.Power + "Max"] = 0;

                var rowData = [];

                for (var cityName in this.Cache) {
                  var cityCache = this.Cache[cityName];

                  Totals[MaelstromTools.Statics.Tiberium] += cityCache[MaelstromTools.Statics.Tiberium];
                  Totals[MaelstromTools.Statics.Crystal] += cityCache[MaelstromTools.Statics.Crystal];
                  Totals[MaelstromTools.Statics.Power] += cityCache[MaelstromTools.Statics.Power];
                  Totals[MaelstromTools.Statics.Tiberium + "Max"] += cityCache[MaelstromTools.Statics.Tiberium + 'Max'];
                  Totals[MaelstromTools.Statics.Power + "Max"] += cityCache[MaelstromTools.Statics.Power + 'Max'];

                  rowData.push([
                    cityName,
                    MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Tiberium + 'Max']),
                    MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Tiberium]),
                    MaelstromTools.Wrapper.GetDateTimeString(cityCache[MaelstromTools.Statics.Tiberium + 'Full']),
                    MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Crystal]),
                    MaelstromTools.Wrapper.GetDateTimeString(cityCache[MaelstromTools.Statics.Crystal + 'Full']),
                    MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Power]),
                    MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Power + 'Max']),
                    MaelstromTools.Wrapper.GetDateTimeString(cityCache[MaelstromTools.Statics.Power + 'Full'])
                    ]);
                }
                rowData.push([
                  'Total resources',
                  MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Tiberium + 'Max']),
                  MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Tiberium]),
                  '',
                  MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Crystal]),
                  '',
                  MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Power]),
                  MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Power + 'Max']),
                  ''
                  ]);

                this.Model.setData(rowData);
              } catch (e) {
                console.log("MaelstromTools.ResourceOverview.setWidgetLabels: ", e);
              }
            },

            */
            setWidgetLabels: function () {
              try {
                this.Widget.removeAll();

                var first = true;
                var rowIdx = 2;
                var Totals = Object();
                var colIdx = 1;
                Totals[MaelstromTools.Statics.Tiberium] = 0;
                Totals[MaelstromTools.Statics.Crystal] = 0;
                Totals[MaelstromTools.Statics.Power] = 0;
                Totals[MaelstromTools.Statics.Tiberium + "Max"] = 0;
                Totals[MaelstromTools.Statics.Power + "Max"] = 0;

                for (var cityName in this.Cache) {
                  var cityCache = this.Cache[cityName];
                  Totals[MaelstromTools.Statics.Tiberium] += cityCache[MaelstromTools.Statics.Tiberium];
                  Totals[MaelstromTools.Statics.Crystal] += cityCache[MaelstromTools.Statics.Crystal];
                  Totals[MaelstromTools.Statics.Power] += cityCache[MaelstromTools.Statics.Power];
                  Totals[MaelstromTools.Statics.Tiberium + "Max"] += cityCache[MaelstromTools.Statics.Tiberium + 'Max'];
                  Totals[MaelstromTools.Statics.Power + "Max"] += cityCache[MaelstromTools.Statics.Power + 'Max'];

                  colIdx = 1;

                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityName, 100, 'left');
                  if (first) {
                    MaelstromTools.Util.addLabel(this.Widget, 1, colIdx, 'Max. storage', 80, 'left');
                  }
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Tiberium + 'Max']), 80, 'right');

                  if (first) {
                    MaelstromTools.Util.addImage(this.Widget, 1, colIdx, MaelstromTools.Util.getImage(MaelstromTools.Statics.Tiberium));
                  }
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Tiberium]), 60, 'right', null, (cityCache[MaelstromTools.Statics.Tiberium] >= cityCache[MaelstromTools.Statics.Tiberium + 'Max'] ? "red" : (cityCache[MaelstromTools.Statics.Tiberium] >= (0.75 * cityCache[MaelstromTools.Statics.Tiberium + 'Max']) ? "yellow" : "white")));

                  if (cityCache[MaelstromTools.Statics.Tiberium] < cityCache[MaelstromTools.Statics.Tiberium + 'Max']) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.GetDateTimeString(cityCache[MaelstromTools.Statics.Tiberium + 'Full']), 100, 'right', null, (cityCache[MaelstromTools.Statics.Tiberium] >= (0.75 * cityCache[MaelstromTools.Statics.Tiberium + 'Max']) ? "yellow" : "white"));
                  } else {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Storage full!", 100, 'right', null, "red");
                  }
                  if (first) {
                    MaelstromTools.Util.addImage(this.Widget, 1, colIdx, MaelstromTools.Util.getImage(MaelstromTools.Statics.Crystal));
                  }
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Crystal]), 60, 'right', null, (cityCache[MaelstromTools.Statics.Crystal] >= cityCache[MaelstromTools.Statics.Crystal + 'Max'] ? "red" : (cityCache[MaelstromTools.Statics.Crystal] >= (0.75 * cityCache[MaelstromTools.Statics.Crystal + 'Max']) ? "yellow" : "white")));

                  if (cityCache[MaelstromTools.Statics.Crystal] < cityCache[MaelstromTools.Statics.Crystal + 'Max']) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.GetDateTimeString(cityCache[MaelstromTools.Statics.Crystal + 'Full']), 100, 'right', null, (cityCache[MaelstromTools.Statics.Crystal] >= (0.75 * cityCache[MaelstromTools.Statics.Crystal + 'Max']) ? "yellow" : "white"));
                  } else {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Storage full!", 100, 'right', null, "red");
                  }

                  if (first) {
                    MaelstromTools.Util.addImage(this.Widget, 1, colIdx, MaelstromTools.Util.getImage(MaelstromTools.Statics.Power));
                  }
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Power]), 60, 'right', null, (cityCache[MaelstromTools.Statics.Power] >= cityCache[MaelstromTools.Statics.Power + 'Max'] ? "red" : (cityCache[MaelstromTools.Statics.Power] >= (0.75 * cityCache[MaelstromTools.Statics.Power + 'Max']) ? "yellow" : "white")));

                  if (first) {
                    MaelstromTools.Util.addLabel(this.Widget, 1, colIdx, 'Storage', 80, 'left');
                  }
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Power + 'Max']), 80, 'right');

                  if (cityCache[MaelstromTools.Statics.Power] < cityCache[MaelstromTools.Statics.Power + 'Max']) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.GetDateTimeString(cityCache[MaelstromTools.Statics.Power + 'Full']), 100, 'right', null, (cityCache[MaelstromTools.Statics.Power] >= (0.75 * cityCache[MaelstromTools.Statics.Power + 'Max']) ? "yellow" : "white"));
                  } else {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Storage full!", 100, 'right', null, "red");
                  }


                  MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, MaelstromTools.Util.getAccessBaseButton(cityName));
                  rowIdx++;
                  first = false;
                }

                colIdx = 1;
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Total resources", 100, 'left', 'bold');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Tiberium + 'Max']), 80, 'right', 'bold');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Tiberium]), 60, 'right', 'bold');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, Math.round(Totals[MaelstromTools.Statics.Tiberium] / Totals[MaelstromTools.Statics.Tiberium + 'Max'] * 100) + '%', 100, 'center', 'bold');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Crystal]), 60, 'right', 'bold');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, Math.round(Totals[MaelstromTools.Statics.Crystal] / Totals[MaelstromTools.Statics.Tiberium + 'Max'] * 100) + '%', 100, 'center', 'bold');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Power]), 60, 'right', 'bold');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Power + 'Max']), 80, 'right', 'bold');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, Math.round(Totals[MaelstromTools.Statics.Power] / Totals[MaelstromTools.Statics.Power + 'Max'] * 100) + '%', 100, 'center', 'bold');
              } catch (e) {
                console.log("MaelstromTools.ResourceOverview.setWidgetLabels: ", e);
              }
            }
          }
        });

        // define BaseStatus
        qx.Class.define("MaelstromTools.BaseStatus", {
          type: "singleton",
          extend: MaelstromTools.DefaultObject,
          members: {
            CityMenuButtons: null,

            //City.SetDedicatedSupport
            //City.RecallDedicatedSupport
            //City.get_SupportDedicatedBaseId
            //System.String get_SupportDedicatedBaseName ()
            updateCache: function () {
              try {
                MT_Cache.updateCityCache();
                this.Cache = Object();

                for (var cname in MT_Cache.Cities) {
                  var ncity = MT_Cache.Cities[cname].Object;
                  var player = ClientLib.Data.MainData.GetInstance().get_Player();
                  var supportData = ncity.get_SupportData();
                  //System.String get_PlayerName ()
                  this.Cache[cname] = Object();
                  // Movement lock
                  this.Cache[cname]["HasCooldown"] = ncity.get_hasCooldown();
                  this.Cache[cname]["CooldownEnd"] = Math.max(ncity.get_MoveCooldownEndStep(), ncity.get_MoveRestictionEndStep());
                  this.Cache[cname]["MoveCooldownEnd"] = ncity.get_MoveCooldownEndStep();
                  this.Cache[cname]["MoveLockdownEnd"] = ncity.get_MoveRestictionEndStep();
                  this.Cache[cname]["IsProtected"] = ncity.get_isProtected();
                  this.Cache[cname]["ProtectionEnd"] = ncity.get_ProtectionEndStep();
                  this.Cache[cname]["IsProtected"] = ncity.get_ProtectionEndStep();
                  this.Cache[cname]["IsAlerted"] = ncity.get_isAlerted();

                  // Supportweapon
                  if (supportData == null) {
                    this.Cache[cname]["HasSupportWeapon"] = false;
                  } else {
                    this.Cache[cname]["HasSupportWeapon"] = true;
                    if (ncity.get_SupportDedicatedBaseId() > 0) {
                      this.Cache[cname]["SupportedCityId"] = ncity.get_SupportDedicatedBaseId();
                      this.Cache[cname]["SupportedCityName"] = ncity.get_SupportDedicatedBaseName();
                      var coordId = ncity.get_SupportDedicatedBaseCoordId();
                      this.Cache[cname]["SupportedCityX"] = (coordId & 0xffff);
                      this.Cache[cname]["SupportedCityY"] = ((coordId >> 0x10) & 0xffff);
                      /*
                      var cityX = ncity.get_PosX();
                      var cityY = ncity.get_PosY();
                      
                      var mainData = ClientLib.Data.MainData.GetInstance();
                      var visRegion = ClientLib.Vis.VisMain.GetInstance().get_Region();

                      var gridW = visRegion.get_GridWidth();
                      var gridH = visRegion.get_GridHeight();
                      //console.log(cname);
                      //console.log("x: " + cityX + " y: " + cityY);

                      var worldObj = visRegion.GetObjectFromPosition((this.Cache[cname]["SupportedCityX"]*gridW), (this.Cache[cname]["SupportedCityY"]*gridH));
                      
                      //ClientLib.Vis.Region.RegionCity
                      if (worldObj == null) {
                        this.Cache[cname]["SupportTime"] = "";
                      } else {
                        console.log(cname);
                        //console.log(worldObj.CalibrationSupportDuration());
                        var weaponState = worldObj.get_SupportWeaponStatus();
                        
                        //console.log(this.calcDuration(ncity, worldObj));
                        var cities = ClientLib.Data.MainData.GetInstance().get_Cities();
                        cities.set_CurrentOwnCityId(ncity.get_Id());
                        var status = worldObj.get_SupportWeaponStatus();
                        var server = mainData.get_Server();
                        //console.log(worldObj.CalculateSupportCalibrationEndStep(worldObj.get_SupportData(), worldObj.get_SupportWeapon()));
                        console.log(status);
                        console.log(currStep);
                        this.Cache[cname]["SupportTime"] = mainData.get_Time().GetTimespanString(worldObj.CalculateSupportCalibrationEndStep(worldObj.get_SupportData(), worldObj.get_SupportWeapon()), currStep);
                        //status.Status&ClientLib.Vis.Region.ESupportWeaponStatus.Calibrating)==ClientLib.Vis.Region.ESupportWeaponStatus.Calibrating
                        var currStep = ClientLib.Data.MainData.GetInstance().get_Time().GetServerStep();
                        //this.Cache[cname]["SupportTime"] = webfrontend.Util.getTimespanString(ClientLib.Data.MainData.GetInstance().get_Time().GetTimeSpan(Math.max(0, status.CalibrationEndStep) - currStep), false);
                        //this.Cache[cname]["SupportTime"] = ClientLib.Data.MainData.GetInstance().get_Time().GetTimespanString(weaponState.CalibrationEndStep, currStep);
                        //this.Cache[cname]["SupportTime"] = webfrontend.Util.getTimespanString(ClientLib.Data.MainData.GetInstance().get_Time().GetTimeSpan(Math.max(0, worldObj.CalculateSupportCalibrationEndStep(worldObj.get_SupportData(), worldObj.get_SupportWeapon()) - currStep)), false);
                      //console.log(this.Cache[cname]["SupportTime"]);
                      }
                       */
                    } else { // prevent reference to undefined property ReferenceError
                      this.Cache[cname]["SupportedCityId"] = null;
                      this.Cache[cname]["SupportedCityName"] = null;
                      this.Cache[cname]["SupportedCityX"] = null;
                      this.Cache[cname]["SupportedCityY"] = null;
                    }
                    this.Cache[cname]["SupportRange"] = MaelstromTools.Wrapper.GetSupportWeaponRange(ncity.get_SupportWeapon());
                    var techName = ClientLib.Base.Tech.GetTechNameFromTechId(supportData.get_Type(), player.get_Faction());
                    this.Cache[cname]["SupportName"] = ClientLib.Base.Tech.GetProductionBuildingNameFromFaction(techName, player.get_Faction());
                    this.Cache[cname]["SupportLevel"] = supportData.get_Level();
                    //this.Cache[cname]["SupportBuilding"] = ncity.get_CityBuildingsData().GetUniqueBuildingByTechName(techName);
                    //console.log(this.Cache[cname]["SupportBuilding"]);
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.BaseStatus.updateCache: ", e);
              }
            },
            /*
            calcDuration: function(currOwnCity, regionCity) {
              var targetCity = MaelstromTools.Wrapper.GetCity(regionCity.get_Id());
              
              var supportBase=regionCity.get_SupportData();
              if(supportBase == null)
              {
                return -1;
              }
              var weapon=regionCity.get_SupportWeapon();
              if(weapon == null)
              {
                return -1;
              }
              if(currOwnCity.get_Id() == regionCity.get_Id())
              {
                if(supportBase.get_Magnitude() == 0) {
                  return -1;
                }
                return 0;
              }
              var dx=(currOwnCity.get_X() - targetCity.get_PosX());
              var dy=(currOwnCity.get_Y() - targetCity.get_PosY());
              var distance=((dx * dx) + (dy * dy));
              return Math.floor((weapon.pt + (weapon.tpf * Math.floor((Math.sqrt(distance) + 0.5)))));
            },*/

            setWidgetLabels: function () {
              try {
                this.Widget.removeAll();
                var rowIdx = 1;
                var colIdx = 2;

                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Cooldown", 85, 'left');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Protection", 85, 'left');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Available weapon", 140, 'left');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Calibrated on", 140, 'left');

                //colIdx++;
                var rowIdxRecall = rowIdx;
                var colIdxRecall = 0;
                var supportWeaponCount = 0;

                rowIdx++;
                for (var cityName in this.Cache) {
                  var cityCache = this.Cache[cityName];
                  colIdx = 1;

                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityName, 100, 'left', null, (cityCache.IsAlerted ? 'red' : null));

                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.GetStepTime(cityCache.CooldownEnd), 70, 'right');
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.GetStepTime(cityCache.ProtectionEnd), 70, 'right');

                  if (!cityCache.HasSupportWeapon) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "none", 140, 'left');
                    colIdx += 2;
                  } else {
                    supportWeaponCount++;
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.SupportName + " (" + cityCache.SupportLevel + ")", 140, 'left');

                    if (cityCache.SupportedCityId > 0) {
                      MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.SupportedCityName, 140, 'left');
                      colIdxRecall = colIdx;
                      MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, this.getRecallButton(cityName));
                    } else {
                      colIdx += 2;
                    }
                  }

                  MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, MaelstromTools.Util.getAccessBaseButton(cityName));
                  MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, MaelstromTools.Util.getFocusBaseButton(cityName));

                  rowIdx++;
                }

                if (supportWeaponCount > 0 && colIdxRecall > 0) {
                  MaelstromTools.Util.addElement(this.Widget, rowIdxRecall, colIdxRecall, this.getRecallAllButton());
                }
              } catch (e) {
                console.log("MaelstromTools.BaseStatus.setWidgetLabels: ", e);
              }
            },

            getRecallAllButton: function () {
              var button = new qx.ui.form.Button("Recall all").set({
                appearance: "button-text-small",
                toolTipText: "Recall all support weapons",
                width: 100,
                height: 20
              });
              button.addListener("execute", function (e) {
                MaelstromTools.Util.recallAllSupport();
              }, this);
              return button;
            },

            getRecallButton: function (cityName) {
              var button = new qx.ui.form.Button("Recall").set({
                appearance: "button-text-small",
                toolTipText: "Recall support to " + cityName,
                width: 100,
                height: 20
              });
              button.addListener("execute", function (e) {
                MaelstromTools.Util.recallSupport(cityName);
              }, this);
              return button;
            }
            /*
            getCalibrateAllOnSelectedBaseButton: function() {
              var button = new qx.ui.form.Button("Calibrate all weapons on selected base").set({
                appearance: "button-text-small",
                toolTipText: "Calibrate all weapons",
                width: 100,
                height: 20
              });
              button.addListener("execute", function(e){
                Util.calibrateWholeSupport(ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId());
              }, this);
              return button;
            }*/


          }
        });

        // define Statics
        qx.Class.define("MaelstromTools.Statics", {
          type: "static",
          statics: {
            Tiberium: 'Tiberium',
            Crystal: 'Crystal',
            Power: 'Power',
            Dollar: 'Dollar',
            Research: 'Research',
            Vehicle: "Vehicle",
            Aircraft: "Aircraft",
            Infantry: "Infantry",

            LootTypeName: function (ltype) {
              switch (ltype) {
                case ClientLib.Base.EResourceType.Tiberium:
                  return MaelstromTools.Statics.Tiberium;
                  break;
                case ClientLib.Base.EResourceType.Crystal:
                  return MaelstromTools.Statics.Crystal;
                  break;
                case ClientLib.Base.EResourceType.Power:
                  return MaelstromTools.Statics.Power;
                  break;
                case ClientLib.Base.EResourceType.Gold:
                  return MaelstromTools.Statics.Dollar;
                  break;
                default:
                  return "";
                  break;
              }
            }
          }
        });

        // define Util
        //ClientLib.Data.Cities.prototype.GetCityByCoord
        //ClientLib.Data.City.prototype.get_HasIncommingAttack
        qx.Class.define("MaelstromTools.Util", {
          type: "static",
          statics: {
            ArrayUnique: function (array) {
              var o = {};
              var l = array.length;
              r = [];
              for (var i = 0; i < l; i++) o[array[i]] = array[i];
              for (var i in o) r.push(o[i]);
              return r;
            },

            ArraySize: function (array) {
              var size = 0;
              for (var key in array)
              if (array.hasOwnProperty(key)) size++;
              return size;
            },

            addLabel: function (widget, rowIdx, colIdx, value, width, textAlign, font, color, colSpan) {
              try {
                var label = new qx.ui.basic.Label().set({
                  value: Lang.gt(value)
                });
                if (width) {
                  label.setWidth(width);
                }
                if (textAlign) {
                  label.setTextAlign(textAlign);
                }
                if (color) {
                  label.setTextColor(color);
                }
                if (font) {
                  label.setFont(font);
                }
                if (!colSpan || colSpan == 0) {
                  colSpan = 1;
                }

                widget.add(label, {
                  row: rowIdx,
                  column: colIdx,
                  colSpan: colSpan
                });
              } catch (e) {
                console.log("MaelstromTools.Util.addLabel: ", e);
              }
            },

            addElement: function (widget, rowIdx, colIdx, element, colSpan) {
              try {
                if (!colSpan || colSpan == 0) {
                  colSpan = 1;
                }
                widget.add(element, {
                  row: rowIdx,
                  column: colIdx,
                  colSpan: colSpan
                });
              } catch (e) {
                console.log("MaelstromTools.Util.addElement: ", e);
              }
            },

            addImage: function (widget, rowIdx, colIdx, image) {
              try {
                widget.add(image, {
                  row: rowIdx,
                  column: colIdx
                });
              } catch (e) {
                console.log("MaelstromTools.Util.addImage: ", e);
              }
            },

            getImage: function (name) {
              var image = new qx.ui.basic.Image(MT_Base.images[name]);
              image.setScale(true);
              image.setWidth(20);
              image.setHeight(20);
              return image;
            },

            getAccessBaseButton: function (cityName, viewMode) {
              try {
                var cityButton = new qx.ui.form.Button(null, MT_Base.images["AccessBase"]).set({
                  appearance: "button-detailview-small",
                  toolTipText: Lang.gt("Access") + " " + cityName,
                  width: 20,
                  height: 20,
                  marginLeft: 5
                });
                cityButton.setUserData("cityId", MT_Cache.Cities[cityName].ID);
                cityButton.setUserData("viewMode", viewMode);
                cityButton.addListener("execute", function (e) {
                  MaelstromTools.Util.accessBase(e.getTarget().getUserData("cityId"), e.getTarget().getUserData("viewMode"));
                }, this);
                return cityButton;
              } catch (e) {
                console.log("MaelstromTools.Util.getAccessBaseButton: ", e);
              }
            },

            getFocusBaseButton: function (cityName) {
              try {
                var cityButton = new qx.ui.form.Button(null, MT_Base.images["FocusBase"]).set({
                  appearance: "button-detailview-small",
                  toolTipText: Lang.gt("Focus on") + " " + cityName,
                  width: 20,
                  height: 20,
                  marginLeft: 5
                });
                cityButton.setUserData("cityId", MT_Cache.Cities[cityName].ID);
                cityButton.addListener("execute", function (e) {
                  MaelstromTools.Util.focusBase(e.getTarget().getUserData("cityId"));
                }, this);
                return cityButton;
              } catch (e) {
                console.log("MaelstromTools.Util.getFocusBaseButton: ", e);
              }
            },

            accessBase: function (cityId, viewMode) {
              try {
                if (cityId > 0) {
                  var ncity = MaelstromTools.Wrapper.GetCity(cityId);

                  if (ncity != null && !ncity.get_IsGhostMode()) {
                    if (viewMode) {
                      webfrontend.gui.UtilView.openVisModeInMainWindow(viewMode, cityId, false);
                    } else {
                      webfrontend.gui.UtilView.openCityInMainWindow(cityId);
                    }
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.Util.accessBase: ", e);
              }
            },
            focusBase: function (cityId) {
              try {
                if (cityId > 0) {
                  var ncity = MaelstromTools.Wrapper.GetCity(cityId);

                  if (ncity != null && !ncity.get_IsGhostMode()) {
                    webfrontend.gui.UtilView.centerCityOnRegionViewWindow(cityId);
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.Util.focusBase: ", e);
              }
            },

            recallSupport: function (cityName) {
              try {
                var ncity = MT_Cache.Cities[cityName]["Object"];
                ncity.RecallDedicatedSupport();
              } catch (e) {
                console.log("MaelstromTools.Util.recallSupport: ", e);
              }
            },

            recallAllSupport: function () {
              try {
                MT_Cache.updateCityCache();
                for (var cityName in MT_Cache.Cities) {
                  var ncity = MT_Cache.Cities[cityName]["Object"];
                  ncity.RecallDedicatedSupport();
                }
              } catch (e) {
                console.log("MaelstromTools.Util.recallAllSupport: ", e);
              }
            },

            checkIfSupportIsAllowed: function (selectedBase) {
              try {
                if (selectedBase.get_VisObjectType() != ClientLib.Vis.VisObject.EObjectType.RegionCityType) {
                  return false;
                }
                if (selectedBase.get_Type() != ClientLib.Vis.Region.RegionCity.ERegionCityType.Own && selectedBase.get_Type() != ClientLib.Vis.Region.RegionCity.ERegionCityType.Alliance) {
                  return false;
                }
                return true;
              } catch (e) {
                console.log("MaelstromTools.Util.checkIfSupportIsAllowed: ", e);
                return false;
              }
            },

            calibrateWholeSupportOnSelectedBase: function () {
              if (this.checkIfSupportIsAllowed(MT_Cache.SelectedBaseForMenu)) {
                this.calibrateWholeSupport(MT_Cache.SelectedBaseForMenu);
              }
            },

            calibrateWholeSupport: function (targetRegionCity) {
              try {
                MT_Cache.updateCityCache();
                for (var cityName in MT_Cache.Cities) {
                  var ncity = MT_Cache.Cities[cityName]["Object"];
                  //var targetCity = MaelstromTools.Wrapper.GetCity(targetCityId);
                  var weapon = ncity.get_SupportWeapon();

                  //console.log("checking support weapon for " + ncity.get_Name() + " calibrating on " + targetRegionCity.get_Name());

                  if (targetRegionCity != null && weapon != null) {
                    //console.log("city at " + ncity.get_X() + " / " + ncity.get_Y());
                    //console.log("targetRegionCity at " + targetRegionCity.get_RawX() + " / " + targetRegionCity.get_RawY());
                    //var distance = ClientLib.Base.Util.CalculateDistance(ncity.get_X(), ncity.get_Y(), targetRegionCity.get_RawX(), targetRegionCity.get_RawY());
                    var dx = (ncity.get_X() - targetRegionCity.get_RawX());
                    var dy = (ncity.get_Y() - targetRegionCity.get_RawY());
                    var distance = ((dx * dx) + (dy * dy));
                    var range = MaelstromTools.Wrapper.GetSupportWeaponRange(weapon);
                    //console.log("distance is " + distance);
                    //console.log("range isy " + range*range);
                    if (distance <= (range * range)) {
                      ncity.SetDedicatedSupport(targetRegionCity.get_Id());
                    }
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.Util.calibrateWholeSupport: ", e);
              }
            },

            // visCity : ClientLib.Vis.Region.RegionObject
            getResources: function (visCity) { // to verifier against PerforceChangelist>=376877
              try {
                var loot = new Object();
                if (visCity.get_X() < 0 || visCity.get_Y() < 0) {
                  loot["LoadState"] = 0;
                  return loot;
                }
                var currentOwnCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();

                var distance = ClientLib.Base.Util.CalculateDistance(currentOwnCity.get_X(), currentOwnCity.get_Y(), visCity.get_RawX(), visCity.get_RawY());
                var maxAttackDistance = ClientLib.Data.MainData.GetInstance().get_Server().get_MaxAttackDistance();
                if (distance > maxAttackDistance) {
                  loot["LoadState"] = -1;
                  return loot;
                }

                var ncity = MaelstromTools.Wrapper.GetCity(visCity.get_Id());
                /* ClientLib.Data.CityBuildings */
                //var cityBuildings = ncity.get_CityBuildingsData();
                var cityUnits = ncity.get_CityUnitsData();

                //var buildings = MaelstromTools.Wrapper.GetBuildings(cityBuildings);
                var buildings = ncity.get_Buildings().d;
                var defenseUnits = MaelstromTools.Wrapper.GetDefenseUnits(cityUnits);
                //var defenseUnits = MaelstromTools.Wrapper.GetDefenseUnits();

                /*for(var u in buildings) {
              console.log(buildings[u].get_MdbBuildingId());
              console.log("----------------");
            }*/

                var buildingLoot = MaelstromTools.Util.getResourcesPart(buildings);
                //var buildingLoot2 = MaelstromTools.Util.getResourcesPart(this.collectBuildings(ncity));

                var unitLoot = MaelstromTools.Util.getResourcesPart(defenseUnits);

                loot[MaelstromTools.Statics.Tiberium] = buildingLoot[ClientLib.Base.EResourceType.Tiberium] + unitLoot[ClientLib.Base.EResourceType.Tiberium];
                loot[MaelstromTools.Statics.Crystal] = buildingLoot[ClientLib.Base.EResourceType.Crystal] + unitLoot[ClientLib.Base.EResourceType.Crystal];
                loot[MaelstromTools.Statics.Dollar] = buildingLoot[ClientLib.Base.EResourceType.Gold] + unitLoot[ClientLib.Base.EResourceType.Gold];
                loot[MaelstromTools.Statics.Research] = buildingLoot[ClientLib.Base.EResourceType.ResearchPoints] + unitLoot[ClientLib.Base.EResourceType.ResearchPoints];
                loot["Factor"] = loot[MaelstromTools.Statics.Tiberium] + loot[MaelstromTools.Statics.Crystal] + loot[MaelstromTools.Statics.Dollar] + loot[MaelstromTools.Statics.Research];
                loot["CPNeeded"] = currentOwnCity.CalculateAttackCommandPointCostToCoord(ncity.get_X(), ncity.get_Y());
                loot["LoadState"] = (loot["Factor"] > 0 ? 1 : 0);
                loot["Total"] = loot[MaelstromTools.Statics.Research] + loot[MaelstromTools.Statics.Tiberium] + loot[MaelstromTools.Statics.Crystal] + loot[MaelstromTools.Statics.Dollar];

                /*console.log("Building loot");
                console.log( buildingLoot[ClientLib.Base.EResourceType.Tiberium] + " vs " +  buildingLoot2[ClientLib.Base.EResourceType.Tiberium]);
                console.log( buildingLoot[ClientLib.Base.EResourceType.Crystal] + " vs " +  buildingLoot2[ClientLib.Base.EResourceType.Crystal]);
                console.log( buildingLoot[ClientLib.Base.EResourceType.Gold] + " vs " +  buildingLoot2[ClientLib.Base.EResourceType.Gold]);
                console.log( buildingLoot[ClientLib.Base.EResourceType.ResearchPoints] + " vs " +  buildingLoot2[ClientLib.Base.EResourceType.ResearchPoints]);
                console.log("-------------");*/
                return loot;
              } catch (e) {
                console.log("MaelstromTools.Util.getResources", e);
              }
            },
            /*
            collectBuildings: function(ncity) {
              var cityBuildings = ncity.get_CityBuildingsData();
              var buildings = new Array();
              var count = 0;
              // ncity.GetNumBuildings()
              for(var i = 0; i < 100000; i++) {
                var building = cityBuildings.GetBuildingByMDBId(i);
                if(!building) {
                  continue;
                }
                
                //console.log(building.get_TechName() + " - " + ncity.get_CityFaction() + " - " + ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(building.get_TechName(), ncity.get_CityFaction()) + " at lvl " + building.get_CurrentLevel());
                buildings.push(building);
              //buildings[count++] = building;
              }
              return buildings; //MaelstromTools.Util.ArrayUnique(buildings);
            },*/

            getResourcesPart: function (cityEntities) {
              try {
                var loot = [0, 0, 0, 0, 0, 0, 0, 0];
                if (cityEntities == null) {
                  return loot;
                }

                var objcityEntities = [];
                if (PerforceChangelist >= 376877) { //new
                  for (var o in cityEntities) objcityEntities.push(cityEntities[o]);
                } else { //old
                  for (var i = 0; i < cityEntities.length; i++) objcityEntities.push(cityEntities[i]);
                }

                for (var i = 0; i < objcityEntities.length; i++) {
                  var cityEntity = objcityEntities[i];
                  var unitLevelRequirements = MaelstromTools.Wrapper.GetUnitLevelRequirements(cityEntity);

                  for (var x = 0; x < unitLevelRequirements.length; x++) {
                    loot[unitLevelRequirements[x].Type] += unitLevelRequirements[x].Count * cityEntity.get_HitpointsPercent();
                    if (cityEntity.get_HitpointsPercent() < 1.0) {
                      // destroyed

                    }
                  }
                }

                return loot;
              } catch (e) {
                console.log("MaelstromTools.Util.getResourcesPart", e);
              }
            }

            /*
            findBuildings: function(city) {
              for (var k in city) {
                if ((typeof(city[k]) == "object") && city[k] && city[k] && 0 in city[k]) {
                  if ((typeof(city[k][0]) == "object")  && city[k][0] && "BuildingDBId" in city[k][0]) {
                    return city[k];
                  }
                }
              }
              return [];
            }*/
          }
        });

        // define Wrapper
        qx.Class.define("MaelstromTools.Wrapper", {
          type: "static",
          statics: {
            GetStepTime: function (step, defaultString) {
              if (!defaultString) {
                defaultString = "";
              }
              var endTime = ClientLib.Data.MainData.GetInstance().get_Time().GetTimespanString(step, ClientLib.Data.MainData.GetInstance().get_Time().GetServerStep());
              if (endTime == "00:00") {
                return defaultString;
              }
              return endTime;
            },

            FormatNumbersCompact: function (value) {
              if (PerforceChangelist >= 387751) { //new
                return phe.cnc.gui.util.Numbers.formatNumbersCompact(value);
              } else { //old
                return webfrontend.gui.Util.formatNumbersCompact(value);
              }
            },

            GetDateTimeString: function (value) {
                return phe.cnc.Util.getDateTimeString(value);
            },

            FormatTimespan: function (value) {
              return ClientLib.Vis.VisMain.FormatTimespan(value);
            },

            GetSupportWeaponRange: function (weapon) {
              return weapon.r;
            },

            GetCity: function (cityId) {
              return ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(cityId);
            },

            RepairAll: function (ncity, visMode) {
              var oldMode = ClientLib.Vis.VisMain.GetInstance().get_Mode();
              ClientLib.Vis.VisMain.GetInstance().set_Mode(visMode);
              ncity.RepairAll();
              ClientLib.Vis.VisMain.GetInstance().set_Mode(oldMode);
            },

            CanRepairAll: function (ncity, viewMode) {
              try {
                /*var oldMode = ClientLib.Vis.VisMain.GetInstance().get_Mode();
                ClientLib.Vis.VisMain.GetInstance().set_Mode(visMode);
                var retVal = ncity.CanRepairAll();
                ClientLib.Vis.VisMain.GetInstance().set_Mode(oldMode);
                return retVal;*/

                var repairData = ncity.get_CityRepairData();
                var myRepair = repairData.CanRepair(0, viewMode);
                repairData.UpdateCachedFullRepairAllCost(viewMode);
                return ((myRepair != null) && (!ncity.get_IsLocked() || (viewMode != ClientLib.Vis.Mode.ArmySetup)));

                return false;
              } catch (e) {
                console.log("MaelstromTools.Wrapper.CanRepairAll: ", e);
                return false;
              }
            },
            /*GetBuildings: function (cityBuildings) {
              if (PerforceChangelist >= 376877) { //new
                return (cityBuildings.get_Buildings() != null ? cityBuildings.get_Buildings().d : null);
              } else { //old
                return (cityBuildings.get_Buildings() != null ? cityBuildings.get_Buildings().l : null);
              }
            },*/
            GetDefenseUnits: function (cityUnits) {
            //GetDefenseUnits: function () {
              if (PerforceChangelist >= 392583) { //endgame patch
                return (cityUnits.get_DefenseUnits() != null ? cityUnits.get_DefenseUnits().d : null);
              } else { //old
                var defenseObjects = [];
                for (var x = 0; x < 9; x++) {
                  for (var y = 0; y < 8; y++) {
                    var defenseObject = ClientLib.Vis.VisMain.GetInstance().get_DefenseSetup().GetDefenseObjectFromPosition((x * ClientLib.Vis.VisMain.GetInstance().get_City().get_GridWidth()),(y * ClientLib.Vis.VisMain.GetInstance().get_City().get_GridHeight()));
                    if (defenseObject !== null && defenseObject.get_CityEntity() !== null) {
                      defenseObjects.push(defenseObject.get_UnitDetails());
                    }
                  }
                }
                return defenseObjects;
              }
            },
            GetUnitLevelRequirements: function (cityEntity) {
              if (PerforceChangelist >= 376877) { //new
                return (cityEntity.get_UnitLevelRepairRequirements() != null ? cityEntity.get_UnitLevelRepairRequirements() : null);
              } else { //old
                return (cityEntity.get_UnitLevelRequirements() != null ? cityEntity.get_UnitLevelRequirements() : null);
              }
            },

            GetBaseLevel: function (ncity) {
              return (Math.floor(ncity.get_LvlBase() * 100) / 100).toFixed(2);
            }
            /*,
            
            GetPointsByLevelWithThresholds: function (_levelThresholds,_levelFactors,_iLevel) {
              var result=0;
              var lastLevel=_iLevel;
              if(_levelThresholds.length != _levelFactors.length) {
                return 0;
              }
              for (var i=(_levelThresholds.length - 1); (i >= 0); i--) {
                var threshold=(_levelThresholds[i] - 1);
                if(lastLevel >= threshold) {
                  result += ((lastLevel - threshold) * _levelFactors[i]);
                  lastLevel=threshold;
                }
              }
              return result;
            },
            GetArmyPoints: function(_iLevel) {
              var server = ClientLib.Data.MainData.GetInstance().get_Server();
              var m_iArmyPointsPerLevelThresholds = server.get_ArmyPointsPerLevelThresholds();
              var m_fArmyPointsPerLevel = server.get_ArmyPointsPerLevel();
              _iLevel += 4;
              var armyPoints = MaelstromTools.Wrapper.GetPointsByLevelWithThresholds(m_iArmyPointsPerLevelThresholds, m_fArmyPointsPerLevel, _iLevel);
              return Math.min(armyPoints, server.get_MaxArmyPoints());
            },
            
            GetBuilding: function(ncity, techName) {
              return ncity.get_CityBuildingsData().GetUniqueBuildingByTechName(techName)
            },
            
            GetCommandCenter: function(ncity) {
              //var techName = ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(ClientLib.Base.ETechName.Command_Center, ClientLib.Data.MainData.GetInstance().get_Player().get_Faction());

              return MaelstromTools.Wrapper.GetBuilding(ncity, ClientLib.Base.ETechName.Command_Center);
            // conyard return this.GetBuildingCondition$0(ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction$0(0, ClientLib.Data.MainData.GetInstance$9().get_Player$2().get_Faction$2()));
            // ClientLib.Data.City.prototype.GetOffenseConditionInPercent=ClientLib.Data.City.prototype.GetOffenseConditionInPercent$0;
            }*/
          }
        });

        // define LocalStorage
        qx.Class.define("MaelstromTools.LocalStorage", {
          type: "static",
          statics: {
            isSupported: function () {
              return typeof (Storage) !== "undefined";
            },
            set: function (key, value) {
              try {
                if (MaelstromTools.LocalStorage.isSupported()) {
                  localStorage["CCTA_MaelstromTools_" + key] = JSON.stringify(value);
                }
              } catch (e) {
                console.log("MaelstromTools.LocalStorage.set: ", e);
              }
            },
            get: function (key, defaultValueIfNotSet) {
              try {
                if (MaelstromTools.LocalStorage.isSupported()) {
                  if (localStorage["CCTA_MaelstromTools_" + key] != null && localStorage["CCTA_MaelstromTools_" + key] != 'undefined') {
                    return JSON.parse(localStorage["CCTA_MaelstromTools_" + key]);
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.LocalStorage.get: ", e);
              }
              return defaultValueIfNotSet;
            },
            clearAll: function () {
              try {
                if (!MaelstromTools.LocalStorage.isSupported()) {
                  return;
                }
                for (var key in localStorage) {
                  if (key.indexOf("CCTA_MaelstromTools_") == 0) {
                    localStorage.removeItem(key);
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.LocalStorage.clearAll: ", e);
              }
            }
          }
        });

        // define Cache
        qx.Class.define("MaelstromTools.Cache", {
          type: "singleton",
          extend: qx.core.Object,
          members: {
            CityCount: 0,
            Cities: null,
            SelectedBaseForMenu: null,
            SelectedBaseResources: null,
            SelectedBaseForLoot: null,

            updateCityCache: function () {
              try {
                this.CityCount = 0;
                this.Cities = Object();

                var cities = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities();
                for (var cindex in cities.d) {
                  this.CityCount++;
                  var ncity = MaelstromTools.Wrapper.GetCity(cindex);
                  var ncityName = ncity.get_Name();
                  this.Cities[ncityName] = Object();
                  this.Cities[ncityName]["ID"] = cindex;
                  this.Cities[ncityName]["Object"] = ncity;
                }
              } catch (e) {
                console.log("MaelstromTools.Cache.updateCityCache: ", e);
              }
            },

            updateLoot: function (visCity) {
              var cityId = visCity.get_Id();

              if (this.SelectedBaseForLoot != null && cityId == this.SelectedBaseForLoot.get_Id() && this.SelectedBaseResources != null && this.SelectedBaseResources["LoadState"] > 0) {
                return -2;
              }
              this.SelectedBaseForLoot = visCity;
              this.SelectedBaseResources = MaelstromTools.Util.getResources(visCity);
              return this.SelectedBaseResources["LoadState"];
            }
          }
        });

        // define HuffyTools.ImageRender
        qx.Class.define("HuffyTools.ImageRender", {
          extend: qx.ui.table.cellrenderer.AbstractImage,
          construct: function (width, height) {
            this.base(arguments);
            if (width) {
              this.__imageWidth = width;
            }
            if (height) {
              this.__imageHeight = height;
            }
            this.__am = qx.util.AliasManager.getInstance();
          },
          members: {
            __am: null,
            __imageHeight: 16,
            __imageWidth: 16,
            // overridden
            _identifyImage: function (cellInfo) {
              var imageHints = {
                imageWidth: this.__imageWidth,
                imageHeight: this.__imageHeight
              };
              if (cellInfo.value == "") {
                imageHints.url = null;
              } else {
                imageHints.url = this.__am.resolve(cellInfo.value);
              }
              imageHints.tooltip = cellInfo.tooltip;
              return imageHints;
            }
          },
          destruct: function () {
            this.__am = null;
          }
        });

        // define HuffyTools.ReplaceRender
        qx.Class.define("HuffyTools.ReplaceRender", {
          extend: qx.ui.table.cellrenderer.Default,
          properties: {
            replaceFunction: {
              check: "Function",
              nullable: true,
              init: null
            }
          },
          members: {
            // overridden
            _getContentHtml: function (cellInfo) {
              var value = cellInfo.value;
              var replaceFunc = this.getReplaceFunction();
              // use function
              if (replaceFunc) {
                cellInfo.value = replaceFunc(value);
              }
              return qx.bom.String.escape(this._formatValue(cellInfo));
            }
          }
        });

        qx.Class.define("HuffyTools.CityCheckBox", {
          extend: qx.ui.form.CheckBox,
          members: {
            HT_CityID: null
          }
        });

        // define HuffyTools.UpgradePriorityGUI
        qx.Class.define("HuffyTools.UpgradePriorityGUI", {
          type: "singleton",
          extend: MaelstromTools.DefaultObject,
          members: {
            HT_TabView: null,
            HT_Options: null,
            HT_ShowOnlyTopBuildings: null,
            HT_ShowOnlyAffordableBuildings: null,
            HT_CityBuildings: null,
            HT_Pages: null,
            HT_Tables: null,
            HT_Models: null,
            HT_SelectedResourceType: null,
            BuildingList: null,
            upgradeInProgress: null,
            init: function () {
              /*
              Done:
              - Added cost per gain to the lists
              - Added building coordinates to the lists
              - Only display the top affordable and not affordable building
              - Persistent filter by city, top and affordable per resource type
              - Reload onTabChange for speed optimization
              - Estimated time until upgrade is affordable
              
              ToDo:
              - let the user decide to sort by colums he like i.e. timefactor or cost/gain and save it in the configuration
              - integrate buttons to transfer resources ?

               */
              try {
                this.HT_SelectedResourceType = -1;
                this.IsTimerEnabled = false;
                this.upgradeInProgress = false;

                this.HT_TabView = new qx.ui.tabview.TabView();
                this.HT_TabView.set({
                  contentPadding: 0,
                  appearance: "tabview",
                  margin: 5,
                  barPosition: 'left'
                });
                this.Widget = new qx.ui.tabview.Page("UpgradePriority");
                this.Widget.setPadding(0);
                this.Widget.setMargin(0);
                this.Widget.setBackgroundColor("#BEC8CF");
                this.Widget.setLayout(new qx.ui.layout.VBox(2));
                //this.Widget.add(this.HT_Options);
                this.Widget.add(this.HT_TabView, {
                  flex: 1
                });
                this.Window.setPadding(0);
                this.Window.set({
                  resizable: true
                });

                this.Window.removeAll();
                this.Window.add(this.Widget);

                this.BuildingList = new Array;
                this.HT_Models = new Array;
                this.HT_Tables = new Array;
                this.HT_Pages = new Array;

                this.createTabPage(ClientLib.Base.EResourceType.Tiberium);
                this.createTable(ClientLib.Base.EResourceType.Tiberium);
                this.HT_Tables[ClientLib.Base.EResourceType.Tiberium].addListener("cellClick", function (e) {
                  this.upgradeBuilding(e, ClientLib.Base.EResourceType.Tiberium);
                }, this);


                this.createTabPage(ClientLib.Base.EResourceType.Crystal);
                this.createTable(ClientLib.Base.EResourceType.Crystal);
                this.HT_Tables[ClientLib.Base.EResourceType.Crystal].addListener("cellClick", function (e) {
                  this.upgradeBuilding(e, ClientLib.Base.EResourceType.Crystal);
                }, this);

                this.createTabPage(ClientLib.Base.EResourceType.Power);
                this.createTable(ClientLib.Base.EResourceType.Power);
                this.HT_Tables[ClientLib.Base.EResourceType.Power].addListener("cellClick", function (e) {
                  this.upgradeBuilding(e, ClientLib.Base.EResourceType.Power);
                }, this);

                this.createTabPage(ClientLib.Base.EResourceType.Gold);
                this.createTable(ClientLib.Base.EResourceType.Gold);
                this.HT_Tables[ClientLib.Base.EResourceType.Gold].addListener("cellClick", function (e) {
                  this.upgradeBuilding(e, ClientLib.Base.EResourceType.Gold);
                }, this);


                MT_Cache.updateCityCache();
                this.HT_Options = new Array();
                this.HT_ShowOnlyTopBuildings = new Array();
                this.HT_ShowOnlyAffordableBuildings = new Array();
                this.HT_CityBuildings = new Array();
                for (var mPage in this.HT_Pages) {
                  this.createOptions(mPage);
                  this.HT_Pages[mPage].add(this.HT_Options[mPage]);
                  this.HT_Pages[mPage].add(this.HT_Tables[mPage], {
                    flex: 1
                  });
                  this.HT_TabView.add(this.HT_Pages[mPage]);
                }

                // Zeigen wir Dollars an !
                this.HT_TabView.setSelection([this.HT_TabView.getChildren()[2]]);
                this.HT_SelectedResourceType = ClientLib.Base.EResourceType.Gold;
              } catch (e) {
                console.log("HuffyTools.UpgradePriority.init: ", e);
              }
            },
            createOptions: function (eType) {
              var oBox = new qx.ui.layout.Flow();
              var oOptions = new qx.ui.container.Composite(oBox);
              oOptions.setMargin(5);
              this.HT_ShowOnlyTopBuildings[eType] = new qx.ui.form.CheckBox(Lang.gt("display only top buildings"));
              this.HT_ShowOnlyTopBuildings[eType].setMargin(5);
              this.HT_ShowOnlyTopBuildings[eType].setValue(MaelstromTools.LocalStorage.get("UGL_TOPBUILDINGS_" + eType, true));
              this.HT_ShowOnlyTopBuildings[eType].addListener("execute", this.CBChanged, this);
              oOptions.add(this.HT_ShowOnlyTopBuildings[eType], {
                left: 10,
                top: 10
              });
              this.HT_ShowOnlyAffordableBuildings[eType] = new qx.ui.form.CheckBox(Lang.gt("display only affordable buildings"));
              this.HT_ShowOnlyAffordableBuildings[eType].setMargin(5);
              this.HT_ShowOnlyAffordableBuildings[eType].setValue(MaelstromTools.LocalStorage.get("UGL_AFFORDABLE_" + eType, true));
              this.HT_ShowOnlyAffordableBuildings[eType].addListener("execute", this.CBChanged, this);
              oOptions.add(this.HT_ShowOnlyAffordableBuildings[eType], {
                left: 10,
                top: 10,
                lineBreak: true
              });
              this.HT_CityBuildings[eType] = new Array();
              for (var cname in MT_Cache.Cities) {
                var oCity = MT_Cache.Cities[cname].Object;
                var oCityBuildings = new HuffyTools.CityCheckBox(cname);
                oCityBuildings.HT_CityID = oCity.get_Id();
                oCityBuildings.setMargin(5);
                oCityBuildings.setValue(MaelstromTools.LocalStorage.get("UGL_CITYFILTER_" + eType + "_" + oCity.get_Id(), true));
                oCityBuildings.addListener("execute", this.CBChanged, this);
                oOptions.add(oCityBuildings, {
                  left: 10,
                  top: 10
                });
                this.HT_CityBuildings[eType][cname] = oCityBuildings;
              }
              this.HT_Options[eType] = oOptions;
            },
            createTable: function (eType) {
              try {
                this.HT_Models[eType] = new qx.ui.table.model.Simple();
                this.HT_Models[eType].setColumns(["ID", Lang.gt("City"), Lang.gt("Type (coord)"), Lang.gt("to Level"), Lang.gt("Gain/h"), Lang.gt("Factor"), Lang.gt("Tiberium"), Lang.gt("Power"), Lang.gt("Tib/gain"), Lang.gt("Pow/gain"), Lang.gt("ETA"), Lang.gt("Upgrade"), "State"]);
                this.HT_Tables[eType] = new qx.ui.table.Table(this.HT_Models[eType]);
                this.HT_Tables[eType].setColumnVisibilityButtonVisible(false);
                this.HT_Tables[eType].setColumnWidth(0, 0);
                this.HT_Tables[eType].setColumnWidth(1, 90);
                this.HT_Tables[eType].setColumnWidth(2, 120);
                this.HT_Tables[eType].setColumnWidth(3, 55);
                this.HT_Tables[eType].setColumnWidth(4, 70);
                this.HT_Tables[eType].setColumnWidth(5, 60);
                this.HT_Tables[eType].setColumnWidth(6, 70);
                this.HT_Tables[eType].setColumnWidth(7, 70);
                this.HT_Tables[eType].setColumnWidth(8, 70);
                this.HT_Tables[eType].setColumnWidth(9, 70);
                this.HT_Tables[eType].setColumnWidth(10, 70);
                this.HT_Tables[eType].setColumnWidth(11, 40);
                this.HT_Tables[eType].setColumnWidth(12, 0);
                var tcm = this.HT_Tables[eType].getTableColumnModel();
                tcm.setColumnVisible(0, false);
                tcm.setColumnVisible(12, false);
                tcm.setDataCellRenderer(4, new qx.ui.table.cellrenderer.Number().set({
                  numberFormat: new qx.util.format.NumberFormat().set({
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  })
                }));
                tcm.setDataCellRenderer(5, new qx.ui.table.cellrenderer.Number().set({
                  numberFormat: new qx.util.format.NumberFormat().set({
                    maximumFractionDigits: 5,
                    minimumFractionDigits: 5
                  })
                }));
                tcm.setDataCellRenderer(6, new HuffyTools.ReplaceRender().set({
                  ReplaceFunction: this.formatTiberiumAndPower
                }));
                tcm.setDataCellRenderer(7, new HuffyTools.ReplaceRender().set({
                  ReplaceFunction: this.formatTiberiumAndPower
                }));
                tcm.setDataCellRenderer(11, new HuffyTools.ImageRender(40, 20));
              } catch (e) {
                console.log("HuffyTools.UpgradePriority.createTable: ", e);
              }
            },
            createTabPage: function (resource_type) {
              try {
                var sName = MaelstromTools.Statics.LootTypeName(resource_type);
                var oRes = new qx.ui.tabview.Page(Lang.gt(sName), MT_Base.images[sName]);
                oRes.setLayout(new qx.ui.layout.VBox(2));
                oRes.setPadding(5);
                var btnTab = oRes.getChildControl("button");
                btnTab.resetWidth();
                btnTab.resetHeight();
                btnTab.set({
                  show: "icon",
                  margin: 0,
                  padding: 0,
                  toolTipText: sName
                });
                btnTab.addListener("execute", this.TabChanged, [this, resource_type]);
                this.HT_Pages[resource_type] = oRes;
                return oRes;
              } catch (e) {
                console.log("HuffyTools.UpgradePriority.createTabPage: ", e);
              }
            },

            TabChanged: function (e) {
              try {
                this[0].HT_SelectedResourceType = this[1];
                this[0].UpgradeCompleted(null, null);
              } catch (e) {
                console.log("HuffyTools.UpgradePriority.TabChanged: ", e);
              }
            },

            upgradeBuilding: function (e, eResourceType) {
              if (this.upgradeInProgress == true) {
                console.log("upgradeBuilding:", "upgrade in progress !");
                return;
              }
              try {
                if (e.getColumn() == 11) {
                  var buildingID = this.HT_Models[eResourceType].getValue(0, e.getRow());
                  var iState = parseInt(this.HT_Models[eResourceType].getValue(12, e.getRow()));
                  if (iState != 1) {
                    return;
                  }
                  if (buildingID in this.BuildingList) {
                    this.upgradeInProgress = true;
                    if (PerforceChangelist >= 382917) { //new
                      ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", this.BuildingList[buildingID], phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, this.UpgradeCompleted), null, true);
                    } else { //old
                      ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", this.BuildingList[buildingID], webfrontend.Util.createEventDelegate(ClientLib.Net.CommandResult, this, this.UpgradeCompleted), null, true);
                    }
                  }
                }
              } catch (e) {
                console.log("HuffyTools.UpgradePriority.upgradeBuilding: ", e);
              }
            },
            UpgradeCompleted: function (context, result) {
              var self = this;
              window.setTimeout(function () {
                self.calc();
              }, 1000);
              this.upgradeInProgress = false;
            },
            CBChanged: function (e) {
              this.UpgradeCompleted(null, null);
            },
            formatTiberiumAndPower: function (oValue) {
              if (PerforceChangelist >= 387751) { //new
                return phe.cnc.gui.util.Numbers.formatNumbersCompact(oValue);
              } else { //old
                return webfrontend.gui.Util.formatNumbersCompact(oValue);
              }
            },
            updateCache: function () {
              try {
                if (!this.HT_TabView) {
                  this.init();
                }
                var eType = this.HT_SelectedResourceType;
                var bTop = this.HT_ShowOnlyTopBuildings[eType].getValue();
                MaelstromTools.LocalStorage.set("UGL_TOPBUILDINGS_" + eType, bTop);
                var bAffordable = this.HT_ShowOnlyAffordableBuildings[eType].getValue();
                MaelstromTools.LocalStorage.set("UGL_AFFORDABLE_" + eType, bAffordable);
                var oCityFilter = new Array();
                for (var cname in this.HT_CityBuildings[eType]) {
                  var oCityBuildings = this.HT_CityBuildings[eType][cname];
                  var bFilterBuilding = oCityBuildings.getValue();
                  MaelstromTools.LocalStorage.set("UGL_CITYFILTER_" + eType + "_" + oCityBuildings.HT_CityID, bFilterBuilding);
                  oCityFilter[cname] = bFilterBuilding;
                }
                window.HuffyTools.UpgradePriority.getInstance().collectData(bTop, bAffordable, oCityFilter, eType);
              } catch (e) {
                console.log("HuffyTools.UpgradePriority.updateCache: ", e);
              }
            },
            setWidgetLabels: function () {
              try {
                var HuffyCalc = window.HuffyTools.UpgradePriority.getInstance();
                var UpgradeList = HuffyCalc.Cache;

                for (var eResourceType in UpgradeList) {
                  //var eResourceType = MaelstromTools.Statics.LootTypeName(eResourceName);
                  var rowData = [];

                  this.HT_Models[eResourceType].setData([]);

                  for (var mCity in UpgradeList[eResourceType]) {
                    for (var mBuilding in UpgradeList[eResourceType][mCity]) {
                      var UpItem = UpgradeList[eResourceType][mCity][mBuilding];
                      if (typeof (UpItem.Type) == "undefined") {
                        continue;
                      }
                      if (!(mBuilding in this.BuildingList)) {
                        this.BuildingList[UpItem.ID] = UpItem.Building;
                      }
                      var iTiberiumCosts = 0;
                      if (ClientLib.Base.EResourceType.Tiberium in UpItem.Costs) {
                        iTiberiumCosts = UpItem.Costs[ClientLib.Base.EResourceType.Tiberium];
                      }
                      var iTiberiumPerGain = 0;
                      if (ClientLib.Base.EResourceType.Tiberium in UpItem.Costs) {
                        iTiberiumPerGain = UpItem.Costs[ClientLib.Base.EResourceType.Tiberium] / UpItem.GainPerHour;
                      }
                      var iPowerCosts = 0;
                      if (ClientLib.Base.EResourceType.Power in UpItem.Costs) {
                        iPowerCosts = UpItem.Costs[ClientLib.Base.EResourceType.Power];
                      }
                      var iPowerPerGain = 0;
                      if (ClientLib.Base.EResourceType.Power in UpItem.Costs) {
                        iPowerPerGain = UpItem.Costs[ClientLib.Base.EResourceType.Power] / UpItem.GainPerHour;
                      }
                      var img = MT_Base.images["UpgradeBuilding"];
                      if (UpItem.Affordable == false) {
                        img = "";
                      }
                      var sType = UpItem.Type;
                      sType = sType + "(" + UpItem.PosX + ":" + UpItem.PosY + ")";
                      var iETA = 0;
                      if (UpItem.TimeTillUpgradable[ClientLib.Base.EResourceType.Tiberium] > 0) {
                        iETA = UpItem.TimeTillUpgradable[ClientLib.Base.EResourceType.Tiberium];
                      }
                      if (UpItem.TimeTillUpgradable[ClientLib.Base.EResourceType.Power] > iETA) {
                        iETA = UpItem.TimeTillUpgradable[ClientLib.Base.EResourceType.Power];
                      }
                      var sETA = "";
                      if (iETA > 0) {
                        sETA = ClientLib.Vis.VisMain.FormatTimespan(iETA);
                      }
                      var iState = 0;
                      if (UpItem.Affordable == true) {
                        iState = 1;
                      } else if (UpItem.AffordableByTransfer == true) {
                        iState = 2;
                      } else {
                        iState = 3;
                      }
                      rowData.push([UpItem.ID, mCity, sType, UpItem.Level, UpItem.GainPerHour, UpItem.Ticks, iTiberiumCosts, iPowerCosts, iTiberiumPerGain, iPowerPerGain, sETA, img, iState]);
                    }
                  }
                  this.HT_Models[eResourceType].setData(rowData);
                }
              } catch (e) {
                console.log("HuffyTools.UpgradePriority.setWidgetLabels: ", e);
              }
            }
          }
        });

        // define HuffyTools.UpgradePriority
        qx.Class.define("HuffyTools.UpgradePriority", {
          type: "singleton",
          extend: qx.core.Object,
          members: {
            list_units: null,
            list_buildings: null,

            comparePrio: function (elem1, elem2) {
              if (elem1.Ticks < elem2.Ticks) return -1;
              if (elem1.Ticks > elem2.Ticks) return 1;
              return 0;
            },
            getPrioList: function (city, arTechtypes, eModPackageSize, eModProduction, bOnlyTopBuildings, bOnlyAffordableBuildings) {
              try {
                var RSI = window.MaelstromTools.ResourceOverview.getInstance();
                RSI.updateCache();
                var TotalTiberium = 0;

                for (var cityName in this.Cache) {
                  var cityCache = this.Cache[cityName];
                  var i = cityCache[MaelstromTools.Statics.Tiberium];
                  if (typeof (i) !== 'undefined') {
                    TotalTiberium += i;
                    //but never goes here during test.... // to optimize - to do
                  }
                }
                var resAll = new Array();
                var prod = MaelstromTools.Production.getInstance().updateCache(city.get_Name());
                //var buildings = MaelstromTools.Wrapper.GetBuildings(city.get_CityBuildingsData());
                var buildings = city.get_Buildings().d;

                // 376877 & old fixes 
                var objbuildings = [];
                if (PerforceChangelist >= 376877) { //new
                  for (var o in buildings) objbuildings.push(buildings[o]);
                } else { //old
                  for (var i = 0; i < buildings.length; i++) objbuildings.push(buildings[i]);
                }


                for (var i = 0; i < objbuildings.length; i++) {
                  var city_building = objbuildings[i];

                  // TODO: check for destroyed building

                  var iTechType = city_building.get_TechName();
                  var bSkip = true;
                  for (var iTypeKey in arTechtypes) {
                    if (arTechtypes[iTypeKey] == iTechType) {
                      bSkip = false;
                      break;
                    }
                  }
                  if (bSkip == true) {
                    continue;
                  }
                  var city_buildingdetailview = city.GetBuildingDetailViewInfo(city_building);
                  if (city_buildingdetailview == null) {
                    continue;
                  }
                  var bindex = city_building.get_Id();
                  var resbuilding = new Array();
                  resbuilding["ID"] = bindex;
                  resbuilding["Type"] = this.TechTypeName(parseInt(iTechType, 10));
                  resbuilding["PosX"] = city_building.get_CoordX();
                  resbuilding["PosY"] = city_building.get_CoordY();

                  resbuilding["Building"] = {
                    cityid: city.get_Id(),
                    posX: resbuilding["PosX"],
                    posY: resbuilding["PosY"],
                    isPaid: true
                  };

                  resbuilding["GainPerHour"] = 0;
                  resbuilding["Level"] = city_building.get_CurrentLevel() + 1;
                  for (var ModifierType in city_buildingdetailview.OwnProdModifiers.d) {
                    switch (parseInt(ModifierType, 10)) {
                      case eModPackageSize:
                        {
                          var ModOj = city_buildingdetailview.OwnProdModifiers.d[city_building.get_MainModifierTypeId()];
                          var Mod = (ModOj.TotalValue + ModOj.NewLvlDelta) / ClientLib.Data.MainData.GetInstance().get_Time().get_StepsPerHour();
                          resbuilding["GainPerHour"] += (city_buildingdetailview.OwnProdModifiers.d[ModifierType].NewLvlDelta / Mod);
                          break;
                        }
                      case eModProduction:
                        {
                          resbuilding["GainPerHour"] += city_buildingdetailview.OwnProdModifiers.d[ModifierType].NewLvlDelta;
                          break;
                        }
                    }
                  }
                  // Nutzen ins VerhÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¤ltnis zu den Kosten setzten
                  var TechLevelData = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj(city_building.get_CurrentLevel() + 1, city_building.get_TechGameData_Obj());
                  var RatioPerCostType = new Object();
                  var sRatio = "";
                  var sCosts = "";
                  var lTicks = 0;
                  var bHasPower = true;
                  var bHasTiberium = true;
                  var bAffordableByTransfer = true;
                  var oCosts = new Array();
                  var oTimes = new Array();
                  for (var costtype in TechLevelData) {
                    if (typeof (TechLevelData[costtype]) == "function") {
                      continue;
                    }
                    if (TechLevelData[costtype].Type == "0") {
                      continue;
                    }

                    oCosts[TechLevelData[costtype].Type] = TechLevelData[costtype].Count;
                    if (parseInt(TechLevelData[costtype].Count) <= 0) {
                      continue;
                    }
                    RatioPerCostType[costtype] = TechLevelData[costtype].Count / resbuilding["GainPerHour"];
                    if (sCosts.length > 0) {
                      sCosts = sCosts + ", ";
                    }
                    sCosts = sCosts + MaelstromTools.Wrapper.FormatNumbersCompact(TechLevelData[costtype].Count) + " " + MaelstromTools.Statics.LootTypeName(TechLevelData[costtype].Type);
                    if (sRatio.length > 0) {
                      sRatio = sRatio + ", ";
                    }
                    // Upgrade affordable ?
                    if (city.GetResourceCount(TechLevelData[costtype].Type) < TechLevelData[costtype].Count) {
                      switch (TechLevelData[costtype].Type) {
                        case ClientLib.Base.EResourceType.Tiberium:
                          {
                            bHasTiberium = false;
                            if (TotalTiberium < TechLevelData[costtype].Count) {
                              bAffordableByTransfer = false;
                            }
                          }
                          break;
                        case ClientLib.Base.EResourceType.Power:
                          {
                            bHasPower = false;
                          }
                          break;
                      }
                    }
                    sRatio = sRatio + MaelstromTools.Wrapper.FormatNumbersCompact(RatioPerCostType[costtype]);

                    var techlevelData = MaelstromTools.Statics.LootTypeName(TechLevelData[costtype].Type);

                    var dCityProduction = prod[techlevelData].Delta + prod[techlevelData].ExtraBonusDelta + prod[techlevelData].POI;
                    if (dCityProduction > 0) {
                      if (lTicks < (3600 * RatioPerCostType[costtype] / dCityProduction)) {
                        lTicks = (3600 * RatioPerCostType[costtype] / dCityProduction);
                      }
                    }
                    oTimes[TechLevelData[costtype].Type] = 0;
                    if (oCosts[TechLevelData[costtype].Type] > city.GetResourceCount(TechLevelData[costtype].Type)) {
                      oTimes[TechLevelData[costtype].Type] = (3600 * (oCosts[TechLevelData[costtype].Type] - city.GetResourceCount(TechLevelData[costtype].Type))) / dCityProduction;
                    }
                  }
                  resbuilding["Ticks"] = lTicks;
                  resbuilding["Time"] = ClientLib.Vis.VisMain.FormatTimespan(lTicks);
                  resbuilding["Costtext"] = sCosts;
                  resbuilding["Costs"] = oCosts;
                  resbuilding["TimeTillUpgradable"] = oTimes;
                  resbuilding["Ratio"] = sRatio;
                  resbuilding["Affordable"] = bHasTiberium && bHasPower;
                  resbuilding["AffordableByTransfer"] = bHasPower && bAffordableByTransfer;
                  if (resbuilding["GainPerHour"] > 0 && (bOnlyAffordableBuildings == false || resbuilding["Affordable"] == true)) {
                    resAll[bindex] = resbuilding;
                  }
                }


                resAll = resAll.sort(this.comparePrio);
                if (!bOnlyTopBuildings) {
                  return resAll;
                }
                var res2 = new Array();
                if (MaelstromTools.Util.ArraySize(resAll) > 0) {
                  var iTopNotAffordable = -1;
                  var iTopAffordable = -1;
                  var iNextNotAffordable = -1;
                  var iLastIndex = -1;
                  for (var iNewIndex in resAll) {
                    if (resAll[iNewIndex].Affordable == true) {
                      if (iTopAffordable == -1) {
                        iTopAffordable = iNewIndex;
                        iNextNotAffordable = iLastIndex;
                      }
                    } else {
                      if (iTopNotAffordable == -1) {
                        iTopNotAffordable = iNewIndex;
                      }
                    }
                    iLastIndex = iNewIndex;
                  }
                  if (iTopAffordable == -1) {
                    iNextNotAffordable = iLastIndex;
                  }
                  var iIndex = 0;
                  if (iTopNotAffordable != -1) {
                    res2[iIndex++] = resAll[iTopNotAffordable];
                  }
                  if (iNextNotAffordable != -1) {
                    res2[iIndex++] = resAll[iNextNotAffordable];
                  }
                  if (iTopAffordable != -1) {
                    res2[iIndex++] = resAll[iTopAffordable];
                  }
                }
                res2 = res2.sort(this.comparePrio);
                return res2;
              } catch (e) {
                console.log("HuffyTools.getPrioList: ", e);
              }
            },
            TechTypeName: function (iTechType) {
              switch (iTechType) {
                case ClientLib.Base.ETechName.PowerPlant:
                  {
                    return Lang.gt("Powerplant");
                    break;
                  }
                case ClientLib.Base.ETechName.Refinery:
                  {
                    return Lang.gt("Refinery");
                    break;
                  }
                case ClientLib.Base.ETechName.Harvester_Crystal:
                  {
                    return Lang.gt("Harvester");
                    break;
                  }
                case ClientLib.Base.ETechName.Harvester:
                  {
                    return Lang.gt("Harvester");
                    break;
                  }
                case ClientLib.Base.ETechName.Silo:
                  {
                    return Lang.gt("Silo");
                    break;
                  }
                case ClientLib.Base.ETechName.Accumulator:
                  {
                    return Lang.gt("Accumulator");
                    break;
                  }
              }
              return "?";
            },
            collectData: function (bOnlyTopBuildings, bOnlyAffordableBuildings, oCityFilter, eSelectedResourceType) {
              try {
                MT_Cache.updateCityCache();
                this.Cache = new Object();
                if (eSelectedResourceType == ClientLib.Base.EResourceType.Tiberium) {
                  this.Cache[ClientLib.Base.EResourceType.Tiberium] = new Object();
                }
                if (eSelectedResourceType == ClientLib.Base.EResourceType.Crystal) {
                  this.Cache[ClientLib.Base.EResourceType.Crystal] = new Object();
                }
                if (eSelectedResourceType == ClientLib.Base.EResourceType.Power) {
                  this.Cache[ClientLib.Base.EResourceType.Power] = new Object();
                }
                if (eSelectedResourceType == ClientLib.Base.EResourceType.Gold) {
                  this.Cache[ClientLib.Base.EResourceType.Gold] = new Object();
                }
                for (var cname in MT_Cache.Cities) {
                  var city = MT_Cache.Cities[cname].Object;
                  if (oCityFilter[cname] == false) {
                    continue;
                  }
                  if (eSelectedResourceType == ClientLib.Base.EResourceType.Tiberium) {
                    this.Cache[ClientLib.Base.EResourceType.Tiberium][cname] = this.getPrioList(city, [ClientLib.Base.ETechName.Harvester, ClientLib.Base.ETechName.Silo], ClientLib.Base.EModifierType.TiberiumPackageSize, ClientLib.Base.EModifierType.TiberiumProduction, bOnlyTopBuildings, bOnlyAffordableBuildings);
                  }
                  if (eSelectedResourceType == ClientLib.Base.EResourceType.Crystal) {
                    this.Cache[ClientLib.Base.EResourceType.Crystal][cname] = this.getPrioList(city, [ClientLib.Base.ETechName.Harvester, ClientLib.Base.ETechName.Silo], ClientLib.Base.EModifierType.CrystalPackageSize, ClientLib.Base.EModifierType.CrystalProduction, bOnlyTopBuildings, bOnlyAffordableBuildings);
                  }
                  if (eSelectedResourceType == ClientLib.Base.EResourceType.Power) {
                    this.Cache[ClientLib.Base.EResourceType.Power][cname] = this.getPrioList(city, [ClientLib.Base.ETechName.PowerPlant, ClientLib.Base.ETechName.Accumulator], ClientLib.Base.EModifierType.PowerPackageSize, ClientLib.Base.EModifierType.PowerProduction, bOnlyTopBuildings, bOnlyAffordableBuildings);
                  }
                  if (eSelectedResourceType == ClientLib.Base.EResourceType.Gold) {
                    this.Cache[ClientLib.Base.EResourceType.Gold][cname] = this.getPrioList(city, [ClientLib.Base.ETechName.Refinery, ClientLib.Base.ETechName.PowerPlant], ClientLib.Base.EModifierType.CreditsPackageSize, ClientLib.Base.EModifierType.CreditsProduction, bOnlyTopBuildings, bOnlyAffordableBuildings);
                  }
                }
              } catch (e) {
                console.log("HuffyTools.UpgradePriority.collectData: ", e);
              }
            }
          }
        });

        var __MTCity_initialized = false; //k undeclared

        var Lang = window.MaelstromTools.Language.getInstance();
        var MT_Cache = window.MaelstromTools.Cache.getInstance();
        var MT_Base = window.MaelstromTools.Base.getInstance();
        var MT_Preferences = window.MaelstromTools.Preferences.getInstance();
        MT_Preferences.readOptions();

        if (!webfrontend.gui.region.RegionCityMenu.prototype.__MTCity_showMenu) {
          webfrontend.gui.region.RegionCityMenu.prototype.__MTCity_showMenu = webfrontend.gui.region.RegionCityMenu.prototype.showMenu;
        }
        webfrontend.gui.region.RegionCityMenu.prototype.showMenu = function (selectedVisObject) {

          MT_Cache.SelectedBaseForMenu = selectedVisObject;
          var baseStatusOverview = window.MaelstromTools.BaseStatus.getInstance();

          if (__MTCity_initialized == false) {
            //console.log(selectedBase.get_Name());
            __MTCity_initialized = true;
            baseStatusOverview.CityMenuButtons = new Array();

            for (var k in this) {
              try {
                if (this.hasOwnProperty(k)) {
                  if (this[k] && this[k].basename == "Composite") {
                    var button = new qx.ui.form.Button(Lang.gt("Calibrate support"));
                    button.addListener("execute", function (e) {
                      MaelstromTools.Util.calibrateWholeSupportOnSelectedBase();
                    }, this);

                    this[k].add(button);
                    baseStatusOverview.CityMenuButtons.push(button);
                  }
                }
              } catch (e) {
                console.log("webfrontend.gui.region.RegionCityMenu.prototype.showMenu: ", e);
              }
            }
          }

          var isAllowed = MaelstromTools.Util.checkIfSupportIsAllowed(MT_Cache.SelectedBaseForMenu);

          for (var x = 0; x < baseStatusOverview.CityMenuButtons.length; ++x) {
            baseStatusOverview.CityMenuButtons[x].setVisibility(isAllowed ? 'visible' : 'excluded');
          }
          this.__MTCity_showMenu(selectedVisObject);
        };

        if (MT_Preferences.Settings.showLoot) {
          // Wrap onCitiesChange method
          if (!webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.__MTCity_NPCCamp) {
            webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.__MTCity_NPCCamp = webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.onCitiesChange;
          }
          webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.onCitiesChange = function () {
            MT_Base.updateLoot(1, ClientLib.Vis.VisMain.GetInstance().get_SelectedObject(), webfrontend.gui.region.RegionNPCCampStatusInfo.getInstance());
            return this.__MTCity_NPCCamp();
          };

          if (!webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.__MTCity_NPCBase) {
            webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.__MTCity_NPCBase = webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.onCitiesChange;
          }
          webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.onCitiesChange = function () {
            MT_Base.updateLoot(2, ClientLib.Vis.VisMain.GetInstance().get_SelectedObject(), webfrontend.gui.region.RegionNPCBaseStatusInfo.getInstance());
            //MT_Base.updateLoot(2, ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity(), webfrontend.gui.region.RegionNPCBaseStatusInfo.getInstance());
            return this.__MTCity_NPCBase();
          };

          if (!webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.__MTCity_City) {
            webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.__MTCity_City = webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange;
          }
          webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange = function () {
            MT_Base.updateLoot(3, ClientLib.Vis.VisMain.GetInstance().get_SelectedObject(), webfrontend.gui.region.RegionCityStatusInfoEnemy.getInstance());
            //MT_Base.updateLoot(3, ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity(), webfrontend.gui.region.RegionCityStatusInfoEnemy.getInstance());
            return this.__MTCity_City();
          };
        }

      }
    } catch (e) {
      console.log("createMaelstromTools: ", e);
    }

    function MaelstromTools_checkIfLoaded() {
      try {
        if (typeof qx != 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION) && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION).isVisible()) {
          createMaelstromTools();
          window.MaelstromTools.Base.getInstance().initialize();
        } else {
          window.setTimeout(MaelstromTools_checkIfLoaded, 1000);
        }
      } catch (e) {
        console.log("MaelstromTools_checkIfLoaded: ", e);
      }
    }

    if (/commandandconquer\.com/i.test(document.domain)) {
      window.setTimeout(MaelstromTools_checkIfLoaded, 1000);
    }
  };

  try {
    var MaelstromScript = document.createElement("script");
    MaelstromScript.innerHTML = "(" + MaelstromTools_main.toString() + ")();";
    MaelstromScript.type = "text/javascript";
    if (/commandandconquer\.com/i.test(document.domain)) {
      document.getElementsByTagName("head")[0].appendChild(MaelstromScript);
    }
  } catch (e) {
    console.log("MaelstromTools: init error: ", e);
  }
})();
// ==UserScript==
// @name        Maelstrom Tools ADDON Basescanner
// @namespace   http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @description Maelstrom ADDON Basescanner
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version     1.8.5
// @author      BlinDManX
// @grant       none
// @copyright   2012+, Claus Neumann
// @license     CC BY-NC-ND 3.0 - http://creativecommons.org/licenses/by-nc-nd/3.0/
// ==/UserScript==
(function () {
	var MaelstromTools_Basescanner = function () {
		window.__msbs_version = "1.8.5";
		function createMaelstromTools_Basescanner() {

			qx.Class.define("Addons.BaseScannerGUI", {
				type : "singleton",
				extend : qx.ui.window.Window,
				construct : function () {
					try {
						this.base(arguments);
						console.info("Addons.BaseScannerGUI " + window.__msbs_version);
						this.T = Addons.Language.getInstance();
						this.setWidth(820);
						this.setHeight(400);
						this.setContentPadding(10);
						this.setShowMinimize(true);
						this.setShowMaximize(true);
						this.setShowClose(true);
						this.setResizable(true);
						this.setAllowMaximize(true);
						this.setAllowMinimize(true);
						this.setAllowClose(true);
						this.setShowStatusbar(false);
						this.setDecorator(null);
						this.setPadding(5);
						this.setLayout(new qx.ui.layout.VBox(3));
						this.stats.src = 'http://goo.gl/DrJ2x'; //1.5

						this.FI();
						this.FH();
						this.FD();
						if (this.ZE == null) {
							this.ZE = [];
						}
						this.setPadding(0);
						this.removeAll();

						this.add(this.ZF);
						this.add(this.ZN);

						this.add(this.ZP);
						this.ZL.setData(this.ZE);							

					} catch (e) {
						console.debug("Addons.BaseScannerGUI.construct: ", e);
					}
				},
				members : {
					// pictures
					stats : document.createElement('img'),
					T : null,
					ZA : 0,
					ZB : null,
					ZC : null,
					ZD : null,
					ZE : null,
					ZF : null,
					ZG : null,
					ZH : false,
					ZI : true,
					ZJ : null,
					ZK : null,
					ZL : null,
					ZM : null,
					ZN : null,
					ZO : null,
					ZP : null,
					ZQ : null,
					ZR : [],
					ZT : true,
					ZU : null,
					ZV : null,
					ZX : null,
					ZY : null,
					ZZ : [],
					ZS : {},
					YZ : null,
					YY : null,
					
					openWindow : function (title) {
						try {
							this.setCaption(title);
							if (this.isVisible()) {
								this.close();
							} else {
								MT_Cache.updateCityCache();
								MT_Cache = window.MaelstromTools.Cache.getInstance();
								var cname;								
								this.ZC.removeAll();
								for (cname in MT_Cache.Cities) {
									var item = new qx.ui.form.ListItem(cname, null, MT_Cache.Cities[cname].Object);
									this.ZC.add(item);
									if (Addons.LocalStorage.getserver("Basescanner_LastCityID") == MT_Cache.Cities[cname].Object.get_Id()) {
										this.ZC.setSelection([item]);
									}
								}							
								this.open();
								this.moveTo(100, 100);
							}
						} catch (e) {
							console.log("MaelstromTools.DefaultObject.openWindow: ", e);
						}
					},
					FI : function () {
						try {
							this.ZL = new qx.ui.table.model.Simple();
							this.ZL.setColumns(["ID", "LoadState", this.T.get("City"), this.T.get("Location"), this.T.get("Level"), this.T.get("Tiberium"), this.T.get("Crystal"), this.T.get("Dollar"), this.T.get("Research"), "Crystalfields", "Tiberiumfields", this.T.get("Building state"), this.T.get("Defense state"), this.T.get("CP"), "Def.HP/Off.HP", "Sum Tib+Cry+Cre", "(Tib+Cry+Cre)/CP", "CY", "DF", this.T.get("base set up at")]);
							this.YY = ClientLib.Data.MainData.GetInstance().get_Player();
							this.ZN = new qx.ui.table.Table(this.ZL);
							this.ZN.setColumnVisibilityButtonVisible(false);
							this.ZN.setColumnWidth(0, 0);
							this.ZN.setColumnWidth(1, 0);
							this.ZN.setColumnWidth(2, Addons.LocalStorage.getserver("Basescanner_ColWidth_2", 120));
							this.ZN.setColumnWidth(3, Addons.LocalStorage.getserver("Basescanner_ColWidth_3", 60));
							this.ZN.setColumnWidth(4, Addons.LocalStorage.getserver("Basescanner_ColWidth_4", 50));
							this.ZN.setColumnWidth(5, Addons.LocalStorage.getserver("Basescanner_ColWidth_5", 60));
							this.ZN.setColumnWidth(6, Addons.LocalStorage.getserver("Basescanner_ColWidth_6", 60));
							this.ZN.setColumnWidth(7, Addons.LocalStorage.getserver("Basescanner_ColWidth_7", 60));
							this.ZN.setColumnWidth(8, Addons.LocalStorage.getserver("Basescanner_ColWidth_8", 60));
							this.ZN.setColumnWidth(9, Addons.LocalStorage.getserver("Basescanner_ColWidth_9", 30));
							this.ZN.setColumnWidth(10, Addons.LocalStorage.getserver("Basescanner_ColWidth_10", 30));
							this.ZN.setColumnWidth(11, Addons.LocalStorage.getserver("Basescanner_ColWidth_11", 50));
							this.ZN.setColumnWidth(12, Addons.LocalStorage.getserver("Basescanner_ColWidth_12", 50));
							this.ZN.setColumnWidth(13, Addons.LocalStorage.getserver("Basescanner_ColWidth_13", 30));
							this.ZN.setColumnWidth(14, Addons.LocalStorage.getserver("Basescanner_ColWidth_14", 60));
							this.ZN.setColumnWidth(15, Addons.LocalStorage.getserver("Basescanner_ColWidth_15", 60));
							this.ZN.setColumnWidth(16, Addons.LocalStorage.getserver("Basescanner_ColWidth_16", 60));
							this.ZN.setColumnWidth(17, Addons.LocalStorage.getserver("Basescanner_ColWidth_17", 50));
							this.ZN.setColumnWidth(18, Addons.LocalStorage.getserver("Basescanner_ColWidth_18", 50));
							this.ZN.setColumnWidth(19, Addons.LocalStorage.getserver("Basescanner_ColWidth_19", 40));
							var c = 0;
							var tcm = this.ZN.getTableColumnModel();
							for (c = 0; c < this.ZL.getColumnCount(); c++) {
								if (c == 0 || c == 1 || c == 11 || c == 12) {
									tcm.setColumnVisible(c, Addons.LocalStorage.getserver("Basescanner_Column_" + c, false));
								} else {
									tcm.setColumnVisible(c, Addons.LocalStorage.getserver("Basescanner_Column_" + c, true));
								}
							}

							tcm.setColumnVisible(1, false);
							tcm.setHeaderCellRenderer(9, new qx.ui.table.headerrenderer.Icon(MT_Base.images[MaelstromTools.Statics.Crystal]), "Crystalfields");
							tcm.setHeaderCellRenderer(10, new qx.ui.table.headerrenderer.Icon(MT_Base.images[MaelstromTools.Statics.Tiberium], "Tiberiumfields"));
							tcm.setDataCellRenderer(5, new qx.ui.table.cellrenderer.Replace().set({
									ReplaceFunction : this.FA
								}));
							tcm.setDataCellRenderer(6, new qx.ui.table.cellrenderer.Replace().set({
									ReplaceFunction : this.FA
								}));
							tcm.setDataCellRenderer(7, new qx.ui.table.cellrenderer.Replace().set({
									ReplaceFunction : this.FA
								}));
							tcm.setDataCellRenderer(8, new qx.ui.table.cellrenderer.Replace().set({
									ReplaceFunction : this.FA
								}));
							tcm.setDataCellRenderer(15, new qx.ui.table.cellrenderer.Replace().set({
									ReplaceFunction : this.FA
								}));
							tcm.setDataCellRenderer(16, new qx.ui.table.cellrenderer.Replace().set({
									ReplaceFunction : this.FA
								}));
							tcm.setDataCellRenderer(19, new qx.ui.table.cellrenderer.Boolean());

							
							if (PerforceChangelist >= 436669) { // 15.3 patch
								var eventType = "cellDbltap";
							} else { //old
								var eventType = "cellDblclick";
							}
				
							this.ZN.addListener(eventType, function (e) {
								Addons.BaseScannerGUI.getInstance().FB(e);
							}, this);

							
							tcm.addListener("widthChanged", function (e) {
								//console.log(e, e.getData());
								var col = e.getData().col;
								var width = e.getData().newWidth;
								Addons.LocalStorage.setserver("Basescanner_ColWidth_" + col, width);
							}, tcm);

						} catch (e) {
							console.debug("Addons.BaseScannerGUI.FI: ", e);
						}
					},
					FB : function (e) {
						try {
							console.log("e",e.getRow(),this.ZE);
							var cityId = this.ZE[e.getRow()][0];
							var posData = this.ZE[e.getRow()][3];
							/* center screen */
							if (posData != null && posData.split(':').length == 2) {
								var posX = parseInt(posData.split(':')[0]);
								var posY = parseInt(posData.split(':')[1]);
								ClientLib.Vis.VisMain.GetInstance().CenterGridPosition(posX, posY);
							}
							/* and highlight base */
							if (cityId && !(this.ZK[4].getValue())) {
								//ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentCityId(cityId);
								//webfrontend.gui.UtilView.openCityInMainWindow(cityId);
								//webfrontend.gui.UtilView.openVisModeInMainWindow(1, cityId, false);
								var bk = qx.core.Init.getApplication();
								bk.getBackgroundArea().closeCityInfo();
								bk.getPlayArea().setView(ClientLib.Data.PlayerAreaViewMode.pavmCombatSetupDefense, cityId, 0, 0);
							}

							var q = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
							if (q != null)
								q.get_CityArmyFormationsManager().set_CurrentTargetBaseId(cityId);

						} catch (ex) {
							console.debug("Addons.BaseScannerGUI FB error: ", ex);
						}
					},
					FN : function (e) {
						this.ZG.setLabel(this.T.get("Scan"));
						this.ZH = false;
					},
					CBChanged : function (e) {
						this.ZH = false;
					},
					FA : function (oValue) {
						var f = new qx.util.format.NumberFormat();
						f.setGroupingUsed(true);
						f.setMaximumFractionDigits(3);
						if (!isNaN(oValue)) {
							if (Math.abs(oValue) < 100000)
								oValue = f.format(Math.floor(oValue));
							else if (Math.abs(oValue) >= 100000 && Math.abs(oValue) < 1000000)
								oValue = f.format(Math.floor(oValue / 100) / 10) + "k";
							else if (Math.abs(oValue) >= 1000000 && Math.abs(oValue) < 10000000)
								oValue = f.format(Math.floor(oValue / 1000) / 1000) + "M";
							else if (Math.abs(oValue) >= 10000000 && Math.abs(oValue) < 100000000)
								oValue = f.format(Math.floor(oValue / 10000) / 100) + "M";
							else if (Math.abs(oValue) >= 100000000 && Math.abs(oValue) < 1000000000)
								oValue = f.format(Math.floor(oValue / 100000) / 10) + "M";
							else if (Math.abs(oValue) >= 1000000000 && Math.abs(oValue) < 10000000000)
								oValue = f.format(Math.floor(oValue / 1000000) / 1000) + "G";
							else if (Math.abs(oValue) >= 10000000000 && Math.abs(oValue) < 100000000000)
								oValue = f.format(Math.floor(oValue / 10000000) / 100) + "G";
							else if (Math.abs(oValue) >= 100000000000 && Math.abs(oValue) < 1000000000000)
								oValue = f.format(Math.floor(oValue / 100000000) / 10) + "G";
							else if (Math.abs(oValue) >= 1000000000000 && Math.abs(oValue) < 10000000000000)
								oValue = f.format(Math.floor(oValue / 1000000000) / 1000) + "T";
							else if (Math.abs(oValue) >= 10000000000000 && Math.abs(oValue) < 100000000000000)
								oValue = f.format(Math.floor(oValue / 10000000000) / 100) + "T";
							else if (Math.abs(oValue) >= 100000000000000 && Math.abs(oValue) < 1000000000000000)
								oValue = f.format(Math.floor(oValue / 100000000000) / 10) + "T";
							else if (Math.abs(oValue) >= 1000000000000000)
								oValue = f.format(Math.floor(oValue / 1000000000000)) + "T";
						};
						return oValue.toString();
					},
					// updateCache : function () {
					// try {}
					// catch (e) {
					// console.debug("Addons.BaseScannerGUI.updateCache: ", e);
					// }
					// },
					// setWidgetLabels : function () {
					// try {
					// if (!this.ZL) {
					// this.FC();
					// }
					// this.ZL.setData(this.ZE);
					// } catch (e) {
					// console.debug("Addons.BaseScannerGUI.setWidgetLabels: ", e);
					// }
					// },
					FH : function () {
						try {
							var oBox = new qx.ui.layout.Flow();
							var oOptions = new qx.ui.container.Composite(oBox);
							this.ZC = new qx.ui.form.SelectBox();
							this.ZC.setHeight(25);
							this.ZC.setMargin(5);
							MT_Cache.updateCityCache();
							MT_Cache = window.MaelstromTools.Cache.getInstance();
							var cname;							
							for (cname in MT_Cache.Cities) {
								var item = new qx.ui.form.ListItem(cname, null, MT_Cache.Cities[cname].Object);
								this.ZC.add(item);
								if (Addons.LocalStorage.getserver("Basescanner_LastCityID") == MT_Cache.Cities[cname].Object.get_Id()) {
									this.ZC.setSelection([item]);
								}
							}
							this.ZC.addListener("changeSelection", function (e) {								
								this.FP(0, 1, 200);
								this.ZH = false;
								this.ZG.setLabel(this.T.get("Scan"));
							}, this);
							oOptions.add(this.ZC);

							var l = new qx.ui.basic.Label().set({
									value : this.T.get("CP Limit"),
									textColor : "white",
									margin : 5
								});
							oOptions.add(l);

							this.ZQ = new qx.ui.form.SelectBox();
							this.ZQ.setWidth(50);
							this.ZQ.setHeight(25);
							this.ZQ.setMargin(5);
							var limiter = Addons.LocalStorage.getserver("Basescanner_Cplimiter", 25);
							for (var m = 11; m < 42; m += 1) {
								item = new qx.ui.form.ListItem("" + m, null, m);
								this.ZQ.add(item);
								if (limiter == m) {
									this.ZQ.setSelection([item]);
								}
							}
							this.ZQ.addListener("changeSelection", function (e) {
								this.ZE = [];
								this.FP(0, 1, 200);
								this.ZH = false;
								this.ZG.setLabel(this.T.get("Scan"));
							}, this);
							oOptions.add(this.ZQ);

							var la = new qx.ui.basic.Label().set({
									value : this.T.get("min Level"),
									textColor : "white",
									margin : 5
								});
							oOptions.add(la);
							var minlevel = Addons.LocalStorage.getserver("Basescanner_minLevel", "1");
							this.ZY = new qx.ui.form.TextField(minlevel).set({
									width : 50
								});
							oOptions.add(this.ZY);

							this.ZK = [];
							this.ZK[0] = new qx.ui.form.CheckBox(this.T.get("Player"));
							this.ZK[0].setMargin(5);
							this.ZK[0].setTextColor("white");
							this.ZK[0].setValue(Addons.LocalStorage.getserver("Basescanner_Show0", false));
							this.ZK[0].addListener("changeValue", function (e) {
								this.ZE = [];
								this.FP(0, 1, 200);
								this.ZH = false;
								this.ZG.setLabel(this.T.get("Scan"));
							}, this);
							oOptions.add(this.ZK[0]);
							this.ZK[1] = new qx.ui.form.CheckBox(this.T.get("Bases"));
							this.ZK[1].setMargin(5);
							this.ZK[1].setTextColor("white");
							this.ZK[1].setValue(Addons.LocalStorage.getserver("Basescanner_Show1", false));
							this.ZK[1].addListener("changeValue", function (e) {
								this.ZE = [];
								this.FP(0, 1, 200);
								this.ZH = false;
								this.ZG.setLabel(this.T.get("Scan"));
							}, this);
							oOptions.add(this.ZK[1]);
							this.ZK[2] = new qx.ui.form.CheckBox(this.T.get("Outpost"));
							this.ZK[2].setMargin(5);
							this.ZK[2].setTextColor("white");
							this.ZK[2].setValue(Addons.LocalStorage.getserver("Basescanner_Show2", false));
							this.ZK[2].addListener("changeValue", function (e) {
								this.ZE = [];
								this.FP(0, 1, 200);
								this.ZH = false;
								this.ZG.setLabel(this.T.get("Scan"));
							}, this);
							oOptions.add(this.ZK[2]);
							this.ZK[3] = new qx.ui.form.CheckBox(this.T.get("Camp"));
							this.ZK[3].setMargin(5);
							this.ZK[3].setTextColor("white");
							this.ZK[3].setValue(Addons.LocalStorage.getserver("Basescanner_Show3", true));
							this.ZK[3].addListener("changeValue", function (e) {
								this.ZE = [];
								this.FP(0, 1, 200);
								this.ZH = false;
								this.ZG.setLabel(this.T.get("Scan"));
							}, this);
							oOptions.add(this.ZK[3], {
								lineBreak : true
							});

							this.ZG = new qx.ui.form.Button(this.T.get("Scan")).set({
									width : 100,
									minWidth : 100,
									maxWidth : 100,
									height : 25,
									margin : 5
								});
							this.ZG.addListener("execute", function () {

								this.FE();
							}, this);
							oOptions.add(this.ZG);

							var border = new qx.ui.decoration.Single(2, "solid", "blue");
							this.ZV = new qx.ui.container.Composite(new qx.ui.layout.Basic()).set({
									decorator : border,
									backgroundColor : "red",
									allowGrowX : false,
									height : 20,
									width : 200
								});
							this.ZU = new qx.ui.core.Widget().set({
									decorator : null,
									backgroundColor : "green",
									width : 0
								});
							this.ZV.add(this.ZU);
							this.ZX = new qx.ui.basic.Label("").set({
									decorator : null,
									textAlign : "center",
									width : 200
								});
							this.ZV.add(this.ZX, {
								left : 0,
								top : -3
							});
							oOptions.add(this.ZV);

							this.YZ = new qx.ui.form.Button(this.T.get("clear Cache")).set({
									minWidth : 100,
									height : 25,
									margin : 5
								});
							this.YZ.addListener("execute", function () {
								this.ZZ = [];
							}, this);
							oOptions.add(this.YZ);

							this.ZK[4] = new qx.ui.form.CheckBox(this.T.get("Only center on World"));
							this.ZK[4].setMargin(5);
							this.ZK[4].setTextColor("white");
							oOptions.add(this.ZK[4], {
								lineBreak : true
							});

							this.ZJ = new qx.ui.form.SelectBox();
							this.ZJ.setWidth(150);
							this.ZJ.setHeight(25);
							this.ZJ.setMargin(5);
							var item = new qx.ui.form.ListItem("7 " + this.T.get(MaelstromTools.Statics.Tiberium) + " 5 " + this.T.get(MaelstromTools.Statics.Crystal), null, 7);
							this.ZJ.add(item);
							item = new qx.ui.form.ListItem("6 " + this.T.get(MaelstromTools.Statics.Tiberium) + " 6 " + this.T.get(MaelstromTools.Statics.Crystal), null, 6);
							this.ZJ.add(item);
							item = new qx.ui.form.ListItem("5 " + this.T.get(MaelstromTools.Statics.Tiberium) + " 7 " + this.T.get(MaelstromTools.Statics.Crystal), null, 5);
							this.ZJ.add(item);
							oOptions.add(this.ZJ);
							this.ZD = new qx.ui.form.Button(this.T.get("Get Layouts")).set({
									width : 120,
									minWidth : 120,
									maxWidth : 120,
									height : 25,
									margin : 5
								});
							this.ZD.addListener("execute", function () {
								var layout = window.Addons.BaseScannerLayout.getInstance();
								layout.openWindow(this.T.get("BaseScanner Layout"));
							}, this);
							this.ZD.setEnabled(false);
							oOptions.add(this.ZD);

							this.ZB = new qx.ui.container.Composite();
							this.ZB.setLayout(new qx.ui.layout.Flow());
							this.ZB.setWidth(750);
							//oOptions.add(this.ZB, {flex:1});

							var J = webfrontend.gui.layout.Loader.getInstance();
							//var L = J.getLayout("playerbar", this);
							//this._ZZ = J.getElement(L, "objid", 'lblplayer');


							//this.tableSettings = new qx.ui.groupbox.GroupBox("Visable Columns");
							//box.add(this.tableSettings, {flex:1});
							var k = 2;
							for (k = 2; k < this.ZL.getColumnCount(); k++) {
								var index = k - 2;

								this.ZR[index] = new qx.ui.form.CheckBox(this.ZL.getColumnName(k));
								this.ZR[index].setValue(this.ZN.getTableColumnModel().isColumnVisible(k));
								this.ZR[index].setTextColor("white");
								this.ZR[index].index = k;
								this.ZR[index].table = this.ZN;
								this.ZR[index].addListener("changeValue", function (e) {
									//console.log("click", e, e.getData(), this.index);
									var tcm = this.table.getTableColumnModel();
									tcm.setColumnVisible(this.index, e.getData());
									Addons.LocalStorage.setserver("Basescanner_Column_" + this.index, e.getData());
								});
								this.ZB.add(this.ZR[index]);
								//this.tableSettings.add( this.ZR[index] );
							}

							this.ZO = new qx.ui.form.Button("+").set({
									margin : 5
								});
							this.ZO.addListener("execute", function () {
								if (this.ZI) {
									oOptions.addAfter(this.ZB, this.ZO);
									this.ZO.setLabel("-");
								} else {
									oOptions.remove(this.ZB);
									this.ZO.setLabel("+");
								}
								this.ZI = !this.ZI;
							}, this);
							this.ZO.setAlignX("right");
							oOptions.add(this.ZO, {
								lineBreak : true
							});

							this.ZF = oOptions;

						} catch (e) {
							console.debug("Addons.BaseScannerGUI.createOptions: ", e);
						}
					},
					FD : function () {
						//0.7
						//var n = ClientLib.Data.MainData.GetInstance().get_Cities();
						//var i = n.get_CurrentOwnCity();
						var st = '<a href="https://sites.google.com/site/blindmanxdonate" target="_blank">Support Development of BlinDManX Addons</a>';
						var l = new qx.ui.basic.Label().set({
								value : st,
								rich : true,
								width : 800
							});
						this.ZP = l;
					},
					FE : function () {
						var selectedBase = this.ZC.getSelection()[0].getModel();
						ClientLib.Vis.VisMain.GetInstance().CenterGridPosition(selectedBase.get_PosX(), selectedBase.get_PosY()); //Load data of region
						ClientLib.Vis.VisMain.GetInstance().Update();
						ClientLib.Vis.VisMain.GetInstance().ViewUpdate();
						ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentCityId(selectedBase.get_Id());

						if (this.ZT) {
							var obj = ClientLib.Data.WorldSector.WorldObjectCity.prototype;
							// var fa = foundfnkstring(obj['$ctor'], /=0;this\.(.{6})=g>>7&255;.*d\+=f;this\.(.{6})=\(/, "ClientLib.Data.WorldSector.WorldObjectCity", 2);
							var fa = foundfnkstring(obj['$ctor'], /this\.(.{6})=\(?\(?g>>8\)?\&.*d\+=f;this\.(.{6})=\(/, "ClientLib.Data.WorldSector.WorldObjectCity", 2);
							if (fa != null && fa[1].length == 6) {
								obj.getLevel = function () {
									return this[fa[1]];
								};
							} else {
								console.error("Error - ClientLib.Data.WorldSector.WorldObjectCity.Level undefined");
							}
							if (fa != null && fa[2].length == 6) {
								obj.getID = function () {
									return this[fa[2]];
								};
							} else {
								console.error("Error - ClientLib.Data.WorldSector.WorldObjectCity.ID undefined");
							}

							obj = ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype;
							//var fb = foundfnkstring(obj['$ctor'], /100;this\.(.{6})=Math.floor.*d\+=f;this\.(.{6})=\(/, "ClientLib.Data.WorldSector.WorldObjectNPCBase", 2);
							var fb = foundfnkstring(obj['$ctor'], /100\){0,1};this\.(.{6})=Math.floor.*d\+=f;this\.(.{6})=\(/, "ClientLib.Data.WorldSector.WorldObjectNPCBase", 2);
							if (fb != null && fb[1].length == 6) {
								obj.getLevel = function () {
									return this[fb[1]];
								};
							} else {
								console.error("Error - ClientLib.Data.WorldSector.WorldObjectNPCBase.Level undefined");
							}
							if (fb != null && fb[2].length == 6) {
								obj.getID = function () {
									return this[fb[2]];
								};
							} else {
								console.error("Error - ClientLib.Data.WorldSector.WorldObjectNPCBase.ID undefined");
							}

							obj = ClientLib.Data.WorldSector.WorldObjectNPCCamp.prototype;
							//var fc = foundfnkstring(obj['$ctor'], /100;this\.(.{6})=Math.floor.*=-1;\}this\.(.{6})=\(/, "ClientLib.Data.WorldSector.WorldObjectNPCCamp", 2);
							var fc = foundfnkstring(obj['$ctor'], /100\){0,1};this\.(.{6})=Math.floor.*this\.(.{6})=\(*g\>\>(22|0x16)\)*\&.*=-1;\}this\.(.{6})=\(/, "ClientLib.Data.WorldSector.WorldObjectNPCCamp", 4);
							if (fc != null && fc[1].length == 6) {
								obj.getLevel = function () {
									return this[fc[1]];
								};
							} else {
								console.error("Error - ClientLib.Data.WorldSector.WorldObjectNPCCamp.Level undefined");
							}
							if (fc != null && fc[2].length == 6) {
								obj.getCampType = function () {
									return this[fc[2]];
								};
							} else {
								console.error("Error - ClientLib.Data.WorldSector.WorldObjectNPCCamp.CampType undefined");
							}

							if (fc != null && fc[4].length == 6) {
								obj.getID = function () {
									return this[fc[4]];
								};
							} else {
								console.error("Error - ClientLib.Data.WorldSector.WorldObjectNPCCamp.ID undefined");
							}
							this.ZT = false;
						}

						//Firstscan
						if (this.ZE == null) {
							this.ZH = false;
							this.ZG.setLabel("Pause");
							this.ZD.setEnabled(false);
							window.setTimeout("window.Addons.BaseScannerGUI.getInstance().FJ()", 1000);
							return;
						}
						//After Pause
						var c = 0;
						for (i = 0; i < this.ZE.length; i++) {
							if (this.ZE[i][1] == -1) {
								c++;
							}
						}

						if (!this.ZH) {
							this.ZG.setLabel("Pause");
							this.ZD.setEnabled(false);
							if (c > 0) {
								this.ZH = true;
								window.setTimeout("window.Addons.BaseScannerGUI.getInstance().FG()", 1000);
								return;
							} else {
								this.ZH = false;
								window.setTimeout("window.Addons.BaseScannerGUI.getInstance().FJ()", 1000);
							}
						} else {
							this.ZH = false;
							this.ZG.setLabel(this.T.get("Scan"));
						}

					},
					FP : function (value, max, maxwidth) {
						if (this.ZU != null && this.ZX != null) {
							this.ZU.setWidth(parseInt(value / max * maxwidth, 10));
							this.ZX.setValue(value + "/" + max);
						}
					},
					FJ : function () {
						try {
							this.ZM = {};
							this.ZE = [];
							var selectedBase = this.ZC.getSelection()[0].getModel();
							Addons.LocalStorage.setserver("Basescanner_LastCityID", selectedBase.get_Id());
							var ZQ = this.ZQ.getSelection()[0].getModel();
							Addons.LocalStorage.setserver("Basescanner_Cplimiter", ZQ);
							Addons.LocalStorage.setserver("Basescanner_minLevel", this.ZY.getValue());

							var c1 = this.ZK[0].getValue();
							var c2 = this.ZK[1].getValue();
							var c3 = this.ZK[2].getValue();
							var c4 = this.ZK[3].getValue();
							var c5 = parseInt(this.ZY.getValue(), 10);
							//console.log("Select", c1, c2, c3,c4,c5);
							Addons.LocalStorage.setserver("Basescanner_Show0", c1);
							Addons.LocalStorage.setserver("Basescanner_Show1", c2);
							Addons.LocalStorage.setserver("Basescanner_Show2", c3);
							Addons.LocalStorage.setserver("Basescanner_Show3", c4);
							var posX = selectedBase.get_PosX();
							var posY = selectedBase.get_PosY();
							var scanX = 0;
							var scanY = 0;
							var world = ClientLib.Data.MainData.GetInstance().get_World();
							console.info("Scanning from: " + selectedBase.get_Name());

							// world.CheckAttackBase (System.Int32 targetX ,System.Int32 targetY) -> ClientLib.Data.EAttackBaseResult
							// world.CheckAttackBaseRegion (System.Int32 targetX ,System.Int32 targetY) -> ClientLib.Data.EAttackBaseResult
							var t1 = true;
							var t2 = true;
							var t3 = true;

							var maxAttackDistance = ClientLib.Data.MainData.GetInstance().get_Server().get_MaxAttackDistance();
							for (scanY = posY - Math.floor(maxAttackDistance + 1); scanY <= posY + Math.floor(maxAttackDistance + 1); scanY++) {
								for (scanX = posX - Math.floor(maxAttackDistance + 1); scanX <= posX + Math.floor(maxAttackDistance + 1); scanX++) {
									var distX = Math.abs(posX - scanX);
									var distY = Math.abs(posY - scanY);
									var distance = Math.sqrt((distX * distX) + (distY * distY));
									if (distance <= maxAttackDistance) {
										var object = world.GetObjectFromPosition(scanX, scanY);
										var loot = {};
										if (object) {
											//console.log(object);

											if (object.Type == 1 && t1) {
												//console.log("object typ 1");
												//objfnkstrON(object);
												//t1 = !t1;
											}
											if (object.Type == 2 && t2) {
												//console.log("object typ 2");
												//objfnkstrON(object);
												//t2 = !t2;
											}

											if (object.Type == 3 && t3) {

												//console.log("object typ 3");
												//objfnkstrON(object);
												//t3 = !t3;
											}

											if (object.Type == 3) {
												if (c5 <= parseInt(object.getLevel(), 10)) {
													//console.log(object);
												}
											}

											//if(object.ConditionBuildings>0){
											var needcp = selectedBase.CalculateAttackCommandPointCostToCoord(scanX, scanY);
											if (needcp <= ZQ && typeof object.getLevel == 'function') {
												if (c5 <= parseInt(object.getLevel(), 10)) {
													// 0:ID , 1:Scanned, 2:Name, 3:Location, 4:Level, 5:Tib, 6:Kristal, 7:Credits, 8:Forschung, 9:Kristalfelder, 10:Tiberiumfelder,
													// 11:ConditionBuildings,12:ConditionDefense,13: CP pro Angriff , 14: defhp/offhp , 15:sum tib,krist,credits, 16: sum/cp
													var d = this.FL(object.getID(), 0);
													var e = this.FL(object.getID(), 1);
													if (e != null) {
														this.ZM[object.getID()] = e;
													}

													if (object.Type == 1 && c1) { //User
														//console.log("object ID LEVEL", object.getID() ,object.getLevel() );
														if (d != null) {
															this.ZE.push(d);
														} else {
															this.ZE.push([object.getID(),  - 1, this.T.get("Player"), scanX + ":" + scanY, object.getLevel(), 0, 0, 0, 0, 0, 0, 0, 0, needcp, 0, 0, 0, 0]);
														}
													}
													if (object.Type == 2 && c2) { //basen
														//console.log("object ID LEVEL", object.getID() ,object.getLevel() );
														if (d != null) {
															this.ZE.push(d);
														} else {
															this.ZE.push([object.getID(),  - 1, this.T.get("Bases"), scanX + ":" + scanY, object.getLevel(), 0, 0, 0, 0, 0, 0, 0, 0, needcp, 0, 0, 0, 0]);
														}
													}
													if (object.Type == 3 && (c3 || c4)) { //Lager Vposten
														//console.log("object ID LEVEL", object.getID() ,object.getLevel() );
														if (d != null) {
															if (object.getCampType() == 2 && c4) {
																this.ZE.push(d);
															}
															if (object.getCampType() == 3 && c3) {
																this.ZE.push(d);
															}

														} else {
															if (object.getCampType() == 2 && c4) {
																this.ZE.push([object.getID(),  - 1, this.T.get("Camp"), scanX + ":" + scanY, object.getLevel(), 0, 0, 0, 0, 0, 0, 0, 0, needcp, 0, 0, 0, 0]);
															}
															if (object.getCampType() == 3 && c3) {
																this.ZE.push([object.getID(),  - 1, this.T.get("Outpost"), scanX + ":" + scanY, object.getLevel(), 0, 0, 0, 0, 0, 0, 0, 0, needcp, 0, 0, 0, 0]);
															}
														}
													}
												}
											}
											//}
										}
									}
								}
							}
							this.ZH = true;
							this.ZL.setData(this.ZE);
							this.FP(0, this.ZE.length, 200);
							this.ZL.sortByColumn(4, false); //Sort form Highlevel to Lowlevel
							if (this.YY.name != "DR01D")
								window.setTimeout("window.Addons.BaseScannerGUI.getInstance().FG()", 50);
						} catch (ex) {
							console.debug("Maelstrom_Basescanner FJ error: ", ex);
						}
					},
					FG : function () {
						try {
							var retry = false;
							var loops = 0;
							var maxLoops = 10;
							var i = 0;
							var sleeptime = 150;
							while (!retry) {
								var ncity = null;
								var selectedid = 0;
								var id = 0;
								if (this.ZE == null) {
									console.warn("data null: ");
									this.ZH = false;
									break;
								}
								for (i = 0; i < this.ZE.length; i++) {
									// 1= "LoadState"
									if (this.ZE[i][1] == -1) {
										break;
									}
								}

								if (i == this.ZE.length) {
									this.ZH = false;
								}
								this.FP(i, this.ZE.length, 200); //Progressbar
								if (this.ZE[i] == null) {
									console.warn("data[i] null: ");
									this.ZH = false;
									this.ZG.setLabel(this.T.get("Scan"));
									this.ZD.setEnabled(true);
									break;
								}
								posData = this.ZE[i][3];
								/* make sure coordinates are well-formed enough */
								if (posData != null && posData.split(':').length == 2) {
									posX = parseInt(posData.split(':')[0]);
									posY = parseInt(posData.split(':')[1]);
									/* check if there is any base */
									var playerbase = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
									var world = ClientLib.Data.MainData.GetInstance().get_World();
									var foundbase = world.CheckFoundBase(posX, posY, playerbase.get_PlayerId(), playerbase.get_AllianceId());
									//console.log("foundbase",foundbase);
									this.ZE[i][19] = (foundbase == 0) ? true : false;
									//var obj = ClientLib.Vis.VisMain.GetInstance().get_SelectedObject();
									//console.log("obj", obj);
									id = this.ZE[i][0];
									ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentCityId(id);
									ncity = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(id);
									//console.log("ncity", ncity);
									if (ncity != null) {
										if (!ncity.get_IsGhostMode()) {
											//if(ncity.get_Name() != null)
											//console.log("ncity.get_Name ", ncity.get_Name() , ncity.get_CityBuildingsData().get_Buildings());
											//var cityBuildings = ncity.get_CityBuildingsData();
											var cityUnits = ncity.get_CityUnitsData();
											if (cityUnits != null) { // cityUnits !=null können null sein
												//console.log("ncity.cityUnits", cityUnits );

												var selectedBase = this.ZC.getSelection()[0].getModel();
												var buildings = ncity.get_Buildings().d;
												var defenseUnits = cityUnits.get_DefenseUnits().d;
												var offensivUnits = selectedBase.get_CityUnitsData().get_OffenseUnits().d;
												//console.log(buildings,defenseUnits,offensivUnits);

												if (buildings != null) //defenseUnits !=null können null sein
												{
													var buildingLoot = getResourcesPart(buildings);
													var unitLoot = getResourcesPart(defenseUnits);

													//console.log("buildingLoot", buildingLoot);
													//console.log("unitLoot", unitLoot);
													this.ZE[i][2] = ncity.get_Name();
													this.ZE[i][5] = buildingLoot[ClientLib.Base.EResourceType.Tiberium] + unitLoot[ClientLib.Base.EResourceType.Tiberium];
													this.ZE[i][6] = buildingLoot[ClientLib.Base.EResourceType.Crystal] + unitLoot[ClientLib.Base.EResourceType.Crystal];
													this.ZE[i][7] = buildingLoot[ClientLib.Base.EResourceType.Gold] + unitLoot[ClientLib.Base.EResourceType.Gold];
													this.ZE[i][8] = buildingLoot[ClientLib.Base.EResourceType.ResearchPoints] + unitLoot[ClientLib.Base.EResourceType.ResearchPoints];
													//console.log(posX,posY,"GetBuildingsConditionInPercent", ncity.GetBuildingsConditionInPercent() );
													if (ncity.GetBuildingsConditionInPercent() != 0) {
														this.ZA = 0;
														if (this.ZE[i][5] != 0) {
															var c = 0;
															var t = 0;
															var m = 0;
															var k = 0;
															var l = 0;
															this.ZM[id] = new Array(9);
															for (m = 0; m < 9; m++) {
																this.ZM[id][m] = new Array(8);
															}
															for (k = 0; k < 9; k++) {
																for (l = 0; l < 8; l++) {
																	//console.log( ncity.GetResourceType(k,l) );
																	switch (ncity.GetResourceType(k, l)) {
																	case 1:
																		/* Crystal */
																		this.ZM[id][k][l] = 1;
																		c++;
																		break;
																	case 2:
																		/* Tiberium */
																		this.ZM[id][k][l] = 2;
																		t++;
																		break;
																	default:
																		//none
																		break;
																	}
																}
															}
															//console.log( c,t );


															this.ZE[i][9] = c;
															this.ZE[i][10] = t;
															this.ZE[i][11] = ncity.GetBuildingsConditionInPercent();
															this.ZE[i][12] = ncity.GetDefenseConditionInPercent();

															try {
																var u = offensivUnits;
																//console.log("OffenseUnits",u);
																var offhp = 0;
																var defhp = 0;
																for (var g in u) {
																	offhp += u[g].get_Health();
																}

																u = defenseUnits;
																//console.log("DefUnits",u);
																for (var g in u) {
																	defhp += u[g].get_Health();
																}

																u = buildings;
																//console.log("DefUnits",u);
																for (var g in u) {
																	//var id=0;
																	//console.log("MdbUnitId",u[g].get_MdbUnitId());
																	var mid = u[g].get_MdbUnitId();
																	//DF
																	if (mid == 158 || mid == 131 || mid == 195) {
																		this.ZE[i][18] = 8 - u[g].get_CoordY();
																	}
																	//CY
																	if (mid == 112 || mid == 151 || mid == 177) {
																		this.ZE[i][17] = 8 - u[g].get_CoordY();
																	}
																}

																//console.log("HPs",offhp,defhp, (defhp/offhp) );
															} catch (x) {
																console.debug("HPRecord", x);
															}
															this.ZE[i][14] = (defhp / offhp);

															this.ZE[i][15] = this.ZE[i][5] + this.ZE[i][6] + this.ZE[i][7];
															this.ZE[i][16] = this.ZE[i][15] / this.ZE[i][13];

															this.ZE[i][1] = 0;
															retry = true;
															console.info(ncity.get_Name(), " finish");
															this.ZA = 0;
															this.countlastidchecked = 0;
															//console.log(this.ZE[i],this.ZM[id],id);
															this.FK(this.ZE[i], this.ZM[id], id);
															//update table
															this.ZL.setData(this.ZE);
														}
													} else {
														if (this.ZA > 250) {
															console.info(this.ZE[i][2], " on ", posX, posY, " removed (GetBuildingsConditionInPercent == 0)");
															this.ZE.splice(i, 1); //entfernt element aus array
															this.ZA = 0;
															this.countlastidchecked = 0;
															break;
														}
														this.ZA++;
													}
												}
											}
										} else {
											console.info(this.ZE[i][2], " on ", posX, posY, " removed (IsGhostMode)");
											this.ZE.splice(i, 1); //entfernt element aus array
											break;
										}
									}
								}
								loops++;
								if (loops >= maxLoops) {
									retry = true;
									break;
								}
							}

							//console.log("getResourcesByID end ", this.ZH, Addons.BaseScannerGUI.getInstance().isVisible());
							if (this.lastid != i) {
								this.lastid = i;
								this.countlastidchecked = 0;
								this.ZA = 0;
							} else {
								if (this.countlastidchecked > 16) {
									console.info(this.ZE[i][2], " on ", posX, posY, " removed (found no data)");
									this.ZE.splice(i, 1); //entfernt element aus array
									this.countlastidchecked = 0;
								} else if (this.countlastidchecked > 10) {
									sleeptime = 500;
								} else if (this.countlastidchecked > 4) {
									sleeptime = 250;
								}
								this.countlastidchecked++;
							}
							//console.log("this.ZH", this.ZH);
							if (this.ZH && Addons.BaseScannerGUI.getInstance().isVisible()) {
								//console.log("loop");
								window.setTimeout("window.Addons.BaseScannerGUI.getInstance().FG()", sleeptime);
							} else {
								this.ZG.setLabel(this.T.get("Scan"));
								this.ZH = false;
							}
						} catch (e) {
							console.debug("MaelstromTools_Basescanner getResources", e);
						}
					},
					FK : function (dataa, datab, id) {
						this.ZZ.push(dataa);
						this.ZS[id] = datab;
					},
					FL : function (id, t) {
						if (t == 0) {
							for (var i = 0; i < this.ZZ.length; i++) {
								if (this.ZZ[i][0] == id) {
									return this.ZZ[i];
								}
							}
						} else {
							if (this.ZS[id]) {
								return this.ZS[id];
							}
						}
						return null;
					}

				}
			});

			qx.Class.define("Addons.BaseScannerLayout", {
				type : "singleton",
				extend : qx.ui.window.Window,
				construct : function () {
					try {
						this.base(arguments);
						console.info("Addons.BaseScannerLayout " + window.__msbs_version);
						this.setWidth(820);
						this.setHeight(400);
						this.setContentPadding(10);
						this.setShowMinimize(false);
						this.setShowMaximize(true);
						this.setShowClose(true);
						this.setResizable(true);
						this.setAllowMaximize(true);
						this.setAllowMinimize(false);
						this.setAllowClose(true);
						this.setShowStatusbar(false);
						this.setDecorator(null);
						this.setPadding(10);
						this.setLayout(new qx.ui.layout.Grow());

						this.ZW = [];
						this.removeAll();
						this.ZZ = new qx.ui.container.Scroll();
						this.ZY = new qx.ui.container.Composite(new qx.ui.layout.Flow());
						this.add(this.ZZ, {
							flex : 3
						});
						this.ZZ.add(this.ZY);
						//this.FO();
					} catch (e) {
						console.debug("Addons.BaseScannerLayout.construct: ", e);
					}
				},
				members : {
					ZW : null,
					ZZ : null,
					ZY : null,
					ZX : null,
					openWindow : function (title) {
						try {
							this.setCaption(title);
							if (this.isVisible()) {
								this.close();
							} else {
								this.open();
								this.moveTo(100, 100);
								this.FO();
							}
						} catch (e) {
							console.log("Addons.BaseScannerLayout.openWindow: ", e);
						}
					},
					FO : function () {
						var ZM = window.Addons.BaseScannerGUI.getInstance().ZM;
						var ZE = window.Addons.BaseScannerGUI.getInstance().ZE;
						this.ZX = [];
						var selectedtype = window.Addons.BaseScannerGUI.getInstance().ZJ.getSelection()[0].getModel();
						//console.log("FO: " , ZM.length);
						var rowDataLine = null;
						if (ZE == null) {
							console.info("ZE null: ");
							return;
						}
						//console.log("FO: " , ZM);
						this.ZW = [];
						var id;
						var i;
						var x;
						var y;
						var a;
						for (id in ZM) {
							for (i = 0; i < ZE.length; i++) {
								if (ZE[i][0] == id) {
									rowDataLine = ZE[i];
								}
							}

							if (rowDataLine == null) {
								continue;
							}
							//console.log("ST",selectedtype,rowDataLine[10]);
							if (selectedtype > 4 && selectedtype < 8) {
								if (selectedtype != rowDataLine[10]) {
									continue;
								}
							} else {
								continue;
							}

							posData = rowDataLine[3];
							if (posData != null && posData.split(':').length == 2) {
								posX = parseInt(posData.split(':')[0]);
								posY = parseInt(posData.split(':')[1]);
							}
							var st = '<table border="2" cellspacing="0" cellpadding="0">';
							var link = rowDataLine[2] + " - " + rowDataLine[3];
							st = st + '<tr><td colspan="9"><font color="#FFF">' + link + '</font></td></tr>';
							for (y = 0; y < 8; y++) {
								st = st + "<tr>";
								for (x = 0; x < 9; x++) {
									var img = "";
									var res = ZM[id][x][y];
									//console.log("Res ",res);
									switch (res == undefined ? 0 : res) {
									case 2:
										//console.log("Tiberium " , MT_Base.images[MaelstromTools.Statics.Tiberium] );
										img = '<img width="14" height="14" src="' + MT_Base.images[MaelstromTools.Statics.Tiberium] + '">';
										break;
									case 1:
										//console.log("Crystal ");
										img = '<img width="14" height="14" src="' + MT_Base.images[MaelstromTools.Statics.Crystal] + '">';
										break;
									default:
										img = '<img width="14" height="14" src="' + MT_Base.images["Emptypixels"] + '">';
										break;
									}
									st = st + "<td>" + img + "</td>";
								}
								st = st + "</tr>";
							}
							st = st + "</table>";
							//console.log("setWidgetLabels ", st);
							var l = new qx.ui.basic.Label().set({
									backgroundColor : "#303030",
									value : st,
									rich : true
								});
							l.cid = id;
							this.ZX.push(id);
							l.addListener("click", function (e) {

								//console.log("clickid ", this.cid, );
								//webfrontend.gui.UtilView.openCityInMainWindow(this.cid);
								var bk = qx.core.Init.getApplication();
								bk.getBackgroundArea().closeCityInfo();
								bk.getPlayArea().setView(ClientLib.Data.PlayerAreaViewMode.pavmCombatSetupDefense, this.cid, 0, 0);
								var q = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
								if (q != null)
									q.get_CityArmyFormationsManager().set_CurrentTargetBaseId(this.cid);

							});
							l.setReturnValue = id;
							this.ZW.push(l);
						}
						this.ZY.removeAll();
						var b = 0;
						var c = 0;
						//console.log("this.ZW.length",this.ZW.length);
						for (a = 0; a < this.ZW.length; a++) {
							this.ZY.add(this.ZW[a], {
								row : b,
								column : c
							});
							c++;
							if (c > 4) {
								c = 0;
								b++;
							}
						}
					}
				}
			});

			qx.Class.define("Addons.LocalStorage", {
				type : "static",
				extend : qx.core.Object,
				statics : {
					isSupported : function () {
						return typeof(localStorage) !== "undefined";
					},
					isdefined : function (key) {
						return (localStorage[key] !== "undefined" && localStorage[key] != null);
					},
					isdefineddata : function (data, key) {
						return (data[key] !== "undefined" && data[key] != null);
					},
					setglobal : function (key, value) {
						try {
							if (Addons.LocalStorage.isSupported()) {
								localStorage[key] = JSON.stringify(value);
							}
						} catch (e) {
							console.debug("Addons.LocalStorage.setglobal: ", e);
						}
					},
					getglobal : function (key, defaultValue) {
						try {
							if (Addons.LocalStorage.isSupported()) {
								if (Addons.LocalStorage.isdefined(key)) {
									return JSON.parse(localStorage[key]);
								}
							}
						} catch (e) {
							console.log("Addons.LocalStorage.getglobal: ", e);
						}
						return defaultValue;
					},
					setserver : function (key, value) {
						try {
							if (Addons.LocalStorage.isSupported()) {
								var sn = ClientLib.Data.MainData.GetInstance().get_Server().get_Name();
								var data;
								if (Addons.LocalStorage.isdefined(sn)) {
									try {
										data = JSON.parse(localStorage[sn]);
										if (!(typeof data === "object")) {
											data = {};
											console.debug("LocalStorage data from server not null, but not object");
										}
									} catch (e) {
										console.debug("LocalStorage data from server not null, but parsererror", e);
										data = {};
									}
								} else {
									data = {};
								}
								data[key] = value;
								localStorage[sn] = JSON.stringify(data);
							}
						} catch (e) {
							console.debug("Addons.LocalStorage.setserver: ", e);
						}
					},
					getserver : function (key, defaultValue) {
						try {
							if (Addons.LocalStorage.isSupported()) {
								var sn = ClientLib.Data.MainData.GetInstance().get_Server().get_Name();
								if (Addons.LocalStorage.isdefined(sn)) {
									var data = JSON.parse(localStorage[sn]);
									if (Addons.LocalStorage.isdefineddata(data, key)) {
										return data[key];
									}
								}
							}
						} catch (e) {
							console.log("Addons.LocalStorage.getserver: ", e);
						}
						return defaultValue;
					}
				}
			});
			
			if(typeof Addons.Language === 'undefined'){
				qx.Class.define("Addons.Language", {
					type : "singleton",
					extend : qx.core.Object,
					members : {
						d : {},
						debug : false,
						addtranslateobj : function (o) {
							if ( o.hasOwnProperty("main") ){
								this.d[o.main.toString()] = o;								
								if(this.debug){
									console.log("Translate Added ", o.main.toString() );
								}
								delete o.main;								
							} else {
								console.debug("Addons.Language.addtranslateobj main not define");
							}
						},
						get : function (t) {
							var locale = qx.locale.Manager.getInstance().getLocale();
							var loc = locale.split("_")[0];
							if ( this.d.hasOwnProperty(t) ){
								if ( this.d[t].hasOwnProperty(loc) ){
									return this.d[t][loc];
								}
							}
							if(this.debug){
								console.debug("Addons.Language.get ", t, " not translate for locale ", loc);
							}
							return t;
						}
					}
				});
			}
			
			qx.Class.define("qx.ui.table.cellrenderer.Replace", {
				extend : qx.ui.table.cellrenderer.Default,

				properties : {

					replaceMap : {
						check : "Object",
						nullable : true,
						init : null
					},
					replaceFunction : {
						check : "Function",
						nullable : true,
						init : null
					}
				},
				members : {
					// overridden
					_getContentHtml : function (cellInfo) {
						var value = cellInfo.value;
						var replaceMap = this.getReplaceMap();
						var replaceFunc = this.getReplaceFunction();
						var label;

						// use map
						if (replaceMap) {
							label = replaceMap[value];
							if (typeof label != "undefined") {
								cellInfo.value = label;
								return qx.bom.String.escape(this._formatValue(cellInfo));
							}
						}

						// use function
						if (replaceFunc) {
							cellInfo.value = replaceFunc(value);
						}
						return qx.bom.String.escape(this._formatValue(cellInfo));
					},

					addReversedReplaceMap : function () {
						var map = this.getReplaceMap();
						for (var key in map) {
							var value = map[key];
							map[value] = key;
						}
						return true;
					}
				}
			});
			
			
			console.info("Maelstrom_Basescanner initalisiert");
			
			var T = Addons.Language.getInstance();
			T.debug = false;
			T.addtranslateobj( {main:"Point", de: "Position", pt: "Position", fr: "Position"} );
			T.addtranslateobj( {main:"BaseScanner Overview", de: "Basescanner Übersicht", pt: "Visão geral do scanner de base", fr: "Aperçu du scanner de base"} );
			T.addtranslateobj( {main:"Scan", de: "Scannen", pt: "Esquadrinhar", fr: "Balayer"} );
			T.addtranslateobj( {main:"Location", de: "Lage", pt: "localização", fr: "Emplacement"} );
			T.addtranslateobj( {main:"Player", de: "Spieler", pt: "Jogador", fr: "Joueur"} );
			T.addtranslateobj( {main:"Bases", de: "Bases", pt: "Bases", fr: "Bases"} );
			T.addtranslateobj( {main:"Camp,Outpost", de: "Lager,Vorposten", pt: "Camp,posto avançado", fr: "Camp,avant-poste"} );
			T.addtranslateobj( {main:"Camp", de: "Lager", pt: "Camp", fr: "Camp"} );						
			T.addtranslateobj( {main:"Outpost", de: "Vorposten", pt: "posto avançado", fr: "avant-poste"} );
			T.addtranslateobj( {main:"BaseScanner Layout", de: "BaseScanner Layout", pt: "Layout da Base de Dados de Scanner", fr: "Mise scanner de base"} );
			T.addtranslateobj( {main:"Show Layouts", de: "Layouts anzeigen", pt: "Mostrar Layouts", fr: "Voir Layouts"} );						
			T.addtranslateobj( {main:"Building state", de: "Gebäudezustand", pt: "construção do Estado", fr: "construction de l'État"} );
			T.addtranslateobj( {main:"Defense state", de: "Verteidigungszustand", pt: "de Defesa do Estado", fr: "défense de l'Etat"} );
			T.addtranslateobj( {main:"CP", de: "KP", pt: "CP", fr: "CP"} );
			T.addtranslateobj( {main:"CP Limit", de: "KP begrenzen", pt: "CP limitar", fr: "CP limiter"} );						
			T.addtranslateobj( {main:"min Level", de: "min. Level", pt: "nível mínimo", fr: "niveau minimum"} );
			T.addtranslateobj( {main:"clear Cache", de: "Cache leeren", pt: "limpar cache", fr: "vider le cache"} );
			T.addtranslateobj( {main:"Only center on World", de: "Nur auf Welt zentrieren", pt: "Único centro no Mundial", fr: "Seul centre sur World"} );
			T.addtranslateobj( {main:"base set up at", de: "Basis errichtbar", pt: "base de configurar a", fr: "mis en place à la base"} );	
			T.addtranslateobj( {main:"Infantry", de: "Infanterie", pt: "Infantaria", fr: "Infanterie"} );
			T.addtranslateobj( {main:"Vehicle", de: "Fahrzeuge", pt: "Veículos", fr: "Vehicule"} );
			T.addtranslateobj( {main:"Aircraft", de: "Flugzeuge", pt: "Aeronaves", fr: "Aviation"} );
			T.addtranslateobj( {main:"Tiberium", de: "Tiberium", pt: "Tibério", fr: "Tiberium"} );
			T.addtranslateobj( {main:"Crystal", de: "Kristalle", pt: "Cristal", fr: "Cristal"} );
			T.addtranslateobj( {main:"Power", de: "Strom", pt: "Potência", fr: "Energie"} );
			T.addtranslateobj( {main:"Dollar", de: "Credits", pt: "Créditos", fr: "Crédit"} );
			T.addtranslateobj( {main:"Research", de: "Forschung", pt: "Investigação", fr: "Recherche"} );
			T.addtranslateobj( {main:"-----", de: "--", pt: "--", fr: "--"} );
			

			
			
			var MT_Lang = null;
			var MT_Cache = null;
			var MT_Base = null;
			var fileManager = null;
			var lastid = 0;
			var countlastidchecked = 0;
			fileManager = ClientLib.File.FileManager.GetInstance();
			MT_Lang = window.MaelstromTools.Language.getInstance();
			MT_Cache = window.MaelstromTools.Cache.getInstance();
			MT_Base = window.MaelstromTools.Base.getInstance();

			MT_Base.createNewImage("BaseScanner", "ui/icons/icon_item.png", fileManager);
			MT_Base.createNewImage("Emptypixels", "ui/menues/main_menu/misc_empty_pixel.png", fileManager);
			var openBaseScannerOverview = MT_Base.createDesktopButton(T.get("BaseScanner Overview") + "version " + window.__msbs_version, "BaseScanner", false, MT_Base.desktopPosition(2));
			openBaseScannerOverview.addListener("execute", function () {
				Addons.BaseScannerGUI.getInstance().openWindow(T.get("BaseScanner Overview") + " version " + window.__msbs_version);
			}, this);
			Addons.BaseScannerGUI.getInstance().addListener("close", Addons.BaseScannerGUI.getInstance().FN, Addons.BaseScannerGUI.getInstance());
			//this.addListener("resize", function(){ }, this );
			
			MT_Base.addToMainMenu("BaseScanner", openBaseScannerOverview);
			
			if(typeof Addons.AddonMainMenu !== 'undefined'){
				var addonmenu = Addons.AddonMainMenu.getInstance();
				addonmenu.AddMainMenu("Basescanner", function () {
					Addons.BaseScannerGUI.getInstance().openWindow(T.get("BaseScanner Overview") + " version " + window.__msbs_version);
				},"ALT+B");
			}
			
		}

		function getResourcesPart(cityEntities) {
			try {
				var loot = [0, 0, 0, 0, 0, 0, 0, 0];
				if (cityEntities == null) {
					return loot;
				}

				for (var i in cityEntities) {
					var cityEntity = cityEntities[i];
					var unitLevelRequirements = MaelstromTools.Wrapper.GetUnitLevelRequirements(cityEntity);

					for (var x = 0; x < unitLevelRequirements.length; x++) {
						loot[unitLevelRequirements[x].Type] += unitLevelRequirements[x].Count * cityEntity.get_HitpointsPercent();
						if (cityEntity.get_HitpointsPercent() < 1.0) {
							// destroyed

						}
					}
				}
				return loot;
			} catch (e) {
				console.debug("MaelstromTools_Basescanner getResourcesPart", e);
			}
		}

		function objfnkstrON(obj) {
			var key;
			for (key in obj) {
				if (typeof(obj[key]) == "function") {
					var s = obj[key].toString();
					console.debug(key, s);
					//var protostring = s.replace(/\s/gim, "");
					//console.log(key, protostring);
				}
			}
		}

		function foundfnkstring(obj, redex, objname, n) {
			var redexfounds = [];
			var s = obj.toString();
			var protostring = s.replace(/\s/gim, "");
			redexfounds = protostring.match(redex);
			var i;
			for (i = 1; i < (n + 1); i++) {
				if (redexfounds != null && redexfounds[i].length == 6) {
					console.debug(objname, i, redexfounds[i]);
				} else if (redexfounds != null && redexfounds[i].length > 0) {
					console.warn(objname, i, redexfounds[i]);
				} else {
					console.error("Error - ", objname, i, "not found");
					console.warn(objname, protostring);
				}
			}
			return redexfounds;
		}

		function MaelstromTools_Basescanner_checkIfLoaded() {
			try {
				if (typeof qx != 'undefined' && typeof MaelstromTools != 'undefined') {
					createMaelstromTools_Basescanner();
				} else {
					window.setTimeout(MaelstromTools_Basescanner_checkIfLoaded, 1000);
				}
			} catch (e) {
				console.debug("MaelstromTools_Basescanner_checkIfLoaded: ", e);
			}
		}
		if (/commandandconquer\.com/i.test(document.domain)) {
			window.setTimeout(MaelstromTools_Basescanner_checkIfLoaded, 10000);
		}
	};
	try {
		var MaelstromScript_Basescanner = document.createElement("script");
		MaelstromScript_Basescanner.innerHTML = "(" + MaelstromTools_Basescanner.toString() + ")();";
		MaelstromScript_Basescanner.type = "text/javascript";
		if (/commandandconquer\.com/i.test(document.domain)) {
			document.getElementsByTagName("head")[0].appendChild(MaelstromScript_Basescanner);
		}
	} catch (e) {
		console.debug("MaelstromTools_Basescanner: init error: ", e);
	}
})();



/***********************************************************************************
Navigate To Coords ***** Version 1.1
***********************************************************************************/
// ==UserScript==
// @include   	https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// ==UserScript==
(function (){
    var nav_load_main = function() {  
        
        var navBox = null;
        var navBox_x = null;
        var navBox_y = null;
        
        function log_it(e){
            if (typeof console != 'undefined') console.log('[NAV] '+e);
            else if (window.opera) opera.postError('[NAV] '+e);
            else GM_log('[NAV] '+e);   
        }
        
        function closeNavigate(){
            navBox.close();
        }
        
        
        function doNavigate(){
            
            var x = navBox_x.getValue();
            var y = navBox_y.getValue();
            
            log_it(x+':'+y);
            try 
            {
                ClientLib.Vis.VisMain.GetInstance().CenterGridPosition(x,y);
            }
            catch (ex)
            {   
                log_it('ERROR: '+ex);
            }
            
            closeNavigate();
        }
        
        
        function initialize() {
            console.log("Navigate Loaded...");     
            var addonmenu = Addons.AddonMainMenu.getInstance();	
            addonmenu.AddMainMenu("Navigate",function(){ navBox.open(); },"ALT+N"); 
            
            navBox = new qx.ui.window.Window("Map Navi");
            navBox.setPadding(1);
            navBox.setLayout(new qx.ui.layout.Grow());
            // this.navBox.setLayout(new qx.ui.layout.VBox());
            var layout = new qx.ui.layout.Grid();
            layout.setSpacing(5);
            layout.setColumnAlign(1,"left", "center");
            layout.setColumnAlign(0,"left", "bottom");
            navBox.setLayout(layout);
            navBox.setShowMaximize(false);
            navBox.setShowMinimize(false);
            navBox.moveTo(600, 100);
            navBox.setHeight(150);
            navBox.setWidth(110);
            navBox.setMinWidth(10);
            navBox.setMinHeight(10);
            // TextField
            navBox_x = new qx.ui.form.Spinner();
            navBox_y = new qx.ui.form.Spinner();
            
            navBox_x.setMinimum(0);
            navBox_x.setMaximum(1000);
            
            navBox_y.setMinimum(0);
            navBox_y.setMaximum(1000);
            
            navBox_x.setValue(500);
            navBox_y.setValue(500);
            
            
            navBox_x.addListener("keyup", function(e) {
                if(e.getKeyCode() == 13) {
                    doNavigate();
                }
            }, this);
            
            navBox_y.addListener("keyup", function(e) {
                if(e.getKeyCode() == 13) {
                    doNavigate();
                }
            }, this);
            
            
            var makeLbl = function(name) {
                var lbl =  new qx.ui.basic.Label(name);
                lbl.setTextColor("white");
                return lbl;
            }
            
            
            navBox.add(makeLbl("X:"), {row:0, column:0});
            navBox.add(navBox_x, {row:0, column:1});
            
            navBox.add(makeLbl("Y:"), {row:1, column:0});
            navBox.add(navBox_y, {row:1, column:1});
            
            var bt = new qx.ui.form.Button("Navigate");
            bt.set({
                appearance : "button-text-small",
                toolTipText : "Navigate to"
            });
            
            bt.addListener("click", function() { doNavigate(); }, this);
            navBox.add(bt,{row:2,column:1});
            
        }
        
        function nav_checkIfLoaded() {
            try {
                if (typeof qx != 'undefined' && typeof Addons != 'undefined') {
                    a = qx.core.Init.getApplication(); // application
                    mb = qx.core.Init.getApplication().getMenuBar();
                    addonmenu = Addons.AddonMainMenu.getInstance();
                    if (a && mb && addonmenu) {
                        initialize();
                    } else
                        window.setTimeout(nav_checkIfLoaded, 1000);
                } else {
                    window.setTimeout(nav_checkIfLoaded, 1000);
                }
            } catch (e) {
                log_it(e);
            }
        }
        
        if (/commandandconquer\.com/i.test(document.domain)) {
            window.setTimeout(nav_checkIfLoaded, 1000);
        }
    }
    
    // injecting, because there seem to be problems when creating game interface with unsafeWindow
    var navScript = document.createElement("script");
    navScript.innerHTML = "(" + nav_load_main.toString() + ")();";
    navScript.type = "text/javascript";
    if (/commandandconquer\.com/i.test(document.domain)) {
        document.getElementsByTagName("head")[0].appendChild(navScript);
    }
})();


// ==UserScript==
// @name        C&C: TA POIs Analyser
// @description Display alliance's POIs scores and next tier requirements.
// @namespace   https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version     2.0.3
// @grant none
// @author      zdoom, Gryphon
// ==/UserScript==
(function () {
	var injectScript = function () {
		function create_ccta_pa_class() {
			qx.Class.define('ccta_pa', {
				type: 'singleton'
				, extend: qx.ui.tabview.Page,

				construct: function () {
					try {
						this.base(arguments);
						this.set({
							layout: new qx.ui.layout.Grow()
							, label: "Alliance POIs"
							, padding: 10
						});
						var root = this;
						var footerLayout = new qx.ui.layout.Grid();
						footerLayout.setColumnFlex(1, 1);
						var footer = new qx.ui.container.Composite(footerLayout).set({
							font: "font_size_13"
							, padding: [5, 10]
							, marginTop: 5
							, decorator: "pane-light-opaque"
						});
						var label = new qx.ui.basic.Label().set({
							textColor: "text-value"
							, font: "font_size_13"
							, padding: 10
							, alignX: 'right'
						});
						var checkBox = new qx.ui.form.CheckBox('Show/Hide image and alliance appreviation.')
						checkBox.set({
							textColor: webfrontend.gui.util.BBCode.clrLink
							, font: "font_size_13"
						});
						var abr = new qx.ui.basic.Label().set({
							alignX: 'center'
							, marginTop: 30
							, font: 'font_size_14'
							, textColor: 'black'
						});
						var manager = qx.theme.manager.Font.getInstance();
						var defaultFont = manager.resolve(abr.getFont());
						var newFont = defaultFont.clone();
						newFont.setSize(32);
						abr.setFont(newFont);
						var deco = new qx.ui.decoration.Background().set({
							backgroundImage: "http://archeikhmeri.co.uk/images/fop2.png"
						});
						var imgCont = new qx.ui.container.Composite(new qx.ui.layout.VBox());
						imgCont.set({
							minWidth: 363
							, minHeight: 356
							, maxWidth: 363
							, maxHeight: 356
							, decorator: deco
							, alignX: 'center'
						});
						var scrl = new qx.ui.container.Scroll();
						var cont = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
							allowGrowY: true
							, padding: 10
						});
						var gb = new qx.ui.groupbox.GroupBox("Statistics").set({
							layout: new qx.ui.layout.VBox()
							, marginLeft: 2
						});
						var lgb = new webfrontend.gui.GroupBoxLarge().set({
							layout: new qx.ui.layout.Canvas()
						});
						var lgbc = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
							padding: [50, 10, 20, 10]
						});
						var widget = new qx.ui.core.Widget().set({
							minWidth: 628
							, minHeight: 335
						});
						var html = new qx.html.Element('div', null, {
							id: "graph"
						});
						var info = new qx.ui.groupbox.GroupBox("Additional Information").set({
							layout: new qx.ui.layout.VBox()
							, marginTop: 10
						});
						var buttonCont = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
							marginTop: 10
						});
						var tableCont = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
							minWidth: 500
						});
						var grid = new qx.ui.container.Composite(new qx.ui.layout.Grid(2, 1));
						grid.add(buttonCont, {
							row: 1
							, column: 1
						});
						grid.add(tableCont, {
							row: 1
							, column: 2
						});
						var noAllianceLabel = new qx.ui.basic.Label('No Alliance found, please create or join an alliance.').set({
							maxHeight: 30
						});

						var data = ClientLib.Data.MainData.GetInstance();
						var alliance = data.get_Alliance();
						var exists = alliance.get_Exists();
						var allianceName = alliance.get_Name();
						var allianceAbbr = alliance.get_Abbreviation();
						var faction = ClientLib.Base.Util.GetFactionGuiPatchText();
						var fileManager = ClientLib.File.FileManager.GetInstance();
						var opois = alliance.get_OwnedPOIs();
						var poiUtil = ClientLib.Base.PointOfInterestTypes;
						var getScore = poiUtil.GetScoreByLevel;
						var getMultiplier = poiUtil.GetBoostModifierByRank;
						var getBonus = poiUtil.GetBonusByType;
						var getNextScore = poiUtil.GetNextScore;
						var startRank = ClientLib.Base.EPOIType.RankedTypeBegin;
						var endRank = ClientLib.Base.EPOIType.RankedTypeEnd;
						var maxPoiLevel = ClientLib.Data.MainData.GetInstance().get_Server().get_MaxCenterLevel();
						var poiInfo = phe.cnc.gui.util.Text.getPoiInfosByType;
						var startRank = ClientLib.Base.EPOIType.RankedTypeBegin;

						var tiersData = []
							, scoreData = []
							, bonusData = []
							, tiers = [];
						for (var i = 0; i < 50; i++) {
							var previousScore = (i == 0) ? 0 : bonusData[i - 1][1];
							var score = getNextScore(previousScore);
							var bonus = getBonus(startRank, score);
							var percent = getBonus(endRank - 1, score);
							if (score != previousScore) {
								bonusData[i] = [i + 1, score, bonus, percent + '%'];
								tiers[i] = [i, previousScore, score];
							} else break;
						}
						for (var i = 1; i <= maxPoiLevel; i++) {
							if (getScore(i + 1) == 1) continue;
							scoreData.push([i, getScore(i)]);
						}
						for (var i = 1; i < 41; i++) tiersData.push([i, '+' + getMultiplier(i) + '%']);

						var createTable = function () {

							var columns = [
								["POI Level", "Score"]
								, ["Tier", "Score Required", "Bonus", "Percentage"]
								, ["Rank", "Multiplier"]
							];
							var rows = [scoreData, bonusData, tiersData];

							var make = function (n) {
								var model = new qx.ui.table.model.Simple().set({
									columns: columns[n]
									, data: rows[n]
								});
								var table = new qx.ui.table.Table(model).set({
									columnVisibilityButtonVisible: false
									, headerCellHeight: 25
									, marginTop: 20
									, minWidth: 500
									, height: 400
								});
								var renderer = new qx.ui.table.cellrenderer.Default().set({
									useAutoAlign: false
								});
								for (i = 0; i < columns[n].length; i++) table.getTableColumnModel().setDataCellRenderer(i, renderer);
								return table;
							};
							this.Scores = make(0);
							this.Tiers = make(1);
							this.Multiplier = make(2);
						};
						var tables = new createTable();

						['Scores', 'Multiplier', 'Tiers'].map(function (key) {
							var table = tables[key];
							var button = new qx.ui.form.Button(key).set({
								width: 100
								, margin: [10, 10, 0, 10]
							});
							button.addListener('execute', function () {
								tableCont.removeAll();
								tableCont.add(table)
								scrl.scrollChildIntoViewY(tableCont, 'top');
							}, this);
							buttonCont.add(button);
						});

						info.add(grid);

						var tabview = new qx.ui.tabview.TabView().set({
							marginTop: 20
							, maxWidth: 500
							, maxHeight: 500
						});
						var coordsButton = new qx.ui.form.Button('Coords').set({
							width: 100
							, margin: [10, 10, 0, 10]
						});
						coordsButton.addListener('execute', function () {
							tableCont.removeAll();
							tableCont.add(tabview);
							scrl.scrollChildIntoViewY(tableCont, 'top');
						}, this);
						var res = [
							"ui/common/icn_res_tiberium.png"
							, "ui/common/icn_res_chrystal.png"
							, "ui/common/icn_res_power.png"
							, "ui/" + faction + "/icons/icon_arsnl_off_squad.png"
							, "ui/" + faction + "/icons/icon_arsnl_off_vehicle.png"
							, "ui/" + faction + "/icons/icon_arsnl_off_plane.png"
							, "ui/" + faction + "/icons/icon_def_army_points.png"
						];
						var columns = ['Coords', 'Level', 'Score']
							, models = []
							, pages = [];
						for (var i = 0; i < 7; i++) {
							var page = new qx.ui.tabview.Page().set({
								layout: new qx.ui.layout.VBox()
							});
							page.setIcon(fileManager.GetPhysicalPath(res[i]));
							var model = new qx.ui.table.model.Simple().set({
								columns: columns
							});
							model.sortByColumn(1, false);
							var table = new qx.ui.table.Table(model)
							table.set({
								columnVisibilityButtonVisible: false
								, headerCellHeight: 25
								, marginTop: 10
								, minWidth: 470
								, showCellFocusIndicator: false
								, height: 320
							});
							var renderer = new qx.ui.table.cellrenderer.Default().set({
								useAutoAlign: false
							});
							for (var n = 0; n < columns.length; n++) {
								if (n == 0) renderer = new qx.ui.table.cellrenderer.Html();
								table.getTableColumnModel().setDataCellRenderer(n, renderer);
							}
							page.add(table);
							tabview.add(page);
							models.push(model);
							pages.push(page);
						}
						this.__poisCoordsPages = pages;

						//Simulator
						var wrapper = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
							decorator: 'tabview-pane-clear'
							, padding: [10, 14, 13, 10]
							, marginTop: 20
						});
						var header = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
							decorator: 'pane-light-opaque'
							, padding: [8, 12]
						});
						var initValCont = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
							padding: [5, 0]
							, marginLeft: 20
						});
						var initVals = ['Score:', 'Tier: ', 'Rank:', 'Bonus:']
							, valueLabels = [];
						for (var i = 0; i < 4; i++) {
							var initCont = new qx.ui.container.Composite(new qx.ui.layout.HBox());
							var ln = new qx.ui.basic.Label(initVals[i]).set({
								textColor: webfrontend.gui.util.BBCode.clrLink
								, font: 'font_size_11'
							});
							var lv = new qx.ui.basic.Label().set({
								font: 'font_size_11'
								, paddingLeft: 5
								, paddingRight: 10
							});
							initCont.add(ln);
							initCont.add(lv);
							initValCont.add(initCont, {
								flex: 1
							});
							valueLabels.push(lv);
						}
						var mainCont = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
							maxWidth: 480
						});
						var modifierCont = new qx.ui.container.Composite(new qx.ui.layout.HBox());

						var rankingModel = new qx.ui.table.model.Simple().set({
							columns: ['Rank', 'Name', 'Score', 'Multiplier', 'Total Bonus']
						});

						/*
						var custom =
						{
							tableColumnModel : function(obj)
							{
								return new qx.ui.table.columnmodel.Resize(obj);
							}
						};
						*/

						//var rankingTable = new qx.ui.table.Table(rankingModel, custom);
						var rankingTable = new qx.ui.table.Table(rankingModel);
						rankingTable.set({
							columnVisibilityButtonVisible: false
							, headerCellHeight: 25
							, marginTop: 3
							, showCellFocusIndicator: false
							, statusBarVisible: false
							, keepFirstVisibleRowComplete: false
							, height: 105
						});
						for (var n = 0; n < 5; n++) {
							if (n == 1) rankingTable.getTableColumnModel().setDataCellRenderer(n, new qx.ui.table.cellrenderer.Html());
							else rankingTable.getTableColumnModel().setDataCellRenderer(n, new qx.ui.table.cellrenderer.Default().set({
								useAutoAlign: false
							}));
						}
						var rankingTableColumnModel = rankingTable.getTableColumnModel();
						/*
						var rankingTableResizeBehavior = rankingTableColumnModel.getBehavior();
						rankingTableResizeBehavior.setWidth(0, 50);
						rankingTableResizeBehavior.setWidth(1, "2*");
						rankingTableResizeBehavior.setWidth(2, 100);
						rankingTableResizeBehavior.setWidth(3, 70);
						rankingTableResizeBehavior.setWidth(4, 100);
						*/

						var resultsModel = new qx.ui.table.model.Simple().set({
							columns: ['Property', 'Value']
						});
						//var resultsTable = new qx.ui.table.Table(resultsModel, custom);
						var resultsTable = new qx.ui.table.Table(resultsModel);
						var resultsTableColumnModel = resultsTable.getTableColumnModel();
						/*
						var resultsTableResizeBehavior = resultsTableColumnModel.getBehavior();
						resultsTableResizeBehavior.setWidth(0, 100);
						resultsTableResizeBehavior.setWidth(1, "2*");
						*/
						resultsTable.set({
							columnVisibilityButtonVisible: false
							, headerCellHeight: 25
							, marginTop: 5
							, width: 210
							, maxWidth: 210
							, showCellFocusIndicator: false
							, height: 300
						});
						resultsTable.getTableColumnModel().setDataCellRenderer(0, new qx.ui.table.cellrenderer.Html());
						resultsTable.getTableColumnModel().setDataCellRenderer(1, new qx.ui.table.cellrenderer.Html());
						var codeToString = function (s) {
							return String.fromCharCode(s).toLowerCase()
						};
						label.setValue(String.fromCharCode(77) + [65, 68, 69, 32, 66, 89, 32, 90, 68, 79, 79, 77].map(codeToString).join().replace(/,/g, ''));

						var poisColumns = ['Coords', 'Level', 'Score', 'Enabled'];
						var poisModel = new qx.ui.table.model.Simple().set({
							columns: poisColumns
						});
						//var poisTable = new qx.ui.table.Table(poisModel, custom);
						var poisTable = new qx.ui.table.Table(poisModel);
						poisTable.set({
							columnVisibilityButtonVisible: false
							, headerCellHeight: 25
							, marginTop: 5
							, marginLeft: 5
							, showCellFocusIndicator: false
							, height: 300
						});
						for (var n = 0; n < 4; n++) {
							if (n == 0) poisTable.getTableColumnModel().setDataCellRenderer(n, new qx.ui.table.cellrenderer.Html());
							else if (n == 3) poisTable.getTableColumnModel().setDataCellRenderer(n, new qx.ui.table.cellrenderer.Boolean())
							else poisTable.getTableColumnModel().setDataCellRenderer(n, new qx.ui.table.cellrenderer.Default().set({
								useAutoAlign: false
							}));
						}
						var poisTableColumnModel = poisTable.getTableColumnModel();
						/*
						var poisTableResizeBehavior = poisTableColumnModel.getBehavior();
						poisTableResizeBehavior.setWidth(0, 70);
						poisTableResizeBehavior.setWidth(1, 50);
						poisTableResizeBehavior.setWidth(2, "2*");
						poisTableResizeBehavior.setWidth(3, 60);
						*/
						var selectionModel = poisTable.getSelectionManager().getSelectionModel();
						selectionModel.setSelectionMode(qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION_TOGGLE);
						poisTable.getSelectionModel().addListener('changeSelection', function (e) {
							var table = this.__poisTable;
							var tableModel = table.getTableModel();
							var data = tableModel.getDataAsMapArray();
							var score = 0;
							for (var i = 0; i < data.length; i++) {
								var isSelected = selectionModel.isSelectedIndex(i);
								var level = tableModel.getValue(1, i);
								tableModel.setValue(3, i, !isSelected);
								if (!isSelected) score += getScore(parseInt(level, 10));
							}
							this.__setResultsRows(score);
							this.__setRankingRows(score);
							table.setUserData('score', score);
						}, this);

						var addRowCont = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
							decorator: 'pane-light-opaque'
							, padding: [8, 12]
							, marginTop: 5
						});
						var selectPoiLabelCont = new qx.ui.container.Composite(new qx.ui.layout.HBox());
						var selectPoiLabel = new qx.ui.basic.Label('Select POI\'s Level').set({
							margin: [5, 10]
							, font: 'font_size_11'
						});
						var selectLevel = new qx.ui.form.SelectBox().set({
							padding: [5, 15]
						});
						for (var i = 12; i <= maxPoiLevel; i++) selectLevel.add(new qx.ui.form.ListItem('Level ' + i, null, i));
						var addButton = new qx.ui.form.Button('Add POI').set({
							padding: [5, 20]
						});
						var resetButton = new qx.ui.form.Button('Reset').set({
							padding: [5, 20]
							, marginLeft: 5
						});
						addButton.addListener('execute', function () {
							var level = selectLevel.getSelection()[0].getModel();
							var score = getScore(parseInt(level, 10));
							var originalScore = poisTable.getUserData('score');
							poisModel.addRows([
								['<p style="padding:0; margin:0; color:' + webfrontend.gui.util.BBCode.clrLink + '">New</p>', level, this.__format(score), true]
							]);
							var newScore = originalScore + score;
							this.__setResultsRows(newScore);
							this.__setRankingRows(newScore);
							poisTable.setUserData('score', newScore);
						}, this);
						resetButton.addListener('execute', this.__initSim, this);
						mainCont.add(rankingTable, {
							flex: 1
						});
						modifierCont.add(resultsTable);
						modifierCont.add(poisTable, {
							flex: 1
						});
						mainCont.add(modifierCont);
						selectPoiLabelCont.add(selectPoiLabel);
						addRowCont.add(selectLevel);
						addRowCont.add(selectPoiLabelCont, {
							flex: 1
						});
						addRowCont.add(addButton);
						addRowCont.add(resetButton);
						mainCont.add(addRowCont);

						var selectBox = new qx.ui.form.SelectBox().set({
							padding: [5, 20]
						});
						for (var i = 0; i < 7; i++) {
							var type = poiInfo(i + startRank).type;
							var listItem = new qx.ui.form.ListItem(type, null, type);
							selectBox.add(listItem);
						}
						selectBox.addListener('changeSelection', function (e) {
							if (!e.getData()[0]) return;
							var type = e.getData()[0].getModel();
							this.__selectedSimPoi = type;
							this.__initSim();
						}, this);

						header.add(selectBox);
						header.add(initValCont, {
							flex: 1
						});
						wrapper.add(header);
						wrapper.add(mainCont);

						this.__simLabels = valueLabels;
						this.__rankingModel = rankingModel;
						this.__resultsModel = resultsModel;
						this.__poisModel = poisModel;
						this.__poisTable = poisTable;
						this.__selectPoiLevel = selectLevel;
						this.__simCont = wrapper;
						this.__selectedSimPoi = poiInfo(startRank).type;

						var simulatorButton = new qx.ui.form.Button('Simulator').set({
							width: 100
							, margin: [10, 10, 0, 10]
						});
						simulatorButton.addListener('execute', function () {
							scrl.scrollChildIntoViewY(tableCont, 'top');
							tableCont.removeAll();
							tableCont.add(wrapper);
						}, this);
						////////////////////////////////////////////////////////////////////////////////////////////////////////


						var showImage = false;
						if (typeof localStorage.ccta_pa == 'undefined') {
							localStorage.ccta_pa = JSON.stringify({
								'showImage': false
							});
						} else showImage = JSON.parse(localStorage.ccta_pa).showImage;
						checkBox.setValue(showImage);

						var toggleImage = function () {
							var isChecked = checkBox.getValue();
							localStorage.ccta_pa = JSON.stringify({
								'showImage': isChecked
							});
							if (!isChecked) cont.remove(imgCont);
							else cont.addAt(imgCont, 0);
						};
						checkBox.addListener('changeValue', toggleImage, this);

						//footer.add(checkBox, {row: 0, column: 0});
						//footer.add(label, {row: 0, column: 1});
						scrl.add(cont);
						imgCont.add(abr);
						if (showImage) cont.add(imgCont);
						cont.add(lgb);
						lgb.add(lgbc);
						lgbc.add(gb);
						lgbc.add(info);
						lgbc.add(footer);
						widget.getContentElement().add(html);
						this.add(scrl);

						if (exists) {
							gb.add(widget);
							buttonCont.addAt(coordsButton, 0);
							buttonCont.addAt(simulatorButton, 1);
							tableCont.add(tabview);
							abr.setValue(allianceAbbr);
							this.__allianceName = allianceName;
							this.__allianceAbbr = allianceAbbr;
						} else {
							gb.add(noAllianceLabel);
							tableCont.add(tables.Scores);
							noAllianceLabel.setValue('No Alliance found, please create or join an alliance.');
							this.__isReset = true;
						}

						this.__models = models;
						this.__tableCont = tableCont;
						this.__timer = new qx.event.Timer(1000);
						this.__tiers = tiers;
						this.__timer.addListener('interval', this.__update, this);
						this.addListener('appear', function () {
							try {
								var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
								var allianceName = alliance.get_Name();
								var allianceAbbr = alliance.get_Abbreviation();
								var exists = alliance.get_Exists();
								if (!exists && !this.__isReset) {
									console.log('No alliance found');
									gb.removeAll();
									gb.add(noAllianceLabel);
									buttonCont.remove(coordsButton);
									buttonCont.remove(simulatorButton);
									tableCont.removeAll();
									tableCont.add(tables.Scores);
									abr.setValue('');
									this.__allianceName = '';
									this.__allianceAbbr = '';
									this.__pois = {};
									this.__isReset = true;
								} else if (exists) {
									if (this.__isReset) {
										gb.removeAll();
										gb.add(widget);
										buttonCont.addAt(coordsButton, 0);
										buttonCont.addAt(simulatorButton, 1);
										abr.setValue(allianceAbbr);
										this.__isReset = false;
										this.__allianceName = allianceName;
										this.__allianceAbbr = allianceAbbr;
									}
									tableCont.removeAll();
									tableCont.add(tabview);
									this.__update();
								}
							} catch (e) {
								console.log(e.toString())
							}
						}, this);

						var overlay = webfrontend.gui.alliance.AllianceOverlay.getInstance();
						var mainTabview = overlay.getChildren()[12].getChildren()[0];
						mainTabview.addAt(this, 0);
						mainTabview.setSelection([this]);
					} catch (e) {
						console.log(e.toString());
					}
				}
				, destruct: function () {}
				, members: {
					__isReset: false
					, __timer: null
					, __allianceName: null
					, __allianceAbbr: null
					, __pois: null
					, __tiers: null
					, __ranks: {}
					, __models: null
					, __poisCoordsPages: null
					, __tableCont: null
					, __simCont: null
					, __selectedSimPoi: null
					, __isolatedRanks: null
					, __simLabels: []
					, __rankingModel: null
					, __resultsModel: null
					, __poisModel: null
					, __poisTable: null
					, __selectPoi: null
					, __style: {
						"table": {
							"margin": "5px"
							, "borderTop": "1px solid #333"
							, "borderBottom": "1px solid #333"
							, "fontFamily": "Verdana, Geneva, sans-serif"
						}
						, "graph": {
							"td": {
								"width": "68px"
								, "verticalAlign": "bottom"
								, "textAlign": "center"
							}
							, "div": {
								"width": "24px"
								, "margin": "0 auto -1px auto"
								, "border": "3px solid #333"
								, "borderBottom": "none"
							}
						}
						, "icon": {
							"ul": {
								"listStyleType": "none"
								, "margin": 0
								, "padding": 0
							}
							, "div": {
								"padding": "6px"
								, "marginRight": "6px"
								, "display": "inline-block"
								, "border": "1px solid #000"
							}
							, "p": {
								"display": "inline"
								, "fontSize": "10px"
								, "color": "#555"
							}
							, "li": {
								"height": "15px"
								, "padding": "2px"
								, "marginLeft": "10px"
							}
						}
						, "cell": {
							"data": {
								"width": "68px"
								, "textAlign": "center"
								, "color": "#555"
								, "padding": "3px 2px"
							}
							, "header": {
								"color": "#416d96"
								, "padding": "3px 2px"
							}
						}
						, "rows": {
							"graph": {
								"borderBottom": "3px solid #333"
								, "height": "200px"
							}
							, "tr": {
								"fontSize": "11px"
								, "borderBottom": "1px solid #333"
								, "backgroundColor": "#d6dde1"
							}
						}
					},

					__element: function (tag) {
						var elm = document.createElement(tag)
							, root = this;
						this.css = function (a) {
							for (var b in a) {
								root.elm.style[b] = a[b];
								root.__style[b] = a[b];
							}
						}
						this.set = function (a) {
							for (var b in a) root.elm[b] = a[b];
						}
						this.append = function () {
							for (var i in arguments) {
								if (arguments[i].__instanceof == 'element') root.elm.appendChild(arguments[i].elm);
								else if (arguments[i] instanceof Element) root.elm.appendChild(arguments[i]);
								else console.log(arguments[i] + ' is not an element');
							}
						}
						this.text = function (str) {
							var node = document.createTextNode(str);
							root.elm.appendChild(node);
						}
						this.elm = elm;
						this.__style = {};
						this.__instanceof = 'element';
					},

					__format: function (n) {
						var f = ""
							, n = n.toString();
						if (n.length < 3) return n;
						for (var i = 0; i < n.length; i++) {
							(((n.length - i) % 3 === 0) && (i !== 0)) ? f += "," + n[i]: f += n[i];
						}
						return f;
					},

					__update: function () {
						this.__timer.stop();
						var div = document.getElementById('graph');
						if (!div) {
							this.__timer.start();
							console.log('Waiting for div dom element to be loaded');
						}
						if (div) {
							console.log('Reloading graph');
							div.innerHTML = "";
							this.__updatePOIList();
							this.__updateGraph();
							this.__updateRanks();
						}
					},

					__updatePOIList: function () {
						var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
						var opois = alliance.get_OwnedPOIs();
						var startRank = ClientLib.Base.EPOIType.RankedTypeBegin;
						var getScore = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel;
						var models = this.__models
							, format = this.__format
							, pages = this.__poisCoordsPages;
						for (var i = 0; i < 7; i++) {
							var rows = [];
							opois.map(function (poi) {
								if (poi.t - startRank === i) {
									var a = webfrontend.gui.util.BBCode.createCoordsLinkText((poi.x + ':' + poi.y), poi.x, poi.y);
									rows.push([a, poi.l, format(getScore(poi.l))]);
								}
							});
							models[i].setData(rows);
							models[i].sortByColumn(1, false);
							pages[i].setLabel(rows.length);
						}
					},

					__updateRanks: function () {
						this.__ranks = {}, this.__isolatedRanks = {}, root = this, allianceName = this.__allianceName;
						var getPoiRankType = ClientLib.Base.PointOfInterestTypes.GetPOITypeFromPOIRanking;
						var poiInfo = phe.cnc.gui.util.Text.getPoiInfosByType
							, startRank;
						for (var i = 0; i < 20; i++)
							if (getPoiRankType(i) > 0) {
								startRank = i;
								break;
							};
						var getPoiRanks = function (type, poiType, increment) {
							ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("RankingGetData", {
									'ascending': true
									, 'firstIndex': 0
									, 'lastIndex': 100
									, 'rankingType': poiType
									, 'sortColumn': 200 + increment
									, 'view': 1
								}
								, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, root, function (context, data) {
									if (data !== null) {
										var skip = 1
											, arr = [];
										for (var i = 0; i < data.a.length; i++) {
											var alliance = data.a[i]
												, name = alliance.an
												, score = (alliance.pois || 0);
											if (name == allianceName) {
												skip = 0;
												continue;
											}
											alliance.r = i + skip;
											arr.push(alliance);
										}
										this.__isolatedRanks[type] = arr;
										this.__ranks[type] = data.a;
										if (this.__selectedSimPoi == type) this.__initSim();
									}
								}), null);
						};
						if (startRank)
							for (var n = 0; n < 7; n++) getPoiRanks(poiInfo(getPoiRankType(n + startRank)).type, n + startRank, n);
					},

					__setSimLabels: function () {
						var labels = this.__simLabels
							, pois = this.__pois
							, type = this.__selectedSimPoi
							, format = this.__format;
						if (pois[type]) {
							labels[0].setValue(pois[type].s);
							labels[1].setValue((pois[type].tier == 0) ? "0" : pois[type].tier);
							labels[2].setValue((pois[type].rank == 0) ? "0" : pois[type].rank);
							labels[3].setValue(pois[type].tb);
						}
					},

					__setRankingRows: function (score) {
						var isolatedRanks = this.__isolatedRanks
							, format = this.__format
							, allianceName = this.__allianceName
							, type = this.__selectedSimPoi
							, pois = this.__pois;
						var poiUtil = ClientLib.Base.PointOfInterestTypes;
						var getMultiplier = poiUtil.GetBoostModifierByRank;
						var getBonus = poiUtil.GetBonusByType;
						var getRankingData = function (i, type, nr) {
							var x = isolatedRanks[type][i]
								, score = (x.pois || 0)
								, name = webfrontend.gui.util.BBCode.createAllianceLinkText(x.an);
							var bonus = getBonus(pois[type].index, score)
								, multiplier = getMultiplier(nr)
								, totalBonus = bonus + (bonus * multiplier / 100);
							totalBonus = (pois[type].bonusType == 1) ? format(Math.round(totalBonus)) : Math.round(totalBonus * 100) / 100 + '%';
							return [nr, name, format(score), '+' + multiplier + '%', totalBonus]
						};
						getMyRanking = function (s, i, p) {
							var b = getBonus(pois[p].index, s);
							var m = getMultiplier(i);
							var tb = b + (b * m / 100);
							tb = (pois[p].bonusType == 1) ? format(Math.round(tb)) : Math.round(tb * 100) / 100 + '%';
							var n = webfrontend.gui.util.BBCode.createAllianceLinkText(allianceName);
							return [i, n, format(s), '+' + m + '%', tb];
						};
						var getRankingRows = function (s, type) {
							var rows;
							for (var i = 0; i < isolatedRanks[type].length; i++) {
								if (s >= (isolatedRanks[type][i].pois || 0)) {
									var matched = getRankingData(i, type, i + 2);
									var nextMatched = getRankingData(i + 1, type, i + 3);
									var preMatched = (i > 0) ? getRankingData(i - 1, type, i) : null;
									if (i == 0) rows = [getMyRanking(s, i + 1, type), matched, nextMatched];
									else rows = [preMatched, getMyRanking(s, i + 1, type), matched];
									break;
								}
							}
							return rows;
						}
						var rankingRows = getRankingRows(score, type);
						if (rankingRows) this.__rankingModel.setData(rankingRows);
					},

					__setResultsRows: function (score) {
						var pois = this.__pois
							, tiers = this.__tiers
							, format = this.__format
							, type = this.__selectedSimPoi
							, ranks = this.__isolatedRanks;
						var poiUtil = ClientLib.Base.PointOfInterestTypes;
						var getScore = poiUtil.GetScoreByLevel;
						var getMultiplier = poiUtil.GetBoostModifierByRank;
						var getBonus = poiUtil.GetBonusByType;
						var getTier = function (s) {
							if (s == 0) return "0";
							else
								for (var i = 0; i < tiers.length; i++)
									if (s >= tiers[i][1] && s < tiers[i][2]) return tiers[i][0];
						};
						var getNextTier = function (s) {
							for (var i = 0; i < tiers.length; i++)
								if (s >= tiers[i][1] && s < tiers[i][2]) return (tiers[i][2] - s);
						};
						var getPreviousTier = function (s) {
							for (var i = 0; i < tiers.length; i++)
								if (s >= tiers[i][1] && s < tiers[i][2]) return (s - tiers[i][1]);
						};
						var getRank = function (s, t) {
							for (var i = 0; i < ranks[t].length; i++)
								if (s >= (ranks[t][i].pois || 0)) return i + 1;
						};
						var getNextRank = function (s, t) {
							for (var i = 0; i < ranks[t].length; i++)
								if (s >= (ranks[t][i].pois || 0)) return (ranks[t][i - 1]) ? ranks[t][i - 1].pois : s;
						};
						var getPreviousRank = function (s, t) {
							for (var i = 0; i < ranks[t].length; i++)
								if (s >= (ranks[t][i].pois || 0)) return (ranks[t][i].pois || 0);
						};
						var getSimulatedData = function (s, p) {
							var ot = pois[p].tier;
							var or = pois[p].rank;
							var ob = pois[p].bonus;
							var otb = pois[p].totalBonus;
							var pp = pois[p].bonusType;
							var t = getTier(s);
							var r = getRank(s, p);
							var ps = getPreviousRank(s, p);
							var ns = getNextRank(s, p);
							var pr = s - ps;
							var nr = ns - s;
							var nt = getNextTier(s);
							var pt = getPreviousTier(s);
							var b = getBonus(pois[p].index, s);
							var m = getMultiplier(r);
							var f = format;
							var tb = b + (b * m / 100);
							var sc = function (val, org, poiType, fac) {
								var cs = [webfrontend.gui.util.BBCode.clrLink, '#41a921', '#e23636'];
								var st = function (c) {
										return '<p style="padding: 0; margin: 0; color: ' + c + '">'
									}
									, et = '</p>';
								if (val == undefined) return null;
								if (org == undefined) return st(cs[0]) + val + et;
								else if (org != undefined && poiType == null) return ((val - org) * fac > 0) ? st(cs[1]) + val + et : ((val - org) * fac < 0) ? st(cs[2]) + val + et : val;
								else {
									var fv = (poiType == 1) ? format(Math.round(val)) : Math.round(val * 100) / 100 + '%';
									return ((val - org) * fac > 0) ? st(cs[1]) + fv + et : ((val - org) * fac < 0) ? st(cs[2]) + fv + et : fv;
								}
							};
							var rows = ['Score', 'Tier', 'Rank', 'Multiplier', 'Previous Rank', 'Next Rank', 'Previous Tier', 'Next Tier', 'Bonus', 'Total Bonus'];
							var data = [f(s), sc(t, ot, null, 1), sc(r, or, null, -1), '+' + m + '%', '+' + f(pr), '-' + f(nr), '+' + f(pt), '-' + f(nt), sc(b, ob, pp, 1), sc(tb, otb, pp, 1)];
							var results = [];
							for (var i = 0; i < rows.length; i++) results.push([sc(rows[i]), data[i]]);
							return results;
						};
						var resultsRows = getSimulatedData(score, type);
						if (resultsRows) this.__resultsModel.setData(resultsRows);
					},

					__setPoisRows: function () {
						var poiUtil = ClientLib.Base.PointOfInterestTypes;
						var getScore = poiUtil.GetScoreByLevel; //poi level
						var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
						var opois = alliance.get_OwnedPOIs();
						var poiInfo = phe.cnc.gui.util.Text.getPoiInfosByType;
						var poisRows = []
							, type = this.__selectedSimPoi;
						opois.map(function (poi) {
							if (poiInfo(poi.t).type == type) {
								var a = webfrontend.gui.util.BBCode.createCoordsLinkText((poi.x + ':' + poi.y), poi.x, poi.y);
								poisRows.push([a, poi.l, getScore(poi.l), true]);
							}
						});
						if (poisRows) this.__poisModel.setData(poisRows);
					},

					__initSim: function () {
						var score = this.__pois[this.__selectedSimPoi].score;
						this.__setSimLabels();
						this.__setRankingRows(score);
						this.__setResultsRows(score);
						this.__setPoisRows();
						this.__poisTable.setUserData('score', score);
						this.__poisTable.resetSelection();
						this.__selectPoiLevel.setSelection([this.__selectPoiLevel.getSelectables()[0]]);
					},

					__updateGraph: function () {
						try {
							var data = ClientLib.Data.MainData.GetInstance();
							var alliance = data.get_Alliance();
							var ranks = alliance.get_POIRankScore();
							var poiUtil = ClientLib.Base.PointOfInterestTypes;
							var getScore = poiUtil.GetScoreByLevel;
							var getMultiplier = poiUtil.GetBoostModifierByRank;
							var getBonus = poiUtil.GetBonusByType;
							var getNextScore = poiUtil.GetNextScore;
							var startRank = ClientLib.Base.EPOIType.RankedTypeBegin;
							var endRank = ClientLib.Base.EPOIType.RankedTypeEnd;
							var poiInfo = phe.cnc.gui.util.Text.getPoiInfosByType;

							var pois = {}
								, format = this.__format
								, tiers = this.__tiers;
							var colors = ["#8dc186", "#5b9dcb", "#8cc1c7", "#d7d49c", "#dbb476", "#c47f76", "#928195"];
							var getTier = function (s) {
								for (var i = 0; i < tiers.length; i++)
									if (s >= tiers[i][1] && s < tiers[i][2]) return tiers[i][0];
							};
							var getHeight = function (s) {
								if (s == 0) return 0;
								for (var i = 0; i < tiers.length; i++)
									if (s >= tiers[i][1] && s < tiers[i][2]) return Math.round((s - tiers[i][1]) / (tiers[i][2] - tiers[i][1]) * 100);
							};

							var colors = ["#8dc186", "#5b9dcb", "#8cc1c7", "#d7d49c", "#dbb476", "#c47f76", "#928195"];
							for (var i = 0; i < ranks.length; i++) {
								var type = i + startRank;
								var name = poiInfo(type).type;
								var rank = ranks[i].r;
								var multiplier = getMultiplier(rank);
								var score = ranks[i].s;
								var bonus = getBonus(type, score);
								var nextScore = getNextScore(score);
								var nextBonus = getBonus(type, nextScore);
								var totalBonus = bonus + (bonus * multiplier / 100);
								var nextTotalBonus = nextBonus + (nextBonus * multiplier / 100);
								var nextTier = format(nextScore - score);
								var poiType = (i > 2) ? 2 : 1;
								var color = colors[i];
								var tier = getTier(ranks[i].s);
								var height = getHeight(ranks[i].s);
								var f_score = format(score);
								var f_rank = rank + ' (' + multiplier + '%)';
								var f_totalBonus = (poiType == 1) ? format(totalBonus) : Math.round(totalBonus * 100) / 100 + ' %';
								nextTotalBonus = (poiType == 1) ? format(nextTotalBonus) : Math.round(nextTotalBonus * 100) / 100 + ' %';
								pois[name] = {
									'score': score
									, 'tier': tier
									, 'bonus': bonus
									, 'totalBonus': totalBonus
									, 'index': type
									, 'bonusType': poiType
									, 'rank': rank
									, 'multiplier': multiplier
									, 't': tier
									, 's': f_score
									, 'r': f_rank
									, 'nt': nextTier
									, 'tb': f_totalBonus
									, 'ntb': nextTotalBonus
									, 'c': color
									, 'h': height
								};
							}
							console.log('data ready')
							this.__pois = pois;
							this.__graph.call(this);
						} catch (e) {
							console.log(e.toString());
						}
					},

					__graph: function () {
						console.log('creating graph');
						var root = this
							, pois = this.__pois
							, style = this.__style;
						var create = function (a, b) {
							var elm = new root.__element(a);
							if (b instanceof Object) elm.css(b);
							return elm;
						};
						var addRow = function (title, arr, table, selected) {
							var row = create('tr', style.rows.tr)
								, header = create('td', style.cell.header);
							row.elm.onclick = function () {
								var tr = table.elm.getElementsByTagName('tr');
								for (var i = 1; i < tr.length; i++) {
									tr[i].style.backgroundColor = '#d6dde1';
								}
								this.style.backgroundColor = '#ecf6fc';
							};
							if (selected == 1) row.css({
								'backgroundColor': '#ecf6fc'
							});
							header.text(title);
							row.append(header);
							for (var key in arr) {
								var td = create('td', style.cell.data);
								td.text(arr[key]);
								row.append(td);
							}
							table.append(row);
						};

						var table = create('table', style.table);
						var gc = create('tr', style.rows.graph);
						var gh = create('td');
						var ul = create('ul', style.icon.ul);
						table.set({
							"id": "data"
							, "cell-spacing": 0
							, "cell-padding": 0
							, "rules": "groups"
							, "width": "100%"
						});
						gh.append(ul);
						gc.append(gh);
						table.append(gc);

						var score = []
							, tier = []
							, nextTier = []
							, bns = []
							, nextBns = []
							, poiRank = []
							, m = 0;
						for (var key in pois) {
							var color = pois[key].c
								, name = key
								, h = pois[key].h
								, td = create('td', style.graph.td)
								, div = create('div', style.graph.div)
								, li = create('li', style.icon.li)
								, icon = create('div', style.icon.div)
								, p = create('p', style.icon.p);

							bns[m] = pois[key].tb;
							poiRank[m] = pois[key].r;
							score[m] = pois[key].s;
							tier[m] = pois[key].t;
							nextTier[m] = pois[key].nt;
							nextBns[m] = pois[key].ntb;

							div.css({
								'backgroundColor': color
								, 'height': h * 2 - 3 + 'px'
							});
							td.append(div);
							gc.append(td);
							icon.css({
								'backgroundColor': color
							});
							p.text(name);
							li.append(icon);
							li.append(p);
							ul.append(li);
							m++;
						}

						addRow('Tier', tier, table, 0);
						addRow('Alliance Rank', poiRank, table, 0);
						addRow('Score', score, table);
						addRow('Next Tier Requires', nextTier, table, 0);
						addRow('Bonus', bns, table, 1);
						addRow('Next Tier Bonus', nextBns, table, 0);
						document.getElementById('graph').appendChild(table.elm);
					}
				}
			});
		}

		function initialize_ccta_pa() {
			console.log('poiAnalyser: ' + 'POIs Analyser retrying...');
			if (typeof qx != 'undefined' && typeof qx.core != 'undefined' && typeof qx.core.Init != 'undefined' && typeof ClientLib != 'undefined' && typeof webfrontend != 'undefined' && typeof phe != 'undefined') {
				var app = qx.core.Init.getApplication();
				if (app.initDone == true) {
					try {
						var isDefined = function (a) {
							return (typeof a == 'undefined') ? false : true
						};
						var data = ClientLib.Data.MainData.GetInstance();
						var net = ClientLib.Net.CommunicationManager.GetInstance();
						if (isDefined(data) && isDefined(net)) {
							var alliance = data.get_Alliance();
							var player = data.get_Player();
							var poiUtil = ClientLib.Base.PointOfInterestTypes;
							var poiInfo = phe.cnc.gui.util.Text.getPoiInfosByType;
							if (isDefined(alliance) && isDefined(player) && isDefined(alliance.get_Exists()) && isDefined(player.get_Name()) && player.get_Name() != '' && isDefined(poiUtil) && isDefined(poiInfo)) {
								try {
									console.log('poiAnalyser: ' + 'initializing POIs Analyser');
									create_ccta_pa_class();
									ccta_pa.getInstance();
								} catch (e) {
									console.log('poiAnalyser: ' + "POIs Analyser script init error:");
									console.log('poiAnalyser: ' + e.toString());
								}
							} else window.setTimeout(initialize_ccta_pa, 10000);
						} else window.setTimeout(initialize_ccta_pa, 10000);
					} catch (e) {
						console.log('poiAnalyser: ' + e.toString());
					}
				} else window.setTimeout(initialize_ccta_pa, 10000);
			} else window.setTimeout(initialize_ccta_pa, 10000);
		};
		window.setTimeout(initialize_ccta_pa, 10000);
	};

	function inject() {
		var script = document.createElement("script");
		script.innerHTML = "(" + injectScript.toString() + ")();";
		script.type = "text/javascript";
		if (/commandandconquer\.com/i.test(document.domain)) {
			document.getElementsByTagName("head")[0].appendChild(script);
			console.log('injected');
		}
	};
	inject();

})();

/***********************************************************************************
PvP/PvE Ranking within the Alliance ***** Version 1.2
***********************************************************************************/
// ==UserScript==
// @include        https://prodgame*.alliances.commandandconquer.com/*/index.aspx* 
// ==/UserScript== 
(function () { 
    var PvpRankMod_main = function () { 
        var allianceId = null; 
        var allianceName = null; 
        var button = null; 
        var general = null; 
        var memberCount = null; 
        var playerInfoWindow = null; 
        var playerName = null; 
        var pvpHighScoreLabel = null; 
        var rowData = null; 
        var tabView = null; 
        var dataTable = null; 
 
        function CreateMod() { 
            try { 
                console.log('PvP/PvE Ranking Mod.'); 
                var tr = qx.locale.Manager.tr; 
                playerInfoWindow = webfrontend.gui.info.PlayerInfoWindow.getInstance(); 
                general = playerInfoWindow.getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[1].getChildren()[0]; 
                tabView = playerInfoWindow.getChildren()[0]; 
                playerName = general.getChildren()[1]; 
 
                // Add button to score tab-page to redirect to score history graph of the player. 
                // ( For my own alliance only ; since only our member scores are logged external. 
                allianceName = ClientLib.Data.MainData.GetInstance().get_Alliance().get_Name(); 
                if (allianceName == 'Oldskool') { 
                    button = new qx.ui.form.Button("Score graph"); 
                    button.addListener("execute", function () { 
 
                        var link = "http://pixaqu.nl/test/tibscoreos.php?user="; 
                        link += playerName.getValue(); 
                        window.open(link, "_blank"); 
                    }); 
                    general.add(button, { 
                        row: 3, 
                        column: 1 
                    }); 
                } 
 
                // New PvP Ranking Tab-page 
                var pvpRankingTab = new qx.ui.tabview.Page("Ranking"); 
                pvpRankingTab.setLayout(new qx.ui.layout.Canvas()); 
                pvpRankingTab.setPaddingTop(6); 
                pvpRankingTab.setPaddingLeft(8); 
                pvpRankingTab.setPaddingRight(10); 
                pvpRankingTab.setPaddingBottom(8); 
 
                // Label PvP Ranking 
                pvpHighScoreLabel = new qx.ui.basic.Label("PvP and PvE for alliance: ").set({ 
                    textColor: "text-value", 
                    font: "font_size_13_bold" 
                }); 
                pvpRankingTab.add(pvpHighScoreLabel); 
 
                // Table to show the PvP Scores of each player 
                dataTable = new webfrontend.data.SimpleColFormattingDataModel().set({ 
                    caseSensitiveSorting: false 
                }); 
                dataTable.setColumns(["Name", "PvP", "PvE" ], ["name", "pve", "pvp" ]); 
                var pvpTable = new webfrontend.gui.widgets.CustomTable(dataTable); 
                var columnModel = pvpTable.getTableColumnModel(); 
                columnModel.setColumnWidth(0, 200); 
                columnModel.setColumnWidth(1, 80); 
                columnModel.setColumnWidth(2, 80); 
                pvpTable.setStatusBarVisible(false); 
                pvpTable.setColumnVisibilityButtonVisible(false); 
                pvpRankingTab.add(pvpTable, { 
                    left: 0, 
                    top: 25, 
                    right: 0, 
                    bottom: 0 
                }); 
 
                // Add Tab page to the PlayerInfoWindow 
                tabView.add(pvpRankingTab); 
 
                // Hook up callback when another user has been selected 
                playerInfoWindow.addListener("close", onPlayerInfoWindowClose, this); 
                playerName.addListener("changeValue", onPlayerChanged, this); 
 
            } catch (e) { 
                console.log("CreateMod: ", e); 
            } 
        } 
 
 
        // Callback GetPublicPlayerInfoByName 
        // [bde] => Forgotten Bases Destroyed 
        // [d] => Player Bases Destroyed 
        // [n] => Player Name 
        function onPlayerInfoReceived(context, data) { 
            try { 
                var memberName = data.n 
                var pvp = data.d; 
                var pve = data.bde; 
                
                // Add player with its PvP/PvE score. 
                rowData.push([memberName, pvp, pve]); 
 
                if (rowData.length == memberCount) { 
                    // Show Alliance name in label. 
                    pvpHighScoreLabel.setValue("PvP and PvE for alliance: " + data.an); 
 
                    dataTable.setData(rowData); 
                    dataTable.sortByColumn(1, false); 
                } 
 
            } catch (e) { 
                console.log("onPlayerInfoReceived: ", e); 
            } 
        } 
 
 
        // GetPublicAllianceInfo Callback 
        // [m] => Member Array 
        // ( 
        //    [0] => Array 
        //            [n] => Name 
        // ) 
        // [mc]  => Member Count 
        function onAllianceInfoReceived(context, data) { 
            try { 
                // Crear  
                rowData = []; 
                dataTable.setData(rowData); 
 
                var members = data.m; 
                memberCount = data.mc; 
 
                for (var i in members) { 
                    var member = members[i]; 
 
                    // For Each member (player); Get the PvP/PvE Score 
                    if (member.n.length > 0) { 
                        ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("GetPublicPlayerInfoByName", { 
                            name: member.n 
                        }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, onPlayerInfoReceived), null); 
                    } 
                } 
            } catch (e) { 
                console.log("onAllianceInfoReceived: ", e); 
            } 
        } 
 
        // Callback GetPublicPlayerInfoByName 
        // [a] => Alliance ID 
        // [an] => Alliance Name 
        function onPlayerAllianceIdReceived(context, data) { 
            try { 
                // No need to recreate the RankingPage when player is member of same alliance 
                if (data.a != allianceId) { 
                    allianceId = data.a; 
 
                    // Show Alliance name in label. 
                    pvpHighScoreLabel.setValue("PvP and PvE for alliance: " + data.an + "     (loading plz wait)"); 
 
                    // Get Alliance MembersList 
                    ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("GetPublicAllianceInfo", { 
                        id: allianceId 
                    }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, onAllianceInfoReceived), null); 
                } 
            } catch (e) { 
                console.log("onPlayerInfoReceived: ", e); 
            } 
        } 
 
 
        function onPlayerChanged() { 
            try { 
                // Get Players AllianceId  
                if (playerName.getValue().length > 0) { 
                    ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("GetPublicPlayerInfoByName", { 
                        name: playerName.getValue() 
                    }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, onPlayerAllianceIdReceived), null); 
                } 
            } catch (e) { 
                console.log("onPlayerChanged: ", e); 
            } 
        } 
 
 
 
        function onPlayerInfoWindowClose() { 
            try { 
                //dataTable.setData([]); 
            } catch (e) { 
                console.log("onPlayerInfoWindowClose: ", e); 
            } 
        } 
 
        function PvpRankMod_checkIfLoaded() { 
            try { 
                if (typeof qx !== 'undefined' && typeof qx.locale !== 'undefined' && typeof qx.locale.Manager !== 'undefined') { 
                    if (ClientLib.Data.MainData.GetInstance().get_Alliance().get_FirstLeaders() !== null && ClientLib.Data.MainData.GetInstance().get_Alliance().get_FirstLeaders().l.length != 0) { 
                        CreateMod(); 
                    } else { 
                        window.setTimeout(PvpRankMod_checkIfLoaded, 1000); 
                    } 
                } else { 
                    window.setTimeout(PvpRankMod_checkIfLoaded, 1000); 
                } 
            } catch (e) { 
                console.log("PvpRankMod_checkIfLoaded: ", e); 
            } 
        } 
 
        if (/commandandconquer\.com/i.test(document.domain)) { 
            window.setTimeout(PvpRankMod_checkIfLoaded, 1000); 
        } 
    } 
 
    try { 
        var PvpRankMod = document.createElement("script"); 
        PvpRankMod.innerHTML = "(" + PvpRankMod_main.toString() + ")();"; 
        PvpRankMod.type = "text/javascript"; 
        if (/commandandconquer\.com/i.test(document.domain)) { 
            document.getElementsByTagName("head")[0].appendChild(PvpRankMod); 
        } 
    } catch (e) { 
        console.log("PvpRankMod: init error: ", e); 
    } 
})();

/***********************************************************************************
PvP/PvE Player Info Mod ***** Version 1.2
***********************************************************************************/
// ==/UserScript==
// @include https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// ==/UserScript==
(function () {
	var PlayerInfoMod_main = function () {
		var playerInfoWindow = null;
		var general = null;
		var pvpScoreLabel = null;
		var pveScoreLabel = null;
		var playerName = null;
		var tabView = null;
		var tableModel = null;
		var baseCoords = null;
		var rowData = null;

		function createPlayerInfoMod() {
			try {
				console.log('Player Info Mod loaded');
				var tr = qx.locale.Manager.tr;
				playerInfoWindow = webfrontend.gui.info.PlayerInfoWindow.getInstance();
				general = playerInfoWindow.getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[1].getChildren()[0];
				tabView = playerInfoWindow.getChildren()[0];
				playerName = general.getChildren()[1];

				var pvpLabel = new qx.ui.basic.Label("- PvP:");
				pvpScoreLabel = new qx.ui.basic.Label("").set({
					textColor: "text-value",
					font: "font_size_13_bold"
				});
				general.add(pvpLabel, {
					row: 3,
					column: 3
				});
				general.add(pvpScoreLabel, {
					row: 3,
					column: 4
				});

				var pveLabel = new qx.ui.basic.Label("- PvE:");
				pveScoreLabel = new qx.ui.basic.Label("").set({
					textColor: "text-value",
					font: "font_size_13_bold"
				});
				general.add(pveLabel, {
					row: 4,
					column: 3
				});
				general.add(pveScoreLabel, {
					row: 4,
					column: 4
				});

				var poiTab = new qx.ui.tabview.Page("POI");
				poiTab.setLayout(new qx.ui.layout.Canvas());
				poiTab.setPaddingTop(6);
				poiTab.setPaddingLeft(8);
				poiTab.setPaddingRight(10);
				poiTab.setPaddingBottom(8);

				tableModel = new webfrontend.data.SimpleColFormattingDataModel().set({
					caseSensitiveSorting: false
				});

				tableModel.setColumns([tr("tnf:name"), tr("tnf:lvl"), tr("tnf:points"), tr("tnf:coordinates")], ["t", "l", "s", "c"]);
				tableModel.setColFormat(3, "<div style=\"cursor:pointer;color:" + webfrontend.gui.util.BBCode.clrLink + "\">", "</div>");
				var poiTable = new webfrontend.gui.widgets.CustomTable(tableModel);
				poiTable.addListener("cellClick", centerCoords, this);

				var columnModel = poiTable.getTableColumnModel();
				columnModel.setColumnWidth(0, 250);
				columnModel.setColumnWidth(1, 80);
				columnModel.setColumnWidth(2, 120);
				columnModel.setColumnWidth(3, 120);
				columnModel.setDataCellRenderer(3, new qx.ui.table.cellrenderer.Html());
				columnModel.getDataCellRenderer(2).setUseAutoAlign(false);
				poiTable.setStatusBarVisible(false);
				poiTable.setColumnVisibilityButtonVisible(false);
				poiTab.add(poiTable, {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				});
				tabView.add(poiTab);

				playerInfoWindow.addListener("close", onPlayerInfoWindowClose, this);
				playerName.addListener("changeValue", onPlayerChanged, this);

			} catch (e) {
				console.log("createPlayerInfoMod: ", e);
			}
		}

		function centerCoords(e) {
			try {
				var poiCoord = tableModel.getRowData(e.getRow())[3].split(":");
				if (e.getColumn() == 3) webfrontend.gui.UtilView.centerCoordinatesOnRegionViewWindow(Number(poiCoord[0]), Number(poiCoord[1]));
			} catch (e) {
				console.log("centerCoords: ", e);
			}
		}

		function onPlayerInfo(context, data) {
			try {
				pvpScoreLabel.setValue((data.bd - data.bde).toString());
				pveScoreLabel.setValue(data.bde.toString());
				var bases = data.c;
				baseCoords = new Object;
				for (var i in bases) {
					var base = bases[i];
					baseCoords[i] = new Object();
					baseCoords[i]["x"] = base.x;
					baseCoords[i]["y"] = base.y;
				}
				ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("GetPublicAllianceInfo", {
					id: data.a
				}, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, onAllianceInfo), null);
			} catch (e) {
				console.log("onPlayerInfo: ", e);
			}
		}

		function onAllianceInfo(context, data) {
			try {
				rowData = [];
				var pois = data.opois;
				for (var i in pois) {
					var poi = pois[i];
					for (var j in baseCoords) {
						var distanceX = Math.abs(baseCoords[j].x - poi.x);
						var distanceY = Math.abs(baseCoords[j].y - poi.y);
						if (distanceX > 2 || distanceY > 2) continue;
						if (distanceX == 2 && distanceY == 2) continue;
						var name = phe.cnc.gui.util.Text.getPoiInfosByType(poi.t).name;
						var level = poi.l;
						var score = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi.l);
						var coords = phe.cnc.gui.util.Numbers.formatCoordinates(poi.x, poi.y);
						rowData.push([name, level, score, coords]);
						break;
					}
				}
				tableModel.setData(rowData);
				tableModel.sortByColumn(0, true);
			} catch (e) {
				console.log("onAllianceInfo: ", e);
			}
		}

		function onPlayerChanged() {
			try {
				if (playerName.getValue().length > 0) {
					ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("GetPublicPlayerInfoByName", {
						name: playerName.getValue()
					}, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, onPlayerInfo), null);
				}
			} catch (e) {
				console.log("onPlayerChanged: ", e);
			}
		}

		function onPlayerInfoWindowClose() {
			try {
				pvpScoreLabel.setValue("");
				pveScoreLabel.setValue("");
				tableModel.setData([]);
			} catch (e) {
				console.log("onPlayerInfoWindowClose: ", e);
			}
		}

		function PlayerInfoMod_checkIfLoaded() {
			try {
				if (typeof qx !== 'undefined' && typeof qx.locale !== 'undefined' && typeof qx.locale.Manager !== 'undefined') {
					if (ClientLib.Data.MainData.GetInstance().get_Alliance().get_FirstLeaders() !== null && ClientLib.Data.MainData.GetInstance().get_Alliance().get_FirstLeaders().l.length != 0) {
						createPlayerInfoMod();
					} else {
						window.setTimeout(PlayerInfoMod_checkIfLoaded, 1000);
					}
				} else {
					window.setTimeout(PlayerInfoMod_checkIfLoaded, 1000);
				}
			} catch (e) {
				console.log("PlayerInfoMod_checkIfLoaded: ", e);
			}
		}

		if (/commandandconquer\.com/i.test(document.domain)) {
			window.setTimeout(PlayerInfoMod_checkIfLoaded, 1000);
		}
	}

	try {
		var PlayerInfoMod = document.createElement("script");
		PlayerInfoMod.innerHTML = "(" + PlayerInfoMod_main.toString() + ")();";
		PlayerInfoMod.type = "text/javascript";
		if (/commandandconquer\.com/i.test(document.domain)) {
			document.getElementsByTagName("head")[0].appendChild(PlayerInfoMod);
		}
	} catch (e) {
		console.log("PlayerInfoMod: init error: ", e);
	}
})();


/***********************************************************************************
WarChiefs - Tiberium Alliances Upgrade Base/Defense/Army ***** Version 13.10.30
***********************************************************************************/
// ==UserScript==
// @include         http*://*.alliances.commandandconquer.com/*
// @grant           GM_getValue
// @grant           GM_log
// @grant           GM_openInTab
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// ==/UserScript==
/**
 *  License: CC-BY-NC-SA 3.0
 */
(function () {
	var injectFunction = function () {
		function createClasses() {
			qx.Class.define("Upgrade", {
				type: "singleton",
				extend: qx.core.Object,
				construct: function () {
					try {
						var qxApp = qx.core.Init.getApplication();

						var stats = document.createElement('img')
						stats.src = "http://goo.gl/BuvwKs"; // http://goo.gl/#analytics/goo.gl/BuvwKs/all_time

						var btnUpgrade = new qx.ui.form.Button(qxApp.tr("tnf:toggle upgrade mode"), "FactionUI/icons/icon_building_detail_upgrade.png").set({
							toolTipText: qxApp.tr("tnf:toggle upgrade mode"),
							alignY: "middle",
							show: "icon",
							width : 60,
							allowGrowX : false,
							allowGrowY : false,
							appearance : "button"
						});
						btnUpgrade.addListener("click", this.toggleWindow, this);

						var btnTrade = qx.core.Init.getApplication().getPlayArea().getHUD().getUIItem(ClientLib.Data.Missions.PATH.WDG_TRADE);
						btnTrade.getLayoutParent().addAfter(btnUpgrade, btnTrade);
					} catch (e) {
						console.log("Error setting up Upgrade Constructor: ");
						console.log(e.toString());
					}
				},
				destruct: function () {},
				members: {
					toggleWindow: function () {
						if (Upgrade.Window.getInstance().isVisible()) Upgrade.Window.getInstance().close();
						else Upgrade.Window.getInstance().open();
					}
				}
			});
			qx.Class.define("Upgrade.Window", {
				type: "singleton",
				extend: qx.ui.window.Window,
				construct: function () {
					try {
						this.base(arguments);
						this.set({
							layout: new qx.ui.layout.VBox().set({ spacing: 0 }),
							contentPadding: 5,
							contentPaddingTop: 0,
							allowMaximize: false,
							showMaximize: false,
							allowMinimize: false,
							showMinimize: false,
							resizable: false
						});
						this.moveTo(124, 31);
						this.getChildControl("icon").set({ width : 18, height : 18, scale : true, alignY : "middle" });

						this.add(new Upgrade.Current());
						this.add(new Upgrade.All());
						this.add(new Upgrade.Repairtime());

						this.addListener("appear", this.onOpen, this);
						this.addListener("close", this.onClose, this);
					} catch (e) {
						console.log("Error setting up Upgrade.Window Constructor: ");
						console.log(e.toString());
					}
				},
				destruct: function () {},
				members: {
					onOpen: function () {
						phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.onViewModeChanged);
						this.onViewModeChanged(null, ClientLib.Vis.VisMain.GetInstance().get_Mode());
					},
					onClose: function () {
						phe.cnc.Util.detachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.onViewModeChanged);
					},
					onViewModeChanged: function (oldMode, newMode) {
						if (oldMode !== newMode) {
							var qxApp = qx.core.Init.getApplication();
							switch (newMode) {
							case ClientLib.Vis.Mode.City:
								this.setCaption(qxApp.tr("tnf:toggle upgrade mode") + ": " + qxApp.tr("tnf:base"));
								this.setIcon("FactionUI/icons/icon_arsnl_base_buildings.png");
								break;
							case ClientLib.Vis.Mode.DefenseSetup:
								this.setCaption(qxApp.tr("tnf:toggle upgrade mode") + ": " + qxApp.tr("tnf:defense"));
								this.setIcon("FactionUI/icons/icon_def_army_points.png");
								break;
							case ClientLib.Vis.Mode.ArmySetup:
								this.setCaption(qxApp.tr("tnf:toggle upgrade mode") + ": " + qxApp.tr("tnf:offense"));
								this.setIcon("FactionUI/icons/icon_army_points.png");
								break;
							default:
								this.close();
								break;
							}
						}
					},
				}
			});
			qx.Class.define("Upgrade.All", {
				extend: qx.ui.container.Composite,
				construct: function () {
					try {
						qx.ui.container.Composite.call(this);
						this.set({
							layout : new qx.ui.layout.VBox(5),
							padding: 5,
							decorator: "pane-light-opaque"
						});
						this.add(this.title = new qx.ui.basic.Label("").set({ alignX: "center", font: "font_size_14_bold" }));

						var level = new qx.ui.container.Composite(new qx.ui.layout.HBox(5))
						level.add(new qx.ui.basic.Label(this.tr("tnf:level:")).set({ alignY: "middle" }));
						level.add(this.txtLevel = new qx.ui.form.Spinner(1).set({ maximum: 150, minimum: 1 }));
						this.txtLevel.addListener("changeValue", this.onInput, this);
						level.add(this.btnLevel = new qx.ui.form.Button(this.tr("tnf:toggle upgrade mode"), "FactionUI/icons/icon_building_detail_upgrade.png"));
						this.btnLevel.addListener("execute", this.onUpgrade, this);
						this.add(level);

						var requires = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
						requires.add(new qx.ui.basic.Label(this.tr("tnf:requires:")));
						var resource = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));
						resource.add(this.resTiberium = new qx.ui.basic.Atom("-", "webfrontend/ui/common/icn_res_tiberium.png"));
						this.resTiberium.setToolTipIcon("webfrontend/ui/common/icn_res_tiberium.png");
						this.resTiberium.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						resource.add(this.resChrystal = new qx.ui.basic.Atom("-", "webfrontend/ui/common/icn_res_chrystal.png"));
						this.resChrystal.setToolTipIcon("webfrontend/ui/common/icn_res_chrystal.png");
						this.resChrystal.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						resource.add(this.resPower = new qx.ui.basic.Atom("-", "webfrontend/ui/common/icn_res_power.png"));
						this.resPower.setToolTipIcon("webfrontend/ui/common/icn_res_power.png");
						this.resPower.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						requires.add(resource);
						this.add(requires);

						this.addListener("appear", this.onAppear, this);
						this.addListener("disappear", this.onDisappear, this);
					} catch (e) {
						console.log("Error setting up Upgrade.All Constructor: ");
						console.log(e.toString());
					}
				},
				destruct: function () {},
				members: {
					title: null,
					txtLevel: null,
					btnLevel: null,
					resTiberium: null,
					resChrystal: null,
					resPower: null,
					onAppear: function () {
						phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.onViewModeChanged);
						phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.onCurrentCityChange);
						phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.onCurrentCityChange);
						phe.cnc.base.Timer.getInstance().addListener("uiTick", this.onTick, this);
						this.onViewModeChanged(null, ClientLib.Vis.VisMain.GetInstance().get_Mode());
					},
					onDisappear: function () {
						phe.cnc.Util.detachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.onViewModeChanged);
						phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.onCurrentCityChange);
						phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.onCurrentCityChange);
						phe.cnc.base.Timer.getInstance().removeListener("uiTick", this.onTick, this);
					},
					onViewModeChanged: function (oldViewMode, newViewMode) {
						if (oldViewMode !== newViewMode) {
							switch (newViewMode) {
							case ClientLib.Vis.Mode.City:
								this.title.setValue(this.tr("All buildings"));
								this.reset();
								break;
							case ClientLib.Vis.Mode.DefenseSetup:
								this.title.setValue(this.tr("All defense units"));
								this.reset();
								break;
							case ClientLib.Vis.Mode.ArmySetup:
								this.title.setValue(this.tr("All army units"));
								this.reset();
								break;
							}
						}
					},
					onCurrentCityChange: function (oldCurrentCity, newCurrentCity) {
						if (oldCurrentCity !== newCurrentCity) {
							this.reset();
						}
					},
					getResTime: function (need, type) {
						var CurrentOwnCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
						var Alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
						need -= CurrentOwnCity.GetResourceCount(type);
						need = Math.max(0, need);
						var Con = CurrentOwnCity.GetResourceGrowPerHour(type);
						var Bonus = CurrentOwnCity.get_hasCooldown() ? 0 : CurrentOwnCity.GetResourceBonusGrowPerHour(type);
						var POI = CurrentOwnCity.get_IsGhostMode() ? 0 : Alliance.GetPOIBonusFromResourceType(type);
						return (need <= 0 ? 0 : need / (Con + Bonus + POI) * 3600);
					},
					getUpgradeCostsToLevel: function (newLevel) {
						if (newLevel > 0) {
							switch (ClientLib.Vis.VisMain.GetInstance().get_Mode()) {
							case ClientLib.Vis.Mode.City:
								return ClientLib.API.City.GetInstance().GetUpgradeCostsForAllBuildingsToLevel(newLevel);
							case ClientLib.Vis.Mode.DefenseSetup:
								return ClientLib.API.Defense.GetInstance().GetUpgradeCostsForAllUnitsToLevel(newLevel);
							case ClientLib.Vis.Mode.ArmySetup:
								return ClientLib.API.Army.GetInstance().GetUpgradeCostsForAllUnitsToLevel(newLevel);
							}
						}
						return null;
					},
					getLowLevel: function () {
						for (var newLevel = 1, Tib = 0, Cry = 0, Pow = 0; Tib === 0 && Cry === 0 && Pow === 0 && newLevel < 1000; newLevel++) {
							var costs = this.getUpgradeCostsToLevel(newLevel);
							if (costs !== null) {
								for (var i = 0; i < costs.length; i++) {
									var uCosts = costs[i];
									var cType = parseInt(uCosts.Type, 10);
									switch (cType) {
									case ClientLib.Base.EResourceType.Tiberium:
										Tib += uCosts.Count;
										break;
									case ClientLib.Base.EResourceType.Crystal:
										Cry += uCosts.Count;
										break;
									case ClientLib.Base.EResourceType.Power:
										Pow += uCosts.Count;
										break;
									}
								}
							}
						}
						return (newLevel === 1000?0:(newLevel - 1));
					},
					reset: function () {
						var LowLevel = this.getLowLevel();
						if (LowLevel > 0) {
							this.txtLevel.setMinimum(LowLevel);
							this.txtLevel.setMaximum(LowLevel + 50);
							this.txtLevel.setValue(LowLevel);
							this.txtLevel.setEnabled(true);
							this.btnLevel.setEnabled(true);
						} else {
							this.txtLevel.setMinimum(0);
							this.txtLevel.setMaximum(0);
							this.txtLevel.resetValue();
							this.txtLevel.setEnabled(false);
							this.btnLevel.setEnabled(false);
						}
						this.onInput();
					},
					onTick: function () {
						this.onInput();
					},
					onInput: function () {
						var newLevel = parseInt(this.txtLevel.getValue(), 10);
						var costs = this.getUpgradeCostsToLevel(newLevel);
						if (newLevel > 0 && costs !== null) {
							for (var i = 0, Tib = 0, Cry = 0, Pow = 0, TibTime = 0, CryTime = 0, PowTime = 0; i < costs.length; i++) {
								var uCosts = costs[i];
								switch (parseInt(uCosts.Type, 10)) {
								case ClientLib.Base.EResourceType.Tiberium:
									Tib += uCosts.Count;
									TibTime += this.getResTime(uCosts.Count, ClientLib.Base.EResourceType.Tiberium);
									break;
								case ClientLib.Base.EResourceType.Crystal:
									Cry += uCosts.Count;
									CryTime += this.getResTime(uCosts.Count, ClientLib.Base.EResourceType.Crystal);
									break;
								case ClientLib.Base.EResourceType.Power:
									Pow += uCosts.Count;
									PowTime += this.getResTime(uCosts.Count, ClientLib.Base.EResourceType.Power);
									break;
								}
							}
							this.resTiberium.setLabel(phe.cnc.gui.util.Numbers.formatNumbersCompact(Tib) + (TibTime > 0 ? " @ " + phe.cnc.Util.getTimespanString(TibTime) : ""));
							this.resTiberium.setToolTipText(phe.cnc.gui.util.Numbers.formatNumbers(Tib));
							if (Tib === 0) this.resTiberium.exclude();
							else this.resTiberium.show();
							this.resChrystal.setLabel(phe.cnc.gui.util.Numbers.formatNumbersCompact(Cry) + (CryTime > 0 ? " @ " + phe.cnc.Util.getTimespanString(CryTime) : ""));
							this.resChrystal.setToolTipText(phe.cnc.gui.util.Numbers.formatNumbers(Cry));
							if (Cry === 0) this.resChrystal.exclude();
							else this.resChrystal.show();
							this.resPower.setLabel(phe.cnc.gui.util.Numbers.formatNumbersCompact(Pow) + (PowTime > 0 ? " @ " + phe.cnc.Util.getTimespanString(PowTime) : ""));
							this.resPower.setToolTipText(phe.cnc.gui.util.Numbers.formatNumbers(Pow));
							if (Pow === 0) this.resPower.exclude();
							else this.resPower.show();
						} else {
							this.resTiberium.setLabel("-");
							this.resTiberium.resetToolTipText();
							this.resTiberium.show();
							this.resChrystal.setLabel("-");
							this.resChrystal.resetToolTipText();
							this.resChrystal.show();
							this.resPower.setLabel("-");
							this.resPower.resetToolTipText();
							this.resPower.show();
						}
					},
					onUpgrade: function () {
						var newLevel = parseInt(this.txtLevel.getValue(), 10);
						if (newLevel > 0) {
							switch (ClientLib.Vis.VisMain.GetInstance().get_Mode()) {
							case ClientLib.Vis.Mode.City:
								ClientLib.API.City.GetInstance().UpgradeAllBuildingsToLevel(newLevel);
								this.reset()
								break;
							case ClientLib.Vis.Mode.DefenseSetup:
								ClientLib.API.Defense.GetInstance().UpgradeAllUnitsToLevel(newLevel);
								this.reset()
								break;
							case ClientLib.Vis.Mode.ArmySetup:
								ClientLib.API.Army.GetInstance().UpgradeAllUnitsToLevel(newLevel);
								this.reset()
								break;
							}
						}
					}
				}
			});
			qx.Class.define("Upgrade.Current", {
				extend: qx.ui.container.Composite,
				construct: function () {
					try {
						qx.ui.container.Composite.call(this);
						this.set({
							layout : new qx.ui.layout.VBox(5),
							padding: 5,
							decorator: "pane-light-opaque"
						});
						this.add(this.title = new qx.ui.basic.Label("").set({ alignX: "center", font: "font_size_14_bold" }));
						this.add(this.txtSelected = new qx.ui.basic.Label("").set({ alignX: "center" }));

						var level = new qx.ui.container.Composite(new qx.ui.layout.HBox(5))
						level.add(new qx.ui.basic.Label(this.tr("tnf:level:")).set({ alignY: "middle" }));
						level.add(this.txtLevel = new qx.ui.form.Spinner(1).set({ maximum: 150, minimum: 1 }));
						this.txtLevel.addListener("changeValue", this.onInput, this);
						level.add(this.btnLevel = new qx.ui.form.Button(this.tr("tnf:toggle upgrade mode"), "FactionUI/icons/icon_building_detail_upgrade.png"));
						this.btnLevel.addListener("execute", this.onUpgrade, this);
						this.add(level);

						var requires = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
						requires.add(new qx.ui.basic.Label(this.tr("tnf:requires:")));
						var resource = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));
						resource.add(this.resTiberium = new qx.ui.basic.Atom("-", "webfrontend/ui/common/icn_res_tiberium.png"));
						this.resTiberium.setToolTipIcon("webfrontend/ui/common/icn_res_tiberium.png");
						this.resTiberium.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						resource.add(this.resChrystal = new qx.ui.basic.Atom("-", "webfrontend/ui/common/icn_res_chrystal.png"));
						this.resChrystal.setToolTipIcon("webfrontend/ui/common/icn_res_chrystal.png");
						this.resChrystal.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						resource.add(this.resPower = new qx.ui.basic.Atom("-", "webfrontend/ui/common/icn_res_power.png"));
						this.resPower.setToolTipIcon("webfrontend/ui/common/icn_res_power.png");
						this.resPower.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						requires.add(resource);
						this.add(requires);

						this.addListener("appear", this.onAppear, this);
						this.addListener("disappear", this.onDisappear, this);
					} catch (e) {
						console.log("Error setting up Upgrade.Current Constructor: ");
						console.log(e.toString());
					}
				},
				destruct: function () {},
				members: {
					title: null,
					txtSelected: null,
					txtLevel: null,
					btnLevel: null,
					resTiberium: null,
					resChrystal: null,
					resPower: null,
					Selection: null,
					onAppear: function () {
						phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.onViewModeChanged);
						phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "SelectionChange", ClientLib.Vis.SelectionChange, this, this.onSelectionChange);
						phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.onCurrentCityChange);
						phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.onCurrentCityChange);
						phe.cnc.base.Timer.getInstance().addListener("uiTick", this.onTick, this);
						this.onViewModeChanged(null, ClientLib.Vis.VisMain.GetInstance().get_Mode());
					},
					onDisappear: function () {
						phe.cnc.Util.detachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.onViewModeChanged);
						phe.cnc.Util.detachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "SelectionChange", ClientLib.Vis.SelectionChange, this, this.onSelectionChange);
						phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.onCurrentCityChange);
						phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.onCurrentCityChange);
						phe.cnc.base.Timer.getInstance().removeListener("uiTick", this.onTick, this);
					},
					onViewModeChanged: function (oldViewMode, newViewMode) {
						if (oldViewMode !== newViewMode) {
							switch (newViewMode) {
							case ClientLib.Vis.Mode.City:
								this.title.setValue(this.tr("Selected building"));
								this.reset();
								break;
							case ClientLib.Vis.Mode.DefenseSetup:
								this.title.setValue(this.tr("Selected defense unit"));
								this.reset();
								break;
							case ClientLib.Vis.Mode.ArmySetup:
								this.title.setValue(this.tr("Selected army unit"));
								this.reset();
								break;
							}
						}
					},
					onSelectionChange: function (oldSelection, newSelection) {
						if (newSelection != null) {
							switch (newSelection.get_VisObjectType()) {
							case ClientLib.Vis.VisObject.EObjectType.CityBuildingType:
								this.Selection = newSelection;
								var name = newSelection.get_BuildingName();
								var level = newSelection.get_BuildingLevel();
								this.txtSelected.setValue(name + " (" + level + ")");
								this.txtLevel.setMinimum(level + 1);
								this.txtLevel.setMaximum(level + 51);
								this.txtLevel.setValue(level + 1);
								this.txtLevel.setEnabled(true);
								this.btnLevel.setEnabled(true);
								this.onInput();
								break;
							case ClientLib.Vis.VisObject.EObjectType.DefenseUnitType:
							case ClientLib.Vis.VisObject.EObjectType.ArmyUnitType:
								this.Selection = newSelection;
								var name = newSelection.get_UnitName();
								var level = newSelection.get_UnitLevel();
								this.txtSelected.setValue(name + " (" + level + ")");
								this.txtLevel.setMinimum(level + 1);
								this.txtLevel.setMaximum(level + 51);
								this.txtLevel.setValue(level + 1);
								this.txtLevel.setEnabled(true);
								this.btnLevel.setEnabled(true);
								this.onInput();
								break;
							}
						}
					},
					onCurrentCityChange: function (oldCurrentCity, newCurrentCity) {
						if (oldCurrentCity !== newCurrentCity) {
							this.reset();
						}
					},
					getResTime: function (need, type) {
						var CurrentOwnCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
						var Alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
						need -= CurrentOwnCity.GetResourceCount(type);
						need = Math.max(0, need);
						var Con = CurrentOwnCity.GetResourceGrowPerHour(type);
						var Bonus = CurrentOwnCity.get_hasCooldown() ? 0 : CurrentOwnCity.GetResourceBonusGrowPerHour(type);
						var POI = CurrentOwnCity.get_IsGhostMode() ? 0 : Alliance.GetPOIBonusFromResourceType(type);
						return (need <= 0 ? 0 : need / (Con + Bonus + POI) * 3600);
					},
					getUpgradeCostsToLevel: function (unit, newLevel) {
						var costs = null;
						if (unit !== null && newLevel > 0) {
							switch (unit.get_VisObjectType()) {
							case ClientLib.Vis.VisObject.EObjectType.CityBuildingType:
								if (newLevel > unit.get_BuildingLevel())
									costs = ClientLib.API.City.GetInstance().GetUpgradeCostsForBuildingToLevel(unit.get_BuildingDetails(), newLevel);
								break;
							case ClientLib.Vis.VisObject.EObjectType.DefenseUnitType:
								if (newLevel > unit.get_UnitLevel())
									costs = ClientLib.API.Defense.GetInstance().GetUpgradeCostsForUnitToLevel(unit.get_UnitDetails(), newLevel);
								break;
							case ClientLib.Vis.VisObject.EObjectType.ArmyUnitType:
								if (newLevel > unit.get_UnitLevel())
									costs = ClientLib.API.Army.GetInstance().GetUpgradeCostsForUnitToLevel(unit.get_UnitDetails(), newLevel);
								break;
							}
						}
						return costs;
					},
					reset: function () {
						this.Selection = null;
						this.txtSelected.setValue("-");
						this.txtLevel.setMinimum(0);
						this.txtLevel.setMaximum(0);
						this.txtLevel.resetValue();
						this.txtLevel.setEnabled(false);
						this.btnLevel.setEnabled(false);
						this.onInput();
					},
					onTick: function () {
						this.onInput();
					},
					onInput: function () {
						var costs = this.getUpgradeCostsToLevel(this.Selection, parseInt(this.txtLevel.getValue(), 10));
						if (costs !== null) {
							for (var i = 0, Tib = 0, Cry = 0, Pow = 0, TibTime = 0, CryTime = 0, PowTime = 0; i < costs.length; i++) {
								var uCosts = costs[i];
								switch (parseInt(uCosts.Type, 10)) {
								case ClientLib.Base.EResourceType.Tiberium:
									Tib += uCosts.Count;
									TibTime += this.getResTime(uCosts.Count, ClientLib.Base.EResourceType.Tiberium);
									break;
								case ClientLib.Base.EResourceType.Crystal:
									Cry += uCosts.Count;
									CryTime += this.getResTime(uCosts.Count, ClientLib.Base.EResourceType.Crystal);
									break;
								case ClientLib.Base.EResourceType.Power:
									Pow += uCosts.Count;
									PowTime += this.getResTime(uCosts.Count, ClientLib.Base.EResourceType.Power);
									break;
								}
							}
							this.resTiberium.setLabel(phe.cnc.gui.util.Numbers.formatNumbersCompact(Tib) + (TibTime > 0 ? " @ " + phe.cnc.Util.getTimespanString(TibTime) : ""));
							this.resTiberium.setToolTipText(phe.cnc.gui.util.Numbers.formatNumbers(Tib));
							if (Tib === 0) this.resTiberium.exclude();
							else this.resTiberium.show();
							this.resChrystal.setLabel(phe.cnc.gui.util.Numbers.formatNumbersCompact(Cry) + (CryTime > 0 ? " @ " + phe.cnc.Util.getTimespanString(CryTime) : ""));
							this.resChrystal.setToolTipText(phe.cnc.gui.util.Numbers.formatNumbers(Cry));
							if (Cry === 0) this.resChrystal.exclude();
							else this.resChrystal.show();
							this.resPower.setLabel(phe.cnc.gui.util.Numbers.formatNumbersCompact(Pow) + (PowTime > 0 ? " @ " + phe.cnc.Util.getTimespanString(PowTime) : ""));
							this.resPower.setToolTipText(phe.cnc.gui.util.Numbers.formatNumbers(Pow));
							if (Pow === 0) this.resPower.exclude();
							else this.resPower.show();
						} else {
							this.resTiberium.setLabel("-");
							this.resTiberium.resetToolTipText();
							this.resTiberium.show();
							this.resChrystal.setLabel("-");
							this.resChrystal.resetToolTipText();
							this.resChrystal.show();
							this.resPower.setLabel("-");
							this.resPower.resetToolTipText();
							this.resPower.show();
						}
					},
					onUpgrade: function() {
						var newLevel = parseInt(this.txtLevel.getValue(), 10);
						if (newLevel > 0 && this.Selection !== null) {
							switch (this.Selection.get_VisObjectType()) {
							case ClientLib.Vis.VisObject.EObjectType.CityBuildingType:
								if (newLevel > this.Selection.get_BuildingLevel()) {
									ClientLib.API.City.GetInstance().UpgradeBuildingToLevel(this.Selection.get_BuildingDetails(), newLevel);
									this.onSelectionChange(null, this.Selection);
								}
								break;
							case ClientLib.Vis.VisObject.EObjectType.DefenseUnitType:
								if (newLevel > this.Selection.get_UnitLevel()) {
									ClientLib.API.Defense.GetInstance().UpgradeUnitToLevel(this.Selection.get_UnitDetails(), newLevel);
									this.onSelectionChange(null, this.Selection);
								}
								break;
							case ClientLib.Vis.VisObject.EObjectType.ArmyUnitType:
								if (newLevel > this.Selection.get_UnitLevel()) {
									ClientLib.API.Army.GetInstance().UpgradeUnitToLevel(this.Selection.get_UnitDetails(), newLevel);
									this.onSelectionChange(null, this.Selection);
								}
								break;
							}
						}
					}
				}
			});
			qx.Class.define("Upgrade.Repairtime", {
				extend: qx.ui.container.Composite,
				construct: function () {
					try {
						qx.ui.container.Composite.call(this);
						this.set({
							layout : new qx.ui.layout.VBox(5),
							padding: 5,
							decorator: "pane-light-opaque"
						});
						this.add(this.title = new qx.ui.basic.Label(this.tr("tnf:repair points")).set({ alignX: "center", font: "font_size_14_bold" }));
						this.add(this.grid = new qx.ui.container.Composite(new qx.ui.layout.Grid()));

						this.grid.add(this.basRT = new qx.ui.basic.Atom("", "FactionUI/icons/icon_arsnl_base_buildings.png").set({toolTipText: this.tr("tnf:base")}), {row: 0, column: 0});
						this.basRT.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						this.grid.add(new qx.ui.basic.Label("").set({ alignX: "right", alignY: "middle" }), {row: 0, column: 2});
						this.grid.add(new qx.ui.basic.Label("").set({ alignX: "right", alignY: "middle" }), {row: 0, column: 4});
						this.grid.add(this.btnBuildings = new qx.ui.form.Button(null, "FactionUI/icons/icon_building_detail_upgrade.png").set({toolTipText: this.tr("tnf:toggle upgrade mode"), width: 25, maxHeight: 17, alignY: "middle", show: "icon", iconPosition: "top", appearance: "button-addpoints"}), {row: 0, column: 6});
						this.btnBuildings.getChildControl("icon").set({width: 14, height: 14, scale: true});
						this.btnBuildings.addListener("execute", function (e) { this.upgradeBuilding(ClientLib.Base.ETechName.Construction_Yard); }, this);

						this.grid.add(this.infRT = new qx.ui.basic.Atom("", "FactionUI/icons/icon_arsnl_off_squad.png").set({toolTipText: this.tr("tnf:infantry repair title")}), {row: 1, column: 0});
						this.infRT.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						this.grid.add(new qx.ui.basic.Label("").set({ alignX: "right", alignY: "middle" }), {row: 1, column: 2});
						this.grid.add(new qx.ui.basic.Label("").set({ alignX: "right", alignY: "middle" }), {row: 1, column: 4});
						this.grid.add(this.btnInfantry = new qx.ui.form.Button(null, "FactionUI/icons/icon_building_detail_upgrade.png").set({toolTipText: this.tr("tnf:toggle upgrade mode"), width: 25, maxHeight: 17, alignY: "middle", show: "icon", iconPosition: "top", appearance: "button-addpoints"}), {row: 1, column: 6});
						this.btnInfantry.getChildControl("icon").set({width: 14, height: 14, scale: true});
						this.btnInfantry.addListener("execute", function (e) { this.upgradeBuilding(ClientLib.Base.ETechName.Barracks); }, this);

						this.grid.add(this.vehRT = new qx.ui.basic.Atom("", "FactionUI/icons/icon_arsnl_off_vehicle.png").set({toolTipText: this.tr("tnf:vehicle repair title")}), {row: 2, column: 0});
						this.vehRT.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						this.grid.add(new qx.ui.basic.Label("").set({ alignX: "right", alignY: "middle" }), {row: 2, column: 2});
						this.grid.add(new qx.ui.basic.Label("").set({ alignX: "right", alignY: "middle" }), {row: 2, column: 4});
						this.grid.add(this.btnVehicle = new qx.ui.form.Button(null, "FactionUI/icons/icon_building_detail_upgrade.png").set({toolTipText: this.tr("tnf:toggle upgrade mode"), width: 25, maxHeight: 17, alignY: "middle", show: "icon", iconPosition: "top", appearance: "button-addpoints"}), {row: 2, column: 6});
						this.btnVehicle.getChildControl("icon").set({width: 14, height: 14, scale: true});
						this.btnVehicle.addListener("execute", function (e) { this.upgradeBuilding(ClientLib.Base.ETechName.Factory); }, this);

						this.grid.add(this.airRT = new qx.ui.basic.Atom("", "FactionUI/icons/icon_arsnl_off_plane.png").set({toolTipText: this.tr("tnf:aircraft repair title")}), {row: 3, column: 0});
						this.airRT.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						this.grid.add(new qx.ui.basic.Label("").set({ alignX: "right", alignY: "middle" }), {row: 3, column: 2});
						this.grid.add(new qx.ui.basic.Label("").set({ alignX: "right", alignY: "middle" }), {row: 3, column: 4});
						this.grid.add(this.btnAircraft = new qx.ui.form.Button(null, "FactionUI/icons/icon_building_detail_upgrade.png").set({toolTipText: this.tr("tnf:toggle upgrade mode"), width: 25, maxHeight: 17, alignY: "middle", show: "icon", iconPosition: "top", appearance: "button-addpoints"}), {row: 3, column: 6});
						this.btnAircraft.getChildControl("icon").set({width: 14, height: 14, scale: true});
						this.btnAircraft.addListener("execute", function (e) { this.upgradeBuilding(ClientLib.Base.ETechName.Airport); }, this);

						this.grid.getLayout().setRowFlex(0, 0);
						this.grid.getLayout().setRowFlex(1, 0);
						this.grid.getLayout().setRowFlex(2, 0);
						this.grid.getLayout().setRowFlex(3, 0);
						this.grid.getLayout().setColumnFlex(1, 200);
						this.grid.getLayout().setColumnFlex(3, 200);
						this.grid.getLayout().setColumnFlex(5, 200);

						this.addListener("appear", this.onAppear, this);
						this.addListener("disappear", this.onDisappear, this);
					} catch (e) {
						console.log("Error setting up Upgrade.Repairtime Constructor: ");
						console.log(e.toString());
					}
				},
				destruct: function () {},
				members: {
					title: null,
					grid: null,
					btnBuildings: null,
					btnInfantry: null,
					btnVehicle: null,
					btnAircraft: null,
					onAppear: function () {
						phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.onCurrentCityChange);
						phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.onCurrentCityChange);
						phe.cnc.base.Timer.getInstance().addListener("uiTick", this.onTick, this);
						this.getInfo();
					},
					onDisappear: function () {
						phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.onCurrentCityChange);
						phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.onCurrentCityChange);
						phe.cnc.base.Timer.getInstance().removeListener("uiTick", this.onTick, this);
					},
					onTick: function () {
						this.getInfo();
					},
					onCurrentCityChange: function (oldCurrentCity, newCurrentCity) {
						if (oldCurrentCity !== newCurrentCity) {
							this.getInfo();
						}
					},
					canUpgradeBuilding: function (ETechName) {
						var city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
						var building = city.get_CityBuildingsData().GetUniqueBuildingByTechName(ETechName);
						if (building) {
							var ResourceRequirements_Obj = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj(building.get_CurrentLevel() + 1, building.get_UnitGameData_Obj())
							return (building.get_CurrentDamage() == 0 && !city.get_IsLocked() && city.HasEnoughResources(ResourceRequirements_Obj));
						} else return false;
					},
					upgradeBuilding: function (ETechName) {
						var city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
						var building = city.get_CityBuildingsData().GetUniqueBuildingByTechName(ETechName);
						if (building) {
							ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", {
								cityid : city.get_Id(),
								posX : building.get_CoordX(),
								posY : building.get_CoordY()
							}, null, null, true);
						}
					},
					getInfo: function () {
						try {
							var lvl, win, city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();

							lvl = city.get_CityBuildingsData().GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Construction_Yard).get_CurrentLevel();
							win = (city.get_CityBuildingsData().GetFullRepairTime(true) - city.get_CityBuildingsData().GetFullRepairTime(false)) * -1;
							this.grid.getLayout().getCellWidget(0, 0).setLabel("("+ lvl +")");
							this.grid.getLayout().getCellWidget(0, 2).setValue(phe.cnc.Util.getTimespanString(city.get_CityBuildingsData().GetFullRepairTime()));
							this.grid.getLayout().getCellWidget(0, 4).setValue("-"+ phe.cnc.Util.getTimespanString(win));

							if (city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false) > 0) {
								lvl = city.get_CityBuildingsData().GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Barracks).get_CurrentLevel();
								win = (city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, true) - city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false)) * -1;
								this.grid.getLayout().getCellWidget(1, 0).setLabel("("+ lvl +")");
								this.grid.getLayout().getCellWidget(1, 2).setValue(phe.cnc.Util.getTimespanString(city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false)));
								this.grid.getLayout().getCellWidget(1, 4).setValue("-"+ phe.cnc.Util.getTimespanString(win));
								this.grid.getLayout().setRowHeight(1, 18);
							} else {
								this.grid.getLayout().setRowHeight(1, 0);
							}

							if (city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false) > 0) {
								lvl = city.get_CityBuildingsData().GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Factory).get_CurrentLevel();
								win = (city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, true) - city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false)) * -1;
								this.grid.getLayout().getCellWidget(2, 0).setLabel("("+ lvl +")");
								this.grid.getLayout().getCellWidget(2, 2).setValue(phe.cnc.Util.getTimespanString(city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false)));
								this.grid.getLayout().getCellWidget(2, 4).setValue("-"+ phe.cnc.Util.getTimespanString(win));
								this.grid.getLayout().setRowHeight(2, 18);
							} else {
								this.grid.getLayout().setRowHeight(2, 0);
							}

							if (city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false) > 0) {
								lvl = city.get_CityBuildingsData().GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Airport).get_CurrentLevel();
								win = (city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, true) - city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false)) * -1;
								this.grid.getLayout().getCellWidget(3, 0).setLabel("("+ lvl +")");
								this.grid.getLayout().getCellWidget(3, 2).setValue(phe.cnc.Util.getTimespanString(city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false)));
								this.grid.getLayout().getCellWidget(3, 4).setValue("-"+ phe.cnc.Util.getTimespanString(win));
								this.grid.getLayout().setRowHeight(3, 18);
							} else {
								this.grid.getLayout().setRowHeight(3, 0);
							}

							if (this.canUpgradeBuilding(ClientLib.Base.ETechName.Construction_Yard)) this.btnBuildings.setEnabled(true);
							else this.btnBuildings.setEnabled(false);
							if (this.canUpgradeBuilding(ClientLib.Base.ETechName.Barracks)) this.btnInfantry.setEnabled(true);
							else this.btnInfantry.setEnabled(false);
							if (this.canUpgradeBuilding(ClientLib.Base.ETechName.Factory)) this.btnVehicle.setEnabled(true);
							else this.btnVehicle.setEnabled(false);
							if (this.canUpgradeBuilding(ClientLib.Base.ETechName.Airport)) this.btnAircraft.setEnabled(true);
							else this.btnAircraft.setEnabled(false);
						} catch (e) {
							console.log("Error in Upgrade.Repairtime.getInfo: ");
							console.log(e.toString());
						}
					}
				}
			});

		}
		function translation() {
			var localeManager = qx.locale.Manager.getInstance();

			// Default language is english (en)
			// Available Languages are: ar,ce,cs,da,de,en,es,fi,fr,hu,id,it,nb,nl,pl,pt,ro,ru,sk,sv,ta,tr,uk
			// You can send me translations so i can include them in the Script.

			// German
			localeManager.addTranslation("de", {
				"Selected building": "Markiertes Gebäude",
				"All buildings": "Alle Gebäude",
				"Selected defense unit": "Markierte Abwehrstellung",
				"All defense units": "Alle Abwehrstellungen",
				"Selected army unit": "Markierte Armee-Einheit",
				"All army units": "Alle Armee-Einheiten"
			});

			// Hungarian
			localeManager.addTranslation("hu", {
				"Selected building": "Kiválasztott létesítmény",
				"All buildings": "Összes létesítmény",
				"Selected defense unit": "Kiválasztott védelmi egység",
				"All defense units": "Minden védelmi egység",
				"Selected army unit": "Kiválasztott katonai egység",
				"All army units": "Minden katonai egység"
			});
		}
		function waitForGame() {
			try {
				if (typeof qx != 'undefined' && typeof qx.core != 'undfined' && typeof qx.core.Init != 'undefined') {
					var app = qx.core.Init.getApplication();
					if (app.initDone == true) {
						try {
							console.log("WarChiefs - Tiberium Alliances Upgrade Base/Defense/Army: Loading");
							translation();
							createClasses();
							Upgrade.getInstance();
							console.log("WarChiefs - Tiberium Alliances Upgrade Base/Defense/Army: Loaded");
						} catch (e) {
							console.log(e);
						}
					} else {
						window.setTimeout(waitForGame, 1000);
					}
				} else {
					window.setTimeout(waitForGame, 1000);
				}
			} catch (e) {
				console.log(e);
			}
		}
		window.setTimeout(waitForGame, 1000);
	};

	var script = document.createElement("script");
	var txt = injectFunction.toString();
	script.innerHTML = "(" + txt + ")();";
	script.type = "text/javascript";

	document.getElementsByTagName("head")[0].appendChild(script);
})();

/***********************************************************************************
Zoom (SKY) ***** Version 1.0.0
***********************************************************************************/
// ==UserScript==
// @include        https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// ==/UserScript==
(function (){
  var tazoom_main = function() {
    function initialize() {
      console.log("Zoom Loaded");
      
      var zoomMin = 2.0;	// Larger number means able to zoom in closer.
      var zoomMax = 0.1;	// Smaller number means able to zoom out further.
      var zoomInc = 0.08;	// Larger number for faster zooming, Smaller number for slower zooming.
      
      webfrontend.gui.BackgroundArea.prototype.onHotKeyPress = function(be) {
        if(!this.active || be.getTarget() != this.mapContainer)
          return;
        var bh = be.getKeyIdentifier();
        var bf = ClientLib.Vis.VisMain.GetInstance();
        switch(bh) {
          case "+":
            var bg = bf.get_Region().get_ZoomFactor() + zoomInc;
            bf.get_Region().set_ZoomFactor(Math.min(zoomMin, Math.max(zoomMax, bg)));
            break;
          case "-":
            var bg = bf.get_Region().get_ZoomFactor() - zoomInc;
            bf.get_Region().set_ZoomFactor(Math.min(zoomMin, Math.max(zoomMax, bg)));
            break;
        }
        this.closeCityInfo();
        this.closeCityList();
      }

      var backgroundArea = qx.core.Init.getApplication().getBackgroundArea();
      qx.bom.Element.removeListener(backgroundArea.mapContainer, "mousewheel", backgroundArea._onMouseWheel, backgroundArea);
      qx.bom.Element.removeListener(backgroundArea.mapBlocker, "mousewheel", backgroundArea._onMouseWheel, backgroundArea);
      webfrontend.gui.BackgroundArea.prototype._onMouseWheel = function(e) {
        if(this.activeSceneView == null)
          return;
        var bz = e.getWheelDelta();
        var by = this.activeSceneView.get_ZoomFactor();
        by += bz > 0 ? -zoomInc : zoomInc;
        by = Math.min(zoomMin, Math.max(zoomMax, by));
        this.activeSceneView.set_ZoomFactor(by);
        e.stop();
      }
      qx.bom.Element.addListener(backgroundArea.mapContainer, "mousewheel", backgroundArea._onMouseWheel, backgroundArea);
      qx.bom.Element.addListener(backgroundArea.mapBlocker, "mousewheel", backgroundArea._onMouseWheel, backgroundArea); 
    }
 
    function tazoom_checkIfLoaded() {
      try {
        if (typeof qx != 'undefined') {
          a = qx.core.Init.getApplication(); // application
          mb = qx.core.Init.getApplication().getMenuBar();
          if (a && mb) {
            initialize();
          } else
            window.setTimeout(tazoom_checkIfLoaded, 1000);
        } else {
          window.setTimeout(tazoom_checkIfLoaded, 1000);
        }
      } catch (e) {
        if (typeof console != 'undefined') console.log(e);
        else if (window.opera) opera.postError(e);
        else GM_log(e);
      }
    }
    
    if (/commandandconquer\.com/i.test(document.domain)) {
      window.setTimeout(tazoom_checkIfLoaded, 1000);
    }
  }

  // injecting, because there seem to be problems when creating game interface with unsafeWindow
  var tazoomScript = document.createElement("script");
  tazoomScript.innerHTML = "(" + tazoom_main.toString() + ")();";
  tazoomScript.type = "text/javascript";
  if (/commandandconquer\.com/i.test(document.domain)) {
    document.getElementsByTagName("head")[0].appendChild(tazoomScript);
  }
})();

/***********************************************************************************
Sector HUD ***** Version 13.12.18
***********************************************************************************/
// ==UserScript==
// @include     http*://*.alliances.commandandconquer.com/*
// ==/UserScript==
/**
 *  License: CC-BY-NC-SA 3.0
 */
(function () {
	var injectFunction = function () {
		function createClasses() {
			qx.Class.define("SectorHUD", {
				type: "singleton",
				extend: qx.core.Object,
				construct: function () {
					this.SectorText = new qx.ui.basic.Label("").set({
						textColor : "#FFFFFF",
						font : "font_size_11"
					});
					var HUD = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
						decorator : new qx.ui.decoration.Background().set({
							backgroundRepeat : "no-repeat",
							backgroundImage : "webfrontend/ui/menues/notifications/bgr_ticker_container.png",
							backgroundPositionX : "center"
						}),
						padding : 2,
						opacity: 0.8
					});
					HUD.add(this.SectorText);
					HUD.addListener("click", function (e) {
						if (e.getButton() == "left") this.paste_Coords();
						if (e.getButton() == "right") this.jump_Coords();
					}, this);
					this.__refresh = false;
					qx.core.Init.getApplication().getDesktop().add(HUD, {left: 128, top: 0});
					phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance().get_Region(), "PositionChange", ClientLib.Vis.PositionChange, this, this._update);
				},
				destruct: function () {},
				members: {
					__refresh: null,
					SectorText: null,
					get_SectorText: function (i) {
						var qxApp = qx.core.Init.getApplication();
						switch (i) {
						case 0:
							return qxApp.tr("tnf:south abbr");
						case 1:
							return qxApp.tr("tnf:southwest abbr");
						case 2:
							return qxApp.tr("tnf:west abbr");
						case 3:
							return qxApp.tr("tnf:northwest abbr");
						case 4:
							return qxApp.tr("tnf:north abbr");
						case 5:
							return qxApp.tr("tnf:northeast abbr");
						case 6:
							return qxApp.tr("tnf:east abbr");
						case 7:
							return qxApp.tr("tnf:southeast abbr");
						}
					},
					get_SectorNo: function (x, y) {
						var WorldX2 = Math.floor(ClientLib.Data.MainData.GetInstance().get_Server().get_WorldWidth() / 2),
							WorldY2 = Math.floor(ClientLib.Data.MainData.GetInstance().get_Server().get_WorldHeight() / 2),
							SectorCount = ClientLib.Data.MainData.GetInstance().get_Server().get_SectorCount(),
							WorldCX = (WorldX2 - x),
							WorldCY = (y - WorldY2),
							WorldCa = ((Math.atan2(WorldCX, WorldCY) * SectorCount) / 6.2831853071795862) + (SectorCount + 0.5);
						return (Math.floor(WorldCa) % SectorCount);
					},
					get_Coords: function () {
						var Region = ClientLib.Vis.VisMain.GetInstance().get_Region();
							GridWidth = Region.get_GridWidth(),
							GridHeight = Region.get_GridHeight(),
							RegionPosX = Region.get_PosX(),
							RegionPosY = Region.get_PosY(),
							ViewWidth = Region.get_ViewWidth(),
							ViewHeight = Region.get_ViewHeight(),
							ZoomFactor = Region.get_ZoomFactor(),
							ViewCoordX = Math.floor((RegionPosX + ViewWidth / 2 / ZoomFactor) / GridWidth - 0.5),
							ViewCoordY = Math.floor((RegionPosY + ViewHeight / 2 / ZoomFactor) / GridHeight - 0.5);
						return {X: ViewCoordX, Y: ViewCoordY};
					},
					paste_Coords: function(){
						var Coords = this.get_Coords(),
							input = qx.core.Init.getApplication().getChat().getChatWidget().getEditable(),
							inputDOM = input.getContentElement().getDomElement(),
							text = [];
						text.push(inputDOM.value.substring(0, inputDOM.selectionStart));
						text.push("[coords]" + Coords.X + ':' + Coords.Y + "[/coords]");
						text.push(inputDOM.value.substring(inputDOM.selectionEnd, inputDOM.value.length));
						input.setValue(text.join(' '));
					},
					jump_Coords: function(){
						var coords = prompt("Jump to Coords:");
						if (coords) {
							coords.replace(/(\[coords\])?([#])?(\d{1,4})\D(\d{1,4})(\D\w+)?(\[\/coords\])?/gi, function () {
								if (arguments.length >= 5) {
									ClientLib.Vis.VisMain.GetInstance().get_Region().CenterGridPosition(parseInt(arguments[3], 10), parseInt(arguments[4], 10));
								}
							});
						}
					},
					_update: function () {
						if (this.__refresh === false) {
							this.__refresh = true;
							setTimeout(this.__update.bind(this), 500);
						}
					},
					__update: function () {
						var Coords = this.get_Coords();
						this.SectorText.setValue(Coords.X + ":" + Coords.Y + " [" + this.get_SectorText(this.get_SectorNo(Coords.X, Coords.Y)) + "]");
						this.__refresh = false;
					}
				}
			});
		}
		function waitForGame() {
			try {
				if (typeof qx !== "undefined" && typeof qx.core !== "undefined" && typeof qx.core.Init !== "undefined" && typeof ClientLib !== "undefined" && typeof phe !== "undefined") {
					var app = qx.core.Init.getApplication();
					if (app.initDone === true) {
						try {
							console.time("loaded in");
							createClasses();
							SectorHUD.getInstance();
							console.group("WarChiefs - Sector HUD");
							console.timeEnd("loaded in");
							console.groupEnd();
						} catch (e) {
							console.group("WarChiefs - Sector HUD");
							console.error("Error in waitForGame", e);
							console.groupEnd();
						}
					} else
						window.setTimeout(waitForGame, 1000);
				} else {
					window.setTimeout(waitForGame, 1000);
				}
			} catch (e) {
				console.group("WarChiefs - Sector HUD");
				console.error("Error in waitForGame", e);
				console.groupEnd();
			}
		}
		window.setTimeout(waitForGame, 1000);
	};
	var script = document.createElement("script");
	var txt = injectFunction.toString();
	script.innerHTML = "(" + txt + ")();";
	script.type = "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(script);
})();

/***********************************************************************************
Title Mod ***** Version 0.7.0
***********************************************************************************/
// ==UserScript==
// @include     https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// ==/UserScript==
(function () {
	var titleMod_main = function () {
		try {
			window.titleMod_Version = "0.7.0";
			console.log("C&C: Tiberium Alliances Title Mod v" + window.titleMod_Version + " loading...");
			var titleMod_init = function () {
				
				// Set this to false if you don't want any sound
				var playNotificationSounds = true;
				var checkPageFocusDelay = 2000;

				var SND_loud = new Audio("data:video/ogg;base64,T2dnUwACAAAAAAAAAADI7LN9AAAAAEdUMKsBHgF2b3JiaXMAAAAAAkSsAAD/////APQBAP////+4AU9nZ1MAAAAAAAAAAAAAyOyzfQEAAAA8VjxHEjb/////////////////////PAN2b3JiaXMNAAAATGF2ZjU0LjM2LjEwMAEAAAAVAAAAZW5jb2Rlcj1MYXZmNTQuMzYuMTAwAQV2b3JiaXMpQkNWAQAIAACAIkwYxIDQkFUAABAAAKCsN5Z7yL333nuBqEcUe4i9995746xH0HqIuffee+69pxp7y7333nMgNGQVAAAEAIApCJpy4ELqvfceGeYRURoqx733HhmFiTCUGYU9ldpa6yGT3ELqPeceCA1ZBQAAAgBACCGEFFJIIYUUUkghhRRSSCmlmGKKKaaYYsoppxxzzDHHIIMOOuikk1BCCSmkUEoqqaSUUkot1lpz7r0H3XPvQfgghBBCCCGEEEIIIYQQQghCQ1YBACAAAARCCCFkEEIIIYQUUkghpphiyimngNCQVQAAIACAAAAAAEmRFMuxHM3RHM3xHM8RJVESJdEyLdNSNVMzPVVURdVUVVdVXV13bdV2bdWWbddWbdV2bdVWbVm2bdu2bdu2bdu2bdu2bdu2bSA0ZBUAIAEAoCM5kiMpkiIpkuM4kgSEhqwCAGQAAAQAoCiK4ziO5EiOJWmSZnmWZ4maqJma6KmeCoSGrAIAAAEABAAAAAAA4HiK53iOZ3mS53iOZ3map2mapmmapmmapmmapmmapmmapmmapmmapmmapmmapmmapmmapmmapmmapmlAaMgqAEACAEDHcRzHcRzHcRxHciQHCA1ZBQDIAAAIAEBSJMdyLEdzNMdzPEd0RMd0TMmUVMm1XAsIDVkFAAACAAgAAAAAAEATLEVTPMeTPM8TNc/TNM0TTVE0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TVMUgdCQVQAABAAAIZ1mlmqACDOQYSA0ZBUAgAAAABihCEMMCA1ZBQAABAAAiKHkIJrQmvPNOQ6a5aCpFJvTwYlUmye5qZibc84555xszhnjnHPOKcqZxaCZ0JpzzkkMmqWgmdCac855EpsHranSmnPOGeecDsYZYZxzzmnSmgep2Vibc85Z0JrmqLkUm3POiZSbJ7W5VJtzzjnnnHPOOeecc86pXpzOwTnhnHPOidqba7kJXZxzzvlknO7NCeGcc84555xzzjnnnHPOCUJDVgEAQAAABGHYGMadgiB9jgZiFCGmIZMedI8Ok6AxyCmkHo2ORkqpg1BSGSeldILQkFUAACAAAIQQUkghhRRSSCGFFFJIIYYYYoghp5xyCiqopJKKKsoos8wyyyyzzDLLrMPOOuuwwxBDDDG00kosNdVWY4215p5zrjlIa6W11lorpZRSSimlIDRkFQAAAgBAIGSQQQYZhRRSSCGGmHLKKaegggoIDVkFAAACAAgAAADwJM8RHdERHdERHdERHdERHc/xHFESJVESJdEyLVMzPVVUVVd2bVmXddu3hV3Ydd/Xfd/XjV8XhmVZlmVZlmVZlmVZlmVZlmUJQkNWAQAgAAAAQgghhBRSSCGFlGKMMcecg05CCYHQkFUAACAAgAAAAABHcRTHkRzJkSRLsiRN0izN8jRP8zTRE0VRNE1TFV3RFXXTFmVTNl3TNWXTVWXVdmXZtmVbt31Ztn3f933f933f933f933f13UgNGQVACABAKAjOZIiKZIiOY7jSJIEhIasAgBkAAAEAKAojuI4jiNJkiRZkiZ5lmeJmqmZnumpogqEhqwCAAABAAQAAAAAAKBoiqeYiqeIiueIjiiJlmmJmqq5omzKruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6QGjIKgBAAgBAR3IkR3IkRVIkRXIkBwgNWQUAyAAACADAMRxDUiTHsixN8zRP8zTREz3RMz1VdEUXCA1ZBQAAAgAIAAAAAADAkAxLsRzN0SRRUi3VUjXVUi1VVD1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVXVNE3TNIHQkJUAABkAAMO05NJyz42gSCpHtdaSUeUkxRwaiqCCVnMNFTSISYshYgohJjGWDjqmnNQaUykZc1RzbCFUiEkNOqZSKQYtCEJDVggAoRkADscBJMsCJEsDAAAAAAAAAEnTAM3zAMvzAAAAAAAAAEDSNMDyNEDzPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJE0DNM8DNM8DAAAAAAAAAM3zAE8UAU8UAQAAAAAAAMDyPMATPcATRQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHE0DNM8DNM8DAAAAAAAAAMvzAE8UAc8TAQAAAAAAAEDzPMATRcATRQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAEOAAABFkKhISsCgDgBAIckQZIgSdA0gGRZ0DRoGkwTIFkWNA2aBtMEAAAAAAAAAAAAQPI0aBo0DaIIkDQPmgZNgygCAAAAAAAAAAAAIGkaNA2aBlEESJoGTYOmQRQBAAAAAAAAAAAA0EwToghRhGkCPNOEKEIUYZoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAgAEHAIAAE8pAoSErAoA4AQCHolgWAAA4kmNZAADgOJJlAQCAZVmiCAAAlqWJIgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAQcAgAATykChISsBgCgAAIeiWBZwHMsCjmNZQJIsC2BZAM0DaBpAFAGAAACAAgcAgAAbNCUWByg0ZCUAEAUA4FAUy9I0UeQ4lqVposiRLEvTRJFlaZrnmSY0zfNMEaLneaYJz/M804RpiqKqAlE0TQEAAAUOAAABNmhKLA5QaMhKACAkAMDhOJbleaLoeaJomqrKcSzL80RRFE1TVVWV42iW54miKJqmqqoqy9I0zxNFUTRNVVVdaJrniaIomqaqui48z/NEURRNU1VdF57neaIoiqapqq4LURRF0zRNVVVV1wWiaJqmqaqq6rpAFEXTNFVVVV0XiKIomqaqqq7rAtM0TVVVVdeVXYBpqqqquq7rAlRVVV3XdWUZoKqq6rquK8sA13Vd15VlWQbguq7ryrIsAADgwAEAIMAIOsmosggbTbjwABQasiIAiAIAAIxhSjGlDGMSQgqhYUxCSCFkUlIqKaUKQiollVJBSKWkUjJKLaWWUgUhlZJKqSCkUlIpBQCAHTgAgB1YCIWGrAQA8gAACGOUYowx5yRCSjHmnHMSIaUYc845qRRjzjnnnJSSMeecc05K6ZhzzjknpWTMOeeck1I655xzzkkppXTOOeeklFJC6Bx0UkopnXMOQgEAQAUOAAABNopsTjASVGjISgAgFQDA4DiWpWmeJ4qmaUmSpnme54mmqmqSpGmeJ4qmqao8z/NEURRNU1V5nueJoiiapqpyXVEURdM0TVUly6JoiqapqqoL0zRN01RV14VpmqZpqqrrwrZVVVVd13Vh26qqqq7rysB1Xdd1ZRnIruu6riwLAABPcAAAKrBhdYSTorHAQkNWAgAZAACEMQgphBBSyCCkEEJIKYWQAACAAQcAgAATykChISsBgFQAAIAQa6211lprDWPWWmuttdYS56y11lprrbXWWmuttdZaa6211lprrbXWWmuttdZaa6211lprrbXWWmuttdZaa6211lprrbXWWmuttdZaa6211lprrbXWWmuttdZaa6211lprrbXWWmuttVYAIHaFA8BOhA2rI5wUjQUWGrISAAgHAACMQYgx6CSUUkqFEGPQSUiltRgrhBiDUEpKrbWYPOcchFJaai3G5DnnIKTUWowxJtdCSCmllmKLsbgWQioptdZirMkYlVJqLbYYa+3FqJRKSzHGGGswxubUWowx1lqLMTq3EkuMMcZahBHGxRZjrLXXIowRssXSWq21BmOMsbm12GrNuRgjjK4ttVZrzQUAmDw4AEAl2DjDStJZ4WhwoSErAYDcAAACIaUYY8w555xzDkIIqVKMOecchBBCCKGUUlKlGHPOOQghhFBCKaWkjDHmHIQQQgillFJKaSllzDkIIYRQSimllNJS65xzEEIIpZRSSiklpdQ55yCEUEoppZRSSkothBBCKKGUUkoppZSUUkohhFBKKaWUUkopqaWUQgillFJKKaWUUlJKKYUQQimllFJKKaWklForpZRSSimllFJKSS21lFIopZRSSimllJJaSimlUkoppZRSSiklpdRSSqWUUkoppZRSSkuppZRKKaWUUkoppZSUUkoppVRKKaWUUkopKaXUWkoppZRKKaWUUlprKaWWUiqllFJKKaW01FprLbWUSimllFJKaa21lFJKKZVSSimllFIAANCBAwBAgBGVFmKnGVcegSMKGSagQkNWAgBkAAAMo5RSSS1FgiKlGKSWQiUVc1BSiihzDlKsqULOIOYklYoxhJSDVDIHlVLMQQohZUwpBq2VGDrGmKOYaiqhYwwAAABBAACBkAkECqDAQAYAHCAkSAEAhQWGDhEiQIwCA+Pi0gYAIAiRGSIRsRgkJlQDRcV0ALC4wJAPABkaG2kXF9BlgAu6uOtACEEIQhCLAyggAQcn3PDEG55wgxN0ikodCAAAAACAAwA8AAAkG0BERDRzHB0eHyAhIiMkJSYnKAIAAAAA4AYAHwAASQoQERHNHEeHxwdIiMgISYnJCUoAACCAAAAAAAAIIAABAQEAAAAAgAAAAAABAU9nZ1MABIBKAAAAAAAAyOyzfQIAAAAvvjOzGzrDdWeBbnOphcLvvv8P/xCvqP8a/xP/Of85IXwZk2fDuoX9iOjfwcI5uOtu3b640BuWqUK/87J5/f6fA3XedvjL/v8hN///+er4/+PAV0X0HzRfNgB6qN3TU+Il7P4N9lcTHGpX/5Q4lnj/WrG/KlkHGgAAcCWgCwCGYRiGpUsNKgAAAAAAQGnRIk5VFAAAAAAAIKlLwR2jQUZiFI2lcYrt634AAER65Ghz58tuk91dBQCAAUAFoAIfYEDFifoAfBwooCMAvP9BzeC9AhT1Y8d1Or/jHz/Oaqkz+M/pvMDnH5xvp9l7F/vkng07+/PzhlwPJ88cw4l/vEZN4ncuL9jb6rYwvkwB/MY3h4yES6rrU15dkYBLAQc+GZ7jW+IY0vu3iPl9jQ+mYTI8p7eEm5DevwfM72sc/gZkAAAcTQAAAH/WCQAAAAAACQwjIAAQAAAAAAAAINrUJEcFAAAAAIiiNwAAANi2ikAKIbTJFNr3pfECAACIZieNAGgYgAEsAFQAA8DVZIBPgAAAJgCeSZ7aW8JtyAd+x/xqJkEmeapvCTchH/gd86uZBMgAAHiuFwAAAHBMAAAAAAAAZCMAAAAAAAAAAAAy28rfOwAAiHgAEEoBAIAbkECCQv6eXH0SUjoAgHSKjZz+TBEjAAAAwGLB2RwAPhku5VuEQIR4Xi/H/KpEv4HJcCo/IgSi4nldjvlVjYoBrgAAPJ+xAEBRpx4AgGMCAAAAAADDYASIAAAAAAAAAIjmWCooAADG4EQAgF4BAAAAVqAikAhpJx/jearX9ZlEAQAAa/3viRwNAAAAOOAHnADADwAwlBMkeA1kDJwNGGgAnkme1re/AcTuF8yTi76BTPK4fPgDR5xuwTy56BngCgDAHwAAAOCYAAAAAAAACAQAAgAAAAAAAAAio50KALI0AIAoAAAA4AISUAVojY32ebb2pFICAOA74adZsU6dAADApW67l484AAAAaAC0DAB+KV4uT79DVLRlwX4iKuZyKV62T7+DVcx+xX4iKsoFGQAAz0/rSQCZ5XUAAP585hgAAAAAAAlIYAABAAAAAAAAAACUheQFAEAZQ2wkAIhhWQAAAACEtImojmLsMcrtToMBAAAo5htEtQAAig/AB4AFANAAfriN22+/g4Ua/cNtf0JU4XC4jdtvv4OFGv3DbX9CVBRABgDAp54CgKhbp5hZBYCof0wAAAAAZCOBYVhVxQAAAAAAANTw3QAAqEsYchMAAETOKwAAALBxpNBKf1Zru2rtMQIAAACAH2AATnACnx8AHAYMjik4zAcW+seJw1Kt/nyOvoEASTbEiSuiFlPMORM8Z/499bnbdK2Sjt9jdNijKo0zDsghBwinDd7ojddvv0CFdizg2LuoYNDojddvv0CFdizg2HvRjwPSASDj9DrVPwAAAMAxAQAAAACAYVQRGAMAAAAAABAEjPX/KgmAVAAApQAApjBRAAAcfzM17R2ijgAAEJ7ylg32FgcAAACA/jFUPpYfBTgrgMPjvQQpBVy2USVnDMYCPAiAggMUgAw+mI3n1/2akN5dcJxd9GMwmI3r1/1SSJ81OE45+jgczQkAAPADABgAELVn8ueTagAAAABgGKaMVMUYAAAAHKw2NWsmhihpbwIARL99BACoRX4GAACNfV8WAACArE0IIQRCLnFBsRt6qAIAkNLVbzAMgA8AFdB0hAEA/DF8LsCPcvzwptbvAOCzD9N54OQ+WLYkB0KK74ylV2EXyYEs0DfbWOIPw0DsZ6G28F0Ln7Ir4qttVMfLN6NBHPUTm+Q008gCAL75/bnu27Wl3uVTs9M2s7D5/XVdt6ul3uV3zU7bOwV+AAAAEMVNJ98AAAEMf16cAgCYYuMswzJ0MFYBAAAAAKC1AgAC5QGkoj2/BwDIcpujAAAqkjfjV7ZZFAAAFDNjQwWkgKgAaWZZAABIxSO5gwM/93v+++5jcZ4/jm+bDcCG/gbnwD7A1zmnv+3vv5/9FVAH2KeZPWz6254D1G9zvp397WuG+W7ANANfO/z33+cPX2ccqvlsNkBxnE777zc4Pg74/sdxnd8BUwe7NuxNb8j8Y3/YrZ/Pe67zQwcHrBn8AFQ8ANMARUhQDgAMAg0A/jn+cxs/+dRqZtuiD0Pn+Nd1uudLab/bts7hwA8AAAAyot53tQQgsjqjroA5JgAAU8UwDMMABgAAAAAAAIBmJAAAAICQoaUxKQAA6nP77wIAgIrc3gcAXGPVpSUMJQDA2VovAAAA4P9PdTipH36cGmrzHSgAzh7qO3zPP9XnnNNs+Fb9+2w25IbeA3yHvYE/juv8fHaccYDD8Z0FfhTw41j8/H9/3msn8F+14AR+4KP5oKmOjwXg8oMDQAMgAF7J/X4c29i07xAM233IDZXbn/u+hpI+QzTs1J3DDT8AAACgnvEDAJgGAGaPrbcAANiUqopNSQ2KAQAAAKA0AIASzSErlRfYKDUAQEAAAEDDrG4tAAAA+gl6AzUSRQo30uUOepurAABIg2JTAkAHgPr54vzANzhUczjnO4dD7s3ZcDjfLO+dzh/nD7Bhf3G+N4fz+fPRPx8nbPacQ8/35PCtDr/DPnuTnOHs7+zNPpzecA4cevOZHKqp3ABnn+79jfxv5nTWL/kA9fnDd/2O/30gk958NrDpzf9A08kk+/BT9Zt/b76fw/6igWF6YyEQ4FUY2u2rIa2l4dWSxY20XkKDkxkgpxwECPUzNIwAET55/XOfxhDiPX4ptpPlWLn9e597Furdflfs1BfLhx8AAACINeOrDbSPnx4AAFvFJpZNSVUBAAAAAEoNAJDfD9lryJ4c5OQjuxYAuhY32W2/UTIAALDK0jV1cYpEuNwIxe1k2x4AAFB/DBsSOGz4zvn9w4zv1X8zD5z9/2LX5sAB5jubc3oX5/tpzuEb1Mk553A4h/yfk6f57dx8r++7YNc57I/z7R++AsXZfObk3hs2/M/hGx8S9jkO8/m3Kh0dHWF8/Vdpcs8U35Odf97cjv/Uh8/snfv7Zpj+n3Pge+/D4ZwGTqs1w4nGWbCH3nXqB4AzBxA09g1h9eaMywQIJFu1w80q8FxKCK0WskNdwwc+Sv6fS1nexO0DO3U1jJL/51KWN3H7xE5bC18CACwBeyQBLFPFMAwAYAAAAAAAAIA2FQBAAQAAdRi43VAAAFpAI83NBYEUCClAChYAAHJsBwAA/EDZmMzA4XD8fL5+HA7Hz2ewgX02fGdvWACOzw/33/8fMBv2nE0DnP292UV9/7D3LvYB5nAANt/hfDanNxtys3GYjo4/aMf/7/kxTpTjHzAbmAI4+J4/AACzFeAAPlr+x89yahcb7BQwWv7Hz3JFF9MDJ7kCXwAA6I/9dAEADJtYhmEYAAAAAAAAAACojQQAajoUAAsW2rq3FZASZAghALDKAgAAHKuOoQAAGvQ2yx+Hszo+P4zK4If/nIDDOGbj+PyvnCj4JYfzDQAOh32AzZ9de+yP4+NwthxfnY6P4+dj+Jx9ADbf6DlKgYP/FfWfUh355wDnB+ADPwAATlAAFqgAALAA3nj9/RhTwn3DL9wy1NA4/fNoAfEtF44MwuErAMC6slWVWKabldKgCAAAAIBGAQAM9GaKVqciFTWQcQlstcjw3jErctspPqbn7Q+j+jDm2WN+kMVCM5hvZx8OACw2FkDBNMUETF+cnZvN9803Nnwc/39m4ORrc5I9bDZ831+9YR++ADabc5LOzeE7U7B3fR323hsOJJuzYX8bDmzobwUAh291YB/I/9k0sE9u2P8pYPPf8d9/n/95zwfHfzOdzHc2AGwOe356hjfj7LQ43/P5AZg+HHlPDTWFOzp2/Py5ThxA49//3/uMHAgMRmb3JTGRPMqO/wAh+Z/BWIkZlZyWf28PlFRCdJNafCl/NduqL/g6nUIIsbnCBATeSP31GHdcbLDT4tCI/XWfz6bm9sJJqYYvAgDsTbbYqsQyyaCoWAAAAICoAQDM9KYqggBsOyQdDGQBfN/8q2bRPk9wyCv8cj6VYd/TPE0TTMDM/u4aONbnyXECx/8dnPz3wfHj5PuP+v/nMN/hbIDNPhz4tmED3ylgOL3Pps/v28HhcCrH7A+dUJv8nzr7bA7JkPts9vfmsIE95wB8P4dT9XW+54E9AJzOs2efzfcfm686h8PZzfl8G+fnp9YZ/Ps4MR0/11byYYr5AXvO51vHz7//Pvz3Y+A639dpgL0Pp89vf1LmIYDbFz+hdPP/ek6PnE2n1ydYJFvb/8nXX3yxW/sbA8jGNqPREQTRWkQQIGoAHle8vFMGxA0aEFe8vFORizQAWH4DAHi4AtjXla1iU2KTKqqKFQNAzQQA48OnkYerlXL619ttJ7Wd5Ti/0XhTEKrilDyqZP5pO/HP9+bDmX+e782Lfs/de8zM9yaYpx2ruZWvZ5x54vDuDOyz9/7e+3AOmz3BDPM8f+1MTPPv24Z99tkcevM/jh/H1/9/fptqOGd/gzq7+Hb4zvc+5BR8Y+/+NpwNbD5TcPYAnJN8//7b+8AB9gHGbJjx+fdz4HufDWw4ZObm5D594P+dhs/u59ORc3bl3lOH+eqT/zq+b9qOn2o/6/3nn/MzB/YUXwCwgYS9C87n2xycgfDkFBHzmdS0YmpdncKudfLfZa+9HjVx9QLZrFPJFmAQ+lswqmLZvZmiTkCA06D+DyxbxsNkaAAGCgC/RAEDfmfclx48AIC65DGODaQJAK+yUkIKKeRWVVWVmJRUVVUxAPgoaow26ZgQ4mBasbBq1eJAe8ecGxNj9PrGAaaVPEvLvBFDZhnRIxmR0a3bhGHQ3UIFtbtHCitQaEVxnEGtubCypC05liYmIuZqj2RL5RRGrKX2+1xlqczCinCpx61xa26EUc88lyuFURv1W5LdKvPwHuFRz7TGLdxXu7Jnuset7Rau7LeUNa16j3AJ03q/UlP0vjvxuUbzd1t8MXL7iDzW9cmnKFJIYTqL/L3ViVGq6VA89A7i7eyh8z2ZxTYmn3wK0qtXYezYsX29hWlu6tdy42exeVlHIvGu1+t1T3kntV6v1yE2Ekkig8mVeqm8lPV6vQ6RSIRer3sqzamSW96zuR8bCZE+1+vlnJLiZ71er00kQK8OPpb87yxfugBuYCz531m+dAHcAAAAAAAAAAAAAAAAAAAA");
				var SND_twoTone = new Audio("data:video/ogg;base64,T2dnUwACAAAAAAAAAABjfwAAAAAAAC0oboIBHgF2b3JiaXMAAAAAAUSsAAAAAAAAcBEBAAAAAAC4AU9nZ1MAAAAAAAAAAAAAY38AAAEAAABXxqTrDi3///////////////8RA3ZvcmJpcx0AAABYaXBoLk9yZyBsaWJWb3JiaXMgSSAyMDA3MDYyMgAAAAABBXZvcmJpcyJCQ1YBAEAAACRzGCpGpXMWhBAaQlAZ4xxCzmvsGUJMEYIcMkxbyyVzkCGkoEKIWyiB0JBVAABAAACHQXgUhIpBCCGEJT1YkoMnPQghhIg5eBSEaUEIIYQQQgghhBBCCCGERTlokoMnQQgdhOMwOAyD5Tj4HIRFOVgQgydB6CCED0K4moOsOQghhCQ1SFCDBjnoHITCLCiKgsQwuBaEBDUojILkMMjUgwtCiJqDSTX4GoRnQXgWhGlBCCGEJEFIkIMGQcgYhEZBWJKDBjm4FITLQagahCo5CB+EIDRkFQCQAACgoiiKoigKEBqyCgDIAAAQQFEUx3EcyZEcybEcCwgNWQUAAAEACAAAoEiKpEiO5EiSJFmSJVmSJVmS5omqLMuyLMuyLMsyEBqyCgBIAABQUQxFcRQHCA1ZBQBkAAAIoDiKpViKpWiK54iOCISGrAIAgAAABAAAEDRDUzxHlETPVFXXtm3btm3btm3btm3btm1blmUZCA1ZBQBAAAAQ0mlmqQaIMAMZBkJDVgEACAAAgBGKMMSA0JBVAABAAACAGEoOogmtOd+c46BZDppKsTkdnEi1eZKbirk555xzzsnmnDHOOeecopxZDJoJrTnnnMSgWQqaCa0555wnsXnQmiqtOeeccc7pYJwRxjnnnCateZCajbU555wFrWmOmkuxOeecSLl5UptLtTnnnHPOOeecc84555zqxekcnBPOOeecqL25lpvQxTnnnE/G6d6cEM4555xzzjnnnHPOOeecIDRkFQAABABAEIaNYdwpCNLnaCBGEWIaMulB9+gwCRqDnELq0ehopJQ6CCWVcVJKJwgNWQUAAAIAQAghhRRSSCGFFFJIIYUUYoghhhhyyimnoIJKKqmooowyyyyzzDLLLLPMOuyssw47DDHEEEMrrcRSU2011lhr7jnnmoO0VlprrbVSSimllFIKQkNWAQAgAAAEQgYZZJBRSCGFFGKIKaeccgoqqIDQkFUAACAAgAAAAABP8hzRER3RER3RER3RER3R8RzPESVREiVREi3TMjXTU0VVdWXXlnVZt31b2IVd933d933d+HVhWJZlWZZlWZZlWZZlWZZlWZYgNGQVAAACAAAghBBCSCGFFFJIKcYYc8w56CSUEAgNWQUAAAIACAAAAHAUR3EcyZEcSbIkS9IkzdIsT/M0TxM9URRF0zRV0RVdUTdtUTZl0zVdUzZdVVZtV5ZtW7Z125dl2/d93/d93/d93/d93/d9XQdCQ1YBABIAADqSIymSIimS4ziOJElAaMgqAEAGAEAAAIriKI7jOJIkSZIlaZJneZaomZrpmZ4qqkBoyCoAABAAQAAAAAAAAIqmeIqpeIqoeI7oiJJomZaoqZoryqbsuq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq4LhIasAgAkAAB0JEdyJEdSJEVSJEdygNCQVQCADACAAAAcwzEkRXIsy9I0T/M0TxM90RM901NFV3SB0JBVAAAgAIAAAAAAAAAMybAUy9EcTRIl1VItVVMt1VJF1VNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVN0zRNEwgNWQkAAAEAwByEzi2okEkJLZiKKMQk6FJBBynozjCCoPcSOYOcxxQ5QpDGlkmEmAZCQ1YEAFEAAIAxyDHEHHLOUeokRc45Kh2lxjlHqaPUUUqxphgzSiW2VGvjnKPUUeoopRpLix2lFGOKsQAAgAAHAIAAC6HQkBUBQBQAAIEQUgophZRizinnkFLKMeYcUoo5p5xTzjkonZTKOSadkxIppZxjzinnnJTOSeWck9JJKAAAIMABACDAQig0ZEUAECcA4HAczZM0TRQlTRNFTxRd1RNF1ZU0zTQ1UVRVTRRN1VRVWRZN1ZUlTTNNTRRVUxNFVRVVU5ZNVZVlzzRt2VRV3RZVVbdlW/ZtV5Z13zNN2RZV1dZNVbV1V5Z13ZVt3Zc0zTQ1UVRVTRRV11RVWzZV1bY1UXRdUVVlWVRVWXZl17ZVV9Z1TRRd11NN2RVVVZZV2dVlVZZ1X3RVXVdd19dVV/Z92dZ9XdZ1YRhV1dZN19V1VXZ1X9Zt35d1XVgmTTNNTRRdVRNFVTVV1bZNVZVtTRRdV1RVWRZN1ZVV2fV11XVtXRNF1xVVVZZFVZVdVXZ135Vl3RZVVbdV2fV1U3V1XbZtY5htWxdOVbV1VXZ1YZVd3Zd12xhuXfeNzTRt23RdXTddV9dtXTeGWdd9X1RVX1dl2TdWWfZ93fexdd8YRlXVdVN2hV91ZV+4dV9Zbl3nvLaNbPvKMeu+M/xGdF84ltW2Ka9uC8Os6/jC7iy78Cs907R101V13VRdX5dtWxluXUdUVV9XZVn4TVf2hVvXjePWfWcZXZeuyrIvrLKsDLfvG8Pu+8Ky2rZxzLaOa+vKsftKZfeVZXht21dmXSfMum0cu68zfmFIAADAgAMAQIAJZaDQkBUBQJwAAIOQc4gpCJFiEEIIKYUQUooYg5A5JyVjTkopJbVQSmoRYxAqx6RkzkkJpbQUSmkplNJaKSW2UEqLrbVaU2uxhlJaC6W0WEppMbVWY2utxogxCZlzUjLnpJRSWiultJY5R6VzkFIHIaWSUoslpRgr56Rk0FHpIKRUUomppBRjKCXGklKMJaUaW4ottxhzDqW0WFKJsaQUY4spxxZjzhFjUDLnpGTOSSmltFZKaq1yTkoHIaXMQUklpRhLSSlmzknqIKTUQUeppBRjSSm2UEpsJaUaS0kxthhzbim2GkppsaQUa0kpxhZjzi223DoIrYVUYgylxNhizLm1VmsoJcaSUqwlpdpirLW3GHMNpcRYUqmxpBRrq7HXGGPNKbZcU4s1txh7ri23XnMOPrVWc4op1xZj7jG3IGvOvXcQWgulxBhKibHFVmuLMedQSowlpRpLSbG2GHNtrdYeSomxpBRrSanGGGPOscZeU2u1thh7Ti3WXHPuvcYcg2qt5hZj7im2nGuuvdfcgiwAAGDAAQAgwIQyUGjISgAgCgAAMIYx5yA0CjnnnJQGKeeck5I5ByGElDLnIISQUucchJJa65yDUEprpZSUWouxlJJSazEWAABQ4AAAEGCDpsTiAIWGrAQAUgEADI5jWZ5nmqpqy44leZ4oqqar6rYjWZ4niqqqqrZteZ4pqqqquq6uW54niqqquq6r655pqqqquq4s675nmqqqqq4ry75vqqrruq4sy7Lwm6rquq4ry7LtC6vryrIs27ZuG8PqurIsy7Zt68px67qu+76xHEe2rvu6MPzGcCQAADzBAQCowIbVEU6KxgILDVkJAGQAABDGIGQQUsgghBRSSCmElFICAAAGHAAAAkwoA4WGrAQAogAAACKstdZaY6211lqLrLXWWmutpZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSAQBSEw4AUg82aEosDlBoyEoAIBUAADCGKaYcgww6w5Rz0EkoJaWGMeecg5JSSpVzUkpJqbXWMueklJJSazFmEFJpLcYaa80glJRajDH2GkppLcZac889lNJai7XW3HNpLcYce89BCJNSq7XmHIQOqrVaa845+CBMa7HWGnQQQhgAgNPgAAB6YMPqCCdFY4GFhqwEAFIBAAiElGLMMeecQ0ox5pxzzjmHlGLMMeecc04xxpxzzkEIoWLMMecghBBC5pxzzkEIIYTMOeecgxBCCJ1zDkIIIYQQOucghBBCCCF0DkIIIYQQQugghBBCCCGE0EEIIYQQQgihgxBCCCGEEEIBAIAFDgAAATasjnBSNBZYaMhKAAAIAACC2nIsMTNIOeYsNgQhBblVSCnFtGZGGeW4VQohpDRkTjFkpMRac6kcAAAAggAAASEBAAYICmYAgMEBwucg6AQIjjYAAEGIzBCJhoXg8KASICKmAoDEBIVcAKiwuEi7uIAuA1zQxV0HQghCEIJYHEABCTg44YYn3vCEG5ygU1TqIAAAAAAADADgAQDguAAiIprDyNDY4Ojw+AAJCQAAAAAAGAD4AAA4RICIiOYwMjQ2ODo8PkBCAgAAAAAAAAAAgICAAAAAAABAAAAAgIBPZ2dTAARVLgAAAAAAAGN/AAACAAAAGC2JEBokIBsYFxoaTkJFFhYYGh0bHiBvVVBeY1AvAazSs+OtJO2Gp/uX64BAadTDVfyobstqO3JtJ6f7XSyXNeW8B6zQW6Uqxi3ELlvvDDCQiPYe+ssvL+fpSx6PMPUMWGIDvNhV21SQp3AQjWQxzwAAAbi2MFIVO4zZNI0F5OA7tStIXKhopKcVCQAIAOgxJC1WrIEH9OR7pStI/JCe/jUaAACA+ZYQve7H1QLs5FftUWzHv63K/mpwFQAAAADm58/CvyYAAPTii/xRjIV3qVu5l4LPAgAAAMByzAf+ZQMAmkm2vzbL52p6NYwYvv5h7X8wvGc755xzTgBV7JYAYHSrAAAAAAAAAAAFiPsfDXqF41OAGGOMMcaREQAAAAAY1zc/9rGa/VEKO+cMVPETXike/vPru39ZY1TLP6+klST2T4aAGACO6/kTAHi6LADwZaupAAAAAAAAAAACKgB1hBiDAAAAsebiAABA9WsAAAAAdqjd+N+bf8+f7N880j//+BpEDKnhEYgBgMhtAIDtVgUAAAAAAAAAEMK6rCFIwPe08SsBQghBgIUDAAAAOLsb2D0SXz0A1Ny/3y/JxKpWAAAAACgBAMWXfx3TBdTcv91XbKJvRaIDAAAAAFq/dG4TAADU3L/9qySptco5VgcAAABASI+qyS0BACTE2L/3W0lmVm9EAwAEeMPfQmPWFwCvY189AMTYP+A9JYkdcq4iNQCgMFpfm2HeKQB2nZKqiPDY3N6L7FWSWMHmH5IsAIAAMDmnXTKzvmChCSoAHOFn8xXPkKR+nM32J7AXAAACwOSQuX98pNcKgKUALOG7fRWLoTqNEgAAAADwrAQ4Ba/rmnAnGxs98NADkAD6CfZfZ+uXXTPUU15JNUnDkxMA4JwDxhjgcVyVAADs8y8+knwCAJ0AAAAAAIA6ADivg+m6rusS2Y8hHo/v+44IRWvHPZ8DMcaoUQGAnLbQQmgAAEA1X9MIAAAAp2lvN13++PjBwbmO+pvRcgq+TQAe6j2/R+UGsv2D/e0pr6SqHWV2/vsFAKhzAIAHAHw5GQAAAAAAAAC0nyy3L8mvIt0BQKsXAAAAoNYYAAAAgJPtHvThQ8bt4sfOC2AFALBz6MadM9sRnrr988srC8z676PLLf/4YsPwov3VCWgAG8CKM5YHAHxWAgAAAAAAAMBiF2H5hi+mR0oBwOPynWdbRnMFAAAqcwYBAADgxx4fdPbf3s/rGjT+ef2/vmeVBUJ9RY+yvZIq5bHrW3b+ICJst9SSDcCJM7BNAAAAQEQEEKCniu37fkOOL449AQBK/zQQWUsAAAD4039nRUg2atyXzAUAwEYdPDQA0OGRAJioBwAFEiAAPlr9f86+oxrB6in6/L/9wWcaftn/zTOItC1DBEA6J9gOAAAgIiJA1MS0KPb4VlEJ6Q8ANJJeksIcAAAA8FumWiGOcqSHPdmbYnAAoPNfoGMCQMEE4NGBBQCzEgAJYIIO8IAJHjn9f44+SuhqQ9wY/jjqTGzkdgZCF0BARAQI4UjXPvbMy/LCP+14pKnJ8wjAfx+nCgDgM07ixwwAwB8+AACgAwSggEUCICBhRwENAAsToACeJ/2fMy2ausEGWvVIAAABChAgIoAA7DGjVhMHAODOcwI8kAAFCQQACzrgAQKABg4=");
				var SND_quiet = new Audio("data:video/ogg;base64,T2dnUwACAAAAAAAAAAAzeQAAAAAAAGMW9OABHgF2b3JiaXMAAAAAAkSsAAAAAAAAAHcBAAAAAAC4AU9nZ1MAAAAAAAAAAAAAM3kAAAEAAACApmwcEC3//////////////////+IDdm9yYmlzHQAAAFhpcGguT3JnIGxpYlZvcmJpcyBJIDIwMDcwNjIyAAAAAAEFdm9yYmlzJUJDVgEAQAAAJHMYKkalcxaEEBpCUBnjHELOa+wZQkwRghwyTFvLJXOQIaSgQohbKIHQkFUAAEAAAIdBeBSEikEIIYQlPViSgyc9CCGEiDl4FIRpQQghhBBCCCGEEEIIIYRFOWiSgydBCB2E4zA4DIPlOPgchEU5WBCDJ0HoIIQPQriag6w5CCGEJDVIUIMGOegchMIsKIqCxDC4FoQENSiMguQwyNSDC0KImoNJNfgahGdBeBaEaUEIIYQkQUiQgwZByBiERkFYkoMGObgUhMtBqBqEKjkIH4QgNGQVAJAAAKCiKIqiKAoQGrIKAMgAABBAURTHcRzJkRzJsRwLCA1ZBQAAAQAIAACgSIqkSI7kSJIkWZIlWZIlWZLmiaosy7Isy7IsyzIQGrIKAEgAAFBRDEVxFAcIDVkFAGQAAAigOIqlWIqlaIrniI4IhIasAgCAAAAEAAAQNENTPEeURM9UVde2bdu2bdu2bdu2bdu2bVuWZRkIDVkFAEAAABDSaWapBogwAxkGQkNWAQAIAACAEYowxIDQkFUAAEAAAIAYSg6iCa0535zjoFkOmkqxOR2cSLV5kpuKuTnnnHPOyeacMc4555yinFkMmgmtOeecxKBZCpoJrTnnnCexedCaKq0555xxzulgnBHGOeecJq15kJqNtTnnnAWtaY6aS7E555xIuXlSm0u1Oeecc84555xzzjnnnOrF6RycE84555yovbmWm9DFOeecT8bp3pwQzjnnnHPOOeecc84555wgNGQVAAAEAEAQho1h3CkI0udoIEYRYhoy6UH36DAJGoOcQurR6GiklDoIJZVxUkonCA1ZBQAAAgBACCGFFFJIIYUUUkghhRRiiCGGGHLKKaeggkoqqaiijDLLLLPMMssss8w67KyzDjsMMcQQQyutxFJTbTXWWGvuOeeag7RWWmuttVJKKaWUUgpCQ1YBACAAAARCBhlkkFFIIYUUYogpp5xyCiqogNCQVQAAIACAAAAAAE/yHNERHdERHdERHdERHdHxHM8RJVESJVESLdMyNdNTRVV1ZdeWdVm3fVvYhV33fd33fd34dWFYlmVZlmVZlmVZlmVZlmVZliA0ZBUAAAIAACCEEEJIIYUUUkgpxhhzzDnoJJQQCA1ZBQAAAgAIAAAAcBRHcRzJkRxJsiRL0iTN0ixP8zRPEz1RFEXTNFXRFV1RN21RNmXTNV1TNl1VVm1Xlm1btnXbl2Xb933f933f933f933f931dB0JDVgEAEgAAOpIjKZIiKZLjOI4kSUBoyCoAQAYAQAAAiuIojuM4kiRJkiVpkmd5lqiZmumZniqqQGjIKgAAEABAAAAAAAAAiqZ4iql4iqh4juiIkmiZlqipmivKpuy6ruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6rguEhqwCACQAAHQkR3IkR1IkRVIkR3KA0JBVAIAMAIAAABzDMSRFcizL0jRP8zRPEz3REz3TU0VXdIHQkFUAACAAgAAAAAAAAAzJsBTL0RxNEiXVUi1VUy3VUkXVU1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU3TNE0TCA1ZCQCQAQCgEFtLrcXcCWocYtJyzCR0TmIQqrEIIke1t8oxpRzFnhqIlFESe6ooY4pJzDG00CknrdZSOoUUpJhTChVSDlogNGSFABCaAeBwHECyLECyNAAAAAAAAACQNA3QPA+wPA8AAAAAAAAAJE0DLE8DNM8DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEDSNEDzPEDzPAAAAAAAAADQPA/wRBHwRBEAAAAAAAAALM8DPNEDPFEEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMDRNEDzPEDzPAAAAAAAAACwPA/wRBHwPBEAAAAAAAAANM8DPFEEPFEEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAQ4AAAEGAhFBqyIgCIEwAwOA40DZoGzwM4lgXPg+dBFAGOZcHz4HkQRQAAAAAAAAAAAAA0z4OqQlXhqgDN82CqUFWoLgAAAAAAAAAAAACW50FVoapwXYDleTBVmCpUFQAAAAAAAAAAAABPFKG6UF24KsAzRbgqXBWqCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAYcAAACDChDBQasiIAiBMAcDiKZQEAgOM4lgUAAI7jWBYAAFiWJYoAAGBZmigCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAABhwAAAIMKEMFBqyEgCIAgAwKIplAcuyLGBZlgU0zbIAlgbQPIDnAUQRAAgAAChwAAAIsEFTYnGAQkNWAgBRAAAGRbEsTRNFmqZpmiaKNE3TNE0UeZ6meZ5pQtM8zzQhip5nmhBFzzNNmKYoqioQRVUVAABQ4AAAEGCDpsTiAIWGrAQAQgIADI5iWZ4niqIoiqapqjRN0zxPFEXRNFXVVWmapnmeKIqiaaqq6vI8TRNF0xRF01RV14WmiaJpmqJpqqrrwvNE0TRNU1VV1XXheaJomqapqq7ruhBFUTRN01RV13VdIIqmaZqq6rqyDETRNFVVVV1XloEomqaqqqrryjIwTdNUVdeVXVkGmKaquq4syzJAVV3XdWVZtgGq6rquK8uyDXBd15VlWbZtAK4ry7Js2wIAAA4cAAACjKCTjCqLsNGECw9AoSErAoAoAADAGKYUU8owJiGkEBrGJIQSQiYllZRKqiCkUlIpFYRUUiolo5JSailVEFIpKZUKQiqllVQAANiBAwDYgYVQaMhKACAPAIAgRinGGGMMMqYUY845B5VSijHnnJOMMcaYc85JKRljzDnnpJSMOeecc1JK5pxzzjkppXPOOeeclFJK55xzTkopJYTOOSellNI555wTAABU4AAAEGCjyOYEI0GFhqwEAFIBAAyOY1mapmmeJ4qWJGma53meKJqmZkma5nmeJ4qmyfM8TxRF0TRVled5niiKommqKtcVRdM0TVVVVbIsiqZpmqrqujBN01RV13VlmKZpqqrrui5s21RV1XVlGbatmqoqu7IMXFd1Zde2geu6ruzatgAA8AQHAKACG1ZHOCkaCyw0ZCUAkAEAQBiDjEIIIYUQQgohhJRSCAkAABhwAAAIMKEMFBqyEgBIBQAAkLHWWmuttdZARymllFJKqXCMUkoppZRSSimllFJKKaWUSkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKBQAuVTgA6D7YsDrCSdFYYKEhKwGAVAAAwBilmHJOQikVQow5JiGlFiuEGHNOSkoxFs85B6GU1losnnMOQimtxVhU6pyUlFqKragUMikppdZiEMKUlFprpbUghCqpxJZaa0EIXVNqKZbYghC2tpJSjDEG4YOPsZVYagw++CBbKzHVWgAAZoMDAESCDasjnBSNBRYashIACAkAIIxRijHGGHPOOeckY4wx5pxzEEIIoWSMMeeccw5CCCGUzjnnnHMQQgghhFJKx5xzDkIIIYRQUuqccxBCCKGEEEoqnXMOQgghhFJKSaVzEEIIoYRQQkklpdQ5CCGEEEIpKaWUQgghhBJCKCWllFIIIYQQQiihpJRSCiGEUkIIpZSUUkophRBKCKWUklJJKaUSSgkhhFJSSSmlFEIIJZRSSioppZRKCaGEUkoppaSUUkohlFBCKQUAABw4AAAEGEEnGVUWYaMJFx6AQkNWAgBkAACUslJKKK1VQCKlGKTaQkeZgxRziSxzDFrNpWIOKQathsoxpRi0FjIImVJMSgkldUwpJy3FmErnnKSYc42lcxAAAABBAICAkAAAAwQFMwDA4ADhcxB0AgRHGwCAIERmiETDQnB4UAkQEVMBQGKCQi4AVFhcpF1cQJcBLujirgMhBCEIQSwOoIAEHJxwwxNveMINTtApKnUgAAAAAAAMAPAAAJBcABER0cxhZGhscHR4fICEiIyQCAAAAAAAGAB8AAAkJUBERDRzGBkaGxwdHh8gISIjJAEAgAACAAAAACCAAAQEBAAAAAAAAgAAAAQET2dnUwAEAUMAAAAAAAAzeQAAAgAAABVnPF8USVHy2Ojs1tCwtJKQdWFOQT09NQG0UjXwh1/YKpVEf7mwczq3ymxXQHFy5YdDWH0f38bPp0UQD2C+y2rmZzOD+PLzkM8dHJhrZsoPq9M3R50+azq//fXfnB+0PyUHrFL1+FkdfrGF9lM+fHn+gObcK9mu/tsmV33FjgCIDzCcyx40JcdkVdQ5+6uT62+4/iW/+/GLmz+PXdBZF8uYf3hY3EneGWsmWho+IkC8v4YBWif9fQ7o6zzC4+tIzT8X+eqkf8/h+ir+4PJ1o9afV/C8ZXo5nuJtz/7T8apVGoQgAiDAWOB/IQUAdOtdv4yeWtr7j588XQAAAADsgAoAAAAAfyD5yJX3oP95e3L2ko5t19tFpj3MZ1W//DFfQZ7qL9YVHnKyj80CAAZg5kiZfwss/X0RWeyvzynI+zl4zB8fncD9zfuC6JMPwHzwdAbynTMBeUEumuq2X15g/e5gH38J3T6F+HwBN+ALrHadkLB+KPK949nV3serT8/H++qhKQRAo/26v75qxfvCv6sM/Ghg6r+dnybPGKX/UBWA/4kIAKBeJ/0+s6pNns3lm2wxwleYyPKkf7fDtBw/uH1PoRnhX4rwDqf4fvFCSIchwAgJFgDAWADDM29evz9b4PP//38mY2sBAKABAAAAQNmWu617ueuef4TOr98Nz07XCif1vfjkbt6RhhcND7096V/uOSu3e3e74c9MCi7m6yCPwNXwRUPoYLcAEcH2vAbw5fbXAMe7wfVnAdpPgH6BNy/wXoA5S4AF4BXgRJcTR6MRNADYMwjcxWBj+Gplzy8ePTx9qk0BIDSaRGT9j6fpt6EAVCBt07+Nmy8pAADeJv048krwg+e3IrX7eRPem/RnH1KKPrh9K1G7nzcQe1ERFaVKEpADoCUFADwAl3Ws+haBb9cfPT0AAAAAxgoAAAAAAB8vi7r3yrW3ifO9rXvRBhBmSLj3kzXdM7Zqm5NF5Ep73O3H9/tFawE3vDTHAACAiC/9sg3mP7/n4Pxw/Qssdp//YTMPg0E3oBbDOej/BWS/F4AP5DtRAZpzDuzeK9Qd4PnZgfkC9HA4hwRpod1wFw9sJIvjjzweChd/Gf/5uU+9u3q1p78Pm7Yg0KIwrz28e4OLKHfLm4umgknRDwUBAAhNol8B3ib9teai/4PLV5naft6S/Cb92vM6iz94v4YRvpIFp53OjhWWRhJEAGCRAQAegM8+jdB7sZ+lde3fu/J0AgAAACABABCE4ZE8LzOmudLDfTTzr90BgJEkmY3XvC9uzT9fX37WMG3j/srD/XK/zwbsPj9+L4KLL9/A3KN56MaPH40gX1eg380FZHuZL0Fe7s6Bt1soF+gZfK97AQU+BfSbwmyL4FtOnTwAxNzIu9M3yXb43uEz7haHZ9dO288v8ezffxkrsaKbwLl0umqDr+DRCdp+F+ctBw+lzbMLAAFpuh5n/mvbKACg4YADyAA+J/19DGqFfHC7nhjhLRs7J/2z59SDn8nlmTDCV4ScLSWzlLwgQQ6AUjk+q29UpACAC9zTgNbvqfWzf5/98eF7iz8/XfZ7AACgAAAABmEnqRZpo3RnOL9z/lB/R9a5vd/51vp29yj82Z85AGYgzDRl/1PdklK240jRjx03kbFEBvx5vYu7FvfTE3Kdr1sw/3mC793nfGFDOgIF9DjPgA878MUO+OQBroOA6wrk0+YVfgNspWgIEkpAQMhKYjlePn5/7JOkkqa8DRy0hTbpe6JOADIgAAEAPif9ew7qgke43IOa/ryxe9L/rkO64A8uVymsmn/O0hyr5BQh2OwAYDzi6lSkAwCMwPFbz1zNVC7b/3/77TdXMAAAYAEADIMwxAMnxb8z2dmo/dTZ1v1/xO6WZ+6Nzvm6mdyhe2eSYXbX+d07xjbzd/vnrq6iSREOf14UOowfkKnA3Q38PX5C/CXA9QG2vYU50y+4/s0XsM25saN80wbcE3CtCp1IsIEGzOYRjdFpEQc+cax+jijRACDQWL7bpZoWAABtRHz/QxIEAGCgARxAA14n/e8c1B04wsUmtf7M2lkn/fcc1Acc4WKH2n7OKts5jwIh2KQAIGEBAJQ2C/dDZwQAAHAAAMMgwGcnHT/mNvcfS+63umnucsb9rotdmQm6WQpac5BuBfflKdhTMO3fANf/wFwNuHpAcwSYWxSxKAMTeDYg44AGaM787D+S49XYc/PXjZVf/lnyRtrQLp8GtABA5e4vsaoR7euoXnz5+ReXDTTy+3eGVADAZQgoAIgAXif978x++S/w+6b27yxtTvrvmdv4H1xgUrufs3zaOj6wyygJwSaCAUAqPL/AAgCYnuqOx8pXP1s3AAAADQAGQaT7q8fFkdaGaQd7p1WrvDPrm5itHwUy2kP75o0nkreoqqiAAlm/K0j//gHZAQlY2hl09oEtmRUuz+8fbIt5AnuEygCYKUAJQgOI2r7ZNn9+7ibWAABF1VvDl/5Le1trmnv9iygAaNLcRV8IAHAgADSgYQAyXif97+Q+PAW8NrXeLHZO+u9pPbwT+NjU7oc1DWwSoTAASGAAwG3eWwIAADAABEEQ1N/M0Pt3HdozE8KwzZkxOD3+69vdf9k2gE+BKtA74FKRrjVumfxBZsD0FMrwaQ6AxoEBAKcS+Xn6s/WfPF404vUjXBtL78VsBOB2fv3LNG2kpPt6ALS3jEtTAKABDkAzgAE+J/33gG/2BB6bWhdbnHTzHd/ZA7gGNdWythyu5OGI2AQFAgAggQFAs/l2cAEYADgAHAaBZeDw6fu0Ix6uYHn5+PJla2rUdUwAsF/3DeRX0sspUEL9AD6AEt+yxaYpAm3Cdh/R2ry63FNnXDV54TZEmwKAZOy4/P6ukjSSfqkABwCgbc5/KYAMHLgDEAIYAMg+J/33kB9mAG4Qz0n/PcSH48CyyXTh6QwRAAAAIGAAIKsDhEEMAEEYBHF3xui7f+7Lc7NfR5tlKgMIoLB9gGjg8osx14+3LOv356vfpkNCAADC8f7+Ng0aDYju4u3v0Gt7RDUQGhgAOLi95UxaAIAMNAwAjgNeJ/3vjF+mAW6gTvrfGb9MA9yAHgwCAACQQBAEdYThAAjCIIymyxe+9Et/+NnjORo4MlBhAgEctjxnX5b/P9N/nyf9qwgAIAGYRV00xn77WNICUDCAAwQAWhkABHAHKAAcHifdfC9vugIOMCf990hvugFugAUAAAAAADAYBEEZhGEQAEEYhtGfYV5wR3FRevy9H02bhoIB0ADs4kCXd5elAGigQTEADoUGAI0MwAEBHifdfC93ugIOECfdfC93ugIOwAIAAAAAACAIwzAcBmEABEEQhO3fS2wAHeCAwwk4gKZAbpADqDugAUDOADQOABz+Jv27l4eugAPESTffy52ugAPAAAAAAACAIAiDgzAMgCAIgtBscOAgACgAudEAMpARFBoHKBAAQBDAAOAAXif9b1vedAUcYE7671HedAUcAAAAAAAAAARBGDwMgzAIgjBwOAADGAxABgcIABUM0AAawAE4OEABB6AYAF4n/e8sX7oCDlAn/e8sX7oAbgAAAAAAAAAEQRiEYRAAAAAEQRAMQAgABIDWAAg0AHAKACIADg==");
				// Volume - valid range 0.0 to 1.0
				SND_loud.volume = 0.4;
				SND_twoTone.volume = 0.5;
				SND_quiet.volume = 1.0;
				
				var debug = false;
				var msg_alliance = 0;
				var msg_whisper = 0;
				var msg_officer = 0;
				function setFavIcon(o) {
					try {
						var canvas = document.createElement('canvas');
						var ctx = canvas.getContext('2d');
						var canvasCopy = document.createElement('canvas');
						var ctxCopy = canvasCopy.getContext("2d");
						var children = document.head.childNodes;
						var iconDom;
						var img = document.createElement('img');
						
						//get favicon by rel
						if (!document.getElementById("Favicon")) {
							for (i in children) {
								if (children[i].rel) {
									children[i].id = "Favicon";
									iconDom = children[i];
									//children[i].parentNode.removeChild(children[i]);
									break;
								}
							}
						} else {
							iconDom = document.getElementById("Favicon");
						}
						//on
						if (o === 1) {
							if (debug)
								console.log("o === 1");
							img.src = 'favicon.ico';
							img.onload = function () {
								if (canvas.getContext) {
									canvas.height = canvas.width = 16; // set the size
									//Chrome fix for 64px favicon
									if (img.width > 16) {
										canvasCopy.width = img.width;
										canvasCopy.height = img.height;
										ctxCopy.drawImage(img, 0, 0);
										ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height);
									} else if (img.width == 16) {
										ctx.drawImage(img, 0, 0);
									}
									ctx.shadowOffsetX = 1;
									ctx.shadowOffsetY = 1;
									ctx.shadowBlur = 1;
									ctx.shadowColor = "#000000";
									ctx.font = 'bold 18px "helvetica", sans-serif';
									if (msg_alliance > 0 || debug) {
										ctx.fillStyle = '#a5f25b'; //alliance
										ctx.fillText("!", 1, 15);
									}
									if (msg_whisper > 0 || debug) {
										ctx.fillStyle = '#ff95b3'; //outgoing whisper
										//ctx.fillStyle = '#c59eff'; //incoming whisper
										ctx.fillText("!", 5, 15);
									}
									if (msg_officer > 0 || debug) {
										ctx.fillStyle = '#fdf05f'; //officer
										ctx.fillText("!", 9, 15);
									}
									iconDom.href = canvas.toDataURL('image/x-icon');
									document.head.appendChild(iconDom);
								}
							};
						}
						//off
						if (!o) {
							if (debug)
								console.log("o is false or 0");
							//var el = document.getElementById("Favicon");
							iconDom.href = 'favicon.ico';
							document.head.appendChild(iconDom);
						}
					} catch (err) {
						console.log("CNCTAtitleMod: Problem swapping favicon " + err);
					}
				}
				
				function init() {
					try {
						var mainData = ClientLib.Data.MainData.GetInstance();
						var player_cities = mainData.get_Cities();
						if (player_cities.get_CurrentOwnCity() != null) {
							if (debug)
								setFavIcon(1);
							var current_city = player_cities.get_CurrentOwnCity();
							var playerName = current_city.get_PlayerName();
							var PNRegex = new RegExp(">" + playerName + "<", "i");
							var inBackground = false;
							var title0 = window.document.title = playerName + " - C&C: Tiberium Alliances";
							console.log("Changing Window title from: " + window.document.title);
							window.document.title = playerName + " - C&C: Tiberium Alliances";
							if (typeof webfrontend.gui.chat.ChatWidget.prototype.titleMod_showMessage === 'undefined') {
								webfrontend.gui.chat.ChatWidget.prototype.titleMod_showMessage = webfrontend.gui.chat.ChatWidget.prototype.showMessage;
								webfrontend.gui.chat.ChatWidget.prototype.showMessage = function (message, sender, channel) {
									//console.log("\nmessage: "+message+"\nchannel: "+channel);
									// 1 system white
									// 3 alliance
									if (channel == 3 && inBackground) {
										if (playNotificationSounds){
											SND_quiet.play();
											//SND_twoTone.play();
											//SND_loud.play();
										}
										msg_alliance++;
										setFavIcon(1);
									}
									// 5 officer
									if (channel == 5 && inBackground) {
										if (playNotificationSounds){
											//SND_quiet.play();
											SND_twoTone.play();
											//SND_loud.play();
										}
										msg_officer++;
										setFavIcon(1);
									}
									// 9 whisper
									if (channel == 9 && inBackground && !PNRegex.test(sender)) {
										if (playNotificationSounds){
											//SND_quiet.play();
											//SND_twoTone.play();
											SND_loud.play();
										}
										msg_whisper++;
										title1 = window.document.title = "(" + msg_whisper + ")" + playerName + " - C&C: Tiberium Alliances";
										setFavIcon(1);
									}
									// 15 AFK blue
									this.titleMod_showMessage(message, sender, channel);
								};
							}
							var CheckPageFocus = function () {
								if (document.hasFocus() && inBackground) {
									msg_alliance = 0;
									msg_whisper = 0;
									msg_officer = 0;
									inBackground = false;
									window.document.title = playerName + " - C&C: Tiberium Alliances";
									if (!debug)
										setFavIcon(0);
								} else if (document.hasFocus() == false) {
									inBackground = true;
								}
							}
							setInterval(CheckPageFocus, checkPageFocusDelay);
						} else {
							window.setTimeout(init, 1000);
						}
					} catch (e) {
						console.log("CNCTAtitleMod: problem loading player name:\n" + e);
					}
				}
				init();
				
			}
		} catch (e) {
			console.log("titleMod_init: ", e);
		}
		
		function CNCTAtitleMod_checkIfLoaded() {
			try {
				if (typeof qx != 'undefined') {
					titleMod_init();
				} else {
					window.setTimeout(CNCTAtitleMod_checkIfLoaded, 1000);
				}
			} catch (e) {
				console.log("CNCTAtitleMod_checkIfLoaded: ", e);
			}
		}
		window.setTimeout(CNCTAtitleMod_checkIfLoaded, 2000);
	};
	
	try {
		var CNCTAtitleMod = document.createElement("script");
		CNCTAtitleMod.innerHTML = "(" + titleMod_main.toString() + ")();";
		CNCTAtitleMod.type = "text/javascript";
		document.getElementsByTagName("head")[0].appendChild(CNCTAtitleMod);
	} catch (e) {
		console.log("CNCTAtitleMod: init error: ", e);
	}
})();

/***********************************************************************************
Tiberium Alliances Zoom (KOMMANDO)
***********************************************************************************/

(function (){
  var tazoom_main = function() {
    function initialize() {
      console.log("Zoom Loaded");
      
      var zoomMin = 2.0;	// Larger number means able to zoom in closer.
      var zoomMax = 0.1;	// Smaller number means able to zoom out further.
      var zoomInc = 0.08;	// Larger number for faster zooming, Smaller number for slower zooming.
      
      webfrontend.gui.BackgroundArea.prototype.onHotKeyPress = function(be) {
        if(!this.active || be.getTarget() != this.mapContainer)
          return;
        var bh = be.getKeyIdentifier();
        var bf = ClientLib.Vis.VisMain.GetInstance();
        switch(bh) {
          case "+":
            var bg = bf.get_Region().get_ZoomFactor() + zoomInc;
            bf.get_Region().set_ZoomFactor(Math.min(zoomMin, Math.max(zoomMax, bg)));
            break;
          case "-":
            var bg = bf.get_Region().get_ZoomFactor() - zoomInc;
            bf.get_Region().set_ZoomFactor(Math.min(zoomMin, Math.max(zoomMax, bg)));
            break;
        }
        this.closeCityInfo();
        this.closeCityList();
      }

      var backgroundArea = qx.core.Init.getApplication().getBackgroundArea();
      qx.bom.Element.removeListener(backgroundArea.mapContainer, "mousewheel", backgroundArea._onMouseWheel, backgroundArea);
      qx.bom.Element.removeListener(backgroundArea.mapBlocker, "mousewheel", backgroundArea._onMouseWheel, backgroundArea);
      webfrontend.gui.BackgroundArea.prototype._onMouseWheel = function(e) {
        if(this.activeSceneView == null)
          return;
        var bz = e.getWheelDelta();
        var by = this.activeSceneView.get_ZoomFactor();
        by += bz > 0 ? -zoomInc : zoomInc;
        by = Math.min(zoomMin, Math.max(zoomMax, by));
        this.activeSceneView.set_ZoomFactor(by);
        e.stop();
      }
      qx.bom.Element.addListener(backgroundArea.mapContainer, "mousewheel", backgroundArea._onMouseWheel, backgroundArea);
      qx.bom.Element.addListener(backgroundArea.mapBlocker, "mousewheel", backgroundArea._onMouseWheel, backgroundArea); 
    }
 
    function tazoom_checkIfLoaded() {
      try {
        if (typeof qx != 'undefined') {
          a = qx.core.Init.getApplication(); // application
          mb = qx.core.Init.getApplication().getMenuBar();
          if (a && mb) {
            initialize();
          } else
            window.setTimeout(tazoom_checkIfLoaded, 1000);
        } else {
          window.setTimeout(tazoom_checkIfLoaded, 1000);
        }
      } catch (e) {
        if (typeof console != 'undefined') console.log(e);
        else if (window.opera) opera.postError(e);
        else GM_log(e);
      }
    }
    
    if (/commandandconquer\.com/i.test(document.domain)) {
      window.setTimeout(tazoom_checkIfLoaded, 1000);
    }
  }

  // injecting, because there seem to be problems when creating game interface with unsafeWindow
  var tazoomScript = document.createElement("script");
  tazoomScript.innerHTML = "(" + tazoom_main.toString() + ")();";
  tazoomScript.type = "text/javascript";
  if (/commandandconquer\.com/i.test(document.domain)) {
    document.getElementsByTagName("head")[0].appendChild(tazoomScript);
  }
})();

	// ==UserScript==
	// @name          PluginsLib - mhNavigator - Tiberium Alliances
	// @namespace     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
	// @description   Creates compass poiting to the currently selected base (compass points from itself).
	// @version       1.35
	// @author        MrHIDEn (in game PEEU) based on Caine code. Extended
	// @include       http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
	// @grant         none
	// ==/UserScript==
	(function () {
	function injectBody()
	{
	  //TODO for debug purpose only. remove if you do not need.
	  var ccl=console.log;var cci=console.info;var ccw=console.warn;var ccd=console.dir; var ccc=console.clear;
	  var disable=0;if(disable){var f=function(){};ccl=f;cci=f;ccw=f;ccd=f;ccc=f;}

	  var pluginName = "mhNavigator";
	  var created = false;
	  function CreateClasses() {
		function classExist(name) {
		  if(name===null || name===undefined) return;
		  var sp = name.split('.');
		  var w = window;
		  for(var i=0;i<sp.length;i++) {
			w = w[sp[i]];
			if(w===undefined) {
			  return false;
			}
		  }
		  return true;
		}
		if(!classExist('qx.html.Canvas')) {
		  qx.Class.define("qx.html.Canvas",
		  {
			extend : qx.html.Element,
			construct : function(styles, attributes)
			{
			  this.base(arguments, "canvas", styles, attributes);
			  this.__canvas = document.createElement("canvas");
			},
			members :
			{
			  __canvas : null,
			  _createDomElement : function() {
				return this.__canvas;
			  },
			  getCanvas : function() {
				return this.__canvas;
			  },
			  setWidth : function(width) {
				this.__canvas.width = width;
			  },
			  getWidth : function() {
				return this.__canvas.width;
			  },
			  setHeight : function(height) {
				this.__canvas.height = height;
			  },
			  getHeight : function() {
				return this.__canvas.height;
			  },
			  getContext2d : function() {
				return this.__canvas.getContext("2d");
			  }
			},
			destruct : function() {
			  this.__canvas = null;
			}
		  });
		  cci('qx.html.Canvas ADDED');
		}
		if(!classExist('qx.ui.embed.Canvas')) {
		  qx.Class.define("qx.ui.embed.Canvas",
		  {
			extend : qx.ui.core.Widget,
			construct : function(canvasWidth, canvasHeight)
			{
			  this.base(arguments);
			  this.__deferredDraw = new qx.util.DeferredCall(this.__redraw, this);
			  this.addListener("resize", this._onResize, this);
			  if (canvasWidth !== undefined) {
				this.setCanvasWidth(canvasWidth);
			  }
			  if (canvasHeight !== undefined) {
				this.setCanvasHeight(canvasHeight);
			  }
			},
			events :
			{
			  "redraw" : "qx.event.type.Data"
			},
			properties :
			{
			  syncDimension :
			  {
				check : "Boolean",
				init : false
			  },
			  canvasWidth :
			  {
				check : "Integer",
				init : 300,
				apply : "_applyCanvasWidth"
			  },
			  canvasHeight :
			  {
				check : "Integer",
				init : 150,
				apply : "_applyCanvasHeight"
			  }
			},
			members :
			{
			  __deferredDraw : null,
			  _createContentElement : function() {
				return new qx.html.Canvas();
			  },
			  __redraw : function()
			  {
				var canvas = this.getContentElement();
				var height = canvas.getHeight();
				var width = canvas.getWidth();
				var context = canvas.getContext2d();
				this._draw(width, height, context);
				this.fireNonBubblingEvent(
				  "redraw",
				  qx.event.type.Data,
				  [{
					width: width,
					height: height,
					context: context
				  }]
				);
			  },
			  _applyCanvasWidth : function(value, old)
			  {
				this.getContentElement().setWidth(value);
				this.__deferredDraw.schedule();
			  },
			  _applyCanvasHeight : function(value, old)
			  {
				this.getContentElement().setHeight(value);
				this.__deferredDraw.schedule();
			  },
			  update : function() {
				this.__deferredDraw.schedule();
			  },
			  _onResize : function(e)
			  {
				var data = e.getData();

				if (this.getSyncDimension())
				{
				  this.setCanvasHeight(data.height);
				  this.setCanvasWidth(data.width);
				}
			  },
			  getContext2d : function() {
				return this.getContentElement().getContext2d();
			  },
			  _draw : function(width, height, context) {}
			},
			destruct : function() {
			  this._disposeObjects("__deferredDraw");
			}
		  });
		  cci('qx.ui.embed.Canvas ADDED');
		}
		// MAIN BODY
		qx.Class.define("PluginsLib." + pluginName,
		{
		  type: 'singleton',
		  extend: qx.core.Object,
		  statics : {
			NAME: 'Navigator',
			PLUGIN: 'mhNavigator',
			AUTHOR: 'MrHIDEn',
			VERSION: 1.35,
			REQUIRES: '',
			NEEDS: 'Menu',
			INFO: 'This script uses a compass.',
			ONPLUGIN: null,
			ONOPTIONS: null,
			SIZE: 0
		  },
		  construct: function() {
			try {
			  this.Self = this;
			  var backColor = '#eeeeff';          
			  //var STATIC = PluginsLib[this.basename];
			  var serv = ClientLib.Data.MainData.GetInstance().get_Server();
			  this.cenX = serv.get_ContinentWidth() / 2;
			  this.cenY = serv.get_ContinentHeight() / 2;
			  var pos = this.loadFromStorage('lock', {x:this.cenX, y:this.cenY});
			  this.lockX = pos.x;
			  this.lockY = pos.y;
			  this.posTimer = new qx.event.Timer();
			  this.posTimer.addListener("interval",this.onPosTimer,this);
			  //this.winName = "Navigator " + PluginsLib.mhNavigator.VERSION.toFixed(2);
			  this.winName = "Navigator " + this.constructor.VERSION.toFixed(2);
			  this.win = new qx.ui.window.Window(this.winName);
			  this.win.set({
				width:120,
				//showMinimize:false,
				showMaximize:false,
				showClose:false,
				padding: 1,
				//contentPadding: 6,
				allowClose:false,
				//allowMinimize:false,
				resizable:false,
				toolTipText: "MrHIDEn tool - Navigator."
			  });
			  this.win.addListener("minimize",function(e) {
				if(this.extMinimized) {
				  this.extMinimized = false;
				  for(var k in this.extItems) this.win.add(this.extItems[k]);
				}
				else {
				  this.extMinimized = true;
				  this.win.removeAll();
				}
				this.win.restore();//trick
			  },this);
			  this.win.addListener("move", function(e) {
				var pos = {left:e.getData().left, top:e.getData().top};
				this.saveToStorage('winpos', pos);
			  }, this);
			  pos = this.loadFromStorage('winpos', {left:130, top:5});
			  this.win.moveTo(pos.left, pos.top);
			  var winLayout = new qx.ui.layout.VBox();
			  winLayout.setAlignX("center");
			  this.win.setLayout(winLayout);

			  var winXYLayout = new qx.ui.layout.VBox();
			  this.winXY = new qx.ui.window.Window("Go to x:y");
			  this.winXY.set({
				width:170,
				height:50,
				showMinimize:false,
				showMaximize:false,
				showClose:true,
				//contentPadding: 6,
				padding: 1,
				resizable:false
				//layout:winXYLayout
			  });
			  this.winXY.setLayout(winXYLayout);
			  this.winXY.setToolTipText('Proper values:<br>333 444<br>333:444<br>333;444<br>333,444<br>333.444<br>[coords]333:444[/coords]');
			  var cntXY = new qx.ui.container.Composite(new qx.ui.layout.VBox());
			  //cntXY.setThemedBackgroundColor(backColor);
			  cntXY.setBackgroundColor(backColor);
			  var lblXY = new qx.ui.basic.Label('Write X:Y and press [Enter]');
			  this.txtXY = new qx.ui.form.TextField('');
			  this.txtXY.set(
			  {
				required    : true,
				placeholder : "Ex: 333:444"
			  });
			  this.txtXY.addListener("keydown", function(e) {
				if(e.getKeyIdentifier()=="Enter") {
				  var txt = this.txtXY.getValue();
				  if(txt.length>2) {
					  txt = txt.trim();
					  txt = txt.replace('[coords]','').replace('[/coords]','');
					  txt = txt.replace(' ',':');
					  txt = txt.replace(';',':');
					  txt = txt.replace(',',':');
					  txt = txt.replace('.',':');
					  var s = txt.split(':');
					  if(s.length==2) {
						var x = s[0];
						var y = s[1];
						if(!isNaN(parseInt(x)) && !isNaN(parseInt(y))) {
						  x = parseInt(x);
						  y = parseInt(y);
						  webfrontend.gui.UtilView.centerCoordinatesOnRegionViewWindow(x,y);
						  this.txtXY.setValue('');
						  this.winXY.close();
						}
					  }
					  return;
				  }
				  alert('Use:\nnumers and one of allowed separators \' :;,.\' \nor [coords]333:444[/coords]');
				}
			  }, this);
			  this.winXY.add(cntXY);
			  cntXY.add(lblXY);
			  cntXY.add(this.txtXY);


			  // Compass 1 //////////////////////////////////////////////////////////////
			  var canvas1 = new qx.ui.embed.Canvas();
			  canvas1.set({
				width: 50,
				height: 50,
				canvasWidth: 50,
				canvasHeight: 50,
				toolTipText: "Pointing selected base."
			  });
			  canvas1.addListener("click",function(e) {
				var cid  = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCityId();
				webfrontend.gui.UtilView.centerCityOnRegionViewWindow(cid);
				this.displayCompass();
			  },this);
			  canvas1.set({
				toolTipText: "Click - go to."
			  });
			  var hboxNav1 = new qx.ui.layout.HBox();
			  hboxNav1.setAlignX("center");
			  var cntNav1 = new qx.ui.container.Composite();
			  cntNav1.setLayout(hboxNav1);
			  //cntNav1.setThemedBackgroundColor(backColor);
			  cntNav1.setBackgroundColor(backColor);
			  cntNav1.add(canvas1);
			  this.ctx1 = canvas1.getContext2d();
			  // add
			  this.extItems.push(cntNav1);

			  // Info //////////////////////////////////////////////////////////////
			  var vboxInfo1 = new qx.ui.layout.VBox();
			  vboxInfo1.setAlignX("center");
			  var cntInfo1 = new qx.ui.container.Composite();
			  cntInfo1.setLayout(vboxInfo1);
			  //cntInfo1.setThemedBackgroundColor(backColor);
			  cntInfo1.setBackgroundColor(backColor);
			  cntInfo1.setThemedFont("bold");
			  this.disBase = new qx.ui.basic.Label('0');
			  this.disBase.set({
				toolTipText: "Distance from your current base to the center of view."
			  });
			  cntInfo1.add(new qx.ui.basic.Label("Current Base"));
			  cntInfo1.add(this.disBase);
			  // add
			  this.extItems.push(cntInfo1);

			  // Compass 2 //////////////////////////////////////////////////////////////
			  var canvas2 = new qx.ui.embed.Canvas();
			  canvas2.set({
				width: 50,
				height: 50,
				canvasWidth: 50,
				canvasHeight: 50,
				toolTipText: "Pointing locked base. Click this to lock center of the map."
			  });
			  canvas2.addListener("click",function(e) {
				webfrontend.gui.UtilView.centerCoordinatesOnRegionViewWindow(this.lockX,this.lockY);
			  },this);
			  canvas2.set({
				toolTipText: "Click - go to."
			  });
			  var hboxNav2 = new qx.ui.layout.HBox();
			  hboxNav2.setAlignX("center");
			  var cntNav2 = new qx.ui.container.Composite();
			  cntNav2.setLayout(hboxNav2);
			  //cntNav2.setThemedBackgroundColor(backColor);
			  cntNav2.setBackgroundColor(backColor);
			  cntNav2.add(canvas2);
			  this.ctx2 = canvas2.getContext2d();
			  // add
			  this.extItems.push(cntNav2);


			  var vboxInfo2 = new qx.ui.layout.VBox();
			  vboxInfo2.setAlignX("center");
			  var cntInfo2 = new qx.ui.container.Composite();
			  cntInfo2.setLayout(vboxInfo2);
			  //cntInfo2.setThemedBackgroundColor(backColor);
			  cntInfo2.setBackgroundColor(backColor);
			  cntInfo2.setThemedFont("bold");

			  this.coordLock = new qx.ui.basic.Label(this.lockX.toString()+':'+this.lockY.toString());//('X:Y');
			  //this.coordLock.setValue(this.lockX.toString()+':'+this.lockY.toString());
			  this.coordLock.set({
				toolTipText: "Click - set center of map."
			  });
			  this.coordLock.addListener("click",function(e) {
				var serv = ClientLib.Data.MainData.GetInstance().get_Server();
				this.lockX = serv.get_ContinentWidth() / 2;
				this.lockY = serv.get_ContinentHeight() / 2;
				this.coordLock.setValue(this.lockX.toString()+':'+this.lockY.toString());
				this.saveToStorage('lock', {x:this.lockX,y:this.lockY});
				this.displayCompass();
			  },this);
			  this.disLock = new qx.ui.basic.Label('0');
			  this.disLock.set({
				toolTipText: "Distance from locked object to the selected object."
			  });
			  var btnXY = new qx.ui.form.Button("X:Y");
			  btnXY.set({
				width:50,
				toolTipText: "Go to position."
			  });
			  btnXY.addListener("execute", function(e) {
				var lp = this.win.getLayoutProperties();
				this.winXY.moveTo(lp.left, lp.top+150);
				this.winXY.open();
				this.txtXY.focus();
			  }, this);
			  var btnLock = new qx.ui.form.Button("Lock");
			  btnLock.set({
				width:60,
				toolTipText: "Lock position of the selected object."
			  });
			  btnLock.addListener("execute", function(e) {
				this.lockX = this.selX;
				this.lockY = this.selY;
				this.coordLock.setValue(this.lockX.toString()+':'+this.lockY.toString());
				this.saveToStorage('lock', {x:this.lockX,y:this.lockY});
				this.displayCompass();
			  }, this);
			  cntInfo2.add(this.coordLock);
			  cntInfo2.add(this.disLock);
			  // add
			  this.extItems.push(cntInfo2);

			  var cntButtons = new qx.ui.container.Composite(new qx.ui.layout.HBox());
			  //cntButtons.setThemedBackgroundColor(backColor);
			  cntButtons.setBackgroundColor(backColor);
			  cntButtons.add(btnXY);
			  cntButtons.add(btnLock);
			  // add
			  this.extItems.push(cntButtons);

			  for(var k in this.extItems) this.win.add(this.extItems[k]);

			  this.win.open();

			  phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance().get_Region(), "PositionChange", ClientLib.Vis.PositionChange, this, this.onPositionChange);
			  phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "SelectionChange", ClientLib.Vis.SelectionChange, this, this.onSelectionChange);

			  //REGISTER PLUGIN
			  //this.constructor.ONPLUGIN = function(){this.constructor.getInstance().open();};
			  //this.constructor.ONOPTIONS = function(){this.constructor.getInstance().open();};//test
			  ////PluginsLib.Menu.getInstance().RegisterPlugin(this);
			  
			  //READY
			  console.info("Plugin '"+pluginName+"' LOADED");
			} catch (e) {
			  console.error(this.classname,".construct: ", e);
			}
		  },
		  members: {
			Self: null,
			winName: '',
			win: null,
			extItems: [],
			extMinimized: false,
			winXY: null,
			txtXY: null,
			posTimer: null,
			disBase: null,
			disObj: null,
			coordLock: null,
			disLock: null,
			ctx1: null,
			ctx2: null,
			background: null,
			size: 50,
			LObjectType: [],
			selX: -1,
			selY: -1,
			lockX: 0,
			lockY: 0,
			cenX: 0,
			cenY: 0,
			selected: null,
			visObject: null,
			loadFromStorage: function(key,preval) {
			  var S = ClientLib.Base.LocalStorage;
			  if (S.get_IsSupported()) {
				var val = S.GetItem(this.classname+'.'+key);
				if(val!==null) {
				  preval = val;
				}
			  }
			  return preval;
			},
			saveToStorage: function(key,val) {
			  if(val!==null) {
				var S = ClientLib.Base.LocalStorage;
				if (S.get_IsSupported()) S.SetItem(this.classname+'.'+key, val);
			  }
			},
			onPositionChange: function (e) {
			  //console.log('onPositionChange');
			  this.posTimer.restartWith(200);
			},
			onPosTimer: function (e) {
			  //console.log('onPosTimer');
			  this.posTimer.stop();
			  this.displayCompass();
			},
			onSelectionChange: function (l,c) {
			  //console.log('onSelectionChange.c:',c);
			  try {
				var visObject = ClientLib.Vis.VisMain.GetInstance().get_SelectedObject();
				if (visObject!==null) {
				  var t = visObject.get_VisObjectType();
				  switch (t) {
					/* NOTE
					RegionCityType
					RegionSuperWeaponType
					RegionTerrainType
					RegionMoveTarget
					RegionFreeSlotType
					RegionNPCBase
					RegionNPCCamp
					RegionPointOfInterest
					RegionRuin
					RegionGhostCity
					RegionNewPlayerSpot
					RegionHub  */
					case ClientLib.Vis.VisObject.EObjectType.RegionCityType:
					case ClientLib.Vis.VisObject.EObjectType.RegionNPCBase:
					case ClientLib.Vis.VisObject.EObjectType.RegionNPCCamp:
					case ClientLib.Vis.VisObject.EObjectType.RegionPointOfInterest:
					case ClientLib.Vis.VisObject.EObjectType.RegionRuin:
					case ClientLib.Vis.VisObject.EObjectType.RegionHubControl:
					case ClientLib.Vis.VisObject.EObjectType.RegionHubCenter:
					  //this.calcDistance();
					  //console.log('visObject:',visObject);
					  //console.log('Vis Object Type:',t,', ',this.LObjectType[t]);
					  this.visObject = visObject;
					  this.selX = visObject.get_RawX();
					  this.selY = visObject.get_RawY();
					  this.selected = true;
					  this.displayCompass();
					  break;
					default:
					  break;
				  }
				}
			  } catch (e) {
				console.error(this.classname,".onSelectionChange", e);
			  }
			},
			displayCompass: function () {
			  //console.log('displayCompass:');
			  try {
				if(this.ctx1===null) return;
				if(this.ctx2===null) return;
				var ctx1 = this.ctx1;
				var ctx2 = this.ctx2;
				var currentCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
				var cityCoordX = currentCity.get_PosX();
				var cityCoordY = currentCity.get_PosY();
				if(this.selX==-1 && this.selY==-1) {
				  this.selX = currentCity.get_PosX();
				  this.selY = currentCity.get_PosY();
				  //this.coordLock.setValue(this.lockX.toString()+':'+this.lockY.toString());
				}

				var region = ClientLib.Vis.VisMain.GetInstance().get_Region();
				var gridW = region.get_GridWidth();
				var gridH = region.get_GridHeight();
				var regionX = region.get_PosX();
				var regionY = region.get_PosY();
				var viewW = region.get_ViewWidth();
				var viewH = region.get_ViewHeight();
				var zoom = region.get_ZoomFactor();

				var viewCoordX = (regionX + viewW / 2 / zoom) / gridW - 0.5;
				var viewCoordY = (regionY + viewH / 2 / zoom) / gridH - 0.5;

				var dx = viewCoordX - cityCoordX;
				var dy = cityCoordY - viewCoordY;
				var distance = Math.sqrt(dx * dx + dy * dy);

				ctx1.clearRect(0, 0, 50, 50);
				ctx1.save();
				ctx1.translate(25, 25);
				ctx1.rotate(dy > 0 ? Math.asin(dx / distance) + Math.PI : -Math.asin(dx / distance));
				this.drawCompass(ctx1);
				ctx1.restore();

				var dx2 = this.selX - this.lockX;
				var dy2 = this.lockY - this.selY;
				var distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
				ctx2.clearRect(0, 0, 50, 50);
				ctx2.save();
				ctx2.translate(25, 25);
				ctx2.rotate(dy2 > 0 ? Math.asin(dx2 / distance2) + Math.PI : -Math.asin(dx2 / distance2));
				this.drawCompass(ctx2);
				ctx2.restore();

				this.disBase.setValue(distance.toFixed(1).toString());
				var ltext = ClientLib.Base.Util.CalculateDistance(this.lockX, this.lockY, this.selX, this.selY);
				this.disLock.setValue(ltext.toString());


			  } catch (e) {
				console.error(this.classname,".displayCompass", e);
			  }
			},
			drawCompass: function(c) {
			  //console.log('drawCompass:');
			  c.strokeStyle = 'black';
			  c.beginPath();
			  c.arc(0,0,20,0,Math.PI*2,true); // Outer circle
			  c.stroke();

			  c.strokeStyle = 'black';
			  c.beginPath();
			  c.moveTo(0, 0);
			  c.lineTo(0, -20);  // Line
			  c.closePath();
			  c.stroke();

			  c.beginPath();
			  c.strokeStyle = 'black';
			  c.fillStyle = 'white';
			  c.arc(0,0,4,0,Math.PI*2,true); // Inner dot
			  c.fill();
			  c.stroke();

			  c.beginPath();
			  c.strokeStyle = 'black';
			  c.fillStyle = 'aqua';
			  c.arc(0,-20,4,0,Math.PI*2,true); // Outer dot
			  c.fill();
			  c.stroke();
			}
		  }
		});
	  }//CreateClasses()
	  function WaitForGame() {
		try
		{
		  if (typeof(qx) != 'undefined' && typeof(qx.core) != 'undefined' && typeof(qx.core.Init) != 'undefined')
		  {
			var app = qx.core.Init.getApplication();
			if (app.initDone===true)
			{
			  if(!created) CreateClasses();
			  var plugin = PluginsLib[pluginName];
			  var ready = true;
			  if(plugin.REQUIRES.length > 0) {
				var req = plugin.REQUIRES.split(',');
				//check all requires
				for(var i in req) {
				  //cci(req[i]);
				  if(typeof(PluginsLib[req[i]])=='undefined') {
					console.log(pluginName,'.WaitForGame.REQUIRES ',req[i],typeof(PluginsLib[req[i]]));
					ready = false;
					break;//WAIT
				  }
				}
			  }
			  if(ready) {
				plugin.getInstance();
				plugin.SIZE = scriptSize;
				console.info("Plugin '"+plugin.getInstance().basename+"' READY");
				return;//DONE
			  }
			}
		  }
		} catch (e) {
		  console.error('PluginsLib.'+pluginName,'.WaitForGame: ', e);
		}
		window.setTimeout(WaitForGame, 2000);
	  }
	  window.setTimeout(WaitForGame, 2000);
	}
	function Inject() {
	  if (window.location.pathname != "/login/auth") {
		var script = document.createElement('script');
		var txt = injectBody.toString();
		txt = txt.replace('{','{\r\n  var scriptSize='+(txt.length+22).toString()+';');
		script.innerHTML = '(' + txt + ')();';
		script.type = 'text/javascript';
		document.head.appendChild(script);
	  }
	}
	Inject();
	})();

/***********************************************************************************
COORDS 500:500 ***** Version 1.2
***********************************************************************************/
// ==UserScript==
// @include        http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @description    Alt+A - popup window, Alt+S - insert [coords][/coords], 
// @description    Alt+X - magically insert [coords]x:y[/coords]. Earlier you must move  
// @description    your mouse cursor OVER the map "Coordinates"
// ==/UserScript==
function Ini() {
	m = "CnC: Tiberium Alliances COORDS has been loaded";
	if (typeof console != 'undefined') console.log(m);
	else if (window.opera) opera.postError(m);
	else GM_log(m);
};

(function () {
	var TACoordsMain = function () {
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
				var MrHIDE = {};
				qx.Class.define("MrHIDE.main", {
					type: "singleton",
					extend: qx.core.Object,
					members: {
						Coords: "First, just move mouse cursor over some map coordinates numbers ex. 0:0",
						initialize: function () {
							window.addEventListener("keyup", this.onKey, false);
							window.addEventListener("mouseover", this.onMouseOver, false);
						},
						GetCaretPosition: function (ctrl) {
							var CaretPos = 0; // IE Support
							if (document.selection) {
								ctrl.focus();
								var Sel = document.selection.createRange();
								Sel.moveStart('character', -ctrl.value.length);
								CaretPos = Sel.text.length;
							}
							// Firefox support
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
							var MRH = window.MrHIDE.main.getInstance();

							// ALT+
							if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey) {
								// log("Alt+" + s);

								switch (s) {
								case "Z":
									// coords by popup window
									var inputField = document.querySelector('input:focus, textarea:focus');
									if (inputField != null) {
										this.Coords = prompt("Place coordinates. Ex. 800:800", "");
										if (Coords != null) {
											var position = MRH.GetCaretPosition(inputField);
											var txt = inputField.value;
											var insert = "[coords]" + this.Coords + "[/coords]";
											inputField.value = txt.substring(0, position) + insert + txt.substring(position, txt.length);
											MRH.SetCaretPosition(inputField, position + insert.length);
										}
									}
									break;
								case "X":
									// coords by moving mouse OVER map coordinates
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
								case "S":
									// coords by inserting [coords][/coords]
									var inputField = document.querySelector('input:focus, textarea:focus');
									if (inputField != null) {
										var position = MRH.GetCaretPosition(inputField);
										var txt = inputField.value;
										var insert = "[coords][/coords]";
										inputField.value = txt.substring(0, position) + insert + txt.substring(position, txt.length);
										MRH.SetCaretPosition(inputField, position + ("[coords]").length);
									}
									break;
								default:
									// Other letters
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
					} // members
				});
			}

			// Loading
			function TACoords_checkIfLoaded() {
				try {
					if (typeof qx != 'undefined') {
						ap = qx.core.Init.getApplication();
						mb = qx.core.Init.getApplication().getMenuBar();
						if (ap && mb) {
							createInstance();
							window.MrHIDE.main.getInstance().initialize();
						} else window.setTimeout(TACoords_checkIfLoaded, 1000);
					} else {
						window.setTimeout(TACoords_checkIfLoaded, 1000);
					}
				} catch (e) {
					if (typeof console != 'undefined') console.log(e);
					else if (window.opera) opera.postError(e);
					else GM_log(e);
				}
			}
			if (/commandandconquer\.com/i.test(document.domain)) {
				window.setTimeout(TACoords_checkIfLoaded, 1000);
			}
		}
		// Injecting
	if (window.location.pathname != ("/login/auth")) {
		var TACScript = document.createElement("script");
		TACScript.innerHTML = "(" + TACoordsMain.toString() + ")();";
		TACScript.type = "text/javascript";
		if (/commandandconquer\.com/i.test(document.domain)) {
			document.getElementsByTagName("head")[0].appendChild(TACScript);
		}
	}
})();Ini();

/***********************************************************************************
Info Sticker ***** Version 1.11.07
***********************************************************************************/
// ==UserScript==
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// ==/UserScript==
(function () {
    var InfoSticker_main = function () {
        try {
            function createInfoSticker() {
                console.log('InfoSticker loaded');
                // define Base
                qx.Class.define("InfoSticker.Base", {
                    type: "singleton",
                    extend: qx.core.Object,
                    members: {
                        /* Desktop */
                        dataTimerInterval: 1000,
                        positionInterval: 500,
                        tibIcon: null,
                        cryIcon: null,
                        powIcon: null,
                        creditIcon: null,
                        repairIcon: null,
                        hasStorage: false,

                        initialize: function () {
                            try {
                                this.hasStorage = 'localStorage' in window && window['localStorage'] !== null;
                            } catch (se) {}
                            try {
                                var fileManager = ClientLib.File.FileManager.GetInstance();
                                this.tibIcon = fileManager.GetPhysicalPath("ui/common/icn_res_tiberium.png");
                                this.cryIcon = fileManager.GetPhysicalPath("ui/common/icn_res_chrystal.png");
                                this.powIcon = fileManager.GetPhysicalPath("ui/common/icn_res_power.png");
                                this.creditIcon = fileManager.GetPhysicalPath("ui/common/icn_res_dollar.png");
								this.repairIcon = fileManager.GetPhysicalPath("ui/icons/icn_repair_off_points.png");
                                
								if (typeof phe.cnc.Util.attachNetEvent == 'undefined')
									this.attachEvent = webfrontend.gui.Util.attachNetEvent;
								else
									this.attachEvent = phe.cnc.Util.attachNetEvent;
                                
                                this.runMainTimer();
                            } catch (e) {
                                console.log("InfoSticker.initialize: ", e.toString());
                            }
                        },
                        runMainTimer: function () {
                            try {
                                var self = this;
                                this.calculateInfoData();
                                window.setTimeout(function () {
                                    self.runMainTimer();
                                }, this.dataTimerInterval);
                            } catch (e) {
                                console.log("InfoSticker.runMainTimer: ", e.toString());
                            }
                        },
                        runPositionTimer: function () {
                            try {
                                var self = this;
                                this.repositionSticker();
                                window.setTimeout(function () {
                                    self.runPositionTimer();
                                }, this.positionInterval);
                            } catch (e) {
                                console.log("InfoSticker.runPositionTimer: ", e.toString());
                            }
                        },
                        infoSticker: null,
                        mcvPopup: null,
                        mcvTimerLabel: null,
                        mcvInfoLabel: null,
                        mcvPane: null,
                        
                        repairPopup: null,
                        repairTimerLabel: null,

                        resourcePane: null,
                        resourceHidden: false,
                        resourceTitleLabel: null,
                        resourceHideButton: null,
                        resourceLabel1: null,
                        resourceLabel2: null,
                        resourceLabel3: null,

                        resourceLabel1per: null,
                        resourceLabel2per: null,
                        resourceLabel3per: null,

                        productionTitleLabel: null,
                        productionLabelPower: null,
                        productionLabelCredit: null,

                        repairInfoLabel: null,

                        lastButton: null,

                        top_image: null,
                        bot_image: null,

                        toFlipH: [],

                        pinButton: null,
                        pinned: false,

                        pinTop: 130,
                        pinButtonDecoration: null,
                        pinPane: null,

                        pinIconFix: false,
                        
                        lockButton: null,
                        locked: false,

                        lockButtonDecoration: null,
                        lockPane: null,

                        lockIconFix: false,
                        
                        mcvHide: false,
                        repairHide: false,
                        resourceHide: false,
                        productionHide: false,
						contProductionHide: false,
                        stickerBackground: null,
                        
                        mcvPane: null,
                        
                        pinLockPos: 0,
                        
                        attachEvent: function() {},
                        
                        isNull: function(e) {
                            return typeof e == "undefined" || e == null;
                        },
                        
                        getApp: function() {
                            return qx.core.Init.getApplication();
                        },
                        
                        getBaseListBar: function() {
                            var app = this.getApp();
                            var b;
                            if(!this.isNull(app)) {
                                b = app.getBaseNavigationBar();
                                if(!this.isNull(b)) {
                                    if(b.getChildren().length > 0) {
                                        b = b.getChildren()[0];
                                        if(b.getChildren().length > 0) {
                                            b = b.getChildren()[0];
                                            return b;
                                        }
                                    }
                                }
                            }
                            return null;
                        },
                        
                        repositionSticker: function () {
                            try {
                            	var i;
                                
                                if (this.infoSticker && !this.mcvInfoLabel.isDisposed() && !this.mcvPopup.isDisposed()) {
                                    var dele;

                                    try {
                                        if (this.top_image != null) {
                                            dele = this.top_image.getContentElement().getDomElement();
                                            if (dele != null) {
                                                dele.style["-moz-transform"] = "scaleY(-1)";
                                                dele.style["-o-transform"] = "scaleY(-1)";
                                                dele.style["-webkit-transform"] = "scaleY(-1)";
                                                dele.style.transform = "scaleY(-1)";
                                                dele.style.filter = "FlipV";
                                                dele.style["-ms-filter"] = "FlipV";
                                                this.top_image = null;
                                            }
                                        }
                                        for (i = this.toFlipH.length - 1; i >= 0; i--) {
                                            var e = this.toFlipH[i];
                                            if(e.isDisposed()) this.toFlipH.splice(i, 1);
                                            else {
                                                dele = e.getDecoratorElement().getDomElement();
                                                if (dele != null) {
                                                    dele.style["-moz-transform"] = "scaleX(-1)";
                                                    dele.style["-o-transform"] = "scaleX(-1)";
                                                    dele.style["-webkit-transform"] = "scaleX(-1)";
                                                    dele.style.transform = "scaleX(-1)";
                                                    dele.style.filter = "FlipH";
                                                    dele.style["-ms-filter"] = "FlipH";
                                                    this.toFlipH.splice(i, 1);
                                                }
                                            }
                                        }
                                    } catch (e2) {
                                        console.log("Error flipping images.", e2.toString());
                                    }
                                    var baseListBar = this.getBaseListBar();
                                    if(baseListBar!=null) {
                                        var baseCont = baseListBar.getChildren();
                                        for (i = 0; i < baseCont.length; i++) {
                                            var baseButton = baseCont[i];
                                            if(typeof baseButton.getBaseId === 'function') {
                                                if(baseButton.getBaseId() == ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity().get_Id()
                                                    && baseButton.getBounds() != null && baseButton.getBounds().top!=null) {
                                            //var baseButtonDecorator = baseButton.getDecorator();
                                            //if (baseButton!=this.mcvPopup && baseButtonDecorator != null && typeof baseButtonDecorator === "string" && baseButton.getBounds() != null && baseButton.getBounds().top!=null) {
                                                //if (baseButtonDecorator.indexOf("focused") >= 0 || baseButtonDecorator.indexOf("pressed") >= 0) {
                                                    if(this.locked) {
                                                        if(!this.pinned) {
                                                            if(baseListBar.indexOf(this.mcvPopup)>=0) {
                                                                baseListBar.remove(this.mcvPopup);
                                                            }
                                                            this.pinLockPos = baseListBar.indexOf(baseButton)+1;
                                                            baseListBar.addAt(this.mcvPopup, this.pinLockPos);
                                                        } else if(baseListBar.indexOf(this.mcvPopup)<0) {
                                                            baseListBar.addAt(this.mcvPopup, Math.max(0, Math.min(this.pinLockPos, baseCont.length)));
                                                        }
                                                    } else {
                                                        if(baseListBar.indexOf(this.mcvPopup)>=0) {
                                                            baseListBar.remove(this.mcvPopup);
                                                        }
                                                        if (!this.pinned) {
                                                            var top = baseButton.getBounds().top;
                                                            var infoTop;
                                                            try {
                                                                var stickerHeight = this.infoSticker.getContentElement().getDomElement().style.height;
                                                                stickerHeight = stickerHeight.substring(0, stickerHeight.indexOf("px"));
                                                                infoTop = Math.min(130 + top, Math.max(660, window.innerHeight) - parseInt(stickerHeight, 10) - 130);
                                                            } catch (heighterror) {
                                                                infoTop = 130 + top;
                                                            }
                                                            if(this.infoSticker.getContentElement().getDomElement()!=null)
                                                                this.infoSticker.setDomTop(infoTop);
                                                            
                                                            this.pinTop = infoTop;
                                                        }
                                                    }
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    
                                }
                            } catch (ex) {
                                console.log("InfoSticker.repositionSticker: ", ex.toString());
                            }
                        },
                        toLock: function (e) {
                            try {
                                this.locked = !this.locked;
                                if(!this.locked) {
                                    this.infoSticker.show();
                                    this.stickerBackground.add(this.mcvPopup);
                                }
                                else this.infoSticker.hide();
                                this.lockButton.setIcon(this.locked ? "FactionUI/icons/icn_thread_locked_active.png" : "FactionUI/icons/icn_thread_locked_inactive.png");
                                this.updateLockButtonDecoration();
                                if (this.hasStorage) {
                                    if (this.locked) {
                                        localStorage["infoSticker-locked"] = "true";
                                        if(this.pinned) localStorage["infoSticker-pinLock"] = this.pinLockPos.toString();
                                    } else {
                                        localStorage["infoSticker-locked"] = "false";
                                    }
                                }
                                if(this.locked && this.pinned) {
                                    this.menuUpButton.setEnabled(true);
                                    this.menuDownButton.setEnabled(true);
                                } else {
                                    this.menuUpButton.setEnabled(false);
                                    this.menuDownButton.setEnabled(false);
                                }
                                this.repositionSticker();
                            } catch(e) {
                                console.log("InfoSticker.toLock: ", e.toString());
                            }
                        },
                        updateLockButtonDecoration: function () {
                            var light = "#CDD9DF";
                            var mid = "#9CA4A8";
                            var dark = "#8C9499";
                            this.lockPane.setDecorator(null);
                            this.lockButtonDecoration = new qx.ui.decoration.Background();
                            this.lockButtonDecoration.setBackgroundColor(this.locked ? dark : light);
                            this.lockPane.setDecorator(this.lockButtonDecoration);
                        },
                        toPin: function (e) {
                            try {
                                this.pinned = !this.pinned;
                                this.pinButton.setIcon(this.pinned ? "FactionUI/icons/icn_thread_pin_active.png" : "FactionUI/icons/icn_thread_pin_inactive.png");
                                this.updatePinButtonDecoration();
                                if (this.hasStorage) {
                                    if (this.pinned) {
                                        localStorage["infoSticker-pinned"] = "true";
                                        localStorage["infoSticker-top"] = this.pinTop.toString();
                                        if(this.locked) {
                                            localStorage["infoSticker-pinLock"] = this.pinLockPos.toString();
                                        }
                                    } else {
                                        localStorage["infoSticker-pinned"] = "false";
                                    }
                                }
                                if(this.locked && this.pinned) {
                                    this.menuUpButton.setEnabled(true);
                                    this.menuDownButton.setEnabled(true);
                                } else {
                                    this.menuUpButton.setEnabled(false);
                                    this.menuDownButton.setEnabled(false);
                                }
                            } catch(e) {
                                console.log("InfoSticker.toPin: ", e.toString());
                            }
                        },
                        updatePinButtonDecoration: function () {
                            var light = "#CDD9DF";
                            var mid = "#9CA4A8";
                            var dark = "#8C9499";
                            this.pinPane.setDecorator(null);
                            this.pinButtonDecoration = new qx.ui.decoration.Background().set({
                                //innerOpacity: 0.5
                            });
                            //this.pinButtonDecoration.setInnerColor(this.pinned ? mid : light);
                            //this.pinButtonDecoration.setOuterColor(this.pinned ? light : mid);
                            this.pinButtonDecoration.setBackgroundColor(this.pinned ? dark : light);
                            this.pinPane.setDecorator(this.pinButtonDecoration);
                        },
                        hideResource: function () {
                            try {
                                //if(this.resourceHidden) 
                                if (this.resourcePane.isVisible()) {
                                    //this.resourcePane.hide();
                                    this.resourcePane.exclude();
                                    this.resourceHideButton.setLabel("+");
                                } else {
                                    this.resourcePane.show();
                                    this.resourceHideButton.setLabel("-");
                                }
                            } catch(e) {
                                console.log("InfoSticker.hideResource: ", e.toString());
                            }
                        },
                        lastPane: null,
                        createSection: function (parent, titleLabel, visible, visibilityStorageName) {
							try {
								var pane = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
									padding: [5, 0, 5, 5],
									width: 124,
									decorator: new qx.ui.decoration.Background().set({
										backgroundImage: "decoration/pane_messaging_item/messaging_items_pane.png",
										backgroundRepeat: "scale",
									}),
									alignX: "right"
								});
								
								var labelStyle = {
									font: qx.bom.Font.fromString('bold').set({
										size: 12
									}),
									textColor: '#595969'
								};
								titleLabel.set(labelStyle);
								
								var hidePane = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
									width: 124,
                                    alignX: "right"
								});
								
								var hideButton = new qx.ui.form.Button("-").set({
									//decorator: new qx.ui.decoration.Single(1, "solid", "black"),
									maxWidth: 15,
									maxHeight: 10,
									//textColor: "black"
								});
                                var self = this;
								//resourceHideButton.addListener("execute", this.hideResource, this);
								hideButton.addListener("execute", function () {
									if (hidePane.isVisible()) {
										hidePane.exclude();
										hideButton.setLabel("+");
									} else {
										hidePane.show();
										hideButton.setLabel("-");
									}
									if(self.hasStorage)
										localStorage["infoSticker-"+visibilityStorageName] = !hidePane.isVisible();
								});

								var titleBar = new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
								titleBar.add(hideButton);
								titleBar.add(titleLabel);
								pane.add(titleBar);
								pane.add(hidePane);
								
                                if(!visible) hidePane.exclude();
                                
								this.toFlipH.push(pane);

                                this.lastPane = pane;
								parent.add(pane);
								
								return hidePane;
							} catch(e) {
								console.log("InfoSticker.createSection: ", e.toString());
								throw e;
							}
                        },
						createHBox: function (ele1, ele2, ele3) {
							var cnt;
							cnt = new qx.ui.container.Composite();
							cnt.setLayout(new qx.ui.layout.HBox(0));
							if (ele1 != null) {
								cnt.add(ele1);
								ele1.setAlignY("middle");
							}
							if (ele2 != null) {
								cnt.add(ele2);
								ele2.setAlignY("bottom");
							}
							if (ele3 != null) {
								cnt.add(ele3);
								ele3.setAlignY("bottom");
							}

							return cnt;
						},
                        
                        formatCompactTime: function (time) {
                            var comps = time.split(":");
                            
                            var i = 0;
                            var value = Math.round(parseInt(comps[i], 10)).toString();
                            var len = comps.length;
                            while(value==0) {
                                value = Math.round(parseInt(comps[++i], 10)).toString();
                                len--;
                            }
                            var unit;
                            switch(len) {
                                case 1: unit = "s"; break;
                                case 2: unit = "m"; break;
                                case 3: unit = "h"; break;
                                case 4: unit = "d"; break;
                            }
                            return value+unit;
                        },
                        createImage: function(icon) {
                            var image = new qx.ui.basic.Image(icon);
                            image.setScale(true);
                            image.setWidth(20);
                            image.setHeight(20);
                            return image;
                        },

                        createMCVPane: function() {
                            try {
                                this.mcvInfoLabel = new qx.ui.basic.Label();
                                this.mcvTimerLabel = new qx.ui.basic.Label().set({
                                    font: qx.bom.Font.fromString('bold').set({
                                            size: 18
                                        }),
                                    textColor: '#282828',
                                    height: 20,
                                    width: 114,
                                    textAlign: 'center'
                                });
                                this.mcvTimerCreditProdLabel = new qx.ui.basic.Label().set({
                                    font: qx.bom.Font.fromString('normal').set({
                                        size: 12
                                    }),
                                    textColor: '#282828',
                                    height: 20,
                                    width: 114,
                                    textAlign: 'center',
                                    marginTop: 4,
                                    marginBottom: -4
                                });
                                var app = qx.core.Init.getApplication();
                                var b3 = app.getBaseNavigationBar().getChildren()[0].getChildren()[0];
                                
                                
                                var pane = this.createSection(b3, this.mcvInfoLabel, !this.mcvHide, "mcvHide");
                                pane.add(this.mcvTimerLabel);
                                pane.add(this.mcvTimerCreditProdLabel);
                                this.mcvPane = this.lastPane;
                                this.lastPane.setMarginLeft(7);
                                
                            } catch(e) {
                                console.log("InfoSticker.createMCVPopup", e.toString());
                            }
                        },
                        moveStickerUp: function() {
                            try {
                                var baseListBar = this.getBaseListBar();
                                this.pinLockPos=Math.max(0, this.pinLockPos-1);
                                if(baseListBar.indexOf(this.mcvPopup)>=0) {
                                    baseListBar.remove(this.mcvPopup);
                                }
                                if (this.hasStorage) {
                                    localStorage["infoSticker-pinLock"] = this.pinLockPos.toString();
                                }
                            } catch(e) {
                                console.log("InfoSticker.moveStickerUp", e.toString());
                            }
                        },
                        moveStickerDown: function() {
                            try {
                                var baseListBar = this.getBaseListBar();
                                this.pinLockPos=Math.min(baseListBar.getChildren().length, this.pinLockPos+1);
                                if(baseListBar.indexOf(this.mcvPopup)>=0) {
                                    baseListBar.remove(this.mcvPopup);
                                }
                                if (this.hasStorage) {
                                    localStorage["infoSticker-pinLock"] = this.pinLockPos.toString();
                                }
                            } catch(e) {
                                console.log("InfoSticker.moveStickerDown", e.toString());
                            }
                        },
                        menuUpButton: null,
                        menuDownButton: null,
                        createMCVPopup: function() {
                            try {
                                var self = this;
                                this.mcvPopup = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                                    spacing: 3})).set({
                                    paddingLeft: 5,
                                    width: 105,
                                    decorator: new qx.ui.decoration.Background()
                                });
                                
                                var menu = new qx.ui.menu.Menu();
                                var menuPinButton = new qx.ui.menu.Button("Pin", "FactionUI/icons/icn_thread_pin_inactive.png");
                                menuPinButton.addListener("execute", this.toPin, this);
                                menu.add(menuPinButton);
                                var menuLockButton = new qx.ui.menu.Button("Lock", "FactionUI/icons/icn_thread_locked_inactive.png");
                                menuLockButton.addListener("execute", this.toLock, this);
                                menu.add(menuLockButton);
                                var fileManager = ClientLib.File.FileManager.GetInstance();
                                this.menuUpButton = new qx.ui.menu.Button("Move up", fileManager.GetPhysicalPath("ui/icons/icon_tracker_arrow_up.png"));
                                //ui/icons/icon_tracker_arrow_up.png ui/gdi/icons/cht_opt_arrow_down.png
                                this.menuUpButton.addListener("execute", this.moveStickerUp, this);
                                menu.add(this.menuUpButton);
                                this.menuDownButton = new qx.ui.menu.Button("Move down", fileManager.GetPhysicalPath("ui/icons/icon_tracker_arrow_down.png"));
                                this.menuDownButton.addListener("execute", this.moveStickerDown, this);
                                menu.add(this.menuDownButton);
                                this.mcvPopup.setContextMenu(menu);
                                if(!this.locked) {
                                    this.stickerBackground.add(this.mcvPopup);
                                }
    
    ////////////////////////////----------------------------------------------------------
                                this.pinButton = new webfrontend.ui.SoundButton().set({
                                    decorator: "button-forum-light",
                                    icon: this.pinned ? "FactionUI/icons/icn_thread_pin_active.png" : "FactionUI/icons/icn_thread_pin_inactive.png",
                                    iconPosition: "top",
                                    show: "icon",
                                    cursor: "pointer",
                                    height: 23,
                                    width: 50,
                                    //maxHeight: 25,
                                    maxWidth: 33,
                                    maxHeight: 19,
                                    alignX: "center"
                                });
                                this.pinButton.addListener("execute", this.toPin, this);
                                
                                this.pinPane = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                                    //width: 50,
                                    maxWidth: 37,
                                });
                                
                                this.updatePinButtonDecoration();
                                
                                this.pinPane.setDecorator(this.pinButtonDecoration);
                                this.pinPane.add(this.pinButton);
                                //this.mcvPopup.add(this.pinPane);
                                //this.toFlipH.push(this.pinPane);
                                
                                var icon = this.pinButton.getChildControl("icon");
                                icon.setWidth(15);
                                icon.setHeight(15);
                                icon.setScale(true);
    ////////////////////////////----------------------------------------------------------
                                this.lockButton = new webfrontend.ui.SoundButton().set({
                                    decorator: "button-forum-light",
                                    icon: this.pinned ? "FactionUI/icons/icn_thread_locked_active.png" : "FactionUI/icons/icn_thread_locked_inactive.png",
                                    iconPosition: "top",
                                    show: "icon",
                                    cursor: "pointer",
                                    height: 23,
                                    width: 50,
                                    //maxHeight: 25,
                                    maxWidth: 33,
                                    maxHeight: 19,
                                    alignX: "center"
                                });
                                this.lockButton.addListener("execute", this.toLock, this);
                                
                                this.lockPane = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                                    //width: 50,
                                    maxWidth: 37,
                                });
                                
                                this.updateLockButtonDecoration();
                                
                                this.lockPane.setDecorator(this.lockButtonDecoration);
                                this.lockPane.add(this.lockButton);
                                //this.mcvPopup.add(this.pinPane);
                                //this.toFlipH.push(this.pinPane);
                                
                                icon = this.lockButton.getChildControl("icon");
                                icon.setWidth(15);
                                icon.setHeight(15);
                                icon.setScale(true);
    ////////////////////////////----------------------------------------------------------
                                this.resourceTitleLabel = new qx.ui.basic.Label();
                                this.resourceTitleLabel.setValue("Base");
                                var resStyle = {
                                    font: qx.bom.Font.fromString('bold').set({
                                            size: 14
                                        }),
                                    textColor: '#282828',
                                    height: 20,
                                    width: 65,
                                    marginLeft: -10,
                                    textAlign: 'right'
                                };
                                
                                this.resourceLabel1 = new qx.ui.basic.Label().set(resStyle);
                                this.resourceLabel2 = new qx.ui.basic.Label().set(resStyle);
                                this.resourceLabel3 = new qx.ui.basic.Label().set(resStyle);
                                
                                var perStyle = {
                                    font: qx.bom.Font.fromString('bold').set({
                                        size: 9
                                    }),
                                    textColor: '#282828',
                                    height: 18,
                                    width: 33,
                                    textAlign: 'right'
                                };
                                this.resourceLabel1per = new qx.ui.basic.Label().set(perStyle);
                                this.resourceLabel2per = new qx.ui.basic.Label().set(perStyle);
                                this.resourceLabel3per = new qx.ui.basic.Label().set(perStyle);
                                
                                
                                var pane3 = this.createSection(this.mcvPopup, this.resourceTitleLabel, !this.resourceHide, "resourceHide");
                                
                                
                                this.repairTimerLabel = new qx.ui.basic.Label().set({
                                    font: qx.bom.Font.fromString('bold').set({
                                        size: 16
                                    }),
                                    textColor: '#282828',
                                    height: 20,
                                    width: 85,
                                    marginLeft: 0,
                                    textAlign: 'center'
                                });
                                pane3.add(this.createHBox(this.createImage(this.repairIcon), this.repairTimerLabel));
                                
                                pane3.add(this.createHBox(this.createImage(this.tibIcon), this.resourceLabel1, this.resourceLabel1per));
                                pane3.add(this.createHBox(this.createImage(this.cryIcon), this.resourceLabel2, this.resourceLabel2per));
                                pane3.add(this.createHBox(this.createImage(this.powIcon), this.resourceLabel3, this.resourceLabel3per));
                                
                                var mcvC = this.mcvPopup.getChildren();
                                mcvC[mcvC.length-1].getChildren()[0].add(this.pinPane);
                                mcvC[mcvC.length-1].getChildren()[0].add(this.lockPane);
    ////////////////////////////----------------------------------------------------------
    
                                this.productionTitleLabel = new qx.ui.basic.Label();
                                this.productionTitleLabel.setValue("db.Produce");
                                
                                var productionStyle = {
                                    font: qx.bom.Font.fromString('bold').set({
                                        size: 13
                                    }),
                                    textColor: '#282828',
                                    height: 20,
                                    width: 85,
                                    textAlign: 'right',
                                    marginTop: 2,
                                    marginBottom: -2
                                };
								this.productionLabelTiberium = new qx.ui.basic.Label().set(productionStyle);
								this.productionLabelCrystal = new qx.ui.basic.Label().set(productionStyle);
                                
								this.productionLabelPower1 = new qx.ui.basic.Label().set(productionStyle);
                                this.productionLabelCredit = new qx.ui.basic.Label().set(productionStyle);
                                
                                var pane4 = this.createSection(this.mcvPopup, this.productionTitleLabel, !this.productionHide, "productionHide");
                                pane4.add(this.createHBox(this.createImage(this.tibIcon), this.productionLabelTiberium));
                                pane4.add(this.createHBox(this.createImage(this.cryIcon), this.productionLabelCrystal));
								
								pane4.add(this.createHBox(this.createImage(this.powIcon), this.productionLabelPower1));
                                pane4.add(this.createHBox(this.createImage(this.creditIcon), this.productionLabelCredit));
    ////////////////////////////----------------------------------------------------------
	
								this.contProductionTitleLabel = new qx.ui.basic.Label();
                                this.contProductionTitleLabel.setValue("Cont'+Ally");
                                
                                var contProductionStyle = {
                                    font: qx.bom.Font.fromString('bold').set({
                                        size: 13
                                    }),
                                    textColor: '#282828',
                                    height: 20,
                                    width: 85,
                                    textAlign: 'right',
                                    marginTop: 2,
                                    marginBottom: -2
                                };
								this.contProductionLabelTiberium = new qx.ui.basic.Label().set(contProductionStyle);
								this.contProductionLabelCrystal = new qx.ui.basic.Label().set(contProductionStyle);
                                this.contProductionLabelPower = new qx.ui.basic.Label().set(contProductionStyle);
								
                                this.contProductionLabelCredit = new qx.ui.basic.Label().set(contProductionStyle);
                                
                                var pane5 = this.createSection(this.mcvPopup, this.contProductionTitleLabel, !this.contProductionHide, "contProductionHide");
                                pane5.add(this.createHBox(this.createImage(this.tibIcon), this.contProductionLabelTiberium));
                                pane5.add(this.createHBox(this.createImage(this.cryIcon), this.contProductionLabelCrystal));
								pane5.add(this.createHBox(this.createImage(this.powIcon), this.contProductionLabelPower));
                                pane5.add(this.createHBox(this.createImage(this.creditIcon), this.contProductionLabelCredit));
////////////////////////////----------------------------------------------------------								
								 this.repairTimeTitleLabel = new qx.ui.basic.Label();
                                 this.repairTimeTitleLabel.setValue("RepairTimes");
                                
                                this.repairTimeStyle = {
                                    font: qx.bom.Font.fromString('bold').set({
                                        size: 13
                                    }),
                                    textColor: '#282828',
                                    height: 20,
                                    width: 85,
                                    textAlign: 'center',
                                    marginTop: 2,
                                    marginBottom: -2
                                };
								
								this.repairTimeLabel0 = new qx.ui.basic.Label().set(this.repairTimeStyle);
								this.repairTimeLabel1 = new qx.ui.basic.Label().set(this.repairTimeStyle);
                                this.repairTimeLabel2 = new qx.ui.basic.Label().set(this.repairTimeStyle);
                                
                                var pane6 = this.createSection(this.mcvPopup, this.repairTimeTitleLabel, !this.rtHide, "repairHide");
                                pane6.add(this.createHBox(this.createImage(this.repairIcon), this.repairTimeLabel0));
                                pane6.add(this.createHBox(this.createImage(this.repairIcon), this.repairTimeLabel1));
								pane6.add(this.createHBox(this.createImage(this.repairIcon), this.repairTimeLabel2));
                                //pane6.add(this.createHBox(this.createImage(this.creditIcon), this.productionLabelCredit));
    ////////////////////////////----------------------------------------------------------



							} catch(e) {
                                console.log("InfoSticker: createMCVPopup", e.toString());
                            }
                        },
                        currentCityChange: function() {
                            this.calculateInfoData();
                            this.repositionSticker();
                        },
                        disposeRecover: function() {
                            
                            try {
                                if(this.mcvPane.isDisposed()) {
                                    this.createMCVPane();
                                }
                                
                                if(this.mcvPopup.isDisposed()) {
                                    this.createMCVPopup();
                                    
                                    this.repositionSticker();
                                }
                                this.waitingRecovery = false;
                            } catch(e) {
                                console.log("InfoSticker: disposeRecover", e.toString());
                            }
                            
                        },
                        waitingRecovery: false,
                        citiesChange: function() {
                            try {
                                var self = this;
                                var baseListBar = this.getBaseListBar();
                                this.disposeRecover();
                                
                                if(baseListBar.indexOf(this.mcvPopup)>=0) {
                                    baseListBar.remove(this.mcvPopup);
                                    this.mcvPopup.dispose();
                                }
                                
                                if(baseListBar.indexOf(this.mcvPane)>=0) {
                                    baseListBar.remove(this.mcvPane);
                                    this.mcvPane.dispose();
                                }
                                if(!this.waitingRecovery) {
                                    this.waitingRecovery = true;
                                    window.setTimeout(function () {
                                        self.disposeRecover();
                                    }, 10);
                                }
                            } catch(e) {
                                console.log("InfoSticker: citiesChange", e.toString());
                            }
                        },
                        calculateInfoData: function () {
                            try {
                                var self = this;
                                var player = ClientLib.Data.MainData.GetInstance().get_Player();
                                var cw = player.get_Faction();
                                var cj = ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(ClientLib.Base.ETechName.Research_BaseFound, cw);
                                var cr = player.get_PlayerResearch();
                                var cd = cr.GetResearchItemFomMdbId(cj);
                                
                                var app = qx.core.Init.getApplication();
                                var b3 = app.getBaseNavigationBar().getChildren()[0].getChildren()[0];
                                if(b3.getChildren().length==0) return;
                                if (!this.infoSticker) {
                                    this.infoSticker = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                                        alignX: "right"
                                    })).set({
                                        width: 105,
                                    });

                                    var top = 130;
                                    if (this.hasStorage) {
                                        var l = localStorage["infoSticker-locked"] == "true";
                                        if (l != null) {
                                            this.locked = l;
                                            var pl = localStorage["infoSticker-pinLock"];
                                            if(pl!=null) {
                                                try {
                                                	this.pinLockPos = parseInt(pl, 10);
                                                } catch(etm) {}
                                            }
                                        }
                                        
                                        var p = localStorage["infoSticker-pinned"];
                                        var t = localStorage["infoSticker-top"];
                                        if (p != null && t != null) {
                                            var tn;
                                            try {
                                                this.pinned = p == "true";
                                                if (this.pinned) {
                                                    tn = parseInt(t, 10);
                                                    top = tn;
                                                }
                                            } catch (etn) {}
                                        }
                                        this.mcvHide = localStorage["infoSticker-mcvHide"] == "true";
                                        this.repairHide = localStorage["infoSticker-repairHide"] == "true";
										this.rtHide = localStorage["infoSticker-repairHide"] == "true";
                                        this.resourceHide = localStorage["infoSticker-resourceHide"] == "true";
                                        this.productionHide = localStorage["infoSticker-productionHide"] == "true";
										this.contProductionHide = localStorage["infoSticker-contProductionHide"] == "true";
                                    }
                                    
                                    
                                    app.getDesktop().add(this.infoSticker, {
                                        right: 124,
                                        top: top
                                    });
                                    if(this.locked) {
                                        this.infoSticker.hide();
                                    }

                                    this.stickerBackground = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                                        //paddingLeft: 5,
                                        width: 105,
                                        decorator: new qx.ui.decoration.Background().set({
                                            backgroundImage: "webfrontend/ui/common/bgr_region_world_select_scaler.png",
                                            backgroundRepeat: "scale",
                                        })
                                    });
                                    
                                    this.createMCVPane();
                                    this.createMCVPopup();
									
                                    if(this.locked && this.pinned) {
                                        this.menuUpButton.setEnabled(true);
                                        this.menuDownButton.setEnabled(true);
                                    } else {
                                        this.menuUpButton.setEnabled(false);
                                        this.menuDownButton.setEnabled(false);
                                    }
                                    
                                    this.top_image = new qx.ui.basic.Image("webfrontend/ui/common/bgr_region_world_select_end.png");
                                    this.infoSticker.add(this.top_image);

                                    this.infoSticker.add(this.stickerBackground);
                                    //this.infoSticker.add(this.mcvPopup);

                                    this.bot_image = new qx.ui.basic.Image("webfrontend/ui/common/bgr_region_world_select_end.png");
                                    this.infoSticker.add(this.bot_image);

                                    this.runPositionTimer();

                                    try {
                                        this.attachEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.currentCityChange);
                                        this.attachEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "Change", ClientLib.Data.CitiesChange, this, this.citiesChange);
                                    } catch(eventError) {
                                        console.log("InfoSticker.EventAttach:", eventError);
                                        console.log("The script will continue to run, but with slower response speed.");
                                    }
                                }
                                this.disposeRecover();
                                
                                if (cd == null) {
                                    if (this.mcvPopup) {
                                        //this.mcvInfoLabel.setValue("MCV ($???)");
                                        this.mcvInfoLabel.setValue("MCV<br>$???");
                                        this.mcvTimerLabel.setValue("Loading");
                                    }
                                } else {
                                    var nextLevelInfo = cd.get_NextLevelInfo_Obj();
                                    var resourcesNeeded = [];
                                    for (var i in nextLevelInfo.rr) {
                                        if (nextLevelInfo.rr[i].t > 0) {
                                            resourcesNeeded[nextLevelInfo.rr[i].t] = nextLevelInfo.rr[i].c;
                                        }
                                    }
                                    //var researchNeeded = resourcesNeeded[ClientLib.Base.EResourceType.ResearchPoints];
                                    //var currentResearchPoints = player.get_ResearchPoints();
                                    var creditsNeeded = resourcesNeeded[ClientLib.Base.EResourceType.Gold];
                                    var creditsResourceData = player.get_Credits();
                                    var creditGrowthPerHour = (creditsResourceData.Delta + creditsResourceData.ExtraBonusDelta) * ClientLib.Data.MainData.GetInstance().get_Time().get_StepsPerHour();
                                    var creditTimeLeftInHours = (creditsNeeded - player.GetCreditsCount()) / creditGrowthPerHour;
                                    this.mcvInfoLabel.setValue("MCV ($ " + this.formatNumbersCompact(creditsNeeded) + ")");
                                    //this.mcvInfoLabel.setValue("MCV<br>$" + this.formatNumbersCompact(creditsNeeded));
                                    this.mcvTimerCreditProdLabel.setValue("at " + this.formatNumbersCompact(creditGrowthPerHour*24) + "/1d");
                                    if (creditTimeLeftInHours <= 0) {
                                        this.mcvTimerLabel.setValue("Ready");
                                    } else if (creditGrowthPerHour == 0) {
                                        this.mcvTimerLabel.setValue("Never");
                                    } else {
                                        if(creditTimeLeftInHours >= 24 * 100) {
                                            this.mcvTimerLabel.setValue("> 99 days");
                                        } else {
                                            this.mcvTimerLabel.setValue(this.FormatTimespan(creditTimeLeftInHours * 60 * 60));
                                        }
                                    }
                                }

                                var ncity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                if (ncity == null) {
                                    if (this.mcvPopup) {
                                        this.repairTimerLabel.setValue("Select a base"); 
										this.repairTimeLabel0.setValue("Select a base");
                                        this.repairTimeLabel1.setValue("Select a base");
										this.repairTimeLabel2.setValue("Select a base");
										this.resourceLabel1.setValue("N/A");
										this.resourceLabel2.setValue("N/A");
                                        this.resourceLabel3.setValue("N/A");
                                    }
                                } else {

                                    var rt = Math.min(ncity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeInf),
                                    ncity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeVeh),
                                    ncity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeAir));
                                    if (ncity.get_CityUnitsData().get_UnitLimitOffense() == 0) {
                                        this.repairTimerLabel.setValue("No army");
                                    } else {
                                        this.repairTimerLabel.setValue(this.FormatTimespan(rt));
                                    }
									
									var airRT = ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false);
									if (ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false) == 0) {
										this.repairTimeLabel0.setValue("No birds");
                                    } else {
                                        this.repairTimeLabel0.setValue(this.FormatTimespan(airRT) + " AIR");
                                    }
									
									var vehRT = ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false);
									if (ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false) == 0) {
										this.repairTimeLabel1.setValue("No cars");
                                    } else {
                                        this.repairTimeLabel1.setValue(this.FormatTimespan(vehRT) + " VEH");
                                    }
									var infRT = ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false);
									if (ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false) == 0) {
										this.repairTimeLabel2.setValue("No dudes");
                                    } else {
                                        this.repairTimeLabel2.setValue(this.FormatTimespan(infRT) + " INF");
                                    }
									//this.repairTimerLabel0.setValue(this.FormatTimespan(airRT));
									//this.repairTimerLabel1.setValue(this.FormatTimespan(vehRT));
									//this.repairTimerLabel2.setValue(this.FormatTimespan(infRT));

                                    var tib = ncity.GetResourceCount(ClientLib.Base.EResourceType.Tiberium);
                                    var tibMax = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.Tiberium);
                                    var tibRatio = tib / tibMax;
                                    this.resourceLabel1.setTextColor(this.formatNumberColor(tib, tibMax));
                                    this.resourceLabel1.setValue(this.formatNumbersCompact(tib));
                                    this.resourceLabel1per.setValue(this.formatPercent(tibRatio));

                                    var cry = ncity.GetResourceCount(ClientLib.Base.EResourceType.Crystal);
                                    var cryMax = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.Crystal);
                                    var cryRatio = cry / cryMax;
                                    this.resourceLabel2.setTextColor(this.formatNumberColor(cry, cryMax));
                                    this.resourceLabel2.setValue(this.formatNumbersCompact(cry));
                                    this.resourceLabel2per.setValue(this.formatPercent(cryRatio));

                                    var power = ncity.GetResourceCount(ClientLib.Base.EResourceType.Power);
                                    var powerMax = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.Power);
                                    var powerRatio = power / powerMax;
                                    this.resourceLabel3.setTextColor(this.formatNumberColor(power, powerMax));
                                    this.resourceLabel3.setValue(this.formatNumbersCompact(power));
                                    this.resourceLabel3per.setValue(this.formatPercent(powerRatio));

                                    
									var powerCont = ncity.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false);
                                    var powerBonus = ncity.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Power);
                                    var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                                    var powerAlly = alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Power);
                                    var powerProd = (powerCont + powerAlly);
									var powerPac = (powerCont + powerAlly + powerBonus)*6;
									if(powerRatio >= 1){
									powerProd = 0;
									powerPac = (powerBonus)*6;
									
									}
									
									
									var tiberiumCont = ncity.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false);
                                    var tiberiumBonus = ncity.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Tiberium);
                                    //var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                                    var tiberiumAlly = alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Tiberium);
									var tiberiumPac = (tiberiumCont + tiberiumAlly + tiberiumBonus)*6;
									var tiberiumProd = (tiberiumCont + tiberiumAlly);
									if(tibRatio >= 1){
									tiberiumProd = 0;
									tiberiumPac = (tiberiumBonus)*6;
									
									}
									
									var crystalCont = ncity.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false);
                                    var crystalBonus = ncity.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Crystal);
                                    //var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                                    var crystalAlly = alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Crystal);
									var crystalPac = (crystalCont + crystalAlly + crystalBonus)*6;
									var crystalProd = (crystalCont + crystalAlly);
									
									if(cryRatio >= 1){
									crystalProd = 0;
									crystalPac = (crystalBonus)*6;
									
									}
									

                                    var creditCont = ClientLib.Base.Resource.GetResourceGrowPerHour(ncity.get_CityCreditsProduction(), false);
                                    var creditBonus = ClientLib.Base.Resource.GetResourceBonusGrowPerHour(ncity.get_CityCreditsProduction(), false);
                                    var creditProd = (creditCont + creditBonus)*6;
									
									if( ncity.get_hasCooldown() == true){
									
									powerPac = (powerCont + powerAlly)*6 ;
									creditProd = (creditCont)*6;
									crystalPac = (crystalCont + crystalAlly )*6;
									tiberiumPac = (tiberiumCont + tiberiumAlly)*6;
									}

									this.productionLabelTiberium.setValue(this.formatNumbersCompact(tiberiumPac) + "/6h");
									this.productionLabelCrystal.setValue(this.formatNumbersCompact(crystalPac) + "/6h");
                                    this.productionLabelPower1.setValue(this.formatNumbersCompact(powerPac) + "/6h");
									this.productionLabelCredit.setValue(this.formatNumbersCompact(creditProd) + "/6h");
									
									this.contProductionLabelTiberium.setValue(this.formatNumbersCompact(tiberiumProd) + "/h");
									this.contProductionLabelCrystal.setValue(this.formatNumbersCompact(crystalProd) + "/h");
                                    this.contProductionLabelPower.setValue(this.formatNumbersCompact(powerProd) + "/h");
									this.contProductionLabelCredit.setValue(this.formatNumbersCompact(creditCont) + "/h");
									
									
                                }
                            } catch (e) {
                                console.log("InfoSticker.calculateInfoData", e.toString());
                            }
                        },
                        formatPercent: function (value) {
                            return value > 999 / 100 ? ">999%" : this.formatNumbersCompact(value * 100, 0) + "%";
                            //return this.formatNumbersCompact(value*100, 0) + "%";
                        },
                        formatNumberColor: function (value, max) {
                            var ratio = value / max;

                            var color;
                            var black = [40, 180, 40];
                            var yellow = [181, 181, 0];
                            var red = [187, 43, 43];

                            if (ratio < 0.5) color = black;
                            else if (ratio < 0.75) color = this.interpolateColor(black, yellow, (ratio - 0.5) / 0.25);
                            else if (ratio < 1) color = this.interpolateColor(yellow, red, (ratio - 0.75) / 0.25);
                            else color = red;

                            //console.log(qx.util.ColorUtil.rgbToHexString(color));
                            return qx.util.ColorUtil.rgbToHexString(color);
                        },
                        interpolateColor: function (color1, color2, s) {
                            //console.log("interp "+s+ " " + color1[1]+" " +color2[1]+" " +(color1[1]+s*(color2[1]-color1[1])));
                            return [Math.floor(color1[0] + s * (color2[0] - color1[0])),
                            Math.floor(color1[1] + s * (color2[1] - color1[1])),
                            Math.floor(color1[2] + s * (color2[2] - color1[2]))];
                        },
                        formatNumbersCompact: function (value, decimals) {
                            if (decimals == undefined) decimals = 2;
                            var valueStr;
                            var unit = "";
                            if (value < 1000) valueStr = value.toString();
                            else if (value < 1000 * 1000) {
                                valueStr = (value / 1000).toString();
                                unit = "k";
                            } else if (value < 1000 * 1000 * 1000) {
                                valueStr = (value / 1000000).toString();
                                unit = "M";
                            } else {
                                valueStr = (value / 1000000000).toString();
                                unit = "G";
                            }
                            if (valueStr.indexOf(".") >= 0) {
                                var whole = valueStr.substring(0, valueStr.indexOf("."));
                                if (decimals === 0) {
                                    valueStr = whole;
                                } else {
                                    var fraction = valueStr.substring(valueStr.indexOf(".") + 1);
                                    if (fraction.length > decimals) fraction = fraction.substring(0, decimals);
                                    valueStr = whole + "." + fraction;
                                }
                            }

                            valueStr = valueStr + unit;
                            return valueStr;
                        },
                        FormatTimespan: function (value) {
                            var i;
                            var t = ClientLib.Vis.VisMain.FormatTimespan(value);
                            var colonCount = 0;
                            for (i = 0; i < t.length; i++) {
                                if (t.charAt(i) == ':') colonCount++;
                            }
                            var r = "";
                            for (i = 0; i < t.length; i++) {
                                if (t.charAt(i) == ':') {
                                    if (colonCount > 2) {
                                        r += "d ";
                                    } else {
                                        r += t.charAt(i);
                                    }
                                    colonCount--;
                                } else {
                                    r += t.charAt(i);
                                }
                            }
                            return r;
                        }
                    }
                });
            }
        } catch (e) {
            console.log("InfoSticker: createInfoSticker: ", e.toString());
        }

        function InfoSticker_checkIfLoaded() {
            try {
                if (typeof qx != 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION) && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION).isVisible()) {
                    createInfoSticker();
                    window.InfoSticker.Base.getInstance().initialize();
                } else {
                    window.setTimeout(InfoSticker_checkIfLoaded, 1000);
                }
            } catch (e) {
                console.log("InfoSticker_checkIfLoaded: ", e.toString());
            }
        }
        if (/commandandconquer\.com/i.test(document.domain)) {
            window.setTimeout(InfoSticker_checkIfLoaded, 1000);
        }
    }
    try {
        var InfoStickerScript = document.createElement("script");
        InfoStickerScript.innerHTML = "(" + InfoSticker_main.toString() + ")();";
        InfoStickerScript.type = "text/javascript";
        if (/commandandconquer\.com/i.test(document.domain)) {
            document.getElementsByTagName("head")[0].appendChild(InfoStickerScript);
        }
    } catch (e) {
        console.log("InfoSticker: init error: ", e.toString());
    }
})();

/***********************************************************************************
Tiberium Alliances Map (Elda-Mod) ***** Version 2.0
***********************************************************************************/
// ==UserScript==
// @include        https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// ==/UserScript==
(function() {
    var TAMap_mainFunction = function() {
        function createMapTweak() {
            var TAMap = {};
            qx.Class.define("TAMap.main", {
                type : "singleton",
                extend : qx.core.Object,
                members : {
					version        : "2.0",
                    buttonMap      : null,
                    mapBox         : null,
                    mapWidget      : null,
                    scroll         : null,
                    mapCanvas      : null,
                    settingsWnd    : null,
                    poiSelect      : null,
                    allianceSelect : null,
					obfSectorName : null,
					obfAllianceList : null,
					obfAllianceId   : null,
					obfAllianceName : null, 
                    colorFields: {},
                    visOptions: { colors: { 
						cityColor           : "green"       , // type = 1
                        baseColor           : "navy"        , // type = 2
                        campColor           : "midnightblue", // type = 3, CampType=2
                        outpostColor        : "royalblue"   , // type = 3, CampType=3
                        poiColor            : "orange"      , // type = 4, POIType != 0
                        tunnelColor         : "forestgreen" , // type = 4, POIType = 0
                        enemyBaseColor      : "red",
                        allianceTerrainColor: "teal",
                        ownBaseColor        : "lime",
                        highlightColor      : "white"
                    }},
                    // Types: 1 = city
                    // 2 = Forgotten Base{Id, Level}
                    // 3 = Camp, Outpost {Id, CampType: 3 = Outpost, 2 = Camp}
                    // 4 = POI, Tunnel Exit {Id, Level, OwnerAllianceId, OwnerAllianceName, POIType:
                    // 6 = Aircraft (Off Air)
                    // 7 = Resonator (Def), 0 = Tunnel!
                    //     ...
                    //
                    zoomFactor : 3,
                    initialize : function() {
                        if (localStorage) {
                            var vo = localStorage["TAMap.visOptions"];
                            if (vo != null) {
                                this.visOptions = JSON.parse(vo);
                            }
                        }
                        // this.add_ViewModeChange = (new ClientLib.Vis.ViewModeChange).$ctor(this, this.onViewChange);
                     
                        console.log("Adding button");
                        
                        var addonmenu = Addons.AddonMainMenu.getInstance();	
                        addonmenu.AddMainMenu("Map",function() { window.TAMap.main.getInstance().showMap(); }, "ALT+M"); 
                        
                         /*
                        this.buttonMap = new qx.ui.form.Button("Map");
                        this.buttonMap.set({
                            width : 80,
                            appearance : "button-bar-center",
                            toolTipText : ""
                        });
                        this.buttonMap.addListener("click", this.showMap, this);
                        
                        
                       
                        var mainBar = qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_MENU);
                        mainBar.getChildren()[1].addAt(this.buttonMap, 8, {
                            top : 0,
                            right : 0
                        });*/
                        console.log("Button added");
                        // The Map window
                        this.mapBox = new qx.ui.window.Window("Map  [v"+this.version+" Links-Mod]");
                        this.mapBox.setPadding(1);
                        this.mapBox.setLayout(new qx.ui.layout.Grow());
                        // this.mapBox.setLayout(new qx.ui.layout.VBox());
                        this.mapBox.setShowMaximize(false);
                        this.mapBox.setShowMinimize(false);
                        this.mapBox.moveTo(150, 50);
                        this.mapBox.setHeight(500);
                        this.mapBox.setWidth(500);
                        this.mapBox.setMinWidth(10);
                        this.mapBox.setMinHeight(10);
						this.mapBox.setBackgroundColor("black");
                        this.mapWidget = new qx.html.Element("canvas", null, {
                            id : "map",
                            width : 3000,
                            height : 3000
                        });
                        this.mapWidget.addListener("appear", function() {
                            console.log("appeared:" + this.mapWidget.getDomElement());
                            var canvas = this.mapWidget.getDomElement();
                            if (this.mapCanvas == null) {
                                this.mapCanvas = canvas;
                                var _thisMap = this;
                                canvas.addEventListener("click", function(evt) {
                                    console.log("coords:" + evt.clientX + ":" + evt.clientY);
                                    console.log("offsets:" + canvas.offsetTop + "," + canvas.offsetLeft);
                                    // get canvas position
                                    var obj = canvas;
                                    var top = 0;
                                    var left = 0;
                                    while (obj && obj.tagName != 'BODY') {
                                        top += obj.offsetTop;
                                        left += obj.offsetLeft;
                                        obj = obj.offsetParent;
                                    }
                                    // return relative mouse position
                                    var mouseX = evt.clientX - left + window.pageXOffset + _thisMap.scroll.getScrollX();
                                    var mouseY = evt.clientY - top + window.pageYOffset + _thisMap.scroll.getScrollY();
                                    console.log("M:" + mouseX + "," + mouseY);
                                    var vm = ClientLib.Vis.VisMain.GetInstance();
                                    vm.CenterGridPosition(mouseX / _thisMap.zoomFactor, mouseY / _thisMap.zoomFactor);
                                    _thisMap.updateMap();
                                    setTimeout(function() {
                                        _thisMap.updateMap();
                                    }, 1000);
                                }, false);
                            }
                            this.updateMap();
                            //for (var x = 0; x < 1000; x++) {
                            //	for (var y = 0; y < 1000; y++) {
                            //		var obj = w.GetObjectFromPosition(x,y);
                            //		if (obj != null) {
                            //			ctx.fillRect(x,y,1,1);
                            //		}
                            //	}
                            // }
                            // vm = ClientLib.Vis.VisMain.GetInstance()
                            // vm.CenterGridPosition(535,142)
                            // vm.get_Region().get_PosY()/vm.get_Region().get_GridHeight()
                            // vm.get_Region().get_PosX()/vm.get_Region().get_GridWidth()
                        }, this);
                        // new qx.ui.basic.Label().set({
                        //		    value: "debugOutput",
                        //		    rich : true,
                        //		    selectable: true
                        //		  });
                        this.scroll = new qx.ui.container.Scroll().set({
                            width : 500,
                            height : 500
                        });
                        this.scroll.setMinWidth(10);
                        this.scroll.setMinHeight(10);
                        _thisMap = this;
                        this.mapBox.add(this.scroll);
                        var p = new qx.ui.core.Widget();
                        p.setMinHeight(3000);
                        p.setMinWidth(3000);
                        p.setHeight(3000);
                        p.setWidth(3000);
                        this.scroll.add(p);
                        p.getContentElement().add(this.mapWidget);
                        // select box for alliances
                        var selectBox = new qx.ui.form.SelectBox();
                        selectBox.addListener("changeSelection", function(e) {
                            if (e != null && e.getData() && e.getData().length > 0) {
                                this.visOptions.alliance = e.getData()[0].getModel(); // alliance ID or -1 for all
                                //console.log("Alliance selected: "+e.getData()[0] + " "+this.visOptions.alliance);
                                this.saveOptions();
                                this.updateMap();
                            }
                        }, this);
                        this.allianceSelect = selectBox;
                        // this.mapBox.add(selectBox);
                        
						//
                        // Select box for POI Type
                        //
                        selectBox = new qx.ui.form.SelectBox();
                        var currentSelection = this.visOptions.poi||-1;
                        var makePoiItem = function(model, name) {
                            var item = new qx.ui.form.ListItem(name, null, model);
                            selectBox.add(item);
                            if (currentSelection == model) {
                                selectBox.setSelection([item]);
                            }
                        }
                        makePoiItem( -1                                   ,"<< None >>"              );
                        makePoiItem(ClientLib.Base.EPOIType.AirBonus      ,"Aircraft GNT (Off Air)"  );
                        makePoiItem(ClientLib.Base.EPOIType.CrystalBonus  ,"Crystal CNH"             );
                        makePoiItem(ClientLib.Base.EPOIType.DefenseBonus  ,"Resonator NT (Def)"      );
                        makePoiItem(ClientLib.Base.EPOIType.InfanteryBonus,"Tungsten C (Off Inf)"    );
                        makePoiItem(ClientLib.Base.EPOIType.PowerBonus    ,"Reactor (Power Bonus)"   );
                        makePoiItem(ClientLib.Base.EPOIType.TiberiumBonus ,"Tiberium CN"             );
                        makePoiItem(ClientLib.Base.EPOIType.VehicleBonus  ,"Uranium C (Off Vehicles)");
						makePoiItem( -2                                   ,"<< All >>"               );
                        selectBox.addListener("changeSelection", function(e) {
                            if (e != null && e.getData() && e.getData().length > 0) {
                                this.visOptions.poi = e.getData()[0].getModel(); // POI ID or -1 for all
                                console.log("POI selected "+e.getData()[0].getModel());
                                this.saveOptions();
                                this.updateMap();
                            }
                        }, this);
                        this.poiSelect = selectBox;
						
						// Checkbox for alliance POIs
						checkbox = new qx.ui.form.CheckBox();
						checkbox.setValue(this.visOptions.showAlliancePois==true);
						checkbox.addListener("changeValue", function(e) {
							this.visOptions.showAlliancePois=e.getTarget().getValue();
							this.saveOptions();
							this.updateMap();
						},this);
						this.showAlliancePois = checkbox;
						
						// Checkbox for own bases
						checkbox = new qx.ui.form.CheckBox();
						checkbox.setValue(this.visOptions.showOwnCities==true);
						checkbox.addListener("changeValue", function(e) {
							this.visOptions.showOwnCities=e.getTarget().getValue();
							this.saveOptions();
							this.updateMap();
						},this);
						this.showOwnCities = checkbox;
						// Checkbox for showSectionFrame
						checkbox = new qx.ui.form.CheckBox();
						checkbox.setValue(this.visOptions.showSectionFrame==true);
						checkbox.addListener("changeValue", function(e) {
							this.visOptions.showSectionFrame=e.getTarget().getValue();
							this.saveOptions();
							this.updateMap();
						},this);
						this.showSectionFrame = checkbox;
						// Button "Settings"
                        var bt = new qx.ui.form.Button("Settings");
                        bt.set({
                            appearance : "button-text-small",
                            toolTipText : "Set filters for the map"
                        });
                        bt.addListener("click", function() {this.settingsWnd.open()}, this);
                        this.mapBox.getChildControl("captionbar").add(bt,{row:0,column:5}); // hack hack hack
                        
						//
                        // Settings dialog
                        //
                        this.settingsWnd = new qx.ui.window.Window("Map Settings");
                        this.settingsWnd.setPadding(10);
                        //this.mapBox.setLayout(new qx.ui.layout.Grow());
                        var layout = new qx.ui.layout.Grid();
                        layout.setSpacing(5);
                        layout.setColumnAlign(1,"left", "center");
                        layout.setColumnAlign(0,"left", "bottom");
                        this.settingsWnd.setLayout(layout);
                        this.settingsWnd.setShowMaximize(false);
                        this.settingsWnd.setShowMinimize(false);
                        this.settingsWnd.moveTo(300, 13);
                        this.settingsWnd.setHeight(580);
                        this.settingsWnd.setWidth(300);
                        this.settingsWnd.setMinWidth(10);
                        this.settingsWnd.setMinHeight(10);
                        var makeLbl = function(name) {
                            var lbl =  new qx.ui.basic.Label(name);
                            lbl.setTextColor("white");
                            return lbl;
                        }
                        var _thisMap = this;
                        var makeTxt = function(option) {
                            var value = _thisMap.visOptions.colors[option];
                            var txtField = new qx.ui.form.TextField(value);
                            txtField.setTextColor("white");
                            _thisMap.colorFields[option] = txtField;
                            return txtField;
                        }
                        this.settingsWnd.add(makeLbl("- Highlight -"), {row:0, column:0});
                        this.settingsWnd.add(makeLbl("Alliance:"), {row:1,column:0});
                        this.settingsWnd.add(this.allianceSelect, {row:1, column:1});
                        this.settingsWnd.add(makeLbl("POIs:"), {row:2, column:0});
                        this.settingsWnd.add(this.poiSelect, {row:2, column:1});
						this.settingsWnd.add(makeLbl("Alliance POIs:"), {row:3, column:0});
                        this.settingsWnd.add(this.showAlliancePois, {row:3, column:1});
						this.settingsWnd.add(makeLbl("Own Cities:"), {row:4, column:0});
                        this.settingsWnd.add(this.showOwnCities, {row:4, column:1});
						this.settingsWnd.add(makeLbl("Section Frame:"), {row:5, column:0});
                        this.settingsWnd.add(this.showSectionFrame, {row:5, column:1});
                        bt = makeLbl("- Colors -");
                        bt.set({
                            value: '<a href="http://www.w3schools.com/html/html_colornames.asp" target="_blank">- Colors -</a>',
                            rich : true,
                            selectable: true
                        });
                        this.settingsWnd.add(bt, {row:10, column:0});
                        // bt.addListener("click", function() { window.open("http://www.w3schools.com/html/html_colornames.asp") });
                        this.settingsWnd.add(makeLbl("Alliance Terrain:"), {row:11, column:0});
                        this.settingsWnd.add(makeTxt("allianceTerrainColor"), {row:11, column:1});
                        this.settingsWnd.add(makeLbl("Base:"), {row:12, column:0});
                        this.settingsWnd.add(makeTxt("baseColor"), {row:12, column:1});
                        this.settingsWnd.add(makeLbl("Camp:"), {row:13, column:0});
                        this.settingsWnd.add(makeTxt("campColor"), {row:13, column:1});
                        this.settingsWnd.add(makeLbl("City:"), {row:14, column:0});
                        this.settingsWnd.add(makeTxt("cityColor"), {row:14, column:1});
                        this.settingsWnd.add(makeLbl("Enemy:"), {row:15, column:0});
                        this.settingsWnd.add(makeTxt("enemyBaseColor"), {row:15, column:1});
                        this.settingsWnd.add(makeLbl("Outpost:"), {row:16, column:0});
                        this.settingsWnd.add(makeTxt("outpostColor"), {row:16, column:1});
                        this.settingsWnd.add(makeLbl("Own City:"), {row:17, column:0});
                        this.settingsWnd.add(makeTxt("ownBaseColor"), {row:17, column:1});
                        this.settingsWnd.add(makeLbl("POI:"), {row:18, column:0});
                        this.settingsWnd.add(makeTxt("poiColor"), {row:18, column:1});
                        this.settingsWnd.add(makeLbl("Tunnel:"), {row:19, column:0});
                        this.settingsWnd.add(makeTxt("tunnelColor"), {row:19, column:1});
                        var changeColor = new qx.ui.form.Button("Change");
                        changeColor.set({
                            appearance : "button-text-small",
                            toolTipText : "Save changes to colors"
                        });
                        this.settingsWnd.add(changeColor, {row:20, column:0});
                        changeColor.addListener("click", function() {
                            for (var option in this.visOptions.colors) {
                                if (this.colorFields[option]) {
                                    this.visOptions.colors[option] = this.colorFields[option].getValue();
                                }
                            }
                            this.saveOptions();
                            this.updateMap();
                        }, this);
                        this.settingsWnd.addListener("appear", function() {
                            this.updateFilter();
                        }, this);
                        //scroll.add(this.mapWidget);
                        // scroll.setBackgroundColor("#fff");
                        //var ele = scroll.getContainerElement();
                        //console.log("container scroll:" + ele);
                        //ele.getChild(0).add(this.mapWidget);
                        //
                        //this.mapBox.getApplicationRoot().set({
                        //				blockerColor: '#000000',
                        //				blockerOpacity: 0.6
                        //			});
                        // w.GetBaseOwner(x,y);
                        //var index=((y * this.m_WorldWidth) + x);
                        // return this.m_BaseOwner[index];
                        //
                        //var ruinPlayerID=this.GetWorldSectorByCoords$0(targetX, targetY).GetPlayerId$0(ruin.PlayerId);
                        //
                        // list players for (var i = 0; i < s.m_Players.c; i++) { var p = console.log(s.GetPlayer(i)); }
                        //
                        // for(i in s.m_Objects.d) { console.log(s.m_Objects.d[i].$type.m.n);}
                        // sample object:
                        //	{"Type":1,"SequenceId":3694,"isAttacked":false,"isLocked":false,"isProtected":false,"isAlerted":false,"hasCooldown":false,"Level":10,"Radius":2,"PlayerId":4,"ConditionBuildings":100,"ConditionDefense":100,"Id":76726,"Name":"Sepherian 1"}
                        // lientLib.Data.Cities.prototype.GetWorldSectorWithMostCities$0=function()
                        // >> w.GetOwner(534,139);
                        // >> w.GetObjectFromPosition
                        //w.GetObjectFromPosition(534,139)
                        // allianceId = 943 OtherAllianceId = 2049
                        // md.get_Alliance().GetAllianceRelationshipsByType(webfrontend.gui.alliance.DiplomacyPage.ERelationTypeEnemy,true)
                        //c=w.GetObjectFromPosition(524,145)
                        // s.GetPlayer(c.PlayerId)
                        //s.GetAlliance(p.Alliance) == OtherAllianceId
                    },
                    getSectors: function(w) {    // work around  obfuscated variable names
						if (this.obfSectorName == null) {
							// auto-detect sector name
							Outer:
							for (i in w) {			 
								if (w[i].d) {
									var maybeSector = w[i].d;
									for (j in maybeSector) {
									if (maybeSector[j].ConvertToWorldX) {
										this.obfSectorName = i;
										console.log("Sector field:" + i);
										break Outer;
									}
									break;
									}
								}
							}
						}
						if (this.obfSectorName == null) console.log("ERROR: getSectors(): obfuscated property not found!");
						if (this.obfSectorName != null)	return w[this.obfSectorName].d;
			
                        if (w.KIH) {  // old june version
                            return w.KIH.d;
                        } else if (w.RBJXOL) { // july
                            return w.RBJXOL.d;
                        }  else if(w.IWEESP) {
                            return w.IWEESP.d;  // closed beta 2 world
                        } else if (w.HYMYNV) {  // mid july release
                            return w.HYMYNV.d;
                        } else if (w.ONQEIH) {  // july 18th
                            return w.ONQEIH.d;
                        }
                    },
                    getAlliances: function(sector) {// work around  obfuscated variable names. sector == current sector
						if(typeof(sector)=="undefinied" || sector===null) {console.log("ERROR: getAlliances(sector): sector is not defined!");return null;}
						if (this.obfAllianceList == null) {					
							// find alliance list dynamically
							
							Outer:
							for (i in sector) {
								if (sector[i].d) {
									var maybeAllianceList = sector[i].d;
									for (j in maybeAllianceList) {
										var maybeAlliance=maybeAllianceList[j];										
										var propnames=[]; for (p in maybeAlliance) propnames.push(p); 
										var stringpropcount=0;
										var stringpropname=null;
										if(propnames.length==13) {
											for(k=0;k<propnames.length;k++){
												if(typeof(maybeAlliance[propnames[k]])=="string"){
													stringpropname=propnames[k];
													stringpropcount++;
												}
											}
											if(stringpropcount==1){
												this.obfAllianceId       = propnames[1];//assuming this is allways the case :-)
												this.obfAllianceName     = stringpropname;
												this.obfAllianceList     = i;
												console.log("Alliances field:" + i);
												break Outer;
											}											
										}
										break;// test only the first member
									}
								}
							}
						}
						if (this.obfAllianceList == null) {
						    console.log("ERROR: getAlliances(): obfuscated member not found!");
							return null;
						} else
						return sector[this.obfAllianceList].d;
/*                        if (sector.WGH) {// june
                            return sector.WGH.d;
                        } else if (sector.QEKQND) {//july
                            return sector.QEKQND.d;
                        } else if (sector.GGUPEV){  // closed beta 2 world
                            return sector.GGUPEV.d;
                        } else if(sector.UFVPYE) {
                            return sector.UFVPYE.d; // July 11, 2012
                        } else if(sector.UEQLAO) {
                            return sector.UEQLAO.d; // July 18th
                        } */
                    },
                    isEnemy : function(enemies, alliance, sector) {
                        if (alliance == null)
                            return false;
                        var enemy = enemies.l.filter(function(ele) {
                            return ele.OtherAllianceId == alliance.Id;
                        });
                        return enemy.length > 0;
                    },
                    listAllAlliances : function() {
                        var alliances = [];
                        var w = ClientLib.Data.MainData.GetInstance().get_World(); if(!w) console.log("ERROR: get_World() failed!");
                        var sectors = this.getSectors(w); if(!sectors) console.log("ERROR: getSectors() failed!");
                        for (var i in sectors) {  // m_sectors
                            var s = sectors[i];
                            var all = this.getAlliances(s); if(!all) console.log("ERROR: getAlliances() failed!");
                            for(var j in all) {  // m_alliances
                                var a = all[j];
                                alliances.push({id: a[this.obfAllianceId], name: a[this.obfAllianceName]});
                            }
                        }
                        alliances.sort(function(s1,s2) {
                            var name1 = s1.name.toLowerCase();
                            var name2 = s2.name.toLowerCase();
                            if (name1 < name2) return -1;
                            if (name1 > name2) return 1;
                            return 0;
                        });
                        var allianceMap = {};
                        alliances.forEach(function(it) {
                            allianceMap[it.id] = it;
                        });
                        return allianceMap;
                    },
                    updateFilter : function() {
                        var md = ClientLib.Data.MainData.GetInstance();
                        //var enemies = md.get_Alliance().GetAllianceRelationshipsByType(webfrontend.gui.alliance.DiplomacyPage.ERelationTypeEnemy, true);
                        this.allianceSelect.removeAll();
                        var alliances = this.listAllAlliances();  // quite expensive operation
                        var selected = new qx.ui.form.ListItem("<< None >>", null, -1);
                        this.allianceSelect.add(selected);
                        for (i in alliances) {
                            var a = alliances[i];
                            //enemies.l.forEach(function(it) {
                            var tempItem = new qx.ui.form.ListItem(a.name, null, a.id);
                            if (a.id == this.visOptions.alliance) {
                                selected = tempItem;
                            }
                            this.allianceSelect.add(tempItem);
                        }
                        this.allianceSelect.setSelection([selected]);
                    },
                    findAllianceById: function(s, id) {
                        var ra = null;
                        if (id != 0){
                            for (var x=1; s.GetAlliance(x) != null; x++){
                                var a = s.GetAlliance(x);
                                if (a.FGTNFZ == id)                                {
                                    ra = a;
                                }
                            }
                        }
                        return ra;
                    },
                    updateMap : function() {
                        // this.updateFilter(); - we assume that visOptions has all the visualisation options
                        var canvas = this.mapCanvas;
                        console.log("Canvas:" + canvas);
                        var ctx = canvas.getContext('2d');
                        var sc = this.zoomFactor;
                        var md = ClientLib.Data.MainData.GetInstance();
						var alliance = md.get_Alliance();
						//console.log(this.dump(alliance,"alliance",1,true));
                        var enemies = alliance.GetAllianceRelationshipsByType(webfrontend.gui.alliance.DiplomacyPage.ERelationTypeEnemy, true);
                        var w = md.get_World();
                        var vm = ClientLib.Vis.VisMain.GetInstance();
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.fillStyle = "rgb(200,0,0)";
                        var cx = 0;
                        var cy = 0;
                        var hilitePois = [];
                        var sectors = this.getSectors(w);
						
						if(!this.obfAllianceId) this.obfAllianceId=this.getMemberNameByType(alliance,"number",0);
						if(!this.obfAllianceName) this.obfAllianceName=this.getMemberNameByType(alliance,"string",0);
						
						var allianceName=alliance[this.obfAllianceName];
						//console.log("Alliance: "+allianceName);
						
						//console.log(this.dump(this.showAlliancePois,"chkbox",1,true));
						
						//ctx.fillStyle="#000000";
						//ctx.fillRect(0,0,3000,3000);
						
                        for (var i in sectors) {// m_Sectors = RBJXOL
                            var s = sectors[i];
//							console.log("Sector "+s.get_Id()+"\n"+ this.dump(s,"sector",2));
//							console.log("GetPlayer "+this.dump(s.GetPlayer(s.get_Id()),"*",1));
//							console.log("GetPlayerAllianceId "+this.dump(s.GetPlayerAllianceId(3128),"*",1));
//							console.log("findAllianceById "+this.dump(this.findAllianceById(s, 289),"*",1));
                            // console.log("Painting sector:" + s.m_Id);
                            for (var x = 0; x < 32; x++) {
                                for (var y = 0; y < 32; y++) {
                                    cx = s.ConvertToWorldX(x);
                                    cy = s.ConvertToWorldY(y);
                                    var obj = w.GetObjectFromPosition(cx, cy);
                                    if (obj != null) {
                                        // ctx.fillStyle = colors[obj.Type];
                                        switch (obj.Type) {
                                            case 1:  // player city
//												console.log("DEBUG player city at "+cx+","+cy+" "+obj.AUENVZ + "("+obj.LFQYDH+")");
//												console.log(this.dump(obj.OSKFZU.m,"obj",2,true));
                                                //var player = s.GetPlayer(obj.PlayerId); //NOT WORKING
												var player = s.GetPlayerId(obj); //NOT WORKING
												//var player = s.GetPlayer(obj.L);
//												console.log(this.dump(player,"player",1));
												if(!player) break; //
//												console.log("IEHUFP "+this.dump(s.GetPlayer(obj.IEHUFP),"player",1));
                                                //var alliance = s.GetAlliance(player.Alliance);
												var paid=s.GetPlayerAllianceId(obj.IEHUFP);
//												console.log("DEBUG GetPlayerAllianceId "+paid);
												var alliance = this.findAllianceById(s, paid);//TODO
                                                if (alliance != null && this.visOptions.alliance == alliance[obfAllianceId]) {
                                                    ctx.fillStyle = this.visOptions.colors.highlightColor;
                                                    ctx.fillRect(cx * sc, cy * sc, sc, sc);
                                                } else if (this.isEnemy(enemies, alliance, s)) {
                                                    // console.log("Enemy found" + obj);
                                                    ctx.fillStyle = this.visOptions.colors.enemyBaseColor;
                                                    ctx.fillRect(cx * sc, cy * sc, sc, sc);
                                                } else {
                                                    //if (w.GetTerritoryTypeByCoordinates(cx,cy) == ClientLib.Data.ETerritoryType.Own) { ctx.fillStyle = "rgb(255,255,255)"; }
                                                    // ClientLib.Data.MainData.GetInstance$9().get_BaseColors$0().GetMapAllianceColorType$0(this.get_AllianceId$1()));
                                                    if (obj.PlayerId && s.GetPlayer(obj.PlayerId).Id == md.get_Player().id) {
                                                        ctx.fillStyle = this.visOptions.colors.ownBaseColor;
                                                    } else {
                                                        ctx.fillStyle = this.visOptions.colors.cityColor;
                                                    }
                                                    ctx.fillRect(cx * sc, cy * sc, sc, sc);
                                                }
                                                break;
                                            case 2: // forgotten camp
                                                ctx.fillStyle = this.visOptions.colors.baseColor;
                                                ctx.fillRect(cx * sc, cy * sc, sc, sc);
                                                break;
                                            case 3: // Camp/Outpost
                                                ctx.fillStyle = (obj.CampType == 2) ? this.visOptions.colors.campColor : this.visOptions.colors.outpostColor;
                                                ctx.fillRect(cx * sc, cy * sc, sc, sc);
                                                break;
                                            case 4: // POI or tunnel
												/*
												Type:ClientLib.Data.WorldSector.WorldObjectPointOfInterest
												System.Int32 Id
												ClientLib.Data.WorldSector.WorldObjectPointOfInterest.EPOIType POIType
												System.Int32 Level
												System.Int64 OwnerAllianceId
												System.String OwnerAllianceName
												System.Void .ctor (ClientLib.Data.WorldSector.ObjectType type ,ClientLib.Data.World world ,System.String details ,System.Int32 pos)
												*/
												/*
												obj: {} -->
												obj.Type: 4
												obj.SequenceId: 6805
												obj.BNDYIS: 39
												obj.MYTWLL: 1
												obj.ADKRPM: 8527
												obj.YQTUPE: 123
												obj.HIFKIQ: "Alliance Name"
												obj.LSVKAD: {} -->
												*/
												//console.log("POI/Tunnel ("+cx+":"+cy+" POIType:"+obj[this.getNameByIdx(obj,3)]+"):\n"+this.dump(obj,"obj",1,true));
												if(!this.obfPOIType) {this.obfPOIType=this.getNameByIdx(obj,3);}
												if(!this.obfWorldObjectPointOfInterestAllianceName) {this.obfWorldObjectPointOfInterestAllianceName=this.getMemberNameByType(obj,"string",0);}
												if(!this.obfWorldObjectPointOfInterestAllianceId) {this.obfWorldObjectPointOfInterestAllianceId=this.getNameByIdx(obj,5);}
												
                                                if (obj[this.obfPOIType] == 0) {
													// Tunnel
                                                    ctx.fillStyle = this.visOptions.colors.tunnelColor;
                                                } else {
													// POI
                                                    ctx.fillStyle = this.visOptions.colors.poiColor;
													
													if(!this.visOptions.showAlliancePois) {
														if(this.visOptions.poi==-2){
															// Selected POI = << All >>
															hilitePois.push([cx,cy]);
														}else{														
															if (this.visOptions.poi && this.visOptions.poi == obj[this.obfPOIType] + 1) { 
																// for some reasons, the constants in ClientLib are off by 1
																hilitePois.push([cx,cy]);
															}
														}
													} else {
														if(this.visOptions.poi>=0){
															if (
																(this.visOptions.poi && this.visOptions.poi == obj[this.obfPOIType] + 1) &&
																(obj[this.obfWorldObjectPointOfInterestAllianceId]==this.visOptions.alliance)
															) { // for some reasons, the constants in ClientLib are off by 1
																hilitePois.push([cx,cy]);
															}
														}else if(this.visOptions.poi==-2){
															// Selected POI = << All >>
															if(obj[this.obfWorldObjectPointOfInterestAllianceId]==this.visOptions.alliance){
																hilitePois.push([cx,cy]);
															}
														}														
													}
                                                    
                                                }
                                                ctx.fillRect(cx * sc, cy * sc, sc, sc);
                                                break;
                                        }
                                    } else {
                                        var terr = w.GetTerritoryTypeByCoordinates(cx, cy);
                                        switch (terr) {
                                            case ClientLib.Data.ETerritoryType.Alliance: {
                                                ctx.fillStyle = this.visOptions.colors.allianceTerrainColor;
                                                ctx.fillRect(cx * sc, cy * sc, sc, sc);
                                                break;
                                            }
                                            case ClientLib.Data.ETerritoryType.Enemy: {
                                                if (w.GetOwner(cx, cy) != 1610612736) {
                                                    ctx.fillStyle = "rgba(80,10,10,0.5)";
                                                    ctx.fillRect(cx * sc, cy * sc, sc, sc);
                                                }
                                                break;
                                            }
                                            case ClientLib.Data.ETerritoryType.Neutral: {
                                                //ctx.fillStyle = "rgb(210,210,210)";
                                                //ctx.fillRect(cx,cy,1,1);
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
						
                        // paint home bases
						if(this.visOptions.showOwnCities){
							var ownCities = md.get_Cities().get_AllCities().d;
							for (var i in ownCities) {
								var city = ownCities[i];
								var x = city.get_PosX() * sc;
								var y = city.get_PosY() * sc;
								ctx.fillStyle = null;
								ctx.strokeStyle = "rgba(255,255,255,0.7)";
								ctx.beginPath();
								ctx.arc(x+sc/2,y+sc/2,sc,0*Math.PI,2*Math.PI);
								ctx.stroke();
								ctx.beginPath();
								ctx.strokeStyle = "rgba(255,255,255,0.3)";
								ctx.arc(x+sc/2,y+sc/2,sc*20,0*Math.PI,2*Math.PI);
								ctx.stroke();
							}
						}
						
                        // paint hilited pois
                        ctx.strokeStyle = "rgb(255,255,255)";
                        hilitePois.forEach(function(poi) {
                           ctx.strokeRect(poi[0] * sc - 2, poi[1] * sc - 2, sc+4, sc+4);
                        });
                        // m_Region == get_Region()
                        var topX = Math.floor(vm.get_Region().get_PosX() / vm.get_Region().get_GridWidth());
                        var topY = Math.floor(vm.get_Region().get_PosY() / vm.get_Region().get_GridHeight());
                        var width = vm.get_Region().get_ViewWidth() / vm.get_Region().get_ZoomFactor() / vm.get_Region().get_GridWidth();
                        var height = vm.get_Region().get_ViewHeight() / vm.get_Region().get_ZoomFactor() / vm.get_Region().get_GridHeight();
                        ctx.strokeStyle = "rgb(200,200,200)";
                        ctx.lineWidth = 1;
                        console.log("Selection:" + topX + "," + topY + "w:" + width + "," + height);
						
						if(this.visOptions.showSectionFrame){
							ctx.strokeRect(topX * sc, topY * sc, width * sc, height * sc);
						}
                        if (topX * sc < this.scroll.getScrollX() || topX * sc > this.scroll.getScrollX() + this.scroll.getWidth()) {
                            this.scroll.scrollToX(Math.max(0, topX * sc - 100));
                        }
                        if (topY * sc < this.scroll.getScrollY() || topY * sc > this.scroll.getScrollY() + this.scroll.getHeight()) {
                            this.scroll.scrollToY(Math.max(0, topY * sc - 100));
                        }
                    },
                    getMousePos : function(canvas, evt) {
                        // get canvas position
                        var obj = canvas;
                        var top = 0;
                        var left = 0;
                        while (obj && obj.tagName != 'BODY') {
                            top += obj.offsetTop;
                            left += obj.offsetLeft;
                            obj = obj.offsetParent;
                        }
                        // return relative mouse position
                        var mouseX = evt.clientX - left + window.pageXOffset;
                        var mouseY = evt.clientY - top + window.pageYOffset;
                        return {
                            x : mouseX,
                            y : mouseY
                        };
                    },
                    saveOptions : function() {
                        if (localStorage) {
                            localStorage["TAMap.visOptions"] = JSON.stringify(this.visOptions);
                        }
                    },
                    showMap : function() {
                        console.log("Show map");
                        this.mapBox.open();
                        var debugOutput = "";
                        var mainData = ClientLib.Data.MainData.GetInstance();
                        var player_cities = mainData.get_Cities();
                        var current_city = player_cities.get_CurrentOwnCity();
                        //var sector = mainData.get_World().GetWorldSectorByCoords(current_city.get_PosX(), current_city.get_PosY());
                        //for (i in sector.m_Objects.d) {
                        //	debugOutput += JSON.stringify(sector.m_Objects.d[i]) + "<br>";
                        //}
                        //console.log(debugOutput);
                        // this.mapWidget.setValue(debugOutput);
                        //var canvas = this.mapWidget.getDomElement();
                        //console.log("Canvas:" + canvas);
                        //var ctx = canvas.getContext('2d');
                        //console.log(ctx);
                        //ctx.fillStyle = "rgb(200,0,0)";
                        //ctx.fillRect (10, 10, 55, 50);
                    },
					getNameByIdx: function (object, idx){
						var i=0;
						for(var n in object) {
							if(i==idx) return n;
							i++;
						}
						return null;
					},
					getMemberNameByType: function (object, type, idx){
						var i=0;
						for(var n in object) {
							var valueType = typeof(object[n]);
							//console.log(n+" "+valueType);
							if(type==valueType) {
								if(i==idx) return n;
								i++;
							}							
						}
						return null;
					},
					dump: function (object,rootName,deep,includeFunction) {
						//console.log("dump "+rootName);
						var dumpInternal=function(obj, path) {
							//console.log("DEBUG: dumpInternal(obj, "+path+") ind:"+ind+", deep:"+deep+", output.length:"+s.length);
							if(obj===null) {
								s += "" + path +": {null}" + "\n";
								return;
							} else if(obj===undefined){
								s += "" + path +": {undefined}" + "\n";
								return;
							}
							var valueType = typeof(obj);
							switch (valueType) {
								case "function": 
									return;
									// try{var fr=obj();}catch(ex){var  fr=ex;}
									// s+= "" + path +": "+ "{function} returns: "+fr + "\n";return;
								case "object"  : s+= "" + path +": {} -->" /*+ propValue.toString().substr(0,20)*/ + "\n";break;
								case "boolean" : s+= "" + path +": "+ obj.toString() + "\n";return;
								case "number"  : s+= "" + path +": "+ obj.toString() + "\n";return;
								case "string"  : s+= "" + path +": \""+ obj.toString() + "\"\n";return;
								default:s += "" + path +" ("+ valueType +"): "+ obj.toString() + "\n";return;
							}						
							
							for (var o in objs) {
								if(o===obj) {
									s+= "{!Recursion stoped!}\n";
									return;
								} else objs.push(obj);
							}
							var members=[];for (var p in obj) members.push(p);
							if(members.length>1000) {console.log("WARNING: dump() Too much members! "+members.length); return;} //TODO
							if(deep>0 && ind>=deep) return;
							if(/.GHPRYH$/.test()) return; //TODO
							if(path.length>30) {console.log("WARNING: dump() Path too long!"); return;} //TODO
							ind++;
							for (var propName in obj) {dumpInternal(obj[propName], path+"."+propName);}
							ind--;
						}
						var objs = [];
						var ind = 0;
						var s = "";
						if(typeof(rootName)=='undefined')rootName="*";
						if(typeof(deep)=='undefined')deep=1;
						if(typeof(includeFunction)=='undefined')includeFunction=false;
						try{dumpInternal(object,rootName);}catch(ex){console.log("ERROR: dump() > "+ex);}
						return s;
					}
                }
            });
        }
        function TAMap_checkIfLoaded() {
            try {
                if ( typeof qx != 'undefined' && typeof Addons != 'undefined') {
                    var a = qx.core.Init.getApplication();
                    // application
                    var mb = qx.core.Init.getApplication().getMenuBar();
                    var addonmenu = Addons.AddonMainMenu.getInstance();
                    if (a && mb && addonmenu) {
                        createMapTweak();
                        window.TAMap.main.getInstance().initialize();
                    } else
                        window.setTimeout(TAMap_checkIfLoaded, 1000);
                } else {
                    window.setTimeout(TAMap_checkIfLoaded, 1000);
                }
            } catch (e) {
                if ( typeof console != 'undefined')
                    console.log(e);
                else if (window.opera)
                    opera.postError(e);
                else
                    GM_log(e);
            }
        }
        if (/commandandconquer\.com/i.test(document.domain)) {
            window.setTimeout(TAMap_checkIfLoaded, 1000);
        }
    }
    // injecting, because there seem to be problems when creating game interface with unsafeWindow
    var TAMapScript = document.createElement("script");
    var txt = TAMap_mainFunction.toString();
    TAMapScript.innerHTML = "(" + txt + ")();";
    TAMapScript.type = "text/javascript";
    if (/commandandconquer\.com/i.test(document.domain)) {
        document.getElementsByTagName("head")[0].appendChild(TAMapScript);
    }
})();

/***********************************************************************************
Tiberium Alliances Info - Updated Layout ***** Version 1.0.4
***********************************************************************************/
// ==UserScript==
// @include        https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// ==/UserScript==
(function () {
  var TAI_main = function () {
    function createInstance() {
      qx.Class.define("TAI", { //TAS.main
        type : "singleton",
        extend : qx.core.Object,
        members : {
          initialize : function () {
            addEventListener("keyup", this.onKey, false);
            console.log("TA Info loaded.");
          },
          onKey : function (ev) {
            var s = String.fromCharCode(ev.keyCode);
            var inputField = document.querySelector('input:focus, textarea:focus');
            if (inputField != null) {
              // ALT+
              if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey && s == "Y") {
                // player bases info to share with others

                var apc = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;//all player cities
                var txt = "", c, unitData, bh, supp, type, df;
                for (var key in apc) {
                  c = apc[key];
                  txt += "Def: [b]" + ('0' + c.get_LvlDefense().toFixed(2)).slice(-5) + "[/b] ";
                  txt += "Off: [b]" + ('0' + c.get_LvlOffense().toFixed(2)).slice(-5) + "[/b] ";
                  unitData = c.get_CityBuildingsData();
                  bh = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Construction_Yard);
                  df = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Defense_Facility);
                  supp = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Ion);
                  if (supp === null)
                    supp = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Art);
                  if (supp === null)
                    supp = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Air);
                  if (bh !== null) {
                    txt += "CY: [b]" + bh.get_CurrentLevel() + "[/b] ";
                    //txt += "[u]BaseRep:[/u] [b]" + (c.get_CityBuildingsData().GetFullRepairTime() / 3600).toFixed(2) + "h[/b] ";
                    //txt += "[u]DefRep:[/u] [b]" + (c.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Defense) / 3600).toFixed(2) + "h[/b] ";
                  }
                  if (df !== null) {
                    txt += "DF: [b]" + df.get_CurrentLevel() + "[/b] ";
                  }
                    else {
                        txt += "DF: [b]NA[/b] ";
                    }
                  if (supp !== null) {
                    txt += "" + supp.get_TechGameData_Obj().dn.slice(0, 3) + ": [b]" + supp.get_CurrentLevel() + "[/b] ";
                  }
                    else {
                        txt += "SUP: [b]NA[/b] ";
                    }
                  txt += "--" + "[b][coords]"+ c.get_PosX() + ":" + c.get_PosY() + ":" + c.get_Name() + "[/b][/coords]";
                  txt += "[hr]";
                }
                inputField.value += txt;
              } else if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey && s == "N") {
                var bases = ClientLib.Data.MainData.GetInstance().get_AllianceSupportState().get_Bases().d;
                var base, keys = Object.keys(bases), len = keys.length, info = {}, avg = 0, high = 0, supBaseCount = len;
                while (len--) {
                  base = bases[keys[len]];
                  if (!info.hasOwnProperty(base.get_Type())) {
                    info[base.get_Type()] = 0;
                  }
                  info[base.get_Type()]++;
                  if (base.get_Level() >= 30)
                    high++;
                  avg += base.get_Level();
                }
                avg /= supBaseCount;
                var members = ClientLib.Data.MainData.GetInstance().get_Alliance().get_MemberData().d, member, baseCount = 0;
                keys = Object.keys(members);
                len = keys.length;
                while (len--) {
                  member = members[keys[len]];
                  baseCount += member.Bases;
                }
                inputField.value += "Bases: " + baseCount + " SupCount: " + supBaseCount + "(" + (supBaseCount / baseCount * 100).toFixed(0) + "%) Avg: " + avg.toFixed(2) + " 30+: " + high + "(" + (high / baseCount * 100).toFixed(0) + "%)";
                //for (var i in info)
                //  console.log("Type: " + i + " Count: " + info[i]);
              }
            }
          }
        } // members
      });
    }

    // Loading
    function TAI_checkIfLoaded() {
      try {
        if (typeof qx != 'undefined') {
          if (qx.core.Init.getApplication().getMenuBar() !== null) {
            createInstance();
            TAI.getInstance().initialize();
          } else setTimeout(TAI_checkIfLoaded, 1000);
        } else {
          setTimeout(TAI_checkIfLoaded, 1000);
        }
      } catch (e) {
        if (typeof console != 'undefined') {
          console.log(e);
        } else if (window.opera) {
          opera.postError(e);
        } else {
          GM_log(e);
        }
      }
    }

    if (/commandandconquer\.com/i.test(document.domain)) {
      setTimeout(TAI_checkIfLoaded, 1000);
    }
  };
  // injecting, because there seem to be problems when creating game interface with unsafeWindow
  var TAIScript = document.createElement("script");
  var txt = TAI_main.toString();
  TAIScript.innerHTML = "(" + txt + ")();";
  TAIScript.type = "text/javascript";
  if (/commandandconquer\.com/i.test(document.domain)) {
    document.getElementsByTagName("head")[0].appendChild(TAIScript);
  }
})();

/***********************************************************************************
C&C: Tiberium Alliances Map
***********************************************************************************/
// ==UserScript==
// @name        Command & Conquer TA World Map
// @description Creates a detailed map of bases and pois of the alliance and enemies.
// @namespace   https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version     1.0.0
// @grant none
// @author zdoom
// @updateURL https://userscripts.org/scripts/source/173330.meta.js
// @downloadURL https://userscripts.org/scripts/source/173330.user.js
// ==/UserScript==

(function () {

    var injectScript = function () {
        function create_ccta_map_class() {
            qx.Class.define("ccta_map",
			{
			    type: "singleton", extend: qx.core.Object, construct: function () {
			        try {
			            var root = this;

			            var addonmenu = Addons.AddonMainMenu.getInstance();
			            addonmenu.AddMainMenu("TA World Map", function () {
			                root.getData();
			                ccta_map.container.getInstance().open(1);
			            }, "ALT+W");
			            /*
						var mapButton = new qx.ui.form.Button('Map').set({ enabled: false });
						var app = qx.core.Init.getApplication();
						var optionsBar = app.getOptionsBar().getLayoutParent();
						this.__mapButton = mapButton;
						
						optionsBar.getChildren()[0].getChildren()[2].addAt(mapButton,1);
						*/

			            var onReady = function () {
			                console.log('checking if data is ready');
			                var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance().get_Relationships;
			                var world = ClientLib.Data.MainData.GetInstance().get_World();
			                var endGame = ClientLib.Data.MainData.GetInstance().get_EndGame().get_Hubs().d;
			                var command = ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand;
			                var delegate = phe.cnc.Util.createEventDelegate;

			                if (!!alliance && !!world && !!command && !!delegate && !!endGame) {
			                    var worldWidth = world.get_WorldWidth();
			                    if (!worldWidth) return;

//* Was 500 Marks Center of bases
			                    var factor = 650 / worldWidth;
			                    var hubs = [], fortress = [];

			                    for (var index in endGame) {
			                        var currentHub = endGame[index];
			                        if (currentHub.get_Type() == 1) hubs.push([(currentHub.get_X() + 2) * factor, (currentHub.get_Y() + 2) * factor]);
			                        if (currentHub.get_Type() == 3) fortress = [(currentHub.get_X() + 2) * factor, (currentHub.get_Y() + 2) * factor];
			                    }

			                    if (hubs.length > 0) {
			                        timer.stop();
			                        root.__factor = factor;
			                        root.__endGame['hubs'] = hubs;
			                        root.__endGame['fortress'] = fortress;
			                        root.__init();
			                    }
			                    console.log(hubs);
			                }
			                console.log(!!alliance, !!world, !!command, !!delegate, !!endGame);
			            };

			            var timer = new qx.event.Timer(1000);
			            timer.addListener('interval', onReady, this);
			            timer.start();
			        }
			        catch (e) {
			            console.log(e.toString());
			        }
			        console.log('ccta_map initialization completed');
			    },
			    destruct: function () { },
			    members:
				{
				    __mapButton: null,
				    __allianceExist: null,
				    __allianceName: null,
				    __allianceId: null,
				    __allianceHasRelations: false,
				    __defaultAlliances: null,
				    __selectedAlliances: null,
				    __data: null,
				    __totalProcesses: null,
				    __completedProcesses: 0,
				    __endGame: {},
				    __isLoading: false,
				    __factor: null,

				    __init: function () {
				        try {
				            var root = this;
				            var data = ClientLib.Data.MainData.GetInstance();
				            var alliance_data = data.get_Alliance();
				            var alliance_exists = alliance_data.get_Exists();

				            if (alliance_exists) {
				                var alliance_name = alliance_data.get_Name();
				                var alliance_id = alliance_data.get_Id();
				                var alliance_relations = alliance_data.get_Relationships();

				                this.__allianceExist = true;
				                this.__allianceId = alliance_id;
				                this.__allianceName = alliance_name;


				                var selectedAlliancesList = [];
				                selectedAlliancesList[0] = [alliance_id, 'alliance', alliance_name, 0];

				                if (alliance_relations != null) {
				                    this.__allianceHasRelations = true;
				                    alliance_relations.map(function (x) {
				                        var type = x.Relationship, id = x.OtherAllianceId, name = x.OtherAllianceName;
				                        if ((type == 3) && (selectedAlliancesList.length < 100)) selectedAlliancesList.push([id, 'enemy', name, 0]);
				                    });
				                }
				                this.__defaultAlliances = selectedAlliancesList;
				            }
				            else {
				                this.__allianceExist = false;
				            }

				            if (typeof (Storage) !== 'undefined' && typeof (localStorage.ccta_map_settings) !== 'undefined') {
				                this.__selectedAlliances = JSON.parse(localStorage.ccta_map_settings);
				            }

				            this.__mapButton.setEnabled(true);
				            this.__mapButton.addListener('execute', function () {
				                root.getData();
				                ccta_map.container.getInstance().open(1);
				            }, this);
				        }
				        catch (e) {
				            console.log(e.toString());
				        }
				    },

				    getData: function () {
				        if (this.__isLoading === true) return;
				        this.__isLoading = true;
				        var arr = (this.__selectedAlliances == null) ? this.__defaultAlliances : this.__selectedAlliances;

				        if (arr != null) {
				            this.__data = [];
				            this.__totalProcesses = arr.length;
				            for (var i = 0; i < arr.length; i++) {
				                this.__getAlliance(arr[i][0], arr[i][1], arr[i][3]);
				            }
				        }
				    },

				    __getAlliance: function (aid, type, color) {
				        try {
				            var alliance = {}, root = this, factor = this.__factor;
				            alliance.id = aid;
				            alliance.players = {};
				            var totalProcesses = this.__totalProcesses;

				            var getBases = function (pid, pn, p, tp) {
				                ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("GetPublicPlayerInfo", { id: pid },
								phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, function (context, data) {
								    if (data.c != null) {
								        var totalBases = data.c.length;
								        var player = {};
								        var bases = [];

								        for (var b = 0; b < data.c.length; b++) {
								            var id = data.c[b].i;
								            var name = data.c[b].n;
								            var x = data.c[b].x * factor;
								            var y = data.c[b].y * factor;
								            bases.push([x, y, name, id]);
								            if ((p == tp - 1) && (b == totalBases - 1)) {
								                root.__completedProcesses++;
								                var loader = ccta_map.container.getInstance().loader;
								                loader.setValue('Loading: ' + root.__completedProcesses + "/" + totalProcesses);
								            }
								            if (root.__completedProcesses == totalProcesses) root.__onProcessComplete();
								        }
								        player.id = pid;
								        player.name = pn;
								        player.bases = bases;
								        alliance.players[pn] = player;
								    }
								}), null);
				            };

				            ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("GetPublicAllianceInfo", { id: aid },
							phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, function (context, data) {
							    if (data == null) return;
							    if (data.opois != null) {
							        var pois = [];
							        data.opois.map(function (poi) {
							            pois.push({ 'i': poi.i, 'l': poi.l, 't': poi.t, 'x': poi.x * factor, 'y': poi.y * factor });
							        });
							        alliance.pois = pois;
							    }
							    if (data.n != null) alliance.name = data.n;
							    if (data.m != null) {

							        for (var p = 0; p < data.m.length; p++) {
							            var playerName = data.m[p].n;
							            var playerId = data.m[p].i;
							            getBases(playerId, playerName, p, data.m.length);
							        }
							        root.__data.push([alliance, type, color]);
							    }
							}), null);
				        }
				        catch (e) {
				            console.log(e.toString());
				        }
				    },

				    __onProcessComplete: function () {
				        console.log('process completed - alliances data has been generated', this.__data);
				        this.__isLoading = false;
				        var win = ccta_map.container.getInstance();
				        win.receivedData = this.__data;
				        win.__updateList();
				        win.drawCanvas();
				        win.loader.setValue('Completed');
				        this.__totalProcess = null;
				        this.__completedProcesses = 0;
				        setTimeout(function () {
				            win.loader.setValue('');
				        }, 3000);
				    }

				}

			});
//*The Following is the on Screen Map Container object
            qx.Class.define("ccta_map.container",
			{
			    type: "singleton",
			    extend: qx.ui.container.Composite,

			    construct: function () {
			        try {
			            this.base(arguments);
			            var layout = new qx.ui.layout.Canvas();
			            this._setLayout(layout);

			            var worldWidth = ClientLib.Data.MainData.GetInstance().get_World().get_WorldWidth();
//* This Factor Value sets center of map so when you hover over a radar object it displays its info changed from 500
			            var factor = 650 / worldWidth;
			            this.__factor = factor;

			            var zoomIn = new qx.ui.form.Button('+').set({ width: 30 });
			            var zoomOut = new qx.ui.form.Button('-').set({ width: 30, enabled: false });
			            var zoomReset = new qx.ui.form.Button('R').set({ width: 30, enabled: false });
			            var grid = new qx.ui.container.Composite(new qx.ui.layout.Grid(3, 1));
			            var info = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({ minHeight: 300, padding: 10 });
			            var canvasContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
			            var rightBar = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
			            var leftBar = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
//*Widget is the overall box the radar sits in
			            var widget = new qx.ui.core.Widget().set({ width: 675, height: 675 });
			            var div = new qx.html.Element('div', null, { id: 'canvasContainer' });


			            var li1 = new qx.ui.form.ListItem('All', null, "all");
			            var li2 = new qx.ui.form.ListItem('My Bases', null, "bases");
			            var li3 = new qx.ui.form.ListItem('My Alliance', null, "alliance");
			            var li4 = new qx.ui.form.ListItem('Selected', null, "selected");
			            var displayMode = new qx.ui.form.SelectBox().set({ height: 28 });
			            displayMode.add(li1);
			            displayMode.add(li2);
			            displayMode.add(li3);
			            displayMode.add(li4);

			            var zoomBar = new qx.ui.container.Composite(new qx.ui.layout.HBox(15));

			            var bothOpt = new qx.ui.form.RadioButton('Both').set({ model: "both" });
			            var basesOpt = new qx.ui.form.RadioButton('Base').set({ model: "bases" });;
			            var poisOpt = new qx.ui.form.RadioButton('Poi').set({ model: "pois" });
			            var displayOptions = new qx.ui.form.RadioButtonGroup().set({ layout: new qx.ui.layout.HBox(), font: 'font_size_11' });
			            displayOptions.add(bothOpt);
			            displayOptions.add(basesOpt);
			            displayOptions.add(poisOpt);
//*AllianceList is the listbox for alliances user has chosen
			            var allianceList = new qx.ui.form.List().set({ font: 'font_size_11', height: 390 });
			            var editAlliance = new qx.ui.form.Button('Edit Alliances');
			            editAlliance.setToolTipText("Edit the list of alliances to show in radar.");
			            var fullReset = new qx.ui.form.Button('Full Data Reset');
			            fullReset.setToolTipText("Resets alliance data and scan.  Usefull when scan hangs!");
			            var label = new qx.ui.basic.Label('Transparency');
			            var slider = new qx.ui.form.Slider().set({ minimum: 30, maximum: 100, value: 100 });
			            var coordsField = new qx.ui.form.TextField().set({ maxWidth: 100, textAlign: 'center', readOnly: 'true', alignX: 'center' });
//*Margin Top sets the height position of the status indicator
			            var loader = new qx.ui.basic.Label().set({ marginTop: 270 });

			            grid.set({ minWidth: 780, backgroundColor: '#8e979b', minHeight: 524, margin: 3, paddingTop: 10 });
			            rightBar.set({ maxWidth: 130, minWidth: 130, paddingTop: 30, paddingRight: 10 });
			            leftBar.set({ maxWidth: 130, minWidth: 130, paddingTop: 30, paddingLeft: 10 });

			            var hints = [[zoomIn, 'Zoom in'], [zoomOut, 'Zoom out'], [zoomReset, 'Reset zoom'], [basesOpt, 'Show bases only'], [poisOpt, 'Show POIs only'], [bothOpt, 'Show bases and POIs']]
			            for (var i = 0; i < hints.length; i++) {
			                var tooltip = new qx.ui.tooltip.ToolTip(hints[i][1]);
			                hints[i][0].setToolTip(tooltip);
			            }

			            zoomBar.add(zoomIn);
			            zoomBar.add(zoomOut);
			            zoomBar.add(zoomReset);

			            rightBar.add(zoomBar);
			            rightBar.add(displayMode);
			            rightBar.add(displayOptions);
			            rightBar.add(allianceList);
			            rightBar.add(editAlliance);
			            rightBar.add(fullReset);
			            rightBar.add(label);
			            rightBar.add(slider);

			            leftBar.add(coordsField);
			            leftBar.add(info);
			            leftBar.add(loader);

			            canvasContainer.add(widget);
			            widget.getContentElement().add(div);
			            grid.add(leftBar, { row: 1, column: 1 });
			            grid.add(rightBar, { row: 1, column: 3 });
			            grid.add(canvasContainer, { row: 1, column: 2 });

			            this.info = info;
			            this.coordsField = coordsField;
			            this.allianceList = allianceList;
			            this.panel = [zoomOut, zoomReset, zoomIn, displayOptions, displayMode, allianceList, editAlliance];
			            this.loader = loader;
			            this.zoomIn = zoomIn;
			            this.zoomOut = zoomOut;
			            this.zoomReset = zoomReset;

			            //canvas
			            var cont = document.createElement('div'),
							mask = document.createElement('div'),
							canvas = document.createElement('canvas'),
							ctx = canvas.getContext("2d"),
							root = this;
//*This is the size of the
			            cont.style.width = '650px';
			            cont.style.height = '650px';
			            cont.style.position = 'absolute';
			            cont.style.overflow = 'hidden';
			            cont.style.backgroundColor = '#0b2833';

			            canvas.style.position = 'absolute';
			            canvas.style.backgroundColor = '#0b2833';
//*This is the size of the radar mask
			            mask.style.position = 'absolute';
			            mask.style.width = '650px';
			            mask.style.height = '650px';
			            mask.style.background = 'url("http://i645.photobucket.com/albums/uu175/SparkyDClown/CNC/map_mask_zpsa7085cdd.png") center center no-repeat';
//*Original Line			            mask.style.background = 'url("http://archeikhmeri.co.uk/images/map_mask.png") center center no-repeat';

			            this.canvas = canvas;
			            this.mask = mask;
			            this.ctx = ctx;

			            var __zoomIn = function () { if (root.scale < 12) root.__scaleMap('up') };
			            var __zoomOut = function () { if (root.scale > 1) root.__scaleMap('down') };
			            var __zoomReset = function () {
//*Canvas is the radar itself
			                canvas.width = 650;
			                canvas.height = 650;
			                canvas.style.left = 0;
			                canvas.style.top = 0;
			                root.scale = 1;
			                root.drawCanvas();
			                zoomIn.setEnabled(true);
			                zoomOut.setEnabled(false);
			                zoomReset.setEnabled(false);
			            };
			            var __fullReset = function () {
			                var tamap = ccta_map.getInstance();
			                tamap.__isLoading = false;
			                var resetme = ccta_map.options.getInstance();
			                var win = ccta_map.container.getInstance();
			                win.receivedData = tamap.__data;
			                win.drawCanvas();
			                win.loader.setValue('Completed');
			                tamap.__totalProcess = null;
			                tamap.__completedProcesses = 0;
			                resetme.__setDefaults();
			                resetme.__saveSettings();
			                resetme.__applyChanges();
			                tamap = null;
			                win = null;
			                resetme = null;
			            };
			            

			            cont.appendChild(canvas);
			            cont.appendChild(mask);
			            root.__draggable(mask);
			            root.resetMap();

			            slider.addListener('changeValue', function (e) {
			                if (e.getData()) {
			                    var val = e.getData() / 100;
			                    this.setOpacity(val);
			                    slider.setToolTipText(" " + val * 100 + "% ");
			                }
			            }, this);

			            allianceList.addListener('changeSelection', function (e) {
			                if ((root.__displayM == "bases") || (root.__displayM == "alliance") || !e.getData()[0]) return;
			                var aid = e.getData()[0].getModel();
			                root.__selectedA = aid;
			                root.drawCanvas();
			            }, this);

			            displayMode.addListener('changeSelection', function (e) {
			                var dm = e.getData()[0].getModel();
			                root.__displayM = dm;
			                root.__updateList();

			                if (dm == "bases") {
			                    displayOptions.setSelection([basesOpt]);
			                    poisOpt.setEnabled(false);
			                    bothOpt.setEnabled(false);
			                    root.__displayO = "bases";
			                }
			                else {
			                    if (!poisOpt.isEnabled()) poisOpt.setEnabled(true);
			                    if (!bothOpt.isEnabled()) bothOpt.setEnabled(true);
			                    displayOptions.setSelection([bothOpt]);
			                    root.__displayO = "both";
			                }
			                root.drawCanvas();
			            }, this);

			            displayOptions.addListener('changeSelection', function (e) {
			                if (!e.getData()[0]) return;
			                var dop = e.getData()[0].getModel();
			                root.__displayO = dop;
			                root.drawCanvas();
			            }, this);

			            editAlliance.addListener('execute', function () {
			                ccta_map.options.getInstance().open();
			            }, this);

			            fullReset.addListener('execute', __fullReset, this);

			            var desktop = qx.core.Init.getApplication().getDesktop();
			            desktop.addListener('resize', this._onResize, this);

			            zoomIn.addListener('execute', __zoomIn, this);
			            zoomOut.addListener('execute', __zoomOut, this);
			            zoomReset.addListener('execute', __zoomReset, this);

			            this.add(grid);

			            this.wdgAnchor = new qx.ui.basic.Image("webfrontend/ui/common/frame_basewin/frame_basewindow_tl1.png").set({ width: 3, height: 32 });
			            this.__imgTopRightCorner = new qx.ui.basic.Image("webfrontend/ui/common/frame_basewin/frame_basewindow_tr.png").set({ width: 34, height: 35 });
			            this._add(this.__imgTopRightCorner, { right: 0, top: 0, bottom: 28 });
			            this._add(new qx.ui.basic.Image("webfrontend/ui/common/frame_basewin/frame_basewindow_r.png").set({ width: 3, height: 1, allowGrowY: true, scale: true }), { right: 0, top: 35, bottom: 29 });
			            this._add(new qx.ui.basic.Image("webfrontend/ui/common/frame_basewin/frame_basewindow_br.png").set({ width: 5, height: 28, allowGrowY: true, scale: true }), { right: 0, bottom: 0 });
			            this._add(new qx.ui.basic.Image("webfrontend/ui/common/frame_basewin/frame_basewindow_b.png").set({ width: 1, height: 3, allowGrowX: true, scale: true }), { right: 5, bottom: 0, left: 5 });
			            this._add(new qx.ui.basic.Image("webfrontend/ui/common/frame_basewin/frame_basewindow_bl.png").set({ width: 5, height: 29 }), { left: 0, bottom: 0 });
			            this._add(new qx.ui.basic.Image("webfrontend/ui/common/frame_basewin/frame_basewindow_l.png").set({ width: 3, height: 1, allowGrowY: true, scale: true }), { left: 0, bottom: 29, top: 32 });
			            this._add(this.wdgAnchor, { left: 0, top: 0 });
			            this._add(new qx.ui.basic.Image("webfrontend/ui/common/frame_basewin/frame_basewindow_tl2.png").set({ width: 25, height: 5 }), { left: 3, top: 0 });
			            this._add(new qx.ui.basic.Image("webfrontend/ui/common/frame_basewin/frame_basewindow_t.png").set({ width: 1, height: 3, allowGrowX: true, scale: true }), { left: 28, right: 34, top: 0 });

			            this.__btnClose = new webfrontend.ui.SoundButton(null, "FactionUI/icons/icon_close_button.png").set({ appearance: "button-close", width: 23, height: 23, toolTipText: this.tr("tnf:close base view") });
			            this.__btnClose.addListener("execute", this._onClose, this);
			            this._add(this.__btnClose, { top: 6, right: 5 });

			            var onLoaded = function () {
			                var counter = 0;
			                var check = function () {
			                    if (counter > 60) return;
			                    var htmlDiv = document.getElementById('canvasContainer');
			                    (htmlDiv) ? htmlDiv.appendChild(cont) : setTimeout(check, 1000);
			                    console.log('retrying check for canvasContainer is loaded');
			                    counter++;
			                };
			                check();
			            };
			            onLoaded();

			        }
			        catch (e) {
			            console.log(e.toString());
			        }
			        console.log('container creation completed');
			    },
			    destruct: function () { },
			    members:
				{
				    info: null,
				    coordsField: null,
				    panel: null,
				    loader: null,
				    canvas: null,
				    mask: null,
				    ctx: null,
				    receivedData: null,
				    allianceList: null,
//*Original vals 53, 85, 113, 145, 242
				    circles: [71, 112, 150, 198, 315],
				    scale: 1,
				    selectedBase: false,
				    elements: [],
				    locations: [],
				    inProgress: false,
				    isRadarVisible: false,
				    __interval: null,
				    __pointerX: null,
				    __pointerY: null,
				    __selectedA: null,
				    __selectedB: null,
				    __displayM: "all",
				    __displayO: "both",
				    __factor: null,

				    __setInfo: function (base) {
				        try {
				            //				console.log(base);
				            var info = this.info;
				            info.removeAll();
				            if (!base) return;
				            for (var i = 0; i < base.length; i++) {
				                var title = new qx.ui.basic.Label(base[i][0]).set({ font: 'font_size_13_bold', textColor: '#375773' });
				                var value = new qx.ui.basic.Label(base[i][1]).set({ font: 'font_size_11', textColor: '#333333', marginBottom: 5 });
				                info.add(title);
				                info.add(value);
				            }
				        }
				        catch (e) {
				            console.log(e.toString());
				        }
				    },

				    __createLayout: function () {
				        var s = this.scale, circles = this.circles, ctx = this.ctx;
				        for (var i = 0; i < circles.length; i++) {
				            var r = circles[i];
				            ctx.beginPath();
//*Changed from 250 on the circle size
				            ctx.arc(325, 325, r, 0, Math.PI * 2, true);
				            ctx.lineWidth = (i == 4) ? 1 / s : 0.3 / s;
				            ctx.strokeStyle = '#8ce9ef';
				            ctx.stroke();
				            ctx.closePath();
				        }

				        for (var i = 0; i < 8; i++) {
				            var r = circles[4], a = (Math.PI * i / 4) - Math.PI / 8;
				            ctx.beginPath();
//*Changed from 250 on the circle size
				            ctx.moveTo(325, 325);
//*Changed from 250 on the circle size
				            ctx.lineTo((r * Math.cos(a)) + 325, (r * Math.sin(a)) + 325);
				            ctx.lineWidth = 0.3 / s;
				            ctx.strokeStyle = '#8ce9ef';
				            ctx.stroke();
				            ctx.closePath();
				        }

				        var endGame = ccta_map.getInstance().__endGame, hubs = endGame.hubs, fortress = endGame.fortress;
				        var fortressX = fortress[0];
				        var fortressY = fortress[1];

				        var grd = ctx.createLinearGradient(fortressX, fortressY - 0.5, fortressX, fortressY + 0.5);
				        grd.addColorStop(0, 'rgba(200, 228, 228, 0.5)');
				        grd.addColorStop(1, 'rgba(170, 214, 118, 0.5)');
				        ctx.beginPath();
				        ctx.arc(fortressX - 0.2, fortressY - 0.2, 1, 0, Math.PI * 2, true);
				        ctx.fillStyle = grd;
				        ctx.lineWidth = 0.1;
				        ctx.strokeStyle = '#a5fe6a';
				        ctx.fill();
				        ctx.stroke();
				        ctx.closePath();

				        for (var i = 0; i < hubs.length; i++) {
				            var c = 'rgba(200, 228, 228, 0.5)', d = 'rgba(170, 214, 118, 0.5)', l = 1.3, b = 0.1;
				            var x = hubs[i][0];
				            var y = hubs[i][1];
				            var grd = ctx.createLinearGradient(x, y, x, y + l);
				            grd.addColorStop(0, c);
				            grd.addColorStop(1, d);
				            ctx.beginPath();
				            ctx.rect(x - b, y - b, l, l);
				            ctx.fillStyle = grd;
				            ctx.fill();
				            ctx.strokeStyle = '#a5fe6a';
				            ctx.lineWidth = b;
				            ctx.stroke();
				            ctx.closePath();
				        }

				    },

				    __createAlliance: function (name, data, type, color) {
				        try {
				            this.inProgress = true;
				            var colors = {
				                "bases": { "alliance": [["#86d3fb", "#75b7d9"]], "owner": [["#ffc48b", "#d5a677"]], "enemy": [["#ff8e8b", "#dc7a78"], ['#e25050', '#cc2d2d'], ['#93b7f8', '#527ef2'], ['#d389aa', '#b14e69']], "nap": [["#ffffff", "#cccccc"]], "selected": [["#ffe50e", "#d7c109"]], "ally": [["#6ce272", "#5fc664"], ['#d4e17e', '#b3ca47'], ['#92f8f2', '#52f2e8'], ['#1cba1c', '#108510']] },
				                "pois": [["#add2a8", "#6db064"], ["#75b9da", "#4282bd"], ["#abd2d6", "#6bafb7"], ["#e2e0b7", "#ccc880"], ["#e5c998", "#d09e53"], ["#d4a297", "#b35a54"], ["#afa3b1", "#755f79"]]
				            };

				            var owner = ClientLib.Data.MainData.GetInstance().get_Player().name, ctx = this.ctx, factor = this.__factor;
				            var dop = this.__displayO, dmd = this.__displayM, root = this, s = this.scale;

				            var r = (s < 3) ? 0.65 : (s > 3) ? 0.35 : 0.5;

				            var createBase = function (x, y, bt, clr) {
				                var c = colors.bases[bt][clr][0], d = colors.bases[bt][clr][1];
				                var grd = ctx.createLinearGradient(x, y - r, x, y + r);
				                grd.addColorStop(0, c);
				                grd.addColorStop(1, d);
				                ctx.beginPath();
				                ctx.arc(x, y, r, 0, Math.PI * 2, true);
				                ctx.closePath();
				                ctx.fillStyle = grd;
				                ctx.fill();
				                ctx.lineWidth = 0.1;
				                ctx.strokeStyle = '#000000';
				                ctx.stroke();
				                ctx.closePath();
				            };

				            var createPoi = function (x, y, t) {
				                var c = colors.pois[t][0], d = colors.pois[t][1];
				                var grd = ctx.createLinearGradient(x, y - r, x, y + r);
				                grd.addColorStop(0, c);
				                grd.addColorStop(1, d);
				                ctx.beginPath();
				                ctx.rect(x - r, y - r, r * 2, r * 2);
				                ctx.fillStyle = grd;
				                ctx.fill();
				                ctx.strokeStyle = "#000000";
				                ctx.lineWidth = 0.1;
				                ctx.stroke();
				                ctx.closePath();
				            };

				            if (dop != "pois") {
				                for (var player in data.players) {
				                    for (var i = 0; i < data.players[player].bases.length; i++) {
				                        var b = data.players[player].bases[i], pid = data.players[player].id;
				                        if (dmd == "bases") {
				                            if (player == owner) {
				                                this.elements.push({ "x": b[0], "y": b[1], "an": name, "pn": player, "bn": b[2], "bi": b[3], "ai": data.id, "pi": pid, "type": "base" });
				                                this.locations.push([b[0] / factor, b[1] / factor]);
				                                createBase(b[0], b[1], 'owner', 0);
				                            }
				                        }
				                        else {
				                            this.elements.push({ "x": b[0], "y": b[1], "an": name, "pn": player, "bn": b[2], "bi": b[3], "ai": data.id, "pi": pid, "type": "base" });
				                            this.locations.push([b[0] / factor, b[1] / factor]);
				                            (player == owner) ? createBase(b[0], b[1], 'owner', 0) : createBase(b[0], b[1], type, color);
				                        }
				                    }
				                }
				            }

				            if (dop != "bases") {
				                for (var i = 0; i < data.pois.length; i++) {
				                    var x = data.pois[i].x, y = data.pois[i].y, t = data.pois[i].t, l = data.pois[i].l;
				                    createPoi(x, y, t - 2);
				                    this.elements.push({ "x": x, "y": y, "an": name, "ai": data.id, "t": t, "l": l });
				                    this.locations.push([x / factor, y / factor]);
				                }
				            }
				            this.inProgress = false;
				        }
				        catch (e) {
				            console.log(e.toString());
				        }
				    },

				    __draggable: function (mask) {
				        try {
				            var start, end, initCoords = [], selectedBase = false, root = this, canvas = this.canvas, c = 0;
				            var factor = root.__factor;

				            var displayBaseInfo = function () {
				                try {
				                    if (!selectedBase || root.inProgress) return;
				                    var base = [];
				                    var pois = ['Tiberium', 'Crystal', 'Reactor', 'Tungesten', 'Uranium', 'Aircraft Guidance', 'Resonater'];
				                    for (var i in selectedBase) {
				                        var txt = "", val = "";
				                        switch (i) {
				                            case "an": txt = "Alliance: "; val = selectedBase[i]; break;
				                            case "bn": txt = "Base    : "; val = selectedBase[i]; break;
				                            case "pn": txt = "Player  : "; val = selectedBase[i]; break;
				                            case "l": txt = "Level   : "; val = selectedBase[i]; break;
				                            case "t": txt = "Type    : "; val = pois[selectedBase[i] - 2]; break;
				                            default: txt = false;
				                        }
				                        if (txt) {
				                            base.push([txt, val]);
				                        }
				                        root.__setInfo(base);
				                    }
				                }
				                catch (e) {
				                    console.log(e.toString());
				                }
				            };

				            var onMapHover = function (event) {
				                var loc = root.locations, elements = root.elements, coordsField = root.coordsField;
				                var getCoords = function () {
				                    var canvasRect = canvas.getBoundingClientRect();
				                    var x = (event.pageX - canvasRect.left), y = (event.pageY - canvasRect.top);
				                    return [x, y];
				                };

				                var coords = getCoords();
				                var x = coords[0] + canvas.offsetLeft, y = coords[1] + canvas.offsetTop;

				                if (Math.sqrt(Math.pow(x - 250, 2) + Math.pow(y - 250, 2)) > 242) {
				                    coordsField.setValue("");
				                    return;
				                }

				                x = Math.round(coords[0] / (root.scale * factor)); root.__pointerX = x;
				                y = Math.round(coords[1] / (root.scale * factor)); root.__pointerY = y;

				                coordsField.setValue(x + ":" + y);

				                if (root.scale < 2 || root.inProgress) return;

				                for (var i = 0; i < loc.length; i++) {
				                    var elmX = loc[i][0], elmY = loc[i][1];
				                    if ((x == elmX) && (y == elmY)) {
				                        selectedBase = elements[i];
				                        displayBaseInfo();
				                        break;
				                    }
				                    else {
				                        selectedBase = false;
				                        root.__setInfo(false);
				                    }
				                }
				            };

				            var onMapDrag = function (event) {
				                if (root.scale == 1 || root.inProgress) return;
				                var cx = canvas.offsetLeft, cy = canvas.offsetTop, mx = event.pageX, my = event.pageY;
				                var newX = cx + mx - initCoords[0], newY = cy + my - initCoords[1];
				                initCoords[0] = mx;
				                initCoords[1] = my;
				                canvas.style.top = newY + 'px';
				                canvas.style.left = newX + 'px';
				            };

				            var onMapWheel = function (event) {
				                if (root.inProgress) return;
				                var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
				                if ((delta < 0 && root.scale <= 1) || (delta > 0 && root.scale >= 12)) return;
				                c += delta;
				                var str = (Math.abs(c) % 3 == 0) ? ((delta < 0) ? 'down' : 'up') : false;
				                if (str) root.__scaleMap(str);
				            };

				            var onMapDown = function (event) {
				                var x = event.pageX, y = event.pageY, t = new Date();
				                initCoords = [x, y];
				                start = t.getTime();
				                mask.removeEventListener('mousemove', onMapHover, false);
				                mask.addEventListener('mousemove', onMapDrag, false);
				            };

				            var onMapUp = function (event) {
				                var x = event.pageX, y = event.pageY, t = new Date();
				                end = t.getTime();
				                initCoords = [x, y];
				                mask.removeEventListener('mousemove', onMapDrag, false);
				                mask.addEventListener('mousemove', onMapHover, false);
				                if (end - start < 150) webfrontend.gui.UtilView.centerCoordinatesOnRegionViewWindow(root.__pointerX, root.__pointerY);
				            };

				            var onMapOut = function (event) {
				                mask.removeEventListener('mousemove', onMapDrag, false);
				                mask.addEventListener('mousemove', onMapHover, false);
				            };

				            mask.addEventListener('mouseup', onMapUp, false);
				            mask.addEventListener('mousedown', onMapDown, false);
				            mask.addEventListener('mousemove', onMapHover, false);
				            mask.addEventListener('mouseout', onMapOut, false);
				            mask.addEventListener('mousewheel', onMapWheel, false);
				            mask.addEventListener('DOMMouseScroll', onMapWheel, false);
				        }
				        catch (e) {
				            console.log(e.toString());
				        }
				    },

				    __startRadarScan: function () {
				        this.isRadarVisible = true;
				        var FRAMES_PER_CYCLE = 20, FRAMERATE = 20, RINGS = 6;
//*Canvas size changed from 400
				        var canvas = this.canvas, ctx = this.ctx, canvassize = 450, animationframe = 0, root = this;
				        var ringsize = canvassize / (2 * RINGS + 1);
				        var radiusmax = ringsize / 2 + ringsize + (RINGS - 1) * ringsize;

				        function animateRadarFrame() {
				            ctx.clearRect(0, 0, canvas.width, canvas.height);
				            root.__createLayout();
				            var radius, alpha;
				            for (var ringno = 0; ringno < RINGS; ringno++) {
				                radius = ringsize / 2 + (animationframe / FRAMES_PER_CYCLE) * ringsize + ringno * ringsize;
				                alpha = (radiusmax - radius) / radiusmax;
				                ctx.beginPath();
				                ctx.fillStyle = "rgba(92,178,112," + alpha + ")";
//Change from 250 Control Rings of radar scan
				                ctx.arc(325, 325, radius, 0, 2 * Math.PI, false);
				                ctx.fill();
				                ctx.closePath();
				            }

				            ctx.beginPath();
				            ctx.fillStyle = "rgb(100,194,122)";
//*Changed from 250 Controls Center Dot of radar scanning
				            ctx.arc(325, 325, ringsize / 2, 0, 2 * Math.PI, false);
				            ctx.fill();
				            ctx.closePath();

				            animationframe = (animationframe >= (FRAMES_PER_CYCLE - 1)) ? 0 : animationframe + 1;
				        }
				        this.__interval = setInterval(animateRadarFrame, 1000 / FRAMERATE);
				    },

				    __stopRadarScan: function () {
				        if (!this.isRadarVisible) return;
				        clearInterval(this.__interval);
				        this.isRadarVisible = false;
				        this.__enablePanel();
				    },

				    __disablePanel: function () {
				        this.inProgress = true;
				        for (var i = 0; i < this.panel.length; i++) this.panel[i].setEnabled(false);
				    },

				    __enablePanel: function () {
				        for (var i = 0; i < this.panel.length; i++) if (i > 1) this.panel[i].setEnabled(true);
				    },

				    __createIcon: function (color, width, height) {
				        var canvas = document.createElement("canvas");
				        canvas.width = width;
				        canvas.height = height;

				        var ctx = canvas.getContext("2d");
				        ctx.beginPath();
				        ctx.rect(0, 0, width, height);
				        ctx.fillStyle = color;
				        ctx.fill();
				        ctx.closePath();

				        var data = canvas.toDataURL("image/png");
				        return data;
				    },

				    __updateList: function () {
				        var dm = this.__displayM;
				        this.__selectedA = null;
				        this.allianceList.removeAll();
				        var d = this.receivedData, root = this;
				        var colors = { "enemy": ["#ff807d", "#a93939", "#739bf5", "#c26b89"], "ally": ["#3bbe5d", "#c4d663", "#73f5ed", "#169f16"], "nap": ["#ffffff"], "selected": ["#ffe50e"], "alliance": ["#75b7d9"], "owner": ["#ffc48b"] };
				        for (var i = 0; i < d.length; i++) {
				            var name = d[i][0].name, type = d[i][1], aid = d[i][0].id, clr = d[i][2];
				            if ((dm == "all") || (dm == "selected")) {
				                var color = colors[type][clr];
				                var li = new qx.ui.form.ListItem(name, root.__createIcon(color, 10, 10), aid);
				                var tooltip = new qx.ui.tooltip.ToolTip(name + " - " + type, root.__createIcon(color, 15, 15));
				                li.setToolTip(tooltip);
				                this.allianceList.add(li);
				            }
				            else {
				                if (type == "alliance") {
				                    var li = new qx.ui.form.ListItem(name, null, aid);
				                    var tooltip = new qx.ui.tooltip.ToolTip(name + " - " + type, root.__createIcon(color, 15, 15));
				                    li.setToolTip(tooltip);
				                    this.allianceList.add(li);
				                    break;
				                }
				            }
				        }
				    },

				    drawCanvas: function () {
				        var dmd = this.__displayM, b = this.receivedData, list = this.allianceList;
				        var selected = (this.__selectedA != null && typeof this.__selectedA == 'number') ? this.__selectedA : false;
				        var mask = this.mask, n = this.scale, canvas = this.canvas, ctx = this.ctx;

				        this.elements = [];
				        this.locations = [];
				        this.__stopRadarScan();
//*Original Values were 500
				        canvas.width = n * 650;
				        canvas.height = n * 650;
				        ctx = canvas.getContext("2d");
				        ctx.scale(n, n);

				        this.__createLayout();

				        for (var i = 0; i < b.length; i++) {
				            var name = b[i][0].name, data = b[i][0], type = b[i][1], aid = b[i][0].id, color = b[i][2];
				            if (((dmd == "alliance") || (dmd == "bases")) && (type == "alliance")) {
				                this.__createAlliance(name, data, type, 0);
				                break;
				            }
				            if (dmd == "all") {
				                if (selected && (aid == selected)) {
				                    type = 'selected';
				                    color = 0;
				                }
				                this.__createAlliance(name, data, type, color);
				            }
				            if ((dmd == "selected") && selected && (aid == selected)) {
				                this.__createAlliance(name, data, type, color);
				                break;
				            }
				        }
				    },

				    __scaleMap: function (str) {
				        try {
				            var newScale = (str == 'up') ? this.scale + 2 : this.scale - 2;
				            if (newScale > 12 || newScale < 1 || this.inProgress) return;
				            var canvas = this.canvas, ctx = this.ctx;
				            var x = ((canvas.offsetLeft - 250) * newScale / this.scale) + 250,
								y = ((canvas.offsetTop - 250) * newScale / this.scale) + 250;

				            this.scale = newScale;
				            switch (this.scale) {
				                case 1: this.zoomOut.setEnabled(false); this.zoomReset.setEnabled(false); this.zoomIn.setEnabled(true); break
				                case 11: this.zoomOut.setEnabled(true); this.zoomReset.setEnabled(true); this.zoomIn.setEnabled(false); break
				                default: this.zoomOut.setEnabled(true); this.zoomReset.setEnabled(true); this.zoomIn.setEnabled(true); break
				            }
				            ctx.clearRect(0, 0, canvas.width, canvas.height);
				            this.drawCanvas();
				            canvas.style.left = newScale == 1 ? 0 : x + 'px';
				            canvas.style.top = newScale == 1 ? 0 : y + 'px';
				        }
				        catch (e) {
				            console.log(e.toString());
				        }
				    },

				    resetMap: function () {
				        var canvas = this.canvas, ctx = this.ctx;
				        this.scale = 1;
//*Original Values were 500
				        canvas.width = 650; canvas.height = 650; canvas.style.left = 0; canvas.style.top = 0;
				        ctx.clearRect(0, 0, canvas.width, canvas.height);
				        this.__disablePanel();
				        this.__startRadarScan();
				    },

				    open: function (faction) {

				        var app = qx.core.Init.getApplication();
				        var mainOverlay = app.getMainOverlay();


    			        this.setWidth(mainOverlay.getWidth());
				        this.setMaxWidth(mainOverlay.getMaxWidth());
				        this.setHeight(mainOverlay.getHeight());
				        this.setMaxHeight(mainOverlay.getMaxHeight());

				        app.getDesktop().add(this, { left: mainOverlay.getBounds().left, top: mainOverlay.getBounds().top });
				    },

				    _onClose: function () {
				        var opt = ccta_map.options.getInstance();
				        var app = qx.core.Init.getApplication();
				        app.getDesktop().remove(this);
				        if (opt.isSeeable()) opt.close();
				    },

				    _onResize: function () {
				        var windowWidth = window.innerWidth - 10;
				        var width = this.getWidth();
				        var offsetLeft = (windowWidth - width) / 2;

				        this.setDomLeft(offsetLeft);

				        var opt = ccta_map.options.getInstance();
				        if (opt.isSeeable()) opt.setDomLeft(offsetLeft + width + 5);
				    }

				}
			});

            qx.Class.define('ccta_map.options',
			{
			    type: 'singleton',
			    extend: webfrontend.gui.CustomWindow,

			    construct: function () {
			        try {
			            this.base(arguments);
			            this.setLayout(new qx.ui.layout.VBox(10));
			            this.set({
			                width: 200,
			                height: 500,
			                showMinimize: false,
			                showMaximize: false,
			                alwaysOnTop: true,
			                caption: 'Edit Alliances'
			            });

			            this.__getAlliances();

			            var root = this;

			            var searchBox = new qx.ui.form.TextField().set({ placeholder: 'Search...' });
			            var list = new qx.ui.form.List().set({ height: 80 });
			            var editList = new qx.ui.form.List().set({ height: 160, selectionMode: 'additive' });

			            var radioButtons = [['Enemy', 'enemy'], ['Ally', 'ally'], ['NAP', 'nap']];
			            var radioGroup = new qx.ui.form.RadioButtonGroup().set({ layout: new qx.ui.layout.HBox(10), textColor: '#aaaaaa' });
			            for (var i = 0; i < radioButtons.length; i++) {
			                var radioButton = new qx.ui.form.RadioButton(radioButtons[i][0]);
			                radioButton.setModel(radioButtons[i][1]);
			                radioGroup.add(radioButton);
			            }

			            var colors = root.__colors;
			            var colorSelectBox = new qx.ui.form.SelectBox().set({ height: 28 });
			            var addColors = function (type) {
			                colorSelectBox.removeAll();
			                for (var i = 0; i < colors[type].length; i++) {
			                    var src = root.__createIcon(colors[type][i], 60, 15);
			                    var listItem = new qx.ui.form.ListItem(null, src, i);
			                    colorSelectBox.add(listItem);
			                }
			            };
			            addColors('enemy');

			            var addButton = new qx.ui.form.Button('Add').set({ enabled: false, width: 85, toolTipText: 'Maximum allowed number of alliances is 8.' });;
			            var removeButton = new qx.ui.form.Button('Remove').set({ enabled: false, width: 85 });;
			            var applyButton = new qx.ui.form.Button('Apply').set({ enabled: false });;
			            var defaultsButton = new qx.ui.form.Button('Defaults').set({ enabled: false, width: 85 });;
			            var saveButton = new qx.ui.form.Button('Save').set({ enabled: false, width: 85 });;

			            var hbox1 = new qx.ui.container.Composite(new qx.ui.layout.HBox(10))
			            var hbox2 = new qx.ui.container.Composite(new qx.ui.layout.HBox(10))

			            hbox1.add(addButton);
			            hbox1.add(removeButton);

			            hbox2.add(saveButton);
			            hbox2.add(defaultsButton);

			            this.searchBox = searchBox;
			            this.list = list;
			            this.editList = editList;
			            this.radioGroup = radioGroup;
			            this.colorSelectBox = colorSelectBox;
			            this.addButton = addButton;
			            this.removeButton = removeButton;
			            this.saveButton = saveButton;
			            this.defaultsButton = defaultsButton;
			            this.applyButton = applyButton;

			            this.add(searchBox);
			            this.add(list);
			            this.add(editList);
			            this.add(radioGroup);
			            this.add(colorSelectBox);
			            this.add(hbox1);
			            this.add(hbox2);
			            this.add(applyButton);

			            this.addListener('appear', function () {
			                var cont = ccta_map.container.getInstance()
			                var bounds = cont.getBounds(), left = bounds.left, top = bounds.top, width = bounds.width, height = bounds.height;
			                searchBox.setValue('');
			                list.removeAll();
			                addButton.setEnabled(false);
			                removeButton.setEnabled(false);
			                applyButton.setEnabled(false);
			                radioGroup.setSelection([radioGroup.getSelectables()[0]]);
			                colorSelectBox.setSelection([colorSelectBox.getSelectables()[0]]);
			                this.__updateList();
			                this.__checkDefaults();
			                this.__checkSavedSettings();
			                this.setUserBounds(left + width + 5, top, 200, height);
			            }, this);

			            searchBox.addListener('keyup', this.__searchAlliances, this);

			            radioGroup.addListener('changeSelection', function (e) {
			                if (e.getData()[0]) addColors(e.getData()[0].getModel());
			            }, this);

			            list.addListener('changeSelection', function (e) {
			                if (!e.getData()[0]) return;
			                var items = this.__items, aid = e.getData()[0].getModel();
			                (((items != null) && (items.indexOf(aid) > -1)) || (items.length > 99)) ? addButton.setEnabled(false) : addButton.setEnabled(true);
			            }, this);

			            editList.addListener('changeSelection', function (e) {
			                (e.getData()[0]) ? removeButton.setEnabled(true) : removeButton.setEnabled(false);
			            }, this);

			            addButton.addListener('execute', function () {
			                var aid = list.getSelection()[0].getModel(),
								name = list.getSelection()[0].getLabel(),
								type = radioGroup.getSelection()[0].getModel(),
								color = colorSelectBox.getSelection()[0].getModel();

			                var li = new qx.ui.form.ListItem(name + " - " + type, root.__createIcon(colors[type][color], 15, 15), { 'aid': aid, 'type': type, 'name': name, 'color': color });
			                editList.add(li);
			                list.resetSelection();
			                addButton.setEnabled(false);
			                root.__updateItems();
			            }, this);

			            removeButton.addListener('execute', function () {
			                var selection = (editList.isSelectionEmpty()) ? null : editList.getSelection();
			                var ownAlliance = ccta_map.getInstance().__allianceName;
			                if (selection != null) {
			                    for (var i = selection.length - 1; i > -1; i--) if (selection[i].getModel().name != ownAlliance) editList.remove(selection[i]);
			                    root.__updateItems();
			                    editList.resetSelection();
			                }
			            }, this);

			            applyButton.addListener('execute', this.__applyChanges, this);
			            defaultsButton.addListener('execute', this.__setDefaults, this);
			            saveButton.addListener('execute', this.__saveSettings, this);

			        }
			        catch (e) {
			            console.log(e.toString());
			        }
			        console.log('Options Panel creation completed');
			    },
			    destruct: function () {

			    },
			    members:
				{
				    __data: null,
				    searchBox: null,
				    list: null,
				    editList: null,
				    radioGroup: null,
				    colorSelectBox: null,
				    addButton: null,
				    removeButton: null,
				    saveButton: null,
				    applyButton: null,
				    defaultsButton: null,
				    __items: null,
				    __colors: { "enemy": ["#ff807d", "#a93939", "#739bf5", "#c26b89"], "ally": ["#3bbe5d", "#c4d663", "#73f5ed", "#169f16"], "nap": ["#ffffff"], "selected": ["#ffe50e"], "alliance": ["#75b7d9"], "owner": ["#ffc48b"] },


				    __getAlliances: function () {
				        var root = this;
				        ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("RankingGetData",
						{ firstIndex: 0, lastIndex: 3000, ascending: true, view: 1, rankingType: 0, sortColumn: 2 },
						phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, function (context, data) {
						    if (data.a != null) {
						        var arr = [];
						        for (var i = 0; i < data.a.length; i++) arr[i] = [data.a[i].an, data.a[i].a];
						        root.__data = arr;
						    }

						}), null);
				    },

				    __createIcon: function (color, width, height) {
				        var canvas = document.createElement("canvas");
				        canvas.width = width;
				        canvas.height = height;

				        var ctx = canvas.getContext("2d");
				        ctx.beginPath();
				        ctx.rect(0, 0, width, height);
				        ctx.fillStyle = color;
				        ctx.fill();
				        ctx.closePath();

				        var data = canvas.toDataURL("image/png");
				        return data;
				    },

				    __updateList: function () {
				        var map = ccta_map.getInstance();
				        var selectedItems = [], list = this.editList, root = this;
				        var alliancesList = (map.__selectedAlliances == null) ? map.__defaultAlliances : map.__selectedAlliances;
				        var colors = this.__colors;
				        list.removeAll();

				        alliancesList.map(function (a) {
				            var aid = a[0], at = a[1], an = a[2], c = a[3];
				            var li = new qx.ui.form.ListItem(an + " - " + at, root.__createIcon(colors[at][c], 15, 15), { 'aid': aid, 'type': at, 'name': an, 'color': c });
				            list.add(li);
				            selectedItems.push(aid);
				        });
				        this.__items = selectedItems;
				    },

				    __setDefaults: function () {
				        var map = ccta_map.getInstance();
				        var selectedItems = [], list = this.editList, root = this, colors = this.__colors;
				        var alliancesList = map.__defaultAlliances;
				        list.removeAll();

				        alliancesList.map(function (a) {
				            var aid = a[0], at = a[1], an = a[2], c = a[3];
				            var li = new qx.ui.form.ListItem(an + " - " + at, root.__createIcon(colors[at][c], 15, 15), { 'aid': aid, 'type': at, 'name': an, 'color': c });
				            list.add(li);
				            selectedItems.push(aid);
				        });
				        this.__items = selectedItems;
				        this.__currentListModified();
				        this.defaultsButton.setEnabled(false);
				    },

				    __searchAlliances: function () {
				        var str = this.searchBox.getValue(), data = this.__data, list = this.list;
				        list.removeAll();
				        if (!data || (str == '')) return;

				        data.map(function (x) {
				            var patt = new RegExp("^" + str + ".+$", "i");
				            var test = patt.test(x[0]);

				            if (test) {
				                var listItem = new qx.ui.form.ListItem(x[0], null, x[1]);
				                list.add(listItem);
				            }
				        });
				    },

				    __updateItems: function () {
				        var items = [], listItems = this.editList.getSelectables();
				        for (var i = 0; i < listItems.length; i++) items.push(listItems[i].getModel().aid);
				        this.__items = items;
				        this.__checkSavedSettings();
				        this.__currentListModified();
				    },

				    __applyChanges: function () {
				        var selectedAlliances = [], listItems = this.editList.getSelectables();
				        for (var i = 0; i < listItems.length; i++) {
				            var model = listItems[i].getModel(), aid = model.aid, type = model.type, name = model.name, color = model.color;
				            selectedAlliances.push([aid, type, name, color]);
				        }
				        ccta_map.getInstance().__selectedAlliances = selectedAlliances;
				        ccta_map.container.getInstance().resetMap();
				        ccta_map.getInstance().getData();
				        this.close();
				    },

				    __saveSettings: function () {
				        if (typeof (Storage) === 'undefined') return;

				        var selectedAlliances = [], listItems = this.editList.getSelectables();
				        for (var i = 0; i < listItems.length; i++) {
				            var model = listItems[i].getModel(), aid = model.aid, type = model.type, name = model.name, color = model.color;
				            selectedAlliances.push([aid, type, name, color]);
				        }

				        (!localStorage.ccta_map_settings) ? localStorage['ccta_map_settings'] = JSON.stringify(selectedAlliances) : localStorage.ccta_map_settings = JSON.stringify(selectedAlliances);
				        this.saveButton.setEnabled(false);
				        //			console.log(localStorage.ccta_map_settings);
				    },

				    __checkSavedSettings: function () {
				        if (typeof (Storage) === 'undefined') return;
				        var original = (localStorage.ccta_map_settings) ? JSON.parse(localStorage.ccta_map_settings) : null;
				        var items = this.__items;
				        var changed = false;

				        if ((items != null) && (original != null) && (items.length != original.length)) changed = true;
				        if ((items != null) && (original != null) && (items.length == original.length)) {
				            original.map(function (x) {
				                if (items.indexOf(x[0]) < 0) changed = true;
				            });
				        }
				        ((items.length > 0) && ((original === null) || changed)) ? this.saveButton.setEnabled(true) : this.saveButton.setEnabled(false);
				    },

				    __checkDefaults: function () {
				        var defaults = ccta_map.getInstance().__defaultAlliances, items = this.__items, changed = false;
				        if (!defaults) return;
				        if ((items != null) && (defaults != null) && (items.length != defaults.length)) changed = true;
				        if ((items != null) && (defaults != null) && (items.length == defaults.length)) {
				            defaults.map(function (x) {
				                if (items.indexOf(x[0]) < 0) changed = true;
				            });
				        }
				        (changed) ? this.defaultsButton.setEnabled(true) : this.defaultsButton.setEnabled(false);
				    },

				    __currentListModified: function () {
				        var map = ccta_map.getInstance(), current = (map.__selectedAlliances == null) ? map.__defaultAlliances : map.__selectedAlliances;
				        var items = this.__items, changed = false;

				        current.map(function (x) {
				            if (items.indexOf(x[0]) < 0) changed = true;
				        });
				        ((items.length > 0) && ((items.length != current.length) || (changed == true))) ? this.applyButton.setEnabled(true) : this.applyButton.setEnabled(false);
				    }

				}
			});
        }

        var cctaMapLoader = function () {
            var qx = window["qx"];
            var ClientLib = window["ClientLib"];
            var webfrontend = window["webfrontend"];

            if ((typeof ClientLib == 'undefined') || (typeof qx == 'undefined') || (qx.core.Init.getApplication().initDone == false)) {
                setTimeout(cctaMapLoader, 1000);
                console.log('retrying....');
            }
            else {
                create_ccta_map_class();
                ccta_map.getInstance();
            }
        };
        window.setTimeout(cctaMapLoader, 10000);

    };

    function inject() {
        var script = document.createElement("script");
        script.innerHTML = "(" + injectScript.toString() + ")();";
        script.type = "text/javascript";
        if (/commandandconquer\.com/i.test(document.domain)) {
            document.getElementsByTagName("head")[0].appendChild(script);
            console.log('injected');
        }
    }

    inject();

})();

// ==UserScript==
// @name Tiberium Alliances "Alliance Officials" Message Mod
// @description Replaces the "My Commanders" option in the new message window with an "Alliance Officials" option.
// @namespace message_mod
// @include https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version 1.3
// @author KRS_L
// @updateURL https://userscripts.org/scripts/source/158537.meta.js
// @downloadURL https://userscripts.org/scripts/source/158537.user.js
// ==/UserScript==
(function () {
    var MessageMod_main = function () {
        function createMessageMod() {
            try {
                console.log('MessageMod loaded');
                qx.$$translations[qx.locale.Manager.getInstance().getLocale()]["tnf:my officers"] = "Alliance Officials";
                var addOfficers = function () {
                    var roles = this.get_Roles().d;
                    var members = this.get_MemberData().d;
                    for (var x in members) {
                        if (roles[members[x].Role].Name === 'Officer') {
                            this.get_SecondLeaders().l.push(members[x].Id);
                        }
                    }
                };
                ClientLib.Data.Alliance.prototype.addOfficersToSecondLeadersArray = addOfficers;
                var refreshResult = ClientLib.Data.Alliance.prototype.RefreshMemberData.toString().match(/this.this.[A-Z]{6}/).toString().slice(10, 16);
                var refreshResult_original = "ClientLib.Data.Alliance.prototype.refreshResult_Original = ClientLib.Data.Alliance.prototype." + refreshResult;
                var rro = Function('', refreshResult_original);
                rro();
                var refreshResult_new = "ClientLib.Data.Alliance.prototype." + refreshResult + " = function(a,b){this.refreshResult_Original(a,b);this.addOfficersToSecondLeadersArray();}";
                var rrn = Function('', refreshResult_new);
                rrn();
                webfrontend.gui.mail.MailOverlay.getInstance().addListener("appear", function () {
                    ClientLib.Data.MainData.GetInstance().get_Alliance().RefreshMemberData();
                }, this);
                webfrontend.gui.mail.MailOverlay.getInstance().onNewMessage_Original = webfrontend.gui.mail.MailOverlay.getInstance().onNewMessage;
                webfrontend.gui.mail.MailOverlay.getInstance().onNewMessage = function (a) {
                    ClientLib.Data.MainData.GetInstance().get_Alliance().RefreshMemberData();
                    this.onNewMessage_Original(a);
                };
            } catch (e) {
                console.log("createMessageMod: ", e);
            }
        }

        function MessageMod_checkIfLoaded() {
            try {
                if (typeof qx !== 'undefined' && typeof qx.locale !== 'undefined' && typeof qx.locale.Manager !== 'undefined') {
                    if (ClientLib.Data.MainData.GetInstance().get_Alliance().get_FirstLeaders() !== null && ClientLib.Data.MainData.GetInstance().get_Alliance().get_FirstLeaders().l.length != 0) {
                        createMessageMod();
                    } else {
                        window.setTimeout(MessageMod_checkIfLoaded, 1000);
                    }
                } else {
                    window.setTimeout(MessageMod_checkIfLoaded, 1000);
                }
            } catch (e) {
                console.log("MessageMod_checkIfLoaded: ", e);
            }
        }

        if (/commandandconquer\.com/i.test(document.domain)) {
            window.setTimeout(MessageMod_checkIfLoaded, 1000);
        }
    }

    try {
        var MessageMod = document.createElement("script");
        MessageMod.innerHTML = "(" + MessageMod_main.toString() + ")();";
        MessageMod.type = "text/javascript";
        if (/commandandconquer\.com/i.test(document.domain)) {
            document.getElementsByTagName("head")[0].appendChild(MessageMod);
        }
    } catch (e) {
        console.log("MessageMod: init error: ", e);
    }
})();


// ==UserScript==
// @name            CDSIM 2016 VX6.6
// @description     Allows you to simulate combat before actually attacking.
// @author          Eistee & TheStriker & VisiG & Lobotommi & XDaast
// @version         2.1.2
// @namespace       https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include         https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @icon            http://eistee82.github.io/ta_simv2/icon.png
// ==/UserScript==

(function () {
	var script = document.createElement("script");
	script.innerHTML = "(" + function () {
		function createClasses() {
			qx.Class.define("qx.ui.form.ModelButton", {					//				qx.ui.form.Button with model property
				extend : qx.ui.form.Button,
				include : [qx.ui.form.MModelProperty],
				implement : [qx.ui.form.IModel]
			});
			qx.Class.define("TABS", {									// [singleton]	Main Class
				type : "singleton",
				extend : qx.core.Object,
				construct : function () {
					try {
                        this.base(arguments);
						this.self(arguments).Init();
						document.createElement('img').src = "http://goo.gl/hPdG3K"; // http://goo.gl/#analytics/goo.gl/hPdG3K/month			please don't remove this Stats Counter
					} catch (e) {
						console.group("Tiberium Alliances Battle Simulator V2");
						console.error("Error setting up TABS constructor", e);
						console.groupEnd();
					}
				},
				statics : {
					_Init : [],
					addInit : function (func) {
						this._Init.push(func);
					},
					Init : function () {
						for (var i in this._Init)
							qx.Class.getByName(this._Init[i]).getInstance();
					}
				}
			});
			qx.Class.define("TABS.RES", {								// [static]		Ressources
				type : "static",
				statics : {
					getDisplayName : function (ETechName, EFactionType) {
						return ClientLib.Base.Tech.GetTechDisplayNameFromTechId(ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(ETechName, EFactionType));
					}
				}
			});
			qx.Class.define("TABS.RES.IMG", {							// [static]		Ressources: Images
				type : "static",
				statics : {
					Menu : "https://www.openmerchantaccount.com/img2/cdicon.png",
					Stats : "https://www.openmerchantaccount.com/img/stats.png",
					Stop : "FactionUI/icons/icon_replay_stop_button.png",
					Arrange : {
						Left : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAMAAABBPP0LAAAA+VBMVEUAAABkZGT19fX39/fj4+MVFRXc3NwZGRlLS0sVFRXd3d0LCwvu7u7JycmioqKIiIgkJCSIiIj///9WVlb7+/vW1tbx8fHo6Ohqampubm7MzMx1dXX///+tra0eHh6srKyzs7N6enrNzc309PS7u7v7+/vQ0NC/v7/ExMT7+/tgYGChoaHu7u5bW1vs7OzAwMB0dHSsrKzS0tJ1dXWsrKxFRUUpKSkmJiahoaHAwMCampomJibV1dWJiYm5ubk0NDQ3Nzfp6en///+vr69BQUGTk5NBQUHj4+PX19f+/v7Jycnj4+PR0dHc3NyXl5eMjIz09PSCgoIyMjIoy70QAAAAU3RSTlMADweHhxMFCgIDhwUbAgsODh4UHoeHh4cFCgQUChQeD4cchw6HDw8ehx4vOoc8hzw6PDwKhxQaKB4UGh4ZKCgyHhQoNSgyOSiHNYc8hzU8PDw8EBrmavEAAACkSURBVAjXJYtVFoJQAEQfgoh0iYggIgJSit3dHftfjI/D/M3cO4DBddtxbNc1TY7rqwTQdJH2fZr2vIlgVSsEyImyjKKK0i5jZKmBqHDYXT/3XqcbHpeZQaNQiFIeSMNCEeS25yfkr28SHOb5dFgoUfZvNeuDHwXw6WofvpM4Pq3HtdTADQwjL48b5LBTBGBYYyZYkrQZpRiG0ViWQxCE5yGG/Q+LDRO5PtzwzwAAAABJRU5ErkJggg==",
						Center : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAMAAABBPP0LAAAA51BMVEU6OjpTU1P///9MTEz39/f8/Pz+/v7///9TU1MAAADv7+/7+/uVlZWDg4MvLy/39/fj4+MvLy/9/f3e3t7X19c9PT3U1NStra2ZmZlkZGTo6Oj09PRxcXGVlZXOzs7Ly8t+fn7c3NyZmZnc3NyysrL8/Pyenp6JiYlZWVm/v7/Pz8+7u7vo6Oj4+PiTk5Pj4+PT09Ps7Ozv7+/JycnT09PAwMB+fn7b29t1dXWTk5P////j4+M+Pj5PT0////+kpKSFhYWenp7Kysq1tbX////+/v62trbBwcHf39/CwsLk5ORubm5TU1MeHJAiAAAATXRSTlMCHocFAgoPAw0AhwUNDw8NDR4eh4c7Hjs8O4eHCgoFChkDDxOHhx4eLw+Hhx6HOoeHhzqHOjw8hxQUFBkSGhoaIy8vhy8jHocvh4c8PH2ldZMAAACpSURBVAjXHYzXAkIAFECvvUIUJRWZmYnS3nv8//dEz2cAzhEiSYrNILAsvo8BUMR6L8uxqt4931z2ATjSdZNEZ6e9Sasd8hhQonzN89m80+2mJ69RJeQN1XW29261M/TIA4ya8bPm5UfTxggNMLTZul9kYfGInC1WGeq5k5baV1GUv4ETG7TaF6/o4qDmAIChCPvgI4gkSbuVQTHA4JzR4GlaEAR6MMSZHypxEyTcEZPmAAAAAElFTkSuQmCC",
						Right : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAMAAABBPP0LAAAA9lBMVEXw8PAODg7s7OzW1tbs7OxgYGD9/f0AAABPT08VFRUBAQHU1NTk5OQAAABwcHD9/f38/PxfX1/7+/v9/f3S0tKjo6MRERE/Pz/AwMDp6enIyMh0dHRubm709PTR0dGSkpKmpqZBQUFubm66urro6OjOzs6xsbH19fXd3d3Hx8dBQUGhoaGGhobw8PBWVlb///8AAAB1dXWenp6vr69nZ2cAAAAKCgoiIiIHBwetra1dXV2hoaFnZ2e1tbUpKSmxsbEVFRX39/fPz8+MjIw3Nze6uropKSnY2NjY2Njj4+NkZGTQ0NDe3t6ysrKvr6/R0dGXl5fDw8OkAsOLAAAAUnRSTlMCDoeHBQUKAAIGCQqHFAoPFBSHHg8PHhyHh4c7DQ4UHocPGh4ehyiHhx48OjyHPBoaFIcSCigZFDWHKB41hyiHPCiHMjWHPB4tMjyHhzI8OTw8yAOJWAAAAKdJREFUCNcli1UCgkAABVcBWVBBGglJQULs7u66/2UEfZ/zZgBACzpN6zwvCIJGYRCAQqXFce4pcGaG3aEgQGmWZX2/ma+WGkidwTKD21xen2cUq/PpH7jn7L8jN0WWCACKtcB7RO9YTcL9ckQAlM9nd9or8mIyJDPD8XbqNQmP6/GgnCZosWcgW0U+rEyzmwIcxyHF2JIkimK7TMIfwPqaZeXSkQT8Aiw9E02m3A8KAAAAAElFTkSuQmCC"
					},
					Arrows : {
						Up : "https://www.openmerchantaccount.com/img/shiftu.png",
						Down : "https://www.openmerchantaccount.com/img/shiftd.png",
						Left : "https://www.openmerchantaccount.com/img/shiftl.png",
						Right : "https://www.openmerchantaccount.com/img/shiftr.png"
					},
					Flip : {
						H : "https://www.openmerchantaccount.com/img/mirror.png",
						V : "https://www.openmerchantaccount.com/img/flip.png"
                                        },
					DisableUnit : "https://www.openmerchantaccount.com/img/disableall.png",
					Undo : "https://www.openmerchantaccount.com/img/undo.png",
					Outcome : {
						total_defeat : "FactionUI/icons/icon_reports_total_defeat.png",
						victory : "FactionUI/icons/icon_reports_victory.png",
						total_victory : "FactionUI/icons/icon_reports_total_victory.png"
					},
					Enemy : {
						All : "FactionUI/icons/icon_arsnl_show_all.png",
						Base : "FactionUI/icons/icon_arsnl_base_buildings.png",
						Defense : "FactionUI/icons/icon_def_army_points.png"
					},
					Defense : {
						Infantry : "FactionUI/icons/icon_arsnl_def_squad.png",
						Vehicle : "FactionUI/icons/icon_arsnl_def_vehicle.png",
						Building : "FactionUI/icons/icon_arsnl_def_building.png"
					},
					Offense : {
						Infantry : "https://www.openmerchantaccount.com/img/icon_inf.png",
						Vehicle : "https://www.openmerchantaccount.com/img/icon_tnk.png",
						Aircraft : "https://www.openmerchantaccount.com/img/icon_air.png"
					},
					RepairCharge : {
						Base : "webfrontend/ui/icons/icn_repair_points.png",
						Offense : "webfrontend/ui/icons/icn_repair_off_points.png",
						Infantry : "webfrontend/ui/icons/icon_res_repair_inf.png",
						Vehicle : "webfrontend/ui/icons/icon_res_repair_tnk.png",
						Aircraft : "webfrontend/ui/icons/icon_res_repair_air.png"
					},
					Resource : {
						Tiberium : "webfrontend/ui/common/icn_res_tiberium.png",
						Crystal : "webfrontend/ui/common/icn_res_chrystal.png",
						Credits : "webfrontend/ui/common/icn_res_dollar.png",
						Power : "webfrontend/ui/common/icn_res_power.png",
						ResearchPoints : "webfrontend/ui/common/icn_res_research_mission.png",
						Transfer : "FactionUI/icons/icon_transfer_resource.png"
					},
					Simulate : "https://www.openmerchantaccount.com/img/simbtnsmall.png",
					CNCOpt : "http://cncopt.com/favicon.ico",
					one:"https://www.openmerchantaccount.com/img/swap1_2.png",
					two:"https://www.openmerchantaccount.com/img/swap2_3.png",
					three:"https://www.openmerchantaccount.com/img/swap3_4.png"
				}
			});
			qx.Class.define("TABS.SETTINGS", {							// [static]		Settings
				type : "static",
				statics : {
					__name : null,
					__store : null,
					__upload : null,
					__file : null,
					__reader : null,
					_Init : function () {
						var localStorage = ClientLib.Base.LocalStorage,
							player = ClientLib.Data.MainData.GetInstance().get_Player(),
							server = ClientLib.Data.MainData.GetInstance().get_Server();
						this.__name = "TABS.SETTINGS." + player.get_Id() + "." + server.get_WorldId();
						if (this.__store === null) {
							if (localStorage.get_IsSupported() && localStorage.GetItem(this.__name) !== null)
								this.__store = localStorage.GetItem(this.__name);
							else
								this.__store = {};
						}
						this.__store.$$Player = player.get_Name();
						this.__store.$$Server = server.get_Name();
						this.__store.$$Update = Date.now();
						if (localStorage.get_IsSupported())
							localStorage.SetItem(this.__name, this.__store);
					},
					get : function (prop, init) { //get or initialize a prop
						this._Init();
						if (this.__store[prop] === undefined && init !== undefined) {
							this.__store[prop] = init;
							this._Init();
						}
						return this.__store[prop];
					},
					set : function (prop, value) {
						this._Init();
						this.__store[prop] = value;
						this._Init();
						return value;
					},
					"delete" : function (prop) {
						this._Init();
						delete this.__store[prop];
						this._Init();
						return true;
					},
					reset : function () {
						var player = ClientLib.Data.MainData.GetInstance().get_Player(),
							server = ClientLib.Data.MainData.GetInstance().get_Server();
						this.__name = "TABS.SETTINGS." + player.get_Id() + "." + server.get_WorldId();
						window.localStorage.removeItem(this.__name);
						this.__store = null;
						this.__name = null;
						this._Init();
					},
					save : function () {
						var textFileAsBlob = new Blob([JSON.stringify(this.__store)], {
								type : 'text/plain'
							}),
							downloadLink = document.createElement("a");
						downloadLink.download = "TABS_Backup.json";
						if (window.webkitURL !== undefined)
							downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
						else {
							downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
							downloadLink.style.display = "none";
							document.body.appendChild(downloadLink);
						}
						downloadLink.click();
					},
					load : function () {
						if (this.__upload === null) {
							this.__upload = document.createElement("input");
							this.__upload.type = "file";
							this.__upload.id = "files";
							this.__upload.addEventListener('change', (function (e) {
									var files = e.target.files;
									if (files.length > 0)
										this.__reader.readAsText(files[0], 'UTF-8');
								}).bind(this), false);
							this.__upload.style.display = "none";
							document.body.appendChild(this.__upload);
						}
						if (this.__reader === null) {
							this.__reader = new FileReader();
							this.__reader.addEventListener("load", (function (e) {
									var fileText = e.target.result;
									try {
										var fileObject = JSON.parse(fileText);
										this.reset();
										for (var i in fileObject)
											this.set(i, fileObject[i]);
										alert("Game will reload now.");
										window.location.reload();
									} catch (f) {
										console.group("Tiberium Alliances Battle Simulator V2");
										console.error("Error loading file", f);
										console.groupEnd();
									}
								}).bind(this), false);
						}
						this.__upload.click();
					}
				}
			});
			qx.Class.define("TABS.UTIL.Formation", {					// [static]		Utilities for Army Formation
				type : "static",
				statics : {
					GetFormation : function (cityid, ownid) {
						var CityId = ((cityid !== undefined && cityid !== null) ? cityid : ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId()),
							OwnCity = ((ownid !== undefined && ownid !== null) ? ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(ownid) : ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity());
						if (OwnCity !== null)
							return OwnCity.get_CityArmyFormationsManager().GetFormationByTargetBaseId(CityId);
						else
							return null;
					},
					GetUnits : function (cityid, ownid) {
						var formation = this.GetFormation(cityid, ownid);
						if (formation !== null) {
							var units = formation.get_ArmyUnits();
							if (units !== null)
								return units.l;
						}
						return null;
					},
					GetUnitById : function (id, cityid, ownid) {
						var units = this.GetUnits(cityid, ownid);
						if (units !== null)
							for (var i = 0; i < units.length; i++)
								if (units[i].get_Id() == id)
									return units[i];
						return null;
					},
					Get : function (cityid, ownid) {
						/**
						 *	[{
						 *		id: [Number],		// UnitId (internal)
						 *		gid: [Number],		// Garnison Id (internal)
						 *		gs: [Number],		// Garnison State
						 *		i: [Number],		// MdbId
						 *		l: [Number],		// Level
						 *		h: [Number],		// Health
						 *		enabled: [Bool],	// Enabled (internal)
						 *		x: [Number],		// CoordX
						 *		y: [Number],		// CoordY
						 *		t: [Bool]			// IsTransportedCityEntity (internal/todo:kommt weg)
						 *	},{...}]
						 */
						var units = this.GetUnits(cityid, ownid),
							formation = [];
						if (units !== null) {
							for (var i = 0; i < units.length; i++) {
								formation.push({
									id : units[i].get_Id(),
									gid : (units[i].get_IsTransportedCityEntity() ? units[i].get_TransporterCityEntity().get_Id() : (units[i].get_TransportedCityEntity() !== null ? units[i].get_TransportedCityEntity().get_Id() : 0)),
									gs : (units[i].get_IsTransportedCityEntity() ? 2 : (units[i].get_TransportedCityEntity() !== null ? 1 : 0)),
									i : units[i].get_MdbUnitId(),
									l : units[i].get_CurrentLevel(),
									h : Math.ceil(units[i].get_Health()),
									enabled : units[i].get_Enabled(),
									x : units[i].get_CoordX(),
									y : units[i].get_CoordY(),
									t : units[i].get_IsTransportedCityEntity()
								});
							}
							return formation;
						}
						return null;
					},
					Set : function (formation, cityid, ownid) {
						/**
						 *	[{
						 *		id: [Number],		// UnitId
						 *		enabled: [Bool],	// Enabled
						 *		x: [Number],		// CoordX
						 *		y: [Number],		// CoordY
						 *		t: [Bool]			// IsTransportedCityEntity
						 *	},{...}]
						 */
						var CityId = ((cityid !== undefined && cityid !== null) ? cityid : ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId()),
							OwnId = ((ownid !== undefined && ownid !== null) ? ownid : ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCityId()),
							unit,
							target,
							freePos,
							transported = [],
							i,
							targetFormation = this.GetFormation(CityId, OwnId),
							getFreePos = function (formation) {
								for (var x = 0; x < ClientLib.Base.Util.get_ArmyMaxSlotCountX(); x++) {
									for (var y = 0; y < ClientLib.Base.Util.get_ArmyMaxSlotCountY(); y++) {
										if (formation.GetUnitByCoord(x, y) === null)
											return {
												x : x,
												y : y
											};
									}
								}
								return null;
							},
							freeTransported = function (unit, freePos) {
								if (unit.get_TransportedCityEntity() !== null)
									unit = unit.get_TransportedCityEntity();
								if (unit.get_IsTransportedCityEntity() && freePos !== null)
									unit.MoveBattleUnit(freePos.x, freePos.y);
							};
						if (targetFormation !== null) {
							for (i = 0; i < formation.length; i++) {
								unit = this.GetUnitById(formation[i].id, CityId, OwnId);
								if (formation[i].gs == 2) {
									transported.push(formation[i]);
									continue;
								}

								target = targetFormation.GetUnitByCoord(formation[i].x, formation[i].y);
								freePos = getFreePos(targetFormation);
								if (freePos !== null && target !== null)
									freeTransported(target, freePos);

								freePos = getFreePos(targetFormation);
								if (freePos !== null)
									freeTransported(unit, freePos);

								unit.set_Enabled(formation[i].enabled);
								target = targetFormation.GetUnitByCoord(formation[i].x, formation[i].y);
								if (target !== null && ClientLib.Base.Unit.CanBeTransported(target.get_UnitGameData_Obj(), unit.get_UnitGameData_Obj()))
									target.MoveBattleUnit(unit.get_CoordX(), unit.get_CoordY());
								else
									unit.MoveBattleUnit(formation[i].x, formation[i].y);
							}
							//transported units
							for (i = 0; i < transported.length; i++) {
								unit = this.GetUnitById(transported[i].id, CityId, OwnId);
								target = targetFormation.GetUnitByCoord(transported[i].x, transported[i].y);

								freePos = getFreePos(targetFormation);
								if (freePos !== null && target !== null)
									freeTransported(target, freePos);

								freePos = getFreePos(targetFormation);
								if (freePos !== null)
									freeTransported(unit, freePos);

								target = targetFormation.GetUnitByCoord(transported[i].x, transported[i].y);
								if (target !== null)
									target.set_Enabled(true);

								unit.set_Enabled(true);
								unit.MoveBattleUnit(transported[i].x, transported[i].y);
								if (target !== null)
									target.set_Enabled(transported[i].enabled);
                                else
                                    unit.set_Enabled(transported[i].enabled);
								if (target !== null)
                                    target.MoveBattleUnit(transported[i].x, transported[i].y);
							}
						}
					},
					Merge : function (formation, attacker) {
						for (var i in formation) {
							for (var j in attacker) {
								if (formation[i].gs == attacker[j].gs &&
									formation[i].i == attacker[j].i &&
									formation[i].l == attacker[j].l &&
									formation[i].x == attacker[j].x &&
									formation[i].y == attacker[j].y) {
									for (var k in attacker[j])
										formation[i][k] = attacker[j][k];
								}
							}
						}
						return formation;
					},
					IsFormationInCache : function () {
						var cache = TABS.CACHE.getInstance().check(this.Get());
						return (cache.result !== null);
					},
					Mirror : function (formation, pos, sel) {
						switch (pos) {
						case "h":
						case "v":
							break;
						default:
							return;
						}

						for (var i = 0; i < formation.length; i++) {
							if ((sel === null || formation[i].y == sel) && pos == "h")
								formation[i].x = Math.abs(formation[i].x - ClientLib.Base.Util.get_ArmyMaxSlotCountX() + 1);

							if ((sel === null || formation[i].x == sel) && pos == "v")
								formation[i].y = Math.abs(formation[i].y - ClientLib.Base.Util.get_ArmyMaxSlotCountY() + 1);
						}
						return formation;
					},
					SwapLines:function(formation, lineA, lineB) {
						lineAZoroBasedIndex = lineA - 1;
						lineBZeroBasedIndex = lineB - 1;
						for (var f = 0;f < formation.length;f++) {
							  
							 switch(formation[f].y) {
								case lineAZoroBasedIndex:
									formation[f].y = lineBZeroBasedIndex;
									break;
								case lineBZeroBasedIndex:
									formation[f].y = lineAZoroBasedIndex;
									break;							    
							}
						}
						return formation;
					},
					Shift : function (formation, pos, sel) {
						var v_shift = 0,
							h_shift = 0;

						switch (pos) {
						case "u":
							v_shift = -1;
							break;
						case "d":
							v_shift = 1;
							break;
						case "l":
							h_shift = -1;
							break;
						case "r":
							h_shift = 1;
							break;
						default:
							return;
						}

						for (var i = 0; i < formation.length; i++) {
							if ((sel === null || formation[i].y === sel) && (pos == "l" || pos == "r"))
								formation[i].x += h_shift;

							if ((sel === null || formation[i].x === sel) && (pos == "u" || pos == "d"))
								formation[i].y += v_shift;

							switch (formation[i].x) {
							case ClientLib.Base.Util.get_ArmyMaxSlotCountX():
								formation[i].x = 0;
								break;
							case -1:
								formation[i].x = ClientLib.Base.Util.get_ArmyMaxSlotCountX() - 1;
								break;
							}

							switch (formation[i].y) {
							case ClientLib.Base.Util.get_ArmyMaxSlotCountY():
								formation[i].y = 0;
								break;
							case -1:
								formation[i].y = ClientLib.Base.Util.get_ArmyMaxSlotCountY() - 1;
								break;
							}
						}
						return formation;
					},
					set_Enabled : function (formation, set, EUnitGroup) {
						if (set === null)
							set = true;
						var all = (EUnitGroup != ClientLib.Data.EUnitGroup.Infantry && EUnitGroup != ClientLib.Data.EUnitGroup.Vehicle && EUnitGroup != ClientLib.Data.EUnitGroup.Aircraft);
						for (var i = 0; i < formation.length; i++) {
							var unitGroup = this.GetUnitGroupTypeFromUnit(ClientLib.Res.ResMain.GetInstance().GetUnit_Obj(formation[i].i));
							if (all || (EUnitGroup == unitGroup && formation[i].gs === 0))
								formation[i].enabled = set;
						}

						return formation;
					},
					toggle_Enabled : function (formation, EUnitGroup) {
						var all = (EUnitGroup != ClientLib.Data.EUnitGroup.Infantry && EUnitGroup != ClientLib.Data.EUnitGroup.Vehicle && EUnitGroup != ClientLib.Data.EUnitGroup.Aircraft);
						for (var i = 0, num_total = 0, num_enabled = 0; i < formation.length; i++) {
							var unitGroup = this.GetUnitGroupTypeFromUnit(ClientLib.Res.ResMain.GetInstance().GetUnit_Obj(formation[i].i));
							if (all || (EUnitGroup == unitGroup && formation[i].gs === 0)) {
								num_total++;
								if (formation[i].enabled)
									num_enabled++;
							}
						}

						return this.set_Enabled(formation, (num_enabled < (num_total / 2)), EUnitGroup);
					},
					GetUnitGroupTypeFromUnit : function (unit) {
						if (unit === null)
							return ClientLib.Data.EUnitGroup.None;
						if (unit.pt == ClientLib.Base.EPlacementType.Offense)
							switch (unit.mt) {
							case ClientLib.Base.EUnitMovementType.Feet:
								return ClientLib.Data.EUnitGroup.Infantry;
							case ClientLib.Base.EUnitMovementType.Wheel:
							case ClientLib.Base.EUnitMovementType.Track:
								return ClientLib.Data.EUnitGroup.Vehicle;
							case ClientLib.Base.EUnitMovementType.Air:
							case ClientLib.Base.EUnitMovementType.Air2:
								return ClientLib.Data.EUnitGroup.Aircraft;
							}
						else if (unit.pt == ClientLib.Base.EPlacementType.Defense)
							return ClientLib.Data.EUnitGroup.Defense;
						else
							return ClientLib.Data.EUnitGroup.None;
					}
				}
			});
			qx.Class.define("TABS.UTIL.Stats", {						// [static]		Utilities for Stats calculation
				type : "static",
				statics : {
					get_LootFromCurrentCity : function () {
						var LootFromCurrentCity = ClientLib.API.Battleground.GetInstance().GetLootFromCurrentCity(),
							LootClass = new TABS.STATS.Entity.Resource(),
							Loot = LootClass.getAny();
						if (LootFromCurrentCity !== null) {
							for (var i = 0; i < LootFromCurrentCity.length; i++)
								Loot[LootFromCurrentCity[i].Type] = LootFromCurrentCity[i].Count;
							LootClass.setAny(Loot);
							return LootClass;
						} else
							return null;
					},
					get_RepairCosts : function (mdbId, level, HealthPoints, AttackCounter) {
						var ResourcesClass = new TABS.STATS.Entity.Resource(),
							Resources = ResourcesClass.getAny(),
							unit = ClientLib.Res.ResMain.GetInstance().GetUnit_Obj(mdbId),
							Health,
							dmgRatio,
							costs;
						AttackCounter = (AttackCounter !== undefined && AttackCounter !== null ? AttackCounter : 0);

						if (HealthPoints instanceof TABS.STATS.Entity.HealthPoints)
							Health = HealthPoints;
						else
							Health = new TABS.STATS.Entity.HealthPoints(HealthPoints);

						if (Health.getStart() != Health.getEnd()) {
							dmgRatio = (Health.getStart() - Health.getEnd()) / Health.getMax();
							if (unit.pt !== ClientLib.Base.EPlacementType.Offense || ClientLib.API.Util.GetOwnUnitRepairCosts === undefined)
								costs = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity() !== null ? ClientLib.API.Util.GetUnitRepairCosts(level, mdbId, dmgRatio) : null;
							else
								costs = ClientLib.API.Util.GetOwnUnitRepairCosts(level, mdbId, dmgRatio);

							for (var i = 0; costs !== null && i < costs.length; i++)
								switch (costs[i].Type) {
								case ClientLib.Base.EResourceType.Tiberium:
								case ClientLib.Base.EResourceType.Crystal:
								case ClientLib.Base.EResourceType.Gold:
								case ClientLib.Base.EResourceType.ResearchPoints:
									Resources[costs[i].Type] = costs[i].Count * Math.pow(0.7, AttackCounter);
									break;
								default:
									Resources[costs[i].Type] = costs[i].Count;
									break;
								}
						}

						if (Resources[ClientLib.Base.EResourceType.ResearchPoints] > 0)
							Resources[ClientLib.Base.EResourceType.ResearchPoints] = Math.max(1, Math.floor(Resources[ClientLib.Base.EResourceType.ResearchPoints] * dmgRatio));

						ResourcesClass.setAny(Resources);
						return ResourcesClass;
					},
					get_BuildingInfo : function (cityid) {
						var BuildingInfo = {},
							City = ((cityid !== undefined && cityid !== null) ? ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(cityid) : ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity());
						if (City !== null) {
							var CityBuildingsData = City.get_CityBuildingsData(),
								get_BuildingInfo = function (Building) {
									if (Building !== null)
										return {
											MdbId : Building.get_TechGameData_Obj().c,
											x : Building.get_CoordX(),
											y : Building.get_CoordY()
										};
									else
										return null;
								};

							BuildingInfo.Construction_Yard = get_BuildingInfo(CityBuildingsData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Construction_Yard) || CityBuildingsData.GetBuildingByMDBId(ClientLib.Base.ETech.FOR_Fortress_ConstructionYard));
							BuildingInfo.Command_Center = get_BuildingInfo(CityBuildingsData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Command_Center));
							BuildingInfo.Barracks = get_BuildingInfo(CityBuildingsData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Barracks));
							BuildingInfo.Factory = get_BuildingInfo(CityBuildingsData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Factory));
							BuildingInfo.Airport = get_BuildingInfo(CityBuildingsData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Airport));
							BuildingInfo.Defense_Facility = get_BuildingInfo(CityBuildingsData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Defense_Facility));
							BuildingInfo.Defense_HQ = get_BuildingInfo(CityBuildingsData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Defense_HQ));
							BuildingInfo.Support = get_BuildingInfo(CityBuildingsData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Air) || CityBuildingsData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Art) || CityBuildingsData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Ion));
						}
						return BuildingInfo;
					},
					_GetModuleByType : function (modules, type) {
						for (var i = 0; i < modules.length; i++) {
							if (modules[i].t == type)
								return modules[i];
						}
						return null;
					},
					_patchUnitLifePoints : function (unit, activeModules) {
						var newUnit = qx.lang.Object.clone(unit, true),
							module = this._GetModuleByType(newUnit.m, ClientLib.Base.EUnitModuleType.HitpointOverride);

						if (module !== null && activeModules.indexOf(module.i) != -1)
							newUnit.lp = module.h;

						return newUnit;
					},
					get_UnitMaxHealthByLevel : function (level, unit, bonus, activeModules) {
						return Math.floor(ClientLib.API.Util.GetUnitMaxHealthByLevel(level, this._patchUnitLifePoints(unit, activeModules), bonus)) * 16;
					},
					get_Stats : function (data) {
						try {
							var StatsClass = new TABS.STATS(),
								Stats = StatsClass.getAny(),
								sim = {},
								buildings = data.d.s,
								buildingInfo = this.get_BuildingInfo(data.d.di),
								efficiency = 0,
								ve_level = 1,
								defender = data.d.d,
								attacker = data.d.a,
								unit,
								unitHealthPoints = new TABS.STATS.Entity.HealthPoints(),
								unitRepairCosts,
								unitMaxHealthPoints,
								i;

							function addObject(a, b) {
								for (var i in a)
									a[i] += b[i];
								return a;
							}

							//simulation
							for (i = 0; i < data.e.length; i++)
								sim[data.e[i].Key] = data.e[i].Value;

							//BattleDuration
							Stats.BattleDuration = (data.d.cs * 100) + (data.d.cs < (data.d.md * 10) ? 3000 : 0);

							for (i = 0; i < buildings.length; i++) {
								unit = ClientLib.Res.ResMain.GetInstance().GetUnit_Obj(buildings[i].i);

								//maxHealth
								switch (data.d.df) {
								case ClientLib.Base.EFactionType.GDIFaction:
								case ClientLib.Base.EFactionType.NODFaction:
									unitMaxHealthPoints = this.get_UnitMaxHealthByLevel(buildings[i].l, unit, true, data.d.dm);
                                    unitHealthPoints.setMax(sim[buildings[i].ci].mh);
                                    unitHealthPoints.setStart(sim[buildings[i].ci].h);
									break;
								default:
									unitMaxHealthPoints = this.get_UnitMaxHealthByLevel(buildings[i].l, unit, false, data.d.dm);
                                    unitHealthPoints.setMax(Math.max(unitMaxHealthPoints, buildings[i].h * 16));
                                    unitHealthPoints.setStart(buildings[i].h * 16);
									break;
								}
                                
								unitHealthPoints.setEnd(sim[buildings[i].ci].h);
								unitRepairCosts = this.get_RepairCosts(buildings[i].i, buildings[i].l, unitHealthPoints);

								addObject(Stats.Enemy.Overall.HealthPoints, unitHealthPoints.getAny());
								addObject(Stats.Enemy.Overall.Resource, unitRepairCosts.getAny());

								addObject(Stats.Enemy.Structure.HealthPoints, unitHealthPoints.getAny());
								addObject(Stats.Enemy.Structure.Resource, unitRepairCosts.getAny());

								switch (parseInt(ClientLib.Base.Tech.GetTechNameFromTechId(unit.tl, unit.f), 10)) {
								case ClientLib.Base.ETechName.Construction_Yard:
									addObject(Stats.Enemy.Construction_Yard.HealthPoints, unitHealthPoints.getAny());
									addObject(Stats.Enemy.Construction_Yard.Resource, unitRepairCosts.getAny());
									break;
								case ClientLib.Base.ETechName.Command_Center:
									addObject(Stats.Enemy.Command_Center.HealthPoints, unitHealthPoints.getAny());
									addObject(Stats.Enemy.Command_Center.Resource, unitRepairCosts.getAny());
									break;
								case ClientLib.Base.ETechName.Barracks:
									addObject(Stats.Enemy.Barracks.HealthPoints, unitHealthPoints.getAny());
									addObject(Stats.Enemy.Barracks.Resource, unitRepairCosts.getAny());
									break;
								case ClientLib.Base.ETechName.Factory:
									addObject(Stats.Enemy.Factory.HealthPoints, unitHealthPoints.getAny());
									addObject(Stats.Enemy.Factory.Resource, unitRepairCosts.getAny());
									break;
								case ClientLib.Base.ETechName.Airport:
									addObject(Stats.Enemy.Airport.HealthPoints, unitHealthPoints.getAny());
									addObject(Stats.Enemy.Airport.Resource, unitRepairCosts.getAny());
									break;
								case ClientLib.Base.ETechName.Defense_Facility:
									addObject(Stats.Enemy.Defense_Facility.HealthPoints, unitHealthPoints.getAny());
									addObject(Stats.Enemy.Defense_Facility.Resource, unitRepairCosts.getAny());
									efficiency = 0.7 * (unitHealthPoints.getEnd() / unitHealthPoints.getMax());
									ve_level = buildings[i].l;
									break;
								case ClientLib.Base.ETechName.Defense_HQ:
									addObject(Stats.Enemy.Defense_HQ.HealthPoints, unitHealthPoints.getAny());
									addObject(Stats.Enemy.Defense_HQ.Resource, unitRepairCosts.getAny());
									break;
								case ClientLib.Base.ETechName.Support_Air:
								case ClientLib.Base.ETechName.Support_Ion:
								case ClientLib.Base.ETechName.Support_Art:
									addObject(Stats.Enemy.Support.HealthPoints, unitHealthPoints.getAny());
									addObject(Stats.Enemy.Support.Resource, unitRepairCosts.getAny());
									break;
								}

								if (buildingInfo.Construction_Yard !== undefined) {
									if (buildingInfo.Construction_Yard !== null && buildingInfo.Construction_Yard.x == buildings[i].x && buildingInfo.Construction_Yard.y < buildings[i].y) {
										Stats.Enemy.Construction_Yard.HealthPoints.maxFront += unitHealthPoints.getMax();
										Stats.Enemy.Construction_Yard.HealthPoints.startFront += unitHealthPoints.getStart();
										Stats.Enemy.Construction_Yard.HealthPoints.endFront += unitHealthPoints.getEnd();
									}
									if (buildingInfo.Command_Center !== null && buildingInfo.Command_Center.x == buildings[i].x && buildingInfo.Command_Center.y < buildings[i].y) {
										Stats.Enemy.Command_Center.HealthPoints.maxFront += unitHealthPoints.getMax();
										Stats.Enemy.Command_Center.HealthPoints.startFront += unitHealthPoints.getStart();
										Stats.Enemy.Command_Center.HealthPoints.endFront += unitHealthPoints.getEnd();
									}
									if (buildingInfo.Barracks !== null && buildingInfo.Barracks.x == buildings[i].x && buildingInfo.Barracks.y < buildings[i].y) {
										Stats.Enemy.Barracks.HealthPoints.maxFront += unitHealthPoints.getMax();
										Stats.Enemy.Barracks.HealthPoints.startFront += unitHealthPoints.getStart();
										Stats.Enemy.Barracks.HealthPoints.endFront += unitHealthPoints.getEnd();
									}
									if (buildingInfo.Factory !== null && buildingInfo.Factory.x == buildings[i].x && buildingInfo.Factory.y < buildings[i].y) {
										Stats.Enemy.Factory.HealthPoints.maxFront += unitHealthPoints.getMax();
										Stats.Enemy.Factory.HealthPoints.startFront += unitHealthPoints.getStart();
										Stats.Enemy.Factory.HealthPoints.endFront += unitHealthPoints.getEnd();
									}
									if (buildingInfo.Airport !== null && buildingInfo.Airport.x == buildings[i].x && buildingInfo.Airport.y < buildings[i].y) {
										Stats.Enemy.Airport.HealthPoints.maxFront += unitHealthPoints.getMax();
										Stats.Enemy.Airport.HealthPoints.startFront += unitHealthPoints.getStart();
										Stats.Enemy.Airport.HealthPoints.endFront += unitHealthPoints.getEnd();
									}
									if (buildingInfo.Defense_Facility !== null && buildingInfo.Defense_Facility.x == buildings[i].x && buildingInfo.Defense_Facility.y < buildings[i].y) {
										Stats.Enemy.Defense_Facility.HealthPoints.maxFront += unitHealthPoints.getMax();
										Stats.Enemy.Defense_Facility.HealthPoints.startFront += unitHealthPoints.getStart();
										Stats.Enemy.Defense_Facility.HealthPoints.endFront += unitHealthPoints.getEnd();
									}
									if (buildingInfo.Defense_HQ !== null && buildingInfo.Defense_HQ.x == buildings[i].x && buildingInfo.Defense_HQ.y < buildings[i].y) {
										Stats.Enemy.Defense_HQ.HealthPoints.maxFront += unitHealthPoints.getMax();
										Stats.Enemy.Defense_HQ.HealthPoints.startFront += unitHealthPoints.getStart();
										Stats.Enemy.Defense_HQ.HealthPoints.endFront += unitHealthPoints.getEnd();
									}
									if (buildingInfo.Support !== null && buildingInfo.Support.x == buildings[i].x && buildingInfo.Support.y < buildings[i].y) {
										Stats.Enemy.Support.HealthPoints.maxFront += unitHealthPoints.getMax();
										Stats.Enemy.Support.HealthPoints.startFront += unitHealthPoints.getStart();
										Stats.Enemy.Support.HealthPoints.endFront += unitHealthPoints.getEnd();
									}
								}
							}
							for (i = 0; i < defender.length; i++) {
								unit = ClientLib.Res.ResMain.GetInstance().GetUnit_Obj(defender[i].i);

								//maxHealth
								switch (data.d.df) {
								case ClientLib.Base.EFactionType.GDIFaction:
								case ClientLib.Base.EFactionType.NODFaction:
									unitMaxHealthPoints = this.get_UnitMaxHealthByLevel(defender[i].l, unit, true, data.d.dm);
									break;
								default:
									unitMaxHealthPoints = this.get_UnitMaxHealthByLevel(defender[i].l, unit, false, data.d.dm);
									break;
								}

								unitHealthPoints.setMax(Math.max(unitMaxHealthPoints, defender[i].h * 16));
								unitHealthPoints.setStart(defender[i].h * 16);
								unitHealthPoints.setEnd(sim[defender[i].ci].h);
								unitHealthPoints.setRep((((defender[i].h * 16) - (sim[defender[i].ci].h)) * efficiency * ve_level) / Math.max(ve_level, defender[i].l));
								unitRepairCosts = this.get_RepairCosts(defender[i].i, defender[i].l, unitHealthPoints, defender[i].ac);

								addObject(Stats.Enemy.Overall.HealthPoints, unitHealthPoints.getAny());
								addObject(Stats.Enemy.Overall.Resource, unitRepairCosts.getAny());
								addObject(Stats.Enemy.Defense.HealthPoints, unitHealthPoints.getAny());
								addObject(Stats.Enemy.Defense.Resource, unitRepairCosts.getAny());
								if (unit.ptt == ClientLib.Base.EArmorType.NONE) {
									addObject(Stats.Enemy.DefenseNonArmored.HealthPoints, unitHealthPoints.getAny());
									addObject(Stats.Enemy.DefenseNonArmored.Resource, unitRepairCosts.getAny());
								} else {
									addObject(Stats.Enemy.DefenseArmored.HealthPoints, unitHealthPoints.getAny());
									addObject(Stats.Enemy.DefenseArmored.Resource, unitRepairCosts.getAny());
								}

								if (buildingInfo.Construction_Yard !== undefined && unit.mt == ClientLib.Base.EUnitMovementType.Structure) {
									if (buildingInfo.Construction_Yard !== null && buildingInfo.Construction_Yard.x == defender[i].x) {
										Stats.Enemy.Construction_Yard.HealthPoints.maxFront += unitHealthPoints.getMax();
										Stats.Enemy.Construction_Yard.HealthPoints.startFront += unitHealthPoints.getStart();
										Stats.Enemy.Construction_Yard.HealthPoints.endFront += unitHealthPoints.getEnd();
									}
									if (buildingInfo.Command_Center !== null && buildingInfo.Command_Center.x == defender[i].x) {
										Stats.Enemy.Command_Center.HealthPoints.maxFront += unitHealthPoints.getMax();
										Stats.Enemy.Command_Center.HealthPoints.startFront += unitHealthPoints.getStart();
										Stats.Enemy.Command_Center.HealthPoints.endFront += unitHealthPoints.getEnd();
									}
									if (buildingInfo.Barracks !== null && buildingInfo.Barracks.x == defender[i].x) {
										Stats.Enemy.Barracks.HealthPoints.maxFront += unitHealthPoints.getMax();
										Stats.Enemy.Barracks.HealthPoints.startFront += unitHealthPoints.getStart();
										Stats.Enemy.Barracks.HealthPoints.endFront += unitHealthPoints.getEnd();
									}
									if (buildingInfo.Factory !== null && buildingInfo.Factory.x == defender[i].x) {
										Stats.Enemy.Factory.HealthPoints.maxFront += unitHealthPoints.getMax();
										Stats.Enemy.Factory.HealthPoints.startFront += unitHealthPoints.getStart();
										Stats.Enemy.Factory.HealthPoints.endFront += unitHealthPoints.getEnd();
									}
									if (buildingInfo.Airport !== null && buildingInfo.Airport.x == defender[i].x) {
										Stats.Enemy.Airport.HealthPoints.maxFront += unitHealthPoints.getMax();
										Stats.Enemy.Airport.HealthPoints.startFront += unitHealthPoints.getStart();
										Stats.Enemy.Airport.HealthPoints.endFront += unitHealthPoints.getEnd();
									}
									if (buildingInfo.Defense_Facility !== null && buildingInfo.Defense_Facility.x == defender[i].x) {
										Stats.Enemy.Defense_Facility.HealthPoints.maxFront += unitHealthPoints.getMax();
										Stats.Enemy.Defense_Facility.HealthPoints.startFront += unitHealthPoints.getStart();
										Stats.Enemy.Defense_Facility.HealthPoints.endFront += unitHealthPoints.getEnd();
									}
									if (buildingInfo.Defense_HQ !== null && buildingInfo.Defense_HQ.x == defender[i].x) {
										Stats.Enemy.Defense_HQ.HealthPoints.maxFront += unitHealthPoints.getMax();
										Stats.Enemy.Defense_HQ.HealthPoints.startFront += unitHealthPoints.getStart();
										Stats.Enemy.Defense_HQ.HealthPoints.endFront += unitHealthPoints.getEnd();
									}
									if (buildingInfo.Support !== null && buildingInfo.Support.x == defender[i].x) {
										Stats.Enemy.Support.HealthPoints.maxFront += unitHealthPoints.getMax();
										Stats.Enemy.Support.HealthPoints.startFront += unitHealthPoints.getStart();
										Stats.Enemy.Support.HealthPoints.endFront += unitHealthPoints.getEnd();
									}
								}
							}

							if (ClientLib.API.Util.GetOwnUnitRepairCosts === undefined)
								ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentCityId(data.d.ai);

							for (i = 0; i < attacker.length; i++) {
								unit = ClientLib.Res.ResMain.GetInstance().GetUnit_Obj(attacker[i].i);

								//maxHealth
								unitMaxHealthPoints = this.get_UnitMaxHealthByLevel(attacker[i].l, unit, false, data.d.am);

								unitHealthPoints.setMax(Math.max(unitMaxHealthPoints, attacker[i].h * 16));
								unitHealthPoints.setStart(attacker[i].h * 16);
								if (sim[attacker[i].ci] !== undefined)
									unitHealthPoints.setEnd(sim[attacker[i].ci].h);
								else
									unitHealthPoints.setEnd(attacker[i].h * 16);
								unitRepairCosts = this.get_RepairCosts(attacker[i].i, attacker[i].l, unitHealthPoints);

								addObject(Stats.Offense.Overall.HealthPoints, unitHealthPoints.getAny());
								addObject(Stats.Offense.Overall.Resource, unitRepairCosts.getAny());
								switch (unit.mt) {
								case ClientLib.Base.EUnitMovementType.Feet:
									addObject(Stats.Offense.Infantry.HealthPoints, unitHealthPoints.getAny());
									addObject(Stats.Offense.Infantry.Resource, unitRepairCosts.getAny());
									break;
								case ClientLib.Base.EUnitMovementType.Wheel:
								case ClientLib.Base.EUnitMovementType.Track:
									addObject(Stats.Offense.Vehicle.HealthPoints, unitHealthPoints.getAny());
									addObject(Stats.Offense.Vehicle.Resource, unitRepairCosts.getAny());
									break;
								case ClientLib.Base.EUnitMovementType.Air:
								case ClientLib.Base.EUnitMovementType.Air2:
									addObject(Stats.Offense.Aircraft.HealthPoints, unitHealthPoints.getAny());
									addObject(Stats.Offense.Aircraft.Resource, unitRepairCosts.getAny());
									break;
								}
							}

							if (ClientLib.API.Util.GetOwnUnitRepairCosts === undefined)
								ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentCityId(data.d.di);

							StatsClass.setAny(Stats);
							return StatsClass;
						} catch (e) {
							console.group("Tiberium Alliances Battle Simulator V2");
							console.error("Error in TABS.UTIL.Stats.get_Stats()", e);
							console.groupEnd();
						}
					},
					patchGetUnitRepairCosts : function () {
						try {
							for (var i in ClientLib.Data.Cities.prototype) {
								if (typeof ClientLib.Data.Cities.prototype[i] === "function" &&
									ClientLib.Data.Cities.prototype[i] == ClientLib.Data.Cities.prototype.get_CurrentCity &&
									i !== "get_CurrentCity")
									break;
							}
							var GetOwnUnitRepairCosts = ClientLib.API.Util.GetUnitRepairCosts.toString().replace(i, "get_CurrentOwnCity"),
								args = GetOwnUnitRepairCosts.substring(GetOwnUnitRepairCosts.indexOf("(") + 1, GetOwnUnitRepairCosts.indexOf(")")),
								body = GetOwnUnitRepairCosts.substring(GetOwnUnitRepairCosts.indexOf("{") + 1, GetOwnUnitRepairCosts.lastIndexOf("}"));
							/*jslint evil: true */
							ClientLib.API.Util.GetOwnUnitRepairCosts = Function(args, body);
							/*jslint evil: false */
						} catch (e) {
							console.group("Tiberium Alliances Battle Simulator V2");
							console.error("Error setting up ClientLib.API.Util.GetOwnUnitRepairCosts", e);
							console.groupEnd();
						}
					}
				},
				defer : function (statics) {
					try {
						statics.patchGetUnitRepairCosts();
					} catch (e) {
						console.group("Tiberium Alliances Battle Simulator V2");
						console.error("Error setting up UTIL.Stats defer", e);
						console.groupEnd();
					}
				}
			});
            qx.Class.define("TABS.UTIL.Battleground", {					// [static]		Battleground
				type : "static",
				statics : {
                    StartReplay : function (cityid, combat) {
                        qx.core.Init.getApplication().getPlayArea().setView(ClientLib.Data.PlayerAreaViewMode.pavmCombatReplay, cityid, 0, 0);
                        ClientLib.Vis.VisMain.GetInstance().get_Battleground().Init();
                        ClientLib.Vis.VisMain.GetInstance().get_Battleground().LoadCombatDirect(combat);
                        qx.event.Timer.once(function () {
                            ClientLib.Vis.VisMain.GetInstance().get_Battleground().RestartReplay();
                            ClientLib.Vis.VisMain.GetInstance().get_Battleground().set_ReplaySpeed(1);
                        }, this, 0);
                    }
                }
			});
			qx.Class.define("TABS.UTIL.CNCOpt", {						// [static]		CNCOpt
				type : "static",
				statics : {
					keymap : {
						"GDI_Accumulator" : "a",
						"GDI_Refinery" : "r",
						"GDI_Trade Center" : "u",
						"GDI_Silo" : "s",
						"GDI_Power Plant" : "p",
						"GDI_Construction Yard" : "y",
						"GDI_Airport" : "d",
						"GDI_Barracks" : "b",
						"GDI_Factory" : "f",
						"GDI_Defense HQ" : "q",
						"GDI_Defense Facility" : "w",
						"GDI_Command Center" : "e",
						"GDI_Support_Art" : "z",
						"GDI_Support_Air" : "x",
						"GDI_Support_Ion" : "i",
						"GDI_Harvester" : "h",
						"GDI_Harvester_Crystal" : "n",
						"FOR_Silo" : "s",
						"FOR_Refinery" : "r",
						"FOR_Tiberium Booster" : "b",
						"FOR_Crystal Booster" : "v",
						"FOR_Trade Center" : "u",
						"FOR_Defense Facility" : "w",
						"FOR_Construction Yard" : "y",
						"FOR_Harvester_Tiberium" : "h",
						"FOR_Defense HQ" : "q",
						"FOR_Harvester_Crystal" : "n",
						"NOD_Refinery" : "r",
						"NOD_Power Plant" : "p",
						"NOD_Harvester" : "h",
						"NOD_Construction Yard" : "y",
						"NOD_Airport" : "d",
						"NOD_Trade Center" : "u",
						"NOD_Defense HQ" : "q",
						"NOD_Barracks" : "b",
						"NOD_Silo" : "s",
						"NOD_Factory" : "f",
						"NOD_Harvester_Crystal" : "n",
						"NOD_Command Post" : "e",
						"NOD_Support_Art" : "z",
						"NOD_Support_Ion" : "i",
						"NOD_Accumulator" : "a",
						"NOD_Support_Air" : "x",
						"NOD_Defense Facility" : "w",
						"GDI_Wall" : "w",
						"GDI_Cannon" : "c",
						"GDI_Antitank Barrier" : "t",
						"GDI_Barbwire" : "b",
						"GDI_Turret" : "m",
						"GDI_Flak" : "f",
						"GDI_Art Inf" : "r",
						"GDI_Art Air" : "e",
						"GDI_Art Tank" : "a",
						"GDI_Def_APC Guardian" : "g",
						"GDI_Def_Missile Squad" : "q",
						"GDI_Def_Pitbull" : "p",
						"GDI_Def_Predator" : "d",
						"GDI_Def_Sniper" : "s",
						"GDI_Def_Zone Trooper" : "z",
						"NOD_Def_Antitank Barrier" : "t",
						"NOD_Def_Art Air" : "e",
						"NOD_Def_Art Inf" : "r",
						"NOD_Def_Art Tank" : "a",
						"NOD_Def_Attack Bike" : "p",
						"NOD_Def_Barbwire" : "b",
						"NOD_Def_Black Hand" : "z",
						"NOD_Def_Cannon" : "c",
						"NOD_Def_Confessor" : "s",
						"NOD_Def_Flak" : "f",
						"NOD_Def_MG Nest" : "m",
						"NOD_Def_Militant Rocket Soldiers" : "q",
						"NOD_Def_Reckoner" : "g",
						"NOD_Def_Scorpion Tank" : "d",
						"NOD_Def_Wall" : "w",
						"FOR_Wall" : "w",
						"FOR_Barbwire_VS_Inf" : "b",
						"FOR_Barrier_VS_Veh" : "t",
						"FOR_Inf_VS_Inf" : "g",
						"FOR_Inf_VS_Veh" : "r",
						"FOR_Inf_VS_Air" : "q",
						"FOR_Sniper" : "n",
						"FOR_Mammoth" : "y",
						"FOR_Veh_VS_Inf" : "o",
						"FOR_Veh_VS_Veh" : "s",
						"FOR_Veh_VS_Air" : "u",
						"FOR_Turret_VS_Inf" : "m",
						"FOR_Turret_VS_Inf_ranged" : "a",
						"FOR_Turret_VS_Veh" : "v",
						"FOR_Turret_VS_Veh_ranged" : "d",
						"FOR_Turret_VS_Air" : "f",
						"FOR_Turret_VS_Air_ranged" : "e",
						"GDI_APC Guardian" : "g",
						"GDI_Commando" : "c",
						"GDI_Firehawk" : "f",
						"GDI_Juggernaut" : "j",
						"GDI_Kodiak" : "k",
						"GDI_Mammoth" : "m",
						"GDI_Missile Squad" : "q",
						"GDI_Orca" : "o",
						"GDI_Paladin" : "a",
						"GDI_Pitbull" : "p",
						"GDI_Predator" : "d",
						"GDI_Riflemen" : "r",
						"GDI_Sniper Team" : "s",
						"GDI_Zone Trooper" : "z",
						"NOD_Attack Bike" : "b",
						"NOD_Avatar" : "a",
						"NOD_Black Hand" : "z",
						"NOD_Cobra" : "r",
						"NOD_Commando" : "c",
						"NOD_Confessor" : "s",
						"NOD_Militant Rocket Soldiers" : "q",
						"NOD_Militants" : "m",
						"NOD_Reckoner" : "k",
						"NOD_Salamander" : "l",
						"NOD_Scorpion Tank" : "o",
						"NOD_Specter Artilery" : "p",
						"NOD_Venom" : "v",
						"NOD_Vertigo" : "t",
						"<last>" : "."
					},
					createLink : function (city, own_city) {
						city = ((city !== undefined && city !== null) ? city : ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity());
						own_city = ((own_city !== undefined && own_city !== null) ? own_city : ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity());

						function findTechLayout(city) {
							for (var k in city)
								if ((typeof(city[k]) == "object") && city[k] && 0 in city[k] && 8 in city[k])
									if ((typeof(city[k][0]) == "object") && city[k][0] && city[k][0] && 0 in city[k][0] && 15 in city[k][0])
										if ((typeof(city[k][0][0]) == "object") && city[k][0][0] && "BuildingIndex" in city[k][0][0])
											return city[k];
							return null;
						}
						function findBuildings(city) {
							var cityBuildings = city.get_CityBuildingsData();
							for (var k in cityBuildings) {
								if ((typeof(cityBuildings[k]) === "object") && cityBuildings[k] && "d" in cityBuildings[k] && "c" in cityBuildings[k] && cityBuildings[k].c > 0)
									return cityBuildings[k].d;
							}
						}
						function getUnitArrays(city) {
							var ret = [];
							for (var k in city)
								if ((typeof(city[k]) == "object") && city[k])
									for (var k2 in city[k])
										if ((typeof(city[k][k2]) == "object") && city[k][k2] && "d" in city[k][k2]) {
											var lst = city[k][k2].d;
											if ((typeof(lst) == "object") && lst)
												for (var i in lst)
													if (typeof(lst[i]) == "object" && lst[i] && "get_CurrentLevel" in lst[i])
														ret.push(lst);
										}
							return ret;
						}
						function getDefenseUnits(city) {
							var arr = getUnitArrays(city);
							for (var i = 0; i < arr.length; ++i)
								for (var j in arr[i])
									if (TABS.UTIL.Formation.GetUnitGroupTypeFromUnit(arr[i][j].get_UnitGameData_Obj()) == ClientLib.Data.EUnitGroup.Defense)
										return arr[i];
							return [];
						}
						function getFactionKey (faction) {
							switch (faction) {
							case ClientLib.Base.EFactionType.GDIFaction:
								return "G";
							case ClientLib.Base.EFactionType.NODFaction:
								return "N";
							case ClientLib.Base.EFactionType.FORFaction:
							case ClientLib.Base.EFactionType.NPCBase:
							case ClientLib.Base.EFactionType.NPCCamp:
							case ClientLib.Base.EFactionType.NPCOutpost:
							case ClientLib.Base.EFactionType.NPCFortress:
								return "F";
							default:
								console.log("cncopt: Unknown faction: " + city.get_CityFaction());
								return "E";
							}
						}
						function getUnitKey (unit) {
							if (typeof TABS.UTIL.CNCOpt.keymap[unit.n] !== "undefined") {
								return TABS.UTIL.CNCOpt.keymap[unit.n];
							} else {
								return ".";
							}
						}

						var link = "http://cncopt.com/?map=",
							defense_units = [],
							offense_units = [],
							defense_unit_list = getDefenseUnits(city),
							army = own_city.get_CityArmyFormationsManager().GetFormationByTargetBaseId(city.get_Id()),
							offense_unit_list,
							techLayout = findTechLayout(city),
							buildings = findBuildings(city),
							row,
							spot,
							level,
							building,
							defense_unit,
							offense_unit,
							alliance = ClientLib.Data.MainData.GetInstance().get_Alliance(),
							i;

						link += "3|"; // link version
						link += getFactionKey(city.get_CityFaction()) + "|";
						link += getFactionKey(own_city.get_CityFaction()) + "|";
						link += city.get_Name() + "|";

						for (i = 0; i < 20; ++i) {
							defense_units.push([null, null, null, null, null, null, null, null, null]);
							offense_units.push([null, null, null, null, null, null, null, null, null]);
						}
						for (i in defense_unit_list)
							defense_units[defense_unit_list[i].get_CoordX()][defense_unit_list[i].get_CoordY() + 8] = defense_unit_list[i];
						if (army.get_ArmyUnits() !== null)
							offense_unit_list = army.get_ArmyUnits().l;
						else
							offense_unit_list = city.get_CityUnitsData().get_OffenseUnits().d;
						for (i in offense_unit_list)
							if (offense_unit_list[i].get_Enabled() && !offense_unit_list[i].get_IsTransportedCityEntity())
								offense_units[offense_unit_list[i].get_CoordX()][offense_unit_list[i].get_CoordY() + 16] = offense_unit_list[i];

						for (i = 0; i < 20; ++i) {
							row = [];
							for (var j = 0; j < 9; ++j) {
								spot = i > 16 ? null : techLayout[j][i];
								level = 0;
								building = null;
								if (spot && spot.BuildingIndex >= 0) {
									building = buildings[spot.BuildingIndex];
									level = building.get_CurrentLevel();
								}
								defense_unit = defense_units[j][i];
								if (defense_unit) {
									level = defense_unit.get_CurrentLevel();
								}
								offense_unit = offense_units[j][i];
								if (offense_unit) {
									level = offense_unit.get_CurrentLevel();
								}
								if (level > 1) {
									link += level;
								}

								switch (i > 16 ? 0 : city.GetResourceType(j, i)) {
								case ClientLib.Data.ECityTerrainType.NONE:
									if (building) {
										link += getUnitKey(GAMEDATA.Tech[building.get_MdbBuildingId()]);
									} else if (defense_unit) {
										link += getUnitKey(defense_unit.get_UnitGameData_Obj());
									} else if (offense_unit) {
										link += getUnitKey(offense_unit.get_UnitGameData_Obj());
									} else {
										link += ".";
									}
									break;
								case ClientLib.Data.ECityTerrainType.CRYSTAL:
									if (spot.BuildingIndex < 0)
										link += "c";
									else
										link += "n";
									break;
								case ClientLib.Data.ECityTerrainType.TIBERIUM:
									if (spot.BuildingIndex < 0)
										link += "t";
									else
										link += "h";
									break;
								case ClientLib.Data.ECityTerrainType.FOREST:
									link += "j";
									break;
								case ClientLib.Data.ECityTerrainType.BRIAR:
									link += "h";
									break;
								case ClientLib.Data.ECityTerrainType.SWAMP:
									link += "l";
									break;
								case ClientLib.Data.ECityTerrainType.WATER:
									link += "k";
									break;
								default:
									console.log("cncopt [4]: Unhandled resource type: " + city.GetResourceType(j, i));
									link += ".";
									break;
								}
							}
						}
						if (alliance) {
							link += "|" + alliance.get_POITiberiumBonus();
							link += "|" + alliance.get_POICrystalBonus();
							link += "|" + alliance.get_POIPowerBonus();
							link += "|" + alliance.get_POIInfantryBonus();
							link += "|" + alliance.get_POIVehicleBonus();
							link += "|" + alliance.get_POIAirBonus();
							link += "|" + alliance.get_POIDefenseBonus();
						}
						if (ClientLib.Data.MainData.GetInstance().get_Server().get_TechLevelUpgradeFactorBonusAmount() != 1.20) {
							link += "|newEconomy";
						}
						return link;
					},
					parseLink : function (link) {
						var formation = TABS.UTIL.Formation.Get();
						function getFaction(faction) {
							switch (faction) {
							case "G":
								return ClientLib.Base.EFactionType.GDIFaction;
							case "N":
								return ClientLib.Base.EFactionType.NODFaction;
							case "F":
								return ClientLib.Base.EFactionType.FORFaction;
							default:
								return ClientLib.Base.EFactionType.NotInitialized;
							}
						}
						function initMapRev() {
							var units = GAMEDATA.units,
								keys = Object.keys(GAMEDATA.units),
								len = keys.length,
								unit,
								data = {
									1 : {
										0 : {},
										1 : {},
										2 : {}
									},
									2 : {
										0 : {},
										1 : {},
										2 : {}
									},
									3 : {
										0 : {},
										1 : {},
										2 : {}
									}
								};
							while (len--) {
								unit = units[keys[len]];
								if (typeof TABS.UTIL.CNCOpt.keymap[unit.n] !== "undefined") {
									switch (unit.pt) {
									case ClientLib.Base.EPlacementType.Offense:
										data[unit.f][2][TABS.UTIL.CNCOpt.keymap[unit.n]] = parseInt(keys[len], 10);
										break;
									case ClientLib.Base.EPlacementType.Defense:
										data[unit.f][1][TABS.UTIL.CNCOpt.keymap[unit.n]] = parseInt(keys[len], 10);
										break;
									case ClientLib.Base.EPlacementType.Structure:
										data[unit.f][0][TABS.UTIL.CNCOpt.keymap[unit.n]] = parseInt(keys[len], 10);
										break;
									default:
										console.log("Unknown map: " + unit.n);
										break;
									}
								}
							}
							return data;
						}
						function findFreePos(formation) {
							var x, y, i, map = [];
							for (x = 0; x < ClientLib.Base.Util.get_ArmyMaxSlotCountX(); x++) {
								map[x] = [];
								for (y = 0; y < ClientLib.Base.Util.get_ArmyMaxSlotCountY(); y++) {
									map[x][y] = false;
									for (i = 0; i < formation.length; i++) {
										if (formation[i].x === x && formation[i].y === y)
											map[x][y] = true;
									}
								}
							}
							for (x = 0; x < ClientLib.Base.Util.get_ArmyMaxSlotCountX(); x++) {
								for (y = 0; y < ClientLib.Base.Util.get_ArmyMaxSlotCountY(); y++) {
									if (map[x][y] === false) {
										return {
											'x': x,
											'y': y
										};
									}
								}
							}
							return null;
						}
						if (link !== null && link.indexOf("|") != -1) {
							var parts = link.split("|");
							if (parts === null | parts.length < 5) {
								console.log("Corrupt link");
								return formation;
							}
							var keymapRev = initMapRev(),
								faction1 = getFaction(parts[1]),
								faction2 = getFaction(parts[2]),
								re = /[chjklnt.]|[\d]+[^.]/g,
								count = -1,
								step,
								type,
								id,
								level,
								section,
								i,
								j,
								x,
								y,
								result,
								units = [],
								freePos;
							while ((result = re.exec(parts[4]))) {
								result = result ? result[0] : null;
								step = ++count % 72;
								x = step % 9;
								y = Math.floor(step / 9);
								if (result.length !== 1) {
									type = result.substr(-1);
									level = parseInt(result.slice(0, -1), 10);
									section = Math.floor(count / 72);
									if (typeof keymapRev[section == 2 ? faction2 : faction1][section][type] === "undefined") {
										console.log("Unknown key: " + result + " at pos: " + count);
										continue;
									}
									id = keymapRev[section == 2 ? faction2 : faction1][section][type];
									switch (id) {
									case 175:
										id = 115;
										break;
									case 176:
										id = 155;
										break;
									}
									if (GAMEDATA.units[id].pt == ClientLib.Base.EPlacementType.Offense) {
										units.push({
											i : id,
											l : level,
											x : x,
											y : y
										});
									}
								}
							}
							
							formation = TABS.UTIL.Formation.set_Enabled(formation, false);
							for (i = 0; i < formation.length; i++) {
								for (j = 0; j < units.length; j++) {
									if (units[j] !== null && formation[i].i == units[j].i && formation[i].l == units[j].l) {
										formation[i].x = units[j].x;
										formation[i].y = units[j].y;
										formation[i].enabled = true;
										units.splice(j, 1);
										break;
									}
								}
							}
							for (i = 0; i < formation.length; i++) {
								if (formation[i].enabled === false) {
									freePos = findFreePos(formation);
									if (freePos !== null) {
										formation[i].x = freePos.x;
										formation[i].y = freePos.y;
									}
								}
							}
						}
						return formation;
					}
				}
			});
			qx.Class.define("TABS.MENU", {								// [singleton]	Menu
				type : "singleton",
				extend : qx.core.Object,
				include : [qx.locale.MTranslation],
				construct : function () {
                    this.base(arguments);
					var ScriptsButton = qx.core.Init.getApplication().getMenuBar().getScriptsButton();

					this.Menu = new qx.ui.menu.Menu();
					//ScriptsButton.Add("Battle Simulator V2", TABS.RES.IMG.Menu, this.Menu);
			var addonmenu  = Addons.AddonMainMenu.getInstance();	
			var submenu = addonmenu.AddSubMainMenu("CDSIM V6.6");
			addonmenu.AddSubMenu(submenu,"Settings Load",function () {
						TABS.SETTINGS.load();});
			addonmenu.AddSubMenu(submenu,"Settings Save",function () {
						TABS.SETTINGS.save();});
			addonmenu.AddSubMenu(submenu,"Settings Reset",function () {
						TABS.SETTINGS.reset();});
						
					//Info
					this.Menu.add(new qx.ui.menu.Separator());
					var infoMenu = new qx.ui.menu.Menu(),
						infoHomepage = new qx.ui.menu.Button(this.tr("Homepage"), "https://github.global.ssl.fastly.net/favicon.ico", null),
						infoFacebook = new qx.ui.menu.Button(this.tr("Facebook"), "https://fbstatic-a.akamaihd.net/rsrc.php/yl/r/H3nktOa7ZMg.ico", null);
					infoHomepage.addListener("execute", function () {
						qx.core.Init.getApplication().showExternal("http://eistee82.github.io/ta_simv2");
					}, this);
					infoFacebook.addListener("execute", function () {
						qx.core.Init.getApplication().showExternal("https://www.facebook.com/tasimv2");
					}, this);
					infoMenu.add(infoHomepage);
					infoMenu.add(infoFacebook);
					this.Menu.add(new qx.ui.menu.Button("Info", null, null, infoMenu));
				},
				members : {
					Menu : null
				},
				defer : function () {
					TABS.addInit("TABS.MENU");
				}
			});
			qx.Class.define("TABS.STATS", {								//				Stats Object
				extend : qx.core.Object,
				statics : {
					Prio : {
						Click : 0,
						Enemy : 1,
						Structure : 2,
						Construction_Yard : 3,
						Command_Center : 4,
						Barracks : 5,
						Factory : 6,
						Airport : 7,
						Defense_Facility : 8,
						Defense_HQ : 9,
						Support : 10,
						Defense : 11,
						DefenseArmored : 12,
						DefenseNonArmored : 13,
						Offense : 14,
						Infantry : 15,
						Vehicle : 16,
						Aircraft : 17,
						BattleDuration : 18,
						AutoRepair : 19
					},
					Type : {
						Click : 0,
						HealthPointPercent : 1,
						RepairChargeBase : 2,
						RepairChargeOffense : 3,
						RepairCosts : 4,
						Loot : 5,
						HealthPointAutoRepairPercent : 6
					},
					getPreset : function (num) {
						switch (num) {
						case 1: // Construction_Yard
							return {
								Name : "CY",
								Description : "Most priority to construction yard including all in front of it.<br>After this the best total enemy health from the cached simulations is selected.<br>If no better simulation is found, the best offence unit repair charge and<br>battle duration from the cached simulations is selected.",
								Prio : [
									[TABS.STATS.Prio.Construction_Yard, TABS.STATS.Type.HealthPointPercent, false, 0, false],
									[TABS.STATS.Prio.Enemy, TABS.STATS.Type.HealthPointPercent, false, 0, false],
									[TABS.STATS.Prio.Offense, TABS.STATS.Type.RepairChargeOffense, false, 0, false],
									[TABS.STATS.Prio.Offense, TABS.STATS.Type.HealthPointPercent, false, 0, false],
									[TABS.STATS.Prio.BattleDuration, null, false, 0, false]
								]
							};
						case 2: // Defense_Facility
							return {
								Name : "DF",
								Description : "Most priority to defense facility including all in front of it.<br>After this the best armored defense health from the cached simulations is selected.<br>If no better simulation is found, the best offence unit repair charge and<br>battle duration from the cached simulations is selected.",
								Prio : [
									[TABS.STATS.Prio.Defense_Facility, TABS.STATS.Type.HealthPointPercent, false, 0, false],
									[TABS.STATS.Prio.DefenseArmored, TABS.STATS.Type.HealthPointPercent, false, 0, false],
									[TABS.STATS.Prio.Offense, TABS.STATS.Type.RepairChargeOffense, false, 0, false],
									[TABS.STATS.Prio.Offense, TABS.STATS.Type.HealthPointPercent, false, 0, false],
									[TABS.STATS.Prio.BattleDuration, null, false, 0, false]
								]
							};
						case 3: // Defense
							return {
								Name : "Deff",
								Description : "Most priority to defense health including the auto repair after the battle.<br>If no better simulation is found, the best offence unit repair charge and<br>battle duration from the cached simulations is selected.",
								Prio : [
									[TABS.STATS.Prio.AutoRepair, TABS.STATS.Type.HealthPointAutoRepairPercent, false, 0, false],
									[TABS.STATS.Prio.Offense, TABS.STATS.Type.RepairChargeOffense, false, 0, false],
									[TABS.STATS.Prio.Offense, TABS.STATS.Type.HealthPointPercent, false, 0, false],
									[TABS.STATS.Prio.BattleDuration, null, false, 0, false]
								]
							};
						case 4: // Command_Center
							return {
								Name : "CC",
								Description : "Most priority to command center including all in front of it.<br>After this the best total enemy health from the cached simulations is selected.<br>If no better simulation is found, the best offence unit repair charge and<br>battle duration from the cached simulations is selected.",
								Prio : [
									[TABS.STATS.Prio.Command_Center, TABS.STATS.Type.HealthPointPercent, false, 0, false],
									[TABS.STATS.Prio.Enemy, TABS.STATS.Type.HealthPointPercent, false, 0, false],
									[TABS.STATS.Prio.Offense, TABS.STATS.Type.RepairChargeOffense, false, 0, false],
									[TABS.STATS.Prio.Offense, TABS.STATS.Type.HealthPointPercent, false, 0, false],
									[TABS.STATS.Prio.BattleDuration, null, false, 0, false]
								]
							};
						case 5: // Construction_Yard nokill 10%
							return {
								Name : "CY*",
								Description : "NoKill (farming) priorety.<br>Not working correctly yet.",
								Prio : [
									[TABS.STATS.Prio.DefenseArmored, TABS.STATS.Type.HealthPointPercent, false, 0, false],
									[TABS.STATS.Prio.Defense_Facility, TABS.STATS.Type.HealthPointPercent, false, 0, false],
									[TABS.STATS.Prio.Construction_Yard, TABS.STATS.Type.HealthPointPercent, false, 0.1, true],
									[TABS.STATS.Prio.Enemy, TABS.STATS.Type.HealthPointPercent, true, 0.8, true],
									[TABS.STATS.Prio.Offense, TABS.STATS.Type.RepairChargeOffense, false, 0, false],
									[TABS.STATS.Prio.Offense, TABS.STATS.Type.HealthPointPercent, false, 0, false],
									[TABS.STATS.Prio.BattleDuration, null, false, 0, false]
								]
							};
						default:
							return {
								Name : "live",
								Description : "Shows the current army formation.",
								Prio : []
							};
						}
					},
					selectPrio : function (stats, prio /*[this.Prio, this.Type, Negate/Boolean, Limit/0.0-1.0/%, NoKill/Boolean]*/) {
						switch (prio[0]) {
						case this.Prio.Enemy:
							return this._selectType(stats.Enemy.Overall, prio);
						case this.Prio.Structure:
							return this._selectType(stats.Enemy.Structure, prio);
						case this.Prio.Construction_Yard:
							return this._selectType(stats.Enemy.Construction_Yard, prio);
						case this.Prio.Command_Center:
							return this._selectType(stats.Enemy.Command_Center, prio);
						case this.Prio.Barracks:
							return this._selectType(stats.Enemy.Barracks, prio);
						case this.Prio.Factory:
							return this._selectType(stats.Enemy.Factory, prio);
						case this.Prio.Airport:
							return this._selectType(stats.Enemy.Airport, prio);
						case this.Prio.Defense_Facility:
							return this._selectType(stats.Enemy.Defense_Facility, prio);
						case this.Prio.Defense_HQ:
							return this._selectType(stats.Enemy.Defense_HQ, prio);
						case this.Prio.Support:
							return this._selectType(stats.Enemy.Support, prio);
						case this.Prio.Defense:
							return this._selectType(stats.Enemy.Defense, prio);
						case this.Prio.DefenseArmored:
							return this._selectType(stats.Enemy.DefenseArmored, prio);
						case this.Prio.DefenseNonArmored:
							return this._selectType(stats.Enemy.DefenseNonArmored, prio);
						case this.Prio.Offense:
							return this._selectType(stats.Offense.Overall, prio);
						case this.Prio.Infantry:
							return this._selectType(stats.Offense.Infantry, prio);
						case this.Prio.Vehicle:
							return this._selectType(stats.Offense.Vehicle, prio);
						case this.Prio.Aircraft:
							return this._selectType(stats.Offense.Aircraft, prio);
						case this.Prio.BattleDuration:
							return this._calcBattleDuration(stats.BattleDuration, prio);
						case this.Prio.AutoRepair:
							return this._selectType(stats.Enemy.DefenseArmored, prio);
						default:
							return Number.MAX_VALUE;
						}
					},
					_selectType : function (entity, prio) {
						switch (prio[1]) {
						case this.Type.HealthPointPercent:
							return this._calcHealthPoints(entity.HealthPoints, prio);
						case this.Type.RepairChargeBase:
							return entity.Resource[ClientLib.Base.EResourceType.RepairChargeBase] * (prio[2] ? -1 : 1); // Negate
						case this.Type.RepairChargeOffense:
							return Math.max(
								entity.Resource[ClientLib.Base.EResourceType.RepairChargeAir],
								entity.Resource[ClientLib.Base.EResourceType.RepairChargeInf],
								entity.Resource[ClientLib.Base.EResourceType.RepairChargeVeh]) * (prio[2] ? -1 : 1); // Negate
						case this.Type.RepairCosts:
						case this.Type.Loot:
							return this._calcCosts(entity.Resource, prio);
						case this.Type.HealthPointAutoRepairPercent:
							return this._calcHealthPointsAutoRepair(entity.HealthPoints, prio);
						default:
							return Number.MAX_VALUE;
						}
					},
					_calcCosts : function (Resource /*{ ClientLib.Base.EResourceType.Tiberium: 0, ClientLib.Base.EResourceType.Crystal: 0, ClientLib.Base.EResourceType.Credits: 0, ClientLib.Base.EResourceType.ResearchPoints: 0 }*/, prio) {
						var costs = Resource[ClientLib.Base.EResourceType.Tiberium] +
							Resource[ClientLib.Base.EResourceType.Crystal] +
							Resource[ClientLib.Base.EResourceType.Credits] +
							Resource[ClientLib.Base.EResourceType.ResearchPoints];
						return costs * (prio[2] ? -1 : 1); // Negate
					},
					_calcHealthPoints : function (HealthPoints /*{ max: 0, end: 0 }*/, prio) { //Todo: better front value selection
						var result = HealthPoints.end + HealthPoints.endFront;
						if (HealthPoints.end < (prio[3] * HealthPoints.max)) // Limit
							result = (prio[3] * (HealthPoints.max + HealthPoints.maxFront));
						if (prio[4] === true && !HealthPoints.end) // NoKill
							result = HealthPoints.max + HealthPoints.maxFront;
						if (result > (HealthPoints.max + HealthPoints.maxFront)) // max 1
							result = (HealthPoints.max + HealthPoints.maxFront);
						if (result < 0) // min 0
							result = 0;
						switch (prio[0]) { // Negate Offense
						case this.Prio.Offense:
						case this.Prio.Infantry:
						case this.Prio.Vehicle:
						case this.Prio.Aircraft:
							result = -1 * result;
							break;
						}
						return result * (prio[2] ? -1 : 1); // Negate
					},
					_calcHealthPointsAutoRepair : function (HealthPoints /*{ max: 0, end: 0 }*/, prio) { //Todo: better front value selection
						var result = HealthPoints.end + HealthPoints.rep + HealthPoints.endFront;
						if ((HealthPoints.end + HealthPoints.rep) < (prio[3] * HealthPoints.max)) // Limit
							result = (prio[3] * (HealthPoints.max + HealthPoints.maxFront));
						if (prio[4] === true && (HealthPoints.end + HealthPoints.rep) !== 0) // NoKill
							result = HealthPoints.max + HealthPoints.maxFront;
						if (result > (HealthPoints.max + HealthPoints.maxFront)) // max 1
							result = (HealthPoints.max + HealthPoints.maxFront);
						if (result < 0) // min 0
							result = 0;
						switch (prio[0]) { // Negate Offense
						case this.Prio.Offense:
						case this.Prio.Infantry:
						case this.Prio.Vehicle:
						case this.Prio.Aircraft:
							result = -1 * result;
							break;
						}
						return result * (prio[2] ? -1 : 1); // Negate
					},
					_calcBattleDuration : function (BattleDuration /*int*/, prio) {
						var result = BattleDuration,
							max = 120000;
						if (result < (prio[3] * max)) // Limit
							result = (prio[3] * max);
						if (result > max) // max 1
							result = max;
						if (result < 0) // min 0
							result = 0;
						return result * (prio[2] ? -1 : 1); // Negate
					}
				},
				properties : {
					BattleDuration : {
						check : "Number",
						init : 0,
						event : "changeBattleDuration"
					}
				},
				members : {
					Enemy : null,
					Offense : null,
					setAny : function (data) {
						if (data.BattleDuration !== undefined && data.BattleDuration !== this.getBattleDuration())
							this.setBattleDuration(data.BattleDuration);
						//Entity.HealthPoints
						if (data.Enemy.Overall.HealthPoints !== undefined)
							this.Enemy.Overall.HealthPoints.setAny(data.Enemy.Overall.HealthPoints);
						if (data.Enemy.Structure.HealthPoints !== undefined)
							this.Enemy.Structure.HealthPoints.setAny(data.Enemy.Structure.HealthPoints);
						if (data.Enemy.Construction_Yard.HealthPoints !== undefined)
							this.Enemy.Construction_Yard.HealthPoints.setAny(data.Enemy.Construction_Yard.HealthPoints);
						if (data.Enemy.Command_Center.HealthPoints !== undefined)
							this.Enemy.Command_Center.HealthPoints.setAny(data.Enemy.Command_Center.HealthPoints);
						if (data.Enemy.Barracks.HealthPoints !== undefined)
							this.Enemy.Barracks.HealthPoints.setAny(data.Enemy.Barracks.HealthPoints);
						if (data.Enemy.Factory.HealthPoints !== undefined)
							this.Enemy.Factory.HealthPoints.setAny(data.Enemy.Factory.HealthPoints);
						if (data.Enemy.Airport.HealthPoints !== undefined)
							this.Enemy.Airport.HealthPoints.setAny(data.Enemy.Airport.HealthPoints);
						if (data.Enemy.Defense_Facility.HealthPoints !== undefined)
							this.Enemy.Defense_Facility.HealthPoints.setAny(data.Enemy.Defense_Facility.HealthPoints);
						if (data.Enemy.Defense_HQ.HealthPoints !== undefined)
							this.Enemy.Defense_HQ.HealthPoints.setAny(data.Enemy.Defense_HQ.HealthPoints);
						if (data.Enemy.Support.HealthPoints !== undefined)
							this.Enemy.Support.HealthPoints.setAny(data.Enemy.Support.HealthPoints);
						if (data.Enemy.Defense.HealthPoints !== undefined)
							this.Enemy.Defense.HealthPoints.setAny(data.Enemy.Defense.HealthPoints);
						if (data.Enemy.DefenseArmored.HealthPoints !== undefined)
							this.Enemy.DefenseArmored.HealthPoints.setAny(data.Enemy.DefenseArmored.HealthPoints);
						if (data.Enemy.DefenseNonArmored.HealthPoints !== undefined)
							this.Enemy.DefenseNonArmored.HealthPoints.setAny(data.Enemy.DefenseNonArmored.HealthPoints);
						if (data.Offense.Overall.HealthPoints !== undefined)
							this.Offense.Overall.HealthPoints.setAny(data.Offense.Overall.HealthPoints);
						if (data.Offense.Infantry.HealthPoints !== undefined)
							this.Offense.Infantry.HealthPoints.setAny(data.Offense.Infantry.HealthPoints);
						if (data.Offense.Vehicle.HealthPoints !== undefined)
							this.Offense.Vehicle.HealthPoints.setAny(data.Offense.Vehicle.HealthPoints);
						if (data.Offense.Aircraft.HealthPoints !== undefined)
							this.Offense.Aircraft.HealthPoints.setAny(data.Offense.Aircraft.HealthPoints);
						if (data.Offense.Crystal.HealthPoints !== undefined)
							this.Offense.Crystal.HealthPoints.setAny(data.Offense.Overall.HealthPoints);
						//Entity.Resource
						if (data.Enemy.Overall.Resource !== undefined)
							this.Enemy.Overall.Resource.setAny(data.Enemy.Overall.Resource);
						if (data.Enemy.Structure.Resource !== undefined)
							this.Enemy.Structure.Resource.setAny(data.Enemy.Structure.Resource);
						if (data.Enemy.Construction_Yard.Resource !== undefined)
							this.Enemy.Construction_Yard.Resource.setAny(data.Enemy.Construction_Yard.Resource);
						if (data.Enemy.Command_Center.Resource !== undefined)
							this.Enemy.Command_Center.Resource.setAny(data.Enemy.Command_Center.Resource);
						if (data.Enemy.Barracks.Resource !== undefined)
							this.Enemy.Barracks.Resource.setAny(data.Enemy.Barracks.Resource);
						if (data.Enemy.Factory.Resource !== undefined)
							this.Enemy.Factory.Resource.setAny(data.Enemy.Factory.Resource);
						if (data.Enemy.Airport.Resource !== undefined)
							this.Enemy.Airport.Resource.setAny(data.Enemy.Airport.Resource);
						if (data.Enemy.Defense_Facility.Resource !== undefined)
							this.Enemy.Defense_Facility.Resource.setAny(data.Enemy.Defense_Facility.Resource);
						if (data.Enemy.Defense_HQ.Resource !== undefined)
							this.Enemy.Defense_HQ.Resource.setAny(data.Enemy.Defense_HQ.Resource);
						if (data.Enemy.Support.Resource !== undefined)
							this.Enemy.Support.Resource.setAny(data.Enemy.Support.Resource);
						if (data.Enemy.Defense.Resource !== undefined)
							this.Enemy.Defense.Resource.setAny(data.Enemy.Defense.Resource);
						if (data.Enemy.DefenseArmored.Resource !== undefined)
							this.Enemy.DefenseArmored.Resource.setAny(data.Enemy.DefenseArmored.Resource);
						if (data.Enemy.DefenseNonArmored.Resource !== undefined)
							this.Enemy.DefenseNonArmored.Resource.setAny(data.Enemy.DefenseNonArmored.Resource);
						if (data.Offense.Overall.Resource !== undefined)
							this.Offense.Overall.Resource.setAny(data.Offense.Overall.Resource);
						if (data.Offense.Infantry.Resource !== undefined)
							this.Offense.Infantry.Resource.setAny(data.Offense.Infantry.Resource);
						if (data.Offense.Vehicle.Resource !== undefined)
							this.Offense.Vehicle.Resource.setAny(data.Offense.Vehicle.Resource);
						if (data.Offense.Aircraft.Resource !== undefined)
							this.Offense.Aircraft.Resource.setAny(data.Offense.Aircraft.Resource);
						if (data.Offense.Crystal.Resource !== undefined)
							this.Offense.Crystal.Resource.setAny(data.Offense.Overall.Resource);
					},
					getAny : function () {
						return {
							BattleDuration : this.getBattleDuration(),
							Enemy : {
								Overall : {
									HealthPoints : this.Enemy.Overall.HealthPoints.getAny(),
									Resource : this.Enemy.Overall.Resource.getAny()
								},
								Structure : {
									HealthPoints : this.Enemy.Structure.HealthPoints.getAny(),
									Resource : this.Enemy.Structure.Resource.getAny()
								},
								Construction_Yard : {
									HealthPoints : this.Enemy.Construction_Yard.HealthPoints.getAny(),
									Resource : this.Enemy.Construction_Yard.Resource.getAny()
								},
								Command_Center : {
									HealthPoints : this.Enemy.Command_Center.HealthPoints.getAny(),
									Resource : this.Enemy.Command_Center.Resource.getAny()
								},
								Barracks : {
									HealthPoints : this.Enemy.Barracks.HealthPoints.getAny(),
									Resource : this.Enemy.Barracks.Resource.getAny()
								},
								Factory : {
									HealthPoints : this.Enemy.Factory.HealthPoints.getAny(),
									Resource : this.Enemy.Factory.Resource.getAny()
								},
								Airport : {
									HealthPoints : this.Enemy.Airport.HealthPoints.getAny(),
									Resource : this.Enemy.Airport.Resource.getAny()
								},
								Defense_Facility : {
									HealthPoints : this.Enemy.Defense_Facility.HealthPoints.getAny(),
									Resource : this.Enemy.Defense_Facility.Resource.getAny()
								},
								Defense_HQ : {
									HealthPoints : this.Enemy.Defense_HQ.HealthPoints.getAny(),
									Resource : this.Enemy.Defense_HQ.Resource.getAny()
								},
								Support : {
									HealthPoints : this.Enemy.Support.HealthPoints.getAny(),
									Resource : this.Enemy.Support.Resource.getAny()
								},
								Defense : {
									HealthPoints : this.Enemy.Defense.HealthPoints.getAny(),
									Resource : this.Enemy.Defense.Resource.getAny()
								},
								DefenseArmored : {
									HealthPoints : this.Enemy.DefenseArmored.HealthPoints.getAny(),
									Resource : this.Enemy.DefenseArmored.Resource.getAny()
								},
								DefenseNonArmored : {
									HealthPoints : this.Enemy.DefenseNonArmored.HealthPoints.getAny(),
									Resource : this.Enemy.DefenseNonArmored.Resource.getAny()
								}
							},
							Offense : {
								Overall : {
									HealthPoints : this.Offense.Overall.HealthPoints.getAny(),
									Resource : this.Offense.Overall.Resource.getAny()
								},
								Infantry : {
									HealthPoints : this.Offense.Infantry.HealthPoints.getAny(),
									Resource : this.Offense.Infantry.Resource.getAny()
								},
								Vehicle : {
									HealthPoints : this.Offense.Vehicle.HealthPoints.getAny(),
									Resource : this.Offense.Vehicle.Resource.getAny()
								},
								Aircraft : {
									HealthPoints : this.Offense.Aircraft.HealthPoints.getAny(),
									Resource : this.Offense.Aircraft.Resource.getAny()
								},
                                Crystal : {
                                    HealthPoints : this.Offense.Overall.HealthPoints.getAny(),
                                    Resource : this.Offense.Overall.Resource.getAny()
                                }
							}
						};
					}
				},
				construct : function (data) {
					try {
                        this.base(arguments);
						this.Enemy = {
							Overall : {
								HealthPoints : new TABS.STATS.Entity.HealthPoints(),
								Resource : new TABS.STATS.Entity.Resource()
							},
							Structure : {
								HealthPoints : new TABS.STATS.Entity.HealthPoints(),
								Resource : new TABS.STATS.Entity.Resource()
							},
							Construction_Yard : {
								HealthPoints : new TABS.STATS.Entity.HealthPoints(),
								Resource : new TABS.STATS.Entity.Resource()
							},
							Command_Center : {
								HealthPoints : new TABS.STATS.Entity.HealthPoints(),
								Resource : new TABS.STATS.Entity.Resource()
							},
							Barracks : {
								HealthPoints : new TABS.STATS.Entity.HealthPoints(),
								Resource : new TABS.STATS.Entity.Resource()
							},
							Factory : {
								HealthPoints : new TABS.STATS.Entity.HealthPoints(),
								Resource : new TABS.STATS.Entity.Resource()
							},
							Airport : {
								HealthPoints : new TABS.STATS.Entity.HealthPoints(),
								Resource : new TABS.STATS.Entity.Resource()
							},
							Defense_Facility : {
								HealthPoints : new TABS.STATS.Entity.HealthPoints(),
								Resource : new TABS.STATS.Entity.Resource()
							},
							Defense_HQ : {
								HealthPoints : new TABS.STATS.Entity.HealthPoints(),
								Resource : new TABS.STATS.Entity.Resource()
							},
							Support : {
								HealthPoints : new TABS.STATS.Entity.HealthPoints(),
								Resource : new TABS.STATS.Entity.Resource()
							},
							Defense : {
								HealthPoints : new TABS.STATS.Entity.HealthPoints(),
								Resource : new TABS.STATS.Entity.Resource()
							},
							DefenseArmored : {
								HealthPoints : new TABS.STATS.Entity.HealthPoints(),
								Resource : new TABS.STATS.Entity.Resource()
							},
							DefenseNonArmored : {
								HealthPoints : new TABS.STATS.Entity.HealthPoints(),
								Resource : new TABS.STATS.Entity.Resource()
							}
						};
						this.Offense = {
							Overall : {
								HealthPoints : new TABS.STATS.Entity.HealthPoints(),
								Resource : new TABS.STATS.Entity.Resource()
							},
							Infantry : {
								HealthPoints : new TABS.STATS.Entity.HealthPoints(),
								Resource : new TABS.STATS.Entity.Resource()
							},
							Vehicle : {
								HealthPoints : new TABS.STATS.Entity.HealthPoints(),
								Resource : new TABS.STATS.Entity.Resource()
							},
							Aircraft : {
								HealthPoints : new TABS.STATS.Entity.HealthPoints(),
								Resource : new TABS.STATS.Entity.Resource()
							},
							Crystal : {
								HealthPoints : new TABS.STATS.Entity.HealthPoints(),
								Resource : new TABS.STATS.Entity.Resource()
							},
						};

						if (data !== undefined)
							this.setAny(data);
					} catch (e) {
						console.group("Tiberium Alliances Battle Simulator V2");
						console.error("Error setting up STATS constructor", e);
						console.groupEnd();
					}
				},
				events : {
					"changeBattleDuration" : "qx.event.type.Data"
				}
			});
			qx.Class.define("TABS.STATS.Entity.HealthPoints", {			//				Entity HealthPoints Objekt
				extend : qx.core.Object,
				properties : {
					max : {
						check : "Number",
						init : 0,
						event : "changeMax"
					},
					start : {
						check : "Number",
						init : 0,
						event : "changeStart"
					},
					end : {
						check : "Number",
						init : 0,
						event : "changeEnd"
					},
					rep : {
						check : "Number",
						init : 0,
						event : "changeRep"
					},
					maxFront : {
						check : "Number",
						init : 0,
						event : "changeMaxFront"
					},
					startFront : {
						check : "Number",
						init : 0,
						event : "changeStartFront"
					},
					endFront : {
						check : "Number",
						init : 0,
						event : "changeEndFront"
					}
				},
				members : {
					setAny : function (data) {
						if (data.max !== undefined && data.max !== this.getMax())
							this.setMax(data.max);
						if (data.start !== undefined && data.start !== this.getStart())
							this.setStart(data.start);
						if (data.end !== undefined && data.end !== this.getEnd())
							this.setEnd(data.end);
						if (data.rep !== undefined && data.rep !== this.getRep())
							this.setRep(data.rep);
						if (data.maxFront !== undefined && data.maxFront !== this.getMaxFront())
							this.setMaxFront(data.maxFront);
						if (data.startFront !== undefined && data.startFront !== this.getStartFront())
							this.setStartFront(data.startFront);
						if (data.endFront !== undefined && data.endFront !== this.getEndFront())
							this.setEndFront(data.endFront);
					},
					getAny : function () {
						return {
							max : this.getMax(),
							start : this.getStart(),
							end : this.getEnd(),
							rep : this.getRep(),
							maxFront : this.getMaxFront(),
							startFront : this.getStartFront(),
							endFront : this.getEndFront()
						};
					}
				},
				construct : function (data) {
					try {
                        this.base(arguments);
						if (data !== undefined)
							this.setAny(data);
					} catch (e) {
						console.group("Tiberium Alliances Battle Simulator V2");
						console.error("Error setting up STATS.Entity.HealthPoints constructor", e);
						console.groupEnd();
					}
				},
				events : {
					"changeMax" : "qx.event.type.Data",
					"changeStart" : "qx.event.type.Data",
					"changeEnd" : "qx.event.type.Data",
					"changeMaxFront" : "qx.event.type.Data",
					"changeStartFront" : "qx.event.type.Data",
					"changeEndFront" : "qx.event.type.Data"
				}
			});
			qx.Class.define("TABS.STATS.Entity.Resource", {				//				Entity Ressouce Object
				extend : qx.core.Object,
				properties : { //ClientLib.Base.EResourceType
					Tiberium : {
						check : "Number",
						init : 0,
						event : "changeTiberium"
					},
					Crystal : {
						check : "Number",
						init : 0,
						event : "changeCrystal"
					},
					Credits : {
						check : "Number",
						init : 0,
						event : "changeCredits"
					},
					ResearchPoints : {
						check : "Number",
						init : 0,
						event : "changeResearchPoints"
					},
					RepairChargeBase : {
						check : "Number",
						init : 0,
						event : "changeRepairChargeBase"
					},
					RepairChargeAir : {
						check : "Number",
						init : 0,
						event : "changeRepairChargeAir"
					},
					RepairChargeInf : {
						check : "Number",
						init : 0,
						event : "changeRepairChargeInf"
					},
					RepairChargeVeh : {
						check : "Number",
						init : 0,
						event : "changeRepairChargeVeh"
					}
				},
				members : {
					setAny : function (data) {
						if (data[1] !== undefined && data[1] !== this.getTiberium())
							this.setTiberium(data[1]);
						if (data[2] !== undefined && data[2] !== this.getCrystal())
							this.setCrystal(data[2]);
						if (data[3] !== undefined && data[3] !== this.getCredits())
							this.setCredits(data[3]);
						if (data[6] !== undefined && data[6] !== this.getResearchPoints())
							this.setResearchPoints(data[6]);
						if (data[7] !== undefined && data[7] !== this.getRepairChargeBase())
							this.setRepairChargeBase(data[7]);
						if (data[8] !== undefined && data[8] !== this.getRepairChargeAir())
							this.setRepairChargeAir(data[8]);
						if (data[9] !== undefined && data[9] !== this.getRepairChargeInf())
							this.setRepairChargeInf(data[9]);
						if (data[10] !== undefined && data[10] !== this.getRepairChargeVeh())
							this.setRepairChargeVeh(data[10]);
					},
					getAny : function () {
						return {
							1 : this.getTiberium(),
							2 : this.getCrystal(),
							3 : this.getCredits(),
							6 : this.getResearchPoints(),
							7 : this.getRepairChargeBase(),
							8 : this.getRepairChargeAir(),
							9 : this.getRepairChargeInf(),
							10 : this.getRepairChargeVeh()
						};
					}
				},
				construct : function (data) {
					try {
                        this.base(arguments);
						if (data !== undefined)
							this.setAny(data);
					} catch (e) {
						console.group("Tiberium Alliances Battle Simulator V2");
						console.error("Error setting up STATS.Entity.Resource constructor", e);
						console.groupEnd();
					}
				},
				events : {
					"changeTiberium" : "qx.event.type.Data",
					"changeCrystal" : "qx.event.type.Data",
					"changeCredits" : "qx.event.type.Data",
					"changeResearchPoints" : "qx.event.type.Data",
					"changeRepairCrystal" : "qx.event.type.Data",
					"changeRepairChargeBase" : "qx.event.type.Data",
					"changeRepairChargeAir" : "qx.event.type.Data",
					"changeRepairChargeInf" : "qx.event.type.Data",
					"changeRepairChargeVeh" : "qx.event.type.Data"
				}
			});
			qx.Class.define("TABS.CACHE", {								// [singleton]	Cache for simulations
				type : "singleton",
				extend : qx.core.Object,
				construct : function () {
					try {
						this.base(arguments);
						this.cities = {};
						this.__Table = new Uint32Array(256);
						var tmp;
						for (var i = 256; i--; ) {
							tmp = i;
							for (var k = 8; k--; ) {
								tmp = tmp & 1 ? 0xEDB88320^(tmp >>> 1) : tmp >>> 1;
							}
							this.__Table[i] = tmp;
						}
					} catch (e) {
						console.group("Tiberium Alliances Battle Simulator V2");
						console.error("Error setting up CACHE constructor", e);
						console.groupEnd();
					}
				},
				members : {
					__Table : null,
					cities : null,
					sortByPosition : function (a, b) {
						return a.x - b.x || a.y - b.y || a.i - b.i; // using id as third because of garrison (both units at same position)
					},
					_Crc32 : function (data) { // data = array of bytes 0-255
						var crc = 0xFFFFFFFF;
						for (var i = 0, l = data.length; i < l; i++) {
							crc = (crc >>> 8)^this.__Table[(crc^data[i]) & 0xFF];
						}
						return crc^-1;
					},
					calcUnitsHash : function (units, ownid) { // units = TABS.UTIL.Formation.Get()
						if (units !== null) {
							units.sort(this.sortByPosition);
							var OwnCityId = ((ownid !== undefined && ownid !== null) ? ownid : ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCityId()),
								i,
								data = [];
							for (i = 0; i < units.length; i++)
								if (units[i].enabled && units[i].h > 0)
									data.push(units[i].x, units[i].y, units[i].i, units[i].l);
							return OwnCityId.toString() + this._Crc32(data);
						}
						return null;
					},
					check : function (units, cityid, ownid) { // returns { key : "", result : { ownid : 0, cityid: 0, stats : {}, formation : [], combat : {}, valid: true } }
						var CityId = ((cityid !== undefined && cityid !== null) ? cityid : ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId()),
							OwnCityId = ((ownid !== undefined && ownid !== null) ? ownid : ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCityId()),
							Hash = this.calcUnitsHash(units, OwnCityId);
						if (CityId !== null && OwnCityId !== null && Hash !== null) {
							this.__validate(CityId, OwnCityId, Hash);
							return {
								key : Hash,
								result : this.get(Hash, CityId)
							};
						}
						return {
							key : null,
							result : null
						};
					},
					getAll : function (cityid) {
						var CityId = ((cityid !== undefined && cityid !== null) ? cityid : ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId());
						if (typeof this.cities[CityId] === "undefined")
							this.cities[CityId] = {
								data : {},
								caches : {}
							};
						return this.cities[CityId];
					},
					get : function (key, cityid) { // returns { ownid : 0, cityid: 0, stats : {}, formation : [], combat : {}, valid: true }
						var CityId = ((cityid !== undefined && cityid !== null) ? cityid : ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId()),
							caches = this.getAll(CityId).caches;
						if (typeof caches[key] !== "undefined" && caches[key].valid)
							return caches[key];
						return null;
					},
					getPrio : function (prios, cityid, ownid) {
						var CityId = ((cityid !== undefined && cityid !== null) ? cityid : ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId()),
							caches = this.getAll(CityId).caches,
							results = [];
						for (var key in caches) {
							if (ownid === null || ownid === undefined || (ownid !== null && ownid !== undefined && caches[key].ownid == ownid))
								results.push({
									"key" : key,
									result : caches[key]
								});
						}
						results.sort(function (a, b) {
							var result = 0;
							for (var i = 0; i < prios.length; i++) {
								a.diff = result;
								b.diff = result;
								if (result)
									return result;
								else
									result = TABS.STATS.selectPrio(a.result.stats, prios[i]) - TABS.STATS.selectPrio(b.result.stats, prios[i]);
							}
							return result;
						});
						return results;
					},
					getPrio1 : function (prios, cityid, ownid) {
						var result = this.getPrio(prios, cityid, ownid);
						if (result.length === 0)
							result = {
								key : null,
								result : null
							};
						else {
							for (i = 0; i < result.length; i++) {
								if (result[i].result.valid === true) {
									result = result[i];
									break;
								}
							}
							if (Object.prototype.toString.call(result) === "[object Array]")
								result = result[0];
						}
						return result;
					},
					add : function (data, cityid, ownid) { // { key : "", result : { stats : {}, formation : [], combat : {} } }
						var CityId = ((cityid !== undefined && cityid !== null) ? cityid : ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId()),
							OwnCityId = ((ownid !== undefined && ownid !== null) ? ownid : ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCityId()),
							OwnCity = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(OwnCityId),
							caches = this.getAll(CityId).caches;
						caches[data.key] = data.result;
						caches[data.key].cityid = CityId;
						caches[data.key].ownid = OwnCityId;
						if (OwnCity !== null)
							caches[data.key].recovery = OwnCity.get_hasRecovery();
						caches[data.key].valid = true;
						this.onAdd();
					},
					clearAll : function () {
						this.cities = {};
					},
					clear : function (cityid) {
						if (typeof this.cities[cityid] !== "undefined")
							return delete this.cities[cityid];
						return false;
					},
					merge : function (cityid, ownid, data, caches) {
						try {
							var CityId = ((cityid !== undefined && cityid !== null) ? cityid : ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId()),
								OwnCityId = ((ownid !== undefined && ownid !== null) ? ownid : ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCityId()),
								key,
								sim = {
									data : data,
									caches : caches
								};
							for (key in sim.caches) {
								sim.caches[key].cityid = CityId;
								sim.caches[key].ownid = OwnCityId;
								sim.caches[key].recovery = sim.data.recovery;
								sim.caches[key].valid = true;
							}
							this.__validate(CityId, OwnCityId, sim);
							qx.lang.Object.mergeWith(this.getAll(CityId).caches, sim.caches); // overwrite = false?
							this.onAdd();
						} catch (e) {
							console.group("Tiberium Alliances Battle Simulator V2");
							console.error("Error in TABS.CACHE.merge", e);
							console.groupEnd();
						}
					},
					getCitySimAmount : function (cityid) {
						var CityId = ((cityid !== undefined && cityid !== null) ? cityid : ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId());
						if (typeof this.cities[CityId] !== "undefined" && typeof this.cities[CityId]["caches"] !== "undefined")
							return Object.keys(this.cities[CityId].caches).length;
						return 0;
					},
					__validate : function (cityid, ownid, hash) {
						var targetCity = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(cityid),
							ownCity = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(ownid),
							city = (typeof hash != "object" ? this.getAll(cityid) : hash),
							key;

						if (targetCity !== null && targetCity.get_Version() !== -1) {
							var version = targetCity.get_Version();
							if (city.data.version != version) {
								city.data.version = version;
								//invalidate
								for (key in city.caches)
									city.caches[key].valid = false;
							}
						}

						if (ownCity !== null && ownCity.get_Version() !== -1) {
							var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance(),
								recovery = ownCity.get_hasRecovery();

							if (typeof hash != "object" && typeof city.caches[hash] !== "undefined" && city.caches[hash].recovery != recovery)
								city.caches[hash].valid = false;

							if (typeof hash == "object" && city.data.recovery != recovery)
								for (key in city.caches)
									city.caches[key].valid = false;

							if (alliance !== null) {
								if ((city.data.air != alliance.get_POIAirBonus() ||
										city.data.inf != alliance.get_POIInfantryBonus() ||
										city.data.veh != alliance.get_POIVehicleBonus()) &&
									recovery === false) {
									city.data.air = alliance.get_POIAirBonus();
									city.data.inf = alliance.get_POIInfantryBonus();
									city.data.veh = alliance.get_POIVehicleBonus();
									if (targetCity !== null)
										city.data.version = targetCity.get_Version();
									//invalidate
									for (key in city.caches)
										city.caches[key].valid = false;
								}
							}
						}
					},
					onAdd : function () {
						phe.cnc.base.Timer.getInstance().removeListener("uiTick", this.onUiTick, this);
						phe.cnc.base.Timer.getInstance().addListener("uiTick", this.onUiTick, this);
					},
					onUiTick : function () {
						phe.cnc.base.Timer.getInstance().removeListener("uiTick", this.onUiTick, this);
						this.fireEvent("addSimulation");
					}
				},
				events : {
					"addSimulation" : "qx.event.type.Event"
				}
			});
			qx.Class.define("TABS.APISimulation", {						// [singleton]	API Simulation
				type : "singleton",
				extend : qx.core.Object,
				properties : {
					data : {
						check : "Array",
						init : [],
						event : "OnData"
					},
					formation : {
						check : "Array",
						init : []
					},
					formationHash : {
						check : "Array",
						init : []
					},
					lock : {
						check : "Boolean",
						init : false,
						event : "OnLock"
					},
					request : {
						check : "Boolean",
						init : false
					},
					time : {
						check : "Number",
						init : 0,
						event : "OnTime"
					}
				},
				construct : function () {
					try {
                        this.base(arguments);
						this.addListener("OnSimulateBattleFinished", this._OnSimulateBattleFinished, this);
					} catch (e) {
						console.group("Tiberium Alliances Battle Simulator V2");
						console.error("Error setting up APISimulation constructor", e);
						console.groupEnd();
					}
				},
				members : {
					__Timeout : null,
					__TimerStart : null,
					SimulateBattle : function () {
						if (!this.getLock()) {
							var CurrentOwnCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity(),
								CurrentCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity();
							if (CurrentOwnCity !== null && CurrentCity !== null && CurrentCity.CheckInvokeBattle(CurrentOwnCity, true) == ClientLib.Data.EAttackBaseResult.OK) {
								clearTimeout(this.__Timeout);
								this.__Timeout = setTimeout(this._reset.bind(this), 10000);
								this.resetData();
								this.setLock(true);
								var formation = TABS.UTIL.Formation.Get(),
									armyUnits = [];
								for (var i in formation)
									if (formation[i].enabled && formation[i].h > 0)
										armyUnits.push({
											i : formation[i].id,
											x : formation[i].x,
											y : formation[i].y
										});

								this.setFormation(formation);

								ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("SimulateBattle", {
									battleSetup : {
										d : CurrentCity.get_Id(),
										a : CurrentOwnCity.get_Id(),
										u : armyUnits,
										s : 0
									}
								}, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, function (a, b) {
									this.__TimerStart = Date.now();
									this._updateTime();
									this.fireDataEvent("OnSimulateBattleFinished", b);
								}), null);
							}
						} else
							this.setRequest(true);
					},
					_OnSimulateBattleFinished : function (e) {
                        if (ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity() === null)
                            return;
						var data = e.getData();
                        if (data === null) return;
                        var	mergedformation = TABS.UTIL.Formation.Merge(this.getFormation(), data.d.a),
							cache = TABS.CACHE.getInstance().check(mergedformation, data.d.di, data.d.ai);
						this.setData(data.e);
						cache.result = {
							stats : TABS.UTIL.Stats.get_Stats(data).getAny(),
							formation : mergedformation,
							combat : data.d
						};
						TABS.CACHE.getInstance().add(cache, data.d.di, data.d.ai);
					},
					_updateTime : function () {
						clearTimeout(this.__Timeout);
						var time = this.__TimerStart + 10000 - Date.now();
						if (time > 0) {
							if (time > 100)
								this.__Timeout = setTimeout(this._updateTime.bind(this), 100);
							else
								this.__Timeout = setTimeout(this._updateTime.bind(this), time);
						} else
							this.__TimerStart = time = 0;
						this.setTime(time);
						if (this.getTime() === 0)
							this._reset();
					},
					_reset : function () {
						this.resetLock();
						this.resetData();
						this.resetTime();
						if (this.getRequest()) {
							this.resetRequest();
							this.SimulateBattle();
						}
					}
				},
				events : {
					"OnData" : "qx.event.type.Data",
					"OnLock" : "qx.event.type.Data",
					"OnSimulateBattleFinished" : "qx.event.type.Data",
					"OnTime" : "qx.event.type.Data"
				}
			});
			qx.Class.define("TABS.PreArmyUnits", {						// [singleton]	Event: OnCityPreArmyUnitsChanged
				type : "singleton",
				extend : qx.core.Object,
				construct : function () {
					try {
                        this.base(arguments);
						phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.__CurrentOwnCityChange);
						phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.__CurrentCityChange);
						phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.__ViewModeChange);
						if (ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity() !== null)
							this.__CurrentOwnCityChange(0, ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity().get_Id());
						if (ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity() !== null)
							this.__CurrentCityChange(0, ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity().get_Id());
						this.patchSetEnabled();
					} catch (e) {
						console.group("Tiberium Alliances Battle Simulator V2");
						console.error("Error setting up PreArmyUnits constructor", e);
						console.groupEnd();
					}
				},
				events : {
					"OnCityPreArmyUnitsChanged" : "qx.event.type.Event"
				},
				members : {
					CurrentCity : null,
					CurrentOwnCity : null,
					CityPreArmyUnits : null,
					__Timeout : null,
					__CurrentOwnCityChange : function (oldId, newId) {
						if (this.CurrentOwnCity !== null && this.CurrentCity !== null && this.CityPreArmyUnits !== null)
							phe.cnc.Util.detachNetEvent(this.CityPreArmyUnits, "ArmyChanged", ClientLib.Data.CityPreArmyUnitsChanged, this, this.__CityPreArmyUnitsChanged);
						var CurrentOwnCity = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(newId);
						if (CurrentOwnCity !== null && CurrentOwnCity.IsOwnBase()) {
							this.CurrentOwnCity = CurrentOwnCity;
							if (this.CurrentCity !== null && ClientLib.Vis.VisMain.GetInstance().get_Mode() === ClientLib.Vis.Mode.CombatSetup) {
								this.CityPreArmyUnits = CurrentOwnCity.get_CityArmyFormationsManager().GetUpdatedFormationByTargetBaseId(this.CurrentCity.get_Id());
								phe.cnc.Util.attachNetEvent(this.CityPreArmyUnits, "ArmyChanged", ClientLib.Data.CityPreArmyUnitsChanged, this, this.__CityPreArmyUnitsChanged);
								this.__CityPreArmyUnitsChanged();
							}
						}
					},
					__CurrentCityChange : function (oldId, newId) {
						if (this.CurrentOwnCity !== null && this.CurrentCity !== null && this.CityPreArmyUnits !== null)
							phe.cnc.Util.detachNetEvent(this.CityPreArmyUnits, "ArmyChanged", ClientLib.Data.CityPreArmyUnitsChanged, this, this.__CityPreArmyUnitsChanged);
						var CurrentCity = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(newId);
						if (CurrentCity !== null && !CurrentCity.IsOwnBase()) {
							this.CurrentCity = CurrentCity;
							if (this.CurrentOwnCity !== null && ClientLib.Vis.VisMain.GetInstance().get_Mode() === ClientLib.Vis.Mode.CombatSetup) {
								this.CityPreArmyUnits = this.CurrentOwnCity.get_CityArmyFormationsManager().GetUpdatedFormationByTargetBaseId(CurrentCity.get_Id());
								phe.cnc.Util.attachNetEvent(this.CityPreArmyUnits, "ArmyChanged", ClientLib.Data.CityPreArmyUnitsChanged, this, this.__CityPreArmyUnitsChanged);
								this.__CityPreArmyUnitsChanged();
							}
						}
					},
					__ViewModeChange : function (oldMode, newMode) {
						if (newMode == ClientLib.Vis.Mode.CombatSetup && this.CurrentCity !== null && this.CurrentOwnCity !== null) {
							this.CityPreArmyUnits = this.CurrentOwnCity.get_CityArmyFormationsManager().GetUpdatedFormationByTargetBaseId(this.CurrentCity.get_Id());
							phe.cnc.Util.attachNetEvent(this.CityPreArmyUnits, "ArmyChanged", ClientLib.Data.CityPreArmyUnitsChanged, this, this.__CityPreArmyUnitsChanged);
							this.__CityPreArmyUnitsChanged();
						} else if (oldMode == ClientLib.Vis.Mode.CombatSetup && this.CityPreArmyUnits !== null) {
							phe.cnc.Util.detachNetEvent(this.CityPreArmyUnits, "ArmyChanged", ClientLib.Data.CityPreArmyUnitsChanged, this, this.__CityPreArmyUnitsChanged);
							this.CityPreArmyUnits = null;
						}
					},
					__CityPreArmyUnitsChanged : function () {
						clearTimeout(this.__Timeout);
						if (this.CurrentCity.get_Version() >= 0 && ClientLib.Vis.VisMain.GetInstance().GetActiveView().get_VisAreaComplete()) {
							this.__Timeout = setTimeout(this._onCityPreArmyUnitsChanged.bind(this), 100);
						} else if (this.CurrentCity.get_Version() == -1 || (this.CurrentCity.get_Version() >= 0 && !ClientLib.Vis.VisMain.GetInstance().GetActiveView().get_VisAreaComplete())) {
							this.__Timeout = setTimeout(this.__CityPreArmyUnitsChanged.bind(this), 100);
						}
					},
					_onCityPreArmyUnitsChanged : function () {
						this.fireEvent("OnCityPreArmyUnitsChanged");
					},
					patchSetEnabled : function () {
						try {
							var set_Enabled = ClientLib.Data.CityPreArmyUnit.prototype.set_Enabled.toString(),
								args = set_Enabled.substring(set_Enabled.indexOf("(") + 1, set_Enabled.indexOf(")")),
								body = set_Enabled.substring(set_Enabled.indexOf("{") + 1, set_Enabled.lastIndexOf("}"));
							body = body + "TABS.PreArmyUnits.getInstance().__CityPreArmyUnitsChanged();";
							/*jslint evil: true */
							ClientLib.Data.CityPreArmyUnit.prototype.set_Enabled = Function(args, body);
							/*jslint evil: false */
						} catch (e) {
							console.group("Tiberium Alliances Battle Simulator V2");
							console.error("Error setting up ClientLib.Data.CityPreArmyUnit.prototype.set_Enabled", e);
							console.groupEnd();
						}
					}
				},
				defer : function () {
					TABS.addInit("TABS.PreArmyUnits");
				}
			});
			qx.Class.define("TABS.PreArmyUnits.AutoSimulate", {			// [singleton]	Auto simulate battle
				type : "singleton",
				extend : qx.core.Object,
				construct : function () {
					try {
                        this.base(arguments);
						if (this.getEnabled())
							TABS.PreArmyUnits.getInstance().addListener("OnCityPreArmyUnitsChanged", this.SimulateBattle, this);
					} catch (e) {
						console.group("Tiberium Alliances Battle Simulator V2");
						console.error("Error setting up PreArmyUnits.AutoSimulate constructor", e);
						console.groupEnd();
					}
				},
				properties : {
					enabled : {
						check : "Boolean",
						init : TABS.SETTINGS.get("PreArmyUnits.AutoSimulate", true),
						apply : "_applyEnabled",
						event : "changeEnabled"
					}
				},
				members : {
					_applyEnabled : function (newValue) {
						TABS.SETTINGS.set("PreArmyUnits.AutoSimulate", newValue);
						if (newValue === true)
							TABS.PreArmyUnits.getInstance().addListener("OnCityPreArmyUnitsChanged", this.SimulateBattle, this);
						else
							TABS.PreArmyUnits.getInstance().removeListener("OnCityPreArmyUnitsChanged", this.SimulateBattle, this);
					},
					SimulateBattle : function () {
						var formation = TABS.UTIL.Formation.Get();
						if (formation !== null && formation.length > 0) {
							var cache = TABS.CACHE.getInstance().check(formation);
							if (cache.result === null)
								TABS.APISimulation.getInstance().SimulateBattle();
						}
					}
				},
				events : {
					"changeEnabled" : "qx.event.type.Data"
				},
				defer : function () {
					TABS.addInit("TABS.PreArmyUnits.AutoSimulate");
				}
			});
			qx.Class.define("TABS.GUI.ArmySetupAttackBar", {			// [singleton]	Shift and Mirror Buttons
				type : "singleton",
				extend : qx.core.Object,
				include : [qx.locale.MTranslation],
				construct : function () {
					try {
						this.base(arguments);
						this.ArmySetupAttackBar = qx.core.Init.getApplication().getArmySetupAttackBar();

						// Mirror and Shift Buttons left Side (Rows/Wave)
						var i,
							cntWave;
						for (i = 0; i < ClientLib.Base.Util.get_ArmyMaxSlotCountY(); i++) {
						
							if (PerforceChangelist >= 441469) { // 15.4 patch
								cntWave = this.ArmySetupAttackBar.getMainContainer().getChildren()[(i + 3)];
							} else { //old
								   cntWave = this.ArmySetupAttackBar.getMainContainer().getChildren()[(i + 4)];
							}
							cntWave._removeAll();
							cntWave._setLayout(new qx.ui.layout.HBox());
							cntWave._add(this.newSideButton(TABS.RES.IMG.Flip.H, this.tr("Mirrors units horizontally."), this.onClick_btnMirror, "h", i));
							cntWave._add(new qx.ui.core.Spacer(), {
								flex : 1
							});
							cntWave._add(this.newSideButton(TABS.RES.IMG.Arrows.Left, this.tr("Shifts units one space left."), this.onClick_btnShift, "l", i));
							cntWave._add(this.newSideButton(TABS.RES.IMG.Arrows.Right, this.tr("Shifts units one space right."), this.onClick_btnShift, "r", i));
							
						}

						// Mirror and Shift Buttons top
						var formation = this.ArmySetupAttackBar.getMainContainer().getChildren()[1].getChildren()[0],
							btnHBox = new qx.ui.container.Composite(new qx.ui.layout.HBox()),
							btnHBoxouter = new qx.ui.container.Composite(new qx.ui.layout.HBox());
						btnHBoxouter.add(new qx.ui.core.Spacer(), {
							flex : 1
						});
						btnHBoxouter.add(btnHBox);
						btnHBoxouter.add(new qx.ui.core.Spacer(), {
							flex : 1
						});
						this.ArmySetupAttackBar.getChildren()[2].addAt(btnHBoxouter, 0, {
							left : 16,
							top : 2,
							right : 0
						});
                        var formationContainer = this.ArmySetupAttackBar.getMainContainer();
                        formationContainer.setMarginTop(formationContainer.getMarginTop() + 20);
						
						formation.bind("changeWidth", btnHBox, "width");

						for (i = 0; i < ClientLib.Base.Util.get_ArmyMaxSlotCountX(); i++) {
							btnHBox.add(new qx.ui.core.Spacer(), {
								flex : 1
							});
							btnHBox.add(this.newTopButton(TABS.RES.IMG.Flip.V, this.tr("Mirrors units vertically."), this.onClick_btnMirror, "v", i));
							btnHBox.add(new qx.ui.core.Spacer().set({
									width : 2
								}));
							btnHBox.add(this.newTopButton(TABS.RES.IMG.Arrows.Up, this.tr("Shifts units one space up."), this.onClick_btnShift, "u", i));
							btnHBox.add(this.newTopButton(TABS.RES.IMG.Arrows.Down, this.tr("Shifts units one space down."), this.onClick_btnShift, "d", i));
							btnHBox.add(new qx.ui.core.Spacer(), {
								flex : 1
							});
						}
					} catch (e) {
						console.group("Tiberium Alliances Battle Simulator V2");
						console.error("Error setting up GUI.ArmySetupAttackBar constructor", e);
						console.groupEnd();
					}
				},
				destruct : function () {},
				members : {
					ArmySetupAttackBar : null,
					newSideButton : function (icon, text, onClick, pos, sel) {
						var btn = new qx.ui.form.ModelButton(null, icon).set({
								toolTipText : text,
								width : 20,
								maxHeight : 25,
								alignY : "middle",
								show : "icon",
								iconPosition : "top",
								appearance : "button-addpoints",
								model : [pos, sel]
							});
						btn.getChildControl("icon").set({
							maxWidth : 16,
							maxHeight : 16,
							scale : true
						});
						btn.addListener("click", onClick, this);
						return btn;
					},
					newTopButton : function (icon, text, onClick, pos, sel) {
						var btn = new qx.ui.form.ModelButton(null, icon).set({
								toolTipText : text,
								width : 25,
								maxHeight : 20,
								alignY : "middle",
								show : "icon",
								iconPosition : "top",
								appearance : "button-addpoints",
								opacity : 0.3,
								model : [pos, sel]
							});
						btn.getChildControl("icon").set({
							maxWidth : 14,
							maxHeight : 14,
							scale : true
						});
						btn.addListener("click", onClick, this);
						btn.addListener("mouseover", function (e) {
							e.getTarget().set({
								opacity : 1.0
							});
						}, this);
						btn.addListener("mouseout", function (e) {
							e.getTarget().set({
								opacity : 0.3
							});
						}, this);
						return btn;
					},
					onClick_btnMirror : function (e) {
						var formation = TABS.UTIL.Formation.Get();
						formation = TABS.UTIL.Formation.Mirror(formation, e.getTarget().getModel()[0], e.getTarget().getModel()[1]);
						TABS.UTIL.Formation.Set(formation);
					},
					onClick_btnShift : function (e) {
						var formation = TABS.UTIL.Formation.Get();
						formation = TABS.UTIL.Formation.Shift(formation, e.getTarget().getModel()[0], e.getTarget().getModel()[1]);
						TABS.UTIL.Formation.Set(formation);
					}
				},
				defer : function () {
					TABS.addInit("TABS.GUI.ArmySetupAttackBar");
				}
			});
			
            qx.Class.define("TABS.GUI.MovableBox", {
                extend : qx.ui.container.Composite,
                include : qx.ui.core.MMovable,
                construct : function(layout)
                {
                    this.base(arguments);
                    try
                    {
                        this.setLayout(layout);
                        this._activateMoveHandle(this);
                        //resizer.setLayout(new qx.ui.layout.HBox());
                    }
                    catch(e)
                    {
                        console.group("Tiberium Alliances Battle Simulator V2");
						console.error("Error setting up GUI.MovableBox constructor", e);
						console.groupEnd();
                    }
                }
            });
			
			qx.Class.define("TABS.GUI.PlayArea", {						// [singleton]	View Simulation, Open Stats Window
				type : "singleton",
				extend : qx.core.Object,
				include : [qx.locale.MTranslation],
				construct : function () {
					try {
                        this.base(arguments);
						this.PlayArea = qx.core.Init.getApplication().getPlayArea();
						this.HUD = this.PlayArea.getHUD();
						var WDG_COMBATSWAPVIEW = this.HUD.getUIItem(ClientLib.Data.Missions.PATH.WDG_COMBATSWAPVIEW);

						//View Simulation
						this.btnSimulation = new webfrontend.ui.SoundButton(null, TABS.RES.IMG.Simulate).set({
								toolTipText : this.tr("View Simulation") + " [NUM 0]",
								width : 44,
								height : 44,
								allowGrowX : false,
								allowGrowY : false,
								appearance : "button-baseviews",
								marginRight : 6
							});
						this.btnSimulation.addListener("click", function () {
							this.onClick_btnSimulation();
						}, this);
						TABS.APISimulation.getInstance().bind("time", this.btnSimulation, "label", {
							converter : function (data) {
								return (data / 1000).toFixed(1);
							}
						});
						TABS.APISimulation.getInstance().addListener("OnSimulateBattleFinished", function () {
							this._updateBtnSimulation();
						}, this);
						TABS.APISimulation.getInstance().addListener("OnTimeChange", function () {
							this._updateBtnSimulation();
						}, this);
						TABS.PreArmyUnits.getInstance().addListener("OnCityPreArmyUnitsChanged", function () {
							this._updateBtnSimulation();
						}, this);
						WDG_COMBATSWAPVIEW.getLayoutParent().addAfter(this.btnSimulation, WDG_COMBATSWAPVIEW);

						//Move Box
						this.boxMove = new TABS.GUI.MovableBox(new qx.ui.layout.Grid()).set({
							decorator : "pane-light-plain",
				            opacity : 0.7,
				            paddingTop : 0,
				            paddingLeft : 2,
				            paddingRight : 1,
				            paddingBottom : 3,
                            allowGrowX : false,
                            allowGrowY : false,
						});

						this.boxMove.add(this.newButton(TABS.RES.IMG.Stats, this.tr("Statistics") + " [NUM 7]", this.onClick_btnStats, null, null), {
							row : 0,
							column : 0
						});
						this.boxMove.add(this.newButton(TABS.RES.IMG.Arrows.Up, this.tr("Shifts units one space up.") + " [NUM 8]", this.onClick_btnShift, "u", null), {
							row : 0,
							column : 1
						});
						this.boxMove.add(this.newButton(TABS.RES.IMG.CNCOpt, this.tr("Show current formation with CNCOpt") + " [NUM 9]<br>" + this.tr("Right click: Set formation from CNCOpt Long Link") + "<br>" + this.tr("Remember transported units are not supported."), this.onClick_CNCOpt, null, null), {
							row : 0,
							column : 2
						});
						this.boxMove.add(this.newButton(TABS.RES.IMG.Arrows.Left, this.tr("Shifts units one space left.") + " [NUM 4]", this.onClick_btnShift, "l", null), {
							row : 1,
							column : 0
						});
						this.boxMove.add(this.newButton(TABS.RES.IMG.DisableUnit, this.tr("Enables/Disables all units.") + " [NUM 5]", this.onClick_btnDisable, null, null), {
							row : 1,
							column : 1
						});
						this.boxMove.add(this.newButton(TABS.RES.IMG.Arrows.Right, this.tr("Shifts units one space right.") + " [NUM 6]", this.onClick_btnShift, "r", null), {
							row : 1,
							column : 2
						});
						this.boxMove.add(this.newButton(TABS.RES.IMG.Flip.H, this.tr("Mirrors units horizontally.") + " [NUM 1]", this.onClick_btnMirror, "h", null), {
							row : 2,
							column : 0
						});
						this.boxMove.add(this.newButton(TABS.RES.IMG.Arrows.Down, this.tr("Shifts units one space down.") + " [NUM 2]", this.onClick_btnShift, "d", null), {
							row : 2,
							column : 1
						});
						this.boxMove.add(this.newButton(TABS.RES.IMG.Flip.V, this.tr("Mirrors units vertically.") + " [NUM 3]", this.onClick_btnMirror, "v", null), {
							row : 2,
							column : 2
						});
						this.boxMove.add(this.newButton(TABS.RES.IMG.Offense.Infantry, this.tr("Enables/Disables all infantry units.") + " [NUM *]", this.onClick_btnDisable, ClientLib.Data.EUnitGroup.Infantry, null), {
							row : 3,
							column : 0
						});
						this.boxMove.add(this.newButton(TABS.RES.IMG.Offense.Vehicle, this.tr("Enables/Disables all vehicles.") + " [NUM -]", this.onClick_btnDisable, ClientLib.Data.EUnitGroup.Vehicle, null), {
							row : 3,
							column : 1
						});
						this.boxMove.add(this.newButton(TABS.RES.IMG.Offense.Aircraft, this.tr("Enables/Disables all aircrafts.") + " [NUM +]", this.onClick_btnDisable, ClientLib.Data.EUnitGroup.Aircraft, null), {
							row : 3,
							column : 2
						});
						this.boxMove.add(this.newButton(TABS.RES.IMG.one, this.tr("Swaps lines 1 & 2."), this.onClick_btnSwap_1_2, "k", null), {
							row:4,
							column:0
						});
						this.boxMove.add(this.newButton(TABS.RES.IMG.two, this.tr("Swaps lines 2 & 3."), this.onClick_btnSwap_2_3, "z", null), {
							row:4,
							column:1
						});
						this.boxMove.add(this.newButton(TABS.RES.IMG.three, this.tr("Swaps lines 3 & 4."), this.onClick_btnSwap_3_4, "c", null), {
							row:4,
							column:2
						});
						this.PlayArea.add(this.boxMove, {
							//left : 65,
							right : 7,
							bottom : 170
						});

						phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this._onViewChanged);
						this._onViewChanged(ClientLib.Vis.Mode.CombatSetup, null);
					} catch (e) {
						console.group("Tiberium Alliances Battle Simulator V2");
						console.error("Error setting up GUI.PlayArea constructor", e);
						console.groupEnd();
					}
				},
				destruct : function () {},
				members : {
					PlayArea : null,
					HUD : null,
					btnSimulation : null,
					btnStats : null,
					boxMove : null,
					onHotKeyPress : function (key) {
						if (!phe.cnc.Util.isEventTargetInputField(key)) {
							var formation = TABS.UTIL.Formation.Get();
							switch (key.getNativeEvent().keyCode) {
							case 96: // NUM 0
								this.onClick_btnSimulation();
								break;
							case 97: // NUM 1
								formation = TABS.UTIL.Formation.Mirror(formation, "h", null);
								TABS.UTIL.Formation.Set(formation);
								break;
							case 98: // NUM 2
								formation = TABS.UTIL.Formation.Shift(formation, "d", null);
								TABS.UTIL.Formation.Set(formation);
								break;
							case 99: // NUM 3
								formation = TABS.UTIL.Formation.Mirror(formation, "v", null);
								TABS.UTIL.Formation.Set(formation);
								break;
							case 100: // NUM 4
								formation = TABS.UTIL.Formation.Shift(formation, "l", null);
								TABS.UTIL.Formation.Set(formation);
								break;
							case 101: // NUM 5
								formation = TABS.UTIL.Formation.toggle_Enabled(formation);
								TABS.UTIL.Formation.Set(formation);
								break;
							case 102: // NUM 6
								formation = TABS.UTIL.Formation.Shift(formation, "r", null);
								TABS.UTIL.Formation.Set(formation);
								break;
							case 103: // NUM 7
								this.onClick_btnStats();
								break;
							case 104: // NUM 8
								formation = TABS.UTIL.Formation.Shift(formation, "u", null);
								TABS.UTIL.Formation.Set(formation);
								break;
							case 105: // NUM 9
								this.onClick_CNCOpt();
								break;
							case 106: // NUM *
								formation = TABS.UTIL.Formation.toggle_Enabled(formation, ClientLib.Data.EUnitGroup.Infantry);
								TABS.UTIL.Formation.Set(formation);
								break;
							case 107: // NUM +
								formation = TABS.UTIL.Formation.toggle_Enabled(formation, ClientLib.Data.EUnitGroup.Aircraft);
								TABS.UTIL.Formation.Set(formation);
								break;
							case 109: // NUM -
								formation = TABS.UTIL.Formation.toggle_Enabled(formation, ClientLib.Data.EUnitGroup.Vehicle);
								TABS.UTIL.Formation.Set(formation);
								break;
							case 110: // NUM ,
								break;
							case 111: // NUM /
								break;
							}
						}
					},
					_onViewChanged : function (oldMode, newMode) {
						if (newMode == ClientLib.Vis.Mode.CombatSetup) {
							this.btnSimulation.show();
							this.boxMove.show();
							qx.bom.Element.addListener(document, "keydown", this.onHotKeyPress, this);
						}
						if (oldMode == ClientLib.Vis.Mode.CombatSetup) {
							this.btnSimulation.hide();
							this.boxMove.hide();
							qx.bom.Element.removeListener(document, "keydown", this.onHotKeyPress, this);
							TABS.APISimulation.getInstance().removeListener("OnSimulateBattleFinished", this.OnSimulateBattleFinished, this);
						}
						if ((newMode == ClientLib.Vis.Mode.CombatSetup || newMode == ClientLib.Vis.Mode.Battleground) && TABS.SETTINGS.get("GUI.Window.Stats.open", true) && !TABS.GUI.Window.Stats.getInstance().isVisible())
							TABS.GUI.Window.Stats.getInstance().open();
					},
					_updateBtnSimulation : function () {
						var formation = TABS.UTIL.Formation.Get();
						if (formation !== null) {
							if (TABS.UTIL.Formation.IsFormationInCache()) {
								this.btnSimulation.setEnabled(true);
								this.btnSimulation.setShow("icon");
							} else {
								this.btnSimulation.setEnabled(!TABS.APISimulation.getInstance().getLock() && TABS.UTIL.Formation.Get().length > 0);
								if (TABS.APISimulation.getInstance().getData().length === 0 || TABS.UTIL.Formation.Get().length === 0)
									this.btnSimulation.setShow("icon");
								else if (this.btnSimulation.getShow() !== "label") {
									this.btnSimulation.setShow("label");
								}
							}
						} else {
							this.btnSimulation.setEnabled(false);
							this.btnSimulation.setShow("icon");
						}
					},
					onClick_btnSimulation : function () {
						var cache = TABS.CACHE.getInstance().check(TABS.UTIL.Formation.Get());
						if (cache.result === null || cache.result.combat === undefined) {
							TABS.APISimulation.getInstance().addListener("OnSimulateBattleFinished", this.OnSimulateBattleFinished, this);
							TABS.APISimulation.getInstance().SimulateBattle();
						} else {
							var CurrentCityId = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity().get_Id();
                            TABS.UTIL.Battleground.StartReplay(CurrentCityId, cache.result.combat);
						}
					},
					OnSimulateBattleFinished : function (data) {
						TABS.APISimulation.getInstance().removeListener("OnSimulateBattleFinished", this.OnSimulateBattleFinished, this);
						var CurrentCityId = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity().get_Id();
                        TABS.UTIL.Battleground.StartReplay(CurrentCityId, data.getData().d);
					},
					onClick_btnStats : function () {
						if (TABS.GUI.Window.Stats.getInstance().isVisible()) {
							TABS.SETTINGS.set("GUI.Window.Stats.open", false);
							TABS.GUI.Window.Stats.getInstance().close();
						} else {
							TABS.SETTINGS.set("GUI.Window.Stats.open", true);
							TABS.GUI.Window.Stats.getInstance().open();
						}
					},
					newButton : function (icon, text, onClick, pos, sel) {
						var btn = new qx.ui.form.ModelButton(null, icon).set({
								toolTipText : text,
								width : 22,
								height : 22,
								show : "icon",
								iconPosition : "top",
								appearance : "button-addpoints",
								model : [pos, sel]
							});
						btn.getChildControl("icon").set({
							maxWidth : 16,
							maxHeight : 16,
							scale : true
						});
						btn.addListener("click", onClick, this);
						return btn;
					},
					onClick_btnMirror : function (e) {
						var formation = TABS.UTIL.Formation.Get();
						formation = TABS.UTIL.Formation.Mirror(formation, e.getTarget().getModel()[0], e.getTarget().getModel()[1]);
						TABS.UTIL.Formation.Set(formation);
					},
					onClick_btnShift : function (e) {
						var formation = TABS.UTIL.Formation.Get();
						formation = TABS.UTIL.Formation.Shift(formation, e.getTarget().getModel()[0], e.getTarget().getModel()[1]);
						TABS.UTIL.Formation.Set(formation);
					},
					onClick_btnSwap_1_2 : function (e) {
						var formation = TABS.UTIL.Formation.Get(),
						formation = TABS.UTIL.Formation.SwapLines(formation, 1, 2);
						TABS.UTIL.Formation.Set(formation);
					},
					onClick_btnSwap_2_3 : function (e) {
						var formation = TABS.UTIL.Formation.Get(),
						formation = TABS.UTIL.Formation.SwapLines(formation, 2, 3);
						TABS.UTIL.Formation.Set(formation);
					},
					onClick_btnSwap_3_4 : function (e) {
						var formation = TABS.UTIL.Formation.Get(),
						formation = TABS.UTIL.Formation.SwapLines(formation, 3, 4);
						TABS.UTIL.Formation.Set(formation);
					},
					onClick_btnDisable : function (e) {
						var formation = TABS.UTIL.Formation.Get();
						formation = TABS.UTIL.Formation.toggle_Enabled(formation, e.getTarget().getModel()[0]);
						TABS.UTIL.Formation.Set(formation);
					},
					onClick_CNCOpt : function (e) {
						if (e && e.isRightPressed())
							TABS.UTIL.Formation.Set(TABS.UTIL.CNCOpt.parseLink(prompt(this.tr("Enter CNCOpt Long Link:"))));
						else
							qx.core.Init.getApplication().showExternal(TABS.UTIL.CNCOpt.createLink());
					}
				},
				defer : function () {
					TABS.addInit("TABS.GUI.PlayArea");
				}
			});
			qx.Class.define("TABS.GUI.ReportReplayOverlay", {			// [singleton]	Back Button
				type : "singleton",
				extend : qx.core.Object,
				include : [qx.locale.MTranslation],
				construct : function () {
					try {
                        this.base(arguments);
						var qxApp = qx.core.Init.getApplication();
						this.ReportReplayOverlay = qx.core.Init.getApplication().getReportReplayOverlay();

						this.btnBack = new qx.ui.form.Button(qxApp.tr("tnf:back")).set({
								toolTipText : qxApp.tr("tnf:back"),
								width : 53,
								height : 24,
								appearance : "button-friendlist-scroll"
							});
						this.btnBack.addListener("click", this.onClick_btnBack, this);
						this.ReportReplayOverlay.add(this.btnBack, {
							top : 10,
							right : 540
						});

						this.btnSkip = new qx.ui.form.Button(qxApp.tr("Skip")).set({
								toolTipText : qxApp.tr("Skip"),
								width : 52,
								height : 24,
								appearance : "button-friendlist-scroll"
							});
						this.btnSkip.addListener("click", this.onClick_btnSkip, this);
						this.ReportReplayOverlay.add(this.btnSkip, {
							top : 10,
							left : 542
						});
					} catch (e) {
						console.group("Tiberium Alliances Battle Simulator V2");
						console.error("Error setting up GUI.ReportReplayOverlay constructor", e);
						console.groupEnd();
					}
				},
				destruct : function () {},
				members : {
					ReportReplayOverlay : null,
					btnBack : null,
					btnSkip : null,
					onClick_btnBack : function () {
						try {
                        				var city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity();
			                            	if (city !== null) {
				                           	qx.core.Init.getApplication().getPlayArea().setView(ClientLib.Data.PlayerAreaViewMode.pavmCombatSetupDefense, city.get_Id(), 0, 0);
				                           	ClientLib.Vis.VisMain.GetInstance().get_CombatSetup().SetPosition(0, qx.core.Init.getApplication().getPlayArea().getHUD().getCombatSetupOffset(ClientLib.Vis.CombatSetup.CombatSetupViewMode.Defense));
				                    	}
				                }
				                catch(e)
				                {
				                        console.group("Tiberium Alliances Battle Simulator V2");
				                        console.error("Error onClick_btnBack", e);
				                        console.groupEnd();
				                }
					},
					onClick_btnSkip : function () {
						if (ClientLib.Vis.VisMain.GetInstance().get_Battleground().get_Simulation !== undefined && ClientLib.Vis.VisMain.GetInstance().get_Battleground().get_Simulation().DoStep !== undefined) {
							while (ClientLib.Vis.VisMain.GetInstance().get_Battleground().get_Simulation().DoStep(false)) {}
							ClientLib.Vis.VisMain.GetInstance().get_Battleground().set_ReplaySpeed(1);
						} else {
							var BattleDuration = ClientLib.Vis.VisMain.GetInstance().get_Battleground().get_BattleDuration(),
								LastBattleTime = ClientLib.Vis.VisMain.GetInstance().get_Battleground().get_LastBattleTime();
							if (LastBattleTime >= BattleDuration)
								ClientLib.Vis.VisMain.GetInstance().get_Battleground().RestartReplay();
							ClientLib.Vis.VisMain.GetInstance().get_Battleground().set_ReplaySpeed(10000);
							phe.cnc.base.Timer.getInstance().addListener("uiTick", this.onTick_btnSkip, this);
						}
					},
					onTick_btnSkip : function () {
						var BattleDuration = ClientLib.Vis.VisMain.GetInstance().get_Battleground().get_BattleDuration(),
							LastBattleTime = ClientLib.Vis.VisMain.GetInstance().get_Battleground().get_LastBattleTime();
						if (LastBattleTime >= BattleDuration) {
							phe.cnc.base.Timer.getInstance().removeListener("uiTick", this.onTick_btnSkip, this);
							ClientLib.Vis.VisMain.GetInstance().get_Battleground().set_ReplaySpeed(1);
						}
					}
				},
				defer : function () {
					TABS.addInit("TABS.GUI.ReportReplayOverlay");
				}
			});
			qx.Class.define("TABS.GUI.Window.Stats", {					// [singleton]	Stats Window
				type : "singleton",
				extend : qx.ui.window.Window,
				construct : function () {
					try {
						this.base(arguments);
						this.set({
							layout : new qx.ui.layout.VBox(),
							caption : "TABS: " + this.tr("Statistics"),
							icon : TABS.RES.IMG.Stats,
							minWidth : 175,
							contentPadding : 4,
							contentPaddingTop : 0,
							contentPaddingBottom : 3,
							allowMaximize : false,
							showMaximize : false,
							allowMinimize : false,
							showMinimize : false,
							resizable : true,
							resizableTop : false,
							resizableBottom : false,
							useResizeFrame : false
						});
						this.moveTo(
							TABS.SETTINGS.get("GUI.Window.Stats.position", [124, 31])[0],
							TABS.SETTINGS.get("GUI.Window.Stats.position", [124, 31])[1]);
						this.addListener("move", function () {
							TABS.SETTINGS.set("GUI.Window.Stats.position", [this.getBounds().left, this.getBounds().top]);
						}, this);
						this.addListener("resize", function () {
							TABS.SETTINGS.set("GUI.Window.Stats.width", this.getWidth());
							this.makeSimView();
						}, this);
						this.addListener("changeHeight", function () {
							if (this.getHeight() !== null)
								this.resetHeight();
						});
						this.addListener("appear", this.onAppear, this);
						this.addListener("close", this.onClose, this);
						this.setWidth(TABS.SETTINGS.get("GUI.Window.Stats.width", 175));
						this.getChildControl("close-button").addListener("execute", function () {
							TABS.SETTINGS.set("GUI.Window.Stats.open", false);
						}, this);
						this.getChildControl("icon").set({
							width : 20,
							height : 20,
							scale : true,
							alignY : "middle"
						});
						this.setStatus("0 " + this.tr("simulations in cache"));

						this.GUI = {
							Battle : new qx.ui.container.Composite(new qx.ui.layout.HBox(-2)).set({
								decorator : "pane-light-plain",
								allowGrowX : true,
								marginLeft : 0,
								marginRight : 0
							}),
							Enemy : new qx.ui.container.Composite(new qx.ui.layout.HBox(-2)).set({
								decorator : "pane-light-plain",
								allowGrowX : true,
								marginLeft : 0,
								marginRight : 0
							}),
							Repair : new qx.ui.container.Composite(new qx.ui.layout.HBox(-2)).set({
								decorator : "pane-light-plain",
								allowGrowX : true,
								marginLeft : 0,
								marginRight : 0
							}),
							Loot : new qx.ui.container.Composite(new qx.ui.layout.HBox(-2)).set({
								decorator : "pane-light-plain",
								allowGrowX : true,
								marginLeft : 0,
								marginRight : 0
							}),
							Buttons : new qx.ui.container.Composite(new qx.ui.layout.HBox(-2)).set({
								decorator : "pane-light-plain",
								allowGrowX : true,
								marginLeft : 0,
								marginRight : 0
							})
						};
						this.LabelsVBox = {
							Battle : new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
								width : 29,
								padding : 9,
								allowGrowX : true,
								marginLeft : 0,
								marginRight : 0
							}),
							Enemy : new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
								width : 29,
								padding : 9,
								allowGrowX : true,
								marginLeft : 0,
								marginRight : 0
							}),
							Repair : new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
								width : 29,
								padding : 9,
								allowGrowX : true,
								marginLeft : 0,
								marginRight : 0
							}),
							Loot : new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
								width : 29,
								padding : 9,
								allowGrowX : true,
								marginLeft : 0,
								marginRight : 0
							}),
							Buttons : new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
								width : 29,
								padding : 9,
								allowGrowX : true,
								marginLeft : 0,
								marginRight : 0
							})
						};
						this.Label = {
							Battle : {
								Preset : new TABS.GUI.Window.Stats.Atom("P", null, this.tr("Preset")),
								Outcome : new TABS.GUI.Window.Stats.Atom("O", null, this.tr("tnf:combat report")),
								Duration : new TABS.GUI.Window.Stats.Atom("D", null, this.tr("tnf:combat timer npc: %1", "")),
								OwnCity : new TABS.GUI.Window.Stats.Atom("B", null, this.tr("tnf:base")),
								Morale : new TABS.GUI.Window.Stats.Atom("M", null, this.tr("Morale"))
							},
							Enemy : {
								Overall : new TABS.GUI.Window.Stats.Atom(this.tr("tnf:total"), TABS.RES.IMG.Enemy.All),
								Defense : new TABS.GUI.Window.Stats.Atom(this.tr("tnf:defense"), TABS.RES.IMG.Enemy.Defense),
								Structure : new TABS.GUI.Window.Stats.Atom(this.tr("tnf:base"), TABS.RES.IMG.Enemy.Base),
								Construction_Yard : new TABS.GUI.Window.Stats.Atom("CY", null, TABS.RES.getDisplayName(ClientLib.Base.ETechName.Construction_Yard, ClientLib.Base.EFactionType.GDIFaction)),
								Defense_Facility : new TABS.GUI.Window.Stats.Atom("DF", null, TABS.RES.getDisplayName(ClientLib.Base.ETechName.Defense_Facility, ClientLib.Base.EFactionType.GDIFaction)),
								Command_Center : new TABS.GUI.Window.Stats.Atom("CC", null, TABS.RES.getDisplayName(ClientLib.Base.ETechName.Command_Center, ClientLib.Base.EFactionType.GDIFaction)),
								Barracks : new TABS.GUI.Window.Stats.Atom("B", TABS.RES.IMG.Offense.Infantry, TABS.RES.getDisplayName(ClientLib.Base.ETechName.Barracks, ClientLib.Base.EFactionType.GDIFaction)),
								Factory : new TABS.GUI.Window.Stats.Atom("F", TABS.RES.IMG.Offense.Vehicle, TABS.RES.getDisplayName(ClientLib.Base.ETechName.Factory, ClientLib.Base.EFactionType.GDIFaction)),
								Airport : new TABS.GUI.Window.Stats.Atom("A", TABS.RES.IMG.Offense.Aircraft, TABS.RES.getDisplayName(ClientLib.Base.ETechName.Airport, ClientLib.Base.EFactionType.GDIFaction)),
								Support : new TABS.GUI.Window.Stats.Atom("S", null, this.tr("tnf:support"))
							},
							Repair : {
								Storage : new TABS.GUI.Window.Stats.Atom(this.tr("tnf:offense repair time"), TABS.RES.IMG.RepairCharge.Base),
								Overall : new TABS.GUI.Window.Stats.Atom(this.tr("tnf:repair points"), TABS.RES.IMG.RepairCharge.Offense),
								Crystal : new TABS.GUI.Window.Stats.Atom(this.tr("tnf:crystals"), TABS.RES.IMG.Resource.Crystal),
								Infantry : new TABS.GUI.Window.Stats.Atom(this.tr("tnf:infantry repair title"), TABS.RES.IMG.RepairCharge.Infantry),
								Vehicle : new TABS.GUI.Window.Stats.Atom(this.tr("tnf:vehicle repair title"), TABS.RES.IMG.RepairCharge.Vehicle),
								Aircraft : new TABS.GUI.Window.Stats.Atom(this.tr("tnf:aircraft repair title"), TABS.RES.IMG.RepairCharge.Aircraft)
							},
							Loot : {
								Tiberium : new TABS.GUI.Window.Stats.Atom(this.tr("tnf:tiberium"), TABS.RES.IMG.Resource.Tiberium),
								Crystal : new TABS.GUI.Window.Stats.Atom(this.tr("tnf:crystals"), TABS.RES.IMG.Resource.Crystal),
								Credits : new TABS.GUI.Window.Stats.Atom(this.tr("tnf:credits"), TABS.RES.IMG.Resource.Credits),
								ResearchPoints : new TABS.GUI.Window.Stats.Atom(this.tr("tnf:research points"), TABS.RES.IMG.Resource.ResearchPoints),
								Overall : new TABS.GUI.Window.Stats.Atom(this.tr("tnf:total") + " " + this.tr("tnf:loot"), TABS.RES.IMG.Resource.Transfer)
							},
							Buttons : {
								View : new TABS.GUI.Window.Stats.Atom(this.tr("View Simulation"), TABS.RES.IMG.Simulate).set({
									marginTop : 1,
									marginBottom : 5
								})
							}
						};
						for (var i in this.GUI) {
							for (var j in this.Label[i])
								this.LabelsVBox[i].add(this.Label[i][j]);
							this.GUI[i].add(this.LabelsVBox[i], {
								flex : 0
							});
						}

						//Enemy Health Section//
						this.EnemyHeader = this.makeHeader(this.tr("tnf:combat target"));
						this.EnemyHeader.addListener("click", function () {
							if (this.GUI.Enemy.isVisible()) {
								this.GUI.Enemy.exclude();
								TABS.SETTINGS.set("GUI.Window.Stats.Enemy.visible", false);
							} else {
								this.GUI.Enemy.show();
								TABS.SETTINGS.set("GUI.Window.Stats.Enemy.visible", true);
							}
						}, this);

						//Repair Section//
						this.RepairHeader = this.makeHeader(this.tr("tnf:own repair cost").replace(":", ""));
						this.RepairHeader.addListener("click", function () {
							if (this.GUI.Repair.isVisible()) {
								this.GUI.Repair.exclude();
								TABS.SETTINGS.set("GUI.Window.Stats.Repair.visible", false);
							} else {
								this.GUI.Repair.show();
								TABS.SETTINGS.set("GUI.Window.Stats.Repair.visible", true);
							}
						}, this);

						//Loot Section//
						this.LootHeader = this.makeHeader(this.tr("tnf:lootable resources:").replace(":", ""));
						this.LootHeader.addListener("click", function () {
							if (this.GUI.Loot.isVisible()) {
								this.GUI.Loot.exclude();
								TABS.SETTINGS.set("GUI.Window.Stats.Loot.visible", false);
							} else {
								this.GUI.Loot.show();
								TABS.SETTINGS.set("GUI.Window.Stats.Loot.visible", true);
							}
						}, this);

						this.add(this.GUI.Battle);
						this.add(this.EnemyHeader);
						this.add(this.GUI.Enemy);
						this.add(this.RepairHeader);
						this.add(this.GUI.Repair);
						this.add(this.LootHeader);
						this.add(this.GUI.Loot);
						this.add(this.GUI.Buttons);
						this.add(this.getChildControl("statusbar"));
						this.getChildControl("statusbar-text").set({
							textColor : "#BBBBBB"
						});
						this.getChildControl("statusbar").add(new qx.ui.core.Spacer(), {
							flex : 1
						});
						var fontsize = qx.theme.manager.Font.getInstance().resolve(this.getChildControl("statusbar-text").getFont()).getSize(),
							lblReset = new qx.ui.basic.Label(this.tr("Reset")).set({
								textColor : "#115274",
								font : new qx.bom.Font("statusbar-text").set({
									size : fontsize,
									decoration : "underline"
								})
							});
						lblReset.addListener("click", function () {
							var CurrentCityId = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId();
							if (CurrentCityId)
								TABS.CACHE.getInstance().clear(CurrentCityId);
						}, this);
						this.getChildControl("statusbar").add(lblReset);

						if (TABS.SETTINGS.get("GUI.Window.Stats.Enemy.visible", true) === false)
							this.GUI.Enemy.exclude();
						if (TABS.SETTINGS.get("GUI.Window.Stats.Repair.visible", true) === false)
							this.GUI.Repair.exclude();
						if (TABS.SETTINGS.get("GUI.Window.Stats.Loot.visible", true) === false)
							this.GUI.Loot.exclude();

						this.simViews = [];

						phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this._onViewChanged);
					} catch (e) {
						console.group("Tiberium Alliances Battle Simulator V2");
						console.error("Error setting up TABS.GUI.Window.Stats constructor", e);
						console.groupEnd();
					}
				},
				destruct : function () {},
				members : {
					GUI : null,
					LabelsVBox : null,
					Label : null,
					EnemyHeader : null,
					RepairHeader : null,
					LootHeader : null,
					simViews : null,
                    StatsChanged : false,
					onAppear : function () {
						phe.cnc.base.Timer.getInstance().addListener("uiTick", this.__onTick, this);
                        TABS.CACHE.getInstance().addListener("addSimulation", this.__updateStats, this);
						TABS.PreArmyUnits.getInstance().addListener("OnCityPreArmyUnitsChanged", this.__updateStats, this);
						phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.__CurrentCityChange);
						phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.__CurrentCityChange);
                        this.__updateStats();
					},
					onClose : function () {
						phe.cnc.base.Timer.getInstance().removeListener("uiTick", this.__onTick, this);
                        TABS.CACHE.getInstance().removeListener("addSimulation", this.__updateStats, this);
						TABS.PreArmyUnits.getInstance().removeListener("OnCityPreArmyUnitsChanged", this.__updateStats, this);
						phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.__CurrentCityChange);
						phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.__CurrentCityChange);
                        for (var i in this.simViews) {
                            this.simViews[i].resetStats();
                            this.simViews[i].__onTick();
                        }
					},
					__onTick : function () {
                        var CurrentCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity();
						if (!ClientLib.Vis.VisMain.GetInstance().GetActiveView().get_VisAreaComplete() || CurrentCity === null || CurrentCity.get_Version() < 0) return;
                        if (this.StatsChanged) {
                            this.StatsChanged = false;
                            for (var i in this.simViews) {
                                this.simViews[i].updateStats();
                                this.simViews[i].__onTick();
                            }
                        } else {
                            for (var i in this.simViews) {
                                this.simViews[i].__onTick();
                            }
                        }
						this.setStatus(TABS.CACHE.getInstance().getCitySimAmount().toString() + " " + this.tr("simulations in cache"));
					},
                    __updateStats : function () {
                        this.StatsChanged = true;
                    },
                    __CurrentCityChange : function (oldId, newId) {
						if (ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(newId) === null) {
                            for (var i in this.simViews) {
                                this.simViews[i].resetStats();
                            }
                        }
					},
					_onViewChanged : function (oldMode, newMode) {
						if (newMode != ClientLib.Vis.Mode.CombatSetup && newMode != ClientLib.Vis.Mode.Battleground)
							this.close();
					},
					makeHeader : function (text) {
						var Header = new qx.ui.container.Composite(new qx.ui.layout.VBox(5)).set({
								decorator : "pane-light-opaque"
							});
						Header.add(new qx.ui.basic.Label(text).set({
								alignX : "center",
								alignY : "middle",
								paddingTop : -4,
								paddingBottom : 4,
								font : "font_size_13_bold_shadow"
							}));
						return Header;
					},
					makeSimView : function () {
						var i,
							num = Math.round((this.getWidth() - 30) / 75);
						if (this.simViews.length != num) {
							for (i = 0; i < num; i++) {
								if (this.simViews[i] === undefined) {
									this.simViews[i] = new TABS.GUI.Window.Stats.SimView(i, this);
									this.GUI.Battle.add(this.simViews[i].GUI.Battle, {
										flex : 1,
										width : "100%"
									});
									this.GUI.Enemy.add(this.simViews[i].GUI.Enemy, {
										flex : 1,
										width : "100%"
									});
									this.GUI.Repair.add(this.simViews[i].GUI.Repair, {
										flex : 1,
										width : "100%"
									});
									this.GUI.Loot.add(this.simViews[i].GUI.Loot, {
										flex : 1,
										width : "100%"
									});
									this.GUI.Buttons.add(this.simViews[i].GUI.Buttons, {
										flex : 1,
										width : "100%"
									});
								}
							}
							for (i = 0; i < this.simViews.length; i++) {
								if (i >= num) {
									this.GUI.Battle.remove(this.simViews[i].GUI.Battle);
									this.GUI.Enemy.remove(this.simViews[i].GUI.Enemy);
									this.GUI.Repair.remove(this.simViews[i].GUI.Repair);
									this.GUI.Loot.remove(this.simViews[i].GUI.Loot);
									this.GUI.Buttons.remove(this.simViews[i].GUI.Buttons);
								}
							}
							while (this.simViews.length > num)
								this.simViews.splice(num, 1);
							this.__updateLabels();
                            this.__updateStats();
						}
					},
					__updateLabels : function () {
						if (this.simViews.length > 0) {
							var i,
								visibility;

							//Label.Battle.Morale
							visibility = "excluded";
							for (i in this.simViews) {
								if (this.simViews[i].Label.Battle.Morale.getValue() != "100%") {
									visibility = "visible";
									break;
								}
							}
							for (i in this.simViews)
								this.simViews[i].Label.Battle.Morale.setVisibility(visibility);
							this.Label.Battle.Morale.setVisibility(visibility);

							//Label.Enemy.Defense
							visibility = "excluded";
							if (this.simViews[0].Stats.Enemy.Defense.HealthPoints.getMax() > 0)
								visibility = "visible";
							for (i in this.simViews)
								this.simViews[i].Label.Enemy.Defense.setVisibility(visibility);
							this.Label.Enemy.Defense.setVisibility(visibility);

							//Label.Enemy.Defense_Facility
							visibility = "excluded";
							if (this.simViews[0].Stats.Enemy.Defense_Facility.HealthPoints.getMax() > 0)
								visibility = "visible";
							for (i in this.simViews)
								this.simViews[i].Label.Enemy.Defense_Facility.setVisibility(visibility);
							this.Label.Enemy.Defense_Facility.setVisibility(visibility);

							//Label.Enemy.Command_Center
							visibility = "excluded";
							if (this.simViews[0].Stats.Enemy.Command_Center.HealthPoints.getMax() > 0)
								visibility = "visible";
							for (i in this.simViews)
								this.simViews[i].Label.Enemy.Command_Center.setVisibility(visibility);
							this.Label.Enemy.Command_Center.setVisibility(visibility);

							//Label.Enemy.Barracks
							visibility = "excluded";
							if (this.simViews[0].Stats.Enemy.Barracks.HealthPoints.getMax() > 0)
								visibility = "visible";
							for (i in this.simViews)
								this.simViews[i].Label.Enemy.Barracks.setVisibility(visibility);
							this.Label.Enemy.Barracks.setVisibility(visibility);

							//Label.Enemy.Factory
							visibility = "excluded";
							if (this.simViews[0].Stats.Enemy.Factory.HealthPoints.getMax() > 0)
								visibility = "visible";
							for (i in this.simViews)
								this.simViews[i].Label.Enemy.Factory.setVisibility(visibility);
							this.Label.Enemy.Factory.setVisibility(visibility);

							//Label.Enemy.Airport
							visibility = "excluded";
							if (this.simViews[0].Stats.Enemy.Airport.HealthPoints.getMax() > 0)
								visibility = "visible";
							for (i in this.simViews)
								this.simViews[i].Label.Enemy.Airport.setVisibility(visibility);
							this.Label.Enemy.Airport.setVisibility(visibility);

							//Label.Enemy.Support
							visibility = "excluded";
							if (this.simViews[0].Stats.Enemy.Support.HealthPoints.getMax() > 0)
								visibility = "visible";
							for (i in this.simViews)
								this.simViews[i].Label.Enemy.Support.setVisibility(visibility);
							this.Label.Enemy.Support.setVisibility(visibility);
						}
					}
				}
			});
			qx.Class.define("TABS.GUI.Window.Stats.Atom", {				//				Stats Window Atom
				extend : qx.ui.basic.Atom,
				include : [qx.locale.MTranslation],
				construct : function (label, icon, toolTipText, toolTipIcon) {
					try {
						this.base(arguments, label, icon);
						if (label === undefined)
							label = null;
						if (icon === undefined)
							icon = null;
						if (toolTipText === undefined)
							toolTipText = null;
						if (toolTipIcon === undefined)
							toolTipIcon = null;
						var _toolTipText = (toolTipText !== null ? toolTipText : (label !== null ? label : "")),
							_toolTipIcon = (toolTipIcon !== null ? toolTipIcon : (icon !== null ? icon : "")),
							_show = (toolTipIcon !== null || icon !== null ? "icon" : (toolTipText !== null || label !== null ? "label" : "both"));
						this.initAlignX("center");
						this.initAlignY("middle");
						this.initGap(0);
						this.initIconPosition("top");
						this.initMinHeight(18);
						this.initToolTipText(_toolTipText);
						this.initToolTipIcon(_toolTipIcon);
						this.initShow(_show);
						this.setAlignX("center");
						this.setAlignY("middle");
						this.setGap(0);
						this.setIconPosition("top");
						this.setMinHeight(18);
						this.setToolTipText(_toolTipText);
						this.setToolTipIcon(_toolTipIcon);
						this.setShow(_show);
						this.getChildControl("icon").set({
							width : 18,
							height : 18,
							scale : true,
							alignY : "middle"
						});
					} catch (e) {
						console.group("Tiberium Alliances Battle Simulator V2");
						console.error("Error setting up TABS.GUI.Window.Stats.Atom constructor", e);
						console.groupEnd();
					}
				}
			});
			qx.Class.define("TABS.GUI.Window.Stats.SimView", {			//				Simulation View Objekt
				extend : qx.core.Object,
				include : [qx.locale.MTranslation],
				construct : function (num, window) {
					try {
                        this.base(arguments);
						var i,
							j,
							defaultPreset = TABS.SETTINGS.get("GUI.Window.Stats.SimView." + num, TABS.STATS.getPreset(num));
						if (defaultPreset.Name === undefined)
							defaultPreset = TABS.SETTINGS.set("GUI.Window.Stats.SimView." + num, TABS.STATS.getPreset(num)); // Reset Settings (if no Name)
						if (defaultPreset.Description === undefined)
							defaultPreset = TABS.SETTINGS.set("GUI.Window.Stats.SimView." + num, TABS.STATS.getPreset(num)); // Reset Settings (if no Description)
						this.Num = num;
						this.Window = window;
						this.Cache = {};
						this.Stats = new TABS.STATS();
						this.Name = defaultPreset.Name;
						this.Description = defaultPreset.Description;
						this.Prio = defaultPreset.Prio;
						this.GUI = {
							Battle : new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
								//padding : 5,
								allowGrowX : true,
								marginLeft : 0,
								marginRight : 0,
								decorator : "pane-light-opaque"
							}),
							Enemy : new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
								//padding : 5,
								allowGrowX : true,
								marginLeft : 0,
								marginRight : 0,
								decorator : "pane-light-opaque"
							}),
							Repair : new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
								//padding : 5,
								allowGrowX : true,
								marginLeft : 0,
								marginRight : 0,
								decorator : "pane-light-opaque"
							}),
							Loot : new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
								//padding : 5,
								allowGrowX : true,
								marginLeft : 0,
								marginRight : 0,
								decorator : "pane-light-opaque"
							}),
							Buttons : new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
								//padding : 5,
								allowGrowX : true,
								marginLeft : 0,
								marginRight : 0,
								decorator : "pane-light-opaque"
							})
						};
						this.Label = {
							Battle : {
								Preset : new qx.ui.basic.Label(this.tr(this.Name)).set({
									alignX : "center",
									alignY : "middle",
									minHeight : 18,
									toolTipText : this.tr(this.Description)
								}),
								Outcome : new qx.ui.basic.Atom("-", null).set({
									alignX : "center",
									alignY : "middle",
									gap : 0,
									iconPosition : "top",
									minHeight : 18,
									show : "label"
								}),
								Duration : new qx.ui.basic.Label("-:--").set({
									alignX : "center",
									alignY : "middle",
									minHeight : 18
								}),
								OwnCity : new qx.ui.basic.Label("-").set({
									alignX : "center",
									alignY : "middle",
									minHeight : 18
								}),
								Morale : new qx.ui.basic.Label("-").set({
									alignX : "center",
									alignY : "middle",
									minHeight : 18
								})
							},
							Enemy : {
								Overall : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Enemy",
									subType : "HealthPointsAbs"
								}),
								Defense : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Enemy",
									subType : "HealthPointsAbs"
								}),
								Structure : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Enemy",
									subType : "HealthPointsAbs"
								}),
								Construction_Yard : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Enemy",
									subType : "HealthPointsAbs"
								}),
								Defense_Facility : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Enemy",
									subType : "HealthPointsAbs"
								}),
								Command_Center : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Enemy",
									subType : "HealthPointsAbs"
								}),
								Barracks : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Enemy",
									subType : "HealthPointsAbs"
								}),
								Factory : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Enemy",
									subType : "HealthPointsAbs"
								}),
								Airport : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Enemy",
									subType : "HealthPointsAbs"
								}),
								Support : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Enemy",
									subType : "HealthPointsAbs"
								})
							},
							Repair : {
								Storage : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Repair",
									subType : "RepairStorage"
								}),
								Overall : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Repair",
									subType : "RepairCharge"
								}),
								Crystal : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Repair",
									subType : "Resource"
								}),
								Infantry : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Repair",
									subType : "RepairChargeInf"
								}),
								Vehicle : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Repair",
									subType : "RepairChargeVeh"
								}),
								Aircraft : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Repair",
									subType : "RepairChargeAir"
								})
							},
							Loot : {
								Tiberium : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Loot",
									subType : "Tiberium"
								}),
								Crystal : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Loot",
									subType : "Crystal"
								}),
								Credits : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Loot",
									subType : "Credits"
								}),
								ResearchPoints : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Loot",
									subType : "ResearchPoints"
								}),
								Overall : new TABS.GUI.Window.Stats.SimView.Label("-").set({
									type : "Loot",
									subType : "Resource"
								})
							},
							Buttons : {
								View : new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
									allowGrowX : true,
									marginLeft : 0,
									marginRight : 0
								})
							}
						};
						this.Label.Battle.Outcome.getChildControl("icon").set({
							width : 18,
							height : 18,
							scale : true,
							alignY : "middle"
						});
						this.Label.Repair.Overall.getContentElement().setStyle("text-shadow", "0 0 3pt");
						for (i in this.GUI) {
							for (j in this.Label[i]) {
								this.GUI[i].add(this.Label[i][j], {
									flex : 1,
									right : 0
								});
							}
							this.GUI[i].addListener("dblclick", this.loadFormation, this);
						}
						this.Stats.addListener("changeBattleDuration", this.__updateBattleDuration.bind(this, this.Label.Battle.Duration));
						for (i in this.Stats.Enemy) {
							if (this.Label.Enemy.hasOwnProperty(i)) {
								if (this.Stats.Enemy[i].hasOwnProperty("HealthPoints")) {
									this.Stats.Enemy[i].HealthPoints.bind("max", this.Label.Enemy[i].HealthPoints, "max");
									this.Stats.Enemy[i].HealthPoints.bind("start", this.Label.Enemy[i].HealthPoints, "start");
									this.Stats.Enemy[i].HealthPoints.bind("end", this.Label.Enemy[i].HealthPoints, "end");
									if (i == "Overall") {
										for (j in this.Label.Loot) {
											this.Stats.Enemy[i].HealthPoints.bind("max", this.Label.Loot[j].HealthPoints, "max");
											this.Stats.Enemy[i].HealthPoints.bind("start", this.Label.Loot[j].HealthPoints, "start");
											this.Stats.Enemy[i].HealthPoints.bind("end", this.Label.Loot[j].HealthPoints, "end");
										}
									}
								}
								if (this.Stats.Enemy[i].hasOwnProperty("Resource")) {
									this.Stats.Enemy[i].Resource.bind("Tiberium", this.Label.Enemy[i].Resource, "Tiberium");
									this.Stats.Enemy[i].Resource.bind("Crystal", this.Label.Enemy[i].Resource, "Crystal");
									this.Stats.Enemy[i].Resource.bind("Credits", this.Label.Enemy[i].Resource, "Credits");
									this.Stats.Enemy[i].Resource.bind("ResearchPoints", this.Label.Enemy[i].Resource, "ResearchPoints");
									this.Stats.Enemy[i].Resource.bind("RepairChargeBase", this.Label.Enemy[i].Resource, "RepairChargeBase");
									this.Stats.Enemy[i].Resource.bind("RepairChargeAir", this.Label.Enemy[i].Resource, "RepairChargeAir");
									this.Stats.Enemy[i].Resource.bind("RepairChargeInf", this.Label.Enemy[i].Resource, "RepairChargeInf");
									this.Stats.Enemy[i].Resource.bind("RepairChargeVeh", this.Label.Enemy[i].Resource, "RepairChargeVeh");
									if (i == "Overall") {
										for (j in this.Label.Loot) {
											this.Stats.Enemy[i].Resource.bind("Tiberium", this.Label.Loot[j].Resource, "Tiberium");
											this.Stats.Enemy[i].Resource.bind("Crystal", this.Label.Loot[j].Resource, "Crystal");
											this.Stats.Enemy[i].Resource.bind("Credits", this.Label.Loot[j].Resource, "Credits");
											this.Stats.Enemy[i].Resource.bind("ResearchPoints", this.Label.Loot[j].Resource, "ResearchPoints");
											this.Stats.Enemy[i].Resource.bind("RepairChargeBase", this.Label.Loot[j].Resource, "RepairChargeBase");
											this.Stats.Enemy[i].Resource.bind("RepairChargeAir", this.Label.Loot[j].Resource, "RepairChargeAir");
											this.Stats.Enemy[i].Resource.bind("RepairChargeInf", this.Label.Loot[j].Resource, "RepairChargeInf");
											this.Stats.Enemy[i].Resource.bind("RepairChargeVeh", this.Label.Loot[j].Resource, "RepairChargeVeh");
										}
									}
								}
							}
						}
						for (i in this.Stats.Offense) {
							if (this.Label.Repair.hasOwnProperty(i)) {
								if (this.Stats.Offense[i].hasOwnProperty("HealthPoints")) {
									this.Stats.Offense[i].HealthPoints.bind("max", this.Label.Repair[i].HealthPoints, "max");
									this.Stats.Offense[i].HealthPoints.bind("start", this.Label.Repair[i].HealthPoints, "start");
									this.Stats.Offense[i].HealthPoints.bind("end", this.Label.Repair[i].HealthPoints, "end");
								}
								if (this.Stats.Offense[i].hasOwnProperty("Resource")) {
									this.Stats.Offense[i].Resource.bind("Tiberium", this.Label.Repair[i].Resource, "Tiberium");
									this.Stats.Offense[i].Resource.bind("Crystal", this.Label.Repair[i].Resource, "Crystal");
									this.Stats.Offense[i].Resource.bind("Credits", this.Label.Repair[i].Resource, "Credits");
									this.Stats.Offense[i].Resource.bind("ResearchPoints", this.Label.Repair[i].Resource, "ResearchPoints");
									this.Stats.Offense[i].Resource.bind("RepairChargeBase", this.Label.Repair[i].Resource, "RepairChargeBase");
									this.Stats.Offense[i].Resource.bind("RepairChargeAir", this.Label.Repair[i].Resource, "RepairChargeAir");
									this.Stats.Offense[i].Resource.bind("RepairChargeInf", this.Label.Repair[i].Resource, "RepairChargeInf");
									this.Stats.Offense[i].Resource.bind("RepairChargeVeh", this.Label.Repair[i].Resource, "RepairChargeVeh");
                                    if (i == "Crystal") {
										for (j in this.Label.Repair) {
											this.Stats.Offense[i].Resource.bind("Tiberium", this.Label.Repair[j].Resource, "Tiberium");
											this.Stats.Offense[i].Resource.bind("Crystal", this.Label.Repair[j].Resource, "Crystal");
											this.Stats.Offense[i].Resource.bind("Credits", this.Label.Repair[j].Resource, "Credits");
											this.Stats.Offense[i].Resource.bind("ResearchPoints", this.Label.Repair[j].Resource, "ResearchPoints");
											this.Stats.Offense[i].Resource.bind("RepairChargeBase", this.Label.Repair[j].Resource, "RepairChargeBase");
											this.Stats.Offense[i].Resource.bind("RepairChargeAir", this.Label.Repair[j].Resource, "RepairChargeAir");
											this.Stats.Offense[i].Resource.bind("RepairChargeInf", this.Label.Repair[j].Resource, "RepairChargeInf");
											this.Stats.Offense[i].Resource.bind("RepairChargeVeh", this.Label.Repair[j].Resource, "RepairChargeVeh");
										}
									}
								}
							}
						}

						var ButtonAPISim = new qx.ui.form.ModelButton(null, TABS.RES.IMG.Simulate).set({
								maxHeight : 22,
								minWidth : 22,
								toolTipText : this.tr("tnf:refresh"),
								show : "icon",
								iconPosition : "top",
								appearance : "button-addpoints"
							});
						ButtonAPISim.getChildControl("icon").set({
							maxWidth : 16,
							maxHeight : 16,
							scale : true
						});
						ButtonAPISim.addListener("click", function () {
							this.loadFormation();
							TABS.APISimulation.getInstance().SimulateBattle();
						}, this);
						this.Label.Buttons.View.add(ButtonAPISim);

						var ButtonPlay = new qx.ui.form.ModelButton(null, TABS.RES.IMG.Arrows.Right).set({
								maxHeight : 22,
								minWidth : 22,
								toolTipText : this.tr("View Simulation"),
								show : "icon",
								iconPosition : "top",
								appearance : "button-addpoints"
							});
						ButtonPlay.getChildControl("icon").set({
							maxWidth : 16,
							maxHeight : 16,
							scale : true
						});
						ButtonPlay.addListener("click", this.playReplay, this);
						this.Label.Buttons.View.add(ButtonPlay);
					} catch (e) {
						console.group("Tiberium Alliances Battle Simulator V2");
						console.error("Error setting up GUI.Window.Stats.SimView constructor", e);
						console.groupEnd();
					}
				},
				destruct : function () {},
				members : {
					Num : null,
					Window : null,
					GUI : null,
					Label : null,
					Cache : null,
					Stats : null,
                    StatsChanged : false,
					Prio : null,
					Name : null,
					Description : null,
					updateStats : function () {
						var i,
							cache = null,
							CurrentCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity();
						if (CurrentCity !== null && CurrentCity.get_Version() !== -1 && ClientLib.Vis.VisMain.GetInstance().GetActiveView().get_VisAreaComplete()) {
							if (this.Prio.length === 0)
								cache = TABS.CACHE.getInstance().check(TABS.UTIL.Formation.Get());
							else
								cache = TABS.CACHE.getInstance().getPrio1(this.Prio);
						}

						if (cache !== null && cache.result !== null) {
							this.Cache = cache;
							this.Stats.setAny(cache.result.stats);
                            this.StatsChanged = true;
							this.__updateBattleOutcome();
							this.__updateBattleOwnCity();
							this.__updateBattleMoral();
							this.Window.__updateLabels();
						}

						if (typeof this.Cache["key"] !== "undefined" && typeof this.Cache["result"] !== "undefined" && typeof this.Cache.result["ownid"] !== "undefined") {
							if (CurrentCity !== null &&
								CurrentCity.get_Version() !== -1 &&
								ClientLib.Vis.VisMain.GetInstance().GetActiveView().get_VisAreaComplete() &&
								this.Cache.key === TABS.CACHE.getInstance().calcUnitsHash(TABS.UTIL.Formation.Get(), this.Cache.result.ownid)) {
								for (i in this.GUI) {
									this.GUI[i].setDecorator("pane-light-opaque");
									this.GUI[i].setOpacity(1);
								}
							} else {
								for (i in this.GUI) {
									this.GUI[i].setDecorator("pane-light-plain");
									this.GUI[i].setOpacity(0.7);
								}
							}
						}
					},
					resetStats : function () {
						this.Cache = {};
						this.Stats.setAny((new TABS.STATS()).getAny());
                        this.StatsChanged = true;
						this.__updateBattleOutcome();
						this.__updateBattleOwnCity();
						this.__updateBattleMoral();
						this.Window.__updateLabels();
						for (var i in this.GUI) {
							this.GUI[i].setDecorator("pane-light-opaque");
							this.GUI[i].setOpacity(1);
						}
					},
					loadFormation : function () {
						if (typeof this.Cache["result"] !== "undefined" && typeof this.Cache.result["formation"] !== "undefined" && typeof this.Cache.result["ownid"] !== "undefined") {
							ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentOwnCityId(this.Cache.result.ownid);
							TABS.UTIL.Formation.Set(this.Cache.result.formation);
						}
					},
					playReplay : function () {
                        TABS.UTIL.Battleground.StartReplay(this.Cache.result.cityid, this.Cache.result.combat);
					},
					__updateBattleOutcome : function () {
						if (Object.getOwnPropertyNames(this.Cache).length === 0) {
							this.Label.Battle.Outcome.setShow("label");
							this.Label.Battle.Outcome.resetIcon();
							this.Label.Battle.Outcome.resetToolTipIcon();
							this.Label.Battle.Outcome.resetToolTipText();
						} else if (this.Label.Repair.Overall.HealthPoints.getEnd() <= 0) {
							this.Label.Battle.Outcome.setIcon(TABS.RES.IMG.Outcome.total_defeat);
							this.Label.Battle.Outcome.setToolTipIcon(TABS.RES.IMG.Outcome.total_defeat);
							this.Label.Battle.Outcome.setToolTipText(this.tr("tnf:total defeat"));
							this.Label.Battle.Outcome.setShow("icon");
						} else if (this.Label.Enemy.Overall.HealthPoints.getEnd() <= 0) {
							this.Label.Battle.Outcome.setIcon(TABS.RES.IMG.Outcome.total_victory);
							this.Label.Battle.Outcome.setToolTipIcon(TABS.RES.IMG.Outcome.total_victory);
							this.Label.Battle.Outcome.setToolTipText(this.tr("tnf:total victory"));
							this.Label.Battle.Outcome.setShow("icon");
						} else {
							this.Label.Battle.Outcome.setIcon(TABS.RES.IMG.Outcome.victory);
							this.Label.Battle.Outcome.setToolTipIcon(TABS.RES.IMG.Outcome.victory);
							this.Label.Battle.Outcome.setToolTipText(this.tr("tnf:victory"));
							this.Label.Battle.Outcome.setShow("icon");
						}
					},
					__updateBattleDuration : function (label, e) {
						label.setValue(e.getData() > 0 ? phe.cnc.Util.getTimespanString(e.getData() / 1000) : "-:--");
					},
					__updateBattleOwnCity : function () {
						if (typeof this.Cache["result"] !== "undefined" && typeof this.Cache.result["ownid"] !== "undefined") {
							var ownCity = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(this.Cache.result.ownid);
							if (ownCity !== null)
								this.Label.Battle.OwnCity.setValue(ownCity.get_Name());
							else
								this.Label.Battle.OwnCity.resetValue();
						} else
							this.Label.Battle.OwnCity.resetValue();
					},
					__updateBattleMoral : function () {
						if (typeof this.Cache["result"] !== "undefined" && typeof this.Cache.result["cityid"] !== "undefined" && typeof this.Cache.result["ownid"] !== "undefined") {
							var CurrentCity = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(this.Cache.result.cityid),
								OwnCity = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(this.Cache.result.ownid);
							if (CurrentCity !== null && OwnCity !== null) {
								var MoralSignType = ClientLib.Base.Util.GetMoralSignType(OwnCity.get_LvlOffense(), CurrentCity.get_LvlBase()),
									moral = 100;
								if (ClientLib.Data.MainData.GetInstance().get_Server().get_CombatUseMoral() && CurrentCity.IsNPC() && CurrentCity.get_Id() != ClientLib.Data.MainData.GetInstance().get_EndGame().GetCenter().get_CombatId() && (MoralSignType.k == 1 || MoralSignType.k == 2)) {
									moral = "~" + (moral - MoralSignType.v) + "%";
									if (MoralSignType.k == 1) {
										this.Label.Battle.Morale.setTextColor(webfrontend.theme.Color.colors["res-orange"]);
										this.Label.Battle.Morale.setToolTipText(this.tr("tnf:region moral warning %1", MoralSignType.v));
										this.Label.Battle.Morale.setToolTipIcon("resource/webfrontend/ui/common/icon_moral_alert_orange.png");
									} else if (MoralSignType.k == 2) {
										this.Label.Battle.Morale.setTextColor(webfrontend.theme.Color.colors["res-red"]);
										this.Label.Battle.Morale.setToolTipText(this.tr("tnf:region moral error %1", MoralSignType.v));
										this.Label.Battle.Morale.setToolTipIcon("resource/webfrontend/ui/common/icon_moral_alert_red.png");
									}
								} else {
									moral = moral + "%";
									this.Label.Battle.Morale.resetTextColor();
									this.Label.Battle.Morale.resetToolTipText();
									this.Label.Battle.Morale.resetToolTipIcon();
								}
								this.Label.Battle.Morale.setValue(moral);
							} else {
								this.Label.Battle.Morale.setValue("-");
								this.Label.Battle.Morale.resetTextColor();
								this.Label.Battle.Morale.resetToolTipText();
								this.Label.Battle.Morale.resetToolTipIcon();
							}
						}
					},
					__onTick : function () {
						if (typeof this.Cache["result"] !== "undefined" && typeof this.Cache.result["ownid"] !== "undefined") {
							var ownCity = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(this.Cache.result.ownid);
                            if (ownCity !== null) {
                                var RepairCharge = Math.min(
                                        ownCity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeInf),
                                        ownCity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeVeh),
                                        ownCity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeAir));
                                this.Label.Repair.Storage.setValue(phe.cnc.Util.getTimespanString(ClientLib.Data.MainData.GetInstance().get_Time().GetTimeSpan(RepairCharge)));
                            } else
                                this.Label.Repair.Storage.resetValue();
						} else
							this.Label.Repair.Storage.resetValue();
                        if (this.StatsChanged) {
                            this.StatsChanged = false;
                            for (var i in this.Label.Enemy) {
                                this.Label.Enemy[i].__update();
                            }
                            for (i in this.Label.Repair) {
                                this.Label.Repair[i].__update();
                            }
                            for (i in this.Label.Loot) {
                                this.Label.Loot[i].__update();
                            }
                        }
					}
				}
			});
			qx.Class.define("TABS.GUI.Window.Stats.SimView.Label", {	//				Simulation View Label
				extend : qx.ui.basic.Label,
				include : [qx.locale.MTranslation],
				construct : function (label) {
					try {
                        this.base(arguments, label);
						this.initAlignX("right");
						this.initAlignY("middle");
						this.initMinHeight(18);
						this.setAlignX("right");
						this.setAlignY("middle");
						this.setMinHeight(18);
						this.HealthPoints = new TABS.STATS.Entity.HealthPoints();
						this.Resource = new TABS.STATS.Entity.Resource();
					} catch (e) {
						console.group("Tiberium Alliances Battle Simulator V2");
						console.error("Error setting up TABS.GUI.Window.Stats.SimView.Label constructor", e);
						console.groupEnd();
					}
				},
				properties : {
					type : {
						init : "Enemy",
						check : ["Enemy", "Repair", "Loot"]
					},
					subType : {
						init : "HealthPointsAbs",
						check : ["HealthPointsAbs", "HealthPointsRel", "RepairCharge", "RepairStorage", "RepairCrystal", "Resource", "Tiberium", "Crystal", "Credits", "ResearchPoints"]
					}
				},
				members : {
					HealthPoints : null,
					Resource : null,
					__update : function () {
						var value = null;
						if (ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity() !== null) {
							switch (this.getType()) {
							case "Enemy":
								switch (this.getSubType()) {
								case "HealthPointsAbs":
									value = this.HealthPointsAbs();
									break;
								case "HealthPointsRel":
									value = this.HealthPointsRel();
									break;
								case "RepairCharge":
									value = this.RepairCharge();
									break;
								default:
									break;
								}
								break;
							case "Repair":
								switch (this.getSubType()) {
								case "HealthPointsAbs":
									value = this.HealthPointsAbs();
									break;
								case "HealthPointsRel":
									value = this.HealthPointsRel();
									break;
								case "RepairCharge":
								case "RepairChargeInf":
								case "RepairChargeVeh":
								case "RepairChargeAir":
									value = this.RepairCharge();
									break;
								case "RepairStorage":
                                    return;
								case "Resource":
									value = this.RepairCharge();
									break;
								default:
									break;
								}
								break;
							case "Loot":
								switch (this.getSubType()) {
								case "Resource":
								case "Tiberium":
								case "Crystal":
								case "Credits":
								case "ResearchPoints":
									value = this.Loot();
									break;
								default:
									break;
								}
								break;
							default:
								break;
							}
						}

						if (this.HealthPoints.getMax() > 0 && value !== null) {
							this.setValue(value.text);
							this.setTextColor(value.color);
						} else {
							this.resetValue();
							this.resetTextColor();
						}
					},
					HealthPointsAbs : function () {
						if (this.HealthPoints.getMax() > 0) {
							var percent = (this.HealthPoints.getEnd() / this.HealthPoints.getMax()) * 100,
								digits = (percent <= 0 || percent >= 100 ? 0 : (percent >= 10 ? 1 : 2));
							percent = Math.round(percent * Math.pow(10, digits)) / Math.pow(10, digits);
							return {
								text : percent.toFixed(digits) + " %",
								color : this.getColorFromPercent(this.HealthPoints.getEnd() / this.HealthPoints.getMax())
							};
						}
						return null;
					},
					HealthPointsRel : function () {
						if (this.HealthPoints.getMax() > 0) {
							var percent = ((this.HealthPoints.getStart() - this.HealthPoints.getEnd()) / this.HealthPoints.getMax()) * 100,
								digits = (percent <= 0 || percent >= 100 ? 0 : (percent >= 10 ? 1 : 2));
							percent = Math.round(percent * Math.pow(10, digits)) / Math.pow(10, digits);
							return {
								text : percent.toFixed(digits) + " %",
								color : this.getColorFromPercent(this.HealthPoints.getEnd() / this.HealthPoints.getMax())
							};
						}
						return null;
					},
					RepairCharge : function () {
                        if(this.getSubType() == "Resource")
                        {
                            res = 0;
                            res = this.Resource.getCrystal();
                            
                            return {
								text : phe.cnc.gui.util.Numbers.formatNumbersCompact(res),
								color : this.getColorFromPercent(1)
							};
                        }
                        else
                        {
                            res = 0;
                            if (this.HealthPoints.getMax() > 0) {
                                switch (this.getSubType()) {
                                    case "RepairChargeInf":
                                         res = this.Resource.getRepairChargeInf();
                                        break;
                                    case "RepairChargeVeh":
                                         res = this.Resource.getRepairChargeVeh();
                                        break;
                                    case "RepairChargeAir":
                                         res = this.Resource.getRepairChargeAir();
                                        break;
                                    case "RepairCharge":
                                         res = Math.max(this.Resource.getRepairChargeBase(), this.Resource.getRepairChargeAir(), this.Resource.getRepairChargeInf(), this.Resource.getRepairChargeVeh());
                                        break;
                                }
                                return {
                                    text : phe.cnc.Util.getTimespanString(res),
                                    color : this.getColorFromPercent(1 - (this.HealthPoints.getEnd() / this.HealthPoints.getMax()))
                                };
                            }
                        }
						return null;
					},
					Loot : function () {
						var res = 0,
							lootFromCurrentCity = TABS.UTIL.Stats.get_LootFromCurrentCity(),
							loot;
						if (this.HealthPoints.getMax() > 0 && lootFromCurrentCity !== null) {
							switch (this.getSubType()) {
							case "Resource":
								res = this.Resource.getTiberium() + this.Resource.getCrystal() + this.Resource.getCredits() + this.Resource.getResearchPoints();
								loot = lootFromCurrentCity.getTiberium() + lootFromCurrentCity.getCrystal() + lootFromCurrentCity.getCredits() + lootFromCurrentCity.getResearchPoints();
								break;
							case "Tiberium":
								res = this.Resource.getTiberium();
								loot = lootFromCurrentCity.getTiberium();
								break;
							case "Crystal":
								res = this.Resource.getCrystal();
								loot = lootFromCurrentCity.getCrystal();
								break;
							case "Credits":
								res = this.Resource.getCredits();
								loot = lootFromCurrentCity.getCredits();
								break;
							case "ResearchPoints":
								res = this.Resource.getResearchPoints();
								loot = lootFromCurrentCity.getResearchPoints();
								break;
							}
							return {
								text : phe.cnc.gui.util.Numbers.formatNumbersCompact(res),
								color : this.getColorFromPercent(1 - (res / loot))
							};
						}
						return null;
					},
					getColorFromPercent : function (value) { // 1 = red, 0.5 = yellow, 0 = green
						return "hsl(" + ((120 - ((100 - ((1 - value) * 100)) * 1.2)) - 0) + ", 100%, " + (25 + Math.round(((Math.abs(Math.max(value - 0.4, 0)) * 2) + (Math.abs(Math.max((1 - value) - 0.6, 0)))) * 25)) + "%)";
					}
				}
			});
			qx.Class.define("TABS.GUI.Window.Prios", {					// [singleton]	Prios Window
				extend : qx.ui.window.Window,
				construct : function (prios) {
					try {
						this.base(arguments);
						this.set({
							layout : new qx.ui.layout.Grid(),
							caption : this.tr("Priority Setup"),
							allowMaximize : false,
							showMaximize : false,
							allowMinimize : false,
							showMinimize : false,
							resizable : false
						});
						this.center();
						this.Prios = prios;
					} catch (e) {
						console.group("Tiberium Alliances Battle Simulator V2");
						console.error("Error setting up TABS.GUI.Window.Prios constructor", e);
						console.groupEnd();
					}
				},
				members : {
					Prios : null
				}
			});
		}
		function translation() {
			var localeManager = qx.locale.Manager.getInstance();

			// Default language is english (en)
			// Available Languages are: ar,ce,cs,da,de,en,es,fi,fr,hu,id,it,nb,nl,pl,pt,ro,ru,sk,sv,ta,tr,uk
			// You can send me translations so I can include them in the Script.

			// German
			localeManager.addTranslation("de", {
				"Shifts units one space up." : "Verschiebt Einheiten einen Platz nach oben.", //GUI.ArmySetupAttackBar
				"Shifts units one space down." : "Verschiebt die Einheiten einen Platz nach unten.", //GUI.ArmySetupAttackBar
				"Shifts units one space left." : "Verschiebt die Einheiten einen Platz nach links.", //GUI.ArmySetupAttackBar
				"Shifts units one space right." : "Verschiebt die Einheiten einen Platz nach rechts.", //GUI.ArmySetupAttackBar
				"Mirrors units horizontally." : "Spiegelt die Einheiten horizontal.", //GUI.ArmySetupAttackBar
				"Mirrors units vertically." : "Spiegelt die Einheiten vertikal.", //GUI.ArmySetupAttackBar
				"View Simulation" : "Simulation anzeigen", //GUI.PlayArea + GUI.Window.Stats.SimView
				"Statistics" : "Statistik", //GUI.PlayArea + GUI.Window.Stats
				"Show current formation with CNCOpt" : "Zeigt die aktuelle Formation mit CNCOpt an", //GUI.PlayArea
				"Right click: Set formation from CNCOpt Long Link" : "Rechtsklick: Formation von CNCOpt Long Link laden", //GUI.PlayArea
				"Remember transported units are not supported." : "Denk daran das transportierte Einheiten nicht unterstützt werden.", //GUI.PlayArea
				"Enter CNCOpt Long Link:" : "CNCOpt Long Link eingeben:", //GUI.PlayArea
				"simulations in cache" : "Simulationen im Cache", //GUI.Window.Stats
				"Most priority to construction yard including all in front of it.<br>After this the best total enemy health from the cached simulations is selected.<br>If no better simulation is found, the best offence unit repair charge and<br>battle duration from the cached simulations is selected." : "Die größte Priorität liegt auf dem Bauhof mit allem was vor ihm liegt.<br>Danach wird die Simulation aus dem Cache herausgesucht die den meisten<br>Schaden am Gegner verursacht.<br>Wenn keine bessere Formation gefunden wird, wird die Simulation mit der<br>niedrigsten Offensiv Reperaturzeit und besten Kampfdauer aus dem Cache herausgesucht.", //STATS
				"Most priority to defense facility including all in front of it.<br>After this the best armored defense health from the cached simulations is selected.<br>If no better simulation is found, the best offence unit repair charge and<br>battle duration from the cached simulations is selected." : "Die größte Priorität liegt auf der Verteidigungseinrichtung mit allem was vor ihr liegt.<br>Danach wird die Simulation aus dem Cache herausgesucht die den meisten<br>Schaden an bewaffneten Defensiveinheiten verursacht.<br>Wenn keine bessere Formation gefunden wird, wird die Simulation mit der<br>niedrigsten Offensiv Reperaturzeit und besten Kampfdauer aus dem Cache herausgesucht.", //STATS
				"Most priority to defense health including the auto repair after the battle.<br>If no better simulation is found, the best offence unit repair charge and<br>battle duration from the cached simulations is selected." : "Die größte Priorität liegt auf dem verursachtem Schaden an Defensiveinheiten<br>unter Berücksichtigung der automatischen Reperatur nach dem Kampf.<br>Wenn keine bessere Formation gefunden wird, wird die Simulation mit der<br>niedrigsten Offensiv Reperaturzeit und besten Kampfdauer aus dem Cache herausgesucht.", //STATS
				"Most priority to command center including all in front of it.<br>After this the best total enemy health from the cached simulations is selected.<br>If no better simulation is found, the best offence unit repair charge and<br>battle duration from the cached simulations is selected." : "Die größte Priorität liegt auf der Komandozentrale mit allem was vor ihr liegt.<br>Danach wird die Simulation aus dem Cache herausgesucht die den meisten<br>Schaden am Gegner verursacht.<br>Wenn keine bessere Formation gefunden wird, wird die Simulation mit der<br>niedrigsten Offensiv Reperaturzeit und besten Kampfdauer aus dem Cache herausgesucht.", //STATS
				"NoKill (farming) priorety.<br>Not working correctly yet." : "Vorschießen (farmen) Priorität.<br>Funktioniert noch nicht sehr gut.", //STATS
				"Shows the current army formation." : "Zeigt die aktuelle Armeeformation an." //STATS
			});
		}
		function waitForGame() {
			try {
				if (typeof qx != 'undefined' &&
					typeof qx.core != 'undfined' &&
					typeof qx.core.Init != 'undefined') {
					var app = qx.core.Init.getApplication();
					if (app !== null && app.initDone === true &&
						ClientLib.Data.MainData.GetInstance().get_Player().get_Id() !== 0 &&
						ClientLib.Data.MainData.GetInstance().get_Server().get_WorldId() !== 0) {
						try {
							console.time("loaded in");
							
							// replacing LoadCombatDirect
							if (ClientLib.Vis.Battleground.Battleground.prototype.LoadCombatDirect === undefined) {
							var sBString = ClientLib.API.Battleground.prototype.SimulateBattle.toString();
							var targetMethod = sBString.match(/\{battleSetup:[a-z]+\},\s?\(new \$I\.[A-Z]{6}\)\.[A-Z]{6}\(this,this\.([A-Z]{6})\),\s?this\);/)[1];
							var lCString = ClientLib.API.Battleground.prototype[targetMethod].toString();
							var methodLoadDirect = lCString.match(/\$I\.[A-Z]{6}\.[A-Z]{6}\(\)\.[A-Z]{6}\(\)\.([A-Z]{6})\(b\.d\);/)[1];
							console.log(methodLoadDirect);
							ClientLib.Vis.Battleground.Battleground.prototype.LoadCombatDirect = ClientLib.Vis.Battleground.Battleground.prototype[methodLoadDirect];
							}
                            translation();
                            createClasses();
                            TABS.getInstance();
							console.group("Tiberium Alliances Battle Simulator V2");
							console.timeEnd("loaded in");
							console.groupEnd();
						} catch (e) {
							console.group("Tiberium Alliances Battle Simulator V2");
							console.error("Error in waitForGame", e);
							console.groupEnd();
						}
					} else {
						window.setTimeout(waitForGame, 1000);
					}
				} else {
					window.setTimeout(waitForGame, 1000);
				}
			} catch (e) {
				console.group("Tiberium Alliances Battle Simulator V2");
				console.error("Error in waitForGame", e);
				console.groupEnd();
			}
		}
		window.setTimeout(waitForGame, 1000);
	}
	.toString() + ")();";
	script.type = "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(script);
})();