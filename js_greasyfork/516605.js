// ==UserScript==
// @name         UpsRankedMiniProfile - SayedSharon
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Display ranked war status in mini profile.
// @author       Upsilon [3212478]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at  document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516605/UpsRankedMiniProfile%20-%20SayedSharon.user.js
// @updateURL https://update.greasyfork.org/scripts/516605/UpsRankedMiniProfile%20-%20SayedSharon.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Delay between APIs calls (in minutes)
    let delay = 10;

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector))
                return resolve(document.querySelector(selector));

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    const originalFetch = window.fetch;
    window.fetch = async function () {
        const url = arguments[0];
        if (url.includes("page.php")) {
            return originalFetch.apply(this, arguments).then(function (response) {
                const clonedResponse = response.clone();
                clonedResponse.text().then(function (text) {
                    try {
                        let jsonResponse = JSON.parse(text);
                        if (!jsonResponse['user']['userID'])
                            return;
                        createMiniProfile(jsonResponse);
                    } catch (e) {
                    }
                });
                return response;
            });
        }

        return originalFetch.apply(this, arguments);
    };

    function createMiniProfile(userInfo) {
        let userId = userInfo['user']['userID'];
        let faction;
        for (let i = 0; i < userInfo['icons'].length; i++) {
            if (userInfo['icons'][i]['type'] === "Faction") {
                faction = userInfo['icons'][i]['description'].split(' ').slice(2).join(' ');
                break;
            }
        }
        let factionId = userInfo['user']['faction']['id'];
        waitForElm(`#mini-button0-profile-${userId}`).then((elm) => {
            let parent = elm.parentElement.parentElement.parentElement.parentElement.parentElement;
            let top = `${parseInt(parent.style.top || 0) - 30}px`;
            let left = `${parseInt(parent.style.left || 0)}px`;
            let maxHeight = `${parseInt(getComputedStyle(parent).maxHeight) + 34}px`;
            let minHeight= `${parseInt(getComputedStyle(parent).minHeight) + 34}px`;
            parent.style = `top: ${top}; max-height: ${maxHeight}; min-height: ${minHeight}; left: ${left}`;
            let button = document.createElement("div");

            button.style = `width: 238px; height: 34px; text-align: center`;
            button.id = "rankedWarButton";
            button.classList.add("profile-button");
            elm.parentElement.appendChild(button);
            displayRankedWar(factionId, button).then(r => (e) => {});
        });
    }

    function updateTime(spanDate, data) {
        let now = Math.round(Date.now() / 1000);
        let distance = now - data.war.start;

        if (data.war.end !== 0) {
            spanDate.innerHTML = `War ended`;
            return;
        }
        let days = Math.floor(distance / (60 * 60 * 24)).toString().padStart(2, '0');
        let hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60)).toString().padStart(2, '0');
        let minutes = Math.floor((distance % (60 * 60)) / 60).toString().padStart(2, '0');
        let seconds = (distance % 60).toString().padStart(2, '0');

        spanDate.innerHTML = `${days}:${hours}:${minutes}:${seconds}`;
    }

    function generateDisplay(button, data) {
        let factionIds = Object.keys(data.factions);
        let text = document.createElement("span");
        let spanDate = document.createElement("span");
        let score = Math.abs(data["factions"][factionIds[0]]["score"] - data["factions"][factionIds[1]]["score"]);
        text.innerHTML = `${data.factions[factionIds[0]].name} vs ${data.factions[factionIds[1]].name} <br> Lead score :  ${score} / ${data.war.target} <br>`;
        button.appendChild(text);
        button.appendChild(spanDate);
        updateTime(spanDate, data);
        setInterval(() => updateTime(spanDate, data), 1000);
    }

    function getRankedWarData() {
        let upsScripts = getLocalStorage();
        let now = new Date().getTime();
        let lastModified = upsScripts["RankedMiniProfile"] ? upsScripts["RankedMiniProfile"]["lastModified"] : 0;
        if (now - lastModified < delay * 60 * 1000 && upsScripts["publicApiKey"] !== undefined && upsScripts["publicApiKey"] !== null) {
            return Promise.resolve(upsScripts["RankedMiniProfile"]["warList"]);
        } else {
            if (!upsScripts["publicApiKey"]) {
                let apiKey = prompt("Please enter your public API key");
                setLocalStorageItem("publicApiKey", apiKey);
            }
            return fetchRankedWar().then(data => {
                if (data["error"] || data === undefined) {
                    setLocalStorageItem("RankedMiniProfile", {
                        lastModified: 0,
                        warList: []
                    });
                }
                setLocalStorageItem("RankedMiniProfile", {
                    lastModified: now,
                    warList: data
                });
                return data;
            });
        }
    }

    async function displayRankedWar(factionId, button) {
        let data = await getRankedWarData();
        let result;
        for (let rankedwars in data) {
            for (let id in data[rankedwars].factions) {
                if (id === factionId.toString()) {
                    result = data[rankedwars];
                }
            }
        }
        if (!result)
            return;
        generateDisplay(button, result);
    }

    function getLocalStorage() {
        let upsScripts = localStorage.getItem("upscript");
        if (localStorage.getItem("upscript") === null) {
            localStorage.setItem("upscript", JSON.stringify({}));
            return 0;
        }
        return JSON.parse(upsScripts);
    }

    // Set localStorage stored value for time
    function setLocalStorageItem(key, value) {
        let storedData = localStorage.getItem("upscript");
        if (storedData === null) {
            storedData = {};
        } else {
            storedData = JSON.parse(storedData);
        }
        storedData[key] = value;
        localStorage.setItem("upscript", JSON.stringify(storedData));
    }

    async function fetchRankedWar() {
        let upsScripts = getLocalStorage();
        let apiKey = upsScripts["publicApiKey"];
        try {
            let response = await fetch(`https://api.torn.com/torn/?key=${apiKey}&selections=rankedwars`, {
                method: "GET"
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let data = await response.json();
            if (data["error"] || !data.rankedwars) {
                apiKey = prompt("There has been an issue with your API key. Please enter your public API key");
                setLocalStorageItem("publicApiKey", apiKey);
            }else {
                return data.rankedwars;
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
})();
