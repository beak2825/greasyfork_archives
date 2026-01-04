// ==UserScript==
// @name         SeewoLive 知识胶囊不准登录并且1.5倍速
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Clare
// @match        https://easinote.flashshan.com/en-capsule-std/share/play*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399035/SeewoLive%20%E7%9F%A5%E8%AF%86%E8%83%B6%E5%9B%8A%E4%B8%8D%E5%87%86%E7%99%BB%E5%BD%95%E5%B9%B6%E4%B8%9415%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/399035/SeewoLive%20%E7%9F%A5%E8%AF%86%E8%83%B6%E5%9B%8A%E4%B8%8D%E5%87%86%E7%99%BB%E5%BD%95%E5%B9%B6%E4%B8%9415%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let p = Audio.prototype.play; Audio.prototype.play = function(){this.playbackRate=1.5;return p.bind(this)()};document.querySelector(".capsule-player-mask").remove()
    // Your code here...
})();