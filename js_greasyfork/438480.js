// ==UserScript==
// @name         Redirect
// @version      0.1
// @namespace https://triburile.ro
// @description  Redirect between main, recruit, scavenge
// @author       fp
// @include https://*/game.php*screen=main*
// @include https://*/game.php*screen=train*
// @include https://*/game.php*screen=barracks*
// @include https://*/game.php*screen=ranking*
// @include https://*/game.php*screen=map*
// @include https://*/game.php*screen=ally*
// @include https://*/game.php*screen=report*
// @include https://*/game.php*screen=place&mode=scavenge*
// @include https://*/game.php*screen=*
// @downloadURL https://update.greasyfork.org/scripts/438480/Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/438480/Redirect.meta.js
// ==/UserScript==

redirectBetween();

async function redirectBetween() {
    console.log("Started script. Will start to redirect between pages.");
    await timeout(randomSeconds(2, 5)); // wait for 2 seconds

    const LAST_UPDATED_TIME = getFromLocalStorage();
    const TIME_INTERVAL = randomMinutes(10, 15);
    var locations = ["main", "barracks", "place&mode=scavenge"];

    if (LAST_UPDATED_TIME !== null) {
        console.log("Will try to redirect");
        if (Date.parse(new Date()) >= Number(LAST_UPDATED_TIME) + Number(TIME_INTERVAL)) {
            var randomLocation = Number(getLastRedirectedLocation());
            var nextLocation = randomLocation + 1;
            console.log("Redirect to: ", locations[randomLocation]);

            var maxLocations = locations.length-1;
            if(randomLocation < 0 || randomLocation === undefined || randomLocation == null || randomLocation > maxLocations) {
                console.log("random location reached max, will set to 0");
                nextLocation = 0;
                randomLocation = 0;
            }

            updateLocalStorage(nextLocation);
            await timeout(randomSeconds(5, 10));
            redirectTo(locations[randomLocation]);
        } else {
            console.log("Too early to request again");
        }
    } else {
        console.log("Could not find last requested in local storage");
        updateLocalStorage(0);
    }
}

function redirectTo(location) {
    window.location.assign(game_data.link_base_pure + location);
}

function randomMinutes(min, max) {
    return randomSeconds(min, max) * 60;
}

function randomSeconds(min, max) {
    return randomNumber(min, max) * 1000;
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateLocalStorage(nextLocation) {
    localStorage.setItem('last_redirected', Date.parse(new Date()));
    localStorage.setItem('last_redirected_location', nextLocation);
}

function getFromLocalStorage() {
    return localStorage.getItem('last_redirected') ?? 0;
}

function getLastRedirectedLocation() {
    return localStorage.getItem('last_redirected_location') ?? 0;
}