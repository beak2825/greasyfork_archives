// ==UserScript==
// @name        DrM Heallthland
// @namespace   jewelmirror.com
// @include     http://hlapp/Healthlandweb/*
// @include     https://pmp.doj.ca.gov/pdmp/*
// @version     1.1
// @description Productivity enhancements to Healthland Centriq EHR
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_setClipboard
// @grant       GM_xmlhttpRequest
// @require     https://code.jquery.com/jquery-2.0.3.min.js
// @require     https://code.jquery.com/ui/1.8.2/jquery-ui.js
// @requre      http://hlapp/Healthlandweb/Scripts/telerik/Input/DateInput/RadDateInputScript.js
// @downloadURL https://update.greasyfork.org/scripts/10612/DrM%20Heallthland.user.js
// @updateURL https://update.greasyfork.org/scripts/10612/DrM%20Heallthland.meta.js
// ==/UserScript==

/*
 * $Source: /Users/cvsroot/DrM_Heallthland/DrM_Heallthland.user.js,v $
 * $Author: marcin $
 * $Revision: 1.11 $
 * 
 * History
 * Version 1.0
 *      Original release.  Support for keyboard shortcuts, calculator for Mini Mental and ED Outpatient Level of 
 *      service, CURES
 * Version 1.1
 *      CURES
 *          DrM Logo in cures
 *      New shortcuts
 *          p - problem list
 *          m - home medications
 *      Calculators
 *          Warfarin dosing calculator
 *---------------------------------------------------------------------------
        @licstart  The following is the entire license notice for the 
        JavaScript code in this page.

        Copyright (C) 2025  Marcin Matuszkiewicz - marcin@jewelmirror.com

        The JavaScript code in this page is free software: you can
        redistribute it and/or modify it under the terms of the GNU
        General Public License (GNU GPL) as published by the Free Software
        Foundation, either version 3 of the License, or (at your option)
        any later version.  The code is distributed WITHOUT ANY WARRANTY;
        without even the implied warranty of MERCHANTABILITY or FITNESS
        FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

        As additional permission under GNU GPL version 3 section 7, you
        may distribute non-source (e.g., minimized or compacted) forms of
        that code without the copy of the GNU GPL normally required by
        section 4, provided you include this license notice and a URL
        through which recipients can access the Corresponding Source.   


        @licend  The above is the entire license notice
        for the JavaScript code in this page
 */


/********************************************************************
 * CURES Specific functions and data
 ********************************************************************/
var CURESpages = {
    index : 'index.do',
    search_input : 'list.do',
    search_results : 'search.do',
    report: 'listPatients.do'
};

function CURESSelectAllOnChange() {
    cb = document.getElementById('checkall_id');
    if (cb.checked) {
        CURESSelectAll();
    } else {
        CURESDeselectAll();
    }
}

function CURESSelectAll() {
    ids = document.getElementsByName('ids');

    for ( i = 0; i < ids.length; i++) {
        ids[i].checked = true;
    }
}

function CURESDeselectAll() {
    ids = document.getElementsByName('ids');

    for ( i = 0; i < ids.length; i++) {
        ids[i].checked = false;
    }
}

function CURESIndex() {
    // You prefill your USERNAME
    document.getElementById('j_username').value = '';
    var pass = document.getElementById('j_password');
    pass.focus();
    // You can set pass.value to fill you PASSWROD
    pass.value = '';
    
    // Auto login
    // $('input:submit').click();
//    var inputs = document.getElementsByTagName('input');
//    for (var i in inputs) {
//        if (i.getAttribute('type') == 'submit') {
//            i.click();
//        }
//    }    
}

function CURESSearchInput() {
    var patientId = GM_getValue('patientId');
    var visitId = GM_getValue('visitId');
    
    if (patientId && visitId) {
        // var btn = $('#middleColumn').prepend('<input id="loadDemo" type="button" value="Load from HL">');
        
        $('[name="search"]').before('<input id="loadDemo" type="button" value="Load from HL">');
        $('#loadDemo').bind('click', loadDemographics);
        $('#loadDemo').before('<div id="loadingDemo">Loading</div>');
        $('#loadingDemo').css('background', 'yellow');
        // Load demographics by default
        loadDemographics();        
    }
    
    var period_sel = document.getElementById('period');
    period_sel.value = '12';

    var disclaimer_cb = document.getElementsByName('disclaimer');
    disclaimer_cb[0].setAttribute('checked', true);    
}

function CURESSearchResults(){
    var tab = document.getElementById('resultsTable');

    var thead = tab.getElementsByTagName('thead');

    var r = thead[0].insertRow(-1);

    var cell0 = r.insertCell(0);
    var cell1 = r.insertCell(1);
    //cell0.setAttribute('colspan', '2');

    var checkall_cb = document.createElement('input');
    checkall_cb.setAttribute('type', 'checkbox');
    checkall_cb.id = "checkall_id";
    checkall_cb.checked = true;
    checkall_cb.value = "SELECTALL";

    cell0.appendChild(checkall_cb);
    cell1.innerHTML = 'Select All';

    checkall_cb.addEventListener("click", CURESSelectAllOnChange, true);

    CURESSelectAll();    
}


