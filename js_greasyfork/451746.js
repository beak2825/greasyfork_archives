// ==UserScript==
// @name          falinks-teambuilder-helper
// @description   A UserScript helps import teams to a Falinks Teambuilder room
// @namespace     http://tampermonkey.net/
// @version       1.1.0
// @author        txfs19260817
// @icon          https://www.falinks-teambuilder.com/favicon.ico
// @source        https://github.com/txfs19260817/falinks-teambuilder-helper
// @license       WTFPL
// @match         http*://play.pokemonshowdown.com/*
// @match         http*://*.psim.us/*
// @match         http*://pokepast.es/*
// @match         http*://play.limitlesstcg.com/*
// @require       https://unpkg.com/@pkmn/sets/build/index.min.js
// @connect       www.falinks-teambuilder.com
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/451746/falinks-teambuilder-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/451746/falinks-teambuilder-helper.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: external "window"
const external_window_namespaceObject = window;
;// CONCATENATED MODULE: ./src/utils.ts
// Random 4-letter string
function S4() {
    return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
}
// Button building
const buttonStyles = (/* unused pure expression or super */ null && ([
    "ps",
    "limitless"
]));
const createRoomButtonId = "falinks-new-room-btn";
const showdownBtnStyle = {
    outline: "none",
    cursor: "pointer",
    textAlign: "center",
    textDecoration: "none",
    boxShadow: "0 1px 2px rgba(0,0,0,.2),inset 0 -1px 2px #fff",
    borderRadius: "5px",
    fontFamily: "Verdana,Helvetica,Arial,sans-serif",
    display: "inline-block",
    color: "#222",
    textShadow: "0 1px 0 #fff",
    border: "1px solid #aaa",
    background: "linear-gradient(to bottom,#f6f6f6,#e3e3e3)",
    fontSize: "9pt",
    padding: "3px 8px",
    marginLeft: "6px",
    marginBottom: "3px"
};
const buildPSButton = function(eid, text, onclick) {
    let style = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "ps";
    const submitBtn = document.createElement("button");
    submitBtn.id = eid;
    submitBtn.textContent = text;
    submitBtn.type = "button";
    submitBtn.onclick = onclick;
    // pokepast.es potentially erased all css, including button. So add it back
    if (style === "ps") {
        Object.assign(submitBtn.style, showdownBtnStyle);
    } else if (style === "limitless") {
        submitBtn.classList.add("export"); // reuse the "export" button style
        submitBtn.style.marginLeft = "6px"; // add some margin to the left
    }
    return submitBtn;
};
// URL stuff
const pokepasteURL = "pokepast.es";
const falinksTeambuilderURL = "falinks-teambuilder.com";
const showdownURL = "play.pokemonshowdown.com";
const limitlesstcgURL = "play.limitlesstcg.com";
const safeReferrers = [
    pokepasteURL,
    falinksTeambuilderURL,
    limitlesstcgURL
];
function isSafeReferrer(s) {
    return safeReferrers.some((r)=>s.includes(r));
}
function isLimitlessTeamlistURL(url) {
    const { hostname , pathname  } = new URL(url);
    return hostname === limitlesstcgURL && (pathname.endsWith("teamlist") || pathname.endsWith("teamlist/"));
}
function falinksRoomEndpoint(packed) {
    // packed team will be passed as a query param
    return `//www.${falinksTeambuilderURL}/room/room_${S4()}${S4()}/?protocol=WebSocket&packed=${encodeURIComponent(packed)}`;
}
function showdownTeambuilderEndpoint(packed) {
    // packed team will be in the URL hash
    return `https://${showdownURL}/teambuilder#${packed}`;
}

;// CONCATENATED MODULE: ./src/index.ts


