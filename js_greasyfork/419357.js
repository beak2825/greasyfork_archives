// ==UserScript==
// @name          CSS: m.facebook.com - cleaner UI
// @description   Corrections to UI of Facebook for mobile browsers: remove useless panels
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://m.facebook.com/*
// @icon          https://static.xx.fbcdn.net/rsrc.php/yD/r/d4ZIVX-5C-b.ico
// @version       1.3.3
// @license       MIT
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/419357/CSS%3A%20mfacebookcom%20-%20cleaner%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/419357/CSS%3A%20mfacebookcom%20-%20cleaner%20UI.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var css = `
  /*Remove MBackNavBar - back arrow header above the current message*/
  #MBackNavBar {
    visibility: hidden !important;
    height: 0px !important;
  }

  /*Remove mDialogHeader
  #mDialogHeader {
    visibility: hidden !important;
    height: 0px !important;
  }*/

  /*Remove MStoriesTray - box with various stories*/
  #MStoriesTray {
    visibility: hidden !important;
    height: 0px !important;
  }

  /*Remove conversation guides*/
  /*#u_0_11, #u_jb_9, #u_1y_8*/
  /*[id^="u_"][id$="_8"],
  [id^="u_"][id$="_9"],
  [id^="u_"][id$="_10"],
  [id^="u_"][id$="_11"]*/
  [class^="_7an"],
  ._4l3w {
    visibility: hidden !important;
    height: 0px !important;
  }

  /*Make smaller clickable area around "Like", "Reply" and "More"*/
  a._2b0a {
    padding: 3px 8px 3px 8px !important;
    /*margin: 0px 0px 7px 0px;*/
  }

  /*Correct place of comments switcher*/
  div > div#add_comment_switcher_placeholder {
    float: unset !important;
    text-align: right !important;
  }

  /*Make darker background for new interface header*/
  /*#mJewelNav {
    background: #e0eaf8 !important;
  }*/

  /*Make header icons non-white to be visible on white background*/
  #feed_jewel.hasCount > a > div > div {
    background-position: 0 -609px !important;
  }
  #requests_jewel.hasCount > a > div > div {
    background-position: 0 -273px !important;
  }
  #messages_jewel.hasCount > a > div > div {
    background-position: 0 -42px !important;
  }
  #videos_tab_jewel.hasCount > a > div > div {
    background-position: 0 -672px !important;
  }
  #notifications_jewel.hasCount > a > div > div {
    background-position: 0 -126px !important;
  }
  #bookmarks_jewel.hasCount > a > div > div {
    background-position: 0 -525px !important;
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

  var divSwitcher = null;
  var divStory = null;
  var divComments = null;
  var i;

  const rootCallback = function (mutationsList, observer) {
    moveCommentsSwitcher();
  }

  const rootNode = document.querySelector("body");
  if (rootNode != null) {
    const rootObserver = new MutationObserver(rootCallback);
    rootObserver.observe(rootNode, {childList: true, subtree: true});
  }

  function moveCommentsSwitcher() {
    var intervalCount = 0;

    let wait4Switcher = setInterval(function() { //Wait for switcher to load
      intervalCount++;
      divSwitcher = document.getElementById("add_comment_switcher_placeholder");

      if (divSwitcher != null) {
        if (divSwitcher.getAttribute("moved-by-script") != "true") {
          divStory = divSwitcher.parentNode;
          divComments = null;
          for (i = 0; i < divStory.childNodes.length; i++) {
            if (divStory.childNodes[i].className.indexOf("_333v _45kb") > -1) { //Section to put comments switcher before
              divComments = divStory.childNodes[i];
              break;
            }
          }
          if (divComments != null) {
            divSwitcher.setAttribute("moved-by-script", "true"); //In order not to process it many times
            divStory.insertBefore(divSwitcher, divComments);
            clearInterval(wait4Switcher); //Stop waiting if placeholder has been just moved
          }
        } else clearInterval(wait4Switcher); //Stop waiting if placeholder has been already moved previously
      }
      if (intervalCount > 50) clearInterval(wait4Switcher); //Stop waiting for too long
    }, 250); //Interval to check
  }

  /*let waitForStory = setInterval(function() { //Check page content constantly
    divSwitcher = document.getElementById("add_comment_switcher_placeholder:not([moved-by-script])");

    if (divSwitcher != null && divSwitcher.getAttribute("moved-by-script") != "true") {
      divStory = divSwitcher.parentNode;
      for (i = 0; i < divStory.childNodes.length; i++) {
        if (divStory.childNodes[i].className.indexOf("_333v _45kb") > -1) { //Section to put comments switcher before
          divComments = divStory.childNodes[i];
          break;
        }
      }
      if (divComments != null) {
        divSwitcher.setAttribute("moved-by-script", "true"); //In order not to process it many times
        divStory.insertBefore(divSwitcher, divComments);
        clearInterval(waitForStory); //Stop waiting
      }
    }
  }, 500); //Interval to check page content*/

})();