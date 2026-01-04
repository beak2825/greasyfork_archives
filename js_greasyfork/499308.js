// ==UserScript==
// @name         GeoGuessr Profile+
// @namespace    https://greasyfork.org/en/users/1323365
// @version      1.1.3
// @description  Displays extra data on your profile page.
// @author       Funnier04
// @match        *://*.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499308/GeoGuessr%20Profile%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/499308/GeoGuessr%20Profile%2B.meta.js
// ==/UserScript==
/* jshint esversion: 10 */

var tempUrl = window.location.href;
var previousUrl = tempUrl;
var rank = null;
var profileData = null;
var userID = null;
var type = null;
var languageList = ["en","de","es","fr","it","nl","pt","sv","tr","ja","pl"];
var translations = [
["km","km","km","km","km","km","km","km","km","km","km"],
["miles","miles","miles","miles","miles","miles","miles","miles","miles","miles","miles"],
["World Rank","Weltrang","Categoría Mundial","World Rank","World Rank","World Rank","World Rank","World Rank","World Rank","World Rank","World Rank"],
["Rounds Played","Rounds Played","Rounds Played","Rounds Played","Rounds Played","Rounds Played","Rounds Played","Rounds Played","Rounds Played","Rounds Played","Rounds Played"],
["Moving Duels Avg. Distance","Moving Duels Avg. Distance","Moving Duels Avg. Distance","Moving Duels Avg. Distance","Moving Duels Avg. Distance","Moving Duels Avg. Distance","Moving Duels Avg. Distance","Moving Duels Avg. Distance","Moving Duels Avg. Distance","Moving Duels Avg. Distance","Moving Duels Avg. Distance"],
["No Move Duels Avg. Distance","No Move Duels Avg. Distance","No Move Duels Avg. Distance","No Move Duels Avg. Distance","No Move Duels Avg. Distance","No Move Duels Avg. Distance","No Move Duels Avg. Distance","No Move Duels Avg. Distance","No Move Duels Avg. Distance","No Move Duels Avg. Distance","No Move Duels Avg. Distance"],
["NMPZ Duels Avg. Distance","NMPZ Duels Avg. Distance","NMPZ Duels Avg. Distance","NMPZ Duels Avg. Distance","NMPZ Duels Avg. Distance","NMPZ Duels Avg. Distance","NMPZ Duels Avg. Distance","NMPZ Duels Avg. Distance","NMPZ Duels Avg. Distance","NMPZ Duels Avg. Distance","NMPZ Duels Avg. Distance"],
["Duels Rounds Played","Duels Rounds Played","Duels Rounds Played","Duels Rounds Played","Duels Rounds Played","Duels Rounds Played","Duels Rounds Played","Duels Rounds Played","Duels Rounds Played","Duels Rounds Played","Duels Rounds Played"],
["Country Game Rounds Played","Country Game Rounds Played","Country Game Rounds Played","Country Game Rounds Played","Country Game Rounds Played","Country Game Rounds Played","Country Game Rounds Played","Country Game Rounds Played","Country Game Rounds Played","国別ゲーム Rounds Played","Country Game Rounds Played"],
["Distance Game Rounds Played","Distance Game Rounds Played","Distance Game Rounds Played","Distance Game Rounds Played","Distance Game Rounds Played","Distance Game Rounds Played","Distance Game Rounds Played","Distance Game Rounds Played","Distance Game Rounds Played","距離ゲーム Rounds Played","Distance Game Rounds Played"],
["Recent Duel Data","Recent Duel Data","Recent Duel Data","Recent Duel Data","Recent Duel Data","Recent Duel Data","Recent Duel Data","Recent Duel Data","Recent Duel Data","Recent Duel Data","Recent Duel Data"],
["Move","Move","Move","Move","Move","Move","Move","Move","Move","Move","Move"],
["No move","No move","No move","No move","No move","No move","No move","No move","No move","No move","No move"],
["NMPZ","NMPZ","NMPZ","NMPZ","NMPZ","NMPZ","NMPZ","NMPZ","NMPZ","NMPZ","NMPZ"]];
var language = 0;
var distanceConversion = 1;
var teamDuelsOffset = 0;
var gameData = [];
var dataToSave = [];
var accountJson = null;
var newUrl = null;
var mapData = "-";
var guessData = null;
var countryArrayPos = [2,3,4,5,6,8,9,10,11,12,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,34,35,36,39,40,42,43,44,45,46,47,48,49,51,52,53,56,57,58,59,60,62,63,64,65,66,67,68,71,70,73,74,75,76,77,78,79,81,82,83,84,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,104,105,106,108,109,110,111,112,113,114,116,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,152,153,154,155,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,176,177,178,179,180,7,69,115,1,117,33,72,38,0,61,80,86,54,156,85,151,37,50,107,13,41,55,103,175];
var lastMode = 0;
let i = 0;
let j = 0;
let found = false;

