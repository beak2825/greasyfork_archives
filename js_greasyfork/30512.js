/* This program is free software. It comes without any warranty, to 
 * the extent permitted by applicable law. You can redistribute it 
 * and/or modify it under the terms of the Do What The Fuck You Want 
 * To Public License, Version 2, as published by Sam Hocevar. See 
 * http://www.wtfpl.net/ for more details. */ 

// ==UserScript== 

// @name        Rückspielbutton 
// @namespace   fussball 
// @include     https://fussballcup.de/*
// @version    	0.1.2
// @description Zeigt "Rückspielbutton" auf der Startseite!
// @author 	Philipp, edited by mot33 / 2018
// @connect <value>
// @downloadURL https://update.greasyfork.org/scripts/30512/R%C3%BCckspielbutton.user.js
// @updateURL https://update.greasyfork.org/scripts/30512/R%C3%BCckspielbutton.meta.js
// ==/UserScript==   


// ############### CONFIGURATION ###############
// change URL for other icon for "Rueckspielbutton"
var icon_path = "https://abload.de/img/pfeil-nach-vorne_318-6xz3u.png";
var icon_config = "width='35px'";
// ######################################




/**
 *	e. g. Gracemonkey won't let us access custom script from webpage (e. g. as <a href=javascript:...) 
 *	use this scirpt to inject JS-Code directely in DOM-tree so you can access this code from web page 
 */
function injectJS(code, id){
	var scriptId = "custom_script_" + id;
	if(document.getElementById(scriptId)){
		// element allready added; ignore!
		return;
	}

	var script = document.createElement('script');
	script.id = "script_" + id;
	script.appendChild(document.createTextNode(code));
	(document.body || document.head || document.documentElement).appendChild(script);
}


injectJS(`
	var appName = "Rematch button"
	var cleanUpTry = 30;
	var timeoutClean = 150;


var timeout = 5000;

/**
* Simply creates async html request with url theURL; calls back callback with result string as first parameter
*
* Case of error; null is returned as result String
*/
function httpGetAsync(theUrl, callback){
	logInfo('send Http request: ' + theUrl);


	var xmlHttp = new XMLHttpRequest();

   	xmlHttp.onreadystatechange = function() { 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
			logInfo('http request returned: ' + xmlHttp.responseText);
			callback(xmlHttp.responseText);
		}
	}

    	xmlHttp.open('GET', theUrl, true); // true for asynchronous 
   	xmlHttp.send(null);

	// handle timeout
	window.setTimeout(function(){
		if (xmlHttp.readyState != 4 || xmlHttp.status != 200){
			// something went wrong
			// cancel
			xmlHttp.abort();
			// call callback with error
			callback(null);
		}
	}, timeout);
}
	
function httpRequestFootball(params, callback){
	httpGetAsync('/index.php?w=' + worldId + '&' + params, callback);
}																


/**
*	searches for http-parameter key in url
*	returns value; if not found: return null
*/
function extractFromURL(url, key){
	// split parameters
	var sp = url.split("&");
	for(var x=1; x<sp.length; x++){
		var item = sp[x].split("=");
		if(item[0] == "invite"){
			return item[1];
		}
	}
	return null;
}


/**
* 	lookup squad id (e. g. for scheduling "Simmulationsspiel" or "Freundschaftsspiel")
*	identifies user with clubId
*	calls callback with squadId as first parameter
*	if error occurs: return -1
*/
function findSquad(clubId, callback){
	httpRequestFootball("area=user&module=profile&action=show&clubId=" + clubId + "&path=index.php&layout=none", 
		function(resultString) {
			if(resultString == null){
				// seems like http request failed
				logError("http request to find squad id failed!");
				callback(-1);
				return;
			}

			// parse result
			var parser = document.createElement('html');
			parser.innerHTML = JSON.parse(resultString).content;
			try{
				var url = parser.getElementsByClassName('button button-container-friendly-invite-button')[0].children[0].href;
			}catch(e){
				callback(-1);
				logWarning("failed to find url containing squad id");
				logError(e);
				logError(e.stack);
				return;
			}
			
			// parse url
			var squad = extractFromURL(url, "invite");
			if(squad  == null){
				logWarning("url doesn't contain invite!");
				callback(-1);				
				return;
			}

			// finally call back with result
			callback(squad);			
		}
	);
}


/**
 * really simple log system
 */
function logError(msg){
	console.log("ERROR   ==> " + appName + ": " + msg);
}

function logWarning(msg){
}

function logInfo(msg){
}



	/**
	*	go back to startpage
	*/
	function cleanUp(count){
		if(document.getElementsByClassName('action-column last-column').length < 10){
			// page still not loaded => game not scheduled => try again later
			if(count > 0){
				window.setTimeout(function(){cleanUp(count-1)}, timeoutClean);
			}else{
				logWarning('could not clean up: could not reload start page');
			}
		}else{
			window.location.href = '#/index.php';

			// cleanup 2 => press simmbutton 
			window.setTimeout(function(){cleanUp2(cleanUpTry)}, timeoutClean);
		}
	}

	/**
	*	enter right menu
	*/
	function cleanUp2(count){
		var elems = document.getElementsByClassName('handle simulations ');
		if(elems.length  == 0){
			// page still not loaded => game not scheduled => try again later
			if(count > 0){
				window.setTimeout(function(){cleanUp2(count-1)}, timeoutClean);
			}else{
				logWarning('could not clean up: could not press button to view simmgames');
			}
		}else{
			changes();
			elems[0].click();
		}
	
	}

	/**
	*	gets squad id of playerId. schedules game with player
	*/
	function scheduleSimGame(playerId){
		findSquad(playerId, function(squadId){
			if(squadId == -1){
				logError('bug! squadId not found!');
				alert('bug! I am sorry :(');
			}else{
				// request game
				window.location.href = '#/index.php?area=user&module=simulation&action=index&leagues=1&squad=' + squadId + '&_=1470592297';
				// go to homepage
				window.setTimeout(function(){cleanUp(cleanUpTry)}, timeoutClean);
			}
		});
	}
`, 'schedule_ruckspiel');




