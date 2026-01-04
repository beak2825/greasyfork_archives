// ==UserScript==
// @name         Narrower(右键菜单)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  narrow body margin in current webpage to make it more readable. open it in right click menu, and enter percentage of margin, that it.
// @author       You
// @include      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ik4.es
// @run-at        context-menu
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455410/Narrower%28%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95%29.user.js
// @updateURL https://update.greasyfork.org/scripts/455410/Narrower%28%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95%29.meta.js
// ==/UserScript==



let value = prompt("Please enter rate %", "40");
value = value/2;
value = value + '%';

document.documentElement.style.paddingLeft = value;
document.documentElement.style.paddingRight = value;