const observer = new MutationObserver(() => {
    const newUrl = window.location.href;
    if (newUrl !== tempUrl) {
        checkForData(newUrl);
    }
});

observer.observe(document.querySelector("#__next"), { subtree: true, childList: true });

async function checkForData(passedUrl){
    if (passedUrl != ""){
        previousUrl = tempUrl;
        tempUrl = passedUrl;
    }
    let accountFetch = await fetch("https://www.geoguessr.com/api/v3/profiles/");
    accountJson = await accountFetch.json();
    //await GM.setValue("waitingDuel", "https://www.geoguessr.com/duels/25374f26-7d2a-4eee-be70-0b2c868d7733/summary");
    let tempData = await GM.getValue("waitingDuel", "");
    if (tempData != ""){
        getDuelData(tempData);
    }
    else{
        apiFetch(tempUrl, previousUrl);
    }
    function getDuelData(duelUrl) {
        GM_xmlhttpRequest({
            method: "GET",
            url: duelUrl,
            onload: function(response) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(response.responseText, "text/html");
                let scriptTag = doc.querySelector("#__NEXT_DATA__");
                let jsonData = JSON.parse(scriptTag.textContent);
                let gameData = [0];
                let end = false;
                for (const team of jsonData.props.pageProps.game.teams) {
                    for (const player of team.players) {
                        if (player.playerId == accountJson.user.id){
                            for (const guess of player.guesses) {
                                gameData.push(guess.score);
                            }
                            end = true;
                            break;
                        }
                    }
                    if (end == true){
                        break;
                    }
                }
                for (const round of jsonData.props.pageProps.game.rounds) {
                    gameData[round.roundNumber] = [round.panorama.countryCode,gameData[round.roundNumber]];
                }
                var gameMode = "";
                lastMode = 0;
                if (jsonData.props.pageProps.game.movementOptions.forbidRotating == true){
                    gameMode = "NMPZ";
                    lastMode = 2;
                }
                else if (jsonData.props.pageProps.game.movementOptions.forbidMoving == true){
                    gameMode = "NM";
                    lastMode = 1
                }
                gameData.shift();
                gameData.sort();
                saveDuelData(gameData,gameMode);
            },
            onerror: function(){
                apiFetch(tempUrl, previousUrl);
            }
        });
    }

    async function saveDuelData(duelData, modePlayed){
        try{
            let savedData = await GM.getValue("recentDuelAvg"+modePlayed, "");
            if (savedData == ""){
                savedData = "ad,0,0;ae,0,0;af,0,0;al,0,0;am,0,0;ao,0,0;ar,0,0;as,0,0;at,0,0;au,0,0;az,0,0;ba,0,0;bd,0,0;be,0,0;bf,0,0;bg,0,0;bi,0,0;bj,0,0;bn,0,0;bo,0,0;br,0,0;bt,0,0;bw,0,0;by,0,0;bz,0,0;ca,0,0;cd,0,0;cf,0,0;cg,0,0;ch,0,0;ci,0,0;cl,0,0;cm,0,0;cn,0,0;co,0,0;cr,0,0;cu,0,0;cw,0,0;cx,0,0;cy,0,0;cz,0,0;de,0,0;dk,0,0;dm,0,0;do,0,0;dz,0,0;ec,0,0;ee,0,0;eg,0,0;er,0,0;es,0,0;et,0,0;fi,0,0;fj,0,0;fo,0,0;fr,0,0;ga,0,0;gb,0,0;ge,0,0;gf,0,0;gh,0,0;gi,0,0;gl,0,0;gm,0,0;gn,0,0;gp,0,0;gq,0,0;gr,0,0;gt,0,0;gu,0,0;gw,0,0;gy,0,0;hk,0,0;hn,0,0;hr,0,0;ht,0,0;hu,0,0;id,0,0;ie,0,0;il,0,0;im,0,0;in,0,0;iq,0,0;ir,0,0;is,0,0;it,0,0;je,0,0;jm,0,0;jo,0,0;jp,0,0;ke,0,0;kg,0,0;kh,0,0;kp,0,0;kr,0,0;kw,0,0;kz,0,0;la,0,0;lb,0,0;lk,0,0;lr,0,0;ls,0,0;lt,0,0;lu,0,0;lv,0,0;ly,0,0;ma,0,0;mc,0,0;md,0,0;me,0,0;mg,0,0;mk,0,0;ml,0,0;mm,0,0;mn,0,0;mp,0,0;mr,0,0;mt,0,0;mw,0,0;mx,0,0;my,0,0;mz,0,0;na,0,0;ne,0,0;ng,0,0;ni,0,0;nl,0,0;no,0,0;np,0,0;nz,0,0;om,0,0;pa,0,0;pe,0,0;pg,0,0;ph,0,0;pk,0,0;pl,0,0;pr,0,0;pt,0,0;py,0,0;qa,0,0;ro,0,0;rs,0,0;ru,0,0;rw,0,0;sa,0,0;sd,0,0;se,0,0;si,0,0;sk,0,0;sl,0,0;sm,0,0;sn,0,0;so,0,0;sr,0,0;ss,0,0;st,0,0;sv,0,0;sy,0,0;sz,0,0;td,0,0;tg,0,0;th,0,0;tj,0,0;tm,0,0;tn,0,0;tr,0,0;tw,0,0;tz,0,0;ua,0,0;ug,0,0;us,0,0;uy,0,0;uz,0,0;ve,0,0;vi,0,0;vn,0,0;ye,0,0;za,0,0;zm,0,0;zw,0,0;";
                await GM.setValue("recentDuelAvg"+modePlayed, savedData);
            }
            let updatedData = savedData.split(";");
            for (i = 0; i < updatedData.length - 1; i++){
                updatedData[i] = updatedData[i].split(",");
                if (duelData.length != 0){
                    if (updatedData[i][0] == duelData[0][0]){
                        let scoreAmount = Number(duelData[0][1]);
                        let amountInCountry = 1;
                        if (duelData.length > 1){
                            for (j = 1; 0 < duelData.length; j++){
                                if (duelData[j][0] == duelData[0][0]){
                                    scoreAmount = scoreAmount + Number(duelData[j][1]);
                                    amountInCountry = amountInCountry + 1;
                                }
                                else{
                                    break;
                                }
                            }
                        }
                        let oldAverage = updatedData[i][1];
                        if (updatedData[i].length == 3){
                            updatedData[i][1] = (Number(updatedData[i][1]) + scoreAmount) / (Number(updatedData[i][2]) + amountInCountry);
                            if (updatedData[i][2] == 8){
                                updatedData[i] = [updatedData[i][0],updatedData[i][1]];
                            }
                            else{
                                updatedData[i][2] = Number(updatedData[i][2]) + amountInCountry;
                            }
                        }
                        else{
                            updatedData[i][1] = (Number(updatedData[i][1]) + duelData[0][1]) / 10;
                        }
                        if (oldAverage == Math.round(updatedData[i][1]) && duelData[0][1] != oldAverage){
                            if (duelData[0][1] > oldAverage){
                                updatedData[i][1] = Math.round(updatedData[i][1]) + 1;
                            }
                            else{
                                updatedData[i][1] = Math.round(updatedData[i][1]) - 1;
                            }
                        }
                        else{
                            updatedData[i][1] = Math.round(updatedData[i][1]);
                        }
                        for (j = 0; j < amountInCountry; j++){
                            duelData.shift();
                        }
                    }
                }
                if (updatedData[i].length == 3){
                    dataToSave = dataToSave + updatedData[i][0] + "," + updatedData[i][1] + "," + updatedData[i][2] + ";";
                }
                else{
                    dataToSave = dataToSave + updatedData[i][0] + "," + updatedData[i][1] + ";";
                }
            }
            await GM.setValue(("recentDuelAvg"+modePlayed), dataToSave);
            mapData = updatedData;
            await GM.setValue("waitingDuel", "");
            apiFetch(tempUrl, previousUrl);
        }
        catch{
            apiFetch(tempUrl, previousUrl);
        }
    }

}

