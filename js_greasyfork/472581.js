// ==UserScript==
// @name         SB-AUI
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  Advanced UI for Starblast with extra features
// @author       Halcyon
// @license      All rights reserved, this code may not be reproduced or used in any way without the express written consent of the author.
// @match        https://starblast.io/
// @icon         https://i.ibb.co/1QgnHfK/aui.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472581/SB-AUI.user.js
// @updateURL https://update.greasyfork.org/scripts/472581/SB-AUI.meta.js
// ==/UserScript==

/**
 * CHANGELOG
 * 1.0.0 - Initial creation. Core of AUI
 * 1.1.0 - Added team evaluation (PBS, PPBS, DPS)
 * 1.2.0 - Optimizations, code cleanup and transition to a component-based system
 * 1.2.1 - More optimizations and code cleanup. Added hardElementRefresh
 * 1.2.2 - Tested component relationships (they work), added loading animations and some debugging
 * 1.2.3 - GreasyFork is begging me to update the version number
 * 1.2.4 - (Mateo) - Added user search
 * 1.2.5 - XSS prevention (username sanitization) and user search results update
 * 1.3.0 - Added prop components - Useful for building elements from a template. Uses custom syntax - ||variable||. Lists transition to prop components still WIP
 * 1.3.1 - Fixed bug regarding number 0 in prop components
 * 1.3.2 - Fixed returnCaret bug
 * 1.3.3 - Lousy fix of modded statusReport
 */

'use strict';

const API_LINK = "https://starblast.dankdmitron.dev/api/simstatus.json";
const CURRENT_RUNNING_VERSION = "1.3.3"

/********* STYLING ************ */

const applyCSS = (styles, element) => {
    if (!element) {
        return;
    }
    for (let key of Object.keys(styles)) {
        try {
            element.style[key] = styles[key]
        } catch (ex) {console.error(`Object.prototype.applyStyles: Cannot apply style '${key}' to ${element}`)}
    }
    return;
}

const applyBaseStyles = (element, includeFont = true) => {
    element.style.boxShadow = "black 0px 0px 0px";
    element.style.textShadow = "black 0px 0px 0px";
    if (includeFont) {
        element.style.fontFamily = `"DM Sans", sans-serif`;
    }
    element.style.fontWeight = "400";
    element.style.background = "#0b0b0b";
    element.style.border = "1px solid #1a1a1a"
    element.style.color = "#FFF";
    element.style.borderRadius = "10px";
    element.classList.add("hover-class");
}

//Remove unneeded UI elements (spotify and socials columns)
let removalQueries = ['[data-translate-base="music"]','[data-translate-base="community"]'];
for (let query of removalQueries) {
    for (let el of document.querySelectorAll(query)) {
        el.style.display = "none"
    }
}

//Setting the AUI logo
try {
    document.querySelector("#logo > img").src = "https://i.ibb.co/t25sFmR/SBAUI.png";
} catch (ex) {
    try {
        setTimeout(() => {
            document.querySelector("#logo > img").src = "https://i.ibb.co/t25sFmR/SBAUI.png";
        }, 500)
    } catch (ex) {
        setTimeout(() => {
            document.querySelector("#logo > img").src = "https://i.ibb.co/t25sFmR/SBAUI.png";
        }, 1000)
    }
}


//Importing DM Sans and Abel
try {
    var styleElement = document.createElement('style');
    var importRule = `
        @import url('https://fonts.googleapis.com/css2?family=Abel&family=DM+Sans:wght@400;500;700&display=swap');
    `;
    styleElement.textContent = importRule;
    document.head.appendChild(styleElement);
    document.addEventListener("DOMContentLoaded", function() {
        var elementsToStyle = document.querySelectorAll("body");

        elementsToStyle.forEach(function(element) {
            element.style.fontFamily = '"DM Sans", sans-serif';
        });
    });
} catch (ex) {}

//All buttons get base styles
for (let el of document.querySelectorAll('button')) {
    applyBaseStyles(el)
}

//Scrollbar code
document.documentElement.style.scrollbarWidth = 'thin';
document.documentElement.style.msOverflowStyle = 'none';
var style = document.createElement('style');
var css = `
/* Webkit and Blink */
::-webkit-scrollbar {
    width: 0.2em;
}
::-webkit-scrollbar-thumb {
    background-color: #1a1a1a;
    border: none;
    border-radius: 0.1em;
}
::-webkit-scrollbar-track {
    background-color: transparent;
    border: none;
}
.noglow-placeholder::placeholder {
    text-shadow: black 0px 0px 0px;
}
/* Firefox */
scrollbar-width: thin;
scrollbar-color: transparent transparent;
`;
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);
document.querySelector("body").style.backgroundColor = "#0b0b0b";


//Overlay styles
applyCSS({
    backgroundColor: "#1a1a1a",
    background: "repeating-linear-gradient(45deg, #1a1a1a 0, #131313 1px, #0b0b0b 0, #0b0b0b 50%)",
    backgroundSize: "10px 10px",
    maxWidth: "calc(100% - 60px)",
    maxHeight: "calc(100% - 60px)",
    margin: "auto auto",
    boxSizing: "content-box",
    boxShadow: "black 0px 0px 0px",
    border: "6px solid #131313",
    outline: "54px solid #0b0b0b",
}, document.querySelector("#overlay"));


//Body styles
document.querySelector("body").style.height = "100dvh";
document.querySelector("body").style.width = "100vw";

//Play button styles
applyCSS({
    fontFamily: `"DM Sans", sans-serif`,
    letterSpacing: "4px",
    fontSize: "2.2rem",
    fontWeight: "600"
}, document.querySelector("#play"))

//Styles
applyCSS({
    background: `transparent`,
    textShadow: `black 0px 0px 0px`,
    fontFamily: `'Abel', sans-serif`,
    fontSize: `1rem`,
    letterSpacing: `0px`,
    marginTop: `5px`,
    marginLeft: `auto`,
    marginRight: `auto`,
    width: `80%`,
    borderTop: `1px solid #1a1a1a`,
    color: `gray`
},document.querySelector("#game_modes"))

//Changelog styles
document.querySelector(".changelog-new").style.fontFamily = `"DM Sans", sans-serif`;


//Tools like "modding" styles (4 buttons)
document.querySelector('.followtools').style.left = '0';
document.querySelector('.followtools').style.width = 'max-content';
document.querySelector('.followtools').style.zIndex = '500';

//Changelog to top
document.querySelector('.bottom-left').style.top = '0';
document.querySelector('.bottom-left').style.height = 'max-content';

//Name input styles
applyCSS({
    background: '#0b0b0b',
    border: '1px solid #1a1a1a',
    fontFamily: 'DM Sans',
    boxShadow: 'black 0px 0px 0px',
    borderRadius: '10px',
},document.querySelector('.inputwrapper'))

//Buttons for switching modes styles
const leftRight = [document.querySelector('#prevMode'),document.querySelector('#nextMode')];
for (let el of leftRight) {
    el.style.color = '#FFFFFF';
    el.style.textShadow = 'black 0px 0px 0px';
}

