// ==UserScript==
// @name         Swinburne University Canvas Assignment Checker
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Check for uncompleted assignments on Swinburne University's Canvas with enhanced UI, dark/light mode toggle, draggable popup, loading indicator, and assignment sorting options
// @license      MIT
// @author       Sin
// @match        https://swinburne.instructure.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498952/Swinburne%20University%20Canvas%20Assignment%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/498952/Swinburne%20University%20Canvas%20Assignment%20Checker.meta.js
// ==/UserScript==

/*
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

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

    let darkMode = true;  // Start in dark mode
    let allAssignments = [];

    // Wait for the page to fully load
    window.addEventListener('load', function() {
        // Create and show the button to open the course menu
        function createOpenMenuButton() {
            let button = document.createElement('button');
            button.textContent = 'Assignment Checker';
            button.style.position = 'fixed';
            button.style.top = '10px';
            button.style.left = '10px';
            button.style.zIndex = '9999';
            button.style.padding = '10px 20px';
            button.style.backgroundColor = '#1DB954';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '20px';
            button.style.cursor = 'pointer';
            button.style.fontSize = '16px';
            button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            button.onmousedown = function(event) {
                event.preventDefault();
                document.onmousemove = function(e) {
                    button.style.left = e.pageX - button.offsetWidth / 2 + 'px';
                    button.style.top = e.pageY - button.offsetHeight / 2 + 'px';
                };
                document.onmouseup = function() {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            };
            button.onclick = showCourseMenu;
            document.body.appendChild(button);
        }

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
            showLoadingPopup();
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
                                due_at: result.assignment.due_at ? new Date(result.assignment.due_at).toLocaleString() : 'No due date',
                                url: `https://swinburne.instructure.com/courses/${course.id}/assignments/${result.assignment.id}`
                            });
                        }
                    });

                    // Display uncompleted assignments in a popup
                    if (uncompletedAssignments.length > 0) {
                        let popupContent = `<h1>Uncompleted Assignments for ${course.name}</h1><ul>`;
                        uncompletedAssignments.forEach(assignment => {
                            popupContent += `<li><strong>${assignment.course}:</strong> <a href="${assignment.url}" target="_blank">${assignment.name}</a> (Due: ${assignment.due_at})</li>`;
                        });
                        popupContent += '</ul>';
                        removeLoadingPopup();
                        showPopup(popupContent);
                    } else {
                        removeLoadingPopup();
                        showPopup(`<h1>No uncompleted assignments for ${course.name}!</h1>`);
                    }
                });
            });
        }

        // Function to check uncompleted assignments for all courses
        function checkUncompletedAssignmentsForAllCourses(sortByDueDate = false) {
            showLoadingPopup();
            allAssignments = [];
            let coursePromises = courses.map(course => {
                return fetchAssignments(course.id).then(assignments => {
                    let submissionPromises = assignments.map(assignment => {
                        return fetchSubmissionDetails(course.id, assignment.id).then(result => ({
                            course: course.name,
                            assignment,
                            hasSubmission: result.hasSubmission
                        }));
                    });

                    return Promise.all(submissionPromises).then(results => {
                        results.forEach(result => {
                            if (!result.hasSubmission) {
                                allAssignments.push({
                                    course: result.course,
                                    name: result.assignment.name,
                                    due_at: result.assignment.due_at ? new Date(result.assignment.due_at).toLocaleString() : 'No due date',
                                    due_at_raw: result.assignment.due_at,
                                    url: `https://swinburne.instructure.com/courses/${course.id}/assignments/${result.assignment.id}`
                                });
                            }
                        });
                    });
                });
            });

            Promise.all(coursePromises).then(() => {
                if (sortByDueDate) {
                    allAssignments.sort((a, b) => {
                        if (a.due_at_raw && b.due_at_raw) {
                            return new Date(a.due_at_raw) - new Date(b.due_at_raw);
                        }
                        return 0;
                    });
                }

                let popupContent = `<h1>All Uncompleted Assignments</h1><ul>`;
                allAssignments.forEach(assignment => {
                    popupContent += `<li><strong>${assignment.course}:</strong> <a href="${assignment.url}" target="_blank">${assignment.name}</a> (Due: ${assignment.due_at})</li>`;
                });
                popupContent += '</ul>';
                popupContent += `
                    <button id="sort-assignments-button" style="margin-top: 10px; padding: 10px 20px; background-color: ${darkMode ? '#1DB954' : 'black'}; color: white; border: none; border-radius: 20px; cursor: pointer;">
                        Sort by Due Date
                    </button>
                `;
                removeLoadingPopup();
                showPopup(popupContent);

                document.getElementById('sort-assignments-button').onclick = function() {
                    checkUncompletedAssignmentsForAllCourses(true);
                };
            });
        }

        // Function to make the popup draggable
        function makeDraggable(element) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            if (element.querySelector('.popup-header')) {
                // If present, the header is where you move the DIV from
                element.querySelector('.popup-header').onmousedown = dragMouseDown;
            } else {
                // Otherwise, move the DIV from anywhere inside the DIV
                element.onmousedown = dragMouseDown;
            }

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // Get the mouse cursor position at startup
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                // Call a function whenever the cursor moves
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // Calculate the new cursor position
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // Set the element's new position
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
            }

            function closeDragElement() {
                // Stop moving when mouse button is released
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

        // Function to show a loading popup
        function showLoadingPopup() {
            let loadingPopup = document.createElement('div');
            loadingPopup.id = 'loading-popup';
            loadingPopup.style.position = 'fixed';
            loadingPopup.style.top = '10%';
            loadingPopup.style.left = '50%';
            loadingPopup.style.transform = 'translateX(-50%)';
            loadingPopup.style.zIndex = '9999';
            loadingPopup.style.backgroundColor = darkMode ? '#121212' : '#f8f9fa';
            loadingPopup.style.color = darkMode ? 'white' : 'black';
            loadingPopup.style.border = '1px solid #ccc';
            loadingPopup.style.padding = '20px';
            loadingPopup.style.borderRadius = '10px';
            loadingPopup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            loadingPopup.innerHTML = `<div class="popup-header" style="cursor: move; background-color: #1DB954; color: white; padding: 10px; border-radius: 10px 10px 0 0; text-align: center; font-size: 18px;">Loading...</div><h1>Loading...</h1>`;

            document.body.appendChild(loadingPopup);
            makeDraggable(loadingPopup);
        }

        // Function to remove the loading popup
        function removeLoadingPopup() {
            let loadingPopup = document.getElementById('loading-popup');
            if (loadingPopup) {
                document.body.removeChild(loadingPopup);
            }
        }

        // Function to show popup
        function showPopup(content, isLoading = false) {
            let popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '10%';
            popup.style.left = '50%';
            popup.style.transform = 'translateX(-50%)';
            popup.style.zIndex = '9999';
            popup.style.backgroundColor = darkMode ? '#121212' : '#f8f9fa';
            popup.style.color = darkMode ? 'white' : 'black';
            popup.style.border = '1px solid #ccc';
            popup.style.padding = '20px';
            popup.style.borderRadius = '10px';
            popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            popup.innerHTML = `<div class="popup-header" style="cursor: move; background-color: ${darkMode ? '#1DB954' : 'black'}; color: white; padding: 10px; border-radius: 10px 10px 0 0; text-align: center; font-size: 18px;">Assignments</div>${content}`;

            if (!isLoading) {
                let closeButton = document.createElement('button');
                closeButton.textContent = 'Close';
                closeButton.style.marginTop = '10px';
                closeButton.style.padding = '10px 20px';
                closeButton.style.backgroundColor = darkMode ? '#1DB954' : 'black';
                closeButton.style.color = 'white';
                closeButton.style.border = 'none';
                closeButton.style.borderRadius = '20px';
                closeButton.style.cursor = 'pointer';
                closeButton.onclick = function() {
                    document.body.removeChild(popup);
                };
                popup.appendChild(closeButton);

                let toggleButton = document.createElement('button');
                toggleButton.textContent = darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
                toggleButton.style.marginTop = '10px';
                toggleButton.style.marginLeft = '10px';
                toggleButton.style.padding = '10px 20px';
                toggleButton.style.backgroundColor = darkMode ? '#1DB954' : 'black';
                toggleButton.style.color = 'white';
                toggleButton.style.border = 'none';
                toggleButton.style.borderRadius = '20px';
                toggleButton.style.cursor = 'pointer';
                toggleButton.onclick = function() {
                    darkMode = !darkMode;
                    document.body.removeChild(popup);
                    showCourseMenu();
                };
                popup.appendChild(toggleButton);

                let allAssignmentsButton = document.createElement('button');
                allAssignmentsButton.textContent = 'All Assignments';
                allAssignmentsButton.style.marginTop = '10px';
                allAssignmentsButton.style.marginLeft = '10px';
                allAssignmentsButton.style.padding = '10px 20px';
                allAssignmentsButton.style.backgroundColor = darkMode ? '#1DB954' : 'black';
                allAssignmentsButton.style.color = 'white';
                allAssignmentsButton.style.border = 'none';
                allAssignmentsButton.style.borderRadius = '20px';
                allAssignmentsButton.style.cursor = 'pointer';
                allAssignmentsButton.onclick = function() {
                    checkUncompletedAssignmentsForAllCourses();
                };
                popup.appendChild(allAssignmentsButton);

                let credit = document.createElement('div');
                credit.style.marginTop = '10px';
                credit.style.fontSize = '12px';
                credit.style.textAlign = 'center';
                credit.textContent = 'Created by Sin';
                popup.appendChild(credit);
            }

            document.body.appendChild(popup);
            makeDraggable(popup);
        }

        // Create and show the menu to select a course
        function showCourseMenu() {
            let menuContent = '<h1>Select a Course</h1><ul style="list-style-type: none; padding: 0;">';
            courses.forEach(course => {
                menuContent += `<li><button class="course-button" data-course-id="${course.id}" style="margin: 10px; padding: 10px 20px; background-color: ${darkMode ? '#1DB954' : 'black'}; color: white; border: none; border-radius: 20px; cursor: pointer;">${course.name}</button></li>`;
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

        // Trigger the button creation after a short delay to ensure the page is fully loaded
        setTimeout(createOpenMenuButton, 5000);
    });
})();
