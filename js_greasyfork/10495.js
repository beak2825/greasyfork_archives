// ==UserScript==
// @name         Clarity Console Enhanced Bulk Delete
// @namespace    http://iamdav.in
// @version      1.0
// @description  This will add an option to the Clarity Console execution bulk delete popup window to specify a comma separated list of tables to select.
// @author       Davin Studer
// @match        https://*/ManagementConsole/source/AdvancedDelete.aspx*
// @grant        none
// @require      https://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/10495/Clarity%20Console%20Enhanced%20Bulk%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/10495/Clarity%20Console%20Enhanced%20Bulk%20Delete.meta.js
// ==/UserScript==

function addCSVButton() {
    $('.ActionLinks table tr td:first-child').html('<a id="csvListButton">Select Tables via CSV</a>');
    $('#csvListButton').click(function(){
        getCSVList();
    });
}

function getCSVList() {
    var list = prompt("Enter a comma separated list of tables to delete.", "");
    
    var header = $(".HeaderPageNamePopUp")[0];
    
    if (list != "" && list != null) {
        $(header).text("Bulk Delete - Selecting Items. Please wait ...");
        
        var items = list.split(',');
        for (i = 0; i < items.length; i++) {
            var tables = document.getElementById("lstExtractTablename").options;
            for (x = 0; x < tables.length; x++) {
                if (tables[x].value.toLowerCase() === items[i].toLowerCase().replace(/^\s+|\s+$/g, "")) {
					tables[x].selected = true;
					break;
				}
            }
        }
        
        $(header).text("Bulk Delete - CSV Items Selected");
    }
}

addCSVButton();