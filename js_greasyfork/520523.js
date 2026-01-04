// ==UserScript==
// @name         e-timologio | Invoice list set IssueDateFrom to One Year Ago
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Set the IssueDateFrom input to one year ago
// @author       Ratikal
// @license MIT 
// @match        https://mydata.aade.gr/timologio/invoice/listinvoices*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520523/e-timologio%20%7C%20Invoice%20list%20set%20IssueDateFrom%20to%20One%20Year%20Ago.user.js
// @updateURL https://update.greasyfork.org/scripts/520523/e-timologio%20%7C%20Invoice%20list%20set%20IssueDateFrom%20to%20One%20Year%20Ago.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {  
      	setTimeout(function() {
          
         	const issueDateFrom = document.getElementById('IssueDateFrom');
          if (issueDateFrom) {
            const currentDate = new Date();
          	const month = String(currentDate.getMonth() + 1 - 2).padStart(2, '0');
        		const year = currentDate.getFullYear();
          	issueDateFrom.value = `01/${month}/${year}`;
            document.getElementById('mark').value = "";
            document.getElementById('btnSearch').click();
          }
                    
        }, 50);
   	 });
})();

