// ==UserScript==
// @name          CSS: animeon.club
// @description   Corrections to UI of animeon.club
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://animeon.club/*
// @match         *://*.animeon.club/*
// @match         *://moonanime.art/*
// @icon          https://animeon.club/favicon.ico
// @version       1.0.5
// @license       MIT
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/531642/CSS%3A%20animeonclub.user.js
// @updateURL https://update.greasyfork.org/scripts/531642/CSS%3A%20animeonclub.meta.js
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

  //CSS for any mode
  var css = `
  /*Change color of episodes*/
  .episodes > .episode[viewed="true"][active="false"] > .episode-name {
    color: #888888 !important;
  }
  .episodes > .episode[viewed="true"][active="false"] > .pi {
    color: #8A8A8A !important;
  }
  .episodes > .episode[viewed="true"][active="false"] {
    background-color: #151515 !important;
    border-color: #303030 !important;
    border-width: 1px !important;
    border-style: solid !important;
  }
  .episodes > .episode[viewed="false"][active="false"] {
    background-color: #303030 !important;
  }

  .player-settings .dub-section .episode-section .episode-list {
    display: unset !important;
  }

  /*Remove skip opening button*/
  /*pjsdiv[id$=_skip_opening] {
    display: none !important;
    visibility: hidden !important;
  }*/

  /*Expand franchise section*/
  app-anime-details p-accordion .p-accordionpanel > p-accordion-content {
    height: unset !important;
    visibility: visible !important;
  }
  app-anime-details .franchise-section {
    margin-bottom: 50px !important;
  }
  `;

  /*var observerFranchise = null;
  var btnClick = null;

  //--- Listen to franchise section and expand it
  if (observerFranchise == null) {
    const callbackFranchise = function (mutationsList, observer) {
      expandFranchise();
    }
    let nodeFranchise = document.querySelector("app-anime-player");
    if (nodeFranchise != null) {
      observerFranchise = new MutationObserver(callbackFranchise);
      observerFranchise.observe(nodeFranchise, {childList: true, subtree: true, attributes: true, characterData: false});
    }
  }*/

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

  //---------------------------------------
  // Expand franchise section
  //---------------------------------------
  /*function expandFranchise() {
    btnClick = document.querySelectorAll("p-accordion a[role='button'][aria-expanded='false']:not([clicked-by-script='true'])");
    if (btnClick != null && btnClick.length > 0) {
      for (var i = 0; i < btnClick.length; i++) {
        btnClick[i].click();
        btnClick[i].setAttribute("clicked-by-script", "true"); //Do not click it again
      }
    }
  }*/

})();
