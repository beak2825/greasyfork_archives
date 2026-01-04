// ==UserScript==
// @name         Dell DFO Search
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Easily search dells DFO listings by filtering information.
// @author       Lauchlan Irwin
// @match        http://www1.ap.dell.com/content/topics/segtopic.aspx/products/quickship/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38913/Dell%20DFO%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/38913/Dell%20DFO%20Search.meta.js
// ==/UserScript==

GLOBAL_DEBUG = false;
GLOBAL_SEARCH_TERMS = undefined;
GLOBAL_ROWS = undefined;

//Custom debug function to allow toggling of console logs from
debug = {

    log: GLOBAL_DEBUG == true ? function (string) {
        console.log(string);
    } : function () { },

    error: GLOBAL_DEBUG == true ? function (string) {
        console.error(string);
    } : function () { },

    assert: GLOBAL_DEBUG == true ? function (string) {
        console.assert(string);
    } : function () { }

};

(function () {
    GLOBAL_SEARCH_TERMS = [];
    GLOBAL_ROWS = getRows();

    //Add search bar
    var firstRow = GLOBAL_ROWS[0];
    if (!firstRow) return;

    var searchBar = firstRow.cloneNode(true);
    searchBar.id = "searchBar";


    for (var i = 0; i < searchBar.children.length; i++) {
        var column = searchBar.children[i];
        column.innerHTML = "";

        var input = document.createElement("input");
        input.id = "input" + i;
        input.columnNumber = i;
        input.onchange = function (e) {
            search(e.target.columnNumber);
        };

        GLOBAL_SEARCH_TERMS.push([]);

        column.appendChild(input);
    }

    firstRow.parentElement.insertBefore(searchBar, firstRow);
    console.log(firstRow.parentElement);
    console.log(firstRow);
    return;
}());

function getRows(numberOfRows) {

    var temp = [];
    var tableRows = document.getElementsByTagName("tr");

    for (var el in tableRows) {
        el = tableRows[el];

        if (el.children) {

            if (el.children.length > 1) {

                if (el.children[0].classList.contains("gridCell") ||
                    el.children[0].classList.contains("gridCellAlt")) {

                    temp.push(el);

                    if (numberOfRows == temp.length) {
                        return temp;
                    }

                }

            }

        }

    }

    return temp;
}

function getSearchTerms(colNumber) {

    var input = document.getElementById("input" + colNumber);
    GLOBAL_SEARCH_TERMS[colNumber] = [];

    var individualTerms = input.value.match(/\w(\s?(?:\w))*/g);

    if (individualTerms) {
        for (var singleTerm in individualTerms) {
            GLOBAL_SEARCH_TERMS[colNumber].push(individualTerms[singleTerm]);
        }
    } else {
        GLOBAL_SEARCH_TERMS[colNumber] = [];
    }

    debug.log(GLOBAL_SEARCH_TERMS);

}

function search(columnUpdated) {

    getSearchTerms(columnUpdated);

    for (var i = 0; i < GLOBAL_ROWS.length; i++) {

        debug.log("");

        var row = GLOBAL_ROWS[i];

        if (row.id == "searchBar") continue; //Skip if row is searchBar
        if (!row.children) continue; //Skip if no children property

        var rowPassed = true;
        var columns = row.children;

        for (var j = 0; j < columns.length; j++) {

            var column = columns[j];
            var columnPassed = true;

            var text = column.innerHTML;
            text = text ? text.toLowerCase() : "";
            var searchTerms = GLOBAL_SEARCH_TERMS[j];

            //if nothing to search => search passes automatically
            if (!searchTerms) {
                debug.log("Column PASSED: (no searchTerms) -> " + text);
                columnPassed = true;
                continue;
            } else if (searchTerms.length == 0) {
                debug.log("Column PASSED: (no searchTerms) -> " + text);
                columnPassed = true;
                continue;
            }

            var singleTerm = "";

            for (var n = 0; n < searchTerms.length; n++) {
                singleTerm = searchTerms[n];

                if (!text.includes(singleTerm.toLowerCase())) {
                    debug.log("Column FAILED: (" + singleTerm + ") -> " + text);
                    columnPassed = false;
                    break;
                }

            }

            if (!columnPassed) {
                rowPassed = false;
                break;
            }else{
                debug.log("Column PASSED: (" + document.getElementById("input"+columnUpdated).value + ") -> " + text);
            }

        }

        row.style.display = rowPassed ? "table-row" : "none";

        debug.log(rowPassed ? "    <<Row passed!>>    " : "    ##Row failed##    ");
        debug.log("");
        debug.log("");

    }
}