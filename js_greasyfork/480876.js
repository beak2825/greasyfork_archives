// ==UserScript==
// @name        Shibasfixes
// @namespace   Violentmonkey Scripts
// @match       https://*.smartschool.be/*
// @grant       none
// @version     1.7
// @author      Shiba
// @homepage    https://userstyles.world/style/13317
// @license     MIT
// @description fixes just for me, also use stylus see homepage
// @downloadURL https://update.greasyfork.org/scripts/480876/Shibasfixes.user.js
// @updateURL https://update.greasyfork.org/scripts/480876/Shibasfixes.meta.js
// ==/UserScript==

const iconOnly = false;

// date
const date = new Date();
const datetext = document.createElement("a");
datetext.style.color = "#fff";
datetext.style.marginLeft = "10pt";
datetext.style.marginRight = "auto";
datetext.href = "https://jsfiddle.net/javrbwmz/4/show";
datetext.target = "_blank";
datetext.innerHTML = date.getDate().toString().padStart(2,"0") + "-" + (date.getMonth() +1 ).toString().padStart(2,"0") + "-" + date.getFullYear();

document.querySelector("nav.topnav").insertBefore(datetext, document.querySelector("a.topnav__btn--push-right"));

// icons
document.querySelector(".js-btn-home").innerHTML = `<img style="${iconOnly ? "" : "padding-right: 1rem;"} max-height: 24px; filter: invert(1);" src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Home-icon.svg/640px-Home-icon.svg.png' />${iconOnly ? "" : "Start"}`;
document.querySelector(".js-btn-shortcuts").innerHTML = `<img style="${iconOnly ? "" : "padding-right: 1rem;"} max-height: 24px; filter: invert(1);" src='https://uxwing.com/wp-content/themes/uxwing/download/arrow-direction/curved-arrow-icon.png' />${iconOnly ? "" : "Ga naar"}`;
document.querySelector(".js-btn-courses").innerHTML = `<img style="${iconOnly ? "" : "padding-right: 1rem;"}" src="https://static5.smart-school.net/smsc/svg/schoolbord/schoolbord_24x24.svg" />${iconOnly ? "" : "Vakken"}`;
document.querySelector(".js-btn-links").innerHTML = `<img style="${iconOnly ? "" : "padding-right: 1rem;"} max-height: 24px; filter: invert(1);" src="https://simpleicon.com/wp-content/uploads/link-2.svg" />${iconOnly ? "" : "Links"}`;
document.querySelector(".js-btn-messages").innerHTML = `<img style="${iconOnly ? "" : "padding-right: 1rem;"}" src="https://static5.smart-school.net/smsc/svg/mail/mail_24x24.svg" />${iconOnly ? "" : "Berichten"}`;
document.querySelector(".js-btn-notifs").innerHTML = `<img style="${iconOnly ? "" : "padding-right: 1rem;"} max-height: 24px; filter: invert(1);" src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-bell-512.png" />${iconOnly ? "" : "Meldingen"}`;

// planner
const planner = document.createElement("a");
planner.href = "/planner";
planner.style.color = "#fff";
planner.style.margin = "0";
planner.classList.add("topnav__btn");
planner.classList.add("js-btn-home");
planner.innerHTML = `<img style="${iconOnly ? "" : "padding-right: 1rem;"}" src='https://static5.smart-school.net/smsc/svg/planner/planner_24x24.svg' />${iconOnly ? "" : "Planner"}`;

document.querySelector("nav.topnav").insertBefore(planner, document.querySelector(".js-btn-messages"));


// resultaten
const resultaten = document.createElement("a");
resultaten.href = "/results";
resultaten.style.color = "#fff";
resultaten.style.margin = "0";
resultaten.classList.add("topnav__btn");
resultaten.classList.add("js-btn-home");
resultaten.innerHTML = `<img style="${iconOnly ? "" : "padding-right: 1rem;"}" src='https://static5.smart-school.net/smsc/svg/results_donut/results_donut_24x24.svg' />${iconOnly ? "" : "Resultaten"}`;

document.querySelector("nav.topnav").insertBefore(resultaten, planner);

// my links
const myLinks = document.createElement("div");
myLinks.classList.add("myLinks");
myLinks.innerHTML = `
<div style="padding: 1.33rem">
<h2 class="smsc-title--1" style="color: #C90001">My links</h2>
<ul>
    <li><a href="http://bonpatron.com/fr" target="_blank">BonPatron</a></li>
    <li><a href="http://desmos.com" target="_blank">Desmos</a></li>
    <li><a href="http://asafraction.com" target="_blank">As a fraction</a></li>
</ul>
</div>`;
document.getElementById("rightcontainer").append(myLinks);