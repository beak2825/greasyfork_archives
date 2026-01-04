// ==UserScript==
// @name         MooMoo.io Script For Legit Players (Bull & Turret & Soldier & Tank In One Line!)
// @version      First&Last
// @description  removes Unnecessary Hat From Shop For Smooth Scrolling
// @author       DETIX || discord => detixthegoat
// @match        *://*.moomoo.io/*
// @namespace https://greasyfork.org/users/684614
// @downloadURL https://update.greasyfork.org/scripts/470371/MooMooio%20Script%20For%20Legit%20Players%20%28Bull%20%20Turret%20%20Soldier%20%20Tank%20In%20One%20Line%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/470371/MooMooio%20Script%20For%20Legit%20Players%20%28Bull%20%20Turret%20%20Soldier%20%20Tank%20In%20One%20Line%21%29.meta.js
// ==/UserScript==
let a = document.querySelector('#enterGame');

const g = (id) => {
    const i = document.getElementById(id);
    if (i){
        i.remove();
    }
}

function t() {
    g("storeDisplay29");
    requestAnimationFrame(t);
}

a.addEventListener('click', function() {
    console.log("In-Game");
    t();
});
