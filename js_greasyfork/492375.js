// ==UserScript==
// @name         Change Stuff
// @namespace    http://tampermonkey.net/
// @version      2024-04-12
// @description   Hide Stuff
// @license MIT
// @author       You
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require         https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @grant           GM.xmlHttpRequest
// @grant           GM.setValue
// @grant           GM.getValue
// @connect         maps.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/492375/Change%20Stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/492375/Change%20Stuff.meta.js
// ==/UserScript==

(function() {
    'use strict';

  //    HideElementsByClass("geocaching.com","owner-display","by waterfan5",3);
  //    HideElementsByClass("geocachingpuzzleoftheday.blogspot.com","post-title entry-title","Geotunes",4);


    function HideElementsByClass(strPage, strClass, strText, nParentToRemove) {
        if (window.location.hostname.indexOf(strPage.toLowerCase()) >= 0) {
            let result = document.getElementsByClassName(strClass);
            for (let i = 0; i < result.length; i++) {
                var node = result[i]
                if (node.textContent.indexOf(strText) >= 0) {
                    for (let j = 0; j < nParentToRemove; j++) {
                        node = node.parentNode;
                    }
                    console.log("Removing:" + node.class,node.textContent);
                    node.parentNode.removeChild(node);

                }
            }
        }
    }
})();