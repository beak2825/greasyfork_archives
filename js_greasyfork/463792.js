// ==UserScript==
// @name         W.O.A.A. Development Edition
// @namespace    *://*.aviationweather.gov/gfa/*
// @version      0.75A
// @description  The WOAA Script (Weather Observer's Artificial Assistant) was created with Weather Observers in mind. This script provides numerous useful utilities such as an error detector, Report Quality checker, and report storage.
// @author       Kenneth Anderson, IV
// @match        *://*.aviationweather.gov/gfa/*
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/463792/WOAA%20Development%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/463792/WOAA%20Development%20Edition.meta.js
// ==/UserScript==
//©2023 Kenneth William Anderson IV. All Rights Reserved.
//No part of this script may be modified, redistributed, or sold without explicit permission.

//Startup Message:
let WOAAVERSION = "0.75A", WOAAEDITION = "Development", StartupWizardActive = false;
let Stage = 1;
const pageWidth = document.body.clientWidth;
const pageHeight = document.body.clientHeight;
let CustomAlertParent = document.getElementById("alert-container"); //will be set when the script starts up after the page loads.
let StartupPositionX = pageWidth/2-175;
let Year = new Date().getUTCFullYear();
console.log(`You are using WOAA Version ${WOAAVERSION}.`);
console.log(`Helpful "hidden" commands.\n"q" key: Check past 8 hours of reports from the home station\n"z" key: Search for Specific Report.\n"r" key: Check typed report for errors\n"\\" key: Provides WOAA Version.\n"=" key: Gets and Returns Storage Statistics\n"[" key: Cycles Through All CWO Station Reports and Checks for Errors.\n"e" key: Generates support ticket`);
console.log(`© ${Year} Kenneth William Anderson IV. All Rights Reserved.`);
console.log(`No part of this script may be modified, redistributed, or sold without explicit permission.`);


