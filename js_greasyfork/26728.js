// ==UserScript==
// @name         NEFU-KEO-16-courses
// @namespace    Kenya-West
// @version      0.5
// @description  Этот скрипт скрывает лишние курсы в дашборде Moodle СВФУ
// @author       Kenya-West
// @include      *yagu.s-vfu.ru/my*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/26728/NEFU-KEO-16-courses.user.js
// @updateURL https://update.greasyfork.org/scripts/26728/NEFU-KEO-16-courses.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var course_ids = [
        "course-7991"
    ];
    //Find all the courses
    var course_list = document.querySelectorAll(".course_list > div") || null;
    //Create elements and properities
    var my_courses_head = document.createElement("h2");
    my_courses_head.textContent = "Мои курсы:";
    var my_courses_container = "<div class='KEO16'><h2>Мои курсы:</h2>";
    var other_courses_head = document.createElement("h2");
    other_courses_head.textContent = "Другие курсы:";
    //Set URI
    var currentURI = document.URL;

    //Find "My courses"
    var my_courses = [];
    var other_courses = [];

    for (var i = 0; i < course_list.length; i++) {
        for (var j = 0; j < course_ids.length; j++) {
            if (course_list[i].id == course_ids[j]) {
                console.log(course_list[i].id + " and " + course_ids[j] + " at " + j);
                my_courses.push(course_list[i]); // push the course
                my_courses_container = my_courses_container + "<div class='box coursebox'>" + course_list[i].innerHTML + "</div>";
                break;
            }
        }
    }

    //Add found courses to a html container
    my_courses_container = my_courses_container + "</div>";
    my_courses_container = document.createRange().createContextualFragment(my_courses_container);

    if (course_list != null && course_list != undefined) {
        document.querySelector(".course_list").insertBefore(my_courses_container, course_list[0]);
        document.querySelector(".course_list").insertBefore(other_courses_head, course_list[0]);
    }

    //Styling
    document.querySelector(".KEO16").setAttribute("style", "background-color: #f9e8ed");
})();