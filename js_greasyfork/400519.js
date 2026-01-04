// ==UserScript==
// @name        meneame.net - Destacar edad de usuarios
// @namespace   http://tampermonkey.net/
// @version     3.3
// @description Destacar edad de usuarios.
// @author      ᵒᶜʰᵒᶜᵉʳᵒˢ & Niko
// @match       *://*.meneame.net/*
// @connect     meneame.net
// @icon        https://www.meneame.net/favicon.ico
// @grant       GM_addStyle
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.listValues
// @grant       GM.deleteValue
// @grant       GM.xmlHttpRequest
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/400519/meneamenet%20-%20Destacar%20edad%20de%20usuarios.user.js
// @updateURL https://update.greasyfork.org/scripts/400519/meneamenet%20-%20Destacar%20edad%20de%20usuarios.meta.js
// ==/UserScript==

// RECOMENDADO USAR JUNTO AL CSS DE @Ergo: https://userstyles.world/style/1811

// ---- SCRIPT CONFIG ----
const CACHE_DAYS = 30;
const GREEN_DAYS = 30;
const ORANGE_DAYS = 30;
const RED_DAYS = 30;
const GREEN_COLOR = "#0ba800";
const ORANGE_COLOR = "#ffa200";
const RED_COLOR = "#ff0000";

const GOLD_MEDAL_COLOR = "#FFCC00";
const SILVER_MEDAL_COLOR = "#999999";
const BRONZE_MEDAL_COLOR = "#A05A2C";
const SILVER_YEARS = 5;
const BRONZE_YEARS = 3;

const NOOB_DAYS = RED_DAYS + ORANGE_DAYS + GREEN_DAYS;
const FILLCOLOR = 'FILLCOLOR';
const MEDAL_COLOR = 'MEDAL_COLOR';
const YEARS_MEDAL = 'YEARS_MEDAL';

const EXECUTION_MIN_DELAY_MS = 1000;
const EXECUTION_NEGATIVE_DELAY_MS = 120;

// ---- API values ----
const USER_LOCATIONS = [
    ['.username',null],
    ['.news-submitted',3]
];
const REQUEST_URL = "https://www.meneame.net/backend/get_user_info?id=";
const AVATAR_CLASSES = ".username:not([class^='nav-bar-option']), .news-submitted a.tooltip";
const URL_VOTERS = 'https://www.meneame.net/backend/meneos.php?id=MENEO_ID&p=1';
const NEGATIVE_HEADER = '.news-details';
const NEGATIVE_HEADER_CONTENT = 'votos negativos:';
const NEGATIVE_COUNTER_CLASS = '.negative-vote-number';
const STORY_BLOG = '.story-blog';

// ---- SVG CODE ----
const SVG_CSS_Tooltip = "a.SVGtooltips{margin:12px 5px 0 2px;height:10px;flex-direction:column-reverse;top:unset;left:unset;position: relative;display: inline-flex;scale: 0.666;width: auto;padding: 0;}a.SVGtooltips span {width: 0;visibility: hidden;}a.SVGtooltips:hover span {z-index: 20;border: none;text-transform: lowercase; font-size: 18px;border-radius: 20px; color: #fff;background: #444;visibility: visible;margin: -17px 15px 0 25px;position: absolute;height: auto; width: auto;white-space: nowrap; padding: 5px 8px 6px 8px;font-weight: normal;}a.SVGtooltips:hover span:after {display: inline-block; width: auto; height: auto;white-space: nowrap;line-height: 18px;text-align: center;visibility: visible;content:'';position:absolute;margin:-17px 15px 0 20px;}a.SVGtooltips svg{opacity:1;}";
const SVG_L_PIC = "<a class='SVGtooltips' href='#'>&nbsp;&nbsp;<svg width='11' height='12' style='overflow: visible;scale:1.4;padding-top:5px'> <rect style='fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.23;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1' height='16.55' ry='0.88' rx='0.88' width='14.89' x='-0.09' y='-0.09'></rect> <rect rx='0.55' ry='0.55' height='14.89' x='0.73' y='0.73' width='13.24' style='fill:FILLCOLOR;fill-opacity:1;stroke:#000000;stroke-width:0.20;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1'></rect> <path style='fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.09;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1' d='M 2.77,1.66 V 14.71 h 3.30 v -0.0058 H 11.92 V 12.18 L 5.50,12.16 V 1.64 Z'></path></svg><span>XXX DÍAS</span></a>";
const SVG_MEDAL_PIC = "<a class='SVGtooltips' href='#'>&nbsp;&nbsp;<svg width='11' height='12' style='overflow: visible'><defs><linearGradient spreadMethod='pad' id='gradient_type' x1='100%' y1='100%' x2='0%' y2='0%'><stop offset='25%' style='stop-color:MEDAL_COLOR;stop-opacity:1;' /><stop offset='95%' style='stop-color:#FFFFFF;stop-opacity:1;' /></linearGradient></defs><path style='fill:#ff0000' d='M 11.95,23.17 0,2.2e-6 22.56,0 Z'/><circle style='fill:url(#gradient_type)' r='11' cx='11.50' cy='16.63' y='0' x='0'/><text text-anchor='middle' dominant-baseline='central' x='11.5' y='16.63' style='font-size:13px'><tspan style='font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-family:Arial;text-align:center;text-anchor:middle;stroke-width:2.02'>YEARS_MEDAL</tspan></text></svg><span>YEARS_MEDAL AÑOS</span></a>";

