// ==UserScript==
// @name         Always allow fullscreen for embedded YouTube videos
// @version      0.1
// @description  Adds allowfullscreen attribute to embedded YouTube iframes
// @author       okradonkey
// @include      https://*/*
// @include      http://*/*
// @grant        GM_addStyle
// @grant        GM.getValue
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @run-at       document-end
// @namespace https://greasyfork.org/users/370974
// @downloadURL https://update.greasyfork.org/scripts/390116/Always%20allow%20fullscreen%20for%20embedded%20YouTube%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/390116/Always%20allow%20fullscreen%20for%20embedded%20YouTube%20videos.meta.js
// ==/UserScript==

/* - The @grant directive is needed to work around a design flaws introduced in GM 1.0
     and again in GM 4.0.
     It restores the sandbox.

     Original 2016 script by prositen: https://greasyfork.org/en/scripts/24956-allow-fullscreen
     Edited 2019 by okradonkey to fix jquery conflicts
*/

(function() {
    $('iframe[src^="https://www.youtube.com/embed/"]').each(function(i,v) {
      $(v).attr('allowfullscreen',true);
    });
})();
