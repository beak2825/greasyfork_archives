// ==UserScript==
// @name         SB Ledger Summary
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  SB ledger summary for quick view rather than just ledger view
// @author       Anonymous coder
// @run-at       document-start
// @match        http://www.swagbucks.com/account/summary
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32539/SB%20Ledger%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/32539/SB%20Ledger%20Summary.meta.js
// ==/UserScript==
/* Changelog
 *
 * 20190101 - Fixed substitution of ' for " for JSON parsing to work on descriptions with ' in the string
 * 20170825 - Added localStorage item to keep track if the checkbox is enabled and if so, re-click it on page refresh
 * 20170822 - Initial release
 */

// Create a few global variables for use later
var summary_data = [];
var sb_Categories = [
    "Searching",
    "Referrals",
    "Shop",
    "Trade-In",
    "Rewards Store",
    "Swag Codes",
    "Other",
    "Swagstakes",
    "Answer",
    "Discover",
    "Play",
    "Bonus SB",
    "Watch",
    "Tasks",
    "Mobile Watch",
    "Social Games",
    "nCrave",
    "Swagbucks Visa Card",
    "Swagbucks Local",
    "Uncategorized"
];
var my_sheet;

// Parse the data loaded
function parse_ledger(ledger_data) {

    var last_day;   
    // Slice out the beginning data which includes the lifetime SB
    // We don't care about this since it's already displayed on the website anyway
    if (ledger_data.substr(0, 2) == "1|") {
        var idxL = ledger_data.indexOf("@");
        lifeSB = ledger_data.slice(2, idxL);
        // Change all ' to " so we can just use the standard JSON parse function rather than re-invent the wheel
        var temp_data = ledger_data.substr(idxL + 3).replace(/,'/g, ',"').replace(/',/g, '",').replace(/']/g, '"]').replace(/\\/g,'');
        var parsed_data = JSON.parse(temp_data);
        // Sort the data by the category number
        if (parsed_data.length > 0) {
            last_day = parsed_data[0][1];
            parsed_data.sort(function(a,b) {
                if (a[0] == b[0]) {
                    return (a[5] === b[5] ? 0 : (a[5] < b[5] ? -1 : 1));
                } else
                    return a[0] - b[0];
            });
        }
        // Iterate through the parsed data and break it into the activity types defined by Swagbucks
        for (i = 0 ; i < parsed_data.length ; i++) {
            if (last_day == parsed_data[i][1]) {
                var switch_val = 0;
                switch(parsed_data[i][0]) {
                        // Searching
                    case 1: //"Searching the Web",
                        switch_val = 0;
                        break;
                        // Referrals
                    case 2: //"Referral SB from",
                        switch_val = 1;
                        break;
                        // Shop
                    case 3: //"Shop",
                        switch_val = 2;
                        break;
                        // Trade-Im
                    case 4: //"Trade-In",
                        switch_val = 3;
                        break;
                        // Rewards Store
                    case 5: //"Rewards Store Refund",
                    case 6: //"Rewards Store Purchase",
                        switch_val = 4;
                        break;
                        // Swag Codes
                    case 7: //"Swag Code",
                        switch_val = 5;
                        break;
                        // Other
                    case 0: //"Registration",
                    case 9: //"Other",
                    case 21: //"Accelerator Bonus",
                    case 98: //"Correction",
                    case 99: //"Adjustment"
                        switch_val = 6;
                        break;
                        // Swagstakes
                    case 11: //"Swagstakes Entry",
                        switch_val = 7;
                        break;
                        // Answer
                    case 12: //"Answer",
                        switch_val = 8;
                        break;
                        // Discover
                    case 13: //"Discover",
                    case 20: //"Swagbucks Rewards",
                    case 24: //"Mobile Offers",
                        switch_val = 9;
                        break;
                        // Play
                    case 14: //"Play",
                        switch_val = 10;
                        break;
                        //Bonus SB
                    case 15: //"Bonus SB",
                        switch_val = 11;
                        break;
                        // Watch
                    case 16: //"Watch",
                        switch_val = 12;
                        break;
                        // Tasks
                    case 17: //"Tasks",
                        switch_val = 13;
                        break;
                        // Mobile Watch
                    case 18: //"Mobile Watch",
                        switch_val = 14;
                        break;
                        // Social Games
                    case 19: //"Social Games",
                        switch_val = 15;
                        break;
                        // nCrave
                    case 22: //"nCrave",
                        switch_val = 16;
                        break;
                        // Swagbucks Visa Card
                    case 23: //"Swagbucks Visa Card",
                        switch_val = 17;
                        break;
                        // Swagbucks Local
                    case 25: //"Swagbucks Local",
                        switch_val = 18;
                        break;
                        // Not categorized according to Swagbucks website
                    case 8: //"Submission",
                    case 10: //"Flipswap",
                    default:
                        switch_val = 19;
                }
                // Searching and Play categories have blank name fields, so we need to supply it manually rather than the parsed data
                var entry_name;
                if (parsed_data[i][5] === "" && parsed_data[i][0] == 1)
                    entry_name = "Searching";
                else if (parsed_data[i][5] === "" && parsed_data[i][0] == 14)
                    entry_name = "Play";
                else
                    entry_name = parsed_data[i][5];
                // Add parsed data to our array for rendering later
                if (summary_data[switch_val] === undefined) { // Initial data, array element doesn't exist
                    summary_data[switch_val] = {};
                    summary_data[switch_val][entry_name] = [parsed_data[i][3] , 1 ];
                    summary_data[switch_val].LedgerTotal = [parsed_data[i][3] , 1 ];
                }
                else { // Array element exists, but object doesn't, so initialize
                    if (summary_data[switch_val][entry_name] === undefined) {
                        summary_data[switch_val][entry_name] = [parsed_data[i][3] , 1 ];
                        summary_data[switch_val].LedgerTotal[0] += parsed_data[i][3];
                        summary_data[switch_val].LedgerTotal[1] += 1;
                    }
                    else { // Array and object exists, so increment values
                        summary_data[switch_val][entry_name][0] += parsed_data[i][3];
                        summary_data[switch_val][entry_name][1] += 1;
                        summary_data[switch_val].LedgerTotal[0] += parsed_data[i][3];
                        summary_data[switch_val].LedgerTotal[1] += 1;                 
                    }
                }
            }
        }
    }
}

