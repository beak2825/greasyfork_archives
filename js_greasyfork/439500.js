// ==UserScript==
// @name         Glacier Tax Prep Stock Transactions Helper
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Help nonresident alien fill in the 1099-B stock transactions by importing transactions from local CSV file
// @author       Sibei Chen, JiahaoShan
// @match        https://www.glaciertax.com/IRSForm/StockTransaction*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkZERjUzOEI4RkFCNTExRTY5N0ZCQTY1Rjg3QjYyODA1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkZERjUzOEI5RkFCNTExRTY5N0ZCQTY1Rjg3QjYyODA1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTVBMUY1NzVGQUI1MTFFNjk3RkJBNjVGODdCNjI4MDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTVBMUY1NzZGQUI1MTFFNjk3RkJBNjVGODdCNjI4MDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5M9rAoAAACDklEQVR42qSTMW/TQBTH37s7n89OUpwoaapUohQhSiUEDAyoAxILH4SBL8InYGJkYAGJjREkRBdmJAaKioAWSlKHpE7SxHbsO56dtlDcTLX85LOt93+//3t3aIyB81zieDHt7oOWdpNJS4GBgioVQmGrCBhrI70j4mmB7WdP7uLa+nO33vQo3wAyulmWCdlaTyNMo9Cv39q4bdvKV0rleexYIG42Vlob9z3VaDlR/7erqnVXli+4yqu7lltyGzfuOKJUqSWTiSTFogX6lCRxmNheDZx6E4Y72xD2fCi3VmD0awdq124SDSTEbs7swcwoIQkJXLlQqXhQXl6FKOiBd3kdpoejzPj8JuYU5Dns+/lap2n+lCSEjOeM+Jd2DgFVSA4HEHY7gJyfEs6sZOySIbB/SNj/SJh1n5JPgs0iT+bcfAyngxedznwBrVMaWVyIrGqcTJ2nm28et4Pg3pkWjNZQWlwGe6GaV2XCOjKMwIWAsQErYPzBUndvCHD9bYGASwk/37+G4OsWOCQUDfow9tsw6e3n4gyZiStVMIhRcR8g/bak1HGUzz+fCCWm4xEgkeDFK1SBi5RoDOOiIBAG3ehg68MnyyktET6Odr+AkIrQrXw6o/au1v6evdg/cERqfysIVFfXNn+8e/WIti7PTs7w++fZ/I8mZlJNRyStPIwneuHS1Zcn5Oc9zn8EGADf1crUyv7gZAAAAABJRU5ErkJggg==
// @require      https://greasyfork.org/scripts/370520-super-gm-set-and-get/code/Super%20GM%20set%20and%20get.js?version=614650
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439500/Glacier%20Tax%20Prep%20Stock%20Transactions%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/439500/Glacier%20Tax%20Prep%20Stock%20Transactions%20Helper.meta.js
// ==/UserScript==

var transactions = null;
var pid = null;


(function () {
    'use strict';

    loadLayout();

    var fileInput = document.getElementById('fileInput');
    var payorId = document.getElementById("payorId");
    var button = document.getElementById("process");

    payorId.addEventListener("change", _ => {
        if (!validatePayorId()) {
            fileInput.disabled = true;
            button.disabled = true;
        } else {
            fileInput.disabled = false;
            pid = payorId.value;
        }
    });

    fileInput.addEventListener("change", event => {
        if (fileInput.files.length != 0) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });

    button.addEventListener("click", _ => {
        importFile(fileInput.files[0]);
    });

    if (GM_SuperValue.get("status", "") == "importing") {
        fillTransaction();
    } else {
        GM_SuperValue.set("transactions", 0);
        GM_SuperValue.set("payorId", 0);
        GM_SuperValue.set("index", 0);
    }
})();

