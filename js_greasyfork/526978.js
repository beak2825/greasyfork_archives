// ==UserScript==
// @name missav宽屏
// @description missav宽屏1
// @description:en missav宽屏2

// @namespace http://tampermonkey.net/
// @author test1
// @license AGPL-3.0
// @version 1.0.6

// @match        https://missav.com/*
// @match        https://missav.ws/*
// @match        https://missav.ai/*
// @match        https://thisav.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.com
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/526978/missav%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/526978/missav%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Add custom CSS for screens with width >= 1920px
    GM_addStyle(`
/*         @media (min-width: 1920px) { */
            .sm\\:container {
                max-width: 1450px;
            }
            .sm\\:hidden.-mx-4.px-4{
              display: flex
            }
/*         } */
    `);

    const elements = document.querySelectorAll('.flex-none.mr-4');
    elements.forEach(element => {
        element.style.width = '280px';
    });

})();