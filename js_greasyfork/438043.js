// ==UserScript==
// @author       Stephen
// @name         Auto Refresh Helpscout Reports
// @description  Refresh helpscout.net/reports/all-channels/ page automatically at a set interval.
// @version      0.2.5
// @match        *://secure.helpscout.net/reports/all-channels/*
// @namespace    https://github.com/sspoon865/helpscout-autorefresh
// @source       https://raw.githubusercontent.com/sspoon865/helpscout-autorefresh/main/script.user.js
// @supportURL   https://github.com/sspoon865/helpscout-autorefresh/issues
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/438043/Auto%20Refresh%20Helpscout%20Reports.user.js
// @updateURL https://update.greasyfork.org/scripts/438043/Auto%20Refresh%20Helpscout%20Reports.meta.js
// ==/UserScript==

(function () {
	'use strict';
	
	//Script configuration values
	const RATE	= 30; //Number of seconds before page automatically refreshes
	const RANGE = 7; //Number of days to compare to
	
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
	
	let dObj = new Date(); //Current date object
	let d = dObj.getTime(); //In milliseconds
	let eObj = new Date(d - 86400000 * (RANGE - 1)); //Current date minus <RANGE> days
	let e = eObj.getTime(); //In milliseconds
	let cdObj = new Date(e - 86400000); //Date of next compared day (one day back from <e>)
	let cd = cdObj.getTime(); //In milliseconds
	let ceObj = new Date(cd - 86400000 * (RANGE - 1)); //Date of next compared day minus <RANGE> days
	let ce = ceObj.getTime(); //In milliseconds
	
	let dYear = dObj.getFullYear(); //Current year
	let dMonth = dObj.getMonth() + 1; //Current month
	let dDay = dObj.getDate(); //Current date
	let eYear = eObj.getFullYear(); //Year as of <RANGE> days ago
	let eMonth = eObj.getMonth() + 1; //Month as of <RANGE> days ago
	let eDay = eObj.getDate(); //Date as of <RANGE> days ago
	let cdYear = cdObj.getFullYear(); //Year as of <RANGE> - 1 days ago
	let cdMonth = cdObj.getMonth() + 1; //Month as of <RANGE> - 1 days ago
	let cdDay = cdObj.getDate(); //Date as of <RANGE> - 1 days ago
	let ceYear = ceObj.getFullYear(); //Year as of <RANGE> - 1 - <RANGE> days ago
	let ceMonth = ceObj.getMonth() + 1; //Month as of <RANGE> - 1 - <RANGE> days ago
	let ceDay = ceObj.getDate(); //Date as of <RANGE> - 1 - <RANGE> days ago
	
	//Convert date values to string literals
	const START_DATE = `${dYear}-${dMonth}-${dDay}`;
	const END_DATE = `${eYear}-${eMonth}-${eDay}`;
	const CMPR_START_DATE = `${cdYear}-${cdMonth}-${cdDay}`;
	const CMPR_END_DATE = `${ceYear}-${ceMonth}-${ceDay}`;
	
	//Redirect to reports page using previous comparison dates at a set interval of <RATE> seconds
	setInterval(function () {window.location.href = `https://secure.helpscout.net/reports/all-channels/?customField1=19189&customField2=&range=${RANGE}&startDate=${END_DATE}&endDate=${START_DATE}&cmpRange=${RANGE}&cmpStartDate=${CMPR_END_DATE}&cmpEndDate=${CMPR_START_DATE}&viewId=39930&rows%5B%5D=mailboxid%3A198256&rows%5B%5D=cf19186%7CNE%7CFast-Weigh`;}, RATE * 1000);
})();