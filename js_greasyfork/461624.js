// ==UserScript==
// @name         IU Available Courses Grabber
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  A script to get the information of classes on IU system
// @author       You
// @include https://eduportal.iu.edu.sa/iu/ui/student/homeIndex.faces
// @include https://eduportal.iu.edu.sa/iu/ui/student/*/*/*
// @include http://eduportal.iu.edu.sa/iu/ui/student/*
// @include https://eduportal.iu.edu.sa/iu/ui/student/student_schedule/index/studentScheduleIndex.faces
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.sa
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// @license Mozilla Public License 2.0 
// @downloadURL https://update.greasyfork.org/scripts/461624/IU%20Available%20Courses%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/461624/IU%20Available%20Courses%20Grabber.meta.js
// ==/UserScript==
/* globals $, GM_config */

(function() {
    'use strict';
    var rows = document.getElementById("myForm:offeredCoursesTable").getElementsByTagName("tbody")[0];
    var sections = [];
    for (var course of rows.getElementsByTagName("tr")) {
        var section_items = course.children;
        var section_course = section_items.item(1).innerText;
        var section_number = section_items.item(2).innerText;
        var section_type = section_items.item(3).innerText; // "نظري او عملي"
        var section_credit = section_items.item(4).innerText;
        var section_availability = section_items.item(5).firstChild.innerText; // "مفتوحة او مغلقة"
        var section_details = section_items.item(6).firstChild.children; // inside an anchor element
        var section_instructor = section_details.item(0).value;
        var section_times = section_details.item(1).value;
        var section = {section_number:section_number, section_course:section_course, section_type:section_type, section_credit:section_credit,
                       section_availability:section_availability, section_times:section_times, section_instructor:section_instructor}
        sections.push(section);
    }
    const string = JSON.stringify(sections);
    console.log(string);
})();