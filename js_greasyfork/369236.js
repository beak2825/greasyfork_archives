// ==UserScript==
// @name         Run-Ups Picking List Automator
// @namespace    http://localhost
// @version      1.1
// @description  Automates the process of creating a picking list based on whether lines on the SO are physical items or not
// @author       jvk
// @match        http://datarobot.compnow.com.au/db/soview.php?SO_ORDER_NO=*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/369236/Run-Ups%20Picking%20List%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/369236/Run-Ups%20Picking%20List%20Automator.meta.js
// ==/UserScript==


// REMOVE PAGING AND PAGE INFO FROM DATATABLE
$("#example-datatable-picking").DataTable().destroy();
$("#example-datatable-picking").DataTable({"paging": false, "info": false});

// Add "PRINT PICKING LIST" button to top of page
$(".block-title").append('<input type="button" id="printPickingList" value="Print Picking List" disabled>');
var btnPrint = $("#printPickingList");
btnPrint.css("float", "right");
btnPrint.css("margin", "50px 10px 0 0");

// Get table element and the data within it
var tableData = $("#example-datatable-picking").DataTable().table().data();
var table = $("#example-datatable-picking tbody tr");

var header = $(".block-title h2")[0].innerText;

header = header.split("\n");
var salesOrderNumber = header[0].split(":")[1].trim().replace(/\s/g, '');
var customerCode = header[1].split("-")[1].trim();
var customerRef = header[2].split("-")[1].trim();
var salesRep = header[3].split("-")[1].trim();

var customerName = "";

var stock_codes = [];

// Create array of stock codes to send to the php script
for (var key in tableData) {
    // if key is numeric, then add the "stock code" field to the stock_codes array
    if (!isNaN(key)) {
        stock_codes.push(tableData[key][1]);
    }
}

// Declare constants
const MAMP_IP = "192.168.2.53";
const php_read = "http://" + MAMP_IP + ":8888/CompNow/dbCheck.php";
const php_write = "http://" + MAMP_IP + ":8888/CompNow/addToDB.php";
const php_html_template = "http://" + MAMP_IP + ":8888/CompNow/pickingList.php";
const php_customer_lookup = "http://" + MAMP_IP + ":8888/CompNow/customerLookup.php";
const php_warehouse_lookup = "http://" + MAMP_IP + ":8888/CompNow/warehouseLookup.php";

const green = "#93ff9c";
const yellow = "#f5ff9e";
const red = "#ff6c6c";
const pink = "#ff88ff";

const checkSymbol = "&#x2713;";
const crossSymbol = "&#x2715;";

const EXCLAMATION = "<span style='font-size: 22px; font-weight: bold; color: red;'>&#x203C;</span>";

// Declare picking list as global variable
var pickingList;
var reviewList;

var completeTable;
var specialTags;

var headerDetails = {
    salesOrderNumber: salesOrderNumber,
    customerCode: customerCode,
    customerRef: customerRef,
    salesRep: salesRep
};

// check array of stock codes against the database
checkDB(stock_codes);
lookupCustomer(headerDetails.customerCode);
lookupWarehouse(headerDetails.salesOrderNumber);

function lookupCustomer(id) {
    GM_xmlhttpRequest({
        method: "POST",
        url: php_customer_lookup,
        data: JSON.stringify({customer_id: id}),
        onload: function (response) {
            try {
                // Parse the JSON response which returns an array
                var resp = JSON.parse(response.responseText);

                headerDetails["customerName"] = resp;
                // console.log("HEADER: CUSTOMER NAME", headerDetails);
            }
            catch(err) {
                console.log("ERROR MSG: " + err.message);
            }
        }
    });
}

