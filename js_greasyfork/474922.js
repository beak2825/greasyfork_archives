// ==UserScript==
// @name         Jstris table sort
// @namespace    
// @version      0.2
// @description  add sorting to tables
// @author       mxmossy
// @match        https://*.jstris.jezevec10.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474922/Jstris%20table%20sort.user.js
// @updateURL https://update.greasyfork.org/scripts/474922/Jstris%20table%20sort.meta.js
// ==/UserScript==

(function() {
     // adapted from https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript
    var getCellValue = function(tr, idx){ return tr.children[idx].innerText || tr.children[idx].textContent; }

    var format = function(s){return s.replace(/[:\- ]/g, "")}

    var comparer = function(idx, asc) {
        return function(a, b) {
            return function(v1, v2) {
                if(v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)){
                    return v1 - v2;
                }
                else if(v1.includes(":") || v2.includes(":")){
                    return parseFloat(format(v1)) - parseFloat(format(v2));
                }
                else return v1.toString().localeCompare(format(v2));
            }(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
        }};

    // do the work...
    Array.prototype.slice.call(document.querySelectorAll('th')).forEach(function(th) { th.addEventListener('click', function() {
        var table = th.parentNode;
        while(table.tagName.toUpperCase() != 'TABLE') table = table.parentNode;
        var tableBody = table.querySelector('tbody');
        Array.prototype.slice.call(table.querySelectorAll('tbody tr:nth-child(n+1)'))
            .sort(comparer(Array.prototype.slice.call(th.parentNode.children).indexOf(th), this.asc = !this.asc))
            .forEach(function(tr) { tableBody.appendChild(tr) });
    })});

})();