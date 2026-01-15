// ==UserScript==
// @name         Broken Trailer Search - YIFY Movies
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      4
// @description  Clicking on the YouTube Trailer embedded video will search for the movie title and year on Google if the video is broken.
// @author       hacker09
// @include      https://yts.*/movies/*
// @icon         https://yts.*/assets/images/website/apple-touch-icon-180x180.png
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494457/Broken%20Trailer%20Search%20-%20YIFY%20Movies.user.js
// @updateURL https://update.greasyfork.org/scripts/494457/Broken%20Trailer%20Search%20-%20YIFY%20Movies.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (document.querySelector('.youtube.cboxElement').href === "https://www.youtube.com/embed/?rel=0&wmode=transparent&border=0&autoplay=1&iv_load_policy=3") //If the YT video is broken
  { //Starts the if condition
    document.querySelector('.youtube.cboxElement').addEventListener('click', function() { //When the YT video is clicked
      location.href = `https://www.google.com/search?q=${document.querySelector('.hidden-xs > h1').innerText + ' ' + document.querySelector('.hidden-xs > h2').innerText}&tbm=vid`; //Search on Google
    }); //Finishes the onclick event listener
  } //Finishes the if condition
})();