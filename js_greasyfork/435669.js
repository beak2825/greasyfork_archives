// ==UserScript==
// @name         Redirect YT video to embedded video
// @namespace    YTRedir
// @version      22
// @description  Redirects any opened YT video to the YT embedded video to make the video take up the whole screen.
// @author       hacker09
// @include      https://m.youtube.com/*
// @include      https://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/03f86491/img/favicon.ico
// @run-at       document-start
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/435669/Redirect%20YT%20video%20to%20embedded%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/435669/Redirect%20YT%20video%20to%20embedded%20video.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const BypassTT = window.trustedTypes?.createPolicy('BypassTT', { createHTML: HTML => HTML }); //Bypass trustedTypes

  function Run() { //Creates a new function
    if ((location.pathname !== '/') && (location.href.match('/watch') !== null) && (location.href.match(/&list=|&t=1s|embed/) === null)) //As long as it's not the YT index page, the URL is a video, it's not a playlist/embedded video, and doesn't have '&t=1s' in the end of the URL
    { //Starts the if condition
      const YTID = location.href.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/)[2].split(/[^0-9a-z_\-]/i)[0]; //Store the YT video ID
      history.replaceState(null, "", 'https://www.youtube.com/embed/' + YTID + '?autoplay=1&mute=1'); //Rewrite history
      location.reload(); //Force full reload
    } //Finishes the if condition
  } //Finishes the Run function

  Run(); //Calls the Run function

  window.ontransitionrun = function() { //When the video is changed
    Run(); //Calls the Run function
  }; //Finishes the transition run event listener

  window.onload = function() { //When the page loads
    if (location.href.match('embed') !== null) //As long as the URL is an embedded video
    { //Starts the if condition
      document.querySelector(".ytp-error-content-wrap-subreason > span > a, .ytp-error-content-wrap-subreason > div > a") !== null ? open(document.querySelector(".ytp-error-content-wrap-subreason > span > a, .ytp-error-content-wrap-subreason > div > a").href += '&t=1s', '_self') : ''; //If the video can only be seen on youtube.com, redirect it
      document.querySelector("a.ytp-title-link").outerHTML = (html => BypassTT?.createHTML(html) || html)(document.querySelector("a.ytp-title-link").outerHTML); //Remove the event listeners of the element
      document.querySelector("a.ytp-title-link").href += '&t=1s'; //Add URL parameter to start video on the first second of the video, so that the script won't redirect the URL
      document.querySelector("a.ytp-title-link").target = '_self'; //Open the video in the same tab
      document.querySelector(".ytp-button.yt-uix-sessionlink").outerHTML = (html => BypassTT?.createHTML(html) || html)(document.querySelector(".ytp-button.yt-uix-sessionlink").outerHTML); //Remove the event listeners of the element
      document.querySelector(".ytp-button.yt-uix-sessionlink").href += '&t=1s'; //Add URL parameter to start video on the first second of the video, so that the script won't redirect the URL
      document.querySelector(".ytp-button.yt-uix-sessionlink").target = '_self'; //Open the video in the same tab
      setTimeout(function() { //Starts the setimeout function
        document.querySelector('#movie_player').playVideo(); //Play the video
        document.querySelector(".ytp-mute-button.ytp-button").title.match('Unmute') !== null ? document.querySelector(".ytp-mute-button.ytp-button").click() : ''; //Unmute the video
      }, 500); //Finishes the setimeout function
    } //Finishes the if condition
  }; //Finishes the onload event listener
})();