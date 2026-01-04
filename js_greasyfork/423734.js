// ==UserScript==
// @name         RR Timer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Records RR game start time
// @author       MeRocks
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423734/RR%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/423734/RR%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

 $(document).ready(() => {
var $zzz = jQuery.noConflict();

var targetNode = document.querySelector("#react-root")

const mutationCozChedFkrUsesReact = { attributes: false, childList: true, subtree: true };

 const copypastefromgoogle = function(mutationsList, observer) {
     for(const mutation of mutationsList) {
        if(mutation.target.getAttribute('id')) // if a new rr game has started
        {
            if(mutation.target.getAttribute('id').includes("online-user"))
            {
               if(mutation.target.parentNode.parentNode.nextSibling.className.includes("statusBlock"))
                  {
                      var statusobject = mutation.target.parentNode.parentNode.nextSibling;
                      var targettimer = new Date();
                      targettimer.setMinutes(targettimer.getMinutes() + 15);

                      var timestarted = document.querySelector(".server-date-time").innerHTML;

                      var x = setInterval(function() {

                          // Get today's date and time
                          var now = new Date().getTime();

                          // Find the distance between now and the count down date
                          var distance = targettimer.getTime() - now;

                          // Time calculations for days, hours, minutes and seconds
                         // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                         // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                          var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                          // Display the result in the element with id="demo"
                          statusobject.innerHTML = minutes + "m " + seconds + "s , Time Started: "+timestarted;

                          // If the count down is finished, write some text
                          if (distance < 0) {
                              clearInterval(x);
                              console.log("is done mate")
                          }
                      }, 1000);
                  }
            }
        }
        
     }
 }

 // Create an observer instance linked to the callback function
  const observer = new MutationObserver(copypastefromgoogle);

  // Start observing the target node for configured mutations
if(targetNode)
  observer.observe(targetNode, mutationCozChedFkrUsesReact);

 })

    })();
