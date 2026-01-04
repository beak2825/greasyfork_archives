// ==UserScript==
// @name         Fireload Copy File
// @namespace    http://yu.net/
// @version      1.1
// @description  copy file to your account
// @author       Yu
// @match        https://www.fireload.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fireload.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480661/Fireload%20Copy%20File.user.js
// @updateURL https://update.greasyfork.org/scripts/480661/Fireload%20Copy%20File.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const getLink = async() => {
        const button = document.querySelector("[data-original-title='Copy to your account']")
        if(button) {
            button.click()
            return
        }

        await new Promise(res => setTimeout(res, 1000))
        getLink()
    }
    
    getLink()

})();