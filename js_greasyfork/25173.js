// ==UserScript==
// @name         [HF] Report v3
// @namespace    http://hackforums.net
// @version      3.0
// @description  Quicker reporting!
// @author       You
// @match        https://hackforums.net/report.php?pid=*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/25173/%5BHF%5D%20Report%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/25173/%5BHF%5D%20Report%20v3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var reportArray = Array();
    var pid = window.location.href.split("?pid=")[1];
    var reportTable = document.getElementsByClassName("trow1");
    reportTable[0].style.height = "200px";
    var reportTableContent = reportTable[0].innerHTML;
    if (reportTableContent.indexOf("Error") !=-1) {
        var reportMessage = reportTable[0].getElementsByTagName("blockquote")[0];
        reportTable[0].innerHTML = "<font color='#00AAFF'><b>Report Center</b></font><br/><br/>"+reportMessage.innerHTML+"<br/><br/><a href='javascript:window.close();'>Close Window</a>";
    }
    else {
        console.log("Report available.");
        var reportContainer = document.createElement("span");
        var inputBox = reportTable[0].getElementsByTagName("input");
        var post_key = inputBox[0].value;
        var selectBox = reportTable[0].getElementsByTagName("select");
        var selectOptions = selectBox[0].getElementsByTagName("option");
        for(var i=0;i<selectOptions.length;i++) {
            var reportID = selectOptions[i].getAttribute("value");
            if (reportID !== "") {
                var reportName = selectOptions[i].innerHTML;
                reportArray[reportID] = reportName;
                var reportButton = document.createElement("span");
                var buttonSep = document.createElement("span");
                buttonSep.style.padding = "5px";
                buttonSep.style.paddingTop = "5px";
                reportButton.innerHTML = reportName;
                reportButton.style.padding = "5px";
                reportButton.lineHeight = "3";
                reportButton.style.cursor = "pointer";
                reportButton.style.display = "inline-block";
                $(reportButton).mouseenter(function() {
                    this.style.color = "#00AAFF";
                });
                $(reportButton).mouseleave(function() {
                    this.style.color = "#ccc";
                });
                $(reportButton).click("click", function() {
                    $(this).attr("data-clicked", "true");
                    $.post("report.php", {
                        my_post_key: post_key,
                        reason: reportID,
                        action: "do_report",
                        pid: pid,
                    },
                           function (data, status) {
                        if (status == "success") {
                            reportTable[0].innerHTML = "<font color='#32CD32'><b>Post reported!</b></font><br/><br/><a href='javascript:window.close();'>Close Window</a>";
                        }
                    });
                });
                reportContainer.appendChild(buttonSep);
                reportContainer.appendChild(reportButton);
            }
        }
        reportTable[0].innerHTML = "<font color='#00AAFF' size='2px;'><b>Report Center</b></font><br/>";
        reportTable[0].appendChild(reportContainer);
    }
})();