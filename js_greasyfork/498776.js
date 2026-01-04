// ==UserScript==
// @name         AliExpress Order List for copying
// @version      1.0
// @description  Capture and parse data from console.log on AliExpress order page
// @author       masssya
// @namespace    https://greasyfork.org/users/1323298
// @match        https://*.aliexpress.com/p/order/index.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498776/AliExpress%20Order%20List%20for%20copying.user.js
// @updateURL https://update.greasyfork.org/scripts/498776/AliExpress%20Order%20List%20for%20copying.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const lineBreak = "._ "; // Separator between order lines. You can change it to "\n" or "\r"
    let outputText = "";
    let outputLine = [];
    let myTable = [];
    let appendTable = false;
    let parentElement, outputElement;
    // Save references to the original console methods
    const originalLog = console.log;
    // Override console.log
    console.log = function(...args) {
        // Check for "BizPlugin" messages
//         if (args.includes('BizPlugin onMount') || args.includes('BizPlugin onRequest')) {
        if (args.includes('BizPlugin onMount')) {
//             console.log("Capture Event!", args);
            captureAndParseData(args[args.length-1].data);
        }
        if (args.includes('BizPlugin onRequest')) {
//             console.log("Capture Event!", args);
            appendTable = true;
            captureAndParseData(args[args.length-1].data);
        }
        originalLog.apply(console, args);
    };

    // Function to capture and parse the data
    function captureAndParseData(args) {
//         console.log("captureAndParseData:",args);
        if (true) { //preparation for additional processing
            //console.log("if", args);
            parseData(args);
        }
    }

    // Function to parse the captured console data
    function parseData(data) {
//         console.log("parseData:", data);
        for (const key in data) {
            if (key.startsWith("pc_om_list_order_")) {
//                 console.log(key);
                const order = data[key].fields;
                let i = 1;
                let titleText = "";
//                 console.log("Order lines: ",order.orderLines.length)
                order.orderLines.forEach(orderLine => {
                    if (order.orderLines.length >1){
                        titleText += i+") ";
                    }
                    titleText += orderLine.itemTitle
                    if (i < order.orderLines.length){
                        titleText += lineBreak;
                    }
                    i++;
//                     console.log("Item Title:", orderLine.itemTitle);
                })
//                 console.log(titleText);
//                 console.log(`Total Price: ${order.totalPriceText}`);
//                 console.log(order.orderDetailUrl);
//                 console.log(order.orderDateText);
                outputLine.push(titleText);
                outputLine.push(order.orderDetailUrl);
                outputLine.push(order.orderDateText);
                myTable.push(outputLine);
                outputLine = [];
            }
        }
        insertElements();
    }
    function insertElements() {
        parentElement = document.querySelector('.order-more');
        if (parentElement) {
            if (appendTable){
                parentElement.parentNode.replaceChild(outputTable(), parentElement.nextSibling);
            }
            else{
                parentElement.parentNode.insertBefore(outputTable(), parentElement.nextSibling);
            }
        }
    }
    function outputTable() {
    // Creating the table element
        var table = document.createElement('table');
        table.style.border = '1px solid black';
        table.style.borderCollapse = 'collapse';
        table.style.margin = '20px';
//         table.style.text = 'normal';
    //  Sorting by date
        myTable.sort((a, b) => {
            if (Date.parse(a[2]) > Date.parse(b[2])){
                return -1;
            }
            if (Date.parse(a[2]) < Date.parse(b[2])){
                return 1;
            }
            if (Date.parse(a[2]) == Date.parse(b[2])){
                return 0;
            }
        });

        // Iterate over the data array and create rows and cells
        myTable.forEach(function(rowData) {
            var tr = document.createElement('tr');
            rowData.forEach(function(cellData) {
                var td = document.createElement('td');
                td.style.border = '1px solid black';
                td.style.padding = '10px';
                td.innerText = cellData;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        return table;
    }
})();
