// ==UserScript==
// @name         BDO Nomura Auto Refresh Session
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Refresh user session by simulating clicking to links
// @author       You
// @match        https://www.bdo.com.ph/bdonomura/site/main.do*
// @match        https://www.bdo.com.ph/bdonomura/site/marketResearch.do
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38679/BDO%20Nomura%20Auto%20Refresh%20Session.user.js
// @updateURL https://update.greasyfork.org/scripts/38679/BDO%20Nomura%20Auto%20Refresh%20Session.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('BDO Nomura Auto Session Refresher - Jed Buenaventura');


    // Check if on main site
    if (window.location.href.indexOf('main.do') > -1)
    {
        console.log('Main page detected...');
        // Navigate to Market Research if Trade button is clicked
        var links = document.querySelectorAll('.trade');
        links[0].addEventListener('click',redirectToMarket);
        links[1].addEventListener('click',redirectToMarket);
    }
    else
    {
        console.log('Market Research page detected...');
        // Original web title
        var rawTitle = document.title;

        // Refresh every 45 seconds
        var idleTimer = 45;
        setInterval(function(){
            if (idleTimer >= 1)
                document.title = idleTimer + ' | ' + rawTitle;
            else
            {
                document.title = 'Refreshing | ' + rawTitle;
                document.querySelectorAll('.market_research')[0].click();
            }
            idleTimer--;
        }, 1000);
    }


    function redirectToMarket()
    {
        console.log('Kicking off auto session refresh');
        window.location = 'https://www.bdo.com.ph/bdonomura/site/marketResearch.do';
    }
})();