//Elements to apply baseStyles to
const baseStyleQueries = ['.changelog-new', '#moddingspace', "#donate", "#rankings", "#training"];
for (let query of baseStyleQueries) {
    applyBaseStyles(document.querySelector(query));
}

//Styles for button elements
const ml = ['#moddingspace', "#donate", "#rankings", "#training"]
for (let query of ml) {
    let item = document.querySelector(query);
    item.style.paddingBottom = "0.5rem";
    let icon = document.querySelector(`${query} > i`);
    icon.style.margin = "0.5rem auto 0.5rem auto";
    icon.style.paddingBottom = '0.5rem';
    icon.style.width = '80%';
    icon.style.borderBottom = '1px solid #1a1a1a';
    let span = document.querySelector(`${query} > span`);
    span.style.color = "#FFF";
    span.style.letterSpacing = '1px';
    span.style.textShadow = 'black 0px 0px 0px';
    span.style.fontWeight = '500';
}

for (let el of document.querySelectorAll('.modal')) {
    applyBaseStyles(el);
}

for (let el of document.querySelectorAll('.social i')) {
    applyBaseStyles(el, false);
}
/***********=/STYLING********** */

//Create SL INTEGRATION
var J = document.createElement("div");
J.id = "SL_INTEGRATION";
document.querySelector('#overlay').appendChild(J);

const SL_INTEGRATION = document.querySelector('#SL_INTEGRATION');
applyCSS({
    position: 'absolute',
    height: '100%',
    width: '25%',
    top: '0',
    right: '0',
    display: 'flex',
    flexDirection: 'column'
}, SL_INTEGRATION)

const templateStatusData = () => ({name: "",id: "",team_1: {hue: null,gems: 0,level: 0,potentialOutput: 0,PBS: 0,PPBS: 0,players: []},team_2: {hue: null,gems: 0,level: 0,potentialOutput: 0,PBS: 0,PPBS: 0,players: []},team_3: {hue: null,gems: 0,level: 0,potentialOutput: 0,PBS: 0,PPBS: 0,players: []}})

//All variables used in the components should be declared here
window["COMPONENT_STATE_VALUES"] = {
    listingLoading: true,
    options: {
        activePanel: "listing",
        activeRegion: "europe",
        modes: {
            team: true,
            survival: false,
            deathmatch: false,
            modding: false,
            invasion: false
        }
    },
    userSearch: {
        active: false,
        loading: false,
        input: "",
        results: {},
        systemsQueried: 0,
    },
    filteredSystems: [],
    statusReportActive: false,
    statusReportLoading: false,
    isUpdateAvailable: false,
    statusReportData: {
        name: "",
        id: "",
        mode: "",
        team_1: {
            hue: null,
            gems: 0,
            level: 0,
            potentialOutput: 0,
            PBS: 0,
            PPBS: 0,
            players: []
        },
        team_2: {
            hue: null,
            gems: 0,
            level: 0,
            potentialOutput: 0,
            PBS: 0,
            PPBS: 0,
            players: []
        },
        team_3: {
            hue: null,
            gems: 0,
            level: 0,
            potentialOutput: 0,
            PBS: 0,
            PPBS: 0,
            players: []
        }
    }
}

//Component class for easier maintaining. NOTE: All components must have only 1 parent element and components should be named using PascalCase
class Component {
    /**
     * AUI HTML component. Make sure there is a wrapping parent element.
     * @param {String} ID - ID of the element
     * @param {Function} HTML - Function that returns a template string representing innerHTML. Note that any conditions put on the wrapper element itself will never reflect upon using .refreshElement(), to reflect those changes use .hardRefreshElement()
     */
    constructor(ID, HTML) {
        this.ID = ID
        this.HTML = HTML
    }

    evaluate() {
        if (typeof this.HTML === 'function') {
            return this.HTML();
        } else {throw new Error(`Component class error: Second argument in Component instantiation is not a function ('${typeof this.HTML}'). ${typeof this.HTML === 'string' && "Hint: Put '() =>' before your template literal"}`)}
    }

    /**
     * Evaluates element with props object. The ID is not included in build elements and they cannot be refreshed
     * @param {Object} props - Props object is used to "build" elements. Its useful for displaying sets of data. A prop from the props object should be used inside the string between |||| tags like so: ||propName||
     * @returns {innerHTML}
     */
    buildElement(props = {}) {
        let processedHTML = this.evaluate();
        processedHTML = processedHTML.replace(/\|\|([^|]+)\|\|/g, (match, variableName) => {
            if (!props.hasOwnProperty(variableName)) {
                console.error(`Component class error: ${variableName} not defined in props object`);
                return match
            }
            return props[variableName] ?? match;
        });
        return processedHTML
    }

    /**
     * Evaluates the HTML
     * @returns {innerHTML}
     */
    getElement() {
        const tempContainer = document.createElement("span");
        tempContainer.innerHTML = this.evaluate();
        tempContainer.children[0].setAttribute("id", `${this.ID}`)
        if (tempContainer.children.length > 1) {
            throw new Error(`Component class error: Components must have a parent element (Component ID: ${this.ID})`)
        }

        return tempContainer.innerHTML;
    }

    /**
     * Re-evaluated the HTML excluding the parent element
     */
    refreshElement() {
        //console.log(`Component refreshed: ${this.ID}`)
        try {
            let tempElement = document.createElement("span");
            tempElement.innerHTML = this.evaluate();
            document.querySelector(`#${this.ID}`).innerHTML = tempElement.children[0].innerHTML;
        } catch (ex) {console.error(`Couldn't refresh element with the ID of '${this.ID}': ` + ex)}
    }

    /**
     * Re-evaluates the HTML including the parent element
     */
    hardRefreshElement() {
        try {
            let tempElement = document.createElement("span");
            tempElement.innerHTML = this.evaluate();
            tempElement.children[0].setAttribute("id", `${this.ID}`);
            document.querySelector(`#${this.ID}`).outerHTML = tempElement.innerHTML;
        } catch (ex) {console.error(`Couldn't hardRefresh element with the ID of '${this.ID}': ` + ex)}
    }
}


let API_TIMER = setInterval(async () => {
    if (COMPONENT_STATE_VALUES.options.activePanel !== 'listing') {
        return;
    }
    if (COMPONENT_STATE_VALUES.userSearch.input) {
        return;
    }
    let raw = await(await fetch(API_LINK)).json();
    COMPONENT_STATE_VALUES.listingLoading = false;
    let allSystems = [];
    for (let item of raw) {
        if (item.modding) {
            if (!COMPONENT_STATE_VALUES.options.modes.modding) {
                continue;
            }
        }
        if (item.location.toLowerCase() !== COMPONENT_STATE_VALUES.options.activeRegion) {
            continue;
        }
        for (let system of item.systems) {
            if (COMPONENT_STATE_VALUES.options.modes[system.mode]) {
                allSystems.push({
                    ...system,
                    IP_ADDR: item.address
                });
            }
        }
    }
    COMPONENT_STATE_VALUES.filteredSystems = allSystems.sort((a, b) => a.time - b.time);
    if (isFocused(document.querySelector('#user-search'))) {
        Listing.refreshElement();
        returnCaret();
    } else {
        Listing.refreshElement();
    }
}, 3200)