//GLOBAL VARIABLES
var CurrentExpandedSite = "";
let HistoryMode = "view";
//settings
let settingsEnDi = false, wasCheckedBefore = false;
var SecondlyInterval;
var CurrentElement;
var HSTN, HYER, HMTH, HDAY;
let [ SelectedStation, SelectedYear, SelectedMonth, SelectedDay ] = [ "all", "all", "all", "all" ];
let audio = new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bonus.wav');
let Months = [ "", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
let WOAASETSE = [ [ "false", ""], ["false", ""], "55", [ "false", "" ], [ "true", "checked" ], ["false", ""]];
let WOAASETST = [ [ "false", ""], [ "false", ""], [ "false", ""], [ "true", "checked"]];
let WOAAER = [ ["true","checked"], ["true", "checked"], ["true","checked"], ["true","checked"] ];
let WOAASETPR = [ [ "false", ""], [ "true", "checked"], ["true", "checked"], [ "true", "checked"], [ "true", "checked"], [ "true", "checked"], [ "true", "checked"], [ "true", "checked"], [ "true", "checked"], [ "true", "checked"] ];
let UID;
//report filters setting
let ReportIncludes = "", OnlyErrors = false;
//checks if the settings have already been stored in the localstorage, if so, assume their settings. Otherwise, store them and set them to the default setting.

function CheckSettings(){
    localStorage.getItem("WOAAVERSION") == null ? localStorage.setItem("WOAAVERSION", WOAAVERSION) : WOAAVERSION = localStorage.getItem('WOAAVERSION');
    localStorage.getItem("WOAASETSE") == null ? localStorage.setItem("WOAASETSE", JSON.stringify(WOAASETSE)) : WOAASETSE = JSON.parse(localStorage.getItem('WOAASETSE'));
    localStorage.getItem("WOAASETST") == null ? localStorage.setItem("WOAASETST", JSON.stringify(WOAASETST)) : WOAASETST = JSON.parse(localStorage.getItem('WOAASETST'));
    localStorage.getItem("WOAAERDEFAULT") == null ? localStorage.setItem("WOAAERDEFAULT", JSON.stringify(WOAAER)) : WOAAER = JSON.parse(localStorage.getItem('WOAAERDEFAULT'));
    localStorage.getItem("WOAASETPR") == null ? localStorage.setItem("WOAASETPR", JSON.stringify(WOAASETPR)) : WOAASETPR = JSON.parse(localStorage.getItem('WOAASETPR'));
    localStorage.getItem("UID") == null ? localStorage.setItem("UID", genID()) : UID = localStorage.getItem("UID");
    wasCheckedBefore = WOAASETST[3][0];
}


//checks for home station
var HomeSTN = localStorage.getItem("HomeSTN");
//list of CWO stations in order to differentiate between ATC and Weather Observers. Primarily useful for data gathering, in order to determine the decrease in quality between CWO and Obstrollers.
const CWOSTNS = [
    "PABE",
    "PABI",
    "KABQ",
    "PABT",
    "PACV",
    "PADU",
    "PAFA",
    "KAFW",
    "PAIL",
    "PAJN",
    "PAKN",
    "KALB",
    "PAMR",
    "PANC",
    "PAOR",
    "KAPA",
    "PAPG",
    "PASC",
    "PASD",
    "PASI",
    "PATA",
    "PAVD",
    "PAWG",
    "KATL",
    "KAUS",
    "KBDL",
    "KBGR",
    "KBHM",
    "KBIL",
    "KBNA",
    "KBOS",
    "KBTV",
    "KBUF",
    "KBWI",
    "KCAE",
    "KCAK",
    "KCHA",
    "KCHS",
    "KCLE",
    "KCLT",
    "KCMH",
    "KCOS",
    "KCRP",
    "KCRW",
    "KCVG",
    "KDAB",
    "KDAL",
    "KDAY",
    "KDCA",
    "KDEN",
    "KDFW",
    "KDLH",
    "KDSM",
    "KDTW",
    "KELP",
    "KEUG",
    "KEWR",
    "KFAT",
    "KFLL",
    "KFSD",
    "KFWA",
    "PFYU",
    "KGEG",
    "KGFK",
    "KGRR",
    "KGSO",
    "PHNL",
    "KHOU",
    "KHSV",
    "KIAD",
    "KIAH",
    "KICT",
    "KIND",
    "KISP",
    "KJAN",
    "KJAX",
    "KJFK",
    "TJSJ",
    "KLAS",
    "KLAX",
    "KLBB",
    "KLGA",
    "KLIT",
    "KMCI",
    "KMCO",
    "KMDT",
    "KMDW",
    "KMEM",
    "KMHT",
    "KMIA",
    "KMKE",
    "KMKG",
    "KMOB",
    "KMSN",
    "KMSP",
    "KMSY",
    "KOAK",
    "KOKC",
    "KOMA",
    "KONT",
    "KORD",
    "KPBI",
    "KPDX",
    "KPHL",
    "KPHX",
    "KPIT",
    "KPTK",
    "KPVD",
    "KPWM",
    "KRDU",
    "KRFD",
    "KRIC",
    "KRNO",
    "KROA",
    "KROC",
    "KSAN",
    "KSAT",
    "KSAV",
    "KSDF",
    "KSEA",
    "KSFO",
    "KSHV",
    "KSJC",
    "KSLC",
    "KSMF",
    "KSNA",
    "KSTL",
    "KSYR",
    "KTLH",
    "KTPA",
    "KTRI",
    "KTUL",
    "KTVC",
    "KTYS",
    "KYNG"
];
const CWOSTNSMETARS = [
    "PABE 53",
    "PABI 53",
    "KABQ 52",
    "PABT 53",
    "PACV 53",
    "PADU 56",
    "PAFA 53",
    "KAFW 53",
    "PAIL 53",
    "PAJN 53",
    "PAKN 54",
    "KALB 51",
    "PAMR 53",
    "PANC 53",
    "PAOR 53",
    "KAPA 53",
    "PAPG 56",
    "PASC 53",
    "PASD 56",
    "PASI 53",
    "PATA 52",
    "PAVD 56",
    "PAWG 56",
    "KATL 52",
    "KAUS 53",
    "KBDL 51",
    "KBGR 53",
    "KBHM 53",
    "KBIL 53",
    "KBNA 53",
    "KBOS 54",
    "KBTV 54",
    "KBUF 54",
    "KBWI 54",
    "KCAE 56",
    "KCAK 51",
    "KCHA 53",
    "KCHS 56",
    "KCLE 51",
    "KCLT 52",
    "KCMH 51",
    "KCOS 54",
    "KCRP 51",
    "KCRW 54",
    "KCVG 52",
    "KDAB 53",
    "KDAL 53",
    "KDAY 56",
    "KDCA 52",
    "KDEN 53",
    "KDFW 53",
    "KDLH 55",
    "KDSM 54",
    "KDTW 53",
    "KELP 51",
    "KEUG 54",
    "KEWR 51",
    "KFAT 53",
    "KFLL 53",
    "KFSD 56",
    "KFWA 54",
    "PFYU 56",
    "KGEG 53",
    "KGFK 53",
    "KGRR 53",
    "KGSO 54",
    "PHNL 53",
    "KHOU 53",
    "KHSV 53",
    "KIAD 52",
    "KIAH 53",
    "KICT 53",
    "KIND 54",
    "KISP 56",
    "KJAN 54",
    "KJAX 56",
    "KJFK 51",
    "TJSJ 56",
    "KLAS 56",
    "KLAX 53",
    "KLBB 53",
    "KLGA 51",
    "KLIT 53",
    "KMCI 53",
    "KMCO 53",
    "KMDT 56",
    "KMDW 53",
    "KMEM 54",
    "KMHT 53",
    "KMIA 53",
    "KMKE 52",
    "KMKG 55",
    "KMOB 56",
    "KMSN 53",
    "KMSP 53",
    "KMSY 53",
    "KOAK 53",
    "KOKC 52",
    "KOMA 52",
    "KONT 53",
    "KORD 51",
    "KPBI 53",
    "KPDX 53",
    "KPHL 54",
    "KPHX 51",
    "KPIT 51",
    "KPTK 53",
    "KPVD 51",
    "KPWM 51",
    "KRDU 51",
    "KRFD 54",
    "KRIC 54",
    "KRNO 55",
    "KROA 54",
    "KROC 54",
    "KSAN 51",
    "KSAT 51",
    "KSAV 53",
    "KSDF 56",
    "KSEA 53",
    "KSFO 56",
    "KSHV 56",
    "KSJC 53",
    "KSLC 54",
    "KSMF 53",
    "KSNA 51",
    "KSTL 54",
    "KSYR 54",
    "KTLH 53",
    "KTPA 53",
    "KTRI 53",
    "KTUL 53",
    "KTVC 53",
    "KTYS 53",
    "KYNG 51"
];
var AlertActive = false;
let tADM = 0;
let tRPTS = 0;
let tHIST = 0;
let reports = [];
let METARs = 0, SPECIs = 0, CORs = 0, ERRORS = [];
let UpdateCalibrated = false;
//interval id
var UpdateInterval;
//end of global variables


//This function starts the program
function Start(){
    if(!localStorage.getItem("HomeSTN") && localStorage.getItem("FirstStart") != "1"){
        let HomeSTN = prompt("Enter a Home Station, if applicable.", "K/P/TXXX");
        if(HomeSTN.length == 4){
            localStorage.setItem("HomeSTN", HomeSTN.toUpperCase());
            HomeSTN = HomeSTN.toUpperCase();
        }
    }
    var node = document.createElement("style");
    node.innerHTML = `
         .fixed-top{
              border-bottom: 2px black solid;
         }
         .UpdateBox{
              position: absolute;
              width: 470px;
              height: 90px;
              background-color: rgba(33, 37, 41);
              border-radius: 0px 0px 15px 15px;
              border: 2px black solid;
              border-top: none;
              color: white;
              left: ${StartupPositionX-80}px;
              padding-left: 8px;
              padding-top: 8px;
              top: 67px;
              display: inline;
              z-index: 110000!important;
         }
         .PopupBox{
              color: white;
              width: 470px;
              height: 320px;
              background-color: rgba(33, 37, 41);
              position: absolute;
              z-index: 110000!important;
              border: 2px black solid;
              overflow-y: scroll;
              overflow-x: hidden;
         }
         .StartupBox{
             padding-left: 10px;
             padding-right: 10px;
             position: absolute;
             border: 2px black solid;
             border-radius: 15px;
             left: ${StartupPositionX}px;
             color: black;
             width: 350px;
             height: 600px;
             background-color: #ADD8E6;
             z-index: 110000!important;
         }
         .WOAABOXMAIN{
              width: 450px;
              padding: none;
              background-color: rgba(33, 37, 41);
         }
         .WOAABTN {
              font-family: url("https://fonts.googleapis.com/css2?family=Geologica:wght@300&display=swap");
              src: url('https://fonts.googleapis.com/css2?family=Outfit&display=swap');
              cursor: pointer;
              font-size: 16px;
              padding: 4px 8px 4px 8px;
              margin-bottom: 4px;
              color: white;
              background: rgb(50 50 50);
              border-radius: 3px;
              border-style: solid;
              border-width: 2px;
              border-color: rgb(60 60 60);
              transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
              transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
              transition-duration: 50ms;
         }
         .WOAABTN:hover {
            background: rgb(60 60 60);
            border-color: rgb(80 80 80);
         }
         .WOAABTN:focus {
           background: rgb(50 60 50);
           border-color: rgb(50 100 50);
         }
         #btnSetts{
             color: rgba(255, 255, 255);
             position: absolute;
             width: 95px;
             height: 35px;
             z-index: 110001!important;
             left: 5px;
             top: ${(pageHeight*0.43)+72}px;
         }
         #btnRPT{
             color: rgba(255, 255, 255);
             position: absolute;
             width: 95px;
             height: 35px;
             z-index: 110001!important;
             left: 5px;
             top: ${pageHeight*0.43}px;
         }
         #btnHist{
             color: rgba(255, 255, 255);
             position: absolute;
             width: 95px;
             height: 35px;
             z-index: 110001!important;
             left: 5px;
             top: ${(pageHeight*0.43)+36}px;
         }
         #btnErr{
             color: rgba(255, 255, 255);
             position: absolute;
             width: 95px;
             height: 35px;
             z-index: 110001!important;
             left: 5px;
             top: ${(pageHeight*0.43)+108}px;
         }
         .CloseTab{
             width: 25px;
             right: 0;
             position: sticky;
             text-align: center;
             height: 25px;
             background-color: red;
             color: white;
             border-right: 2px black solid;
             border-bottom: 2px black solid;
         }
         .MoveTab{
             position: sticky;
             top: 0;
             height: 25px;
             background-color: white;
             border-bottom: 2px black solid;
         }
         hr{
             width: 97%;
             height: 3px;
             margin-bottom: 0px;
             background-color: white;
             text-align: center;
         }
         p::-webkit-scrollbar {
             display: none;
         }
         input::-webkit-outer-spin-button,
         input::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
         }
         .ListedReport{
             font-family: monospace; /* easier to read over due to crosses in 0's */
         }
         .ListedReport:hover{
             background-color: rgb(50 54 59);
         }
         #Filters{
             text-align: center;
             width: 85%;
             margin-left: 24px;
             background-color: #c4c1c1;
             border-radius: 15px;
             border: 2px black solid;
         }
         #Filters:focus{
             background-color: #a8a8a8;
         }
         #Filters:placeholder{
             color: black;
         }
         .HistItem {
           font-family: 'monospace', sans-serif;
           src: url('https://fonts.googleapis.com/css2?family=Outfit&display=swap');
           font-weight: bold;
           display: inline-block;
           cursor: pointer;
           font-size: 18px;
           padding: 3px 3px 3px 3px;
           margin-left: 20px;
           margin-top: 30px;
           margin-bottom: 4px;
           color: white;
           background: rgb(50 50 50);
           border-radius: 3px;
           border-style: solid;
           border-width: 2px;
           border-color: rgb(60 60 60);

           transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
           transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
           transition-duration: 50ms;
         }
         .HistItem:hover {
           background: rgb(60 60 60);
           border-color: rgb(80 80 80);
         }
         .HistItemDay {
           font-family: 'Outfit', sans-serif;
           src: url('https://fonts.googleapis.com/css2?family=Outfit&display=swap');
           font-weight: bold;
           display: inline-block;
           cursor: pointer;
           font-size: 18px;
           padding-top: 15px;
           padding: 3px 3px 3px 3px;
           color: white;
           background: rgb(50 50 50);
           border-radius: 3px;
           border-style: solid;
           border-width: 2px;
           border-color: rgb(60 60 60);

           transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
           transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
           transition-duration: 50ms;
         }
         .HistItemDay:hover {
           background: rgb(60 60 60);
           border-color: rgb(80 80 80);
         }
         /* Following Styles Code Copied from W3Schools */
         .switch {
         position: relative;
         display: inline-block;
         width: 60px;
         height: 34px;
         }
         .switch input {
         opacity: 0;
         width: 0;
         height: 0;
         }
         .slider {
         position: absolute;
         cursor: pointer;
         top: 0;
         left: 0;
         right: 0;
         bottom: 0;
         background-color: #ccc;
         -webkit-transition: .4s;
         transition: .4s;
         }
         .slider:before {
         position: absolute;
         content: "";
         height: 26px;
         width: 26px;
         left: 4px;
         bottom: 4px;
         background-color: white;
         -webkit-transition: .4s;
         transition: .4s;
         }
         input:checked + .slider {
         background-color: #2196F3;
         }
         input:focus + .slider {
         box-shadow: 0 0 1px #2196F3;
         }
         input:checked + .slider:before {
         -webkit-transform: translateX(26px);
         -ms-transform: translateX(26px);
         transform: translateX(26px);
         }
         /* Rounded sliders */
         .slider.round {
         border-radius: 34px;
         }
         .slider.round:before {
         border-radius: 50%;
         }
         /* end of copied styles */
         .UnselectedBTN{
             color: white;
             background-color: #373535;
         }
         .SelectedBTN{
             color: white;
             background-color: #676565;
         }
         .HistRPTItem{
             font-family: monospace;
             border: 2px #4c4c4cc solid;
             background-color: #1e1d1d;
             padding: 4px;
             color: white;
         }
         .HistRPTItem:hover{
             border: 2px #3c3c3c solid;
             background-color: #292828;
         }
         .HistRPTItem:focus{
             background-color: #363535;
             border: 2px #313030 solid;
         }
         .WOAASETTSBOX{
             width: 500px;
             height: 45%;
             background: rgb(37 37 37);
             color: white;
             position: absolute;
             overflow-y: scroll;
             overflow-x: hidden;
             border: 2px black solid;
         }
         .WOAABOXSETTS{
              width: 480px;
              padding: none;
              padding-left: 5px;
         }
         /* The following scrollbar styling is copied from W3Schools and slightly modified to work better for this script. */
         ::-webkit-scrollbar {
           width: 13px;
         }
         ::-webkit-scrollbar-track {
           background: #f1f1f1;
         }
         ::-webkit-scrollbar-thumb {
           background: #888;
         }
         ::-webkit-scrollbar-thumb:hover {
           background: #555;
         }
         .divAdvSItem{
             border-radius: 5px;
             border: 2px gray solid;
             margin: 5px;
             width: 97%;
             padding: 6px;
         }
         input{
             background-color: #f2f2f2;
         }
         input:hover{
             background-color: #ffffff;
         }
         input:focus{
             background-color: #ffffff;
         }
         `;
    document.head.appendChild(node);
    document.getElementById("time_slider") ? document.getElementById("time_slider").style.display = "none" : console.log("Script failed to remove element 'time_slider'");
    document.getElementById("legend_button") ? document.getElementById("legend_button").style.display = "none" : console.log("Script failed to remove element 'legend_button'");
    document.getElementById("slider_time_value_container") ? document.getElementById("slider_time_value_container").style.display = "none" : console.log("Script failed to remove element 'slider_time_value_container'");
    //if(localStorage.getItem("WOAAVERSION") != WOAAVERSION && localStorage.getItem("WOAAVERSION") != null){
    //    UpdateHandler(localStorage.getItem("WOAAVERSION"));
    //    return;
    //}
    CheckSettings();
    if(localStorage.getItem("FirstStart") != "1"){
        //first start
        localStorage.setItem("FirstStart", "1");
        StartupWizardActive = true;
        StartupWizard();
    }
    else{
        FinishStartup();
    }
}


function FinishStartup(){
    let node = document.createElement("div");
    node.className = "WOAASETTSBOX";
    node.id = "WOAASETTINGS";
    node.style.zIndex = "11000";
    node.style.right = `0px`;
    node.style.bottom = `0px`;
    node.style.display = "none";
    node.style.fontSize = "16px";
    node.innerHTML = `
    <div class="WOAABOXSETTS">
   <div class="CloseTab" id="WOAASETTINGSS" style="display: none;"><b>X</b></div>
   <fieldset id="fsGeneralSettings" style="margin-top: 12px;"> <!-- was gonna use fieldsets and legends because I prefer that design but the CSS somewhere is impeding that idea. So perish the thought. -->
    <h6 style="color: white; text-align: center;"><b>General Settings</b></h6>
   <input type="checkbox" class="WOAASETSE" id="CopyRPTQC" ${WOAASETSE[0][1]}>
   <label for="CopyRPTQC">Copy Reports on Click</label><br>
   <input type="checkbox" class="WOAASETSE" id="PlaySoundOnError" ${WOAASETSE[1][1]}>
   <label for="PlaySoundOnError" title="When a custom ALERT for an error is detected, play a sound.\nUseful if in another tab with this script running in the background.">Play Sound On Alert</label><br>
   Check Home STN H+<input class="WOAASETSE" type="number" id="whenToCheck" max="59" min="0" value="${+WOAASETSE[2]}"><br>
   </fieldset>
   <hr>
<fieldset id="fsReportStorageSettings" style="margin-top: 12px;">
    <h6 style="color: white; text-align: center;"><b>Report Storage Settings</b></h6>
   <input type="checkbox" class="WOAASETST" id="StoreAUTO" ${WOAASETST[0][1]}>
   <label for="StoreAUTO" title="Store reports disseminated by AUTOmatic stations.">Store AUTO Reports</label><br>
   <input type="checkbox" class="WOAASETST" id="StoreATC" ${WOAASETST[1][1]}>
   <label for="StoreATC" title="Store Reports disseminated by stations manned by Air Traffic Controllers.">Store ATC Reports</label><br>
   <input type="checkbox" class="WOAASETST" id="StoreCWO" ${WOAASETST[2][1]}>
   <label for="StoreCWO" title="Store Reports disseminated by stations manned by Certified Weather Observers.">Store CWO Reports</label><br>
   <input type="checkbox" class="WOAASETST" id="StoreHome" ${WOAASETST[3][1]}>
   <label for="StoreHome" title="Store ONLY reports disseminated by the home station set herein">Only Store Home Station Reports</label>
   </fieldset>
   <hr>
   <fieldset id="fsGeneralErrDetSettings" style="margin-top: 12px;">
    <h6 style="color: white; text-align: center;"><b>General Error Detection Settings</b></h6>
   <input type="checkbox" class="WOAASETER" id="DetectExtremeAltimeter" ${WOAAER[0][1]}>
   <label for="DetectExtremeAltimeter" title="Detects a record high or low altimeter setting as an error.">Detect Extreme Altimeter</label><br>
   <input type="checkbox" class="WOAASETER" id="DetectExtremeTemp" ${WOAAER[1][1]}>
   <label for="DetectExtremeTemp" title="Detects a record high or low temperature as an error.">Detect Extreme Temperature</label><br>
   <input type="checkbox" class="WOAASETER" id="DetectExtremeDewPoint" ${WOAAER[2][1]}>
   <label for="DetectExtremeDewPoint" title="Detects a record high or low dew point as an error.">Detect Extreme Dew Point</label><br>
   <input type="checkbox" class="WOAASETER" id="DetectWind" ${WOAAER[3][1]}>
   <label for="DetectWind" title="Detects invalid winds.">Detect Invalid Winds</label>
   </fieldset>
   <hr>
   <fieldset id="fsReportViewerSettings" style="margin-top: 12px;">
    <h6 style="color: white; text-align: center;"><b>Report Viewer Settings</b></h6>
   <input type="checkbox" class="WOAASETPR" id="ShowStnType" ${WOAASETPR[0][1]}>
   <label for="ShowStnType">Show Station Type(CWO/ATC/AUTO)</label><br>
   <input type="checkbox" class="WOAASETPR" id="ShowDate" ${WOAASETPR[1][1]}>
   <label for="ShowDate">Show Date/Time Section</label><br>
   <input type="checkbox" class="WOAASETPR" id="ShowModifier" ${WOAASETPR[2][1]}>
   <label for="ShowModifier">Show Report Modifier</label><br>
   <input type="checkbox" class="WOAASETPR" id="ShowWind" ${WOAASETPR[3][1]}>
   <label for="ShowWind">Show Wind Section</label><br>
   <input type="checkbox" class="WOAASETPR" id="ShowVis" ${WOAASETPR[4][1]}>
   <label for="ShowVis">Show Visibility Section</label><br>
   <input type="checkbox" class="WOAASETPR" id="ShowPWX" ${WOAASETPR[5][1]}>
   <label for="ShowPWX">Show Pres Wx Section</label><br>
   <input type="checkbox" class="WOAASETPR" id="ShowSkyCond" ${WOAASETPR[6][1]}>
   <label for="ShowSkyCond">Show Sky Condition Section</label><br>
   <input type="checkbox" class="WOAASETPR" id="ShowTempDP" ${WOAASETPR[7][1]}>
   <label for="ShowTempDP">Show Temp/Dew Point Section</label><br>
   <input type="checkbox" class="WOAASETPR" id="ShowAltimeter" ${WOAASETPR[8][1]}>
   <label for="ShowAltimeter">Show Altimeter Section</label><br>
   <input type="checkbox" class="WOAASETPR" id="ShowRemarks" ${WOAASETPR[9][1]}>
   <label for="ShowRemarks">Show Remarks Section</label><br>
   </fieldset>
   <hr>
   <fieldset id="fsAdvErrDet" style="margin-top: 12px;">
    <h6 style="color: white; text-align: center;"><b>Advanced Error Detection Settings</b></h6>
   <input type="text" id="CustomSiteAddition" placeholder="Site:" style="width: 80px; text-align: center;" /><button id="btnAddNewCustERD" style="background-color: rgb(28 28 28); color: white;">Add</button>
   <input id="SearchCustomSite" placeholder="Search:" style="float: right; width: 80px; margin-right: 8px; text-align: center; display: none;" /><button id="CancelSearchSiteERS" style="display: none; float: right; width: 25px; background-color: red; color: white; font-weight: bold; margin-right: 1px;">X</button>
   <fieldset id="fsSavedSites">
   <legend>Saved Sites</legend>
   </fieldset>
   </fieldset>
</div>`;
    document.getElementById("map").prepend(node);
    document.getElementById("btnAddNewCustERD").addEventListener("click", ANCERD);
    document.getElementById("WOAASETTINGSS").addEventListener("click", toggleSettings);
    document.getElementById("SearchCustomSite").addEventListener("change", SearchThroughAdvErrDetectionSites);
    PreloadSites();


    node = document.createElement("div");
    node.className = "PopupBox";
    node.id = "WOAAREPORTS";
    node.style.zIndex = "11000";
    node.style.left = "102px";
    node.style.display = "none";
    node.innerHTML = `<div class="MoveTab" id="WOAAREPORTSX"><div class="CloseTab" id="WOAAREPORTSS"><b>X</b></div></div>
    <div class="WOAABOXMAIN" style="margin-top: 15px; padding-left: 5px; width: 98%;"><p style="display: inline-block; float: left;">Search <input type="text" placeholder="Stations:" id="StationSearch" /> for past <input type="number" id="hours" max="360" min="0" value="1" style="width: 45px;"/> hrs.</p> <button id="RefreshSearch" style="display: inline-block; float: right; background-color: transparent; color: white;">↻</button><button id="ToggleViewerSetts" style="display: inline-block; float: right; background-color: transparent; color: white;">≡</button></div>
    <hr style="margin-bottom: 10px;">
    <div id="divReportsFilters" style="margin-left: 8px; padding: 5px; width: 95%; border: 2px black solid; background-color: rgb(19 22 22); display: none; padding-bottom: 8px; padding-top: 8px; margin-top: 10px;">
    <input type="text" id="filterReportIncludes" placeholder="Report Includes:" style="border: 1px gray solid; display: inline-block; text-align: center; float: right;" />
    <input type="checkbox" id="filterOnlyErrors" style="background-color: transparent; color: white;" />
    <label for="filterOnlyErrors">Only Reports With Errors</label>
    <br>
    </div>
    <hr id="HRFilters" style="display: none; margin-top: 10px; margin-bottom: 10px;">
    <div id="ReportsContainer" style="margin-left: 8px; padding: 5px; width: 95%; border: 2px black solid; border-radius: 15px; background-color: rgb(9 10 10); display: none; margin-bottom: 15px;">
    </div>`;
    document.getElementById("map").prepend(node);
    document.getElementById("StationSearch").addEventListener("change", DetermineSearch);
    document.getElementById("hours").addEventListener("change", DetermineSearch);
    document.getElementById("ToggleViewerSetts").addEventListener("click", ToggleFiltersMenu);
    document.getElementById("filterReportIncludes").addEventListener("change", ApplyFilters);
    document.getElementById("filterOnlyErrors").addEventListener("change", ApplyFilters);
    document.getElementById("RefreshSearch").addEventListener("click", DetermineSearch);
    document.getElementById("WOAAREPORTSS").addEventListener("click", toggleRPTS);
    applySettingsListeners();

    node = document.createElement("div");
    node.className = "PopupBox";
    node.id = "WOAAHISTORY";
    node.style.left = `${(StartupPositionX*2)*0.50}px`;
    node.style.zIndex = "11000";
    node.style.display = "none"; // <input type="text" placeholder="Station Year Month Day" id="Filters" /><br> eventually will re-implement but with the option to search this way or the other way.
    node.innerHTML = `<div class="MoveTab" id="WOAAHISTORYX"><div class="CloseTab" id="WOAAHISTORYS"><b>X</b></div></div>
    <div class="WOAABOXMAIN" style="margin-top: 5px; padding-left: 5px">
    <div id="HistoryFilters">
    <label for="HSTN">STN:</label><select id="HSTN"><option value="all">all</option></select>
    <label for="HYER">Year:</label><select id="HYER"><option value="all">all</option></select><button id="ViewMode" style="float: right; margin-right: 10px;" class="SelectedBTN">View</button><br><br>
    <label for="HMTH">Month:</label><select id="HMTH"><option value="all">all</option></select>
    <label for="HDAY">Day:</label><select id="HDAY"><option value="all">all</option></select><button id="DeleteMode" style="float: right; margin-right: 10px;" class="UnselectedBTN">Delete</button>
    </div>
    <hr>
    <div id="History"></div>
    </div>`;

    document.getElementById("map").prepend(node);
    document.getElementById("WOAAHISTORYS").addEventListener("click", toggleHistory);
    //document.getElementById("Filters").addEventListener("change", ChangedFilters);
    document.getElementById("ViewMode").addEventListener("click", EnableViewMode);
    document.getElementById("DeleteMode").addEventListener("click", EnableDeleteMode);
    SetHistoryEventListeners();
    UpdateHistoryFilter("stations");
    SearchHistory();
    //inserts tabs into page.
    node = document.createElement("button");
    node.className = "WOAABTN";
    node.id = "btnRPT";
    node.innerHTML = "Reports";
    document.getElementById("map").prepend(node);
    document.getElementById("btnRPT").addEventListener("click", toggleRPTS);

    node = document.createElement("button");
    node.className = "WOAABTN";
    node.id = "btnHist";
    node.innerHTML = "History";
    document.getElementById("map").prepend(node);
    document.getElementById("btnHist").addEventListener("click", toggleHistory);

    node = document.createElement("button");
    node.className = "WOAABTN";
    node.id = "btnSetts";
    node.innerHTML = "Settings";
    document.getElementById("map").prepend(node);
    document.getElementById("btnSetts").addEventListener("click", toggleSettings);

    UpdateInterval = setInterval(Update, 500);
    SecondlyInterval = setInterval(SecondlyUpdate, 1000);
    //annoying debug
    //var nodelist = document.getElementsByClassName("WOAASETSE");
    //console.log(nodelist);
    //nodelist = document.getElementsByClassName("WOAASETST");
    //console.log(nodelist);
    //nodelist = document.getElementsByClassName("WOAASETER");
    //console.log(nodelist);
    //nodelist = document.getElementsByClassName("WOAASETPR");
    //console.log(nodelist);
}


function ToggleFiltersMenu(){
    //toggles filters menu visibility
    let btnEL = document.getElementById("ToggleViewerSetts");

    if(btnEL.innerHTML == "≡"){
        document.getElementById("divReportsFilters").style.display = "block";
        document.getElementById("HRFilters").style.display = "block";
        btnEL.innerHTML = "-";
    }
    else{
        document.getElementById("divReportsFilters").style.display = "none";
        document.getElementById("HRFilters").style.display = "none";
        btnEL.innerHTML = "≡";
    }
}


function SearchThroughAdvErrDetectionSites(){
    let SiteToSearch = document.getElementById("SearchCustomSite").value.toString().toUpperCase();
    SiteToSearch.length == 4 ? document.getElementById("SearchCustomSite").value = SiteToSearch : SiteToSearch = null;
    if(SiteToSearch){
        //searches and displays all sites in search
    }
}


function ApplyFilters(){
    //applies filters that have been set.
    let fReportIncludes = document.getElementById("filterReportIncludes");
    let fOnlyErrors = document.getElementById("filterOnlyErrors");

    ReportIncludes = fReportIncludes.value.toUpperCase();
    fReportIncludes.value = ReportIncludes;
    fOnlyErrors.checked ? OnlyErrors = true : OnlyErrors = false;
    console.log(OnlyErrors);
    console.log(ReportIncludes);
    //since the filters have been reset, the current search must be as well.
    DetermineSearch();
}



//UPDATE HANDLER BEGIN
let UpdateLoop, UpdateLoopQueue = [0, "", 1]; //ULQ [1.2..3...] == Percentage, Progress, Stage
var TempDataCache;


function UpdaterUpdater(){
    if(document.getElementById("CurrentUpdate").innerHTML != UpdateLoopQueue[1]){ document.getElementById("CurrentUpdate").innerHTML = UpdateLoopQueue[1]; }
    if(UpdateLoopQueue[0] > +document.getElementById("PercentageUpdate").innerHTML){
        document.getElementById("PercentageUpdate").innerHTML = +document.getElementById("PercentageUpdate").innerHTML + 1;
    }
}


function genID(){
    //generates random ID. UID format = idtfyr{A-Z}{\d{5}}
    return `idtfyr${String.fromCharCode('A'.charCodeAt(0) + Math.floor(Math.random() * 26))}${genRand(5)}`;
}


function UpdateHandler(previousversion){
    //will update everything to new version. Requires approval.
    let UpdateConsentRequest = prompt(`Pending Update For Version: ${WOAAVERSION}. Respond with "OK" to begin the update.`).toUpperCase();
    if(UpdateConsentRequest && UpdateConsentRequest == "OK"){
        //begin update
        //we need to insert update progress element
        let node = document.createElement("div");
        node.className = "UpdateBox";
        node.id = "divUpdateBox";
        node.innerHTML = `Updating from WOAA Version ${localStorage.getItem("WOAAVERSION")} to ${WOAAVERSION}. Progress: <p id="PercentageUpdate" style="display: inline">0</p>%<br><br><p id="CurrentUpdate"></p>`;
        document.getElementById("map").prepend(node);
        BeginUpdate();
    }
    else{
        alert("Update Consent Not Attained. Script Inactive.");
        console.log("Failed Script Execution -- Update Consent Request Denied.");
    }
}


function ANCERD(){
    //adds new site, but makes sure that it is a valid site from the USA first, as well as making sure it isn't a duplicate.
    let NewSite = document.getElementById("CustomSiteAddition").value.toUpperCase();
    document.getElementById("CustomSiteAddition").value = NewSite;
    if(NewSite.length != 4 || (!NewSite.startsWith("P") && !NewSite.startsWith("K") && !NewSite.startsWith("T"))){ return; } //checks for simple filters
    let LocalStorageCustomEr = localStorage.getItem("WOAAERCUSTOM") != null ? JSON.parse(localStorage.getItem("WOAAERCUSTOM")) : [];
    console.log(LocalStorageCustomEr);
    if(LocalStorageCustomEr){
        //check for duplicates before adding.
        for(var i = 0; i < LocalStorageCustomEr.length; i++){
            if(LocalStorageCustomEr[i][0] == NewSite){ return; }
        }
        //no duplicates, add the site.
        LocalStorageCustomEr.push([NewSite]);
        LocalStorageCustomEr[LocalStorageCustomEr.length - 1].push([]);
        localStorage.setItem("WOAAERCUSTOM", JSON.stringify(LocalStorageCustomEr));
        PreloadSites();
    }
    else{
        //no custom error detection exists yet, create it.
        LocalStorageCustomEr.push([NewSite]);
        LocalStorageCustomEr[LocalStorageCustomEr.length - 1].push([]);
        localStorage.setItem("WOAAERCUSTOM", JSON.stringify(LocalStorageCustomEr));
        PreloadSites();
    }
}


function PreloadSites(){
    //preloads all sites that have custom error detection. If no sites have custom error detection, hide elements that are only useful with sites with custom error detection.
    let fsSS = document.getElementById("fsSavedSites");
    fsSS.innerHTML = "";
    if(!localStorage.getItem("WOAAERCUSTOM")){
        //there are no custom error detection settings yet.
        fsSS.style.display = "none";
    }
    else{
        fsSS.style.display = "block";
        //ensure visibility of legend text and search function as well as cancel search button
        let NewConstruct = [];
        let ErrDetArr = JSON.parse(localStorage.getItem("WOAAERCUSTOM"));
        for(var Site of ErrDetArr){
            let TimeOfXMit = Site.length === 3 ? Site[2] : FindXmitTime(Site[0]);
            let SiteErrors = Site[1] ? Site[1] : "false";
            if(Site[1].length < 37){
                let NewErrorConstructor = Site[1];
                let PrevSiteLength = Site[1].length;
                for(var foo = 0; foo < (37 - PrevSiteLength); foo++){
                    //insert blank [] arrays until there are 37 items.
                    if(foo == 0 && PrevSiteLength == 0){ NewErrorConstructor.push(25000); }
                    else{
                        NewErrorConstructor.push(["true","checked"]);
                    }
                }
                //insert fixed up stuff to the localStorage.
                let TempInf = Site;
                TempInf[1] = NewErrorConstructor;
                NewConstruct.push(TempInf);
            }
            else{
                NewConstruct.push(Site);
            }
            //just insert dropdown div with button to drop down
            let node = document.createElement("div");
            node.id = `AdvSetts${Site[0]}`;
            node.className = "divAdvSItem";
            node.style.color = "white";
            node.style.backgroundColor = "black";
            node.style.fontSize = "17px";
            node.innerHTML = `
            <p style="display: inline-block; font-weight: bold; font-size: 20px; margin-bottom: 2px;">${Site[0]}</p><button id="btnTS${Site[0]}" style="background-color: transparent; color: white; float: right; display: inline-block;">▼</button>
        `;
            fsSS.append(node);
            document.getElementById(`btnTS${Site[0]}`).addEventListener("click", ToggleSite);
        }
        if(NewConstruct != ErrDetArr){ localStorage.setItem("WOAAERCUSTOM", JSON.stringify(NewConstruct)); }
    }
}


function ToggleSite(){
    let SiteIdentifier = CurrentElement.substr(5);
    if(CurrentExpandedSite == ""){
        //no previous expanded site, open this one
        CurrentExpandedSite = SiteIdentifier;
        document.getElementById(`btnTS${CurrentExpandedSite}`).innerHTML = "▲";
        InsertAdvancedSettings(SiteIdentifier);
    }
    else if(CurrentExpandedSite != SiteIdentifier){
        //must close previous site and open new one
        document.getElementById(`ExpandedSetts${CurrentExpandedSite}`) ? document.getElementById(`ExpandedSetts${CurrentExpandedSite}`).remove() : console.log(`Can't find div "ExpandedSetts${CurrentExpandedSite}" to remove.`);
        document.getElementById(`btnTS${CurrentExpandedSite}`).innerHTML = "▼";
        document.getElementById(CurrentElement).innerHTML = "▲";
        CurrentExpandedSite = SiteIdentifier;
        InsertAdvancedSettings(SiteIdentifier);
    }
    else{
        //close the site.
        document.getElementById(`ExpandedSetts${CurrentExpandedSite}`) ? document.getElementById(`ExpandedSetts${CurrentExpandedSite}`).remove() : console.log(`Can't find div "ExpandedSetts${CurrentExpandedSite}" to remove.`);
        document.getElementById(`btnTS${CurrentExpandedSite}`).innerHTML = "▼";
        CurrentExpandedSite = "";
    }
}


function InsertAdvancedSettings(siteid){
    let AllCustomSettings = JSON.parse(localStorage.getItem("WOAAERCUSTOM"));
    var ThisSiteSettings;
    for(var Site of AllCustomSettings){
        if(Site[0] == siteid){ ThisSiteSettings = Site; }
    }
    let XMITTIME = ThisSiteSettings[2] ? ThisSiteSettings[2] : CWOSTNS.includes(Site[0]) ? FindXmitTime(Site[0]) : "";
    let HighestTCUCB = ThisSiteSettings[1][0] ? ThisSiteSettings[1][0] : 25000;
    let node = document.createElement("div");
    node.id = `ExpandedSetts${siteid}`;
    node.style.marginLeft = "8px";
    node.innerHTML = `
    <hr>
    <span style="font-weight: bold; font-size: 16px; text-align: center; width: 99%; display: block;">General Config</span>
    <br>
    <span display="inline-block;">Routine METAR XMIT Time: H+<input type="number" placeholder="0-59" min="0" max="59" value="${XMITTIME}" id="inpTimeOfTransmit" style="display: inline-block; width:30px; margin-bottom: 5px;" /></span>
    <br>
    <span display="inline-block;">Highest CB/TCU Base Height: <input type="number" min="0" max"35000" value="${HighestTCUCB}" id="inpHighestTCUCB" style="display: inline-block; width:60px;" />FT</span>
    <hr>
    <br>
    <span style="font-weight: bold; font-size: 16px; text-align: center; width: 99%; display: block;">Error Detector Settings</span><br>
    <input id="inpDSNTRMKS" type="checkbox" ${ThisSiteSettings[1][1][1]}/>
    <label for="inpDSNTRMKS">DSNT Remarks With < 3SM Visibility</label>
    <br>
    <input id="inpInvalidAltimeter" type="checkbox" ${ThisSiteSettings[1][2][1]}/>
    <label for="inpInvalidAltimeter">Missing or Invalid Altimeter Setting</label>
    <br>
    <input id="inpLowAltimeter" type="checkbox" ${ThisSiteSettings[1][3][1]}/>
    <label for="inpLowAltimeter">Extremely Low & Unlikely Altimeter</label>
    <br>
    <input id="inpHighAltimeter" type="checkbox" ${ThisSiteSettings[1][4][1]}/>
    <label for="inpHighAltimeter">Extremely High & Unlikely Altimeter</label>
    <br>
    <input id="inpInvalidWind" type="checkbox" ${ThisSiteSettings[1][5][1]}/>
    <label for="inpInvalidWind">Missing or Invalid Wind Section</label>
    <br>
    <input id="inpGustsLowerThanWind" type="checkbox" ${ThisSiteSettings[1][6][1]}/>
    <label for="inpGustsLowerThanWind">Gusts <= Wind Speed</label>
    <br>
    <input id="inpGustingCalmWinds" type="checkbox" ${ThisSiteSettings[1][7][1]}/>
    <label for="inpGustingCalmWinds">Calm Winds Gusting</label>
    <br>
    <input id="inpCalmWindsWithDir" type="checkbox" ${ThisSiteSettings[1][8][1]}/>
    <label for="inpCalmWindsWithDir">Calm Winds With a Direction</label>
    <br>
    <input id="inpVRBBeforeWindSpeedWithOverSixKT" type="checkbox" ${ThisSiteSettings[1][9][1]}/>
    <label for="inpVRBBeforeWindSpeedWithOverSixKT">"VRB" Before Wind Speed > 6KT</label>
    <br>
    <input id="inpVRBWindsUnderSevenWithoutVRB" type="checkbox" ${ThisSiteSettings[1][10][1]}/>
    <label for="inpVRBWindsUnderSevenWithoutVRB">Variable Winds < 7KT Without "VRB"</label>
    <br>
    <input id="inpMissingVis" type="checkbox" ${ThisSiteSettings[1][11][1]}/>
    <label for="inpMissingVis">Missing Visibility</label>
    <br>
    <input id="inpInvalidVis" type="checkbox" ${ThisSiteSettings[1][12][1]}/>
    <label for="inpInvalidVis">Invalid Visibility Value</label>
    <br>
    <input id="inpInvalidSkyCondition" type="checkbox" ${ThisSiteSettings[1][13][1]}/>
    <label for="inpInvalidSkyCondition">Missing or Invalid Sky Condition</label>
    <br>
    <input id="inpOVCorVVwithTCU" type="checkbox" ${ThisSiteSettings[1][14][1]}/>
    <label for="inpOVCorVVwithTCU">OVC or VV with TCU</label>
    <br>
    <input id="inpVVwithCB" type="checkbox" ${ThisSiteSettings[1][15][1]}/>
    <label for="inpVVwithCB">VV with CB</label>
    <br>
    <input id="inpIncorrectIncrementsFiveToTen" type="checkbox" ${ThisSiteSettings[1][16][1]}/>
    <label for="inpIncorrectIncrementsFiveToTen">Layer Height Between 050-100 Not Ending in "0" or "5"</label>
    <br>
    <input id="inpIncorrectIncrementsAboveTen" type="checkbox" ${ThisSiteSettings[1][17][1]}/>
    <label for="inpIncorrectIncrementsAboveTen">Cloud Layer Height Above 10,000FT Not Ending in "0"</label>
    <br>
    <input id="inpIncorrectOrderSkyCover" type="checkbox" ${ThisSiteSettings[1][18][1]}/>
    <label for="inpIncorrectOrderSkyCover">Incorrect Order of Sky Cover</label>
    <br>
    <input id="inpCLRNOTALONE" type="checkbox" ${ThisSiteSettings[1][19][1]}/>
    <label for="inpCLRNOTALONE">CLR Not Alone in Sky Condition</label>
    <br>
    <input id="inpLayerBeyondOVCVV" type="checkbox" ${ThisSiteSettings[1][20][1]}/>
    <label for="inpLayerBeyondOVCVV">Layer Beyond OVC or VV</label>
    <br>
    <input id="inpLayerHeightDescending" type="checkbox" ${ThisSiteSettings[1][21][1]}/>
    <label for="inpLayerHeightDescending">Layer Height in Descending Order</label>
    <br>
    <input id="inpMoreThanOneVV" type="checkbox" ${ThisSiteSettings[1][22][1]}/>
    <label for="inpMoreThanOneVV">More Than 1 VV Layer</label>
    <br>
    <input id="inpMoreThanOneOVC" type="checkbox" ${ThisSiteSettings[1][23][1]}/>
    <label for="inpMoreThanOneOVC">More Than 1 OVC Layer</label>
    <br>
    <input id="inpMoreThanOneCLR" type="checkbox" ${ThisSiteSettings[1][24][1]}/>
    <label for="inpMoreThanOneCLR">More Than 1 CLR</label>
    <br>
    <input id="inpBothOVCVV" type="checkbox" ${ThisSiteSettings[1][25][1]}/>
    <label for="inpBothOVCVV">OVC and VV in Same Report</label>
    <br>
    <input id="inpMoreThanSixLayers" type="checkbox" ${ThisSiteSettings[1][26][1]}/>
    <label for="inpMoreThanSixLayers">More Than 6 layers in Report</label>
    <br>
    <input id="inpTwoSameLayerHeights" type="checkbox" ${ThisSiteSettings[1][27][1]}/>
    <label for="inpTwoSameLayerHeights">2 Layers With Same Height</label>
    <br>
    <input id="inpInvalidTemp" type="checkbox" ${ThisSiteSettings[1][28][1]}/>
    <label for="inpInvalidTemp">Invalid or Missing Temperature</label>
    <br>
    <input id="inpExtremelyHighTemp" type="checkbox" ${ThisSiteSettings[1][29][1]}/>
    <label for="inpExtremelyHighTemp">Extremely High Temperature</label>
    <br>
    <input id="inpExtremelyLowTemp" type="checkbox" ${ThisSiteSettings[1][30][1]}/>
    <label for="inpExtremelyLowTemp">Extremely Low Temperature</label>
    <br>
    <input id="inpDewPointGreaterThanTemperature" type="checkbox" ${ThisSiteSettings[1][31][1]}/>
    <label for="inpDewPointGreaterThanTemperature">Dew Point Greater Than Temperature</label>
    <br>
    <input id="inpExtremelyHighDewPoint" type="checkbox" ${ThisSiteSettings[1][32][1]}/>
    <label for="inpExtremelyHighDewPoint">Extremely High Dew Point</label>
    <br>
    <input id="inpExtremelyLowDewPoint" type="checkbox" ${ThisSiteSettings[1][33][1]}/>
    <label for="inpExtremelyLowDewPoint">Extremely Low Dew Point</label>
    <br>
    <input id="inpBINOVCnoOVC" type="checkbox" ${ThisSiteSettings[1][34][1]}/>
    <label for="inpBINOVCnoOVC">BINOVC With No OVC Layer</label>
    <br>
    <input id="inpVRBSkyCondNotPresent" type="checkbox" ${ThisSiteSettings[1][35][1]}/>
    <label for="inpVRBSkyCondNotPresent">Layer in VRB Sky Condition RMKs Not in Sky Cond</label>
    <br>
    <input id="inpInvalidVRBSkyCondRMKS" type="checkbox" ${ThisSiteSettings[1][36][1]}/>
    <label for="inpInvalidVRBSkyCondRMKS">Invalid Variable Sky Condition Remarks</label>
    <br>
    `;
    document.getElementById(`AdvSetts${siteid}`).appendChild(node);
    AddAdvSettsEventListeners(siteid);
}


function ReloadAdvancedSettings(siteid){
    let AllCustomSettings = JSON.parse(localStorage.getItem("WOAAERCUSTOM"));
    var ThisSiteSettings;
    for(var Site of AllCustomSettings){
        if(Site[0] == siteid){ ThisSiteSettings = Site; }
    }
    let XMITTIME = ThisSiteSettings[2] ? ThisSiteSettings[2] : CWOSTNS.includes(Site[0]) ? FindXmitTime(Site[0]) : "";
    let HighestTCUCB = ThisSiteSettings[1][0] ? ThisSiteSettings[1][0] : 25000;
    let el = document.getElementById(`ExpandedSetts${siteid}`);
    el.innerHTML = `
    <hr>
    <span style="font-weight: bold; font-size: 16px; text-align: center; width: 99%; display: block;">General Config</span>
    <br>
    <span display="inline-block;">Routine METAR XMIT Time: H+<input type="number" placeholder="0-59" min="0" max="59" value="${XMITTIME}" id="inpTimeOfTransmit" style="display: inline-block; width:30px; margin-bottom: 5px;" /></span>
    <br>
    <span display="inline-block;">Highest CB/TCU Base Height: <input type="number" min="0" max"35000" value="${HighestTCUCB}" id="inpHighestTCUCB" style="display: inline-block; width:60px;" />FT</span>
    <hr>
    <br>
    <span style="font-weight: bold; font-size: 16px; text-align: center; width: 99%; display: block;">Error Detector Settings</span><br>
    <input id="inpDSNTRMKS" type="checkbox" ${ThisSiteSettings[1][1][1]}/>
    <label for="inpDSNTRMKS">DSNT Remarks With < 3SM Visibility</label>
    <br>
    <input id="inpInvalidAltimeter" type="checkbox" ${ThisSiteSettings[1][2][1]}/>
    <label for="inpInvalidAltimeter">Missing or Invalid Altimeter Setting</label>
    <br>
    <input id="inpLowAltimeter" type="checkbox" ${ThisSiteSettings[1][3][1]}/>
    <label for="inpLowAltimeter">Extremely Low & Unlikely Altimeter</label>
    <br>
    <input id="inpHighAltimeter" type="checkbox" ${ThisSiteSettings[1][4][1]}/>
    <label for="inpHighAltimeter">Extremely High & Unlikely Altimeter</label>
    <br>
    <input id="inpInvalidWind" type="checkbox" ${ThisSiteSettings[1][5][1]}/>
    <label for="inpInvalidWind">Missing or Invalid Wind Section</label>
    <br>
    <input id="inpGustsLowerThanWind" type="checkbox" ${ThisSiteSettings[1][6][1]}/>
    <label for="inpGustsLowerThanWind">Gusts <= Wind Speed</label>
    <br>
    <input id="inpGustingCalmWinds" type="checkbox" ${ThisSiteSettings[1][7][1]}/>
    <label for="inpGustingCalmWinds">Calm Winds Gusting</label>
    <br>
    <input id="inpCalmWindsWithDir" type="checkbox" ${ThisSiteSettings[1][8][1]}/>
    <label for="inpCalmWindsWithDir">Calm Winds With a Direction</label>
    <br>
    <input id="inpVRBBeforeWindSpeedWithOverSixKT" type="checkbox" ${ThisSiteSettings[1][9][1]}/>
    <label for="inpVRBBeforeWindSpeedWithOverSixKT">"VRB" Before Wind Speed > 6KT</label>
    <br>
    <input id="inpVRBWindsUnderSevenWithoutVRB" type="checkbox" ${ThisSiteSettings[1][10][1]}/>
    <label for="inpVRBWindsUnderSevenWithoutVRB">Variable Winds < 7KT Without "VRB"</label>
    <br>
    <input id="inpMissingVis" type="checkbox" ${ThisSiteSettings[1][11][1]}/>
    <label for="inpMissingVis">Missing Visibility</label>
    <br>
    <input id="inpInvalidVis" type="checkbox" ${ThisSiteSettings[1][12][1]}/>
    <label for="inpInvalidVis">Invalid Visibility Value</label>
    <br>
    <input id="inpInvalidSkyCondition" type="checkbox" ${ThisSiteSettings[1][13][1]}/>
    <label for="inpInvalidSkyCondition">Missing or Invalid Sky Condition</label>
    <br>
    <input id="inpOVCorVVwithTCU" type="checkbox" ${ThisSiteSettings[1][14][1]}/>
    <label for="inpOVCorVVwithTCU">OVC or VV with TCU</label>
    <br>
    <input id="inpVVwithCB" type="checkbox" ${ThisSiteSettings[1][15][1]}/>
    <label for="inpVVwithCB">VV with CB</label>
    <br>
    <input id="inpIncorrectIncrementsFiveToTen" type="checkbox" ${ThisSiteSettings[1][16][1]}/>
    <label for="inpIncorrectIncrementsFiveToTen">Layer Height Between 050-100 Not Ending in "0" or "5"</label>
    <br>
    <input id="inpIncorrectIncrementsAboveTen" type="checkbox" ${ThisSiteSettings[1][17][1]}/>
    <label for="inpIncorrectIncrementsAboveTen">Cloud Layer Height Above 10,000FT Not Ending in "0"</label>
    <br>
    <input id="inpIncorrectOrderSkyCover" type="checkbox" ${ThisSiteSettings[1][18][1]}/>
    <label for="inpIncorrectOrderSkyCover">Incorrect Order of Sky Cover</label>
    <br>
    <input id="inpCLRNOTALONE" type="checkbox" ${ThisSiteSettings[1][19][1]}/>
    <label for="inpCLRNOTALONE">CLR Not Alone in Sky Condition</label>
    <br>
    <input id="inpLayerBeyondOVCVV" type="checkbox" ${ThisSiteSettings[1][20][1]}/>
    <label for="inpLayerBeyondOVCVV">Layer Beyond OVC or VV</label>
    <br>
    <input id="inpLayerHeightDescending" type="checkbox" ${ThisSiteSettings[1][21][1]}/>
    <label for="inpLayerHeightDescending">Layer Height in Descending Order</label>
    <br>
    <input id="inpMoreThanOneVV" type="checkbox" ${ThisSiteSettings[1][22][1]}/>
    <label for="inpMoreThanOneVV">More Than 1 VV Layer</label>
    <br>
    <input id="inpMoreThanOneOVC" type="checkbox" ${ThisSiteSettings[1][23][1]}/>
    <label for="inpMoreThanOneOVC">More Than 1 OVC Layer</label>
    <br>
    <input id="inpMoreThanOneCLR" type="checkbox" ${ThisSiteSettings[1][24][1]}/>
    <label for="inpMoreThanOneCLR">More Than 1 CLR</label>
    <br>
    <input id="inpBothOVCVV" type="checkbox" ${ThisSiteSettings[1][25][1]}/>
    <label for="inpBothOVCVV">OVC and VV in Same Report</label>
    <br>
    <input id="inpMoreThanSixLayers" type="checkbox" ${ThisSiteSettings[1][26][1]}/>
    <label for="inpMoreThanSixLayers">More Than 6 layers in Report</label>
    <br>
    <input id="inpTwoSameLayerHeights" type="checkbox" ${ThisSiteSettings[1][27][1]}/>
    <label for="inpTwoSameLayerHeights">2 Layers With Same Height</label>
    <br>
    <input id="inpInvalidTemp" type="checkbox" ${ThisSiteSettings[1][28][1]}/>
    <label for="inpInvalidTemp">Invalid or Missing Temperature</label>
    <br>
    <input id="inpExtremelyHighTemp" type="checkbox" ${ThisSiteSettings[1][29][1]}/>
    <label for="inpExtremelyHighTemp">Extremely High Temperature</label>
    <br>
    <input id="inpExtremelyLowTemp" type="checkbox" ${ThisSiteSettings[1][30][1]}/>
    <label for="inpExtremelyLowTemp">Extremely Low Temperature</label>
    <br>
    <input id="inpDewPointGreaterThanTemperature" type="checkbox" ${ThisSiteSettings[1][31][1]}/>
    <label for="inpDewPointGreaterThanTemperature">Dew Point Greater Than Temperature</label>
    <br>
    <input id="inpExtremelyHighDewPoint" type="checkbox" ${ThisSiteSettings[1][32][1]}/>
    <label for="inpExtremelyHighDewPoint">Extremely High Dew Point</label>
    <br>
    <input id="inpExtremelyLowDewPoint" type="checkbox" ${ThisSiteSettings[1][33][1]}/>
    <label for="inpExtremelyLowDewPoint">Extremely Low Dew Point</label>
    <br>
    <input id="inpBINOVCnoOVC" type="checkbox" ${ThisSiteSettings[1][34][1]}/>
    <label for="inpBINOVCnoOVC">BINOVC With No OVC Layer</label>
    <br>
    <input id="inpVRBSkyCondNotPresent" type="checkbox" ${ThisSiteSettings[1][35][1]}/>
    <label for="inpVRBSkyCondNotPresent">Layer in VRB Sky Condition RMKs Not in Sky Cond</label>
    <br>
    <input id="inpInvalidVRBSkyCondRMKS" type="checkbox" ${ThisSiteSettings[1][36][1]}/>
    <label for="inpInvalidVRBSkyCondRMKS">Invalid Variable Sky Condition Remarks</label>
    <br>
    `;
    AddAdvSettsEventListeners(siteid);
}


function AddAdvSettsEventListeners(id){
    document.getElementById("inpTimeOfTransmit").addEventListener("change", changeAdvSetts);
    document.getElementById("inpHighestTCUCB").addEventListener("change", changeAdvSetts);
    document.getElementById("inpDSNTRMKS").addEventListener("click", changeAdvSetts);
    document.getElementById("inpInvalidAltimeter").addEventListener("click", changeAdvSetts);
    document.getElementById("inpLowAltimeter").addEventListener("click", changeAdvSetts);
    document.getElementById("inpHighAltimeter").addEventListener("click", changeAdvSetts);
    document.getElementById("inpInvalidWind").addEventListener("click", changeAdvSetts);
    document.getElementById("inpGustsLowerThanWind").addEventListener("click", changeAdvSetts);
    document.getElementById("inpGustingCalmWinds").addEventListener("click", changeAdvSetts);
    document.getElementById("inpCalmWindsWithDir").addEventListener("click", changeAdvSetts);
    document.getElementById("inpVRBBeforeWindSpeedWithOverSixKT").addEventListener("click", changeAdvSetts);
    document.getElementById("inpVRBWindsUnderSevenWithoutVRB").addEventListener("click", changeAdvSetts);
    document.getElementById("inpMissingVis").addEventListener("click", changeAdvSetts);
    document.getElementById("inpInvalidVis").addEventListener("click", changeAdvSetts);
    document.getElementById("inpInvalidSkyCondition").addEventListener("click", changeAdvSetts);
    document.getElementById("inpOVCorVVwithTCU").addEventListener("click", changeAdvSetts);
    document.getElementById("inpVVwithCB").addEventListener("click", changeAdvSetts);
    document.getElementById("inpIncorrectIncrementsFiveToTen").addEventListener("click", changeAdvSetts);
    document.getElementById("inpIncorrectIncrementsAboveTen").addEventListener("click", changeAdvSetts);
    document.getElementById("inpIncorrectOrderSkyCover").addEventListener("click", changeAdvSetts);
    document.getElementById("inpCLRNOTALONE").addEventListener("click", changeAdvSetts);
    document.getElementById("inpLayerBeyondOVCVV").addEventListener("click", changeAdvSetts);
    document.getElementById("inpLayerHeightDescending").addEventListener("click", changeAdvSetts);
    document.getElementById("inpMoreThanOneVV").addEventListener("click", changeAdvSetts);
    document.getElementById("inpMoreThanOneOVC").addEventListener("click", changeAdvSetts);
    document.getElementById("inpMoreThanOneCLR").addEventListener("click", changeAdvSetts);
    document.getElementById("inpBothOVCVV").addEventListener("click", changeAdvSetts);
    document.getElementById("inpMoreThanSixLayers").addEventListener("click", changeAdvSetts);
    document.getElementById("inpTwoSameLayerHeights").addEventListener("click", changeAdvSetts);
    document.getElementById("inpInvalidTemp").addEventListener("click", changeAdvSetts);
    document.getElementById("inpExtremelyHighTemp").addEventListener("click", changeAdvSetts);
    document.getElementById("inpExtremelyLowTemp").addEventListener("click", changeAdvSetts);
    document.getElementById("inpDewPointGreaterThanTemperature").addEventListener("click", changeAdvSetts);
    document.getElementById("inpExtremelyHighDewPoint").addEventListener("click", changeAdvSetts);
    document.getElementById("inpExtremelyLowDewPoint").addEventListener("click", changeAdvSetts);
    document.getElementById("inpBINOVCnoOVC").addEventListener("click", changeAdvSetts);
    document.getElementById("inpVRBSkyCondNotPresent").addEventListener("click", changeAdvSetts);
    document.getElementById("inpInvalidVRBSkyCondRMKS").addEventListener("click", changeAdvSetts);
}


function changeAdvSetts(){
    let SiteIdentifier = CurrentExpandedSite;
    let AllCustomSettings = JSON.parse(localStorage.getItem("WOAAERCUSTOM"));
	let inpTimeOfTransmit = document.getElementById("inpTimeOfTransmit").value;
	let inpHighestTCUCB = document.getElementById("inpHighestTCUCB").value;
	let inpDSNTRMKS = document.getElementById("inpDSNTRMKS");
	let inpInvalidAltimeter = document.getElementById("inpInvalidAltimeter");
	let inpLowAltimeter = document.getElementById("inpLowAltimeter");
	let inpHighAltimeter = document.getElementById("inpHighAltimeter");
	let inpInvalidWind = document.getElementById("inpInvalidWind");
	let inpGustsLowerThanWind = document.getElementById("inpGustsLowerThanWind");
	let inpGustingCalmWinds = document.getElementById("inpGustingCalmWinds");
	let inpCalmWindsWithDir = document.getElementById("inpCalmWindsWithDir");
	let inpVRBBeforeWindSpeedWithOverSixKT = document.getElementById("inpVRBBeforeWindSpeedWithOverSixKT");
	let inpVRBWindsUnderSevenWithoutVRB = document.getElementById("inpVRBWindsUnderSevenWithoutVRB");
	let inpMissingVis = document.getElementById("inpMissingVis");
	let inpInvalidVis = document.getElementById("inpInvalidVis");
	let inpInvalidSkyCondition = document.getElementById("inpInvalidSkyCondition");
	let inpOVCorVVwithTCU = document.getElementById("inpOVCorVVwithTCU");
	let inpVVwithCB = document.getElementById("inpVVwithCB");
	let inpIncorrectIncrementsFiveToTen = document.getElementById("inpIncorrectIncrementsFiveToTen");
	let inpIncorrectIncrementsAboveTen = document.getElementById("inpIncorrectIncrementsAboveTen");
	let inpIncorrectOrderSkyCover = document.getElementById("inpIncorrectOrderSkyCover");
	let inpCLRNOTALONE = document.getElementById("inpCLRNOTALONE");
	let inpLayerBeyondOVCVV = document.getElementById("inpLayerBeyondOVCVV");
	let inpLayerHeightDescending = document.getElementById("inpLayerHeightDescending");
	let inpMoreThanOneVV = document.getElementById("inpMoreThanOneVV");
	let inpMoreThanOneOVC = document.getElementById("inpMoreThanOneOVC");
	let inpMoreThanOneCLR = document.getElementById("inpMoreThanOneCLR");
	let inpBothOVCVV = document.getElementById("inpBothOVCVV");
	let inpMoreThanSixLayers = document.getElementById("inpMoreThanSixLayers");
	let inpTwoSameLayerHeights = document.getElementById("inpTwoSameLayerHeights");
	let inpInvalidTemp = document.getElementById("inpInvalidTemp");
	let inpExtremelyHighTemp = document.getElementById("inpExtremelyHighTemp");
	let inpExtremelyLowTemp = document.getElementById("inpExtremelyLowTemp");
	let inpDewPointGreaterThanTemperature = document.getElementById("inpDewPointGreaterThanTemperature");
	let inpExtremelyHighDewPoint = document.getElementById("inpExtremelyHighDewPoint");
	let inpExtremelyLowDewPoint = document.getElementById("inpExtremelyLowDewPoint");
	let inpBINOVCnoOVC = document.getElementById("inpBINOVCnoOVC");
	let inpVRBSkyCondNotPresent = document.getElementById("inpVRBSkyCondNotPresent");
	let inpInvalidVRBSkyCondRMKS = document.getElementById("inpInvalidVRBSkyCondRMKS");
    inpDSNTRMKS.checked ? inpDSNTRMKS = ["true", "checked"] : inpDSNTRMKS = ["false", ""];
	inpInvalidAltimeter.checked ? inpInvalidAltimeter = ["true", "checked"] : inpInvalidAltimeter = ["false", ""];
	inpLowAltimeter.checked ? inpLowAltimeter = ["true", "checked"] : inpLowAltimeter = ["false", ""];
	inpHighAltimeter.checked ? inpHighAltimeter = ["true", "checked"] : inpHighAltimeter = ["false", ""];
	inpInvalidWind.checked ? inpInvalidWind = ["true", "checked"] : inpInvalidWind = ["false", ""];
	inpGustsLowerThanWind.checked ? inpGustsLowerThanWind = ["true", "checked"] : inpGustsLowerThanWind = ["false", ""];
	inpGustingCalmWinds.checked ? inpGustingCalmWinds = ["true", "checked"] : inpGustingCalmWinds = ["false", ""];
	inpCalmWindsWithDir.checked ? inpCalmWindsWithDir = ["true", "checked"] : inpCalmWindsWithDir = ["false", ""];
	inpVRBBeforeWindSpeedWithOverSixKT.checked ? inpVRBBeforeWindSpeedWithOverSixKT = ["true", "checked"] : inpVRBBeforeWindSpeedWithOverSixKT = ["false", ""];
	inpVRBWindsUnderSevenWithoutVRB.checked ? inpVRBWindsUnderSevenWithoutVRB = ["true", "checked"] : inpVRBWindsUnderSevenWithoutVRB = ["false", ""];
	inpMissingVis.checked ? inpMissingVis = ["true", "checked"] : inpMissingVis = ["false", ""];
	inpInvalidVis.checked ? inpInvalidVis = ["true", "checked"] : inpInvalidVis = ["false", ""];
	inpInvalidSkyCondition.checked ? inpInvalidSkyCondition = ["true", "checked"] : inpInvalidSkyCondition = ["false", ""];
	inpOVCorVVwithTCU.checked ? inpOVCorVVwithTCU = ["true", "checked"] : inpOVCorVVwithTCU = ["false", ""];
	inpVVwithCB.checked ? inpVVwithCB = ["true", "checked"] : inpVVwithCB = ["false", ""];
	inpIncorrectIncrementsFiveToTen.checked ? inpIncorrectIncrementsFiveToTen = ["true", "checked"] : inpIncorrectIncrementsFiveToTen = ["false", ""];
	inpIncorrectIncrementsAboveTen.checked ? inpIncorrectIncrementsAboveTen = ["true", "checked"] : inpIncorrectIncrementsAboveTen = ["false", ""];
	inpIncorrectOrderSkyCover.checked ? inpIncorrectOrderSkyCover = ["true", "checked"] : inpIncorrectOrderSkyCover = ["false", ""];
	inpCLRNOTALONE.checked ? inpCLRNOTALONE = ["true", "checked"] : inpCLRNOTALONE = ["false", ""];
	inpLayerBeyondOVCVV.checked ? inpLayerBeyondOVCVV = ["true", "checked"] : inpLayerBeyondOVCVV = ["false", ""];
	inpLayerHeightDescending.checked ? inpLayerHeightDescending = ["true", "checked"] : inpLayerHeightDescending = ["false", ""];
	inpMoreThanOneVV.checked ? inpMoreThanOneVV = ["true", "checked"] : inpMoreThanOneVV = ["false", ""];
	inpMoreThanOneOVC.checked ? inpMoreThanOneOVC = ["true", "checked"] : inpMoreThanOneOVC = ["false", ""];
	inpMoreThanOneCLR.checked ? inpMoreThanOneCLR = ["true", "checked"] : inpMoreThanOneCLR = ["false", ""];
	inpBothOVCVV.checked ? inpBothOVCVV = ["true", "checked"] : inpBothOVCVV = ["false", ""];
	inpMoreThanSixLayers.checked ? inpMoreThanSixLayers = ["true", "checked"] : inpMoreThanSixLayers = ["false", ""];
	inpTwoSameLayerHeights.checked ? inpTwoSameLayerHeights = ["true", "checked"] : inpTwoSameLayerHeights = ["false", ""];
	inpInvalidTemp.checked ? inpInvalidTemp = ["true", "checked"] : inpInvalidTemp = ["false", ""];
	inpExtremelyHighTemp.checked ? inpExtremelyHighTemp = ["true", "checked"] : inpExtremelyHighTemp = ["false", ""];
	inpExtremelyLowTemp.checked ? inpExtremelyLowTemp = ["true", "checked"] : inpExtremelyLowTemp = ["false", ""];
	inpDewPointGreaterThanTemperature.checked ? inpDewPointGreaterThanTemperature = ["true", "checked"] : inpDewPointGreaterThanTemperature = ["false", ""];
	inpExtremelyHighDewPoint.checked ? inpExtremelyHighDewPoint = ["true", "checked"] : inpExtremelyHighDewPoint = ["false", ""];
	inpExtremelyLowDewPoint.checked ? inpExtremelyLowDewPoint = ["true", "checked"] : inpExtremelyLowDewPoint = ["false", ""];
	inpBINOVCnoOVC.checked ? inpBINOVCnoOVC = ["true", "checked"] : inpBINOVCnoOVC = ["false", ""];
	inpVRBSkyCondNotPresent.checked ? inpVRBSkyCondNotPresent = ["true", "checked"] : inpVRBSkyCondNotPresent = ["false", ""];
	inpInvalidVRBSkyCondRMKS.checked ? inpInvalidVRBSkyCondRMKS = ["true", "checked"] : inpInvalidVRBSkyCondRMKS = ["false", ""];
    const ErrConstruct = [inpHighestTCUCB, inpDSNTRMKS, inpInvalidAltimeter, inpLowAltimeter, inpHighAltimeter, inpInvalidWind, inpGustsLowerThanWind, inpGustingCalmWinds, inpCalmWindsWithDir, inpVRBBeforeWindSpeedWithOverSixKT, inpVRBWindsUnderSevenWithoutVRB, inpMissingVis, inpInvalidVis, inpInvalidSkyCondition, inpOVCorVVwithTCU, inpVVwithCB, inpIncorrectIncrementsFiveToTen, inpIncorrectIncrementsAboveTen, inpIncorrectOrderSkyCover, inpCLRNOTALONE, inpLayerBeyondOVCVV, inpLayerHeightDescending, inpMoreThanOneVV, inpMoreThanOneOVC, inpMoreThanOneCLR, inpBothOVCVV, inpMoreThanSixLayers, inpTwoSameLayerHeights, inpInvalidTemp, inpExtremelyHighTemp, inpExtremelyLowTemp, inpDewPointGreaterThanTemperature, inpExtremelyHighDewPoint, inpExtremelyLowDewPoint, inpBINOVCnoOVC, inpVRBSkyCondNotPresent, inpInvalidVRBSkyCondRMKS];
    let TotalConstruct = [];
    for(var Site of AllCustomSettings){
        if(Site[0] == SiteIdentifier){
            let NewConstruct = [Site[0], ErrConstruct, inpTimeOfTransmit];
            TotalConstruct.push(NewConstruct);
        }
        else{
            TotalConstruct.push(Site);
        }
    }
    localStorage.setItem("WOAAERCUSTOM", JSON.stringify(TotalConstruct));
    ReloadAdvancedSettings(SiteIdentifier);
}


function FindXmitTime(ident){
    for(var x of CWOSTNSMETARS){
        if(x.substr(0,4) == ident){ return x.split(" ")[1]; }
    }
    return "false";
}


function BeginUpdate(){
    //currently deprecated
}
//UPDATE HANDLER END

function StartupWizard(){
    //Startup wizard to preconfigure some settings
    //350x600 dimensions
    let node = document.createElement("div");
    node.className = "StartupBox";
    node.id = "WOAASTARTUP";
    node.style.zIndex = "11000";
    node.style.backgroundColor = "rgb(50 50 50)";
    node.style.color = "white";
    node.style.display = "block";
    node.innerHTML = `<h3 style="text-align: center; margin-top: 20px;" title="Version ${WOAAVERSION}">Welcome to WOAA</h3>
    <h4 style="text-align: center;" title="Version ${WOAAVERSION}"><b>${WOAAEDITION}</b> Edition.</h4>
    <p style="margin-top: 50px;">Watch the video <a href="https://youtu.be/dQw4w9WgXcQ" target="_blank">here</a> for assistance setting up this script, if necessary.</p>
    <p style="margin-top: 35px;">Your Home Station is required to use this script. The Home Station gets routinely checked for errors. Due to the tuning of the error detecting settings that you will do, there will be many more errors that can be detected by reports disseminated from your Home Station.</p>
    Please Enter Your Home Station: <input type="text" maxLength="4" placeholder="KXXX" id="StartHomeSTN" style="width: 65px;" />
    <button id="NextPhase" style="margin-top: 120px; width: 80px; margin-left: 125px;">Next</button>`;
    document.getElementById("map").prepend(node);
    document.getElementById("NextPhase").addEventListener("click", NextStage);
}


function genRand(x) {
  const rand = [];
  for (let i = 0; i < x; i++) {
    const nRand = Math.floor(Math.random() * 10);
    rand.push(nRand);
  }
  return rand.join("");
}


function EnableViewMode(){
    if(HistoryMode != "view"){
        document.getElementById("ViewMode").className = "SelectedBTN";
        document.getElementById("DeleteMode").className = "UnselectedBTN";
        HistoryMode = "view";
    }
}


function EnableDeleteMode(){
    if(HistoryMode != "delete"){
        document.getElementById("ViewMode").className = "UnselectedBTN";
        document.getElementById("DeleteMode").className = "SelectedBTN";
        HistoryMode = "delete";
    }
    console.log(HistoryMode);
}


function NextStage(){
    let el = document.getElementById("WOAASTARTUP");
    console.log(Stage);
    switch(Stage){
        case 1:
            if(document.getElementById("StartHomeSTN").value.length != 4){
                alert("Invalid Home Station Entry");
            }
            else{
                //move onto stage 2.
                Stage++;
                HomeSTN = document.getElementById("StartHomeSTN").value.toUpperCase();
                localStorage.setItem("HomeSTN", HomeSTN);
                el.innerHTML = `<h4 style="text-align: center; margin-top: 20px;">Got It. Home Station: <h4 style="color: blue; text-align: center;"><b>${HomeSTN}</b></h4></h4>
                <p style="margin-top: 50px">Settings Information.</p>
                <p style="margin-top: 50px">The Settings allows you to take a deep dive into the core functions of the program and tune every setting to your liking. You can also access an even more in-depth toggleable error detection setting list than you will find in the main settings panel. You may also customize how this script interprets data from certain CWO sites.</p>
                <button id="NextPhase" style="margin-top: 80px; width: 80px; margin-left: 125px;">Next</button>`;
                document.getElementById("NextPhase").addEventListener("click", NextStage);
            }
            break;
        case 2:
                Stage++;
                el.innerHTML = `<h4 style="text-align: center; margin-top: 20px;">Important Settings</h4>
                <h5 style="margin-top: 50px;">Let's preconfigure some settings! These settings can be changed later.</h5><br>
                <input type="checkbox" id="StartAllowHistDelete" style="display: inline;"><label for="StartAllowHistDelete" style="display: inline;"> First and foremost, would you like to allow everyone to delete stored reports?</label><br><br>
                <input type="checkbox" id="StartAllowErrorSetts" style="display: inline;"><label for="StartAllowErrorSetts" style="display: inline;"> Would you like to allow anyone to modify the error detector settings?</label><br><br>
                <input type="checkbox" id="StartCopyReport" style="display: inline;"><label for="StartCopyReport" style="display: inline;"> Would you like to automatically have reports entered in CheckRPT copied to your clipboard?</label><br><br>
                <input type="checkbox" id="StartPlaySound" style="display: inline;"><label for="StartPlaySound" style="display: inline;"> Would you like for a sound to play when an error is automatically detected?</label><br><br>
                Check Home Station H+<input type="number" id="StartWhenToCheck" max="59" min="0" value="${+WOAASETSE[2]}" title="It is best advised to set this time for 6-8 minutes after your METAR typically transmits.">
                <button id="NextPhase" style="margin-top: 61px; width: 80px; margin-left: 125px;">Next</button>`;
                document.getElementById("NextPhase").addEventListener("click", NextStage);
            break;
        case 3:
            //sets preconfigured settings, then displays the error detector settings.
            Stage++;
            var [ AllowHistDelete, AllowErrSetts, CopyReport, PlaySound ] = [ document.getElementById("StartAllowHistDelete"), document.getElementById("StartAllowErrorSetts"), document.getElementById("StartCopyReport"), document.getElementById("StartPlaySound") ];
            var WhenToCheck;
            AllowHistDelete.checked ? AllowHistDelete = ["true", "checked"] : AllowHistDelete = ["false", ""];
            AllowErrSetts.checked ? AllowErrSetts = ["true", "checked"] : AllowErrSetts = ["false", ""];
            CopyReport.checked ? CopyReport = ["true", "checked"] : CopyReport = ["false", ""];
            PlaySound.checked ? PlaySound = ["true", "checked"] : PlaySound = ["false", ""];
            !document.getElementById("StartWhenToCheck").value ? WhenToCheck = 55 : WhenToCheck = document.getElementById("StartWhenToCheck").value;
            WOAASETSE = [CopyReport, PlaySound, WhenToCheck, AllowHistDelete, AllowErrSetts, ["false", ""] ];
            localStorage.setItem("WOAASETSE", JSON.stringify(WOAASETSE));
            el.innerHTML = `
            <h4 style="text-align: center; margin-top: 20px;">Settings Information</h4>
            <p style="margin-top: 50px;">This script automatically stores just the reports from the home station. You may modify those settings to store AUTO reports, CWO reports, ATC reports, or any combination of the 3. If you'd like, you can even go back to storing your home station.</p>
            <p style="margin-top: 50px;">By default, this script displays every element of a report when viewing a report in the report searcher. You may modify that to your liking.</p>
            <p style="margin-top: 50px;">In the next page, you will tune the error detector settings to your liking. As always, you may modify these error detector settings in the future.</p>
            <button id="NextPhase" style="margin-top: 30px; width: 80px; margin-left: 125px;">Next</button>`;
            document.getElementById("NextPhase").addEventListener("click", NextStage);
            break;
        case 4:
            Stage++;
            el.innerHTML = `
            <h4 style="text-align: center; margin-top: 20px;">Error Detector Settings Tuning</h4><br><br>
            <input type="checkbox" id="StartDetectAlt" style="display: inline;"><label for="StartDetectAlt" style="display: inline;"> Would you like the error detector to detect an extreme altimeter setting?</label><br>
            <input type="checkbox" id="StartDetectTemp" style="display: inline;"><label for="StartDetectTemp" style="display: inline;"> Would you like the error detector to detect an extreme temperature?</label><br>
            <input type="checkbox" id="StartDetectDewPoint" style="display: inline;"><label for="StartDetectDewPoint" style="display: inline;"> Would you like the error detector to detect an extreme dew point?</label><br>
            <input type="checkbox" id="StartDetectWinds" style="display: inline;"><label for="StartDetectWinds" style="display: inline;"> Would you like the error detector to detect invalid winds?</label><br>
            <button id="NextPhase" style="margin-top: 63px; width: 80px; margin-left: 125px;">Next</button>`;
            document.getElementById("NextPhase").addEventListener("click", NextStage);
            break;
        case 5:
            var [ StartDetectAlt, StartDetectTemp, StartDetectDewPoint, StartDetectWinds ] = [ document.getElementById("StartDetectAlt"), document.getElementById("StartDetectTemp"), document.getElementById("StartDetectDewPoint"), document.getElementById("StartDetectWinds") ];
            StartDetectAlt.checked ? StartDetectAlt = ["true", "checked"] : StartDetectAlt = ["false", ""];
            StartDetectTemp.checked ? StartDetectTemp = ["true", "checked"] : StartDetectTemp = ["false", ""];
            StartDetectDewPoint.checked ? StartDetectDewPoint = ["true", "checked"] : StartDetectDewPoint = ["false", ""];
            StartDetectWinds.checked ? StartDetectWinds = ["true", "checked"] : StartDetectWinds = ["false", ""];
            WOAAER = [ StartDetectAlt, StartDetectTemp, StartDetectDewPoint, StartDetectWinds ];
            localStorage.setItem("WOAAERDEFAULT", JSON.stringify(WOAAER));
            el.style.overflowY = "scroll";
            el.innerHTML = `
            <h4 style="text-align: center; margin-top: 20px;">Report Searcher Info</h4>
            <p style="margin-top: 80px;">The Report Searcher is a nifty little tool that allows you to search for reports from any US station. Including reports in Puerto Rico, the Pacific, Alaska, and the Continental United States.</p>
            <p>The report searcher will automatically pick up stations. For example, if you type "dfdnsm,ffmsdfnjdskcle....///pavdmnvcjk2g2" It'll pick up KCLE, PAVD, and K2G2. Don't be too rough with it, but you don't need to put effort into formatting your search. If you want reports from KYNG, KCLE, and KPIT, you can type in "kyngkclekpit" and it'll pick it up.</p>
            <p>In addition to automatically picking up stations, the Report Searcher also automatically refreshes under numerous circumstances. Circumstances such as: changes to the input fields, changes to the report viewer settings, and automatic quarterly refreshes.</p>
            <p>The report searcher even automatically detects errors in reports! In addition, you are able to search for the past 360 HOURS of reports.</p>
            <button id="NextPhase" style="width: 80px; margin-left: 125px;">Next</button>`;
            document.getElementById("NextPhase").addEventListener("click", NextStage);
            Stage++;
            break;
        case 6:
            Stage++;
            el.style.overflowY = "";
            el.innerHTML = `
            <h4 style="text-align: center; margin-top: 20px;">History Viewer Info</h4>
            <p style="margin-top: 80px;">The History Viewer is a neat interface that allows you to view the reports you have stored, and delete said reports. You are able to delete reports by the year, month, day, or individually.</p>
            <p>Similarly, the History Viewer automatically detects errors present in store reports.</p>
            <button id="NextPhase" style="margin-top: 254px; width: 80px; margin-left: 125px;">Next</button>`;
            document.getElementById("NextPhase").addEventListener("click", NextStage);
            break;
        case 7:
            Stage++;
            el.innerHTML = `
            <h4 style="text-align: center; margin-top: 20px;">QC Checker</h4>
            <p style="margin-top: 78px;">QC Checker is a button in the settings that searches for the past 8 hours of reports disseminated by your home station and automatically compiles the total amount of METARs, SPECIs, CORs, and Errors made throughout that period.</p>
            <p>The QC Checker attempts to tally the METAR count via AWC data, but often, that data is outright incorrect. In that case, WOAA will automatically take the tally. In that case, you shouldn't rely on the data provided for accurate numbers.</p>
            <p>The QC Checker is an effective way to process that information fast -- but you shouldn't solely rely on it to determine if errors were truly made.</p>
            <button id="NextPhase" style="width: 80px; margin-left: 125px;">Next</button>`;
            document.getElementById("NextPhase").addEventListener("click", NextStage);
            break;
        case 8:
            Stage++;
            el.innerHTML = `
            <h4 style="text-align: center; margin-top: 20px;">Check Report</h4>
            <p style="margin-top: 80px;">While the error detector provided in this script is very useful to correct errors ASAP, the Check Report function will detect errors in advance.</p>
            <p>All you have to do is enter the entire raw report and the error detector will get to work. Don't miss out on or mistype any data!</p>
            <button id="NextPhase" style="margin-top: 230px; width: 80px; margin-left: 125px;">Next</button>`;
            document.getElementById("NextPhase").addEventListener("click", NextStage);
            break;
        case 9:
            Stage++;
            el.innerHTML = `
            <h4 style="text-align: center; margin-top: 20px;">Additional Command Center Information</h4>
            <p style="margin-top: 78px;">The Admin settings are key to the proper function of the program. They enable/disable important features such as the modification of certain groups of settings, permitting or disallowing stored reports to be deleted, and more.</p>
            <p>Advanced Error Detection settings are contained in the Command Center. By accessing and modifying these settings, you will be able to enable/disable detection for every single error that is detected here. Considering that this script detects over 30 different types of errors, that level of customization is great.</p>
            <p>Even more elaborate than the Advanced Error Detection settings, is the CWO Site data modification section. Not only will you be able to customize error detection for any CWO site you want, but you are also able to modify other important things such as the time of the METAR. This section is particularly useful for remote QC and for rover employees.</p>
            <button id="NextPhase" style="width: 80px; margin-left: 125px;">Next</button>`;
            document.getElementById("NextPhase").addEventListener("click", NextStage);
            break;
        case 10:
            Stage++;
            el.innerHTML = `
            <h4 style="text-align: center; margin-top: 20px;">Planned Features</h4>
            <p style="margin-top: 14px;">DeepDive Error Detection is planned for the future. This will only work on either the home station or stations with customized error detection settings. DDED will basically sift through the past X(X)(X) hours of reports from a station, and check for every inconsistency, definitive error, and potential error it can find.</p>
            <p>Improved Report Searcher. Eventually, the Reports tab will contain more content such as a TAF searcher, and filters. With filters such as, reports containing errors, reports containing thunderstorms, reports containing MVFR conditions, etc...</p>
            <p>Improved History Viewer. Eventually, the History tab will be improved similar to the Report Searcher. The History Viewer will have an inclusive search which will only show reports that contain what is types in that search box, as well as having filters similar to the Report Searcher's.</p>
            <button id="NextPhase" style="width: 80px; margin-left: 125px;">Next</button>`;
            document.getElementById("NextPhase").addEventListener("click", NextStage);
            break;
        case 11:
            Stage++;
            el.innerHTML = `
            <h4 style="text-align: center; margin-top: 20px;">Hotkeys</h4>
            <p style="margin-top: 80px;">Numerous hotkeys are present that have some hidden functions not present anywhere else in the script. Here's a list of them you can test out after this setup:</p>
            "q" - Search for Specific Report<br>
            "\\" - Provides WOAA Version<br>
            "=" - Gets and Returns Storage Statistics<br>
            "[" - Cycles Through All CWO Station Reports and Checks for Errors.<br>
            <button id="NextPhase" style="margin-top: 197px; width: 80px; margin-left: 125px;">Finish</button>`;
            document.getElementById("NextPhase").addEventListener("click", NextStage);
            break;
        case 12:
            StartupWizardActive = false;
            el.remove();
            FinishStartup();
            break;
    }
}


function SetHistoryEventListeners(){
    document.getElementById("HSTN").addEventListener("change", ChangedHVOPT);
    document.getElementById("HYER").addEventListener("change", ChangedHVOPT);
    document.getElementById("HMTH").addEventListener("change", ChangedHVOPT);
    document.getElementById("HDAY").addEventListener("change", ChangedHVOPT);
}


function GetYears(){
    let ToRet = [];
    for(var key in localStorage){
        if(key.startsWith("20")){ ToRet.push(key.substr(0,4)); }
    }
    return RemoveDuplicates(ToRet).sort();
}


function GetMonths(){
    let ToRet = [];
    for(var key in localStorage){
        if(key.startsWith("20")){
            let [year, month, stn] = key.split("-");
            if(stn == SelectedStation && year == SelectedYear){
                ToRet.push(month);
            }
        }
    }
    return ToRet.sort();
}


function GetDays(){
    let ToRet = [];
    var Reports = localStorage.getItem(`${SelectedYear}-${SelectedMonth}-${SelectedStation}`).split("(");
    for(var KLM = 0; KLM < Reports.length; KLM++){
        ToRet.push(Reports[KLM].substr(5,2));
    }
    return RemoveDuplicates(ToRet).sort();
}


function GetReports(){
    let ToRet = [];
    if(!localStorage.getItem(`${SelectedYear}-${SelectedMonth}-${SelectedStation}`)){
        //station no longer is stored.
        SelectedStation = "all";
        SelectedYear = "all";
        SelectedMonth = "all";
        SelectedDay = "all";
        document.getElementById("HSTN").value = SelectedStation;
        document.getElementById("HYER").value = SelectedYear;
        document.getElementById("HMTH").value = SelectedMonth;
        document.getElementById("HDAY").value = SelectedDay;
        UpdateHistoryFilter("stations");
        SearchHistory();
    }
    else{
        var Reports = localStorage.getItem(`${SelectedYear}-${SelectedMonth}-${SelectedStation}`).split("(");
        for(var KLM = 0; KLM < Reports.length; KLM++){
            if(Reports[KLM].substr(5,2) == SelectedDay){ ToRet.push(Reports[KLM]); }
        }
        return RemoveDuplicates(ToRet).sort();
    }
}


function DayExists(){
    //checks if day exists, returns true if it does false otherwise.
    let MonthRPTS = localStorage.getItem(`${SelectedYear}-${SelectedMonth}-${SelectedStation}`).split("("), Exists = false;
    for(var k = 0; k < MonthRPTS.length; k++){
        if(+MonthRPTS[k].substr(5,2) == SelectedDay){ Exists = true; }
    }
    console.log(Exists);
    return Exists;
}


function StationDeletionHandler(){
    //figures out if selected station exists, and to what extent. Then sets variables accordingly.

    let ArrData = [], exists = false;
    //checks if station still exists, if it doesn't, then reset. Also logs the current year and month found if station is detected.
    for(var key in localStorage){
        if(key.includes(`${SelectedStation}`)){
            console.log(key);
            exists = true;
            let keydat = key.toString().split("-");
            keydat.pop();
            let rkeydat = keydat.join("-");
            console.log(rkeydat);
            ArrData.push(rkeydat);
            ArrData.push(rkeydat.substr(0,4));
        }
    }
    if(!exists){
        console.log("Station no longer exists, resetting.");
        //the selected station no longer exists, reset everything
        SelectedStation = "all";
        SelectedYear = "all";
        SelectedMonth = "all";
        SelectedDay = "all";
        document.getElementById("HSTN").value = SelectedStation;
        document.getElementById("HYER").value = SelectedYear;
        document.getElementById("HMTH").value = SelectedMonth;
        document.getElementById("HDAY").value = SelectedDay;
        SearchHistory();
    }
    else if(!ArrData.includes(`${SelectedYear}-${SelectedMonth}`) && ArrData.includes(SelectedYear)){
        console.log("Selected month of reports no longer exists but the year does");
        //the selected month of reports no longer exists but the year does
        if(localStorage.getItem(`${SelectedYear}-${SelectedMonth}-${SelectedStation}`) == ""){ localStorage.removeItem(`${SelectedYear}-${SelectedMonth}-${SelectedStation}`); }
        SelectedMonth = "all";
        SelectedDay = "all";
        document.getElementById("HMTH").value = SelectedMonth;
        document.getElementById("HDAY").value = SelectedDay;
        SearchHistory();
    }
    else if(!ArrData.includes(SelectedYear)){
        console.log("3");
        //selected year of reports no longer exists but the station does
        SelectedYear = "all";
        SelectedMonth = "all";
        SelectedDay = "all";
        document.getElementById("HYER").value = SelectedYear;
        document.getElementById("HMTH").value = SelectedMonth;
        document.getElementById("HDAY").value = SelectedDay;
        SearchHistory();
    }
    else{
        console.log("4");
        //check if day still exists, if it doesn't, then reset days
            console.log(DayExists());
            if(!DayExists()){
                console.log("5");
                UpdateHistoryFilter("days");
                SelectedDay = "all";
                SearchHistory();
                return;
            }
            else{
                console.log("6");
                //day currently exists, just reset the reports for the day.
                SearchHistory();
                return;
            }
    }
}


function SearchHistory(){
    //searches the history for reports.
    let job = "all", finalArray;
    for(var key in localStorage){
        if(key.startsWith("20")){
            //now we must figure out what exactly to view. This is easy but repetitive.
            if(SelectedStation == "all"){
                job = "all";
            }
            if(SelectedStation != "all" && SelectedYear == "all"){
                job = "years";
                //lists all years that contain reports stored from this station
                var YearsPresent = GetYears(); //eventually will use the list of years to create elements
                for(var k = 0; k < YearsPresent.length; k++){
                    YearsPresent[k] = `${SelectedStation}-${YearsPresent[k]}`;
                }
                finalArray = YearsPresent;
            }
            if(SelectedStation != "all" && SelectedYear != "all" && SelectedMonth == "all"){
                //lists all months that contain reports stored from this station in this year
                var MonthsPresent = GetMonths();
                for(var L = 0; L < MonthsPresent.length; L++){
                    MonthsPresent[L] = `${SelectedStation}-${SelectedYear}-${MonthsPresent[L]}`;
                }
                finalArray = MonthsPresent;
                job = "months";
            }
            if(SelectedStation != "all" && SelectedYear != "all" && SelectedMonth != "all" && SelectedDay == "all"){
                //lists all days that contain reports stored from this station in this month in this year
                var DaysPresent = GetDays();
                for(var M = 0; M < DaysPresent.length; M++){
                    if(DaysPresent[M] != ""){
                        DaysPresent[M] = `${SelectedStation}-${SelectedYear}-${SelectedMonth}-${DaysPresent[M]}`;
                    }
                }
                finalArray = DaysPresent;
                job = "days";
            }
            if(SelectedStation != "all" && SelectedYear != "all" && SelectedMonth != "all" && SelectedDay != "all"){
                //lists all reports on this particular day from this station
                finalArray = GetReports();
                job = "day";
            }
        }
    }
    switch(job){
        case "all":
            //display all stations
            document.getElementById("History").innerHTML = "<br>";
            var AllSTNS = Pageify(SiftLocalStorage("Station"), 5);
            for(var i = 0; i < AllSTNS.length; i++){
                for(var ii = 0; ii < AllSTNS[i].length; ii++){
                    var brInjection = "";
                    if(ii == AllSTNS[i].length-1){ brInjection = `<br><br>`; }
                    var node = document.createElement("div");
                    node.style.display = "inline";
                    node.className = `HistViewerItem ItemSTN${AllSTNS[i][ii]}`;
                    node.innerHTML = `
                    <p id="STN${AllSTNS[i][ii]}" style="display: inline;" class="HistItem">${AllSTNS[i][ii]}</p>${brInjection}
                    `;
                    document.getElementById("History").appendChild(node);
                    document.getElementById(`STN${AllSTNS[i][ii]}`).addEventListener("click", ClickedHist);
                }
            }
            break;
        case "years":
            //display all years
            document.getElementById("History").innerHTML = "<br>";
            var AllYears = SiftLocalStorage("Year");
            for(var o = 0; o < AllYears.length; o++){
                    var brInjection1 = "<br><br>";
                    var node1 = document.createElement("div");
                    node1.style.display = "inline";
                    node1.className = `HistViewerItem ItemYEAR${AllYears[o]}`;
                    node1.innerHTML = `
                    <p id="YER${AllYears[o]}" style="display: inline;" class="HistItem">${SelectedStation} ${AllYears[o]}</p>${brInjection1}
                    `;
                    document.getElementById("History").appendChild(node1);
                    document.getElementById(`YER${AllYears[o]}`).addEventListener("click", ClickedHist);
            }
            break;
        case "months":
            //display all months
            document.getElementById("History").innerHTML = `<br><h4 style="text-align: center; font-weight: bold; color: white;">${SelectedStation} ${SelectedYear}</h4>`;
            var AllMonths = Pageify(EnglishifyMonths(SiftLocalStorage("Month")), 5);
            console.log(AllMonths);
            for(var p = 0; p < AllMonths.length; p++){
                for(var pp = 0; pp < AllMonths[p].length; pp++){
                    var brInjection2 = "";
                    if(pp == AllMonths[p].length-1){ brInjection2 = `<br><br>`; }
                    var node2 = document.createElement("div");
                    node2.style.display = "inline";
                    node2.className = `HistViewerItem ItemMONTH${AllMonths[p][pp]}`;
                    node2.innerHTML = `
                    <p id="MTH${AllMonths[p][pp]}" style="display: inline;" class="HistItem">${AllMonths[p][pp]}</p>${brInjection2}
                    `;
                    document.getElementById("History").appendChild(node2);
                    document.getElementById(`MTH${AllMonths[p][pp]}`).addEventListener("click", ClickedHist);
                }
            }
            break;
        case "days":
            //display all days
            document.getElementById("History").innerHTML = `<br><h4 style="text-align: center; font-weight: bold; color: white;">${SelectedStation} ${EnglishifyMonths([SelectedMonth]).toString().toUpperCase()} ${SelectedYear}</h4>`;
            var AllDays = Pageify(SiftLocalStorage("Day"), 7);
            for(var r = 0; r < AllDays.length; r++){
                for(var rr = 0; rr < AllDays[r].length; rr++){
                    var brInjection3 = "", styleInjection = "";
                    if(rr == AllDays[r].length-1){ brInjection3 = `<br>`; }
                    if(rr == 0){ styleInjection = "margin-left: 75px;"; }
                    var node3 = document.createElement("div");
                    node3.style.display = "inline";
                    node3.className = `HistViewerItem ItemDAY${AllDays[r][rr]}`;
                    node3.innerHTML = `
                    <p id="DAY${AllDays[r][rr]}" style="display: inline; ${styleInjection}" class="HistItemDay">${AllDays[r][rr]}</p>${brInjection3}
                    `;
                    document.getElementById("History").appendChild(node3);
                    document.getElementById(`DAY${AllDays[r][rr]}`).addEventListener("click", ClickedHist);
                }
            }
            break;
        case "day":
            //display all reports
            document.getElementById("History").innerHTML = `<br><h4 style="text-align: center; font-weight: bold; color: #d2cfcf;">${SelectedStation} ${EnglishifyMonths([SelectedMonth]).toString().toUpperCase()} ${SelectedDay} ${SelectedYear}</h4>`;
            for(var m in finalArray){
                let node4 = document.createElement("div");
                let errs = REPORTHANDLER(finalArray[m], "history");
                let errInj = `background-color: red; color: white; font-weight: bold;`, errTitle;
                !errs.length > 0 ? errInj = `` : errTitle = `title="${errs.join("\n").replaceAll("\"", "")}"`;
                node4.className = `HistViewerItem REPORT${m}`;
                node4.innerHTML = `
                <p id="RPT${m}" class="HistRPTItem" style="margin-left: 5px; margin-right: 10px;${errInj}" ${errTitle}>${finalArray[m]}</p>
                `;
                document.getElementById("History").appendChild(node4);
                document.getElementById(`RPT${m}`).addEventListener("click", ClickedHist);
                console.log(finalArray[m]);
            }
            break;
        default:
            console.log(job);
    }
}


function EnglishifyMonths(val){
    let builder = [];
    for(var i = 0; i < val.length; i++){
        builder.push(Months[+val[i]]);
    }
    return builder;
}


function ClickedHist(){
    //checks to see which id was just pressed and acts accordingly
    var stage = CurrentElement.substr(0,3);
    switch(stage){
        case "STN":
            //navigates to station.
            if(HistoryMode == "view"){
                document.getElementById("HSTN").value = CurrentElement.substr(3);
                SelectedStation = CurrentElement.substr(3);
                UpdateHistoryFilter("years");
                SearchHistory();
            }
            else{
                //deletes all reports from this station
            }
            break;
        case "YER":
            //navigates to months
            if(HistoryMode == "view"){
                SelectedYear = CurrentElement.substr(3);
                UpdateHistoryFilter("years");
                UpdateHistoryFilter("months");
                SearchHistory();
            }
            else{
                //deletes all reports from this station in this year
                alert("Year deletion not currently possible. If this feature is somehow required at the moment, please check for updates.");
            }
            break;
        case "MTH":
            SelectedMonth = Months.indexOf(CurrentElement.substr(3));
            if(HistoryMode == "view"){
                UpdateHistoryFilter("months");
                UpdateHistoryFilter("days");
                SearchHistory();
            }
            else{
                //deletes the entire month of reports from this station in this year
                localStorage.removeItem(`${SelectedYear}-${SelectedMonth}-${SelectedStation}`);
                UpdateHistoryFilter("years");
                UpdateHistoryFilter("months");
                StationDeletionHandler();
                SearchHistory();
            }
            break;
        case "DAY":
            SelectedDay = CurrentElement.substr(3);
            if(HistoryMode == "view"){
                UpdateHistoryFilter("months");
                UpdateHistoryFilter("days");
                SearchHistory();
            }
            else{
                //deletes the entire day of reports from this station in this month in this year
                DeleteHistory(SelectedDay, "day");
                if(!localStorage.getItem(`${SelectedYear}-${SelectedMonth}-${SelectedStation}`) && localStorage.getItem(`${SelectedYear}-${SelectedMonth}-${SelectedStation}`) == ''){
                    //all days in this month are deleted
                    console.log("Deleting month of reports");
                    localStorage.removeItem(`${SelectedYear}-${SelectedMonth}-${SelectedStation}`);
                }
                UpdateHistoryFilter("months");
                UpdateHistoryFilter("days");
                StationDeletionHandler();
                SearchHistory();
            }
            break;
        case "RPT":
            var SelectedReport = document.getElementById(CurrentElement);
            if(HistoryMode == "view"){
                console.log(SelectedReport);
                if(SelectedReport.title && WOAASETSE[0][0] == "true"){ navigator.clipboard.writeText(`${SelectedReport.title}\n${SelectedReport.innerHTML}`); } else if(WOAASETSE[0][0] == "true"){ navigator.clipboard.writeText(SelectedReport.innerHTML); }
                UpdateHistoryFilter("months");
                UpdateHistoryFilter("days");
                SearchHistory();
            }
            else{
                console.log("Killing report");
                //deletes the selected report
                DeleteHistory(SelectedReport.innerHTML, "report");
                UpdateHistoryFilter("months");
                UpdateHistoryFilter("days");
                StationDeletionHandler();
                SearchHistory();
            }
    }
}


function DeleteHistory(info, type){
    console.log(info);
    //deletes history of localstorage
    switch(type){
        case "report":
            if(localStorage.getItem(`${SelectedYear}-${SelectedMonth}-${SelectedStation}`).split("(").length == 2){
                console.log("Deleting Entire STN Report");
                localStorage.removeItem(`${SelectedYear}-${SelectedMonth}-${SelectedStation}`);
            }
            else{
                console.log("Deleting one report");
                var lclStgVar = localStorage.getItem(`${SelectedYear}-${SelectedMonth}-${SelectedStation}`);
                lclStgVar = lclStgVar.replace("(" + info, "");
                localStorage.setItem(`${SelectedYear}-${SelectedMonth}-${SelectedStation}`, lclStgVar);
            }
            break;
        case "day":
            var Insert = [];
            var AllReps = localStorage.getItem(`${SelectedYear}-${SelectedMonth}-${SelectedStation}`).split("(");
            for(var i = 0; i < AllReps.length; i++){
                if(AllReps[i].substr(5,2) != info){
                    //this report is not from this day, reinsert it.
                    Insert.push(AllReps[i]);
                }
                else{
                }
            }
            localStorage.setItem(`${SelectedYear}-${SelectedMonth}-${SelectedStation}`, Insert.join("("));
            break;
    }
}


function ChangedHVOPT(){
    //changedHistoryViewerOptions
    SelectedStation = HSTN.value;
    SelectedYear = HYER.value;
    SelectedMonth = HMTH.value;
    SelectedDay = HDAY.value;
    UpdateHistoryFilter("years");
    if(SelectedYear != "all"){ UpdateHistoryFilter("months"); }
    if(SelectedYear != "all" && SelectedMonth != "all"){ UpdateHistoryFilter("days"); }
    if(SelectedYear == "all"){
        UpdateHistoryFilter("years");
        UpdateHistoryFilter("months");
        UpdateHistoryFilter("days");
    }
    SelectedStation = HSTN.value;
    SelectedYear = HYER.value;
    SelectedMonth = HMTH.value;
    SelectedDay = HDAY.value;
    SetHistoryEventListeners();
    SearchHistory();
}


function UpdateHistoryFilter(job){
    HSTN = document.getElementById("HSTN");
    HYER = document.getElementById("HYER");
    HMTH = document.getElementById("HMTH");
    HDAY = document.getElementById("HDAY");
    switch(job){
        case "stations":
            var AllStations = SiftLocalStorage("Station");
            HSTN.innerHTML = `<option value="all">all</option>`;
            for(var k = 0; k < AllStations.length; k++){
                var option = document.createElement('option');
                option.value = AllStations[k];
                option.innerHTML = AllStations[k];
                HSTN.appendChild(option);
            }
            break;
        case "years":
            var AllYears = SiftLocalStorage("Year");
            AllYears = RemoveDuplicates(AllYears);
            HYER.innerHTML = `<option value="all">all</option>`; //remove previous additions.
            for(var l = 0; l < AllYears.length; l++){
                var option2 = document.createElement('option');
                if(AllYears[l] == SelectedYear){ option2.selected = true; }
                option2.value = AllYears[l];
                option2.innerHTML = AllYears[l];
                HYER.appendChild(option2);
            }
            break;
        case "months":
            var AllMonths = SiftLocalStorage("Month");
            AllMonths = RemoveDuplicates(AllMonths);
            HMTH.innerHTML = `<option value="all">all</option>`; //remove previous additions.
            for(var AM = 0; AM < AllMonths.length; AM++){
                var optionAM = document.createElement('option');
                if(AllMonths[AM] == SelectedMonth){ optionAM.selected = true; }
                optionAM.value = AllMonths[AM];
                optionAM.innerHTML = AllMonths[AM];
                HMTH.appendChild(optionAM);
            }
            HDAY.innerHTML = `<option value="all">all</option>`;
            break;
        case "days":
            var AllDays = SiftLocalStorage("Day");
            AllDays = RemoveDuplicates(AllDays);
            console.log(AllDays);
            HDAY.innerHTML = `<option value="all">all</option>`; //remove previous additions.
            for(var AD = 0; AD < AllDays.length; AD++){
                var optionAD = document.createElement('option');
                if(AllDays[AD] == SelectedDay){ optionAD.selected = true; }
                optionAD.value = AllDays[AD];
                optionAD.innerHTML = AllDays[AD];
                HDAY.appendChild(optionAD);
            }
            break;
    }
}


function Pageify(val, size){
    let toret = [];
    for (let i = 0; i < val.length; i += size) {
        toret.push(val.slice(i, i + size));
    }
    return toret;
}


function SiftLocalStorage(job){
    var ToRet = [];
    for(var key in localStorage){
        if(key.startsWith("20")){
            let data = key.split("-");
            switch(job){
                case "Station":
                    ToRet.push(data[2]);
                    break;
                case "Year":
                    if(key.includes(SelectedStation)){ ToRet.push(data[0]); }
                    break;
                case "Month":
                    if(key.includes(SelectedStation) && key.includes(SelectedYear)){ ToRet.push(parseInt(data[1])); }
                    break;
                case "Day":
                    if(key == `${SelectedYear}-${SelectedMonth}-${SelectedStation}`){
                        var AllDays = localStorage.getItem(key).split("(");
                        for(var j = 0; j < AllDays.length; j++){
                            var CurVal = AllDays[j].substr(5,2);
                            if(CurVal != undefined && CurVal != "") { ToRet.push(CurVal.toString()); }
                        }
                    }
                    break;
            }
        }
    }
    if(job == "Month"){
        ToRet = ToRet.map(Number);
        ToRet.sort((a, b) => a - b);
        return RemoveDuplicates(ToRet);
    }
    else{
        return RemoveDuplicates(ToRet).sort();
    }
}


function RemoveDuplicates(arr){
    return [...new Set(arr)];
}


//updates history viewer based on entered filters
function ChangedFilters(){
    let [curStation, hYear, hMonth, hDay] = document.getElementById("Filters").value.split(" ");
    curStation = curStation.toUpperCase();
    if(hYear && hYear.length < 3) {hYear = "20" + hYear; }
    if(hMonth && +hMonth < 10){ hMonth = "0" + +hMonth; }
    if(hDay && +hDay < 10){ hDay = "0" + +hDay; }
    if(!hYear){ hYear = "";}
    if(!hMonth){ hMonth = "";}
    if(!hDay){ hDay = "";}
    if(curStation){
        document.getElementById("Filters").value = `${curStation} ${hYear} ${hMonth} ${hDay}`;
    }
    //now we need to get and display reports stored in history
    SearchHistory(curStation, hYear, +hMonth.toString(), hDay);
}


//the settings is gonna be real ugly.
function applySettingsListeners(){
    document.getElementById("CopyRPTQC").addEventListener("click", changeSetting);
    document.getElementById("PlaySoundOnError").addEventListener("click", changeSetting);
    document.getElementById("whenToCheck").addEventListener("change", changeSetting);
    document.getElementById("StoreAUTO").addEventListener("click", changeStorage);
    document.getElementById("StoreATC").addEventListener("click", changeStorage);
    document.getElementById("StoreCWO").addEventListener("click", changeStorage);
    document.getElementById("StoreHome").addEventListener("click", changeStorage);
    document.getElementById("DetectExtremeAltimeter").addEventListener("click", changeErrors);
    document.getElementById("DetectExtremeTemp").addEventListener("click", changeErrors);
    document.getElementById("DetectExtremeDewPoint").addEventListener("click", changeErrors);
    document.getElementById("DetectWind").addEventListener("click", changeErrors);
    document.getElementById("ShowStnType").addEventListener("click", changePreference);
    document.getElementById("ShowDate").addEventListener("click", changePreference);
    document.getElementById("ShowModifier").addEventListener("click", changePreference);
    document.getElementById("ShowWind").addEventListener("click", changePreference);
    document.getElementById("ShowVis").addEventListener("click", changePreference);
    document.getElementById("ShowPWX").addEventListener("click", changePreference);
    document.getElementById("ShowSkyCond").addEventListener("click", changePreference);
    document.getElementById("ShowTempDP").addEventListener("click", changePreference);
    document.getElementById("ShowAltimeter").addEventListener("click", changePreference);
    document.getElementById("ShowRemarks").addEventListener("click", changePreference);
    document.getElementById("WOAASETTINGSS").addEventListener("click", toggleSettings);
}


//horrible design on the report viewer right now, will eventually be updated to not look as terrible
function DetermineSearch(){
    let el1 = document.getElementById("StationSearch").value, el2 = document.getElementById("hours").value, el3 = document.getElementById("ReportsContainer");
    document.getElementById("StationSearch").value = el1.toUpperCase();
    let ListedReportCount = 0;
    let DiagnosticNoReports = false;
    if(el1 == ""){ return; }
    else{
        if(el2 > 360){
            el2 = 360;
            document.getElementById("hours").value = 360;
        }
        else if(el2 < 0){
            el2 = 0;
            document.getElementById("hours").value = 0;
        }
        el3.style.display = "block";
        el3.innerHTML = "";
        let stations = parseStationEntry(el1.toUpperCase());
        var ComposedGET = `https://aviationweather.gov/cgi-bin/data/metar.php?ids=${stations}&hours=${el2}&format=raw`;
        GM_xmlhttpRequest({
            method: "GET",
            url: ComposedGET,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                if(!response.responseText){
                    el3.innerHTML = `<p style="text-align: center; color: white; font-weight: bold;">There are no reports available.</p>`;
                }
                else{
                    el3.innerHTML = `<p id="pInadherent" style="text-align: center; color: white; font-weight: bold;">None of the available reports adhere to the filters set.</p>`;
                    var rpts = response.responseText.split("\n");
                    let erpts = OrganizeReports(rpts, stations.split(","));
                    var CombinedErpts = [];
                    for(var jane in erpts){
                        for(var joseph = 0; joseph < erpts[jane][1].length; joseph++){
                            CombinedErpts.push(erpts[jane][1][joseph]);
                        }
                    }
                    for(var i in CombinedErpts){
                        if(CombinedErpts[i] == ""){ break; }
                        var ReturnedReport = REPORTHANDLER(CombinedErpts[i], "Formulate").split("]"); //returned value will be in the format of KSTN]TIMEZ]FormattedReport]errBool
                        var stn = ReturnedReport[0], time = ReturnedReport[1], FormattedReport = ReturnedReport[2], errs = ReturnedReport[3], ReportToStore = ReturnedReport[4];
                        //now to store the report(function will determine if report should or shouldn't be stored)
                        StoreReport(ReportToStore);
                        //now we need to determine if the report adheres to the current search filters. This code will be a little ugly
                        if(!ReportToStore.includes(ReportIncludes) && ReportIncludes != ""){
                            //nope
                            console.log("Failed to find anything in this report that contains " + ReportIncludes);
                        }
                        else if(!errs && OnlyErrors == true){
                            //nope
                            console.log("Failed to find errors contained in this report.");
                        }
                        else{
                            //report adheres to all current filters, display.
                            document.getElementById("pInadherent").style.display = "none";
                            if(ReportIncludes != ""){ FormattedReport = FormattedReport.replaceAll(ReportIncludes, `<span style="color: yellow; font-weight: bold; background: rgba(255,255,0, 0.2)">${ReportIncludes}</span>`); }
                            ListedReportCount++;
                            var node = document.createElement("div");
                            node.className = "ListedReport";
                            node.id = `REP${stn}${time}`;
                            node.style.textAlign = "center";
                            node.style.fontSize = "16px";
                            node.style.paddingTop = "11px";
                            node.style.zIndex = "11000";
                            if(ListedReportCount == 1){ node.style.borderRadius = "15px 15px 0px 0px"; }
                            node.setAttribute("reportToStore", ReportToStore);
                            if(errs.includes(",")) { errs = errs.split(","); }
                            if(errs){
                                if(errs.length > 1 && Array.isArray(errs)) { errs = errs.join("\n"); }
                                node.title = `${errs}\nOriginal, Unformatted Report: ${ReportToStore}`;
                                node.style.color = "white";
                                node.style.backgroundColor = "red";
                                node.style.fontWeight = "bold";
                            }
                            let HRinsert = i == CombinedErpts.length - 1 ? "" : "<hr>";
                            if(HRinsert == ""){ node.style.paddingBottom = "12px"; }
                            node.innerHTML = `${FormattedReport}${HRinsert}`;
                            el3.appendChild(node);
                            if(WOAASETSE[0][0] == "true"){ document.getElementById(`REP${stn}${time}`).addEventListener("click", CopyReport); }
                        }
                    }
                    //retrospectively add bottom border radius to lowest listed report
                    let AllReports = document.getElementsByClassName("ListedReport");
                    let LastReport = AllReports ? AllReports[AllReports.length - 1] : false;
                    if(LastReport && LastReport.style.borderRadius == "15px 15px 0px 0px"){ LastReport.style.borderRadius = "15px 15px 15px 15px"; }
                    else if(LastReport){ LastReport.style.borderRadius = "0px 0px 15px 15px"; }
                }
            }
        });
        //
        SearchHistory();
    }
}