function doDirtyThings() {
    cacheDelete();
    GM_addStyle(SVG_CSS_Tooltip);
    if (link_id > 0 && IsArticle() && HasNegatives()) {
        delay(EXECUTION_MIN_DELAY_MS*6).then(() => highlightUsers());
    } else {
        if (link_id > 0 && document.querySelector(NEGATIVE_COUNTER_CLASS)) {
            var NegativeCount = parseInt(document.querySelector(NEGATIVE_COUNTER_CLASS).textContent,10);
            if (NegativeCount>0) {
                delay(EXECUTION_MIN_DELAY_MS+NegativeCount*EXECUTION_NEGATIVE_DELAY_MS).then(() => highlightUsers());
            } else {
                highlightUsers()
            }
        } else {
            highlightUsers()
        }
    }
};

async function HasNegatives() {
    await GM.xmlHttpRequest(
        {method: "GET", url: URL_VOTERS.replace('MENEO_ID', link_id), responseType: "document", onload: function(result) {
            var xmlDoc = new DOMParser().parseFromString(result.responseText, "text/html");
            return xmlDoc.querySelector(NEGATIVE_HEADER).innerHTML.includes(NEGATIVE_HEADER_CONTENT) ? true : false;
        }})
}

function IsArticle() {
    return document.querySelectorAll(STORY_BLOG).length > 0 ? true : false;
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function highlightUsers() {
    for(var userLocation of USER_LOCATIONS) {
        let usernames = document.querySelectorAll(userLocation[0]);
        let childNodeNumber = userLocation[1];
        usernames.forEach(function(node) {
            checkUserAge(node, childNodeNumber);
        });
    }
}

async function checkUserAge(node, childnode) {
    var user = "";
    user = (childnode) ? node.childNodes[childnode].textContent : node.textContent;
    let date = await GM.getValue(user, "");
    if (date === "") date = requestRegistrationDate(user);
    let days = daysSinceRegistration(date);
    date = date.replaceAll('-','/');
    if (!(days >= 0)) days = 0;
    insertAfterAvatar(node, (days <= NOOB_DAYS) ? formatSVG_L_PIC(Math.floor(days), date) : formatSVG_MEDAL_PIC(Math.floor(days/365)>=0 ? Math.floor(days/365) : 0, date));
}

function formatSVG_MEDAL_PIC(years, date) {
    var strSVG = SVG_MEDAL_PIC.replaceAll(YEARS_MEDAL,years);
    switch(true) {
        case (years <= BRONZE_YEARS):
            strSVG = strSVG.replace(MEDAL_COLOR, BRONZE_MEDAL_COLOR).replaceAll('_type','_bronze'); break;
        case (years <= BRONZE_YEARS + SILVER_YEARS):
            strSVG = strSVG.replace(MEDAL_COLOR, SILVER_MEDAL_COLOR).replaceAll('_type','_silver'); break;
        default:
            strSVG = strSVG.replace(MEDAL_COLOR, GOLD_MEDAL_COLOR).replaceAll('_type','_gold');
    }
    strSVG = strSVG.replace('AÑOS', ((years == 1) ? 'AÑO' : 'AÑOS') + ' - DESDE EL ' + date);
    return strSVG;
}

function formatSVG_L_PIC(days, date) {
    var strSVG = SVG_L_PIC.replace("XXX",days);
    switch(true) {
        case (days <= RED_DAYS):
            strSVG = strSVG.replace(FILLCOLOR, RED_COLOR); break;
        case (days <= RED_DAYS + ORANGE_DAYS):
            strSVG = strSVG.replace(FILLCOLOR, ORANGE_COLOR); break;
        default:
            strSVG = strSVG.replace(FILLCOLOR, GREEN_COLOR);
    }
    strSVG = strSVG.replace('DÍAS', ((days == 1) ? 'DÍA' : 'DÍAS') + ' - DESDE EL ' + date);
    return strSVG;
}

function insertAfterAvatar(usernode, htmlsvg) {
    let avatarNodes = usernode.parentNode.querySelectorAll(AVATAR_CLASSES);
    avatarNodes.forEach(function(node) {
        node.insertAdjacentHTML('afterend', htmlsvg);
    });
}

async function requestRegistrationDate(user) {
    await GM.xmlHttpRequest(
        {method: "GET", url: REQUEST_URL + user, onload: function(result) {
            const dateRegex = /((0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-[12]\d{3})/;
            const date = result.responseText.match(dateRegex);
            if (user != "") GM.setValue(user, date[0]);
        }
        }
    );
}

function daysSinceRegistration(dateStr) {
    const dateArray = dateStr.toString().split('-');
    const date = new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
    return (Date.now() - date.getTime()) / 8.64e7;
}

async function cacheDelete() {
    const UPDATE_DATE_KEY = "_CACHE_CLEAR_DATE_"
    let lastClearDate = await GM.getValue(UPDATE_DATE_KEY, "");
    if (lastClearDate === "") {
        GM.setValue(UPDATE_DATE_KEY, Date.now());
    } else {
        if ((Date.now() - lastClearDate) / 8.64e7 > CACHE_DAYS) {
            let values = await GM.listValues();
            values.forEach( function(value) {GM.deleteValue(value);});
            GM.setValue(UPDATE_DATE_KEY, Date.now());
        }
    }
}

doDirtyThings();