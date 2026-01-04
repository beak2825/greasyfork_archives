// ==UserScript==
// @name         Booru loop
// @version      0.3
// @description  Image slideshow
// @author       TekuSP
// @match        https://derpibooru.org/images/*
// @match        https://ponybooru.org/images/*
// @match        https://ponerpics.org/images/*
// @match        https://twibooru.org/*
// @match        https://manebooru.art/images/*
// @grant        none
// @namespace https://greasyfork.org/users/715130
// @downloadURL https://update.greasyfork.org/scripts/418419/Booru%20loop.user.js
// @updateURL https://update.greasyfork.org/scripts/418419/Booru%20loop.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function sleep(ms)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function Main()
    {
         var random = document.getElementsByClassName("fa-random")[0]; //Get random button
         await sleep(300000); //Sleep 5 minutes
         random.click(); //Click it
    }
    Main();
})();