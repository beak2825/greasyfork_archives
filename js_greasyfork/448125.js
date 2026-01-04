// ==UserScript==
// @name        Youtube Hide Paused Gradient by Sapioit
// @namespace   Sapioit
// @copyright   Sapioit, 2020 - Present
// @author      sapioitgmail.com
// @license     GPL-2.0-only; http://www.gnu.org/licenses/gpl-2.0.txt
// @icon        https://youtube.com/favicon.ico
// @match       https://www.youtube.com/*
// @match       https://*.youtube.com/*
// @match       https://youtube.com/*
// @match       https://youtu.be/*
// @match       https://*.youtu.be/*
// @match       http://www.youtube.com/*
// @match       http://*.youtube.com/*
// @match       http://youtube.com/*
// @match       http://youtu.be/*
// @match       http://*.youtu.be/*
// @description Removes the annoying gradients visible when pausing a video.
// @version     1.7.1.2-2025-05May-09Fri
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/448125/Youtube%20Hide%20Paused%20Gradient%20by%20Sapioit.user.js
// @updateURL https://update.greasyfork.org/scripts/448125/Youtube%20Hide%20Paused%20Gradient%20by%20Sapioit.meta.js
// ==/UserScript==
// @updateURL https://openuserjs.org/meta/sapioitgmail.com/Youtube_Hide_Paused_Gradient_by_Sapioit.meta.js
// @downloadURL https://greasyfork.org/scripts/448125-youtube-hide-paused-gradient-by-sapioit/code/Youtube%20Hide%20Paused%20Gradient%20by%20Sapioit.user.js

let isHidden = GM_getValue('autoplayHidden', true);

function updateStyle_autonav_toggle() {
  //GM_addStyle(`[data-tooltip-target-id="ytp-autonav-toggle-button"] { display: ${isHidden ? 'none' : 'inherit'} !important; }`);
  GM_addStyle(`.ytp-button.ytp-autonav-toggle { display: ${isHidden ? 'none' : 'inline-block'} !important; }`);
}

function toggleVisibility() {
    isHidden = !isHidden;
    GM_setValue('autoplayHidden', isHidden);
    updateStyle_autonav_toggle();
}

GM_registerMenuCommand("Toggle Autoplay Button Visibility", toggleVisibility);

updateStyle_autonav_toggle(); // Apply initial style to the autonav-toggle checkbox

var changed_page = false;
document.addEventListener('spfdone', function() {
  changed_page = true;
  //alert("changed link 1 spfdone");
});
document.addEventListener('transitionend', function(e) {
  //alert("changed link 2 transitionend");
  if (e.target.id === 'progress'){
    changed_page = true;
    //alert("changed link 2 transitionend progress");
  }
});
window.addEventListener('load', function () {
  changed_page = true;
  //alert("changed link 3 load");
});

window.addEventListener('yt-page-data-updated', function () {
  changed_page = true;
  //alert("changed link 4 url change");
});

function changed_link(){
  if (changed_page) {
    changed_page = false;
    return true;
  }
  return false;
}


localStorage.setItem('currentWatchMetadataValued', 0);
localStorage.setItem('consecutiveUnchangedCounted', 0);
let isTabFocused = () => typeof document.hidden !== undefined ? !document.hidden : null;