function CopyReport(){
    navigator.clipboard.writeText(document.getElementById(CurrentElement).getAttribute("reporttostore"));
}


function OrganizeReports(rpts, stations){
    //organizes reports
    var FormattedReports = [];
    stations.forEach(function(val){
        FormattedReports.push([val, []]);
    });
    for(var i in stations){
        for(var o in rpts){
            if(rpts[o].startsWith(stations[i])){
                FormattedReports[i][1].push(rpts[o]);
            }
        }
    }
    return FormattedReports;
}


function BypassStore(rpt){
    //stores report regardless of settings. whenevr save report is pressed by user
}


function GetStorage(job){
    //gets the amount of reports and characters, and then determines how much of the storage is currently taken up.var sReportCNT = 0;
    //copied some of the code from my previous script
    var RPTCount = 0;
    var sReportCNT = 0;
    var allReports = [];
    var lclKeys = [];
    for (var key in localStorage){
        if(key.startsWith("20")){
            lclKeys.push(key);
            sReportCNT += localStorage.getItem(key).length;
            var thisReport = localStorage.getItem(key).split("(");
            thisReport.forEach(function(val){
                allReports.push(val);
            });
        }
    }
    var totCount = 0;
    lclKeys.forEach(
        function(val){
            var rpts = localStorage.getItem(val).split("(");
            totCount += rpts.length - 1;
        }
    );
    if(totCount != RPTCount){
        RPTCount = totCount;
        localStorage.setItem("RPTCount", RPTCount.toString());
    }
    switch(job){
        case "ToStore":
            var toRet;
            sReportCNT > 4500000 ? toRet = false : toRet = true;
            return toRet;
        case "ToAlert":
            alert(`With ${RPTCount} reports totalling ${(sReportCNT / 1000000).toFixed(2)}mb of storage, ${Math.round(100*(sReportCNT/4500000))}% of the report storage is taken up.`);
            break;
    }
}


