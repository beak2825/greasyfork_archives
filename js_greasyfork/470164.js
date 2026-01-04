// ==UserScript==
// @name         Auto-Select YouTube Subtitles by Sapioit
// @namespace    Sapioit
// @copyright    Sapioit, 2020 - Present
// @author       sapioitgmail.com
// @license      GPL-2.0-only; http://www.gnu.org/licenses/gpl-2.0.txt
// @version      2.15.0.3
// @description  Automatically selects the YouTube subtitles with the text "English (auto-generated)"
// @match        https://*.youtube.com/*
// @match        https://youtube.com/*
// @match        https://youtu.be/*
// @icon         https://youtube.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470164/Auto-Select%20YouTube%20Subtitles%20by%20Sapioit.user.js
// @updateURL https://update.greasyfork.org/scripts/470164/Auto-Select%20YouTube%20Subtitles%20by%20Sapioit.meta.js
// ==/UserScript==


var changed_page_= false;
document.addEventListener('spfdone', function() {
  changed_page_ = true;
  //alert("changed link 1 spfdone");
});
document.addEventListener('transitionend', function(e) {
  //alert("changed link 2 transitionend");
  if (e.target.id === 'progress'){
    changed_page_ = true;
    //alert("changed link 2 transitionend progress");
  }
});
window.addEventListener('load', function () {
  changed_page_ = true;
  //alert("changed link 3 load");
});

window.addEventListener('yt-page-data-updated', function () {
  changed_page_ = true;
  //alert("changed link 4 url change");
});

function changed_link_(){
  if (changed_page_) {
    changed_page_ = false;
    return true;
  }
  return false;
}


localStorage.setItem('currentTitleValue', null);
localStorage.setItem('consecutiveUnchangedCount', 0);
let isFocused = () => typeof document.hidden !== undefined ? !document.hidden : null;

let repeatInterval = 5000; // 1000 milliseconds = 1 second; 10000 milliseconds = 10 second;
let waitInterval = 5; // Adjust the delay (in milliseconds) if needed. 1000 = 1 second.

const userAgent = navigator.userAgent;

if (userAgent.includes("Chrome")) {
  // Code for Chrome
  console.log("Running on Chrome");
  // Change variables for Chrome
} else if (userAgent.includes("Edg")) {
  // Code for Edge (Chromium-based Edge)
  console.log("Running on Edge");
  // Change variables for Edge
  let repeatInterval = 500; // 1000 milliseconds = 1 second; 10000 milliseconds = 10 second;
  let waitInterval = 1; // Adjust the delay (in milliseconds) if needed. 1000 = 1 second.
} else {
  // Code for other browsers
  console.log("Running on a different browser");
  // Change variables for other browsers
}
setTimeout(() => {
  document.querySelectorAll('.ytp-settings-button').click();
  setTimeout(() => {
    document.querySelectorAll('.ytp-settings-button').click();
  }, waitInterval);
}, waitInterval);


