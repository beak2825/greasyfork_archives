// ==UserScript==
// @name         Swinburne University Canvas Assignment Checker
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Check for uncompleted assignments on Swinburne University's Canvas, now with improved submission checking and class menu selection
// @author       sin
// @match        https://swinburne.instructure.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498946/Swinburne%20University%20Canvas%20Assignment%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/498946/Swinburne%20University%20Canvas%20Assignment%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of course URLs
    const courses = [
        { id: '58653', name: 'BSBINS401-Analyse and present research information' },
        { id: '58658', name: 'ICTNWK422-Install and manage servers' },
        { id: '58661', name: 'ICTPRG434-Automate processes' },
        { id: '58663', name: 'ICTPRG435-Write scripts for software applications' },
        { id: '58665', name: 'ICTSAS440-Monitor and administer security of ICT systems' },
        { id: '58667', name: 'VU23213-Utilise basic network concepts and protocols required in cyber security' },
        { id: '58672', name: 'VU23214-Configure and secure networked end points' },
        { id: '58675', name: 'VU23217-Recognise the need for cyber security in an organisation' },
        { id: '58679', name: 'VU23223-Apply cyber security legislation, privacy and ethical practices' }
    ];

    // Wait for the page to fully load
    window.addEventListener('load', function() {
        // Function to fetch assignments for a course
        function fetchAssignments(courseId) {
            return fetch(`/api/v1/courses/${courseId}/assignments?per_page=100`)
                .then(response => response.json());
        }

        // Function to fetch submission details for an assignment
        function fetchSubmissionDetails(courseId, assignmentId) {
            return fetch(`/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions/self`)
                .then(response => response.json())
                .then(submission => {
                    const hasSubmission = submission.submitted_at !== null;
                    return { assignmentId, hasSubmission };
                });
        }

        // Function to check uncompleted assignments for a specific course
        function checkUncompletedAssignmentsForCourse(course) {
            fetchAssignments(course.id).then(assignments => {
                let submissionPromises = assignments.map(assignment => {
                    return fetchSubmissionDetails(course.id, assignment.id).then(result => ({
                        assignment,
                        hasSubmission: result.hasSubmission
                    }));
                });

                Promise.all(submissionPromises).then(results => {
                    let uncompletedAssignments = [];
                    results.forEach(result => {
                        if (!result.hasSubmission) {
                            uncompletedAssignments.push({
                                course: course.name,
                                name: result.assignment.name,
                                due_at: result.assignment.due_at ? new Date(result.assignment.due_at).toLocaleString() : 'No due date'
                            });
                        }
                    });

                    // Display uncompleted assignments in a popup
                    if (uncompletedAssignments.length > 0) {
                        let popupContent = `<h1>Uncompleted Assignments for ${course.name}</h1><ul>`;
                        uncompletedAssignments.forEach(assignment => {
                            popupContent += `<li><strong>${assignment.course}:</strong> ${assignment.name} (Due: ${assignment.due_at})</li>`;
                        });
                        popupContent += '</ul>';
                        showPopup(popupContent);
                    } else {
                        showPopup(`<h1>No uncompleted assignments for ${course.name}!</h1>`);
                    }
                });
            });
        }

        // Function to show popup
        function showPopup(content) {
            let popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '10%';
            popup.style.left = '50%';
            popup.style.transform = 'translateX(-50%)';
            popup.style.zIndex = '9999';
            popup.style.backgroundColor = 'white';
            popup.style.border = '1px solid #ccc';
            popup.style.padding = '20px';
            popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
            popup.innerHTML = content;

            let closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.style.marginTop = '10px';
            closeButton.onclick = function() {
                document.body.removeChild(popup);
            };
            popup.appendChild(closeButton);

            document.body.appendChild(popup);
        }

        // Create and show the menu to select a course
        function showCourseMenu() {
            let menuContent = '<h1>Select a Course</h1><ul>';
            courses.forEach(course => {
                menuContent += `<li><button class="course-button" data-course-id="${course.id}">${course.name}</button></li>`;
            });
            menuContent += '</ul>';
            showPopup(menuContent);

            // Add event listeners to the course buttons
            document.querySelectorAll('.course-button').forEach(button => {
                button.addEventListener('click', function() {
                    let courseId = this.getAttribute('data-course-id');
                    let course = courses.find(c => c.id === courseId);
                    checkUncompletedAssignmentsForCourse(course);
                });
            });
        }

        // Trigger the course menu after a short delay to ensure the page is fully loaded
        setTimeout(showCourseMenu, 5000);
    });
})();
