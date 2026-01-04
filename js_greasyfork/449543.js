/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               alertify
// @namespace          Wenku8++
// @version            0.1.6
// @description        alertify for wenku8++
// @author             PY-DNG
// @license            GPL-license
// @require            https://greasyfork.org/scripts/449412-basic-functions/code/Basic%20Functions.js?version=1085783
// @require            https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.13.1/alertify.min.js
// @resource           alertify-css    https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.13.1/css/alertify.min.css
// @resource           alertify-theme  https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.13.1/css/themes/default.min.css
// @grant              GM_getResourceText
// ==/UserScript==

['alertify-css', 'alertify-theme'].forEach((function(r) {addStyle(GM_getResourceText(r), r)}));
window.alertify.set('notifier','position', 'top-right');
exports = window.alertify;