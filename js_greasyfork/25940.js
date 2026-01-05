// ==UserScript==
// @name         Sorry, Pinterest
// @namespace    pinterest.com
// @version      1.1
// @description  Sorry, Pinterest (hide the login)
// @author       Anton
// @match        *.pinterest.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/25940/Sorry%2C%20Pinterest.user.js
// @updateURL https://update.greasyfork.org/scripts/25940/Sorry%2C%20Pinterest.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (console) console.log('Sorry, Pinterest');
    // Your code here...
    setInterval(function() {
        if (typeof jQuery == 'function')  {
            jQuery('div[data-test-giftwrap]').hide();
            jQuery('body > div.App.AppBase.Module > div > div.mainContainer > div > div > div > div > div:nth-child(5)').hide();
        }
    }, 1000);
})();