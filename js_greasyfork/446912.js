
// ==UserScript==
// @name        Auto refresh mealninja.me
// @namespace   violentmonkey scripttt
// @match       https://mealninja.me/watch.php*
// @grant       none
// @version     1.0
// @author      - RESTINPEACEWALUIGI
// @description Refreshes every 5 minutes mealninja.me
// @license N/A
// @downloadURL https://update.greasyfork.org/scripts/446912/Auto%20refresh%20mealninjame.user.js
// @updateURL https://update.greasyfork.org/scripts/446912/Auto%20refresh%20mealninjame.meta.js
// ==/UserScript==
 
const twenty4Seven = () => {
  console.log("Restaring..");
  window.location.href='https://mealninja.me/watch.php?v=953522&p=6372';
}
 
setInterval(twenty4Seven,300000);