const returnCaret = () => {
        //The three lines below are necessary because of refresh resetting the caret on input
    document.querySelector('#user-search').focus()
    document.querySelector('#user-search').value = "";
    document.querySelector('#user-search').value = COMPONENT_STATE_VALUES.userSearch.input
}

const isFocused = (element) => document.activeElement === element;

let STATUS_TIMER = null;
window.statusReport = async (query) => {
    if (STATUS_TIMER) {return};
    COMPONENT_STATE_VALUES.statusReportActive = true;
    COMPONENT_STATE_VALUES.statusReportLoading = true;
    StatusReportModal.hardRefreshElement();
    STATUS_TIMER = setInterval(async () => {
        let raw = await (await fetch(`https://starblast.dankdmitron.dev/api/status/${query}`)).json();
        if (COMPONENT_STATE_VALUES.statusReportLoading) {
            COMPONENT_STATE_VALUES.statusReportLoading = false;
        }
        COMPONENT_STATE_VALUES.statusReportData = templateStatusData();
        COMPONENT_STATE_VALUES.statusReportData.name = raw.name;
        COMPONENT_STATE_VALUES.statusReportData.id = query.split('@')[0];
        COMPONENT_STATE_VALUES.statusReportData.mode = raw.mode.id;
            for (let key of Object.keys(raw.players)) {
                let player = raw.players[key];
                COMPONENT_STATE_VALUES.statusReportData[`team_${player.friendly + 1}`].players.push({
                    name: player.player_name,
                    ecp: !!player.custom,
                    score: player.score,
                    type: player.type,
                    PBS: calculatePlayerScore(player.type, !!player.custom)
                })
                COMPONENT_STATE_VALUES.statusReportData[`team_${player.friendly + 1}`].hue = player.hue;
            }
        try {
            for (let team of raw.mode.teams) {
                for (let num of ["team_1", "team_2", "team_3"]) {
                    if (team.hue === COMPONENT_STATE_VALUES.statusReportData[num].hue) {
                        COMPONENT_STATE_VALUES.statusReportData[num].gems = team.crystals;
                        COMPONENT_STATE_VALUES.statusReportData[num].level = team.level;
                        break
                    }
                }
            }
        } catch (ex) {console.log(ex)}
        for (let team of ["team_1", "team_2", "team_3"]) {
            let sPBS = 0, sPPBS = 0, potentialOutput = 0;
            for (let i = 0; i < COMPONENT_STATE_VALUES.statusReportData[team].players.length; i++) {
                sPBS += Number(COMPONENT_STATE_VALUES.statusReportData[team].players[i].PBS.currentScore);
                sPPBS += Number(COMPONENT_STATE_VALUES.statusReportData[team].players[i].PBS.potentialScore);
                potentialOutput += COMPONENT_STATE_VALUES.statusReportData[team].players[i].PBS.energyOutput;
            }
            COMPONENT_STATE_VALUES.statusReportData[team].PBS = sPBS.toFixed(2);
            COMPONENT_STATE_VALUES.statusReportData[team].PPBS = sPPBS.toFixed(2);
            COMPONENT_STATE_VALUES.statusReportData[team].potentialOutput = potentialOutput;
            COMPONENT_STATE_VALUES.statusReportData[team].players = COMPONENT_STATE_VALUES.statusReportData[team].players.sort((a, b) => a.score - b.score).reverse();
        }
        StatusReportModal.refreshElement();
    }, 2500)
}

//These functions are attached to the window so listeners have access to them (Tampermonkey quirk)
window.switchActivePanel = (panel) => {
    COMPONENT_STATE_VALUES.options.activePanel = panel;
    ListingOrSettings.refreshElement();
    Settings.hardRefreshElement();
    Listing.hardRefreshElement();
}
window.switchActiveRegion = (region) => {
    COMPONENT_STATE_VALUES.options.activeRegion = region;
    Settings.refreshElement();
}
window.toggleMode = (mode) => {
    COMPONENT_STATE_VALUES.options.modes[mode] = !COMPONENT_STATE_VALUES.options.modes[mode];
    console.log(COMPONENT_STATE_VALUES.options)
    Settings.refreshElement();
}
window.closeStatusReport = () => {
    COMPONENT_STATE_VALUES.statusReportActive = false;
    clearInterval(STATUS_TIMER);
    STATUS_TIMER = null;
    StatusReportModal.hardRefreshElement();
}

let USER_QUERY_TIMER = null
window.handleSearch = () => {
    COMPONENT_STATE_VALUES.userSearch.input = document.querySelector("#user-search").value;
    clearTimeout(USER_QUERY_TIMER);
    if (!COMPONENT_STATE_VALUES.userSearch.input) {
        Listing.refreshElement();
        return COMPONENT_STATE_VALUES.userSearch.loading = false;
    }
    if (!COMPONENT_STATE_VALUES.userSearch.loading) {
        COMPONENT_STATE_VALUES.userSearch.loading = true;
        Listing.refreshElement();
        returnCaret();
    }
    USER_QUERY_TIMER = setTimeout(async () => {
        //https://starblast.dankdmitron.dev/api/status/${query}`
        COMPONENT_STATE_VALUES.userSearch.systemsQueried = 0;
        let playersList = [], mostSimilar = [];
        for (let system of COMPONENT_STATE_VALUES.filteredSystems) {
            try {
                let query = `${system.id}@${system.IP_ADDR}`
                let raw = await (await fetch(`https://starblast.dankdmitron.dev/api/status/${query}`)).json()
                for (let key of Object.keys(raw.players)) {
                    let player = raw.players[key]
                    playersList.push({name: player.player_name, query: query});
                }
                if (COMPONENT_STATE_VALUES.userSearch.systemsQueried < COMPONENT_STATE_VALUES.filteredSystems.length) {
                    COMPONENT_STATE_VALUES.userSearch.systemsQueried++;
                }
            } catch (ex) {console.log(ex)}
        }
        for (let player of playersList) {
            let similarity = calculateSimilarity(player.name).toFixed(2)
            if (similarity > 25) {
                mostSimilar.push({
                    name: player.name,
                    similarity: similarity,
                    query: player.query
                })
            }
        }
        COMPONENT_STATE_VALUES.userSearch.results = mostSimilar.sort((a, b) => a.similarity - b.similarity).reverse();
        COMPONENT_STATE_VALUES.userSearch.loading = false;
        Listing.refreshElement();
        returnCaret();
    }, 300)
}
document.querySelector('#play').addEventListener('click', () => {
    clearInterval(API_TIMER);
    clearInterval(STATUS_TIMER);
    SL_INTEGRATION.style.display = 'none';
});