/********************************************************************
 * Healthland specifiction fuctions
 ********************************************************************/
function loadDemographics() {
    console.log('DrM: loading demographics');
    
    $('#loadDemo').hide();
    $('#loadingDemo').show();
    
    var href = 'http://hlapp/Healthlandweb/Demographics/FillDemographics?area=Demographics&patientId=';
    href += GM_getValue('patientId');
    href += '&visitId=';
    href += GM_getValue('visitId');
    console.log(href);
    
    GM_xmlhttpRequest({
    method: "GET",
    url:     href,
    onload: processDemographics
    });  
}

function processDemographics(response) {
    console.log('processing Demographics');
    var demoDOM = new DOMParser().parseFromString(response.responseText, 'text/html');
    
    var dob = demoDOM.getElementById('Actual-DOB').value;
    
    var labels = demoDOM.getElementsByTagName('label');
    var lastName = labels[1].nextSibling.nextSibling.innerHTML.trim();
    var firstName = labels[2].nextSibling.nextSibling.innerHTML.trim();
    
    $('#lastName').val(lastName);
    $('#firstName').val(firstName);
    $('#dob').val(dob);

    $('#loadDemo').show();
    $('#loadingDemo').hide();
    
    console.log(lastName);
    console.log(firstName);
    console.log(dob);
    
}

function addCURES() {
    var ptChartMenu = document.getElementsByClassName('lineBlock')[1];
    
    if (!ptChartMenu) {
        return;
    }
    
    var wr = document.createElement('div');
    wr.setAttribute('class', 'main-button-wrapper');
    
    var el = document.createElement('input');
    el.setAttribute('type', 'button');
    el.setAttribute('id', 'CURES');
    // el.setAttribute('class', 'mainButtons');
    el.setAttribute('title', 'CURES');
    el.setAttribute('value', 'CURES');
    
    wr.appendChild(el);
    ptChartMenu.appendChild(wr);
    
    el.addEventListener('click', function() {
        var patientId = $('#current-patient-id').text().trim();
        var visitId = $('#current-visit-id').text().trim();
    
        if (!patientId.length || !visitId) {
            console.log('Select a ptient');
            return;
        }
        
        GM_setValue('patientId', patientId);
        GM_setValue('visitId', visitId);    
        win = window.open('https://pmp.doj.ca.gov/pdmp/index.do');
        win.focus();            
        });    
}

/********************************************************************
 * ASSESSMENT FUNCTIONS
 ********************************************************************/
function addAssessMiniMentalButton() {
    $('#N_AFControl_18').after('<input id="idCalcScore" type="button" value="Calculate Score">');
    $('#idCalcScore').bind('click', calcAssessMiniMentalScore);
    console.log(btn);
}

function calcAssessMiniMentalScore() {
    console.log('Calculating Minimental');
    var miniMentalTotal = 0;
    var orientationCheckboxes = $('input[groupid="286"]:checkbox');
    var orientationTotalInput = $('input[groupid="286"]:text');
    var miniMentalTotalInput = $('#N_AFControl_18');
    
    var tmpTotal = 0;
    for (var i=0; i < orientationCheckboxes.length; i++) {
        if (orientationCheckboxes[i].checked) {
            miniMentalTotal++;
            tmpTotal++;
        }
    }
    orientationTotalInput.val(tmpTotal);
    
    var sel = $('#N_AFControl_4 option:selected').text();
    if (sel.indexOf('-select-') >= 0) {
        tmpTotal = 0;
    } else {
       tmpTotal = parseInt(sel.split('=')[0]);
    }
    miniMentalTotal += tmpTotal;
    // Update Registration total input
    $('#N_AFControl_5').val(tmpTotal);
    
    
    var sel = $('#N_AFControl_6 option:selected').text();
    if (sel.indexOf('-select-') >= 0) {
        tmpTotal = 0;
    } else {
       tmpTotal = parseInt(sel.split('=')[0]);
    }
    miniMentalTotal += tmpTotal;
    // Update Attention total input
    $('#N_AFControl_7').val(tmpTotal);

    var sel = $('#N_AFControl_8 option:selected').text();
    if (sel.indexOf('-select-') >= 0) {
        tmpTotal = 0;
    } else {
       tmpTotal = parseInt(sel.split('=')[0]);
    }
    miniMentalTotal += tmpTotal;
    // Update Attention total input
    $('#N_AFControl_10').val(tmpTotal);

    tmpTotal = 0;
    for (var i = 11; i < 17; i++) {
        var sel = $('#N_AFControl_'+i+' option:selected').text();
        console.log(sel);
        if (sel.indexOf('-select-') >= 0) {
            tmpTotal += 0;
        } else {
           tmpTotal += parseInt(sel.split('=')[0]);
        }
    }
    miniMentalTotal += tmpTotal;
    // Update Attention total input
    $('#N_AFControl_17').val(tmpTotal);
           
    miniMentalTotalInput.val(miniMentalTotal);    
}

