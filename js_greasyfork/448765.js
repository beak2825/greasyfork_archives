// ==UserScript==
// @name       Hide top 10 searches from m-w.com
// @namespace  http://mathemaniac.org/
// @version    1.0.0
// @description  Hides top 10 searches from m-w.com (Merriam-Webster), since it usually spoils the correct Wordle answer.
// @match        https://www.merriam-webster.com/
// @copyright  2022, Sebastian Paaske Tørholm
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/448765/Hide%20top%2010%20searches%20from%20m-wcom.user.js
// @updateURL https://update.greasyfork.org/scripts/448765/Hide%20top%2010%20searches%20from%20m-wcom.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', `
    <style>
        .top-lookup-now { visibility: hidden !important; }
    </style>
`);