//WARNING: refreshSL is a SLOW function. Use it only when absolutely neccessary.
const refreshSL = () => {
    SL_INTEGRATION.innerHTML = `
        ${StatusReportModal.getElement()}
        ${TitleAndCredits.getElement()}
        ${ListingOrSettings.getElement()}
        ${Listing.getElement()}
        ${Settings.getElement()}
    `
}

//COMPONENTS GO BELOW
let ListingOrSettings = new Component("SL_OPTIONS_WRAPPER", () => `<div id="SL_OPTIONS_WRAPPER" style="height:4%; width:100%;display: flex;">
<div id="SL_LISTING_REF" onclick="window.switchActivePanel('listing')"
    style="${COMPONENT_STATE_VALUES.options.activePanel == 'listing' ? "background-color: #FFFFFF; color: #0b0b0b; fill: #0b0b0b;" : "background-color: #1a1a1a; color: #FFFFFF; fill: #FFFFFF;"}border-top-left-radius: 0.25vw; border-top-right-radius: 0.25vw;display: grid; place-items: center; font-size: 0.8vw; font-family: 'DM Sans',sans-serif;width:50%;font-weight: 500;cursor:pointer;">
    LISTING
</div>
<div id="SL_SETTINGS_REF" onclick="window.switchActivePanel('settings')"
    style="${COMPONENT_STATE_VALUES.options.activePanel == 'settings' ? "background-color: #FFFFFF; color: #0b0b0b; fill: #0b0b0b;" : "background-color: #1a1a1a; color: #FFFFFF; fill: #FFFFFF;"}border-top-left-radius: 0.25vw; border-top-right-radius: 0.25vw;display: grid; place-items: center; font-size: 0.8vw; font-family: 'DM Sans',sans-serif;width:50%;font-weight: 500;cursor:pointer;">
    SETTINGS
</div>
</div>`)

let TitleAndCredits = new Component("TitleAndCredits", () => `<div style="height:10%;width:100%;">
    <div style="font-family: 'DM Sans', sans-serif;font-weight: 600;font-size: 1.3vw;text-align:right;width:100%;color:white">
        ${COMPONENT_STATE_VALUES.isUpdateAvailable ? `<a style="text-decoration:none;background-color:#Ff3931;font-weight:700;color:#0b0b0b">Update available</a>` : ""} Starblast AUI v${CURRENT_RUNNING_VERSION}
    </div>
    <div style="font-family:'Abel', sans-serif; font-weight: 300; font-size: 0.9vw; text-align: right; width: 100%; color: gray;">
        API (<a style="color:rgb(191,191,191)" href="https://starblast.dankdmitron.dev/" target="_blank"><u>Serverlist+</u></a>): <span style="color: white; font-weight: bold">dankdmitron</span>
    </div>
    <div style="font-family:'Abel', sans-serif; font-weight: 300; font-size: 0.9vw; text-align: right; width: 100%; color: gray;">
        Design and integration: <span style="color: white; font-weight: bold">Halcyon</span>
    </div>
</div>`)

let Settings = new Component("SLSettings", () => `<div id="SL_SETTINGS" style="box-sizing:border-box;padding:0.6vw;height:86%;width:100%;display: ${COMPONENT_STATE_VALUES.options.activePanel == "settings" ? "flex" : "none"}; flex-direction: column; gap: 0.2rem; overflow-y: auto;background-color:#0b0b0b;border:1px solid #1a1a1a;justify-content: flex-start;align-items:flex-end;">
<div style="text-align:right;color:white;">
    <div style="font-family:'DM Sans',sans-serif;font-size:1.5vw;margin-bottom:0.5vh;">
        REGION:
    </div>
    <div style="color:gray;font-family: 'Abel',sans-serif;font-size:1vw;display:flex;gap:0.5vw;justify-content:end;align-items:center;fill:#FFFFFF;">
        <div>Europe</div>
        ${
            COMPONENT_STATE_VALUES.options.activeRegion == "europe"
            ?
            `<svg xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="M480-294q78 0 132-54t54-132q0-78-54-132t-132-54q-78 0-132 54t-54 132q0 78 54 132t132 54Zm0 214q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg>`
            :
            `<svg xmlns="http://www.w3.org/2000/svg" onclick="window.switchActiveRegion('europe')" height="1vw" viewBox="0 -960 960 960"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg>`
        }
    </div>
    <div style="color:gray;font-family: 'Abel',sans-serif;font-size:1vw;display:flex;gap:0.5vw;justify-content:end;align-items:center;fill:#FFFFFF;">
        <div>America</div>
        ${
            COMPONENT_STATE_VALUES.options.activeRegion == "america"
            ?
            `<svg xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="M480-294q78 0 132-54t54-132q0-78-54-132t-132-54q-78 0-132 54t-54 132q0 78 54 132t132 54Zm0 214q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg>`
            :
            `<svg xmlns="http://www.w3.org/2000/svg" onclick="window.switchActiveRegion('america')" height="1vw" viewBox="0 -960 960 960"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg>`
        }
    </div>
    <div style="color:gray;font-family: 'Abel',sans-serif;font-size:1vw;display:flex;gap:0.5vw;justify-content:end;align-items:center;fill:#FFFFFF;">
        <div>Asia</div>
        ${
            COMPONENT_STATE_VALUES.options.activeRegion == "asia"
            ?
            `<svg xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="M480-294q78 0 132-54t54-132q0-78-54-132t-132-54q-78 0-132 54t-54 132q0 78 54 132t132 54Zm0 214q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg>`
            :
            `<svg xmlns="http://www.w3.org/2000/svg" onclick="window.switchActiveRegion('asia')" height="1vw" viewBox="0 -960 960 960"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg>`
        }
    </div>
