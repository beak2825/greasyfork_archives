// ==UserScript==
// @name         ANU Current Courses Menu
// @namespace    http://tampermonkey.net/
// @match        https://wattlecourses.anu.edu.au/*
// @version      0.1
// @description  Adds a floating window with a course menu on Moodle pages.
// @author       maxela-2001
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/532898/ANU%20Current%20Courses%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/532898/ANU%20Current%20Courses%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the floating window
    function createFloatingWindow(expanded) {
        let floatingWindow = document.createElement("div");
        floatingWindow.style.position = "fixed";
        floatingWindow.style.bottom = "10px";
        floatingWindow.style.left = "10px";
        floatingWindow.style.width = "240px";
        floatingWindow.style.maxHeight = expanded ? "400px" : "50px"; // Collapsed by default
        floatingWindow.style.backgroundColor = "rgba(253, 238, 241, 0.9)";
        floatingWindow.style.border = "1px solid rgba(218,20,60,.4)";
        floatingWindow.style.borderRadius = "8px";
        floatingWindow.style.boxShadow = "inset 0 0 0 1px rgba(218,20,60,.1), 0 4px 8px rgba(0, 0, 0, 0.1)";
        floatingWindow.style.zIndex = "1000";
        floatingWindow.style.overflow = "hidden";
        floatingWindow.style.display = "flex";
        floatingWindow.style.flexDirection = "column";
        floatingWindow.style.transition = "max-height .3s linear";
        floatingWindow.style.outline = "none"; // Remove default outline

        // Apply Gaussian blur to the background content and disable scroll
        let style = document.createElement("style");
        style.innerHTML = `
            .blur-background {
                backdrop-filter: blur(30px);
            }
            .no-scroll {
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);

        // Create the header
        let header = document.createElement("div");
        header.style.width = "100%";
        header.style.backgroundColor = "#f1627f";
        header.style.color = "white";
        header.style.textAlign = "center";
        header.style.height = "50px";
        header.style.lineHeight = "50px";
        header.style.padding = "0";
        header.style.boxSizing = "border-box";
        header.style.cursor = "pointer";
        header.style.fontWeight = "bold";
        header.style.outline = "none"; // Remove default outline
        header.textContent = "🎓 MY COURSES";

        floatingWindow.appendChild(header);

        let courseListContainer = document.createElement("div");
        courseListContainer.style.flex = "1";
        courseListContainer.style.overflowY = "auto";
        courseListContainer.style.backgroundColor = "transparent";
        courseListContainer.style.display = "block"; // Initially set to block
        courseListContainer.setAttribute("id", "simpleList");
        courseListContainer.style.border = "0px transparent";
        courseListContainer.classList.add("list-group");
        courseListContainer.style.outline = "none"; // Remove default outline

        floatingWindow.appendChild(courseListContainer);

        document.body.appendChild(floatingWindow);

        floatingWindow.onmouseover = function() {
            floatingWindow.style.maxHeight = "400px";
            document.body.classList.add("blur-background");
            document.body.classList.add("no-scroll");
        };

        floatingWindow.onmouseout = function() {
            floatingWindow.style.maxHeight = "50px";
            document.body.classList.remove("blur-background");
            document.body.classList.remove("no-scroll");
        };



        return courseListContainer;
    }

    // Function to append courses to the container
    function appendCourses(container, courses) {
        for (const course of courses) {
            let courseDiv = document.createElement("div");
            courseDiv.style.width = "100%";
            courseDiv.style.padding = "10px";
            courseDiv.style.boxSizing = "border-box";
            courseDiv.style.backgroundColor = "transparent";
            courseDiv.style.border = ".5px solid rgba(218,20,60,.2)";
            courseDiv.classList.add("list-group-item");
            courseDiv.setAttribute("data-id", course.id);
            courseDiv.style.outline = "none"; // Remove default outline

            let courseLink = document.createElement("a");
            courseLink.href = course.viewurl;
            courseLink.textContent = course.shortname;
            courseLink.style.color = "#ed3c60";
            courseLink.style.textDecoration = "none";
            courseLink.style.outline = "none"; // Remove default outline

            // Bold the current course
            if (window.location.href.includes(course.id)) {
                courseLink.style.fontWeight = "bold";
            }

            // Set click listener to store interaction in local storage
            courseLink.addEventListener('click', function() {
                localStorage.setItem('moodleMenuExpanded', 'true');
            });

            courseDiv.appendChild(courseLink);
            container.appendChild(courseDiv);
        }
    }

    // Function to fetch courses
    function fetchCourses() {
        let requestDetails = {
            method: "POST",
            url: "https://wattlecourses.anu.edu.au/lib/ajax/service.php?sesskey="+M.cfg.sesskey+"&info=core_course_get_enrolled_courses_by_timeline_classification",
            data: "[{\"index\":0,\"methodname\":\"core_course_get_enrolled_courses_by_timeline_classification\",\"args\":{\"offset\":0,\"limit\":0,\"classification\":\"inprogress\",\"sort\":\"shortname\",\"customfieldname\":\"\",\"customfieldvalue\":\"\"}}]",
            headers: {
                "Content-Type": "application/json"
            },
            responseType: 'json',
            onload: function (response) {
                let json = JSON.parse(response.responseText)[0];
                let jsonCourses = json.data.courses;

                if (json.error === false) {
                    let expanded = localStorage.getItem('moodleMenuExpanded') === 'true';
                    let courseListContainer = createFloatingWindow(expanded); // Default to collapsed unless expanded by interaction
                    appendCourses(courseListContainer, jsonCourses);

                    // Clear the flag after expanding
                    if (expanded) {
                        localStorage.removeItem('moodleMenuExpanded');
                    }
                }
            },
        };
        GM_xmlhttpRequest(requestDetails);
    }

    // Initialization function
    function init() {
        console.log("Load Moodle Floating Course Window");
        fetchCourses();
    }

    init();
})();
