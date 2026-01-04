// ==UserScript==
// @name         XLR Add Link For TIDs
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description   For rows that have a Physical Port/Logical Port (TID), this adds a link to load the NCC tool
// @author       Lucas Labounty
// @match        http://xlr.zayo.com/CircuitInfo/CircuitLayoutRecord.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395090/XLR%20Add%20Link%20For%20TIDs.user.js
// @updateURL https://update.greasyfork.org/scripts/395090/XLR%20Add%20Link%20For%20TIDs.meta.js
// ==/UserScript==
//https://greasyfork.org/en/scripts/395090-xlr-add-link-for-tids
(function() {
    'use strict';

//FYI this is some ugly code. I don't plan on making it prettier; I'm just happy it works at this point.
//Don't be surprised if this fails spectacularly

    var tbl = document.getElementById("GridView1"); //Load the XLR table into variable "tbl"
    var stopRow = null;
    var stopCell = null;
    for (var rowNumber= 0; rowNumber < tbl.rows.length; rowNumber++){ //iterate through each row
        for (var cellNumber = 0; cellNumber < tbl.rows[rowNumber].cells.length; cellNumber++){ //iterate through each cell in row
            if (tbl.rows[rowNumber].cells[cellNumber].innerHTML == "Physical Port" || tbl.rows[rowNumber].cells[cellNumber].innerHTML == "Logical Port"){ //if we are on a cell which has a Physical Port or Logical Port on it, calculate the stop row/cell to modify
                stopRow = rowNumber;
                stopCell = cellNumber + 6; //move the stopCell 6 columns to the right
            }
            if (rowNumber == stopRow && cellNumber == stopCell){ //if we are on a cell which needs to be modified, do so
                var tid = tbl.rows[rowNumber].cells[cellNumber -3].innerHTML; //get the value of the TID cell and assign to variable
                var tidSpecialCharacterLocation = tid.search(/[^abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890]/g, 0); //some TIDs have legacy TIDs or additional information. This uses regex to find the first position of a non-alpanumeric character. Later we will extract (Split) the text starting at the begining, and ending at the first non-alphanumeric character

                if (tidSpecialCharacterLocation == 0){ //Some (very few) TID cells will have special characters at the begining. If they do, we slice off the first character and proceed
                    tid = tid.slice(1,tid.length);
                    tidSpecialCharacterLocation = tid.search(/[^abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789]/g, 0);
                }
                if (tidSpecialCharacterLocation < 1){ //Many TID cells will be completely blank. Why? Who knows. But there's no point in putting a link to nowhere
                    //Not sure what I was planning to do here in the event that there's no TID to lookup
                } else{ //here's the real work
                    var linkText = "NCC" //What we want the text to say
                    var nccLink = "https://ncctool.zayo.us/index.php?-table=node_data&-search="; //URL of the NCC Tool's search function
                    var result = ""

                    tid = tid.slice(0, tidSpecialCharacterLocation); //Extract the TID from the TID's table cell
                    nccLink = nccLink.concat(tid); //Add the TID to the end of the NCC Tool's URL
                    result = linkText.link(nccLink); //Tell it to make all of the aforementioned into a pretty link
                    tbl.rows[rowNumber].cells[cellNumber].innerHTML = result; //Assign the link to the cell
                }

            }

        }
    }


})();