// ==UserScript==
// @name         Import failed testcase
// @namespace    http://supermicro.com/
// @version      0.3
// @description  Import failed testcase from SMSTC
// @author       ME
// @match        http://smstc.supermicro.com.tw/sumeco/
// @match        http://10.135.15.110/sumeco/
// @match        http://10.163.53.200/sumeco/
// @match        http://172.29.1.248/sumeco/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428297/Import%20failed%20testcase.user.js
// @updateURL https://update.greasyfork.org/scripts/428297/Import%20failed%20testcase.meta.js
// ==/UserScript==

'use strict';
function importFailedTestcase() {
    var debug = false;
    var failedTestcases = prompt("請輸入失敗test cases(使用空格隔開)","");
    var failedArr = failedTestcases.split(" ");
    for(var id in failedArr) {
        if(debug) {
            console.log(failedArr[id]);
        }
        var ele = document.querySelector("#debug_list > select > option[value='"+failedArr[id]+"']");
        if (ele != null) {
            ele.selected = true;
        }
    }
}
$("body > div > br:nth-child(4)").after('<button class="btn btn-primary">導入debug run</button>');
$("body > div > button").click(function(){
    importFailedTestcase();
})