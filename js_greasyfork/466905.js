// ==UserScript==
// @name         Split page in 2 frames
// @version      0.1
// @description  Splits the page in 2 equal frames
// @author       Akshay Raje
// @grant        none
// @match        *://*/*
// @run-at       context-menu
// @namespace    https://greasyfork.org/users/1073350
// @downloadURL https://update.greasyfork.org/scripts/466905/Split%20page%20in%202%20frames.user.js
// @updateURL https://update.greasyfork.org/scripts/466905/Split%20page%20in%202%20frames.meta.js
// ==/UserScript==
 
(function() {
    const pageTitle = document.title;
    const pageUrl = window.location.href;
 
    document.documentElement.innerHTML = `<html><head><title>${pageTitle}</title></head><frameset cols="50%,50%"><frame src="${pageUrl}"><frame src="${pageUrl}"></frameset></html>`;
})();