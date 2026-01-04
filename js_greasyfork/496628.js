// ==UserScript==
// @name         LSCCT Dark Mode
// @namespace    https://lai-0602.com
// @version      2024-05-31
// @description  Enables dark mode for LSCCT.
// @author       You
// @match        https://lscct.com/taskview.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lscct.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496628/LSCCT%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/496628/LSCCT%20Dark%20Mode.meta.js
// ==/UserScript==

let containers = document.querySelectorAll('div.container');
if(containers.length >= 2) {
    containers[1].style.backgroundColor = '#333333';
    containers[1].style.color = 'white';
}