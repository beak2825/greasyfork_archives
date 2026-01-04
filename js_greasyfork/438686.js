// ==UserScript==
// @name         TORN EST-GMT-Time
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description TORN GMT and TORN TIME
// @author      xedx [2100735]
// @include     https://www.torn.com/*
// @grant     https://raw.githubusercontent.com/awolfa/Torn-UserScripts/main/Torn%20Time/EST-GMT-Time
// @grant     GM_addStyle
// @grant     unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438686/TORN%20EST-GMT-Time.user.js
// @updateURL https://update.greasyfork.org/scripts/438686/TORN%20EST-GMT-Time.meta.js
// ==/UserScript==

//xedx [2100735] thinks Red-Rabbit [2203961] is coolest person in the world and anyone using this app should send her all kinds of goodies.  
//But if you really like this app, say thanks to xdex with a Donator Pack

//If you have difficulty on where the time is located accross your screen, then change the width % under GM add style .addtime est

(function() {
    'use strict';

    GM_addStyle(`
           .my-flex {display: flex;}
           .add-time-est {text-align: right; font-size: 16px; font-weight: bold;
                          color: blue; margin-left: 100px; width: 40%;}
           .add-time-gmt {text-align: left; font-size: 16px; font-weight: bold;
                          color: red; margin-left: 25px;}`
    );

    // Functions to return the date formatted as EST/GMT
    const format = (date, tz) => date.toLocaleTimeString('en-US', {timeZone: tz});
    const displayEST = (date = new Date()) => 'EST: ' + format(date, 'EST');
    const displayUTC = (date = new Date()) => 'TCT: ' + format(date, 'GMT');

    // Function called to update the time
    const update = () => {targetEST.textContent = displayEST(); targetGMT.textContent = displayUTC()};

    // Create the felx wrapper div, the EST span, and GMT span
    // Note: we can add text directly using JQuery. However, when we want to refer to it later,
    // for example when appending the EST and GST nodes, we need an actual node, so we can get that
    // using the JQuery syntax, $("#<id>"). where id is "my-wrapper"
    const flexDiv = '<div class="my-flex" id="my-wrapper"></div>';

    // These I left as created nodes, so that when updating, we can just refer to the node.
    // Otherwise, we could use the same trick, above, and give them ID's, and refer to them
    // in the update function as $("#<targetEST.id>) etc.
    // For example, const targetEST = '<span class="header-bottom-text add-time-est" id="EST"></span>';
    // then, const update = () => {$("#EST").textContent = ...
    const targetEST = document.createElement('span');
    targetEST.classList.add('header-bottom-text', 'add-time-est');

    const targetGMT = document.createElement('span');
    targetGMT.classList.add('header-bottom-text', 'add-time-gmt');

    // Add the wrapper to the existing header, then to that, add the two 'clocks'
    let sel = document.querySelector('.header-wrapper-bottom');
    $(sel).append(flexDiv); // Can only use this method (appending text) when using the JQuery syntax, $(...).append()
    $("#my-wrapper").append(targetEST); // This appends an actual node, created with createElement
    $("#my-wrapper").append(targetGMT);

    // Start the timer to update every second
    setInterval(update, 1000);

})();
