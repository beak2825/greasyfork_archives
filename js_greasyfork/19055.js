// ==UserScript==
// @name        Today's Projected, Pending, and Finalized Earnings
// @author      StubbornlyDesigned
// @description Displays today's projected, pending, and finalized earnings. Only updates after your submitted, approved, rejected, or pending values have changed.
// @namespace   https://greasyfork.org/en/users/35961-stubbornlydesigned
// @version		1.1
// @match       https://www.mturk.com/mturk/dashboard
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19055/Today%27s%20Projected%2C%20Pending%2C%20and%20Finalized%20Earnings.user.js
// @updateURL https://update.greasyfork.org/scripts/19055/Today%27s%20Projected%2C%20Pending%2C%20and%20Finalized%20Earnings.meta.js
// ==/UserScript==

var metricsTable = $('th:contains("Earnings To Date")').closest('table');
var statusDetailBaseURL = '/mturk/statusdetail?encodedDate=';
var dayName = $('a[href^="'+statusDetailBaseURL+'"]:first');
var evenOddClass = '';

var currentPage = 0;
var totalPages = 0;

var totalProjected = 0;
var totalPending = 0;
var totalFinalized = 0;

var projectedRowValue = document.createElement('td');
var pendingRowValue = document.createElement('td');
var finalizedRowValue = document.createElement('td');

var cName = "ppfCookie";
var cData = {};

function startRunning() {
	createTableRows();
	
	if(dayName.text().indexOf("Today") === 0) {
		if(needsToBeUpdated()) {
			fetchData(dayName.attr("href"));
		} else {
			updateFromCookie();
		}
	} else {
		clearCookies();
	}
}

function needsToBeUpdated() {
	var sarp = dayName.closest('tr');
	sarp = sarp.find('td');
	
	cData["submitted"] = sarp[1].innerText;
	cData["approved"] = sarp[2].innerText;
	cData["rejected"] = sarp[3].innerText;
	cData["pending"] = sarp[4].innerText;
	
	var cookieCheck = getCookie();
	
	if(cookieCheck.length) {
		cookieCheck = $.parseJSON(cookieCheck);
		for(var param in cData) {
			if(cData[param] != cookieCheck[param]) {
				return true;
			}
		}
	} else {
		return true;
	}

	return false;
}

function updateFromCookie() {
	var ppfCookie = $.parseJSON(getCookie());
	
	setStatusMessage(ppfCookie["projectedEarnings"], "projected");
	setStatusMessage(ppfCookie["pendingEarnings"], "pending");
	setStatusMessage(ppfCookie["finalizedEarnings"], "finalized");
}

function createTableRows() {
	var projectedRow = document.createElement('tr');
	projectedRow.className = evenOdd();
	var projectedRowTitle = document.createElement('td');
	projectedRowTitle.innerHTML = 'Projected earnings for today:';

	var pendingRow = document.createElement('tr');
	pendingRow.className = evenOdd();
	var pendingRowTitle = document.createElement('td');
	pendingRowTitle.innerHTML = 'Pending earnings for today:';
	
	var finalizedRow = document.createElement('tr');
	finalizedRow.className = evenOdd();
	var finalizedRowTitle = document.createElement('td');
	finalizedRowTitle.innerHTML = 'Finalized earnings for today:';
	
	projectedRowTitle.className = pendingRowTitle.className = finalizedRowTitle.className = 'metrics-table-first-value';
	
	setStatusMessage("$0.00");

	projectedRow.appendChild(projectedRowTitle);
	projectedRow.appendChild(projectedRowValue);
	pendingRow.appendChild(pendingRowTitle);
	pendingRow.appendChild(pendingRowValue);
	finalizedRow.appendChild(finalizedRowTitle);
	finalizedRow.appendChild(finalizedRowValue);

	metricsTable.append(projectedRow, pendingRow, finalizedRow);
}

function evenOdd() {
	if(evenOddClass.length === 0) {
		evenOddClass = $('tr:last', metricsTable).attr('class');
	}
	
	switch(evenOddClass) {
		case "even":
			evenOddClass = 'odd';
			break;
		case "odd":
			evenOddClass = 'even';
			break;
	}
	
	return evenOddClass; 
}

function setStatusMessage(message, cell = '') {
	switch(cell) {
		case "projected":
			projectedRowValue.innerHTML = message;
			break;
		case "pending":
			pendingRowValue.innerHTML = message;
			break;
		case "finalized":
			finalizedRowValue.innerHTML = message;
			break;
		default:
			projectedRowValue.innerHTML = message;
			pendingRowValue.innerHTML = message;
			finalizedRowValue.innerHTML = message;
	}
}

function fetchData(url) {
	if (url.length != 0) {
		$.get(url, function(data) {
			var $src = $(data);
			var pagerateError = $src.find("td[class='error_title']:contains('You have exceeded the maximum allowed page request rate for this website.')");
			
			if(pagerateError.length === 0) {
				currentPage++;
				
				if(totalPages === 0) {
					lastPage = $($src).find("a:contains('Last')");
					lastPage = (lastPage.length) ? lastPage[0].search : 1;
					setNumberOfPages(lastPage);
				}
				
				setStatusMessage(currentPage + "/" + totalPages);
				
				scrapePage($src);
				
				var nextUrl = $($src).find("a:contains('Next')");
				nextUrl = (nextUrl.length != 0) ? $(nextUrl[0]).attr("href") : '';
				
				setTimeout(fetchData(nextUrl), 500);
			} else {
				setTimeout(fetchData(url), 2000);
			}
		});
	} else {
		finishRunning();
	}
}

function setNumberOfPages(search) {
	if(isNaN(search)) {
		params = search.split('&');

		for (var i = 0; i < params.length; i++) {
			var pair = params[i].split('=');
			if (decodeURIComponent(pair[0]) == 'pageNumber') {
				totalPages = decodeURIComponent(pair[1]);
			}
		}
	} else {
		totalPages = 1;
	}
}

function scrapePage($data) {
	var amountDetail = $data.find("td.statusdetailAmountColumnValue");
	var statusDetail = $data.find("td.statusdetailStatusColumnValue");
	
	for(var j = 0; j < amountDetail.length; j++) {
		var amount = parseFloat(amountDetail[j].innerText.slice(1));

		switch(statusDetail[j].innerText.slice(0, 3)) {
			case "Pen":
				totalProjected += amount;
				break;
			case "App":
				totalPending += amount;
				totalProjected += amount;
				break;
			case "Pai":
				totalFinalized += amount;
				totalProjected += amount;
				break;
		}
	}
}

function finishRunning() {
	totalProjected = "$" + totalProjected.toFixed(2);
	totalPending = "$" + totalPending.toFixed(2);
	totalFinalized = "$" + totalFinalized.toFixed(2);
	
	setStatusMessage(totalProjected, "projected");
	setStatusMessage(totalPending, "pending");
	setStatusMessage(totalFinalized, "finalized");
	
	cData["projectedEarnings"] = totalProjected;
	cData["pendingEarnings"] = totalPending;
	cData["finalizedEarnings"] = totalFinalized;
	
	setCookie(JSON.stringify(cData));
}

function setCookie(value) {
	var date = new Date();
	date.setTime(date.getTime()+(24*60*60*1000));
	var expires = "; expires="+date.toUTCString();

	value = value + expires;

	document.cookie = cName + "=" + value;
}

function getCookie() {
	var name = cName + "=";
	var ca = document.cookie.split(';');

	for(var k = 0; k < ca.length; k++) {
		var c = ca[k];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if(c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}

	return "";
}

function deleteCookie() {
	document.cookie = cName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}

startRunning();