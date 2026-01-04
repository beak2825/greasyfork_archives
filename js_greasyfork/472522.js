// ==UserScript==
// @name         SB-AUI
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Advanced UI for Starblast with extra features
// @author       Halcyon
// @license      All rights reserved, this code may not be reproduced or used in any way without the express written consent of the author.
// @match        https://starblast.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=starblast.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472522/SB-AUI.user.js
// @updateURL https://update.greasyfork.org/scripts/472522/SB-AUI.meta.js
// ==/UserScript==

const API_LINK = "https://starblast.dankdmitron.dev/api/simstatus.json";
const ACCENT_COLOR = "#00b97d", BG_COLOR = "#1a1a1a";





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
}

const applyStyles = (styles, element) => {
    if (!element) {
        return;
    }
    if (!styles) {
        return;
    }
    for (let key of Object.keys(styles)) {
        try {
            element.style[key] = styles[key]
        } catch (ex) {console.error(`applyStyles: Cannot apply style '${key}' to ${element}`)}
    }
    return;
}

'use strict';

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

for (let el of document.querySelectorAll('button')) {
    applyBaseStyles(el)
}

//document.querySelector("body").style.backgroundImage = "url(https://www.wallpaperflare.com/static/760/797/225/galaxy-space-stars-universe-wallpaper.jpg)";
document.querySelector("body").style.backgroundColor = "#0b0b0b";

let overlayStyles = {
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
};
applyStyles(overlayStyles, document.querySelector("#overlay"));


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
document.querySelector("body").style.height = "100dvh";
document.querySelector("body").style.width = "100vw";
document.querySelector("#play").style.fontFamily = `"DM Sans", sans-serif`;
document.querySelector("#play").style.letterSpacing = "4px"
document.querySelector("#play").style.fontSize = "2.2rem"
document.querySelector("#play").style.fontWeight = "600";
document.querySelector("#game_modes").style.background = `transparent`;
document.querySelector("#game_modes").style.textShadow = `black 0px 0px 0px`;
document.querySelector("#game_modes").style.fontFamily = `'Abel', sans-serif`;
document.querySelector("#game_modes").style.fontSize = `1rem`;
document.querySelector("#game_modes").style.letterSpacing = `0px`;
document.querySelector("#game_modes").style.marginTop = `5px`;
document.querySelector("#game_modes").style.marginLeft = `auto`;
document.querySelector("#game_modes").style.marginRight = `auto`;
document.querySelector("#game_modes").style.width = `80%`;
document.querySelector("#game_modes").style.borderTop = `1px solid #1a1a1a`;

document.querySelector("#game_modes").style.color = `gray`;
document.querySelector(".changelog-new").style.fontFamily = `"DM Sans", sans-serif`;

let removalQueries = ['[data-translate-base="music"]','[data-translate-base="community"]'];
for (let query of removalQueries) {
    for (let el of document.querySelectorAll(query)) {
        el.style.display = "none"
    }
}
//followtools bottom-left
document.querySelector('.followtools').style.left = '0';
document.querySelector('.followtools').style.width = 'max-content';
document.querySelector('.followtools').style.zIndex = '500';
document.querySelector('.bottom-left').style.top = '0';
document.querySelector('.bottom-left').style.height = 'max-content';
document.querySelector('.inputwrapper').style.background = '#0b0b0b';
document.querySelector('.inputwrapper').style.border = '1px solid #1a1a1a';
document.querySelector('.inputwrapper').style.fontFamily = 'DM Sans';
document.querySelector('.inputwrapper').style.boxShadow = 'black 0px 0px 0px';
document.querySelector('.inputwrapper').style.borderRadius = '10px';


const leftRight = [document.querySelector('#prevMode'),document.querySelector('#nextMode')];
for (let el of leftRight) {
    el.style.color = '#FFFFFF';
    el.style.textShadow = 'black 0px 0px 0px';
}

const baseStyleQueries = ['.changelog-new', '#moddingspace', "#donate", "#rankings", "#training"];
for (let query of baseStyleQueries) {
    applyBaseStyles(document.querySelector(query));
}

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

