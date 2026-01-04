// ==UserScript==
// @name         XLR Add Button For Facilities
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  For rows that have a facility (OTU4, band, fiber, etc), this adds a button to load the CLR for the facility 
// @author       Lucas Labounty
// @match        http://xlr.zayo.com/CircuitInfo/CircuitLayoutRecord.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395084/XLR%20Add%20Button%20For%20Facilities.user.js
// @updateURL https://update.greasyfork.org/scripts/395084/XLR%20Add%20Button%20For%20Facilities.meta.js
// ==/UserScript==
// https://greasyfork.org/en/scripts/395084-xlr-add-button-for-facilities
(function() {
    'use strict';

    var tbl = document.getElementById("GridView1"); //Load the XLR table into variable "tbl"
    var stopRow = null;
    var stopCell = null;
    for (var rowNumber= 0; rowNumber < tbl.rows.length; rowNumber++){ //iterate through each row
        for (var cellNumber = 0; cellNumber < tbl.rows[rowNumber].cells.length; cellNumber++){ //iterate through each cell in row
            if (tbl.rows[rowNumber].cells[cellNumber].innerHTML == "Facility"){ //if we are on a row which has a facility on it, calculate the stop row/cell to modify
                stopRow = rowNumber;
                stopCell = cellNumber + 6;
            }
            if (rowNumber == stopRow && cellNumber == stopCell){ //if we are on a cell which needs to be modified, do so
               tbl.rows[rowNumber].cells[cellNumber].id = tbl.rows[rowNumber].cells[cellNumber -2].innerHTML; //set an internal identifyer on this cell to the facility it refers to
                var facility = tbl.rows[rowNumber].cells[cellNumber -2].innerHTML; //add the facility to a variable
                var linkText = "XLR"; //What we want the text to say
                var xlrLink = "http://xlr.zayo.com/CircuitInfo/CircuitLayoutRecord.aspx?circuitID="; //base URL for the search Function
                var result = "";

                xlrLink = xlrLink.concat(facility); //add the facility to the end of the URL
                result = linkText.link(xlrLink); //make it a pretty link
                tbl.rows[rowNumber].cells[cellNumber].innerHTML = result; //put the link in the cell
            }

        }
    }


})();