async function apiFetch(currentUrl, oldUrl){
    // Get language
    language = 0;
    for (i = 1; i < languageList.length; i++){
        if (languageList[i] == currentUrl.split("/")[3]){
            language = i;
            currentUrl = "https://www.geoguessr.com/"+currentUrl.substring(currentUrl.indexOf(languageList[i]) + 3,currentUrl.length);
            break;
        }
    }

    // Get distance unit
    let distanceType = accountJson.distanceUnit;
    if (distanceType == 1){
        distanceConversion = 0.000621371;
    }
    else{
        distanceConversion = 0.001;
    }

    // Get map from explorer mode
    function getMap() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.geoguessr.com/user/58e11cdd4708f74f04b06c49",
            onload: function(response) {
                var tempDiv = document.createElement("div");
                tempDiv.innerHTML = response.responseText;
                var contentDivs = tempDiv.querySelectorAll("div.container_content__Z3nYC");
                var contentDiv = contentDivs[8];
                profilePlus(rank,profileData,type,contentDiv,mapData);
            }
        });
    }

    // Get page data
    if (currentUrl == "https://www.geoguessr.com/me/profile" || currentUrl.substring(0, 31) == "https://www.geoguessr.com/user/"){
        rank = "-";
        profileData = ["-","-","-","-","-","-","-"];

        // Find world rank
        if(currentUrl == "https://www.geoguessr.com/me/profile" || currentUrl.split("/")[4] == accountJson.user.id){
            try{
                if (currentUrl == "https://www.geoguessr.com/me/profile"){
                    type = ["me",0];
                }
                else{
                    type = ["user",1];
                }
                userID = accountJson.user.id;
                if (accountJson.user.competitive.onLeaderboard == true){
                    let ratingFetch = await fetch("https://www.geoguessr.com/api/v4/ranked-system/ratings/me");
                    let ratingJson = await ratingFetch.json();
                    for (i = 0; i < 10; i++){
                        if(ratingJson[i].userId == userID){
                            rank = JSON.stringify(ratingJson[i].position);
                        }
                    }
                }
            }
            catch{
                rank = "-";
            }
        }
        else{
            type = ["user",0];
            userID = currentUrl.split("/")[4];
        }

        // Get map data
        if(mapData == "-"){
            let savedData = await GM.getValue("recentDuelAvg", "");
            if (savedData == ""){
                mapData = [["ad",0,0],["ae",0,0],["af",0,0],["al",0,0],["am",0,0],["ao",0,0],["ar",0,0],["as",0,0],["at",0,0],["au",0,0],["az",0,0],["ba",0,0],["bd",0,0],["be",0,0],["bf",0,0],["bg",0,0],["bi",0,0],["bj",0,0],["bn",0,0],["bo",0,0],["br",0,0],["bt",0,0],["bw",0,0],["by",0,0],["bz",0,0],["ca",0,0],["cd",0,0],["cf",0,0],["cg",0,0],["ch",0,0],["ci",0,0],["cl",0,0],["cm",0,0],["cn",0,0],["co",0,0],["cr",0,0],["cu",0,0],["cw",0,0],["cx",0,0],["cy",0,0],["cz",0,0],["de",0,0],["dk",0,0],["dm",0,0],["do",0,0],["dz",0,0],["ec",0,0],["ee",0,0],["eg",0,0],["er",0,0],["es",0,0],["et",0,0],["fi",0,0],["fj",0,0],["fo",0,0],["fr",0,0],["ga",0,0],["gb",0,0],["ge",0,0],["gf",0,0],["gh",0,0],["gi",0,0],["gl",0,0],["gm",0,0],["gn",0,0],["gp",0,0],["gq",0,0],["gr",0,0],["gt",0,0],["gu",0,0],["gw",0,0],["gy",0,0],["hk",0,0],["hn",0,0],["hr",0,0],["ht",0,0],["hu",0,0],["id",0,0],["ie",0,0],["il",0,0],["im",0,0],["in",0,0],["iq",0,0],["ir",0,0],["is",0,0],["it",0,0],["je",0,0],["jm",0,0],["jo",0,0],["jp",0,0],["ke",0,0],["kg",0,0],["kh",0,0],["kp",0,0],["kr",0,0],["kw",0,0],["kz",0,0],["la",0,0],["lb",0,0],["lk",0,0],["lr",0,0],["ls",0,0],["lt",0,0],["lu",0,0],["lv",0,0],["ly",0,0],["ma",0,0],["mc",0,0],["md",0,0],["me",0,0],["mg",0,0],["mk",0,0],["ml",0,0],["mm",0,0],["mn",0,0],["mp",0,0],["mr",0,0],["mt",0,0],["mw",0,0],["mx",0,0],["my",0,0],["mz",0,0],["na",0,0],["ne",0,0],["ng",0,0],["ni",0,0],["nl",0,0],["no",0,0],["np",0,0],["nz",0,0],["om",0,0],["pa",0,0],["pe",0,0],["pg",0,0],["ph",0,0],["pk",0,0],["pl",0,0],["pr",0,0],["pt",0,0],["py",0,0],["qa",0,0],["ro",0,0],["rs",0,0],["ru",0,0],["rw",0,0],["sa",0,0],["sd",0,0],["se",0,0],["si",0,0],["sk",0,0],["sl",0,0],["sm",0,0],["sn",0,0],["so",0,0],["sr",0,0],["ss",0,0],["st",0,0],["sv",0,0],["sy",0,0],["sz",0,0],["td",0,0],["tg",0,0],["th",0,0],["tj",0,0],["tm",0,0],["tn",0,0],["tr",0,0],["tw",0,0],["tz",0,0],["ua",0,0],["ug",0,0],["us",0,0],["uy",0,0],["uz",0,0],["ve",0,0],["vi",0,0],["vn",0,0],["ye",0,0],["za",0,0],["zm",0,0],["zw",0,0]];
            }
            else{
                mapData = savedData.split(";");
                for (i = 0; i < mapData.length - 1; i++){
                    mapData[i] = mapData[i].split(",");
                }
            }
        }

        // Find rounds played
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.geoguessr.com/user/" + userID,
            onload: function(response){
                let parser = new DOMParser();
                let doc = parser.parseFromString(response.responseText, "text/html");
                let scriptTag = doc.querySelector("#__NEXT_DATA__");
                let jsonData = JSON.parse(scriptTag.textContent);
                profileData = [0,(jsonData.props.pageProps.userExtendedStats.duels.avgGuessDistance * distanceConversion).toFixed(1) +" "+ translations[distanceType][language],(jsonData.props.pageProps.userExtendedStats.duelsNoMove.avgGuessDistance * distanceConversion).toFixed(1) +" "+ translations[distanceType][language],(jsonData.props.pageProps.userExtendedStats.duelsNmpz.avgGuessDistance * distanceConversion).toFixed(1) +" "+ translations[distanceType][language],jsonData.props.pageProps.userExtendedStats.duelsTotal.numGuesses,jsonData.props.pageProps.userExtendedStats.battleRoyaleCountry.numGuesses,jsonData.props.pageProps.userExtendedStats.battleRoyaleDistance.numGuesses];
                profileData[0] = jsonData.props.pageProps.userStats.roundsPlayed + profileData[4] + profileData[5] + profileData[6];
                if (jsonData.props.pageProps.userExtendedStats.rankedTeamDuelsTotal.numGamesPlayed != 0){
                    teamDuelsOffset = 6;
                }
                getMap();
            }
        });
    }
    if(currentUrl.substring(0, 32) == "https://www.geoguessr.com/duels/" && (currentUrl.split("/")[(currentUrl.split("/")).length - 1]).length == 36){
        for (i = 1; i < languageList.length; i++){
            if (languageList[i] == oldUrl.split("/")[3]){
                language = i;
                oldUrl = "https://www.geoguessr.com/"+oldUrl.substring(oldUrl.indexOf(languageList[i]) + 3,oldUrl.length);
                break;
            }
        }
        if (oldUrl == "https://www.geoguessr.com/matchmaking"){
            await GM.setValue("waitingDuel", currentUrl+"/summary");
        }
    }
}

