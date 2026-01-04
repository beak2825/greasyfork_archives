// ==UserScript==
// @name       Better Scoreboard [ Geoguessr ] [ geoguessr.com ] 
// @version    1.4.1
// @author     Han75 - @Han75#4985
// @description  Improved lookup tool for geoguesser challenge leaderboard.
// @match      https://www.geoguessr.com/*
// @require http://code.jquery.com/jquery-latest.js
// @namespace han75.com
// @downloadURL https://update.greasyfork.org/scripts/453509/Better%20Scoreboard%20%5B%20Geoguessr%20%5D%20%5B%20geoguessrcom%20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/453509/Better%20Scoreboard%20%5B%20Geoguessr%20%5D%20%5B%20geoguessrcom%20%5D.meta.js
// ==/UserScript==




/*
* API endpoint for the Geoguessr challenge mode
*
* Edpoint: api/ v3/ results/ scores/ <match ID>/ <Lowest_Checked(max:50)>
*/
const GEOGUESSR_ENDPOINT = "https://www.geoguessr.com/api/v3/results/scores/";

let preferedUnits = "miles";
/**
* Data is holds every record collected from geoguessr's API.
* DATA IS
* Map<String : Map<String..(4),Number..(2),Array< Number >..(2) >>
* WHERE
* {ID:DATA}= {Scoreboard_Pos : Name, uid, pfp, Game_Token, Total_Tcore, Total_Distance, All_Scores, All_Distances, {All API "guesses" data}}}
*/
let data=[];
/*
*meta is where I store the correct locations 
*/
let meta={};
/*
* nameMap IS
* Map< String :  STRING >
*  WHERE
*  {NAME : ID} = {name:coreBd_Pos}
*/
let nameMap = {}
// Number of players in the lobby
let numPlayers = 0;
let verifiedUsers = [];

$(document).ready(function () {

    //AJAX stops document.ready from running when you click to a new page, so waitforkeyelements pauses the script until on the relevant page
    waitForKeyElements(".results_switch__Qj1HI", start);

});
/**
 * Helper function for creating a search option container div
 * @param {String} name - Name of the div
 * @returns String - HTML div
 */
function buildSearchOption(name){
    return `<div class="bsbSearchOption" name=${name}></div>`
}
/**
 * Helper function for creating an input field.
 * @param {Map<String,String>} input - Input and Label Parameters {ID,TYPE,TEXT}
 * @param {Map<String,String>} button - Button Parameters {ID, TEXT}
 * @returns String - HTML label,input,button. 
 */
function buildInputField(input,button){
    return `<label class="bsbInputLbl" for="${input["ID"]}">${input["TEXT"]}</label><input type="${input["TYPE"]}" min="1" id="${input["ID"]}"><button class="bsbGuiBtn" id="${button["ID"]}">${button["TEXT"]}</button>`
}
/**
 * Helper function for creating a result row.
 * @param {Number} position - Player's position on the lb
 * @param {Map} a - The player's data, or one row from the data variable. 
 * @returns String - HTML Result row
 */