function title_changed (count = 3) {
  console.info("%cYoutube Hide Paused Gradient by Sapioit: changed_link(): %c" + changed_page, "color: yellow; background-color: black;", "color: cyan");
  console.info("%cYoutube Hide Paused Gradient by Sapioit: title_changed: %cChecking title.", "color: yellow; background-color: black;", "color: white");

  // Check if the value of the title (the first "yt-formatted-string.style-scope.ytd-watch-metadata" element) has changed
  let firstWatchMetadataElement = document.querySelector('h1 yt-formatted-string.style-scope.ytd-watch-metadata');

  if ( firstWatchMetadataElement === null || (typeof firstWatchMetadataElement) === 'undefined') {
    console.info("Youtube Hide Paused Gradient by Sapioit: title_changed: %cThe 'h1 yt-formatted-string.style-scope.ytd-watch-metadata' is either NULL or UNDEFINED.", "color: red");
    console.info("%cYoutube Hide Paused Gradient by Sapioit: title_changed: %c", "color: red", "color: default", firstWatchMetadataElement , (typeof firstWatchMetadataElement));
    return false;
  }

  console.info("%cYoutube Hide Paused Gradient by Sapioit: title_changed:", "color: cyan", (firstWatchMetadataElement.textContent.trim()) );
  console.info("%cYoutube Hide Paused Gradient by Sapioit: title_changed:", "color: cyan", (firstWatchMetadataElement.textContent.trim() !== '') , ' ' , (firstWatchMetadataElement) );

  if ( firstWatchMetadataElement.textContent.trim() !== '') {
    // Get the current value of the title
    let currentWatchMetadataValue = firstWatchMetadataElement.textContent.trim();
    console.info("%cYoutube Hide Paused Gradient by Sapioit: title_changed: %cTitle found.", "color: yellow; background-color: black;", "color: white");

    // Get the consecutive unchanged count from localStorage, or set it to 0 if it's not available
    let consecutiveUnchangedCount = parseInt(localStorage.getItem('consecutiveUnchangedCounted')) || 0;

    // Increment the consecutiveUnchangedCount if the value is the same
    consecutiveUnchangedCount++;

    // Update the stored value and consecutiveUnchangedCount in localStorage
    localStorage.setItem('currentWatchMetadataValued', currentWatchMetadataValue);
    localStorage.setItem('consecutiveUnchangedCounted', consecutiveUnchangedCount.toString());

    console.log("Youtube Hide Paused Gradient by Sapioit: title_changed: Try nr #" + (1+consecutiveUnchangedCount) );

    // Check if the current value is the same as the previous one stored in localStorage
    if (localStorage.getItem('currentWatchMetadataValued') === currentWatchMetadataValue) {

      // Stop the function if the title value hasn't changed for the last three checks (consecutiveUnchangedCount is less than 4)
      if ( consecutiveUnchangedCount < (count+1) ) {
        console.log("Youtube Hide Paused Gradient by Sapioit: title_changed: First 'yt-formatted-string.style-scope.ytd-watch-metadata' element has not changed for the last three checks. Stopping check.");
        return false; // Return that the title has not changed.
      } else {
        // Reset the consecutiveUnchangedCount if the value has changed
        consecutiveUnchangedCount = 0;

        // Update the stored value and consecutiveUnchangedCount in localStorage
        localStorage.setItem('currentWatchMetadataValued', currentWatchMetadataValue);
        localStorage.setItem('consecutiveUnchangedCounted', consecutiveUnchangedCount.toString());
        return true; // Return that the title has changed.
      }
    } else {
      // Reset the consecutiveUnchangedCount if the value has changed
      consecutiveUnchangedCount = 0;

      // Update the stored value and consecutiveUnchangedCount in localStorage
      localStorage.setItem('currentWatchMetadataValued', currentWatchMetadataValue);
      localStorage.setItem('consecutiveUnchangedCounted', consecutiveUnchangedCount.toString());
      return true; // Return that the title has changed.
    }
  } else {
    console.log("Youtube Hide Paused Gradient by Sapioit: title_changed: Checking title FAILED.");
  }
  return false; // Return that the title has changed.
  // Usage example:
  if ( title_changed() ){
    return;
  }
  if ( title_changed(8) ){
    return;
  }
}


