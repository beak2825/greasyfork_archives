// ==UserScript==
// @name         Livestrong Net Calories By Day Update
// @namespace    http://kylemitofsky.com/
// @version      0.1
// @description  Manually runs the script to populate net calories by day
// @author       Kyle Mitofsky
// @match        http://www.livestrong.com/myplate*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13607/Livestrong%20Net%20Calories%20By%20Day%20Update.user.js
// @updateURL https://update.greasyfork.org/scripts/13607/Livestrong%20Net%20Calories%20By%20Day%20Update.meta.js
// ==/UserScript==


window.setTimeout(function() {
    s = document.querySelector("#calories_by_day script"); 
    eval(s.innerText);
},1000);