async function changeMap(gameMode){
    let savedData = await GM.getValue("recentDuelAvg"+((["","NM","NMPZ"])[gameMode]), "");
    if (savedData == ""){
        mapData = [["ad",0,0],["ae",0,0],["af",0,0],["al",0,0],["am",0,0],["ao",0,0],["ar",0,0],["as",0,0],["at",0,0],["au",0,0],["az",0,0],["ba",0,0],["bd",0,0],["be",0,0],["bf",0,0],["bg",0,0],["bi",0,0],["bj",0,0],["bn",0,0],["bo",0,0],["br",0,0],["bt",0,0],["bw",0,0],["by",0,0],["bz",0,0],["ca",0,0],["cd",0,0],["cf",0,0],["cg",0,0],["ch",0,0],["ci",0,0],["cl",0,0],["cm",0,0],["cn",0,0],["co",0,0],["cr",0,0],["cu",0,0],["cw",0,0],["cx",0,0],["cy",0,0],["cz",0,0],["de",0,0],["dk",0,0],["dm",0,0],["do",0,0],["dz",0,0],["ec",0,0],["ee",0,0],["eg",0,0],["er",0,0],["es",0,0],["et",0,0],["fi",0,0],["fj",0,0],["fo",0,0],["fr",0,0],["ga",0,0],["gb",0,0],["ge",0,0],["gf",0,0],["gh",0,0],["gi",0,0],["gl",0,0],["gm",0,0],["gn",0,0],["gp",0,0],["gq",0,0],["gr",0,0],["gt",0,0],["gu",0,0],["gw",0,0],["gy",0,0],["hk",0,0],["hn",0,0],["hr",0,0],["ht",0,0],["hu",0,0],["id",0,0],["ie",0,0],["il",0,0],["im",0,0],["in",0,0],["iq",0,0],["ir",0,0],["is",0,0],["it",0,0],["je",0,0],["jm",0,0],["jo",0,0],["jp",0,0],["ke",0,0],["kg",0,0],["kh",0,0],["kp",0,0],["kr",0,0],["kw",0,0],["kz",0,0],["la",0,0],["lb",0,0],["lk",0,0],["lr",0,0],["ls",0,0],["lt",0,0],["lu",0,0],["lv",0,0],["ly",0,0],["ma",0,0],["mc",0,0],["md",0,0],["me",0,0],["mg",0,0],["mk",0,0],["ml",0,0],["mm",0,0],["mn",0,0],["mp",0,0],["mr",0,0],["mt",0,0],["mw",0,0],["mx",0,0],["my",0,0],["mz",0,0],["na",0,0],["ne",0,0],["ng",0,0],["ni",0,0],["nl",0,0],["no",0,0],["np",0,0],["nz",0,0],["om",0,0],["pa",0,0],["pe",0,0],["pg",0,0],["ph",0,0],["pk",0,0],["pl",0,0],["pr",0,0],["pt",0,0],["py",0,0],["qa",0,0],["ro",0,0],["rs",0,0],["ru",0,0],["rw",0,0],["sa",0,0],["sd",0,0],["se",0,0],["si",0,0],["sk",0,0],["sl",0,0],["sm",0,0],["sn",0,0],["so",0,0],["sr",0,0],["ss",0,0],["st",0,0],["sv",0,0],["sy",0,0],["sz",0,0],["td",0,0],["tg",0,0],["th",0,0],["tj",0,0],["tm",0,0],["tn",0,0],["tr",0,0],["tw",0,0],["tz",0,0],["ua",0,0],["ug",0,0],["us",0,0],["uy",0,0],["uz",0,0],["ve",0,0],["vi",0,0],["vn",0,0],["ye",0,0],["za",0,0],["zm",0,0],["zw",0,0]];
    }
    else{
        mapData = savedData.split(";");
        for (i = 0; i < mapData.length - 1; i++){
            mapData[i] = mapData[i].split(",");
        }
    }
    for (i = 1; i < 181; i++){
        var countryDiv = document.getElementById("country-"+mapData[i][0])
        if (mapData[i].length == 3 && Number(mapData[i][2]) == 0){
            countryDiv.setAttribute("fill", "url(#striped-pattern)");
        }
        else{
            countryDiv.setAttribute("fill", "hsl("+(Math.floor(Number(mapData[i][1])/50))+", 70%, 60%, 1.0)");
        }
    }
}

