// ==UserScript==
// @name         Steam Detailed OnlineState
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  little script to make the onlinestate reflect a more acurate state.  
// @author       Nioxed, Delite
// @match        *://steamcommunity.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26652/Steam%20Detailed%20OnlineState.user.js
// @updateURL https://update.greasyfork.org/scripts/26652/Steam%20Detailed%20OnlineState.meta.js
// ==/UserScript==

//

(function() {
    
    document.getElementsByClassName("profile_in_game_header")[0].innerHTML = "...";
    
    //window.addEventListener('load', function() {
        
        steamid = g_rgProfileData.steamid;
        personastate = -1;
        var request = new XMLHttpRequest();
        
        request.open('GET', "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=A3D56ADD53D082B445ED466C6440D452&steamids=" + steamid, true);

        request.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 400) {
                    // Success!
                    var data = JSON.parse(this.responseText);
                    personastate = data.response.players[0].personastate;
                    console.log(personastate);
                    
                            switch(personastate){
                
                                    
                                    
                                case 0:
                                    document.getElementsByClassName("profile_in_game_header")[0].innerHTML = "Currently Offline";
                                    break;   
                                    
                                case 1:
                                    document.getElementsByClassName("profile_in_game_header")[0].innerHTML = "Currently Online";
                                    break;    
                                case 2:
                                    document.getElementsByClassName("profile_in_game_header")[0].innerHTML = "Currently Busy";
                                    break;

                                case 3:
                                    document.getElementsByClassName("profile_in_game_header")[0].innerHTML = "Currently Away";
                                    break;
                                    
                                case 4:
                                    document.getElementsByClassName("profile_in_game_header")[0].innerHTML = "Snooze";
                                    break;
                                    
                                case 5:
                                    document.getElementsByClassName("profile_in_game_header")[0].innerHTML = "Looking to trade";
                                    break;
                                    
                                case 6:
                                    document.getElementsByClassName("profile_in_game_header")[0].innerHTML = "Looking to play";
                                    break;
                            }
                    
                } else {
                    console.error('Could not get personadata :(');
                }
            }
        };

        request.send();
        request = null;
   // }, false);
})();