function addEDOutpatientLevelButton() {
    $('#N_AFControl_73').after('<input id="idCalcScore" type="button" value="Calculate Score">');
    $('#idCalcScore').bind('click', calcEDOutpatientLevel);
}

function calcEDOutpatientLevel() {
    var total = 0;
    
    for (var i = 1; i < 73; i++) {
        var sel = $('#N_AFControl_'+i+' option:selected').text();
        console.log(i+': '+sel);
        if (sel.indexOf('-select-') >= 0) {
            total += 0;
        } else {
           total += parseInt(sel);
        }
    }
    
    $('#N_AFControl_73').val(total);    
}

function addDMVAudiometryButton() {
    $('#N_AFControl_1').after('<input id="idCalcScore" type="button" value="Calculate Score">');
    $('#idCalcScore').bind('click', calcDMVAudiometry);    
}

function calcDMVAudiometry() {
    var avgRt = 0, avgLt = 0;
    
    for (var i = 2; i < 5; i++) {
        var sel = $('#N_AFControl_'+i+' option:selected').text();
        if (sel.indexOf('-select-') >= 0) {
            avgRt += 0;
        } else {
           avgRt += parseInt(sel);
        }        
    }
    avgRt = Math.round(avgRt/3);
    
    console.log(avgLt);
    for (var i = 6; i < 9; i++) {
        var sel = $('#N_AFControl_'+i+' option:selected').text();
        if (sel.indexOf('-select-') >= 0) {
            avgLt += 0;
        } else {
           avgLt += parseInt(sel);
        }        
    }
    console.log(avgLt);
    avgLt = Math.round(avgLt/3);
    
    $('#N_AFControl_5').val(avgRt);
    $('#N_AFControl_9').val(avgLt);
    
    var yes = $('#N_AFControl_1 option:nth-child(2)').val();
    var no = $('#N_AFControl_1 option:nth-child(3)').val();
    if (avgRt <= 40 || avgLt <= 40) {
        $('#N_AFControl_1').val(yes); // Select YES
    } else {
        $('#N_AFControl_1').val(no); // Select NO
    }         
}

function KeyboardShortcuts(event) {
    console.log('DrM: Processing Shortcuts');
    if ($('INPUT:focus, SELECT:focus, TEXTAREA:focus').length) // disable hotkeys if focused on a form control
        return;

    var patientId = $('#current-patient-id').text().trim();
    var visitId = $('#current-visit-id').text().trim();
    var loc = '';
    
    var ch = String.fromCharCode(event.which).toLowerCase();
    console.log(ch);
    if (ch == 'v') {
        // key - 'v'
        loc = 'http://hlapp/Healthlandweb/PatientChart/Chart/VitalSigns?patientId='+patientId;
        loc += '&visitId='+visitId;
    } else if (ch == 'a') {
        // key - 'a'
        loc = 'http://hlapp/Healthlandweb/PatientChart/Chart/Assessments?patientId='+patientId;
        loc += '&visitId='+visitId;      
    } else if (ch == 'n') {
        // key - 'n'
        loc = 'http://hlapp/Healthlandweb/PatientChart/Chart/ChartNotes?patientId='+patientId;
        loc += '&visitId='+visitId; 
    } else if (ch == 'l') {
        // key - 'l'
        loc = 'http://hlapp/Healthlandweb/PatientChart/Chart/LabResults?patientId='+patientId;
        loc += '&visitId='+visitId;            
    } else if (ch == 'd') {
        // key - 'd'
        loc = 'http://hlapp/Healthlandweb/PatientChart/Chart/Documents?patientId='+patientId;
        loc += '&visitId='+visitId;                    
    } else if (ch == 'o') {
        // key - 'o'
        loc = 'http://hlapp/Healthlandweb/CPOE/WHOrders/Orders?patientId='+patientId;
        loc += '&visitId='+visitId;
    } else if (ch == 'p') {
        // key = - 'p'
        loc = 'http://hlapp/Healthlandweb/History/MedicalHistory?patientId='+patientId;
        loc += '&initialTab=Problem';
    } else if (ch == 'm') {
        // key = - 'm'
        loc = 'http://hlapp/Healthlandweb/History/MedicalHistory?patientId='+patientId;
        loc += '&initialTab=HomeMedication';        
    } else if (ch == 's') {
        // key = 's'
        console.log('Launching summary');
        // $('#current-patient-bar-quick-view').click();
        $('.quick-view').click();
        return;
    } else if (ch == 'c') {
        // key = 'c';
        // Will try to assessment calculator
        var assessTitleCtrl = $('label.header:first');
        console.log(assessTitleCtrl);
        
        if (!assessTitleCtrl.length) {
            console.log('DrM: No assesement found');
            return;
        }
        
        var assessTitle = assessTitleCtrl.text().trim();
        
        console.log('"'+assessTitle+'"');
        console.log(assessTitle == 'Warfarin Flowsheet - INR 2.0 - 3.0');
        if (assessTitle == 'Mini Mental Status Exam') {
            console.log('DrM: Detected Mini Mental Status Exam');
            addAssessMiniMentalButton();
        } else if (assessTitle == 'ED Outpatient Level Of Acuity Assignment') {
            console.log('DrM: Dected ED Outpatient Level Of Acuity Assignment');
            addEDOutpatientLevelButton();
        } else if (assessTitle == 'DMV Audiometry') {
            console.log('DrM: Detected DMV Audiometry Assessment');
            addDMVAudiometryButton();
        } else if (assessTitle == 'Warfarin Flowsheet - INR 2.0 - 3.0') {
            console.log('DrM: Detected Warfarin Flowsheet - INR 2.0 - 3.0');
            Warfarin.UI.initINRCalc1();
        }
        
        return;
    } else {
        return;
    }
    
    
    window.location.href = loc;        
}

