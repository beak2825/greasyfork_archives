// ==UserScript==
// @name         Show all comments on github issue
// @namespace    https://www.taylrr.co.uk
// @version      0.1
// @description  Automatically clicks the "xxx hidden items" button on Github issue pages to successively load in all the comments in the page on load.
// @author       taylor8294
// @match        https://github.com/*/issues/*
// @icon         https://icons.duckduckgo.com/ip2/github.com.ico
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/437823/Show%20all%20comments%20on%20github%20issue.user.js
// @updateURL https://update.greasyfork.org/scripts/437823/Show%20all%20comments%20on%20github%20issue.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function ready(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    function clickButton(){
        let button = document.querySelector('.ajax-pagination-form button');
        if(button){
            if(!button.disabled) button.click();
            setTimeout(clickButton,50);
        } else console.log('All comments are now showing.')
    }
    ready(()=>{setTimeout(clickButton,2000)});
})();