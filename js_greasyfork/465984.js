// ==UserScript==
// @name         Total Time - Linkedin Learn
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      1
// @description  Shows the total time an Linkedin Learn course will take to finish.
// @author       hacker09
// @match        https://www.linkedin.com/learning/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://linkedin.com&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465984/Total%20Time%20-%20Linkedin%20Learn.user.js
// @updateURL https://update.greasyfork.org/scripts/465984/Total%20Time%20-%20Linkedin%20Learn.meta.js
// ==/UserScript==

(function() {
  'use strict';
  //https://www.linkedin.com/learning/secure-coding-in-python/using-a-separate-python-environment-for-isolation?autoAdvance=true&autoSkip=true&autoplay=true&resume=false&u=2153100
  mins = [];
secs =  [];
  document.querySelectorAll("div.t-12.t-white--light > span").forEach(function(el){
    mins.push(el.innerText.match(/\d+m /)[0].replace('m ','')); // 2 +6 +4 +2 +8 +3 +6 +2 +2 +1 +3 +5 +4 +9 +5 +3 +1 +1 +1 +5 +4 +1
    secs.push(el.innerText.match(/\d+s/)[0].replace('s','')); //  23+5+22+14+52+40+2+43+20+27+6+42+29+13+16+4+51+49+47+7+28+2
    })
})();