</div>
<div style="text-align:right;color:white;">
    <div style="font-family:'DM Sans',sans-serif;font-size:1.5vw;margin-bottom:0.5vh;margin-top:2vh;">
        MODE:
    </div>
    <div style="color:gray;font-family: 'Abel',sans-serif;font-size:1vw;display:flex;gap:0.5vw;justify-content:end;align-items:center;fill:#FFFFFF;">
        <div>Team Mode</div>
        ${
            COMPONENT_STATE_VALUES.options.modes.team
            ?
            `<svg onclick="window.toggleMode('team')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="m419-321 289-289-43-43-246 246-119-119-43 43 162 162ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z"/></svg>`
            :
            `<svg onclick="window.toggleMode('team')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z"/></svg>`
        }
    </div>
    <div style="color:gray;font-family: 'Abel',sans-serif;font-size:1vw;display:flex;gap:0.5vw;justify-content:end;align-items:center;fill:#FFFFFF;">
        <div>Survival</div>
        ${
            COMPONENT_STATE_VALUES.options.modes.survival
            ?
            `<svg onclick="window.toggleMode('survival')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="m419-321 289-289-43-43-246 246-119-119-43 43 162 162ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z"/></svg>`
            :
            `<svg onclick="window.toggleMode('survival')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z"/></svg>`
        }
    </div>
    <div style="color:gray;font-family: 'Abel',sans-serif;font-size:1vw;display:flex;gap:0.5vw;justify-content:end;align-items:center;fill:#FFFFFF;">
        <div>Deathmatch</div>
        ${
            COMPONENT_STATE_VALUES.options.modes.deathmatch
            ?
            `<svg onclick="window.toggleMode('deathmatch')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="m419-321 289-289-43-43-246 246-119-119-43 43 162 162ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z"/></svg>`
            :
            `<svg onclick="window.toggleMode('deathmatch')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z"/></svg>`
        }
    </div>
    <div style="color:gray;font-family: 'Abel',sans-serif;font-size:1vw;display:flex;gap:0.5vw;justify-content:end;align-items:center;fill:#FFFFFF;">
        <div>Modded</div>
        ${
            COMPONENT_STATE_VALUES.options.modes.modding
            ?
            `<svg onclick="window.toggleMode('modding')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="m419-321 289-289-43-43-246 246-119-119-43 43 162 162ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z"/></svg>`
            :
            `<svg onclick="window.toggleMode('modding')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z"/></svg>`
        }
    </div>
    <div style="color:gray;font-family: 'Abel',sans-serif;font-size:1vw;display:flex;gap:0.5vw;justify-content:end;align-items:center;fill:#FFFFFF;">
        <div>Invasion</div>
        ${
            COMPONENT_STATE_VALUES.options.modes.invasion
            ?
            `<svg onclick="window.toggleMode('invasion')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="m419-321 289-289-43-43-246 246-119-119-43 43 162 162ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z"/></svg>`
            :
            `<svg onclick="window.toggleMode('invasion')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z"/></svg>`
        }
    </div>
</div>
</div>`)

let Listing = new Component("ServerListing", () => `
    <div id="SL_LISTING" style="box-sizing:border-box;overflow-x:hidden;padding:0.6vw;height:86%;width:100%;display: ${COMPONENT_STATE_VALUES.options.activePanel == "listing" ? "flex" : "none"}; flex-direction: column; overflow-y: auto;background-color:#0b0b0b;border:1px solid #1a1a1a">
        ${
            COMPONENT_STATE_VALUES.listingLoading
            ?
            `${LoadingAnimation.getElement()}`
            :
            `
            ${
                COMPONENT_STATE_VALUES.filteredSystems.length === 0
                ?
                ""
                :
                `
                <input id="user-search" autofocus value="${COMPONENT_STATE_VALUES.userSearch.input}" oninput="window.handleSearch()" class="noglow-placeholder" placeholder="Search user in queried servers" style="width:100%; height:2.5vh; padding:0.3vh 0 0.3vh 0; font-family: 'Abel', sans-serif; color: white; border: 1px solid #1a1a1a; outline: 0; background: #0b0b0b; text-shadow: black 0px 0px 0px; border-radius: 5px; font-size: 1.6vh;  margin-bottom: 1vh; text-indent: 0.5vw"></input>
                ${
                    COMPONENT_STATE_VALUES.userSearch.input
                    ?
                    `
                        ${
                            COMPONENT_STATE_VALUES.userSearch.loading
                            ?
                            `${LoadingAnimation.getElement()}`
                            :
                            `
                            <div style="display:flex;height:2.2vh; padding:0.3vh 0 0.3vh 0;border-bottom: 1px solid #1a1a1a; font-family: 'Abel', sans-serif; color: #444444; outline: 0; background: #0b0b0b; text-shadow: black 0px 0px 0px; font-size: 1.4vh;  margin-bottom: 0.7vh;">
                                <div style="width:33.3%">NAME</div>
                                <div style="width:33.3%">SIMILARITY</div>
                                <div style="width:33.3%">SERVER</div>
                            </div>
                            ${
                                COMPONENT_STATE_VALUES.userSearch.results.length === 0
                                ?
                                `
                                <div style="width:100%;display:flex;flex-direction:column;font-family: 'Abel',sans-serif;color:#444444;text-shadow: black 0px 0px 0px;">
                                    <div style="font-size:4.2vh;margin-top:1vh;">(⌐■_■)</div>
                                    <div style="font-size:1.9vh"><br>All clear!<br>"${COMPONENT_STATE_VALUES.userSearch.input}" yields no users with a similarity match over 25%<br>Try selecting more servers (e.g. modding, survival)</div>
                                </div>
                                `
                                :
                                `
                                ${
                                    COMPONENT_STATE_VALUES.userSearch.results.map((item, index) => PlayerQueryDisplay.buildElement({
                                            username: sanitizeUsername(item.name),
                                            similarity: item.similarity,
                                            query: item.query,
                                            similarityColor: getColorFromValue(Number(item.similarity))
                                        })
                                    ).join('')
                                }
                                <div style="width:100%;display:flex;flex-direction:column;font-family: 'Abel',sans-serif;color:#444444;text-shadow: black 0px 0px 0px;margin-top:1vh">
                                    <div style="font-size:1.9vh;text-align:center">${COMPONENT_STATE_VALUES.userSearch.results.length} results<br>${COMPONENT_STATE_VALUES.userSearch.systemsQueried} / ${COMPONENT_STATE_VALUES.filteredSystems.length} systems queried</div>
                                </div>
                                `
                            }
                            `
                        }
                    `
                    :
                    `
                    ${
                        COMPONENT_STATE_VALUES.filteredSystems.map(system => SystemDisplay.buildElement({
                            id: system.id,
                            ip: system.IP_ADDR,
                            name: system.name,
                            mode: system.mode === 'modding' ? capitalize(system.mod_id) : capitalize(system.mode),
                            time: ~~(system.time / 60),
                            players: system.players
                        })).join('')
                    }
                    `
                }
                `
            }
            `
        }
</div>`)

let SystemDisplay = new Component('SystemDisplay', () => `
<div onclick="window.statusReport('||id||@||ip||')" style="width:100%; cursor: pointer; min-height:8.5vh; margin-bottom: 0.9vh; border-radius:12px; border: 1px solid #1a1a1a; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly;box-sizing:border-box;padding:0.4vh">
    <div style="font-family:'DM Sans',sans-serif;color:white;font-weight:600;font-size:1.4vw;">
        ||name||
    </div>
    <div style="width:82%;height:1px;background-color:#1a1a1a"></div>
    <div style="width:92%;display:flex;align-items:center;justify-content:space-between;color:gray;font-family:'Abel',sans-serif;font-size:0.8vw;position:relative;">
        <div>
            ||mode||
        </div>
        <div style="position:absolute;top:0;left:0;width:100%;text-align:center;">
            ||time|| min
        </div>
        <div>
            ||players|| players
        </div>
    </div>
