// ==UserScript==
// @name         AWBW Power Bar Hider
// @namespace    https://awbw.amarriner.com/
// @version      1.0.0
// @description  Bye bye power bars
// @author       twiggy_
// @match        https://awbw.amarriner.com/*?games_id=*
// @match        https://awbw.amarriner.com/*?replays_id=*
// @icon         https://awbw.amarriner.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463074/AWBW%20Power%20Bar%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/463074/AWBW%20Power%20Bar%20Hider.meta.js
// ==/UserScript==

let powerBarContainers = document.getElementsByClassName('co-bar-container');
Array.prototype.forEach.call(powerBarContainers, function(container) {
    container.style.display = 'none';
});