// ==UserScript==
// @name         XLR Wildcard Search - Final
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically adds wildcard characters and removes whitespace in XLR searches
// @author       Lucas Labounty
// @match        http://xlr.zayo.com/CircuitInfo/CircuitLayoutRecord.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395056/XLR%20Wildcard%20Search%20-%20Final.user.js
// @updateURL https://update.greasyfork.org/scripts/395056/XLR%20Wildcard%20Search%20-%20Final.meta.js
// ==/UserScript==
// https://greasyfork.org/en/scripts/395056-xlr-wildcard-search-final

(function() {
    'use strict';
    document.getElementById("btnFindCircuitDesignID").onclick = function() {

        var circuitID = document.getElementById("form1").elements[2].value; //XLR has a form called "form1" which includes all inputs on the page. Element 2 is the CID field. This gets the value in that field and assigns it to a variable

		circuitID = circuitID.replace(/\\/g, "/");

		circuitID = circuitID.replace(/(\/)/g, "%"); //use regex to replace all "/" with "%"

        circuitID = circuitID.replace(/( )/g, ""); //use regex to delete all spaces (" ")

        circuitID = circuitID.replace(/\t/g, ""); //use regex to delete all tabs "	"

        document.getElementById("txtCircuitID").value = circuitID //insert the modified text into the text box and proceed with submitting form
        }
    document.title = document.getElementById("form1").elements[2].value;
})();