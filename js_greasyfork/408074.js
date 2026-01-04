// ==UserScript==
// @name         Wi - Cân đối kế toán VND
// @namespace    http://wigroup.vn
// @version      0.2
// @description  Show BCTC
// @author       Trung Kien
// @match        https://www.vndirect.com.vn/portal/bang-can-doi-ke-toan/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408074/Wi%20-%20C%C3%A2n%20%C4%91%E1%BB%91i%20k%E1%BA%BF%20to%C3%A1n%20VND.user.js
// @updateURL https://update.greasyfork.org/scripts/408074/Wi%20-%20C%C3%A2n%20%C4%91%E1%BB%91i%20k%E1%BA%BF%20to%C3%A1n%20VND.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lv3 = document.getElementsByClassName('lv3')
    let lv4 = document.getElementsByClassName('lv4')
    for(let i=0;i<lv3.length;i++)
        {
          lv3[i].removeAttribute("style")
        }
    for(let i=0;i<lv4.length;i++)
        {
          lv4[i].removeAttribute("style")
        }
})();