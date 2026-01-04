// ==UserScript==
// @name         Server List v2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Splix Server List has been updated with a server selector and now allows a single player to join a team server.
// @author       The Retired Splixer
// @match        https://splix.io/*
// @license GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456033/Server%20List%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/456033/Server%20List%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selNotCreated = ()=>{ return (document.forms[0].childElementCount == 8) };
    function sortServers() {
        window.servers.sort((a,b) => {
            if ( a.loc < b.loc ) return -1;
            if ( a.loc > b.loc ) return 1;
            return 0;
        });
    }
    function renderServerList(gameMode, flag, selectedValue) {
        let mode;
        (gameMode == 'Normal') ? (mode = servers[0].gamemodes[0].gm.startsWith('d') ? 0 : 1) : (mode = servers[0].gamemodes[0].gm.startsWith('t') ? 0 : 1);
        let selectedServerInnerHtml='<option value="" hidden disabled selected>'+(gameMode.startsWith("N")?('Select a server&ensp;(Current: auto)</option><option value="">auto') : 'Possible Servers: ') + '</option>';
        window.servers.forEach((srv,indx)=>{
            let serverDown = false;
            if(typeof(srv.gamemodes[mode].versions[0].lobbies[0]) == 'undefined') serverDown = true;

            if(serverDown) { selectedServerInnerHtml += '<option value="undefined"'+(window.selectedGamemode.startsWith("N")?"":" disabled")+'word-spacing: 30px;>'+'~DOWN~'+'&emsp;('+srv.loc+')</option>';}
            else {selectedServerInnerHtml += '<option value="'+ srv.gamemodes[mode].versions[0].lobbies[0].hash + '"'+(window.selectedGamemode.startsWith("N")?"":" disabled")+'word-spacing: 30px;>'+srv.gamemodes[mode].versions[0].lobbies[0].hash+'&emsp;('+srv.loc+')</option>'; }

            if(indx+1 == window.servers.length){
                window.serverSel.innerHTML=selectedServerInnerHtml;
                if(flag&&[...window.serverSel.options].some(e=>e.value==window.location.hash.slice(1)))window.serverSel.value=window.location.hash.slice(1);
                if(selectedValue == 0) window.serverSel.selectedIndex = 0;
            }
        });
    }
    function createServerSelect(gameMode, flag, selectedValue) {
        setTimeout(()=>{document.getElementById('joinButton').disabled = false;},1000);
        if(selNotCreated()) {
            window.serverSel = document.createElement("SELECT");
            Object.assign(window.serverSel.style, {
                width: '226px',
                background: 'url(/img/arrowD.svg) right center no-repeat #3bad48',
                color: '#fff',
                backgroundSize: '30px',
                fontSize: '14px'
            });
            window.serverSel.onchange = function(){
                if(window.serverSel.value == "") {
                    window.history.replaceState(null,null,' ');
                }else{ window.location.hash = window.serverSel.value; }
            };
            window.serverSel.className="fancyBox inputFancy";
            document.getElementById('joinButton').insertAdjacentElement("afterend", window.serverSel);
            document.getElementById('joinButton').insertAdjacentElement("afterend", document.createElement("BR"));
            sortServers();
            renderServerList(gameMode, flag, selectedValue);
        }
        else {
            while(serverSel.options.length > 0){ serverSel.remove(0); }
            renderServerList(gameMode, flag, selectedValue);
        }
    }
    const selUpd = ()=>{
        if(window.serverSel == null) return;
        var selectedValue = window.serverSel.selectedIndex;
        window.serverSel.outerHTML="";
        setTimeout(async ()=>{
        while(!serversRequestDone) await new window.Promise(r => window.setTimeout(r,1));
        createServerSelect(window.selectedGamemode, true, selectedValue);
        },100);
    };
    /* Server List print in console(Old-code)  */
    var locCountries = {
		"nyc": "USA",
		"sfo": "USA",
		"tor": "Canada",
		"ams": "Netherlands",
		"fra": "Germany",
		"sgp": "Singapore",
		"blr": "India"
	}

    function printServerList(DATA) {
		console.log("%c" + "Location".padEnd(20, " ") + "%c" + "Normal".padEnd(10, " ") + "%c" + "Team".padEnd(10, " "),
			"color:black; font-weight: bold; background: #FFFFFF; font-size: 130%; font-weight: bold;",
			"color: #0086BF;background: #FFFFFF; font-size: 130%; font-weight: bold;",
			"color: #B152B1;background: #FFFFFF;font-size: 130%; font-weight: bold;");
        for (var l = 0; l < DATA.locations.length; l++) {
			var singleServerName = "Unknown";
			var teamServerName = "Unknown";
			if (DATA.locations[l].loc in locCountries) {
				let locString = DATA.locations[l].loc + " (" + locCountries[DATA.locations[l].loc] + ")";
			}
			else {
				let locString = DATA.locations[l].loc + "";
			}
			locString = locString.padEnd(20, " ");
			try {
				for (var gm = 0; gm < DATA.locations[l].gamemodes.length; gm++) {
					for (var ver = 0; ver < DATA.locations[l].gamemodes[gm].versions.length; ver++) {
						for (var lob = 0; lob < DATA.locations[l].gamemodes[gm].versions[ver].lobbies.length; lob++) {
							if (DATA.locations[l].gamemodes[gm].gm == "default") {
								singleServerName = DATA.locations[l].gamemodes[gm].versions[ver].lobbies[lob].hash;
							}
							else {
								teamServerName = DATA.locations[l].gamemodes[gm].versions[ver].lobbies[lob].hash;
							}
						}
					}
				}
				console.log("%c" + locString + "%c" + singleServerName.padEnd(10, " ") + "%c" + teamServerName.padEnd(10, " "),
					"color:black; font-weight: bold; background: #FFFFFF; font-size: 130%;",
					"color: #0086BF;background: #FFFFFF; font-size: 130%;",
					"color: #B152B1;background: #FFFFFF;font-size: 130%;");
			}
			catch (err) {
				console.log("%c" + locString+ "%c" + "Error",
					"color:black; font-weight: bold; background: #FFFFFF; font-size: 130%;",
					"color: #FF4F4F;background: #FFFFFF;font-size: 130%;");
			}
    	}
	}

	function parse(obj) {
		var DATA = JSON.parse(obj);
		printServerList(DATA);
	}
	var request = new XMLHttpRequest();
	request.open('GET', '/json/servers.2.json');
	request.onloadend = function() {
		parse(request.responseText);
	}
	request.send();

    (async ()=>{
        while(!serversRequestDone) await new window.Promise(r=>window.setTimeout(r,1));
        createServerSelect(window.selectedGamemode, false, 0);
    })();
    window.addEventListener("hashchange", function() {
        if(window.serverSel!=null && window.selectedGamemode.startsWith("N") && "#"+window.serverSel.value != window.location.hash) selUpd();
    },false);
    document.querySelector('#gamemodeSelect').addEventListener("change", (e) => createServerSelect(e.target.value, false, 0));
    // Your code here...
})();