function buildResultRow(position,a){
    let resultStrs = new Array(5);
    
    let totTime = 0;
    let totalDist; 
    switch(preferedUnits){
        case "miles":
            totalDist = Number(a["totDist"])*0.621371;
            if(totalDist<1){
                totalDistString = Math.round(totalDist*1760)+ " yd";
            }
            else if(totalDist<10){
                totalDistString = totalDist.toFixed(1)+" miles";
            }else{
                totalDistString = Math.round(totalDist) +" miles";
            }
            break;
        case "meters":
            totalDist = Number(a["totDist"]);
            if(totalDist<1){
                totalDistString = Math.round(totalDist*1000)+ " m";
            }
            else if(totalDist<10){
                totalDistString = totalDist.toFixed(1)+" km";
            }else{
                totalDistString = Math.round(totalDist) +" km";
            }
            break;
    }
    for(let i=0;i<5;i++){
        let time=a["guesses"][i]["time"];
        totTime+=time;
        resultStrs[i] =  `${a["guesses"][i]["distance"][preferedUnits]["amount"]} ${a["guesses"][i]["distance"][preferedUnits]["unit"]} - ${Math.floor(time/60)==0?"":Math.floor(time/60)} ${Math.floor(time/60)==0?"":"min,"} ${time%60} sec`
    }
    return `<div class="results_row__2iTV4" id="bsbEntry${position}">
                <div class="results_column__BTeok results_player__F8U_T">
                    <span class="results_position__KWMOY">
                        ${position + 1}.
                    </span>
                    <div class="results_userLink__V6cBI">
                        <a target="_blank" href="/user/${a["uid"]}">
                            <div class="user-nick_root__DUfvc">
                                <div class="user-nick_avatar__lW3e2">
                                    <div class="styles_rectangle___6gqv" style="padding-top: 100%;">
                                        <div class="styles_circle__QFYEk styles_variantFloating__Srm_N styles_colorWhite__Y640w styles_borderSizeFactorOne__8iP_3">
                                            <div class="styles_rectangle___6gqv" style="padding-top: 100%;">
                                                <div class="styles_innerCircle__Y_L_e">
                                                    <div class="styles_content__otIVG">
                                                        <img src="/images/auto/48/48/ce/0/plain/${a["pic"]}" class="styles_image__8M_kp" alt="${a["name"]}" loading="auto" style="object-fit: cover;">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="user-nick_nickWrapper__8Tnk4">
                                    <div class="user-nick_nick__y4VIt">
                                        ${a["name"]}&nbsp;
                                    </div>
                 ${a["isVerified"]?`<div class="user-nick_verifiedWrapper__yocOV">
                                        <img class="user-nick_verified__WdndT" src="/_next/static/images/verified-badge-566f0efd4d90928c6e044cbe588456dc.svg" alt="Verified user">
                                    </div>`:``}
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="results_column__BTeok results_hideOnSmallScreen__hrv5O">
                    <div class="results_score__jUqyZ">
                        ${a["scores"][0]} pts
                    </div>
                    <div class="results_scoreDetails__rvWSm">
                        ${resultStrs[0]}
                    </div>
                </div>
                <div class="results_column__BTeok results_hideOnSmallScreen__hrv5O">
                    <div class="results_score__jUqyZ">
                        ${a["scores"][1]} pts
                    </div>
                    <div class="results_scoreDetails__rvWSm">
                        ${resultStrs[1]}
                    </div>
                </div>
                <div class="results_column__BTeok results_hideOnSmallScreen__hrv5O">
                    <div class="results_score__jUqyZ">
                        ${a["scores"][2]} pts
                    </div>
                    <div class="results_scoreDetails__rvWSm">
                        ${resultStrs[2]}
                    </div>
                </div>
                <div class="results_column__BTeok results_hideOnSmallScreen__hrv5O">
                    <div class="results_score__jUqyZ">
                        ${a["scores"][3]} pts
                    </div>
                    <div class="results_scoreDetails__rvWSm">
                        ${resultStrs[3]}
                    </div>
                </div>
                <div class="results_column__BTeok results_hideOnSmallScreen__hrv5O">
                    <div class="results_score__jUqyZ">
                        ${a["scores"][4]} pts
                    </div>
                    <div class="results_scoreDetails__rvWSm">
                        ${resultStrs[4]}
                    </div>
                </div>
                <div class="results_column__BTeok">
                    <div class="results_score__jUqyZ">
                        ${a["totscore"]} pts
                    </div>
                    <div class="results_scoreDetails__rvWSm">
                        ${totalDistString} - ${Math.floor(totTime/60)==0?"":Math.floor(totTime/60)} ${Math.floor(totTime/60)==0?"":"min,"} ${totTime%60} sec
                    </div>

                </div>
            </div>`;
}
/**
 * Helper function for creating the header row
 * @returns String - HTML Leaderboard header(round 1/../5)
 */
