// ==UserScript==
// @name         Amazon package tracking
// @namespace    https://www.amazon.com
// @version      0.1
// @description  show Amazon package tracking on the main tracking page
// @author       Vexe
// @match        https://www.amazon.com/progress-tracker/package/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467103/Amazon%20package%20tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/467103/Amazon%20package%20tracking.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // click the tracking updates link to retrieve data
    document.querySelector('[data-ref="ppx_pt2_dt_b_pt_detail"]').click();

    // get contents of tracking popup
    var tinfo = document.getElementById('a-popover-content-1');

    document.querySelector('section.pt-card.delivery-card').appendChild(tinfo);

    document.getElementById('a-popover-lgtbox').style.visibility = "hidden";
    document.getElementById('a-popover-1').style.visibility = "hidden";
    document.getElementById('a-popover-1').style.display = "none";
})();