function title_has_changed (count = 3) {
  console.info("%cAuto-Select YouTube Subtitles by Sapioit: changed_link(): %c" + changed_page_, "color: yellow; background-color: black;", "color: cyan");
  console.info("%cAuto-Select YouTube Subtitles by Sapioit: title_has_changed: %cChecking title.", "color: yellow; background-color: black;", "color: white");
  if (localStorage.getItem('currentTitleValue') === null) {
    console.info("%cAuto-Select YouTube Subtitles by Sapioit: title_has_changed: %cClicking the settigns button twice.", "color: yellow; background-color: black;", "color: white");
  }

  // Check if the value of the title (the first "yt-formatted-string.style-scope.ytd-watch-metadata" element) has changed
  let currentTitleValue = document.querySelector('h1 yt-formatted-string.style-scope.ytd-watch-metadata');
  //let currentTitle = currentTitleValue ? currentTitleValue.innerHTML : '';
  currentTitleValue = currentTitleValue ? currentTitleValue.innerHTML : '';

  if ( currentTitleValue === null || (typeof currentTitleValue) === 'undefined' || !currentTitleValue || currentTitleValue === '') {
    console.info("Auto-Select YouTube Subtitles by Sapioit: title_has_changed: %cThe 'h1 yt-formatted-string.style-scope.ytd-watch-metadata' is either NULL or UNDEFINED or empty.", "color: red");
    console.info("%cAuto-Select YouTube Subtitles by Sapioit: title_has_changed: %c", "color: red", "color: default", currentTitleValue , (typeof currentTitleValue));
    return false;
  }

  console.info("%cAuto-Select YouTube Subtitles by Sapioit: title_has_changed:", "color: cyan", (currentTitleValue) );
  console.info("%cAuto-Select YouTube Subtitles by Sapioit: title_has_changed:", "color: cyan", (currentTitleValue !== '') , ' ' , (currentTitleValue) );

  if ( currentTitleValue !== '' && currentTitleValue !== null) {
    // Get the current value of the title
    console.info("%cAuto-Select YouTube Subtitles by Sapioit: title_has_changed: %cTitle found.", "color: yellow; background-color: black;", "color: white");

    // Get the consecutive unchanged count from localStorage, or set it to 0 if it's not available
    let consecutiveUnchangedCount = parseInt(localStorage.getItem('consecutiveUnchangedCount')) || 0;

    // Increment the consecutiveUnchangedCount if the value is the same
    consecutiveUnchangedCount++;

    // Update the stored value and consecutiveUnchangedCount in localStorage
    localStorage.setItem('currentTitleValue', currentTitleValue);
    localStorage.setItem('consecutiveUnchangedCount', consecutiveUnchangedCount.toString());

    console.log("Auto-Select YouTube Subtitles by Sapioit: title_has_changed: Try nr #" + (1+consecutiveUnchangedCount) );

    // Check if the current value is the same as the previous one stored in localStorage
    if (localStorage.getItem('currentTitleValue') === currentTitleValue) {

      // Stop the function if the title value hasn't changed for the last three checks (consecutiveUnchangedCount is less than 4)
      if ( consecutiveUnchangedCount < (count+1) ) {
        console.log("Auto-Select YouTube Subtitles by Sapioit: title_has_changed: #" + (1+consecutiveUnchangedCount) + "First 'yt-formatted-string.style-scope.ytd-watch-metadata' element has not changed for the last three checks. Stopping check.");
        return false; // Return that the title has not changed.
      } else {
        // Reset the consecutiveUnchangedCount if the value has changed
        consecutiveUnchangedCount = 0;

        // Update the stored value and consecutiveUnchangedCount in localStorage
        localStorage.setItem('currentTitleValue', currentTitleValue);
        localStorage.setItem('consecutiveUnchangedCount', consecutiveUnchangedCount.toString());
        return true; // Return that the title has changed.
      }
    } else {
      // Reset the consecutiveUnchangedCount if the value has changed
      consecutiveUnchangedCount = 0;

      // Update the stored value and consecutiveUnchangedCount in localStorage
      localStorage.setItem('currentTitleValue', currentTitleValue);
      localStorage.setItem('consecutiveUnchangedCount', consecutiveUnchangedCount.toString());
      return true; // Return that the title has changed.
    }
  } else {
    console.log("Auto-Select YouTube Subtitles by Sapioit: title_has_changed: Checking title FAILED.");
  }
  return false; // Return that the title has changed.
  // Usage example:
  if ( title_has_changed() ){
    return;
  }
  if ( title_has_changed(3) ){
    return;
  }
}


function checkSubtitles() {
  if ( !isFocused() ){
    console.log("Youtube Hide Paused Gradient by Sapioit: swapButtonsSaveShare:: isFocused(): " + isFocused() );
    return;
  }
  if ( title_has_changed(12) ){
    console.log("Youtube Hide Paused Gradient by Sapioit: swapButtonsSaveShare:: title_has_changed(8): " + title_has_changed(8) );
    return;
  }

  console.log("Auto-Select YouTube Subtitles by Sapioit: checkSubtitles: Checking subtitles.");
  // Check if the value of ytp-menuitem-content is 'English (auto-generated)'
  let menuItems = document.querySelectorAll('.ytp-menuitem');
  let subtitlesButton = document.querySelector('.ytp-subtitles-button');
  let autoGeneratedMenuItem;

  for (let menuItem of menuItems) {
    let menuLabel = menuItem.querySelector('.ytp-menuitem-label span:first-child');
    let menuContent = menuItem.querySelector('.ytp-menuitem-content');

    if ( menuLabel && menuLabel === 'Subtitles/CC'
        && menuContent && menuContent !== 'English (auto-generated)' ){
      autoGeneratedMenuItem = menuItem;
      break;
    }
  }

  // Run the code if the condition is not met
  if (subtitlesButton && subtitlesButton.getAttribute('title') !== 'Subtitles/closed captions unavailable') {
    if (autoGeneratedMenuItem || subtitlesButton.getAttribute('aria-pressed') !== 'true' ) {
      // Change the subtitles
      //alert(subtitlesButton.outerHTML);
      ChangeSubtitles();
    } else {
      console.log("Auto-Select YouTube Subtitles by Sapioit: checkSubtitles: Subtitles did not need to be updated.");
    }
  } else {
    console.log("Auto-Select YouTube Subtitles by Sapioit: checkSubtitles: There are no subtitles available.");
  }
}

