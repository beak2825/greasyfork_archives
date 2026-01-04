// ==UserScript==
// @name         Brick Hill Refresh on error
// @description  Automatically refreshes when encountering an error
// @author       Noah
// @match        https://www.brick-hill.com/*
// @version      1.0
// @namespace https://greasyfork.org/users/725966
// @downloadURL https://update.greasyfork.org/scripts/419989/Brick%20Hill%20Refresh%20on%20error.user.js
// @updateURL https://update.greasyfork.org/scripts/419989/Brick%20Hill%20Refresh%20on%20error.meta.js
// ==/UserScript==

if(document.querySelectorAll("body center h1").length != 0 && document.querySelectorAll("body center h1")[0].innerText.includes("503")) {
    document.location.reload()
}