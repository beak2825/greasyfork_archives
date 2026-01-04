// ==UserScript==
// @name         save settings
// @description  saves sploop settings
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       peanutakie
// @match        https://sploop.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483565/save%20settings.user.js
// @updateURL https://update.greasyfork.org/scripts/483565/save%20settings.meta.js
// ==/UserScript==

const settings = new Map(JSON.parse(localStorage.getItem("settingsSave")));

function setCheckedHats(v) { localStorage.setItem("settingsSave", JSON.stringify(Array.from(settings.entries()))) }

function fix (value, key) {
if (key == "native-helper-toggle" || key == "grid-toggle") { value ? 0 : document.querySelector("#"+key).click(); } else {
value ? document.querySelector("#"+key).click() : 0;
}};

settings.forEach(fix);

document.querySelector("#pop-settings > div.pop-settings-content").addEventListener("input", e => {
    settings.set(e.target.id, e.target.checked);
    setCheckedHats(settings);
});