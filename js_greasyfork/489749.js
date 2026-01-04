// ==UserScript==
// @name        Free4Talk Prevent disconnect on double call
// @namespace   Violentmonkey Scripts
// @match       https://www.free4talk.com/room/*
// @grant       none
// @version     1.0
// @author      -
// @description 3/13/2024, 5:30:48 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489749/Free4Talk%20Prevent%20disconnect%20on%20double%20call.user.js
// @updateURL https://update.greasyfork.org/scripts/489749/Free4Talk%20Prevent%20disconnect%20on%20double%20call.meta.js
// ==/UserScript==


window.addEventListener('storage', function(e) {
  if(e.key == "CID_free4talk-page"){
    window["__CID_free4talk-page"] = e.newValue
  }
});
