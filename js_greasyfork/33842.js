// ==UserScript==
// @name         CS UBB Timetable Fixer
// @namespace    http://tampermonkey.net/
// @version      2.3.6
// @description  A userscript that enhances the tabelar timetables for CS UBB students.
// @author       myklosbotond
// @match        http*://www.cs.ubbcluj.ro/files/orar/*/tabelar/*.html
// @exclude      http*://www.cs.ubbcluj.ro/files/orar/*/tabelar/index.html
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @resource     bootstrap_CSS https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css
// @resource     jqUI_CSS https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/33842/CS%20UBB%20Timetable%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/33842/CS%20UBB%20Timetable%20Fixer.meta.js
// ==/UserScript==

/*
 * jshint esversion: 6
 * jshint esnext: true
*/

const DEVELOPEMENT = false;
const URGENT_TODO = ['Custom add own entry'];
const TODO = ['List grouped by discipline'];

var defaultHTML;
var options;
var disciplines = [];
var idList = new Set();
var customError = false;

var customListScroll = 0;

const days = ["Luni", "Marti", "Miercuri", "Joi", "Vineri"];

const disciplineColumn = "disciplina";

(function () {
    'use strict';

    loadOptions();
    setupCss();
    setupFunctions();

    structureHTML();
    injectSettingHTML();

    getDisciplinesList();

    setEventHandlers();
    updateSettingsUi();

    runFixer();
})();

//color in just the curs / laboratory column on unselected

