// ==UserScript==
// @name         Moodle Class Hider
// @namespace    http://cryosis.co/
// @version      0.1
// @description  Removes classes that are not needed in moodle
// @author       Cryosis
// @match        *.moodle.weltec.ac.nz/my/*
// @downloadURL https://update.greasyfork.org/scripts/387549/Moodle%20Class%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/387549/Moodle%20Class%20Hider.meta.js
// ==/UserScript==

// Add the course code (or any substring) of the classes you want to hide
const CLASSES = [
    'IT: General Information',
    'IT7358',
    'IT7359',
    'IT6280',
    'IT6256',
    'IT6253',
    'IT6221',
    'Mai -- Communication',
];

$(window).load(function () {
    let courseList = $('.course_list');
    CLASSES.forEach(className => {
        $(courseList).children().has(`[title*="${className}"]`).remove()
    });
})