/**
*	Main function!
*/
function changes(){
	var matchesBox = document.getElementsByClassName('matches simulations');
	if(matchesBox.length == 0){
		// oh, no matchesBox: probably user does not view start page => nothing to do
		return;
	}
	matchesBox = matchesBox[0].children;	// that's the real matchbox
	
	// iterate children
	for (var i = 0; i < matchesBox.length; i++) {
		var game = matchesBox[i].children[0];

		// validate box		
		try{
			var retFlag = false;

			// validate allready added
			for(var x=0; x<game.children.length; x++){
				if(game.children[x].className == "rematch_button"){
					retFlag = true;					
					break;
				}
			}
			if(retFlag){
				continue;
			}

			// validate anzeigen button visible
			if(game.children[3].children[0].children[0].children[0].children[0].innerHTML != "anzeigen"){
				continue;
			}

			// check if other user is on the left
			if(game.children[1].children[0].children[1].className != "self-link"){
				// other must be self-link => just check to be sure 
				if(game.children[1].children[2].children[1].className != "self-link"){
					logError("no other player found! (no class self-link)");
					continue;
				}

				var url = game.children[1].children[0].children[1].href;
			}else{
				// other must not be self-link => just check to be sure
				if(game.children[1].children[2].children[1].className == "self-link"){
					logError("no other player found! (two class self-link)");
					continue;
				}

				var url = game.children[1].children[2].children[1].href;
			}


		}catch(e){
			logError(e);
			logError(e.stack);
			continue;
		}

		// generate url of rematch url
		var playerId = "";
		try{
			var sp = url.split("&");
			playerId = -1;
			for(var x=1; x<sp.length; x++){
				var item = sp[x].split("=");
				if(item[0] == "clubId"){
					playerId = item[1];
					break;
				}
			}

			// validate result
			if(playerId == -1){
				logError("could not find id of player in url: " + readUrl);
				continue;
			}
		}catch(e){
			logError("something strange happened; cannot find id of player to schedule simmgame");
			logError(e);
			logError(e.stack);
			continue;
		}
	

		// add button
		var button = document.createElement("li");
		button.className = "rematch_button";
		button.innerHTML = "<a href=javascript:scheduleSimGame(" + playerId + ")> <img " + icon_config + " src='" + icon_path + "' /></a>";

		game.appendChild(button);	
	}
}

window.setTimeout(function() { changes() }, 2500);
window.setInterval(function() { changes() }, 5000);