function pasteToPacked(paste) {
    var _pkmnSets_pkmn_sets_Teams_importTeam;
    // see: https://github.com/pkmn/ps/blob/main/sets/README.md#browser
    //@ts-ignore
    return ((_pkmnSets_pkmn_sets_Teams_importTeam = external_window_namespaceObject.pkmn.sets.Teams.importTeam(paste)) === null || _pkmnSets_pkmn_sets_Teams_importTeam === void 0 ? void 0 : _pkmnSets_pkmn_sets_Teams_importTeam.pack()) ?? '';
}
function createRoomButton(packedTeam) {
    let style = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "ps";
    return buildPSButton("falinks-new-room-btn", "🤝 Open in a Falinks Teambuilder room", ()=>{
        window.open(falinksRoomEndpoint(packedTeam));
    }, style);
}
function createToPSButton(packedTeam) {
    let format = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "gen9", name = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : `Falinks Team ${S4()}`, style = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "ps";
    // seems `Team.pack()` does not add format and team name to the packed team, we do it manually
    const packedWithFormat = `${format}]${name}|${packedTeam}`;
    return buildPSButton("falinks-add-team-btn", "🚀 Add to your Showdown teams", ()=>{
        window.open(showdownTeambuilderEndpoint(packedWithFormat));
    }, style);
}
function getPasteAtPokepaste() {
    var _document_querySelector, _notes_match, _document_querySelector1;
    // get format from notes
    const notes = ((_document_querySelector = document.querySelector("body > aside > p")) === null || _document_querySelector === void 0 ? void 0 : _document_querySelector.textContent) ?? '';
    const format = ((_notes_match = notes.match(/Format: (.*)/)) === null || _notes_match === void 0 ? void 0 : _notes_match[1]) ?? '';
    // get name from title
    const name = (_document_querySelector1 = document.querySelector("body > aside > h1")) === null || _document_querySelector1 === void 0 ? void 0 : _document_querySelector1.textContent;
    // get team from textarea
    const paste = [
        1,
        2,
        3,
        4,
        5,
        6
    ].map((i)=>{
        var _document_querySelector;
        return ((_document_querySelector = document.querySelector(`body > article:nth-child(${i}) > pre`)) === null || _document_querySelector === void 0 ? void 0 : _document_querySelector.textContent) ?? '';
    }).join('');
    return {
        format,
        name,
        paste
    };
}
function getPackedAtShowdown() {
    var _unsafeWindow_room, _unsafeWindow_room_curTeam;
    // @ts-ignore
    return ((_unsafeWindow_room = unsafeWindow.room) === null || _unsafeWindow_room === void 0 ? void 0 : (_unsafeWindow_room_curTeam = _unsafeWindow_room.curTeam) === null || _unsafeWindow_room_curTeam === void 0 ? void 0 : _unsafeWindow_room_curTeam.team) ?? '';
}
function addPackedToLocalStorage(packedTeam) {
    const updatedShowdownTeams = packedTeam + "\n" + localStorage.getItem("showdown_teams");
    localStorage.setItem("showdown_teams", updatedShowdownTeams);
}
function main() {
    const { host , hash , href  } = window.location;
    if (host === pokepasteURL) {
        // parse the DOM of pokepast.es
        const { paste , format , name  } = getPasteAtPokepaste();
        // pack the team
        const packed = pasteToPacked(paste);
        // add both Create Room and Add To PS buttons to Pokepaste aside
        document.querySelector("body > aside").append(createRoomButton(packed), createToPSButton(packed, format, name));
    } else if (isLimitlessTeamlistURL(href)) {
        // @ts-ignore
        const paste = teamlist; // teamlist is a global variable defined in this page
        console.log(paste);
        const packed = pasteToPacked(paste);
        const title = document.querySelector("body > div.pre-content > div > div > div > div").textContent;
        const author = document.querySelector("body > div.main > div > div.infobox > div.heading").textContent;
        const name = `${author} @ ${title}`;
        document.querySelector("body > div.main > div > div.teamlist > div.buttons").append(createRoomButton(packed, "limitless"), createToPSButton(packed, "gen9vgc2023series2", name, "limitless") // use gen9vgc2023series2 as format atm
        );
    } else {
        // add the Create Room button to Showdown Teambuilder, next to "Upload to PokePaste" button
        const observer = new MutationObserver(function() {
            const pokepasteForm = document.getElementById("pokepasteForm");
            if (pokepasteForm && !document.getElementById(createRoomButtonId)) {
                const packed = getPackedAtShowdown();
                const btn = createRoomButton(packed);
                pokepasteForm.appendChild(btn);
            }
        });
        observer.observe(document.querySelector("body"), {
            subtree: true,
            childList: true
        });
        // check both referer and hash to find if a packed team sent from trusted sources
        if (hash && isSafeReferrer(document.referrer)) {
            const packedTeam = decodeURIComponent(document.location.hash.slice(1));
            // reset the URL to avoid re-importing the team
            history.replaceState(null, document.title, location.pathname + location.search);
            // ask the user to import the team
            const doAdd = confirm(`Would you like to add this team from ${document.referrer} to your teams?\n${packedTeam}`);
            if (doAdd) {
                addPackedToLocalStorage(packedTeam);
                window.location.reload();
            }
        }
    }
}
main();

/******/ })()
;