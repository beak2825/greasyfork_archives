// ==UserScript==
// @name         Ball Sizes
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Allows you to change ball size from -10000000 to 10000000
// @author       MYTH_doglover
// @match        https://supercarstadium.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426294/Ball%20Sizes.user.js
// @updateURL https://update.greasyfork.org/scripts/426294/Ball%20Sizes.meta.js
// ==/UserScript==

let ballslider = document.getElementById('newbonklobby_ballsizeslider');
ballslider.type = "text";
ballslider.classList.add("mapeditor_field");
ballslider.classList.add("fieldShadow");
ballslider.classList.remove("compactSlider");
ballslider.max = "10000000";
ballslider.min = "-10000000";