function swapButtonsSaveShare(){
  if ( !isTabFocused() ){
    console.log("Youtube Hide Paused Gradient by Sapioit: swapButtonsSaveShare:: isFocused(): " + isTabFocused() );
    return;
  }
  if ( title_changed(8) ){
    console.log("Youtube Hide Paused Gradient by Sapioit: swapButtonsSaveShare:: title_has_changed(8): " + title_changed(8) );
    return;
  }


  console.log("Youtube Hide Paused Gradient by Sapioit: swapButtonsSaveShare:: Checking if 'Save' button is inside the top-level-buttons-computed element.");

  let isSaveButtonInside = document.querySelector('div#top-level-buttons-computed.top-level-buttons.style-scope.ytd-menu-renderer button[aria-label="Save to playlist"]');
  console.info('%cYoutube Hide Paused Gradient by Sapioit: swapButtonsSaveShare: %c', "color: cyan", isSaveButtonInside, (typeof isSaveButtonInside));

  if (isSaveButtonInside) {
    console.log("Youtube Hide Paused Gradient by Sapioit: swapButtonsSaveShare: 'Save' button is inside the top-level-buttons-computed element.");
    console.log("Youtube Hide Paused Gradient by Sapioit: swapButtonsSaveShare:: isSaveButtonInside: " + JSON.stringify(isSaveButtonInside));
    //GM_addStyle('div#top-level-buttons-computed.top-level-buttons.style-scope.ytd-menu-renderer button[aria-label="Save to playlist"] { background-color: red;}');
    return;
  }

  console.log("Youtube Hide Paused Gradient by Sapioit: swapButtonsSaveShare: 'Save' button is NOT inside the top-level-buttons-computed element.");
  let saveButton = document.querySelector('ytd-button-renderer[button-renderer][button-next] button[aria-label="Save to playlist"]');
  let shareButton = document.querySelector('ytd-button-renderer[button-renderer][button-next] button[aria-label="Share"]');

  if (saveButton && shareButton) {
    let saveButtonParent = saveButton.parentElement;
    let shareButtonParent = shareButton.parentElement;

    // Create placeholder elements to hold the buttons temporarily
    const placeholder1 = document.createElement('div');
    const placeholder2 = document.createElement('div');

    // Move the buttons to their respective placeholder positions
    saveButtonParent.insertBefore(placeholder1, saveButton);
    shareButtonParent.insertBefore(placeholder2, shareButton);
    shareButtonParent.insertBefore(saveButton, placeholder2);
    saveButtonParent.insertBefore(shareButton, placeholder1);

    // Remove the placeholders
    saveButtonParent.removeChild(placeholder1);
    shareButtonParent.removeChild(placeholder2);

    // Swap Save2 with a new Share2
    let save2Button = document.querySelector('tp-yt-paper-item[aria-disabled="false"] yt-formatted-string[role="option"][class="style-scope ytd-menu-service-item-renderer"]');
    if (save2Button) {
      let saveButtonParent = saveButton.parentElement;

      // Swap the positions of saveButton and shareButton in their respective parents
      saveButtonParent.insertBefore(shareButton, saveButton.nextSibling);

      // Create new HTML for the modified share2Button
      let newShare2ButtonHTML = '<ytd-menu-service-item-renderer class="style-scope ytd-menu-popup-renderer iron-selected" use-icons="" system-icons="" role="menuitem" tabindex="-1" aria-selected="true"><!--css-build:shady--><!--css-build:shady--><tp-yt-paper-item class="style-scope ytd-menu-service-item-renderer" style-target="host" role="option" tabindex="0" aria-disabled="false"><!--css-build:shady--><yt-icon class="style-scope ytd-menu-service-item-renderer"><!--css-build:shady--><!--css-build:shady--><yt-icon-shape class="style-scope yt-icon"><icon-shape class="yt-spec-icon-shape"><div style="width: 100%; height: 100%; fill: currentcolor;"><svg height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;"><path d="M15 5.63 20.66 12 15 18.37V14h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9z"></path></svg></div></icon-shape></yt-icon-shape></yt-icon></div><yt-formatted-string class="style-scope ytd-menu-service-item-renderer">Share</yt-formatted-string><ytd-badge-supported-renderer class="style-scope ytd-menu-service-item-renderer" disable-upgrade="" hidden=""></ytd-badge-supported-renderer></tp-yt-paper-item></ytd-menu-service-item-renderer>';

      // Create a new DOM element from the HTML string
      const parser = new DOMParser();
      const newShare2Button = parser.parseFromString(newShare2ButtonHTML, "text/html").body.firstChild;

      // Add the newShare2Button after the saveButton
      saveButtonParent.insertBefore(newShare2Button, saveButton.nextSibling);
    }

    /*let newShareButton = '<button class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading " aria-label="Share" style=""><div class="yt-spec-button-shape-next__icon" aria-hidden="true"><yt-icon style="width: 24px; height: 24px;"><!--css-build:shady--><!--css-build:shady--><yt-icon-shape class="style-scope yt-icon"><icon-shape class="yt-spec-icon-shape"><div style="width: 100%; height: 100%; fill: currentcolor;"><svg height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;"><path d="M15 5.63 20.66 12 15 18.37V14h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9z"></path></svg></div></icon-shape></yt-icon-shape></yt-icon></div><div class="cbox yt-spec-button-shape-next__button-text-content"><span class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap" role="text">Share</span></div><yt-touch-feedback-shape style="border-radius: inherit;"><div class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response" aria-hidden="true"><div class="yt-spec-touch-feedback-shape__stroke" style=""></div><div class="yt-spec-touch-feedback-shape__fill" style=""></div></div></yt-touch-feedback-shape></button>';
    let newSaveButton = '<button class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading " aria-label="Save to playlist" style=""><div class="yt-spec-button-shape-next__icon" aria-hidden="true"><yt-icon style="width: 24px; height: 24px;"><!--css-build:shady--><!--css-build:shady--><yt-icon-shape class="style-scope yt-icon"><icon-shape class="yt-spec-icon-shape"><div style="width: 100%; height: 100%; fill: currentcolor;"><svg height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;"><path d="M22 13h-4v4h-2v-4h-4v-2h4V7h2v4h4v2zm-8-6H2v1h12V7zM2 12h8v-1H2v1zm0 4h8v-1H2v1z"></path></svg></div></icon-shape></yt-icon-shape></yt-icon></div><div class="cbox yt-spec-button-shape-next__button-text-content"><span class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap" role="text">Save</span></div><yt-touch-feedback-shape style="border-radius: inherit;"><div class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response" aria-hidden="true"><div class="yt-spec-touch-feedback-shape__stroke" style=""></div><div class="yt-spec-touch-feedback-shape__fill" style=""></div></div></yt-touch-feedback-shape></button>';

    function createTrustedHTML(inputString) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(inputString, "text/html");
      const fragment = doc.body;
      return fragment.outerHTML;
    }


    function escapeHTML(inputString) {
      return inputString.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }


    newShareButton = createTrustedHTML(newShareButton);
    newSaveButton = createTrustedHTML(newSaveButton);


    shareButton.outerHTML = newSaveButton;
    saveButton.outerHTML = newShareButton;*/

    // To remove the old "Save" and "Share" buttons, uncomment the lines below:
    // saveButtonParent.removeChild(saveButton);
    // shareButtonParent.removeChild(shareButton);
  }
  console.info("%cYoutube Hide Paused Gradient by Sapioit: swapButtonsSaveShare: Finishing swapping.", "color: cyan");
}


