// ==UserScript==
// @name         VUT FIT Course Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  VUT FIT exams schedule course filter
// @author       Martet
// @license      MIT
// @match        https://rozvrhy.fit.vut.cz/*/zkousky/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vut.cz
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/484399/VUT%20FIT%20Course%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/484399/VUT%20FIT%20Course%20Filter.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const style_element = document.createElement('style');
    style_element.innerHTML = `
        .filter-popup {
            position: absolute;
            top: 80%;
            left: 65%;
            max-height: 300px;
            overflow-y: auto;
            overflow-x: hidden;
            background-color: white;
            z-index: 1;
            border: 1px solid #888888;
        }

        .filter-popup tr:first-child td {
            border-top: none;
        }

        .filter-popup tr:last-child td {
            border-bottom: none;
        }

        .filter-popup tr td:first-child {
            border-left: none!important;
        }

        .filter-popup tr td:last-child {
            border-right: none!important;
        }

        .filter-hide, .course-hide {
            display: none;
        }

        .fas.fa-filter {
            margin-left: 5px;
        }
    `;
    document.getElementsByTagName('head')[0].appendChild(style_element);

    // Ensure updated list of displayed courses in window object
    const sort_script = document.querySelector('body > script');
    if(sort_script){
        // sortColumn destroys and replaces elements, must update our list
        sort_script.innerHTML = sort_script.innerHTML.replace(`sortColumn(index);`, `sortColumn(index); updateCourses();`);
    }
    unsafeWindow.updateCourses = () => {
        const rows = Array.from(document.getElementsByTagName('tr')).slice(1);
        unsafeWindow.courses = {};
        for(let i = 0; i < rows.length; i++){
            try{
                unsafeWindow.courses[rows[i].firstChild.firstChild.firstChild.textContent] = rows[i];
            }catch(e){}
        }
    };
    unsafeWindow.updateCourses();

    // Toggle course visibility and persistently save state on checkbox change
    // Function needs to be exported to make it accessible outside protected sandbox on Firefox
    unsafeWindow.filterCourse = exportFunction((course, checked) => {
        if(checked){
            GM.setValue(course, false);
            unsafeWindow.courses[course].classList.remove('course-hide');
        }else{
            GM.setValue(course, true);
            unsafeWindow.courses[course].classList.add('course-hide');
        }
    }, unsafeWindow);

    // Create filter popup element
    const course_header = document.getElementsByTagName('th')[0];
    const filter_box = document.createElement('div');
    filter_box.classList.add('filter-popup', 'filter-hide');
    // Set explicit position for non-sortable table header so popup can stick to it
    if(document.getElementById('exams') === null){
        course_header.style.position = 'relative';
    }
    filter_box.onclick = e => e.stopPropagation();
    course_header.appendChild(filter_box);

    // Create clickable filter icon
    const filter_element = document.createElement('i');
    filter_element.classList.add('fas', 'fa-filter');
    filter_element.onclick = e => {
        filter_box.classList.toggle('filter-hide');
        e.stopPropagation();
    };
    course_header.appendChild(filter_element);

    // Create filter popup content
    let filter_content = `
        <table><tr><td><label for="check-all">Vybrat vše</label></td>
        <td><input id="check-all" type="checkbox" onchange="
            for(const box of document.getElementsByClassName('filter-checkbox')){
                box.checked = this.checked;
                filterCourse(box.id.substring(9), this.checked);
            }"
        checked>
        </td></tr>
    `;
    for(const course in unsafeWindow.courses){
        const filtered = await GM.getValue(course);
        filter_content += `
            <tr><td><label for="checkbox-${course}">${course}</label></td>
            <td><input class="filter-checkbox" id="checkbox-${course}" type="checkbox"
                 onchange="filterCourse('${course}', this.checked)" ${filtered ? "" : "checked"}>
            </td></tr>
        `;
        if(filtered){
            unsafeWindow.courses[course].classList.add('course-hide');
        }
    }
    filter_box.innerHTML = filter_content + '</table>';

    // Uncheck check all checkbox when all filters unchecked
    if(Array.from(document.getElementsByClassName('filter-checkbox')).every(e => !e.checked)){
        document.getElementById('check-all').checked = false;
    }

    // Hide filter popup on click elsewhere
    window.addEventListener('mouseup', e => {
        if(!filter_box.classList.contains('filter-hide') &&
           !e.target.closest(".filter-popup") && !e.target.closest(".fas.fa-filter")){
            filter_box.classList.add('filter-hide');
        }
    });
})();