var J = document.createElement("div");

J.id = "SL_INTEGRATION";

document.querySelector('#overlay').appendChild(J);

const SL_INTEGRATION = document.querySelector('#SL_INTEGRATION');

let styles = {
    position: 'absolute',
    height: '100%',
    width: '25%',
    top: '0',
    right: '0',
    display: 'flex',
    flexDirection: 'column'
}

for (let key of Object.keys(styles)) {
    SL_INTEGRATION.style[key] = styles[key]
}


let options = {
    activePanel: "listing",
    activeRegion: "europe",
    modes: {
        team: true,
        survival: false,
        deathmatch: false,
        modded: false,
        invasion: false
    }
};
let filteredSystems = [];
let statusReportActive = false;

let statusReportData = {
    name: "",
    team_1: {
        hue: null,
        players: []
    },
    team_2: {
        hue: null,
        players: []
    },
    team_3: {
        hue: null,
        players: []
    }
};

const templateStatusData = () => ({name: "",team_1: {hue: null,players: []},team_2: {hue: null,players: []},team_3: {hue: null,players: []}})

window.switchActivePanel = (panel) => {
    options.activePanel = panel;
    refreshSL();
}

window.switchActiveRegion = (region) => {
    options.activeRegion = region;
    refreshSL();
}

window.toggleMode = (mode) => {
    options.modes[mode] = !options.modes[mode];
    refreshSL();
}

let API_TIMER = setInterval(async () => {
    if (options.activePanel !== 'listing') {
        return;
    }
    let raw = await(await fetch(API_LINK)).json();
    let allSystems = [];
    for (let item of raw) {
        if (item.hasOwnProperty("modding") && item.modding) {
            if (!options.modes.modding) {
                continue;
            } 
        }
        if (item.location.toLowerCase() !== options.activeRegion) {
            continue;
        }
        for (let system of item.systems) {
            if (options.modes[system.mode]) {
                allSystems.push({
                    ...system,
                    IP_ADDR: item.address
                });
            }
        }
    }
    filteredSystems = allSystems.sort((a, b) => a.time - b.time);
    refreshSL();
    
}, 3000)

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

window.statusReport = async (query) => {
    statusReportActive = true;
    console.log(query)
    let raw = await (await fetch(`https://starblast.dankdmitron.dev/api/status/${query}`)).json();
    statusReportData = templateStatusData();
    statusReportData.name = raw.name;
    for (let key of Object.keys(raw.players)) {
        let player = raw.players[key];
        statusReportData[`team_${player.friendly + 1}`].players.push({
            name: player.player_name,
            ecp: !!player.custom,
            score: player.score
        })
        statusReportData[`team_${player.friendly + 1}`].hue = player.hue;
    }
    statusReportData.team_1.players = statusReportData.team_1.players.sort((a, b) => a.score - b.score).reverse();
    statusReportData.team_2.players = statusReportData.team_2.players.sort((a, b) => a.score - b.score).reverse();
    statusReportData.team_3.players = statusReportData.team_3.players.sort((a, b) => a.score - b.score).reverse();
    refreshSL();
}

window.closeStatusReport = () => {
    statusReportActive = false;
    refreshSL();
}

document.querySelector('#play').addEventListener('click', () => clearInterval(API_TIMER));