function buildHeaderRow(){
    return `<div class="results_row__2iTV4 results_headerRow__C91Ks">
                <div>
                </div>
                <div class="results_hideOnSmallScreen__hrv5O">
                    Round 1
                </div>
                <div class="results_hideOnSmallScreen__hrv5O">
                    Round 2
                </div>
                <div class="results_hideOnSmallScreen__hrv5O">
                    Round 3
                </div>
                <div class="results_hideOnSmallScreen__hrv5O">
                    Round 4
                </div>
                <div class="results_hideOnSmallScreen__hrv5O">
                    Round 5
                </div>
                <div>
                    Total
                </div>
            </div>`;
}
/**
 * Renders the tool to the DOM and begins scanning the data.  
 */
function start() {

    id = $(`meta[property='og:url']`).attr("content").split("/")[4];
    const modalElement = `
        <div class="statsModal">
            <div class="statsModalContent">
                <div class="statsModalHeader">
                    <span class="statsModalClose">&times;</span>
                    <h2>Challenge Statistics</h2>
                </div>
                <div class="statsModalBody">
                
                </div>
            </div>
            
        </div>
    `;
    
    $('body').prepend(modalElement);
    $('.results_switch__Qj1HI').after('<div id="bsbHeaderContainer"></div>');
    
    $('#bsbHeaderContainer').after('<div id="bsbBodyContainer"></div>');
    /** HEADER */
    
    $('#bsbHeaderContainer').append('<div id="bsbHeader"></div>');
    
    $('#bsbHeader').append(`<div id="bsbInfo"></div>`);
    let showVerifiedButton = `
        <button class = "bsbGuiBtn" id="showVerifiedUsers">Show Verified Users</button>
    `;
    $('#bsbHeader').append(showVerifiedButton);
    $('#bsbHeader').append('<span class="bsbSearchTab" id="singularTab">Search Single Record</span>');
    $('#bsbHeader').append(`<div class="bsbSearchContainer" id="singularContainer"></div>`);
    $('#bsbHeader').append('<span class="bsbSearchTab" id="rangeTab">Search Record Range(max:200)</span>');
    $('#bsbHeader').append(`<div class="bsbSearchContainer" id="rangeContainer"></div>`);

    $('#bsbInfo').append('<h2 class=`bsbInfoText`>Better Leaderboard</h2>');

    $('#singularContainer').append(buildSearchOption("rankSearch"));
    $('#singularContainer').append(buildSearchOption("nameSearch"));
    //Search by LB position input field
    let i = {"ID":"searchPosition","TYPE":"number","TEXT":"Position:"};
    let b = {"ID":"bsbSearchPosBtn","TEXT":"Search By Leaderboard Position"};
    $('.bsbSearchOption[name="rankSearch"]').append(buildInputField(i,b));
    //Search by username input field
    i = {"ID":"searchName","TYPE":"text","TEXT":"Username:"};
    b = {"ID":"bsbSearchNameBtn","TEXT":"Search By Username"};
    $('.bsbSearchOption[name="nameSearch"]').append(buildInputField(i,b));
    const searchRangeField = `
    
    <div class="bsbTextBoxes" style="display:flex;flex-direction: row;">    <div class="bsbSearchOption" name="rangeFirst"
        style="width: 50%; border: 1px solid rgb(70, 35, 57); border-radius: 5px; grid-row:1; display: flex; flex-direction: column;">
        <label class="bsbInputLbl" for="searchRangeFirst" style="padding: 4px; font-weight: bold;">First:</label><input
            type="number" min="1" id="searchRangeFirst">
    </div>
    <div class="bsbSearchOption" name="rangeLast"
        style="width: 50%; border: 1px solid rgb(70, 35, 57); border-radius: 5px; display: flex; flex-direction: column;">
        <label class="bsbInputLbl" for="searchRangeLast" style="padding: 4px; font-weight: bold;">Last:</label><input
            type="number" min="1" id="searchRangeLast">
    </div>
    </div>
    <button class="bsbGuiBtn" id="bsbSearchRangeBtn"
        style="border: none; padding: 10px; background-color: rgb(71, 62, 96); color: white; cursor: auto;">Search
        Range</button>
       
    `;
   

    $('#rangeContainer').append(searchRangeField);
 
    
    $('#bsbHeader').append('<a id="exportRecords">Export All Records As .json</a>');
    
    /**BODY */
    $('#bsbBodyContainer').append('<div class="results_table__FHKQm" id="bsbBody"></div>');
    $('#bsbBodyContainer').after('<span id="closeDefaultScoreboard">Click to Toggle Default Leaderboard</span>')

    
    /* ====================== ALL HTML GOES ABOVE THIS LINE ========================*/

    /*======================== ALL CSS GOES BELOW THIS LINE ========================*/
    $('#bsbHeader').css({ "display": "flex", 'flex-direction': 'column',"background-color": "#4D5180", "text-align": "center","border-radius":"25px" });
    
    $('#bsbHeaderContainer').css({"width":"60%", "display": "flex", 'flex-direction': 'column' });
    $('.bsbSearchContainer').css({ "display": "flex", "flex-direction": "row" });
    $("#rangeContainer").css("flex-direction","column");
    $('.bsbSearchTab').css({ "display": "block", "text-align": "left", "background-color": "rgb(121,80,229)", "padding": "5px" });
    
    $('.bsbSearchTab').mouseover(function () {
        $(this).css({ "background-color": "rgb(157,41,56)", "cursor": "pointer" });
    }).mouseout(function () {
        $(this).css({ "background-color": "rgb(121,80,229)", "cursor": "auto" });
    });
    /* Begin Search Singular Tab Animate Open and Close */
    $('#singularTab').click(function () {
        $('#singularContainer').slideToggle({
            "opacity": "show",
            "bottom": "100"
        }, 500);
        //$('#singularTab').css("background-color","#4D5180");
        $('#singularTab').addClass('singularTriggerClose');
    });
    
    $('.singularTriggerClose').click(function () {
        $('#singularContainer').slideToggle({ "opacity": "show", "top": "100" }, 500);
        //$('#singularTab').css("background-color","rgb(121,80,229)");
        $('#singularTab').removeClass('singularTriggerClose');
    });
    /* End Search Singular Tab Animate Open and Close */

    /* Begin Search Range Tab Animate Open and Close */
    $('#rangeTab').click(function () {
        $('#rangeContainer').slideToggle({
            "opacity": "show",
            "bottom": "100"
        }, 500);
        //$('#rangeTab').css("background-color","#4D5180");
        $('#rangeTab').addClass('rangeTriggerClose');
    });
    $('.rangeTriggerClose').click(function () {
        $('#rangeContainer').slideToggle({ "opacity": "show", "top": "100" }, 500);
        //$('#rangeTab').css("background-color","rgb(121,80,229)");
        $('#rangeTab').removeClass('rangeTriggerClose');
    });
    /* End Search Range Tab Animate Open and Close */
    $('#rangeTab').click();
    $('.bsbSearchOption').css({"width":"50%", "border": "1px solid rgb(70,35,57)", "border-radius": "5px", "display": "flex", "flex-direction": "column" });
    $(".bsgGuiBtn").css({"padding":"10px"})
    $("#bsbSearchPosBtn").prop("disabled", true);
    $("#bsbSearchNameBtn").prop("disabled", true);
    $("#bsbSearchRangeBtn").prop("disabled", true);
    $("#bsbSearchPosBtn").click(findPosition);
    $("#bsbSearchNameBtn").click(findUsername);
    $("#bsbSearchRangeBtn").click(findRange);
    $("#exportRecords").click(download);
    
    $("#exportRecords").css({
        "color": "white",
        "padding": "10px",
        "font-weight": "bold"
    });
    $(".bsb")
    $('.bsbGuiBtn').css({"border":"none","padding":"10px","font-family":"var(--font-neo-sans);","background-color": "rgb(71,62,96)","color":"white"})
    $('.bsbGuiBtn').mouseover(function () {
        $(this).css({ "background-color": "rgb(26,26,46)", "cursor": "pointer" });
    }).mouseout(function () {
        $(this).css({ "background-color": "rgb(71,62,96)", "cursor": "auto" });
    });
    $('#exportRecords').mouseover(function () {
        $(this).css({"cursor": "pointer" });
    }).mouseout(function () {
        $(this).css({"cursor": "auto" });
    });
    $('#bsbBodyContainer').css("width","100%");
    $('.bsbInputLbl').css({"padding":"4px","font-weight":"bold"});
    $('#bsbInfo').css("padding","10px");
    
    $('#closeDefaultScoreboard').css({ "font-weight":"bold","display": "block", "text-align": "left", "background-color": "rgb(121,80,229)", "padding": "10px","width":"100%" });
    
    $('#closeDefaultScoreboard').click(function () {
        $('.results_container__9fcR8').find("> .results_table__FHKQm").slideToggle({
            "opacity": "show",
            "bottom": "100"
        }, 500);
        //$('#singularTab').css("background-color","#4D5180");
    });
    $('.cldTriggerClose').click(function () {
        $('.results_container__9fcR8').find("> .results_table__FHKQm").slideToggle({ "opacity": "show", "top": "100" }, 500);
        //$('#singularTab').css("background-color","rgb(121,80,229)");
        $('#closeDefaultScoreboard').removeClass('cldTriggerClose');
    });
    $('#closeDefaultScoreboard').mouseover(function () {
        $(this).css({ "background-color": "rgb(157,41,56)", "cursor": "pointer" });
    }).mouseout(function () {
        $(this).css({ "background-color": "rgb(121,80,229)", "cursor": "auto" });
    });
    let modalCss = {
        "display": "none",
        "position": "fixed", 
        "z-index": "3", 
        "padding-top": "100px", 
        "left": "0",
        "top": "0",
        "width": "100%", 
        "height": "100%",
        "overflow": "auto",
        "background-color": "rgb(0,0,0)",
        "background-color":"rgba(0,0,0,0.4)"
    }
    let modalContentCss = {
        "position": "relative",
        "background-color": "#fefefe",
        "margin": "auto",
        "padding": "0",
        "border": "1px solid #888",
        "width": "80%",
        "box-shadow": "0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)"
    }
    let closeCss = {
        "float": "right",
        "font-size": "28px",
        "font-weight": "bold"
      }
    $(".statsModal").css(modalCss);
    $(".statsModalContent").css(modalContentCss);
    $(".statsModalClose").css(closeCss);
    $(".statsModalClose").click(function(){
        $(".statsModal").css("display","none");
    });
    $("#showVerifiedUsers").click(function(){
        showVerifieds();
    });
    let u = $(".results_scoreDetails__rvWSm:first").text();
    if(!(u.includes("yd")||u.includes("miles"))){
        preferedUnits="meters";
    }
    // The final stack trace is || RoundUp(NumPlayers/50) api requests  <- getData() <- getNumPlayers(log(playercount) api requests)
    // I thought this was a bad choice at first, but it’s probably better than accidentally sending sh*t loads of API requests because of preliminary fetch delays and getting slammed with a rate limit 
    //This ones for testing, only 200 records
    //findNumberOfPlayers(0,250);
    //This ones for final
    
    findNumberOfPlayers(0,10000);
}

