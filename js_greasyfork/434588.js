// ==UserScript==
// @name        BetterMonitorStatus
// @author      DJJ
// @E-mail      daijianhao@xiaoice.com
// @description Make /monitor/status text look better for XiaoIce
// @include     http*/*/monitor/status
// @grant       none
// @version 0.1.1.5
// @namespace XiaoIce
// @downloadURL https://update.greasyfork.org/scripts/434588/BetterMonitorStatus.user.js
// @updateURL https://update.greasyfork.org/scripts/434588/BetterMonitorStatus.meta.js
// ==/UserScript==


var format = function (text) {
    var res = [["FileName", "ElapsedTime(min)" , "Status","ExceptionInfo"]];
    var json = JSON.parse(text);
    for (let item in json["RefreshScheduler"]["TaskList"]) {
        var t = json["RefreshScheduler"]["TaskList"][item];
        for (var itemKey in t["ItemRefreshState"]) {
            var dateTime = t["ItemRefreshState"][itemKey]["LastExecuteTime"];
            var status = t["ItemRefreshState"][itemKey]["Status"];
            var exception_info = t["ItemRefreshState"][itemKey]["LastExceptionText"];
            var dis = Date.parse(dateTime);
            var now = Date.now();
            res.push([itemKey, ((now - dis) / (60 * 1000)).toFixed(2),status, exception_info])
        }
    }
    var sorted_res = res.sort(function (a, b) {
        return a[1] - b[1]
    });
    return makeTableHTML(sorted_res)
};

function makeTableHTML(myArray) {
    var result = "<table border=1>";
    for (var i = 0; i < myArray.length; i++) {
        result += "<tr>";
        for (var j = 0; j < myArray[i].length; j++) {
            result += "<td>" + myArray[i][j] + "</td>";
        }
        result += "</tr>";
    }
    result += "</table>";

    return result;
}

// /html/body/pre/text()[1]
document.body.innerHTML = '<pre>' +
    format(document.querySelector("pre").innerText) +
    '</pre>';
