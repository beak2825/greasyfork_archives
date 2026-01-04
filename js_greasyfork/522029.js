// ==UserScript==
// @name         Hide Promoted job posts Linkedin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script removes any promoted job posting on the Linkedin job board.
// @author       You
// @match        https://www.linkedin.com/jobs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522029/Hide%20Promoted%20job%20posts%20Linkedin.user.js
// @updateURL https://update.greasyfork.org/scripts/522029/Hide%20Promoted%20job%20posts%20Linkedin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hidePromotedJobs() {
        var job_card = document.querySelectorAll(".job-card-container");
        let i = 0;
        while (i < job_card.length) {
            var first_footer_item = job_card[i].querySelector(".job-card-container__footer-item")
            var promoted_tree = job_card[i].querySelectorAll(".job-card-container__footer-item")[1]?.textContent.trim();

            if(first_footer_item){
               if (first_footer_item.textContent.trim() == "Promoted" || promoted_tree == "Promoted"){
                   job_card[i].style.display = 'none';//does not work, because overriden by !important
                   console.log("found promoted");
                   job_card[i].remove();
               }
            }

            i++;
        }
    }

    var intervalId;

    // Set a timeout to delay the start of the interval
    setTimeout(function() {
        intervalId = setInterval(function() {
            hidePromotedJobs();
        }, 1000); // This function runs every 1000 ms (1 second) after the initial delay
    }, 2000); // Adjust this delay as needed, example here is 2000 ms (2 seconds)



})();