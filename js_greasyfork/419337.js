// ==UserScript==
// @name         NyTimes Never bother me plz!
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  no subcribe popover to bother reader on nytimes.com
// @author        etng
// @match        *://www.nytimes.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419337/NyTimes%20Never%20bother%20me%20plz%21.user.js
// @updateURL https://update.greasyfork.org/scripts/419337/NyTimes%20Never%20bother%20me%20plz%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("wait script")
    window.setInterval(function(){
        try{
        document.querySelector('.css-mcm29f').style.position='initial';
        document.querySelector('#gateway-content, .css-1bd8bfl').remove();
         console.log("done script")
        }catch(e){
        }
    }, 1000)
})();