function StoreReport(report){
    let CurrentStorage = GetStorage("ToStore");
    if(!CurrentStorage){
        console.log("Storage full, cannot store report.");
        return false;
    }
    //stores report if intended to be stored.
    var stn = report.substr(0, 4);
    var rptTime = report.substr(5,6);
    var stationType;
    if(CWOSTNS.includes(stn)){ stationType = "CWO"; }
    if(report.includes(" AUTO ")){ stationType = "AUTO"; }
    else if(stationType != "CWO" && stationType != "AUTO"){ stationType = "ATC" } //could probably make this shorter with ternary operators or something but my brain is fried atm on 30 minutes of sleep
    if(HomeSTN == stn && WOAASETST[3][0] == "true"){
        //this is home stn and homestn only storage mode on
        Enter();
    }
    else if(WOAASETST[2][0] == "true" && stationType == "CWO" || stn == "KMWN"){
        //store cwo report
        Enter();
    }
    else if(WOAASETST[1][0] == "true" && stationType == "ATC"){
        //store ATC report
        Enter();
    }
    else if(WOAASETST[0][0] == "true" && stationType == "AUTO"){
        //store autoreport
        Enter();
    }
    function Enter(){
        //DEV NOTE::: TO MAKE IT EASY, SEARCH FOR "COR" IN NEW REPORT AND IF PRESENT AUTOMATICALLY REPLACE OTHER REPORT. SEARCH BY REPORT DATES/TIMES TO MATCH, NOT ENTIRE RPT
        //save report
        var tYear = new Date().getUTCFullYear();
        var tMonth = new Date().getUTCMonth() + 1;
        var rDay = +report.substr(5,2);
        var curDay = +(new Date().getDate());
        if(rDay > curDay && curDay < 15 && rDay > 15){ //if rDay > 16 wasn't there, then reports that on paper look from the next day would be in the previous month.
            console.log("Report from month prior.");
            //store report in last month's variable
            tMonth != 1 ? tMonth-- : tMonth = 12;
            if(localStorage.getItem(`${tYear}-${tMonth}-${stn}`) == undefined){
                localStorage.setItem(`${tYear}-${tMonth}-${stn}`, `(${report}`);
            }
            else{
                var allReports = ArrCleaner(localStorage.getItem(`${tYear}-${tMonth}-${stn}`).split("("));
                console.log(allReports);
                for(var i = 0; i < allReports.length; i++){
                    var CurrentReportTime = allReports[i].substr(5,6);
                    if(CurrentReportTime == rptTime && ((report.includes("COR") && allReports[i].includes("COR")) || (!report.includes("COR") && !allReports[i].includes("COR")))){
                        //exact match found
                        return;
                    }
                    else if(CurrentReportTime == rptTime && ((!report.includes("COR") && allReports[i].includes("COR")) || (report.includes("COR") && !allReports[i].includes("COR")))){
                        //match found but report updated
                        allReports[i] = report;
                        localStorage.setItem(`${tYear}-${tMonth}-${stn}`, `(${allReports.join("(")}`);
                        return;
                    }
                }
                //if we get to here, no match has been found.
                allReports.push(`${report}`);
                console.log(allReports);
                localStorage.setItem(`${tYear}-${tMonth}-${stn}`, `(${allReports.join("(")}`);
                return;
            }
        }
        else{
            if(localStorage.getItem(`${tYear}-${tMonth}-${stn}`) == undefined){
                localStorage.setItem(`${tYear}-${tMonth}-${stn}`, `(${report}`);
            }
            else{
                var alllReports = ArrCleaner(localStorage.getItem(`${tYear}-${tMonth}-${stn}`).split("("));
                console.log(alllReports);
                for(var ii = 0; ii < alllReports.length; ii++){
                    var CurrentReportTimee = alllReports[ii].substr(5,6);
                    if(CurrentReportTimee == rptTime && ((report.includes("COR") && alllReports[ii].includes("COR")) || (!report.includes("COR") && !alllReports[ii].includes("COR")))){
                        //exact match found
                        return;
                    }
                    else if(CurrentReportTimee == rptTime && ((!report.includes("COR") && alllReports[ii].includes("COR")) || (report.includes("COR") && !alllReports[ii].includes("COR")))){
                        //match found but report updated
                        alllReports[ii] = report;
                        localStorage.setItem(`${tYear}-${tMonth}-${stn}`, `(${alllReports.join("(")}`);
                        return;
                    }
                }
                //if we get to here, no match has been found.
                alllReports.push(`${report}`);
                console.log(alllReports);
                localStorage.setItem(`${tYear}-${tMonth}-${stn}`, `(${alllReports.join("(")}`);
                return;
            }
        }
        SearchHistory();
        UpdateHistoryFilter("stations");
        UpdateHistoryFilter("years");
        UpdateHistoryFilter("months");
        UpdateHistoryFilter("days");
        UpdateHistoryFilter("reports");
    }
}