function lookupWarehouse(so) {
    // console.log("SO: >" + so);
    GM_xmlhttpRequest({
        method: "POST",
        url: php_warehouse_lookup,
        data: JSON.stringify({sales_order: so}),
        onload: function (response) {
            try {
                // console.log("RESPONSE:>??>?>?>?>?>?>?>?", response.responseText);
                // Parse the JSON response which returns an array
                var resp = JSON.parse(response.responseText);
                headerDetails["warehouse"] = resp;
            }
            catch(err) {
                console.log("ERROR MSG: " + err.message);
            }
        }
    });
}

function checkDB(stock_codes) {
    // Empty the picking List, review list, complete table, and special tags
    pickingList = {};
    reviewList = [];
    completeTable = {};
    specialTags = {asset: 0,
                   imaging: 0,
                   nts: 0,
                   ram: 0};

    // If customer is UOM, tick NTS
    if (customerCode == "15156" || customerCode == "151566") specialTags.nts = 1;

    // Send the stock_codes array to the php script
    GM_xmlhttpRequest({
        method: "POST",
        url: php_read,
        data: JSON.stringify(stock_codes),
        onload: function (response) {
            try {
                // Parse the JSON response which returns an array
                var resp = JSON.parse(response.responseText);

                // Fill in completeTable. Check if item exists in DB and whether it is a
                // physical item, non-physical item, or special code
                createTable(resp);
                // Review all unknown items and add radio buttons as necessary
                reviewItems();

                // console.log(completeTable);
                // console.log("Special tags:", specialTags);
                // console.log("Items to review:", reviewList);
            }
            catch(err) {
                console.log("ERROR MSG: " + err.message);
            }
        }
    });
}

function createTable(php_arr) {
    // Check each item that was returned from the php script to determine if it is physical/non-physical/special
    php_arr.forEach(function(elem, index) {
        // Properties of elem:

        // is_physical
        // description
        // product_id
        // manufacturer
        // model
        // asset, imaging, nts, ram // (SPECIAL CODES)

        // set variables from each column in the current row
        var line = index + 1;
        var stockCode = table[index].children[1].innerHTML.trim();
        var orderQty = parseInt(table[index].children[2].innerHTML);
        var shipQty = parseInt(table[index].children[3].innerHTML);
        var descr = table[index].children[4].innerHTML.trim().replace(/\s+/g, " ");

        // Insert data into completeTable
        completeTable[index] = {stock_code: stockCode,
                                order_qty: orderQty,
                                ship_qty: shipQty,
                                description: descr};

        // If item is PHYSICAL
        if (elem.is_physical == 1) {
            // Higlight row green
            table[index].style.background = green;
            // Add is_physical property to the current element in the table
            completeTable[index].is_physical = 1;

            // Add item to the picking list
            // Check if item already exists in our picking list
            if (pickingList.hasOwnProperty(elem.product_id)) {
                // If it does, just add to the quantity
                pickingList[elem.product_id].qty += shipQty;
            } else {
                // If it doesn't exist, create it
                pickingList[elem.product_id] = {description: elem.description, qty: shipQty};
            }

            // Check if shipping quantity is zero or less

            console.log("ELEM", elem);
            if (completeTable[index].ship_qty < 1) {
                table[index].children[3].innerHTML = completeTable[index].ship_qty + " " + EXCLAMATION;
            }

            // If item is NOT PHYSICAL
        } else if (elem.is_physical == 0) {
            // Assign 0 to the is_physical property
            completeTable[index].is_physical = 0;
            // Check if has a special tag value
            if (elem.asset == 1 || elem.imaging == 1 || elem.nts == 1 || elem.ram == 1) {
                // Highlight row pink (for now)
                table[index].style.background = pink;

                // Update specialTags to contain the appropriate attributes
                if (elem.asset == 1) specialTags.asset = 1;
                if (elem.imaging == 1) specialTags.imaging = 1;
                if (elem.nts == 1) specialTags.nts = 1;
                if (elem.ram == 1) specialTags.ram = 1;
                // If there are no special tags
            } else {
                // Highlight the row in red (or hide row completely)
                table[index].style.background = red;
                // table[index].style.display = "none";
            }
            // If the item DOESN'T EXIST in the database yet
        } else if (elem == "null") {
            // Highlight the row in yellow
            table[index].style.background = yellow;

            // Add to list of items to review
            reviewList.push(index);
        }
    });
}

