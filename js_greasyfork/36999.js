// ==UserScript==
// @name        Add Keyboard Shortcut to Toggle AvistaZ Header Visibility
// @description Add keyboard shortcut to toggle header visibility on AvistaZ Network sites
// @namespace   https://avistaz.to/profile/dryeyes
// @match       *://privatehd.to/*
// @match       *://avistaz.to/*
// @match       *://cinemaz.to/*
// @version     0.1.0
// @grant       GM_getValue
// @grant       GM_setValue
// @locale      English (en)
// @downloadURL https://update.greasyfork.org/scripts/36999/Add%20Keyboard%20Shortcut%20to%20Toggle%20AvistaZ%20Header%20Visibility.user.js
// @updateURL https://update.greasyfork.org/scripts/36999/Add%20Keyboard%20Shortcut%20to%20Toggle%20AvistaZ%20Header%20Visibility.meta.js
// ==/UserScript==
(function(){
  'use strict';

  let cleanedUrl = window.location.href.replace(/(#.*)$/, '');
  let bodyNode;
  let header;
  let navbar;
  let bodyPaddingTop;

  async function getShowHeaderValue() {
    let gmPromise = await GM_getValue("ShowHeader", true);
    console.log("GetValue ShowHeader:", gmPromise);
    return gmPromise;
  }
  async function setShowHeaderValue(value) {
    await GM_setValue("ShowHeader", value);
  }

  function optionallyShowHeader(show) {
    console.log("OptionallyShowHeader:", show ? "Show," : "Hide,",
                "currently " + (header.style.display === "" ? "Visible" : "Hidden"));
    if (show) {
      if (header.style.display === "none") {
        header.style.display = "";
        bodyNode.style.paddingTop = bodyPaddingTop;
        navbar.scrollIntoView(true);
        window.scrollBy(0,-(navbar.offsetHeight));
      }
    } else {
      if (header.style.display === "") {
        bodyPaddingTop = bodyNode.style.paddingTop;
        header.style.display = "none";
        bodyNode.style.paddingTop = 0;
        header.scrollIntoView(true);
      }
    }
  }

  function onKeyupHandler (evt) {
    //console.log("evt:", evt);
    if (evt.ctrlKey && !evt.altKey && !evt.shiftKey && !evt.metaKey) {
      //console.log("evt.key:", evt.key);
      if (evt.key === "Home") {
        if (header.style.display === "") {
          optionallyShowHeader (false);
          setShowHeaderValue(false).then(function(){});
        } else {
          optionallyShowHeader (true);
          setShowHeaderValue(true).then(function(){});
        }
      }
    }
  }

  function onVisibilityChange(evt) {
    console.log("VisibilityChangeEvent:", evt);
    if (document.visibilityState === "visible") {
      getShowHeaderValue().then(optionallyShowHeader);
    }
  }

  function optionallyShowHeaderAndScroll(show) {
    optionallyShowHeader(show);
    let torrentsBlock = document.querySelector("section > div.block");

    // On Browse Torrents pages, scroll to the Torrents table block
    if (navbar !== null && torrentsBlock !== null &&
        !torrentsBlock.classList.contains("block-titled")) { // avoid scrolling on Torrent details pages
      // Avoid Chrome auto-scroll to previous scroll position on reloading.
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }

      torrentsBlock.id = "torrents"
      let newUrl = cleanedUrl + "#torrents";
      //window.location.href = newUrl;
      //history.pushState(null, newUrl); // manually save position in history
      torrentsBlock.scrollIntoView(true);
      let scrollAmount = 10;
      if (show) {
        scrollAmount += navbar.offsetHeight;
      }
      console.log("ScrollAmount:", scrollAmount);
      window.scrollBy(0,-scrollAmount);
    }
  }

  function onLoadHandler() {
    console.log("ToggleAvistaZHeaderVisibility Load event occurred:", cleanedUrl);

    bodyNode = document.querySelector("body");
    header = document.querySelector("header");
    navbar = document.querySelector("div.container");
    getShowHeaderValue().then(optionallyShowHeaderAndScroll);

    document.addEventListener('visibilitychange', onVisibilityChange, false);
  }

  console.log("UserScript running");
  window.addEventListener('load', onLoadHandler, false);
  window.addEventListener('keyup', onKeyupHandler, false);
})();