// ==UserScript==
// @name         DECIPHER - Enlarge Project Title
// @version      1.1
// @description  Enlarges the top bar, so the project title is more easily visible
// @author       Scott Searle
// @include      https://survey-*.dynata.com/*
// @include      *selfserve
// @grant        none
// @namespace https://greasyfork.org/users/232210
// @downloadURL https://update.greasyfork.org/scripts/385586/DECIPHER%20-%20Enlarge%20Project%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/385586/DECIPHER%20-%20Enlarge%20Project%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jQuery = window.jQuery; //Need for Tampermonkey or it raises warnings.

var myInitTimer = setInterval(myInitFunction,50);
function myInitFunction()
  {
      //For XML views, and project view pages
      jQuery(".gh-support").css("max-width","30px");  //Shrinks the are the "Help" takes up on the top-right.
      jQuery(".gh-title").css("min-width","750px");  //Enlarges area used for "Title" of study
      jQuery(".gh-nav-row").css("max-width","500px"); //Deals with main tabs

      //For the main portal project list view
      jQuery(".projects-list").css("margin-left","20px"); //Make it look nice :D
      jQuery(".projects-list").css("margin-right","20px");//More nice stuff here
      jQuery(".projects-list").css("min-width","95%"); 	//Make the main portal larger
      //clearInterval(myInitTimer);
  }
})();