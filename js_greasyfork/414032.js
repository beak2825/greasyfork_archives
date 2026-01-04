// ==UserScript==
// @name         CT Draw Map
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Torn CT - Draw Map
// @author       Jox [1714547]
// @match        https://www.torn.com/christmas_town.php*
// @require      https://greasyfork.org/scripts/392756-torn-ct-map-draw-class/code/Torn%20CT%20Map%20Draw%20Class.user.js?v=9
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414032/CT%20Draw%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/414032/CT%20Draw%20Map.meta.js
// ==/UserScript==

(function() {
'use strict';

    //Initialize class
    var ctMap = new ctMapDraw(document.querySelector('.core-layout__viewport'));

    var fetchData = null;
    var fetchUrl = 'https://www.torn.com/christmas_town.php?q=';

    function onFetch(){
        //Draw map
        ctMap.draw();
    }

    // save the original fetch
    const original_fetch = fetch

    // replace the page's fetch with our own
    window.fetch = async (input, init) => {

        const response = await original_fetch(input, init)

        // on certain requests...
        if (response.url.startsWith(fetchUrl)) {
            // clone the response so we can look at its contents
            // otherwise we'll consume them and the page won't be able to read them
            const clone = response.clone()

            // parse and read the cloned response as json(), text() or whatever
            // note we do not await or we'll delay the response for the page
            //clone.json().then((json) => console.log('fetched data', json))
            clone.json().then((json) => {fetchData = json; onFetch()});
        }

        return response
    }

})();