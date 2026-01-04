// ==UserScript==
// @name         testColor
// @namespace    https://b2b.defacto.com.tr/web/Laboratory/ProductTestRequest
// @version      0.1
// @description  Test sonuçlarını renklerdirme aracı
// @author       Tevfik Bagcivan
// @match        https://b2b.defacto.com.tr/web/Laboratory/ProductTestRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=defacto.com.tr
// @grant        none
// @run-at       document-end
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/449300/testColor.user.js
// @updateURL https://update.greasyfork.org/scripts/449300/testColor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector("#productTestRequestGrid > div.k-grid-content > table > tbody").addEventListener("mouseover", myFunction)

    function myFunction() {
        var satirno = document.querySelector("#productTestRequestGrid > div.k-grid-content > table > tbody").children.length;
        if (satirno > 0){

            for (let i = 0; i <satirno; ++i) {
                var result = document.querySelector("#productTestRequestGrid > div.k-grid-content > table > tbody").rows[i].children[10].textContent;
                if (result == 'PASS'){
                    document.querySelector("#productTestRequestGrid > div.k-grid-content > table > tbody").rows[i].style.backgroundColor = '#40BC04';
                } else if (result == 'FAIL') {
                    document.querySelector("#productTestRequestGrid > div.k-grid-content > table > tbody").rows[i].style.backgroundColor = '#F90012';
                }
            }
        }

    }

})();