function createHelp() {
    $('body').append('<div id="msg"></div>');
    $('#msg').hide();
    $('#msg').append('<table id="tblHelp"></table>');
    var tb = $('#tblHelp');
    tb.append('<tr><td colspan="2" class="helpheader">Shortcuts</td><td></td></tr>');
    tb.append('<tr><td class="helpshortcut">a</td><td>Assesments</td></tr>');
    tb.append('<tr><td class="helpshortcut">c</td><td>Add Assement Calculator</td></tr>');
    tb.append('<tr><td class="helpshortcut">d</td><td>Documents</td></tr>');
    tb.append('<tr><td class="helpshortcut">l</td><td>Lab Results</td></tr>');
    tb.append('<tr><td class="helpshortcut">n</td><td>Lab Results</td></tr>');
    tb.append('<tr><td class="helpshortcut">o</td><td>CPOE</td></tr>');
    tb.append('<tr><td class="helpshortcut">p</td><td>Problem List</td></tr>');
    tb.append('<tr><td class="helpshortcut">m</td><td>Home Medications (good place to lauch ePrescribe)</td></tr>');
    tb.append('<tr><td class="helpshortcut">s</td><td>Patietn Summary</td></tr>');
    tb.append('<tr><td colspan="2" class="helpheader">Assessments Calculators</td><td></td></tr>');
    tb.append('<tr><td colspan="2">ED Outpatient Level Of Acuity Assignment</td><td></td></tr>');
    tb.append('<tr><td colspan="2">Mini Mental Status Exam</td><td></td></tr>');
    $('.helpheader').css('font-weight', 'bold');
    $('.helpshortcut').css('color', 'blue');
    $('.helpshortcut').css('font-weight', 'bold');
}


/********************************************************************
 * MAIN script
 ********************************************************************/

console.log('DrM: Loading');

// Add DrM to pages so users know functionality is avaiable
$('body').append('<div id="logoDrM">DrM</div>');
var style = {position:'absolute',
    top: '1px',
    left: '1px',
    border:'1px solid black',
    padding:'10px',
    background: 'lightblue',
    'z-index': '3000'
};
$('#logoDrM').css(style);
$('#logoDrM').on('click', function() {    
    $('#msg').dialog({title: "DrM Enhancements v1.1", draggable: true});
});

createHelp();

var loc = window.location.href;

if (loc.indexOf('doj.ca.gov') >= 0) { // we are handling CURES
    if (loc.indexOf(CURESpages['index']) >= 0) {
        CURESIndex();
    } else if (loc.indexOf(CURESpages['search_input']) >= 0) {
        CURESSearchInput();
    } else if (loc.indexOf(CURESpages['search_results']) >= 0) {
        CURESSearchResults();
    } else if (loc.indexOf(CURESpages['report']) >= 0) {
        var th = document.getElementById('ReportDate');
        var tbody = th.parentNode.parentNode;
        var row_header = tbody.children[0];
        var row_pt = tbody.children[1];
    
        console.log(tbody);
    
        var row = tbody.insertRow(-1);
    
        cell0 = row.insertCell(0);
        cell1 = row.insertCell(1);
        cell1.setAttribute('colspan', '3');
    
        cell0.innerHTML = "PDF Name";
        
        var LastName = row_pt.children[1].innerHTML.trimLeft().trimRight();
        var FirstName = row_pt.children[2].innerHTML.trimLeft().trimRight();
        var DOB = row_pt.children[3].innerHTML.trimLeft().trimRight();
        var ReportDate = row_pt.children[0].innerHTML.trimLeft().trimRight().split(" ")[0];
        
        var PDFName = LastName+" "+FirstName+" "+DOB+" "+ReportDate;
       
        cell1.innerHTML = PDFName;
        GM_setClipboard(PDFName);    
    }
} else { // we are handling Healthland
    console.log('DrM: about to add cures');
    addCURES();
    var counter = GM_getValue('counter');
    console.log(counter);
    GM_setValue('counter', ++counter);
    
    // Keyboard shortcuts
    console.log('DrM: Binding keyboard shortcuts');
    document.addEventListener('keypress', KeyboardShortcuts);        
}

