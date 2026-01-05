// ==UserScript==
// @name			ReportTracker
// @version			1.3
// @description		Live report tracker with alerts
// @match			https://epicmafia.com/*
// @author       Croned (The)
// @namespace https://greasyfork.org/en/users/9694-croned
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/11924/ReportTracker.user.js
// @updateURL https://update.greasyfork.org/scripts/11924/ReportTracker.meta.js
// ==/UserScript==

console.log("ReportTracker activated!");

//Get the list of tracked reports
var reportJSON = GM_getValue("em_reportList");
if (reportJSON) {
	reportJSON = JSON.parse(reportJSON);
}
else {
	reportJSON = {data: []};
    GM_setValue("em_reportList", JSON.stringify(reportJSON));
}
//console.log(reportJSON);
var reportList = reportJSON.data;

//Set the checker interval
var checkInt = setInterval(function() {
	reportJSON = GM_getValue("em_reportList");
	reportJSON = JSON.parse(reportJSON);
	reportList = reportJSON.data;
	
	var tempJSON = reportJSON;
	
	for (var index in reportList) {
		var reportObj = reportList[index];
		(function(report){
			$.get("/report/" + report.id, function(page){
				var div = $("<div></div>");
				div.html(page);
				if (div.find("h2").text().split(" ")[1] == report.id) {
					var status = div.find(".report_status").text();
					var verdict = div.find("#report_statement").text();
					/*console.log(div);
					console.log(status);
					console.log(report.id);*/
					
					if (status != report.status && status == "In Progress") {
						//console.log("Report " + report.id + " is now In Progress!");
						//errordisplay(".errordisplay", "Report " + report.id + " is now In Progress!");
						alert("Report " + report.id + " is now In Progress!");
						tempJSON.data[index].status = status;
						setTimeout(function(){
							GM_setValue("em_reportList", JSON.stringify(tempJSON));
						}, 500);
						
					}
					else if (status != report.status && status == "Closed") {
						//console.log("Report " + report.id + " is now closed with a verdict of " + verdict.replace(" ", "") || "[no verdict]");
						//errordisplay(".errordisplay", "Report " + report.id + " is now closed with a verdict of " + verdict.replace(" ", "") || "[no verdict]");
						alert("Report " + report.id + " is now closed with a verdict of " + verdict.replace(" ", "") || "[no verdict]");
						tempJSON.data.splice(index, 1);
						setTimeout(function(){
							GM_setValue("em_reportList", JSON.stringify(tempJSON));
						}, 500);
					}
				}
				else {
					//console.log("Report " + report.id + " was deleted");
					//errordisplay(".errordisplay", "Report " + report.id + " was deleted");
					alert("Report " + report.id + " was deleted");
					tempJSON.data.splice(index, 1);
					setTimeout(function(){
						GM_setValue("em_reportList", JSON.stringify(tempJSON));
					}, 500);
				}
			});
		})(reportObj);
	}
}, 5000);

//Insert checkboxes for tracking on report pages
var isReport = $(".report_status").text();
if (isReport && isReport != "Closed") {
	$("#report_r1").after("<input type='checkBox' id='trackBox'></input> Track");
}

//Check boxes of reports already tracked
for (var index in reportList) {
	if (reportList[index].id == window.location.pathname.split("/")[2]) {
		$("#trackBox").prop('checked', true);
	}
}

//Detect checkbox checking
var matches;
$("#trackBox").click(function() {
	if ($("#trackBox").prop('checked')) {
		reportJSON.data.push({id: window.location.pathname.split("/")[2], status: "Open"});
		GM_setValue("em_reportList", JSON.stringify(reportJSON));
	}
	else {
		for (var index in reportList) {
			if (reportJSON.data[index].id == window.location.pathname.split("/")[2]) {
				reportJSON.data.splice(index, 1);
				GM_setValue("em_reportList", JSON.stringify(reportJSON));
			}
		}
	}
});