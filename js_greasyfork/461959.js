// ==UserScript==
// @name        meneame.net - Destacar comentarios de usuarios recientes
// @namespace   http://tampermonkey.net/
// @version     2.8
// @description Destacar comentarios de usuarios con menos de NOOB_DAYS días.
// @match       *://*.meneame.net/*
// @run-at      document-end
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.listValues
// @grant       GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/461959/meneamenet%20-%20Destacar%20comentarios%20de%20usuarios%20recientes.user.js
// @updateURL https://update.greasyfork.org/scripts/461959/meneamenet%20-%20Destacar%20comentarios%20de%20usuarios%20recientes.meta.js
// ==/UserScript==

// ---- SCRIPT CONFIG ----
const NOOB_DAYS = 90;

// ---- API values ----
const USERNAME_CLASS = '.username';
const SUBMITTED_NEWS_CLASS = '.news-submitted';
const REQUEST_URL = 'https://www.meneame.net/backend/get_user_info?id=';

const DOUBLE_SPACE = "&nbsp;&nbsp;";
const PIC_L = "<svg width='11' height='12' style='overflow: visible'> <rect style='fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.23726973;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1' height='16.553701' ry='0.88286412' rx='0.88286412' width='14.898332' id='rect858' x='-0.096365139' y='-0.096365139'></rect> <rect rx='0.55179006' ry='0.55179006' height='14.898332' x='0.73131996' y='0.73131996' width='13.242962' style='fill:#0ba800;fill-opacity:1;stroke:#000000;stroke-width:0.20416233;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1' id='rect860'></rect> <path style='fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.09538639;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1' d='M 2.7781475,1.6690757 V 14.711704 h 3.3093231 v -0.0058 H 11.927454 V 12.181045 L 5.5034726,12.161578 V 1.6496091 Z' id='rect817'></path></svg>"
const SVG_CSS_Tooltip = "a.SVGtooltips {position: relative;display: inline;} a.SVGtooltips span {position: absolute;width:180px;color: #FFFFFF;background: #000000;height: 30px;line-height: 30px;text-align: center;visibility: hidden;border-radius: 6px;} a.SVGtooltips span:after {content: '';position: absolute;top: 50%;right: 100%;margin-top: -8px;width: 0; height: 0;border-right: 8px solid #000000;border-top: 8px solid transparent;border-bottom: 8px solid transparent;} a:hover.SVGtooltips span {visibility: visible;opacity: 1;left: 100%;top: 50%;margin-top: -15px;margin-left: 15px;z-index: 999;}";
const SVG_A_OPEN = "<a class='SVGtooltips' href='#'>";
const SVG_A_CLOSE = "</a>";
const SVG_SPAN_OPEN = "<span>";
const SVG_SPAN_CLOSE = "</span>";

window.onload = function () {
    addGlobalStyle(SVG_CSS_Tooltip);
    cacheRefresh();
	highlightUserNews();
    highlightUserComments();
};

function highlightUserComments() {
    let usernames = document.querySelectorAll(USERNAME_CLASS);
    usernames.forEach( function(node) {
		const user = node.textContent;
		checkIfUserIsNoob(user, node, DOUBLE_SPACE + PIC_L);
    });
	usernames = "";
}

function highlightUserNews() {
    let newsSubmitted = document.querySelectorAll(SUBMITTED_NEWS_CLASS);
    newsSubmitted.forEach( function(node) {
		const user = node.childNodes[3].textContent;
		checkIfUserIsNoob(user, node.childNodes[3], DOUBLE_SPACE + PIC_L + DOUBLE_SPACE);
    });
	newsSubmitted = "";
}

async function checkIfUserIsNoob(user, node, HTML_SVG) {
    let date = await GM.getValue(user, "");
    if (date === "") {
        requestRegistrationDate(user, node, HTML_SVG);
    } else {
        tagUser(node, date, HTML_SVG);
    }
}

async function requestRegistrationDate(user, node, HTML_SVG) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const dateRegex = /((0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-[12]\d{3})/;
            const date = this.responseText.match(dateRegex);
            GM.setValue(user, date[0]);
            tagUser(node, date[0], HTML_SVG);
        }
    };
    xhttp.open("GET", REQUEST_URL + user, true);
    xhttp.send();
}

function tagUser(node, date, HTML_SVG) {
    try {
        let days = daysSinceRegistration(date);
        if (days < NOOB_DAYS) {
            node.insertAdjacentHTML('afterend', svgImage(days, HTML_SVG));
        }
        days = "";
    } catch (err) {
        console.log(err);
    }
}

function daysSinceRegistration(dateStr) {
    const dateArray = dateStr.toString().split('-');
    const date = new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
    return (Date.now() - date.getTime()) / 3600000 / 24;
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function svgImage(days, HTML_SVG) {
	let svgResponse =
		SVG_A_OPEN +
			HTML_SVG +
			SVG_SPAN_OPEN +
				"AQUÍ DESDE HACE: " + Math.floor(days) + " DÍAS." +
			SVG_SPAN_CLOSE +
		SVG_A_CLOSE;
	return svgResponse;
}

// Clear the user cache every 30 days
async function cacheRefresh() {
    const UPDATE_DATE_KEY = "______CACHE_CLEAR_DATE______"
    const CACHE_DAYS = 30 //days
    let lastClearDate = await GM.getValue(UPDATE_DATE_KEY, "");
    if (lastClearDate === "") {
        GM.setValue(UPDATE_DATE_KEY, Date.now());
    } else {
        let lastClearMilis = lastClearDate ;
        let cacheDays = (Date.now() - lastClearMilis) / 1000 / 3600 / 24;
        if (cacheDays > CACHE_DAYS) {
            let values = await GM.listValues();
            values.forEach( function(value) {
                GM.deleteValue(value);
            });
            GM.setValue(UPDATE_DATE_KEY, Date.now());
            console.log("Users cache cleared (" + values.length +" entries)");
        }
    }
}
