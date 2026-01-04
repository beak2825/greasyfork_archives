// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.twitch.tv/ciouantony
// @grant        GM_setClipboard
// @require      http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.7.2.js
// @downloadURL https://update.greasyfork.org/scripts/369739/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/369739/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('.chat-line__username:contains(BlizzardZHTW)').siblings().each(
        function(){
            if (/(\w)+-(\w)+-(\w)+-(\w)+/.test($(this).text())) {
                GM_setClipboard($(this).text(), 'text');
            }
        }
    );
})();