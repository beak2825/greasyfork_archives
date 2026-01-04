// ==UserScript==
// @name         GuessPortal
// @include      /^(https?)?(\:)?(\/\/)?([^\/]*\.)?geoguessr\.com($|\/.*)/
// @version      0.0.3
// @description  Display streetview of the guessed location and the correct location after a guess in GeoGuessr. Works in classic rounds, streaks and (with some user input) challenges!
// @author       semihM (aka rhinoooo_)
// @source       https://github.com/semihM/GeoGuessrScripts/blob/main/GuessPortal
// @supportURL   https://github.com/semihM/GeoGuessrScripts/issues
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/851187
// @downloadURL https://update.greasyfork.org/scripts/437407/GuessPortal.user.js
// @updateURL https://update.greasyfork.org/scripts/437407/GuessPortal.meta.js
// ==/UserScript==


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GOOGLE DEVELOPER API KEY : Follow these steps to get an API key (DONT SHOW THIS ON STREAM)

/*
1. Go to https://console.cloud.google.com/projectselector2/google/maps-apis/credentials

2. Create a project (Name and organization doesn't matter)

3. Select the project

4. Click "Create credentials" on top and select API key.

5. The API key created dialog displays your newly created API key.

6. (OPTIONAL) Click "Edit API key" on the left and under "Application restrictions" select "HTTP referrers". Add "https://www.geoguessr.com/" under "Website restrictions" to restrict API key's use to geoguessr

// The new API key is listed on the Credentials page under API keys.

//
// IMPORTANT: After every update(which won't be often), these values will be reset. You can retrive the key from the link in Step 1
//

*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Google Developer key for street view embeds
let GoogleDeveloper_API = 'ENTER_API_KEY_HERE'; //Replace ENTER_API_KEY_HERE by following the instructions above!

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const DEBUG_ENABLED = false // true: Console print enabled for debugging; false: Don't print any debug information

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const API_URL = "https://api.bigdatacloud.net/data/reverse-geocode?localityLanguage=en&"
const GOOGLE_URL = `https://www.google.com/maps/embed/v1/streetview?key=${GoogleDeveloper_API}&heading=0&pitch=0&fov=90&location=`

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const EMPTYAPIKEY = "ENTER_API_KEY_HERE"
const INVALIDLINK = "#";

const _id_streetview_div_guess = "location-guess-streetview"
const _id_streetview_div_correct = "location-correct-streetview"

const _class_roundResult_5roundGame = "result-layout_content__jAHfP"
const _class_roundResult_streakGame = "streak-round-result_root__WxUU9"
const _class_correct_loc = 'styles_circle__2tw8L styles_variantFloating__mawbd styles_colorWhite__2QcUQ styles_borderSizeFactorOne__2Di08'
const _class_score_viewtarget = 'container_content__H3tXS'

const StreetViewPlaceHolderGuess = `<div id="${_id_streetview_div_guess}" align="left" style="cursor:pointer;text-align:center;z-index:99999;color:cyan;background-color:black">Waiting for streetview link...</div>`
const StreetViewPlaceHolderCorrect = `<div id="${_id_streetview_div_correct}" align="right" style="cursor:pointer;text-align:center;z-index:99999;color:lime;background-color:black">Waiting for streetview link...</div>`

const checkerName = "GuessPortalCreated"

let checked = parseInt(sessionStorage.getItem(checkerName), 10);
let facts = []

let placeWikidataTitles = []
let needsWiki = true;

if(sessionStorage.getItem(checkerName) == null) {
    sessionStorage.setItem(checkerName, 0);
    checked = 0;
};

function debug(obj, title)
{
    if(DEBUG_ENABLED && title) console.log("]" + title)

    if(DEBUG_ENABLED) console.log(obj)
}

function setNameToPostal(obj, name)
{
    obj.name = name
    obj.description = name
}

function processAndGetWikidataTitle(data, obj)
{
    let title = data.entities[obj.wikidataId].sitelinks.enwiki.title;

    if ("isPlaceFact" in obj)
    {
        if (placeWikidataTitles.indexOf(title) == -1)
        {
            debug("]place title processed: " + title)
            placeWikidataTitles.push(title)
        }
    }
    else debug("]geographic title processed: " + title)

    return encodeURIComponent(title)
}

async function btnClick(btn) {
    return new Promise(resolve => btn.onclick = () => resolve());
}

function getCorrectLocationDivForChallenge()
{
    return document.querySelector('[alt="Correct location"]').parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
}

// TO-DO Refactor this mess at some point!
async function getLatLng()
{
    const game_tag = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
    const game_endpoint = "https://www.geoguessr.com/api/v3/games/" + game_tag
    const challenge_endpoint = "https://www.geoguessr.com/api/v3/challenges/" + game_tag + "/game"
    let api_url = isInChallange() ? challenge_endpoint : game_endpoint

    return await fetch(api_url)
        .then(res => res.json())
        .then(out => {
        debug(out,"geoAPI")

        let guess_counter = out.player.guesses.length

        let lat = out.rounds[guess_counter-1].lat;
        let lng = out.rounds[guess_counter-1].lng;

        if(out.mode == "streak")
        {
            return {"correct": [lat, lng]};
        }

        return {"guess":[out.player.guesses[guess_counter-1].lat, out.player.guesses[guess_counter-1].lng], "correct": [lat, lng]};
    })
}

// TO-DO Refactor this mess at some point!
async function SetStreetViewButtons()
{
    if (document.getElementById(_id_streetview_div_guess)
       || document.getElementById(_id_streetview_div_correct))
    {
        return
    }

    getLatLng().then(async latlng => {

        let viewSize = 600

        debug(latlng,">>>latlng")
        let maindiv = document.createElement("div");
        let target = getStreetViewDivTarget();
        target.insertBefore(maindiv, target.firstElementChild);

        var webService = new google.maps.StreetViewService()

        /**Check in a perimeter of 1000 meters**/
        let checkaround = 1000;

        /** checkNearestStreetView is a valid callback function **/

        let guesslatlng = null;
        let guess = document.getElementById(_id_streetview_div_guess);
        let i = 0
        while (guess == null && i < 5)
        {
            await new Promise((resolve) => setTimeout(resolve, 500));
            guess = document.getElementById(_id_streetview_div_guess);
            i++;
        }
        if (guess == null)
        {
            console.error("failed to set guess div for portal")
            return;
        }
        if ("guess" in latlng)
        {
            try
            {
                var guessedLocation = new google.maps.LatLng(latlng.guess[0], latlng.guess[1]);
                debug(guessedLocation,"guessedLocation")

                guesslatlng = await webService.getPanoramaByLocation(guessedLocation, checkaround , null);
                debug(guesslatlng, "guesslatlng")

                guesslatlng = [guesslatlng.data.location.latLng.lat(), guesslatlng.data.location.latLng.lng()];
                debug(guesslatlng, "guesslatlng")

                if (guesslatlng)
                {
                    guess.textContent = "GUESSED LOCATION: Click to embed streetview!"
                    guess.onclick = (_) => {
                        debug("]CLICKED GUESS STREETVIEW")
                        let f = document.createElement("iframe");
                        f.src = GOOGLE_URL + guesslatlng[0] + "," + guesslatlng[1]
                        f.id = guess.id
                        f.width = viewSize
                        f.height = viewSize
                        f.style.resize = "both";
                        f.style.overflow = "auto";
                        debug(f)

                        let subdiv = document.createElement("div")
                        let title = document.createElement("h3")
                        let close = document.createElement("h3")

                        close.style.textAlign = "center"
                        close.style.width = viewSize
                        close.style.color = "white"
                        close.style.backgroundColor = "red"
                        close.style.cursor = "pointer"

                        close.textContent = "X"

                        close.onclick = () => subdiv.remove()

                        title.style.color = "cyan"
                        title.style.backgroundColor = "black"
                        title.style.cursor = "grab"

                        title.textContent = "GUESSED LOCATION (Draggable)"

                        subdiv.appendChild(close)
                        subdiv.appendChild(title)
                        subdiv.appendChild(f)

                        subdiv.style = "position: fixed; z-index: 1; top: 20px; left: 10px; background: #eee; overflow-x: hidden; padding: 8px 0;"
                        dragElement(subdiv)

                        maindiv.appendChild(subdiv)

                        guess.style.display = "none"
                    }
                }
                else
                {
                    let subdiv = document.createElement("div")
                    let title = document.createElement("h3")
                    title.textContent = "No streetview found for your guess in "+ checkaround +"meter radius!"
                    title.style = guess.style

                    subdiv.appendChild(title)

                    maindiv.appendChild(subdiv)

                    guess.style.display = "none"
                }
            }
            catch(error)
            {
                debug(error,"ERROR")
                let subdiv = document.createElement("div")
                let title = document.createElement("h3")

                title.textContent = "No streetview found for your guess in "+ checkaround +"meter radius!"
                if (guess != null)
                {
                    title.style = guess.style
                    guess.style.display = "none"
                }

                subdiv.appendChild(title)

                maindiv.appendChild(subdiv)

            }
        }
        else
        {
            guess.style.display = "none"
        }

        let correct = document.getElementById(_id_streetview_div_correct);

        correct.textContent = "CORRECT LOCATION: Click to embed streetview!"
        correct.onclick = (_) => {
            debug("]CLICKED CORRECT STREETVIEW")
            let f = document.createElement("iframe");
            let target = getStreetViewDivTarget();
            f.src = GOOGLE_URL + latlng.correct[0] + "," + latlng.correct[1]
            f.id = correct.id
            f.width = viewSize
            f.height = viewSize
            f.style.resize = "both";
            f.style.overflow = "auto";
            debug(f)

            let subdiv = document.createElement("div")
            let title = document.createElement("h3")
            let close = document.createElement("h3")

            close.style.textAlign = "center"
            close.style.width = viewSize
            close.style.color = "white"
            close.style.backgroundColor = "red"
            close.style.cursor = "pointer"

            close.textContent = "X"

            close.onclick = () => subdiv.remove()

            title.textContent = "CORRECT LOCATION (Draggable)"

            title.style.color = "lime"
            title.style.backgroundColor = "black"
            title.style.cursor = "grab"


            subdiv.appendChild(close)
            subdiv.appendChild(title)
            subdiv.appendChild(f)

            subdiv.style = "position: fixed; z-index: 1; top: 20px; left: 60%; background: #eee; overflow-x: hidden; padding: 8px 0;"
            dragElement(subdiv)

            maindiv.appendChild(subdiv)

            correct.style.display = "none"
        }
    })
}

