// ==UserScript==
// @name        Redirect to old chat - character.ai
// @namespace   Violentmonkey Scripts
// @license MIT
// @match       https://beta.character.ai/
// @grant       none
// @version     1.2
// @author      -
// @description 8/28/2023, 11:43:38 AM
// @downloadURL https://update.greasyfork.org/scripts/474060/Redirect%20to%20old%20chat%20-%20characterai.user.js
// @updateURL https://update.greasyfork.org/scripts/474060/Redirect%20to%20old%20chat%20-%20characterai.meta.js
// ==/UserScript==

// if the url starts with "https://beta.character.ai/chat2"
if (window.location.href.startsWith("https://beta.character.ai/chat2")) {
    // redirect to "https://beta.character.ai/chat?char={char}"
    char_id = window.location.href.split("char=")[1].split("&")[0]
    window.location.href = "https://beta.character.ai/chat?char=" + char_id
}