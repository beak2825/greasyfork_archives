// ==UserScript==
// @name         Randomized Bonus
// @namespace    Deadman_RB
// @version      1.02
// @description  Create randomized bonus games on Warlight.
// @author       Deadman
// @match        https://www.warlight.net/Profile?p=*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/14620/Randomized%20Bonus.user.js
// @updateURL https://update.greasyfork.org/scripts/14620/Randomized%20Bonus.meta.js
// ==/UserScript==

// Compute Player Ids
var idRegex = /p=(\d+)/;
var yourProfileLink = document.evaluate('/html/body/div[1]/span/div/a[2]',
    document, null, XPathResult.ANY_TYPE, null).iterateNext();
var yourId = yourProfileLink.href.match(idRegex)[1];
var opponentId = document.URL.match(idRegex)[1];
if (yourId == opponentId) {
    opponentId = "OpenSeat";
}

// Add text box and button
var levelElement = document.evaluate(
    '//*[@id="MainSiteContent"]/table/tbody/tr[2]/td[2]/table/tbody/tr/td/big',
    document, null, XPathResult.ANY_TYPE, null).iterateNext();
addRandomizedButton(levelElement);

function getSampleGameId() {
    /// <summary>
    /// Gets the sample game Id and checks if it is a number.
    /// </summary>
    /// <returns type="number">Game Id.</returns>
    var gameIdElement = document.getElementById("gameId");
    if (gameIdElement !== undefined) {
        return parseInt(gameIdElement.value, 10);
    }
}

function extractGameSettings() {
    /// <summary>
    /// Extract game settings from the sample game using GameFeed API.
    /// </summary>

    var sampleGameId = getSampleGameId();
    if (isNaN(sampleGameId)) {
        alert("Invalid GameId");
    } else {
        doAsyncRequest("POST",
            'https://www.warlight.net/API/GameFeed?GameID=' +
            sampleGameId.toString() + '&GetHistory=true', {},
            "GameFeed");
    }
}

function setupRandomizedGame(response) {
    /// <summary>
    /// From the GameFeed API response, randomize bonuses and create a game 
    /// using the template.
    /// </summary>
    /// <param name="response" type="string">
    /// The GameFeed API response for the provided sample game.
    /// </param>

    var obj = JSON.parse(response);
    if (obj != undefined) {
        var templateId = obj.templateID;
        var bonuses = [];
        for (var i = 0; i < obj.map.bonuses.length; i++) {
            var bonusObj = obj.map.bonuses[i];
            if (bonusObj.value != 0) {
                var bonus = [];
                var originalBonusValue = parseInt(bonusObj.value, 10);

                // set the bonus value to (original-1, original+1)
                bonus.push(bonusObj.name);
                bonus.push(originalBonusValue - 1);
                bonus.push(originalBonusValue + 1);
                bonuses.push(bonus);
            }
        }
    }
    createGame(templateId, bonuses);
}

function addRandomizedButton(levelElement) {
    /// <summary>
    /// Add a text box(for sample game Id) and a button to create randomized 
    /// game.
    /// </summary>
    /// <param name="levelElement" type="Element">
    /// The parent element if text box and button.
    /// </param>

    var br = document.createElement('br');
    var gameId = document.createElement("input");
    gameId.setAttribute("id", "gameId");
    gameId.setAttribute("type", "text");
    var createButton = document.createElement("input");
    createButton.setAttribute("type", "button");
    createButton.setAttribute("value", "Create Randomized game");
    createButton.onclick = function () {
        var oldValue = createButton.value;
        createButton.setAttribute('disabled', true);
        createButton.value = '...processing...';

        setTimeout(function(){
            createButton.value = oldValue;
            createButton.removeAttribute('disabled');
        }, 1000);
        extractGameSettings();
    };

    // used to store response from GameFeed API
    var hiddenResponse = document.createElement("input");
    hiddenResponse.setAttribute("type", "hidden");
    hiddenResponse.setAttribute("id", "WLresponse");
    hiddenResponse.onchange = function (value) {
        setupRandomizedGame(hiddenResponse.value);
    };
    levelElement.appendChild(br);
    levelElement.appendChild(gameId);
    levelElement.appendChild(createButton);
    levelElement.appendChild(hiddenResponse);
}

function createGame(templateId, bonuses) {
    /// <summary>
    /// Create a game on Warlight between the two players on given settings.
    /// </summary>
    /// <param name="templateId" type="number">
    /// The game template Id.
    /// </param>
    /// <param name="bonuses" type="array">
    /// All bonuses on the map and the range of values they can take.
    /// </param>

    var template = templateId;
    var postDataObject = {
        "gameName": "Randomized bonuses game",
        "personalMessage": "Check bonuses carefully as they may have been altered",
        "templateID": template,
        "players": [{
            "token": yourId,
            "team": "None"
        }, {
            "token": opponentId,
            "team": "None"
        }],
        "overriddenBonuses": []
    };
    if (bonuses !== null) {
        for (var i = 0; i < bonuses.length; i++) {
            var bonusName = bonuses[i][0];
            var min = bonuses[i][1];
            var max = bonuses[i][2];
            postDataObject.overriddenBonuses.push({
                "bonusName": bonusName,
                value: getRandomInt(min, max) // Randomize the bonus
            });
        }
    }
    var response = doAsyncRequest("POST",
        'https://www.warlight.net/API/CreateGame', JSON.stringify(
            postDataObject), "CreateGame");
}

function getRandomInt(min, max) {
    /// <summary>
    /// Pick a random number in the interval (min, max)
    /// </summary>
    /// <param name="min" type="number">
    /// lower bound of number
    /// </param>
    /// <param name="max" type="number">
    /// upper bound of number
    /// </param>
    /// <returns type="number">
    /// Random number in the interval
    /// </returns>

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function doAsyncRequest(method, url, data, api) {
    /// <summary>
    /// Perform an asynchronous request to create a game on Warlight.
    /// </summary>
    /// <param name="method" type="string">
    /// GET/POST
    /// </param>
    /// <param name="url" type="string">
    /// The request url.
    /// </param>
    /// <param name="data" type="dictionary">
    /// Request parameters
    /// </param>
    /// <param name="api" type="string">
    /// Warlight api type
    /// </param>
    GM_xmlhttpRequest({
        method: method,
        url: url,
        data: data,
        onreadystatechange: function (response) {
            if (response.readyState != 4) return;
            if (api === "GameFeed") {
                var hiddenResponse = document.getElementById(
                    "WLresponse");
                hiddenResponse.value = response.responseText;
                hiddenResponse.onchange();
            } else if (api === "CreateGame") {
                var obj = JSON.parse(response.responseText);
                if (obj.gameID !== undefined) {
                    window.open(
                        "https://www.warlight.net/MultiPlayer?GameID=" +
                        obj.gameID, '_parent ');
                } else if (obj.error !== undefined) {f
                    alert("Cannot create game. Warlight says: " +
                        obj.error);
                }
            }
        }
    });
}