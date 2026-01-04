// ==UserScript==
// @name         sites blocker
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Block sites you don't want your kid, student and self to see.
// @author       Thundercatcher
// @match        http://example.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446865/sites%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/446865/sites%20blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Go to match and type the home url for the sites that you want to be blocked. Omegle and Tinder are the defult sites you can easily change them if you want

     document.write('<h3 style="text-align: center;">Site Blocked by site blocker</h3>');
    document.write('<h3 style="text-align: center;">This site has been blocked by your administer</h3>');
    document.write('<h3 style="text-align: center;">( If you think this is a mistake you can contact to your administer to unblock this site</h3>');
    document.write('<h3 style="text-align: center;">We do our best to ensure the internet is a safe and fun place for everyone. As an important reminder, we dont have access to your computer and we did not set this up.</h3>');
    document.write('<h3 style="text-align: center;">All credits belong to <a href="https://greasyfork.org/en/users/918560-thundercatcher">Thundercatcher</a></h3>');
(document.body.style.backgroundColor = "#32CD32");
})();