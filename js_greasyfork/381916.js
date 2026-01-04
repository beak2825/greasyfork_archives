// ==UserScript==
// @name        Reddit link to video
// @description Ever trying to link to reddit videos? Without the comments? This script will add a a clicable "raw_link" section in the menu above the video.
// @namespace   redditlinktovideo
// @author      gf_share
// @grant       none
// @license     Unlicense; http://unlicense.org/
// @version     0.9.2
// @include     https://www.reddit.com/r/*/comments/*
// @downloadURL https://update.greasyfork.org/scripts/381916/Reddit%20link%20to%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/381916/Reddit%20link%20to%20video.meta.js
// ==/UserScript==

(function() {
    'use strict'

    console.log("Trying to add 'raw_link' for video")
  
    let tag = document.querySelector('div.portrait')
    if (tag) {

      let msg = tag.getAttribute("data-seek-preview-url")
      if (msg) {

        // the _720 here will define the resolution of the video (allowed: 240, 360, 420, 720)
        msg = msg.replace(/_240$/, "_720")

        console.log('The video url is now "' + msg + '"')

        let newLink = document.createElement("a")
        newLink.setAttribute("href", msg)
        newLink.style.margin = "0px 7px 0px 0px"
        var newContent = document.createTextNode("raw_link")
        newLink.appendChild(newContent)
  
        tag = document.querySelector('.post-sharing-button')
        if (tag) {
          tag.parentNode.insertBefore(newLink, tag)
        }
      }
    }
})();
