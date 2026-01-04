// ==UserScript==
// @name         bDEp
// @namespace    http://tampermonkey.net/
// @version      2025-01-06
// @description  Download Exam Papers Instantly
// @author       Strbeni
// @license      MIT
// @include      https://brpaper.com/downloads/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522931/bDEp.user.js
// @updateURL https://update.greasyfork.org/scripts/522931/bDEp.meta.js
// ==/UserScript==


(function() {
    'use strict';
// You can Use This Code ;)
// This Code was Short Too Short Lmao but I added some functions to make it look complex

    function getLoc() {
        let locationData = window.location.href;
        console.log("Original location URL fetched:", locationData);
        return locationData;
    }

    function modifyURL(url, pattern, replacement) {
        let newURL = url.split(pattern).join(replacement);
        return newURL;
    }

    function modLi(url) {
        let modifiedURL = url;
        modifiedURL = modifyURL(modifiedURL, '/downloads/', '/downloader/');
        modifiedURL = manLi(modifiedURL);
        return modifiedURL;
    }

    function manLi(url) {
        let manipulatedURL = url.split('').reverse().join('');
        manipulatedURL = manipulatedURL.replace('rpd', 'rpdcomplex');
        manipulatedURL = manipulatedURL.split('').reverse().join('');
        return manipulatedURL;
    }

    function initRed(url) {
        setTimeout(() => {
            window.location.href = url;
            console.log('Redirection performed!');
        }, 1000);
    }


    let downL = getLoc();
    let chL = modLi(downL);

    initRed(chL);

})();
