// ==UserScript==
// @name         Neopets Overhaul Flashing Lights Fix
// @namespace
// @run-at       document-start
// @version      1.1.2
// @license      GNU GPLv3
// @description  Helps reduce flashing colors during loading.
// @author       Lamp
// @match        https://www.neopets.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none

// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/485741/Neopets%20Overhaul%20Flashing%20Lights%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/485741/Neopets%20Overhaul%20Flashing%20Lights%20Fix.meta.js
// ==/UserScript==

(function() {


                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = `

     #loading{
     top: 0px;
     left:0px;
position: fixed;
z-index: 999;
    background:`+localStorage.getItem('gradient')+`;
    height: 100%;
    width:100%;
    color: white;
}

`;

                   var loading = document.createElement('div');
                loading.id = "loading";
                loading.innerHTML = `

`;


                document.getElementsByTagName('html')[0].appendChild(loading);




    document.getElementsByTagName('html')[0].appendChild(style);



})();