function ArrCleaner(arr){
    var newArr = [];
    for(var i in arr){
        if(arr[i] != '' && arr[i] != "("){
            var tempVal = arr[i].replaceAll("(", "");
            newArr.push(tempVal);
        }
    }
    return newArr;
}


function parseStationEntry(val){
    let Parsed = [...val.matchAll(/(?:K|P|T)[A-Z0-9]{3}/gm)];
    return Parsed.join(",");
}


function changeSetting(){
    let elCopyRPTQC = document.getElementById("CopyRPTQC"), elPlaySoundOnError = document.getElementById("PlaySoundOnError"), elWhenToCheck = document.getElementById("whenToCheck").value.toString();;
    elCopyRPTQC.checked ? elCopyRPTQC = ["true", "checked"] : elCopyRPTQC = ["false", ""];
    elPlaySoundOnError.checked ? elPlaySoundOnError = ["true", "checked"] : elPlaySoundOnError = ["false", ""];
    WOAASETSE = [elCopyRPTQC, elPlaySoundOnError, elWhenToCheck, WOAASETSE[3], WOAASETSE[4], WOAASETSE[5]];
    localStorage.setItem("WOAASETSE", JSON.stringify(WOAASETSE));
    ResetSettings("fsGeneralSettings");
}


function changeStorage(){
    let StoreAUTO = document.getElementById("StoreAUTO");
    let StoreATC = document.getElementById("StoreATC");
    let StoreCWO = document.getElementById("StoreCWO");
    let StoreHome = document.getElementById("StoreHome");
    if(wasCheckedBefore == "false" && StoreHome.checked){
        StoreHome = ["true", "checked"];
        StoreAUTO = ["false", ""];
        StoreATC = ["false", ""];
        StoreCWO = ["false", ""];
    }else{
        StoreAUTO.checked ? StoreAUTO = ["true", "checked"] : StoreAUTO = ["false", ""];
        StoreATC.checked ? StoreATC = ["true", "checked"] : StoreATC = ["false", ""];
        StoreCWO.checked ? StoreCWO = ["true", "checked"] : StoreCWO = ["false", ""];
        StoreHome = ["false", ""];
    }
    WOAASETST = [StoreAUTO, StoreATC, StoreCWO, StoreHome];
    wasCheckedBefore = WOAASETST[3][0];
    localStorage.setItem("WOAASETST", JSON.stringify(WOAASETST));
    ResetSettings("fsReportStorageSettings");
}


