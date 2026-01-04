// ==UserScript==
// @name         Check_Nintendo_in_Steam
// @namespace    NintendoSteam
// @version      0.1
// @description  Check if nintendo game exists in Steam ?
// @author       Nuok
// @match        https://www.nintendo.com/games/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/420299/Check_Nintendo_in_Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/420299/Check_Nintendo_in_Steam.meta.js
// ==/UserScript==

(function() {
    'use strict'

    window.addEventListener('load', () => {
        refreshGameList();
    });

    window.addEventListener('click', () => {
        refreshGameList();
    });

    var game_list = [];
    function loadGameList() {
        if(game_list.length == 0) {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json",
                onload: function(response) {
                    var temp = JSON.parse(response.responseText);
                    var temp_game_list = temp["applist"]["apps"];
                    for(var i = 0;i < temp_game_list.length; i++)
                    {
                        var game_name = temp_game_list[i]["name"];
                        game_list.push(game_name);
                    }
                }
            });
        }
    }

    function refreshGameList() {
        loadGameList();
        console.log(game_list.length);
        var h3_array = document.getElementsByTagName('h3');

        for (var i = 0; i < h3_array.length; i++) {
            var slot = String(h3_array[i].slot);
            if(slot.includes("title")){
                var search_term = h3_array[i].innerHTML;
                if(game_list.includes(search_term))
                {
                    h3_array[i].style = "color:green";
                }
            }
        }
    }


}());