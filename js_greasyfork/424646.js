// ==UserScript==
// @name         Better Scio Preparation
// @namespace    https://ib.scio.cz/*
// @version      0.1
// @description  Make your successful answer look good. I hate "strašidýlko" character in my Scio test preparation.
// @author       sirluky
// @match        https://ib.scio.cz/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424646/Better%20Scio%20Preparation.user.js
// @updateURL https://update.greasyfork.org/scripts/424646/Better%20Scio%20Preparation.meta.js
// ==/UserScript==

(function() {
    'use strict';
let a = document.querySelectorAll("img[src='/Content/Img/Prompts/elvira_kladna.gif']");
a[a.length-1].src = "https://source.unsplash.com/140x140/?bikini"
    // Your code here...
})();