// We need this function in order to override the XMLHttpRequest Swagbucks sends so we can see a copy of the account activity without calling it ourselves
(function(open) {
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
            if(this.readyState == 4 && this.status == 200 && this.responseURL.includes("cmd=sb-acct-ledger")) {
                parse_ledger(this.responseText);
            }
        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);

// Render the ledger data as a summary table
function render_ledger_data() {
    // Add checkbox to display summary or not
    var summary_checkbox_section = document.createElement("section");
    summary_checkbox_section.setAttribute("id", "sbsummary");
    var summary_checkbox_label = document.createElement("label");
    summary_checkbox_label.setAttribute("class", "periodLabel");
    var summary_checkbox = document.createElement("input");
    summary_checkbox.setAttribute("id", "sbsummarycheck");
    summary_checkbox.setAttribute("type", "checkbox");
    summary_checkbox.addEventListener('click', function () {
        if (document.getElementById("sbsummarycheck").checked) {
            localStorage.setItem('Enabled', 'true');
            document.getElementById("tableContainerL").style.display = "none"; 
            document.getElementById("sbsummary_section").style.display = "block"; 
        } else {
            localStorage.setItem('Enabled', 'false');
            document.getElementById("tableContainerL").style.display = "block"; 
            document.getElementById("sbsummary_section").style.display = "none"; 
        }
    }, false);
    summary_checkbox_label.appendChild(summary_checkbox);
    summary_checkbox_label.appendChild(document.createTextNode("SB Summary"));
    summary_checkbox_section.appendChild(summary_checkbox_label);
    document.getElementById("tableParameters").appendChild(summary_checkbox_section);
    // Create the summary table
    var summary_table = document.createElement("table");
    summary_table.setAttribute("class", "sbsummarytable");
    var summary_table_header_row = document.createElement("tr");
    summary_table_header_row.setAttribute("class", "sbsummaryheader");
    var summary_table_header1 = document.createElement("th");
    summary_table_header1.setAttribute("class", "sbsummaryheader_cell");
    summary_table_header1.appendChild(document.createTextNode("Activity"));
    var summary_table_header2 = document.createElement("th");
    summary_table_header2.setAttribute("class", "sbsummaryheader_cell");
    summary_table_header2.appendChild(document.createTextNode("Total SB"));
    var summary_table_header3 = document.createElement("th");
    summary_table_header3.setAttribute("class", "sbsummaryheader_cell");
    summary_table_header3.appendChild(document.createTextNode("Entries"));
    summary_table_header_row.appendChild(summary_table_header1);
    summary_table_header_row.appendChild(summary_table_header2);
    summary_table_header_row.appendChild(summary_table_header3);
    summary_table.appendChild(summary_table_header_row);
    // Now that the header was created, let's populate the table rows, first with the activity summary rows
    var summary_table_data_row, summary_table_data_cell1, summary_table_data_cell2, summary_table_data_cell3;
    var summary_data_key;
    for (i = 0; i < summary_data.length; i++) {
        if (summary_data[i] !== undefined) {
            summary_table_data_row = document.createElement("tr");
            summary_table_data_row.setAttribute("class", "sbsummarydata");

            summary_table_data_cell1 = document.createElement("td");
            summary_table_data_cell1.setAttribute("class", "sbsummarydata_category " + i);
            summary_table_data_cell1.appendChild(document.createTextNode(sb_Categories[i]));
            summary_table_data_cell2 = document.createElement("td");
            if (summary_data[i].LedgerTotal[0] < 0) {
                summary_table_data_cell2.setAttribute("class", "sbsummarydata_amount red");
            } else {
                summary_table_data_cell2.setAttribute("class", "sbsummarydata_amount");
            }
            summary_table_data_cell2.appendChild(document.createTextNode(summary_data[i].LedgerTotal[0]));
            summary_table_data_cell3 = document.createElement("td");
            summary_table_data_cell3.setAttribute("class", "sbsummarydata_entries");
            summary_table_data_cell3.appendChild(document.createTextNode(summary_data[i].LedgerTotal[1]));
            summary_table_data_row.appendChild(summary_table_data_cell1);
            summary_table_data_row.appendChild(summary_table_data_cell2);
            summary_table_data_row.appendChild(summary_table_data_cell3);
            summary_table_data_row.addEventListener('click', function() {
                var changerule = my_sheet.cssRules;
                if (this.className.includes("active")) {
                    // Hide detailed rows
                    for (i = 0; i < changerule.length; i++) {
                        if (changerule[i].selectorText == ("._" + this.childNodes[0].className.split(" ")[1] + ".sbsummarydetaildata")) {
                            changerule[i].style.display = "none";
                            this.className = this.className.replace(" active", "");
                            break;
                        }
                    }
                } else {
                    // Show detailed rows
                    for (i = 0; i < changerule.length; i++) {
                        if (changerule[i].selectorText == ("._" + this.childNodes[0].className.split(" ")[1] + ".sbsummarydetaildata")) {
                            changerule[i].style.display = "table-row";
                            this.className = this.className.concat(" active");
                            break;
                        }
                    }
                }
            });
            // Now we add the table into the html file to be drawn
            summary_table.appendChild(summary_table_data_row);
            // Now we add the detailed rows below the activity
            if ( i == 14 ) { // This is a mobile watch activity, so let's display the regular data first
                for (summary_data_key in summary_data[i]) {
                    if (summary_data_key != "LedgerTotal" && !summary_data_key.includes("Bonus")) {
                        summary_table_data_row = document.createElement("tr");
                        summary_table_data_row.setAttribute("class", "sbsummarydetaildata _" + i);
                        summary_table_data_cell1 = document.createElement("td");
                        summary_table_data_cell1.setAttribute("class", "sbsummarydetaildata_category");
                        summary_table_data_cell1.appendChild(document.createTextNode(summary_data_key));
                        summary_table_data_cell2 = document.createElement("td");
                        if (summary_data[i][summary_data_key][0] < 0) {
                            summary_table_data_cell2.setAttribute("class", "sbsummarydetaildata_amount red");
                        } else {
                            summary_table_data_cell2.setAttribute("class", "sbsummarydetaildata_amount");
                        }
                        summary_table_data_cell2.appendChild(document.createTextNode(summary_data[i][summary_data_key][0]));
                        summary_table_data_cell3 = document.createElement("td");
                        summary_table_data_cell3.setAttribute("class", "sbsummarydetaildata_entries");
                        summary_table_data_cell3.appendChild(document.createTextNode(summary_data[i][summary_data_key][1]));
                        summary_table_data_row.appendChild(summary_table_data_cell1);
                        summary_table_data_row.appendChild(summary_table_data_cell2);
                        summary_table_data_row.appendChild(summary_table_data_cell3);
                        summary_table.appendChild(summary_table_data_row);
                    }
                }
                for (summary_data_key in summary_data[i]) { // Now if there were any bonus rounds, we will display them next
                    if (summary_data_key != "LedgerTotal" && summary_data_key.includes("Bonus")) {
                        summary_table_data_row = document.createElement("tr");
                        summary_table_data_row.setAttribute("class", "sbsummarydetaildata _" + i);
                        summary_table_data_cell1 = document.createElement("td");
                        summary_table_data_cell1.setAttribute("class", "sbsummarydetaildata_category");
                        summary_table_data_cell1.appendChild(document.createTextNode(summary_data_key));
                        summary_table_data_cell2 = document.createElement("td");
                        if (summary_data[i][summary_data_key][0] < 0) {
                            summary_table_data_cell2.setAttribute("class", "sbsummarydetaildata_amount red");
                        } else {
                            summary_table_data_cell2.setAttribute("class", "sbsummarydetaildata_amount");
                        }
                        summary_table_data_cell2.appendChild(document.createTextNode(summary_data[i][summary_data_key][0]));
                        summary_table_data_cell3 = document.createElement("td");
                        summary_table_data_cell3.setAttribute("class", "sbsummarydetaildata_entries");
                        summary_table_data_cell3.appendChild(document.createTextNode(summary_data[i][summary_data_key][1]));
                        summary_table_data_row.appendChild(summary_table_data_cell1);
                        summary_table_data_row.appendChild(summary_table_data_cell2);
                        summary_table_data_row.appendChild(summary_table_data_cell3);
                        summary_table.appendChild(summary_table_data_row);
                    }
                }
            } else { // Display detailed data (non-mobile watch entries)
                for (summary_data_key in summary_data[i]) {
                    if (summary_data_key != "LedgerTotal") {
                        summary_table_data_row = document.createElement("tr");
                        summary_table_data_row.setAttribute("class", "sbsummarydetaildata _" + i);
                        summary_table_data_cell1 = document.createElement("td");
                        summary_table_data_cell1.setAttribute("class", "sbsummarydetaildata_category");
                        summary_table_data_cell1.appendChild(document.createTextNode(summary_data_key));
                        summary_table_data_cell2 = document.createElement("td");
                        if (summary_data[i][summary_data_key][0] < 0) {
                            summary_table_data_cell2.setAttribute("class", "sbsummarydetaildata_amount red");
                        } else {
                            summary_table_data_cell2.setAttribute("class", "sbsummarydetaildata_amount");
                        }
                        summary_table_data_cell2.appendChild(document.createTextNode(summary_data[i][summary_data_key][0]));
                        summary_table_data_cell3 = document.createElement("td");
                        summary_table_data_cell3.setAttribute("class", "sbsummarydetaildata_entries");
                        summary_table_data_cell3.appendChild(document.createTextNode(summary_data[i][summary_data_key][1]));
                        summary_table_data_row.appendChild(summary_table_data_cell1);
                        summary_table_data_row.appendChild(summary_table_data_cell2);
                        summary_table_data_row.appendChild(summary_table_data_cell3);
                        summary_table.appendChild(summary_table_data_row);
                    }
                }
            }
        }
    }
    // Now that the table was generated, let's add the section right after Swagbuck's ledger table
    var summary_section = document.createElement("section");
    summary_section.setAttribute("id", "sbsummary_section");
    summary_section.style.display = "none";
    summary_section.appendChild(summary_table);
    document.getElementById("tableView").appendChild(summary_section);
    if (localStorage.getItem('Enabled') == 'true') {
        document.getElementById('sbsummarycheck').click();
    }
}

// Add some CSS style information so our table doesn't look too different
function render_css() {
    // Create a style
    var style = document.createElement("style");
    // WebKit hack :(
    style.appendChild(document.createTextNode(""));
    // Add the <style> element to the page
    document.head.appendChild(style);

    // Now we add our rules for everything we generated earlier
    // Overall table
    style.sheet.insertRule(".sbsummarytable { cursor: pointer; text-align: left; width: 100%; position: relative; border: solid #ccc; border-collapse: collapse; font-weight: normal; border-width: .1rem; padding: .7rem 0 .7rem 1rem }", style.sheet.length);
    // Table header row (<th>)
    style.sheet.insertRule(".sbsummaryheader { cursor: pointer; font-size: 1.5em; text-align: left; position: relative; border: solid #ccc; font-weight: normal; border-width: .1rem; padding: .7rem 0 .7rem 1rem }", style.sheet.length);
    style.sheet.insertRule(".sbsummaryheader_cell { top: 0; left: 0; width: 100%; position: relative; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; padding: 1rem 0 1rem 1rem; font-weight: bold }", style.sheet.length);    
    // Activity summary row
    style.sheet.insertRule(".sbsummarydata { cursor: pointer; font-size: 1.4em; text-align: left; position: relative; border: solid #ccc; font-weight: normal; border-width: .1rem; padding: .7rem 0 .7rem 1rem; font-weight: bold }", style.sheet.length);
    style.sheet.insertRule(".sbsummarydata_category { color: #69b8d6; width: 100%; position: relative; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; padding: 1rem 0 1rem 1rem; font-weight: bold }", style.sheet.length);
    style.sheet.insertRule(".sbsummarydata_amount { color: #69b8d6; text-align: right; padding: 1rem 0 1rem 1rem; font-weight: bold }", style.sheet.length);
    style.sheet.insertRule(".red.sbsummarydata_amount { color: #e98780 }", style.sheet.length);
    style.sheet.insertRule(".sbsummarydata_entries { top: 0; left: 0; width: 100%; position: relative; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; padding: 1rem 0 1rem 1rem; font-weight: bold}", style.sheet.length);
    // Detailed data row
    //    style.sheet.insertRule(".sbsummarydetaildata { cursor: pointer; font-size: 1.4em; text-align: left; position: relative; border: solid #ccc; font-weight: normal; border-width: .1rem; padding: .7rem 0 .7rem 1rem }", style.sheet.length);
    style.sheet.insertRule(".sbsummarydetaildata_category { top: 0; left: 0; width: 100%; position: relative; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; padding: 1rem 0 1rem 1rem }", style.sheet.length);
    style.sheet.insertRule(".sbsummarydetaildata_amount { color: #69b8d6; text-align: right; padding: 1rem 0 1rem 1rem; font-weight: bold }", style.sheet.length);
    style.sheet.insertRule(".red.sbsummarydetaildata_amount { color: #e98780 }", style.sheet.length);
    style.sheet.insertRule(".sbsummarydetaildata_entries { top: 0; left: 0; width: 100%; position: relative; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; padding: 1rem 0 1rem 1rem; }", style.sheet.length);
    // Generate individual styles for each activity type's detailed rows so they can be show or hidden when clicked
    for (i = 0; i < 20; i++) {
        style.sheet.insertRule("._" + i + ".sbsummarydetaildata { cursor: pointer; width: 100%; font-size: 1.4em; text-align: left; position: relative; border: solid #ccc; font-weight: normal; border-width: .1rem; padding: .1rem 0 .1rem 1rem; display: none }", style.sheet.length);
    }
    return style.sheet;
}

// Push the HTML code changes once the page is ready to go
document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        // Push CSS rules for the table we create
        my_sheet = render_css();
        // Render ledger data
        render_ledger_data();
    }
};

