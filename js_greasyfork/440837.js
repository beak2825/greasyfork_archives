// ==UserScript==
// @name          CSS: ventusky.com
// @description   Corrections to UI of ventusky.com
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://www.ventusky.com/*
// @icon          https://www.ventusky.com/images/favicon.ico
// @version       1.3.3
// @license       MIT
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/440837/CSS%3A%20ventuskycom.user.js
// @updateURL https://update.greasyfork.org/scripts/440837/CSS%3A%20ventuskycom.meta.js
// ==/UserScript==

(function() {
  'use strict';

  //Workaround: This document requires 'TrustedHTML' assignment
  if (window.trustedTypes && trustedTypes.createPolicy) {
    if (!trustedTypes.defaultPolicy) {
      const passThroughFn = (x) => x;
      trustedTypes.createPolicy('default', {
        createHTML: passThroughFn,
        createScriptURL: passThroughFn,
        createScript: passThroughFn,
      });
    }
  }

  var css = `
  /*Remove App button*/
  li#menu-app {
    display: none !important;
  }

  /*Remove Download App button (Android)*/
  a[href^="https://play.google.com"] {
    display: none !important;
  }

  /*Remove Download App button (iOS)*/
  a[href^="https://itunes.apple.com"] {
    display: none !important;
  }

  /*Remove Premium button*/
  li #menu-premium {
    display: none !important;
  }

  /*Smaller header*/
  form#header {
    height: unset !important;
    padding: unset !important;
    background: unset !important;
    background-size: unset !important;
    width: 50% !important;
  }
  form#header::after {
    background: unset !important;
  }

  /*Smaller menu button*/
  /*menu::before {
    padding-left: unset !important;
    line-height: 3em !important;
    border-radius: 2em !important;
  }*/

  /*Position and size of Find my position button*/
  #header .r {
    top: .3em !important;
    width: 2.0em !important;
    height: 2.0em !important;
  }

  /*New settings button for mobile version*/
  menu2 a {
    right: 1em !important;
    text-align: center !important;
    border-radius: 2em !important;
    box-shadow: 0 1.5px 3px rgba(0,0,0,.25) !important;
    background: #fff !important;
    line-height: 2.125em !important;
    height: 2.125em !important;
    width: 5em !important;
    color: #12507f !important;
    display: block !important;
    position: absolute !important;
  }
  `;

  if (typeof GM_addStyle != 'undefined') {
    GM_addStyle(css);
  } else if (typeof PRO_addStyle != 'undefined') {
    PRO_addStyle(css);
  } else if (typeof addStyle != 'undefined') {
    addStyle(css);
  } else {
    var node = document.createElement('style');
    node.type = 'text/css';
    node.appendChild(document.createTextNode(css));
    document.documentElement.appendChild(node);
  }

  //Change Menu button to Settings button on mobile version
  let waitForMenu = setInterval(function() { //Check page content constantly
    var menuLi = document.querySelector("menu li");
    if (menuLi != null) {
      if (getComputedStyle(menuLi).float === "none") { //If menu item is for mobile browser
        var menu2 = document.querySelector("#menu2");
        if (menu2 == null) $("body").append('<menu2 id="menu2"></menu2>');
        menu2 = document.querySelector("#menu2");
        if (menu2 != null) {
          $("li#menu-settings").appendTo("#menu2");
          $("body > menu").hide();//remove();
          clearInterval(waitForMenu);
        }
      } else clearInterval(waitForMenu); //Stop waiting, because it is not mobile browser
    }
  }, 100); //Interval to check page content

})();