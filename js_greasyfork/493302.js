/* globals jQuery, $, waitForKeyElements */
// ==UserScript==
// @name         Hamilton Spectator Paywall/Ad Remover
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Removes paywalls and ads on thespec.com
// @author       JaredTamana
// @license      MIT
// @match        https://www.thespec.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thespec.com
// @grant        none
// @run-at      document-idle
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/493302/Hamilton%20Spectator%20PaywallAd%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/493302/Hamilton%20Spectator%20PaywallAd%20Remover.meta.js
// ==/UserScript==

// import waitForKeyElements. Source: https://gist.githubusercontent.com/raw/2625891/waitForKeyElements.js

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements(
  selectorTxt /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */,
  actionFunction /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */,
  bWaitOnce /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */,
  iframeSelector /* Optional: If set, identifies the iframe to
                        search.
                    */,
) {
  var targetNodes, btargetsFound;

  if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
  else targetNodes = $(iframeSelector).contents().find(selectorTxt);

  if (targetNodes && targetNodes.length > 0) {
    btargetsFound = true;
    /*--- Found target node(s).  Go through each and act if they
            are new.
        */
    targetNodes.each(function () {
      var jThis = $(this);
      var alreadyFound = jThis.data("alreadyFound") || false;

      if (!alreadyFound) {
        //--- Call the payload function.
        var cancelFound = actionFunction(jThis);
        if (cancelFound) btargetsFound = false;
        else jThis.data("alreadyFound", true);
      }
    });
  } else {
    btargetsFound = false;
  }

  //--- Get the timer-control variable for this selector.
  var controlObj = waitForKeyElements.controlObj || {};
  var controlKey = selectorTxt.replace(/[^\w]/g, "_");
  var timeControl = controlObj[controlKey];

  //--- Now set or clear the timer as appropriate.
  if (btargetsFound && bWaitOnce && timeControl) {
    //--- The only condition where we need to clear the timer.
    clearInterval(timeControl);
    delete controlObj[controlKey];
  } else {
    //--- Set a timer, if needed.
    if (!timeControl) {
      timeControl = setInterval(function () {
        waitForKeyElements(
          selectorTxt,
          actionFunction,
          bWaitOnce,
          iframeSelector,
        );
      }, 300);
      controlObj[controlKey] = timeControl;
    }
  }
  waitForKeyElements.controlObj = controlObj;
}

(function () {
  "use strict";

  $(document).ready(function () {
    console.log("Doc is ready, beginning paywall/ad removal");
    // hide paywall banner
    $(".offer-group-title").css("display", "none");
    $(".access-offers-wrapper").css("display", "none");
    // remove text attribs for last line before paywall
    $(".last-preview").css("-webkit-text-fill-color", "initial");
    // show hidden subscriber-only content
    // get all subscriber-only elements
    var subsOnlyNodes = document.getElementsByClassName("subscriber-only");
    // convert from NodeList to Array for easy iteration
    var subsOnlyArray = Array.prototype.slice.call(subsOnlyNodes, 0);
    // unhide elements
    subsOnlyArray.forEach(function (element) {
      element.style.display = "block";
      element.removeAttribute("hidden");
      element.classList.remove("subscriber-only");
    });
    // get all elements that would be hidden to subscribers
    var subsHideNodes = document.getElementsByClassName("subscriber-hide");
    // convert from NodeList to Array for easy iteration
    var subsHideArray = Array.prototype.slice.call(subsHideNodes, 0);
    // remove elements
    subsHideArray.forEach(function (element) {
      element.remove();
    });
    // get all promo elements
    var promoNodes = document.getElementsByClassName("user-promo-desktop");
    // convert from NodeList to Array for easy iteration
    var promoArray = Array.prototype.slice.call(promoNodes, 0);
    // hide elements
    promoArray.forEach(function (element) {
      element.style.display = "none";
    });
    // hide 'you might be interested in' modal
    $("#tncms-region-article_instory_top").css("display", "none");
    // hide top banner ad
    $(".adLabelWrapper").css("display", "none");
    $("#tncms-region-global-container-top").css("display", "none");
    // hide comments ad, may not work as comments load dynamically on scroll
    $(".vf-promo").css("display", "none");
    // hide sponsored links
    $(".polarBlock").css("display", "none");
    // hide top nav with NorthStar Bets
    $("#topbar-col-two-nav_menu").css("display", "none");
    $("#tncms-region-global-side-primary").css("display", "none");
    // front page: remove whitespace left behind
    var twocolcontent = document.getElementById(
      "tncms-region-front-index-two-top"
    );
    twocolcontent.parentElement.previousElementSibling.style = "display: none";
    twocolcontent.parentElement.classList.remove("col-md-8");
    twocolcontent.parentElement.parentElement.classList.remove("row");

    // wait for newseletter modal
    console.log("waiting for removeNewsletterModal");
    waitForKeyElements(
      "#promo-designer-modal-custom-pop-3374307",
      removeNewsletterModal,
    );

    function removeNewsletterModal(jNode) {
      console.log("triggered removeNewsletterModal");
      jNode.remove();
    }
  });
})();
