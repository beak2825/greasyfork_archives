// ==UserScript==
// @name         McGrawHill - Canvas Instructure
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      0.1
// @description  Auto closes the tab that launches McGrawHill external assignments "If your assignment hasn't launched, click the button below".
// @author       hacker09
// @match        https://*.instructure.com/courses/*/assignments*
// @icon         https://du11hjcvx0uqb.cloudfront.net/br/dist/images/favicon-e10d657a73.ico
// @run-at       document-end
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/465983/McGrawHill%20-%20Canvas%20Instructure.user.js
// @updateURL https://update.greasyfork.org/scripts/465983/McGrawHill%20-%20Canvas%20Instructure.meta.js
// ==/UserScript==

(function() {
  'use strict';
  //make sure the link opens how? should I just open the link first then close the tab using this script?
  if (document.querySelector("iframe#tool_content.tool_launch") !== null) //If the text "If your assignment hasn't launched, click the button below" element exists on the page
  { //Starts the if condition
    window.top.close(); //Close the tab
  } //Finishes the if condition
})();