/***************************************************************************
 * WARFARIN
 */
/*
 * Module: warfarin.js
 * Version: 1.0
 * 
 * Description: This modules calculates warfarin dose based on INR results and INR target
 * 
 * Reference: http://www.aafp.org/fpm/2005/0500/p77.html
 * 
 * History: Original revision
 * 
 * API functions
 *      Warfarin.UI.initCalc1() - INR target of 2.0 - 3.0
 * 
 */


var Warfarin;

if (!Warfarin) {
    Warfarin = {};
} else {
    throw new Error('Warfarin already exists');
}

if (!Warfarin.UI) {
    Warfarin.UI = {};
} else {
    throw new Error('Warfarin.UI already exists');
}

Warfarin.dosingSchedule = {
    // "2.5": ["0.5","0","0","0","0","0","0"],
    // "5.0": ["0.5","0","0","0","0.5","0","0"],
    // "7.5": ["0.5","0","0.5","0","0.5","0","0"],
    "10.0": ["0.5","0","0.5","0","0.5","0","0.5"],
    "12.5": ["0.5","0","0.5","0","0.5","0.5","0.5"],
    "15.0": ["0.5","0","0.5","0.5","0.5","0.5","0.5"],
    "17.5": ["0.5","0.5","0.5","0.5","0.5","0.5","0.5"],
    "20.0": ["1","0.5","0.5","0.5","0.5","0.5","0.5"],
    "22.5": ["1","0.5","0.5","0.5","1","0.5","0.5"],
    "25.0": ["1","0.5","1","0.5","1","0.5","0.5"],
    "27.5": ["0.5","1","0.5","1","0.5","1","1"],
    "30.0": ["0.5","1","1","1","0.5","1","1"],
    "32.5": ["0.5","1","1","1","1","1","1"],
    "35.0": ["1","1","1","1","1","1","1"],
    "37.5": ["1.5","1","1","1","1","1","1"],
    "40.0": ["1.5","1","1","1","1.5","1","1"],
    "42.5": ["1.5","1","1.5","1","1.5","1","1"],
    "45.0": ["1","1.5","1","1.5","1","1.5","1.5"],
    "47.5": ["1","1.5","1.5","1.5","1","1.5","1.5"],
    "50.0": ["1","1.5","1.5","1.5","1.5","1.5","1.5"],
    "52.5": ["1.5","1.5","1.5","1.5","1.5","1.5","1.5"],
    "55.0": ["2","1.5","1.5","1.5","1.5","1.5","1.5"],
    "57.5": ["2","1.5","1.5","1.5","2","1.5","1.5"],
    "60.0": ["2","1.5","2","1.5","2","1.5","1.5"],
    "62.5": ["1.5","2","1.5","2","1.5","2","2"],
    "65.0": ["1.5","2","2","2.0","1.5","2","2"],
    "67.5": ["1.5","2","2","2","2","2","2"],
    "70.0": ["2","2","2","2","2","2","2"],
    "72.5": ["2.5","2","2","2","2","2","2"],
    "75.0": ["2.5","2","2","2","2.5","2","2"],
    "77.5": ["2.5","2","2.5","2","2.5","2","2"],
    "80.0": ["2","2.5","2","2.5","2","2.5","2.5"]
};

/*
 * getDoseString
 * 
 * Returns string with daily warfarin dosing based on a weekly dose
 */
Warfarin.getDoseString = function(dose) {
    var weeklySchedule, str;
    
    if (typeof dose == 'number') {
        dose = dose.toFixed(1);
    }
    
    if (!(dose in Warfarin.dosingSchedule)) {
        throw "getDoseString: Invalid dose: "+dose;
    }
    
    weeklySchedule = Warfarin.dosingSchedule[dose];
    
    str = 'Mon: '+weeklySchedule[0]+', ';
    str += 'Tue: '+weeklySchedule[1]+', ';
    str += 'Wed: '+weeklySchedule[2]+', ';
    str += 'Thr: '+weeklySchedule[3]+', ';
    str += 'Fri: '+weeklySchedule[4]+', ';
    str += 'Sat: '+weeklySchedule[5]+', ';
    str += 'Sun: '+weeklySchedule[6];
    
    return str;
};

/*
 * calcNewDose1
 * 
 * This function will calculate a new weekly warfarin dose and determine schedule
 * for next INR check INR goal of 2.0 - 3.0
 * Reference: http://www.aafp.org/fpm/2005/0500/p77.html
 * 
 * Reteruns
 * { 
 *      dose: - new weekly warfarin dose
 *      nextInr - num of days in which next INR should be drawn
 *      instructions - special instructiosn
 * }
 * 
 */
