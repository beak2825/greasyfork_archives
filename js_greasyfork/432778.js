// ==UserScript==
// @name         Disable Skidrow reloaded games' ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  disable ads of the Skidrow reloaded games' web
// @author       Jazzu Lu
//-----------------------------------------------------------
// @require      https://code.jquery.com/jquery-1.9.1.min.js
//-----------------------------------------------------------
// @include      *.skidrowreloaded.com*
//-----------------------------------------------------------
// @match        https://calmisland.atlassian.net/wiki/spaces/NKL/pages/2328297488/Sprint+13+Sep+15th+-+Oct+12th
// @icon         https://www.skidrowreloaded.com/wp-content/uploads/2018/06/cropped-faviicon-192x192.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432778/Disable%20Skidrow%20reloaded%20games%27%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/432778/Disable%20Skidrow%20reloaded%20games%27%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        $('a[dont]').remove();
    },1500)
})();