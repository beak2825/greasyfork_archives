// ==UserScript==
// @name        Add keyboard shortcuts to AvistaZ Network Home Pages
// @description Add keyboard shortcuts to activate & scroll Featured/Top/Dying/Dead tab header & Latest Comments to window top on AvistaZ Network sites
// @namespace   https://avistaz.to/profile/dryeyes
// @match       *://privatehd.to/
// @match       *://avistaz.to/
// @match       *://cinemaz.to/
// @version     0.1.0
// @grant       none
// @locale      English (en)
// @downloadURL https://update.greasyfork.org/scripts/36996/Add%20keyboard%20shortcuts%20to%20AvistaZ%20Network%20Home%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/36996/Add%20keyboard%20shortcuts%20to%20AvistaZ%20Network%20Home%20Pages.meta.js
// ==/UserScript==
(function(){
  'use strict';

  let cleanedUrl = window.location.href.replace(/(#.*)$/, '');
  let navbar;
  let navTabs;

  // takes into account current navbar height
  function scrollHeaderToTop(evt, elm) {
    if (evt !== null)
      evt.preventDefault(); // THIS stops browser from scrolling to top, but also blocks history.
    if (elm === undefined)
      elm = navTabs;

    if (navbar !== undefined && navTabs !== undefined) {
      history.pushState(null, ""); // manually save position in history
      elm.scrollIntoView(true);
      window.scrollBy(0,-(navbar.offsetHeight + 10));
    }
    return false; // supposed to block browser from scrolling to top of page but doesn't work.
  }

  function clickTabHeader(ID) {
    let tabNode = document.querySelector(`ul.nav-tabs a[href='${ID}']`);
    if (tabNode !== null) {
      scrollHeaderToTop(null);
      tabNode.click();
    }
  }

  function onKeyupHandler (evt) {
    //console.log("evt.key:", evt.key);

    if (!evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
      switch (evt.key) {
        case "1": {
          clickTabHeader("#featuredtorrents");
          break;
        }
 
        case "2": {
          clickTabHeader("#toptorrents");
          break;
        }

        case "3": {
          clickTabHeader("#dyingtorrents");
          break;
        }

        case "4": {
          clickTabHeader("#deadtorrents");
          break;
        }

        case "5": {
          let tabNode = document.evaluate('//h3[normalize-space()="Latest Comments"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          scrollHeaderToTop(evt,tabNode);
          break;
        }

        default: {
        }
      }
    }
  }

  function onLoadHandler() {
    console.log("JumptoTabsonHomePage Load event occurred:", cleanedUrl);

    navbar = document.querySelector("div.container");
    navTabs = document.querySelector("ul.nav-tabs");
  }

  console.log("UserScript running");
  window.addEventListener('load', onLoadHandler, false);
  window.addEventListener('keyup', onKeyupHandler, false);
})();