Warfarin.calcNewDose1 = function(inrRange, dose) {
    var newDose = {dose: null, instructions: null, nextInr: null};
    var min, max;

    if (typeof dose == 'number') {
        dose = dose.toFixed(1);
    }   
    
    if (!(dose in Warfarin.dosingSchedule)) {
        throw "getDoseString: Invalid dose: "+dose;
    }
    
    if (inrRange == '< 1.5') {
        // Increase dose by 10-20%;
        min = dose*1.10;
        max = dose*1.20;
        var a = Math.round(min/2.5)*2.5;
        var b = Math.round(max/2.5)*2.5;
        console.log(min+' '+max);
        console.log(a+' '+b);
        if (a > min) {
            newDose.dose = a;
        } else {
            newDose.dose = b;
        }
        newDose.nextInr = 7;
    } else if (inrRange == '1.5 - 1.9') {
        // Increase dose by 5-10%;
        min = dose*1.05;
        max = dose*1.10;
        var a = Math.round(min/2.5)*2.5;
        var b = Math.round(max/2.5)*2.5;
        console.log(min+' '+max);
        console.log(a+' '+b);
        if (a > min) {
            newDose.dose = a;
        } else {
            newDose.dose = b;
        }
        newDose.nextInr = 14;        
    } else if (inrRange == '2.0 - 3.0') {
        newDose.dose = dose;
        newDose.nextInr = 28;
    } else if (inrRange == '3.1 - 3.9') {
        // Decrease dose by 5-10%;
        min = dose*0.9;
        max = dose*0.95;
        var a = Math.round(min/2.5)*2.5;
        var b = Math.round(max/2.5)*2.5;
        console.log(min+' '+max);
        console.log(a+' '+b);
        if (b < max) {
            newDose.dose = b;
        } else {
            newDose.dose = a;
        }
        newDose.nextInr = 14;        
    } else if (inrRange == '4.0 - 4.9') {
        // Decrease dose by 10%;
        min = dose*0.9;
        newDose.dose = Math.round(min/2.5)*2.5;
        newDose.instructions = "Hold 1 dose";
        newDose.nextInr = 7;
    } else if (inrRange == '>= 5.0') {
        newDose.instructions = "Please check the protocol. Patient may need Vitamin K and/or ER evaluation";
    }
    
    return newDose;
};

/*****************
 * UI FUNCTION
 *****************/

Warfarin.UI.id = {
    dosing5mg: 'N_AFControl_4',
    currentWeeklyDose5mg: 'N_AFControl_5',
    currentWeeklyDoseText: 'N_AFControl_6',
    inrResult: 'N_AFControl_7',
    inrDate: 'N_AFControl_8_Date_dateInput',
    inrTime: 'N_AFControl_8_Time_dateInput',
    doseAdjustment: 'N_AFControl_9',
    newWeeklyDose5mg: 'N_AFControl_10',
    newWeeklyDoseText: 'N_AFControl_11',
    nextINRDate: 'N_AFControl_12_Date_dateInput',
    nextINRTime: 'N_AFControl_12_Time_dateInput',
    nextINRComment: 'N_AFControl_13',
    calcScore: 'calcScore',
    ref: 'ref',
    today: 'today',
    inrMsg: 'inrMsg'
};

Warfarin.UI.refURI = 'http://www.aafp.org/fpm/2005/0500/p77.html';

// Use with Healthand centriq and Use Telerik for time and date controls
Warfarin.UI.hl = true;


Warfarin.UI.isDosing5mg = function() {
    if ($('#'+Warfarin.UI.id.dosing5mg+' option:selected').text() == 'Yes') {
        return true;
    }
    
    return false;
};


/*
 * status - true or false
 */
Warfarin.UI.setDosing5mg = function(status) {
    var yes = $('#'+Warfarin.UI.id.dosing5mg+' option:eq(1)').val();
    var no = $('#'+Warfarin.UI.id.dosing5mg+' option:eq(2)').val();
    
    if (status) {
        $('#'+Warfarin.UI.id.dosing5mg).val(yes);
    } else {
        $('#'+Warfarin.UI.id.dosing5mg).val(no);
    }
};

/*
 * Returns current weekly dose base on 5 mg pills in string format
 */
Warfarin.UI.getCurrentWeeklyDose5mg = function() {
    var dose = $('#'+Warfarin.UI.id.currentWeeklyDose5mg+' option:selected').text();
    
    if (dose == '-select-') {
        return;
    } else {
        return dose.split(' ')[0];
    }
};

Warfarin.UI.setCurrentWeeklyDose5mg = function(dose) {
    var val, txt;
    
    dose = parseFloat(dose);
    
   for (var i = 0; i < $('#'+Warfarin.UI.id.currentWeeklyDose5mg+' option').length; i++) {
        txt = $('#'+Warfarin.UI.id.currentWeeklyDose5mg+' option:eq('+i+')').text();
        if (parseFloat(txt) == dose) {
            val = $('#'+Warfarin.UI.id.currentWeeklyDose5mg+' option:eq('+i+')').val();
            $('#'+Warfarin.UI.id.currentWeeklyDose5mg).val(val);
            break;
        }
    } 
};


Warfarin.UI.setCurrentWeeklyDose = function(dose) {
    $('#'+Warfarin.UI.id.currentWeeklyDoseText).val(dose);
};

