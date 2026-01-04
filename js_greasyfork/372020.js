// ==UserScript==
// @name         C&C:Online (Near) Full room notifier
// @name:zh-CN   C&C:Online 新官网房间满人提示器
// @namespace    https://github.com/lanyizi/C-C-Online-Website-hooks/
// @version      0.1060001
// @description  A script for those game hosts who are AFK. It will play sound when the game is full or nearly full. It works by hooking some CNCOnline serverinfo.js functions.
// @description:zh-CN 那些建房之后就把游戏切出去的人可以试试这个脚本，这个脚本将会在房间即将满人的时候播放声音。该该脚本通过挂钩 CNCOnline 网站的 serverinfo.js 函数来获得房间信息。
// @author       [RA3Bar]Lanyi
// @match        https://cnc-online.net/*
// @grant        none
// @run-at       document-end
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/372020/CC%3AOnline%20%28Near%29%20Full%20room%20notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/372020/CC%3AOnline%20%28Near%29%20Full%20room%20notifier.meta.js
// ==/UserScript==

function main() {

    window.anyNewStagingGames = function(newStaging) {
        let oldGames = window.oldStagingGames;
        let newGames = newStaging
            .filter(function(game) { return !game.map.startsWith("Co-Op "); })
            .map(function(game) { return game.host.id + game.title; });
        window.oldStagingGames = newGames;
        
        if(!oldGames) {
            return false;
        }
        
        for(let i = 0; i < newGames.length; ++i) {
            if(oldGames.indexOf(newGames[i]) == -1) {
                return true;
            }
        }
        
        return false;
    };
    
    window.playersChanged = function(host, newPlayers, isFull) {
        let newHost = host.nickanme;
        let oldHost = window.previousHost;
        let wasFull = window.previousWasFull;
        window.previousHost = newHost;
        window.previousWasFull = isFull;
        
        let oldPlayers = window.previousPlayers;
        let mapped = newPlayers.map(function(player) { return player.nickname; });
        window.previousPlayers = mapped;
        
        if(oldHost != newHost) {
            // reset to prevent false positives when joining new rooms in the future
            window.previousWasFull = true;
            return false;
        }
        if(oldPlayers === undefined) {
            return false;
        }
        if(oldPlayers.length != mapped.length) {
            console.log("players changed: length previous: " + oldPlayers.length + "; length now: " + mapped.length);
            return true;
        }
        for(let i = 0; i < mapped.length; ++i)
        {
            if(oldPlayers[i] != mapped[i]) {
                console.log("player changed: was" + oldPlayers[i] + "; now: " + mapped[i]);
                return true;
            }
        }
        if(!wasFull && isFull) {
            console.log("Full status changed from false to true");
            return true;
	}
        return false;
    };
    
    window.myPrefix = "RA3Bar_Lanyi_CNCOLWebsiteNotifier_";
    window.playerNameField = "PlayerNameField_";
    window.monitorStagingGameId = window.myPrefix + "monitorStagingGame";

    for (let i = 0; i < gamenames.length; ++i)  {
        window[myPrefix + playerNameField + gamenames[i]] = null;
    }

    //from: http://s1download-universal-soundbank.com/wav/2838.wav
    window[myPrefix + "sound"] = new Audio("https://raw.githubusercontent.com/BSG-75/C-C-Online-Website-hooks/master/2838%5B2%5D.wav");
    function notifyPlayer() {
        window[myPrefix + "sound"].play();
    }

    //https://stackoverflow.com/questions/5499078/fastest-method-to-escape-html-tags-as-html-entities
    function escapeHTMLTags(str) {
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    //onfocus
    window[myPrefix + "onMyFieldFocus"] = function(field) {
        let myFieldID = field.id;
        if(!window[myFieldID] || window[myFieldID].length == 0) {
            field.innerText = "";
        }
    };

    //oninput
    window[myPrefix + "onMyFieldInput"] = function(field) {
        let myFieldID = field.id;
        window[myFieldID] = field.innerText.trim();
    };

    let originalSetUserBarInfo = setUserbarInfo;
    let originalGetUserSection = getUserSection;
    let originalHandleJSON = handleJSON;
    setUserbarInfo = function($parent, response) {
        let result = originalSetUserBarInfo($parent, response);
        $parent.append("← Click game name to monitor your room!");
    };
    getUserSection = function(response, gamename) {
        let myFieldID = myPrefix + playerNameField + gamename;
        let myFieldStyle = "background: #A00060; margin-left: 1em; padding-left: 0.5em; padding-right: 0.5em;"
        let myFieldDefaultValue = "<Type your nickname here~>";
        let myFieldValue = myFieldDefaultValue;
        if(window[myFieldID] && window[myFieldID].length > 0) {
            myFieldValue = window[myFieldID];
        }

        let attributes = "contenteditable = \"true\" id = \"" + myFieldID + "\" style = \"" + myFieldStyle + "\"";
        attributes += " onfocus = \"" + myPrefix + "onMyFieldFocus(this);" + "\" ";
        attributes += " oninput = \"" + myPrefix + "onMyFieldInput(this);" + "\" ";
        let myField = "<span " + attributes + ">" + escapeHTMLTags(myFieldValue) + "</span>";

        let result = originalGetUserSection(response, gamename);
        result.find("h3").append(myField);

        return result;
    };
    handleJSON = function(response, textStatus, jqXHR)  {
        let result = originalHandleJSON(response, textStatus, jqXHR);
        for (let i = 0; i < gamenames.length; ++i)  {
            let gamename = gamenames[i];
            let nickname = window[myPrefix + playerNameField + gamename];
            let games = response[gamename].games.staging;
            
            if(nickname) {
                for(let userNickname in response[gamename].users) {
                    if(userNickname.toUpperCase() == nickname.toUpperCase()) {
                        let inRoom = false;
                        function roomChecker(game) {
                            function nameChecker(x) {
                                return x.nickname.toUpperCase() == userNickname.toUpperCase();
                            }
                            if(game.players.some(nameChecker)) {
                                inRoom = true;
			    }
                        };
                        response[gamename].games.staging.forEach(roomChecker);
                        response[gamename].games.playing.forEach(roomChecker);
                        if(!inRoom) {
                            if(window.anyNewStagingGames(games)) {
                                notifyPlayer();
                            }
                        }
                    }
                }
            }
            
            $.each(games, function(i, game) {
                //if ( parseInt(game.numRealPlayers)+parseInt(game.numObservers) == parseInt(game.maxRealPlayers) ) {
                //    $gameItem.addClass('full');
                //}
                if (game.players != 'error') {
                    $.each(game.players, function(j, player) {
                        if(nickname && player.nickname) {
                            if(player.nickname.toUpperCase() == nickname.toUpperCase()) {
                                
                                let realPlayers = parseInt(game.numRealPlayers);
                                let observers = parseInt(game.numObservers);
                                let maxPlayers = parseInt(game.maxRealPlayers);
                                let isFull = (realPlayers + observers) >= maxPlayers;
                                if(realPlayers + observers >= maxPlayers * 0.5) {
                                    if(window.playersChanged(game.host, game.players, isFull)) {
                                        notifyPlayer();
                                    }
                                }
                            }
                        }
                    });
                }
            });
        }
        return result;
    };
    
    setInterval(getJSONInfo, 3000);
    function getJSONInfo() {
		$.ajax({
			url: json_url + "?callback=?",
			dataType: 'jsonp',
			data: { 'site': site },
			timeout: ajax_timeout,
			success: handleJSON,
			error: handleJSONError,
		});
	}
}

(function() {
    'use strict';
    // Your code here...
    let mainScript = document.createElement("script");
    mainScript.textContent = main.toString() + "\nmain();";
    document.body.appendChild(mainScript);
})();
