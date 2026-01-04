// ==UserScript==
// @name         GeoGuessr Custom Map Sizes
// @namespace    https://greasyfork.org/en/users/250979-mrmike
// @version      0.2.2
// @description  Enables the user to customize the size of the map for GeoGuessr // Edit the rem values for each map size to fit your needs // If you can't click the "Increase button" the Game already thinks you are at the max-height it can go // If you want to always have a big map edit the values for 'size-1' as that is the default one that triggers when starting a new game // Play with different values until you happy // Some sizes like the auto-shrink height are fixed I believe
// @author       MrAmericanMike
// @include      /^(https?)?(\:)?(\/\/)?([^\/]*\.)?geoguessr\.com($|\/.*)/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/378570/GeoGuessr%20Custom%20Map%20Sizes.user.js
// @updateURL https://update.greasyfork.org/scripts/378570/GeoGuessr%20Custom%20Map%20Sizes.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.replace(/;/g, ' !important;');
    head.appendChild(style);
}

addGlobalStyle (`

/* Map at size 0 and active (Hoover) */
.guess-map--size-0 {
	--active-width: 20rem;
	--active-height: 20rem;
}

/* Map at size 1 and active (Hoover) */
.guess-map--size-1 {
	--active-width: 40rem;
	--active-height: 26rem;
}

/* Map at size 2 and active (Hoover) */
.guess-map--size-2 {
	--active-width: 50rem;
	--active-height: 30rem;
}

/* Map at size 3 and active (Hoover) */
.guess-map--size-3 {
	--active-width: 60rem;
	--active-height: 40rem;
}

/* Map at size 4 and active (Hoover) */
.guess-map--size-4 {
	--active-width: 70rem;
	--active-height: 50rem;
}


.guess-map {
	margin: 0px;
	--inactive-width: 10rem;
	--inactive-height: 10rem;
}

`);