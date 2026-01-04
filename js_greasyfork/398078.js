// ==UserScript==
// @name         Auto Select Car
// @namespace    https://greasyfork.org/en/scripts/398078-auto-select-car
// @version      1.4
// @description  Keeps a record of which car you want to use for each racetrack and removes every other car from the selection menu.
// @author       Cryosis7 [926640]
// @match        https://www.torn.com/loader.php?sid=racing
// @downloadURL https://update.greasyfork.org/scripts/398078/Auto%20Select%20Car.user.js
// @updateURL https://update.greasyfork.org/scripts/398078/Auto%20Select%20Car.meta.js
// ==/UserScript==

/**
 * Car stats are used to distinguish between the different cars.
 * Only requires the name field, which can be a substring (NSX, LFA etc.)
 * The qualifiers like 'top speed' are used to differeniate between different versions of the same model car (Dirt NSX vs Tarmac NSX)
 */
const cars = {
    'Ferrari458_TarmacLong3': { 'name': 'Ferrari 458' },
    'LexusLFA_TarmacLong3': { 'name': 'LFA', 'Top Speed': '260' },
    'HondaNSX_TarmacShort3': { 'name': 'NSX', 'Top Speed': '242', 'Brake Dist': '72' },
    'HondaNSX_DirtShort3': { 'name': 'NSX', 'Top Speed': '240', 'Brake Dist': '72' },
    'ReliantRobin': { 'name': 'Reliant Robin' }
};

/**
 * Used for mapping the race-track to the car you want to race.
 * To have multiple cars show, wrap them in an array like so: (Don't forget the commas)
 * 'Docks': [cars.LexusLFA_TarmacLong3, cars.ReliantRobin],
 */
const car_track_mappings = {
    'Docks': [cars.LexusLFA_TarmacLong3, cars.ReliantRobin],
    'Uptown': cars.LexusLFA_TarmacLong3,
    'Withdrawal': cars.LexusLFA_TarmacLong3,
    'Speedway': cars.LexusLFA_TarmacLong3,
    'Convict': cars.LexusLFA_TarmacLong3,
    'Meltdown': cars.HondaNSX_TarmacShort3,
    'Industrial': cars.HondaNSX_TarmacShort3,
    'Vector': cars.HondaNSX_TarmacShort3,
    'Underdog': cars.HondaNSX_TarmacShort3,
    'Commerce': cars.HondaNSX_TarmacShort3,
    'Sewage': cars.HondaNSX_TarmacShort3,
    'Mudpit': cars.HondaNSX_DirtShort3,
    'Two Islands': cars.HondaNSX_DirtShort3,
    'Stone Park': cars.HondaNSX_DirtShort3,
    'Parkland': cars.HondaNSX_DirtShort3,
    'Hammerhead': cars.HondaNSX_DirtShort3
};

/**
 * This can be used to help configure when you want the auto-selector to run.
 */
const CONFIG = {
    'ENABLED_ON_OFFICIAL': true,
    'ENABLED_ON_CUSTOM': true
}

// Creates the observer when the page loads.
$(() => createObserver());

/**
 * Creates an observer that watches to see when the player tries to change their car.
 */
function createObserver() {
    const raceContainer = $('#racingAdditionalContainer')[0];
    var observer = new MutationObserver(function(mutations) {
        for (let mutation of mutations) {
            if ($(mutation.addedNodes).find('ul.enlist-list') && checkEnabled())
                filterCars($(mutation.addedNodes).find('ul.enlist-list').children())
        }
    });

    observer.observe(raceContainer, { childList: true });
}

/**
 * Goes through the list of cars, checking them against the criteria.
 * If the car does not meet the criteria, the car is hidden.
 * @param {The selector for the list of cars.} carList 
 */
function filterCars(carList) {
    var racetrack = $('div.enlist-wrap:contains("Current race") div.enlisted-btn-wrap:contains(" - ")').text().trim().split(' - ')[0];
    var desiredCarArray = Array.isArray(car_track_mappings[racetrack]) ? car_track_mappings[racetrack] : [car_track_mappings[racetrack]];

    $(carList).each((index, element) => {
        let carIsPermitted = false; // Whether this car(element on page) matches any cars in the list of permitted cars.        

        for (let validCar of desiredCarArray) { // loops through every car that is permitted.
            let carMatchesValidCar = false; // For testing if the car element matches the permitted car

            for (let stat in validCar) {
                if (stat === 'name')
                    carMatchesValidCar = scrubText($(element).find('.remove-info')[0].innerText).includes(scrubText(validCar.name))
                else {
                    let carStats = scrubText($(element).find('.enlisted-stat')[0].innerText);
                    if (carStats.includes(scrubText(stat))) {
                        if (!carStats.split(scrubText(stat))[1].startsWith(scrubText(validCar[stat])))
                            carMatchesValidCar = false;
                    }
                }

                if (!carMatchesValidCar) break;
            }

            carIsPermitted = carIsPermitted || carMatchesValidCar;
        }
        if (!carIsPermitted) $(element).hide()
    });
}

/**
 * Generic method to clean up text for comparisons.
 * @param {Text to be scrubbed} text 
 */
function scrubText(text) {
    return text.toLowerCase().replace(/[^a-z0-9]*/g, '');
}

/**
 * Helper function that checks the config to see if the script is enabled for the current race
 */
function checkEnabled() {
    if ($('div.enlisted-btn-wrap:contains("Official race")').length && CONFIG.ENABLED_ON_OFFICIAL)
        return true;
    else if ($('div.enlisted-btn-wrap:contains(" - "):not(:contains("Official race"))').length &&
        CONFIG.ENABLED_ON_CUSTOM)
        return true;

    return false;
}