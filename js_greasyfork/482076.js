// ==UserScript==
// @name         Symol Hole Autoselect
// @namespace    https://greasyfork.org/en/users/1202961-twiggies
// @version      2023-12-13
// @description  Automatically selects an option at the symol hole.
// @author       You
// @match        https://www.grundos.cafe/medieval/symolhole/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482076/Symol%20Hole%20Autoselect.user.js
// @updateURL https://update.greasyfork.org/scripts/482076/Symol%20Hole%20Autoselect.meta.js
// ==/UserScript==

document.querySelector('#enter_action option:not([disabled])').selected = 'selected'