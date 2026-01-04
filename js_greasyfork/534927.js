// ==UserScript==
// @name         link to Ortem
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  try to take over the world
// @author       amarsik1
// @match        https://www.strava.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=strava.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534927/link%20to%20Ortem.user.js
// @updateURL https://update.greasyfork.org/scripts/534927/link%20to%20Ortem.meta.js
// ==/UserScript==

const MY_ATHLETE_ID = window.StravaSentry.userId;
const html = "<a class='nav-link' href='/athletes/120176620' style='display: flex;gap: 10px;align-items: center;font-size: 15px;margin:15px 0px'>" +
      "🐓 NarkoMelnyk</a>";



function linkToCStrava () {
    const checkLink = 'https://www.strava.com/activities/';
    if (window.location.href.includes(checkLink)) {
        const currentAthleteId = document.querySelector('#heading h2 span a').href.split('/').reverse()[0];

        if (Number(currentAthleteId) === MY_ATHLETE_ID) {
            const [activityId] = location.pathname.split('/').reverse();
            const btnCode = `<a class="btn btn-sm btn-primary" target="_blank" href="https://heatmap-strava.netlify.app/activities/${activityId}">to custom strava</a>`;

            const element = document.querySelector('section.private-note-container')


            const newElement = document.createElement('span');
            newElement.innerHTML = btnCode;

            element.parentNode.insertBefore(newElement.firstChild, element.parentNode.children[1]);
        }
    };
}



(function() {
    'use strict';

    // hide sponsor videos on YT
    const css = '#contents ytd-rich-item-renderer:has(.badge-style-type-members-only) {display: none}';
    const sheet = window.document.styleSheets[0];
    sheet.insertRule(css, sheet.cssRules.length);
    // end

    // link to custom strava //
    linkToCStrava();

    const [_,athleteId] = location.pathname.slice(1).split('/');
    const isMyProfile = Number(athleteId) === MY_ATHLETE_ID;

    if (!isMyProfile) return;

    const element = document.querySelector('.profile.section h1.athlete-name');

    const newElement = document.createElement('div');
    newElement.innerHTML = html;

    element.parentNode.insertBefore(newElement.firstChild, element.parentNode.children[1]);
    // Your code here...

})();