function profilePlus (currentRank,roundsPlayed,pageType,mapDiv,dataForMap){
    // Display world rank
    if (currentRank != "-"){
        let classToClone = document.querySelectorAll(".multiplayer_division__6sMUf");
        let cloneLocation = classToClone[0].children[1];
        try{
            // When changing languages
            cloneLocation.children[2].children[0].textContent = translations[0][language];
        }
        catch{
            let clonedClass = cloneLocation.children[1].cloneNode(true);
            clonedClass.children[0].textContent = translations[2][language];
            clonedClass.children[1].textContent = "#"+currentRank;
            cloneLocation.appendChild(clonedClass);
        }
    }
    // Display bonus data on summary section
    if (roundsPlayed[0] != "-"){
        let classToClone = document.querySelectorAll(".container_content__Z3nYC");
        let cloneLocation = classToClone[2].children[1];
        if (pageType[0] == "user"){
            classToClone = document.querySelectorAll(".slug_section__67sEF");
            cloneLocation = classToClone[0].children[2 - pageType[1]];
        }
        let elementArea = [[0,translations[3][language],3],[4,translations[4][language],3],[5,translations[5][language],3],[6,translations[6][language],3],[8,translations[7][language],3],[12 + teamDuelsOffset,translations[8][language],3],[12 + teamDuelsOffset,translations[9][language],7]];
        try{
            // When changing languages
            for (i = 0; i < elementArea.length; i++){
                cloneLocation = classToClone[2].children[1 + elementArea[i][0]];
                if (pageType[0] == "user"){
                    cloneLocation = classToClone[0].children[2 + elementArea[i][0]];
                }
                cloneLocation.children[elementArea[i][2]].children[0].children[1].children[0].textContent = elementArea[i][1];
            }
        }
        catch{
            for (i = 0; i < elementArea.length; i++){
                cloneLocation = classToClone[2].children[1 + elementArea[i][0]];
                if (pageType[0] == "user"){
                    cloneLocation = classToClone[0].children[2 - pageType[1] + elementArea[i][0]];
                }
                cloneLocation.style = "--columns:4;--gap:16;--xsColumns:2";
                let clonedClass = cloneLocation.children[2].cloneNode(true);
                clonedClass.children[0].children[0].children[0].textContent = roundsPlayed[i];
                clonedClass.children[0].children[1].children[0].textContent = elementArea[i][1];
                cloneLocation.insertBefore(clonedClass,cloneLocation.children[elementArea[i][2]]);
            }
        }
    }
    // Adds world map data
    if (pageType[0] == "me" || pageType[1] == 1){
        let mapLocation = document.querySelectorAll(".container_content__Z3nYC")[2];
        if (pageType[0] == "user"){
            mapLocation = document.querySelectorAll(".slug_section__67sEF")[0];
        }
        var dividerDiv = document.createElement("div");
        dividerDiv.className = "user-stats-overview_divider__a8T5E";
        var displayDiv = document.createElement("div");
        displayDiv.innerHTML = mapDiv.innerHTML;
        displayDiv.children[0].textContent = translations[10][language];
        displayDiv.removeChild(displayDiv.children[2]);
        var changeModeDiv = document.createElement("div");
        changeModeDiv.className = "switch_switch__ie6MF switch_horizontal__KO_Qe";
        for (i = 0; i < 3; i++){
            var nextDivElement = document.createElement("div");
            nextDivElement.className = "switch_switchItem__LQpWl";
            changeModeDiv.appendChild(nextDivElement);
            var tempElement = document.createElement("div");
            tempElement.className = "switch_background__M2QFN";
            if (i == lastMode){
                tempElement.classList.add("switch_show__V6W5T");
            }
            else{
                tempElement.classList.add("switch_hide__KyksT");
            }
            nextDivElement.appendChild(tempElement);
            tempElement = document.createElement('label');
            tempElement.className = "switch_label__KrnMF";
            tempElement.textContent = translations[11+i][language];
            nextDivElement.appendChild(tempElement);
            nextDivElement.addEventListener("click", function () {
                var allItems = changeModeDiv.getElementsByClassName("switch_switchItem__LQpWl");
                var clickedBackgroundDiv = this.querySelector('.switch_background__M2QFN');
                var clickedBackgroundType = 0;
                for (var j = 0; j < allItems.length; j++) {
                    var backgroundDiv = allItems[j].querySelector(".switch_background__M2QFN");
                    if (backgroundDiv) {
                        backgroundDiv.classList.remove("switch_show__V6W5T");
                        backgroundDiv.classList.add("switch_hide__KyksT");
                    }
                    if (backgroundDiv == clickedBackgroundDiv){
                        clickedBackgroundType = j;
                    }
                }
                if (clickedBackgroundDiv) {
                    clickedBackgroundDiv.classList.remove("switch_hide__KyksT");
                    clickedBackgroundDiv.classList.add("switch_show__V6W5T");
                }
                changeMap(clickedBackgroundType);
            });
        }
        changeModeDiv.style.margin = "20px 0";
        mapLocation.appendChild(dividerDiv);
        while (displayDiv.firstChild) {
            if(displayDiv.children.length == 1){
                for (i = 1; i < 181; i++){
                    if (dataForMap[countryArrayPos[i-1]].length == 3 && Number(dataForMap[countryArrayPos[i-1]][2]) == 0){
                        displayDiv.firstChild.children[i].setAttribute("fill", "url(#striped-pattern)");
                    }
                    else{
                        displayDiv.firstChild.children[i].setAttribute("fill", "hsl("+(Math.floor(dataForMap[countryArrayPos[i-1]][1]/50))+", 70%, 60%, 1.0)");
                    }
                }
                mapLocation.appendChild(displayDiv.firstChild);
            }
            else{
                mapLocation.appendChild(displayDiv.firstChild);
                mapLocation.appendChild(changeModeDiv);
            }
        }
    }
}

checkForData("");