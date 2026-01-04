// ==UserScript==
// @name         LatitudeGuessr
// @include      /^(https?)?(\:)?(\/\/)?([^\/]*\.)?geoguessr\.com($|\/.*)/
// @version      0.0.4
// @description  Are you tired of getting the latitude correctly but not the longitude? This script will show the TRUE score of your guess.
// @author       semihM (aka rhinoooo_)
// @source       https://github.com/semihM/GeoGuessrScripts/blob/main/LatitudeGuessr
// @supportURL   https://github.com/semihM/GeoGuessrScripts/issues
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/851187
// @downloadURL https://update.greasyfork.org/scripts/436996/LatitudeGuessr.user.js
// @updateURL https://update.greasyfork.org/scripts/436996/LatitudeGuessr.meta.js
// ==/UserScript==

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const DEBUG_ENABLED = false // true: Console print enabled for debugging; false: Don't print any debug information

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const _storage_checked = "RealScoreChecked"
const _id_realscore = "latitude_score"
const _class_roundResult_5roundGame = "round-result_actions__5j26U"
const _class_endResult_5roundGame = "streak-round-result_progressSection__6jL1y"

const SummaryLoadingPlaceHolderInnerHtml = `<div id="` + _id_realscore + `" style="text-align:center">Calculating the true score...</div><br>`

let checked = parseInt(sessionStorage.getItem("RealScoreChecked"), 10);

let guessed_latitude = 0
let real_latitude = 0

if(sessionStorage.getItem("RealScoreTotal") == null) {
    sessionStorage.setItem("RealScoreTotal", 0);
};

if(sessionStorage.getItem("RealScoreChecked") == null) {
    sessionStorage.setItem("RealScoreChecked", 0);
    checked = 0;
};

function debug(obj)
{
    if(DEBUG_ENABLED) console.log(obj)
}

function getLocationObject()
{
    const game_tag = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
    const api_url = "https://www.geoguessr.com/api/v3/games/"+game_tag

    return fetch(api_url)
    .then(res => res.json())
}

function SetDisplayFact()
{
    getLocationObject()
        .then(loc => {

        debug("]real_loc: ")
        debug(loc)
        if ( loc.player.guesses.length == 1 ) sessionStorage.setItem("RealScoreTotal", 0)
        
        real_latitude = loc.rounds[loc.player.guesses.length - 1].lat
        guessed_latitude = loc.player.guesses[loc.player.guesses.length - 1].lat
        setRealScoreInnerHtml();
    })
}

function calculate_real_score()
{
    let f = Math.abs(real_latitude - guessed_latitude)
    if (f <= 1.0001) return 5000.0
    else if (f > 15) return 0
    else return Math.round(5000.0 / f)
}
function setRealScoreInnerHtml()
{
    let score = calculate_real_score()
    sessionStorage.setItem("RealScoreTotal", parseInt(sessionStorage.getItem("RealScoreTotal"), 10) + score)
    let str = `<br><h2 style="color: cyan">REAL SCORE(LatitudeGuessr)</h2><h3 style="font-size: 30px">${score}</h3><hr>` +
        '<div style="color: orange">Guessed Latitude: </div>' + guessed_latitude + "<hr>" +
        '<div style="color: lightgreen">Real Latitude: </div>' + real_latitude + "<hr>"

    debug("calculated " + score)
    debug("total " + sessionStorage.getItem("RealScoreTotal"))
    document.getElementById(_id_realscore).innerHTML = str;
}

// 5 round game round summary div or null
function get5RoundGameSummaryDiv()
{
    let div = document.getElementsByClassName(_class_roundResult_5roundGame);
    if (div.length == 0) return null
    else return div[0]
}
function get5RoundGameSummaryEndDiv()
{
    let div = document.getElementsByClassName(_class_endResult_5roundGame);
    if (div.length == 0) return null
    else return div[0]
}

function set5RoundGameSummaryDivPlaceHolder()
{
    let newDiv1 = document.createElement("div")
    let parent = get5RoundGameSummaryDiv();

    parent.insertBefore(newDiv1, parent.firstElementChild);

    newDiv1.innerHTML = SummaryLoadingPlaceHolderInnerHtml;
}
function set5RoundGameSummaryDivPlaceHolderEnd()
{
    let newDiv1 = document.createElement("div")
    let parent = get5RoundGameSummaryEndDiv();

    parent.insertBefore(newDiv1, parent.firstElementChild);

    newDiv1.innerHTML = `<hr><h2 id="`+_id_realscore+`" style="color: cyan">REAL SCORE TOTAL(LatitudeGuessr)</h2><h3 style="font-size: 30px">${sessionStorage.getItem("RealScoreTotal")}</h3><hr>`;
}

function scoreCheckStateAttempt(newDiv1) {
    if(document.getElementById(_id_realscore) || !isInValidGameLocation()) return

    if (get5RoundGameSummaryDiv()) set5RoundGameSummaryDivPlaceHolder()
    else if (get5RoundGameSummaryEndDiv()) set5RoundGameSummaryDivPlaceHolderEnd()
};

function isInValidGameLocation()
{
    return location.pathname.startsWith("/game/");
}

function isRealScoreAlreadyChecked()
{
    return sessionStorage.getItem(_storage_checked) != 0
}

function scoreCheckState()
{
    if (!!document.querySelector('.result-layout_root__NfX12') && isInValidGameLocation() && !isRealScoreAlreadyChecked()){
        SetDisplayFact();
        checked = checked + 1;
        sessionStorage.setItem(_storage_checked, checked);
    }
    else if (!document.querySelector('.result-layout_root__NfX12') && isInValidGameLocation() && isRealScoreAlreadyChecked()) {
        checked = 0;
        sessionStorage.setItem(_storage_checked, checked)
    };
}

function tryFactCheck()
{
    scoreCheckState();

    setTimeout(scoreCheckState, 250);
    setTimeout(scoreCheckState, 500);
    setTimeout(scoreCheckState, 1200);
    setTimeout(scoreCheckState, 2000);

    setTimeout(scoreCheckStateAttempt,300);
    setTimeout(scoreCheckStateAttempt,500);
    setTimeout(scoreCheckStateAttempt,1200);
    setTimeout(scoreCheckStateAttempt,2000);
};

document.addEventListener('click', tryFactCheck, false);
