// ==UserScript==
// @name         Gay gyfio
// @namespace    http://your.homepage/
// @version      1
// @description  enter something useful
// @author       kmc
// @match        http://gifyo.com/live/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10971/Gay%20gyfio.user.js
// @updateURL https://update.greasyfork.org/scripts/10971/Gay%20gyfio.meta.js
// ==/UserScript==


addGlobalStyle('.image{display:none;}.overlay_blue{display:none;}')

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

$(document).on("click", ".profile_gif", function() {
    var link = event.target.getAttribute("data-animated");
    link = link.replace(/medium/g, "large");
    window.open(link, '_blank');
});