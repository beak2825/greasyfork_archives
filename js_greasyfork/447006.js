// ==UserScript==
// @name GeoGuessr Map Maker Search Extender
// @namespace   ggmmse
// @description Extend the possibilities of the search bar in the GeoGuessr Map Maker
// @version 0.1
// @match https://www.geoguessr.com/*
// @require https://openuserjs.org/src/libs/xsanda/Run_code_as_client.js
// @require https://openuserjs.org/src/libs/xsanda/Google_Maps_Promise.js
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447006/GeoGuessr%20Map%20Maker%20Search%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/447006/GeoGuessr%20Map%20Maker%20Search%20Extender.meta.js
// ==/UserScript==

googleMapsPromise.then(() => runAsClient(() => {
  const google = window.google;

  const oldAutocomplete = google.maps.places.Autocomplete;
  google.maps.places.Autocomplete = Object.assign(function (...args) {
    args[1]["types"] = ["geocode", "establishment"]
    const res = oldAutocomplete.apply(this, args);
    return res;  
  }, {
    prototype: Object.create(oldAutocomplete.prototype)
  });
}));
