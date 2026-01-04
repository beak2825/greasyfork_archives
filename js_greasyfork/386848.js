// ==UserScript==
// @name         Add CloudWatch links to XRay
// @namespace    http://dotnetcatch.com/
// @version      0.1
// @description  Add CloudWatch log links for Lambda executions.
// @author       Robb Schiefer
// @match        https://*.amazon.com/xray/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386848/Add%20CloudWatch%20links%20to%20XRay.user.js
// @updateURL https://update.greasyfork.org/scripts/386848/Add%20CloudWatch%20links%20to%20XRay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Array.from(document.getElementsByClassName("group-type")).forEach(function(element, index, array) {
console.trace(element);
	if (element.innerText == "AWS::Lambda") {
		var lambdaName = element.parentNode.childNodes[1].innerText;

        var when = document.getElementsByClassName("timeline-overview")[0].firstChild.childNodes[1].firstChild.childNodes[3].innerText;
		console.trace(when);
		var date = /(?<=.*\()(?<date>[\d-]+)\s+(?<hourAndMin>\d\d:\d\d+)(?<sec>[\d:]+)\s+\w*(?=\))/.exec(when);
		var dateText = date.groups.date + "T" + date.groups.hourAndMin;
		var hour = parseInt(date.groups.hour);
		var start = dateText + ":" + date.groups.sec + "Z";
		var end = dateText + ":59Z";

		var link = document.createElement("a");
		link.appendChild(document.createTextNode("CloudWatch Logs"));
		link.href = "https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logEventViewer:group=/aws/lambda/" + lambdaName + ";start="+start+";end=" + end;
        link.style = "font-weight: bold;";
        link.target = "_blank";
        console.trace(link);
		element.parentNode.appendChild(link);
	}
})
})();