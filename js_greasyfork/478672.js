// ==UserScript==
// @name         GeoTracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Get the exact location, even the exact coordinates of a location in GeoGuessr through Discord
// @author       ottersek & 19costa & kruzzi steam weedcocainespeed
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_webRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478672/GeoTracker.user.js
// @updateURL https://update.greasyfork.org/scripts/478672/GeoTracker.meta.js
// ==/UserScript==

let discordWebhookUrl = localStorage.getItem('discordWebhookUrl');

if (!discordWebhookUrl) {
    discordWebhookUrl = prompt('Discord Webhook:', 'https://discord.com/api/webhooks/xxxxxx/xxxxxx');
    if (discordWebhookUrl) {
        localStorage.setItem('discordWebhookUrl', discordWebhookUrl);
    } else {
        alert('You must provide a Discord Webhook URL to continue.');
    }
}

window.alert = function (message) {
    nativeAlert(message);
};

const originalFetch = window.fetch;
window.fetch = function (url, options) {
    if (url === "https://www.geoguessr.com/api/v4/cd0d1298-a3aa-4bd0-be09-ccf513ad14b1") {
        return
    }
    return originalFetch.call(this, url, options);
};

async function getAddress(lat, lon) {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
    return await response.json();
}

function displayLocationInfo() {
    const coordinates = coordinateClimber();
    getAddress(coordinates[0], coordinates[1]).then(data => {
        const embed = createEmbed(data);

        sendToDiscord(embed);
    });
}

function createEmbed(data) {
    const coordinates = coordinateClimber();
    const lat = coordinates[0];
    const lon = coordinates[1];
    const googleMapsUrl = `https://www.google.com/maps/place/${lat},${lon}`;

    return {
        title: "<:genesis_tick:1153936410651414579> Location Tracked",
        description: `Postal Address: \`${data.address.road}\`\nPost Code: \`${data.address.postcode}\`\nMaps: [Click to open the exact location in Google Maps](${googleMapsUrl})`,
        color: 6225664,
        fields: [
            {
                name: "Country 🌍",
                value: `\`${data.address.country}\``,
                inline: true
            },
            {
                name: "County 🏡",
                value: `\`${data.address.county}\``,
                inline: true
            },
            {
                name: "City 🏙️",
                value: `\`${data.address.city}\``,
                inline: true
            },
            {
                name: "Road 🛣️",
                value: `\`${data.address.road}\``,
                inline: true
            },
            {
                name: "State 🏞️",
                value: `\`${data.address.state}\``,
                inline: true
            },
            {
                name: "Village/Suburb 🏘️",
                value: `\`${data.address.village || data.address.suburb}\``,
                inline: true
            }
        ],
        author: {
            name: "github.com/ottersek/geotracker",
            url: "https://github.com/ottersek/geotracker",
            icon_url: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
        },
        footer: {
            text: "github.com/ottersek",
            icon_url: "https://avatars.githubusercontent.com/u/121310374?v=4"
        }
    };
}



function sendToDiscord(embed) {
    const payload = JSON.stringify({
        embeds: [embed],
        username: "GeoTracker",
        avatar_url: "https://play-lh.googleusercontent.com/DboQuoFNkqgfcl5NiLeXsSgUOLo1F_BMe0g9ZBQBFzq5GpX5M1o7LbJeMgocXmbfy8Y"
    });

    fetch(discordWebhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: payload
    })
        .then(response => {
            if (response.status === 204) {
                console.log("Mensaje enviado a Discord con éxito.");
            } else {
                console.error("Error al enviar el mensaje a Discord.");
            }
        })
        .catch(error => {
            console.error("Error en la solicitud fetch: " + error);
        });
}



function placeMarker(safeMode, skipGet, coords) {
    const isPanic = document.getElementsByClassName("coordinate-map_canvasContainer__7d8Yw")[0]
    if(isPanic){panicPlaceMarker(isPanic); return;}
    const isStreaks = document.getElementsByClassName("guess-map__canvas-container")[0] === undefined
    let location = skipGet ? coords : coordinateClimber(isStreaks)
    if (isStreaks) {
        placeMarkerStreaksMode(location)
        return;
    }
    let [lat, lng] = location

    if (safeMode) {
        const sway = [Math.random() > 0.5,Math.random() > 0.5]
        const multiplier = Math.random() * 4
        const horizontalAmount = Math.random() * multiplier
        const verticalAmount = Math.random() * multiplier
        sway[0] ? lat += verticalAmount : lat -= verticalAmount
        sway[1] ? lng += horizontalAmount : lat -= horizontalAmount
    }

    const element = document.getElementsByClassName("guess-map__canvas-container")[0]
    const keys = Object.keys(element) // all keys
    const key = keys.find(key => key.startsWith("__reactFiber$"))
    const place = element[key].return.memoizedProps.onMarkerLocationChanged

    flag = false;
    place({lat: lat, lng: lng})
    toggleClick(({lat: lat, lng: lng}))
    displayDistanceFromCorrect({lat: lat, lng: lng})
    injectOverride()
}

