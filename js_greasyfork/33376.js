// ==UserScript==
// @name         Reddit sidebar toggle
// @namespace    http://tampermonkey.net/
// @version      1
// @description  fix that shit
// @author       You
// @match        https://www.reddit.com/r/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33376/Reddit%20sidebar%20toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/33376/Reddit%20sidebar%20toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let e = document.querySelectorAll(".side")[0];
        let con = document.querySelectorAll("div.content")[0];
        const conRight = window.getComputedStyle(con).marginRight;
    function toggle_sidebar() {
        if(e.style.display == 'none') {
           e.style.display = 'block';
           con.style.marginRight = conRight;
        }
        else {
            e.style.display = 'none';
            con.style.marginRight = "8px";
        }
    }
    let buttonToggle = document.createElement("button");
    buttonToggle.innerHTML = "Sidebar";
    buttonToggle.style = "position: fixed; bottom: 3px; right: 10px; z-index:999;"
    buttonToggle.onclick = toggle_sidebar;
    document.body.appendChild(buttonToggle);
})();