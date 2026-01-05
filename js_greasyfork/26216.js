// ==UserScript==
// @name         WaniKani Wrong Answer Delay
// @namespace    http://tampermonkey.net/
// @version      0.91
// @description  Adds delay when you answered incorrectly so you have time to look at your answer again, and spot any typos
// @author       cometzero
// @include      https://www.wanikani.com/review/session
// @include      http://www.wanikani.com/review/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26216/WaniKani%20Wrong%20Answer%20Delay.user.js
// @updateURL https://update.greasyfork.org/scripts/26216/WaniKani%20Wrong%20Answer%20Delay.meta.js
// ==/UserScript==

/**
  * How long does user have to wait when he answered wrong
  */
var waitTime = 1000;

/**
  * Speed of the animation in FPS
  */
var FPS = 100;
var interval = 1000 / FPS;

/**
  * Enables or disables log messages
  */
var DEBUG = false;

(function() {
    'use strict';

    // init observer
    onSetUserResponseDisabled();

    onIncorrectAnswerObserver(function(){
        log("Wrong answer!");
        disableNextOne();

        // animate user wait time
        var timesRun = 0;
        var intervalId = setInterval(function(){
            if(timesRun > waitTime / interval){
                clearInterval(intervalId);
                enableNextOne();
                setDelayProgress(1);
            }else{
                var progress = timesRun / waitTime * interval;
                setDelayProgress(progress);
            }
            timesRun += 1;
        }, interval);
    });

    // listens for option-item-info click and shortcut key 'F' and than calls showItemInfo
    // since it will not open by itself while in delay state, since the input is disabled
    $("#option-item-info").click(function() {
        showItemInfo();
    });
    $(document).on("keydown.reviewScreen", function(n) {
           if(n.keyCode == 70) { // letfter 'F'
                showItemInfo();
           }
    });

})();

/**
  * Shows item info while the user waits
  * The problem is that show item info wont open by itself since disabled attribute is not set.
  * So in order to open it we need to set disabled attribute and than trigger click so that WaniKani js click
  * function is called again.
  * isDisabled must be set to false so that "onSetUserResponseDisabled" will not automatically set disabled attribute.
  */
var openingItemInfo = false;
function showItemInfo(){
    if(isDisabled){
        // make sure that the cick was registerd before disabling the input again
        $("#option-item-info").click(function() {
           if(openingItemInfo){
               $("#user-response").prop("disabled", false);
               isDisabled = true;
           }
           openingItemInfo = false;
        });

        isDisabled = false;
        $("#user-response").prop("disabled", true);
        openingItemInfo = true;
        $("#option-item-info").trigger("click");
    }
}

/**
  * Create div overlay that will be displayed when user is waiting to be able to go to the next letter
  */
function createOverlay(){
    var overlay = $("<div></div>");
    overlay.css("height", "100%");
    overlay.css("width", "0%");
    overlay.css("position", "absolute");
    overlay.css("background-color", "rgba(255, 0, 51, 0.30)");
    overlay.css("top", "0");
    overlay.css("left", "0");

    $("#user-response").parent().append(overlay);
    return overlay;
}

// overlay is created only once and than saved in this variable
var overlay;

/**
  * Show user how much time it has to wait
  * @param {progress} progress between 0 .. 1. 1 means it is completed
  */
function setDelayProgress(progress){
    // if overlay doesn't exist creat it
    if(!overlay){
        overlay = createOverlay();
    }

    overlay.css("width", (100-progress*100) + "%");
    overlay.css("left", (progress*50) + "%");

    var trans = Math.min(0.40, 1-progress);
    overlay.css("background-color", "rgba(255, 0, 51, "+trans+")");
}

/**
  * Enables user to proceed to next leter
  */
function enableNextOne(){
    _enableNextOne(true);
}

/**
  * Disables user to proceed to next letter
  */
function disableNextOne(){
    _enableNextOne(false);
}

var isDisabled = false; // is user currently able to go to the next letter?
function _enableNextOne(enable){
    log("Enable next one: " + enable);
    isDisabled = !enable;

    // if "user-response <input>" is not disabled than it will not go to the next letter
    // this is just how the wanikani works.
    // Since input is not disabled we have to set pointer-events to none so that user cannot input anything
    $("#user-response").prop("enabled", !enable);
    $("#user-response").prop("disabled", enable);
    $("#user-response").css("pointer-events", enable? "" : "none");
}

/**
 * Set observer that is called every time user answered incorrectly
 * @param {function} function that is called user answered incorrectly
 */
function onIncorrectAnswerObserver(f){
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function(mutations, observer) {
          mutations.forEach(function(mutation) {
              // check if it has class name set as "incorrect"
              if(mutation.attributeName == "class" && mutation.target.className == "incorrect"){
                  f();
              }
          });
    });

    // configuration of the observer:
    var config = {attributes: true, attributeOldValue: true };

    // we have to select parent since it is the one that gets class changed
    var target = document.getElementById("user-response").parentElement;

    // pass in the target node, as well as the observer options
    observer.observe(target, config);
}

/**
 * When user response is not disabled and user presses enter wanikani will automatically disabled it
 * That means that user can proceed to the next letter. We don't want that... we want for user to wait.
 */
function onSetUserResponseDisabled(){
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function(mutations, observer) {
          mutations.forEach(function(mutation) {
              // check if it has class name set as "incorrect"
              if(isDisabled && mutation.attributeName == "disabled"){
                  $("#user-response").prop("disabled", false);
              }
          });
    });

    // configuration of the observer:
    var config = {attributes: true, attributeOldValue: true };

    // we have to select parent since it is the one that gets class changed
    var target = document.getElementById("user-response");

    // pass in the target node, as well as the observer options
    observer.observe(target, config);
}


function log(logMessage){
    if(DEBUG){
        console.log(logMessage);
    }
}