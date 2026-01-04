// ==UserScript==
// @name        watch live in the nav bar
// @namespace   Violentmonkey Scripts
// @match       https://www.blaseball.com/*
// @match       https://blaseball.com/*
// @grant       none
// @version     2.0
// @run-at      document-idle
// @author      amazingAkita
// @description puts watch live in the nav bar, now with option to put it at the top or bottom of the page. only works on initial play page.
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458802/watch%20live%20in%20the%20nav%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/458802/watch%20live%20in%20the%20nav%20bar.meta.js
// ==/UserScript==

(function() {
    const NAMESPACE = "Watch Live in Nav Bar"
    const MOVED = "Move buttons to the bottom?"

    if (document.hasOwnProperty("_BLASEBALL_USERSCRIPT_OPTIONS_REGISTER")) {
        document._BLASEBALL_USERSCRIPT_OPTIONS_REGISTER(NAMESPACE, MOVED, false, "checkbox");

    }

    //defaults to top of page
    function getMoved() {
        if (document.hasOwnProperty("_BLASEBALL_USERSCRIPT_OPTIONS_GET")) {
            return document._BLASEBALL_USERSCRIPT_OPTIONS_GET(NAMESPACE, MOVED);
        }

        return false;
    }

    function addWatchLive() {
      console.log('entering addWatchLive - buttons below? ' + getMoved());

      var buttons = document.getElementsByClassName('playtab__cover-buttons');

      //if moved to bottom, add as the last in the nav bar. else, add just after the user section
      if(getMoved()){
        var navBar = document.getElementsByClassName('navigation__block');
        navBar[0].insertAdjacentElement("beforeend", buttons[0]);
      } else {
        var userHeader = document.getElementsByClassName('user-header');
        userHeader[0].insertAdjacentElement("afterend", buttons[0]);
      }
      //todo: add the live/bet buttons from the schedule as the big ones don't work
      //var smaller = document.getElementsByClassName('schedule__live  schedule__live--active schedule__live--selected');
    }

  //playtab__cover-buttons
    const callback = function(mutationsList, observer) {
        mutationsList.forEach((mutation) => {
            if (mutation.type == "childList") {
                mutation.addedNodes.forEach((node) => {
                    if(node.classList && node.classList.contains("main__body")){
                        addWatchLive();
                    }
                });
            }
        });
    };


    if (document.hasOwnProperty("_BLASEBALL_USERSCRIPT_REGISTER")) {
        document._BLASEBALL_USERSCRIPT_REGISTER(NAMESPACE, callback, (mutations) => (document.querySelector("body")));
    } else {
        const main = document.getElementsByTagName("body")[0];
        const config = { childList: true, subtree: true };
        const mutationCallback = function(mutationsList, observer) {
            callback(mutationsList);

            observer.disconnect();
            observer.observe(main, config);
        };

        const observer = new MutationObserver(mutationCallback);
        observer.observe(main, config);
    }

})();