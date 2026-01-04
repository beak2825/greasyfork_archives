// ==UserScript==
// @name        Fresh content for youtube
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/
// @grant       none
// @version     1.0
// @author      Omar alharbi - @loboly_19
// @description Simple script to automatically click the New to you button on YT.
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/447926/Fresh%20content%20for%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/447926/Fresh%20content%20for%20youtube.meta.js
// ==/UserScript==
    window.onload = function(){
    var FreshView = document.querySelector('[title="New to you"]');
    FreshView.click();};