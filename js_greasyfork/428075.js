// ==UserScript==
// @name         Export failed testcase
// @namespace    http://supermicro.com/
// @version      0.3
// @description  Export failed testcase from SMSTC
// @author       ME
// @match        http://*/static/att/*/att_sumeco_report/*/*/*/report.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428075/Export%20failed%20testcase.user.js
// @updateURL https://update.greasyfork.org/scripts/428075/Export%20failed%20testcase.meta.js
// ==/UserScript==

'use strict';
function exportFailedTestcase(){
    var debug = false;
    var failedTestcases = [];
    var allTestcase = $("#test-details > tbody > tr").each(function(){
        if($(this).children("td.details-col-status").children("div").children("span")[0].innerText=="FAIL"){
            var text=$(this).children("td.details-col-name").children("div").children("a")[0].innerText;
            var regexp = /Test case [0-9]+/g
            var testCaseFullName = text.match(regexp)
            var testcaseName = testCaseFullName[0].substring("Test case ".length,testCaseFullName[0].length+1);
            failedTestcases.push(testcaseName);
        }
    });
    failedTestcases.sort();
    console.log("failed cases(first 50):");
    console.log(failedTestcases);
    console.log("for import:");
    var result = "";
    for(var id in failedTestcases) {
        if(result != "") {
            result = result + " ";
        }
        result = result + failedTestcases[id];
    }
    console.log(result);
    console.log("you need to copy the code from Tempermonkey to console if there are more than 50 failed cases because the limitation of Tampermonkey");
}
exportFailedTestcase();