// ==UserScript==
// @name         SNOW Improvements
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @description  Copy-Paste Building Code, today option, etc.
// @author       You
// @grant        GM_setValue
// @grant        GM_getValue
// @match        *https://snow-goa.fujitsu.ca:9443/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477797/SNOW%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/477797/SNOW%20Improvements.meta.js
// ==/UserScript==

const $ = window.jQuery;
const pageURL = window.location.href;


function TextBuildCodeSet(buildCodeForm) {
    const buildCodeTextVal = $('#buildCodeBox').val();
    buildCodeForm.val(buildCodeTextVal);
    __doPostBack('ctl00$MainContent$ddBuildingCode','');
}

function getDateMM_DD_YYY(date) {
    const month = date.getMonth() + 1;
    let retString = month + "/" + date.getDate() + "/" + date.getFullYear();
    //let date2 = new Date()
    //let retString = date2.getMonth();
    return retString
}

const buildCodeForm = $("select[name='ctl00$MainContent$ddBuildingCode']");
//buildCodeForm.val(2637);


let InputBoxNoOnchange = '<input name="buildCode" type="text" id="buildCodeBox" onkeydown="return (event.keyCode != 13)" style="width:95%;">';
let InputBoxOld = '<input name="buildCode" onchange="'+"javascript:setTimeout('__doPostBack(\\'ctl00$MainContent$ddBuildingCode\\',\\'\\')"+'" type="text" id="buildCodeBox" onkeydown="return (event.keyCode != 13)" style="width:95%;">';
let InputBox = '<input name="buildCode type="text" id="buildCodeTextBox" onkeydown="return (event.keyCode != 13)" style="width:95%;">';
//let InputBox = '<input name="ctl00$MainContent$ddBuildingCode" onchange="'+"javascript:setTimeout('__doPostBack(\\'ctl00$MainContent$ddBuildingCode\\',\\'\\')', 0)"+'" type="text" id="buildCodeBox" onkeydown="return (event.keyCode != 13)" style="width:95%;">';
const InputBoxId = $('#buildCodeBox');
//console.log($('option').filter(function () {return $(this).html() == "B0001A";}).val());

buildCodeForm.parent().prepend(InputBox);
//buildCodeForm.remove();
//console.log($('#buildCodeBox').val());
//buildCodeForm.val(InputBoxId.val())
console.log($('#buildCodeTextBox').val());

const dateDeployedForm = $('input[name="ctl00$MainContent$txtDate"]');
const calendarIcon = $('input[name="ctl00$MainContent$Calimg1"]');

dateDeployedForm.removeAttr("style");
dateDeployedForm.attr("style", 'background-color:White; width:73.3%');

const todayButton = '<button id="todayButton" type="button" style="position:relative; left:18px; font-weight:bold">Today</button>' //type="button" so it doesn't submit a form
calendarIcon.parent().append(todayButton);


const monitorArmsForm = $('select[name="ctl00$MainContent$ddMonitorArmAtDesk"]');
const monitorArmsOpt = monitorArmsForm.children();
const monitorBlankCode = monitorArmsOpt.filter(function() {return $(this).html() == "";}).val();
const monitorFalseCode = monitorArmsOpt.filter(function() {return $(this).html() == "False";}).val();
const deviceTypeForm = $('select[name="ctl00$MainContent$ddDeviceType"]');
const deviceMonitorCode = deviceTypeForm.children().filter(function() {return $(this).html() == "Monitor";}).val();

if (monitorArmsForm.val() == monitorBlankCode && deviceTypeForm.val() == 1) { //deviceTypeForm.val() is 1 when it has the "Monitor" entry
    monitorArmsForm.val(monitorFalseCode);
}

const computerRoleForm = $('select[name="ctl00$MainContent$ddCompanyRole"]');
const computerRoleOpt = computerRoleForm.children();
const blankRoleCode = computerRoleOpt.filter(function () {return $(this).html() == "";}).val();
const userRoleCode = computerRoleOpt.filter(function () {return $(this).html() == "User";}).val();
if (computerRoleForm.val() == blankRoleCode) {
    computerRoleForm.val(userRoleCode); //This is the value of the "User" selection
}


$("#buildCodeTextBox" ).on( "change", function() {
    let buildCodeTextVal = $('#buildCodeTextBox').val();
    if (buildCodeTextVal[buildCodeTextVal.length - 1] == ' ') {
        buildCodeTextVal = buildCodeTextVal.substring(0, buildCodeTextVal.length - 1);
    }
    const buildCodeOpt = $('#MainContent_ddBuildingCode').children();
    let valueFromCode = buildCodeOpt.filter(function () {return $(this).html() == buildCodeTextVal;}).val()
    buildCodeForm.val(valueFromCode);
    //console.log(buildCodeTextVal);
    __doPostBack('ctl00$MainContent$ddBuildingCode','');
});

$("#todayButton").on("click", function() {
    const currentDate = new Date();
    const todayVal = getDateMM_DD_YYY(currentDate);
    //console.log("todayVal is "+todayVal);
    dateDeployedForm.val(todayVal);
});

function tabToField(event, selector) {
    if (event.which == 9) { //If the key clicked is "Tab"
        event.preventDefault(); //To prevent tab from selecting a different box
        $(selector).focus(); //highlights the box for editing
    }
}

const statusFieldVal = $('#MainContent_ddHardwareStatus').val();
const itsmField = '#MainContent_txtITSMNo';
const buildTextField = '#buildCodeTextBox';
const floorField = '#MainContent_txtFloor';
const waybillField = '#MainContent_txtWaybillGoA';
const defectField = '#MainContent_txtHardwareDefect';
const updateButton = '#MainContent_btnUpdate';
const hardwareStatusOpt = $('#MainContent_ddHardwareStatus').children();
const deployedStandardUseCode = hardwareStatusOpt.filter(function () {return $(this).html() == "Deployed-Standard Use";}).val(); //These three functions get the value of the text of the Hardware-Status
const shippedRepairCode = hardwareStatusOpt.filter(function () {return $(this).html() == "Shipped-Repair";}).val();              //dropdown, after it kept randomly changing.
const shippedReuseCode = hardwareStatusOpt.filter(function () {return $(this).html() == "Shipped-Reuse";}).val();

if (statusFieldVal == deployedStandardUseCode) {
    $('#MainContent_txtUser').keydown(function(e) {
        tabToField(e, itsmField);
    });

    $(itsmField).keydown(function(e) {
        tabToField(e, buildTextField);
    });

    $(buildTextField).keydown(function(e) {
        tabToField(e, floorField);
    });

    $(floorField).keydown(function(e) {
        tabToField(e, updateButton);
    });
}

if (statusFieldVal == shippedRepairCode) {
    $(itsmField).keydown(function(e) {
        tabToField(e, waybillField);
    });

    $(waybillField).keydown(function(e) {
        tabToField(e, defectField);
    });

    $(defectField).keydown(function(e) {
        tabToField(e, updateButton);
    });
}

if (statusFieldVal == shippedReuseCode) {
    $(itsmField).keydown(function(e) {
        tabToField(e, waybillField);
    });

    $(waybillField).keydown(function(e) {
        tabToField(e, updateButton);
    });
}

const ministryForm = $('#MainContent_ddMinistry');
//ministryForm.val("4098");
//ministryForm.on( "change", function() {
//$( document ).ready(function() {
//    __doPostBack('ctl00$MainContent$ddMinistry','');
//});