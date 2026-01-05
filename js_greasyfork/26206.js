// ==UserScript==
// @name         Auto Shoot for vertix
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Auto shoot, Mainly used to aid in boosting
// @author       meatman2tasty
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26206/Auto%20Shoot%20for%20vertix.user.js
// @updateURL https://update.greasyfork.org/scripts/26206/Auto%20Shoot%20for%20vertix.meta.js
// ==/UserScript==

function shoot() {
    shootBullet(player);
    setTimeout(shoot, 10);
}
shoot();