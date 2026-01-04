// ==UserScript==
// @name         Racing Skill Display
// @namespace    https://github.com/sulsay/torn
// @version      1.0.2
// @description  Shows the racing skill of drivers in your race as long as they have this script installed as well
// @author       Sulsay [2173590]
// @match        https://www.torn.com/loader.php?sid=racing*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/404709/Racing%20Skill%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/404709/Racing%20Skill%20Display.meta.js
// ==/UserScript==

const arsonBaseApiUrl = 'https://arsonwarehouse.com/api/v1';
const racingSkillCacheByDriverId = new Map();

(async function () {
    const racingSkillElm = document.querySelector('.skill');
    await saveRacingSkill(getUserIdFromCookie(), '10.0');

    insertRacingSkillsIntoCurrentDriversList();

    // On change race tab, (re-)insert the racing skills if applicable:
    new MutationObserver(insertRacingSkillsIntoCurrentDriversList).observe(document.getElementById('racingAdditionalContainer'), {childList: true});
})();

async function insertRacingSkillsIntoCurrentDriversList() {
    const driversList = document.getElementById('leaderBoard');
    if (driversList === null) {
        return;
    }

    watchForDriversListContentChanges(driversList);

    const racingSkills = await getRacingSkillForDrivers(getDriverIds(driversList));
    for (let driver of driversList.querySelectorAll('.driver-item')) {
        const driverId = getDriverId(driver);
        if (! racingSkills[driverId]) {
            continue;
        }
        const nameDiv = driver.querySelector('.name');
        nameDiv.style.position = 'relative';
        nameDiv.insertAdjacentHTML('beforeend', `<span style="position:absolute;right:5px">${racingSkills[driverId]}</span>`);
    }
}

function watchForDriversListContentChanges(driversList) {
    if (driversList.dataset.hasWatcher !== undefined) {
        return;
    }

    // The content of #leaderBoard is rebuilt periodically so watch for changes:
    new MutationObserver(insertRacingSkillsIntoCurrentDriversList).observe(driversList, {childList: true});
    driversList.dataset.hasWatcher = 'true';
}

function getDriverIds(driversList) {
    return Array.from(driversList.querySelectorAll('.driver-item')).map(driver => getDriverId(driver));
}

function getDriverId(driverUl) {
    return +driverUl.closest('li').id.substr(4);
}

async function getRacingSkillForDrivers(driverIds) {
    const driverIdsToFetchSkillFor = driverIds.filter(driverId => ! racingSkillCacheByDriverId.has(driverId));
    if (driverIdsToFetchSkillFor.length > 0) {
        const skills = await fetchRacingSkillForDrivers(driverIdsToFetchSkillFor);
        for (let [driverId, skill] of Object.entries(skills)) {
            racingSkillCacheByDriverId.set(+driverId, skill);
        }
    }

    const resultHash = {};
    for (let driverId of driverIds) {
        resultHash[driverId] = racingSkillCacheByDriverId.get(driverId);
    }
    return resultHash;
}

function getUserIdFromCookie() {
    const userIdString = document.cookie.split(';')
        .map(entry => entry.trim())
        .find(entry => entry.indexOf('uid=') === 0)
        .replace('uid=', '');

    return parseInt(userIdString, 10);
}

function fetchRacingSkillForDrivers(driverIds) {
    return new Promise(resolve => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${arsonBaseApiUrl}/racing-skills?expect_strings&drivers=${driverIds.join(',')}`,
            onload: ({responseText}) => resolve(JSON.parse(responseText)),
        });
    });
}

function saveRacingSkill(userId, racingSkillString) {
    return new Promise(resolve => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: `${arsonBaseApiUrl}/players/${userId}/racing-skill`,
            data: JSON.stringify({racing_skill: racingSkillString}),
            headers: {'Content-Type': 'application/json'},
            onload: resolve,
        });
    });
}