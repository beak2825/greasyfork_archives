// ==UserScript==
// @name        Underline for KaLaM
// @namespace   ns
// @match       *://kalam.ump.edu.my/course/*
// @grant       none
// @version     1.0
// @author      Nurruddin Zainori, Anon /g/thread/90526285#p90529341 (/g/wdg)
// @description 26/12/2022, 10:47:55 pm
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457171/Underline%20for%20KaLaM.user.js
// @updateURL https://update.greasyfork.org/scripts/457171/Underline%20for%20KaLaM.meta.js
// ==/UserScript==
toAll = document.querySelectorAll(".activityinstance");
        console.log({ toAll });
        toAll.forEach(e => {
            e.parentElement.style.borderBottom = "1px solid blue";
        });