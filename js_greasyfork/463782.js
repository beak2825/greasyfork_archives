// ==UserScript==
// @name         EraFN Filters
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Filter the server list to your needs.
// @author       Christoffyw
// @match        https://status.erafn.org/
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erafn.org
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM_getValue
// @grant           GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/463782/EraFN%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/463782/EraFN%20Filters.meta.js
// ==/UserScript==

const default_config = {
    versions: ["3.5", "4.1", "4.5", "5.10", "5.41", "6.20", "6.31", "7.40", "10.40"],
    regions: ["EU", "NA", "OCE"],
    gamemodes: ["Solo", "Duos", "Squads", "50v50", "Blitz! (Solo)", "Blitz! (Duos)", "Blitz! (Squads)", "Solid Gold", "Creative"],
    status: ["Offline", "Online", "Match has started"]
}

let config = {
    versions: [],
    regions: [],
    gamemodes: [],
    status: []
}

// Return list of server elements based on class
function refresh_servers() {
    return document.getElementsByClassName("bg-gray-800");
}

// Extract server info from elements
function extract_data(server_element) {
    let nameElement = server_element.firstChild.children[1].firstChild;
    let detailsElement = server_element.firstChild.children[1].lastChild;
    let statusElement = server_element.firstChild.lastChild.lastChild;
    let details = detailsElement.innerHTML.split(" / ");

    let temp_server_object = {};
    temp_server_object.name = nameElement.innerHTML;
    temp_server_object.region = details[0];
    temp_server_object.gamemode = details[1];
    temp_server_object.version = details[2].replace("Fortnite ", "");
    temp_server_object.status = statusElement.innerHTML;
    return temp_server_object;
}

// Loop through each server entry and extract data
function update_data(servers, server_elements) {
    for(var i = 0; i < server_elements.length; i++) {
        servers[i] = extract_data(server_elements[i]);
    }
    filter(servers, server_elements);
}

// Filter out servers that don't meet the user's options
function filter(servers, server_elements) {
    let versions = document.getElementsByName("versions");
    for(var v = 0; v < versions.length; v++) {
        if(versions[v].checked) {
            if(!config.versions.includes(versions[v].value))
                config.versions.push(versions[v].value);
        } else {
            if(config.versions.includes(versions[v].value))
                config.versions.splice(config.versions.indexOf(versions[v].value), 1);
        }

    }
    let regions = document.getElementsByName("regions");
    for(var r = 0; r < regions.length; r++) {
        if(regions[r].checked) {
            if(!config.regions.includes(regions[r].value))
                config.regions.push(regions[r].value);
        } else {
            if(config.regions.includes(regions[r].value))
                config.regions.splice(config.regions.indexOf(regions[r].value), 1);
        }
    }
    let gamemodes = document.getElementsByName("gamemodes");
    for(var g = 0; g < gamemodes.length; g++) {
        if(gamemodes[g].checked) {
            if(!config.gamemodes.includes(gamemodes[g].value))
                config.gamemodes.push(gamemodes[g].value);
        } else {
            if(config.gamemodes.includes(gamemodes[g].value))
                config.gamemodes.splice(config.gamemodes.indexOf(gamemodes[g].value), 1);
        }

    }
    let status = document.getElementsByName("status");
    for(var s = 0; s < status.length; s++) {
        if(status[s].checked) {
            if(!config.status.includes(status[s].value))
                config.status.push(status[s].value);
        } else {
            if(config.status.includes(status[s].value))
                config.status.splice(config.status.indexOf(status[s].value), 1);
        }
    }

    GM.setValue("config", JSON.stringify(config));
    for(var i = 0; i < servers.length; i++) {
        let server = servers[i];
        var show = true;
        if(!config.versions.includes(server.version))
            show = false;
        if(!config.regions.includes(server.region))
            show = false;
        if(!config.gamemodes.includes(server.gamemode))
            show = false;
        if(!config.status.includes(server.status))
            show = false;

        if(show == false) {
            if(server_elements[i])
                server_elements[i].style.display = "none";
            //console.log(config.versions.includes(server.version) + ": " + server.version);
            //console.log(config.regions.includes(server.region) + ": " + server.region);
            //console.log(config.gamemodes.includes(server.gamemode) + ": " + server.gamemode);
            //console.log(config.status.includes(server.status) + ": " + server.status);
        } else
            if(server_elements[i])
                server_elements[i].style.display = "";
    }
}