function changeErrors(){
    let DetectExtremeAltimeter = document.getElementById("DetectExtremeAltimeter");
    let DetectExtremeTemp = document.getElementById("DetectExtremeTemp");
    let DetectExtremeDewPoint = document.getElementById("DetectExtremeDewPoint");
    let DetectWind = document.getElementById("DetectWind");
    DetectExtremeAltimeter.checked ? DetectExtremeAltimeter = ["true", "checked"] : DetectExtremeAltimeter = ["false", ""];
    DetectExtremeTemp.checked ? DetectExtremeTemp = ["true", "checked"] : DetectExtremeTemp = ["false", ""];
    DetectExtremeDewPoint.checked ? DetectExtremeDewPoint = ["true", "checked"] : DetectExtremeDewPoint = ["false", ""];
    DetectWind.checked ? DetectWind = ["true", "checked"] : DetectWind = ["false", ""];
    WOAAER = [ DetectExtremeAltimeter, DetectExtremeTemp, DetectExtremeDewPoint, DetectWind ];
    localStorage.setItem("WOAAERDEFAULT", JSON.stringify(WOAAER));
    ResetSettings("fsGeneralErrDetSettings");
}


function changePreference(){
    let ShowStnType = document.getElementById("ShowStnType").checked; //don't ask why i just appended the .checked now and why i'm not fixing up the code before this
    let ShowDate = document.getElementById("ShowDate").checked;
    let ShowModifier = document.getElementById("ShowModifier").checked;
    let ShowWind = document.getElementById("ShowWind").checked;
    let ShowVis = document.getElementById("ShowVis").checked;
    let ShowPWX = document.getElementById("ShowPWX").checked;
    let ShowSkyCond = document.getElementById("ShowSkyCond").checked;
    let ShowTempDP = document.getElementById("ShowTempDP").checked;
    let ShowAltimeter = document.getElementById("ShowAltimeter").checked;
    let ShowRemarks = document.getElementById("ShowRemarks").checked;
    ShowStnType ? ShowStnType = ["true", "checked"] : ["false", ""];
    ShowDate ? ShowDate = ["true", "checked"] : ["false", ""];
    ShowWind ? ShowWind = ["true", "checked"] : ["false", ""];
    ShowModifier ? ShowModifier = ["true", "checked"] : ["false", ""];
    ShowVis ? ShowVis = ["true", "checked"] : ["false", ""];
    ShowPWX ? ShowPWX = ["true", "checked"] : ["false", ""];
    ShowSkyCond ? ShowSkyCond = ["true", "checked"] : ["false", ""];
    ShowTempDP ? ShowTempDP = ["true", "checked"] : ["false", ""];
    ShowAltimeter ? ShowAltimeter = ["true", "checked"] : ["false", ""];
    ShowRemarks ? ShowRemarks = ["true", "checked"] : ["false", ""];
    WOAASETPR = [ShowStnType, ShowDate, ShowModifier, ShowWind, ShowVis, ShowPWX, ShowSkyCond, ShowTempDP, ShowAltimeter, ShowRemarks];
    localStorage.setItem("WOAASETPR", JSON.stringify(WOAASETPR));
    ResetSettings("fsReportViewerSettings");
    DetermineSearch();
}


function ResetSettings(toChange){
    let elSetts = document.getElementById(toChange);
    switch(toChange){
        case "fsGeneralSettings":
            elSetts.innerHTML = `
            <h6 style="color: white; text-align: center;"><b>General Settings</b></h6>
            <input type="checkbox" class="WOAASETSE" id="CopyRPTQC" ${WOAASETSE[0][1]}>
            <label for="CopyRPTQC">Copy Reports on Click</label><br>
            <input type="checkbox" class="WOAASETSE" id="PlaySoundOnError" ${WOAASETSE[1][1]}>
            <label for="PlaySoundOnError" title="When a custom ALERT for an error is detected, play a sound.\nUseful if in another tab with this script running in the background.">Play Sound On Alert</label><br>
            Check Home STN H+<input class="WOAASETSE" type="number" id="whenToCheck" max="59" min="0" value="${+WOAASETSE[2]}"><br>
            `;
            break;
        case "fsReportStorageSettings":
            elSetts.innerHTML = `
            <h6 style="color: white; text-align: center;"><b>Report Storage Settings</b></h6>
            <input type="checkbox" class="WOAASETST" id="StoreAUTO" ${WOAASETST[0][1]}>
            <label for="StoreAUTO" title="Store reports disseminated by AUTOmatic stations.">Store AUTO Reports</label><br>
            <input type="checkbox" class="WOAASETST" id="StoreATC" ${WOAASETST[1][1]}>
            <label for="StoreATC" title="Store Reports disseminated by stations manned by Air Traffic Controllers.">Store ATC Reports</label><br>
            <input type="checkbox" class="WOAASETST" id="StoreCWO" ${WOAASETST[2][1]}>
            <label for="StoreCWO" title="Store Reports disseminated by stations manned by Certified Weather Observers.">Store CWO Reports</label><br>
            <input type="checkbox" class="WOAASETST" id="StoreHome" ${WOAASETST[3][1]}>
            <label for="StoreHome" title="Store ONLY reports disseminated by the home station set herein">Only Store Home Station Reports</label>
            `;
            break;
        case "fsGeneralErrDetSettings":
            elSetts.innerHTML = `<h6 style="color: white; text-align: center;"><b>General Error Detection Settings</b></h6>
            <input type="checkbox" class="WOAASETER" id="DetectExtremeAltimeter" ${WOAAER[0][1]}>
            <label for="DetectExtremeAltimeter" title="Detects a record high or low altimeter setting as an error.">Detect Extreme Altimeter</label><br>
            <input type="checkbox" class="WOAASETER" id="DetectExtremeTemp" ${WOAAER[1][1]}>
            <label for="DetectExtremeTemp" title="Detects a record high or low temperature as an error.">Detect Extreme Temperature</label><br>
            <input type="checkbox" class="WOAASETER" id="DetectExtremeDewPoint" ${WOAAER[2][1]}>
            <label for="DetectExtremeDewPoint" title="Detects a record high or low dew point as an error.">Detect Extreme Dew Point</label><br>
            <input type="checkbox" class="WOAASETER" id="DetectWind" ${WOAAER[3][1]}>
            <label for="DetectWind" title="Detects invalid winds.">Detect Invalid Winds</label>
            `;
            break;
        case "fsReportViewerSettings":
            elSetts.innerHTML = `
            <h6 style="color: white; text-align: center;"><b>Report Viewer Settings</b></h6>
            <input type="checkbox" class="WOAASETPR" id="ShowStnType" ${WOAASETPR[0][1]}>
            <label for="ShowStnType">Show Station Type(CWO/ATC/AUTO)</label><br>
            <input type="checkbox" class="WOAASETPR" id="ShowDate" ${WOAASETPR[1][1]}>
            <label for="ShowDate">Show Date/Time Section</label><br>
            <input type="checkbox" class="WOAASETPR" id="ShowModifier" ${WOAASETPR[2][1]}>
            <label for="ShowModifier">Show Report Modifier</label><br>
            <input type="checkbox" class="WOAASETPR" id="ShowWind" ${WOAASETPR[3][1]}>
            <label for="ShowWind">Show Wind Section</label><br>
            <input type="checkbox" class="WOAASETPR" id="ShowVis" ${WOAASETPR[4][1]}>
            <label for="ShowVis">Show Visibility Section</label><br>
            <input type="checkbox" class="WOAASETPR" id="ShowPWX" ${WOAASETPR[5][1]}>
            <label for="ShowPWX">Show Pres Wx Section</label><br>
            <input type="checkbox" class="WOAASETPR" id="ShowSkyCond" ${WOAASETPR[6][1]}>
            <label for="ShowSkyCond">Show Sky Condition Section</label><br>
            <input type="checkbox" class="WOAASETPR" id="ShowTempDP" ${WOAASETPR[7][1]}>
            <label for="ShowTempDP">Show Temp/Dew Point Section</label><br>
            <input type="checkbox" class="WOAASETPR" id="ShowAltimeter" ${WOAASETPR[8][1]}>
            <label for="ShowAltimeter">Show Altimeter Section</label><br>
            <input type="checkbox" class="WOAASETPR" id="ShowRemarks" ${WOAASETPR[9][1]}>
            <label for="ShowRemarks">Show Remarks Section</label><br>
            `;
    }
    applySettingsListeners();
    console.log("Reset Settings Successfully");
}


function SecondlyUpdate(){
    var pop = document.getElementsByClassName("popup_content");
    var pop1 = document.getElementsByClassName("popup_subhead");
    if(pop[0] && pop[0].style.color != "red" && !pop[0].innerHTML.includes("PIREP") && !pop1[0].innerHTML.includes("TAF") && (pop[0].innerHTML.startsWith("K") || pop[0].innerHTML.startsWith("P") || pop[0].innerHTML.startsWith("T"))){
        let errors = REPORTHANDLER(pop[0].innerHTML);
        if(errors){
            pop[0].title = errors.join("\n");
            pop[0].style.fontWeight = "bold";
            pop[0].style.color = "red";
        }
    }
}


function Update(){
    if(!UpdateCalibrated){
        var secs = new Date().getSeconds();
        if(+secs == 24){
            //update calibrated
            UpdateCalibrated = true;
            console.log("Update Calibrated");
            clearInterval(UpdateInterval);
            UpdateInterval = setInterval(Update, 60000);
        }
    }
    else{
        //routine minutely update.
        var mins = new Date().getMinutes();
        if(mins == "15" || mins == "30" || mins == "45" || mins == "0"){ DetermineSearch(); } //quarterly search refreshes
        if(mins == WOAASETSE[2]){
            var ComposedGET = `https://aviationweather.gov/cgi-bin/data/metar.php?ids=${HomeSTN}&hours=1&format=raw`;
            GM_xmlhttpRequest({
                method: "GET",
                url: ComposedGET,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function(response) {
                    var rpts = response.responseText.split("\n");
                    var ERRS = [];
                    console.log(rpts);
                    for(var i in rpts){
                        if(rpts[i] == ""){ break; }
                        var tempErrs = REPORTHANDLER(rpts[i], "rpt");
                        for(var j in tempErrs){
                            if(tempErrs[j] != ""){ ERRS.push(tempErrs[j]); }
                        }
                        StoreReport(rpts[i]);
                    }
                    if(ERRS != ""){
                        wAlert("ERRORS DETECTED:", "", ERRS.join("<br>"));
                    }
                    console.log(ERRS);
                }
            });
        }
    }
}


function changeHomeSTN(){
    var editHME = prompt("Please Enter Your New Home Station: ", "KXXX").toUpperCase();
    if(editHME.length == 4){
        HomeSTN = editHME;
        var ele = document.getElementById("AlterHomeSTN");
        ele.innerHTML = "Change Home Station: " + HomeSTN.toUpperCase();
        localStorage.setItem("HomeSTN", HomeSTN.toUpperCase());
    }
    else{
        alert("Invalid Station Entry, Aborting.");
    }
}


function toggleSettings(){
    if(!StartupWizardActive){
        console.log("Toggling Settings");
        //we must determine if we need to open the settings or close it.
        var setbox = document.getElementById("WOAASETTINGS");
        settingsEnDi == 0 ? setbox.style.display = "block" : setbox.style.display = "none";
        settingsEnDi = !settingsEnDi;
    }
}


function checkReport(){
    if(!StartupWizardActive){
        //user has prompted this function by clicking the button, ask for the report to be put in and it'll alert them with any errors are detected, and let them know if none are detected.
        let userReport = prompt("Please enter the report to be checked for errors:", "");
        // if(WOAASETSE[0][0] == "true"){ navigator.clipboard.writeText(userReport); } currently disabled, likely to be re-enabled in the future.
        var errors = REPORTHANDLER(userReport, "CWOCHECK");
        if(errors === undefined || errors.length == 0){ alert("No Errors Have Been Detected"); }
        else{
            alert(errors);
        }
    }
}


function toggleRPTS(){
    if(!StartupWizardActive){
        var setbox = document.getElementById("WOAAREPORTS");
        tRPTS == 0 ? setbox.style.display = "block" : setbox.style.display = "none";
        tRPTS = !tRPTS;
    }
}


