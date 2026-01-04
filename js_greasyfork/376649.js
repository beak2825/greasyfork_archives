// ==UserScript==
// @name     Kioskify Meetup.com Events
// @version  3
// @grant    none
// @run-at   document-start
// @match    https://*.meetup.com/*events*
// @license  GNU General Public License v3.0 only
// @supportURL https://gitlab.com/zyphlar/kioskify-meetup-events
// @contributionURL https://gitlab.com/zyphlar/kioskify-meetup-events
// @compatible firefox
// @compatible chrome
// @namespace https://greasyfork.org/users/236588
// @description Want to show Meetup.com events on a screen 24/7? Use this script to make it look better. NOTE: if the script doesn't load, try going directly to the events url instead of browsing to it.
// @downloadURL https://update.greasyfork.org/scripts/376649/Kioskify%20Meetupcom%20Events.user.js
// @updateURL https://update.greasyfork.org/scripts/376649/Kioskify%20Meetupcom%20Events.meta.js
// ==/UserScript==

// Copyright (C) 2019  zyphlar
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


"use strict";

function simplifyMeetup(){
  console.log("Simplifying your life...");

  //hideElementsByClassName("groupHomeHeader"); // large group name and image at top
  hideElementsByClassName("stripe");            // all full-width "chrome" on page
  hideElementsByClassName("sticky-ontheside");  // upcoming/past/drafts widget
  hideElementsByClassName("relatedEvents");     // other events at far bottom 
  
  // add padding to top for scroll
  try {
    var padding = document.createElement("p");
    padding.style = "margin:400px";
    document.getElementsByClassName("eventList-list")[0].prepend(padding);
  } catch (e) { console.log(e); }

  // add banner to header
  try {
    document.getElementsByClassName("navItem")[0].innerHTML += '<h3 style="display: inline-block;margin-left: 8em;font-size: 1.5em;vertical-align: top;">Upcoming Events</h3>';
  } catch (e) { console.log(e); }

  // make header fixed
  try {
    document.getElementById("globalNav").style = "position: fixed; width: 100%;";
  } catch (e) { console.log(e); } 

  // add fixed footer
  try {
    var footer = document.createElement("div");
    footer.style = "position:fixed; bottom: 0; width: 100%; background: white; padding: 1em; border-top: 2px solid rgba(46,62,72,.12); text-align: center;";
    footer.innerHTML = "See details at <span style='color: #00a2c7;font-weight: 600;'>ChimeraArts.org</span> or <span style='color: #00a2c7;font-weight: 600;'>Meetup.com</span>!";
    document.getElementsByTagName("body")[0].append(footer);
  } catch (e) { console.log(e); }
}


function hideElementById(id) {
  var e = document.getElementById(id);
  if (e) {
    e.style = "display: none;";
  }
}

function hideElementsByClassName(name) {
  var e = document.getElementsByClassName(name);
  for (var i=0;i<e.length;i++) {
    e[i].style = "display: none;";
  }
}

function hideElementsBySelector(selector) {
  var f = document.querySelectorAll(selector);
  for (var i=0;i<f.length;i++) {
    f[i].style = "display: none;";
  }
}



function scrollMeetup(){
  var pixelsToScroll = document.documentElement.offsetHeight;
  var pixelsPerSec = 100;
  
  // go to bottom slowly
  scrollToY(pixelsToScroll, pixelsPerSec, 'linearTween', function(){
    // return to top quickly
    scrollToY(0, 1000, 'linearTween', function(){
      scrollMeetup(); // set up dat sweet infinite loop
    });
  });
}


window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function scrollToY(scrollTargetY, speed, easing, callback) {
    // scrollTargetY: the target scrollY property of the window
    // speed: time in pixels per second
    // easing: easing equation to use

    var scrollY = window.scrollY || document.documentElement.scrollTop,
        scrollTargetY = scrollTargetY || 0,
        speed = speed || 2000,
        easing = easing || 'easeOutSine',
        currentTime = 0;

    // min time .1, max time 60 minutes
    var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, 60000));

    // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
    var easingEquations = {
            linearTween: function (pos) {
              return pos;
            },
            easeOutSine: function (pos) {
                return Math.sin(pos * (Math.PI / 2));
            },
            easeInOutSine: function (pos) {
                return (-0.5 * (Math.cos(Math.PI * pos) - 1));
            },
            easeInOutQuint: function (pos) {
                if ((pos /= 0.5) < 1) {
                    return 0.5 * Math.pow(pos, 5);
                }
                return 0.5 * (Math.pow((pos - 2), 5) + 2);
            }
        };

    console.log('scroll begin');
  
    // add animation loop
    function tick() {
        currentTime += 1 / 60;

        var p = currentTime / time;
        var t = easingEquations[easing](p);

        if (p < 1) {
            requestAnimFrame(tick);

            window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
        } else {
            console.log('scroll done');
            window.scrollTo(0, scrollTargetY);
          	callback();
        }
    }

    // call it once to get started
    tick();
}



window.addEventListener("load", function(){
  simplifyMeetup();  // clear extra stuff
  document.scrollingElement.scrollTop = 0; // reset to top
  scrollMeetup(); // begin scroll
});

//window.addEventListener("complete", simplifyMeetup);

setTimeout(function(){ location.reload(); }, 3600000); // reload page every hour 



