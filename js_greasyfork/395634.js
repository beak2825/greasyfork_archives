// ==UserScript==
// @name         VRAPI Enhancements
// @version      0.33
// @description  Add map links with pushpin above map in VRAPI dashboard.
// @author       Shoshi
// @include      https://safe.hostcompliance.com/*
// @include      https://safe-ca.hostcompliance.com/*
// @include      https://secure.hostcompliance.com/*
// @include      https://www.homeaway.com/vacation-rental/*
// @namespace    https://greasyfork.org/users/438196
// @downloadURL https://update.greasyfork.org/scripts/395634/VRAPI%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/395634/VRAPI%20Enhancements.meta.js
// ==/UserScript==

const google = `https://www.google.com/maps/search/?api=1&query=`;
const bing = `https://www.bing.com/maps?where1=`;
const style = "font-weight: bold; width: 100%; text-align: center;";


if (window.location.hostname === "www.homeaway.com") {
window.onload = (e) => {
    const src = document.querySelector('.pdp-map-thumbnail').firstChild.src;
    let params = new URLSearchParams(src);
    let haCoord = params.get("center");
    let haMap = document.querySelector('.listing-overview__map');


haMap.insertAdjacentHTML('beforebegin', `

<a href=${google}${haCoord} style="${style} white-space: normal;" class="label label-default" target="_blank">Google</a><br>
<a href="${bing}${haCoord}&style=h&lvl=18" style="${style} white-space: normal;" class="label label-default" target="_blank">Bing</a>

`);
   document.querySelector('.listing-overview__col').style.cssText = "white-space: normal"
};


}


if(window.location.hostname === "safe-ca.hostcompliance.com" || window.location.hostname === "safe.hostcompliance.com" || window.location.hostname === "secure.hostcompliance.com") {
setTimeout(() => {
    const coord = document.querySelector("#circle").getAttribute("center");
    const map = document.querySelector(".map-container");
    const title = document.querySelectorAll(".md-headline")[2];
    const searchTerm = encodeURIComponent(title.innerText);
    const list = document.querySelectorAll('[ng-if="vm.listing.duplicate_listings.length"]')[0];
    const dupes = (list === undefined) ? 0 : list.getElementsByTagName('A');


    for(let i = 0; i < dupes.length; i++) {
        if(dupes != 0){
            map.insertAdjacentHTML("beforebegin", `
<a class="md-no-style md-button md-ink-ripple" style="${style} font-size: 12px" href=${dupes[i].innerText} target="_blank">${dupes[i].innerText}</a>

`);
        }

}
    map.insertAdjacentHTML("beforebegin", `

<hr>

<a class="md-no-style md-button md-ink-ripple" style="${style}" href=${google}${coord} target="_blank">Google</a><br>
<a class="md-no-style md-button md-ink-ripple" style="${style}" href="${bing}${coord}&style=h&lvl=18" target="_blank">Bing</a>
`);

   title.insertAdjacentHTML("beforeend", `

<a class="md-icon-button md-button md-ink-ripple" target="_blank" href='http://googl.com/#q="${searchTerm}"'>
<md-icon md-font-icon="fa fa-search" class="ng-scope md-font FontAwesome fa fa-search" role="img" aria-label="fa fa-search"></md-icon>

`);

}, 1500);

}