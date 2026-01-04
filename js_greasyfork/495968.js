// ==UserScript==
// @name         Fuck the Unrated Buttons
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Force unrated button to disabled
// @author       traindoggo
// @match        https://onlinemathcontest.com/contests/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onlinemathcontest.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495968/Fuck%20the%20Unrated%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/495968/Fuck%20the%20Unrated%20Buttons.meta.js
// ==/UserScript==

/*
  Why is there an Unrated button on every contest?
  You chickenshits who enter with "Unrated" should go
  back to the fuckin Ofuton, you bitches.
  This scripts forces unrated button to disabled.

  and you know, This script will never be updated again.
*/

(function() {
    'use strict';

    // css path from firefox dev mode
    const filter = `html body main main section#contests.module.pb-0
    div.container.mundb-standard-container div.row div.col-sm-12.col-lg-4
    contest-card div div button.btn.btn-secondary`;

    const unrated_button = document.querySelector(filter);
    unrated_button.disabled = true;

    unrated_button.addEventListener("mouseover", function(event) {
        this.textContent = "Unratedとして参加(笑)";
        this.style.color = "white";
        this.style.backgroundColor = "red";
    });

    unrated_button.addEventListener("mouseleave", function(event) {
        this.style.color = "white";
        this.style.backgroundColor = "black";
    });
})();
