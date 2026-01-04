// ==UserScript==
// @name         New Bands Button for Monochrome-Heaven
// @version      0.5
// @description  Adds a button for new bands under "News"
// @author       colorfuljinsei
// @match        https://www.monochrome-heaven.com/
// @namespace https://greasyfork.org/users/383828
// @downloadURL https://update.greasyfork.org/scripts/390811/New%20Bands%20Button%20for%20Monochrome-Heaven.user.js
// @updateURL https://update.greasyfork.org/scripts/390811/New%20Bands%20Button%20for%20Monochrome-Heaven.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var button = document.createElement("button");
    button.style.cssText = "background-color:transparent;border-style:none;text-align:left;padding:0;font-size:1.2rem;color:#ededed;font-weight:bold;";
    button.innerHTML = "<a href='https://www.monochrome-heaven.com/search/?q=formed&type=forums_topic&nodes=9&updated_after=any&sortby=newest&search_in=titles'>New Bands</a>";
    var body = document.getElementsByClassName("ipsDataItem_subList ipsList_inline")[0];
    body.appendChild(button);

})();