function loadLayout() {
    var css = document.createElement("style");
    css.innerHTML = ".myInput {margin-left: 20px;}";
    document.body.appendChild(css);

    var availablePayorIds = getPayorIds();
    var options = `<option value='' disabled selected>Select Payor ID (EIN)</option>\n`;

    for (let id of availablePayorIds) {
        options += `<option value='${id}'>${id}</option>\n`;
    }

    var importerHTML = `
            <div id='helper'>
                <h2>Glacier Tax Prep Form 1099-B Stock Transactions Importer</h2>
                <fieldset>
                    <legend>Instruction</legend>
                    <ol>
                        <li>
                            Add 1099-B forms in the previous page.
                            If you get Consolidated Form 1099 PDF from Robinhood, <a href='https://github.com/joshfraser/robinhood-to-csv' target='_blank'>you may export it to .csv file</a>.
                        </li>
                        <li>Select a desired Payor ID (EIN) in the dropdown list.</li>
                        <li>
                            Choose the corresponding local .csv file. Make sure your .csv file follow the format strictly as below: </br>
                            <code>
                            name,acquired,sold,proceeds,cost</br>
                            ALPHABET INC CLASS A COMMON STOCK,10/19/2016,11/03/2016,779.07,824.52</br>
                            TESLA MOTORS INC,12/02/2016,12/06/2016,1468.19,1460.64
                            </code>
                        </li>
                        <li>The "Start" button will be enabled once valid EIN has been selected and csv file has been provided.</li>
                    </ol>
                    <ul>
                        <li>
                            Disclaimer: This greasyfork user script is NOT an official tool from Glacier Tax Prep.
                        </li>
                        <li>
                            Please submit an <a href='https://github.com/SibeiC/Glacier-tax-1099-B-Stock-Transactions-Helper/issues/new' target="_blank">issue</a> on <a href='https://github.com/SibeiC/Glacier-tax-1099-B-Stock-Transactions-Helper' target="_blank">GitHub</a> for bug reports and feature requests.
                        </li>
                    </ul>
                </fieldset>
                <fieldset>
                    <legend>Select Payor ID (EIN) and Choose .csv File</legend>
                    <span class='myInput'>
                        <label for="payorId">Payor ID (EIN): </label>
                        <select name="payorId" id="payorId">
                            ${options}
                        </select>
                    </span>
                    <span class='myInput'><input id='fileInput' type='file' id='input' accept='text/*,.csv' disabled></span>
                    <span class='myInput'><button id='process' disabled>Start</button></span>
                    <span class='myInput' style='display:none;color:white;font-size:1.2em;background-color:red;' id='errorMessage'></span>
                </fieldset>
            </div>
        `;
    $("#main").prepend(importerHTML);
}

function getPayorIds() {
    var payorIds = [];
    var trs = $('tbody').find('tr');
    for (var i = 0; i < trs.length; ++i) {
        if (trs[i].childElementCount == 4) {
            if ($(trs[i]).find("td:nth-child(2)")[0].innerText == "Total Proceeds (Box 2) 1099-B") {
                payorIds.push($(trs[i]).find("td:nth-child(1)")[0].innerText);
            }
        }
    }
    return payorIds;
}

function validatePayorId() {
    return getPayorIds().includes(payorId.value);
}

function importFile(file) {
    var textType = /.*\.csv/;
    if (file.name.match(textType)) {
        var reader = new FileReader();
        reader.onload = _ => {
            var lines = processData(reader.result);
            if (!lines) {
                fileInput.value = "";
                return;
            }

            transactions = lines;
            hideErrorMessage();

            GM_SuperValue.set("transactions", transactions);
            GM_SuperValue.set("payorId", pid);
            GM_SuperValue.set("index", 0);
            GM_SuperValue.set("status", "importing")

            fillTransaction();
        }

        reader.readAsText(file);
    } else {
        $("#process").hide();
        showErrorMessage("ERROR: only csv with header 'name,acquired,sold,proceeds,cost' is supported!");
    }
}

function getTotalProceeds() {
    if (!validatePayorId()) return -1;
    var trs = $('tbody').find('tr');
    for (var i = 0; i < trs.length; ++i) {
        var isTarget = $(trs[i]).find("td")[0].innerText == payorId.value;
        if (isTarget) {
            return $(trs[i]).find("td:nth-child(3)").text().trim();
        }
    }
}

function validateDate(dateString) {
    return dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) ? true : false;
}

