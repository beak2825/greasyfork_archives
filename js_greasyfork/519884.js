// ==UserScript==
// @name         GPA Calculator for Veracross
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Calculate GPA from course grades in Veracross
// @match        https://portals.veracross.com/salisbury/student/student/overview
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519884/GPA%20Calculator%20for%20Veracross.user.js
// @updateURL https://update.greasyfork.org/scripts/519884/GPA%20Calculator%20for%20Veracross.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const gradeToGPA = (grade, courseType) => {
        let gpa = 0;

        if (courseType === "academic") {
            switch (true) {
                case (grade >= 97):
                    gpa = 4.3;
                    break;
                case (grade >= 93):
                    gpa = 4.0;
                    break;
                case (grade >= 90):
                    gpa = 3.7;
                    break;
                case (grade >= 87):
                    gpa = 3.3;
                    break;
                case (grade >= 83):
                    gpa = 3.0;
                    break;
                case (grade >= 80):
                    gpa = 2.7;
                    break;
                case (grade >= 77):
                    gpa = 2.3;
                    break;
                case (grade >= 73):
                    gpa = 2.0;
                    break;
                case (grade >= 70):
                    gpa = 1.7;
                    break;
                case (grade >= 67):
                    gpa = 1.3;
                    break;
                case (grade >= 63):
                    gpa = 1.0;
                    break;
                case (grade >= 60):
                    gpa = 0.7;
                    break;
                default:
                    gpa = 0.0;
                    break;
            }
        }

        return gpa;
    };

    const calculateGPA = () => {
        let totalGPA = 0;
        let totalCourses = 0;

        const courseItems = document.querySelectorAll('li.vx-list__item.course-list-item');

        courseItems.forEach(item => {
            const courseName = item.querySelector('.course-list-class a') ? item.querySelector('.course-list-class a').textContent.trim() : 'Unknown Course';
            const gradeText = item.querySelector('.course-numeric-grade') ? item.querySelector('.course-numeric-grade').textContent.trim() : '';

            if (gradeText && gradeText !== '0.0%') {
                const grade = parseFloat(gradeText.replace('%', '').trim());

                if (!isNaN(grade)) {
                    const courseType = item.querySelector('.vx-tag') ? item.querySelector('.vx-tag').textContent.trim() : 'academic';
                    const gpa = gradeToGPA(grade, courseType);
                    totalGPA += gpa;
                    totalCourses++;
                }
            }
        });

        if (totalCourses > 0) {
            const averageGPA = totalGPA / totalCourses;
            alert(`Your GPA is: ${averageGPA.toFixed(2)} based on ${totalCourses} courses.`);
        } else {
            alert('No valid grades found or unable to process grades.');
        }
    };

    const button = document.createElement('button');
    button.innerText = 'Calculate GPA';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.padding = '10px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = 9999;

    button.addEventListener('click', calculateGPA);
    document.body.appendChild(button);
})();
