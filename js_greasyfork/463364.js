// ==UserScript==
// @name         TimeCardDefaults
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script sets the default Kantime eChart selections when a chart is opened.
// @author       NateD
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463364/TimeCardDefaults.user.js
// @updateURL https://update.greasyfork.org/scripts/463364/TimeCardDefaults.meta.js
// ==/UserScript==

//NOTES
//This script sets the defaults of a Kantime eChart.

//USER FUNCTION TO RETURN TIME FROM SCRIPT STRING
function returnTime(arrStrings, strSearch){
    for (var k = 0; k < arrStrings.length; k++){
        var strScript = arrStrings[k].outerHTML;
        if (strScript.includes(strSearch)){
            var strIndex = strScript.indexOf(strSearch);
            var subString = strScript.substring(strIndex, strIndex + 25);
            var arrWords = subString.split(" ");
            for (var m = 0; m < arrWords.length; m++){
                if (arrWords[m].includes("'")){
                    var timeOut = arrWords[m].replace(/'/g,'');
                    timeOut = timeOut.replace(";",'');
                    break
                }
            }
            break
        }
    }

    return timeOut;
}

//USER FUNCTION RANDOM NUMBER
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

//DEFAULT FUNCTION
function funcTimeCardDefaults() {

    //CHECK IF MONITORING IS REQUIRED
    var spans = document.getElementsByTagName('span');
    for (var i=0;i<spans.length;i++) {
        if (spans[i].innerHTML == "HMA Monitoring"){
            var boolMonitor = true;
        }
    }

    //LOOP THROUGH ALL CHECKBOXES
    var aa = document.querySelectorAll("input[type=checkbox]");
	var varID = 0;
    for (var j = 0; j < aa.length; j++){
        //INCIDENT REPORT
        if (aa[j].id =="chklst_IncidentReported_1"){
            aa[j].checked = true;
        }
        //PATIENT ID
        if (aa[j].id =="chklst_PatientIdentification_0" || aa[j].id =="chklst_PatientIdentification_1" ){
            aa[j].checked = true;
        }
        //VITALS CHECK
        if (aa[j].id =="chkVitalsNA"){
            if (boolMonitor != true){
                aa[j].checked = true;
            } else {
                document.getElementById("txtPulse").value = getRandomInt(100,135);
                document.getElementById("txtO2Sat").value = getRandomInt(92,100);
            }
        }
        //PERFORMED CHECKS
        if (aa[j].id =="~/UI/VisitNotes/UserControls/PASVisitNote.ascx_userControl_rptrListServicePlan_chkPerformedByP_ID_" + varID){
            aa[j].checked = true;
            varID += 1;
        }
        //INCIDENT REPORT
        if (aa[j].id =="Chk_Signature"){
            aa[j].checked = true;
        }
    }

    //FIND SCHEDULED START/END TIME FROM SCRIPTS
    var scripts = document.getElementsByTagName("script");

    var timeCheckIn = returnTime(scripts,"PlannedStartTime =");
    var timeCheckOut = returnTime(scripts,"PlannedEndTime =");

    document.getElementById("txt_StartDOCChkin").value = timeCheckIn;
    document.getElementById("txt_checkouttime").value = timeCheckOut;
}

//SET DEFAULTS
funcTimeCardDefaults();