function add_hover_tooltips() {
  /*var video_titles = document.getElementsByTagName("h3").getElementsByClassName("ytd-compact-video-renderer").getElementsByTagName("span");*/
  /*var video_titles = document.querySelector("span.ytd-compact-video-renderer");*/
  //var video_titles = document.getElementsByTagName("span").getElementsByClassName("ytd-compact-video-renderer");

  /*var video_titles = document.querySelectorAll("span.ytd-compact-video-renderer");*/
  var video_titles = document.querySelectorAll("span.ytd-compact-video-renderer, #video-title");
  for(var i=0; i<video_titles.length; i++){
    console.log(video_titles[i]);
    var current_title = video_titles[i].getAttribute("title");
    video_titles[i].setAttribute("alt", current_title);
    video_titles[i].setAttribute("data-title", current_title);
    video_titles[i].setAttribute("data-tooltip", current_title);
  }
  /*
    video_titles = document.querySelectorAll("#video-title");
    for(i=0; i<video_titles.length; i++){
        console.log(video_titles[i]);
        current_title = video_titles[i].getAttribute("title");
        video_titles[i].setAttribute("alt", current_title);
        video_titles[i].setAttribute("data-title", current_title);
        video_titles[i].setAttribute("data-tooltip", current_title);
    }
    */
}






