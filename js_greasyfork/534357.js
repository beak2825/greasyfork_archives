// ==UserScript==
// @name 			WME-NLWiki
// @description 	Adds links to other maps
// @namespace 		http://tampermonkey.net/
// @author          Robin Breman | Waze NL | @robbre | https://github.com/RobinBreman/WME-MapLinks
// @match           *://*.waze.com/*editor*
// @exclude         *://*.waze.com/user/editor*
// @grant 			none
// @version 		1.0.0
// @downloadURL https://update.greasyfork.org/scripts/534357/WME-NLWiki.user.js
// @updateURL https://update.greasyfork.org/scripts/534357/WME-NLWiki.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const version = '1.0.0';
    
    function wmescript_bootstrap() {
        const wazeapi = window.W;
        if (!wazeapi || !wazeapi.map) {
            setTimeout(wmescript_bootstrap, 1000);
            return;
        }
        document.querySelector("#OpenLayers_Control_133 > a:nth-child(5)").href='http://wazeopedia.nl'; 
    }

    setTimeout(wmescript_bootstrap, 5000);
})();