/////////
//Make the DIV element draggagle:
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
/////////
function getStreetViewDivTarget()
{
    let div = document.getElementsByClassName(_class_score_viewtarget);
    if (div.length == 0) return null
    else return div[0]
}

// 5 round game round summary div or null
function get5RoundGameSummaryDiv()
{
    let div = document.getElementsByClassName(_class_roundResult_5roundGame);
    if (div.length == 0) return null
    else return div[0]
}

function set5RoundGameSummaryDivPlaceHolder()
{
    let guess = document.createElement("div")
    let corect = document.createElement("div")
    let parent = get5RoundGameSummaryDiv();

    parent.insertBefore(guess, parent.firstElementChild);
    parent.insertBefore(corect, parent.firstElementChild);

    guess.innerHTML = StreetViewPlaceHolderGuess;
    guess.style = "position: fixed; z-index: 1; left: 10px; background: #eee; overflow-x: hidden; padding: 8px 0;"
    corect.innerHTML = StreetViewPlaceHolderCorrect;
    corect.style = "position: fixed; z-index: 1; right: 60px; background: #eee; overflow-x: hidden; padding: 8px 0;"
}

// Streak game round summary div or null
function getStreakGameSummaryDiv()
{
    let div = document.getElementsByClassName(_class_roundResult_streakGame);
    if (div.length == 0) return null
    else return div[0]
}

