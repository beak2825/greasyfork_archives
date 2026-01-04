///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ==UserScript==
// @name         Filter Scroll for Amazon
// @namespace    https://cbass92.org/
// @version      1.2
// @description  Makes the little Amazon filter thing follow you and scroll on it's own. I spent too long on this.
// @author       Cbass92
// @match        https://www.amazon.com/s*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498618/Filter%20Scroll%20for%20Amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/498618/Filter%20Scroll%20for%20Amazon.meta.js
// ==/UserScript==
    let element = document.getElementsByClassName('sg-col-inner');
    element[element.length - 1].style.position = "fixed";
    element[element.length - 1].style.overflowY = "auto";
    element[element.length - 1].style.width = "inherit";
    element[element.length - 1].style.height = "60vh";
    element[element.length - 1].style.borderRadius = "15px";
    element[element.length - 1].style.backgroundColor = "#c8c9cc";
    element[element.length - 1].style.padding = "10px";