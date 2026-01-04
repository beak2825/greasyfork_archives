// ==UserScript==
// @name         Link Map in Google Search to Google Maps
// @namespace    https://tante.cc/
// @version      1.0
// @description  Try to re-add the link to Google Maps when Google Search returns a map (was removed due to EU DSA)
// @author       tante <tante@tante.cc>
// @license      GPL-3
// @match        https://www.google.com/search*
// @match        https://google.com/search*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/489881/Link%20Map%20in%20Google%20Search%20to%20Google%20Maps.user.js
// @updateURL https://update.greasyfork.org/scripts/489881/Link%20Map%20in%20Google%20Search%20to%20Google%20Maps.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let mapNode = document.getElementById("lu_map");
    let query = document.evaluate("//*[@name='q']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value;

    // wrap iamge in link to maps search with the same query as the google search
    let parent = mapNode.parentNode;
    let link = document.createElement('a');
    link.href = 'https://www.google.com/maps/search/?api=1&query='+ query.replaceAll(" ", "+");
    link.appendChild(mapNode.cloneNode(true));
    parent.replaceChild(link, mapNode);
})();