const refreshSL = () => {
    SL_INTEGRATION.innerHTML = `
        ${
            !statusReportActive
            ?
            ""
            :
            `
                <div id="MODAL_WRAPPER" style="position:fixed; top:0; left:0; width: 100%; height: 100%; display: grid; place-items:center; z-index: 100; background: rgba(0,0,0,0.4)">
                    <div style="padding:1vw;display:flex;flex-direction:column;align-items:center;background:#0b0b0b;border:1px solid #1a1a1a;border-radius:12px">
                        <div style="height:3vh;width:50vw; color: white; font-family: 'DM Sans',sans-serif; font-size: 1.7vw; display: flex; justify-content: space-between; fill: white; align-items: center;">
                            <div>${statusReportData.name}</div>
                            <svg onclick="window.closeStatusReport()" style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg" height="2.5vh" viewBox="0 -960 960 960"><path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/></svg>
                        </div>
                        <div style="display:flex;height:55vh;width: 100%; margin-top: 2vh;justify-content:space-between;">
                            <div style="width:30%;height:100%;overflow-y: auto; display: flex; flex-direction: column; justify-content: flex-start; align-items: center">
                                <div style="margin-bottom: 2vh;border-radius: 0.25vw;border:1px solid hsla(${statusReportData.team_1.hue}, 100%, 50%, 1); border-left-width: 10px; width:80%;padding: 1vh 0 1vh 0;color: white; font-family: 'DM Sans',sans-serif; font-weight: 600; text-align: center;">
                                    ${hueToColorName(statusReportData.team_1.hue)}
                                </div>
                                <div style="height:max-content;width:100%;display:flex;justify-content:space-between;color:gray;font-family:'Abel',sans-serif;font-size:0.8vw;padding-bottom:0.5vh;border-bottom:1px solid #1a1a1a;margin-bottom: 0.5vh">
                                    <div style="width:7%">ECP</div>
                                    <div style="width:46.5%;text-align:center">&nbsp;NAME</div>
                                    <div style="width:46.5%;text-align:right;">SCORE</div>
                                </div>
                                ${
                                    statusReportData.team_1.players.length === 0
                                    ?
                                    ""
                                    :
                                    statusReportData.team_1.players.map(player => {
                                        return `
                                            <div style="height:max-content;margin-bottom:0.3vh;display:flex;width:100%;height:1vw">
                                                <div style="width:7%;height:100%;display:grid;place-items:center;">
                                                    <div style="height:60%; aspect-ratio: 1 / 1; border-radius:9999px; background: ${player.ecp ? "lime" : "red"}"></div>
                                                </div>
                                                <div style="width:93%;height:100%;display:flex;justify-content:space-between;font-family:'Abel',sans-serif;font-size:0.8vw;color:white;">
                                                    <div>${player.name}</div>
                                                    <div>${player.score}</div>
                                                </div>
                                            </div>
                                        `
                                    }).join('')
                                }
                            </div>
                            <div style="width:30%;height:100%;overflow-y: auto; display: flex; flex-direction: column; justify-content: flex-start; align-items: center">
                                <div style="margin-bottom: 2vh;border-radius: 0.25vw;border:1px solid hsla(${statusReportData.team_2.hue}, 100%, 50%, 1); border-left-width: 10px; width:80%;padding: 1vh 0 1vh 0;color: white; font-family: 'DM Sans',sans-serif; font-weight: 600; text-align: center;">
                                    ${hueToColorName(statusReportData.team_2.hue)}
                                </div>
                                <div style="height:max-content;width:100%;display:flex;justify-content:space-between;color:gray;font-family:'Abel',sans-serif;font-size:0.8vw;padding-bottom:0.5vh;border-bottom:1px solid #1a1a1a;margin-bottom: 0.5vh">
                                    <div style="width:7%">ECP</div>
                                    <div style="width:46.5%;text-align:center">&nbsp;NAME</div>
                                    <div style="width:46.5%;text-align:right;">SCORE</div>
                                </div>
                                ${
                                    statusReportData.team_2.players.length === 0
                                    ?
                                    ""
                                    :
                                    statusReportData.team_2.players.map(player => {
                                        return `
                                            <div style="height:max-content;margin-bottom:0.3vh;display:flex;width:100%;height:1vw">
                                                <div style="width:7%;height:100%;display:grid;place-items:center;">
                                                    <div style="height:60%; aspect-ratio: 1 / 1; border-radius:9999px; background: ${player.ecp ? "lime" : "red"}"></div>
                                                </div>
                                                <div style="width:93%;height:100%;display:flex;justify-content:space-between;font-family:'Abel',sans-serif;font-size:0.8vw;color:white;">
                                                    <div>${player.name}</div>
                                                    <div>${player.score}</div>
                                                </div>
                                            </div>
                                        `
                                    }).join('')
                                }
                            </div>
                            <div style="width:30%;height:100%;overflow-y: auto; display: flex; flex-direction: column; justify-content: flex-start; align-items: center">
                                <div style="margin-bottom: 2vh;border-radius: 0.25vw;border:1px solid hsla(${statusReportData.team_3.hue}, 100%, 50%, 1); border-left-width: 10px; width:80%;padding: 1vh 0 1vh 0;color: white; font-family: 'DM Sans',sans-serif; font-weight: 600; text-align: center;">
                                    ${hueToColorName(statusReportData.team_3.hue)}
                                </div>
                                <div style="height:max-content;width:100%;display:flex;justify-content:space-between;color:gray;font-family:'Abel',sans-serif;font-size:0.8vw;padding-bottom:0.5vh;border-bottom:1px solid #1a1a1a;margin-bottom: 0.5vh">
                                    <div style="width:7%">ECP</div>
                                    <div style="width:46.5%;text-align:center">&nbsp;NAME</div>
                                    <div style="width:46.5%;text-align:right;">SCORE</div>
                                </div>
                                ${
                                    statusReportData.team_3.players.length === 0
                                    ?
                                    ""
                                    :
                                    statusReportData.team_3.players.map(player => {
                                        return `
                                            <div style="height:max-content;margin-bottom:0.3vh;display:flex;width:100%;height:1vw">
                                                <div style="width:7%;height:100%;display:grid;place-items:center;">
                                                    <div style="height:60%; aspect-ratio: 1 / 1; border-radius:9999px; background: ${player.ecp ? "lime" : "red"}"></div>
                                                </div>
                                                <div style="width:93%;height:100%;display:flex;justify-content:space-between;font-family:'Abel',sans-serif;font-size:0.8vw;color:white;">
                                                    <div>${player.name}</div>
                                                    <div>${player.score}</div>
                                                </div>
                                            </div>
                                        `
                                    }).join('')
                                }
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
        <div id="SL_TITLE" style="height:10%;width:100%;">
            <div style="font-family: 'DM Sans', sans-serif;font-weight: 600;font-size: 1.3vw;text-align:right;width:100%;color:white">
                Starblast AUI v1.0.0
            </div>
            <div style="font-family:'Abel', sans-serif; font-weight: 300; font-size: 0.9vw; text-align: right; width: 100%; color: gray;">
                API (<a style="color:rgb(191,191,191)" href="https://starblast.dankdmitron.dev/" target="_blank"><u>Serverlist+</u></a>): <span style="color: white; font-weight: bold">dankdmitron</span>
            </div>
            <div style="font-family:'Abel', sans-serif; font-weight: 300; font-size: 0.9vw; text-align: right; width: 100%; color: gray;">
                Design and integration: <span style="color: white; font-weight: bold">Halcyon</span>
            </div>
        </div>
        <div id="SL_OPTIONS_WRAPPER" style="height:4%; width:100%;display: flex;">
            <div id="SL_LISTING_REF" onclick="window.switchActivePanel('listing')"
                style="${options.activePanel == 'listing' ? "background-color: #FFFFFF; color: #0b0b0b; fill: #0b0b0b;" : "background-color: #1a1a1a; color: #FFFFFF; fill: #FFFFFF;"}border-top-left-radius: 0.25vw; border-top-right-radius: 0.25vw;display: grid; place-items: center; font-size: 0.8vw; font-family: 'DM Sans',sans-serif;width:50%;font-weight: 500;cursor:pointer;">
                LISTING
            </div>
            <div id="SL_SETTINGS_REF" onclick="window.switchActivePanel('settings')"
                style="${options.activePanel == 'settings' ? "background-color: #FFFFFF; color: #0b0b0b; fill: #0b0b0b;" : "background-color: #1a1a1a; color: #FFFFFF; fill: #FFFFFF;"}border-top-left-radius: 0.25vw; border-top-right-radius: 0.25vw;display: grid; place-items: center; font-size: 0.8vw; font-family: 'DM Sans',sans-serif;width:50%;font-weight: 500;cursor:pointer;">
                SETTINGS
            </div>
        </div>
        <div id="SL_LISTING" style="box-sizing:border-box;padding:0.6vw;height:86%;width:100%;display: ${options.activePanel == "listing" ? "flex" : "none"}; flex-direction: column; overflow-y: auto;background-color:#0b0b0b;border:1px solid #1a1a1a">
            ${
                filteredSystems.length === 0
                ?
                ""
                :
                filteredSystems.map(system => {
                    return  `
                            <div onclick="window.statusReport('${system.id}@${system.IP_ADDR}')" style="width:100%; cursor: pointer; min-height:8.5vh; margin-bottom: 0.9vh; border-radius:12px; border: 1px solid #1a1a1a; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly;box-sizing:border-box;padding:0.4vh">
                                <div style="font-family:'DM Sans',sans-serif;color:white;font-weight:600;font-size:1.4vw;">
                                    ${system.name}
                                </div>
                                <div style="width:82%;height:1px;background-color:#1a1a1a"></div>
                                <div style="width:92%;display:flex;align-items:center;justify-content:space-between;color:gray;font-family:'Abel',sans-serif;font-size:0.8vw;position:relative;">
                                    <div>
                                        ${system.mode === 'modding' ? capitalize(system.mod_id) : capitalize(system.mode)}
                                    </div>   
                                    <div style="position:absolute;top:0;left:0;width:100%;text-align:center;">
                                        ${~~(system.time / 60)} min
                                    </div> 
                                    <div>
                                        ${system.players} players
                                    </div>
                                </div>
                            </div>
                        `
                    
                }).join('')
            }
        </div>
        <div id="SL_SETTINGS" style="box-sizing:border-box;padding:0.6vw;height:86%;width:100%;display: ${options.activePanel == "settings" ? "flex" : "none"}; flex-direction: column; gap: 0.2rem; overflow-y: auto;background-color:#0b0b0b;border:1px solid #1a1a1a;justify-content: flex-start;align-items:flex-end;">
            <div style="text-align:right;color:white;">
                <div style="font-family:'DM Sans',sans-serif;font-size:1.5vw;margin-bottom:0.5vh;">
                    REGION:
                </div>
                <div style="color:gray;font-family: 'Abel',sans-serif;font-size:1vw;display:flex;gap:0.5vw;justify-content:end;align-items:center;fill:#FFFFFF;">
                    <div>Europe</div>
                    ${
                        options.activeRegion == "europe"
                        ?
                        `<svg xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="M480-294q78 0 132-54t54-132q0-78-54-132t-132-54q-78 0-132 54t-54 132q0 78 54 132t132 54Zm0 214q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg>`
                        :
                        `<svg xmlns="http://www.w3.org/2000/svg" onclick="window.switchActiveRegion('europe')" height="1vw" viewBox="0 -960 960 960"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg>`
                    }
                </div>
                <div style="color:gray;font-family: 'Abel',sans-serif;font-size:1vw;display:flex;gap:0.5vw;justify-content:end;align-items:center;fill:#FFFFFF;">
                    <div>America</div>
                    ${
                        options.activeRegion == "america"
                        ?
                        `<svg xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="M480-294q78 0 132-54t54-132q0-78-54-132t-132-54q-78 0-132 54t-54 132q0 78 54 132t132 54Zm0 214q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg>`
                        :
                        `<svg xmlns="http://www.w3.org/2000/svg" onclick="window.switchActiveRegion('america')" height="1vw" viewBox="0 -960 960 960"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg>`
                    }
                </div>
                <div style="color:gray;font-family: 'Abel',sans-serif;font-size:1vw;display:flex;gap:0.5vw;justify-content:end;align-items:center;fill:#FFFFFF;">
                    <div>Asia</div>
                    ${
                        options.activeRegion == "asia"
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
                        options.modes.team
                        ?
                        `<svg onclick="window.toggleMode('team')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="m419-321 289-289-43-43-246 246-119-119-43 43 162 162ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z"/></svg>`
                        :
                        `<svg onclick="window.toggleMode('team')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z"/></svg>`
                    }
                </div>
                <div style="color:gray;font-family: 'Abel',sans-serif;font-size:1vw;display:flex;gap:0.5vw;justify-content:end;align-items:center;fill:#FFFFFF;">
                    <div>Survival</div>
                    ${
                        options.modes.survival
                        ?
                        `<svg onclick="window.toggleMode('survival')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="m419-321 289-289-43-43-246 246-119-119-43 43 162 162ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z"/></svg>`
                        :
                        `<svg onclick="window.toggleMode('survival')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z"/></svg>`
                    }
                </div>
                <div style="color:gray;font-family: 'Abel',sans-serif;font-size:1vw;display:flex;gap:0.5vw;justify-content:end;align-items:center;fill:#FFFFFF;">
                    <div>Deathmatch</div>
                    ${
                        options.modes.deathmatch
                        ?
                        `<svg onclick="window.toggleMode('deathmatch')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="m419-321 289-289-43-43-246 246-119-119-43 43 162 162ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z"/></svg>`
                        :
                        `<svg onclick="window.toggleMode('deathmatch')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z"/></svg>`
                    }
                </div>
                <div style="color:gray;font-family: 'Abel',sans-serif;font-size:1vw;display:flex;gap:0.5vw;justify-content:end;align-items:center;fill:#FFFFFF;">
                    <div>Modded</div>
                    ${
                        options.modes.modded
                        ?
                        `<svg onclick="window.toggleMode('modded')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="m419-321 289-289-43-43-246 246-119-119-43 43 162 162ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z"/></svg>`
                        :
                        `<svg onclick="window.toggleMode('modded')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z"/></svg>`
                    }
                </div>
                <div style="color:gray;font-family: 'Abel',sans-serif;font-size:1vw;display:flex;gap:0.5vw;justify-content:end;align-items:center;fill:#FFFFFF;">
                    <div>Invasion</div>
                    ${
                        options.modes.invasion
                        ?
                        `<svg onclick="window.toggleMode('invasion')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="m419-321 289-289-43-43-246 246-119-119-43 43 162 162ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z"/></svg>`
                        :
                        `<svg onclick="window.toggleMode('invasion')" xmlns="http://www.w3.org/2000/svg" height="1vw" viewBox="0 -960 960 960"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z"/></svg>`
                    }
                </div>
            </div>
        </div>
    `
}

function hueToColorName(hue) {
    const colorMap = [
      { hueRange: [0, 15], colorName: 'Red' },
      { hueRange: [15, 45], colorName: 'Orange' },
      { hueRange: [45, 75], colorName: 'Yellow' },
      { hueRange: [75, 150], colorName: 'Green' },
      { hueRange: [150, 195], colorName: 'Cyan' },
      { hueRange: [195, 240], colorName: 'Blue' },
      { hueRange: [240, 285], colorName: 'Purple' },
      { hueRange: [285, 330], colorName: 'Magenta' },
      { hueRange: [330, 360], colorName: 'Red' }
    ];
  
    const matchedColor = colorMap.find(entry => hue >= entry.hueRange[0] && hue < entry.hueRange[1]);
  
    return matchedColor ? matchedColor.colorName : 'Undefined';
  }

refreshSL();


const SL_SETTINGS_REF = document.querySelector('#SL_SETTINGS_REF');
const SL_LISTING_REF = document.querySelector('#SL_LISTING_REF');



/*var element = document.getElementById("content");
element.style.marginTop = "0px"

var observer = new MutationObserver(function(mutationsList, observer) {
    for (var mutation of mutationsList) {
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
            if (element.style.marginTop !== "0px") {
                element.style.marginTop = "0px";
            }
        }
    }
});
observer.observe(element, { attributes: true });*/