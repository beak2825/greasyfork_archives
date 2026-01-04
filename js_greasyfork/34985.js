// ==UserScript==
// @name         TotalGrade
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds a total grade on the D2L course grade report
// @author       Todd Roberts
// @match        https://ccis.ucourses.com/d2l/lms/grades/my_grades/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34985/TotalGrade.user.js
// @updateURL https://update.greasyfork.org/scripts/34985/TotalGrade.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // constants
    var RE = /\d+\s\/\s\d+/;
    var GRADEBOX_INDEX = 1;

    function totalGrade(){
        var gradeBox = assembleGradeBox();
        attachGradeBoxToPage(gradeBox);
    }

    function assembleGradeBox(){
    	var gradeBox = createGradeBox();
    	var grade = getGrade();
        var text = getText(grade);
        addGradeToGradeBox(gradeBox, text);
    	return gradeBox;
    }

    function createGradeBox(){
    	return document.createElement("span");
    }

    function getGrade(){
    	var grade = { pointsEarned : 0, pointsPossible : 0 };
    	var rows = getRows();
    	rows.forEach(function(row){
            addRowsPointsToGrade(row, grade);
        });
        return grade;
    }

    function getRows(){
        var allRows = [].slice.call(document.getElementById("z_a").rows);
        var assignmentRows = [];
        allRows.forEach(function (row){
            if (isAssignmentRow(row))
                assignmentRows.push(row);
        });
    	return assignmentRows;
    }

    function isAssignmentRow(row){
        var assignment = false;
        var tds = [].slice.call(row.getElementsByTagName('td'));
        tds.forEach(function(td){
            var label = td.getElementsByTagName('label')[0];
            var text = label === undefined ? "" : label.innerText;
            if (RE.test(text)){
                assignment = true;
            }
        });
        return assignment;
    }

    function addRowsPointsToGrade(row, grade){
        var points = getPoints(row);
        grade.pointsEarned += Number(points.earned);
        if (points.possible !== "ExtraCredit"){
            grade.pointsPossible += Number(points.possible);
    		fixIndividualGrade(row, points);
        }

    }

    function getPoints(row){
        var pointsTd = getPointsTd(row);
        var pointsText = getPointsText(pointsTd);
        return parsePoints(pointsText);
    }

    function getPointsTd(row){
        var pointsTd;
        var tds = row.getElementsByTagName('td');
        if (tds[0].getElementsByTagName('img')[0] === undefined)
            pointsTd = tds[0];
        else{
            GRADEBOX_INDEX = 2;
            pointsTd = tds[1];
        }

        return pointsTd;
    }

    function getPointsText(pointsTd){
        var pointsLabel = pointsTd.getElementsByTagName('label')[0];
    	return pointsLabel.innerText;
    }

    function parsePoints(pointsText){
        var re2 = /^\d+$/;
        if (RE.test(pointsText)){
    		var numerator = getNumerator(pointsText);
    		var denominator = getDenominator(pointsText);
    		return {earned : numerator, possible: denominator};
    	}
    	else if (re2.test(pointsText)){
    		return {earned : pointsText, possible: "ExtraCredit"};
    	}
    }

    function getNumerator(pointsText){
    	var re = /[0-9.]+\s/;
    	var match = pointsText.match(re)[0];
    	return match.trim();
    }

    function getDenominator(pointsText){
    	var re = /\s[0-9.]+/;
    	var match = pointsText.match(re)[0];
    	return match.trim();
    }

    function fixIndividualGrade(row, points){
    	var percentage = getPercentage(points.earned, points.possible);
    	var indivGradeBox = row.getElementsByTagName('td')[GRADEBOX_INDEX];
    	indivGradeBox.innerText = `${percentage}%`;
    }

    function getText(grade){
        var pointsEarned = grade.pointsEarned;
    	var pointsPossible = grade.pointsPossible;
    	var letterGrade = getLetterGrade(pointsEarned, pointsPossible);
    	var percentage = getPercentage(pointsEarned, pointsPossible);
    	return document.createTextNode(`Total: ${pointsEarned} / ${pointsPossible}, ${percentage}% (${letterGrade})`);
    }

     function getLetterGrade(earned, possible){
    	var total = earned / possible;
    	var letter;
    	if (total >= 0.9)
    		letter = 'A';
    	else if (total >= 0.8)
    		letter = 'B';
    	else if (total >= 0.7)
    		letter = 'C';
    	else if (total >= 0.6)
    		letter = 'D';
    	else
    		letter = 'F';
    	return letter;

    }

    function getPercentage(earned, possible){
    	return (earned / possible * 100).toFixed(2);
    }

    function addGradeToGradeBox(gradeBox, text){
        gradeBox.appendChild(text);
    }

    function attachGradeBoxToPage(gradeBox){
    	var host = document.getElementById("d_page_header");
    	host.appendChild(gradeBox);
    }

    totalGrade();

})();