function reviewItems() {
    // If there is nothing to review, enable the Print button
    if (reviewList.length == 0) {
        // console.log("No items to review!");
        btnPrint.removeAttr("disabled");
        // Otherwise, add radio buttons and add event handler
    } else {
        reviewList.forEach(function(elem) {
            var targetCell = table[elem].children[1];
            var radioButtons = "<br>" + checkSymbol + " <input type='radio' name='isPhysical" + elem + "' value='1' margin='0 2px 0 2px'> " + crossSymbol + " <input type='radio' name='isPhysical" + elem + "' value='0' margin='0 2px 0 2px'>";
            targetCell.innerHTML = completeTable[elem].stock_code + radioButtons;
        });
        // Get total number of radio buttons
        var radioButtons = $("input[type='radio']");

        // Event Handler for when user clicks a radio button
        radioButtons.change(function() {
            // check if all radio buttons are selected (half of the total number of radio buttons should be checked
            // as there are two options per line and user can only select 1 out of 2
            if($("input[type='radio']:checked").length == radioButtons.length / 2) {
                // Enable print button
                btnPrint.removeAttr("disabled");
            }
        });
    }
}

function addToDB() {
    // If there are items to add to the database
    if (reviewList.length > 0) {
        var itemsToAdd = [];
        // Set the is_physical property based on which radio button was selected
        reviewList.forEach(function(elem) {
            // Get selected value of is_physical
            var selValue = parseInt($("input[name=isPhysical" + elem + "]:checked").val())
            // Update is_physical property of the item in the complete table
            completeTable[elem].is_physical = selValue;

            // Add the current element to the itemsToAdd list
            itemsToAdd.push(
                {
                    stock_code: completeTable[elem].stock_code,
                    description: completeTable[elem].description,
                    is_physical: completeTable[elem].is_physical
                }
            );
        });

        // console.log(JSON.stringify(itemsToAdd));

        GM_xmlhttpRequest({
            method: "POST",
            url: php_write,
            data: JSON.stringify(itemsToAdd),
            onload: function (response) {
                try {
                    // Parse the JSON response which returns an array
                    var resp = JSON.parse(response.responseText);

                    console.log(resp);
                }
                catch(err) {
                    console.log("ERROR: " + err.message);
                }
            }
        });

        // console.log("Adding items to database:", itemsToAdd);

    } else {
        console.log("Nothing to add to the database!");
    }
}

function printPickingList() {
    // store picking list, special tags, and header details in an array
    var allData = [completeTable, specialTags, headerDetails];
    // console.log(JSON.stringify(allData));

    // open a new pop-up window
    var newWin = window.open("", "NEW_WINDOW", "alwaysLowered=true");
    // erase all the content to make it a blank HTML page
    newWin.document.body.innerHTML = "";
    // POST our picking list and special tag data to our PHP script
    // which will return the HTML template, filled in with our data
    GM_xmlhttpRequest({
            method: "POST",
            url: php_html_template,
            data: JSON.stringify(allData),
            onload: function (response) {
                try {
                    var resp = response.responseText;
                    // write out the HTML to the new window
                    newWin.document.write(resp);
                }
                catch(err) {
                    console.log("ERROR: " + err.message);
                }
            }
        });
}


// WHEN "PRINT PICKING LIST" BUTTON IS CLICKED, ADD ALL ENTRIES INTO DATABASE WITH CORRECT
// STOCK CODE, DESCRIPTION and IS_PHYSICAL PROPERTIES
btnPrint.click(function() {
    addToDB();
    printPickingList();
});