// Schedule to run the code every so often
setInterval(checkSubtitles, repeatInterval); // 1000 milliseconds = 1 second; 10000 milliseconds = 10 second;

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(checkSubtitles, waitInterval);
});

function ChangeSubtitles() {
  'use strict';

  // Find the gear icon
  //const gearIcon = document.querySelector('.ytp-settings-button');
  const gearIcon = document.querySelectorAll('.ytp-settings-button');
  console.log(gearIcon[0].outerHTML);

  // Find the subtitles icon
  const subtitlesButton = document.querySelector('.ytp-subtitles-button');

  // Click the gear icon to open the menu
  gearIcon[0].click();
  //document.querySelector('.ytp-settings-button').click();

  // Wait for the menu to open
  setTimeout(() => {
    // Find the third menu item
    let menuItems = document.querySelectorAll('.ytp-menuitem-label span');
    let thirdMenuItem;

    // Loop through each element in the 'menuItems' array.
    for (let j = 0; j < menuItems.length; j++) {
      // Get the current menu item element and its closest ancestor with the class 'ytp-menuitem'.
      let menuItem = menuItems[j].closest('.ytp-menuitem');

      // If 'menuItem' exists and has a child with the class 'ytp-menuitem-label' that has the first child a 'span', and its text content is 'Subtitles/CC'.
      if (menuItem && menuItem.querySelector('.ytp-menuitem-label span:first-child').textContent.trim() === 'Subtitles/CC') {
        // If the condition is true, assign the 'menuItem' element to the variable 'thirdMenuItem'.
        thirdMenuItem = menuItem;

        // Exit the loop immediately since the desired menu item is found.
        break;
      }
    }


    // Click the third menu item
    if (thirdMenuItem) {
      (thirdMenuItem).click();
    }

    // Wait for the "Subtitles/CC" menu to open
    setTimeout(() => {
      // Find the "English (auto-generated)" menu item
      let menuLabels = document.querySelectorAll('.ytp-menuitem-label');
      let autoGeneratedMenuItem;

      for (let i = 0; i < menuLabels.length; i++) {
        if (menuLabels[i].textContent.trim() === 'English (auto-generated)') {
          autoGeneratedMenuItem = menuLabels[i];
          break;
        }
      }

      // Click the "English (auto-generated)" menu item if found
      if (autoGeneratedMenuItem) {
        (autoGeneratedMenuItem).click();
      }
      // Wait for the "English (auto-generated)" option to be selected
      setTimeout(() => {
        let element = document.querySelector('.ytp-settings-menu');
        let computedStyle = getComputedStyle(element);
        if (computedStyle.display !== 'none') {
          // Click the gear icon to open the menu
          gearIcon[0].click();
        }
        setTimeout(() => {
          if (subtitlesButton.getAttribute('aria-pressed') !== 'true') {
            //alert(subtitlesButton.outerHTML);
            (subtitlesButton).click();
          }
        }, waitInterval); // Adjust the delay (in milliseconds) if needed
      }, waitInterval); // Adjust the delay (in milliseconds) if needed
    }, waitInterval); // Adjust the delay (in milliseconds) if needed
  }, waitInterval); // Adjust the delay (in milliseconds) if needed
  console.log("Auto-Select YouTube Subtitles by Sapioit: ChangeSubtitles: Subtitles changed.");
}
