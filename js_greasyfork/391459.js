// ==UserScript==
// @name         New York Motor Vehicle Accident Prevention Course Auto Click
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Ethan Wang
// @match        https://home.uceusa.com/Courses/Study.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391459/New%20York%20Motor%20Vehicle%20Accident%20Prevention%20Course%20Auto%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/391459/New%20York%20Motor%20Vehicle%20Accident%20Prevention%20Course%20Auto%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function autoclick(){
        if(window.frames["mainContent"]!=null){
        if(window.frames["mainContent"].document.querySelector("#TimeRemainingClock")!=null){
        if(window.frames["mainContent"].document.querySelector("#TimeRemainingClock").innerText == '00:00:00'){
            window.frames["mainContent"].document.querySelector("#next_top").click()
        }}}
        setTimeout(function(){autoclick()}, 5000);
    }
    autoclick();

    // Your code here...
})();