// ==UserScript==
// @name        Better RGL Player Profiles
// @namespace   Violentmonkey Scripts
// @match       https://rgl.gg/Public/PlayerProfile
// @include     https://rgl.gg/Public/PlayerProfile
// @grant       none
// @version     1.0.2
// @author      Jercer
// @description Adds division specific player profiles and Discord button
// @license     MIT
// @homepageURL  https://github.com/Jercer36/userscripts
// @downloadURL https://update.greasyfork.org/scripts/452207/Better%20RGL%20Player%20Profiles.user.js
// @updateURL https://update.greasyfork.org/scripts/452207/Better%20RGL%20Player%20Profiles.meta.js
// ==/UserScript==
(function(){
    window.addEventListener("load", function(){
        var divTeam = document.querySelector("#ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_divTeam");
        if (!divTeam) {
            divTeam = document.querySelector("#ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_divTeamNotRostered");
        }
        if (divTeam){
            var h = document.createElement("strong");
            h.innerText = "Player Profiles";
    
            var table = document.createElement("table");
            var tableStyle = {
                marginLeft: "auto",
                marginRight: "auto"
            };
            Object.assign(table.style, tableStyle);
    
            var tr = document.createElement("tr");
    
            var td1 = document.createElement("td");
            var td2 = document.createElement("td");
            var td3 = document.createElement("td");
            var td4 = document.createElement("td");
            var td5 = document.createElement("td");
            var td6 = document.createElement("td");
    
            var colStyle = {
                paddingTop: "0px",
                paddingBottom: "0px",
                paddingLeft: "10px",
                paddingRight: "10px"
            };
    
            Object.assign(td1.style, colStyle);
            Object.assign(td2.style, colStyle);
            Object.assign(td3.style, colStyle);
            Object.assign(td4.style, colStyle);
            Object.assign(td5.style, colStyle);
            Object.assign(td6.style, colStyle);
    
            var profilesUrl = "https://rgl.gg/Public/PlayerProfile?p=" + document.querySelector("#ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_hlSteamProfile").getAttribute("href").slice(35) + "&r=";
    
            var sixes = document.createElement("a");
            sixes.setAttribute("href", profilesUrl + "40");
            sixes.innerText = "6s";
    
            var hl = document.createElement("a");
            hl.setAttribute("href", profilesUrl + "24");
            hl.innerText = "Highlander";
    
            var pl = document.createElement("a");
            pl.setAttribute("href", profilesUrl + "1");
            pl.innerText = "Prolander";
    
            var exp6s = document.createElement("a");
            exp6s.setAttribute("href", profilesUrl + "40");
            exp6s.innerText = "Exp 6s Cup";
    
            var expHL = document.createElement("a");
            expHL.setAttribute("href", profilesUrl + "35");
            expHL.innerText = "Exp HL Cup";
    
            var plCup = document.createElement("a");
            plCup.setAttribute("href", profilesUrl + "9");
            plCup.innerText = "PL Cup";
    
            table.append(tr);
            tr.append(td1);
            tr.append(td2);
            tr.append(td3);
            tr.append(td4);
            tr.append(td5);
            tr.append(td6);
            td1.append(sixes);
            td2.append(hl);
            td3.append(pl);
            td4.append(exp6s);
            td5.append(expHL);
            td6.append(plCup);
    
            divTeam.prepend(document.createElement("br"));
            divTeam.prepend(table);
            divTeam.prepend(document.createElement("br"));
            divTeam.prepend(h);
        }
    
        var divDiscord = document.querySelector("#ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_divDiscord");
        if(divDiscord) {
            var newDisDiv = document.createElement("div");
            newDisDiv.setAttribute("class", "input-group-button");
            var discordID = document.querySelector("#ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_txtDiscordUsername").getAttribute("data-discord-id");
            if(discordID != "Log in to view ID") {
                if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
                    var discordURL = "https://discord.com/users/" + discordID;
                }
                else {
                    var discordURL = "discord://discord.com/users/" + discordID;
                }
    
                var discordButton = document.createElement("a");
                discordButton.setAttribute("href", discordURL);
                discordButton.setAttribute("class", "btn btn-sm btn-info");
                discordButton.innerText = "Open Discord Profile";
    
                newDisDiv.append(discordButton);
                divDiscord.append(document.createElement("br"));
                divDiscord.append(newDisDiv);
            }
        }
    }, false);
})();
