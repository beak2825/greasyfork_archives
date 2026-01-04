// ==UserScript==
// @name         GimmeTheDog Reduce Font Size of SDQL Results
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Decrease row size of SDQL Table for gimmethedog.com query results
// @author       Swain Scheps
// @match        https://www.gimmethedog.com/*
// @match        https://www.gimmethedog.com/MLB?q*
// @match        https://www.gimmethedog.com/NBA?q*
// @match        https://www.gimmethedog.com/NCAAFB?q*
// @match        *gimmethedog.com/*
// @match        https://www.gimmethedog.com/NHL?q*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/482776/GimmeTheDog%20Reduce%20Font%20Size%20of%20SDQL%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/482776/GimmeTheDog%20Reduce%20Font%20Size%20of%20SDQL%20Results.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function adjustFontSize() {
    const style = document.createElement('style');
    style.innerHTML = `
        #myTable2 tr td, #myTable2 tr th,
        .row.ml-4 .table-wrapper .flat tr td, .row.ml-4 .table-wrapper .flat tr th,
        .container-fluid table-overflow mt-4 tr td, .container-fluid table-overflow mt-4 tr th,
        .d-flex.mb-2.ml-4 .table-wrapper.flat tr td, .d-flex.mb-2.ml-4 .table-wrapper.flat tr th {
            padding-top: 0px !important;
            padding-bottom: 0px !important;
            padding-left: 3px !important;
            padding-right: 3px !important;
            font-size: 13px !important;
        }
  .fixTableHead-wrapper, .row.ml-4 .table-wrapper, .d-flex.mb-2.ml-4 .table-wrapper {
            overflow: visible !important;  /* This will remove both horizontal and vertical scroll bars */
    `;
    document.head.appendChild(style);
    console.log("Table styles applied!");
        //<div class="container-fluid table-overflow mt-4">
    let table3Elem = document.querySelector(".container-fluid table-overflow mt-4");
    if (table3Elem) {
        table3Elem.setAttribute("id", "myTable3");
        let style3 = document.createElement('style');
        style3.innerHTML = `
  #myTable3 {
    font-size: 13px !important;
  }
  #myTable3 tr td, #myTable3 tr th {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    padding-left: 3px !important;
    padding-right: 3px !important;
  }
`;
        document.head.appendChild(style3);
        console.log("container-fluid styles applied!");
    } else {
        console.log("container-fluid not found");
           }
       }
    let divElem = document.querySelector('div.py-2');
    if (divElem) {
        divElem.style.display = 'none';
    } else {
        console.log("logo not found");
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded',adjustFontSize);
    } else {
         adjustFontSize();
    }
     window.addEventListener('load', function() {
        var table = document.getElementById('myTable2'); 
        var tbody = table.getElementsByTagName('tbody')[0];
        var rows = Array.prototype.slice.call(tbody.rows, 0);
        rows.reverse().forEach(function(row) {
            tbody.appendChild(row);
        });
         console.log('Date Sort Reversed');
    });
}

)();