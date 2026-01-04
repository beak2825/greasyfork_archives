// ==UserScript==
// @name        Internet Road Trip: Fix Place Name
// @namespace   crschmidt.net/scripts/fixplacename
// @match       https://neal.fun/*
// @version     0.3.1
// @license     MIT
// @author      crschmidt
// @description Fix place names in Canada (and somewhat better in rural US).
// @require     https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/537253/Internet%20Road%20Trip%3A%20Fix%20Place%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/537253/Internet%20Road%20Trip%3A%20Fix%20Place%20Name.meta.js
// ==/UserScript==
(async function() {

var locationName = function() {
    var parts = [];
    if (!this.currentLocation) { return ''; }
    if (this.currentLocation.neighborhood) {
      parts.push(this.currentLocation.neighborhood);
    } else if (this.currentLocation.county) {
        parts.push(this.currentLocation.county);
    }
    if (this.currentLocation.state) {
      parts.push(this.currentLocation.state);
    }
    if (this.currentLocation.country != "United States") {
        parts.push(this.currentLocation.country);
    }
    return parts.join(", ");
}
console.log("Enabling crschmidt name adjuster");
    (await IRF.vdom.container).state._computedWatchers.locationName.getter = locationName;
})();