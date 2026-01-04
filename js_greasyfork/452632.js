// ==UserScript==
// @name          View full size images at m.facebook.com
// @description   Add a button "View full size" under the images at m.facebook.com
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://m.facebook.com/*
// @icon          https://static.xx.fbcdn.net/rsrc.php/yD/r/d4ZIVX-5C-b.ico
// @version       1.1
// @license       MIT
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/452632/View%20full%20size%20images%20at%20mfacebookcom.user.js
// @updateURL https://update.greasyfork.org/scripts/452632/View%20full%20size%20images%20at%20mfacebookcom.meta.js
// ==/UserScript==

(function() {
  'use strict';

  //Check URL changes
  const rootCallback = function (mutationsList, observer) {
    document.querySelectorAll("div.story_body_container > div[data-ft] > div[data-gt] i[role='img'][style*='background-image: url(']:not([button-added='true'])").forEach(addButtonCase1); //Post with single image (in the newsfeed and post opened)
    //document.querySelectorAll("div.story_body_container > div[data-ft] > div > div[data-ft] i[role='img'][style*='background-image: url(']:not([button-added='true'])").forEach(addButtonCase2); //Post with many images (in the newsfeed and post opened) - disabled, because putting urls under many tiled images creates a mess
    document.querySelectorAll("div#modalDialogView article > div > div[data-store-id] > div[data-store-id] img.img[src^='https:']:not([button-added='true'])").forEach(addButtonCase3); //Post with many images (in the post opened for the 1st time)
    document.querySelectorAll("div#rootcontainer article > div > div[data-store-id] > div[data-store-id] img.img[src^='https:']:not([button-added='true'])").forEach(addButtonCase3); //Post with many images (in the post opened and reloaded)
    //document.querySelectorAll("div[data-sigil='comment'] div.attachment i[role='img'][style*='background-image: url(']:not([button-added='true'])").forEach(addButtonCase4); //Comments with images - disabled, because the url of true full size of image cannot be obtained directly
  }

  const rootNode = document.querySelector("body");
  if (rootNode != null) {
    const rootObserver = new MutationObserver(rootCallback);
    rootObserver.observe(rootNode, {childList: true, subtree: true});
  }

  /*setInterval (function () {
    document.querySelectorAll("div.story_body_container > div[data-ft] > div[data-gt] i[role='img'][style*='background-image: url(']:not([button-added='true'])").forEach(addButtonCase1); //Post with single image (in the newsfeed and post opened)
    //document.querySelectorAll("div.story_body_container > div[data-ft] > div > div[data-ft] i[role='img'][style*='background-image: url(']:not([button-added='true'])").forEach(addButtonCase2); //Post with many images (in the newsfeed and post opened) - disabled, because putting urls under many tiled images creates a mess
    document.querySelectorAll("div#modalDialogView article > div > div[data-store-id] > div[data-store-id] img.img[src^='https:']:not([button-added='true'])").forEach(addButtonCase3); //Post with many images (in the post opened for the 1st time)
    document.querySelectorAll("div#rootcontainer article > div > div[data-store-id] > div[data-store-id] img.img[src^='https:']:not([button-added='true'])").forEach(addButtonCase3); //Post with many images (in the post opened and reloaded)
    //document.querySelectorAll("div[data-sigil='comment'] div.attachment i[role='img'][style*='background-image: url(']:not([button-added='true'])").forEach(addButtonCase4); //Comments with images - disabled, because the url of true full size of image cannot be obtained directly
  }, 250);*/

  function addButtonCase1(element) {
    var strImg = element.getAttribute("style");
    strImg = strImg.replace(/.*background-image: url\('https\\3a /, "https:"); //Remove everything before img url
    strImg = strImg.replace(/'\);.*/, ""); //Remove everything after img url
    strImg = strImg.replace(/\\3d /g, "="); //Replace codes with respective symbols
    strImg = strImg.replace(/\\26 /g, "&");
    //console.log(strImg);
    var newButton = document.createElement('span');
    newButton.className = "_2vja mfss fcg _5rgt";
    newButton.setAttribute("style", "display: block; top: 0px; min-height: 20px; z-index: 1;");
    newButton.innerHTML = '<a href="' + strImg + '" target="_blank" class="sec">View full size</a>';
    element.parentNode.parentNode.insertBefore(newButton, element.nextSibling);
    element.setAttribute("button-added", "true");
  }

  function addButtonCase2(element) {
    var strImg = element.getAttribute("style");
    strImg = strImg.replace(/.*background-image: url\('https\\3a /, "https:"); //Remove everything before img url
    strImg = strImg.replace(/'\);.*/, ""); //Remove everything after img url
    strImg = strImg.replace(/\\3d /g, "="); //Replace codes with respective symbols
    strImg = strImg.replace(/\\26 /g, "&");
    //console.log(strImg);
    var newButton = document.createElement('span');
    newButton.className = "_2vja mfss fcg _5rgt";
    newButton.setAttribute("style", "display: block; top: 0px; min-height: 20px; z-index: 1;");
    newButton.innerHTML = '<a href="' + strImg + '" target="_blank" class="sec">View full size</a>';
    element.parentNode.parentNode.insertBefore(newButton, element.nextSibling);
    element.setAttribute("button-added", "true");
  }

  function addButtonCase3(element) {
    var strImg = element.getAttribute("src");
    //console.log(strImg);
    var newButton = document.createElement('span');
    newButton.className = "_2vja mfss fcg _5rgt";
    newButton.setAttribute("style", "display: block; top: 0px; min-height: 20px; z-index: 1;");
    newButton.innerHTML = '<a href="' + strImg + '" target="_blank" class="sec" style="font-weight: normal; color: inherit;">View full size</a>';
    element.parentNode.insertBefore(newButton, element.nextSibling);
    element.setAttribute("button-added", "true");
  }

  function addButtonCase4(element) {
    var strImg = element.getAttribute("style");
    strImg = strImg.replace(/.*background-image: url\('https\\3a /, "https:"); //Remove everything before img url
    strImg = strImg.replace(/'\);.*/, ""); //Remove everything after img url
    strImg = strImg.replace(/\\3d /g, "="); //Replace codes with respective symbols
    strImg = strImg.replace(/\\26 /g, "&");
    console.log(strImg);
    var newButton = document.createElement('span');
    newButton.className = "_2vja mfss fcg _5rgt";
    newButton.setAttribute("style", "display: block; top: 0px; min-height: 20px; z-index: 1;");
    newButton.innerHTML = '<a href="' + strImg + '" target="_blank" class="sec" style="font-weight: normal; color: inherit;">View full size</a>';
    element.parentNode.parentNode.insertBefore(newButton, element.nextSibling);
    element.setAttribute("button-added", "true");
  }
})();