function setupCss() {
    'use strict';

    let jqUI_CssSrc = GM_getResourceText("jqUI_CSS");
    jqUI_CssSrc = jqUI_CssSrc.replace(/url\(['"]images\/ui\-bg_.*00\.png['"]\)/g, "");
    jqUI_CssSrc = jqUI_CssSrc.replace(/url\(['"]images\/ui\-icons_.*\.png['"]\)/g, "");

    GM_addStyle(jqUI_CssSrc);

    let bootstrap_Css = GM_getResourceText("bootstrap_CSS");
    GM_addStyle(bootstrap_Css);

    //Insert the styles from the css:
    GM_addStyle(`
        #urgent-todo {
            background: #e29797;
        }
        
        #todo {
            background: #fde6ce;
        }
        
        .todo-wrapper {
            margin: 10px 0 -10px
        }
        
        .todo-wrapper ul {
            text-align: left;
            display: inline-block;
            margin: 0;
        }
        
        body {
            margin: 0;
        }
        
        #settings-wrapper {
            background: #f5f9fb;
            padding-bottom: 10px;
        }
        
        #settings-container {
            position: relative;
        }
        
        #toggle-settings {
            position: absolute;
            right: 1%;
            top: 12px;
        }
        
        #tables-wrapper {
            margin-bottom: 20px;
        }
        
        .curs-tr {
            background: #fffedd;
        }
        
        .curs-tr td a {
            color: #c16b00;
        }
        
        .seminar-tr {
            background: #ddf2ff;
        }
        
        .seminar-tr td a {
            color: #0e62a5;
        }
        
        .labor-tr {
            background: #e4ffdd;
        }
        
        .labor-tr td a {
            color: #009688;
        }
        
        .error {
            color: red;
        }
        
        .last-of-day-tr {
            border-bottom: 2px solid
        }
        
        a:hover,
        a:hover font {
            background-color: transparent;
            text-decoration: underline
        }
        
        .other-week-tr {
            filter: grayscale(100%);
        }
        
        .other-week-tr td {
            background: transparent
        }
        
        .other-week-tr:hover {
            filter: grayscale(0%);
        }
        
        .meh-tr {
            opacity: 0.3;
            filter: grayscale(100%);
        }
        
        .meh-tr td {
            background: transparent
        }
        
        .meh-tr:hover {
            opacity: 0.7
        }
        
        .nope-tr {
            background: transparent
        }
        
        .nope-tr td {
            background: transparent
        }
        
        .nope-tr a {
            color: #003399
        }
        
        .hide-tr {
            display: none;
        }
        
        #offset-label {
            margin-top: 0px;
            margin-bottom: 0;
            padding-bottom: 7px;
            padding-top: 8px;
        }
        
        .ui-selectmenu-button.ui-button {
            width: auto
        }
        
        .ui-front:not(.ui-widget-overlay):not(.ui-selectmenu-open) {
            z-index: 100 !important;
        }
        
        .ui-selectmenu-open {
            z-index: 9999 !important;
        }
        
        .ui-selectmenu-icon.ui-icon {
            float: right;
            margin-top: 8px;
            border-style: solid;
            border-width: 3px 3px 0 3px;
            border-color: #0f0f0d transparent transparent transparent;
            width: 0;
            height: 0;
        }
        
        span.ui-button-icon.ui-icon.ui-icon-closethick {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg\" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>');
            background-position: center;
            background-size: 50%;
        }
        
        #hider-list-wrapper {
            max-height: 300px;
            overflow: auto;
            margin-bottom: 9px;
        }
        
        #renamer-list-wrapper {
            max-height: 330px;
            overflow: auto;
            margin-bottom: 9px;
        }
        
        #visibility-dialog .row {
            margin-bottom: 2px;
        }
        
        #visibility-dialog label {
            line-height: 30px;
        }
        
        #visibility-dialog .ui-selectmenu-button {
            width: 100%;
        }
        
        #hider-dialog table {
            width: 100%;
        }
        
        #hider-dialog .check-column {
            width: 1px;
        }
        
        .option-wrapper {
            display: inline-block;
            margin-top: 7px;
        }
        
        .finder-options-wrapper {
            margin-left: 91px;
        }
        
        #finder-result,
        #finder-time-result {
            margin: 10px auto 0 auto;
        }
        
        #import-status {
            color: red;
            font-weight: bold;
        }
        
        .beta-button::after {
            content: "BETA";
            font-size: 10px;
            vertical-align: super;
            color: white;
            background: darkred;
            font-weight: bold;
            padding: 0 3px;
            border-radius: 3px;
            margin-left: 3px;
        }
        
        /* ================ Custom ============== */
        
        #customize-dialog {
            overflow: hidden;
        }
        
        #customize-dialog h3 {
            text-align: center;
        }
        
        #custom-empty-view {
            text-align: center;
        }
        
        #custom-selected-wrapper,
        #custom-list-wrapper {
            vertical-align: top;
            display: inline-block;
            max-width: 355px;
        }
        
        #custom-selected-wrapper .scroller,
        #custom-list-wrapper .scroller {
            max-height: 500px;
            overflow: auto;
        }
        
        #custom-controls {
            display: inline-block;
            vertical-align: top;
            margin: 100px 10px 0;
        }
        
        #custom-work-view .column-disciplina {
            max-width: 80px;
            overflow: hidden;
            white-space: nowrap;
        }
        
        #custom-work-view .column-cadrul-didactic {
            white-space: nowrap;
        }
        
        #custom-work-view .ui-selectee:not(.ui-selected) {
            background: none;
        }
        
        #custom-work-view .ui-selectee:not(.ui-selected) td {
            opacity: .8;
        }
        
        #custom-work-view .ui-selectee:not(.ui-selected) a {
            color: black;
        }
        
        #custom-work-view .ui-selected {
            font-weight: bold;
        }
        
        #custom-work-view .ui-selected tf {
            color: #313131;
        }
        
        #custom-work-view .matching:not(.ui-selected) td {
            text-decoration: underline;
        }
        
        #custom-work-view .matching .column-ziua {
            font-weight: bold;
        }
        
        #custom-work-view .curs-tr.ui-selectee td:not(:first-child):not(:nth-child(2)):not(:last-child) {
            background: #fffedd;
        }
        
        #custom-work-view .seminar-tr.ui-selectee td:not(:first-child):not(:nth-child(2)):not(:last-child) {
            background: #ddf2ff;
        }
        
        #custom-work-view .labor-tr.ui-selectee td:not(:first-child):not(:nth-child(2)):not(:last-child) {
            background: #e4ffdd;
        }
        
        .matched-table tr:not(.ui-selected):not(.matching) {
            filter: grayscale(100%);
        }
        
        /* ================ Icons =============== */
        
        .ui-icon-gear {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>');
            background-position: center;
            background-size: 100%;
        }
        
        .ui-icon-eye {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12.015 7c4.751 0 8.063 3.012 9.504 4.636-1.401 1.837-4.713 5.364-9.504 5.364-4.42 0-7.93-3.536-9.478-5.407 1.493-1.647 4.817-4.593 9.478-4.593zm0-2c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 3c-2.209 0-4 1.792-4 4 0 2.209 1.791 4 4 4s4-1.791 4-4c0-2.208-1.791-4-4-4z"/></svg>');
            background-position: center;
            background-size: 100%;
        }
        
        .ui-icon-hide {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19.604 2.562l-3.346 3.137c-1.27-.428-2.686-.699-4.243-.699-7.569 0-12.015 6.551-12.015 6.551s1.928 2.951 5.146 5.138l-2.911 2.909 1.414 1.414 17.37-17.035-1.415-1.415zm-6.016 5.779c-3.288-1.453-6.681 1.908-5.265 5.206l-1.726 1.707c-1.814-1.16-3.225-2.65-4.06-3.66 1.493-1.648 4.817-4.594 9.478-4.594.927 0 1.796.119 2.61.315l-1.037 1.026zm-2.883 7.431l5.09-4.993c1.017 3.111-2.003 6.067-5.09 4.993zm13.295-4.221s-4.252 7.449-11.985 7.449c-1.379 0-2.662-.291-3.851-.737l1.614-1.583c.715.193 1.458.32 2.237.32 4.791 0 8.104-3.527 9.504-5.364-.729-.822-1.956-1.99-3.587-2.952l1.489-1.46c2.982 1.9 4.579 4.327 4.579 4.327z"/></svg>');
            background-position: center;
            background-size: 100%;
        }
        
        .ui-icon-rename {
            background-image: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="m18.483 14.133h-1.462v-9h1.462v9z"/><path d="m12.525 6.6228h-10.542v6h10.542v1.51h-12.042v-9h12.042v1.49z"/><path d="m15.521 2.8728v13.5c0 0.414 0.335 0.75 0.75 0.75h1.5v1.5h-6v-1.5h1.504c0.415 0 0.75-0.336 0.75-0.75v-13.5c0-0.414-0.335-0.75-0.75-0.75h-1.504v-1.499h6v1.499h-1.5c-0.415 0-0.75 0.336-0.75 0.75"/></svg>');
            background-position: center;
            background-size: 100%;
        }
        
        .ui-icon-find {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21.172 24l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z"/></svg>');
            background-position: center;
            background-size: 100%;
        }
        
        .ui-icon-reset {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M17.026 22.957c10.957-11.421-2.326-20.865-10.384-13.309l2.464 2.352h-9.106v-8.947l2.232 2.229c14.794-13.203 31.51 7.051 14.794 17.675z"/></svg>');
            background-position: center;
            background-size: 100%;
        }
        
        .ui-icon-printer {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14 20h-6v-1h6v1zm10-15v13h-4v6h-16v-6h-4v-13h4v-5h16v5h4zm-6 10h-12v7h12v-7zm0-13h-12v3h12v-3zm4 5.5c0-.276-.224-.5-.5-.5s-.5.224-.5.5.224.5.5.5.5-.224.5-.5zm-6 9.5h-8v1h8v-1z"/></svg>');
            background-position: center;
            background-size: 100%;
        }
        
        .ui-icon-import {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 12l9-8v6h15v4h-15v6z"/></svg>');
            background-position: center;
            background-size: 100%;
        }
        
        .ui-icon-export {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 12l-9-8v6h-15v4h15v6z"/></svg>');
            background-position: center;
            background-size: 100%;
        }
        
        .ui-icon-customize {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14.078 4.232l-12.64 12.639-1.438 7.129 7.127-1.438 12.641-12.64-5.69-5.69zm-10.369 14.893l-.85-.85 11.141-11.125.849.849-11.14 11.126zm2.008 2.008l-.85-.85 11.141-11.125.85.85-11.141 11.125zm18.283-15.444l-2.816 2.818-5.691-5.691 2.816-2.816 5.691 5.689z"/></svg>');
            background-position: center;
            background-size: 100%;
        }
        
        /* =========== Printer styles =========== */
        
        @media print {
            #settings-wrapper,
            #toggle-settings {
                display: none;
            }
            #tables-wrapper table {
                page-break-after: always;
            }
        }
    `);

}


function initCustomTable() {
    const grp = $('#custom-group-select').val();
    const halfGrp = parseInt($('#custom-half-group-select').val(), 10);
    const otherHalf = 3 - halfGrp;
    const otherRegEx = new RegExp(`[0-9]+/${otherHalf}`);
    const table = $('.table-group-' + grp);

    table.find('tr:has(td)')
        .filter((_, row) => {
            const $row = $(row);
            const origDiscName = $row.find(`.column-${disciplineColumn}`).data("original");
            const formation = $row.find(`.column-formatia`).text();

            const halfOk = !otherRegEx.test(formation);

            return halfOk && !options.disciplinesToHide.includes(origDiscName)
        })
        .each(function () {
            let rowId = $(this).attr('data-id');
            if (rowId && rowId.length) {
                options.customTable.push(rowId);
            }
        });
}

function removeElement(array, element) {
    const dataIdx = array.indexOf(element);
    if (dataIdx >= 0) {
        array.splice(dataIdx, 1);
    }
}

function structureHTML() {
    'use strict';

    let html = $('center').html();
    $('center').html('<div id="tables-wrapper"></div>');
    let wrapper = $('#tables-wrapper');
    wrapper.html(html);

    wrapper
        .find('h1:first')
        .insertBefore(wrapper)
        .attr('id', 'title-heading');

    wrapper.find('table').each(function () {
        let columns = [];
        let grp = $(this).prev('h1').text().replace('Grupa ', '');

        $(this).addClass('table-group-' + grp);

        $(this).find('tr:first th').each(function () {
            columns.push($(this).text().replace(/\s/g, '-').toLowerCase());
        });

        for (let i = 0; i < columns.length; ++i) {
            $(this).find('td:nth-child(' + (i + 1) + ')').addClass('column-' + columns[i]);
        }
    });

    $('.column-' + disciplineColumn).each(function () {
        $(this).attr('data-original', $(this).text());
    });

    wrapper.find("tr:contains('Curs')").addClass("curs-tr");
    wrapper.find("tr:contains('Seminar')").addClass("seminar-tr");
    wrapper.find("tr:contains('Laborator')").addClass("labor-tr");

    wrapper.find('tr:has(td)').each(setRowId);

    defaultHTML = wrapper.html();
}

function setRowId() {
    let row = $(this);

    columns = row.getColumns();

    let day = columns.day.text();
    let hour = columns.hour.text();
    let freq = columns.frequency.text();
    let grp = columns.group.text();
    let disc = columns.discipline.attr('data-original');

    let id = '';
    let dayi = -1;

    switch (day.substr(0, 2)) {
        case 'Lu':
            dayi = 0;
            break;
        case 'Ma':
            dayi = 1;
            break;
        case 'Mi':
            dayi = 2;
            break;
        case 'Jo':
            dayi = 3;
            break;
        case 'Vi':
            dayi = 4;
            break;
    }

    id += dayi;

    let hr = hour.split('-')[0];
    if (hr.length < 2) {
        hr = '0' + hr;
    }
    id += hr;
    if (/sapt\.\s[0-9]/.test(freq)) {
        id += 's' + freq.replace('sapt. ', '');
    }
    else {
        id += 's0';
    }
    id += grp;
    id += disc.replace(/\s/g, '-');

    idList.add(id);
    row.attr("data-id", id);
}

/**
    * @returns {day, hour, frequency, room, group,
    * 
    *  type, discipline, teacher}
    */

function checkSwitch() {
    let sel = $('#custom-selected-table').find('.ui-selected');
    let rem = $('#custom-list-table').find('.ui-selected');

    let selColumns = sel.getColumns();
    let remColumns = rem.getColumns();

    if (sel.length === 1) {
        highlightMatching();
    }
    else {
        clearHighlights();
    }

    if (sel.length === 1 && rem.length === 1 &&
        selColumns.discipline.text() === remColumns.discipline.text() &&
        selColumns.type.text() === remColumns.type.text()) {
        $('#custom-switch').button('enable');
    }
    else {
        $('#custom-switch').button('disable');
    }
}

function highlightMatching() {
    let sel = $('#custom-selected-table')
        .find('.ui-selected').eq(0).getColumns();

    $('#custom-list-table').addClass('matched-table');

    $('#custom-list-table tr').each(function () {
        let cols = $(this).getColumns();
        if (sel.discipline.text() === cols.discipline.text() &&
            sel.type.text() === cols.type.text()) {
            $(this).addClass('matching');
        }
    });
}

function clearHighlights() {
    $('#custom-list-table').find('.matching').removeClass('matching');
    $('#custom-list-table').removeClass('matched-table');
}

function listifiy(arr) {
    html = '<ul>';
    for (let i = 0; i < arr.length; ++i) {
        html += '<li>' + arr[i] + '</li>';
    }
    return html + '</ul>';
}

function getDisciplinesList() {
    let discSet = new Set();
    $('.column-' + disciplineColumn).each(function () {
        discSet.add($(this).text());
    });

    disciplines = [...discSet];
}

function rememberScroll() {
    customListScroll = $('#custom-list-wrapper .scroller').scrollTop();
}

function findDiscipline() {
    let disc = $('#finder-select').val();
    let type = $('#finder-type').val();

    let result = $('#finder-result');
    result.html('');

    $('#tables-wrapper tr').each(function () {
        if ($(this).find('.column-tipul').text().toLowerCase() === type &&
            ($(this).find('.column-disciplina').text() === disc ||
                $(this).find('.column-disciplina').attr('data-original') === disc)) {

            cloneStripped($(this)).appendTo(result);
        }
    });

    let rows = $('#finder-result tr').get();
    rows.sort(function (a, b) {
        a = $(a);
        b = $(b);

        let aDay = a.find('.column-ziua').text();
        let bDay = b.find('.column-ziua').text();
        if (aDay === bDay) {
            let aHr = a.find('.column-orele').text().split('-')[0];
            aHr = parseInt(aHr, 10);
            let bHr = b.find('.column-orele').text().split('-')[0];
            bHr = parseInt(bHr, 10);

            return aHr - bHr;
        }
        else {
            aDay = days.indexOf(aDay);
            bDay = days.indexOf(bDay);
            return aDay - bDay;
        }
    });


    rows = rows.filter(function (value, index, self) {
        if (index + 1 < self.length) {
            let tr = $(value);
            let nextTr = $(self[index + 1]);
            return !equalTrs(tr, nextTr);
        }
        return true;
    });
    $('#finder-result').html(rows);

    addDayLines($('#finder-result'));
}

function equalTrs(a, b) {
    let aDay = a.find('.column-ziua').text();
    let aHr = a.find('.column-orele').text();
    let aFreq = a.find('.column-frecventa').text();
    let aSala = a.find('.column-sala').text();
    let aForm = a.find('.column-formatia').text();
    let aType = a.find('.column-tipul').text();
    let aDisc = a.find('.column-disciplina').text();
    let aTeacher = a.find('.column-cadrul-didactic').text();

    let bDay = b.find('.column-ziua').text();
    let bHr = b.find('.column-orele').text();
    let bFreq = b.find('.column-frecventa').text();
    let bSala = b.find('.column-sala').text();
    let bForm = b.find('.column-formatia').text();
    let bType = b.find('.column-tipul').text();
    let bDisc = b.find('.column-disciplina').text();
    let bTeacher = b.find('.column-cadrul-didactic').text();

    return aDay === bDay && aHr === bHr && aFreq === bFreq && aSala === bSala &&
        aForm === bForm && aType === bType && aDisc === bDisc && aTeacher === bTeacher;
}

function updateFinderHourSelect() {
    let hours = new Set();
    $('tr:contains(' + $('#finder-day').val() + ')').each(function () {
        hours.add($(this).find('.column-orele').text());
    });
    hours = [...hours].sort(function (a, b) {
        a = parseInt(a.split('-')[0], 10);
        b = parseInt(b.split('-')[0], 10);
        return a - b;
    });

    $('#finder-hour').html('');
    for (let i = 0; i < hours.length; ++i) {
        $('#finder-hour').append('<option value="' + hours[i] + '">' + hours[i] + '</option>');
    }
    $('#finder-hour').selectmenu('refresh');

    findDisciplineByTime();
}

function findDisciplineByTime() {
    let day = $('#finder-day').val();
    let hour = $('#finder-hour').val();
    let week = $('#finder-sapt').val();

    let result = $('#finder-time-result');
    result.html('');

    $('#tables-wrapper tr').each(function () {
        let weekString = $(this).find('.column-frecventa').text();
        if ($(this).find('.column-ziua').text().toLowerCase() === day.toLowerCase() &&
            $(this).find('.column-orele').text() === hour &&
            (week == "0" || weekString.replace(/\s/g, '') === '' || weekString === 'sapt. ' + week)) {
            $(this)
                .clone()
                .removeClass('meh-tr')
                .removeClass('other-week-tr')
                .removeClass('nope-tr')
                .removeClass('last-of-day-tr')
                .appendTo(result);
        }
    });

    let rows = $('#finder-time-result tr').get();
    rows.sort(function (a, b) {
        a = $(a);
        b = $(b);

        let aGroup = a.find('.column-formatia').text();
        let bGroup = b.find('.column-formatia').text();
        if (aGroup === bGroup) {
            let aDisc = a.find('.column-disciplina').text();
            let bDisc = b.find('.column-disciplina').text();

            return compareStrings(aDisc, bDisc);
        }
        else {
            return compareStrings(aGroup, bGroup);
        }
    });
    rows = rows.filter(function (value, index, self) {
        if (index + 1 < self.length) {
            let tr = $(value);
            let nextTr = $(self[index + 1]);
            return !equalTrs(tr, nextTr);
        }
        return true;
    });
    $('#finder-time-result').html(rows);
}

function compareStrings(a, b) {
    if (a < b) {
        return -1;
    }
    else if (a > b) {
        return 1;
    }
    return 0;
}

function performChange() {
    saveOptions();
    updateSettingsUi();
    runFixer();
}

function updateSettingsUi() {
    let week = getWeekNo();
    if (week === 0) {
        week = 2;
    }
    $('#week-span').text("Week " + week + ": ");

    $('#offset-week')
        .prop('checked', options.weekOffset === 1)
        .checkboxradio('refresh');

    if ($('#tables-wrapper .column-frecventa:contains(sapt)').length === 0) {
        $('#week-wrapper').hide();
    }
    else {
        $('#week-wrapper').show();
    }



    if ($('#group-select:contains(' + options.group + ')').length) {
        $('#group-select')
            .val(options.group)
            .selectmenu('refresh');
    }

    if ($('#tables-wrapper table').length === 1) {
        $('#group-wrapper').hide();
    }
    else {
        $('#group-wrapper').show();
    }

    $('#half-group-select')
        .val(options.halfGroup)
        .selectmenu('refresh');

    $('#hidden-fade-select')
        .val(options.fadeHidden ? 'true' : 'false')
        .selectmenu('refresh');

    $('#other-halfgr-fade-select')
        .val(options.fadeHalfGroup ? 'true' : 'false')
        .selectmenu('refresh');

    $('#other-week-fade-select')
        .val(options.fadeWeek ? 'true' : 'false')
        .selectmenu('refresh');

    if ($('#tables-wrapper .column-formatia:contains(/1)').length === 0 &&
        $('#tables-wrapper .column-formatia:contains(/2)').length === 0) {
        $('#half-group-wrapper').hide();
    }
    else {
        $('#half-group-wrapper').show();
    }

    let hiderList = '<table>';
    let renamerList = '<table>';
    let finderOptions = '';

    let lDisciplines = disciplines.map(discipline => {
        let discName = discipline;
        if (options.disciplinesToReplace.hasOwnProperty(discipline) &&
            options.disciplinesToReplace[discipline]) {

            discName = options.disciplinesToReplace[discipline];
        }

        return {
            discipline,
            discName,
            hidden: isHidden(discipline)
        }
    });

    hiderList += lDisciplines.map(d =>
        `<tr>
            <td class="discipline-name" data-discipline="${d.discipline}">${d.discName}</td>
            <td class="check-column">
                <input class="hide-check" type="checkbox" ${(d.hidden ? 'checked' : '')}/>
            </td>
        </tr>`
    ).join('');

    sortedDisciplines = lDisciplines.sort((a, b) => {
        if (a.hidden == b.hidden) {
            a.discipline.localeCompare(b.discipline);
        } else {
            if (a.hidden) {
                return 1;
            }
            return -1;
        }
    });

    renamerList += sortedDisciplines.map(d => `
        <tr>
            <td class="discipline-name" >${d.discipline}</td>
            <td class="input-column">
                <input class="rename-to" type="text" value="${d.discipline == d.discName ? '' : d.discName}"/>
            </td>
        </tr>
    `).join('');

    finderOptions += sortedDisciplines.map(d => `
        <option value="${d.discipline}">${d.discName}</option>
    `).join('');


    hiderList += '</table>';
    renamerList += '</table>';

    $('#hider-list-wrapper').html(hiderList);
    $('#renamer-list-wrapper').html(renamerList);
    $('#finder-select').html(finderOptions);
    $('#finder-select').selectmenu('refresh');

    if (options.customTable.length == 0) {
        $('#custom-empty-view').show();
        $('#custom-work-view').hide();
    } else {
        $('#custom-empty-view').hide();
        $('#custom-work-view').show();
        updateCustomWorkView();
    }
}

function updateCustomWorkView() {
    let chosen = $('#custom-selected-table');
    chosen.html('');

    let remList = $('#custom-list-table');
    remList.html('');


    let remaining = new Set(idList);

    for (let i = 0; i < options.customTable.length; ++i) {
        let id = options.customTable[i];

        remaining.delete(id);

        let row = cloneStripped($('tr[data-id="' + id + '"]').eq(0));
        shortenInfo(row);
        chosen.append(row);
    }
    chosen.selectable('refresh');
    addDayLinesCustom(chosen);

    remaining = Array.from(remaining);
    sortIds(remaining);

    for (let i = 0; i < remaining.length; ++i) {
        let id = remaining[i];

        let row = cloneStripped($('tr[data-id="' + id + '"]').eq(0));
        shortenInfo(row);
        remList.append(row);
    }
    remList.selectable('refresh');
    addDayLinesCustom(remList);

    $('#custom-add, #custom-remove, #custom-switch').button('disable');

    $('#custom-list-wrapper .scroller').scrollTop(customListScroll);
}

function sortIds(array) {
    array.sort();
}

function cloneStripped(element) {
    return element
        .clone()
        .removeClass('meh-tr')
        .removeClass('hide-tr')
        .removeClass('other-week-tr')
        .removeClass('nope-tr')
        .removeClass('last-of-day-tr');
}

function shortenInfo(row) {
    if (row.length == 0) {
        return;
    }
    let columns = row.getColumns();
    /*
     * @returns {day, 
     * hour, 
     * frequency, room, group, type, discipline, teacher}
     */

    let day = columns.day.text();
    columns.day.text(day.substr(0, 2)).attr('title', day);

    let hour = columns.hour.text();
    columns.hour.text(hour.split('-')[0]).attr('title', hour);

    let sapt = columns.frequency.text();
    columns.frequency.text(sapt.replace('sapt. ', 's')).attr('title', sapt);

    let room = columns.room.text();
    columns.room.text(room.substr(0, 4) + ((room.length > 4) ? '.' : '')).attr('title', room);

    let type = columns.type.text();
    columns.type.text(type.substr(0, 1)).attr('title', type);

    let disc = columns.discipline.text();
    columns.discipline.attr('title', disc);

    let teacher = columns.teacher.text();
    let teach = teacher.split(' ');
    let tStr = teach[1];

    let tt = tStr.split('-');
    tStr = tt[0].substr(0, 1) + tt[0].substr(1).toLowerCase();

    for (let i = 1; i < tt.length; ++i) {
        tStr += '-' + tt[i].substr(0, 1) + '.';
    }

    for (let i = 2; i < teach.length; ++i) {
        tStr += ' ' + teach[i].substr(0, 1) + '.';
    }
    columns.teacher.text(tStr).attr('title', teacher);
}

function runFixer() {
    'use strict';

    $('#tables-wrapper').html(defaultHTML);

    let myGroupHeading = $("h1:contains('" + options.group + "')");
    if ($('#tables-wrapper table').length === 1) {
        myGroupHeading = $('#tables-wrapper h1');
    }
    let myGroupTable = myGroupHeading.next("table");

    myGroupHeading.prependTo("#tables-wrapper").css("margin", "30px");
    myGroupTable.insertAfter(myGroupHeading).css("margin-bottom", "147px");

    let hasCustom = options.customTable.length > 0;

    if (hasCustom) {
        if (!insertCustomTable()) {
            options.customTable = [];
            customError = true;
            performChange();
            return;
        }
        else {
            customError = false;
        }
    }
    if (customError) {
        $('#tables-wrapper').prepend('<hgroup><h1 class="error">Some custom items were not found</h1><h2 class="error">The timetable might have changed. The custom table has been cleared.</h2></hgroup>');
    }
    let customTable = $('.table-custom');

    for (let discipline in options.disciplinesToReplace) {
        if (options.disciplinesToReplace.hasOwnProperty(discipline) && options.disciplinesToReplace[discipline]) {
            let a = $('.column-' + disciplineColumn + ' a:contains(' + discipline + ')');
            a.each(function () {
                let text = $(this).text();
                $(this)
                    .text(text.replace(discipline, options.disciplinesToReplace[discipline]));
            });
        }
    }

    fixTable(myGroupTable);
    if (hasCustom) {
        fixTable(customTable, true);
    }


    $("table").each(function () {
        addDayLines($(this));
    });
}

function fixTable(table, custom = false) {

    for (let i = 0; i < options.disciplinesToHide.length; ++i) {
        let discipline = options.disciplinesToHide[i];
        let row = table
            .find('.column-' + disciplineColumn + '[data-original="' + discipline + '"]')
            .closest('tr');

        if (options.fadeHidden) {
            row.addClass("meh-tr")
                .addClass("nope-tr");
        }
        else {
            row.addClass("hide-tr");
        }
    }

    if (!custom) {
        let otherHgTrs = table.find("tr:contains('" + options.group + "/" + (3 - options.halfGroup) + "')");

        if (options.fadeHalfGroup) {
            otherHgTrs.addClass("meh-tr");
        }
        else {
            otherHgTrs.addClass("hide-tr");
        }
    }

    let weekNo = getWeekNo();
    let otherWeekNo = weekNo + 1;

    let saptString = "sapt. " + otherWeekNo;

    let otherWeekTrs = table.find("tr:contains(" + saptString + ")");

    if (options.fadeWeek) {
        otherWeekTrs.addClass("other-week-tr");
    }
    else {
        otherWeekTrs.addClass("hide-tr");
    }
}

function insertCustomTable() {
    let table = $('<table class="table-custom">');
    table.append($('#tables-wrapper table').eq(0).find('tr:has(th)').clone());

    for (let i = 0; i < options.customTable.length; ++i) {
        let id = options.customTable[i];

        let row = $('tr[data-id="' + id + '"]');
        if (row.length > 0) {
            row = row.eq(0);
            table.append(row.clone());
        }
        else {
            console.error(id + ' NOT FOUND');
            return false;
        }
    }

    let customHeading = $('<h1>Custom</h1>');

    customHeading.prependTo("#tables-wrapper").css("margin", "30px");
    table.insertAfter(customHeading);

    return true;
}

function addDayLines(table) {
    let lastVisible = table.find('tr:visible:last');

    for (let i in days) {
        let dayString = days[i];
        let last = table.find("tr:visible:contains(" + dayString + ")");

        last = $(last[last.length - 1]);
        if (!last.is(lastVisible)) {
            last.addClass("last-of-day-tr");
        }
    }
}

function addDayLinesCustom(table) {
    for (let i in days) {
        let dayString = days[i];
        let last = table.find("td[title='" + dayString + "']").closest('tr');

        last = $(last[last.length - 1]);
        if (!last.is(':last-child')) {
            last.addClass("last-of-day-tr");
        }
    }
}

function getWeekNo() {
    let weekInYear = new Date().getWeek();
    let firstWeek = new Date(new Date().getYear(), 0, 1).getWeek();

    return (weekInYear - firstWeek + 1 + options.weekOffset) % 2;
}

function setupFunctions() {
    'use strict';

    Date.prototype.getWeek = function () {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    };

    /**
     * @returns {day, hour, frequency, room, group, type, discipline, teacher}
     */
    jQuery.fn.getColumns = function () {
        if (this.is('tr')) {
            return {
                day: this.find('.column-ziua'),
                hour: this.find('.column-orele'),
                frequency: this.find('.column-frecventa'),
                room: this.find('.column-sala'),
                group: this.find('.column-formatia'),
                type: this.find('.column-tipul'),
                discipline: this.find('.column-disciplina'),
                teacher: this.find('.column-cadrul-didactic')
            };
        }
        else {
            return {};
        }
    };

    setDialogsPositionFixed();
    setFavicon();
}

function setDialogsPositionFixed() {
    $.ui.dialog.prototype._oldinit = $.ui.dialog.prototype._init;
    $.ui.dialog.prototype._init = function () {

        $(this.element).parent().css("position", "fixed");
        $(this.element).parent().addClass("no-select");
        $(this.element).parent().css("margin", "5px"); //limit 5px to the top
        $(this.element).dialog("option", {
            resizeStart: function (event, ui) {
                $(event.target).parent().css("position", "fixed");
                return true;
            },
            resizeStop: function (event, ui) {
                $(event.target).parent().css("position", "fixed");
                return true;
            }
        });
        this._oldinit();
    };
}

function setFavicon() {
    const href = 'https://i.imgur.com/s6FbuBK.png';
    $('head').append(`<link rel="shortcut icon" type="image/png" href="${href}"/>`);
}

function injectSettingHTML() {
    'use strict';

    let groupOptions = '';
    $('#tables-wrapper h1').each(function () {
        try {
            let group = parseInt($(this).text().replace('Grupa ', ''), 10);
            let sel = '';
            if (group == options.group) {
                sel = 'selected';
            }
            groupOptions += `<option value="${group}" ${sel}>${group}</option>`;
        }
        catch (e) {
            console.log(e);
        }
    });

    const halfGroupOptions = [[1, 1], [2, 2], [0, "Don't hide"]].map(([val, txt]) =>
        `<option value="${val}" ${val === options.halfGroup ? "selected" : ""}>${txt}</option>`
    );

    let html =
        `<div id="settings-container">
            <button id="toggle-settings">Settings</button>
            <div id="settings-wrapper">
            <div id="week-wrapper" class="option-wrapper">
                <span id="week-span"></span>
                <label id="offset-label" for="offset-week">Offset week by 1</label>
                <input type="checkbox" id="offset-week" />
            </div>
            <div id="group-wrapper" class="option-wrapper">
                <label for="group-select">Group: </label>
                <select id="group-select">
                    <option value="0"></option>
                    ${groupOptions}
                </select>
            </div>
            <div id="half-group-wrapper" class="option-wrapper">
                <label for="half-group-select">Halfgroup: </label>
                <select id="half-group-select">
                    ${halfGroupOptions}
                </select>
            </div>
            <div class="option-wrapper">
                <button id="visibility-button">Edit Visibility</button>
            </div>
            <br>
            <div id="buttons-wrapper" class="option-wrapper">
                <button id="hider-button">Hidden disciplines</button>
                <button id="renamer-button">Rename disciplines</button>
                <button id="finder-button">Find disciplines</button>
                <button id="reset-button">Reset Settings</button>
                <button id="print-button">Print this page</button>
            </div>
            <br>
            <div id="buttons-wrapper-2" class="option-wrapper">
                <button id="import-button">Import settings</button>
                <button id="export-button">Export settings</button>
                <a id="download-helper" class="ui-helper-hidden"></a>
                <button id="customize-button" class="beta-button">Edit custom</button>
            </div><br>`;
    if (DEVELOPEMENT) {
        html += '<div id="urgent-todo" class="todo-wrapper">' + listifiy(URGENT_TODO) + '</div>';
        html += '<div id="todo" class="todo-wrapper">' + listifiy(TODO) + '</div>';
    }

    html += `
        <div id="visibility-dialog">
            <div id="hidden-fade-wrapper" class="row no-gutters">
                <label for="hidden-fade-select" class="col-7">Hidden items: </label>
                <div class="col-5">
                    <select id="hidden-fade-select">
                        <option value="true">Faded</option>
                        <option value="false">Hidden</option>
                    </select>
                </div>
            </div>
            <div id="other-halfgr-fade-wrapper" class="row no-gutters">
                <label for="other-halfgr-fade-select" class="col-7">Other halfgroup's items: </label>
                <div class="col-5">
                    <select id="other-halfgr-fade-select">
                        <option value="true">Faded</option>
                        <option value="false">Hidden</option>
                    </select>   
                </div>
            </div>
            <div class="row no-gutters">
                <label for="other-week-fade-select" class="col-7">Other week items: </label>
                <div class="col-5">
                    <select id="other-week-fade-select">
                        <option value="true">Faded</option>
                        <option value="false">Hidden</option>
                    </select>   
                </div>
            </div>
        </div>`;

    html += `
        <div id="hider-dialog">
            <span>Select the disciplines you <b>don\'t</b> want highlighted:</span>
            <div id="hider-list-wrapper"></div>
            <div style="float: right;">
                <button id="hider-save">Save</button>
                <button id="hider-close">Cancel</button>
            </div>
        </div>`;

    html += `
        <div id="renamer-dialog">
            <span>Enter the text you want each discipline to be renamed to. <br> Leave the field blank if you don\'t want a discipline\'s name replaced.</span>
            <div id="renamer-list-wrapper"></div>
            <div style="float: right;">
                <button id="renamer-save">Save</button>
                <button id="renamer-close">Cancel</button>
            </div>
        </div>`;

    html += `
        <div id="finder-dialog">
            <div id="tabs">
                <ul>
                    <li><a href="#tabs-1">By Discipline</a></li>
                    <li><a href="#tabs-2">By Time</a></li>
                </ul>
                <div id="tabs-1">
                    <div class="finder-options-wrapper">
                        <label for="finder-select">Discipline to search for: </label>
                        <select id="finder-select"></select>
                        
                        <label for="finder-type"> Type: </label>
                        <select id="finder-type">
                            <option value="curs">Course</option>
                            <option value="seminar">Seminar</option>
                            <option value="laborator">Laboratory</option>
                        </select>
                    </div>
                    <table id="finder-result"></table>
                </div>
                <div id="tabs-2">
                    <div class="finder-options-wrapper">
                        <label for="finder-day">Day: </label><select id="finder-day"></select>
                        <label for="finder-hour"> Hour: </label>
                        <select id="finder-hour"></select>
                        <label for="finder-sapt"> Week: </label>
                        <select id="finder-sapt">
                            <option value="0">Both</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                        </select>
                    </div>
                    <table id="finder-time-result"></table>
                </div>
            </div>
        </div>`;

    html += `
        <div id="import-dialog">
            <span id="import-status"></span>
            <label for="import-file">Choose settings file:</label>
            <input type="file" id="import-file" accept=".json,text/json"/>
            <div style="float: right; margin-top: 20px;">
                <button id="do-import">Import</button>
            </div>
        </div>`;

    html += `
        <div id="customize-dialog">
            <div id="custom-empty-view">
                <label for="custom-group-select">List empty. Start with group: </label>
                <select id="custom-group-select">
                    ${groupOptions}
                </select>
                <label for="custom-half-group-select">Halfgroup: </label>
                <select id="custom-half-group-select">
                    ${halfGroupOptions}
                </select>
                <hr>
                <button id="custom-start">Go</button>
            </div>
            <div id="custom-work-view">
                <div id="custom-selected-wrapper">
                    <h3>Your items</h3>
                    <div class="scroller">
                        <table id="custom-selected-table"></table>
                    </div>
                </div>
                <div id="custom-controls">
                    <button id="custom-add" title="Add">&lt;&lt;</button>
                    <hr>
                    <button id="custom-remove" title="Remove">&gt;&gt;</button>
                    <hr>
                    <button id="custom-switch" title="Switch">&lt;&gt;</button>
                </div>
                <div id="custom-list-wrapper">
                    <h3>Other items</h3>
                    <div class="scroller">
                        <table id="custom-list-table"></table>
                    </div>
                </div>
                <hr>
                <button id="custom-clear" style="margin-left: 42%;">Clear All</button>
            </div>
        </div>`;
    html += '</div></div>';
    $(html).insertAfter('#title-heading');

    if (options.settingsHidden) {
        $('#settings-wrapper').hide();
    }

    for (let i = 0; i < days.length; ++i) {
        $('#finder-day').append('<option value="' + days[i] + '">' + days[i] + '</option>');
    }

    $('#offset-week').checkboxradio({
        icon: false
    });
    $('button').button();
    $('select').selectmenu();

    $('#toggle-settings').button({
        icon: 'ui-icon-gear',
        text: false
    });
    $('#visibility-button').button({
        icon: 'ui-icon-eye'
    });
    $('#hider-button').button({
        icon: 'ui-icon-hide'
    });
    $('#renamer-button').button({
        icon: 'ui-icon-rename'
    });
    $('#finder-button').button({
        icon: 'ui-icon-find'
    });
    $('#reset-button').button({
        icon: 'ui-icon-reset'
    });
    $('#print-button').button({
        icon: 'ui-icon-printer'
    });
    $('#import-button').button({
        icon: 'ui-icon-import'
    });
    $('#export-button').button({
        icon: 'ui-icon-export'
    });
    $('#customize-button').button({
        icon: 'ui-icon-customize'
    });

    $('#tabs').tabs();

    $('#visibility-dialog').dialog({
        modal: true,
        width: 320,
        title: 'Edit visibility options',
        autoOpen: false
    });

    $('#hider-dialog').dialog({
        modal: true,
        width: 320,
        title: 'Hide disciplines',
        autoOpen: false
    });

    $('#renamer-dialog').dialog({
        modal: true,
        width: 420,
        title: 'Rename disciplines',
        autoOpen: false
    });

    $('#finder-dialog').dialog({
        modal: true,
        width: 620,
        height: 'auto',
        title: 'Find disciplines',
        autoOpen: false
    });
    updateFinderHourSelect();

    $('#import-dialog').dialog({
        modal: true,
        width: 320,
        height: 'auto',
        title: 'Import settings',
        autoOpen: false
    });
    $('#do-import').button("option", "disabled", true);

    $('#customize-dialog').dialog({
        modal: true,
        minWidth: 820,
        height: 'auto',
        title: 'Edit your custom timetable',
        autoOpen: false
    });

    $('#custom-selected-table').selectable({
        filter: 'tr',
        selected: function () {
            $('#custom-remove').button('enable');

            checkSwitch();
        },
        unselected: function () {
            if ($(this).find('.ui-selected').length == 0) {
                $('#custom-remove').button('disable');
            }
            checkSwitch();
        }
    });
    $('#custom-list-table').selectable({
        filter: 'tr',
        selected: function () {
            $('#custom-add').button('enable');

            checkSwitch();
        },
        unselected: function () {
            if ($(this).find('.ui-selected').length == 0) {
                $('#custom-add').button('disable');
            }
            checkSwitch();
        }
    });
}


function setEventHandlers() {
    $('body')
        .on('click', '#toggle-settings', function () {
            $('#settings-wrapper').slideToggle();
            options.settingsHidden = !options.settingsHidden;
            saveOptions();
        })
        .on('change', '#offset-week', function () {
            options.weekOffset = ($(this).prop('checked') ? 1 : 0);
            performChange();
        })
        .on('selectmenuchange', '#group-select', function () {
            options.group = parseInt($(this).val(), 10);
            performChange();
        })
        .on('selectmenuchange', '#half-group-select', function () {
            options.halfGroup = parseInt($(this).val(), 10);
            performChange();
        })
        .on('selectmenuchange', '#hidden-fade-select', function () {
            let value = $(this).val() === 'true';
            options.fadeHidden = value;
            performChange();
        })
        .on('selectmenuchange', '#other-halfgr-fade-select', function () {
            let value = $(this).val() === 'true';
            options.fadeHalfGroup = value;
            performChange();
        })
        .on('selectmenuchange', '#other-week-fade-select', function () {
            let value = $(this).val() === 'true';
            options.fadeWeek = value;
            performChange();
        })
        .on('click', '#visibility-button', function () {
            $('#visibility-dialog')
                .dialog('option', 'position', {
                    my: 'center top',
                    at: 'center top+50',
                    of: window
                })
                .dialog('open');
        })
        .on('click', '#hider-button', function () {
            $('#hider-dialog')
                .dialog('option', 'position', {
                    my: 'center top',
                    at: 'center top+50',
                    of: window
                })
                .dialog('open');
        })
        .on('click', '#renamer-button', function () {
            $('#renamer-dialog')
                .dialog('option', 'position', {
                    my: 'center top',
                    at: 'center top+50',
                    of: window
                })
                .dialog('open');
        })
        .on('click', '#reset-button', function () {
            if (confirm('Are you sure you want to reset?')) {
                options = getDefaultOptions();
                performChange();
            }
        })
        .on('click', '#import-button', function () {
            $('#import-dialog')
                .dialog('option', 'position', {
                    my: 'center top',
                    at: 'center top+50',
                    of: window
                })
                .dialog('open');
        })
        .on('click', '#export-button', exportOptions)
        .on('click', '#print-button', window.print)
        .on('click', '#hider-save', function () {
            let hides = [];
            $('#hider-list-wrapper tr').each(function () {
                if ($(this).find('.hide-check').is(':checked')) {
                    hides.push($(this).find('.discipline-name').attr('data-discipline'));
                }
            });

            $('#hider-dialog').dialog('close');
            options.disciplinesToHide = hides;
            performChange();
        })
        .on('click', '#hider-close', function () {
            $('#hider-dialog').dialog('close');
        })
        .on('click', '#renamer-save', function () {
            let renames = {};
            $('#renamer-list-wrapper tr').each(function () {
                let renameTo = $(this).find('.rename-to').val();
                if (renameTo.length > 0) {
                    renames[$(this).find('.discipline-name').text()] = renameTo;
                }
            });

            options.disciplinesToReplace = renames;

            $('#renamer-dialog').dialog('close');
            performChange();
        })
        .on('click', '#renamer-close', function () {
            $('#renamer-dialog').dialog('close');
        })
        .on('click', '#finder-button', function () {
            $('#finder-dialog')
                .dialog('option', 'position', {
                    my: 'center top',
                    at: 'center top+50',
                    of: window
                })
                .dialog('open');
            findDiscipline();
        })
        .on('selectmenuchange', '#finder-dialog select', findDiscipline)
        .on('selectmenuchange', '#finder-day', updateFinderHourSelect)
        .on('selectmenuchange', '#finder-hour, #finder-sapt', findDisciplineByTime)

        .on('change', '#import-file', function () {
            let files = $(this)[0].files;
            $('#do-import').button("option", "disabled", files.length < 1);
        })
        .on('click', '#do-import', importOptions)
        .on('click', '#customize-button', function () {
            $('#customize-dialog')
                .dialog('option', 'position', {
                    my: 'center top',
                    at: 'center top+20',
                    of: window
                })
                .dialog('open');
        })
        .on('click', '#custom-start', function () {
            initCustomTable();
            performChange();
        })
        .on('click', '#custom-clear', function () {
            if (confirm("Are you sure you want to clear everything?")) {
                options.customTable = [];
                performChange();
            }
        })
        .on('click', '#custom-add', function () {
            $('#custom-list-table .ui-selected').each(function () {
                options.customTable.push($(this).attr('data-id'));
            });
            sortIds(options.customTable);
            rememberScroll();
            performChange();
        })
        .on('click', '#custom-remove', function () {
            $('#custom-selected-table .ui-selected').each(function () {
                removeElement(options.customTable, $(this).attr('data-id'));
            });
            rememberScroll();
            performChange();
        })
        .on('click', '#custom-switch', function () {
            $('#custom-list-table .ui-selected').each(function () {
                options.customTable.push($(this).attr('data-id'));
            });
            $('#custom-selected-table .ui-selected').each(function () {
                removeElement(options.customTable, $(this).attr('data-id'));
            });
            sortIds(options.customTable);
            rememberScroll();
            performChange();
            clearHighlights();
        });
}

function getDefaultOptions() {
    'use strict';

    return {
        weekOffset: 0,
        group: 0,
        halfGroup: 0,
        disciplinesToReplace: {},
        disciplinesToHide: [],
        customTable: [],
        fadeHidden: true,
        fadeHalfGroup: true,
        fadeWeek: true,
        settingsHidden: false
    };
}

function getBaseOptionKey() {
    return "options";
}

function getOptionKey() {
    parts = location.pathname.match('/([0-9]+-[0-9]+)/.*/([^.]+)');
    try {
        return getBaseOptionKey() + "_" + parts[1] + "_" + parts[2];
    }
    catch (err) {
        return getBaseOptionKey();
    }
}

function loadOptions() {
    'use strict';

    let defOptions = getDefaultOptions();
    let savedOptions = GM_getValue(getOptionKey(), GM_getValue(getBaseOptionKey(), "{}"));
    try {
        savedOptions = JSON.parse(savedOptions);
    }
    catch (err) {
        savedOptions = {};
    }

    options = $.extend(defOptions, savedOptions);
}


function exportOptions() {
    let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(options));
    let downloadHelper = $('#download-helper')

    downloadHelper.attr('href', dataStr);
    downloadHelper.attr('download', 'fixer-options.json');
    downloadHelper[0].click();
}

function importOptions() {
    let files = $('#import-file')[0].files;
    if (files.length > 0) {
        let file = files[0];
        let reader = new FileReader();

        reader.onload = function (e) {
            parseOptionFile(reader.result);
        }

        reader.readAsText(file);
    }
}

function parseOptionFile(text) {
    try {
        options = JSON.parse(text);
        performChange();
        $('#import-dialog').dialog('close');
        $('#import-status').text("");
    }
    catch (err) {
        $('#import-status').text("Import failed. Invalid JSON.");
        console.error(err);
    }
}

function saveOptions() {
    GM_setValue(getOptionKey(), JSON.stringify(options));
}


function isHidden(disc) {
    return options.disciplinesToHide.includes(disc);
}