window.onloadstart = function(){setTimeout(function () {
  add_hover_tooltips();
}, 0.001*1000)}; //loads after 0.001 seconds


window.addEventListener('keydown', function(e) {
  let play_button = document.querySelector('button.ytp-play-button');
  let valid_target = e.target === document.body || e.target === document.querySelector('#player-api');
  let pressed_space = e.keyCode === 32 || e.keyCode === 'Space'; // Space
  if (play_button && valid_target && pressed_space) {
    console.log("Youtube Hide Paused Gradient by Sapioit: Pressed pause or resume.");
    e.preventDefault();
    playButton.click();
  }
});


function disable_autoplay() {
  // Select the element by its class and attribute
  /*
  var element = document.querySelector('.ytp-autonav-toggle-button[aria-checked="true"]');
  if (element) {
    element.click();
  }
  */
  /*
  var toggle = document.querySelector('.ytp-autonav-toggle-button');
  if (toggle && toggle.getAttribute('aria-checked') === "true") {
    toggle.setAttribute('aria-checked', "false");
  }
  */
  var element = document.querySelector('.ytp-autonav-toggle-button');
  if (element && element.getAttribute('aria-checked') === "true") {
    element.setAttribute('aria-checked', "false");
    GM_setValue('autoplayDisabled', true);
  }/* else {
    element.setAttribute('aria-checked', "true");
    GM_setValue('autoplayDisabled', false);
  }*/
}




window.addEventListener('load', function() {
  disable_autoplay();
}, false);


if (typeof document.getElementsByClassName("ytp-gradient-top")[0] != "undefined") {
  document.getElementsByClassName("ytp-gradient-top")[0].style.display = 'none';
}
if (typeof document.getElementsByClassName("ytp-gradient-top")[0] != "undefined") {
  document.getElementsByClassName("ytp-gradient-top")[0].style.opacity = '0';
}
if (typeof document.getElementsByClassName("ytp-gradient-bottom")[0] != "undefined") {
  document.getElementsByClassName("ytp-gradient-bottom")[0].style.display = 'none';
}
if (typeof document.getElementsByClassName("ytp-gradient-bottom")[0] != "undefined") {
  document.getElementsByClassName("ytp-gradient-bottom")[0].style.opacity = '0';
}

/*
document.getElementsByClassName("ytp-gradient-top")[0].style.display = 'none';
document.getElementsByClassName("ytp-gradient-top")[0].style.opacity = '0';
document.getElementsByClassName("ytp-gradient-bottom")[0].style.display = 'none';
document.getElementsByClassName("ytp-gradient-bottom")[0].style.opacity = '0';
*/



GM_addStyle('.ytp-caption-window-container { top: 2% !important; }');

GM_addStyle('.ytp-gradient-top { display: none !important; opacity: 0 !important; }');
GM_addStyle('.ytp-gradient-top { width: none !important; opacity: 0 !important; }');

//GM_addStyle('button div.ytp-autonav-toggle-button-container { display: none !important;}');
//GM_addStyle('[data-tooltip-target-id="ytp-autonav-toggle-button"] { display: none !important;}');
updateStyle_autonav_toggle(); // Apply initial style to the autonav-toggle checkbox
//GM_addStyle('.ytp-button[data-tooltip-target-id="ytp-autonav-toggle-button"] { display: none !important;}');
GM_addStyle('--ytd-engagement-panel-section-list-rendere { display: none !important;}');
//GM_addStyle('.ytp-time-display > span { padding: 3px; background: rgba(0, 0, 0, 0.5); }'); // half opacity for time text
//GM_addStyle('.ytd-thumbnail-overlay-time-status-renderen { transition-duration: 0s; }');
GM_addStyle('ytd-watch-flexy[fixed-panels] #chat.ytd-watch-flexy { position: relative; height: 500px; }');