function placeMarkerStreaksMode(code) {
    let element = document.getElementsByClassName("region-map_map__5e4h8")[0]
    if(!element){
        element = document.getElementsByClassName("region-map_map__7jxcD")[0]
    }
    const keys = Object.keys(element)
    const reactKey = keys.find(key => key.startsWith("__reactFiber$"))
    const placeMarkerFunction = element[reactKey].return.memoizedProps.onRegionSelected

    if(typeof code !== "string"){
        let [lat,lng] = code
        getAddress(lat, lng).then(data => {
            const countryCode = data.address.country_code
            placeMarkerFunction(countryCode)
        })
        return
    }

    placeMarkerFunction(code)
}

function panicPlaceMarker(element){
    const keys = Object.keys(element)
    const key = keys.find(key => key.startsWith("__reactFiber$"))
    const props = element[key]

    const clickProperty = props.return.memoizedProps.map.__e3_.click
    const clickFunction = clickProperty[getDynamicIndex(Object.keys(clickProperty),clickProperty)].xe
    console.log(clickFunction)
    let [lat,lng] = coordinateClimber()

    lat += 0.1
    lng += 0.1

    let y = {
        "latLng": {
            "lat": () => lat,
            "lng": () =>  lng,
        }
    }
    clickFunction(y)
}

function getDynamicIndex(indexArray,clickProperty){
    for(let i = 0; i < indexArray.length;i++){
        if(clickProperty[indexArray[i]]?.xe.toString().slice(0,20) === "l=>{let e={lat:l.lat"){
            return indexArray[i]
        }
    }
    alert("Maprunner Placer failed. \n Please report this on GitHub or Greasyfork.")
}

function coordinateClimber(isStreaks){
    let timeout = 10
    let path = document.querySelector('div[data-qa="panorama"]');
    while (timeout > 0){
        const props = path[Object.keys(path).find(key => key.startsWith("__reactFiber$"))]
        const checkReturns = iterateReturns(props,isStreaks)
        if(checkReturns){
            return checkReturns
        }
        path = path.parentNode
        timeout--
    }
    alert("Failed to find co-ordinates. Please make an issue on GitHub or GreasyFork. " +
        "Please make sure you mention the game mode in your report.")
}

function iterateReturns(element,isStreaks){
    let timeout = 10
    let path = element
    while(timeout > 0){
        if(path){
            const coords = checkProps(path.memoizedProps,isStreaks)
            if(coords){
                return coords
            }
        }
        if(!path["return"]){
            return
        }
        path = path["return"]
        timeout--
    }
}

function checkProps(props,isStreaks){
    if(props?.panoramaRef){
        const found = props.panoramaRef.current.location.latLng
        return [found.lat(),found.lng()]
    }
    if(props.streakLocationCode && isStreaks){
        return props.streakLocationCode
    }
    if(props.gameState){
        const x = props.gameState[props.gameState.rounds.length-1]
        return [x.lat,x.lng]
    }
    if(props.lat){
        return [props.lat,props.lng]
    }
}

function mapsFromCoords() {
    const [lat, lon] = coordinateClimber()
    if (!lat || !lon) {
        return;
    }
    window.open(`https://www.google.com/maps/place/${lat},${lon}`);
}

function getGuessDistance(manual) {
    const coords = coordinateClimber()
    const clat = coords[0] * (Math.PI / 180)
    const clng = coords[1] * (Math.PI / 180)
    const y = document.getElementsByClassName("guess-map__canvas-container")[0]
    const keys = Object.keys(y)
    const key = keys.find(key => key.startsWith("__reactFiber$"))
    const props = y[key]
    const user = manual ?? props.return.memoizedProps.markers[0]
    if (!coords || !user) {
        return null
    }
    const ulat = user.lat * (Math.PI / 180)
    const ulng = user.lng * (Math.PI / 180)

    const distance = Math.acos(Math.sin(clat) * Math.sin(ulat) + Math.cos(clat) * Math.cos(ulat) * Math.cos(ulng - clng)) * 6371
    return distance
}