</div>
`)

let PlayerQueryDisplay = new Component("PQD", () => `
<div style="display:flex;height:2vh;font-weight:600;padding:0.1vh 0 0.1vh 0; font-family: 'Abel', sans-serif; color: white;outline: 0; background: #0b0b0b; text-shadow: black 0px 0px 0px; border-radius: 5px; font-size: 1.6vh;  margin-bottom: 0.7vh;">
    <div style="width:33.3%;max-width:33.3%;text-overflow:ellipsis;white-space:nowrap">||username||</div>
    <div style="width:33.3%;color: ||similarityColor||">||similarity||%</div>
    <div style="width:33.3%;display:flex;justify-content:center">
        <svg onclick="window.statusReport('||query||')" xmlns="http://www.w3.org/2000/svg" style="height:100%;aspect-ratio: 1 / 1; fill: white; cursor: pointer;" viewBox="0 -960 960 960"><path d="M440-220q125 0 212.5-87.5T740-520q0-125-87.5-212.5T440-820q-125 0-212.5 87.5T140-520q0 125 87.5 212.5T440-220Zm0-300Zm0 160q-83 0-147.5-44.5T200-520q28-70 92.5-115T440-680q82 0 146.5 45T680-520q-29 71-93.5 115.5T440-360Zm0-60q55 0 101-26.5t72-73.5q-26-46-72-73t-101-27q-56 0-102 27t-72 73q26 47 72 73.5T440-420Zm0-50q20 0 35-14.5t15-35.5q0-20-15-35t-35-15q-21 0-35.5 15T390-520q0 21 14.5 35.5T440-470Zm0 310q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T80-520q0-74 28.5-139.5t77-114.5q48.5-49 114-77.5T440-880q74 0 139.5 28.5T694-774q49 49 77.5 114.5T800-520q0 67-22.5 126T715-287l164 165-42 42-165-165q-48 40-107 62.5T440-160Z"/></svg>
    </div>
</div>`)

let StatusReportModal = new Component("StatusReportModal", () => `
<div style="position:fixed; top:0; left:0; width: 100%; height: 100%; display: ${COMPONENT_STATE_VALUES.statusReportActive ? "grid" : "none"}; place-items:center; z-index: 999; background: rgba(0,0,0,0.4)">
    <div style="padding:1vw;display:flex;flex-direction:column;align-items:center;background:#0b0b0b;border:1px solid #1a1a1a;border-radius:12px;${COMPONENT_STATE_VALUES.statusReportLoading ? "justify-content:center" : ""}">
        ${
            COMPONENT_STATE_VALUES.statusReportLoading
            ?
            `${LoadingAnimation.getElement()}`
            :
            `
            <div style="height:3vh; border-bottom: 1px solid #1a1a1a; width:50vw; color: white; font-family: 'DM Sans',sans-serif; font-size: 1.7vw; display: flex; justify-content: space-between; fill: white; align-items: center; padding-bottom: 2vh">
                <div>${COMPONENT_STATE_VALUES.statusReportData.name}</div>
                <div style="display:flex;gap:1vw;align-items:center;">
                    <a target="_blank" href="https://starblast.io/#${COMPONENT_STATE_VALUES.statusReportData.id}">
                        <div style="height:1.4vw;display:grid;place-items:center;font-weight:400;font-size:1vw;border:1px solid white;border-radius:0.2vw;padding:0.4vw 1vw 0.4vw 1vw;color:white;">
                            JOIN
                        </div>
                    </a>
                    <svg onclick="window.closeStatusReport()" style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg" height="2.5vh" viewBox="0 -960 960 960"><path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/></svg>
                </div>
            </div>
            <div style="display:flex;height:55vh;width: 100%; margin-top: 2vh;justify-content:space-between;">
                ${
                    (() => {
                        let arr = [];
                        for (let CUR_TEAM of ["team_1", "team_2", "team_3"]) {
                            arr.push(`
                            <div style="width:30%;height:100%;overflow-y: auto; display: flex; flex-direction: column; justify-content: flex-start; align-items: center">
                                <div style="margin-bottom: 1vh;border-radius: 0.25vw;font-size:1.9vw;border:1px solid hsla(${COMPONENT_STATE_VALUES.statusReportData[CUR_TEAM].hue}, 100%, 50%, 1); background-color: hsla(${COMPONENT_STATE_VALUES.statusReportData[CUR_TEAM].hue}, 100%, 50%, 0.25); color: hsla(${COMPONENT_STATE_VALUES.statusReportData[CUR_TEAM].hue}, 100%, 50%, 1); width:80%;padding: 1vh 0 1vh 0; font-family: 'DM Sans',sans-serif; font-weight: 600; text-align: center;">
                                    ${hueToColorName(COMPONENT_STATE_VALUES.statusReportData[CUR_TEAM].hue)}
                                </div>
                                <div style="width:100%;margin: 1vh 0 1vh 0; padding-bottom:1vh;border-bottom: 1px solid #1a1a1a;">
                                    <div style="font-family:'Abel',sans-serif;font-size:0.8vw;display:flex;width:100%;justify-content:space-between">
                                        <div style="color:gray">Player count</div>
                                        <div style="color:white">${COMPONENT_STATE_VALUES.statusReportData[CUR_TEAM].players.length}</div>
                                    </div>
                                    <div style="font-family:'Abel',sans-serif;font-size:0.8vw;display:flex;width:100%;justify-content:space-between">
                                        <div style="color:gray">Gems</div>
                                        <div style="color:white">${COMPONENT_STATE_VALUES.statusReportData[CUR_TEAM].gems}</div>
                                    </div>
                                    <div style="font-family:'Abel',sans-serif;font-size:0.8vw;display:flex;width:100%;justify-content:space-between">
                                        <div style="color:gray">Level</div>
                                        <div style="color:white">${COMPONENT_STATE_VALUES.statusReportData[CUR_TEAM].level}</div>
                                    </div>
                                    <div style="font-family:'Abel',sans-serif;font-size:0.8vw;display:flex;width:100%;justify-content:space-between;font-weight:500;">
                                        <div style="color:gray">Playerbase strength score</div>
                                        <div style="color:#A4D8D8;font-weight:bold;">${COMPONENT_STATE_VALUES.statusReportData[CUR_TEAM].PBS}</div>
                                    </div>
                                    <div style="font-family:'Abel',sans-serif;font-size:0.8vw;display:flex;width:100%;justify-content:space-between;font-weight:500;">
                                        <div style="color:gray">Potential playerbase strength score</div>
                                        <div style="color:#F49AC2;font-weight:bold;">${COMPONENT_STATE_VALUES.statusReportData[CUR_TEAM].PPBS}</div>
                                    </div>
                                    <div style="font-family:'Abel',sans-serif;font-size:0.8vw;display:flex;width:100%;justify-content:space-between;font-weight:500;">
                                        <div style="color:gray">Maximum damage output (DPS)</div>
                                        <div style="color:#FDFD96;font-weight:bold;">${COMPONENT_STATE_VALUES.statusReportData[CUR_TEAM].potentialOutput}</div>
                                    </div>
                                </div>
                                <div style="height:max-content;width:100%;display:flex;justify-content:space-between;color:gray;font-family:'Abel',sans-serif;font-size:0.8vw;padding-bottom:0.5vh;border-bottom:1px solid #1a1a1a;margin-bottom: 0.5vh">
                                    <div>ECP | NAME</div>
                                    <div>SCORE | SHIP</div>
                                </div>
                                ${
                                    COMPONENT_STATE_VALUES.statusReportData[CUR_TEAM].players.length === 0
                                    ?
                                    ""
                                    :
                                    COMPONENT_STATE_VALUES.statusReportData[CUR_TEAM].players.map(player => {
                                        return `
                                            <div style="height:max-content;margin-bottom:0.3vh;display:flex;width:100%;height:1vw">
                                                <div style="width:10%;height:100%;display:grid;place-items:center;">
                                                    <div style="height:60%; aspect-ratio: 1 / 1; border-radius:9999px; background: ${player.ecp ? "#37dd37" : "#Ff3931"}"></div>
                                                </div>
                                                <div style="width:90%;height:100%;display:flex;justify-content:space-between;font-family:'Abel',sans-serif;font-size:0.8vw;color:white;">
                                                    <div>${sanitizeUsername(player.name)}</div>
                                                    <div style="display:flex">${player.score ? player.score : "•"}&nbsp;<img style="height:0.8vw;aspect-ratio: 1 / 1;object-fit:contain;" src="${SHIP_LINKS.find(url => url.endsWith(`/${player.type}.png`))}"/></div>
                                                </div>
                                            </div>
                                        `
                                    }).join('')
                                }
                        </div>
                        ${CUR_TEAM !== "team_3" ? `<div style="height:100%;width:1px;background-color:#1a1a1a"></div>` : ""}`)
                        }
                        return arr.join('')
                    })()
                }
            </div>
            `
        }

    </div>