function setStreakGameSummaryDivPlaceHolder()
{
    let guess = document.createElement("div")
    let corect = document.createElement("div")
    let parent = getStreakGameSummaryDiv();

    parent.insertBefore(guess, parent.firstElementChild);
    parent.insertBefore(corect, parent.firstElementChild);

    guess.innerHTML = StreetViewPlaceHolderGuess;
    corect.innerHTML = StreetViewPlaceHolderCorrect;
}

function portalCheckStateAttempt(newDiv1) {
    if((document.getElementById(_id_streetview_div_guess) && document.getElementById(_id_streetview_div_correct)) || !isInValidGameLocation()) return

    if (get5RoundGameSummaryDiv()) set5RoundGameSummaryDivPlaceHolder()
    else if(getStreakGameSummaryDiv()) setStreakGameSummaryDivPlaceHolder()

};

function isInChallange()
{
    return location.pathname.startsWith("/challenge/");
}

function isInValidGameLocation()
{
    return location.pathname.startsWith("/game/") || isInChallange();
}

function isFactAlreadyChecked()
{
    return sessionStorage.getItem(checkerName) != 0
}

let stopTimeouts = false

function portalCheckState()
{
    if (!!document.querySelector('.result-layout_root__NfX12') && isInValidGameLocation() && !isFactAlreadyChecked()){
        SetStreetViewButtons();
        checked = checked + 1;
        sessionStorage.setItem(checkerName, checked);
    }
    else if (!document.querySelector('.result-layout_root__NfX12') && isInValidGameLocation() && isFactAlreadyChecked()) {
        checked = 0;
        sessionStorage.setItem(checkerName, checked)
    };
}

function tryPortalCheck()
{
    portalCheckState();

    setTimeout(portalCheckState, 250);
    setTimeout(portalCheckState, 500);
    setTimeout(portalCheckState, 1200);
    setTimeout(portalCheckState, 2000);

    setTimeout(portalCheckStateAttempt,300);
    setTimeout(portalCheckStateAttempt,500);
    setTimeout(portalCheckStateAttempt,1200);
    setTimeout(portalCheckStateAttempt,2000);
};

document.addEventListener('click', tryPortalCheck, false);
