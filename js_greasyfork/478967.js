// ==UserScript==
// @name         UoM Blackboard: Highlight current modules
// @namespace    http://tampermonkey.net/
// @version      20240122.00.00
// @description  An optional accompanying script for https://github.com/adil192/BlackboardTheme, which highlights current modules on the Blackboard homepage by greying out old modules.
// @author       adil192
// @match        https://online.manchester.ac.uk/webapps/portal/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manchester.ac.uk
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/478967/UoM%20Blackboard%3A%20Highlight%20current%20modules.user.js
// @updateURL https://update.greasyfork.org/scripts/478967/UoM%20Blackboard%3A%20Highlight%20current%20modules.meta.js
// ==/UserScript==

// @ts-check

/** @type {HTMLDivElement | null} */
let currentCoursesDiv;
/** @type {HTMLDivElement | null} */
let formerCoursesDiv;

/**
 * Returns a promise that resolves after `ms` milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function timeoutPromise(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

/**
 * Returns a promise that resolves when `coursesDivs` are found.
 * @returns {Promise<void>}
 */
async function findCoursesDivs() {
    while (!currentCoursesDiv || !formerCoursesDiv) {
        currentCoursesDiv = document.querySelector("#CurrentCourses");
        formerCoursesDiv = document.querySelector("#FormerCourses");
        if (!currentCoursesDiv || !formerCoursesDiv) {
            await timeoutPromise(500);
        }
    }
    console.log('highlight_current_modules: found courses divs:', {currentCoursesDiv, formerCoursesDiv});
}

/**
 * Greys out courses that are in the first semester if we are in the second semester.
 * @param {HTMLDivElement | null} coursesDiv
 */
function greyOutOldCourses(coursesDiv) {
    const courses = coursesDiv?.querySelectorAll("ul.listElement > li");
    if (!courses || !courses.length) {
        console.log("greyOutOldCourses: No courses found.");
        return;
    }

    let firstSemesterCourses = [];
    let secondSemesterCourses = [];
    courses.forEach((course) => {
        const anchor = course.querySelector("a");
        if (!anchor) return;
        const courseName = anchor.innerText;
        if (courseName.includes("1st Semester")) {
            firstSemesterCourses.push(course);
        } else if (courseName.includes("2nd Semester")) {
            secondSemesterCourses.push(course);
        }
    });

    console.log(`greyOutOldCourses: Found ${firstSemesterCourses.length} first semester courses and ${secondSemesterCourses.length} second semester courses.`);

    if (firstSemesterCourses.length && secondSemesterCourses.length) {
        // If we have courses in both semesters, we must be in the second semester.
        // Grey out the first semester courses.
        firstSemesterCourses.forEach((course) => {
            course.classList.add("secondary");
        });
    }
}

(function () {
    'use strict';

    console.log("UoM Blackboard: Highlight current modules");
    findCoursesDivs().then(() => {
        greyOutOldCourses(currentCoursesDiv);
        greyOutOldCourses(formerCoursesDiv);

        currentCoursesDiv?.addEventListener("DOMSubtreeModified", () => {
            greyOutOldCourses(currentCoursesDiv);
        }, { passive: true });
        formerCoursesDiv?.addEventListener("DOMSubtreeModified", () => {
            greyOutOldCourses(formerCoursesDiv);
        }, { passive: true });
    });
})();
