// ==UserScript==
// @name         Auto Downloader
// @namespace    AutoDownloader
// @version      10
// @description  Automatically download on drive.google.com, file4go.net and mp4upload.com
// @author       hacker09
// @match        http://www.file4go.net/*
// @match        https://www.mp4upload.com/*
// @match        https://drive.google.com/uc?id=*
// @icon         https://cdn.iconscout.com/icon/free/png-256/icloud-download-475016.png
// @grant        none
// @run-at       document-end
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/428227/Auto%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/428227/Auto%20Downloader.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (location.href.match('file4go') !== null) //If the user is on the file4go website
  { //Starts the if condition
    if (document.querySelectorAll("form")[1] !== undefined) //If the Create download button exists
    { //Starts the if condition
      document.querySelectorAll("form")[1].submit(); //Click on the create download button
    } //Finishes the if condition
    document.querySelector("a.novobotao.download").click(); //Clicks on the final download button
    window.onload = function() { //When the page is fully loaded
      setTimeout(function() { //Starts the setTimeout function
        window.top.close(); //Closes the tab
      }, 2000); //Finishes the setTimeout function
    } //Finishes the onload event listener
  } //Finishes the if condition

  if (location.href.match('mp4upload') !== null) //If the user is on the mp4upload website
  { //Starts the if condition
    if (document.querySelector("#method_free") !== null) // If the free download button exists
    { //Starts the if condition
      document.querySelector("#method_free").click(); //Click on the free download button
    } //Finishes the if condition
    else //If the free download button doesn't exist
    { //Starts the else condition
      document.querySelector('form')?.submit(); //Download the file
      window.onload = function() { //When the page is fully loaded
        setTimeout(function() { //Starts the setTimeout function
          window.top.close(); //Closes the tab
        }, 2500); //Finishes the setTimeout function
      } //Finishes the onload event listener
    } //Finishes the else condition
  } //Finishes the if condition

  if (location.href.match('drive.google') !== null) //If the user is on the google drive website
  { //Starts the if condition
    document.querySelector("#uc-download-link").click(); //Clicks on the download button
    window.onload = function() { //When the page is fully loaded
      setTimeout(function() { //Starts the setTimeout function
        window.top.close(); //Closes the tab
      }, 2000); //Finishes the setTimeout function
    } //Finishes the onload event listener
  } //Finishes the if condition
})();