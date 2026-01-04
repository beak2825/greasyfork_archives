// ==UserScript==
// @name         Swabucks Survey Effort Calculator
// @namespace    http://your.homepage/
// @version      1.0
// @license      MIT
// @description  Provides the SB/Minute for each survey on the swagbucks answer page
// @author       You
// @match        https://www.swagbucks.com/surveys*
// @grant        none
// @require 		 https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/437771/Swabucks%20Survey%20Effort%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/437771/Swabucks%20Survey%20Effort%20Calculator.meta.js
// ==/UserScript==

// Generates the Rate column header element and returns it to be used by the main function
function generateRateColumnHeader() {
	var rateColumnHeader = document.createElement('th');
	rateColumnHeader.className = "surveyEffort table-sortable table-sortable:numeric";
  rateColumnHeader.innerHTML = '<span class="sort">SB/Minute</span>';
  return rateColumnHeader;
}

// generate the table cell with the calculated rate
function generateRateCell(row) {
	var rateCell = document.createElement('td');
  rateCell.className = 'surveyRate';
  rateCell.innerHTML = `${calculateSurveyRate(row)} SB/min`;
	return rateCell;
}

function calculateSurveyRate(surveyRow) {
	// Pull the row attributes out for the calculation
  var time = parseInt(surveyRow.getAttribute('loi'));
  var reward = parseInt(surveyRow.getAttribute('reward'));
  var bonus = parseInt(surveyRow.getAttribute('bonus'));
  
  // make sure time isn't falsy so we don't try to divide by 0
  if( time ) {
    var rate = (reward + bonus)/time;
		return _.round(rate, 2);
  }
  // Return 0 if we can't calculate the rate so it gets a low priority in any sorting
  return 0;
}

// Loop through all of the table bodies and pull out the one we care about because it's compiled without an ID to reference
function findCompiledSurveyTbody() {
  var tbodyElements = document.getElementsByTagName('tbody');
  var surveyTbody;
  
  _.forEach(tbodyElements, element => {
  	// The compiled tbody doesn't have an id so we need to mine that out of the array of table bodies
    if( !element.id ) {
    	surveyTbody = element;
    }
  });
  return surveyTbody;
}

// Get the Survey times and amounts
var time = document.getElementsByClassName('surveyTime');
var sb = document.getElementsByClassName('surveySB');

// Append a Rate column header and make it sortable
var tableHeader = document.getElementById("surveysTHead");
var headerRow = tableHeader.children[0];
headerRow.appendChild(generateRateColumnHeader());

// Get the tbody element to append the rate cell to
var surveyTableBody = findCompiledSurveyTbody();
var surveyTableRows = _.get(surveyTableBody, 'children', []);
_.forEach(surveyTableBody.children, child => {
  var rateCell = generateRateCell(child);
  child.appendChild(rateCell);
});
