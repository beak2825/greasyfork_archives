// ==UserScript==
// @name         允许复制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  超星考试允许复制
// @author       PRO
// @match        https://mooc1.chaoxing.com/exam-ans/exam/test/reVersionTestStartNew*
// @icon         http://chaoxing.com/favicon.ico
// @grant        none
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/469361/%E5%85%81%E8%AE%B8%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/469361/%E5%85%81%E8%AE%B8%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.attributes.removeNamedItem("onselectstart");
    let css = document.createElement("style");
    css.textContent = `html:not(input):not(textarea):not(select):not(option):not(button){
    -webkit-touch-callout: unset !important;
    -webkit-user-select: unset !important;
    -khtml-user-select: unset !important;
    -moz-user-select: unset !important;
    -ms-user-select: unset !important;
    user-select: unset !important;
}`;
    document.head.appendChild(css);
})();