</div>`)

let LoadingAnimation = new Component("LoadingAnimation", () => `<svg style="height:4.8vh; aspect-ratio: 1 / 1" viewBox="0 0 100 100">
<g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="6">
    <!-- left line -->
    <path d="M 21 40 V 59">
        <animateTransform
  attributeName="transform"
  attributeType="XML"
  type="rotate"
  values="0 21 59; 180 21 59"
  dur="2s"
  repeatCount="indefinite" />
    </path>
    <!-- right line -->
    <path d="M 79 40 V 59">
        <animateTransform
  attributeName="transform"
  attributeType="XML"
  type="rotate"
  values="0 79 59; -180 79 59"
  dur="2s"
  repeatCount="indefinite" />
    </path>
    <!-- top line -->
    <path d="M 50 21 V 40">
        <animate
  attributeName="d"
  values="M 50 21 V 40; M 50 59 V 40"
  dur="2s"
  repeatCount="indefinite" />
    </path>
    <!-- btm line -->
    <path d="M 50 60 V 79">
        <animate
  attributeName="d"
  values="M 50 60 V 79; M 50 98 V 79"
  dur="2s"
  repeatCount="indefinite" />
    </path>
    <!-- top box -->
    <path d="M 50 21 L 79 40 L 50 60 L 21 40 Z">
    <animate
  attributeName="stroke"
  values="rgba(255,255,255,1); rgba(100,100,100,0)"
  dur="2s"
  repeatCount="indefinite" />
    </path>
    <!-- mid box -->
    <path d="M 50 40 L 79 59 L 50 79 L 21 59 Z"/>
    <!-- btm box -->
    <path d="M 50 59 L 79 78 L 50 98 L 21 78 Z">
    <animate
  attributeName="stroke"
  values="rgba(100,100,100,0); rgba(255,255,255,1)"
  dur="2s"
  repeatCount="indefinite" />
    </path>
    <animateTransform
  attributeName="transform"
  attributeType="XML"
  type="translate"
  values="0 0; 0 -19"
  dur="2s"
  repeatCount="indefinite" />