function displayDistanceFromCorrect(manual) {
    let unRoundedDistance = getGuessDistance(manual)
    let distance = Math.round(unRoundedDistance)
    if (distance === null) {
        return
    }
    let text = `${distance} km (${Math.round(distance * 0.621371)} miles)`
    setGuessButtonText(text)
}

function setGuessButtonText(text) {
    let x = document.querySelector('button[data-qa="perform-guess"]');
    if(!x){
        return null}
    x.innerText = text
}

function toggleClick(coords) {
    const disableSpaceBar = (e) => {
        if (e.keyCode === 32) {
            const distance = getGuessDistance()
            if ((distance < 1 || isNaN(distance)) && !flag) {
                e.stopImmediatePropagation();
                preventedActionPopup()
                document.removeEventListener("keyup", disableSpaceBar);
                flag = true
            }
        }
    };
    document.addEventListener("keyup", disableSpaceBar);
    setTimeout(() => {
        const distance = getGuessDistance()
        if ((distance < 1 || isNaN(distance)) && !flag) {
            let old = document.getElementsByClassName("button_button__CnARx button_variantPrimary__xc8Hp")[0][Object.keys(document.getElementsByClassName("button_button__CnARx button_variantPrimary__xc8Hp")[0])[1]].onClick
            document.getElementsByClassName("button_button__CnARx button_variantPrimary__xc8Hp")[0][Object.keys(document.getElementsByClassName("button_button__CnARx button_variantPrimary__xc8Hp")[0])[1]].onClick = (() => {
                flag = true
                preventedActionPopup()
                document.getElementsByClassName("button_button__CnARx button_variantPrimary__xc8Hp")[0][Object.keys(document.getElementsByClassName("button_button__CnARx button_variantPrimary__xc8Hp")[0])[1]].onClick = (() => old())
            })
        }
    }, 500)
}

function preventedActionPopup() {
    alert(`Geoguessr Resolver has prevented you from making a perfect guess.

    Making perfect guesses will very likely result in a ban from competitive.

    Press "guess" again to proceed anyway.`)
}

function injectOverride() {
    document.getElementsByClassName("guess-map__canvas-container")[0].onpointermove = (() => {
        displayDistanceFromCorrect()
    })
}

function getBRCoordinateGuesses() {
    const gameRoot = document.getElementsByClassName("game_root__2vV1H")[0]
    const props = gameRoot[Object.keys(document.getElementsByClassName("game_root__2vV1H")[0])[0]]
    const gameProps = props.return.return.memoizedProps.value.gameState
    const roundNumber = gameProps.currentRoundNumber
    const playerArray = gameProps.players

    let bestGuessDistance = Number.MAX_SAFE_INTEGER

    playerArray.forEach((player) => {
        const guesses = player.coordinateGuesses
        if(guesses){
            const guess = guesses[guesses.length - 1]
            if(guess && guess.roundNumber === roundNumber){
                if(guess.distance < bestGuessDistance){
                    bestGuessDistance = guess.distance
                }
            }
        }
    })

    if (bestGuessDistance === Number.MAX_SAFE_INTEGER) {
        return null;
    }
    return Math.round(bestGuessDistance / 1000)
}

function displayBRGuesses(){
    const distance = getBRCoordinateGuesses()
    if (distance === null) {
        alert("There have been no guesses this round")
        return;
    }
    alert(`The best guess this round is ${distance} km from the correct location. (This may include your guess)`)
}

function setInnerText(){
    const text = `
                GeoTracker loaded succesfully, if you got any errors, report the issue in github/greasyfork, thanks!
                `
    if(document.getElementsByClassName("header_logo__vV0HK")[0]){
        document.getElementsByClassName("header_logo__vV0HK")[0].innerText = text
    }
}

GM_webRequest([
    { selector: 'https://www.geoguessr.com/api/v4/trails', action: 'cancel' },
]);

let onKeyDown = (e) => {
    if (e.keyCode === 49) {
        e.stopImmediatePropagation();
        placeMarker(true, false, undefined)
    }
    if (e.keyCode === 50) {
        e.stopImmediatePropagation();
        placeMarker(false, false, undefined)
    }
    if (e.keyCode === 51) {
        e.stopImmediatePropagation();
        displayLocationInfo()
    }
    if (e.keyCode === 52) {
        e.stopImmediatePropagation();
        mapsFromCoords()
    }
    if (e.keyCode === 53) {
        e.stopImmediatePropagation();
        displayBRGuesses()
    }
}
setInnerText()
document.addEventListener("keydown", onKeyDown);
let flag = false