// ==UserScript==
// @name         Artfight URL Grabber
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Copies icon/attack/character image URL to clipboard when a page is opened
// @author       You
// @match        https://artfight.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=artfight.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472955/Artfight%20URL%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/472955/Artfight%20URL%20Grabber.meta.js
// ==/UserScript==

(function() {
  var className = "";
  var url = window.location.href;
  var type = url.substring(url.indexOf("artfight.net/") + 13)[0];
  
  if (type === "~") {
    className = "icon-user";
  } else if (type === "a") {
    className = "icon-attack icon-small";
  } else if (type === "c") {
    className = "icon-character icon-small";
  } else {
    return;
  }

  var text = document.getElementsByClassName(className)[0].style.backgroundImage;
  var result = text.substring(text.indexOf("\"") + 1, text.lastIndexOf("\""));

  console.log(result);
  navigator.clipboard.writeText(result);
})();
