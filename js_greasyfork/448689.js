// ==UserScript==
// @name        trackingthepros.com display played champions
// @namespace   Violentmonkey Scripts
// @match       https://www.trackingthepros.com/players/*
// @grant       GM.xmlHttpRequest
// @version     1.5
// @author      Gl4zy
// @license MIT
// @description 30.7.2022, 13:15:08
// @downloadURL https://update.greasyfork.org/scripts/448689/trackingtheproscom%20display%20played%20champions.user.js
// @updateURL https://update.greasyfork.org/scripts/448689/trackingtheproscom%20display%20played%20champions.meta.js
// ==/UserScript==
const apiKey = "INPUT YOUR RIOT API KEY HERE"; //like const apiKey = "RGAPI-b5ee53ab-1358-4d62-9562-def61df04f6a";
var latestDdragonVersion;
var championIdToChampionName;
const serverToUrl = {
    "KR": "kr",
    "EUW": "euw1",
    "NA": "na1",
    "BR": "br1"
}
var button;
var loading = false;

async function getSummonerIdByName(summonerName, server) {
    const responseJson = await myfetch('https://' + server + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName);
    if (responseJson == null) {
        return null;
    }
    return responseJson.id;
}
async function getPlayedChampionIdFromSummonerId(summonerId, server) {
    const responseJson = await myfetch('https://' + server + '.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/' + summonerId);
    if (responseJson == null) {
        return null;
    }
    if(responseJson.participants){
        const championId = responseJson.participants.filter(s => s.summonerId == summonerId)[0].championId;
        return championId;
    }
    return null;
}
async function getAccountsFromProName(proName) {
    return new Promise(function(resolve, reject) {
        var ifream = document.createElement("iframe");
        //ifream.src = "https://www.trackingthepros.com/player/" + proName;
        ifream.src = $("a:contains('" + proName + "')")[0].href;
        ifream.onload = function() {
            var accounts = [];
            $("iframe").contents().find("h4:contains('Accounts')").parent().children().children().find("tr").each(function(index, element) {
                var account = [];
                $(element).find('td').each(function(index, element) {
                    var match = /\[(.*)] (.*)/gm.exec($(element).text());
                    if (match != null) {
                        account.push(match[1]);
                        account.push(match[2]);
                    }
                });
                if (account.length != 0) {
                    accounts.push(account);
                }
            });
            resolve(accounts);
            ifream.parentNode.removeChild(ifream);
        }
        document.body.appendChild(ifream);
    });
}
//returns null if not ingame and champ if it is
async function checkIfAccountIsPlaying(summonerName, server) {
    const playerId = await getSummonerIdByName(summonerName, server);
    if (playerId == null) return null;
    const championId = await getPlayedChampionIdFromSummonerId(playerId, server);
    if (championId == null) return null;
    return Object.values(championIdToChampionName.data).filter(c => c.key == championId);
}
async function addChampionImageToTable(summonerName, server, proName) {
    var result = await checkIfAccountIsPlaying(summonerName, server);
    if (result != null) {
        var img = document.createElement('img');
        img.style.height = "23px";
        img.style.marginLeft = "5px";
        img.src = 'http://ddragon.leagueoflegends.com/cdn/12.14.1/img/champion/' + result[0].id + '.png';
        $("a:contains('" + proName + "')").append(img);
    }
}

async function main() {
    if (loading) return;
    loading = true;
    button.classList = "btn-danger btn";
    button.innerHTML = "Loading...";

    latestDdragonVersion = (await myfetch('https://ddragon.leagueoflegends.com/api/versions.json'))[0];
    championIdToChampionName = await myfetch('https://ddragon.leagueoflegends.com/cdn/' + latestDdragonVersion + '/data/en_US/champion.json');

    var pros = [];
    $('#displayTable').find("tr").each(function(index, element) {
        pros.push($(element).find('td').eq(0).text().slice(6))
    })

    var accounts = [];
    for (var p in pros) {
        accounts = await getAccountsFromProName(pros[p]);
        console.log(pros[p] + " Is playing on: ", accounts);
        for (var a in accounts) {
            console.log("cheking " + accounts[a][1], serverToUrl[accounts[a][0]]);
            addChampionImageToTable(accounts[a][1], serverToUrl[accounts[a][0]], pros[p]);
        }
    }

    loading = false;
    button.classList = "btn-info btn";
    button.innerHTML = "Look for Champions";
}
async function myfetch(link){
    var out;
    await GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        overrideMimeType: "application/json",
        url: link,
        headers: {
            "X-Riot-Token": apiKey,
            "Content-Type": "application/json",
        },
        onload: function(response) {
            if (response.status != 200) {
                out = null;
            }
            //console.log(link, response.responseText);
            out = JSON.parse(response.responseText);
        }
    });
    return out;
}
$(document).ready(function() {
    button = document.createElement('button');
    button.innerHTML = "Look for Champions";
    button.onclick = main;
    button.classList = "btn-info btn";
    document.getElementsByClassName('dataTables_wrapper form-inline dt-bootstrap no-footer')[0].prepend(button);
});



