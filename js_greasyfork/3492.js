// ==UserScript==
// @name           Kyberia - games
// @version        0.2
// @namespace      XcomeX
// @author         XcomeX
// @description    Improve forum layout
// @include        https://kyberia.sk/id/64199
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/3492/Kyberia%20-%20games.user.js
// @updateURL https://update.greasyfork.org/scripts/3492/Kyberia%20-%20games.meta.js
// ==/UserScript==


(function () {
    
    var topic = document.getElementById("topic");
    topic.style.height = '30px';
    topic.style.display = 'block';
    topic.style.overflow = 'hidden';

}());