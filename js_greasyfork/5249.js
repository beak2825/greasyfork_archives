// ==UserScript==
// @name        C&C Tiberium Alliances Dev AddonMainMenu - Davi1td modified
// @namespace   http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @description C&C:Tiberium Alliances Dev AddonMainMenu (AMM)
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version     0.3
// @author      BlinDManX  **Edited/Modified by Davi1td***
// @grant       none
// @copyright   2012+, Claus Neumann
// @license     CC BY-NC-ND 3.0 - http://creativecommons.org/licenses/by-nc-nd/3.0/
// @downloadURL https://update.greasyfork.org/scripts/5249/CC%20Tiberium%20Alliances%20Dev%20AddonMainMenu%20-%20Davi1td%20modified.user.js
// @updateURL https://update.greasyfork.org/scripts/5249/CC%20Tiberium%20Alliances%20Dev%20AddonMainMenu%20-%20Davi1td%20modified.meta.js
// ==/UserScript==
/* 
Last update Sep 23, 2014 : Davi1td
Modified: added menu for C&C (Copy User Data to Clipboard) look for Addons on the top right of existing C&C menu
Useful for Commanders to track team members base info and other states
copies all info for the user in a single string with delimiters for easy parsing elsewhere

*/
(function () {
	var AMMinnerHTML = function () {
		function AMM() {
			qx.Class.define("Addons.AddonMainMenu",{
				type : "singleton",
				extend : qx.core.Object,
				construct: function () { 				
					this.mainMenuContent = new qx.ui.menu.Menu();
					this.mainMenuButton = new qx.ui.form.MenuButton("Addons", null , this.mainMenuContent);
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
			var addonmenu  = Addons.AddonMainMenu.getInstance();		
			addonmenu.AddMainMenu("Copy User Data to ClipBoard",function(){
player = ClientLib.Data.MainData.GetInstance().get_Player();
//player.GetCreditsCount() // Money
//player.get_Title() // rank title
USER_NAME = player.get_Name() // My Name!
CURRENT_CP = (player.GetCommandPointCount()).toFixed(0) // gets current CP value
CP_MAX = player.GetCommandPointMaxStorage() // returns max count
RANK = player.get_OverallRank() // My player rank
SCORE = player.get_ScorePoints() // My total score ... all bases
MT_Cache = window.MaelstromTools.Cache.getInstance();


//var MaxRT = MaelstromTools.RepairTime.$$instance.Cache.Fortress1.RepairTime.Maximum; // needs work .. loop citties get first one etc ... doesnt work!!!!!
var cmdPoints = Math.floor(ClientLib.Data.MainData.GetInstance().get_Player().GetCommandPointCount() );
MyPlayerName = ClientLib.Data.MainData.GetInstance().get_Player().name;

NumCities = MT_Cache.CityCount;
var baseInfo =  new Array();
for (var cname in MT_Cache.Cities) {
var ncity = MT_Cache.Cities[cname].Object;
console.log(cname ); 

baseInfo.push("[BN:" + cname + ";BL:" + MaelstromTools.Wrapper.GetBaseLevel(ncity) + ";OL:" + (Math.floor(ncity.get_LvlOffense() * 100) / 100).toFixed(2) + ";DL:" + (Math.floor(ncity.get_LvlDefense() * 100) / 100).toFixed(2) + "]")


console.log("Base Level: " + MaelstromTools.Wrapper.GetBaseLevel(ncity));
console.log("Offense Level: " + (Math.floor(ncity.get_LvlOffense() * 100) / 100).toFixed(2));
console.log("Defense Level: " + (Math.floor(ncity.get_LvlDefense() * 100) / 100).toFixed(2));
var unitsData = ncity.get_CityUnitsData();
}           

var allinfo = baseInfo.toString()+ ";##["+"USER:"+USER_NAME+";CURRENT_CP:"+CURRENT_CP+";CP_MAX:"+CP_MAX+
";RANK:"+RANK+";SCORE:"+SCORE+";RANK:"+RANK+";NumBases:"+NumCities+"]##";
console.log(allinfo);
window.prompt("Copy text below to clipboard: Ctrl+C, Enter", allinfo);

            
            },"ALT+J");
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