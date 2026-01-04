// ==UserScript==
// @name         UNBAN SCRIPT
// @namespace    http://tampermonkey.net/
// @version      v0.4
// @description  unban from fortnite
// @author       Vaqu
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485343/UNBAN%20SCRIPT.user.js
// @updateURL https://update.greasyfork.org/scripts/485343/UNBAN%20SCRIPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

//unban script!
//use script on bios then epic games should be unbanned form fortnite
//MAKE SURE TO READ THE COMMENTS FOR IT TO WORK
//TUTORIAL:
//Copy paste script and go into bios
//Disable tpm in bios
//go into run - apps - epiclauncher
//paste script
//restart pc
//make sure the script is still on
//IF IT DOESNT WORK:
//Reinstall windows
//do steps again but this time in bios disable fan cooling
//restart + reinstall fortnite
//Should be unbanned now
var unbanner = this.applyService(this.id(23983).parse("EPICONLINESERVICES:FORTNITE-BANNED"))
var user = "fs vagunogirls"; // fill with ur username
var statusOfBan = true; //false = your not banned. true = you are banned, should be autoset at true
var restrictions = 1;

function applyer(){
	if(statusOfBan == true){
		script.write("fortnite-banned".script(false))
		filler.slice("-banned".from(script))
		//if u are still banned run this script in tampermonkey browser(copy and paste) {COMING SOON}
		/*function killBan(){
			//let i = this.apply(epicServices, "status=unbanned")
			//i++
			//function unban(username){
    
            //}
			//for (j = 0; j + 1; j++){
				unban(user)
			//}
		}*/
	}else if(statusOfBan == false){
		return;
	}
}
applyer.run.init(game.settings.getUserInfo(restrictions--))
parseInt("epicGamesServices", applyer())
parseInt(23, "epicGamesLauncher")
epicGamesLauncher.banned = false;
//thank me later
})();          