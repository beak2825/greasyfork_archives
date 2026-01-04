// ==UserScript==
// @name         PUP Laude Calculator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract and display semester data from card elements, excluding specific descriptions, and calculate final grades and GPA
// @author       Daniel Manaog (danidaniel.manaog@imageality.eu.org)
// @include      /^https:\/\/sis[1-9]\.pup\.edu\.ph\/student\/grades/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472809/PUP%20Laude%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/472809/PUP%20Laude%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const excludedDescriptions = [
        "Physical Fitness and Self-Testing Activities",
        "Civic Welfare Training Service 1",
        "Rhythmic Activities",
        "Civic Welfare Training Service 2",
        "Individual/Dual/Combative Sports",
        "Team Sports"
    ];

    // Function to extract numerical value from grade element
    function extractNumericalGrade(gradeElement) {
        const gradeText = gradeElement.textContent.trim();
        const numericalGrade = gradeText.match(/(\d+\.\d+)/);
        return numericalGrade ? parseFloat(numericalGrade[0]) : 0;
    }

    // Function to check if a description is excluded
    function isExcludedDescription(description) {
        return excludedDescriptions.includes(description);
    }

    // Function to round a number to four decimal places and add trailing zeroes
    function roundToFourDecimals(number) {
        return parseFloat(number).toFixed(4);
    }

    // Function to determine Laude status based on GPA
    function getLaudeStatus(gpa) {
        if (gpa >= 1.00 && gpa <= 1.20) {
            return "Summa Cum Laude";
        } else if (gpa > 1.20 && gpa <= 1.45) {
            return "Magna Cum Laude";
        } else if (gpa > 1.45 && gpa <= 1.75) {
            return "Cum Laude";
        } else {
            return "Not Part of Graduate with Honors";
        }
    }

    // Function to extract and process semester data
    function processSemesterCard(card) {
        const titleElement = card.querySelector('.card-title');
        if (!titleElement) return;

        const semesterTitle = titleElement.textContent.trim();
        const unitElements = card.querySelectorAll('.table tbody tr td:nth-child(5)');
        const descriptionElements = card.querySelectorAll('.table tbody tr td:nth-child(3)');
        const gradeElements = card.querySelectorAll('.table tbody tr td:nth-child(7)');

        let semesterUnits = 0;
        let semesterFinalGrade = 0;
        let failedSubjects = [];

        descriptionElements.forEach((descriptionElement, index) => {
            const description = descriptionElement.textContent.trim();
            if (!isExcludedDescription(description)) {
                const units = parseFloat(unitElements[index].textContent);
                const numericalGrade = extractNumericalGrade(gradeElements[index]);
                semesterUnits += units;
                semesterFinalGrade += numericalGrade * units;

                // Check if the student has failed a subject
                if (numericalGrade > 2.50) {
                    failedSubjects.push(description);
                }
            }
        });

        const semesterGPA = semesterUnits === 0 ? 0 : semesterFinalGrade / semesterUnits;
        const laudeStatus = failedSubjects.length > 0 ? "Not Part of Graduate with Honors" : getLaudeStatus(semesterGPA);

        return {
            units: semesterUnits,
            finalGrade: semesterFinalGrade,
            gpa: semesterGPA,
            laudeStatus: laudeStatus,
            failedSubjects: failedSubjects
        };
    }

    // Main function to process all semester cards
    function processAllSemesters() {
        const semesterCards = document.querySelectorAll('.card-theme');
        let totalUnits = 0;
        let totalFinalGrade = 0;
        let hasFailedSubject = false;
        let allFailedSubjects = [];

        semesterCards.forEach(card => {
            const semesterData = processSemesterCard(card);
            totalUnits += semesterData.units;
            totalFinalGrade += semesterData.finalGrade;

            // Check if the student has failed a subject in any semester
            if (semesterData.laudeStatus === "Not Part of Graduate with Honors") {
                hasFailedSubject = true;
                allFailedSubjects = allFailedSubjects.concat(semesterData.failedSubjects);
            }
        });

        const overallGPA = totalUnits === 0 ? 0 : totalFinalGrade / totalUnits;
        const overallLaudeStatus = hasFailedSubject ? "Not Part of Graduate with Honors" : getLaudeStatus(overallGPA);

        // Create a centered div for the result
        const centeredDiv = document.createElement('div');
        centeredDiv.className = 'col-12 text-center';
        centeredDiv.appendChild(createOverallGPAResult(overallGPA, overallLaudeStatus, hasFailedSubject, allFailedSubjects));

        // Insert the centered div inside the section with id "Results"
        const resultsSection = document.getElementById('Results');
        resultsSection.parentNode.insertBefore(centeredDiv, resultsSection.nextSibling);
    }

    // Function to create the overall GPA result with Laude status and Failed Subjects
    function createOverallGPAResult(overallGPA, overallLaudeStatus, hasFailedSubject, allFailedSubjects) {
        const resultElement = document.createElement('p');
        resultElement.className = "pl-2 pr-2 bg-info";
        resultElement.innerHTML = `Overall GPA: ${roundToFourDecimals(overallGPA)}<br>Overall Laude Status: ${overallLaudeStatus}`;

        if (hasFailedSubject) {
            resultElement.innerHTML += `<br>Failed Subjects: ${allFailedSubjects.join(', ')}`;
        }

        return resultElement;
    }

    // Check if the current URL matches the pattern
    if (/^https:\/\/sis[1-9]\.pup\.edu\.ph\/student\/grades/.test(window.location.href)) {
        // Run the script
        processAllSemesters();
    }
})();
