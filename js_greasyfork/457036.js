// ==UserScript==
// @name         Force Godot Docs to latest english
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  When opening the godot docs, always show the page in english and the latest version
// @author       DATADEER
// @match        https://docs.godotengine.org/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Godot_icon.svg/2048px-Godot_icon.svg.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457036/Force%20Godot%20Docs%20to%20latest%20english.user.js
// @updateURL https://update.greasyfork.org/scripts/457036/Force%20Godot%20Docs%20to%20latest%20english.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href)
    const path = url.pathname;
    const pathParts = path.split("/").filter((part) => part);

    const langCode = pathParts[0]
    const version = pathParts[1]

    const desiredLangCode = "en";
    const desiredVersion = "latest"

    if(langCode === desiredLangCode && version === desiredVersion) return;

    // index 0 and 1 contain language and version path part, we replace them later
    const contentRelevantPathParts = pathParts.slice(2)

    const newURLParts = ["en","latest", ...contentRelevantPathParts]
    const newURLPath = `/${newURLParts.join("/")}`
    const newURL = `${url.origin}${newURLPath}`

    console.log(`redirecting to ${newURL}`)

    window.location.href = newURL


})();