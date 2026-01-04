// ==UserScript==
// @name         HumbleBundle show "choose where your money goes" sliders
// @namespace    driver8.net
// @version      0.1
// @description  A quick fix for Humble hiding the sliders to choose where your money goes
// @author       driver8
// @match        *://*.humblebundle.com/*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425094/HumbleBundle%20show%20%22choose%20where%20your%20money%20goes%22%20sliders.user.js
// @updateURL https://update.greasyfork.org/scripts/425094/HumbleBundle%20show%20%22choose%20where%20your%20money%20goes%22%20sliders.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('hi humble');
    let dataScript = document.getElementById('webpack-bundle-data');
    console.log('script', dataScript);
    let data = JSON.parse(dataScript.innerHTML);
    data.bundleVars.hide_sliders = false;
    dataScript.innerHTML = JSON.stringify(data);
})();