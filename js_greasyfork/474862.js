// ==UserScript==
// @name         Custom - HotPornFile Button Press Helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Presses a button that helps the usage of hotpornfile.org.
// @author       KeratosAndro4590
// @match        https://www.hotpornfile.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hotpornfile.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474862/Custom%20-%20HotPornFile%20Button%20Press%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/474862/Custom%20-%20HotPornFile%20Button%20Press%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }*/
    // Fixed sleep delay causing buttons to not be pressed.
    // await sleep(4000);

    // Clicks the pink Download button
    // let downloadButton = document.querySelector("[name='get_challenge']");
    let downloadButton = document.querySelector("button");

    console.clear();

    if(downloadButton)
    {
        downloadButton.click();
        console.log("Clicked pink download button.");
    }

    // Clicks the pink Comment button
    let commentButton = document.querySelector("[id='dcl_comment_btn']");
    if(commentButton)
    {
        commentButton.click();
        console.log("Clicked pink comment button.");
    }

})();