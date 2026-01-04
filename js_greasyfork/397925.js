// ==UserScript==
// @name         Unbeliever shitpost remover on coub.com
// @namespace    https://coub.com/
// @version      1.0
// @description  Removes shitposts by Unbeliever on coub.com
// @match        https://coub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397925/Unbeliever%20shitpost%20remover%20on%20coubcom.user.js
// @updateURL https://update.greasyfork.org/scripts/397925/Unbeliever%20shitpost%20remover%20on%20coubcom.meta.js
// ==/UserScript==
(function() {
    

    const func = () => {document.querySelectorAll(".description__stamp").forEach(x => { let isBadUser = x.querySelector("a.description__stamp__user").href.includes("unbeliever"); console.log(isBadUser); if(isBadUser === true){ let parent = x.parentElement.parentElement.parentElement.parentElement; console.log(parent); parent.remove(); } })};
func();
window.addEventListener("scroll", func);
})();