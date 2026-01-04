// ==UserScript==
// @name         Culearn Cleanup
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make culearn cleaner
// @author       Ehren Julien-Neitzert
// @match        https://culearn.carleton.ca/moodle/my/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36621/Culearn%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/36621/Culearn%20Cleanup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('block-region-side-pre').remove();
    document.getElementById('block-region-side-post').remove();
    document.getElementById('inst1061014').remove();
    document.getElementById('page-header').remove();

    var courses = document.getElementsByClassName('category_label');
    for (let c = 1; c < courses.length; c++) { //close all the class views except the first one
        courses[c].click();
    }

    var currentCourses = document.getElementsByClassName('courses')[0].childNodes; //the classes from the current semester
    //var courseName = /] (.+? \([A-Z]{3}\))/ //regex to find course names
    var courseName = /([A-Z]+?\d+?\w+?) /; //regex to find course names
    for (let c = 0; c < currentCourses.length; c++) {
        var link = currentCourses[c].getElementsByTagName('a')[0];
        var linkText = link.innerText;
        link.innerText = linkText.match(courseName)[1]; //change link text to just the course name
    }
})();