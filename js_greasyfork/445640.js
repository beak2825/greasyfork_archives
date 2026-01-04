// ==UserScript==
// @name          YT video tab by default
// @description   Open "Video" tab of youtube channel by default
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://*.youtube.com/*
// @match         *://*.youtu.be/*
// @icon          https://cdn.icon-icons.com/icons2/1488/PNG/512/5295-youtube-i_102568.png
// @version       1.1.11
// @license       MIT
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/445640/YT%20video%20tab%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/445640/YT%20video%20tab%20by%20default.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var urlAtLastCheck = "";
  var divTabs = null;
  var divPreview = null;
  var divPostPreview = null;
  var waitHeader;
  var waitPreview;

  //Check URL changes
  const rootCallback = function (mutationsList, observer) {
    if (urlAtLastCheck != document.location.href) {
      //console.log("new href: " + document.location.href);
      urlAtLastCheck = document.location.href;
      clearInterval(waitHeader); //Stop waiting for tabs
      clearInterval(waitPreview); //Stop waiting for preview
      openVideoTab();
    }
  }

  const rootNode = document.querySelector("body");
  if (rootNode != null) {
    const rootObserver = new MutationObserver(rootCallback);
    rootObserver.observe(rootNode, {childList: true, subtree: true});
  }


  function openVideoTab() {
    var pathArray = window.location.pathname.split('/');
    var firstPath = pathArray[1];
    var lastPath = pathArray[pathArray.length - 1];

    //console.log("firstPath: " + firstPath + "   lastPath: " + lastPath);
    if (firstPath === "" || firstPath === "watch" || firstPath === "playlist" || firstPath === "results" || firstPath === "feed" || firstPath === "gaming" || firstPath === "live" || lastPath === "search" || lastPath === "history" || lastPath === "featured" || lastPath === "videos" || lastPath === "shorts" || lastPath === "streams" || lastPath === "playlists" || lastPath === "community" || lastPath === "channels" || lastPath === "about") { //If not a channel or any channel's tab was selected
      //console.log("Not a channel or any tab is selected");

    } else { //If a channel with default tab
      waitPreview = setInterval(function() { //Wait untile preview video loaded
        divPreview = $( "ytd-channel-video-player-renderer video" ); //Get first section, where preview video can be located
        divPostPreview = $( "div#primary > ytd-section-list-renderer > div#contents > ytd-item-section-renderer:nth-child(1)" ); //Get first section after preview video
        //if (divPreview != null && divPreview.length > 0 && divPostPreview != null && divPostPreview.length > 0) {
        if (divPreview != null && divPreview.length > 0) {
          //console.log("preview is paused");
          document.querySelectorAll("ytd-channel-video-player-renderer video").forEach(videoPause); //Pause any channel preview video
        }
        //console.log("preview interval");
      }, 100);
      document.addEventListener("yt-navigate-finish", videoPause);

      waitHeader = setInterval(function() { //Wait untile header loaded
        divTabs = $( "div#tabsContainer > div#tabsContent yt-tab-shape" ); //Get array of tabs as HTML elements
        if (divTabs == null || divTabs.length < 2) {
          divTabs = $( "div#tabsContainer > div#tabsContent tp-yt-paper-tab" ); //Get array of tabs as HTML elements
        }

        if (divPostPreview != null && divPostPreview.length > 0 && divTabs != null && divTabs.length >= 2) {
          //Count visible tabs
          var countVisible = 0;
          var i;
          var tabIndex = -1;
          for (i = 0; i < divTabs.length; i++) {
            if (isVisible(divTabs[i])) countVisible++;
            if (countVisible == 2) {
              //document.querySelectorAll("ytd-channel-video-player-renderer video").forEach(videoPause); //Pause any channel preview video
              tabIndex = i; //Video tab is 2nd visible
            }
          }

          if (countVisible >= 2) { //Enough number of visible tabs - normal channel
            divTabs[tabIndex].click();
            //console.log("Video tab (" + tabIndex + ") is activated. Visible tabs: " + countVisible);
          }

          clearInterval(waitHeader); //Stop waiting for tabs
          clearInterval(waitPreview); //Stop waiting for preview
        }
        //console.log("header interval");
      }, 100);
    }
  }

  const videoPause = () => { //Pause media
    let paused = false;
    input.addEventListener("play", () => {
      if (paused === false) {
        paused = true;
        input.pause();
      }
    });
  }

  function isVisible(pObj) { //Check all the parents of element to find whether it is visible or not
    if (pObj != null) {
      var checkNext = true;
      var vObj = pObj;

      while (checkNext) {
        checkNext = false;
        //console.log("checking element " + vObj.tagName + "#" + vObj.id + ": '" + document.defaultView.getComputedStyle(vObj,null)['display'] + "'");
        if (document.defaultView.getComputedStyle(vObj,null)['display'] != "none") {
          if (vObj.parentElement != null) {
            vObj = vObj.parentElement;
            checkNext = true;
          }
        } else {
          return false;
        }
      }
      return true;
    }
    return false;
  }
})();