function toggleHistory(){
    if(!StartupWizardActive){
        var HistoryPresent = false;
        for (var key in localStorage){
            if(key.startsWith("20")){
                HistoryPresent = true;
            }
        }
        if(!HistoryPresent){
            alert("Since there are no reports stored yet, the history report viewer is currently inaccessible.");
        }
        else{
            var setbox = document.getElementById("WOAAHISTORY");
            tHIST == 0 ? setbox.style.display = "block" : setbox.style.display = "none";
            tHIST = !tHIST;
        }
    }
}


function ErrorLogArr(arr){
    for(var el of arr){
        if(el != ""){ REPORTHANDLER(el); }
    }
}


window.addEventListener("keypress", function(event) {
    if (event.target.tagName.toLowerCase() === 'input') {
        return; // Ignore keypress event
    }
    if(event.key == "]"){
    for(var i = 0; i < CWOSTNS.length; i++){
 var CompG = `https://aviationweather.gov/cgi-bin/data/metar.php?ids=${CWOSTNS[i]}&hours=360&format=raw`;
GM_xmlhttpRequest({
            method: "GET",
            url: CompG,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                var rpts = response.responseText.split("\n");
                let CompleteLog = "";
for(var j in rpts){
if(rpts[j].includes("FG")){ CompleteLog = CompleteLog + "\n" + rpts[j]; }
}
                console.log(CompleteLog);
            }
        });
}
    }
    if(event.key.toLowerCase() == "e"){ GenerateSupportTicket(); }
    if(event.key.toLowerCase() == "r") { checkReport(); }
    if(event.key.toLowerCase() == "q"){ QCCheck(); }
    if(event.key == "[") {
        var comp = CWOSTNS.join(",");
        var ComposedGET = `https://aviationweather.gov/cgi-bin/data/metar.php?ids=${comp}&hours=1&format=raw`;
        GM_xmlhttpRequest({
            method: "GET",
            url: ComposedGET,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                var rpts = response.responseText.split("\n");
                var CWOERRS = [];
                console.log(rpts);
                for(var i in rpts){
                    if(rpts[i] == ""){ break; }
                    var tempErrs = REPORTHANDLER(rpts[i], "CWOCHECK");
                    for(var j in tempErrs){
                        if(tempErrs[j] != ""){ CWOERRS.push(tempErrs[j]); }
                    }
                }
                if(CWOERRS != ""){
                     audio.play();
                     CustomAlertParent.innerHTML = `${CustomAlertParent.innerHTML}<div class="alert alert-dismissible fade show alert-primary" role="alert"><i class="bi bi-info-circle pe-2"></i><p>ERRORS DETECTED:<br>${CWOERRS.join("<br>")}</p><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
                }
                console.log(CWOERRS);
            }
        });
  }
    else if(event.key.toLowerCase() == "z"){
        var tYear = new Date().getUTCFullYear(), tMonth = new Date().getUTCMonth() + 1, tDay = new Date().getUTCDate(), tHours = new Date().getUTCHours(), tMin = new Date().getUTCMinutes();
        if(tDay.toString().length < 2){ tDay = "0" + tDay; }
        if(tHours.toString().length < 2){ tHours = "0" + tHours; }
        if(tMin.toString().length < 2){ tMin = "0" + tMin; }
        let tTime = `${tHours}${tMin}`;
        let FullEntry = prompt(`Enter station, month, and date/time section, with or without Z.`, `${HomeSTN} ${tMonth} ${tDay}${tTime}`);
        let EnteredSTN = FullEntry.split(" ")[0], EnteredMonth = +FullEntry.split(" ")[1], EnteredDate = FullEntry.split(" ")[2].substr(0,2), EnteredTime = FullEntry.split(" ")[2].substr(2,4);
        EnteredMonth < 10 ? EnteredMonth = "0" + EnteredMonth : EnteredMonth = EnteredMonth.toString();
        if(tMonth == 1 && EnteredMonth == 12) { tYear--; }
        var GETREQ = `https://aviationweather.gov/cgi-bin/data/metar.php?ids=${EnteredSTN}&format=raw&taf=false&date=${tYear}${EnteredMonth}${EnteredDate}_${EnteredTime}`;
        console.log(GETREQ);
        GM_xmlhttpRequest({
            method: "GET",
            url: GETREQ,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                var rpt = response.responseText;
                if(rpt != undefined){
                    var getRPTTIME = rpt.substr(5, 6);
                    if(getRPTTIME == `${EnteredDate}${EnteredTime}`){
                        //report found. Run through error detector, if errors were detected, then display errors. Otherwise, display report via simple alert and run it thru the store function.
                        var AnyErrors = REPORTHANDLER(rpt, "rpt");
                        if(!AnyErrors){ alert(`Report: ${rpt}\nNo errors detected.`); }
                        StoreReport(rpt);
                    }
                    else{
                        alert(`Unable to find report with these parameters:\nStation: ${EnteredSTN}\nYear: ${tYear}\nMonth: ${EnteredMonth}\nDate: ${EnteredDate}\nTime: ${EnteredTime}`);
                    }
                }
                else{
                    alert(`Unable to find report with these parameters:\nStation: ${EnteredSTN}\nYear: ${tYear}\nMonth: ${EnteredMonth}\nDate: ${EnteredDate}\nTime: ${EnteredTime}`);
                }
            }
        });
    }
    switch(event.key){
        case "\\":
            alert(`You are using WOAA Version ${WOAAVERSION}.`);
            break;
        case "=":
            GetStorage("ToAlert");
            break;
        case "?":
            alert("© 2023 Kenneth William Anderson IV. All Rights Reserved. \n\nNo part of this script may be modified, redistributed, or sold without explicit permission.");
            break;
    }
});


function GenerateSupportTicket(){
    //generates support ticket for my logs. Contains an array of the ID, script version, the home station, and a random number.
    navigator.clipboard.writeText(`${localStorage.getItem("UID")}-${WOAAVERSION}-${HomeSTN}-${genRand(8)}`);
    alert("Copied Support Ticket to Clipboard.");
}


function QCCheck(job){
    var SS, CS;
    var recalMETs = 0, recalSPEs = 0, cando = 1;
    var rawRPTS = [], rptTYPES = [];
    GM_xmlhttpRequest({
    method: "GET",
    url: `https://aviationweather.gov/cgi-bin/data/metar.php?ids=${HomeSTN}&hours=8&format=json`,
    headers: {
        "Content-Type": "application/json"
    },
    onload: function(response) {
        var rpts = response.responseText.replaceAll("\\", "").split("\"");
        var rptTimes = [];
        console.log(rpts);
        rpts.forEach(function(el){
            if(el === "METAR" || el === "SPECI"){ rptTYPES.push(el); }
            if(el.startsWith(`${HomeSTN} `)){
                rawRPTS.push(el);
                if(rawRPTS[0].includes(" AUTO ")){
                    cando = 0;
                }
                var potErrors = REPORTHANDLER(el, "qc");
                if(potErrors != ""){
                    for(var err in potErrors){
                        ERRORS.push(potErrors[err]);
                    }
                }
                var addTo = parseInt(el.substr(9, 2));
                if(addTo < 49 || addTo == 59){ recalSPEs++; } else { recalMETs++; }
            }
        });
        rptTYPES.forEach(function(val){
            val == "METAR" ? METARs++ : SPECIs++;
        });
        if(!cando){ return; }
        if(recalSPEs != 1){ SS = "s"; } else { SS = ""; }
        if(CORs != 1){ CS = "s"; } else { CS = ""; }
        var ErrC = ERRORS.length;
        if(ERRORS != "") { ERRORS = ERRORS.join("<br>"); }
        if(job == "CYCLE"){
            if(ERRORS.length > 0){ CustomAlertParent.innerHTML = `${CustomAlertParent.innerHTML}<div class="alert alert-dismissible fade show alert-primary" role="alert"><i class="bi bi-info-circle pe-2"></i><p>WOAA Tally: ${recalMETs} METARs, ${recalSPEs} SPECI${SS}, and ${CORs} COR${CS}. ${ErrC} ERROR(S): ${ERRORS}.</p><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`; }
        }
        if(METARs > 8 && job != "CYCLE"){
            ERRORS.length > 0 ? CustomAlertParent.innerHTML = `${CustomAlertParent.innerHTML}<div class="alert alert-dismissible fade show alert-primary" role="alert"><i class="bi bi-info-circle pe-2"></i><p>WOAA Tally: ${recalMETs} METARs, ${recalSPEs} SPECI${SS}, and ${CORs} COR${CS}. ${ErrC} ERROR(S): ${ERRORS}.</p><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>` : CustomAlertParent.innerHTML = `${CustomAlertParent.innerHTML}<div class="alert alert-dismissible fade show alert-primary" role="alert"><i class="bi bi-info-circle pe-2"></i><p>WOAA Tally: ${recalMETs} METARs, ${recalSPEs} SPECI${SS}, and ${CORs} COR${CS}.</p><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;;
        }
        else if(METARs < 8 && job != "CYCLE"){
            ERRORS.length > 0 ? CustomAlertParent.innerHTML = `${CustomAlertParent.innerHTML}<div class="alert alert-dismissible fade show alert-primary" role="alert"><i class="bi bi-info-circle pe-2"></i><p>Invalid METAR Count: ${recalMETs} METARs, ${recalSPEs} SPECI${SS}, and ${CORs} COR${CS}. ${ErrC} ERROR(S): ${ERRORS}.</p><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>` : CustomAlertParent.innerHTML = `${CustomAlertParent.innerHTML}<div class="alert alert-dismissible fade show alert-primary" role="alert"><i class="bi bi-info-circle pe-2"></i><p>Invalid METAR Count: ${recalMETs} METARs, ${recalSPEs} SPECI${SS}, and ${CORs} COR${CS}.</p><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
        }
        else if(METARs == 8 && job != "CYCLE"){
            ERRORS.length > 0 ? CustomAlertParent.innerHTML = `${CustomAlertParent.innerHTML}<div class="alert alert-dismissible fade show alert-primary" role="alert"><i class="bi bi-info-circle pe-2"></i><p>There has been ${recalMETs} METARs, ${recalSPEs} SPECI${SS}, and ${CORs} COR${CS} in the past 8 hours. ${ErrC} ERROR(S): ${ERRORS}.</p><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>` : CustomAlertParent.innerHTML = `${CustomAlertParent.innerHTML}<div class="alert alert-dismissible fade show alert-primary" role="alert"><i class="bi bi-info-circle pe-2"></i><p>There has been ${METARs} METARs, ${SPECIs} SPECI${SS}, and ${CORs} COR${CS} in the last 8 hours.</p><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
        }
    }
    });
    METARs = 0;
    SPECIs = 0;
    CORs = 0;
    ERRORS = [];
}


//the below code is for the individual tabs. I remembered I used this code on an old application I made for a little debug window. That being said, I did not create the code for the moveable window
//myself, instead I copied it from the application I made before where I copied it from StackOverflow.
const d = document.getElementsByClassName("PopupBox");
var ex, yy;
for (let i = 0; i < d.length; i++) {
  d[i].style.position = "absolute";
}


function filter(e) {
  let target = e.target;
  let tID = target.id;
  CurrentElement = tID;
  tID = document.getElementById(tID.substr(0, tID.length-1));
  target = tID;
  if(tID == null){ return; }
  if (!tID.classList.contains("PopupBox")) {
    return;
  }
  target.moving = true;
  if (e.clientX) {
    target.oldX = e.clientX;
    target.oldY = e.clientY;
  } else {
    target.oldX = e.touches[0].clientX;
    target.oldY = e.touches[0].clientY;
  }
  target.oldLeft = window.getComputedStyle(target).getPropertyValue('left').split('px')[0] * 1;
  target.oldTop = window.getComputedStyle(target).getPropertyValue('top').split('px')[0] * 1;
  document.onmousemove = dr;
  document.ontouchmove = dr;
  function dr(event) {
    event.preventDefault();
    if (!target.moving) {
      return;
    }
    if (event.clientX) {
      target.distX = event.clientX - target.oldX;
      target.distY = event.clientY - target.oldY;
    } else {
      target.distX = event.touches[0].clientX - target.oldX;
      target.distY = event.touches[0].clientY - target.oldY;
    }
    target.style.left = target.oldLeft + target.distX + "px";
    target.style.top = target.oldTop + target.distY + "px";
  }
  function endDrag() {
    target.moving = false;
  }
  target.onmouseup = endDrag;
  target.ontouchend = endDrag;
}
document.onmousedown = filter;
document.ontouchstart = filter;


function deweave(val){
    var out = "";
    for (var i = 0; i < val.length+1; i += 5) {
        out += val.charAt(i-1);
    }
    return out;
}


function genit(length) {
    let ToRet = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789àáâãäåæāăąǎǟǡǻⱥƀḃƃḅḇç¢ćĉčÓóÒòŎŏÔôỐốỒồỖỗỔổǑQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789àáâãäåæāăąǒÖöȪȫŐőÕõṌṎȬȭȮȯȰȱØøǾǿǪǫǬǭŌōṒṓṐṑỎỏȌȍȎȏƠỚớỜờỠỡỞởỢợỌộƟƆȣⱺᴏｏŒœᴔŹźẐẑŽžŻżẒẓẔẕƵƶȤȥⱫⱬᵶᶎʐʑᴢƷʒƸƹÝýƟɵƆɔȢȣⱺᴏＯｏȿꜱƩʃＳｓŒœᴔỲỳŶŷẙŸÿỸỹẎẏȲȳỶỷỴỵɎɏƳƴʏｙ';
    let counter = 0;
    while (counter < length) {
      ToRet += characters.charAt(Math.floor(Math.random() * characters.length));
      counter++;
    }
    return ToRet;
}


//dummy report for error detecting debugging.
//REPORTHANDLER("KCAK 160051Z 29013G25KT 10SM SCT033 BKN043 02/M05 A2996 RMK AO2 PK WND 28034/0034 SLP158 T00171050", "CWOCHECK");
function REPORTHANDLER(rpt, job) {
    //custom error detection
    let METXMIT = false, MAXTCUCB = 999999100, DSNTRMKS = false;

    var ErrorType = "";
    let CBINSKYCOND = false, TSPRESENT = false, PWXWITHTS = false, TSREMARKS = "";
    let TimeSlot, LikelyMetar = false; //will be the hour, in 24 hour format, that this is zulu. If it's past 46 minutes past the hour, LikelyMetar will be true. LikelyMetar will be used to make sure routine items are in report, but not in SPECI
    //BEGINNING OF REPORT PARSING
    var rptsplt = rpt.split(" ");
    if(rptsplt[0] == "METAR" || rptsplt[0] == "SPECI"){ rptsplt.shift(); }
    rptsplt = rptsplt.join(" ");
    //above code removes the METAR or SPECI from beginning of report so that we can get the stn identifier.
    let[t,o] = rptsplt.substr(4).split("RMK");
    o == null && (o = "");
    var station = rptsplt.substr(0, 4);
    var time = rptsplt.substr(5, 7);
    var stationType;
    var correction = !1;
    var auto = !1;
    t.includes(" COR ") && (correction = !0);
    t.includes(" AUTO ") && (auto = !0);
    var clouds = [];

    //sets custom error detection variables if this station has custom error detection settings
    let custErrDet, found = false;
    if(localStorage.getItem("WOAAERCUSTOM") != null){
        for(var custkey of JSON.parse(localStorage.getItem("WOAAERCUSTOM"))){
            if(custkey[0] == station){
                if(custkey.length > 2){
                    METXMIT = custkey[2];
                }
                MAXTCUCB = +custkey[1][0];
                DSNTRMKS = custkey[1][1][0];
                custErrDet = custkey[1];
                found = true;
            }
        }
    }
    if(!found){
        custErrDet = ["999999100",["false",""],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"],["true","checked"]];
    }
    for (let e of t.matchAll(/(SKC|CLR|(?:FEW|SCT|BKN|OVC|VV)(?:\d{3}|\/\/\/)(?:CBMAM|TCU|CB)?)/g)){
        clouds.push(e[0].trim());
    }
    let n, s;
    //just a little sidenote the AWC programmers RegEx game is off it took them like 6x the characters to get the vis which... I just.. offset by this comment....
    var vis = t.match(/\b(?:M1\/4SM|\d{2}SM|[0-9]SM|[1-9]\/[1-9]SM|[0-9] [1-9]\/[1-9]SM|1\/16SM)/m);
    let SFCVIS = o.match(/SFC VIS/gm) ? true : false;
    let modifier = t.match(/(AUTO|COR)/g); //potentially remove AUTO later or have it nullify the AUTO if the show station type setting is activated.
    //now it's time to get present wx
    var pwx = [];
    for(let j of t.matchAll(/(?:\+|-| VC|MI|BC|DR|BL|SH|TS|FZ|PR|DZ|RA|SN|SG|IC|PL|GR|GS|UP|BR|FG|FU|DU|SA|HZ|PY|VA|PO|SQ|FC|SS|DS)+/gm)){
        pwx.push(j.toString());
    }
    if(pwx.length > 0){ console.log(station + ": " + pwx); }
    var TGroup = o.match(/T\d{8}/m) ? o.match(/T\d{8}/m) : undefined; //eventually will check for errors in the T group
    var pBETIMES = ""; //quick regex i wrote at 4am /(?:(TORNADO |TS|FZ|PR|DZ|RA|SN|SG|IC|PL|GR|GS|UP|BR|FG|FU|DU|SA|HZ|PY|VA|PO|SQ|FC|SS|DS)(E|B)(\d{4}|\d{2}|MM))/gm
    var wind = t.match(/(?:(?:\d{2})0[0-9]?(?:\d{2})G[0-9]?(?:\d{2})KT (?:\d{2})0V(?:\d{2})0|(?:\d{2})0[0-9]?(?:\d{2})KT (?:\d{2})0V(?:\d{2})0|(?:\d{2})0[0-9]?(?:\d{2})G[0-9]?(?:\d{2})KT|[0-3][0-9]0[0-9]?(?:\d{2})KT|VRB0[0-9]G\d{2}KT|VRB0[0-9]KT|VRB\d{2}G\d{2}KT|VRB\d{2}KT)/gm);
    var altimeter = rpt.match(/ A\d{4}/m); //as PAVD has displayed, the altimeter sometimes may be entered in the remarks. Therefore, the altimeter is searched for in the entire report
    altimeter = altimeter == null ? null : parseInt(altimeter.toString().substr(2));
    //little dev note because i'll forget otherwise but add (B[0-9][0-9](?:[0-9][0-9])?|E[0-9][0-9](?:[0-9][0-9])?) to end of the precip identifier in order to find begin/end times
    //when checking for errors try out the easy stuff first by searching for things that are definite errors, such as VCTS, -FC, -/+BLSN/DU/SA, -SS/-DS, or UP using regex
    var rmk = o;
    //don't mind how disorganized this code is, it'll be reorganized later.
    var ASOSVERSION;
    let PGroup = o.match(/P\d{4}/m) != null ? o.match(/P\d{4}/m) : undefined;
    let FourGroup = o.match(/(?: 4\/\d{3} )/gm) != null ? o.match(/(?: 4\/\d{3} )/gm) : undefined;
    let FourGTimes = [6, 12, 18, 24];
    let NineThreeThreeGroup = o.match(/(?:933\d{3})/gm) != null ? o.match(/(?:933\d{3})/gm) : undefined;
    let Hour = Math.ceil(parseInt((time.substr(2,4)))/100);
    console.log(Hour);
    if(o.match(/AO(?:1|2)/m)){ ASOSVERSION = o.match(/AO(?:1|2)/m).toString().substr(2); } //if AO1 then no active precip with P group and no end time is error. Throws err if no AO1/2 detected.
    if(CWOSTNS.includes(station)){ stationType = "CWO"; }
    stationType != "CWO" && auto == 0 ? stationType = "ATC" : auto == 1 ? stationType = "AUTO" : stationType;
    if(station == "KMWN"){ stationType = "VOLUNTEER"; }

    var TempDP = t.match(/ (?:M?\d{2}\/(M?\d{2})?)/m);
    if(TempDP != null){ TempDP = TempDP[0].toString().substr(1); }
    //now we determine what part of the report the person wants, if they just want one part of the report
    switch(job){
        case "TempDP":
            return TempDP; //you wouldn't figure you'd need break after return
        default:
            break;
    }
    //END OF REPORT PARSING

    //console.log(`Station Type: ${stationType}, Stn${station}, Time: ${time}, correction ${correction}, auto ${auto}, wind ${wind}, vis ${vis}, clouds ${clouds}, Temp/Dew Point ${TempDP}, Altimeter: ${altimeter}, rmks ${rmk}`);

    //BEGINNING OF ERROR DETECTION
    var errors = [];

    if(station != "KMWN"){
        //BEGINNING OF ALTIMETER ERROR DETECTION
        if(job == "CheckRPT"){ErrorType = `/ALT/`; }
        if(altimeter == null && (WOAAER[0][0] == "true" || custErrDet[2][0] == "true")){
            errors.push(ErrorType + "No valid altimeter entry detected.");
        }
        else if(WOAAER[0][0] == "true" || (custErrDet[3][0] == "true" || custErrDet[4][0] == "true")){
            if(altimeter < 2569 && custErrDet[3][0] == "true"){ errors.push(ErrorType + "Extremely low & unlikely altimeter entry."); }
            if(altimeter > 3201 && custErrDet[4][0] == "true"){ errors.push(ErrorType + "Extremely high & unlikely altimeter entry.") };
        }
        //END OF ALTIMETER ERROR DETECTION
        //BEGINNING OF WIND ERROR DETECTION
        if(wind == null && (WOAAER[3][0] == "true" || custErrDet[5][0] == "true")){
            if(job == "CheckRPT"){ErrorType = `/WND/`; }
            errors.push(ErrorType + "Missing or invalid wind section.");
        } else if(WOAAER[3][0] == "true" || (custErrDet[6][0] == "true" || custErrDet[7][0] == "true" || custErrDet[8][0] == "true" || custErrDet[9][0] == "true" || custErrDet[10][0] == "true")){
            var wStr = wind[0];
            var wDir = wStr.substr(0, 3);
            var wVar = wStr.match(/(?:\d{3}V\d{3})/gm);
            if(wVar == undefined){ wVar = "N/A"; }
            var wSpeedIncludingGusts = wStr.split(" ")[0].substr(3).match(/(?:[0-9]?\d{2}([0-9]\d{2})?)/gm);
            var wSpeed = parseInt(wSpeedIncludingGusts[0]), wGusts = parseInt(wSpeedIncludingGusts[1]);
            //console.log(`Wind String: ${wStr}, Wind Direction: ${wDir}, Wind Variability: ${wVar}, Wind Speed & Gusts, if present: ${wSpeedIncludingGusts}, Wind Speed: ${wSpeed}, Wind Gusts: ${wGusts}`);
            //unfortunately I can't immediately think of anything better than a bunch of if statements. So, here it goes!
            if(job == "CheckRPT"){ErrorType = `/WNDGUST/`; }
            if(wGusts <= wSpeed && custErrDet[6][0] == "true"){ errors.push(ErrorType + "Gusts are lower than or equal to wind speed."); }
            if(wSpeed == 0 && wDir == "000" && wGusts & custErrDet[7][0] == "true"){ errors.push(ErrorType + "Calm winds cannot gust."); }
            if(job == "CheckRPT"){ErrorType = `/WNDSPEED/`; }
            // if(wSpeed < 3 && wDir != "000"){ errors.push(ErrorType + "Wind speed too low."); }
            if(wSpeed == 0 && wDir != "000" && custErrDet[8][0] == "true"){ errors.push(ErrorType + "Calm winds may not have a direction."); }
            if(job == "CheckRPT"){ErrorType = `/WNDDIR/`; }
            if(wDir == "VRB" && wSpeed > 6 && custErrDet[9][0] == "true"){ errors.push(ErrorType + "VRB with a wind speed over 6KT is invalid."); }
            if(wDir != "VRB" && wSpeed < 7 && wVar != "N/A" && !wGusts && custErrDet[10][0] == "true"){ errors.push(ErrorType + `Variable wind speed below 7KT must contain VRB, and may not be appended by ${wVar}`); }
        }
        //END OF WIND ERROR DETECTION
        //BEGINNING OF VISIBILITY ERROR DETECTION
        var visVAL; //will be referenced for wx error checking..
        if(job == "CheckRPT"){ErrorType = `/VIS/`; }
        if(vis == null && custErrDet[11][0] == "true"){ errors.push(ErrorType + "Missing or invalid visibility section."); } else{
            visVAL = vis[0].substr(0, vis[0].length - 2);
            //VIS WIP
            var validVisiblityValues = [
                "M1/4",
                "2",
                "9",
                "0",
                "5/8",
                "1 5/8",
                "4",
                "12",
                "1/4",
                "2 1/2",
                "10",
                "1/16",
                "3/4",
                "1 3/4",
                "5",
                "13",
                "1/2",
                "3",
                "1/8",
                "7/8",
                "1 7/8",
                "6",
                "14",
                "3/4",
                "4",
                "3/16",
                "1",
                "2",
                "7",
                "15",
                "1",
                "5",
                "1/4",
                "1 1/8",
                "2 1/4",
                "8",
                "20",
                "1 1/4",
                "6",
                "5/16",
                "1 1/4",
                "2 1/2",
                "9",
                "25",
                "1 1/2",
                "7",
                "3/8",
                "1 3/8",
                "2 3/4",
                "10",
                "30",
                "1 3/4",
                "8",
                "1/2",
                "1 1/2",
                "3",
                "11",
                "35",
                "40",
                "45",
                "50",
                "55",
                "60",
                "65",
                "70",
                "75",
                "80",
                "85",
                "90",
                "95",
                "100",
                "105",
                "110"
            ];
            if(!validVisiblityValues.includes(visVAL) && custErrDet[12][0] == "true"){ errors.push(ErrorType + `Invalid visibility value.`); }
            if(visVAL.startsWith("M")){ visVAL = visVAL.substr(1); }
            visVAL = VIStoNUM(visVAL);
        }
        //END OF VISIBILITY ERROR DETECTION
        //BEGINNING OF SKY CONDITION ERROR DETECTION
        if(job == "CheckRPT"){ErrorType = `/SKY/`; }
        var ClrCount = 0, FewCount = 0, SctCount = 0, BknCount = 0, OvcCount = 0, VvCount = 0;
        let heights = [];
        if(clouds == "" && custErrDet[13][0] == "true"){ errors.push(ErrorType + "Missing or invalid sky condition"); } else{
            //check for sky cond errors.
            var SQNC = [];
            for(var g in clouds){
                SQNC.push(clouds[g]);
                var SkyVars = parseSkyCond(clouds[g]);
                var MaxSCH = MAXTCUCB / 100, CurHeight = +SkyVars[1];
                heights.push(SkyVars[1]);
                if(job == "CheckRPT"){ErrorType = `/SKYSIG/`; }
                if(MaxSCH < CurHeight && SkyVars[2] != "" && station == HomeSTN){ errors.push(ErrorType + "Layer containing significant cloud is too high."); }
                if((SkyVars[0] == "OVC" || "VV") && SkyVars[1] == "TCU" && custErrDet[14][0] == "true"){ errors.push(ErrorType + `${SkyVars[0]} with TCU is not permitted.`); }
                if(SkyVars[0] == "VV" && SkyVars[1].includes("CB") && custErrDet[15][0] == "true"){ errors.push(ErrorType + `VV with ${SkyVars[1]} is not permitted.`); }
                if(job == "CheckRPT"){ErrorType = `/SKYHEIGHT/`; }
                if(CurHeight > 50 && CurHeight < 100 && (CurHeight.toString().charAt(1) != "5" && CurHeight.toString().charAt(1) != "0") && custErrDet[16][0] == "true"){ errors.push(ErrorType + `${SkyVars[0]}${SkyVars[1]} cannot end with "${CurHeight.toString().charAt(1)}". Must be "0" or "5".`); }
                if(CurHeight > 100 && (CurHeight.toString().charAt(2) != "0") && custErrDet[17][0] == "true"){ errors.push(ErrorType + `${SkyVars[0]}${SkyVars[1]} ends in "${CurHeight.toString().charAt(2)}" instead of "0".`); }
                var PriorClouds;
                if(clouds.length > 1 && g != 0){PriorClouds = parseSkyCond(SQNC[g-1]); }
                else{
                    PriorClouds = false;
                }
                if(job == "CheckRPT"){ErrorType = `/SKY/`; }
                if(PriorClouds){
                    let PriorOrder, CurOrder;
                    let order = [ "CLR", "FEW", "SCT", "BKN", "OVC", "VV"];
                    let orderBBLO = [ "OVC", "BKN", "SCT", "FEW"];
                    var OrderToFollow;
                    +PriorClouds[1] != -100 ? OrderToFollow = order : OrderToFollow = orderBBLO; //Basically just to make this compatible with mountain stations
                    for(var y in OrderToFollow){
                        if(PriorClouds[0] == OrderToFollow[y]) {PriorOrder = y; }
                        +SkyVars[1] != -100 ? OrderToFollow = order : OrderToFollow = orderBBLO;
                        if(SkyVars[0] == OrderToFollow[y]){ CurOrder = y; }
                        if(PriorOrder > CurOrder && PriorOrder < 4 && custErrDet[18][0] == "true"){ errors.push(`${ErrorType}Incorrect order of sky cover.`); }
                    }
                    if(PriorOrder == 0 && custErrDet[19][0] == "true"){ errors.push(ErrorType + "CLR is not alone in sky condition."); }
                    if(PriorOrder > 3 && custErrDet[20][0] == "true"){ errors.push(ErrorType + "Layer beyond OVC or VV"); }
                    if(+PriorClouds[1] > +SkyVars[1] && custErrDet[21][0] == "true"){ errors.push(ErrorType + "Layer height in descending order."); }
                }
                switch(SkyVars[0]){
                    case "CLR":
                        ClrCount++;
                        break;
                    case "FEW":
                        FewCount++;
                        break;
                    case "SCT":
                        SctCount++;
                        break;
                    case "BKN":
                        BknCount++;
                        break;
                    case "OVC":
                        OvcCount++;
                        break;
                    case "VV":
                        VvCount++;
                        break;
                    default:
                        console.log("Failed to capture sky cover classification.");
                }
            }
            if(VvCount > 1 && custErrDet[22][0] == "true"){ errors.push("More than 1 VV layer."); }
            if(OvcCount > 1 && custErrDet[23][0] == "true"){ errors.push("More than 1 OVC layer."); }
            if(ClrCount > 1 && custErrDet[24][0] == "true"){ errors.push("More than 1 CLR."); }
            if(VvCount > 1 && OvcCount > 1 && custErrDet[25][0] == "true"){ errors.push("OVC and VV may not be in the same report."); }
            if(clouds.length > 6 && custErrDet[26][0] == "true"){ errors.push("More than 6 layers in report."); }
            if(hasDuplicates(heights) && custErrDet[27][0] == "true"){ errors.push("2(+) layers with same height."); }
        }
        //END OF SKY CONDITION ERROR DETECTION
        //BEGINNING OF TEMP/DP ERROR DETECTION
        if(job == "CheckRPT"){ErrorType = `/TEMP/`; }
        if(TempDP == null && custErrDet[28][0] == "true"){ errors.push(ErrorType + "No Temperature detected."); } else{
            var tDP = TempDP.split("/");
            var temp = parseTDP(tDP[0]), dp = parseTDP(tDP[1]);
            //console.log(`Temp: ${temp}, DP: ${dp}`);
            if(WOAAER[1][0] == "true" && (custErrDet[29][0] == "true" || custErrDet[30][0] == "true") && station == HomeSTN){
                if(temp > 57 && custErrDet[29][0] == "true"){ errors.push(ErrorType + "Extremely High Temp."); }
                if(temp < -90 && custErrDet[30][0] == "true"){ errors.push(ErrorType + "Extremely Low Temp."); }
            }
            if(job == "CheckRPT"){ErrorType = `/DEW/`; }
            if(dp > temp && dp){ errors.push(ErrorType + "Dew Point is greater than Temperature."); }
            if(WOAAER[2][0] == "true" && (custErrDet[31][0] == "true" || custErrDet[32][0] == "true") && station == HomeSTN){
                if(dp > 35 && custErrDet[31][0] == "true"){ errors.push(ErrorType + "Extremely High Dew Point."); }
                if(dp < -90 && custErrDet[32][0] == "true"){ errors.push(ErrorType + "Extremely Low Dew Point."); }
            }
        }
        //END OF TEMP/DP ERROR DETECTION
        //BEGINNING OF PRECIP/PRES WX ERROR DETECTION
        if(job == "CheckRPT"){ErrorType = `/PRESWX/`; }
        if(t.includes("RN") && !t.includes("RVRNO") && !station.includes("RN")){ errors.push(ErrorType + "RN is not a valid contraction."); } //i saw this on the forums so just had to include it..
        if(t.includes("TS") && !auto){
            //check for TS remarks
        }
        let NoReasonForLowVis = false;
        var ReconstructedPWX = ReconstructPWX(pwx);
        console.log(pwx);
        console.log(visVAL);
        if(visVAL < 7){ NoReasonForLowVis = getVisReasns(pwx, visVAL); }
        if(!SFCVIS)
        {
            if(pwx.includes("BR") && visVAL < .75) { errors.push(ErrorType + "Experimental - BR detected with vis < 5/8SM."); }
            if(pwx.includes("BLSA") && visVAL < .625) { errors.push(ErrorType + "Experimental - BLSA detected with vis < 5/8SM."); }
            if(pwx.includes("BLDU") && visVAL < .625) { errors.push(ErrorType + "Experimental - BLDU detected with vis < 5/8SM."); }
        }
        if(pwx.includes("FG") && visVAL > .75 && !pwx.includes("MIFG") && !pwx.includes("BRFG")) { errors.push(ErrorType + "Experimental - FG detected with vis > 5/8SM."); }
        if(pwx.includes("BR") && visVAL > 6) { errors.push(ErrorType + "Experimental - BR detected with vis > 6SM."); }
        if(pwx.includes("HZ") && visVAL > 6) { errors.push(ErrorType + "Experimental - HZ detected with vis > 6SM."); }
        if(pwx.includes("BLSN") && visVAL > 6) { errors.push(ErrorType + "Experimental - BLSN detected with vis > 6SM."); }
        if(pwx.includes("BLPY") && visVAL > 6) { errors.push(ErrorType + "Experimental - BLPY detected with vis > 6SM."); }
        if(pwx.includes("BLSA") && visVAL > 6) { errors.push(ErrorType + "Experimental - BLSA detected with vis > 6SM."); }
        if(pwx.includes("BLDU") && visVAL > 6) { errors.push(ErrorType + "Experimental - BLDU detected with vis > 6SM."); }
        if(pwx.includes("SS") && visVAL > .625) { errors.push(ErrorType + "Experimental - SS detected with vis > 5/8SM."); }
        if(pwx.includes("DS") && visVAL > .625) { errors.push(ErrorType + "Experimental - DS detected with vis > 5/8SM."); }
        if(pwx.includes("UP")){ errors.push(ErrorType + "Experimental - Unknown Precipitation has been detected and is unacceptable."); }
        //END OF PRECIP ERROR DETECTION
        //BEGINNING OF REMARKS ERROR DETECTION
        if(job == "CheckRPT"){ErrorType = `/RMKS/`; }
        var TSBETIMES = o.matchAll();
        if(o.includes("BINOVC") && OvcCount == 0 && custErrDet[33][0] == "true"){ errors.push(ErrorType + "BINOVC with no OVC layer.") }
        var captureDSNT = [];
        for(let jk of o.matchAll(/DSNT/gm)){
            captureDSNT.push(jk[0].trim());
        }
        if(captureDSNT.length > 0 && visVAL < 3 && HomeSTN == station && DSNTRMKS == "true"){
            if(captureDSNT.length > 1 && o.includes("LTG DSNT")) { errors.push(ErrorType + "Manually entered DSNT with vis less than 3SM."); }
            else if(!o.includes("LTG DSNT")){ errors.push(ErrorType + "Manually entered DSNT with vis less than 3SM."); }
        } //slightly more complicated due to ALDARS
        let VariableSkyCond = o.match(/(FEW|SCT|BKN|OVC)(\d{3})? V (FEW|SCT|BKN|OVC)/gm);
        if(VariableSkyCond != null){
            //checks for errors with variable sky cond. Checks if the layer is present, if the layer variability is valid, and if the digits need to be specified or don't need to be specified.
            let VariableLayer = VariableSkyCond[0].split(" ")[0];
            let ContainsNumbers, VLClass = VariableLayer.substr(0,3), VL2Class = VariableSkyCond[0].split(" ")[2];
            VariableLayer[0].match(/\d{3}/gm) ? ContainsNumbers = true : ContainsNumbers = false;
            if(!clouds.includes(VariableLayer) && ContainsNumbers && custErrDet[34][0] == "true"){ errors.push(ErrorType + `Layer ${VariableLayer} specified in variable sky condition remarks not present in sky condition.`); }
            if(VLClass == VL2Class && custErrDet[35][0] == "true"){ errors.push(ErrorType + `${VLClass} cannot be variable with ${VL2Class}`); }
        }
        if(FourGroup && !FourGTimes.includes(Hour)){ errors.push(ErrorType + "Experimental - 4/sss group at incorrect time."); }
        var FourGValue = FourGroup ? parseInt(FourGroup.toString().substr(3,3)) : undefined;
        if(FourGValue == 0){ errors.push(ErrorType + "Experimental - 4/sss group contains '0' value, which is invalid."); }
        if(NineThreeThreeGroup && !FourGroup){ errors.push(ErrorType + "Experimental - 933RRR group detected but no 4/sss group has been detected."); }
        if(NineThreeThreeGroup && FourGValue < 2){ errors.push(ErrorType + "Experimental - 933RRR group may not be included with less than 2 inches of snow on the ground.") }
        if(NineThreeThreeGroup && Hour != 18){ errors.push(ErrorType + "Experimental - 933RRR group included at wrong time."); }
        //END OF REMARKS ERROR DETECTION
        //BEGINNING OF HOME STATION ERROR DETECTION
        if(station == HomeSTN){
            //see if there is drastic drop in temp/dew point
            //see if there's 933 or 4 group and if the times are correct and the formatting is correct
            //search for precip that ended but no end time, or precip that just began this hour with no begin time
            //invalid ts remarks error detection
        }
        //END OF ALL ERROR DETECTION
    }

    //FINISHING TOUCHES/ERROR FORMATTING
    errors = ImproveErrors(errors);
    //if(errors.length > 0){ console.log(errors); }
    if(job == "history"){
        return errors;
    }
    if(job == "Formulate"){
        //this formulates the report for the report searching. shows red if error is present.
        var FormattedReport = station;
        for(var jki in WOAASETPR){
            switch(jki){
                case "0":
                    if(WOAASETPR[jki][0] == "true"){ FormattedReport = stationType + " " + station; }
                    break;
                case "1":
                    if(WOAASETPR[jki][0] == "true" && time){ FormattedReport += " " + time; }
                    break;
                case "2":
                    if(WOAASETPR[jki][0] == "true" && modifier && (modifier != "AUTO" || WOAASETPR[0][0] != "true")){ FormattedReport += " " + modifier; }
                    break;
                case "3":
                    if(WOAASETPR[jki][0] == "true" && wind){ FormattedReport += " " + wind; }
                    break;
                case "4":
                    if(WOAASETPR[jki][0] == "true" && vis){ FormattedReport += " " + vis; }
                    break;
                case "5":
                    if(WOAASETPR[jki][0] == "true" && pwx){ FormattedReport += " " + pwx.join(" "); }
                    break;
                case "6":
                    if(WOAASETPR[jki][0] == "true" && clouds){ FormattedReport += " " + clouds.join(" "); }
                    break;
                case "7":
                    if(WOAASETPR[jki][0] == "true" && TempDP){ FormattedReport += " " + TempDP; }
                    break;
                case "8":
                    if(WOAASETPR[jki][0] == "true" && altimeter){ FormattedReport += " A" + altimeter; }
                    break;
                case "9":
                    if(WOAASETPR[jki][0] == "true" && rmk){ FormattedReport += " RMK " + rmk; }
                    break;
                default:
                    break;
            }
        }
        return `${station}]${time}]${FormattedReport.replaceAll("  ", " ")}]${errors}]${rpt}`;
    }
    if(errors != undefined && errors.length >= 1 && job == "rpt"){
        wAlert("ERROR(S) DETECTED.", `Report: ${station} ${time}. Error Count: ${errors.length}.`, `${errors.join("<br>")}`, rpt);
        return true;
    }
    if(job == "qc" && correction){ CORs++; }
    if(errors == ""){
        return;
    }
    else{
        var addSTN = (job == "CWOCHECK") ? station + " - " : "";
        for(var k in errors){
            errors[k] = addSTN + time + ": " + errors[k].toString();
        }
        return errors;
    }
}


//following function is from SO
function hasDuplicates(array) {
    var valuesSoFar = Object.create(null);
    for (var i = 0; i < array.length; ++i) {
        var value = array[i];
        if (value in valuesSoFar) {
            return true;
        }
        valuesSoFar[value] = true;
    }
    return false;
}


function ReconstructPWX(wx){
    //reconstructs present weather. For example, +TSRA will be entered into reconstructed array as "TS", "+RA"
    //so, we must differentiate entries by themselves(with intensity), such as: "RA", "-DZ", "BR"
    //and entries with a descriptor such as: "BLDU", "BLPY", "BLSN"
    //and entries that are combined such as: "TSRA", "TSRASN", "+RASN", "FZRASN"
}


function getVisReasns(pwx, visval){
    let validReasons = [ "BR", "FG", "RA", "SN", "DZ", "FZRA", "FZDZ", "VA", "DU", "SA", "FU", "PY", "HZ", "SS", "DS", "PO", "GR", "GS", "PL", "FC" ];
    //searches for anything permitting low vis, or for anything that may not be included with a vis over 7SM
    if(visval < 6){
        //searches for any valid reason for low vis
        let validReasons = [];
        for(var i in pwx){
            if(validReasons.includes(pwx[i])){
                return true;
            }
        }
        return false; //returns false if no valid reason for vis decrease was found
    }
    if(visval > 6){
        let invalidAt7P = [ "BR", "FG" ];
        //searches for things that shouldn't be present but are
        for(var o in pwx){
            if(invalidAt7P.includes(pwx[o])){
                return false;
            }
        }
        return true;
    }
}


function ImproveErrors(errs){
    let Improved = [];
    let temp = [];
    //cycles through the errors and basically just finds all the duplicate errors and combines them into 1 error with a (number) preceeding the errors, instead of numerous of the same errors.
    for(var i in errs){
        var Included = false;
        var curErr = errs[i];
        for(var o in temp){
            if(temp[o].includes(curErr)){
                temp[o] = `${temp[o]}:${curErr}`;
                Included = true;
            }
        }
        if(!Included){
            temp.push(curErr);
        }
    }
    for(var m in temp){
        var Split = temp[m].includes(":") ? temp[m].split(":") : temp[m];
        if(Array.isArray(Split)){
            Improved.push(`(${Split.length}) ${Split[m]}`);
        }else{
            Improved.push(Split);
        }
    }
    return Improved;
}


function parseSkyCond(entry){
    if(entry == "CLR"){ return ["CLR", "", ""]; }
    else{
        var Classification = entry.includes("VV") ? entry.substr(0,2) : entry.substr(0,3);
        var Height = entry.includes("VV") ? entry.substr(2,3) : entry.substr(3,3);
        if(Height == "///"){ Height = -100; }
        var SignificantClouds = entry.includes("VV") ? entry.substr(5) : entry.substr(6);
        return [Classification, Height, SignificantClouds];
    }
}


//haven't studied js much in years. Just testing out some little nifty tricks in the following functions to eventually implement across the whole script.
function parseTDP(val){
    //basically we just search for a M if there is one..
    if(val.startsWith("M")){ return +val.substr(1)*-1; } else{ return +val; }
}


function VIStoNUM(input){
    var firstNum;
    if(input.includes(" ")){
        var splt = input.split(" ");
        var spFra = splt[1].split("/"); //btw if you couldn't tell, I hate naming variables. No kidding, I name half my variables "joe" when I'm using the dev console. If I need another, "jane" suffices.
        return (+splt[0] + (+spFra[0]/+spFra[1]));
    }
    else if(input.includes("/")){
        var sptFr = input.split("/");
        return (+sptFr[0]/+sptFr[1]);
    }
    else{
        return +input;
    }
}


function wAlert(title, header, content, rpt){
    if(AlertActive){
        closeAlert();
        createAlert();
    }
    else{
        createAlert();
    }
    function createAlert(){
        if(WOAASETSE[1][0] == "true"){ audio.play(); }
        var style = `height: 190px; width: 520px; padding-top: 5px; padding-left: 15px; position: absolute; background-color: rgb(50 54 59); border: 2px #420D09 solid; border-radius: 15px; bottom: 15px; left: 10px;`;
        var node = document.createElement("div");
        node.setAttribute("id", "wAlert");
        node.style = style;
        node.style.zIndex = "120000";
        var heading;
        if(header != undefined) heading = `<h6 style="color: white;" title="${rpt}">${header}</h6>`;
        node.innerHTML = `<h5 style="color: white; text-align: center; font-weight: bold;">${title}</h5>${heading}<p style="color: white; overflow-wrap: break-word; overflow-y: scroll; height: 60px;">${content}</p>
        <button id="CloseAlert" style="background-color: transparent; border: 2px #800000 solid; bottom: 0; position: absolute; border-radius: 15px 15px 0px 0px; margin-left: 223px; color: white;">OKAY</button>`;
        document.getElementById("map").prepend(node); //<hr style="height: 5px; margin: 2px; margin-bottom: 6px; background-color: purple; width: 97%;"> if i want to add hr back in
        AlertActive = true;
        document.getElementById("CloseAlert").addEventListener("click", closeAlert);
    }
}


function closeAlert(){
    //remove the alert
    AlertActive = false;
    document.getElementById("wAlert").remove();
}


//Starts the program after all global variables initialize
Start();