Warfarin.UI.onCurrentWeeklyDose5mgChange = function() {
    if (!Warfarin.UI.isDosing5mg()) {
        return;
    }
   
    dose = Warfarin.UI.getCurrentWeeklyDose5mg();
    console.log(dose);
    if (dose) {
        Warfarin.UI.setCurrentWeeklyDose(Warfarin.getDoseString(dose));
    }    
};

/*
 * Returns current weekly dose base on 5 mg pills in string format
 */
Warfarin.UI.getNewWeeklyDose5mg = function() {
    var dose = $('#'+Warfarin.UI.id.newWeeklyDose5mg+' option:selected').text();
    
    if (dose == '-select-') {
        return;
    } else {
        return dose.split(' ')[0];
    }
};

Warfarin.UI.setNewWeeklyDose5mg = function(dose) {
    var val, txt;
    
    dose = parseFloat(dose);
    
   for (var i = 0; i < $('#'+Warfarin.UI.id.newWeeklyDose5mg+' option').length; i++) {
        txt = $('#'+Warfarin.UI.id.newWeeklyDose5mg+' option:eq('+i+')').text();
        if (parseFloat(txt) == dose) {
            val = $('#'+Warfarin.UI.id.newWeeklyDose5mg+' option:eq('+i+')').val();
            $('#'+Warfarin.UI.id.newWeeklyDose5mg).val(val);
            break;
        }
    } 
};

Warfarin.UI.onNewWeeklyDose5mgChange = function () {
    if (!Warfarin.UI.isDosing5mg()) {
        return;
    }
   
    dose = Warfarin.UI.getNewWeeklyDose5mg();
    console.log(dose);
    if (dose) {
        Warfarin.UI.setNewWeeklyDose(Warfarin.getDoseString(dose));
    }    
};

Warfarin.UI.setNewWeeklyDose = function(dose) {
    $('#'+Warfarin.UI.id.newWeeklyDoseText).val(dose);
};

Warfarin.UI.getINRResult = function() {
    return $('#'+Warfarin.UI.id.inrResult+' option:selected').text();
};

Warfarin.UI.setINRResult = function(index) {
    var tmp = $('#'+Warfarin.UI.id.inrResult+' option:eq('+index+')').val();
    
    $('#'+Warfarin.UI.id.inrResult).val(tmp);
};

Warfarin.UI.getINRDate = function() {
    var dateTxt, date;
    
    dateTxt = $('#'+Warfarin.UI.id.inrDate).val();
    
    return new Date(dateTxt);
};

Warfarin.UI.setINRDate = function(date) {
    console.log(date);
    if (Warfarin.UI.hl) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        var dCtl = $find(Warfarin.UI.id.inrDate);
        var tCtl = $find(Warfarin.UI.id.inrTime);
        dCtl.set_selectedDate(date);
        tCtl.set_selectedDate(date);
    } else {
        if (date instanceof Date) {
            $('#'+Warfarin.UI.id.inrDate).val(date.toLocaleDateString()).change();
        } else {
            $('#'+Warfarin.UI.id.inrDate).val(date).change();
        }
    }
};

Warfarin.UI.getDoseAdjustment = function() {
    var yes = $('#'+Warfarin.UI.id.doseAdjustment+' option:eq(1)').val();
    
    return ($('#'+Warfarin.UI.id.doseAdjustment+' option:selected').val() == yes);
};

Warfarin.UI.setDoseAdjustment = function(status) {
    var yes = $('#'+Warfarin.UI.id.doseAdjustment+' option:eq(1)').val();
    var no = $('#'+Warfarin.UI.id.doseAdjustment+' option:eq(2)').val();
    
     $('#'+Warfarin.UI.id.doseAdjustment).val(status ? yes : no);
};

Warfarin.UI.getNextINRDate = function() {
    var dateTxt, date;
    
    dateTxt = $('#'+Warfarin.UI.id.nextINRDate).val();
    
    return new Date(dateTxt);    
};

Warfarin.UI.setNextINRDate = function(date) {
    console.log(date);
    if (Warfarin.UI.hl) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        var dCtl = $find(Warfarin.UI.id.nextINRDate);
        var tCtl = $find(Warfarin.UI.id.nextINRTime);
        dCtl.set_selectedDate(date);
        tCtl.set_selectedDate(date);
    } else {
        if (date instanceof Date) {
            $('#'+Warfarin.UI.id.nextINRDate).val(date.toLocaleDateString()).change();
        } else {
            $('#'+Warfarin.UI.id.nextINRDate).val(date).change();
        }
    }
};

Warfarin.UI.getNextINRDateComment = function() {
    return  $('#'+Warfarin.UI.id.nextINRComment).val();
};

Warfarin.UI.setNextINRDateComment = function(text) {
    $('#'+Warfarin.UI.id.nextINRComment).val(text);
};

