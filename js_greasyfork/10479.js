// ==UserScript==
// @name         Voat Fill Screen 
// @version      1.1
// @description  forces voat to fill the screen
// @author       Scotty-Brooks
// @match        https://voat.co/*
// @grant        none
// @namespace https://greasyfork.org/users/12486
// @downloadURL https://update.greasyfork.org/scripts/10479/Voat%20Fill%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/10479/Voat%20Fill%20Screen.meta.js
// ==/UserScript==

document.querySelector("#container").style.maxWidth = "100%";
document.querySelector("#header-banner").style.maxWidth = "100%";