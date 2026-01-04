// ==UserScript==
// @name         pastel_planet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  a pinker experience
// @author       Sharon Din
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377440/pastel_planet.user.js
// @updateURL https://update.greasyfork.org/scripts/377440/pastel_planet.meta.js
// ==/UserScript==
    //pink background
    document.body.style.background = "#FFEBFA";
    //pink planet cursor
    document.body.style.cursor ="url('http://w3stu.cs.jmu.edu/dinsx/cs347/userscript/help%20planet%20cursor.cur'), auto";
    //dark pink font color
    document.body.style.color = "#F953D0";
    //italic arial font
    document.body.style.font = "italic bold 20px arial,serif";
