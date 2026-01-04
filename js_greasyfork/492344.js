// ==UserScript==
// @name        OpenStreetMap !osm proper redirect from ecosia.org
// @match       https://www.ecosia.org/search*
// @grant       none
// @version     1.0
// @license     MIT
// @author      -
// @description Just redirect to OpenStreetMap when using !osm in the search bar
// @namespace https://greasyfork.org/users/1287357
// @downloadURL https://update.greasyfork.org/scripts/492344/OpenStreetMap%20%21osm%20proper%20redirect%20from%20ecosiaorg.user.js
// @updateURL https://update.greasyfork.org/scripts/492344/OpenStreetMap%20%21osm%20proper%20redirect%20from%20ecosiaorg.meta.js
// ==/UserScript==


if (document.getElementsByClassName('search-form__input')[0].value.includes("!osm")){
  window.location.replace("https://www.openstreetmap.org/search?query=" + document.getElementsByClassName('search-form__input')[0].value.replace("!osm",''));
}