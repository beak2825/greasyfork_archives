// ==UserScript==
// @name         Fit Netflix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  removes black borders on non-standart screen resolutions
// @author       You
// @match        https://www.netflix.com/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443077/Fit%20Netflix.user.js
// @updateURL https://update.greasyfork.org/scripts/443077/Fit%20Netflix.meta.js
// ==/UserScript==


const act = ({code})=>{
if(code === "KeyP"){
	const videotag = document.getElementsByTagName("video")[0];
	videotag.style.objectFit = "cover";
	}
}

(function() {
    'use strict';

document.addEventListener("keydown",act);

})();