</g>
</svg>`)



//FUNCTIONS NOT RELEVANT TO MANIPULATING THE DOM GO BELOW
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const hueToColorName = (hue) => {
    const colorMap = [
      { hueRange: [0, 15], colorName: 'Red' },
      { hueRange: [15, 45], colorName: 'Orange' },
      { hueRange: [45, 75], colorName: 'Yellow' },
      { hueRange: [75, 150], colorName: 'Green' },
      { hueRange: [150, 195], colorName: 'Cyan' },
      { hueRange: [195, 285], colorName: 'Blue' },
      { hueRange: [285, 330], colorName: 'Magenta' },
      { hueRange: [330, 360], colorName: 'Red' }
    ];
    const matchedColor = colorMap.find(entry => hue >= entry.hueRange[0] && hue < entry.hueRange[1]);
    return matchedColor ? matchedColor.colorName : 'Undefined';
}



const POTENTIAL = {
    //          ECP    NON-ECP
    odyssey:   [2.5,   1.5],
    x3:        [1.7,   1  ],
    bastion:   [1.4,   0.4],
    aries:     [1  ,   0.3],
    barracuda: [1.75,  0.3],
}
const buildItem = (ecp = 0, nonecp = 0, eregen = 0, potential = 0) => ({ecp, nonecp, eregen, potential});
const SHIP_TABLE = {
    // The numbers on this table need massive improvement
    /**
     * ECP - Points when player is ecp
     * NONECP - Obvious
     * POTENTIAL - Highest points the player can achieve with current path (e.g 2.5 for an ecp playing furystar)
     * EREGEN - Obvious
    */
    //               ECP   NON-ECP    E-REGEN    POTENTIAL
    // Tier 7
    "701": buildItem(2.5 , 1.5,       150,       POTENTIAL.odyssey),
    "702": buildItem(1.7 , 1  ,       50 ,       POTENTIAL.x3),
    "703": buildItem(1.4 , 0.4,       100,       POTENTIAL.bastion),
    "704": buildItem(1   , 0.3,       175,       POTENTIAL.aries),
    // Tier 6
    "601": buildItem(1.2 , 0.5,       60 ,       POTENTIAL.odyssey),
    "602": buildItem(1.2 , 0.45,      50 ,       POTENTIAL.odyssey),
    "603": buildItem(0.9 , 0.25,      40 ,       POTENTIAL.x3),
    "604": buildItem(0.5 , 0.25,      48 ,       POTENTIAL.x3),
    "605": buildItem(0.9 , 0.25,      45 ,       POTENTIAL.x3),
    "606": buildItem(0.9 , 0.2 ,      45 ,       POTENTIAL.x3),
    "607": buildItem(1.75, 0.3 ,      0  ,       POTENTIAL.barracuda),
    "608": buildItem(0.5 , 0.2 ,      40 ,       POTENTIAL.bastion),
    // Tier 5
    "501": buildItem(1.05, 0.45,      60 ,       POTENTIAL.odyssey),
    "502": buildItem(0.75, 0.3,       40 ,       POTENTIAL.odyssey),
    "503": buildItem(0.2 , 0.1,       50 ,       POTENTIAL.x3),
    "504": buildItem(0.3 , 0.15,      45 ,       POTENTIAL.x3),
    "505": buildItem(0.1 , 0.05,      29 ,       POTENTIAL.x3),
    "506": buildItem(0.9 , 0.5,       50 ,       POTENTIAL.barracuda),
    "507": buildItem(0.15, 0.1,       35 ,       POTENTIAL.barracuda),
    // Tier 4
    "401": buildItem(0.3 , 0.05 ,     35  ,      POTENTIAL.odyssey),
    "402": buildItem(0.55, 0.25 ,     50  ,      POTENTIAL.odyssey),
    "403": buildItem(0.4 , 0.2  ,     55  ,      POTENTIAL.x3),
    "404": buildItem(0.3 , 0.15 ,     40  ,      POTENTIAL.x3),
    "405": buildItem(0.3 , 0.1  ,     30  ,      POTENTIAL.x3),
    "406": buildItem(0.05, 0    ,     25  ,      POTENTIAL.barracuda),
    // Tier 3
    "301": buildItem(0.2 , 0.07 ,     30  ,      POTENTIAL.odyssey),
    "302": buildItem(0.17, 0.05 ,     35  ,      POTENTIAL.x3),
    "303": buildItem(0.05, 0    ,     16  ,      POTENTIAL.x3),
    "304": buildItem(0.15, 0.05 ,     25  ,      POTENTIAL.barracuda),
    // Tier 2
    "201": buildItem(0.05, 0    ,     25  ,      POTENTIAL.odyssey),
    "202": buildItem(0.02, 0    ,     20  ,      POTENTIAL.x3),
    // Fly
    "101": buildItem(0   , 0    ,     10  ,      [0,0]),
}

const calculatePlayerScore = (type, ecp) => {
    if (COMPONENT_STATE_VALUES.statusReportData.mode !== "team") {
        return {
            currentScore: 0, potentialScore: 0, energyOutput: 0
        }
    }
    return {
        currentScore: (Number(String(type).split('')[0]) / 15) + SHIP_TABLE[String(type)][ecp ? "ecp" : "nonecp"],
        potentialScore: (7 / 15) + SHIP_TABLE[String(type)]["potential"][+!ecp], // +!ecp is: First ecp is converted into a boolean and then inverted using !, then turned into a number using +, resulting in index 0 for ecp=true
        energyOutput: SHIP_TABLE[String(type)]["eregen"]
    }
}

const calculateSimilarity = (query) => {
    const referenceString = COMPONENT_STATE_VALUES.userSearch.input.toUpperCase();

    const maxLength = Math.max(query.length, referenceString.length);
    const distance = levenshteinDistance(query, referenceString);

    const similarityPercentage = ((maxLength - distance) / maxLength) * 100;
    return similarityPercentage;
}

const levenshteinDistance = (str1, str2) => {
    const matrix = [];

    for (let i = 0; i <= str1.length; i++) {
        matrix[i] = [i];
        for (let j = 1; j <= str2.length; j++) {
            if (i === 0) {
                matrix[i][j] = j;
            } else {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1, // Deletion
                    matrix[i][j - 1] + 1, // Insertion
                    matrix[i - 1][j - 1] + cost // Substitution
                );
            }
        }
    }

    return matrix[str1.length][str2.length];
}

const sanitizeUsername = (username) => {
    const sanitizedUsername = username
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");

    return sanitizedUsername;
}

const lerpColor = (color1, color2, t) => {
    const r = Math.round(color1.r * (1 - t) + color2.r * t);
    const g = Math.round(color1.g * (1 - t) + color2.g * t);
    const b = Math.round(color1.b * (1 - t) + color2.b * t);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

const getColorFromValue = (value) => {
    const color1 = { r: 255, g: 57, b: 49 }; // #Ff3931
    const color2 = { r: 55, g: 221, b: 55 }; // #37dd37
    const t = value / 100; // Normalize the value
    const interpolatedColor = lerpColor(color1, color2, t);
    return interpolatedColor;
}

const SHIP_LINKS = [
    "https://i.ibb.co/6gjB0Y9/504.png",
    "https://i.ibb.co/h1BWddj/505.png",
    "https://i.ibb.co/ZG2wQtk/506.png",
    "https://i.ibb.co/ZxY43kc/507.png",
    "https://i.ibb.co/f8zzwcS/601.png",
    "https://i.ibb.co/hXgqvHQ/602.png",
    "https://i.ibb.co/HxNmSPY/603.png",
    "https://i.ibb.co/DVZrPT7/604.png",
    "https://i.ibb.co/w6jZfmK/605.png",
    "https://i.ibb.co/p4qBj2k/606.png",
    "https://i.ibb.co/4fjJcBC/607.png",
    "https://i.ibb.co/wYMGzCs/608.png",
    "https://i.ibb.co/ZNmcHfC/701.png",
    "https://i.ibb.co/JWZFqVv/702.png",
    "https://i.ibb.co/X2w682R/703.png",
    "https://i.ibb.co/RQrfMGW/704.png",
    "https://i.ibb.co/s3YVpVW/101.png",
    "https://i.ibb.co/w7GFPR5/201.png",
    "https://i.ibb.co/4JsJz8G/202.png",
    "https://i.ibb.co/Pz0xp1s/301.png",
    "https://i.ibb.co/M7PWNz7/302.png",
    "https://i.ibb.co/4ZKStWk/303.png",
    "https://i.ibb.co/df72XT8/304.png",
    "https://i.ibb.co/VM2kJgD/401.png",
    "https://i.ibb.co/8g6qgBw/402.png",
    "https://i.ibb.co/HnqK41P/403.png",
    "https://i.ibb.co/s2grnKB/404.png",
    "https://i.ibb.co/cvj9FWz/405.png",
    "https://i.ibb.co/64fsKPt/406.png",
    "https://i.ibb.co/27fLBPx/501.png",
    "https://i.ibb.co/3SfYGZX/502.png",
    "https://i.ibb.co/9pJt735/503.png"
]


//This runs the SL integration. Do not touch
refreshSL();



// CODE BELOW IS A DISABLED UPDATE CHECKER RESERVED FOR FUTURE USE
/*;(async () => {
    //Update checker
    console.log("CHECKING FOR UPDATES")
    GM.xmlHttpRequest({
        method: "GET",
        url: "https://greasyfork.org/vite/assets/application-043a6a93.js",
        responseType: "text", // Specify that the response is expected to be text (HTML)
        onload: function(response) {
            // response.responseText contains the fetched HTML content
            console.log(response.responseText);
        },
        onerror: function(error) {
            console.error(error);
        }
    });
    let temp = document.createElement('span');
    let raw = await (await (GM.xmlHttpRequest('https://greasyfork.org/en/scripts/472581-sb-aui'))).text();
    temp.innerHTML = raw;
    let target = temp.querySelector('#script-stats > dd.script-show-version > span').textContent;
    console.log(target)
    if (target !== CURRENT_RUNNING_VERSION) {
        COMPONENT_STATE_VALUES.isUpdateAvailable = true;
        TitleAndCredits.refreshElement();
    }
})();*/