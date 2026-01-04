// ==UserScript==
// @name         lain.radio-plugin
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  lain.radio-simple-plugin
// @author       EikoAkiba
// @match        https://lain.radio/public/lain.radio
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lain.radio
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465484/lainradio-plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/465484/lainradio-plugin.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // Find title element
    const text = document.getElementsByClassName("card-title")[0];
    // Change text (Just for better experience)
    text.innerHTML = "lain.radio - Listeners 0";
    // get API data
    function getData() {
        // fetch data
        const response = fetch("https://lain.radio/api/nowplaying")
        // convert it to json
        .then((response) => response.json() )
        return response;
    }
        // fetch data for first time
        getData().then((data) => {
            // write current listener count
            text.innerHTML = "lain.radio - Listeners " + data[0].listeners.current
        });
    // setInterval that each 8 second can change the counter value
    var asd = setInterval(()=>{
        getData().then((data) => {
            text.innerHTML = "lain.radio - Listeners " + data[0].listeners.current
        });
    }, 8000);

})();