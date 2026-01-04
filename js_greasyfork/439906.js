// ==UserScript==
// @name          CSS: otpsmart.com.ua
// @description   Corrections to UI of otpsmart.com.ua
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://otpsmart.com.ua/*
// @icon          https://otpsmart.com.ua/ifobsClientOtp/img/favicon.png
// @version       1.3.1
// @license       MIT
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/439906/CSS%3A%20otpsmartcomua.user.js
// @updateURL https://update.greasyfork.org/scripts/439906/CSS%3A%20otpsmartcomua.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var css = `
  /*Make social links bar smaller and with top border*/
  .b-sidebar .b-social-links {
    margin: 5px 0 !important;
    text-align: center !important;
    border-top: gray 1px solid !important;
    padding: 10px 0 !important;
  }

  /*Do not show epxpander/collapser bar*/
  div.b-aside-collapser {
    display: none !important;
  }

  /*Make main menu bigger*/
  div#sideBarMenu {
    /*height: calc(768px - 260px - 30px - 100px) !important;*/
  }

  /*Make scroll bar wider*/
  .mCSB_dragger_bar {
    width: 6px !important;
  }

  /*Make list of cards higher*/
  .b-sidebar .m-list-item_b {
    min-height: 100px !important;
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

  const rootCallback = function (mutationsList, observer) {
    //Make text in login field visible
    var input = document.querySelector("input[name='userNameVisual'][type='password']");
    if (input != null) {
      if (input.getAttribute("type") === "password") {
        input.setAttribute("type", "text");
      }
    }

    var sideMenu = document.querySelector("div#sideBarMenu:not([expanded])");
    if (sideMenu != null) {
      let compHeight = 0;
      let element;
      //sideMenu.style = "position: relative; overflow: visible; height: " + sideMenu.offsetHeight + 140 + "px;"
      /*Height of div#sideBarMenu:
      1) simply +140px
      2) .container.l-main {min-height: 768px;}
         minus .b-sidebar .b-sidebar-header {height: 260px;}
         minus .b-sidebar .b-social-links .e-social-link {height: 30px;}
         minus .b-sidebar .b-social-links {margin: 15px 0;}
         minus 100*/

      element = document.querySelector(".container.l-main");
      compHeight = element.offsetHeight - 115;
      element = document.querySelector(".b-sidebar .b-sidebar-header");
      compHeight = compHeight - element.offsetHeight;
      element = document.querySelector(".b-sidebar .b-social-links .e-social-link");
      compHeight = compHeight - element.offsetHeight;
      sideMenu.style = "position: relative; overflow: visible; height: " + compHeight + "px;"
      //sideMenu.setAttribute("expanded", "true");
    }
  }

  const rootNode = document.querySelector("body");
  if (rootNode != null) {
    const rootObserver = new MutationObserver(rootCallback);
    rootObserver.observe(rootNode, {childList: true, subtree: true});
  }

})();
