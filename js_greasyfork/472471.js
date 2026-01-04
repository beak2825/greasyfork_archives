// ==UserScript==
// @name         FAL potential ace highlight
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Adds trophy icon to eligible show with most points. If you have already aced show with trophy icon, you have to wait until another show surpass it in points or swap it out from blocking ace.
// @author       pepe
// @match        https://fal.myanimelist.net/*
// @icon         https://fal.myanimelist.net/images/summer/android-touch-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472471/FAL%20potential%20ace%20highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/472471/FAL%20potential%20ace%20highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function find_ace_target(){
        let top_pts_below_cap = {pts: 0, index: -1}
        let team = document.querySelectorAll('.grid > .mt-4') // select all shows in grid
        for(let [i, show] of team.entries()){
            if(i<5){ // active only
                //NOTE checking threshold this way since fal does not combine watching+completed when show finishes so there are edge cases where watching number goes below ace threshold
                let above_threshold = show.querySelector('.my-1 p:nth-child(4)').className.includes('text-ace-threshold') // if shows class includes 'text-ace-threshold' it is above threshold
                if (above_threshold == false){ // below watching threshold
                    let pts = parseInt(show.querySelector('.my-1 p:nth-child(2)').textContent.replace(/,/g,'')) // replace thousand separator
                    if (pts > top_pts_below_cap.pts){ // most points
                        top_pts_below_cap.pts = pts
                        top_pts_below_cap.index = (i+1).toString() // position of show in active
                    }
                }
            }
        }
        document.querySelector(`.grid > .mt-4:nth-child(${top_pts_below_cap.index}) .my-1 p:nth-child(2)`).prepend('🏆')
    }

    // https://stackoverflow.com/questions/3219758/detect-changes-in-the-dom/3219767#3219767
    var targetNode = document.getElementsByClassName('grid')[0];
    var config = { subtree: true, characterData: true}; // works with this config, other variables add multiple trophies

    var observer = new MutationObserver(find_ace_target);
    observer.observe(targetNode, config); // detect dom change when swapping/acing

    find_ace_target(); // initial page load
 })();