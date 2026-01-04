// ==UserScript==
// @name         Disable BBC EMP Autoplay
// @version      1.3.2
// @description  Forces autoplay to be turned off in embedded media players on BBC websites.
// @author       uxamend
// @namespace    https://greasyfork.org/en/users/231373-uxamend
// @match        *://emp.bbc.co.uk/*
// @match        *://emp.bbc.com/*
// @grant        none
// @run-at       document-idle
// @license      CC0-1.0
// @downloadURL https://update.greasyfork.org/scripts/375322/Disable%20BBC%20EMP%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/375322/Disable%20BBC%20EMP%20Autoplay.meta.js
// ==/UserScript==

"use strict";

var debug_logging_on = false;
var debug_script_name = "Userscript: Disable BBC EMP Autoplay"

function debug_log(message) {
  if(debug_logging_on){
    console.log("[" + debug_script_name + "] " + message);
  }
}

// Turns off a "p_autoplayToggle" autoplay toggle
// Parameter 'confirmations' is number of times to go back and confirm that
// The toggle actually stayed where we put it.
function disable_autoplay_p(autoplay_toggle, confirmations) {
  function confirm() {
          disable_autoplay_p(autoplay_toggle, confirmations - 1);
  }
  
  function try_again() {
        disable_autoplay_p(autoplay_toggle, confirmations);
  }
  
  var autoplay_state = autoplay_toggle.getAttribute("aria-checked");
  
  debug_log("Current autoplay state: " + autoplay_state);
  
  if(autoplay_state == "true") {
    debug_log("Autoplay is on. Turning off autoplay.");
    autoplay_toggle.click();
    
    // The autoplay toggle doesn't work initially, so we need to keep trying
    // until it does work. (Waiting for the BBC's code to add event handler.)
    autoplay_state = autoplay_toggle.getAttribute("aria-checked");
    debug_log("Toggle state is now \"" + autoplay_state + "\".");
    
    if(autoplay_state == "true") {
      // Toggle didn't work. Try again.
      debug_log("Trying again in 500ms.");
      setTimeout(try_again, 500);
    } else {
      // Toggle appeared to work, but we should check it hasn't gone back.
      if(confirmations > 0) {
        debug_log("Checking to confirm successful toggle in 500ms...")
        setTimeout(confirm, 500);
      }
    }
  } else if(debug_logging_on) {
    debug_log("Autoplay is turned off.");
    if(confirmations > 0) {
      debug_log("Checking it's still off in 500ms...");
      setTimeout(confirm, 500);
    }
  }
}

// Turns off a "gcp_onOffSwitchButton" autoplay switch
function disable_autoplay_gcp(autoplay_switch) {
  var autoplay_state = autoplay_switch
                       .getElementsByClassName("gcp_onOffSwitchButtonSelected")[0]
                       .textContent;
  
  debug_log("Current autoplay state: " + autoplay_state);
  
  if(autoplay_state == "ON") {
    debug_log("Autoplay is on. Turning off autoplay.");
    autoplay_switch.click();
  } else if(debug_logging_on) {
    debug_log("Autoplay is already turned off.");
  }
}

function get_autoplay_switch_and_disable() {
  debug_log("Trying to find the autoplay switch...");
  var autoplay_toggle = document.getElementById("p_autoplayToggle");
  var autoplay_switch = document.getElementsByClassName("gcp_onOffSwitchButton")[0];
  var video_element = document.getElementById("p_v_player_0");
  
  if(autoplay_toggle || autoplay_switch) {
    if(autoplay_toggle) {
      debug_log("Found autoplay toggle.");
      
      // It seems that when the page is first loaded, the toggle has a state that doesn't
      // reflect what it will ultimately become. We have to wait until the video is
      // playing before we can execute our disable_autoplay_p function, otherwise it can
      // end up thinking autoplay is already disabled when it isn't.
      if(video_element.readyState < 1) {
        debug_log("Video isn't ready. Waiting 500ms...");
        setTimeout(get_autoplay_switch_and_disable, 500);
        
      } else {
        disable_autoplay_p(autoplay_toggle, 10);
      }
    }
  
    if(autoplay_switch) {
      debug_log("Found autoplay switch.");
      disable_autoplay_gcp(autoplay_switch);
    }
  
  } else {
    debug_log("Couldn't find autoplay control. Waiting 500ms...");
    setTimeout(get_autoplay_switch_and_disable, 500);
    
  }
}

get_autoplay_switch_and_disable();