// Run code on start
function start() {
    let server_elements = refresh_servers();
    let servers = [];
    update_data(servers, server_elements);

    let server_tabs = document.getElementsByClassName("first-letter:border-opacity-50");
    for(var y = 0; y < server_tabs.length; y++) {
        let server_tab = server_tabs[y];
        server_tab.addEventListener("click", () => {
            setTimeout(() => {
                server_elements = refresh_servers();
                update_data(servers, server_elements);
                filter(servers, server_elements);
            }, 1000);
        });
    }
    setInterval(function(){
        server_elements = refresh_servers();
        update_data(servers, server_elements);
        filter(servers, server_elements);
    }, 500);

    var newHTML         = document.createElement ('div');
    newHTML.innerHTML   = '             \
  <div id="versions" style="display:inline-block; vertical-align: top">             \
    <p>Versions</p>             \
    <input type="checkbox" name="versions" checked="true" value="3.5"> 3.5<br>             \
    <input type="checkbox" name="versions" checked="true" value="4.1"> 4.1<br>             \
    <input type="checkbox" name="versions" checked="true" value="4.5"> 4.5<br>             \
    <input type="checkbox" name="versions" checked="true" value="5.10"> 5.10<br>             \
    <input type="checkbox" name="versions" checked="true" value="5.41"> 5.41<br>             \
    <input type="checkbox" name="versions" checked="true" value="6.20"> 6.20<br>             \
    <input type="checkbox" name="versions" checked="true" value="6.31"> 6.31<br>             \
    <input type="checkbox" name="versions" checked="true" value="7.40"> 7.40<br>             \
    <input type="checkbox" name="versions" checked="true" value="10.40"> 10.40<br>             \
  </div>             \
  <div id="regions" style="display:inline-block; vertical-align: top">             \
    <p>Regions</p>             \
    <input type="checkbox" name="regions" checked="true"  value="EU"> EU<br>             \
    <input type="checkbox" name="regions" checked="true"  value="NA"> NA<br>           \
    <input type="checkbox" name="regions" checked="true"  value="OCE"> OCE<br>           \
  </div>             \
  <div id="gamemodes" style="display:inline-block; vertical-align: top">             \
    <p>Gamemodes</p>             \
    <input type="checkbox" name="gamemodes" checked="true" value="Solo"> Solo<br>             \
    <input type="checkbox" name="gamemodes" checked="true" value="Duos"> Duos<br>             \
    <input type="checkbox" name="gamemodes" checked="true" value="Squads"> Squads<br>             \
    <input type="checkbox" name="gamemodes" checked="true" value="50v50"> 50v50<br>             \
    <input type="checkbox" name="gamemodes" checked="true" value="Blitz! (Solo)"> Blitz! (Solo)<br>             \
    <input type="checkbox" name="gamemodes" checked="true" value="Blitz! (Duos)"> Blitz! (Duos)<br>             \
    <input type="checkbox" name="gamemodes" checked="true" value="Blitz! (Squads)"> Blitz! (Squads)<br>             \
    <input type="checkbox" name="gamemodes" checked="true" value="Solid Gold"> Solid Gold<br>             \
    <input type="checkbox" name="gamemodes" checked="true" value="Creative"> Creative<br>             \
  </div>             \
  <div id="status" style="display:inline-block; vertical-align: top">             \
    <p>Status</p>             \
    <input type="checkbox" name="status" checked="true" value="Offline"> Offline<br>             \
    <input type="checkbox" name="status" checked="true" value="Online"> Online<br>             \
    <input type="checkbox" name="status" checked="true" value="Match has started"> Match has started<br> \
  </div> \
    ';
    newHTML.className = "bg-gray-900 text-gray-200";
    newHTML.style = "position: absolute;left: 50%;margin-right: -50%;transform: translate(-50%, 0);padding: 25px";
    document.body.insertBefore(newHTML,document.body.firstChild);
    let root = document.getElementById("root");
    root.firstChild.style = `padding-top: ${newHTML.clientHeight}px`;
    let checkboxes = document.querySelectorAll('[type="checkbox"]');
    for(var c = 0; c < checkboxes.length; c++) {
        checkboxes[c].addEventListener("click", () => {
            console.log(config);
        });
    }

    let versions = document.getElementsByName("versions");
    for(var v = 0; v < versions.length; v++) {
        versions[v].checked = config.versions.includes(versions[v].value);
    }
    let regions = document.getElementsByName("regions");
    for(var r = 0; r < regions.length; r++) {
        regions[r].checked = config.regions.includes(regions[r].value);
    }
    let gamemodes = document.getElementsByName("gamemodes");
    for(var g = 0; g < gamemodes.length; g++) {
        gamemodes[g].checked = config.gamemodes.includes(gamemodes[g].value);
    }
    let status = document.getElementsByName("status");
    for(var s = 0; s < status.length; s++) {
        status[s].checked = config.status.includes(status[s].value);
    }
}

(async function() {
    'use strict';
    let GM_Config = await GM.getValue("config");
    config = GM_Config == undefined ? default_config : JSON.parse(GM_Config);
    console.log(config);


    setTimeout(() => {
        start();
    }, 1000);
})();
