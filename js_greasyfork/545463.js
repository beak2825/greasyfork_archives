// ==UserScript==
// @name         Usuń Reklamy Na Synonim.net
// @name:en      Remove Ads On Synonim.net
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Usuwa reklamy na synonim.net.
// @description:en Removes ads on synonim.net.
// @author       Toni20k5267
// @match        https://synonim.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=synonim.net
// @grant        none
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/545463/Usu%C5%84%20Reklamy%20Na%20Synonimnet.user.js
// @updateURL https://update.greasyfork.org/scripts/545463/Usu%C5%84%20Reklamy%20Na%20Synonimnet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('meow meow')
    //waits till page loaded
    window.addEventListener('load', () => {
        console.log('nyaa~')
        //selects all elements that have the class .adg, which are most ads on synonim.net
        document.querySelectorAll('.adg').forEach(el => {
        //removes said element
        el.style.display = 'none';
            console.log('adg rmvd')
        });
        //selects the element of the id iall, which is 1 ad on synonim.net
        document.querySelectorAll('#iall').forEach(el => {
        //removes said element
        el.style.display = 'none';
                        console.log('iall rmvd')

        });
        //selects the element of the id wtgSticky, which is 1 ad on synonim.net
        document.querySelectorAll('#wtgSticky').forEach(el => {
        //removes said element
        el.style.display = 'none';
                        console.log('wtg rmvd')

        });
    });

})();