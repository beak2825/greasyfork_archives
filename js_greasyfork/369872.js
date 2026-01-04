// ==UserScript==
// @name         Neptun PowerHigher!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Felturbózza a Neptun PowerUp!-ot
// @author       Dóka Balázs
// @match        https://frame.neptun.bme.hu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369872/Neptun%20PowerHigher%21.user.js
// @updateURL https://update.greasyfork.org/scripts/369872/Neptun%20PowerHigher%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let $ = s => document.querySelector(s);
    let $$ = s => document.querySelectorAll(s);
    let $_ = s => $(s) !== null;

    let $append = (e, s, t, c) => {
        let el = document.createElement(s);
        el.textContent = t;
        if(typeof c !== 'undefined') el.className = c;
        e.appendChild(el);
        return el;
    };

    let $remove = e => $(e).parentNode.removeChild($(e));
    let $update = (e, t) => {$(e).textContent = t;}
    let $text = e => $(e).textContent;

    let $_remove = e => { if($(e) !== null) $(e).parentNode.removeChild($(e)); };
    let $_update = (e, t) => { if($(e) !== null) $(e).textContent = t; };
    let $_text = e => { if($(e) !== null) $(e).textContent; };

    let courseCounter = 1;
    let courses = new Array(0);

    function countCourses() {
        return parseInt($text('.grid_RowCount').match(/.+-([0-9]+)\/.+/)[1]);
    };

    function iterateCourses() {
        for(let i = 0; i < countCourses(); i++)
            if($(`#tr__${i+1}`) !== null && $(`#tr__${i+1}`).style.display !== 'none' && $(`#tr__${i+1} td:nth-child(1)`).className === 'npu_choice_mark')
                courses.push({
                    name: $text(`#tr__${i+1} td:nth-child(2) span`),
                    element: $(`#tr__${i+1} td:nth-child(2) span`)
                });
    }
    function setButtonText() {
        $update('.nphNextCourse', `${courses[courseCounter-1].name} felvétele (${courseCounter} / ${courses.length})`);
    }

    function skipCourse() {
        if(courseCounter < courses.length) courseCounter++;
        setButtonText();
    }

    function backCourse() {
        if(courseCounter > 1) courseCounter--;
        setButtonText();
    }

    function nextCourse() {
        courses[courseCounter-1].element.onclick();

        let inter = window.setInterval(() => {
            if($_('.npu_course_choice_apply') && $_('.ui-dialog') && $('.ui-dialog').style.display != 'none') {
                $('.npu_course_choice_apply').click()
                skipCourse();
                window.clearInterval(inter);
            }
        }, 100);
    }



    function appendButtons() {
        courses = [];
        courseCounter = 1;

        $_remove('.nphCourseContainer');

        let topbar = $("#h_addsubjects_gridSubjects_gridmaindiv > table.grid_pagertable > tbody > tr > td.grid_pagerpanel > table > tbody > tr");
        let container = $append(topbar, 'span', "", 'nphCourseContainer');
        $append(container, 'button', `Nincs tárolt kurzus`, 'nphNextCourse');
        $append(container, 'button', `<`, 'nphBackCourse');
        $append(container, 'button', `>`, 'nphSkipCourse');
        $('.nphSkipCourse').onclick = skipCourse;
        $('.nphBackCourse').onclick = backCourse;
        $('.nphNextCourse').onclick = nextCourse;
        iterateCourses();
        setButtonText();
    }

    function watcher() {
        window.setInterval(() => {
            if($('.npu_choice_mark') !== null && $('table.grid_pagertable') !== null && $('.nphCourseContainer') === null) {
                appendButtons();
            }
        });
    }

    // Redirect from main page to courses
    if(document.location == "https://frame.neptun.bme.hu/hallgatoi/main.aspx") {
        window.location.replace("https://frame.neptun.bme.hu/hallgatoi/main.aspx?ctrl=0303&ismenuclick=true");
    }

    // Add extra buttons
    if(
        document.location == "https://frame.neptun.bme.hu/hallgatoi/main.aspx?ctrl=0303&ismenuclick=true" ||
        document.location == "https://frame.neptun.bme.hu/hallgatoi/main.aspx?ctrl=0303"
    )
    {
        if($_('#npuStatus'))
            return alert('A Neptun PowerHigher! csak akkor működik, ha a Neptun PowerUp! is fel van telepítve!');

        $('input[type=radio]').addEventListener('change', () => appendButtons);
        let inter = window.setInterval(() => {
            if($('.npu_choice_mark') !== null) {
                appendButtons();
                watcher();
                window.clearInterval(inter);
            }
        }, 100);
    }
})();