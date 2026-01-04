// ==UserScript==
// @name         GPA meter
// @namespace    https://greasyfork.org/en/users/674736-jatin-sharma
// @description  A user script to show GPA on aims page
// @include      https://aims.iith.ac.in/aims/courseReg/myCrsHistoryPage*
// @author       Jatin Sharma (jatin.earth+greasyfork@gmail.com)
// @version      0.4
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410907/GPA%20meter.user.js
// @updateURL https://update.greasyfork.org/scripts/410907/GPA%20meter.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/* global $ */

(function () {
    'use strict';

    let exclude_list = [
        'Minor Core',
        'Honors Core',
        'Honours project',
        'Honours coursework',
        'FCC',
        'Additional',
        'Audit',
    ];

    const grade_values = {
        'A+': 10,
        'A' : 10,
        'A-': 9,
        'B' : 8,
        'B-': 7,
        'C' : 6,
        'C-': 5,
        'D' : 4,
        'FR': 0,
        'FS': 0
    };
    // console.log('Student ID: ', studentId);

    let append_checkbox = (parent, is_checked) => {
        parent.append('<input style="float:right" class="cgpa-cal-check" type="checkbox" ' + (is_checked ? 'checked' : '') + ' />');
    };

    let add_checkboxes = () => {
        let courses_checked = new Set();
        $(".cgpa-cal-check").remove();
        let elems = $(".hierarchyLi.dataLi").not(".hierarchyHdr, .hierarchySubHdr");
        elems.each((i, el) => {
            let course_id = el.children[0].textContent.trim();
            let type = el.children[4].textContent.trim();
            let grade = el.children[7].textContent.trim();
            let is_checked = !(courses_checked.has(course_id) || exclude_list.includes(type) || grade == "" || grade == "I");
            if (is_checked) courses_checked.add(course_id);
            append_checkbox($(el.children[0]), is_checked);
        });
    }

    let add_courseCategoryDropdown = () => {
        let courseCategoryDropDown = `
        <select class="catSel" style="width: auto; background: aliceblue; border-radius: 5px">
            <option value="Additional">Additional</option>
            <option value="Audit">Audit</option>
            <option value="Liberal Arts Elective">Liberal Arts Elective</option>
            <option value="Departmental Core Laboratory">Departmental Core Laboratory</option>
            <option value="Departmental Elective">Departmental Elective</option>
            <option value="Departmental Core Theory">Departmental Core Theory</option>
            <option value="Basic Sciences">Basic Sciences</option>
            <option value="Professional Ethics">Professional Ethics</option>
            <option value="Seminar">Seminar</option>
            <option value="Thesis">Thesis</option>
            <option value="Basic Engineering Skills">Basic Engineering Skills</option>
            <option value="Free Elective">Free Elective</option>
            <option value="FCC">FCC</option>
            <option value="Creative Arts">Creative Arts</option>
        </select>`;

        let elems = $(".hierarchyLi.dataLi").not(".hierarchyHdr, .hierarchySubHdr").children('.col5');
        $('.col5').css({ "width": "220px" });
        $('.col1').css({ "width": "75px" });
        $('.col4').css({ "width": "80px" });
        elems.each((i, el) => {
            let origCategory = el.innerText.trim();
            el.dataset.origCategory = origCategory;
            el.innerHTML = '';
            el.insertAdjacentHTML('afterbegin', courseCategoryDropDown);
            $(el.children[0]).val(origCategory).change();
        });
        $('.catSel').on('change', (e) => {
            let origCategory = e.target.parentElement.dataset.origCategory;
            if (e.target.value === origCategory) {
                e.target.style.backgroundColor = "aliceblue";
                e.target.removeAttribute('title');
            } else {
                e.target.style.backgroundColor = "mistyrose";
                e.target.title = `Orig: ${origCategory}`;
            }

        });
        $('.catSel').tooltip();
        $('.catSel').tooltip('option', 'track', true);
        $('#courseHistoryUI .col8').attr('contenteditable','true');
    };


    let show_total_gpa = () => {
        $('#gpa_button').val('Calculating');
        $('#gpa_bar').remove();
        let cg_total_grades = 0;
        let cg_total_credits = 0;
        let total_credits = 0;

        if ($(".cgpa-cal-check").length == 0) {
            add_checkboxes();
            add_courseCategoryDropdown();
        }
        let elems = $('.cgpa-cal-check:checked').parent().parent()

        let categoryMap = {
            'Departmental Core Theory': 0,
            'Departmental Elective': 0,
            'Free Elective': 0,
            'Liberal Arts Elective': 0,
            'Creative Arts': 0,
            'Basic Sciences': 0,
            'Basic Engineering Skills': 0,
            'Additional': 0
        };


        let deptMap = {};

        elems.each((i, el) => {
            let type = el.children[4].children[0].value;

            let course_id = el.children[0].textContent.trim();
            let grade = el.children[7].textContent.trim();
            let credits = Number(el.children[2].textContent.trim());
            total_credits += credits;
            categoryMap[type] = credits + (categoryMap[type] || 0);

            let deptId = course_id.slice(0, 2);
            deptMap[deptId] = credits + (deptMap[deptId] || 0);

            if (grade in grade_values) {
                grade = grade_values[grade];
                cg_total_grades += credits * grade;
                cg_total_credits += credits;
            }
        });
        let gpa = (cg_total_grades / cg_total_credits).toFixed(2);

        console.log(categoryMap);
        console.log(deptMap);

        let generateRow = (title, val) => `<li class="hierarchyLi">
            <span class="" style="margin-left: 100px; width:300px">${title}</span>
            <span class="" style="margin-left: 400px;">${val}</span>
        </li>`;

        $('#gpa_button').val('Show Gpa');
        $('#courseHistoryUI').before(
            `<ul id="gpa_bar" class="subCnt">
                <li class="hierarchyLi hierarchyHdr changeHdrCls">TOTAL GPA</li>
                ${generateRow('Total GPA of graded courses', gpa)}
                ${Object.entries(categoryMap).map((entry) => generateRow(entry[0], entry[1])).join('\n')}
                ${generateRow('Total credits', total_credits)}
            </ul>`);
    }

    let get_course_changes_csv = () => `Course Code,Course Name,Credits,From Course Type,To Course Type,Semester\n`+
                $('.catSel')
                .filter( (i, el) => el.value !== el.parentElement.dataset.origCategory )
                .map((i, el) => ``+
                    `${el.parentElement.parentElement.children[0].textContent.trim()},`+
                    `${el.parentElement.parentElement.children[1].textContent.trim()},`+
                    `${Number(el.parentElement.parentElement.children[2].textContent.trim())},`+
                    `${el.parentElement.dataset.origCategory},`+
                    `${el.value},`+
                    `${el.parentElement.parentElement.parentElement.children[0].children[0].textContent.trim()}`)
                .get().reverse().join('\n');

    $("#studentCourseSearch").before(
        `<input id="getcoursechanges_button" class="btn" title="Copy CSV of Course Type Changes to clipboard"`+
        `value="Copy Changes" style="padding: 5px 7px; margin-right:10px;" type="button"></input>`
    );
    $('#getcoursechanges_button').click(() => {
        let text = get_course_changes_csv();
        console.log(text);
        navigator.clipboard.writeText(text).then(function() {
            console.log('CSV Copied to clipboard');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
            alert('Could not copy to clipboard. Please find the CSV in your browser console');
        });
    });


    $("#studentCourseSearch").before(
        '<input id="gpa_button" class="btn" value="Show Gpa" style="padding: 5px 7px; margin-right:10px;" type="button"></input>'
    );
    $('#gpa_button').click(show_total_gpa);
//    console.log('All assets are loaded')
})();