window.onload = function(){setTimeout(function () {
  console.log("Youtube Hide Paused Gradient by Sapioit: onload:: start");
  //GM_addStyle('button div.ytp-autonav-toggle-button-container { display: none !important;}');
  //GM_addStyle('[data-tooltip-target-id="ytp-autonav-toggle-button"] { display: none !important;}');
  updateStyle_autonav_toggle(); // Apply initial style to the autonav-toggle checkbox
  GM_addStyle('--ytd-engagement-panel-section-list-rendere { display: none !important;}');
  GM_addStyle('#video-title.ytd-compact-video-renderer { overflow: none !important;}');
  GM_addStyle('ytd-button-renderer > yt-button-shape > button[aria-label="Thanks"] { display: none !important; }');
  //GM_addStyle('ytd-button-renderer > yt-button-shape > button[aria-label="Save to playlist"] { display: inline-block !important; }');
  GM_addStyle('ytd-watch-flexy[fixed-panels] #chat.ytd-watch-flexy { position: relative; height: 500px; }');
  add_hover_tooltips();
  disable_autoplay();
  swapButtonsSaveShare();
  setTimeout(function () {
    swapButtonsSaveShare();
  }, 5*1000) //loads after 5 seconds
  console.log("Youtube Hide Paused Gradient by Sapioit: onload:: stop");
  //GM_addStyle('.ytd-thumbnail-overlay-time-status-renderen { transition-duration: 0s; }');
}, 5*1000)}; //loads after 5 seconds

function repeaterFunction(){
  setTimeout(repeaterFunction, 30*1000); //loads every 30 seconds
  console.log("Youtube Hide Paused Gradient by Sapioit: repeaterFunction:: focus-check and title-chance-check");
  if ( !isTabFocused() ){
    console.log("Youtube Hide Paused Gradient by Sapioit: repeaterFunction:: isFocused(): " + isTabFocused() );
    return;
  }
  if ( title_changed(8) ){
    console.log("Youtube Hide Paused Gradient by Sapioit: repeaterFunction:: title_has_changed(8): " + title_changed(8) );
    return;
  }

  console.log("Youtube Hide Paused Gradient by Sapioit: repeaterFunction:: start");
  //GM_addStyle('button div.ytp-autonav-toggle-button-container { display: none !important;}');
  //GM_addStyle('[data-tooltip-target-id="ytp-autonav-toggle-button"] { display: none !important;}');
  updateStyle_autonav_toggle(); // Apply initial style to the autonav-toggle checkbox
  GM_addStyle('--ytd-engagement-panel-section-list-rendere { display: none !important;}');
  add_hover_tooltips();
  disable_autoplay();
  swapButtonsSaveShare();
  console.log("Youtube Hide Paused Gradient by Sapioit: repeaterFunction:: stop");
}
repeaterFunction();

/*
GM_addStyle("span[data-tooltip]:before { z-index:301;  position: absolute;  opacity: 0;  padding: 0px; width: 200px;  background: black;  color: white; content: attr(data-tooltip); }    span[data-tooltip]:hover:before {  opacity: 1; } ");
GM_addStyle(".yt-simple-endpoint[title]:before { z-index:301; position: absolute;  opacity: 0;  padding: 0px; width: 200px;  background: black;  color: white; content: attr(title); }    .yt-simple-endpoint[title]:hover:before {  opacity: 1; } ");
*/

GM_addStyle("span[data-tooltip]:before , .yt-simple-endpoint[title]:before { z-index:301; position: absolute;  opacity: 0;  padding: 0px; width: 200px;  background: black;  color: white; content: attr(title); }");
GM_addStyle("span[data-tooltip]:before { content: attr(data-tooltip); }");
GM_addStyle(".yt-simple-endpoint[title]:before { content: attr(title); }");
GM_addStyle("span[data-tooltip]:hover:before , .yt-simple-endpoint[title]:hover:before {  opacity: 1; } ");

GM_addStyle(".ytp-cairo-refresh-signature-moments .ytp-play-progress { background: -webkit-gradient(linear, left top, right top, color-stop(80%, #f03), to(#f03)) !important; background: -webkit-linear-gradient(left, #f03 80%, #f03 100%) !important; background: linear-gradient(to right, #f03 80%, #f03 100%) !important; }");

// <ytd-engagement-panel-section-list-renderer class="style-scope ytd-watch-flexy" visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED">GM_addStyle(a);