Warfarin.UI.clearNewWekklyDose = function() {
    var val = $('#'+Warfarin.UI.id.newWeeklyDose5mg+' option:eq(0)').val();
    $('#'+Warfarin.UI.id.newWeeklyDose5mg).val(val);
    Warfarin.UI.setNewWeeklyDose('');
    Warfarin.UI.setDoseAdjustment(true);
    Warfarin.UI.setNextINRDate('');
    Warfarin.UI.setNextINRDateComment('');
};

Warfarin.UI.addINRButton1 = function() {
    $('#'+Warfarin.UI.id.newWeeklyDose5mg).after('<input id="'+Warfarin.UI.id.calcScore+'" type="button" value="Calculate Score">');
    $('#'+Warfarin.UI.id.calcScore).bind('click', Warfarin.UI.calcINR1);    
};

Warfarin.UI.addRefButton = function() {
    $('#'+Warfarin.UI.id.calcScore).after('<input id="'+Warfarin.UI.id.ref+'" type="button" value="Reference">');
    $('#'+Warfarin.UI.id.ref).bind('click', Warfarin.UI.onRef);
};

Warfarin.UI.addTodayButton = function() {
    // $('#'+Warfarin.UI.id.inrDate).before('<input id="'+Warfarin.UI.id.today+'" type="button" value="Today">');
    $('#N_AFControl_8_Time_wrapper').after('<input id="'+Warfarin.UI.id.today+'" type="button" value="Today">');
    $('#'+Warfarin.UI.id.today).bind('click', Warfarin.UI.onToday);
};

Warfarin.UI.calcINR1 = function() {
    var dose, doseText, inrRange, newDose, inrDate;
    
    if (!Warfarin.UI.isDosing5mg()) {
        Warfarin.UI.msgInr('To use dosing calculator you must use 5 mg dosing schedule.');
        return;
    }
    
    dose = Warfarin.UI.getCurrentWeeklyDose5mg();
    if (dose == '-select-') {
        Warfarin.UI.msgInr('You must select current dose.');
        return;        
    }
    
    inrRange = Warfarin.UI.getINRResult();
    if (inrRange == '-select-') {
        Warfarin.UI.msgInr('You must select INR result.');
        return;        
    }

    newDose = Warfarin.calcNewDose1(inrRange, dose);
    if (newDose.dose) {
        Warfarin.UI.setNewWeeklyDose5mg(newDose.dose);
        if (newDose.instructions) {
            doseText = newDose.instructions+' then\n';
            doseText += Warfarin.getDoseString(newDose.dose);
        } else {
            doseText = Warfarin.getDoseString(newDose.dose);
        }
        if (newDose.dose-dose > 0) {
            doseText += '\nIncrease: ';
            doseText += ((newDose.dose-dose)/dose*100).toFixed(1)+'%';
        } else if(newDose.dose-dose < 0)  {
            doseText += '\nDecrease: ';
            doseText += ((dose-newDose.dose)/dose*100).toFixed(1)+'%';
        }
        Warfarin.UI.setNewWeeklyDose(doseText);
        
        Warfarin.UI.setDoseAdjustment(dose != newDose.dose);
        if (newDose.nextInr) {
            Warfarin.UI.setNextINRDateComment('Check INR in '+newDose.nextInr+' days');
            inrDate = Warfarin.UI.getINRDate();
            if (inrDate.valueOf() !== NaN) {
                inrDate.setDate(inrDate.getDate()+newDose.nextInr);
                Warfarin.UI.setNextINRDate(inrDate);
            }
            
        }
    } else {
        Warfarin.UI.clearNewWekklyDose();
        Warfarin.UI.msgInr(newDose.instructions);
        return;
    }
};

Warfarin.UI.onRef = function() {
    var win = window.open(Warfarin.UI.refURI);
    win.focus();     
};

Warfarin.UI.onToday = function() {
    Warfarin.UI.setINRDate(new Date());
};

Warfarin.UI.msgInr = function(txt) {
    $('#'+Warfarin.UI.id.inrMsg).dialog('option', 'title', 'INR Message');
    if (typeof txt == 'string') {
        $('#'+Warfarin.UI.id.inrMsg).text(txt);
    }
    $('#'+Warfarin.UI.id.inrMsg).dialog('open');    
};

Warfarin.UI.initINRCalc1 = function() {
    Warfarin.UI.addINRButton1();
    Warfarin.UI.addRefButton();
    Warfarin.UI.addTodayButton();
    
    $('#'+Warfarin.UI.id.currentWeeklyDose5mg).bind('change', Warfarin.UI.onCurrentWeeklyDose5mgChange);
    $('#'+Warfarin.UI.id.newWeeklyDose5mg).bind('change', Warfarin.UI.onNewWeeklyDose5mgChange);
       
    $('<div id="inrMsg"></div>').appendTo('body').dialog({autoOpen: false});
    
    /*
     * Testing initalization
     */
    Warfarin.UI.setDosing5mg(true);
    Warfarin.UI.setCurrentWeeklyDose5mg(30);
    Warfarin.UI.setCurrentWeeklyDose(Warfarin.getDoseString(30));
    Warfarin.UI.setINRResult(3);
    Warfarin.UI.setINRDate(new Date());
};


