// ==UserScript==
// @name         Roblox Empty Server Finder
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Finds an empty server for you to join.
// @author       Skorpion
// @match        https://www.roblox.com/games/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423843/Roblox%20Empty%20Server%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/423843/Roblox%20Empty%20Server%20Finder.meta.js
// ==/UserScript==

(function() {
    // Gets the game ID
    const gid = Number(window.location.pathname.split('/')[2]);
    if(!gid) return;
    // Gets the game URL
    const url = `https://www.roblox.com/games/${gid}`;

    const searchForGame = function(gid, min, max) {
        // Get the game page
        var page = Math.round((max + min) / 2);
        // Fetch roblox's servers
        fetch(`https://www.roblox.com/games/getgameinstancesjson?placeId=${gid}&startindex=${page}`)
        // Turn the response into JSON
            .then((resp) => resp.json())
            .then(function(data) {
            if (data.Collection.length < 10 && data.Collection.length > 0) {
                var server = data.Collection[data.Collection.length - 1];
                console.log('Found empty server:', server, '\nCurrent Total Players:', server.CurrentPlayers.length);
                if(confirm("Found server with " + server.CurrentPlayers.length + " players.\nWould you like to join this server?")) {
                    try {
                        eval(server.JoinScript);
                    } catch(e) {
                        console.log('Error:', e);
                    };
                } else {
                    min = page;
                    console.log('User canceled, trying new server:', page);
                    searchForGame(gid, min, max);
                    return false;
                };
                return true;
            } else if (data.Collection.length == 0) {
                max = page;
                console.log('Page empty, trying new page:', page);
                searchForGame(gid, min, max);
            } else {
                min = page;
                console.log('Not empty, trying new server:', page);
                searchForGame(gid, min, max);
            }
        })
    }

    let h3ader = document.createElement("h3")
    h3ader.innerHTML = "Skorpion Finder"

    let btn = document.createElement("span");
    btn.id = "-Skorpion-findServer"
    btn.onclick = function() {searchForGame(gid, 0, 10000);};
    btn.innerHTML = "Join Empty Server"
    btn.className = "btn-secondary-md"

    document.getElementById("game-instances").prepend(btn)
    document.getElementById("game-instances").prepend(h3ader)
})();