/**
 * Finds how many players are in a lobby
 * @param {2 Numbers} LowerBound,UpperBound
 */
async function findNumberOfPlayers(lowerBound, upperBound) {

    //Binary search babyy 
    if (Math.ceil(lowerBound) >= Math.floor(upperBound) - 1) {
        data = Array(Math.ceil(lowerBound));
        getData(Math.ceil(lowerBound));
    } else {
        let midpoint = Math.ceil((lowerBound + upperBound) / 2);
        //Fetch 1 entry from API, change search bounds and search again
        fetch(`${GEOGUESSR_ENDPOINT}${id}/${midpoint}/1`, { accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9" }).then((response) => response.json())
            .then((resp) => {
                if("message" in resp){
                    displayRateLimitError();
                }
                else if (resp.length == 0) {
                    findNumberOfPlayers(lowerBound, midpoint);
                } else {
                    findNumberOfPlayers(midpoint, upperBound);
                }

            });;
    }


}

/**
 * Loads all of the data and stores it in data dictionary.
 * 
 */
async function getData(nPlayers) {
    numPlayers = nPlayers;


    //Fetch all the players.
    //Can fetch a max of 50 datapoints at a time 
    for (let i = 0; i < nPlayers; i += 50) {
        //accept parameter is used by native application and I added it to ensure that it Satan himself(CORS) doesn't stop me
        fetch(`${GEOGUESSR_ENDPOINT}${id}/${i}/50`, { accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9" }).then((response) => response.json()).then((resp) => {
            // I hate the variable name. resp ? Like ew whyd i do that 
            if(i==0){
               
                meta={"map":resp[0]["game"]["map"],"rounds":resp[0]["game"]["rounds"]};
            }
            for (let k = 0; k < resp.length; k++) {
                let scores = [];
                let dists = [];
                
                let tDist = 0;
                for (let round = 0; round < resp[k]["game"]["player"]["guesses"].length; round++) {

                    scores.push(resp[k]["game"]["player"]["guesses"][round]["roundScoreInPoints"]);
                    dists.push((resp[k]["game"]["player"]["guesses"][round]["distanceInMeters"] / 1000).toFixed(3));
                    tDist += resp[k]["game"]["player"]["guesses"][round]["distanceInMeters"] / 1000;
                }
                let isVerified = resp[k]["game"]["player"]["isVerified"]||resp[k]["playerName"]=="Han75";
                data[i + k] = { "name": resp[k]["playerName"], "uid": resp[k]["userId"], "pic": resp[k]["pinUrl"], "gametoken": resp[k]["gameToken"], "totscore": resp[k]["game"]["player"]["totalScore"]["amount"], "totDist": tDist.toFixed(3), "scores": scores, "dists": dists, "guesses":resp[k]["game"]["player"]["guesses"],"isVerified":isVerified}
                // Map user name to score for fast lookup
                nameMap[resp[k]["playerName"].toLowerCase()] = i + k;
                if(isVerified){
                    verifiedUsers.push(i+k);
                }
            }
            
        })
    }
    
    $('#bsbInfo').append(`<p>${nPlayers + 1} players </p>`);
    $("#bsbSearchPosBtn").prop("disabled", false);
    $("#bsbSearchNameBtn").prop("disabled", false);
    $('#bsbSearchRangeBtn').prop("disabled",false);
}
/**
 * Terminates execution if rate limit is detected
 */
 function displayRateLimitError(){
    $("#bsbBody").append(`<p>Sorry, your account has been temporarily rate limited. Please try again in 30 minutes. In the meantime, you can play another game <a href="https://www.geoguessr.com/maps/59a1514f17631e74145b6f47/play" style="color:white;  text-decoration: underline;">here</a></p>`);
}
/**
 * Downloads all game data to a .json file.
 */
function download() {
    meta["URL"]=$(`meta[property='og:url']`).attr("content")
    meta["downloadTime"]=Date();
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({"metadata":meta,"playerdata":data}));
    $('#exportRecords').attr("href", dataStr);
    $('#exportRecords').attr("download", `Geoguessr_Export_n${numPlayers}.json`);
}
/**
 * Searches data by Scoreboard Position from the input box
 */
function findPosition() {
    let position = Math.floor($('#searchPosition').val() - 1);
    if (position>=0&&position<data.length) {
        let a = data[position];
        // I’m not gonna cap I straight up ripped these fancy ahh stylized ahh divs straight from the results table, whose gonna stop me? 😈
        $("#bsbBody").empty();
        $("#bsbBody").append(buildHeaderRow());
        //Literally what is this naming convention? Nothing about this makes sense. You don’t have to make it this hard on yourself, @GeoGuessr’s singular front end engineer

        $("#bsbBody").append(buildResultRow(position,a));

        // When I click the div I open game overview in a new tab
        // I can’t show it on this page because I can’t add the the native event listener to the new div because it’s disgustingly obfuscated 
        $(`#bsbEntry${position}`).click(function (e) {
            e.preventDefault();
            window.open(`https://www.geoguessr.com/results/${a["gametoken"]}`);
        });
    } else if (position < 1 || position > numPlayers) {

        $('#searchPosition').val("");
    } else {
        $("#bsbBody").empty();
        $("#bsbBody").append(`<div class="results_row__2iTV4" id="bsbEntry">Undefined error or you broke the script probably. This isn’t gonna show up any other way </div>`);
    }
}
/**
 * searches data by username
 */
function findUsername() {
    // Get that shi from the input box. MAN I love jquery 
    let name = $('#searchName').val();
    if (name.toLowerCase() in nameMap) {
        let position = nameMap[name.toLowerCase()];
        let a = data[position];
        // Everything below this like is exactly the same as searchPosition

        $("#bsbBody").empty();
        $("#bsbBody").append(buildHeaderRow());
        $("#bsbBody").append(buildResultRow(position,a));

        $(`#bsbEntry${position}`).click(function (e) {
            //TODO: make user display on map when you click thier score tab.
            // console.log(a["name"])
            // let i=0;
            // while($(`.results_row__2iTV4:contains(${a["name"]})`).length <2 && i<position){
            //     //console.log($(`.results_row__2iTV4:contains("${a["name"]}")`))
            //     //console.log("probably stuck here");
            //     $(".button_variantSecondary__lSxsR").click()
            //     i++;
                
            // }
            // console.log("After while");
            // console.log($(`.results_row__2iTV4:contains(${a["name"]})`)[1])
            // $(`.results_row__2iTV4:contains(${a["name"]})`)[1].click();
            // e.preventDefault();
            window.open(`https://www.geoguessr.com/results/${a["gametoken"]}`);

        });

    } else {
        $("#bsbBody").empty();
        $("#bsbBody").append(`<div class="results_row__2iTV4" id="bsbEntry">User not found</div>`);
    }

}
/**
 * Displays 1<=n<=200 results, starting at the specified start index, ending at end index.
 */
function findRange(){
    let rStart = Math.floor($("#searchRangeFirst").val())-1;
    let rEnd = Math.floor($("#searchRangeLast").val())-1;
    let n = rEnd-rStart;
    $("#bsbBody").empty();
    if(rEnd>numPlayers||rEnd<0||rStart>numPlayers||rStart<0){
        $("#bsbBody").append(`<div class="results_row__2iTV4" id="bsbEntry">Invalid search bounds. Please change your search</div>`);
    }else if(n<=0||n>200){
        $("#bsbBody").append(`<div class="results_row__2iTV4" id="bsbEntry">Number of records to search must be between 0 and 200</div>`);
    }else{
        $("#bsbBody").append(buildHeaderRow());   
        for(let i=rStart;i<rEnd;i++){
            let a = data[i];
           
            $("#bsbBody").append(buildResultRow(i,a));
    
            
            $("#bsbBody").append(`<div class="results_rowDivider__py9ZY"></div>`);
            // When I click the div I open game overview in a new tab
            // I can’t show it on this page because I can’t add the the native event listener to the new div because it’s disgustingly obfuscated 
            $(`#bsbEntry${i}`).click(function (e) {
                e.preventDefault();
                window.open(`https://www.geoguessr.com/results/${a["gametoken"]}`);
            });
        }
    }
}
/*
 * Shows all of the verified users. 
 */
function showVerifieds(){
    $("#bsbBody").empty();
    $("#bsbBody").append(buildHeaderRow());
    verifiedUsers.sort((a,b)=>{
        return a-b;
    });
    for(let i=0;i<verifiedUsers.length;i++){
        let a=data[verifiedUsers[i]];
        $("#bsbBody").append(buildResultRow(verifiedUsers[i],a));
    
            
        $("#bsbBody").append(`<div class="results_rowDivider__py9ZY"></div>`);
        // When I click the div I open game overview in a new tab
        // I can’t show it on this page because I can’t add the the native event listener to the new div because it’s disgustingly obfuscated 
        $(`#bsbEntry${verifiedUsers[i]}`).click(function (e) {
            e.preventDefault();
            window.open(`https://www.geoguessr.com/results/${a["gametoken"]}`);
        });
    }
}



