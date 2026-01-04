// ==UserScript==
// @name         YouTube Link to Embedded Video
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      3
// @description  Opens YouTube links in an iframe when the link is clicked
// @author       hacker09
// @match        *://*/*
// @exclude      https://www.youtube.com/*
// @run-at       document-end
// @icon         https://www.youtube.com/s/desktop/03f86491/img/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495214/YouTube%20Link%20to%20Embedded%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/495214/YouTube%20Link%20to%20Embedded%20Video.meta.js
// ==/UserScript==

new MutationObserver(function() { //Starts a new MutationObserver function
  'use strict';
  document.querySelectorAll('[href*="youtube.com/watch?v="], [href*="youtu.be/watch?v="]').forEach(link => { //ForEach YT link
    link.addEventListener('click', function(event) { //When the YT link is clicked
      if (event.target.closest('a') && event.button !== 2 && !event.ctrlKey && !event.metaKey) { //If the CTRL key isn't being holded
        event.preventDefault(); //Prevent it from opening
        window.originalLink = this.outerHTML; //Save link HTML
        this.outerHTML = `<div class='originalLinkPosition'><div class="YTScript"><div style="resize: both;overflow: hidden;width: 555px;height: 373px;position: relative;"><div class="closeButton" style="position: absolute;right: 0px;cursor: pointer;z-index: 10000;">❌</div><iframe style="z-index: 9999;position: absolute;width: 100%;height: 100%;" src="https://www.youtube.com/embed/${this.href.split('&')[0].split('v=')[1]}?autoplay=1" allow="picture-in-picture;" allowfullscreen=""></iframe><div style="position: absolute; bottom: -11px; right: -7px; width: 20px; height: 28px; background-color: red; z-index: 10001; transform: rotate(-135deg);"></div></div></div>`; //Add buttons and iframe
        document.querySelector('.closeButton').addEventListener('click', function() { //When the close button is clicked
          document.querySelector('.originalLinkPosition').outerHTML = originalLink; //Restore original link HTML
          document.querySelector('.YTScript').remove(); //Remove embedded YT video
        }); //Finishes the click event listener
        this.remove(); //Remove current link HTML
      } //Finishes the if condition
    }); //Finishes the click event listener
  });  //Finishes the ForEach loop
}).observe(document, { childList: true, subtree: true }); //Run script on page change