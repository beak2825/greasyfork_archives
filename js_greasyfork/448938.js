// ==UserScript==
// @name         Woomy Modding API - TEMPLATE
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  A template for the woomy modding api
// @author       You
// @match        https://woomy.surge.sh/
// @match        https://woomy-arras.netlify.app
// @match        https://www.woomy-arras.xyz/
// @grant        none
// @require      https://greasyfork.org/scripts/448888-woomy-modding-api/code/Woomy%20Modding%20Api.js?version=1082014
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/448938/Woomy%20Modding%20API%20-%20TEMPLATE.user.js
// @updateURL https://update.greasyfork.org/scripts/448938/Woomy%20Modding%20API%20-%20TEMPLATE.meta.js
// ==/UserScript==

(function() {
    'use strict'
    // Wait for the api to load
    if(window.WMA&&window.WMA.loaded){
        run()
    }else{
        if(window.WMALoadQueue){
            window.WMALoadQueue.push(run)
        }else{
            window.WMALoadQueue = [run]
        }
    }

    // Once the api is loaded run this function
    function run(){
        // Your code goes here
    }
})();