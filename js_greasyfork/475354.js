// ==UserScript==
// @name         SweC - Sponsor banner
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Sponsor banner with red color and bigger text
// @author       flashen
// @match        https://www.sweclockers.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sweclockers.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475354/SweC%20-%20Sponsor%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/475354/SweC%20-%20Sponsor%20banner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var div_list = document.querySelectorAll('div[class*=card-info-]');
    var div_array = [...div_list];
    div_array.forEach(div => {

    const style = `
    color: white;
    background: crimson;
    font-size: 24px;
    `;

        div.style.cssText = style;
    });
})();