function validateInputFile(lines) {
    var inputTotalProceeds = 0;
    for (var i = 0; i < lines.length; i++) {
        if (!lines[i][0] || lines[i][0] == "") {
            showErrorMessage(getErrorMessage(i, "empty name"));
            return false;
        }
        if (!lines[i][1] || !validateDate(lines[i][1])) {
            showErrorMessage(getErrorMessage(i, "invalid acquired date"));
            return false;
        }
        if (!lines[i][2] || !validateDate(lines[i][2])) {
            showErrorMessage(getErrorMessage(i, "invalid sold date"));
            return false;
        }
        if (!lines[i][3] || isNaN(lines[i][3]) || parseFloat(lines[i][3]) < 0) {
            showErrorMessage(getErrorMessage(i, "invalid proceeds number"));
            return false;
        }
        if (!lines[i][4] || isNaN(lines[i][4]) || parseFloat(lines[i][4]) < 0) {
            showErrorMessage(getErrorMessage(i, "invalid cost number"));
            return false;
        }
        var acquiredDate = new Date(lines[i][1]);
        var soldDate = new Date(lines[i][2]);
        if (acquiredDate.getTime() > soldDate.getTime()) {
            showErrorMessage(getErrorMessage(i, "invalid acquired date or sold date"));
            return false;
        }
        inputTotalProceeds += parseFloat(lines[i][3]);
    }
    var inputTotal = inputTotalProceeds.toFixed(2);
    var totalProceeds = parseFloat(getTotalProceeds()).toFixed(2);
    if (totalProceeds == -1.00) {
        return false;
    } else if (inputTotal != totalProceeds) {
        alert("Total proceeds in the input file (" + inputTotal + ") doesn't match the total proceeds in the 1099 (" + totalProceeds + "). You may proceed, but it may cause errors.");
        return true;
    }
    return true;
}

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    if (headers.length != 5) {
        showErrorMessage('ERROR: Invalid number of headers');
        return false;
    }
    if (headers[0] != 'name' || headers[1] != 'acquired' || headers[2] != 'sold' || headers[3] != 'proceeds' || headers['4'] != 'cost') {
        showErrorMessage("ERROR: only csv with header 'name,acquired,sold,proceeds,cost' is supported!");
        return false;
    }
    var lines = [];
    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
            var tarr = [];
            for (var j = 0; j < headers.length; j++) {
                if (headers[j] == 'acquired') {
                    var acquiredData = data[j].split(' ');
                    if (acquiredData && acquiredData.length > 1) {
                        data[j] = acquiredData[acquiredData.length - 1];
                    }
                }
                tarr.push(data[j]);
            }
            lines.push(tarr);
        }
    }

    return validateInputFile(lines) ? lines : false;
}

function hideErrorMessage() {
    $("#errorMessage").hide();
}

function showErrorMessage(message) {
    $("#errorMessage").css("background-color", "red");
    $("#errorMessage").show().html(message);
}

function getErrorMessage(lineNumber, message) {
    return "ERROR: The " + (lineNumber + 1) + getOrdinalIndicator(lineNumber + 1) + " line has " + message;
}

// GM_SuperValue.set("transactions", transactions);
// GM_SuperValue.set("payorId", pid);
// GM_SuperValue.set("index", 0);
// GM_SuperValue.set("status", "importing")

function fillTransaction() {
    var transactions = GM_SuperValue.get("transactions");
    var pid = GM_SuperValue.get("payorId");
    var index = GM_SuperValue.get("index");
    if (index === undefined) {
        index = 0;
    }

    var filling = $("#Name").length ? true : false;
    if (filling) {
        var transaction = transactions[index];
        GM_SuperValue.set("index", index + 1);
        console.log(index);
        console.log(transaction);
        if (index + 1 >= transactions.length) {
            GM_SuperValue.set("status", "done");
            location.reload(false);
        }
        $("#Name").val(transaction[0]);
        if ($("#PurchasedDateString").length != 0) {
            $("#PurchasedDateString").val(transaction[1]);
        }
        $("#SoldDateString").val(transaction[2]);
        $("#SalesPrice").val(transaction[3]);
        $("#PurchasePrice").val(transaction[4]);
        document.forms[0].submit();
    } else {
        var trs = $('tbody').find('tr');
        for (var i = 0; i < trs.length; ++i) {
            var isTarget = $(trs[i]).find("td")[0].innerText == pid;
            if (isTarget && index < transactions.length) {
                $(trs[i]).find("td:nth-child(4) a:nth-child(1)")[0].click()
            }
        }
    }
}
