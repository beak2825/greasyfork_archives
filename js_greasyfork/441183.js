// ==UserScript==
// @name       Wørdle flip dark-mode colors
// @namespace  http://mathemaniac.org/
// @version    1.0.0
// @description  Having the available letters be darker than the used ones on the keyboard confuses me - so this flips the colors.
// @match        https://xn--wrdle-vua.dk/
// @copyright  2022, Sebastian Paaske Tørholm
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/441183/W%C3%B8rdle%20flip%20dark-mode%20colors.user.js
// @updateURL https://update.greasyfork.org/scripts/441183/W%C3%B8rdle%20flip%20dark-mode%20colors.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

document.head.insertAdjacentHTML('beforeend', `
<style>
.dm .keyboard-row>button { background-color: #888 !important; }
.dm .keyboard-row>button.absent { background-color: #333 !important; }
.dm .keyboard-row>button.match { background-color: #019e01 !important; }
.dm .keyboard-row>button.present { background-color: #eb6f0a !important; }
</style>
`);

