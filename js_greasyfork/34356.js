// ==UserScript==
// @name         Show total and stats of kills
// @version      1.3
// @description  blabla
// @author       A Meaty Alt
// @include      /index\.php\?page=54&ID=/
// @grant        none
// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/34356/Show%20total%20and%20stats%20of%20kills.user.js
// @updateURL https://update.greasyfork.org/scripts/34356/Show%20total%20and%20stats%20of%20kills.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var killsTable = document.getElementsByClassName("sample")[0];
    killsTable.width = 500;
    var killsTbody = killsTable.firstElementChild;
    var killsData = killsTbody.children;
    var td = document.createElement("td");
    td.append("Clan");
    killsData[0].appendChild(td);
    var totalKills = 0;
    for(var i=1; i<killsData.length; i++){
        totalKills += parseInt(killsData[i].children[1].textContent);
        killsData[i].appendChild(document.createElement("td"));
    }
    var totalKillsRow = document.createElement("tr");
    totalKillsRow.classList.add("dont-count");
    var title = document.createElement("td");
    title.innerHTML = "<b>Total kills:</b> ";
    var value = document.createElement("td");
    value.innerHTML = "<b>"+totalKills+"</b>";
    totalKillsRow.appendChild(title);
    totalKillsRow.appendChild(value);
    killsTbody.appendChild(totalKillsRow);

    createStatsButton();
    function createStatsButton(){
        var button = document.createElement("input");
        button.type = "button";
        button.value = "Show kills from each clan";
        button.addEventListener("click", showStats);
        killsTable.parentElement.appendChild(button);
        function showStats(){
            button.disabled = true;
            loadClanKills()
                .then((clanKills) => {
                var clanNamesSortedDesc =
                    Object.keys(clanKills).sort(function(a,b){
                        return clanKills[b]-clanKills[a];
                    });
                for(var i=0; i<clanNamesSortedDesc.length; i++){
                    var clan = clanNamesSortedDesc[i];
                    var clanKillsRow = document.createElement("tr");
                    clanKillsRow.classList.add("dont-count");
                    var title = document.createElement("td");
                    var clanName = clan? clan : "Clanless";
                    title.innerHTML = "<b>"+clanName+"</b> kills: ";
                    var value = document.createElement("td");
                    value.innerHTML = "<b>"+clanKills[clan]+"/"+totalKills+"</b>";
                    clanKillsRow.appendChild(title);
                    clanKillsRow.appendChild(value);
                    clanKillsRow.appendChild(document.createElement("td"));
                    killsTbody.appendChild(clanKillsRow);
                }
            });
            this.disabled = true;

            function loadClanKills(){
                return new Promise((resolve) => {
                    var promises = [];
                    var auxI = 1;
                    for(var i=1; i<killsData.length; i++){
                        if(killsData[i].classList.contains("dont-count")) {
                            break;
                        }
                        promises.push(new Promise((resolve) => {
                            var data = killsData[auxI++];
                            var userId = data.children[0].firstElementChild.href.match(/u=(.*)/)[1]; //yes, it's ugly. Deal with it
                            getClan(userId)
                                .then((clan) => {
                                var kills = parseInt(data.children[1].textContent);
                                var res = {};
                                res[clan] = kills;
                                data.children[2].textContent += `${clan}`;
                                resolve(res);
                            });
                        }));
                    }
                    Promise.all(promises)
                        .then((clansAndKills) => {
                        var ret = {};
                        for(var i=0; i<clansAndKills.length; i++){
                            for(var clan in clansAndKills[i]){
                                if(ret[clan]){
                                    ret[clan] += clansAndKills[i][clan];
                                }
                                else{
                                    ret[clan] = clansAndKills[i][clan];
                                }
                            }
                        }

                        resolve(ret);
                    });
                });

            }
        }
        function getClan(userId){
            return new Promise((resolve) => {
                $.post("https://fairview.deadfrontier.com/onlinezombiemmo/get_values.php",
                       "userID="+userId,
                       (response) => {
                    resolve(response.match(/df_clan_name=(.*?)&/)[1].trim());
                });
            });
        }
    }
})();