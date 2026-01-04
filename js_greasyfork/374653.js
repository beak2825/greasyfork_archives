// ==UserScript==
// @name         We Need To Go Wider
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  No Gamepedia, you do not need to dedicate space for your shitty siderail thing
// @author       Vincent Tan
// @match        https://feheroes.gamepedia.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/374653/We%20Need%20To%20Go%20Wider.user.js
// @updateURL https://update.greasyfork.org/scripts/374653/We%20Need%20To%20Go%20Wider.meta.js
// ==/UserScript==

/* Original:
@media screen and (min-width: 1350px) {
    #global-wrapper.with-siderail #content #bodyContent {
        box-sizing:border-box;
        float: left;
        width:calc(100% - 410px - 20px);
    }
*/

(function() {
    'use strict';

    //Thanks to Brock Adams @ https://stackoverflow.com/questions/19385698/how-to-change-a-class-css-with-a-greasemonkey-tampermonkey-script?rq=1
    GM_addStyle ( `
@media screen and (min-width: 1350px) {
#global-wrapper.with-siderail #content #bodyContent {
box-sizing:border-box;
float: left;
width: 100% !important;
}
` );
})();