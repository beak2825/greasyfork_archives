// ==UserScript==
// @name         Disable Fextralife Embed
// @namespace    fextralife.com
// @version      0.1
// @description  Disables fextralife embedded stream, see https://www.youtube.com/watch?v=iopeUvrYX9Q for more details
// @author       ingvarr
// @match        *://*.fextralife.com/*
// @license MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474098/Disable%20Fextralife%20Embed.user.js
// @updateURL https://update.greasyfork.org/scripts/474098/Disable%20Fextralife%20Embed.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const query = '#fextrastream';
    setInterval(()=>{
        const element = document.querySelector(query);
        if(element) element.innerHTML = '';
    },300);

})();