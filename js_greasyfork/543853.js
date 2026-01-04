// ==UserScript==
// @name         修改网页字体
// @namespace    http://tampermonkey.net/
// @version      2025-07-28 1.0
// @description  修改网页字体，方便观看
// @author       You
// @match        https://gb.falundafa.org/chigb/*
// @exclude      https://greasyfork.org/*
// @license MIT
 
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543853/%E4%BF%AE%E6%94%B9%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/543853/%E4%BF%AE%E6%94%B9%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==
 
(function() {
    var pElements = document.getElementsByTagName('font')
    for (let i = 0 ; i < pElements.length; i++) {
        let pElement = pElements[i]
        pElement.style.fontSize = '30px';
        pElement.style.lineHeight = 1.2
    }
})();