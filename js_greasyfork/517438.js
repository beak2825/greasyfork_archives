// ==UserScript==
// @name         time.is black style
// @namespace    https://greasyfork.org
// @version      20241115.8
// @description  black ver time.is, idea from t.me/GBTBBR
// @author       AlPt
// @match        https://time.is/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=time.is
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517438/timeis%20black%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/517438/timeis%20black%20style.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('clock0_bg').style.color = 'white';
    document.body.style.backgroundColor = 'black';
    document.getElementById('mainwrapper').style.backgroundColor = 'black';
    document.getElementById('top').style.display='none';
    document.getElementById('clock0_bg').click();
})();